import assert from 'node:assert/strict';
import {GardenLife} from '../garden-life.mjs';
import {createGardenMission} from '../garden-harmony.mjs';
const exercise={sequence:[{offset:0,quality:'maj'},{offset:5,quality:'min'}],baseTonic:0};
const mission=createGardenMission({exercise,barSeconds:999}),life=new GardenLife({random:()=>.5});
try{
 life.collect(life.forceSpawn('shield'));
 assert(life.useShield(mission).ignored);assert.equal(life.inventory.shield,1);
 mission.start();assert(life.useShield(mission).ignored);mission.advance();
 assert.equal(life.useShield(mission).hits,3);assert.equal(life.inventory.shield,0);
 life.collect(life.forceSpawn('shield'));assert(life.useShield(mission).ignored);assert.equal(life.inventory.shield,1,'no spending an extra shield while active');
 for(let hit=0;hit<3;hit++){
  const rock=life.forceSpawn('stoneAsteroid',{x:.5,y:.5,scale:.7,damageResource:'hull'}),before={...life.resources};
  assert(life.asteroidImpact(rock,{x:200,y:300},400,600));assert.deepEqual(life.resources,before);
  assert.equal(life.snapshot().shieldHits,2-hit);
  assert(!life.asteroidImpact(rock,{x:200,y:300},400,600),'one contact cannot consume two petals');
 }
 const unprotected=life.forceSpawn('stoneAsteroid',{x:.5,y:.5,scale:.7,damageResource:'hull'}),hull=life.resources.hull;
 life.asteroidImpact(unprotected,{x:200,y:300},400,600);assert(life.resources.hull<hull,'fourth hit damages normally');
 life.useShield(mission);const fuel=life.resources.fuel;life.wrongAnswer('degree',0);assert(life.resources.fuel<fuel,'errors bypass protection');assert.equal(life.shieldHits,3);
 const lava=life.forceSpawn('lavaAsteroid');life.asteroidImpact(lava,{x:200,y:300},400,600);assert(life.gameOver,'fatal lava bypasses shield');
 life.reset();assert.equal(life.shieldHits,0);assert.equal(life.shieldFade,0);
}finally{mission.pause();}
console.log('Cocoon PASS: activation guards, exactly three protected impacts, no double spending, ordinary fourth impact, errors/lava bypass, reset.');
