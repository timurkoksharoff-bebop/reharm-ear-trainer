// Local prototype, not a trusted online tournament score.
export class GardenRun{
 constructor(){this.reset();}
 reset(){this.seconds=0;this.parts=new Set();this.tones=new Set();this.extra=0;this.misses=0;this.finished=false;this.bonus=0;this.totalParts=0;this.expectedSeconds=0;}
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
 snapshot(){return {seconds:this.seconds,score:Math.max(0,this.parts.size*100+this.extra-this.misses*25)+this.bonus,bonus:this.bonus,finished:this.finished};}
}
