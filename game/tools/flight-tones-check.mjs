import assert from 'node:assert/strict';
import {flightNotes,cubeLayout,numberCubeLayout,cubeFace,partialToneCredit} from '../flight-tones.mjs';
import {INTERVALS} from '../music.mjs';
assert.deepEqual(flightNotes('C',INTERVALS.maj7),['C','E','G','B']);
assert.deepEqual(flightNotes('C',INTERVALS['7']),['C','E','G','B♭']);
assert.deepEqual(flightNotes('D♭',INTERVALS.maj7),['D♭','F','A♭','C']);
assert.deepEqual(flightNotes('F♯',INTERVALS.maj7),['F♯','A♯','C♯','E♯']);
assert.deepEqual(flightNotes('C',INTERVALS['7sharp5'],'basic'),['C','E','G♯']);
assert.deepEqual(flightNotes('C',INTERVALS['7b9b13']),['C','E','G','B♭','D♭','A♭']);
assert.equal(partialToneCredit(['9','13'],['9']),.5);assert.equal(partialToneCredit(['9','13'],['9','♭9']),.3);
for(const h of [480,600,800]){
 const required=['C','E','G','B'],cubes=cubeLayout(required,['D','F','A','D♭','E♭','A♭'],480,h);
 assert.equal(cubes.filter(c=>c.rotating).length,2);
 assert(cubes.some(c=>c.rotating&&c.faces.some(label=>required.includes(label))),'A dense chord keeps one required tone on a changing drum');
 assert(required.every(label=>cubes.some(c=>c.label===label||c.faces?.includes(label))),'Every required tone remains reachable');
 for(const c of cubes){assert(c.x>=50&&c.x<=430);assert(c.y>=100&&c.y<h-35);}
 for(let i=0;i<cubes.length;i++)for(let j=i+1;j<cubes.length;j++)assert(Math.hypot(cubes[i].x-cubes[j].x,cubes[i].y-cubes[j].y)>100);
 const drum=cubes.find(c=>c.rotating);drum.age=1.95;assert.equal(cubeFace(drum).label,'D');assert.equal(cubeFace(drum).next,'F');assert.equal(cubeFace(drum).turn,0);drum.age=2.2;assert(cubeFace(drum).turn>0);drum.age=2.4;assert.equal(cubeFace(drum).label,'F');
}
{
 const cubes=numberCubeLayout('♭7',['1','2','3','4','5','6','7'],480,700,()=>.42);
 assert.equal(cubes.length,5);assert.equal(cubes.filter(c=>c.rotating).length,2);
 assert.equal(cubes.filter(c=>c.label==='♭7').length,1);
 assert(cubes.every(c=>c.cube));assert(cubes.filter(c=>c.rotating).every(c=>!c.faces.includes('♭7')));
}
console.log('Note flight: correct spelling/order, altered fifths/extensions, partial credit, spaced targets and two fast drums.');
