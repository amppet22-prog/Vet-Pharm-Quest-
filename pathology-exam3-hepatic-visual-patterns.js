/* Original schematic hepatic visual-reference atlas for Exam 3.
 * These are teaching diagrams, not histologic or gross specimen photographs. */
(function(){'use strict';
const specs=[
[/congestion|nutmeg|anemia-associated/i,'nutmeg','Nutmeg liver: congested zone 3','Centrilobular congestion is dark; peripheral hepatocytes may appear relatively pale from fat or sparing.','L37 pp. 5–8'],
[/telangiectasia/i,'vascular','Telangiectasia: focal sinusoidal dilation','Flat dark red-blue sinusoidal pools can mimic vascular neoplasia, especially in cattle.','L37 p. 15'],
[/shunt|portal vein hypoplasia/i,'shunt','Portal bypass and microhepatia','Abnormal portal flow → reduced hepatic trophic factors and ammonia clearance.','L37 pp. 9–14'],
[/cirrhosis|regenerative hepatic nodules|lobular dissecting/i,'cirrhosis','Fibrosis with regeneration','Examine fibrous bridges: a diffusely scarred liver differs from incidental nodular hyperplasia.','L37 pp. 17–18; L40 p. 5'],
[/milk spots|ascaris/i,'milk','Pig liver milk spots','Random pale firm capsular migration scars from Ascaris larvae are not neoplastic nodules.','L38 p. 23'],
[/fasciola|fluke/i,'tracts','Fluke migration tracts and bile ducts','Immature flukes traverse parenchyma, leaving red-to-fibrous tracts; mature Fasciola occupy ducts.','L38 pp. 27–28'],
[/fatty liver|lipidosis|steatosis|steroid hepatopathy/i,'fat','Hepatocyte storage vs toxic necrosis','Yellow swollen liver is nonspecific; histology distinguishes fat droplets from glycogen vacuolation.','L39 pp. 21–26'],
[/megalocytosis|pyrrolizidine/i,'megalocyte','Megalocytosis','Enlarged nuclei plus fibrosis and ductular proliferation favor chronic pyrrolizidine toxic injury.','L39 pp. 9–10'],
[/hepatocellular carcinoma|hepatoblastoma|adenoma|metastatic hepatic|hepatic neoplasia|nodular hyperplasia/i,'tumor','Liver masses: distribution and histology','Single massive, multiple nodular or diffuse infiltrative lesions require histology for classification.','L40 pp. 4–15'],
[/mucocele|cholecystitis|cholelith/i,'gall','Gallbladder: bile, stone or mucocele','Distinguish viscous gelatinous mucin from discrete calculi and simple fasting-related bile distension.','L40 pp. 18–24'],
[/cyanobacter|aflatox|necrosis|hepatotoxin/i,'zones','Hepatic lobule zones','Zone 1 periportal gets blood first, zone 3 centrilobular gets blood last and has P450 bioactivation.','L36 pp. 7–8, 33–37; L39 pp. 4–8']
];
const drawings={
nutmeg:'<circle cx="80" cy="91" r="17" fill="#7b3d48"/><circle cx="139" cy="81" r="18" fill="#7b3d48"/><circle cx="191" cy="112" r="16" fill="#7b3d48"/><circle cx="106" cy="139" r="15" fill="#7b3d48"/>',
vascular:'<ellipse cx="93" cy="95" rx="31" ry="16" fill="#6e3646"/><ellipse cx="180" cy="143" rx="24" ry="14" fill="#783245"/>',
shunt:'<path d="M60 165Q65 48 128 51" fill="none" stroke="#4d91b5" stroke-width="11"/><path d="M128 51Q216 55 230 18" fill="none" stroke="#387da8" stroke-width="9"/><path d="M128 51Q158 89 162 150" fill="none" stroke="#8e5b7f" stroke-width="5" stroke-dasharray="5 6"/>',
cirrhosis:'<path d="M48 80 Q75 60 102 96T152 112Q180 70 212 102" fill="none" stroke="#ece6d7" stroke-width="12"/><path d="M85 44L96 150M151 55L154 162" stroke="#ebe3d4" stroke-width="8"/><circle cx="117" cy="120" r="17" fill="#b96e70" stroke="#eddfcf" stroke-width="4"/>',
milk:Array.from({length:16},(_,i)=>{const x=70+(i*37)%140,y=55+(i*53)%102;return '<ellipse cx="'+x+'" cy="'+y+'" rx="5" ry="2.4" fill="#f2e5d5"/>'}).join(''),
tracts:'<path d="M52 81Q105 103 175 160M79 160Q118 115 192 82" fill="none" stroke="#723c42" stroke-width="10" opacity=".8"/><path d="M70 50L83 130" stroke="#f0d6ae" stroke-width="7"/>',
fat:Array.from({length:18},(_,i)=>{const x=62+(i*43)%147,y=55+(i*37)%98;return '<circle cx="'+x+'" cy="'+y+'" r="8" fill="#efe3ae" stroke="#cb9b69" stroke-width="1"/>'}).join(''),
megalocyte:'<circle cx="112" cy="107" r="35" fill="#eabcae" stroke="#b87177" stroke-width="3"/><circle cx="112" cy="107" r="21" fill="#794b6d"/><circle cx="171" cy="110" r="18" fill="#e9b5a4"/><circle cx="171" cy="110" r="7" fill="#794b6d"/>',
tumor:'<circle cx="151" cy="107" r="51" fill="#ddd0b4" stroke="#89585d" stroke-width="3"/><circle cx="93" cy="137" r="15" fill="#e7d1b7"/><circle cx="192" cy="64" r="16" fill="#d3c6b4"/>',
gall:'<path d="M114 56Q91 101 111 155Q143 198 173 153Q188 112 166 57Z" fill="#5c784c" stroke="#355440" stroke-width="4"/><path d="M115 115Q141 91 168 120Q171 160 143 172Q118 161 115 115Z" fill="#b1ab5c"/>',
zones:'<path d="M57 48 L213 48 L135 179 Z" fill="#e5cfab" stroke="#926a6a" stroke-width="3"/><path d="M81 75 L188 75 L135 164 Z" fill="#d9ae9f"/><path d="M104 115 L164 115 L135 164 Z" fill="#ab6e77"/><text x="135" y="64" text-anchor="middle" font-size="11" fill="#563f47">Zone 1</text><text x="135" y="105" text-anchor="middle" font-size="11" fill="#563f47">Zone 2</text><text x="135" y="144" text-anchor="middle" font-size="11" fill="#fff">Zone 3</text>'
};
const esc=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function svg(k){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 205" role="img" aria-label="Original '+esc(k)+' teaching diagram" style="max-width:300px;width:100%;max-height:225px"><rect width="270" height="205" rx="12" fill="#f7f8fa"/>'+(k==='zones'?drawings.zones:'<path d="M130 28Q65 18 43 83Q33 159 103 176L198 161Q230 116 203 58Q175 24 130 28Z" fill="#bc7775" stroke="#865b63" stroke-width="4"/>'+drawings[k])+'<text x="135" y="194" text-anchor="middle" font-size="10" fill="#516078">Schematic only · not a tissue photograph</text></svg>'}
function card(item,n){if(!/^(36|37|38|39|40)$/.test(String(n)))return '';const title=item?.title||'';const p=specs.find(x=>x[0].test(title));if(!p)return '';return '<div style="border:1px solid #d4dfe7;border-radius:13px;background:#f7fafc;padding:12px;margin:10px 0"><b>Visual pattern: '+esc(p[2])+'</b><div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px">'+svg(p[1])+'<div style="flex:1;min-width:170px;font-size:13px"><p>'+esc(p[3])+'</p><p><b>Real lecture image:</b> '+esc(p[4])+'</p><small>Only an educational location/pattern drawing. Use credited owner photo uploads for actual gross/histo specimens.</small></div></div></div>'}
window.VPQ_PATH_HEPATIC_VISUALS={card,count:specs.length};
})();