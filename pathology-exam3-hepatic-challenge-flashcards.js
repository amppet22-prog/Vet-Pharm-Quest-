/* Source-grounded clinical differential recall for hepatic L36–40.
 * Additive quizlet-style flashcards and image-recognition challenges.
 * Each answer is compact; related cases require gross -> histo reasoning. */
(function(){'use strict';const L=window.VPQ_PATH_LECTURE_LEARN||{};
const items={
36:[
['A zone-3 lesion surrounds which landmark?','Central vein, not the portal tract.'],
['Which direction does blood move through a classic hepatic lobule?','From portal tracts through sinusoids toward the central vein.'],
['Which direction does bile move relative to blood?','Opposite blood: canaliculi flow toward portal bile ducts.'],
['Name the lobular zone most susceptible to hypoxia and many P450 toxic metabolites.','Zone 3 (centrilobular).'],
['Random vs zonal necrosis: what determines classification?','Random has no repeating lobular position; zonal consistently affects one zone.'],
['What evidence distinguishes cholestasis from hemolytic hyperbilirubinemia?','Bile stasis/obstruction or liver disease vs excess prehepatic RBC breakdown.']
],
37:[
['Nutmeg liver: which region looks red?','Congested centrilobular zone 3, surrounded by paler periportal tissue.'],
['Intrahepatic congenital shunt: fetal remnant?','Persistent ductus venosus, especially in large-breed dogs.'],
['Extrahepatic congenital shunts: typical signalment?','Small-breed dogs and cats with microhepatia and encephalopathy.'],
['Portal hypertension plus multiple acquired collaterals: which pathogenesis?','Elevated portal resistance redirects flow through collateral vessels.'],
['Telangiectasia vs hepatic hemangiosarcoma?','Dilation of preexisting sinusoids vs infiltrative malignant endothelial proliferation.'],
['How does severe liver failure promote ascites?','Portal hypertension and/or reduced albumin lower vascular fluid retention.'],
['Why does hepatogenous photosensitization target pale skin?','Unexcreted phylloerythrin is photoactivated by UV on exposed skin.']
],
38:[
['Foal + random hepatic necrosis + bacilli at edges: diagnosis?','Tyzzer disease, Clostridium piliforme.'],
['Which silver stains help demonstrate Tyzzer organisms?','Warthin–Starry or Gomori silver stain.'],
['CAV-1 hepatitis: two key gross clues?','Edematous gallbladder wall and hemorrhagic friable liver.'],
['CAV-1 hepatitis: what key histologic clue?','Intranuclear inclusions in hepatocytes/endothelial cells/Kupffer cells.'],
['Which liver parasite causes pig milk spots?','Migrating Ascaris suum larvae.'],
['Fasciola vs Fascioloides magna mature locations?','Fasciola species: bile ducts; F. magna: hepatic parenchymal cavities.'],
['Cat with neutrophilic bile-duct inflammation: most likely infection route?','Ascending intestinal/enteric bacterial infection.'],
['Older cat with portal lymphocytes: key alternative diagnosis?','Lymphoma, especially if duct architecture is obscured.'],
['Feedlot cattle liver abscess: what is the upstream lesion?','Ruminal acidosis leading to rumenitis and portal bacterial spread.']
],
39:[
['Pyrrolizidine alkaloid toxicosis: hallmark histology?','Megalocytosis with fibrosis and ductular proliferation.'],
['Aflatoxin source and main toxic activation mechanism?','Moldy stored feed; hepatic P450 generates damaging metabolites.'],
['Blue-green algae toxin: classic acute liver lesion?','Massive hemorrhagic liver necrosis after contaminated-water exposure.'],
['Xylitol in dogs: immediate metabolic emergency?','Rapid insulin release and severe hypoglycemia.'],
['Hemochromatosis vs hemosiderosis?','Iron overload causing tissue dysfunction vs pigment deposition without damage.'],
['Fatty liver after anorexia: most typical small-animal species?','Cat, particularly an overweight cat.'],
['What accumulates in canine steroid hepatopathy?','Hepatocellular glycogen, not triglycerides.'],
['Why can ovine copper storage kill the kidneys?','Sudden hemolysis causes hemoglobinuric tubular injury.']
],
40:[
['Older dog + incidental liver nodules: benign common lesion?','Hepatocellular nodular hyperplasia.'],
['Fibrosis encircles multiple nodules: likely pathogenesis?','Regenerative nodules following chronic injury, not incidental hyperplasia.'],
['Three gross classifications of hepatocellular carcinoma?','Massive, nodular, diffuse.'],
['Melanoma metastatic liver: common gross appearance?','Multifocal black nodules; histology still required.'],
['Cholangiocellular carcinoma: tissue of origin?','Bile duct epithelium.'],
['How does a gallbladder mucocele differ from a fasting gallbladder?','Tenacious inspissated mucus vs ordinary stored liquid bile.'],
['What can gallbladder rupture cause?','Severe bile peritonitis, with or without bacterial infection.'],
['Why biopsy multiple liver lobes and margins?','Heterogeneous distribution can cause false negatives in focal samples.']
]};
for(const [n,cards] of Object.entries(items)){
 const l=L[n];if(!l||l.sections.some(s=>s.title==='Exam 3 · Higher-order retrieval'))continue;
 l.sections.push({title:'Exam 3 · Higher-order retrieval',slides:'Across lecture',points:[['Practice order','Identify the species and gross pattern first; then predict microscopy, decide on the mechanism, and choose the diagnostic test.'],['Compare-first rule','Never diagnose by liver color alone: similar colors result from congestion, necrosis, fat, cholestasis, copper, iron and tumors.']],flashcards:cards});
}
window.VPQ_PATH_EXAM3_HEPATIC_CHALLENGE_COUNT=Object.values(items).reduce((a,x)=>a+x.length,0);
})();