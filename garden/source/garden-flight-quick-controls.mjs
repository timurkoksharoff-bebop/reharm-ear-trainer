// These controls only request actions. The flight owns its current route,
// audio reference and eligibility, so a reminder cannot grade an answer.
export function mountGardenFlightQuickControls({language,getState,onReference,onRestart}={}){
 const panel=document.querySelector('.degrees-panel');
 if(!panel)return {refresh(){},close(){},destroy(){}};
 const make=(tag,className)=>{const element=document.createElement(tag);if(className)element.className=className;return element;};
 const bar=make('div','flight-quick-controls');bar.id='flight-quick-controls';bar.hidden=true;bar.setAttribute('role','group');
 const reference=make('button','flight-quick-button flight-quick-reference');reference.id='flight-tonic-reminder';reference.type='button';
 reference.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 17V6l9-2v10M9 9l9-2"/><ellipse cx="6.5" cy="17.5" rx="2.5" ry="1.8"/><ellipse cx="15.5" cy="14.5" rx="2.5" ry="1.8"/></svg>';
 const label=make('div','flight-quick-label'),fallback=make('span','flight-quick-key'),teacherKey=document.getElementById('teacher-key');
 const teacherHome=teacherKey?.parentNode,teacherNext=teacherKey?.nextSibling;
 if(teacherKey)label.append(teacherKey);label.append(fallback);
 const confirmation=make('div','flight-quick-confirmation'),prompt=make('span','flight-quick-prompt'),cancel=make('button','flight-quick-button flight-quick-cancel');confirmation.hidden=true;confirmation.id='flight-restart-confirmation';cancel.type='button';
 cancel.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m7 7 10 10M17 7 7 17"/></svg>';confirmation.append(prompt,cancel);label.append(confirmation);
 const restart=make('button','flight-quick-button flight-quick-restart');restart.id='flight-restart-route';restart.type='button';restart.setAttribute('aria-controls',confirmation.id);restart.setAttribute('aria-expanded','false');
 restart.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.5 9a7 7 0 1 1-.2 5M5.5 4.5V9H10"/></svg>';
 const status=make('span','flight-quick-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 bar.append(reference,label,restart,status);panel.insertBefore(bar,document.getElementById('degree-options')||null);
 let armed=false,busy=false,destroyed=false,timeout=0,lastLanguage=null;
 const english=()=>((typeof language==='function'?language():language?.get?.()??language)==='en');
 const t=(ru,en)=>english()?en:ru;
 const set=(element,name,value)=>{if(element[name]!==value)element[name]=value;};
 const attribute=(element,name,value)=>{if(element.getAttribute(name)!==value)element.setAttribute(name,value);};
 function clearConfirmation(){armed=false;clearTimeout(timeout);timeout=0;}
 function close(){clearConfirmation();refresh();}
 function refresh(){
  if(destroyed)return;
  const state=getState?.()||{},visible=Boolean(state.visible);
  if(!visible||state.canRestart===false)clearConfirmation();
  set(bar,'hidden',!visible);
  const en=english();
  if(lastLanguage!==en){
   lastLanguage=en;attribute(bar,'aria-label',t('Тоника и повтор маршрута','Tonic and route restart'));
   const referenceTitle=t('Напомнить тонику','Remind me of the tonic');attribute(reference,'title',referenceTitle);attribute(reference,'aria-label',referenceTitle);
   attribute(cancel,'title',t('Продолжить текущий полёт','Keep this flight'));attribute(cancel,'aria-label',t('Отменить перезапуск','Cancel restart'));
   set(prompt,'textContent',t('Заново?','Restart?'));
  }
  const restartTitle=armed?t('Подтвердить перезапуск маршрута','Confirm route restart'):t('Начать этот маршрут заново','Restart this route');
  attribute(restart,'title',restartTitle);attribute(restart,'aria-label',restartTitle);attribute(restart,'aria-expanded',String(armed));attribute(bar,'aria-busy',String(busy));
  set(reference,'disabled',busy||!visible||state.canReference===false);set(restart,'disabled',busy||!visible||state.canRestart===false);set(cancel,'disabled',busy);
  set(confirmation,'hidden',!armed);
  // Existing teacher-key hidden/text writes stay under the flight's control.
  // Its wrapper disappears during confirmation without changing that state.
  if(teacherKey)set(teacherKey.style,'display',armed?'none':'');
  set(fallback,'hidden',armed||Boolean(teacherKey&&!teacherKey.hidden));set(fallback,'textContent',String(state.keyLabel||'KEY'));
  if(bar.dataset.confirming!==String(armed))bar.dataset.confirming=String(armed);
 }
 async function request(action){
  if(busy||destroyed)return;
  busy=true;set(status,'textContent','');refresh();
  try{await action?.();}
  catch{set(status,'textContent',t('Не удалось. Попробуй ещё раз.','Could not complete the action. Try again.'));}
  finally{busy=false;refresh();}
 }
 reference.addEventListener('click',()=>{const state=getState?.()||{};if(!state.visible||state.canReference===false||busy)return;clearConfirmation();request(onReference);});
 restart.addEventListener('click',()=>{
  const state=getState?.()||{};if(!state.visible||state.canRestart===false||busy)return;
  if(armed){clearConfirmation();request(onRestart);return;}
  armed=true;set(status,'textContent',t('Нажми повтор ещё раз, чтобы начать маршрут заново.','Press restart again to begin this route again.'));timeout=setTimeout(close,6000);refresh();
 });
 cancel.addEventListener('click',()=>{close();restart.focus({preventScroll:true});});
 // Keep button activation local, while allowing the existing steering keys.
 const steering=event=>['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].includes(event.code||event.key);
 const keydown=event=>{if(steering(event))return;if(event.key==='Escape'&&armed){event.preventDefault();close();restart.focus({preventScroll:true});}event.stopPropagation();};
 bar.addEventListener('keydown',keydown);
 bar.addEventListener('keyup',event=>{if(!steering(event))event.stopPropagation();});
 for(const name of ['pointerdown','pointerup'])bar.addEventListener(name,event=>event.stopPropagation());
 const outside=event=>{if(armed&&!bar.contains(event.target))close();};
 const escape=event=>{if(armed&&event.key==='Escape'){event.preventDefault();close();restart.focus({preventScroll:true});}};
 document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
 language?.onChange?.(refresh);refresh();
 return {refresh,close,destroy(){
  if(destroyed)return;destroyed=true;clearConfirmation();document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);
  if(teacherKey&&teacherHome){teacherKey.style.display='';teacherHome.insertBefore(teacherKey,teacherNext?.parentNode===teacherHome?teacherNext:null);}bar.remove();
 }};
}
