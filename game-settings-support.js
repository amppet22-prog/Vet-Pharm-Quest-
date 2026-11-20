/* Student-built Vet Pharm Quest: settings, attribution and feedback. */
(function(){
"use strict";
if(document.getElementById("vpqSupportOpen"))return;
var hud=document.querySelector(".hud");
if(!hud)return;
var st=document.createElement("style");
st.textContent=".vpq-support-dialog{width:min(94vw,720px);max-height:86vh;overflow:auto;border:2px solid #b8abd5;border-radius:17px;background:#fffdfd;color:#364a68;padding:0;box-shadow:0 18px 60px #1e275b70}.vpq-support-dialog::backdrop{background:#20305591}.vpq-support-head{position:sticky;top:0;background:linear-gradient(100deg,#f2e4fc,#e8f5fa);display:flex;align-items:center;justify-content:space-between;padding:10px 15px;z-index:2}.vpq-support-head h2{font-size:17px;margin:0}.vpq-support-tabs{display:flex;flex-wrap:wrap;gap:5px;padding:10px 14px 0}.vpq-support-tabs button{font-size:12px;padding:7px 9px}.vpq-support-tabs button[aria-pressed=true]{background:#6254aa;color:white}.vpq-support-body{padding:10px 16px 16px}.vpq-support-body p,.vpq-support-body li{font-size:13px;line-height:1.5}.vpq-support-body h3{font-size:16px}.vpq-support-panel[hidden]{display:none!important}.vpq-support-panel label{display:block;font-size:12px;font-weight:800;margin-top:10px;margin-bottom:4px}.vpq-support-panel textarea,.vpq-support-panel input,.vpq-support-panel select{width:100%;max-width:100%;padding:9px;border:1px solid #bdc9dd;border-radius:9px;background:#fff;color:#2f4261}.vpq-support-panel textarea{min-height:100px;resize:vertical}.vpq-support-actions{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}.vpq-support-actions button,.vpq-support-actions a{font-size:12px;padding:8px 10px;border-radius:9px;text-decoration:none;background:#f2ecfa;color:#574a9c;border:1px solid #c7b5e1}.vpq-support-note{background:#f8f6fd;border:1px solid #e1d9f1;padding:10px;border-radius:10px}.vpq-support-status{font-size:12px;color:#55719a;min-height:20px}";
st.textContent+=".vpq-support-dialog{font-size:15px;line-height:1.6}.vpq-support-head h2{font-size:19px;font-weight:850;color:#264674}.vpq-support-body p,.vpq-support-body li{font-size:15px;line-height:1.6;color:#293f5e}.vpq-support-body h3{font-size:18px;font-weight:850;color:#31547d}.vpq-support-panel label{font-size:14px;color:#304e73}.vpq-support-panel input,.vpq-support-panel textarea,.vpq-support-panel select{font-size:15px;line-height:1.5}.vpq-support-tabs button{font-size:13px;font-weight:800}.vpq-support-note{border-left:4px solid #9a87c5}.vpq-support-actions button,.vpq-support-actions a{font-size:13px;font-weight:800}";
document.head.appendChild(st);
var btn=document.createElement("button");
btn.type="button";btn.id="vpqSupportOpen";btn.className="mini";btn.textContent="⚙️ Settings & Support";
var help=document.getElementById("helpBtn");
if(help)help.insertAdjacentElement("afterend",btn);else hud.appendChild(btn);
var d=document.createElement("dialog");d.className="vpq-support-dialog";d.id="vpqSupportDialog";
d.setAttribute("aria-label","Vet Pharm Quest Settings & Support");
d.innerHTML=[
"<div class='vpq-support-head'><h2>⚙️ Settings & Support</h2><button type='button' data-vpq-close aria-label='Close Settings'>✕</button></div>",
"<div class='vpq-support-tabs'><button type='button' data-vpq-tab='about' aria-pressed='true'>About & Credits</button><button type='button' data-vpq-tab='requests' aria-pressed='false'>Request Center</button><button type='button' data-vpq-tab='account' aria-pressed='false'>Account & Saves</button></div>",
"<div class='vpq-support-body'>",
"<section class='vpq-support-panel' data-vpq-panel='about'><h3>🐾 Student-made and always growing</h3>",
"<p><b>Vet Pharm Quest</b> is an independently developed, student-led educational game and evolving work in progress. New rooms, quizzes, atlases, images, learning activities and improvements are added as they are reviewed.</p>",
"<p class='vpq-support-note'><b>Ownership & attribution:</b> The student creator contributes the concept, project vision, organization and other original contributions. Veterinary facts, course and reference materials, third-party images and other creators' works remain attributable to their respective sources and rights holders; the creator does not claim ownership of those materials. Citations and image credits are included in related lessons and source sections where available. Missing or inaccurate credits should be reported through the Request Center for correction. Some artwork and content have been made with AI assistance.</p>",
"<p><b>Educational disclaimer:</b> This is a learning game, not a licensed medical reference, diagnosis, prescription or treatment plan. Verify clinical details, drug labels, species reference intervals and reporting rules with current authoritative sources before using them for patient care.</p>",
"<p><b>Privacy:</b> Never include client/patient identifiers, passwords, confidential school files or personal health data in reports.</p>",
"</section>",
"<section class='vpq-support-panel' data-vpq-panel='requests' hidden><h3>📝 Request Center</h3>",
"<p>Report a bug, missing lecture, wrong answer, image/source credit, accessibility problem or feature idea. This prepares a report you can copy and share with the project creator. <b>Reports are not automatically submitted.</b></p>",
"<label for='vpq-support-type'>Type</label><select id='vpq-support-type'><option>Bug / broken button</option><option>Incorrect clinical or study content</option><option>Missing lecture / flashcard / atlas</option><option>Source or image credit</option><option>Accessibility / layout</option><option>Feature suggestion</option><option>Other</option></select>",
"<label for='vpq-support-title'>Brief title</label><input id='vpq-support-title' maxlength='120' placeholder='e.g. Necropsy flashcard lecture filter'>",
"<label for='vpq-support-location'>Room / course / exam / lecture</label><input id='vpq-support-location' maxlength='140' placeholder='e.g. Clinical Pathology • Exam 3'>",
"<label for='vpq-support-detail'>Details and suggested correction</label><textarea id='vpq-support-detail' maxlength='5000' placeholder='What happened? What did you expect? Add source link if relevant.'></textarea>",
"<div class='vpq-support-actions'><button type='button' id='vpq-support-copy'>Copy report</button><button type='button' id='vpq-support-download'>Download report</button></div>",
"<p class='vpq-support-status' id='vpq-support-status' role='status'></p>",
"<p class='vpq-support-note'>Copy or download your report and share it privately with the creator. There is not yet a built-in submission inbox. Please do not include confidential information.</p></section>",
"<section class='vpq-support-panel' data-vpq-panel='account' hidden><h3>🔐 Account & Save Options</h3>",
"<p>Manage sign-in or select <b>Forgot Password?</b> on the existing account page. Password recovery happens through the account provider; this game panel never asks for your password.</p>",
"<div class='vpq-support-actions'><a href='account-test.html'>Account Center / Password recovery</a></div>",
"<p>Check the cloud save indicator before switching devices. Guest progress and some locally edited learning cards may be saved only on this browser until exported or confirmed synced.</p></section></div>"
].join("");
document.body.appendChild(d);
function selectTab(name){
 d.querySelectorAll("[data-vpq-tab]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.vpqTab===name))});
 d.querySelectorAll("[data-vpq-panel]").forEach(function(p){p.hidden=p.dataset.vpqPanel!==name});
}
btn.addEventListener("click",function(){selectTab("about");d.showModal()});
d.addEventListener("click",function(e){var t=e.target.closest("[data-vpq-tab]");if(t)selectTab(t.dataset.vpqTab);if(e.target.closest("[data-vpq-close]"))d.close()});
function getReport(){
 var type=document.getElementById("vpq-support-type").value;
 var title=document.getElementById("vpq-support-title").value.trim();
 var where=document.getElementById("vpq-support-location").value.trim();
 var detail=document.getElementById("vpq-support-detail").value.trim();
 if(!title||!detail){document.getElementById("vpq-support-status").textContent="Please add a title and description.";return null}
 return {title:"["+type+"] "+title,body:"Type: "+type+"\nRoom, course, exam or lecture: "+(where||"Not specified")+"\n\nDetails:\n"+detail+"\n\nPlease omit private or patient information."};
}
document.getElementById("vpq-support-copy").addEventListener("click",async function(){
 var r=getReport();if(!r)return;
 try{await navigator.clipboard.writeText(r.title+"\n\n"+r.body);document.getElementById("vpq-support-status").textContent="Copied. No report has been submitted."}
 catch(e){document.getElementById("vpq-support-status").textContent="Clipboard blocked. Please select and copy your entered text manually."}
});
document.getElementById("vpq-support-download").addEventListener("click",function(){
 var r=getReport();if(!r)return;
 var blob=new Blob([r.title+"\n\n"+r.body],{type:"text/plain;charset=utf-8"});
 var url=URL.createObjectURL(blob);
 var a=document.createElement("a");a.href=url;a.download="vet-pharm-quest-feedback.txt";document.body.appendChild(a);a.click();a.remove();
 setTimeout(function(){URL.revokeObjectURL(url)},1000);
 document.getElementById("vpq-support-status").textContent="Report downloaded to your device. It has not been sent.";
});
})();
