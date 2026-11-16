/* ReComp v11: AI nutrition estimate, explicit user review, existing state-compatible save. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const fields=[['kcal','Calories','kcal'],['protein','Protein','g'],['carbs','Carbs','g'],['fat','Fat','g'],['fiber','Fibre','g'],['sugar','Sugar','g'],['sodium','Sodium','mg'],['potassium','Potassium','mg'],['calcium','Calcium','mg'],['iron','Iron','mg'],['magnesium','Magnesium','mg'],['zinc','Zinc','mg'],['vitA','Vitamin A','µg'],['vitC','Vitamin C','mg'],['vitD','Vitamin D','µg'],['b12','Vitamin B12','µg'],['folate','Folate','µg']];
let busy=false,proposal=null;
const safeValue=(n)=>{const v=Number(n);return Number.isFinite(v)&&v>=0&&v<1000000?v:null;};
const create=(tag,cls,txt)=>{let e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
function configuration(){let endpoint=($('rc4-endpoint')?.value||'').trim().replace(/\/+$/,'');if(!endpoint)try{endpoint=localStorage.getItem('recomp-ai-endpoint-v1')||'';}catch{}
const token=(window.ReCompAIConfig?.getToken()||'').trim();
if(!/^https:\/\/[a-zA-Z0-9.-]+(?::\d+)?(?:\/[a-zA-Z0-9/_-]*)?$/.test(endpoint))throw Error('Set your Cloudflare Worker URL in AI Coach first.');
if(token.length<16)throw Error('Open AI Coach and save your private access token first.');
return {endpoint,token};}
function renderEstimate(raw){
 proposal=raw;
 const container=$('res');container.replaceChildren();
 const card=create('div','res rc11-review');
 card.appendChild(create('h3','', 'Review AI nutrition estimate'));
 card.appendChild(create('p','sub','Values are estimates for the entire stated serving. Check ingredients and portion size before logging.'));
 const nameGroup=create('div','rc11-name');nameGroup.appendChild(create('label','','Food description'));
 const name=create('input');name.type='text';name.maxLength=170;name.value=String(raw.name||'');name.id='rc11-name';nameGroup.appendChild(name);card.appendChild(nameGroup);
 const note=create('p','sub rc11-note',String(raw.note||''));card.appendChild(note);
 const grid=create('div','rc11-grid');
 fields.forEach(([key,label,unit])=>{const cell=create('div','rc11-field');const lab=create('label','',label+' ('+unit+')');lab.htmlFor='rc11-'+key;const input=create('input');input.id='rc11-'+key;input.type='number';input.step='any';input.min='0';input.max='999999';input.inputMode='decimal';input.value=String(raw[key]??0);cell.append(lab,input);grid.appendChild(cell);});card.appendChild(grid);
 const actions=create('div','two');const discard=create('button','btn','Discard');discard.type='button';const confirm=create('button','btn pri','Confirm & Log Food');confirm.type='button';actions.append(discard,confirm);card.appendChild(actions);container.appendChild(card);
 discard.onclick=()=>{proposal=null;container.replaceChildren();};
 confirm.onclick=()=>{
  const nameText=name.value.trim();if(!nameText){$('err').textContent='Enter a food description.';name.focus();return;}
  const entry={name:nameText,meal:$('meal').value};
  for(const [k] of fields){const inp=$('rc11-'+k);const val=safeValue(inp.value);if(inp.value.trim()===''||val===null){$('err').textContent='Enter a valid '+k+' value.';inp.focus();return;}entry[k]=val;}
  const B=window.ReCompBridge;if(!B||typeof B.addEntry!=='function'){$('err').textContent='The food tracker is not ready. Reload the app.';return;}
  confirm.disabled=true;B.addEntry(entry);if(window.recompStorageError){$('err').textContent='Food was added in memory, but this device could not save it. Export a backup.';return;}
  B.toast('Logged: '+nameText.slice(0,40));proposal=null;container.replaceChildren();$('err').textContent='';$('food').value='';$('qty').value='';
 };
}
async function calculate(){if(busy)return;
 const name=$('food').value.trim(),quantity=$('qty').value.trim()||'1 standard serving';$('err').textContent='';
 if(!name){$('err').textContent='Enter a food name.';$('food').focus();return;}
 let cfg;try{cfg=configuration();}catch(e){$('err').textContent=e.message;return;}
 const btn=$('go');busy=true;btn.disabled=true;btn.textContent='Estimating with AI…';proposal=null;$('res').replaceChildren();
 try{const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),40000);let res;try{res=await fetch(cfg.endpoint+'/food',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+cfg.token},body:JSON.stringify({food:name,quantity}),cache:'no-store',signal:ctrl.signal});}finally{clearTimeout(timer)}
  const data=await res.json().catch(()=>({}));if(!res.ok||!data.estimate)throw Error(data.error||'AI estimate failed (HTTP '+res.status+')');
  renderEstimate(data.estimate);
 }catch(e){$('err').textContent=e.name==='AbortError'?'AI estimate timed out. Try again.':(e.message||'AI estimate failed.');}
 finally{busy=false;btn.disabled=false;btn.textContent='Calculate with AI';}
}
function setup(){const go=$('go');if(!go||!$('res'))return;go.textContent='Calculate with AI';
 const hint=create('p','sub rc11-hint','AI estimates the entered quantity. Review and edit the nutrition table before you confirm. Requires Gemini/Cloudflare AI Coach configuration.');go.parentNode.insertAdjacentElement('afterend',hint);
 // Capture before the original Claude-only click/Enter handler. No existing logs are modified.
 go.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();calculate();},true);
 ['food','qty'].forEach(id=>$(id).addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();calculate();}},true));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
