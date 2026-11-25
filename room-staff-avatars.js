/* VPQ optional room staff v2. Multiple stationary characters, compatible with old saved strings. */
(function(){
'use strict';
const rooms=['reception','exam','treatment','study','pharmacy','clinpath','imaging','necropsy','surgery','skills','isolation','hallway','catcorner','yardview'];
const labels={reception:'Reception',exam:'Exam Room',treatment:'Treatment Ward',study:'Study Lounge',pharmacy:'Pharmacy',clinpath:'Advanced Lab',imaging:'Imaging',necropsy:'Necropsy',surgery:'Surgery',skills:'Skills',isolation:'One Health',hallway:'Hallway',catcorner:'Cat Corner',yardview:'Outdoor Yard'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fileURL=p=>String(p||'').split('/').map(encodeURIComponent).join('/');
const all=()=>[{id:'roster-28',path:'assets/alexandria-standing-v3.webp',label:'Alexandria · Original'},...(window.VPQ_UPLOADED_AVATARS||[]).map((a,i)=>({id:a.id,path:a.path,label:a.collection==='Alexandria'?(a.label||'Alexandria · Personal'):'Vet '+String(i+1).padStart(3,'0')+' · '+(a.color||'Scrubs')}))];
function saved(){if(!state.vpqRoomStaff||typeof state.vpqRoomStaff!=='object'||Array.isArray(state.vpqRoomStaff))state.vpqRoomStaff={};return state.vpqRoomStaff}
function get(room){const value=saved()[room],old=typeof value==='string'?[value]:Array.isArray(value)?value:[],valid=new Set(all().map(a=>a.id));return Array.from({length:3},(_,i)=>valid.has(old[i])?old[i]:'')}
function put(room,values){const seen=new Set(),v=values.slice(0,3).map(id=>{if(!id||seen.has(id)||!all().some(a=>a.id===id))return '';seen.add(id);return id});if(v.some(Boolean))saved()[room]=v;else delete saved()[room];persist()}
function room(){return document.getElementById('stage')?.dataset.room||'reception'}
function draw(){
 const stage=document.getElementById('stage');if(!stage)return;
 let layer=stage.querySelector('#vpqRoomStaffLayer');const ids=get(room());
 if(!ids.some(Boolean)){layer?.remove();return}
 if(!layer){layer=document.createElement('div');layer.id='vpqRoomStaffLayer';stage.append(layer)}
 const choices=new Map(all().map(a=>[a.id,a])),positions=[17,77,88];
 layer.replaceChildren();
 ids.forEach((id,i)=>{const a=choices.get(id);if(!a)return;const sprite=document.createElement('div');sprite.className='vpq-room-staff-sprite';sprite.style.left=positions[i]+'%';sprite.style.width=(i===1?76:66)+'px';sprite.style.height=(i===1?114:101)+'px';sprite.style.bottom=(i===1?16:18)+'%';
 const img=document.createElement('img');img.src=fileURL(a.path);img.alt=a.label;img.loading='lazy';img.draggable=false;img.onerror=()=>{sprite.hidden=true};
 const caption=document.createElement('span');caption.textContent='Staff '+(i+1);
 sprite.append(img,caption);layer.append(sprite);
 });
}
function controls(){
 const nav=document.getElementById('roomnav');if(nav&&!nav.querySelector('#vpqRoomStaffButton')){const button=document.createElement('button');button.id='vpqRoomStaffButton';button.type='button';button.textContent='👩‍⚕️ Add Room Staff';nav.append(button)}
 const frame=document.querySelector('.stageframe');if(frame&&!frame.querySelector('#vpqStaffRoomShortcut')){const shortcut=document.createElement('button');shortcut.id='vpqStaffRoomShortcut';shortcut.type='button';shortcut.textContent='👩‍⚕️ Staff +';shortcut.title='Add or change staff in this room';frame.append(shortcut)}
}
function open(){
 const selected=room(),list=get(selected);
 const opts=(id)=>'<option value="">No character</option>'+all().map(a=>'<option value="'+esc(a.id)+'"'+(a.id===id?' selected':'')+'>'+esc(a.label)+'</option>').join('');
 const html='<p>Place up to <b>three extra stationary veterinarian characters</b> in each room. Your walking avatar and companion remain untouched.</p>'+
 '<label for="vpqRoomStaffRoom"><b>Choose room</b></label><select id="vpqRoomStaffRoom" style="width:100%;padding:8px;margin:6px 0 12px">'+rooms.filter(r=>typeof ROOMS==='undefined'||ROOMS[r]).map(r=>'<option value="'+r+'"'+(r===selected?' selected':'')+'>'+esc(labels[r]||r)+'</option>').join('')+'</select>'+
 '<div class="vpq-staff-slots">'+[0,1,2].map(i=>'<label><b>Staff '+(i+1)+'</b> · '+['Left','Middle','Right'][i]+'<select data-vpq-staff-slot="'+i+'">'+opts(list[i])+'</select></label>').join('')+'</div>'+
 '<div id="vpqStaffPreview" class="vpq-staff-preview"></div>'+
 '<div class="buttonrow"><button type="button" data-vpq-staff-save>Save room staff</button><button type="button" data-vpq-staff-clear>Remove all staff from this room</button></div>'+
 '<p class="tiny">Staff are decorative and saved with your profile. They do not block equipment or change movement.</p>';
 showModal('👩‍⚕️ Room Staff · Add Characters',html);preview();
}
function preview(){
 const roomId=document.getElementById('vpqRoomStaffRoom')?.value||'reception',stored=get(roomId),inputs=[...document.querySelectorAll('[data-vpq-staff-slot]')];
 for(const el of inputs)if(el.dataset.room!==roomId){el.value=stored[Number(el.dataset.vpqStaffSlot)];el.dataset.room=roomId}
 const view=document.getElementById('vpqStaffPreview');if(!view)return;view.replaceChildren();
 inputs.forEach((el,i)=>{const a=all().find(x=>x.id===el.value),tile=document.createElement('div');tile.className='vpq-staff-preview-card';if(a){const img=document.createElement('img');img.src=fileURL(a.path);img.alt=a.label;tile.append(img)}else{const none=document.createElement('span');none.textContent='Empty';tile.append(none)}const label=document.createElement('small');label.textContent=['Left','Middle','Right'][i];tile.append(label);view.append(tile)})
}
document.addEventListener('click',e=>{
 if(e.target.closest?.('#vpqRoomStaffButton,#vpqStaffRoomShortcut')){e.preventDefault();open();return}
 const btn=e.target.closest?.('[data-vpq-staff-save],[data-vpq-staff-clear]');if(!btn)return;e.preventDefault();
 const r=document.getElementById('vpqRoomStaffRoom')?.value;if(!rooms.includes(r))return;
 put(r,btn.hasAttribute('data-vpq-staff-clear')?['','','']:[...document.querySelectorAll('[data-vpq-staff-slot]')].map(x=>x.value));draw();preview();
 const save=document.querySelector('[data-vpq-staff-save]');if(save)save.textContent='✓ Staff saved for '+(labels[r]||r);
});
document.addEventListener('change',e=>{if(e.target?.id==='vpqRoomStaffRoom'||e.target?.matches?.('[data-vpq-staff-slot]')){preview();const b=document.querySelector('[data-vpq-staff-save]');if(b)b.textContent='Save room staff'}});
const css=document.createElement('style');css.textContent=
'.stageframe{position:relative}#vpqStaffRoomShortcut{position:absolute;top:9px;right:10px;z-index:12;background:#fff4ffec;border:2px solid #b8a0d2;border-radius:16px;padding:8px 11px;color:#493b73;font-weight:900;box-shadow:0 2px 9px #27364c33}'+
'#vpqRoomStaffButton{background:#f3eafb;border-color:#a69ac8;color:#493b73}'+
'#vpqRoomStaffLayer{position:absolute;inset:0;z-index:5;pointer-events:none}.vpq-room-staff-sprite{position:absolute;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;pointer-events:none}.vpq-room-staff-sprite img{height:100%;width:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(1px 3px 2px #3645574d)}.vpq-room-staff-sprite span{position:absolute;bottom:-13px;background:#f6f0ffed;border:1px solid #bcb0d4;border-radius:8px;padding:1px 5px;color:#524575;font-weight:800;font-size:9px;white-space:nowrap}'+
'.vpq-staff-slots{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.vpq-staff-slots label{background:#f9f5ff;border:1px solid #ddd0e8;padding:9px;border-radius:9px}.vpq-staff-slots select{display:block;width:100%;padding:8px;margin-top:5px}.vpq-staff-preview{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:12px 0}.vpq-staff-preview-card{width:95px;height:125px;border:1px solid #e0d6ee;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fcfaff}.vpq-staff-preview-card img{width:83px;height:102px;object-fit:contain}.vpq-staff-preview-card span{color:#768093;font-size:12px}.vpq-staff-preview-card small{font-size:10px}'+
'@media(max-width:600px){#vpqStaffRoomShortcut{top:6px;right:6px;font-size:12px;padding:6px 8px}.vpq-room-staff-sprite{max-width:11vw}}';
document.head.append(css);
const nav=document.getElementById('roomnav'),stage=document.getElementById('stage');if(nav)new MutationObserver(controls).observe(nav,{childList:true});if(stage)new MutationObserver(draw).observe(stage,{attributes:true,attributeFilter:['data-room']});
controls();draw();
window.VPQ_ROOM_STAFF={open,redraw:draw,assignments:get};
})();