#!/usr/bin/env python3
"""Exam 3 extra cases (ids "exam3x-*"): developmental orthopedic disease and joint disease
that the condition casebook needs photos for. Student images come from the clean MSK I/II
lecture copies; the answer key is the professor-annotated MSK I slide (owner confirmed the
handwritten notes are the professor's statements). Re-running replaces only exam3x-* cases.
"""
import json, os, re, subprocess, glob, shutil
from PIL import Image, ImageStat

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = '/home/claude/pack/raw'
U = '/mnt/user-data/uploads/'
CLEAN = {'msk1': 'd93647b2-MSK1FALL26_1.pdf', 'msk2': '5eb64d9f-MSK2FALL2026_1.pdf', 'spine': 'cad5c0b5-Spineandskull2026.pdf', 'anat2': '3ee5996e-Musculoskeletal_Anatomy_Fa26_1.pdf'}
KEYSRC = {'msk1': ('8d51ade9-MSK1FALL26.pdf', lambda p: p + 1 if p >= 22 else p),  # annotated copy, +1 page from p22
          'msk2': ('5eb64d9f-MSK2FALL2026_1.pdf', lambda p: p),
          'spine': ('6c1a80ee-Spineandskull2026.pdf', lambda p: p),  # annotated copy, same pagination
          'anat2': ('b051b364-1_MusculoskeletalAnatomyFa26.pdf', lambda p: p)}  # annotated copy, same pagination
LECT = {'msk1': ('MSK I', 'CVM 743 · Exam 3 · Small Animal MSK Radiography I'), 'msk2': ('MSK II', 'CVM 743 · Exam 3 · Small Animal MSK Radiography II'),
        'spine': ('Skull & Spine', 'CVM 743 · Exam 3 · Skull and Spine Radiography'),
        'anat2': ('MSK Anatomy', 'CVM 743 · Exam 3 · Musculoskeletal Anatomy (Dr. Victoria Morris)')}
RAW_URL = 'https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/'
DIR = 'radiology-course-photos/exam3/developmental-joint'
UPDATED = '2026-11-26T06:00:00Z'
P = "Professor's notes: "

SPECS = [
 # (src, page, imgs or None, section, topic-for-title, answer, findings, kind, normal_pair)
 ('msk1', 45, ['040', '041'], 'msk1-dev', 'Distal ulna in a growing dog', 'Retained cartilaginous core',
  P + 'conical lucency in the distal ulnar metaphysis with a centrally widened physis; compare with the normal example on the slide.', 'case', True),
 ('msk1', 48, None, 'msk1-dev', 'Metaphyses in a young dog', 'Hypertrophic osteodystrophy (HOD)',
  P + 'ill-defined lucency in the metaphysis just proximal to the physis; may be referred to as a "double physis".', 'case', False),
 ('msk1', 50, None, 'msk1-dev', 'Metaphysis · stage 1', 'Early HOD',
  'Slide: mild focal swelling; irregular metaphyseal margins with subphyseal sclerosis. ' + P + 'the irregular margins with subphyseal sclerosis are the defining characteristic of early HOD.', 'case', False),
 ('msk1', 51, None, 'msk1-dev', 'Metaphysis · stage 2', 'Classic HOD',
  'Slide: mild focal swelling; irregular metaphyseal margins; thick, irregular, indistinct linear lucency paralleling the physes. ' + P + 'the lucent line ("double physis") is the defining characteristic of classic HOD.', 'case', False),
 ('msk1', 52, None, 'msk1-dev', 'Metaphysis · stage 3', 'Chronic HOD',
  'Slide: moderate focal soft-tissue swelling; metaphyseal periosteal cuffing. ' + P + 'periosteal cuffing along the metaphysis is the defining characteristic of chronic HOD.', 'case', False),
 ('msk1', 55, None, 'msk1-dev', 'Long-bone medullary opacity · example 1', 'Panosteitis',
  'Slide: polyostotic, multifocal increased medullary and endosteal opacity (sclerosis); decreased corticomedullary definition at affected sites; periosteal proliferation (often mild and solid, may be indistinct) adjacent to the sites of sclerosis.', 'case', False),
 ('msk1', 56, None, 'msk1-dev', 'Long-bone medullary opacity · example 2', 'Panosteitis',
  P + 'patchy medullary sclerosis within the shaft with periosteal reaction; compare left and right.', 'case', False),
 ('msk1', 59, None, 'msk1-hip', 'Coxofemoral joint · coverage', 'Normal coxofemoral joint',
  'Slide: at least 50% coverage of the femoral head by the dorsal acetabular rim. ' + P + 'when checking for hip dysplasia make sure the pelvis is perfectly straight; improper positioning can over- or under-estimate acetabular coverage.', 'normal', False),
 ('msk1', 60, None, 'msk1-hip', 'Coxofemoral joints · VD', 'Early hip dysplasia',
  'Slide: widened/wedge-shaped coxofemoral joint space; decreased coverage (<50%) of the femoral head by the dorsal acetabulum. ' + P + 'bilateral hip dysplasia; no signs of degenerative change yet.', 'case', False),
 ('msk1', 61, None, 'msk1-hip', 'Coxofemoral joint · close-up comparison', 'Early hip dysplasia',
  P + 'widened, wedge-shaped joint space with decreased dorsal acetabular coverage, compared with a normal joint.', 'case', True),
 ('msk1', 62, None, 'msk1-hip', 'Coxofemoral joints · adult dog', 'Hip dysplasia with premature DJD/OA',
  'Slide: same changes as early hip dysplasia, now with chronic degenerative changes (periarticular bone formation, osteophytes).', 'case', False),
 ('msk1', 63, None, 'msk1-hip', 'Coxofemoral joints · close-up', 'Hip dysplasia with premature DJD/OA',
  P + 'close-up of the previous dog compared with a normal joint.', 'case', True),
 ('msk1', 64, None, 'msk1-hip', 'Coxofemoral joints · older dog', 'Hip dysplasia with severe DJD/OA',
  'Slide: same changes as before, plus thickened femoral necks and flattened femoral heads.', 'case', False),
 ('msk1', 65, None, 'msk1-hip', 'Coxofemoral joints · close-up, older dog', 'Hip dysplasia with severe DJD/OA',
  P + 'close-up of the previous dog compared with a normal joint.', 'case', True),
 ('msk1', 68, None, 'msk1-hip', 'Femoral head · young small-breed dog', 'Legg-Calvé-Perthes disease (early)',
  'Slide (aseptic necrosis of the femoral head, early): muscle atrophy of the affected limb; indistinct, irregular lucency of the femoral neck; widened coxofemoral joint space.', 'case', False),
 ('msk1', 69, None, 'msk1-hip', 'Femoral head · close-up comparison', 'Legg-Calvé-Perthes disease (early)',
  P + 'early aseptic necrosis of the femoral head: irregular lucency in the femoral head and neck with widened joint space, compared with a normal joint.', 'case', True),
 ('msk1', 70, None, 'msk1-hip', 'Femoral head · small-breed dog, later stage', 'Legg-Calvé-Perthes disease (chronic)',
  'Slide (chronic): muscle atrophy of the affected limb; sclerotic and irregular femoral head and neck; widened coxofemoral joint space; premature osteoarthrosis.', 'case', False),
 ('msk1', 71, None, 'msk1-hip', 'Femoral head · close-up, later stage', 'Legg-Calvé-Perthes disease (chronic)',
  P + 'sclerosis of the femoral head and neck with a widened joint, compared with a normal joint.', 'case', True),
 ('msk1', 74, None, 'msk1-hip', 'Proximal femur · young cat', 'Physeal dysplasia (capital femoral physis)',
  P + 'abnormal proximal (capital) femoral physis; compare the two sides.', 'case', False),
 ('msk1', 75, None, 'msk1-hip', 'Proximal femur · close-up', 'Physeal dysplasia (capital femoral physis)',
  P + 'lucent, irregular capital femoral physis on the affected side versus the contralateral physis.', 'case', False),
 ('msk2', 33, None, 'msk2-joint', 'Joint · erosive change', 'Septic arthritis',
  'Slide: septic arthritis is an erosive arthropathy, mono- or polyarticular.', 'case', False),
 ('msk2', 34, None, 'msk2-joint', 'Joint · erosive change, second example', 'Septic arthritis', 'Slide: septic arthritis.', 'case', False),
 ('msk2', 36, None, 'msk2-joint', 'Joint · older dog', 'Joint-centered neoplasia',
  'Slide: joint-centered neoplasia is an erosive monoarthropathy, often in geriatric dogs.', 'case', False),
 ('msk2', 37, None, 'msk2-joint', 'Multiple joints', 'Erosive polyarthropathy',
  'Slide: erosive polyarthropathy is rare; two known types (rheumatoid arthritis; greyhound polyarthritis).', 'case', False),
 # Previously held back ("verify"): the annotated slides show which view is labeled Normal.
 ('spine', 9, ['004', '005'], 'spine-extra', 'Skull and mandible · comparison', 'Hyperparathyroidism ("rubber jaw")',
  'Instructor narration (paraphrased): loss of the lamina dura, "floating teeth", generalized demineralization ("rubber jaw"). The slide labels the second view Normal.', 'case', True),
 ('spine', 11, ['009', '011'], 'spine-extra', 'Nasal cavity · open-mouth VD comparison', 'Nasal disease (unilateral loss of turbinate pattern)',
  'Instructor narration (paraphrased): loss of the striated turbinate pattern on one side compared with the other. The slide labels the second view Normal.', 'case', True),
 ('spine', 12, ['012', '014'], 'spine-extra', 'Nasal cavity · closed-mouth VD comparison', 'Nasal disease (unilateral loss of turbinate pattern)',
  'Instructor narration (paraphrased): unilateral opacity on the closed-mouth VD; this view gives a poorer look than open-mouth because of superimposition. The slide labels the second view Normal.', 'case', True),
 # Normal MSK anatomy (Dr. Morris). MC = name the region and view. Third-party figures (Veterian Key pp.8-9,
 # Today's Veterinary Practice pp.25/44, Frontiers p.31, anatomy atlas p.34) and text graphics are excluded.
 ('anat2', 6, ['006', '005'], 'anatomy', 'Normal anatomy · skull', 'Skull · lateral and ventrodorsal', None, 'normal', False),
 ('anat2', 11, ['012'], 'anatomy', 'Normal anatomy · spinal alignment', 'Thoracolumbar spine · lateral', None, 'normal', False),
 ('anat2', 12, ['015'], 'anatomy', 'Normal anatomy · neck', 'Cervical spine · lateral', None, 'normal', False),
 ('anat2', 17, ['028'], 'anatomy', 'Normal anatomy · thoracic spine', 'Thoracic spine · dorsoventral', None, 'normal', False),
 ('anat2', 18, ['030'], 'anatomy', 'Normal anatomy · lumbar spine', 'Lumbar spine · lateral', None, 'normal', False),
 ('anat2', 19, ['031'], 'anatomy', 'Normal anatomy · sacrum and tail', 'Sacrum and caudal vertebrae · lateral', None, 'normal', False),
 ('anat2', 23, ['040'], 'anatomy', 'Normal anatomy · forelimb girdle', 'Scapula · lateral', None, 'normal', False),
 ('anat2', 24, ['043'], 'anatomy', 'Normal anatomy · shoulder', 'Shoulder joint · lateral', None, 'normal', False),
 ('anat2', 26, ['050'], 'anatomy', 'Normal anatomy · shoulder pitfall', 'Normal variant: separate center of ossification', None, 'normal', False),
 ('anat2', 27, ['054'], 'anatomy', 'Normal anatomy · brachium', 'Humerus · mediolateral', None, 'normal', False),
 ('anat2', 28, ['055'], 'anatomy', 'Normal anatomy · elbow', 'Elbow (cubital joint) · lateral', None, 'normal', False),
 ('anat2', 30, ['067'], 'anatomy', 'Normal anatomy · antebrachium', 'Radius and ulna · mediolateral', None, 'normal', False),
 ('anat2', 32, ['076'], 'anatomy', 'Normal anatomy · carpus', 'Carpus · dorsopalmar', None, 'normal', False),
 ('anat2', 33, ['103'], 'anatomy', 'Normal anatomy · manus', 'Manus · dorsopalmar', None, 'normal', False),
 ('anat2', 36, ['127'], 'anatomy', 'Normal anatomy · pelvis', 'Pelvis · lateral', None, 'normal', False),
 ('anat2', 37, ['138'], 'anatomy', 'Normal anatomy · pelvis, second view', 'Pelvis · ventrodorsal (extended-leg)', None, 'normal', False),
 ('anat2', 38, ['149'], 'anatomy', 'Normal anatomy · hip close-up', 'Coxofemoral joint · VD close-up', None, 'normal', False),
 ('anat2', 39, ['154'], 'anatomy', 'Normal anatomy · pelvic limb', 'Pelvic limb · lateral', None, 'normal', False),
 ('anat2', 40, ['155'], 'anatomy', 'Normal anatomy · long bone', 'Normal long bone (femur · craniocaudal)', None, 'normal', False),
 ('anat2', 41, ['158'], 'anatomy', 'Normal anatomy · stifle', 'Stifle · lateral', None, 'normal', False),
 ('anat2', 42, ['175', '176'], 'anatomy', 'Normal anatomy · stifle alignment', 'Stifle · lateral and caudocranial (alignment)', None, 'normal', False),
]
SECTION_TITLES = {'msk1-dev': 'MSK I · developmental bone disease (RCC, HOD, panosteitis)',
                  'msk1-hip': 'MSK I · hips (dysplasia, Legg-Calvé-Perthes, physeal dysplasia)',
                  'msk2-joint': 'MSK II · erosive joint disease', 'spine-extra': 'Skull & spine · comparisons with a normal', 'anatomy': 'Normal MSK anatomy · name the region and view'}


def usable(f):
    im = Image.open(f).convert('L')
    return ImageStat.Stat(im).stddev[0] > 8  # drop blank masks


def main():
    out = os.path.join(REPO, DIR)
    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out + '/_answer-keys')
    cases, man = {}, []
    def slide_text(pdf, page):
        t = ' '.join(subprocess.run(['pdftotext', '-f', str(page), '-l', str(page), U + pdf, '-'], capture_output=True, text=True).stdout.split())
        t = re.sub(r'\s+\d+$', '', t)
        parts = [x.strip(' ❑▪') for x in re.split(r'[•❑▪]', t)[1:] if len(x.strip()) > 3]
        parts = [x.capitalize() if x.isupper() else x for x in parts]
        body = '; '.join(parts)[:420] if parts else ''
        return ('Slide: ' + body + '. ' if body else '') + 'Open the annotated slide to see the labeled anatomy.'
    for n, (src, page, pick, section, topic, answer, findings, kind, pair) in enumerate(SPECS, 1):
        if findings is None:
            findings = slide_text(CLEAN[src], page)
        files = [f'{RAW}/{src}/img-{page:03d}-{i}.png' for i in pick] if pick else sorted(glob.glob(f'{RAW}/{src}/img-{page:03d}-*.png'))
        files = [f for f in files if os.path.exists(f) and usable(f)][:2]
        if not files:
            print('skip', src, page); continue
        short, lecture = LECT[src]
        cid = f'exam3x-{src}-p{page:02d}'
        images = []
        for i, f in enumerate(files, 1):
            im = Image.open(f).convert('L'); im.thumbnail((1600, 1600))
            rel = f'{DIR}/{cid}__{i:02d}.jpg'
            im.save(os.path.join(REPO, rel), quality=90, optimize=True)
            images.append({'url': RAW_URL + rel, 'view': f'View {"AB"[i-1]}',
                           'caption': f'{short}, slide {page}.' + (' The slide pairs this with a Normal comparison; the teaching key shows which is which.' if pair else '')})
            man.append({'caseId': cid, 'repoPath': rel, 'sourceFile': CLEAN[src], 'sourcePage': page})
        kpdf, kmap = KEYSRC[src]
        krel = f'{DIR}/_answer-keys/{src}-p{page:03d}.jpg'
        subprocess.run(['pdftoppm', '-f', str(kmap(page)), '-l', str(kmap(page)), '-r', '110', '-jpeg', '-singlefile', U + kpdf,
                        os.path.join(REPO, krel[:-4])], check=True, stderr=subprocess.DEVNULL)
        images.append({'url': RAW_URL + krel, 'view': "Annotated teaching key · lecture slide with professor's notes",
                       'caption': "Lecture slide with the professor's notes from class. Answer key." if src in ('msk1', 'spine', 'anat2') else 'Lecture slide. Answer key.'})
        cases[cid] = {
            'id': cid, 'kind': kind, 'modality': 'X-ray', 'title': f'Exam 3 · {short} slide {page} · {topic}', 'lecture': lecture,
            'species': 'Feline' if 'cat' in topic else 'Canine', 'region': 'Skull' if src == 'spine' else ('Normal anatomy' if src == 'anat2' else 'Musculoskeletal'), 'history': '',
            'lookFor': 'Work systematically: projection, anatomy, then Roentgen signs (number, size, shape, location, margination, opacity) before naming a diagnosis.',
            'quality': '', 'findings': findings, 'interpretation': answer, 'answer': answer, 'differentials': '', 'why': '', 'next': '',
            'source': f'{CLEAN[src]} · page {page} · LMU CVM 743 course material, used with LMU permission (non-commercial)',
            'credit': 'Dr. Victoria Morris, LMU CVM' if src == 'anat2' else 'LMU CVM diagnostic imaging course', 'images': images, 'imageReviewSlot': 'e3-anatomy-projection-quiz' if src == 'anat2' else '', 'exam1Slot': '', 'exam2Slot': '',
            'exam3Section': section,
            'imageStatus': 'LMU course radiograph extracted from lecture slides; owner-attested permission',
            'reviewStatus': "Matched to lecture slide by Claude; findings from slide text and the professor's notes; not independently medically reviewed",
            'studyImageReview': {'priority': 'teaching', 'clinicalQualityVerified': False, 'note': 'Extracted from lecture slides, so resolution is limited to the slide copy. Do not measure from it.'},
            'updated': UPDATED,
        }
    pubp = os.path.join(REPO, 'diagnostic-imaging-published.json')
    pub = json.load(open(pubp, encoding='utf-8'))
    for k in [k for k in pub['cases'] if k.startswith('exam3x-')]:
        del pub['cases'][k]
    pub['cases'].update(cases)
    open(pubp, 'w', encoding='utf-8').write(json.dumps(pub, indent=2, ensure_ascii=False) + '\n')
    json.dump({'sections': SECTION_TITLES, 'images': man}, open(os.path.join(REPO, 'docs/radiology-image-manifest/exam3-extra-manifest.json'), 'w'), indent=1)
    print(len(cases), 'extra Exam 3 cases;', len(man), 'images')


if __name__ == '__main__':
    main()
