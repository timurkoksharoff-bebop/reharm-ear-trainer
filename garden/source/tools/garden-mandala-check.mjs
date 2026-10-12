import assert from 'node:assert/strict';
import {gardenMandalaDataUri} from '../garden-sequence-studio.mjs';

const designs=Array.from({length:20},(_,index)=>gardenMandalaDataUri(index));
assert.equal(new Set(designs).size,20,'the mandala queue contains 20 distinct designs');
for(const [index,data] of designs.entries()){
  assert.match(data,/^data:image\/svg\+xml;charset=utf-8,/);
  const svg=decodeURIComponent(data.slice(data.indexOf(',')+1));
  assert.match(svg,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 256 256">/);
  assert.match(svg,/<ellipse /,`design ${index+1} includes petals`);
  assert.match(svg,/<circle /,`design ${index+1} includes layered geometry`);
}
console.log('20 distinct procedural mandalas verified');
