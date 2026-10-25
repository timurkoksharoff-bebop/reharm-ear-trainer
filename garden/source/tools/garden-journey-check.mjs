import assert from 'node:assert/strict';
import {gardenRouteStars,gardenRouteRatingText,GardenJourneyRatings} from '../garden-journey.mjs';
const base={difficulty:'hard',independent:true,accuracy:1,laps:1,toneAttempts:2,toneAccuracy:1};
assert.equal(gardenRouteStars(base),5);assert.equal(gardenRouteStars({...base,laps:1.2}),4);assert.equal(gardenRouteStars({...base,laps:2}),3);assert.equal(gardenRouteStars({...base,accuracy:.85}),3);assert.equal(gardenRouteStars({...base,accuracy:.6,laps:8}),1);assert.equal(gardenRouteStars({...base,independent:false}),1);assert.equal(gardenRouteStars({...base,difficulty:'light'}),1);assert.equal(gardenRouteStars({...base,toneAccuracy:.7}),3,'attempted note accuracy still gates both mastery grades');assert.equal(gardenRouteStars(null),1);assert.equal(gardenRouteStars({...base,difficulty:'unknown'}),1,'unsupported records do not fabricate a new grade');
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},store=new GardenJourneyRatings(storage);
assert.equal(store.best('legacy',['legacy']),1);assert.equal(store.best('new',[]),0);store.record('a',{...base,laps:2});store.record('a',{...base,laps:6});assert.equal(store.best('a'),3,'replay cannot lower best');store.record('a',base);assert.equal(new GardenJourneyRatings(storage).best('a'),5,'best persists');
const grades=['a','legacy'].map(id=>store.best(id,['legacy']));assert.equal(grades.reduce((a,b)=>a+b)/grades.length,3,'planet mean uses each completed route once, with legacy completion at one');
console.log('Journey ratings passed: easier early grades with exacting mastery, accuracy/tempo/independence/notes, Cadet, legacy minimum, persistence and monotonic best results.');

assert.match(gardenRouteRatingText({...base,independent:false},{best:1}).detail,/самостоятельных/);
assert.match(gardenRouteRatingText(base,{best:5,previous:1,en:true}).detail,/1 → 5/);
assert.match(gardenRouteRatingText({...base,difficulty:"light"},{best:1}).detail,/Курсант/);
const halves={...base,independent:false,ratingCap:4};
assert.equal(gardenRouteStars(halves),4,'half-options hint caps a perfect flight at four');
assert.equal(gardenRouteStars({...halves,accuracy:.85}),3,'cap is not an automatic award');
assert.equal(gardenRouteStars({...halves,accuracy:.7}),2);
assert.equal(gardenRouteStars({...halves,ratingCap:1}),1,'unverified assistance remains conservative');
assert.match(gardenRouteRatingText(halves,{best:4}).detail,/максимум 4★/);

assert.equal(gardenRouteStars({...base,independent:false,ratingCap:2}),2,"full reveal caps a good flight at two");
assert.equal(gardenRouteStars({...base,independent:false,ratingCap:2,accuracy:.7}),2,"full-reveal flight can reach but cannot exceed two stars");
assert.match(gardenRouteRatingText({...base,independent:false,ratingCap:2},{best:2}).detail,/максимум 2★/);

const oldMemory=new Map([['ear-yoga-route-stars.v1',JSON.stringify({known:{stars:2}})]]),oldStore=new GardenJourneyRatings({getItem:k=>oldMemory.get(k),setItem:(k,v)=>oldMemory.set(k,v)});assert.equal(oldStore.best('known'),2,'legacy stars have no hint provenance and are not blindly boosted');oldStore.record('known',{...base,accuracy:.85});assert.equal(oldStore.best('known'),3,'a new qualifying replay can raise a legacy best');
assert.match(gardenRouteRatingText({...base,accuracy:.85},{best:3}).detail,/Этот полёт: 3\/5/);assert.match(gardenRouteRatingText(base,{best:5,en:true}).detail,/Trial scale: 1★ for completion; 2★: ≥65%/);

// New early thresholds and retained mastery thresholds include their boundaries.
const grade=patch=>gardenRouteStars({...base,...patch});
for(const [patch,expected]of [
 [{accuracy:.65,laps:7},2],[{accuracy:.649999,laps:7},1],[{accuracy:.65,laps:7.000001},1],
 [{accuracy:.8,laps:4},3],[{accuracy:.799999,laps:4},2],[{accuracy:.8,laps:4.000001},2],
 [{accuracy:.98,laps:1.65,toneAccuracy:.85},4],[{accuracy:.979999,laps:1.65},3],
 [{accuracy:.98,laps:1.650001},3],[{accuracy:.98,laps:1.65,toneAccuracy:.849999},3],
 [{accuracy:1,laps:1.05,toneAccuracy:1},5],[{accuracy:1,laps:1.050001},4],
 [{accuracy:.999999,laps:1},4],[{accuracy:1,laps:1,toneAccuracy:.999999},4],
 [{toneAttempts:0,toneAccuracy:0},5],
 [{independent:false,ratingCap:4,accuracy:.6},1],[{independent:false,ratingCap:2,accuracy:.6},1]
])assert.equal(grade(patch),expected,JSON.stringify(patch));
