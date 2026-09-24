import {BOOK_CATALOG} from './book-catalog.mjs';

const INTERVALS={
  '1':[0],
  maj:[0,4,7],min:[0,3,7],m:[0,3,7],'6':[0,4,7,9],m6:[0,3,7,9],
  maj7:[0,4,7,11],m7:[0,3,7,10],m7b5:[0,3,6,10],'m7♭5':[0,3,6,10],
  '7':[0,4,7,10],'7b9':[0,4,7,10,13],dim7:[0,3,6,9],
  '7sus4':[0,5,7,10],aug:[0,4,8]
};
const PRESETS={
  felt:{name:'Фетровое пиано',engine:'sample',cutoff:1450,delay:0,feedback:0,drift:0},
  deep:{name:'Глубокий хор',engine:'deep',cutoff:620,delay:.67,feedback:.56,drift:4},
  air:{name:'Воздушное стекло',engine:'air',cutoff:2350,delay:.46,feedback:.42,drift:7}
};

const keyOf=chord=>`${chord.offset}:${chord.quality}:${chord.bassOffset??'root'}`;
const frequency=midi=>440*2**((midi-69)/12);

export class GardenPad{
  constructor(){
    this.context=null;this.output=null;this.cleanOutput=null;this.filter=null;this.delay=null;this.feedback=null;this.voices=[];this.preset='felt';this.sampleBuffers=[];this.generation=0;
    this.sampleData=Promise.all([
      ['assets/echo-garden/samples/felt-c3.wav',48],
      ['assets/echo-garden/samples/felt-e3.wav',52],
      ['assets/echo-garden/samples/felt-g3.wav',55]
    ].map(async([url,midi])=>{const response=await fetch(url);if(!response.ok)throw Error(`Не загрузился семпл ${url}`);return {midi,data:await response.arrayBuffer()};}));
  }
  async unlock(){
    if(!this.context){
      const Engine=window.AudioContext||window.webkitAudioContext;
      if(!Engine)throw Error('В этом браузере нет Web Audio.');
      const c=this.context=new Engine({latencyHint:'interactive'});
      this.output=c.createGain();this.output.gain.value=.46;
      this.cleanOutput=c.createGain();this.cleanOutput.gain.value=.82;this.cleanOutput.connect(c.destination);
      this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.Q.value=.72;
      this.delay=c.createDelay(1.4);this.feedback=c.createGain();
      const wet=c.createGain();wet.gain.value=.24;
      this.output.connect(this.filter);this.filter.connect(c.destination);
      this.filter.connect(this.delay);this.delay.connect(this.feedback);this.feedback.connect(this.delay);this.delay.connect(wet);wet.connect(c.destination);
      this.applyPreset(this.preset);
    }
    if(this.context.state!=='running')await this.context.resume();
    if(!this.sampleBuffers.length){const data=await this.sampleData;this.sampleBuffers=await Promise.all(data.map(async sample=>({midi:sample.midi,buffer:await this.context.decodeAudioData(sample.data.slice(0))})));}
  }
  applyPreset(name){
    this.preset=PRESETS[name]?name:'felt';
    if(!this.context)return;
    const p=PRESETS[this.preset],t=this.context.currentTime;
    this.filter.frequency.setTargetAtTime(p.cutoff,t,.18);this.delay.delayTime.setTargetAtTime(p.delay,t,.18);this.feedback.gain.setTargetAtTime(p.feedback,t,.18);
  }
  async play(chord,tonicPitchClass=5,{arpeggio=false}={}){
    const generation=++this.generation;
    await this.unlock();
    if(generation!==this.generation)return;
    const c=this.context,p=PRESETS[this.preset],now=c.currentTime;
    for(const voice of this.voices){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(.0001,now,.035);setTimeout(()=>voice.stop(),180);}
    this.voices=[];
    if(chord.audio instanceof Blob){
      const buffer=await c.decodeAudioData(await chord.audio.arrayBuffer()),source=c.createBufferSource(),group=c.createGain();
      source.buffer=buffer;source.loop=buffer.duration>1;source.loopStart=Math.min(.45,buffer.duration*.2);source.loopEnd=Math.max(source.loopStart+.12,buffer.duration-.12);
      group.gain.setValueAtTime(.0001,now);group.gain.exponentialRampToValueAtTime(.34,now+.65);source.connect(group);group.connect(this.output);source.start(now);
      const voice={gain:group,stop:()=>{try{source.stop();}catch{}try{group.disconnect();}catch{}}};this.voices=[voice];return;
    }
    const root=48+tonicPitchClass+chord.offset;
    const bass=48+tonicPitchClass+(chord.bassOffset??chord.offset)-12;
    // Imported MIDI routes retain the player's exact register, voicing and
    // independent bass instead of being rebuilt from the detected label.
    const notes=Array.isArray(chord.notes)&&chord.notes.length?[...chord.notes]:[bass,...(INTERVALS[chord.quality]??INTERVALS.maj).map(interval=>root+interval)];
    if(p.engine==='sample'){
      const group=c.createGain(),sources=[];group.gain.setValueAtTime(.68/Math.sqrt(notes.length),now);group.connect(this.cleanOutput);
      notes.forEach((midi,index)=>{
        const sample=this.sampleBuffers.reduce((best,item)=>Math.abs(item.midi-midi)<Math.abs(best.midi-midi)?item:best,this.sampleBuffers[0]);
        const voice=c.createBufferSource(),voiceGain=c.createGain();voice.buffer=sample.buffer;voice.playbackRate.value=2**((midi-sample.midi)/12);voiceGain.gain.value=index===0?.62:1;voice.connect(voiceGain);voiceGain.connect(group);voice.start(now+(arpeggio?index*.18:0));sources.push(voice);
      });
      const voice={gain:group,stop:()=>{for(const item of sources){try{item.stop();}catch{}}try{group.disconnect();}catch{}}};this.voices=[voice];return;
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
    this.voices=[voice];
  }
  async feedback(correct,{complete=false}={}){
    await this.unlock();
    const c=this.context,at=c.currentTime+.006,group=c.createGain();
    group.gain.setValueAtTime(.0001,at);
    group.gain.exponentialRampToValueAtTime(correct?(complete?.12:.075):.055,at+.008);
    group.gain.exponentialRampToValueAtTime(.0001,at+(correct?(complete?.24:.14):.12));
    group.connect(this.cleanOutput);
    const pitches=correct?(complete?[880,1320]:[740]):[196,174];
    const oscillators=pitches.map((pitch,index)=>{
      const oscillator=c.createOscillator(),partial=c.createGain();
      oscillator.type=index?'sine':'triangle';
      oscillator.frequency.setValueAtTime(pitch,at+index*.018);
      oscillator.frequency.exponentialRampToValueAtTime(pitch*(correct?1.06:.82),at+(correct?.09:.1));
      partial.gain.value=index?.34:1;oscillator.connect(partial);partial.connect(group);
      oscillator.start(at+index*.018);oscillator.stop(at+(correct?(complete?.25:.15):.13));
      oscillator.onended=()=>{try{oscillator.disconnect();partial.disconnect();}catch{}};
      return oscillator;
    });
    setTimeout(()=>{try{group.disconnect();}catch{}},complete?320:220);
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

export function createGardenMission({onChange,onChord,barSeconds=4,exercise:providedExercise}={}){
  const sourceExercise=providedExercise??BOOK_CATALOG.find(item=>item.id==='fig-1-6');
  if(!sourceExercise)throw Error('В каталоге не найдена Fig. 1.6.');
  if(sourceExercise.sequence.length<2)throw Error('Для маршрута нужны база и хотя бы один следующий аккорд.');
  // The reference is the tonic sonority of the key, independent of whichever
  // chord starts the printed figure. Prefer the tonic voicing printed in the
  // exercise so modal/minor and sixth-chord examples keep their real colour.
  const tonic=sourceExercise.sequence.find(chord=>Number(chord.offset)===0&&/^I(?!I|V)/.test(String(chord.degree).replace(/^БАЗА\s*/,'')))
    ??{degree:'I',offset:0,quality:'maj',bassOffset:null};
  const reference={...tonic,degree:`БАЗА ${tonic.degree}`,offset:0,bassOffset:null,reference:true};
  const exercise=sourceExercise;
  const state={exercise,cursor:-1,round:1,basePlayed:false,progress:exercise.sequence.map(()=>({degree:false,quality:false})),running:false,complete:false,feedback:'',barSeconds,timer:0,deadline:0,held:false,arpeggio:false,arpeggioRounds:0};
  const choices=[...exercise.sequence,...(exercise.distractors??[])]
    .filter((chord,index,list)=>list.findIndex(item=>keyOf(item)===keyOf(chord))===index);
  const solvedIndexes=()=>state.progress.flatMap((part,index)=>part.degree&&part.quality?[index]:[]);
  const snapshot=()=>({
    exercise,cursor:state.cursor,round:state.round,progress:state.progress.map(part=>({...part})),parts:state.progress.map(part=>({...part})),solved:solvedIndexes(),
    solvedParts:state.progress.reduce((sum,part)=>sum+Number(part.degree)+Number(part.quality),0),totalParts:exercise.sequence.length*2,
    running:state.running,complete:state.complete,basePlayed:state.basePlayed,feedback:state.feedback,barSeconds:state.barSeconds,deadline:state.deadline,choices,reference,held:state.held,arpeggio:state.arpeggio||state.arpeggioRounds>0,
    current:state.cursor<0?reference:exercise.sequence[state.cursor],currentParts:state.cursor<0?{degree:true,quality:true}:{...state.progress[state.cursor]}
  });
  const emit=()=>onChange?.(snapshot());
  const schedule=()=>{clearTimeout(state.timer);if(state.held){state.deadline=0;emit();return;}state.deadline=performance.now()+state.barSeconds*1000;state.timer=setTimeout(step,state.barSeconds*1000);emit();};
  const sound=()=>onChord?.(state.cursor<0?reference:exercise.sequence[state.cursor],snapshot());
  function step(){
    if(!state.running)return;
    state.feedback='';state.cursor+=1;
    if(state.cursor>=exercise.sequence.length){state.cursor=0;state.round+=1;}
    sound();if(state.arpeggioRounds>0)state.arpeggioRounds-=1;schedule();
  }
  return {
    start(){
      if(state.running)return;
      state.running=true;state.complete=false;state.feedback='';
      if(state.cursor<0&&state.basePlayed){step();return;}
      state.basePlayed=true;sound();schedule();
    },
    pause(){state.running=false;state.held=false;clearTimeout(state.timer);state.timer=0;state.deadline=0;emit();},
    restart(){clearTimeout(state.timer);state.cursor=-1;state.round=1;state.basePlayed=false;state.progress=exercise.sequence.map(()=>({degree:false,quality:false}));state.running=false;state.complete=false;state.feedback='';state.deadline=0;emit();},
    answerPart(kind,value){
      if(!state.running||state.cursor<0||state.complete||!['degree','quality'].includes(kind))return {ignored:true};
      const part=state.progress[state.cursor];
      if(part[kind])return {ignored:true,correct:true,positionComplete:part.degree&&part.quality,complete:state.complete};
      const target=exercise.sequence[state.cursor];
      const correct=kind==='degree'?Number(value)===Number(target.offset):String(value)===String(target.quality);
      if(correct){
        part[kind]=true;
        const positionComplete=part.degree&&part.quality;
        state.feedback=positionComplete?'Обе части сигнала встроены в маршрут':kind==='degree'?'Ступень зафиксирована':'Тип аккорда зафиксирован';
        if(state.progress.every(item=>item.degree&&item.quality)){state.complete=true;state.running=false;clearTimeout(state.timer);state.deadline=0;}
      }else state.feedback=kind==='degree'?'Ступень не совпала — вторая часть сохранена':'Тип не совпал — найденная ступень сохранена';
      emit();return {correct,kind,positionComplete:part.degree&&part.quality,complete:state.complete};
    },
    answer(chord){
      if(!state.running||state.cursor<0||state.complete)return {ignored:true};
      const target=exercise.sequence[state.cursor],part=state.progress[state.cursor];
      const correct=Number(chord.offset)===Number(target.offset)&&String(chord.quality)===String(target.quality);
      if(correct){part.degree=true;part.quality=true;state.feedback='Обе части сигнала встроены в маршрут';if(state.progress.every(item=>item.degree&&item.quality)){state.complete=true;state.running=false;clearTimeout(state.timer);state.deadline=0;}}
      else state.feedback='Не совпало — найденные раньше части сохранены';
      emit();return {correct,positionComplete:part.degree&&part.quality,complete:state.complete};
    },
    advance(){step();},
    arpeggioRound(){state.arpeggioRounds=exercise.sequence.length;state.feedback='Следующий гармонический круг звучит арпеджио';sound();emit();},
    restartFromRoot(){clearTimeout(state.timer);state.running=true;state.held=false;state.cursor=-1;state.basePlayed=true;state.feedback='Возврат к тонике';sound();schedule();},
    jumpToMiddle(){clearTimeout(state.timer);state.running=true;state.held=false;state.cursor=Math.max(-1,Math.floor(exercise.sequence.length/2)-1);state.feedback='Маршрут продолжен с середины';step();},
    hold(arpeggio=false){if(state.cursor<0)return;clearTimeout(state.timer);state.running=true;state.held=true;state.arpeggio=arpeggio;state.feedback=arpeggio?'Арпеджио удерживается до сигнала':'Аккорд удерживается до сигнала';sound();emit();},
    replayCurrent(){if(!state.held||state.cursor<0)return;state.feedback=state.arpeggio?'Арпеджио прозвучит ещё раз':'Аккорд прозвучит ещё раз';sound();emit();},
    continue(){if(!state.held)return;state.held=false;state.arpeggio=false;state.feedback='Продолжаем маршрут';step();},
    snapshot
  };
}

export {PRESETS,keyOf};
export const gardenExercisesForChapter=chapter=>BOOK_CATALOG.filter(item=>item.chapter===chapter);
