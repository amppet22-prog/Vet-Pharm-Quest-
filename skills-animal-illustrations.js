/* Reusable original cute patient silhouettes, realistic enough to recognize body regions,
 * deliberately not an anatomical injection-placement map. */
window.VPQ_SKILLS_ANIMALS=(function(){
 const svg=(body,title)=>'<svg viewBox="0 0 350 150" role="img" aria-label="Illustrated '+title+' in lateral view, simplified anatomical landmarks" style="width:100%;height:245px;display:block" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="vpqAnimalBg" x2=".3" y2="1"><stop stop-color="#fff5fc"/><stop offset="1" stop-color="#e1f4fb"/></linearGradient></defs><rect width="350" height="150" fill="url(#vpqAnimalBg)"/><ellipse cx="178" cy="143" rx="146" ry="5" fill="#bab6cf" opacity=".38"/>'+body+'<text x="326" y="23" font-size="17" text-anchor="middle" fill="#c995c5">✦</text></svg>';
 const legs=(coat,stroke)=>[135,169,251,281].map((x,i)=>'<path d="M'+x+' 99l'+(i%2?4:-3)+' 39h12l'+(i%2?2:0)+' -39" fill="'+coat+'" stroke="'+stroke+'" stroke-width="3"/>').join('')+
 '<path d="M127 138h19M166 138h20M245 138h20M280 138h20" stroke="'+stroke+'" stroke-width="5" stroke-linecap="round"/>';
 const horse=svg('<path d="M290 70Q319 52 335 81" stroke="#88543f" stroke-width="12" fill="none"/>'+
 legs('#c98c62','#98664a')+'<ellipse cx="213" cy="80" rx="94" ry="43" fill="#d49a6e" stroke="#98664a" stroke-width="4"/>'+
 '<path d="M153 75Q132 43 106 31l-19 17 20 52 24 10" fill="#cf946b" stroke="#98664a" stroke-width="4"/>'+
 '<path d="M113 31l-6 -20 -14 5 -3 22M91 38l-18 -20 -7 18" fill="#a16b4f" stroke="#865740" stroke-width="3"/>'+
 '<path d="M109 32Q129 45 145 80" stroke="#6f4a3e" stroke-width="8" fill="none" stroke-linecap="round"/>'+
 '<path d="M92 37Q66 36 49 61l-12 14q-8 18 19 21 36 -1 44 -35" fill="#dca579" stroke="#97664b" stroke-width="4"/>'+
 '<path d="M39 78q11 11 26 6" fill="none" stroke="#fbe2d3" stroke-width="8"/><ellipse cx="45" cy="83" rx="4" ry="3" fill="#473f42"/><circle cx="82" cy="51" r="5" fill="#382d35"/><circle cx="84" cy="49" r="1.5" fill="white"/>'+
 '<path d="M121 53q21 20 27 28" fill="none" stroke="#f7cfaa" stroke-width="5" opacity=".65"/>','chestnut horse');
 const dog=svg('<path d="M285 68Q315 27 334 52" fill="none" stroke="#bb815c" stroke-width="15" stroke-linecap="round"/>'+
 legs('#c7926f','#986f61')+'<ellipse cx="211" cy="85" rx="93" ry="39" fill="#dba97e" stroke="#a97a65" stroke-width="4"/>'+
 '<ellipse cx="118" cy="76" rx="44" ry="40" fill="#e2ae83" stroke="#a97a65" stroke-width="3"/>'+
 '<path d="M89 48Q56 36 68 82l23 -13M140 47q26 -17 20 27l-21 -11" fill="#a86e57" stroke="#976451" stroke-width="3"/>'+
 '<ellipse cx="80" cy="91" rx="28" ry="18" fill="#fff0d7"/><ellipse cx="59" cy="85" rx="10" ry="7" fill="#514553"/>'+
 '<circle cx="112" cy="70" r="5" fill="#3f3641"/><circle cx="114" cy="68" r="2" fill="white"/>'+
 '<path d="M70 104q15 12 34 -3" stroke="#9a6c64" stroke-width="3" fill="none"/>'+
 '<path d="M171 78q30 20 55 0" stroke="#f6d2b3" stroke-width="10" fill="none" opacity=".7"/>','friendly dog');
 const cat=svg('<path d="M283 78q44 -71 53 -19q4 27 -27 26" fill="none" stroke="#a49ac8" stroke-width="13" stroke-linecap="round"/>'+
 legs('#c6b8dc','#9586b4')+'<ellipse cx="211" cy="86" rx="90" ry="36" fill="#d4c5e4" stroke="#a28cb9" stroke-width="4"/>'+
 '<path d="M78 62L70 24 103 43 126 24 141 64" fill="#d7c5e5" stroke="#a28cb9" stroke-width="4"/>'+
 '<circle cx="110" cy="73" r="42" fill="#dfd0ed" stroke="#a28cb9" stroke-width="3"/>'+
 '<path d="M79 41l-4 -14 17 12M121 41l12 -14 4 18" fill="#eaa8c6"/>'+
 '<ellipse cx="96" cy="71" rx="7" ry="10" fill="#76a3a1"/><ellipse cx="124" cy="71" rx="7" ry="10" fill="#76a3a1"/>'+
 '<path d="M105 89l10 0 -5 6z" fill="#d58fa8"/><path d="M110 94q-8 10 -18 3M110 94q8 10 18 3" fill="none" stroke="#8b748f" stroke-width="2"/>'+
 '<path d="M77 87l-24 -6M78 94l-24 5M143 87l24 -6M142 94l24 5" stroke="#8b748f" stroke-width="2"/>'+
 '<path d="M195 69q20 30 42 0" stroke="#f4edf9" stroke-width="9" fill="none"/>','cute cat');
 const cattle=svg('<path d="M289 68Q314 67 322 87" fill="none" stroke="#af98a1" stroke-width="10"/>'+
 legs('#eee7da','#9f9891')+'<ellipse cx="206" cy="81" rx="99" ry="45" fill="#f8f1e5" stroke="#afa99b" stroke-width="4"/>'+
 '<ellipse cx="216" cy="69" rx="29" ry="24" fill="#ae8e8d"/><ellipse cx="272" cy="92" rx="22" ry="19" fill="#ae8e8d"/>'+
 '<circle cx="104" cy="65" r="44" fill="#f7f1ea" stroke="#aaa399" stroke-width="3"/>'+
 '<path d="M73 41L49 26Q42 56 77 63M130 40l27 -20q10 32 -21 42" fill="#e8b3b8" stroke="#a69b91" stroke-width="3"/>'+
 '<path d="M82 29L71 11M128 29l16 -18" stroke="#d6c1a3" stroke-width="8"/>'+
 '<ellipse cx="88" cy="84" rx="37" ry="25" fill="#edc0c3" stroke="#cb9da4" stroke-width="3"/>'+
 '<ellipse cx="73" cy="82" rx="5" ry="7" fill="#a77983"/><ellipse cx="103" cy="82" rx="5" ry="7" fill="#a77983"/>'+
 '<circle cx="114" cy="58" r="4" fill="#51434c"/><path d="M80 99q14 8 27 0" fill="none" stroke="#bd8d94" stroke-width="2"/>','spotted cow');
 const bird=svg('<path d="M176 113L171 138M208 111L214 138" stroke="#bd8c7b" stroke-width="6"/>'+
 '<path d="M166 136l-15 5M166 136l14 4M212 137l-15 5M212 137l14 4" stroke="#ba8f7a" stroke-width="3"/>'+
 '<ellipse cx="201" cy="84" rx="88" ry="48" fill="#bde4d9" stroke="#80b8ae" stroke-width="4"/>'+
 '<path d="M165 63q35 35 79 25q-18 35 -71 19" fill="#86c9bf" stroke="#73ada4" stroke-width="3"/>'+
 '<path d="M259 75l62 -35 -27 65" fill="#91bbc9" stroke="#81a8b5" stroke-width="4"/>'+
 '<path d="M106 73Q100 41 112 23" stroke="#a3d2c5" stroke-width="26" fill="none"/>'+
 '<circle cx="100" cy="30" r="26" fill="#c8eadb" stroke="#86baac" stroke-width="3"/>'+
 '<path d="M81 32L51 42 82 48" fill="#ffcf76" stroke="#d2a057" stroke-width="2"/>'+
 '<circle cx="91" cy="27" r="5" fill="#354550"/><circle cx="92" cy="25" r="2" fill="white"/>'+
 '<path d="M95 2l-9 -13M106 5l4 -14" stroke="#95c8b7" stroke-width="7" stroke-linecap="round"/>','pastel bird');
 return Object.freeze({horse,dog,cat,cattle,bird,render:key=>({horse,dog,cat,cattle,bird}[key]||dog)});
})();