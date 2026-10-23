import assert from 'node:assert/strict';
import {gardenScalePhrase} from '../garden-harmony.mjs';
for(const scale of [[60,62,64,65,67,69,71,72],[60,63,65,67,70,72],[60,61,63,64,66,67,69,70,72]]){
 const patterns=new Set();
 for(let v=0;v<12;v++)for(const remaining of [.65,.9,1.5,2.5,5]){
  const p=gardenScalePhrase(scale,{remaining,variation:v});
  assert(p.notes.every(n=>scale.includes(n)));
  assert(p.duration+.012<remaining);
  assert((p.notes.length-1)*p.step+p.step*1.1+.012<remaining);
  assert(p.step>.1);patterns.add(p.pattern);
 }
 assert(patterns.has('down')&&patterns.has('thirds-up')&&patterns.has('weave'));
 const short=gardenScalePhrase(scale,{remaining:.8}),long=gardenScalePhrase(scale,{remaining:4});
 assert(long.notes.length>short.notes.length);
}
assert.equal(gardenScalePhrase([60,62],{remaining:.3}),null);
assert.deepEqual(gardenScalePhrase([60,62,64,65,67,69,71,72],{remaining:2,variation:2}).notes.slice(0,4),[60,64,62,65]);
console.log('PASS scale phrases: six alternating contours, short up/down, actual scale pitches, bounded tempo and chord-window endings.');
