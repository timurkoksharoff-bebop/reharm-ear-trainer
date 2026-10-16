const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8783/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  await page.locator('[data-difficulty="hard"]').click();await page.locator('#start-choose').click();await page.locator('[data-tour="jazz-standards"]').click();
  await page.locator('.garden-route-choice').filter({hasText:'All of Me'}).click();
  await page.waitForFunction(()=>earYoga.guide().active||gardenFlight.snapshot().mission.running);
  if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();
  const source=await page.evaluate(()=>JSON.stringify(gardenFlight.snapshot().mission.exercise.sequence));
  assert.equal(JSON.parse(source).length,34,'full All of Me retained');
  assert.equal(await page.locator('#chord-route .chord-slot:visible').count(),8);
  assert.equal(await page.locator('#chain-range').innerText(),'1–8 / 34');
  await page.locator('#chain-forward').click();assert.equal(await page.locator('#chain-range').innerText(),'9–16 / 34');
  await page.evaluate(()=>{while(gardenFlight.snapshot().mission.cursor<8)gardenFlight.advanceChord();});
  assert.equal(await page.locator('#chain-range').innerText(),'9–16 / 34','view follows the sounding chord');
  assert(await page.locator('#chord-route .current').isVisible());
  assert.equal(await page.evaluate(()=>JSON.stringify(gardenFlight.snapshot().mission.exercise.sequence)),source);
  for(let i=8;i<16;i++){
   const chord=await page.evaluate(()=>gardenFlight.snapshot().mission.current);
   await page.locator('[data-degree="'+chord.offset+'"]').click();
   await page.locator('[data-quality="'+chord.quality+'"]').click();
   if(chord.bassOffset!=null&&chord.bassOffset!==chord.offset)await page.locator('[data-bass="'+((chord.bassOffset+(await page.evaluate(()=>gardenFlight.snapshot().mission.exercise.baseTonic)))%12)+'"]').click();
   await page.evaluate(()=>gardenFlight.advanceChord());
  }
  assert.equal(await page.locator('#chain-range').innerText(),'17–24 / 34');
  await page.locator('#chain-back').click();
  await page.locator('#mission-toggle').click();
  for(const [width,height] of [[320,568],[390,844],[430,932],[768,1024],[1440,900]]){
   await page.setViewportSize({width,height});
   const boxes=await page.locator('#chord-route .chord-slot:visible').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,width:r.width};}));
   assert(boxes.every(b=>b.x>=0&&b.right<=width),'chain fits '+width);
   assert(boxes.every(b=>b.width>=48),'room for readable chord labels '+width);
   assert.equal(new Set(boxes.map(b=>Math.round(b.y))).size,2,'two readable rows');
   const clear=await page.evaluate(()=>{const chain=document.querySelector('#chain-pager').getBoundingClientRect(),quality=document.querySelector('#quality-options').getBoundingClientRect();return quality.y>=chain.bottom+8;});
   assert(clear,'answer rail clears page controls');
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'/private/tmp/ear-yoga-1.23-long-route.png'});
  assert.deepEqual(errors,[]);console.log('Long routes passed: all 34 All of Me positions retained, 8 readable slots, automatic/manual paging, 5 layouts.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
