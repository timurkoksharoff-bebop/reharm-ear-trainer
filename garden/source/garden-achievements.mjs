// Device-local practice milestones. Saved game scores cannot establish accuracy.
export const GARDEN_RANKS=Object.freeze([
 {id:'muladhara',ru:'Муладхара',en:'Muladhara',color:'#ef5d69',petals:4,routes:3,accuracy:.80,laps:4,keys:1,teacher:0,sevenths:0,complex:0,bass:0,tones:0,toneRoutes:0,toneAccuracy:0,days:1},
 {id:'svadhisthana',ru:'Свадхистхана',en:'Svadhisthana',color:'#ffa357',petals:6,routes:8,accuracy:.88,laps:3,keys:3,teacher:0,sevenths:4,complex:0,bass:0,tones:0,toneRoutes:0,toneAccuracy:0,days:1},
 {id:'manipura',ru:'Манипура',en:'Manipura',color:'#f6d86b',petals:10,routes:12,accuracy:.92,laps:2.5,keys:4,teacher:4,sevenths:4,complex:2,bass:2,tones:8,toneRoutes:3,toneAccuracy:.75,days:2},
 {id:'anahata',ru:'Анахата',en:'Anahata',color:'#84df9d',petals:12,routes:20,accuracy:.96,laps:2,keys:5,teacher:10,sevenths:6,complex:5,bass:4,tones:24,toneRoutes:6,toneAccuracy:.85,days:3},
 {id:'vishuddha',ru:'Вишуддха',en:'Vishuddha',color:'#68d8ef',petals:16,reserved:true},
 {id:'ajna',ru:'Аджна',en:'Ajna',color:'#9896f4',petals:2,reserved:true},
 {id:'sahasrara',ru:'Сахасрара',en:'Sahasrara',color:'#d8a2f3',petals:24,reserved:true}
]);
const mod12=n=>(n%12+12)%12;
const safeKey=s=>typeof s==='string'&&s.length<180&&!['__proto__','constructor','prototype'].includes(s);
const seventh=q=>/7|9|11|13/.test(q);
const complex=q=>/9|11|13|alt|sharp|b5|♭5|b9|♭9|augMaj/.test(q)&&!['m7b5','m7♭5'].includes(q);
let chakraGlyphNumber=0;
export function gardenRankGlyph(rank){
 const count=rank.petals,color=rank.color,id='chakra-light-'+(++chakraGlyphNumber);
 const petals=Array.from({length:count},(_,i)=>`<path transform="rotate(${i*360/count} 60 60)" d="M60 35Q43 22 60 7Q77 22 60 35Z"/>`).join('');
 const mark=rank.id==='muladhara'?'<rect x="42" y="42" width="36" height="36"/><path d="M46 48H74L60 73Z"/>':rank.id==='svadhisthana'?'<path d="M40 46A23 23 0 1 0 80 46A22 22 0 0 1 40 46Z"/>':rank.id==='anahata'?'<path d="M60 37 81 73H39ZM60 83 39 47H81Z"/>':'<path d="M38 45H82L60 83Z"/>';
 return `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" style="--chakra:${color}"><defs><radialGradient id="${id}" cx="42%" cy="32%" r="73%"><stop stop-color="#fff5d5" stop-opacity=".45"/><stop offset=".24" stop-color="${color}" stop-opacity=".5"/><stop offset=".67" stop-color="${color}" stop-opacity=".13"/><stop offset="1" stop-color="#041923" stop-opacity=".4"/></radialGradient></defs><circle class="chakra-aura" style="fill:url(#${id})" cx="60" cy="60" r="51"/><g class="chakra-gold">${petals}<circle cx="60" cy="60" r="51"/><circle cx="60" cy="60" r="48" opacity=".5"/><circle cx="60" cy="60" r="31"/>${mark}</g><circle class="chakra-core" cx="60" cy="60" r="4"/><path class="chakra-spark" d="M60 1V15M53 8H67"/></svg>`;
}

export class GardenSkillFlight{
 constructor(){this.reset();}
 reset(){this.manual=new Set();this.attempts=0;this.correct=0;this.assisted=false;this.toneEvents=new Map();this.finished=false;}
 observe(model){if(!this.finished&&Object.values(model.filters||{}).some(f=>f?.remaining))this.assisted=true;}
 answer(model,kind,correct){
  if(this.finished||!model.running||model.complete||model.cursor<0||model.currentParts?.[kind]||!model.answerKinds.includes(kind))return;
  this.attempts++;
  if(correct){this.correct++;this.manual.add(model.cursor+':'+kind);
   // Teacher's root also solves an identical bass; this is an independent inference.
   if(kind==='degree'&&model.separateBass&&Number(model.current.offset)===Number(model.current.bassOffset??model.current.offset))this.manual.add(model.cursor+':bass');
  }
 }
 tone(event,position){
  if(this.finished||!['valid','invalid'].includes(event.verdict)||position<0)return;
  const key=position+':'+mod12(event.midi);
  if(!this.toneEvents.has(key))this.toneEvents.set(key,event.verdict);
 }
 finish(model,run,{difficulty,date=new Date()}={}){
  if(this.finished||!model.complete)return null;
  this.finished=true;
  const route=model.exercise,notes=[...this.toneEvents.values()];
  // Independent answers for every part are necessary; reveals never count.
  const independent=!this.assisted&&this.manual.size===model.totalParts&&this.attempts>0;
  return {route:String(route.id||''),difficulty,key:mod12(route.baseTonic??5),date:[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-'),
   accuracy:this.correct/Math.max(1,this.attempts),laps:run.seconds/Math.max(1,route.sequence.length*model.barSeconds),independent,
   seventh:route.sequence.some(c=>seventh(c.quality)),complex:route.sequence.some(c=>complex(c.quality)),bass:model.separateBass&&route.sequence.some(c=>Number(c.offset)!==Number(c.bassOffset??c.offset)),
   tones:notes.filter(v=>v==='valid').length,toneAccuracy:notes.length?notes.filter(v=>v==='valid').length/notes.length:0};
 }
}

const qualifies=(f,r)=>f.independent&&['medium','hard'].includes(f.difficulty)&&Number.isFinite(f.accuracy)&&f.accuracy>=r.accuracy&&Number.isFinite(f.laps)&&f.laps>=0&&f.laps<=r.laps;
export function gardenRankStats(flights,rank){
 const good=flights.filter(f=>qualifies(f,rank)),routes=new Set(good.map(f=>f.route));
 const count=predicate=>new Set(good.filter(predicate).map(f=>f.route)).size;
 const noteRoutes=new Map();for(const f of good)if(f.toneAccuracy>=rank.toneAccuracy&&f.tones>0)noteRoutes.set(f.route,Math.max(noteRoutes.get(f.route)||0,f.tones));
 return {routes:routes.size,keys:new Set(good.map(f=>f.key)).size,teacher:count(f=>f.difficulty==='hard'),sevenths:count(f=>f.seventh),complex:count(f=>f.difficulty==='hard'&&f.complex),bass:count(f=>f.difficulty==='hard'&&f.bass),tones:[...noteRoutes.values()].reduce((n,v)=>n+v,0),toneRoutes:noteRoutes.size,days:new Set(good.map(f=>f.date)).size};
}
export function gardenRankRequirements(rank,stats,en=false){
 const pair=(key,ru,english)=>({key,label:en?english:ru,value:stats[key],target:rank[key]});
 return [pair('routes','Разные маршруты','Different routes'),pair('keys','Тональности','Keys'),...(rank.teacher?[pair('teacher','Маршруты преподавателя','Teacher routes')]:[]),...(rank.sevenths?[pair('sevenths','Маршруты с септаккордами','Routes with seventh chords')]:[]),...(rank.complex?[pair('complex','Сложные аккорды · преподаватель','Extended chords · Teacher')]:[]),...(rank.bass?[pair('bass','Самостоятельный бас · преподаватель','Independent bass · Teacher')]:[]),...(rank.tones?[pair('tones','Верные летающие ноты','Valid flying notes'),pair('toneRoutes','Маршруты с верными нотами','Routes with valid notes')]:[]),...(rank.days>1?[pair('days','Дни практики','Practice days')]:[])];
}
export class GardenAchievements{
 constructor({storage=null,key='ear-yoga-achievements.v1'}={}){
  this.storage=storage;this.key=key;this.data={version:1,flights:[],earned:{},mandalas:{}};this.saved=Boolean(storage);
  try{const raw=JSON.parse(storage?.getItem(key)||'null');if(raw?.version===1){this.data.flights=Array.isArray(raw.flights)?raw.flights.filter(f=>safeKey(f.route)&&['medium','hard'].includes(f.difficulty)&&/^\d{4}-\d{2}-\d{2}$/.test(f.date)&&qualifies(f,GARDEN_RANKS[0])).slice(-3000):[];for(const rank of GARDEN_RANKS.filter(r=>!r.reserved))if(typeof raw.earned?.[rank.id]==='string')this.data.earned[rank.id]=raw.earned[rank.id];if(raw.mandalas&&typeof raw.mandalas==='object')for(const [id,value]of Object.entries(raw.mandalas))if(safeKey(id)&&typeof value==='string')this.data.mandalas[id]=value;}}catch{}
 }
 save(){try{this.storage?.setItem(this.key,JSON.stringify(this.data));this.saved=Boolean(this.storage);return this.saved;}catch{this.saved=false;return false;}}
 record(flight,{eligible=false}={}){
  if(!flight||!eligible||!safeKey(flight.route)||!qualifies(flight,GARDEN_RANKS[0]))return [];
  // Keep a small Pareto frontier per route/key/mode/day: repetition is not XP.
  const same=f=>f.route===flight.route&&f.key===flight.key&&f.difficulty===flight.difficulty&&f.date===flight.date;
  const dominates=(a,b)=>a.accuracy>=b.accuracy&&a.laps<=b.laps&&a.tones>=b.tones&&a.toneAccuracy>=b.toneAccuracy;
  if(!this.data.flights.some(f=>same(f)&&dominates(f,flight))){this.data.flights=this.data.flights.filter(f=>!same(f)||!dominates(flight,f));if(this.data.flights.filter(same).length<4)this.data.flights.push({...flight});}
  const awarded=[];
  for(const rank of GARDEN_RANKS){if(rank.reserved)break;if(this.data.earned[rank.id])continue;const stats=gardenRankStats(this.data.flights,rank);if(!gardenRankRequirements(rank,stats).every(c=>c.value>=c.target))break;this.data.earned[rank.id]=flight.date;awarded.push(rank.id);}
  this.save();return awarded;
 }
 syncMandalas(groups,completed,date=new Date().toISOString().slice(0,10)){
  const set=new Set(completed),earned=[];
  for(const group of groups)if(safeKey(group.id)&&group.routes.length&&group.routes.every(id=>set.has(id))&&!this.data.mandalas[group.id]){this.data.mandalas[group.id]=date;earned.push(group.id);}
  if(earned.length)this.save();return earned;
 }
 snapshot(){return JSON.parse(JSON.stringify({...this.data,saved:this.saved}));}
}
