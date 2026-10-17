import {BOOK_CATALOG} from './book-catalog.mjs';
import {INTERVALS,DEGREES,QUALITIES} from './music.mjs';
import {createGardenArrangement,gardenArrangementEvents} from './garden-arrangement.mjs';

const GARDEN_INTERVALS={...INTERVALS,'1':[0],m:INTERVALS.min,'m7♭5':INTERVALS.m7b5,sus2:[0,2,7],sus4:[0,5,7],add9:[0,4,7,14],m9:INTERVALS.m7natural9};
export const gardenDegreeLabel=offset=>DEGREES[Number(offset)]?.glyph??'?';
export const gardenQualityLabel=quality=>quality==='1'?'1 / 8':QUALITIES[quality]?.glyph??quality;
export const gardenCanonicalQuality=quality=>({m:'min','m7♭5':'m7b5',m9:'m7natural9'})[quality]??quality;
// Both degrees are relative to the route tonic, never to one another.
export const gardenRootOffset=chord=>Number(chord.offset);
export function gardenRouteWindow(length,cursor,page=null){
  const size=8,paged=length>12,pages=paged?Math.ceil(length/size):1;
  const index=Math.min(pages-1,Math.max(0,page??Math.floor(Math.max(0,cursor)/size)));
  return {paged,page:index,pages,start:paged?index*size:0,end:paged?Math.min(length,(index+1)*size):length};
}
export const gardenBassOffset=chord=>Number(chord.bassOffset??chord.offset);
export const gardenHasIndependentBass=chord=>gardenBassOffset(chord)!==Number(chord.offset);
export const gardenQualityAnswer=(chord,{rootMode=false}={})=>!rootMode&&gardenHasIndependentBass(chord)?`${Number(chord.offset)}:${gardenCanonicalQuality(chord.quality)}`:gardenCanonicalQuality(chord.quality);
export const gardenNoteName=pitch=>['C','D♭','D','E♭','E','F','F♯','G','A♭','A','B♭','B'][((Number(pitch)%12)+12)%12];
const JAZZ_QUALITIES={maj:'',min:'−',maj7:'△7',maj7sharp11:'△7(♯11)',m7:'−7',m6:'−6',m7b5:'ø7',m7natural9:'−9',m7b5natural9:'ø9',dim7:'°7',aug:'+',augMaj7:'+△7',m7b9:'−7(♭9)',minSharp5:'−(♯5)'};
export const gardenJazzQuality=quality=>JAZZ_QUALITIES[gardenCanonicalQuality(quality)]??gardenQualityLabel(quality);
export function gardenJazzLabel(chord,tonic=0,{root=true,quality=true,bass=true}={}){
  const r=root?gardenNoteName(tonic+gardenRootOffset(chord)):'?';
  const q=quality?gardenJazzQuality(chord.quality):'?';
  return r+q+(bass&&gardenHasIndependentBass(chord)?'/'+gardenNoteName(tonic+gardenBassOffset(chord)):'');
}
export function gardenQualityAnswerLabel(value){
  const parts=String(value).split(':');
  return parts.length===2?`${gardenDegreeLabel(parts[0])} ${gardenQualityLabel(parts[1])}`:gardenQualityLabel(value);
}
export function gardenAvailableAnswers(exercise,{expanded=false,rootMode=false}={}){
  const required=exercise.sequence.map(chord=>gardenQualityAnswer(chord,{rootMode}));
  return [...new Set([...GARDEN_CORE_QUALITIES,...GARDEN_QUALITY_PALETTE.filter(q=>expanded||required.includes(q)),...required])];
}
// Fixed motor-memory slots: never derive their order from a route's contents.
export const GARDEN_QUALITY_PALETTE=Object.freeze(['maj','min','6','m6','7','maj7','m7','m7b5','dim7','7sus4','sus2','sus4','aug','add9','m7natural9','m7b5natural9','maj7sharp11','7b9','7b9b13','7b5','7sharp5','7alt','m7b9','minSharp5','augMaj7','1']);
export const GARDEN_CORE_QUALITIES=Object.freeze(['maj','min','6','7','maj7','m7','m7b5','dim7','7sus4','sus4']);
export function gardenFilteredChoices(kind,target,filter,available,{rootMode=false}={}){
  const values=available??(kind==='degree'?Array.from({length:12},(_,i)=>i):GARDEN_QUALITY_PALETTE);
  if(!filter?.remaining)return new Set(values);
  const correct=kind==='degree'?(rootMode?gardenRootOffset(target):gardenBassOffset(target)):kind==='bass'?gardenBassOffset(target):gardenQualityAnswer(target,{rootMode});
  const wrong=values.filter(value=>value!==correct);
  // Suppression masks slots; it never changes the button geometry or order.
  const keep=Math.ceil(wrong.length/(filter.divisor||2));
  const start=kind==='degree'?(rootMode?gardenRootOffset(target):gardenBassOffset(target))%wrong.length:Math.max(0,values.indexOf(correct))%wrong.length;
  return new Set([correct,...Array.from({length:keep},(_,i)=>wrong[(start+i+wrong.length)%wrong.length])]);
}
// Found answers use the same spelling as their buttons; book notation stays
// available in the node title, rather than replacing the player's answer.
export function gardenChordLabel(chord){
  const bass=chord.bassOffset!=null&&Number(chord.bassOffset)!==Number(chord.offset)?`/${gardenDegreeLabel(chord.bassOffset)}`:'';
  const voicing=chord.voicingNote==='no-third'?'(без 3)':chord.voicingNote==='no-fifth'?'(без 5)':'';
  return `${gardenDegreeLabel(chord.offset)}${chord.quality==='maj'?'':gardenQualityLabel(chord.quality)}${voicing}${bass}`;
}
export function gardenAnswerState(model,kind,value){
  const parts=model.currentParts??model.progress?.[model.cursor]??{};
  const found=model.cursor>=0&&Boolean(parts[kind]);
  const matches=kind==='degree'?(model.separateBass?gardenRootOffset(model.current):gardenBassOffset(model.current))===Number(value):kind==='bass'?gardenBassOffset(model.current)===Number(value):gardenQualityAnswer(model.current,{rootMode:model.separateBass})===gardenCanonicalQuality(value);
  return {selected:found&&matches,disabled:!model.running||model.cursor<0||model.complete||found};
}
const PRESETS={
  felt:{name:'Felt Piano',engine:'sample',sampleSet:'felt',cutoff:1450,delay:0,feedback:0,drift:0},
  hybrid:{name:'Hybrid Keys',engine:'sample',sampleSet:'hybrid',cutoff:7000,delay:0,feedback:0,drift:0},
  hybridOrchestra:{name:'Hybrid Orchestra',engine:'sample',sampleSet:'hybridOrchestra',cutoff:9000,delay:.12,feedback:.08,drift:0},
  stringOrchestra:{name:'String Orchestra',engine:'sample',sampleSet:'stringOrchestra',cutoff:9000,delay:.16,feedback:.1,drift:0},
  pianoN:{name:'Piano N',engine:'sample',sampleSet:'pianoN',cutoff:6000,delay:0,feedback:0,drift:0},
  deep:{name:'Глубокий хор',engine:'deep',cutoff:620,delay:.67,feedback:.56,drift:4},
  air:{name:'Воздушное стекло',engine:'air',cutoff:2350,delay:.46,feedback:.42,drift:7}
};

const keyOf=chord=>`${chord.offset}:${chord.quality}:${chord.bassOffset??'root'}`;
const frequency=midi=>440*2**((midi-69)/12);
const nearestSample=(bank,midi)=>bank.reduce((best,item)=>Math.abs(item.midi-midi)<Math.abs(best.midi-midi)?item:best,bank[0]);
// Skip only leading recording silence, not the instrument's musical envelope.
// The offset is in source seconds, so transposing low no longer stretches it.
export function gardenSampleStart(buffer){
  const channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
  let peak=0;for(const data of channels)for(const value of data)peak=Math.max(peak,Math.abs(value));
  if(!peak)return 0;
  const threshold=peak*.005;
  for(let frame=0;frame<buffer.length;frame++)if(channels.some(data=>Math.abs(data[frame])>threshold))return Math.max(0,frame/buffer.sampleRate-.002);
  return 0;
}
export function gardenSampleBankLevel(bank){
  // Compare the same musical registers and listening duration, not file peaks
  // or recording pitch: a C5 sample transposed down decays much more slowly.
  const pitches=[43,48,55,60,64,67];let energy=0;
  for(const midi of pitches){
    const sample=nearestSample(bank,midi),buffer=sample.buffer,rate=2**((midi-sample.midi)/12);
    const first=Math.floor((sample.startOffset||0)*buffer.sampleRate),last=Math.min(buffer.length,first+Math.floor(3*rate*buffer.sampleRate));
    let sum=0,count=0;
    for(let channel=0;channel<buffer.numberOfChannels;channel++){const data=buffer.getChannelData(channel);for(let i=first;i<last;i++){sum+=data[i]*data[i];count++;}}
    energy+=count?sum/count:0;
  }
  return Math.sqrt(energy/pitches.length);
}
export function gardenSampleBankGain(bank,reference){
  const level=gardenSampleBankLevel(bank),target=gardenSampleBankLevel(reference);
  if(!level||!target)return 1;
  let peak=0;for(const sample of bank)for(let c=0;c<sample.buffer.numberOfChannels;c++)for(const value of sample.buffer.getChannelData(c))peak=Math.max(peak,Math.abs(value));
  return Math.min(6,peak?.85/peak:6,Math.max(.25,target/level));
}

export class GardenPad{
  constructor({deferSamplesUntilReady=false}={}){
    this.context=null;this.output=null;this.cleanOutput=null;this.filter=null;this.eqLow=null;this.eqMid=null;this.eqHigh=null;this.limiter=null;this.master=null;this.delay=null;this.delayFeedback=null;this.voices=[];this.preset='felt';this.sampleBanks={};this.generation=0;
    this.masterVolume=1.2;this.equalizer={low:0,mid:0,high:0};
    this.sampleSources={
      felt:[['felt-c3.wav',48],['felt-e3.wav',52],['felt-g3.wav',55]],
      hybrid:[['hybrid-c4.wav',60],['hybrid-d4.wav',62]],
      hybridOrchestra:[['hybrid-orchestra-c4.wav',60]],
      stringOrchestra:[['string-orchestra-c5.wav',72]],
      pianoN:[['piano-n-c5.wav',72]]
    };
    this.samplesReady=deferSamplesUntilReady?new Promise(resolve=>addEventListener('garden-ready',()=>resolve(),{once:true})):Promise.resolve();
  }
  async unlock(){
    if(!this.context){
      const Engine=window.AudioContext||window.webkitAudioContext;
      if(!Engine)throw Error('В этом браузере нет Web Audio.');
      const c=this.context=new Engine({latencyHint:'interactive'});
      this.output=c.createGain();this.output.gain.value=.46;
      this.cleanOutput=c.createGain();this.cleanOutput.gain.value=.82;
      this.eqLow=c.createBiquadFilter();this.eqLow.type='lowshelf';this.eqLow.frequency.value=160;
      this.eqMid=c.createBiquadFilter();this.eqMid.type='peaking';this.eqMid.frequency.value=900;this.eqMid.Q.value=.8;
      this.eqHigh=c.createBiquadFilter();this.eqHigh.type='highshelf';this.eqHigh.frequency.value=3800;
      this.limiter=c.createDynamicsCompressor();this.limiter.threshold.value=-5;this.limiter.knee.value=5;this.limiter.ratio.value=8;this.limiter.attack.value=.004;this.limiter.release.value=.14;
      this.master=c.createGain();this.master.gain.value=this.masterVolume;
      this.eqLow.connect(this.eqMid);this.eqMid.connect(this.eqHigh);this.eqHigh.connect(this.limiter);this.limiter.connect(this.master);this.master.connect(c.destination);
      this.cleanOutput.connect(this.eqLow);
      this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.Q.value=.72;
      this.delay=c.createDelay(1.4);this.delayFeedback=c.createGain();
      const wet=c.createGain();wet.gain.value=.24;
      this.output.connect(this.filter);this.filter.connect(this.eqLow);
      this.filter.connect(this.delay);this.delay.connect(this.delayFeedback);this.delayFeedback.connect(this.delay);this.delay.connect(wet);wet.connect(this.eqLow);
      this.applyEqualizer();
      this.applyPreset(this.preset);
    }
    if(this.context.state!=='running')await this.context.resume();
  }
  async loadSampleBank(sampleSet){
    if(!this.sampleBanks[sampleSet])this.sampleBanks[sampleSet]=(async()=>{
      await this.samplesReady;
      const samples=await Promise.all((this.sampleSources[sampleSet]||[]).map(async([file,midi])=>{
        const url=`assets/echo-garden/samples/${file}`,embedded=globalThis.GARDEN_SAMPLE_DATA?.[url];
        if(embedded)return {midi,data:Uint8Array.from(atob(embedded),c=>c.charCodeAt(0)).buffer};
        const response=await fetch(url,{priority:'low'});if(!response.ok)throw Error(`Не загрузился семпл ${url}`);return {midi,data:await response.arrayBuffer()};
      }));
      const bank=await Promise.all(samples.map(async sample=>{const buffer=await this.context.decodeAudioData(sample.data.slice(0));return {midi:sample.midi,buffer,startOffset:gardenSampleStart(buffer)};}));
      const levelGain=sampleSet==='felt'?1:gardenSampleBankGain(bank,await this.loadSampleBank('felt'));
      return bank.map(sample=>({...sample,levelGain}));
    })();
    return this.sampleBanks[sampleSet];
  }
  applyPreset(name){
    this.preset=PRESETS[name]?name:'felt';
    if(!this.context)return;
    const p=PRESETS[this.preset],t=this.context.currentTime;
    this.filter.frequency.setTargetAtTime(p.cutoff,t,.18);this.delay.delayTime.setTargetAtTime(p.delay,t,.18);this.delayFeedback.gain.setTargetAtTime(p.feedback,t,.18);
  }
  setMasterVolume(value){
    this.masterVolume=Math.min(1.8,Math.max(.8,Number(value)||1.2));
    if(this.master&&this.context)this.master.gain.setTargetAtTime(this.masterVolume,this.context.currentTime,.04);
  }
  setEqualizer(band,value){
    if(!Object.prototype.hasOwnProperty.call(this.equalizer,band))return;
    this.equalizer[band]=Math.min(6,Math.max(-6,Number(value)||0));
    this.applyEqualizer();
  }
  applyEqualizer(){
    if(!this.context)return;
    const now=this.context.currentTime;
    for(const band of ['low','mid','high']){
      const node=this[{low:'eqLow',mid:'eqMid',high:'eqHigh'}[band]];
      if(node)node.gain.setTargetAtTime(this.equalizer[band],now,.04);
    }
  }
  async play(chord,tonicPitchClass=5,{arpeggio=false,arrangement={},barSeconds=4}={}){
    const generation=++this.generation;
    await this.unlock();
    if(generation!==this.generation)return;
    const c=this.context,p=PRESETS[this.preset];this.lastArrangement=[];
    const sampleBank=p.engine==='sample'?await this.loadSampleBank(p.sampleSet):null;
    if(generation!==this.generation)return;
    let now=c.currentTime;
    for(const voice of this.voices){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(.0001,now,.035);setTimeout(()=>voice.stop(),180);}
    this.voices=[];
    if(chord.audio instanceof Blob){
      const buffer=await c.decodeAudioData(await chord.audio.arrayBuffer()),source=c.createBufferSource(),group=c.createGain();now=c.currentTime;
      source.buffer=buffer;source.loop=buffer.duration>1;source.loopStart=Math.min(.45,buffer.duration*.2);source.loopEnd=Math.max(source.loopStart+.12,buffer.duration-.12);
      group.gain.setValueAtTime(.0001,now);group.gain.exponentialRampToValueAtTime(.34,now+.65);source.connect(group);group.connect(this.output);source.start(now);
      const voice={gain:group,stop:()=>{try{source.stop();}catch{}try{group.disconnect();}catch{}}};this.voices=[voice];return;
    }
    const root=48+tonicPitchClass+chord.offset;
    const bass=48+tonicPitchClass+(chord.bassOffset??chord.offset)-12;
    // Imported MIDI routes retain the player's exact register, voicing and
    // independent bass instead of being rebuilt from the detected label.
    const exactNotes=Array.isArray(chord.notes)&&chord.notes.length;
    if(!exactNotes&&!GARDEN_INTERVALS[chord.quality])throw Error(`Неизвестный тип аккорда: ${chord.quality}. Воспроизведение остановлено, без подмены мажором.`);
    const notes=exactNotes?[...chord.notes]:[bass,...GARDEN_INTERVALS[chord.quality].map(interval=>root+interval)];
    // Imported MIDI voicings may store only the mid-register chord stack in
    // `notes`; their actual bass is represented separately by bassOffset.
    // Keep the bass flower in the true low register instead of treating the
    // stack's lowest note (often G3 or higher) as the bass.
    this.lastArrangement=gardenArrangementEvents(notes,chord.reference?{}:arrangement,barSeconds,bass);
    // Sustained foundation stays identifiable underneath two quieter layers.
    // All future attacks belong to this voice group, so pause/route changes
    // cancel them together rather than leaving an accompaniment running.
    if(this.lastArrangement.length){
      const group=c.createGain(),sources=[];group.gain.value=1;group.connect(this.cleanOutput);
      for(const event of this.lastArrangement){
        const tone=c.createOscillator(),level=c.createGain(),at=now+event.at;
        tone.type=event.track==='bass'?'triangle':'sine';tone.frequency.value=frequency(event.midi);
        level.gain.setValueAtTime(.0001,at);level.gain.exponentialRampToValueAtTime(event.level,at+.009);level.gain.exponentialRampToValueAtTime(.0001,at+event.duration);
        tone.connect(level);level.connect(group);tone.start(at);tone.stop(at+event.duration+.025);sources.push(tone);
        tone.onended=()=>{try{tone.disconnect();level.disconnect();}catch{}};
      }
      this.voices.push({gain:group,stop:()=>{for(const tone of sources){try{tone.stop();}catch{}}try{group.disconnect();}catch{}}});
    }
    if(p.engine==='sample'){
      const group=c.createGain(),sources=[];group.gain.setValueAtTime(.68/Math.sqrt(notes.length),now);group.connect(this.cleanOutput);
      // Keep each sampled arpeggio on one source recording. Switching source
      // samples from tone to tone creates little attack/timbre jumps (most
      // noticeable on Felt Piano), which can sound like grace notes.
      const orderedNotes=[...notes].sort((a,b)=>a-b),middleNote=orderedNotes[Math.floor(orderedNotes.length/2)];
      const phraseSample=arpeggio?nearestSample(sampleBank,middleNote):null;
      notes.forEach((midi,index)=>{
        const sample=phraseSample||nearestSample(sampleBank,midi);
        const voice=c.createBufferSource(),voiceGain=c.createGain();voice.buffer=sample.buffer;voice.playbackRate.value=2**((midi-sample.midi)/12);voiceGain.gain.value=(index===0?.62:1)*(sample.levelGain??1);voice.connect(voiceGain);voiceGain.connect(group);voice.start(now+(arpeggio?index*.18:0),sample.startOffset||0);sources.push(voice);
      });
      const voice={gain:group,stop:()=>{for(const item of sources){try{item.stop();}catch{}}try{group.disconnect();}catch{}}};this.voices.push(voice);return;
    }
    const group=c.createGain();group.gain.setValueAtTime(.0001,now);group.connect(this.output);
    if(p.engine==='felt'){
      group.gain.exponentialRampToValueAtTime(.29/Math.sqrt(notes.length),now+.025);
      group.gain.exponentialRampToValueAtTime(.055/Math.sqrt(notes.length),now+3.2);
    }else if(p.engine==='deep')group.gain.exponentialRampToValueAtTime(.18/Math.sqrt(notes.length),now+1.45);
    else group.gain.exponentialRampToValueAtTime(.16/Math.sqrt(notes.length),now+.72);
    const oscillators=[];
    notes.forEach((midi,index)=>{
      const fundamental=c.createOscillator(),body=c.createOscillator(),mix=c.createGain();
      fundamental.type='sine';fundamental.frequency.value=frequency(midi);fundamental.detune.value=(index%2?1:-1)*p.drift;
      body.type=p.engine==='deep'?'triangle':p.engine==='air'?'sine':'triangle';
      body.frequency.value=frequency(midi+(p.engine==='air'&&index>0?12:0));body.detune.value=(index%2?-1:1)*(p.drift+2);
      mix.gain.value=p.engine==='felt'?(index===0?.08:.20):p.engine==='deep'?(index===0?.16:.34):(index===0?.06:.30);
      fundamental.connect(group);body.connect(mix);mix.connect(group);fundamental.start(now);body.start(now);oscillators.push(fundamental,body);
      if(p.engine==='felt'){
        const hammer=c.createOscillator(),hammerGain=c.createGain();hammer.type='sine';hammer.frequency.setValueAtTime(frequency(midi+24),now);hammer.frequency.exponentialRampToValueAtTime(frequency(midi+12),now+.09);hammerGain.gain.setValueAtTime(index===0?.018:.045,now);hammerGain.gain.exponentialRampToValueAtTime(.0001,now+.16);hammer.connect(hammerGain);hammerGain.connect(group);hammer.start(now);hammer.stop(now+.18);oscillators.push(hammer);
      }
      if(p.engine==='air'&&index>0){const shimmer=c.createOscillator(),shimmerGain=c.createGain();shimmer.type='sine';shimmer.frequency.value=frequency(midi+19);shimmer.detune.value=-p.drift;shimmerGain.gain.value=.085;shimmer.connect(shimmerGain);shimmerGain.connect(group);shimmer.start(now);oscillators.push(shimmer);}
      if(p.engine==='deep'){const sub=c.createOscillator(),subGain=c.createGain();sub.type='sine';sub.frequency.value=frequency(midi-12);subGain.gain.value=index===0?.24:.055;sub.connect(subGain);subGain.connect(group);sub.start(now);oscillators.push(sub);}
    });
    const voice={gain:group,stop:()=>{for(const oscillator of oscillators){try{oscillator.stop();}catch{}}try{group.disconnect();}catch{}}};
    this.voices.push(voice);
  }
  async feedback(correct,{complete=false,kind='degree',value=0}={}){
    await this.unlock();
    const c=this.context,at=c.currentTime+.006,group=c.createGain(),degree=Number(value),isDegree=kind==='degree';
    const voices=correct
      ?isDegree
        ?[{pitch:523.25*2**((Number.isFinite(degree)?degree:0)/12),type:'sine',level:1,delay:0,glide:1.045}]
        :[{pitch:392,type:'triangle',level:1,delay:0,glide:1.015},{pitch:783.99,type:'sine',level:.32,delay:.032,glide:1.025}]
      :isDegree
        ?[{pitch:196,type:'triangle',level:1,delay:0,glide:.82}]
        :[{pitch:174.61,type:'square',level:.5,delay:0,glide:.9},{pitch:146.83,type:'triangle',level:.72,delay:.038,glide:.86}];
    if(correct&&complete)voices.push({pitch:1174.66,type:'sine',level:.28,delay:.075,glide:1.04});
    const duration=correct?(complete?.3:isDegree?.17:.22):.14;
    group.gain.setValueAtTime(.0001,at);
    group.gain.exponentialRampToValueAtTime(correct?(complete?.11:.072):.052,at+.008);
    group.gain.exponentialRampToValueAtTime(.0001,at+duration);
    group.connect(this.cleanOutput);
    this.lastFeedback={correct,complete,kind,character:correct?(isDegree?'degree-glass':'quality-petal'):(isDegree?'degree-low':'quality-knock'),pitches:voices.map(voice=>voice.pitch)};
    const oscillators=voices.map(voice=>{
      const oscillator=c.createOscillator(),partial=c.createGain();
      oscillator.type=voice.type;
      oscillator.frequency.setValueAtTime(voice.pitch,at+voice.delay);
      oscillator.frequency.exponentialRampToValueAtTime(voice.pitch*voice.glide,at+Math.min(duration-.015,voice.delay+.11));
      partial.gain.value=voice.level;oscillator.connect(partial);partial.connect(group);
      oscillator.start(at+voice.delay);oscillator.stop(at+duration+.015);
      oscillator.onended=()=>{try{oscillator.disconnect();partial.disconnect();}catch{}};
      return oscillator;
    });
    setTimeout(()=>{try{group.disconnect();}catch{}},Math.ceil((duration+.08)*1000));
    return oscillators.length;
  }
  stop(immediate=false){
    this.generation+=1;
    if(!this.context){this.voices=[];return;}
    const now=this.context.currentTime;
    for(const voice of this.voices){voice.gain.gain.cancelScheduledValues(now);if(immediate){voice.gain.gain.setValueAtTime(.0001,now);voice.stop();}else{voice.gain.gain.setTargetAtTime(.0001,now,.035);setTimeout(()=>voice.stop(),180);}}
    this.voices=[];
  }
}

export function createGardenMission({onChange,onChord,barSeconds=4,exercise:providedExercise,separateBass=false}={}){
  const sourceExercise=providedExercise??BOOK_CATALOG.find(item=>item.id==='fig-1-6');
  if(!sourceExercise)throw Error('В каталоге не найдена Fig. 1.6.');
  if(sourceExercise.sequence.length<2)throw Error('Для маршрута нужны база и хотя бы один следующий аккорд.');
  // The reference is the tonic sonority of the key, independent of whichever
  // chord starts the printed figure. Prefer the tonic voicing printed in the
  // exercise so modal/minor and sixth-chord examples keep their real colour.
  const tonic=sourceExercise.sequence.find(chord=>Number(chord.offset)===0&&/^I(?!I|V)/.test(String(chord.degree).replace(/^БАЗА\s*/,'')))
    ??{degree:'I',offset:0,quality:'maj',bassOffset:null};
  const reference={...tonic,degree:`БАЗА ${tonic.degree}`,offset:0,bassOffset:null,reference:true};
  // Legacy imported seeds store bassOffset relative to the root. Normalize
  // only the experimental teacher copy; never rewrite saved routes or MIDI.
  const exercise=separateBass?{...sourceExercise,sequence:sourceExercise.sequence.map(chord=>chord.rootPc!=null?{...chord,bassOffset:((Number(chord.bassPc??chord.bassMidi??chord.rootPc)-(sourceExercise.baseTonic??0))%12+12)%12}:{...chord})}:sourceExercise;
  const answerKinds=separateBass?['degree','quality','bass']:['degree','quality'];
  const emptyParts=()=>Object.fromEntries(answerKinds.map(kind=>[kind,false]));
  const positionSolved=part=>answerKinds.every(kind=>part[kind]);
  const accompaniment=createGardenArrangement(exercise.sequence.length);
  const state={exercise,cursor:-1,round:1,basePlayed:false,progress:exercise.sequence.map(emptyParts),running:false,complete:false,feedback:'',barSeconds,timer:0,deadline:0,held:false,arpeggio:false,arpeggioRounds:0,navigation:{enabled:true,revealedPosition:-1,teleportCharges:0},filters:{degree:null,quality:null}};
  const choices=[...exercise.sequence,...(exercise.distractors??[])]
    .filter((chord,index,list)=>list.findIndex(item=>keyOf(item)===keyOf(chord))===index);
  const solvedIndexes=()=>state.progress.flatMap((part,index)=>positionSolved(part)?[index]:[]);
  const snapshot=()=>({
    exercise,cursor:state.cursor,round:state.round,progress:state.progress.map(part=>({...part})),parts:state.progress.map(part=>({...part})),solved:solvedIndexes(),
    separateBass,answerKinds:[...answerKinds],solvedParts:state.progress.reduce((sum,part)=>sum+answerKinds.reduce((n,kind)=>n+Number(part[kind]),0),0),totalParts:exercise.sequence.length*answerKinds.length,
    running:state.running,complete:state.complete,basePlayed:state.basePlayed,feedback:state.feedback,barSeconds:state.barSeconds,deadline:state.deadline,choices,reference,held:state.held,arpeggio:state.arpeggio||state.arpeggioRounds>0,arrangement:state.cursor<0?{}:accompaniment.current(),arrangementStatus:accompaniment.snapshot(),navigation:{...state.navigation},
    current:state.cursor<0?reference:exercise.sequence[state.cursor],currentParts:state.cursor<0?{degree:true,quality:true}:{...state.progress[state.cursor]},filters:{degree:state.filters.degree&&{...state.filters.degree},quality:state.filters.quality&&{...state.filters.quality}}
  });
  const emit=()=>onChange?.(snapshot());
  const schedule=()=>{clearTimeout(state.timer);state.deadline=performance.now()+state.barSeconds*1000;state.timer=setTimeout(()=>{if(!state.running)return;if(state.held&&state.cursor>=0){sound();schedule();}else step();},state.barSeconds*1000);emit();};
  const sound=()=>onChord?.(state.cursor<0?reference:exercise.sequence[state.cursor],snapshot());
  const validPosition=position=>Number.isInteger(position)&&position>=0&&position<exercise.sequence.length;
  const spendFilterStep=()=>{for(const kind of ['degree','quality']){const filter=state.filters[kind];if(filter&&--filter.remaining<=0)state.filters[kind]=null;}};
  const moveTo=(position,feedback)=>{
    if(!state.navigation.enabled||!state.running||state.complete||!validPosition(position))return {ignored:true};
    clearTimeout(state.timer);spendFilterStep();state.held=false;state.arpeggio=false;state.cursor=position;state.feedback=feedback;state.navigation.revealedPosition=-1;sound();schedule();return {position};
  };
  function step(){
    if(!state.running)return;
    if(state.cursor>=0)spendFilterStep();state.feedback='';state.cursor+=1;
    if(state.cursor>=exercise.sequence.length){state.cursor=0;state.round+=1;}
    accompaniment.next();sound();if(state.arpeggioRounds>0)state.arpeggioRounds-=1;schedule();
  }
  const finish=()=>{state.complete=true;state.running=true;state.held=false;state.arpeggio=false;clearTimeout(state.timer);state.timer=0;state.deadline=0;};
  const settleAnswer=()=>{
    if(state.progress.every(positionSolved)){finish();state.feedback='Маршрут собран — слушаем его дальше';step();return true;}
    if(state.held){state.held=false;state.arpeggio=false;step();return true;}
    emit();return false;
  };
  return {
    start(){
      if(state.running)return;
      state.running=true;
      if(state.complete){state.feedback='Продолжаем слушать собранный маршрут';step();return;}
      state.feedback='';
      if(state.cursor<0&&state.basePlayed){step();return;}
      state.basePlayed=true;sound();schedule();
    },
    pause({preserveHold=false}={}){state.running=false;if(!preserveHold)state.held=false;clearTimeout(state.timer);state.timer=0;state.deadline=0;emit();},
    restart(){clearTimeout(state.timer);accompaniment.reset();state.cursor=-1;state.round=1;state.basePlayed=false;state.progress=exercise.sequence.map(emptyParts);state.running=false;state.complete=false;state.feedback='';state.deadline=0;state.filters={degree:null,quality:null};state.navigation.revealedPosition=-1;emit();},
    answerPart(kind,value){
      if(!state.running||state.cursor<0||state.complete||!answerKinds.includes(kind))return {ignored:true};
      const position=state.cursor,part=state.progress[position];
      if(part[kind])return {ignored:true,correct:true,position,positionComplete:positionSolved(part),complete:state.complete};
      const target=exercise.sequence[state.cursor];
      const correct=kind==='degree'?Number(value)===(separateBass?gardenRootOffset(target):gardenBassOffset(target)):kind==='bass'?Number(value)===gardenBassOffset(target):gardenCanonicalQuality(value)===gardenQualityAnswer(target,{rootMode:separateBass});
      if(correct){
        part[kind]=true;
        if(separateBass&&kind==='degree'&&gardenRootOffset(target)===gardenBassOffset(target))part.bass=true;
        const positionComplete=positionSolved(part);
        state.feedback=!separateBass?(positionComplete?'Бас и аккорд найдены':kind==='degree'?'Бас найден — теперь аккорд':'Аккорд найден — теперь бас'):positionComplete?'Все части аккорда найдены':part.degree&&part.quality?'Корень и тип найдены — найди бас слева':kind==='degree'?'Корень найден — найди тип аккорда':kind==='bass'?'Бас найден — остальные ответы сохранены':'Тип найден — найди корень внизу';
        const advanced=settleAnswer();
        return {correct,kind,position,positionComplete,complete:state.complete,advanced};
      }else state.feedback=!separateBass?(kind==='degree'?'Бас не совпал — найденный аккорд сохранён':'Аккорд не совпал — найденный бас сохранён'):kind==='degree'?'Корень не совпал — найденные ответы сохранены':kind==='bass'?'Бас не совпал — найденные ответы сохранены':'Тип не совпал — найденные ответы сохранены';
      emit();return {correct,kind,position,positionComplete:positionSolved(part),complete:state.complete,advanced:false};
    },
    answer(chord){
      if(!state.running||state.cursor<0||state.complete)return {ignored:true};
      const position=state.cursor,target=exercise.sequence[position],part=state.progress[position];
      if(positionSolved(part))return {ignored:true,correct:true,position,positionComplete:true,complete:state.complete};
      const correct=gardenBassOffset(chord)===gardenBassOffset(target)&&Number(chord.offset)===Number(target.offset)&&gardenCanonicalQuality(chord.quality)===gardenCanonicalQuality(target.quality);
      if(correct){for(const kind of answerKinds)part[kind]=true;state.feedback=separateBass?'Все части сигнала встроены в маршрут':'Обе части сигнала встроены в маршрут';const advanced=settleAnswer();return {correct,position,positionComplete:true,complete:state.complete,advanced};}
      else state.feedback='Не совпало — найденные раньше части сохранены';
      emit();return {correct,position,positionComplete:positionSolved(part),complete:state.complete,advanced:false};
    },
    advance(){step();},
    shift(delta,{consume}={}){
      if(!state.running||state.complete||state.cursor<0||![-5,-3,-2,2,3,5].includes(delta)||typeof consume!=='function')return {ignored:true};
      const position=(state.cursor+delta%exercise.sequence.length+exercise.sequence.length)%exercise.sequence.length;
      if(position===state.cursor||!consume())return {ignored:true};
      return moveTo(position,`Мандала сместила маршрут на ${delta>0?'+':''}${delta}: позиция ${position+1}`);
    },
    revealPosition(){return {ignored:true};},
    teleportTo(){return {ignored:true};},
    assist(spec,{consume}={}){
      if(!state.running||state.complete||state.cursor<0||typeof consume!=='function'||!['degree','quality','both'].includes(spec?.answerKind))return {ignored:true};
      const kind=spec.answerKind;
      if(spec.reveal){
        const part=state.progress[state.cursor];
        if(kind==='both'?positionSolved(part):part[kind])return {ignored:true};
        if(!consume())return {ignored:true};
        const target=exercise.sequence[state.cursor];
        // Reveal both atomically: one inventory charge, one render, no route
        // advance between the bass and upper-chord answers.
        const result=kind==='both'?this.answer(target):this.answerPart(kind,kind==='degree'?(separateBass?gardenRootOffset(target):gardenBassOffset(target)):gardenQualityAnswer(target,{rootMode:separateBass}));
        return {...result,assisted:true};
      }
      if(kind==='both'||![2,4].includes(spec.divisor)||!consume())return {ignored:true};
      state.filters[kind]={divisor:spec.divisor,remaining:spec.rounds?exercise.sequence.length*spec.rounds:spec.steps};
      state.feedback=`Подсказка: ${kind==='degree'?(separateBass?'корень':'бас'):'аккорды'} ×${spec.divisor}, ${state.filters[kind].remaining} ходов`;
      emit();return {assisted:true,kind};
    },
    arrange(style,rounds=1){if(!accompaniment.activate(style,rounds))return false;state.feedback='Цветок добавит слой со следующего аккорда';emit();return true;},
    boostArrangement(){const applied=accompaniment.boost();state.feedback=applied?'Активные слои продлены на один круг':'Сначала поймай цветок арпеджио или баса';emit();return applied;},
    clearArrangement(track){if(!accompaniment.clear(track))return false;state.feedback='Слой выключится со следующего аккорда';emit();return true;},
    arpeggioRound(){accompaniment.activate('arpWave',1);state.feedback='Арпеджио начнётся со следующего аккорда на один круг';emit();},
    restartFromRoot(){clearTimeout(state.timer);state.running=true;state.held=false;state.cursor=-1;state.basePlayed=true;state.feedback='Возврат к тонике';sound();schedule();},
    jumpToMiddle(){clearTimeout(state.timer);state.running=true;state.held=false;state.cursor=Math.max(-1,Math.floor(exercise.sequence.length/2)-1);state.feedback='Маршрут продолжен с середины';step();},
    hold(arpeggio=false){if(!state.running||state.complete)return {ignored:true};clearTimeout(state.timer);if(state.cursor<0)state.cursor=0;state.held=true;state.arpeggio=arpeggio;state.feedback='∞ Повторяем текущий аккорд в темпе';sound();schedule();return {held:true};},
    replayCurrent(){if(!state.held||state.cursor<0)return;state.feedback=state.arpeggio?'Арпеджио прозвучит ещё раз':'Аккорд прозвучит ещё раз';sound();emit();},
    continue({advance=true}={}){if(!state.held||!state.running||state.complete)return {ignored:true};state.held=false;state.arpeggio=false;state.feedback='Продолжаем маршрут';if(state.progress.every(positionSolved)){finish();emit();}else if(advance)step();else emit();return {held:false,advanced:advance&&!state.complete,complete:state.complete};},
    snapshot
  };
}

export {PRESETS,keyOf};
export const gardenExercisesForChapter=chapter=>BOOK_CATALOG.filter(item=>item.chapter===chapter);
