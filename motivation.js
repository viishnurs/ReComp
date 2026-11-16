/* ReComp v5 motivation layer: UI-only additive code, no data migration */
(()=>{'use strict';
 const bridge=window.ReCompBridge;if(!bridge)return;
 const grid=document.getElementById('content');if(!grid)return;
 const wrap=document.createElement('section');wrap.id='rc5-home';wrap.setAttribute('data-pg','home');wrap.className='c12';grid.insertBefore(wrap,grid.firstChild);
 const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=x=>Number.isFinite(Number(x))?Number(x):0;
 const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const today=()=>new Date();
 function hasRecord(S,k){return (Array.isArray(S.days?.[k])&&S.days[k].length>0)||(num(S.water?.[k])>0)||(num(S.steps?.[k])>0)||(Array.isArray(S.workouts?.[k])&&S.workouts[k].length>0)||(S.weights?.[k]!=null&&S.weights[k]!=='')}
 function draw(){
  let S=bridge.getState();if(!S)return;const d=today(),k=iso(d),food=Array.isArray(S.days?.[k])?S.days[k]:[],targets=bridge.targets(),tot=bridge.totals(k),protein=num(tot.protein),calories=num(tot.kcal),pTarget=Math.max(1,num(targets.pro)),cTarget=Math.max(1,num(targets.kcal));
  const water=num(S.water?.[k]),steps=num(S.steps?.[k]),waterGoal=3000,stepGoal=Math.max(1,num(S.profile?.stepGoal)||8000);
  const acts=[food.length>0,protein>=pTarget*.8,water>=waterGoal*.7,steps>=stepGoal*.7,(S.workouts?.[k]||[]).length>0];const completed=acts.filter(Boolean).length;
  // This score rewards logging and small repeatable actions, not calorie restriction.
  const score=Math.round(completed/acts.length*100),ring=2*Math.PI*42;
  const first=(S.profile?.name||'').trim().split(/\s+/)[0];const greeting=d.getHours()<12?'Good morning':d.getHours()<17?'Good afternoon':'Good evening';
  const messages=completed===0?['A fresh start looks good on you.','One small action counts. You do not need a perfect day.']:completed<=2?['You have started. Keep going.','Consistency grows one choice at a time.']:completed<=4?['You’re building momentum.','Keep it sustainable. Progress is not perfection.']:['You showed up for yourself!','Celebrate consistency and give yourself time to recover.'];
  let week='';for(let i=6;i>=0;i--){let x=new Date(d.getFullYear(),d.getMonth(),d.getDate()-i),z=iso(x),on=hasRecord(S,z);week+=`<div class="rc5-day ${on?'done':''} ${i===0?'today':''}"><span>${x.toLocaleDateString(undefined,{weekday:'short'}).slice(0,2)}</span><div class="rc5-dot" aria-label="${esc(z)}: ${on?'activity recorded':'no activity recorded'}">${on?'✓':'·'}</div></div>`}
  wrap.innerHTML=`<div class="rc5-hero">
  <div class="rc5-top"><span class="rc5-eyebrow">✦ YOUR DAILY RESET</span><span class="rc5-date">${esc(d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}))}</span></div>
  <h2>${esc(greeting)}${first?', '+esc(first):''}.<br>${esc(messages[0])}</h2><p class="rc5-lead">${esc(messages[1])}</p>
  <div class="rc5-score"><div class="rc5-ring"><svg width="108" height="108" viewBox="0 0 108 108" aria-hidden="true"><circle cx="54" cy="54" r="42" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="10"/><circle cx="54" cy="54" r="42" fill="none" stroke="#98e5c2" stroke-width="10" stroke-linecap="round" stroke-dasharray="${ring.toFixed(2)}" stroke-dashoffset="${(ring*(1-score/100)).toFixed(2)}"/></svg><strong>${score}%</strong><small>momentum</small></div><div class="rc5-score-copy"><b>${completed} of 5 daily actions</b><p>Track food, protein, water, steps and movement — your pace, your progress.</p><p class="rc5-positive">✦ Every effort matters</p></div></div>
  <div class="rc5-actions"><a class="rc5-primary" href="#nutrition">＋ Log a meal</a><a class="rc5-secondary" href="#coach">✧ Ask AI Coach</a></div></div>
  <div class="rc5-card"><div class="rc5-cardhead"><h3>Your consistency</h3><span>Last 7 days</span></div><div class="rc5-days">${week}</div><p class="rc5-soft">A quiet day is not a setback. Resume whenever you're ready.</p></div>
  <div class="rc5-card"><div class="rc5-cardhead"><h3>Fuel your progress</h3><span>Today</span></div><div class="rc5-metrics"><div class="rc5-metric"><label>Energy logged</label><strong>${Math.round(calories).toLocaleString()}</strong><small>of ${Math.round(cTarget).toLocaleString()} kcal target</small><div class="rc5-track"><i style="width:${Math.min(100,calories/cTarget*100)}%"></i></div></div><div class="rc5-metric"><label>Protein logged</label><strong>${Math.round(protein)} g</strong><small>of ${Math.round(pTarget)} g target</small><div class="rc5-track"><i style="width:${Math.min(100,protein/pTarget*100)}%"></i></div></div></div><div class="rc5-anchor"><small>Based on foods you've entered</small><a href="#nutrition">View nutrition →</a></div></div>`;
 }
 function visibility(){const home=(location.hash.replace('#','')||'home')==='home'&&!document.body.classList.contains('mini');wrap.classList.toggle('rc5-on',home)}
 window.addEventListener('recomp:render',()=>{draw();visibility()});window.addEventListener('hashchange',visibility);document.addEventListener('click',e=>{if(e.target.closest('#side .nv'))requestAnimationFrame(visibility)});
 draw();visibility();
})();
