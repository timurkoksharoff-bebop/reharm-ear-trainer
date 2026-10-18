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
  assert.equal(icon,'icon-192-v'+await page.evaluate(()=>GARDEN_VERSION)+'.png');
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
  assert.deepEqual(await page.locator('#bass-options button').allTextContents(),await page.locator('#degree-options button').allTextContents(),'bass and root use the same tonic-relative Roman degrees');
  assert.equal(await page.locator('#bass-options button').first().getAttribute('data-bass'),'5','in F, bass I selects F rather than C');
  assert.equal(await page.locator('[data-quality="maj"]').innerText(),'△');
  const sequence=await page.evaluate(()=>gardenFlight.snapshot().mission.exercise.sequence);
  const tonic=await page.evaluate(()=>gardenFlight.snapshot().mission.exercise.baseTonic);
  assert.equal(await page.locator('#teacher-key').innerText(),'ROOT · KEY: F');
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'/private/tmp/ear-yoga-teacher-roman-bass.png'});
  await page.setViewportSize({width:1440,height:900});
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
   return {bass:rect('#bass-panel'),root:rect('.degrees-panel'),quality:rect('#quality-options'),pause:rect('#mission-toggle'),home:rect('#garden-home'),lotus:rect('.flight-tools summary'),notes:[...document.querySelectorAll('#bass-options button')].map(e=>({y:e.getBoundingClientRect().y,x:e.getBoundingClientRect().x,bottom:e.getBoundingClientRect().bottom,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),background:getComputedStyle(document.querySelector('#bass-options button:not(.selected)')).backgroundColor};
  });
  for(const [width,height] of [[1440,900],[768,1024],[430,932],[414,896],[390,844],[390,692],[320,568]]){
   await page.setViewportSize({width,height});const b=await boxes();
   assert.equal(new Set(b.notes.map(n=>Math.round(n.x))).size,1,'one vertical note column at '+width);
   assert(b.notes.every((n,i)=>!i||n.y>b.notes[i-1].y),'notes descend vertically');
   assert(b.notes.every((n,i)=>!i||n.y-b.notes[i-1].bottom>=5),'bass circles have a real gap at '+width+'x'+height);
   assert(b.notes.every(n=>n.width>=n.height*1.4),'bass buttons are horizontal ovals at '+width);
   const labelsFit=await page.locator('#bass-options button').evaluateAll(buttons=>buttons.every(e=>{const range=document.createRange();range.selectNodeContents(e);const text=range.getBoundingClientRect(),button=e.getBoundingClientRect();return text.left>=button.left+2&&text.right<=button.right-2&&text.height<=button.height+1;}));
   assert(labelsFit,'Roman bass labels fit inside ovals at '+width+'x'+height);
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
  assert.equal(await page.locator('#teacher-key').isVisible(),true,'Student labels the bottom rail ROOT');
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.separateBass),false);
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.rootMode),true);
  assert.equal(await page.locator('[data-quality="4:m7"]').count(),0,'Student has quality-only answers');
  assert.equal(await page.locator('[data-quality="maj7"]').innerText(),'maj7','Student retains readable quality notation');
  await page.evaluate(()=>gardenFlight.advanceChord());
  for(let i=0;i<sequence.length;i++){
   const chord=sequence[i];
   await page.locator('[data-degree="'+chord.offset+'"]').click();
   assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.currentParts.bass),true,'Student bass is automatic, including inversions');
   const quality=({m:'min','m7♭5':'m7b5',m9:'m7natural9'})[chord.quality]??chord.quality;
   await page.locator('[data-quality="'+quality+'"]').click();
   assert((await page.evaluate(()=>gardenFlight.snapshot().mission.solved)).includes(i),'Student solves each position without answering bass');
   if(i<sequence.length-1)await page.evaluate(()=>gardenFlight.advanceChord());
  }
  assert.match(await page.locator('#chord-route').innerText(),/Am7\/E/,'Student chain retains letter names and slash bass');
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'/private/tmp/ear-yoga-student-root-auto-bass.png'});
  await page.evaluate(()=>gardenFlight.showMenu());
  await page.locator('[data-difficulty="hard"]').click();await page.locator('#start-choose').click();
  await page.locator('.garden-route-choice').filter({hasText:'Fig. 1.15 — slash bass'}).click();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);await page.evaluate(()=>gardenFlight.advanceChord());
  const pickup=async kind=>{await page.evaluate(kind=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnCollectible(kind);e.x=s.x/s.width;e.y=s.y/s.height;e.vx=e.vy=0;},kind);await page.waitForFunction(kind=>gardenFlight.snapshot().life.inventory[kind]>0,kind);};
  for(const kind of ['holdArpeggio','bassClef']){
   await pickup(kind);await page.locator('.flight-tools summary').click();
   if(kind==='bassClef')await page.screenshot({path:'/private/tmp/ear-yoga-bass-clef-inventory.png'});
   await page.locator('[data-use-artifact="'+kind+'"]').click();
  }
  assert.equal(await page.locator('#degree-options button:visible').count(),4);
  assert.equal(await page.locator('#bass-options button:visible').count(),4);
  const target=await page.evaluate(()=>gardenFlight.snapshot().mission.current);
  assert(await page.locator('[data-degree="'+target.offset+'"]').isVisible());
  assert(await page.locator('[data-bass-degree="'+(target.bassOffset??target.offset)+'"]').isVisible());
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.filters.quality),null,'ROOT and BASS filters never touch chord choices');
  await page.screenshot({path:'/private/tmp/ear-yoga-four-root-four-bass.png'});
  for(let i=0;i<3;i++)await page.evaluate(()=>gardenFlight.advanceChord());
  assert.equal(await page.locator('#degree-options button:visible').count(),12);
  assert.equal(await page.locator('#bass-options button:visible').count(),12);
  await page.evaluate(()=>gardenFlight.showMenu());await page.locator('#start-tutorial').click();
  await page.locator('[data-guide-kind="bassClef"]').screenshot({path:'/private/tmp/ear-yoga-bass-clef-card.png'});
  const natural=await context.newPage();await natural.setViewportSize({width:390,height:844});await natural.goto(base);await natural.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  await natural.locator('[data-difficulty="hard"]').click();await natural.locator('#start-choose').click();
  await natural.locator('.garden-route-choice').filter({hasText:'Fig. 1.6 — basic model'}).click();
  assert.equal(await natural.locator('#bass-panel').isVisible(),false,'Teacher hides BASS on routes without independent bass, despite maj7/7 extensions');
  assert.equal(await natural.locator('[data-quality="maj"]').innerText(),'△','Teacher notation is unchanged when bass panel is hidden');
  await natural.evaluate(()=>gardenFlight.showMenu());await natural.locator('#start-choose').click();
  await natural.locator('.garden-route-choice').filter({hasText:'Fig. 1.15 — slash bass'}).click();
  assert(await natural.locator('#bass-panel').isVisible(),'Teacher restores BASS on a mixed slash-bass route');
  const began=Date.now();
  await natural.waitForFunction(()=>gardenFlight.snapshot().life.entities.some(e=>e.kind==='bassClef'&&e.y>.08),null,{timeout:25000}).catch(async error=>{console.error(await natural.evaluate(()=>({hidden:document.hidden,paused:gardenFlight.snapshot().paused,mission:gardenFlight.snapshot().mission.running,bass:gardenFlight.snapshot().mission.bassPanelNeeded,time:gardenFlight.snapshot().time,life:gardenFlight.snapshot().life,res:gardenFlight.snapshot().resonance})));throw error;});
  assert(Date.now()-began<23000,'first bass key appears naturally, without a forced pickup');
  await natural.screenshot({path:'/private/tmp/ear-yoga-bass-clef-natural-spawn.png'});
  await natural.close();
  assert.deepEqual(errors,[]);console.log('Teacher/Student browser passed: Roman bass, shared root/quality answers, Student automatic slash bass and readable symbols, Teacher compact notation and pending inversions, 7 layouts, transparent inventory.');
  await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
