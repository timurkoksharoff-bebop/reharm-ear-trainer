import assert from 'node:assert/strict';
import {gardenModePhrase} from '../garden-mode-phrases.mjs';
import {GARDEN_MODES} from '../garden-modes.mjs';

const pc=n=>((n%12)+12)%12;
const windows=[.65,.8,1.2,1.7,2.5,3.8,6];
let checked=0;
for(const mode of GARDEN_MODES)for(let root=60;root<72;root++)for(const remaining of windows)for(const barSeconds of [2,4,6]){
 const notes=[...mode.notes,12].map(n=>root+n),chord={quality:'maj7',notes:[root-12,root+4,root+7,root+11]};
 const options={modeId:mode.id,chord,tonic:pc(root),barSeconds,remaining,variation:checked%48};
 const before=JSON.stringify({notes,options}),phrase=gardenModePhrase(notes,options);
 assert(phrase,mode.id+' '+remaining);
 assert.equal(JSON.stringify({notes,options}),before,'planner must not mutate inputs');
 assert.deepEqual(phrase,gardenModePhrase(notes,options),'same inputs produce the same construction');
 assert(phrase.events.length>=2&&phrase.events.length<=8);
 assert.deepEqual(phrase.notes,phrase.events.map(event=>event.midi));
 assert(phrase.notes.every(n=>mode.notes.includes(pc(n-root))),mode.id+' adds no unselected pitches');
 assert(phrase.duration<=3.2+1e-9&&phrase.duration<=remaining-.12+1e-9,'phrase ends before the chord boundary');
 assert.equal(phrase.events.at(-1).role,'target');
 assert([0,4,7,11].includes(pc(phrase.events.at(-1).midi-root)),'arrival belongs to the actual chord/selected-mode intersection');
 assert.equal(phrase.targetQualified,true);
 assert(phrase.events.some(event=>phrase.characteristic.some(n=>pc(n-root)===pc(event.midi-root))),'the phrase presents a modal colour');
 for(let i=0;i<phrase.events.length;i++){
  const event=phrase.events[i];
  assert(Number.isFinite(event.midi)&&event.onset>=0&&event.duration>=.06);
  assert(event.velocity>=.4&&event.velocity<=.92);
  assert(event.onset+event.duration<=remaining-.12+1e-9);
  if(i)assert(event.onset-phrase.events[i-1].onset>=.14-1e-9,'even a tuplet retains a playable inter-note interval');
 }
 checked++;
}

for(const id of ['ionian','dorian','lydian','mixolydian','minor-pentatonic','minor-blues','diminished-hw']){
 const mode=GARDEN_MODES.find(m=>m.id===id),notes=[...mode.notes,12].map(n=>60+n),patterns=new Set(),melodies=new Set(),rhythms=new Set();
 for(let variation=0;variation<36;variation++){
  const phrase=gardenModePhrase(notes,{modeId:id,chord:{quality:'7'},remaining:4,variation});
  patterns.add(phrase.pattern);melodies.add(phrase.notes.join(','));rhythms.add(phrase.events.map(e=>e.onset).join(','));
  assert(phrase.events.some((event,i)=>i&&event.onset>phrase.events[i-1].onset+phrase.events[i-1].duration+.035),'long phrases contain actual breathing space');
 }
 assert(patterns.size>=4,id+' chooses several construction families');
 assert(melodies.size>=8,id+' varies melodic sentences');
 assert(rhythms.size>=3,id+' varies rhythm, not only scale direction');
 if(id.includes('pentatonic'))assert(patterns.has('pentatonic-call'));
 if(id.includes('blues'))assert(patterns.has('blues-turn'));
}

const lydian=[60,62,64,66,67,69,71,72],dorian=[60,62,63,65,67,69,70,72];
let dorianSix=0,guideArrivals=0;
for(let variation=0;variation<64;variation++){
 const lyd=gardenModePhrase(lydian,{modeId:'lydian',chord:{quality:'maj7'},remaining:4,variation});
 assert(lyd.notes.some(n=>pc(n-60)===6),'Lydian colour stays audible');
 const dor=gardenModePhrase(dorian,{modeId:'dorian',chord:{quality:'m7'},remaining:4,variation});
 if(dor.notes.some(n=>pc(n-60)===9))dorianSix++;
 if([3,10].includes(pc(dor.notes.at(-1)-60)))guideArrivals++;
}
assert(dorianSix>=32,'Dorian6 is presented regularly rather than hidden in generic minor figures');
assert(guideArrivals>=48,'guide-tone arrivals predominate');

const first=gardenModePhrase(lydian,{modeId:'lydian',chord:{quality:'maj7'},remaining:4,variation:0});
const answer=gardenModePhrase(lydian,{modeId:'lydian',chord:{quality:'maj7'},remaining:4,variation:0,previous:first});
assert.notDeepEqual(answer.events,first.events,'previous phrase invites an answer rather than exact repetition');
assert.notEqual(answer.pattern,first.pattern);
const veryShort=gardenModePhrase(lydian,{modeId:'lydian',remaining:.65}),long=gardenModePhrase(lydian,{modeId:'lydian',remaining:4});
assert.equal(veryShort.notes.length,2);assert(long.notes.length>veryShort.notes.length);
assert(veryShort.events[1].onset>=.15,'short windows reduce material without becoming a note burst');

// An incompatible selection must remain that exact pitch collection. The
// audition does not silently switch a Phrygian choice to C major to sound nice.
const phrygian=[60,61,63,65,67,68,70,72];
for(let variation=0;variation<16;variation++){
 const phrase=gardenModePhrase(phrygian,{modeId:'phrygian',chord:{quality:'maj7',notes:[48,64,67,71]},remaining:3,variation});
 assert(!phrase.notes.some(n=>[4,11].includes(pc(n-60))));
 assert([0,7].includes(pc(phrase.notes.at(-1)-60)));
}
const precise=gardenModePhrase(lydian,{modeId:'lydian',chord:{quality:'maj7',notes:[55,59]},remaining:3,variation:2});
assert([7,11].includes(pc(precise.target-60)),'actual omitted-root voicing controls the available anchors');
const disjoint=gardenModePhrase([60,62],{chord:{notes:[61,63]},remaining:2});
assert.equal(disjoint.targetQualified,false);assert(disjoint.notes.every(n=>[0,2].includes(pc(n-60))));
assert.equal(gardenModePhrase(lydian,{remaining:.5}),null);
assert.equal(gardenModePhrase([60,72],{remaining:2}),null);
assert.equal(gardenModePhrase([60,NaN,64],{remaining:2}),null);
assert.equal(gardenModePhrase(lydian,{remaining:Infinity}),null);

// Selection proportions are an authored series, not a probabilistic claim.
// Each consecutive eight-slot window, including negative variations, requests
// exactly four phrases, two combined gestures and two broken arpeggios.
const requestedStyles=variation=>{
 const slot=((variation%8)+8)%8;
 return slot%2===0?'phrase':slot===1||slot===5?'arpeggio':'combined';
};
for(let beginning=-32;beginning<=32;beginning++){
 const requested={phrase:0,combined:0,arpeggio:0},actual={phrase:0,combined:0,arpeggio:0},orders=new Set();
 for(let variation=beginning;variation<beginning+8;variation++){
  const phrase=gardenModePhrase(lydian,{modeId:'lydian',chord:{quality:'maj7'},remaining:6,variation});
  assert.equal(phrase.requestedStyle,requestedStyles(variation));
  requested[phrase.requestedStyle]++;actual[phrase.style]++;
  assert.equal(phrase.fallbackReason,null,'both constructions fit this long4-second-bar window');
  assert.equal(phrase.entryOffsetBeats,phrase.events[0].onset/phrase.beatSeconds);
  assert.equal(phrase.endOffsetBeats,phrase.duration/phrase.beatSeconds);
  assert.deepEqual(phrase.end,{midi:phrase.events.at(-1).midi,attackBeats:phrase.events.at(-1).onset/phrase.beatSeconds,releaseBeats:phrase.duration/phrase.beatSeconds});
  if(phrase.style==='combined'){
   orders.add(phrase.order);assert.equal(phrase.segments.length,2);
   assert.deepEqual(phrase.segments.map(segment=>segment.kind),phrase.order.split('-'));
   assert(phrase.segments[1].start-phrase.segments[0].end>=.10-1e-9,'combined gestures have an actual breath between them');
   assert(phrase.events.some(event=>event.segment==='phrase'));
   assert(phrase.events.some(event=>event.segment==='arpeggio'));
   for(const segment of phrase.segments){
    const own=phrase.events.filter(event=>event.segment===segment.kind);
    assert(own.length>=3,'each combined part is recognisable, not a single tagged note');
    assert(own.every(event=>event.onset>=segment.start-1e-9&&event.onset+event.duration<=segment.end+1e-9));
   }
  }else assert.equal(phrase.segments.length,1);
 }
 assert.deepEqual(requested,{phrase:4,combined:2,arpeggio:2});
 assert.deepEqual(actual,requested,'50/25/25 is actually played when the window permits it');
 assert.deepEqual(orders,new Set(['phrase-arpeggio','arpeggio-phrase']));
}

for(const variation of [-13,-9,-5,-1,3,7,11,15])for(const remaining of [.65,.8,1.2,1.7]){
 const phrase=gardenModePhrase(lydian,{modeId:'lydian',chord:{quality:'maj7'},remaining,variation});
 assert.equal(phrase.requestedStyle,'combined');assert.notEqual(phrase.style,'combined');
 assert.equal(phrase.fallbackReason,'short-window');
 assert(phrase.notes.length<=3,'a short combined request becomes one compact gesture');
 assert(phrase.events.every((event,index)=>!index||event.onset-phrase.events[index-1].onset>=.14-1e-9));
}

const tuplets=new Set(),arpPatterns=new Set();let offbeatEntries=0,offbeatArrivals=0;
for(let variation=0;variation<144;variation++){
 const phrase=gardenModePhrase(dorian,{modeId:'dorian',chord:{quality:'m7'},remaining:6,variation});
 const beat=phrase.beatSeconds,offbeat=n=>Math.abs(n-Math.round(n))>.025;
 if(offbeat(phrase.entryOffsetBeats))offbeatEntries++;
 if(offbeat(phrase.end.attackBeats))offbeatArrivals++;
 if(phrase.style==='arpeggio')arpPatterns.add(phrase.pattern);
 if(['triplet-cell','quintuplet-cell'].includes(phrase.rhythm)){
  const divisor=phrase.rhythm==='triplet-cell'?3:5;
  assert(phrase.events.some((event,index)=>index&&Math.abs((event.onset-phrase.events[index-1].onset)-beat/divisor)<1e-8),'tuplet metadata corresponds to real rhythmic spacing');
  tuplets.add(phrase.rhythm);
 }
}
assert(arpPatterns.size>=6,'the arpeggio quarter retains multiple broken contours');
assert.deepEqual(tuplets,new Set(['triplet-cell','quintuplet-cell']));
assert(offbeatEntries>=90&&offbeatEntries<144,'weak entries are common while straight entries remain possible');
assert(offbeatArrivals>=60,'arrivals are not all pinned to the strong beat');

const prior=Object.freeze({...first,notes:Object.freeze([...first.notes]),events:Object.freeze(first.events.map(event=>Object.freeze({...event})))});
const priorJSON=JSON.stringify(prior),input=Object.freeze([...dorian]),settings=Object.freeze({modeId:'dorian',chord:Object.freeze({quality:'m7',notes:Object.freeze([48,63,67,70])}),remaining:3.8,variation:-17,previous:prior});
assert.deepEqual(gardenModePhrase(input,settings),gardenModePhrase(input,settings));
assert.equal(JSON.stringify(prior),priorJSON,'history metadata is read without mutation');
console.log(`Mode phrases PASS: ${checked} mode/root/time/tempo cases; literal pitch collections and targets; deterministic50/25/25 requests and playable long-window mix; both combined orders, short fallbacks, varied broken arpeggios, weak entries/arrivals, real triplets/quintuplets and safe note spacing.`);
