import assert from 'node:assert/strict';
import {PILOTS,RHYTHMS,RUDIMENTS,MELODIES,MODES,NUMBER_OFFSETS,TONE_PROGRAMS,toneMission,toneAnswer,orderedTargets,gradeNumber,obstacleRow,touchesWall,createExpedition} from '../expedition.mjs';
assert.equal(PILOTS.length,4);
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
for(let i=0;i<30;i++)for(const pilot of PILOTS){const walls=obstacleRow(i,480,pilot.obstacleGap);assert.equal(Math.round(walls[1].x-walls[0].w),pilot.obstacleGap);assert(!touchesWall({x:(walls[0].w+walls[1].x)/2,y:-50},walls[0]));assert(touchesWall({x:2,y:-50},walls[0]));}
assert.equal(RHYTHMS.length,20);assert.equal(new Set(RHYTHMS.map(r=>r.name)).size,20);
assert(MELODIES.length>=4);assert(MODES.filter(m=>m.level===0).length===7);assert(MODES.some(m=>m.name==='Bebop Dominant'));
for(const pattern of RHYTHMS){assert(/^[\x00-\x7F–·]+$/.test(pattern.name));for(const e of pattern.events)assert(e.beat>=0&&e.beat<(pattern.beats||8));}
assert.deepEqual(RHYTHMS.find(r=>r.name==='Son Clave 3–2').events.map(e=>e.beat),[0,1.5,3,5,6]);
assert.deepEqual(TONE_PROGRAMS['7'].guide,['3','♭7']);
assert.deepEqual(toneMission('7','color',()=>0).required,['9','♯11','13']);
assert(toneAnswer({required:['3','♭7'],collected:['3']},'♭7').complete);
assert(!toneAnswer({required:['3','♭7'],collected:[]},'5').correct);
class El{constructor(){this.children=[];this.style={};}replaceChildren(){this.children=[];}append(b){this.children.push(b);}addEventListener(){}}
const dom=new Map(),document={getElementById:id=>{if(!dom.has(id))dom.set(id,new El());return dom.get(id);},createElement:()=>new El()};
const s={mode:'active',listening:false,health:1,score:0,energy:0,route:{key:0},bullets:[],capsule:null,capsuleTimer:0,player:{x:240,y:520},totalCleared:0,enemy:{chord:{offset:0,quality:'maj'}}};
const audio={pending:null,stop(){this.pending=null;},interval(a,b,c,end){this.pending=end;},guide(a,b,end){this.pending=end;},chordOnly(a,b,end){this.pending=end;},rhythm(a,end){this.pending=end;},poly(a,end){this.pending=end;},announce(a,end){this.pending=end;},trumpetChord(a,b,end){this.pending=end;},melody(a,b,end){this.pending=end;},scale(a,b,c,end){this.pending=end;}};
let healthHits=0;
const world=createExpedition({s,audio,document,W:480,getH:()=>700,images:{},ctx:{},feedback(){},signal(){},burst(){},renderHud(){},syncPads(){},shipHit(){healthHits++;},playCue(){},degree:()=> 'I'});
world.reset(0);
world.startChallenge('chord');assert(s.listening);const target=world.snapshot().special.target;
const oldEnd=audio.pending;world.answerSpecial(target);assert.equal(s.health,5,'Answer during playback succeeds');assert.equal(audio.pending,null);assert(!world.busy);
world.startChallenge('melody');oldEnd();assert(s.listening,'Stale completion cannot stop new cue');world.answerSpecial(world.snapshot().special.target);assert(!world.busy);s.energy=0;
world.startChallenge('rhythm');assert([...dom.get('special-options').children].every(b=>!b.disabled));world.answerSpecial(world.snapshot().special.target);assert(world.invincible&&world.boosted);
world.reset(0);world.startChallenge('mode');assert.equal(world.snapshot().special.direction,'up','Novice modal challenge must ascend');audio.pending();
world.reset(0);world.spawnTeacher();assert.equal(world.snapshot().teachers.length,1);
world.startChallenge('guide');const guide=world.snapshot().special.target;audio.pending();world.collectNumber(guide);assert(world.snapshot().teachers.every(t=>t.hp===0));assert(world.invincible);
world.reset(2);world.startChallenge('numbers');const numeric=world.snapshot().special;audio.pending();
for(const expected of orderedTargets(numeric.interval,numeric.direction)){world.collectNumber(Object.keys(NUMBER_OFFSETS).find(k=>NUMBER_OFFSETS[k]===expected));}
assert(!world.busy);assert.equal(s.energy,30);
world.reset(0);world.artifact(1);assert.equal(world.snapshot().special.kind,'melody');audio.pending();world.answerSpecial(world.snapshot().special.target);assert(world.cloaked);world.artifact(3);assert(world.invincible);
const frozen=JSON.stringify(world.snapshot());s.mode='paused';world.tick(10);assert.equal(JSON.stringify(world.snapshot()),frozen);
s.mode='active';world.reset(0);world.startChallenge('rhythm');audio.pending();const roomBefore=JSON.stringify(world.snapshot());world.tick(40);assert.equal(JSON.stringify(world.snapshot()),roomBefore,'Rhythm field pause freezes flight and has no countdown');world.answerSpecial(world.snapshot().special.target);assert(!world.pausedCombat);
world.reset(0);for(let i=0;i<5;i++)world.spawnTeacher();assert.deepEqual(world.snapshot().teachers.map(t=>t.type),[0,1,2,3,4]);assert.deepEqual(world.snapshot().teachers.slice(0,4).map(t=>t.edge),[0,1,2,3]);
world.reset(0);s.listening=false;world.tick(4);assert.equal(world.snapshot().walls.length,0,'Novice flight has no obstacles');
world.reset(2);world.startChallenge('numbers');
assert.equal(world.snapshot().digits.filter(d=>gradeNumber(world.snapshot().special,d.label).correct).length,1);
audio.pending();world.collectNumber(world.snapshot().digits.find(d=>!gradeNumber(world.snapshot().special,d.label).correct).label);assert(!world.busy,'Wrong number loses the attempt');
world.startChallenge('numbers');const stale=audio.pending;world.artifact(10);assert.equal(world.snapshot().special.kind,'rhythm');stale();assert(s.listening,'Old interval callback cannot unlock new cue');
world.artifact(4);assert.equal(world.snapshot().special.kind,'chord');assert.equal(world.snapshot().digits.length,0);
world.artifact(6);assert.equal(world.snapshot().special.kind,'poly');audio.pending();world.answerSpecial(world.snapshot().special.target);assert(world.invincible);
world.artifact(7);assert.equal(world.snapshot().special.kind,'tones');audio.pending();audio.pending();const tone=world.snapshot().special;for(const label of tone.required)world.collectTone(label);assert(!world.busy);assert(world.invincible&&world.boosted);
world.artifact(8);assert.equal(world.snapshot().special.kind,'melody');audio.pending();world.answerSpecial(world.snapshot().special.target);assert(!world.busy);
world.artifact(9);assert.equal(world.snapshot().special.kind,'mode');audio.pending();world.answerSpecial(world.snapshot().special.target);assert(!world.busy);
world.artifact(5);assert.equal(world.snapshot().rhythmFocus,1);assert(!world.busy,'Zildjian stores a hint instead of starting the rhythm challenge');
world.artifact(10);assert.equal(world.snapshot().special.kind,'rhythm');audio.pending();const beforeFocus=world.snapshot().special.options.length;assert(world.useRhythmFocus());assert(world.snapshot().special.options.length<beforeFocus);assert(world.snapshot().special.options.includes(world.snapshot().special.target));assert.equal(world.snapshot().rhythmFocus,0);
world.reset(3);s.mode='active';s.listening=false;
for(const kind of ['chord','rhythm','poly','melody','mode']){
  world.reset(3);s.listening=false;world.startChallenge(kind);assert(s.listening);
  const c=world.snapshot().special,wrong=c.options.find(v=>v!==c.target),end=audio.pending;
  world.answerSpecial(wrong);assert.equal(world.snapshot().special.misses,1);assert(s.listening,'First miss must not interrupt or reveal the cue');
  s.mode='paused';world.answerSpecial(c.target);assert(world.busy,'Paused answer ignored');s.mode='active';
  world.answerSpecial(c.target);assert(!world.busy);assert(!s.listening);assert.equal(audio.pending,null);
  const score=s.score;world.answerSpecial(c.target);assert.equal(s.score,score,'Double submission must not reward twice');
  world.startChallenge('rhythm');end();assert(s.listening,'Stale completion must not unlock next challenge');
}
world.reset(0);s.listening=false;world.startChallenge('melody');assert(world.answerSpoken(MELODIES[world.snapshot().special.target].name));assert(!world.busy);
for(const m of MELODIES){assert.equal(m.notes.length,m.beats.length);assert(m.beats.every(b=>b>0));}
assert.equal(RUDIMENTS.length,8);
for(const r of RUDIMENTS){assert.equal(r.events.length,r.sticking.length);assert(r.events.some(e=>e.velocity===1));assert(r.events.some(e=>e.velocity<1));}
const signatures=RUDIMENTS.map(r=>Array.from({length:96},(_,i)=>r.events[i%r.events.length].velocity).join(','));
assert.equal(new Set(signatures).size,RUDIMENTS.length,'Choices must sound different, not differ only in hand labels');
console.log('Expedition checks passed: interval and chord-tone capture, musician relics, Zildjian rhythm focus, modal, melody and rhythm scenes.');
