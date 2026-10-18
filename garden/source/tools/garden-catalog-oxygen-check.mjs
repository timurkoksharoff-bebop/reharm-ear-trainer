import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BOOK_CATALOG} from '../book-catalog.mjs';
import {createGardenMission} from '../garden-harmony.mjs';
import {GardenResonance,GARDEN_TENSIONS,gardenTensionVerdict,gardenOxygenProfile,GARDEN_OXYGEN_RULES} from '../garden-resonance.mjs';

// Read exactly the Jazz/embedded records used by the release; do not create
// substitute progressions. refresh() also uses the real MIDI recognizer.
const bundle=fs.readFileSync(new URL('../../garden-flight.bundle.js',import.meta.url),'utf8');
for(const name of ['GARDEN_JAZZ_ROUTES','GARDEN_EMBEDDED_ROUTES','GARDEN_EMBEDDED_CATEGORIES']){
 const match=bundle.match(new RegExp('window\\.'+name+'=(\\[[^\\n]*?\\]);'));
 assert(match,'release catalog '+name);globalThis[name]=JSON.parse(match[1]);
}
globalThis.window=globalThis;
const {GardenSequenceStudio}=await import('../garden-sequence-studio.mjs');
const studio=Object.create(GardenSequenceStudio.prototype);
studio.renderCategoryOptions=studio.renderLibrary=()=>{};await studio.refresh();
const routes=[...BOOK_CATALOG.map(r=>({...r,tour:'reharm'})),...studio.routes];
const source=JSON.stringify(routes),seeds=Number(process.env.OXYGEN_SEEDS)||25;
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
function simulate(route,seed,strategy){
 let rng=seed;const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
 const oxygen=new GardenResonance({random});oxygen.reset(true);
 const n=route.sequence.length,seconds=n*4*3,verdicts=route.sequence.map(chord=>Object.fromEntries(GARDEN_TENSIONS.map(t=>[t.label,gardenTensionVerdict(chord,t.label,{tonic:route.baseTonic})])));
 // A slow learner: first two answers by 8s, thereafter one further position
 // per 8s. Never mark complete, so a three-lap audit continues spending.
 for(let i=0;i<seconds*20;i++){
  const t=(i+1)/20,index=Math.floor(t/4)%n,chord=route.sequence[index];
  const view={active:true,ship:2,width:390,height:844,x:200,y:400,solvedChords:Math.min(n-1,Math.floor(t/8)+1),totalChords:n,barSeconds:4,clockDt:.05,audioTime:t,sounding:{chord,tonic:route.baseTonic,at:Math.floor(t/4)*4,barSeconds:4}};
  oxygen.update(.05,view);
  for(const e of [...oxygen.entities])if(!e.testEncounter&&e.y>=.65){
   e.testEncounter=true;
   // Separate deterministic choice stream so a missed catch does not change
   // future spawned labels; 75% of valid encounters is not perfect play.
   const catchable=((Math.imul(e.id,2654435761)+seed)>>>0)%4!==0;
   if(strategy==='blind'||strategy==='accurate'&&verdicts[index][e.label]==='valid'&&catchable)oxygen.collect(e,view.sounding,view);
  }
  if(oxygen.gameOver)break;
 }
 return oxygen.energy;
}
const results=[];
for(const original of routes){
 const route=createGardenMission({exercise:original,rootMode:true,separateBass:true}).snapshot().exercise;
 for(const chord of route.sequence){
  const profile=gardenOxygenProfile(chord,{tonic:route.baseTonic});
  assert(profile.available>0,original.name+' has collectible oxygen on '+chord.quality);
  assert(Math.abs(profile.available/12*profile.reward-3.5)<1e-9,'income independent of palette size');
  const avoids=GARDEN_TENSIONS.filter(t=>gardenTensionVerdict(chord,t.label,{tonic:route.baseTonic})==='invalid').length;
  if(avoids)assert(3.5-avoids/12*GARDEN_OXYGEN_RULES.avoidDamage<3.5*.75,'blind expected income is below 75% accurate catching');
 }
 const accurate=[],blind=[];
 for(let seed=1;seed<=seeds;seed++){accurate.push(simulate(route,seed,'accurate'));blind.push(simulate(route,seed,'blind'));}
 results.push({tour:original.tour,name:original.name,n:route.sequence.length,median:median(accurate),min:Math.min(...accurate),blind:median(blind)});
}
console.table([...new Set(results.map(r=>r.tour))].map(tour=>{const group=results.filter(r=>r.tour===tour);return {tour,routes:group.length,lowestMedian:Math.min(...group.map(r=>r.median)).toFixed(1),highestMedian:Math.max(...group.map(r=>r.median)).toFixed(1),failed:group.filter(r=>r.median<=0).length};}));
console.log('Lowest reserves:',results.toSorted((a,b)=>a.median-b.median).slice(0,8));
assert.equal(JSON.stringify(routes),source,'no source notes/voicings changed');
if(!process.argv.includes('--report')){
 assert(results.every(r=>r.median>=20),'every catalog route has a useful typical reserve after three laps at 75% valid collection');
 assert(results.every(r=>r.min>0),'all seeded careful runs survive three laps without restoration');
 assert(median(results.map(r=>r.blind))<median(results.map(r=>r.median)),'catalog-wide blind collection performs worse; neutral-only palettes are not falsely penalised');
}
console.log(`Catalog oxygen: ${routes.length} routes, ${seeds} random streams each, three laps, 75% valid catches versus blind catches. No restoration or score farming.`);
