import assert from 'node:assert/strict';
import {MELODY_BANK,GENRE_COUNTS} from '../melody-bank.mjs';
import {ROCK_MELODIES} from '../rock-melodies.mjs';
import {CLASSICAL_MELODIES} from '../classical-melodies.mjs';
import {createIntelligence} from '../intelligence.mjs';
import {melodyIndicesForLevel} from '../melody-levels.mjs';
assert.deepEqual(GENRE_COUNTS,{jazz:200,rock:50,classical:100});
assert.equal(new Set(MELODY_BANK.map(m=>m.id)).size,350);
for(const m of MELODY_BANK){assert(m.events.length>=12);assert(m.preview>0&&m.preview<=m.events.length);assert.match(m.sourceSha256,/^[a-f0-9]{64}$/);for(const [p,d]of m.events){assert(d>0&&Number.isFinite(d));assert(p===null||Number.isFinite(p)&&m.firstMidi+p>=0&&m.firstMidi+p<=127);}}
const notes=(id,n)=>CLASSICAL_MELODIES.find(m=>m.name.includes(id)).events.filter(e=>e[0]!==null).slice(0,n).map(([p])=>p);
assert.deepEqual(notes('Für Elise',9),[0,-1,0,-1,0,-5,-2,-4,-7]);
assert.deepEqual(notes('Ode to Joy',9),[0,0,1,3,3,1,0,-2,-4]);
assert.deepEqual(notes('Canon in D',8),[0,-2,-4,-5,-7,-9,-7,-5]);
assert.deepEqual(ROCK_MELODIES.find(m=>m.id==='rock-hey-jude').events.filter(e=>e[0]!==null).slice(0,6).map(e=>e[0]),[0,-3,-3,0,2,-5]);
let seed=47;const rng=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const tutor=createIntelligence({getItem:()=>null,setItem(){}},rng);tutor.configure({genre:'rock'});
const pool=melodyIndicesForLevel(1),counts={jazz:0,rock:0,classical:0};
for(let n=0;n<1000;n++){const i=tutor.pick('melody',pool,{id:i=>MELODY_BANK[i].id,genre:i=>MELODY_BANK[i].genre,progressive:true});counts[MELODY_BANK[i].genre]++;}
assert(counts.rock>counts.jazz&&counts.rock>counts.classical);assert(counts.jazz>0&&counts.classical>0);
console.log('Repertoire: 200 jazz + 50 rock + 100 classical; IDs, source hashes, durations, known opening pitches and genre rotation OK',counts);
