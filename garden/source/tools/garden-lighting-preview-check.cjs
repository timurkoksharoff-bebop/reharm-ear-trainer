const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),sharp=require('sharp'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8138/',out='/private/tmp/ear-yoga-143-lighting';fs.mkdirSync(out,{recursive:true});
async function difference(a,b){const x=await sharp(a).removeAlpha().raw().toBuffer(),y=await sharp(b).removeAlpha().raw().toBuffer();let sum=0;for(let i=0;i<x.length;i++)sum+=Math.abs(x[i]-y[i]);return sum/x.length;}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 for(const lang of ['ru','en'])for(const viewport of [{width:390,height:844},{width:820,height:1180}]){
  const context=await browser.newContext({viewport,locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>gardenFlight?.snapshot().ready);if(lang==='en')await page.locator('#start-language').click();
  await page.locator('#start-menu').click();await page.locator('[data-light="night"]').click();
  assert(await page.locator('#lighting-preview-dock').isVisible());assert(!(await page.locator('#garden-menu').isVisible()),'big settings panel still covers preview');
  const dock=await page.locator('#lighting-preview-dock').boundingBox();assert(dock.height<viewport.height*.4,'lighting dock covers too much of the scene');
  assert.match(await page.locator('#lantern').innerText(),lang==='en'?/Headlight/:/Прожектор/);
  const before=await page.evaluate(()=>gardenFlight.snapshot());assert.equal(before.night,1);assert(!before.mission.running);assert(before.paused);
  const clip={x:0,y:0,width:viewport.width,height:Math.floor(dock.y)-2};
  const lit=await page.screenshot({clip});await page.locator('#lantern').click();await page.waitForTimeout(80);const dark=await page.screenshot({clip});
  assert(await difference(lit,dark)>.6,'Headlight does not visibly illuminate the actual scene');
  await page.locator('[data-light="day"]').click();await page.waitForTimeout(80);const day=await page.screenshot({clip});assert(await difference(day,dark)>3,'day and night are not visibly different');
  await page.locator('[data-light="cycle"]').click();const cycle=await page.evaluate(()=>gardenFlight.snapshot());await page.waitForTimeout(900);const moving=await page.evaluate(()=>gardenFlight.snapshot());
  assert(moving.cycle>cycle.cycle+7,'preview cycle does not animate');assert.equal(moving.time,before.time,'lighting preview advances world/game time');assert.equal(moving.scroll,before.scroll);assert.deepEqual(moving.life.resources,before.life.resources,'lighting preview spends resources');assert(!moving.mission.running);
  await page.locator('#lighting-motion').click();const paused=await page.evaluate(()=>gardenFlight.snapshot());await page.waitForTimeout(250);assert.equal((await page.evaluate(()=>gardenFlight.snapshot())).cycle,paused.cycle,'cycle pause does not pause');
  await page.screenshot({path:path.join(out,`${lang}-${viewport.width}-preview.png`)});
  await page.locator('#lighting-preview-back').click();assert(await page.locator('#garden-menu').isVisible());assert.equal(await page.locator('#garden-menu').getAttribute('data-view'),'settings');assert(!(await page.locator('#lighting-preview-dock').isVisible()));
  await page.locator('#menu-close').click();await page.locator('#start-choose').click();await page.locator('.garden-route-layout').waitFor({state:'visible'});await page.locator('[data-light="dusk"]').click();await page.keyboard.press('Escape');assert(await page.locator('.garden-route-layout').isVisible(),'Escape did not restore routes');await page.locator('#menu-close').click();
  if(lang==='ru'&&viewport.width===390){
   await page.locator('#start-random').click();await page.waitForFunction(()=>earYoga.guide().active||gardenFlight.snapshot().mission.running);if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
   await page.locator('#world-controls').click();await page.locator('[data-light="night"]').click();assert(!(await page.evaluate(()=>gardenFlight.snapshot())).mission.running);await page.locator('#lighting-preview-back').click();assert(!(await page.evaluate(()=>gardenFlight.snapshot())).mission.running);await page.locator('#menu-close').click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: RU/EN lighting preview leaves the real scene visible; Day/Night and Headlight change canvas pixels; cycle play/pause preserves mission, time and resources; settings/routes return correctly and a paused flight resumes only after closing the menu. Desktop Chromium emulation.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
