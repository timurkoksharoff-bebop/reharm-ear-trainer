import assert from 'node:assert/strict';
import {GardenProfessorTeacher} from '../garden-professor-teacher.mjs';
import {GARDEN_MODES} from '../garden-modes.mjs';
import {gardenSkillAtlasData} from '../garden-skill-atlas-data.mjs';

const empty=gardenSkillAtlasData();
assert.equal(empty.groups.length,1);assert.equal(empty.groups[0].nodes.length,41);
assert.equal(empty.summary.tries,0);assert.equal(empty.summary.accuracy,null);
for(const node of empty.groups[0].nodes){assert.equal(node.accuracy,null);assert.equal(node.lastSeen,null);assert(!node.mastered);assert(!node.locked);assert(node.formula&&node.description&&node.aliases);assert(node.example.tones.length>=3);}

const teacher=new GardenProfessorTeacher(),chord={offset:0,quality:'m7'};
teacher.beginFlight('actual-flight');
for(let i=0;i<269;i++)teacher.record({id:'dorian',chord,position:0,verdict:'compatible'});
for(let i=1;i<10;i++)teacher.record({id:'dorian',chord,position:i,verdict:i===2?'invalid':'compatible'});
teacher.record({id:'dorian',chord,position:11,verdict:'compatible',boundary:true});
teacher.record({id:'dorian',chord,position:12,verdict:'neutral'});
teacher.record({id:'dorian',chord,position:13,verdict:'compatible',assisted:true});
let atlas=gardenSkillAtlasData(teacher.snapshot()),dorian=atlas.groups[0].nodes.find(n=>n.id==='dorian');
assert.equal(dorian.tries,10,'repeated contact does not become hundreds of atlas choices');
assert.equal(dorian.good,9);assert.equal(dorian.bad,1);assert.equal(dorian.accuracy,.9);assert(dorian.mastered);
assert.equal(dorian.mastered,teacher.mastered('dorian'));assert.equal(atlas.summary.used,1);

// Lifetime counters remain distinct from the bounded recent/mastery window.
for(let i=0;i<25;i++){teacher.beginFlight('later-'+i);teacher.record({id:'dorian',chord,position:i%4,verdict:'compatible'});}
atlas=gardenSkillAtlasData(teacher.snapshot());dorian=atlas.groups[0].nodes.find(n=>n.id==='dorian');
assert.equal(dorian.tries,35);assert.equal(dorian.recentTries,20);assert.equal(dorian.recentAccuracy,1);assert.equal(dorian.accuracy,34/35);

// Recurring wrong answers lack a complete success ledger and cannot become 0%.
const before=atlas.summary.tries;
for(let i=0;i<3;i++){teacher.beginFlight('patterns');teacher.record({kind:'tension',id:'♭9',chord,position:i,verdict:'invalid'});teacher.record({kind:'answer',id:'quality:maj7',chord,position:i,verdict:'wrong'});}
atlas=gardenSkillAtlasData(teacher.snapshot());assert.equal(atlas.summary.tries,before);assert.equal(atlas.groups.length,1);assert.equal(atlas.history.chordAccuracyAvailable,false);assert.equal(atlas.history.tensionAccuracyAvailable,false);

const disabled=gardenSkillAtlasData(teacher.snapshot(),{language:'en',enabledFamilies:['major']});
assert.equal(disabled.groups[0].title,'Scales');assert(disabled.groups[0].nodes.find(n=>n.id==='dorian').enabled);
assert.equal(disabled.groups[0].nodes.find(n=>n.id==='altered').enabled,false);assert.equal(disabled.groups[0].nodes.length,GARDEN_MODES.length,'a disabled family is still visible in the atlas');
assert.equal(gardenSkillAtlasData({modes:{unknown:{good:999}}}).summary.tries,0);
assert.equal(gardenSkillAtlasData({modes:{ionian:{good:NaN,bad:-4,recent:[],contexts:[]}}}).summary.accuracy,null);
const review=gardenSkillAtlasData({modes:{ionian:{good:0,bad:4,recent:[0,0,0,0],contexts:['a|0','a|1']},dorian:{good:0,bad:1,recent:[0],contexts:['a|0']}}});
assert.equal(review.groups[0].nodes.find(n=>n.id==='ionian').status,'review');assert.equal(review.groups[0].nodes.find(n=>n.id==='dorian').status,'learning','a single slip does not mark a skill as weak');
console.log('PASS skill atlas data: all 41 real lesson nodes; missing data stays unknown; real teacher dedupe, cumulative vs recent accuracy, mastery, disabled families retained; no fabricated chord/tension accuracy or dates.');
