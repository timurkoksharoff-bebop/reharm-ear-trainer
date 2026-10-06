const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8155/garden/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  await context.addInitScript(()=>localStorage.setItem('echo-garden-welcome-dismissed.v1','1'));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const snap=()=>page.evaluate(()=>gardenFlight.snapshot());
  const quality=chord=>{const q=({m:'min',m9:'m7natural9','m7♭5':'m7b5'})[chord.quality]??chord.quality;return (chord.bassOffset??chord.offset)!==chord.offset?`${chord.offset}:${q}`:q;};
  const pickup=async kind=>{await page.evaluate(kind=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnCollectible(kind);e.x=s.x/s.width;e.y=s.y/s.height;e.vx=e.vy=0;},kind);await page.waitForFunction(kind=>gardenFlight.snapshot().life.inventory[kind]>0,kind);};
  await page.goto(base+'?state=2&light=day');await page.waitForFunction(()=>gardenFlight.snapshot().ready);
  assert(await page.locator('[data-difficulty="hard"]').isDisabled());
  await page.locator('[data-difficulty="light"]').tap();
  for(const [index,id] of ['fig-1-6','fig-1-7','fig-1-9'].entries()){
   await page.locator('#start-random').tap();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
   const sequence=(await snap()).mission.exercise.sequence;assert.equal((await snap()).currentRoute,id);assert(sequence.length>=3&&sequence.length<=4);
   for(let i=0;i<sequence.length;i++){
    if((await snap()).mission.cursor!==i)await page.evaluate(()=>gardenFlight.advanceChord());
    await page.locator(`[data-degree="${sequence[i].bassOffset??sequence[i].offset}"]`).tap();await page.locator(`[data-quality="${quality(sequence[i])}"]`).tap();
   }
   assert((await snap()).mission.complete);assert.equal((await snap()).progress.admissionCompleted.length,index+1);
   assert.equal(await page.locator('#enrollment').isVisible(),index===2);
  }
  assert.match(await page.locator('#enrollment').innerText(),/Space Music College/);
  await page.screenshot({path:'/private/tmp/garden-098-enrollment.png'});
  await page.locator('#enrollment-student').tap();assert.equal(await page.locator('button[data-difficulty="medium"]').getAttribute('aria-pressed'),'true');
  await page.reload();await page.waitForFunction(()=>gardenFlight.snapshot().ready);assert.equal((await snap()).progress.admissionCompleted.length,3);
  // Real blue-flower pickup and activation with none, either part or both found.
  for(const found of ['none','degree','quality','both']){
   await page.locator('#start-choose').tap();await page.locator('[data-tour="chill"]').tap();await page.locator('.garden-route-choice').filter({hasText:'Chill 1'}).tap();
   await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);await page.evaluate(()=>gardenFlight.advanceChord());
   const target=(await snap()).mission.current;
   if(found==='degree'||found==='both')await page.locator(`[data-degree="${target.bassOffset??target.offset}"]`).tap();
   if(found==='quality'||found==='both')await page.locator(`[data-quality="${quality(target)}"]`).tap();
   await pickup('hold');await page.locator('.flight-tools summary').tap();await page.locator('[data-use-artifact="hold"]').tap();
   await pickup('degreeReveal');const position=(await snap()).mission.cursor;
   await page.locator('.flight-tools summary').tap();const blue=page.locator('[data-use-artifact="degreeReveal"]');
   await page.waitForFunction(expected=>document.querySelector('[data-use-artifact="degreeReveal"]').disabled===expected,found==='both');
   assert.equal(await blue.isDisabled(),found==='both',`blue activation for ${found}`);
   if(found==='both')assert.equal((await snap()).life.inventory.degreeReveal,1,'fully solved position keeps the charge');
   else{
    await blue.tap();const state=await snap();assert.deepEqual(state.mission.progress[position],{degree:true,quality:true});assert.equal(state.life.inventory.degreeReveal,0);assert(!state.mission.held);assert.equal(state.mission.cursor,position+1,'atomic reveal advances once from infinity');
    assert.equal(await page.locator(`.chord-slot:nth-child(${position+1}) .found`).count(),2,'both liquid hemispheres visibly fill');
   }
   await page.locator('#garden-home').tap();await page.locator('#exit-accept').tap();
  }
  // Daylight improves only the edge; the button glass stays transparent.
  await page.locator('#start-choose').tap();await page.locator('[data-tour="chill"]').tap();await page.locator('.garden-route-choice').filter({hasText:'Chill 1'}).tap();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);await page.evaluate(()=>gardenFlight.advanceChord());
  assert(await page.locator('body.bright-garden').count());
  const style=await page.locator('[data-quality="maj"]').evaluate(el=>{const c=getComputedStyle(el);return {border:c.borderColor,shadow:c.boxShadow,fill:c.backgroundColor};});
  const alpha=color=>Number(color.split(',').at(-1).replace(')',''));
  assert(alpha(style.border)>=.69&&alpha(style.border)<=.71);assert(alpha(style.fill)<=.13);assert.notEqual(style.shadow,'none');
  await page.locator('#mission-toggle').tap();await page.screenshot({path:'/private/tmp/garden-098-light-outlines.png'});
  assert.deepEqual(errors,[]);await context.close();
  console.log('Admission/reveal browser PASS: three exact short lessons, one enrollment, persistent admission, Student transfer, disabled Teacher, real blue pickup with either/both parts found, atomic infinity release, visible liquid fill and transparent daylight outlines.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
