import {BOOK_CATALOG} from './book-catalog.mjs';

const INTERVALS={
  maj:[0,4,7],min:[0,3,7],m:[0,3,7],'6':[0,4,7,9],m6:[0,3,7,9],
  maj7:[0,4,7,11],m7:[0,3,7,10],m7b5:[0,3,6,10],'m7♭5':[0,3,6,10],
  '7':[0,4,7,10],'7b9':[0,4,7,10,13],dim7:[0,3,6,9],
  '7sus4':[0,5,7,10],aug:[0,4,8]
};
const PRESETS={
  velvet:{name:'Тёплый туман',cutoff:920,delay:.53,feedback:.46,triangle:.24,drift:5,air:.035},
  deep:{name:'Глубокая вода',cutoff:780,delay:.61,feedback:.52,triangle:.16,drift:3,air:.018},
  air:{name:'Светлый воздух',cutoff:1180,delay:.43,feedback:.38,triangle:.36,drift:7,air:.07}
};

const keyOf=chord=>`${chord.offset}:${chord.quality}:${chord.bassOffset??'root'}`;
const frequency=midi=>440*2**((midi-69)/12);

export class GardenPad{
  constructor(){this.context=null;this.output=null;this.filter=null;this.delay=null;this.feedback=null;this.voices=[];this.preset='velvet';}
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
    this.preset=PRESETS[name]?name:'velvet';
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
    const notes=[root-12,...(INTERVALS[chord.quality]??INTERVALS.maj).map(interval=>root+interval)];
    const group=c.createGain();group.gain.setValueAtTime(.0001,now);group.gain.exponentialRampToValueAtTime(.20/Math.sqrt(notes.length),now+1.25);group.connect(this.output);
    const oscillators=[];
    notes.forEach((midi,index)=>{
      const fundamental=c.createOscillator(),body=c.createOscillator(),mix=c.createGain();
      fundamental.type='sine';fundamental.frequency.value=frequency(midi);fundamental.detune.value=(index%2?1:-1)*p.drift;
      body.type='triangle';body.frequency.value=frequency(midi);body.detune.value=(index%2?-1:1)*(p.drift+2);mix.gain.value=p.triangle+(index===0?-.08:0);
      fundamental.connect(group);body.connect(mix);mix.connect(group);fundamental.start(now);body.start(now);oscillators.push(fundamental,body);
      if(p.air&&index>0){const shimmer=c.createOscillator(),shimmerGain=c.createGain();shimmer.type='sine';shimmer.frequency.value=frequency(midi+12);shimmerGain.gain.value=p.air;shimmer.connect(shimmerGain);shimmerGain.connect(group);shimmer.start(now);oscillators.push(shimmer);}
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
  const state={exercise,cursor:-1,round:1,solved:new Set(),running:false,complete:false,feedback:'',barSeconds,timer:0,deadline:0};
  const choices=[...exercise.sequence,...(exercise.distractors??[])]
    .filter((chord,index,list)=>list.findIndex(item=>keyOf(item)===keyOf(chord))===index);
  const snapshot=()=>({
    exercise,cursor:state.cursor,round:state.round,solved:[...state.solved],running:state.running,complete:state.complete,
    feedback:state.feedback,barSeconds:state.barSeconds,deadline:state.deadline,choices,reference,current:state.cursor<0?reference:exercise.sequence[state.cursor]
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
    restart(){clearTimeout(state.timer);state.cursor=-1;state.round=1;state.solved=new Set();state.running=false;state.complete=false;state.feedback='';state.deadline=0;emit();},
    answer(chord){
      if(!state.running||state.cursor<0||state.solved.has(state.cursor)||state.complete)return {ignored:true};
      const correct=keyOf(chord)===keyOf(exercise.sequence[state.cursor]);
      if(correct){state.solved.add(state.cursor);state.feedback='Сигнал встроен в маршрут';
        if(state.solved.size===exercise.sequence.length){state.complete=true;state.running=false;clearTimeout(state.timer);state.deadline=0;}
      }else state.feedback='Не совпало — услышим позицию на следующем круге';
      emit();return {correct,complete:state.complete};
    },
    advance(){step();},
    snapshot
  };
}

export {PRESETS,keyOf};
export const gardenExercisesForChapter=chapter=>BOOK_CATALOG.filter(item=>item.chapter===chapter);
