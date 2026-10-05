import assert from 'node:assert/strict';
import {GardenLife,GARDEN_ITEMS} from '../garden-life.mjs';
import {createGardenMission,gardenQualityAnswer,gardenBassOffset,gardenAnswerState,gardenFilteredChoices,gardenAvailableAnswers} from '../garden-harmony.mjs';
const exercise={id:'slash-regression',baseTonic:0,sequence:[{offset:5,bassOffset:0,quality:'maj'},{offset:7,quality:'sus4'}]};
for(const found of ['none','degree','quality','both']){
  const life=new GardenLife(),mission=createGardenMission({exercise,barSeconds:999});
  try{
    life.collect(life.forceSpawn('degreeReveal'));mission.start();mission.advance();
    if(found==='degree'||found==='both')mission.answerPart('degree',0);
    if(found==='quality'||found==='both')mission.answerPart('quality','5:maj');
    const result=life.useAssist(mission,'degreeReveal'),alreadyFound=found==='degree'||found==='both';
    assert.deepEqual(mission.snapshot().currentParts,{degree:true,quality:found==='quality'||found==='both'},'The restored flower reveals only the lower degree, preserving the chord-answer state');
    assert.equal(life.inventory.degreeReveal,alreadyFound?1:0);
    assert.equal(Boolean(result.ignored),alreadyFound);
    assert(gardenAnswerState(mission.snapshot(),'degree',0).selected);
    assert.equal(gardenAnswerState(mission.snapshot(),'quality','5:maj').selected,found==='quality'||found==='both');
  }finally{mission.pause();}
}
const life=new GardenLife(),mission=createGardenMission({exercise,barSeconds:999});
try{
  life.collect(life.forceSpawn('degreeReveal'));assert(life.useAssist(mission,'degreeReveal').ignored);assert.equal(life.inventory.degreeReveal,1);
  mission.start();assert(life.useAssist(mission,'degreeReveal').ignored);mission.advance();
  assert.equal(mission.answerPart('degree',5).correct,false,'root is NOT the bass');
  assert.equal(mission.answerPart('quality','maj').correct,false,'bare quality cannot identify a different-root upper chord');
  for(const spec of Object.values(GARDEN_ITEMS).filter(i=>i.assist&&!i.assist.reveal)){
    mission.assist(spec.assist,{consume:()=>true});const state=mission.snapshot(),kind=spec.assist.answerKind;
    const choices=gardenFilteredChoices(kind,state.current,state.filters[kind],kind==='quality'?gardenAvailableAnswers(exercise):undefined);
    assert(choices.has(kind==='degree'?gardenBassOffset(state.current):gardenQualityAnswer(state.current)));
  }
  mission.pause();assert(life.useAssist(mission,'degreeReveal').ignored);assert.equal(life.inventory.degreeReveal,1);
}finally{mission.pause();}
assert.equal(GARDEN_ITEMS.degreeReveal.sprite,'arpeggio-flower','The approved pinwheel is restored with its exact existing sprite');
assert.equal(GARDEN_ITEMS.degreeReveal.assist.answerKind,'degree');
assert.equal(GARDEN_ITEMS.arpeggio,undefined,'The extra blue full-answer artifact is removed from active play');
for(const item of Object.values(GARDEN_ITEMS).filter(i=>i.assist&&!i.assist.reveal))assert.equal(item.sprite,item.assist.answerKind==='degree'?'hold-arpeggio-flower':'root-flower','Filters reuse the approved spiral and seed sprites');
for(const routeLength of [4,8]){
  const spawned=new GardenLife({random:()=>.17});spawned.spawnClock=spawned.craterClock=spawned.asteroidClock=spawned.stormClock=spawned.arrangementClock=999;spawned.assistClock=0;
  spawned.update(.01,{width:400,height:600,x:200,y:500,active:true,flying:true,answering:false,routeLength});
  assert.equal(spawned.snapshot().entities.some(entity=>entity.kind==='degreeReveal'),routeLength>=8,'Rare reveal flowers spawn only on routes with at least eight positions');
}
console.log('Restored degree flower: exact approved sprite, single-part reveal, no charge for solved/paused/reference positions; compound answers and every filter preserve the correct target.');
