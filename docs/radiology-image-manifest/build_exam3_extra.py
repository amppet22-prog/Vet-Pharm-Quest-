#!/usr/bin/env python3
"""Exam 3 extra cases (ids "exam3x-*"): developmental orthopedic disease and joint disease
that the condition casebook needs photos for. Student images come from the clean MSK I/II
lecture copies; the answer key is the professor-annotated MSK I slide (owner confirmed the
handwritten notes are the professor's statements). Re-running replaces only exam3x-* cases.
"""
import json, os, subprocess, glob, shutil
from PIL import Image, ImageStat

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = '/home/claude/pack/raw'
U = '/mnt/user-data/uploads/'
CLEAN = {'msk1': 'd93647b2-MSK1FALL26_1.pdf', 'msk2': '5eb64d9f-MSK2FALL2026_1.pdf'}
KEYSRC = {'msk1': ('8d51ade9-MSK1FALL26.pdf', lambda p: p + 1 if p >= 22 else p),  # annotated copy, +1 page from p22
          'msk2': ('5eb64d9f-MSK2FALL2026_1.pdf', lambda p: p)}
LECT = {'msk1': ('MSK I', 'CVM 743 · Exam 3 · Small Animal MSK Radiography I'), 'msk2': ('MSK II', 'CVM 743 · Exam 3 · Small Animal MSK Radiography II')}
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
]
SECTION_TITLES = {'msk1-dev': 'MSK I · developmental bone disease (RCC, HOD, panosteitis)',
                  'msk1-hip': 'MSK I · hips (dysplasia, Legg-Calvé-Perthes, physeal dysplasia)',
                  'msk2-joint': 'MSK II · erosive joint disease'}


def usable(f):
    im = Image.open(f).convert('L')
    return ImageStat.Stat(im).stddev[0] > 8  # drop blank masks


def main():
    out = os.path.join(REPO, DIR)
    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out + '/_answer-keys')
    cases, man = {}, []
    for n, (src, page, pick, section, topic, answer, findings, kind, pair) in enumerate(SPECS, 1):
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
                           'caption': f'{short}, slide {page}.' + (' The slide pairs this with a Normal comparison; check the annotated key.' if pair else '')})
            man.append({'caseId': cid, 'repoPath': rel, 'sourceFile': CLEAN[src], 'sourcePage': page})
        kpdf, kmap = KEYSRC[src]
        krel = f'{DIR}/_answer-keys/{src}-p{page:03d}.jpg'
        subprocess.run(['pdftoppm', '-f', str(kmap(page)), '-l', str(kmap(page)), '-r', '110', '-jpeg', '-singlefile', U + kpdf,
                        os.path.join(REPO, krel[:-4])], check=True, stderr=subprocess.DEVNULL)
        images.append({'url': RAW_URL + krel, 'view': "Annotated teaching key · lecture slide with professor's notes",
                       'caption': "Lecture slide with the professor's notes from class. Answer key." if src == 'msk1' else 'Lecture slide. Answer key.'})
        cases[cid] = {
            'id': cid, 'kind': kind, 'modality': 'X-ray', 'title': f'Exam 3 · {short} slide {page} · {topic}', 'lecture': lecture,
            'species': 'Feline' if 'cat' in topic else 'Canine', 'region': 'Musculoskeletal', 'history': '',
            'lookFor': 'Work systematically: projection, anatomy, then Roentgen signs (number, size, shape, location, margination, opacity) before naming a diagnosis.',
            'quality': '', 'findings': findings, 'interpretation': answer, 'answer': answer, 'differentials': '', 'why': '', 'next': '',
            'source': f'{CLEAN[src]} · page {page} · LMU CVM 743 course material, used with LMU permission (non-commercial)',
            'credit': 'LMU CVM diagnostic imaging course', 'images': images, 'imageReviewSlot': '', 'exam1Slot': '', 'exam2Slot': '',
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
