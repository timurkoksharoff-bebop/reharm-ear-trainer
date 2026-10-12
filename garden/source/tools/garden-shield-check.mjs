import assert from 'node:assert/strict';
import {GardenLife,GARDEN_ITEMS} from '../garden-life.mjs';
import {createGardenMission} from '../garden-harmony.mjs';
const exercise={sequence:[{offset:0,quality:'maj'},{offset:5,quality:'min'}],baseTonic:0};
const mission=createGardenMission({exercise,barSeconds:999}),life=new GardenLife({random:()=>.5});
try{
 assert(!GARDEN_ITEMS.shield.artifact,'the cocoon is not a manual inventory activation');
 life.collect(life.forceSpawn('shield'));
 assert.equal(life.snapshot().shieldHits,3,'collecting the cocoon activates its full protection immediately');assert.equal(life.inventory.shield,undefined,'the collected cocoon is not left waiting in a menu');
 mission.start();mission.advance();
 life.collect(life.forceSpawn('shield'));assert.equal(life.snapshot().shieldHits,3,'a second cocoon refreshes the active protection');
 for(let hit=0;hit<3;hit++){
  const rock=life.forceSpawn('stoneAsteroid',{x:.5,y:.5,scale:.7,damageResource:'hull'}),before={...life.resources};
  assert(life.asteroidImpact(rock,{x:200,y:300},400,600));assert.deepEqual(life.resources,before);
  assert.equal(life.snapshot().shieldHits,2-hit);
  assert(!life.asteroidImpact(rock,{x:200,y:300},400,600),'one contact cannot consume two petals');
 }
 const unprotected=life.forceSpawn('stoneAsteroid',{x:.5,y:.5,scale:.7,damageResource:'hull'}),hull=life.resources.hull;
 life.asteroidImpact(unprotected,{x:200,y:300},400,600);assert(life.resources.hull<hull,'fourth hit damages normally');
 life.collect(life.forceSpawn('shield'));const fuel=life.resources.fuel;life.wrongAnswer('degree',0);assert(life.resources.fuel<fuel,'errors bypass protection');assert.equal(life.shieldHits,3);
 const lava=life.forceSpawn('lavaAsteroid');life.asteroidImpact(lava,{x:200,y:300},400,600);assert(life.gameOver,'fatal lava bypasses shield');
 life.reset();assert.equal(life.shieldHits,0);assert.equal(life.shieldFade,0);
}finally{mission.pause();}
const jumps=Object.values(GARDEN_ITEMS).filter(item=>Number.isInteger(item.navigationDelta));
assert.deepEqual(jumps.map(item=>item.navigationDelta).sort((a,b)=>a-b),[-5,-3,-2,2,3,5],'jump capsules stop at +/-5; the +7 artifact is removed');
assert(jumps.filter(item=>Math.abs(item.navigationDelta)<=3).reduce((sum,item)=>sum+item.spawnWeight,0)>jumps.filter(item=>Math.abs(item.navigationDelta)>3).reduce((sum,item)=>sum+item.spawnWeight,0),'small jumps spawn more often than large jumps');
console.log('Cocoon PASS: immediate collection activation, three protected impacts, refresh, ordinary fourth impact, errors/lava bypass, reset; small jumps are weighted more often and +7 is absent.');
