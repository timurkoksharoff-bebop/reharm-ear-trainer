// A preflight dialog must finish its own audio cleanup before the next route
// starts. Run against an isolated release; no real player storage is reused.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8167/preview-1.75.html';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
   localStorage.setItem('ear-yoga-mode-access.v1',JSON.stringify({version:1,allAccess:true,medium:[],hard:[]}));
   localStorage.setItem('ear-yoga-guide.v2','1');
  });
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  await page.locator('[data-difficulty="professor"]').click();await page.locator('#start-random').click();
  const startFromLesson=async({audition=false}={})=>{
   await page.locator('#professor-lesson').waitFor({state:'visible'});
   if(audition){
    await page.getByRole('button',{name:'Вместе',exact:true}).click();
    await page.waitForFunction(()=>gardenFlight.snapshot().lastModePreview?.active);
   }
   await page.getByRole('button',{name:'Начать полёт',exact:true}).click();
   await page.waitForFunction(()=>gardenFlight.snapshot().mission.running&&!gardenFlight.snapshot().mission.complete);
   // Drain the queued native close event while still well inside the tonic bar.
   await page.waitForTimeout(150);
   const started=await page.evaluate(()=>gardenFlight.snapshot());
   assert.equal(started.mission.cursor,-1,'new route starts with the tonic reference');
   assert(started.audio.sounding,'lesson close must not silence the new tonic');
   const at=started.audio.sounding.at;
   await page.waitForTimeout(Math.max(0,started.mission.barSeconds*1000-450));
   const held=await page.evaluate(()=>gardenFlight.snapshot());
   assert.equal(held.mission.cursor,-1,'tonic gets its own bar before the first chord');
   assert.equal(held.audio.sounding?.at,at,'the tonic survives lesson cleanup until the end of its bar');
   await page.waitForFunction(()=>gardenFlight.snapshot().mission.cursor===0);
   assert(await page.evaluate(()=>Boolean(gardenFlight.snapshot().audio.sounding)),'first sequence chord follows the tonic audibly');
  };
  await startFromLesson({audition:true});
  // Complete the actual route using its own expected answers; Next must take
  // the same lesson/audio handoff path as a player's completed Master flight.
  const solveRoute=()=>page.evaluate(()=>{
   for(let index=0;index<gardenFlight.snapshot().mission.exercise.sequence.length;index++){
    if(gardenFlight.snapshot().mission.cursor!==index)gardenFlight.advanceChord();
    const model=gardenFlight.snapshot().mission,chord=model.current;
    const quality=({m:'min',m9:'m7natural9','m7♭5':'m7b5'})[chord.quality]??chord.quality;
    document.querySelector(`[data-degree="${chord.offset}"]`).click();
    document.querySelector(`[data-quality="${quality}"]`).click();
    if(model.separateBass)document.querySelector(`[data-bass-degree="${chord.bassOffset??chord.offset}"]`).click();
   }
  });
  for(let attempt=0;attempt<2;attempt++){
   await solveRoute();await page.locator('#mission-complete').waitFor({state:'visible'});
   await page.locator('#mission-next-route').click();await startFromLesson({audition:attempt===1});
  }
  assert.deepEqual(errors,[]);
  console.log('PASS Master lesson audio: warm audition → flight and two completed-route Next transitions retain a full tonic bar, with and without lesson audition.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
