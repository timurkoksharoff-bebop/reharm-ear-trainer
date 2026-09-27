import assert from 'node:assert/strict';
import {samsaraBalance,samsaraNeedsPickup,samsaraPickupAmount,samsaraPickupDelay,samsaraStartingVitals,stepSamsaraVitals} from '../samsara-survival.mjs';

for(let level=0;level<4;level++){
  const start=samsaraStartingVitals(level),config=samsaraBalance(level);
  assert(start.fuel<100&&start.energy<100&&start.crew<100,'The survival loop must begin with room to collect supplies');
  assert(config.drain.fuel>0&&config.drain.energy>0);
  assert(samsaraPickupDelay(level,()=>0)>=config.pickup[0]);
  assert(samsaraPickupDelay(level,()=>1)<=config.pickup[1]);
  assert(samsaraPickupAmount(0,level)>0);
}
assert(samsaraBalance(3).drain.fuel>samsaraBalance(0).drain.fuel,'Higher ranks must consume resources faster');
assert(!samsaraNeedsPickup({fuel:90,energy:90,crew:90},90).urgent,'Supplies should not clutter a healthy field');
assert(samsaraNeedsPickup({fuel:70,energy:90,crew:90},90).urgent,'A depleted resource must request a supply drop');
let state={fuel:1,energy:50,crew:50},result=stepSamsaraVitals(state,10,{level:3,forces:4});
assert.equal(result.depleted,'fuel');assert.equal(result.vitals.fuel,0);
state={fuel:10,energy:10,crew:1};result=stepSamsaraVitals(state,10,{level:3,forces:0});
assert.equal(result.depleted,'crew','Critical fuel or energy must also exhaust the crew');
console.log('Samsara survival audit passed: rank pressure, supply gating, depletion and pickup values.');
