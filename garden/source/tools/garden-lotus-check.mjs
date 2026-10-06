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
    const result=life.useAssist(mission,'degreeReveal'),alreadyFound=found==='both';
    assert.deepEqual(mission.snapshot().currentParts,{degree:true,quality:true},'The flower fills both answers atomically, preserving whichever part was already found');
    assert.equal(life.inventory.degreeReveal,alreadyFound?1:0);
    assert.equal(Boolean(result.ignored),alreadyFound);
    assert(gardenAnswerState(mission.snapshot(),'degree',0).selected);
    assert.equal(gardenAnswerState(mission.snapshot(),'quality','5:maj').selected,true);
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
assert.equal(GARDEN_ITEMS.degreeReveal.assist.answerKind,'both');
assert.equal(GARDEN_ITEMS.arpeggio,undefined,'The extra blue full-answer artifact is removed from active play');
for(const item of Object.values(GARDEN_ITEMS).filter(i=>i.assist&&!i.assist.reveal))assert.equal(item.sprite,item.assist.answerKind==='degree'?'hold-arpeggio-flower':'root-flower','Filters reuse the approved spiral and seed sprites');
for(const routeLength of [4,8]){
  const spawned=new GardenLife({random:()=>.17});spawned.spawnClock=spawned.craterClock=spawned.asteroidClock=spawned.stormClock=spawned.arrangementClock=999;spawned.assistClock=0;
  spawned.update(.01,{width:400,height:600,x:200,y:500,active:true,flying:true,answering:false,routeLength});
  assert.equal(spawned.snapshot().entities.some(entity=>entity.kind==='degreeReveal'),routeLength>=8,'Rare reveal flowers spawn only on routes with at least eight positions');
}
for(const kind of ['holdArpeggio','arrangementBoost'])for(let bass=0;bass<12;bass++)for(const found of ['none','degree','quality','both']){
  const route={id:'spiral-regression',baseTonic:0,sequence:[{offset:(bass+5)%12,bassOffset:bass,quality:'maj'},{offset:7,quality:'sus4'}]};
  const spiralLife=new GardenLife(),spiralMission=createGardenMission({exercise:route,barSeconds:3600});
  try{
    spiralLife.collect(spiralLife.forceSpawn(kind));
    assert(spiralLife.useAssist(spiralMission,kind).ignored);assert.equal(spiralLife.inventory[kind],1);
    spiralMission.start();assert(spiralLife.useAssist(spiralMission,kind).ignored);spiralMission.advance();
    if(found==='degree'||found==='both')spiralMission.answerPart('degree',bass);
    if(found==='quality'||found==='both')spiralMission.answerPart('quality',gardenQualityAnswer(route.sequence[0]));
    spiralMission.assist(GARDEN_ITEMS.qualityFocus.assist,{consume:()=>true});
    const before=spiralMission.snapshot(),result=spiralLife.useAssist(spiralMission,kind),after=spiralMission.snapshot(),divisor=GARDEN_ITEMS[kind].assist.divisor;
    assert(result.assisted);assert.equal(spiralLife.inventory[kind],0);
    assert.deepEqual(after.currentParts,before.currentParts);assert.deepEqual(after.filters.quality,before.filters.quality);
    const choices=gardenFilteredChoices('degree',after.current,after.filters.degree);
    assert.equal(choices.size,1+Math.ceil(11/divisor));assert(choices.has(bass));
    assert(spiralLife.useAssist(spiralMission,kind).ignored,'empty charge is not reused');
    spiralLife.collect(spiralLife.forceSpawn(kind));spiralMission.pause();
    assert(spiralLife.useAssist(spiralMission,kind).ignored);assert.equal(spiralLife.inventory[kind],1);
    spiralMission.start();
    for(let step=1;step<=after.filters.degree.remaining;step++){
      spiralMission.advance();const state=spiralMission.snapshot();
      if(step<after.filters.degree.remaining){assert.equal(state.filters.degree.remaining,after.filters.degree.remaining-step);assert(gardenFilteredChoices('degree',state.current,state.filters.degree).has(gardenBassOffset(state.current)));}
      else{assert.equal(state.filters.degree,null);assert.equal(gardenFilteredChoices('degree',state.current,null).size,12);}
    }
  }finally{spiralMission.pause();}
}
console.log('Restored degree flower and root spirals PASS: 96 ordinary/strong pickup, independent-bass, found-answer, paused, empty-charge and expiry cases; every filter preserves the correct answer.');
