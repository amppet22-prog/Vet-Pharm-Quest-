/* Browser-local encrypted GitHub token vault for owner publishing.
 * The passphrase is NOT an authorization mechanism by itself; a GitHub-issued
 * fine-grained token is still required once. Only encrypted bytes are persisted.
 */
window.VPQ_OWNER_KEY_VAULT=(function(){
'use strict';
const STORAGE='vpq-owner-key-vault-v1', ITERATIONS=260000, enc=new TextEncoder(),dec=new TextDecoder();
function bytesToB64(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s)}
function b64ToBytes(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0))}
function available(){return !!(window.isSecureContext&&window.crypto?.subtle&&window.crypto?.getRandomValues)}
function exists(){try{return !!localStorage.getItem(STORAGE)}catch{return false}}
function clear(){try{localStorage.removeItem(STORAGE)}catch{}}
async function makeKey(passphrase,salt){
 const initial=await crypto.subtle.importKey('raw',enc.encode(passphrase),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},initial,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function store(token,passphrase){
 if(!available())throw Error('Password-protected publishing requires a secure HTTPS connection and a modern browser.');
 if(typeof passphrase!=='string'||passphrase.length<12)throw Error('Choose a password of at least 12 characters.');
 if(!/^github_pat_|^ghp_/.test(token||''))throw Error('Enter your fine-grained GitHub token first.');
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await makeKey(passphrase,salt);
 const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(token));
 const vault={version:1,kdf:'PBKDF2-SHA256',iterations:ITERATIONS,salt:bytesToB64(salt),iv:bytesToB64(iv),cipher:bytesToB64(new Uint8Array(cipher))};
 localStorage.setItem(STORAGE,JSON.stringify(vault));
 return true;
}
async function unlock(passphrase){
 if(!available())throw Error('Your browser cannot unlock this encrypted key. Use HTTPS or enter a fresh GitHub token.');
 let vault;try{vault=JSON.parse(localStorage.getItem(STORAGE)||'null')}catch{}
 if(!vault||vault.version!==1||!vault.cipher)throw Error('No saved publishing key. Enter a new GitHub token.');
 try{
  const key=await makeKey(passphrase,b64ToBytes(vault.salt));
  const data=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64ToBytes(vault.iv)},key,b64ToBytes(vault.cipher));
  return dec.decode(data);
 }catch{throw Error('Incorrect password or damaged saved key. Please try again.')}
}
return Object.freeze({available,exists,clear,store,unlock});
})();
