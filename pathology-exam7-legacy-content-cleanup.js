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
/* Many instructor paragraphs embed Gross:, Histology: and Pathway: in one
   point. The old automatic extractor copied the whole paragraph into multiple
   fields. Split only at explicit section labels to avoid showing Pathway under
   Gross or Gross under Histology. */
const segmentLabels=/\b(?:Gross(?: appearance| lesions?| findings?| fetus)?|Histology|Histopathology|Microscopy|Pathway|Mechanism|Pathogenesis|Why|Clinical|Syndromes|Species|Host|Distribution|Differential|Compare|Caution)\s*:/ig;
function labeledSegment(raw,desired){
 const source=String(raw||''),matches=[...source.matchAll(segmentLabels)];
 for(let i=0;i<matches.length;i++){
  const key=matches[i][0].replace(/\s*:\s*$/,'').toLowerCase();
  if(!desired.test(key))continue;
  const start=matches[i].index+matches[i][0].length,end=i+1<matches.length?matches[i+1].index:source.length;
  const value=source.slice(start,end).trim().replace(/^[.;,\s]+|[.;,\s]+$/g,'');
  if(value.length>=24)return value.endsWith('.')?value:value+'.';
 }
 return '';
}
for(const card of bank){
 if(!/^pathx-/.test(card.id||'')||card.id==='exam7-30'||!(/^(67|68|69|70|71|72|73|74|75|76|77|78|79)$/).test(String(card.lecture)))continue;
 const sec=lessons[String(card.lecture)]?.sections?.find(x=>norm(x.title)===norm(card.title));
 if(!sec)continue;
 const source=(sec.points||[]).filter(x=>Array.isArray(x)).map(x=>String(x[1]||''));
 const gross=source.map(x=>labeledSegment(x,/^gross/)).find(Boolean);
 const histo=source.map(x=>labeledSegment(x,/^(histology|histopathology|microscopy)$/)).find(Boolean);
 const pathway=source.map(x=>labeledSegment(x,/^(pathway|mechanism|pathogenesis|why)$/)).find(Boolean);
 if(gross&&(/\b(?:Pathway|Histology|Mechanism|Gross):/i.test(String(card.gross||''))||String(card.gross||'').length<55)){card.gross=gross;fixes.gross++;}
 if(histo&&(/\b(?:Pathway|Gross|Histology):/i.test(String(card.histo||''))||card.atlasNoSpecificHisto)){card.histo=histo;card.atlasNoSpecificHisto=false;fixes.histo++;}
 if(pathway&&(/\b(?:Gross|Histology|Pathway):/i.test(String(card.why||''))||card.atlasNoSpecificWhy)){card.why=pathway;card.atlasNoSpecificWhy=false;fixes.why++;}
}
/* Prefer explicitly labeled instructor Gross / Histology / Pathway fields.
   The old bank used keyword matches across ALL labels and accidentally pasted
   a Pathway under Histology or a Host history under Pathogenesis. */
for(const card of bank){
 if(!/^pathx-/.test(card.id||'')||!(/^(67|68|69|70|71|72|73|74|75|76|77|78|79)$/).test(String(card.lecture)))continue;
 const sec=lessons[String(card.lecture)]?.sections?.find(x=>norm(x.title)===norm(card.title));if(!sec)continue;
 const p=sec.points||[];
 const exact=re=>p.filter(x=>Array.isArray(x)&&re.test(String(x[0]||''))).map(x=>String(x[1]||'').trim()).filter(x=>x.length>20);
 const gross=exact(/^Gross(?: appearance| lesions?| findings?| fetal clue| fetus)?$/i);
 const histo=exact(/^(?:Histology|Histopathology|Microscopy|Microscopic findings)$/i);
 const why=exact(/^(?:Pathway|Pathogenesis|Mechanism|Why CNS damage occurs|Why)$/i);
 if(gross.length&&card.gross!==gross[0]){card.gross=gross.slice(0,2).join(' ');fixes.gross++;}
 if(histo.length&&card.histo!==histo[0]){card.histo=histo.slice(0,2).join(' ');card.atlasNoSpecificHisto=false;fixes.histo++;}
 if(why.length&&card.why!==why[0]){card.why=why.slice(0,2).join(' ');card.atlasNoSpecificWhy=false;fixes.why++;}
}
window.VPQ_EXAM7_LEGACY_CONTENT_CLEANUP=fixes;
})();