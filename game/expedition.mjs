import {QUALITIES,INTERVALS} from './music.mjs';
import {MELODY_BANK} from './melody-bank.mjs';
import {melodyIndicesForLevel} from './melody-levels.mjs';
import {flightNotes,cubeLayout,numberCubeLayout,cubeFace,partialToneCredit} from './flight-tones.mjs';
import {themeRoomById,themeRoomForArtifact,themeMelodyIndices,themeRelatedCount,themeChallengeOptions} from './theme-rooms.mjs';

export const PILOTS=[
  {name:'Новичок',sector:0,speed:.65,grace:9,obstacleGap:230,description:'I и V · спокойный полёт · помощь'},
  {name:'Студент',sector:2,speed:.85,grace:7,obstacleGap:200,description:'Одна плашка · полный аккорд'},
  {name:'Магистр музыки',sector:3,speed:1,grace:5,obstacleGap:170,description:'12 корней · 22 типа · все интервалы'},
  {name:'Херби Хэнкок',sector:3,speed:1.25,grace:3,obstacleGap:145,description:'Вся гармония · быстрые враги · узкие проходы'},
];
export const TEACHERS=[
  {name:'КЛЕПАНАЯ ПАСТЬ',reward:'hint',text:'Из обломков извлечена подсказка'},
  {name:'СЧЁТНЫЙ КЛЕЩ',reward:'rapid',text:'Автомат: 12 секунд'},
  {name:'КИСЛОТНЫЙ КОТЁЛ',reward:'cloak',text:'Невидимость: 10 секунд'},
  {name:'ТАРАННЫЙ ЖУК',reward:'shield',text:'Неприкосновенность: 10 секунд'},
  {name:'ВОЕННЫЙ УТИЛИЗАТОР',reward:'combo',text:'Автомат + невидимость'},
];
export const ARTIFACTS=[
  {name:'Telecaster',elixir:'Modal Drive',text:'Вызывает гитариста · распознай лад'},
  {name:'Keytar',elixir:'Melody Memory',text:'Вызывает клавишника · распознай тему'},
  {name:'Jazz Bass',elixir:'Guide Tone',text:'Услышь 3 или 7, поймай цифру — механические хищники нейтрализуются'},
  {name:'Overdrive',elixir:'Iron Fuzz',text:'Двойной урон и щит · 10 секунд'},
  {name:'Rock Tongue',elixir:'Full Recovery',text:'Узнай тип случайного аккорда → HP 100%'},
  {name:'Zildjian',elixir:'Rhythm Focus',text:'Запаси подсказку: убрать половину неверных ритмов'},
  {name:'Drum Machine',elixir:'Phase Lock',text:'Барабанщица · узнай рудимент по нотам → защита и автомат'},
  {name:'The Trumpeter',elixir:'Harmonic Flight',text:'Лови ноты basic, guide или all tones для случайного аккорда'},
  {name:'The Key Pilot',elixir:'Melody Memory',text:'Узнай одноголосную тему по названию или голосом'},
  {name:'The Guitar Pilot',elixir:'Modal Drive',text:'Узнай лад по восходящей или нисходящей гамме'},
  {name:'The Drummer',elixir:'Rhythm Trial',text:'Узнай стиль или ритмическую партию'},
  {name:'Vibraphone',elixir:'Color Hearing',text:'Виброфонистка · услышь верхние надстройки аккорда'},
  {name:'Yellow Submarine',elixir:'The Beatles Room',text:'Артефакт The Beatles · угадай одну мелодию среди шести названий; сложность растёт вместе с пилотом'},
];
// Authored short recognition examples, not arrangements copied from a source.
// Beat positions are quarter-note units across two bars. Same tempo for all.
const hits=(voice,times)=>times.map(beat=>({voice,beat}));
const eighths=Array.from({length:16},(_,i)=>i/2);
const swung=Array.from({length:8},(_,i)=>[i,i+2/3]).flat();
export const RHYTHMS=[
  {name:'Rock',icon:'▰',events:[...hits('hat',eighths),...hits('kick',[0,2,4,6]),...hits('snare',[1,3,5,7])]},
  {name:'Shuffle',icon:'≋',events:[...hits('hat',swung),...hits('kick',[0,2,4,6]),...hits('snare',[1,3,5,7])]},
  {name:'Swing',icon:'♪',events:[...hits('ride',[0,1,1+2/3,2,3,3+2/3,4,5,5+2/3,6,7,7+2/3]),...hits('hat',[1,3,5,7]),...hits('kick',[0,4])]},
  {name:'Son Clave 3–2',icon:'⋮',events:hits('clave',[0,1.5,3,5,6])},
  {name:'Son Clave 2–3',icon:'⁝',events:hits('clave',[1,2,4,5.5,7])},
  {name:'Latin · Bossa',icon:'◈',events:[...hits('hat',eighths),...hits('kick',[0,1.5,2,3.5,4,5.5,6,7.5]),...hits('rim',[0,1.5,3,4.5,6])]},
  {name:'Funk',icon:'ϟ',events:[...hits('hat',eighths),...hits('kick',[0,.75,2.5,4,4.75,6.5]),...hits('snare',[1,3,5,7])]},
  {name:'Reggae',icon:'〰',events:[...hits('hat',[.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5]),...hits('kick',[2,6]),...hits('rim',[2,6])]},
  {name:'Disco',icon:'◇',events:[...hits('kick',[0,1,2,3,4,5,6,7]),...hits('hat',[.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5]),...hits('snare',[1,3,5,7])]},
  {name:'Jazz Waltz',icon:'③',beats:6,events:[...hits('ride',[0,1,1+2/3,2,3,4,4+2/3,5]),...hits('kick',[0,3]),...hits('hat',[1,4])]},
  {name:'Mambo',icon:'⌁',events:[...hits('ride',[0,.5,1.5,2,3,3.5,4,5,5.5,6.5,7,7.5]),...hits('kick',[1.5,3,5.5,7]),...hits('rim',[0,1.5,3,5,6]),...hits('hat',[1,3,5,7])]},
  {name:'Calypso',icon:'☼',events:[...hits('hat',eighths),...hits('kick',[0,1,2,3,4,5,6,7]),...hits('rim',[.5,1.5,1.75,2.5,3.5,3.75,4.5,5.5,5.75,6.5,7.5,7.75])]},
  {name:'Afro-Cuban 12/8',icon:'✺',meter:'12/8',events:[...hits('ride',[0,2/3,4/3,5/3,7/3,3,11/3,4,4+2/3,4+4/3,4+5/3,4+7/3,7,4+11/3]),...hits('kick',[0,1,2,3,4,5,6,7])]},
  {name:'Rumba Clave 3–2',icon:'⋮',events:hits('clave',[0,1.5,3.5,5,6])},
  {name:'Cha-cha-cha',icon:'♧',events:[...hits('ride',[0,1,2,3,4,5,6,7]),...hits('kick',[0,2,4,6]),...hits('rim',[.5,1,2,2.5,3,4.5,5,6,6.5,7])]},
  {name:'Samba',icon:'☷',events:[...hits('hat',eighths),...hits('kick',[0,.75,1,1.75,2,2.75,3,3.75,4,4.75,5,5.75,6,6.75,7,7.75]),...hits('rim',[0,1.5,2.5,4,5.5,6.5])]},
  {name:'Tumbao · Bass',icon:'♩',part:true,events:[{voice:'bass',beat:1.5,midi:48},{voice:'bass',beat:3,midi:43},{voice:'bass',beat:5.5,midi:48},{voice:'bass',beat:7,midi:43}]},
  {name:'Montuno · Keys',icon:'▤',part:true,events:[0,1,1.5,2.5,3.5,4.5,5.5,6,7].map((beat,i)=>({voice:'keys',beat,notes:i%2?[52,55,60]:[48,52,55]}))},
  {name:'Charleston',icon:'⌘',events:[...hits('kick',[0,1.5,4,5.5]),...hits('snare',[2,6]),...hits('hat',[0,1,2,3,4,5,6,7])]},
  {name:"Rock 'n' Roll",icon:'ϟ',events:[...hits('hat',swung),...hits('snare',[1,3,5,7]),...Array.from({length:8},(_,i)=>({voice:'bass',beat:i,midi:[48,52,55,57][i%4]})),...hits('kick',[0,2,4,6])]},
];
export const RHYTHM_HINTS=[
  'Ровные восьмые; малый барабан на 2 и 4.',
  'Длинная и короткая доли в каждой паре; устойчивый бэкбит.',
  'Рисунок ride: пульс и короткая нота перед следующей долей.',
  'Пять ударов: три в первом такте, два во втором.',
  'Пять ударов: два в первом такте, три во втором.',
  'Ровные восьмые, синкопированный обод и мягкая басовая опора.',
  'Синкопы бас-барабана между основными долями.',
  'One drop: бас и обод на третьей доле такта.',
  'Бас-барабан на каждой доле, открытый рисунок между долями.',
  'Три доли в такте; свинговое движение ride.',
  'Учебный Mambo: синкопированный верхний рисунок и басовая опора.',
  'Учебный Calypso: ровный шаг и синкопированный рисунок между долями.',
  'Семь ударов колокольчика внутри двенадцати подразделений. Четыре крупных пульса.',
  'Третий удар трёхударной стороны на полдоли позже, чем в Son Clave.',
  'Учебный Cha-cha-cha: ровный верхний пульс и дробный ответ обода.',
  'Учебная Samba: повторяющаяся короткая пара басовых ударов и синкопы сверху.',
  'Басовая партия Tumbao: синкопированные опоры, оставляющие первую долю пустой. Это партия, а не весь стиль.',
  'Клавишная партия Montuno: повторяющийся синкопированный аккордовый рисунок. Это партия, а не весь стиль.',
  'Учебный Charleston: характерная пара атак на 1 и «и» второй доли.',
  'Учебный Rock ’n’ Roll: шаффл, бэкбит и движущийся басовый рисунок.',
];
export const RHYTHM_LEVELS=[0,0,0,1,1,1,2,1,0,1,2,2,2,2,2,2,2,2,1,1];
export const rhythmIds=level=>RHYTHMS.map((_,i)=>i).filter(i=>RHYTHM_LEVELS[i]<=level);
export const POLYRHYTHMS=[[2,3,1],[3,2,1],[3,4,1],[4,3,1],[5,4,2],[4,5,2],[5,3,2],[3,5,2],[7,4,3],[4,7,3]].map(([a,b,level])=>({a,b,level,name:`${a}:${b}`}));
export function polyEvents(pattern,cycles=3,layer='both'){
  const events=[];
  for(let cycle=0;cycle<cycles;cycle++)for(const [voice,count] of [['rim',pattern.a],['kick',pattern.b]]){
    if(layer!=='both'&&layer!==voice)continue;
    for(let i=0;i<count;i++)events.push({voice,beat:cycle*4+i*4/count,index:i});
  }
  return events.sort((a,b)=>a.beat-b.beat);
}
// PAS paradiddle family. Accent studies are authored variations, not extra PAS rudiments.
export const RUDIMENTS=[
  {name:'Single Paradiddle',sticking:'RLRRLRLL',accents:[0,4],level:0},
  {name:'Single · Back Accent',sticking:'RLRRLRLL',accents:[3,7],level:0},
  {name:'Double Paradiddle',sticking:'RLRLRRLRLRLL',accents:[0,6],level:1},
  {name:'Paradiddle-Diddle · Accent Study',sticking:'RLRRLLRLRRLL',accents:[0,2,6,8],level:1},
  {name:'Triple Paradiddle',sticking:'RLRLRLRRLRLRLRLL',accents:[0,8],level:2},
  {name:'Single · Offbeat Accent',sticking:'RLRRLRLL',accents:[1,5],level:2},
  {name:'Double · Three Accents',sticking:'RLRLRRLRLRLL',accents:[0,2,4,6,8,10],level:3},
  {name:'Triple · Displaced Accent',sticking:'RLRLRLRRLRLRLRLL',accents:[1,6,9,14],level:3},
].map(p=>({...p,beats:p.sticking.length/4,events:[...p.sticking].map((hand,i)=>({voice:'snare',beat:i/4,velocity:p.accents.includes(i)?1:.28,hand}))}));
export function rudimentScore(p){
  const n=p.sticking.length,w=n*24+24;
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 94"><rect width="100%" height="100%" rx="5" fill="#d8d5c8"/><path d="M8 53H${w-8}" stroke="#333"/>`;
  for(let i=0;i<n;i++){const x=16+i*24;svg+=`<ellipse cx="${x}" cy="53" rx="5" ry="3.5" transform="rotate(-20 ${x} 53)" fill="#202728"/><path d="M${x+4} 53V25" stroke="#202728" stroke-width="1.5"/><text x="${x}" y="82" text-anchor="middle" font-family="monospace" font-size="12">${p.sticking[i]}</text>`;if(p.accents.includes(i))svg+=`<path d="M${x-4} 10l8 3-8 3" fill="none" stroke="#202728" stroke-width="2"/>`;if(i%4!==3&&i<n-1)svg+=`<path d="M${x+4} 25h24m-24 5h24" stroke="#202728" stroke-width="3"/>`;}
  return svg+'</svg>';
}
export const NUMBER_LABELS=['1','♭2','2','♭3','3','4','♭5','♯4','5','♭6','6','♭7','7','8'];
export const NUMBER_OFFSETS={'1':0,'♭2':1,'2':2,'♭3':3,'3':4,'4':5,'♭5':6,'♯4':6,'5':7,'♭6':8,'6':9,'♭7':10,'7':11,'8':12};
export const TONE_OFFSETS={'1':0,'♭9':1,'9':2,'♯9':3,'♭3':3,'3':4,'11':5,'♯11':6,'♭5':6,'5':7,'♭13':8,'13':9,'♭7':10,'7':11};
export const TONE_PROGRAMS={
  '7':{basic:['1','5'],guide:['3','♭7'],color:[['9','♯11','13'],['♭9','♯9','♭13']]},
  maj7:{basic:['1','5'],guide:['3','7'],color:[['9','♯11','13']]},
  m7:{basic:['1','5'],guide:['♭3','♭7'],color:[['9','11','13']]},
  m7b5:{basic:['1','♭5'],guide:['♭3','♭5','♭7'],color:[['9','11','♭13']]},
  '7sus4':{basic:['1','5'],guide:['11','♭7'],color:[['9','13']]},
};
export const TONE_MODES=['basic','guide','color'];
export const MELODIES=MELODY_BANK;
export const MODES=[
  {name:'Ionian',level:0,notes:[0,2,4,5,7,9,11,12]},{name:'Dorian',level:0,notes:[0,2,3,5,7,9,10,12]},{name:'Phrygian',level:0,notes:[0,1,3,5,7,8,10,12]},{name:'Lydian',level:0,notes:[0,2,4,6,7,9,11,12]},{name:'Mixolydian',level:0,notes:[0,2,4,5,7,9,10,12]},{name:'Aeolian',level:0,notes:[0,2,3,5,7,8,10,12]},{name:'Locrian',level:0,notes:[0,1,3,5,6,8,10,12]},
  {name:'Harmonic Minor',level:1,notes:[0,2,3,5,7,8,11,12]},{name:'Phrygian Dominant',level:1,notes:[0,1,4,5,7,8,10,12]},{name:'Melodic Minor',level:1,notes:[0,2,3,5,7,9,11,12]},{name:'Lydian Dominant',level:1,notes:[0,2,4,6,7,9,10,12]},{name:'Altered',level:1,notes:[0,1,3,4,6,8,10,12]},{name:'Locrian Natural 2',level:1,notes:[0,2,3,5,6,8,10,12]},
  {name:'Whole Tone',level:2,notes:[0,2,4,6,8,10,12]},{name:'Diminished Half-Whole',level:2,notes:[0,1,3,4,6,7,9,10,12]},{name:'Diminished Whole-Half',level:2,notes:[0,2,3,5,6,8,9,11,12]},{name:'Bebop Dominant',level:2,notes:[0,2,4,5,7,9,10,11,12]},{name:'Double Harmonic',level:2,notes:[0,1,4,5,7,8,11,12]},{name:'Hungarian Minor',level:2,notes:[0,2,3,6,7,8,11,12]},
];
export const NOTE_NAMES=['C','D♭','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const ROOT_NAMES=NOTE_NAMES;
const ROOT_SPEECH=['C','D flat','D','E flat','E','F','F sharp','G','A flat','A','B flat','B'];
const QUALITY_SPEECH={'7':'seven',maj7:'major seven',m7:'minor seven',m7b5:'minor seven flat five','7sus4':'seven sus four'};
export function toneMission(quality,mode,random=Math.random,level=3){
  const program=TONE_PROGRAMS[quality],groups=program[mode];
  let required=mode==='color'?[...groups[Math.floor(random()*groups.length)]]:[...groups];
  if(mode==='color'){
    const maxCount=Math.min(level<=1?1:level===2?2:3,required.length);
    const count=1+Math.floor(random()*maxCount);
    for(let i=required.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[required[i],required[j]]=[required[j],required[i]];}
    required=required.slice(0,count);
  }
  return {quality,mode,required:[...required]};
}
export function toneAnswer(challenge,label){return {correct:challenge.required.includes(label),complete:challenge.required.every(t=>challenge.collected.includes(t)||t===label)};}
export function orderedTargets(interval,direction){return [interval];}
export function gradeNumber(challenge,label){
  const note=NUMBER_OFFSETS[label];
  if(challenge.kind==='guide')return {correct:label===challenge.target,complete:label===challenge.target};
  const correct=note===challenge.interval;
  return {correct,complete:correct,note};
}
export function obstacleRow(index,width,gap){
  gap=Math.max(gap,180);
  const center=width/2+Math.sin(index*1.6)*Math.min(30,(width-gap-60)/2);
  return [{x:0,y:-75,w:center-gap/2,h:58},{x:center+gap/2,y:-75,w:width-center-gap/2,h:58}];
}
export function touchesWall(player,wall,r=11){return player.x+r>wall.x&&player.x-r<wall.x+wall.w&&player.y+r>wall.y&&player.y-r<wall.y+wall.h;}

export function turretThreat(pilot,totalCleared,chapter=0){
  const progress=totalCleared+Math.max(0,Math.floor((chapter-1)/3));
  const unlock=pilot===0?6:pilot===1?3:2;
  if(progress<unlock)return {enabled:false,max:0,interval:99};
  return {enabled:true,max:Math.min(3,1+Math.floor((progress-unlock)/4)),interval:Math.max(6.5,13-pilot*1.25-progress*.18)};
}

export function createExpedition(api){
  const {s,audio,feedback,signal,burst,renderHud,syncPads,shipHit,listenTitle,W,getH,images,document}=api;
  let pilot=0,planet='moon',teachers=[],turrets=[],walls=[],drops=[],digits=[],special=null,queue=[],timer=5,wallTimer=3,artifactTimer=9,turretTimer=8,index=0,dropIndex=0,wallIndex=0,turretIndex=0;
  let cloak=0,shield=0,rapid=0,fuzz=0,hints=0,melodyFocus=0,rhythmFocus=0,collectCooldown=0,lastRender='',captures=[],renderedChallenge=null;
  const $=id=>document.getElementById(id);
  const random=items=>items[Math.floor(Math.random()*items.length)];
  const teach=(kind,items)=>api.intelligence?.settings.enabled?api.intelligence.pick(kind,items):random(items);
  const artifactKind=type=>type===0?'mode':type===1?'melody':type===2?'guide':type===6?'poly':type===7?'flightTones':type===8?'melody':type===9?'mode':type===10?'rhythm':type===11?'tones':type===12?'melody':null;
  const hasArtifactScene=type=>type!==3&&type!==5;
  const rouletteKinds=['mode','melody','guide','chord','poly','flightTones','tones','rhythm'];
  const rouletteLabel=kind=>({mode:'GUITAR PILOT',melody:'KEY PILOT',guide:'JAZZ BASS',chord:'CHORD RECOVERY',poly:'DRUM MACHINE',flightTones:'TRUMPETER',tones:'VIBRAPHONE',rhythm:'THE DRUMMER'})[kind];
  // Keep the deck across retries so restarting a flight does not replay the
  // same small prefix of the repertoire. Only playable entries enter this pool.
  let melodyDeck=[],melodyDeckLevel=-1,lastMelody=-1;
  const melodyPool=()=>melodyIndicesForLevel(pilot).filter(i=>(api.intelligence?.settings.genres||['jazz','classical','rock']).includes(MELODIES[i].genre||'jazz'));
  function nextMelody(){
    const pool=melodyPool();
    if(api.intelligence){lastMelody=api.intelligence.pick('melody',pool,{id:i=>MELODIES[i].id,genre:i=>MELODIES[i].genre||'jazz',progressive:true});return lastMelody;}
    if(!melodyDeck.length||melodyDeckLevel!==pilot){
      melodyDeck=[...pool];melodyDeckLevel=pilot;
      for(let i=melodyDeck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[melodyDeck[i],melodyDeck[j]]=[melodyDeck[j],melodyDeck[i]];}
      if(melodyDeck.length>1&&melodyDeck.at(-1)===lastMelody)[melodyDeck[0],melodyDeck[melodyDeck.length-1]]=[melodyDeck.at(-1),melodyDeck[0]];
    }
    lastMelody=melodyDeck.pop();return lastMelody;
  }
  function reset(level=0){pilot=level;planet=level%2?'mars':'moon';teachers=[];turrets=[];walls=[];drops=[];digits=[];special=null;queue=[];timer=5;wallTimer=level===0?99:level===1?8:level===2?7:6.5;artifactTimer=9;turretTimer=8;index=dropIndex=wallIndex=turretIndex=0;cloak=shield=rapid=fuzz=hints=melodyFocus=rhythmFocus=collectCooldown=0;render();}
  function render(){
    if(special?.result){
      const c=special,r=c.result;
      if(renderedChallenge!==c){
        $('special-panel').hidden=false;
        $('special-title').textContent=`${r.heading} · ${Math.round(r.fraction*100)}%`;
        $('special-detail').textContent=c.kind==='melody'?`Правильная мелодия: ${MELODIES[c.target].name}. Можно прослушать и продолжить, когда запомнишь.`:`${c.chordName} · нужны ${c.required.join(' → ')} · +${r.hp} HP · +${r.energy} энергии`;
        $('special-options').replaceChildren();
        const button=document.createElement('button');button.textContent='Продолжить полёт →';
        button.addEventListener('click',()=>{if(special===c)continueToneResult();});
        $('special-options').append(button);if(c.kind==='melody'){const replay=document.createElement('button');replay.textContent='↻ Услышать правильную мелодию';replay.addEventListener('click',()=>{s.listening=true;audio.melody(c.root,MELODIES[c.target],()=>{if(special===c)s.listening=false;},{full:true});});$('special-options').append(replay);}renderedChallenge=c;
      }
      return;
    }
    const stamp=JSON.stringify([planet,s.planetChoice,pilot,Math.ceil(rapid),Math.ceil(cloak),Math.ceil(shield),Math.ceil(fuzz),hints,rhythmFocus,s.listening,s.mode,special?.kind,special?.artifactType,special?.opening,special?.rollKind,special?.celebrating,Math.ceil(special?.time||0),special?.collected.length,special?.target,special?.options]);
    if(stamp===lastRender)return;lastRender=stamp;
    $('planet-name').textContent=`${s.planetChoice==='seasons'?'САД ЭХА':planet==='moon'?'ЛУНА':'МАРС'} · ${PILOTS[pilot].name}`;
    $('effects').textContent=[rapid>0?`AUTO ${Math.ceil(rapid)}s`:'',cloak>0?`GHOST ${Math.ceil(cloak)}s`:'',shield>0?`SHIELD ${Math.ceil(shield)}s`:'',fuzz>0?`FUZZ ${Math.ceil(fuzz)}s`:'',rhythmFocus?`RHYTHM FOCUS ×${rhythmFocus}`:''].filter(Boolean).join(' · ');
    $('hint').textContent=`Подсказка · ${hints}`;$('hint').disabled=!hints||s.listening||!['active','resolving'].includes(s.mode);
    $('special-panel').hidden=!special;
    $('special-panel').dataset.kind=special?.kind||'';
    if(special){
      const themeRoom=special.themeRoom?themeRoomById(special.themeRoom):null;
      $('special-title').textContent=special.kind==='reveal'?`SALVAGE CHAMBER · ${ARTIFACTS[special.artifactType].name}`:special.kind==='roulette'?'ROCK TONGUE · RANDOM MODE':special.kind==='poly'?'DRUM MACHINE · RUDIMENTS':special.kind==='rhythm'?'RHYTHM TRIAL · THE DRUMMER':special.kind==='melody'?(themeRoom?.title||'MELODY MEMORY · KEY PILOT'):special.kind==='mode'?'MODAL DRIVE · GUITAR PILOT':special.kind==='chord'?'ROCK TONGUE · HP 100%':special.kind==='guide'?'JAZZ BASS · GUIDE TONE':special.kind==='flightTones'?`TRUMPETER · ${special.toneMode.toUpperCase()} TONES · ${special.chordName}`:special.kind==='tones'?`COLOR HEARING · ${special.chordName}`:'СОБЕРИ ИНТЕРВАЛ';
      $('special-detail').textContent=special.kind==='reveal'?(special.opening?'Замки открыты · энергетический контур запущен':'Полёт удержан · коснись находки, чтобы активировать'):special.kind==='roulette'?`Барабан выбирает испытание · ${rouletteLabel(special.rollKind)}`:special.revealed?`Звучит ${specialName(special)} · ↻ повторить`:special.kind==='poly'?'Сравни акценты и нотный рисунок · две попытки':special.kind==='melody'?(themeRoom?`Угадай мелодию · шесть названий, из них The Beatles: ${special.themeRelatedCount}`:'Полёт удержан · назови тему по-английски или выбери название'):special.kind==='mode'?'Полёт удержан · узнай лад вверх или вниз':special.kind==='flightTones'?`По порядку · ${special.collected.join(' → ')||'Начни с первой ноты'} · ${special.collected.length}/${special.required.length} · ${Math.ceil(special.time)}s`:special.kind==='tones'?`Выбери весь набор · отмечено ${special.selected.length} · затем нажми ОТВЕТИТЬ`:special.pause?'Квартет вышел на поле · полёт удержан, выбери стиль или партию':special.kind==='numbers'?`Один интервал — одна цифра. Ошибка завершает попытку · ${Math.ceil(special.time)}s`:special.kind==='guide'?`Поймай услышанный тон: 3 или 7 · ${Math.ceil(special.time)}s`:`Узнай на слух · ${Math.ceil(special.time)}s`;
      const choices=special.kind==='poly'?special.options.map(i=>({id:i,name:RUDIMENTS[i].name,icon:''})):special.kind==='rhythm'?special.options.map(i=>({id:i,name:RHYTHMS[i].name,icon:RHYTHMS[i].icon})):special.kind==='melody'?special.options.map(i=>({id:i,name:MELODIES[i].name,icon:'♫'})):special.kind==='mode'?special.options.map(i=>({id:i,name:MODES[i].name,icon:'◌'})):special.kind==='chord'?special.options.map(id=>({id,name:QUALITIES[id].glyph,icon:''})):special.kind==='tones'?special.options.map(id=>({id,name:id,icon:''})):[];
      // Keep live buttons in place while the countdown changes: replacing them
      // between pointer-down and pointer-up used to discard some answers.
      if(renderedChallenge!==special){$('special-options').replaceChildren();if(special.kind==='reveal'){const open=document.createElement('button');open.className='artifact-activate';open.textContent=special.opening?'OPENING…':'ACTIVATE ARTIFACT';open.addEventListener('click',activateArtifact);$('special-options').append(open);}for(const choice of choices){const b=document.createElement('button');b.textContent=`${choice.icon} ${choice.name}`.trim();b.dataset.choice=String(choice.id);if(special.kind==='poly'){const score=document.createElement('img');score.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(rudimentScore(RUDIMENTS[choice.id]));score.alt=RUDIMENTS[choice.id].sticking;score.draggable=false;score.style.cssText='display:block;width:100%;max-height:85px;margin-top:6px';b.append(score);}b.addEventListener('click',()=>special?.kind==='tones'?toggleToneChoice(choice.id):answerSpecial(choice.id));$('special-options').append(b);}if(special.kind==='tones'){const submit=document.createElement('button');submit.className='voice-answer tone-submit';submit.textContent='ОТВЕТИТЬ';submit.addEventListener('click',answerToneSet);$('special-options').append(submit);}if(['rhythm','poly'].includes(special.kind)&&rhythmFocus){const focus=document.createElement('button');focus.className='voice-answer';focus.textContent=`◉ ZILDJIAN FOCUS ×${rhythmFocus}`;focus.addEventListener('click',useRhythmFocus);$('special-options').append(focus);}if(special.kind==='melody'){const focus=document.createElement('button');focus.className='voice-answer';focus.textContent=`50 / 50 · запас ${melodyFocus}`;focus.disabled=!melodyFocus||special.focusUsed;focus.addEventListener('click',useMelodyFocus);$('special-options').append(focus);}renderedChallenge=special;}
      if(special.kind==='tones')for(const b of $('special-options').children){if(b.dataset.choice){const chosen=special.selected.includes(b.dataset.choice);b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));}}
      if(special.celebrating){
        const relation=themeRoom?.relations?.[MELODIES[special.target].id];
        $('special-detail').textContent=`✓ ${MELODIES[special.target].name}${relation?` · ${relation}`:''} · слушаем тему до конца. Полёт подождёт.`;
        if(!$('special-options').children[0]?.dataset.continueFlight){
          const next=document.createElement('button');next.textContent='Продолжить полёт →';next.dataset.continueFlight='true';
          next.addEventListener('click',()=>{if(special?.celebrating&&['active','resolving'].includes(s.mode))endChallenge(true);});
          $('special-options').replaceChildren(next);
        }
      }
      for(const b of $('special-options').children)b.disabled=!['active','resolving'].includes(s.mode)||!!special.opening;
    }
  }
  function spawnTeacher(){
    const edge=index%4,type=index++%5,H=getH(),speed=(115+pilot*12)*PILOTS[pilot].speed;
    const x=edge===0?-40:edge===1?W+40:70+Math.random()*(W-140),y=edge===2?-45:edge===3?H+45:120+Math.random()*(H-200);
    const angle=Math.atan2(H*.62-y,W/2-x);
    teachers.push({type,x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,hp:7+pilot*2,age:0,fire:3,edge});
    feedback(`${TEACHERS[type].name} · механический хищник атакует!`);
  }
  function spawnTurret(){
    const side=turretIndex++%2?1:-1,x=side<0?35:W-35;
    turrets.push({x,y:-38,side,hp:3+pilot,age:0,fire:2.8,muzzle:0,aim:Math.PI/2});
  }
  function reward(type){
    const r=TEACHERS[type].reward;
    if(r==='hint')hints++;
    if(r==='rapid'||r==='combo')rapid=12;
    if(r==='cloak'||r==='combo')cloak=10;
    if(r==='shield')shield=10;
    feedback(TEACHERS[type].text);render();
  }
  function killTeacher(t){if(t.hp<=0)return;t.hp=0;burst(t.x,t.y,'#ffc878',35);s.score+=120;reward(t.type);renderHud();}
  function makeNumbers(c){
    const target=c.kind==='guide'?c.target:random(NUMBER_LABELS.filter(label=>NUMBER_OFFSETS[label]===c.interval));
    const distractors=NUMBER_LABELS.filter(label=>c.kind==='guide'?label!==target:NUMBER_OFFSETS[label]!==c.interval);
    c.label=target;
    digits=numberCubeLayout(target,distractors,W,getH(),Math.random,s.player);
  }
  function makeToneNumbers(c){
    const distractors=Object.keys(TONE_OFFSETS).filter(label=>!c.required.includes(label));
    const labels=[...c.required,...distractors.sort(()=>Math.random()-.5).slice(0,Math.max(7,11-c.required.length))].sort(()=>Math.random()-.5);
    const colors={basic:'#7ef5d1',guide:'#ffcb72',color:'#ff70d0'};
    digits=labels.map((label,i)=>({label,color:colors[c.toneMode],x:45+(i%4)*(W-90)/3,y:145+Math.floor(i/4)*70,vx:(i%2?1:-1)*(25+Math.random()*30),vy:(i%3?1:-1)*24,age:Math.random()*6}));
  }
  function noteName(rootPc,tone){return ROOT_NAMES[(rootPc+TONE_OFFSETS[tone])%12];}
  function makeFlightToneCubes(c){
    const labels=[...c.required.slice(c.collected.length,c.collected.length+4)];
    const distractors=ROOT_NAMES.filter(note=>!c.required.includes(note));
    digits=cubeLayout(labels,distractors,W,getH(),Math.random,s.player);
  }

  function startChallenge(kind,artifactType=null){
    if(special||s.listening)return false;
    if(!['active','resolving'].includes(s.mode))return false;
    if(kind==='tones'&&artifactType===null)artifactType=11;
    special={kind:kind,artifactType,time:pilot===0?30:pilot===1?20:16,collected:[],options:[],misses:0,pause:['rhythm','poly','melody','mode'].includes(kind),truceUntil:Date.now()+3500,beat:0,createdAt:Date.now()};
    s.bullets=[];
    if(kind==='numbers'){special.interval=random(pilot<2?[3,4,6,7]:[1,2,3,4,5,6,7,8,9,10,11,12]);special.direction=random(['up','down']);makeNumbers(special);}
    if(kind==='guide'){special.target=teach('guide',['3','7']);makeNumbers(special);}
    if(kind==='chord'){special.options=pilot<2?['maj','min','7','maj7','m7','7sus4']:Object.keys(QUALITIES);special.target=teach('chord',special.options);special.root=48+Math.floor(Math.random()*12);}
    if(kind==='rhythm'){const pool=rhythmIds(pilot);special.target=teach('rhythm',pool);const compatible=pool.filter(i=>i!==special.target&&!!RHYTHMS[i].part===!!RHYTHMS[special.target].part);special.options=[special.target,...compatible.sort(()=>Math.random()-.5).slice(0,pilot===0?5:pilot===1?7:9)].sort(()=>Math.random()-.5);}
    if(kind==='poly'){special.options=RUDIMENTS.map((_,i)=>i).filter(i=>RUDIMENTS[i].level<=pilot);special.target=teach('poly',special.options);}
    if(kind==='melody'){
      const room=themeRoomForArtifact(artifactType);
      if(room){
        const {related}=themeMelodyIndices(room,MELODIES);
        special.themeRoom=room.id;
        special.themeRelatedCount=themeRelatedCount(room,pilot);
        special.target=api.intelligence?.settings.enabled?api.intelligence.pick('themeTarget',related,{id:i=>`${room.id}:${MELODIES[i].id}`,evidence:i=>[['melody',MELODIES[i].id]]}):random(related);
        special.options=themeChallengeOptions(room,MELODIES,special.target,special.themeRelatedCount,Math.random);
      }else{
        special.target=nextMelody();
        const others=melodyPool().filter(i=>i!==special.target);
        for(let i=others.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[others[i],others[j]]=[others[j],others[i]];}
        special.options=[special.target,...others.slice(0,pilot<2?3:5)];
        for(let i=special.options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[special.options[i],special.options[j]]=[special.options[j],special.options[i]];}
      }
      special.root=(MELODIES[special.target].firstMidi??60)+(pilot<2?0:Math.floor(Math.random()*5)-2);
    }
    if(kind==='mode'){const pool=MODES.map((mode,i)=>({mode,i})).filter(item=>item.mode.level<=Math.min(2,pilot)).map(item=>item.i);special.target=random(pool);special.options=[special.target,...pool.filter(i=>i!==special.target).sort(()=>Math.random()-.5).slice(0,pilot===0?6:5)].sort(()=>Math.random()-.5);special.root=55+Math.floor(Math.random()*7);special.direction=pilot<=1?'up':random(['up','down']);}
    if(kind==='flightTones'){
      const triads=['maj','min'];
      const sevenths=['7','maj7','m7','m7b5','7sus4'];
      const extended=['maj7sharp11','m7natural9','m7b5natural9','7b9','7sharp5','m7b9'];
      const legendary=['maj7sharp11','m7natural9','m7b5natural9','7b9','7b9b13','7b5','7sharp5','7alt','m7b9','augMaj7'];
      const quality=random(pilot===0?triads:pilot===1?sevenths:pilot===2?extended:legendary);
      const modes=pilot===0?['all']:pilot===1?['basic','guide','all']:pilot===2?['basic','guide','all']:['guide','all','all'];
      const toneMode=random(modes),rootPc=Math.floor(Math.random()*12);
      const intervals=[...INTERVALS[quality]];
      const required=flightNotes(ROOT_NAMES[rootPc],intervals,toneMode,quality);
      special={...special,artifactType:7,quality,toneMode,rootPc,root:48+rootPc,chordName:`${ROOT_NAMES[rootPc]}${QUALITIES[quality].glyph}`,required,collected:[],intervals,time:45+required.length*12};
      walls=[];turrets=[];teachers=[];s.bullets=[];s.shots=[];s.drones=[];
      makeFlightToneCubes(special);
    }
    if(kind==='tones'){
      const qualities=pilot<2?['7','maj7','m7','7sus4']:Object.keys(TONE_PROGRAMS),quality=random(qualities),toneMode=artifactType===11?'color':pilot>=2?'color':random(['guide','color']),mission=toneMission(quality,toneMode,Math.random,pilot);
      special={...special,...mission,toneMode,rootPc:Math.floor(Math.random()*12)};special.root=48+special.rootPc;special.chordName=`${ROOT_NAMES[special.rootPc]}${QUALITIES[quality].glyph}`;special.pause=true;special.options=Object.keys(TONE_OFFSETS);special.selected=[];
      special.intervals=[...new Set([...INTERVALS[quality],...(toneMode==='color'?special.required.map(label=>TONE_OFFSETS[label]+12):[])])].sort((a,b)=>a-b);
    }
    replay();render();syncPads();return true;
  }
  function replay(){
    // Reveal and roulette are transition scenes, not musical questions.
    // Replay (including resume from pause) must leave their animation alone.
    if(!special||special.kind==='reveal'||special.kind==='roulette')return;
    if(special.result)return;
    if(special.celebrating){playMelodyCelebration();return;}
    const current=special,cue= current.cue=(current.cue||0)+1;s.listening=true;signal('♫ Слушай артефакт',true);render();syncPads();
    const done=()=>{if(special!==current||current.cue!==cue||current.celebrating||s.mode==='paused')return;s.listening=false;const prompt=current.kind==='numbers'?'Поймай цифру услышанного интервала':current.kind==='guide'?'3 или 7? Поймай гайд-тон':current.kind==='flightTones'?`Лови ноты ${current.toneMode.toUpperCase()} TONES для ${current.chordName}`:current.kind==='tones'?`Собери COLOR TONES для ${current.chordName}`:'Выбери услышанное';signal(prompt);render();syncPads();};
    if(special.kind==='numbers')audio.interval(60+s.route.key,special.interval,special.direction,done);
    else if(special.kind==='guide')audio.guide(60+s.route.key,special.target,done);
    else if(special.kind==='chord')audio.chordOnly(special.root,INTERVALS[special.target],done);
    else if(special.kind==='poly')audio.poly(RUDIMENTS[special.target],done);
    else if(['flightTones','tones'].includes(special.kind)){
      const play=()=>{if(special===current)audio.chordOnly(current.root,current.intervals,done);};
      if(current.announced)play();
      else{audio.announce(`Chord. ${ROOT_SPEECH[current.rootPc]} ${QUALITY_SPEECH[current.quality]||QUALITIES[current.quality].glyph}. ${current.kind==='tones'?(Math.random()<.5?'Find the color tones.':'Find the tensions.'):`Catch ${current.toneMode} tones.`}`,spoken=>{current.announced=spoken===true;play();},{voice:current.kind==='tones'?'female':'male',command:current.kind==='tones'?'female-color':`male-${current.toneMode}`});}
    }
    else if(special.kind==='melody')audio.melody(special.root,MELODIES[special.target],done);
    else if(special.kind==='mode')audio.scale(special.root,MODES[special.target],special.direction,done);
    else if(special.kind==='rhythm')audio.rhythm(RHYTHMS[special.target],done,{loops:2,onBeat:beat=>{if(special===current)current.beat=beat;}});
  }
  function specialName(c,value=c.target){return c.kind==='poly'?RUDIMENTS[value].name:c.kind==='rhythm'?RHYTHMS[value].name:c.kind==='melody'?MELODIES[value].name:c.kind==='mode'?MODES[value].name:c.kind==='chord'?(QUALITIES[value]?.glyph??value):['tones','flightTones'].includes(c.kind)?`${c.toneMode.toUpperCase()} TONES · ${c.chordName}`:c.kind==='guide'?c.target:c.label;}
  function repair(amount=1){
    const before=s.health,max=s.maxHealth||5;s.health=Math.min(max,s.health+amount);
    return s.health-before;
  }
  function recordSpecialMistake(c){
    if(!c||['reveal','roulette'].includes(c.kind))return;
    api.onMistake?.({kind:c.kind,target:c.target,...(c.kind==='melody'?{melodyId:MELODIES[c.target].id,melodyName:MELODIES[c.target].name,themeRoom:c.themeRoom}:{}),interval:c.interval,intervals:c.intervals,direction:c.direction,root:c.root??60+s.route.key,quality:c.quality,toneMode:c.toneMode,required:c.required,chordName:c.chordName});
  }
  function continueToneResult(){
    if(!special?.result||!['active','resolving'].includes(s.mode))return false;
    const c=special;audio.stop();s.listening=false;special=null;renderedChallenge=null;lastRender='';render();syncPads();
    if(c.deferredArtifacts?.length){const [type,...rest]=c.deferredArtifacts;artifact(type);if(special)special.deferredArtifacts=rest;}
    else if(s.mode==='active')api.playCue();return true;
  }
  function endChallenge(won,wrong=false,credit=null){
    const c=special;if(!c)return;
    api.intelligence?.record(c.kind,c.kind==='melody'?MELODIES[c.target].id:c.target??c.interval??`${c.quality}:${c.toneMode}`,credit??(won&&!c.misses?1:0));
    if(c.themeRoom)api.intelligence?.record('themeRoom',c.themeRoom,credit??(won&&!c.misses?1:0));
    if(!won&&!c.misses)recordSpecialMistake(c);
    audio.stop();s.listening=false;special=null;digits=[];
    if(['flightTones','tones'].includes(c.kind)){
      const fraction=credit??(won?1:c.kind==='flightTones'?c.collected.length/c.required.length:0);
      const hp=repair(fraction),energy=Math.round((c.kind==='tones'?45:40)*fraction);
      s.energy=Math.min(99,s.energy+energy);s.score+=Math.round(250*fraction);
      if(fraction>0){rapid=Math.max(rapid,14*fraction);shield=Math.max(shield,(c.kind==='tones'?12:8)*fraction);}
      const percent=Math.round(fraction*100),hpLabel=Number(hp.toFixed(2));
      const heading=won?'✓ Полный аккорд':fraction>0?'◐ Частичный результат':'✕ Неверный ответ';
      feedback(`${heading} · ${percent}% · +${hpLabel} HP · +${energy} энергии`,fraction===0);
      s.fireTimer=Math.max(s.fireTimer,4);render();renderHud();syncPads();
      // Leave the result readable and keep combat suspended until the player continues.
      special={...c,result:{fraction,heading,hp:hpLabel,energy},pause:true,selected:c.selected||[]};
      captures=[];renderedChallenge=null;lastRender='';render();syncPads();return;
    }
    if(won){s.score+=250;
      if(c.kind==='chord'){s.health=s.maxHealth||5;feedback(`${QUALITIES[c.target].glyph} · HP 100%`);}
      else if(c.kind==='rhythm'){shield=12;rapid=10;const hp=repair();feedback(`${RHYTHMS[c.target].name} · Rhythm Shield${hp?' · +1 HP':''}`);}
      else if(c.kind==='poly'){shield=10;rapid=12;const hp=repair();feedback(`${RUDIMENTS[c.target].name} · Phase Lock${hp?' · +1 HP':''}`);}
      else if(c.kind==='guide'){teachers.filter(t=>t.hp>0).forEach(killTeacher);shield=8;const hp=repair();feedback(`Guide tone ${c.target} · +${hp||0} HP · хищники нейтрализованы`);}
      else if(c.kind==='flightTones'){rapid=14;shield=8;s.energy=Math.min(99,s.energy+40);const hp=repair();feedback(`${c.toneMode.toUpperCase()} TONES · ${c.chordName}${hp?' · +1 HP':''}`);}
      else if(c.kind==='tones'){rapid=14;shield=12;s.energy=Math.min(99,s.energy+45);const hp=repair();feedback(`${c.toneMode.toUpperCase()} TONES · ${c.chordName}${hp?' · +1 HP':''}`);}
      else if(c.kind==='melody'){cloak=12;rapid=12;s.energy=Math.min(99,s.energy+35);const hp=repair(),room=c.themeRoom?themeRoomById(c.themeRoom):null;feedback(`${MELODIES[c.target].name} · ${room?'SONG ROOM':'MELODY MEMORY'}${hp?' · +1 HP':''}`);}
      else if(c.kind==='mode'){fuzz=12;rapid=14;s.energy=Math.min(99,s.energy+40);const hp=repair();feedback(`${MODES[c.target].name} · MODAL DRIVE${hp?' · +1 HP':''}`);}
      else{rapid=10;s.energy=Math.min(99,s.energy+30);feedback(`${orderedTargets(c.interval,c.direction).map(n=>n===6?'♭5 / ♯4':Object.keys(NUMBER_OFFSETS).find(k=>NUMBER_OFFSETS[k]===n)).join(' → ')} · +30 силы`);}
    }else{feedback(wrong?['tones','flightTones'].includes(c.kind)?`Гармония погасла · нужны ${c.required.join(' · ')}`:`Попытка потеряна · нужно ${c.label}`:['rhythm','chord','poly','melody','mode'].includes(c.kind)?`Это ${specialName(c)}`:'Время вышло · попробуем ещё',true);}
    s.fireTimer=Math.max(s.fireTimer,4);render();renderHud();syncPads();
    if(c.kind==='melody'){special={...c,celebrating:false,result:{fraction:won?1:0,heading:won?'✓ Верно':'✕ Запомни мелодию'},pause:true};renderedChallenge=null;lastRender='';render();syncPads();return;}
    if(c.deferredArtifacts?.length){
      const [type,...rest]=c.deferredArtifacts;artifact(type);if(special&&rest.length)special.deferredArtifacts=rest;
    }else if(s.mode==='active')api.playCue();
  }
  function answerSpecial(value){
    if(!special||special.result||special.celebrating||!['active','resolving'].includes(s.mode)||!special.options.includes(value))return;
    if(value===special.target){
      if(special.kind==='melody'){
        special.celebrating=true;playMelodyCelebration();
      }else endChallenge(true);
      return;
    }
    recordSpecialMistake(special);special.misses++;special.time=Math.max(0,special.time-3);
    if(special.misses>=2){endChallenge(false);return;}
    feedback('Мимо · осталась одна попытка',true);lastRender='';render();
  }
  function playMelodyCelebration(){
    const current=special;if(current?.kind!=='melody'||!current.celebrating)return;
    const cue=current.cue=(current.cue||0)+1;
    s.listening=true;signal(`✓ ${MELODIES[current.target].name} · звучит полная тема`,true);render();syncPads();
    audio.melody(current.root,MELODIES[current.target],()=>{if(special===current&&current.cue===cue&&s.mode!=='paused')endChallenge(true);},{full:true});
  }
  function toggleToneChoice(label){
    if(!special||special.result||special.kind!=='tones'||!['active','resolving'].includes(s.mode)||!special.options.includes(label))return;
    const index=special.selected.indexOf(label);
    if(index>=0)special.selected.splice(index,1);else special.selected.push(label);
    lastRender='';render();
  }
  function answerToneSet(){
    if(!special||special.result||special.kind!=='tones'||!['active','resolving'].includes(s.mode))return;
    if(!special.selected.length){feedback('Сначала выбери нужные тоны');return;}
    const chosen=new Set(special.selected),required=new Set(special.required);
    const correct=chosen.size===required.size&&[...required].every(label=>chosen.has(label));
    const credit=partialToneCredit(special.required,special.selected);
    endChallenge(correct,!correct,credit);
  }
  function useFocus(kind){
    if(!special||special.result||special.celebrating||special.result||special.focusUsed||!['active','resolving'].includes(s.mode))return false;
    const melody=kind==='melody';
    if(melody?special.kind!=='melody'||!melodyFocus:!['rhythm','poly'].includes(special.kind)||!rhythmFocus)return false;
    if(special.options.length<=2)return false;
    const wrong=special.options.filter(i=>i!==special.target);
    for(let i=wrong.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[wrong[i],wrong[j]]=[wrong[j],wrong[i]];}
    const remove=new Set(wrong.slice(0,Math.floor(special.options.length/2)));
    special.options=special.options.filter(i=>!remove.has(i));special.focusUsed=true;
    if(melody)melodyFocus--;else rhythmFocus--;
    renderedChallenge=null;lastRender='';feedback(`50 / 50 · осталось ${special.options.length} вариантов`);render();syncPads();return true;
  }
  function useRhythmFocus(){return useFocus('rhythm');}
  function useMelodyFocus(){return useFocus('melody');}
  function grantMelodyFocus(){melodyFocus++;renderedChallenge=null;lastRender='';feedback(`Melody Focus ×${melodyFocus}`);render();syncPads();}
  function answerSpoken(text){
    if(!special||!['melody','mode'].includes(special.kind)||!['active','resolving'].includes(s.mode))return false;const heard=String(text).toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(),items=special.kind==='melody'?MELODIES:MODES;
    const match=special.options.find(i=>(items[i].aliases||[items[i].name.toLowerCase()]).some(alias=>heard.includes(alias.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim())));
    if(match===undefined){feedback(`Не расслышал название: “${text}”`,true);return false;}answerSpecial(match);return true;
  }
  function collectNumber(label){
    if(!special||s.listening)return;const result=gradeNumber(special,label);
    collectCooldown=.6;
    const captured=digits.find(d=>d.label===label);
    if(captured){captures.push({...captured,life:.5,correct:result.correct});burst(captured.x,captured.y,result.correct?'#ffe0a2':'#ee8866',22);s.rings?.push({x:captured.x,y:captured.y,age:0});s.flash=.07;}
    if(s.intervalStats)s.intervalStats[result.correct?'caught':'wrong']++;
    endChallenge(result.correct,!result.correct);
    render();
  }
  function collectTone(label){
    if(!special||special.kind!=='tones'||s.listening)return;const c=special,result=toneAnswer(c,label),captured=digits.find(d=>d.label===label);collectCooldown=.45;
    if(captured){captures.push({...captured,life:.55,correct:result.correct});burst(captured.x,captured.y,result.correct?captured.color:'#ff596e',result.correct?34:45);s.rings?.push({x:captured.x,y:captured.y,age:0});}
    if(!result.correct){endChallenge(false,true);return;}
    c.collected.push(label);digits=digits.filter(d=>d.label!==label);s.score+=90;lastRender='';
    if(result.complete)endChallenge(true);else{feedback(`${label} · ${c.collected.length}/${c.required.length}`);render();syncPads();}
  }
  function collectFlightTone(label){
    if(!special||special.result||special.kind!=='flightTones'||s.listening)return;
    const c=special,captured=digits.find(d=>d.label===label),correct=c.required[c.collected.length]===label;
    collectCooldown=.45;
    if(captured){captures.push({...captured,life:.55,correct});burst(captured.x,captured.y,correct?'#ffd27a':'#ff596e',correct?34:45);s.rings?.push({x:captured.x,y:captured.y,age:0});}
    if(!correct){endChallenge(false,true);return;}
    c.collected.push(label);digits=digits.filter(d=>d!==captured);s.score+=90;lastRender='';
    if(c.collected.length===c.required.length)endChallenge(true);else{if(!digits.some(d=>!d.rotating&&d.label===c.required[c.collected.length]))makeFlightToneCubes(c);feedback(`${label} · ${c.collected.length}/${c.required.length}`);render();syncPads();}
  }
  function applyArtifact(type){
    const kind=artifactKind(type);
    if(type===2&&!teachers.some(t=>t.hp>0))spawnTeacher();
    if(type===3){fuzz=shield=10;feedback('Overdrive · щит и двойной урон на 10 секунд');}
    if(type===5){rhythmFocus++;feedback(`Zildjian · Rhythm Focus ×${rhythmFocus}`);renderedChallenge=null;lastRender='';render();renderHud();syncPads();return;}
    if(type===4){beginRoulette();return;}
    if(kind)startChallenge(kind,type);else{render();renderHud();syncPads();if(s.mode==='active')api.playCue();}
  }
  function beginRoulette(){
    const target=random(rouletteKinds);
    special={kind:'roulette',targetKind:target,rollKind:rouletteKinds[0],rollStep:-1,pause:true,createdAt:Date.now(),collected:[],options:[]};
    renderedChallenge=null;lastRender='';render();syncPads();
  }
  function updateRoulette(){
    const c=special,elapsed=(Date.now()-c.createdAt)/1000,stops=[0,.11,.23,.36,.51,.68,.88,1.12,1.41,1.75,2.15,2.55];
    let step=0;for(let i=1;i<stops.length;i++)if(elapsed>=stops[i])step=i;
    if(step!==c.rollStep){c.rollStep=step;c.rollKind=step===stops.length-1?c.targetKind:rouletteKinds[step%rouletteKinds.length];if(typeof audio.rouletteTick==='function')audio.rouletteTick(step===stops.length-1);lastRender='';render();}
    if(elapsed<2.82)return;
    const kind=c.targetKind;special=null;renderedChallenge=null;lastRender='';feedback(`ROCK TONGUE → ${rouletteLabel(kind)}`);startChallenge(kind,kind==='tones'?11:null);
  }
  function activateArtifact(){
    if(special?.kind!=='reveal'||special.opening||!['active','resolving'].includes(s.mode))return false;
    const reveal=special,type=reveal.artifactType;reveal.opening=true;reveal.createdAt=Date.now();renderedChallenge=null;lastRender='';render();syncPads();
    const finish=()=>{if(special!==reveal)return;special=null;renderedChallenge=null;lastRender='';s.flash=Math.max(s.flash,.18);applyArtifact(type);};
    if(typeof audio.artifactReveal==='function')audio.artifactReveal(type,finish);else finish();
    return true;
  }
  function resumeChallenge(){
    // Pausing cancels audio timers, including the opening's completion.
    if(special?.kind==='reveal'&&special.opening){special.opening=false;activateArtifact();return;}
    if(special?.kind==='melody'&&special.celebrating){playMelodyCelebration();return;}
    replay();
  }
  function artifact(type){
    if(!['active','resolving'].includes(s.mode))return;
    if(type===5){applyArtifact(type);return;}
    if(special?.celebrating||special?.result){(special.deferredArtifacts??=[]).push(type);return;}
    if(!hasArtifactScene(type)){applyArtifact(type);return;}
    audio.stop();s.listening=false;digits=[];queue=[];s.capsule=null;s.capsuleTimer=0;
    if(!hasArtifactScene(type)){applyArtifact(type);return;}
    special={kind:'reveal',artifactType:type,opening:false,pause:true,createdAt:Date.now(),collected:[],options:[]};
    renderedChallenge=null;lastRender='';feedback(`${ARTIFACTS[type].name} · находка перемещена в камеру`);render();syncPads();
  }
  function dropArtifact(type=null){if(type===null){const pool=[11,0,3,7,1,5,10,2,6,4,12,11].filter(type=>type!==12||!api.intelligence||api.intelligence.settings.genres.includes('rock'));type=pool[dropIndex++%pool.length];}drops.push({type,x:60+Math.random()*(W-120),y:110,age:0});}
  function afterHydra(){if(s.totalCleared%3===0)planet=planet==='moon'?'mars':'moon';if(!s.bookMission)queue.push('numbers');dropArtifact();render();}
  function hint(){if(!hints||s.listening||!['active','resolving'].includes(s.mode))return;hints--;if(special){feedback(`Подсказка: ${specialName(special)}`);}else if(s.capsule){feedback(s.capsule.heard===s.capsule.wanted?'Капсула совпадает · лови':'Другой интервал · пропусти');}else if(s.enemy)feedback(`Корень: ${api.degree(s.enemy.chord.offset)} · тип: ${(s.enemy.chord.qualityGlyph??QUALITIES[s.enemy.chord.quality]?.glyph??s.enemy.chord.quality)}`);render();}
  function tick(dt){
    if(!['active','resolving'].includes(s.mode))return;
    if(special?.kind==='roulette'){updateRoulette();return;}
    if(special?.pause){render();return;}
    collectCooldown=Math.max(0,collectCooldown-dt);
    captures=captures.filter(c=>(c.life-=dt)>0);
    if(special?.kind==='flightTones'){
      walls=[];turrets=[];teachers=[];
      if(!s.listening){
        special.time-=dt;
        if(special.time<=0){endChallenge(false);return;}
        for(const d of digits){
          if(d.rotating&&Math.hypot(d.x-s.player.x,d.y-s.player.y)>85)d.age+=dt;
          const face=cubeFace(d);d.label=face.label;d.nextLabel=face.next;d.turn=face.turn;
          if(!collectCooldown&&Math.hypot(d.x-s.player.x,d.y-s.player.y)<29){collectFlightTone(d.label);break;}
        }
      }
      render();return;
    }
    for(const d of drops){d.age+=dt;d.y+=dt*38;if(Math.hypot(d.x-s.player.x,d.y-s.player.y)<33){d.age=99;artifact(d.type);break;}}
    drops=drops.filter(d=>d.age<22&&d.y<getH()+35);
    if(!s.listening&&!(special?.truceUntil>Date.now())){
      cloak=Math.max(0,cloak-dt);shield=Math.max(0,shield-dt);rapid=Math.max(0,rapid-dt);fuzz=Math.max(0,fuzz-dt);
      timer-=dt;wallTimer-=dt;artifactTimer-=dt;
      if(timer<=0){if(teachers.length<3)spawnTeacher();timer=18-pilot*2;}
      if(wallTimer<=0){if(pilot>=1)walls.push(...obstacleRow(wallIndex++,W,PILOTS[pilot].obstacleGap));wallTimer=pilot===1?11:pilot===2?9.5:8.5;}
      if(!s.bookMission&&artifactTimer<=0){dropArtifact();artifactTimer=pilot===0?16:pilot===1?21:16;}
      const threat=turretThreat(pilot,s.totalCleared,s.bookMission?.chapter||0);turretTimer-=dt;
      if(threat.enabled&&turretTimer<=0&&turrets.length<threat.max){spawnTurret();turretTimer=threat.interval;}
      for(const wall of walls){wall.y+=s.groundScrollDelta??dt*42*PILOTS[pilot].speed;if(touchesWall(s.player,wall)){shipHit();s.player.tx=s.player.x=wall.x===0?wall.w+16:wall.x-16;}}
      walls=walls.filter(w=>w.y<getH()+80);
      for(const t of turrets){
        if(t.hp<=0){t.y+=s.groundScrollDelta??dt*29;continue;}t.age+=dt;t.y+=s.groundScrollDelta??dt*29*PILOTS[pilot].speed;t.muzzle=Math.max(0,t.muzzle-dt);
        t.aim=Math.atan2(s.player.y-t.y,s.player.x-t.x);
        if(Math.hypot(t.x-s.player.x,t.y-s.player.y)<29)shipHit();
        t.fire-=dt;
        if(t.fire<=0&&t.y>80&&t.y<getH()-70&&!cloak){
          const speed=78+pilot*11+Math.min(30,s.totalCleared*2),shots=pilot>=3&&s.totalCleared>=7?2:1;
          for(let i=0;i<shots;i++){const a=t.aim+(i-(shots-1)/2)*.11;s.bullets.push({x:t.x+Math.cos(a)*27,y:t.y+Math.sin(a)*27,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:5});}
          t.muzzle=.18;t.fire=Math.max(2.8,5.4-pilot*.38-Math.min(1.2,s.totalCleared*.08));
        }
      }
      turrets=turrets.filter(t=>t.y<getH()+55);
      for(const t of teachers){if(t.hp<=0)continue;t.age+=dt;t.x+=t.vx*dt;t.y+=t.vy*dt;
        if(t.x<30&&t.vx<0||t.x>W-30&&t.vx>0)t.vx*=-1;
        if(t.y<110&&t.vy<0||t.y>getH()-30&&t.vy>0)t.vy*=-1;
        if(Math.hypot(t.x-s.player.x,t.y-s.player.y)<34)shipHit();
        t.fire-=dt;if(t.fire<=0&&!cloak){const a=Math.atan2(s.player.y-t.y,s.player.x-t.x);s.bullets.push({x:t.x,y:t.y,vx:Math.cos(a)*100,vy:Math.sin(a)*100,r:5});t.fire=5;}
      }
      teachers=teachers.filter(t=>t.hp>0&&t.age<45);
      if(special){special.time-=dt;if(special.time<=0){endChallenge(false);return;}
        for(const d of digits){d.age+=dt;if(!d.cube){d.x+=(d.vx+Math.sin(d.age*2)*15)*dt;d.y+=d.vy*dt;if(d.x<30||d.x>W-30)d.vx*=-1;if(d.y<120||d.y>getH()-35)d.vy*=-1;d.x=Math.max(29,Math.min(W-29,d.x));d.y=Math.max(119,Math.min(getH()-34,d.y));}if(d.rotating){const face=cubeFace(d);d.label=face.label;d.nextLabel=face.next;d.turn=face.turn;}else if(d.faces)d.label=d.faces[Math.floor(d.age/1.7+d.phase)%d.faces.length];
          if(!collectCooldown&&Math.hypot(d.x-s.player.x,d.y-s.player.y)<36){if(special.kind==='flightTones')collectFlightTone(d.label);else if(special.kind==='tones')collectTone(d.label);else collectNumber(d.label);break;}}
      }else if(queue.length&&!s.capsule&&s.capsuleTimer<=0)startChallenge(queue.shift());
    }
    render();
  }
  function drawSprite(img,cell,cols,rows,x,y,size){if(!img?.complete||!img.naturalWidth)return;const sw=img.naturalWidth/cols,sh=img.naturalHeight/rows,scale=size/Math.max(sw,sh);api.ctx.drawImage(img,(cell%cols)*sw,Math.floor(cell/cols)*sh,sw,sh,x-sw*scale/2,y-sh*scale/2,sw*scale,sh*scale);}
  function drawFlightCube(ctx,d){
    const img=images[d.rotating?'note-drum':'note-cube'];
    if(img?.complete&&img.naturalWidth)ctx.drawImage(img,-43,-43,86,86);
    else{ctx.fillStyle='#e3bd77';ctx.fillRect(-29,-29,58,58);}
    ctx.save();ctx.translate(d.rotating?-11:-10,d.rotating?0:6);ctx.transform(1,.11,0,1,0,0);
    ctx.beginPath();ctx.ellipse(0,0,17,22,0,0,Math.PI*2);ctx.clip();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#1b1711';ctx.font=`900 ${d.label.length>2?18:24}px Georgia`;
    const turn=d.turn||0;ctx.fillText(d.label,0,-turn*46);if(turn)ctx.fillText(d.nextLabel,0,46-turn*46);
    ctx.restore();
    if(d.rotating){
      ctx.fillStyle='#101c1ee8';ctx.strokeStyle='#f2c278';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(-23,-47,46,18,4);ctx.fill();ctx.stroke();
      ctx.fillStyle='#ffdda0';ctx.font='bold 12px Georgia';ctx.textAlign='center';ctx.fillText(`↑ ${cubeFace(d).next}` ,0,-34);
    }
  }

  function physicalRelic(type){
    if(type===0||type===9)return images['artifact-guitar'];
    if(type===1||type===8)return images['artifact-keytar'];
    if(type===2)return images['crate-bass'];
    if(type===3)return images['artifact-pedal'];
    if(type===4)return images['crate-roulette'];
    if(type===5)return images['artifact-cymbal'];
    if(type===10)return images['artifact-drum-engine'];
    if(type===6)return images['artifact-rudiments'];
    if(type===7)return images['crate-trumpet'];
    if(type===11)return images['crate-vibraphone'];
    if(type===12)return images['artifact-yellow-submarine'];
    return null;
  }
  function drawRelic(d){
    const ctx=api.ctx;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(Math.sin(d.age*1.5)*.06);
    const artifact=physicalRelic(d.type);
    if(artifact?.complete&&artifact.naturalWidth){const k=76/Math.max(artifact.naturalWidth,artifact.naturalHeight);ctx.drawImage(artifact,-artifact.naturalWidth*k/2,-artifact.naturalHeight*k/2,artifact.naturalWidth*k,artifact.naturalHeight*k);}
    ctx.restore();
  }

  function draw(){const ctx=api.ctx;
    for(const w of walls){ctx.save();ctx.beginPath();ctx.rect(w.x,w.y,w.w,w.h);ctx.clip();const tex=images[planet];if(tex?.complete&&tex.naturalWidth)ctx.drawImage(tex,0,tex.naturalHeight*.35,tex.naturalWidth,tex.naturalHeight*.2,w.x,w.y,w.w,w.h);ctx.fillStyle='#4b322b66';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.restore();ctx.strokeStyle='#d2a265';ctx.lineWidth=3;ctx.strokeRect(w.x,w.y,w.w,w.h);ctx.fillStyle='#fbd492';for(let x=w.x+12;x<w.x+w.w;x+=30)ctx.fillRect(x,w.y+6,3,3);}
    for(const t of turrets){
      ctx.save();ctx.translate(t.x,t.y);
      const base=images[t.hp<=0?'turret-ruin':'turret-base'],barrel=images['turret-barrel'];
      const size=t.x<W/2?60:70;
      if(base?.complete&&base.naturalWidth)ctx.drawImage(base,-size/2,-size/2,size,size);
      if(t.hp>0){ctx.rotate(t.aim+Math.PI/2);if(barrel?.complete&&barrel.naturalWidth)ctx.drawImage(barrel,-size*.36,-size*.60,size*.72,size*.94);
        if(t.muzzle>0){ctx.fillStyle='#fff0a8';ctx.beginPath();ctx.arc(0,-size*.52,5,0,Math.PI*2);ctx.fill();}}
      ctx.restore();
    }
    for(const t of teachers){
      ctx.save();ctx.translate(t.x,t.y);ctx.rotate(Math.sin(t.age*1.7)*.08);
      const signal=['#b66c4c','#799b98','#68998f','#a45c4a','#8a8172'][t.type];
      ctx.shadowColor=signal;ctx.shadowBlur=12;drawSprite(images.teachers,t.type,5,1,0,0,108+t.type*3);ctx.shadowBlur=0;
      ctx.strokeStyle=signal;ctx.lineWidth=2;ctx.globalAlpha=.55;ctx.beginPath();ctx.arc(0,2,31+Math.sin(t.age*4)*2,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    for(const d of drops){drawRelic(d);ctx.strokeStyle=d.type>=7?`hsl(${(d.age*90+d.type*70)%360} 95% 72%)`:'#eec56a';ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=d.type>=7?18:0;ctx.beginPath();ctx.arc(d.x,d.y,29+Math.sin(d.age*5)*2,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}
    if(special?.kind==='flightTones'){
      const lit=special.collected.length,H=getH(),x=W*.82,y=H*.18;
      ctx.save();ctx.globalAlpha=.82;for(let i=0;i<4;i++){ctx.strokeStyle=`hsla(${(i*85+special.time*25)%360} 95% 68% / ${Math.min(.65,.22+lit*.08)})`;ctx.lineWidth=2+i;ctx.beginPath();ctx.arc(x,y,35+i*7+Math.sin(special.time*3+i)*2,0,Math.PI*2);ctx.stroke();}
      drawSprite(images.trumpeter,0,1,1,x,y,115);ctx.restore();
    }
    for(const d of [...digits,...captures]){
      ctx.save();ctx.translate(d.x,d.y);
      if(d.life!==undefined){const k=d.life/.5;ctx.scale(k,k);ctx.globalAlpha=k;}
      ctx.rotate(Math.sin(d.age)*.08);
      if(d.cube){drawFlightCube(ctx,d);ctx.restore();continue;}
      const brass=ctx.createLinearGradient(-26,-26,26,26);brass.addColorStop(0,'#89989a');brass.addColorStop(.35,'#30393c');brass.addColorStop(.65,'#505d60');brass.addColorStop(1,'#151a1d');
      ctx.fillStyle=brass;ctx.strokeStyle='#412d20';ctx.lineWidth=2;
      ctx.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=i%2?25:29;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#11191d';ctx.strokeStyle='#708282';ctx.beginPath();ctx.arc(0,0,21,0,Math.PI*2);ctx.fill();ctx.stroke();
      for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;ctx.fillStyle='#a3abad';ctx.beginPath();ctx.arc(Math.cos(a)*24,Math.sin(a)*24,2,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#a8b9b333';ctx.beginPath();ctx.moveTo(-19,-13);ctx.lineTo(-8,-17);ctx.moveTo(12,15);ctx.lineTo(21,9);ctx.stroke();
      ctx.shadowColor=d.color||'#9ef2dc';ctx.shadowBlur=d.color?8:2;ctx.fillStyle=d.color||'#d8e5df';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 24px monospace';ctx.fillText(d.label,0,1);ctx.restore();
    }
  }
  function arrival(target,from=1){const t=Math.min(1,Math.max(0,(Date.now()-(special?.createdAt||Date.now()))/720)),ease=1-(1-t)**3;return target+(1-ease)*W*.85*from;}
  function drawRhythmOverlay(){
    const ctx=api.ctx,H=getH(),beat=special?.beat||0,pulse=s.listening?Math.sin((audio.context?.currentTime||0)*Math.PI*110/60):0;
    ctx.save();
    if(special.kind==='poly'){
      concertBackdrop('drummergirl',true);
      concertTitle('DRUM MACHINE · RUDIMENTS');ctx.restore();return;
    }
    ctx.restore();concertPerformer('concert-drums-v65',images.drummer,'RHYTHM TRIAL');
  }
  function concertBackdrop(name,showWholeImage=false){
    const ctx=api.ctx,H=getH(),img=images[name];
    ctx.fillStyle='#080d14';ctx.fillRect(0,0,W,H);
    if(img?.complete&&img.naturalWidth){
      const cover=Math.max(W/img.naturalWidth,H/img.naturalHeight);
      const k=showWholeImage?Math.min(W/img.naturalWidth,H/img.naturalHeight):cover;
      ctx.drawImage(img,(W-img.naturalWidth*k)/2,(H-img.naturalHeight*k)/2,img.naturalWidth*k,img.naturalHeight*k);
      if(showWholeImage){
        // One portrait only. Blend its empty outer edges into the dark room;
        // never enlarge a second copy of the musician behind her.
        const x=(W-img.naturalWidth*k)/2,y=(H-img.naturalHeight*k)/2,w=img.naturalWidth*k,h=img.naturalHeight*k;
        const edge=Math.min(w*.08,24);
        for(const [from,to] of [[x,x+edge],[x+w,x+w-edge]]){
          const fade=ctx.createLinearGradient(from,0,to,0);fade.addColorStop(0,'#080d14');fade.addColorStop(1,'#080d1400');ctx.fillStyle=fade;ctx.fillRect(Math.min(from,to),y,edge,h);
        }
        if(y>0){
          for(const [from,to] of [[y,y+edge],[y+h,y+h-edge]]){
            const fade=ctx.createLinearGradient(0,from,0,to);fade.addColorStop(0,'#080d14');fade.addColorStop(1,'#080d1400');ctx.fillStyle=fade;ctx.fillRect(x,Math.min(from,to),w,edge);
          }
        }
      }
    }
  }
  function concertTitle(title){
    const ctx=api.ctx;ctx.save();ctx.fillStyle='#f2e3c9';ctx.strokeStyle='#080a0dcc';ctx.lineWidth=5;ctx.textAlign='center';ctx.font='bold 17px monospace';ctx.shadowColor='#000';ctx.shadowBlur=9;ctx.strokeText(title,W/2,34);ctx.fillText(title,W/2,34);ctx.restore();
  }
  function concertPerformer(background,portrait,title){
    const ctx=api.ctx,H=getH();ctx.save();concertBackdrop(background);
    if(background==='concert-drums-v65'){ctx.fillStyle='#050b16a6';ctx.fillRect(0,0,W,H);}
    drawSprite(portrait,0,1,1,arrival(W*.5,1),H*.53,Math.min(H*.76,W*.88));
    concertTitle(title);ctx.restore();
  }
  function drawThemeRoomOverlay(){
    const ctx=api.ctx,H=getH(),img=images['artifact-yellow-submarine'],time=(Date.now()%100000)/1000;ctx.save();
    const sea=ctx.createLinearGradient(0,0,0,H);sea.addColorStop(0,'#061427');sea.addColorStop(.48,'#073b54');sea.addColorStop(1,'#02070e');ctx.fillStyle=sea;ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=.3;for(let i=0;i<9;i++){const x=(i*79+time*(8+i%3)*5)% (W+70)-35,y=H-((i*113+time*(24+i%4)*4)%(H+100));ctx.strokeStyle=i%2?'#7be8e3':'#f5ca55';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,4+i%4,0,Math.PI*2);ctx.stroke();}
    ctx.globalAlpha=1;if(img?.complete&&img.naturalWidth){const target=Math.min(W*.82,H*.62),k=target/Math.max(img.naturalWidth,img.naturalHeight);ctx.shadowColor='#55e4df';ctx.shadowBlur=24;ctx.drawImage(img,W/2-img.naturalWidth*k/2,H*.51-img.naturalHeight*k/2,img.naturalWidth*k,img.naturalHeight*k);ctx.shadowBlur=0;}
    const vignette=ctx.createRadialGradient(W/2,H*.48,60,W/2,H*.48,Math.max(W,H)*.68);vignette.addColorStop(.5,'#0000');vignette.addColorStop(1,'#000c');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);concertTitle(themeRoomById(special.themeRoom)?.title||'SONG ROOM');ctx.restore();
  }
  function drawMelodyOverlay(){if(special?.themeRoom){drawThemeRoomOverlay();return;}concertPerformer('concert-keys-v65',images.keytarist,'MELODY MEMORY');}
  function drawModeOverlay(){concertPerformer('concert-guitar-v65',images.guitarist,'MODAL DRIVE');}
  function revealBackdrop(type){
    const kind=artifactKind(type);
    if(type===11)concertBackdrop('vibraphonist',true);
    else if(kind==='poly')concertBackdrop('drummergirl',true);
    else concertBackdrop(kind==='rhythm'?'concert-drums-v65':kind==='melody'||kind==='guide'?'concert-keys-v65':(kind==='tones'||kind==='flightTones')?'concert-trumpet-v65':'concert-guitar-v65');
  }
  function revealCrate(type){return type===2?images['crate-bass']:type===4?images['crate-roulette']:type===7?images['crate-trumpet']:type===11?images['crate-vibraphone']:null;}
  function drawArtifactReveal(){
    const ctx=api.ctx,H=getH(),type=special.artifactType,elapsed=(Date.now()-special.createdAt)/1000,pulse=.5+.5*Math.sin(elapsed*4.5),opening=!!special.opening;
    ctx.save();
    const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#05090ca8');shade.addColorStop(.55,'#06101535');shade.addColorStop(1,'#020609d8');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
    const x=W/2,y=H*.55,beam=ctx.createRadialGradient(x,y,10,x,y,Math.min(W,H)*.46);beam.addColorStop(0,opening?'#fff4c9b8':'#80ffe83d');beam.addColorStop(.55,opening?'#ffd88425':'#55d7c80c');beam.addColorStop(1,'#0000');ctx.fillStyle=beam;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=opening?'#ffe6a8':'#7ee9d0';ctx.globalAlpha=.32+pulse*.38;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x,y,105+i*24+pulse*5,35+i*11,0,0,Math.PI*2);ctx.stroke();}
    ctx.globalAlpha=1;const crate=physicalRelic(type);
    if(crate?.complete&&crate.naturalWidth){const target=Math.min(W*.72,H*.58)*(opening?1.04+pulse*.025:1),k=target/Math.max(crate.naturalWidth,crate.naturalHeight);ctx.shadowColor=opening?'#ffe0a5':'#59e8d2';ctx.shadowBlur=opening?36:12+pulse*10;ctx.drawImage(crate,x-crate.naturalWidth*k/2,y-crate.naturalHeight*k*.52,crate.naturalWidth*k,crate.naturalHeight*k);ctx.shadowBlur=0;}
    else{ctx.save();ctx.translate(x,y);ctx.scale(2.8,2.8);drawRelic({type,x:0,y:0,age:elapsed});ctx.restore();}
    if(opening){const flash=Math.max(0,1-elapsed/.84);ctx.fillStyle=`rgba(255,240,194,${flash*.34})`;ctx.fillRect(0,0,W,H);}
    concertTitle(opening?'ARTIFACT ONLINE':`TOUCH TO ACTIVATE · ${ARTIFACTS[type].name.toUpperCase()}`);ctx.restore();
  }
  function drawRouletteOverlay(){
    const ctx=api.ctx,H=getH(),elapsed=(Date.now()-special.createdAt)/1000,pulse=.5+.5*Math.sin(elapsed*13),crate=images['crate-roulette'];ctx.save();concertBackdrop('concert-guitar-v65');
    ctx.fillStyle='#05080bc7';ctx.fillRect(0,0,W,H);const x=W/2,y=H*.51;
    if(crate?.complete&&crate.naturalWidth){const target=Math.min(W*.72,H*.55),k=target/Math.max(crate.naturalWidth,crate.naturalHeight),dx=x-crate.naturalWidth*k/2,dy=y-crate.naturalHeight*k*.52,dw=crate.naturalWidth*k,dh=crate.naturalHeight*k;ctx.shadowColor='#ffbd66';ctx.shadowBlur=14+pulse*22;ctx.drawImage(crate,dx,dy,dw,dh);ctx.shadowBlur=0;}
    ctx.fillStyle='#101516e8';ctx.strokeStyle='#f0c57d';ctx.lineWidth=2;ctx.fillRect(W*.18,H*.76,W*.64,39);ctx.strokeRect(W*.18,H*.76,W*.64,39);ctx.fillStyle='#ffe4b1';ctx.textAlign='center';ctx.font='bold 15px ui-monospace,monospace';ctx.fillText(rouletteLabel(special.rollKind),x,H*.76+25);concertTitle('ROCK TONGUE · RANDOM MODE');ctx.restore();
  }
  function drawPauseOverlay(){if(special?.kind==='flightTones')return;if(special?.kind==='reveal')drawArtifactReveal();else if(special?.kind==='roulette')drawRouletteOverlay();else if(special?.kind==='melody')drawMelodyOverlay();else if(special?.kind==='mode')drawModeOverlay();else if(special?.kind==='tones'&&special.artifactType===11){concertBackdrop('vibraphonist',true);concertTitle('VIBRAPHONE · COLOR HEARING');}else if(special?.kind==='tones')concertPerformer('concert-trumpet-v65',images.trumpeter,'HARMONIC FLIGHT');else drawRhythmOverlay();}
  function hitShot(b){
    for(const t of turrets){if(t.hp>0&&Math.hypot(b.x-t.x,b.y-t.y)<24){t.hp-=fuzz?2:1;if(t.hp<=0){burst(t.x,t.y,'#ffbd73',24);s.score+=60;}return true;}}
    for(const t of teachers){if(t.hp>0&&Math.hypot(b.x-t.x,b.y-t.y)<31){if(t.hp<=(fuzz?2:1))killTeacher(t);else t.hp-=fuzz?2:1;return true;}}
    return false;
  }
  return {continueToneResult,reset,render,tick,draw,drawPauseOverlay,hitShot,replay,resumeChallenge,hint,useRhythmFocus,useMelodyFocus,grantMelodyFocus,afterHydra,startChallenge,answerSpecial,answerSpoken,collectNumber,collectTone,collectFlightTone,toggleToneChoice,answerToneSet,artifact,activateArtifact,spawnTeacher,
    get scenePaused(){return !!special?.pause;},
    get safeNoteFlight(){return special?.kind==='flightTones';},
    get pausedCombat(){return !!special?.pause||!!special?.truceUntil&&Date.now()<special.truceUntil;},
    get showScene(){return !!special?.pause;},
    get pauseKind(){return special?.pause?special.kind:null;},
    get busy(){return !!special;},get invincible(){return shield>0||cloak>0||special?.kind==='tones';},get cloaked(){return cloak>0;},get boosted(){return rapid>0;},get planet(){return planet;},get pilot(){return PILOTS[pilot];},get level(){return pilot;},
    snapshot:()=>({pilot,planet,teachers,turrets,walls,drops,digits,special,queue,cloak,shield,rapid,fuzz,hints,melodyFocus,rhythmFocus})};
}
