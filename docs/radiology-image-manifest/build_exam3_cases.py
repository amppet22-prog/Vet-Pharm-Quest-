#!/usr/bin/env python3
"""Register the merged Exam 3 course photos as published imaging cases.

Reads docs/radiology-image-manifest/course-image-manifest.json and adds one case per
(slot, lecture page) to diagnostic-imaging-published.json, in the same format the owner
publisher writes. Re-running replaces only the cases this script created (id prefix "exam3-").

Rules:
- Question views use only studentRole 'student' / 'normal-compare' images. View labels never
  say "Normal" or name a diagnosis; that text sits in the caption, which shows after Reveal.
- 'verify' and 'answer-key-only' images are never shown as question views.
- The rendered lecture slide is attached as an "Annotated teaching key" view. The existing viewer
  hides any view whose label contains "annotated" until the student asks for it.
- At most 3 views per case, because the owner editor only edits 3 images.
"""
import json, re, os
from collections import OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MAN = os.path.join(ROOT, 'docs/radiology-image-manifest/course-image-manifest.json')
PUB = os.path.join(ROOT, 'diagnostic-imaging-published.json')
QUEUE = os.path.join(ROOT, 'radiology-image-approval-queue.js')
RAW = 'https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/'
UPDATED = '2026-11-25T23:30:00Z'

LECT = {'MSK1FALL26 (1).pdf': ('MSK I', 'CVM 743 · Exam 3 · Small Animal MSK Radiography I'),
        'MSK2FALL2026 (1).pdf': ('MSK II', 'CVM 743 · Exam 3 · Small Animal MSK Radiography II'),
        'Spineandskull2026(2).pdf': ('Skull & Spine', 'CVM 743 · Exam 3 · Skull and Spine Radiography'),
        'MSKPracticecases (1).pptx': ('Practice cases', 'CVM 743 · Exam 3 · MSK Practice Cases')}

# Slide text per page (title + bullets), captured from the lecture PDFs.
SLIDE = json.load(open(os.path.join(ROOT, 'docs/radiology-image-manifest/slide-text.json'), encoding='utf-8'))
SRCKEY = {'MSK1FALL26 (1).pdf': 'msk1', 'MSK2FALL2026 (1).pdf': 'msk2', 'Spineandskull2026(2).pdf': 'spine'}

# Topic titles for skull/spine pages, which have no slide text (from the Gallaher transcript).
SPINE_TOPIC = {5: 'Craniomandibular osteopathy (CMO)', 7: 'Multilobular osteochondrosarcoma (MLO)',
               10: 'Nasal disease · open-mouth VD', 14: 'Nasal aspergillosis', 17: 'Atlantoaxial subluxation',
               19: 'Block vertebra', 20: 'Transitional vertebra', 21: 'Hemivertebrae', 22: 'Hemivertebrae · zoomed views',
               23: 'Spondylosis deformans', 27: 'Discospondylitis · cervical', 28: 'Discospondylitis · cervical, zoom + VD',
               29: 'Discospondylitis · chronic', 32: 'Intervertebral disc disease · two dogs',
               33: 'Intervertebral disc disease · chronic T12–T13', 34: 'Intervertebral disc disease · mineral at foramen',
               35: 'Mineralized disc in situ', 39: 'Vertebral neoplasia', 41: 'Spinal trauma'}

PRACTICE = {'e3-practice-hip-gsd': (1, '6-year-old MN German Shepherd Dog', 'Presented for being slow getting up (case 1 title slide).'),
            'e3-practice-mastiff-forelimb': (2, '8-year-old FS English Mastiff', 'Presented lame on the right forelimb (case 2 title slide).'),
            'e3-practice-puppy-lameness': (3, '8-month-old MN mixed-breed dog', 'Presented with shifting limb lameness, fever and lethargy (case 3 title slide).')}


TITLES = {}


def slot_needs():
    s = open(QUEUE, encoding='utf-8').read()
    out = {}
    for m in re.finditer(r"\{id:['\"]([a-z0-9-]+)['\"].*?need:(['\"])(.*?)\2,question:(['\"])(.*?)\4", s):
        out[m.group(1)] = (m.group(3), m.group(5))
    for m in re.finditer(r"\{id:['\"]([a-z0-9-]+)['\"],exam:['\"][^'\"]+['\"],title:(['\"])(.*?)\2", s):
        TITLES[m.group(1)] = m.group(3)
    return out


def slide_text(src, page):
    t = SLIDE[SRCKEY[src]]['text'][str(page)]
    t = re.sub(r'\s*\bNormal\b(\s+Normal)*\s*$', '', t).strip()
    t = re.sub(r'\s+(L|R)$', '', t)
    parts = [p.strip() for p in t.split('•')]
    return parts[0].strip(), [p for p in parts[1:] if p]


def view_label(rec, letter):
    proj = rec['projection'].split('(')[0].strip()
    proj = re.sub(r'\b(two patients stacked)\b', '', proj).strip(' ;')
    return f"{proj[:1].upper()+proj[1:]} · view {letter}"


def main():
    man = json.load(open(MAN, encoding='utf-8'))['images']
    needs = slot_needs()
    groups = OrderedDict()
    for r in man:
        page = int(r['sourceLocator'].split()[-1])
        k = (r['slotId'], r['sourceFile'], page) if r['sourceFile'] in SRCKEY else (r['slotId'], r['sourceFile'], 0)
        groups.setdefault(k, []).append(r)

    cases = OrderedDict()
    for (slot, src, page), recs in groups.items():
        usable = [r for r in recs if r['studentRole'] in ('student', 'normal-compare')]
        if not usable:
            continue
        short, lecture = LECT[src]
        need, question = needs.get(slot, ('', ''))
        practice = slot in PRACTICE
        if practice:
            n, signal, hist = PRACTICE[slot]
            cid = f'exam3-practice-case-{n}'
            title = f'Exam 3 Practice Case {n} · {signal}'
            history = f'{signal}. {hist}'
            findings = ''
            interp = 'The source slides give the signalment and views only. No answer key is included, so check your interpretation against the class discussion or the instructor.'
            views = usable[:2]
        else:
            if src in SRCKEY and SRCKEY[src] == 'spine':
                topic, bullets = SPINE_TOPIC.get(page, slide_text(src, page)[0]), []
            else:
                topic, bullets = slide_text(src, page)
            cid = f"exam3-{SRCKEY[src]}-p{page:02d}-{slot[3:]}"
            # Spoiler-free: name the slot topic and slide, never the diagnosis (that is revealed in 'interpretation').
            base = re.sub(r'^(BSAVA|MSK I{1,2}|Skull & spine) · ', '', TITLES.get(slot, ''))
            title = f"Exam 3 · {short} slide {page} · {base[:1].upper() + base[1:]}"
            history = f'Teaching image set from the {short} lecture (Fall 2026), slide {page}.'
            interps = [r['instructorInterpretation'] for r in usable if r['instructorInterpretation'] and r['instructorInterpretation'].startswith('Transcript')]
            lines = []
            if bullets:
                lines.append('Instructor slide: ' + '; '.join(bullets) + '.')
            if interps and SRCKEY[src] == 'spine':
                lines.append('Instructor narration (paraphrased): ' + ' '.join(i.replace('Transcript: ', '') for i in interps))
            findings = '\n'.join(lines)
            interp = topic
            views = usable[:2]
        images = []
        for i, r in enumerate(views):
            cap = r['confirmedCaseIdentity']
            if r['studentRole'] == 'normal-compare':
                cap = 'Comparison view: the lecture slide labels this image Normal.'
            images.append({'url': RAW + r['repoPath'], 'view': view_label(r, 'ABC'[i]), 'caption': cap})
        key = next((r['annotatedKeyRepoPath'] for r in recs if r.get('annotatedKeyRepoPath')), None)
        if key:
            images.append({'url': RAW + key, 'view': 'Annotated teaching key · lecture slide',
                           'caption': 'Full lecture slide with the instructor\'s title, labels and arrows. Answer key.'})
        species = views[0]['species'].split(' (')[0]
        cases[cid] = {
            'id': cid, 'kind': 'case', 'modality': 'X-ray', 'title': title[:180], 'lecture': lecture,
            'species': species[:1].upper() + species[1:], 'region': views[0]['bodyRegion'],
            'history': history, 'lookFor': ((question + '\n') if question else '') + 'Work systematically: projection and positioning, anatomy, then Roentgen signs (number, size, shape, location, margination, opacity) before naming a diagnosis.',
            'quality': '', 'findings': findings, 'interpretation': interp, 'differentials': '', 'why': '', 'next': '',
            'source': f"{src} · {'slide' if practice else 'page'} {views[0]['sourceLocator'].split()[-1]} · LMU CVM 743 course material, used with LMU permission (non-commercial)",
            'credit': 'Dr. Rebecca Gallaher, LMU CVM (skull & spine lecture)' if SRCKEY.get(src) == 'spine' else 'LMU CVM diagnostic imaging course',
            'images': images, 'imageReviewSlot': slot, 'exam1Slot': '', 'exam2Slot': '',
            'imageStatus': 'LMU course radiograph extracted from lecture slides; owner-attested permission',
            'reviewStatus': 'Matched to lecture slide and slot by Claude; not independently medically reviewed',
            'studyImageReview': {'priority': 'teaching', 'clinicalQualityVerified': False,
                                 'note': 'Extracted from lecture slides, so resolution is limited to the slide copy. Do not measure from it.'},
            'updated': UPDATED,
        }

    raw = open(PUB, encoding='utf-8').read()
    pub = json.loads(raw)
    for k in [k for k in pub['cases'] if k.startswith('exam3-')]:
        del pub['cases'][k]
    pub['cases'].update(cases)
    open(PUB, 'w', encoding='utf-8').write(json.dumps(pub, indent=2, ensure_ascii=False) + '\n')
    print(len(cases), 'Exam 3 cases written;', sum(len(c['images']) for c in cases.values()), 'image views')


if __name__ == '__main__':
    main()
