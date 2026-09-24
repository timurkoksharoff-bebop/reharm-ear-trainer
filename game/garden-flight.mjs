import {createGardenRenderer} from './garden-flight-renderer.mjs';
import {createGardenMission,GardenPad,gardenExercisesForChapter} from './garden-harmony.mjs';
import {GardenSequenceStudio} from './garden-sequence-studio.mjs';
import {createGardenLife,GARDEN_RESOURCES,GARDEN_ITEMS} from './garden-life.mjs';
const $=id=>document.getElementById(id),world=$('world'),life=$('life'),shipLayer=$('ship-layer'),ctx=life.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const STATES=[
  {name:'Синие сады',note:'Цветущие острова и прозрачные русла',file:'blue-gardens'},
  {name:'Ночное цветение',note:'Светящиеся мембраны прорастают на той же карте',file:'night-bloom-aligned'},
  {name:'Белая оттепель',note:'Тонкий минеральный иней растёт вдоль прежних берегов',file:'white-thaw-aligned'},
  {name:'Янтарное созревание',note:'Тёплая растительность проступает сквозь знакомый рельеф',file:'blue-gardens'}
];
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),mod=(x,n)=>(x%n+n)%n;
const s={ready:false,from:0,to:0,transition:1,pending:null,growth:0,ship:1,time:0,travel:0,scroll:0,pan:0,night:0,lightMode:'cycle',cycle:0,lantern:true,paused:reduced,speed:2,altitude:1.25,visit:0,clean:false,angle:0,motionX:0,motionY:0,thrust:.45,brake:0,x:0,y:0,width:1,height:1,worldSize:1,tour:'reharm',chapter:1,mode:'quest',gameOver:false};
let renderer,images,last=0,raf=0,dpr=1,dragId=null,tx=.5,ty=.56,keys=new Set(),loaded=0;
const pad=new GardenPad();
const gardenLife=createGardenLife();
let mission,studio,currentRoute,lastMissionPosition='',lastLifeEvent=0,studioPauseState=false,queuedStudioRoute=null,completionHandled=false;
const PROGRESS_KEY='echo-garden-progress.v1';
const loadProgress=()=>{try{const saved=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');return {level:Math.max(1,Number(saved.level)||1),completed:Array.isArray(saved.completed)?saved.completed:[],lastRouteId:saved.lastRouteId||''};}catch{return {level:1,completed:[],lastRouteId:''};}};
const progress=loadProgress();
const saveProgress=()=>{try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));}catch{}}
const DEGREE_NAMES=['I','♭II','II','♭III','III','IV','♯IV','V','♭VI','VI','♭VII','VII'];
const exerciseCode=(exercise,index)=>{
  const id=String(exercise.id||''),idMatch=id.match(/^fig-(\d+)-(\d+)/i);
  const nameMatch=String(exercise.name||'').match(/Fig\.?\s*(\d+)[.\-](\d+)/i);
  const chapter=Number(exercise.chapter??idMatch?.[1]??nameMatch?.[1]??1);
  const figure=Number(idMatch?.[2]??nameMatch?.[2]??index+1);
  return `${String(chapter).padStart(2,'0')}F${String(figure).padStart(2,'0')}`;
};
// Particles are reused and time/scroll wrap; neither grows with flight duration.
const motes=Array.from({length:56},(_,i)=>({x:mod(Math.sin(i*127.13+14)*43758.54,1),y:mod(Math.sin(i*71.72+8)*31341.4,1),r:.5+(i%5)*.23,phase:i*2.399}));
function resize(){
  s.width=innerWidth;s.height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);
  for(const canvas of [world,life,shipLayer]){canvas.width=Math.round(s.width*dpr);canvas.height=Math.round(s.height*dpr);}
  s.worldSize=Math.max(s.width*.86,s.height*.95)/s.altitude;
  s.x=tx*s.width;s.y=ty*s.height;
}
resize();addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);
function ui(){
  const active=Math.floor(mod(s.growth,4)),item=STATES[active],progress=mod(s.growth,1);
  $('state-title').textContent=item.name;$('state-note').textContent=item.note;
  $('state-number').textContent=`ЖИВОЙ ЦИКЛ · 0${active+1} / 04`;
  $('world-cycle-name').textContent=item.name;$('world-cycle-progress').style.width=`${Math.round(progress*100)}%`;
  for(const [attribute,value] of [['ship',s.ship],['light',s.lightMode]])for(const b of document.querySelectorAll(`[data-${attribute}]`)){const selected=String(b.dataset[attribute])===String(value);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}
  $('pause').setAttribute('aria-pressed',String(s.paused));$('pause').innerHTML=s.paused?'▶ <span>Лететь</span>':'Ⅱ <span>Пауза</span>';
  $('lantern').setAttribute('aria-pressed',String(s.lantern));$('lantern').disabled=s.ship===2;
  $('flight-status').textContent=s.paused?'Полёт на паузе':s.night>.6?(s.lantern&&s.ship!==2?'Ночь · свет ведёт нас':'Ночь · естественное свечение'):s.night>.2?'Сумерки · сад продолжает расти':'День · живой цикл';
}
function renderVitals(){
  const model=gardenLife.snapshot();
  for(const [name,definition] of Object.entries(GARDEN_RESOURCES)){
    const element=document.querySelector(`.vital[data-resource="${name}"]`),value=Math.round(model.resources[name]);
    if(!element)continue;
    element.style.setProperty('--level',String(value/100));element.classList.toggle('low',value<24);
    element.setAttribute('aria-label',`${definition.label}: ${value} процентов`);$(`vital-${name}`).textContent=String(value);
  }
  const event=model.event;
  if(event&&event.id!==lastLifeEvent){
    lastLifeEvent=event.id;const element=document.querySelector(`.vital[data-resource="${event.resource}"]`);
    element?.classList.remove('changed','harmful');void element?.offsetWidth;element?.classList.add('changed');element?.classList.toggle('harmful',event.harmful);
  }
  const callout=$('vital-event');
  if(event&&model.eventAge<2.4){const item=GARDEN_ITEMS[event.kind];callout.textContent=`${event.harmful?'−':'+'} ${item?.label??event.label}`;callout.classList.toggle('harmful',event.harmful);callout.classList.add('visible');}
  else callout.classList.remove('visible');
  for(const button of document.querySelectorAll('[data-use-artifact]')){const count=model.inventory[button.dataset.useArtifact]||0;button.querySelector('b').textContent=String(count);button.classList.toggle('ready',count>0);button.disabled=count<1;}
}
function renderMission(model){
  lastMissionPosition=`${model.round}:${model.cursor}`;
  const progress=model.progress??model.parts??model.exercise.sequence.map((_,index)=>({degree:model.solved.includes(index),quality:model.solved.includes(index)}));
  const solved=new Set(model.solved),total=model.exercise.sequence.length,solvedParts=model.solvedParts??progress.reduce((sum,part)=>sum+Number(part.degree)+Number(part.quality),0),percent=Math.round(solvedParts/(total*2)*100);
  const missing=progress.flatMap((part,index)=>[
    ...(!part.degree?[{index,kind:'ступень'}]:[]),
    ...(!part.quality?[{index,kind:'тип аккорда'}]:[])
  ]);
  const finalMissing=missing.length===1?missing[0]:null;
  const exerciseIndex=Math.max(0,gardenExercisesForChapter(1).findIndex(item=>item.id===model.exercise.id));
  $('mission-code').textContent=exerciseCode(model.exercise,exerciseIndex);$('mission-source').textContent=model.exercise.source;
  $('route-progress').textContent=`${solvedParts} / ${total*2}`;$('completion-number').textContent=String(percent);$('round-number').textContent=String(model.round).padStart(2,'0');
  const routeElement=$('chord-route');
  routeElement.classList.toggle('route-long',total>=8);
  routeElement.classList.toggle('route-very-long',total>=24);
  routeElement.closest('.route-panel')?.classList.toggle('route-long-panel',total>=8);
  $('harmony-hud').classList.toggle('has-long-route',total>=8);
  routeElement.dataset.length=String(total);
  routeElement.style.setProperty('--route-half',String(Math.ceil(total/2)));
  routeElement.replaceChildren(...progress.map((part,index)=>{
    const li=document.createElement('li'),current=model.running&&index===model.cursor,target=model.exercise.sequence[index];
    li.className=`chord-slot${part.degree&&part.quality?' solved':''}${current?' current':''}`;
    li.setAttribute('aria-label',`Позиция ${index+1}: ступень ${part.degree?'найдена':'не найдена'}, тип ${part.quality?'найден':'не найден'}`);
    const degreeOnly=String(target.degree).match(/^[♭#♯]?(?:VII|VI|IV|III|II|V|I)/)?.[0]??'';
    const label=part.degree&&part.quality?target.degree:part.degree?degreeOnly:part.quality?target.quality:'';
    li.innerHTML=`<span class="route-node" aria-hidden="true"><i class="node-degree${part.degree?' found':''}"></i><i class="node-quality${part.quality?' found':''}"></i><em>${index+1}</em></span><span class="route-copy" aria-hidden="true"><small>${String(index+1).padStart(2,'0')}</small><b class="${label?'visible':''}">${label||'·'}</b></span>`;return li;
  }));
  const currentParts=model.currentParts??(model.cursor>=0?progress[model.cursor]:{degree:true,quality:true});
  const mayAnswer=model.running&&model.cursor>=0&&!solved.has(model.cursor),qualities=[...new Set(model.choices.map(chord=>chord.quality))];
  const answerPart=(kind,value)=>{const result=mission.answerPart(kind,value);if(!result.ignored)pad.feedback(result.correct,{complete:result.positionComplete||result.complete,kind,value}).catch(()=>{});};
  $('degree-options').replaceChildren(...DEGREE_NAMES.map((name,offset)=>{const button=document.createElement('button');const locked=mayAnswer&&currentParts.degree&&Number(model.current.offset)===offset;button.className=`degree-option${locked?' selected locked':''}`;button.textContent=name;button.dataset.degree=String(offset);button.disabled=!mayAnswer||currentParts.degree;button.addEventListener('click',()=>answerPart('degree',offset));return button;}));
  $('quality-options').replaceChildren(...qualities.map(quality=>{const button=document.createElement('button');const locked=mayAnswer&&currentParts.quality&&model.current.quality===quality;button.className=`quality-option${locked?' selected locked':''}`;button.textContent=quality==='1'?'1 / 8':quality;button.dataset.quality=quality;button.disabled=!mayAnswer||currentParts.quality;button.addEventListener('click',()=>answerPart('quality',quality));return button;}));
  const waitingForFinal=finalMissing&&model.running&&model.cursor>=0&&model.cursor!==finalMissing.index;
  $('answer-feedback').textContent=model.complete?'Маршрут собран. Последовательность распознана.':model.feedback||(waitingForFinal?`Осталась позиция ${finalMissing.index+1}: ${finalMissing.kind}. Дождись её подсветки слева.`:mayAnswer?'Ступень и тип фиксируются независимо':model.running&&model.cursor<0?'Слушаем базу':model.running?'Обе части этой позиции уже найдены':finalMissing?`Осталась позиция ${finalMissing.index+1}: ${finalMissing.kind}. Запусти последовательность.`:'Запусти последовательность');
  const referenceName=String(model.reference.degree).replace(/^БАЗА\s*/, '');
  $('mission-prompt').textContent=model.complete?`Все ${total} сигналов встроены в маршрут.`:model.running?(model.cursor<0?`Тоника ${referenceName} звучит один раз перед фигурой.`:waitingForFinal?`Ждём позицию ${finalMissing.index+1} — там остался ${finalMissing.kind}.`:solved.has(model.cursor)?'Позиция заполнена — слушаем контекст.':currentParts.degree?'Ступень есть. Найди тип аккорда.':currentParts.quality?'Тип есть. Найди ступень.':'Определи две части текущего аккорда.'):'Тоника известна. Запусти последовательность.';
  $('mission-toggle').textContent=model.running?'Ⅱ Остановить':'▶ Запустить полёт';$('mission-restart').hidden=!model.complete;
  if(model.complete&&!completionHandled)completeGardenLevel();
}
function bindMission(exercise){if(!exercise)return;mission?.pause();pad.stop(true);currentRoute=exercise;completionHandled=false;lastMissionPosition='';mission=createGardenMission({exercise,onChange:renderMission,onChord:(chord,model)=>pad.play(chord,model.exercise.baseTonic??5,{arpeggio:model.arpeggio}).catch(error=>{$('answer-feedback').textContent=error.message;})});renderMission(mission.snapshot());}
let activeExercises=[];
function routeTitle(route,index=0){return route.name&&route.name!==route.id?route.name:exerciseCode(route,index);}
function renderGardenRouteList(){
  const list=$('garden-route-list');if(!list)return;
  const routes=s.tour==='reharm'?activeExercises:(studio?.routes||[]).filter(route=>(route.tour||'reharm')===s.tour);
  list.replaceChildren(...routes.map((route,index)=>{const button=document.createElement('button');button.className='garden-route-choice';button.innerHTML=`<span>${s.tour==='reharm'?exerciseCode(route,index):String(route.number||index+1).padStart(2,'0')}</span><strong>${routeTitle(route,index)}</strong><small>${route.sequence.length} аккордов</small>`;button.addEventListener('click',()=>launchRoute(route));return button;}));
  if(!routes.length){const empty=document.createElement('p');empty.className='garden-route-empty';empty.textContent='В этом туре пока нет последовательностей. Их можно добавить в Sound & Route Lab.';list.append(empty);}
  $('reharm-chapters').hidden=s.tour!=='reharm';
}
function selectChapter(chapter=1,{bind=false}={}){s.chapter=clamp(Number(chapter)||1,1,16);activeExercises=gardenExercisesForChapter(s.chapter);$('mandala-chapter').textContent=String(s.chapter).padStart(2,'0');$('exercise-select').replaceChildren(...activeExercises.map((exercise,index)=>{const option=document.createElement('option');option.value=exercise.id;option.textContent=exerciseCode(exercise,index);return option;}));if(bind&&activeExercises[0])bindMission(activeExercises[0]);for(const button of document.querySelectorAll('[data-chapter]')){const selected=Number(button.dataset.chapter)===s.chapter;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));}renderGardenRouteList();}
selectChapter(1,{bind:true});
studio=new GardenSequenceStudio({
  onUse:route=>{queuedStudioRoute=route;},
  onOpen:()=>{studioPauseState=s.paused;s.paused=true;ui();},
  onClose:()=>{if(queuedStudioRoute){const route=queuedStudioRoute;queuedStudioRoute=null;launchRoute(route);}else{s.paused=studioPauseState;ui();}}
});
$('exercise-select').addEventListener('change',event=>bindMission(activeExercises.find(exercise=>exercise.id===event.target.value)));
for(let chapter=1;chapter<=16;chapter++){const button=document.createElement('button');button.dataset.chapter=String(chapter);button.textContent=String(chapter).padStart(2,'0');button.setAttribute('aria-label',`Глава ${chapter}`);button.addEventListener('click',()=>selectChapter(chapter));$('chapter-orbit').append(button);}selectChapter(1);
for(const button of document.querySelectorAll('[data-tour]'))button.addEventListener('click',async()=>{s.tour=button.dataset.tour;for(const item of document.querySelectorAll('[data-tour]')){const selected=item===button;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));}$('mandala-tour-name').textContent=button.getAttribute('aria-label')||s.tour;await studio?.refresh();renderGardenRouteList();});
for(const button of document.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>{s.mode=button.dataset.mode;for(const item of document.querySelectorAll('[data-mode]')){const selected=item===button;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));}});
function updateProgressCard(){
  $('garden-level').textContent=String(progress.level).padStart(2,'0');
  $('garden-level-progress').style.width=`${((progress.level-1)%4+1)*25}%`;
  $('garden-completed').textContent=`${progress.completed.length} ${progress.completed.length===1?'маршрут пройден':'маршрутов пройдено'}`;
}
function showGardenStart(state='menu'){
  mission?.pause();pad.stop(true);s.paused=true;keys.clear();setGardenMenu(false);$('game-over').hidden=true;
  document.body.classList.add('start-open');$('garden-start').hidden=false;
  $('start-title').textContent=state==='complete'?'Уровень пройден':'Выбери путь';
  $('start-note').textContent=state==='complete'?`Маршрут «${routeTitle(currentRoute)}» собран. Сад открыл следующий уровень.`:'Сад усложняет маршруты постепенно и запоминает пройденные уровни.';
  $('start-random').querySelector('strong').textContent=state==='complete'?'Следующий случайный маршрут':'Случайный маршрут';
  updateProgressCard();ui();
}
function hideGardenStart(){document.body.classList.remove('start-open');$('garden-start').hidden=true;}
function allBookRoutes(maxChapter=16){const routes=[];for(let chapter=1;chapter<=maxChapter;chapter++)for(const route of gardenExercisesForChapter(chapter))routes.push(route);return routes;}
async function randomGardenRoute(){
  await studio.refresh();
  const unlockedChapter=Math.min(16,1+Math.floor((progress.level-1)/2)),maxLength=Math.min(18,4+Math.floor((progress.level-1)/2));
  const book=allBookRoutes(unlockedChapter),tour=(studio.routes||[]).filter(route=>route.sequence.length<=maxLength);
  let pool=[...book,...tour].filter(route=>route.id!==progress.lastRouteId);if(!pool.length)pool=[...book,...tour];
  const route=pool[Math.floor(Math.random()*pool.length)]||gardenExercisesForChapter(1)[0];
  launchRoute(route);
}
async function launchRoute(route){
  if(!route)return;
  hideGardenStart();setGardenMenu(false);$('game-over').hidden=true;s.gameOver=false;gardenLife.reset();renderVitals();bindMission(route);
  try{await pad.unlock();s.paused=false;mission.start();$('answer-feedback').textContent=`Маршрут «${routeTitle(route)}» загружен`;ui();}catch(error){$('answer-feedback').textContent=error.message;s.paused=false;ui();}
}
function completeGardenLevel(){
  completionHandled=true;s.paused=true;pad.stop(true);
  const id=currentRoute?.id||`${currentRoute?.source||'route'}:${currentRoute?.name||''}`;
  if(id&&!progress.completed.includes(id))progress.completed.push(id);progress.lastRouteId=id;progress.level+=1;saveProgress();
  showGardenStart('complete');
}
async function retryCurrentMission(){
  if(!currentRoute)return;hideGardenStart();$('game-over').hidden=true;s.gameOver=false;gardenLife.reset();renderVitals();bindMission(currentRoute);
  try{await pad.unlock();s.paused=false;mission.start();ui();}catch(error){$('answer-feedback').textContent=error.message;}
}
function chooseState(index){
  index=clamp(Math.trunc(index),0,3);s.growth=index;s.from=s.to=index;s.visit=0;
  ui();
}
function pause(){s.paused=!s.paused;keys.clear();ui();}
function clean(value){s.clean=value;document.body.classList.toggle('clean',value);$('restore').hidden=!value;(value?$('restore'):$('clean')).focus();}
function light(mode){s.lightMode=mode;if(mode==='cycle')s.cycle=Math.acos(clamp(1-2*s.night,-1,1))*180/Math.PI;if(s.paused||reduced)s.night=mode==='night'?1:mode==='dusk'?.48:mode==='day'?0:s.night;ui();}
for(const b of document.querySelectorAll('[data-ship]'))b.addEventListener('click',()=>{s.ship=Number(b.dataset.ship);ui();});
for(const b of document.querySelectorAll('[data-light]'))b.addEventListener('click',()=>light(b.dataset.light));
$('pause').addEventListener('click',pause);$('lantern').addEventListener('click',()=>{s.lantern=!s.lantern;ui();});
$('clean').addEventListener('click',()=>clean(true));$('restore').addEventListener('click',()=>clean(false));
function setGardenMenu(open){document.body.classList.toggle('world-open',open);$('world-controls').setAttribute('aria-expanded',String(open));}
$('world-controls').addEventListener('click',()=>setGardenMenu(!document.body.classList.contains('world-open')));
$('menu-close').addEventListener('click',()=>setGardenMenu(false));
$('garden-home').addEventListener('click',()=>showGardenStart());
$('start-random').addEventListener('click',randomGardenRoute);
$('start-choose').addEventListener('click',async()=>{hideGardenStart();await studio.refresh();renderGardenRouteList();setGardenMenu(true);});
$('retry-mission').addEventListener('click',retryCurrentMission);
$('library-open').addEventListener('click',()=>studio.open());$('studio-close').addEventListener('click',()=>studio.close());$('studio-capture').addEventListener('click',()=>studio.toggleCapture());$('studio-save').addEventListener('click',()=>studio.save());
$('mission-toggle').addEventListener('click',async()=>{const model=mission.snapshot();if(model.running){mission.pause();pad.stop(true);return;}try{await pad.unlock();if(s.paused)s.paused=false;mission.start();ui();}catch(error){$('answer-feedback').textContent=error.message;}});
$('mission-restart').addEventListener('click',()=>{mission.restart();s.paused=false;ui();});
for(const button of document.querySelectorAll('[data-use-artifact]'))button.addEventListener('click',()=>{const kind=button.dataset.useArtifact;if((kind==='hold'||kind==='holdArpeggio')&&mission.snapshot().cursor<0){$('answer-feedback').textContent='Сначала дождись первого аккорда последовательности';return;}if(!gardenLife.consumeArtifact(kind))return;if(kind==='arpeggio')mission.arpeggioRound();if(kind==='restart')mission.restartFromRoot();if(kind==='midpoint')mission.jumpToMiddle();if(kind==='hold'||kind==='holdArpeggio'){mission.hold(kind==='holdArpeggio');$('artifact-continue').hidden=false;$('artifact-repeat').hidden=false;}renderVitals();});
$('artifact-repeat').addEventListener('click',()=>mission.replayCurrent());
$('artifact-continue').addEventListener('click',()=>{mission.continue();$('artifact-continue').hidden=true;$('artifact-repeat').hidden=true;});
for(const button of document.querySelectorAll('[data-pad]'))button.addEventListener('click',()=>{pad.applyPreset(button.dataset.pad);for(const item of document.querySelectorAll('[data-pad]'))item.setAttribute('aria-pressed',String(item===button));});
$('speed').addEventListener('input',e=>{s.speed=Number(e.target.value);$('speed-value').value=s.speed.toFixed(1)+'×';});
$('altitude').addEventListener('input',e=>{s.altitude=Number(e.target.value);$('altitude-value').value=s.altitude.toFixed(2);s.worldSize=Math.max(s.width*.86,s.height*.95)/s.altitude;});
function move(x,y){tx=clamp(x/s.width,.1,.9);ty=clamp(y/s.height,.2,.78);$('gesture').classList.add('dismissed');}
world.addEventListener('pointerdown',e=>{if(e.button!==0||dragId!==null)return;dragId=e.pointerId;world.setPointerCapture(dragId);move(e.clientX,e.clientY);world.focus({preventScroll:true});});
world.addEventListener('pointermove',e=>{if(e.pointerId===dragId)move(e.clientX,e.clientY);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])world.addEventListener(name,e=>{if(e.pointerId===dragId)dragId=null;});
addEventListener('keydown',e=>{
  if(['INPUT','BUTTON','SELECT','TEXTAREA','A'].includes(e.target.tagName)||e.repeat&&['Space','KeyH'].includes(e.code))return;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){e.preventDefault();keys.add(e.code);$('gesture').classList.add('dismissed');}
  if(e.code==='Space'){e.preventDefault();pause();}if(e.code==='KeyH')clean(!s.clean);if(e.code==='Escape'){if(document.body.classList.contains('world-open'))setGardenMenu(false);else if(!$('garden-start').hidden)hideGardenStart();else if(s.clean)clean(false);}
});
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();dragId=null;});
document.addEventListener('visibilitychange',()=>{last=0;keys.clear();if(document.hidden){mission?.pause();pad.stop(true);s.paused=true;cancelAnimationFrame(raf);raf=0;}else{ui();if(!raf)raf=requestAnimationFrame(frame);}});
addEventListener('pagehide',()=>{mission?.pause();pad.stop(true);});
function update(dt){
  if(s.paused)return;
  s.time=mod(s.time+dt,Math.PI*2000);s.visit+=dt;
  s.travel=mod(s.travel+dt*s.speed*18,100000);
  s.scroll=mod(s.scroll+dt*s.speed*18/s.worldSize,2);
  s.growth=mod(s.growth+dt*.014,4);
  if(s.lightMode==='cycle')s.cycle=mod(s.cycle+dt*2,360);
  const target=s.lightMode==='day'?0:s.lightMode==='dusk'?.48:s.lightMode==='night'?1:(1-Math.cos(s.cycle*Math.PI/180))/2;
  s.night+=(target-s.night)*(1-Math.exp(-dt*.9));
  tx=clamp(tx+((keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0))*dt*.28,.1,.9);
  ty=clamp(ty+((keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0))*dt*.22,.2,.78);
  const previousX=s.x,previousY=s.y,dx=tx*s.width-s.x;s.x+=dx*(1-Math.exp(-dt*5));s.y+=(ty*s.height-s.y)*(1-Math.exp(-dt*5));
  if(dt){const velocityX=(s.x-previousX)/dt/Math.max(1,s.width),velocityY=(s.y-previousY)/dt/Math.max(1,s.height),blend=1-Math.exp(-dt*8);s.motionX+=(velocityX-s.motionX)*blend;s.motionY+=(velocityY-s.motionY)*blend;}
  s.thrust=clamp(.46-s.motionY*1.9,.22,1);s.brake=clamp(s.motionY*2.4,0,1);
  s.angle+=(clamp(dx/s.width,-.3,.3)-s.angle)*(1-Math.exp(-dt*4));
  s.pan+=((s.x/s.width-.5)*.13-s.pan)*(1-Math.exp(-dt));
  const missionState=mission?.snapshot();
  gardenLife.update(dt,{...s,active:Boolean(missionState?.running),answering:Boolean(missionState?.running&&missionState.cursor>=0)});
  const lifeState=gardenLife.snapshot();
  if(lifeState.gameOver&&!s.gameOver){s.gameOver=true;s.paused=true;mission?.pause();pad.stop(true);$('game-over').hidden=false;}
  const shake=lifeState.impact||0,shakeX=Math.sin(s.time*83)*shake*7,shakeY=Math.cos(s.time*71)*shake*5;
  document.documentElement.style.setProperty('--impact-x',`${shakeX.toFixed(2)}px`);document.documentElement.style.setProperty('--impact-y',`${shakeY.toFixed(2)}px`);
  document.body.classList.toggle('garden-impact',shake>.05);
  const hazardForce=gardenLife.getFlightForce();
  tx=clamp(tx+hazardForce.x*dt,.1,.9);ty=clamp(ty+hazardForce.y*dt,.2,.78);
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
  gardenLife.draw(ctx,s);
}
let uiTick=0;
function frame(now){
  raf=0;if(document.hidden)return;
  const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  if(s.ready){update(dt);renderer.render({...s,lantern:s.lantern&&s.ship!==2});atmosphere();if(now-uiTick>200){ui();renderVitals();const model=mission.snapshot();$('bar-countdown').textContent=model.running?`${Math.max(0,(model.deadline-performance.now())/1000).toFixed(1)} сек`:`${model.barSeconds.toFixed(1)} сек`;uiTick=now;}}
  raf=requestAnimationFrame(frame);
}
async function load(){
  const lifeFiles=[...new Set(Object.values(GARDEN_ITEMS).map(item=>item.sprite).filter(Boolean))];
  const paths=[...STATES.map(x=>x.file),'manta','lotus',...lifeFiles.map(file=>`collectibles/${file}`)];
  images=await Promise.all(paths.map(file=>new Promise((resolve,reject)=>{
    const img=new Image();img.onload=()=>{$('load-progress').textContent=`Готово ${++loaded} из ${paths.length}`;resolve(img);};img.onerror=()=>reject(Error(`Не загрузился пейзаж: ${file}. Проверь соединение и попробуй снова.`));
    const asset=window.GARDEN_ASSETS?.[file]||`assets/echo-garden/${file}.webp`;img.src=(file==='manta'||file==='lotus')?`${asset}${asset.includes('?')?'&':'?'}cutout=2`:asset;
  })));
  renderer=createGardenRenderer(world,shipLayer,images.slice(0,6));
  gardenLife.setImages(Object.fromEntries(lifeFiles.map((file,index)=>[file,images[6+index]])));
  s.ready=true;$('loading').hidden=true;
  const params=new URLSearchParams(location.search);
  const index=Number(params.get('state'));if(Number.isInteger(index)&&index>=0&&index<4)chooseState(index);
  const phase=Number(params.get('phase'));if(Number.isFinite(phase)&&phase>=0&&phase<4)s.growth=phase;
  if(['day','dusk','night','cycle'].includes(params.get('light'))){light(params.get('light'));s.night=params.get('light')==='night'?1:params.get('light')==='dusk'?.48:0;}
  if(params.get('ship')==='lotus')s.ship=1;if(params.get('still')==='1')s.paused=true;
  if(params.get('studio')==='1')studio.open();else showGardenStart();
  ui();if(!raf)raf=requestAnimationFrame(frame);
}
function error(e){s.ready=false;$('loading').hidden=false;$('load-progress').textContent=e.message;$('retry').hidden=false;}
$('retry').addEventListener('click',()=>location.reload());
for(const canvas of [world,shipLayer])canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();s.ready=false;last=0;$('loading').hidden=false;$('load-progress').textContent='Восстанавливаем изображение…';});
for(const canvas of [world,shipLayer])canvas.addEventListener('webglcontextrestored',()=>{try{renderer?.dispose();renderer=createGardenRenderer(world,shipLayer,images.slice(0,6));s.ready=true;last=0;$('loading').hidden=true;}catch(e){error(e);}});
window.gardenFlight=Object.freeze({snapshot:()=>({...s,keys:keys.size,particles:motes.length,graphics:renderer?.diagnostics(),mission:mission.snapshot(),life:gardenLife.snapshot(),progress:{...progress},currentRoute:currentRoute?.id}),advanceChord:()=>mission.advance(),spawnCollectible:kind=>gardenLife.forceSpawn(kind,{x:.5,y:.22}),showMenu:()=>showGardenStart(),randomRoute:()=>randomGardenRoute()});
ui();renderVitals();updateProgressCard();load().catch(error);
