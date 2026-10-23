// A local, read-only attraction flight. This controller never writes progress.
// The host must bypass run completion/statistics while active and ignore player
// steering/answers, while keeping this HUD's exit button usable.
import {gardenRootOffset,gardenBassOffset,gardenQualityAnswer} from './garden-harmony.mjs';

export const GARDEN_MODE_DEMO_SECONDS=42;
const sameChord=(a,b)=>Boolean(a&&b&&Number(a.offset)===Number(b.offset)&&a.quality===b.quality&&Number(a.bassOffset??a.offset)===Number(b.bassOffset??b.offset));
export class GardenModeDemo{
 constructor({onExit=()=>{},language=()=> 'ru',host=globalThis.document?.body}={}){
  this.onExit=onExit;this.language=language;this.active=false;this.time=0;this.generation=0;this.hud=null;
  if(host?.ownerDocument){const d=host.ownerDocument;this.hud=d.createElement('aside');this.hud.id='mode-demo';this.hud.hidden=true;this.hud.dataset.userContent='';this.hud.setAttribute('aria-label','Демонстрационный полёт');this.hud.innerHTML='<div class="mode-demo-title"></div><p class="mode-demo-status"></p><p class="mode-demo-requirements"></p><p class="mode-demo-feedback" aria-live="polite"></p><button type="button" data-demo-exit></button>';this.hud.querySelector('button').onclick=()=>this.exit('button');host.append(this.hud);}
 }
 start({difficulty='hard',route,requirements=''}={}){
  this.active=true;this.time=0;this.generation++;this.difficulty=difficulty;this.route=route;this.requirements=requirements;this.window=null;this.done=new Set();this.feedback='';this.render();return this.snapshot();
 }
 setFeedback(text=''){this.feedback=text;if(this.hud)this.hud.querySelector('.mode-demo-feedback').textContent=text;}
 stop(){this.active=false;this.generation++;this.window=null;this.done=new Set();if(this.hud)this.hud.hidden=true;}
 exit(reason='finished'){if(!this.active)return;this.stop();this.onExit(reason);}
 render(){if(!this.hud)return;const en=(typeof this.language==='function'?this.language():this.language)==='en';this.hud.hidden=!this.active;this.hud.setAttribute('aria-label',en?'Demonstration flight':'Демонстрационный полёт');this.hud.querySelector('.mode-demo-title').textContent=en?'DEMO · AUTOPILOT':'ДЕМО · АВТОПИЛОТ';this.hud.querySelector('.mode-demo-status').textContent=en?'No control · no saved progress':'Без управления · без сохранения прогресса';this.hud.querySelector('.mode-demo-requirements').textContent=String(this.requirements||'');this.hud.querySelector('button').textContent=en?'Back to mode selection':'К выбору режима';}
 update(dt,model,sounding,callbacks={}){
  if(!this.active)return null;
  // Pausing/backgrounding freezes the demo deadline, just like the flight.
  if(callbacks.paused||!model?.running)return this.target();
  this.time+=Math.max(0,Math.min(.25,Number(dt)||0));
  if(this.time>=GARDEN_MODE_DEMO_SECONDS){this.exit('finished');return null;}
  if(!sounding?.chord||sounding.chord.reference||model.cursor<0||!sameChord(model.current,sounding.chord))return this.target();
  const elapsed=Number(callbacks.audioTime)-Number(sounding.at),bar=Number(sounding.barSeconds||model.barSeconds),remaining=bar-elapsed;
  if(!Number.isFinite(elapsed)||elapsed<.18||remaining<.18)return this.target();
  const key=[model.cursor,sounding.at,sounding.chord.offset,sounding.chord.quality].join('|');
  if(key!==this.window){this.window=key;this.done=new Set();this.setFeedback('');}
  const parts=model.currentParts||{},kinds=model.answerKinds||['degree','quality'],phase=Math.min(.55,bar*.16);
  const kind=kinds.find((name,index)=>!parts[name]&&!this.done.has(name)&&elapsed>=phase+index*Math.min(.48,bar*.14));
  if(kind&&typeof callbacks.solve==='function'){
   const value=kind==='degree'?(model.rootMode?gardenRootOffset(model.current):gardenBassOffset(model.current)):kind==='bass'?gardenBassOffset(model.current):gardenQualityAnswer(model.current,{rootMode:model.rootMode});
   this.done.add(kind);callbacks.solve(kind,value);
  }
  // These are explicit demonstrations, not claims about random offer balance.
  // The host selects candidates against the actual sounding chord/voicing.
  if(!this.done.has('tone')&&elapsed>=bar*.5&&remaining>=.85){
   this.done.add('tone');const tone=callbacks.toneFor?.(sounding.chord,sounding);if(tone!=null)callbacks.spawnTone?.(tone);
  }
  if(this.difficulty==='professor'&&!this.done.has('mode')&&elapsed>=bar*.58&&remaining>=.75){
   this.done.add('mode');const mode=callbacks.modeFor?.(sounding.chord,sounding);if(mode!=null)callbacks.spawnMode?.(mode);
  }
  return this.target();
 }
 target(){return {x:.5+Math.sin(this.time*.23)*.13,y:.58+Math.sin(this.time*.17)*.035};}
 snapshot(){return {active:this.active,time:this.time,difficulty:this.difficulty||null,route:this.route?.id||null,remaining:Math.max(0,GARDEN_MODE_DEMO_SECONDS-this.time)};}
}
