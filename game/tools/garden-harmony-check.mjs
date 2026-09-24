import assert from 'node:assert/strict';
import {createGardenMission,GardenPad,gardenExercisesForChapter,PRESETS} from '../garden-harmony.mjs';
import {stepFromMidi} from '../garden-sequence-studio.mjs';

const exercise={
  id:'test-garden',name:'Fig. 1.99',source:'test',baseTonic:5,
  sequence:[
    {degree:'I6',offset:0,quality:'6',bassOffset:null},
    {degree:'II',offset:2,quality:'m7',bassOffset:null},
    {degree:'V/III',offset:11,quality:'7',bassOffset:4}
  ],
  distractors:[{degree:'IV',offset:5,quality:'maj7',bassOffset:null}]
};

const mission=createGardenMission({exercise,barSeconds:999,onChord:()=>{}});
mission.start();
assert.equal(mission.answerPart('degree',2).ignored,true,'the reference/base cannot be answered');
assert.equal(mission.snapshot().reference.degree,'БАЗА I6');
assert.equal(mission.snapshot().exercise.sequence.length,3,'the departure chord remains the first answer slot');
mission.advance();
assert.equal(mission.answerPart('quality','maj7').correct,false);
assert.equal(mission.answerPart('degree',0).correct,true);
assert.equal(mission.answerPart('quality','6').correct,true);
mission.advance();
assert.equal(mission.answerPart('degree',2).correct,true);
assert.deepEqual(mission.snapshot().progress[1],{degree:true,quality:false},'a correct degree persists by itself');
mission.advance();
assert.deepEqual(mission.snapshot().progress[1],{degree:true,quality:false},'moving to another position does not reset progress');
assert.equal(mission.answerPart('quality','7').correct,true,'slash-bass target uses the same two answer parts');
assert.equal(mission.answerPart('degree',11).correct,true);
assert.deepEqual(mission.snapshot().progress[2],{degree:true,quality:true});
mission.advance();
assert.equal(mission.snapshot().cursor,0,'the loop returns directly to the first chord without replaying the reference');
mission.advance();
assert.equal(mission.snapshot().cursor,1);
assert.equal(mission.answerPart('quality','m7').correct,true);
assert.deepEqual(mission.snapshot().solved,[0,1,2]);
assert.equal(mission.snapshot().complete,true);
assert.equal(mission.snapshot().solvedParts,6);
mission.restart();
assert.deepEqual(mission.snapshot().progress,[{degree:false,quality:false},{degree:false,quality:false},{degree:false,quality:false}]);
assert.equal(mission.snapshot().complete,false);
assert.deepEqual(Object.values(PRESETS).map(preset=>preset.engine),['sample','deep','air']);

const originalFetch=globalThis.fetch;
globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(0)});
const feedbackPad=new GardenPad();
globalThis.fetch=originalFetch;
feedbackPad.unlock=async()=>{};
feedbackPad.cleanOutput={};
feedbackPad.context={
  currentTime:1,
  createGain:()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}),
  createOscillator:()=>({frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){},stop(){},type:'sine',onended:null})
};
await feedbackPad.feedback(true,{kind:'degree',value:0});
const tonicFeedback={...feedbackPad.lastFeedback};
await feedbackPad.feedback(true,{kind:'degree',value:7});
assert.equal(feedbackPad.lastFeedback.character,'degree-glass');
assert(feedbackPad.lastFeedback.pitches[0]>tonicFeedback.pitches[0],'degree confirmation follows the selected pitch class');
await feedbackPad.feedback(true,{kind:'quality',value:'maj7'});
assert.equal(feedbackPad.lastFeedback.character,'quality-petal');
assert.equal(feedbackPad.lastFeedback.pitches.length,2,'quality confirmation has its own two-part timbre');
await feedbackPad.feedback(true,{kind:'quality',value:'maj7',complete:true});
assert.equal(feedbackPad.lastFeedback.pitches.length,3,'completed positions add a soft completion shimmer');

const firstBookMission=createGardenMission({barSeconds:999,onChord:()=>{}});
firstBookMission.start();
assert.equal(firstBookMission.snapshot().reference.quality,'6','Fig. 1.6 starts from the known sixth-chord base');
assert.deepEqual(firstBookMission.snapshot().exercise.sequence.map(chord=>chord.degree),['I6','VI−7','IV','I6'],'the full printed progression repeats after the one-shot reference');
for(const chord of firstBookMission.snapshot().exercise.sequence){
  firstBookMission.advance();
  assert.equal(firstBookMission.answerPart('degree',chord.offset).correct,true);
  assert.equal(firstBookMission.answerPart('quality',chord.quality).correct,true);
}
assert.equal(firstBookMission.snapshot().complete,true,'all four printed bars complete Fig. 1.6');
assert.equal(firstBookMission.snapshot().solved.length,4);

const fig210=gardenExercisesForChapter(2).find(item=>item.id==='fig-2-10');
assert.ok(fig210,'Fig. 2.10 must remain available to the Garden');
const fig210Mission=createGardenMission({exercise:fig210,barSeconds:999,onChord:()=>{}});
const availableQualities=new Set(fig210Mission.snapshot().choices.map(chord=>chord.quality));
for(const chord of fig210.sequence)assert.ok(availableQualities.has(chord.quality),`${chord.quality} must be present among Fig. 2.10 answers`);
fig210Mission.start();
for(const chord of fig210.sequence){
  fig210Mission.advance();
  assert.equal(fig210Mission.answerPart('degree',chord.offset).correct,true);
  // Reproduce the reported 13/14 state: leave only the fourth chord quality.
  if(chord!==fig210.sequence[3])assert.equal(fig210Mission.answerPart('quality',chord.quality).correct,true);
}
assert.equal(fig210Mission.snapshot().solvedParts,13,'Fig. 2.10 reaches the reported 13/14 state');
while(fig210Mission.snapshot().cursor!==3)fig210Mission.advance();
assert.equal(fig210Mission.answerPart('quality','maj7').correct,true,'the visible maj7 answer completes borrowed bVIIMaj7');
assert.equal(fig210Mission.snapshot().complete,true,'Fig. 2.10 completes at 14/14');

const octave=stepFromMidi([60,72]);
assert.equal(octave.quality,'1','a doubled note is an octave/unison, not an invented major chord');
assert.match(octave.label,/1\/8/,'the octave/unison answer is visible to the player');
const octaveMission=createGardenMission({
  exercise:{id:'octave-route',name:'Octave route',source:'test',baseTonic:0,sequence:[{...octave,offset:0},{...octave,id:'octave-2',offset:0}]},
  barSeconds:999,onChord:()=>{}
});
octaveMission.start();octaveMission.advance();
assert.ok(octaveMission.snapshot().choices.some(chord=>chord.quality==='1'),'the 1/8 answer appears among mission choices');
assert.equal(octaveMission.answerPart('degree',octave.offset??0).correct,true);
assert.equal(octaveMission.answerPart('quality','1').correct,true,'the octave/unison answer is accepted');
octaveMission.pause();

console.log('Garden harmony passed: one-shot reference, full Fig. 1.6 loop, Fig. 2.10 recovery, octave/unison grading, persistent parts, completion, restart, distinct timbres.');
