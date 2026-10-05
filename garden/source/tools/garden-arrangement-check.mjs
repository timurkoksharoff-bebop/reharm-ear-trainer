import assert from 'node:assert/strict';
import {GARDEN_ARRANGEMENTS,createGardenArrangement,gardenArrangementEvents,drawGardenArrangementFlower} from '../garden-arrangement.mjs';
import {createGardenMission,GardenPad} from '../garden-harmony.mjs';
import {createGardenLife} from '../garden-life.mjs';

const exercise={id:'arrangement-test',baseTonic:0,sequence:[{degree:'I6',offset:0,quality:'6'},{degree:'V/III',offset:7,quality:'7',bassOffset:4}],source:'test only'};
const heard=[],mission=createGardenMission({exercise,barSeconds:999,onChord:(chord,model)=>heard.push({chord,model})});
mission.start();mission.advance();const count=heard.length;
assert(mission.arrange('arpBroken',2));assert(mission.arrange('bassChill',1));
assert.equal(heard.length,count,'catching flowers never replays the current chord');
assert.deepEqual(mission.snapshot().arrangement,{},'the pickup waits for the next chord boundary');
mission.advance();assert.deepEqual(heard.at(-1).model.arrangement,{arpeggio:'arpBroken',bass:'bassChill'});
const remaining=mission.snapshot().arrangementStatus.arpeggio.remaining;
mission.answerPart('degree',7);assert.equal(heard.length,count+1,'answering never replays or spends an arrangement step');
mission.hold();mission.replayCurrent();assert.equal(mission.snapshot().arrangementStatus.arpeggio.remaining,remaining,'held replays do not spend rounds');
mission.pause();mission.start();assert.equal(mission.snapshot().arrangementStatus.arpeggio.remaining,remaining,'pause/resume does not spend rounds');
mission.advance();mission.advance();assert(!mission.snapshot().arrangement.bass,'one round expires after exactly sequence.length new chords');
mission.advance();mission.advance();assert.deepEqual(mission.snapshot().arrangement,{},'ordinary sound returns automatically');
mission.arrange('bassFunk',1);mission.boostArrangement();assert.equal(mission.snapshot().arrangementStatus.bass.remaining,4,'seed adds one complete round');
mission.arrange('bassFunk',3);assert.equal(mission.snapshot().arrangementStatus.bass.remaining,6,'stock is capped at three rounds');
mission.arrange('bassCanon',1);assert.equal(mission.snapshot().arrangementStatus.bass.remaining,2,'different bass replaces rather than stacks');
mission.clearArrangement('bass');assert.deepEqual(mission.snapshot().arrangementStatus,{});
mission.arrange('arpWave',1);mission.restart();assert.deepEqual(mission.snapshot().arrangementStatus,{});mission.pause();

for(const [style,spec] of Object.entries(GARDEN_ARRANGEMENTS)){
  const notes=[40,55,59,62,65],events=gardenArrangementEvents(notes,{[spec.track]:style},4);
  assert.equal(events.length,spec.steps??(style==='bassCanon'?2:style==='bassChill'?3:5));
  assert(events.every(event=>event.at>=0&&event.at+event.duration<4&&event.level<=.17));
  assert(events.every(event=>notes.some(note=>(note-event.midi)%12===0)),'all notes belong to the existing voicing, no new chord tones');
  if(spec.track==='bass')assert.equal(events[0].midi,40,'the printed separate bass, not chord root, starts the bass line');
}
const line=gardenArrangementEvents([36,48,52,55],{bass:'bassFunk'},4);assert(line.some(event=>event.midi===43),'a fifth is allowed only when present in the supplied chord');
const control=createGardenArrangement(4);assert.equal(control.boost(),false);assert.equal(control.activate('unknown'),false);
const collected=[],life=createGardenLife({random:()=>.5,onArrangement:(...args)=>collected.push(args)});
const flower=life.forceSpawn('arpSpark',{rounds:3,x:.5,y:.5});life.collect(flower);life.collect(flower);
assert.deepEqual(collected,[['arpSpark',3]],'pickup activates exactly once with its visible duration');assert.equal(life.resources.arrangement,undefined);
const seed=life.forceSpawn('arrangementBoost');life.collect(seed);assert.equal(life.inventory.arrangementBoost,1);assert(life.consumeArtifact('arrangementBoost'));assert(!life.consumeArtifact('arrangementBoost'));

const oldFetch=globalThis.fetch;globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(0)});const pad=new GardenPad();globalThis.fetch=oldFetch;
const starts=[],stops=[],parameter=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}});
pad.unlock=async()=>{};pad.context={currentTime:10,createGain:()=>({gain:parameter(),connect(){},disconnect(){}}),createBufferSource:()=>({playbackRate:parameter(),connect(){},start(at){starts.push(['sample',at]);},stop(){stops.push('sample');}}),createOscillator:()=>({frequency:parameter(),connect(){},disconnect(){},start(at){starts.push(['layer',at]);},stop(at){stops.push(at);}})};pad.cleanOutput={};pad.sampleBuffers=[{midi:48,buffer:{}}];
await pad.play({offset:0,quality:'6'},0,{arrangement:{arpeggio:'arpSpark',bass:'bassFunk'},barSeconds:4});
assert.equal(pad.lastArrangement.length,21);assert.equal(pad.voices.length,2,'layers and foundation are both cancellable voice groups');assert.equal(starts.filter(([kind])=>kind==='layer').length,21);
const beforeStop=stops.length;pad.stop(true);assert(stops.length>=beforeStop+21,'stop cancels all future scheduled layer attacks');
await pad.play({offset:0,quality:'6',reference:true},0,{arrangement:{arpeggio:'arpSpark',bass:'bassFunk'}});assert.equal(pad.lastArrangement.length,0,'reference stays a plain chord');pad.stop(true);
const ctx=new Proxy({},{get:(target,key)=>target[key]??(()=>{})});for(const spec of Object.values(GARDEN_ARRANGEMENTS))drawGardenArrangementFlower(ctx,spec,72,3);
console.log('Garden arrangements passed: 7 styles, exact 1–3 rounds, chord/slash-bass pitches, combination/boost/expiry, no replay, duplicate catch, cancellation and reference.');
