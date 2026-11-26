#!/usr/bin/env python3
"""Build Exam 4 (small-animal thorax: lungs, heart, vessels, pleura, mediastinum, esophagus,
trachea, diaphragm, body wall) radiology cases from the owner's annotated lecture PDFs.

Rules (same as Exam 2 / Exam 3):
- Student images are the clean embedded rasters (the handwritten notes are a separate ink layer).
- The annotated slide is rendered as a hidden "Annotated teaching key" view (shown only after answering).
- Owner confirmed (2026-11-25) that handwritten slide notes are the professor's in-class statements,
  so they are quoted as "Professor's notes". Typed slide text is quoted as "Slide". Anything Claude
  added (not said or written by the professor) is labelled "Added:".
- Textbook figures come from the owner's Labeled_rads compilation (textbook use permitted by LMU for
  this non-commercial study game). They are shown only after answering because their legends name
  the diagnosis.
- Patient / owner names burned into a few radiographs are masked.
Outputs images + manifest into the repo and cases (ids "exam4-*") into diagnostic-imaging-published.json.
"""
import json, os, subprocess, sys, hashlib, shutil, glob
from PIL import Image, ImageDraw

REPO = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/vet-pharm-quest-'
RAWD = '/home/claude/pack4/raw'
U = '/mnt/user-data/uploads/'
G = 'Dr. Lynn Griffin, DVM MS DACVR DACVR(RO) · LMU CVM 743'
SRC = {
 'L1': ('dc4b2e17-L1PulmonaryPatterns.pdf', 'L1 · Principles of Thoracic Evaluation & Pulmonary Patterns', 'L1 Pulmonary patterns'),
 'L2': ('82acae2c-L2-InterstitialandAlveolar.pdf', 'L2 · Interstitial & Alveolar Patterns', 'L2 Interstitial & alveolar'),
 'L3': ('L3_-Cases.pdf', 'L3 · Pulmonary Pattern Cases', 'L3 Cases'),
 'L45': ('18a9a98a-L42C5HaveaHeartCardiacRadiologyPartI.pdf', 'L4–5 · Have a Heart: Cardiac Radiology', 'L4–5 Cardiac'),
 'L6': ('dd861f14-L6-Therestofthethoraciccavity.pdf', 'L6 · The (Rest of the) Thoracic Cavity, Part 1', 'L6 Thoracic cavity'),
 'L7': ('88d34f5c-L7-TherestofthethoraciccavityPart2.pdf', 'L7 · The (Rest of the) Thoracic Cavity, Part 2', 'L7 Thoracic cavity'),
 'L8': ('L8_Thorax_putting_it_all_together__282_29.pdf', 'L8 · Thorax: Putting It All Together', 'L8 Putting it all together'),
 'BAS': ('98f9a6bc-BasicsofTakingGoodThoracicRadiographs.pdf', 'Basics of Taking Good Thoracic Radiographs', 'Basics'),
 'ANAT': ('Radiographic_Anatomy_of_the_Thorax_Fa26.pdf', 'Radiographic Anatomy of the Thorax', 'Thorax anatomy'),
 'LAB': ('Labeled_rads_.pdf', 'Labeled radiographs (owner\'s textbook compilation)', 'Textbook'),
}
RAW_URL = 'https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/'
IMGDIR = 'radiology-course-photos/exam4'
UPDATED = '2026-11-26T18:00:00Z'
SECTIONS = {
 'final': 'Start here · L8 putting it all together',
 'patterns': 'Lung patterns · bronchial, interstitial, alveolar',
 'mimics': 'Technique & look-alikes · artifacts, atelectasis, nodule mimics',
 'lung': 'Lung cases · signalment and history matter',
 'heart': 'Heart & vessels · chambers, failure, acquired & congenital disease',
 'cavity': 'Pleura, mediastinum, esophagus, trachea, diaphragm & ribs',
 'cases': 'Numbered lecture cases (L6–L7)',
}
# Textbook figures (owner's Labeled_rads compilation, page 8–9 rasters) -> (page, image number, crop)
TB = {
 '1.36': (8, 175, (0, 0, 1, .5), 'Textbook Fig. 1.36 · pulmonary nodule vs body-wall nodule (orthogonal view)'),
 '1.37': (8, 175, (0, .5, 1, 1), 'Textbook Fig. 1.37 · recumbency atelectasis vs pneumonia (repeat after repositioning)'),
 '1.38': (8, 174, None, 'Textbook Fig. 1.38 · skin folds (not pneumothorax)'),
 '1.39': (8, 176, None, 'Textbook Fig. 1.39 · nipple vs pulmonary nodule (barium on nipples)'),
 'thymoma': (8, 177, None, 'Textbook figure · cranial mediastinal mass (thymoma) with megaoesophagus'),
 '7.15': (9, 187, None, 'Textbook Fig. 7.15 · the five thoracic compartments'),
 '7.17': (9, 189, None, 'Textbook Fig. 7.17 · left heart enlargement: PDA (a) vs SAS (b)'),
}
# Extra slides rendered for the lung-pattern guide (radiology-lung-pattern-guide.js)
GUIDE = [('BAS', 7), ('BAS', 8), ('BAS', 10), ('BAS', 11), ('BAS', 25), ('BAS', 28), ('BAS', 29), ('BAS', 30), ('BAS', 31), ('BAS', 34), ('BAS', 37), ('BAS', 38),
         ('ANAT', 16), ('ANAT', 20), ('ANAT', 25), ('ANAT', 29), ('ANAT', 33), ('ANAT', 34), ('ANAT', 35), ('L2', 20), ('L2', 21), ('L2', 30), ('L2', 32), ('L45', 47), ('L45', 49), ('L1', 43), ('L1', 44), ('L2', 15), ('L2', 81), ('L2', 91), ('L2', 94), ('L3', 23), ('L3', 34), ('L3', 35), ('L3', 18)]
# Films for the skill drills in radiology-exam4-lungs.js (neutral file names; answers live in the JS)
SKILL = [('BAS', 7, 83, 'view-01'), ('BAS', 7, 84, 'view-02'), ('BAS', 8, 98, 'view-03'), ('BAS', 10, 125, 'view-04'),
         ('BAS', 10, 126, 'view-05'), ('BAS', 11, 138, 'view-06'), ('BAS', 11, 139, 'view-07'), ('ANAT', 16, 18, 'view-08'),
         ('ANAT', 16, 21, 'view-09'), ('BAS', 28, 379, 'view-10'), ('BAS', 28, 380, 'view-11'),
         ('BAS', 29, 392, 'lobe-01a'), ('BAS', 29, 393, 'lobe-01b'), ('BAS', 29, 394, 'lobe-01c'),
         ('BAS', 34, 455, 'lobe-02a'), ('BAS', 34, 456, 'lobe-02b'), ('BAS', 34, 457, 'lobe-02c')]
SKILL_SRC = {'BAS': ('98f9a6bc-BasicsofTakingGoodThoracicRadiographs.pdf', 'Basics of Taking Good Thoracic Radiographs'),
             'ANAT': ('Radiographic_Anatomy_of_the_Thorax_Fa26.pdf', 'Radiographic Anatomy of the Thorax')}
# Burned-in patient/owner names or labels to cover: (src, page, num) -> list of fractional boxes
MASK = {
 ('L8', 32, 33): [(0, 0, .32, .045), (0, .87, .3, 1)],
 ('L8', 31, 32): [(0, 0, .3, .06)],
 ('L8', 35, 36): [(0, .93, .5, 1)],
 ('L8', 36, 37): [(0, .93, .7, 1)],
 ('L8', 30, 31): [(0, .95, .7, 1)],
 ('L3', 46, 489): [(0, 0, 1, .04)],
 ('L2', 48, 601): [(0, 0, .3, .14), (.8, 0, 1, .1), (0, .9, 1, 1)],
 ('L2', 48, 604): [(0, 0, .3, .14), (.8, 0, 1, .1), (0, .9, 1, 1)],
}
# Slide screenshots with the answer typed above the radiograph: crop to the film
CROP = {('L7', 10, 10): (.34, .3, .96, 1), ('L7', 18, 26): (.13, .19, .94, .99)}

C = []
def case(cid, section, src, imgs, keys, topic, history='', findings='', interp='', answer=None, species='Canine',
         extra=(), tb=(), region='Thorax'):
    C.append(dict(cid=cid, section=section, src=src, imgs=imgs, keys=keys, topic=topic, history=history, findings=findings,
                  interp=interp, answer=answer, species=species, extra=extra, tb=tb, region=region))

P = "Professor's notes: "
S = 'Slide: '

# ======================= L8 · putting it all together (start here) =======================
case('l8-fred', 'final', 'L8', [(14, 12), (15, 13), (16, 14), (17, 15)], [18], 'Fred · 10 yr MC DSH',
     '10-year-old MC DSH cat. Two months of decreased appetite that improved with a stimulant. Grade II/VI parasternal systolic murmur. 1) Describe the abnormalities. 2) Radiographic diagnosis? 3) What next?',
     'Slide answer: increased soft-tissue opacity in the pleural space allowing retraction of the lung lobes from the periphery. ' + P + 'primary conclusion = pleural effusion! We can\'t see the heart, so we cannot state cardiomegaly. Can\'t rule out a mass; does have a heart murmur.',
     'Slide answer: pleural effusion (differentials: heart failure, malignancy, transudate, chyle, exudate). ' + P + 'acquired cardiomyopathy leading to congestive heart failure; hyperthyroid; could be a cranial mediastinal mass too. Next: thoracocentesis + repeat radiographs (horizontal-beam view). Slide plan/outcome: thoracocentesis and re-radiograph, echocardiogram → malignant effusion with mixed inflammation, mild concentric LV hypertrophy, masses with pleural effusion seen on echo ("effusion due to cancer + heart").',
     'Pleural effusion', 'Feline')
case('l8-toto', 'final', 'L8', [(20, 20), (22, 22)], [21, 22], 'Toto · 5 yr MC mixed breed',
     '5-year-old MC mixed-breed dog. Muffled heart sounds on the right. 1) Describe. 2) Radiographic diagnosis? 3) What next?',
     'Slide answer: enlarged sternal, cranial mediastinal and hilar lymph nodes. ' + P + 'intrathoracic/cranial mediastinal masses circled on the lateral; cranial mediastinal mass on the VD.',
     'Slide answer: thoracic lymphadenopathy (lymphoma, malignant histiocytosis). ' + P + 'could be fungal, but you normally see lung changes with fungal disease, so it is less likely to be granulomatous disease.',
     'Thoracic lymphadenopathy (sternal, cranial mediastinal, hilar)')
case('l8-skittle', 'final', 'L8', [(25, 26), (26, 27)], [27, 28], 'Skittle · 10 yr F Yorkshire Terrier',
     '10-year-old female Yorkshire Terrier. History: coughing. 1) Describe. 2) Radiographic diagnosis? 3) What next?',
     P + 'venous congestion marked on the right lateral.',
     P + 'congestive heart failure! + dynamic tracheal collapse! Heart failure is the main issue, but the current cause of the coughing isn\'t heart failure, it\'s the trachea.',
     'Congestive heart failure + dynamic tracheal collapse')
case('l8-shadow', 'final', 'L8', [(30, 31), (32, 33)], [31], 'Shadow · 11 yr MC mixed breed',
     '11-year-old MC mixed-breed dog. Acute vomiting and respiratory difficulty. 1) Describe. 2) Radiographic diagnosis? 3) What next?',
     P + 'dilated, gas-filled esophagus outlined dorsal to the trachea, with the longus colli muscle visible; esophagus marked. "Need both laterals to see the ___."',
     'Megaesophagus (esophagus outlined on the professor\'s slide). Added: with vomiting + megaesophagus, the lecture distribution table says to look for aspiration pneumonia (ventral, cranial–mid lung) — not stated on this slide.',
     'Megaesophagus')
case('l8-maeby', 'final', 'L8', [(35, 36), (36, 37)], [35, 36], 'Maeby · 9 mo F Jack Russell Terrier',
     '9-month-old female Jack Russell Terrier. Owners came home to find the dog vomiting and gagging — 6× yesterday. 1) Describe. 2) Radiographic diagnosis? 3) What next?',
     P + 'angular opacity in the esophagus (marked dorsal to the trachea/heart base); "radio is relative low"; heart measured.',
     P + 'with esophageal rupture you will see pneumomediastinum. So do a barium(!) — could use iodinated contrast since that won\'t cause a reaction. (L7 slide: barium swallows are contraindicated if esophageal rupture is suspected.)',
     'Esophageal foreign body')
case('l8-case3-lab', 'final', 'L8', [(39, 40), (41, 42)], [40], 'Case 3 · 9 yr FS Labrador',
     '9-year-old FS Labrador. Pre-TPLO metastasis check.',
     P + 'no nodules, but an interstitial pattern? Bronchointerstitial — but normal for an older dog.',
     'No pulmonary nodules (metastasis check negative). Mild bronchointerstitial change is an age-related finding in an older dog.',
     'No metastasis · age-related bronchointerstitial pattern')

# ======================= Lung patterns =======================
case('pat-bronch-marked', 'patterns', 'L1', [(47, 651), (47, 652)], [47], 'Pattern film · L1 slide 47',
     findings=S + 'bronchial pattern, marked — thickened bronchi can be seen. ' + P + 'arrows on thickened airway walls; walls seen this far out = abnormal.',
     interp='Bronchial pattern (marked).', answer='Bronchial pattern')
case('pat-bronch-lacy', 'patterns', 'L1', [(48, 664)], [48], 'Pattern film · L1 slide 48',
     findings=S + 'bronchial pattern, marked. ' + P + '"lacy, cobblestone" involving the pulmonary parenchyma; see the smaller airways.',
     interp='Bronchial pattern (marked).', answer='Bronchial pattern')
case('pat-bronch-mild', 'patterns', 'L1', [(49, 677), (49, 678)], [49], 'Pattern film · L1 slide 49',
     findings=S + 'bronchial pattern, mild — subtle, may be more evident peripherally. ' + P + 'not as much lacy/cobblestone (which is fibrosis/chronic inflammation).',
     interp='Bronchial pattern (mild).', answer='Bronchial pattern')
case('pat-bronch-moderate', 'patterns', 'L1', [(50, 691)], [50], 'Pattern film · L1 slide 50',
     findings=S + 'bronchial pattern, moderate (shown next to a normal dog). ' + P + 'normal: trachea and bronchus visible, but you can\'t see 2nd/3rd-generation walls; abnormal: 2nd/3rd bronchi highlighted.',
     interp='Bronchial pattern (moderate).', answer='Bronchial pattern')
case('pat-cat-wheeze', 'patterns', 'L1', [(65, 888), (67, 912)], [65, 67], '8 yr DSH · dyspnea and wheezing',
     '8-year-old DSH cat. Dyspnea and wheezing.',
     P + 'diffuse — so bronchial? interstitial? alveolar? End-on rings circled throughout; "cobblestone / lacy". VD inset: end-on airways circled.',
     'Diffuse bronchial pattern in a cat (lecture list for bronchial pattern: allergic airway disease, infection, chronic irritation; chronic bronchitis is more common in cats).',
     'Bronchial pattern', 'Feline')
case('pat-ui-right', 'patterns', 'L2', [(17, 217)], [17], 'Pattern film · L2 slide 17',
     findings=S + 'interstitial pattern, moderate, right-sided. VD/DV lets you compare to the lung on the opposite side.',
     interp='Unstructured interstitial pattern (right-sided).', answer='Unstructured interstitial pattern')
case('pat-ui-marked', 'patterns', 'L2', [(18, 231), (18, 232)], [18], 'Pattern film · L2 slide 18',
     findings=S + 'interstitial pattern, diffuse, marked. ' + P + 'interstitial coalescing into alveolar!',
     interp='Unstructured interstitial pattern (diffuse, marked) progressing toward alveolar.', answer='Unstructured interstitial pattern')
case('pat-ui-moderate', 'patterns', 'L2', [(19, 244)], [19], 'Pattern film · L2 slide 19',
     findings=S + 'interstitial pattern, diffuse, moderate (shown next to a normal dog). Increased background opacity; vessels still visible but fuzzy.',
     interp='Unstructured interstitial pattern (diffuse, moderate).', answer='Unstructured interstitial pattern', extra=[('L2', 19, 245, 'Normal comparison dog from the same slide')])
case('pat-ui-l3', 'patterns', 'L3', [(16, 165)], [16, 17, 18], 'Pattern quiz · L3 slide 16',
     findings=P + '"hazy, interstitial?" — answer circled: interstitial unstructured. Slide 18 (close-ups): hazy opacity, unstructured, vessels still visible.',
     interp='Unstructured interstitial pattern.', answer='Unstructured interstitial pattern')
case('pat-si-1', 'patterns', 'L2', [(46, 574)], [46], 'Pattern film · L2 slide 46',
     findings=S + 'structured interstitial pattern — neoplasia (metastatic if multiple), granulomas (fungal disease), abscess, cyst.',
     interp='Structured interstitial pattern (nodules).', answer='Structured interstitial pattern (nodules/masses)')
case('pat-si-miliary', 'patterns', 'L2', [(48, 601), (48, 604)], [48], 'Pattern film · L2 slide 48',
     findings=S + 'miliary nodules are very tiny — metastatic cancer. Nodules generally need to be ~5 mm to be seen on radiographs.',
     interp='Structured interstitial pattern — miliary nodules (metastatic cancer).', answer='Structured interstitial pattern (nodules/masses)')
case('pat-si-large', 'patterns', 'L2', [(49, 616)], [49], 'Pattern film · L2 slide 49',
     findings=S + 'pulmonary nodules can also be larger — metastatic cancer.',
     interp='Structured interstitial pattern — multiple larger nodules (metastatic cancer).', answer='Structured interstitial pattern (nodules/masses)')
case('pat-alv-bronchogram', 'patterns', 'L2', [(84, 1055)], [84], 'Pattern film · L2 slide 84',
     findings=S + 'air bronchogram — lucent airway with surrounding soft-tissue opacity; vessels are border effaced (vessels are also soft-tissue opaque, no contrast).',
     interp='Alveolar pattern (air bronchograms).', answer='Alveolar pattern', extra=[('L2', 84, 1056, 'Contrast-enhanced version from the slide (airways darker)')])
case('pat-alv-lobar-vd', 'patterns', 'L2', [(86, 1080)], [86], 'Pattern film · L2 slide 86',
     findings=S + 'lobar sign — well-defined marked change in opacity between adjacent lung lobes (arrows on the highlighted version).',
     interp='Alveolar pattern (lobar sign).', answer='Alveolar pattern')
case('pat-alv-lobar-lat', 'patterns', 'L2', [(87, 1093)], [87], 'Pattern film · L2 slide 87',
     findings=S + 'lobar sign — well-defined marked change in opacity between adjacent lung lobes. ' + P + 'accessory lung lobe.',
     interp='Alveolar pattern (lobar sign, accessory lobe).', answer='Alveolar pattern')
case('pat-alv-aspiration', 'patterns', 'L45', [(33, 49)], [33], 'Pattern film · L4–5 slide 33',
     findings=S + 'ventral alveolar pattern, often cranial to mid thorax; can be one or multiple lung lobes; some regions can also have interstitial and/or bronchial.',
     interp='Alveolar pattern, ventral — the slide is "Aspiration pneumonia / bronchopneumonia" (usually history of vomiting, regurgitation, anesthesia/surgery).', answer='Alveolar pattern')
case('pat-mixed-cat', 'patterns', 'L2', [(95, 1192)], [95], 'Pattern film · L2 slide 95',
     findings=S + 'often the pattern is mixed, due to more advanced, progressed disease in some lung regions — cat in congestive heart failure. ' + P + 'rare to get a single pattern.',
     interp='Mixed pattern (cat in congestive heart failure).', answer='Mixed pattern (more than one pattern)', species='Feline')

# ======================= Technique & look-alikes =======================
case('mim-obliquity', 'mimics', 'L2', [(24, 303)], [24], 'Look-alike · L2 slide 24',
     findings=S + 'obliquity — dorsal soft tissues are superimposed more on one side; regional homogeneous increase in opacity (no texture).',
     interp='Look-alike for interstitial pattern: obliquity (rotated VD/DV).', answer='Obliquity (rotation) artifact')
case('mim-obesity', 'mimics', 'L2', [(25, 315)], [25], 'Look-alike · L2 slide 25',
     findings=S + 'obesity — excess fat superimposed with the entire lung; diffuse homogeneous increased opacity.',
     interp='Look-alike for interstitial pattern: obesity.', answer='Obesity (superimposed fat)')
case('mim-underexposed', 'mimics', 'L2', [(26, 327)], [26], 'Look-alike · L2 slide 26',
     findings=S + 'underexposed image — pure white parts of the image that can\'t be fixed with brightness/contrast; overall increase in opacity.',
     interp='Look-alike for interstitial pattern: underexposure.', answer='Underexposed image')
case('mim-skinfold', 'mimics', 'L2', [(27, 339)], [27], 'Look-alike · L2 slide 27',
     findings=S + 'superimposed soft tissue — "skin folds" or superficial masses: homogeneous regional increased soft-tissue opacity, brightest at the fold margin, passes through lung lobes ignoring their margins and passes outside of the lungs.',
     interp='Superimposed skin fold (not lung disease, not pneumothorax).', answer='Superimposed skin fold',
     tb=['1.38'])
case('mim-expiration-1', 'mimics', 'L2', [(31, 387)], [31], 'Technique · L2 slide 31',
     findings=S + 'best to take thoracic radiographs at peak inspiration. Expiratory phase: marked caudodorsal "interstitial" pattern could hide anything; on the inspiratory image it goes away.',
     interp='Expiratory radiograph (false interstitial pattern).', answer='Expiratory radiograph',
     extra=[('L2', 31, 388, 'Same dog at peak inspiration (comparison)')])
case('mim-expiration-2', 'mimics', 'L2', [(32, 400)], [32], 'Technique · L2 slide 32',
     findings=S + 'the size of the triangle between the cardiac silhouette, caudal vena cava and diaphragm is an indicator of the degree of lung inflation.',
     interp='Expiratory radiograph (small heart–CVC–diaphragm triangle).', answer='Expiratory radiograph',
     extra=[('L2', 32, 401, 'Same dog at peak inspiration (comparison)')])
case('mim-anesthesia', 'mimics', 'L2', [(34, 426)], [34], 'Technique · L2 slide 34 · anesthetized dog',
     'Anesthetized dog.',
     S + 'heart shifted to the patient\'s left = less room for lung; alveolar pattern. After positive-pressure ventilation the lung re-expands.',
     'Atelectasis from anesthesia/recumbency (resolves after positive-pressure ventilation).', 'Anesthesia/recumbency atelectasis',
     extra=[('L2', 34, 427, 'After positive-pressure ventilation (comparison)')], tb=['1.37'])
case('mim-pleural-atelectasis', 'mimics', 'L2', [(33, 413), (33, 414)], [33], 'Technique · L2 slide 33',
     findings=S + 'pleural disease — atelectasis. ' + P + 'collapse of lung lobes (marked on the VD).',
     interp='Atelectasis secondary to pleural disease (lecture list: pneumothorax, pleural effusion).', answer='Atelectasis secondary to pleural disease')
case('mim-osteomas', 'mimics', 'L2', [(58, 730)], [58], 'Nodule mimic · L2 slide 58',
     findings=S + 'pulmonary osteomas (osseous metaplasia) — mineral opaque, not round, irregular margins, peripheral location. Anything <5 mm that you CAN see is probably mineral.',
     interp='Nodule mimic: pulmonary osteomas.', answer='Pulmonary osteomas (osseous metaplasia)', extra=[('L2', 58, 731, 'Magnified inset from the slide')])
case('mim-endon', 'mimics', 'L2', [(61, 769)], [61], 'Nodule mimic · L2 slide 61',
     findings=S + 'end-on vessels — perfectly round, same size as local pulmonary vessels, more opaque than a nodule of the same size.',
     interp='Nodule mimic: end-on pulmonary vessel.', answer='End-on pulmonary vessel')
case('mim-nipple', 'mimics', 'L2', [(63, 793), (63, 794)], [62, 63], 'Nodule mimic · L2 slide 63',
     findings=S + 'cutaneous nodules/nipples — usually the margin is more distinct on one side; can confirm extrathoracic location by an orthogonal view or barium on the nipple.',
     interp='Nodule mimic: nipple / cutaneous nodule.', answer='Nipple / cutaneous nodule', tb=['1.39', '1.36'])

# ======================= Lung cases =======================
case('lung-14yo-cat', 'lung', 'L1', [(69, 938), (69, 939)], [70, 68], '14 yr FS DSH · intermittent respiratory distress',
     '14-year-old FS DSH. Intermittent respiratory distress.',
     P + 'collapsed lung lobe — triangular, soft-tissue opacity; collapsed bronchus/lung lobe due to bronchial plugging, most common in the right middle lung lobe (cough ↑, surfactant ↓). Lungs hyperinflated! — because it\'s not ever fully expelling air → hyperexpanded. Shows "tenting" of the diaphragm; diaphragm pushed back/flattened. Mineralization could still be there with treatment, but less inflamed.',
     S + 'radiographic consequences of bronchial disease (with chronic allergic bronchitis): lobar collapse (mucus plug, R middle most common, usually alveolar), bronchiectasis, spontaneous rib fx (9th–13th), hyperinflation (flattened/tented diaphragm), bronchial mineralization.',
     'Lobar collapse + hyperinflation from chronic bronchial disease', 'Feline')
case('lung-bronchiectasis', 'lung', 'L1', [(71, 964)], [71], 'Airway film · L1 slide 71',
     findings=S + 'increased bronchial diameter, failure of bronchi to taper, nonlinear bronchial wall, abnormally thickened wall if concurrent bronchitis. Risk factors: chronic bronchitis, mucociliary disorder, obstruction, age.',
     interp='Bronchiectasis.', answer='Bronchiectasis')
case('lung-2yo-dog', 'lung', 'L2', [(72, 907), (73, 919)], [75, 77], '2 yr MC mixed breed · chronic cough',
     '2-year-old MC mixed-breed dog. Chronic coughing, sneezing and bilateral nasal discharge.',
     'Primary pattern circled in class: bronchial.',
     'Answer circled in class: bacterial infection → BAL. ' + P + 'if it were an old dog (>8 yrs) you\'d think mineralized bronchial walls, but not in an old dog?? → this dog is young.',
     'Bronchial pattern · bacterial infection (BAL)')
case('lung-l3-lab-regurg', 'lung', 'L3', [(7, 63)], [7, 13], 'Patient A · 2 yr MC Labrador',
     '2-year-old MC Labrador. Has been regurgitating; now febrile and lethargic.',
     'Primary pattern circled in class: alveolar. ' + P + 'megaesophagus; alveolar; lobar sign.',
     'Answer circled in class: aspiration pneumonia. ' + P + 'coughing, young, febrile.', 'Aspiration pneumonia')
case('lung-l3-fcr', 'lung', 'L3', [(7, 65)], [7, 14], 'Patient B · 8 yr flat-coated retriever',
     '8-year-old flat-coated retriever. Significant arthritis issues.',
     'Primary pattern circled in class: alveolar. ' + P + 'some bronchial pattern but she\'s old; air bronchogram, alveolar.',
     'Answer in class: primary pulmonary cancer such as histiocytic sarcoma (professor corrected "carcinoma" → sarcoma). Lecture table: histiocytic sarcoma = ventral right middle lobe.',
     'Primary pulmonary neoplasia (histiocytic sarcoma)')
case('lung-l3-cat-mets', 'lung', 'L3', [(25, 256)], [25, 26], 'Patient A · 13 yr FS DSH',
     '13-year-old FS DSH. Metastasis check because the owner felt "lumps on belly" (mammary masses).',
     P + 'both cats have a diffuse bronchial pattern — rare to have a diffuse bronchial pattern!',
     'Answer circled in class: metastatic neoplasia (lumps on belly). ' + P + 'could it also be asthma? Do a BAL to differentiate asthma from metastatic.',
     'Metastatic neoplasia', 'Feline')
case('lung-l3-cat-smoker', 'lung', 'L3', [(20, 206)], [21, 22, 28], 'Patient B · 6 yr MC DLH',
     '6-year-old MC DLH. Coughing/retching at home; lives with a smoker.',
     'Primary pattern circled in class: bronchial. ' + P + 'very severe; also has hazy opacity but due to severity; donuts!',
     'Answer circled in class: asthma / chronic lower airway inflammation.', 'Asthma / chronic lower airway inflammation', 'Feline')
case('lung-l3-rml', 'lung', 'L3', [(30, 312), (30, 311)], [30, 31, 33], 'Bronchial case · anything else?',
     'Same teaching set: "Anything else besides the bronchial pattern?"',
     P + 'outlining of lung lobe? Could there be fluid around the lungs?? Hyperinflated lungs. Heart shifted (to one side) — middle? Location slide: increased opacity in the right middle lobe region with lobar sign; left lateral.',
     'Answer circled in class: right middle lung lobe with lobar sign, diffuse bronchial pattern, mediastinal shift; mucous plugging and collapse.',
     'Right middle lobe collapse (mucous plug) + mediastinal shift')
case('lung-l3-lymphoma', 'lung', 'L3', [(46, 488)], [46, 47, 50], 'Patient A · 7 yr MC mixed breed',
     '7-year-old MC mixed-breed dog. Peripheral lymphadenopathy.',
     'Primary pattern circled in class: interstitial unstructured. ' + P + 'hazy, still see blood vessels.',
     'Answer circled in class: infiltrative neoplasia. ' + P + 'lymphoma. (Later slide: diffuse interstitial, 7 yo, peripheral lymphadenopathy, tracheobronchial LN.)',
     'Infiltrative neoplasia (lymphoma)')
case('lung-l3-puffball', 'lung', 'L3', [(46, 489)], [53, 54], 'Patient B · 5 mo Golden Retriever',
     '5-month-old Golden Retriever. Trouble breathing the last few days.',
     'Primary pattern circled in class: interstitial unstructured.',
     'Slide ("What about our puppy?" → word of the day): Lycoperdonosis — respiratory disease from inhaling large amounts of spores from mature puffballs; a hypersensitivity pneumonitis (extrinsic allergic alveolitis).',
     'Lycoperdonosis (puffball hypersensitivity pneumonitis)')
case('lung-l3-blasto', 'lung', 'L3', [(61, 647)], [61, 62], 'Patient A · 5 yr M Brittany Spaniel',
     '5-year-old M Brittany Spaniel from Missouri. Coughing for ~1 month.',
     'Primary pattern circled in class: interstitial structured. ' + P + 'both have it (structured interstitial pattern); nodules circled.',
     'Answer circled in class: fungal disease (e.g., blastomycosis). Lecture table: granulomas — fungal, think geography + lymphadenopathy.',
     'Fungal disease (blastomycosis)')
case('lung-l3-mets', 'lung', 'L3', [(61, 646)], [61, 64], 'Patient B · 10 yr FS Labrador',
     '10-year-old FS Labrador. Limping on the left hind leg.',
     'Primary pattern circled in class: interstitial structured.',
     'Answer circled in class: metastatic disease (e.g., osteosarcoma, TCC).', 'Metastatic disease (e.g., osteosarcoma)')
case('lung-puppy-pool', 'lung', 'L45', [(27, 40), (27, 41)], [30, 31], '4 mo puppy · fell into a pool',
     '4-month-old puppy. Fell into a pool yesterday and is now struggling to breathe.',
     'Predominant pattern in class (poll, slide 28): alveolar. L3 notes on the same films: young dog, lobar sign, alveolar pattern.',
     'In-class poll (slide 31): aspiration pneumonia / cardiogenic edema / non-cardiogenic edema / neoplastic infiltration — no answer is marked on the slide. Slide 36 lists drowning under non-cardiogenic pulmonary edema; slide 37: non-cardiogenic edema is generalized but worse caudodorsal with normal heart and pulmonary veins. Write your own conclusion.',
     None)

# ======================= Heart & vessels =======================
case('hrt-lae', 'heart', 'L45', [(18, 18), (18, 20)], [18], 'Chamber film · L4–5 slide 18',
     findings=P + '"backpack sign"; straightening of the caudal cardiac waist; trachea elevated; bulge in LA. VD: "double bubble" — there are 2 opacities; auricular bulge (atrium ≠ auricle!).',
     interp='Left atrial enlargement.', answer='Left atrial enlargement')
case('hrt-lae-2', 'heart', 'L45', [(20, 25)], [20], 'Chamber film · L4–5 slide 20',
     findings=S + 'lateral — straightening of the caudodorsal heart margin. VD — splitting of the mainstem bronchi, round opacity superimposed over the caudal heart, with severe changes the left auricular bulge at 2–3 o\'clock. ' + P + 'splitting caudal to the carina.',
     interp='Left atrial enlargement.', answer='Left atrial enlargement')
case('hrt-lve', 'heart', 'L45', [(21, 26), (21, 27)], [21], 'Chamber film · L4–5 slide 21',
     findings=S + 'may appear radiographically normal; in severe enlargement the heart may elongate (lateral or VD/DV); dorsal displacement of the entire thoracic trachea (thoracic inlet to carina). ' + P + 'trachea dorsally displaced; hard to see — it takes a while to get it. Why it looks like the RA = because of dorsal displacement. Also see LA enlargement, but no "backpack" sign.',
     interp='Left ventricular enlargement.', answer='Left ventricular enlargement')
case('hrt-rae', 'heart', 'L45', [(22, 32), (22, 30)], [22], 'Chamber film · L4–5 slide 22',
     findings=S + 'right atrial enlargement — bulge at 9–11 o\'clock. ' + P + 'should be 3:2 (cranial:caudal); bulge of RA; apex shifts.',
     interp='Right atrial enlargement.', answer='Right atrial enlargement')
case('hrt-lchf-veins', 'heart', 'L45', [(45, 55)], [45], 'Failure film · L4–5 slide 45',
     findings=S + 'left-sided failure — pulmonary vessels are a window on cardiac function: pulmonary venous congestion (vein dilated, larger than the corresponding artery) is often the first sign of decompensation. ' + P + 'veins; LA enlargement; diameter of veins > arteries = venous congestion. A dog presenting for cough with lungs sounding a bit harsh and a left-sided heart murmur = not exactly in congestive failure, but almost there.',
     interp='Left atrial enlargement with pulmonary venous congestion (early left-sided failure).', answer='Pulmonary venous congestion (left-sided heart failure)')
case('hrt-lchf-edema', 'heart', 'L45', [(47, 61), (48, 62)], [47, 48], 'Failure film · L4–5 slides 47–48',
     findings=S + 'pulmonary edema — veins dilate, increased hydrostatic pressure, fluid leaks into the interstitium, progressing to fill alveoli. ' + P + 'unstructured interstitial → interstitial coalescing to alveolar pattern; perihilar, caudodorsal lung region; predominant pattern in the caudodorsal lung lobe; when really bad you start to see an alveolar pattern (which is in this case). VD: lungs diffuse unstructured interstitial; left atrial enlargement; hard to see veins but she pointed them out; asymmetric vein enlargement.',
     interp='Cardiogenic pulmonary edema (left-sided congestive heart failure).', answer='Cardiogenic pulmonary edema (left-sided CHF)')
case('hrt-labile', 'heart', 'L45', [(49, 63)], [49], 'Failure film · L4–5 slide 49',
     findings=P + 'left atrial enlargement, caudodorsal interstitial to coalescing alveolar pattern — still see blood vessels, so mainly interstitial; not as much venous congestion.',
     interp=S + 'pulmonary edema is labile — rapid response to diuretic within 12–24 hours; radiographic improvement may lag clinical signs. ' + P + 'if unsure → Lasix and recheck; repeat with Lasix → pulmonary pattern disappeared = + Lasix trial = cardiogenic edema. If it\'s cardiogenic edema, Lasix clears it out; if non-cardiogenic, no difference!',
     answer='Cardiogenic pulmonary edema (left-sided CHF)', extra=[('L45', 49, 64, 'Repeat radiograph the next day after Lasix (comparison)')])
case('hrt-rchf', 'heart', 'L45', [(52, 67)], [52], 'Failure film · L4–5 slide 52',
     findings=S + 'right heart failure — hepatosplenomegaly, ascites, pleural effusion, enlarged CVC. ' + P + 'peritoneal effusion; loss of serosal detail; marks on the pulmonary vessels and CVC.',
     interp='Right-sided heart failure (peritoneal effusion).', answer='Right-sided heart failure')
case('hrt-mvi', 'heart', 'L45', [(55, 70)], [55], 'Acquired disease film · L4–5 slide 55',
     findings=S + 'left atrial enlargement (large arrow), progressing to include left ventricular enlargement; cough can be caused by LA compression of the left caudal lobar bronchus (small arrow) or pulmonary edema; left-sided CHF results. ' + P + 'trachea pushed up; trachea should be like this (angle); carina; LV enlargement.',
     interp='Mitral valve insufficiency (chronic degenerative valvular disease): LA + LV enlargement.', answer='Mitral valve insufficiency')
case('hrt-cocker', 'heart', 'L45', [(57, 73), (57, 74)], [57, 62, 63, 64], '9 yr MC Cocker Spaniel mix',
     '9-year-old MC Cocker Spaniel mix. Coughing, exercise intolerance.',
     P + 'interstitial coalescing to alveolar pattern (see bronchograms), which is most severe in the caudodorsal perihilar region. L cardiomegaly and LA enlargement — "what is it that\'s big on this dog?" LV + LA enlargement; trachea starting to run parallel. Then look at blood vessels in the cranial and dorsal aspect: smaller lumen diameter of arteries, pretty symmetric; veins are ventral + central; bigger = venous congestion.',
     'Slide report: L cardiomegaly and LA enlargement with interstitial to alveolar pattern primarily in the caudodorsal lung field, L>R; mild venous congestion. Diagnosis: cardiogenic edema secondary to left-sided congestive heart failure.',
     'Cardiogenic pulmonary edema (left-sided CHF)')
case('hrt-cat-edema', 'heart', 'L45', [(65, 87)], [65, 70], 'Feline film · L4–5 slides 65 & 70',
     'Cat.',
     P + 'always ask first: abnormal or normal? Possible alveolar; struggling to see the heart because of the pulmonary pattern; a bit of a diffuse unstructured interstitial pattern. Instead of venous congestion, cats get vascular congestion — can be either arteries, veins, or both.',
     S + 'cardiogenic pulmonary edema in a cat. No typical pattern of cardiogenic edema in cats — often more patchy; can also have pleural effusion with left-sided heart failure; look for cardiac changes! ' + P + 'how to see what everything is → does the heart look big? If yes → Lasix trial.',
     'Feline cardiogenic pulmonary edema', 'Feline')
case('hrt-cat-edema-lat', 'heart', 'L45', [(72, 94)], [72, 75], 'Feline film · L4–5 slide 72',
     'Cat.',
     P + 'can be anywhere it wants (distribution).',
     S + 'feline cardiogenic edema — random, patchy, perivascular distribution; dramatic response to treatment. ' + P + 'give Lasix and repeat! Study table: mixed alveolar + interstitial pattern most common.',
     'Feline cardiogenic pulmonary edema', 'Feline')
case('hrt-cat-lae', 'heart', 'L45', [(69, 90), (69, 91)], [69], 'Feline film · L4–5 slide 69',
     'Cat.',
     P + 'valentine heart impression — wider up top; LA pushes right(?); left atrial enlargement marked on the lateral.',
     'Left atrial enlargement — feline ("valentine" heart).', 'Feline left atrial enlargement (valentine heart)', 'Feline')
case('hrt-dcm-vd', 'heart', 'L45', [(78, 104)], [78], 'Acquired disease film · L4–5 slide 78',
     findings=S + 'dilated cardiomyopathy — heart may be normal to severe cardiomegaly; mild to severe left atrial enlargement (may be the only change visible); radiographic presentation varies between breeds.',
     interp='Dilated cardiomyopathy.', answer='Dilated cardiomyopathy')
case('hrt-dcm-giant', 'heart', 'L45', [(79, 105)], [79], 'Acquired disease film · L4–5 slide 79',
     findings=S + 'giant breeds — generalized to globoid cardiomegaly, concurrent left and right heart failure. ' + P + 'yes LA enlargement but overall large heart; edema with all types; can have left + right side enlargement.',
     interp='Dilated cardiomyopathy (giant breed).', answer='Dilated cardiomyopathy')
case('hrt-hwd-lat', 'heart', 'L45', [(82, 108)], [82], 'Heartworm film · L4–5 slide 82',
     findings=S + 'radiographic changes related to worm burden; pulmonary artery abnormalities (prior to cardiac changes): dilation, blunting, tortuous. ' + P + 'right-sided enlargement; tortuous, enlarged cranial lobar artery.',
     interp='Heartworm disease.', answer='Heartworm disease')
case('hrt-hwd-vd', 'heart', 'L45', [(84, 110)], [84], 'Heartworm film · L4–5 slide 84',
     findings=S + 'cardiac abnormalities: right-sided enlargement; main pulmonary artery enlargement (bulge at 1:00). ' + P + 'main pulmonary artery bulge; patchy interstitial; asymmetric enlargement of the main pulmonary artery.',
     interp='Heartworm disease.', answer='Heartworm disease')
case('hrt-hwd-classic', 'heart', 'L45', [(86, 114), (86, 115)], [86], 'Heartworm film · L4–5 slide 86',
     findings=P + 'classic for HWD! Right-sided enlargement; tortuous arteries; main PA; caudal lobar arterial enlargement.',
     interp='Heartworm disease.', answer='Heartworm disease')
case('hrt-hwd-174', 'heart', 'L45', [(174, 239), (174, 240)], [174, 173], 'Vessel film · L4–5 slide 174',
     findings=S + 'arteries enlarged — heartworm disease, pulmonary hypertension, thromboembolism (arrows on enlarged arteries).',
     interp='Heartworm disease (enlarged pulmonary arteries).', answer='Heartworm disease')
case('hrt-pe-globoid', 'heart', 'L45', [(89, 117)], [89], 'Pericardial film · L4–5 slide 89',
     findings=S + 'pericardial effusion — variable cardiomegaly; classic → globoid; very sharp curved caudodorsal border on the left lateral; often obscured by pleural effusion; repeat radiographs after thoracocentesis and look for metastasis. ' + P + 'a bit difficult; no specific chamber; need ultrasound — best way is US to get to the heart; right atrial hemangiosarcoma is a very common reason. Note globoid-shaped heart + circular!',
     interp='Pericardial effusion (globoid heart).', answer='Pericardial effusion')
case('hrt-pe-lat', 'heart', 'L45', [(90, 118)], [90], 'Pericardial film · L4–5 slide 90',
     findings=S + 'abdominal manifestations of right heart failure — dilated CVC, hepatosplenomegaly, ascites. Note the curved caudodorsal border to the heart. ' + P + 'CdVC should be the same diameter as the aorta; rounded caudal aspect instead of an enlargement.',
     interp='Pericardial effusion with signs of right heart failure.', answer='Pericardial effusion')
case('hrt-ra-hsa', 'heart', 'L45', [(93, 121), (93, 122)], [93, 95], 'Pericardial case · L4–5 slide 93',
     'Pericardial effusion "BUT!! What else do you see on this slide that is concerning?"',
     P + 'pleural fissure lines; pleural effusion + pericardial effusion — could be leaking out of the pericardium; liver enlarged; RA marked on the VD.',
     P + 'most likely RA mass → hemangiosarcoma. Next slide: right atrial hemangiosarcoma (arrows).',
     'Right atrial hemangiosarcoma (pericardial + pleural effusion)')
case('hrt-kitten', 'heart', 'L45', [(98, 129), (98, 130)], [100, 99, 101, 102], '11 mo F kitten · lethargy and tachypnea',
     '11-month-old female kitten. 1 day of lethargy and tachypnea.',
     P + 'patchy, ill-defined interstitial pattern; >2 yrs = probably congenital (so cardiac signs of heart failure in a very young cat → congenital); some bulges; hazy ground-glass pattern; starting to get valentine shape; arterial + venous congestion; >7.5 vertebral bodies. Most areas are patchy/hazy, lung lobes → ↑ to A.P.',
     'Answer circled in class (look at the flow chart): cardiogenic pulmonary edema, likely due to congenital malformation. Post-Lasix: a bit improved, so we know it\'s cardiogenic pulmonary edema. Slide diagnosis: cardiomyopathy with left atrial enlargement.',
     'Cardiogenic pulmonary edema — congenital heart disease (cardiomyopathy, LA enlargement)', 'Feline')
case('hrt-sas', 'heart', 'L45', [(109, 142), (109, 143)], [109], 'Congenital film · L4–5 slide 109',
     findings=S + 'subaortic stenosis — often radiographically normal; elongation of the LV due to hypertrophy (± LA dilation if secondary mitral insufficiency); enlargement of the aortic arch due to turbulent flow, 11:00–1:00 DV/VD. Breeds: GSD, GSHP, Rottweiler, Golden Retriever, Samoyed. ' + P + 'bulge at the craniodorsal aspect of the heart; aortic bulge.',
     interp='Subaortic stenosis (aortic arch bulge).', answer='Subaortic stenosis', tb=['7.17'])
case('hrt-sas-2', 'heart', 'L45', [(112, 147), (112, 148)], [112], 'Congenital film · L4–5 slide 112',
     findings=P + 'bulge at the heart base; local aortic bulge on the VD (compare with the normal inset).',
     interp='Subaortic stenosis.', answer='Subaortic stenosis')
case('hrt-ps', 'heart', 'L45', [(115, 154)], [115], 'Congenital film · L4–5 slide 115',
     findings=S + 'pulmonic stenosis — enlargement of the right ventricle secondary to hypertrophy (small arrow), dilated main pulmonary artery (thick arrow), bulge 1–2 o\'clock; ± pulmonary undercirculation. ' + P + 'reverse D sign; bulge of MPA; good radiograph.',
     interp='Pulmonic stenosis.', answer='Pulmonic stenosis')
case('hrt-ps-lat', 'heart', 'L45', [(116, 156)], [116], 'Congenital film · L4–5 slide 116',
     findings=S + 'changes sometimes seen on the lateral view — apex elevated from the sternum (arrow); bulge in the craniodorsal margin of the heart (not apparent on this view). ' + P + 'apex elevated sternally; not obvious on this view due to the main vessels.',
     interp='Pulmonic stenosis.', answer='Pulmonic stenosis')
case('hrt-mvd', 'heart', 'L45', [(119, 159)], [119], 'Congenital film · L4–5 slide 119',
     findings=S + 'mitral valve dysplasia — left heart enlargement (LA arrow, ± LV), ± pulmonary venous congestion; Cavalier King Charles Spaniel predisposed (+ cats). ' + P + 'looks like a 14-yr-old MVD; venous congestion; VHS 11 VB; lungs a bit interstitial, which is normal in older dogs but not young.',
     interp='Mitral valve dysplasia (congenital).', answer='Mitral valve dysplasia')
case('hrt-mvd-2', 'heart', 'L45', [(120, 160), (120, 161)], [120], 'Congenital film · L4–5 slide 120',
     findings=P + 'left atrial enlargement; bronchointerstitial pattern; look at the vessels.',
     interp='Mitral valve dysplasia.', answer='Mitral valve dysplasia')
case('hrt-pda', 'heart', 'L45', [(129, 168)], [129], 'Congenital film · L4–5 slide 129',
     findings=S + 'patent ductus arteriosus — generalized cardiomegaly; "three knuckles" sign is rare (aortic root, MPA 1:00–2:00, left auricle 3:00); usually 1–2 bulges; pulmonary overcirculation.',
     interp='Patent ductus arteriosus.', answer='Patent ductus arteriosus', tb=['7.17'])
case('hrt-arthur', 'heart', 'L45', [(136, 176), (136, 175)], [136, 137, 139, 141, 142], 'Arthur · 5 mo MI Soft Coated Wheaten Terrier',
     '"Arthur", 5-month-old MI Soft Coated Wheaten Terrier. Presented for dyspnea. VI/VI holosystolic murmur.',
     'Slide findings: generalized cardiomegaly (lateral 4–5 ICS wide, VD > 2/3 of the thorax); bulge at the caudodorsal heart margin and double opacity over the heart on VD (enlarged LA); elevation of the trachea over the heart; focal bulge of the descending aorta on VD; possible superimposed bulge at 1:00 (MPA enlargement); distension of the cranial lobar artery and vein (lateral) and caudal arteries and veins (VD); interstitial to alveolar infiltrates in the perihilar region and caudally. ' + P + 'abnormal! Heart too big → left side; arteries and veins circled.',
     'Slide diagnosis: PDA — heart changes and evidence of vascular overcirculation (VSD unlikely due to bulges in the aorta and possible MPA); congestive heart failure (perihilar interstitial to alveolar infiltrates); recommend echocardiography. ' + P + 'Wheaten terriers are also predisposed; recent dyspnea = going into congestive heart failure. Outcome: echo confirmed PDA, treated with successful coil embolization.',
     'Patent ductus arteriosus with congestive heart failure', tb=['7.17'])
case('hrt-samantha', 'heart', 'L45', [(147, 189), (148, 190)], [150, 155, 156], 'Samantha · 1 yr FI Australian Shepherd',
     '"Samantha", 1-year-old FI Australian Shepherd. Left basilar systolic murmur noted on physical exam.',
     'Slide findings: bulge in the cranial cardiac margin on the lateral, corresponding to the bulge at 1 o\'clock on VD (enlarged MPA); "reverse D" appearance with mild leftward shift of the apex (right-sided cardiomegaly due to RV hypertrophy); normal pulmonary vasculature and parenchyma.',
     'Slide diagnosis: pulmonic stenosis; no evidence of decompensation (CVC and liver normal size, good peritoneal detail); recommend echocardiography → congenital pulmonic stenosis.',
     'Pulmonic stenosis', extra=[('L45', 150, 194, 'Arrowed VD from the slide')])
case('ves-overcirc', 'heart', 'L45', [(166, 221), (166, 222)], [166, 165], 'Vessel film · L4–5 slide 166',
     findings=S + 'left-to-right shunting (shown next to fluid overload). Arteries and veins enlarged — iatrogenic IV fluid overload, fluid retention secondary to ↓ cardiac output, left-to-right shunt (PDA, VSD, ASD), peripheral AV fistula.',
     interp='Arteries AND veins enlarged (overcirculation).', answer='Arteries and veins enlarged (overcirculation)')
case('ves-fluid', 'heart', 'L45', [(166, 220)], [166, 165], 'Vessel film · L4–5 slide 166 (left)',
     findings=S + 'fluid overload. Arteries and veins enlarged — iatrogenic IV fluid overload is the first cause listed.',
     interp='Arteries AND veins enlarged (fluid overload).', answer='Arteries and veins enlarged (overcirculation)')
case('ves-under', 'heart', 'L45', [(168, 224), (168, 225)], [168, 167], 'Vessel film · L4–5 slide 168',
     findings=S + 'underperfusion/hypovolemia. Arteries and veins small — hypovolemia, shock, dehydration, Addison\'s, severe pulmonic stenosis with ↓ output, right-to-left shunt (tetralogy of Fallot, VSD with PS). Microcardia.',
     interp='Arteries AND veins small (underperfusion/hypovolemia).', answer='Arteries and veins small (hypovolemia)')
case('ves-hcm-veins', 'heart', 'L45', [(171, 234), (171, 235)], [171, 170], 'Vessel film · L4–5 slide 171',
     findings=S + 'hypertrophic cardiomyopathy, left-sided heart failure. Veins enlarged, arteries normal — volume overload (mitral insufficiency, early L→R shunts; veins dilate more easily), myocardial failure (cardiomyopathy), LA obstruction.',
     interp='Veins enlarged with normal arteries (left-sided heart failure, HCM).', answer='Veins enlarged (left-sided heart failure)', species='Feline')
case('ves-mpa', 'heart', 'L45', [(175, 241)], [175], 'Vessel film · L4–5 slide 175',
     findings=S + 'main pulmonary artery enlargement — bulge in the craniodorsal margin of the heart (uncommon on lateral); bulge at 1:00 o\'clock (VD) — consistent change.',
     interp='Main pulmonary artery enlargement.', answer='Main pulmonary artery enlargement')
case('ves-aorta', 'heart', 'L45', [(176, 248)], [176], 'Vessel film · L4–5 slide 176',
     findings=S + 'aortic enlargement — bulge in the craniodorsal heart margin on the lateral; bulge between 11:00–1:00 on VD. Remember that MPA, RA and aorta are superimposed on the lateral view!',
     interp='Aortic enlargement.', answer='Aortic enlargement')

# ======================= Pleura, mediastinum, esophagus, trachea, diaphragm, ribs =======================
case('cav-fissure', 'cavity', 'L6', [(5, 57)], [5], 'Pleura film · L6 slide 5',
     findings=S + 'pleural fissure lines — if very thin, may represent tangential imaging of normal pleura between lobes BUT can\'t rule out small-volume effusion.',
     interp='Pleural fissure line (thin) — small-volume effusion can\'t be ruled out.', answer='Pleural fissure line (possible small-volume effusion)')
case('cav-fissure-thick', 'cavity', 'L6', [(6, 69)], [6], 'Pleura film · L6 slide 6',
     findings=S + 'as fissure lines get thicker, worry more about pleural effusion. Right-sided effusion on this image.',
     interp='Pleural effusion (right-sided).', answer='Pleural effusion')
case('cav-pe-signs', 'cavity', 'L6', [(9, 107)], [9], 'Pleura film · L6 slide 9',
     findings=S + 'radiographic signs of pleural effusion — increased thoracic opacity (soft tissue surrounds the lungs), cardiac silhouette and diaphragm border-effaced, lung lobe retraction with rounded margins and increased interstitial-to-alveolar opacity, interlobar fissure lines.',
     interp='Pleural effusion.', answer='Pleural effusion')
case('cav-pe-volume', 'cavity', 'L6', [(10, 120)], [10], 'Pleura film · L6 slide 10',
     findings=S + 'greater-volume pleural effusion (shown next to moderate volume).',
     interp='Pleural effusion (large volume).', answer='Pleural effusion')
case('cav-zoey', 'cavity', 'L6', [(13, 152), (14, 164), (15, 176)], [13], '"Zoey" · 11 yr FS mixed breed',
     '"Zoey", 11-year-old FS mixed-breed dog. LSA (lymphoma) patient, last staged clean 6 weeks ago; now slightly labored breathing, lethargic, big peripheral lymph nodes.',
     S + 'radiographs before and after thoracocentesis ("post-tap"), including horizontal-beam views. Lecture: pleural effusion is a clinical sign, not a diagnosis — use thoracocentesis and recheck films, and a horizontal beam to move fluid away from the area of interest.',
     'Pleural effusion (repeat after thoracocentesis to look at what the fluid was hiding).', 'Pleural effusion',
     extra=[('L6', 16, 188, 'Post-tap horizontal-beam VD (comparison)'), ('L6', 19, 224, 'Post-tap horizontal beam, arrows from the slide')])
case('cav-ptx-lat', 'cavity', 'L6', [(21, 250)], [21, 22], 'Pleura film · L6 slide 21',
     findings=S + 'pneumothorax, lateral — dorsal cardiac displacement (heart lifts away from the sternum with gas between; most consistent sign), retracted lung margins, increased lung opacity (partial collapse), flattened diaphragm.',
     interp='Pneumothorax.', answer='Pneumothorax', extra=[('L6', 22, 263, 'Close-up from the next slide')])
case('cav-ptx-vd', 'cavity', 'L6', [(25, 300)], [25, 24], 'Pleura film · L6 slide 25',
     findings=S + 'VD/DV signs of pneumothorax — increased lung opacity; free gas between lung and inner thoracic wall; you do not see pleural fissure lines with air. Is it "free" gas or not? Look for vessel markings.',
     interp='Pneumothorax.', answer='Pneumothorax', extra=[('L6', 25, 299, 'Normal thorax from the same slide')], tb=['1.38'])
case('cav-shift-mass', 'cavity', 'L6', [(30, 358)], [30], 'Mediastinum film · L6 slide 30',
     findings=S + 'mediastinal shift to the left — volume INCREASE on the right due to a right-sided lung mass shifts the mediastinal organs to the left.',
     interp='Mediastinal shift from a right lung mass (volume increase).', answer='Mediastinal shift (volume increase · lung mass)')
case('cav-shift-lobectomy', 'cavity', 'L6', [(31, 371)], [31], 'Mediastinum film · L6 slide 31',
     findings=S + 'mediastinal shift to the left — volume DECREASE (left cranial lung lobectomy) shifts the mediastinal organs to the left.',
     interp='Mediastinal shift from lost lung volume (lobectomy).', answer='Mediastinal shift (volume decrease · lobectomy)')
case('cav-shift-positioning', 'cavity', 'L6', [(32, 383)], [32], 'Mediastinum film · L6 slide 32 (right)',
     findings=S + 'poor positioning can mimic mediastinal shift (shown next to a true mediastinal shift).',
     interp='Rotation, not a true mediastinal shift.', answer='Obliquity mimicking mediastinal shift', extra=[('L6', 32, 384, 'True mediastinal shift from the same slide')])
case('cav-cat-caudal', 'cavity', 'L6', [(38, 456)], [38, 40], '7 yr FS cat · fever, vomiting',
     '7-year-old FS cat. Fever, vomiting.',
     S + 'the follow-up slide outlines a triangular soft-tissue opacity in the caudal mediastinum (dorsal, between heart and diaphragm) on the lateral and on fluoroscopy.',
     S + 'caudal mediastinal mass effect — less common than cranial/middle; most often due to esophageal disease (megaesophagus, esophageal tumors, foreign bodies), abscesses, atypical LN enlargement, mediastinitis (secondary to esophageal perforation). Dilemmas: pleural fluid trapped in the plica vena cava, diaphragmatic masses; clinical signs and ancillary imaging help.',
     'Caudal mediastinal mass effect', 'Feline', extra=[('L6', 40, 482, 'Fluoroscopy frame from the next slide')])
case('cav-pneumomed', 'cavity', 'L6', [(43, 516)], [43, 44], 'Mediastinum film · L6 slide 43',
     findings=S + 'pneumomediastinum — patchy radiolucencies in the cranial mediastinum; air outlines mediastinal structures (trachea, esophagus, major vessels); normal heart position and lung expansion. Pneumomediastinum can lead to pneumothorax (not vice versa); ± gas in fascial planes of the neck or retroperitoneum.',
     interp='Pneumomediastinum.', answer='Pneumomediastinum', extra=[('L6', 43, 517, 'Normal comparison from the same slide'), ('L6', 44, 529, 'Labeled version from the next slide')])
case('cav-sternal-ln', 'cavity', 'L6', [(62, 747)], [62], 'Lymph node film · L6 slide 62',
     findings=S + 'sternal lymphadenopathy — widening of the cranioVENTRAL mediastinum; sternal nodes sit just dorsal to the 1st–3rd sternebrae; only seen on the lateral unless very large. Drain the cranial peritoneal cavity, mammary glands, diaphragm, ribs, sternum, thoracic and abdominal body wall.',
     interp='Sternal lymphadenopathy.', answer='Sternal lymphadenopathy')
case('cav-beagle', 'cavity', 'L6', [(68, 829), (68, 830)], [68, 69], '8 yr MN Beagle · large peripheral lymph nodes',
     '8-year-old MN Beagle. Large peripheral lymph nodes.',
     S + 'follow-up slide arrows: ventral deviation of the carina on the lateral; widening/opacity at the hilus on the VD. Tracheobronchial (perihilar) lymphadenopathy — bowing of the mainstem bronchi on VD/DV; carina normal or deviated ventrally (with LA enlargement it gets "pushed up").',
     S + 'tracheobronchial lymphadenopathy differentials: malignant histiocytosis/histiocytic sarcoma, lymphoid neoplasia, granulomatous disease. Dilemmas: LA enlargement and pulmonary hypertension look similar — you generally won\'t see ventral deviation of the carina with those.',
     'Tracheobronchial (perihilar) lymphadenopathy')
case('cav-stbernard', 'cavity', 'L7', [(6, 3), (6, 4)], [6, 7], '5 mo St. Bernard · 2 weeks regurgitation',
     '5-month-old St. Bernard. Two weeks of regurgitation.',
     P + 'dilated with fluid; tracheal gas stripe → ventral displacement of the trachea; dilated; can be confused with pneumomediastinum. VD: dilated esophagus outlined. ' + S + 'radiographic signs of megaesophagus — tracheal stripe, ventral displacement of the trachea, visualization of the longus colli muscle; not to be confused with pneumomediastinum.',
     'Megaesophagus (generalized). Next slide: PRAA is the most common vascular ring anomaly — focal dilation cranial to the heart in a young dog that regurgitates after weaning.',
     'Megaesophagus')
case('cav-praa', 'cavity', 'L7', [(8, 7), (8, 8)], [8], 'Esophagus film · L7 slide 8',
     findings=S + 'most common vascular ring anomaly; congenital stenosis of the esophagus at the heart base; regurgitation shortly after weaning; marked focal dilation cranial to the heart with leftward deviation of the trachea (due to the right-sided aorta). PATHOGNOMONIC (word of the day). ' + P + 'causes stenotic lesion; presents young age.',
     interp='Persistent right aortic arch (PRAA).', answer='Persistent right aortic arch (vascular ring anomaly)')
case('cav-esoph-fb', 'cavity', 'L7', [(10, 10)], [10, 9], 'Esophagus film · L7 slide 10',
     findings=P + 'sharp, angled — shouldn\'t be here, so esophageal FB.',
     interp=S + 'esophageal foreign bodies — dogs present with hypersalivation and regurgitation; common lodgment sites: thoracic inlet, heart base, just cranial to the diaphragm. Barium swallows are contraindicated if esophageal rupture is suspected (look for pneumomediastinum, pleural effusion, pneumothorax).',
     answer='Esophageal foreign body')
case('cav-trachea-normal', 'cavity', 'L7', [(11, 11), (11, 13)], [11], 'Trachea film · L7 slide 11',
     findings=S + 'normal trachea. Reasons to image: "honking" cough, dyspnea, cough elicited easily on tracheal palpation.',
     interp='Normal trachea.', answer='Normal trachea')
case('cav-mainstem', 'cavity', 'L7', [(14, 18)], [14, 13], 'Trachea film · L7 slide 14',
     findings=S + 'intra-thoracic and mainstem bronchus collapse (arrows). Tracheal collapse due to chondromalacia is common in small/toy breeds ("honking" cough; variable degree; static or dynamic).',
     interp='Intrathoracic tracheal and mainstem bronchus collapse.', answer='Intrathoracic tracheal / mainstem bronchus collapse')
case('cav-chihuahua', 'cavity', 'L7', [(15, 19)], [15, 16], '10 yr M Chihuahua · dry cough',
     '10-year-old M Chihuahua. Dry coughing, increased respiratory effort.',
     S + 'the next slides are "Dynamic imaging with fluoroscopy (\'trach fluoro\') — the gold standard for evaluating dynamic tracheal collapse": on inspiration the cervical trachea collapses (negative intraluminal pressure); on expiration the intrathoracic trachea and mainstem bronchi collapse (positive intrathoracic pressure). Grading 25/50/75/100% collapse.',
     'Tracheal collapse — static films can miss it; fluoroscopy is the gold standard.', 'Tracheal collapse')
case('cav-hypoplasia', 'cavity', 'L7', [(18, 26)], [18, 13], 'Trachea film · L7 slide 18',
     findings=S + 'tracheal hypoplasia (brachycephalics) — lines on the slide compare the tracheal diameter with the thoracic inlet (trachea : thoracic inlet ratio).',
     interp='Tracheal hypoplasia.', answer='Tracheal hypoplasia')
case('cav-dh', 'cavity', 'L7', [(36, 50), (37, 51)], [36, 38, 35], '1.5 yr Lab mix · HBC 3 months ago',
     '1.5-year-old Lab mix. Hit by car 3 months ago; weak yesterday and retching during a bike ride; chest seems swollen.',
     S + 'diaphragmatic hernia signs — diaphragmatic discontinuity (part of the diaphragmatic line not visible, abnormal shape), mediastinal shift away from the hernia, displaced organs (abdominal organs within the thorax and absent from the abdomen), fluid (pleural effusion is common with DH).',
     'Traumatic diaphragmatic hernia (pleural fluid common with DH).', 'Traumatic diaphragmatic hernia')
case('cav-hiatal', 'cavity', 'L7', [(41, 54), (41, 55)], [41, 42], '5 yr mixed breed · mast cell tumor',
     '5-year-old mixed-breed dog presented for a mast cell tumor (staging films).',
     S + 'follow-up slide arrows mark a soft-tissue/gas opacity in the caudodorsal thorax at the esophageal hiatus.',
     'Hiatal hernia — herniation of the stomach through the esophageal hiatus.', 'Hiatal hernia')
case('cav-gsd-ge', 'cavity', 'L7', [(44, 59), (44, 60)], [44, 43], '3 yr FS German Shepherd · megaesophagus history',
     '3-year-old FS German Shepherd with a history of megaesophagus; presented for regurgitation and gagging that progressed to hematemesis.',
     'Dilated esophagus with a soft-tissue opacity in the caudal esophagus cranial to the diaphragm (see the close-up on the next slide).',
     S + '(slide shown just before this case) gastroesophageal intussusception — stomach invaginates into the esophagus, usually secondary to megaesophagus; surgical emergency. Added: the diagnosis is not written on the case slide itself; it is inferred from the slide sequence.',
     'Gastroesophageal intussusception', extra=[('L7', 45, 61, 'Close-up from the next slide')])
case('cav-rib-fx', 'cavity', 'L7', [(58, 79)], [58], 'Body wall film · L7 slide 58',
     findings=S + 'rib fractures. Lecture: often multiple ribs affected in a row and at a similar level.',
     interp='Rib fractures (trauma).', answer='Rib fractures')
case('cav-rib-tumor', 'cavity', 'L7', [(59, 81), (59, 82)], [59, 62, 63], 'Body wall film · L7 slide 59',
     findings=S + 'rib tumors — may be expansile, lytic and/or osteoproductive; rib lysis and expansion with a soft-tissue mass. Extrapleural masses have a curved, obtuse pulmonary margin (pulmonary masses: sharp, acute margin).',
     interp='Rib tumor (extrapleural mass).', answer='Rib tumor (extrapleural mass)')
case('cav-healed-rib', 'cavity', 'L7', [(66, 96), (66, 97)], [66, 65], 'Body wall film · L7 slide 66',
     findings=S + 'healed rib fractures — rib/costochondral mineralization (arrows). Healed fracture: often multiple ribs in a row at a similar level; tumor: usually a single expansile/destructive lesion.',
     interp='Healed rib fractures.', answer='Healed rib fractures')

# ======================= Numbered lecture cases (L6–L7) =======================
case('case3-dachshund', 'cases', 'L7', [(21, 29), (22, 30)], [33], 'Case 3 · 8 yr MC Dachshund',
     '8-year-old MC Dachshund. Coughing, tachypnea.',
     'Case notes: generalized cardiomegaly (VHS 13.2, 4 ICS); bulge at the caudal cardiac waist on the L lat view; pulmonary vasculature normal; diffuse interstitial to alveolar pattern, worse caudodorsally.',
     'Case notes: cardiomegaly with left atrial enlargement — could be due to valvular disease or DCM. Interstitial to alveolar pattern, worse caudodorsally = pulmonary edema from left-sided congestive heart failure.',
     'Cardiogenic pulmonary edema (left-sided CHF)')
case('case4-blue', 'cases', 'L7', [(48, 64), (49, 65), (50, 66)], [54], 'Case 4 · "Blue", 8 yr MC mixed breed',
     '"Blue", 8-year-old MC mixed-breed dog. Gagging for 8 weeks; lame for 2 weeks after a fall.',
     'Case notes: increased soft-tissue opacity (mass) in the cranial thorax, on the right and left on the VD; dorsal and rightward deviation of the trachea; mediastinal shift to the right; multiple round soft-tissue nodules in the lungs.',
     'Case notes: cranial mediastinal mass and pulmonary nodules — R/O ectopic thyroid carcinoma, thymic tumor, MH, LSA (less likely).',
     'Cranial mediastinal mass with pulmonary nodules', tb=['thymoma'])
case('case5-gsp', 'cases', 'L7', [(71, 101), (72, 102), (73, 103)], [76], 'Case 5 · 4 yr MC German Short-haired Pointer',
     '4-year-old MC German Short-haired Pointer. Coughing.',
     'Case notes: ventral alveolar pattern in the cranial lung lobes, left caudal lung lobe, and right middle lung lobe.',
     'Case notes: bronchopneumonia, aspiration pneumonia most likely; less likely hemorrhage.', 'Aspiration pneumonia / bronchopneumonia')
case('case6-golden', 'cases', 'L7', [(79, 110), (80, 111)], [81, 83], 'Case 6 · 4 yr MC Golden Retriever',
     '4-year-old MC Golden Retriever. Returned home with a 2-inch bleeding laceration in the region of the thoracic inlet; decreased dorsal lung sounds on the right; lame on the right forelimb.',
     'Case notes: increased visualization of structures of the cranial mediastinum, vessels and esophagus; gas pocket ventral to the cardiac silhouette on the lateral with mild elevation of the heart off the sternum; mild diffuse interstitial pattern; gas in the soft tissues of the right body wall and axilla. ' + P + 'SQ gas; gas in the mediastinum; heart elevated/gas under heart.',
     'Case notes: SQ emphysema, pneumomediastinum and pneumothorax (mild), likely due to a penetrating wound.',
     'Pneumomediastinum + mild pneumothorax + SQ emphysema (penetrating wound)')
case('case7-hwd', 'cases', 'L6', [(48, 575), (49, 587)], [59], 'Case 7 · 4 yr mixed breed',
     '4-year-old mixed-breed dog. Coughing, exercise intolerance.',
     'Slide findings: convex right heart with increased sternal contact; prominent bulge in the region of the main pulmonary artery; enlarged, tortuous pulmonary arteries throughout the lung fields; mild bronchointerstitial pattern in the caudal lung lobes.',
     'Slide conclusion: heartworm disease with probable pneumonitis — right heart enlargement + pulmonary artery enlargement + mild parenchymal changes is classic in endemic regions. Next step: heartworm antigen test (CT not necessary for initial diagnosis).',
     'Heartworm disease')
case('case8-brittany', 'cases', 'L7', [(86, 118), (88, 120)], [87, 88, 89, 90, 92], 'Case 8 · 8 yr FS Brittany Spaniel',
     '8-year-old FS Brittany Spaniel. Coughing.',
     'Case notes: diffuse moderate bronchial pattern; bronchiectasis. ' + P + 'bronchiectasis and bronchial walls marked; airways that don\'t taper. Answers circled in class: bronchial pattern; bronchiectasis.',
     'Case notes: chronic lower airway disease — DDX allergic, bacterial, parasitic.', 'Chronic lower airway disease with bronchiectasis',
     extra=[('L7', 91, 126, 'Magnified airway with arrow from slide 91')])
case('case9-mainecoon', 'cases', 'L7', [(95, 129), (96, 130), (97, 131)], [99, 100, 101, 103], 'Case 9 · 4 yr MC Maine Coon',
     '4-year-old MC Maine Coon. Tachypnea.',
     'Case notes: generalized cardiomegaly (VHS 9.5; "valentine" outline on VD); left atrial / bi-atrial enlargement; interstitial to alveolar pattern, diffuse, worse ventrally (alveolar AND bronchial on the close-up); equivocal pulmonary vessel enlargement (veins; right caudal artery and vein).',
     'Case notes: cardiomegaly — cardiomyopathy (HCM, DCM, other), valvular disease, hyperthyroidism; pulmonary edema from L-CHF; pneumonia much less likely. Pre- vs post-diuretic VD shown.',
     'Cardiogenic pulmonary edema — cardiomyopathy (L-CHF)', 'Feline')


def raw_file(src, page, num):
    fs = glob.glob(f'{RAWD}/{src}/i-{page:03d}-{num:03d}.*')
    if not fs:
        raise SystemExit(f'missing raster {src} p{page} #{num}')
    return fs[0]


def _is_gray(im):
    s = im.convert('RGB').resize((48, 48))
    return sum(max(p) - min(p) for p in s.getdata()) / (48 * 48) < 10


def save_img(f, dest, mask=None, crop=None):
    im = Image.open(f)
    if crop:
        W, H = im.size
        im = im.crop((int(crop[0] * W), int(crop[1] * H), int(crop[2] * W), int(crop[3] * H)))
    im = im.convert('L') if im.mode in ('L', 'LA', 'P', 'I;16', '1') or _is_gray(im) else im.convert('RGB')
    if mask:
        d = ImageDraw.Draw(im); W, H = im.size
        for x0, y0, x1, y1 in mask:
            d.rectangle((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)), fill=0)
    im.thumbnail((1600, 1600))
    im.save(dest, quality=86, optimize=True)


def main():
    out = os.path.join(REPO, IMGDIR)
    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out + '/_answer-keys'); os.makedirs(out + '/_textbook')
    cases, manifest, keys_done, tb_done = {}, [], set(), set()
    for c in C:
        pdf, lecture, short = SRC[c['src']]
        cid = 'exam4-' + c['cid']
        d = os.path.join(out, c['section']); os.makedirs(d, exist_ok=True)
        images = []
        for n, (pg, num) in enumerate(c['imgs'], 1):
            rel = f'{IMGDIR}/{c["section"]}/{cid}__{n:02d}.jpg'
            save_img(raw_file(c['src'], pg, num), os.path.join(REPO, rel), MASK.get((c['src'], pg, num)), CROP.get((c['src'], pg, num)))
            images.append({'url': RAW_URL + rel, 'view': f'View {"ABCD"[n - 1]}', 'caption': f'{short}, slide {pg}.'})
            manifest.append({'caseId': cid, 'section': c['section'], 'repoPath': rel, 'sourceFile': pdf, 'sourcePage': pg,
                             'sha256': hashlib.sha256(open(os.path.join(REPO, rel), 'rb').read()).hexdigest()})
        for m, (src, pg, num, label) in enumerate(c['extra'], 1):
            rel = f'{IMGDIR}/_answer-keys/{cid}__cmp{m}.jpg'
            save_img(raw_file(src, pg, num), os.path.join(REPO, rel), MASK.get((src, pg, num)))
            images.append({'url': RAW_URL + rel, 'view': 'Annotated comparison · ' + label,
                           'caption': f'{label} ({SRC[src][2]}, slide {pg}). Shown after you answer.'})
        for pg in c['keys']:
            keyrel = f'{IMGDIR}/_answer-keys/{c["src"]}-p{pg:03d}.jpg'
            if keyrel not in keys_done:
                subprocess.run(['pdftoppm', '-f', str(pg), '-l', str(pg), '-r', '110', '-jpeg', '-singlefile', U + pdf,
                                os.path.join(REPO, keyrel[:-4])], check=True, stderr=subprocess.DEVNULL)
                keys_done.add(keyrel)
            images.append({'url': RAW_URL + keyrel, 'view': f'Annotated teaching key · {short} slide {pg}',
                           'caption': f'{short}, slide {pg}, with the professor\'s handwritten notes from class (if any). Answer key.'})
        for t in c['tb']:
            pg, num, crop, label = TB[t]
            rel = f'{IMGDIR}/_textbook/tb-{t}.jpg'
            if rel not in tb_done:
                save_img(raw_file('LAB', pg, num), os.path.join(REPO, rel), crop=crop); tb_done.add(rel)
            images.append({'url': RAW_URL + rel, 'view': 'Annotated textbook view · ' + label,
                           'caption': label + ' — marked textbook radiograph from the owner\'s Labeled_rads notes (textbook use permitted for this non-commercial LMU study game).'})
        title = f'Exam 4 · {short} · {c["topic"]}'
        cases[cid] = {
            'id': cid, 'kind': 'case', 'modality': 'X-ray', 'title': title[:180], 'lecture': f'CVM 743 · Exam 4 · {lecture}',
            'species': c['species'], 'region': c['region'], 'history': c['history'],
            'lookFor': 'Work systematically: technique and positioning, then heart, lungs (pattern + distribution), vessels, pleura, mediastinum, trachea, esophagus, ribs/sternum and the edges of the film. Commit to ONE primary differential.',
            'quality': '', 'findings': c['findings'], 'interpretation': c['interp'], 'differentials': '', 'why': '', 'next': '',
            'source': f'{pdf} · slide {c["imgs"][0][0]} · LMU CVM 743 course material, used with LMU permission (non-commercial)',
            'credit': G, 'images': images, 'imageReviewSlot': '', 'exam1Slot': '', 'exam2Slot': '', 'exam4Section': c['section'], 'exam4Order': len(cases) + 1,
            'imageStatus': 'LMU course radiograph extracted from lecture slides; owner-attested permission',
            'reviewStatus': 'Matched to lecture slide by Claude; findings transcribed from the slides and the professor\'s notes; not independently medically reviewed',
            'studyImageReview': {'priority': 'teaching', 'clinicalQualityVerified': False, 'note': 'Extracted from lecture slides, so resolution is limited to the slide copy. Do not measure from it.'},
            'updated': UPDATED,
        }
        if c['answer']:
            cases[cid]['answer'] = c['answer']
    os.makedirs(out + '/_guide'); os.makedirs(out + '/_skills')
    for src, pg, num, name in SKILL:
        save_img(raw_file(src, pg, num), os.path.join(out, '_skills', f'sk-{name}.jpg'))
    for src, pg in GUIDE:
        subprocess.run(['pdftoppm', '-f', str(pg), '-l', str(pg), '-r', '130', '-jpeg', '-singlefile', U + SRC[src][0],
                        os.path.join(out, '_guide', f'{src}-p{pg:03d}')], check=True, stderr=subprocess.DEVNULL)
    pubp = os.path.join(REPO, 'diagnostic-imaging-published.json')
    pub = json.load(open(pubp, encoding='utf-8'))
    for k in [k for k in pub['cases'] if k.startswith('exam4-')]:
        del pub['cases'][k]
    pub['cases'].update(cases)
    open(pubp, 'w', encoding='utf-8').write(json.dumps(pub, indent=2, ensure_ascii=False) + '\n')
    md = os.path.join(REPO, 'docs/radiology-image-manifest/exam4-image-manifest.json')
    json.dump({'version': 1, 'created': '2026-11-26', 'rightsStatus': 'owner-attested-lmu-noncommercial',
               'notesAttribution': 'Owner confirmed handwritten slide notes are the professor\'s statements (2026-11-25).',
               'textbookFigures': {k: v[3] for k, v in TB.items()}, 'sections': SECTIONS, 'images': manifest}, open(md, 'w'), indent=1)
    print(len(cases), 'cases;', len(manifest), 'student images;', len(keys_done), 'answer keys;', len(tb_done), 'textbook figures')


if __name__ == '__main__':
    main()
