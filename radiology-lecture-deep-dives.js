/* Radiology course deep-dive extension. Source-aligned original teaching text, not reproduced lecture figures. */
(function(){'use strict';
const course=window.VPQ_RADIOLOGY_COURSE;
if(!course || !Array.isArray(course.units))return;
const lessons=[
  {
    "title": "Normal abdomen · organ landmarks",
    "source": "CVM 743 Normal Radiographic Anatomy: Small Animal Abdomen (Morris); Abdominal Radiology Exam 2 guide, Lecture 6",
    "objectives": [
      "Locate the liver, stomach, spleen, kidneys, bladder, small bowel and colon on lateral and VD radiographs.",
      "Describe important canine versus feline differences in abdominal landmarks.",
      "Recognize the normal structures that are usually not separately visible on survey films."
    ],
    "learn": [
      [
        "Draw an anatomy map",
        "Liver occupies the cranial abdomen caudal to the diaphragm; stomach lies caudal to liver, with fundus usually left and pyloric region usually right in dogs. Kidneys are dorsal and retroperitoneal; the right kidney is typically cranial to the left. Bladder is caudoventral; small intestinal loops occupy the central abdomen; colon is more dorsal."
      ],
      [
        "Spleen: dog versus cat",
        "The dog's splenic head sits near the gastric fundus, while the long tail can vary in position. A normal feline spleen is generally smaller and less conspicuous; recognizing the difference helps avoid overcalling splenomegaly."
      ],
      [
        "What should not be visible?",
        "On routine survey films the normal pancreas, adrenal glands, lymph nodes, ureters, gallbladder and many reproductive organs generally cannot be individually distinguished. An apparent organ boundary may reflect displacement or abnormal change."
      ],
      [
        "Look before naming disease",
        "In a VD abdomen, first trace lumbar spine, kidneys, stomach, spleen, bowel and bladder. Then search for secondary signs such as displacement, rounded margins, mineral opacity, focal gas or reduced serosal contrast."
      ]
    ],
    "question": {
      "prompt": "On a correctly oriented canine VD abdominal radiograph, which kidney is normally located farther cranially?",
      "options": [
        "Right kidney",
        "Left kidney",
        "They must be at exactly equal levels",
        "Neither kidney is retroperitoneal"
      ],
      "answer": 0,
      "why": "The right kidney usually lies farther cranially. This relationship is a useful initial orientation landmark; normal anatomical variation still exists."
    }
  },
  {
    "title": "Stomach gas · know the lateral view",
    "source": "CVM 743 Normal Radiographic Anatomy: Small Animal Abdomen; Abdominal Radiology guide Lecture 6, right versus left lateral gas distribution",
    "objectives": [
      "Predict gas and liquid location in the stomach on either lateral view.",
      "Use gravity-dependent fluid and nondependent gas to help identify fundus and pylorus.",
      "Avoid mistaking a fluid-filled normal pylorus for a soft-tissue mass."
    ],
    "learn": [
      [
        "Right lateral",
        "The right side is down. The canine pyloric antrum is dependent and fills with fluid; gas rises into the nondependent fundus. The fundus can therefore be outlined by gas."
      ],
      [
        "Left lateral",
        "The left side is down. The fundus becomes dependent and contains fluid; gas rises into the pyloric antrum and proximal duodenum. This can make pyloric anatomy easier to recognize."
      ],
      [
        "Why this matters clinically",
        "A single soft-tissue rounded opacity in the expected dependent pylorus may be fluid rather than a mass. Comparing a second lateral projection or using ultrasound may clarify anatomy when indicated."
      ],
      [
        "Practice with actual films",
        "Before viewing the side marker, predict where gas would collect on each view. Then confirm the image marker and stomach location; never infer patient positioning from gas alone."
      ]
    ],
    "question": {
      "prompt": "A dog is positioned in LEFT lateral recumbency. Where is gastric gas expected to rise most prominently?",
      "options": [
        "Pyloric antrum",
        "Dependent fundus",
        "Urinary bladder",
        "The gas disappears"
      ],
      "answer": 0,
      "why": "With the left side down, the fundus is dependent and fluid-filled; the right-sided pyloric antrum becomes nondependent and often contains gas."
    }
  },
  {
    "title": "Abdominal detail · effusion or normal variation?",
    "source": "CVM 743 Abdomen Principles I, Abdominal Radiology guide Lecture 7",
    "objectives": [
      "Explain the mechanism of abdominal serosal contrast.",
      "Describe diffuse versus retroperitoneal loss of detail.",
      "Differentiate abdominal effusion from reduced fat, poor technique and other causes of low detail."
    ],
    "learn": [
      [
        "Why fat helps",
        "Fat is less opaque than soft tissue and provides contrast between adjacent organs. Without enough intra-abdominal fat, the borders of soft-tissue organs can blend together even without fluid."
      ],
      [
        "Diffuse detail loss",
        "When many peritoneal organ margins disappear, describe generalized decreased serosal detail rather than immediately diagnosing effusion. Consider free fluid, inflammation, infiltrative change, low fat and technical causes."
      ],
      [
        "The young or thin patient",
        "Puppies, kittens and severely thin animals often have weak serosal contrast because little abdominal fat separates structures. Evaluate age, body condition, distension, positioning and technical adequacy."
      ],
      [
        "Retroperitoneum",
        "Loss of the normal renal/retroperitoneal margins may suggest retroperitoneal fluid, hemorrhage, urine, inflammation or infiltrative disease. It should be localized separately from generalized peritoneal effusion."
      ]
    ],
    "question": {
      "prompt": "A young thin kitten has globally low abdominal serosal detail without distension. Which statement is best supported?",
      "options": [
        "Low peritoneal fat may explain the finding; correlate with examination and other signs",
        "Hemoabdomen is proven",
        "Malignancy is proven",
        "An immediate laparotomy is required from this sign alone"
      ],
      "answer": 0,
      "why": "Low serosal contrast is a radiographic sign, not a disease. A small amount of normal body fat may account for blurred organ margins."
    }
  },
  {
    "title": "Gastrointestinal radiographs · obstruction reasoning",
    "source": "CVM 743 GI Principles I/II (Gallaher); Abdominal Radiology Exam 2 guide",
    "objectives": [
      "Compare normal versus dilated gastrointestinal segments.",
      "Assess focal versus diffuse intestinal distension and unequal populations.",
      "Explain why a single projection or measurement may be insufficient to prove mechanical obstruction."
    ],
    "learn": [
      [
        "Find the stomach, small bowel and colon first",
        "Identify stomach and pylorus, central small intestinal loops, cecum and fecal-containing colon. Do not confuse colonic feces or cecal gas with small intestinal foreign material."
      ],
      [
        "Mechanical versus functional",
        "Mechanical obstruction may create segmental dilation proximal to a transition with relatively less gas beyond; functional ileus tends toward more generalized dilation. These are tendencies, not perfect rules, and clinical context is essential."
      ],
      [
        "Plication clues",
        "Short, bunched loops with sharp hairpin turns or uneven crescent/tear-drop gas pockets can raise suspicion for a linear foreign body, particularly in cats. Confirm with the full series and consider ultrasound."
      ],
      [
        "What to do with a borderline diameter",
        "Use the relevant species-specific comparison and course threshold rather than assuming any single enlarged loop means obstruction. Evaluate multiple loops, bowel patterns, distribution and sequential imaging when warranted."
      ]
    ],
    "question": {
      "prompt": "A cat has bunched small bowel loops with tiny eccentric crescent-shaped gas pockets. What process is particularly important to investigate?",
      "options": [
        "Linear foreign body with intestinal plication",
        "A normal kidney",
        "Uncomplicated osteoarthritis",
        "Primary pneumothorax"
      ],
      "answer": 0,
      "why": "Plication can create gathered bowel and irregular gas pockets; it is an important clue, not a definitive stand-alone diagnosis."
    }
  },
  {
    "title": "Bone lucency · lysis and transition zones",
    "source": "MSK2FALL2026, slides 3–10; MSK1FALL26",
    "objectives": [
      "Distinguish osteopenia from localized osteolysis.",
      "Compare geographic, moth-eaten and permeative bone lysis.",
      "Describe transition zones and explain why lesion margins inform differential diagnosis."
    ],
    "learn": [
      [
        "First decide focal or diffuse",
        "Osteopenia denotes generalized or regional reduced bone opacity; osteolysis represents localized bone destruction. Evaluate cortices, medulla and nearby joints before classifying."
      ],
      [
        "Geographic",
        "A single larger lytic region may have a narrow transition zone and defined margins, sometimes favoring a slower process. Importantly, geographic lesions with poorly defined margins can also be aggressive."
      ],
      [
        "Moth-eaten",
        "Multiple variably sized poorly marginated lucent holes create a long transition zone. These are often associated with aggressive processes including neoplasia and infection."
      ],
      [
        "Permeative",
        "Numerous fine, indistinct lucencies and a long transition zone suggest highly active, aggressive destruction. Severity of radiographic appearance is not the same as identifying the exact etiology."
      ]
    ],
    "question": {
      "prompt": "Which bone-lysis description raises the greatest concern for an aggressive process?",
      "options": [
        "Poorly defined permeative lysis and a long transition zone",
        "Smooth, sharply marginated stable geographic lucency",
        "Normal physeal cartilage in a juvenile",
        "A symmetrical normal nutrient foramen"
      ],
      "answer": 0,
      "why": "A long zone of transition and indistinct permeative change suggest rapid/active bone destruction. Infection and malignancy can overlap."
    }
  },
  {
    "title": "Periosteal reactions · what the shape means",
    "source": "MSK2FALL2026, slides 11–19 (solid, lamellar, columnar, spiculated)",
    "objectives": [
      "Classify solid, lamellar, palisading and spiculated periosteal reactions.",
      "Use margin sharpness and organization to evaluate biological activity.",
      "Recognize that a radiographic reaction pattern supports, but does not prove, an etiology."
    ],
    "learn": [
      [
        "What the periosteum does",
        "When the periosteum is irritated or lifted, osteoblasts may form new bone. Slowly developing processes give new bone time to mineralize into smoother continuous contours; rapidly active processes may leave irregular immature reaction."
      ],
      [
        "Solid",
        "A smooth, continuous layer of new bone can reflect slower remodeling, healing or chronic low-grade injury. Always assess nearby lysis and cortical integrity; solid reaction is not universally benign."
      ],
      [
        "Lamellar and columnar",
        "Lamellar reaction creates layered/onion-skin appearances. Palisading/columnar reaction places spicules perpendicular to cortex; associations include hypertrophic osteopathy and some infections."
      ],
      [
        "Spiculated, sunburst and amorphous",
        "Radiating thin new-bone spicules or disorganized amorphous formation suggest active aggressive periosteal reaction. Osteosarcoma may be considered, but osteomyelitis can look similar."
      ]
    ],
    "question": {
      "prompt": "Why does an irregular sunburst periosteal reaction often suggest an active aggressive process?",
      "options": [
        "The periosteum is lifted and reactive bone forms along fibers before a smooth solid layer can organize",
        "The image proves osteosarcoma histologically",
        "The cortex has become cartilage",
        "The pattern is necessarily a normal variant"
      ],
      "answer": 0,
      "why": "Fast tissue response and periosteal elevation can produce disorganized spicular new bone. The pattern alone cannot definitively separate infection from neoplasia."
    }
  },
  {
    "title": "Fractures · describe before diagnosing cause",
    "source": "MSK2FALL2026, fracture classification objectives; MSK1FALL26 acquisition and orthogonal projections",
    "objectives": [
      "Provide a complete standardized fracture description.",
      "Distinguish fracture pattern, alignment, displacement and articular involvement.",
      "Recognize when a fracture may be pathologic and why orthogonal views matter."
    ],
    "learn": [
      [
        "Your fracture report checklist",
        "Name the bone and side, proximal/middle/distal segment, complete versus incomplete, orientation (transverse, short/long oblique, spiral), comminution, displacement, angulation, rotation and articular involvement."
      ],
      [
        "Why two views matter",
        "A fracture may align with the X-ray beam and become faint on one projection. Orthogonal views allow assessment of displacement in another plane and help find articular extension."
      ],
      [
        "Pathologic fractures",
        "A fracture through prior lysis or marked cortical destruction raises concern for underlying neoplasia, infection or another bone-weakening disorder. Do not call it simple trauma without checking adjacent bone."
      ],
      [
        "Do not overinterpret one sign",
        "Smooth callus or new bone may be healing, not an aggressive lesion. History, serial imaging and anatomical pattern help distinguish repair from destructive disease."
      ]
    ],
    "question": {
      "prompt": "Which statement best describes a fracture for a radiology report?",
      "options": [
        "Complete comminuted distal radial diaphyseal fracture with cranial displacement and apex caudal angulation",
        "A broken leg",
        "A fracture most definitely from trauma",
        "An X-ray that looks abnormal"
      ],
      "answer": 0,
      "why": "The standardized description communicates location, completeness, morphology and alignment; etiology and treatment planning follow."
    }
  },
  {
    "title": "Equine hoof · P3 and laminitis landmarks",
    "source": "CVM 743 Charles Equine MSK Principles I/II, hoof evaluation section",
    "objectives": [
      "Identify dorsal hoof wall, P3, sole and palmar angle on a properly labeled lateral hoof radiograph.",
      "Describe hoof-wall and P3 alignment without automatically assigning laminitis.",
      "Recognize acquisition artifacts, shoes and packing issues that affect hoof evaluation."
    ],
    "learn": [
      [
        "Prepare the hoof well",
        "Remove debris, clean sole/frog/sulci and manage metal shoes appropriately per clinical protocol; use appropriate radiopaque surface markers when measuring hoof-wall/P3 alignment."
      ],
      [
        "Evaluate P3",
        "Trace the dorsal P3 cortex relative to the dorsal hoof wall; evaluate palmar angle, sole thickness/contour, hoof-wall thickness and displacement-related measurements. Reliable measurement requires consistent positioning and marker technique."
      ],
      [
        "Why laminitis changes alignment",
        "Inflammation and failure of suspensory lamellar attachments may permit rotation and/or distal displacement of P3 within the hoof capsule. Clinical laminitis can exist before dramatic radiographic displacement develops."
      ],
      [
        "Separate observation from mechanism",
        "Describe observed rotation, widening dorsal hoof wall-to-P3 distance or reduced sole depth before discussing possible laminitis or chronic founder. Compare with clinical findings and prior films."
      ]
    ],
    "question": {
      "prompt": "Why is a radiopaque marker on the dorsal hoof wall helpful in equine lateral foot radiographs?",
      "options": [
        "It enables consistent comparison of the hoof wall with P3 and measurement of their relative alignment",
        "It substitutes for an orthogonal projection",
        "It measures the horse's blood calcium",
        "It guarantees laminitis is absent"
      ],
      "answer": 0,
      "why": "The marker establishes the hoof-wall contour, supporting measurement and interpretation of P3 rotation or displacement."
    }
  }
];
for(const u of lessons){if(!course.units.some(x=>x.title===u.title))course.units.push(u)}
})();
