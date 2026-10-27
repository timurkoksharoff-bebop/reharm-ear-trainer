import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GardenPad,gardenSampleStart,gardenSampleBankLevel,gardenSampleBankGain} from '../garden-harmony.mjs';
const directory=new URL('../../assets/echo-garden/samples/',import.meta.url);
function readWave(file){
 const candidate=new URL(file,directory),source=file.startsWith('grand/')?new URL('../art/grand-piano/'+file.split('/').at(-1),import.meta.url):candidate;const bytes=fs.readFileSync(fs.existsSync(candidate)?candidate:source);let format,data;
 for(let p=12;p+8<bytes.length;){const name=bytes.toString('ascii',p,p+4),size=bytes.readUInt32LE(p+4);if(name==='fmt ')format={channels:bytes.readUInt16LE(p+10),rate:bytes.readUInt32LE(p+12),bits:bytes.readUInt16LE(p+22)};if(name==='data')data=bytes.subarray(p+8,p+8+size);p+=8+size+(size%2);}
 const width=format.bits/8,length=data.length/(width*format.channels),channels=Array.from({length:format.channels},()=>new Float32Array(length));
 for(let frame=0;frame<length;frame++)for(let c=0;c<format.channels;c++)channels[c][frame]=data.readIntLE((frame*format.channels+c)*width,width)/2**(format.bits-1);
 return {numberOfChannels:format.channels,sampleRate:format.rate,length,getChannelData:c=>channels[c]};
}
const pad=new GardenPad(),banks={};
for(const [name,sources] of Object.entries(pad.sampleSources))banks[name]=sources.map(([file,midi,tune=0,gainDb=0])=>{const buffer=readWave(file);return {midi,tune,regionGain:10**(gainDb/20),buffer,startOffset:gardenSampleStart(buffer)};});
const reference=banks.felt,target=gardenSampleBankLevel(reference);
assert.equal(gardenSampleBankGain(reference,reference),1);
for(const [name,bank] of Object.entries(banks)){
 const gain=gardenSampleBankGain(bank,reference),difference=20*Math.log10(gardenSampleBankLevel(bank)*gain/target);
 assert(Math.abs(difference)<.1,`${name}: balanced within 0.1 dB of Felt Piano`);
 console.log(`${name}: gain ${gain.toFixed(3)} (${(20*Math.log10(gain)).toFixed(1)} dB), difference ${difference.toFixed(2)} dB`);
}
console.log('Sample balance passed; Felt Piano reference gain remains 1.');
