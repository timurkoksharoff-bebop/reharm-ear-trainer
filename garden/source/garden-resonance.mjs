// Experimental, conservative available-tension drill. Not a universal scale
// lookup: unspecified modes and unsupported qualities are penalty-free.
// Source review: Reharmonization Techniques (2002), printed pp.29-30,
// 98-99 (Figs.10.7-10.9), 125-128 (modal context). See RESONANCE_RULES.md.
import {gardenRouteDrainScale} from './garden-life.mjs';
export const GARDEN_OXYGEN_RULES=Object.freeze({drainPerSecond:.45,reward:6,avoidDamage:20});
export const GARDEN_TENSIONS=Object.freeze([
 {label:'1',interval:12},{label:'♭9',interval:13},{label:'9',interval:14},{label:'♭3',interval:15},
 {label:'3',interval:16},{label:'11',interval:17},{label:'♯11',interval:18},{label:'5',interval:19},
 {label:'♭13',interval:20},{label:'13',interval:21},{label:'♭7',interval:22},{label:'7',interval:23}
]);
const toneSpec=label=>GARDEN_TENSIONS.find(t=>t.label===label)||({'♯9':{label:'♯9',interval:15},'♭5':{interval:18},'6':{interval:21},'♭6':{interval:20},'4':{interval:17},'2':{interval:14}})[label];
const mod=n=>((n%12)+12)%12;
const clamp=n=>Math.max(0,Math.min(100,n));
const canonical=q=>({m:'min',m9:'m7natural9','m7♭5':'m7b5','ireal:7b13':'7b13','ireal:mMaj7':'mMaj7','ireal:m11':'m7natural9','ireal:9':'7','ireal:13':'7','ireal:7#9':'7','ireal:7#11':'7','ireal:o':'dim'})[q]??q;
const known={maj:[0,4,7],'6':[0,4,7,9],maj7:[0,4,7,11],maj7sharp11:[0,4,7,11,18],min:[0,3,7],m6:[0,3,7,9],m7:[0,3,7,10],m7natural9:[0,3,7,10,14],m7b5:[0,3,6,10],m7b5natural9:[0,3,6,10,14],m7b9:[0,3,7,10,13],'7':[0,4,7,10],'7b9':[0,4,7,10,13],'7b9b13':[0,4,7,10,13,20],'7b5':[0,4,6,10],'7sharp5':[0,4,8,10],'7alt':[0,4,6,10,13],'7sus4':[0,5,7,10],sus4:[0,5,7],sus2:[0,2,7],add9:[0,4,7,14]};
export function gardenTensionVerdict(chord,label,context={}){
 const spec=toneSpec(label),q=canonical(chord?.quality),tones=known[q]??({dim:[0,3,6],dim7:[0,3,6,9],aug:[0,4,8],augMaj7:[0,4,8,11],minSharp5:[0,3,8],mMaj7:[0,3,7,11],'7b13':[0,4,7,10,20],'1':[0]})[q];
 if(!spec||!chord||chord.reference||!tones)return 'neutral';
 // An explicitly notated extension is accepted; an enharmonic chord tone
 // is not falsely penalised for being named as a different extension.
 if(tones.some(n=>n>=12&&mod(n)===mod(spec.interval)))return 'valid';
 if(tones.some(n=>mod(n)===mod(spec.interval)))return 'valid';
 label=({0:'1',1:'♭9',2:'9',3:'♯9',4:'3',5:'11',6:'♯11',7:'5',8:'♭13',9:'13',10:'♭7',11:'7'})[mod(spec.interval)];
 if(label==='11'&&tones.includes(4)&&(chord.voicingNote==='no-third'||(Number.isFinite(context.tonic)&&Array.isArray(chord.notes)&&chord.notes.length&&!chord.notes.some(n=>mod(n)===mod(context.tonic+Number(chord.offset)+4)))))return 'neutral';
 const mode=String(chord.tensionMode??context.tensionMode??'').toLowerCase();
 const modes={dorian:['9','11','13'],phrygian:['♭9','11','♭13'],lydian:['9','♯11','13']};
 if(modes[mode])return modes[mode].includes(label)?'valid':'invalid';
 if(['7','7b9','7b9b13','7b5','7sharp5','7alt','7b13'].includes(q)){
  if(label==='11')return 'invalid'; // major third / natural 11 clash, pp.29-30
  if(label==='7')return 'invalid';
  return 'valid';
 }
 if(['maj','6','maj7','maj7sharp11','add9'].includes(q))return ['♭9','11','♭13'].includes(label)?'invalid':['9','♯11','13'].includes(label)?'valid':'neutral';
 if(['min','m6','m7','m7natural9','m7b9','mMaj7'].includes(q))return ['♭9','♭13','3'].includes(label)?'invalid':['9','11'].includes(label)?'valid':'neutral';
 if(['m7b5','m7b5natural9'].includes(q))return ['♭9','3','5'].includes(label)?'invalid':['9','11','♭13'].includes(label)?'valid':'neutral';
 if(['7sus4','sus4','sus2'].includes(q))return ['♯11','♭13'].includes(label)?'invalid':['9','13'].includes(label)?'valid':'neutral';
 return 'neutral';
}
const oxygenProfiles=new WeakMap();
export function gardenOxygenProfile(chord,context={}){
 if(!chord||typeof chord!=='object'||chord.reference)return {available:0,reward:0,drain:0};
 const key=String(context.tonic)+'|'+String(chord.tensionMode??context.tensionMode??'');
 let cache=oxygenProfiles.get(chord);if(!cache){cache=new Map();oxygenProfiles.set(chord,cache);}
 if(!cache.has(key)){
  const available=GARDEN_TENSIONS.filter(t=>gardenTensionVerdict(chord,t.label,context)==='valid').length;
  // Uniform random labels: probability(valid) * reward stays at 3.5 O2
  // per encounter before route scaling. Sparse palettes are not harder
  // to breathe through, and dominant-heavy routes are not a free refill.
  cache.set(key,Object.freeze({available,reward:available?GARDEN_OXYGEN_RULES.reward*7/available:0,drain:available?1:0}));
 }
 return cache.get(key);
}
export function gardenTensionMidi(chord,tonic,label){
 const spec=toneSpec(label);
 return spec&&Number.isFinite(Number(chord?.offset))?60+mod(Number(tonic)+Number(chord.offset))+spec.interval:null;
}
export function drawGardenTension(ctx,label,size,time=0){
 const r=size*.42;ctx.save();ctx.lineCap='round';ctx.strokeStyle='#c2e5ff';ctx.fillStyle='rgba(21,47,69,.10)';ctx.lineWidth=Math.max(.8,size*.018);
 ctx.shadowColor='#97d6ff';ctx.shadowBlur=size*.12;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
 ctx.save();ctx.rotate(time*.25);ctx.globalAlpha*=.42;ctx.strokeStyle='#dac4f5';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(0,0,r*1.15,r*.65,-.5,-.3,Math.PI*1.65);ctx.stroke();ctx.restore();
 for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*r*.32,r*.79);ctx.quadraticCurveTo(side*r*.9,r*.74,side*r*.98,r*.3);ctx.stroke();}
 ctx.fillStyle='#edfbff';ctx.font=`${Math.round(size*.33)}px Georgia,serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,0,0);ctx.restore();
}
export class GardenResonance{
 constructor({random=Math.random,onTone}={}){this.random=random;this.onTone=onTone;this.reset(false);}
 reset(enabled=false){this.enabled=enabled;this.energy=80;this.clock=3;this.time=0;this.routeLength=0;this.entities=[];this.flashes=[];this.sequence=0;this.last=null;this.critical=0;this.gameOver=false;}
 restore(){if(this.enabled&&!this.gameOver){const delta=100-this.energy;this.energy=100;if(delta>.05)this.flashes.push({x:.5,y:.43,label:'O₂',verdict:'valid',delta,age:0});}}
 spawn(label,overrides={}){
  if(!this.enabled||!toneSpec(label))return null;
  const side=this.random()<.5?.22:.70;
  const entity={id:++this.sequence,label,x:side+this.random()*.08,y:-.08,vy:.10+this.random()*.018,age:0,collected:false,...overrides};this.entities.push(entity);return entity;
 }
 collect(entity,sounding,context={}){
  if(!this.enabled||this.gameOver||!entity||entity.collected||!sounding?.chord||sounding.chord.reference)return {ignored:true};
  entity.collected=true;
  const elapsed=Number(context.audioTime)-sounding.at,remaining=sounding.barSeconds-elapsed;
  const boundary=!Number.isFinite(elapsed)||elapsed<.18||(remaining>=0&&remaining<.18);
  const verdict=boundary?'neutral':gardenTensionVerdict(sounding.chord,entity.label,{...context,tonic:sounding.tonic});
  const scale=gardenRouteDrainScale(context.totalChords??this.routeLength,context.barSeconds??sounding.barSeconds);
  const profile=gardenOxygenProfile(sounding.chord,{...context,tonic:sounding.tonic});
  const midi=gardenTensionMidi(sounding.chord,sounding.tonic,entity.label),before=this.energy,requestedDelta=verdict==='valid'?profile.reward*scale:verdict==='invalid'?-GARDEN_OXYGEN_RULES.avoidDamage:0;
  this.energy=clamp(this.energy+requestedDelta);const delta=this.energy-before;this.last={id:entity.id,label:entity.label,verdict,delta,requestedDelta,midi,boundary};
  this.flashes.push({x:entity.x,y:entity.y,label:entity.label,verdict,delta,age:0});
  if(midi!=null)this.onTone?.(midi,this.last);
  return {...this.last};
 }
 update(dt,view={}){
  if(!this.enabled)return;
  if(view.complete){this.entities=[];return;}
  if(!dt||!view.active||view.paused||this.gameOver)return;
  this.time+=dt;for(const flash of this.flashes)flash.age+=dt;this.flashes=this.flashes.filter(f=>f.age<1.8);
  const ready=Boolean(view.sounding?.chord&&!view.sounding.chord.reference);
  const elapsed=Number.isFinite(view.clockDt)?Math.max(0,Math.min(.5,view.clockDt)):dt;
  const solved=Math.max(0,Number(view.solvedChords)||0),total=Math.max(2,Number(view.totalChords)||2);
  this.routeLength=total;
  const unlocked=solved>=2,progress=Math.max(0,Math.min(1,(solved-2)/Math.max(1,total-2)));
  // Breathing starts with the first actual chord, not only after hints unlock.
  // Normalize positive income as well as expenditure on long routes: otherwise
  // unscaled pickups could outgrow the discounted drain indefinitely.
  if(ready)this.energy=clamp(this.energy-elapsed*GARDEN_OXYGEN_RULES.drainPerSecond*gardenRouteDrainScale(total,view.barSeconds??4)*gardenOxygenProfile(view.sounding.chord,{...view,tonic:view.sounding.tonic}).drain);
  if(ready&&unlocked){
   this.clock-=elapsed;
   if(this.clock<=0&&this.entities.length<4){
    // Labels never reveal which will fit the chord at collision time.
    this.spawn(GARDEN_TENSIONS[Math.floor(this.random()*GARDEN_TENSIONS.length)].label);
    this.clock=(4.2+this.random()*1.2)*(2-progress);
   }
  }
  for(const e of this.entities){
   e.age+=dt;e.y+=e.vy*dt;
   if(ready&&view.ship!==2&&Math.hypot(e.x*view.width-view.x,e.y*view.height-view.y)<18.2+(view.shipRadius??14))this.collect(e,view.sounding,view);
  }
  this.entities=this.entities.filter(e=>!e.collected&&e.y<1.12);
  if(this.energy<=0)this.critical+=elapsed;else this.critical=0;
  if(this.critical>=3.5)this.gameOver=true;
 }
 draw(ctx,width,height){
  if(!this.enabled)return;
  for(const e of this.entities){ctx.save();ctx.translate(e.x*width,e.y*height);ctx.globalAlpha=Math.min(1,e.age*3)*.88;drawGardenTension(ctx,e.label,35,e.age);ctx.restore();}
  for(const f of this.flashes){
   const bad=f.verdict==='invalid',color=bad?'#ff716e':f.verdict==='valid'?'#a3ffcf':'#d7ddff',x=Math.max(65,Math.min(width-65,f.x*width)),y=Math.max(65,Math.min(height-65,f.y*height));
   ctx.save();ctx.globalAlpha=Math.min(.95,(1.8-f.age)*1.2);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.shadowColor=bad?'#ff3030':'#10242b';ctx.shadowBlur=bad?14:5;ctx.lineWidth=2;
   if(bad&&f.age<.75){ctx.beginPath();ctx.arc(x,y,19+f.age*15,0,Math.PI*2);ctx.stroke();ctx.globalAlpha*=.25;ctx.fill();ctx.globalAlpha=Math.min(.95,(1.8-f.age)*1.2);}
   ctx.textAlign='center';ctx.font='bold 20px Georgia';ctx.fillText(f.label,x,y-f.age*24);ctx.font='bold 18px system-ui';
   const amount=Math.round(Math.abs(f.delta)*10)/10;ctx.fillText(`${f.delta<0?'−':'+'}${amount} O₂`,x,y-f.age*24+24);ctx.restore();
  }
 }
 snapshot(){return {enabled:this.enabled,energy:this.energy,gameOver:this.gameOver,last:this.last&&{...this.last},entities:this.entities.map(e=>({...e}))};}
}
