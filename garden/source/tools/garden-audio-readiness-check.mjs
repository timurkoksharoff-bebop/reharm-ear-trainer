import assert from 'node:assert/strict';
import {GardenPad,createGardenMission} from '../garden-harmony.mjs';

const tick=async()=>{for(let i=0;i<6;i++)await Promise.resolve();};
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};
const bank=[{midi:48,buffer:{duration:2},startOffset:0,levelGain:1}];
const fakeContext=starts=>({currentTime:0,
 createGain:()=>({gain:{setValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}},connect(){},disconnect(){}}),
 createBufferSource:()=>({playbackRate:{value:1},connect(){},start(){starts.push(this.playbackRate.value);},stop(){},disconnect(){}})
});
const exercise={id:'cold-audio-test',baseTonic:0,sequence:[{degree:'I',offset:0,quality:'maj',notes:[48,52,55]},{degree:'V',offset:7,quality:'7',notes:[43,50,53,59]}]};

// Reproduce the old cold-bank race with real voice code: the next musical bar
// invalidates the unheard base while both calls wait for the same sample bank.
{
 const gate=deferred(),starts=[],pad=new GardenPad();pad.context=fakeContext(starts);pad.cleanOutput={};pad.unlock=async()=>{};pad.loadSampleBank=()=>gate.promise;
 const pending=pad.play({...exercise.sequence[0],reference:true},0);await tick();
 const next=pad.play(exercise.sequence[1],0);await tick();gate.resolve(bank);await Promise.all([pending,next]);
 assert.equal(pad.sounding.chord.reference,undefined,'old flow loses the base when loading outlasts its bar');assert.equal(starts.length,4,'only the second chord made voices');
}
{
 const gate=deferred(),starts=[],pad=new GardenPad();pad.context=fakeContext(starts);pad.cleanOutput={};pad.unlock=async()=>{};pad.loadSampleBank=()=>gate.promise;
 const playing=[];const mission=createGardenMission({exercise,barSeconds:999,onChord:chord=>{playing.push(pad.play(chord,0));}});
 const launch=(async()=>{if(await pad.prepare())mission.start();})();await tick();
 assert.equal(mission.snapshot().running,false,'cold samples do not consume the base bar');assert.equal(mission.snapshot().basePlayed,false);
 gate.resolve(bank);await launch;await Promise.all(playing);
 assert.equal(mission.snapshot().cursor,-1);assert.equal(pad.sounding.chord.reference,true,'prepared launch audibly starts the tonic');assert.equal(starts.length,3,'every reference voice starts');mission.pause();
}
{
 const gate=deferred(),pad=new GardenPad();pad.unlock=async()=>{};pad.loadSampleBank=()=>gate.promise;
 const ready=pad.prepare();await tick();pad.stop(true);gate.resolve(bank);assert.equal(await ready,false,'menu/route cancellation cannot start a stale flight');
}
{
 const felt=deferred(),hybrid=deferred(),loaded=[],pad=new GardenPad();pad.unlock=async()=>{};pad.loadSampleBank=set=>{loaded.push(set);return set==='felt'?felt.promise:hybrid.promise;};
 const ready=pad.prepare();await tick();pad.applyPreset('hybrid');felt.resolve(bank);await tick();
 assert.deepEqual(loaded,['felt','hybrid'],'a changed timbre is prepared before continuing');let settled=false;ready.then(()=>settled=true);await tick();assert.equal(settled,false);hybrid.resolve(bank);assert.equal(await ready,true);
}
{
 const pad=new GardenPad();pad.backgrounded=true;pad.unlock=async()=>{pad.stop(true);pad.backgrounded=false;};pad.loadSampleBank=async()=>bank;
 assert.equal(await pad.prepare(),true,'the normal background cleanup does not cancel its own preparation');
 pad.unlock=async()=>{};pad.loadSampleBank=async()=>{throw Error('sample unavailable');};await assert.rejects(pad.prepare(),/sample unavailable/,'loading errors remain visible to the caller');
 pad.applyPreset('air');pad.loadSampleBank=()=>{throw Error('oscillator must not fetch a bank');};assert.equal(await pad.prepare(),true,'synthesized timbres prepare without samples');
}
console.log('Audio readiness PASS: reproduced cold-bank base loss; warmup preserves tonic; stop cancels; preset changes and failures handled.');
