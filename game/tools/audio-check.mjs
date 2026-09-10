import assert from 'node:assert/strict';
import {FlightAudio} from '../audio.mjs';
import {INTERVALS,chordNotes} from '../music.mjs';
import {RHYTHMS,rhythmIds,POLYRHYTHMS,polyEvents} from '../expedition.mjs';
// Exercise the actual playback scheduler, intercepting only its output notes.
const audio=new FlightAudio();audio.context={currentTime:10};
let notes=[],scheduled=[];
audio.note=(midi,at,duration,timbre)=>notes.push({midi,at,duration,timbre});
audio.schedule=(callback,seconds)=>scheduled.push({callback,seconds});
for(const [quality,intervals] of Object.entries(INTERVALS))for(let root=48;root<60;root++){
  notes=[];scheduled=[];let ended=false;
  audio.chordOnly(root,intervals,()=>ended=true);
  assert.deepEqual(notes.map(n=>n.midi),intervals.map(n=>root+n),quality);
  assert(notes.every(n=>n.at===10.12&&n.duration===1.65&&n.timbre==='synth'));
  assert.equal(notes.length,intervals.length,'No extra tonic or missing chord member');
  scheduled[0].callback();assert(ended);
}
for(const mode of ['up','down']){
  notes=[];audio.chordOnly(48,INTERVALS.maj7,()=>{},mode);
  assert.deepEqual(notes.map(n=>n.midi),mode==='up'?[48,52,55,59]:[59,55,52,48]);
  assert(notes.every((n,i)=>!i||n.at>notes[i-1].at));
}
for(const mode of ['together','up','down']){
  notes=[];scheduled=[];const chord={offset:7,quality:'7'},target=chordNotes(chord,48);audio.trainerChord(48,chord,()=>{},mode);
  assert.deepEqual(notes.slice(0,3).map(n=>n.midi),[48,52,55],'Trainer starts with the tonic reference chord');
  assert.deepEqual(notes.slice(3).map(n=>n.midi),mode==='down'?[...target].reverse():target,'Trainer target keeps the exact game voicing');
  if(mode==='together')assert(notes.slice(3).every(n=>n.at===notes[3].at));else assert(notes.slice(4).every((n,i)=>n.at>notes[i+3].at));
}
scheduled=[];audio.chordOnly(48,INTERVALS['7'],()=>assert.fail('Cancelled cue callback ran'));const old=scheduled[0].callback;audio.stop();old();
let drums=[];audio.drum=(voice,at)=>drums.push({voice,at});scheduled=[];
audio.rhythm(RHYTHMS[0],()=>{},{loops:2});assert.equal(drums.length,RHYTHMS[0].events.length*2);
assert(rhythmIds(0).length<rhythmIds(1).length);assert(rhythmIds(1).length<rhythmIds(2).length);
for(const p of POLYRHYTHMS){
  const events=polyEvents(p,1);assert.equal(events.length,p.a+p.b);
  for(const [voice,count] of [['rim',p.a],['kick',p.b]]){const beats=events.filter(e=>e.voice===voice).map(e=>e.beat);assert.equal(beats.length,count);assert.equal(beats[0],0);for(let i=1;i<count;i++)assert(Math.abs(beats[i]-beats[i-1]-4/count)<1e-10);}
  assert(polyEvents(p,1,'rim').every(e=>e.voice==='rim'));
}
console.log('Audio audit passed: all 264 chord/root pairs schedule exact catalog notes; arpeggios, cancellation, rhythm repetition and level pools.');
