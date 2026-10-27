const modulo=(n,size)=>((n%size)+size)%size;

// The original scale-pickup contours, with explicit note gates for the
// configurable player. These are literal runs through the selected collection;
// they do not insert a phrase cell or replace the last note with a chord target.
export function gardenModeArpeggio(notes,{remaining=1.7,variation=0,barSeconds=4,modeId=''}={}){
 if(!Array.isArray(notes)||notes.length<2||!notes.every(Number.isFinite)||!Number.isFinite(remaining)||remaining<.65)return null;
 const available=Math.min(3.2,remaining-.12),count=Math.min(18,Math.max(3,Math.floor(available/.145))),n=notes.length;
 const sequence=Number.isFinite(variation)?Math.trunc(variation):0;
 const patterns=['up','down','thirds-up','thirds-down','pendulum','weave'];
 const contour=patterns[modulo(sequence,patterns.length)],indices=[];
 const wave=k=>{const p=modulo(k,2*(n-1));return p<n?p:2*(n-1)-p;};
 for(let i=0;i<count;i++){
  let index;
  if(contour==='up')index=wave(i);
  else if(contour==='down')index=n-1-wave(i);
  else if(contour==='thirds-up')index=wave(Math.floor(i/2)+(i%2)*2);
  else if(contour==='thirds-down')index=n-1-wave(Math.floor(i/2)+(i%2)*2);
  else if(contour==='pendulum')index=i%2?n-1-Math.floor(i/2)%n:Math.floor(i/2)%n;
  else index=wave([0,2,1,3,2,4,3,1][i%8]+Math.floor(i/8));
  indices.push(index);
 }
 if(available<1.05)for(let i=0;i<count;i++)indices[i]=sequence%2?n-1-i:i;
 const pitches=indices.map(index=>notes[Math.max(0,Math.min(n-1,index))]);
 const step=available/(count+.25),gate=step*.82;
 const pattern=available<1.05?(sequence%2?'short-down':'short-up'):contour;
 const events=pitches.map((midi,index)=>({midi,onset:index*step,duration:gate,velocity:index===0?.78:index===count-1?.76:index%2?.61:.7,role:'arpeggio',segment:'arpeggio'}));
 const duration=events.at(-1).onset+gate,beat=Number.isFinite(barSeconds)&&barSeconds>0?barSeconds/4:1,last=events.at(-1);
 return {notes:pitches,events,step,duration,pattern,motifId:'arpeggio-'+pattern+'-'+count,modeId,beatSeconds:beat,
  style:'arpeggio',requestedStyle:'arpeggio',rhythm:'straight',requestedRhythm:'straight',order:null,fallbackReason:null,
  segments:[{kind:'arpeggio',motifId:'arpeggio-'+pattern+'-'+count,start:0,end:duration,rhythm:'straight'}],
  entryOffsetBeats:0,endOffsetBeats:duration/beat,end:{midi:last.midi,attackBeats:last.onset/beat,releaseBeats:duration/beat}};
}
