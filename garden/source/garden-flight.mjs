import {createLanguage} from './garden-language.mjs';
import {createGuide,guideItemName,guideItemCopy} from './garden-guide.mjs';
import {createTrial} from './garden-trial.mjs';
import {createGardenRenderer} from './garden-flight-renderer.mjs';
import {gardenRouteWindow,gardenNoteName,gardenJazzQuality,gardenJazzLabel,gardenRootOffset,gardenBassOffset,gardenQualityAnswer,gardenQualityAnswerLabel,gardenAvailableAnswers,createGardenMission,GardenPad,gardenExercisesForChapter,gardenDegreeLabel,gardenQualityLabel,gardenChordLabel,gardenAnswerState,gardenCanonicalQuality,GARDEN_QUALITY_PALETTE,GARDEN_CORE_QUALITIES,gardenFilteredChoices} from './garden-harmony.mjs';
import {difficultyProfile,GARDEN_ADMISSION_ROUTES,gardenAdmissionState,recordGardenAdmission} from './garden-difficulty.mjs';
import {GardenSequenceStudio,gardenMandalaDataUri,gardenRouteDisplayName} from './garden-sequence-studio.mjs';
import {JAZZ_STANDARD_ROUTES} from './garden-jazz-routes.mjs';
import {createGardenLife,drawGardenAssistGlyph,GARDEN_RESOURCES,GARDEN_ITEMS} from './garden-life.mjs';
import {createGardenRewards} from './garden-rewards.mjs';
import {GARDEN_ARRANGEMENTS,drawGardenArrangementFlower} from './garden-arrangement.mjs';
import {GardenResonance} from './garden-resonance.mjs';
import {GardenRun} from './garden-run.mjs';
import {mountGardenRecording} from './garden-recording.mjs';
const $=id=>document.getElementById(id),world=$('world'),life=$('life'),shipLayer=$('ship-layer'),ctx=life.getContext('2d');
$('build-version').textContent='v'+(globalThis.GARDEN_VERSION||'dev');
function setPlaybackIcon(button,running){
  const state=running?'pause':'play';if(button.dataset.playbackState===state)return;
  button.dataset.playbackState=state;
  button.innerHTML=`<svg class="playback-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${running?'M8 5v14M16 5v14':'M7 4.5 19 12 7 19.5Z'}"/></svg>`;
}
function bindAnswerPress(button,action){
  // Answer on contact. A bar change can replace the button before pointerup,
  // which used to silently discard an otherwise correct touch.
  button.addEventListener('pointerdown',event=>{if(button.disabled||event.button!==0||event.isPrimary===false)return;event.preventDefault();event.stopPropagation();action();});
  button.addEventListener('click',event=>{if(!button.disabled&&(event.detail===0||!window.PointerEvent))action();});
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const requestedPalette=new URLSearchParams(location.search).get('palette');
document.body.dataset.paletteLayout=['compact','expanded','layered'].includes(requestedPalette)?requestedPalette:'layered';
const STATES=[
  {name:'Синие сады',note:'Цветущие острова и прозрачные русла',file:'blue-gardens'},
  {name:'Ночное цветение',note:'Светящиеся мембраны прорастают на той же карте',file:'night-bloom-aligned'},
  {name:'Белая оттепель',note:'Тонкий минеральный иней растёт вдоль прежних берегов',file:'white-thaw-aligned'},
  {name:'Янтарное созревание',note:'Тёплая растительность проступает сквозь знакомый рельеф',file:'blue-gardens'}
];
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),mod=(x,n)=>(x%n+n)%n;
const mobileGraphics=matchMedia('(pointer:coarse)').matches;
let renderScale=mobileGraphics?1.3:1.5,slowFrameAverage=16,graphicsSamples=0;
const s={ready:false,lowCostGraphics:mobileGraphics,from:0,to:0,transition:1,pending:null,growth:0,ship:1,time:0,travel:0,scroll:0,pan:0,night:0,lightMode:'cycle',cycle:0,lantern:true,paused:reduced,speed:2,altitude:1.25,visit:0,clean:false,angle:0,motionX:0,motionY:0,thrust:.45,brake:0,x:0,y:0,width:1,height:1,worldSize:1,tour:'reharm',chapter:1,mode:'quest',gameOver:false};
let renderer,images,last=0,raf=0,dpr=1,dragId=null,tx=.5,ty=.56,keys=new Set(),loaded=0;
const pad=new GardenPad({deferSamplesUntilReady:true});
const run=new GardenRun();
const resonance=new GardenResonance({onTone:(midi,detail)=>{run.tone(detail,mission?.snapshot().cursor??-1);pad.tensionNote(midi,detail);}});
const gardenLife=createGardenLife({onArrangement:(style,rounds)=>mission?.arrange(style,rounds),onRestoration:()=>resonance.restore()});
const gardenRewards=createGardenRewards({reduced});
let mission,studio,currentRoute,lastMissionPosition='',lastLifeEvent=0,lastCollisionEvent=0,studioPauseState=false,queuedStudioRoute=null,completionHandled=false;
let chainView={route:null,position:null,page:null};
const PROGRESS_KEY='echo-garden-progress.v1';
const TUTORIAL_KEY='ear-yoga-guide.v2';
let guide,language,trial,trialExpired=false;
const wasTutorialDismissed=()=>{try{return localStorage.getItem(TUTORIAL_KEY)==='1';}catch{return false;}};
let menuWasRunning=false,exitWasRunning=false,menuFromStart=false;
let difficulty='medium',tutorialStep=0,tutorialDismissed=wasTutorialDismissed(),tutorialActive=false;
const FAVORITES_KEY='echo-garden-favorites.v1';
const loadProgress=()=>{try{const saved=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');return {level:Math.max(1,Number(saved.level)||1),completed:Array.isArray(saved.completed)?saved.completed:[],seenRouteIds:Array.isArray(saved.seenRouteIds)?saved.seenRouteIds:[],lastRouteId:saved.lastRouteId||'',admissionCompleted:Array.isArray(saved.admissionCompleted)?saved.admissionCompleted:[]};}catch{return {level:1,completed:[],seenRouteIds:[],lastRouteId:'',admissionCompleted:[]};}};
const progress=loadProgress();
const saveProgress=()=>{try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));}catch{}}
const loadFavorites=()=>{try{return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]'));}catch{return new Set();}};
const favorites=loadFavorites();
const routeIdentity=route=>String(route?.id||`${route?.source||'route'}:${route?.name||''}`);
const saveFavorites=()=>{try{localStorage.setItem(FAVORITES_KEY,JSON.stringify([...favorites]));navigator.storage?.persist?.();}catch{}};
const TOUR_NAMES={reharm:'Reharmonization+',anime:'Anime',chill:'Chill',ambient:'Ambient',cinematic:'Cinematic','deep-house':'Deep House',funk:'Funk',gospel:'Gospel','drum-bass':'Drum & Bass','jazz-standards':'Jazz Standards',favorites:'Избранные полёты'};
const routeTour=route=>route?.chapter?'reharm':route?.tour||'reharm';
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
  s.width=innerWidth;s.height=innerHeight;dpr=Math.min(devicePixelRatio||1,renderScale);
  for(const canvas of [world,life,shipLayer]){canvas.width=Math.round(s.width*dpr);canvas.height=Math.round(s.height*dpr);}
  s.worldSize=Math.max(s.width*.86,s.height*.95)/s.altitude;
  s.x=tx*s.width;s.y=ty*s.height;
}
resize();addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);
function ui(){
  document.body.classList.toggle('bright-garden',s.night<.45);
  const active=Math.floor(mod(s.growth,4)),item=STATES[active],progress=mod(s.growth,1);
  $('state-title').textContent=item.name;$('state-note').textContent=item.note;
  $('state-number').textContent=`ЖИВОЙ ЦИКЛ · 0${active+1} / 04`;
  $('world-cycle-name').textContent=item.name;$('world-cycle-progress').style.width=`${Math.round(progress*100)}%`;
  for(const [attribute,value] of [['ship',s.ship],['light',s.lightMode]])for(const b of document.querySelectorAll(`[data-${attribute}]`)){const selected=String(b.dataset[attribute])===String(value);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}
  $('pause').setAttribute('aria-pressed',String(s.paused));setPlaybackIcon($('pause'),!s.paused);$('pause').setAttribute('aria-label',s.paused?'Продолжить':'Пауза');
  $('lantern').setAttribute('aria-pressed',String(s.lantern));$('lantern').disabled=s.ship===2;
  $('flight-status').textContent=s.paused?'Полёт на паузе':s.night>.6?(s.lantern&&s.ship!==2?'Ночь · свет ведёт нас':'Ночь · естественное свечение'):s.night>.2?'Сумерки · сад продолжает расти':'День · живой цикл';
}
function renderVitals(){
  const model=gardenLife.snapshot();
  const res=resonance.snapshot(),resElement=document.querySelector('.vital[data-resource="resonance"]');
  resElement.hidden=!res.enabled;resElement.style.setProperty('--level',String(res.energy/100));resElement.classList.toggle('low',res.energy<24);
  resElement.setAttribute('aria-label',`O₂: ${Math.round(res.energy)}%`);$('vital-resonance').textContent=String(Math.round(res.energy));
  const repeatState=mission?.snapshot();$('infinity-toggle').disabled=!repeatState?.running||repeatState.complete||(!repeatState.held&&(model.inventory.hold||0)<1);$('infinity-toggle').title=repeatState?.held?'Выключить повтор и продолжить':`Повторить аккорд · зарядов лотоса: ${model.inventory.hold||0}`;
  for(const [name,definition] of Object.entries(GARDEN_RESOURCES)){
    const element=document.querySelector(`.vital[data-resource="${name}"]`),value=Math.round(model.resources[name]);
    if(!element)continue;
    element.style.setProperty('--level',String(value/100));element.classList.toggle('low',value<24);
    element.setAttribute('aria-label',`${definition.label}: ${value} процентов`);$(`vital-${name}`).textContent=String(value);
  }
  const event=model.event;
  if(event&&event.id!==lastLifeEvent){
    lastLifeEvent=event.id;const elements=event.resource==='all'?document.querySelectorAll('.vital'):[document.querySelector(`.vital[data-resource="${event.resource}"]`)];
    for(const element of elements){element?.classList.remove('changed','harmful');void element?.offsetWidth;element?.classList.add('changed');element?.classList.toggle('harmful',event.harmful);}
  }
  const callout=$('vital-event');
  if(event&&model.eventAge<2.4){callout.textContent=`${event.harmful?'−':'+'} ${event.label}`;callout.classList.toggle('harmful',event.harmful);callout.classList.add('visible');}
  else callout.classList.remove('visible');
  for(const button of document.querySelectorAll('[data-use-artifact]')){const kind=button.dataset.useArtifact,count=model.inventory[kind]||0,spec=GARDEN_ITEMS[kind],state=mission?.snapshot(),repeating=Boolean(spec.repeat&&state?.held);button.querySelector('b').textContent=count?String(count):'';button.classList.toggle('ready',count>0||repeating);button.classList.toggle('repeating',repeating);button.setAttribute('aria-pressed',String(repeating));if(spec.repeat){button.title=repeating?'∞ Повтор включён · нажми, чтобы продолжить':`${spec.label} · зарядов: ${count}`;button.setAttribute('aria-label',button.title);}button.hidden=Boolean(spec.teacherOnly&&!state?.separateBass)||(!spec.navigationDelta&&count<1&&!repeating);button.disabled=(!repeating&&count<1)||(spec.shield&&model.shieldHits>0)||s.paused||!state?.running||state.cursor<0||(spec.assist?.reveal&&(spec.assist.answerKind==='both'?state.answerKinds.every(kind=>state.currentParts[kind]):state.currentParts[spec.assist.answerKind]));}
}
function collisionThud(){
  const audio=pad.context;if(!audio||audio.state!=='running')return;
  const at=audio.currentTime,oscillator=audio.createOscillator(),gain=audio.createGain();
  oscillator.type='triangle';oscillator.frequency.setValueAtTime(110,at);oscillator.frequency.exponentialRampToValueAtTime(43,at+.2);
  gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.13,at+.009);gain.gain.exponentialRampToValueAtTime(.0001,at+.25);
  oscillator.connect(gain);gain.connect(pad.cleanOutput||audio.destination);oscillator.start(at);oscillator.stop(at+.27);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
}
function renderMission(model){
  run.observe(model);renderRun();
  renderTutorial(model);
  const chainPosition=`${model.round}:${model.cursor}`;
  if(chainView.route!==model.exercise.id||chainView.position!==chainPosition)chainView={route:model.exercise.id,position:chainPosition,page:null};
  const windowed=gardenRouteWindow(model.exercise.sequence.length,model.cursor,chainView.page);
  const layers=Object.entries(model.arrangementStatus||{});$('arrangement-status').replaceChildren(...layers.map(([track,item])=>{const button=document.createElement('button'),spec=GARDEN_ARRANGEMENTS[item.style],canvas=document.createElement('canvas');button.dataset.arrangementTrack=track;button.dataset.arrangementStyle=item.style;canvas.width=canvas.height=96;canvas.setAttribute('aria-hidden','true');const icon=canvas.getContext('2d');icon.translate(48,48);drawGardenArrangementFlower(icon,spec,126,1,1.7);button.append(canvas);button.style.setProperty('--flower',spec.color);button.title=`${spec.label}: отключить партию`;button.setAttribute('aria-label',button.title);button.addEventListener('click',()=>{mission.clearArrangement(track);});return button;}));
  lastMissionPosition=`${model.round}:${model.cursor}`;
  const progress=model.progress??model.parts??model.exercise.sequence.map((_,index)=>({degree:model.solved.includes(index),quality:model.solved.includes(index)}));
  const solved=new Set(model.solved),total=model.exercise.sequence.length,solvedParts=model.solvedParts??progress.reduce((sum,part)=>sum+Number(part.degree)+Number(part.quality),0),totalParts=model.totalParts??total*2,percent=Math.round(solvedParts/totalParts*100);
  const missing=progress.flatMap((part,index)=>[
    ...(!part.degree?[{index,kind:model.rootMode?'корень':'бас'}]:[]),
    ...(model.separateBass&&!part.bass?[{index,kind:'бас'}]:[]),
    ...(!part.quality?[{index,kind:'тип аккорда'}]:[])
  ]);
  const finalMissing=missing.length===1?missing[0]:null;
  const chapter=Number(model.exercise.chapter)||1,exerciseIndex=Math.max(0,gardenExercisesForChapter(chapter).findIndex(item=>item.id===model.exercise.id)),tour=routeTour(model.exercise),favorite=favorites.has(routeIdentity(model.exercise));
  $('mission-code').textContent=exerciseCode(model.exercise,exerciseIndex);$('mission-title').textContent=routeTitle(model.exercise,exerciseIndex);$('mission-source').textContent=model.exercise.source||`${TOUR_NAMES[tour]||tour} · последовательность ${model.exercise.number||exerciseIndex+1}`;$('mission-mandala').src=`assets/echo-garden/tours/${tour==='favorites'?'reharm':tour}.webp`;$('mission-mandala').alt=`Мандала ${TOUR_NAMES[tour]||tour}`;
  $('route-favorite').textContent=favorite?'♥':'♡';$('route-favorite').setAttribute('aria-pressed',String(favorite));$('route-favorite').setAttribute('aria-label',favorite?'Убрать маршрут из избранного':'Добавить маршрут в избранное');
  $('route-progress').textContent=`${solvedParts} / ${totalParts}`;$('completion-number').textContent=String(percent);$('round-number').textContent=String(model.round).padStart(2,'0');
  const routeElement=$('chord-route');
  routeElement.classList.toggle('route-long',total>5);
  routeElement.classList.toggle('route-very-long',false);
  routeElement.classList.toggle('route-paged',windowed.paged);document.body.classList.toggle('paged-chain',windowed.paged);
  routeElement.closest('.route-panel')?.classList.toggle('route-long-panel',total>5);
  $('harmony-hud').classList.toggle('has-long-route',total>5);
  routeElement.dataset.length=String(total);
  routeElement.style.setProperty('--route-half',String(Math.ceil(total/2)));
  $('chain-pager').hidden=!windowed.paged;
  $('chain-range').textContent=`${windowed.start+1}–${windowed.end} / ${total}`;
  $('chain-back').disabled=windowed.page===0;$('chain-forward').disabled=windowed.page===windowed.pages-1;
  $('chain-back').onclick=()=>{chainView.page=windowed.page-1;renderMission(mission.snapshot());};
  $('chain-forward').onclick=()=>{chainView.page=windowed.page+1;renderMission(mission.snapshot());};
  routeElement.replaceChildren(...progress.map((part,index)=>{
    const li=document.createElement('li'),current=model.running&&index===model.cursor,target=model.exercise.sequence[index];
    li.hidden=index<windowed.start||index>=windowed.end;
    li.className=`chord-slot${solved.has(index)?' solved':''}${current?' current':''}`;
    li.setAttribute('aria-label',`Позиция ${index+1}: ${model.rootMode?'корень':'бас'} ${part.degree?'найден':'не найден'}, тип ${part.quality?'найден':'не найден'}${model.separateBass?`, бас ${part.bass?'найден':'не найден'}`:''}`);
    const degreeOnly=gardenDegreeLabel(model.rootMode?gardenRootOffset(target):gardenBassOffset(target));
    const label=model.rootMode?(part.degree||part.quality||part.bass?gardenJazzLabel(target,model.exercise.baseTonic??5,{root:part.degree,quality:part.quality,bass:part.bass,compact:model.separateBass})+(model.separateBass&&part.degree&&part.quality&&!part.bass?' / ?':''):''):part.degree&&part.quality?gardenChordLabel(target):part.degree?degreeOnly:part.quality?gardenQualityAnswerLabel(gardenQualityAnswer(target)):'';
    if(part.degree&&part.quality)li.title=`${gardenChordLabel(target)}${target.notes?.length?` · MIDI: ${target.notes.join(', ')}`:''}`;
    li.innerHTML=`<button type="button" class="route-node" aria-label="Позиция ${index+1}" disabled><i class="node-degree${part.degree?' found':''}"></i><i class="node-quality${part.quality?' found':''}"></i>${model.separateBass?`<i class="node-bass-ring${part.bass?' found':''}"></i>`:''}<em>${index+1}</em></button><span class="route-copy" aria-hidden="true"><small>${String(index+1).padStart(2,'0')}</small><b class="${label?'visible':''}">${label||'·'}</b></span>`;
    return li;
  }));
  const currentParts=model.currentParts??(model.cursor>=0?progress[model.cursor]:{degree:true,quality:true});
  const mayAnswer=model.running&&model.cursor>=0&&!solved.has(model.cursor),prototypePalette=['expanded','compact'].includes(document.body.dataset.paletteLayout),qualities=gardenAvailableAnswers(model.exercise,{expanded:prototypePalette,rootMode:model.rootMode});
  document.body.classList.toggle('student-palette',!prototypePalette);
  const visibleDegrees=gardenFilteredChoices('degree',model.current,model.filters?.degree,undefined,{rootMode:model.rootMode}),visibleQualities=gardenFilteredChoices('quality',model.current,model.filters?.quality,qualities,{rootMode:model.rootMode});
  const answerPart=(kind,value)=>{const result=mission.answerPart(kind,value);if(!result.ignored){if(!result.correct){run.misses++;gardenLife.wrongAnswer(kind,value,qualities);renderVitals();}gardenRewards.answer(result,kind,{x:s.x/s.width,y:Math.max(.18,s.y/s.height-.15)});pad.feedback(result.correct,{complete:result.positionComplete||result.complete,kind,value}).catch(()=>{});}};
  document.body.classList.toggle('teacher-mode',Boolean(model.separateBass));
  document.querySelector('.degrees-panel').setAttribute('aria-label',model.rootMode?'Корень аккорда относительно тоники':'Бас относительно тоники');
  $('bass-panel').hidden=!model.bassPanelNeeded;
  const visibleBasses=gardenFilteredChoices('bass',model.current,model.filters?.bass);
  $('bass-options').replaceChildren(...(model.separateBass?DEGREE_NAMES.map((name,offset)=>{const pitch=((model.exercise.baseTonic??5)+offset)%12,button=document.createElement('button'),answer=gardenAnswerState(model,'bass',offset);button.className=`degree-option${answer.selected?' selected locked':''}${visibleBasses.has(offset)?'':' filtered'}`;button.textContent=name;button.dataset.bass=String(pitch);button.dataset.bassDegree=String(offset);button.setAttribute('aria-label',`Бас ${name}`);button.setAttribute('aria-pressed',String(answer.selected));button.disabled=answer.disabled||!visibleBasses.has(offset);bindAnswerPress(button,()=>answerPart('bass',offset));return button;}):[]));
  $('teacher-key').hidden=!model.rootMode;
  $('teacher-key').textContent=`ROOT · KEY: ${gardenNoteName(model.exercise.baseTonic??5)}`;
  $('degree-options').replaceChildren(...DEGREE_NAMES.map((name,offset)=>{const button=document.createElement('button'),answer=gardenAnswerState(model,'degree',offset);button.className=`degree-option${answer.selected?' selected locked':''}${visibleDegrees.has(offset)?'':' filtered'}`;button.setAttribute('aria-pressed',String(answer.selected));button.textContent=name;button.dataset.degree=String(offset);button.disabled=answer.disabled||!visibleDegrees.has(offset);bindAnswerPress(button,()=>answerPart('degree',offset));return button;}));
  const makeQuality=quality=>{const button=document.createElement('button'),answer=gardenAnswerState(model,'quality',quality);button.className=`quality-option${answer.selected?' selected locked':''}${visibleQualities.has(quality)?'':' filtered'}`;button.setAttribute('aria-pressed',String(answer.selected));button.textContent=model.separateBass?(gardenJazzQuality(quality)||'△'):gardenQualityAnswerLabel(quality);button.title=/^\d+:/.test(quality)?'Ступень и тип верхнего аккорда; бас выбери внизу':`Тип аккорда: ${gardenQualityLabel(quality)}`;button.dataset.quality=quality;button.disabled=answer.disabled||!visibleQualities.has(quality);bindAnswerPress(button,()=>answerPart('quality',quality));return button;};
  $('quality-options').replaceChildren(...GARDEN_CORE_QUALITIES.map(makeQuality));
  $('quality-advanced-options').replaceChildren(...qualities.filter(q=>!GARDEN_CORE_QUALITIES.includes(q)).map(makeQuality));
  const advanced=qualities.filter(q=>!GARDEN_CORE_QUALITIES.includes(q));$('quality-advanced').hidden=advanced.length===0;$('quality-advanced').open=!prototypePalette||document.body.dataset.paletteLayout==='expanded';
  $('assist-status').textContent=Object.entries(model.filters||{}).filter(([,filter])=>filter).map(([kind,filter])=>`${kind==='degree'?(model.rootMode?'ROOT':'Бас'):kind==='bass'?'BASS':'Аккорды'} ${filter.maxChoices?'· '+filter.maxChoices:'×'+filter.divisor} · ${filter.remaining} ходов`).join(' / ');
  document.body.classList.toggle('infinity-active',Boolean(model.held));$('infinity-continue').hidden=!model.held||model.complete;$('infinity-continue').disabled=!model.running||s.paused;
  $('infinity-toggle').disabled=!model.running||model.complete||(!model.held&&(gardenLife.inventory.hold||0)<1);$('infinity-toggle').setAttribute('aria-pressed',String(model.held));$('infinity-status').textContent=model.held?`∞ Позиция ${model.cursor+1} · повтор до ответа`:'';const toolsSummary=document.querySelector('.flight-tools summary');if(toolsSummary){toolsSummary.classList.toggle('repeating',model.held);toolsSummary.setAttribute('aria-label',model.held?'Лотос: повтор включён — открыть управление':'Лотос: прыжки, повтор и подсказки');}
  const waitingForFinal=finalMissing&&model.running&&model.cursor>=0&&model.cursor!==finalMissing.index;
  $('answer-feedback').textContent=model.complete?'Маршрут собран · слушаем найденную гармонию дальше.':model.feedback||(waitingForFinal?`Осталась позиция ${finalMissing.index+1}: ${finalMissing.kind}. Дождись её подсветки слева.`:mayAnswer?(model.bassPanelNeeded?'Корень внизу · бас слева · тип справа':model.rootMode?'Корень внизу · тип справа · бас автоматически':'Бас и аккорд — два независимых ответа'):model.running&&model.cursor<0?'Слушаем базу':model.running?'Обе части этой позиции уже найдены':finalMissing?`Осталась позиция ${finalMissing.index+1}: ${finalMissing.kind}. Запусти последовательность.`:'Запусти последовательность');
  const referenceName=String(model.reference.degree).replace(/^БАЗА\s*/, '');
  $('mission-prompt').textContent=model.complete?`Все ${total} аккордов найдены. Подсвечены звучащий аккорд и его ступень.`:model.running?(model.cursor<0?`Тоника ${referenceName} звучит один раз перед фигурой.`:waitingForFinal?`Ждём позицию ${finalMissing.index+1} — там остался ${finalMissing.kind}.`:solved.has(model.cursor)?'Позиция заполнена — слушаем контекст.':model.bassPanelNeeded?(currentParts.degree&&currentParts.quality?'Найди бас слева.':currentParts.degree?'Корень есть. Найди тип аккорда.':'Определи корень внизу, тип справа и бас слева.'):model.rootMode?(currentParts.degree?'Корень есть. Найди тип аккорда.':'Корень внизу · тип справа · бас автоматически'):(currentParts.degree?'Бас есть. Найди аккорд.':currentParts.quality?'Аккорд есть. Найди бас.':'Определи две части текущего аккорда.')):'Тоника известна. Запусти последовательность.';
  setPlaybackIcon($('mission-toggle'),model.running);$('mission-toggle').title=model.running?'Пауза':'Продолжить';$('mission-toggle').setAttribute('aria-label',model.running?'Поставить полёт и музыку на паузу':'Продолжить полёт и музыку');$('mission-restart').hidden=true;
  if(model.complete&&!completionHandled)completeGardenLevel();
}
function bindMission(exercise){if(!exercise)return;mission?.pause();pad.stop(true);gardenRewards.reset();run.reset();resonance.reset(difficulty==='hard');currentRoute=exercise;completionHandled=false;lastMissionPosition='';mission=createGardenMission({exercise,rootMode:['medium','hard'].includes(difficulty),separateBass:difficulty==='hard',barSeconds:difficultyProfile(difficulty).barSeconds,onChange:renderMission,onChord:(chord,model)=>pad.play(chord,model.exercise.baseTonic??5,{arpeggio:model.arpeggio,arrangement:model.arrangement,barSeconds:model.barSeconds}).catch(error=>{$('answer-feedback').textContent=error.message;})});renderMission(mission.snapshot());renderVitals();}
function renderRun(){
  const r=run.snapshot(),seconds=Math.floor(r.seconds);$('run-time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;$('run-score').textContent=String(r.score);if(!r.finished)$('run-record').textContent='';
}
let activeExercises=[];
function routeTitle(route,index=0){const name=gardenRouteDisplayName(route,TOUR_NAMES[routeTour(route)]||routeTour(route));return name&&name!==route.id?name:exerciseCode(route,index);}
function renderGardenRouteList(){
  const list=$('garden-route-list');if(!list)return;
  const routes=difficulty==='light'?GARDEN_ADMISSION_ROUTES:s.tour==='favorites'?[...allBookRoutes(),...(studio?.routes||[])].filter(route=>favorites.has(routeIdentity(route))):s.tour==='reharm'?activeExercises:(studio?.routes||[]).filter(route=>(route.tour||'reharm')===s.tour);
  list.replaceChildren(...routes.map((route,index)=>{const button=document.createElement('button');button.className='garden-route-choice';button.innerHTML=`<span>${route.chapter?exerciseCode(route,index):String(route.number||index+1).padStart(2,'0')}</span><strong data-user-content></strong><small>${route.sequence.length} аккордов · ${TOUR_NAMES[routeTour(route)]||routeTour(route)}${favorites.has(routeIdentity(route))?' · ♥':''}</small>`;button.querySelector('strong').textContent=routeTitle(route,index);button.addEventListener('click',()=>launchRoute(route));return button;}));
  if(!routes.length){const empty=document.createElement('p');empty.className='garden-route-empty';empty.textContent=s.tour==='favorites'?'Нажми ♡ возле текущего маршрута — он появится здесь для точного повторного полёта.':'В этом туре пока нет последовательностей. Их можно добавить в Sound & Route Lab.';list.append(empty);}
  list.scrollTop=0;
  requestAnimationFrame(updateRoutePager);
  $('reharm-chapters').hidden=difficulty==='light'||s.tour!=='reharm';
}
function updateRoutePager(){
  const list=$('garden-route-list'),max=list.scrollHeight-list.clientHeight;
  $('route-list-pager').hidden=max<3;
  $('route-list-back').disabled=list.scrollTop<3;
  $('route-list-forward').disabled=list.scrollTop>=max-3;
  $('route-list-position').textContent=Math.min(Math.ceil(max/Math.max(1,list.clientHeight))+1,Math.round(list.scrollTop/Math.max(1,list.clientHeight))+1)+' / '+(Math.ceil(max/Math.max(1,list.clientHeight))+1);
}
$('garden-route-list').addEventListener('scroll',updateRoutePager,{passive:true});
for(const [id,delta] of [['route-list-back',-1],['route-list-forward',1]])$(id).addEventListener('click',()=>{const list=$('garden-route-list');list.scrollBy({top:delta*list.clientHeight*.85,behavior:reduced?'instant':'smooth'});});
addEventListener('resize',updateRoutePager);
function renderTourCategories(categories){
  const orbit=$('tour-orbit');if(!orbit)return;
  for(const category of categories)TOUR_NAMES[category.id]=category.name;
  const buttons=categories.map((category,index)=>{const button=document.createElement('button');button.dataset.tour=category.id;button.style.setProperty('--i',String(index));button.setAttribute('aria-label',category.name);button.setAttribute('aria-pressed',String(category.id===s.tour));button.classList.toggle('selected',category.id===s.tour);const image=document.createElement('img');image.alt='';image.src=Number.isInteger(category.mandalaSeed)?gardenMandalaDataUri(category.mandalaSeed):`assets/echo-garden/tours/${category.id}.webp`;button.append(image);const label=document.createElement('small');label.textContent=category.name;label.dataset.userContent='';button.append(label);button.addEventListener('click',()=>selectTour(category.id,category.name));return button;});
  const favoritesButton=document.createElement('button');favoritesButton.dataset.tour='favorites';favoritesButton.style.setProperty('--i',String(categories.length));favoritesButton.className='favorite-tour';favoritesButton.setAttribute('aria-label','Избранные полёты');favoritesButton.setAttribute('aria-pressed',String(s.tour==='favorites'));favoritesButton.classList.toggle('selected',s.tour==='favorites');favoritesButton.innerHTML='<span aria-hidden="true">♥</span>';favoritesButton.addEventListener('click',()=>selectTour('favorites','Избранные полёты'));buttons.push(favoritesButton);
  orbit.style.setProperty('--tour-count',String(buttons.length));orbit.replaceChildren(...buttons);for(const button of buttons){button.disabled=difficulty==='light'&&button.dataset.tour!=='reharm';}
  renderGardenRouteList();
}
function selectTour(id,name){s.tour=id;for(const item of document.querySelectorAll('[data-tour]')){const selected=item.dataset.tour===id;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));}$('mandala-tour-name').textContent=name||TOUR_NAMES[id]||id;studio?.refresh().then(renderGardenRouteList);renderGardenRouteList();}
function selectChapter(chapter=1,{bind=false}={}){s.chapter=difficulty==='light'?1:clamp(Number(chapter)||1,1,16);activeExercises=difficulty==='light'?GARDEN_ADMISSION_ROUTES:gardenExercisesForChapter(s.chapter);$('mandala-chapter').textContent=String(s.chapter).padStart(2,'0');$('exercise-select').replaceChildren(...activeExercises.map((exercise,index)=>{const option=document.createElement('option');option.value=exercise.id;option.textContent=exerciseCode(exercise,index);return option;}));if(bind&&activeExercises[0])bindMission(activeExercises[0]);for(const button of document.querySelectorAll('[data-chapter]')){const selected=Number(button.dataset.chapter)===s.chapter;button.classList.toggle('selected',selected);button.disabled=difficulty==='light';button.setAttribute('aria-pressed',String(selected));}renderGardenRouteList();}
selectChapter(1,{bind:true});
studio=new GardenSequenceStudio({
  onUse:route=>{queuedStudioRoute=route;},
  onOpen:()=>{studioPauseState=Boolean(mission?.snapshot().running);mission?.pause({preserveHold:true});pad.stop(true);s.paused=true;ui();},
  onCategories:renderTourCategories,
  onClose:()=>{if(queuedStudioRoute){const route=queuedStudioRoute;queuedStudioRoute=null;launchRoute(route);}else{if(studioPauseState){s.paused=false;mission?.start();}ui();}}
});
$('exercise-select').addEventListener('change',event=>bindMission(activeExercises.find(exercise=>exercise.id===event.target.value)));
for(let chapter=1;chapter<=16;chapter++){const button=document.createElement('button');button.dataset.chapter=String(chapter);button.textContent=String(chapter).padStart(2,'0');button.setAttribute('aria-label',`Глава ${chapter}`);button.addEventListener('click',()=>selectChapter(chapter));$('chapter-orbit').append(button);}selectChapter(1);
$('route-favorite').addEventListener('click',()=>{if(!currentRoute)return;const id=routeIdentity(currentRoute);favorites.has(id)?favorites.delete(id):favorites.add(id);saveFavorites();renderMission(mission.snapshot());if(s.tour==='favorites')renderGardenRouteList();});
for(const button of document.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>{s.mode=button.dataset.mode;for(const item of document.querySelectorAll('[data-mode]')){const selected=item===button;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));}});
function updateProgressCard(){
  $('garden-level').textContent=String(progress.level).padStart(2,'0');
  $('garden-level-progress').style.width=`${((progress.level-1)%4+1)*25}%`;
  $('garden-completed').textContent=`${progress.completed.length} ${progress.completed.length===1?'маршрут пройден':'маршрутов пройдено'}`;
}
function showGardenStart(state='menu'){
  mission?.pause();pad.stop(true);s.paused=true;keys.clear();tutorialActive=false;$('flight-tutorial').hidden=true;$('mission-complete').hidden=true;document.querySelectorAll('.tutorial-focus').forEach(el=>el.classList.remove('tutorial-focus'));document.querySelector('.flight-tools')?.removeAttribute('open');document.body.classList.remove('tutorial-open');setGardenMenu(false,{resume:false});$('game-over').hidden=true;
  document.body.classList.add('start-open');$('garden-start').hidden=false;
  // Keep the approved wordmark markup and typography from the cover template.
  $('start-note').textContent=state==='complete'?`Маршрут «${routeTitle(currentRoute)}» собран. Сад открыл следующий уровень.`:'Сад усложняет маршруты постепенно и запоминает пройденные уровни.';
  $('start-random').querySelector('strong').textContent=state==='complete'?'Следующий полёт':'Начать полёт';
  updateAdmissionCard();
  document.querySelector('.start-route-details')?.removeAttribute('open');
  updateProgressCard();ui();
}
function hideGardenStart(){document.body.classList.remove('start-open');$('garden-start').hidden=true;}
function renderTutorial(){ /* The isolated practice garden owns its UI. */ }
function updateAdmissionCard(){
  if(difficulty==='light'){
    const admission=gardenAdmissionState(progress);
    $('start-random').querySelector('strong').textContent=admission.finished?'Повторить обучение':'Учебный полёт';
    $('start-random').querySelector('small').textContent=admission.finished?'Обучение пройдено':`${admission.completed.length+1} / ${admission.total} · ${admission.next.sequence.length} аккорда`;
    $('start-note').textContent=admission.finished?'Вы зачислены в Space Music College. Продолжайте в режиме «Студент».':'Три коротких учебных маршрута. Пройдите их, чтобы поступить в Space Music College.';
  }else $('start-random').querySelector('small').textContent='Случайный маршрут';
}
function selectDifficulty(name){
  if(!['light','medium','hard'].includes(name))return;
  difficulty=name;document.body.dataset.difficulty=difficulty;document.body.classList.toggle('teacher-mode',difficulty==='hard');gardenLife.difficulty=difficultyProfile(difficulty);s.speed=gardenLife.difficulty.speed;tutorialStep=0;
  $('start-difficulty-note').textContent=difficulty==='light'?'Три учебных маршрута по 3–4 аккорда, медленное движение и защищённые запасы.':'Обычный полёт: запасы расходуются, ошибки и камни наносят урон.';
  for(const item of document.querySelectorAll('.difficulty-picker button[data-difficulty]'))item.setAttribute('aria-pressed',String(item.dataset.difficulty===difficulty));
  if(difficulty==='light')s.tour='reharm';
  for(const item of document.querySelectorAll('[data-tour]')){item.disabled=difficulty==='light'&&item.dataset.tour!=='reharm';item.setAttribute('aria-pressed',String(item.dataset.tour===s.tour));item.classList.toggle('selected',item.dataset.tour===s.tour);}
  const selectedTour=document.querySelector(`[data-tour="${s.tour}"]`);$('mandala-tour-name').textContent=selectedTour?.getAttribute('aria-label')||s.tour;
  selectChapter(s.chapter);$('start-random').querySelector('strong').textContent='Начать полёт';updateAdmissionCard();
}
for(const button of document.querySelectorAll('.difficulty-picker button[data-difficulty]'))button.addEventListener('click',()=>{if(!button.disabled)selectDifficulty(button.dataset.difficulty);});
$('enrollment-student').addEventListener('click',()=>{$('enrollment').hidden=true;selectDifficulty('medium');showGardenStart();});
$('enrollment-close').addEventListener('click',()=>{$('enrollment').hidden=true;$('start-random').focus({preventScroll:true});});
function openTutorial(){if(!trialExpired)guide?.open();}
$('tutorial-settings-open').addEventListener('click',openTutorial);
$('start-tutorial').addEventListener('click',openTutorial);
function allBookRoutes(maxChapter=16){const routes=[];for(let chapter=1;chapter<=maxChapter;chapter++)for(const route of gardenExercisesForChapter(chapter))routes.push(route);return routes;}
async function randomGardenRoute({unseenOnly=false}={}){
  if(difficulty==='light'){const admission=gardenAdmissionState(progress);if(admission.next)launchRoute(admission.next);else $('mission-complete-copy').textContent='Абитуриентский маршрут завершён. Переключись на «Студент», чтобы открыть новые полёты.';return;}
  await studio.refresh();
  const unlockedChapter=Math.min(16,1+Math.floor((progress.level-1)/2)),maxLength=Math.min(18,4+Math.floor((progress.level-1)/2));
  const book=allBookRoutes(unlockedChapter),tour=(studio.routes||[]).filter(route=>route.sequence.length<=maxLength);
  const profile=difficultyProfile(difficulty),eligible=difficulty==='light'?allBookRoutes(profile.maxChapter).filter(route=>route.sequence.length<=profile.maxLength):[...book,...tour];
  let pool=eligible.filter(route=>route.id!==progress.lastRouteId);if(unseenOnly)pool=pool.filter(route=>!progress.seenRouteIds.includes(routeIdentity(route)));
  if(unseenOnly&&!pool.length){pool=eligible.filter(route=>routeIdentity(route)!==routeIdentity(currentRoute));if(!pool.length){$('mission-complete-copy').textContent='Все доступные маршруты уже пройдены. Полёт и музыка продолжаются; выбери другой тур через меню маршрутов.';$('mission-next-route').disabled=true;return;}$('mission-complete-copy').textContent='Новых маршрутов на этом уровне больше нет. Продолжаем другим маршрутом, не начиная текущий заново.';$('mission-next-route').textContent='✦ Следующий маршрут';}
  else if(unseenOnly){$('mission-complete-copy').textContent=`«${routeTitle(currentRoute)}» завершён. Музыка продолжает идти по уже разгаданной цепочке, пока ты не выберешь следующий маршрут.`;$('mission-next-route').textContent='✦ Следующий маршрут';}
  if(!pool.length)pool=eligible;
  const route=pool[Math.floor(Math.random()*pool.length)]||gardenExercisesForChapter(1)[0];
  launchRoute(route);
}
async function launchRoute(route){
  if(!route||trialExpired)return;
  if(difficulty==='light'&&!GARDEN_ADMISSION_ROUTES.some(item=>item.id===route.id))return;
  const id=routeIdentity(route);if(!progress.seenRouteIds.includes(id)){progress.seenRouteIds.push(id);saveProgress();}
  gardenLife.difficulty=difficultyProfile(difficulty);s.speed=gardenLife.difficulty.speed;tutorialStep=0;
  hideGardenStart();$('mission-complete').hidden=true;setGardenMenu(false,{resume:false});$('game-over').hidden=true;s.gameOver=false;gardenLife.reset();renderVitals();bindMission(route);
  if(!wasTutorialDismissed()){guide.open({resume:true});return;}
  try{await pad.unlock();if(trialExpired)return;s.paused=false;mission.start();world.focus({preventScroll:true});$('answer-feedback').textContent=`Маршрут «${routeTitle(route)}» загружен`;ui();}catch(error){$('answer-feedback').textContent=error.message;s.paused=false;ui();}
}
function completeGardenLevel(){
  completionHandled=true;s.paused=false;
  const result=run.snapshot();
  try{const key='ear-yoga-local-records.v1',records=JSON.parse(localStorage.getItem(key)||'{}'),id=routeIdentity(currentRoute)+':'+difficulty+':'+(currentRoute.baseTonic??5),previous=records[id],best=!previous||result.score>previous.score;records[id]={score:Math.max(result.score,Number(previous?.score)||0),seconds:Math.min(result.seconds,Number(previous?.seconds)||Infinity)};localStorage.setItem(key,JSON.stringify(records));$('run-record').textContent=best?'★ PB':'✓';}catch{$('run-record').textContent='✓';}
  const id=currentRoute?.id||`${currentRoute?.source||'route'}:${currentRoute?.name||''}`;
  const firstClear=id&&!progress.completed.includes(id);if(firstClear){progress.completed.push(id);progress.level+=1;}progress.lastRouteId=id;
  const enrolled=difficulty==='light'&&recordGardenAdmission(progress,id);saveProgress();
  $('mission-complete-copy').textContent=`«${routeTitle(currentRoute)}» завершён. Уже разгаданные аккорды и ступени продолжают звучать по кругу; текущая позиция подсвечена.`;$('mission-next-route').disabled=false;$('mission-next-route').textContent='✓ Завершено · следующий маршрут →';$('mission-complete').hidden=false;
  if(enrolled){$('enrollment').hidden=false;$('enrollment-student').focus({preventScroll:true});}
}
async function retryCurrentMission(){
  if(!currentRoute)return;$('mission-complete').hidden=true;hideGardenStart();$('game-over').hidden=true;s.gameOver=false;gardenLife.reset();renderVitals();bindMission(currentRoute);
  try{await pad.unlock();s.paused=false;mission.start();ui();}catch(error){$('answer-feedback').textContent=error.message;}
}
function chooseState(index){
  index=clamp(Math.trunc(index),0,3);s.growth=index;s.from=s.to=index;s.visit=0;
  ui();
}
function pause(){if(trialExpired||tutorialActive)return;s.paused=!s.paused;keys.clear();if(s.paused){mission?.pause();pad.stop(true);}else mission?.start();ui();}
function clean(value){s.clean=value;document.body.classList.toggle('clean',value);$('restore').hidden=!value;(value?$('restore'):$('clean')).focus();}
function light(mode){s.lightMode=mode;if(mode==='cycle')s.cycle=Math.acos(clamp(1-2*s.night,-1,1))*180/Math.PI;if(s.paused||reduced)s.night=mode==='night'?1:mode==='dusk'?.48:mode==='day'?0:s.night;ui();}
for(const b of document.querySelectorAll('[data-light]'))b.addEventListener('click',()=>light(b.dataset.light));
$('pause').addEventListener('click',pause);$('lantern').addEventListener('click',()=>{s.lantern=!s.lantern;ui();});
$('clean').addEventListener('click',()=>clean(true));$('restore').addEventListener('click',()=>clean(false));
function setGardenMenu(open,{resume=true}={}){
  const wasOpen=document.body.classList.contains('world-open');
  if(open&&!wasOpen){menuWasRunning=Boolean(mission?.snapshot().running)&&!s.paused;mission?.pause({preserveHold:true});pad.stop(true);s.paused=true;}
  document.body.classList.toggle('world-open',open);$('world-controls').setAttribute('aria-expanded',String(open));
  if(!open&&wasOpen){const backToStart=resume&&menuFromStart,continueFlight=resume&&menuWasRunning&&!tutorialActive&&!s.gameOver;menuWasRunning=false;menuFromStart=false;if(backToStart){showGardenStart();return;}if(continueFlight){s.paused=false;mission?.start();}}
  if(open)requestAnimationFrame(updateRoutePager);
  ui();
}
$('world-controls').addEventListener('click',()=>setGardenMenu(!document.body.classList.contains('world-open')));
$('menu-close').addEventListener('click',()=>setGardenMenu(false));
function closeExitConfirmation(resume){$('exit-confirm').hidden=true;if(resume&&exitWasRunning){s.paused=false;mission.start();}exitWasRunning=false;world.focus({preventScroll:true});ui();}
$('garden-home').addEventListener('click',()=>{const model=mission.snapshot();if(!currentRoute||model.complete||s.gameOver){showGardenStart();return;}exitWasRunning=model.running&&!s.paused;mission.pause({preserveHold:true});pad.stop(true);s.paused=true;keys.clear();$('exit-confirm').hidden=false;$('exit-cancel').focus({preventScroll:true});ui();});
$('exit-cancel').addEventListener('click',()=>closeExitConfirmation(true));
$('exit-accept').addEventListener('click',()=>{closeExitConfirmation(false);showGardenStart();});
$('start-random').addEventListener('click',randomGardenRoute);
$('start-menu').addEventListener('click',()=>{menuFromStart=true;hideGardenStart();setGardenMenu(true);});
$('start-choose').addEventListener('click',async()=>{menuFromStart=true;hideGardenStart();await studio.refresh();renderGardenRouteList();setGardenMenu(true);});
$('mission-next-route').addEventListener('click',()=>randomGardenRoute({unseenOnly:true}));
$('mission-to-menu').addEventListener('click',()=>showGardenStart());
$('retry-mission').addEventListener('click',retryCurrentMission);
$('library-open').addEventListener('click',()=>studio.open());$('studio-close').addEventListener('click',()=>studio.close());$('studio-capture').addEventListener('click',()=>studio.toggleCapture());$('studio-save').addEventListener('click',()=>studio.save());
$('mission-toggle').addEventListener('click',async()=>{const model=mission.snapshot();if(model.running){s.paused=true;keys.clear();mission.pause({preserveHold:true});pad.stop(true);ui();return;}try{await pad.unlock();s.paused=false;mission.start();ui();}catch(error){$('answer-feedback').textContent=error.message;}});
$('mission-restart').addEventListener('click',()=>{gardenRewards.reset();run.reset();resonance.reset(difficulty==='hard');mission.restart();s.paused=false;ui();});
for(const [kind,spec] of Object.entries(GARDEN_ITEMS).filter(([,item])=>item.artifact)){
  const button=document.createElement('button'),badge=document.createElement('b');
  button.dataset.useArtifact=kind;button.title=spec.label;button.setAttribute('aria-label',spec.label);
  if(spec.navigationDelta)button.append(document.createTextNode(`${spec.navigationDelta>0?'+':'−'}${Math.abs(spec.navigationDelta)}`));
  else if(spec.assist&&!spec.assist.reveal&&!spec.sprite){const canvas=document.createElement('canvas');canvas.width=canvas.height=80;canvas.setAttribute('aria-hidden','true');const icon=canvas.getContext('2d');icon.translate(40,40);drawGardenAssistGlyph(icon,spec,72);button.append(canvas);}else{const image=document.createElement('img');image.src=`assets/echo-garden/collectibles/${spec.sprite}.webp`;image.alt='';image.style.filter=spec.visualFilter||'none';image.width=image.height=32;button.append(image);if(spec.repeat){const mark=document.createElement('span');mark.className='repeat-artifact-mark';mark.textContent='∞';button.append(mark);}}
  button.append(badge);$(spec.navigationDelta?'jump-charges':'assist-charges').append(button);
}
const flightTools=document.createElement('details'),flightToolsSummary=document.createElement('summary'),flightToolsBody=document.createElement('div');
flightTools.open=false;
flightTools.className='flight-tools';flightToolsSummary.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 31C9 26 9 15 20 7C31 15 31 26 20 31Z"/><path d="M20 31C8 31 3 22 5 14C14 15 20 22 20 31ZM20 31C32 31 37 22 35 14C26 15 20 22 20 31Z"/><path d="M20 31C10 36 3 29 2 24C10 23 16 25 20 31ZM20 31C30 36 37 29 38 24C30 23 24 25 20 31Z"/></g></svg><span class="lotus-repeat" aria-hidden="true">∞</span>';flightToolsSummary.setAttribute('aria-label','Лотос: прыжки, повтор и подсказки');flightToolsBody.className='flight-tools-body';
flightToolsBody.append($('jump-charges'),document.querySelector('.route-practice'),$('assist-charges'),$('assist-status'));flightTools.append(flightToolsSummary,flightToolsBody);document.body.append(flightTools);$('artifact-belt').hidden=true;
document.addEventListener('click',async event=>{const button=event.target.closest('[data-use-artifact]');if(!button||button.disabled||s.paused||!mission?.snapshot().running)return;const kind=button.dataset.useArtifact;if(GARDEN_ITEMS[kind].repeat){try{await pad.unlock();if(!s.paused)gardenLife.useRepeat(mission,kind);}catch(error){$('answer-feedback').textContent=`Не удалось включить повтор: ${error.message}`;}}else if(GARDEN_ITEMS[kind].navigationDelta)gardenLife.useJump(mission,kind);else{const result=gardenLife.useAssist(mission,kind);if(result.correct&&!result.ignored){gardenRewards.answer(result,'quality',{x:s.x/s.width,y:Math.max(.18,s.y/s.height-.15)});pad.feedback(true,{kind:'quality',complete:result.positionComplete}).catch(()=>{});}}renderVitals();});
$('infinity-continue').addEventListener('click',async()=>{if(s.paused||!mission.snapshot().running)return;try{await pad.unlock();mission.continue();flightTools.open=false;renderVitals();}catch(error){$('answer-feedback').textContent=`Не удалось продолжить: ${error.message}`;}});
$('infinity-toggle').addEventListener('click',async()=>{try{await pad.unlock();const result=gardenLife.useRepeat(mission);if(result.ignored){$('answer-feedback').textContent='Сначала поймай лотос бесконечности';return;}flightTools.open=false;renderVitals();}catch(error){$('answer-feedback').textContent=`Не удалось включить звук: ${error.message}`;}});
document.addEventListener('pointerdown',event=>{if(flightTools.open&&!flightTools.contains(event.target))flightTools.open=false;},true);
flightToolsBody.addEventListener('click',event=>{if(event.target.closest('button')&&!event.target.closest('button').disabled)flightTools.open=false;});
const flowerSettings=document.createElement('details'),flowerSettingsSummary=document.createElement('summary');
flowerSettings.className='flower-settings';flowerSettingsSummary.textContent='Цветы аранжировки · справочник и проба';
const assistGuide=document.createElement('section');assistGuide.className='assist-guide';assistGuide.innerHTML='<h3>Артефакты внимания</h3>';for(const [kind,spec] of Object.entries(GARDEN_ITEMS).filter(([,item])=>item.assist||item.shield||item.restoration)){const row=document.createElement('p');row.textContent=spec.restoration?'Колесо жизни — редкий вращающийся цветок. Подбор сразу восстанавливает все четыре запаса до 100%; чаще появляется у конца маршрута при критическом истощении, но спасение не гарантировано.':spec.label;row.style.setProperty('--artifact-color',spec.color);assistGuide.append(row);}flowerSettings.append(flowerSettingsSummary,assistGuide,$('flower-guide'));$('settings-panel').append(flowerSettings);$('flower-guide').hidden=false;
$('flower-guide-toggle').hidden=true;
$('flower-guide-close').addEventListener('click',()=>{flowerSettings.open=false;});
$('flower-guide-list').replaceChildren(...Object.entries(GARDEN_ARRANGEMENTS).map(([style,spec])=>{const item=document.createElement('article'),canvas=document.createElement('canvas');canvas.width=canvas.height=72;const icon=canvas.getContext('2d');icon.translate(36,36);drawGardenArrangementFlower(icon,spec,66,2);const copy=document.createElement('p');copy.textContent=`${spec.label} — ${spec.detail}`;const button=document.createElement('button');button.textContent='Вырастить на пути';button.setAttribute('aria-label',`Вырастить: ${spec.label}`);button.addEventListener('click',()=>{if(!mission.snapshot().running){$('flower-guide-note').textContent='Сначала запусти музыкальный полёт.';return;}if(gardenLife.entities.some(entity=>entity.item.arrangement&&!entity.collected)){ $('flower-guide-note').textContent='Цветок уже летит. Поймай его или пропусти.';return;}gardenLife.forceSpawn(style,{x:tx,y:Math.max(.06,ty-.30),rounds:Number($('flower-rounds').value),vx:0});flowerSettings.open=false;setGardenMenu(false);});item.append(canvas,copy,button);return item;}));
$('artifact-belt').addEventListener('click',event=>{if(event.target.closest('[data-use-artifact]')&&(s.paused||!mission.snapshot().running))event.stopImmediatePropagation();},true);
for(const button of document.querySelectorAll('[data-pad]'))button.addEventListener('click',()=>{pad.applyPreset(button.dataset.pad);for(const item of document.querySelectorAll('[data-pad]'))item.setAttribute('aria-pressed',String(item===button));});
const audioTuning=[['garden-volume','smc-garden-volume',value=>{pad.setMasterVolume(value/100);return `${value}%`;},120],['garden-eq-low','smc-garden-eq-low',value=>{pad.setEqualizer('low',value);return `${value} dB`;},0],['garden-eq-mid','smc-garden-eq-mid',value=>{pad.setEqualizer('mid',value);return `${value} dB`;},0],['garden-eq-high','smc-garden-eq-high',value=>{pad.setEqualizer('high',value);return `${value} dB`;},0]];
for(const [id,key,apply,fallback] of audioTuning){const control=$(id),output=document.querySelector(`output[for="${id}"]`);let saved=Number(localStorage.getItem(key));if(!Number.isFinite(saved)||saved<Number(control.min)||saved>Number(control.max))saved=fallback;control.value=String(saved);const update=()=>{const value=Number(control.value);output.textContent=apply(value);localStorage.setItem(key,String(value));};control.addEventListener('input',update);update();}
function move(x,y){tx=clamp(x/s.width,.1,.9);ty=clamp(y/s.height,.2,.78);$('gesture').classList.add('dismissed');}
world.addEventListener('pointerdown',e=>{if(e.button!==0||dragId!==null)return;dragId=e.pointerId;world.setPointerCapture(dragId);move(e.clientX,e.clientY);world.focus({preventScroll:true});});
world.addEventListener('pointermove',e=>{if(e.pointerId===dragId)move(e.clientX,e.clientY);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])world.addEventListener(name,e=>{if(e.pointerId===dragId)dragId=null;});
addEventListener('keydown',e=>{
  if($('recording-result').open||e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,select,textarea,[contenteditable="true"]')||e.repeat&&['Space','KeyH'].includes(e.code))return;
  if(e.code==='Escape'&&!$('exit-confirm').hidden){e.preventDefault();closeExitConfirmation(true);return;}
  const cockpit=$('garden-start').hidden&&!document.body.classList.contains('world-open')&&!tutorialActive&&$('exit-confirm').hidden;
  if(!cockpit){if(e.code==='Escape'&&document.body.classList.contains('world-open'))setGardenMenu(false);return;}
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){e.preventDefault();keys.add(e.code);$('gesture').classList.add('dismissed');}
  if(e.code==='Space'){e.preventDefault();$('mission-toggle').click();}if(e.code==='KeyH')clean(!s.clean);if(e.code==='Escape'&&s.clean)clean(false);
},true);
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();dragId=null;});
document.addEventListener('visibilitychange',()=>{last=0;keys.clear();if(document.hidden){mission?.pause();pad.stop(true);s.paused=true;cancelAnimationFrame(raf);raf=0;}else{ui();if(!raf)raf=requestAnimationFrame(frame);}});
addEventListener('pagehide',()=>{mission?.pause();pad.stop(true);});
function update(dt,clockDt=dt){
  if(s.paused)return;
  s.time=mod(s.time+dt,Math.PI*2000);s.visit+=dt;
  s.travel=mod(s.travel+dt*s.speed*18,100000);
  s.scroll=mod(s.scroll+dt*s.speed*18/s.worldSize,2);
  gardenRewards.step(dt,{ground:dt*s.speed*18/s.height});
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
  run.tick(clockDt,Boolean(missionState?.running&&missionState.cursor>=0&&!s.gameOver));renderRun();
  if(!missionState?.complete)gardenLife.update(dt,{...s,clockDt,barSeconds:missionState?.barSeconds,separateBass:Boolean(missionState?.bassPanelNeeded),routeLength:missionState?.exercise.sequence.length||0,remainingChords:missionState?.progress.filter(part=>!part.degree||!part.quality||(missionState.separateBass&&!part.bass)).length??0,active:Boolean(missionState?.running),flying:!s.paused,answering:Boolean(missionState?.running&&missionState.cursor>=0)});
  const lifeState=gardenLife.snapshot();
  resonance.update(dt,{clockDt,width:s.width,height:s.height,x:s.x,y:s.y,ship:s.ship,barSeconds:missionState?.barSeconds,active:Boolean(missionState?.running),paused:s.paused,complete:missionState?.complete,solvedChords:missionState?.solved.length??0,totalChords:missionState?.exercise.sequence.length??0,sounding:pad.sounding,audioTime:pad.context?.currentTime,chapter:missionState?.exercise.chapter,tensionMode:missionState?.exercise.tensionMode});
  if((lifeState.gameOver||resonance.gameOver)&&!s.gameOver){s.gameOver=true;s.paused=true;mission?.pause();pad.stop(true);$('game-over').querySelector('span').textContent=resonance.gameOver?'O₂ · 0':'КРИТИЧЕСКОЕ СТОЛКНОВЕНИЕ';$('game-over').hidden=false;}
  const shake=lifeState.impact||0,shakeX=Math.sin(s.time*83)*shake*7,shakeY=Math.cos(s.time*71)*shake*5;
  document.documentElement.style.setProperty('--impact-x',`${shakeX.toFixed(2)}px`);document.documentElement.style.setProperty('--impact-y',`${shakeY.toFixed(2)}px`);
  document.body.classList.toggle('garden-impact',shake>.05);
  const hazardForce=gardenLife.getFlightForce();
  tx=clamp(tx+hazardForce.x*dt,.1,.9);ty=clamp(ty+hazardForce.y*dt,.2,.78);
  if(lifeState.event?.id!==lastCollisionEvent&&['crater','stoneAsteroid','porousAsteroid','crystalAsteroid','lavaAsteroid'].includes(lifeState.event?.kind)){
    lastCollisionEvent=lifeState.event.id;
    tx=clamp(tx+hazardForce.x*.11,.1,.9);ty=clamp(ty+hazardForce.y*.11,.2,.78);
    collisionThud();navigator.vibrate?.(35);
  }
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
  gardenRewards.draw(ctx,s.width,s.height);
  if(new URLSearchParams(location.search).has('qa')){life.dataset.rewards=JSON.stringify(gardenRewards.snapshot());life.dataset.arrangement=JSON.stringify({status:mission?.snapshot().arrangementStatus||{},events:pad.lastArrangement||[],pickups:gardenLife.snapshot().entities.filter(item=>GARDEN_ITEMS[item.kind]?.arrangement)});}
  gardenLife.draw(ctx,s);
  resonance.draw(ctx,s.width,s.height);
}
let uiTick=0;
function frame(now){
  raf=0;if(document.hidden)return;
  const frameMs=last?now-last:0,dt=Math.min(.05,frameMs/1000);last=now;
  if(mobileGraphics&&frameMs>0&&frameMs<250){slowFrameAverage=slowFrameAverage*.98+frameMs*.02;if(++graphicsSamples>180&&slowFrameAverage>27&&renderScale>1.1){renderScale=1.1;resize();}}
  if(s.ready&&!document.body.classList.contains('start-open')){update(dt,Math.min(.5,frameMs/1000));renderer.render({...s,lantern:s.lantern&&s.ship!==2});atmosphere();if(now-uiTick>200){ui();renderVitals();const model=mission.snapshot();$('bar-countdown').textContent=model.running?`${Math.max(0,(model.deadline-performance.now())/1000).toFixed(1)} сек`:`${model.barSeconds.toFixed(1)} сек`;uiTick=now;}}
  raf=requestAnimationFrame(frame);
}
async function load(){
  const lifeFiles=[...new Set(Object.values(GARDEN_ITEMS).map(item=>item.sprite).filter(Boolean))];
  const paths=[...STATES.map(x=>x.file),'manta','lotus',...lifeFiles.map(file=>`collectibles/${file}`)];
  const loadImage=file=>new Promise((resolve,reject)=>{
    const img=new Image(),timeout=setTimeout(()=>reject(Error(`Слишком долгая загрузка: ${file}. Попробуй снова.`)),20000);
    img.onload=()=>{clearTimeout(timeout);$('load-progress').textContent=`Готово ${++loaded} из ${paths.length}`;resolve(img);};img.onerror=()=>{clearTimeout(timeout);reject(Error(`Не загрузился пейзаж: ${file}. Попробуй снова.`));};
    const asset=window.GARDEN_ASSETS?.[file]||`assets/echo-garden/${file}.${file==='collectibles/meteor-volcanic'?'png':'webp'}`;img.src=!asset.startsWith('data:')&&(file==='manta'||file==='lotus')?`${asset}${asset.includes('?')?'&':'?'}cutout=2`:asset;
  });
  images=await Promise.all(paths.slice(0,6).map(loadImage));
  renderer=createGardenRenderer(world,shipLayer,images.slice(0,6));
  // Optional items must not block launch; install each sprite as it arrives.
  const spriteImages={};
  for(const file of lifeFiles)loadImage(`collectibles/${file}`).then(image=>{spriteImages[file]=image;gardenLife.setImages(spriteImages);}).catch(()=>{});
  s.ready=true;$('loading').hidden=true;dispatchEvent(new Event('garden-ready'));
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
window.gardenFlight=Object.freeze({snapshot:()=>({...s,keys:keys.size,particles:motes.length,graphics:renderer?.diagnostics(),mission:mission.snapshot(),life:gardenLife.snapshot(),resonance:resonance.snapshot(),lastTension:pad.lastTension&&{...pad.lastTension},progress:{...progress},currentRoute:currentRoute?.id}),advanceChord:()=>mission.advance(),spawnCollectible:kind=>gardenLife.forceSpawn(kind,{x:.5,y:.22}),spawnTension:(label,options)=>resonance.spawn(label,options),showMenu:()=>showGardenStart(),randomRoute:()=>randomGardenRoute()});
if(new URLSearchParams(location.search).get('qa')==='infinity'&&['127.0.0.1','localhost'].includes(location.hostname)){
 const probe=document.createElement('button');probe.id='qa-repeat-pickup';probe.textContent='Проверка: выпустить лотос ∞';probe.style.cssText='position:fixed;left:12px;bottom:180px;z-index:60;color:#d9edcd;background:#102922;border:1px solid #799e84;padding:8px';
 probe.addEventListener('click',()=>{if(!mission.snapshot().running)return;gardenLife.forceSpawn('hold',{x:s.x/s.width,y:s.y/s.height-.12,vx:0});});document.body.append(probe);
}

document.body.append($('language-toggle'));
language=createLanguage();
mountGardenRecording({pad,language,onStart:()=>setGardenMenu(false),onReady:()=>{mission?.pause({preserveHold:true});pad.stop(true);s.paused=true;keys.clear();ui();}});
$('settings-language').onclick=()=>language.toggle();
language.add(Object.fromEntries(Object.entries(GARDEN_ITEMS).map(([kind,spec])=>[spec.label,guideItemName(kind,true)])));
language.add(Object.fromEntries(Object.entries(GARDEN_ARRANGEMENTS).map(([kind,spec])=>[spec.label+' — '+spec.detail,guideItemName(kind,true)+' — '+guideItemCopy(kind,true)])));
guide=createGuide({
 language,
 onEnter:state=>{
   const back={resume:state?.resume??(mission.snapshot().running||menuWasRunning),start:!$('garden-start').hidden,menu:document.body.classList.contains('world-open'),menuFromStart};
   tutorialActive=true;mission.pause({preserveHold:true});pad.stop(true);s.paused=true;keys.clear();
   setGardenMenu(false,{resume:false});hideGardenStart();return back;
 },
 onExit:back=>{
   tutorialActive=false;tutorialDismissed=true;renderMission(mission.snapshot());
   if(!trialExpired){if(back?.start&&!back?.resume)showGardenStart();else{hideGardenStart();s.paused=!back?.resume;if(back?.resume)mission.start();if(back?.menu){setGardenMenu(true);menuFromStart=back.menuFromStart;}ui();}}
 },
 play:async(chord,tonic,options)=>{if(trialExpired)return;await pad.unlock();if(!trialExpired&&tutorialActive)await pad.play(chord,tonic,options);},
 stop:()=>pad.stop(true)
});
let trialStorage;try{trialStorage=localStorage;}catch{trialStorage={getItem(){return null;},setItem(){throw Error('storage unavailable');}};}
trial=createTrial(trialStorage);
function checkTrial(){
 const state=trial.check(),pick=language.pick;
 const date=new Intl.DateTimeFormat(language.get()==='en'?'en-GB':'ru-RU').format(state.expiresAt);
 $('trial-status').textContent=pick('Тестовая сборка','Preview')+(globalThis.GARDEN_VERSION?' '+globalThis.GARDEN_VERSION:'')+pick(' · до ',' · until ')+date+pick(' · осталось дней: ',' · days left: ')+state.daysLeft+(state.persistent?'':pick(' · браузер не сохраняет срок',' · browser cannot save the trial date'));
 $('trial-title').textContent=pick('Ознакомительный период завершён','Your preview period has ended');
 $('trial-copy').textContent=pick('Спасибо за полёты в EAR YOGA. Запросите новую версию у автора приложения. Ваши маршруты и прогресс сохранены.','Thank you for flying with EAR YOGA. Request a new version from the app creator. Your routes and progress are preserved.');
 $('trial-dates').textContent=pick('60 дней · завершение: ','60 days · ended: ')+date;
 $('trial-language').textContent=pick('English','Русский');
 if(state.expired){
   trialExpired=true;guide.close();mission?.pause({preserveHold:true});pad.stop(true);s.paused=true;keys.clear();
   $('trial-expired').hidden=false;
   for(const el of document.body.children)if(el!==$('trial-expired')&&el.tagName!=='SCRIPT')el.inert=true;
 }
 return state;
}
$('trial-language').onclick=()=>language.toggle();
language.onChange(checkTrial);checkTrial();
setInterval(checkTrial,30000);
document.addEventListener('visibilitychange',checkTrial);
document.addEventListener('click',event=>{if(trialExpired&&!$('trial-expired').contains(event.target)){event.preventDefault();event.stopImmediatePropagation();}},true);
document.addEventListener('keydown',event=>{if(trialExpired&&!$('trial-expired').contains(event.target)){event.preventDefault();event.stopImmediatePropagation();}},true);
window.earYoga=Object.freeze({guide:()=>guide.snapshot(),trial:()=>trial.check(),language:()=>language.get()});
ui();renderVitals();updateProgressCard();load().then(checkTrial).catch(error);
