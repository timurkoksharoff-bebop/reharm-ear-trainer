// Desktop recording is opt-in. Capture video from the user's picker and tap
// only this game's final audio output: no microphone or system-audio request.
export function gardenRecordingSupported(env=globalThis){
 const nav=env.navigator??{},mobile=nav.userAgentData?.mobile||/Android|iPhone|iPad|iPod/i.test(nav.userAgent??'')||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1);
 return !mobile&&Boolean(env.isSecureContext&&nav.mediaDevices?.getDisplayMedia&&env.MediaRecorder&&env.MediaStream);
}
export function gardenRecordingMime(Recorder=globalThis.MediaRecorder){
 return ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/webm;codecs=vp8,opus','video/webm;codecs=vp9,opus','video/mp4','video/webm'].find(type=>Recorder?.isTypeSupported?.(type))||'';
}
export class GardenRecorder{
 constructor({pad,onChange=()=>{},onReady=()=>{},capture,Recorder=globalThis.MediaRecorder,Stream=globalThis.MediaStream,now=()=>performance.now()}={}){
  this.pad=pad;this.onChange=onChange;this.onReady=onReady;this.capture=capture??(options=>navigator.mediaDevices.getDisplayMedia(options));this.Recorder=Recorder;this.Stream=Stream;this.now=now;this.state='idle';this.session=null;
 }
 async start(){
  if(this.state!=='idle')return false;
  this.state='choosing';this.onChange(this.state);
  const session={chunks:[],bytes:0,display:null,audio:null,recorder:null,timer:null,error:null};this.session=session;
  try{
   // Must remain inside the click's transient activation, before any await.
   session.display=await this.capture({video:{frameRate:{ideal:30,max:30},width:{ideal:1920},height:{ideal:1080}},audio:false,preferCurrentTab:true,selfBrowserSurface:'include',systemAudio:'exclude'});
   if(this.session!==session){this.cleanup(session);return false;}
   const video=session.display.getVideoTracks()[0];if(!video||video.readyState==='ended')throw Error('capture-ended');
   await this.pad.unlock();
   if(this.session!==session){this.cleanup(session);return false;}
   session.audio=this.pad.context.createMediaStreamDestination();this.pad.master.connect(session.audio);
   const audio=session.audio.stream.getAudioTracks()[0];if(!audio)throw Error('audio-unavailable');
   const stream=new this.Stream([video,audio]),mime=gardenRecordingMime(this.Recorder);
   const recorder=session.recorder=new this.Recorder(stream,{...(mime?{mimeType:mime}:{}),videoBitsPerSecond:4000000,audioBitsPerSecond:160000});
   recorder.ondataavailable=event=>{if(event.data?.size){session.chunks.push(event.data);session.bytes+=event.data.size;if(session.bytes>=200*1024*1024){session.limit=true;this.stop();}}};
   recorder.onerror=event=>{session.error=event.error??Error('recording-error');if(recorder.state!=='inactive')this.stop();};
   recorder.onstop=()=>this.finish(session);
   video.addEventListener('ended',()=>this.stop(),{once:true});
   recorder.start(1000);session.started=this.now();this.state='recording';this.onChange(this.state);
   session.timer=setInterval(()=>{if(this.now()-session.started>=15*60*1000){session.limit=true;this.stop();}else this.onChange(this.state,this.elapsed());},500);
   return true;
  }catch(error){
   this.cleanup(session);if(this.session===session){this.session=null;this.state='idle';this.onChange('error',error);}return false;
  }
 }
 elapsed(){return this.session?.started!=null?Math.max(0,(this.now()-this.session.started)/1000):0;}
 stop(){
  const session=this.session;if(!session||this.state==='stopping')return;
  if(this.state==='choosing'){this.session=null;this.state='idle';this.cleanup(session);this.onChange('idle');return;}
  this.state='stopping';clearInterval(session.timer);this.onChange(this.state);
  if(session.recorder?.state!=='inactive'){
   try{session.recorder.stop();}catch(error){session.error=error;this.finish(session);}
  }else this.finish(session);
 }
 cleanup(session){
  clearInterval(session.timer);
  if(session.audio){try{this.pad.master.disconnect(session.audio);}catch{}session.audio.stream.getTracks().forEach(track=>track.stop());}
  session.display?.getTracks().forEach(track=>track.stop());
 }
 finish(session){
  if(this.session!==session)return;
  this.session=null;this.state='idle';this.cleanup(session);
  const type=session.recorder?.mimeType||session.chunks[0]?.type||'video/webm';
  const blob=new Blob(session.chunks,{type});session.chunks=[];
  this.onChange('idle');
  if(blob.size)this.onReady({blob,extension:type.includes('mp4')?'mp4':'webm',limited:Boolean(session.limit),error:session.error});
  else this.onChange('error',session.error??Error('empty-recording'));
 }
 dispose(){
  const session=this.session;this.session=null;this.state='idle';
  if(session){if(session.recorder?.state==='recording')try{session.recorder.stop();}catch{}this.cleanup(session);}
 }
}
export function mountGardenRecording({pad,language,onStart=()=>{},onReady=()=>{}}){
 const $=id=>document.getElementById(id),panel=$('game-recording');
 if(!gardenRecordingSupported())return null; // No mobile button or hint.
 panel.hidden=false;
 const start=$('recording-start'),stop=$('recording-stop'),bar=$('recording-bar'),clock=$('recording-clock'),status=$('recording-status'),download=$('recording-download'),dialog=$('recording-result'),video=$('recording-video'),save=$('recording-save');
 let url=null,recording=null,notice='',errorKey=null;
 const pick=(ru,en)=>language.pick(ru,en);
 const errorText=error=>['NotAllowedError','AbortError'].includes(error?.name)?pick('Запись не началась: выбор отменён или доступ к экрану запрещён.','Recording did not start: selection cancelled or screen access denied.'):pick('Не удалось записать видео. Попробуй открыть игру в Chrome и разрешить запись экрана в настройках macOS.','Recording failed. Try Chrome and allow screen recording in macOS settings.');
 function render(state=recorder.state,seconds=recorder.elapsed()){
  panel.setAttribute('aria-label',pick('Запись полёта','Flight recording'));
  start.disabled=state!=='idle';start.textContent=pick('● Записать полёт','● Record flight');
  stop.textContent=pick('■ Стоп','■ Stop');stop.disabled=state==='stopping';bar.hidden=!['recording','stopping'].includes(state);
  clock.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(Math.floor(seconds%60)).padStart(2,'0');
  status.textContent=errorKey?errorText(errorKey):state==='choosing'?pick('Выбери окно или вкладку с игрой.','Choose the game window or tab.'):state==='recording'?pick('Идёт запись. После остановки сохрани видео.','Recording. Save the video after stopping.'):state==='stopping'?pick('Готовим видео…','Preparing video…'):notice?pick('Видео готово. Сохрани его до закрытия вкладки.','Video ready. Save it before closing this tab.'):pick('Только по нажатию. Звук игры записывается без микрофона. Выбери именно окно или вкладку игры.','Starts only on request. Game audio, no microphone. Choose only the game window or tab.');
  download.textContent=save.textContent=pick('Сохранить видео','Save video');
  $('recording-title').textContent=pick('Запись полёта','Flight recording');
  $('recording-close').textContent=pick('Закрыть','Close');
  $('recording-note').textContent=recording?.limited?pick('Достигнут лимит 15 минут или 200 МБ. Сохрани записанную часть.','15-minute or 200 MB limit reached. Save the recorded part.'):recording?.error?pick('Запись прервалась. Доступную часть можно сохранить.','Recording was interrupted. You can save the available part.'):pick('Видео остаётся в этой вкладке. Ничего не отправляется на сервер.','Video stays in this tab. Nothing is uploaded.');
 }
 const recorder=new GardenRecorder({pad,onChange:(state,value)=>{if(state==='error'){errorKey=value;render();}else render(state,value);},onReady:result=>{
  recording=result;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(result.blob);
  const name='EAR-YOGA-v'+(globalThis.GARDEN_VERSION||'dev')+'-'+new Date().toISOString().replace(/[:.]/g,'-')+'.'+result.extension;
  for(const link of [download,save]){link.href=url;link.download=name;}download.hidden=false;
  video.src=url;notice='ready';render();onReady();dialog.showModal();
 }});
 start.addEventListener('click',async()=>{errorKey=null;notice='';if(await recorder.start()){onStart();stop.focus({preventScroll:true});}});
 stop.addEventListener('click',()=>recorder.stop());
 $('recording-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>video.pause());
 language.onChange(()=>render());
 window.addEventListener('beforeunload',event=>{if(recorder.state!=='idle'){event.preventDefault();event.returnValue='';}});
 window.addEventListener('pagehide',()=>{recorder.dispose();if(url)URL.revokeObjectURL(url);},{once:true});
 render();return recorder;
}
