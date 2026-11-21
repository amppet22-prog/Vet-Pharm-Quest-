/* Exam 7 final display-content correction.
 * Baseline content only: the owner-published specimen overlay and local browser
 * edits still win at render time. Does not change photo IDs, sources or notes.
 */
(function(){'use strict';
const bank=window.VPQ_PATH_EXAM7_DATA||[];
const lessons=window.VPQ_PATH_LECTURE_LEARN||{};
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=s=>String(s||'').replace(/^\s*(?:Gross(?: appearance| lesions?| findings?| fetal clue| fetus)?|Key feature \d+|Lecture feature \d+|Recognition \/ don't confuse|Professor's core findings|Core lesion \/ pathogenesis|Clinical distinction|Gross\/clinical distinction|Gross recognition|Fetus|Placenta|Outcome|Diagnosis|Clinical|Key finding \d+)\s*:\s*/i,'').trim();
const genericDx=/^Working identification:|Specimen site:|Formulate the final morphologic diagnosis/i;
const genericHisto=/^No distinctive histologic pattern is specified in this lecture section/i;
const genericWhy=/^Use the lecture.s host, lesion location and clinical history/i;
const grossLabel=/gross|appearance|lesion|distribution|look|finding|recognition|clinical|site|location|fetus|placenta|swelling|cut surface/i;
const histoLabel=/histolog|microscop|cytolog|acanthol|inclusion|necros|inflammat|vessel|cellular pattern|pathologic pattern/i;
const mechLabel=/pathogen|mechanism|pathogenesis|caus|why|route|infection|transmission|exposure|etiolog|risk/i;
const fixes={gross:0,histo:0,why:0,dx:0,duplicates:0,blank:0};
for(const card of bank){
 const l=String(card.lecture||'');
 if(!/^(67|68|69|70|71|72|73|74|75|76|77|78|79)$/.test(l)||card.normal||card.atlasComparison||card.dermComparison||card.id==='exam7-30')continue;
 const sec=lessons[l]?.sections?.find(x=>norm(x.title)===norm(card.title));
 const points=(sec?.points||[]).filter(p=>Array.isArray(p)&&p.length>=2).map(p=>[String(p[0]),String(p[1])]);
 const find=(re,avoid)=>points.filter(p=>re.test(p[0])&&(!avoid||!avoid.test(p[0]))).map(p=>clean(p[1])).filter(x=>x.length>24);
 // Generated gross often repeats 'Gross: ...' or a line unrelated to what appears.
 if(/^pathx-/.test(card.id||'')){
  const gross=find(grossLabel,/don't confuse|differential|why/i);
  if(gross.length){
   const current=clean(card.gross);
   const better=gross.slice(0,2).join(' ');
   if(/^(key|professor|lecture|clinical distinction|gross|organism|pathogen|diagnosis)\s*:/i.test(String(card.gross||''))||current.length<50){
    if(better.length>current.length/2){card.gross=better;fixes.gross++;}
   }else if(current!==card.gross){card.gross=current;fixes.gross++;}
  }
  const microscopic=find(histoLabel,/gross|clinical|differential|compare/i);
  if(genericHisto.test(card.histo||'')&&microscopic.length){
   card.histo=microscopic.slice(0,2).join(' ');fixes.histo++;
  }
  const mechanisms=find(mechLabel,/compare|differential/i);
  if(genericWhy.test(card.why||'')&&mechanisms.length){
   card.why=mechanisms.slice(0,2).join(' ');fixes.why++;
  }
  // Generic placeholders are not diagnoses. The viewer hides them, retaining
  // genuine instructor-derived lesion descriptions where available.
  if(genericDx.test(card.dx||'')){card.atlasUnconfirmedMorphology=true;fixes.dx++;}
  if(genericHisto.test(card.histo||''))card.atlasNoSpecificHisto=true;
  if(genericWhy.test(card.why||''))card.atlasNoSpecificWhy=true;
 }
 // One short visual takeaway is enough; repeated lecturer blocks in study
 // notes are supplementary, not a main description.
 if(card.compare&&card.visualClue&&norm(card.compare)===norm(card.visualClue)){card.compare='';fixes.duplicates++;}
}
window.VPQ_EXAM7_LEGACY_CONTENT_CLEANUP=fixes;
})();