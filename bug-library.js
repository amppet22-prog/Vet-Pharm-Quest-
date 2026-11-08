/* Vet Pharm Quest Bug Battles: live derived view of the ONE authoritative One Health library.
  Add a disease with gameTags:["bug-battle","bacteria"] and q.diseaseId, or legacy q ID
  "oh24-<diseaseId>-...", and it becomes available without copying the question bank. */
(function(){
 'use strict';
 const source=window.VPQ_OH||{diseases:[],study:[]};
 const eligible=(source.diseases||[]).filter(d=>Array.isArray(d.gameTags)&&d.gameTags.includes('bug-battle')&&d.gameTags.includes('bacteria'));
 const idSet=new Set(eligible.map(d=>d.id));
 const questions=(source.study||[]).filter(q=>{
   const diseaseId=q.diseaseId||(String(q.id||'').match(/^oh24-(oh\d+)-/)||[])[1];
   return idSet.has(diseaseId)&&Array.isArray(q.options)&&q.options.length>=2&&Number.isInteger(q.answer);
 }).map(q=>{
   const organismId=q.diseaseId||(String(q.id).match(/^oh24-(oh\d+)-/)||[])[1];
   return {id:'onehealth:'+q.id,l:'onehealth',k:q.topic||'One Health bacteriology',q:q.q,a:q.options,c:q.answer,why:q.why,organismId,source:q.source||'One Health course material',lecture:'One Health · Bacteriology'};
 });
 window.VPQ_BUG_BANK=Object.freeze({version:2,organisms:eligible.map(d=>({id:d.id,name:d.name,agent:d.agent,source:d.source})),questions});
})();
