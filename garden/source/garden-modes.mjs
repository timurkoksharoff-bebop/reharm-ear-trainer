// Professor experiment. Interval facts and conservative audition relationships;
// no textbook pages, examples or recordings are embedded. See PROFESSOR_MODES.md.
import {gardenCanonicalQuality,gardenNoteName} from './garden-harmony.mjs';
const pc=n=>(n%12+12)%12;
export const GARDEN_MODE_FAMILIES=Object.freeze([
 {id:'major',ru:'Натуральный мажор',en:'Major modes',color:'#b9e5cf'},
 {id:'melodic',ru:'Мелодический минор',en:'Melodic minor',color:'#9adbe4'},
 {id:'harmonic',ru:'Гармонический минор',en:'Harmonic minor',color:'#e6bb98'},
 {id:'harmonic-major',ru:'Гармонический мажор',en:'Harmonic major',color:'#d3b6eb'},
 {id:'pentatonic',ru:'Пентатоники',en:'Pentatonics',color:'#dce3a8'},
 {id:'blues',ru:'Блюз',en:'Blues',color:'#9fbce9'},
 {id:'symmetric',ru:'Симметричные',en:'Symmetric scales',color:'#d4bde4'},
 {id:'eight',ru:'Восьмиступенные',en:'Eight-note scales',color:'#e7d299'}
]);
const make=(id,label,ru,en,notes,family,extra={})=>Object.freeze({id,label,ru,en,notes:Object.freeze(notes),family,...extra});
function rotations(parent,names,family){return names.map(([id,label,ru,en],i)=>make(id,label,ru,en,parent.map((_,j)=>pc(parent[(j+i)%parent.length]-parent[i])),family));}
export const GARDEN_MODES=Object.freeze([
 ...rotations([0,2,4,5,7,9,11],[['ionian','Ion','Ионийский','Ionian'],['dorian','Dor','Дорийский','Dorian'],['phrygian','Phr','Фригийский','Phrygian'],['lydian','Lyd','Лидийский','Lydian'],['mixolydian','Mix','Миксолидийский','Mixolydian'],['aeolian','Aeo','Эолийский','Aeolian'],['locrian','Loc','Локрийский','Locrian']],'major'),
 ...rotations([0,2,3,5,7,9,11],[['melodic-minor','Mel−','Мелодический минор','Melodic minor'],['dorian-b2','Dor♭2','Дорийский ♭2 / фригийский ♮6','Dorian ♭2 / Phrygian ♮6'],['lydian-augmented','Lyd+','Лидийский увеличенный','Lydian augmented'],['lydian-dominant','Lyd♭7','Лидийский доминантовый / миксолидийский ♯4','Lydian dominant / Mixolydian ♯4'],['mixolydian-b6','Mix♭6','Миксолидийский ♭6','Mixolydian ♭6'],['locrian-n2','Loc♮2','Локрийский ♮2 / эолийский ♭5','Locrian ♮2 / Aeolian ♭5'],['altered','Alt','Альтерированный / суперлокрийский','Altered / Super Locrian']],'melodic'),
 ...rotations([0,2,3,5,7,8,11],[['harmonic-minor','Har−','Гармонический минор','Harmonic minor'],['locrian-n6','Loc♮6','Локрийский ♮6','Locrian ♮6'],['ionian-augmented','Ion+','Ионийский ♯5','Ionian ♯5'],['dorian-s4','Dor♯4','Дорийский ♯4','Dorian ♯4'],['phrygian-dominant','Phr♮3','Фригийский доминантовый / ♮3','Phrygian dominant / ♮3'],['lydian-s2','Lyd♯2','Лидийский ♯2','Lydian ♯2'],['ultralocrian','Alt°7','Альтерированный ♭♭7','Altered ♭♭7']],'harmonic'),
 ...rotations([0,2,4,5,7,8,11],[['harmonic-major','Ion♭6','Гармонический мажор / ионийский ♭6','Harmonic major / Ionian ♭6'],['dorian-b5','Dor♭5','Дорийский ♭5','Dorian ♭5'],['phrygian-b4','Phr♭4','Фригийский ♭4','Phrygian ♭4'],['lydian-b3','Lyd♭3','Лидийский ♭3','Lydian ♭3'],['mixolydian-b2','Mix♭2','Миксолидийский ♭2','Mixolydian ♭2'],['lydian-augmented-s2','Lyd+♯2','Лидийский увеличенный ♯2','Lydian augmented ♯2'],['locrian-bb7','Loc°7','Локрийский ♭♭7','Locrian ♭♭7']],'harmonic-major'),
 make('major-pentatonic','Pent+','Мажорная пентатоника','Major pentatonic',[0,2,4,7,9],'pentatonic'),
 make('minor-pentatonic','Pent−','Минорная пентатоника','Minor pentatonic',[0,3,5,7,10],'pentatonic'),
 make('minor-six-pentatonic','Pent−6','Минорная пентатоника с 6','Minor sixth pentatonic',[0,3,5,7,9],'pentatonic'),
 make('half-dim-pentatonic','Pentø','Полууменьшенная пентатоника','Half-diminished pentatonic',[0,3,5,6,10],'pentatonic'),
 make('major-b6-pentatonic','Pent♭6','Мажорная пентатоника ♭6','Major ♭6 pentatonic',[0,2,4,7,8],'pentatonic'),
 make('suspended-pentatonic','Pent sus','Подвешенная пентатоника','Suspended pentatonic',[0,2,5,7,10],'pentatonic'),
 make('major-blues','Blues+','Мажорная блюзовая','Major blues',[0,2,3,4,7,9],'blues'),
 make('minor-blues','Blues−','Минорная блюзовая','Minor blues',[0,3,5,6,7,10],'blues'),
 make('whole-tone','WT','Целотоновая','Whole tone',[0,2,4,6,8,10],'symmetric'),
 make('diminished-hw','H–W','Уменьшенная: полутон–тон','Diminished: half–whole',[0,1,3,4,6,7,9,10],'symmetric'),
 make('diminished-wh','W–H','Уменьшенная: тон–полутон','Diminished: whole–half',[0,2,3,5,6,8,9,11],'symmetric'),
 make('bebop-dominant','Bebop7','Доминантовая бибоп','Dominant bebop',[0,2,4,5,7,9,10,11],'eight'),
 make('bebop-major','Bebop+','Мажорная бибоп','Major bebop',[0,2,4,5,7,8,9,11],'eight')
]);
const byId=new Map(GARDEN_MODES.map(m=>[m.id,m]));
export const gardenModeById=id=>byId.get(id)||GARDEN_MODES.find(m=>m.label===id);
export function gardenModeFormula(mode){
 const named={'major-pentatonic':['1','2','3','5','6'],'minor-pentatonic':['1','♭3','4','5','♭7'],'minor-six-pentatonic':['1','♭3','4','5','6'],'half-dim-pentatonic':['1','♭3','4','♭5','♭7'],'major-b6-pentatonic':['1','2','3','5','♭6'],'suspended-pentatonic':['1','2','4','5','♭7'],'major-blues':['1','2','♭3','3','5','6'],'minor-blues':['1','♭3','4','♭5','5','♭7'],'whole-tone':['1','2','3','♯4','♯5','♭7'],'diminished-hw':['1','♭9','♯9','3','♯11','5','13','♭7'],'diminished-wh':['1','2','♭3','4','♭5','♭6','♭♭7','7'],'bebop-dominant':['1','2','3','4','5','6','♭7','7'],'bebop-major':['1','2','3','4','5','♭6','6','7']};
 const formula=named[mode.id]??mode.notes.map((n,i)=>{const shift=n-[0,2,4,5,7,9,11][i];return (shift<0?'♭'.repeat(-shift):'♯'.repeat(shift))+(i+1);});return formula.join(' · ');
}
const guides={maj:[4],min:[3],'6':[4,9],m6:[3,9],maj7:[4,11],maj7sharp11:[4,11],m7:[3,10],m7natural9:[3,10],m7b5:[3,6,10],m7b5natural9:[3,6,10],m7b9:[3,10],'7':[4,10],'7b9':[4,10],'7b9b13':[4,10],'7b5':[4,6,10],'7sharp5':[4,8,10],'7alt':[4,10],dim7:[3,6,9],aug:[4,8],augMaj7:[4,8,11],minSharp5:[3,8],sus4:[5,7],sus2:[2,7],'7sus4':[5,10],add9:[4,2],mMaj7:[3,11],'7b13':[4,10],dim:[3,6]};
const aliases={'ireal:mMaj7':'mMaj7','ireal:7b13':'7b13','ireal:m11':'m7natural9','ireal:9':'7','ireal:13':'7','ireal:7#9':'7','ireal:7#11':'7','ireal:o':'dim'};
const extensions={maj7sharp11:[6],m7natural9:[2],m7b5natural9:[2],m7b9:[1],'7b9':[1],'7b9b13':[1,8],'7b5':[6],'7sharp5':[8],'7b13':[8],'ireal:m11':[2,5],'ireal:9':[2],'ireal:13':[2,9],'ireal:7#9':[3],'ireal:7#11':[6],add9:[2]};
export const GARDEN_NAVIGATION_RULES=Object.freeze({initial:80,reward:6,conflictDamage:20,criticalGrace:3.5});
export const GARDEN_MODE_OFFER_RULES=Object.freeze({pairProbability:.35,pairOffsetMin:.22,pairOffsetMax:.48});
// A shuffled four-offer phrase keeps useful choices available without making
// every adjacent pickup a pre-solved scale/tension combination. A contrast is
// drawn only from an already explicit conflict, never from a neutral colour.
function modeOfferDeck(random){const deck=['support','support','contrast','open'];for(let i=deck.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;}
export function gardenModePairPlacement(offer,{random=Math.random,timeScale=offer?.timeScale??1}={}){
 const e=offer?.entity,target=offer?.targetSounding,phase=Number(target?.phase),remaining=Number(target?.remaining);
 if(!offer?.eligible||!e||!Number.isFinite(phase)||!Number.isFinite(remaining)||!(timeScale>0)||random()>=GARDEN_MODE_OFFER_RULES.pairProbability)return null;
 const offset=GARDEN_MODE_OFFER_RULES.pairOffsetMin+random()*(GARDEN_MODE_OFFER_RULES.pairOffsetMax-GARDEN_MODE_OFFER_RULES.pairOffsetMin),direction=random()<.5?-1:1;
 const lead=[direction*offset,-direction*offset].find(value=>phase-value>=.25&&remaining+value>=.7);
 if(lead==null)return null;
 return {x:Math.max(.16,Math.min(.84,e.x+(e.x<.5?.10:-.10))),y:e.y+e.vy*timeScale*lead,vy:e.vy,lead};
}
export const GARDEN_MODE_PICKUP_RULES=Object.freeze({dotRadius:3.2,hitRadius:4,shipRadius:14,nameOffset:-24,formulaOffset:-10});
const modeTiers=Object.freeze({base:Object.freeze({id:'base',ru:'Базовый',en:'Foundation',navReward:6,points:6}),jazz:Object.freeze({id:'jazz',ru:'Джазовый',en:'Jazz',navReward:9,points:10}),rare:Object.freeze({id:'rare',ru:'Редкий',en:'Rare',navReward:12,points:14})});
const baseModes=new Set(['ionian','dorian','phrygian','lydian','mixolydian','aeolian','major-pentatonic','minor-pentatonic','major-blues','minor-blues']);
const rareModes=new Set(['locrian-n6','ionian-augmented','dorian-s4','lydian-s2','ultralocrian','major-b6-pentatonic']);
// These are game offer/reward tiers, not a claim about universal musical merit
// or a textbook's ranking of harmonic difficulty.
export function gardenModeTier(mode){mode=typeof mode==='string'?gardenModeById(mode):mode;return baseModes.has(mode?.id)?modeTiers.base:mode?.family==='harmonic-major'||rareModes.has(mode?.id)?modeTiers.rare:modeTiers.jazz;}
const commonModeWeights={ionian:35,dorian:35,mixolydian:35,lydian:26,aeolian:24,phrygian:8,locrian:6,'melodic-minor':4,'harmonic-minor':4,'lydian-dominant':4,altered:3,'locrian-n2':3,'phrygian-dominant':3,'diminished-hw':3,'diminished-wh':3,'whole-tone':2.5,'major-pentatonic':5,'minor-pentatonic':5,'minor-six-pentatonic':2.5,'half-dim-pentatonic':2,'major-blues':2,'minor-blues':2};
function modeOfferWeight(mode){return commonModeWeights[mode.id]??(gardenModeTier(mode).id==='rare'?.45:1.5);}
function chooseWeighted(modes,random,recent=[],preference=null){const weight=mode=>modeOfferWeight(mode)*(recent.includes(mode.id)?.4:1)*Math.max(.05,preference?.(mode)??1);let amount=random()*modes.reduce((sum,m)=>sum+weight(m),0);for(const mode of modes){amount-=weight(mode);if(amount<0)return mode;}return modes.at(-1);}
function soundingKey(sounding){return sounding?.chord&&!sounding.chord.reference?[sounding.at,sounding.tonic,sounding.chord.offset,sounding.chord.quality].join('|'):null;}
function crossesModePickup(previousX,previousY,x,y,view){
 const shipX=Number(view.x),shipY=Number(view.y),oldShipX=Number.isFinite(view.previousX)?view.previousX:shipX,oldShipY=Number.isFinite(view.previousY)?view.previousY:shipY;
 const ax=previousX-oldShipX,ay=previousY-oldShipY,bx=x-shipX,by=y-shipY;
 if(![ax,ay,bx,by].every(Number.isFinite))return false;
 const dx=bx-ax,dy=by-ay,length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/length)):0;
 const radius=GARDEN_MODE_PICKUP_RULES.hitRadius+(Number.isFinite(view.shipRadius)?Math.max(0,view.shipRadius):GARDEN_MODE_PICKUP_RULES.shipRadius);
 return (ax+t*dx)**2+(ay+t*dy)**2<=radius*radius;
}
const selectedToneIntervals={'1':0,'♭9':1,'9':2,'♭3':3,'♯9':3,'3':4,'11':5,'♯11':6,'5':7,'♭13':8,'13':9,'♭7':10,'7':11,'2':2,'4':5,'6':9,'♭5':6,'♭6':8};
const toneLabel=interval=>({0:'1',1:'♭9',2:'9',3:'♭3',4:'3',5:'11',6:'♯11',7:'5',8:'♭13',9:'13',10:'♭7',11:'7'})[pc(interval)];
const selectedTone=value=>{
 const label=typeof value==='string'?value:value?.label,interval=typeof value==='object'&&Number.isFinite(value?.interval)?pc(value.interval):selectedToneIntervals[label];
 return interval==null?null:{label:label??toneLabel(interval),interval};
};
function expectedModeTone(mode,label){
 if(mode.notes.length!==7)return undefined;
 const degree=Number(String(label).replace(/[♭♯]/g,'')),index=({1:0,2:1,3:2,4:3,5:4,6:5,7:6,9:1,11:3,13:5})[degree];
 if(index==null)return undefined;
 const shift=mode.notes[index]-[0,2,4,5,7,9,11][index];
 return (shift<0?'♭'.repeat(-shift):'♯'.repeat(shift))+degree;
}
export function gardenModeVerdict(chord,mode,context={}){
 mode=typeof mode==='string'?gardenModeById(mode):mode;
 const raw=chord?.quality,q=aliases[raw]??gardenCanonicalQuality(raw),g=guides[q];
 if(!mode||!chord||chord.reference||!g)return {verdict:'neutral',reason:'unknown'};
 // Blues and bebop contain intentional passing/blue tones; static inclusion
 // cannot grade their phrasing. Keep these contextual rather than "wrong".
 if(['blues','eight'].includes(mode.family))return {verdict:'neutral',reason:'passing'};
 const set=new Set(mode.notes),required=[...g,...(extensions[raw]??extensions[q]??[])];
 if(!required.every(n=>set.has(n))){
  if((g.includes(4)&&!set.has(4)&&set.has(3))||(g.includes(3)&&!set.has(3)&&set.has(4)))return {verdict:'contrast',reason:'third'};
  return {verdict:'neutral',reason:'incomplete'};
 }
 // Exact written extensions are mandatory, but the fifth can be omitted in
 // altered dominant practice. Slash bass or a stated mode needs extra context.
 if((chord.bassOffset!=null&&pc(chord.bassOffset)!==pc(chord.offset))||chord.tensionMode||context.tensionMode)return {verdict:'neutral',reason:'context'};
 if(!set.has(7)&&['maj','6','maj7','maj7sharp11','min','m6','m7','m7natural9','7','7b9','7b9b13','7b13','add9','mMaj7'].includes(q)&&chord.voicingNote!=='no-fifth'&&!Array.isArray(chord.notes))return {verdict:'neutral',reason:'voicing'};
 if(Number.isFinite(context.tonic)&&Array.isArray(chord.notes)&&chord.notes.some(n=>!set.has(pc(n-context.tonic-Number(chord.offset)))))return {verdict:'neutral',reason:'voicing'};
 if(mode.family==='pentatonic')return {verdict:'compatible',reason:'pentatonic'};
 const majorThird=g.includes(4),minorThird=g.includes(3),seventh=g.includes(11),flatSeven=g.includes(10);
 if((majorThird&&set.has(3)&&mode.id!=='diminished-hw'&&mode.id!=='altered')||(minorThird&&set.has(4))||(seventh&&set.has(10))||(flatSeven&&set.has(11)))return {verdict:'neutral',reason:'colour'};
 if(majorThird&&set.has(5))return {verdict:'compatible',reason:'passing-fourth'};
 return {verdict:'compatible',reason:'structure'};
}
// This drill checks the explicitly chosen pitch collection. It does not claim
// that chromatic passing tones, blues phrasing or upper-structure pentatonics
// are universally wrong. Those need temporal/function context and stay neutral.
export function gardenModeTensionVerdict(chord,mode,selected=[],context={}){
 mode=typeof mode==='string'?gardenModeById(mode):mode;
 const base=gardenModeVerdict(chord,mode,context);
 if(!mode||!chord||chord.reference||context.boundary)return {verdict:'neutral',reason:context.boundary?'boundary':'unknown',conflicts:[]};
 if(['pentatonic','blues','eight'].includes(mode.family))return {verdict:'neutral',reason:mode.family==='pentatonic'?'sparse':'passing',conflicts:[]};
 const tones=[...new Map(selected.map(selectedTone).filter(Boolean).map(t=>[t.interval,t])).values()],set=new Set(mode.notes);
 const conflicts=tones.filter(t=>!set.has(t.interval)).map(t=>({...t,expected:expectedModeTone(mode,t.label),source:'selected'}));
 if(conflicts.length)return {verdict:'invalid',reason:'tension-conflict',conflicts};
 const raw=chord.quality,q=aliases[raw]??gardenCanonicalQuality(raw),written=extensions[raw]??extensions[q]??[];
 const missing=written.filter(n=>!set.has(pc(n))).map(n=>({label:toneLabel(n),interval:pc(n),expected:expectedModeTone(mode,toneLabel(n)),source:'written'}));
 if(missing.length)return {verdict:'invalid',reason:'written-tension',conflicts:missing};
 if(base.verdict==='contrast')return {...base,verdict:'invalid',conflicts:[]};
 return {...base,conflicts:[]};
}
export function gardenModeNotes(chord,tonic,mode){mode=typeof mode==='string'?gardenModeById(mode):mode;if(!mode||!Number.isFinite(Number(chord?.offset)))return [];const root=60+pc(Number(tonic)+Number(chord.offset));return [...mode.notes,12].map(n=>root+n);}
export function gardenModeExplanation(reason,en=false){return ({sparse:['Пентатоника — неполный набор: отсутствие тона не штрафуется','A pentatonic is sparse: missing a tone is not penalised'],unknown:['Недостаточно контекста для оценки','Not enough harmonic context'],passing:['Блюзовые и проходящие звуки: оценивай фразу на слух','Blue and passing tones: judge the phrase by ear'],third:['Лад меняет терцовую окраску аккорда','The scale changes the chord’s third'],voicing:['Нужна осторожность с реально звучащей раскладкой аккорда','The actual chord voicing needs care'],incomplete:['Часть характерных тонов аккорда отсутствует','Some defining chord tones are absent'],context:['Нужен контекст функции, слеш-баса или заданного лада','Function, slash bass or stated mode needs context'],pentatonic:['Пентатоническая окраска; не все ступени аккорда обязательны','Pentatonic colour; not every chord tone is required'],colour:['Выраженная дополнительная окраска','Strong additional colour'],'passing-fourth':['4-я ступень — проходящая, не длительная над мажорной терцией','Treat the fourth as passing over a major third'],structure:['Опорные тоны и записанные альтерации совпадают','Guide tones and written alterations agree']})[reason]?.[en?1:0]||'';}
export class GardenModesFlight{
 constructor({random=Math.random,onScale,onOffer,preference=null}={}){this.preference=preference;this.random=random;this.onScale=onScale;this.onOffer=onOffer;this.families=new Set(GARDEN_MODE_FAMILIES.map(f=>f.id));this.reset(false);}
 reset(enabled=false){this.enabled=enabled;this.oxygenEnabled=false;this.energy=100;this.navigationEnabled=enabled;this.navigation=GARDEN_NAVIGATION_RULES.initial;this.critical=0;this.gameOver=false;this.entities=[];this.flashes=[];this.clock=1.2;this.last=null;this.sequence=0;this.recent=[];this.windowKey=null;this.selectedTensions=new Map();this.activeMode=null;this.assessed=new Set();this.unlockThreshold=0;this.unlocked=false;this.offeringCount=0;this.offerDeck=[];this.lastOffer=null;}
 setFamilies(ids){this.families=new Set(ids.filter(id=>GARDEN_MODE_FAMILIES.some(f=>f.id===id)));this.entities=this.entities.filter(e=>this.families.has(gardenModeById(e.modeId)?.family));}
 restore(){if(this.navigationEnabled&&!this.gameOver){this.navigation=100;this.critical=0;}}
 syncSounding(sounding){
  const key=soundingKey(sounding);
  if(key!==this.windowKey){this.windowKey=key;this.selectedTensions.clear();this.activeMode=null;this.assessed.clear();}
 }
 assess(mode,sounding,context={}){
  const elapsed=Number(context.audioTime)-sounding.at,remaining=sounding.barSeconds-elapsed,boundary=Boolean(context.boundary)||!Number.isFinite(elapsed)||elapsed<.18||remaining<.65;
  const result=gardenModeTensionVerdict(sounding.chord,mode,[...this.selectedTensions.values()],{...context,tonic:sounding.tonic,boundary});
  const tier=gardenModeTier(mode);let requestedDelta=0,points=0;
  if(result.verdict==='invalid'){
   const pairs=result.conflicts.length?result.conflicts.map(t=>mode.id+'|'+t.source+'|'+t.interval):[mode.id+'|'+result.reason];
   if(pairs.some(key=>!this.assessed.has(key))){requestedDelta=-GARDEN_NAVIGATION_RULES.conflictDamage;for(const key of pairs)this.assessed.add(key);}
  }else if(result.verdict==='compatible'&&!this.assessed.has('reward|'+mode.id)){requestedDelta=tier.navReward;points=tier.points;this.assessed.add('reward|'+mode.id);}
  const before=this.navigation;this.navigation=Math.max(0,Math.min(100,this.navigation+requestedDelta));
  return {...result,tier,points,boundary,remaining:Math.max(0,remaining),requestedDelta,delta:this.navigation-before};
 }
 recordTension(label,sounding,context={}){
  if(!this.enabled||this.gameOver||context.paused||!sounding?.chord||sounding.chord.reference)return {ignored:true};
  this.syncSounding(sounding);const tone=selectedTone(label),elapsed=Number(context.audioTime)-sounding.at,remaining=sounding.barSeconds-elapsed;
  if(!tone||context.boundary||!Number.isFinite(elapsed)||elapsed<.18||remaining<.65)return {ignored:true,boundary:true};
  if(this.selectedTensions.has(tone.interval))return {ignored:true,duplicate:true};
  this.selectedTensions.set(tone.interval,tone);
  if(!this.activeMode)return {recorded:true,label:tone.label,selectedTensions:[...this.selectedTensions.values()].map(t=>t.label)};
  const mode=gardenModeById(this.activeMode.id),result=this.assess(mode,sounding,context);
  this.last={id:++this.sequence,kind:'tension',modeId:mode.id,label:mode.label,tensionLabel:tone.label,root:gardenNoteName(sounding.tonic+Number(sounding.chord.offset)),...result,notes:gardenModeNotes(sounding.chord,sounding.tonic,mode),age:0};
  this.onScale?.({...this.last});return {...this.last};
 }
 spawn(id,overrides={}){const mode=gardenModeById(id);if(!this.enabled||!mode||!this.families.has(mode.family))return null;const tier=gardenModeTier(mode),left=this.random()<.5,rare=tier.id==='rare',x=(left?(rare?.27:.36):(rare?.71:.60))+this.random()*(rare?.02:.04);const e={id:++this.sequence,modeId:mode.id,label:mode.label,tier:tier.id,x,y:-.05,vy:.09,age:0,collected:false,...overrides};this.entities.push(e);return e;}
 offerMode(view){
  const all=GARDEN_MODES.filter(m=>this.families.has(m.family));if(!all.length)return;
  const timeScale=Number.isFinite(view.timeScale)&&view.timeScale>0?view.timeScale:1,shipY=Number(view.y)/Number(view.height),initialEta=Math.max(0,Math.min(12,Number.isFinite(shipY)?(shipY+.05)/(.09*timeScale):6));
  let eta=initialEta,spawnY=-.05,target=view.sounding,usesForecast=false;
  if(typeof view.forecastSounding==='function'){usesForecast=true;try{target=view.forecastSounding(eta);}catch{target=null;}}
  // Prefer arrival inside the audible window, leaving room for a paired note
  // slightly ahead. This is only a bounded forecast adjustment; contact still
  // rechecks the actual chord, and held/jumped routes can invalidate a forecast.
  const phase=Number(target?.phase),remaining=Number(target?.remaining),duration=Number(target?.barSeconds)||(phase+remaining),latestSafe=duration-.85;
  if(usesForecast&&Number.isFinite(phase)&&Number.isFinite(remaining)&&latestSafe>=.6&&(phase<.6||remaining<.85)){
   const shift=Math.max(-.8,Math.min(.8,(.6+latestSafe)/2-phase)),adjustedEta=Math.max(0,Math.min(12,eta+shift));
   if(Math.abs(adjustedEta-eta)>.001){try{const adjusted=view.forecastSounding(adjustedEta);if(adjusted?.chord){eta=adjustedEta;spawnY-= (eta-initialEta)*.09*timeScale;target=adjusted;}}catch{}}
  }
  const selected=soundingKey(target)&&soundingKey(target)===this.windowKey?[...this.selectedTensions.values()]:[];
  const grade=mode=>gardenModeTensionVerdict(target?.chord,mode,selected,{tonic:target?.tonic,tensionMode:target?.tensionMode??(!usesForecast?view.tensionMode:undefined)}),compatible=all.filter(m=>grade(m).verdict==='compatible'),accessible=compatible.filter(m=>gardenModeTier(m).id!=='rare'),contrasts=all.filter(m=>grade(m).verdict==='invalid');
  if(!this.offerDeck.length)this.offerDeck=modeOfferDeck(this.random);
  const role=this.offerDeck.pop(),supported=accessible.length?accessible:compatible,forced=role==='support'&&supported.length>0;
  // Recently seen labels are quieter, never excluded: a short valid palette
  // must not force an exotic or incompatible substitute just for novelty.
  const candidates=forced?supported:role==='contrast'&&contrasts.length?contrasts:all,mode=chooseWeighted(candidates,this.random,this.recent,this.preference);
  if(!mode)return;
  const entity=this.spawn(mode.id,{y:spawnY});if(!entity)return;
  this.offeringCount++;this.recent=[...this.recent,mode.id].slice(-5);const verdict=grade(mode).verdict;this.lastOffer={modeId:mode.id,tier:entity.tier,role,verdict,eta,usesForecast,phase:Number.isFinite(Number(target?.phase))?Number(target.phase):null,remaining:Number.isFinite(Number(target?.remaining))?Number(target.remaining):null,arrivalAdjusted:eta!==initialEta,compatible:verdict==='compatible',forced,targetRoot:target?.chord&&Number.isFinite(target.tonic)?gardenNoteName(target.tonic+Number(target.chord.offset)):null,targetQuality:target?.chord?.quality??null};
  this.onOffer?.({entity,mode,targetSounding:target,tier:gardenModeTier(mode),eligible:this.lastOffer.compatible,eta,timeScale,role,verdict});
  return entity;
 }
 collect(entity,sounding,context={}){
  if(!this.enabled||this.gameOver||context.paused||!entity||entity.collected||!sounding?.chord||sounding.chord.reference)return {ignored:true};
  this.syncSounding(sounding);entity.collected=true;const mode=gardenModeById(entity.modeId),result=this.assess(mode,sounding,context);
  if(!result.boundary)this.activeMode={id:mode.id,label:mode.label};
  this.last={id:entity.id,kind:'mode',modeId:mode.id,label:mode.label,root:gardenNoteName(sounding.tonic+Number(sounding.chord.offset)),...result,notes:gardenModeNotes(sounding.chord,sounding.tonic,mode),age:0};this.flashes.push({...entity,...result,age:0});this.onScale?.({...this.last});return {...this.last};
 }
 update(dt,view={}){
  if(!this.enabled)return;if(view.complete){this.entities=[];return;}if(!dt||!view.active||view.paused||this.gameOver)return;
  if(this.last)this.last.age+=dt;for(const f of this.flashes)f.age+=dt;this.flashes=this.flashes.filter(f=>f.age<1.8);
  const ready=view.sounding?.chord&&!view.sounding.chord.reference,total=Math.max(1,Math.ceil(Number(view.totalChords)||1)),solved=Math.max(0,Number(view.solvedChords)||0);
  this.unlockThreshold=Math.ceil(total/3);this.unlocked=solved>=this.unlockThreshold;
  this.syncSounding(view.sounding);
  if(ready&&this.unlocked){this.clock-=dt;if(this.clock<=0&&this.entities.length<3){this.offerMode(view);this.clock=3.2+this.random()*1.2;}}
  for(const e of this.entities){const previousX=e.x*view.width,previousY=e.y*view.height;e.age+=dt;e.y+=e.vy*dt;if(ready&&crossesModePickup(previousX,previousY,e.x*view.width,e.y*view.height,view))this.collect(e,view.sounding,view);}
  this.entities=this.entities.filter(e=>!e.collected&&e.y<1.1);
  const elapsed=Number.isFinite(view.clockDt)?Math.max(0,Math.min(.5*(view.timeScale??1),view.clockDt)):dt;
  this.critical=this.navigation<=0?this.critical+elapsed:0;if(this.critical>=GARDEN_NAVIGATION_RULES.criticalGrace)this.gameOver=true;
 }
 draw(ctx,width,height,{language='ru'}={}){
  if(!this.enabled)return;for(const e of this.entities){
   const m=gardenModeById(e.modeId),tone=GARDEN_MODE_FAMILIES.find(f=>f.id===m.family).color,name=(language==='en'?m.en:m.ru).split(' / ')[0],formula=gardenModeFormula(m).replaceAll(' · ',' ');
   const anchorX=e.x*width,anchorY=e.y*height,maxWidth=Math.min(156,Math.max(76,width-16));
   ctx.save();ctx.globalAlpha=Math.min(.95,e.age*3);ctx.textAlign='center';ctx.textBaseline='alphabetic';
   ctx.font='12.5px Georgia,serif';const measuredName=ctx.measureText(name).width,nameSize=Math.max(11.2,Math.min(12.5,12.5*maxWidth/Math.max(1,measuredName)));
   // Name and formula share the exact pickup centre. Only the bright point
   // below them is collectible; the airborne text has no collision geometry.
   ctx.shadowColor='#001116';ctx.shadowBlur=4;ctx.fillStyle='#fff0d4';ctx.font=nameSize+'px Georgia,serif';ctx.fillText(name,anchorX,anchorY+GARDEN_MODE_PICKUP_RULES.nameOffset,maxWidth);
   ctx.globalAlpha*=.85;ctx.fillStyle=tone;ctx.font='7.5px ui-monospace,SFMono-Regular,Menlo,monospace';ctx.fillText(formula,anchorX,anchorY+GARDEN_MODE_PICKUP_RULES.formulaOffset,maxWidth);
   ctx.globalAlpha=Math.min(1,e.age*3);ctx.shadowColor=tone;ctx.shadowBlur=11;ctx.fillStyle='#fff7df';ctx.beginPath();ctx.arc(anchorX,anchorY,GARDEN_MODE_PICKUP_RULES.dotRadius,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  for(const f of this.flashes){ctx.save();ctx.globalAlpha=Math.max(0,1-f.age/1.8);ctx.fillStyle=f.verdict==='compatible'?'#a8edc8':f.verdict==='invalid'||f.verdict==='contrast'?'#e9b3bf':'#d9d3e7';ctx.font='13px Georgia';ctx.textAlign='center';ctx.fillText(f.label,f.x*width,f.y*height-f.age*20);ctx.restore();}
 }
 snapshot(){return {enabled:this.enabled,kind:'modes',oxygenEnabled:false,energy:100,navigationEnabled:this.navigationEnabled,navigation:this.navigation,critical:this.critical,gameOver:this.gameOver,unlockThreshold:this.unlockThreshold,unlocked:this.unlocked,offeringCount:this.offeringCount,lastOffer:this.lastOffer&&{...this.lastOffer},selectedTensions:[...this.selectedTensions.values()].map(t=>t.label),activeMode:this.activeMode&&{...this.activeMode},catalogSize:GARDEN_MODES.length,families:[...this.families],last:this.last&&{...this.last,notes:[...this.last.notes],conflicts:this.last.conflicts.map(t=>({...t}))},entities:this.entities.map(e=>({...e}))};}
}
