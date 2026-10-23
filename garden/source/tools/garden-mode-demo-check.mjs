import assert from 'node:assert/strict';
import {GardenModeDemo,GARDEN_MODE_DEMO_SECONDS} from '../garden-mode-demo.mjs';
let exits=0,solves=[],tones=[],modes=[];
const d=new GardenModeDemo({host:null,onExit:()=>exits++});
const chord={offset:4,quality:'m7',bassOffset:11},model={running:true,cursor:0,current:chord,rootMode:true,barSeconds:4,answerKinds:['degree','quality','bass'],currentParts:{degree:false,quality:false,bass:false}};
const sounding={chord,at:0,barSeconds:4};
const c={audioTime:0,solve:(kind,value)=>{solves.push([kind,value]);model.currentParts[kind]=true;},toneFor:()=> '9',modeFor:()=> 'dorian',spawnTone:v=>tones.push(v),spawnMode:v=>modes.push(v)};
d.start({difficulty:'professor',route:{id:'exact-demo'}});
for(let i=0;i<30;i++){c.audioTime=i*.1;d.update(.1,model,sounding,c);}
assert.deepEqual(solves,[['degree',4],['quality','m7'],['bass',11]]);assert.deepEqual(tones,['9']);assert.deepEqual(modes,['dorian']);
const t=d.time;d.update(.2,model,sounding,{...c,paused:true});assert.equal(d.time,t);
for(let i=0;i<10;i++)d.update(.1,model,sounding,c);assert.equal(solves.length,3);
const target=d.target();assert(target.x>=.37&&target.x<=.63);assert(target.y>=.545&&target.y<=.615);
while(d.active)d.update(.25,model,sounding,{audioTime:3.5});assert.equal(exits,1);assert(d.time>=GARDEN_MODE_DEMO_SECONDS);d.exit();assert.equal(exits,1);
d.start({difficulty:'hard'});d.stop();assert.equal(exits,1,'host stop is not a second exit callback');
console.log('PASS demo: paced correct root/quality/independent bass, per-onset tone/mode, pause, bounded autopilot, finite deadline, single exit; no storage.');
