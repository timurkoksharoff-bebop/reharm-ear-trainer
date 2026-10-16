import assert from 'node:assert/strict';
import {trialState,TRIAL_DAYS,createTrial} from '../garden-trial.mjs';
import {guideLessons,guideItemCopy} from '../garden-guide.mjs';
import {GARDEN_ITEMS} from '../garden-life.mjs';
const now=1800000000000,first=trialState(null,now),end=now+TRIAL_DAYS*86400000;
assert.equal(first.daysLeft,60);assert.equal(first.expired,false);
assert.equal(trialState(first,end-1).expired,false);
assert.equal(trialState(first,end).expired,true);
assert.equal(trialState(trialState(first,end),now).expired,true,'clock rollback does not unlock');
assert.equal(trialState({startedAt:'broken'},now).startedAt,now);
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
createTrial(storage).check(now);assert.equal(createTrial(storage).check(end).expired,true);
assert.equal(createTrial({getItem(){throw Error();},setItem(){throw Error();}}).check(now).persistent,false);
const kinds=guideLessons().map(s=>s.kind).filter(Boolean);
assert.deepEqual(new Set(kinds),new Set(Object.keys(GARDEN_ITEMS)),'every shipped collectible and hazard has a lesson');
assert.equal(kinds.length,new Set(kinds).size);
for(const kind of kinds){assert(guideItemCopy(kind).length>30);assert(guideItemCopy(kind,true).length>30);assert(!/[А-Яа-яЁё]/.test(guideItemCopy(kind,true)),kind);}
console.log('EAR YOGA: trial boundaries, persistence, clock rollback, storage failure and all '+kinds.length+' item lessons passed.');
