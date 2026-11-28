/* Necropsy Specimen Cabinet — Claude's lecture-verified layer (2026-11-28).
 * Lecture files call VPQ_ATLAS_LAYER.add('67',{id:{...}}). Fields used:
 *   gross, dx, histo, why, notes, visualClue, compare  → replace the card text (owner-published text still wins in the studio)
 *   photos: [[file, caption, prompt?], ...]            → clean lecture photos (pathology-course-photos/exam7/L##/)
 *   keys:   [[file, caption], ...]                      → the owner's marked slide(s), shown after the clean photos
 *   dup: 'other-id'                                     → hide this card as a duplicate (never hides cards with owner text/photos/drafts)
 * Stable IDs are never changed; cards are patched in place after every data file has loaded.
 */
(function(){'use strict';
const BASE='https://raw.githubusercontent.com/amppet22-prog/Vet-Pharm-Quest-/main/pathology-course-photos/exam7/';
const pending={};let applied=false;
const TEXT=['title','gross','dx','histo','why','notes','visualClue','compare'];
function apply(){
 const data=window.VPQ_PATH_EXAM7_DATA;if(!Array.isArray(data))return 0;let n=0;
 for(const [lec,cards] of Object.entries(pending)){
  for(const [id,p] of Object.entries(cards)){
   const x=data.find(c=>c.id===id);if(!x)continue;n++;
   if(p.dup){x.canonicalDuplicateOf=p.dup;x.duplicateReason='Same topic as '+p.dup+' (Claude atlas pass)';continue}
   let rewrote=false;
   for(const k of TEXT)if(p[k]!=null){x[k]=p[k];rewrote=true}
   if(rewrote){delete x.atlasUnconfirmedMorphology;delete x.atlasNoSpecificHisto;delete x.atlasNoSpecificWhy;if(p.why)delete x.mechanismSummary;x.claudeVerified='L'+lec}
   const src='Lecture '+lec+' slides (Dr. Andersson), owner-annotated copy';
   const photos=(p.photos||[]).map(f=>({asset:BASE+'L'+lec+'/'+f[0],caption:f[1],source:src,studyPrompt:f[2]||''}));
   /* Marked-slide keys are kept on disk but not shown on atlas cards: the atlas is for gross/histo photos. */
     const keys=[].map(f=>({asset:BASE+'L'+lec+'/_keys/'+f[0],caption:'Your marked slide · '+f[1],source:src,studyPrompt:'Circles and handwriting are your class notes.'}));
   if(photos.length||keys.length){x.publicLecturePhotos=[...photos,...keys];if(photos[0]&&!x.image)x.image=photos[0].asset}
   if(p.slides)x.lectureSourceSlides=p.slides;
  }
 }
 applied=true;return n;
}
function add(lec,cards){pending[lec]=Object.assign(pending[lec]||{},cards);if(applied)apply()}
window.VPQ_ATLAS_LAYER={add,apply,pending:()=>pending};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else setTimeout(apply,0);
window.addEventListener('load',apply);
})();
