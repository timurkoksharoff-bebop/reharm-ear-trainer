const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8788/');
  await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);await page.evaluate(()=>document.fonts.ready);
  const rows=[];
  for(const [width,height] of [[320,568],[375,667],[390,692],[390,844],[390,1000],[414,896],[430,932],[600,1024],[768,1024],[1440,900],[844,390]]){
   await page.setViewportSize({width,height});await page.waitForFunction(()=>document.querySelector('.ear-yoga-lockup').dataset.viewport===innerWidth+'x'+innerHeight);
   const m=await page.evaluate(()=>{
    const brand=document.querySelector('.ear-yoga-lockup'),title=brand.querySelector('h2'),college=brand.querySelector('.start-college'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
    const metrics=(el,text)=>{const s=getComputedStyle(el);ctx.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;return ctx.measureText(text);};
    const glyph=letter=>{const walk=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){const i=n.nodeValue.indexOf(letter);if(i<0)continue;const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);return r.getBoundingClientRect();}};
    const e=glyph('E'),g=glyph('g'),tm=metrics(title,'E'),gm=metrics(title,'g'),cm=metrics(college,'SPACE MUSIC COLLEGE'),cs=getComputedStyle(college),cr=college.getBoundingClientRect(),tr=title.getBoundingClientRect(),ts=getComputedStyle(title),line=college.querySelector('.brand-baseline').getBoundingClientRect().top,baseline=title.querySelector('.brand-baseline').getBoundingClientRect().top;
    return {eLeft:e.left-tm.actualBoundingBoxLeft,gLeft:g.left-gm.actualBoundingBoxLeft,gBottom:baseline+gm.actualBoundingBoxDescent,baseline,smallLeft:cr.left-cm.actualBoundingBoxLeft,smallRight:cr.left+cm.actualBoundingBoxRight+18*parseFloat(cs.letterSpacing),smallTop:line-cm.actualBoundingBoxAscent,smallBottom:line+cm.actualBoundingBoxDescent,titleY:tr.y,titleLeft:tr.x,size:parseFloat(ts.fontSize),weight:ts.fontWeight,tracking:parseFloat(ts.letterSpacing),relative:cr.y-tr.y};
   });
   assert(Math.abs(m.smallLeft-m.eLeft)<.7,'S aligned with E at '+width+'x'+height+': '+JSON.stringify(m));
   assert(m.smallBottom<=m.gBottom-1,'College lower edge stays above g at '+width+'x'+height);
   assert(m.smallTop>m.baseline,'College clears the main letter baseline');
   assert(m.smallRight<m.gLeft-1,'College does not collide with the g descender');
   assert.equal(m.weight,'200');assert(Math.abs(m.tracking/m.size+.055)<.0001,'approved tracking retained');
   if(width<600&&height>width){assert(Math.abs(m.titleY-height*.16)<1);assert(Math.abs(m.titleLeft-width*.073)<1);assert(Math.abs(m.size-width*.258)<.1);}
   rows.push({width,height,relative:m.relative});
   if(width===390&&height===844)await page.screenshot({path:'/private/tmp/ear-yoga-unified-brand-1.35.png'});
  }
  const sameWidth=rows.filter(r=>r.width===390);assert(Math.max(...sameWidth.map(r=>r.relative))-Math.min(...sameWidth.map(r=>r.relative))<.5,'browser bar / aspect ratio cannot detach College');
  assert.deepEqual(errors,[]);console.log('Unified brand passed: E/S ink alignment, g lower boundary, no descender overlap, preserved title font/placement, 11 viewports and aspect-ratio changes.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
