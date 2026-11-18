/* Check for new deployed GitHub Pages versions; never auto-reload over a study session.
 * Published public lesson manifests remain shared by all visitors, not per-account.
 */
(function(){
 "use strict";
 if(!/^https?:$/.test(location.protocol))return;
 const KEY="vpq-game-version-notice-dismissed";
 let original=null,checking=false;
 async function signature(){
   // Track the full published repository, not only index.html: lecture and photo manifests change independently.
   const response=await fetch("https://api.github.com/repos/amppet22-prog/Vet-Pharm-Quest-/commits/main",{headers:{"Accept":"application/vnd.github+json"},cache:"no-store"});
   if(!response.ok)throw Error("Version check unavailable");
   const data=await response.json();
   return /^[a-f0-9]{40}$/.test(data.sha||"")?data.sha:null;
 }
 function announce(sig){
   if(document.getElementById("vpqNewVersionNotice"))return;
   const wrap=document.createElement("div");
   wrap.id="vpqNewVersionNotice";
   wrap.style.cssText="position:fixed;left:12px;bottom:12px;z-index:99998;max-width:min(420px,calc(100vw - 24px));background:#fffbea;border:2px solid #d7b85f;border-radius:15px;padding:14px;box-shadow:0 8px 26px #21395840;font:13px/1.5 Arial,sans-serif;color:#38495d";
   const title=document.createElement("strong");title.textContent="🐾 New Vet Pharm Quest update available!";
   const p=document.createElement("p");p.textContent="New educational content or game changes have been committed. Once GitHub Pages finishes deploying, refresh to get the updates. Your browser progress remains saved locally; guest saves do not transfer between devices.";
   const refresh=document.createElement("button");refresh.type="button";refresh.textContent="Save & Refresh";refresh.style.marginRight="8px";
   const later=document.createElement("button");later.type="button";later.textContent="Later";
   refresh.onclick=()=>{
     // Save is synchronous in the main clinic and maintained by its pagehide listener.
     window.dispatchEvent(new Event("vpq-game-update-refresh"));
     location.reload();
   };
   later.onclick=()=>{try{sessionStorage.setItem(KEY,sig||"dismissed")}catch{}wrap.remove();};
   wrap.append(title,p,refresh,later);document.body.append(wrap);
 }
 async function check(){
   if(checking||document.visibilityState==="hidden")return;checking=true;
   try{
     const version=await signature();
     if(version){
       if(original===null)original=version;
       else if(version!==original && sessionStorage.getItem(KEY)!==version)announce(version);
     }
   }catch{/* Offline players continue uninterrupted. */}
   finally{checking=false;}
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",check,{once:true});else check();
 setInterval(check,300000);
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")check();});
})();
