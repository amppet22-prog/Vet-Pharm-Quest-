/* Restore handoff runs at the very start of each page, BEFORE game state is read.
 * Avoids the old game's pagehide handler overwriting the freshly restored state.
 * No server uploads and no auth credentials ever stored here.
 */
(function(){
"use strict";
const KEY="vpq-cloud-restore-handoff-v1";
let raw=null,restore=null;
try{raw=sessionStorage.getItem(KEY);if(!raw)return;restore=JSON.parse(raw);}catch(e){return;}
if(!restore || restore.format!==3 || !restore.slots || typeof restore.slots!=="object")return;
const allowed=["vpq-v2-clinic-state","vpq-v2-last-visited-room","vet-pharm-quest-v1","vpq-pharm-exam-setup-v1","vpq-match-recent-v1","vpq-bugbattle-sources-v1","vpq-shared-learning-focus-v1","vpq-shared-learning-progress-v1","vpq-mastery-v27","vpq-oh-recent-v4","vpq-inpatient-care-v3","vpq-pathogen-lab-v1","vpq-necropsy-flashcards-v1"];
try{
 for(const k of allowed){
   if(Object.prototype.hasOwnProperty.call(restore.slots,k))localStorage.setItem(k,JSON.stringify(restore.slots[k]));
   else if(!restore.legacy)localStorage.removeItem(k);
 }
 sessionStorage.removeItem(KEY);
 sessionStorage.setItem("vpq-cloud-restore-applied","1");
}catch(err){console.error("Cloud restore could not apply before game loaded",err);}
})();
