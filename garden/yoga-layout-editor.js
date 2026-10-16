(()=>{
 const storageKey='ear-yoga-cover-editor.v2',frame=document.querySelector('iframe'),area=document.querySelector('.preview-area'),space=document.querySelector('.phone-space');
 const defaults={title:25.8,titleX:7.3,titleY:16,titleWidth:66.667,titleWeight:200,titleTracking:-.055,subtitle:3.15,subtitleX:8.7,subtitleY:29.8,subtitleWidth:46.64,tracking:.4,levelsY:33.5,levelsX:3,levelsScale:.9,levelsText:1.15,actionsY:48,actionsX:8,actionsScale:.875,actionsText:1.15,screen:'390x692'};
 const groups=[
 ['Ear Yoga',[
 ['title','Размер букв',7,32,.1,'vw'],['titleX','Влево / вправо',-10,80,.1,'vw'],['titleY','Выше / ниже',0,90,.1,'vh'],['titleWidth','Ширина блока',30,110,.1,'vw'],['titleWeight','Толщина букв',100,600,50,''],['titleTracking','Интервал между буквами',-.15,.2,.005,'em']]],
 ['Space Music College',[
 ['subtitle','Размер букв',1,5,.05,'vw'],['subtitleX','Влево / вправо',-10,90,.1,'vw'],['subtitleY','Выше / ниже',0,90,.1,'vh'],['subtitleWidth','Ширина блока',20,100,.1,'vw'],['tracking','Интервал между буквами',0,1,.01,'em']]],
 ['Абитуриент · Студент · Преподаватель',[
 ['levelsX','Влево / вправо',-20,80,.1,'vw'],['levelsY','Выше / ниже',0,90,.1,'vh'],['levelsScale','Размер кнопок',.5,1.5,.01,'×'],['levelsText','Размер текста',.6,1.8,.01,'×']]],
 ['Начать полёт · Выбрать маршрут · Как играть',[
 ['actionsX','Отступ справа',-10,80,.1,'vw'],['actionsY','Выше / ниже',0,90,.1,'vh'],['actionsScale','Размер кнопок',.5,1.5,.01,'×'],['actionsText','Размер текста',.6,1.8,.01,'×']]]
 ];
 let values={...defaults};try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');for(const [key,value] of Object.entries(defaults))if(typeof saved[key]===typeof value)values[key]=saved[key];}catch{}
 const controls=document.querySelector('#controls');
 for(const [name,specs] of groups){const section=document.createElement('details');section.open=true;const heading=document.createElement('summary');heading.textContent=name;section.append(heading);
  for(const [key,label,min,max,step,unit] of specs){const row=document.createElement('label'),text=document.createElement('span'),output=document.createElement('output'),input=document.createElement('input');text.textContent=label;input.type='range';input.min=min;input.max=max;input.step=step;input.dataset.key=key;input.setAttribute('aria-label',name+' · '+label);input.oninput=()=>{values[key]=Number(input.value);apply();};row.append(text,output,input);section.append(row);output.dataset.unit=unit;}controls.append(section);}
 function size(){return values.screen.split('x').map(Number);}
 function fit(){const [width,height]=size(),scale=Math.max(.1,Math.min((area.clientWidth-20)/width,(area.clientHeight-24)/height,1));frame.style.width=width+'px';frame.style.height=height+'px';frame.style.transform='scale('+scale+')';space.style.width=width*scale+'px';space.style.height=height*scale+'px';}
 new ResizeObserver(fit).observe(area);
 function apply(){
  for(const input of controls.querySelectorAll('input')){input.value=values[input.dataset.key];input.previousElementSibling.textContent=Number(values[input.dataset.key].toFixed(3))+input.previousElementSibling.dataset.unit;}
  document.querySelector('#screen').value=values.screen;fit();try{localStorage.setItem(storageKey,JSON.stringify(values));}catch{}
  const doc=frame.contentDocument;if(!doc?.querySelector('#garden-start'))return;
  let style=doc.querySelector('#cover-editor-overrides');if(!style){style=doc.createElement('style');style.id='cover-editor-overrides';doc.head.append(style);}
  style.textContent=`
   #garden-start .start-copy h2.ear-yoga-wordmark{position:absolute!important;top:${values.titleY}dvh!important;left:${values.titleX}vw!important;width:${values.titleWidth}vw!important;font-size:${values.title}vw!important;font-weight:${values.titleWeight}!important;letter-spacing:${values.titleTracking}em!important}
   #garden-start .ear-yoga-wordmark em{font-weight:inherit!important}
   #garden-start .start-copy>.start-college{position:absolute!important;top:${values.subtitleY}dvh!important;left:${values.subtitleX}vw!important;width:${values.subtitleWidth}vw!important;font-size:${values.subtitle}vw!important;letter-spacing:${values.tracking}em!important}
   #garden-start .difficulty-picker{position:absolute!important;top:${values.levelsY}dvh!important;left:${values.levelsX}vw!important;transform:scale(${values.levelsScale})!important}
   #garden-start .difficulty-picker button{font-size:calc(clamp(11px,2.9vw,16px)*${values.levelsText})!important}
   #garden-start .start-controls{position:absolute!important;top:${values.actionsY}dvh!important;right:${values.actionsX}vw!important;transform:scale(${values.actionsScale})!important}
   #garden-start .start-choice strong{font-size:calc(clamp(13px,3.3vw,20px)*${values.actionsText})!important}
   #garden-start .start-choice small{font-size:calc(clamp(9px,2.3vw,13px)*${values.actionsText})!important}
   #garden-start .start-tutorial strong,#garden-start .start-route-details>summary{font-size:calc(12px*${values.actionsText})!important}
   #garden-start .start-tutorial small{font-size:calc(10px*${values.actionsText})!important}
   #garden-start .ear-yoga-wordmark,#garden-start .start-college,#garden-start .difficulty-picker,#garden-start .start-controls{cursor:move;touch-action:none}
   [data-editor-drag]{outline:1px dashed #e6f4c9!important;outline-offset:4px}`;
 }
 document.querySelector('#screen').onchange=event=>{values.screen=event.target.value;apply();};
 document.querySelector('#reset-layout').onclick=()=>{values={...defaults};apply();};
 document.querySelector('#export-layout').onclick=()=>{
  const [width,height]=size(),data={...values,referenceViewport:{width,height},titleText:'Ear Yoga',subtitleText:'SPACE MUSIC COLLEGE',exportedAt:new Date().toISOString()};
  const link=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));link.href=url;link.download='ear-yoga-cover-layout.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#layout-status').textContent='Макет скачан. Передай JSON мне — перенесу эти размеры и координаты без перестановок.';
 };
 frame.onload=()=>{
  const doc=frame.contentDocument;let drag=null;
  const targets=[['.ear-yoga-wordmark','titleX','titleY',1],['.start-college','subtitleX','subtitleY',1],['.difficulty-picker','levelsX','levelsY',1],['.start-controls','actionsX','actionsY',-1]];
  doc.addEventListener('pointerdown',event=>{
   const target=targets.find(([selector])=>event.target.closest(selector));if(!target)return;event.preventDefault();event.stopPropagation();
   const element=event.target.closest(target[0]);element.setPointerCapture(event.pointerId);element.setAttribute('data-editor-drag','');
   drag={element,id:event.pointerId,x:event.clientX,y:event.clientY,xKey:target[1],yKey:target[2],direction:target[3],oldX:values[target[1]],oldY:values[target[2]]};
  },true);
  doc.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id)return;const [width,height]=size();values[drag.xKey]=Math.round((drag.oldX+(event.clientX-drag.x)/width*100*drag.direction)*10)/10;values[drag.yKey]=Math.round((drag.oldY+(event.clientY-drag.y)/height*100)*10)/10;apply();});
  for(const name of ['pointerup','pointercancel'])doc.addEventListener(name,()=>{drag?.element.removeAttribute('data-editor-drag');drag=null;});
  doc.addEventListener('click',event=>{if(event.target.closest('#garden-start')){event.preventDefault();event.stopPropagation();}},true);
  apply();
  const timer=setInterval(()=>{if(doc.querySelector('#garden-start')&&!doc.querySelector('#garden-start').hidden){apply();clearInterval(timer);}},150);setTimeout(()=>clearInterval(timer),15000);
 };
 apply();
})();
