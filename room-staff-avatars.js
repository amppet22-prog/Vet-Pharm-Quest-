/* VPQ Room Staff v1 · optional, stationary avatars by room.
 * Does not change the player's walking avatar or companion.
 * Uses existing uploaded transparent character manifest and saved game state.
 */
(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const rooms=['reception','exam','treatment','study','pharmacy','clinpath','imaging','necropsy','surgery','skills','isolation','hallway','catcorner','yardview'];
 const names={reception:'Reception',exam:'Exam Room',treatment:'Treatment Ward',study:'Study Lounge',pharmacy:'Pharmacy',clinpath:'Advanced Lab',imaging:'Imaging',necropsy:'Necropsy',surgery:'Surgery',skills:'Skills',isolation:'One Health',hallway:'Hallway',catcorner:'Cat Corner',yardview:'Outdoor Yard'};
 const uploaded=()=>Array.isArray(window.VPQ_UPLOADED_AVATARS)?window.VPQ_UPLOADED_AVATARS:[];
 const all=()=>[{id:'roster-28',path:'assets/alexandria-standing-v3.webp',label:'Alexandria · Original'},...uploaded().map((a,i)=>({id:a.id,path:a.path,label:a.collection==='Alexandria'?(a.label||'Alexandria · Personal'):'Vet '+String(i+1).padStart(3,'0')+' · '+(a.color||'Scrubs')}))];
 function assignments(){if(!state.vpqRoomStaff||typeof state.vpqRoomStaff!=='object'||Array.isArray(state.vpqRoomStaff))state.vpqRoomStaff={};return state.vpqRoomStaff;}
 const pathURL=p=>String(p||'').split('/').map(encodeURIComponent).join('/');
 function draw(){
  const stage=document.getElementById('stage');if(!stage)return;
  const room=stage.dataset.room||'reception';
  let host=stage.querySelector('#vpqRoomStaffSprite');
  const avatar=all().find(a=>a.id===assignments()[room]);
  if(!avatar){if(host)host.remove();return}
  if(!host){host=document.createElement('div');host.id='vpqRoomStaffSprite';stage.appendChild(host)}
  const x=room==='reception'?83:room==='isolation'?84:room==='necropsy'?85:82;
  host.style.left=x+'%';
  host.setAttribute('aria-label','Room staff: '+avatar.label);
  host.innerHTML='<img src="'+esc(pathURL(avatar.path))+'" alt="'+esc(avatar.label)+'" draggable="false"><span>Staff</span>';
 }
 function button(){
  const nav=document.getElementById('roomnav');if(!nav||nav.querySelector('#vpqRoomStaffButton'))return;
  const btn=document.createElement('button');btn.type='button';btn.id='vpqRoomStaffButton';btn.textContent='👩‍⚕️ Room Staff';btn.title='Choose a different stationary veterinarian for each room';
  nav.appendChild(btn);
 }
 function open(){
  const room=document.getElementById('stage')?.dataset?.room||'reception';
  const selected=assignments()[room]||'';
  const opts=['<option value="">No extra staff member</option>',...all().map(a=>'<option value="'+esc(a.id)+'"'+(a.id===selected?' selected':'')+'>'+esc(a.label)+'</option>')].join('');
  const html='<p>Assign one stationary veterinarian to each hospital room. Your walking avatar and companion stay exactly as selected.</p>'+
   '<label for="vpqRoomStaffRoom">Hospital room</label><select id="vpqRoomStaffRoom" style="display:block;width:100%;max-width:420px;margin:6px 0 12px">'+rooms.filter(r=>typeof ROOMS==='undefined'||ROOMS[r]).map(r=>'<option value="'+esc(r)+'"'+(r===room?' selected':'')+'>'+esc(names[r]||r)+'</option>').join('')+'</select>'+
   '<label for="vpqRoomStaffAvatar">Stationary staff avatar</label><select id="vpqRoomStaffAvatar" style="display:block;width:100%;max-width:420px;margin:6px 0 10px">'+opts+'</select>'+
   '<div id="vpqRoomStaffPreview" style="min-height:110px;text-align:center"></div>'+
   '<div class="buttonrow"><button type="button" data-vpq-room-staff-save="1">Save room staff</button><button type="button" data-vpq-room-staff-clear="1">Leave room empty</button></div>'+
   '<p class="tiny">Assignments are optional, saved with your game profile, and do not affect room interactions or your character.</p>';
  showModal('👩‍⚕️ Room Staff · Customize Each Room',html);
  preview();
 }
 function preview(){
  const room=document.getElementById('vpqRoomStaffRoom')?.value;
  const select=document.getElementById('vpqRoomStaffAvatar');
  const p=document.getElementById('vpqRoomStaffPreview');
  if(!room||!select||!p)return;
  const current=assignments()[room]||'';
  if(select.dataset.forRoom!==room){select.value=current;select.dataset.forRoom=room}
  const av=all().find(a=>a.id===select.value);
  p.innerHTML=av?'<img src="'+esc(pathURL(av.path))+'" alt="'+esc(av.label)+'" style="height:116px;width:116px;object-fit:contain;object-position:center bottom" draggable="false">':'<span class="tiny">No additional avatar in this room</span>';
 }
 document.addEventListener('click',e=>{
  if(e.target.closest?.('#vpqRoomStaffButton')){e.preventDefault();open();return}
  const save=e.target.closest?.('[data-vpq-room-staff-save],[data-vpq-room-staff-clear]');
  if(!save)return;
  e.preventDefault();
  const room=document.getElementById('vpqRoomStaffRoom')?.value;
  if(!rooms.includes(room))return;
  const choice=save.hasAttribute('data-vpq-room-staff-clear')?'':document.getElementById('vpqRoomStaffAvatar')?.value||'';
  if(choice&&!all().some(a=>a.id===choice))return;
  if(choice)assignments()[room]=choice;else delete assignments()[room];
  persist();draw();preview();
  const btn=save.closest('#modalBody')?.querySelector('[data-vpq-room-staff-save]');
  if(btn){btn.textContent='✓ Saved';setTimeout(()=>{if(btn.isConnected)btn.textContent='Save room staff'},1400)}
 });
 document.addEventListener('change',e=>{if(e.target?.id==='vpqRoomStaffRoom'||e.target?.id==='vpqRoomStaffAvatar')preview()});
 const style=document.createElement('style');
 style.textContent='#vpqRoomStaffSprite{position:absolute;bottom:17%;width:78px;height:116px;transform:translateX(-50%);z-index:5;pointer-events:none;display:flex;align-items:center;flex-direction:column;justify-content:flex-end}#vpqRoomStaffSprite img{width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(1px 3px 2px #3645574d)}#vpqRoomStaffSprite span{position:absolute;bottom:-13px;background:#f6f0ffed;border:1px solid #bcb0d4;border-radius:8px;padding:1px 5px;color:#524575;font-weight:800;font-size:9px;white-space:nowrap}#vpqRoomStaffButton{border-color:#a69ac8;background:#f3eafb;color:#493b73}';
 document.head.appendChild(style);
 // The scene and navigation are re-rendered on every room change.
 // Observe only their replacements; never mutate the game movement layer.
 const nav=document.getElementById('roomnav'),stage=document.getElementById('stage');
 if(nav)new MutationObserver(button).observe(nav,{childList:true});
 if(stage)new MutationObserver(draw).observe(stage,{attributes:true,attributeFilter:['data-room']});
 button();draw();
 window.VPQ_ROOM_STAFF={open,redraw:draw};
})();
