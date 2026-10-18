const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8788/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  const launch=async mode=>{await page.locator('[data-difficulty="'+mode+'"]').click();await page.locator('#start-choose').click();await page.locator('.garden-route-choice').filter({hasText:'Fig. 1.6 — basic model'}).click();if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);};
  await launch('medium');assert.equal(await page.locator('.vital[data-resource="resonance"]').isVisible(),false);assert.equal(await page.evaluate(()=>gardenFlight.spawnTension('9')),null);
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().speed),2);
  await page.evaluate(()=>gardenFlight.showMenu());await launch('hard');
  assert(await page.locator('.vital[data-resource="resonance"]').isVisible());assert.equal(await page.locator('.vital:visible').count(),5);
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().speed),2);assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.barSeconds),4);
  const original=await page.evaluate(()=>JSON.stringify(gardenFlight.snapshot().mission.exercise.sequence));
  await page.evaluate(()=>gardenFlight.advanceChord());
  await page.waitForTimeout(250);
  const oxygenBeforeClockCheck=await page.evaluate(()=>gardenFlight.snapshot().resonance.energy);
  await page.waitForTimeout(1000);
  const actualLoss=oxygenBeforeClockCheck-await page.evaluate(()=>gardenFlight.snapshot().resonance.energy);
  assert(actualLoss>.25&&actualLoss<.8,'O2 spends actual active time, not capped physics frames: '+actualLoss);
  const catchToken=async label=>{
   const before=await page.evaluate(()=>gardenFlight.snapshot().resonance.last?.id||0);
   await page.evaluate(label=>{const s=gardenFlight.snapshot();gardenFlight.spawnTension(label,{x:s.x/s.width,y:s.y/s.height,vy:0});},label);
   await page.waitForFunction(id=>(gardenFlight.snapshot().resonance.last?.id||0)>id,before);
   return page.evaluate(()=>gardenFlight.snapshot());
  };
  let state=await catchToken('9');assert.equal(state.resonance.last.verdict,'valid');assert.equal(state.resonance.last.requestedDelta,7);assert(state.resonance.energy<87&&state.resonance.energy>84);assert.equal(state.lastTension.midi,79);assert.equal(state.lastTension.loop,false);
  state=await catchToken('11');assert.equal(state.resonance.last.verdict,'invalid');assert.equal(state.resonance.last.requestedDelta,-20);assert(state.resonance.energy<67&&state.resonance.energy>63);assert.equal(state.lastTension.midi,82);
  assert.equal(await page.locator('.vital[data-resource="resonance"] strong').innerText(),'O₂');
  assert.equal(await page.locator('.run-readout').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  await page.waitForTimeout(1100);assert.notEqual(await page.locator('#run-time').innerText(),'00:00');
  await page.evaluate(()=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnCollectible('restoration');e.x=s.x/s.width;e.y=s.y/s.height;e.vx=e.vy=0;});
  await page.waitForFunction(()=>gardenFlight.snapshot().resonance.energy>99.8);
  assert((await page.evaluate(()=>Object.values(gardenFlight.snapshot().life.resources))).every(v=>v>99),'Wheel of Life restores all five supplies');
  assert.equal(await page.evaluate(()=>JSON.stringify(gardenFlight.snapshot().mission.exercise.sequence)),original);
  await page.evaluate(()=>{gardenFlight.spawnTension('♭9',{x:.4,y:.32,vy:0});gardenFlight.spawnTension('♯11',{x:.65,y:.42,vy:0});});
  await page.waitForTimeout(400);
  await page.screenshot({path:'/private/tmp/ear-yoga-resonance-teacher.png'});
  const lastId=await page.evaluate(()=>Math.max(0,...gardenFlight.snapshot().resonance.entities.map(e=>e.id)));
  await page.waitForTimeout(4000);assert(!(await page.evaluate(id=>gardenFlight.snapshot().resonance.entities.some(e=>e.id>id),lastId)),'no automatic medallions before two solved chords');
  await page.locator('#mission-toggle').click();const paused=await page.evaluate(()=>gardenFlight.snapshot().resonance);await page.waitForTimeout(250);assert.deepEqual(await page.evaluate(()=>gardenFlight.snapshot().resonance),paused,'pausing freezes RES and tokens');
  for(const [width,height] of [[320,568],[390,844],[430,932],[768,1024],[1440,900]]){
   await page.setViewportSize({width,height});const boxes=await page.locator('.vital:visible').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom};}));
   assert(boxes.every(b=>b.x>=0&&b.right<=width&&b.y>=0&&b.bottom<=height),'five vials fit '+width);
   assert(boxes.every((b,i)=>!i||b.x>boxes[i-1].right),'five vials do not overlap');
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>gardenFlight.showMenu());
  await page.locator('#start-choose').click();await page.locator('[data-tour="anime"]').click();
  await page.locator('.garden-route-choice').filter({hasText:'Anime 5'}).click();
  if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
  for(let i=0;i<7;i++){await page.evaluate(()=>gardenFlight.advanceChord());await page.waitForTimeout(35);}
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().mission.current.quality),'m9');
  const beforeEleven=await page.evaluate(()=>gardenFlight.snapshot().resonance.energy);
  state=await catchToken('11');assert.equal(state.resonance.last.verdict,'valid');assert.equal(state.lastTension.midi,83);
  assert(state.resonance.energy>beforeEleven);assert(!state.gameOver,'natural 11 over Anime 5 F#m9 replenishes O2, never fails the mission');
  await page.evaluate(()=>gardenFlight.showMenu());await page.locator('#start-tutorial').click();
  assert.equal(await page.locator('[data-guide-tension]').count(),12);await page.locator('#field-resonance').screenshot({path:'/private/tmp/ear-yoga-resonance-guide.png'});
  await page.locator('#guide-language').click();assert.match(await page.locator('#field-resonance').innerText(),/Teacher only/);assert(!/[А-Яа-яЁё]/.test(await page.locator('#field-resonance').innerText()));
  assert.deepEqual(errors,[]);console.log('Resonance browser passed: Teacher-only fifth vial, actual pickups and correct one-shot pitches, fixed speed/tempo, pause, unchanged MIDI, five layouts and RU/EN illustrated guide.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
