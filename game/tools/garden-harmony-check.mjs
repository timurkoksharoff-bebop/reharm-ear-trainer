import assert from 'node:assert/strict';
import {createGardenMission,PRESETS} from '../garden-harmony.mjs';

const exercise={
  id:'test-garden',name:'Fig. 1.99',source:'test',baseTonic:5,
  sequence:[
    {degree:'II',offset:2,quality:'m7',bassOffset:null},
    {degree:'V/III',offset:11,quality:'7',bassOffset:4}
  ],
  distractors:[{degree:'IV',offset:5,quality:'maj7',bassOffset:null}]
};

const mission=createGardenMission({exercise,barSeconds:999,onChord:()=>{}});
mission.start();
assert.equal(mission.answerPart('degree',2).ignored,true,'the reference/base cannot be answered');
mission.advance();
assert.equal(mission.answerPart('quality','maj7').correct,false);
assert.equal(mission.answerPart('degree',2).correct,true);
assert.deepEqual(mission.snapshot().progress[0],{degree:true,quality:false},'a correct degree persists by itself');
mission.advance();
assert.deepEqual(mission.snapshot().progress[0],{degree:true,quality:false},'moving to another position does not reset progress');
assert.equal(mission.answerPart('quality','7').correct,true,'slash-bass target uses the same two answer parts');
assert.equal(mission.answerPart('degree',11).correct,true);
assert.deepEqual(mission.snapshot().progress[1],{degree:true,quality:true});
mission.advance();
mission.advance();
assert.equal(mission.snapshot().cursor,0);
assert.equal(mission.answerPart('quality','m7').correct,true);
assert.deepEqual(mission.snapshot().solved,[0,1]);
assert.equal(mission.snapshot().complete,true);
assert.equal(mission.snapshot().solvedParts,4);
mission.restart();
assert.deepEqual(mission.snapshot().progress,[{degree:false,quality:false},{degree:false,quality:false}]);
assert.equal(mission.snapshot().complete,false);
assert.deepEqual(Object.values(PRESETS).map(preset=>preset.engine),['felt','deep','air']);

console.log('Garden harmony passed: two persistent parts, loop retention, slash-bass completion, restart, distinct timbres.');
