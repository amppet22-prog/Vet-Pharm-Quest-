/* Entry screen for Vet Pharm Quest.
 * A new tab starts at Account Center. Choosing guest or signing in opens the game.
 * Session-only gate: refreshes and room navigation do not interrupt play.
 * This is a welcome-screen preference, NOT an authorization/security boundary.
 */
(function(){
"use strict";
const KEY="vpq-entry-open-this-tab-v1";
const url=new URL(location.href);
const requestedEntry=url.searchParams.get("vpq_enter")==="1";
let tabOpen=false,storageWorks=false;
try{
  tabOpen=sessionStorage.getItem(KEY)==="1";
  if(requestedEntry){sessionStorage.setItem(KEY,"1");tabOpen=true;}
  storageWorks=true;
}catch(e){}
if(requestedEntry&&storageWorks){
  url.searchParams.delete("vpq_enter");
  try{history.replaceState(history.state,"",url.pathname+url.search+url.hash);}catch(e){}
}
if(tabOpen||requestedEntry)return;
const returnPath=location.pathname+location.search+location.hash;
const destination=new URL("account-test.html",location.href);
destination.searchParams.set("next",returnPath);
location.replace(destination.href);
})();
