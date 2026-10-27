const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8190/preview-1.82.html';
const out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-phrase-position';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const c=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',hasTouch:true,isMobile:true,serviceWorkers:'block'});
 await c.addInitScript(()=>{localStorage.setItem('ear-yoga-mode-access.v1',JSON.stringify({version:1,allAccess:true,medium:[],hard:[]}));localStorage.setItem('ear-yoga-guide.v2','1');localStorage.setItem('ear-yoga-professor-teacher.v1',JSON.stringify({version:1,preflight:false}));});
 const page=await c.newPage(),errors=[],report={};page.on('pageerror',error=>errors.push(error.message));
 const url=new URL(base);url.searchParams.set('routes','classic');const snap=()=>page.evaluate(()=>gardenFlight.snapshot());
 const launch=async mode=>{await page.locator('[data-difficulty="'+mode+'"]').click();await page.locator('#start-choose').click();await page.locator('#garden-route-list .garden-route-choice').filter({hasText:/1\.15/}).click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);};
 const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
 const rect=selector=>page.locator(selector).boundingBox();
 const lotus=page.locator('.flight-tools summary'),toggle=page.locator('.live-phrase-toggle'),panel=page.locator('#live-phrase-panel');
 await page.goto(url.href);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);await launch('professor');await toggle.waitFor({state:'visible'});
 assert.equal(await toggle.textContent(),'','entry is an icon, without a visible text label');assert.equal(await toggle.locator('svg').count(),1);assert((await toggle.getAttribute('aria-label')).includes('Звучание'));
 assert.equal(await page.locator('#live-phrase-controls').evaluate(e=>e.parentElement.id),'harmony-hud','entry shares the transport HUD');
 for(const size of [{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1440,height:900}]){
  await page.setViewportSize(size);await page.waitForTimeout(100);
  const entry=await toggle.boundingBox(),pause=await rect('#mission-toggle'),home=await rect('#garden-home'),menu=await rect('#world-controls'),inventory=await lotus.boundingBox();
  const readouts=await page.locator('.run-readout>span').evaluateAll(elements=>elements.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};}));
  assert.equal(entry.width,44);assert.equal(entry.height,44);assert(entry.x>=0&&entry.y>=0&&entry.x+entry.width<=size.width&&entry.y+entry.height<=size.height);
  assert(Math.abs(entry.y+entry.height/2-pause.y-pause.height/2)<=1,'icon and Pause share the same visual centre');
  assert(entry.x+entry.width<=pause.x-3,'icon is immediately left of Pause, with a real gap');
  for(const other of [pause,home,menu,inventory])assert(!overlap(entry,other),'phrase entry never covers another control');
  for(const readout of readouts)assert(!overlap(entry,readout),'time/score overlap '+JSON.stringify({size,entry,readout}));
  assert(await toggle.evaluate(e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('.live-phrase-toggle')===e;}),'icon is the actual pointer target');
  assert(await lotus.evaluate(e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('.flight-tools summary')===e;}),'Lotus remains the actual pointer target');
  await lotus.click();assert.equal(await page.locator('.flight-tools').evaluate(e=>e.open),true,'real Lotus click opens inventory');assert(await page.locator('.flight-tools-body').isVisible());await page.screenshot({path:out+'/phrase-header-lotus-open-'+size.width+'.png'});if(size.width===390)await page.screenshot({path:out+'/phrase-header-detail-390.png',clip:{x:0,y:0,width:390,height:260}});await lotus.click();
  await toggle.click();assert(await panel.isVisible());assert.equal((await snap()).mission.running,true,'opening sound panel does not pause');
  const bounds=await panel.boundingBox();assert(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=size.width+1&&bounds.y+bounds.height<=size.height+1,'panel stays in the viewport');
  await page.locator('#live-phrase-preset').focus();await page.keyboard.press('Escape');assert(await panel.isHidden());assert(await toggle.evaluate(e=>document.activeElement===e),'Escape returns focus to the icon');assert.equal((await snap()).keys,0,'panel keyboard is not steering');
  report[size.width]={entry,pause,readouts,lotus:inventory,panel:bounds};await page.screenshot({path:out+'/phrase-header-'+size.width+'.png'});
 }
 await page.setViewportSize({width:390,height:844});await page.locator('#mission-toggle').click();assert.equal((await snap()).mission.running,false);await toggle.click();assert(await panel.isVisible());assert.equal((await snap()).mission.running,false,'sound controls do not resume a paused flight');await page.locator('.live-phrase-close').click();await page.locator('#mission-toggle').click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
 for(const mode of ['medium','hard']){await page.evaluate(()=>gardenFlight.showMenu());await launch(mode);await page.waitForFunction(()=>document.querySelector('#live-phrase-controls').hidden);assert(await toggle.isHidden(),'Captain-only entry stays hidden in '+mode);await lotus.click();assert.equal(await page.locator('.flight-tools').evaluate(e=>e.open),true);await lotus.click();assert(await page.locator('#mission-toggle').isVisible());}
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));console.log('Phrase position browser PASS: icon-only44px entry beside Pause,320/390/844/1440 bounds, real Lotus clicks, no control overlap, panel/Escape/focus, pause/resume and Pilot/Navigator absence. Desktop emulation only.');await c.close();
 }finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
