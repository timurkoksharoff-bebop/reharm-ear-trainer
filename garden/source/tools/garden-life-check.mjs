import assert from 'node:assert/strict';
import {createGardenLife} from '../garden-life.mjs';

const fixed=()=>.5;
const view={width:400,height:600,x:200,y:300,speed:2,ship:0,active:true,answering:true};
{
 const lagging=createGardenLife({random:fixed});lagging.spawnClock=lagging.craterClock=lagging.asteroidClock=lagging.stormClock=lagging.assistClock=lagging.arrangementClock=999;
 for(let i=0;i<14;i++)lagging.update(.01,{...view,separateBass:true,clockDt:1});
 assert(lagging.entities.some(e=>e.kind==='bassClef'),'first bass key timing does not slow down with capped physics frames');
}

// Real clock-driven appearance, not a forced test pickup.
for(const separateBass of [false,true]){
 const life=createGardenLife({random:fixed});
 life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=life.assistClock=life.arrangementClock=999;
 const flight={...view,separateBass,x:350,y:570};
 for(let i=0;i<130;i++)life.update(.1,flight);
 assert(!life.snapshot().entities.some(e=>e.kind==='bassClef'),'no premature bass key');
 life.update(20,{...flight,paused:true});
 for(let i=0;i<20;i++)life.update(.1,flight);
 const key=life.entities.find(e=>e.kind==='bassClef');
 assert.equal(Boolean(key),separateBass,'first key appears after 14 active seconds, Teacher only');
 if(key){
  assert(key.y>=0&&key.y<.3,'first key enters the visible top of the scene');
  life.bassHelpClock=0;life.update(.1,flight);
  assert.equal(life.entities.filter(e=>e.kind==='bassClef'&&!e.collected).length,1,'no duplicate while a key is flying');
  life.collect(key);life.entities=life.entities.filter(e=>e!==key);
  life.update(.1,flight);assert(!life.entities.some(e=>e.kind==='bassClef'),'no duplicate while a key is in inventory');
  life.consumeArtifact('bassClef');life.update(.1,flight);
  assert(life.entities.some(e=>e.kind==='bassClef'),'a later due key becomes available once the stored one is used');
 }
 life.reset();assert.equal(life.bassHelpClock,14,'each new flight resets the first-key guarantee');
}

{
  const life=createGardenLife({random:fixed});
  life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=999;
  const rock=life.forceSpawn('stoneAsteroid',{x:.5,y:.5,vx:0,vy:0,scale:.7,damageResource:'hull'});
  const before=life.snapshot().resources.hull;
  life.update(.01,view);
  const after=life.snapshot();
  assert(after.resources.hull<before,'Asteroid collision damages the hull');
  assert(before-after.resources.hull>5.7&&before-after.resources.hull<5.8,'Ordinary impact applies the requested 15% damage increase');
  assert(after.entities.some(entity=>entity.id===rock.id),'Ordinary asteroid remains physical after impact');
  assert(after.impact>0&&after.chips>0,'Impact produces recoil and fragments');
}

{
  const life=createGardenLife({random:fixed});
  life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=999;
  life.forceSpawn('lavaAsteroid',{x:.5,y:.5,vx:0,vy:0,scale:.7});
  life.update(.01,view);
  assert.equal(life.snapshot().gameOver,true,'Lava impact ends the mission');
  assert.equal(life.snapshot().failureResource,'lava');
}

{
  const life=createGardenLife({random:fixed});
  life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=999;
  for(let i=0;i<200;i++)life.update(.1,view);
  const pressure=life.snapshot();
  assert(pressure.campPressure,'Remaining still during an active question summons pressure spores');
  assert(pressure.resources.crew<92,'Pressure spores drain survival resources');
  life.update(.1,{...view,x:320});
  assert.equal(life.snapshot().campPressure,null,'Flying away clears pressure spores');
}

{
  const life=createGardenLife({random:fixed});
  life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=life.assistClock=life.arrangementClock=999;
  for(let i=0;i<1200;i++)life.update(.1,{...view,answering:false});
  const resources=life.snapshot().resources;
  assert(!life.snapshot().gameOver,'A two-minute listening route remains viable without pickups');
  // Medium is no longer effectively immortal: all four reserves drain in real flight time.
  for(const [key,expected] of Object.entries({fuel:30.8,water:45.6,crew:74.24,hull:72}))assert(Math.abs(resources[key]-expected)<1e-6,`Medium two-minute ${key} drain`);
  const hullBeforePickup=resources.hull;
  life.forceSpawn('hull',{x:.5,y:.5,vx:0,vy:0});
  life.update(.01,{...view,answering:false});
  assert(life.snapshot().resources.hull-hullBeforePickup>10.9,'A lotus replenishes the hull independently of previous drain');
  for(let i=0;i<1800;i++)life.update(.1,{...view,answering:false});
  assert(life.snapshot().gameOver,'Doing nothing eventually exhausts a Medium reserve and ends flight');
}

{
  const life=createGardenLife({random:fixed});
  life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=999;
  life.setResource('fuel',0);
  for(let i=0;i<37;i++)life.update(.1,{...view,answering:false});
  assert.equal(life.snapshot().gameOver,true,'An empty survival reserve ends the mission after a grace period');
}

console.log('Garden life passed: physical impacts, lava failure, anti-camping pressure and survival grace period.');
