/* ReComp v8: restore motivational Home without theme dependencies or duplicated nutrition cards. */
(()=>{'use strict';
const bridge=window.ReCompBridge,grid=document.getElementById('content');if(!bridge||!grid)return;
const names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nm=v=>Number.isFinite(Number(v))?Number(v):0;
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dayData=(s,k)=>({foods:Array.isArray(s.days?.[k])?s.days[k]:[],workouts:Array.isArray(s.workouts?.[k])?s.workouts[k]:[],water:nm(s.water?.[k]),steps:nm(s.steps?.[k])});
const hasLog=(s,k)=>{const z=dayData(s,k);return Boolean(z.foods.length||z.workouts.length||z.water||z.steps||s.weights?.[k]!=null&&s.weights[k]!=='')};
// Appearance colors are controlled by the original ReComp Settings screen.
// No legacy Signature themes are loaded or applied here.
const home=document.createElement('section');home.id='rc6-home';home.setAttribute('data-pg','home');grid.insertBefore(home,grid.firstChild);
const weekPanel=document.createElement('section');weekPanel.id='rc9-week';weekPanel.className='win c12 rc9-widget';weekPanel.setAttribute('data-pg','home');grid.insertBefore(weekPanel,document.getElementById('k-wt'));
const foodPanel=document.createElement('section');foodPanel.id='rc9-meal';foodPanel.className='win c12 rc9-widget';foodPanel.setAttribute('data-pg','home');grid.insertBefore(foodPanel,document.getElementById('k-lvl'));
function weekDays(s,d){const start=new Date(d.getFullYear(),d.getMonth(),d.getDate()-d.getDay(),12),today=dateKey(new Date());return Array.from({length:7},(_,i)=>{const x=new Date(start);x.setDate(start.getDate()+i);const k=dateKey(x);return {label:names[i].slice(0,3),k,on:hasLog(s,k),today:k===today,future:k>today}})}
function weekHTML(s,d){return `<div class="rc6-week" aria-label="Current week Sunday to Saturday">${weekDays(s,d).map(x=>`<div class="rc6-week-day ${x.on?'has':''} ${x.today?'today':''} ${x.future?'future':''}" title="${esc(x.k)}"><span>${x.label}</span><div class="bubble">${x.on?'✓':x.future?'·':new Date(x.k+'T12:00:00').getDate()}</div></div>`).join('')}</div>`}
function completed(s,d){return weekDays(s,d).filter(x=>x.on&&!x.future).length}
function draw(){const s=bridge.getState();if(!s)return;const now=new Date(),k=dateKey(now),z=dayData(s,k),t=bridge.targets(),tot=bridge.totals(k),prot=nm(tot.protein),cal=nm(tot.kcal),tgP=Math.max(1,nm(t.pro)),tgC=Math.max(1,nm(t.kcal)),waterGoal=Math.max(1,nm(s.profile?.waterGoal)||2500),stepGoal=Math.max(1,nm(s.profile?.stepGoal)||8000);
const actions=[z.foods.length>0,prot>=tgP*.8,z.water>=waterGoal*.7,z.steps>=stepGoal*.7,z.workouts.length>0],count=actions.filter(Boolean).length,percent=count/5*100,r=2*Math.PI*43;
const first=String(s.profile?.name||'').trim().split(/\s+/)[0],morning=now.getHours()<12?'Good morning':now.getHours()<17?'Good afternoon':'Good evening';
const line=count===0?'You can begin right here.':count<3?'The little things are adding up.':count<5?'Look at the momentum you’re building.':'You made time for yourself today.';
const w=completed(s,now);
const todayLabel=now.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
home.innerHTML=`<div class="rc6-hero"><div class="rc6-headrow"><span class="rc6-eyebrow">✦ RECOMP / DAILY GROWTH</span></div><h2>${esc(morning)}${first?', '+esc(first):''}.<br>${esc(line)}</h2><p>Build the habits that help you feel strong, energized and confident. Progress doesn't need a perfect streak.</p><div class="rc6-hero-core"><div class="rc6-ring"><svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="43" stroke="rgba(255,255,255,.19)" stroke-width="10" fill="none"/><circle cx="55" cy="55" r="43" stroke="var(--e-accent2)" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="${r}" stroke-dashoffset="${r*(1-percent/100)}"/></svg><strong>${Math.round(percent)}%</strong><small>momentum</small></div><div class="rc6-ring-description"><b>${count} / 5 daily actions</b><p>Food, protein, hydration, steps and movement.</p><em>✦ Showing up is worth celebrating</em></div></div><div class="rc6-ctas"><a href="#nutrition">＋ Log a meal</a><a href="#coach">✧ Ask AI Coach</a></div></div>
`;
weekPanel.innerHTML=`<div class="rc6-panel-head"><div><h3>Your week in motion</h3><div class="rc6-subtitle">Sunday → Saturday · ${w} day${w===1?'':'s'} recorded</div></div><span class="rc9-mark" aria-hidden="true">✦</span></div>${weekHTML(s,now)}<p class="rc6-note">Each marked day has at least one logged activity. Your routine can be flexible.</p>`;
const ideas=[{name:'Moong dal chilla with curd',detail:'A savory breakfast or light meal; add curd for extra protein.'},{name:'Paneer or tofu bhurji with roti',detail:'An easy protein-centered Indian meal with vegetables.'},{name:'Dal, rice and a vegetable sabzi',detail:'A familiar balanced plate; adjust portions to your appetite.'},{name:'Chana salad with vegetables',detail:'A convenient meal or snack with fiber and plant protein.'}];
const idea=ideas[(now.getDay()+Math.floor(now.getDate()/7))%ideas.length];
const logged=z.foods.length>0;
foodPanel.innerHTML=`<div class="rc6-panel-head"><div><h3>Your next meal, made easier</h3><div class="rc6-subtitle">Practical food inspiration without another tracking card</div></div><span class="rc9-mark" aria-hidden="true">✧</span></div><div class="rc9-meal-content"><div class="rc9-food-icon" aria-hidden="true">✳</div><div><strong>${idea.name}</strong><p>${idea.detail}</p></div></div><div class="rc9-meal-bottom"><span>${logged?'You have meals recorded today. Keep choosing what works for you.':'A simple meal idea can make the next decision easier.'}</span><a href="#nutrition">Open food log <span aria-hidden="true">→</span></a></div>`;
visible();}
function visible(){const on=(location.hash.slice(1)||'home')==='home'&&!document.body.classList.contains('mini');[home,weekPanel,foodPanel].forEach(el=>el.classList.toggle('rc6-visible',on))}
window.addEventListener('recomp:render',draw);window.addEventListener('hashchange',visible);draw();
})();
