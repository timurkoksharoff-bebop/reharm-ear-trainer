import assert from 'node:assert/strict';
import {GardenPad,createGardenMission} from '../garden-harmony.mjs';
import {GARDEN_GRAND_PIANO_BANK} from '../garden-grand-piano.mjs';
import {BOOK_CATALOG} from '../book-catalog.mjs';
import {INTERVALS} from '../music.mjs';
import {BUILTIN_TOUR_ROUTES} from '../garden-tour-routes.mjs';

const legacy={felt:[['felt-c3.wav',48],['felt-e3.wav',52],['felt-g3.wav',55]],hybrid:[['hybrid-c4.wav',60],['hybrid-d4.wav',62]],hybridOrchestra:[['hybrid-orchestra-c4.wav',60]],stringOrchestra:[['string-orchestra-c5.wav',72]],pianoN:[['piano-n-c5.wav',72]]};
const pad=new GardenPad();for(const [name,sources]of Object.entries(legacy))assert.deepEqual(pad.sampleSources[name],sources,'legacy source definitions stay exact');
pad.applyPreset('grand');assert.equal(pad.preset,'grand','Grand is an actual main preset');
const metadata=GARDEN_GRAND_PIANO_BANK.samples;
assert.deepEqual(metadata.map(sample=>sample.midi),[21,24,30,36,42,48,54,60,66,72,78,84,90,96,102,105,108]);
assert.equal(pad.sampleSources.grand.length,metadata.length);
for(let i=0;i<metadata.length;i++)assert.deepEqual(pad.sampleSources.grand[i].slice(0,2),[metadata[i].file,metadata[i].midi]);
const params=()=>({value:1,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}});
const bank=metadata.map(sample=>({midi:sample.midi,tune:Number(sample.tune||0),regionGain:10**(Number(sample.gainDb||0)/20),levelGain:1,buffer:{id:sample.file,midi:sample.midi}}));
let starts=[],layerStarts=[];
pad.unlock=async()=>{};pad.cleanOutput={};pad.loadSampleBank=async()=>bank;
pad.context={currentTime:10,createGain:()=>({gain:params(),connect(){},disconnect(){}}),createBufferSource(){const source={playbackRate:params(),connect(){},disconnect(){},stop(){},start(at,offset){const sample=bank.find(item=>item.buffer===source.buffer);starts.push({midi:sample.midi+12*Math.log2(source.playbackRate.value)-sample.tune/100,root:sample.midi,at,offset});}};return source;},createOscillator(){const source={frequency:params(),connect(){},disconnect(){},stop(){},start(at){layerStarts.push({at,midi:69+12*Math.log2(source.frequency.value/440)});}};return source;}};
const play=async(chord,tonic=0,options={})=>{pad.stop(true);starts=[];layerStarts=[];await pad.play(chord,tonic,options);return [...starts];};
let checked=0;
for(const [quality,intervals]of Object.entries(INTERVALS))for(let tonic=0;tonic<12;tonic++){
 const expected=[36+tonic,...intervals.map(interval=>48+tonic+interval)],heard=await play({offset:0,quality},tonic);
 assert.equal(heard.length,expected.length);heard.forEach((voice,index)=>assert(Math.abs(voice.midi-expected[index])<1e-8,'exact chord MIDI'));
}
for(const exercise of BOOK_CATALOG)for(const chord of exercise.sequence){
 const root=48+exercise.baseTonic+chord.offset,expected=chord.notes?.length?chord.notes:[36+exercise.baseTonic+(chord.bassOffset??chord.offset),...INTERVALS[chord.quality].map(interval=>root+interval)];
 const heard=await play(chord,exercise.baseTonic);heard.forEach((voice,index)=>assert(Math.abs(voice.midi-expected[index])<1e-8,exercise.id+' retains MIDI/slash voicing'));assert.equal(heard.length,expected.length);checked++;
}
const wide=[24,36,48,60,72,84,96],heard=await play({offset:0,quality:'maj',notes:wide},0,{arpeggio:true});
assert.deepEqual(heard.map(voice=>voice.root),wide,'Grand arpeggios use the nearest recording for each register');
heard.forEach((voice,index)=>{assert(Math.abs(voice.midi-wide[index])<1e-8);assert(Math.abs(voice.at-(10+index*.18))<1e-9,'existing arpeggio timing stays exact');});
for(const voicing of BUILTIN_TOUR_ROUTES.find(route=>route.id==='builtin-ambient-01').chords){
 const exact=await play({offset:0,quality:'maj7',notes:voicing});assert.equal(exact.length,voicing.length);exact.forEach((voice,index)=>assert(Math.abs(voice.midi-voicing[index])<1e-8,'stored Ambient1 MIDI register stays literal'));
}
for(let midi=24;midi<=96;midi++){const [voice]=await play({offset:0,quality:'1',notes:[midi]});assert(Math.abs(voice.midi-midi)<1e-8);assert(Math.abs(voice.root-midi)<=3,'the playable range stays within three semitones of a recorded key');}
const chord={offset:7,quality:'7',bassOffset:4,notes:[52,62,65,71]};
await play(chord,0,{arrangement:{bass:'bassCanon',arpeggio:'arpWave'},barSeconds:4});
assert.equal(pad.lastArrangement.filter(event=>event.track==='bass')[0].midi,40,'separate E2 bass remains independent from the G chord/root stack');
assert(pad.lastArrangement.filter(event=>event.track==='arpeggio').every(event=>chord.notes.includes(event.midi)));
assert(layerStarts.length>0,'existing accompaniment layer remains present');
await play({...chord,reference:true},0,{arrangement:{bass:'bassCanon',arpeggio:'arpWave'}});assert.equal(pad.lastArrangement.length,0,'tonic reference remains plain');
// All old arpeggio engines retain their single-recording anchor behaviour.
for(const [preset,sources]of Object.entries(legacy)){
 const probe=new GardenPad(),buffers=sources.map(([file,midi])=>({midi,buffer:{id:file},levelGain:1})),selected=[];probe.applyPreset(preset);probe.unlock=async()=>{};probe.cleanOutput={};probe.loadSampleBank=async()=>buffers;
 probe.context={currentTime:0,createGain:()=>({gain:params(),connect(){},disconnect(){}}),createBufferSource(){const source={playbackRate:params(),connect(){},stop(){},start(){selected.push(this.buffer.id);}};return source;}};
 await probe.play({offset:0,quality:'maj',notes:[36,60,64,79]},0,{arpeggio:true});assert.equal(new Set(selected).size,1,preset+' old source anchoring is unchanged');probe.stop(true);
}
const deferred=()=>{let resolve;const promise=new Promise(yes=>resolve=yes);return{promise,resolve};},tick=async()=>{for(let i=0;i<6;i++)await Promise.resolve();};
{
 const gate=deferred(),probe=new GardenPad();probe.applyPreset('grand');probe.unlock=async()=>{};probe.loadSampleBank=()=>gate.promise;
 const mission=createGardenMission({barSeconds:999}),pending=(async()=>{if(await probe.prepare())mission.start();})();await tick();assert.equal(mission.snapshot().running,false);assert.equal(mission.snapshot().basePlayed,false);gate.resolve(bank);await pending;assert.equal(mission.snapshot().cursor,-1);assert.equal(mission.snapshot().running,true);mission.pause();
}
{
 const gate=deferred(),probe=new GardenPad();probe.applyPreset('grand');probe.unlock=async()=>{};probe.loadSampleBank=()=>gate.promise;const pending=probe.prepare();await tick();probe.stop(true);gate.resolve(bank);assert.equal(await pending,false,'cancelled Grand warmup cannot start a stale mission');
}
pad.stop(true);console.log(`Grand Piano PASS: seventeen roots,24–96 nearest-source range,22 qualities×12 keys,${checked} exact catalog voicings/slash basses,per-note Grand arpeggios,legacy anchors,arrangements and cold/cancel guards. Level/tone quality requires real audio rendering.`);
