#!/usr/bin/env python3
"""Build the VPQ Exam 3 radiology photo pack from extracted course images.
Student images = clean embedded rasters (slide text/labels are NOT burned in).
Answer keys = rendered slide pages (instructor labels/arrows/text visible)."""
import json, os, shutil, subprocess, hashlib
from PIL import Image

RAW = '/home/claude/pack/raw'
PRAC = '/home/claude/pack/msk-practice'
OUT = '/home/claude/pack/VPQ_Radiology_Exam3_Photo_Pack'
U = '/mnt/user-data/uploads/'
PDF = {'msk1': ('MSK1FALL26 (1).pdf', U + 'd93647b2-MSK1FALL26_1.pdf'),
       'msk2': ('MSK2FALL2026 (1).pdf', U + '5eb64d9f-MSK2FALL2026_1.pdf'),
       'spine': ('Spineandskull2026(2).pdf', U + 'cad5c0b5-Spineandskull2026.pdf')}
RIGHTS = 'owner-attested-lmu-noncommercial'

# (slot, src, page, img, role, label, species, region, projection, slide_says, note)
# role: student = unlabeled quiz image; normal-compare = slide marks it Normal; verify = needs owner check
S = []
def add(slot, src, page, img, role, label, species, region, proj, says, note=''):
    S.append(dict(slot=slot, src=src, page=page, img=img, role=role, label=label, species=species,
                  region=region, projection=proj, slideSays=says, note=note))

# ---------- Practice cases (pptx) ----------
P = 'MSKPracticecases (1).pptx'
add('e3-practice-hip-gsd', 'pptx', 3, 'image1-left', 'student', 'case1-lateral-pelvis', 'canine (6 yo MN GSD)', 'pelvis / coxofemoral', 'lateral', 'Case 1: 6 yo MN German Shepherd, slow getting up (slide 2). No diagnosis on slides.')
add('e3-practice-hip-gsd', 'pptx', 3, 'image1-right', 'student', 'case1-vd-pelvis', 'canine (6 yo MN GSD)', 'pelvis / coxofemoral', 'VD (extended-leg)', 'Same patient as lateral (single slide-3 composite).')
add('e3-practice-mastiff-forelimb', 'pptx', 5, 'image2-left', 'student', 'case2-right-distal-forelimb-lateral', 'canine (8 yo FS English Mastiff)', 'right distal antebrachium / carpus', 'mediolateral', 'Case 2: 8 yo FS English Mastiff, lame right forelimb (slide 4). No diagnosis on slides.')
add('e3-practice-mastiff-forelimb', 'pptx', 5, 'image2-right', 'student', 'case2-right-distal-forelimb-crcd', 'canine (8 yo FS English Mastiff)', 'right distal antebrachium / carpus', 'craniocaudal (DP)', 'Same patient (slide-5 composite).')
add('e3-practice-puppy-lameness', 'pptx', 7, 'image3', 'student', 'case3-right-femur-lateral', 'canine (8 mo MN mixed breed)', 'right femur / stifle', 'mediolateral', 'Case 3: 8 mo MN mixed breed, shifting limb lameness, fever, lethargy (slide 6). No diagnosis on slides.')
add('e3-practice-puppy-lameness', 'pptx', 7, 'image4', 'student', 'case3-right-femur-crcd', 'canine (8 mo MN mixed breed)', 'right femur', 'craniocaudal', 'Same patient (slide 7).')

# ---------- MSK I ----------
add('e3-bone-osteopenia', 'msk1', 19, '020', 'answer-key-only', 'generalized-osteopenia-normal-vs-affected', 'feline (appearance; verify)', 'whole body lateral', 'lateral (two patients stacked)', 'Slide "Generalized osteopenia": top labeled Normal, bottom labeled Osteopenia (labels are slide text, not in image).', 'Composite of two animals; top=normal, bottom=osteopenia per slide.')
add('e3-bone-osteopenia', 'msk1', 20, '021', 'student', 'regional-osteopenia-a', 'canine (verify)', 'distal limb with orthopedic wire/pins', 'CrCd/DP', 'Slide "Regional osteopenia".', 'Implants present: likely disuse/post-op regional osteopenia; slide does not state cause.')
add('e3-bone-osteopenia', 'msk1', 20, '022', 'student', 'regional-osteopenia-b', 'canine (verify)', 'distal limb with orthopedic wire/pins', 'oblique/lateral', 'Slide "Regional osteopenia".')
add('e3-bone-osteopenia', 'msk1', 20, '023', 'student', 'regional-osteopenia-zoom', 'canine (verify)', 'carpus/tarsus close-up', 'zoom', 'Slide "Regional osteopenia" close-up.')
add('e3-djd-stifle', 'msk1', 24, '024', 'normal-compare', 'stifle-normal-lateral', 'canine', 'stifle', 'lateral', 'Slide "Increased synovial mass": small top-right image labeled Normal.')
add('e3-djd-stifle', 'msk1', 24, '025', 'student', 'stifle-increased-synovial-mass-a', 'canine', 'stifle', 'lateral', 'Slide "Increased synovial mass" (fluid vs soft tissue; effusion or synovial proliferation).')
add('e3-djd-stifle', 'msk1', 25, '026', 'student', 'stifle-increased-synovial-mass-b', 'canine', 'stifle', 'lateral', 'Slide "Increased synovial mass".')
add('e3-djd-stifle', 'msk1', 25, '027', 'student', 'stifle-increased-synovial-mass-c', 'canine', 'stifle', 'lateral', 'Slide "Increased synovial mass".')
add('e3-djd-stifle', 'msk1', 34, '032', 'student', 'stifle-oa-lateral', 'canine', 'stifle', 'lateral', 'Slide "Radiographic features of OA".')
add('e3-djd-stifle', 'msk1', 34, '033', 'student', 'stifle-oa-crcd', 'canine', 'stifle', 'craniocaudal', 'Slide "Radiographic features of OA".')
add('e3-djd-stifle', 'msk1', 34, '034', 'answer-key-only', 'stifle-normal-lateral-crcd', 'canine', 'stifle', 'lateral + CrCd composite', 'Slide labels this composite Normal.')
add('e3-djd-stifle', 'msk1', 35, '035', 'student', 'stifle-effusion-subluxation-crcl', 'canine', 'stifle', 'lateral', 'Slide "Stifle effusion and subluxation due to cranial cruciate ligament rupture".', 'Radiographs show indirect signs only; CrCL rupture is the slide diagnosis.')
add('e3-djd-stifle', 'msk1', 35, '036', 'normal-compare', 'stifle-normal-lateral-r', 'canine', 'right stifle', 'lateral', 'Slide labels this image Normal.')
add('e3-ocd-shoulder', 'msk1', 40, '037', 'student', 'ocd-caudal-humeral-head-a', 'canine', 'shoulder', 'lateral', 'Slide "OC/OCD caudal humeral head: subchondral sclerosis, concavity or flattening".')
add('e3-ocd-shoulder', 'msk1', 41, '038', 'student', 'ocd-caudal-humeral-head-flap', 'canine', 'shoulder', 'lateral', 'Slide adds "mineralized flap".')
add('e3-bsava-elbow', 'msk1', 42, '039', 'student', 'oc-medial-humeral-condyle', 'canine', 'elbow', 'craniocaudal', 'Slide "OC/OCD medial aspect of humeral condyle".', 'Course image offered as alternative to BSAVA p.276 figure.')
add('e3-bsava-elbow', 'msk1', 78, '072', 'student', 'elbow-oblique-a', 'canine', 'elbow', 'oblique (Cr15L-CdMO per slide 77 list; verify)', 'Slide "Oblique view - best visibility of medial compartment".')
add('e3-bsava-elbow', 'msk1', 78, '073', 'student', 'elbow-oblique-b', 'canine', 'elbow', 'oblique/lateral (verify)', 'Same slide.')
add('e3-bsava-elbow', 'msk1', 85, '080', 'student', 'uap-a', 'canine', 'elbow', 'flexed lateral', 'Slide "Ununited anconeal process (UAP)".')
add('e3-bsava-elbow', 'msk1', 85, '081', 'student', 'uap-b', 'canine', 'elbow', 'flexed lateral', 'Slide "Ununited anconeal process (UAP)".')
add('e3-bsava-elbow', 'msk1', 86, '082', 'answer-key-only', 'uap-vs-not-uap', 'canine', 'elbow', 'flexed lateral pair', 'Slide labels left UAP, right "Not UAP" (labels are slide text).')
add('e3-bsava-elbow', 'msk1', 89, '083', 'student', 'fmcp', 'canine', 'elbow', 'lateral', 'Slide "FMCP".')
add('e3-bsava-elbow', 'msk1', 89, '084', 'normal-compare', 'elbow-normal-lateral-a', 'canine', 'elbow', 'lateral', 'Slide labels this image Normal.')
add('e3-bsava-elbow', 'msk1', 91, '086', 'student', 'elbow-joint-incongruity', 'canine', 'elbow', 'lateral', 'Slide "Joint incongruity": radioulnar step, widened humeroulnar joint space, elongated trochlear notch, cranially positioned humeral condyle.')
add('e3-bsava-elbow', 'msk1', 91, '085', 'normal-compare', 'elbow-normal-lateral-b', 'canine', 'elbow', 'lateral', 'Slide labels this image Normal.')

# ---------- MSK II ----------
add('e3-msk2-lysis-pattern', 'msk2', 4, '000', 'student', 'cortical-disruption-a', 'canine', 'proximal humerus', 'lateral', 'Slide "Cortical disruption - aggressive; makes pathologic fracture more likely".')
add('e3-msk2-lysis-pattern', 'msk2', 4, '001', 'student', 'cortical-disruption-b-zoom', 'canine', 'proximal humerus', 'lateral zoom', 'Same slide.')
add('e3-msk2-lysis-pattern', 'msk2', 6, '003', 'student', 'geographic-lysis-a', 'canine', 'long bone', 'lateral', 'Slide "Geographic lysis".')
add('e3-msk2-lysis-pattern', 'msk2', 6, '005', 'student', 'geographic-lysis-b', 'canine', 'stifle / distal femur', 'CrCd', 'Slide "Geographic lysis".')
add('e3-msk2-lysis-pattern', 'msk2', 8, '009', 'student', 'expansile-lysis', 'canine', 'manus/pes', 'DP', 'Slide "Expansile lysis".')
add('e3-msk2-lysis-pattern', 'msk2', 9, '011', 'student', 'moth-eaten-lysis', 'canine', 'humerus', 'lateral', 'Slide "Moth-eaten lysis".')
add('e3-msk2-lysis-pattern', 'msk2', 10, '012', 'student', 'permeative-lysis', 'canine', 'humerus', 'lateral', 'Slide "Permeative lysis".')
add('e3-msk2-periosteal', 'msk2', 14, '016', 'student', 'periosteal-solid', 'canine', 'long bone', 'lateral', 'Slide "Solid" periosteal reaction.')
add('e3-msk2-periosteal', 'msk2', 16, '019', 'student', 'periosteal-lamellar-a', 'canine', 'long bone', 'CrCd', 'Slide "Lamellar" (onion skin; seen in HOD).')
add('e3-msk2-periosteal', 'msk2', 16, '020', 'student', 'periosteal-lamellar-b', 'canine', 'long bone', 'zoom', 'Slide "Lamellar".')
add('e3-msk2-periosteal', 'msk2', 17, '021', 'student', 'periosteal-palisading', 'canine', 'long bone', 'lateral', 'Slide "Palisading or columnar" (e.g., hypertrophic osteopathy).')
add('e3-msk2-periosteal', 'msk2', 18, '023', 'student', 'periosteal-spiculated-sunburst', 'canine', 'distal radius', 'CrCd', 'Slide "Spiculated or sunburst" - aggressive (malignant neoplasia or infection).')
add('e3-msk2-periosteal', 'msk2', 19, '024', 'student', 'periosteal-amorphous', 'canine', 'proximal humerus', 'lateral', 'Slide "Amorphous" - aggressive, typically malignancy.')
add('e3-bsava-infection-neoplasm', 'msk2', 24, '028', 'student', 'tumor-or-infection-a', 'canine', 'long bone', 'lateral', 'Slide "How can I tell if it\'s a tumor or infection? Short answer - you can\'t; cytology or histopathology".')
add('e3-bsava-infection-neoplasm', 'msk2', 24, '029', 'student', 'tumor-or-infection-b', 'canine', 'long bone', 'lateral', 'Same slide.')
add('e3-bsava-infection-neoplasm', 'msk2', 26, '030', 'student', 'hematogenous-aspergillosis-a', 'canine', 'elbow region', 'DMPLO/lateral', 'Slide "Hematogenous infection - disseminated aspergillosis".')
add('e3-bsava-infection-neoplasm', 'msk2', 26, '031', 'student', 'hematogenous-aspergillosis-b', 'canine', 'elbow/antebrachium', 'lateral', 'Same slide.')
add('e3-bsava-infection-neoplasm', 'msk2', 30, '036', 'student', 'soft-tissue-tumor-invading-bone-lat', 'canine', 'stifle', 'lateral', 'Slide "Soft tissue neoplasia invading bone (joint/periarticular neoplasms)".')
add('e3-bsava-infection-neoplasm', 'msk2', 30, '037', 'student', 'soft-tissue-tumor-invading-bone-crcd', 'canine', 'stifle', 'CrCd', 'Same slide.')
add('e3-bsava-healing', 'msk2', 65, '082', 'student', 'fracture-margin-chronicity-a', 'canine', 'long bone fracture', 'lateral', 'Slide "Fracture margins - chronicity": resorption rounds margins 7-10 d; new bone 10-14 d.', 'Not serial same-patient films; partial fit for slot (chronicity, not healing series).')
add('e3-bsava-healing', 'msk2', 65, '084', 'student', 'fracture-margin-chronicity-b', 'canine', 'femur fracture', 'lateral', 'Same slide.', 'Partial fit, as above.')

# ---------- Skull & spine (instructor interpretations from Gallaher transcript, paraphrased) ----------
SP = 'e3-skull-spine'
add(SP, 'spine', 5, '000', 'student', 'cmo-lateral', 'canine (young; wide pulp cavities)', 'skull / mandible', 'lateral', 'CMO slide.', 'Transcript: young dog (wide pulp cavities); fairly bilaterally symmetric, well-defined, mottled but smooth/solid mandibular new bone; not aggressive.')
add(SP, 'spine', 5, '001', 'student', 'cmo-vd', 'canine', 'skull', 'VD', 'CMO slide.', 'Transcript: straight lateral + VD are enough to support CMO suspicion.')
add(SP, 'spine', 7, '002', 'student', 'mlo-lateral', 'canine', 'skull', 'lateral', 'MLO slide.', 'Transcript: well-defined, coarse granular "popcorn ball" new bone, little lysis.')
add(SP, 'spine', 7, '003', 'student', 'mlo-lateral-zoom', 'canine', 'skull', 'lateral zoom', 'MLO slide (zoomed).')
add(SP, 'spine', 9, '004', 'verify', 'hyperparathyroidism-skull-lateral', 'canine', 'skull', 'lateral', 'Hyperparathyroidism slide; two images labeled Normal on slide - confirm which.', 'Transcript: loss of lamina dura, "floating teeth", generalized demineralization ("rubber jaw").')
add(SP, 'spine', 9, '005', 'verify', 'hyperparathyroidism-mandible-a', 'canine', 'mandible', 'lateral zoom', 'Same slide; confirm normal vs affected.')
add(SP, 'spine', 9, '007', 'verify', 'hyperparathyroidism-mandible-b', 'canine', 'mandible', 'lateral zoom', 'Same slide; confirm normal vs affected.')
add(SP, 'spine', 10, '008', 'student', 'nasal-rhinitis-open-mouth-vd', 'canine', 'nasal cavity', 'open-mouth VD', 'Nasal rhinitis slide.', 'Transcript: normal striated turbinates on one side vs increased soft tissue opacity/loss of pattern on the other.')
add(SP, 'spine', 11, '009', 'verify', 'nasal-example-2a', 'canine', 'nasal cavity', 'open-mouth VD', 'Slide shows abnormal + Normal; confirm which.', 'Transcript: loss of striated pattern on right vs left.')
add(SP, 'spine', 11, '011', 'verify', 'nasal-example-2b', 'canine', 'nasal cavity', 'open-mouth VD', 'Same slide.')
add(SP, 'spine', 12, '012', 'verify', 'nasal-closed-mouth-vd', 'canine', 'nasal cavity', 'closed-mouth VD', 'Slide: unilateral opacity on closed-mouth view + normal closed + normal open; confirm which.', 'Transcript: closed-mouth view gives poorer look due to superimposition.')
add(SP, 'spine', 12, '014', 'verify', 'nasal-normal-or-abnormal-a', 'canine', 'nasal cavity', 'VD', 'Same slide.')
add(SP, 'spine', 12, '015', 'verify', 'nasal-normal-open-mouth', 'canine', 'nasal cavity', 'open-mouth VD', 'Same slide.', 'Looks identical to p11 img 011 - possible duplicate.')
add(SP, 'spine', 14, '016', 'student', 'nasal-aspergillosis', 'canine', 'nasal cavity', 'open-mouth VD', 'Nasal aspergillosis slide.', 'Transcript: turbinate lysis, punctate lucencies, "empty nose".')
add(SP, 'spine', 17, '018', 'student', 'atlantoaxial-subluxation', 'canine (young small breed)', 'caudal skull / C1-C2', 'VD/rostrocaudal (verify; transcript describes the C1-C2 step)', 'Atlantoaxial subluxation slide.', 'Transcript: increased C1-C2 distance/step, tiny hypoplastic dens.')
add(SP, 'spine', 19, '019', 'student', 'block-vertebra', 'canine', 'thoracolumbar spine', 'lateral', 'Block vertebra slide.', 'Transcript: incidental; two vertebrae fused.')
add(SP, 'spine', 20, '020', 'student', 'transitional-vertebra', 'canine', 'thoracolumbar junction', 'VD', 'Transitional vertebra slide.', 'Transcript: broad-based malformed ribs on last thoracic/first lumbar; count vertebrae.')
add(SP, 'spine', 21, '021', 'student', 'hemivertebrae-vd', 'canine (bulldog/Frenchie type)', 'thoracic spine', 'VD', 'Hemivertebrae slide.', 'Transcript: wedge/butterfly vertebrae, block segments, malalignment, screw tail.')
add(SP, 'spine', 21, '022', 'student', 'hemivertebrae-lateral', 'canine', 'thoracic spine', 'lateral', 'Hemivertebrae slide.')
add(SP, 'spine', 22, '023', 'student', 'hemivertebrae-lateral-zoom', 'canine', 'thoracic spine', 'lateral zoom', 'Hemivertebrae slide (zoom, same dog).')
add(SP, 'spine', 22, '024', 'student', 'hemivertebrae-vd-zoom', 'canine', 'thoracic spine', 'VD zoom', 'Same dog.')
add(SP, 'spine', 23, '025', 'student', 'spondylosis-deformans', 'canine', 'thoracolumbar spine', 'lateral', 'Spondylosis deformans slide.', 'Transcript: varied severity ventral endplate new bone incl. L6-L7 and L7-S1; disc spaces often normal.')
add(SP, 'spine', 27, '027', 'student', 'discospondylitis-c2c3-lateral', 'canine', 'cervical spine', 'lateral', 'Discospondylitis slide.', 'Transcript: C2-C3 ill-defined endplates, lysis centered on disc space with sclerosis.')
add(SP, 'spine', 28, '028', 'student', 'discospondylitis-c2c3-lateral-zoom', 'canine', 'cervical spine', 'lateral zoom', 'Same dog zoomed.')
add(SP, 'spine', 28, '029', 'student', 'discospondylitis-c2c3-vd', 'canine', 'cervical spine', 'VD', 'Same dog orthogonal; lesion more left-sided per transcript.')
add(SP, 'spine', 29, '030', 'student', 'discospondylitis-chronic-lumbar', 'canine', 'lumbar / lumbosacral', 'lateral', 'Discospondylitis slide (chronic).', 'Transcript: narrowed space, endplate lysis + sclerosis, new bone; second lesion at lumbosacral junction.')
add(SP, 'spine', 32, '031', 'student', 'ivdd-a-trauma-dog', 'canine', 'lumbar spine', 'lateral', 'IVDD slide.', 'Transcript: hit by car; one narrowed space beyond divergent-beam artifact; mild spondylosis; needs advanced imaging.')
add(SP, 'spine', 32, '032', 'student', 'ivdd-b-l1l2', 'canine', 'thoracolumbar spine', 'lateral', 'IVDD slide.', 'Transcript: slightly narrowed L1-L2; MRI confirmed acute disc herniation (renal mass incidental).')
add(SP, 'spine', 33, '033', 'student', 'ivdd-chronic-t12t13-lateral', 'canine', 'thoracolumbar spine', 'lateral', 'IVDD slide.', 'Transcript: T12-T13 near-collapsed space, sclerosis, mineral over foramen; ballistic fragment elsewhere.')
add(SP, 'spine', 33, '034', 'student', 'ivdd-chronic-t12t13-vd', 'canine', 'thoracolumbar spine', 'VD', 'Same dog.')
add(SP, 'spine', 34, '035', 'student', 'ivdd-mineral-in-foramen-lateral', 'canine', 'thoracolumbar spine', 'lateral', 'IVDD slide.', 'Transcript: mild narrowing, slightly small foramen, rounded mineral in canal at disc space.')
add(SP, 'spine', 34, '036', 'student', 'ivdd-mineral-in-foramen-vd', 'canine', 'lumbar spine', 'VD', 'Same slide.')
add(SP, 'spine', 35, '037', 'student', 'mineralized-disc-in-situ-postop', 'canine (dachshund)', 'thoracolumbar spine', 'lateral', 'Mineralized disc in situ slide.', 'Transcript: skin staples from hemilaminectomy at T13-L1; in-situ mineralized discs are NOT the culprit.')
add(SP, 'spine', 39, '038', 'student', 'vertebral-multiple-myeloma', 'canine (older)', 'lumbar spine / sacrum', 'lateral', 'Vertebral neoplasia slide.', 'Transcript: expansile lysis L5 into pedicle/lamina/spinous process + sacrum, punctate lesions; multiple myeloma (metastatic carcinoma could look similar).')
add(SP, 'spine', 41, '039', 'student', 'spinal-fracture-luxation-t12t13', 'canine', 'thoracolumbar spine', 'lateral', 'Trauma slide.', 'Transcript: fracture-luxation at T12-T13 with dorsal displacement of caudal segment and ventral fragment.')


def load(s):
    if s['src'] == 'pptx':
        base, _, side = s['img'].partition('-')
        f = {'image1': 'image1.png', 'image2': 'image2.png', 'image3': 'image3.jpg', 'image4': 'image4.jpeg'}[base]
        im = Image.open(os.path.join(PRAC, f)).convert('L')
        if base == 'image1':
            im = im.crop((0, 0, 870, im.height)) if side == 'left' else im.crop((881, 0, im.width, im.height))
        if base == 'image2':
            im = im.crop((0, 0, 470, im.height)) if side == 'left' else im.crop((470, 0, im.width, im.height))
        return im
    return Image.open(f"{RAW}/{s['src']}/img-{s['page']:03d}-{s['img']}.png").convert('L')


def main():
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT + '/_answer-keys')
    counters, out, keys = {}, [], set()
    for s in S:
        n = counters[s['slot']] = counters.get(s['slot'], 0) + 1
        d = f"{OUT}/{s['slot']}"
        os.makedirs(d, exist_ok=True)
        fn = f"{s['slot']}__{n:02d}_{s['label']}.jpg"
        im = load(s)
        im.save(f'{d}/{fn}', quality=92, optimize=True)
        sha = hashlib.sha256(open(f'{d}/{fn}', 'rb').read()).hexdigest()
        if s['src'] == 'pptx':
            srcname, loc = 'MSKPracticecases (1).pptx', f"slide {s['page']}"
            key = None
        else:
            srcname, loc = PDF[s['src']][0], f"page {s['page']}"
            key = f"_answer-keys/{s['src']}-p{s['page']:03d}-slide.jpg"
            if key not in keys:
                subprocess.run(['pdftoppm', '-f', str(s['page']), '-l', str(s['page']), '-r', '110', '-jpeg',
                                '-singlefile', PDF[s['src']][1], f"{OUT}/{key[:-4]}"], check=True)
                keys.add(key)
        out.append({
            'slotId': s['slot'], 'file': f"{s['slot']}/{fn}", 'sha256': sha,
            'width': im.width, 'height': im.height,
            'studentRole': s['role'], 'species': s['species'], 'bodyRegion': s['region'],
            'projection': s['projection'], 'sourceFile': srcname, 'sourceLocator': loc,
            'sourceEmbeddedImage': s['img'],
            'confirmedCaseIdentity': s['slideSays'],
            'instructorInterpretation': s['note'] or None,
            'rightsStatus': RIGHTS,
            'rightsNote': 'Owner states LMU permits course material and assigned textbooks in this non-commercial LMU study game (2026-11-25).',
            'patientPrivacy': 'Clean embedded image; no names/IDs seen at review resolution; owner to confirm at full size before publish.',
            'annotations': ('ANSWER TEXT BURNED INTO IMAGE - use only as answer key, never as the question image' if s['role']=='answer-key-only' else 'none in image (slide labels/arrows are separate slide layers)'),
            'originalPath': f"{s['slot']}/{fn}",
            'annotatedKeyPath': key,
            'reviewState': 'matched-to-case' if s['role'] != 'verify' else 'found-unverified',
            'medicalReviewed': False, 'ownerApproved': False,
        })
    json.dump({'version': 1, 'created': '2026-11-25', 'createdBy': 'Claude (branch claude/radiology-image-manifest-2026-11-25)',
               'coordination': 'GitHub Issue #40', 'images': out}, open(f'{OUT}/manifest.json', 'w'), indent=1)
    print(len(out), 'images;', len(keys), 'answer keys;', len(counters), 'slots')
    for k, v in counters.items():
        print(f'  {k}: {v}')


if __name__ == '__main__':
    main()
