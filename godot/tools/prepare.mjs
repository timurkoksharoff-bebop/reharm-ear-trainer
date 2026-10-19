// Frozen input comes from the 1.36 source, never a newly authored progression.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {BOOK_CATALOG} from '../../garden/source/book-catalog.mjs';
import {INTERVALS,DEGREES} from '../../garden/source/music.mjs';
import {createGardenMission,gardenJazzLabel,gardenQualityLabel,gardenAvailableAnswers,GARDEN_QUALITY_PALETTE} from '../../garden/source/garden-harmony.mjs';
import {gardenTensionVerdict,gardenOxygenProfile,GARDEN_TENSIONS} from '../../garden/source/garden-resonance.mjs';
import {GardenRun} from '../../garden/source/garden-run.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const project=path.dirname(root),check=process.argv.includes('--check');
const intervals={...INTERVALS,'1':[0],m:INTERVALS.min,'m7♭5':INTERVALS.m7b5,sus2:[0,2,7],sus4:[0,5,7],add9:[0,4,7,14],m9:INTERVALS.m7natural9};
const ids=['fig-1-6','fig-1-7','fig-1-9','fig-16-4'];
// The longer route exercises paging without removing repeated positions.
ids.push(BOOK_CATALOG.find(r=>r.sequence.length>12).id);
const sourceFiles=['book-catalog.mjs','music.mjs','garden-harmony.mjs','garden-run.mjs','garden-resonance.mjs'];
const fingerprint=Object.fromEntries(sourceFiles.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(project,'garden/source',f))).digest('hex')]));
const noteData=(chord,tonic)=>{
 const bass=36+tonic+(chord.bassOffset??chord.offset);
 if(!chord.notes?.length&&!intervals[chord.quality])throw Error(`Unsupported quality ${chord.quality}`);
 return {notes:chord.notes?.length?[...chord.notes]:[bass,...intervals[chord.quality].map(n=>48+tonic+chord.offset+n)],bassMidi:bass};
};
const enrich=(c,t,route)=>({...c,...noteData(c,t),label:gardenJazzLabel(c,t),qualityLabel:gardenQualityLabel(c.quality),tensions:Object.fromEntries(GARDEN_TENSIONS.map(s=>[s.label,gardenTensionVerdict(c,s.label,{tonic:t,tensionMode:route.tensionMode})])),oxygen:gardenOxygenProfile(c,{tonic:t,tensionMode:route.tensionMode})});
const routes=ids.map(id=>{
 const source=BOOK_CATALOG.find(r=>r.id===id);assert(source);
 const mission=createGardenMission({exercise:source,separateBass:true,rootMode:true});
 const model=mission.snapshot(),t=source.baseTonic??5;
 return {...source,sequence:source.sequence.map(c=>enrich(c,t,source)),reference:enrich(model.reference,t,source),choices:gardenAvailableAnswers(source,{rootMode:true}).map(value=>({value,label:gardenQualityLabel(value)}))};
});
const fixture={schema:1,baseline:'ear-yoga-v1.36-checkpoint',source:fingerprint,degrees:Object.values(DEGREES).map(d=>d.glyph),qualityOrder:GARDEN_QUALITY_PALETTE,tensions:GARDEN_TENSIONS,routes};
const traces=[];
for(const route of routes)for(const mode of ['student','teacher']){
 const mission=createGardenMission({exercise:route,rootMode:true,separateBass:mode==='teacher'}),run=new GardenRun();
 const capture=(action,result={})=>{const m=mission.snapshot();run.observe(m);traces.push({route:route.id,mode,action,result,expected:{cursor:m.cursor,running:m.running,complete:m.complete,progress:m.progress,score:run.snapshot().score,seconds:run.seconds}});};
 capture({op:'configure'});mission.start();capture({op:'start'});mission.advance();capture({op:'advance'});
 let c=mission.snapshot().current;
 let result=mission.answerPart('degree',(c.offset+1)%12);if(!result.correct&&!result.ignored)run.misses++;capture({op:'answer',kind:'degree',value:(c.offset+1)%12},result);
 mission.pause();capture({op:'pause'});result=mission.answerPart('quality',c.quality);capture({op:'answer',kind:'quality',value:c.quality},result);
 mission.start();capture({op:'start'});
 for(let i=0;i<route.sequence.length;i++){
  c=mission.snapshot().current;
  run.tick(1.25,true);capture({op:'tick',seconds:1.25});
  for(const [kind,value] of [['degree',c.offset],['quality',c.quality],['bass',c.bassOffset??c.offset]]){
   result=mission.answerPart(kind,value);capture({op:'answer',kind,value},result);
  }
  if(!mission.snapshot().complete){mission.advance();capture({op:'advance'});}
 }
 mission.pause();capture({op:'pause'});mission.restart();run.reset();capture({op:'restart'});
}
const write=(name,value)=>{
 const dest=path.join(root,name),data=name==='checks/legacy-traces.json'?'[\n'+value.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n':JSON.stringify(value,null,2)+'\n';
 if(check)assert.equal(fs.readFileSync(dest,'utf8'),data,`${name} diverged from 1.36`);
 else{fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);}
};
write('data/routes.json',fixture);write('checks/legacy-traces.json',traces);
if(check){console.log(`1.36 parity inputs verified: ${routes.length} routes, ${traces.length} mission/score states.`);process.exit(0);}

for(const [src,dest] of [['garden/assets/echo-garden/blue-gardens.webp','blue-gardens.webp'],['garden/assets/echo-garden/lotus.webp','lotus.webp'],['garden/source/app-icon-lotus.svg','lotus-icon.svg']])fs.copyFileSync(path.join(project,src),path.join(root,'assets',dest));

// PCM rendering retains the exact MIDI list, source sample, pitch ratio and
// sample-silence trim of GardenPad. Its Web Audio compressor/EQ are not emulated.
function readWave(file,midi){
 const b=fs.readFileSync(file);assert.equal(b.toString('ascii',0,4),'RIFF');let fmt,data;
 for(let p=12;p+8<=b.length;){const n=b.readUInt32LE(p+4),id=b.toString('ascii',p,p+4);if(id==='fmt ')fmt=b.subarray(p+8,p+8+n);if(id==='data')data=b.subarray(p+8,p+8+n);p+=8+n+(n%2);}
 assert(fmt&&data);const format=fmt.readUInt16LE(0),channels=fmt.readUInt16LE(2),rate=fmt.readUInt32LE(4),bits=fmt.readUInt16LE(14),width=bits/8;
 assert([1,3].includes(format));const frames=data.length/width/channels,pcm=Array.from({length:channels},()=>new Float32Array(frames));let peak=0;
 for(let i=0;i<frames;i++)for(let c=0;c<channels;c++){const off=(i*channels+c)*width;let x;
  if(format===3&&bits===32)x=data.readFloatLE(off);else if(bits===16)x=data.readInt16LE(off)/32768;else if(bits===24)x=data.readIntLE(off,3)/8388608;else if(bits===32)x=data.readInt32LE(off)/2147483648;else throw Error(`Unsupported PCM ${bits}`);
  pcm[c][i]=x;peak=Math.max(peak,Math.abs(x));
 }
 let start=0;outer:for(let i=0;i<frames;i++)for(let c=0;c<channels;c++)if(Math.abs(pcm[c][i])>peak*.005){start=Math.max(0,i/rate-.002);break outer;}
 return {midi,rate,channels,pcm,frames,start};
}
const bank=[['felt-c3.wav',48],['felt-e3.wav',52],['felt-g3.wav',55]].map(([f,m])=>readWave(path.join(project,'garden/assets/echo-garden/samples',f),m));
const rate=44100;
fs.mkdirSync(path.join(root,'data/audio'),{recursive:true});
const renderBar=(chord,seconds)=>{
 const frames=Math.round((seconds+.18)*rate),out=new Float32Array(frames*2),gain=.68/Math.sqrt(chord.notes.length)*.82*1.2;
 chord.notes.forEach((m,index)=>{
  const s=bank.reduce((a,b)=>Math.abs(b.midi-m)<Math.abs(a.midi-m)?b:a),step=2**((m-s.midi)/12)*s.rate/rate;
  for(let i=0;i<frames;i++){
   const pos=s.start*s.rate+i*step,k=Math.floor(pos);if(k+1>=s.frames)break;
   const fade=i/rate<seconds?1:(i/rate<seconds+.18?Math.exp(-(i/rate-seconds)/.035):0);
   for(let c=0;c<2;c++){const a=s.pcm[Math.min(c,s.channels-1)];out[i*2+c]+=(a[k]+(a[k+1]-a[k])*(pos-k))*gain*(index===0?.62:1)*fade;}
  }
 });return out;
};
for(const route of routes){
 const seconds=4,bar=Math.round(seconds*rate),count=route.sequence.length;
 const pcm=new Float32Array(bar*(count*2+1)*2);
 // One first lap follows the reference, then a separately rendered loop lap.
 // This avoids adding a fictitious previous-final-chord tail to first entry.
 for(const [index,chord] of [route.reference,...route.sequence,...route.sequence].entries()){
  const audio=renderBar(chord,seconds);
  for(let i=0;i<audio.length/2;i++){
   let target=index*bar+i;if(target>=bar*(count*2+1))target=bar*(count+1)+(target-bar*(count*2+1));
   pcm[target*2]+=audio[i*2];pcm[target*2+1]+=audio[i*2+1];
  }
 }
 const b=Buffer.alloc(44+pcm.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(pcm.length*2,40);
 for(let i=0;i<pcm.length;i++)b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,pcm[i]))*32767),44+i*2);
 fs.writeFileSync(path.join(root,'data/audio',route.id+'.wav'),b);
}
console.log(`Prepared ${routes.length} unchanged routes, approved assets, Felt Piano audio and ${traces.length} golden states.`);
