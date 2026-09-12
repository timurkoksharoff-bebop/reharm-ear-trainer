import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {BOOK_ROUTES,DEGREES,SECTORS,QUALITIES,INTERVALS,createRoute,createBookRoute,bookRoutesForChapter,bookReferenceEvents,cueEvents,progressionEvents,answerResult,family,routeQualities} from '../music.mjs';
import {createCapsule,capsuleOutcome,intervalCue} from '../intervals.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const canonical=fs.readFileSync(root+'app.js','utf8');
for(const route of BOOK_ROUTES){
  const start=canonical.indexOf(`id: "${route.id}"`);assert(start>=0);
  const section=canonical.slice(start,canonical.indexOf('distractors:',start));
  const sequence=[...section.matchAll(/chord\("([^"]+)",\s*(\d+),\s*"([^"]+)"\)/g)].map(([,degree,offset,quality])=>({degree,offset:Number(offset),quality}));
  assert.deepEqual(route.sequence,sequence,`${route.id}: canonical catalog changed`);
  assert(section.includes(route.source));
}
for(let sector=0;sector<4;sector++){
  let previous=-1;
  for(let n=0;n<100;n++){
    const route=createRoute(sector,previous,Math.random,n);assert.notEqual(route.key,previous);previous=route.key;
    assert.equal(route.sequence.length,4);
    for(const chord of route.sequence){
      assert(SECTORS[sector].degrees.includes(chord.offset));assert(DEGREES[chord.offset]);
      if(sector>=2)assert(SECTORS[sector].qualities.includes(family(chord.quality)));
      const cue=cueEvents(route,chord,sector),home=cue.events[0],target=cue.events[1];
      assert(target.at-home.at-home.duration>=.3,'Reference must end before a real silence');
      if(sector<2)assert.equal(target.notes[0]-home.notes[0],chord.offset,'Degree remains relative to tonic');
      assert(cue.events.every(e=>e.duration>0&&e.at+e.duration<cue.duration));
      if(sector>=2){
        assert.equal(cue.events.length,2,'Chord sectors use one vertical target, without an isolated intermediate note');
        const root=home.notes[0]+chord.offset,actual=[...new Set(target.notes.map(note=>((note-root)%12+12)%12))].sort((a,b)=>a-b);
        assert.deepEqual(actual,[...new Set(INTERVALS[chord.quality].map(n=>n%12))].sort((a,b)=>a-b),'Every chord tone must survive articulation and spacing');
      }
    }
  }
}
for(let chapter=1;chapter<=16;chapter++){
  const routes=bookRoutesForChapter(chapter);assert(routes.length>0);
  for(let index=0;index<routes.length;index++){
    const route=createBookRoute(chapter,index,-1,()=>.2);assert.equal(route.chapter,chapter);assert.equal(route.sequence.length,routes[index].sequence.length);assert.match(route.code,new RegExp(`^C${String(chapter).padStart(2,'0')}·`));
    const first=progressionEvents(route,0),later=progressionEvents(route,Math.min(4,route.sequence.length-1)),finale=progressionEvents(route,route.sequence.length-1,true);
    assert.equal(first.events[0].part,'home');assert.equal(first.events.at(-1).part,'target');assert(later.events.length<=4);assert.equal(finale.events.length,route.sequence.length);
    assert([...first.events,...later.events,...finale.events].every(event=>event.notes.length>=3),'Book chords must be vertical');
    const reference=bookReferenceEvents(route,Math.min(1,route.sequence.length-1));
    assert.deepEqual(reference.events.map(event=>event.part),['home','target']);
    assert.equal(reference.events[0].notes.length,1,'Space reference HOME must be one note');
    assert(reference.events[1].notes.length>=4,'Space reference target must be a vertical chord');
  }
}
const chord={offset:9,quality:'m7'},full={bass:false,quality:false};
let result=answerResult(chord,full,'bass',9);assert(result.correct&&!result.destroyed);
assert.deepEqual(answerResult(chord,result.shields,'quality','maj').shields,result.shields,'Wrong type must not restore bass shield');
assert(answerResult(chord,result.shields,'bass',9).ignored,'Repeated correct input must not farm rewards');
assert(answerResult(chord,result.shields,'quality','m7').destroyed);
result=answerResult(chord,full,'quality','m7');assert(result.correct&&!result.destroyed);
assert(answerResult(chord,result.shields,'bass',9).destroyed,'Both recognition orders must work');
assert(answerResult({...chord,bassOffset:0},full,'bass',0).correct,'Independent bass is distinct from root');
for(const path of ['index.html','game.css','game.js','audio.mjs','assets/hydra.png','assets/ship.png','assets/terrain.png','assets/drone.png','assets/teachers-v2.png','intervals.mjs','serve.py'])assert(fs.statSync(root+'game/'+path).size>0);

for(const [id,intervals] of Object.entries(INTERVALS)){
  const line=canonical.split('\n').find(l=>l.trimStart().startsWith(`${id}: { suffix:`)||l.trimStart().startsWith(`"${id}": { suffix:`));
  assert(line,`Missing canonical quality ${id}`);
  assert.deepEqual(intervals,JSON.parse(line.match(/intervals: (\[[^\]]+\])/)[1]),id);
  assert(QUALITIES[id]);
}
// A complete shuffle bag covers every root/type without replacement.
const pairs=new Set();
for(let n=0;n<132;n++)for(const chord of createRoute(3,-1,Math.random,n,3).sequence){
  pairs.add(`${chord.offset}:${chord.quality}`);
  assert(answerResult(chord,full,'quality',chord.quality).correct);
}
assert(pairs.size===264,'Random flight must cover the full harmonic pool, not a few fixed phrases');
for(let sector=0;sector<3;sector++){
 const routes=Array.from({length:60},(_,n)=>createRoute(sector,-1,Math.random,n));
 assert(new Set(routes.map(r=>r.sequence.map(c=>`${c.offset}:${c.quality}`).join(','))).size>3,'More than three stock phrases');
 assert(routes.every(r=>r.id==='random-signals'));
}
assert.equal(routeQualities(2,0).length,11,'Master must begin without altered/two-extension voicings');
assert(!routeQualities(2,0).includes('7b9b13'));
assert(routeQualities(2,2).includes('7b9')&&!routeQualities(2,2).includes('7b9b13'),'Single alterations enter in the middle of Master');
assert(routeQualities(2,5).includes('7b9b13'),'Double alterations enter only after five Master routes');
assert.equal(routeQualities(3,0).length,22,'Legend keeps the full quality bank');
assert(!answerResult({offset:4,quality:'m7'},full,'quality','maj7').correct);
assert(!answerResult({offset:0,quality:'6'},full,'quality','maj').correct);
for(let sector=0;sector<4;sector++)for(let n=0;n<100;n++){
  const c=createCapsule(sector),outcome=capsuleOutcome(c),cue=intervalCue(60,c.heard,c.mode);
  assert.equal(outcome.correct,c.heard===c.wanted);
  assert.equal(outcome.energy,outcome.correct?{up:20,down:30,together:40}[c.mode]:-20);
  const notes=cue.events.flatMap(e=>e.notes);assert.equal(Math.abs(notes[1]-notes[0]),c.heard);
  assert(cue.events.every(e=>e.at+e.duration<cue.duration));
  if(c.mode==='down')assert(notes[0]>notes[1]);
  if(c.mode==='up')assert(notes[0]<notes[1]);
  if(c.mode==='together')assert.equal(cue.events.length,1);
}
console.log('Game checks passed: exact book routes and 22 canonical voicings, 400 transposed phrases, 264 independent root/type pairs, exact grading, interval rewards/articulation, assets.');
