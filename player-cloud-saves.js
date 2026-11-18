/* Per-account cloud backup for the main clinic progress.
 * Uses Supabase RLS. No content edits, owner tokens or private credentials uploaded.
 * Explicit user choice before first upload or restore. Guest saves remain local.
 */
(function(){
 "use strict";
 const LOCAL_KEY="vpq-v2-clinic-state", BACKUP_PREFIX="vpq-cloud-pre-restore-", LOCAL_OWNER="vpq-cloud-local-owner";
 const $=id=>document.getElementById(id);
 let activeUser=null, enabledForUser=false, syncTimer=null, inFlight=false, pending=false, latestSaved=null;
 let client=null;
 const validState = value => value && typeof value==="object" &&
   Number.isFinite(value.xp) && Number.isFinite(value.coins) &&
   Array.isArray(value.completed) && Array.isArray(value.upgrades);
 const safeLocal=()=>{try{const v=JSON.parse(localStorage.getItem(LOCAL_KEY)||"null");return validState(v)?v:null}catch{return null}};
 const status=(message,kind="info")=>{
   const el=$("vpqCloudSaveStatus"); if(!el)return;
   el.textContent=message;el.dataset.kind=kind;
 };
 const makeButton=(id,txt)=>{const b=document.createElement("button");b.type="button";b.id=id;b.textContent=txt;return b;};
 function panel(){
   const existing=$("vpqCloudSavePanel");
   if(existing) return existing;
   const container=document.createElement("section");
   container.id="vpqCloudSavePanel";
   container.style.cssText="position:fixed;right:12px;bottom:12px;z-index:1000;width:min(340px,calc(100vw - 24px));background:white;padding:14px;border:2px solid #b9c9e8;border-radius:16px;box-shadow:0 8px 30px #263f5c33;color:#263f5c;font-size:12px";
   container.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><strong>☁️ Cloud Save</strong><button type="button" id="vpqCloudHide" aria-label="Hide cloud save panel">✕</button></div><p id="vpqCloudSaveStatus" role="status" aria-live="polite"></p><div id="vpqCloudSaveButtons" style="display:flex;flex-wrap:wrap;gap:6px"></div><p style="font-size:11px;color:#61728a;margin-bottom:0">The original browser save is kept. Owner edits and publishing credentials are never included in cloud saves.</p>';
   document.body.appendChild(container);
   $("vpqCloudHide").onclick=()=>container.remove();
   return container;
 }
 const button=(label,fn)=>{const b=makeButton("vpq-cloud-"+label.replace(/\W+/g,"-"),label);b.onclick=fn;$("vpqCloudSaveButtons").appendChild(b)};
 async function remote(){
   const {data,error}=await client.from("player_saves").select("save_data,updated_at").eq("user_id",activeUser).maybeSingle();
   if(error)throw error;
   return data;
 }
 async function put(){
   if(!client||!activeUser||!enabledForUser){return;}
   if(inFlight){pending=true;return;}
   const owner=activeUser, snapshot=safeLocal();
   if(!snapshot)return;
   inFlight=true;
   try{
     const {error}=await client.from("player_saves").upsert({user_id:owner,save_data:snapshot},{onConflict:"user_id"});
     if(error)throw error;
     latestSaved=new Date().toISOString();
     status("Cloud backup saved • "+new Date().toLocaleTimeString(),"ok");
   }catch(err){status("Cloud backup failed; local save is preserved. "+(err.message||""),"error");}
   finally{
     inFlight=false;
     if(pending){pending=false;if(activeUser===owner)queue();}
   }
 }
 function queue(){
   if(!enabledForUser)return;
   clearTimeout(syncTimer);syncTimer=setTimeout(put,2500);
 }
 function cloudSnapshot(){
   const local=safeLocal();if(!local){status("No valid local clinic progress to upload.","error");return null;}return local;
 }
 async function chooseUpload(){
   if(!activeUser)return;
   if(!cloudSnapshot())return;
   if(!confirm("Back up your CURRENT browser's clinic progress to your account? This replaces the existing cloud copy, if any. Download a full save first if you are unsure."))return;
   enabledForUser=true;localStorage.setItem("vpq-cloud-opt-in-"+activeUser,"1");
   localStorage.setItem(LOCAL_OWNER,activeUser);
   status("Uploading clinic progress…");await put();render();
 }
 async function chooseRestore(){
   if(!activeUser)return;
   try{
     status("Checking cloud save…");
     const data=await remote();
     if(!validState(data?.save_data)){status("No valid cloud save found. Local progress is unchanged.","error");return;}
     if(!confirm("Restore cloud clinic progress onto this browser? Your current local clinic progress will be backed up first. This reloads the game. Use the Save Center to export a full save before restoring."))return;
     const prior=localStorage.getItem(LOCAL_KEY);
     if(prior!==null)localStorage.setItem(BACKUP_PREFIX+activeUser+"-"+Date.now(),prior);
     localStorage.setItem(LOCAL_KEY,JSON.stringify(data.save_data));
     localStorage.setItem(LOCAL_OWNER,activeUser);
     enabledForUser=true;localStorage.setItem("vpq-cloud-opt-in-"+activeUser,"1");
     window.location.reload();
   }catch(err){status("Cloud restore failed; local progress unchanged. "+(err.message||""),"error");}
 }
 function render(){
   const p=panel(),dest=$("vpqCloudSaveButtons");dest.replaceChildren();
   if(!client){status("Cloud saving is not configured yet; browser saving still works.");return;}
   if(!activeUser){status("Sign in to back up your clinic progress across devices. Guests keep browser-local saves.");return;}
   if(enabledForUser)status("Automatic cloud backup enabled for this account. Browser-local saving remains active.");
   else status("Choose whether to keep this browser's progress or restore an existing cloud save. Nothing is overwritten automatically.");
   button("Back up this browser",chooseUpload);
   button("Restore cloud save",chooseRestore);
   if(enabledForUser)button("Pause auto backup",()=>{
     enabledForUser=false;clearTimeout(syncTimer);
     localStorage.removeItem("vpq-cloud-opt-in-"+activeUser);render();
   });
 }
 function launch(){
   client=window.VPQ_PLAYER_ACCOUNT?.getClient?.()||null;
   const user=window.VPQ_PLAYER_ACCOUNT?.getUser?.()||null;
   activeUser=user?.id||null;
   enabledForUser=!!activeUser&&localStorage.getItem("vpq-cloud-opt-in-"+activeUser)==="1"&&localStorage.getItem(LOCAL_OWNER)===activeUser;
   render();
 }
 window.addEventListener("vpq-player-auth-change",()=>{clearTimeout(syncTimer);inFlight=false;pending=false;launch();});
 window.addEventListener("vpq-clinic-progress-saved",queue);
 document.addEventListener("DOMContentLoaded",()=>{
   const target=$("saveBtn");
   if(target){
     const cloudBtn=makeButton("vpqCloudButton","☁️ Cloud Save");
     cloudBtn.className="mini";
     cloudBtn.onclick=()=>{const p=$("vpqCloudSavePanel");if(p)p.remove();else launch();};
     target.insertAdjacentElement("afterend",cloudBtn);
   }
   client=window.VPQ_PLAYER_ACCOUNT?.getClient?.()||null;
   // Do not enable autosync merely because a prior session exists: show a choice first.
   window.VPQ_PLAYER_ACCOUNT?.getClient?.()?.auth.getSession().then(()=>launch()).catch(()=>launch());
 });
 window.addEventListener("pagehide",()=>{if(enabledForUser){clearTimeout(syncTimer);/* browser-local persists synchronously; async fetch cannot be guaranteed on unload */}});
 window.VPQ_CLOUD_SAVE=Object.freeze({open:launch,queue});
})();
