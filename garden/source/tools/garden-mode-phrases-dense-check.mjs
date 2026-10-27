import assert from 'node:assert/strict';
import {gardenModePhraseDense} from '../garden-mode-phrases-dense.mjs';
import {gardenModePhraseZero} from '../garden-mode-phrases-zero.mjs';
import {GARDEN_MODES} from '../garden-modes.mjs';

const pc=n=>((n%12)+12)%12;
let checked=0;
for(const mode of GARDEN_MODES)for(let root=60;root<72;root++)for(const remaining of [.65,.8,1.2,1.7,2.5,3.8,6])for(const barSeconds of [2,4,6]){
 const notes=[...mode.notes,12].map(n=>root+n),chord={quality:'maj7',notes:[root-12,root+4,root+7,root+11]};
 const options={modeId:mode.id,chord,barSeconds,remaining,variation:checked%48};
 const before=JSON.stringify({notes,options}),plan=gardenModePhraseDense(notes,options);
 assert(plan,mode.id+' '+remaining);
 assert.equal(JSON.stringify({notes,options}),before,'inputs are not mutated');
 assert.deepEqual(plan,gardenModePhraseDense(notes,options),'deterministic audition');
 assert(plan.events.length>=2&&plan.events.length<=18);
 assert.deepEqual(plan.notes,plan.events.map(event=>event.midi));
 assert.equal(plan.events.at(-1).role,'target');
 assert([0,4,7,11].includes(pc(plan.target-root)),'target stays in the actual chord/scale intersection');
 assert(plan.events.some(event=>plan.characteristic.some(n=>pc(n-root)===pc(event.midi-root))),'modal colour survives the denser response');
 assert(plan.duration<=Math.min(4.8,remaining-.12)+1e-9,'ends before the actual chord boundary');
 for(let i=0;i<plan.events.length;i++){
  const event=plan.events[i];
  assert(mode.notes.includes(pc(event.midi-root)),'never substitute a different mode');
  assert(Number.isFinite(event.midi)&&event.midi>=root-5&&event.midi<=root+17);
  assert(event.onset>=0&&event.duration>=.045&&event.velocity>=.4&&event.velocity<=.92);
  assert(event.onset+event.duration<=remaining-.12+1e-9);
  if(i)assert(event.onset-plan.events[i-1].onset>=.075-1e-9,'bounded double-time attacks, no compressed emergency run');
 }
 for(let i=1;i<plan.segments.length;i++)assert(plan.segments[i].start-plan.segments[i-1].end>=.05-1e-9,'small deliberate breath separates call and response');
 checked++;
}
const notes=[60,62,63,65,67,69,70,72],options={modeId:'dorian',chord:{quality:'m7'},barSeconds:4,remaining:3.8};
const intervals=plan=>plan.events.slice(1).map((event,i)=>event.onset-plan.events[i].onset).sort((a,b)=>a-b);
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
let longCount=0;const baseIntervals=[],denseIntervals=[],patterns=new Set(),melodies=new Set(),rhythms=new Set();
for(let variation=0;variation<48;variation++){
 const base=gardenModePhraseZero(notes,{...options,variation}),dense=gardenModePhraseDense(notes,{...options,variation});
 assert(dense.events.length>=8,'early pickup gives a longer connected sentence');
 assert(dense.events.length>base.events.length,'density adds development rather than finishing after the sped-up cell');
 assert(dense.segments.length>=2);assert(dense.events.some(e=>e.role==='motif'));
 const late=gardenModePhraseDense(notes,{...options,remaining:.8,variation});
 assert(dense.events.length>late.events.length,'late pickup stays short');
 baseIntervals.push(...intervals(base));denseIntervals.push(...intervals(dense));patterns.add(dense.motifId);melodies.add(dense.notes.join(','));rhythms.add(dense.events.map(e=>e.onset.toFixed(3)).join(','));longCount+=dense.events.length;
}
assert(median(denseIntervals)<=median(baseIntervals)*.55,'median spacing is approximately halved');
assert(patterns.size>=4&&melodies.size>=16&&rhythms.size>=3,'varied call/response contours, melodies and rhythms');
assert.equal(gardenModePhraseDense(notes,{remaining:.64}),null);
assert.equal(gardenModePhraseDense([60,60],{}),null);
assert.equal(gardenModePhraseDense([60,NaN],{}),null);
const majorB6=[60,62,64,67,68,72],wide=gardenModePhraseDense(majorB6,{modeId:'major-b6-pentatonic',chord:{quality:'7',notes:[48,64,67,70]},variation:87,remaining:3.8,barSeconds:4/1.0379});
assert(wide.events.every((event,i)=>!i||Math.abs(event.midi-wide.events[i-1].midi)<=12),'fast call avoids the inherited near-two-octave register drop');
// A minor third must remain audible when the player chose minor over major;
// the new playback setting never silently corrects an incompatible selection.
assert(gardenModePhraseDense(notes,{...options,chord:{quality:'maj7'},variation:0}).notes.some(n=>pc(n)===3));
console.log(`Dense phrase PASS: ${checked} mode/root/window/tempo cases; median attack ${median(baseIntervals).toFixed(3)}→${median(denseIntervals).toFixed(3)}s; ${(longCount/48).toFixed(1)} notes/early Dorian audition, literal colour/targets, motif response and short late endings.`);
