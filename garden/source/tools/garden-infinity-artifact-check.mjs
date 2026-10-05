import assert from 'node:assert/strict';
import {GardenLife,GARDEN_ITEMS} from '../garden-life.mjs';
import {createGardenMission,gardenBassOffset,gardenQualityAnswer} from '../garden-harmony.mjs';

const realSet=globalThis.setTimeout,realClear=globalThis.clearTimeout;
const timers=new Map();let nextTimer=0,attacks=[];
globalThis.setTimeout=fn=>{const id=++nextTimer;timers.set(id,fn);return id;};
globalThis.clearTimeout=id=>timers.delete(id);
const tick=()=>{assert.equal(timers.size,1,'one active playback timer');const [id,fn]=timers.entries().next().value;timers.delete(id);fn();};
const exercise={id:'infinity-artifact',baseTonic:0,sequence:[{offset:0,quality:'maj'},{offset:5,bassOffset:0,quality:'min'},{offset:7,quality:'7'}]};
try{
  const life=new GardenLife({random:()=>.5});
  const mission=createGardenMission({exercise,onChord:(_,state)=>attacks.push(state.cursor)});
  assert.equal(GARDEN_ITEMS.hold.repeat,true);assert.equal(GARDEN_ITEMS.hold.assist,undefined);
  mission.start();tick();const position=mission.snapshot().cursor;
  assert(life.useRepeat(mission).ignored,'no charge means no activation');
  life.collect(life.forceSpawn('hold'));assert.equal(life.inventory.hold,1,'actual pickup grants inventory charge');
  assert.equal(life.useRepeat(mission).held,true,'inventory use activates infinity');
  assert.equal(life.inventory.hold,0,'activation spends exactly one charge');assert.equal(attacks.at(-1),position);
  for(let i=0;i<20;i++){tick();assert.equal(mission.snapshot().cursor,position);assert.equal(attacks.at(-1),position);}
  assert(mission.snapshot().held,'infinity has no duration expiry');
  assert.equal(life.useRepeat(mission).held,false,'active infinity can exit with zero charges');
  assert.equal(mission.snapshot().cursor,position+1,'zero-charge manual exit advances without waiting');
  assert.equal(life.inventory.hold,0);assert.equal(timers.size,1);

  life.collect(life.forceSpawn('hold'));mission.pause();
  assert(life.useRepeat(mission).ignored);assert.equal(life.inventory.hold,1,'pause cannot spend charge');
  mission.start();life.useRepeat(mission);mission.pause({preserveHold:true});
  assert(life.useRepeat(mission).ignored);assert.equal(life.inventory.hold,0);assert(mission.snapshot().held);
  mission.start();tick();assert.equal(mission.snapshot().cursor,1,'resuming settings keeps same infinity chord');
  const partial=mission.answerPart('quality',gardenQualityAnswer(exercise.sequence[1]));
  assert(partial.correct&&partial.advanced);assert(!mission.snapshot().held);
  assert.deepEqual(mission.snapshot().progress[1],{degree:false,quality:true});
  assert.equal(mission.snapshot().cursor,2);assert.equal(life.inventory.hold,0,'auto exit spends no second charge');
  mission.pause();assert.equal(timers.size,0);

  // A full reveal during infinity is atomic: both halves belong to the held
  // node, followed by exactly one advance, not one advance per half.
  const fullLife=new GardenLife(),fullMission=createGardenMission({exercise});let revealCharges=1;
  fullMission.start();tick();fullLife.collect(fullLife.forceSpawn('hold'));fullLife.useRepeat(fullMission);
  const full=fullMission.assist({answerKind:'both',reveal:true},{consume:()=>revealCharges>0&&Boolean(revealCharges--)});
  assert(full.correct&&full.assisted&&full.advanced);assert.equal(full.position,0);
  assert.deepEqual(fullMission.snapshot().progress[0],{degree:true,quality:true});
  assert.deepEqual(fullMission.snapshot().progress[1],{degree:false,quality:false});
  assert.equal(fullMission.snapshot().cursor,1);assert(!fullMission.snapshot().held);
  assert.equal(revealCharges,0);assert.equal(timers.size,1);fullMission.pause();

  // Completing the very last missing part finishes normally, even if infinity
  // is active; there must be no extra attack or live timer after completion.
  for(const missing of ['degree','quality']){
    const heard=[],finalMission=createGardenMission({exercise,onChord:(_,state)=>heard.push(state.cursor)});
    finalMission.start();tick();
    for(let i=0;i<exercise.sequence.length;i++){
      const chord=exercise.sequence[i];
      if(i<exercise.sequence.length-1){finalMission.answer(chord);tick();}
      else finalMission.answerPart(missing==='degree'?'quality':'degree',missing==='degree'?gardenQualityAnswer(chord):gardenBassOffset(chord));
    }
    finalMission.hold();const count=heard.length,chord=exercise.sequence.at(-1);
    const result=finalMission.answerPart(missing,missing==='degree'?gardenBassOffset(chord):gardenQualityAnswer(chord));
    assert(result.correct&&result.complete&&!result.advanced);
    assert(finalMission.snapshot().complete&&!finalMission.snapshot().running&&!finalMission.snapshot().held);
    assert.equal(finalMission.snapshot().cursor,exercise.sequence.length-1);assert.equal(finalMission.snapshot().deadline,0);
    assert.equal(heard.length,count,'completing the route does not sound an extra chord');assert.equal(timers.size,0);
  }
  console.log('Infinity ARTIFACT passed: real pickup → consume → 20 same-chord attacks → immediate zero-charge exit; paused inventory safe; correct part auto exit; atomic full reveal; either final missing part completes without extra playback.');
}finally{globalThis.setTimeout=realSet;globalThis.clearTimeout=realClear;}
