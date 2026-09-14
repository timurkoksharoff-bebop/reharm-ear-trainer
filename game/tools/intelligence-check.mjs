import assert from 'node:assert/strict';
import {createIntelligence} from '../intelligence.mjs';
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
const tutor=createIntelligence(storage,()=>.99),items=Array.from({length:20},(_,i)=>i);
for(let i=0;i<20;i++)assert(tutor.pick('melody',items,{progressive:true})<4);
for(let id=0;id<4;id++)for(let i=0;i<5;i++)tutor.record('melody',String(id),1);
assert.equal(tutor.pick('melody',items,{progressive:true}),7);
tutor.record('melody','0',0);assert.equal(tutor.snapshot().topics['melody:0'].streak,0);
const restored=createIntelligence(storage);assert.equal(restored.snapshot().topics['melody:0'].attempts,6);
restored.configure({enabled:false,genre:'rock'});assert.equal(createIntelligence(storage).settings.genre,'rock');
assert.equal(restored.pick('empty',[]),null);
const blocked=createIntelligence({getItem(){throw Error();},setItem(){throw Error();}});blocked.record('rhythm','swing',1);
console.log('Intelligence: progressive unlock, persistence, mastery reset, empty pools, storage failures OK');
const genres=Array.from({length:60},(_,i)=>({id:i,genre:i<30?'jazz':'rock'}));
const genreTutor=createIntelligence({getItem:()=>null,setItem(){}},()=>.99);
assert(genreTutor.pick('melody',genres,{id:x=>String(x.id),genre:x=>x.genre,progressive:true}).id>=30,'Rock is available before mastering jazz');
const invalid=createIntelligence({getItem:()=>JSON.stringify({version:1,topics:{bad:null},recent:{melody:null},unlocked:null}),setItem(){}});
assert.notEqual(invalid.pick('melody',[1,2,3],{progressive:true}),null);
// Every newly mastered item unlocks another; a later miss never closes access.
const unlocked=tutor.snapshot().unlocked['melody:all'];tutor.record('melody','1',0);
tutor.pick('melody',items,{progressive:true});assert(tutor.snapshot().unlocked['melody:all']>=unlocked);
let seed=11;const seeded=()=>((seed=(seed*1664525+1013904223)>>>0)/2**32);
const weighted=createIntelligence({getItem:()=>null,setItem(){}},seeded);
for(let n=0;n<5;n++){weighted.record('chord','weak',0);weighted.record('chord','learned',1);}
let weak=0,learned=0;for(let n=0;n<3000;n++){const x=weighted.pick('sample',['weak','learned','other','other2'],{evidence:x=>[['chord',x]]});if(x==='weak')weak++;if(x==='learned')learned++;}
assert(weak>learned,'Weak musical evidence biases choices without deleting learned topics');assert(learned>0);
console.log('Intelligence: balanced genre access, safe corrupt data, permanent unlock and weakness weighting OK');
