import assert from 'node:assert/strict';
import {gardenRouteStars,GardenJourneyRatings} from '../garden-journey.mjs';
const base={difficulty:'hard',independent:true,accuracy:1,laps:1,toneAttempts:2,toneAccuracy:1};
assert.equal(gardenRouteStars(base),5);assert.equal(gardenRouteStars({...base,laps:1.2}),4);assert.equal(gardenRouteStars({...base,laps:2}),3);assert.equal(gardenRouteStars({...base,accuracy:.85}),2);assert.equal(gardenRouteStars({...base,independent:false}),1);assert.equal(gardenRouteStars({...base,difficulty:'light'}),1);assert.equal(gardenRouteStars({...base,toneAccuracy:.7}),3,'incorrect tones limit exceptional ratings');
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},store=new GardenJourneyRatings(storage);
assert.equal(store.best('legacy',['legacy']),1);assert.equal(store.best('new',[]),0);store.record('a',{...base,laps:2});store.record('a',{...base,laps:6});assert.equal(store.best('a'),3,'replay cannot lower best');store.record('a',base);assert.equal(new GardenJourneyRatings(storage).best('a'),5,'best persists');
const grades=['a','legacy'].map(id=>store.best(id,['legacy']));assert.equal(grades.reduce((a,b)=>a+b)/grades.length,3,'planet mean uses each completed route once, with legacy completion at one');
console.log('Journey ratings passed: five grades, accuracy/tempo/independence/notes, Applicant, legacy minimum, persistence and monotonic best results.');
