import assert from 'node:assert/strict';
import {GardenProfessorTeacher,gardenProfessorLesson} from '../garden-professor-teacher.mjs';
import {GARDEN_MODES,gardenModeById} from '../garden-modes.mjs';
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
for(let i=0;i<3;i++){t.beginFlight('answers');t.record({kind:'answer',id:'quality:maj',chord,position:i,verdict:'wrong',reason:'quality'});}
assert(t.report().some(r=>r.kind==='answer'));
for(let i=0;i<3;i++){t.beginFlight('answers');t.record({kind:'answer',id:'quality:maj7',chord,position:i,verdict:'correct',reason:'quality'});}
assert(!t.report().some(r=>r.kind==='answer'));
const count=t.data.modes.ionian.good;
t.record({id:'ionian',chord,verdict:'compatible',position:8,boundary:true});t.record({id:'ionian',chord,verdict:'neutral',position:9});assert.equal(t.data.modes.ionian.good,count);
for(const mode of GARDEN_MODES){const lesson=gardenProfessorLesson(mode);assert(lesson.example.tones.length>=3);assert(lesson.advice[0]&&lesson.advice[1]);assert(t.weight(mode)>0);}
assert(Math.abs(difficultyProfile('professor').timeScale/difficultyProfile('hard').timeScale-.97)<1e-9);
assert.equal(difficultyProfile('hard').timeScale,1.07);
console.log('PASS adaptive teacher: dedupe 269 repeated pickups, recurring patterns/recovery, neutral and boundary exclusions, mastery, gradual weights, persistence, 41 lesson cards and Professor −3%.');
