import assert from 'node:assert/strict';
import {GARDEN_MODES,GARDEN_MODE_FAMILIES,GARDEN_NAVIGATION_RULES,GARDEN_MODE_PICKUP_RULES,gardenModeById,gardenModeNotes,gardenModeVerdict,gardenModeTensionVerdict,gardenModeTier,GardenModesFlight} from '../garden-modes.mjs';
import {GardenJourneyRatings,gardenRouteStars} from '../garden-journey.mjs';
import {GARDEN_TENSIONS} from '../garden-resonance.mjs';
assert.equal(GARDEN_MODES.length,41);assert.equal(new Set(GARDEN_MODES.map(m=>m.id)).size,41);assert.equal(new Set(GARDEN_MODES.map(m=>m.label)).size,41);
for(const mode of GARDEN_MODES){assert.equal(mode.notes[0],0);assert(mode.notes.every((n,i)=>Number.isInteger(n)&&n>=0&&n<12&&(!i||n>mode.notes[i-1])));assert(GARDEN_MODE_FAMILIES.some(f=>f.id===mode.family));for(let tonic=0;tonic<12;tonic++)for(let root=0;root<12;root++){const chord={offset:root,quality:'m7'},before=JSON.stringify(chord),notes=gardenModeNotes(chord,tonic,mode);assert.equal(notes.length,mode.notes.length+1);assert.deepEqual(notes.map(n=>(n-notes[0])%12),[...mode.notes,0]);assert.equal(notes[0]%12,(tonic+root)%12);assert.equal(JSON.stringify(chord),before);}}
assert.deepEqual(gardenModeById('altered').notes,[0,1,3,4,6,8,10]);assert.deepEqual(gardenModeById('locrian-n2').notes,[0,2,3,5,6,8,10]);assert.deepEqual(gardenModeById('phrygian-dominant').notes,[0,1,4,5,7,8,10]);assert.deepEqual(gardenModeById('lydian-b3').notes,[0,2,3,6,7,9,11]);
const verdict=(q,id,extra={})=>gardenModeVerdict({offset:0,quality:q,...extra},id,{tonic:0}).verdict;
assert.equal(verdict('maj7','ionian'),'compatible');assert.equal(gardenModeVerdict({quality:'maj7',offset:0},'ionian').reason,'passing-fourth');assert.equal(verdict('maj7','dorian'),'contrast');assert.equal(verdict('m7','dorian'),'compatible');assert.equal(verdict('m7natural9','phrygian'),'neutral');assert.equal(verdict('m7b5','locrian-n2'),'compatible');assert.equal(verdict('7b9','mixolydian'),'neutral');assert.equal(verdict('7b9','diminished-hw'),'compatible');assert.equal(verdict('dim7','diminished-wh'),'compatible');assert.equal(verdict('unknown','ionian'),'neutral');assert.equal(verdict('7','minor-blues'),'neutral');assert.equal(verdict('7','bebop-dominant'),'neutral');assert.equal(verdict('7','whole-tone',{notes:[60,64,67,70]}),'neutral');assert.equal(verdict('m7','dorian',{bassOffset:7}),'neutral');
const heard=[],modeFlight=new GardenModesFlight({random:()=>.2,onScale:e=>heard.push(e)});modeFlight.reset(true);const sound={chord:{offset:2,quality:'m7'},tonic:5,at:1,barSeconds:4};let e=modeFlight.spawn('dorian');const good=modeFlight.collect(e,sound,{audioTime:2});assert.equal(good.verdict,'compatible');assert.equal(good.notes[0]%12,7);assert(modeFlight.collect(e,sound,{audioTime:2}).ignored);e=modeFlight.spawn('ionian');assert.equal(modeFlight.collect(e,sound,{audioTime:4.7}).boundary,true);assert.equal(modeFlight.energy,100);assert.equal(modeFlight.gameOver,false);const aged=modeFlight.spawn('lydian');modeFlight.update(0,{active:true,complete:true});assert.equal(modeFlight.entities.length,0);modeFlight.setFamilies(['blues']);assert.equal(modeFlight.spawn('dorian'),null);assert(modeFlight.spawn('minor-blues'));modeFlight.reset(true);assert.deepEqual([...modeFlight.families],['blues']);
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},normal=new GardenJourneyRatings(storage),professor=new GardenJourneyRatings(storage,'prof-test');normal.record('r',{difficulty:'hard',independent:true,accuracy:1,laps:1});professor.record('r',{difficulty:'professor',independent:true,accuracy:.8,laps:4});assert.equal(normal.best('r'),5);assert.equal(professor.best('r'),2);assert.equal(gardenRouteStars({difficulty:'professor',independent:false,ratingCap:4,accuracy:1,laps:1}),4);
// A caught extension is a deliberate collection choice, not a claim about
// forbidden chromatic passing notes. Explicit dense-scale omissions can be
// assessed even while slash voicing/function itself stays contextual.
const chosen=(mode,tones,extra={})=>gardenModeTensionVerdict({quality:'m7',offset:0,...extra},mode,tones,{tonic:0});
const ninth=chosen('phrygian',['9']);assert.equal(ninth.verdict,'invalid');assert.equal(ninth.reason,'tension-conflict');assert.deepEqual(ninth.conflicts,[{label:'9',interval:2,expected:'♭9',source:'selected'}]);
assert.equal(chosen('phrygian',['♭9']).verdict,'compatible');assert.equal(chosen('phrygian',['9'],{bassOffset:7}).verdict,'invalid');
const eleventh=chosen('lydian',['11'],{quality:'maj7'});assert.equal(eleventh.verdict,'invalid');assert.equal(eleventh.conflicts[0].expected,'♯11');
assert.equal(chosen('lydian',['♯11'],{quality:'maj7'}).verdict,'compatible');assert.equal(chosen('lydian-dominant',['7'],{quality:'7'}).conflicts[0].expected,'♭7');
assert.equal(chosen('aeolian',['13']).conflicts[0].expected,'♭13');assert.equal(chosen('mixolydian',[],{quality:'7b9'}).reason,'written-tension');
for(const id of ['minor-pentatonic','major-blues','minor-blues','bebop-major','bebop-dominant'])assert.equal(chosen(id,['9','♯11','7']).verdict,'neutral');
// Exhaust every selectable extension and every catalogue entry, in every root
// transposition. An unknown quality isolates the selected collection rule from
// separate guide-tone grading; a slash bass must not alter relative intervals.
assert.deepEqual([...new Set(GARDEN_TENSIONS.map(t=>t.interval%12))].sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i));
let matrixCases=0;
for(const mode of GARDEN_MODES)for(const tone of GARDEN_TENSIONS)for(let root=0;root<12;root++){
 const chord={quality:'unknown',offset:root,bassOffset:(root+7)%12},before=JSON.stringify(chord),interval=tone.interval%12;
 const grade=gardenModeTensionVerdict(chord,mode,[tone.label],{tonic:5});
 if(['pentatonic','blues','eight'].includes(mode.family)){
  assert.equal(grade.verdict,'neutral',mode.id+' '+tone.label+' stays contextual');assert.deepEqual(grade.conflicts,[]);
 }else if(!mode.notes.includes(interval)){
  assert.equal(grade.verdict,'invalid',mode.id+' excludes '+tone.label);assert.equal(grade.reason,'tension-conflict');
  assert.equal(grade.conflicts.length,1);assert.equal(grade.conflicts[0].label,tone.label);assert.equal(grade.conflicts[0].interval,interval);assert.equal(grade.conflicts[0].source,'selected');
 }else{
  assert.equal(grade.verdict,'neutral','included pitch with unknown chord remains contextual');assert.deepEqual(grade.conflicts,[],'included pitch is never a selected-tone conflict');
 }
 assert.equal(JSON.stringify(chord),before,'classification never mutates slash chord');matrixCases++;
}
assert.equal(matrixCases,12*41*12);
for(const mode of GARDEN_MODES){const flatThird=gardenModeTensionVerdict({quality:'unknown',offset:0},mode,['♭3']),sharpNinth=gardenModeTensionVerdict({quality:'unknown',offset:0},mode,['♯9']);assert.equal(flatThird.verdict,sharpNinth.verdict);assert.equal(flatThird.conflicts.length,sharpNinth.conflicts.length,'enharmonic pitch membership is identical');}
assert.equal(gardenModeTensionVerdict({quality:'m7',offset:0},'phrygian',['9'],{boundary:true}).verdict,'neutral');
for(const mode of GARDEN_MODES)for(let tonic=0;tonic<12;tonic++){
 const first=gardenModeTensionVerdict({quality:'m7',offset:0},mode,['9','11'],{tonic:0});
 assert.deepEqual(gardenModeTensionVerdict({quality:'m7',offset:7,bassOffset:7},mode,['9','11'],{tonic}),first,'transposition does not change relative selected pitches');
}
const combined=new GardenModesFlight({random:()=>.2,onScale:e=>heard.push(e)}),cs={chord:{offset:0,quality:'m7'},tonic:0,at:10,barSeconds:4},during={audioTime:11};combined.reset(true);
assert(combined.recordTension('9',cs,during).recorded);assert.deepEqual(combined.snapshot().selectedTensions,['9']);
let conflict=combined.collect(combined.spawn('phrygian'),cs,during);assert.equal(conflict.kind,'mode');assert.equal(conflict.requestedDelta,-15);assert.equal(combined.navigation,65);
assert.equal(combined.collect(combined.spawn('phrygian'),cs,during).delta,0,'same pair is assessed once per sounding onset');assert(combined.recordTension('9',cs,during).duplicate);
combined.reset(true);const reward=combined.collect(combined.spawn('phrygian'),cs,during);assert.equal(reward.delta,GARDEN_NAVIGATION_RULES.reward);
conflict=combined.recordTension('9',cs,during);assert.equal(conflict.kind,'tension');assert.equal(conflict.modeId,'phrygian');assert.equal(conflict.tensionLabel,'9');assert.equal(conflict.delta,-15);assert.equal(conflict.root,'C');
const next={...cs,at:14};combined.update(.01,{active:true,sounding:next});assert.deepEqual(combined.snapshot().selectedTensions,[]);assert.equal(combined.snapshot().activeMode,null);
assert.equal(combined.collect(combined.spawn('phrygian'),next,{audioTime:15}).verdict,'compatible');
assert(combined.recordTension('9',next,{audioTime:14.05}).boundary);assert.deepEqual(combined.snapshot().selectedTensions,[]);
const beforeBoundary=combined.navigation;assert(combined.collect(combined.spawn('lydian'),next,{audioTime:17.5}).boundary);assert.equal(combined.navigation,beforeBoundary);
combined.restore();assert.equal(combined.navigation,100);combined.navigation=10;combined.recordTension('9',next,{audioTime:15});combined.collect(combined.spawn('phrygian'),next,{audioTime:15});assert.equal(combined.navigation,0);assert(!combined.gameOver);combined.clock=1000;
for(let i=0;i<6;i++)combined.update(.5,{active:true,sounding:next});assert(!combined.gameOver);combined.update(.5,{active:true,sounding:next});assert(combined.gameOver);assert(combined.recordTension('11',next,{audioTime:15}).ignored);assert(combined.collect(combined.spawn('dorian'),next,{audioTime:15}).ignored);
combined.reset(false);assert(!combined.snapshot().navigationEnabled);assert.equal(combined.snapshot().gameOver,false);
// Before an attack, after a bar/held-loop window expires, or during pause,
// neither stale contact nor a selected note can incur a navigation penalty.
combined.reset(true);combined.recordTension('9',cs,during);
for(const audioTime of [9.5,9.999,10,13.9,14,15]){const before=combined.navigation,guarded=combined.collect(combined.spawn('phrygian'),cs,{audioTime,held:audioTime>=14});assert(guarded.boundary);assert.equal(guarded.delta,0);assert.equal(combined.navigation,before);assert(combined.recordTension('11',cs,{audioTime,held:audioTime>=14}).boundary);}
const paused=combined.spawn('phrygian',{x:.5,y:.5}),beforePause=combined.snapshot();assert(combined.collect(paused,cs,{...during,paused:true}).ignored);assert(!paused.collected);assert(combined.recordTension('11',cs,{...during,paused:true}).ignored);combined.update(5,{active:true,paused:true,sounding:cs,width:100,height:100,x:50,y:50,audioTime:11});assert.deepEqual(combined.snapshot(),beforePause);
// The name/formula sit directly above the collectible point. No text bounding
// box or enclosing badge adds an invisible collision target.
const drawn=[],dots=[],hud=new GardenModesFlight(),canvas={font:'',save(){},restore(){},beginPath(){},fill(){},arc(x,y,r){assert(r<=4,'HUD arcs are pickup dots, never enclosing badges');dots.push({x,y,r});},ellipse(){throw Error('scale HUD cannot use an ellipse');},measureText(text){return {width:text.length*(this.font.startsWith('7.5')?4.5:6.4)};},fillText(text,x,y,maxWidth){drawn.push({text,x,y,maxWidth,font:this.font,align:this.textAlign});}};
hud.reset(true);const token=hud.spawn('phrygian',{x:.31,y:.4,age:1}),hudBefore=hud.snapshot(),anchor={x:token.x*320,y:token.y*568};hud.draw(canvas,320,568,{language:'ru'});assert.equal(drawn[0].text,'Фригийский');assert.equal(drawn[1].text,'1 ♭2 ♭3 4 5 ♭6 ♭7');assert(drawn[1].font.startsWith('7.5px'));assert(drawn.every(t=>t.align==='center'&&t.x===anchor.x&&t.maxWidth<=156));assert.equal(drawn[0].y,anchor.y-24);assert.equal(drawn[1].y,anchor.y-10);assert.deepEqual(dots,[{...anchor,r:GARDEN_MODE_PICKUP_RULES.dotRadius}]);assert.deepEqual(hud.snapshot(),hudBefore);drawn.length=0;dots.length=0;hud.draw(canvas,320,568,{language:'en'});assert.equal(drawn[0].text,'Phrygian');assert.equal(drawn[1].text,'1 ♭2 ♭3 4 5 ♭6 ♭7');assert(drawn.every(t=>t.align==='center'&&t.x===anchor.x));assert.deepEqual(dots,[{...anchor,r:GARDEN_MODE_PICKUP_RULES.dotRadius}]);
for(const sample of [0,.2,.49,.5,.7,.999]){const lane=new GardenModesFlight({random:()=>sample});lane.reset(true);const x=lane.spawn('dorian').x*320;assert(x-78>=8&&x+78<=312,'normal spawn keeps centred156px text within320px viewport');}
const contactView={active:true,width:320,height:568,x:160,y:284,previousX:160,previousY:284,sounding:cs,audioTime:11};
function contact(view={},entity={},dt=.02){const events=[],flight=new GardenModesFlight({onScale:event=>events.push(event)});flight.reset(true);flight.clock=1000;flight.spawn('dorian',{x:.5,y:.5,vy:0,age:1,...entity});flight.update(dt,{...contactView,...view});return {flight,events};}
let touch=contact();assert.equal(touch.events.length,1,'direct bright-dot contact activates');assert.equal(touch.events[0].kind,'mode');touch.flight.update(.02,contactView);assert.equal(touch.events.length,1,'one pickup activates once');
for(const [x,y] of [[160,260],[220,260],[180,284],[160,304]]){const miss=contact({x,y,previousX:x,previousY:y});assert.equal(miss.events.length,0,'text-only or beyond-dot contact must not activate');assert.equal(miss.flight.entities.length,1);}
for(const view of [
 {previousX:40,x:280},
 {previousX:280,x:40},
 {previousY:160,y:408},
 {previousY:408,y:160}
])assert.equal(contact(view).events.length,1,'swept ship/dot crossing catches even with both endpoints outside radius');
assert.equal(contact({}, {y:.3,vy:.7},.5).events.length,1,'falling pickup cannot tunnel through stationary ship');
assert.equal(contact({previousY:320,y:240},{y:240/568,vy:160/568},.5).events.length,1,'relative sweep combines opposing ship and pickup motion');
assert.equal(contact({previousX:40,x:280,previousY:260,y:260}).events.length,0,'fast near miss24px away does not activate');
assert.equal(contact({paused:true}).events.length,0,'paused dot collision does not activate');
const nearAttack=contact({audioTime:9.9});assert.equal(nearAttack.events.length,1);assert(nearAttack.events[0].boundary);assert.equal(nearAttack.events[0].delta,0,'physical contact at a chord boundary stays visible but penalty-free');
// The game tiers reward a confirmed compatible collection, never novelty alone.
for(const [id,quality,reward,points,tier] of [['dorian','m7',6,6,'base'],['lydian-dominant','7',9,10,'jazz'],['dorian-s4','m7',12,14,'rare']]){
 const gradeFlight=new GardenModesFlight();gradeFlight.reset(true);gradeFlight.navigation=99;const sonority={...cs,chord:{offset:0,quality}},earned=gradeFlight.collect(gradeFlight.spawn(id),sonority,during);
 assert.equal(earned.verdict,'compatible');assert.equal(earned.tier.id,tier);assert.equal(earned.requestedDelta,reward);assert.equal(earned.delta,1);assert.equal(earned.points,points,'points remain correct at NAV cap');
 const duplicate=gradeFlight.collect(gradeFlight.spawn(id),sonority,during);assert.equal(duplicate.points,0);assert.equal(duplicate.requestedDelta,0);
 assert.deepEqual(earned.tier,gardenModeTier(id));assert(Object.isFrozen(earned.tier));
}
const rareConflict=new GardenModesFlight();rareConflict.reset(true);rareConflict.recordTension('11',cs,during);const badRare=rareConflict.collect(rareConflict.spawn('dorian-s4'),cs,during);assert.equal(badRare.requestedDelta,-15);assert.equal(badRare.points,0);assert.equal(badRare.tier.id,'rare');
const contextualTier=new GardenModesFlight();contextualTier.reset(true);assert.equal(contextualTier.collect(contextualTier.spawn('minor-blues'),cs,during).points,0);
// Only automatic offerings wait for a fully solved third of the route. Manual
// QA spawn stays available; the automatic route never exceeds three labels.
const automaticView={...contactView,timeScale:1,totalChords:12,solvedChords:4};
for(const totalChords of [1,2,3,4,6,8,12,41]){
 const unlock=new GardenModesFlight({random:()=>.2}),threshold=Math.ceil(totalChords/3);unlock.reset(true);unlock.clock=0;
 unlock.update(.01,{...automaticView,totalChords,solvedChords:threshold-1});assert.equal(unlock.entities.length,0);assert.equal(unlock.snapshot().unlockThreshold,threshold);assert(!unlock.snapshot().unlocked);
 unlock.update(.01,{...automaticView,totalChords,solvedChords:threshold});assert.equal(unlock.entities.length,1);assert(unlock.snapshot().unlocked);
}
const capacity=new GardenModesFlight({random:()=>.2});capacity.reset(true);for(let i=0;i<10;i++){capacity.clock=0;capacity.update(.001,automaticView);}assert.equal(capacity.entities.length,3);
// A future major chord is offered Ionian/Lydian despite the flat9 caught on
// the currently sounding minor chord; the old choice cannot cross an onset.
const forecastOffers=[],forecastCalls=[],forecast=new GardenModesFlight({random:()=>.2,onOffer:e=>forecastOffers.push(e)}),future={...cs,chord:{offset:5,quality:'maj7'},tonic:2,at:14,tensionMode:undefined};forecast.reset(true);forecast.setFamilies(['major']);forecast.recordTension('♭9',cs,during);
for(let i=0;i<2;i++){forecast.entities=[];forecast.clock=0;forecast.update(.01,{...automaticView,timeScale:1.07,forecastSounding:seconds=>{forecastCalls.push(seconds);return future;}});}
assert.equal(forecastOffers.length,2);assert(forecastOffers[1].eligible);assert(['ionian','lydian'].includes(forecastOffers[1].mode.id));assert(forecast.snapshot().lastOffer.forced);assert.equal(forecastOffers[1].targetSounding,future);assert.equal(forecastOffers[1].tier,gardenModeTier(forecastOffers[1].mode));assert(Math.abs(forecastCalls[0]-(.5+.05)/(.09*1.07))<1e-9);assert.deepEqual(forecast.snapshot().selectedTensions,['♭9']);
assert.equal(forecastCalls.length,2,'older forecast API without phase is not adjusted');assert(!forecast.snapshot().lastOffer.arrivalAdjusted);assert.equal(forecastOffers[1].eta,forecastCalls[1]);
// Near either bar boundary, automatic spawn height shifts by at most0.8s of
// travel and selection is recalculated using the revised audible window.
for(const initialPhase of [.1,3.8]){
 const phasedOffers=[],phaseCalls=[],initialEta=(.5+.05)/.09,guarded=new GardenModesFlight({random:()=>.2,onOffer:offer=>phasedOffers.push({...offer,entity:{...offer.entity}})});guarded.reset(true);guarded.clock=0;
 guarded.update(.01,{...automaticView,forecastSounding:seconds=>{phaseCalls.push(seconds);const phase=initialPhase+seconds-initialEta;return {...future,phase,remaining:4-phase,barSeconds:4};}});
 assert.equal(phaseCalls.length,2);const offer=phasedOffers[0],state=guarded.snapshot().lastOffer;assert(offer.targetSounding.phase>=.6&&offer.targetSounding.remaining>=.85);assert(Math.abs(offer.eta-initialEta)<=.8000001);assert(Math.abs(offer.entity.y-(-.05-(offer.eta-initialEta)*.09))<1e-9);assert(state.arrivalAdjusted);assert.equal(state.phase,offer.targetSounding.phase);assert.equal(state.remaining,offer.targetSounding.remaining);assert.equal(offer.eta,phaseCalls[1]);assert.equal(guarded.spawn('dorian').y,-.05,'manual spawn height is not phase-adjusted');
}
const manualOfferCount=forecastOffers.length;forecast.spawn('dorian');assert.equal(forecastOffers.length,manualOfferCount,'manual QA spawn never synthesizes a paired offering');
// With the same onset, selected notes do constrain candidates. On minor7 the
// chosen flat9 leaves Phrygian as the compatible major-family option.
const sameOnset=new GardenModesFlight({random:()=>.2});sameOnset.reset(true);sameOnset.setFamilies(['major']);sameOnset.recordTension('♭9',cs,during);
for(let i=0;i<2;i++){sameOnset.entities=[];sameOnset.clock=0;sameOnset.update(.01,{...automaticView,forecastSounding:()=>cs});}assert.equal(sameOnset.snapshot().lastOffer.modeId,'phrygian');assert(sameOnset.snapshot().lastOffer.compatible);
const uncertain=new GardenModesFlight({random:()=>.2});uncertain.reset(true);uncertain.clock=0;uncertain.update(.01,{...automaticView,forecastSounding:()=>null});assert(!uncertain.snapshot().lastOffer.compatible);assert(!uncertain.snapshot().lastOffer.forced);
// Deterministic sampling checks useful frequencies rather than merely checking
// the weight table: familiar modes must dominate the old uniform41-way draw,
// while uncommon colours still occur and every second offer is a fair option.
const seeded=seed=>()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296),commonIds=new Set(['ionian','dorian','mixolydian','lydian','aeolian']);
function sampleOffers(quality,count=6000,families){const offers=[],flight=new GardenModesFlight({random:seeded(5727),onOffer:offer=>offers.push(offer)});flight.reset(true);if(families)flight.setFamilies(families);for(let i=0;i<count;i++){flight.entities=[];flight.clock=0;flight.update(.01,{...automaticView,sounding:{...cs,chord:{quality,offset:0}}});}return {offers,flight};}
const unknownSample=sampleOffers('unknown'),commonCount=unknownSample.offers.filter(e=>commonIds.has(e.mode.id)).length,rareCount=unknownSample.offers.filter(e=>e.tier.id==='rare').length;assert(commonCount>unknownSample.offers.length*.45&&commonCount<unknownSample.offers.length*.8);assert(rareCount>0&&rareCount<unknownSample.offers.length*.1);assert.equal(new Set(unknownSample.offers.map(e=>e.mode.id)).size,41,'rare families remain reachable');
const minorSample=sampleOffers('m7');assert(minorSample.offers.filter(e=>commonIds.has(e.mode.id)).length>minorSample.offers.length*.6);for(let i=1;i<minorSample.offers.length;i+=2){assert(minorSample.offers[i].eligible);assert.notEqual(minorSample.offers[i].tier.id,'rare');}
const rareOnly=sampleOffers('unknown',200,['harmonic-major']);assert(rareOnly.offers.every(e=>e.mode.family==='harmonic-major'));assert.equal(new Set(rareOnly.offers.map(e=>e.mode.id)).size,7,'rare-only family choices remain playable');
console.log('Professor modes passed: 41 collections ×144 transpositions; '+matrixCases+' tension/mode/root cases; tier rewards/points and deduplication; third-route unlock, arrival forecast/current-onset choices, paired-offer callback, weighted frequencies ('+Math.round(commonCount/unknownSample.offers.length*100)+'% common unknown/'+Math.round(minorSample.offers.filter(e=>commonIds.has(e.mode.id)).length/minorSample.offers.length*100)+'% minor7), family filters, centred bright-point HUD and swept pickup guards.');
