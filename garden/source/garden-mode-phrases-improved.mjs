import {gardenModePhraseZero} from './garden-mode-phrases-zero.mjs';
import {gardenModeArpeggio} from './garden-mode-arpeggio.mjs';

const pc=n=>((n%12)+12)%12;
const mod=(n,size)=>((n%size)+size)%size;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const sentenceShapes=[
 ['sequence-lift',[-5,-3,-4,-2,-3,-1,-2,0,2,1,-1,0]],
 ['sequence-fall',[5,3,4,2,3,1,2,0,1,-1,-2,0]],
 ['curl-expansion',[-3,-2,-4,-1,-1,0,-2,1,3,2,-1,0]],
 ['arched-sequence',[-5,-4,-2,-3,-2,-1,1,0,3,2,1,0]],
 ['descending-turn',[5,4,2,3,3,2,0,1,-1,1,-1,0]],
 ['wide-answer',[-5,-3,-2,-4,-2,0,1,-1,2,1,-1,0]],
 ['pentatonic-reach',[-4,-2,-3,-1,-2,0,-1,1,3,2,1,0]]
];
const styles=['phrase','arpeggio','phrase','combined','phrase','arpeggio','phrase','combined'];
const endOf=events=>Math.max(...events.map(event=>event.onset+event.duration));
const distance=(a,b)=>Math.abs(a-b);

function phraseKind(sequence,mix){
 const arp=clamp(Math.round(Number(mix?.arpeggioPercent??25))||0,0,100);
 const combined=clamp(Math.round(Number(mix?.combinedPercent??25))||0,0,100-arp);
 if(arp===25&&combined===25)return styles[mod(sequence,8)];
 const draw=mod(sequence*37+17,100);
 return draw<arp?'arpeggio':draw<arp+combined?'combined':'phrase';
}

function authoredForm(shape,count){
 if(count===12)return [...shape];
 if(count===9)return [shape[0],shape[1],shape[2],shape[4],shape[5],shape[6],...shape.slice(-3)];
 if(count===6)return [shape[4],shape[5],shape[6],...shape.slice(-3)];
 return count===4?[2,1,-1,0]:[1,-1,0];
}

function rhythmPositions(count,unit,profile){
 const positions=Array.from({length:count},(_,index)=>index);
 if(profile==='breath'&&count>=6)for(let index=Math.floor(count*.65);index<count;index++)positions[index]+=.5;
 if(profile==='anticipation'&&count>=4)positions[count-1]-=.25;
 if(profile==='triplet-turn'&&count>=8&&unit*2/3>=.09){
  for(let index=2;index<count;index++)positions[index]=index<=4?2+(index-2)*2/3:index-1;
 }
 if(profile==='quintuplet-run'&&count>=9&&unit*.8>=.09){
  for(let index=2;index<count;index++)positions[index]=index<=6?2+(index-2)*.8:index-1;
 }
 return positions.map(value=>value*unit);
}

function installColour(pitches,colourPc,lattice,from,to){
 if(pitches.some(midi=>pc(midi)===colourPc))return {pitches,insertedAt:null};
 let best=null;
 for(let index=from;index<=to;index++)for(const midi of lattice){
  if(pc(midi)!==colourPc)continue;
  const before=pitches[index-1],after=pitches[index+1];
  const jumps=[before,after].filter(Number.isFinite).map(value=>distance(value,midi));
  const score=jumps.reduce((sum,value)=>sum+value,0)+distance(midi,pitches[index])*.15+jumps.filter(value=>value===0).length*5+jumps.filter(value=>value>8).length*20;
  if(!best||score<best.score)best={index,midi,score};
 }
 if(best){pitches[best.index]=best.midi;return {pitches,insertedAt:best.index};}
 return {pitches,insertedAt:null};
}

// Original complete sentences, informed by general phrasing principles in the
// privately reviewed books. No source lick is transcribed. Phrase0 supplies
// harmonic metadata only: its melody and rhythm are never concatenated here.
export function gardenModePhraseImproved(notes,options={}){
 const {modeId='',chord=null,tonic=null,barSeconds=4,remaining=1.7,variation=0,previous=null,mix=null,rhythm='lively'}=options;
 if(!Array.isArray(notes)||notes.length<2||!notes.every(Number.isFinite)||!Number.isFinite(remaining)||remaining<.65)return null;
 const sequence=Number.isFinite(variation)?Math.trunc(variation):0,requestedStyle=phraseKind(sequence,mix);
 if(requestedStyle==='arpeggio')return gardenModeArpeggio(notes,{...options,variation:Math.floor(sequence/4)});
 const reference=gardenModePhraseZero(notes,{modeId,chord,tonic,barSeconds,remaining:3.4,variation:sequence*4,previous});
 if(!reference)return null;
 const root=notes[0],collection=[...new Set(notes.map(midi=>pc(midi-root)))].sort((a,b)=>a-b);
 const lattice=[];for(let octave=-2;octave<=3;octave++)for(const interval of collection){const midi=root+interval+octave*12;if(midi>=root-7&&midi<=root+19)lattice.push(midi);}
 const beat=clamp(Number.isFinite(barSeconds)&&barSeconds>0?barSeconds/4:1,.6,1.5),available=Math.min(4.8,remaining-.12);
 const entry=available>beat*1.2?(mod(sequence,3)===1?.25:.125)*beat:0,body=available-entry;
 const profile=rhythm==='steady'?'flow':rhythm==='free'?['flow','triplet-turn','breath','anticipation','quintuplet-run','flow'][mod(sequence,6)]:['flow','anticipation','flow','breath'][mod(sequence,4)];
 const preferredColour=pc(reference.characteristic[mod(sequence,4)===3?Math.min(1,reference.characteristic.length-1):0]??root);
 const targetPc=pc(reference.target),priorEnd=previous?.notes?.at(-1),desired=Number.isFinite(priorEnd)?clamp(priorEnd,root-2,root+13):root+6;
 let choice=null;
 // A shorter authored sentence replaces an overlong one. The final small
 // ending has its own faster pulse; a long sentence is never squeezed to fit.
 for(const count of [12,9,6,4,3]){
  const unit=count<=4?clamp(beat*.125,.09,count===3?.14:.18):beat*.25;
  const onsets=rhythmPositions(count,unit,count<=4?'flow':profile);
  const endGate=clamp(beat*(count<=4?.18:.3),.12,count<=4?.23:.45);
  if(onsets.at(-1)+endGate>body+1e-9)continue;
  let best=null;
  for(let offset=0;offset<sentenceShapes.length;offset++){
   const [name,shape]=sentenceShapes[mod(Math.floor(sequence/2)+offset,sentenceShapes.length)],form=authoredForm(shape,count);
   const combined=requestedStyle==='combined'&&count>=9;
   const order=combined?(mod(Math.floor(sequence/4),2)?'phrase-arpeggio':'arpeggio-phrase'):null;
   const fragmentType=combined?(mod(Math.floor(sequence/8),2)?'broken-thirds':'scalar-approach'):null;
   if(combined&&order==='arpeggio-phrase'){
    const join=form[3],direction=Math.sign(join-form[0])||1;
    form.splice(0,3,...(fragmentType==='scalar-approach'?[join-direction*3,join-direction*2,join-direction]:[join-direction*4,join-direction*2,join-direction*3]));
   }else if(combined){
    form.splice(-4,4,...(fragmentType==='scalar-approach'?[-3,-2,-1,0]:[-4,-2,-1,0]));
   }
   for(let targetIndex=0;targetIndex<lattice.length;targetIndex++){
    if(pc(lattice[targetIndex])!==targetPc||form.some(value=>targetIndex+value<0||targetIndex+value>=lattice.length))continue;
    const pitches=form.map(value=>lattice[targetIndex+value]);
    const colourRange=combined&&order==='phrase-arpeggio'?[1,count-5]:combined?[4,count-2]:count>=9?[count===12?count-4:count-3,count-2]:[0,count-2];
    const coloured=installColour(pitches,preferredColour,lattice,...colourRange);
    const maxLeap=Math.max(...pitches.slice(1).map((midi,index)=>distance(midi,pitches[index])));
    const score=offset*.4+distance(lattice[targetIndex],desired)*.2+(Number.isFinite(priorEnd)?distance(pitches[0],priorEnd)*.35:distance(pitches[0],root+5)*.12)+Math.max(0,maxLeap-8)*8;
    if(!best||score<best.score)best={pitches,name,onsets,endGate,unit,count,combined,order,fragmentType,insertedAt:coloured.insertedAt,score};
   }
  }
  if(best){choice=best;break;}
 }
 if(!choice)return null;
 const {pitches,onsets,endGate,unit,count,combined,order,fragmentType}=choice;
 const split=combined?(order==='arpeggio-phrase'?4:count-4):null;
 const events=pitches.map((midi,index)=>{
  const last=index===count-1,kind=combined?(order==='arpeggio-phrase'?(index<split?'arpeggio':'phrase'):(index<split?'phrase':'arpeggio')):'phrase';
  const role=last?'target':pc(midi)===preferredColour?'colour':index>=count-3?'approach':index%4===0?'accent':index%4===1?'ghost':'motif';
  const gate=last?endGate:Math.min((onsets[index+1]-onsets[index])*.85,unit*.88);
  return {midi,onset:onsets[index]+entry,duration:gate,velocity:last?.88:role==='accent'?.78:role==='colour'?.75:role==='ghost'?.52:index%2?.64:.7,role,segment:kind};
 });
 const duration=endOf(events),target=pitches.at(-1),style=combined?'combined':'phrase';
 const segment=(kind,from,to)=>({kind,motifId:'improved-'+choice.name,start:events[from].onset,end:events[to].onset+events[to].duration,rhythm:profile});
 const segments=combined?[segment(order.split('-')[0],0,split-1),segment(order.split('-')[1],split,count-1)]:[segment('phrase',0,count-1)];
 return {...reference,notes:pitches,events,duration,step:unit,target,targetInterval:pc(target-root),
  pattern:'improved-'+choice.name,motifId:'improved-'+choice.name+'-'+count,style,requestedStyle,order,
  fallbackReason:requestedStyle==='combined'&&!combined?'short-window':null,fragmentType,rhythm:profile,requestedRhythm:rhythm,
  characteristic:[...reference.characteristic],colourPc:preferredColour,colourInsertedAt:choice.insertedAt,
  development:{kind:count>=9?'motif-sequence':'compact-ending',motifNotes:count===12?4:count===9?3:null},segments,
  entryOffsetBeats:entry/beat,endOffsetBeats:duration/beat,end:{midi:target,attackBeats:events.at(-1).onset/beat,releaseBeats:duration/beat}};
}
