const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8783/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900},locale:'ru-RU',serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  assert.equal(await page.locator('#build-version').innerText(),'v'+await page.evaluate(()=>GARDEN_VERSION));
  await page.screenshot({path:'/private/tmp/ear-yoga-1.25-start.png'});
  const icon=await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
  assert.match(icon,/icon-192-v1\.25\.png/);
  assert((await page.request.get(new URL(icon,base).href)).ok(),'versioned lotus icon loads');
  await page.locator('[data-difficulty="hard"]').click();
  await page.locator('#start-choose').click();
  await page.locator('.garden-route-choice').filter({hasText:'Fig. 1.15 — slash bass'}).click();
  await page.waitForFunction(()=>earYoga.guide().active||gardenFlight.snapshot().mission.running);
  if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
  assert(await page.locator('#bass-panel').isVisible());
  assert.equal(await page.locator('#bass-options button').count(),12);
  assert.equal(await page.locator('#degree-options button').count(),12);
  assert.equal(await page.locator('[data-quality="maj"]').innerText(),'△');
  const sequence=await page.evaluate(()=>gardenFlight.snapshot().mission.exercise.sequence);
  const tonic=await page.evaluate(()=>gardenFlight.snapshot().mission.exercise.baseTonic);
  assert.equal(await page.locator('#teacher-key').innerText(),'ROOT · KEY: F');
  await page.screenshot({path:'/private/tmp/ear-yoga-teacher-layout.png'});
  await page.evaluate(()=>gardenFlight.advanceChord());
  for(let i=0;i<sequence.length;i++){
   const chord=sequence[i],bass=chord.bassOffset??chord.offset;
   assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.cursor),i);
   if(i===0){
    const button=await page.locator('[data-degree="'+chord.offset+'"]').boundingBox();
    await page.mouse.move(button.x+button.width/2,button.y+button.height/2);await page.mouse.down();
    assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.currentParts.degree),true,'answer is accepted on pointerdown, before release');
    await page.mouse.move(700,400);await page.mouse.up();
   }else await page.locator('[data-degree="'+chord.offset+'"]').click();
   if(bass===chord.offset){
    assert.equal(await page.locator('[data-bass="'+((tonic+bass)%12)+'"]').getAttribute('aria-pressed'),'true','coincident bass opens with root');
   }
   await page.locator('[data-quality="'+chord.quality+'"]').click();
   if(bass!==chord.offset){
    const state=await page.evaluate(()=>gardenFlight.snapshot().mission);
    assert.equal(state.progress[i].bass,false);
    assert(!state.solved.includes(i),'inversion remains unresolved without bass');
    await page.locator('[data-bass="'+((tonic+bass)%12)+'"]').click();
   }
   if(i<sequence.length-1)await page.evaluate(()=>gardenFlight.advanceChord());
  }
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.complete),true);
  assert.equal(await page.locator('.node-bass-ring.found').count(),sequence.length);
  assert.match(await page.locator('#chord-route').innerText(),/A−7\/E/);
  await page.locator('#mission-toggle').click();
  assert.equal(await page.locator('#mission-toggle').getAttribute('data-playback-state'),'play');
  const boxes=async()=>page.evaluate(()=>{
   const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
   return {bass:rect('#bass-panel'),root:rect('.degrees-panel'),quality:rect('#quality-options'),pause:rect('#mission-toggle'),home:rect('#garden-home'),lotus:rect('.flight-tools summary'),notes:[...document.querySelectorAll('#bass-options button')].map(e=>({y:e.getBoundingClientRect().y,x:e.getBoundingClientRect().x,bottom:e.getBoundingClientRect().bottom,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),background:getComputedStyle(document.querySelector('#bass-options button')).backgroundColor};
  });
  for(const [width,height] of [[1440,900],[768,1024],[430,932],[414,896],[390,844],[390,692],[320,568]]){
   await page.setViewportSize({width,height});const b=await boxes();
   assert.equal(new Set(b.notes.map(n=>Math.round(n.x))).size,1,'one vertical note column at '+width);
   assert(b.notes.every((n,i)=>!i||n.y>b.notes[i-1].y),'notes descend vertically');
   assert(b.notes.every((n,i)=>!i||n.y-b.notes[i-1].bottom>=5),'bass circles have a real gap at '+width+'x'+height);
   assert(b.notes.every(n=>Math.abs(n.width-n.height)<1),'bass buttons stay circular at '+width);
   assert(b.lotus.bottom<b.bass.y,'upper inventory clears the bass column at '+width);
   assert(b.bass.bottom+8<b.root.y,'bass column clears roots at '+width);
   assert(b.pause.right<b.home.x,'pause clears home');
   assert(b.quality.width<60,'quality buttons narrowed');
   assert.equal(b.background,'rgba(0, 0, 0, 0)');
  }
  await page.setViewportSize({width:1440,height:900});
  await page.locator('.flight-tools summary').click();
  assert(await page.locator('.flight-tools-body').isVisible());
  const inventory=await page.locator('.flight-tools-body').evaluate(e=>{const r=e.getBoundingClientRect(),b=e.querySelector('button').getBoundingClientRect();return {height:r.height,top:r.top,bottom:r.bottom,firstTop:b.top,firstBottom:b.bottom};});
  assert(inventory.height>=90,'inventory cannot collapse into a clipped strip');
  assert(inventory.firstTop>=inventory.top&&inventory.firstBottom<=inventory.bottom,'inventory buttons are actually visible');
  assert.equal(await page.locator('.flight-tools-body').evaluate(e=>getComputedStyle(e).pointerEvents),'none','empty inventory area does not intercept steering');
  const blank=await page.locator('.flight-tools-body').evaluate(e=>{const r=e.getBoundingClientRect();for(let y=r.top+2;y<r.bottom;y+=8)for(let x=r.left+2;x<r.right;x+=8){const hit=document.elementFromPoint(x,y);if(hit?.id==='world')return {x,y};}return null;});
  assert(blank,'empty panel area exposes the flight canvas');
  await page.mouse.click(blank.x,blank.y);
  assert.equal(await page.locator('.flight-tools').getAttribute('open'),null,'steering through blank inventory closes it');
  await page.locator('.flight-tools summary').click();
  await page.screenshot({path:'/private/tmp/ear-yoga-teacher-desktop.png'});
  await page.locator('.flight-tools summary').click();
  await page.locator('#garden-home').click();if(await page.locator('#exit-confirm').isVisible())await page.locator('#exit-accept').click();
  await page.locator('[data-difficulty="medium"]').click();await page.locator('#start-choose').click();
  await page.locator('.garden-route-choice').filter({hasText:'Fig. 1.15 — slash bass'}).click();
  assert.equal(await page.locator('#bass-panel').isVisible(),false,'Student has no bass note panel');
  assert.equal(await page.locator('#teacher-key').isVisible(),false);
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.separateBass),false);
  assert.equal(await page.locator('[data-quality="4:m7"]').count(),1,'Student retains legacy compound answers');
  assert.deepEqual(errors,[]);console.log('Teacher browser passed: actual answers, automatic bass, inversions, completion, compact notation, four layouts, transparent inventory, unchanged Student.');
  await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
