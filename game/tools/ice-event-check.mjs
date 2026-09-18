import assert from 'node:assert/strict';
import {createIceEvent,icePointClear,iceSegmentClear,ICE_TIMING} from '../ice-event.mjs';
let seed=5;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const p={x:240,y:440,tx:400,ty:500};const obstacles=[{x:0,y:240,w:150,h:50},{x:350,y:240,w:130,h:50},{x:270,y:150,r:35}];
const ice=createIceEvent({width:()=>480,height:()=>590,player:()=>p,obstacles:()=>obstacles,random});
assert(!iceSegmentClear({x:50,y:170},{x:50,y:350},obstacles,480,590),'cannot tunnel through wall');
assert(!icePointClear({x:270,y:150},obstacles,480,590));
assert(ice.placeTrap([{x:100,y:180},{x:220,y:180}]));let trap=ice.snapshot().trap;p.x=trap.x;p.y=trap.y;ice.tick(.01,{digits:[{x:100,y:180},{x:220,y:180}]});assert(ice.frozen);assert.equal(p.tx,p.x);assert.equal(ice.activate(),false,'no stacking');
for(let i=0;i<ICE_TIMING.visit*60;i++){ice.tick(1/60);const s=ice.snapshot().sable;if(s)assert(icePointClear(s,obstacles,480,590),'sable footprint avoids geometry');}
assert(!ice.frozen);assert(ice.snapshot().age>=3);assert(ice.snapshot().tracks.length<=360);
for(let i=0;i<300;i++)ice.tick(1/60);assert.equal(ice.snapshot().age,-1);assert(!ice.frozen);assert.equal(ice.snapshot().tracks.length,0);
ice.activate();ice.reset();assert(!ice.frozen);assert.equal(ice.snapshot().sable,null);assert.equal(ice.snapshot().trap,null);
console.log('Ice event passed: pickup, 3-second lock, no stacking, geometry, bounded trails, melt, reset.');
