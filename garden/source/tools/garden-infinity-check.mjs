import assert from 'node:assert/strict';
import {createGardenMission,gardenBassOffset,gardenQualityAnswer} from '../garden-harmony.mjs';

const realTimeout=globalThis.setTimeout,realClear=globalThis.clearTimeout;
const timers=new Map();let nextTimer=0,plays=[];
globalThis.setTimeout=fn=>{const id=++nextTimer;timers.set(id,fn);return id;};
globalThis.clearTimeout=id=>timers.delete(id);
const tick=()=>{assert.equal(timers.size,1,'only one playback timer may be pending');const [id,fn]=timers.entries().next().value;timers.delete(id);fn();};
const exercise={id:'infinity-parts',baseTonic:0,sequence:[{offset:0,quality:'maj'},{offset:5,bassOffset:0,quality:'min'},{offset:7,quality:'7'}]};
try{
  const mission=createGardenMission({exercise,onChord:(chord,state)=>plays.push(state.cursor)});
  mission.start();mission.hold();
  const position=mission.snapshot().cursor;
  assert.equal(position,0,'hold during tonic selects first exercise chord');
  assert.equal(plays.at(-1),position,'activation immediately sounds held chord');
  for(let i=0;i<4;i++){tick();assert.equal(mission.snapshot().cursor,position);assert.equal(plays.at(-1),position);}
  assert.equal(plays.length,6,'reference, immediate held attack, four repeats');

  for(const [kind,value] of [['degree',1],['quality','m7']]){
    assert.equal(mission.answerPart(kind,value).correct,false);
    assert(mission.snapshot().held,'wrong answers must not release infinity');
    assert.equal(mission.snapshot().cursor,0);
  }
  assert(mission.answerPart('unknown',0).ignored);assert(mission.snapshot().held);
  const quality=mission.answerPart('quality',gardenQualityAnswer(exercise.sequence[0]));
  assert.equal(quality.position,0,'result identifies the answered node, not its successor');
  assert(quality.advanced&&!quality.positionComplete);
  assert.deepEqual(mission.snapshot().progress[0],{degree:false,quality:true});
  assert.equal(mission.snapshot().cursor,1,'new correct quality advances immediately, without a timer tick');
  assert(!mission.snapshot().held);assert.equal(timers.size,1);

  mission.hold(true);
  const degree=mission.answerPart('degree',gardenBassOffset(exercise.sequence[1]));
  assert.equal(degree.position,1);assert(degree.advanced&&!degree.positionComplete);
  assert.equal(mission.snapshot().cursor,2,'new correct actual bass also advances immediately');
  assert(!mission.snapshot().held&&!mission.snapshot().arpeggio);
  tick();assert.equal(mission.snapshot().cursor,0,'the replacement timer advances only once');
  mission.hold();const attacks=plays.length;
  assert(mission.answerPart('quality','maj').ignored,'an already found part is not a new guess');
  assert(mission.snapshot().held);assert.equal(mission.snapshot().cursor,0);assert.equal(plays.length,attacks);

  const resumed=mission.continue();assert(resumed.advanced);
  assert.equal(mission.snapshot().cursor,1,'manual exit advances immediately');
  assert(!mission.snapshot().held);assert.equal(timers.size,1);
  assert(mission.continue().ignored);assert.equal(mission.snapshot().cursor,1,'double clicks cannot advance twice');
  mission.hold();mission.pause({preserveHold:true});
  assert(mission.snapshot().held&&!mission.snapshot().running);assert.equal(timers.size,0);
  assert(mission.continue().ignored,'a settings pause cannot advance or resume playback');
  assert(mission.answerPart('quality','5:min').ignored);assert.equal(mission.snapshot().cursor,1);
  mission.start();assert(mission.snapshot().held);tick();assert.equal(mission.snapshot().cursor,1);
  mission.pause();assert(!mission.snapshot().held);assert.equal(timers.size,0);
  console.log('Infinity passed: timed same-chord repeats; wrong/ignored hold; new quality or bass releases and advances once; visible-exit contract; settings pause/resume; timer cancellation.');
}finally{globalThis.setTimeout=realTimeout;globalThis.clearTimeout=realClear;}
