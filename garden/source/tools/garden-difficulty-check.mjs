import assert from 'node:assert/strict';
import {GardenLife} from '../garden-life.mjs';
import {difficultyProfile,GARDEN_ADMISSION_ROUTES,gardenAdmissionState,recordGardenAdmission} from '../garden-difficulty.mjs';
import {BOOK_CATALOG} from '../book-catalog.mjs';
assert.equal(GARDEN_ADMISSION_ROUTES.length,3);
for(const route of GARDEN_ADMISSION_ROUTES){assert(route.sequence.length>=3&&route.sequence.length<=4);assert.equal(route,BOOK_CATALOG.find(item=>item.id===route.id),'keep the exact catalog progression');}
const progress={level:7,completed:['existing-route'],admissionCompleted:[]};
assert(!recordGardenAdmission(progress,'not-a-route'));
for(let i=0;i<3;i++){
 assert.equal(gardenAdmissionState(progress).next.id,GARDEN_ADMISSION_ROUTES[i].id);
 assert.equal(recordGardenAdmission(progress,GARDEN_ADMISSION_ROUTES[i].id),i===2);
 assert(!recordGardenAdmission(progress,GARDEN_ADMISSION_ROUTES[i].id),'replaying never double-counts admission');
}
assert(gardenAdmissionState(progress).finished);assert.equal(progress.level,7);assert.deepEqual(progress.completed,['existing-route']);
assert(gardenAdmissionState(JSON.parse(JSON.stringify(progress))).finished,'graduation persists across storage');
for(const name of ['light','medium','hard']){
 const life=new GardenLife({random:()=>.5});life.difficulty=difficultyProfile(name);
 life.spawnClock=life.craterClock=life.asteroidClock=life.stormClock=life.assistClock=life.arrangementClock=1e9;
 const before={...life.resources};const view={active:true,flying:true,ship:2,width:400,height:800,speed:life.difficulty.speed};
 life.update(20,view);for(const key of Object.keys(before))assert.ok(life.resources[key]<before[key],`${name}: ${key} drains while idle`);
 const paused={...life.resources};life.update(20,{...view,paused:true});assert.deepEqual(life.resources,paused);
 if(name==='light'){life.resources.fuel=0;life.update(1,view);assert.ok(life.resources.fuel>=25);assert.equal(life.gameOver,false);}
}
console.log('Difficulty checks passed: all resources drain during flight, pause freezes drain, Light protects resources.');
