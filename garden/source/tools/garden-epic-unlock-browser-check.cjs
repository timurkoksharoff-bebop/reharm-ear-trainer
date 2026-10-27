const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=new URL(process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8183/');base.searchParams.set('testing','0');base.searchParams.set('routes','classic');
const out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-epic-unlock';fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const errors=[],c=await b.newContext({viewport:{width:390,height:844},locale:'ru-RU',isMobile:true,hasTouch:true,serviceWorkers:'block'});await c.addInitScript(()=>localStorage.setItem('ear-yoga-guide.v2','1'));const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base.href);await p.waitForFunction(()=>window.gardenFlight?.snapshot().ready);assert(!(await p.evaluate(()=>gardenFlight.snapshot())).access.professor);
 await p.locator('button[data-difficulty="medium"]').tap();await p.locator('#start-choose').tap();await p.locator('[data-tour="cinematic"]').click();await p.locator('.garden-route-choice').filter({hasText:'Cinematic epic'}).click();await p.waitForFunction(()=>gardenFlight.snapshot().mission.running);
 await p.evaluate(()=>{
  gardenFlight.advanceChord();
  const first=gardenFlight.snapshot().mission.current;
  for(let i=0;i<3;i++)document.querySelector(`[data-degree="${(first.offset+1)%12}"]`).click();
  const total=gardenFlight.snapshot().mission.exercise.sequence.length;
  for(let i=0;i<total;i++){
   if(gardenFlight.snapshot().mission.cursor!==i)gardenFlight.advanceChord();
   const m=gardenFlight.snapshot().mission,q=({m:'min',m9:'m7natural9','m7♭5':'m7b5'})[m.current.quality]??m.current.quality;
   document.querySelector(`[data-degree="${m.current.offset}"]`).click();document.querySelector(`[data-quality="${q}"]`).click();
  }
 });
 await p.locator('#mission-complete').waitFor({state:'visible'});let s=await p.evaluate(()=>gardenFlight.snapshot());assert(s.mission.complete&&s.access.allAccess&&s.access.hard&&s.access.professor);assert(await p.locator('button[data-difficulty="guru"]').isDisabled());
 await p.locator('#completion-rating-summary').click();assert.match(await p.locator('#completion-rating-detail').innerText(),/Этот полёт: 3\/5/);assert.match(await p.locator('#completion-title').innerText(),/Тайный проход/);const stored=await p.evaluate(()=>JSON.parse(localStorage.getItem('ear-yoga-route-stars.v1')));assert.equal(stored['cinematic-epic-13'].stars,3);await p.screenshot({path:out+'/epic-three-star-passage.png'});
 await p.reload();await p.waitForFunction(()=>gardenFlight.snapshot().ready);assert((await p.evaluate(()=>gardenFlight.snapshot())).access.allAccess);assert.equal(await p.locator('button[data-difficulty="professor"]').getAttribute('aria-disabled'),'false');await p.screenshot({path:out+'/unlocked-after-reload.png'});await c.close();
 for(const [name,best,expected] of [['old-epic-three',{'cinematic-epic-13':{stars:3}},true],['old-epic-two',{'cinematic-epic-13':{stars:2}},false],['other-route-five',{'cinematic-triumph':{stars:5}},false]]){
  const context=await b.newContext({viewport:{width:390,height:844},locale:'ru-RU',isMobile:true,hasTouch:true,serviceWorkers:'block'});await context.addInitScript(best=>localStorage.setItem('ear-yoga-route-stars.v1',JSON.stringify(best)),best);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base.href);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);const state=await page.evaluate(()=>gardenFlight.snapshot());assert.equal(state.access.allAccess,expected,name);assert.equal(state.access.professor,expected,name);assert(await page.locator('button[data-difficulty="guru"]').isDisabled());assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('ear-yoga-route-stars.v1'))),best,'stored grade preserved');await context.close();
 }
 assert.deepEqual(errors,[]);console.log('Epic passage browser PASS: actual85.7%/3-star completion unlocks Navigator and Master, persists after reload; saved3-star result recovers without another flight;2stars/unrelated routes remain locked; Guru reserved. '+out);
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
