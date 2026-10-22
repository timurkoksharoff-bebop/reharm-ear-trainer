// Local prototype, not a trusted online tournament score.
export class GardenRun{
 constructor(){this.reset();}
 reset(){this.seconds=0;this.parts=new Set();this.tones=new Set();this.modes=new Set();this.combos=new Map();this.extra=0;this.misses=0;this.finished=false;this.bonus=0;this.totalParts=0;this.expectedSeconds=0;}
 observe(model){
  if(this.finished)return;
  this.totalParts=model.totalParts??model.exercise.sequence.length*2;
  this.expectedSeconds=model.exercise.sequence.length*model.barSeconds;
  for(const [i,p] of (model.progress??[]).entries())for(const kind of ['degree','quality',...(model.separateBass?['bass']:[])])if(p[kind])this.parts.add(i+':'+kind);
  if(model.complete){this.finished=true;this.bonus=Math.round(this.totalParts*300/(1+(this.seconds/Math.max(1,this.expectedSeconds))**2));}
 }
 tick(dt,active){if(active&&!this.finished&&Number.isFinite(dt))this.seconds+=Math.max(0,dt);}
 tone(event,position){
  if(this.finished||event.verdict!=='valid')return;
  const key=position+':'+((event.midi%12+12)%12);
  if(this.tones.has(key))return;this.tones.add(key);
  this.extra=Math.min(this.extra+10,Math.min(500,this.totalParts*10));
 }
 addExtra(points){const before=this.extra;this.extra=Math.min(this.extra+Math.max(0,points),Math.min(500,this.totalParts*10));return this.extra-before;}
 mode(event,position){
  if(this.finished||event?.boundary||event?.verdict!=='compatible'||!Number.isInteger(position)||position<0||!event.modeId)return 0;
  const tierPoints=Number(event.tier?.points),points=Number(event.points);
  if(![6,10,14].includes(tierPoints)||!Number.isFinite(points)||points<=0)return 0;
  const key=position+':'+event.modeId;if(this.modes.has(key))return 0;this.modes.add(key);
  return this.addExtra(Math.min(points,tierPoints));
 }
 combo(event,position=event?.position){
  if(this.finished||!Number.isInteger(position)||position<0)return 0;
  const total=GARDEN_PROFESSOR_COMBOS[event?.id],points=Number(event?.points),before=this.combos.get(position)||0;
  if(!total||!Number.isFinite(points)||points<=0||total<=before)return 0;
  this.combos.set(position,total);return this.addExtra(Math.min(points,total-before));
 }
 snapshot(){return {seconds:this.seconds,score:Math.max(0,this.parts.size*100+this.extra-this.misses*25)+this.bonus,bonus:this.bonus,finished:this.finished};}
}

export const GARDEN_PROFESSOR_COMBOS=Object.freeze({precision:18,insight:24,resonance:24,constellation:48});
const pitchClass=n=>((n%12)+12)%12;
// Local practice feedback only. Evidence belongs to one actual chord attack;
// best totals belong to route positions, so repeated laps cannot farm points.
export class GardenProfessorCombos{
 constructor({onCombo}={}){this.onCombo=onCombo;this.reset();}
 reset(){this.best=new Map();this.finished=false;this.position=null;this.onset=null;this.requiredKinds=[];this.clearWindow();}
 clearWindow(){this.answers=new Set();this.tones=new Set();this.modes=new Map();this.blocked=false;this.positionComplete=false;}
 observe({position,onset,requiredKinds,complete=false}={}){
  if(this.finished)return;
  if(complete){this.finished=true;this.position=null;this.clearWindow();return;}
  if(!Number.isInteger(position)||position<0||!Number.isFinite(onset)){this.position=null;this.onset=null;this.clearWindow();return;}
  if(position!==this.position||onset!==this.onset){this.clearWindow();this.position=position;this.onset=onset;this.requiredKinds=['degree','quality'];}
  if(Array.isArray(requiredKinds))this.requiredKinds=[...new Set(requiredKinds.filter(k=>['degree','quality','bass'].includes(k)))];
 }
 answer(event={}){
  if(!this.active(event)||event.ignored||!this.requiredKinds.includes(event.kind))return null;
  if(this.answers.has(event.kind))return null;
  if(!event.correct||event.independent!==true){this.blocked=true;return null;}
  this.answers.add(event.kind);
  const all=this.requiredKinds.length>0&&this.requiredKinds.every(kind=>this.answers.has(kind));
  this.positionComplete=event.positionComplete===true||(event.positionComplete!==false&&all);
  return this.evaluate();
 }
 tone(event={}){
  if(!this.active(event)||event.ignored||event.boundary)return null;
  if(event.verdict==='invalid'){this.blocked=true;return null;}
  if(event.verdict!=='valid'||!Number.isFinite(event.midi))return null;
  this.tones.add(pitchClass(event.midi));return this.evaluate();
 }
 mode(event={}){
  if(!this.active(event)||event.ignored||event.boundary)return null;
  this.modes.clear();
  if(event.verdict==='invalid'){this.blocked=true;return null;}
  if(event.verdict!=='compatible'||!event.modeId||!Array.isArray(event.notes)||!event.notes.length||!event.notes.every(Number.isFinite))return null;
  this.modes.set(event.modeId,new Set(event.notes.map(pitchClass)));return this.evaluate();
 }
 active(event){return !this.finished&&this.position!==null&&(event.position==null||event.position===this.position)&&(event.onset==null||event.onset===this.onset);}
 evaluate(){
  const core=!this.blocked&&this.positionComplete&&this.requiredKinds.length>0&&this.requiredKinds.every(k=>this.answers.has(k)),mode=this.modes.size>0,tone=this.tones.size>0;
  const matched=[...this.modes.values()].some(notes=>[...this.tones].some(pc=>notes.has(pc)));
  const id=core&&matched?'constellation':matched?'resonance':core&&mode?'insight':core&&tone?'precision':null;
  if(!id)return null;
  const total=GARDEN_PROFESSOR_COMBOS[id],before=this.best.get(this.position)||0;if(total<=before)return null;
  this.best.set(this.position,total);const event={id,position:this.position,onset:this.onset,points:total-before,total};this.onCombo?.(event);return event;
 }
 snapshot(){return {position:this.position,onset:this.onset,requiredKinds:[...this.requiredKinds],answers:[...this.answers],tones:[...this.tones],modes:[...this.modes.keys()],blocked:this.blocked,finished:this.finished,best:Object.fromEntries(this.best)};}
}
