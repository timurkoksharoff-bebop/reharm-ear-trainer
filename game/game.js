import {DEGREES,QUALITIES,INTERVALS,SECTORS,createRoute,createBookRoute,bookRoutesForChapter,answerResult,family,QUALITY_BANKS,chordSymbol} from './music.mjs';
import {FlightAudio} from './audio.mjs';
import {loadFlightImage} from './assets-loader.mjs';
import {installLanguage} from './i18n.mjs';
import {pressure,formation,stepDrone,hitCircle} from './combat.mjs';
import {INTERVAL_TARGETS,INTERVAL_MODES,targetForSector,createCapsule,capsuleOutcome} from './intervals.mjs';
import {PILOTS,ARTIFACTS,NUMBER_LABELS,NUMBER_OFFSETS,RHYTHMS,RHYTHM_HINTS,RHYTHM_LEVELS,POLYRHYTHMS,createExpedition} from './expedition.mjs';

const $=id=>document.getElementById(id);
const canvas=$('space'),ctx=canvas.getContext('2d'),audio=new FlightAudio();
const images=Object.fromEntries(['hydra','enemyships','corvette','fortress','drummachine','trumpeter','keytarist','guitarist','drummer','keytarExact','guitarExact','band','ship','terrain','drone','moon','mars','teachers','artifacts'].map(name=>[name,new Image()]));
const imageUrl=name=>['keytarExact','guitarExact'].includes(name)?`assets/${name==='keytarExact'?'keytar-exact':'guitar-exact'}.svg`:`assets/${name}.webp`;
async function prepareFlightImages(onProgress=()=>{}){
  let ready=0;const entries=Object.entries(images);
  const results=await Promise.allSettled(entries.map(async([name,img])=>{await loadFlightImage(img,imageUrl(name));onProgress(++ready,entries.length);}));
  const failure=results.find(result=>result.status==='rejected');if(failure)throw failure.reason;
}
// Warm the cache; startRun checks completion and offers a retry on failures.
prepareFlightImages().catch(()=>{});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
let W=480,H=590,last=0,clock=0,previousMode='active',lessonIndex=0,lessonItems=[],runToken=0,qualityBank=0,weaponTab='bass';
const s={mode:'start',sector:0,route:null,routeNumber:0,position:0,cleared:0,totalCleared:0,score:0,combo:0,health:5,power:1,
  listening:false,enemy:null,bullets:[],shots:[],particles:[],beam:0,flash:0,shotTimer:0,invulnerable:0,
  fireTimer:0,resolveTimer:0,attempts:0,correct:0,firstTry:0,replays:0,stats:{bass:{hit:0,miss:0},quality:{hit:0,miss:0}},
  drones:[],waveTimer:0,waveIndex:0,overdrive:0,energy:0,rings:[],travel:0,droneKills:0,
  capsule:null,capsuleTimer:0,intervalStats:{caught:0,wrong:0,missed:0,avoided:0},
  bookMission:null,player:{x:240,y:500,tx:240,ty:500},keys:new Set(),pointer:null,feedbackTimer:0};
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
const expedition=createExpedition({s,audio,feedback,signal,burst,renderHud,syncPads,shipHit,listenTitle,W,getH:()=>H,images,ctx,document,playCue,degree:n=>DEGREES[n].glyph});
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
  hull:{name:'БРОНЯ И РЕЗОНАТОР',cost:[70,150,270],description:'+1 сегмент щита за уровень'},
  engine:{name:'ДВИГАТЕЛЬ И СОПЛА',cost:[55,125,230],description:'скорость и манёвр'},
  cannon:{name:'ЗВУКОВОЕ ОРУДИЕ',cost:[65,145,260],description:'скорострельность и дополнительные импульсы'},
  reactor:{name:'РЕАКТОР И ТВИТЕРЫ',cost:[60,135,245],description:'быстрее набирает энергию'},
};
let study={kind:'chord',quality:'maj',interval:'♭3',rhythm:0,poly:0,layer:'both',root:48,mode:'together',loop:false,back:'start'};
let trainer={kind:'degree',level:2,target:null,direction:'up',total:0,correct:0,locked:false,revealed:false,back:'start'};
function machineSize(model){return Math.min(100,H*.20)*(1.35+model*.23);}
function machinePorts(model){const size=machineSize(model);return Array.from({length:2+model*2},(_,i)=>({x:(i%2?1:-1)*size*.37,y:size*(.22-Math.floor(i/2)*.16)}));}
function resize(){const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const oldH=H;H=rect.height*480/rect.width;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);if(['start','briefing'].includes(s.mode))s.player.y=s.player.ty=H-65;else{s.player.y*=H/oldH;s.player.ty*=H/oldH;}}
new ResizeObserver(resize).observe(canvas);
function save(){try{const old=JSON.parse(localStorage.getItem('ear-reharm-game.v1')||'{}');localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...old,best:Math.max(old.best||0,s.score),unlocked:Math.max(old.unlocked||0,s.sector),lastStats:s.stats,intervalStats:s.intervalStats}));}catch{}}
function record(){try{return JSON.parse(localStorage.getItem('ear-reharm-game.v1')||'{}');}catch{return {};}}
function hangar(){const saved=record().hangar||{};return {scrap:saved.scrap||0,total:saved.total||0,upgrades:{hull:saved.upgrades?.hull||0,engine:saved.upgrades?.engine||0,cannon:saved.upgrades?.cannon||0,reactor:saved.upgrades?.reactor||0},ship:saved.ship||0,pilot:saved.pilot||0};}
function saveHangar(next){try{const old=record();localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...old,hangar:next}));}catch{}}
function shipBuild(){const h=hangar(),frame=HANGAR_SHIPS[h.ship];return {h,frame,maxHealth:Math.min(5,2+h.upgrades.hull+(frame.frame>=2?1:0)),speed:180+h.upgrades.engine*28+frame.frame*8,shotDelay:Math.max(.09,.28-h.upgrades.cannon*.055-frame.frame*.012),shots:1+Math.floor(h.upgrades.cannon/2),energyGain:1+h.upgrades.reactor*.25};}
function awardScrap(amount){const h=hangar();h.scrap+=amount;h.total+=amount;saveHangar(h);}
function overlay(html){$('overlay').innerHTML=`<div class="overlay-card">${html}</div>`;$('overlay').scrollTop=0;$('overlay').hidden=false;}
function hideOverlay(){$('overlay').hidden=true;}
function action(label,fn,secondary=false){const b=document.createElement('button');b.className=secondary?'secondary':'primary';b.textContent=label;$('overlay').firstElementChild.append(b);b.addEventListener('click',fn);return b;}
function signal(text,listening=false){$('signal-text').textContent=text;$('signal').classList.toggle('listening',listening);}
function feedback(text,error=false){$('feedback').textContent=text;$('feedback').className=`feedback visible${error?' error':''}`;s.feedbackTimer=2.0;}
function renderHud(){
  const max=s.maxHealth||5,health=clamp(s.health,0,max);s.health=health;$('score').textContent=String(s.score).padStart(6,'0');$('health').textContent='▰'.repeat(health)+'▱'.repeat(max-health);$('health').setAttribute('aria-label',`Щит: ${health} из ${max}`);
  $('sector-name').textContent=s.bookMission?`${s.route?.code||'BOOK FLIGHT'} · ${s.position+1}/${s.route?.sequence.length||0}`:`СЕКТОР 0${s.sector+1} · ${SECTORS[s.sector].name.toUpperCase()}`;
  $('weapon').textContent=s.overdrive>0?'РАЗГОН · ВЕЕРНЫЙ ОГОНЬ':`ИМПУЛЬС ×${s.power}`;$('combo').textContent=`КОМБО ${s.combo} · ⚡ ${s.energy}% · ◉ ${hangar().scrap}`;
  $('route-track').innerHTML=Array.from({length:s.route?.sequence.length||SECTORS[s.sector].count},(_,i)=>`<i class="${i<s.cleared?'done':i===s.cleared?'current':''}"></i>`).join('');
  document.querySelector('.cabinet')?.classList.toggle('charged',s.overdrive>0||expedition.boosted);
  document.querySelector('.cabinet')?.classList.toggle('danger',s.health<=2);
}
function buildPads(){
  const config=SECTORS[s.sector];
  $('bass-pads').classList.toggle('chromatic-pads',s.sector===3);
  $('quality-pads').classList.toggle('arsenal-pads',s.sector===3);
  $('quality-tabs').hidden=s.sector!==3;
  ['bank-basic','bank-altered'].forEach((id,i)=>{$(id).setAttribute('aria-pressed',String(i===qualityBank));});
  $('quality-panel').hidden=!config.qualities.length;
  for(const [kind,ids,container,data] of [['bass',config.degrees,$('bass-pads'),DEGREES],['quality',s.sector===3?QUALITY_BANKS[qualityBank]:config.qualities,$('quality-pads'),QUALITIES]]){
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
  const special=expedition.busy;
  document.querySelector('.cabinet')?.classList.toggle('rhythm-room',expedition.pausedCombat);
  $('enemy-label').hidden=expedition.pausedCombat||!s.enemy||s.mode==='resolving';
  $('capsule-panel').hidden=!capsuleMode||special;$('bass-pads').hidden=capsuleMode||special||(s.sector>=2&&weaponTab!=='bass');$('quality-panel').hidden=capsuleMode||special||s.sector<2||weaponTab!=='quality';
  $('weapon-tabs').hidden=capsuleMode||special||s.sector<2;
  $('weapon-root').setAttribute('aria-pressed',String(weaponTab==='bass'));$('weapon-type').setAttribute('aria-pressed',String(weaponTab==='quality'));
  document.querySelectorAll('.pad').forEach(b=>{
    const broken=s.enemy?.shields[b.dataset.kind];b.disabled=s.mode!=='active'||s.listening||!!broken||special;
    b.classList.toggle('selected',!!broken&&(b.dataset.kind==='bass'?Number(b.dataset.value)===s.enemy.chord.offset:b.dataset.value===family(s.enemy.chord.quality)));
  });
  $('replay').disabled=!(s.mode==='active'||(s.mode==='resolving'&&(s.capsule||special)))||s.listening;
  $('replay').setAttribute('aria-label',s.bookMission?'Повторить одну ноту HOME и текущий аккорд':'Повторить тонику и сигнал');
  $('replay').setAttribute('title',s.bookMission?'HOME одной нотой → текущий вертикальный аккорд · Space':'Повторить звучание · Space');
  if(expedition.pausedCombat){const labels={rhythm:['РИТМ-ПАУЗА · БАРАБАНЩИК НА ПОЛЕ','Узнай стиль или партию — и продолжим тот же полёт'],melody:['МЕЛОДИЧЕСКАЯ ПАУЗА · KEY PILOT','Выбери название или произнеси его по-английски'],mode:['ЛАДОВАЯ ПАУЗА · GUITAR PILOT','Узнай лад по восходящей или нисходящей гамме']},copy=labels[expedition.pauseKind]||labels.rhythm;$('dock-label').textContent=copy[0];$('dock-tip').textContent=copy[1];}
  $('interval-reference').disabled=s.mode!=='resolving'||s.listening;
  $('pause').disabled=['start','finished','gameover','loading'].includes(s.mode);
  if(s.enemy){$('shield-tags').innerHTML=`<span class="shield-tag ${s.enemy.shields.bass?'broken':''}">◇ БАС</span>${s.sector>=2?`<span class="shield-tag quality ${s.enemy.shields.quality?'broken':''}">✧ ТИП</span>`:''}`;}
}
function startScreen(){
  s.mode='start';
  renderHud();buildPads();
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
function openBookFlight(chapter=1){
  s.mode='start';const routes=bookRoutesForChapter(chapter);
  overlay(`<span class="eyebrow">BOOK FLIGHT · TEST NAVIGATOR</span><h2>Chapter ${String(chapter).padStart(2,'0')}</h2><p class="compact">Выбери главу и конкретный маршрут. Служебный код показывает главу и пример; название источника в игре не выводится.</p><div id="chapter-grid" class="chapter-grid"></div><div class="mission-list" id="mission-list"></div>`);
  for(let value=1;value<=16;value++){const b=document.createElement('button');b.textContent=String(value).padStart(2,'0');b.className=value===chapter?'selected':'';b.addEventListener('click',()=>openBookFlight(value));$('chapter-grid').append(b);}
  routes.forEach((route,index)=>{const preview=createBookRoute(chapter,index,-1,()=>.2),b=document.createElement('button');b.innerHTML=`<b>${preview.code}</b><span>${route.sequence.length} HYDRAS · ROUTE ${index+1}/${routes.length}</span>`;b.addEventListener('click',()=>startBookRun(chapter,index));$('mission-list').append(b);});
  action('Вернуться',startScreen,true);
}
function startBookRun(chapter,index){return startRun(3,Math.min(3,Math.floor((chapter-1)/5)),{chapter,index});}
async function launchEncounter(type){
  await startRun(2,1);if(s.mode!=='briefing')return;
  spawnEnemy();audio.stop();s.listening=false;expedition.artifact(type);
}
function openCrewGallery(){
  overlay(`<span class="eyebrow">BUILD 058 · ЭКИПАЖ УЖЕ В ИГРЕ</span><h2>Музыканты дальнего космоса</h2><p class="compact">В полёте их вызывают светящиеся реликвии. Здесь персонажи открыты сразу, чтобы можно было проверить новую графику без ожидания случайного события.</p><div class="crew-gallery">
    <article><img src="assets/trumpeter.webp" alt="Стимпанковский трубач"><b>ТРУБАЧ</b><span>Basic, guide и color tones</span></article>
    <article><img src="assets/keytarist.webp" alt="Клавишник с кейтаром"><b>КЛАВИШНИК</b><span>Узнавание джазовых мелодий</span></article>
    <article><img src="assets/guitarist.webp" alt="Космический гитарист"><b>ГИТАРИСТ</b><span>Лады, гаммы и modal drive</span></article>
    <article><img src="assets/drummer.webp" alt="Стимпанковский барабанщик"><b>БАРАБАНЩИК</b><span>Ритмы, стили и рисунки</span></article>
  </div>`);
  for(const [label,type] of [['Гитарист · запустить',0],['Клавишник · запустить',1],['Барабанщик · запустить',10],['Трубач · запустить',7]])action(label,()=>launchEncounter(type));
  action('Вернуться на базу',startScreen,true);
}
function openHangar(){
  const h=hangar(),build=shipBuild(),ship=HANGAR_SHIPS[h.ship],pilot=HANGAR_PILOTS[h.pilot];
  overlay(`<span class="eyebrow">ORBITAL GARAGE · ЖИВАЯ ВАЛЮТА</span><h2>Ангар «Грязный сигнал»</h2><p class="hangar-balance">◉ ${h.scrap} деталей <small>за весь путь добыто ${h.total}</small></p><div class="hangar-hero"><img src="assets/${ship.asset}.webp" alt="${ship.name}"><div><b>${ship.name}</b><span>${ship.description}</span><small>Пилот: ${pilot.name}</small></div></div><p class="compact">Текущая машина: щит ${build.maxHealth}/5 · скорость ${build.speed} · импульс ${Math.round(1/build.shotDelay)}/c.</p><div class="hangar-grid" id="hangar-upgrades"></div><h3>КОРПУСА</h3><div class="hangar-grid" id="hangar-ships"></div><h3>ПИЛОТЫ</h3><div class="hangar-grid" id="hangar-pilots"></div>`);
  const add=(container,content,handler,disabled=false)=>{const b=document.createElement('button');b.className='hangar-card';b.disabled=disabled;b.innerHTML=content;b.addEventListener('click',handler);$(container).append(b);};
  for(const [key,info] of Object.entries(UPGRADE_INFO)){const level=h.upgrades[key],cost=info.cost[level],max=level>=info.cost.length;add('hangar-upgrades',`<b>${info.name}</b><span>${info.description}</span><small>${max?'МАКСИМУМ':`УРОВЕНЬ ${level+1} · ◉ ${cost}`}</small>`,()=>buyUpgrade(key),max||h.scrap<cost);}
  HANGAR_SHIPS.forEach((item,index)=>{const owned=index===0||h.total>=item.price;const selected=index===h.ship;add('hangar-ships',`<img src="assets/${item.asset}.webp" alt=""><b>${item.name}</b><span>${item.description}</span><small>${selected?'ВЫБРАН':owned?'ВЫБРАТЬ':`ОТКРЫТЬ · ◉ ${item.price}`}</small>`,()=>selectShip(index),selected);});
  HANGAR_PILOTS.forEach((item,index)=>{const owned=h.total>=item.unlock,selected=index===h.pilot;add('hangar-pilots',`<b>${item.name}</b><span>${item.description}</span><small>${selected?'В КАБИНЕ':owned?'ВЫБРАТЬ':`НУЖНО ◉ ${item.unlock}`}</small>`,()=>selectPilot(index),selected||!owned);});
  action('Создать музыканта · народ и экипировка',openPilotCreator,true);
  action('Вылететь',()=>startScreen());
}
function openPilotCreator(){
  const profile=record().musician||{nation:'Dorian',body:'Мужская',instrument:'Гитара',outfit:'Рабочий комбинезон',accessory:'Сварочные очки'};
  const nations={'Ionian':'Открытые и энергичные. Светлая краска поверх потёртой брони.','Dorian':'Спокойные импровизаторы. Зелёная патина и рабочая кожа.','Phrygian':'Страстные и резкие. Красная ткань, тёмный металл.','Lydian':'Любопытные исследователи. Световые линзы и высотное снаряжение.','Mixolydian':'Общительные бунтари. Нашивки концертных команд.','Aeolian':'Сдержанные странники. Выцветшие ткани, тяжёлые куртки.','Locrian':'Изобретатели с окраин. Асимметричные протезы и ремонтные заплаты.'};
  overlay('<span class="eyebrow">ЭКИПАЖ · ПЕРВАЯ ЛИНИЯ</span><h2>Твой музыкант</h2><p class="compact">Семь народов дальнего космоса. Выбор сохраняется на этом устройстве. Портреты новых народов пока в разработке.</p><div id="pilot-fields"></div>');
  const fields=[['nation','Народ',Object.keys(nations)],['body','Взрослая модель',['Мужская','Женская']],['instrument','Инструмент',['Гитара','Кейтар','Барабаны','Труба','Бас']],['outfit','Одежда',['Рабочий комбинезон','Кожаный жилет','Лётная куртка']],['accessory','Снаряжение',['Сварочные очки','Наушники','Респиратор']]];
  for(const [key,label,options] of fields){const wrap=document.createElement('label');wrap.style.cssText='display:grid;gap:5px;text-align:left;margin:12px 0';wrap.textContent=label;const select=document.createElement('select');select.style.cssText='padding:12px;background:#1a2825;color:#d7e1d5;border:2px ridge #65726c;font:inherit';for(const value of options){const option=document.createElement('option');option.value=option.textContent=value;option.selected=value===profile[key];select.append(option);}select.addEventListener('change',()=>{profile[key]=select.value;localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...record(),musician:profile}));if(key==='nation')$('nation-note').textContent=nations[profile.nation];});wrap.append(select);$('pilot-fields').append(wrap);}
  const note=document.createElement('p');note.id='nation-note';note.textContent=nations[profile.nation];$('pilot-fields').append(note);
  action('Сохранить и в ангар',()=>{localStorage.setItem('ear-reharm-game.v1',JSON.stringify({...record(),musician:profile}));openHangar();});
}
function buyUpgrade(key){const h=hangar(),level=h.upgrades[key],cost=UPGRADE_INFO[key].cost[level];if(cost===undefined||h.scrap<cost)return;h.scrap-=cost;h.upgrades[key]++;saveHangar(h);openHangar();}
function selectShip(index){const h=hangar(),target=HANGAR_SHIPS[index];if(h.total<target.price)return;h.ship=index;saveHangar(h);openHangar();}
function selectPilot(index){const h=hangar(),target=HANGAR_PILOTS[index];if(h.total<target.unlock)return;h.pilot=index;saveHangar(h);openHangar();}
async function startRun(sector,level=sector===0?0:sector===2?1:2,bookMission=null){
  const token=++runToken;s.mode='loading';overlay('<span class="eyebrow">ПОДГОТОВКА К ВЫЛЕТУ</span><h2>Включаем звук…</h2><p>Запускаем синтезатор корабля.</p>');
  try{await audio.unlock();if(token!==runToken)return;
    await prepareFlightImages((ready,total)=>{if(token===runToken)overlay(`<span class="eyebrow">ПОДГОТОВКА К ВЫЛЕТУ</span><h2>Загружаем графику · ${ready}/${total}</h2><p>Корабли, планеты и музыканты</p>`);});if(token!==runToken)return;
    const build=shipBuild();Object.assign(s,{sector,bookMission,routeNumber:0,position:0,cleared:0,totalCleared:0,score:0,combo:0,health:build.maxHealth,maxHealth:build.maxHealth,power:1,attempts:0,correct:0,firstTry:0,replays:0,stats:{bass:{hit:0,miss:0},quality:{hit:0,miss:0}},bullets:[],shots:[],particles:[],enemy:null,invulnerable:0,drones:[],waveTimer:0,waveIndex:0,overdrive:0,energy:0,rings:[],travel:0,droneKills:0,capsule:null,capsuleTimer:0,intervalStats:{caught:0,wrong:0,missed:0,avoided:0}});
    expedition.reset(level);beginSector(sector);
  }catch(e){if(token!==runToken)return;s.mode='start';overlay(`<h2>Подготовка прервана</h2><p>${e.message}</p>`);action('Попробовать ещё',()=>startRun(sector,level));}
}
function beginSector(sector){
  weaponTab='bass';
  s.sector=sector;s.cleared=0;s.position=0;s.routeNumber=0;s.health=s.maxHealth||shipBuild().maxHealth;s.bullets=[];s.shots=[];s.enemy=null;s.drones=[];s.overdrive=0;s.waveTimer=1;s.capsule=null;s.capsuleTimer=0;
  $('recognized-chord').textContent='';$('feedback').textContent='';s.feedbackTimer=0;$('feedback').classList.remove('visible');signal('Готовимся к полёту');qualityBank=0;s.route=s.bookMission?createBookRoute(s.bookMission.chapter,s.bookMission.index,s.route?.key):createRoute(sector,s.route?.key);s.listening=false;s.mode='briefing';save();buildPads();renderHud();$('enemy-label').hidden=true;
  const c=SECTORS[sector];
  const map=s.bookMission?`<div class="battle-map"><i class="home">HOME</i>${s.route.sequence.map((_,i)=>`<i><b>${i+1}</b><span>HYDRA</span></i>`).join('')}</div>`:'';
  overlay(`<span class="eyebrow">${s.bookMission?s.route.code:`СЕКТОР 0${sector+1} / ${c.name.toUpperCase()}`}</span><h2>${s.bookMission?`${s.route.sequence.length} целей · гармонический маршрут`:c.title}</h2><p>${s.bookMission?'Home звучит перед стартом. Затем каждая гидра продолжает одну настоящую последовательность.':c.description}</p>${map}<p class="compact">${s.bookMission?'Все аккорды звучат вертикально. Перед целью услышишь до трёх предыдущих аккордов маршрута.':sector===0?'Во время сигнала гидра не атакует. Тяни корабль пальцем; правильная кнопка заряжает выстрел.':sector===1?'I, IV и V — ступени относительно тоники. Цифровка написана прямо на оружии.':'Бас даёт усиление сразу. Два пробитых щита уничтожают гидру. Ошибка не восстанавливает уже пробитый щит.'}</p>`);
  if(s.bookMission){action('Запустить маршрут →',()=>spawnEnemy());action('Выбрать другую миссию',()=>openBookFlight(s.bookMission.chapter),true);}
  else{action('Послушать новые сигналы',()=>startLessons());action('Skip → Сразу в бой',()=>spawnEnemy(),true);action('♫ Ознакомление со звуками',()=>openStudy(),true);action('Тренажёр ступеней и аккордов',()=>openTrainer(),true);action('Артефакты и правила',()=>artifactGuide(),true);}syncPads();
}
async function openStudy(){
  study.back=s.mode;audio.stop();s.mode='study';s.listening=false;s.keys.clear();renderStudy();syncPads();
  try{await audio.unlock();}catch(e){feedback(e.message,true);}
}
function closeStudy(){
  audio.stop();s.listening=false;
  if(study.back==='start'){s.mode='start';startScreen();}
  else if(study.back==='briefing'){beginSector(s.sector);}
  else{s.mode='paused';resume();}
}
async function openTrainer(){
  trainer.back=s.mode;audio.stop();s.mode='trainer';s.listening=false;s.keys.clear();renderTrainer();syncPads();
  try{await audio.unlock();newTrainerRound();}catch(e){feedback(e.message,true);}
}
function closeTrainer(){
  audio.stop();s.listening=false;
  if(trainer.back==='start'){s.mode='start';startScreen();}
  else if(trainer.back==='briefing'){beginSector(s.sector);}
  else{s.mode='paused';resume();}
}
function trainerPool(){
  if(trainer.kind==='degree')return trainer.level===0?[0,7]:trainer.level===1?[0,5,7,9]:Object.keys(DEGREES).map(Number);
  const core=['maj','min','7','maj7','m7','7sus4'];return trainer.level===0?core.slice(0,2):trainer.level===1?core:Object.keys(QUALITIES);
}
function renderTrainer(){
  const levelNames=['Новичок','Студент','Магистр музыки'];
  const score=trainer.total?`${trainer.correct}/${trainer.total} верно · ${Math.round(trainer.correct/trainer.total*100)}%`:'Пока нет ответов';
  const status=trainer.locked?'♫ Слушай сигнал…':trainer.revealed?'Проверь ответ и переходи дальше':'Нажми вариант ответа';
  overlay(`<span class="eyebrow">ТРЕНАЖЁР · БЕЗ ВРАГОВ И ТАЙМЕРА</span><h2>Слуховой полигон</h2><p class="compact">Звучание такое же, как в полёте. Ступень можно услышать вверх или вниз: ответ всегда обозначает расстояние от тоники. У аккордов меняется направление звучания, а тип остаётся тем же.</p><div id="trainer-kinds" class="study-tabs"></div><div id="trainer-levels" class="study-tabs"></div><div class="study-readout"><strong id="trainer-readout">?</strong><span id="trainer-status">${status}</span></div><div id="trainer-choices" class="study-choices"></div><p class="compact">${score} · направление: ${trainer.direction==='up'?'восходящее':trainer.direction==='down'?'нисходящее':'одновременно'}</p>`);
  const add=(id,label,fn,selected)=>{const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed',String(selected));b.addEventListener('click',fn);$(id).append(b);return b;};
  add('trainer-kinds','Ступени',()=>{trainer.kind='degree';newTrainerRound();},trainer.kind==='degree');
  add('trainer-kinds','Аккорды',()=>{trainer.kind='chord';newTrainerRound();},trainer.kind==='chord');
  levelNames.forEach((name,index)=>add('trainer-levels',name,()=>{trainer.level=index;newTrainerRound();},trainer.level===index));
  const pool=trainerPool();
  for(const value of pool){const item=trainer.kind==='degree'?DEGREES[value]:QUALITIES[value];const b=add('trainer-choices',item.glyph,()=>answerTrainer(value),false);b.title=item.label;b.disabled=trainer.locked||trainer.revealed;}
  action('↻ Повторить · Space',playTrainerRound,trainer.locked);
  if(trainer.revealed)action('Следующий сигнал →',newTrainerRound);
  action('Вернуться',closeTrainer,true);
}
function newTrainerRound(){
  audio.stop();const pool=trainerPool();trainer.target=pool[Math.floor(Math.random()*pool.length)];trainer.direction=Math.random()<.45?'up':Math.random()<.9?'down':'together';trainer.locked=true;trainer.revealed=false;renderTrainer();playTrainerRound();
}
async function playTrainerRound(){
  if(s.mode!=='trainer'||trainer.target===null)return;
  try{await audio.unlock();if(s.mode!=='trainer')return;trainer.locked=true;renderTrainer();
    const target=trainer.target,direction=trainer.direction;
    const done=()=>{if(s.mode==='trainer'&&trainer.target===target){trainer.locked=false;renderTrainer();}};
    if(trainer.kind==='degree')audio.interval(60,target,direction,done);
    else audio.chordOnly(48+Math.floor(Math.random()*12),INTERVALS[target],done,direction);
  }catch(e){feedback(e.message,true);}
}
function answerTrainer(value){
  if(s.mode!=='trainer'||trainer.locked||trainer.revealed)return;
  trainer.total++;trainer.revealed=true;const correct=value===trainer.target;if(correct)trainer.correct++;
  const item=trainer.kind==='degree'?DEGREES[trainer.target]:QUALITIES[trainer.target];
  $('trainer-readout').textContent=item.glyph;$('trainer-status').textContent=correct?`${item.label} · точно!`:`Верный ответ: ${item.glyph} · ${item.label}`;
  document.querySelectorAll('#trainer-choices button').forEach(b=>{b.disabled=true;if(b.textContent===item.glyph)b.classList.add('selected');});
  action('Следующий сигнал →',newTrainerRound);feedback(correct?'Точный слуховой захват':'Сверь обозначение и послушай ещё',!correct);
}
function renderStudy(){
  const item=QUALITIES[study.quality];
  overlay(`<span class="eyebrow">СЛУХОВОЙ АНГАР · БЕЗ ТАЙМЕРА</span><h2>Ознакомление со звуками</h2><p class="compact">Тот же синтезатор, что в полёте. Нажми символ, чтобы услышать его. Сравни maj → maj7 → 7: у двух последних добавлена разная септима.</p><div id="study-tabs" class="study-tabs"></div><div id="study-choices" class="study-choices"></div><div class="study-readout"><strong id="study-symbol">${study.kind==='chord'?item.glyph:study.interval}</strong><span id="study-description">${study.kind==='chord'?item.label:'Интервал от одного опорного звука'}</span></div><div id="study-modes" class="study-tabs"></div><p id="study-status" class="compact">Корень C3 · выбери звук</p>`);
  const add=(container,label,fn,selected=false)=>{const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed',String(selected));b.addEventListener('click',fn);$(container).append(b);return b;};
  for(const [kind,label] of [['chord','Аккорды'],['interval','Интервалы'],['rhythm','Ритмы'],['poly','Полиритмы']])add('study-tabs',label,()=>{audio.stop();study.kind=kind;renderStudy();},study.kind===kind);
  const choices=study.kind==='chord'?Object.keys(QUALITIES):study.kind==='interval'?NUMBER_LABELS:(study.kind==='poly'?POLYRHYTHMS:RHYTHMS).map((_,i)=>i);
  for(const value of choices){const label=study.kind==='chord'?QUALITIES[value].glyph:study.kind==='rhythm'?RHYTHMS[value].name:study.kind==='poly'?POLYRHYTHMS[value].name:value;
    const b=add('study-choices',label,()=>{study[study.kind==='chord'?'quality':study.kind]=value;renderStudy();playStudy();},value===study[study.kind==='chord'?'quality':study.kind]);b.title=study.kind==='chord'?QUALITIES[value].label:study.kind==='rhythm'?`С уровня: ${PILOTS[RHYTHM_LEVELS[value]].name}`:study.kind==='poly'?`С уровня: ${PILOTS[POLYRHYTHMS[value].level].name}`:`${NUMBER_OFFSETS[value]} полутонов`;
  }
  if(study.kind==='rhythm'){
    $('study-symbol').textContent=RHYTHMS[study.rhythm].name;$('study-description').textContent=RHYTHM_HINTS[study.rhythm];
    $('study-status').textContent=`110 BPM · ${RHYTHMS[study.rhythm].meter||(RHYTHMS[study.rhythm].beats===6?'3/4':'4/4')} · в игре с уровня «${PILOTS[RHYTHM_LEVELS[study.rhythm]].name}»`;
    add('study-modes','По кругу',()=>{study.loop=!study.loop;renderStudy();playStudy();},study.loop);
    add('study-modes','Стоп',()=>{audio.stop();$('study-status').textContent='Остановлено';});
    const pulse=document.createElement('div');pulse.id='study-pulse';pulse.className='study-pulse';$('study-modes').append(pulse);
  }else if(study.kind==='poly'){
    const p=POLYRHYTHMS[study.poly];$('study-symbol').textContent=p.name;$('study-description').textContent=`${p.a} высоких ударов против ${p.b} низких за один общий цикл.`;$('study-status').textContent=`В игре с уровня «${PILOTS[p.level].name}» · сначала сравни слои отдельно`;
    for(const [layer,label] of [['both','Оба слоя'],['rim','Высокий'],['kick','Низкий']])add('study-modes',label,()=>{study.layer=layer;renderStudy();playStudy();},study.layer===layer);
    for(const id of ['poly-high','poly-low']){const row=document.createElement('div');row.id=id;row.className='study-pulse';row.textContent='○';$('study-modes').append(row);}
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
    else if(study.kind==='poly'){const poly=study.poly,p=POLYRHYTHMS[poly];audio.poly(p,()=>{if(s.mode==='study'&&study.kind==='poly'&&study.poly===poly&&study.loop)playStudy();else done();},{cycles:study.loop?8:3,layer:study.layer,onHit:event=>{if(s.mode!=='study'||study.kind!=='poly')return;const count=event.voice==='rim'?p.a:p.b;$(event.voice==='rim'?'poly-high':'poly-low').textContent=Array.from({length:count},(_,i)=>i===event.index?'●':'○').join(' ');}});}
    else{const rhythm=study.rhythm;audio.rhythm(RHYTHMS[rhythm],()=>{if(s.mode==='study'&&study.kind==='rhythm'&&study.rhythm===rhythm&&study.loop)playStudy();else done();},{loops:study.loop?8:1,onBeat:beat=>{if(s.mode==='study'&&study.kind==='rhythm')$('study-pulse').textContent=Array.from({length:RHYTHMS[rhythm].beats===6?3:4},(_,i)=>i===beat%(RHYTHMS[rhythm].beats===6?3:4)?'●':'○').join('  ');}});}
  }catch(e){feedback(e.message,true);}
}
function artifactGuide(){
  overlay('<span class="eyebrow">ПАМЯТКА ПИЛОТА</span><h2>Слушай. Лови. Усиливайся.</h2><p class="compact">Услышь интервал и поймай одну цифру: малая терция — ♭3, квинта — 5, малая септима — ♭7, большая — 7. Направление звучания не меняет ответ. Для тритона появится один верный жетон: ♭5 или ♯4. Ошибочный захват завершает попытку.<br><br>Telecaster вызывает гитариста и ладовый режим. Keytar вызывает клавишника и мелодический режим. Overdrive — двойной урон и защита. Jazz Bass — услышь 3 или 7 аккорда и поймай цифру: механические хищники нейтрализуются.<br><br>Красный язык — узнай тип аккорда без ступени для HP 100%. Реликвия барабанщика останавливает полёт и запускает распознавание стиля или партии. Тарелка Zildjian запасает RHYTHM FOCUS: во время задания она убирает половину неверных вариантов.<br><br>Реликвии музыкантов — это светящиеся механические кубы. После захвата в кадр влетает трубач, клавишник, гитарист или барабанщик. Трубач просит BASIC, GUIDE или COLOR TONES; один чужой жетон гасит режим.<br><br>Механические хищники оставляют подсказки, автомат, невидимость и защиту. Для нейтрализации также используй обычные заряды.</p>');
  action('Сразу в бой →',()=>spawnEnemy());
  action('Попробовать сбор интервалов',()=>{spawnEnemy();audio.stop();s.listening=false;expedition.startChallenge('numbers');},true);
  ARTIFACTS.forEach((item,i)=>action(`Попробовать ${item.name}`,()=>{spawnEnemy();audio.stop();s.listening=false;expedition.artifact(i);if(i===3)playCue();},true));
}
function startLessons(){
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
  s.enemy={chord:s.route.sequence[s.position],model:expedition.level===0?Math.min(2,s.sector):expedition.level,shields:{bass:false,quality:s.sector<2},x:W/2,y:Math.max(155,Math.min(H*.38,250)),age:0,misses:0,hit:0,muzzle:0};
  $('enemy-label').hidden=false;$('enemy-label').firstElementChild.textContent=s.bookMission?`${s.route.code} · HYDRA ${String(s.position+1).padStart(2,'0')}/${String(s.route.sequence.length).padStart(2,'0')}`:`HYDRA · ${MACHINES[s.enemy.model]} / ${String(s.totalCleared+1).padStart(2,'0')}`;
  $('dock-label').textContent=s.sector>=2?'ДВА ЩИТА · ДВА ВИДА ОРУЖИЯ':'УЗНАЙ СИГНАЛ — ВЫСТРЕЛИ';
  $('dock-tip').textContent=s.sector<2?'Выбери ступень относительно тоники I':s.sector===3?'Корень + тип → цифровка · m7 ≠ maj7':'Корень и точный тип — в любом порядке';
  s.fireTimer=expedition.pilot.grace;renderHud();playCue();
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
  s.attempts++;s.stats[kind][outcome.correct?'hit':'miss']++;
  if(outcome.correct){
    s.correct++;s.enemy.shields=outcome.shields;s.beam=.3;s.enemy.hit=.25;s.score+=kind==='bass'?100:150;awardScrap(kind==='bass'?7:10);
      if(kind==='bass'){s.power=Math.min(3,s.power+1);s.overdrive=7;feedback('Щит пробит · ВЕЕРНЫЙ ОГОНЬ');}
    else feedback(`${QUALITIES[s.enemy.chord.quality].glyph} · тип распознан`);
    if(!outcome.destroyed)weaponTab=kind==='bass'?'quality':'bass';
    burst(s.enemy.x,s.enemy.y,kind==='bass'?'#79f5d0':'#ff7ea7',25);
    if(outcome.destroyed){
      s.combo++;s.totalCleared++;s.cleared++;if(s.enemy.misses===0)s.firstTry++;
      s.score+=200+Math.min(s.combo,10)*25;awardScrap(24+Math.min(s.combo,8)*2);s.resolveTimer=s.bookMission?1.4:6;s.mode='resolving';s.bullets=[];s.overdrive=Math.max(s.overdrive,6);s.waveTimer=.3;
      const label=DEGREES[s.enemy.chord.offset];
      feedback(`${s.sector>=2?chordSymbol(s.enemy.chord):label.glyph} · щиты пробиты`);
      $('recognized-chord').textContent=s.sector>=2?chordSymbol(s.enemy.chord):label.glyph;
      burst(s.enemy.x,s.enemy.y,'#f7cd7f',50);s.rings.push({x:s.enemy.x,y:s.enemy.y,age:0});
      s.capsuleTimer=0;
      if(!s.bookMission)expedition.afterHydra();
      $('enemy-label').hidden=true;signal(s.bookMission?'Маршрут продолжается…':'Разгон! Услышь интервал и поймай один жетон');
      if(s.combo%3===0){s.health=Math.min(s.maxHealth,s.health+1);s.score+=100;}
    }
  }else{
    s.enemy.misses++;s.combo=0;s.power=Math.max(1,s.power-1);s.fireTimer=4.5;
    feedback('Гидра отвечает — уклоняйся!',true);s.flash=.12;
    button?.classList.add('wrong');setTimeout(()=>button?.classList.remove('wrong'),400);enemyVolley(true);
    if(s.enemy.misses>=2)$('dock-tip').textContent='Нажми «Слушать»: дом и сигнал прозвучат снова';
  }
  renderHud();syncPads();
}
function enemyVolley(aimed=false){
  if(!s.enemy||expedition.cloaked)return;
  const e=s.enemy,count=aimed?3:2+pressure(expedition.level,s.combo,s.health),speed=(aimed?100:72+s.sector*14)*expedition.pilot.speed;
  const angle=Math.atan2(s.player.y-e.y,s.player.x-e.x);
  const ports=machinePorts(e.model||0);e.muzzle=.18;
  for(let i=0;i<count;i++){const a=angle+(i-(count-1)/2)*.26,port=ports[i%ports.length];s.bullets.push({x:e.x+port.x,y:e.y+port.y+17,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:6});}
}
function advance(){
  s.enemy=null;s.capsule=null;s.capsuleTimer=0;s.position++;
  if(s.cleared>=(s.bookMission?s.route.sequence.length:SECTORS[s.sector].count)){
    save();s.mode='intermission';$('enemy-label').hidden=true;audio.stop();
    if(s.sector>=2){finish(true);return;}
    overlay(`<span class="eyebrow">СЕКТОР ПРОЙДЕН</span><h2>Чистый сигнал.</h2><p>Путь свободен. Щит корабля восстановлен.<br>Дальше — ${SECTORS[s.sector+1].name.toLowerCase()}.</p><div class="results"><div><strong>${s.score}</strong><span>ОЧКОВ</span></div><div><strong>${s.firstTry}</strong><span>С ПЕРВОГО РАЗА</span></div></div>`);
    action('Лететь дальше →',()=>beginSector(s.sector+1));syncPads();return;
  }
  if(s.position>=s.route.sequence.length){if(s.bookMission){finish(true);return;}s.position=0;s.routeNumber++;s.route=createRoute(s.sector,s.route.key,Math.random,s.routeNumber);}
  spawnEnemy();
}
function finish(won){
  s.mode=won?'finished':'gameover';audio.stop();s.listening=false;const returnScrap=Math.max(12,Math.floor(s.score/90));awardScrap(returnScrap);save();syncPads();
  const accuracy=s.attempts?Math.round(s.correct/s.attempts*100):0;
  overlay(`<span class="eyebrow">${s.bookMission?s.route.code:won?'МАРШРУТ ЗАВЕРШЁН':'КОРАБЛЬ ВЕРНУЛСЯ НА БАЗУ'}</span><h2>${won?'Маршрут взят.':'Ещё один вылет?'}</h2><p>${won&&s.bookMission?'Все гидры уничтожены. Сейчас маршрут прозвучит целиком вертикальными аккордами.':won?'Ступени и цифровки аккордов становятся частью твоего оружия.':'Сигналы становятся знакомее с каждым полётом. Попробуем этот сектор ещё раз.'}</p><div class="results"><div><strong>${s.score}</strong><span>ОЧКОВ</span></div><div><strong>◉ ${returnScrap}</strong><span>CREDITS</span></div><div><strong>${accuracy}%</strong><span>ПОПАДАНИЙ</span></div></div><p class="compact">Бас: ${s.stats.bass.hit}/${s.stats.bass.hit+s.stats.bass.miss} · Тип: ${s.stats.quality.hit}/${s.stats.quality.hit+s.stats.quality.miss}<br>Капсулы: ${s.intervalStats.caught} верных · ${s.intervalStats.wrong} чужих</p>`);
  if(won&&s.bookMission){audio.progression(s.route,s.route.sequence.length-1,event=>signal(`${event.index+1} · ${chordSymbol(s.route.sequence[event.index])}`,true),()=>signal(`${s.route.code} · COMPLETE`),true);action('↻ Прослушать весь маршрут',()=>audio.progression(s.route,s.route.sequence.length-1,event=>signal(`${event.index+1} · ${chordSymbol(s.route.sequence[event.index])}`,true),()=>signal(`${s.route.code} · COMPLETE`),true),true);}
  action(won?'Новый вылет · другие тональности':'Повторить сектор',()=>s.bookMission?startBookRun(s.bookMission.chapter,s.bookMission.index):startRun(won?(s.sector===3?3:0):s.sector,expedition.level));
  action('Выбрать уровень',()=>{s.mode='start';expedition.reset();startScreen();},true);
  action('Ангар · потратить детали',openHangar,true);
  if(s.bookMission)action('Карта миссий',()=>openBookFlight(s.bookMission.chapter),true);
  if(won)action('Все ступени и аккорды',()=>startRun(3),true);
}
function pause(help=false){
  if(s.mode==='study'){audio.stop();return;}
  if(['paused','start','gameover','finished','loading'].includes(s.mode))return;
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
    if(expedition.busy)expedition.replay();else if(s.mode==='active')playCue();else if(s.mode==='resolving'&&s.capsule)playCapsule();syncPads();
  }catch(e){feedback(e.message,true);}
}
function burst(x,y,color,count){for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2,speed=30+Math.random()*150;s.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.5+Math.random()*.7,color});}if(s.particles.length>350)s.particles.splice(0,s.particles.length-350);}
function shipHit(){
  if(s.invulnerable>0||expedition.invincible||!['active','resolving'].includes(s.mode))return;
  s.health--;s.invulnerable=1.4;s.combo=0;s.flash=.18;burst(s.player.x,s.player.y,'#ff7ea7',15);feedback('Щит задет · продолжай полёт',true);renderHud();if(s.health<=0)finish(false);
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
  if(caught){
    if(outcome.correct){const reactor=shipBuild().energyGain;s.intervalStats.caught++;s.energy+=Math.round(outcome.energy*reactor);s.score+=outcome.energy*5;awardScrap(9);s.power=Math.min(3,s.power+1);s.overdrive=3+outcome.energy/10;burst(c.x,c.y,'#79f5d0',35);feedback(`Верный интервал · +${outcome.energy} силы`);if(s.energy>=100){s.energy-=100;s.health=Math.min(s.maxHealth,s.health+1);s.overdrive=9;}}
    else{s.intervalStats.wrong++;s.energy=Math.max(0,s.energy-20);s.power=Math.max(1,s.power-1);s.overdrive=0;s.flash=.15;feedback(`Это ${c.heard===3?'♭3':c.heard===4?'3':c.heard===5?'4':'5'} · чужой сигнал, −20 силы`,true);}
  }else if(outcome.correct){s.intervalStats.missed++;feedback('Нужный интервал пролетел · ещё встретим');}
  else{s.intervalStats.avoided++;feedback('Чужая капсула прошла мимо');}
  s.capsule=null;s.listening=false;s.resolveTimer=Math.min(s.resolveTimer,1);renderHud();syncPads();
}
function update(dt){
  if(['paused','study','trainer'].includes(s.mode))return;
  clock+=dt;
  if(s.feedbackTimer>0){s.feedbackTimer-=dt;if(s.feedbackTimer<=0)$('feedback').classList.remove('visible');}
  if(expedition.pausedCombat){expedition.tick(dt);return;}
  s.flash=Math.max(0,s.flash-dt);s.beam=Math.max(0,s.beam-dt);s.invulnerable=Math.max(0,s.invulnerable-dt);
  const playing=['active','resolving'].includes(s.mode);
  s.travel+=dt*(s.mode==='resolving'?130:playing?55:16);
    if(playing){
    const p=s.player,speed=shipBuild().speed*dt;
    if(s.keys.has('arrowleft')||s.keys.has('a'))p.tx-=speed;
    if(s.keys.has('arrowright')||s.keys.has('d'))p.tx+=speed;
    if(s.keys.has('arrowup')||s.keys.has('w'))p.ty-=speed;
    if(s.keys.has('arrowdown')||s.keys.has('s'))p.ty+=speed;
    p.tx=clamp(p.tx,25,W-25);p.ty=clamp(p.ty,115,H-35);p.x+=(p.tx-p.x)*Math.min(1,dt*16);p.y+=(p.ty-p.y)*Math.min(1,dt*16);
    expedition.tick(dt);
    const hadBoost=s.overdrive>0;if(!s.listening)s.overdrive=Math.max(0,s.overdrive-dt);if(hadBoost&&s.overdrive===0)renderHud();
    s.shotTimer-=dt;if(s.shotTimer<=0){const build=shipBuild(),boost=s.overdrive>0||expedition.boosted;s.shotTimer=boost?.09:build.shotDelay;const count=boost?5:Math.max(s.power,build.shots);for(let i=0;i<count;i++)s.shots.push({x:p.x+(i-(count-1)/2)*10,y:p.y-20,vx:boost?(i-2)*60:0});}
    if(!reduced)burst(p.x,p.y+24,'#5efbdd',1);
    if(s.enemy){s.enemy.age+=dt;s.enemy.x=W/2+Math.sin(s.enemy.age*.62)*80;s.enemy.hit=Math.max(0,s.enemy.hit-dt);s.enemy.muzzle=Math.max(0,(s.enemy.muzzle||0)-dt);}
    if(!s.listening){
      const difficulty=pressure(expedition.level,s.combo,s.health);
      s.waveTimer-=dt;if(s.waveTimer<=0&&s.drones.length<10){s.drones.push(...formation(s.waveIndex++,W,difficulty));s.waveTimer=s.mode==='resolving'?2.3:6;}
      for(const d of s.drones){stepDrone(d,dt*expedition.pilot.speed,W);if(d.fire<=0&&d.y>20&&d.y<H*.6&&!expedition.cloaked){d.fire=10;const a=Math.atan2(p.y-d.y,p.x-d.x);s.bullets.push({x:d.x,y:d.y,vx:Math.cos(a)*75,vy:Math.sin(a)*75,r:5});}if(d.y>0&&hitCircle(d,p,25)){d.hp=0;shipHit();}}
      if(s.mode==='active'&&!expedition.busy){s.fireTimer-=dt;if(s.fireTimer<=0){enemyVolley();s.fireTimer=expedition.pilot.grace;}}
      s.bullets.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;
        if(Math.hypot(b.x-p.x,b.y-(p.y-6))<b.r+11&&s.invulnerable===0){
          b.y=H+100;shipHit();
        }
      });
    }
    if(s.mode==='resolving'&&!expedition.busy){
      if(s.capsuleTimer>0){s.capsuleTimer-=dt;if(s.capsuleTimer<=0)launchCapsule();}
      if(s.capsule&&!s.listening){const c=s.capsule;c.age+=dt;c.y+=c.speed*dt;if(hitCircle(c,p,31))resolveCapsule(true);else if(c.y>H+30)resolveCapsule(false);}
      if(!s.listening)s.resolveTimer-=dt;if(s.resolveTimer<=0&&!s.capsule&&s.capsuleTimer<=0)advance();
    }
  }
  if(!['active','resolving'].includes(s.mode)){s.shots=[];s.bullets=[];s.drones=[];}
  s.shots.forEach(b=>{b.y-=500*dt;b.x+=(b.vx||0)*dt;
    if(expedition.hitShot(b)){b.y=-30;return;}
    for(const d of s.drones){if(d.hp>0&&d.y>0&&hitCircle(b,d,22)){d.hp--;d.hit=.15;b.y=-30;if(d.hp<=0){s.droneKills++;s.score+=20;awardScrap(2);burst(d.x,d.y,'#f7cd7f',12);renderHud();}break;}}
    if(s.enemy&&s.mode==='active'&&Math.abs(b.x-s.enemy.x)<72&&b.y<s.enemy.y+60&&b.y>s.enemy.y-50){burst(b.x,b.y,'#a4a9d7',2);b.y=-30;}
  });s.shots=s.shots.filter(b=>b.y>-20&&b.x>-10&&b.x<W+10);
  s.drones=s.drones.filter(d=>d.hp>0&&d.y<H+35);
  s.bullets=s.bullets.filter(b=>b.y<H+30&&b.x>-30&&b.x<W+30);
  s.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});s.particles=s.particles.filter(p=>p.life>0);
  s.rings.forEach(r=>r.age+=dt);s.rings=s.rings.filter(r=>r.age<.8);
}
function draw(){
  ctx.clearRect(0,0,W,H);
  const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#111328');bg.addColorStop(.6,'#090f21');bg.addColorStop(1,'#102b34');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const terrain=images[expedition.planet];
  if(terrain.complete&&terrain.naturalWidth){const tileHeight=W*terrain.naturalHeight/terrain.naturalWidth,offset=s.travel%tileHeight;ctx.globalAlpha=.72;for(let y=offset-tileHeight;y<H;y+=tileHeight)ctx.drawImage(terrain,0,y,W,tileHeight);ctx.globalAlpha=1;ctx.fillStyle='#08102128';ctx.fillRect(0,0,W,H);}
  const nebula=ctx.createRadialGradient(W*.15,H*.38,0,W*.15,H*.38,270);nebula.addColorStop(0,'#5e357920');nebula.addColorStop(1,'#24123200');ctx.fillStyle=nebula;ctx.fillRect(0,0,W,H);
  for(const star of stars){const y=(star.y+clock*(reduced?3:18)*star.z)%(H+20);ctx.globalAlpha=.28+star.z*.45;ctx.fillStyle=star.z>.85?'#aacbdb':'#687694';ctx.fillRect(star.x,y,star.r,star.r*(star.z>.9?2:1));}ctx.globalAlpha=1;
  // Navigational grid and scrolling rail marks, not a decorative scene asset.
  ctx.strokeStyle='#7695bd0d';ctx.lineWidth=1;for(let x=0;x<=W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=(clock*24)%70;y<H;y+=70){ctx.fillStyle='#a6c5d52b';ctx.fillRect(12,y,4,1);ctx.fillRect(W-16,y,4,1);}
  const activeEnemy=s.enemy&&s.mode!=='resolving';
  if(activeEnemy||s.mode==='start'){
    const e=activeEnemy?s.enemy:{x:W/2,y:H*.37,age:clock,shields:{bass:false,quality:false},hit:0};
    const model=e.model??0,size=machineSize(model),radius=size*.57;
    const halo=ctx.createRadialGradient(e.x,e.y,15,e.x,e.y,radius*1.3);halo.addColorStop(0,'#b44e892b');halo.addColorStop(1,'#b44e8900');ctx.fillStyle=halo;ctx.fillRect(e.x-radius*1.3,e.y-radius*1.3,radius*2.6,radius*2.6);
    ctx.save();ctx.translate(e.x,e.y+Math.sin(clock*2)*3);
    const machine=model===1?images.corvette:model===3?images.fortress:images.enemyships;
    if(machine.complete&&machine.naturalWidth){const [sx,sy,sw,sh]=model===1||model===3?[0,0,machine.naturalWidth,machine.naturalHeight]:MACHINE_CROPS[model],scale=size/Math.max(sw,sh);ctx.save();ctx.rotate(Math.PI);ctx.drawImage(machine,sx,sy,sw,sh,-sw*scale/2,-sh*scale/2,sw*scale,sh*scale);ctx.restore();}
    for(const port of machinePorts(model)){
      ctx.fillStyle='#69503a';ctx.strokeStyle='#d9b16f';ctx.lineWidth=1;ctx.fillRect(port.x-6,port.y-8,12,19);ctx.strokeRect(port.x-6,port.y-8,12,19);ctx.fillStyle='#28353a';ctx.fillRect(port.x-3,port.y+4,6,14);
      ctx.fillStyle=e.muzzle>0?'#fff2ad':'#73d4bb';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=e.muzzle>0?14:3;ctx.fillRect(port.x-2,port.y+16,4,e.muzzle>0?11:2);ctx.shadowBlur=0;
    }
    for(let i=0;i<2+model;i++){const x=(i-(1+model)/2)*size*.16;ctx.fillStyle='#69e3d9';ctx.globalAlpha=.35+Math.sin(clock*18+i)*.15;ctx.beginPath();ctx.ellipse(x,-size*.37,4,12+Math.sin(clock*15+i)*4,0,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    for(const [i,kind] of ['bass','quality'].entries()){
      if(e.shields[kind]||(kind==='quality'&&s.sector<2&&s.mode!=='start'))continue;
      ctx.save();ctx.rotate(clock*(i?-.3:.23));ctx.strokeStyle=i?'#ff7ea780':'#79f5d0a0';ctx.lineWidth=2;ctx.setLineDash([26,7]);ctx.beginPath();ctx.arc(0,0,radius+i*10,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(e.hit>0){ctx.fillStyle='#ffffff30';ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();}ctx.restore();
  }
  ctx.shadowColor='#79f5d0';ctx.shadowBlur=reduced?0:9;ctx.fillStyle='#a2ffe0';for(const b of s.shots)ctx.fillRect(b.x-1.5,b.y,3,12);ctx.shadowBlur=0;
  for(const d of s.drones){if(d.y<0)continue;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(Math.sin(d.age+d.phase)*.2);if(images.drone.complete&&images.drone.naturalWidth)ctx.drawImage(images.drone,-20,-20,40,40);if(d.hit>0){ctx.fillStyle='#fff8';ctx.fillRect(-13,-9,26,18);}ctx.restore();}
  for(const b of s.bullets){ctx.fillStyle='#ff7ea72b';ctx.beginPath();ctx.arc(b.x,b.y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffbdc8';ctx.beginPath();ctx.arc(b.x,b.y,4,0,Math.PI*2);ctx.fill();}
  expedition.draw();
  const p=s.player;
  ctx.save();ctx.translate(p.x,p.y);if(s.invulnerable>0||expedition.cloaked)ctx.globalAlpha=.45+Math.sin(clock*30)*.3;
  if(expedition.invincible){ctx.strokeStyle='#ffe69a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,36,0,Math.PI*2);ctx.stroke();}
  ctx.strokeStyle='#79f5d029';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,35,0,Math.PI*2);ctx.stroke();
  drawPlayerFrame(shipBuild().frame.frame);
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,-6,2,0,Math.PI*2);ctx.fill();ctx.restore();
  if(s.beam>0&&s.enemy){ctx.strokeStyle='#bdffe7';ctx.lineWidth=4+s.beam*20;ctx.globalAlpha=s.beam/.3;ctx.beginPath();ctx.moveTo(p.x,p.y-26);ctx.lineTo(s.enemy.x,s.enemy.y+30);ctx.stroke();ctx.globalAlpha=1;}
  for(const r of s.rings){ctx.strokeStyle=`rgba(121,245,208,${1-r.age/.8})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,r.age*260,0,Math.PI*2);ctx.stroke();}
  if(s.capsule){const c=s.capsule;ctx.save();ctx.translate(c.x,c.y);ctx.shadowColor='#79f5d0';ctx.shadowBlur=18;ctx.strokeStyle='#a5ffe6';ctx.fillStyle='#153c4c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-27);ctx.lineTo(26,-14);ctx.lineTo(26,14);ctx.lineTo(0,27);ctx.lineTo(-26,14);ctx.lineTo(-26,-14);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#e5fff5';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 24px system-ui';ctx.fillText(INTERVAL_TARGETS[c.wanted].glyph,0,0);ctx.strokeStyle='#79f5d070';ctx.beginPath();ctx.arc(0,0,34+Math.sin(clock*5)*3,0,Math.PI*2);ctx.stroke();ctx.restore();}
  for(const particle of s.particles){ctx.globalAlpha=Math.min(1,particle.life*2);ctx.fillStyle=particle.color;ctx.fillRect(particle.x,particle.y,3,3);}ctx.globalAlpha=1;
  if(expedition.pausedCombat)expedition.drawPauseOverlay();
  if(s.flash>0&&!reduced){ctx.fillStyle=`rgba(255,93,134,${s.flash*.3})`;ctx.fillRect(0,0,W,H);}
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
canvas.addEventListener('pointerdown',e=>{if(!['active','resolving'].includes(s.mode))return;s.pointer=e.pointerId;canvas.setPointerCapture(e.pointerId);movePointer(e);});
canvas.addEventListener('pointermove',e=>{if(e.pointerId===s.pointer)movePointer(e);});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>s.pointer=null);
document.addEventListener('keydown',e=>{
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
  if(s.sector>=2&&['q','w','e','r'].includes(key)){s.keys.delete(key);$('quality-pads').children[['q','w','e','r'].indexOf(key)]?.click();}
});
document.addEventListener('keyup',e=>s.keys.delete(e.key.toLowerCase()));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('blur',()=>{s.keys.clear();pause();});
window.addEventListener('pagehide',()=>{audio.stop();activeRecognition?.abort();});
['bank-basic','bank-altered'].forEach((id,i)=>$(id).addEventListener('click',()=>{qualityBank=i;buildPads();}));
['weapon-root','weapon-type'].forEach((id,i)=>$(id).addEventListener('click',()=>{weaponTab=i?'quality':'bass';syncPads();}));
$('hint').addEventListener('click',()=>expedition.hint());
$('pause').addEventListener('click',()=>s.mode==='paused'?resume():pause());
$('replay').addEventListener('click',()=>{s.replays++;expedition.busy?expedition.replay():s.capsule?playCapsule():playCue(!!s.bookMission);});
$('interval-reference').addEventListener('click',()=>playCapsule(true));
$('help').addEventListener('click',()=>{if(s.mode==='start'){feedback('Включи звук и нажми «Вылететь»');}else pause(true);});
// Read-only diagnostics for regression checks; deliberately no answer/skip hook.
window.earGame=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({mode:s.mode,sector:s.sector,score:s.score,health:s.health,power:s.power,combo:s.combo,cleared:s.cleared,listening:s.listening,enemy:s.enemy,player:s.player,bullets:s.bullets,stats:s.stats,route:s.route,capsule:s.capsule,intervalStats:s.intervalStats,audio:{state:audio.context?.state,lastCue:audio.lastCue}}))});
startScreen();installLanguage();requestAnimationFrame(frame);
