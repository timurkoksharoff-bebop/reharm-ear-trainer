import assert from 'node:assert/strict';
import {FlightAudio} from '../audio.mjs';
let spoken;
globalThis.window={SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{cancel(){},resume(){},getVoices(){return [{name:'Samantha',lang:'en-US'},{name:'Daniel',lang:'en-GB'}];},speak(u){spoken=u;},speaking:false}};
const audio=new FlightAudio();let timers=[];audio.schedule=(fn)=>timers.push(fn);
for(const [voice,name] of [['female','Samantha'],['male','Daniel']]){
 let result;audio.announce('Chord. B flat seven.',ok=>result=ok,{voice});
 assert.equal(spoken.voice.name,name);assert.equal(audio.utterance,spoken);assert.equal(result,undefined);
 spoken.onstart();spoken.onend();assert.equal(result,true);
}
let result;audio.announce('Find the tensions.',ok=>result=ok);spoken.onerror({error:'not-allowed'});assert.equal(result,false);assert.equal(audio.speechStatus.error,'not-allowed');
audio.announce('Catch all tones.',()=>assert.fail('Cancelled speech completed'));const stale=spoken;audio.stop();stale.onend();
console.log('Speech checks passed: distinct voices, synchronous start, retained utterance, failure reporting and cancellation.');
