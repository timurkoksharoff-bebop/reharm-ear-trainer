import {GARDEN_MODE_TIMBRES} from './garden-mode-timbres.mjs';

// Small live audition controls. Root owns availability, current harmonic
// context and playback; changing a preset never grades another answer.
export function mountGardenPhraseControls({language,settings,voiceSettings,onVoiceChange,onPreview,getContext}={}){
 const root=document.createElement('aside');root.id='live-phrase-controls';root.dataset.userContent='';root.hidden=true;
 const en=()=>language?.get?.()==='en',t=(ru,eng)=>en()?eng:ru;
 const make=(tag,cls)=>{const element=document.createElement(tag);if(cls)element.className=cls;return element;};
 const toggle=make('button','live-phrase-toggle');toggle.type='button';toggle.setAttribute('aria-controls','live-phrase-panel');toggle.setAttribute('aria-expanded','false');
 toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 17V6l11-2v11M9 9l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/></svg>';
 const panel=make('section','live-phrase-panel');panel.id='live-phrase-panel';panel.hidden=true;
 const header=make('header'),heading=make('strong'),closeButton=make('button','live-phrase-close');closeButton.type='button';closeButton.textContent='×';header.append(heading,closeButton);
 const select=make('select');select.id='live-phrase-preset';
 const voiceField=make('div','live-phrase-voice'),voiceLabel=make('label'),voice=make('select'),credit=make('a','mode-voice-credit'),creditNote=make('small','mode-voice-attribution');voice.id='live-phrase-voice';voiceLabel.htmlFor=voice.id;credit.href='assets/echo-garden/samples/modal/MODAL_SAMPLE_CREDITS.md';credit.target='_blank';credit.rel='noopener';voiceField.append(voiceLabel,voice,credit,creditNote);
 const mix=make('div','live-phrase-mix'),amounts=make('div','live-phrase-amounts'),summary=make('p','live-phrase-summary'),rangeControls=[];
 for(const key of ['arpeggioPercent','combinedPercent']){const label=make('label'),caption=make('span'),input=make('input');input.id='live-phrase-'+key;input.type='number';input.min='0';input.max='100';input.step='5';input.inputMode='numeric';label.append(caption,input);amounts.append(label);rangeControls.push({key,caption,input});const commit=()=>{if(!Number.isFinite(input.valueAsNumber))return;const current=settings?.snapshot?.()||{},value=Number.isFinite(input.valueAsNumber)?Math.max(0,Math.min(100,Math.round(input.valueAsNumber))):Number(current[key]??25),other=key==='arpeggioPercent'?'combinedPercent':'arpeggioPercent',patch={[key]:value};if(value+Number(current[other]??25)>100)patch[other]=100-value;const saved=settings?.set?.(patch);input.value=String(saved?.[key]??value);message='';refresh();};input.oninput=commit;input.onchange=()=>{commit();preview();};}mix.append(amounts,summary);
 const context=make('p','live-phrase-context'),actions=make('div','live-phrase-actions'),listen=make('button','live-phrase-listen'),status=make('p','live-phrase-status');listen.type='button';status.setAttribute('aria-live','polite');actions.append(listen);panel.append(header,select,voiceField,mix,context,actions,status);root.append(toggle,panel);(document.getElementById('harmony-hud')||document.body).append(root);
 let visible=false,previewGeneration=0,voiceGeneration=0,voiceLoading=false,fallbackVoice='flute',message='',toggleLanguage=null,optionLanguage=null,contextLabel=null;
 function close(){previewGeneration++;if(!panel.hidden){panel.hidden=true;toggle.setAttribute('aria-expanded','false');}}
 function refresh(){
  if(toggleLanguage!==en()){toggleLanguage=en();toggle.title=t('Звучание ладов','Scale sound');toggle.setAttribute('aria-label',t('Звучание ладов во время полёта','Scale sound during flight'));}
  // The flight polls this control, including while its panel is closed. Keep
  // the icon accessible without rebuilding hidden text or harmonic context.
  if(panel.hidden)return;
  heading.textContent=t('Звучание ладов','Scale sound');panel.setAttribute('aria-label',heading.textContent);closeButton.setAttribute('aria-label',t('Закрыть настройки фраз','Close phrase controls'));select.setAttribute('aria-label',t('Вариант звучания ладов','Scale sound version'));
  const current=settings?.snapshot?.()||{preset:'mixed'};
  const choices=[['mixed','Смешанный','Mixed'],['improved','Улучшенные фразы','Improved phrases'],['dense','Фразы ×2','Phrases ×2'],['zero','Фраза 0','Phrase 0'],['arpeggio','Только арпеджио','Arpeggios only'],['scale','Только гаммы','Scales only']];
  if(optionLanguage!==en()){select.replaceChildren(...choices.map(([value,ru,english])=>{const option=document.createElement('option');option.value=value;option.textContent=t(ru,english);return option;}));voice.replaceChildren(...GARDEN_MODE_TIMBRES.map(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=en()?item.en:item.ru;return option;}));optionLanguage=en();}select.value=current.preset;
  voiceLabel.textContent=t('Тембр ладов','Scale timbre');voice.setAttribute('aria-label',voiceLabel.textContent);voice.value=voiceSettings?.snapshot?.()?.timbre||fallbackVoice;voice.disabled=voiceLoading;panel.setAttribute('aria-busy',String(voiceLoading));credit.textContent=t('Источники звуков','Sound credits');creditNote.textContent=voice.value==='wurli'?'Wurlitzer · Greg Sullivan · CC BY 3.0':voice.value==='drawbar'?'FreePats · CC0 · setBfree':'';
  mix.hidden=!['mixed','improved'].includes(current.preset);for(const control of rangeControls){const caption=control.key==='arpeggioPercent'?t('Арпеджио %','Arpeggios %'):t('Совмещённые %','Combined %');control.caption.textContent=caption;control.input.setAttribute('aria-label',caption);if(document.activeElement!==control.input)control.input.value=String(current[control.key]??25);}
  const arp=Number(current.arpeggioPercent??25),combined=Number(current.combinedPercent??25),phrases=Math.max(0,100-arp-combined);summary.textContent=t('Фразы ','Phrases ')+phrases+'% · '+t('Арпеджио ','Arpeggios ')+arp+'% · '+t('Вместе ','Combined ')+combined+'%';
  const info=getContext?.()||{};if(contextLabel!==info.label){if(!voiceLoading)message='';contextLabel=info.label;}context.textContent=info.label||t('Выбери лад в полёте','Pick a scale in flight');listen.textContent=t('Послушать сейчас','Listen now');listen.disabled=voiceLoading||info.canPreview===false;status.textContent=voiceLoading?t('Загружаю тембр…','Loading timbre…'):message||info.status||'';
 }
 async function preview(){
  if(voiceLoading)return;
  const generation=++previewGeneration;message='';
  try{const result=await onPreview?.();if(generation!==previewGeneration||panel.hidden)return;message=typeof result==='string'?result:result?.message||'';}catch{if(generation!==previewGeneration||panel.hidden)return;message=t('Сейчас не удалось прослушать. Попробуй ещё раз.','Could not preview now. Try again.');}
  refresh();
 }
 async function changeVoice(){
  const generation=++voiceGeneration,id=voice.value;previewGeneration++;fallbackVoice=id;voiceSettings?.set?.({timbre:id});voiceLoading=true;message='';refresh();
  try{const result=await onVoiceChange?.(id);if(generation!==voiceGeneration)return;message=result===false?t('Звук приостановлен. Нажми «Послушать сейчас».','Audio is paused. Press Listen now.'):typeof result==='string'?result:result?.message||'';}catch{if(generation!==voiceGeneration)return;message=t('Тембр не загрузился. Повтори прослушивание.','The timbre could not load. Try the preview again.');}
  finally{if(generation===voiceGeneration){voiceLoading=false;refresh();}}
 }
 toggle.onclick=()=>{if(!visible)return;if(panel.hidden){message='';panel.hidden=false;refresh();toggle.setAttribute('aria-expanded','true');}else close();};closeButton.onclick=close;
 select.onchange=()=>{settings?.set?.({preset:select.value});message='';refresh();preview();};voice.onchange=changeVoice;listen.onclick=preview;
 // Keep native select/button interactions from becoming flight steering keys.
 for(const eventName of ['keydown','keyup','pointerdown','pointerup'])panel.addEventListener(eventName,event=>{if(eventName==='keydown'&&event.key==='Escape'){event.preventDefault();close();toggle.focus({preventScroll:true});}event.stopPropagation();});
 language?.onChange?.(()=>{message='';refresh();});refresh();
 return {refresh,setVisible(value){const next=Boolean(value);if(next===visible)return;visible=next;root.hidden=!visible;if(!visible)close();},close};
}
