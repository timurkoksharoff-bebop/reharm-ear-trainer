import {BOOK_CATALOG} from './book-catalog.mjs';

const INTERVALS={
  maj:[0,4,7],min:[0,3,7],m:[0,3,7],'6':[0,4,7,9],m6:[0,3,7,9],
  maj7:[0,4,7,11],m7:[0,3,7,10],m7b5:[0,3,6,10],'m7♭5':[0,3,6,10],
  '7':[0,4,7,10],'7b9':[0,4,7,10,13],dim7:[0,3,6,9],
  '7sus4':[0,5,7,10],aug:[0,4,8]
};
const PRESETS={
  felt:{name:'Фетровое пиано',engine:'felt',cutoff:1450,delay:.31,feedback:.28,drift:1.5},
  deep:{name:'Глубокий хор',engine:'deep',cutoff:620,delay:.67,feedback:.56,drift:4},
  air:{name:'Воздушное стекло',engine:'air',cutoff:2350,delay:.46,feedback:.42,drift:7}
};

const keyOf=chord=>`${chord.offset}:${chord.quality}:${chord.bassOffset??'root'}`;
const frequency=midi=>440*2**((midi-69)/12);

export class GardenPad{
  constructor(){this.context=null;this.output=null;this.filter=null;this.delay=null;this.feedback=null;this.voices=[];this.preset='felt';}
  async unlock(){
    if(!this.context){
      const Engine=window.AudioContext||window.webkitAudioContext;
      if(!Engine)throw Error('В этом браузере нет Web Audio.');
      const c=this.context=new Engine({latencyHint:'interactive'});
      this.output=c.createGain();this.output.gain.value=.46;
      this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.Q.value=.72;
      this.delay=c.createDelay(1.4);this.feedback=c.createGain();
      const wet=c.createGain();wet.gain.value=.24;
      this.output.connect(this.filter);this.filter.connect(c.destination);
      this.filter.connect(this.delay);this.delay.connect(this.feedback);this.feedback.connect(this.delay);this.delay.connect(wet);wet.connect(c.destination);
      this.applyPreset(this.preset);
    }
    if(this.context.state!=='running')await this.context.resume();
  }
  applyPreset(name){
    this.preset=PRESETS[name]?name:'felt';
    if(!this.context)return;
    const p=PRESETS[this.preset],t=this.context.currentTime;
    this.filter.frequency.setTargetAtTime(p.cutoff,t,.18);this.delay.delayTime.setTargetAtTime(p.delay,t,.18);this.feedback.gain.setTargetAtTime(p.feedback,t,.18);
  }
  async play(chord,tonicPitchClass=5){
    await this.unlock();
    const c=this.context,p=PRESETS[this.preset],now=c.currentTime;
    for(const voice of this.voices){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(.0001,now,.72);setTimeout(()=>voice.stop(),3300);}
    this.voices=[];
    if(chord.audio instanceof Blob){
      const buffer=await c.decodeAudioData(await chord.audio.arrayBuffer()),source=c.createBufferSource(),group=c.createGain();
      source.buffer=buffer;source.loop=buffer.duration>1;source.loopStart=Math.min(.45,buffer.duration*.2);source.loopEnd=Math.max(source.loopStart+.12,buffer.duration-.12);
      group.gain.setValueAtTime(.0001,now);group.gain.exponentialRampToValueAtTime(.34,now+.65);source.connect(group);group.connect(this.output);source.start(now);
      const voice={gain:group,stop:()=>{try{source.stop();}catch{}try{group.disconnect();}catch{}}};this.voices=[voice];return;
    }
    const root=41+tonicPitchClass+chord.offset;
    const bass=41+tonicPitchClass+(chord.bassOffset??chord.offset)-12;
    const notes=[bass,...(INTERVALS[chord.quality]??INTERVALS.maj).map(interval=>root+interval)];
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
  stop(){
    if(!this.context)return;
    const now=this.context.currentTime;
    for(const voice of this.voices){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(.0001,now,.25);setTimeout(()=>voice.stop(),1300);}
    this.voices=[];
  }
}

export function createGardenMission({onChange,onChord,barSeconds=4,exercise:providedExercise}={}){
  const exercise=providedExercise??BOOK_CATALOG.find(item=>item.id==='fig-1-6');
  if(!exercise)throw Error('В каталоге не найдена Fig. 1.6.');
  const reference={degree:'БАЗА I',offset:0,quality:'6',bassOffset:null,reference:true};
  const state={exercise,cursor:-1,round:1,progress:exercise.sequence.map(()=>({degree:false,quality:false})),running:false,complete:false,feedback:'',barSeconds,timer:0,deadline:0};
  const choices=[...exercise.sequence,...(exercise.distractors??[])]
    .filter((chord,index,list)=>list.findIndex(item=>keyOf(item)===keyOf(chord))===index);
  const solvedIndexes=()=>state.progress.flatMap((part,index)=>part.degree&&part.quality?[index]:[]);
  const snapshot=()=>({
    exercise,cursor:state.cursor,round:state.round,progress:state.progress.map(part=>({...part})),parts:state.progress.map(part=>({...part})),solved:solvedIndexes(),
    solvedParts:state.progress.reduce((sum,part)=>sum+Number(part.degree)+Number(part.quality),0),totalParts:exercise.sequence.length*2,
    running:state.running,complete:state.complete,feedback:state.feedback,barSeconds:state.barSeconds,deadline:state.deadline,choices,reference,
    current:state.cursor<0?reference:exercise.sequence[state.cursor],currentParts:state.cursor<0?{degree:true,quality:true}:{...state.progress[state.cursor]}
  });
  const emit=()=>onChange?.(snapshot());
  const schedule=()=>{clearTimeout(state.timer);state.deadline=performance.now()+state.barSeconds*1000;state.timer=setTimeout(step,state.barSeconds*1000);emit();};
  const sound=()=>onChord?.(state.cursor<0?reference:exercise.sequence[state.cursor],snapshot());
  function step(){
    if(!state.running)return;
    state.feedback='';state.cursor+=1;
    if(state.cursor>=exercise.sequence.length){state.cursor=-1;state.round+=1;}
    sound();schedule();
  }
  return {
    start(){if(state.running)return;state.running=true;state.complete=false;state.feedback='';sound();schedule();},
    pause(){state.running=false;clearTimeout(state.timer);state.timer=0;state.deadline=0;emit();},
    restart(){clearTimeout(state.timer);state.cursor=-1;state.round=1;state.progress=exercise.sequence.map(()=>({degree:false,quality:false}));state.running=false;state.complete=false;state.feedback='';state.deadline=0;emit();},
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
    snapshot
  };
}

export {PRESETS,keyOf};
export const gardenExercisesForChapter=chapter=>BOOK_CATALOG.filter(item=>item.chapter===chapter);
