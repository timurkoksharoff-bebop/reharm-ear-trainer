const NOTE_NAMES=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const CHORDS=[
  ['maj',[0,4,7]],['m',[0,3,7]],['6',[0,4,7,9]],['m6',[0,3,7,9]],
  ['maj7',[0,4,7,11]],['7',[0,4,7,10]],['m7',[0,3,7,10]],['m7♭5',[0,3,6,10]],
  ['sus2',[0,2,7]],['sus4',[0,5,7]],['m9',[0,3,7,10,2]],['add9',[0,4,7,2]]
];
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
const chordLabel=(chroma,bassPc)=>recognizeChord(chroma,bassPc).label;
function openDatabase(){return new Promise((resolve,reject)=>{const request=indexedDB.open('echo-garden-studio',1);request.onupgradeneeded=()=>request.result.createObjectStore('routes',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
async function databaseAction(mode,work){const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('routes',mode),store=tx.objectStore('routes'),result=work(store);tx.oncomplete=()=>{db.close();resolve(result?.result)};tx.onerror=()=>{db.close();reject(tx.error);};});}

export class GardenSequenceStudio{
  constructor({onUse}={}){this.onUse=onUse;this.steps=[];this.routes=[];this.capture=null;this.renderSteps();this.refresh();}
  async refresh(){this.routes=await databaseAction('readonly',store=>store.getAll()).catch(()=>[]);this.routes.sort((a,b)=>b.created.localeCompare(a.created));this.renderLibrary();}
  open(){ $('sequence-studio').hidden=false;$('studio-name').focus();this.refresh(); }
  close(){if(this.capture)this.stopCapture();$('sequence-studio').hidden=true;}
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
  renderSteps(){
    $('studio-steps').replaceChildren(...this.steps.map((step,index)=>{
      const row=document.createElement('li');row.className='studio-step';
      const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');
      const input=document.createElement('input');input.value=step.label;input.setAttribute('aria-label',`Название аккорда ${index+1}`);input.addEventListener('change',()=>{step.label=input.value.trim()||step.degree;step.degree=step.label;});
      const meta=document.createElement('small');meta.textContent=`бас ${NOTE_NAMES[(step.bassMidi%12+12)%12]}${Math.floor(step.bassMidi/12)-1} · ${step.notes.map(midi=>NOTE_NAMES[(midi%12+12)%12]+(Math.floor(midi/12)-1)).join(' ')}`;
      const listen=document.createElement('button');listen.textContent='▶';listen.title='Прослушать';listen.addEventListener('click',()=>{const url=URL.createObjectURL(step.audio),audio=new Audio(url);audio.onended=()=>URL.revokeObjectURL(url);audio.play();});
      const remove=document.createElement('button');remove.textContent='×';remove.title='Удалить';remove.addEventListener('click',()=>{this.steps.splice(index,1);this.renderSteps();});
      row.append(number,input,meta,listen,remove);return row;
    }));
    $('studio-count').textContent=`${this.steps.length} ${this.steps.length===1?'аккорд':'аккорда'}`;$('studio-save').disabled=this.steps.length<2;
  }
  async save(){
    const name=$('studio-name').value.trim()||`Маршрут ${this.routes.length+1}`,number=$('studio-number').value.trim()||String(this.routes.length+1).padStart(2,'0');
    const baseRoot=this.steps[0].rootPc;
    const route={id:`user-${crypto.randomUUID()}`,name,number,created:new Date().toISOString(),source:`Записано в Саду Эха · маршрут ${number}`,baseTonic:baseRoot,sequence:this.steps.map(step=>({...step,degree:step.label,offset:(step.rootPc-baseRoot+12)%12})),distractors:[]};
    await databaseAction('readwrite',store=>store.put(route));this.steps=[];this.renderSteps();$('studio-name').value='';$('studio-number').value='';await this.refresh();$('studio-error').textContent=`«${name}» сохранён.`;return route;
  }
  renderLibrary(){
    $('studio-library').replaceChildren(...this.routes.map(route=>{
      const row=document.createElement('article');row.className='library-route';
      const text=document.createElement('div');text.innerHTML=`<small>МАРШРУТ ${route.number}</small><strong>${route.name}</strong><span>${route.sequence.length} аккордов</span>`;
      const use=document.createElement('button');use.textContent='В полёт';use.addEventListener('click',()=>{this.onUse?.(route);this.close();});
      const remove=document.createElement('button');remove.textContent='×';remove.title='Удалить маршрут';remove.addEventListener('click',async()=>{await databaseAction('readwrite',store=>store.delete(route.id));this.refresh();});row.append(text,use,remove);return row;
    }));
    $('studio-empty').hidden=this.routes.length>0;
  }
}
