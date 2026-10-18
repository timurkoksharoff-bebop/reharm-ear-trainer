import assert from 'node:assert/strict';
import {GardenRecorder,gardenRecordingSupported,gardenRecordingMime} from '../garden-recording.mjs';
class Track extends EventTarget{constructor(kind){super();this.kind=kind;this.readyState='live';}stop(){this.readyState='ended';}end(){this.readyState='ended';this.dispatchEvent(new Event('ended'));}}
class Stream{constructor(tracks=[]){this.tracks=tracks;}getTracks(){return this.tracks;}getVideoTracks(){return this.tracks.filter(t=>t.kind==='video');}getAudioTracks(){return this.tracks.filter(t=>t.kind==='audio');}}
class Recorder{
 static isTypeSupported(type){return type==='video/webm;codecs=vp8,opus';}
 constructor(stream,options){this.stream=stream;this.mimeType=options.mimeType;this.state='inactive';}
 start(){this.state='recording';}
 stop(){this.state='inactive';queueMicrotask(()=>{this.ondataavailable?.({data:new Blob(['realistic-recorded-data'],{type:this.mimeType})});this.onstop?.();});}
}
const env={isSecureContext:true,MediaRecorder:Recorder,MediaStream:Stream,navigator:{userAgent:'Chrome Mac OS',mediaDevices:{getDisplayMedia(){}}}};
assert(gardenRecordingSupported(env));
for(const userAgent of ['iPhone','iPad','Android'])assert(!gardenRecordingSupported({...env,navigator:{...env.navigator,userAgent}}),'no mobile button or hint');
assert(!gardenRecordingSupported({...env,navigator:{...env.navigator,platform:'MacIntel',maxTouchPoints:5}}));
assert(!gardenRecordingSupported({...env,isSecureContext:false}));assert(!gardenRecordingSupported({...env,navigator:{}}));
assert.equal(gardenRecordingMime(Recorder),'video/webm;codecs=vp8,opus');
const video=new Track('video'),unusedAudio=new Track('audio'),display=new Stream([video,unusedAudio]);
const connected=new Set(['speakers']);let unlocks=0,options,results=[],changes=[];
const pad={unlock:async()=>{unlocks++;},context:{createMediaStreamDestination:()=>({stream:new Stream([new Track('audio')])})},master:{connect:node=>connected.add(node),disconnect:node=>connected.delete(node)}};
const recorder=new GardenRecorder({pad,Recorder,Stream,capture:value=>{options=value;return Promise.resolve(display);},onReady:r=>results.push(r),onChange:state=>changes.push(state)});
assert.equal(unlocks,0,'nothing starts on construction');
const start=recorder.start();assert(options,'picker requested synchronously inside user click');assert.equal(await recorder.start(),false,'no overlapping captures');assert(await start);
assert.equal(options.audio,false);assert.equal(options.systemAudio,'exclude');assert.equal(unlocks,1);
assert.deepEqual(recorder.session.recorder.stream.getTracks().map(t=>t.kind),['video','audio']);
assert.equal(recorder.session.recorder.stream.getAudioTracks()[0],recorder.session.audio.stream.getAudioTracks()[0],'only game output, not captured system audio');
recorder.stop();await Promise.resolve();assert.equal(recorder.state,'idle');assert.equal(results.length,1);assert(results[0].blob.size>0);assert.equal(results[0].extension,'webm');
assert.equal(connected.size,1);assert(connected.has('speakers'),'normal listening destination is never disconnected');assert.equal(video.readyState,'ended');assert.equal(unusedAudio.readyState,'ended');
let rejected;
const cancel=new GardenRecorder({pad,Recorder,Stream,capture:()=>Promise.reject(Object.assign(Error('cancelled'),{name:'NotAllowedError'})),onChange:(state,error)=>{if(state==='error')rejected=error;}});
assert.equal(await cancel.start(),false);assert.equal(cancel.state,'idle');assert.equal(rejected.name,'NotAllowedError');assert.equal(connected.size,1);
const endedVideo=new Track('video'),ended=new GardenRecorder({pad,Recorder,Stream,capture:async()=>new Stream([endedVideo]),onReady:r=>results.push(r)});
await ended.start();endedVideo.end();await Promise.resolve();assert.equal(ended.state,'idle');assert.equal(results.length,2,'browser sharing stop finalizes recording too');
let resolvePicker;const late=new Track('video'),pending=new GardenRecorder({pad,Recorder,Stream,capture:()=>new Promise(resolve=>{resolvePicker=resolve;})});
const promise=pending.start();pending.dispose();resolvePicker(new Stream([late]));assert.equal(await promise,false);assert.equal(late.readyState,'ended','late picker permission cannot leave a capture running');
assert.equal(connected.size,1);assert(changes.includes('recording')&&changes.includes('stopping'));
console.log('Recording passed: explicit consent, desktop-only controls, game-only audio, cleanup, cancellation, external stop, download blob and preserved speakers.');
