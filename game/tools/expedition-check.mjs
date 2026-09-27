import assert from 'node:assert/strict';
import {PILOTS,ARTIFACTS,RHYTHMS,RUDIMENTS,MELODIES,MODES,NUMBER_OFFSETS,TONE_PROGRAMS,rhythmIdsForWorld,rudimentIdsForWorld,modeIdsForWorld,toneMission,toneAnswer,orderedTargets,gradeNumber,obstacleRow,touchesWall,turretThreat,createExpedition} from '../expedition.mjs';
import {THEME_ROOMS,themeMelodyIndices,themeRelatedCount,themeChallengeOptions} from '../theme-rooms.mjs';
assert.equal(PILOTS.length,4);
assert.equal(ARTIFACTS.length,13);
assert.equal(THEME_ROOMS.length,1);
const beatlesRoom=THEME_ROOMS[0],beatlesSet=themeMelodyIndices(beatlesRoom,MELODIES);
assert.equal(beatlesSet.related.length,9);assert.equal(beatlesSet.distractors.length,0);assert.deepEqual([0,1,2,3].map(level=>themeRelatedCount(beatlesRoom,level)),[6,6,6,6]);
const beatlesOptions=themeChallengeOptions(beatlesRoom,MELODIES,beatlesSet.related[0],6,()=>.42);
assert.equal(beatlesOptions.length,6);assert.equal(new Set(beatlesOptions).size,6);assert(beatlesOptions.every(index=>beatlesSet.related.includes(index)),'Yellow Submarine options must all be The Beatles');
for(let i=1;i<4;i++){assert(PILOTS[i].speed>PILOTS[i-1].speed);assert(PILOTS[i].obstacleGap<PILOTS[i-1].obstacleGap);}
for(let interval=1;interval<=12;interval++)for(const direction of ['up','down']){
  const c={kind:'numbers',interval,direction,collected:[]};
  for(const expected of orderedTargets(interval,direction)){
    const labels=Object.keys(NUMBER_OFFSETS).filter(k=>NUMBER_OFFSETS[k]===expected);
    for(const label of labels)assert(gradeNumber(c,label).correct,`${interval} ${direction}: ${label}`);
    const result=gradeNumber(c,labels[0]);assert.equal(result.complete,true);
  }
}
assert(gradeNumber({kind:'numbers',interval:7,direction:'up',collected:[]},'5').correct);
assert(!gradeNumber({kind:'numbers',interval:7,direction:'down',collected:[]},'1').correct);
for(let i=0;i<30;i++)for(const pilot of PILOTS){const walls=obstacleRow(i,480,pilot.obstacleGap);assert.equal(Math.round(walls[1].x-walls[0].w),Math.max(180,pilot.obstacleGap));assert(!touchesWall({x:(walls[0].w+walls[1].x)/2,y:-50},walls[0]));assert(touchesWall({x:2,y:-50},walls[0]));}
assert.equal(RHYTHMS.length,20);assert.equal(new Set(RHYTHMS.map(r=>r.name)).size,20);
assert.equal(MELODIES.length,350);assert.equal(new Set(MELODIES.map(m=>m.name.toLowerCase())).size,350);assert(MODES.filter(m=>m.level===0).length===7);assert(MODES.some(m=>m.name==='Bebop Dominant'));
for(const worldName of ['original','samsara'])for(let level=0;level<PILOTS.length;level++){
  const rhythmPool=rhythmIdsForWorld(worldName,level),rudimentPool=rudimentIdsForWorld(worldName,level),modePool=modeIdsForWorld(worldName,level);
  assert(rhythmPool.length>=2,`${worldName} rank ${level} needs a usable rhythm pool`);
  assert(rudimentPool.length>=2,`${worldName} rank ${level} needs a usable notated rhythm pool`);
  assert(modePool.length>=2,`${worldName} rank ${level} needs a usable mode pool`);
  if(level){
    assert(rhythmIdsForWorld(worldName,level-1).every(id=>rhythmPool.includes(id)));
    assert(rudimentIdsForWorld(worldName,level-1).every(id=>rudimentPool.includes(id)));
    assert(modeIdsForWorld(worldName,level-1).every(id=>modePool.includes(id)));
  }
}
assert.equal(new Set([...rhythmIdsForWorld('original',3),...rhythmIdsForWorld('samsara',3)]).size,rhythmIdsForWorld('original',3).length+rhythmIdsForWorld('samsara',3).length,'Rhythm repertoires must not leak between worlds');
assert.equal(new Set([...rudimentIdsForWorld('original',3),...rudimentIdsForWorld('samsara',3)]).size,rudimentIdsForWorld('original',3).length+rudimentIdsForWorld('samsara',3).length,'Notated rhythm repertoires must not leak between worlds');
assert.deepEqual(modeIdsForWorld('samsara',0).map(index=>MODES[index].name),['Ionian','Dorian','Phrygian','Lydian','Mixolydian','Aeolian','Locrian']);
assert(modeIdsForWorld('original',2).map(index=>MODES[index].name).includes('Bebop Dominant'));
assert(modeIdsForWorld('original',2).map(index=>MODES[index].name).includes('Dorian ♭2'));
assert(modeIdsForWorld('original',2).map(index=>MODES[index].name).includes('Ultra Locrian'));
assert(modeIdsForWorld('samsara',2).map(index=>MODES[index].name).includes('Hungarian Minor'));
assert(modeIdsForWorld('samsara',2).map(index=>MODES[index].name).includes('Hirajoshi Pentatonic'));
assert(!modeIdsForWorld('original',2).map(index=>MODES[index].name).includes('Hungarian Minor'));
assert.deepEqual(MODES.find(mode=>mode.name==='Dorian ♭2').notes,[0,1,3,5,7,9,10,12]);
assert.deepEqual(MODES.find(mode=>mode.name==='Lydian Augmented').notes,[0,2,4,6,8,9,11,12]);
assert.deepEqual(MODES.find(mode=>mode.name==='Hirajoshi Pentatonic').notes,[0,2,3,7,8,12]);
for(const pattern of RHYTHMS){assert(/^[\x00-\x7F–·]+$/.test(pattern.name));for(const e of pattern.events)assert(e.beat>=0&&e.beat<(pattern.beats||8));}
assert.deepEqual(RHYTHMS.find(r=>r.name==='Son Clave 3–2').events.map(e=>e.beat),[0,1.5,3,5,6]);
assert.deepEqual(TONE_PROGRAMS['7'].guide,['3','♭7']);
for(let level=0;level<4;level++)for(const quality of Object.keys(TONE_PROGRAMS))for(let i=0;i<40;i++){
  const mission=toneMission(quality,'color',Math.random,level);
  assert(mission.required.length>=1&&mission.required.length<=(level<=1?1:level===2?2:3));
  assert.equal(new Set(mission.required).size,mission.required.length);
  assert(TONE_PROGRAMS[quality].color.some(group=>mission.required.every(t=>group.includes(t))));
}
assert(toneAnswer({required:['3','♭7'],collected:['3']},'♭7').complete);
assert(!toneAnswer({required:['3','♭7'],collected:[]},'5').correct);
class El{constructor(){this.children=[];this.style={};this.dataset={};this.events={};this.classList={toggle(){}};}setAttribute(){}replaceChildren(...items){this.children=[...items];}append(b){this.children.push(b);}addEventListener(name,handler){this.events[name]=handler;}click(){if(!this.disabled)this.events.click?.({});}}
const dom=new Map(),document={getElementById:id=>{if(!dom.has(id))dom.set(id,new El());return dom.get(id);},createElement:()=>new El()};
const s={mode:'active',listening:false,health:1,score:0,energy:0,route:{key:0},bullets:[],capsule:null,capsuleTimer:0,player:{x:240,y:520},totalCleared:0,enemy:{chord:{offset:0,quality:'maj'}}};
const audio={pending:null,world:'original',setWorld(world){this.world=world;},stop(){this.pending=null;},artifactReveal(a,end){this.pending=end;},interval(root,b,c,end){this.lastRoot=root;this.pending=end;},guide(root,b,end){this.lastRoot=root;this.pending=end;},chordOnly(root,b,end){this.lastRoot=root;this.pending=end;},rhythm(a,end){this.pending=end;},poly(a,end){this.pending=end;},announce(a,end){this.pending=()=>end(true);},trumpetChord(a,b,end){this.pending=end;},melody(root,b,end,options){this.lastRoot=root;this.pending=end;this.melodyOptions=options;},scale(root,b,c,end){this.lastRoot=root;this.pending=end;}};
let healthHits=0;const recordedMistakes=[];
const world=createExpedition({onMistake:item=>recordedMistakes.push(item),s,audio,document,W:480,getH:()=>700,images:{},ctx:{},feedback(){},signal(){},burst(){},renderHud(){},syncPads(){},shipHit(){healthHits++;},playCue(){},degree:()=> 'I'});
for(const worldName of ['original','samsara'])for(let level=0;level<PILOTS.length;level++){
  s.planetChoice=worldName;world.reset(level);world.startChallenge('rhythm');
  let challenge=world.snapshot().special,pool=rhythmIdsForWorld(worldName,level);
  assert(pool.includes(challenge.target));assert(challenge.options.every(id=>pool.includes(id)));world.answerSpecial(challenge.target);
  world.reset(level);world.startChallenge('poly');challenge=world.snapshot().special;pool=rudimentIdsForWorld(worldName,level);
  assert(pool.includes(challenge.target));assert(challenge.options.every(id=>pool.includes(id)));world.answerSpecial(challenge.target);
  world.reset(level);world.startChallenge('mode');challenge=world.snapshot().special;pool=modeIdsForWorld(worldName,level);
  assert(pool.includes(challenge.target));assert(challenge.options.every(id=>pool.includes(id)));assert.equal(audio.world,worldName);assert(worldName==='samsara'?challenge.root<=49:challenge.root>=55);world.answerSpecial(challenge.target);
}
s.planetChoice='samsara';world.reset(0);world.startChallenge('melody');let samsaraMelody=world.snapshot().special;
assert.equal(audio.world,'samsara');assert.equal(samsaraMelody.root,(MELODIES[samsaraMelody.target].firstMidi??60)-12,'Samsara melody sits one octave below the source register');world.answerSpecial(samsaraMelody.target);assert.equal(audio.melodyOptions.from,MELODIES[samsaraMelody.target].preview);audio.pending();world.continueToneResult();
s.planetChoice='original';
world.reset(0);
world.startChallenge('chord');assert(s.listening);const target=world.snapshot().special.target;
const oldEnd=audio.pending;world.answerSpecial(target);assert.equal(s.health,5,'Answer during playback succeeds');assert.equal(audio.pending,null);assert(!world.busy);
world.startChallenge('melody');oldEnd();assert(s.listening,'Stale completion cannot stop new cue');let melodyChallenge=world.snapshot().special;world.answerSpecial(melodyChallenge.target);assert(world.busy);assert(audio.melodyOptions.full);assert.equal(audio.melodyOptions.from,MELODIES[melodyChallenge.target].preview,'Correct melody resumes after the preview');audio.pending();assert(world.snapshot().special.result,'Melody answer remains until acknowledgement');world.continueToneResult();assert(!world.busy);s.energy=0;
world.startChallenge('rhythm');assert([...dom.get('special-options').children].every(b=>!b.disabled));world.answerSpecial(world.snapshot().special.target);assert(world.invincible&&world.boosted);
world.reset(0);world.startChallenge('mode');assert.equal(world.snapshot().special.direction,'up','Novice modal challenge must ascend');audio.pending();
world.reset(1);world.startChallenge('mode');assert.equal(world.snapshot().special.direction,'up','Student modal challenge must ascend');audio.pending();
assert.equal(turretThreat(0,0).enabled,false);assert.equal(turretThreat(1,3).enabled,true);assert(turretThreat(3,12).max>turretThreat(1,3).max);assert(turretThreat(3,12).interval<turretThreat(1,3).interval);
world.reset(0);world.tick(18);assert.equal(world.snapshot().teachers.length,0,'Teachers no longer spawn in the first or third world');
s.health=1;s.maxHealth=5;world.startChallenge('guide');const guide=world.snapshot().special.target;audio.pending();world.collectNumber(guide);assert(world.invincible);assert.equal(s.health,2,'Guide-tone success repairs one HP');
world.reset(2);world.startChallenge('numbers');assert(world.pausedCombat&&!world.scenePaused,'Short truce protects the pilot without freezing the scene');const numeric=world.snapshot().special,numericCue=audio.pending;
assert(world.pausedCombat,'Opening listening truce freezes incoming fire');assert.equal(world.showScene,false,'Listening truce must not draw an unrelated musician scene');
for(const expected of orderedTargets(numeric.interval,numeric.direction)){world.collectNumber(Object.keys(NUMBER_OFFSETS).find(k=>NUMBER_OFFSETS[k]===expected));}
assert(!world.busy,'A known cube answer may be collected before playback ends');assert.equal(s.energy,30);numericCue();assert(!world.busy,'Stale early-answer cue cannot reopen the challenge');
const openArtifact=type=>{world.artifact(type);assert.equal(world.snapshot().special.kind,'reveal');assert(world.activateArtifact());const finish=audio.pending;assert(finish);finish();};
// Replay/resume during a crate or roulette must not send an undefined rhythm
// into the audio engine or leave listening stuck before the real question.
world.reset(1);s.listening=false;world.artifact(4);
const rhythmBefore=audio.rhythm;let transitionRhythms=0;
audio.rhythm=(pattern,end)=>{assert(pattern,'A rhythm must have a pattern');transitionRhythms++;rhythmBefore(pattern,end);};
world.replay();assert(!s.listening);assert.equal(transitionRhythms,0);
world.activateArtifact();const revealFinish=audio.pending;
world.replay();assert.equal(audio.pending,revealFinish,'Do not cancel reveal sound');
revealFinish();assert.equal(world.snapshot().special.kind,'roulette');
world.replay();assert(!s.listening);assert.equal(transitionRhythms,0);
world.reset(1);s.listening=false;world.artifact(4);world.activateArtifact();
audio.stop();s.mode='paused';s.listening=false;s.mode='active';world.resumeChallenge();
assert(audio.pending,'Resume restores the cancelled opening callback');audio.pending();
assert.equal(world.snapshot().special.kind,'roulette');
audio.rhythm=rhythmBefore;
world.reset(0);openArtifact(1);assert.equal(world.snapshot().special.kind,'melody');audio.pending();world.answerSpecial(world.snapshot().special.target);assert(world.scenePaused);audio.pending();assert(world.cloaked);world.continueToneResult();world.artifact(3);assert.equal(world.snapshot().special,null,'Overdrive applies without opening an unrelated character scene');assert(world.invincible);
const frozen=JSON.stringify(world.snapshot());s.mode='paused';world.tick(10);assert.equal(JSON.stringify(world.snapshot()),frozen);
s.mode='active';world.reset(0);world.startChallenge('rhythm');audio.pending();const roomBefore=JSON.stringify(world.snapshot());world.tick(40);assert.equal(JSON.stringify(world.snapshot()),roomBefore,'Rhythm field pause freezes flight and has no countdown');world.answerSpecial(world.snapshot().special.target);assert(!world.pausedCombat);
world.reset(0);assert.equal(world.snapshot().teachers.length,0);
world.reset(1);s.bookMission={chapter:4};s.totalCleared=1;world.afterHydra();assert.equal(world.snapshot().drops.length,1,'Book Flight must receive the same authored artifacts');assert.equal(world.snapshot().queue.length,0,'Book Flight does not insert the unrelated interval detour');s.bookMission=null;
world.reset(0);s.listening=false;world.tick(4);assert.equal(world.snapshot().walls.length,0,'Novice flight has no obstacles');
world.reset(2);world.startChallenge('numbers');assert(world.pausedCombat&&!world.scenePaused,'Short truce protects the pilot without freezing the scene');
assert.equal(world.snapshot().digits.filter(d=>gradeNumber(world.snapshot().special,d.label).correct).length,1);
audio.pending();world.collectNumber(world.snapshot().digits.find(d=>!gradeNumber(world.snapshot().special,d.label).correct).label);assert(world.snapshot().special.result,'Wrong cube answer remains available for review');
let resultButtons=dom.get('special-options').children;assert.equal(resultButtons.length,2);resultButtons[0].click();assert(s.listening&&audio.pending,'Wrong cube answer can be replayed');audio.pending();resultButtons[1].click();assert(!world.busy);
world.startChallenge('numbers');const stale=audio.pending;world.artifact(10);assert.equal(world.snapshot().special.kind,'reveal');stale();assert.equal(world.snapshot().special.kind,'reveal','Old interval callback cannot dismiss artifact chamber');world.activateArtifact();audio.pending();assert.equal(world.snapshot().special.kind,'rhythm');
openArtifact(4);assert.equal(world.snapshot().special.kind,'roulette');assert(world.pausedCombat);assert.equal(world.snapshot().digits.length,0);world.reset(0);
openArtifact(6);assert.equal(world.snapshot().special.kind,'poly');audio.pending();world.answerSpecial(world.snapshot().special.target);assert(world.invincible);
openArtifact(7);assert.equal(world.snapshot().special.kind,'flightTones');audio.pending();audio.pending();const trumpet=world.snapshot().special;assert(['basic','guide','all'].includes(trumpet.toneMode));for(const note of trumpet.required)world.collectFlightTone(note);assert(world.snapshot().special.result);world.continueToneResult();assert(!world.busy);assert(world.invincible&&world.boosted);
openArtifact(11);assert.equal(world.snapshot().special.kind,'tones');audio.pending();audio.pending();const tone=world.snapshot().special;assert.equal(tone.toneMode,'color');for(const label of tone.required)world.toggleToneChoice(label);assert.deepEqual(new Set(world.snapshot().special.selected),new Set(tone.required));world.answerToneSet();assert(world.snapshot().special.result);world.continueToneResult();assert(!world.busy);assert(world.invincible&&world.boosted);
openArtifact(8);assert.equal(world.snapshot().special.kind,'melody');audio.pending();world.answerSpecial(world.snapshot().special.target);assert(world.scenePaused);audio.pending();assert(world.snapshot().special.result);world.continueToneResult();assert(!world.busy);
world.grantMelodyFocus();openArtifact(12);const songRoom=world.snapshot().special;assert.equal(songRoom.kind,'melody');assert.equal(songRoom.themeRoom,'beatles-yellow-submarine');assert.equal(songRoom.options.length,6);assert(songRoom.options.every(index=>beatlesSet.related.includes(index)));audio.pending();assert(world.useMelodyFocus());assert.equal(world.snapshot().special.options.length,3);assert(world.snapshot().special.options.includes(songRoom.target));world.answerSpecial(songRoom.target);assert.equal(audio.melodyOptions.from,MELODIES[songRoom.target].preview,'Yellow Submarine continues after its preview');audio.pending();assert(world.snapshot().special.result);world.continueToneResult();assert(!world.busy);
let previousBeatles=songRoom.target;
for(let i=0;i<16;i++){
  openArtifact(12);const nextRoom=world.snapshot().special;
  assert.notEqual(nextRoom.target,previousBeatles,'Yellow Submarine must not repeat a melody immediately');
  assert(nextRoom.options.every(index=>beatlesSet.related.includes(index)),'Every Yellow Submarine choice must be The Beatles');
  previousBeatles=nextRoom.target;audio.pending();world.answerSpecial(nextRoom.target);audio.pending();world.continueToneResult();
}
openArtifact(9);assert.equal(world.snapshot().special.kind,'mode');audio.pending();world.answerSpecial(world.snapshot().special.target);assert(!world.busy);
world.artifact(5);assert.equal(world.snapshot().rhythmFocus,1);assert(!world.busy,'Zildjian stores a hint instead of starting the rhythm challenge');
openArtifact(10);assert.equal(world.snapshot().special.kind,'rhythm');audio.pending();const beforeFocus=world.snapshot().special.options.length;assert(world.useRhythmFocus());assert(world.snapshot().special.options.length<beforeFocus);assert(world.snapshot().special.options.includes(world.snapshot().special.target));assert.equal(world.snapshot().rhythmFocus,0);
world.reset(3);s.mode='active';s.listening=false;
for(const kind of ['chord','rhythm','poly','melody','mode']){
  world.reset(3);s.listening=false;world.startChallenge(kind);assert(s.listening);
  const c=world.snapshot().special,wrong=c.options.find(v=>v!==c.target),end=audio.pending;
  const recordedBefore=recordedMistakes.length;world.answerSpecial(wrong);assert.equal(recordedMistakes.length,recordedBefore+1);assert.equal(recordedMistakes.at(-1).kind,kind);assert.equal(recordedMistakes.at(-1).target,c.target);assert.equal(world.snapshot().special.misses,1);assert(s.listening,'First miss must not interrupt or reveal the cue');
  s.mode='paused';world.answerSpecial(c.target);assert(world.busy,'Paused answer ignored');s.mode='active';
  world.answerSpecial(c.target);if(kind==='melody'){assert(world.scenePaused);audio.pending();assert(world.snapshot().special.result);world.continueToneResult();}assert(!world.busy);assert(!s.listening);assert.equal(audio.pending,null);
  const score=s.score;world.answerSpecial(c.target);assert.equal(s.score,score,'Double submission must not reward twice');
  world.startChallenge('rhythm');end();assert(s.listening,'Stale completion must not unlock next challenge');
}
world.reset(0);s.listening=false;world.startChallenge('melody');assert(world.answerSpoken(MELODIES[world.snapshot().special.target].name));assert(world.scenePaused);audio.pending();assert(world.snapshot().special.result);world.continueToneResult();assert(!world.busy);
for(const m of MELODIES){assert(m.events.length>=12);assert(m.preview>0&&m.preview<=m.events.length);assert(m.events.every(([note,beats])=>(note===null||Number.isFinite(note))&&beats>0));}
world.reset(1);world.startChallenge('melody');const excerptEnd=audio.pending;
world.answerSpecial(world.snapshot().special.target);const fullEnd=audio.pending;
excerptEnd();assert(s.listening,'Stale excerpt completion cannot stop the full performance');
assert.equal(dom.get('special-options').children.length,1,'Correct answer replaces quiz with a deliberate continue action');
const concertBefore=JSON.stringify(world.snapshot());world.tick(90);assert.equal(JSON.stringify(world.snapshot()),concertBefore,'Long performance freezes the entire encounter');
world.replay();assert(audio.melodyOptions.full,'Replay during reward repeats the full head');fullEnd();assert(world.busy,'Old full callback cannot reward after replay');
audio.stop();s.mode='paused';world.tick(10);s.mode='active';world.resumeChallenge();assert(audio.melodyOptions.full,'Pause resumes full performance');
const resumedEnd=audio.pending;world.artifact(6);assert.equal(world.snapshot().special.kind,'melody','Another relic waits until the theme finishes');
resumedEnd();assert(world.snapshot().special.result);world.continueToneResult();assert.equal(world.snapshot().special.kind,'reveal');assert.equal(world.snapshot().special.artifactType,6);const rewarded=s.score;resumedEnd();assert.equal(s.score,rewarded);
world.reset(1);const rotation=new Set();let previousMelody=-1;for(let i=0;i<220;i++){world.startChallenge('melody');const currentMelody=world.snapshot().special.target;assert.notEqual(currentMelody,previousMelody,'General melody deck must not repeat immediately');previousMelody=currentMelody;rotation.add(currentMelody);world.answerSpecial(currentMelody);audio.pending();world.continueToneResult();}assert.equal(rotation.size,100,'Student rotation stays inside the 100-theme mixed level pool');
assert.equal(RUDIMENTS.length,16);
for(const r of RUDIMENTS){assert.equal(r.events.length,r.sticking.length);assert(r.events.some(e=>e.velocity===1));assert(r.events.some(e=>e.velocity<1));}
for(const worldName of ['original','samsara']){
  const patterns=rudimentIdsForWorld(worldName,3).map(index=>RUDIMENTS[index]);
  const signatures=patterns.map(r=>Array.from({length:96},(_,i)=>r.events[i%r.events.length].velocity).join(','));
  assert.equal(new Set(signatures).size,patterns.length,`${worldName} choices must sound different, not differ only in hand labels`);
}

// Sequence, partial credit, readable results, and a safe route with thinking time.
world.reset(1);s.listening=false;s.health=1;s.energy=0;world.startChallenge('flightTones');
const c=world.snapshot().special;audio.pending();audio.pending();c.truceUntil=0;
const positions=world.snapshot().digits.map(d=>[d.x,d.y]);
world.tick(8);assert.equal(world.snapshot().walls.length,0);assert.equal(world.snapshot().turrets.length,0);assert.equal(world.snapshot().teachers.length,0);
assert.deepEqual(world.snapshot().digits.map(d=>[d.x,d.y]),positions,'Cubes hold their positions while player thinks');
const correctFirst=c.required[0];world.collectFlightTone(correctFirst);const afterFirst=s.score;
world.collectFlightTone('not a note');assert.equal(world.snapshot().special.result.fraction,1/c.required.length);
assert(Math.abs(s.health-(1+1/c.required.length))<.00001);assert(s.energy>0);
const paid=s.score;world.collectFlightTone(correctFirst);world.answerToneSet();assert.equal(s.score,paid,'Result cannot pay twice');
world.tick(100);assert(world.snapshot().special.result,'Result waits for continuation');world.continueToneResult();
world.reset(3);s.listening=false;s.health=1;s.energy=0;world.startChallenge('tones');audio.pending();audio.pending();
const colors=world.snapshot().special;colors.required=['9','13'];world.toggleToneChoice('9');world.answerToneSet();assert.equal(world.snapshot().special.result.fraction,.5);assert.equal(s.health,1.5);world.continueToneResult();
world.reset(3);s.listening=false;s.health=1;s.energy=0;world.startChallenge('tones');audio.pending();audio.pending();world.snapshot().special.required=['9','13'];world.toggleToneChoice('9');world.toggleToneChoice('♭9');world.answerToneSet();assert.equal(world.snapshot().special.result.fraction,.3,'One correct and one wrong tone receives penalized partial credit');assert.equal(s.health,1.3);world.continueToneResult();
world.reset(1);s.listening=false;let spoken=0;const announce=audio.announce;audio.announce=(...args)=>{spoken++;announce.apply(audio,args);};world.startChallenge('flightTones');audio.pending();audio.pending();world.replay();audio.pending();assert.equal(spoken,1,'Replay is music only');audio.announce=announce;
console.log('Expedition checks passed: interval and chord-tone capture, musician relics, Zildjian rhythm focus, modal, melody and rhythm scenes.');
