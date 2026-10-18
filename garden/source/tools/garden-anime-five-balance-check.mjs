import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GardenResonance,gardenTensionVerdict} from '../garden-resonance.mjs';
import {createGardenMission} from '../garden-harmony.mjs';
const row=JSON.parse(fs.readFileSync(new URL('../embedded-user-routes.json',import.meta.url),'utf8')).routes.find(r=>r[3]==='anime'&&r[2]==='05');
assert(row,'real embedded Anime 05 exists');
const source={id:row[0],baseTonic:row[4],sequence:row[6].map(([label,pc,quality,notes,voicingNote])=>({label,offset:(pc-row[4]+12)%12,rootPc:pc,quality,notes,bassPc:Math.min(...notes)%12,bassOffset:(Math.min(...notes)%12-pc+12)%12,voicingNote}))};
const before=JSON.stringify(source),route=createGardenMission({exercise:source,separateBass:true}).snapshot().exercise;
assert.equal(route.sequence.length,8);
const fSharpMinorNine=route.sequence[6];
assert.equal(fSharpMinorNine.quality,'m9');
assert.equal(gardenTensionVerdict(fSharpMinorNine,'11',{tonic:route.baseTonic}),'valid','Anime 05 F#m9 accepts natural 11');
const rescue=new GardenResonance();rescue.reset(true);rescue.energy=0;rescue.critical=3.45;
const rescueView={active:true,ship:1,width:400,height:844,x:200,y:400,solvedChords:2,totalChords:8,barSeconds:4,clockDt:.05,audioTime:101,sounding:{chord:fSharpMinorNine,tonic:route.baseTonic,at:100,barSeconds:4}};
rescue.spawn('11',{x:.5,y:400/844,vy:0});rescue.update(.05,rescueView);
assert.equal(rescue.last.verdict,'valid');assert(rescue.last.delta>0);assert.equal(rescue.last.midi,83,'natural 11 over F# is B');
assert(!rescue.gameOver&&rescue.critical===0,'valid 11 rescues zero oxygen during the grace window, rather than failing the mission');
rescue.reset(true);rescue.energy=0;for(let i=0;i<71;i++)rescue.update(.05,{...rescueView,ship:2});
assert(rescue.gameOver,'zero oxygen without replenishment fails after 3.5 seconds independently of any tone');
const accurate=[],blind=[];
function fly(seed,selective){
 let rng=seed;const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
 const oxygen=new GardenResonance({random});oxygen.reset(true);
 for(let i=0;i<1600;i++){
  const t=(i+1)/10,chord=route.sequence[Math.floor(t/4)%8],view={active:true,ship:2,width:400,height:844,x:200,y:400,solvedChords:t>=8?2:0,totalChords:8,barSeconds:4,clockDt:.1,audioTime:t,sounding:{chord,tonic:route.baseTonic,at:Math.floor(t/4)*4,barSeconds:4}};
  oxygen.update(.1,view);
  // Actual random labels and their falling travel time; judge the chord at
  // contact, never substitute a convenient valid ninth for every pickup.
  for(const e of [...oxygen.entities])if(e.y>=.65&&e.y<.67&&(!selective||gardenTensionVerdict(chord,e.label,{tonic:route.baseTonic})==='valid'))oxygen.collect(e,view.sounding,view);
  if(oxygen.gameOver)break;
 }
 return oxygen.energy;
}
for(let seed=1;seed<=100;seed++){accurate.push(fly(seed,true));blind.push(fly(seed,false));}
accurate.sort((a,b)=>a-b);blind.sort((a,b)=>a-b);
assert(accurate[50]>=40,'typical accurate collection leaves a useful reserve after five laps');
assert(accurate[0]>0,'all 100 accurate simulations survive five laps without restorative pickups');
assert(blind[50]<accurate[50],'blind catching is not rewarded over actual knowledge');
assert.equal(JSON.stringify(source),before,'original Anime notes and voicings unchanged');
console.log('Anime 05 passed: 8 chords / 32s lap, 100 random sequences, five laps. O2 accurate min/median/max:',accurate[0].toFixed(1),accurate[50].toFixed(1),accurate[99].toFixed(1),'blind median:',blind[50].toFixed(1));
