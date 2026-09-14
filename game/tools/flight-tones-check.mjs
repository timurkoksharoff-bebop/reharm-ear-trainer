import assert from 'node:assert/strict';
import {flightNotes,cubeLayout,cubeFace,partialToneCredit} from '../flight-tones.mjs';
import {INTERVALS} from '../music.mjs';
assert.deepEqual(flightNotes('C',INTERVALS.maj7),['C','E','G','B']);
assert.deepEqual(flightNotes('C',INTERVALS['7']),['C','E','G','B♭']);
assert.deepEqual(flightNotes('D♭',INTERVALS.maj7),['D♭','F','A♭','C']);
assert.deepEqual(flightNotes('F♯',INTERVALS.maj7),['F♯','A♯','C♯','E♯']);
assert.deepEqual(flightNotes('C',INTERVALS['7sharp5'],'basic'),['C','E','G♯']);
assert.deepEqual(flightNotes('C',INTERVALS['7b9b13']),['C','E','G','B♭','D♭','A♭']);
assert.equal(partialToneCredit(['9','13'],['9']),.5);assert.equal(partialToneCredit(['9','13'],['9','♭9']),0);
for(const h of [480,600,800]){
 const cubes=cubeLayout(['C','E','G','B'],['D','F'],480,h);
 assert.equal(cubes.filter(c=>c.rotating).length,1);
 for(const c of cubes){assert(c.x>=50&&c.x<=430);assert(c.y>=100&&c.y<h-35);}
 for(let i=0;i<cubes.length;i++)for(let j=i+1;j<cubes.length;j++)assert(Math.hypot(cubes[i].x-cubes[j].x,cubes[i].y-cubes[j].y)>100);
 const drum=cubes.find(c=>c.rotating);drum.age=4;assert.equal(cubeFace(drum).label,'D');assert.equal(cubeFace(drum).next,'F');drum.age=4.8;assert.equal(cubeFace(drum).label,'F');
}
console.log('Note flight: correct spelling/order, altered fifths/extensions, partial credit, spaced fixed targets and slow drum.');
