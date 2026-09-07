// The canonical source remains ../app.js. These two small snapshots are checked
// against it by tools/check.mjs; see MUSICAL_NOTES.md for the visual PDF audit.
export const BOOK_ROUTES = [
  { id:'fig-1-6', source:'Chapter 1 · Fig. 1.6 · printed p. 9', baseTonic:5,
    sequence:[{degree:'I6',offset:0,quality:'6'},{degree:'VI−7',offset:9,quality:'m7'},{degree:'IV',offset:5,quality:'maj'},{degree:'I6',offset:0,quality:'6'}] },
  { id:'fig-1-8', source:'Chapter 1 · Fig. 1.8 · printed p. 9', baseTonic:5,
    sequence:[{degree:'I6',offset:0,quality:'6'},{degree:'VI−7',offset:9,quality:'m7'},{degree:'V7sus4',offset:7,quality:'7sus4'},{degree:'VI−7',offset:9,quality:'m7'}] },
];
export const DEGREES = {
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
export const INTERVALS = {
  maj:[0,4,7],min:[0,3,7],aug:[0,4,8],'6':[0,4,7,9],maj7:[0,4,7,11],
  maj7sharp11:[0,4,7,11,18],m7:[0,3,7,10],m7b5:[0,3,6,10],
  m7natural9:[0,3,7,10,14],m7b5natural9:[0,3,6,10,14],m6:[0,3,7,9],
  '7':[0,4,7,10],'7b9':[0,4,7,10,13],'7b9b13':[0,4,7,10,13,20],
  dim7:[0,3,6,9],'7sus4':[0,5,7,10],'7b5':[0,4,6,10],
  '7sharp5':[0,4,8,10],'7alt':[0,4,6,10,13],m7b9:[0,3,7,10,13],
  minSharp5:[0,3,8],augMaj7:[0,4,8,11],
};
export const QUALITIES = {
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
export const QUALITY_BANKS=[['maj','min','6','m6','7','maj7','m7','m7b5','dim7','7sus4','aug'],
  ['maj7sharp11','m7natural9','m7b5natural9','7b9','7b9b13','7b5','7sharp5','7alt','m7b9','minSharp5','augMaj7']];
export const family = quality => quality;
export const chordSymbol = chord => `${DEGREES[chord.offset].glyph}${chord.quality==='maj'?'':QUALITIES[chord.quality].glyph}`;
export const SECTORS = [
  {name:'Маяк',degrees:[0,7],qualities:[],title:'Услышь I и V',description:'Сначала звучит тоника I, потом сигнал гидры. Узнай: это I или V?',patterns:[[0,7,7,0],[0,7,0,0],[7,7,0,0]],count:8},
  {name:'Переправа',degrees:[0,5,7],qualities:[],title:'Знакомься: IV',description:'От тоники I до IV — чистая кварта. Сравни её с квинтой I–V.',patterns:[[0,5,7,0],[0,7,5,0],[5,0,7,0]],count:8},
  {name:'Двойной щит',degrees:[0,5,7,9],qualities:['maj','6','m7','7sus4'],title:'Корень + тип аккорда',description:'Верхний блок оружия — ступень корня. Нижний — точный тип аккорда: maj, 6, m7 или 7sus4. Пробивай щиты в любом порядке.',count:8},
  {name:'Хроматический полёт',degrees:Array.from({length:12},(_,i)=>i),qualities:QUALITY_BANKS.flat(),title:'Вся хроматика. Точная цифровка.',description:'12 корней × 22 типа аккорда. Например: ♭IImaj7 или IIIm7. Типы оружия переключаются вкладками «Аккорды» / «Альтерации».',count:12},
];
const pick = (items,rng) => items[Math.floor(rng()*items.length)];
export function createRoute(sector,previousKey=-1,rng=Math.random,routeIndex=0) {
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
export function chordNotes(chord,tonic,spread=false) {
  const root=tonic+chord.offset;
  const notes=INTERVALS[chord.quality].map(i=>root+12+i);
  if(spread) notes[1]+=12;
  return [root,...notes];
}
export function cueEvents(route,chord,sector) {
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
export function answerResult(chord,shields,kind,value) {
  if(!['bass','quality'].includes(kind)||shields[kind]) return {ignored:true};
  const correct=kind==='bass'?Number(value)===(chord.bassOffset??chord.offset):value===family(chord.quality);
  const next={...shields,[kind]:correct};
  return {correct,shields:correct?next:shields,destroyed:correct&&next.bass&&next.quality};
}
