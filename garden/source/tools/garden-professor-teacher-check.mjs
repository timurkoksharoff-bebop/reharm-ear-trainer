import assert from 'node:assert/strict';
import {GardenProfessorTeacher,gardenProfessorLesson} from '../garden-professor-teacher.mjs';
import {GARDEN_MODES,gardenModeById,gardenModeVerdict} from '../garden-modes.mjs';
import {difficultyProfile} from '../garden-difficulty.mjs';
let saved;const storage={getItem:()=>saved,setItem:(k,v)=>saved=v};const t=new GardenProfessorTeacher({storage});
const chord={offset:0,quality:'maj7'};
t.beginFlight('test');
for(let i=0;i<269;i++)t.record({id:'ionian',chord,verdict:'invalid',position:0});
assert.equal(t.data.modes.ionian.bad,1);assert.equal(t.report().length,0);
for(let i=1;i<3;i++){t.beginFlight('test');t.record({id:'ionian',chord,verdict:'invalid',position:i});}
assert.equal(t.report().length,1);
for(let i=0;i<3;i++){t.beginFlight('test');t.record({id:'ionian',chord,verdict:'compatible',position:i});}
assert.equal(t.report().length,0);
for(const id of ['ionian','dorian'])for(let i=0;i<12;i++){t.beginFlight('lesson');t.record({id,chord,verdict:'compatible',position:i%4});}
assert(t.stage()>=1);assert(t.weight(gardenModeById('melodic-minor'))>new GardenProfessorTeacher().weight(gardenModeById('melodic-minor')));
assert.equal(new GardenProfessorTeacher({storage}).stage(),t.stage());
assert.equal(t.recommendation([chord],[]),null);
// Random lessons rotate independently of the flight's adaptive weighting.
let lessonSaved;const lessonStorage={getItem:()=>lessonSaved,setItem:(k,v)=>lessonSaved=v};
const lessons=new GardenProfessorTeacher({storage:lessonStorage,random:()=>0});
const cycle=GARDEN_MODES.map(()=>lessons.randomLesson());
assert.equal(new Set(cycle).size,GARDEN_MODES.length,'each topic gets a turn before the pool repeats');
const last=cycle.at(-1),reloadedLessons=new GardenProfessorTeacher({storage:lessonStorage,random:()=>.999});
assert.notEqual(reloadedLessons.randomLesson(),last,'a new cycle and reload do not repeat the previous topic');
const stable=JSON.stringify(reloadedLessons.data);reloadedLessons.snapshot();reloadedLessons.snapshot();
assert.equal(JSON.stringify(reloadedLessons.data),stable,'snapshot reads do not consume random lesson topics');
assert.equal(reloadedLessons.randomLesson([chord],[]),null,'no enabled families means no preflight lesson');
const context=[{offset:0,quality:'m7'},{offset:7,quality:'7'}],families=['major','melodic'];
const expected=GARDEN_MODES.filter(m=>families.includes(m.family)&&context.some(c=>gardenModeVerdict(c,m).verdict==='compatible')).map(m=>m.id);
const contextual=new GardenProfessorTeacher({random:()=>.47}),topics=expected.map(()=>contextual.randomLesson(context,families));
assert.deepEqual(new Set(topics),new Set(expected),'every route-compatible selected-family lesson rotates through the pool');
let previous=topics.at(-1);for(let i=0;i<expected.length*2;i++){const id=contextual.randomLesson(context,families);assert.notEqual(id,previous,'no consecutive repeat while alternatives exist');assert(expected.includes(id));previous=id;}
// A previously reviewed topic must still be available after its rotation.
for(const id of expected)contextual.lessonSeen(id);
assert(expected.includes(contextual.randomLesson(context,families)));
for(let i=0;i<3;i++){t.beginFlight('answers');t.record({kind:'answer',id:'quality:maj',chord,position:i,verdict:'wrong',reason:'quality'});}
assert(t.report().some(r=>r.kind==='answer'));
for(let i=0;i<3;i++){t.beginFlight('answers');t.record({kind:'answer',id:'quality:maj7',chord,position:i,verdict:'correct',reason:'quality'});}
assert(!t.report().some(r=>r.kind==='answer'));
const count=t.data.modes.ionian.good;
t.record({id:'ionian',chord,verdict:'compatible',position:8,boundary:true});t.record({id:'ionian',chord,verdict:'neutral',position:9});assert.equal(t.data.modes.ionian.good,count);
for(const mode of GARDEN_MODES){const lesson=gardenProfessorLesson(mode);assert(lesson.example.tones.length>=3);assert(lesson.advice[0]&&lesson.advice[1]);assert(t.weight(mode)>0);}
assert(Math.abs(difficultyProfile('professor').timeScale/difficultyProfile('hard').timeScale-.97)<1e-9);
assert.equal(difficultyProfile('hard').timeScale,1.07);
console.log('PASS random contextual lessons/no consecutive repeats/persisted rotation, adaptive teacher: dedupe 269 repeated pickups, recurring patterns/recovery, neutral and boundary exclusions, mastery, gradual weights, persistence, 41 lesson cards and Professor −3%.');
