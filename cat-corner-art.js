/* Vet Pharm Quest · approved 2.5D feline lounge. Background is vector art;
   the existing stations, owned decor overlays, avatar and behavior lessons remain separate. */
(function(){
'use strict';
window.VPQ_CAT_CORNER_ART=function(){
let s=`<svg class="vpqWingArt" viewBox="0 0 1000 500" preserveAspectRatio="none" role="img" aria-label="Cozy cat-friendly veterinary lounge with elevated bridges, climbing structures, hideouts, puzzle toys and a safe window seat">
<defs>
 <linearGradient id="catWall3" x2="0" y2="1"><stop stop-color="#fff2f1"/><stop offset="1" stop-color="#edd8ec"/></linearGradient>
 <linearGradient id="catFloor3" x2="0" y2="1"><stop stop-color="#f9e0d8"/><stop offset="1" stop-color="#d8bbce"/></linearGradient>
 <linearGradient id="catWood3" x2="0" y2="1"><stop stop-color="#f7d5a4"/><stop offset="1" stop-color="#b97d5b"/></linearGradient>
 <linearGradient id="catPurple3" x2="0" y2="1"><stop stop-color="#e2c0ef"/><stop offset="1" stop-color="#ad83c2"/></linearGradient>
 <filter id="catDrop3" x="-20%" y="-30%" width="150%" height="170%"><feDropShadow dx="1" dy="4" stdDeviation="3" flood-color="#674c6c" flood-opacity=".24"/></filter>
</defs>
<rect width="1000" height="500" fill="url(#catWall3)"/>
<polygon points="0,0 1000,0 946,60 53,60" fill="#fff8f7"/>
<polygon points="0,0 53,60 53,342 0,411" fill="#dbc1d3"/>
<polygon points="1000,0 946,60 946,342 1000,411" fill="#dbc1d3"/>
<rect x="53" y="61" width="893" height="286" fill="url(#catWall3)"/>
<polygon points="53,347 946,347 1000,500 0,500" fill="url(#catFloor3)"/>
<path d="M53 349H946M53 349L0 500M946 349L1000 500M252 349L207 500M500 348V500M748 349L789 500M0 416H1000M0 463H1000" fill="none" stroke="#ffeff5" stroke-width="3" opacity=".75"/>
<path d="M53 347H946" stroke="#bd98b8" stroke-width="9"/>
<!-- suspended string lighting -->
<path d="M50 94Q255 136 460 92T948 90" fill="none" stroke="#a681a2" stroke-width="3"/>
<g fill="#ffe9b2" stroke="#f5caa0" stroke-width="2">
`;
for(let i=0;i<15;i++){const x=66+i*63,y=Math.round(96+22*Math.sin(i*.55));s+=`<circle cx="${x}" cy="${y}" r="7"/>`}
s+=`</g>
<!-- inset rear window and cushioned reading nook -->
<g filter="url(#catDrop3)">
 <rect x="787" y="126" width="168" height="183" rx="15" fill="#f3faff" stroke="#be9bb8" stroke-width="9"/>
 <rect x="800" y="138" width="141" height="153" rx="7" fill="#b8e4ee"/>
 <path d="M802 233Q841 181 876 220Q902 187 941 215V292H802Z" fill="#afd2ab"/>
 <path d="M869 138v155M800 211h141" stroke="#fff4fa" stroke-width="8"/>
 <circle cx="912" cy="173" r="21" fill="#fff3c1"/>
 <path d="M778 318h183" stroke="#d8a9a2" stroke-width="12" stroke-linecap="round"/>
 <rect x="791" y="314" width="163" height="50" rx="8" fill="#ddaeac" stroke="#b783a0" stroke-width="4"/>
 <rect x="797" y="305" width="154" height="28" rx="13" fill="#f5cbdc"/>
 <path d="M800 311q20-17 35 0v17h-35ZM914 310q20-15 36 0v17h-36Z" fill="#fff0e4"/>
</g>
<!-- room title above climbing system -->
<g filter="url(#catDrop3)">
 <path d="M395 67l15-20 24 16M605 67l-15-20-24 16" fill="#f6d8ae" stroke="#af8b87" stroke-width="4"/>
 <rect x="382" y="71" width="240" height="61" rx="23" fill="#fff4e0" stroke="#c8989b" stroke-width="5"/>
 <text x="502" y="99" font-family="Arial" font-size="23" font-weight="900" text-anchor="middle" fill="#86618b">THE COZY CAT</text>
 <text x="502" y="119" font-family="Arial" font-size="18" font-weight="900" text-anchor="middle" fill="#ad82a6">LOUNGE ♡</text>
</g>
<!-- wall steps, cat bridges and elevated climbing path -->
<g filter="url(#catDrop3)" stroke-linecap="round" stroke-linejoin="round">
 <path d="M93 260h74M135 222h60M173 187h72M240 158h91" stroke="#b07b61" stroke-width="10"/>
 <path d="M97 253h70M137 215h59M173 180h70M243 150h85" stroke="#ffd8a9" stroke-width="9"/>
 <path d="M314 156Q355 184 397 154" stroke="#c28b69" stroke-width="8" fill="none"/>
 <path d="M314 148Q355 176 397 146" stroke="#ffe2b7" stroke-width="6" fill="none"/>
 <path d="M314 154v-14M327 162v-17M340 169v-18M353 170v-19M366 166v-18M380 159v-17M393 152v-14" stroke="#a97962" stroke-width="2"/>
 <path d="M631 159Q671 186 723 156" stroke="#be8b72" stroke-width="9" fill="none"/>
 <path d="M630 151Q673 179 721 148" stroke="#f5dbb7" stroke-width="6" fill="none"/>
 <path d="M636 160v-18M652 169v-18M671 174v-19M689 172v-18M706 163v-16" stroke="#a97962" stroke-width="2"/>
 <path d="M730 190h51M756 225h38M723 267h69" stroke="#b9856f" stroke-width="11"/>
 <path d="M732 183h49M757 218h37M725 260h67" stroke="#ffdda9" stroke-width="9"/>
</g>
<!-- left hideout: cat-ear shaped enclosed bed -->
<g filter="url(#catDrop3)">
 <path d="M88 346V274Q88 247 120 232L133 206L161 224Q192 214 221 226L247 206L263 235Q289 251 289 275V347Z" fill="#f6d4b8" stroke="#c18f9e" stroke-width="6"/>
 <path d="M107 337v-58Q107 249 146 249h91q35 0 35 30v58Z" fill="#876a9d" stroke="#e0bbd8" stroke-width="5"/>
 <ellipse cx="192" cy="331" rx="83" ry="19" fill="#f5bdd7"/>
 <ellipse cx="195" cy="324" rx="62" ry="12" fill="#fce2ec"/>
</g>
<!-- sturdy multi-level cat tree with sisal posts and cushioned steps -->
<g filter="url(#catDrop3)">
 <path d="M373 363v-181M489 360V162M592 354V186" stroke="#b78e61" stroke-width="27"/>
 <path d="M373 363v-181M489 360V162M592 354V186" stroke="#efd6a2" stroke-width="18" stroke-dasharray="4 4"/>
 <rect x="338" y="170" width="111" height="16" rx="8" fill="#c49bca" stroke="#a180b5" stroke-width="4"/>
 <rect x="434" y="137" width="127" height="16" rx="8" fill="#d3a1d7" stroke="#a180b5" stroke-width="4"/>
 <rect x="542" y="198" width="104" height="16" rx="8" fill="#c49bca" stroke="#a180b5" stroke-width="4"/>
 <rect x="327" y="277" width="113" height="16" rx="8" fill="#d4acd9" stroke="#a180b5" stroke-width="4"/>
 <rect x="445" y="263" width="118" height="16" rx="8" fill="#d4acd9" stroke="#a180b5" stroke-width="4"/>
 <rect x="435" y="299" width="107" height="72" rx="9" fill="url(#catWood3)" stroke="#b98c80" stroke-width="5"/>
 <path d="M467 358v-22q0-20 22-20t22 20v22Z" fill="#735675"/>
 <ellipse cx="489" cy="362" rx="72" ry="11" fill="#b884ac"/>
 <path d="M401 352l69-66" stroke="#dba976" stroke-width="12"/>
 <path d="M406 353l70-68" stroke="#f8dfb4" stroke-width="6"/>
</g>
<!-- quiet cubbies, mushroom hide, tunnel, and basket -->
<g filter="url(#catDrop3)">
 <path d="M648 334q5-58 74-58q66 0 70 58Z" fill="#eb99aa" stroke="#b7819f" stroke-width="5"/>
 <ellipse cx="720" cy="309" rx="65" ry="19" fill="#f7bed0"/>
 <path d="M681 355v-43q0-22 35-22t35 22v43" fill="#f7e4cb" stroke="#ca9cab" stroke-width="5"/>
 <ellipse cx="718" cy="355" rx="35" ry="14" fill="#f3bbd8"/>
 <rect x="564" y="326" width="80" height="48" rx="23" fill="#ad89c7" stroke="#8969a5" stroke-width="6"/>
 <ellipse cx="569" cy="351" rx="21" ry="26" fill="#695585" stroke="#e0bfe4" stroke-width="5"/>
 <ellipse cx="630" cy="351" rx="13" ry="22" fill="#6d5889" stroke="#e0bfe4" stroke-width="4"/>
 <ellipse cx="318" cy="381" rx="72" ry="27" fill="#d9a8b8" stroke="#bf8a90" stroke-width="6"/>
 <ellipse cx="318" cy="374" rx="60" ry="18" fill="#ffe1dc"/>
</g>
<!-- easy-to-understand cat enrichment objects, low on the floor -->
<g filter="url(#catDrop3)">
 <ellipse cx="500" cy="449" rx="214" ry="35" fill="#e9bfd7" stroke="#bd96ca" stroke-width="7"/>
 <ellipse cx="500" cy="445" rx="190" ry="28" fill="none" stroke="#fff6f6" stroke-width="4" stroke-dasharray="7 11"/>
 <ellipse cx="502" cy="442" rx="16" ry="10" fill="#b18ac7"/><circle cx="482" cy="432" r="7" fill="#b18ac7"/><circle cx="494" cy="426" r="7" fill="#b18ac7"/><circle cx="509" cy="426" r="7" fill="#b18ac7"/><circle cx="522" cy="432" r="7" fill="#b18ac7"/>
 <ellipse cx="552" cy="393" rx="37" ry="13" fill="#a782cc" stroke="#8c69ad" stroke-width="4"/>
 <ellipse cx="553" cy="387" rx="30" ry="8" fill="#ffe6c4"/>
 <rect x="542" y="365" width="22" height="20" rx="8" fill="#b990e1"/>
 <ellipse cx="553" cy="360" rx="27" ry="10" fill="#c6a0ed" stroke="#8c69ad" stroke-width="3"/>
 <circle cx="575" cy="381" r="5" fill="#f6ba75"/><circle cx="534" cy="389" r="4" fill="#a8dcbd"/>
 <circle cx="367" cy="402" r="15" fill="#f0b866" stroke="#d79875" stroke-width="4"/>
 <path d="M357 395l19 16M376 395l-19 16" stroke="#fff4e7" stroke-width="3"/>
 <path d="M643 400q16-29 42-10" stroke="#a67fbd" stroke-width="5" fill="none"/>
 <path d="M666 389l14 9-16 6Z" fill="#e7a7cc"/>
 <rect x="712" y="391" width="76" height="14" rx="7" fill="#ebc397" stroke="#c49484" stroke-width="3"/>
 <circle cx="727" cy="398" r="5" fill="#ad8ac7"/><circle cx="746" cy="398" r="5" fill="#9ac9b9"/><circle cx="765" cy="398" r="5" fill="#d79e9d"/>
</g>
<!-- plant pots flanking climbing space, away from play walking lane -->
<g filter="url(#catDrop3)">
 <path d="M304 297h46l-7 32h-32Z" fill="#dfaead" stroke="#bd8e9d" stroke-width="3"/>
 <path d="M327 301q-32-38-15-54q23 11 15 54M327 301q31-41 43-28q-3 19-43 28M327 301q-5-46 17-50q10 26-17 50" fill="#82b99b" stroke="#6f9e87" stroke-width="3"/>
 <path d="M737 281h35l-5 22h-27Z" fill="#e7b9a3" stroke="#bc8b86" stroke-width="2"/>
 <path d="M753 281q-23-37-10-40q20 9 10 40M754 281q17-41 29-32q-1 22-29 32" fill="#82b99b" stroke="#6f9e87" stroke-width="2"/>
</g>
<!-- illustrated upper-room additions from approved lounge concept: usable-looking wall cubbies and a rope hammock, away from floor controls -->
<g filter="url(#catDrop3)">
 <!-- wall-mounted enclosed cubby at left, integrated with the climbing steps -->
 <path d="M158 171l11-15h59l11 15v48h-81Z" fill="#e9c8b8" stroke="#b88e9c" stroke-width="4"/>
 <path d="M175 211v-19q0-16 22-16t22 16v19Z" fill="#82628e" stroke="#ccafd1" stroke-width="4"/>
 <ellipse cx="198" cy="209" rx="22" ry="8" fill="#dcb0d0"/>
 <!-- suspended hammock supported by two existing structural wall points -->
 <path d="M253 213L309 230L361 210" fill="none" stroke="#b58396" stroke-width="4"/>
 <path d="M252 213Q303 268 360 211Q308 258 252 213Z" fill="#e0b2d3" stroke="#ba8ead" stroke-width="3"/>
 <path d="M254 214L260 192M357 212L355 194" stroke="#b3889c" stroke-width="3"/>
 <!-- upper right wall cube hide connected to existing cat wall steps -->
 <path d="M709 196l12-20h54l11 20v58h-77Z" fill="#f5cfaf" stroke="#c49a99" stroke-width="4"/>
 <path d="M727 245v-23q0-20 20-20t20 20v23Z" fill="#946c9b"/>
 <ellipse cx="747" cy="245" rx="29" ry="8" fill="#e9b4d6"/>
 <!-- cozy window seat gets a padded backrest and folded blanket -->
 <path d="M798 302q23-21 42-5v22h-42Z" fill="#f8e0d7" stroke="#dcafb9" stroke-width="2"/>
 <path d="M908 302q27-20 39-1v19h-39Z" fill="#fce6da" stroke="#dcafb9" stroke-width="2"/>
 <path d="M854 324q21-13 37 0" fill="none" stroke="#fff5f3" stroke-width="5"/>
</g>
<!-- enrichment varied by function: kicker toy, rolling ball and puzzle feeder rather than repeated generic clutter -->
<g filter="url(#catDrop3)">
 <path d="M267 397q24-16 36 9l-7 12q-17-4-29-21Z" fill="#b6cce0" stroke="#91afc9" stroke-width="3"/>
 <path d="M273 398l20 15M281 391l15 18" stroke="#f9f8f5" stroke-width="2"/>
 <circle cx="813" cy="396" r="13" fill="#f0b9a5" stroke="#c88f9b" stroke-width="3"/>
 <path d="M801 395h24M814 384v24" stroke="#f6decb" stroke-width="3"/>
 <rect x="687" y="367" width="70" height="16" rx="8" fill="#d8b5e2" stroke="#a584c2" stroke-width="3"/>
 <circle cx="703" cy="373" r="4" fill="#f7c47e"/><circle cx="723" cy="373" r="4" fill="#92c6a8"/><circle cx="742" cy="373" r="4" fill="#f1aeca"/>
</g>
<!-- suspended toys under perches -->
<path d="M427 187v45M608 212v34M753 270v30" stroke="#bd9dbb" stroke-width="2" stroke-dasharray="3 3"/>
<circle cx="427" cy="238" r="10" fill="#e7afd4" stroke="#bc89af" stroke-width="3"/>
<path d="M598 246q14-14 23 0l-7 16h-9Z" fill="#f6c1d8" stroke="#c58ba7" stroke-width="2"/>
<circle cx="753" cy="305" r="8" fill="#b9d7e6" stroke="#8eb6c7" stroke-width="3"/>
`;
return s;
};
})();