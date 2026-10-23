import assert from 'node:assert/strict';
import {gardenModeLayoutDefaults,normalizeGardenModeLayout,gardenModeLayoutTransforms} from '../garden-mode-layout.mjs';
const base={light:{x:5,y:69,width:29,height:5.3},medium:{x:35,y:69,width:29,height:5.3},hard:{x:65,y:69,width:29,height:5.3},professor:{x:20,y:62,width:29,height:5.3},guru:{x:50,y:62,width:29,height:5.3}};
const approved=gardenModeLayoutDefaults();assert.equal(approved.style,'capsule');assert.equal(approved.buttons.professor.x,-1.1);assert.equal(approved.buttons.guru.x,1.1);
const preset=gardenModeLayoutTransforms(approved,base);for(const [id,t]of Object.entries(preset)){assert(Math.abs(t.x-(id==='professor'?-1.1:id==='guru'?1.1:0))<1e-10&&Math.abs(t.y)<1e-10);assert.equal(t.scale,1);assert.equal(t.rotation,0);}
const identityState=gardenModeLayoutDefaults();identityState.buttons.professor.x=identityState.buttons.guru.x=0;
const identity=gardenModeLayoutTransforms(identityState,base);for(const t of Object.values(identity))assert(Math.abs(t.x)<1e-10&&Math.abs(t.y)<1e-10);
const s=gardenModeLayoutDefaults();s.group.x=12;s.group.y=-20;for(const [id,t]of Object.entries(gardenModeLayoutTransforms(s,base))){assert(Math.abs(t.x-(12+(id==='professor'?-1.1:id==='guru'?1.1:0)))<1e-10&&Math.abs(t.y+20)<1e-10);}
s.buttons.professor.rotation=35;s.buttons.professor.scale=1.4;s.upper.x=4;const changed=gardenModeLayoutTransforms(s,base);assert.equal(changed.professor.rotation,35);assert.equal(changed.professor.scale,1.4);assert(Math.abs(changed.professor.x-14.9)<1e-10);assert(Math.abs(changed.medium.x-12)<1e-10);
const raw=normalizeGardenModeLayout({version:1,group:{x:Infinity,y:-1000,scale:99},buttons:{guru:{rotation:999,scale:-2}}});assert.equal(raw.group.x,0);assert.equal(raw.group.y,-100);assert.equal(raw.group.scale,2.5);assert.equal(raw.buttons.guru.rotation,180);assert.equal(raw.buttons.guru.scale,.3);assert.deepEqual(normalizeGardenModeLayout({version:7}),gardenModeLayoutDefaults());
const gap=gardenModeLayoutDefaults();gap.group.gap=10;const moved=gardenModeLayoutTransforms(gap,base);assert(Math.abs(moved.professor.y+5)<1e-10&&Math.abs(moved.light.y-5)<1e-10);
for(const style of ['original','porcelain','capsule','portal','lotus'])assert.equal(normalizeGardenModeLayout({version:1,style}).style,style);
assert.equal(normalizeGardenModeLayout({version:1,style:'invalid'}).style,'original');
assert.equal(normalizeGardenModeLayout({version:1}).style,'original','old layouts preserve their original shape');
const saved={version:1,style:'lotus',group:{x:2,y:-3,scale:.9,gap:1},upper:{x:0,y:0,scale:1,spacing:1},lower:{x:0,y:0,scale:1,spacing:1},buttons:Object.fromEntries(Object.keys(base).map(id=>[id,{x:0,y:0,scale:1,rotation:0}]))};assert.deepEqual(normalizeGardenModeLayout(saved),saved,'existing complete layouts retain their overrides');
console.log('PASS mode layout: approved capsule preset and exact upper offsets; normalized group/row/button transforms, scale/rotation, independent rows, gap, bounded and preserved stored values.');
