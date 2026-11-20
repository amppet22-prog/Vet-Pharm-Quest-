/* Vet Pharm Quest: explicit opt-in, multi-module cloud saves.
 * Contains progress/preferences ONLY. Owner tokens, editor drafts and local photos
 * are deliberately excluded. Legacy one-module cloud saves can be restored.
 * Existing game modules continue saving to localStorage as before.
 */
(function(){
"use strict";
const PRIMARY="vpq-v2-clinic-state", OWNER_KEY="vpq-cloud-local-owner", META_PREFIX="vpq-cloud-revision-";
const KEYS=Object.freeze([
  "vpq-v2-clinic-state",          // Main clinic: XP, coins, pets, avatar, completed cases
  "vpq-v2-last-visited-room",    // Location after a refresh
  "vet-pharm-quest-v1",          // Pharmacy Arcade XP, matches and case history
  "vpq-pharm-exam-setup-v1",     // Arcade exam lecture selections
  "vpq-match-recent-v1",        // Recent matches
  "vpq-bugbattle-sources-v1",   // Bug battle settings
  "vpq-shared-learning-focus-v1",
  "vpq-shared-learning-progress-v1",
  "vpq-mastery-v27",
  "vpq-oh-recent-v4",
  "vpq-inpatient-care-v3",
  "vpq-pathogen-lab-v1",
  "vpq-necropsy-flashcards-v1"
]);
const MAX_BYTES=480000;
const $=id=>document.getElementById(id);
const dataSize=value=>new TextEncoder().encode(JSON.stringify(value)).length;
let client=null,userId=null,optedIn=false,remoteRevision=null, timer=null,scanTimer=null,inFlight=false,again=false,lastFingerprint="",conflict=false;
function localGet(key){try{return localStorage.getItem(key)}catch{return null}}
function localSet(key,value){localStorage.setItem(key,value)}
function readSelected(){
  const slots={};
  for(const key of KEYS){
    const raw=localGet(key);
    if(raw===null)continue;
    // All supported progress keys store JSON; reject corrupt entries.
    try{slots[key]=JSON.parse(raw)}catch{continue}
  }
  return {format:3,slots};
}
function validSave(payload){
  return payload && typeof payload==="object" && payload.format===3 &&
    payload.slots && typeof payload.slots==="object" && !Array.isArray(payload.slots) &&
    Object.keys(payload.slots).every(key=>KEYS.includes(key));
}
function validateLegacy(data){
  return data && typeof data==="object" && Number.isFinite(data.xp) &&
    Number.isFinite(data.coins) && Array.isArray(data.completed) && Array.isArray(data.upgrades);
}
function normalize(data){
  if(validSave(data))return data;
  if(validateLegacy(data))return {format:3,slots:{[PRIMARY]:data}};
  throw Error("Cloud backup is not a supported game-save format.");
}
function notify(msg,error=false){
 const el=$("vpqCloudSaveStatus");
 if(el){el.textContent=msg;el.style.color=error?"#a13a3a":"#304c70";}
}
function panel(){
 let p=$("vpqCloudSavePanel");if(p)return p;
 p=document.createElement("section");
 p.id="vpqCloudSavePanel";
 p.style.cssText="position:fixed;right:12px;bottom:12px;z-index:1000;width:min(365px,calc(100vw - 24px));background:white;padding:14px;border:2px solid #b9c9e8;border-radius:16px;box-shadow:0 8px 30px #263f5c33;color:#263f5c;font-size:12px";
 p.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:7px"><strong>☁️ Game-wide Cloud Save</strong><button type="button" id="vpqCloudHide">✕</button></div><p id="vpqCloudSaveStatus" role="status" aria-live="polite"></p><div id="vpqCloudSaveButtons" style="display:flex;flex-wrap:wrap;gap:6px"></div><p style="font-size:11px;color:#61728a;margin:8px 0 0">Includes clinic, Arcade, lecture focus, mastery and supported specialty practice. Unpublished owner edits, images and publishing keys are excluded. Browser saves remain active.</p>';
 document.body.appendChild(p);
 $("vpqCloudHide").onclick=()=>p.remove();
 return p;
}
function addButton(label,fn){
 const b=document.createElement("button");b.type="button";b.textContent=label;b.style.cssText="font-size:12px;padding:7px 9px";
 b.onclick=fn;$("vpqCloudSaveButtons").appendChild(b);
}
async function fetchRemote(owner){
 const {data,error}=await client.from("player_saves").select("save_data,updated_at").eq("user_id",owner).maybeSingle();
 if(error)throw error;return data||null;
}
function getRevision(owner){return localGet(META_PREFIX+owner)||null}
function setRevision(owner,revision){
 remoteRevision=revision||null;
 try{if(revision)localSet(META_PREFIX+owner,revision)}catch{}
}
async function upload({confirmed=false}={}){
 if(!client||!userId||inFlight||conflict||!optedIn)return;
 const owner=userId, payload=readSelected();
 if(!payload.slots[PRIMARY]&&!payload.slots["vet-pharm-quest-v1"])return;
 if(dataSize(payload)>MAX_BYTES){notify("Cloud data exceeds the current save limit. Local progress is safe. Download your complete save in the Save Center.",true);return;}
 inFlight=true;
 try{
   const remote=await fetchRemote(owner);
   if(owner!==userId)return;
   // Another device has a newer saved revision: never overwrite it silently.
   if(remote && !confirmed && remote.updated_at!==getRevision(owner)){
     conflict=true;optedIn=false;clearTimeout(timer);notify("A newer or unknown cloud save exists. Auto-backup paused. Choose Restore or Back up this browser after reviewing both saves.",true);render();return;
   }
   const {data,error}=await client.from("player_saves").upsert({user_id:owner,save_data:payload},{onConflict:"user_id"}).select("updated_at").single();
   if(error)throw error;
   if(owner!==userId)return;
   setRevision(owner,data.updated_at);
   lastFingerprint=JSON.stringify(payload);
   notify("Cloud backup saved at "+new Date().toLocaleTimeString()+".");
 }catch(error){notify("Cloud backup failed; local progress was kept. "+(error.message||""),true);}
 finally{inFlight=false;if(again){again=false;queue();}}
}
function queue(){
 if(!optedIn||!userId||conflict)return;
 const payload=readSelected();
 if(JSON.stringify(payload)===lastFingerprint)return;
 clearTimeout(timer);timer=setTimeout(()=>{if(inFlight){again=true;return;}upload();},2400);
}
async function firstUpload(){
 if(!client||!userId)return;
 const payload=readSelected();
 if(!payload.slots[PRIMARY]&&!payload.slots["vet-pharm-quest-v1"]){notify("No valid game save found on this browser.",true);return;}
 if(dataSize(payload)>MAX_BYTES){notify("This save is too large for cloud backup. Local progress is safe.",true);return;}
 try{
  const existing=await fetchRemote(userId);
  const message=existing ?
   "This account already has a cloud save. Uploading this browser's current progress will REPLACE that cloud save. Download a backup first if you are unsure. Continue?" :
   "Back up the progress currently on this browser to your account? Future progress will then save automatically while the game is open.";
  if(!confirm(message))return;
  optedIn=true;conflict=false;lastFingerprint="";
  localSet("vpq-cloud-opt-in-"+userId,"1");
  localSet(OWNER_KEY,userId);
  await upload({confirmed:true});render();
 }catch(error){notify("Could not start cloud saving: "+(error.message||""),true);}
}
async function restore(){
 if(!client||!userId)return;
 const owner=userId;
 try{
  notify("Loading cloud backup…");
  const remote=await fetchRemote(owner);
  if(owner!==userId)return;
  if(!remote){notify("This account has no cloud save yet.",true);return;}
  const payload=normalize(remote.save_data);
  if(!payload.slots[PRIMARY]&&!payload.slots["vet-pharm-quest-v1"]){notify("Cloud backup has no supported game progress.",true);return;}
  if(!confirm("Restore this account's saved game on this browser? A backup of the current supported progress will be downloaded first. This will REPLACE the current supported progress on this browser and reload the game."))return;
  const backup=new Blob([JSON.stringify({app:"Vet Pharm Quest multi-module local backup",created_at:new Date().toISOString(),save:readSelected()},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(backup),a=document.createElement("a");
  a.href=url;a.download="Vet_Pharm_Quest_Pre_Cloud_Restore.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  // Take a second browser-local recovery snapshot before writing any keys.
  const recoveryKey="vpq-cloud-recovery-"+owner;
  try{localSet(recoveryKey,JSON.stringify(readSelected()))}catch{/* download is still the backup */}
  // Save these keys in a reversible batch; an error restores original browser values.
  const previous=Object.fromEntries(KEYS.map(k=>[k,localGet(k)]));
  try{
    for(const key of KEYS){
      if(Object.prototype.hasOwnProperty.call(payload.slots,key))localSet(key,JSON.stringify(payload.slots[key]));
      else localStorage.removeItem(key);
    }
    localSet(OWNER_KEY,owner);
    localSet("vpq-cloud-opt-in-"+owner,"1");
  }catch(error){
    for(const key of KEYS){try{if(previous[key]===null)localStorage.removeItem(key);else localSet(key,previous[key])}catch{}}
    throw error;
  }
  optedIn=true;conflict=false;setRevision(owner,remote.updated_at);
  location.reload();
 }catch(error){notify("Restore failed. Your previous browser save should be intact; use the downloaded recovery file if needed. "+(error.message||""),true);}
}
function render(){
 panel();
 const target=$("vpqCloudSaveButtons");target.replaceChildren();
 if(!client){notify("Cloud saving is not configured. Browser saves still work.");return;}
 if(!userId){notify("Sign in to save game progress across devices. Guests keep browser-local progress.");return;}
 if(conflict)notify("Cloud backup paused because another save exists. Review before overwriting.",true);
 else if(optedIn)notify("Automatic cloud backup is enabled. Game progress also remains on this browser.");
 else notify(localGet(OWNER_KEY)&&localGet(OWNER_KEY)!==userId?"This browser has progress linked to another account. Choose Restore or explicitly back up this browser; no automatic replacement.":"Choose Back up this browser or Restore cloud save. Nothing will be overwritten without confirmation.");
 addButton("Back up this browser",firstUpload);
 addButton("Restore cloud save",restore);
 if(optedIn)addButton("Pause auto backup",()=>{optedIn=false;clearTimeout(timer);localStorage.removeItem("vpq-cloud-opt-in-"+userId);render();});
}
function launch(){
 client=window.VPQ_PLAYER_ACCOUNT?.getClient?.()||null;
 userId=window.VPQ_PLAYER_ACCOUNT?.getUser?.()?.id||null;
 conflict=false;lastFingerprint="";
 optedIn=!!userId&&localGet("vpq-cloud-opt-in-"+userId)==="1"&&localGet(OWNER_KEY)===userId;
 remoteRevision=userId?getRevision(userId):null;
 render();
 if(optedIn)queue();
}
function makeButton(){
 const target=$("saveBtn")||$("vpqAccountBtn");
 if(!target||$("vpqCloudButton"))return;
 const b=document.createElement("button");
 b.type="button";b.id="vpqCloudButton";b.className="mini";b.textContent="☁️ Cloud Save";
 b.onclick=()=>{if($("vpqCloudSavePanel"))$("vpqCloudSavePanel").remove();else launch();};
 target.insertAdjacentElement("afterend",b);
}
window.addEventListener("vpq-player-auth-change",()=>{clearTimeout(timer);conflict=false;optedIn=false;lastFingerprint="";launch();});
window.addEventListener("vpq-clinic-progress-saved",queue);
window.addEventListener("storage",e=>{if(KEYS.includes(e.key))queue();});
document.addEventListener("DOMContentLoaded",()=>{
 makeButton();launch();
 // The Arcade and specialty modules use independent localStorage calls.
 // Poll for changed progress while the game is open; only upload changes.
 scanTimer=setInterval(queue,10000);
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")queue();});
});
window.VPQ_CLOUD_SAVE=Object.freeze({open:launch,queue,supportedKeys:KEYS.slice()});
})();
