import assert from 'node:assert/strict';
import {gardenModePhraseImproved} from '../garden-mode-phrases-improved.mjs';
import {gardenModeArpeggio} from '../garden-mode-arpeggio.mjs';
import {gardenModePhraseZero} from '../garden-mode-phrases-zero.mjs';
import {GARDEN_MODES} from '../garden-modes.mjs';

const pc=n=>((n%12)+12)%12;
const pure={arpeggioPercent:0,combinedPercent:0};
let checked=0;
for(const mode of GARDEN_MODES)for(let root=60;root<72;root++)for(const remaining of [.65,.8,1.2,1.7,2.5,3.8,6])for(const barSeconds of [2,4,6]){
 const notes=[...mode.notes,12].map(n=>root+n),chord={quality:'maj7',notes:[root-12,root+4,root+7,root+11]};
 const options={modeId:mode.id,chord,remaining,barSeconds,variation:checked%48,rhythm:['lively','steady','free'][checked%3]};
 const before=JSON.stringify({notes,options}),plan=gardenModePhraseImproved(notes,options);
 assert(plan,mode.id+' '+remaining+' '+barSeconds);
 assert.equal(JSON.stringify({notes,options}),before,'inputs are not mutated');
 assert.deepEqual(plan,gardenModePhraseImproved(notes,options),'same context produces the same authored construction');
 assert.deepEqual(plan.notes,plan.events.map(event=>event.midi));
 assert(plan.notes.length>=3&&plan.notes.length<=(plan.style==='arpeggio'?18:12));
 assert(plan.duration<=Math.min(4.8,remaining-.12)+1e-9);
 for(let index=0;index<plan.events.length;index++){
  const event=plan.events[index];
  assert(mode.notes.includes(pc(event.midi-root)),mode.id+' cannot add an unselected pitch');
  assert(event.midi>=root-7&&event.midi<=root+19);
  assert(event.duration>=.045&&event.onset>=0&&event.onset+event.duration<=remaining-.12+1e-9);
  assert(event.velocity>=.4&&event.velocity<=.92);
  if(index)assert(event.onset-plan.events[index-1].onset>=.09-1e-9,'no emergency note burst');
 }
 if(plan.style!=='arpeggio'){
  assert.equal(plan.events.at(-1).role,'target');
  assert.equal(plan.target,plan.notes.at(-1));
  assert([0,4,7,11].includes(pc(plan.target-root)),'the end belongs to the actual chord/scale intersection');
  assert.equal(plan.targetQualified,true);
  assert(plan.notes.some(midi=>pc(midi)===plan.colourPc),'the chosen characteristic colour is audible');
  assert(plan.notes.slice(1).every((midi,index)=>Math.abs(midi-plan.notes[index])<=10),'no accidental octave cliff inside the sentence');
  assert(new Set(plan.events.map(event=>event.velocity)).size>=2,'roles have real articulation');
  assert(plan.segments.every(segment=>plan.events.filter(event=>event.segment===segment.kind).some(event=>event.onset>=segment.start&&event.onset+event.duration<=segment.end+1e-9)));
 }else assert(plan.events.every(event=>event.role==='arpeggio'&&event.segment==='arpeggio'));
 checked++;
}

const dorian=[60,62,63,65,67,69,70,72],lydian=[60,62,64,66,67,69,71,72];
const options={modeId:'dorian',chord:{quality:'m7',notes:[48,63,67,70]},barSeconds:4,remaining:3.8,mix:pure};
const melodies=new Set(),patterns=new Set(),rhythms=new Set();let naturalSix=0,weakEntries=0;
const allIntervals=[],oldIntervals=[];
for(let variation=0;variation<56;variation++){
 const plan=gardenModePhraseImproved(dorian,{...options,variation}),late=gardenModePhraseImproved(dorian,{...options,remaining:.7,variation});
 assert(plan.notes.length>=9&&plan.notes.length<=12,'an early choice gives a developed line');
 assert(late.notes.length>=3&&late.notes.length<=4,'late choice gets its own short complete ending');
 assert(plan.notes.length>late.notes.length);
 assert([3,10].includes(pc(plan.target-60)),'Dorian over Cm7 lands on a guide tone');
 if(plan.notes.includes(69)||plan.notes.includes(57))naturalSix++;
 if(plan.entryOffsetBeats>0&&plan.entryOffsetBeats<1)weakEntries++;
 melodies.add(plan.notes.join(','));patterns.add(plan.pattern);rhythms.add(plan.events.map(event=>event.onset).join(','));
 // The opening four-note motif is developed at a new scale level. Its
 // interval contour survives; a new random cell is not pasted after it.
 if(plan.notes.length===12){
  const lattice=[];for(let octave=-2;octave<=3;octave++)for(const interval of [0,2,3,5,7,9,10])lattice.push(60+interval+12*octave);
  const indices=plan.notes.map(midi=>lattice.indexOf(midi));
  const first=indices.slice(0,4).slice(1).map((value,index)=>value-indices[index]);
  const second=indices.slice(4,8).slice(1).map((value,index)=>value-indices[index+4]);
  assert.deepEqual(second,first,'recognisable four-note contour develops by a scale-level shift');
  assert.notEqual(indices[0],indices[4],'development moves instead of repeating one pip');
 }
 for(let index=1;index<plan.events.length;index++)allIntervals.push(plan.events[index].onset-plan.events[index-1].onset);
 const old=gardenModePhraseZero(dorian,{...options,variation});
 for(let index=1;index<old.events.length;index++)oldIntervals.push(old.events[index].onset-old.events[index-1].onset);
}
assert(naturalSix>=42,'Dorian natural6 regularly survives the melodic line');
assert(weakEntries>=42,'most openings avoid a uniform immediate downbeat');
assert(melodies.size>=10&&patterns.size>=5&&rhythms.size>=3,'melody, contour and rhythm all vary');
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
assert(median(allIntervals)<=median(oldIntervals)*.55,'main phrase pulse is near double-time rather than the old sparse spacing');

for(let variation=0;variation<32;variation++){
 const lyd=gardenModePhraseImproved(lydian,{...options,modeId:'lydian',chord:{quality:'maj7'},variation});
 assert(lyd.notes.some(midi=>pc(midi)===6),'Lydian#4 is not lost in a generic major sentence');
 const phrygian=gardenModePhraseImproved([60,61,63,65,67,68,70,72],{...options,modeId:'phrygian',chord:{quality:'maj7',notes:[48,64,67,71]},variation});
 assert(phrygian.notes.every(midi=>![4,11].includes(pc(midi))),'wrong-mode audition is never silently corrected');
 assert([0,7].includes(pc(phrygian.target)));
 const precise=gardenModePhraseImproved(lydian,{...options,modeId:'lydian',chord:{quality:'maj7',notes:[55,59]},variation});
 assert([7,11].includes(pc(precise.target)),'actual omitted-root voicing controls the target');
}

for(const [arpeggioPercent,combinedPercent]of [[0,0],[100,0],[0,100],[75,0],[75,25],[35,15],[25,25]]){
 const requested={phrase:0,arpeggio:0,combined:0},total=arpeggioPercent===25&&combinedPercent===25?104:100;
 for(let variation=0;variation<total;variation++){
  const plan=gardenModePhraseImproved(dorian,{...options,remaining:6,variation,mix:{arpeggioPercent,combinedPercent}});
  requested[plan.requestedStyle]++;
  if(plan.requestedStyle==='arpeggio'){
   const original=gardenModeArpeggio(dorian,{...options,remaining:6,variation:Math.floor(variation/4)});
   assert.deepEqual(plan.notes,original.notes);assert.deepEqual(plan.events,original.events);
   assert(plan.events.every(event=>event.segment==='arpeggio'),'pure requests do not hide melodic cells');
  }else if(plan.requestedStyle==='combined'){
   assert.equal(plan.style,'combined');assert.equal(plan.segments.length,2);
   assert(plan.segments.every(segment=>plan.events.filter(event=>event.segment===segment.kind).length>=4));
   assert(['scalar-approach','broken-thirds'].includes(plan.fragmentType));
   const boundary=plan.events.findIndex((event,index)=>index&&event.segment!==plan.events[index-1].segment);
   assert(boundary>0);assert(plan.events[boundary].onset-plan.events[boundary-1].onset<=plan.step*1.5+1e-9,'joined line does not restart after a mechanical gap');
  }
 }
 assert.equal(requested.arpeggio,total*arpeggioPercent/100);assert.equal(requested.combined,total*combinedPercent/100);
 assert.equal(requested.phrase,total*(100-arpeggioPercent-combinedPercent)/100);
}
for(let start=-16;start<16;start++){
 const counts={phrase:0,arpeggio:0,combined:0};
 for(let variation=start;variation<start+8;variation++)counts[gardenModePhraseImproved(dorian,{...options,variation,mix:null}).requestedStyle]++;
 assert.deepEqual(counts,{phrase:4,arpeggio:2,combined:2});
}
for(let variation=0;variation<24;variation++){
 const plan=gardenModePhraseImproved(dorian,{...options,remaining:.7,variation,mix:{arpeggioPercent:0,combinedPercent:100}});
 assert.equal(plan.requestedStyle,'combined');assert.equal(plan.style,'phrase');assert.equal(plan.fallbackReason,'short-window');
 assert(plan.events.length<=4&&plan.events.at(-1).role==='target');
}
const rhythmKinds=new Set();for(let variation=0;variation<36;variation++){
 const steady=gardenModePhraseImproved(dorian,{...options,variation,rhythm:'steady'});assert.equal(steady.rhythm,'flow');
 const free=gardenModePhraseImproved(dorian,{...options,remaining:5,variation,rhythm:'free'});rhythmKinds.add(free.rhythm);
 if(free.rhythm==='triplet-turn')assert(free.events.some((event,index)=>index&&Math.abs(event.onset-free.events[index-1].onset-free.step*2/3)<1e-8));
 if(free.rhythm==='quintuplet-run')assert(free.events.some((event,index)=>index&&Math.abs(event.onset-free.events[index-1].onset-free.step*.8)<1e-8));
}
assert(rhythmKinds.has('triplet-turn')&&rhythmKinds.has('quintuplet-run'));
const previous=Object.freeze({notes:Object.freeze([69,70,72]),pattern:'improved-sequence-lift'}),before=JSON.stringify(previous);
const withHistory=gardenModePhraseImproved(dorian,{...options,variation:0,previous}),withoutHistory=gardenModePhraseImproved(dorian,{...options,variation:0});
assert.notDeepEqual(withHistory.notes,withoutHistory.notes,'previous register influences the next line');
assert.equal(JSON.stringify(previous),before);
for(const [notes,patch]of [[[60,NaN],{}],[[60,60],{}],[dorian,{remaining:.64}],[dorian,{remaining:Infinity}]])assert.equal(gardenModePhraseImproved(notes,patch),null);
console.log(`Improved phrases PASS: ${checked} mode/root/window/tempo cases; original motif development, literal mode colours, actual guide arrivals, bounded register/rhythm, separate pure runs, exact mix quotas and joined scale/phrase alternatives. Median pulse ${median(oldIntervals).toFixed(3)}→${median(allIntervals).toFixed(3)}s. Listening quality still requires user review.`);
