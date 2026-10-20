// A pixel regression for the reported iPad/phone rectangles. The actual outside
// corners must stay unchanged during a press and when Student is deselected.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),sharp=require('sharp'),{chromium}=require('playwright');
const out=process.env.GARDEN_QA_DIR||'/private/tmp/ear-yoga-138-material';fs.mkdirSync(out,{recursive:true});
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8138/';
async function pixels(buffer){return sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});}
function corners(box){return [[.04,.05],[.96,.05],[.04,.95],[.96,.95]].map(([x,y])=>[Math.round(box.x+box.width*x),Math.round(box.y+box.height*y)]);}
async function unchanged(before,after,points,label){const a=await pixels(before),b=await pixels(after);for(const [x,y] of points){let delta=0;const i=(y*a.info.width+x)*4;for(let c=0;c<3;c++)delta=Math.max(delta,Math.abs(a.data[i+c]-b.data[i+c]));assert(delta<=3,`${label}: exterior background changed at ${x},${y} by ${delta}`);}}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  for(const lang of ['ru','en'])for(const viewport of [{width:820,height:1180},{width:390,height:844}]){
   const context=await browser.newContext({viewport,locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
   await page.goto(base);await page.waitForFunction(()=>gardenFlight?.snapshot().ready);if(lang==='en')await page.locator('#start-language').click();
   await page.addStyleTag({content:'#garden-start *,#garden-start *::before,#garden-start *::after{animation-play-state:paused!important;transition:none!important}'});
   const primary=page.locator('#start-random'),secondary=page.locator('#start-choose');
   for(const [name,button] of [['ivory',primary],['ceramic',secondary]]){
    const box=await button.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
    const before=await page.screenshot();await page.mouse.down();const pressed=await page.screenshot({path:path.join(out,`${lang}-${viewport.width}-${name}-pressed.png`)});
    await unchanged(before,pressed,corners(box),name+' press');
    await page.mouse.move(0,0);await page.mouse.up();assert(await page.locator('#garden-start').isVisible(),'cancelled press must not start a flight');
   }
   const medium=page.locator('button[data-difficulty="medium"]');await medium.focus();assert.equal(await medium.evaluate(el=>getComputedStyle(el).outlineStyle),'none','keyboard focus must follow the leaf, not a rectangle');
   for(const mode of ['light','medium','hard']){await page.locator('button[data-difficulty="'+mode+'"]').click();await page.locator('button[data-difficulty="'+(mode==='light'?'hard':'light')+'"]').hover();const lights=await page.locator('.difficulty-picker button').evaluateAll(els=>els.map(el=>({selected:el.getAttribute('aria-pressed')==='true',opacity:Number(getComputedStyle(el.querySelector('.pearl-light')).opacity)})));assert.equal(lights.filter(l=>l.opacity>0).length,1,'exactly one mode shines, including hover');assert(lights.every(l=>l.selected||l.opacity===0),'unselected mode shines');}
   await medium.click();
   const student=await page.locator('button[data-difficulty="medium"]').boundingBox(),before=await page.screenshot();
   await page.locator('button[data-difficulty="light"]').click();const after=await page.screenshot({path:path.join(out,`${lang}-${viewport.width}-applicant.png`)});
   await unchanged(before,after,corners(student),'Student deselection');
   assert.equal(await page.locator('button[data-difficulty="light"]').getAttribute('aria-pressed'),'true');
   await page.locator('button[data-difficulty="medium"]').click();await page.screenshot({path:path.join(out,`${lang}-${viewport.width}-menu.png`)});
   const settings=page.locator('#start-menu');assert(await settings.isVisible(),'Settings action missing');
   assert.equal((await settings.getAttribute('aria-label')).trim(),lang==='en'?'Settings':'Настройки');
   await settings.click();assert.equal(await page.locator('#garden-menu').getAttribute('data-view'),'settings');
   assert(!(await page.locator('.garden-route-layout').isVisible()),'Settings must not show route selection');
   assert(await page.locator('.sound-switch').isVisible());assert(await page.locator('#garden-volume').isVisible());assert(await page.locator('#garden-eq-low').isVisible());
   await page.locator('[data-pad="hybrid"]').click();assert.equal(await page.locator('[data-pad="hybrid"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-pad="felt"]').click();
   const volume=page.locator('#garden-volume'),initial=Number(await volume.inputValue());await volume.focus();await page.keyboard.press('ArrowRight');assert.equal(Number(await volume.inputValue()),initial+5,'direct settings volume is not wired');
   assert(!(await page.evaluate(()=>gardenFlight.snapshot().mission.running)),'opening sound settings started the flight');
   await page.locator('#menu-close').click();await page.locator('#garden-start').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>document.activeElement.id),'start-menu');
   await secondary.click();await page.locator('#garden-route-list').waitFor({state:'visible'});
   assert.deepEqual(errors,[]);await context.close();
  }
  const reference=await browser.newPage({viewport:{width:863,height:1823},locale:'ru-RU',serviceWorkers:'block'});
  await reference.goto(base);await reference.waitForFunction(()=>gardenFlight?.snapshot().ready);
  await reference.addStyleTag({content:'#garden-start *,#garden-start *::before,#garden-start *::after{animation-play-state:paused!important;transition:none!important}'});
  const route=reference.locator('#start-choose'),box=await route.boundingBox();
  const painted=await reference.screenshot();
  await reference.addStyleTag({content:'#garden-start #start-choose :is(.porcelain-body,.pearl-light,.reference-ink){display:none!important}'});
  const frame=await reference.screenshot();
  await unchanged(frame,painted,[[69,56],[706,56]].map(([x,y])=>[Math.round(box.x+x*box.width/775),Math.round(box.y+y*box.height/124)]),'gold tip must remain uncovered by ceramic');
  await reference.close();
  console.log('PASS: RU/EN exterior pixels unchanged during ivory/ceramic presses and Student deselection; no rectangular focus; exactly one mode shines even on hover at iPad/phone viewport sizes; settings opens instruments/EQ directly and returns focus; route button still opens routes. Desktop Chromium, not physical iOS.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
