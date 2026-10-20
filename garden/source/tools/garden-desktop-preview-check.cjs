const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8138/';
const out=process.env.GARDEN_QA_DIR||'/private/tmp/ear-yoga-137-qa';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900},locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('#build-version').innerText(),'v'+await page.evaluate(()=>window.GARDEN_VERSION));
  for(const [width,height] of [[320,568],[375,667],[390,692],[390,844],[430,932],[600,1024],[768,1024],[1440,900],[844,390]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(220);
   const geometry=await page.evaluate(()=>{
    const box=s=>document.querySelector(s).getBoundingClientRect().toJSON();
    return {difficulty:box('.difficulty-picker'),primary:box('#start-random'),secondary:box('#start-choose'),footer:box('#start-tutorial'),brand:box('.ear-yoga-lockup'),controls:[...document.querySelectorAll('#garden-start button,#garden-start summary')].filter(el=>el.getClientRects().length).map(el=>({name:el.id||el.innerText,box:el.getBoundingClientRect().toJSON()}))};
   });
   const where=width+'x'+height;
   assert(geometry.difficulty.bottom<=geometry.primary.top+1,'difficulty overlaps primary at '+where+': '+JSON.stringify(geometry));
   assert(geometry.primary.bottom<=geometry.secondary.top+1,'action buttons overlap at '+where);
   assert(geometry.secondary.bottom<=geometry.footer.top+1,'footer overlaps actions at '+where);
   for(const control of geometry.controls){const b=control.box;assert(b.x>=0&&b.y>=0&&b.right<=width+1&&(height<600&&width>height||b.bottom<=height+1),'control outside viewport at '+where+': '+control.name);assert(b.height>=18,'touch target too short at '+where+': '+control.name);}
   if([390,1440,844].includes(width))await page.screenshot({path:path.join(out,'menu-'+where+'.png')});
  }
  await page.setViewportSize({width:1440,height:900});
  await page.locator('#start-language').click();await page.waitForFunction(()=>document.documentElement.lang==='en');assert.match(await page.locator('#start-random strong').innerText(),/Start flight/);
  await page.locator('#start-language').click();await page.waitForFunction(()=>document.documentElement.lang==='ru');
  const primary=page.locator('#start-random');await primary.hover();await page.waitForTimeout(200);
  const normal=await primary.evaluate(el=>getComputedStyle(el).transform);await page.mouse.down();await page.waitForTimeout(180);
  const pressed=await primary.evaluate(el=>getComputedStyle(el).transform);assert.notEqual(pressed,normal,'button has no press feedback');
  await page.screenshot({path:path.join(out,'menu-pressed.png')});await page.mouse.move(0,0);await page.mouse.up();
  assert(await page.locator('#garden-start').isVisible(),'drag away should cancel activation');
  const shimmer=await page.locator('[data-difficulty="medium"] .pearl-light').evaluate(el=>({animation:getComputedStyle(el,'::before').animationName,opacity:getComputedStyle(el).opacity}));
  assert.equal(shimmer.animation,'pearl-sweep');assert(Number(shimmer.opacity)>0,'selected mode shimmers continuously');
  const results=[];
  for(const mode of ['medium','hard','light']){
   if(!(await page.locator('#garden-start').isVisible()))await page.evaluate(()=>gardenFlight.showMenu());
   await page.locator('[data-difficulty="'+mode+'"]').click();await page.locator('#start-random').click();
   await page.waitForFunction(()=>earYoga.guide().active||gardenFlight.snapshot().mission.running);
   if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();
   await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);await page.waitForTimeout(250);
   const start=await page.evaluate(()=>({s:gardenFlight.snapshot(),at:performance.now()}));
   const bar=start.s.mission.barSeconds;assert(Math.abs(bar-(mode==='hard'?4/1.2:4))<1e-9,'wrong chord duration for '+mode);
   await page.waitForTimeout(1100);
   const end=await page.evaluate(()=>({s:gardenFlight.snapshot(),at:performance.now()}));
   const rate=(end.s.time-start.s.time)/((end.at-start.at)/1000);
   assert(Math.abs(rate-(mode==='hard'?1.2:1))<.12,'wrong world-time pace for '+mode+': '+rate);
   if(mode==='light')assert(Object.values(end.s.life.resources).every(n=>n===100),'Applicant spends reserves');
   results.push({mode,barSeconds:bar,worldRate:Number(rate.toFixed(3))});
   await page.locator('#mission-toggle').click();const paused=await page.evaluate(()=>gardenFlight.snapshot());await page.waitForTimeout(250);const after=await page.evaluate(()=>gardenFlight.snapshot());
   assert.equal(after.time,paused.time,'paused world moved');assert.deepEqual(after.life.resources,paused.life.resources,'paused resources changed');
   await page.evaluate(()=>gardenFlight.showMenu());
  }
  await page.locator('[data-difficulty="medium"]').click();await page.locator('#start-choose').click();await page.locator('#garden-route-list').waitFor({state:'visible'});
  assert.deepEqual(errors,[]);console.log('Desktop preview passed: live menu, 9 viewport layouts, RU/EN, press feedback, real Teacher/Student/Applicant pace and pause. '+JSON.stringify(results));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
