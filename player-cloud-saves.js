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
// Live release is deliberately opt-in. Never upload editor content or credentials.
const $=id=>document.getElementById(id);
const dataSize=value=>new TextEncoder().encode(JSON.stringify(value)).length;
let client=null,userId=null,optedIn=false,remoteRevision=null, timer=null,scanTimer=null,inFlight=false,again=false,lastFingerprint="",conflict=false,checkingInitial=false,lastStatus="";
const PENDING_PREFIX="vpq-cloud-pending-";
function pendingMarker(owner,pending){if(!owner)return;try{if(pending)localStorage.setItem(PENDING_PREFIX+owner,"1");else localStorage.removeItem(PENDING_PREFIX+owner)}catch{}}
function updateIndicator(){const b=$("vpqCloudButton");if(!b)return;b.textContent=!userId?"☁️ Guest save":conflict?"⚠️ Choose save":!optedIn?"☁️ Cloud setup":inFlight||timer||localGet(PENDING_PREFIX+userId)?"☁️ Saving…":"☁️ Saved";b.title=lastStatus||"Cloud save settings";}
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
function progressSummary(payload){
 const slots=payload?.slots||{};
 const clinic=slots[PRIMARY]||{};
 const arcade=slots["vet-pharm-quest-v1"]||{};
 const xp=Math.max(0,Number(clinic.xp)||0),coins=Math.max(0,Number(clinic.coins)||0);
 const arcadeXP=Math.max(0,Number(arcade.xp)||0);
 const cases=Array.isArray(clinic.completed)?clinic.completed.length:0;
 return {xp,coins,arcadeXP,cases,meaningful:xp>0||coins>0||arcadeXP>0||cases>0};
}
function progressLabel(payload){
 const a=progressSummary(payload);
 return "Clinic XP: "+a.xp+", coins: "+a.coins+", completed cases: "+a.cases+", Arcade XP: "+a.arcadeXP;
}
function validateLegacy(data){
  return data && typeof data==="object" && Number.isFinite(data.xp) &&
    Number.isFinite(data.coins) && Array.isArray(data.completed) && Array.isArray(data.upgrades);
}
function normalize(data){
  if(validSave(data))return data;
  if(validateLegacy(data))return {format:3,legacy:true,slots:{[PRIMARY]:data}};
  throw Error("Cloud backup is not a supported game-save format.");
}
function notify(msg,error=false){
 lastStatus=msg;
 const el=$("vpqCloudSaveStatus");
 if(el){el.textContent=msg;el.style.color=error?"#a13a3a":"#304c70";}
 updateIndicator();
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
 inFlight=true;pendingMarker(owner,true);updateIndicator();
 try{
   const remote=await fetchRemote(owner);
   if(owner!==userId||!optedIn)return;
   // Another device has a newer saved revision: never overwrite it silently.
   if(remote && !confirmed && remote.updated_at!==getRevision(owner)){
     conflict=true;optedIn=false;clearTimeout(timer);notify("A newer or unknown cloud save exists. Auto-backup paused. Choose Restore or Back up this browser after reviewing both saves.",true);render();return;
   }
   if(remote){
     const online=progressSummary(normalize(remote.save_data));
     const here=progressSummary(payload);
     if(online.meaningful&&!here.meaningful){
       conflict=true;optedIn=false;clearTimeout(timer);timer=null;
       notify("⚠️ PROTECTED: This browser has zero progress, but your cloud backup contains XP or coins. Online progress was NOT overwritten. Choose Restore cloud save.",true);
       panel();render();return;
     }
   }
   if(owner!==userId||!optedIn)return;
   const {data,error}=await client.from("player_saves").upsert({user_id:owner,save_data:payload},{onConflict:"user_id"}).select("updated_at").single();
   if(error)throw error;
   if(owner!==userId)return;
   setRevision(owner,data.updated_at);
   lastFingerprint=JSON.stringify(payload);
   pendingMarker(owner,false);
   notify("☁️ All progress saved online at "+new Date().toLocaleTimeString()+".");
 }catch(error){notify("Cloud backup failed; local progress was kept. "+(error.message||""),true);}
 finally{inFlight=false;if(again){again=false;queue();}updateIndicator();}
}
function queue(){
 if(!optedIn||!userId||conflict)return;
 const payload=readSelected();
 if(JSON.stringify(payload)===lastFingerprint)return;
 pendingMarker(userId,true);notify("Saving your progress automatically…");
 clearTimeout(timer);timer=setTimeout(()=>{timer=null;if(inFlight){again=true;return;}upload();},2400);
}
async function firstUpload(){
 if(!client||!userId)return;
 const payload=readSelected();
 if(!payload.slots[PRIMARY]&&!payload.slots["vet-pharm-quest-v1"]){notify("No valid game save found on this browser.",true);return;}
 if(dataSize(payload)>MAX_BYTES){notify("This save is too large for cloud backup. Local progress is safe.",true);return;}
 try{
  const existing=await fetchRemote(userId);
  if(existing){
    const online=progressSummary(normalize(existing.save_data));
    const here=progressSummary(payload);
    if(online.meaningful&&!here.meaningful){
      notify("⚠️ This browser has no XP, but your cloud save does. Upload is blocked to protect your account. Choose Restore cloud save instead.",true);
      return;
    }
  }
  const message=existing ?
   "Your ONLINE save: "+progressLabel(normalize(existing.save_data))+"\\nThis BROWSER: "+progressLabel(payload)+"\\n\\nReplace your online save with this browser's progress? This cannot be automatically undone." :
   "Back up the progress currently on this browser to your account? Future progress will then save automatically while the game is open.";
  if(!confirm(message))return;
  optedIn=true;conflict=false;lastFingerprint="";
  await upload({confirmed:true});
  if(!conflict && lastFingerprint){localSet("vpq-cloud-opt-in-"+userId,"1");localSet(OWNER_KEY,userId);}
  else optedIn=false;
  render();
 }catch(error){notify("Could not start cloud saving: "+(error.message||""),true);}
}
async function inspectSave(){
 if(!client||!userId)return;
 const owner=userId;
 try{
   notify("Checking cloud backup…");
   const remote=await fetchRemote(owner);
   if(owner!==userId)return;
   if(!remote){notify("No online save exists for this account. This browser's progress has not been replaced.",true);return;}
   const payload=normalize(remote.save_data);
   notify("ONLINE BACKUP ("+new Date(remote.updated_at).toLocaleString()+"): "+progressLabel(payload)+". CURRENT BROWSER: "+progressLabel(readSelected())+".");
 }catch(error){notify("Could not inspect online save: "+(error.message||""),true);}
}
async function restore(){
 if(!client||!userId)return;
 const owner=userId;
 try{
  notify("Loading cloud backup…");
  const remote=await fetchRemote(owner);
  if(owner!==userId)return;
  if(!remote){notify("This account has no cloud save yet. Do NOT back up an empty browser if your original XP is on another device.",true);return;}
  const payload=normalize(remote.save_data);
  if(!payload.slots[PRIMARY]&&!payload.slots["vet-pharm-quest-v1"]){notify("Cloud backup has no supported game progress.",true);return;}
  notify("Online save found: "+progressLabel(payload));
  if(!confirm("ONLINE SAVE: "+progressLabel(payload)+"\\nCURRENT BROWSER: "+progressLabel(readSelected())+"\\n\\nRestore this online save to this browser? A local recovery snapshot will let you undo."))return;
  // A browser-local recovery snapshot is created; downloading is optional.
  // Take a second browser-local recovery snapshot before writing any keys.
  const recoveryKey="vpq-cloud-recovery-"+owner;
  try{localSet(recoveryKey,JSON.stringify(readSelected()))}catch{notify("Could not create recovery snapshot. Restore cancelled to protect progress.",true);return;}
  // Apply during the NEXT page boot, after previous pagehide has completed.
  try{
    sessionStorage.setItem("vpq-cloud-restore-handoff-v1",JSON.stringify(payload));
    localSet(OWNER_KEY,owner);
    localSet("vpq-cloud-opt-in-"+owner,"1");
    pendingMarker(owner,false);
    setRevision(owner,remote.updated_at);
  }catch(err){notify("Could not prepare cloud restore: "+err.message,true);return;}
  optedIn=true;conflict=false;
  location.reload();
 }catch(error){notify("Restore failed. Your previous browser save was not intentionally changed. "+(error.message||""),true);}
}
function render(){
 if(!$("vpqCloudSavePanel"))return;
 const target=$("vpqCloudSaveButtons");target.replaceChildren();
 if(!client){notify("Cloud saving is not configured. Browser saves still work.");return;}
 if(!userId){notify("Sign in to save game progress across devices. Guests keep browser-local progress.");return;}
 if(conflict)notify("Cloud backup paused because another save exists. Review before overwriting.",true);
 else if(optedIn)notify("☁️ Auto-save is ON. Progress saves to your account and this browser.");
 else notify(localGet(OWNER_KEY)&&localGet(OWNER_KEY)!==userId?"This browser has progress linked to another account. Choose Restore or explicitly back up this browser; no automatic replacement.":"Choose Back up this browser or Restore cloud save. Nothing will be overwritten without confirmation.");
 addButton("Check online XP",inspectSave);
 addButton("Back up this browser",firstUpload);
 addButton("Restore cloud save",restore);
 if(localGet("vpq-cloud-recovery-"+userId))addButton("Undo last restore",()=>{
   if(!confirm("Restore the prior on-browser progress saved before your last cloud restore? Automatic cloud backup will pause to avoid overwriting your cloud copy."))return;
   try{
     const saved=JSON.parse(localGet("vpq-cloud-recovery-"+userId));
     if(!validSave(saved))throw Error("Recovery snapshot is not valid.");
     for(const key of KEYS){if(Object.prototype.hasOwnProperty.call(saved.slots,key))localSet(key,JSON.stringify(saved.slots[key]));else localStorage.removeItem(key);}
     localStorage.removeItem("vpq-cloud-opt-in-"+userId);
     location.reload();
   }catch(err){notify("Unable to undo this restore: "+(err.message||""),true);}
 });
 if(optedIn)addButton("Pause auto backup",()=>{optedIn=false;clearTimeout(timer);timer=null;pendingMarker(userId,false);localStorage.removeItem("vpq-cloud-opt-in-"+userId);render();updateIndicator();});
 updateIndicator();
}
async function initializeAutomaticSave(owner){
 if(!client||!owner||checkingInitial||optedIn)return;
 checkingInitial=true;
 try{
   const existing=await fetchRemote(owner);
   if(owner!==userId)return;
   const differentOwner=localGet(OWNER_KEY)&&localGet(OWNER_KEY)!==owner;
   if(existing){
     conflict=true;
     notify("Your account already has an online save. Choose Restore or Back up this browser; neither will be overwritten without permission.",true);
     panel();render();
   }else if(differentOwner){
     notify("This browser has another account's progress. Choose which save to keep.",true);
     panel();render();
   }else{
     optedIn=true;conflict=false;
     localSet("vpq-cloud-opt-in-"+owner,"1");localSet(OWNER_KEY,owner);
     notify("Auto-save enabled. No download needed.");
     queue();render();
   }
 }catch(error){notify("Cloud save check failed. Your browser progress is safe. "+(error.message||""),true);}
 finally{checkingInitial=false;updateIndicator();}
}
function launch(){
 client=window.VPQ_PLAYER_ACCOUNT?.getClient?.()||null;
 userId=window.VPQ_PLAYER_ACCOUNT?.getUser?.()?.id||null;
 conflict=false;lastFingerprint="";
 optedIn=!!userId&&localGet("vpq-cloud-opt-in-"+userId)==="1"&&localGet(OWNER_KEY)===userId;
 remoteRevision=userId?getRevision(userId):null;
 render();updateIndicator();
 if(optedIn)queue();
 else if(userId)initializeAutomaticSave(userId);
}
function makeButton(){
 const target=$("saveBtn")||$("vpqAccountBtn")||document.querySelector("header nav")||document.querySelector("header .hud");
 if(!target||$("vpqCloudButton"))return;
 const b=document.createElement("button");
 b.type="button";b.id="vpqCloudButton";b.className="mini";b.textContent="☁️ Save status";
 b.onclick=()=>{if($("vpqCloudSavePanel"))$("vpqCloudSavePanel").remove();else{panel();launch();}};
 if(target.matches("nav, .hud"))target.appendChild(b);else target.insertAdjacentElement("afterend",b);
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
window.VPQ_CLOUD_SAVE=Object.freeze({open:()=>{panel();launch();},queue,supportedKeys:KEYS.slice(),isPending:()=>!!userId&&(!!timer||inFlight||!!localGet(PENDING_PREFIX+userId)),saveNow:async()=>{if(!optedIn||conflict)return false;clearTimeout(timer);timer=null;await upload();return !conflict&&!localGet(PENDING_PREFIX+userId);}});
})();
