import {GARDEN_MODAL_SAMPLE_BANKS} from './garden-modal-samples.mjs';

export const GARDEN_MODE_TIMBRES=Object.freeze([
 {id:'flute',ru:'Воздушный · исходный',en:'Airy · original'},
 {id:'wurli',ru:'Wurlitzer EP200',en:'Wurlitzer EP200'},
 {id:'drawbar',ru:'Джазовый орган',en:'Jazz drawbar organ'}
]);
const validTimbre=value=>GARDEN_MODE_TIMBRES.some(item=>item.id===value)?value:'flute';
export class GardenModeTimbreSettings{
 constructor({storage=null}={}){this.storage=storage;let saved;try{saved=JSON.parse(storage?.getItem('ear-yoga-mode-timbre.v1')||'null');}catch{}this.value={timbre:validTimbre(saved?.version===1?saved.timbre:null)};}
 snapshot(){return {...this.value};}
 set({timbre}={}){this.value={timbre:validTimbre(timbre)};try{this.storage?.setItem('ear-yoga-mode-timbre.v1',JSON.stringify({version:1,...this.value}));}catch{}return this.snapshot();}
 reset(){return this.set({timbre:'flute'});}
}
export function gardenModalSampleFor(bank,midi,velocity=1){
 if(!bank?.samples?.length||!Number.isFinite(midi))return null;
 const layers=[...new Set(bank.samples.map(sample=>sample.layer||0))].sort((a,b)=>a-b);
 const layer=layers.length>1&&velocity>=.84?layers.at(-1):layers[0];
 const candidates=bank.samples.filter(sample=>(sample.layer||0)===layer);
 return candidates.reduce((best,item)=>Math.abs(item.midi-midi)<Math.abs(best.midi-midi)?item:best,candidates[0]);
}
export const gardenModalPlaybackRate=(midi,sample)=>2**((midi-sample.midi+(sample.tune||0)/100)/12);

// A separate sampler for modal lines. Chord banks, their attacks and level
// matching stay in GardenPad. Retain the original SFZ tuning, layers and loops.
export class GardenModeTimbres{
 constructor(context,{ready=Promise.resolve()}={}){this.context=context;this.ready=ready;this.banks=new Map();this.pending=new Map();}
 async prepare(id){
  if(id==='flute')return null;
  if(this.banks.has(id))return this.banks.get(id);
  const spec=GARDEN_MODAL_SAMPLE_BANKS[id];if(!spec)throw Error('Неизвестный тембр ладов.');
  if(!this.pending.has(id))this.pending.set(id,(async()=>{
   await this.ready;
   const samples=await Promise.all(spec.samples.map(async sample=>{
    const url='assets/echo-garden/samples/'+sample.file,embedded=globalThis.GARDEN_SAMPLE_DATA?.[url];
    let bytes;if(embedded)bytes=Uint8Array.from(atob(embedded),c=>c.charCodeAt(0)).buffer;
    else{const response=await fetch(url,{priority:'low'});if(!response.ok)throw Error('Не загрузился тембр ладов: '+id);bytes=await response.arrayBuffer();}
    const buffer=await this.context.decodeAudioData(bytes.slice(0));return {...sample,buffer};
   }));
   // One gain for the complete bank preserves the recorded soft/loud layers.
   // Compare the first 350ms of the original recordings, including SFZ gains.
   const soft=samples.filter(sample=>(sample.layer||0)===0);let energy=0;
   for(const sample of soft){let sum=0,count=0;const gain=10**((sample.gainDb||0)/20);for(let channel=0;channel<sample.buffer.numberOfChannels;channel++){const data=sample.buffer.getChannelData(channel),end=Math.min(data.length,Math.round(sample.buffer.sampleRate*.35));for(let frame=0;frame<end;frame++){sum+=data[frame]*data[frame]*gain*gain;count++;}}energy+=count?sum/count:0;}
   const rms=Math.sqrt(energy/Math.max(1,soft.length)),level=rms?Math.min(4,.033/rms):1;
   const bank={...spec,samples,level};this.banks.set(id,bank);return bank;
  })().finally(()=>this.pending.delete(id)));
  return this.pending.get(id);
 }
 get(id){return this.banks.get(id)||null;}
 schedule(id,event,at,destination){
  const c=this.context,bank=this.get(id),sample=gardenModalSampleFor(bank,event.midi,event.velocity);if(!sample)return null;
  const source=c.createBufferSource(),level=c.createGain(),start=at+event.onset,gate=event.duration,release=Math.min(.045,gate*.3),attack=Math.min(id==='drawbar'?.008:.004,gate*.12);
  source.buffer=sample.buffer;source.playbackRate.value=gardenModalPlaybackRate(event.midi,sample);
  if(Number.isFinite(sample.loopStart)&&Number.isFinite(sample.loopEnd)&&sample.loopEnd>sample.loopStart){source.loop=true;source.loopStart=sample.loopStart;source.loopEnd=sample.loopEnd;}
  const velocity=Math.max(.25,Math.min(1.1,event.velocity??1)),peak=bank.level*10**((sample.gainDb||0)/20)*velocity;
  level.gain.setValueAtTime(0,start);level.gain.linearRampToValueAtTime(peak,start+attack);level.gain.setValueAtTime(peak,start+Math.max(attack,gate-release));level.gain.linearRampToValueAtTime(0,start+gate);
  source.connect(level);level.connect(destination);source.onended=()=>{try{source.disconnect();level.disconnect();}catch{}};
  source.start(start);source.stop(start+gate+.002);return source;
 }
}
