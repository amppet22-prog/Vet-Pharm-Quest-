#!/usr/bin/env python3
"""Build Exam 2 (abdomen / GI / GU) radiology cases from the owner's annotated lecture PDFs.

- Student images are the clean embedded rasters (the professor's handwriting is a separate
  ink layer and is not inside them).
- The annotated slide (professor's handwritten notes) is rendered as the hidden answer key.
- 'findings' / 'interpretation' contain only what the slides or the professor's notes state
  (owner confirmed the handwritten slide notes are the professor's statements).
Outputs images + manifest into OUT, and cases (ids "exam2-*") into the repo's
diagnostic-imaging-published.json.
"""
import json, os, re, subprocess, sys, glob, hashlib, shutil
from PIL import Image

REPO = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/vet-pharm-quest-'
RAWD = '/home/claude/pack2/raw'
U = '/mnt/user-data/uploads/'
SRC = {
 'cases': ('b9a1845d-AbdomenCasesFa26.pdf', 'Abdomen Cases (Fall 2026)', 'Abdomen Cases', 'Images courtesy of Dr. Rick Widmer; case discussion by Dr. Rebekah Gallaher, LMU CVM'),
 'gi': ('e0da0772-GastrointestinalPrinciplesPost.pdf', 'Gastrointestinal Principles I & II', 'GI Principles', 'Dr. Rebekah Gallaher, DACVR, LMU CVM'),
 'abd': ('fea14ada-AbdomenPrinciplesIandIIPost.pdf', 'Abdomen Principles I & II', 'Abdomen Principles', 'Dr. Rebekah Gallaher, DACVR, LMU CVM'),
 'normal': ('1060df36-NormalRadiographicAnatomyAbdomenFa26.pdf', 'Normal Radiographic Anatomy: Abdomen', 'Normal Abdomen', 'Dr. Victoria Morris, LMU CVM'),
 'gu': ('Genitourinary.pdf', 'Genitourinary Principles', 'GU Principles', 'Dr. Rebekah Gallaher, DACVR, LMU CVM'),
}
RAW_URL = 'https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/'
IMGDIR = 'radiology-course-photos/exam2'
EXCLUDE = {('gi', 21, '019'),   # phone photo of the projector screen (has the title in it)
           ('abd', 35, '034'),  # phone photo of the projector screen
           ('normal', 16, '035'),  # stock kitten photo, not a radiograph
           ('abd', 53, '056'),  # 'Normal' label burned into the image
           ('gi', 11, '008')}   # cropped detail; the two full views (009, 010) are used
UPDATED = '2026-11-26T05:30:00Z'

# section keys used by the Exam 2 hub
SECTIONS = {'start': 'Start here · course cases', 'gi': 'GI tract · stomach, ileus, foreign bodies, colon',
            'abd': 'Abdominal principles · serosal detail, mass effect, free gas, liver & spleen',
            'normal': 'Normal abdomen', 'gu': 'Genitourinary · kidneys, bladder, uterus & prostate'}

C = []  # case specs
def case(cid, slot, section, src, pages, key, topic, history='', findings='', interp='', imgs=None, kind='case', species='', region='', notes_normal=False):
    C.append(dict(cid=cid, slot=slot, section=section, src=src, pages=pages, key=key, topic=topic, history=history,
                  findings=findings, interp=interp, imgs=imgs, kind=kind, species=species, region=region, notes_normal=notes_normal))

# ---------------- Course cases (owner's annotated copy; professor's in-class notes) ----------------
case('case1-dsh', 'e2-serosal', 'start', 'cases', [4, 5], 4, 'Abdomen case 1 · effusion, mixed intestinal gas and mass effect',
     '10-year-old DSH cat. Anorexia; no other information provided.',
     'Professor\'s notes: two views. Loss of serosal detail in the abdomen with a fluid-filled appearance (ascites). Increased radiolucency in the stomach, small intestine and colon; small-intestinal gas distension with multiple populations; greater gas distension in the fundus. Mass effect with leftward displacement. Small mineral/radiopaque material that appears to be bone in the intestines; some fecal material in the rectum and colon. If there were a perforation you would also expect free gas.',
     'Differentials discussed in class: ruptured mass (neoplasia), hemoabdomen, foreign-body perforation, ascites (e.g., right-sided heart failure), distended bladder. Radiographs alone do not give the final diagnosis.',
     species='Feline', region='Abdomen')
case('case2-dog-mass', 'e2-mass-effect', 'start', 'cases', [8, 9], 8, 'Abdomen case 2 · mid-abdominal mass',
     '8-year-old mixed-breed dog. Pale mucous membranes, extreme lethargy.',
     'Professor\'s notes: rounded liver margins, but the liver stays within the rib cage. Mid-abdominal soft-tissue mass with summation and border effacement where structures overlap. Ventral/caudal displacement of the intestines. Colon contains mixed radiopaque fecal material.',
     'Mid-abdominal mass. Abdominal ultrasound is needed to determine where the mass comes from; you cannot know from radiographs alone.',
     species='Canine', region='Abdomen')
case('case3-dmh-hairties', 'e2-ileus-equivocal', 'start', 'cases', [12, 13], 13, 'Abdomen case 3 · equivocal intestinal pattern',
     '2-year-old DMH cat. History of eating hair ties; anorexia, lethargy.',
     'Professor\'s notes: abnormal arrangement of the small intestine ("tortuous turns", "stacking"). Mixed populations of intestinal diameter. Colon enlarged with fecal material (constipation). The border of the spleen is not clearly seen.',
     'Equivocal. Rule-outs: constipation, foreign body, and ileus (functional or mechanical); the radiologist stated either. Plan discussed in class: enema, then repeat radiographs (the enema will introduce some gas). Decide on surgery from the clinical signs (GI signs, litter box); if the cat has not defecated within 1–2 hours, exploratory surgery is better than not, but be transparent with the owner about cost.',
     species='Feline', region='Abdomen')

# ---------------- GI Principles patients ----------------
case('gi-lab-mechanical', 'e2-ileus-mechanical', 'gi', 'gi', [18], 18, 'GI patient · intestinal gas pattern (Labrador)',
     '2-year-old FS Labrador. Vomited 2 days ago, lethargy, anorexia.',
     'Professor\'s notes: mixed population of gas-dilated small intestine. Soft tissue with a textile-like texture on the VD view.',
     'Mechanical ileus due to an intraluminal foreign body.', species='Canine', region='Abdomen')
case('gi-gsd-functional', 'e2-ileus-functional', 'gi', 'gi', [21, 22], 21, 'GI patient · intestinal gas pattern (German Shepherd puppy)',
     '4-month-old MI German Shepherd. Vomiting for 24 hours, lethargy, anorexia.',
     'Professor\'s notes: mildly dilated small intestines with good segmental gas and colonic content. This is not a mixed population.',
     'Functional ileus. Diagnosis given: viral enteritis ± parvovirus.', imgs=[(21, '018'), (22, '021')], species='Canine', region='Abdomen')
case('gi-minpin-linear', 'e2-linear-fb', 'gi', 'gi', [24], 24, 'GI patient · intestinal gas shapes (Min Pin)',
     '1-year-old FS Miniature Pinscher. Vomiting since yesterday, straining to defecate this morning.',
     'Professor\'s notes: discrete gas opacities that are well defined with irregular shapes; serosal margins irregular and constrained. Linear foreign bodies need to be "anchored" somewhere: in cats the anchor point is the tongue, in dogs it is normally the pylorus (so plication shows in the duodenum). Look for small, irregular, crescent/comma-shaped gas pockets.',
     'Linear foreign body (dog).', species='Canine', region='Abdomen')
case('gi-dsh-linear-compression', 'e2-ileus-linear-fb-comparison', 'gi', 'gi', [26], 25, 'GI patient · intestinal pattern with compression view (young cat)',
     '1-year-old FS DSH. Vomiting and anorexia.',
     'Professor\'s notes: small intestine clumped with irregular gas shapes (comma, ovoid). On the compression (spoon) study you should see the small-intestinal segments spread apart; here they do not. Large spleen noted.',
     'Linear foreign body (cat).', imgs=[(26, '028'), (26, '029')], species='Feline', region='Abdomen')
case('gi-dsh-plication', 'e2-linear-fb', 'gi', 'gi', [27], 27, 'GI patient · intestinal pattern (adult cat)',
     '3-year-old FS DSH. Vomiting.',
     'Professor\'s notes: obvious plication; clumped intestines; summation effect; suspicious area marked on the lateral.',
     'Plication consistent with a linear foreign body.', species='Feline', region='Abdomen')
case('gi-gsd-generalized', 'e2-ileus', 'gi', 'gi', [30], 30, 'GI patient · generalized intestinal gas (adult German Shepherd)',
     '7-year-old MI German Shepherd. Vomiting and hematochezia for 1 day, recumbent.',
     'Professor\'s notes: all of the small intestine is affected, distended with gas.',
     'Severe generalized small-intestinal gas distension. The lecture presents this case together with intestinal torsion and volvulus, which are life-threatening; check the annotated slide and lecture for the final call.', species='Canine', region='Abdomen')
case('gi-pitbull-colon', 'e2-colon', 'gi', 'gi', [32, 33], 32, 'GI patient · colon (older Pit Bull)',
     '12-year-old F Pit Bull. Vomiting, inappetence for 3–4 days, weight loss.',
     'Professor\'s notes: colon distended with hard fecal material; ventral mass effect noted. A barium enema was used to evaluate the colon.',
     'Colonic distension with retained hard feces, evaluated further with a barium enema.', species='Canine', region='Abdomen / colon')
case('gi-lab-fb-colonogram', 'e2-colon', 'gi', 'gi', [60, 61], 60, 'GI patient · small intestine or colon? (young Labrador)',
     '1-year-old MI Labrador. Vomiting, inappetence, history of foreign-body ingestion.',
     'Professor\'s notes: is the distended loop colon or small intestine? A pneumocolonogram (air in the colon) answers that. Compare a fixed narrow point (stricture, dilated on both sides) with normal peristaltic narrowing ("squeeze").',
     'Pneumocolonogram used to separate colon from small intestine; stricture versus normal peristalsis discussed.', species='Canine', region='Abdomen')
case('gi-gdv', 'e2-gdv', 'gi', 'gi', [11], 11, 'GI · stomach position and shape',
     'Teaching example from the GI Principles lecture.',
     'Slide: compartmentalization; pylorus located dorsally and to the left; splenomegaly; megaesophagus.', 'Gastric dilatation-volvulus (GDV).', species='Canine', region='Stomach')

# ---------------- Abdomen Principles teaching slides ----------------
for p, topic, slot, interp in [
    (16, 'Serosal detail · normal vs abnormal', 'e2-serosal', 'Normal serosal detail is sharp and well defined; abnormal is loss of detail at the borders of the organs.'),
    (20, 'Peritoneal effusion', 'e2-serosal', 'Peritoneal effusion: loss of serosal detail.'),
    (21, 'Serosal detail in a normal puppy', 'e2-serosal', 'Normal puppy: reduced serosal detail is expected (little abdominal fat).'),
    (22, 'Serosal detail in an overconditioned patient', 'e2-serosal', 'Overconditioned: abundant fat gives excellent serosal detail.'),
    (23, 'Serosal detail with poor body condition', 'e2-serosal', 'Poor body condition: little fat, so serosal detail is reduced without disease.'),
    (35, 'Retroperitoneal detail', 'e2-serosal', 'Loss of retroperitoneal detail: poor visibility of the kidneys and ventral displacement of the intestines and colon. Causes: hemorrhage, urine, neoplasia, abscess, FB granuloma.'),
    (24, 'Mass effect · abdominal mass', 'e2-mass-effect', 'Abdominal mass with displacement of surrounding organs.'),
    (28, 'Mass effect · distended stomach', 'e2-mass-effect', 'Distended stomach displacing surrounding organs.'),
    (29, 'Mass effect · splenic mass', 'e2-mass-effect', 'Splenic mass.'),
    (38, 'Free abdominal gas · example 1', 'e2-free-gas', 'Free peritoneal gas (pneumoperitoneum).'),
    (39, 'Free abdominal gas · example 2', 'e2-free-gas', 'Free peritoneal gas (pneumoperitoneum).'),
    (40, 'Free abdominal gas · example 3', 'e2-free-gas', 'Free peritoneal gas (pneumoperitoneum).'),
    (42, 'Free abdominal gas · horizontal-beam view', 'e2-free-gas', 'Horizontal-beam radiography detects free gas: dorsal or left lateral recumbency, wait 5–10 minutes.'),
    (45, 'Liver size · comparison', 'e2-liver-spleen', 'Generalized hepatomegaly (compare with the normal view on the slide).'),
    (46, 'Liver size · second example', 'e2-liver-spleen', 'Generalized hepatomegaly.'),
    (51, 'Liver · focal change', 'e2-liver-spleen', 'Focal liver mass.'),
    (53, 'Liver size · small-liver comparison', 'e2-liver-spleen', 'Microhepatia (compare with the normal view on the slide).'),
    (54, 'Liver size · VD comparison', 'e2-liver-spleen', 'Microhepatia versus normal.'),
    (59, 'Spleen size · example 1', 'e2-liver-spleen', 'Generalized splenomegaly.'),
    (62, 'Spleen size · example 2', 'e2-liver-spleen', 'Generalized splenomegaly.'),
]:
    case(f'abd-p{p:02d}', slot, 'abd', 'abd', [p], p, topic, 'Teaching image from the Abdomen Principles I & II lecture.', '', interp, species='', region='Abdomen', notes_normal=p in (45, 53, 54))

# ---------------- Normal abdomen ----------------
for pages, key, topic, slot, interp in [
    ([3], 3, 'Standard abdominal views', 'e2-normal-abdomen', 'Standard views: lateral and ventrodorsal.'),
    ([11], 11, 'Normal liver · lateral', 'e2-liver-spleen', 'Normal liver on the lateral: cranial abdomen between stomach and diaphragm, homogeneous soft tissue, contained within the costal arch.'),
    ([12, 13], 12, 'Normal liver · VD and stomach fill', 'e2-liver-spleen', 'VD liver; position depends on stomach fill (a full stomach can slightly displace the liver).'),
    ([14, 15], 14, 'Normal canine spleen', 'e2-liver-spleen', 'Canine spleen: mid-left abdomen, homogeneous soft tissue; the head sits near the gastric fundus.'),
    ([16, 17], 16, 'Normal feline spleen', 'e2-liver-spleen', 'Feline spleen: commonly seen only on the VD and sometimes not at all; if seen on both lateral and VD, suspect enlargement.'),
    ([21, 22], 21, 'Normal kidneys', 'e2-kidney', 'Normal kidneys on lateral and VD.'),
    ([25, 26], 25, 'Normal urinary bladder', 'e2-urinary', 'Urinary bladder: caudal abdomen, homogeneous soft tissue (gas only after cystocentesis or catheterization).'),
    ([30], 30, 'Normal stomach · gas and fluid by recumbency', 'e2-normal-abdomen', 'Right lateral: fluid in pylorus, gas in fundus (fluid-filled pylorus can look round). Left lateral: gas rises into the pylorus.'),
    ([35], 35, 'Normal large intestine', 'e2-colon', 'Large intestine: soft-tissue feces and gas common, rarely fluid-filled.'),
]:
    case(f'normal-p{pages[0]:02d}', slot, 'normal', 'normal', pages, key, topic, 'Teaching image from the Normal Radiographic Anatomy: Abdomen lecture.', '', interp, kind='normal', region='Abdomen')

# ---------------- Genitourinary ----------------
case('gu-adrenal-mass', 'e2-mass-effect', 'gu', 'gu', [4], 4, 'GU patient · retroperitoneal changes (older dog)',
     '12-year-old MN mixed-breed dog. Vomiting and lethargy with suspected foreign body.',
     'Professor\'s notes: dorsally positioned mass in the cranial retroperitoneum pushing the left kidney caudally; loss of serosal detail with some free fluid.',
     'Retroperitoneal mass effect from an adrenal mass: ventral displacement of the small intestines and caudolateral displacement of the kidney.', species='Canine', region='Retroperitoneum')
case('gu-cat-renomegaly', 'e2-kidney', 'gu', 'gu', [7], 7, 'GU patient · kidney size (older cat)',
     '8-year-old MN cat. Weight loss.',
     'Professor\'s notes: renomegaly, smooth and bilateral.', 'Bilateral smooth renomegaly; hydronephrosis was suggested, with ultrasound needed to confirm.', species='Feline', region='Kidneys')
case('gu-scottie-renal', 'e2-kidney', 'gu', 'gu', [11], 11, 'GU patient · acutely down in the rear (Scottish Terrier)',
     '7-year-old FS Scottish Terrier. Acutely down in the rear.',
     'Professor\'s notes: large mass on the right (renal) side displacing intestines; the lateral looks fairly normal.', 'Renal neoplasia; carcinoma is most common.', species='Canine', region='Kidneys')
for p, topic, interp in [(14, 'Uroliths · example', 'Radiopaque uroliths.'), (20, 'Urolith opacity', 'Radiopaque: struvite, calcium oxalate, calcium carbonate, silica. Radiolucent: urate, xanthine (cystine variable).'),
                         (22, 'Bladder gas', 'Emphysematous cystitis: gas in the bladder wall/lumen; almost always associated with glucosuria, most commonly diabetes mellitus.')]:
    case(f'gu-p{p:02d}', 'e2-urinary', 'gu', 'gu', [p], p, topic, 'Teaching image from the Genitourinary Principles lecture.', '', interp, region='Urinary tract')
case('gu-beagle', 'e2-urinary', 'gu', 'gu', [23], 23, 'GU patient · straining to urinate (Beagle)',
     '8-year-old MN Beagle. 1 day of anorexia, straining to urinate, recent lack of urination; cystotomy for cystoliths 6 months ago.',
     'Professor\'s notes: gas in the bladder (emphysematous cystitis). Stones wedged at the os penis are easily missed, so take a view that includes the perineal region.',
     'Emphysematous cystitis with recurrent urethral calculi.', species='Canine', region='Urinary tract')
for p, topic, interp in [(25, 'Uterus · enlargement', 'Enlarged uterus displacing the small intestine; could be pregnancy if the patient is otherwise fine, pyometra if the patient is sick.'),
                         (26, 'Uterus · enlargement, second example', 'Folding of the enlarged uterus with mass effect.'),
                         (27, 'Uterus · late gestation', 'Gravid uterus.'),
                         (28, 'Uterus · abnormal pregnancy', 'Abnormal pregnancy / dystocia: look for signs of fetal death and malpositioned fetuses.'),
                         (30, 'Prostate', 'Prostatomegaly.')]:
    case(f'gu-p{p:02d}', '', 'gu', 'gu', [p], p, topic, 'Teaching image from the Genitourinary Principles lecture.', '', interp, region='Reproductive tract')
case('gu-corgi', '', 'gu', 'gu', [31], 31, 'GU patient · painful hind region (Corgi)',
     '3-year-old MN Corgi. Painful hind region.', 'Professor\'s notes: caudal abdominal structures outlined near the pelvic inlet; see the annotated slide.', 'See the annotated slide for the professor\'s interpretation.', species='Canine', region='Caudal abdomen')



# Short answer labels for multiple choice (from the professor's notes / slide titles). None = free-text only.
ANSWERS = {
 'case1-dsh': 'Peritoneal effusion with mixed intestinal gas and mass effect', 'case2-dog-mass': 'Mid-abdominal mass (needs ultrasound for origin)',
 'case3-dmh-hairties': 'Equivocal: constipation vs foreign body vs ileus',
 'gi-lab-mechanical': 'Mechanical ileus (intraluminal foreign body)', 'gi-gsd-functional': 'Functional ileus (viral enteritis/parvo)',
 'gi-minpin-linear': 'Linear foreign body', 'gi-dsh-linear-compression': 'Linear foreign body', 'gi-dsh-plication': 'Linear foreign body (plication)',
 'gi-gsd-generalized': None, 'gi-pitbull-colon': 'Colonic distension with retained feces', 'gi-lab-fb-colonogram': None, 'gi-gdv': 'Gastric dilatation-volvulus (GDV)',
 'abd-p16': None, 'abd-p20': 'Peritoneal effusion', 'abd-p21': 'Normal puppy (low serosal detail is expected)', 'abd-p22': 'Overconditioned (excellent serosal detail)',
 'abd-p23': 'Poor body condition (reduced serosal detail)', 'abd-p35': 'Loss of retroperitoneal detail', 'abd-p24': 'Abdominal mass with organ displacement',
 'abd-p28': 'Distended stomach', 'abd-p29': 'Splenic mass', 'abd-p38': 'Pneumoperitoneum (free abdominal gas)', 'abd-p39': 'Pneumoperitoneum (free abdominal gas)',
 'abd-p40': 'Pneumoperitoneum (free abdominal gas)', 'abd-p42': 'Pneumoperitoneum (free abdominal gas)', 'abd-p45': 'Generalized hepatomegaly', 'abd-p46': 'Generalized hepatomegaly',
 'abd-p51': 'Focal liver mass', 'abd-p53': 'Microhepatia', 'abd-p54': 'Microhepatia', 'abd-p59': 'Generalized splenomegaly', 'abd-p62': 'Generalized splenomegaly',
 'gu-adrenal-mass': 'Retroperitoneal (adrenal) mass', 'gu-cat-renomegaly': 'Bilateral smooth renomegaly', 'gu-scottie-renal': 'Renal mass (neoplasia)',
 'gu-p14': 'Radiopaque uroliths', 'gu-p20': None, 'gu-p22': 'Emphysematous cystitis', 'gu-beagle': 'Emphysematous cystitis with urethral calculi',
 'gu-p25': 'Uterine enlargement', 'gu-p26': 'Uterine enlargement', 'gu-p27': 'Gravid uterus', 'gu-p28': 'Dystocia / abnormal pregnancy', 'gu-p30': 'Prostatomegaly', 'gu-corgi': None,
}


def page_images(src, page):
    return sorted(f for f in glob.glob(f'{RAWD}/{src}/img-{page:03d}-*.png') if (src, page, f[-7:-4]) not in EXCLUDE)


def main():
    out = os.path.join(REPO, IMGDIR)
    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out + '/_answer-keys')
    queue = open(os.path.join(REPO, 'radiology-image-approval-queue.js'), encoding='utf-8').read()
    questions = {m.group(1): m.group(3) for m in re.finditer(r"\{id:['\"]([a-z0-9-]+)['\"].*?question:(['\"])(.*?)\2", queue)}
    cases, manifest, keys_done = {}, [], set()
    for c in C:
        pdf, lecture, short, credit = SRC[c['src']]
        if c['imgs']:
            files = [f'{RAWD}/{c["src"]}/img-{p:03d}-{i}.png' for p, i in c['imgs']]
        else:
            files = [f for p in c['pages'] for f in page_images(c['src'], p)]
        files = [f for f in files if os.path.exists(f)][:2]
        if not files:
            print('NO IMAGES', c['cid']); continue
        cid = 'exam2-' + c['cid']
        d = os.path.join(out, c['section'])
        os.makedirs(d, exist_ok=True)
        images = []
        for n, f in enumerate(files, 1):
            im = Image.open(f)
            im = im.convert('L') if im.mode in ('L', 'LA', 'P', 'I;16', '1') or im.mode == 'RGB' and _is_gray(im) else im.convert('RGB')
            im.thumbnail((1600, 1600))
            rel = f'{IMGDIR}/{c["section"]}/{cid}__{n:02d}.jpg'
            im.save(os.path.join(REPO, rel), quality=88, optimize=True)
            pg = int(os.path.basename(f).split('-')[1])
            cap = f'{short}, slide {pg}.'
            if c['notes_normal']:
                cap += ' The slide pairs an abnormal and a Normal view; the teaching key shows which is which.'
            images.append({'url': RAW_URL + rel, 'view': f'View {"AB"[n - 1]}', 'caption': cap})
            manifest.append({'caseId': cid, 'slotId': c['slot'], 'section': c['section'], 'repoPath': rel, 'sourceFile': pdf,
                             'sourcePage': pg, 'sha256': hashlib.sha256(open(os.path.join(REPO, rel), 'rb').read()).hexdigest()})
        keyrel = f'{IMGDIR}/_answer-keys/{c["src"]}-p{c["key"]:03d}.jpg'
        if keyrel not in keys_done:
            subprocess.run(['pdftoppm', '-f', str(c['key']), '-l', str(c['key']), '-r', '110', '-jpeg', '-singlefile', U + pdf,
                            os.path.join(REPO, keyrel[:-4])], check=True, stderr=subprocess.DEVNULL)
            keys_done.add(keyrel)
        images.append({'url': RAW_URL + keyrel, 'view': 'Annotated teaching key · lecture slide with professor\'s notes',
                       'caption': 'Lecture slide with the professor\'s handwritten notes from class. Answer key.'})
        q = questions.get(c['slot'], '')
        title = f'Exam 2 · {short} · {c["topic"]}'
        cases[cid] = {
            'id': cid, 'kind': c['kind'], 'modality': 'X-ray', 'title': title[:180], 'lecture': f'CVM 743 · Exam 2 · {lecture}',
            'species': c['species'], 'region': c['region'], 'history': c['history'],
            'lookFor': ((q + '\n') if q else '') + 'Work systematically: views and positioning, then each organ system (liver, spleen, stomach, small intestine, colon, kidneys, bladder), serosal and retroperitoneal detail, then Roentgen signs before naming a diagnosis.',
            'quality': '', 'findings': c['findings'] or ('Slide: ' + c['interp'] if c['kind'] == 'normal' else ''), 'interpretation': c['interp'],
            'differentials': '', 'why': '', 'next': '',
            'source': f'{pdf} · slide {c["pages"][0]} · LMU CVM 743 course material, used with LMU permission (non-commercial)',
            'credit': credit, 'images': images, 'imageReviewSlot': c['slot'], 'exam1Slot': '', 'exam2Slot': '',
            'exam2Section': c['section'],
            'imageStatus': 'LMU course radiograph extracted from lecture slides; owner-attested permission',
            'reviewStatus': 'Matched to lecture slide by Claude; findings transcribed from the professor\'s slide notes; not independently medically reviewed',
            'studyImageReview': {'priority': 'teaching', 'clinicalQualityVerified': False, 'note': 'Extracted from lecture slides, so resolution is limited to the slide copy. Do not measure from it.'},
            'updated': UPDATED,
        }
        if ANSWERS.get(c['cid']):
            cases[cid]['answer'] = ANSWERS[c['cid']]
    pubp = os.path.join(REPO, 'diagnostic-imaging-published.json')
    pub = json.load(open(pubp, encoding='utf-8'))
    for k in [k for k in pub['cases'] if k.startswith('exam2-')]:
        del pub['cases'][k]
    pub['cases'].update(cases)
    open(pubp, 'w', encoding='utf-8').write(json.dumps(pub, indent=2, ensure_ascii=False) + '\n')
    md = os.path.join(REPO, 'docs/radiology-image-manifest/exam2-image-manifest.json')
    json.dump({'version': 1, 'created': '2026-11-26', 'rightsStatus': 'owner-attested-lmu-noncommercial',
               'notesAttribution': 'Owner confirmed handwritten slide notes are the professor\'s statements (2026-11-25).',
               'sections': SECTIONS, 'images': manifest}, open(md, 'w'), indent=1)
    print(len(cases), 'cases;', len(manifest), 'student images;', len(keys_done), 'answer keys')


def _is_gray(im):
    s = im.convert('RGB').resize((48, 48))
    return sum(max(p) - min(p) for p in s.getdata()) / (48 * 48) < 10


if __name__ == '__main__':
    main()
