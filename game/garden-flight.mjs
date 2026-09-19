import {createGardenRenderer} from './garden-flight-renderer.mjs';
import {createGardenMission,GardenPad,gardenExercisesForChapter} from './garden-harmony.mjs';
import {GardenSequenceStudio} from './garden-sequence-studio.mjs';
const $=id=>document.getElementById(id),world=$('world'),life=$('life'),ctx=life.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const STATES=[
  {name:'Синие сады',note:'Цветущие острова и прозрачные русла',file:'blue-gardens'},
  {name:'Ночное цветение',note:'Светящиеся мембраны, грибы и цветы',file:'night-bloom'},
  {name:'Белая оттепель',note:'Жизнь пробуждается под фарфоровым льдом',file:'white-thaw'},
  {name:'Янтарные фьорды',note:'Тёплые террасы над бирюзовой водой',file:'amber-fjords'}
];
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),mod=(x,n)=>(x%n+n)%n;
const s={ready:false,from:0,to:0,transition:1,pending:null,ship:0,time:0,travel:0,scroll:0,pan:0,night:0,lightMode:'day',cycle:0,lantern:true,paused:reduced,speed:.6,altitude:.8,wander:false,visit:0,clean:false,angle:0,x:0,y:0,width:1,height:1,worldSize:1};
let renderer,images,last=0,raf=0,dpr=1,dragId=null,tx=.5,ty=.56,keys=new Set(),loaded=0;
const pad=new GardenPad();
let mission,studio,lastMissionPosition='';
const DEGREE_NAMES=['I','♭II','II','♭III','III','IV','♯IV','V','♭VI','VI','♭VII','VII'];
const exerciseCode=(exercise,index)=>{const match=String(exercise.name||exercise.id).match(/(?:Fig\.?|fig-)[ -]?(?:1[.\-])?(\d+)/i);return `${String(index+1).padStart(2,'0')}F${String(match?.[1]??index+1).padStart(2,'0')}`;};
// Particles are reused and time/scroll wrap; neither grows with flight duration.
const motes=Array.from({length:56},(_,i)=>({x:mod(Math.sin(i*127.13+14)*43758.54,1),y:mod(Math.sin(i*71.72+8)*31341.4,1),r:.5+(i%5)*.23,phase:i*2.399}));
function resize(){
  s.width=innerWidth;s.height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);
  for(const canvas of [world,life]){canvas.width=Math.round(s.width*dpr);canvas.height=Math.round(s.height*dpr);}
  s.worldSize=Math.max(s.width*.86,s.height*.95)/s.altitude;
  s.x=tx*s.width;s.y=ty*s.height;
}
resize();addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);
function ui(){
  const active=s.pending??s.to,item=STATES[active];
  $('state-title').textContent=item.name;$('state-note').textContent=item.note;
  $('state-number').textContent=`0${active+1} / 04 · СОСТОЯНИЕ ПЛАНЕТЫ`;
  for(const b of document.querySelectorAll('[data-state]')){const selected=Number(b.dataset.state)===active;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}
  for(const [attribute,value] of [['ship',s.ship],['light',s.lightMode]])for(const b of document.querySelectorAll(`[data-${attribute}]`)){const selected=String(b.dataset[attribute])===String(value);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}
  $('pause').setAttribute('aria-pressed',String(s.paused));$('pause').innerHTML=s.paused?'▶ <span>Лететь</span>':'Ⅱ <span>Пауза</span>';
  $('lantern').setAttribute('aria-pressed',String(s.lantern));$('lantern').disabled=s.ship===2;
  $('flight-status').textContent=s.paused?'Полёт на паузе':s.transition<1?'Переходим в новое состояние':s.night>.6?(s.lantern&&s.ship!==2?'Ночь · свет ведёт нас':'Ночь · естественное свечение'):'Свободный полёт';
}
function renderMission(model){
  lastMissionPosition=`${model.round}:${model.cursor}`;
  const progress=model.progress??model.parts??model.exercise.sequence.map((_,index)=>({degree:model.solved.includes(index),quality:model.solved.includes(index)}));
  const solved=new Set(model.solved),total=model.exercise.sequence.length,solvedParts=model.solvedParts??progress.reduce((sum,part)=>sum+Number(part.degree)+Number(part.quality),0),percent=Math.round(solvedParts/(total*2)*100);
  const exerciseIndex=Math.max(0,gardenExercisesForChapter(1).findIndex(item=>item.id===model.exercise.id));
  $('mission-code').textContent=exerciseCode(model.exercise,exerciseIndex);$('mission-source').textContent=model.exercise.source;
  $('route-progress').textContent=`${solvedParts} / ${total*2}`;$('completion-number').textContent=String(percent);$('round-number').textContent=String(model.round).padStart(2,'0');
  $('chord-route').replaceChildren(...progress.map((part,index)=>{
    const li=document.createElement('li'),current=model.running&&index===model.cursor;
    li.className=`chord-slot${part.degree&&part.quality?' solved':''}${current?' current':''}`;
    li.setAttribute('aria-label',`Позиция ${index+1}: ступень ${part.degree?'найдена':'не найдена'}, тип ${part.quality?'найден':'не найден'}`);
    li.innerHTML=`<span class="route-node" aria-hidden="true"><i class="node-degree${part.degree?' found':''}"></i><i class="node-quality${part.quality?' found':''}"></i></span>`;return li;
  }));
  const currentParts=model.currentParts??(model.cursor>=0?progress[model.cursor]:{degree:true,quality:true});
  const mayAnswer=model.running&&model.cursor>=0&&!solved.has(model.cursor),qualities=[...new Set(model.choices.map(chord=>chord.quality))];
  $('degree-options').replaceChildren(...DEGREE_NAMES.map((name,offset)=>{const button=document.createElement('button');const locked=mayAnswer&&currentParts.degree&&Number(model.current.offset)===offset;button.className=`degree-option${locked?' selected locked':''}`;button.textContent=name;button.dataset.degree=String(offset);button.disabled=!mayAnswer||currentParts.degree;button.addEventListener('click',()=>mission.answerPart('degree',offset));return button;}));
  $('quality-options').replaceChildren(...qualities.map(quality=>{const button=document.createElement('button');const locked=mayAnswer&&currentParts.quality&&model.current.quality===quality;button.className=`quality-option${locked?' selected locked':''}`;button.textContent=quality==='maj'?'maj':quality;button.dataset.quality=quality;button.disabled=!mayAnswer||currentParts.quality;button.addEventListener('click',()=>mission.answerPart('quality',quality));return button;}));
  $('answer-feedback').textContent=model.complete?'Маршрут собран. Последовательность распознана.':model.feedback||(mayAnswer?'Ступень и тип фиксируются независимо':model.running&&model.cursor<0?'Слушаем базу':model.running?'Обе части этой позиции уже найдены':'Запусти последовательность');
  $('mission-prompt').textContent=model.complete?`Все ${total} сигналов встроены в маршрут.`:model.running?(model.cursor<0?'База I6. Клавиши остаются доступны для размышления.':solved.has(model.cursor)?'Позиция заполнена — слушаем контекст.':currentParts.degree?'Ступень есть. Найди тип аккорда.':currentParts.quality?'Тип есть. Найди ступень.':'Определи две части текущего аккорда.'):'База известна. Запусти последовательность.';
  $('mission-toggle').textContent=model.running?'Ⅱ Остановить':'▶ Запустить полёт';$('mission-restart').hidden=!model.complete;
  if(model.complete){s.paused=true;pad.stop();ui();}
}
function bindMission(exercise){mission?.pause();pad.stop();lastMissionPosition='';mission=createGardenMission({exercise,onChange:renderMission,onChord:(chord,model)=>pad.play(chord,model.exercise.baseTonic??5).catch(error=>{$('answer-feedback').textContent=error.message;})});renderMission(mission.snapshot());}
bindMission();
studio=new GardenSequenceStudio({onUse:route=>{bindMission(route);$('answer-feedback').textContent=`Маршрут «${route.name}» загружен`;}});
const chapterOne=gardenExercisesForChapter(1);$('exercise-select').replaceChildren(...chapterOne.map((exercise,index)=>{const option=document.createElement('option');option.value=exercise.id;option.textContent=exerciseCode(exercise,index);return option;}));
$('exercise-select').addEventListener('change',event=>bindMission(chapterOne.find(exercise=>exercise.id===event.target.value)));
function chooseState(index){
  index=clamp(Math.trunc(index),0,3);s.visit=0;
  if(s.paused||reduced){s.from=s.to=index;s.transition=1;s.pending=null;}
  else if(s.transition<1){s.pending=index===s.to?null:index;}
  else if(index!==s.to){s.from=s.to;s.to=index;s.transition=0;s.pending=null;}
  ui();
}
function pause(){s.paused=!s.paused;keys.clear();ui();}
function clean(value){s.clean=value;document.body.classList.toggle('clean',value);$('restore').hidden=!value;(value?$('restore'):$('clean')).focus();}
function light(mode){s.lightMode=mode;if(mode==='cycle')s.cycle=Math.acos(clamp(1-2*s.night,-1,1))*180/Math.PI;if(s.paused||reduced)s.night=mode==='night'?1:mode==='dusk'?.48:mode==='day'?0:s.night;ui();}
for(const b of document.querySelectorAll('[data-state]'))b.addEventListener('click',()=>chooseState(Number(b.dataset.state)));
for(const b of document.querySelectorAll('[data-ship]'))b.addEventListener('click',()=>{s.ship=Number(b.dataset.ship);ui();});
for(const b of document.querySelectorAll('[data-light]'))b.addEventListener('click',()=>light(b.dataset.light));
$('pause').addEventListener('click',pause);$('lantern').addEventListener('click',()=>{s.lantern=!s.lantern;ui();});
$('clean').addEventListener('click',()=>clean(true));$('restore').addEventListener('click',()=>clean(false));
$('world-controls').addEventListener('click',()=>{const open=document.body.classList.toggle('world-open');$('world-controls').setAttribute('aria-expanded',String(open));$('world-controls').textContent=open?'Закрыть мир':'Мир';});
$('library-open').addEventListener('click',()=>studio.open());$('studio-close').addEventListener('click',()=>studio.close());$('studio-capture').addEventListener('click',()=>studio.toggleCapture());$('studio-save').addEventListener('click',()=>studio.save());
$('mission-toggle').addEventListener('click',async()=>{const model=mission.snapshot();if(model.running){mission.pause();pad.stop();return;}try{await pad.unlock();if(s.paused)s.paused=false;mission.start();ui();}catch(error){$('answer-feedback').textContent=error.message;}});
$('mission-restart').addEventListener('click',()=>{mission.restart();s.paused=false;ui();});
for(const button of document.querySelectorAll('[data-pad]'))button.addEventListener('click',()=>{pad.applyPreset(button.dataset.pad);for(const item of document.querySelectorAll('[data-pad]'))item.setAttribute('aria-pressed',String(item===button));});
$('settings').addEventListener('click',()=>{const open=$('settings-panel').hidden;$('settings-panel').hidden=!open;$('settings').setAttribute('aria-expanded',String(open));});
$('speed').addEventListener('input',e=>{s.speed=Number(e.target.value);$('speed-value').value=s.speed.toFixed(1)+'×';});
$('altitude').addEventListener('input',e=>{s.altitude=Number(e.target.value);$('altitude-value').value=s.altitude.toFixed(2);s.worldSize=Math.max(s.width*.86,s.height*.95)/s.altitude;});
$('wander').addEventListener('change',e=>{s.wander=e.target.checked;s.visit=0;});
function move(x,y){tx=clamp(x/s.width,.1,.9);ty=clamp(y/s.height,.2,.78);$('gesture').classList.add('dismissed');}
world.addEventListener('pointerdown',e=>{if(e.button!==0||dragId!==null)return;dragId=e.pointerId;world.setPointerCapture(dragId);move(e.clientX,e.clientY);world.focus({preventScroll:true});});
world.addEventListener('pointermove',e=>{if(e.pointerId===dragId)move(e.clientX,e.clientY);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])world.addEventListener(name,e=>{if(e.pointerId===dragId)dragId=null;});
addEventListener('keydown',e=>{
  if(['INPUT','BUTTON','SELECT','TEXTAREA','A'].includes(e.target.tagName)||e.repeat&&['Space','KeyH'].includes(e.code))return;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){e.preventDefault();keys.add(e.code);$('gesture').classList.add('dismissed');}
  if(e.code==='Space'){e.preventDefault();pause();}if(e.code==='KeyH')clean(!s.clean);if(e.code==='Escape'&&s.clean)clean(false);
});
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();dragId=null;});
document.addEventListener('visibilitychange',()=>{last=0;keys.clear();if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(!raf)raf=requestAnimationFrame(frame);});
function update(dt){
  if(s.paused)return;
  s.time=mod(s.time+dt,Math.PI*2000);s.visit+=dt;
  s.travel=mod(s.travel+dt*s.speed*18,100000);
  s.scroll=mod(s.scroll+dt*s.speed*18/s.worldSize,2);
  if(s.transition<1){s.transition=Math.min(1,s.transition+dt/7);if(s.transition===1){s.from=s.to;if(s.pending!==null){const next=s.pending;s.pending=null;chooseState(next);}}}
  if(s.wander&&s.visit>38&&s.transition===1){const next=(s.to+1+Math.floor(Math.random()*3))%4;chooseState(next);}
  if(s.lightMode==='cycle')s.cycle=mod(s.cycle+dt*2,360);
  const target=s.lightMode==='day'?0:s.lightMode==='dusk'?.48:s.lightMode==='night'?1:(1-Math.cos(s.cycle*Math.PI/180))/2;
  s.night+=(target-s.night)*(1-Math.exp(-dt*.9));
  tx=clamp(tx+((keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0))*dt*.28,.1,.9);
  ty=clamp(ty+((keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0))*dt*.22,.2,.78);
  const dx=tx*s.width-s.x;s.x+=dx*(1-Math.exp(-dt*5));s.y+=(ty*s.height-s.y)*(1-Math.exp(-dt*5));
  s.angle+=(clamp(dx/s.width,-.3,.3)-s.angle)*(1-Math.exp(-dt*4));
  s.pan+=((s.x/s.width-.5)*.13-s.pan)*(1-Math.exp(-dt));
}
function atmosphere(){
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,s.width,s.height);
  const brightness=.05+s.night*.7+(s.to===1?.15:0);
  ctx.globalCompositeOperation='lighter';
  for(const p of motes){
    const x=mod(p.x*s.width+Math.sin(s.time*.27+p.phase)*15-s.pan*s.worldSize,s.width);
    const y=mod(p.y*s.height+s.scroll*s.worldSize+Math.cos(s.time*.17+p.phase)*8,s.height);
    const pulse=.42+.58*Math.sin(s.time*1.7+p.phase)**2;
    const alpha=brightness*pulse;
    ctx.fillStyle=`rgba(139,248,178,${alpha*.05})`;ctx.beginPath();ctx.arc(x,y,p.r*7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=`rgba(160,255,188,${alpha*.16})`;ctx.beginPath();ctx.arc(x,y,p.r*3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=`rgba(229,255,182,${alpha})`;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
  }
  ctx.globalCompositeOperation='source-over';
}
let uiTick=0;
function frame(now){
  raf=0;if(document.hidden)return;
  const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  if(s.ready){update(dt);renderer.render({...s,lantern:s.lantern&&s.ship!==2});atmosphere();if(now-uiTick>200){ui();const model=mission.snapshot();$('bar-countdown').textContent=model.running?`${Math.max(0,(model.deadline-performance.now())/1000).toFixed(1)} сек`:`${model.barSeconds.toFixed(1)} сек`;uiTick=now;}}
  raf=requestAnimationFrame(frame);
}
async function load(){
  const paths=[...STATES.map(x=>x.file),'manta','lotus'];
  images=await Promise.all(paths.map(file=>new Promise((resolve,reject)=>{
    const img=new Image();img.onload=()=>{$('load-progress').textContent=`Готово ${++loaded} из ${paths.length}`;resolve(img);};img.onerror=()=>reject(Error(`Не загрузился пейзаж: ${file}. Проверь соединение и попробуй снова.`));img.src=window.GARDEN_ASSETS?.[file]||`assets/echo-garden/${file}.webp`;
  })));
  renderer=createGardenRenderer(world,images);s.ready=true;$('loading').hidden=true;
  const params=new URLSearchParams(location.search);
  const index=Number(params.get('state'));if(Number.isInteger(index)&&index>=0&&index<4)s.from=s.to=index;
  if(['day','dusk','night','cycle'].includes(params.get('light'))){light(params.get('light'));s.night=params.get('light')==='night'?1:params.get('light')==='dusk'?.48:0;}
  if(params.get('ship')==='lotus')s.ship=1;if(params.get('still')==='1')s.paused=true;
  ui();if(!raf)raf=requestAnimationFrame(frame);
}
function error(e){s.ready=false;$('loading').hidden=false;$('load-progress').textContent=e.message;$('retry').hidden=false;}
$('retry').addEventListener('click',()=>location.reload());
world.addEventListener('webglcontextlost',e=>{e.preventDefault();s.ready=false;last=0;$('loading').hidden=false;$('load-progress').textContent='Восстанавливаем изображение…';});
world.addEventListener('webglcontextrestored',()=>{try{renderer=createGardenRenderer(world,images);s.ready=true;last=0;$('loading').hidden=true;}catch(e){error(e);}});
window.gardenFlight=Object.freeze({snapshot:()=>({...s,keys:keys.size,particles:motes.length,graphics:renderer?.diagnostics(),mission:mission.snapshot()}),advanceChord:()=>mission.advance()});
ui();load().catch(error);
