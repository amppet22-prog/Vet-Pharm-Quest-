/* Live game auth bridge for private cloud backups.
 * Uses only the Supabase publishable key, never owner keys or editor permissions.
 * The existing account-test.html is the sign-in / signup UI.
 */
(function(){
"use strict";
const URL="https://loavyberbsmqidvukfrj.supabase.co";
const KEY="sb_publishable_PInLcQclmr_snFfb1O10Sg_3JJQWrvy";
let client=null, user=null;
function publish(){
  window.dispatchEvent(new CustomEvent("vpq-player-auth-change",{detail:{userId:user?.id||null}}));
}
function init(){
  if(!window.supabase?.createClient)return;
  try{
    client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    window.VPQ_PLAYER_ACCOUNT=Object.freeze({getClient:()=>client,getUser:()=>user,open:()=>location.assign("account-test.html"),configured:true});
    client.auth.onAuthStateChange((event,session)=>{
      const id=user?.id||null;
      user=session?.user||null;
      if(id!==(user?.id||null)||event==="INITIAL_SESSION")publish();
    });
    client.auth.getSession().then(({data,error})=>{
      if(error)return;
      if(user?.id!==(data?.session?.user?.id||null)){
        user=data?.session?.user||null;
        publish();
      }
    }).catch(()=>{});
  }catch(error){console.warn("Account cloud bridge not ready",error);}
}
init();
})();
