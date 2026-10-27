// Device-local layout atelier. Offsets are percentages of the full cover,
// never viewport pixels; visual studies do not change gameplay.
export const GARDEN_MODE_LAYOUT_KEY='ear-yoga-mode-layout.v1';
const MODES=['light','medium','hard','professor','guru'];
const MODE_STYLES=['original','porcelain','capsule','portal','lotus','lotus-down'];
const rows={light:'lower',medium:'lower',hard:'lower',professor:'upper',guru:'upper'};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const value=(n,fallback,a,b)=>typeof n==='number'&&Number.isFinite(n)?clamp(n,a,b):fallback;
// Keep complete user compositions available; shape alone is not a preset.
export function gardenModeLayoutPreset(id='variant2'){
 const first=id==='variant1',down=id==='variant3',lotus=first||down;
 return {version:1,style:down?'lotus-down':first?'lotus':'capsule',group:{x:0,y:-.6,scale:lotus?1:.985,gap:lotus?-1.2:-.4},upper:{x:0,y:0,scale:1,spacing:1},lower:{x:0,y:0,scale:1,spacing:1},buttons:Object.fromEntries(MODES.map(id=>[id,{x:id==='professor'?-1.1:id==='guru'?1.1:0,y:0,scale:1,rotation:0}]))};
}
export function gardenModeLayoutDefaults(){return gardenModeLayoutPreset('variant2');}
// Exported slider values can differ only by floating-point display noise.
function samePreset(a,b){return Object.keys(b).every(key=>typeof b[key]==='object'&&b[key]!==null?samePreset(a?.[key]||{},b[key]):typeof b[key]==='number'?typeof a?.[key]==='number'&&Math.abs(a[key]-b[key])<1e-10:a?.[key]===b[key]);}
export function normalizeGardenModeLayout(raw){
 const d=gardenModeLayoutDefaults();if(!raw||raw.version!==1)return d;
 // Stored v1 layouts predate selectable shapes. Keep those original layouts
 // intact; only a missing layout receives the current shipping preset.
 d.style=MODE_STYLES.includes(raw.style)?raw.style:'original';
 for(const id of ['group','upper','lower']){const s=raw[id]||{};d[id].x=value(s.x,0,-100,100);d[id].y=value(s.y,0,-100,100);d[id].scale=value(s.scale,1,.3,2.5);if(id==='group')d[id].gap=value(s.gap,0,-30,30);else d[id].spacing=value(s.spacing,1,.3,2.5);}
 for(const id of MODES){const s=raw.buttons?.[id]||{};d.buttons[id]={x:value(s.x,0,-100,100),y:value(s.y,0,-100,100),scale:value(s.scale,1,.3,2.5),rotation:value(s.rotation,0,-180,180)};}
 return d;
}
export function gardenModeLayoutTransforms(raw,baselines){
 const state=normalizeGardenModeLayout(raw),entries=MODES.filter(id=>baselines[id]).map(id=>({id,...baselines[id]}));if(!entries.length)return {};
 const centre=items=>({x:(Math.min(...items.map(b=>b.x))+Math.max(...items.map(b=>b.x+b.width)))/2,y:(Math.min(...items.map(b=>b.y))+Math.max(...items.map(b=>b.y+b.height)))/2});
 const pivot=centre(entries),centres={};for(const row of ['upper','lower']){const subset=entries.filter(b=>rows[b.id]===row);if(subset.length)centres[row]=centre(subset);}
 return Object.fromEntries(entries.map(b=>{const row=rows[b.id],r=state[row],p=centres[row],o=state.buttons[b.id],base={x:b.x+b.width/2,y:b.y+b.height/2};
  const x=p.x+(base.x-p.x)*r.scale*r.spacing+r.x,y=p.y+(base.y-p.y)*r.scale+r.y+(row==='upper'?-1:1)*state.group.gap/2;
  return [b.id,{x:pivot.x+(x-pivot.x)*state.group.scale+state.group.x+o.x-base.x,y:pivot.y+(y-pivot.y)*state.group.scale+state.group.y+o.y-base.y,scale:state.group.scale*r.scale*o.scale,rotation:o.rotation}];
 }));
}

export function mountGardenModeLayoutEditor({language,onOpen,onClose}={}){
 const cover=document.getElementById('garden-start'),shell=cover?.querySelector('.garden-start-shell'),picker=cover?.querySelector('.difficulty-picker');if(!cover||!shell||!picker)return {open(){},close(){},isOpen:false,state:gardenModeLayoutDefaults()};
 let storage=null,state=gardenModeLayoutDefaults();try{storage=localStorage;state=normalizeGardenModeLayout(JSON.parse(storage.getItem(GARDEN_MODE_LAYOUT_KEY)||'null'));}catch{}
 const defaults=()=>JSON.stringify(gardenModeLayoutDefaults()),isDefault=()=>JSON.stringify(state)===defaults();
 const buttons=Object.fromEntries(MODES.map(id=>[id,picker.querySelector(`[data-difficulty="${id}"]`)]));
 let open=false,selected='group',drag=null,compact=false,restoreStyles=null,restoreDisabled=null,restoreAriaDisabled=null,lastFocus=null;
 const t=(ru,en)=>language?.get?.()==='en'?en:ru;
 const names=()=>({group:t('Вся группа','All five buttons'),upper:t('Верхняя строка · капитан / гуру','Upper row · Captain / Guru'),lower:t('Нижняя строка · три режима','Lower row · three modes'),light:t('Курсант','Cadet'),medium:t('Пилот','Pilot'),hard:t('Штурман','Navigator'),professor:t('Капитан','Captain'),guru:t('Гуру','Guru')});
 const panel=document.createElement('aside');panel.id='mode-layout-editor';panel.hidden=true;panel.dataset.userContent='';panel.setAttribute('aria-label','Настройка кнопок режимов');document.body.append(panel);
 const dock=document.createElement('aside');dock.id='mode-layout-dock';dock.hidden=true;dock.dataset.userContent='';document.body.append(dock);
 let targetSelect,fieldHost,status,exportBox;const controls=new Map(),styleButtons=[],presetButtons=[];
 const element=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 const action=(text,fn)=>{const b=element('button',text);b.type='button';b.onclick=fn;return b;};
 function current(){return ['group','upper','lower'].includes(selected)?state[selected]:state.buttons[selected];}
 function baseline(){const w=shell.clientWidth,h=shell.clientHeight;if(!w||!h)return null;return Object.fromEntries(MODES.filter(id=>buttons[id]).map(id=>{const b=buttons[id];return [id,{x:(picker.offsetLeft+b.offsetLeft)/w*100,y:(picker.offsetTop+b.offsetTop)/h*100,width:b.offsetWidth/w*100,height:b.offsetHeight/h*100}];}));}
 function apply(){
  if(state.style==='original')delete cover.dataset.modeStyle;else cover.dataset.modeStyle=state.style;
  for(const b of styleButtons)b.setAttribute('aria-pressed',String(b.dataset.modeStyleChoice===state.style));
  for(const b of presetButtons)b.setAttribute('aria-pressed',String(samePreset(state,gardenModeLayoutPreset(b.dataset.modeLayoutPreset))));
  const base=baseline();if(!base)return;const transforms=gardenModeLayoutTransforms(state,base);
  for(const id of MODES){const b=buttons[id];if(!b)continue;const p=transforms?.[id];if(p){b.style.translate=`${p.x*shell.clientWidth/100}px ${p.y*shell.clientHeight/100}px`;b.style.scale=String(p.scale);b.style.rotate=p.rotation+'deg';}else for(const prop of ['translate','scale','rotate'])b.style.removeProperty(prop);b.toggleAttribute('data-layout-selected',open&&!compact&&(selected===id||selected===rows[id]||selected==='group'));}
 }
 function save(){try{if(isDefault())storage?.removeItem(GARDEN_MODE_LAYOUT_KEY);else storage?.setItem(GARDEN_MODE_LAYOUT_KEY,JSON.stringify(state));if(status)status.textContent=t('Сохранено в этом браузере','Saved in this browser');}catch{if(status)status.textContent=t('Настройка действует до закрытия страницы','Changes last until this page closes');}if(exportBox)exportBox.value=JSON.stringify(state,null,2);}
 function update(){apply();save();for(const [key,c]of controls){const n=current()[key]*c.mult;c.range.value=String(n);c.number.value=String(Math.round(n*100)/100);}}
 function choose(id){selected=id;renderFields();apply();}
 function renderFields(){
  controls.clear();fieldHost.replaceChildren();if(targetSelect)targetSelect.value=selected;
  const fields=[['x',t('Сдвиг вправо / влево','Horizontal shift'),-100,100,1,'%'],['y',t('Сдвиг вниз / вверх','Vertical shift'),-100,100,1,'%'],['scale',t('Размер','Size'),30,250,100,'%']];
  fields.push(selected==='group'?['gap',t('Расстояние между строками','Gap between rows'),-30,30,1,'%']:['upper','lower'].includes(selected)?['spacing',t('Расстояние между кнопками','Spacing between buttons'),30,250,100,'%']:['rotation',t('Поворот','Rotation'),-180,180,1,'°']);
  for(const [key,label,min,max,mult,unit]of fields){const row=element('label',null,'mode-layout-field'),name=element('span',label),entry=element('span',null,'mode-layout-value'),range=element('input'),number=element('input'),suffix=element('small',unit);range.type='range';number.type='number';range.min=number.min=String(min);range.max=number.max=String(max);range.step=number.step=key==='rotation'?'1':'.1';range.value=number.value=String(current()[key]*mult);range.dataset.layoutControl=key;number.dataset.layoutNumber=key;range.setAttribute('aria-label',label);number.setAttribute('aria-label',label+' · '+t('число','number'));
   const change=input=>{const v=Number(input.value);if(!Number.isFinite(v))return;current()[key]=clamp(v,min,max)/mult;update();};range.oninput=()=>change(range);number.oninput=()=>change(number);entry.append(number,suffix);row.append(name,entry,range);fieldHost.append(row);controls.set(key,{range,number,mult});}
 }
 function renderPanel(){
  panel.replaceChildren();const head=element('header');head.append(element('div',null,'mode-layout-heading'),action('×',close));head.firstChild.append(element('small','EAR YOGA'),element('h2',t('Кнопки режимов','Mode button layout')));head.lastChild.setAttribute('aria-label',t('Применить и закрыть','Apply and close'));panel.append(head);
  panel.append(element('p',t('Вся обложка видна целиком. Перетаскивай кнопку на картинке или выбери строку и настрой её здесь.','The entire cover stays visible. Drag a button on the image, or choose a row and adjust it here.'),'mode-layout-intro'));
  const presets=element('fieldset',null,'mode-layout-presets');presets.append(element('legend',t('Варианты композиции','Composition variants')));presetButtons.length=0;
  for(const [id,ru,en]of [['variant1','Вариант 1 · Лотос','Variant 1 · Lotus'],['variant2','Вариант 2 · Капсула','Variant 2 · Capsule'],['variant3','Вариант 3 · Лотос ↓','Variant 3 · Lotus ↓']]){const b=action(t(ru,en),()=>{state=gardenModeLayoutPreset(id);renderFields();update();});b.dataset.modeLayoutPreset=id;b.setAttribute('aria-pressed',String(samePreset(state,gardenModeLayoutPreset(id))));presetButtons.push(b);presets.append(b);}panel.append(presets);
  const styles=element('fieldset',null,'mode-layout-styles');styles.append(element('legend',t('Форма кнопок','Button shape')));styleButtons.length=0;
  const choices=[['original','Исходная','Original'],['porcelain','Фарфор','Porcelain'],['capsule','Капсула','Capsule'],['portal','Портал','Portal'],['lotus','Лотос','Lotus'],['lotus-down','Лотос ↓','Lotus ↓']];
  const shapeChoice=(id,ru,en)=>{const b=action('',()=>{state.style=id;update();}),sample=element('i',null,'mode-style-sample');b.dataset.modeStyleChoice=id;b.setAttribute('aria-pressed',String(state.style===id));sample.setAttribute('aria-hidden','true');b.append(sample,element('span',t(ru,en)));styleButtons.push(b);return b;};
  for(const choice of choices)styles.append(shapeChoice(...choice));panel.append(styles);
  const label=element('label',null,'mode-layout-target');label.append(element('span',t('Что настраиваем','Adjust')));targetSelect=element('select');targetSelect.setAttribute('aria-label',t('Объект настройки','Layout target'));for(const [id,name]of Object.entries(names())){const option=element('option',name);option.value=id;targetSelect.append(option);}targetSelect.onchange=()=>choose(targetSelect.value);label.append(targetSelect);panel.append(label);fieldHost=element('div',null,'mode-layout-fields');panel.append(fieldHost);renderFields();
  const nudges=element('div',null,'mode-layout-nudges');for(const [label,x,y]of [['←',-.2,0],['↑',0,-.2],['↓',0,.2],['→',.2,0]]){const b=action(label,()=>{current().x=clamp(current().x+x,-100,100);current().y=clamp(current().y+y,-100,100);update();});b.setAttribute('aria-label',t('Сдвинуть ','Nudge ')+label);nudges.append(b);}panel.append(nudges,element('p',t('Сдвиги — в процентах всей картинки. На фоне можно перетаскивать выбранную группу. Стрелки клавиатуры — точная подстройка; Shift — крупнее.','Offsets use percentages of the full image. Drag the background to move the selected group. Arrow keys nudge; Shift moves farther.'),'mode-layout-note'));
  const actions=element('div',null,'mode-layout-actions');actions.append(action(t('Посмотреть без панели','Preview without panel'),()=>showComparison()),action(t('Сбросить выбранное','Reset selected'),()=>{const d=gardenModeLayoutDefaults();if(['group','upper','lower'].includes(selected))state[selected]={...d[selected]};else state.buttons[selected]={...d.buttons[selected]};renderFields();update();}),action(t('Сбросить всё','Reset all'),reset));panel.append(actions);
  const details=element('details'),summary=element('summary',t('Параметры для переноса','Export settings'));exportBox=element('textarea');exportBox.readOnly=true;exportBox.rows=8;exportBox.setAttribute('aria-label',t('Настройки JSON','Layout JSON'));exportBox.value=JSON.stringify(state,null,2);details.append(summary,exportBox,action(t('Скопировать','Copy'),async()=>{try{await navigator.clipboard.writeText(JSON.stringify(state,null,2));status.textContent=t('Параметры скопированы','Settings copied');}catch{exportBox.focus();exportBox.select();status.textContent=t('Выделено — скопируй вручную','Selected — copy manually');}}));panel.append(details);
  status=element('p',t('Изменения сохраняются автоматически','Changes save automatically'),'mode-layout-status');status.setAttribute('role','status');panel.append(status,action(t('Готово','Done'),close));
  const strip=element('div',null,'mode-comparison-choices'),dockActions=element('div',null,'mode-comparison-actions');for(const choice of choices)strip.append(shapeChoice(...choice));dockActions.append(element('span',t('Сравни формы на обложке','Compare on the cover')),action(t('Настроить кнопки','Adjust buttons'),()=>{compact=false;document.body.classList.remove('mode-layout-comparing');panel.hidden=false;dock.hidden=true;fit();}),action(t('Готово','Done'),close));dock.replaceChildren(strip,dockActions);
 }
 function showComparison(){compact=true;document.body.classList.add('mode-layout-comparing');panel.hidden=true;dock.hidden=false;fit();}
 const temporaryProps=['position','inset','left','right','top','bottom','width','height','min-height','margin','--menu-u','--mode-layout-ui-ratio'];
 function fit(){
  if(!open)return;const W=innerWidth,H=innerHeight,wide=W>=800,side=wide&&!compact?360:0,bottom=compact?116:wide?0:Math.min(320,H*.44),gap=12,area={left:gap,top:gap,width:W-side-gap*2,height:H-bottom-gap*2};
  const h=Math.max(1,Math.min(area.height,area.width*1823/863)),w=h*863/1823;for(const [key,v]of Object.entries({position:'absolute',inset:'auto',left:area.left+(area.width-w)/2+'px',right:'auto',top:area.top+(area.height-h)/2+'px',bottom:'auto',width:w+'px',height:h+'px','min-height':'0',margin:'0','--menu-u':w/100+'px','--mode-layout-ui-ratio':String(h/(W>H&&H<600?Math.min(W*1823/863,823.84):Math.min(H,W*1823/863)))}))shell.style.setProperty(key,v,'important');
  apply();
 }
 function openEditor({compare=false}={}){
  if(open)return;lastFocus=document.activeElement;onOpen?.();open=true;compact=false;restoreStyles=Object.fromEntries(temporaryProps.map(k=>[k,{value:shell.style.getPropertyValue(k),priority:shell.style.getPropertyPriority(k)}]));restoreDisabled=Object.fromEntries(MODES.map(id=>[id,Boolean(buttons[id]?.disabled)]));restoreAriaDisabled=Object.fromEntries(MODES.map(id=>[id,buttons[id]?.getAttribute('aria-disabled')]));for(const b of Object.values(buttons))if(b){b.disabled=false;b.setAttribute('aria-disabled','false');}document.body.classList.add('mode-layout-editing');renderPanel();panel.hidden=false;dock.hidden=true;if(compare)showComparison();else fit();requestAnimationFrame(()=>{fit();(compare?dock.querySelector('[aria-pressed="true"]'):targetSelect)?.focus({preventScroll:true});});
 }
 function close(){
  if(!open)return;open=false;drag=null;panel.hidden=true;dock.hidden=true;document.body.classList.remove('mode-layout-editing','mode-layout-comparing');for(const k of temporaryProps){const old=restoreStyles[k];if(old.value)shell.style.setProperty(k,old.value,old.priority);else shell.style.removeProperty(k);}for(const id of MODES)if(buttons[id]){buttons[id].disabled=restoreDisabled[id];const old=restoreAriaDisabled[id];if(old==null)buttons[id].removeAttribute('aria-disabled');else buttons[id].setAttribute('aria-disabled',old);}apply();onClose?.();lastFocus?.focus?.({preventScroll:true});
 }
 function reset(){state=gardenModeLayoutDefaults();if(open)renderFields();update();}
 function pointerDown(e){
  if(!open||compact||e.button!==0||drag)return;const button=e.target.closest?.('.difficulty-picker button'),inside=shell.contains(e.target);if(!inside)return;e.preventDefault();e.stopImmediatePropagation();if(button)choose(button.dataset.difficulty);const b=current();drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:b.x,startY:b.y,width:shell.clientWidth,height:shell.clientHeight,target:selected};shell.setPointerCapture(e.pointerId);
 }
 function pointerMove(e){if(!open||!drag||e.pointerId!==drag.id)return;e.preventDefault();const obj=['group','upper','lower'].includes(drag.target)?state[drag.target]:state.buttons[drag.target];obj.x=clamp(drag.startX+(e.clientX-drag.x)/drag.width*100,-100,100);obj.y=clamp(drag.startY+(e.clientY-drag.y)/drag.height*100,-100,100);update();}
 function pointerUp(e){if(!drag||e.pointerId!==drag.id)return;try{shell.releasePointerCapture(e.pointerId);}catch{}drag=null;}
 cover.addEventListener('pointerdown',pointerDown,true);shell.addEventListener('pointermove',pointerMove);for(const type of ['pointerup','pointercancel','lostpointercapture'])shell.addEventListener(type,pointerUp);
 cover.addEventListener('click',e=>{if(!open)return;e.preventDefault();e.stopImmediatePropagation();},true);
 addEventListener('keydown',e=>{if(!open)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return;}if(e.target.closest?.('input,select,textarea,button'))return;const map={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},n=map[e.key];if(!n)return;e.preventDefault();e.stopImmediatePropagation();const step=e.shiftKey?1:.1;current().x=clamp(current().x+n[0]*step,-100,100);current().y=clamp(current().y+n[1]*step,-100,100);update();},true);
 new ResizeObserver(()=>apply()).observe(shell);addEventListener('resize',fit);apply();
 return {open:openEditor,close,reset,get isOpen(){return open;},get state(){return JSON.parse(JSON.stringify(state));},export:()=>JSON.stringify(state,null,2)};
}
