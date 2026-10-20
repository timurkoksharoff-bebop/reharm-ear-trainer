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
 life.update(20,view);for(const key of Object.keys(before))assert.ok(name==='light'?life.resources[key]===100:life.resources[key]<before[key],`${name}: expected reserve policy`);
 const paused={...life.resources};life.update(20,{...view,paused:true});assert.deepEqual(life.resources,paused);
 if(name==='light'){
  life.wrongAnswer('degree',0);assert.equal(life.resources.fuel,100,'wrong answers do not spend Applicant reserves');
  const poison=life.forceSpawn('poison',{x:.5,y:.5});life.collect(poison);assert(Object.values(life.resources).every(n=>n===100),'poison cannot spend protected reserves');
  life.resources.fuel=0;life.update(1,view);assert.equal(life.resources.fuel,100);assert.equal(life.gameOver,false);
 }
}
assert.equal(difficultyProfile('light').speed,difficultyProfile('medium').speed);
assert.equal(difficultyProfile('light').barSeconds,difficultyProfile('medium').barSeconds);
assert.equal(difficultyProfile('light').spawnRate,difficultyProfile('medium').spawnRate);
assert.equal(difficultyProfile('hard').timeScale,1.1);
assert.equal(difficultyProfile('medium').barSeconds/difficultyProfile('hard').barSeconds,1.1);
console.log('Difficulty checks passed: unchanged Student, +10% Teacher pace, Applicant at Student pace with full protected reserves, pause freezes drain.');
