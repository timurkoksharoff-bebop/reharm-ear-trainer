// Native browser regression for mode prerequisites and read-only demo flights.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const requestedBase=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8171/';
const gateURL=new URL(requestedBase);gateURL.searchParams.set('testing','0');const base=gateURL.href;
const out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-mode-access';
fs.mkdirSync(out,{recursive:true});
const storedKeys=['echo-garden-progress.v1','ear-yoga-achievements.v1','ear-yoga-route-stars.v1','ear-yoga-professor-route-stars.v1','ear-yoga-local-records.v1','ear-yoga-mode-access.v1','ear-yoga-professor-teacher.v1'];
(async()=>{
 const {GARDEN_TEACHER_EXAMS,GARDEN_PROFESSOR_EXAMS}=await import(pathToFileURL(path.resolve(__dirname,'../garden-mode-access.mjs')).href);
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const errors=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  const snapshot=()=>page.evaluate(()=>gardenFlight.snapshot());
  const storage=()=>page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),storedKeys);
  const mode=name=>page.locator('.difficulty-picker button[data-difficulty="'+name+'"]');
  assert.equal((await snapshot()).access.testing,false,'testing=0 exercises real player gates');
  assert.equal(await mode('medium').getAttribute('aria-disabled'),'false','Student is directly available');
  assert.equal(await mode('light').getAttribute('aria-disabled'),'false','Applicant is optional');
  assert.equal(await mode('hard').getAttribute('aria-disabled'),'true');
  assert.equal(await mode('professor').getAttribute('aria-disabled'),'true');
  assert(await mode('guru').isDisabled(),'Guru remains reserved');
  await mode('light').click();await mode('medium').click();assert.equal(await page.locator('body').getAttribute('data-difficulty'),'medium');
  for(const name of ['hard','professor']){
   // A locked control uses aria-disabled but deliberately still opens its gate.
   // Force keeps this a physical pointer click instead of a programmatic event.
   await mode(name).click({force:true});await page.locator('#mode-gate').waitFor({state:'visible'});
   assert((await page.locator('#mode-gate').innerText()).includes(name==='hard'?'0/60':'0/18'));
   assert(await page.locator('#mode-gate').getByRole('button',{name:'Посмотреть полёт',exact:true}).isVisible());
   await page.locator('#mode-gate').getByRole('button',{name:'Закрыть',exact:true}).click();
  }
  const before=await storage();
  await mode('hard').click({force:true});await page.locator('#mode-gate').getByRole('button',{name:'Посмотреть полёт',exact:true}).click();
  await page.waitForFunction(()=>gardenFlight.snapshot().demo?.active&&gardenFlight.snapshot().mission.running);
  assert(await page.locator('#mode-demo').isVisible());
  assert.match(await page.locator('#mode-demo').innerText(),/прогресс не сохраняется|без сохранения прогресса/);
  assert.equal((await snapshot()).demo.difficulty,'hard');
  assert.equal((await snapshot()).mission.separateBass,true);
  assert((await snapshot()).demo.remaining<=42);
  // Sample real autopilot answers, including a slash chord's independent BASS.
  await page.evaluate(()=>{window.__demoQA=[];window.__demoQATimer=setInterval(()=>{const s=gardenFlight.snapshot(),m=s.mission;window.__demoQA.push({cursor:m.cursor,degree:!!m.currentParts?.degree,quality:!!m.currentParts?.quality,bass:!!m.currentParts?.bass,slash:m.current&&Number(m.current.offset)!==Number(m.current.bassOffset??m.current.offset)});},80);});
  await page.waitForFunction(()=>window.__demoQA.some(s=>s.slash&&s.degree&&s.quality&&s.bass),{},{timeout:24000});
  const observed=await page.evaluate(()=>{clearInterval(window.__demoQATimer);return window.__demoQA;});
  assert(observed.some(s=>s.degree),'autopilot answers ROOT');assert(observed.some(s=>s.quality),'autopilot answers quality');assert(observed.some(s=>s.slash&&s.bass),'autopilot answers independent BASS');
  assert((await snapshot()).lastTension,'demo catches at least one flying tone');
  // Pause allows a stable control check: player keys/clicks cannot answer,
  // steer, navigate or open another screen while demo playback is suspended.
  await page.locator('#mission-toggle').click();await page.waitForFunction(()=>gardenFlight.snapshot().paused);
  const paused=await snapshot();await page.keyboard.down('ArrowLeft');await page.keyboard.down('KeyW');await page.mouse.click(4,350);await page.keyboard.up('ArrowLeft');await page.keyboard.up('KeyW');
  await page.locator('[data-degree]').first().click({force:true});await page.waitForTimeout(120);
  const afterInput=await snapshot();assert.equal(afterInput.keys,0);assert.equal(afterInput.x,paused.x);assert.equal(afterInput.y,paused.y);assert.equal(afterInput.mission.cursor,paused.mission.cursor);assert.deepEqual(afterInput.mission.currentParts,paused.mission.currentParts);assert.equal(afterInput.demo.time,paused.demo.time);
  for(const [width,height]of [[390,844],[820,1180],[844,390]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(80);
   const box=await page.locator('#mode-demo').boundingBox();assert(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1,'demo HUD fits '+width+'×'+height);
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'teacher-demo.png')});
  await page.locator('#mode-demo [data-demo-exit]').click();await page.waitForFunction(()=>!gardenFlight.snapshot().demo?.active);
  assert(await page.locator('#garden-start').isVisible());assert.equal(await page.locator('body').getAttribute('data-difficulty'),'medium');
  assert.deepEqual(await storage(),before,'demo cannot change progress, awards, ratings, access or adaptive teacher data');
  assert(!(await snapshot()).access.hard&&!(await snapshot()).access.professor,'watching a demo grants no mode access');
  // Professor has its own view-only demo, including actual mode auditions.
  await mode('professor').click({force:true});await page.locator('#mode-gate').getByRole('button',{name:'Посмотреть полёт',exact:true}).click();
  await page.waitForFunction(()=>gardenFlight.snapshot().demo?.active&&gardenFlight.snapshot().modes.last?.kind==='mode',{},{timeout:16000});
  assert.equal((await snapshot()).demo.difficulty,'professor');assert((await snapshot()).lastModePreview?.notes.length>=2,'Professor demo audibly schedules a scale');
  await page.waitForFunction(()=>!gardenFlight.snapshot().demo?.active,{},{timeout:85000});
  assert((await snapshot()).demo.time>=42,'Professor demo automatically returns after42 playbackseconds');
  assert(await page.locator('#garden-start').isVisible());
  assert.deepEqual(await storage(),before,'Professor demo cannot write learner statistics even after completing its route');
  await context.close();

  // Existing independent achievement flights retain their true mode and can
  // migrate, unlike the old mixed-mode route stars/completed-route list.
  const flight=(route,difficulty)=>({route,difficulty,key:0,date:'2026-10-23',accuracy:1,laps:1,independent:true,ratingCap:5,seventh:true,complex:false,bass:difficulty==='hard',tones:0,toneAttempts:0,toneAccuracy:0});
  for(const [label,flights,teacherOpen,professorOpen]of [
   ['student-proof',GARDEN_TEACHER_EXAMS.map(id=>flight(id,'medium')),true,false],
   ['teacher-bass-proof',[...GARDEN_TEACHER_EXAMS.map(id=>flight(id,'medium')),...GARDEN_PROFESSOR_EXAMS.map(id=>flight(id,'hard'))],true,true]
  ]){
   const c=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'});
   await c.addInitScript(f=>localStorage.setItem('ear-yoga-achievements.v1',JSON.stringify({version:1,flights:f,earned:{},mandalas:{}})),flights);
   const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
   const s=await p.evaluate(()=>gardenFlight.snapshot());assert.equal(s.access.hard,teacherOpen,label);assert.equal(s.access.professor,professorOpen,label);assert.equal(s.access.allAccess,false,'migration is not the secret bypass');
   assert.equal(await p.locator('[data-difficulty="hard"]').getAttribute('aria-disabled'),'false');
   assert.equal(await p.locator('[data-difficulty="professor"]').getAttribute('aria-disabled'),String(!professorOpen));await c.close();
  }
  // Local desktop testing is an ephemeral convenience, not a permanent pass.
  for(const flag of [null,'1']){
   const c=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'});
   const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));const u=new URL(requestedBase);u.searchParams.delete('testing');if(flag)u.searchParams.set('testing',flag);
   await p.goto(u.href);await p.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
   const s=await p.evaluate(()=>gardenFlight.snapshot());assert.equal(s.access.testing,true,'fine-pointer local default and testing=1 both enable development access');assert(s.access.hard&&s.access.professor);assert.equal(s.access.allAccess,false);assert.equal(s.access.teacherDone,0);assert.equal(s.access.professorDone,0);
   assert.equal(await p.locator('[data-difficulty="hard"]').getAttribute('aria-disabled'),'false');assert.equal(await p.locator('[data-difficulty="professor"]').getAttribute('aria-disabled'),'false');assert(await p.locator('#local-testing-note').isVisible());
   const data=await p.evaluate(()=>JSON.parse(localStorage.getItem('ear-yoga-mode-access.v1')));assert.equal(data.allAccess,false);assert(!('testing'in data));assert.deepEqual(data.medium,[]);assert.deepEqual(data.hard,[]);
   await p.goto(base);await p.waitForFunction(()=>window.gardenFlight?.snapshot().ready);const normal=await p.evaluate(()=>gardenFlight.snapshot());assert.equal(normal.access.testing,false);assert(!normal.access.hard&&!normal.access.professor,'same stored profile has real gates after testing=0');await c.close();
  }
  // An ordinary coarse-pointer/mobile local profile keeps progression gates.
  {const c=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block',isMobile:true,hasTouch:true});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));const u=new URL(requestedBase);u.searchParams.delete('testing');await p.goto(u.href);await p.waitForFunction(()=>window.gardenFlight?.snapshot().ready);const s=await p.evaluate(()=>gardenFlight.snapshot());assert.equal(s.access.testing,false,'mobile local default does not get development access');assert(!s.access.hard&&!s.access.professor);await c.close();}
  // Mirror the local build at a non-loopback origin without contacting that
  // hostname: even an explicit testing=1 query must not unlock a public site.
  {const c=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'});await c.route('https://ear-yoga.public.test/**',async route=>{const u=new URL(route.request().url()),local=new URL(u.pathname+u.search,new URL(requestedBase).origin);const response=await route.fetch({url:local.href});await route.fulfill({response});});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('https://ear-yoga.public.test/?testing=1');await p.waitForFunction(()=>window.gardenFlight?.snapshot().ready);const s=await p.evaluate(()=>gardenFlight.snapshot());assert.equal(s.access.testing,false,'public origin cannot opt into local testing');assert(!s.access.hard&&!s.access.professor);await c.close();}
  assert.deepEqual(errors,[],'browser runtime errors');
  console.log('PASS mode access: Student direct / Teacher60 and Professor18 locked / Guru reserved; native gate previews; real ROOT/quality/slash BASS and tone/mode autopilot; blocked controls; HUD3viewports; 42second automaticreturn; zero persistent demo writes even at route completion; independent historic-flight migration; local desktop tester access without saved unlock; testing=0 and mobile retain normal gates. '+out);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
