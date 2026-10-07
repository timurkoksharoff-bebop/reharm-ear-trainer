const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8156/garden/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  await context.addInitScript(()=>localStorage.setItem('echo-garden-welcome-dismissed.v1','1'));
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'?state=2&light=day');await page.waitForFunction(()=>gardenFlight.snapshot().ready);
  await page.locator('#start-choose').tap();await page.locator('[data-tour="chill"]').tap();
  await page.locator('.garden-route-choice').filter({hasText:'Chill 3'}).tap();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
  const route=await page.evaluate(()=>gardenFlight.snapshot().mission.exercise);
  assert.equal(route.id,'builtin-chill-03');
  assert.equal(route.sequence[3].quality,'7b9');assert.equal(route.sequence[3].offset,10);
  assert.equal(route.sequence[3].bassOffset,10);assert.deepEqual(route.sequence[3].notes,[47,54,57,60,63]);
  assert.equal(route.sequence[6].quality,'7b9');assert.equal(route.sequence[6].offset,10);
  assert.equal(route.sequence[6].bassOffset,10);assert.deepEqual(route.sequence[6].notes,[47,51,54,57,60,63]);
  for(let index=0;index<4;index++)await page.evaluate(()=>gardenFlight.advanceChord());
  const first=page.locator('#quality-advanced-options [data-quality="7b9"]');
  assert.equal(await first.count(),1);assert.equal(await first.innerText(),'7(♭9)');assert(await first.isEnabled());
  await first.tap();assert.equal((await page.evaluate(()=>gardenFlight.snapshot().mission.currentParts)).quality,true);
  for(let index=0;index<3;index++)await page.evaluate(()=>gardenFlight.advanceChord());
  assert.equal((await page.evaluate(()=>gardenFlight.snapshot().mission.current.quality)),'7b9');
  const second=page.locator('#quality-advanced-options [data-quality="7b9"]');assert(await second.isEnabled());await second.tap();
  assert.equal((await page.evaluate(()=>gardenFlight.snapshot().mission.currentParts)).quality,true);
  assert.deepEqual(errors,[]);await context.close();
  console.log('Chill 3 flat-nine PASS: positions 4 and 7 preserve exact MIDI pitches, classify as ♭VII7(♭9), and accept visible 7(♭9) answer on mobile.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
