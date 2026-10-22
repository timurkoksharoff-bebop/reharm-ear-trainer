import {mountChosenCoverBrand} from './garden-cover-brand.mjs';
// One lockup, not two independent viewport positions. Preserve the approved
// title font and placement; fit the endorsement into its actual descender band.
export function bindGardenBrand(){
 const brand=document.querySelector('.ear-yoga-lockup'),title=brand?.querySelector('.ear-yoga-wordmark'),college=brand?.querySelector('.start-college');
 if(!title||!college)return;
 if(brand.dataset.layout==='orbital-v5'){
  document.querySelector('#garden-start').dataset.reflections=new URLSearchParams(location.search).get('reflections')==='horizontal'?'horizontal':'vertical';
  // Extract only the original printed ink for a crisp layer above the glaze.
  // The alpha comes from the reference pixels; the letters are never redrawn.
  const inkDefs=document.createElementNS('http://www.w3.org/2000/svg','svg');
  inkDefs.setAttribute('width','0');inkDefs.setAttribute('height','0');inkDefs.setAttribute('aria-hidden','true');
  inkDefs.style.cssText='position:absolute;pointer-events:none;overflow:hidden';
  inkDefs.innerHTML='<defs><filter id="orbital-ivory-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -2 -1 0 0 1.4"/></filter><filter id="orbital-gold-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .96 0 0 0 0 .89 0 0 0 0 .73 3 1 -1 0 -.7"/></filter></defs>';
  document.querySelector('.garden-start-shell').append(inkDefs);
  const selectors=['.difficulty-picker button','#start-random','#start-choose','#start-tutorial','.start-route-details>summary','#start-language','#start-menu'];
  for(const selector of selectors)for(const control of document.querySelectorAll(selector)){
   const face=document.createElement('span');face.className='reference-face';face.setAttribute('aria-hidden','true');face.setAttribute('translate','no');control.append(face);
   const name=()=>control.setAttribute('aria-label',control.textContent.replace(/\s+/g,' ').trim());
   new MutationObserver(name).observe(control,{childList:true,characterData:true,subtree:true});name();
   if(control.matches('.difficulty-picker button,.start-choice')){
    if(control.matches('.difficulty-picker button')){for(const className of ['mode-rest','reference-ink','mode-rim']){const layer=document.createElement('span');layer.className=className;layer.setAttribute('aria-hidden','true');layer.setAttribute('translate','no');control.append(layer);}}
    if(control.matches('.start-choice')){
     for(const className of ['porcelain-body','reference-ink']){const layer=document.createElement('span');layer.className=className;layer.setAttribute('aria-hidden','true');layer.setAttribute('translate','no');control.append(layer);}
    }
    const light=document.createElement('span');light.className='pearl-light';light.setAttribute('aria-hidden','true');light.setAttribute('translate','no');control.append(light);
    if(control.matches('.difficulty-picker button')){const water=light.cloneNode();water.className='mode-water';control.append(water);}
   }
  }
  const modeStyle=getComputedStyle(document.querySelector('[data-difficulty="medium"]'));
  for(const button of document.querySelectorAll('.experimental-mode'))for(const property of ['--mode-interior','--mode-rim'])button.style.setProperty(property,modeStyle.getPropertyValue(property));
  for(const button of document.querySelectorAll('.experimental-mode')){const contour=document.createElementNS('http://www.w3.org/2000/svg','svg');contour.setAttribute('viewBox','0 0 268 111');contour.setAttribute('preserveAspectRatio','none');contour.setAttribute('aria-hidden','true');contour.classList.add('experimental-contour');contour.innerHTML='<path d="M2 56C37 23 72 9 124 7L134 0L145 7C197 9 232 23 267 56C232 90 197 101 145 102L134 110L124 102C72 101 37 90 2 56Z"/><path d="M12 56C43 29 77 17 134 14C191 17 225 29 257 56C225 83 191 94 134 96C77 94 43 83 12 56Z"/>';button.append(contour);}
  const primary=document.querySelector('#start-random'),caption=primary.querySelector('strong');
  const syncCaption=()=>primary.classList.toggle('live-caption',!['Начать полёт','Start flight'].includes(caption.textContent.trim()));
  new MutationObserver(syncCaption).observe(caption,{childList:true,characterData:true,subtree:true});syncCaption();
  mountChosenCoverBrand();
  const ready=()=>{brand.dataset.lockup='ready';brand.dataset.viewport=innerWidth+'x'+innerHeight;};
  new ResizeObserver(ready).observe(brand);addEventListener('resize',ready);document.fonts?.ready.then(ready);ready();return;
 }
 const context=document.createElement('canvas').getContext('2d');let pending=0;
 function metrics(element,text){const s=getComputedStyle(element);context.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;return context.measureText(text);}
 function glyph(letter){
  const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){const index=node.nodeValue.indexOf(letter);if(index<0)continue;const range=document.createRange();range.setStart(node,index);range.setEnd(node,index+1);return range.getBoundingClientRect();}
 }
 function layout(){
  pending=0;const box=brand.getBoundingClientRect();if(!box.width||!box.height)return;
  const e=glyph('E'),g=glyph('g');if(!e||!g)return;
  const size=parseFloat(getComputedStyle(title).fontSize),gap=size*.025;
  const em=metrics(title,'E'),gm=metrics(title,'g'),left=e.left-em.actualBoundingBoxLeft;
  const baseline=title.querySelector('.brand-baseline').getBoundingClientRect().top;
  const bottom=baseline+gm.actualBoundingBoxDescent;
  const available=Math.max(1,g.left-gm.actualBoundingBoxLeft-left-gap);
  // Start with the approved type ratio; reduce only if another platform's
  // font metrics need it to clear the descender or keep the full line inside.
  let font=size*(3.15/25.8);college.style.fontSize=font+'px';
  let cm=metrics(college,'SPACE MUSIC COLLEGE');
  const height=cm.actualBoundingBoxAscent+cm.actualBoundingBoxDescent;
  const fit=Math.min(1,(gm.actualBoundingBoxDescent-gap*2)/Math.max(1,height),available/Math.max(1,cm.width+19*font*.08));
  font*=Math.max(.1,fit);college.style.fontSize=font+'px';cm=metrics(college,'SPACE MUSIC COLLEGE');
  const spacing=Math.max(0,Math.min(font*.4,(available-cm.width)/19));college.style.letterSpacing=spacing+'px';
  const sm=metrics(college,'S');college.style.left=(left-box.left+sm.actualBoundingBoxLeft)+'px';
  const collegeBox=college.getBoundingClientRect(),collegeBaseline=college.querySelector('.brand-baseline').getBoundingClientRect().top;
  college.style.top=(bottom-gap-cm.actualBoundingBoxDescent-(collegeBaseline-collegeBox.top)-box.top)+'px';
  brand.dataset.lockup='ready';brand.dataset.viewport=innerWidth+'x'+innerHeight;
 }
 const schedule=()=>{if(!pending)pending=requestAnimationFrame(layout);};
 const observer=new ResizeObserver(schedule);observer.observe(brand);observer.observe(title);
 addEventListener('resize',schedule);addEventListener('garden-brand-layout',schedule);document.fonts?.ready.then(schedule);document.fonts?.addEventListener('loadingdone',schedule);schedule();
}
