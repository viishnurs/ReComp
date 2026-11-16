/* ReComp AI Coach v4: no secrets in shipped source. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const B=window.ReCompBridge;
const CHAT_KEY='recomp-ai-chat-v1', ENDPOINT_KEY='recomp-ai-endpoint-v1', TOKEN_KEY='recomp-ai-access-token-v1';
function savedToken(){try{return localStorage.getItem(TOKEN_KEY)||''}catch{return ''}}
function rememberToken(value){try{if(value)localStorage.setItem(TOKEN_KEY,value);else localStorage.removeItem(TOKEN_KEY);return true}catch{return false}}
window.ReCompAIConfig={getToken:()=>($('rc4-token')?.value||'').trim()||savedToken(),getEndpoint:()=>($('rc4-endpoint')?.value||'').trim()||(()=>{try{return localStorage.getItem(ENDPOINT_KEY)||''}catch{return ''}})()};
let messages=[],busy=false,accessToken='';
try {const loaded=JSON.parse(localStorage.getItem(CHAT_KEY)||'[]');if(Array.isArray(loaded))messages=loaded.filter(m=>m&&['user','model'].includes(m.role)&&typeof m.text==='string').slice(-20);}catch{}
const persist=()=>{try{localStorage.setItem(CHAT_KEY,JSON.stringify(messages.slice(-20)))}catch{}};
function bubble(role,t){const d=document.createElement('div');d.className='msg '+(role==='user'?'u':'a');d.textContent=t;$('cchat').appendChild(d);d.scrollIntoView({block:'nearest'});return d;}
function reloadChat(){if(!$('cchat'))return;$('cchat').replaceChildren();messages.forEach(m=>bubble(m.role,m.text));}
function shortSummary(){if(!B)throw Error('Tracker not loaded');const s=B.getState(),ts=B.targets(),last=[];const today=new Date();for(let n=6;n>=0;n--){let d=new Date(today);d.setDate(d.getDate()-n);let key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');const t=B.totals(key);const sessions=(s.v3?.sessions||[]).filter(x=>x.date===key);last.push({date:key,kcal:Math.round(t.kcal||0),proteinG:Math.round(t.protein||0),steps:Number(s.steps?.[key]||0),waterMl:Number(s.water?.[key]||0),workouts:(s.workouts?.[key]||[]).length+sessions.length,weightKg:Number(s.weights?.[key]||0)||null});}
// Send a deliberately limited recent-food sample only when the user opts in.
// The day-level totals above remain authoritative; meals are context, not a full diary.
const recentMeals=[];
for(const day of [...last].reverse()){
 const items=Array.isArray(s.days?.[day.date])?s.days[day.date]:[];
 for(const entry of [...items].reverse()){
  if(recentMeals.length>=8)break;
  recentMeals.push({date:day.date,food:String(entry.name||'Unnamed food').slice(0,65),meal:String(entry.meal||'').slice(0,22),kcal:Math.round(Number(entry.kcal)||0),proteinG:Math.round(Number(entry.protein)||0),fiberG:Math.round(Number(entry.fiber)||0)});
 }
 if(recentMeals.length>=8)break;
}
const data={targets:{caloriesKcal:ts.kcal,proteinG:ts.pro,stepGoal:s.profile?.stepGoal},days:last,recentMeals,mealContextNote:'Only up to 8 latest entries from the past 7 days. Not a complete food diary. Entries may have missing fibre.'};return data;}
function setup(){if(!$('cchat'))return;try{$('rc4-endpoint').value=localStorage.getItem(ENDPOINT_KEY)||''}catch{}
const saved=savedToken(), field=$('rc4-token'), status=$('rc4-save-status');
if(saved){field.value=saved;accessToken=saved;status.textContent='Connection saved on this device. You can use AI without entering the token again.';}
else status.textContent='Enter your token once. It will be remembered on this device.';
$('rc4-forget-token').onclick=()=>{if(!confirm('Forget the saved AI access token on this device?'))return;rememberToken('');accessToken='';field.value='';status.textContent='Saved token forgotten. Enter it again to use AI.';};
$('rc4-endpoint').addEventListener('change',()=>{const url=$('rc4-endpoint').value.trim().replace(/\/$/,'');try{localStorage.setItem(ENDPOINT_KEY,url)}catch{}});
$('rc4-token').addEventListener('input',e=>{accessToken=e.target.value.trim();if(accessToken.length>=16){status.textContent=rememberToken(accessToken)?'Token saved in this device’s browser storage (not encrypted).':'Could not save token: check browser storage permissions.';}else{rememberToken('');status.textContent='Enter at least 16 characters to save your token.';}});
$('rc4-share').addEventListener('change',()=>{$('rc4-preview').textContent=$('rc4-share').checked?'Each question shares a 7-day totals summary plus up to 8 recent food entries (food names, meal types, calories, protein and fibre). No photos, private notes or measurements are sent.':'No tracker data is sent unless checked.'});
$('rc4-clear').onclick=()=>{if(!confirm('Clear AI conversation history stored on this device?'))return;messages=[];persist();reloadChat();};
// Do not replace the Discover tab with AI Coach; the app already links to #coach.
// Existing ReComp code already provides handlers for send, enter and suggested questions via ask().
reloadChat();}
async function ask(question){const input=$('cq'),err=$('cerr'),send=$('csend');if(busy)return;const q=String(question||'').trim();if(!q)return;if(q.length>1800){err.textContent='Please keep the question under 1,800 characters.';return;}
const endpoint=$('rc4-endpoint').value.trim().replace(/\/$/,'');const token=accessToken||$('rc4-token').value.trim()||savedToken();
if(!/^https:\/\/[a-zA-Z0-9.-]+(?:\:[0-9]+)?(?:\/[a-zA-Z0-9/_-]*)?$/.test(endpoint)){err.textContent='Enter the HTTPS Cloudflare Worker URL first.';return;}
if(token.length<16){err.textContent='Enter your private access token (at least 16 characters).';return;}
err.textContent='';input.value='';busy=true;send.disabled=true;
const old=messages.slice(-10);bubble('user',q);const thinking=bubble('model','Thinking…');
try{
 const body={messages:[...old,{role:'user',text:q}]};if($('rc4-share').checked)body.tracker=shortSummary();
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),30000);
 let response;try{response=await fetch(endpoint+'/chat',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(body),signal:ctrl.signal,cache:'no-store'});}finally{clearTimeout(timer)}
 const result=await response.json().catch(()=>({}));if(!response.ok)throw Error(result.error||'Request failed (HTTP '+response.status+')');if(typeof result.reply!=='string'||!result.reply.trim())throw Error('AI returned an empty answer');
 thinking.textContent=result.reply;messages.push({role:'user',text:q},{role:'model',text:result.reply});messages=messages.slice(-20);persist();
}catch(e){thinking.remove();err.textContent=e.name==='AbortError'?'Connection timed out. Try again.':(e.message||'Connection failed.');}
finally{busy=false;send.disabled=false;input.focus();}}
window.ReCompAI={ask};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
