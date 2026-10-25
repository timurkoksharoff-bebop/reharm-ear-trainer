// Phrase 0: preserved pure-phrase planner from local1.76 (25e7026).
// Keep this preset stable for audible comparisons with later mixed formulas.
import {INTERVALS} from './music.mjs';

// Small original phrase constructions, not transcriptions of textbook licks.
// The enclosure is a diatonic teaching adaptation: the selected collection is
// kept literal, even where an idiomatic bebop line might add a chromatic tone.
const pc=n=>((n%12)+12)%12;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const aliases={m:'min','m7♭5':'m7b5',m9:'m7natural9','ireal:mMaj7':'mMaj7','ireal:7b13':'7b13','ireal:m11':'m7natural9','ireal:9':'7','ireal:13':'7','ireal:7#9':'7','ireal:7#11':'7','ireal:o':'dim'};
const guides={maj:[4],min:[3],'6':[4,9],m6:[3,9],maj7:[4,11],maj7sharp11:[4,11],m7:[3,10],m7natural9:[3,10],m7b5:[3,6,10],m7b5natural9:[3,6,10],m7b9:[3,10],'7':[4,10],'7b9':[4,10],'7b9b13':[4,10],'7b5':[4,6,10],'7sharp5':[4,8],'7alt':[4,10],dim7:[3,6,9],dim:[3,6],aug:[4,8],augMaj7:[4,8,11],minSharp5:[3,8],sus4:[5],sus2:[2],'7sus4':[5,10],add9:[4,2],mMaj7:[3,11],'7b13':[4,10]};
const colours={
 ionian:[11,5],dorian:[9,3],phrygian:[1,8],lydian:[6],mixolydian:[10,4],aeolian:[8,3],locrian:[6,1],
 'melodic-minor':[11,9,3],'dorian-b2':[1,9],'lydian-augmented':[6,8],'lydian-dominant':[6,10],'mixolydian-b6':[8,10],'locrian-n2':[2,6],altered:[1,3,6,8],
 'harmonic-minor':[8,11],'locrian-n6':[6,9],'ionian-augmented':[8,11],'dorian-s4':[6,9],'phrygian-dominant':[1,4,8],'lydian-s2':[3,6],ultralocrian:[6,9,1],
 'harmonic-major':[8,4],'dorian-b5':[6,9],'phrygian-b4':[4,1],'lydian-b3':[3,6],'mixolydian-b2':[1,10],'lydian-augmented-s2':[3,6,8],'locrian-bb7':[9,6],
 'major-pentatonic':[2,9],'minor-pentatonic':[3,10],'minor-six-pentatonic':[9,3],'half-dim-pentatonic':[6,10],'major-b6-pentatonic':[8,4],'suspended-pentatonic':[5,10],
 'major-blues':[3,4],'minor-blues':[6,3],'whole-tone':[6,8],'diminished-hw':[1,3,6,9],'diminished-wh':[6,9,11],'bebop-dominant':[11,10],'bebop-major':[8,9]
};
const seedOf=text=>{let n=2166136261;for(const c of text)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
const randomFrom=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const nearest=(value,notes)=>notes.reduce((best,n)=>Math.abs(n-value)<Math.abs(best-value)?n:best,notes[0]);
const sameNotes=(a,b)=>Array.isArray(b)&&a.length===b.length&&a.every((n,i)=>n===b[i]);

export function gardenModePhraseZero(notes,{modeId='',chord=null,tonic=null,barSeconds=4,remaining=1.7,variation=0,previous=null}={}){
 if(!Array.isArray(notes)||notes.length<2||!notes.every(Number.isFinite)||!Number.isFinite(remaining)||remaining<.65)return null;
 const root=notes[0],collection=[...new Set(notes.map(n=>pc(n-root)))].sort((a,b)=>a-b);
 if(collection.length<2)return null;
 const sequence=Number.isFinite(variation)?Math.trunc(variation):0;
 const quality=aliases[chord?.quality]??chord?.quality;
 const explicit=Array.isArray(chord?.notes)&&chord.notes.length?chord.notes.filter(Number.isFinite).map(n=>pc(n-root)):Array.isArray(chord?.intervals)&&chord.intervals.length?chord.intervals.filter(Number.isFinite).map(pc):null;
 const chordTones=[...new Set(explicit??INTERVALS[quality]??(guides[quality]?[0,...guides[quality]]:[]))].map(pc);
 const anchors=chordTones.filter(n=>collection.includes(n)),guideTones=(guides[quality]??[]).filter(n=>anchors.includes(n));
 const qualified=anchors.length>0;
 const random=randomFrom(seedOf([modeId,root,quality,sequence,chordTones.join(',')].join('|')));
 const lattice=[];for(let octave=-1;octave<=2;octave++)for(const interval of collection){const midi=root+interval+octave*12;if(midi>=root-5&&midi<=root+17)lattice.push(midi);}
 const around=(midi,distance)=>lattice[clamp(lattice.indexOf(midi)+distance,0,lattice.length-1)];
 const direction=previous?.notes?.length>1?Math.sign(previous.notes[0]-previous.notes.at(-1))||1:random()<.5?-1:1;
 const centre=previous?.notes?.length?clamp(previous.notes.at(-1)+direction*2,root+3,root+11):root+5+(Math.abs(sequence)%3)*2;
 const targetIntervals=guideTones.length&&Math.abs(sequence)%4!==3?guideTones:anchors.length?anchors:[0];
 const targetInterval=targetIntervals[Math.floor(random()*targetIntervals.length)];
 const target=nearest(centre,lattice.filter(n=>pc(n-root)===targetInterval));
 const characteristic=(colours[modeId]??collection.filter(n=>![0,7].includes(n))).filter(n=>collection.includes(n));
 const colourPool=characteristic.filter(n=>n!==targetInterval);
 const colourInterval=(colourPool.length?colourPool:characteristic.length?characteristic:collection.filter(n=>n!==targetInterval))[Math.floor(random()*Math.max(1,colourPool.length||characteristic.length||collection.length-1))];
 const colour=nearest(target+direction*2,lattice.filter(n=>pc(n-root)===colourInterval));
 const anchorNotes=lattice.filter(n=>anchors.includes(pc(n-root))&&n>=root&&n<=root+17);
 const arpeggio=anchorNotes.length?anchorNotes:[root,around(root,2),around(root,4)];
 const arpStart=Math.floor(random()*Math.max(1,arpeggio.length-2));
 const arp=index=>arpeggio[clamp(index+arpStart,0,arpeggio.length-1)];
 const family=['target-approach','diatonic-enclosure','arpeggio-answer','motif-answer'];
 if(collection.length===5)family.push('pentatonic-call');
 if(String(modeId).includes('blues'))family.push('blues-turn');
 let familyIndex=((sequence%family.length)+family.length)%family.length;
 if(previous?.pattern===family[familyIndex])familyIndex=(familyIndex+1)%family.length;
 const pattern=family[familyIndex];
 // A very fast chord window gets fewer notes, never a compressed long lick.
 // The regular grid follows the harmonic bar; the .6 floor protects tiny bars.
 const beat=clamp(Number.isFinite(barSeconds)&&barSeconds>0?barSeconds/4:1,.6,1.5);
 const available=Math.min(3.2,remaining-.12),budget=available/beat;
 let pitches,onsets,gates,roles,velocities;
 if(budget<1.16){
  pitches=[colour,target];onsets=[0,.25];gates=[.18,.25];roles=['colour','target'];velocities=[.65,.84];
 }else if(budget<2.08){
  pitches=[colour,around(target,-direction),target];onsets=[0,.25,.65];gates=[.20,.17,.48];roles=['colour','ghost','target'];velocities=[.74,.44,.87];
 }else if(budget<2.85){
  pitches=pattern==='diatonic-enclosure'?[colour,around(target,direction),around(target,-direction),target]:pattern==='arpeggio-answer'?[arp(0),arp(1),colour,target]:[colour,around(colour,direction),around(target,-direction),target];
  onsets=[0,.5,1.15,1.5];gates=[.34,.28,.20,.55];roles=['colour','approach','ghost','target'];velocities=[.76,.62,.46,.87];
 }else if(pattern==='diatonic-enclosure'){
  pitches=[colour,around(colour,-direction),around(target,direction),around(target,-direction),target];
  onsets=[0,.5,1.25,1.5,2];gates=[.32,.3,.2,.17,.65];roles=['colour','pickup','accent','ghost','target'];velocities=[.75,.58,.79,.43,.9];
 }else if(pattern==='arpeggio-answer'){
  pitches=[arp(direction>0?0:2),arp(1),arp(direction>0?2:0),colour,around(target,-direction),target];
  onsets=[0,.5,1,1.75,2,2.5];gates=[.34,.34,.5,.17,.28,.55];roles=['anchor','anchor','anchor','colour','ghost','target'];velocities=[.68,.6,.76,.73,.48,.89];
 }else if(pattern==='motif-answer'){
  pitches=[colour,around(colour,direction),colour,around(target,direction),target];
  onsets=[0,.25,.75,1.75,2.25];gates=[.18,.17,.48,.22,.58];roles=['colour','ghost','colour','approach','target'];velocities=[.78,.46,.72,.59,.87];
 }else if(pattern==='pentatonic-call'){
  pitches=[colour,around(colour,direction*2),around(colour,direction),colour,around(target,-direction),target];
  onsets=[0,.5,1,1.75,2.25,2.5];gates=[.33,.32,.45,.28,.17,.55];roles=['colour','accent','approach','colour','ghost','target'];velocities=[.76,.8,.58,.7,.46,.88];
 }else if(pattern==='blues-turn'){
  pitches=[around(colour,-direction),colour,around(colour,direction),colour,around(target,-direction),target];
  onsets=[0,.25,.5,1.25,2.25,2.5];gates=[.17,.18,.42,.3,.17,.55];roles=['pickup','colour','accent','colour','ghost','target'];velocities=[.55,.74,.79,.72,.45,.89];
 }else{
  const approachColour=nearest(around(target,-direction*3),lattice.filter(n=>pc(n-root)===colourInterval));
  pitches=[approachColour,around(target,-direction*3),around(target,-direction*2),around(target,-direction),around(target,direction),target];
  onsets=[0,.5,1,1.5,2.25,2.5];gates=[.33,.3,.3,.44,.17,.55];roles=['colour','pickup','approach','accent','ghost','target'];velocities=[.72,.53,.59,.78,.45,.9];
 }
 // If an authored rhythm is too long at this tempo, shorten its construction,
 // retaining its arrival. There is no global time-stretch or pitch correction.
 while((onsets.at(-1)+gates.at(-1))*beat>available&&pitches.length>2){pitches.splice(-2,1);onsets.splice(-2,1);gates.splice(-2,1);roles.splice(-2,1);velocities.splice(-2,1);onsets[onsets.length-1]=onsets.at(-2)+.25;}
 const endGate=Math.min(gates.at(-1)*beat,available-onsets.at(-1)*beat);
 if(endGate<.10)return null;
 let pickup=0;
 // A repeated short cell can answer off the beat while retaining its target.
 if(sameNotes(pitches,previous?.notes))pickup=Math.min(.08,Math.max(0,available-(onsets.at(-1)*beat+endGate)));
 const events=pitches.map((midi,index)=>{
  const targetNote=index===pitches.length-1;
  const onset=onsets[index]*beat+pickup;
  const gate=targetNote?Math.min(endGate,available-onset):gates[index]*beat;
  const velocity=clamp(velocities[index]+(random()-.5)*.025,.4,.92);
  return {midi,onset,duration:Math.max(.06,gate),velocity,role:targetNote?'target':pc(midi-root)===colourInterval?'colour':roles[index]};
 });
 const duration=Math.max(...events.map(event=>event.onset+event.duration));
 return {notes:[...pitches],events,pattern,motifId:pattern+'-'+pitches.length+'-'+(pickup?'answer':'call'),duration,step:beat/2,modeId,beatSeconds:beat,target:target,targetInterval,targetQualified:qualified,characteristic:characteristic.map(n=>root+n)};
}
