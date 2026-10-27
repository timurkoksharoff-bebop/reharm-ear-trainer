import {gardenModePhraseZero} from './garden-mode-phrases-zero.mjs';

const pc=n=>((n%12)+12)%12;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const modulo=(n,size)=>((n%size)+size)%size;
const span=events=>Math.max(...events.map(event=>event.onset+event.duration));
const nearest=(value,notes)=>notes.reduce((best,n)=>Math.abs(n-value)<Math.abs(best-value)?n:best,notes[0]);

// Opt-in double-time study. Reuse the reviewed original constructions at half
// their event times; leave Phrase0 and the shipped mixed planner untouched.
// A second cell develops the opening two-note motif, then answers on an actual
// chord/scale anchor. Additional time adds a cell rather than stretching rests.
export function gardenModePhraseDense(notes,options={}){
 const {modeId='',chord=null,tonic=null,barSeconds=4,remaining=1.7,variation=0,previous=null}=options;
 if(!Array.isArray(notes)||notes.length<2||!notes.every(Number.isFinite)||!Number.isFinite(remaining)||remaining<.65)return null;
 const sequence=Number.isFinite(variation)?Math.trunc(variation):0;
 const beat=clamp(Number.isFinite(barSeconds)&&barSeconds>0?barSeconds/4:1,.6,1.5);
 const available=Math.min(4.8,remaining-.12),root=notes[0];
 const collection=[...new Set(notes.map(n=>pc(n-root)))].sort((a,b)=>a-b);
 const lattice=[];for(let octave=-1;octave<=2;octave++)for(const interval of collection){const midi=root+interval+octave*12;if(midi>=root-5&&midi<=root+17)lattice.push(midi);}
 if(collection.length<2)return null;
 const entry=available>beat*.9?(modulo(sequence,3)===1?.25:.125)*beat:0;
 const body=available-entry,minimumCell=.78*beat;
 const cellCount=body>=4.8*beat?3:body>=2.15*beat?2:1;
 const breath=clamp(beat*.09,.05,.11),events=[],segments=[];
 let cursor=0,reference=null,prior=previous,opening=null;
 for(let cell=0;cell<cellCount;cell++){
  const left=body-cursor,cellsLeft=cellCount-cell;
  if(left<minimumCell&&cell>0)break;
  const budget=(left-breath*(cellsLeft-1))/cellsLeft;
  const raw=gardenModePhraseZero(notes,{modeId,chord,tonic,barSeconds,remaining:budget*2+.12,variation:sequence+cell,previous:prior});
  if(!raw)break;
  const next=raw.events.map(event=>({...event,onset:event.onset*.5,duration:Math.max(.045,event.duration*.5)}));
  if(cell>0){
   // Keep the response close to the call, in the literal selected collection.
   // Its opening recalls the call's contour one scale step away; the existing
   // source construction still supplies the modal colour and guide-tone ending.
   const last=events.at(-1).midi,direction=Math.sign(opening[1]-opening[0])||(modulo(sequence,2)?-1:1);
   const start=clamp(lattice.indexOf(last)+(cell===1?direction:-direction),0,lattice.length-1);
   next[0].midi=lattice[start];next[0].role='motif';
   if(next.length>=4){next[1].midi=lattice[clamp(start+direction,0,lattice.length-1)];next[1].role='motif';}
  }
  // The old cells can jump down nearly two octaves at their colour change.
  // Keep each pitch class but voice the entire line, including its call, near
  // its preceding note so double-time does not magnify a register discontinuity.
  let preceding=next[0].midi;
  for(let index=1;index<next.length;index++){
   const candidates=lattice.filter(n=>pc(n-root)===pc(next[index].midi-root));
   next[index].midi=nearest(preceding,candidates);preceding=next[index].midi;
  }
  if(cell===0)opening=next.map(event=>event.midi);
  if(span(next)>left+1e-9)break;
  reference=raw;
  const start=cursor+entry;
  events.push(...next.map(event=>({...event,onset:event.onset+start,segment:cell?'answer':'call'})));
  const end=start+span(next);segments.push({kind:cell?'answer':'call',motifId:raw.motifId,start,end,rhythm:'double-time'});
  cursor=end-entry+breath;
  prior={notes:next.map(event=>event.midi),pattern:raw.pattern};
 }
 if(!events.length)return null;
 const last=events.at(-1),duration=span(events);
 return {...reference,notes:events.map(event=>event.midi),events,duration,step:beat/4,target:last.midi,targetInterval:pc(last.midi-root),
  pattern:segments.length>1?'dense-motif-answer':'dense-'+reference.pattern,motifId:'dense-'+segments.map(segment=>segment.motifId).join('+'),
  style:'phrase',requestedStyle:'phrase',rhythm:'double-time',requestedRhythm:'double-time',density:2,segments,
  entryOffsetBeats:entry/beat,endOffsetBeats:duration/beat,end:{midi:last.midi,attackBeats:last.onset/beat,releaseBeats:duration/beat}};
}
