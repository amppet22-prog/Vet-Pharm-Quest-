/* Accessible reception patient queue and unobtrusive interaction. */
(function(){
'use strict';
const scene=document.getElementById('scene');
if(!scene)return;
scene.addEventListener('click',function(e){
 const queue=e.target.closest('#vpqReceptionQueueButton');
 if(!queue)return;
 e.preventDefault();e.stopPropagation();
 const go=document.getElementById('goExam');
 if(go)go.click();
});
scene.addEventListener('keydown',function(e){
 if((e.key==='Enter'||e.key===' ')&&e.target.closest('#vpqReceptionQueueButton')){
  e.preventDefault();
  document.getElementById('vpqReceptionQueueButton').click();
 }
});
})();
