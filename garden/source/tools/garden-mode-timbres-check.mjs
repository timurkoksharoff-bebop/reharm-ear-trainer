import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {GARDEN_MODAL_SAMPLE_BANKS} from '../garden-modal-samples.mjs';
import {GARDEN_MODE_TIMBRES,GardenModeTimbreSettings,GardenModeTimbres,gardenModalSampleFor,gardenModalPlaybackRate} from '../garden-mode-timbres.mjs';
import {GardenPad} from '../garden-harmony.mjs';

// Source runs use art/; a copied PWA source checker uses the packaged assets.
const candidates=[new URL('../art/modal-audio/',import.meta.url),new URL('../../assets/echo-garden/samples/modal/',import.meta.url)];
const assetRoot=candidates.map(fileURLToPath).find(folder=>fs.existsSync(path.join(folder,'SHA256SUMS.txt')));
assert(assetRoot,'modal WAVs and licences are present');
const read=name=>fs.readFileSync(path.join(assetRoot,name));
const hash=(algorithm,data)=>createHash(algorithm).update(data).digest('hex');
const close=(actual,expected,message)=>assert(Math.abs(actual-expected)<1e-10,message||`${actual} != ${expected}`);

function pcmWav(raw){
 assert.equal(raw.toString('ascii',0,4),'RIFF');assert.equal(raw.toString('ascii',8,12),'WAVE');
 let format=null,pcm=null;
 for(let pos=12;pos+8<=raw.length;){
  const name=raw.toString('ascii',pos,pos+4),length=raw.readUInt32LE(pos+4),chunk=raw.subarray(pos+8,pos+8+length);
  assert.equal(chunk.length,length,'complete RIFF chunk');
  if(name==='fmt '){
   const kind=chunk.readUInt16LE(0);
   assert(kind===1||kind===65534,'PCM or extensible PCM WAV');
   if(kind===65534)assert.equal(chunk.readUInt16LE(24),1,'extensible subtype is PCM');
   format={channels:chunk.readUInt16LE(2),sampleRate:chunk.readUInt32LE(4),bits:chunk.readUInt16LE(14)};
  }
  if(name==='data')pcm=chunk;
  pos+=8+length+(length%2);
 }
 assert(format&&pcm);assert.deepEqual(format,{channels:1,sampleRate:44100,bits:16});
 const samples=new Float32Array(pcm.length/2);
 for(let i=0;i<samples.length;i++)samples[i]=pcm.readInt16LE(i*2)/32768;
 return {...format,pcm,samples,frames:samples.length,duration:samples.length/44100};
}

// PCM hashes were checked against original FLAC STREAMINFO MD5s (Wurli) or
// exact original archive WAVs (organ), not generated from the runtime sampler.
const expected=[
 ['wurli-ab3mp.wav',56,0,-8,-5.3,'f2348930ee5dda317eadd7c2204e54c1'],
 ['wurli-db4mp.wav',61,0,4,-5.3,'8cedddb4235e26c83d2641eda827b3f6'],
 ['wurli-gb4mp.wav',66,0,7,-5.4,'993e2e516e62d8fd6c82da228edcb8b1'],
 ['wurli-db5mp.wav',73,0,3,-5.4,'a2a47483f1c6608c28ae2504efb1f772'],
 ['wurli-g5mp.wav',79,0,-8,-5.4,'de59113cdc12ab60fd01db1f2b5554af'],
 ['wurli-db6mp.wav',85,0,6,-5.6,'cc71503c33a2d3e040b36857eebb0335'],
 ['wurli-ab3f.wav',56,1,-11,-4.8,'16a7734a7dc8f4c4e61b4197a7fd1034'],
 ['wurli-db4f.wav',61,1,-2,-4.8,'d56bb2dc46e8b68873627e66656820ab'],
 ['wurli-ab4f.wav',68,1,0,-5,'6cf3426d298af0439f1391d15a7018b8'],
 ['wurli-db5f.wav',73,1,3,-6,'1d91de2540cf77a109079ac019eaea61'],
 ['wurli-g5f.wav',79,1,-7,-5.9,'8589262c30d8b5e5934d9da8a070356a'],
 ['wurli-db6f.wav',85,1,0,-5.9,'2f93c6533cc839e66039f9cd6a207324'],
 ['organ-c4.wav',60,0,0,0,'929f76cf0235994670532f9ab21aeca1'],
 ['organ-c5.wav',72,0,0,0,'6054b88987da475d3df62b11374f18c6'],
 ['organ-c6.wav',84,0,0,0,'d68d93aa43849ba7ab7b457d53b537e5']
];
const sums=new Map(read('SHA256SUMS.txt').toString().trim().split('\n').map(line=>{const [sha,file]=line.split(/\s+/);return[file,sha];}));
const allSamples=Object.values(GARDEN_MODAL_SAMPLE_BANKS).flatMap(bank=>bank.samples),decoded=new Map();
assert.equal(allSamples.length,15);assert.equal(sums.size,15);
let bytes=0;
for(const [name,midi,layer,tune,gainDb,pcmMd5] of expected){
 const raw=read(name),wav=pcmWav(raw),entry=allSamples.find(sample=>sample.file==='modal/'+name);
 assert(entry,name+' is mapped');assert.deepEqual([entry.midi,entry.layer,entry.tune,entry.gainDb],[midi,layer,tune,gainDb]);
 assert.equal(hash('sha256',raw),sums.get(name));assert.equal(hash('md5',wav.pcm),pcmMd5);
 assert(wav.duration>.6&&wav.duration<5);bytes+=raw.length;decoded.set(name,wav);
 if(name.startsWith('organ-')){assert(entry.loopStart>0&&entry.loopEnd>entry.loopStart&&entry.loopEnd<wav.duration);}
}
assert.equal(bytes,2995158);
const credits=read('MODAL_SAMPLE_CREDITS.md').toString();
for(const name of ['Greg Sullivan','kinwie','Roberto','FreePats','setBfree'])assert(credits.includes(name),'credit: '+name);
assert(credits.includes('creativecommons.org/licenses/by/3.0/'));
assert(credits.includes('creativecommons.org/publicdomain/zero/1.0/'));
assert(read('GREG_SULLIVAN_CC_BY_3_0.txt').toString().includes('Attribution 3.0 Unported'));
assert(read('FREEPATS_ORGAN_README.txt').toString().includes('Recorded from setBfree software synthesizer'));

const memory=new Map(),storage={getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value)};
const settings=new GardenModeTimbreSettings({storage});assert.deepEqual(settings.snapshot(),{timbre:'flute'});
for(const timbre of ['wurli','drawbar','flute']){settings.set({timbre});assert.equal(new GardenModeTimbreSettings({storage}).snapshot().timbre,timbre);}
settings.set({timbre:'wurli'});const snapshot=settings.snapshot();snapshot.timbre='drawbar';assert.equal(settings.snapshot().timbre,'wurli');
assert.equal(settings.set({timbre:'unknown'}).timbre,'flute');
memory.set('ear-yoga-mode-timbre.v1','{broken');assert.equal(new GardenModeTimbreSettings({storage}).snapshot().timbre,'flute');
memory.set('ear-yoga-mode-timbre.v1',JSON.stringify({version:2,timbre:'wurli'}));assert.equal(new GardenModeTimbreSettings({storage}).snapshot().timbre,'flute');
const blocked=new GardenModeTimbreSettings({storage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}}});
assert.equal(blocked.set({timbre:'drawbar'}).timbre,'drawbar');assert.equal(blocked.reset().timbre,'flute');
assert.deepEqual(GARDEN_MODE_TIMBRES.map(item=>item.id),['flute','wurli','drawbar']);

let pitchCases=0;
for(const bank of Object.values(GARDEN_MODAL_SAMPLE_BANKS))for(let midi=48;midi<=96;midi++)for(const velocity of [.4,.8,.839,.84,.95,1]){
 const chosen=gardenModalSampleFor(bank,midi,velocity),layer=bank.samples.some(sample=>sample.layer===1)&&velocity>=.84?1:0;
 assert.equal(chosen.layer,layer);const candidates=bank.samples.filter(sample=>sample.layer===layer);
 assert.equal(Math.abs(chosen.midi-midi),Math.min(...candidates.map(sample=>Math.abs(sample.midi-midi))));
 const rate=gardenModalPlaybackRate(midi,chosen);assert(Number.isFinite(rate)&&rate>0);
 // Twelve target semitones must double playback rate, with the source tune kept.
 close(gardenModalPlaybackRate(midi+12,chosen)/rate,2);pitchCases++;
}
const ab3=GARDEN_MODAL_SAMPLE_BANKS.wurli.samples[0];
close(gardenModalPlaybackRate(56,ab3),2**(-8/1200),'negative SFZ correction lowers the original recording');
close(gardenModalPlaybackRate(68,ab3),2*2**(-8/1200));
assert.equal(gardenModalSampleFor(null,60),null);assert.equal(gardenModalSampleFor(GARDEN_MODAL_SAMPLE_BANKS.wurli,NaN),null);

function makeContext(){
 const context={currentTime:10,state:'running',sources:[],gains:[],decoded:0};
 context.createGain=()=>{const calls=[],param={value:1,cancelScheduledValues:at=>calls.push(['cancel',at]),setValueAtTime:(value,at)=>calls.push(['set',value,at]),linearRampToValueAtTime:(value,at)=>calls.push(['ramp',value,at])};const gain={gain:param,calls,connect(destination){this.destination=destination;},disconnect(){this.disconnected=true;}};context.gains.push(gain);return gain;};
 context.createBufferSource=()=>{const source={playbackRate:{value:1},starts:[],stops:[],connect(destination){this.destination=destination;},disconnect(){this.disconnected=true;},start(at){this.starts.push(at);},stop(at){this.stops.push(at);}};context.sources.push(source);return source;};
 context.decodeAudioData=async raw=>{context.decoded++;const wav=pcmWav(Buffer.from(raw));return{numberOfChannels:1,sampleRate:44100,length:wav.frames,duration:wav.duration,getChannelData:()=>wav.samples};};
 context.suspend=async()=>{context.state='suspended';};return context;
}
const originalFetch=globalThis.fetch,originalEmbedded=globalThis.GARDEN_SAMPLE_DATA,originalTimeout=globalThis.setTimeout;
let fetches=0;
globalThis.fetch=async url=>{fetches++;const name=String(url).split('/').at(-1),raw=read(name);return{ok:true,arrayBuffer:async()=>raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength)};};
try{
 let allowReady;const ready=new Promise(resolve=>{allowReady=resolve;}),context=makeContext(),engine=new GardenModeTimbres(context,{ready});
 assert.equal(await engine.prepare('flute'),null);assert.equal(fetches,0);
 const loading=engine.prepare('wurli'),again=engine.prepare('wurli');await Promise.resolve();assert.equal(fetches,0,'ready barrier blocks early mobile downloads');
 allowReady();const [bank,bankAgain]=await Promise.all([loading,again]);assert.equal(bank,bankAgain);assert.equal(fetches,12);assert.equal(context.decoded,12);
 assert.equal(await engine.prepare('wurli'),bank);assert.equal(fetches,12,'bank buffers are reused');assert.equal(bank.samples.length,12);assert(bank.level>0&&bank.level<4);
 const destination={},event={midi:61,onset:.25,duration:.4,velocity:.6},source=engine.schedule('wurli',event,12,destination),envelope=source.destination;
 assert.equal(source.buffer,bank.samples.find(sample=>sample.midi===61&&sample.layer===0).buffer);
 close(source.playbackRate.value,2**(4/1200));close(source.starts[0],12.25);close(source.stops[0],12.652);
 assert.equal(envelope.destination,destination);assert.equal(envelope.calls[0][1],0);close(envelope.calls.at(-1)[1],0);
 close(envelope.calls[1][1],bank.level*10**(-5.3/20)*.6,'relative SFZ volume retained at runtime');
 source.onended();assert(source.disconnected&&envelope.disconnected,'ended note releases both nodes');
 const organ=await engine.prepare('drawbar');assert.equal(context.decoded,15);assert.equal(fetches,15);
 const organSource=engine.schedule('drawbar',{midi:72,onset:0,duration:2,velocity:.7},15,destination),organSample=organ.samples.find(sample=>sample.midi===72);
 assert.equal(organSource.loop,true);close(organSource.loopStart,50253/44100);close(organSource.loopEnd,197631/44100);assert.equal(organSource.buffer,organSample.buffer);
 assert.equal(engine.schedule('missing',event,12,destination),null);await assert.rejects(engine.prepare('missing'));

 // Embedded/offline byte path decodes the same original samples without fetch.
 globalThis.GARDEN_SAMPLE_DATA=Object.fromEntries(GARDEN_MODAL_SAMPLE_BANKS.drawbar.samples.map(sample=>['assets/echo-garden/samples/'+sample.file,read(sample.file.split('/').at(-1)).toString('base64')]));
 const embeddedContext=makeContext(),embedded=new GardenModeTimbres(embeddedContext),beforeFetch=fetches;
 await embedded.prepare('drawbar');assert.equal(fetches,beforeFetch);assert.equal(embeddedContext.decoded,3);delete globalThis.GARDEN_SAMPLE_DATA;

 // Retry failed loads instead of permanently caching a rejected bank promise.
 let fail=true;const normalFetch=globalThis.fetch;globalThis.fetch=async url=>fail?{ok:false}:normalFetch(url);
 const retry=new GardenModeTimbres(makeContext());await assert.rejects(retry.prepare('drawbar'));assert.equal(retry.pending.size,0);fail=false;assert(await retry.prepare('drawbar'));globalThis.fetch=normalFetch;

 // Exercise the actual GardenPad cancellation owner with scheduled future
 // sample notes, not a rewritten stand-in for its stop closure.
 const timers=[];globalThis.setTimeout=(callback,delay)=>{timers.push({callback,delay});return timers.length;};
 const pad=new GardenPad();pad.context=context;pad.cleanOutput=context.createGain();pad.modeTimbres=engine;pad.modeTimbre=new GardenModeTimbreSettings();pad.modeTimbre.set({timbre:'wurli'});
 const sourceStart=context.sources.length;
 assert(pad.previewScale([60,62,64,65,67,69,71,72],{remaining:3,phrasing:'exercise'}));
 const firstSources=context.sources.slice(sourceStart);assert(firstSources.length>=3);assert.equal(pad.preset,'felt','modal voice never changes the chord preset');assert.equal(pad.transients.size,1);
 context.currentTime=10.03;pad.modePreviewStop();assert.equal(pad.transients.size,0);assert.equal(pad.lastModePreview.active,false);
 assert(firstSources.every(item=>item.stops.at(-1)===10.048));assert(firstSources.slice(1).every(item=>item.stops.at(-1)<item.starts[0]),'future notes are cancelled before their onset');
 timers.filter(timer=>timer.delay===25).forEach(timer=>timer.callback());assert(firstSources.every(item=>item.disconnected));
 const stopCounts=firstSources.map(item=>item.stops.length);timers.forEach(timer=>timer.callback());assert.deepEqual(firstSources.map(item=>item.stops.length),stopCounts,'late timeout is idempotent after cancellation');
 assert(pad.previewScale([60,62,64,65,67,69,71,72],{remaining:3,phrasing:'exercise'}));
 pad.backgroundSilence();assert.equal(pad.backgrounded,true);timers.findLast(timer=>timer.delay===60).callback();assert.equal(context.state,'suspended');assert.equal(pad.transients.size,0);
 console.log(JSON.stringify({pass:true,samples:15,wavBytes:bytes,pitchCases,checks:['PCM/SHA integrity','credit/licence files','settings persistence','nearest root and two layers','SFZ tuning/gains/loops','readiness/cache/offline bytes/retry','future-note cancellation/background stop']},null,2));
}finally{globalThis.fetch=originalFetch;globalThis.GARDEN_SAMPLE_DATA=originalEmbedded;globalThis.setTimeout=originalTimeout;}
