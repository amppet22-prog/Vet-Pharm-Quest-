/* Vet Pharm Quest site-wide entry to the registered player account system.
 * This does not modify game saves, grant editing permission, or require sign-in.
 */
(function(){
"use strict";
const BASE="account-test.html";
const PROJECT="https://loavyberbsmqidvukfrj.supabase.co";
const KEY="sb_publishable_PInLcQclmr_snFfb1O10Sg_3JJQWrvy";
const hud=document.querySelector(".hud");
if(!hud||document.getElementById("vpqPlayerAccountTop"))return;
const top=document.createElement("a");
top.id="vpqPlayerAccountTop";
top.href=BASE;
top.textContent="👤 Sign In / Create Account";
top.setAttribute("aria-label","Sign in or create your Vet Pharm Quest account");
top.style.cssText="display:inline-flex;align-items:center;justify-content:center;border:2px solid #c5b4e7;border-radius:12px;background:#f4eaff;padding:8px 12px;color:#634589;font-size:12px;font-weight:900;text-decoration:none;min-height:36px";
hud.appendChild(top);
// Room refresh restores the game viewport below the header, so keep account access visible.
const dock=document.createElement("a");
dock.id="vpqPlayerAccountDock";dock.href=BASE;dock.textContent="👤 Account";
dock.setAttribute("aria-label","Open player account registration or sign in");
dock.style.cssText="position:fixed;right:12px;top:12px;z-index:12;display:inline-flex;align-items:center;gap:4px;border:2px solid #bba9df;border-radius:18px;background:#fff9ffeb;box-shadow:0 3px 14px #35406a26;padding:7px 11px;font-size:12px;font-weight:900;color:#64488c;text-decoration:none";
document.body.appendChild(dock);
const welcome=document.querySelector(".vpq-welcome-copy");
if(welcome){
 const callout=document.createElement("div");
 callout.id="vpqPlayerAccountWelcome";
 callout.style.cssText="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:12px 0 0;padding:10px 12px;border:2px solid #ddd1f2;background:#fff9ffdd;border-radius:13px;font-size:12px;color:#5c4e7d;max-width:650px";
 const desc=document.createElement("span");
 desc.textContent="🐾 New here? Create a free account to access your player profile. Guest play still works.";
 desc.style.flex="1 1 250px";
 const link=document.createElement("a");
 link.href=BASE;link.textContent="Create account / Sign in";
 link.style.cssText="padding:8px 11px;background:#7158af;color:white;border-radius:10px;font-weight:900;text-decoration:none";
 callout.append(desc,link);
 welcome.append(callout);
}
function showCurrentUser(email){
 const label=email?.split("@")[0]?.slice(0,20);
 if(label){top.textContent="👤 "+label+" · Account";top.title="Signed in as "+email;dock.title="Signed in as "+email;dock.textContent="👤 "+label;}
 else{top.textContent="👤 Sign In / Create Account";top.title="Sign in or create account";dock.title="Sign in or create account";dock.textContent="👤 Sign In";}
}
function refreshAccountLabel(){
 showCurrentUser(window.VPQ_PLAYER_ACCOUNT?.getUser?.()?.email||null);
}
// The shared cloud auth bridge owns the one Supabase client for this page.
window.addEventListener("vpq-player-auth-change",refreshAccountLabel);
refreshAccountLabel();
})();
