import {MELODY_BANK,GENRE_COUNTS} from './melody-bank.mjs';
import {createIntelligence} from './intelligence.mjs';
import {createDebrief} from './debrief.mjs';
import {createMelodyLibrary} from './melody-library.mjs';
import {createStandardsLibrary} from './standards-library.mjs';
import {DEGREES,QUALITIES,INTERVALS,SECTORS,createRoute,createBookRoute,bookRoutesForChapter,answerResult,family,QUALITY_BANKS,chordSymbol,chordAnswerKey,chordNotes} from './music.mjs';
import {FlightAudio} from './audio.mjs';
import {loadFlightImage} from './assets-loader.mjs';
import {installLanguage} from './i18n.mjs';
import {pressure,formation,stepDrone,hitCircle} from './combat.mjs';
import {INTERVAL_TARGETS,INTERVAL_MODES,targetForSector,createCapsule,capsuleOutcome} from './intervals.mjs';
import {PILOTS,ARTIFACTS,NUMBER_LABELS,NUMBER_OFFSETS,NOTE_NAMES,RHYTHMS,RHYTHM_HINTS,RHYTHM_LEVELS,RUDIMENTS,rudimentScore,createExpedition} from './expedition.mjs';
import {createGardenRenderer} from './garden-flight-renderer.mjs';

const intelligence=createIntelligence(localStorage);
const $=id=>document.getElementById(id);
const canvas=$('space'),ctx=canvas.getContext('2d'),audio=new FlightAudio();
function syncViewportHeight(){
  const height=Math.round(window.visualViewport?.height||window.innerHeight||0);
  if(height)document.documentElement.style.setProperty('--app-height',`${height}px`);
}
syncViewportHeight();
window.addEventListener('resize',syncViewportHeight,{passive:true});
window.addEventListener('orientationchange',syncViewportHeight,{passive:true});
window.visualViewport?.addEventListener('resize',syncViewportHeight,{passive:true});
window.visualViewport?.addEventListener('scroll',syncViewportHeight,{passive:true});
const deckSetting=new URLSearchParams(location.search).get('deck');
// The flight surface now continues behind the translucent answer deck on
// every device. Keep ?deck=0 as a temporary comparison switch while tuning.
const floatingDeck=deckSetting!=='0';
document.querySelector('.cabinet').classList.toggle('floating-deck',floatingDeck);
let deckHeight=0;
function playableHeight(){return Math.max(180,H-deckHeight);}
function measureDeck(){
  const cabinet=document.querySelector('.cabinet'),flight=canvas.getBoundingClientRect(),dock=document.querySelector('.cockpit').getBoundingClientRect();
  deckHeight=floatingDeck&&flight.width?Math.max(0,flight.bottom-dock.top)*480/flight.width:0;
  cabinet.style.setProperty('--deck-height',`${Math.max(0,flight.bottom-dock.top)}px`);
}
new ResizeObserver(measureDeck).observe(document.querySelector('.cockpit'));
const SAMSARA_ART=['guitar','keytar','bass','overdrive','tongue','cymbal','drum-machine','trumpet','drums','vibraphone','submarine'];
const SAMSARA_CAST=['guitarist','keyboardist','drummer','vibraphonist','beatmaker','bassist','trumpeter'];
const SAMSARA_TEXTURES=['blue-gardens','night-bloom','white-thaw'];
const SAMSARA_PICKUPS=['fuel-seed','water-pearl','crew-berries','repair-lotus'];
const imageNames=['artifact-drum-engine','artifact-rudiments','samsara-guardians','samsara-lotus','note-cube','note-drum','turret-base','turret-barrel','turret-ruin','concert-trumpet-v65','concert-guitar-v65','concert-keys-v65','concert-drums-v65','crate-bass','crate-roulette','crate-trumpet','crate-vibraphone','artifact-guitar','artifact-keytar','artifact-pedal','artifact-cymbal','artifact-yellow-submarine','hydra','enemyships','corvette','fortress','drummachine','trumpeter','keytarist','guitarist','drummer','drummergirl','vibraphonist','keytarExact','guitarExact','band','ship','terrain','drone','moon','mars',...SAMSARA_ART.map(name=>`samsara-art-${name}`),...SAMSARA_CAST.map(name=>`samsara-cast-${name}`),...SAMSARA_TEXTURES.map(name=>`samsara-tex-${name}`),...SAMSARA_PICKUPS.map(name=>`samsara-pickup-${name}`)];
const images=Object.fromEntries(imageNames.map(name=>[name,new Image()]));
let samsaraGround=null,samsaraCanvas=null,samsaraShipCanvas=null;
async function prepareSamsara(){
  const names=[...SAMSARA_TEXTURES.map(name=>`samsara-tex-${name}`),...SAMSARA_ART.map(name=>`samsara-art-${name}`),...SAMSARA_CAST.map(name=>`samsara-cast-${name}`),...SAMSARA_PICKUPS.map(name=>`samsara-pickup-${name}`),'samsara-guardians','samsara-lotus'];
  await prepareFlightImages(()=>{},names,true);
  if(samsaraGround)return;
  samsaraCanvas=document.createElement('canvas');samsaraCanvas.width=480;samsaraCanvas.height=Math.ceil(H);
  samsaraShipCanvas=document.createElement('canvas');samsaraShipCanvas.width=480;samsaraShipCanvas.height=Math.ceil(H);
  const paints=SAMSARA_TEXTURES.map(name=>images[`samsara-tex-${name}`]);
  try{samsaraGround=createGardenRenderer(samsaraCanvas,samsaraShipCanvas,[...paints,paints[0],images['samsara-lotus'],images['samsara-lotus']]);}
  catch(error){console.warn('Samsara terrain shader unavailable; showing botanical texture.',error);}
}
const coreImageNames=['hydra','enemyships','corvette','fortress','ship','terrain','drone','moon','mars'];
const optionalImageNames=imageNames.filter(name=>!coreImageNames.includes(name));
const imageUrl=name=>name.startsWith('samsara-art-')?`assets/samsara/${name.slice(12)}.webp`:name.startsWith('samsara-cast-')?`assets/samsara/${name.slice(13)}.webp`:name.startsWith('samsara-tex-')?`assets/echo-garden/${name.slice(12)}.webp`:name.startsWith('samsara-pickup-')?`assets/echo-garden/collectibles/${name.slice(15)}.webp`:['artifact-drum-engine','artifact-rudiments'].includes(name)?`assets/${name}.png`:name==='samsara-guardians'?'assets/samsara/guardians.png':name==='samsara-lotus'?'assets/echo-garden/lotus.webp':['keytarExact','guitarExact'].includes(name)?`assets/${name==='keytarExact'?'keytar-exact':'guitar-exact'}.svg`:`assets/${name}.webp`;
async function prepareFlightImages(onProgress=()=>{},names=coreImageNames,strict=true){
  let ready=0;const entries=names.map(name=>[name,images[name]]);
  const results=await Promise.allSettled(entries.map(async([name,img])=>{await loadFlightImage(img,imageUrl(name));onProgress(++ready,entries.length);}));
  const failure=results.find(result=>result.status==='rejected');if(strict&&failure)throw failure.reason;
}
function warmOptionalImages(){return prepareFlightImages(()=>{},optionalImageNames,false);}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const BASE_SHIELD=12,MAX_SHIELD=20;
const PLANET_CHOICE_KEY='ear-reharm-game.planet.v1';
const PLANETS=[
  {id:'original',number:'01',title:'Выжженная орбита',description:'Луна и Марс · каменные равнины и боевой маршрут.',available:true,tone:'rust'},
  {id:'garden',number:'02',title:'Сад Эха',description:'Ambient chill · живая река, биолюминесценция и гармонические маршруты.',available:true,tone:'garden',ambient:'garden-flight.html'},
  {id:'samsara',number:'03',title:'Самсара',description:'Музыканты, цветочные мандалы и боевой полёт сквозь живой сад.',available:true,tone:'samsara'},
  {id:'ocean',number:'04',title:'Океан Линз',description:'Водный мир · отражения, течения и длинные гармонии.',available:false,tone:'ocean'},
  {id:'ice',number:'05',title:'Ледяной архив',description:'Белая тишина · замёрзшие сигналы и хрупкие интервалы.',available:false,tone:'ice'},
  {id:'desert',number:'06',title:'Янтарная пустыня',description:'Слоистые каньоны · редкие источники света и воздуха.',available:false,tone:'desert'},
  {id:'night',number:'07',title:'Ночная теплица',description:'Грибы, светлячки и полностью фосфоресцирующая ночь.',available:false,tone:'night'},
];
function savedPlanetChoice(){
  try{
    // BUILD 080 accidentally stored the standalone Echo Garden as a skin for
    // the combat flight. Migrate that sticky value back to the original world.
    const value=localStorage.getItem(PLANET_CHOICE_KEY);
    if(value==='seasons'||value==='garden')localStorage.setItem(PLANET_CHOICE_KEY,'original');
    if(value==='samsara')return 'samsara';
  }catch{}
  return 'original';
}
const planetTitle=()=>PLANETS.find(planet=>planet.id===s.planetChoice)?.title||PLANETS[0].title;
let W=480,H=590,last=0,clock=0,previousMode='active',lessonIndex=0,lessonItems=[],runToken=0,qualityBank=0,weaponTab='bass';
const s={mode:'start',planetChoice:savedPlanetChoice(),runLevel:0,sector:0,route:null,routeNumber:0,position:0,cleared:0,totalCleared:0,score:0,combo:0,health:BASE_SHIELD,maxHealth:BASE_SHIELD,power:1,
  listening:false,enemy:null,bullets:[],shots:[],particles:[],beam:0,flash:0,shotTimer:0,invulnerable:0,
  fireTimer:0,resolveTimer:0,attempts:0,correct:0,firstTry:0,replays:0,stats:{bass:{hit:0,miss:0},quality:{hit:0,miss:0}},
  drones:[],waveTimer:0,waveIndex:0,overdrive:0,energy:0,rings:[],travel:0,groundScrollDelta:0,groundCombat:false,hydraBlast:null,shake:0,debris:[],droneKills:0,
  capsule:null,capsuleTimer:0,intervalStats:{caught:0,wrong:0,missed:0,avoided:0},
  bookMission:null,player:{x:240,y:500,tx:240,ty:500},keys:new Set(),pointer:null,feedbackTimer:0};
const SAMSARA_RELICS=['guitar','keytar','bass','overdrive','tongue','cymbal','drum-machine','trumpet','keytar','guitar','drums','vibraphone','submarine'];
const SAMSARA_FORCES=[
  {name:'Лучники',color:'#7be3d2',speed:36,fire:3.8,radius:25},
  {name:'Всадники',color:'#d9c99d',speed:64,fire:5.2,radius:39},
  {name:'Огнеметатели',color:'#ff9a53',speed:34,fire:4.2,radius:28},
  {name:'Колдуны',color:'#be9bff',speed:29,fire:4.6,radius:27}
];
const SAMSARA_COUNTER={0:0,1:3,2:1,3:2,4:-1,5:-1,6:2,7:0,8:3,9:0,10:2,11:3,12:1};
const SAMSARA_HARMONY=[
  {kind:'arpeggio',name:'Арпеджио · один гармонический круг',sprite:'arpeggio-flower'},
  {kind:'restart',name:'Начать с тоники',sprite:'root-flower'},
  {kind:'hold',name:'Мёбиус · удержать аккорд',sprite:'hold-flower'},
  {kind:'holdArpeggio',name:'Удержать арпеджио',sprite:'hold-arpeggio-flower'},
  {kind:'midpoint',name:'Начать с середины',sprite:'midpoint-seed'}
];
const emptySamsaraInventory=()=>Object.fromEntries(SAMSARA_HARMONY.map(item=>[item.kind,0]));
s.samsaraVitals={fuel:86,energy:78,crew:90};s.samsaraInventory=emptySamsaraInventory();s.samsaraHeld=null;
s.samsaraForces=[];s.samsaraForceTimer=5;s.samsaraForceIndex=0;s.samsaraPickups=[];s.samsaraPickupTimer=2.5;s.samsaraArtifactTimer=6;s.samsaraArtifactIndex=0;s.samsaraHudTimer=0;
document.body.classList.toggle('samsara-world',s.planetChoice==='samsara');
function changeSamsaraResource(name,delta){if(s.planetChoice!=='samsara')return;s.samsaraVitals[name]=clamp(s.samsaraVitals[name]+delta,0,100);renderSamsaraResources();}
function renderSamsaraResources(){
  const active=s.planetChoice==='samsara',panel=$('samsara-vitals');panel.hidden=!active;$('samsara-artifacts').hidden=!active;
  if(!active)return;
  const entries=[['fuel','FUEL','#e8b85d'],['energy','ENERGY','#75e9ed'],['crew','CREW','#9ee08a'],['hull','HULL','#d8c4f5']];
  panel.innerHTML=entries.map(([key,label,color])=>{const value=Math.round(key==='hull'?s.health/Math.max(1,s.maxHealth)*100:s.samsaraVitals[key]);return `<label><span>${label}</span><i style="--fill:${value}%;--color:${color}"></i><em>${value}</em></label>`;}).join('');
}
function renderSamsaraInventory(){
  const panel=$('samsara-artifacts');panel.hidden=s.planetChoice!=='samsara';if(panel.hidden)return;
  panel.replaceChildren();
  for(const item of SAMSARA_HARMONY){const count=s.samsaraInventory[item.kind]||0;if(!count)continue;const button=document.createElement('button');button.type='button';button.title=`${item.name} · запас ${count}`;button.setAttribute('aria-label',button.title);button.innerHTML=`<img src="assets/echo-garden/collectibles/${item.sprite}.webp" alt=""><b>${count}</b>`;button.addEventListener('click',()=>useSamsaraHarmony(item.kind));panel.append(button);}
  if(s.samsaraHeld){for(const [label,action] of [['↻ Ещё раз',replaySamsaraHeld],['▶ Дальше',continueSamsaraHeld]]){const button=document.createElement('button');button.type='button';button.className='samsara-hold-action';button.textContent=label;button.addEventListener('click',action);panel.append(button);}}
  if(!panel.children.length){const note=document.createElement('span');note.textContent='Собирай звуковые мандалы · нажимай здесь';panel.append(note);}
}
function collectSamsaraArtifact(type){
  const target=SAMSARA_COUNTER[type];let removed=0;
  s.samsaraForces=s.samsaraForces.filter(force=>{if(target!==-1&&force.type!==target)return true;removed++;burst(force.x,force.y,SAMSARA_FORCES[force.type].color,20);return false;});
  s.bullets=s.bullets.filter(b=>target>=0&&b.forceType!==target);
  changeSamsaraResource('fuel',5);changeSamsaraResource('energy',7+Math.min(6,removed*2));
  feedback(`${ARTIFACTS[type].name} · ${target<0?'силы рассеяны':SAMSARA_FORCES[target].name+' рассеяны'}`);
  expedition.artifact(type);
}
function playSamsaraHeld(){if(!s.samsaraHeld||!s.enemy||s.mode!=='active')return;const chord=s.enemy.chord,held=s.samsaraHeld;audio.auditionChord((s.route.register??48)+s.route.key,chord,()=>{if(s.samsaraHeld===held)playSamsaraHeld();},held.arpeggio?'up':'together');signal(held.arpeggio?'♫ Арпеджио удерживается · ↻ повторить · ▶ дальше':'♫ Аккорд удерживается · ↻ повторить · ▶ дальше',true);}
function replaySamsaraHeld(){playSamsaraHeld();}
function continueSamsaraHeld(){if(!s.samsaraHeld)return;s.samsaraHeld=null;audio.stop();s.listening=false;signal('Маршрут продолжается · выбери ступень и тип');renderSamsaraInventory();syncPads();}
function useSamsaraHarmony(kind){
  if(s.planetChoice!=='samsara'||s.mode!=='active'||!s.enemy||s.listening||expedition.busy||!s.samsaraInventory[kind])return;
  s.samsaraInventory[kind]--;s.bullets=[];s.listening=true;syncPads();
  if(kind==='hold'||kind==='holdArpeggio'){s.samsaraHeld={arpeggio:kind==='holdArpeggio'};playSamsaraHeld();renderSamsaraInventory();return;}
  const from=kind==='midpoint'?Math.floor(s.route.sequence.length/2):0;
  audio.gardenSequence(s.route,{from,arpeggio:kind==='arpeggio'},index=>signal(`♫ ${index+1}/${s.route.sequence.length} · ${chordSymbol(s.route.sequence[index])}`,true),()=>{if(s.mode!=='active')return;s.listening=false;signal('Гармонический круг прозвучал · выбирай ответ');syncPads();});
  feedback(SAMSARA_HARMONY.find(item=>item.kind===kind).name);renderSamsaraInventory();
}
function stepSamsaraForces(dt){
  const p=s.player;s.samsaraForceTimer-=dt;
  if(s.samsaraForceTimer<=0&&s.samsaraForces.length<4){const type=s.samsaraForceIndex++%SAMSARA_FORCES.length;const x=65+Math.random()*(W-130);s.samsaraForces.push({type,x,originX:x,y:-52,age:0,fire:SAMSARA_FORCES[type].fire*.75,phase:Math.random()*6.28,muzzle:0,charge:0,facing:1,trail:[]});s.samsaraForceTimer=7+Math.random()*4+(s.runLevel===0?2:0);}
  for(const force of s.samsaraForces){const spec=SAMSARA_FORCES[force.type];force.age+=dt;force.muzzle=Math.max(0,force.muzzle-dt);force.charge=Math.max(0,force.charge-dt);const pace=s.runLevel>=2?1.18:1;
    if(force.type===0){
      // The archer crosses the lane, settles for a shot, then changes direction.
      force.y+=spec.speed*pace*dt*(force.muzzle>.1?.45:.82);
      force.x=clamp(force.originX+Math.sin(force.age*.95+force.phase)*43,38,W-38);
    }else if(force.type===1){
      // The elephant has weight: slow steps, a warning pause, then a short charge.
      if(force.y>55&&force.y<p.y-90&&force.age>2.3&&force.charge<=0&&force.age<3.1){force.charge=1.25;force.muzzle=.46;}
      force.y+=spec.speed*pace*dt*(force.charge>0?1.75:force.muzzle>0?.28:.78);
      force.x=clamp(force.x+clamp(p.x-force.x,-1,1)*dt*(force.charge>0?36:9),39,W-39);
    }else if(force.type===2){
      // The fire bearer sweeps diagonally, rather than sliding straight down.
      force.y+=spec.speed*pace*dt*.9;
      force.x=clamp(force.originX+Math.sin(force.age*.62+force.phase)*62,36,W-36);
    }else{
      force.y+=spec.speed*pace*dt+Math.sin(force.age*2.2+force.phase)*dt*7;
      force.x=clamp(force.originX+Math.sin(force.age*.73+force.phase)*57,35,W-35);
    }
    if(force.age>.4){force.trail.push({x:force.x,y:force.y,age:0});if(force.trail.length>7)force.trail.shift();}for(const mark of force.trail)mark.age+=dt;force.trail=force.trail.filter(mark=>mark.age<.72);
    if(Math.abs(p.x-force.x)>15)force.facing=p.x>=force.x?1:-1;
    if(Math.hypot(force.x-p.x,force.y-p.y)<spec.radius+19){shipHit();force.y+=38;}
    force.fire-=dt;
    if(force.fire<=0&&force.y>30&&force.y<playableHeight()*.66){
      const facing=force.facing,angle=Math.atan2(p.y-force.y,p.x-force.x);
      if(force.type===0){s.bullets.push({x:force.x+facing*29,y:force.y-7,vx:facing*132,vy:8,r:4,forceType:0,age:0,turn:.8});}
      else if(force.type===1){s.bullets.push({x:force.x+facing*19,y:force.y-21,vx:Math.cos(angle)*108,vy:Math.sin(angle)*108,r:5,forceType:1,age:0});}
      else if(force.type===2){for(let i=-1;i<=1;i++){const a=(facing===1?.42:Math.PI-.42)+i*.17;s.bullets.push({x:force.x+facing*28,y:force.y+15,vx:Math.cos(a)*105,vy:Math.sin(a)*105,r:6,forceType:2,age:0,ttl:1.05});}}
      else{s.bullets.push({x:force.x+facing*27,y:force.y-10,vx:Math.cos(angle)*74,vy:Math.sin(angle)*74,r:5,forceType:3,age:0});}
      force.muzzle=force.type===2?.8:.5;force.fire=spec.fire;
    }
  }
  s.samsaraForces=s.samsaraForces.filter(force=>force.y<playableHeight()+62);
}
function drawSamsaraForces(){
  const sheet=images['samsara-guardians'];if(!sheet?.complete||!sheet.naturalWidth)return;
  const sw=sheet.naturalWidth/2,sh=sheet.naturalHeight/2;
  for(const force of s.samsaraForces){const color=SAMSARA_FORCES[force.type].color;ctx.save();
    for(const mark of force.trail){const a=(.72-mark.age)/.72;ctx.globalAlpha=a*(force.type===1?.18:.1);ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(mark.x,mark.y+23,force.type===1?23:13,force.type===1?5:3,0,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    ctx.translate(force.x,force.y);const bob=force.type===1?Math.sin(force.age*8)*1.6:Math.sin(force.age*2.7+force.phase)*2.8;
    const lean=force.type===1?Math.sin(force.age*8)*.025:force.type===2?Math.cos(force.age*.62+force.phase)*.08:Math.cos(force.age*.9+force.phase)*.055;
    ctx.translate(0,bob);ctx.rotate(lean);ctx.scale(force.facing,1);const size=force.type===1?88:72;ctx.shadowColor=color;ctx.shadowBlur=force.muzzle>0?19:9;
    ctx.drawImage(sheet,(force.type%2)*sw,Math.floor(force.type/2)*sh,sw,sh,-size/2,-size/2,size,size);
    if(force.type===1&&force.muzzle>0){ctx.strokeStyle=`rgba(226,211,154,${force.muzzle*.6})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,size*.34,23+force.muzzle*15,5+force.muzzle*5,0,0,Math.PI*2);ctx.stroke();}
    if(force.type===2&&force.muzzle>0){ctx.fillStyle=`rgba(255,170,80,${force.muzzle*.32})`;ctx.beginPath();ctx.ellipse(25,17,11+force.muzzle*14,5+force.muzzle*6,.3,0,Math.PI*2);ctx.fill();}
    if(force.type===3){ctx.strokeStyle=`rgba(190,155,255,${.17+force.muzzle*.34})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(15,-9,9+Math.sin(force.age*3)*2,0,Math.PI*2);ctx.stroke();}
    ctx.restore();}
}
function stepSamsaraPickups(dt){
  s.samsaraPickupTimer-=dt;
  if(s.samsaraPickupTimer<=0&&s.samsaraPickups.length<3){const needs=[100-s.samsaraVitals.fuel,100-s.samsaraVitals.energy,100-s.samsaraVitals.crew,100-s.health/Math.max(1,s.maxHealth)*100];let kind=needs.map((need,index)=>({index,score:need+Math.random()*21})).sort((a,b)=>b.score-a.score)[0].index;s.samsaraPickups.push({kind,x:65+Math.random()*(W-130),y:-35,age:0,phase:Math.random()*6.28});s.samsaraPickupTimer=6+Math.random()*3;}
  for(const item of s.samsaraPickups){item.age+=dt;item.y+=dt*46;item.x+=Math.sin(item.age*1.25+item.phase)*dt*9;
    if(Math.hypot(item.x-s.player.x,item.y-s.player.y)<39){item.collected=true;const labels=['Топливо','Энергия','Силы команды','Корпус'];if(item.kind===0)changeSamsaraResource('fuel',14);else if(item.kind===1)changeSamsaraResource('energy',13);else if(item.kind===2)changeSamsaraResource('crew',10);else{s.health=Math.min(s.maxHealth,s.health+2);renderHud();}burst(item.x,item.y,['#e8b85d','#75e9ed','#9ee08a','#d8c4f5'][item.kind],17);feedback(`${labels[item.kind]} восстановлены`);}
  }
  s.samsaraPickups=s.samsaraPickups.filter(item=>!item.collected&&item.y<playableHeight()+35);
}
function drawSamsaraPickups(){for(const item of s.samsaraPickups){const img=images[`samsara-pickup-${SAMSARA_PICKUPS[item.kind]}`],size=47+Math.sin(item.age*2.3+item.phase)*2;if(!img?.complete||!img.naturalWidth)continue;ctx.save();ctx.translate(item.x,item.y);ctx.rotate(Math.sin(item.age*.8+item.phase)*.17);ctx.shadowColor=['#e8b85d','#75e9ed','#9ee08a','#d8c4f5'][item.kind];ctx.shadowBlur=13;ctx.drawImage(img,-size/2,-size/2,size,size);ctx.restore();}}
let activeRecognition=null;
function listenTitle(){
  const Engine=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Engine){feedback('Голосовой ответ недоступен здесь. В Safari открой HTTPS-версию или выбери кнопку.',true);return;}
  try{
    activeRecognition?.abort();const recognition=new Engine();activeRecognition=recognition;recognition.lang='en-US';recognition.interimResults=false;recognition.maxAlternatives=3;
    signal('🎙 Say the title in English',true);
    recognition.onresult=event=>{const variants=Array.from(event.results[0]||[]).map(item=>item.transcript);if(!variants.some(text=>expedition.answerSpoken(text)))feedback(`Распознано: ${variants[0]||'—'}`,true);};
    recognition.onerror=event=>feedback(event.error==='not-allowed'?'Safari не получил доступ к микрофону':'Не расслышал. Повтори или выбери кнопку.',true);
    recognition.onend=()=>{if(activeRecognition===recognition){activeRecognition=null;signal('Выбери ответ или повтори');}};
    recognition.start();
  }catch{feedback('Не удалось запустить микрофон. Выбери ответ кнопкой.',true);}
}
const debrief=createDebrief({storage:localStorage,audio,overlay,action,enter:enterMenu,back:menuBack,setMode:()=>{s.mode='debrief';s.listening=false;s.keys.clear();},isActive:()=>s.mode==='debrief'});
function recordHydraMistake(){if(s.enemy?.chord){debrief.record({kind:'hydra',chord:s.enemy.chord,level:expedition.level,tonic:(s.route.register??48)+s.route.key});s.enemy.reviewRecorded=true;}}
const expedition=createExpedition({intelligence,onMistake:item=>debrief.record(item),onSamsaraArtifact:collectSamsaraArtifact,onSamsaraChallenge:fraction=>{changeSamsaraResource('energy',fraction>0?Math.round(14*fraction):-5);if(fraction>0){changeSamsaraResource('fuel',Math.round(5*fraction));changeSamsaraResource('crew',Math.round(3*fraction));}},s,audio,feedback,signal,burst,renderHud,syncPads,shipHit,listenTitle,W,getH:()=>playableHeight(),images,ctx,document,playCue,degree:n=>DEGREES[n].glyph});
const stars=Array.from({length:85},()=>({x:Math.random()*480,y:Math.random()*1100,z:.25+Math.random(),r:Math.random()*1.3+.3}));
const MACHINES=['РАЗВЕДЧИК','КОРВЕТ','КРЕЙСЕР','КРЕПОСТЬ'];
const MACHINE_CROPS=[[135,20,380,490],[675,20,490,505],[60,530,520,640],[588,515,666,720]];
const HANGAR_SHIPS=[
  {name:'RUSTLING',price:0,asset:'ship',frame:0,description:'Сварной разведчик. Маленький, злой, голодный до деталей.'},
  {name:'COPPER VULTURE',price:140,asset:'enemyships',frame:1,description:'Латунный перехватчик: лишние сопла, масло на швах, скоростной крен.'},
  {name:'LOW ORBIT',price:330,asset:'corvette',frame:2,description:'Корвет со звуковыми пушками, кабелями и ржавым реактором.'},
  {name:'MIDNIGHT FORTRESS',price:600,asset:'fortress',frame:3,description:'Тяжёлая музыкальная крепость. Патчи брони, басовые порты, лампы.'},
];
const HANGAR_PILOTS=[
  {name:'Rivet',unlock:0,description:'Базовый пилот. Грязные руки, верный слух.'},
  {name:'Nova Coil',unlock:180,description:'Космическая техник-музыкант. Открывается за общий лом.'},
  {name:'Mack Relay',unlock:520,description:'Ветеран станционных концертов. Открывается за общий лом.'},
  {name:'Chrome Ghost',unlock:1000,description:'Киборг-пилот. Открывается за общий лом.'},
];
const UPGRADE_INFO={
  hull:{name:'БРОНЯ И РЕЗОНАТОР',cost:[70,150,270],description:'+2 деления щита за уровень'},
  engine:{name:'ДВИГАТЕЛЬ И СОПЛА',cost:[55,125,230],description:'скорость и манёвр'},
  cannon:{name:'ЗВУКОВОЕ ОРУДИЕ',cost:[65,145,260],description:'скорострельность и дополнительные импульсы'},
  reactor:{name:'РЕАКТОР И ТВИТЕРЫ',cost:[60,135,245],description:'быстрее набирает энергию'},
};
let study={kind:'chord',quality:'maj',interval:'♭3',rhythm:0,poly:0,layer:'both',root:48,mode:'together',loop:false,back:'start'};
let trainerAudition=0;
let trainer={level:1,target:null,choices:[],articulation:'together',timbre:'synth',tonic:48,total:0,correct:0,locked:false,revealed:false,back:'start'};
function machineSize(model){return Math.min(100,H*.20)*(1.35+model*.23)*(s.planetChoice==='samsara'?.78:1);}
function machinePorts(model){const size=machineSize(model);return Array.from({length:2+model*2},(_,i)=>({x:(i%2?1:-1)*size*.37,y:size*(.22-Math.floor(i/2)*.16)}));}
function enemyGuns(model){return machinePorts(model).map((port,index)=>({...port,index,hp:4+model,maxHp:4+model,destroyed:false}));}
// Ground objects and their planet share one camera displacement. The encounter
// stops that displacement, rather than parking an airborne ship over moving soil.
function stepGround(dt,playing){
  const safe=!!expedition.safeNoteFlight,e=s.enemy;
  let delta=dt*(safe?38:s.mode==='resolving'?130:playing?55:16);
  s.groundCombat=false;
  if(s.hydraBlast)delta=0;
  else if(e&&s.mode==='active'){
    if(safe)e.suspended=true;
    else{
      if(e.suspended){e.suspended=false;e.groundPhase='approach';e.y=-machineSize(e.model)*.6;s.fireTimer=Math.max(s.fireTimer,3);}
      if(e.groundPhase==='approach'){
        delta=Math.min(delta,Math.max(0,e.holdY-e.y));e.y+=delta;
        if(e.y>=e.holdY-.01){e.y=e.holdY;e.groundPhase='combat';}
      }else delta=0;
      s.groundCombat=e.groundPhase==='combat';
    }
  }
  s.groundScrollDelta=delta;s.travel+=delta;
}
function collideHydraBody(){
  const e=s.enemy;if(!e||s.mode!=='active'||expedition.safeNoteFlight||e.suspended||expedition.cloaked)return;
  const p=s.player,size=machineSize(e.model),rx=size*.45+13,ry=size*.46+13;
  const dx=(p.x-e.x)/rx,dy=(p.y-e.y)/ry,distance=Math.hypot(dx,dy);
  if(distance>=1)return;
  const direction=distance>.001?{x:dx/distance,y:dy/distance}:{x:0,y:1};
  p.x=p.tx=clamp(e.x+direction.x*(rx+2),25,W-25);
  p.y=p.ty=clamp(e.y+direction.y*(ry+2),115,playableHeight()-35);
  shipHit();
}
function beginHydraDestruction(enemy){
  s.hydraBlast={enemy,age:0,stage:0,spots:(enemy.guns||[]).map(g=>({x:enemy.x+g.x,y:enemy.y+g.y}))};
  s.beam=.18;s.bullets=[];s.shots=[];s.drones=[];
  detonateHydraPart(s.hydraBlast,false);
}
function detonateHydraPart(blast,final){
  const spot=final?blast.enemy:blast.spots[blast.stage%Math.max(1,blast.spots.length)]||blast.enemy;
  burst(spot.x,spot.y,final?'#ffe2a0':'#ffad56',reduced?12:final?55:22);
  s.rings.push({x:spot.x,y:spot.y,age:0,explosion:true,final});
  for(let i=0;i<(reduced?4:final?18:8);i++){
    const angle=Math.random()*Math.PI*2,speed=35+Math.random()*(final?155:90);
    s.debris.push({x:spot.x,y:spot.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,angle,spin:(Math.random()-.5)*9,life:1.1+Math.random()*.5,size:2+Math.random()*4});
  }
  if(s.debris.length>90)s.debris.splice(0,s.debris.length-90);
  s.shake=reduced?0:final?.38:.14;
  audio.hydraExplosion?.({final});
}
function stepHydraDestruction(dt){
  const blast=s.hydraBlast;if(!blast)return;
  blast.age+=dt;
  while(blast.stage<3&&blast.age>=(blast.stage+1)*.19){blast.stage++;detonateHydraPart(blast,blast.stage===3);}
  if(blast.age>=1.1){s.hydraBlast=null;s.groundCombat=false;if(s.mode==='resolving')expedition.afterHydra();}
}
function resize(){const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const oldH=H;H=rect.height*480/rect.width;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);if(samsaraCanvas)samsaraCanvas.height=Math.ceil(H);if(samsaraShipCanvas)samsaraShipCanvas.height=Math.ceil(H);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);if(['start','briefing'].includes(s.mode))s.player.y=s.player.ty=s.planetChoice==='samsara'?Math.max(145,playableHeight()-66):H-65;else{s.player.y*=H/oldH;s.player.ty*=H/oldH;}}
new ResizeObserver(resize).observe(canvas);
function save(){try{const old=JSON.parse(localStorage.getItem('ear-reharm-game.v1')||'{}');localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...old,best:Math.max(old.best||0,s.score),unlocked:Math.max(old.unlocked||0,s.sector),lastStats:s.stats,intervalStats:s.intervalStats}));}catch{}}
function record(){try{return JSON.parse(localStorage.getItem('ear-reharm-game.v1')||'{}');}catch{return {};}}
function hangar(){const saved=record().hangar||{};return {scrap:saved.scrap||0,total:saved.total||0,upgrades:{hull:saved.upgrades?.hull||0,engine:saved.upgrades?.engine||0,cannon:saved.upgrades?.cannon||0,reactor:saved.upgrades?.reactor||0},ship:saved.ship||0,pilot:saved.pilot||0};}
function saveHangar(next){try{const old=record();localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...old,hangar:next}));}catch{}}
function shipBuild(){const h=hangar(),frame=HANGAR_SHIPS[h.ship];return {h,frame,maxHealth:Math.min(MAX_SHIELD,BASE_SHIELD+h.upgrades.hull*2+(frame.frame>=2?2:0)),speed:180+h.upgrades.engine*28+frame.frame*8,shotDelay:Math.max(.09,.28-h.upgrades.cannon*.055-frame.frame*.012),shots:1+Math.floor(h.upgrades.cannon/2),energyGain:1+h.upgrades.reactor*.25};}
function awardScrap(amount){const h=hangar();h.scrap+=amount;h.total+=amount;saveHangar(h);}
// Menu history stores render callbacks, not HTML, so restored controls keep their listeners.
let currentMenu=null,menuTrail=[],restoringMenu=false;
function enterMenu(id,render,root=false){
  if(root){menuTrail=[];currentMenu={id,render,scroll:0};return;}
  if(restoringMenu)return;
  if(currentMenu?.id===id){currentMenu.render=render;return;}
  if(currentMenu){currentMenu.scroll=$('overlay').scrollTop;menuTrail.push(currentMenu);}
  currentMenu={id,render,scroll:0};
}
function menuBack(){
  if(s.mode==='debrief')debrief.cancel();
  ++runToken;audio.stop();activeRecognition?.abort();s.listening=false;s.keys.clear();s.pointer=null;
  const target=menuTrail.pop();
  if(!target){startScreen();return;}
  currentMenu=target;restoringMenu=true;s.mode='start';
  try{target.render();}finally{restoringMenu=false;}
  requestAnimationFrame(()=>{if(currentMenu===target)$('overlay').scrollTop=target.scroll;});
}
function overlay(html){
  document.querySelector('.cabinet').classList.add('menu-open');$('overlay').classList.remove('art-overlay');
  $('overlay').innerHTML=`<div class="overlay-card">${html}</div>`;$('overlay').scrollTop=0;$('overlay').hidden=false;
  if(currentMenu?.id!=='home'){
    const back=document.createElement('button');back.id='menu-back';back.className='menu-back';back.type='button';
    back.setAttribute('aria-label','Назад');back.title='Назад';back.textContent='←';
    back.addEventListener('click',()=>currentMenu?.id==='pause'?resume():menuBack());$('overlay').append(back);
  }
}
function hideOverlay(){
  $('overlay').hidden=true;document.querySelector('.cabinet').classList.remove('menu-open');
  // A running flight is not a menu page that Back may restart or resurrect.
  currentMenu={id:'home',render:startScreen,scroll:0};menuTrail=[];
}
function action(label,fn,secondary=false){const b=document.createElement('button');b.className=secondary?'secondary':'primary';b.textContent=label;$('overlay').firstElementChild.append(b);b.addEventListener('click',fn);return b;}
function signal(text,listening=false){$('signal-text').textContent=text;$('signal').classList.toggle('listening',listening);}
function feedback(text,error=false){$('feedback').textContent=text;$('feedback').className=`feedback visible${error?' error':''}`;s.feedbackTimer=2.0;}
function renderHud(){
  const max=s.maxHealth||BASE_SHIELD,health=clamp(s.health,0,max),meter=$('health'),previous=Number(meter.dataset.value??health);
  s.health=health;
  $('score').textContent=String(s.score).padStart(6,'0');
  meter.innerHTML=`<span class="hp-shell"><i style="--hp:${health/max}"></i></span><b>${health}/${max}</b>`;
  meter.dataset.value=String(health);
  meter.classList.toggle('low',health<=Math.ceil(max*.35));
  meter.classList.toggle('critical',health<=Math.ceil(max*.15));
  meter.setAttribute('aria-label',`Щит: ${health} из ${max}`);
  if(previous!==health){meter.classList.remove('hp-hit','hp-heal');void meter.offsetWidth;meter.classList.add(health<previous?'hp-hit':'hp-heal');}
  $('sector-name').textContent=s.bookMission?`${s.route?.code||'BOOK FLIGHT'} · ${s.position+1}/${s.route?.sequence.length||0}`:`СЕКТОР 0${s.sector+1} · ${SECTORS[s.sector].name.toUpperCase()}`;
  $('weapon').textContent=s.planetChoice==='samsara'?'УКЛОНЯЙСЯ · СЛУШАЙ':s.overdrive>0?'РАЗГОН · ВЕЕРНЫЙ ОГОНЬ':`ИМПУЛЬС ×${s.power}`;$('combo').textContent=s.planetChoice==='samsara'?`КОМБО ${s.combo} · ◉ ${hangar().scrap}`:`КОМБО ${s.combo} · ⚡ ${s.energy}% · ◉ ${hangar().scrap}`;
  $('route-track').classList.toggle('long-route',(s.route?.sequence.length||0)>20);$('route-track').innerHTML=Array.from({length:s.route?.sequence.length||SECTORS[s.sector].count},(_,i)=>`<i class="${i<s.cleared?'done':i===s.cleared?'current':''}"></i>`).join('');
  renderSamsaraResources();
  document.querySelector('.cabinet')?.classList.toggle('charged',s.overdrive>0||expedition.boosted);
  document.querySelector('.cabinet')?.classList.toggle('danger',health<=Math.ceil(max*.25));
}
function buildPads(){
  const config=SECTORS[s.sector];
  $('bass-pads').classList.remove('book-chord-pads');
  $('bass-pads').classList.toggle('chromatic-pads',s.sector===3||s.planetChoice==='samsara');
  $('quality-pads').classList.toggle('arsenal-pads',s.sector===3);
  $('quality-tabs').hidden=s.sector!==3;
  ['bank-basic','bank-altered'].forEach((id,i)=>{$(id).setAttribute('aria-pressed',String(i===qualityBank));});
  $('quality-panel').hidden=!config.qualities.length;
  for(const [kind,ids,container,data] of [['bass',s.planetChoice==='samsara'?Array.from({length:12},(_,i)=>i):config.degrees,$('bass-pads'),DEGREES],['quality',s.sector===3?QUALITY_BANKS[qualityBank]:config.qualities,$('quality-pads'),QUALITIES]]){
    container.replaceChildren();ids.forEach((id,index)=>{
      const item=data[id],b=document.createElement('button');b.className='pad';b.style.setProperty('--pad-color',item.color);b.dataset.kind=kind;b.dataset.value=id;
      b.innerHTML=`${s.sector===3?'':`<kbd>${kind==='bass'?index+1:['Q','W','E','R'][index]}</kbd>`}<span class="glyph" aria-hidden="true">${item.glyph}</span><small>${item.label}</small>`;
      b.title=item.label;
    b.setAttribute('aria-label',`${kind==='bass'?'Сигнал':'Тип аккорда'}: ${item.name}, ${item.label}`);
      b.addEventListener('click',()=>answer(kind,id,b));container.append(b);
    });
  }
  syncPads();
}
function syncPads(){
  const capsuleMode=!!s.capsule&&['resolving','paused'].includes(s.mode);
  const special=expedition.busy,scene=expedition.showScene;
  document.querySelector('.cabinet')?.classList.toggle('rhythm-room',scene);
  $('enemy-label').hidden=scene||!s.enemy||s.mode==='resolving';
  $('capsule-panel').hidden=!capsuleMode||special;$('bass-pads').hidden=capsuleMode||special;$('quality-panel').hidden=s.planetChoice!=='samsara'||capsuleMode||special||!SECTORS[s.sector].qualities.length;
  $('weapon-tabs').hidden=true;
  $('weapon-root').setAttribute('aria-pressed',String(weaponTab==='bass'));$('weapon-type').setAttribute('aria-pressed',String(weaponTab==='quality'));
  document.querySelectorAll('.pad').forEach(b=>{
    const broken=s.enemy?.shields[b.dataset.kind];b.disabled=s.mode!=='active'||s.listening||!!broken||special;
    b.disabled=b.disabled||b.dataset.locked==='1';b.classList.toggle('selected',!!broken&&(b.dataset.kind==='bass'?Number(b.dataset.value)===s.enemy.chord.offset:b.dataset.value===family(s.enemy.chord.quality)));
  });
  $('replay').disabled=!(s.mode==='active'||(s.mode==='resolving'&&(s.capsule||special)))||s.listening||['reveal','roulette'].includes(expedition.pauseKind);
  $('replay').setAttribute('aria-label',s.bookMission?'Повторить одну ноту HOME и текущий аккорд':'Повторить тонику и сигнал');
  $('replay').setAttribute('title',s.bookMission?'HOME одной нотой → текущий вертикальный аккорд · Space':'Повторить звучание · Space');
  if(scene){const labels={reveal:['ARTIFACT FOUND','Touch the crate to activate its mechanism'],roulette:['ROCK TONGUE · RANDOM MODE','The drum selects a musical trial'],poly:['DRUM MACHINE · RUDIMENTS','Choose the written sticking pattern'],rhythm:['RHYTHM TRIAL · THE DRUMMER','Recognize the style or instrumental part'],flightTones:['HARMONIC FLIGHT · TRUMPETER','Catch note names for BASIC, GUIDE or ALL TONES'],tones:['COLOR HEARING · VIBRAPHONIST','Select every sounding extension, then press ANSWER'],melody:['MELODY MEMORY · KEY PILOT','Choose or speak the melody title'],mode:['MODAL DRIVE · GUITAR PILOT','Recognize the ascending or descending scale']},copy=labels[expedition.pauseKind]||['ARTIFACT','Activate the recovered mechanism'];$('dock-label').textContent=copy[0];$('dock-tip').textContent=copy[1];}
  $('interval-reference').disabled=s.mode!=='resolving'||s.listening;
  $('pause').disabled=['start','finished','gameover','loading'].includes(s.mode);
  if(s.enemy){$('shield-tags').innerHTML=s.bookMission||s.sector>=2?'<span class="shield-tag">◈ АККОРД</span>':'<span class="shield-tag">◇ СТУПЕНЬ</span>';}
}
function startScreen(){
  s.mode='start';
  renderHud();buildPads();
  openFlightConsole();return;
  overlay('<span class="eyebrow">STEAM / SOUND / SPACE</span><h1>Signal<br><span class="accent">Expedition.</span></h1><p>Лови звуки. Обходи скалы.<br>Пробивай путь к своей музыке.</p>');
  $('overlay').firstElementChild.insertAdjacentHTML('afterbegin','<div class="console-hardware" aria-hidden="true"><i class="console-speaker"></i><i class="console-lamp"></i><i class="console-fader"></i><i class="console-fader" style="--pos:5px"></i><i class="console-fader" style="--pos:27px"></i><i class="console-fader" style="--pos:11px"></i><i class="console-lamp"></i><i class="console-speaker"></i></div>');
  PILOTS.forEach((pilot,i)=>{const b=action(pilot.name,()=>startRun(pilot.sector,i),true);b.className='pilot-choice';const info=document.createElement('small');info.textContent=pilot.description;b.append(info);});
  for(const [label,type] of [['♫ Guitarist · Modes',0],['♫ Key Pilot · Melodies',1],['♫ Drummer · Rhythms',10],['♫ Trumpeter · Chord Tones',7]])action(label,()=>launchEncounter(type),true);
  action('BOOK FLIGHT · Chapters 01–16',()=>openBookFlight(),false);
  action('♫ Ознакомление со звуками',()=>openStudy(),true);
  action('Тренажёр ступеней и аккордов',()=>openTrainer(),true);
  action('Экипаж и особые режимы · посмотреть',openCrewGallery,true);
  action('Ангар · магазин',openHangar,true);
  const note=document.createElement('p');note.className='quiet-note';note.textContent=`Включи звук · наушники помогут${record().best?' · рекорд '+record().best:''}`;$('overlay').firstChild.append(note);
}
function consoleButton(label,box,callback,selected=false){
  const b=document.createElement('button');b.className='console-hit';
  b.dataset.label=label;b.setAttribute('aria-label',label);b.title=label;b.setAttribute('aria-pressed',String(selected));
  b.style.cssText=`left:${box[0]}%;top:${box[1]}%;width:${box[2]}%;height:${box[3]}%`;
  b.addEventListener('click',callback);$('console-scene').append(b);return b;
}
function consoleScene(image,description){
  audio.stop();s.listening=false;s.mode='start';
  overlay(`<div id="console-scene" class="console-scene"><img src="assets/${image}" alt="${description}" draggable="false"><p class="console-status" id="console-status"></p><span class="console-build">BUILD 086</span></div>`);
  $('overlay').classList.add('art-overlay');
}
let consolePilot=0;
function openFlightConsole(){
  if(s.planetChoice==='samsara'){openSamsaraHome();return;}
  enterMenu('home',openFlightConsole,true);
  const portrait=window.matchMedia('(max-width: 700px) and (orientation: portrait)').matches;
  consoleScene(portrait?'console-portrait.jpg':'console-flight.jpg','Космический ангар. Выбери уровень и нажми Launch.');
  if(portrait)$('console-scene').classList.add('console-portrait');
  const names=['NOVICE','STUDENT','MASTER','LEGEND'];
  // Portrait artwork includes a latch and lamp beside every painted label.
  // Keep the interactive/selected outline on the label plate itself.
  const boxes=portrait?[[15.2,61.1,31.9,5.7],[50.5,61.1,33.3,5.7],[15.2,68.3,31.9,5.8],[50.5,68.3,33.3,5.8]]:[[15,37,34,13],[50,37,35,13],[15,52,34,14],[50,52,35,14]];
  names.forEach((name,i)=>consoleButton(name,boxes[i],()=>{consolePilot=i;openFlightConsole();},i===consolePilot));
  $('console-status').textContent=`${names[consolePilot]} · ${PILOTS[consolePilot].description} · ${intelligence.settings.genres.map(g=>({jazz:'Джаз',rock:'Рок',classical:'Классика'})[g]).join(' + ')} · ${planetTitle()}`;
  consoleButton('INTELLIGENCE · ЖАНРЫ',portrait?[20,51,60,7]:[35,24,33,8],openLearningSettings);
  consoleButton('LAUNCH',portrait?[20,76,58,8]:[34,71,31,13],()=>startRun(PILOTS[consolePilot].sector,consolePilot));
  consoleButton('MISSIONS',portrait?[8,86,20,6]:[4,80,12,9],()=>openBookFlight());
  consoleButton('HANGAR',portrait?[29,86,20,6]:[17,80,12,9],openHangar);
  consoleButton('SOUND LAB',portrait?[50,86,21,6]:[72,80,14,9],()=>openSoundLab());
  consoleButton('RU / EN',portrait?[72,86,20,6]:[87,82,12,9],()=>$('language').click());
  const quick=document.createElement('div');quick.className='console-quick';
  const planetButton=document.createElement('button');planetButton.textContent='◉ ПЛАНЕТЫ';planetButton.setAttribute('aria-label',`Планеты. Сейчас: ${planetTitle()}`);planetButton.addEventListener('click',openPlanetSettings);quick.append(planetButton);$('console-scene').append(quick);
}
function openSamsaraHome(){
  enterMenu('home',openSamsaraHome,true);
  overlay('<span class="eyebrow">ТРЕТИЙ МИР · САД И ЗВУК</span><h1>Самсара</h1><p>Веди лотос между лучниками и всадниками. Слушай аккорд, угадывай ступень и тип, собирай цветы защиты.</p><div class="samsara-home-flower" aria-hidden="true"><img src="assets/samsara/guitar.webp" alt=""></div>');
  for(const [level,label,detail] of [[0,'Первый полёт','12 стеклянных ступеней · четыре типа · мягкий темп'],[1,'Уверенный полёт','Два ответа на аккорд · больше встреч'],[2,'Хроматический полёт','12 ступеней и полный набор типов'],[3,'Свободный полёт','Вся гармония · быстрый ритм']]){
    const button=action(label,()=>startRun(level>=2?3:2,level),true);button.classList.add('samsara-difficulty');const small=document.createElement('small');small.textContent=detail;button.append(small);
  }
  action('Гармонические маршруты',openBookFlight,true);
  action('Артефакты и музыканты',openSamsaraGallery,true);
  action('Планеты',openPlanetSettings,true);
}
function openSamsaraGallery(){
  enterMenu('samsara-gallery',openSamsaraGallery);s.mode='start';
  overlay('<span class="eyebrow">САМСАРА · КОЛЛЕКЦИЯ</span><h2>Музыканты и артефакты</h2><p class="compact">Выбери музыканта, чтобы сразу попасть в его музыкальную комнату.</p><div id="samsara-cast-gallery" class="samsara-gallery"></div><h3>НАЙДЕННЫЕ МАНДАЛЫ</h3><div id="samsara-art-gallery" class="samsara-gallery relics"></div>');
  const cast=[['guitarist','Гитарист','Лады',0],['keyboardist','Клавишница','Мелодии',1],['drummer','Барабанщик','Ритмы',10],['vibraphonist','Вибрафонистка','Надстройки аккордов',11],['beatmaker','Битмейкер','Рудименты',6],['bassist','Басист','Терция и септима',2],['trumpeter','Трубач','Звуки аккорда',7]];
  for(const [asset,name,role,type] of cast){const button=document.createElement('button');button.innerHTML=`<img src="assets/samsara/${asset}.webp" alt=""><b>${name}</b><small>${role}</small>`;button.addEventListener('click',()=>launchEncounter(type));$('samsara-cast-gallery').append(button);}
  const art=[['guitar',0],['keytar',1],['bass',2],['overdrive',3],['tongue',4],['cymbal',5],['drum-machine',6],['trumpet',7],['drums',10],['vibraphone',11],['submarine',12]];
  for(const [asset,type] of art){const button=document.createElement('button');button.innerHTML=`<img src="assets/samsara/${asset}.webp" alt=""><b>${ARTIFACTS[type].name}</b><small>${ARTIFACTS[type].elixir}</small>`;button.addEventListener('click',()=>launchEncounter(type));$('samsara-art-gallery').append(button);}
  action('Вернуться',openSamsaraHome,true);
}
function selectPlanet(choice){
  if(!['original','samsara'].includes(choice))return;
  s.planetChoice=choice;
  document.body.classList.toggle('samsara-world',choice==='samsara');
  try{localStorage.setItem(PLANET_CHOICE_KEY,choice);}catch{}
}
function openPlanetSettings(){
  enterMenu('planets',openPlanetSettings);
  overlay('<span class="eyebrow">КАРТА ПЛАНЕТ</span><h2>Куда полетим?</h2><p class="compact">Три мира доступны: боевой маршрут, Сад Эха и Самсара.</p><div id="planet-grid" class="planet-grid"></div>');
  $('overlay').firstElementChild.classList.add('planet-menu');
  for(const planet of PLANETS){
    const card=document.createElement('button');card.className=`planet-card ${planet.tone}${planet.id===s.planetChoice?' selected':''}`;card.disabled=!planet.available;
    card.innerHTML=`<span>${planet.number}</span><b>${planet.title}</b><small>${planet.description}</small><i>${planet.available?'ЛЕТЕТЬ':'СКОРО'}</i>`;
    if(planet.available)card.addEventListener('click',()=>{if(planet.ambient){location.href=planet.ambient;return;}selectPlanet(planet.id);startRun(PILOTS[consolePilot].sector,consolePilot);});$('planet-grid').append(card);
  }
  action('← В ангар',openFlightConsole,true);
}
function openLearningSettings(){
  enterMenu('learning',openLearningSettings);
  const settings=intelligence.settings;
  overlay(`<h2>Перед полётом</h2><p>Выбери один, два или все три жанра. Мелодии будут только из выбранных разделов.</p><div id="learning-options" class="study-tabs"></div><p>Intelligence повторяет трудные темы и постепенно добавляет новые. Гармонические задания пока не ограничены жанром.</p>`);
  const wrap=$('learning-options');
  for(const [genre,label] of [['jazz','Джаз'],['classical','Классика'],['rock','Рок']]){
    const selected=settings.genres.includes(genre),b=document.createElement('button');b.textContent=(selected?'✓ ':'')+label;b.setAttribute('aria-pressed',String(selected));
    b.addEventListener('click',()=>{const next=selected?settings.genres.filter(g=>g!==genre):[...settings.genres,genre];if(!next.length){feedback('Оставь хотя бы один жанр');return;}intelligence.configure({genres:next});openLearningSettings();});wrap.append(b);
  }
  const toggle=document.createElement('button');toggle.textContent='Intelligence: '+(settings.enabled?'включён':'выключен');toggle.addEventListener('click',()=>{intelligence.configure({enabled:!settings.enabled});openLearningSettings();});wrap.append(toggle);
  action(`Планета · ${planetTitle()}`,openPlanetSettings,true);
  action('Вылететь →',()=>startRun(PILOTS[consolePilot].sector,consolePilot));
  action('← В ангар',openFlightConsole);
}
function openSoundLab(selection=0){
  enterMenu('sound-lab',()=>openSoundLab(selection));
  consoleScene('console-sound-lab.jpg','Sound Lab: тренажёр, миссии, библиотека аккордов и ритмов, лады и мелодии.');
  $('console-scene').classList.add('console-lab');
  const items=[['PRACTICE',()=>openTrainer()],['MISSIONS',()=>openBookFlight()],['CHORD LIBRARY',()=>{study.kind='chord';openStudy();}],['RHYTHM LIBRARY',()=>{study.kind='rhythm';openStudy();}],['MODES',()=>launchEncounter(0)],['STANDARDS',()=>openStandards()]];
  items.forEach(([name,open],i)=>consoleButton(name,[13,18+i*8.35,42,7.8],open));
  $('console-status').textContent='SOUND LAB · открой нужный раздел';
  consoleButton('RU / EN',[57,42,11,7],()=>$('language').click());
  const quick=document.createElement('div');quick.className='console-quick';
  for(const [label,fn] of [[`♫ МЕЛОДИИ · ${MELODY_BANK.length}`,openMelodies],['▶ RHYTHM · проверить режим',()=>launchEncounter(10)],['▶ DRUM MACHINE',()=>launchEncounter(6)],['CREW · персонажи',openCrewGallery],['РАЗБОР ПОЛЁТА',debrief.open]]){const b=document.createElement('button');b.textContent=label;b.addEventListener('click',fn);quick.append(b);}
  $('console-scene').append(quick);
}
function openBookFlight(chapter=1){
  enterMenu('missions',()=>openBookFlight(chapter));
  s.mode='start';const routes=bookRoutesForChapter(chapter);
  overlay(`<span class="eyebrow">BOOK FLIGHT · TEST NAVIGATOR</span><h2>Chapter ${String(chapter).padStart(2,'0')}</h2><p class="compact">Выбери главу и конкретный маршрут. Служебный код показывает главу и пример; название источника в игре не выводится.</p><div id="chapter-grid" class="chapter-grid"></div><div class="mission-list" id="mission-list"></div>`);
  for(let value=1;value<=16;value++){const b=document.createElement('button');b.textContent=String(value).padStart(2,'0');b.className=value===chapter?'selected':'';b.addEventListener('click',()=>openBookFlight(value));$('chapter-grid').append(b);}
  routes.forEach((route,index)=>{const preview=createBookRoute(chapter,index,-1,()=>.2),b=document.createElement('button');b.innerHTML=`<b>${preview.code}</b><span>${route.sequence.length} HYDRAS · ROUTE ${index+1}/${routes.length}</span>`;b.addEventListener('click',()=>startBookRun(chapter,index));$('mission-list').append(b);});
  action('GALACTIC TOUR · 1460 стандартов',openStandards);action('Вернуться',menuBack,true);
}
const standardsLibrary=createStandardsLibrary({overlay,action,enter:enterMenu,back:menuBack,stop:()=>audio.stop(),start:(route,level)=>startRun(3,level,{route}),listen:async route=>{try{await audio.unlock();if(s.mode!=='start')return;const preview={...route,sequence:route.sequence.slice(0,8)};audio.progression(preview,preview.sequence.length-1,()=>{},()=>{},true);}catch(e){feedback(e.message,true);}}});
function openStandards(){s.mode='start';audio.stop();s.listening=false;expedition.reset();syncPads();standardsLibrary.open();}
const melodyLibrary=createMelodyLibrary({overlay,action,enter:enterMenu,back:menuBack,audio,isActive:()=>s.mode==='start'&&['melodies','melody-detail'].includes(currentMenu?.id),launch:()=>launchEncounter(1)});
function openMelodies(){s.mode='start';s.listening=false;expedition.reset();syncPads();melodyLibrary.open();}
function missionBack(){s.bookMission?.route?openStandards():openBookFlight(s.bookMission?.chapter||1);}
function missionReplay(){s.bookMission?.route?startRun(3,expedition.level,s.bookMission):startBookRun(s.bookMission.chapter,s.bookMission.index);}
function startBookRun(chapter,index){return startRun(3,Math.min(3,Math.floor((chapter-1)/5)),{chapter,index});}
async function launchEncounter(type){
  await startRun(2,1);if(s.mode!=='briefing')return;
  spawnEnemy();audio.stop();s.listening=false;expedition.artifact(type);
}
function openCrewGallery(){
  enterMenu('crew',openCrewGallery);s.mode='start';
  overlay(`<span class="eyebrow">BUILD 086 · ЭКИПАЖ</span><h2>Музыканты дальнего космоса</h2><p class="compact">Персонажи открыты здесь сразу, чтобы новую графику можно было проверить без ожидания случайного артефакта.</p><div class="crew-gallery">
    <article><img src="assets/trumpeter.webp" alt="Стимпанковский трубач"><b>ТРУБАЧ</b><span>Basic, guide и all tones · ловля нот</span></article>
    <article><img src="assets/keytarist.webp" alt="Клавишник с кейтаром"><b>КЛАВИШНИК</b><span>Узнавание джазовых мелодий</span></article>
    <article><img src="assets/guitarist.webp" alt="Космический гитарист"><b>ГИТАРИСТ</b><span>Лады, гаммы и modal drive</span></article>
    <article><img src="assets/drummer.webp" alt="Стимпанковский барабанщик"><b>БАРАБАНЩИК</b><span>Ритмы, стили и рисунки</span></article>
    <article><img src="assets/vibraphonist.webp" alt="Космическая вибрафонистка"><b>ВИБРАФОНИСТКА</b><span>Color Hearing · надстройки аккорда</span></article>
  </div>`);
  for(const [label,type] of [['Гитарист · запустить',0],['Клавишник · запустить',1],['Барабанщик · запустить',10],['Трубач · запустить',7],['Вибрафонистка · запустить',11]])action(label,()=>launchEncounter(type));
  action('Вернуться',menuBack,true);
}
function openHangar(){
  enterMenu('hangar',openHangar);s.mode='start';
  const h=hangar(),build=shipBuild(),ship=HANGAR_SHIPS[h.ship],pilot=HANGAR_PILOTS[h.pilot];
  overlay(`<span class="eyebrow">ORBITAL GARAGE · ЖИВАЯ ВАЛЮТА</span><h2>Ангар «Грязный сигнал»</h2><p class="hangar-balance">◉ ${h.scrap} деталей <small>за весь путь добыто ${h.total}</small></p><div class="hangar-hero"><img src="assets/${ship.asset}.webp" alt="${ship.name}"><div><b>${ship.name}</b><span>${ship.description}</span><small>Пилот: ${pilot.name}</small></div></div><p class="compact">Текущая машина: щит ${build.maxHealth}/${MAX_SHIELD} · скорость ${build.speed} · импульс ${Math.round(1/build.shotDelay)}/c.</p><div class="hangar-grid" id="hangar-upgrades"></div><h3>КОРПУСА</h3><div class="hangar-grid" id="hangar-ships"></div><h3>ПИЛОТЫ</h3><div class="hangar-grid" id="hangar-pilots"></div>`);
  const add=(container,content,handler,disabled=false)=>{const b=document.createElement('button');b.className='hangar-card';b.disabled=disabled;b.innerHTML=content;b.addEventListener('click',handler);$(container).append(b);};
  for(const [key,info] of Object.entries(UPGRADE_INFO)){const level=h.upgrades[key],cost=info.cost[level],max=level>=info.cost.length;add('hangar-upgrades',`<b>${info.name}</b><span>${info.description}</span><small>${max?'МАКСИМУМ':`УРОВЕНЬ ${level+1} · ◉ ${cost}`}</small>`,()=>buyUpgrade(key),max||h.scrap<cost);}
  HANGAR_SHIPS.forEach((item,index)=>{const owned=index===0||h.total>=item.price;const selected=index===h.ship;add('hangar-ships',`<img src="assets/${item.asset}.webp" alt=""><b>${item.name}</b><span>${item.description}</span><small>${selected?'ВЫБРАН':owned?'ВЫБРАТЬ':`ОТКРЫТЬ · ◉ ${item.price}`}</small>`,()=>selectShip(index),selected);});
  HANGAR_PILOTS.forEach((item,index)=>{const owned=h.total>=item.unlock,selected=index===h.pilot;add('hangar-pilots',`<b>${item.name}</b><span>${item.description}</span><small>${selected?'В КАБИНЕ':owned?'ВЫБРАТЬ':`НУЖНО ◉ ${item.unlock}`}</small>`,()=>selectPilot(index),selected||!owned);});
  action('Создать музыканта · народ и экипировка',openPilotCreator,true);
  action('Вылететь',()=>startScreen());
}
function openPilotCreator(){
  enterMenu('pilot',openPilotCreator);s.mode='start';
  const profile=record().musician||{nation:'Dorian',body:'Мужская',instrument:'Гитара',outfit:'Рабочий комбинезон',accessory:'Сварочные очки'};
  const nations={'Ionian':'Открытые и энергичные. Светлая краска поверх потёртой брони.','Dorian':'Спокойные импровизаторы. Зелёная патина и рабочая кожа.','Phrygian':'Страстные и резкие. Красная ткань, тёмный металл.','Lydian':'Любопытные исследователи. Световые линзы и высотное снаряжение.','Mixolydian':'Общительные бунтари. Нашивки концертных команд.','Aeolian':'Сдержанные странники. Выцветшие ткани, тяжёлые куртки.','Locrian':'Изобретатели с окраин. Асимметричные протезы и ремонтные заплаты.'};
  overlay('<span class="eyebrow">ЭКИПАЖ · ПЕРВАЯ ЛИНИЯ</span><h2>Твой музыкант</h2><p class="compact">Семь народов дальнего космоса. Выбор сохраняется на этом устройстве. Портреты новых народов пока в разработке.</p><div id="pilot-fields"></div>');
  const fields=[['nation','Народ',Object.keys(nations)],['body','Взрослая модель',['Мужская','Женская']],['instrument','Инструмент',['Гитара','Кейтар','Барабаны','Труба','Бас']],['outfit','Одежда',['Рабочий комбинезон','Кожаный жилет','Лётная куртка']],['accessory','Снаряжение',['Сварочные очки','Наушники','Респиратор']]];
  for(const [key,label,options] of fields){const wrap=document.createElement('label');wrap.style.cssText='display:grid;gap:5px;text-align:left;margin:12px 0';wrap.textContent=label;const select=document.createElement('select');select.style.cssText='padding:12px;background:#1a2825;color:#d7e1d5;border:2px ridge #65726c;font:inherit';for(const value of options){const option=document.createElement('option');option.value=option.textContent=value;option.selected=value===profile[key];select.append(option);}select.addEventListener('change',()=>{profile[key]=select.value;localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...record(),musician:profile}));if(key==='nation')$('nation-note').textContent=nations[profile.nation];});wrap.append(select);$('pilot-fields').append(wrap);}
  const note=document.createElement('p');note.id='nation-note';note.textContent=nations[profile.nation];$('pilot-fields').append(note);
  action('Сохранить и в ангар',()=>{localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...record(),musician:profile}));menuBack();});
}
function buyUpgrade(key){const h=hangar(),level=h.upgrades[key],cost=UPGRADE_INFO[key].cost[level];if(cost===undefined||h.scrap<cost)return;h.scrap-=cost;h.upgrades[key]++;saveHangar(h);openHangar();}
function selectShip(index){const h=hangar(),target=HANGAR_SHIPS[index];if(h.total<target.price)return;h.ship=index;saveHangar(h);openHangar();}
function selectPilot(index){const h=hangar(),target=HANGAR_PILOTS[index];if(h.total<target.unlock)return;h.pilot=index;saveHangar(h);openHangar();}
async function startRun(sector,level=sector===0?0:sector===2?1:2,bookMission=null){
  if(s.planetChoice==='samsara'&&!bookMission)sector=level>=2?3:2;
  enterMenu('launch',()=>startRun(sector,level,bookMission));
  const token=++runToken;s.mode='loading';overlay('<span class="eyebrow">ПОДГОТОВКА К ВЫЛЕТУ</span><h2>Включаем звук…</h2><p>Запускаем синтезатор корабля.</p>');
  try{await audio.unlock();if(token!==runToken)return;
    await prepareFlightImages((ready,total)=>{if(token===runToken)overlay(`<span class="eyebrow">ПОДГОТОВКА К ВЫЛЕТУ</span><h2>Основная графика · ${ready}/${total}</h2><p>Корабль и поверхность планеты</p>`);});if(token!==runToken)return;
    if(s.planetChoice==='samsara')await prepareSamsara();if(token!==runToken)return;
    const build=shipBuild();Object.assign(s,{sector,bookMission,runLevel:level,routeNumber:0,position:0,cleared:0,totalCleared:0,score:0,combo:0,health:build.maxHealth,maxHealth:build.maxHealth,power:1,attempts:0,correct:0,firstTry:0,replays:0,stats:{bass:{hit:0,miss:0},quality:{hit:0,miss:0}},bullets:[],shots:[],particles:[],enemy:null,invulnerable:0,drones:[],waveTimer:0,waveIndex:0,overdrive:0,energy:0,rings:[],travel:0,groundScrollDelta:0,groundCombat:false,hydraBlast:null,shake:0,debris:[],droneKills:0,capsule:null,capsuleTimer:0,intervalStats:{caught:0,wrong:0,missed:0,avoided:0}});
    s.samsaraVitals={fuel:86,energy:78,crew:90};s.samsaraInventory=Array(ARTIFACTS.length).fill(0);s.samsaraForces=[];s.samsaraForceTimer=5;s.samsaraForceIndex=0;s.samsaraPickups=[];s.samsaraPickupTimer=2.5;s.samsaraHudTimer=0;
    const safeY=Math.max(145,playableHeight()-66);s.player={x:W/2,y:safeY,tx:W/2,ty:safeY};
    document.body.classList.toggle('samsara-world',s.planetChoice==='samsara');
    expedition.reset(level);beginSector(sector);renderSamsaraInventory();document.querySelector('footer span').textContent=s.planetChoice==='samsara'?'Веди лотос · собирай цветы · уклоняйся':'Тяни корабль · стрельба автоматическая';document.querySelector('.hud-right .micro').textContent=s.planetChoice==='samsara'?'КОРПУС ЛОТОСА':'ЩИТ КОРАБЛЯ';warmOptionalImages();
  }catch(e){if(token!==runToken)return;s.mode='start';overlay(`<h2>Подготовка прервана</h2><p>${e.message}</p>`);action('Попробовать ещё',()=>startRun(sector,level));}
}
function beginSector(sector){
  if(currentMenu?.id==='launch')currentMenu={id:'briefing',render:()=>beginSector(sector),scroll:0};
  else enterMenu('briefing',()=>beginSector(sector));
  weaponTab='bass';
  s.sector=sector;s.cleared=0;s.position=0;s.routeNumber=0;s.health=s.maxHealth||shipBuild().maxHealth;s.bullets=[];s.shots=[];s.enemy=null;s.drones=[];s.overdrive=0;s.waveTimer=s.planetChoice==='samsara'&&s.runLevel===0?9:1;s.capsule=null;s.capsuleTimer=0;s.hydraBlast=null;s.groundCombat=false;
  if(s.planetChoice==='samsara'){const safeY=Math.max(145,playableHeight()-66);s.player={x:W/2,y:safeY,tx:W/2,ty:safeY};}
  $('recognized-chord').textContent='';$('feedback').textContent='';s.feedbackTimer=0;$('feedback').classList.remove('visible');signal('Готовимся к полёту');qualityBank=0;s.route=s.bookMission?.route?s.bookMission.route:s.bookMission?createBookRoute(s.bookMission.chapter,s.bookMission.index,s.route?.key):createRoute(sector,s.route?.key,Math.random,0,expedition.level);s.listening=false;s.mode='briefing';save();buildPads();renderHud();$('enemy-label').hidden=true;
  const c=SECTORS[sector];
  const map=s.bookMission?`<div class="battle-map"><i class="home">HOME</i>${s.route.sequence.map((_,i)=>`<i><b>${i+1}</b><span>HYDRA</span></i>`).join('')}</div>`:'';
  overlay(`<span class="eyebrow">${s.bookMission?s.route.code:`СЕКТОР 0${sector+1} / ${c.name.toUpperCase()}`}</span><h2>${s.bookMission?`${s.route.sequence.length} целей · гармонический маршрут`:c.title}</h2><p>${s.bookMission?'Home звучит перед стартом. Затем каждая гидра продолжает одну настоящую последовательность.':s.planetChoice==='samsara'?'Ступень и тип аккорда — два независимых ответа. Каждый верный сигнал ослабляет хранителя и возвращает силы.':c.description}</p>${map}<p class="compact">${s.planetChoice==='samsara'?'Перемещай лотос, уклоняйся и собирай цветы. Накопленные артефакты над ступенями нажимаются вручную и рассеивают силы противников. Верные ответы пополняют топливо и энергию.':s.bookMission?'Все аккорды звучат вертикально. Перед целью услышишь до трёх предыдущих аккордов маршрута.':sector===0?'Во время сигнала гидра не атакует. Тяни корабль пальцем; правильная кнопка заряжает выстрел.':sector===1?'I, IV и V — ступени относительно тоники. Цифровка написана прямо на оружии.':'Бас даёт усиление сразу. Два пробитых щита уничтожают гидру. Ошибка не восстанавливает уже пробитый щит.'}</p>`);
  if(s.bookMission){action('Запустить маршрут →',()=>spawnEnemy());action('Выбрать другую миссию',missionBack,true);}
  else{action('Послушать новые сигналы',()=>startLessons());action('Skip → Сразу в бой',()=>spawnEnemy(),true);action('♫ Ознакомление со звуками',()=>openStudy(),true);action('Тренажёр ступеней и аккордов',()=>openTrainer(),true);action('Артефакты и правила',()=>artifactGuide(),true);}syncPads();
}
async function openStudy(){
  enterMenu('study',openStudy);
  study.back=s.mode;audio.stop();s.mode='study';s.listening=false;s.keys.clear();renderStudy();syncPads();
  try{await audio.unlock();}catch(e){feedback(e.message,true);}
}
function closeStudy(){menuBack();}
async function openTrainer(){
  enterMenu('trainer',openTrainer);
  trainer.back=s.mode;trainer.timbre=record().trainerTimbre==='piano'?'piano':'synth';audio.stop();s.mode='trainer';s.listening=false;s.keys.clear();renderTrainer();syncPads();
  try{await audio.unlock();if(s.mode==='trainer')newTrainerRound();}catch(e){feedback(e.message,true);}
}
function closeTrainer(){menuBack();}
function trainerPools(){
  if(trainer.level===0)return {degrees:[0,7],qualities:['maj']};
  if(trainer.level===1)return {degrees:[0,5,7,9],qualities:['maj','6','m7','7sus4']};
  return {degrees:Object.keys(DEGREES).map(Number),qualities:['maj','min','6','m6','7','maj7','m7','m7b5','dim7','7sus4','aug']};
}
const trainerKey=chord=>`${chord.offset}:${chord.quality}`;
function renderTrainer(){
  const levelNames=['Новичок','Студент','Магистр музыки'];
  const score=trainer.total?`${trainer.correct}/${trainer.total} верно · ${Math.round(trainer.correct/trainer.total*100)}%`:'Пока нет ответов';
  const status=trainer.locked?'♫ Слушай сигнал…':trainer.revealed?'Нажимай варианты, чтобы сравнить их звучание':'Нажми вариант ответа';
  const articulation=trainer.articulation==='together'?'вертикальный аккорд':trainer.articulation==='up'?'арпеджио вверх':'арпеджио вниз';
  overlay(`<span class="eyebrow">ТРЕНАЖЁР · БЕЗ ВРАГОВ И ТАЙМЕРА</span><h2>Слуховой полигон</h2><p class="compact">Сначала звучит тоника, затем один полный аккорд — точно как гидра в полёте. Нажатие играет выбранный аккорд и показывает его ноты. После ответа сравнивай любые варианты без штрафа.</p><div id="trainer-levels" class="study-tabs"></div><div id="trainer-sound" class="study-tabs trainer-sound"></div><div id="trainer-articulation" class="study-tabs"></div><div class="study-readout"><strong id="trainer-readout">?</strong><span id="trainer-status">${status}</span><div id="trainer-voicing" class="trainer-voicing" hidden></div></div><div id="trainer-choices" class="study-choices trainer-chord-choices"></div><p class="compact">${score} · ${articulation}</p>`);
  const add=(id,label,fn,selected)=>{const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed',String(selected));b.addEventListener('click',fn);$(id).append(b);return b;};
  levelNames.forEach((name,index)=>add('trainer-levels',name,()=>{trainer.level=index;newTrainerRound();},trainer.level===index));
  for(const [timbre,label] of [['synth','Synth'],['piano','Grand Piano']])add('trainer-sound',label,()=>{
    trainer.timbre=timbre;localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...record(),trainerTimbre:timbre}));newTrainerRound();
  },trainer.timbre===timbre);
  for(const [mode,label] of [['together','Аккорд'],['up','Арпеджио ↑'],['down','Арпеджио ↓']])add('trainer-articulation',label,()=>{trainer.articulation=mode;newTrainerRound();},trainer.articulation===mode);
  for(const chord of trainer.choices){
    const label=chordSymbol(chord),b=add('trainer-choices',label,()=>{
      if(!trainer.revealed)answerTrainer(trainerKey(chord));
      showTrainerVoicing(chord);auditionTrainer(chord);
    },false);
    b.title=`${DEGREES[chord.offset].label} · ${QUALITIES[chord.quality].label}`;b.dataset.answer=trainerKey(chord);b.disabled=trainer.locked;
    if(trainer.revealed&&trainerKey(chord)===trainerKey(trainer.target))b.classList.add('selected');
  }
  action('↻ Повторить · Space',playTrainerRound,trainer.locked);
  if(trainer.revealed)action('Следующий сигнал →',newTrainerRound);
  action('Вернуться',closeTrainer,true);
}
function newTrainerRound(){
  trainerAudition++;audio.stop();const pools=trainerPools(),all=pools.degrees.flatMap(offset=>pools.qualities.map(quality=>({offset,quality})));trainer.target=all[Math.floor(Math.random()*all.length)];
  const targetKey=trainerKey(trainer.target),wrong=all.filter(chord=>trainerKey(chord)!==targetKey).sort(()=>Math.random()-.5).slice(0,Math.min(5,all.length-1));trainer.choices=[trainer.target,...wrong].sort(()=>Math.random()-.5);trainer.tonic=48+[0,2,3,5,7,9,10][Math.floor(Math.random()*7)];trainer.locked=true;trainer.revealed=false;renderTrainer();playTrainerRound();
}
async function playTrainerRound(){
  if(s.mode!=='trainer'||trainer.target===null)return;
  try{await audio.unlock();if(trainer.timbre==='piano')await audio.preparePiano();if(s.mode!=='trainer')return;trainer.locked=true;renderTrainer();
    const target=trainer.target,articulation=trainer.articulation;
    const done=()=>{if(s.mode==='trainer'&&trainer.target===target){trainer.locked=false;renderTrainer();}};
    audio.trainerChord(trainer.tonic,target,done,articulation,trainer.timbre);
  }catch(e){
    trainer.locked=false;
    if(trainer.timbre==='piano'){trainer.timbre='synth';localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...record(),trainerTimbre:'synth'}));renderTrainer();}
    feedback(e.message,true);
  }
}
function answerTrainer(value){
  if(s.mode!=='trainer'||trainer.locked||trainer.revealed)return;
  trainer.total++;trainer.revealed=true;const key=trainerKey(trainer.target),correct=value===key;if(correct)trainer.correct++;
  const symbol=chordSymbol(trainer.target),description=`${DEGREES[trainer.target.offset].label} · ${QUALITIES[trainer.target.quality].label}`;
  renderTrainer();
  $('trainer-readout').textContent=symbol;$('trainer-status').textContent=correct?`${description} · верно. Теперь сравни варианты.`:`Верный ответ: ${symbol} · ${description}. Сравни варианты.`;
  feedback(correct?'Точный слуховой захват':'Сверь правильный и выбранный аккорды',!correct);
}
async function auditionTrainer(chord){
  if(s.mode!=='trainer'||!trainer.revealed)return;
  const label=chordSymbol(chord),target=trainer.target,cue=++trainerAudition;
  try{await audio.unlock();if(trainer.timbre==='piano')await audio.preparePiano();if(s.mode!=='trainer'||!trainer.revealed||trainer.target!==target||cue!==trainerAudition)return;
    $('trainer-status').textContent=`♫ ${label} · сравнение`;
    audio.auditionChord(trainer.tonic,chord,()=>{if(s.mode==='trainer'&&trainer.revealed&&trainer.target===target)$('trainer-status').textContent='Нажимай варианты: звук и точные ноты';},trainer.articulation,trainer.timbre);
  }catch(e){feedback(e.message,true);}
}
function showTrainerVoicing(chord){
  if(s.mode!=='trainer'||!trainer.revealed)return;
  const notes=chordNotes(chord,trainer.tonic).map(midi=>`${NOTE_NAMES[(midi%12+12)%12]}${Math.floor(midi/12)-1}`),panel=$('trainer-voicing');
  panel.innerHTML=`<b>${chordSymbol(chord)}</b><span>${notes.join(' · ')}</span>`;panel.hidden=false;
}
function renderStudy(){
  const item=QUALITIES[study.quality];
  overlay(`<span class="eyebrow">СЛУХОВОЙ АНГАР · БЕЗ ТАЙМЕРА</span><h2>Ознакомление со звуками</h2><p class="compact">Тот же синтезатор, что в полёте. Нажми символ, чтобы услышать его. Сравни maj → maj7 → 7: у двух последних добавлена разная септима.</p><div id="study-tabs" class="study-tabs"></div><div id="study-choices" class="study-choices"></div><div class="study-readout"><strong id="study-symbol">${study.kind==='chord'?item.glyph:study.interval}</strong><span id="study-description">${study.kind==='chord'?item.label:'Интервал от одного опорного звука'}</span></div><div id="study-modes" class="study-tabs"></div><p id="study-status" class="compact">Корень C3 · выбери звук</p>`);
  const add=(container,label,fn,selected=false)=>{const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed',String(selected));b.addEventListener('click',fn);$(container).append(b);return b;};
  for(const [kind,label] of [['chord','Аккорды'],['interval','Интервалы'],['rhythm','Ритмы'],['poly','Rudiments']])add('study-tabs',label,()=>{audio.stop();study.kind=kind;renderStudy();},study.kind===kind);
  const choices=study.kind==='chord'?Object.keys(QUALITIES):study.kind==='interval'?NUMBER_LABELS:(study.kind==='poly'?RUDIMENTS:RHYTHMS).map((_,i)=>i);
  for(const value of choices){const label=study.kind==='chord'?QUALITIES[value].glyph:study.kind==='rhythm'?RHYTHMS[value].name:study.kind==='poly'?RUDIMENTS[value].name:value;
    const b=add('study-choices',label,()=>{study[study.kind==='chord'?'quality':study.kind]=value;renderStudy();playStudy();},value===study[study.kind==='chord'?'quality':study.kind]);b.title=study.kind==='chord'?QUALITIES[value].label:study.kind==='rhythm'?`С уровня: ${PILOTS[RHYTHM_LEVELS[value]].name}`:study.kind==='poly'?`С уровня: ${PILOTS[RUDIMENTS[value].level].name}`:`${NUMBER_OFFSETS[value]} полутонов`;
  }
  if(study.kind==='rhythm'){
    $('study-symbol').textContent=RHYTHMS[study.rhythm].name;$('study-description').textContent=RHYTHM_HINTS[study.rhythm];
    $('study-status').textContent=`110 BPM · ${RHYTHMS[study.rhythm].meter||(RHYTHMS[study.rhythm].beats===6?'3/4':'4/4')} · в игре с уровня «${PILOTS[RHYTHM_LEVELS[study.rhythm]].name}»`;
    add('study-modes','По кругу',()=>{study.loop=!study.loop;renderStudy();playStudy();},study.loop);
    add('study-modes','Стоп',()=>{audio.stop();$('study-status').textContent='Остановлено';});
    const pulse=document.createElement('div');pulse.id='study-pulse';pulse.className='study-pulse';$('study-modes').append(pulse);
  }else if(study.kind==='poly'){
    const p=RUDIMENTS[study.poly];$('study-symbol').textContent=p.name;$('study-description').textContent='R — правая, L — левая. Знак > — акцент. Учебные варианты различаются акцентами.';$('study-status').textContent=`С уровня ${PILOTS[p.level].name}`;
    const score=document.createElement('img');score.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(rudimentScore(p));score.alt=p.sticking;score.style.cssText='width:100%;max-height:120px';$('study-modes').append(score);
    add('study-modes','По кругу',()=>{study.loop=!study.loop;renderStudy();playStudy();},study.loop);add('study-modes','Стоп',()=>audio.stop());
  }else for(const [mode,label] of [['together','Вместе'],['up','Вверх'],['down','Вниз']])add('study-modes',label,()=>{study.mode=mode;renderStudy();playStudy();},study.mode===mode);
  action('↻ Повторить · Space',playStudy);action('Вернуться',closeStudy,true);
}
async function playStudy(){
  if(s.mode!=='study')return;
  try{await audio.unlock();if(s.mode!=='study')return;
    $('study-status').textContent=['rhythm','poly'].includes(study.kind)?'♫ 110 BPM · слушай рисунок':'♫ Слушай · корень C3';
    const done=()=>{if(s.mode==='study')$('study-status').textContent='Повтори или выбери другой символ для сравнения';};
    if(study.kind==='chord')audio.chordOnly(study.root,INTERVALS[study.quality],done,study.mode);
    else if(study.kind==='interval')audio.interval(study.root,NUMBER_OFFSETS[study.interval],study.mode,done);
    else if(study.kind==='poly')audio.poly(RUDIMENTS[study.poly],()=>{if(s.mode==='study'&&study.kind==='poly'&&study.loop)playStudy();else done();});
    else{const rhythm=study.rhythm;audio.rhythm(RHYTHMS[rhythm],()=>{if(s.mode==='study'&&study.kind==='rhythm'&&study.rhythm===rhythm&&study.loop)playStudy();else done();},{loops:study.loop?8:1,onBeat:beat=>{if(s.mode==='study'&&study.kind==='rhythm')$('study-pulse').textContent=Array.from({length:RHYTHMS[rhythm].beats===6?3:4},(_,i)=>i===beat%(RHYTHMS[rhythm].beats===6?3:4)?'●':'○').join('  ');}});}
  }catch(e){feedback(e.message,true);}
}
function artifactGuide(){
  enterMenu('artifact-guide',artifactGuide);
  overlay('<span class="eyebrow">ПАМЯТКА ПИЛОТА</span><h2>Слушай. Лови. Усиливайся.</h2><p class="compact">Услышь интервал и поймай одну цифру: малая терция — ♭3, квинта — 5, малая септима — ♭7, большая — 7. Направление звучания не меняет ответ. Для тритона появится один верный жетон: ♭5 или ♯4. Ошибочный захват завершает попытку.<br><br>Telecaster вызывает гитариста и ладовый режим. Keytar вызывает клавишника и мелодический режим. Overdrive — двойной урон и защита. Jazz Bass — услышь 3 или 7 аккорда и поймай цифру: механические хищники нейтрализуются.<br><br>Yellow Submarine обозначает The Beatles вообще и открывает отдельную комнату группы. На NOVICE среди шести названий две любые песни Beatles; на STUDENT — три, на MASTER — четыре, на LEGEND — все шесть. MELODY FOCUS 50/50 убирает половину неверных вариантов.<br><br>Механическая рулетка выбирает случайное испытание. Реликвия барабанщика останавливает полёт и запускает распознавание стиля или партии. Тарелка Zildjian запасает RHYTHM FOCUS: во время задания она убирает половину неверных вариантов.<br><br>Трубач продолжает полёт и просит поймать названия нот BASIC, GUIDE или ALL TONES. Вибрафонистка останавливает полёт для спокойного распознавания COLOR TONES. На старших уровнях аккорды трубача содержат надстройки, но поле целей остаётся разреженным.<br><br>Механические хищники оставляют подсказки, автомат, невидимость и защиту. Для нейтрализации также используй обычные заряды.</p>');
  action('Сразу в бой →',()=>spawnEnemy());
  action('Попробовать сбор интервалов',()=>{spawnEnemy();audio.stop();s.listening=false;expedition.startChallenge('numbers');},true);
  ARTIFACTS.forEach((item,i)=>action(`Попробовать ${item.name}`,()=>{spawnEnemy();audio.stop();s.listening=false;expedition.artifact(i);if(i===3)playCue();},true));
}
function startLessons(){
  enterMenu('lessons',startLessons);
  lessonItems=s.sector===0?[{offset:0},{offset:7}]:s.sector===1?[{offset:5}]:
    s.sector===2?[{offset:9},{offset:0,quality:'maj',kind:'maj'},{offset:0,quality:'6',kind:'6'},{offset:0,quality:'m7',kind:'m7'},{offset:0,quality:'7sus4',kind:'7sus4'}]:
    [{offset:1},{offset:4},{offset:0,quality:'m7',kind:'m7'},{offset:0,quality:'maj7',kind:'maj7'}];
  lessonItems.push({interval:targetForSector(s.sector)});
  lessonIndex=0;showLesson();
}
function showLesson(){
  if(lessonItems[lessonIndex].interval){showIntervalLesson();return;}
  s.mode='lesson';const item=lessonItems[lessonIndex],data=item.kind?QUALITIES[item.kind]:DEGREES[item.offset];
  overlay(`<span class="eyebrow">СЛУШАЙ И ЗАПОМИНАЙ · ${lessonIndex+1}/${lessonItems.length}</span><div class="lesson-symbol" style="color:${data.color}">${data.glyph}</div><h2>${data.name}</h2><p>${item.kind?`${data.label}. Запомни звучание вместе с обозначением ${data.glyph}.`:`Сначала звучит тоника I, затем ступень ${data.glyph}. Сравни высоту сигнала с тоникой.`}</p>`);
  const next=action(lessonIndex===lessonItems.length-1?'В бой →':'Запомнил →',()=>{audio.stop();lessonIndex++;if(lessonIndex<lessonItems.length)showLesson();else spawnEnemy();});
  const replay=action('↻ Послушать ещё',()=>playLesson(),true);
  action('Skip → Сразу в бой',()=>{audio.stop();spawnEnemy();},true);
  function playLesson(){next.disabled=true;replay.disabled=true;signal('Слушай опору…',true);
    audio.example(s.route,item.offset,item.quality||'maj',item.kind?2:0,part=>signal(part==='home'?'I · тоника — точка отсчёта':part==='chord'?`${data.glyph} ${data.name}`:`${data.glyph} ${item.kind?'Нижний звук':data.name}`,true),()=>{if(s.mode==='lesson'){next.disabled=false;replay.disabled=false;signal('Запомни этот сигнал');}});
  }
  playLesson();syncPads();
}
function showIntervalLesson(){
  s.mode='lesson';const target=INTERVAL_TARGETS[lessonItems[lessonIndex].interval];
  overlay(`<span class="eyebrow">НОВОЕ ТОПЛИВО · СЛУШАЙ ОБРАЗЕЦ</span><div class="lesson-symbol">${target.glyph}</div><h2>Один интервал — один жетон.</h2><p>Услышь ${target.name} и поймай ${target.glyph}. Направление не меняет ответ. Среди множества жетонов только один правильный.</p><p class="compact">Верный захват: +30 силы. Ошибка завершает попытку.</p>`);
  const next=action('В бой →',()=>{audio.stop();spawnEnemy();});
  const again=action('↻ Запомнить звук',play,true);
  action('Skip → Сразу в бой',()=>{audio.stop();spawnEnemy();},true);
  function play(){next.disabled=true;again.disabled=true;signal(`Образец ${target.glyph} · ${target.name}`,true);audio.interval(60+s.route.key,lessonItems[lessonIndex].interval,'up',()=>{if(s.mode==='lesson'){next.disabled=false;again.disabled=false;signal('Этот интервал — твоё топливо');}});}
  play();syncPads();
}
function spawnEnemy(){
  hideOverlay();s.mode='active';s.listening=false;weaponTab='bass';
  const model=expedition.level===0?Math.min(2,s.sector):expedition.level;
  s.enemy={chord:s.route.sequence[s.position],model,shields:{bass:false,quality:s.sector<2},x:W/2,y:-machineSize(model)*.6,holdY:Math.max(155,Math.min(playableHeight()*.36,230)),groundPhase:'approach',suspended:false,hull:4*(100+model*35),maxHull:4*(100+model*35),age:0,misses:0,hit:0,muzzle:0,guns:enemyGuns(model)};
  $('enemy-label').hidden=false;$('enemy-label').firstElementChild.textContent=s.planetChoice==='samsara'?`ХРАНИТЕЛЬ · ${String(s.totalCleared+1).padStart(2,'0')}`:s.bookMission?`${s.route.code} · HYDRA ${String(s.position+1).padStart(2,'0')}/${String(s.route.sequence.length).padStart(2,'0')}`:`HYDRA · ${MACHINES[s.enemy.model]} / ${String(s.totalCleared+1).padStart(2,'0')}`;
  $('dock-label').textContent=s.planetChoice==='samsara'?'СТУПЕНЬ · ТИП АККОРДА':s.bookMission||s.sector>=2?'ОДИН АККОРД — ОДИН ВЫСТРЕЛ':'УЗНАЙ СИГНАЛ — ВЫСТРЕЛИ';
  $('dock-tip').textContent=s.planetChoice==='samsara'?'Узнай ступень и тип аккорда в любом порядке':s.bookMission||s.sector>=2?'Выбери готовый аккорд: ступень и тип на одной плашке':'Выбери ступень относительно тоники I';
  s.fireTimer=expedition.pilot.grace;if(s.planetChoice==='samsara')buildPads();else if(s.bookMission||s.sector>=2)buildBookPads();renderHud();playCue();
}
function buildBookPads(){
  const target=s.enemy.chord,candidates=[target];
  for(const chord of s.route.sequence)if(chord!==target)candidates.push(chord);
  const contrast={maj:'min',min:'maj','7':'maj7',maj7:'7',m7:'7',m7b5:'m7','6':'maj',m6:'min','7sus4':'7'}[target.quality]||'maj';
  candidates.push({offset:target.offset,quality:contrast},{...target,offset:(target.offset+5)%12},{...target,offset:(target.offset+7)%12},{...target,offset:(target.offset+2)%12});
  const unique=[];for(const chord of candidates){const key=chordAnswerKey(chord);if(!unique.some(item=>item.key===key))unique.push({key,chord});}
  const correctKey=chordAnswerKey(target),wrong=unique.filter(item=>item.key!==correctKey).sort(()=>Math.random()-.5).slice(0,5),choices=[{key:correctKey,chord:target},...wrong].sort(()=>Math.random()-.5);
  const panel=$('bass-pads');panel.classList.add('book-chord-pads');panel.replaceChildren();
  for(const {chord} of choices){const b=document.createElement('button');b.className='pad chord-choice';b.textContent=chordSymbol(chord);b.setAttribute('aria-label',`Ответ: ${chordSymbol(chord)}`);b.addEventListener('click',()=>answerBookChord(chord,b));panel.append(b);}
}
function answerBookChord(choice,button){
  const {offset,quality}=choice;
  if(s.mode!=='active'||s.listening||!s.enemy||expedition.busy)return;
  const chord=s.enemy.chord,correct=chordAnswerKey(choice)===chordAnswerKey(chord);
  if(correct){const attempts=s.attempts,recognized=s.correct;answer('bass',chord.offset,button);answer('quality',chord.quality,button);s.attempts=attempts+1;s.correct=recognized+1;return;}
  recordHydraMistake();
  s.attempts++;s.stats[offset!==chord.offset?'bass':'quality'].miss++;s.enemy.misses++;s.combo=0;s.power=Math.max(1,s.power-1);s.fireTimer=4.5;button.classList.add('wrong');button.dataset.locked='1';button.disabled=true;if(s.planetChoice==='samsara'){changeSamsaraResource('energy',-7);changeSamsaraResource('crew',-3);audio.answerFeedback({world:'samsara',correct:false});}feedback(`${chordSymbol(choice)} · чужой сигнал`,true);enemyVolley(true);renderHud();
}
function playCue(referenceOnly=false){
  if(s.mode!=='active'||!s.enemy)return;
  s.listening=true;s.bullets=[];syncPads();signal(s.bookMission?(referenceOnly?'♫ HOME → текущая HYDRA':'♫ Вспоминай маршрут…'):'Слушай опору…',true);
  if(s.bookMission){
    const player=referenceOnly?audio.bookReference.bind(audio):audio.progression.bind(audio);
    player(s.route,s.position,event=>{if(event.part==='home')signal(referenceOnly?'HOME · одна нота':'HOME · точка старта',true);else if(event.part==='target')signal(`HYDRA ${s.position+1} · определи аккорд`,true);else signal(`${chordSymbol(s.route.sequence[event.index])} · пройдено`,true);},()=>{if(s.mode!=='active')return;s.listening=false;s.fireTimer=Math.max(s.fireTimer,3);signal('Определи текущую гидру: ступень + тип');syncPads();});return;
  }
  audio.play(s.route,s.enemy.chord,s.sector,part=>signal(part==='home'?'I · тоника — точка отсчёта':part==='bass'?'♫ Сигнал гидры':'♫ Слушай тип аккорда',true),()=>{
    if(s.mode!=='active')return;s.listening=false;s.fireTimer=Math.max(s.fireTimer,3);signal(s.sector>=2?'Пробей оба щита':'Узнай сигнал и стреляй');syncPads();
  });
}
function answer(kind,value,button){
  if(s.mode!=='active'||s.listening||!s.enemy||expedition.busy)return;
  const outcome=answerResult(s.enemy.chord,s.enemy.shields,kind,value);if(outcome.ignored)return;
  intelligence.record('hydra-'+kind,kind==='bass'?s.enemy.chord.offset:s.enemy.chord.quality,outcome.correct?1:0);
  s.attempts++;s.stats[kind][outcome.correct?'hit':'miss']++;
  if(outcome.correct){
    s.correct++;s.enemy.shields=outcome.shields;s.beam=.3;s.enemy.hit=.25;s.score+=kind==='bass'?100:150;awardScrap(kind==='bass'?7:10);
    if(s.planetChoice==='samsara'){changeSamsaraResource(kind==='bass'?'fuel':'energy',kind==='bass'?6:8);changeSamsaraResource('crew',2);audio.answerFeedback({world:'samsara',correct:true,complete:outcome.destroyed});}
      if(kind==='bass'){s.power=Math.min(3,s.power+1);s.overdrive=7;feedback(s.planetChoice==='samsara'?'Ступень узнана · запас топлива пополнен':'Щит пробит · ВЕЕРНЫЙ ОГОНЬ');}
    else feedback(`${s.enemy.chord.qualityGlyph??QUALITIES[s.enemy.chord.quality]?.glyph??s.enemy.chord.quality} · тип распознан`);
    if(!outcome.destroyed)weaponTab=kind==='bass'?'quality':'bass';
    burst(s.enemy.x,s.enemy.y,kind==='bass'?'#79f5d0':'#ff7ea7',25);
    if(outcome.destroyed){
      defeatHydra(true);
    }
  }else{
    recordHydraMistake();s.enemy.misses++;s.combo=0;s.power=Math.max(1,s.power-1);s.fireTimer=4.5;
    if(s.planetChoice==='samsara'){changeSamsaraResource('energy',-7);changeSamsaraResource('crew',-3);audio.answerFeedback({world:'samsara',correct:false});}
    feedback('Гидра отвечает — уклоняйся!',true);s.flash=.12;
    button?.classList.add('wrong');setTimeout(()=>button?.classList.remove('wrong'),400);enemyVolley(true);
    if(s.enemy.misses>=2)$('dock-tip').textContent='Нажми «Слушать»: дом и сигнал прозвучат снова';
  }
  renderHud();syncPads();
}
function defeatHydra(recognized){
  if(!s.enemy||s.mode!=='active')return;
  if(!recognized)recordHydraMistake();
      if(recognized)s.combo++;else s.combo=0;s.totalCleared++;s.cleared++;if(recognized&&s.enemy.misses===0)s.firstTry++;
      s.score+=(recognized?200:60)+Math.min(s.combo,10)*25;awardScrap(24+Math.min(s.combo,8)*2);s.resolveTimer=s.bookMission?1.4:6;s.mode='resolving';s.bullets=[];s.overdrive=Math.max(s.overdrive,6);s.waveTimer=.3;
      const label=DEGREES[s.enemy.chord.offset];
      const repaired=recognized&&s.health<s.maxHealth?(s.health=Math.min(s.maxHealth,s.health+1),1):0;
      if(recognized&&s.planetChoice==='samsara'){changeSamsaraResource('fuel',4);changeSamsaraResource('energy',5);changeSamsaraResource('crew',3);}
      feedback(`${s.sector>=2?chordSymbol(s.enemy.chord):label.glyph} · ${recognized?'щиты пробиты':'корпус уничтожен огнём'}${repaired?' · +1 ЩИТ':''}`);
      $('recognized-chord').textContent=s.sector>=2?chordSymbol(s.enemy.chord):label.glyph;
      beginHydraDestruction(s.enemy);
      s.capsuleTimer=0;
      $('enemy-label').hidden=true;signal(s.bookMission?'Маршрут продолжается…':'Разгон! Услышь интервал и поймай один жетон');
      if(recognized&&s.combo%3===0){const before=s.health;s.health=Math.min(s.maxHealth,s.health+1);s.score+=100;if(s.health>before)feedback('Серия ×3 · щит восстановлен +1 HP');}
}
function enemyVolley(aimed=false){
  if(!s.enemy||expedition.cloaked||expedition.safeNoteFlight||s.enemy.groundPhase!=='combat')return;
  const e=s.enemy,count=aimed?3:2+pressure(expedition.level,s.combo,s.health),speed=(aimed?100:72+s.sector*14)*expedition.pilot.speed;
  const angle=Math.atan2(s.player.y-e.y,s.player.x-e.x);
  const ports=(e.guns||enemyGuns(e.model||0)).filter(port=>!port.destroyed&&port.hp>0);if(!ports.length)return;e.muzzle=.18;
  for(let i=0;i<count;i++){const a=angle+(i-(count-1)/2)*.26,port=ports[i%ports.length];s.bullets.push({x:e.x+port.x,y:e.y+port.y+17,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:6});}
}
function advance(){
  s.hydraBlast=null;s.groundCombat=false;s.enemy=null;s.capsule=null;s.capsuleTimer=0;s.position++;
  if(s.cleared>=(s.bookMission?s.route.sequence.length:SECTORS[s.sector].count)){
    save();s.mode='intermission';$('enemy-label').hidden=true;audio.stop();
    if(s.sector>=2){finish(true);return;}
    overlay(`<span class="eyebrow">СЕКТОР ПРОЙДЕН</span><h2>Чистый сигнал.</h2><p>Путь свободен. Щит корабля восстановлен.<br>Дальше — ${SECTORS[s.sector+1].name.toLowerCase()}.</p><div class="results"><div><strong>${s.score}</strong><span>ОЧКОВ</span></div><div><strong>${s.firstTry}</strong><span>С ПЕРВОГО РАЗА</span></div></div>`);
    action('Лететь дальше →',()=>beginSector(s.sector+1));syncPads();return;
  }
  if(s.position>=s.route.sequence.length){if(s.bookMission){finish(true);return;}s.position=0;s.routeNumber++;s.route=createRoute(s.sector,s.route.key,Math.random,s.routeNumber,expedition.level);}
  spawnEnemy();
}
function finish(won,revisit=false){
  if(!won&&!revisit&&s.mode==='active'&&!s.enemy?.reviewRecorded)recordHydraMistake();
  enterMenu('result',()=>finish(won,true));
  s.mode=won?'finished':'gameover';audio.stop();s.listening=false;const returnScrap=Math.max(12,Math.floor(s.score/90));if(!revisit)awardScrap(returnScrap);save();syncPads();
  const accuracy=s.attempts?Math.round(s.correct/s.attempts*100):0;
  const failedChord=!won&&s.enemy?.chord?`<p class="failed-chord">${s.planetChoice==='samsara'?'ПОСЛЕДНИЙ ХРАНИТЕЛЬ':'ПОСЛЕДНЯЯ ГИДРА'} · <strong>${chordSymbol(s.enemy.chord)}</strong><br><small>${DEGREES[s.enemy.chord.offset].label} · ${s.enemy.chord.qualityGlyph??QUALITIES[s.enemy.chord.quality]?.label??s.enemy.chord.quality}</small></p>`:'';
  overlay(`<span class="eyebrow">${s.bookMission?s.route.code:won?'МАРШРУТ ЗАВЕРШЁН':'КОРАБЛЬ ВЕРНУЛСЯ НА БАЗУ'}</span><h2>${won?'Маршрут взят.':'Ещё один вылет?'}</h2><p>${won&&s.bookMission?'Все гидры уничтожены. Сейчас маршрут прозвучит целиком вертикальными аккордами.':won?'Ступени и цифровки аккордов становятся частью твоего оружия.':'Сигналы становятся знакомее с каждым полётом. Попробуем этот сектор ещё раз.'}</p>${failedChord}<div class="results"><div><strong>${s.score}</strong><span>ОЧКОВ</span></div><div><strong>◉ ${returnScrap}</strong><span>CREDITS</span></div><div><strong>${accuracy}%</strong><span>${s.planetChoice==='samsara'?'ТОЧНОСТЬ':'ПОПАДАНИЙ'}</span></div></div><p class="compact">Бас: ${s.stats.bass.hit}/${s.stats.bass.hit+s.stats.bass.miss} · Тип: ${s.stats.quality.hit}/${s.stats.quality.hit+s.stats.quality.miss}<br>Капсулы: ${s.intervalStats.caught} верных · ${s.intervalStats.wrong} чужих</p>`);
  if(won&&s.bookMission){audio.progression(s.route,s.route.sequence.length-1,event=>signal(`${event.index+1} · ${chordSymbol(s.route.sequence[event.index])}`,true),()=>signal(`${s.route.code} · COMPLETE`),true);action('↻ Прослушать весь маршрут',()=>audio.progression(s.route,s.route.sequence.length-1,event=>signal(`${event.index+1} · ${chordSymbol(s.route.sequence[event.index])}`,true),()=>signal(`${s.route.code} · COMPLETE`),true),true);}
  action(won?(s.bookMission?.route?'Повторить стандарт':'Новый вылет · другая тональность'):'Повторить сектор',()=>s.bookMission?missionReplay():startRun(won?(s.sector===3?3:0):s.sector,s.runLevel));
  action(`Разбор полёта · ${debrief.log.pendingCount} ошибок`,debrief.open);
  action('Выбрать уровень',()=>{s.mode='start';expedition.reset();startScreen();},true);
  action('Ангар · потратить детали',openHangar,true);
  if(s.bookMission)action('Карта миссий',missionBack,true);
  if(won)action('Все ступени и аккорды',()=>startRun(3),true);
}
function pause(help=false){
  if(s.mode==='study'){audio.stop();return;}
  if(['paused','start','gameover','finished','loading','debrief'].includes(s.mode))return;
  const pausedMode=s.mode;enterMenu('pause',()=>{s.mode=pausedMode;pause(help);});
  previousMode=s.mode;s.mode='paused';audio.stop();s.listening=false;s.keys.clear();s.pointer=null;syncPads();expedition.render();
  overlay(`<span class="eyebrow">${help?'ПОЛЁТ ПО СЛУХУ':'ПАУЗА'}</span><h2>${help?'Твой слух — оружие.':'Держим позицию.'}</h2><p>Тяни корабль по полю, чтобы уклоняться. Сначала звучит тоника I, потом сигнал гидры. Нажми подходящую кнопку, чтобы пробить щит.</p><p class="compact">Стрелки — движение · 1–4 — первые ступени · QWER — первые типы · пробел — слушать · Esc — пауза.<br>В хроматическом полёте: все кнопки доступны касанием; типы — в двух вкладках.<br>Три победы подряд восстанавливают щит.</p>`);
  action('Продолжить полёт',resume);action('На базу',()=>{++runToken;audio.stop();s.mode='start';s.enemy=null;s.capsule=null;s.bullets=[];s.shots=[];expedition.reset();$('enemy-label').hidden=true;startScreen();},true);
  action('♫ Ознакомление со звуками',()=>openStudy(),true);
}
async function resume(){
  const token=runToken;
  try{await audio.unlock();if(s.mode!=='paused'||token!==runToken)return;
    s.mode=previousMode;hideOverlay();
    if(s.mode==='lesson'){showLesson();return;}
    if(s.mode==='briefing'){beginSector(s.sector);return;}
    if(s.mode==='intermission'){beginSector(s.sector+1);return;}
    if(expedition.busy)expedition.resumeChallenge();else if(s.mode==='active')playCue();else if(s.mode==='resolving'&&s.capsule)playCapsule();syncPads();
  }catch(e){feedback(e.message,true);}
}
function burst(x,y,color,count){for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2,speed=30+Math.random()*150;s.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.5+Math.random()*.7,color});}if(s.particles.length>350)s.particles.splice(0,s.particles.length-350);}
function shipHit(){
  if(s.invulnerable>0||expedition.invincible||expedition.safeNoteFlight||expedition.pausedCombat||!['active','resolving'].includes(s.mode))return;
  s.health--;s.invulnerable=s.planetChoice==='samsara'?(s.runLevel===0?3.2:2.1):1.4;s.combo=0;s.flash=.18;burst(s.player.x,s.player.y,'#ff7ea7',15);if(s.planetChoice==='samsara'){changeSamsaraResource('crew',-6);changeSamsaraResource('energy',-4);}feedback(`ПОПАДАНИЕ · −1 ЩИТ · осталось ${Math.max(0,s.health)}`,true);renderHud();if(s.health<=0||s.planetChoice==='samsara'&&s.samsaraVitals.crew<=0)finish(false);
}
function launchCapsule(){
  const capsule=createCapsule(s.sector);s.capsule={...capsule,x:70+Math.random()*(W-140),y:Math.max(130,H*.28),age:0,speed:Math.max(45,H*.115)};
  const target=INTERVAL_TARGETS[capsule.wanted];$('capsule-symbol').textContent=target.glyph;
  $('capsule-rule').textContent=`${target.name} — лови. Другой — пропусти.`;
  $('capsule-reward').textContent=`${INTERVAL_MODES[capsule.mode].name} · +${capsule.energy} силы`;
  $('dock-label').textContent='СЛУШАЙ НАЧИНКУ · ЛОВИ СОВПАДЕНИЕ';$('dock-tip').textContent='Метка — нужный интервал. Внутри может звучать другой.';
  playCapsule();
}
function playCapsule(reference=false){
  if(!s.capsule||s.mode!=='resolving')return;
  s.listening=true;syncPads();const c=s.capsule;
  signal(reference?`Образец ${INTERVAL_TARGETS[c.wanted].glyph}`:'♫ Слушай пару нот в капсуле',true);
  audio.interval(60+s.route.key,reference?c.wanted:c.heard,reference?'up':c.mode,()=>{if(s.mode==='resolving'&&s.capsule===c){s.listening=false;signal('Совпало с меткой? Поймай. Нет? Пропусти.');syncPads();}});
}
function resolveCapsule(caught){
  const c=s.capsule,outcome=capsuleOutcome(c);
  if((caught&&!outcome.correct)||(!caught&&outcome.correct))debrief.record({kind:'numbers',interval:c.heard,root:60+s.route.key,direction:c.mode});
  if(caught){
    if(outcome.correct){const reactor=shipBuild().energyGain;s.intervalStats.caught++;s.energy+=Math.round(outcome.energy*reactor);s.score+=outcome.energy*5;awardScrap(9);s.power=Math.min(3,s.power+1);s.overdrive=3+outcome.energy/10;burst(c.x,c.y,'#79f5d0',35);feedback(`Верный интервал · +${outcome.energy} силы`);if(s.energy>=100){s.energy-=100;s.health=Math.min(s.maxHealth,s.health+1);s.overdrive=9;}}
    else{s.intervalStats.wrong++;s.energy=Math.max(0,s.energy-20);s.power=Math.max(1,s.power-1);s.overdrive=0;s.flash=.15;feedback(`Это ${c.heard===3?'♭3':c.heard===4?'3':c.heard===5?'4':'5'} · чужой сигнал, −20 силы`,true);}
  }else if(outcome.correct){s.intervalStats.missed++;feedback('Нужный интервал пролетел · ещё встретим');}
  else{s.intervalStats.avoided++;feedback('Чужая капсула прошла мимо');}
  s.capsule=null;s.listening=false;s.resolveTimer=Math.min(s.resolveTimer,1);renderHud();syncPads();
}
function update(dt){
  if(['paused','study','trainer','debrief'].includes(s.mode))return;
  if(!['active','resolving'].includes(s.mode))
  clock+=dt;
  if(s.feedbackTimer>0){s.feedbackTimer-=dt;if(s.feedbackTimer<=0)$('feedback').classList.remove('visible');}
  s.flash=Math.max(0,s.flash-dt);s.beam=Math.max(0,s.beam-dt);s.invulnerable=Math.max(0,s.invulnerable-dt);
  s.groundScrollDelta=0;s.shake=Math.max(0,s.shake-dt);
  if(expedition.scenePaused){expedition.tick(dt);return;}
  const playing=['active','resolving'].includes(s.mode);
  stepGround(dt,playing);
  if(playing){
    if(s.planetChoice==='samsara'&&!s.listening){s.samsaraVitals.fuel=clamp(s.samsaraVitals.fuel-dt*.21,0,100);s.samsaraVitals.energy=clamp(s.samsaraVitals.energy-dt*.10,0,100);if(s.samsaraVitals.fuel<12||s.samsaraVitals.energy<12)s.samsaraVitals.crew=clamp(s.samsaraVitals.crew-dt*.12,0,100);s.samsaraHudTimer-=dt;if(s.samsaraHudTimer<=0){renderSamsaraResources();s.samsaraHudTimer=.25;}if(s.samsaraVitals.fuel<=0||s.samsaraVitals.energy<=0||s.samsaraVitals.crew<=0){finish(false);return;}}
    const p=s.player,speed=shipBuild().speed*dt;
    if(s.keys.has('arrowleft')||s.keys.has('a'))p.tx-=speed;
    if(s.keys.has('arrowright')||s.keys.has('d'))p.tx+=speed;
    if(s.keys.has('arrowup')||s.keys.has('w'))p.ty-=speed;
    if(s.keys.has('arrowdown')||s.keys.has('s'))p.ty+=speed;
    p.tx=clamp(p.tx,25,W-25);p.ty=clamp(p.ty,115,playableHeight()-35);p.x+=(p.tx-p.x)*Math.min(1,dt*16);p.y+=(p.ty-p.y)*Math.min(1,dt*16);p.y=Math.min(p.y,playableHeight()-35);
    expedition.tick(dt);
    if(s.planetChoice==='samsara'&&!expedition.scenePaused)stepSamsaraPickups(dt);
    collideHydraBody();
    const safeFlight=!!expedition.safeNoteFlight;
    if(s.mode==='active'&&s.enemy)$('enemy-label').hidden=safeFlight;
    if(safeFlight||s.hydraBlast){s.bullets=[];s.shots=[];s.drones=[];s.shotTimer=.2;s.waveTimer=Math.max(s.waveTimer,3);s.fireTimer=Math.max(s.fireTimer,3);}
    const hadBoost=s.overdrive>0;if(!s.listening)s.overdrive=Math.max(0,s.overdrive-dt);if(hadBoost&&s.overdrive===0)renderHud();
    s.shotTimer-=dt;if(s.planetChoice!=='samsara'&&!safeFlight&&!s.hydraBlast&&s.shotTimer<=0){const build=shipBuild(),boost=s.overdrive>0||expedition.boosted;s.shotTimer=boost?.09:build.shotDelay;const count=boost?5:Math.max(s.power,build.shots);for(let i=0;i<count;i++)s.shots.push({x:p.x+(i-(count-1)/2)*10,y:p.y-20,vx:boost?(i-2)*60:0});}
    if(!reduced&&s.planetChoice!=='samsara')burst(p.x,p.y+24,'#5efbdd',1);
    if(s.enemy&&!safeFlight){s.enemy.age+=dt;s.enemy.hit=Math.max(0,s.enemy.hit-dt);s.enemy.muzzle=Math.max(0,(s.enemy.muzzle||0)-dt);}
    if(!safeFlight&&!s.hydraBlast&&!s.listening&&!expedition.pausedCombat){
      if(s.planetChoice==='samsara')stepSamsaraForces(dt);
      else{const difficulty=pressure(expedition.level,s.combo,s.health);
        s.waveTimer-=dt;if(s.waveTimer<=0&&s.drones.length<10){s.drones.push(...formation(s.waveIndex++,W,difficulty));s.waveTimer=s.mode==='resolving'?2.3:6;}
        for(const d of s.drones){stepDrone(d,dt*expedition.pilot.speed,W);if(d.fire<=0&&d.y>20&&d.y<H*.6&&!expedition.cloaked){d.fire=10;const a=Math.atan2(p.y-d.y,p.x-d.x);s.bullets.push({x:d.x,y:d.y,vx:Math.cos(a)*75,vy:Math.sin(a)*75,r:5});}if(d.y>0&&hitCircle(d,p,25)){d.hp=0;shipHit();}}}
      if(s.mode==='active'&&!expedition.busy){s.fireTimer-=dt;if(s.fireTimer<=0){enemyVolley();s.fireTimer=expedition.pilot.grace;}}
      s.bullets.forEach(b=>{b.age=(b.age||0)+dt;
        if(s.planetChoice==='samsara'&&b.forceType===0&&b.age<.8){const target=Math.atan2(p.y-b.y,p.x-b.x),current=Math.atan2(b.vy,b.vx),difference=Math.atan2(Math.sin(target-current),Math.cos(target-current)),next=current+clamp(difference,-dt*1.7,dt*1.7);b.vx=Math.cos(next)*132;b.vy=Math.sin(next)*132;}
        if(s.planetChoice==='samsara'&&b.forceType===3){const a=Math.atan2(p.y-b.y,p.x-b.x),speed=Math.hypot(b.vx,b.vy);b.vx+=Math.cos(a)*dt*11;b.vy+=Math.sin(a)*dt*11;const magnitude=Math.hypot(b.vx,b.vy)||1;b.vx=b.vx/magnitude*speed;b.vy=b.vy/magnitude*speed;}
        b.x+=b.vx*dt;b.y+=b.vy*dt;
        if(Math.hypot(b.x-p.x,b.y-(p.y-6))<b.r+11&&s.invulnerable===0){
          b.y=H+100;shipHit();
        }
      });
    }
    if(s.mode==='resolving'&&!s.hydraBlast&&!expedition.busy){
      if(s.capsuleTimer>0){s.capsuleTimer-=dt;if(s.capsuleTimer<=0)launchCapsule();}
      if(s.capsule&&!s.listening){const c=s.capsule;c.age+=dt;c.y+=c.speed*dt;if(hitCircle(c,p,31))resolveCapsule(true);else if(c.y>H+30)resolveCapsule(false);}
      if(!s.listening)s.resolveTimer-=dt;if(s.resolveTimer<=0&&!s.capsule&&s.capsuleTimer<=0)advance();
    }
  }
  stepHydraDestruction(dt);
  if(!['active','resolving'].includes(s.mode)||expedition.safeNoteFlight||s.hydraBlast){s.shots=[];s.bullets=[];s.drones=[];}
  s.shots.forEach(b=>{b.y-=500*dt;b.x+=(b.vx||0)*dt;
    if(expedition.hitShot(b)){b.y=-30;return;}
    for(const d of s.drones){if(d.hp>0&&d.y>0&&hitCircle(b,d,22)){d.hp--;d.hit=.15;b.y=-30;if(d.hp<=0){s.droneKills++;s.score+=20;awardScrap(2);burst(d.x,d.y,'#f7cd7f',12);renderHud();}break;}}
    if(s.enemy&&s.mode==='active'&&!expedition.safeNoteFlight){
      const gun=s.enemy.guns?.find(port=>port.hp>0&&!port.destroyed&&Math.hypot(b.x-(s.enemy.x+port.x),b.y-(s.enemy.y+port.y+7))<15);
      if(gun){gun.hp--;s.enemy.hit=.12;b.y=-30;burst(s.enemy.x+gun.x,s.enemy.y+gun.y,'#ffca78',gun.hp<=0?22:4);if(gun.hp<=0){gun.destroyed=true;s.score+=75;awardScrap(5);feedback('ОГНЕВАЯ ТОЧКА ГИДРЫ УНИЧТОЖЕНА');renderHud();}return;}
      if(Math.abs(b.x-s.enemy.x)<machineSize(s.enemy.model)*.42&&b.y<s.enemy.y+50&&b.y>s.enemy.y-50){burst(b.x,b.y,'#f5bd72',2);b.y=-30;s.enemy.hit=.04;s.enemy.hull=Math.max(0,s.enemy.hull-1);if(s.enemy.hull===0)defeatHydra(false);}
    }
  });s.shots=s.shots.filter(b=>b.y>-20&&b.x>-10&&b.x<W+10);
  s.drones=s.drones.filter(d=>d.hp>0&&d.y<H+35);
  s.bullets=s.bullets.filter(b=>(!b.ttl||b.age<b.ttl)&&b.y<H+30&&b.x>-30&&b.x<W+30);
  s.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});s.particles=s.particles.filter(p=>p.life>0);
  s.debris.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.max(0,1-dt*1.4);p.vy*=Math.max(0,1-dt*1.4);p.angle+=p.spin*dt;p.life-=dt;});s.debris=s.debris.filter(p=>p.life>0);
  s.rings.forEach(r=>r.age+=dt);s.rings=s.rings.filter(r=>r.age<.8);
}
function drawHydraFoundation(size){
  // A tight contact shadow and four braced footings make the hull read as a
  // structure fixed to the surface, with no flight bob or exhaust particles.
  ctx.fillStyle='#020303aa';ctx.beginPath();ctx.ellipse(7,13,size*.57,size*.50,0,0,Math.PI*2);ctx.fill();
  const foundation=images['turret-base'];
  if(foundation?.complete&&foundation.naturalWidth){ctx.drawImage(foundation,-size*.62,-size*.6,size*1.24,size*1.2);return;}
  ctx.fillStyle='#272a25';ctx.strokeStyle='#756248';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(-size*.42,-size*.46);ctx.lineTo(size*.42,-size*.46);ctx.lineTo(size*.56,-size*.3);ctx.lineTo(size*.56,size*.3);ctx.lineTo(size*.42,size*.46);ctx.lineTo(-size*.42,size*.46);ctx.lineTo(-size*.56,size*.3);ctx.lineTo(-size*.56,-size*.3);ctx.closePath();ctx.fill();ctx.stroke();
  for(const side of [-1,1])for(const end of [-1,1]){
    const x=side*size*.48,y=end*size*.30;
    ctx.fillStyle='#100f0daa';ctx.fillRect(x-12,y-8,28,24);
    ctx.fillStyle='#766246';ctx.strokeStyle='#b39768';ctx.lineWidth=1.5;ctx.fillRect(x-13,y-12,24,18);ctx.strokeRect(x-13,y-12,24,18);
    ctx.fillStyle='#292622';for(const bx of [-7,5]){ctx.beginPath();ctx.arc(x+bx,y-4,2.5,0,Math.PI*2);ctx.fill();}
    ctx.strokeStyle='#b8a27a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-side*5,y);ctx.lineTo(x-side*size*.21,y-end*10);ctx.stroke();
  }
}
function drawHydraGun(port,e){
  const ruined=port.hp<=0||port.destroyed,base=images[ruined?'turret-ruin':'turret-base'],barrel=images['turret-barrel'];
  ctx.save();ctx.translate(port.x,port.y);
  if(base?.complete&&base.naturalWidth)ctx.drawImage(base,-21,-21,42,42);
  else{
    ctx.fillStyle=ruined?'#171210':'#68513a';ctx.strokeStyle=ruined?'#6e3425':'#d9b16f';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,ruined?13:12,0,Math.PI*2);ctx.fill();ctx.stroke();
    if(ruined){ctx.strokeStyle='#b66137';for(let i=0;i<5;i++){const a=i*2.3;ctx.beginPath();ctx.moveTo(Math.cos(a)*5,Math.sin(a)*5);ctx.lineTo(Math.cos(a)*16,Math.sin(a)*16);ctx.stroke();}}
    else{ctx.fillStyle='#211e18';for(let i=0;i<4;i++){const a=i*Math.PI/2+.7;ctx.beginPath();ctx.arc(Math.cos(a)*8,Math.sin(a)*8,2,0,Math.PI*2);ctx.fill();}}
  }
  if(!ruined){
    const aim=Math.atan2(s.player.y-(e.y+port.y),s.player.x-(e.x+port.x));
    ctx.rotate(aim+Math.PI/2);
    if(barrel?.complete&&barrel.naturalWidth)ctx.drawImage(barrel,-22,-36,44,58);
    else{ctx.fillStyle='#343f3d';ctx.strokeStyle='#c5a977';ctx.lineWidth=1.5;ctx.fillRect(-5,-26,10,27);ctx.strokeRect(-5,-26,10,27);ctx.fillStyle='#baa07d';ctx.fillRect(-7,-19,14,4);ctx.fillRect(-7,-9,14,4);ctx.fillStyle='#1b211f';ctx.fillRect(-4,-26,8,4);}
    if(e.muzzle>0){ctx.fillStyle='#fff2ad';ctx.shadowColor='#ffb654';ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(-4,-29);ctx.lineTo(0,-42);ctx.lineTo(5,-29);ctx.closePath();ctx.fill();ctx.shadowBlur=0;}
  }
  ctx.restore();
}
function drawSamsaraHydra(e,size){
  const time=clock*.32;
  ctx.save();
  ctx.fillStyle='#041b1c9c';ctx.beginPath();ctx.ellipse(3,10,size*.59,size*.51,0,0,Math.PI*2);ctx.fill();
  for(let layer=0;layer<2;layer++)for(let i=0;i<12;i++){
    const a=i*Math.PI/6+time*(layer?.36:-.22),r=size*(layer?.37:.25);
    ctx.save();ctx.rotate(a);ctx.translate(0,-r);
    const petal=ctx.createLinearGradient(0,-size*.25,0,size*.15);
    petal.addColorStop(0,layer?'#d8bd8d':'#a7d2b1');petal.addColorStop(.42,layer?'#467f78':'#24635f');petal.addColorStop(1,'#0b3738');
    ctx.fillStyle=petal;ctx.strokeStyle=layer?'#e2cba59c':'#9fcdb694';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,-size*.30);ctx.bezierCurveTo(size*.20,-size*.14,size*.15,size*.09,0,size*.19);ctx.bezierCurveTo(-size*.15,size*.09,-size*.20,-size*.14,0,-size*.30);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#e2d5af6b';ctx.beginPath();ctx.moveTo(0,-size*.23);ctx.lineTo(0,size*.13);ctx.stroke();ctx.restore();
  }
  const core=images['samsara-art-overdrive'];
  if(core?.complete&&core.naturalWidth){const k=size*.75/Math.max(core.naturalWidth,core.naturalHeight);ctx.shadowColor='#cbe9be';ctx.shadowBlur=17;ctx.drawImage(core,-core.naturalWidth*k/2,-core.naturalHeight*k/2,core.naturalWidth*k,core.naturalHeight*k);ctx.shadowBlur=0;}
  for(const port of e.guns||enemyGuns(e.model??0)){
    const ruined=port.hp<=0||port.destroyed;
    ctx.save();ctx.translate(port.x,port.y);
    for(let i=0;i<5;i++){ctx.save();ctx.rotate(i*Math.PI*2/5+time*.7);ctx.fillStyle=ruined?'#536e684e':'#9bceaf';ctx.beginPath();ctx.ellipse(0,-9,4,11,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    ctx.fillStyle=ruined?'#263e3d':'#f5d6a3';ctx.shadowColor=ruined?'transparent':'#a9f2cb';ctx.shadowBlur=ruined?0:8;ctx.beginPath();ctx.arc(0,0,ruined?4:5.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    if(e.muzzle>0&&!ruined){ctx.strokeStyle='#fff4c7';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,12+e.muzzle*45,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  }
  ctx.restore();
}
function draw(){
  ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
  ctx.clearRect(0,0,W,H);ctx.save();
  if(s.shake>0&&!reduced){const amount=Math.min(4,s.shake*12);ctx.translate(Math.sin(clock*93)*amount,Math.cos(clock*77)*amount*.65);}
  const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#111328');bg.addColorStop(.6,'#090f21');bg.addColorStop(1,'#102b34');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const terrain=images[expedition.planet];
  if(s.planetChoice==='samsara'&&samsaraGround){
    samsaraGround.render({width:W,height:H,ship:1,x:s.player.x,y:s.player.y,angle:0,worldSize:840,scroll:s.travel/840,pan:Math.sin(clock*.035)*.025,time:clock,growth:clock/55,night:.23+.34*(.5+.5*Math.sin(clock/47)),lantern:false});
    ctx.drawImage(samsaraCanvas,0,0,W,H);ctx.fillStyle='#061a1b55';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#06181731';ctx.fillRect(0,0,W,H);
  }else if(s.planetChoice==='samsara'){
    const paint=images['samsara-tex-blue-gardens'];if(paint.complete&&paint.naturalWidth)ctx.drawImage(paint,0,0,W,H);ctx.fillStyle='#061a1b55';ctx.fillRect(0,0,W,H);
  }else if(terrain.complete&&terrain.naturalWidth){const tileHeight=W*terrain.naturalHeight/terrain.naturalWidth,offset=s.travel%tileHeight;ctx.globalAlpha=.72;for(let y=offset-tileHeight;y<H;y+=tileHeight)ctx.drawImage(terrain,0,y,W,tileHeight);ctx.globalAlpha=1;ctx.fillStyle='#08102128';ctx.fillRect(0,0,W,H);}
  const nebula=ctx.createRadialGradient(W*.15,H*.38,0,W*.15,H*.38,270);nebula.addColorStop(0,'#5e357920');nebula.addColorStop(1,'#24123200');ctx.fillStyle=nebula;ctx.fillRect(0,0,W,H);
  for(const star of stars){const y=(star.y+s.travel*(reduced?.05:.3)*star.z)%(H+20);ctx.globalAlpha=(s.planetChoice==='samsara'?.13:.28)+star.z*.45;ctx.fillStyle=s.planetChoice==='samsara'?(star.z>.85?'#e5d8a4':'#79c8bb'):(star.z>.85?'#aacbdb':'#687694');ctx.fillRect(star.x,y,star.r,star.r*(star.z>.9?2:1));}ctx.globalAlpha=1;
  if(s.planetChoice!=='samsara'){
    ctx.strokeStyle='#7695bd0d';ctx.lineWidth=1;for(let x=0;x<=W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=s.travel%70;y<H;y+=70){ctx.fillStyle='#a6c5d52b';ctx.fillRect(12,y,4,1);ctx.fillRect(W-16,y,4,1);}
  }
  const activeEnemy=s.enemy&&s.mode!=='resolving'&&!expedition.safeNoteFlight&&!s.enemy.suspended;
  if(activeEnemy||s.hydraBlast||s.mode==='start'){
    const e=s.hydraBlast?.enemy||(activeEnemy?s.enemy:{x:W/2,y:H*.37,age:clock,shields:{bass:false,quality:false},hit:0});
    const model=e.model??0,size=machineSize(model),radius=size*.57;
    const halo=ctx.createRadialGradient(e.x,e.y,15,e.x,e.y,radius*1.3);halo.addColorStop(0,'#b44e892b');halo.addColorStop(1,'#b44e8900');ctx.fillStyle=halo;ctx.fillRect(e.x-radius*1.3,e.y-radius*1.3,radius*2.6,radius*2.6);
    ctx.save();ctx.translate(e.x,e.y);
    if(s.hydraBlast)ctx.globalAlpha=Math.max(0,1-s.hydraBlast.age/.85);
    if(s.planetChoice==='samsara')drawSamsaraHydra(e,size);
    else{
      drawHydraFoundation(size);
      const machine=model===1?images.corvette:model===3?images.fortress:images.enemyships;
      if(machine.complete&&machine.naturalWidth){const [sx,sy,sw,sh]=model===1||model===3?[0,0,machine.naturalWidth,machine.naturalHeight]:MACHINE_CROPS[model],scale=size/Math.max(sw,sh);ctx.save();ctx.rotate(Math.PI);ctx.drawImage(machine,sx,sy,sw,sh,-sw*scale/2,-sh*scale/2,sw*scale,sh*scale);ctx.restore();}
      for(const port of e.guns||enemyGuns(model))drawHydraGun(port,e);
    }
    if(e.maxHull&&!s.hydraBlast){ctx.fillStyle='#10191dee';ctx.fillRect(-55,size*.6,110,7);ctx.fillStyle=e.hull/e.maxHull<.3?'#ff8866':'#ecc781';ctx.fillRect(-54,size*.6+1,108*e.hull/e.maxHull,5);}
    for(const [i,kind] of ['bass','quality'].entries()){
      if(e.shields[kind]||(kind==='quality'&&s.sector<2&&s.mode!=='start'))continue;
      ctx.save();ctx.rotate(clock*(i?-.3:.23));ctx.strokeStyle=i?'#ff7ea780':'#79f5d0a0';ctx.lineWidth=2;ctx.setLineDash([26,7]);ctx.beginPath();ctx.arc(0,0,radius+i*10,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(e.hit>0){ctx.fillStyle='#ffffff30';ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();}ctx.restore();
  }
  ctx.shadowColor='#79f5d0';ctx.shadowBlur=reduced?0:9;ctx.fillStyle='#a2ffe0';for(const b of s.shots)ctx.fillRect(b.x-1.5,b.y,3,12);ctx.shadowBlur=0;
  for(const d of s.drones){if(d.y<0)continue;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(Math.sin(d.age+d.phase)*.2);if(images.drone.complete&&images.drone.naturalWidth)ctx.drawImage(images.drone,-20,-20,40,40);if(d.hit>0){ctx.fillStyle='#fff8';ctx.fillRect(-13,-9,26,18);}ctx.restore();}
  if(s.planetChoice==='samsara'){drawSamsaraPickups();drawSamsaraForces();}
  for(const b of s.bullets){const color=s.planetChoice==='samsara'&&b.forceType!==undefined?SAMSARA_FORCES[b.forceType].color:'#ffbdc8';ctx.save();ctx.translate(b.x,b.y);
    if(s.planetChoice==='samsara'&&b.forceType===0){ctx.rotate(Math.atan2(b.vy,b.vx));ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-13,0);ctx.lineTo(7,0);ctx.stroke();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(2,-4);ctx.lineTo(2,4);ctx.closePath();ctx.fill();}
    else if(s.planetChoice==='samsara'&&b.forceType===1){ctx.rotate(Math.atan2(b.vy,b.vx));ctx.strokeStyle='#eadab3';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-15,0);ctx.lineTo(12,0);ctx.stroke();ctx.fillStyle='#d9c99d';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(6,-5);ctx.lineTo(6,5);ctx.closePath();ctx.fill();}
    else if(s.planetChoice==='samsara'&&b.forceType===2){ctx.rotate(Math.atan2(b.vy,b.vx));ctx.fillStyle='#ff9a534a';ctx.beginPath();ctx.ellipse(-8,0,17,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffdd90';ctx.beginPath();ctx.ellipse(2,0,8,4,0,0,Math.PI*2);ctx.fill();}
    else if(s.planetChoice==='samsara'&&b.forceType===3){ctx.rotate((b.age||0)*2);ctx.fillStyle='#be9bff45';ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1.5;for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.ellipse(0,6,2.5,6,0,0,Math.PI*2);ctx.stroke();}ctx.fillStyle='#f1dcff';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();}
    else{ctx.fillStyle=color+'2b';ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();}ctx.restore();}
  expedition.draw();
  const p=s.player;
  if(s.planetChoice==='samsara'){
    ctx.save();if(s.invulnerable>0||expedition.cloaked)ctx.globalAlpha=.48+Math.sin(clock*30)*.25;
    if(samsaraShipCanvas&&samsaraGround)ctx.drawImage(samsaraShipCanvas,0,0,W,H);
    else if(images['samsara-lotus']?.naturalWidth)ctx.drawImage(images['samsara-lotus'],p.x-47,p.y-61,94,122);
    ctx.restore();
  }else{ctx.save();ctx.translate(p.x,p.y);if(s.invulnerable>0||expedition.cloaked)ctx.globalAlpha=.45+Math.sin(clock*30)*.3;
    if(expedition.invincible){ctx.strokeStyle='#ffe69a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,36,0,Math.PI*2);ctx.stroke();}
    ctx.strokeStyle='#79f5d029';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,35,0,Math.PI*2);ctx.stroke();
    ctx.save();ctx.translate(18,25);ctx.scale(.86,.7);ctx.globalAlpha=.45;drawShipShadow(shipBuild().frame.frame);ctx.restore();
    drawPlayerFrame(shipBuild().frame.frame);
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,-6,2,0,Math.PI*2);ctx.fill();ctx.restore();}
  if(s.beam>0&&s.enemy&&!expedition.safeNoteFlight){ctx.save();ctx.strokeStyle='#bdffe7';ctx.globalAlpha=s.beam/.3;if(s.planetChoice==='samsara'){ctx.lineWidth=2+s.beam*10;ctx.beginPath();ctx.arc(s.enemy.x,s.enemy.y,32+(1-s.beam/.3)*62,0,Math.PI*2);ctx.stroke();}else{ctx.lineWidth=4+s.beam*20;ctx.beginPath();ctx.moveTo(p.x,p.y-26);ctx.lineTo(s.enemy.x,s.enemy.y+30);ctx.stroke();}ctx.restore();}
  for(const r of s.rings){ctx.strokeStyle=r.explosion?`rgba(255,191,102,${1-r.age/.8})`:`rgba(121,245,208,${1-r.age/.8})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,r.age*260,0,Math.PI*2);ctx.stroke();}
  if(s.capsule){const c=s.capsule;ctx.save();ctx.translate(c.x,c.y);ctx.shadowColor='#79f5d0';ctx.shadowBlur=18;ctx.strokeStyle='#a5ffe6';ctx.fillStyle='#153c4c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-27);ctx.lineTo(26,-14);ctx.lineTo(26,14);ctx.lineTo(0,27);ctx.lineTo(-26,14);ctx.lineTo(-26,-14);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#e5fff5';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 24px system-ui';ctx.fillText(INTERVAL_TARGETS[c.wanted].glyph,0,0);ctx.strokeStyle='#79f5d070';ctx.beginPath();ctx.arc(0,0,34+Math.sin(clock*5)*3,0,Math.PI*2);ctx.stroke();ctx.restore();}
  for(const particle of s.particles){ctx.globalAlpha=Math.min(1,particle.life*2);ctx.fillStyle=particle.color;ctx.fillRect(particle.x,particle.y,3,3);}ctx.globalAlpha=1;
  for(const part of s.debris){ctx.save();ctx.translate(part.x,part.y);ctx.rotate(part.angle);ctx.globalAlpha=Math.min(1,part.life);ctx.fillStyle='#b77b43';ctx.strokeStyle='#38281f';ctx.lineWidth=1;ctx.fillRect(-part.size,-part.size*.45,part.size*2,part.size);ctx.strokeRect(-part.size,-part.size*.45,part.size*2,part.size);ctx.restore();}
  if(expedition.showScene)expedition.drawPauseOverlay();
  if(s.flash>0&&!reduced){ctx.fillStyle=`rgba(255,93,134,${s.flash*.3})`;ctx.fillRect(0,0,W,H);}
  ctx.restore();
}
const shipShadowCanvas=document.createElement('canvas');shipShadowCanvas.width=100;shipShadowCanvas.height=100;
function drawShipShadow(frame){
  const shadow=shipShadowCanvas.getContext('2d');shadow.clearRect(0,0,100,100);
  const source=frame===1?images.enemyships:frame===2?images.corvette:images.fortress;
  if(!source.complete||!source.naturalWidth)return;
  const crop=frame===1?MACHINE_CROPS[0]:[0,0,source.naturalWidth,source.naturalHeight];
  shadow.drawImage(source,...crop,10,10,80,80);shadow.globalCompositeOperation='source-in';shadow.fillStyle='#000';shadow.fillRect(0,0,100,100);shadow.globalCompositeOperation='source-over';ctx.drawImage(shipShadowCanvas,-40,-40,80,80);
}
function drawPlayerFrame(frame){
  if(frame===0){if(images.ship.complete&&images.ship.naturalWidth)ctx.drawImage(images.ship,-34,-34,68,68);return;}
  const source=frame===1?images.enemyships:frame===2?images.corvette:images.fortress;
  if(!source.complete||!source.naturalWidth)return;
  const crop=frame===1?MACHINE_CROPS[0]:[0,0,source.naturalWidth,source.naturalHeight],sw=crop[2],sh=crop[3],size=frame===3?86:72,scale=size/Math.max(sw,sh);
  ctx.save();ctx.rotate(Math.PI);ctx.drawImage(source,crop[0],crop[1],sw,sh,-sw*scale/2,-sh*scale/2,sw*scale,sh*scale);ctx.restore();
  ctx.strokeStyle='#8daaa5';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,size*.45,0,Math.PI*2);ctx.stroke();
}
function frame(now){const dt=Math.min(.035,(now-last)/1000||.016);last=now;update(dt);draw();requestAnimationFrame(frame);}
function movePointer(event){const rect=canvas.getBoundingClientRect();s.player.tx=(event.clientX-rect.left)*W/rect.width;s.player.ty=(event.clientY-rect.top)*H/rect.height-28;}
canvas.addEventListener('pointerdown',e=>{if(!['active','resolving'].includes(s.mode))return;if(expedition.activateArtifact())return;s.pointer=e.pointerId;canvas.setPointerCapture(e.pointerId);movePointer(e);});
canvas.addEventListener('pointermove',e=>{if(e.pointerId===s.pointer)movePointer(e);});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>s.pointer=null);
document.addEventListener('keydown',e=>{
  if(s.mode==='debrief'){if(e.key===' '){e.preventDefault();if(!e.repeat)debrief.play();}if(e.key==='Escape'){e.preventDefault();menuBack();}return;}
  if(s.mode==='trainer'){if(e.key===' '){e.preventDefault();if(!e.repeat)playTrainerRound();}if(e.key==='Escape'){e.preventDefault();closeTrainer();}return;}
  if(s.mode==='study'){if(e.key===' '){e.preventDefault();if(!e.repeat)playStudy();}if(e.key==='Escape'){e.preventDefault();closeStudy();}return;}
  if(e.key==='Escape'){e.preventDefault();s.mode==='paused'?resume():pause();return;}
  if(!['active','resolving'].includes(s.mode))return;
  if(e.key===' '){e.preventDefault();if(!e.repeat&&!$('replay').disabled)$('replay').click();return;}
  if(e.target instanceof HTMLButtonElement&&e.key==='Enter')return;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();
  if(e.repeat)return;
  const key=e.key.toLowerCase();s.keys.add(key);
  if(/^[1-4]$/.test(key))$('bass-pads').children[Number(key)-1]?.click();
  // W is movement only before chord mode; use arrows in the two-shield sector.
  if(s.sector>=2&&['q','w','e','r'].includes(key)){s.keys.delete(key);}
});
document.addEventListener('keyup',e=>s.keys.delete(e.key.toLowerCase()));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('blur',()=>{s.keys.clear();pause();});
window.addEventListener('pagehide',()=>{audio.stop();activeRecognition?.abort();});
['bank-basic','bank-altered'].forEach((id,i)=>$(id).addEventListener('click',()=>{qualityBank=i;buildPads();}));
['weapon-root','weapon-type'].forEach((id,i)=>$(id).addEventListener('click',()=>{weaponTab=i?'quality':'bass';syncPads();}));
$('hint').addEventListener('click',()=>expedition.hint());
$('home').addEventListener('click',()=>{++runToken;audio.stop();s.listening=false;s.keys.clear();s.pointer=null;expedition.reset(0);startScreen();});
$('pause').addEventListener('click',()=>s.mode==='paused'?resume():pause());
$('replay').addEventListener('click',()=>{s.replays++;expedition.busy?expedition.replay():s.capsule?playCapsule():playCue(!!s.bookMission);});
$('interval-reference').addEventListener('click',()=>playCapsule(true));
$('help').addEventListener('click',()=>{if(s.mode==='start'){feedback('Включи звук и нажми «Вылететь»');}else pause(true);});
// Read-only diagnostics for regression checks; deliberately no answer/skip hook.
window.earGame=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({mode:s.mode,runLevel:s.runLevel,sector:s.sector,score:s.score,health:s.health,power:s.power,combo:s.combo,cleared:s.cleared,listening:s.listening,enemy:s.enemy,noteFlight:expedition.snapshot().special?.kind==='flightTones'?{required:expedition.snapshot().special.required,collected:expedition.snapshot().special.collected,cubes:expedition.snapshot().digits,result:expedition.snapshot().special.result}:null,ground:{travel:s.travel,delta:s.groundScrollDelta,combat:s.groundCombat,exploding:!!s.hydraBlast,safeNoteFlight:!!expedition.safeNoteFlight},planet:{choice:s.planetChoice},samsara:{vitals:s.samsaraVitals,inventory:s.samsaraInventory,forces:s.samsaraForces,playerShots:s.shots.length},player:s.player,bullets:s.bullets,stats:s.stats,route:s.route,capsule:s.capsule,intervalStats:s.intervalStats,audio:{state:audio.context?.state,lastCue:audio.lastCue}}))});
startScreen();installLanguage();requestAnimationFrame(frame);
