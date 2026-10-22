import assert from 'node:assert/strict';
import {GardenRun,GardenProfessorCombos} from '../garden-run.mjs';
import {gardenRouteDrainScale,createGardenLife} from '../garden-life.mjs';
const model={exercise:{sequence:Array(32).fill({})},barSeconds:4,totalParts:64,progress:Array.from({length:32},()=>({degree:true,quality:true}))};
const fast=new GardenRun(),slow=new GardenRun();
for(const r of [fast,slow])r.observe({...model,progress:[]});
fast.tick(128,true);slow.tick(256,true);
for(let i=0;i<1000;i++)slow.tone({verdict:'valid',midi:60+i%12},i);
fast.observe({...model,complete:true});slow.observe({...model,complete:true});
assert(fast.snapshot().score>slow.snapshot().score,'double-time farming never beats the fast clear');
const frozen=fast.snapshot();fast.tick(50,true);fast.tone({verdict:'valid',midi:62},0);assert.deepEqual(fast.snapshot(),frozen,'completed route freezes time and score');
const r=new GardenRun();r.observe({...model,progress:[]});r.tick(20,false);assert.equal(r.seconds,0);r.tone({verdict:'valid',midi:60},0);r.tone({verdict:'valid',midi:72},0);assert.equal(r.extra,10,'same pitch class cannot be farmed on repeated laps');
for(const n of [4,8,16,24,32,39,64,75,128]){
 const life=createGardenLife({random:()=>.5});life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=life.assistClock=life.arrangementClock=99999;
 const view={width:400,height:844,x:200,y:400,ship:2,speed:2,active:true,answering:false,routeLength:n,barSeconds:4};
 for(let t=0;t<(n+1)*4;t+=.1)life.update(.1,view);
 assert(life.resources.fuel>39,'one full lap remains viable without random pickups, length '+n);
 assert(!life.gameOver);assert(gardenRouteDrainScale(n)>0&&gardenRouteDrainScale(n)<=1);
}
const mode={verdict:'compatible',modeId:'lydian',notes:[72,74,76,78,79,81,83,84],tier:{id:'base',points:6},points:6};
const tone={verdict:'valid',midi:78};
const permutations=items=>items.length?items.flatMap((item,i)=>permutations(items.filter((_,j)=>i!==j)).map(rest=>[item,...rest])):[[]];
for(const order of permutations(['degree','quality','bass','tone','mode'])){
 const events=[],combos=new GardenProfessorCombos({onCombo:e=>events.push(e)});combos.observe({position:2,onset:10,requiredKinds:['degree','quality','bass']});let answers=0;
 for(const action of order){if(action==='tone')combos.tone(tone);else if(action==='mode')combos.mode(mode);else combos.answer({kind:action,correct:true,independent:true,positionComplete:++answers===3});}
 assert.equal(events.reduce((sum,e)=>sum+e.points,0),48,'any honest answer/tone/mode order earns the same total');assert.equal(events.at(-1)?.id,'constellation');
 assert.equal(combos.mode(mode),null);assert.equal(combos.tone(tone),null,'same window duplicates cannot pay twice');
}
const comboEvents=[],combo=new GardenProfessorCombos({onCombo:e=>comboEvents.push(e)}),start=(onset=1)=>combo.observe({position:0,onset,requiredKinds:['degree','quality']});
const core=(tracker=combo,independent=true)=>{tracker.answer({kind:'degree',correct:true,independent,positionComplete:false});return tracker.answer({kind:'quality',correct:true,independent,positionComplete:true});};
start();core();assert.equal(combo.tone(tone).id,'precision');assert.deepEqual(combo.mode(mode),{id:'constellation',position:0,onset:1,points:30,total:48});assert.equal(comboEvents.reduce((sum,e)=>sum+e.points,0),48);
start(2);core();combo.tone(tone);assert.equal(combo.mode(mode),null,'a later lap cannot farm a previously earned combination');
combo.observe({position:1,onset:3,requiredKinds:['degree','quality']});core();assert.equal(combo.mode(mode).id,'insight');assert.equal(combo.tone({verdict:'valid',midi:77}),null,'a valid tone outside the chosen scale cannot form resonance');assert.equal(combo.tone(tone).points,24,'constellation upgrades only by its remaining points');
combo.observe({position:3,onset:4,requiredKinds:['degree','quality']});combo.answer({kind:'degree',correct:true,independent:true,positionComplete:false});combo.answer({kind:'degree',correct:true,independent:true,positionComplete:true});combo.tone(tone);assert.equal(combo.mode(mode).id,'resonance','repeated single part is not all core answers');
combo.observe({position:4,onset:5,requiredKinds:['degree','quality']});combo.answer({kind:'degree',correct:false,independent:true});core();combo.tone(tone);assert.equal(combo.mode(mode).id,'resonance','mistakes prevent manual-core combos while a matching tone/scale still counts');
combo.observe({position:5,onset:6,requiredKinds:['degree','quality']});core(combo,false);combo.tone(tone);assert.equal(combo.mode(mode).id,'resonance','assisted filters cannot establish independent core answers');
combo.observe({position:6,onset:7,requiredKinds:['degree','quality']});core();combo.tone({...tone,boundary:true});assert.equal(combo.mode({...mode,boundary:true}),null);assert.equal(combo.mode({...mode,verdict:'neutral'}),null,'neutral/boundary contacts give no combo');
combo.observe({position:7,onset:8,requiredKinds:['degree','quality']});core();combo.observe({position:7,onset:9,requiredKinds:['degree','quality']});combo.tone(tone);assert.equal(combo.mode(mode).id,'resonance','manual answers never leak across actual chord attacks');
combo.observe({position:8,onset:10,requiredKinds:['degree','quality']});combo.answer({kind:'degree',correct:false,independent:false,ignored:true});core();combo.mode(mode);assert.equal(combo.tone(tone).id,'constellation','ignored events neither credit nor poison a real clean attempt');
combo.observe({position:8,onset:10,complete:true});const comboFrozen=combo.snapshot();assert.equal(combo.tone(tone),null);assert.deepEqual(combo.snapshot(),comboFrozen);combo.reset();assert.deepEqual(combo.snapshot().best,{});
const upgraded=new GardenProfessorCombos();upgraded.observe({position:0,onset:1});core(upgraded);assert.equal(upgraded.tone(tone).points,18);upgraded.observe({position:0,onset:2});core(upgraded);assert.equal(upgraded.mode(mode).points,6,'a higher combo on a later lap pays only the increase');assert.equal(upgraded.tone(tone).points,24);
const replaced=new GardenProfessorCombos();replaced.observe({position:0,onset:1});replaced.mode(mode);replaced.mode({verdict:'invalid',modeId:'phrygian',notes:[72,73,75,77,79,80,82,84]});assert.equal(replaced.tone(tone),null,'an invalid new mode clears earlier Lydian evidence');assert.deepEqual(replaced.snapshot().modes,[]);
replaced.observe({position:1,onset:2});replaced.mode(mode);replaced.mode({...mode,modeId:'contextual',verdict:'neutral'});assert.equal(replaced.tone(tone),null,'a contextual new mode also clears earlier compatible evidence');
replaced.observe({position:2,onset:3});assert.equal(replaced.mode({...mode,onset:2}),null);assert.equal(replaced.tone({...tone,onset:2}),null);assert.equal(replaced.answer({kind:'degree',correct:true,independent:true,onset:2}),null);assert.deepEqual(replaced.snapshot().modes,[]);assert.deepEqual(replaced.snapshot().tones,[]);assert.deepEqual(replaced.snapshot().answers,[],'explicit stale onset evidence is ignored');
const professorRun=new GardenRun();professorRun.observe({...model,progress:[]});assert.equal(professorRun.mode(mode,0),6);assert.equal(professorRun.mode(mode,0),0,'mode reward is once per position/mode across laps');assert.equal(professorRun.mode({...mode,modeId:'rare',tier:{points:14},points:0},0),0,'onset duplicate marker must not earn a mode reward');assert.equal(professorRun.mode({...mode,verdict:'neutral'},1),0);assert.equal(professorRun.mode({...mode,boundary:true},1),0);
assert.equal(professorRun.combo({id:'precision',points:18,total:18},0),18);assert.equal(professorRun.combo({id:'constellation',points:30,total:48},0),30);assert.equal(professorRun.combo({id:'constellation',points:48,total:48},0),0);
professorRun.extra=495;assert.equal(professorRun.mode({...mode,modeId:'jazz',tier:{points:10},points:10},1),5,'returns actual score delta at shared cap');assert.equal(professorRun.combo({id:'constellation',points:48,total:48},1),0);assert.equal(professorRun.extra,500);
const smallRun=new GardenRun();smallRun.observe({...model,totalParts:6,progress:[]});for(let i=0;i<20;i++){smallRun.mode({...mode,modeId:'mode-'+i},i);smallRun.combo({id:'constellation',points:48,total:48},i);}assert.equal(smallRun.extra,60,'tone, mode and combo share the route-size cap');smallRun.observe({...model,totalParts:6,complete:true});const smallFrozen=smallRun.snapshot();assert.equal(smallRun.mode(mode,30),0);assert.equal(smallRun.combo({id:'constellation',points:48,total:48},30),0);assert.deepEqual(smallRun.snapshot(),smallFrozen,'mode/combo events cannot change a saved completed route');
console.log('Run/balance passed: long-route reserve, original scoring, bounded Professor modes and same-onset independent combos, 120 input orders, no farming, frozen completion.');
