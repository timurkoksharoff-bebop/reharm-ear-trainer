import assert from 'node:assert/strict';
import {GardenPad,createGardenMission,gardenDegreeLabel,gardenChordLabel,gardenAnswerState} from '../garden-harmony.mjs';
import {INTERVALS} from '../music.mjs';
import {BOOK_CATALOG} from '../book-catalog.mjs';
import {createGardenLife} from '../garden-life.mjs';

const savedFetch=globalThis.fetch;
globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(0)});
const pad=new GardenPad();globalThis.fetch=savedFetch;pad.unlock=async()=>{};
let starts=[];
const parameter=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}});
pad.cleanOutput={};pad.sampleBuffers=[48,52,55].map(midi=>({midi,buffer:{midi}}));
pad.context={currentTime:10,createGain:()=>({gain:parameter(),connect(){},disconnect(){}}),
  createBufferSource:()=>{const voice={playbackRate:parameter(),connect(){},stop(){},start(at){starts.push({track:'chord',midi:Math.round(voice.buffer.midi+12*Math.log2(voice.playbackRate.value)),at});}};return voice;},
  createOscillator:()=>{const voice={frequency:parameter(),connect(){},stop(){},start(at){starts.push({track:'layer',at});}};return voice;}};
async function played(chord,tonic=0,options={}){pad.stop(true);starts=[];await pad.play(chord,tonic,options);return [...starts];}
for(const [quality,intervals] of Object.entries(INTERVALS))for(let tonic=0;tonic<12;tonic++){
  const actual=await played({offset:0,quality},tonic);
  assert.deepEqual(actual.map(note=>note.midi),[36+tonic,...intervals.map(i=>48+tonic+i)],`${quality}, tonic ${tonic}: no invented or missing members`);
}
let count=0;
for(const exercise of BOOK_CATALOG){
  const mission=createGardenMission({exercise}),choices=mission.snapshot().choices;
  for(const chord of exercise.sequence){
    assert(choices.some(option=>option.offset===chord.offset&&option.quality===chord.quality),'every target has an answer');
    const actual=await played(chord,exercise.baseTonic);
    const root=48+exercise.baseTonic+chord.offset,bass=36+exercise.baseTonic+(chord.bassOffset??chord.offset);
    assert.deepEqual(actual.map(note=>note.midi),chord.notes?.length?chord.notes:[bass,...INTERVALS[chord.quality].map(i=>root+i)],`${exercise.id}: ${chord.degree}`);count++;
  }
}
await assert.rejects(()=>played({offset:0,quality:'not-a-chord'}),/Неизвестный тип/,'unknown qualities cannot silently become major');
const fig34=BOOK_CATALOG.find(e=>e.id==='fig-3-4');
// Visually verified against the original, printed p.30, Fig.3.4. Not an
// assertion that every book figure has received a fresh visual source audit.
assert.deepEqual(fig34.sequence.map(c=>[(fig34.baseTonic+c.offset)%12,c.quality]),[[0,'7'],[5,'7sus4'],[10,'7'],[9,'7sus4'],[8,'7'],[7,'7'],[0,'7'],[11,'7'],[10,'7'],[3,'maj7']]);
assert.deepEqual((await played(fig34.sequence[1],3)).map(n=>n.midi),[41,53,58,60,63],'F7sus4: F bass plus F Bb C Eb, not Fm7');
assert.equal(gardenDegreeLabel(3),'♭III');assert.equal(gardenChordLabel({offset:3,quality:'7',degree:'#II7'}),'♭III7');
for(const running of [true,false])for(const complete of [true,false]){
  const model={running,complete,cursor:1,current:{offset:3,quality:'m7'},currentParts:{degree:true,quality:true}};
  assert.equal(gardenAnswerState(model,'degree',3).selected,true,'found degree remains highlighted on pause and solved positions');
  assert.equal(gardenAnswerState(model,'quality','m7').selected,true,'found quality remains highlighted');
  assert.equal(gardenAnswerState(model,'degree',2).selected,false);
}
for(const duration of [2,4,6])for(const arpeggio of ['arpWave','arpBroken','arpSpark','arpMist'])for(const bass of ['bassCanon','bassChill','bassFunk']){
  const voices=await played({offset:0,quality:'m7'},0,{barSeconds:duration,arrangement:{arpeggio,bass}});
  assert(voices.filter(v=>v.track==='chord').every(v=>v.at===10),'the chord is one parallel attack');
  assert(pad.lastArrangement.every(event=>event.at>=0&&event.at<duration),'every event stays inside the same bar');
  for(const track of ['arpeggio','bass'])assert.equal(pad.lastArrangement.filter(e=>e.track===track)[0]?.at,0,'each accompaniment begins on the same downbeat');
}
const view={width:400,height:800,x:200,y:400,ship:1,speed:1,active:true,flying:true};
for(const paused of [{paused:true},{active:false},{flying:false}]){
  const life=createGardenLife({random:()=>.5});life.forceSpawn('arpeggio',{x:.5,y:.5});const before=life.snapshot();
  life.update(1,{...view,...paused});const after=life.snapshot();
  assert.deepEqual(after.inventory,before.inventory,'no pause farming');assert.deepEqual(after.resources,before.resources,'no survival drain while stopped');
  assert.equal(life.time,0);assert.equal(life.entities[0].collected,false);
}
pad.stop(true);
console.log(`Garden audit passed: 22 qualities × 12 keys, ${count} catalog chords, Fig.3.4 source, consistent labels, persistent highlights, layer downbeats, pause guards.`);
