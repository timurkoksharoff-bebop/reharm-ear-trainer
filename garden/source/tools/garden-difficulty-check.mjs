import assert from 'node:assert/strict';
import {GardenLife} from '../garden-life.mjs';
import {difficultyProfile} from '../garden-difficulty.mjs';
for(const name of ['light','medium','hard']){
 const life=new GardenLife({random:()=>.5});life.difficulty=difficultyProfile(name);
 life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=life.assistClock=life.arrangementClock=1e9;
 const before={...life.resources};const view={active:true,flying:true,ship:2,width:400,height:800,speed:life.difficulty.speed};
 life.update(20,view);for(const key of Object.keys(before))assert.ok(life.resources[key]<before[key],`${name}: ${key} drains while idle`);
 const paused={...life.resources};life.update(20,{...view,paused:true});assert.deepEqual(life.resources,paused);
 if(name==='light'){life.resources.fuel=0;life.update(1,view);assert.ok(life.resources.fuel>=25);assert.equal(life.gameOver,false);}
}
console.log('Difficulty checks passed: all resources drain during flight, pause freezes drain, Light protects resources.');
