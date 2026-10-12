import assert from 'node:assert/strict';
import {SAVED_CINEMATIC_ROUTES} from '../garden-sequence-studio.mjs';

assert.deepEqual(SAVED_CINEMATIC_ROUTES.map(route=>[route.number,route.name,route.baseTonic,route.manualSteps.length]),[
  ['16','Journeying',0,8],
  ['15','Triumph',9,8],
  ['04','Cinematic Suspense 4',9,8],
  ['13','Cinematic epic',7,9]
]);
for(const route of SAVED_CINEMATIC_ROUTES){
  assert.equal(route.tour,'cinematic');
  assert.ok(route.manualSteps.every(([root,quality,notes])=>Number.isInteger(root)&&typeof quality==='string'&&notes.length>=3));
}
assert.equal((SAVED_CINEMATIC_ROUTES[2].manualSteps[0][0]-SAVED_CINEMATIC_ROUTES[2].baseTonic+12)%12,8);
assert.equal((SAVED_CINEMATIC_ROUTES[3].manualSteps[0][0]-SAVED_CINEMATIC_ROUTES[3].baseTonic+12)%12,8);
console.log('PASS: four saved Cinematic routes retain their chord counts, tonics and ♭VI openings');
