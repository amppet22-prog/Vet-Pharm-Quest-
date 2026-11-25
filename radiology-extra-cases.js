/* Optional external case intake: no diagnosis or images are inferred from inaccessible links. */
(function(){'use strict';
let ctx=null;
const extraCases=[{
 id:'extra-facebook-1FRpwBeRcL',title:'Extra Case · Facebook radiology example',
 url:'https://www.facebook.com/share/p/1FRpwBeRcL/?mibextid=wwXIfr',
 status:'Source and radiographs awaiting owner review',
 contrast:'Differences cannot yet be verified: source images and clinical explanation unavailable.',
 compare:['Projection and technique compared with standard views','All visible Roentgen signs, including concurrent changes','Normal and abnormal structures in the full study','What makes this case atypical versus common patterns','Differential diagnoses, imaging limitations and follow-up']
}];
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function home(){
 if(!ctx)return;
 ctx.showModal('🩻 Extra Radiology Cases','<p>Supplemental cases outside the core exam lectures. <b>Extra cases do not count as required exam coverage.</b> This entry is pending source/image verification and is not a diagnostic quiz.</p>'+
 extraCases.map((c,i)=>'<article style="border:1px solid #d8deeb;border-radius:12px;padding:13px;margin:10px 0"><b>'+esc(c.title)+'</b><p style="font-size:12px;color:#66758a">'+esc(c.status)+'</p><p><a href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer">Original Facebook post / source</a></p><p>'+esc(c.contrast)+'</p><h3 style="font-size:13px">What to compare after the source is reviewed</h3><ul>'+c.compare.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><small>Owner action: supply accessible screenshots or the original images and post text, verify permissions and diagnosis, then build an image-based comparison.</small></article>').join(''));
}
function init(x){ctx=x}
window.VPQ_RADIOLOGY_EXTRA_CASES=Object.freeze({init,home,items:extraCases});
})();