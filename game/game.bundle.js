/* Generated from game source. Classic script also supports local Safari. */
(()=>{
const module_music=(()=>{
// The canonical source remains ../app.js. These two small snapshots are checked
// against it by tools/check.mjs; see MUSICAL_NOTES.md for the visual PDF audit.
const BOOK_ROUTES = [
  { id:'fig-1-6', source:'Chapter 1 · Fig. 1.6 · printed p. 9', baseTonic:5,
    sequence:[{degree:'I6',offset:0,quality:'6'},{degree:'VI−7',offset:9,quality:'m7'},{degree:'IV',offset:5,quality:'maj'},{degree:'I6',offset:0,quality:'6'}] },
  { id:'fig-1-8', source:'Chapter 1 · Fig. 1.8 · printed p. 9', baseTonic:5,
    sequence:[{degree:'I6',offset:0,quality:'6'},{degree:'VI−7',offset:9,quality:'m7'},{degree:'V7sus4',offset:7,quality:'7sus4'},{degree:'VI−7',offset:9,quality:'m7'}] },
];
const DEGREES = {
  0:{glyph:'I',label:'тоника'},1:{glyph:'♭II',label:'= ♯I'},
  2:{glyph:'II',label:'вторая'},3:{glyph:'♭III',label:'= ♯II'},
  4:{glyph:'III',label:'третья'},5:{glyph:'IV',label:'четвёртая'},
  6:{glyph:'♯IV',label:'= ♭V'},7:{glyph:'V',label:'пятая'},
  8:{glyph:'♭VI',label:'= ♯V'},9:{glyph:'VI',label:'шестая'},
  10:{glyph:'♭VII',label:'= ♯VI'},11:{glyph:'VII',label:'седьмая'},
};
for(const d of Object.values(DEGREES)){d.name=d.glyph;d.color='#79f5d0';}
// Exact pitch sets copied from the canonical QUALITY table and checked against it.
// Standalone recognition drills are authored material, not textbook progressions.
const INTERVALS = {
  maj:[0,4,7],min:[0,3,7],aug:[0,4,8],'6':[0,4,7,9],maj7:[0,4,7,11],
  maj7sharp11:[0,4,7,11,18],m7:[0,3,7,10],m7b5:[0,3,6,10],
  m7natural9:[0,3,7,10,14],m7b5natural9:[0,3,6,10,14],m6:[0,3,7,9],
  '7':[0,4,7,10],'7b9':[0,4,7,10,13],'7b9b13':[0,4,7,10,13,20],
  dim7:[0,3,6,9],'7sus4':[0,5,7,10],'7b5':[0,4,6,10],
  '7sharp5':[0,4,8,10],'7alt':[0,4,6,10,13],m7b9:[0,3,7,10,13],
  minSharp5:[0,3,8],augMaj7:[0,4,8,11],
};
const QUALITIES = {
  maj:{glyph:'maj',label:'мажорное трезвучие'},min:{glyph:'m',label:'минорное трезвучие'},
  '6':{glyph:'6',label:'мажорный с секстой'},m6:{glyph:'m6',label:'минорный с секстой'},
  '7':{glyph:'7',label:'доминантсептаккорд'},maj7:{glyph:'maj7',label:'большой мажорный септаккорд'},
  m7:{glyph:'m7',label:'минорный септаккорд'},m7b5:{glyph:'m7♭5',label:'полууменьшённый'},
  dim7:{glyph:'°7',label:'уменьшённый септаккорд'},'7sus4':{glyph:'7sus4',label:'септаккорд с задержанием'},
  aug:{glyph:'aug',label:'увеличенное трезвучие'},
  maj7sharp11:{glyph:'maj7(♯11)',label:'мажорный септаккорд с ♯11'},
  m7natural9:{glyph:'m7(9)',label:'минорный септаккорд с 9'},
  m7b5natural9:{glyph:'m7(♭5,9)',label:'полууменьшённый с 9'},
  '7b9':{glyph:'7(♭9)',label:'доминантовый с ♭9'},
  '7b9b13':{glyph:'7(♭9,♭13)',label:'доминантовый с ♭9 и ♭13'},
  '7b5':{glyph:'7(♭5)',label:'доминантовый с ♭5'},
  '7sharp5':{glyph:'7(♯5)',label:'доминантовый с ♯5'},
  '7alt':{glyph:'7alt',label:'альтерированный: ♭5 и ♭9'},
  m7b9:{glyph:'m7(♭9)',label:'минорный септаккорд с ♭9'},
  minSharp5:{glyph:'m(♯5)',label:'минорное трезвучие с ♯5'},
  augMaj7:{glyph:'aug(maj7)',label:'увеличенный с большой септимой'},
};
for(const q of Object.values(QUALITIES)){q.name=q.glyph;q.color='#f7cd7f';}
const QUALITY_BANKS=[['maj','min','6','m6','7','maj7','m7','m7b5','dim7','7sus4','aug'],
  ['maj7sharp11','m7natural9','m7b5natural9','7b9','7b9b13','7b5','7sharp5','7alt','m7b9','minSharp5','augMaj7']];
const family = quality => quality;
const chordSymbol = chord => `${DEGREES[chord.offset].glyph}${chord.quality==='maj'?'':QUALITIES[chord.quality].glyph}`;
const SECTORS = [
  {name:'Маяк',degrees:[0,7],qualities:[],title:'Услышь I и V',description:'Сначала звучит тоника I, потом сигнал гидры. Узнай: это I или V?',patterns:[[0,7,7,0],[0,7,0,0],[7,7,0,0]],count:8},
  {name:'Переправа',degrees:[0,5,7],qualities:[],title:'Знакомься: IV',description:'От тоники I до IV — чистая кварта. Сравни её с квинтой I–V.',patterns:[[0,5,7,0],[0,7,5,0],[5,0,7,0]],count:8},
  {name:'Двойной щит',degrees:[0,5,7,9],qualities:['maj','6','m7','7sus4'],title:'Корень + тип аккорда',description:'Верхний блок оружия — ступень корня. Нижний — точный тип аккорда: maj, 6, m7 или 7sus4. Пробивай щиты в любом порядке.',count:8},
  {name:'Хроматический полёт',degrees:Array.from({length:12},(_,i)=>i),qualities:QUALITY_BANKS.flat(),title:'Вся хроматика. Точная цифровка.',description:'12 корней × 22 типа аккорда. Например: ♭IImaj7 или IIIm7. Типы оружия переключаются вкладками «Аккорды» / «Альтерации».',count:12},
];
const pick = (items,rng) => items[Math.floor(rng()*items.length)];
function createRoute(sector,previousKey=-1,rng=Math.random,routeIndex=0) {
  const keys=[0,2,3,5,7,9,10].filter(k=>k!==previousKey);
  const key=pick(keys,rng);
  const book=BOOK_ROUTES[routeIndex%BOOK_ROUTES.length];
  const sequence=sector===3?Array.from({length:4},()=>{const offset=pick(SECTORS[3].degrees,rng),quality=pick(SECTORS[3].qualities,rng);const c={offset,quality};return {...c,degree:chordSymbol(c)};}):sector===2?book.sequence.map(c=>({...c})):
    pick(SECTORS[sector].patterns,rng).map(offset=>({offset,degree:DEGREES[offset].glyph,quality:'maj'}));
  return {key,sequence,source:sector===2?book.source:sector===3?'Авторские независимые сигналы · не книжная прогрессия':'Авторская вводная фраза',id:sector===2?book.id:sector===3?'chromatic-lab':'primer',
    // Keep one timbre, register and articulation throughout each musical phrase.
    timbre:routeIndex%2?'soft':'synth',register:sector===0?60:48+(rng()<.5?0:12),
    articulation:sector>=2?pick(['block','up','down'],rng):'block'};
}
function chordNotes(chord,tonic,spread=false) {
  const root=tonic+chord.offset;
  const notes=INTERVALS[chord.quality].map(i=>root+12+i);
  if(spread) notes[1]+=12;
  return [root,...notes];
}
function cueEvents(route,chord,sector) {
  const tonic=route.register+route.key;
  const events=[{at:.12,duration:.82,notes:[tonic,tonic+4,tonic+7],part:'home'}];
  // Envelopes end at .94, then .34 seconds of actual silence before the target.
  events.push({at:1.28,duration:sector>=2?.65:1.15,notes:[tonic+chord.offset],part:'bass'});
  if(sector>=2){
    const notes=chordNotes(chord,tonic,route.articulation==='down');
    if(route.articulation==='block') events.push({at:2.16,duration:1.40,notes,part:'chord'});
    else {
      // Bass stays lowest; all upper pitch classes are retained, in either order.
      const upper=notes.slice(1).sort((a,b)=>route.articulation==='up'?a-b:b-a);
      [notes[0],...upper].forEach((note,i)=>events.push({at:2.16+i*.12,duration:1.40-i*.12,notes:[note],part:i===0?'chord':'tone'}));
    }
  }
  return {events,duration:sector>=2?3.75:2.58};
}
function answerResult(chord,shields,kind,value) {
  if(!['bass','quality'].includes(kind)||shields[kind]) return {ignored:true};
  const correct=kind==='bass'?Number(value)===(chord.bassOffset??chord.offset):value===family(chord.quality);
  const next={...shields,[kind]:correct};
  return {correct,shields:correct?next:shields,destroyed:correct&&next.bass&&next.quality};
}

return {BOOK_ROUTES,DEGREES,INTERVALS,QUALITIES,QUALITY_BANKS,family,chordSymbol,SECTORS,createRoute,chordNotes,cueEvents,answerResult};
})();
const module_intervals=(()=>{
const INTERVAL_TARGETS={
  3:{glyph:'♭3',name:'малая терция',hint:'Три полутона'},
  4:{glyph:'3',name:'большая терция',hint:'Четыре полутона'},
  7:{glyph:'5',name:'чистая квинта',hint:'Семь полутонов'},
};
const INTERVAL_MODES={up:{name:'Две ноты вверх',energy:20},down:{name:'Две ноты вниз',energy:30},together:{name:'Две ноты вместе',energy:40}};
const targetForSector=sector=>[3,4,7,3][sector];
function createCapsule(sector,rng=Math.random){
  const wanted=targetForSector(sector),match=rng()<.55;
  const alternatives=[3,4,5,7].filter(n=>n!==wanted);
  const heard=match?wanted:alternatives[Math.floor(rng()*alternatives.length)];
  const mode=['up','down','together'][Math.floor(rng()*3)];
  return {wanted,heard,mode,energy:INTERVAL_MODES[mode].energy};
}
function intervalCue(base,semitones,mode){
  if(mode==='together')return {events:[{at:.12,duration:1.35,notes:[base,base+semitones]}],duration:1.55};
  const notes=mode==='down'?[base+semitones,base]:[base,base+semitones];
  return {events:notes.map((note,i)=>({at:.12+i*.75,duration:.70,notes:[note]})),duration:1.78};
}
function capsuleOutcome(capsule){return {correct:capsule.wanted===capsule.heard,energy:capsule.wanted===capsule.heard?capsule.energy:-20};}

return {INTERVAL_TARGETS,INTERVAL_MODES,targetForSector,createCapsule,intervalCue,capsuleOutcome};
})();
const module_combat=(()=>{
function pressure(sector,combo,health){return Math.max(0,Math.min(3,sector+(combo>=4?1:0)-(health<=2?1:0)));}
function formation(index,width,difficulty=0){
  const side=index%2?1:-1,center=width/2+side*70;
  return Array.from({length:4+difficulty},(_,i)=>({
    x:Math.max(35,Math.min(width-35,center+(i-2)*43)),y:-35-i*31,
    baseX:center+(i-2)*43,phase:i*.6,age:0,speed:65+difficulty*9,
    hp:difficulty>1?2:1,hit:0,fire:3.2+i*.4,pattern:index%3,
  }));
}
function stepDrone(drone,dt,width){
  drone.age+=dt;drone.y+=drone.speed*dt;drone.hit=Math.max(0,drone.hit-dt);
  const sway=drone.pattern===0?Math.sin(drone.age*1.4+drone.phase)*48:
    drone.pattern===1?Math.sin(drone.age*.65)*100:Math.cos(drone.age+drone.phase)*25;
  drone.x=Math.max(22,Math.min(width-22,drone.baseX+sway));
  drone.fire-=dt;
}
const hitCircle=(a,b,radius)=>Math.hypot(a.x-b.x,a.y-b.y)<radius;

return {pressure,formation,stepDrone,hitCircle};
})();
const module_expedition=(()=>{
const {QUALITIES,INTERVALS}=module_music;

const PILOTS=[
  {name:'Новичок',sector:0,speed:.65,grace:9,obstacleGap:230,description:'I и V · спокойный полёт · помощь'},
  {name:'Студент',sector:2,speed:.85,grace:7,obstacleGap:200,description:'Два щита · основные аккорды'},
  {name:'Магистр музыки',sector:3,speed:1,grace:5,obstacleGap:170,description:'12 корней · 22 типа · все интервалы'},
  {name:'Херби Хэнкок',sector:3,speed:1.25,grace:3,obstacleGap:145,description:'Вся гармония · быстрые враги · узкие проходы'},
];
const TEACHERS=[
  {name:'Литература',reward:'hint',text:'Шпаргалка: одна подсказка'},
  {name:'Математика',reward:'rapid',text:'Автомат: 12 секунд'},
  {name:'Химия',reward:'cloak',text:'Невидимость: 10 секунд'},
  {name:'Физ-ра',reward:'shield',text:'Неприкосновенность: 10 секунд'},
  {name:'НВП',reward:'combo',text:'Автомат + невидимость'},
];
const ARTIFACTS=[
  {name:'Telecaster',elixir:'Copper Drive',text:'Веерный автомат · 14 секунд'},
  {name:'Keytar',elixir:'Phase Shift',text:'Невидимость · 12 секунд'},
  {name:'Jazz Bass',elixir:'Guide Tone',text:'Услышь 3 или 7, поймай цифру — учителя нейтрализуются'},
  {name:'Overdrive',elixir:'Iron Fuzz',text:'Двойной урон и щит · 10 секунд'},
  {name:'Rock Tongue',elixir:'Full Recovery',text:'Узнай тип случайного аккорда → HP 100%'},
  {name:'Zildjian',elixir:'Rhythm Focus',text:'Запаси подсказку: убрать половину неверных ритмов'},
  {name:'Drum Machine',elixir:'Phase Lock',text:'Узнай соотношение пульсов → защита и автомат'},
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
const RHYTHMS=[
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
const RHYTHM_HINTS=[
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
const RHYTHM_LEVELS=[0,0,0,1,1,1,2,1,0,1,2,2,2,2,2,2,2,2,1,1];
const rhythmIds=level=>RHYTHMS.map((_,i)=>i).filter(i=>RHYTHM_LEVELS[i]<=level);
const POLYRHYTHMS=[[2,3,1],[3,2,1],[3,4,1],[4,3,1],[5,4,2],[4,5,2],[5,3,2],[3,5,2],[7,4,3],[4,7,3]].map(([a,b,level])=>({a,b,level,name:`${a}:${b}`}));
function polyEvents(pattern,cycles=3,layer='both'){
  const events=[];
  for(let cycle=0;cycle<cycles;cycle++)for(const [voice,count] of [['rim',pattern.a],['kick',pattern.b]]){
    if(layer!=='both'&&layer!==voice)continue;
    for(let i=0;i<count;i++)events.push({voice,beat:cycle*4+i*4/count,index:i});
  }
  return events.sort((a,b)=>a.beat-b.beat);
}
const NUMBER_LABELS=['1','♭2','2','♭3','3','4','♭5','♯4','5','♭6','6','♭7','7','8'];
const NUMBER_OFFSETS={'1':0,'♭2':1,'2':2,'♭3':3,'3':4,'4':5,'♭5':6,'♯4':6,'5':7,'♭6':8,'6':9,'♭7':10,'7':11,'8':12};
const TONE_OFFSETS={'1':0,'♭9':1,'9':2,'♯9':3,'♭3':3,'3':4,'11':5,'♯11':6,'♭5':6,'5':7,'♭13':8,'13':9,'♭7':10,'7':11};
const TONE_PROGRAMS={
  '7':{basic:['1','5'],guide:['3','♭7'],color:[['9','♯11','13'],['♭9','♯9','♭13']]},
  maj7:{basic:['1','5'],guide:['3','7'],color:[['9','♯11','13']]},
  m7:{basic:['1','5'],guide:['♭3','♭7'],color:[['9','11','13']]},
  m7b5:{basic:['1','♭5'],guide:['♭3','♭5','♭7'],color:[['9','11','♭13']]},
  '7sus4':{basic:['1','5'],guide:['11','♭7'],color:[['9','13']]},
};
const TONE_MODES=['basic','guide','color'];
const MELODIES=[
  {name:'When the Saints',aliases:['when the saints','saints','when the saints go marching in'],notes:[0,4,5,7,0,4,5,7,0,4,5,7,4,0,4,2],beats:[.5,.5,.5,1,.5,.5,.5,1,.5,.5,.5,.75,.75,.75,.5,1.5]},
  {name:'Amazing Grace',aliases:['amazing grace'],notes:[7,0,4,0,4,2,0,9,7],beats:[.6,1.1,.45,.45,1.1,.6,1.1,.6,1.5]},
  {name:'Ode to Joy',aliases:['ode to joy','ode joy'],notes:[4,4,5,7,7,5,4,2,0,0,2,4,4,2,2],beats:[.55,.55,.55,.55,.55,.55,.55,.55,.55,.55,.55,.55,.8,.28,1.2]},
  {name:'Greensleeves',aliases:['greensleeves','green sleeves'],notes:[9,0,2,4,5,4,2,11,7,9,11,0,9,9],beats:[.55,1,.55,.8,.55,.55,.8,.55,.9,.55,.55,.8,.55,1.2]},
];
const MODES=[
  {name:'Ionian',level:0,notes:[0,2,4,5,7,9,11,12]},{name:'Dorian',level:0,notes:[0,2,3,5,7,9,10,12]},{name:'Phrygian',level:0,notes:[0,1,3,5,7,8,10,12]},{name:'Lydian',level:0,notes:[0,2,4,6,7,9,11,12]},{name:'Mixolydian',level:0,notes:[0,2,4,5,7,9,10,12]},{name:'Aeolian',level:0,notes:[0,2,3,5,7,8,10,12]},{name:'Locrian',level:0,notes:[0,1,3,5,6,8,10,12]},
  {name:'Harmonic Minor',level:1,notes:[0,2,3,5,7,8,11,12]},{name:'Phrygian Dominant',level:1,notes:[0,1,4,5,7,8,10,12]},{name:'Melodic Minor',level:1,notes:[0,2,3,5,7,9,11,12]},{name:'Lydian Dominant',level:1,notes:[0,2,4,6,7,9,10,12]},{name:'Altered',level:1,notes:[0,1,3,4,6,8,10,12]},{name:'Locrian Natural 2',level:1,notes:[0,2,3,5,6,8,10,12]},
  {name:'Whole Tone',level:2,notes:[0,2,4,6,8,10,12]},{name:'Diminished Half-Whole',level:2,notes:[0,1,3,4,6,7,9,10,12]},{name:'Diminished Whole-Half',level:2,notes:[0,2,3,5,6,8,9,11,12]},{name:'Bebop Dominant',level:2,notes:[0,2,4,5,7,9,10,11,12]},{name:'Double Harmonic',level:2,notes:[0,1,4,5,7,8,11,12]},{name:'Hungarian Minor',level:2,notes:[0,2,3,6,7,8,11,12]},
];
const ROOT_NAMES=['C','D♭','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const QUALITY_SPEECH={'7':'seven',maj7:'major seven',m7:'minor seven',m7b5:'minor seven flat five','7sus4':'seven sus four'};
function toneMission(quality,mode,random=Math.random){
  const program=TONE_PROGRAMS[quality],groups=program[mode],required=mode==='color'?groups[Math.floor(random()*groups.length)]:groups;
  return {quality,mode,required:[...required]};
}
function toneAnswer(challenge,label){return {correct:challenge.required.includes(label),complete:challenge.required.every(t=>challenge.collected.includes(t)||t===label)};}
function orderedTargets(interval,direction){return [interval];}
function gradeNumber(challenge,label){
  const note=NUMBER_OFFSETS[label];
  if(challenge.kind==='guide')return {correct:label===challenge.target,complete:label===challenge.target};
  const correct=note===challenge.interval;
  return {correct,complete:correct,note};
}
function obstacleRow(index,width,gap){
  const center=width/2+Math.sin(index*1.6)*(width-gap-60)/2;
  return [{x:0,y:-75,w:center-gap/2,h:58},{x:center+gap/2,y:-75,w:width-center-gap/2,h:58}];
}
function touchesWall(player,wall,r=11){return player.x+r>wall.x&&player.x-r<wall.x+wall.w&&player.y+r>wall.y&&player.y-r<wall.y+wall.h;}

function createExpedition(api){
  const {s,audio,feedback,signal,burst,renderHud,syncPads,shipHit,listenTitle,W,getH,images,document}=api;
  let pilot=0,planet='moon',teachers=[],walls=[],drops=[],digits=[],special=null,queue=[],timer=5,wallTimer=3,artifactTimer=9,index=0,dropIndex=0,wallIndex=0;
  let cloak=0,shield=0,rapid=0,fuzz=0,hints=0,rhythmFocus=0,collectCooldown=0,lastRender='',captures=[],renderedChallenge=null;
  const $=id=>document.getElementById(id);
  const random=items=>items[Math.floor(Math.random()*items.length)];
  function reset(level=0){pilot=level;planet=level%2?'mars':'moon';teachers=[];walls=[];drops=[];digits=[];special=null;queue=[];timer=5;wallTimer=3;artifactTimer=9;index=dropIndex=wallIndex=0;cloak=shield=rapid=fuzz=hints=rhythmFocus=collectCooldown=0;render();}
  function render(){
    const stamp=JSON.stringify([planet,pilot,Math.ceil(rapid),Math.ceil(cloak),Math.ceil(shield),Math.ceil(fuzz),hints,rhythmFocus,s.listening,s.mode,special?.kind,Math.ceil(special?.time||0),special?.collected.length,special?.target,special?.options]);
    if(stamp===lastRender)return;lastRender=stamp;
    $('planet-name').textContent=`${planet==='moon'?'ЛУНА':'МАРС'} · ${PILOTS[pilot].name}`;
    $('effects').textContent=[rapid>0?`AUTO ${Math.ceil(rapid)}s`:'',cloak>0?`GHOST ${Math.ceil(cloak)}s`:'',shield>0?`SHIELD ${Math.ceil(shield)}s`:'',fuzz>0?`FUZZ ${Math.ceil(fuzz)}s`:'',rhythmFocus?`RHYTHM FOCUS ×${rhythmFocus}`:''].filter(Boolean).join(' · ');
    $('hint').textContent=`Подсказка · ${hints}`;$('hint').disabled=!hints||s.listening||!['active','resolving'].includes(s.mode);
    $('special-panel').hidden=!special;
    if(special){
      $('special-title').textContent=special.kind==='poly'?'DRUM MACHINE · ВЫСОКИЙ : НИЗКИЙ':special.kind==='rhythm'?'RHYTHM TRIAL · THE DRUMMER':special.kind==='melody'?'MELODY MEMORY · KEY PILOT':special.kind==='mode'?'MODAL DRIVE · GUITAR PILOT':special.kind==='chord'?'ROCK TONGUE · HP 100%':special.kind==='guide'?'JAZZ BASS · GUIDE TONE':special.kind==='tones'?`${special.toneMode.toUpperCase()} TONES · ${special.chordName}`:'СОБЕРИ ИНТЕРВАЛ';
      $('special-detail').textContent=special.revealed?`Звучит ${specialName(special)} · ↻ повторить`:special.kind==='melody'?'Полёт удержан · назови тему по-английски или выбери название':special.kind==='mode'?'Полёт удержан · узнай лад вверх или вниз':special.pause?'Квартет вышел на поле · полёт удержан, выбери стиль или партию':special.kind==='tones'?`Трубач просит по-английски · собрано ${special.collected.length}/${special.required.length} · ошибка гасит режим`:special.kind==='numbers'?`Один интервал — одна цифра. Ошибка завершает попытку · ${Math.ceil(special.time)}s`:special.kind==='guide'?`Поймай услышанный тон: 3 или 7 · ${Math.ceil(special.time)}s`:`Узнай на слух · ${Math.ceil(special.time)}s`;
      const choices=special.kind==='poly'?special.options.map(i=>({id:i,name:POLYRHYTHMS[i].name,icon:''})):special.kind==='rhythm'?special.options.map(i=>({id:i,name:RHYTHMS[i].name,icon:RHYTHMS[i].icon})):special.kind==='melody'?special.options.map(i=>({id:i,name:MELODIES[i].name,icon:'♫'})):special.kind==='mode'?special.options.map(i=>({id:i,name:MODES[i].name,icon:'◌'})):special.kind==='chord'?special.options.map(id=>({id,name:QUALITIES[id].glyph,icon:''})):[];
      // Keep live buttons in place while the countdown changes: replacing them
      // between pointer-down and pointer-up used to discard some answers.
      if(renderedChallenge!==special){$('special-options').replaceChildren();for(const choice of choices){const b=document.createElement('button');b.textContent=`${choice.icon} ${choice.name}`.trim();b.addEventListener('click',()=>answerSpecial(choice.id));$('special-options').append(b);}if(special.kind==='rhythm'&&rhythmFocus){const focus=document.createElement('button');focus.className='voice-answer';focus.textContent=`◉ ZILDJIAN FOCUS ×${rhythmFocus}`;focus.addEventListener('click',useRhythmFocus);$('special-options').append(focus);}if(['melody','mode'].includes(special.kind)){const mic=document.createElement('button');mic.className='voice-answer';mic.textContent=special.kind==='melody'?'🎙 SAY TITLE':'🎙 SAY MODE';mic.addEventListener('click',listenTitle);$('special-options').append(mic);}renderedChallenge=special;}
      for(const b of $('special-options').children)b.disabled=s.listening||s.mode==='paused';
    }
  }
  function spawnTeacher(){
    const edge=index%4,type=index++%5,H=getH(),speed=(115+pilot*12)*PILOTS[pilot].speed;
    const x=edge===0?-40:edge===1?W+40:70+Math.random()*(W-140),y=edge===2?-45:edge===3?H+45:120+Math.random()*(H-200);
    const angle=Math.atan2(H*.62-y,W/2-x);
    teachers.push({type,x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,hp:7+pilot*2,age:0,fire:3,edge});
    feedback(`${TEACHERS[type].name} · учитель атакует!`);
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
    special={kind:kind,time:pilot===0?30:pilot===1?20:16,collected:[],options:[],misses:0,pause:['rhythm','melody','mode'].includes(kind),beat:0,createdAt:Date.now()};
    s.bullets=[];
    if(kind==='numbers'){special.interval=random(pilot<2?[3,4,6,7]:[1,2,3,4,5,6,7,8,9,10,11,12]);special.direction=random(['up','down']);makeNumbers(special);}
    if(kind==='guide'){special.target=random(['3','7']);makeNumbers(special);}
    if(kind==='chord'){special.options=pilot<2?['maj','min','7','maj7','m7','7sus4']:Object.keys(QUALITIES);special.target=random(special.options);special.root=48+Math.floor(Math.random()*12);}
    if(kind==='rhythm'){const pool=rhythmIds(pilot);special.target=random(pool);const compatible=pool.filter(i=>i!==special.target&&!!RHYTHMS[i].part===!!RHYTHMS[special.target].part);special.options=[special.target,...compatible.sort(()=>Math.random()-.5).slice(0,pilot===0?5:pilot===1?7:9)].sort(()=>Math.random()-.5);}
    if(kind==='poly'){special.options=POLYRHYTHMS.map((_,i)=>i).filter(i=>POLYRHYTHMS[i].level<=Math.max(1,pilot));special.target=random(special.options);}
    if(kind==='melody'){special.options=MELODIES.map((_,i)=>i).slice(0,pilot<2?3:MELODIES.length);special.target=random(special.options);special.root=pilot<2?60:57+Math.floor(Math.random()*6);}
    if(kind==='mode'){const pool=MODES.map((mode,i)=>({mode,i})).filter(item=>item.mode.level<=Math.min(2,pilot)).map(item=>item.i);special.target=random(pool);special.options=[special.target,...pool.filter(i=>i!==special.target).sort(()=>Math.random()-.5).slice(0,pilot===0?6:5)].sort(()=>Math.random()-.5);special.root=55+Math.floor(Math.random()*7);special.direction=random(['up','down']);}
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
    else if(special.kind==='poly')audio.poly(POLYRHYTHMS[special.target],done);
    else if(special.kind==='tones')audio.announce(`${ROOT_NAMES[special.rootPc]} ${QUALITY_SPEECH[special.quality]}. Give me ${special.toneMode} tones, man.`,()=>{if(special===current)audio.trumpetChord(special.root,INTERVALS[special.quality],done);});
    else if(special.kind==='melody')audio.melody(special.root,MELODIES[special.target],done);
    else if(special.kind==='mode')audio.scale(special.root,MODES[special.target],special.direction,done);
    else audio.rhythm(RHYTHMS[special.target],done,{loops:2,onBeat:beat=>{if(special===current)current.beat=beat;}});
  }
  function specialName(c,value=c.target){return c.kind==='poly'?POLYRHYTHMS[value].name:c.kind==='rhythm'?RHYTHMS[value].name:c.kind==='melody'?MELODIES[value].name:c.kind==='mode'?MODES[value].name:c.kind==='chord'?QUALITIES[value].glyph:c.kind==='tones'?`${c.toneMode.toUpperCase()} TONES · ${c.chordName}`:c.kind==='guide'?c.target:c.label;}
  function endChallenge(won,wrong=false){
    const c=special;if(!c)return;
    audio.stop();s.listening=false;special=null;digits=[];
    if(won){s.score+=250;
      if(c.kind==='chord'){s.health=5;feedback(`${QUALITIES[c.target].glyph} · HP 100%`);}
      else if(c.kind==='rhythm'){shield=12;rapid=10;feedback(`${RHYTHMS[c.target].name} · Rhythm Shield`);}
      else if(c.kind==='poly'){shield=10;rapid=12;feedback(`${POLYRHYTHMS[c.target].name} · Phase Lock`);}
      else if(c.kind==='guide'){teachers.filter(t=>t.hp>0).forEach(killTeacher);shield=8;feedback(`Guide tone ${c.target} · учителя нейтрализованы`);}
      else if(c.kind==='tones'){rapid=14;shield=12;s.energy=Math.min(99,s.energy+45);feedback(`${c.toneMode.toUpperCase()} TONES · ${c.chordName} · HARMONIC FLIGHT`);}
      else if(c.kind==='melody'){cloak=12;rapid=12;s.energy=Math.min(99,s.energy+35);feedback(`${MELODIES[c.target].name} · MELODY MEMORY`);}
      else if(c.kind==='mode'){fuzz=12;rapid=14;s.energy=Math.min(99,s.energy+40);feedback(`${MODES[c.target].name} · MODAL DRIVE`);}
      else{rapid=10;s.energy=Math.min(99,s.energy+30);feedback(`${orderedTargets(c.interval,c.direction).map(n=>n===6?'♭5 / ♯4':Object.keys(NUMBER_OFFSETS).find(k=>NUMBER_OFFSETS[k]===n)).join(' → ')} · +30 силы`);}
    }else{feedback(wrong?c.kind==='tones'?`Гармония погасла · нужны ${c.required.join(' · ')}`:`Попытка потеряна · нужно ${c.label}`:['rhythm','chord','poly','melody','mode'].includes(c.kind)?`Это ${specialName(c)}`:'Время вышло · попробуем ещё',true);}
    s.fireTimer=Math.max(s.fireTimer,4);render();renderHud();syncPads();
    if(s.mode==='active')api.playCue();
  }
  function answerSpecial(value){
    if(!special||s.listening||s.mode==='paused')return;
    if(value===special.target){endChallenge(true);return;}
    special.misses++;special.revealed=true;special.time=Math.max(0,special.time-3);
    feedback(`Выбрано ${specialName(special,value)} · звучит ${specialName(special)}`,true);lastRender='';render();
  }
  function useRhythmFocus(){
    if(!special||special.kind!=='rhythm'||!rhythmFocus||s.listening||s.mode==='paused')return false;
    const wrong=special.options.filter(i=>i!==special.target),remove=new Set(wrong.slice().sort(()=>Math.random()-.5).slice(0,Math.ceil(wrong.length/2)));
    special.options=special.options.filter(i=>!remove.has(i));rhythmFocus--;renderedChallenge=null;lastRender='';
    feedback(`Zildjian Focus · осталось ${special.options.length} вариантов`);render();syncPads();return true;
  }
  function answerSpoken(text){
    if(!special||!['melody','mode'].includes(special.kind)||s.listening)return false;const heard=String(text).toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(),items=special.kind==='melody'?MELODIES:MODES;
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
    if(type===0)rapid=14;
    if(type===1)cloak=12;
    if(type===2){if(!teachers.some(t=>t.hp>0))spawnTeacher();}
    if(type===3){fuzz=shield=10;}
    if(type===5){rhythmFocus++;feedback(`Zildjian · Rhythm Focus ×${rhythmFocus}`);}
    if([2,4,6,7,8,9,10].includes(type)&&['active','resolving'].includes(s.mode)){
      audio.stop();s.listening=false;special=null;digits=[];queue=[];s.capsule=null;s.capsuleTimer=0;
      startChallenge(type===2?'guide':type===4?'chord':type===6?'poly':type===7?'tones':type===8?'melody':type===9?'mode':'rhythm');
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
      if(artifactTimer<=0){dropArtifact();artifactTimer=pilot===0?16:pilot===1?21:16;}
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
    const ctx=api.ctx;if(d.type<7){ctx.save();ctx.beginPath();ctx.arc(d.x,d.y,29,0,Math.PI*2);ctx.clip();if(d.type===6)drawSprite(images.drummachine,0,1,1,d.x,d.y,55);else drawSprite(images.artifacts,d.type,3,2,d.x,d.y,55);ctx.restore();return;}
    const hue={7:34,8:192,9:292,10:12}[d.type]||45,spin=d.age*.8;
    ctx.save();ctx.translate(d.x,d.y);ctx.rotate(Math.sin(spin)*.12);ctx.shadowColor=`hsl(${hue} 95% 62%)`;ctx.shadowBlur=22;
    ctx.fillStyle='#231b18';ctx.strokeStyle=`hsl(${hue} 88% 72%)`;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-22,-13);ctx.lineTo(0,-26);ctx.lineTo(22,-13);ctx.lineTo(22,14);ctx.lineTo(0,27);ctx.lineTo(-22,14);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=`hsla(${hue} 70% 42% / .72)`;ctx.beginPath();ctx.moveTo(-22,-13);ctx.lineTo(0,0);ctx.lineTo(0,27);ctx.lineTo(-22,14);ctx.closePath();ctx.fill();
    ctx.fillStyle=`hsla(${hue+24} 82% 52% / .5)`;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(22,-13);ctx.lineTo(22,14);ctx.lineTo(0,27);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle='#fff0bd';ctx.fillStyle='#fff0bd';ctx.lineWidth=2;ctx.lineCap='round';
    if(d.type===7){ctx.beginPath();ctx.moveTo(-12,3);ctx.lineTo(9,-5);ctx.lineTo(9,6);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(-14,3,3,0,Math.PI*2);ctx.fill();}
    if(d.type===8){ctx.strokeRect(-14,-7,28,15);for(let x=-10;x<14;x+=6){ctx.beginPath();ctx.moveTo(x,-7);ctx.lineTo(x,8);ctx.stroke();}for(const x of [-7,5])ctx.fillRect(x,-7,3,8);}
    if(d.type===9){ctx.save();ctx.rotate(-.42);ctx.beginPath();ctx.ellipse(-8,4,9,7,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-1,1);ctx.lineTo(16,-6);ctx.stroke();ctx.restore();}
    if(d.type===10){ctx.beginPath();ctx.arc(0,3,11,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-13,-13);ctx.lineTo(7,7);ctx.moveTo(13,-13);ctx.lineTo(-7,7);ctx.stroke();}
    ctx.strokeStyle=`hsla(${hue} 95% 72% / .62)`;ctx.beginPath();ctx.ellipse(0,0,35+Math.sin(d.age*5)*3,17,spin,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  function draw(){const ctx=api.ctx;
    for(const w of walls){ctx.save();ctx.beginPath();ctx.rect(w.x,w.y,w.w,w.h);ctx.clip();const tex=images[planet];if(tex?.complete&&tex.naturalWidth)ctx.drawImage(tex,0,tex.naturalHeight*.35,tex.naturalWidth,tex.naturalHeight*.2,w.x,w.y,w.w,w.h);ctx.fillStyle='#4b322b66';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.restore();ctx.strokeStyle='#d2a265';ctx.lineWidth=3;ctx.strokeRect(w.x,w.y,w.w,w.h);ctx.fillStyle='#fbd492';for(let x=w.x+12;x<w.x+w.w;x+=30)ctx.fillRect(x,w.y+6,3,3);}
    for(const t of teachers){drawSprite(images.teachers,t.type,5,1,t.x,t.y,105);ctx.fillStyle='#ffe0a2';ctx.textAlign='center';ctx.font='12px system-ui';ctx.fillText(TEACHERS[t.type].name,t.x,t.y+57);}
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
      const brass=ctx.createLinearGradient(-26,-26,26,26);brass.addColorStop(0,'#ffe0a2');brass.addColorStop(.35,'#967047');brass.addColorStop(.65,'#e9bb76');brass.addColorStop(1,'#59412d');
      ctx.fillStyle=brass;ctx.strokeStyle='#412d20';ctx.lineWidth=2;
      ctx.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=i%2?25:29;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#172a2c';ctx.strokeStyle='#f3c885';ctx.beginPath();ctx.arc(0,0,21,0,Math.PI*2);ctx.fill();ctx.stroke();
      for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;ctx.fillStyle='#ffe2a5';ctx.beginPath();ctx.arc(Math.cos(a)*24,Math.sin(a)*24,2,0,Math.PI*2);ctx.fill();}
      ctx.shadowColor=d.color||'#ffc46c';ctx.shadowBlur=d.color?18:9;ctx.fillStyle=d.color||'#ffe3a7';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 24px Georgia, serif';ctx.fillText(d.label,0,1);ctx.restore();
    }
  }
  function arrival(target,from=1){const t=Math.min(1,Math.max(0,(Date.now()-(special?.createdAt||Date.now()))/720)),ease=1-(1-t)**3;return target+(1-ease)*W*.85*from;}
  function drawRhythmOverlay(){
    const ctx=api.ctx,H=getH(),beat=special?.beat||0,pulse=s.listening?Math.sin((audio.context?.currentTime||0)*Math.PI*110/60):0;
    ctx.save();
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
    const drummerX=arrival(W*.52,-1);ctx.save();ctx.translate(drummerX,H*.53);ctx.rotate(pulse*.014);drawSprite(images.drummer,0,1,1,0,0,360);ctx.restore();
    ctx.textAlign='center';ctx.fillStyle='#ffe2a7';ctx.font='bold 20px Georgia';ctx.fillText('THE DRUMMER · RHYTHM TRIAL',W/2,H*.25);
    ctx.font='12px system-ui';ctx.fillText(`RHYTHM SIGNAL · 110 BPM${rhythmFocus?' · ZILDJIAN FOCUS READY':''}`,W/2,H*.29);
    ctx.restore();
  }
  function drawMelodyOverlay(){
    const ctx=api.ctx,H=getH(),pulse=Math.sin((audio.context?.currentTime||0)*5),x=W*.36,y=H*.47;
    ctx.save();ctx.fillStyle='#081629df';ctx.fillRect(12,H*.18,W-24,H*.64);
    const glow=ctx.createRadialGradient(x,y,15,x,y,W*.6);glow.addColorStop(0,'#854dff99');glow.addColorStop(.55,'#175cff35');glow.addColorStop(1,'#07162600');ctx.fillStyle=glow;ctx.fillRect(12,H*.18,W-24,H*.64);
    for(let i=0;i<5;i++){ctx.strokeStyle=`hsla(${210+i*26} 95% 68% / ${.25+i*.08})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,85+i*18+8*pulse,32+i*12,Math.sin(i)*.22,0,Math.PI*2);ctx.stroke();}
    const keyX=arrival(x,1);drawSprite(images.keytarist,0,1,1,keyX,y,310);
    if(images.keytarExact?.complete&&images.keytarExact.naturalWidth){ctx.save();ctx.translate(keyX-3,y+19);ctx.rotate(-.17);ctx.drawImage(images.keytarExact,-132,-44,264,88);ctx.restore();}
    ctx.fillStyle='#edf3ff';ctx.textAlign='center';ctx.font='bold 19px Georgia';ctx.fillText('MELODY MEMORY',W/2,H*.25);ctx.font='12px system-ui';ctx.fillStyle='#a8c8ff';ctx.fillText(s.listening?'♫ LISTEN TO THE LINE':'TAP A TITLE OR SAY IT IN ENGLISH',W/2,H*.29);ctx.restore();
  }
  function drawModeOverlay(){
    const ctx=api.ctx,H=getH(),pulse=Math.sin((audio.context?.currentTime||0)*4),x=arrival(W*.59,-1),y=H*.49;
    ctx.save();ctx.fillStyle='#11101cdf';ctx.fillRect(12,H*.18,W-24,H*.64);const glow=ctx.createRadialGradient(x,y,15,x,y,W*.62);glow.addColorStop(0,'#c54f9a8c');glow.addColorStop(.5,'#3e79b43a');glow.addColorStop(1,'#080b1500');ctx.fillStyle=glow;ctx.fillRect(12,H*.18,W-24,H*.64);
    for(let i=0;i<6;i++){ctx.strokeStyle=`hsla(${285-i*17} 88% 68% / ${.18+i*.055})`;ctx.beginPath();ctx.ellipse(x,y,70+i*17+5*pulse,29+i*9,-.22,0,Math.PI*2);ctx.stroke();}
    drawSprite(images.guitarist,0,1,1,x,y,330);
    if(images.guitarExact?.complete&&images.guitarExact.naturalWidth){ctx.save();ctx.translate(x-4,y-1);ctx.rotate(-.18);ctx.drawImage(images.guitarExact,-168,-47,336,94);ctx.restore();}
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

return {PILOTS,TEACHERS,ARTIFACTS,RHYTHMS,RHYTHM_HINTS,RHYTHM_LEVELS,rhythmIds,POLYRHYTHMS,polyEvents,NUMBER_LABELS,NUMBER_OFFSETS,TONE_OFFSETS,TONE_PROGRAMS,TONE_MODES,MELODIES,MODES,toneMission,toneAnswer,orderedTargets,gradeNumber,obstacleRow,touchesWall,createExpedition};
})();
const module_audio=(()=>{
const {cueEvents}=module_music;
const {intervalCue}=module_intervals;
const {polyEvents}=module_expedition;
// A sustained, pitch-stable two-oscillator arcade synth. No sample/network
// dependency and no detuning/vibrato that could blur interval recognition.
class FlightAudio {
  constructor(){this.context=null;this.voices=new Set();this.timers=new Set();this.token=0;this.lastCue=null;}
  async unlock(){
    const Engine=window.AudioContext||window.webkitAudioContext;
    if(!Engine)throw new Error('Браузер не поддерживает Web Audio. Открой игру в Safari или Chrome.');
    if(!this.context||this.context.state==='closed'){
      this.context=new Engine();this.master=this.context.createGain();this.master.gain.value=.5;
      const compressor=this.context.createDynamicsCompressor();compressor.threshold.value=-16;compressor.ratio.value=4;
      this.master.connect(compressor);compressor.connect(this.context.destination);
    }
    try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
    await this.context.resume();
    if(this.context.state!=='running')throw new Error('Звук приостановлен. Нажми «Продолжить» ещё раз.');
    this.note(57,this.context.currentTime,.07,'soft',.00003);
  }
  note(midi,at,duration,timbre='synth',level=.38){
    const ctx=this.context;if(!ctx)return;
    const fundamental=440*2**((midi-69)/12),envelope=ctx.createGain(),filter=ctx.createBiquadFilter();
    const body=ctx.createOscillator(),core=ctx.createOscillator(),coreGain=ctx.createGain();
    body.type=timbre==='soft'?'triangle':'sawtooth';core.type='sine';
    body.frequency.setValueAtTime(fundamental,at);core.frequency.setValueAtTime(fundamental,at);coreGain.gain.value=.4;
    filter.type='lowpass';filter.Q.value=.65;
    const cutoff=Math.min(4800,Math.max(1400,fundamental*5));
    filter.frequency.setValueAtTime(cutoff,at);filter.frequency.exponentialRampToValueAtTime(cutoff*.65,at+Math.min(.25,duration*.4));
    level*=.6;
    envelope.gain.setValueAtTime(.00001,at);envelope.gain.exponentialRampToValueAtTime(level,at+.016);
    envelope.gain.exponentialRampToValueAtTime(level*.72,at+Math.min(.14,duration*.35));
    envelope.gain.setValueAtTime(level*.72,at+duration*.74);
    envelope.gain.exponentialRampToValueAtTime(.00001,at+duration);
    body.connect(filter);core.connect(coreGain);coreGain.connect(filter);filter.connect(envelope);envelope.connect(this.master);
    let remaining=2;
    for(const oscillator of [body,core]){
      oscillator.start(at);oscillator.stop(at+duration+.005);this.voices.add(oscillator);
      oscillator.onended=()=>{oscillator.disconnect();this.voices.delete(oscillator);if(--remaining===0){coreGain.disconnect();filter.disconnect();envelope.disconnect();}};
    }
  }
  schedule(callback,seconds){const id=setTimeout(()=>{this.timers.delete(id);callback();},seconds*1000);this.timers.add(id);}
  play(route,chord,sector,onPart,onEnd){
    this.stop();const token=this.token,cue=cueEvents(route,chord,sector),start=this.context.currentTime;
    this.lastCue={...cue,key:route.key,register:route.register,contextState:this.context.state,sound:'sustained synth'};
    for(const event of cue.events){
      for(const midi of event.notes)this.note(midi,start+event.at,event.duration,route.timbre,.58/Math.sqrt(event.notes.length));
      if(event.part!=='tone')this.schedule(()=>{if(token===this.token)onPart(event.part);},event.at);
    }
    this.schedule(()=>{if(token===this.token)onEnd();},cue.duration);
  }
  example(route,offset,quality='maj',sector=0,onPart=()=>{},onEnd=()=>{}){this.play(route,{offset,quality},sector,onPart,onEnd);}
  interval(base,semitones,mode,onEnd){
    this.stop();const token=this.token,cue=intervalCue(base,semitones,mode),start=this.context.currentTime;
    this.lastCue={...cue,kind:'interval',base,semitones,mode,sound:'sustained synth'};
    for(const event of cue.events)for(const midi of event.notes)this.note(midi,start+event.at,event.duration,'synth',.5/Math.sqrt(event.notes.length));
    this.schedule(()=>{if(token===this.token)onEnd();},cue.duration);
  }
  chordOnly(root,intervals,onEnd,mode='together'){
    this.stop();const token=this.token,start=this.context.currentTime;
    const notes=intervals.map(n=>root+n),order=mode==='down'?[...notes].reverse():notes;
    const step=mode==='together'?0:.24,duration=1.95+step*(notes.length-1);
    this.lastCue={kind:'chord-only',root,notes,mode,sound:'sustained synth'};
    order.forEach((note,i)=>this.note(note,start+.12+i*step,1.65,'synth',.6/Math.sqrt(notes.length)));
    this.schedule(()=>{if(token===this.token)onEnd();},duration);
  }
  guide(root,target,onEnd){
    this.stop();const token=this.token,start=this.context.currentTime;
    [0,4,7,10].forEach(n=>this.note(root+n,start+.12,.85,'soft',.24));
    this.note(root+(target==='3'?4:10),start+1.25,1.15,'synth',.45);
    this.schedule(()=>{if(token===this.token)onEnd();},2.6);
  }
  announce(text,onEnd){
    this.stop();const token=this.token;
    if(typeof window==='undefined'||!window.speechSynthesis||!window.SpeechSynthesisUtterance){this.schedule(()=>{if(token===this.token)onEnd();},.1);return;}
    const utterance=new window.SpeechSynthesisUtterance(text),voices=window.speechSynthesis.getVoices();
    utterance.lang='en-US';utterance.rate=.78;utterance.pitch=.72;utterance.volume=.95;
    utterance.voice=voices.find(v=>/Alex|Daniel|Reed|Ralph|Fred|Rocko/i.test(v.name)&&/^en/i.test(v.lang))||voices.find(v=>/^en[-_](US|GB)/i.test(v.lang))||null;
    let finished=false;const finish=()=>{if(finished||token!==this.token)return;finished=true;onEnd();};
    utterance.onend=finish;utterance.onerror=finish;window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
    this.schedule(finish,Math.max(3.2,text.length*.075));
  }
  trumpetChord(root,intervals,onEnd){
    this.stop();const token=this.token,start=this.context.currentTime+.08,phrase=[0,7,10,12];
    phrase.forEach((n,i)=>this.note(root+12+n,start+i*.18,.48,'synth',.34));
    const chordAt=start+1.0,notes=intervals.map(n=>root+n);notes.forEach(note=>this.note(note,chordAt,1.75,'synth',.62/Math.sqrt(notes.length)));
    this.lastCue={kind:'trumpeter-chord',root,notes,spoken:true,sound:'brass synth'};
    this.schedule(()=>{if(token===this.token)onEnd();},2.9);
  }
  melody(root,pattern,onEnd){
    this.stop();const token=this.token,start=this.context.currentTime+.12;let cursor=0;
    pattern.notes.forEach((offset,i)=>{const beats=pattern.beats[i]||.5;this.note(root+offset,start+cursor,Math.max(.22,beats*.46),'soft',.44);cursor+=beats*.48;});
    this.lastCue={kind:'melody-memory',root,name:pattern.name,notes:[...pattern.notes],sound:'keytar synth'};
    this.schedule(()=>{if(token===this.token)onEnd();},cursor+.35);
  }
  scale(root,mode,direction,onEnd){
    this.stop();const token=this.token,start=this.context.currentTime+.12,notes=(direction==='down'?[...mode.notes].reverse():mode.notes).map(n=>root+n);
    notes.forEach((note,i)=>this.note(note,start+i*.25,.58,'synth',.36));
    this.lastCue={kind:'mode-scale',root,name:mode.name,direction,notes,sound:'guitar synth'};
    this.schedule(()=>{if(token===this.token)onEnd();},notes.length*.25+.55);
  }
  drum(voice,at){
    const ctx=this.context,osc=ctx.createOscillator(),gain=ctx.createGain();
    const freq={kick:120,snare:185,hat:7200,ride:4800,clave:1800,rim:1100}[voice];
    const duration=voice==='ride'?.22:voice==='kick'?.18:.07;
    osc.type=['hat','ride','snare'].includes(voice)?'square':'sine';
    osc.frequency.setValueAtTime(freq,at);osc.frequency.exponentialRampToValueAtTime(voice==='kick'?42:freq*.78,at+duration);
    gain.gain.setValueAtTime(voice==='kick'?.35:voice==='snare'?.13:voice==='clave'?.15:.035,at);
    gain.gain.exponentialRampToValueAtTime(.00001,at+duration);
    osc.connect(gain);gain.connect(this.master);osc.start(at);osc.stop(at+duration+.01);this.voices.add(osc);
    osc.onended=()=>{this.voices.delete(osc);osc.disconnect();gain.disconnect();};
  }
  rhythm(pattern,onEnd,{loops=1,onBeat=()=>{}}={}){
    this.stop();const token=this.token,start=this.context.currentTime+.15,beat=60/110;
    const beats=pattern.beats||8;
    for(let loop=0;loop<loops;loop++){
      for(const event of pattern.events){const at=start+(loop*beats+event.beat)*beat;
        if(event.voice==='bass')this.note(event.midi,at,.34,'synth',.42);
        else if(event.voice==='keys')for(const midi of event.notes)this.note(midi,at,.26,'synth',.25);
        else this.drum(event.voice,at);
      }
      for(let i=0;i<beats;i++)this.schedule(()=>{if(token===this.token)onBeat(i,loop);},.15+(loop*beats+i)*beat);
    }
    this.schedule(()=>{if(token===this.token)onEnd();},beats*loops*beat+.4);
  }
  poly(pattern,onEnd,{cycles=3,layer='both',onHit=()=>{}}={}){
    this.stop();const token=this.token,start=this.context.currentTime+.15,beat=60/110;
    for(const event of polyEvents(pattern,cycles,layer)){
      this.drum(event.voice,start+event.beat*beat);
      this.schedule(()=>{if(token===this.token)onHit(event);},.15+event.beat*beat);
    }
    this.lastCue={kind:'polyrhythm',a:pattern.a,b:pattern.b,cycles,layer};
    this.schedule(()=>{if(token===this.token)onEnd();},cycles*4*beat+.4);
  }
  stop(){this.token++;this.timers.forEach(clearTimeout);this.timers.clear();this.voices.forEach(v=>{try{v.stop();}catch{}});this.voices.clear();try{if(typeof window!=='undefined')window.speechSynthesis?.cancel();}catch{}}
}

return {FlightAudio};
})();
const module_i18n=(()=>{
// UI language is device-local. Musical symbols and style names stay unchanged.
const pairs=[
['Перетаскивай корабль по полю или управляй стрелками. Ответы — кнопки под полем.','Drag the ship or use arrow keys. Answer with the buttons below.'],['Игровое поле','Flight field'],['Музыкальное оружие','Musical weapons'],['Прогресс сектора','Sector progress'],['Последняя распознанная цифровка','Last recognized chord symbol'],['Повторить тонику и сигнал','Replay tonic and signal'],['Повторить звучание — пробел','Replay sound — Space'],['начало','home'],
['Ангар кораблей','Ship hangar'],['Инженерия звука','Engineering sound'],['Четыре машины. Нажми изображение, чтобы открыть оригинал.','Four machines. Tap an image to open the original.'],['Полёт на паузе · выбери стиль или партию, чтобы вернуться','Flight paused · identify the style or part to return'],['РИТМ-КОМНАТА','RHYTHM ROOM'],['Узнай стиль или партию — вернись в полёт','Identify the style or part to resume flight'],
['Сначала познакомимся со звуками.','First, explore the sounds.'],['Услышь I и V','Recognize I and V'],['Сначала звучит тоника I, потом сигнал гидры. Узнай: это I или V?','First hear tonic I, then the enemy signal. Is it I or V?'],['Во время сигнала гидра не атакует. Тяни корабль пальцем; правильная кнопка заряжает выстрел.','The enemy waits while the signal plays. Drag the ship; the correct button powers your shot.'],['Корень + тип аккорда','Root + chord quality'],['Верхний блок оружия — ступень корня. Нижний — точный тип аккорда: maj, 6, m7 или 7sus4. Пробивай щиты в любом порядке.','Select a root degree and an exact chord quality: maj, 6, m7 or 7sus4. Break the shields in either order.'],['Бас даёт усиление сразу. Два пробитых щита уничтожают гидру. Ошибка не восстанавливает уже пробитый щит.','Recognizing the root powers your weapon immediately. Break both shields to neutralize the ship. A mistake does not restore a broken shield.'],
['Вся хроматика. Точная цифровка.','All chromatic roots. Exact chord symbols.'],['12 корней × 22 типа аккорда. Например: ♭IImaj7 или IIIm7. Типы оружия переключаются вкладками «Аккорды» / «Альтерации».','12 roots × 22 chord qualities. For example, ♭IImaj7 or IIIm7. Switch quality banks with Chords / Alterations.'],['Альтерации','Alterations'],['ДВОЙНОЙ ЩИТ','DUAL SHIELD'],['ХРОМАТИЧЕСКИЙ ПОЛЁТ','CHROMATIC FLIGHT'],['ПЕРЕПРАВА','CROSSING'],['Корень и точный тип — в любом порядке','Root and exact quality — either order'],['Корень + тип → цифровка','Root + quality → chord symbol'],
['Ровные восьмые; малый барабан на 2 и 4.','Straight eighths; snare on beats 2 and 4.'],['Длинная и короткая доли в каждой паре; устойчивый бэкбит.','Long-short pairs with a steady backbeat.'],['Рисунок ride: пульс и короткая нота перед следующей долей.','Ride pattern: a steady pulse and a short pickup into the next beat.'],['Пять ударов: три в первом такте, два во втором.','Five strokes: three in bar one, two in bar two.'],['Пять ударов: два в первом такте, три во втором.','Five strokes: two in bar one, three in bar two.'],['Ровные восьмые, синкопированный обод и мягкая басовая опора.','Straight eighths, syncopated rim and soft bass support.'],['Синкопы бас-барабана между основными долями.','Syncopated kick between the main beats.'],['One drop: бас и обод на третьей доле такта.','One drop: kick and rim on beat three.'],['Бас-барабан на каждой доле, открытый рисунок между долями.','Kick on every beat with offbeat hi-hat.'],['Три доли в такте; свинговое движение ride.','Three beats per bar with a swung ride pattern.'],['Учебный Mambo: синкопированный верхний рисунок и басовая опора.','Mambo study: syncopated upper pattern and bass support.'],['Учебный Calypso: ровный шаг и синкопированный рисунок между долями.','Calypso study: a steady step and syncopated offbeat pattern.'],['Семь ударов колокольчика внутри двенадцати подразделений. Четыре крупных пульса.','Seven bell strokes across twelve subdivisions, with four main pulses.'],['Третий удар трёхударной стороны на полдоли позже, чем в Son Clave.','The third stroke on the three-stroke side is half a beat later than Son Clave.'],['Учебный Cha-cha-cha: ровный верхний пульс и дробный ответ обода.','Cha-cha-cha study: steady bell pulse with a busier rim response.'],['Учебная Samba: повторяющаяся короткая пара басовых ударов и синкопы сверху.','Samba study: repeating close kick pairs with upper syncopation.'],['Басовая партия Tumbao: синкопированные опоры, оставляющие первую долю пустой. Это партия, а не весь стиль.','Tumbao bass part: syncopated support leaving beat one empty. This is a part, not a complete style.'],['Клавишная партия Montuno: повторяющийся синкопированный аккордовый рисунок. Это партия, а не весь стиль.','Montuno keyboard part: a repeating syncopated chord pattern. This is a part, not a complete style.'],['Учебный Charleston: характерная пара атак на 1 и «и» второй доли.','Charleston study: the characteristic attacks on beat one and the upbeat of two.'],['Учебный Rock ’n’ Roll: шаффл, бэкбит и движущийся басовый рисунок.','Rock ’n’ Roll study: shuffle, backbeat and a moving bass figure.'],
['Ознакомление со звуками','Sound library'],['СЛУХОВОЙ АНГАР · БЕЗ ТАЙМЕРА','SOUND HANGAR · NO TIMER'],
['Тот же синтезатор, что в полёте. Нажми символ, чтобы услышать его. Сравни maj → maj7 → 7: у двух последних добавлена разная септима.','The same synth as in flight. Tap a symbol to hear it. Compare maj → maj7 → 7: the last two add different sevenths.'],
['Один интервал — одна цифра. Ошибка завершает попытку','One interval, one token. A wrong pickup ends the attempt'],
['Один интервал — один жетон.','One interval, one token.'],['Слушай. Лови. Усиливайся.','Listen. Catch. Power up.'],
['Магистр музыки','Master of Music'],['Херби Хэнкок','Herbie Hancock'],['Новичок','Beginner'],['Студент','Student'],
['I и V · спокойный полёт · помощь','I and V · gentle flight · guidance'],['Два щита · основные аккорды','Two shields · core chords'],['12 корней · 22 типа · все интервалы','12 roots · 22 qualities · all intervals'],['Вся гармония · быстрые враги · узкие проходы','Full harmony · fast enemies · narrow passages'],
['Лови звуки. Обходи скалы.','Catch sounds. Navigate the rocks.'],['Пробивай путь к своей музыке.','Find your way to your music.'],
['Послушать новые сигналы','Learn the new signals'],['Сразу в бой','Start flight'],['Артефакты и правила','Artifacts and rules'],['ПАМЯТКА ПИЛОТА','PILOT GUIDE'],
['Продолжить полёт','Resume flight'],['Выбрать уровень','Choose difficulty'],['На базу','Back to base'],['Вернуться','Back'],['Повторить','Replay'],['Послушать ещё','Listen again'],['Слушать','Listen'],['Слушай','Listen'],['Запомнил','Got it'],['В бой','Fly'],
['Аккорды','Chords'],['Интервалы','Intervals'],['Полиритмы','Polyrhythms'],['Ритмы','Rhythms'],['Вместе','Together'],['Вверх','Up'],['Вниз','Down'],['По кругу','Loop'],['Оба слоя','Both layers'],['Высокий','High'],['Низкий','Low'],['Стоп','Stop'],['Остановлено','Stopped'],
['Повтори или выбери другой символ для сравнения','Replay or choose another symbol to compare'],['Интервал от одного опорного звука','Interval from one reference pitch'],['сначала сравни слои отдельно','compare the separate layers first'],['высоких ударов против','high hits against'],['низких за один общий цикл','low hits in one shared cycle'],['В игре с уровня','Available in flight from'],['в игре с уровня','available in flight from'],['Корень C3 · выбери звук','Root C3 · choose a sound'],['корень C3','root C3'],['слушай рисунок','listen to the pattern'],
['мажорное трезвучие','major triad'],['минорное трезвучие','minor triad'],['большой мажорный септаккорд','major seventh chord'],['доминантсептаккорд','dominant seventh chord'],['минорный септаккорд','minor seventh chord'],['мажорный с секстой','major sixth'],['минорный с секстой','minor sixth'],['полууменьшённый','half diminished'],['уменьшённый септаккорд','diminished seventh'],['септаккорд с задержанием','suspended seventh'],['увеличенное трезвучие','augmented triad'],['малая терция','minor third'],['большая терция','major third'],['чистая квинта','perfect fifth'],['малая септима','minor seventh'],['большая септима','major seventh'],
['Подсказка','Hint'],['Использовать подсказку','Use a hint'],['Как играть','How to play'],['Пауза','Pause'],['ПАУЗА','PAUSED'],['Держим позицию.','Holding position.'],['Включи звук · наушники помогут','Enable audio · headphones help'],['рекорд','best'],['ЩИТ КОРАБЛЯ','SHIP SHIELD'],['Щит:','Shield:'],['из 5','of 5'],['СЕКТОР','SECTOR'],['ЛУНА','MOON'],['МАРС','MARS'],['МАЯК','BEACON'],['Готовимся к полёту','Preparing for flight'],['Ожидание пилота','Waiting for pilot'],
['СОБЕРИ ИНТЕРВАЛ','CATCH THE INTERVAL'],['ВЫСОКИЙ : НИЗКИЙ','HIGH : LOW'],['УЗНАЙ СИГНАЛ — ВЫСТРЕЛИ','IDENTIFY THE SIGNAL — FIRE'],['ВЫБЕРИ СИГНАЛ — ВЫСТРЕЛИ','CHOOSE THE SIGNAL — FIRE'],['ДВА ЩИТА · ДВА ВИДА ОРУЖИЯ','TWO SHIELDS · TWO WEAPONS'],['Ступень','Degree'],['Тип','Quality'],['БАС','ROOT'],['ТИП','QUALITY'],['ИМПУЛЬС','PULSE'],['КОМБО','COMBO'],['РАЗГОН · ВЕЕРНЫЙ ОГОНЬ','BOOST · SPREAD FIRE'],
['Выбери ступень относительно тоники I','Choose a degree relative to tonic I'],['Узнай сигнал и стреляй','Identify the signal and fire'],['Пробей оба щита','Break both shields'],['Поймай цифру услышанного интервала','Catch the token for the interval you heard'],['Узнай на слух','Identify by ear'],['Выбери услышанное','Choose what you heard'],['Слушай артефакт','Listen to the artifact'],['Слушай опору','Listen to the tonic'],['тоника — точка отсчёта','tonic — your reference'],['Сигнал гидры','Enemy signal'],['Слушай тип аккорда','Listen to the chord quality'],
['Попытка потеряна · нужно','Attempt lost · correct token:'],['Время вышло · попробуем ещё','Time is up · try again'],['Выбрано','Selected'],['звучит','playing'],['Звучит','Playing'],['нейтрализованы','neutralized'],['нейтрализуются','are neutralized'],['учителя','teachers'],['учитель атакует','teacher approaching'],['Литература','Literature'],['Математика','Mathematics'],['Химия','Chemistry'],['Физ-ра','PE'],['НВП','Civil defense'],['силы','energy'],['Щит задет · продолжай полёт','Shield hit · keep flying'],['Щит пробит','Shield broken'],['щиты пробиты','shields broken'],['тип распознан','quality identified'],['Тяни корабль · стрельба автоматическая','Drag to fly · automatic fire'],['Попробовать сбор интервалов','Try interval tokens'],['Попробовать','Try'],['Сигнал:','Signal:'],['Тип аккорда:','Chord quality:'],['тоника','tonic'],['пятая','fifth'],['четвёртая','fourth'],['третья','third'],['вторая','second'],['шестая','sixth'],['седьмая','seventh'],['РАЗВЕДЧИК','SCOUT'],['КОРВЕТ','CORVETTE'],['КРЕЙСЕР','CRUISER'],['КРЕПОСТЬ','FORTRESS'],
['Тренажёр ступеней и аккордов','Degree and chord trainer'],['ТРЕНАЖЁР · БЕЗ ВРАГОВ И ТАЙМЕРА','TRAINER · NO ENEMIES OR TIMER'],['Слуховой полигон','Ear training range'],['Звучание такое же, как в полёте. Ступень можно услышать вверх или вниз: ответ всегда обозначает расстояние от тоники. У аккордов меняется направление звучания, а тип остаётся тем же.','The sound is the same as in flight. A degree may play upward or downward; the answer always names its distance from the tonic. Chord direction changes, but its quality does not.'],['Ступени','Degrees'],['Нажми вариант ответа','Choose an answer'],['Пока нет ответов','No answers yet'],['верно','correct'],['направление:','direction:'],['восходящее','ascending'],['нисходящее','descending'],['одновременно','together'],['Следующий сигнал','Next signal'],['Точный слуховой захват','Accurate ear catch'],['Сверь обозначение и послушай ещё','Check the symbol and listen again'],['Верный ответ:','Correct answer:'],['точно!','exact!'],
['Квартет вышел на поле · полёт удержан, выбери стиль или партию','The quartet has arrived on the field · flight is held while you identify the style or part'],['РИТМ-ПАУЗА · КВАРТЕТ НА ПОЛЕ','RHYTHM PAUSE · QUARTET ON FIELD'],['Узнай стиль или партию — и продолжим тот же полёт','Identify the style or part, then resume this flight'],
];
function installLanguage(){
  if(typeof MutationObserver==='undefined')return;
  let language='ru';try{language=localStorage.getItem('ear-game-language')==='en'?'en':'ru';}catch{}
  const originals=new WeakMap(),attributes=new WeakMap(),button=document.getElementById('language');
  const ordered=[...pairs].sort((a,b)=>b[0].length-a[0].length);
  const translate=text=>{for(const [ru,en] of ordered)text=text.split(ru).join(en);return text;};
  function apply(){
    observer.disconnect();document.documentElement.lang=language;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
    while((node=walker.nextNode())){if(['SCRIPT','STYLE'].includes(node.parentElement?.tagName))continue;const old=originals.get(node);const raw=old&&node.nodeValue===old.rendered?old.raw:node.nodeValue;const rendered=language==='en'?translate(raw):raw;if(node.nodeValue!==rendered)node.nodeValue=rendered;originals.set(node,{raw,rendered});}
    for(const el of document.querySelectorAll('[aria-label],[title]')){if(el===button)continue;const saved=attributes.get(el)||{};for(const key of ['aria-label','title']){if(!el.hasAttribute(key))continue;const value=el.getAttribute(key),old=saved[key],raw=old&&old.rendered===value?old.raw:value,rendered=language==='en'?translate(raw):raw;if(value!==rendered)el.setAttribute(key,rendered);saved[key]={raw,rendered};}attributes.set(el,saved);}
    button.textContent=language==='ru'?'RU / EN':'EN / RU';button.setAttribute('aria-label',language==='ru'?'Switch to English':'Переключить на русский');
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }
  const observer=new MutationObserver(apply);button.addEventListener('click',()=>{language=language==='ru'?'en':'ru';try{localStorage.setItem('ear-game-language',language);}catch{}apply();});apply();
}

return {installLanguage};
})();
const module_assets_loader=(()=>{
const pendingImages=new WeakMap();
function loadFlightImage(image,url,timeout=20000){
  if(image.complete&&image.naturalWidth)return Promise.resolve();
  if(pendingImages.has(image))return pendingImages.get(image);
  const task=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>finish(new Error(`Не загрузилась графика: ${url}. Проверь соединение и повтори.`)),timeout);
    const finish=error=>{clearTimeout(timer);image.onload=null;image.onerror=null;error?reject(error):resolve();};
    image.onload=()=>image.naturalWidth?finish():finish(new Error(`Пустая картинка: ${url}`));
    image.onerror=()=>finish(new Error(`Не загрузилась графика: ${url}. Нажми «Попробовать ещё».`));
    image.src=url;
  });
  pendingImages.set(image,task);
  task.then(()=>pendingImages.delete(image),()=>pendingImages.delete(image));
  return task;
}

return {loadFlightImage};
})();
const module_game=(()=>{
const {DEGREES,QUALITIES,INTERVALS,SECTORS,createRoute,answerResult,family,QUALITY_BANKS,chordSymbol}=module_music;
const {FlightAudio}=module_audio;
const {loadFlightImage}=module_assets_loader;
const {installLanguage}=module_i18n;
const {pressure,formation,stepDrone,hitCircle}=module_combat;
const {INTERVAL_TARGETS,INTERVAL_MODES,targetForSector,createCapsule,capsuleOutcome}=module_intervals;
const {PILOTS,ARTIFACTS,NUMBER_LABELS,NUMBER_OFFSETS,RHYTHMS,RHYTHM_HINTS,RHYTHM_LEVELS,POLYRHYTHMS,createExpedition}=module_expedition;

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
  player:{x:240,y:500,tx:240,ty:500},keys:new Set(),pointer:null,feedbackTimer:0};
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
let study={kind:'chord',quality:'maj',interval:'♭3',rhythm:0,poly:0,layer:'both',root:48,mode:'together',loop:false,back:'start'};
let trainer={kind:'degree',level:2,target:null,direction:'up',total:0,correct:0,locked:false,revealed:false,back:'start'};
function machineSize(model){return Math.min(100,H*.20)*(1.35+model*.23);}
function machinePorts(model){const size=machineSize(model);return Array.from({length:2+model*2},(_,i)=>({x:(i%2?1:-1)*size*.37,y:size*(.22-Math.floor(i/2)*.16)}));}
function resize(){const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const oldH=H;H=rect.height*480/rect.width;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);if(['start','briefing'].includes(s.mode))s.player.y=s.player.ty=H-65;else{s.player.y*=H/oldH;s.player.ty*=H/oldH;}}
new ResizeObserver(resize).observe(canvas);
function save(){try{const old=JSON.parse(localStorage.getItem('ear-reharm-game.v1')||'{}');localStorage.setItem('ear-reharm-game.v1',JSON.stringify({best:Math.max(old.best||0,s.score),unlocked:Math.max(old.unlocked||0,s.sector),lastStats:s.stats,intervalStats:s.intervalStats}));}catch{}}
function record(){try{return JSON.parse(localStorage.getItem('ear-reharm-game.v1')||'{}');}catch{return {};}}
function overlay(html){$('overlay').innerHTML=`<div class="overlay-card">${html}</div>`;$('overlay').scrollTop=0;$('overlay').hidden=false;}
function hideOverlay(){$('overlay').hidden=true;}
function action(label,fn,secondary=false){const b=document.createElement('button');b.className=secondary?'secondary':'primary';b.textContent=label;$('overlay').firstElementChild.append(b);b.addEventListener('click',fn);return b;}
function signal(text,listening=false){$('signal-text').textContent=text;$('signal').classList.toggle('listening',listening);}
function feedback(text,error=false){$('feedback').textContent=text;$('feedback').className=`feedback visible${error?' error':''}`;s.feedbackTimer=2.0;}
function renderHud(){
  $('score').textContent=String(s.score).padStart(6,'0');$('health').textContent='▰'.repeat(s.health)+'▱'.repeat(5-s.health);$('health').setAttribute('aria-label',`Щит: ${s.health} из 5`);
  $('sector-name').textContent=`СЕКТОР 0${s.sector+1} · ${SECTORS[s.sector].name.toUpperCase()}`;
  $('weapon').textContent=s.overdrive>0?'РАЗГОН · ВЕЕРНЫЙ ОГОНЬ':`ИМПУЛЬС ×${s.power}`;$('combo').textContent=`КОМБО ${s.combo} · ⚡ ${s.energy}%`;
  $('route-track').innerHTML=Array.from({length:SECTORS[s.sector].count},(_,i)=>`<i class="${i<s.cleared?'done':i===s.cleared?'current':''}"></i>`).join('');
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
  if(expedition.pausedCombat){const labels={rhythm:['РИТМ-ПАУЗА · БАРАБАНЩИК НА ПОЛЕ','Узнай стиль или партию — и продолжим тот же полёт'],melody:['МЕЛОДИЧЕСКАЯ ПАУЗА · KEY PILOT','Выбери название или произнеси его по-английски'],mode:['ЛАДОВАЯ ПАУЗА · GUITAR PILOT','Узнай лад по восходящей или нисходящей гамме']},copy=labels[expedition.pauseKind]||labels.rhythm;$('dock-label').textContent=copy[0];$('dock-tip').textContent=copy[1];}
  $('interval-reference').disabled=s.mode!=='resolving'||s.listening;
  $('pause').disabled=['start','finished','gameover','loading'].includes(s.mode);
  if(s.enemy){$('shield-tags').innerHTML=`<span class="shield-tag ${s.enemy.shields.bass?'broken':''}">◇ БАС</span>${s.sector>=2?`<span class="shield-tag quality ${s.enemy.shields.quality?'broken':''}">✧ ТИП</span>`:''}`;}
}
function startScreen(){
  renderHud();buildPads();
  overlay('<span class="eyebrow">STEAM / SOUND / SPACE</span><h1>Signal<br><span class="accent">Expedition.</span></h1><p>Лови звуки. Обходи скалы.<br>Пробивай путь к своей музыке.</p>');
  PILOTS.forEach((pilot,i)=>{const b=action(pilot.name,()=>startRun(pilot.sector,i),true);b.className='pilot-choice';const info=document.createElement('small');info.textContent=pilot.description;b.append(info);});
  action('♫ Ознакомление со звуками',()=>openStudy(),true);
  action('Тренажёр ступеней и аккордов',()=>openTrainer(),true);
  action('Ангар кораблей',()=>{overlay('<span class="eyebrow">HYDRA FLEET</span><h2>Инженерия звука</h2><p class="compact">Четыре машины. Нажми изображение, чтобы открыть оригинал.</p><div class="ship-gallery">'+['scout-art','corvette','cruiser-art','fortress'].map((name,i)=>`<a href="assets/${name}.png" target="_blank" rel="noopener"><img src="assets/${name}.png" alt="${MACHINES[i]}"><span>${MACHINES[i]}</span></a>`).join('')+'</div>');action('Вернуться',startScreen,true);},true);
  const note=document.createElement('p');note.className='quiet-note';note.textContent=`Включи звук · наушники помогут${record().best?' · рекорд '+record().best:''}`;$('overlay').firstChild.append(note);
}
async function startRun(sector,level=sector===0?0:sector===2?1:2){
  const token=++runToken;s.mode='loading';overlay('<span class="eyebrow">ПОДГОТОВКА К ВЫЛЕТУ</span><h2>Включаем звук…</h2><p>Запускаем синтезатор корабля.</p>');
  try{await audio.unlock();if(token!==runToken)return;
    await prepareFlightImages((ready,total)=>{if(token===runToken)overlay(`<span class="eyebrow">ПОДГОТОВКА К ВЫЛЕТУ</span><h2>Загружаем графику · ${ready}/${total}</h2><p>Корабли, планеты и музыканты</p>`);});if(token!==runToken)return;
    Object.assign(s,{sector,routeNumber:0,position:0,cleared:0,totalCleared:0,score:0,combo:0,health:5,power:1,attempts:0,correct:0,firstTry:0,replays:0,stats:{bass:{hit:0,miss:0},quality:{hit:0,miss:0}},bullets:[],shots:[],particles:[],enemy:null,invulnerable:0,drones:[],waveTimer:0,waveIndex:0,overdrive:0,energy:0,rings:[],travel:0,droneKills:0,capsule:null,capsuleTimer:0,intervalStats:{caught:0,wrong:0,missed:0,avoided:0}});
    expedition.reset(level);beginSector(sector);
  }catch(e){if(token!==runToken)return;s.mode='start';overlay(`<h2>Подготовка прервана</h2><p>${e.message}</p>`);action('Попробовать ещё',()=>startRun(sector,level));}
}
function beginSector(sector){
  weaponTab='bass';
  s.sector=sector;s.cleared=0;s.position=0;s.routeNumber=0;s.health=5;s.bullets=[];s.shots=[];s.enemy=null;s.drones=[];s.overdrive=0;s.waveTimer=1;s.capsule=null;s.capsuleTimer=0;
  $('recognized-chord').textContent='';$('feedback').textContent='';s.feedbackTimer=0;$('feedback').classList.remove('visible');signal('Готовимся к полёту');qualityBank=0;s.route=createRoute(sector,s.route?.key);s.listening=false;s.mode='briefing';save();buildPads();renderHud();$('enemy-label').hidden=true;
  const c=SECTORS[sector];
  overlay(`<span class="eyebrow">СЕКТОР 0${sector+1} / ${c.name.toUpperCase()}</span><h2>${c.title}</h2><p>${c.description}</p><p class="compact">${sector===0?'Во время сигнала гидра не атакует. Тяни корабль пальцем; правильная кнопка заряжает выстрел.':sector===1?'I, IV и V — ступени относительно тоники. Цифровка написана прямо на оружии.':'Бас даёт усиление сразу. Два пробитых щита уничтожают гидру. Ошибка не восстанавливает уже пробитый щит.'}</p>`);
  action('Послушать новые сигналы',()=>startLessons());action('Skip → Сразу в бой',()=>spawnEnemy(),true);action('♫ Ознакомление со звуками',()=>openStudy(),true);action('Тренажёр ступеней и аккордов',()=>openTrainer(),true);action('Артефакты и правила',()=>artifactGuide(),true);syncPads();
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
  overlay('<span class="eyebrow">ПАМЯТКА ПИЛОТА</span><h2>Слушай. Лови. Усиливайся.</h2><p class="compact">Услышь интервал и поймай одну цифру: малая терция — ♭3, квинта — 5, малая септима — ♭7, большая — 7. Направление звучания не меняет ответ. Для тритона появится один верный жетон: ♭5 или ♯4. Ошибочный захват завершает попытку.<br><br>Telecaster — автомат. Keytar — невидимость. Overdrive — двойной урон и защита. Jazz Bass — услышь 3 или 7 аккорда и поймай цифру: учителя нейтрализуются.<br><br>Красный язык — узнай тип аккорда без ступени для HP 100%. Реликвия барабанщика останавливает полёт и запускает распознавание стиля или партии. Тарелка Zildjian запасает RHYTHM FOCUS: во время задания она убирает половину неверных вариантов.<br><br>Реликвии музыкантов — это светящиеся механические кубы. После захвата в кадр влетает трубач, клавишник, гитарист или барабанщик. Трубач просит BASIC, GUIDE или COLOR TONES; один чужой жетон гасит режим.<br><br>Литература даёт подсказку, Математика — автомат, Химия — невидимость, Физ-ра — защиту, НВП — автомат + невидимость. Для нейтрализации также используй обычные заряды.</p>');
  action('Сразу в бой →',()=>spawnEnemy());
  action('Попробовать сбор интервалов',()=>{spawnEnemy();audio.stop();s.listening=false;expedition.startChallenge('numbers');},true);
  ARTIFACTS.forEach((item,i)=>action(`Попробовать ${item.name}`,()=>{spawnEnemy();audio.stop();s.listening=false;expedition.artifact(i);if(i<2||i===3)playCue();},true));
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
  $('enemy-label').hidden=false;$('enemy-label').firstElementChild.textContent=`HYDRA · ${MACHINES[s.enemy.model]} / ${String(s.totalCleared+1).padStart(2,'0')}`;
  $('dock-label').textContent=s.sector>=2?'ДВА ЩИТА · ДВА ВИДА ОРУЖИЯ':'УЗНАЙ СИГНАЛ — ВЫСТРЕЛИ';
  $('dock-tip').textContent=s.sector<2?'Выбери ступень относительно тоники I':s.sector===3?'Корень + тип → цифровка · m7 ≠ maj7':'Корень и точный тип — в любом порядке';
  s.fireTimer=expedition.pilot.grace;renderHud();playCue();
}
function playCue(){
  if(s.mode!=='active'||!s.enemy)return;
  s.listening=true;syncPads();signal('Слушай опору…',true);
  audio.play(s.route,s.enemy.chord,s.sector,part=>signal(part==='home'?'I · тоника — точка отсчёта':part==='bass'?'♫ Сигнал гидры':'♫ Слушай тип аккорда',true),()=>{
    if(s.mode!=='active')return;s.listening=false;s.fireTimer=Math.max(s.fireTimer,3);signal(s.sector>=2?'Пробей оба щита':'Узнай сигнал и стреляй');syncPads();
  });
}
function answer(kind,value,button){
  if(s.mode!=='active'||s.listening||!s.enemy||expedition.busy)return;
  const outcome=answerResult(s.enemy.chord,s.enemy.shields,kind,value);if(outcome.ignored)return;
  s.attempts++;s.stats[kind][outcome.correct?'hit':'miss']++;
  if(outcome.correct){
    s.correct++;s.enemy.shields=outcome.shields;s.beam=.3;s.enemy.hit=.25;s.score+=kind==='bass'?100:150;
      if(kind==='bass'){s.power=Math.min(3,s.power+1);s.overdrive=7;feedback('Щит пробит · ВЕЕРНЫЙ ОГОНЬ');}
    else feedback(`${QUALITIES[s.enemy.chord.quality].glyph} · тип распознан`);
    if(!outcome.destroyed)weaponTab=kind==='bass'?'quality':'bass';
    burst(s.enemy.x,s.enemy.y,kind==='bass'?'#79f5d0':'#ff7ea7',25);
    if(outcome.destroyed){
      s.combo++;s.totalCleared++;s.cleared++;if(s.enemy.misses===0)s.firstTry++;
      s.score+=200+Math.min(s.combo,10)*25;s.resolveTimer=6;s.mode='resolving';s.bullets=[];s.overdrive=Math.max(s.overdrive,6);s.waveTimer=.3;
      const label=DEGREES[s.enemy.chord.offset];
      feedback(`${s.sector>=2?chordSymbol(s.enemy.chord):label.glyph} · щиты пробиты`);
      $('recognized-chord').textContent=s.sector>=2?chordSymbol(s.enemy.chord):label.glyph;
      burst(s.enemy.x,s.enemy.y,'#f7cd7f',50);s.rings.push({x:s.enemy.x,y:s.enemy.y,age:0});
      s.capsuleTimer=0;
      expedition.afterHydra();
      $('enemy-label').hidden=true;signal('Разгон! Услышь интервал и поймай один жетон');
      if(s.combo%3===0){s.health=Math.min(5,s.health+1);s.score+=100;}
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
  if(s.cleared>=SECTORS[s.sector].count){
    save();s.mode='intermission';$('enemy-label').hidden=true;audio.stop();
    if(s.sector>=2){finish(true);return;}
    overlay(`<span class="eyebrow">СЕКТОР ПРОЙДЕН</span><h2>Чистый сигнал.</h2><p>Путь свободен. Щит корабля восстановлен.<br>Дальше — ${SECTORS[s.sector+1].name.toLowerCase()}.</p><div class="results"><div><strong>${s.score}</strong><span>ОЧКОВ</span></div><div><strong>${s.firstTry}</strong><span>С ПЕРВОГО РАЗА</span></div></div>`);
    action('Лететь дальше →',()=>beginSector(s.sector+1));syncPads();return;
  }
  if(s.position>=s.route.sequence.length){s.position=0;s.routeNumber++;s.route=createRoute(s.sector,s.route.key,Math.random,s.routeNumber);}
  spawnEnemy();
}
function finish(won){
  s.mode=won?'finished':'gameover';audio.stop();s.listening=false;save();syncPads();
  const accuracy=s.attempts?Math.round(s.correct/s.attempts*100):0;
  overlay(`<span class="eyebrow">${won?'МАРШРУТ ЗАВЕРШЁН':'КОРАБЛЬ ВЕРНУЛСЯ НА БАЗУ'}</span><h2>${won?'Ты слышишь дальше.':'Ещё один вылет?'}</h2><p>${won?'Ступени и цифровки аккордов становятся частью твоего оружия.':'Сигналы становятся знакомее с каждым полётом. Попробуем этот сектор ещё раз.'}</p><div class="results"><div><strong>${s.score}</strong><span>ОЧКОВ</span></div><div><strong>${accuracy}%</strong><span>ПОПАДАНИЙ НА СЛУХ</span></div></div><p class="compact">Бас: ${s.stats.bass.hit}/${s.stats.bass.hit+s.stats.bass.miss} · Тип: ${s.stats.quality.hit}/${s.stats.quality.hit+s.stats.quality.miss}<br>Капсулы: ${s.intervalStats.caught} верных · ${s.intervalStats.wrong} чужих</p>`);
  action(won?'Новый вылет · другие тональности':'Повторить сектор',()=>startRun(won?(s.sector===3?3:0):s.sector,expedition.level));
  action('Выбрать уровень',()=>{s.mode='start';expedition.reset();startScreen();},true);
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
    if(outcome.correct){s.intervalStats.caught++;s.energy+=outcome.energy;s.score+=outcome.energy*5;s.power=Math.min(3,s.power+1);s.overdrive=3+outcome.energy/10;burst(c.x,c.y,'#79f5d0',35);feedback(`Верный интервал · +${outcome.energy} силы`);if(s.energy>=100){s.energy-=100;s.health=Math.min(5,s.health+1);s.overdrive=9;}}
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
    const p=s.player,speed=250*dt;
    if(s.keys.has('arrowleft')||s.keys.has('a'))p.tx-=speed;
    if(s.keys.has('arrowright')||s.keys.has('d'))p.tx+=speed;
    if(s.keys.has('arrowup')||s.keys.has('w'))p.ty-=speed;
    if(s.keys.has('arrowdown')||s.keys.has('s'))p.ty+=speed;
    p.tx=clamp(p.tx,25,W-25);p.ty=clamp(p.ty,115,H-35);p.x+=(p.tx-p.x)*Math.min(1,dt*16);p.y+=(p.ty-p.y)*Math.min(1,dt*16);
    expedition.tick(dt);
    const hadBoost=s.overdrive>0;if(!s.listening)s.overdrive=Math.max(0,s.overdrive-dt);if(hadBoost&&s.overdrive===0)renderHud();
    s.shotTimer-=dt;if(s.shotTimer<=0){const boost=s.overdrive>0||expedition.boosted;s.shotTimer=boost?.09:.18;const count=boost?5:s.power;for(let i=0;i<count;i++)s.shots.push({x:p.x+(i-(count-1)/2)*10,y:p.y-20,vx:boost?(i-2)*60:0});}
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
    for(const d of s.drones){if(d.hp>0&&d.y>0&&hitCircle(b,d,22)){d.hp--;d.hit=.15;b.y=-30;if(d.hp<=0){s.droneKills++;s.score+=20;burst(d.x,d.y,'#f7cd7f',12);renderHud();}break;}}
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
  ctx.strokeStyle='#79f5d029';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,32,35,0,0,Math.PI*2);ctx.stroke();
  if(images.ship.complete&&images.ship.naturalWidth)ctx.drawImage(images.ship,-34,-34,68,68);
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,-6,2,0,Math.PI*2);ctx.fill();ctx.restore();
  if(s.beam>0&&s.enemy){ctx.strokeStyle='#bdffe7';ctx.lineWidth=4+s.beam*20;ctx.globalAlpha=s.beam/.3;ctx.beginPath();ctx.moveTo(p.x,p.y-26);ctx.lineTo(s.enemy.x,s.enemy.y+30);ctx.stroke();ctx.globalAlpha=1;}
  for(const r of s.rings){ctx.strokeStyle=`rgba(121,245,208,${1-r.age/.8})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,r.age*260,0,Math.PI*2);ctx.stroke();}
  if(s.capsule){const c=s.capsule;ctx.save();ctx.translate(c.x,c.y);ctx.shadowColor='#79f5d0';ctx.shadowBlur=18;ctx.strokeStyle='#a5ffe6';ctx.fillStyle='#153c4c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-27);ctx.lineTo(26,-14);ctx.lineTo(26,14);ctx.lineTo(0,27);ctx.lineTo(-26,14);ctx.lineTo(-26,-14);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#e5fff5';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 24px system-ui';ctx.fillText(INTERVAL_TARGETS[c.wanted].glyph,0,0);ctx.strokeStyle='#79f5d070';ctx.beginPath();ctx.arc(0,0,34+Math.sin(clock*5)*3,0,Math.PI*2);ctx.stroke();ctx.restore();}
  for(const particle of s.particles){ctx.globalAlpha=Math.min(1,particle.life*2);ctx.fillStyle=particle.color;ctx.fillRect(particle.x,particle.y,3,3);}ctx.globalAlpha=1;
  if(expedition.pausedCombat)expedition.drawPauseOverlay();
  if(s.flash>0&&!reduced){ctx.fillStyle=`rgba(255,93,134,${s.flash*.3})`;ctx.fillRect(0,0,W,H);}
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
$('replay').addEventListener('click',()=>{s.replays++;expedition.busy?expedition.replay():s.capsule?playCapsule():playCue();});
$('interval-reference').addEventListener('click',()=>playCapsule(true));
$('help').addEventListener('click',()=>{if(s.mode==='start'){feedback('Включи звук и нажми «Вылететь»');}else pause(true);});
// Read-only diagnostics for regression checks; deliberately no answer/skip hook.
window.earGame=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({mode:s.mode,sector:s.sector,score:s.score,health:s.health,power:s.power,combo:s.combo,cleared:s.cleared,listening:s.listening,enemy:s.enemy,player:s.player,bullets:s.bullets,stats:s.stats,route:s.route,capsule:s.capsule,intervalStats:s.intervalStats,audio:{state:audio.context?.state,lastCue:audio.lastCue}}))});
startScreen();installLanguage();requestAnimationFrame(frame);

return {};
})();
})();
