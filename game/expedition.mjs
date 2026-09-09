import {QUALITIES,INTERVALS} from './music.mjs';

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
  {name:'The Trumpeter',elixir:'Harmonic Flight',text:'Собери basic, guide или color tones для случайного аккорда'},
  {name:'The Key Pilot',elixir:'Melody Memory',text:'Узнай одноголосную тему по названию или голосом'},
  {name:'The Guitar Pilot',elixir:'Modal Drive',text:'Узнай лад по восходящей или нисходящей гамме'},
  {name:'The Drummer',elixir:'Rhythm Trial',text:'Узнай стиль или ритмическую партию'},
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
export const MELODIES=[
  // Recognition excerpts checked against user-provided Real Book 5th ed., printed pages 9,18,36,51.
  {name:'Afro Blue',aliases:['afro blue'],notes:[5,8,7,8,7,10,5],beats:[1,1.5,.5,3,1.5,1.5,2]},
  {name:'All the Things You Are',aliases:['all the things you are','all things you are'],notes:[8,13,12,5,5,5,5,5,10,3],beats:[4,3,1,1,1,1,1,1,2,1]},
  {name:'Autumn Leaves',aliases:['autumn leaves'],notes:[4,6,7,12,2,4,6,11,11],beats:[1,1,1,5,1,1,1,2,3]},
  {name:'Blue Bossa',aliases:['blue bossa','blue bosa'],notes:[7,19,17,15,14,12,10,8,19,17],beats:[1,1.5,.5,.5,1,3.5,1,2,1.5,4.5]},
  {name:'When the Saints',aliases:['when the saints','saints','when the saints go marching in'],notes:[0,4,5,7,0,4,5,7,0,4,5,7,4,0,4,2],beats:[.5,.5,.5,1,.5,.5,.5,1,.5,.5,.5,.75,.75,.75,.5,1.5]},
  {name:'Amazing Grace',aliases:['amazing grace'],notes:[7,0,4,0,4,2,0,9,7],beats:[.6,1.1,.45,.45,1.1,.6,1.1,.6,1.5]},
  {name:'Ode to Joy',aliases:['ode to joy','ode joy'],notes:[4,4,5,7,7,5,4,2,0,0,2,4,4,2,2],beats:[.55,.55,.55,.55,.55,.55,.55,.55,.55,.55,.55,.55,.8,.28,1.2]},
  {name:'Greensleeves',aliases:['greensleeves','green sleeves'],notes:[9,0,2,4,5,4,2,11,7,9,11,0,9,9],beats:[.55,1,.55,.8,.55,.55,.8,.55,.9,.55,.55,.8,.55,1.2]},
];
export const MODES=[
  {name:'Ionian',level:0,notes:[0,2,4,5,7,9,11,12]},{name:'Dorian',level:0,notes:[0,2,3,5,7,9,10,12]},{name:'Phrygian',level:0,notes:[0,1,3,5,7,8,10,12]},{name:'Lydian',level:0,notes:[0,2,4,6,7,9,11,12]},{name:'Mixolydian',level:0,notes:[0,2,4,5,7,9,10,12]},{name:'Aeolian',level:0,notes:[0,2,3,5,7,8,10,12]},{name:'Locrian',level:0,notes:[0,1,3,5,6,8,10,12]},
  {name:'Harmonic Minor',level:1,notes:[0,2,3,5,7,8,11,12]},{name:'Phrygian Dominant',level:1,notes:[0,1,4,5,7,8,10,12]},{name:'Melodic Minor',level:1,notes:[0,2,3,5,7,9,11,12]},{name:'Lydian Dominant',level:1,notes:[0,2,4,6,7,9,10,12]},{name:'Altered',level:1,notes:[0,1,3,4,6,8,10,12]},{name:'Locrian Natural 2',level:1,notes:[0,2,3,5,6,8,10,12]},
  {name:'Whole Tone',level:2,notes:[0,2,4,6,8,10,12]},{name:'Diminished Half-Whole',level:2,notes:[0,1,3,4,6,7,9,10,12]},{name:'Diminished Whole-Half',level:2,notes:[0,2,3,5,6,8,9,11,12]},{name:'Bebop Dominant',level:2,notes:[0,2,4,5,7,9,10,11,12]},{name:'Double Harmonic',level:2,notes:[0,1,4,5,7,8,11,12]},{name:'Hungarian Minor',level:2,notes:[0,2,3,6,7,8,11,12]},
];
const ROOT_NAMES=['C','D♭','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const QUALITY_SPEECH={'7':'seven',maj7:'major seven',m7:'minor seven',m7b5:'minor seven flat five','7sus4':'seven sus four'};
export function toneMission(quality,mode,random=Math.random){
  const program=TONE_PROGRAMS[quality],groups=program[mode],required=mode==='color'?groups[Math.floor(random()*groups.length)]:groups;
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
  const center=width/2+Math.sin(index*1.6)*(width-gap-60)/2;
  return [{x:0,y:-75,w:center-gap/2,h:58},{x:center+gap/2,y:-75,w:width-center-gap/2,h:58}];
}
export function touchesWall(player,wall,r=11){return player.x+r>wall.x&&player.x-r<wall.x+wall.w&&player.y+r>wall.y&&player.y-r<wall.y+wall.h;}

export function createExpedition(api){
  const {s,audio,feedback,signal,burst,renderHud,syncPads,shipHit,listenTitle,W,getH,images,document}=api;
  let pilot=0,planet='moon',teachers=[],walls=[],drops=[],digits=[],special=null,queue=[],timer=5,wallTimer=3,artifactTimer=9,index=0,dropIndex=0,wallIndex=0;
  let cloak=0,shield=0,rapid=0,fuzz=0,hints=0,rhythmFocus=0,collectCooldown=0,lastRender='',captures=[],renderedChallenge=null;
  const $=id=>document.getElementById(id);
  const random=items=>items[Math.floor(Math.random()*items.length)];
  // Keep the deck across retries so restarting a flight does not replay the
  // same small prefix of the repertoire. Only playable entries enter this pool.
  let melodyDeck=[],lastMelody=-1;
  function nextMelody(){
    if(!melodyDeck.length){
      melodyDeck=MELODIES.map((_,i)=>i);
      for(let i=melodyDeck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[melodyDeck[i],melodyDeck[j]]=[melodyDeck[j],melodyDeck[i]];}
      if(melodyDeck.length>1&&melodyDeck.at(-1)===lastMelody)[melodyDeck[0],melodyDeck[melodyDeck.length-1]]=[melodyDeck.at(-1),melodyDeck[0]];
    }
    lastMelody=melodyDeck.pop();return lastMelody;
  }
  function reset(level=0){pilot=level;planet=level%2?'mars':'moon';teachers=[];walls=[];drops=[];digits=[];special=null;queue=[];timer=5;wallTimer=3;artifactTimer=9;index=dropIndex=wallIndex=0;cloak=shield=rapid=fuzz=hints=rhythmFocus=collectCooldown=0;render();}
  function render(){
    const stamp=JSON.stringify([planet,pilot,Math.ceil(rapid),Math.ceil(cloak),Math.ceil(shield),Math.ceil(fuzz),hints,rhythmFocus,s.listening,s.mode,special?.kind,Math.ceil(special?.time||0),special?.collected.length,special?.target,special?.options]);
    if(stamp===lastRender)return;lastRender=stamp;
    $('planet-name').textContent=`${planet==='moon'?'ЛУНА':'МАРС'} · ${PILOTS[pilot].name}`;
    $('effects').textContent=[rapid>0?`AUTO ${Math.ceil(rapid)}s`:'',cloak>0?`GHOST ${Math.ceil(cloak)}s`:'',shield>0?`SHIELD ${Math.ceil(shield)}s`:'',fuzz>0?`FUZZ ${Math.ceil(fuzz)}s`:'',rhythmFocus?`RHYTHM FOCUS ×${rhythmFocus}`:''].filter(Boolean).join(' · ');
    $('hint').textContent=`Подсказка · ${hints}`;$('hint').disabled=!hints||s.listening||!['active','resolving'].includes(s.mode);
    $('special-panel').hidden=!special;
    if(special){
      $('special-title').textContent=special.kind==='poly'?'DRUM MACHINE · RUDIMENTS':special.kind==='rhythm'?'RHYTHM TRIAL · THE DRUMMER':special.kind==='melody'?'MELODY MEMORY · KEY PILOT':special.kind==='mode'?'MODAL DRIVE · GUITAR PILOT':special.kind==='chord'?'ROCK TONGUE · HP 100%':special.kind==='guide'?'JAZZ BASS · GUIDE TONE':special.kind==='tones'?`${special.toneMode.toUpperCase()} TONES · ${special.chordName}`:'СОБЕРИ ИНТЕРВАЛ';
      $('special-detail').textContent=special.revealed?`Звучит ${specialName(special)} · ↻ повторить`:special.kind==='poly'?'Сравни акценты и нотный рисунок · две попытки':special.kind==='melody'?'Полёт удержан · назови тему по-английски или выбери название':special.kind==='mode'?'Полёт удержан · узнай лад вверх или вниз':special.pause?'Квартет вышел на поле · полёт удержан, выбери стиль или партию':special.kind==='tones'?`Трубач просит по-английски · собрано ${special.collected.length}/${special.required.length} · ошибка гасит режим`:special.kind==='numbers'?`Один интервал — одна цифра. Ошибка завершает попытку · ${Math.ceil(special.time)}s`:special.kind==='guide'?`Поймай услышанный тон: 3 или 7 · ${Math.ceil(special.time)}s`:`Узнай на слух · ${Math.ceil(special.time)}s`;
      const choices=special.kind==='poly'?special.options.map(i=>({id:i,name:RUDIMENTS[i].name,icon:''})):special.kind==='rhythm'?special.options.map(i=>({id:i,name:RHYTHMS[i].name,icon:RHYTHMS[i].icon})):special.kind==='melody'?special.options.map(i=>({id:i,name:MELODIES[i].name,icon:'♫'})):special.kind==='mode'?special.options.map(i=>({id:i,name:MODES[i].name,icon:'◌'})):special.kind==='chord'?special.options.map(id=>({id,name:QUALITIES[id].glyph,icon:''})):[];
      // Keep live buttons in place while the countdown changes: replacing them
      // between pointer-down and pointer-up used to discard some answers.
      if(renderedChallenge!==special){$('special-options').replaceChildren();for(const choice of choices){const b=document.createElement('button');b.textContent=`${choice.icon} ${choice.name}`.trim();if(special.kind==='poly'){const score=document.createElement('img');score.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(rudimentScore(RUDIMENTS[choice.id]));score.alt=RUDIMENTS[choice.id].sticking;score.style.cssText='display:block;width:100%;max-height:85px;margin-top:6px';b.append(score);}b.addEventListener('click',()=>answerSpecial(choice.id));$('special-options').append(b);}if(special.kind==='rhythm'&&rhythmFocus){const focus=document.createElement('button');focus.className='voice-answer';focus.textContent=`◉ ZILDJIAN FOCUS ×${rhythmFocus}`;focus.addEventListener('click',useRhythmFocus);$('special-options').append(focus);}if(['melody','mode'].includes(special.kind)){const mic=document.createElement('button');mic.className='voice-answer';mic.textContent=special.kind==='melody'?'🎙 SAY TITLE':'🎙 SAY MODE';mic.addEventListener('click',listenTitle);$('special-options').append(mic);}renderedChallenge=special;}
      for(const b of $('special-options').children)b.disabled=!['active','resolving'].includes(s.mode);
    }
  }
  function spawnTeacher(){
    const edge=index%4,type=index++%5,H=getH(),speed=(115+pilot*12)*PILOTS[pilot].speed;
    const x=edge===0?-40:edge===1?W+40:70+Math.random()*(W-140),y=edge===2?-45:edge===3?H+45:120+Math.random()*(H-200);
    const angle=Math.atan2(H*.62-y,W/2-x);
    teachers.push({type,x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,hp:7+pilot*2,age:0,fire:3,edge});
    feedback(`${TEACHERS[type].name} · механический хищник атакует!`);
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
    const labels=[target,...distractors.sort(()=>Math.random()-.5).slice(0,pilot<2?7:11)].sort(()=>Math.random()-.5);
    c.label=target;
    digits=labels.map((label,i)=>({label,x:45+(i%4)*(W-90)/3,y:145+Math.floor(i/4)*70,vx:(i%2?1:-1)*(22+Math.random()*25),vy:(i%3?1:-1)*22,age:Math.random()*6}));
  }
  function makeToneNumbers(c){
    const distractors=Object.keys(TONE_OFFSETS).filter(label=>!c.required.includes(label));
    const labels=[...c.required,...distractors.sort(()=>Math.random()-.5).slice(0,Math.max(7,11-c.required.length))].sort(()=>Math.random()-.5);
    const colors={basic:'#7ef5d1',guide:'#ffcb72',color:'#ff70d0'};
    digits=labels.map((label,i)=>({label,color:colors[c.toneMode],x:45+(i%4)*(W-90)/3,y:145+Math.floor(i/4)*70,vx:(i%2?1:-1)*(25+Math.random()*30),vy:(i%3?1:-1)*24,age:Math.random()*6}));
  }
  function startChallenge(kind){
    if(special||s.listening)return false;
    if(!['active','resolving'].includes(s.mode))return false;
    special={kind:kind,time:pilot===0?30:pilot===1?20:16,collected:[],options:[],misses:0,pause:['rhythm','poly','melody','mode'].includes(kind),beat:0,createdAt:Date.now()};
    s.bullets=[];
    if(kind==='numbers'){special.interval=random(pilot<2?[3,4,6,7]:[1,2,3,4,5,6,7,8,9,10,11,12]);special.direction=random(['up','down']);makeNumbers(special);}
    if(kind==='guide'){special.target=random(['3','7']);makeNumbers(special);}
    if(kind==='chord'){special.options=pilot<2?['maj','min','7','maj7','m7','7sus4']:Object.keys(QUALITIES);special.target=random(special.options);special.root=48+Math.floor(Math.random()*12);}
    if(kind==='rhythm'){const pool=rhythmIds(pilot);special.target=random(pool);const compatible=pool.filter(i=>i!==special.target&&!!RHYTHMS[i].part===!!RHYTHMS[special.target].part);special.options=[special.target,...compatible.sort(()=>Math.random()-.5).slice(0,pilot===0?5:pilot===1?7:9)].sort(()=>Math.random()-.5);}
    if(kind==='poly'){special.options=RUDIMENTS.map((_,i)=>i).filter(i=>RUDIMENTS[i].level<=pilot);special.target=random(special.options);}
    if(kind==='melody'){
      special.target=nextMelody();
      const others=MELODIES.map((_,i)=>i).filter(i=>i!==special.target);
      for(let i=others.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[others[i],others[j]]=[others[j],others[i]];}
      special.options=[special.target,...others.slice(0,pilot<2?3:5)];
      for(let i=special.options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[special.options[i],special.options[j]]=[special.options[j],special.options[i]];}
      special.root=pilot<2?60:57+Math.floor(Math.random()*6);
    }
    if(kind==='mode'){const pool=MODES.map((mode,i)=>({mode,i})).filter(item=>item.mode.level<=Math.min(2,pilot)).map(item=>item.i);special.target=random(pool);special.options=[special.target,...pool.filter(i=>i!==special.target).sort(()=>Math.random()-.5).slice(0,pilot===0?6:5)].sort(()=>Math.random()-.5);special.root=55+Math.floor(Math.random()*7);special.direction=pilot===0?'up':random(['up','down']);}
    if(kind==='tones'){
      const qualities=pilot<2?['7','maj7','m7','7sus4']:Object.keys(TONE_PROGRAMS),quality=random(qualities),toneMode=random(TONE_MODES),mission=toneMission(quality,toneMode);
      special={...special,...mission,toneMode,rootPc:Math.floor(Math.random()*12)};special.root=48+special.rootPc;special.chordName=`${ROOT_NAMES[special.rootPc]}${QUALITIES[quality].glyph}`;special.pause=false;makeToneNumbers(special);
    }
    replay();render();syncPads();return true;
  }
  function replay(){
    if(!special)return;const current=special;s.listening=true;signal('♫ Слушай артефакт',true);render();syncPads();
    const done=()=>{if(special!==current||s.mode==='paused')return;s.listening=false;signal(current.kind==='numbers'?'Поймай цифру услышанного интервала':current.kind==='guide'?'3 или 7? Поймай гайд-тон':current.kind==='tones'?`Собери ${current.toneMode.toUpperCase()} TONES для ${current.chordName}`:'Выбери услышанное');render();syncPads();};
    if(special.kind==='numbers')audio.interval(60+s.route.key,special.interval,special.direction,done);
    else if(special.kind==='guide')audio.guide(60+s.route.key,special.target,done);
    else if(special.kind==='chord')audio.chordOnly(special.root,INTERVALS[special.target],done);
    else if(special.kind==='poly')audio.poly(RUDIMENTS[special.target],done);
    else if(special.kind==='tones')audio.announce(`${ROOT_NAMES[special.rootPc]} ${QUALITY_SPEECH[special.quality]}. Give me ${special.toneMode} tones, man.`,()=>{if(special===current)audio.trumpetChord(special.root,INTERVALS[special.quality],done);});
    else if(special.kind==='melody')audio.melody(special.root,MELODIES[special.target],done);
    else if(special.kind==='mode')audio.scale(special.root,MODES[special.target],special.direction,done);
    else audio.rhythm(RHYTHMS[special.target],done,{loops:2,onBeat:beat=>{if(special===current)current.beat=beat;}});
  }
  function specialName(c,value=c.target){return c.kind==='poly'?RUDIMENTS[value].name:c.kind==='rhythm'?RHYTHMS[value].name:c.kind==='melody'?MELODIES[value].name:c.kind==='mode'?MODES[value].name:c.kind==='chord'?QUALITIES[value].glyph:c.kind==='tones'?`${c.toneMode.toUpperCase()} TONES · ${c.chordName}`:c.kind==='guide'?c.target:c.label;}
  function endChallenge(won,wrong=false){
    const c=special;if(!c)return;
    audio.stop();s.listening=false;special=null;digits=[];
    if(won){s.score+=250;
      if(c.kind==='chord'){s.health=s.maxHealth||5;feedback(`${QUALITIES[c.target].glyph} · HP 100%`);}
      else if(c.kind==='rhythm'){shield=12;rapid=10;feedback(`${RHYTHMS[c.target].name} · Rhythm Shield`);}
      else if(c.kind==='poly'){shield=10;rapid=12;feedback(`${RUDIMENTS[c.target].name} · Phase Lock`);}
      else if(c.kind==='guide'){teachers.filter(t=>t.hp>0).forEach(killTeacher);shield=8;feedback(`Guide tone ${c.target} · механические хищники нейтрализованы`);}
      else if(c.kind==='tones'){rapid=14;shield=12;s.energy=Math.min(99,s.energy+45);feedback(`${c.toneMode.toUpperCase()} TONES · ${c.chordName} · HARMONIC FLIGHT`);}
      else if(c.kind==='melody'){cloak=12;rapid=12;s.energy=Math.min(99,s.energy+35);feedback(`${MELODIES[c.target].name} · MELODY MEMORY`);}
      else if(c.kind==='mode'){fuzz=12;rapid=14;s.energy=Math.min(99,s.energy+40);feedback(`${MODES[c.target].name} · MODAL DRIVE`);}
      else{rapid=10;s.energy=Math.min(99,s.energy+30);feedback(`${orderedTargets(c.interval,c.direction).map(n=>n===6?'♭5 / ♯4':Object.keys(NUMBER_OFFSETS).find(k=>NUMBER_OFFSETS[k]===n)).join(' → ')} · +30 силы`);}
    }else{feedback(wrong?c.kind==='tones'?`Гармония погасла · нужны ${c.required.join(' · ')}`:`Попытка потеряна · нужно ${c.label}`:['rhythm','chord','poly','melody','mode'].includes(c.kind)?`Это ${specialName(c)}`:'Время вышло · попробуем ещё',true);}
    s.fireTimer=Math.max(s.fireTimer,4);render();renderHud();syncPads();
    if(s.mode==='active')api.playCue();
  }
  function answerSpecial(value){
    if(!special||!['active','resolving'].includes(s.mode)||!special.options.includes(value))return;
    if(value===special.target){endChallenge(true);return;}
    special.misses++;special.time=Math.max(0,special.time-3);
    if(special.misses>=2){endChallenge(false);return;}
    feedback('Мимо · осталась одна попытка',true);lastRender='';render();
  }
  function useRhythmFocus(){
    if(!special||special.kind!=='rhythm'||!rhythmFocus||!['active','resolving'].includes(s.mode))return false;
    const wrong=special.options.filter(i=>i!==special.target),remove=new Set(wrong.slice().sort(()=>Math.random()-.5).slice(0,Math.ceil(wrong.length/2)));
    special.options=special.options.filter(i=>!remove.has(i));rhythmFocus--;renderedChallenge=null;lastRender='';
    feedback(`Zildjian Focus · осталось ${special.options.length} вариантов`);render();syncPads();return true;
  }
  function answerSpoken(text){
    if(!special||!['melody','mode'].includes(special.kind)||!['active','resolving'].includes(s.mode))return false;const heard=String(text).toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(),items=special.kind==='melody'?MELODIES:MODES;
    const match=special.options.find(i=>(items[i].aliases||[items[i].name.toLowerCase()]).some(alias=>heard.includes(alias)));
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
  function artifact(type){
    feedback(`${ARTIFACTS[type].name} · ${ARTIFACTS[type].elixir}`);
    if(type===2){if(!teachers.some(t=>t.hp>0))spawnTeacher();}
    if(type===3){fuzz=shield=10;}
    if(type===5){rhythmFocus++;feedback(`Zildjian · Rhythm Focus ×${rhythmFocus}`);}
    if([0,1,2,4,6,7,8,9,10].includes(type)&&['active','resolving'].includes(s.mode)){
      audio.stop();s.listening=false;special=null;digits=[];queue=[];s.capsule=null;s.capsuleTimer=0;
      startChallenge(type===0?'mode':type===1?'melody':type===2?'guide':type===4?'chord':type===6?'poly':type===7?'tones':type===8?'melody':type===9?'mode':'rhythm');
    }
    render();
  }
  function dropArtifact(type=null){if(type===null){const pool=pilot===0?[0,1,2,3,4,5,6,9,10]:ARTIFACTS.map((_,i)=>i);type=pool[dropIndex++%pool.length];}drops.push({type,x:60+Math.random()*(W-120),y:110,age:0});}
  function afterHydra(){if(s.totalCleared%3===0)planet=planet==='moon'?'mars':'moon';queue.push('numbers');dropArtifact();render();}
  function hint(){if(!hints||s.listening||!['active','resolving'].includes(s.mode))return;hints--;if(special){feedback(`Подсказка: ${specialName(special)}`);}else if(s.capsule){feedback(s.capsule.heard===s.capsule.wanted?'Капсула совпадает · лови':'Другой интервал · пропусти');}else if(s.enemy)feedback(`Корень: ${api.degree(s.enemy.chord.offset)} · тип: ${QUALITIES[s.enemy.chord.quality].glyph}`);render();}
  function tick(dt){
    if(!['active','resolving'].includes(s.mode))return;
    if(special?.pause){render();return;}
    collectCooldown=Math.max(0,collectCooldown-dt);
    captures=captures.filter(c=>(c.life-=dt)>0);
    for(const d of drops){d.age+=dt;d.y+=dt*38;if(Math.hypot(d.x-s.player.x,d.y-s.player.y)<33){d.age=99;artifact(d.type);break;}}
    drops=drops.filter(d=>d.age<22&&d.y<getH()+35);
    if(!s.listening){
      cloak=Math.max(0,cloak-dt);shield=Math.max(0,shield-dt);rapid=Math.max(0,rapid-dt);fuzz=Math.max(0,fuzz-dt);
      timer-=dt;wallTimer-=dt;artifactTimer-=dt;
      if(timer<=0){if(teachers.length<3)spawnTeacher();timer=18-pilot*2;}
      if(wallTimer<=0){if(pilot>=1)walls.push(...obstacleRow(wallIndex++,W,PILOTS[pilot].obstacleGap));wallTimer=pilot===1?7:6;}
      if(!s.bookMission&&artifactTimer<=0){dropArtifact();artifactTimer=pilot===0?16:pilot===1?21:16;}
      for(const wall of walls){wall.y+=dt*42*PILOTS[pilot].speed;if(touchesWall(s.player,wall)){shipHit();s.player.tx=s.player.x=wall.x===0?wall.w+16:wall.x-16;}}
      walls=walls.filter(w=>w.y<getH()+80);
      for(const t of teachers){if(t.hp<=0)continue;t.age+=dt;t.x+=t.vx*dt;t.y+=t.vy*dt;
        if(t.x<30&&t.vx<0||t.x>W-30&&t.vx>0)t.vx*=-1;
        if(t.y<110&&t.vy<0||t.y>getH()-30&&t.vy>0)t.vy*=-1;
        if(Math.hypot(t.x-s.player.x,t.y-s.player.y)<34)shipHit();
        t.fire-=dt;if(t.fire<=0&&!cloak){const a=Math.atan2(s.player.y-t.y,s.player.x-t.x);s.bullets.push({x:t.x,y:t.y,vx:Math.cos(a)*100,vy:Math.sin(a)*100,r:5});t.fire=5;}
      }
      teachers=teachers.filter(t=>t.hp>0&&t.age<45);
      if(special){special.time-=dt;if(special.time<=0){endChallenge(false);return;}
        for(const d of digits){d.age+=dt;d.x+=(d.vx+Math.sin(d.age*2)*15)*dt;d.y+=d.vy*dt;if(d.x<30||d.x>W-30)d.vx*=-1;if(d.y<120||d.y>getH()-35)d.vy*=-1;d.x=Math.max(29,Math.min(W-29,d.x));d.y=Math.max(119,Math.min(getH()-34,d.y));
          if(!collectCooldown&&Math.hypot(d.x-s.player.x,d.y-s.player.y)<36){if(special.kind==='tones')collectTone(d.label);else collectNumber(d.label);break;}}
      }else if(queue.length&&!s.capsule&&s.capsuleTimer<=0)startChallenge(queue.shift());
    }
    render();
  }
  function drawSprite(img,cell,cols,rows,x,y,size){if(!img?.complete||!img.naturalWidth)return;const sw=img.naturalWidth/cols,sh=img.naturalHeight/rows,scale=size/Math.max(sw,sh);api.ctx.drawImage(img,(cell%cols)*sw,Math.floor(cell/cols)*sh,sw,sh,x-sw*scale/2,y-sh*scale/2,sw*scale,sh*scale);}
  function drawRelic(d){
    const ctx=api.ctx,hue=[292,192,150,12,345,48,185,34,192,292,12][d.type];
    ctx.save();ctx.translate(d.x,d.y);ctx.rotate(Math.sin(d.age*1.5)*.08);
    ctx.shadowColor=`hsl(${hue} 82% 58%)`;ctx.shadowBlur=17;
    ctx.fillStyle='#182325';ctx.beginPath();ctx.roundRect(-31,-27,62,54,7);ctx.fill();ctx.shadowBlur=0;
    const wood=ctx.createLinearGradient(-25,-20,25,20);wood.addColorStop(0,'#2a2924');wood.addColorStop(.48,'#66523a');wood.addColorStop(1,'#252b28');
    ctx.fillStyle=wood;ctx.fillRect(-25,-21,50,42);
    ctx.strokeStyle='#151a19';ctx.lineWidth=2;for(let y=-16;y<21;y+=7){ctx.beginPath();ctx.moveTo(-25,y);ctx.lineTo(25,y+2);ctx.stroke();}
    const copper=ctx.createLinearGradient(-31,0,31,0);copper.addColorStop(0,'#263b38');copper.addColorStop(.35,'#b56d42');copper.addColorStop(.65,'#69402f');copper.addColorStop(1,'#29433f');
    ctx.fillStyle=copper;for(const x of [-29,22])ctx.fillRect(x,-25,7,50);ctx.fillRect(-29,-25,58,6);ctx.fillRect(-29,19,58,6);
    ctx.fillStyle='#b7ad8d';for(const x of [-25,25])for(const y of [-21,21]){ctx.beginPath();ctx.arc(x,y,2.4,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#30271f';ctx.stroke();}
    ctx.fillStyle='#101719';ctx.fillRect(-20,-12,40,24);ctx.strokeStyle='#8b866f';ctx.lineWidth=1.5;ctx.strokeRect(-20,-12,40,24);
    ctx.fillStyle='#d8d3bd';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(['GTR','KEY','BASS','FX','CHRD','FOCUS','DRUM','HORN','KEY','GTR','BEAT'][d.type],0,0);
    ctx.strokeStyle='#d2c5a355';ctx.beginPath();ctx.moveTo(-16,15);ctx.lineTo(-5,12);ctx.moveTo(7,-18);ctx.lineTo(16,-21);ctx.stroke();
    ctx.fillStyle=`hsl(${hue} 88% ${55+Math.sin(d.age*5)*13}%)`;ctx.beginPath();ctx.arc(0,18,4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=`hsla(${hue} 90% 66% / .55)`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,38+Math.sin(d.age*4)*2,20,d.age*.5,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  function draw(){const ctx=api.ctx;
    for(const w of walls){ctx.save();ctx.beginPath();ctx.rect(w.x,w.y,w.w,w.h);ctx.clip();const tex=images[planet];if(tex?.complete&&tex.naturalWidth)ctx.drawImage(tex,0,tex.naturalHeight*.35,tex.naturalWidth,tex.naturalHeight*.2,w.x,w.y,w.w,w.h);ctx.fillStyle='#4b322b66';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.restore();ctx.strokeStyle='#d2a265';ctx.lineWidth=3;ctx.strokeRect(w.x,w.y,w.w,w.h);ctx.fillStyle='#fbd492';for(let x=w.x+12;x<w.x+w.w;x+=30)ctx.fillRect(x,w.y+6,3,3);}
    for(const t of teachers){
      ctx.save();ctx.translate(t.x,t.y);ctx.rotate(Math.sin(t.age*1.7)*.08);
      const signal=['#b66c4c','#799b98','#68998f','#a45c4a','#8a8172'][t.type];
      ctx.shadowColor=signal;ctx.shadowBlur=12;drawSprite(images.teachers,t.type,5,1,0,0,108+t.type*3);ctx.shadowBlur=0;
      ctx.strokeStyle=signal;ctx.lineWidth=2;ctx.globalAlpha=.55;ctx.beginPath();ctx.arc(0,2,31+Math.sin(t.age*4)*2,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    for(const d of drops){drawRelic(d);ctx.strokeStyle=d.type>=7?`hsl(${(d.age*90+d.type*70)%360} 95% 72%)`:'#eec56a';ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=d.type>=7?18:0;ctx.beginPath();ctx.arc(d.x,d.y,29+Math.sin(d.age*5)*2,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#ffe0a2';ctx.textAlign='center';ctx.font='10px system-ui';ctx.fillText(ARTIFACTS[d.type].name,d.x,d.y+39);}
    if(special?.kind==='tones'){
      const lit=special.collected.length,H=getH(),x=W*.76,y=H*.34;
      ctx.save();ctx.globalAlpha=.82;for(let i=0;i<4;i++){ctx.strokeStyle=`hsla(${(i*85+special.time*25)%360} 95% 68% / ${.28+lit*.18})`;ctx.lineWidth=2+i;ctx.beginPath();ctx.arc(x,y,63+i*14+Math.sin(special.time*3+i)*5,0,Math.PI*2);ctx.stroke();}
      drawSprite(images.trumpeter,0,1,1,x,y,205);ctx.globalAlpha=1;ctx.fillStyle='#091820d9';ctx.strokeStyle=special.toneMode==='color'?'#ff77d3':special.toneMode==='guide'?'#ffc66d':'#78f5d0';ctx.lineWidth=2;ctx.fillRect(18,105,255,43);ctx.strokeRect(18,105,255,43);ctx.fillStyle=ctx.strokeStyle;ctx.textAlign='left';ctx.font='bold 17px Georgia';ctx.fillText(`${special.toneMode.toUpperCase()} TONES · ${special.chordName}`,29,125);ctx.font='11px system-ui';ctx.fillText(`${special.collected.join(' · ')||'♫'}  ${special.collected.length}/${special.required.length}`,29,141);ctx.restore();
    }
    for(const d of [...digits,...captures]){
      ctx.save();ctx.translate(d.x,d.y);
      if(d.life!==undefined){const k=d.life/.5;ctx.scale(k,k);ctx.globalAlpha=k;}
      ctx.rotate(Math.sin(d.age)*.08);
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
      ctx.fillStyle='#09151e';ctx.fillRect(12,H*.05,W-24,H*.9);
      const portrait=images.drummergirl,off=document.createElement('canvas'),size=Math.ceil(Math.min(H*.8,W*.96));off.width=size;off.height=size*1.34;
      if(portrait?.complete&&portrait.naturalWidth){
        const ox=off.getContext('2d'),scale=Math.min(off.width/portrait.naturalWidth,off.height/portrait.naturalHeight),dw=portrait.naturalWidth*scale,dh=portrait.naturalHeight*scale;
        ox.drawImage(portrait,(off.width-dw)/2,(off.height-dh)/2,dw,dh);
        ox.globalCompositeOperation='destination-in';const mask=ox.createRadialGradient(off.width*.5,off.height*.46,off.width*.28,off.width*.5,off.height*.48,off.width*.64);mask.addColorStop(0,'#fff');mask.addColorStop(.68,'#fff');mask.addColorStop(1,'#0000');ox.fillStyle=mask;ox.fillRect(0,0,off.width,off.height);
        ctx.save();ctx.translate(arrival(W/2,-1),H*.51);ctx.drawImage(off,-off.width/2,-off.height/2);ctx.restore();
      }
      const haze=ctx.createRadialGradient(W/2,H*.48,20,W/2,H*.48,W*.54);haze.addColorStop(0,'#1b65852c');haze.addColorStop(1,'#09151e00');ctx.fillStyle=haze;ctx.fillRect(12,H*.05,W-24,H*.9);
      ctx.fillStyle='#dae2dd';ctx.textAlign='center';ctx.font='bold 16px monospace';ctx.fillText('DRUM MACHINE · RUDIMENTS',W/2,H*.11);ctx.restore();return;
    }
    ctx.fillStyle='#09151ee0';ctx.fillRect(12,H*.20,W-24,H*.60);
    const glow=ctx.createRadialGradient(W/2,H*.43,10,W/2,H*.43,W*.62);glow.addColorStop(0,'#8b653a99');glow.addColorStop(1,'#101c2400');ctx.fillStyle=glow;ctx.fillRect(12,H*.20,W-24,H*.60);
    for(let x=25;x<W;x+=60){ctx.fillStyle='#70573899';ctx.fillRect(x,H*.23,6,H*.48);ctx.fillStyle='#d4a768';ctx.fillRect(x+1,H*.23,2,H*.48);}
    ctx.fillStyle='#262f31e8';ctx.beginPath();ctx.ellipse(W/2,H*.68,W*.46,H*.14,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c69a58';ctx.lineWidth=3;ctx.stroke();
    const band=images.band;
    for(let i=0;i<4;i++){
      const x=W*(.16+i*.225),y=H*.54+Math.sin(i*2)*4;
      ctx.save();ctx.globalAlpha=.34;ctx.translate(x,y);ctx.rotate(pulse*(i%2?-.025:.025));
      if(band?.complete&&band.naturalWidth){const bounds=[0,370,730,1190,1536],sx=bounds[i],sw=bounds[i+1]-sx,sh=band.naturalHeight,scale=Math.min(H*.48/sh,W*.19/sw);ctx.drawImage(band,sx,0,sw,sh,-sw*scale/2,-sh*scale/2,sw*scale,sh*scale);}ctx.restore();
      ctx.fillStyle=i===beat%4?'#c4ffe4':'#817353';ctx.beginPath();ctx.arc(x,H*.82,5,0,Math.PI*2);ctx.fill();
    }
    const drummerX=arrival(W*.52,-1);ctx.save();ctx.translate(drummerX,H*.53);ctx.rotate(pulse*.014);drawSprite(special.kind==='poly'?images.drummergirl:images.drummer,0,1,1,0,0,360);ctx.restore();
    ctx.textAlign='center';ctx.fillStyle='#ffe2a7';ctx.font='bold 20px Georgia';ctx.fillText(special.kind==='poly'?'DRUM MACHINE · RUDIMENTS':'THE DRUMMER · RHYTHM TRIAL',W/2,H*.25);
    ctx.font='12px system-ui';ctx.fillText(`RHYTHM SIGNAL · 110 BPM${rhythmFocus?' · ZILDJIAN FOCUS READY':''}`,W/2,H*.29);
    ctx.restore();
  }
  function drawMelodyOverlay(){
    const ctx=api.ctx,H=getH(),pulse=Math.sin((audio.context?.currentTime||0)*5),x=W*.36,y=H*.47;
    ctx.save();ctx.fillStyle='#081629df';ctx.fillRect(12,H*.18,W-24,H*.64);
    const glow=ctx.createRadialGradient(x,y,15,x,y,W*.6);glow.addColorStop(0,'#854dff99');glow.addColorStop(.55,'#175cff35');glow.addColorStop(1,'#07162600');ctx.fillStyle=glow;ctx.fillRect(12,H*.18,W-24,H*.64);
    for(let i=0;i<5;i++){ctx.strokeStyle=`hsla(${210+i*26} 95% 68% / ${.25+i*.08})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,85+i*18+8*pulse,32+i*12,Math.sin(i)*.22,0,Math.PI*2);ctx.stroke();}
    const keyX=arrival(x,1);drawSprite(images.keytarist,0,1,1,keyX,y,310);
    ctx.fillStyle='#edf3ff';ctx.textAlign='center';ctx.font='bold 19px Georgia';ctx.fillText('MELODY MEMORY',W/2,H*.25);ctx.font='12px system-ui';ctx.fillStyle='#a8c8ff';ctx.fillText(s.listening?'♫ LISTEN TO THE LINE':'TAP A TITLE OR SAY IT IN ENGLISH',W/2,H*.29);ctx.restore();
  }
  function drawModeOverlay(){
    const ctx=api.ctx,H=getH(),pulse=Math.sin((audio.context?.currentTime||0)*4),x=arrival(W*.59,-1),y=H*.49;
    ctx.save();ctx.fillStyle='#11101cdf';ctx.fillRect(12,H*.18,W-24,H*.64);const glow=ctx.createRadialGradient(x,y,15,x,y,W*.62);glow.addColorStop(0,'#c54f9a8c');glow.addColorStop(.5,'#3e79b43a');glow.addColorStop(1,'#080b1500');ctx.fillStyle=glow;ctx.fillRect(12,H*.18,W-24,H*.64);
    for(let i=0;i<6;i++){ctx.strokeStyle=`hsla(${285-i*17} 88% 68% / ${.18+i*.055})`;ctx.beginPath();ctx.ellipse(x,y,70+i*17+5*pulse,29+i*9,-.22,0,Math.PI*2);ctx.stroke();}
    drawSprite(images.guitarist,0,1,1,x,y,330);
    ctx.textAlign='center';ctx.fillStyle='#ffe5bb';ctx.font='bold 19px Georgia';ctx.fillText('MODAL DRIVE · GUITAR PILOT',W/2,H*.25);ctx.font='12px system-ui';ctx.fillStyle='#d5b5ff';ctx.fillText(s.listening?'♫ FOLLOW THE SCALE':'NAME THE MODE · UP OR DOWN',W/2,H*.29);ctx.restore();
  }
  function drawPauseOverlay(){if(special?.kind==='melody')drawMelodyOverlay();else if(special?.kind==='mode')drawModeOverlay();else drawRhythmOverlay();}
  function hitShot(b){for(const t of teachers){if(t.hp>0&&Math.hypot(b.x-t.x,b.y-t.y)<31){if(t.hp<=(fuzz?2:1))killTeacher(t);else t.hp-=fuzz?2:1;return true;}}return false;}
  return {reset,render,tick,draw,drawPauseOverlay,hitShot,replay,hint,useRhythmFocus,afterHydra,startChallenge,answerSpecial,answerSpoken,collectNumber,collectTone,artifact,spawnTeacher,
    get pausedCombat(){return !!special?.pause;},
    get pauseKind(){return special?.pause?special.kind:null;},
    get busy(){return !!special;},get invincible(){return shield>0||cloak>0||special?.kind==='tones';},get cloaked(){return cloak>0;},get boosted(){return rapid>0;},get planet(){return planet;},get pilot(){return PILOTS[pilot];},get level(){return pilot;},
    snapshot:()=>({pilot,planet,teachers,walls,drops,digits,special,queue,cloak,shield,rapid,fuzz,hints,rhythmFocus})};
}
