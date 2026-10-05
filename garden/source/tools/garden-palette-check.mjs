import assert from 'node:assert/strict';
import {BOOK_CATALOG} from '../book-catalog.mjs';
import {GARDEN_CORE_QUALITIES,GARDEN_QUALITY_PALETTE,gardenCanonicalQuality,gardenFilteredChoices,createGardenMission,gardenQualityAnswer,gardenBassOffset,gardenAvailableAnswers} from '../garden-harmony.mjs';
import {BUILTIN_TOUR_ROUTES} from '../garden-tour-routes.mjs';
import {stepFromMidi} from '../garden-sequence-studio.mjs';
assert.deepEqual(GARDEN_CORE_QUALITIES,['maj','min','6','7','maj7','m7','m7b5','dim7','7sus4','sus4']);
const midiRoutes=BUILTIN_TOUR_ROUTES.map(route=>{
  const steps=route.chords.map(stepFromMidi),baseTonic=steps[0].rootPc;
  return {...route,baseTonic,sequence:steps.map(step=>({...step,offset:(step.rootPc-baseTonic+12)%12,bassOffset:(step.bassPc-baseTonic+12)%12}))};
});
for(const route of [...BOOK_CATALOG,...midiRoutes]){
  const required=new Set(route.sequence.map(gardenQualityAnswer));
  const available=gardenAvailableAnswers(route);
  for(const q of required)assert.ok(available.includes(q),`${route.id}: missing ${q}`);
  for(const chord of route.sequence)for(const divisor of [2,4])assert.ok(gardenFilteredChoices('quality',chord,{remaining:3,divisor},available).has(gardenQualityAnswer(chord)));
  assert.deepEqual(available.slice(0,GARDEN_CORE_QUALITIES.length),GARDEN_CORE_QUALITIES);
  for(const divisor of [2,4]){
    const mission=createGardenMission({exercise:route,barSeconds:3600});
    try{
      mission.start();
      for(const chord of route.sequence){
        mission.advance();
        mission.assist({answerKind:'quality',divisor,steps:3},{consume:()=>true});
        const model=mission.snapshot(),visible=gardenFilteredChoices('quality',model.current,model.filters.quality,available);
        assert.ok(visible.has(gardenQualityAnswer(chord)),`${route.id}: filter must keep a rendered correct button`);
        assert.equal(mission.answerPart('degree',gardenBassOffset(chord)).correct,true);
        assert.equal(mission.answerPart('quality',gardenQualityAnswer(chord)).correct,true,`${route.id}: visible answer must be accepted`);
      }
      assert.equal(mission.snapshot().complete,true,`${route.id}: filtered route must be finishable`);
    }finally{mission.pause();}
  }
}
const chill=midiRoutes.find(route=>route.id==='builtin-chill-01');
assert.deepEqual(chill.sequence[6].notes,[53,58,60,65]);
assert.equal(chill.sequence[6].quality,'sus4');
assert.ok(GARDEN_CORE_QUALITIES.includes(chill.sequence[6].quality),'Chill 1 penultimate answer belongs in the permanent right column');
console.log(`Student palette passed: fixed core and completable filtered answers across ${BOOK_CATALOG.length} book + ${midiRoutes.length} MIDI routes, including Chill 1 sus4.`);
