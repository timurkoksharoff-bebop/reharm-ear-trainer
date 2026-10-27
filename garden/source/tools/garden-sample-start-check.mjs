import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gardenSampleStart,GardenPad} from '../garden-harmony.mjs';
const directory=new URL('../../assets/echo-garden/samples/',import.meta.url);
function readWave(file){
 const bytes=fs.readFileSync(new URL(file,directory));let format,data;
 for(let p=12;p+8<bytes.length;){const name=bytes.toString('ascii',p,p+4),size=bytes.readUInt32LE(p+4);if(name==='fmt ')format={channels:bytes.readUInt16LE(p+10),rate:bytes.readUInt32LE(p+12),bits:bytes.readUInt16LE(p+22)};if(name==='data')data=bytes.subarray(p+8,p+8+size);p+=8+size+(size%2);}
 const width=format.bits/8,length=data.length/(width*format.channels),channels=Array.from({length:format.channels},()=>new Float32Array(length));
 for(let frame=0;frame<length;frame++)for(let c=0;c<format.channels;c++)channels[c][frame]=data.readIntLE((frame*format.channels+c)*width,width)/2**(format.bits-1);
 return {numberOfChannels:format.channels,sampleRate:format.rate,length,getChannelData:c=>channels[c]};
}
const starts={};
for(const file of fs.readdirSync(directory).filter(file=>file.endsWith('.wav'))){
 const buffer=readWave(file),start=gardenSampleStart(buffer);starts[file]=Math.round(start*1000);
 if(file.startsWith('felt-'))assert(start>.14&&start<.22,'Felt recording pre-roll is skipped');
 if(file==='hybrid-c4.wav')assert(start>.45&&start<.46);
 if(!file.startsWith('felt-')&&file!=='hybrid-c4.wav')assert.equal(start,0,'immediate recordings are untouched');
}
const silent={numberOfChannels:1,sampleRate:1000,length:10,getChannelData:()=>new Float32Array(10)};
assert.equal(gardenSampleStart(silent),0);
const startsAt=[],pad=new GardenPad();
pad.unlock=async()=>{};
pad.cleanOutput={};
pad.context={currentTime:1,createGain:()=>({gain:{setValueAtTime(){}},connect(){}}),createBufferSource:()=>({playbackRate:{value:1},connect(){},start:(...args)=>startsAt.push(args),stop(){}})};
pad.loadSampleBank=async()=>{pad.context.currentTime=5;return [{midi:48,buffer:{},startOffset:.179}];};
const notes=[41,53,57,60];
await pad.play({offset:0,quality:'maj',notes},5);
assert.equal(startsAt.length,notes.length);
assert(startsAt.every(([time,offset])=>time===5&&offset===.179),'one fresh clock and source-time offset for bass and chord');
assert.deepEqual(notes,[41,53,57,60],'voicing is unchanged');
console.log('Sample timing passed:',starts,'ms skipped; synchronous attacks and unmodified MIDI verified.');
