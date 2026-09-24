import assert from 'node:assert/strict';
import {createGardenLife} from '../garden-life.mjs';

const fixed=()=>.5;
const view={width:400,height:600,x:200,y:300,speed:2,ship:0,active:true,answering:true};

{
  const life=createGardenLife({random:fixed});
  life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=999;
  const rock=life.forceSpawn('stoneAsteroid',{x:.5,y:.5,vx:0,vy:0,scale:.7});
  const before=life.snapshot().resources.hull;
  life.update(.01,view);
  const after=life.snapshot();
  assert(after.resources.hull<before,'Asteroid collision damages the hull');
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
  for(let i=0;i<76;i++)life.update(.1,view);
  const pressure=life.snapshot();
  assert(pressure.campPressure,'Remaining still during an active question summons pressure spores');
  assert(pressure.resources.crew<92,'Pressure spores drain survival resources');
  life.update(.1,{...view,x:320});
  assert.equal(life.snapshot().campPressure,null,'Flying away clears pressure spores');
}

{
  const life=createGardenLife({random:fixed});
  life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=999;
  life.setResource('fuel',0);
  for(let i=0;i<37;i++)life.update(.1,{...view,answering:false});
  assert.equal(life.snapshot().gameOver,true,'An empty survival reserve ends the mission after a grace period');
}

console.log('Garden life passed: physical impacts, lava failure, anti-camping pressure and survival grace period.');
