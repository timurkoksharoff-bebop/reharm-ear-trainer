import {gardenModePhraseZero} from './garden-mode-phrases-zero.mjs';
import {gardenModeArpeggio} from './garden-mode-arpeggio.mjs';
const pc=n=>((n%12)+12)%12;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const nearest=(value,notes)=>notes.reduce((best,n)=>Math.abs(n-value)<Math.abs(best-value)?n:best,notes[0]);

const brokenContours=[
 ['broken-thirds-up',[0,2,1,3,2,4]],['broken-thirds-down',[0,-2,-1,-3,-2,-4]],
 ['broken-hinge',[0,2,-1,1,-2,0]],['broken-zigzag',[0,2,0,3,1,4]],
 ['broken-contrary',[0,-2,1,-1,2,0]],['broken-pendulum',[0,3,-1,2,-2,1]],
 ['broken-weave',[0,2,1,-1,0,3]],['broken-reverse-weave',[0,-2,-1,1,0,-3]]
];
const rhythmProfiles=['offbeat-eighth','space-answer','straight-rest','triplet-cell','offbeat-sixteenth','anticipation','offbeat-eighth','syncopated','space-answer','quintuplet-cell','offbeat-sixteenth','anticipation'];
const modulo=(n,size)=>((n%size)+size)%size;
const span=events=>Math.max(...events.map(event=>event.onset+event.duration));

function brokenArpeggio(notes,reference,{variation=0,available,compact=0}={}){
 const root=notes[0],collection=[...new Set(notes.map(n=>pc(n-root)))].sort((a,b)=>a-b),beat=reference.beatSeconds;
 const lattice=[];for(let octave=-1;octave<=2;octave++)for(const interval of collection){const midi=root+interval+octave*12;if(midi>=root-5&&midi<=root+17)lattice.push(midi);}
 const budget=available/beat;
 const count=compact|| (budget<.78?2:budget<1.78?3:budget<2.28?4:budget<2.78?5:6);
 const [pattern,contour]=brokenContours[modulo(variation,brokenContours.length)];
 const target=reference.target,colourCandidates=lattice.filter(n=>reference.characteristic.some(c=>pc(c-root)===pc(n-root)));
 const colour=nearest(target+(modulo(variation,2)?-2:2),colourCandidates.length?colourCandidates:lattice);
 const start=lattice.indexOf(colour),pitches=Array.from({length:count},(_,i)=>lattice[clamp(start+contour[i],0,lattice.length-1)]);
 pitches[pitches.length-1]=target;
 const subdivision=compact||count<4?.25:.5;
 const events=pitches.map((midi,index)=>({midi,onset:index*subdivision*beat,duration:(index===count-1?.28:subdivision*.7)*beat,velocity:index===count-1?.82:index%2?.57:.7,role:index===count-1?'target':index===0?'colour':'arpeggio'}));
 const last=events.at(-1);last.duration=Math.min(last.duration,available-last.onset);
 if(last.duration<.10||span(events)>available+1e-9)return null;
 return {...reference,notes:pitches,events,pattern,motifId:pattern+'-'+count,duration:span(events)};
}

function phraseRhythm(plan,profile,available){
 const beat=plan.beatSeconds,events=plan.events.map(event=>({...event})),count=events.length;
 let positions=null,rhythm=profile;
 if(profile==='triplet-cell'&&count>=3&&beat/3>=.14){
  positions=count===3?[0,1/3,2/3]:count===4?[0,1/3,2/3,1.5]:count===5?[0,1/3,2/3,1.5,2]:[0,1/3,2/3,1.5,1.5+1/3,1.5+2/3];
 }else if(profile==='quintuplet-cell'&&count>=5&&beat/5>=.14){
  positions=count===5?[0,.2,.4,.6,.8]:[0,.2,.4,.6,.8,1.75];
 }else if(profile==='syncopated'&&count>=3){
  positions=events.map((event,index)=>event.onset/beat+(index%2?.125:0));
 }else if(profile==='space-answer'&&count>=4){
  positions=events.map((event,index)=>event.onset/beat+(index>=Math.ceil(count/2)?.25:0));
 }else if(profile==='anticipation'&&count>=3){
  positions=events.map(event=>event.onset/beat);positions[count-1]-=.125;
 }else if(profile==='triplet-cell'||profile==='quintuplet-cell')rhythm='compact-offbeat';
 if(positions){
  const candidate=events.map((event,index)=>{
   const next=positions[index+1],gate=index===count-1?Math.min(event.duration,.55*beat):Math.min(event.duration,(next-positions[index])*.78*beat);
   return {...event,onset:positions[index]*beat,duration:gate};
  });
  if(candidate.every((event,index)=>event.duration>=.06&&(!index||event.onset-candidate[index-1].onset>=.14-1e-9))&&span(candidate)<=available+1e-9){
   if(profile==='triplet-cell'||profile==='quintuplet-cell')for(let index=0;index<candidate.length;index++)candidate[index].velocity=index===candidate.length-1?.88:index===0?.78:.49+(index%2)*.06;
   return {...plan,events:candidate,duration:span(candidate),rhythm};
  }
  rhythm='compact-offbeat';
 }
 return {...plan,events,duration:span(events),rhythm};
}

// Every eight consecutive variation slots contain four phrase, two combined
// and two arpeggio requests. Short windows report their graceful fallback rather
// than pretending to fit both gestures by time-compressing them.
export function gardenModePhrase(notes,options={}){
 const {modeId='',chord=null,tonic=null,barSeconds=4,remaining=1.7,variation=0,previous=null,mix=null,rhythm='lively'}=options;
 if(!Array.isArray(notes)||notes.length<2||!notes.every(Number.isFinite)||!Number.isFinite(remaining)||remaining<.65)return null;
 const sequence=Number.isFinite(variation)?Math.trunc(variation):0,slot=modulo(sequence,8);
 const arpPercent=clamp(Math.round(Number(mix?.arpeggioPercent??25))||0,0,100),combinedPercent=clamp(Math.round(Number(mix?.combinedPercent??25))||0,0,100-arpPercent),draw=modulo(sequence*37+17,100);
 const requestedStyle=arpPercent===25&&combinedPercent===25?(slot%2===0?'phrase':slot===1||slot===5?'arpeggio':'combined'):draw<arpPercent?'arpeggio':draw<arpPercent+combinedPercent?'combined':'phrase';
 const order=(slot===3||slot!==7&&modulo(sequence,2)===0)?'phrase-arpeggio':'arpeggio-phrase';
 const profileIndex=modulo(sequence+Math.floor(sequence/12)*5,rhythmProfiles.length),requestedRhythm=rhythm==='steady'?'straight-rest':rhythm==='free'&&modulo(sequence,4)===1?(modulo(sequence,8)===1?'triplet-cell':'quintuplet-cell'):rhythmProfiles[profileIndex];
 // Standalone arpeggios use the original recognisable scale contours, not the
 // modal-colour/guide-tone mini-phrase used inside a combined gesture.
 if(requestedStyle==='arpeggio'){
  const arpeggio=gardenModeArpeggio(notes,{...options,variation:Math.floor(sequence/4)});
  return arpeggio?{...arpeggio,requestedRhythm}:null;
 }
 const beat=clamp(Number.isFinite(barSeconds)&&barSeconds>0?barSeconds/4:1,.6,1.5),available=Math.min(3.2,remaining-.12);
 const requestedEntry=({'offbeat-eighth':.5,'offbeat-sixteenth':.25,'space-answer':.25,'triplet-cell':.25,'quintuplet-cell':.125,anticipation:.125,syncopated:.25})[requestedRhythm]??0;
 const entryCapacity=Math.max(0,available-(beat*.25+.11));
 let entry=requestedEntry*beat<=entryCapacity?requestedEntry*beat:entryCapacity>=beat*.125?beat*.125:0;
 if(available-entry+.12<.65)entry=0;
 const body=available-entry,phraseVariation=Math.floor(sequence/2);
 const context={modeId,chord,tonic,barSeconds,variation:phraseVariation,previous};
 const reference=gardenModePhraseZero(notes,{...context,remaining:body+.12});
 if(!reference)return null;
 let style=requestedStyle,fallbackReason=null,plan,segments;
 if(requestedStyle==='combined'){
  const phrase=gardenModePhraseZero(notes,{...context,remaining:Math.min(body,1.25*beat)+.12});
  const gap=clamp(beat*.18,.10,.20);
  for(const arpCount of requestedRhythm==='quintuplet-cell'?[5,4,3]:[4,3]){
   if(!phrase)break;
   const first=phraseRhythm(phrase,order==='arpeggio-phrase'?requestedRhythm:'straight-rest',body);
   const rawArp=brokenArpeggio(notes,reference,{variation:Math.floor(sequence/4),available:body,compact:arpCount});
   if(!rawArp)continue;
   const second=phraseRhythm(rawArp,order==='phrase-arpeggio'?requestedRhythm:'straight-rest',body);
   const parts=order==='phrase-arpeggio'?[{kind:'phrase',plan:first},{kind:'arpeggio',plan:second}]:[{kind:'arpeggio',plan:second},{kind:'phrase',plan:first}];
   if(parts[0].plan.duration+gap+parts[1].plan.duration>body+1e-9)continue;
   let onset=0;const events=[];segments=[];
   for(const part of parts){segments.push({kind:part.kind,motifId:part.plan.motifId,start:onset,end:onset+part.plan.duration,rhythm:part.plan.rhythm});events.push(...part.plan.events.map(event=>({...event,onset:event.onset+onset,segment:part.kind})));onset+=part.plan.duration+gap;}
   plan={...reference,events,notes:events.map(event=>event.midi),pattern:order,motifId:parts.map(part=>part.plan.motifId).join('+'),duration:span(events),rhythm:parts.find(part=>part.plan.rhythm===requestedRhythm)?.plan.rhythm??'compact-offbeat'};break;
  }
  if(!plan){style=order==='phrase-arpeggio'?'phrase':'arpeggio';fallbackReason='short-window';}
 }
 if(!plan){
  const raw=style==='arpeggio'?brokenArpeggio(notes,reference,{variation:Math.floor(sequence/4),available:body}):reference;
  if(!raw)return null;
  plan=phraseRhythm(raw,requestedRhythm,body);segments=[{kind:style,motifId:plan.motifId,start:0,end:plan.duration,rhythm:plan.rhythm}];
 }
 const events=plan.events.map(event=>({...event,onset:event.onset+entry})),duration=span(events),last=events.at(-1);
 return {...plan,notes:events.map(event=>event.midi),events,duration,requestedStyle,style,order:style==='combined'?order:null,fallbackReason,requestedRhythm,rhythm:plan.rhythm,entryOffsetBeats:entry/beat,endOffsetBeats:duration/beat,end:{midi:last.midi,attackBeats:last.onset/beat,releaseBeats:duration/beat},segments:segments.map(segment=>({...segment,start:segment.start+entry,end:segment.end+entry}))};
}
