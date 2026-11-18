/* Safe lightweight formatting for owner-edited pathology teaching text. */
window.VPQ_PATH_RICH_TEXT=(function(){
'use strict';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(value){
 let s=esc(value);
 // The escape step always runs before these limited formatting replacements.
 s=s.replace(/\*\*([^\n*][^\n]*?)\*\*/g,'<strong>$1</strong>')
    .replace(/(^|[^*])\*([^\n*]+)\*/g,'$1<em>$2</em>')
    .replace(/(^|\n)[ \t]*[-•][ \t]+([^\n]+)/g,'$1<span style="display:block;padding-left:12px">• $2</span>')
    .replace(/\n/g,'<br>');
 return s;
}
function toolbar(){return '<div class="vpq-format-tools" style="display:flex;gap:5px;flex-wrap:wrap;margin:4px 0 5px"><button type="button" data-vpq-format="bold" style="font-weight:900;font-size:11px;padding:4px 9px" title="Bold selected text">B</button><button type="button" data-vpq-format="italic" style="font-style:italic;font-size:11px;padding:4px 9px" title="Italic selected text">I</button><button type="button" data-vpq-format="bullet" style="font-size:11px;padding:4px 9px" title="Add bullet">• List</button><button type="button" data-vpq-format="preview" style="font-size:11px;padding:4px 9px">Preview</button></div>';}
function install(root){
 if(!root)return;
 root.querySelectorAll('textarea').forEach(t=>{
  if(t.dataset.vpqToolbar||t.id==='npOwnerCaption'||t.hasAttribute('data-np-file-caption'))return;
  t.dataset.vpqToolbar='1';
  t.insertAdjacentHTML('beforebegin',toolbar());
 });
}
function handle(event,root){
 const b=event.target.closest('[data-vpq-format]');if(!b||!root?.contains(b))return false;
 event.preventDefault();event.stopImmediatePropagation();
 const wrap=b.closest('.vpq-format-tools'),area=wrap?.nextElementSibling;
 if(!area||area.tagName!=='TEXTAREA')return true;
 const action=b.dataset.vpqFormat;
 if(action==='preview'){
  let prev=wrap.nextElementSibling.nextElementSibling;
  if(prev?.classList?.contains('vpq-rich-preview')){prev.remove();return true;}
  area.insertAdjacentHTML('afterend','<div class="vpq-rich-preview" style="border:1px solid #bcd2e7;background:#f6faff;border-radius:8px;padding:9px;margin:5px 0;font-size:13px"><b style="display:block;margin-bottom:5px">Preview</b>'+render(area.value)+'</div>');
  return true;
 }
 const start=area.selectionStart,end=area.selectionEnd,v=area.value,selected=v.slice(start,end);
 const before=v.slice(0,start),after=v.slice(end);
 let insert='';
 if(action==='bold')insert='**'+(selected||'important term')+'**';
 else if(action==='italic')insert='*'+(selected||'term')+'*';
 else insert='- '+(selected||'list item');
 area.value=before+insert+after;area.focus();area.setSelectionRange(start,start+insert.length);
 area.dispatchEvent(new Event('input',{bubbles:true}));
 const preview=area.nextElementSibling;if(preview?.classList?.contains('vpq-rich-preview'))preview.innerHTML='<b style="display:block;margin-bottom:5px">Preview</b>'+render(area.value);
 return true;
}
return Object.freeze({render,install,handle});
})();
