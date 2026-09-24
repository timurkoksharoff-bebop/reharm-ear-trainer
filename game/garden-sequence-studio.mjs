import {BUILTIN_TOUR_ROUTES} from './garden-tour-routes.mjs';
const NOTE_NAMES=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const CHORDS=[
  ['1',[0]],
  ['maj',[0,4,7]],['m',[0,3,7]],['6',[0,4,7,9]],['m6',[0,3,7,9]],
  ['maj7',[0,4,7,11]],['7',[0,4,7,10]],['m7',[0,3,7,10]],['m7♭5',[0,3,6,10]],
  ['sus2',[0,2,7]],['sus4',[0,5,7]],['m9',[0,3,7,10,2]],['add9',[0,4,7,2]]
];
const TOURS=Object.freeze([
  ['reharm','Reharm'],['anime','Anime'],['chill','Chill'],['ambient','Ambient'],['cinematic','Cinematic'],
  ['deep-house','Deep House'],['funk','Funk'],['gospel','Gospel'],['drum-bass','Drum & Bass']
]);
const $=id=>document.getElementById(id),magnitude=db=>db<=-100?0:10**(db/20),median=values=>values.length?[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)]:0;
function chooseMime(){for(const type of ['audio/webm;codecs=opus','audio/mp4;codecs=mp4a.40.2','audio/webm','audio/mp4'])if(MediaRecorder?.isTypeSupported(type))return type;return '';}
function recognizeChord(chroma,bassPc){
  const total=chroma.reduce((a,b)=>a+b,0)||1,normalized=chroma.map(value=>value/total);let best={score:-Infinity,root:0,quality:'maj'};
  for(let root=0;root<12;root++)for(const [quality,intervals] of CHORDS){
    const inside=intervals.reduce((sum,interval)=>sum+normalized[(root+interval)%12],0),outside=1-inside;
    const score=inside-outside*.22+normalized[root]*.18+(root===bassPc ? .08 : 0)-intervals.length*.008;
    if(score>best.score)best={score,root,quality};
  }
  return {...best,label:`${NOTE_NAMES[best.root]}${best.quality==='maj'?'':best.quality}`};
}
export function stepFromMidi(notes){
  const bassMidi=Math.min(...notes),bassPc=(bassMidi%12+12)%12,chroma=Array(12).fill(0);notes.forEach(note=>chroma[(note%12+12)%12]++);
  const found=recognizeChord(chroma,bassPc),suffix=found.quality==='maj'?'':found.quality==='1'?' · 1/8':found.quality,base=`${NOTE_NAMES[found.root]}${suffix}`,label=bassPc===found.root?base:`${base}/${NOTE_NAMES[bassPc]}`;
  return {id:crypto.randomUUID(),degree:label,label,rootPc:found.root,quality:found.quality,notes:[...notes],bassMidi,duration:0,audio:null,mimeType:'',bassOffset:(bassPc-found.root+12)%12};
}
function builtInRoute(spec){
  const steps=spec.chords.map(stepFromMidi),baseRoot=steps[0]?.rootPc??0;
  return {...spec,builtin:true,created:'2000-01-01T00:00:00.000Z',baseTonic:baseRoot,sequence:steps.map(step=>({...step,offset:(step.rootPc-baseRoot+12)%12})),distractors:[]};
}
const chordLabel=(chroma,bassPc)=>recognizeChord(chroma,bassPc).label;
const qualityIntervals=quality=>CHORDS.find(([name])=>name===quality)?.[1]??[0,4,7];
const musicXmlQuality=kind=>({major:'maj',minor:'m',dominant:'7','major-seventh':'maj7','minor-seventh':'m7','half-diminished':'m7b5','diminished-seventh':'dim7','suspended-fourth':'sus4','suspended-second':'sus2','major-sixth':'6','minor-sixth':'m6'}[kind]||'maj');
const pitchClass=(step,alter=0)=>(['C','D','E','F','G','A','B'].indexOf(step)*2-[0,0,0,1,1,1,1][Math.max(0,['C','D','E','F','G','A','B'].indexOf(step))]+Number(alter)+12)%12;
function wavSlice(buffer,start,end){
  const channels=buffer.numberOfChannels,from=Math.max(0,Math.floor(start*buffer.sampleRate)),to=Math.min(buffer.length,Math.ceil(end*buffer.sampleRate)),length=Math.max(1,to-from),out=new ArrayBuffer(44+length*channels*2),view=new DataView(out);
  const text=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));};
  text(0,'RIFF');view.setUint32(4,36+length*channels*2,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*channels*2,true);view.setUint16(32,channels*2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,length*channels*2,true);
  let offset=44;for(let i=0;i<length;i++)for(let channel=0;channel<channels;channel++){const sample=Math.max(-1,Math.min(1,buffer.getChannelData(channel)[from+i]||0));view.setInt16(offset,sample<0?sample*32768:sample*32767,true);offset+=2;}
  return new Blob([out],{type:'audio/wav'});
}
function splitAudio(buffer){
  const data=buffer.getChannelData(0),frame=1024,rms=[];
  for(let at=0;at<data.length;at+=frame){let sum=0;for(let i=at;i<Math.min(data.length,at+frame);i++)sum+=data[i]*data[i];rms.push(Math.sqrt(sum/Math.min(frame,data.length-at)));}
  const sorted=[...rms].sort((a,b)=>a-b),loud=sorted[Math.floor(sorted.length*.9)]||0,threshold=Math.max(.0025,loud*.105),gapFrames=Math.max(2,Math.round(buffer.sampleRate*.22/frame));
  const spans=[];let start=-1,last=-1;
  for(let i=0;i<rms.length;i++)if(rms[i]>threshold){if(start<0)start=i;if(last>=0&&i-last>gapFrames){spans.push([start,last+1]);start=i;}last=i;}
  if(start>=0)spans.push([start,(last??start)+1]);
  let segments=spans.map(([a,b])=>[Math.max(0,a*frame/buffer.sampleRate-.06),Math.min(buffer.duration,b*frame/buffer.sampleRate+.14)]).filter(([a,b])=>b-a>.28);
  if(segments.length<2){
    const onsets=[0];for(let i=2;i<rms.length;i++){const time=i*frame/buffer.sampleRate;if(time-onsets.at(-1)<.58)continue;const before=Math.max(rms[i-1],rms[i-2],.0001);if(rms[i]>threshold*1.7&&rms[i]>before*1.75)onsets.push(time);}
    if(onsets.length>1)segments=onsets.map((time,index)=>[time,onsets[index+1]??buffer.duration]).filter(([a,b])=>b-a>.3);
  }
  return segments.length?segments:[[0,buffer.duration]];
}
function analyzeSegment(buffer,start,end){
  const data=buffer.getChannelData(0),sampleRate=buffer.sampleRate,windowSize=Math.min(4096,Math.max(1024,Math.floor((end-start)*sampleRate/5))),chroma=Array(12).fill(0),midiEnergy=[];
  for(let midi=36;midi<=83;midi++){
    const frequency=440*2**((midi-69)/12),coefficient=2*Math.cos(2*Math.PI*frequency/sampleRate);let energy=0;
    for(let window=1;window<=4;window++){const center=start+(end-start)*window/5,at=Math.max(0,Math.min(data.length-windowSize,Math.floor(center*sampleRate-windowSize/2)));let previous=0,previous2=0;for(let i=0;i<windowSize;i++){const value=data[at+i]*(.5-.5*Math.cos(2*Math.PI*i/(windowSize-1)))+coefficient*previous-previous2;previous2=previous;previous=value;}energy+=previous2*previous2+previous*previous-coefficient*previous*previous2;}
    midiEnergy.push([midi,energy]);chroma[(midi%12+12)%12]+=energy*(midi<64?1:.55);
  }
  const max=Math.max(...midiEnergy.map(([,value])=>value),1),bassMidi=midiEnergy.find(([,value])=>value>max*.12)?.[0]??48,recognized=recognizeChord(chroma,(bassMidi%12+12)%12),rootMidi=48+recognized.root;
  return {...recognized,label:`${NOTE_NAMES[recognized.root]}${recognized.quality==='maj'?'':recognized.quality}`,bassMidi,notes:qualityIntervals(recognized.quality).map(interval=>rootMidi+interval)};
}
export function parseMidi(arrayBuffer){
  const bytes=new Uint8Array(arrayBuffer),view=new DataView(arrayBuffer);let cursor=0;
  const text=length=>{let value='';while(length--)value+=String.fromCharCode(bytes[cursor++]);return value;};
  const u16=()=>{const value=view.getUint16(cursor);cursor+=2;return value;},u32=()=>{const value=view.getUint32(cursor);cursor+=4;return value;};
  if(text(4)!=='MThd')throw Error('это не Standard MIDI File');const headerLength=u32(),format=u16(),trackCount=u16(),division=u16();cursor=8+headerLength;
  const noteOns=[];
  const vlq=end=>{let value=0,count=0;while(cursor<end&&count++<4){const byte=bytes[cursor++];value=(value<<7)|(byte&127);if(byte<128)return value;}return value;};
  for(let track=0;track<trackCount&&cursor<bytes.length;track++){
    if(text(4)!=='MTrk')throw Error('повреждён блок MTrk');const length=u32(),end=Math.min(bytes.length,cursor+length);let tick=0,running=0;
    while(cursor<end){tick+=vlq(end);let status=bytes[cursor];if(status<128){if(!running)throw Error('MIDI running status без события');status=running;}else{cursor++;if(status<240)running=status;}
      if(status===255){cursor++;const size=vlq(end);cursor+=size;continue;}
      if(status===240||status===247){const size=vlq(end);cursor+=size;running=0;continue;}
      const type=status&240,channel=status&15,data1=bytes[cursor++],twoBytes=!([192,208].includes(type)),data2=twoBytes?bytes[cursor++]:0;
      if(type===144&&data2>0)noteOns.push({tick,note:data1,velocity:data2,channel});
    }
    cursor=end;
  }
  if(!noteOns.length)throw Error('в MIDI нет нот');noteOns.sort((a,b)=>a.tick-b.tick||a.note-b.note);
  const tolerance=Math.max(3,Math.round(division/16)),groups=[];
  for(const event of noteOns){const group=groups.at(-1);if(group&&event.tick-group.tick<=tolerance)group.events.push(event);else groups.push({tick:event.tick,events:[event]});}
  const chords=groups.map(group=>[...new Set(group.events.map(event=>event.note))].sort((a,b)=>a-b)).filter(notes=>notes.length>=2);
  if(!chords.length)throw Error('не найдено одновременных групп нот');
  return {format,division,chords};
}
function openDatabase(){return new Promise((resolve,reject)=>{const request=indexedDB.open('echo-garden-studio',1);request.onupgradeneeded=()=>request.result.createObjectStore('routes',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
async function databaseAction(mode,work){const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('routes',mode),store=tx.objectStore('routes'),result=work(store);tx.oncomplete=()=>{db.close();resolve(result?.result)};tx.onerror=()=>{db.close();reject(tx.error);};});}

export class GardenSequenceStudio{
  constructor({onUse,onOpen,onClose}={}){
    this.onUse=onUse;this.onOpen=onOpen;this.onClose=onClose;this.steps=[];this.routes=[];this.capture=null;
    $('studio-add-step')?.addEventListener('click',()=>this.addManualStep());
    $('studio-import-audio')?.addEventListener('change',event=>{for(const file of event.target.files||[])this.addManualStep(file);event.target.value='';});
    $('studio-import-route')?.addEventListener('change',event=>{const file=event.target.files?.[0];if(file)this.importRouteFile(file);event.target.value='';});
    this.renderSteps();this.refresh();
  }
  async refresh(){const saved=await databaseAction('readonly',store=>store.getAll()).catch(()=>[]);saved.sort((a,b)=>b.created.localeCompare(a.created));this.routes=[...BUILTIN_TOUR_ROUTES.map(builtInRoute),...saved];this.renderLibrary();}
  open(){this.onOpen?.();$('sequence-studio').hidden=false;$('studio-name').focus();this.refresh(); }
  close(){if(this.capture)this.stopCapture();$('sequence-studio').hidden=true;this.onClose?.();}
  async startCapture(){
    $('studio-error').textContent='';
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:{ideal:2}},video:false});
      const Context=window.AudioContext||window.webkitAudioContext,context=new Context({latencyHint:'interactive'});await context.resume();
      const source=context.createMediaStreamSource(stream),analyser=context.createAnalyser();analyser.fftSize=32768;analyser.smoothingTimeConstant=.7;analyser.minDecibels=-105;analyser.maxDecibels=-18;source.connect(analyser);
      const mime=chooseMime(),chunks=[],recorder=new MediaRecorder(stream,mime?{mimeType:mime,audioBitsPerSecond:192000}:undefined),frames=[];
      recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};recorder.start(250);
      const started=performance.now(),freq=new Float32Array(analyser.frequencyBinCount),timer=setInterval(()=>{
        analyser.getFloatFrequencyData(freq);const step=context.sampleRate/2/freq.length,chroma=Array(12).fill(0),midiEnergy=new Map();let bass={midi:48,value:0};
        for(let index=1;index<freq.length;index++){const hz=index*step;if(hz<42||hz>6000)continue;const value=magnitude(freq[index]);if(value<.00008)continue;const midi=Math.round(69+12*Math.log2(hz/440)),pc=(midi%12+12)%12,weight=hz<1800?1:.3;chroma[pc]+=value*weight;midiEnergy.set(midi,(midiEnergy.get(midi)||0)+value);if(hz<360&&value>bass.value)bass={midi,value};}
        if(chroma.reduce((a,b)=>a+b,0)>.006)frames.push({chroma,bass:bass.midi,midiEnergy:[...midiEnergy]});
        const aggregate=Array(12).fill(0);for(const frame of frames.slice(-8))frame.chroma.forEach((value,index)=>aggregate[index]+=value);
        if(frames.length)$('studio-detected').textContent=`Слышу: ${chordLabel(aggregate,(frames.at(-1).bass%12+12)%12)}`;
        $('studio-capture-time').textContent=`${((performance.now()-started)/1000).toFixed(1)} с`;
      },120);
      this.capture={stream,context,source,analyser,recorder,chunks,frames,timer,started};$('studio-capture').textContent='■ Зафиксировать аккорд';$('studio-capture').classList.add('recording');$('studio-state').textContent=`ШАГ ${String(this.steps.length+1).padStart(2,'0')} · СЛУШАЮ`;
    }catch(error){$('studio-error').textContent=error.name==='NotAllowedError'?'Разреши микрофон в настройках браузера.':`Микрофон не включился: ${error.message}`;}
  }
  async stopCapture(){
    const capture=this.capture;if(!capture)return;this.capture=null;clearInterval(capture.timer);
    const blob=await new Promise(resolve=>{capture.recorder.onstop=()=>resolve(new Blob(capture.chunks,{type:capture.recorder.mimeType||'audio/webm'}));capture.recorder.stop();});
    capture.stream.getTracks().forEach(track=>track.stop());capture.source.disconnect();capture.analyser.disconnect();capture.context.close();
    const useful=capture.frames.slice(Math.floor(capture.frames.length*.15)),chroma=Array(12).fill(0),energy=new Map();
    for(const frame of useful){frame.chroma.forEach((value,index)=>chroma[index]+=value);for(const [midi,value] of frame.midiEnergy)energy.set(midi,(energy.get(midi)||0)+value);}
    const bassMidi=Math.round(median(useful.map(frame=>frame.bass))),bassPc=(bassMidi%12+12)%12;
    const notes=[...energy].sort((a,b)=>b[1]-a[1]).filter(([midi],index,list)=>list.slice(0,index).every(([chosen])=>Math.abs(chosen-midi)>1)).slice(0,6).map(([midi])=>midi).sort((a,b)=>a-b);
    const recognized=recognizeChord(chroma,bassPc),label=recognized.label,duration=(performance.now()-capture.started)/1000;
    this.steps.push({id:crypto.randomUUID(),degree:label,label,rootPc:recognized.root,quality:recognized.quality,notes:notes.length?notes:[bassMidi,bassMidi+4,bassMidi+7],bassMidi,duration,audio:blob,mimeType:blob.type});
    $('studio-capture').textContent='● Записать следующий аккорд';$('studio-capture').classList.remove('recording');$('studio-state').textContent='ГОТОВ К НОВОМУ ШАГУ';$('studio-detected').textContent=`Зафиксирован ${label} · бас ${NOTE_NAMES[bassPc]}${Math.floor(bassMidi/12)-1}`;$('studio-capture-time').textContent=`${duration.toFixed(1)} с`;this.renderSteps();
  }
  toggleCapture(){return this.capture?this.stopCapture():this.startCapture();}
  addManualStep(audio=null){
    const quality='maj',rootPc=0,label=audio?.name?.replace(/\.[^.]+$/,'').trim()||'C';
    this.steps.push({id:crypto.randomUUID(),degree:label,label,rootPc,quality,notes:[48,52,55],bassMidi:48,duration:0,audio,mimeType:audio?.type||''});
    this.renderSteps();
  }
  async importRouteFile(file){
    $('studio-error').textContent=`Читаю ${file.name}…`;
    try{
      if(/\.(?:mid|midi)$/i.test(file.name)||/midi/.test(file.type))await this.importMidi(file);
      else if(/\.(?:xml|musicxml)$/i.test(file.name)||/xml/.test(file.type))await this.importMusicXml(file);
      else await this.importLongAudio(file);
      $('studio-error').textContent=`${file.name}: добавлено ${this.steps.length} шагов. Проверь цепочку и сохрани.`;
    }catch(error){$('studio-error').textContent=`Не удалось разобрать ${file.name}: ${error.message}`;}
  }
  async importLongAudio(file){
    const Context=window.AudioContext||window.webkitAudioContext,context=new Context();const buffer=await context.decodeAudioData(await file.arrayBuffer()),segments=splitAudio(buffer);this.steps=[];
    for(const [start,end] of segments){const found=analyzeSegment(buffer,start,end),audio=wavSlice(buffer,start,end);this.steps.push({id:crypto.randomUUID(),degree:found.label,label:found.label,rootPc:found.root,quality:found.quality,notes:found.notes,bassMidi:found.bassMidi,duration:end-start,audio,mimeType:'audio/wav'});}
    await context.close();this.renderSteps();if(!$('studio-name').value)$('studio-name').value=file.name.replace(/\.[^.]+$/,'');
  }
  async importMidi(file){
    const stem=file.name.replace(/\.(?:mid|midi)$/i,''),parsed=parseMidi(await file.arrayBuffer());
    // In the supplied Anime 3 take the first two simultaneities are accidental
    // keyboard input before the seven-chord route begins on Fm7.
    const chordGroups=/^anime\s+3$/i.test(stem.trim())&&parsed.chords.length===9?parsed.chords.slice(2):parsed.chords;
    this.steps=chordGroups.map(stepFromMidi);
    const match=stem.match(/^(.+?)\s+(\d+)$/);if(match){const folder=match[1].trim().toLowerCase().replace(/\s+tour$/,'');const option=[...$('studio-tour').options].find(item=>item.value===folder||item.textContent.toLowerCase()===`${folder} tour`);if(option)$('studio-tour').value=option.value;$('studio-number').value=String(Number(match[2])).padStart(2,'0');}
    $('studio-name').value=stem;this.renderSteps();
  }
  async importMusicXml(file){
    const xml=new DOMParser().parseFromString(await file.text(),'application/xml');if(xml.querySelector('parsererror'))throw Error('XML повреждён');const imported=[];
    for(const measure of xml.querySelectorAll('part:first-of-type > measure, score-partwise > part:first-of-type > measure')){
      const harmonies=[...measure.querySelectorAll(':scope > harmony')];
      if(harmonies.length){for(const harmony of harmonies){const step=harmony.querySelector('root-step')?.textContent?.trim()||'C',alter=Number(harmony.querySelector('root-alter')?.textContent||0),rootPc=pitchClass(step,alter),quality=musicXmlQuality(harmony.querySelector('kind')?.getAttribute('text')||harmony.querySelector('kind')?.textContent?.trim()),label=`${NOTE_NAMES[rootPc]}${quality==='maj'?'':quality}`,rootMidi=48+rootPc;imported.push({id:crypto.randomUUID(),degree:label,label,rootPc,quality,notes:qualityIntervals(quality).map(interval=>rootMidi+interval),bassMidi:rootMidi,duration:0,audio:null,mimeType:''});}continue;}
      const pcs=[...measure.querySelectorAll(':scope > note:not(:has(rest)) pitch')].map(pitch=>pitchClass(pitch.querySelector('step')?.textContent?.trim()||'C',pitch.querySelector('alter')?.textContent||0));if(!pcs.length)continue;const chroma=Array(12).fill(0);pcs.forEach(pc=>chroma[pc]++);const rootPc=pcs[0],found=recognizeChord(chroma,rootPc),label=`${NOTE_NAMES[found.root]}${found.quality==='maj'?'':found.quality}`,rootMidi=48+found.root;imported.push({id:crypto.randomUUID(),degree:label,label,rootPc:found.root,quality:found.quality,notes:qualityIntervals(found.quality).map(interval=>rootMidi+interval),bassMidi:rootMidi,duration:0,audio:null,mimeType:''});
    }
    if(!imported.length)throw Error('не найдено ни harmony symbols, ни нот по тактам');this.steps=imported;this.renderSteps();if(!$('studio-name').value)$('studio-name').value=file.name.replace(/\.(?:musicxml|xml)$/i,'');
  }
  renderSteps(){
    $('studio-steps').replaceChildren(...this.steps.map((step,index)=>{
      const row=document.createElement('li');row.className='studio-step';
      const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');
      const root=document.createElement('select');root.className='studio-root';root.setAttribute('aria-label',`Корень аккорда ${index+1}`);root.replaceChildren(...NOTE_NAMES.map((name,pc)=>{const option=document.createElement('option');option.value=String(pc);option.textContent=name;option.selected=pc===step.rootPc;return option;}));
      const quality=document.createElement('select');quality.className='studio-quality';quality.setAttribute('aria-label',`Тип аккорда ${index+1}`);quality.replaceChildren(...CHORDS.map(([name])=>{const option=document.createElement('option');option.value=name;option.textContent=name;option.selected=name===step.quality;return option;}));
      const input=document.createElement('input');input.value=step.label;input.setAttribute('aria-label',`Название аккорда ${index+1}`);input.addEventListener('change',()=>{step.label=input.value.trim()||step.degree;step.degree=step.label;});
      const syncLabel=()=>{step.rootPc=Number(root.value);step.quality=quality.value;step.bassMidi=48+step.rootPc;step.label=`${NOTE_NAMES[step.rootPc]}${step.quality==='maj'?'':step.quality}`;step.degree=step.label;input.value=step.label;};root.addEventListener('change',syncLabel);quality.addEventListener('change',syncLabel);
      const meta=document.createElement('small');meta.textContent=`бас ${NOTE_NAMES[(step.bassMidi%12+12)%12]}${Math.floor(step.bassMidi/12)-1} · ${step.notes.map(midi=>NOTE_NAMES[(midi%12+12)%12]+(Math.floor(midi/12)-1)).join(' ')}`;
      const sound=document.createElement('label');sound.className=`studio-step-audio${step.audio?' attached':''}`;sound.textContent=step.audio?'♫':'＋ звук';const file=document.createElement('input');file.type='file';file.accept='audio/*';file.addEventListener('change',()=>{const picked=file.files?.[0];if(!picked)return;step.audio=picked;step.mimeType=picked.type;step.duration=0;this.renderSteps();});sound.append(file);
      const listen=document.createElement('button');listen.textContent='▶';listen.title=step.audio?'Прослушать файл':'Сначала прикрепи звук';listen.disabled=!step.audio;listen.addEventListener('click',()=>{if(!step.audio)return;const url=URL.createObjectURL(step.audio),audio=new Audio(url);audio.onended=()=>URL.revokeObjectURL(url);audio.play();});
      const remove=document.createElement('button');remove.textContent='×';remove.title='Удалить';remove.addEventListener('click',()=>{this.steps.splice(index,1);this.renderSteps();});
      row.append(number,root,quality,input,sound,listen,remove,meta);return row;
    }));
    $('studio-count').textContent=`${this.steps.length} ${this.steps.length===1?'аккорд':'аккорда'}`;$('studio-save').disabled=this.steps.length<2;
  }
  async save(){
    const name=$('studio-name').value.trim()||`Маршрут ${this.routes.length+1}`,number=$('studio-number').value.trim()||String(this.routes.length+1).padStart(2,'0'),tour=$('studio-tour')?.value||'reharm';
    const baseRoot=this.steps[0].rootPc;
    const route={id:`user-${crypto.randomUUID()}`,name,number,tour,created:new Date().toISOString(),source:`${TOURS.find(([id])=>id===tour)?.[1]||'Reharm Tour'} · маршрут ${number}`,baseTonic:baseRoot,sequence:this.steps.map(step=>({...step,degree:step.label,offset:(step.rootPc-baseRoot+12)%12})),distractors:[]};
    await databaseAction('readwrite',store=>store.put(route));this.steps=[];this.renderSteps();$('studio-name').value='';$('studio-number').value='';await this.refresh();$('studio-error').textContent=`«${name}» сохранён.`;return route;
  }
  renderLibrary(){
    $('studio-library').replaceChildren(...TOURS.map(([tourId,tourName])=>{
      const folder=document.createElement('section');folder.className='library-folder';const routes=this.routes.filter(route=>(route.tour||'reharm')===tourId);
      const heading=document.createElement('header');heading.innerHTML=`<strong>${tourName}</strong><span>${routes.length}</span>`;folder.append(heading);
      for(const route of routes){
        const row=document.createElement('article');row.className='library-route';
        const text=document.createElement('div');text.innerHTML=`<small>МАРШРУТ ${route.number}</small><strong>${route.name}</strong><span>${route.sequence.length} аккордов</span>`;
        const use=document.createElement('button');use.textContent='В полёт';use.addEventListener('click',()=>{this.onUse?.(route);this.close();});
        row.append(text,use);if(!route.builtin){const remove=document.createElement('button');remove.textContent='×';remove.title='Удалить маршрут';remove.addEventListener('click',async()=>{await databaseAction('readwrite',store=>store.delete(route.id));this.refresh();});row.append(remove);}folder.append(row);
      }
      if(!routes.length){const empty=document.createElement('p');empty.textContent='Пока пусто';folder.append(empty);}return folder;
    }));
    $('studio-empty').hidden=this.routes.length>0;
  }
}
