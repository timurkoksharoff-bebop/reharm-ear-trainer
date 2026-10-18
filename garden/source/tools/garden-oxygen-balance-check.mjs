import assert from 'node:assert/strict';
import {GardenResonance} from '../garden-resonance.mjs';
import {GardenLife} from '../garden-life.mjs';
const rows=[];
function simulate(n,seconds,mode,interval=4.2){
 const oxygen=new GardenResonance({random:()=>.5}),life=new GardenLife({random:()=>.5});oxygen.reset(true);
 life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=life.assistClock=life.arrangementClock=99999;
 let pickup=0,next=interval;
 for(let step=0;step<Math.round(seconds*10);step++){
  const t=(step+1)/10,view={active:true,answering:false,width:400,height:844,x:200,y:400,ship:2,speed:2,totalChords:n,routeLength:n,solvedChords:Math.min(n-1,Math.floor(t/4)),barSeconds:4,sounding:{chord:{offset:0,quality:'7'},tonic:0,at:t-1,barSeconds:4},audioTime:t};
  life.update(.1,view);oxygen.update(.1,view);oxygen.entities=[];
  if(mode!=='none'&&t>=next&&view.solvedChords>=2){
   const label=mode==='random'&&pickup%3===0?'11':'9';
   oxygen.collect(oxygen.spawn(label),view.sounding,view);pickup++;next=t+interval;
  }
  if(oxygen.gameOver)break;
 }
 return {oxygen:oxygen.energy,water:life.resources.water,failed:oxygen.gameOver};
}
for(const n of [4,8,16,24,32,39,64,75,128]){
 const duration=Math.min(60,(n+1)*4),none=simulate(n,duration,'none'),perfect=simulate(n,duration,'perfect'),random=simulate(n,duration,'random');
 assert(80-none.oxygen>=78-none.water,'without pickups O2 loss >= H2O loss, n='+n);
 assert(perfect.oxygen>none.oxygen,'accurate catching visibly replenishes oxygen, n='+n);
 assert(random.oxygen<perfect.oxygen,'blind catching is worse than accurate catching, n='+n);
 const lap=simulate(n,(n+1)*4,'none');assert(!lap.failed&&lap.oxygen>=14,'long-route one-lap reserve stays intact, n='+n);
 rows.push({chords:n,seconds:duration,O2_no_pickups:none.oxygen.toFixed(1),O2_perfect:perfect.oxygen.toFixed(1),H2O:perfect.water.toFixed(1),O2_random:random.oxygen.toFixed(1)});
}
assert(simulate(16,240,'none').failed,'ignoring oxygen eventually ends the flight');
const normal=simulate(16,60,'perfect',8);
assert(normal.oxygen>=75&&normal.oxygen<=85,'one correct dominant pickup per eight seconds approximately supports breathing');
const paused=new GardenResonance();paused.reset(true);paused.update(30,{active:true,paused:true});paused.update(30,{active:true,sounding:{chord:{reference:true}}});assert.equal(paused.energy,80,'pause and tonic reference are free');
const restored=new GardenResonance();restored.reset(true);restored.energy=20;restored.restore();assert.equal(restored.energy,100);
for(const fps of [2,5,10,15,30,60]){
 const o=new GardenResonance();o.reset(true);
 for(let i=0;i<60*fps;i++)o.update(Math.min(.05,1/fps),{clockDt:1/fps,active:true,solvedChords:2,totalChords:8,width:400,height:844,x:200,y:400,ship:2,sounding:{chord:{offset:0,quality:'7'}}});
 assert(Math.abs(o.energy-53)<1e-7,'60 seconds costs the same oxygen at '+fps+' FPS');
}
console.table(rows);console.log('Oxygen balance passed: no collections, maximum-frequency accurate collections, blind collections, H2O comparison, first-lap reserve, pause and restoration.');
