const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8788/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage();
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  await page.locator('[data-difficulty="hard"]').click();await page.locator('#start-choose').click();await page.locator('.garden-route-choice').filter({hasText:'Fig. 1.16 — extended substitution'}).click();
  if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();
  await page.locator('#mission-toggle').click();
  // Isolated DOM layout fixtures, not replacement catalog or musical content.
  for(const [width,height] of [[320,568],[390,844],[430,932],[768,1024],[1440,900]])for(const n of [4,7,8,12,32,75]){
   await page.setViewportSize({width,height});
   const result=await page.evaluate(n=>{
    const route=document.querySelector('#chord-route'),template=route.querySelector('li').cloneNode(true),paged=n>12,count=paged?8:n;
    document.body.classList.toggle('paged-chain',paged);document.querySelector('#harmony-hud').classList.toggle('has-long-route',n>5);route.closest('.route-panel').classList.toggle('route-long-panel',n>5);
    route.classList.toggle('route-long',n>5);route.classList.toggle('route-paged',paged);route.style.setProperty('--route-half',Math.ceil(n/2));route.replaceChildren();
    for(let i=0;i<count;i++){const li=template.cloneNode(true);li.hidden=false;li.querySelector('.route-node em').textContent=i+1;const label=li.querySelector('.route-copy b');label.textContent=['A△7/E','F♯−9','D♭−7','Gadd9'][i%4];label.classList.add('visible');route.append(li);}
    document.querySelector('#chain-pager').hidden=!paged;
    const flowers=document.querySelector('#arrangement-status');flowers.innerHTML=Array.from({length:3},()=>'<button><canvas width="96" height="96"></canvas></button>').join('');
    const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};
    return {chainBottom:Math.max(...[...route.children].map(e=>box(e).bottom)),flowers:box(flowers),readout:box(document.querySelector('.run-readout')),chainTop:Math.min(...[...route.children].map(e=>box(e).top))};
   },n);
   assert(result.flowers.top-result.chainBottom>=6,`chain/flower gap ${width}x${height}, ${n} chords: ${JSON.stringify(result)}`);
   assert(result.readout.bottom<=result.chainTop,`time/score above chain, ${width}/${n}`);
   assert(result.readout.left>=0&&result.readout.right<=width,'readout fits');
   if(width===390&&n===8)await page.screenshot({path:'/private/tmp/ear-yoga-header-layout-1.30.png'});
  }
  console.log('Header layout passed: timer, fully revealed 4/7/8/12/32/75-position fixtures and three flowers remain separated at five viewports.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
