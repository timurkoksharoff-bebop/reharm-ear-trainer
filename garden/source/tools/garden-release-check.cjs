const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8152/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  await page.locator('#start-tutorial').click();
  assert(await page.locator('#flight-tutorial').isVisible());await page.screenshot({path:'/private/tmp/garden-095-guide.png'});
  for(let i=0;i<3;i++)await page.locator('#tutorial-next').click();
  assert.match(await page.locator('#tutorial-copy').innerText(),/БАС/);
  await page.locator('#tutorial-close').click();
  assert(await page.locator('#garden-start').isVisible());
  await page.locator('#start-choose').click();await page.locator('[data-tour="chill"]').click();
  await page.locator('.garden-route-choice').filter({hasText:'Chill 1'}).click();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
  assert(!(await page.locator('#flight-tutorial').isVisible()));
  // Rapid real touch taps must toggle the native lotus summary, not vanish
  // into the double-tap zoom guard.
  await page.locator('.flight-tools summary').tap();assert.notEqual(await page.locator('.flight-tools').getAttribute('open'),null);
  await page.locator('.flight-tools summary').tap();assert.equal(await page.locator('.flight-tools').getAttribute('open'),null);
  const snap=()=>page.evaluate(()=>gardenFlight.snapshot());
  // A launch/menu/answer click leaves a button focused. Gameplay keys must
  // still work without an extra click on the canvas.
  await page.locator('[data-quality="maj"]').focus();const keyboardStart=(await snap()).x;
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(450);await page.keyboard.up('ArrowRight');
  assert((await snap()).x>keyboardStart+10,'movement works with an answer button focused');
  await page.keyboard.press('Space');assert((await snap()).paused&&!((await snap()).mission.running));
  await page.keyboard.press('Space');await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
  const route=(await snap()).mission.exercise.sequence;
  assert.equal(route.length,8);
  for(let i=0;i<route.length;i++){
   if((await snap()).mission.cursor!==i)await page.evaluate(()=>gardenFlight.advanceChord());
   assert.equal((await snap()).mission.cursor,i,'answer the exact sounding position');
   const chord=route[i],bass=chord.bassOffset??chord.offset,q=({m:'min',m9:'m7natural9','m7♭5':'m7b5'})[chord.quality]??chord.quality,answer=bass!==chord.offset?`${chord.offset}:${q}`:q;
   const bassButton=page.locator(`[data-degree="${bass}"]`),chordButton=page.locator(`[data-quality="${answer}"]`);
   assert(await chordButton.isVisible(),`slot ${i+1}: ${answer} visible`);
   await bassButton.click();assert.equal(await bassButton.getAttribute('aria-pressed'),'true');
   if(i===6){assert.equal(answer,'sus4');assert.equal(await page.locator('#quality-options [data-quality="sus4"]').count(),1);await page.screenshot({path:'/private/tmp/garden-095-chill-sus4.png'});}
   await chordButton.click();
   assert((await snap()).mission.progress[i].quality,`slot ${i+1}: accepted visible answer`);
  }
  assert((await snap()).mission.complete);assert(await page.locator('#garden-start').isVisible());
  await page.locator('#start-choose').click();await page.locator('[data-tour="chill"]').click();await page.locator('.garden-route-choice').filter({hasText:'Chill 1'}).click();await page.evaluate(()=>gardenFlight.advanceChord());
  // Real collision pickup, then actual inventory button. Not a mission hold shortcut.
  const pickup=async(kind)=>{await page.evaluate(kind=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnCollectible(kind);e.x=s.x/s.width;e.y=s.y/s.height;e.vx=e.vy=0;},kind);await page.waitForFunction(kind=>gardenFlight.snapshot().life.inventory[kind]>0,kind);};
  await pickup('hold');await page.locator('.flight-tools summary').click();await page.locator('[data-use-artifact="hold"]').click();
  assert((await snap()).mission.held);assert.equal((await snap()).life.inventory.hold,0);const held=(await snap()).mission.cursor;
  await page.locator('#world-controls').click();const menuPause=await snap();await page.waitForTimeout(200);
  assert(!(await snap()).mission.running);assert.deepEqual((await snap()).life.resources,menuPause.life.resources);
  await page.locator('#menu-close').click();assert((await snap()).mission.running);assert((await snap()).mission.held,'settings do not spend or cancel the active infinity');
  await page.waitForTimeout(10500);assert.equal((await snap()).mission.cursor,held);assert((await snap()).mission.held);
  assert(await page.locator('#infinity-continue').isVisible());
  await page.screenshot({path:'/private/tmp/garden-095-infinity.png'});
  await page.locator('#infinity-continue').click();
  assert(!(await snap()).mission.held);assert.equal((await snap()).mission.cursor,(held+1)%route.length,'manual continue advances immediately');
  assert(!(await page.locator('#infinity-continue').isVisible()));
  for(const kind of ['degree','quality']){
   await pickup('hold');await page.locator('.flight-tools summary').click();await page.locator('[data-use-artifact="hold"]').click();
   const model=(await snap()).mission,position=model.cursor,target=model.current,bass=target.bassOffset??target.offset,q=({m:'min',m9:'m7natural9','m7♭5':'m7b5'})[target.quality]??target.quality;
   const answer=kind==='degree'?bass:bass!==target.offset?`${target.offset}:${q}`:q;
   const wrong=kind==='degree'?(bass+1)%12:q==='maj'?'min':'maj';
   await page.locator(kind==='degree'?`[data-degree="${wrong}"]`:`[data-quality="${wrong}"]`).click();
   assert((await snap()).mission.held);assert.equal((await snap()).mission.cursor,position,'wrong answer preserves held position');
   await page.locator(kind==='degree'?`[data-degree="${answer}"]`:`[data-quality="${answer}"]`).click();
   assert(!(await snap()).mission.held);assert.equal((await snap()).mission.cursor,(position+1)%route.length,'correct either part immediately advances');
   assert((await snap()).mission.progress[position][kind]);assert(!(await page.locator('#infinity-continue').isVisible()));
  }
  await pickup('hold');await page.locator('.flight-tools summary').click();await page.locator('[data-use-artifact="hold"]').click();
  await pickup('degreeReveal');const position=(await snap()).mission.cursor;
  await page.locator('.flight-tools summary').click();await page.locator('[data-use-artifact="degreeReveal"]').click();
  const revealed=await snap();assert.deepEqual(revealed.mission.progress[position],{degree:true,quality:true},JSON.stringify({position,cursor:revealed.mission.cursor,progress:revealed.mission.progress,held:revealed.mission.held,feedback:revealed.mission.feedback,inventory:revealed.life.inventory}));assert.equal(revealed.life.inventory.degreeReveal,0);
  await page.evaluate(()=>gardenFlight.advanceChord());await pickup('qualityFocus');
  await page.locator('.flight-tools summary').click();await page.locator('[data-use-artifact="qualityFocus"]').click();
  assert((await snap()).mission.filters.quality);assert.equal(await page.locator('.flight-tools').getAttribute('open'),null);
  await pickup('hold');await page.locator('.flight-tools summary').tap();await page.locator('[data-use-artifact="hold"]').tap();
  const qualityFilter=(await snap()).mission.filters.quality;
  for(const kind of ['holdArpeggio','arrangementBoost']){
   await pickup(kind);await page.locator('.flight-tools summary').tap();await page.locator(`[data-use-artifact="${kind}"]`).tap();
   const filtered=await snap(),divisor=kind==='holdArpeggio'?2:4;
   assert.equal(filtered.life.inventory[kind],0);assert.equal(filtered.mission.filters.degree.divisor,divisor);
   assert.equal(await page.locator('.degree-option:visible').count(),1+Math.ceil(11/divisor),'root hides wrong basses in the actual lower rail');
   assert(await page.locator(`[data-degree="${filtered.mission.current.bassOffset??filtered.mission.current.offset}"]`).isVisible(),'correct bass remains available');
   assert.deepEqual(filtered.mission.filters.quality,qualityFilter,'root never changes the chord filter');
   assert.equal(await page.locator('.flight-tools').getAttribute('open'),null);
  }
  await page.locator('#mission-toggle').tap();const pausedFilter=(await snap()).mission.filters.degree;
  await page.waitForTimeout(300);assert.deepEqual((await snap()).mission.filters.degree,pausedFilter);
  await page.locator('#mission-toggle').tap();assert((await snap()).mission.held);
  await page.screenshot({path:'/private/tmp/garden-097-root-filter.png'});
  await page.locator('#infinity-continue').tap();
  await pickup('shield');await page.locator('.flight-tools summary').click();await page.locator('[data-use-artifact="shield"]').click();
  assert.equal((await snap()).life.shieldHits,3);assert.equal((await snap()).life.inventory.shield,0);
  await page.screenshot({path:'/private/tmp/garden-095-cocoon.png'});
  await page.evaluate(()=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnCollectible('stoneAsteroid');e.x=s.x/s.width;e.y=s.y/s.height;e.vx=e.vy=0;});
  await page.waitForFunction(()=>gardenFlight.snapshot().life.shieldHits===2);
  await page.evaluate(()=>{const e=gardenFlight.spawnCollectible('restoration');e.x=.22;e.y=.3;e.vx=e.vy=0;});
  await page.waitForTimeout(600);await page.screenshot({path:'/private/tmp/garden-095-life-wheel.png'});
  await page.evaluate(()=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnCollectible('restoration');e.x=s.x/s.width;e.y=s.y/s.height;e.vx=e.vy=0;});
  await page.waitForFunction(()=>gardenFlight.snapshot().life.event?.kind==='restoration');
  assert(Object.values((await snap()).life.resources).every(value=>value>99.7),'actual collision restores all four reserves');
  for(const [kind,track] of [['bassCanon','bass'],['arpBroken','arpeggio']]){
   await page.evaluate(kind=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnCollectible(kind);e.x=s.x/s.width;e.y=s.y/s.height;e.vx=e.vy=0;},kind);
   await page.waitForFunction(({kind,track})=>gardenFlight.snapshot().mission.arrangementStatus[track]?.style===kind,{kind,track});
   const mini=page.locator(`#arrangement-status [data-arrangement-track="${track}"]`);assert.equal(await mini.getAttribute('data-arrangement-style'),kind);assert.equal(await mini.locator('canvas').count(),1);assert(await mini.isVisible());
  }
  await page.screenshot({path:'/private/tmp/garden-095-arrangement-minis.png'});
  await page.locator('#arrangement-status [data-arrangement-track="bass"]').click();assert(!(await snap()).mission.arrangementStatus.bass);
  assert((await snap()).mission.arrangementStatus.arpeggio,'turning bass off preserves the other mini/party');
  await page.locator('#garden-home').click();assert(await page.locator('#exit-confirm').isVisible());assert((await snap()).paused);
  await page.locator('#exit-cancel').click();assert((await snap()).mission.running,'cancel exit resumes the same flight');
  await page.locator('#garden-home').click();await page.locator('#exit-accept').click();const before=await snap();await page.waitForTimeout(250);const after=await snap();
  assert(await page.locator('#garden-start').isVisible());assert(!after.mission.running&&after.paused);assert.deepEqual(after.life.resources,before.life.resources);
  assert.equal(await page.locator('#tutorial-open').count(),0);
  await page.locator('#start-choose').click();await page.locator('[data-tour="gospel"]').click();
  await page.locator('.garden-route-choice').filter({hasText:'Gospel 5'}).click();
  const long=await snap();assert.equal(long.mission.exercise.sequence.length,18);
  await page.evaluate(()=>gardenFlight.advanceChord());
  const target=(await snap()).mission.current;await page.locator(`[data-degree="${target.bassOffset??target.offset}"]`).click();
  const liquid=await page.locator('.chord-slot.current .route-node').evaluate(el=>{const d=el.querySelector('.node-degree').getBoundingClientRect(),q=el.querySelector('.node-quality').getBoundingClientRect();return {lower:d.y>=q.y+q.height-1,overlap:Math.max(0,q.y+q.height-d.y)};});
  assert(liquid.lower);assert(liquid.overlap<1.1);
  const chain=await page.locator('#chord-route').boundingBox(),rail=await page.locator('#quality-options').boundingBox();
  assert(rail.y>=chain.y+chain.height+8,'fixed answer rail clears both chain rows');
  const iconBoxes=await Promise.all(['#garden-home','#world-controls','#mission-toggle','.flight-tools summary'].map(s=>page.locator(s).boundingBox()));
  for(let i=0;i<iconBoxes.length;i++)for(let j=i+1;j<iconBoxes.length;j++){const a=iconBoxes[i],b=iconBoxes[j];assert(a.x+a.width+4<=b.x||b.x+b.width+4<=a.x||a.y+a.height+4<=b.y||b.y+b.height+4<=a.y,'cockpit buttons do not touch');}
  const firstDot=await page.locator('.route-node').first().boundingBox();assert(firstDot.y>=Math.max(iconBoxes[0].y+iconBoxes[0].height,iconBoxes[1].y+iconBoxes[1].height)+3,'chain dots clear navigation icons');
  await page.screenshot({path:'/private/tmp/garden-095-clean-cockpit.png'});
  await page.locator('#garden-home').click();await page.locator('#exit-accept').click();
  for(const [width,height] of [[320,568],[390,844],[430,932],[1440,900]]){
   await page.setViewportSize({width,height});
   assert(await page.locator('#start-random').isVisible());
   assert.deepEqual(await page.locator('.difficulty-picker button').allTextContents(),['Абитуриент','Студент','Преподаватель']);
   assert(await page.locator('[data-difficulty="hard"]').isDisabled(),'Teacher mode is reserved, not playable');
   const modes=await page.locator('.difficulty-picker button').evaluateAll(buttons=>buttons.map(button=>({y:button.getBoundingClientRect().y,overflow:button.scrollWidth>button.clientWidth})));
   assert(modes.every(mode=>Math.abs(mode.y-modes[0].y)<1&&!mode.overflow),`three mode names fit one row at ${width}`);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow,`overflow ${width}`);
   await page.locator('#start-tutorial').click();
   for(const selector of ['#garden-home','#mission-toggle','#quality-options','#degree-options','#flight-tutorial']){
    const b=await page.locator(selector).boundingBox();assert(b&&b.x>=-1&&b.y>=-1&&b.x+b.width<=width+1&&b.y+b.height<=height+1,`${selector} fits ${width}x${height}: ${JSON.stringify(b)}`);
   }
   await page.locator('#tutorial-close').click();
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/private/tmp/garden-095-start.png'});
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  assert(await page.locator('#garden-start').isVisible());await page.locator('#start-random').click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);assert(!(await page.locator('#flight-tutorial').isVisible()),'skip persisted across restart and offline load');
  assert.deepEqual(errors,[]);
  const progressive=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),quick=await progressive.newPage(),pending=[];
  await quick.route('**/collectibles/*',route=>pending.push(route));
  await quick.goto(base,{waitUntil:'domcontentloaded'});await quick.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  assert(pending.length>0,'optional sprite network is stalled during launch');assert(await quick.locator('#garden-start').isVisible(),'scenery and menu launch despite stalled collectibles');
  for(const request of pending)await request.continue();
  await progressive.close();
  console.log('Browser PASS: rapid touch lotus taps, ordinary/strong root pickup and lower-rail filtering, three academic modes in one row, keyboard after button focus, exact Chill 1, correct/wrong/manual infinity exits, restored flower, 3-hit cocoon, immediate restoration pickup, safe exit, no icon/chain collisions, vertical liquid nodes, four viewports, offline, progressive launch with stalled sprites.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
