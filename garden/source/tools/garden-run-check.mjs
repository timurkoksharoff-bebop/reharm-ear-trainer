import assert from 'node:assert/strict';
import {GardenRun} from '../garden-run.mjs';
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
console.log('Run/balance passed: long-route first-lap reserve, unchanged short pacing, finite bonus, anti-farming and frozen completion.');
