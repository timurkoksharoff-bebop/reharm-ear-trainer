// One lockup, not two independent viewport positions. Preserve the approved
// title font and placement; fit the endorsement into its actual descender band.
export function bindGardenBrand(){
 const brand=document.querySelector('.ear-yoga-lockup'),title=brand?.querySelector('.ear-yoga-wordmark'),college=brand?.querySelector('.start-college');
 if(!title||!college)return;
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
