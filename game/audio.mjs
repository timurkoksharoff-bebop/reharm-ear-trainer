import {cueEvents} from './music.mjs';
import {intervalCue} from './intervals.mjs';
// A sustained, pitch-stable two-oscillator arcade synth. No sample/network
// dependency and no detuning/vibrato that could blur interval recognition.
export class FlightAudio {
  constructor(){this.context=null;this.voices=new Set();this.timers=new Set();this.token=0;this.lastCue=null;}
  async unlock(){
    const Engine=window.AudioContext||window.webkitAudioContext;
    if(!Engine)throw new Error('Браузер не поддерживает Web Audio. Открой игру в Safari или Chrome.');
    if(!this.context||this.context.state==='closed'){
      this.context=new Engine();this.master=this.context.createGain();this.master.gain.value=.5;
      const compressor=this.context.createDynamicsCompressor();compressor.threshold.value=-16;compressor.ratio.value=4;
      this.master.connect(compressor);compressor.connect(this.context.destination);
    }
    try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
    await this.context.resume();
    if(this.context.state!=='running')throw new Error('Звук приостановлен. Нажми «Продолжить» ещё раз.');
    this.note(57,this.context.currentTime,.07,'soft',.00003);
  }
  note(midi,at,duration,timbre='synth',level=.38){
    const ctx=this.context;if(!ctx)return;
    const fundamental=440*2**((midi-69)/12),envelope=ctx.createGain(),filter=ctx.createBiquadFilter();
    const body=ctx.createOscillator(),core=ctx.createOscillator(),coreGain=ctx.createGain();
    body.type=timbre==='soft'?'triangle':'sawtooth';core.type='sine';
    body.frequency.setValueAtTime(fundamental,at);core.frequency.setValueAtTime(fundamental,at);coreGain.gain.value=.4;
    filter.type='lowpass';filter.Q.value=.65;
    const cutoff=Math.min(4800,Math.max(1400,fundamental*5));
    filter.frequency.setValueAtTime(cutoff,at);filter.frequency.exponentialRampToValueAtTime(cutoff*.65,at+Math.min(.25,duration*.4));
    level*=.6;
    envelope.gain.setValueAtTime(.00001,at);envelope.gain.exponentialRampToValueAtTime(level,at+.016);
    envelope.gain.exponentialRampToValueAtTime(level*.72,at+Math.min(.14,duration*.35));
    envelope.gain.setValueAtTime(level*.72,at+duration*.74);
    envelope.gain.exponentialRampToValueAtTime(.00001,at+duration);
    body.connect(filter);core.connect(coreGain);coreGain.connect(filter);filter.connect(envelope);envelope.connect(this.master);
    let remaining=2;
    for(const oscillator of [body,core]){
      oscillator.start(at);oscillator.stop(at+duration+.005);this.voices.add(oscillator);
      oscillator.onended=()=>{oscillator.disconnect();this.voices.delete(oscillator);if(--remaining===0){coreGain.disconnect();filter.disconnect();envelope.disconnect();}};
    }
  }
  schedule(callback,seconds){const id=setTimeout(()=>{this.timers.delete(id);callback();},seconds*1000);this.timers.add(id);}
  play(route,chord,sector,onPart,onEnd){
    this.stop();const token=this.token,cue=cueEvents(route,chord,sector),start=this.context.currentTime;
    this.lastCue={...cue,key:route.key,register:route.register,contextState:this.context.state,sound:'sustained synth'};
    for(const event of cue.events){
      for(const midi of event.notes)this.note(midi,start+event.at,event.duration,route.timbre,.58/Math.sqrt(event.notes.length));
      if(event.part!=='tone')this.schedule(()=>{if(token===this.token)onPart(event.part);},event.at);
    }
    this.schedule(()=>{if(token===this.token)onEnd();},cue.duration);
  }
  example(route,offset,quality='maj',sector=0,onPart=()=>{},onEnd=()=>{}){this.play(route,{offset,quality},sector,onPart,onEnd);}
  interval(base,semitones,mode,onEnd){
    this.stop();const token=this.token,cue=intervalCue(base,semitones,mode),start=this.context.currentTime;
    this.lastCue={...cue,kind:'interval',base,semitones,mode,sound:'sustained synth'};
    for(const event of cue.events)for(const midi of event.notes)this.note(midi,start+event.at,event.duration,'synth',.5/Math.sqrt(event.notes.length));
    this.schedule(()=>{if(token===this.token)onEnd();},cue.duration);
  }
  stop(){this.token++;this.timers.forEach(clearTimeout);this.timers.clear();this.voices.forEach(v=>{try{v.stop();}catch{}});this.voices.clear();}
}
