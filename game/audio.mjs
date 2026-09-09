import {bookReferenceEvents,cueEvents,progressionEvents} from './music.mjs';
import {intervalCue} from './intervals.mjs';
import {polyEvents} from './expedition.mjs';
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
  progression(route,targetIndex,onPart,onEnd,finale=false){
    this.stop();const token=this.token,cue=progressionEvents(route,targetIndex,finale),start=this.context.currentTime;
    this.lastCue={...cue,kind:finale?'route-finale':'harmonic-context',targetIndex,code:route.code,sound:'vertical sustained synth'};
    for(const event of cue.events){
      for(const midi of event.notes)this.note(midi,start+event.at,event.duration,route.timbre,.54/Math.sqrt(event.notes.length));
      this.schedule(()=>{if(token===this.token)onPart(event);},event.at);
    }
    this.schedule(()=>{if(token===this.token)onEnd();},cue.duration);
  }
  bookReference(route,targetIndex,onPart,onEnd){
    this.stop();const token=this.token,cue=bookReferenceEvents(route,targetIndex),start=this.context.currentTime;
    this.lastCue={...cue,kind:'book-reference',targetIndex,code:route.code,sound:'home note plus vertical target'};
    for(const event of cue.events){
      for(const midi of event.notes)this.note(midi,start+event.at,event.duration,route.timbre,.56/Math.sqrt(event.notes.length));
      this.schedule(()=>{if(token===this.token)onPart(event);},event.at);
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
  chordOnly(root,intervals,onEnd,mode='together'){
    this.stop();const token=this.token,start=this.context.currentTime;
    const notes=intervals.map(n=>root+n),order=mode==='down'?[...notes].reverse():notes;
    const step=mode==='together'?0:.24,duration=1.95+step*(notes.length-1);
    this.lastCue={kind:'chord-only',root,notes,mode,sound:'sustained synth'};
    order.forEach((note,i)=>this.note(note,start+.12+i*step,1.65,'synth',.6/Math.sqrt(notes.length)));
    this.schedule(()=>{if(token===this.token)onEnd();},duration);
  }
  guide(root,target,onEnd){
    this.stop();const token=this.token,start=this.context.currentTime;
    [0,4,7,10].forEach(n=>this.note(root+n,start+.12,.85,'soft',.24));
    this.note(root+(target==='3'?4:10),start+1.25,1.15,'synth',.45);
    this.schedule(()=>{if(token===this.token)onEnd();},2.6);
  }
  announce(text,onEnd){
    this.stop();const token=this.token;
    if(typeof window==='undefined'||!window.speechSynthesis||!window.SpeechSynthesisUtterance){this.schedule(()=>{if(token===this.token)onEnd();},.1);return;}
    const utterance=new window.SpeechSynthesisUtterance(text),voices=window.speechSynthesis.getVoices();
    utterance.lang='en-US';utterance.rate=.78;utterance.pitch=.72;utterance.volume=.95;
    utterance.voice=voices.find(v=>/Alex|Daniel|Reed|Ralph|Fred|Rocko/i.test(v.name)&&/^en/i.test(v.lang))||voices.find(v=>/^en[-_](US|GB)/i.test(v.lang))||null;
    let finished=false;const finish=()=>{if(finished||token!==this.token)return;finished=true;onEnd();};
    utterance.onend=finish;utterance.onerror=finish;window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
    this.schedule(finish,Math.max(3.2,text.length*.075));
  }
  trumpetChord(root,intervals,onEnd){
    this.stop();const token=this.token,start=this.context.currentTime+.08,phrase=[0,7,10,12];
    phrase.forEach((n,i)=>this.note(root+12+n,start+i*.18,.48,'synth',.34));
    const chordAt=start+1.0,notes=intervals.map(n=>root+n);notes.forEach(note=>this.note(note,chordAt,1.75,'synth',.62/Math.sqrt(notes.length)));
    this.lastCue={kind:'trumpeter-chord',root,notes,spoken:true,sound:'brass synth'};
    this.schedule(()=>{if(token===this.token)onEnd();},2.9);
  }
  melody(root,pattern,onEnd){
    this.stop();const token=this.token,start=this.context.currentTime+.12;let cursor=0;
    pattern.notes.forEach((offset,i)=>{const beats=pattern.beats[i]||.5;this.note(root+offset,start+cursor,Math.max(.22,beats*.46),'soft',.44);cursor+=beats*.48;});
    this.lastCue={kind:'melody-memory',root,name:pattern.name,notes:[...pattern.notes],sound:'keytar synth'};
    this.schedule(()=>{if(token===this.token)onEnd();},cursor+.35);
  }
  scale(root,mode,direction,onEnd){
    this.stop();const token=this.token,start=this.context.currentTime+.12,notes=(direction==='down'?[...mode.notes].reverse():mode.notes).map(n=>root+n);
    notes.forEach((note,i)=>this.note(note,start+i*.25,.58,'synth',.36));
    this.lastCue={kind:'mode-scale',root,name:mode.name,direction,notes,sound:'guitar synth'};
    this.schedule(()=>{if(token===this.token)onEnd();},notes.length*.25+.55);
  }
  artifactReveal(type,onEnd){
    this.stop();const token=this.token,ctx=this.context;
    if(!ctx){this.schedule(()=>{if(token===this.token)onEnd();},.05);return;}
    const start=ctx.currentTime+.04,root=type===4?41:36+(type%5)*2;
    // Servo rumble, three latch strikes and a short luminous confirmation.
    this.note(root,start,.72,'soft',.24);
    [0,.13,.27].forEach((offset,i)=>{this.drum(i===2?'snare':'clave',start+offset,.75+i*.12);this.note(root+12+i*5,start+offset,.16,'synth',.18);});
    [24,31,36].forEach((interval,i)=>this.note(root+interval,start+.38+i*.07,.42,'soft',.16));
    this.lastCue={kind:type===4?'artifact-roulette':'artifact-opening',type,sound:'mechanical latches and energy flash'};
    this.schedule(()=>{if(token===this.token)onEnd();},.84);
  }
  rouletteTick(final=false){
    const ctx=this.context;if(!ctx)return;const at=ctx.currentTime+.01;
    this.drum(final?'snare':'clave',at,final?1.2:.68);
    this.note(final?79:67,at,final?.32:.08,'soft',final?.2:.08);
  }
  drum(voice,at,velocity=1){
    const ctx=this.context,osc=ctx.createOscillator(),gain=ctx.createGain();
    const freq={kick:120,snare:185,hat:7200,ride:4800,clave:1800,rim:1100}[voice];
    const duration=voice==='ride'?.22:voice==='kick'?.18:.07;
    osc.type=['hat','ride','snare'].includes(voice)?'square':'sine';
    osc.frequency.setValueAtTime(freq,at);osc.frequency.exponentialRampToValueAtTime(voice==='kick'?42:freq*.78,at+duration);
    gain.gain.setValueAtTime((voice==='kick'?.35:voice==='snare'?.13:voice==='clave'?.15:.035)*velocity,at);
    gain.gain.exponentialRampToValueAtTime(.00001,at+duration);
    osc.connect(gain);gain.connect(this.master);osc.start(at);osc.stop(at+duration+.01);this.voices.add(osc);
    osc.onended=()=>{this.voices.delete(osc);osc.disconnect();gain.disconnect();};
  }
  rhythm(pattern,onEnd,{loops=1,onBeat=()=>{}}={}){
    this.stop();const token=this.token,start=this.context.currentTime+.15,beat=60/110;
    const beats=pattern.beats||8;
    for(let loop=0;loop<loops;loop++){
      for(const event of pattern.events){const at=start+(loop*beats+event.beat)*beat;
        if(event.voice==='bass')this.note(event.midi,at,.34,'synth',.42);
        else if(event.voice==='keys')for(const midi of event.notes)this.note(midi,at,.26,'synth',.25);
        else this.drum(event.voice,at,event.velocity??1);
      }
      for(let i=0;i<beats;i++)this.schedule(()=>{if(token===this.token)onBeat(i,loop);},.15+(loop*beats+i)*beat);
    }
    this.schedule(()=>{if(token===this.token)onEnd();},beats*loops*beat+.4);
  }
  poly(pattern,onEnd,{cycles=3,layer='both',onHit=()=>{}}={}){
    if(pattern.sticking)return this.rhythm(pattern,onEnd,{loops:cycles});
    this.stop();const token=this.token,start=this.context.currentTime+.15,beat=60/110;
    for(const event of polyEvents(pattern,cycles,layer)){
      this.drum(event.voice,start+event.beat*beat);
      this.schedule(()=>{if(token===this.token)onHit(event);},.15+event.beat*beat);
    }
    this.lastCue={kind:'polyrhythm',a:pattern.a,b:pattern.b,cycles,layer};
    this.schedule(()=>{if(token===this.token)onEnd();},cycles*4*beat+.4);
  }
  stop(){this.token++;this.timers.forEach(clearTimeout);this.timers.clear();this.voices.forEach(v=>{try{v.stop();}catch{}});this.voices.clear();try{if(typeof window!=='undefined')window.speechSynthesis?.cancel();}catch{}}
}
