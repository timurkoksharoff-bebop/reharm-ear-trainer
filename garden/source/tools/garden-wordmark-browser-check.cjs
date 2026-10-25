const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8157/';
const out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-wordmark-157';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const url=new URL(base);await page.goto(url.href);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  await page.evaluate(()=>Promise.all([document.fonts.load('31.6px Cormorant','EAR YOGA'),document.fonts.load('8.02px Forum','SPACE MUSIC COLLEGE')]));
  await page.locator('#start-choose').click();await page.waitForSelector('#journey-map[open]');
  const map=page.frameLocator('#journey-map iframe');await map.locator('.garden-wordmark-v3').waitFor();
  await map.locator('.garden-wordmark-v3').evaluate(()=>Promise.all([document.fonts.load('31.6px Cormorant','EAR YOGA'),document.fonts.load('8.02px Forum','SPACE MUSIC COLLEGE')]));
  const mapMark=await map.locator('.garden-wordmark-v3').evaluate(svg=>svg.outerHTML);
  assert.equal(await map.locator('.journey-brand-lotus').count(),0,'map has no independently positioned lotus');
  for(const mark of await page.locator('.shared-brand-slot .garden-wordmark-v3').all())assert.equal(await mark.evaluate(svg=>svg.outerHTML),mapMark,'loading/trial/enrollment/header share the same mark');
  for(const [width,height] of [[320,568],[390,844],[820,1180],[844,390]]){
   await page.setViewportSize({width,height});
   const box=await map.locator('.brand').boundingBox();assert(box.x>=0&&box.x+box.width<=width,'map wordmark fits '+width);
   assert(await map.locator('.garden-wordmark-v3 svg').isVisible(),'lotus stays attached and visible '+width);
   await page.screenshot({path:out+'/map-brand-'+width+'.png'});
  }
  await page.setViewportSize({width:390,height:844});await map.locator('#universe-home').click();
  await page.locator('#start-tutorial').click();await page.waitForSelector('#flight-tutorial:not([hidden])');
  assert(await page.locator('#flight-tutorial .garden-wordmark-v3').isVisible(),'field guide uses approved wordmark');
  assert.equal(await page.locator('#flight-tutorial .garden-wordmark-v3').evaluate(svg=>svg.outerHTML),mapMark,'map and guide use identical logo geometry');
  await page.screenshot({path:out+'/guide-brand.png'});await page.locator('#tutorial-close').click();
  await page.locator('#start-menu').click();
  assert.equal(await page.locator('#garden-menu-eyebrow .garden-wordmark-v3').evaluate(svg=>svg.outerHTML),mapMark,'settings use the same mark');
  await page.locator('#skill-atlas-open').click();await page.locator('#garden-skill-atlas').waitFor({state:'visible'});
  assert.equal(await page.locator('.skill-atlas-brand .garden-wordmark-v3').evaluate(svg=>svg.outerHTML),mapMark,'skill orbit uses the same mark');
  await page.screenshot({path:out+'/skill-orbit-brand.png'});await page.locator('.skill-atlas-close').click();
  await page.locator('#garden-menu [data-open-achievements]').click();await page.waitForSelector('#achievements-board[open]');
  assert(await page.locator('.achievements-header .garden-wordmark-v3').isVisible(),'achievements uses approved wordmark');assert.equal(await page.locator('.achievements-header .garden-wordmark-v3').getAttribute('data-brand-variant'),'3');
  assert.equal(await page.locator('.achievements-header img[src$="ear-yoga-wordmark.svg"]').count(),0,'old image removed');
  assert.equal(await page.locator('.achievements-header .garden-wordmark-v3').evaluate(svg=>svg.outerHTML),mapMark,'map and achievements use identical logo geometry');
  for(const [width,height] of [[320,568],[390,844],[820,1180]]){
   await page.setViewportSize({width,height});
   const logo=await page.locator('.achievements-header .garden-wordmark-v3').evaluate(svg=>{const texts=[...svg.querySelectorAll('text')],r=svg.getBoundingClientRect(),ctx=document.createElement('canvas').getContext('2d');return{width:r.width,left:r.left,right:r.right,paths:svg.querySelectorAll('path').length,lines:texts.map(t=>{const style=getComputedStyle(t),tracking=parseFloat(style.letterSpacing)||0;ctx.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;const metric=ctx.measureText(t.textContent),scale=t.getComputedTextLength()/(metric.width+tracking*t.textContent.length),x=Number(t.getAttribute('x'));return{text:t.textContent,font:style.fontFamily,ink:{left:x-metric.actualBoundingBoxLeft*scale,right:x+(metric.actualBoundingBoxRight+tracking*(t.textContent.length-1))*scale}};})};});
   assert.equal(logo.paths,3,'same five-petal path artwork');assert(logo.left>=0&&logo.right<=width,'header fits');assert(logo.width>120);
   assert.deepEqual(logo.lines.map(l=>l.text),['EAR YOGA','SPACE MUSIC COLLEGE']);assert.match(logo.lines[0].font,/Cormorant/);assert.match(logo.lines[1].font,/Forum/);
   assert(Math.abs(logo.lines[0].ink.left-logo.lines[1].ink.left)<.5,'left visible glyph edges align');assert(Math.abs(logo.lines[0].ink.right-logo.lines[1].ink.right)<.5,'right visible glyph edges align');
   await page.screenshot({path:out+'/achievements-brand-'+width+'.png'});
  }
  assert.deepEqual(errors,[]);console.log('Approved wordmark PASS: Journey/achievements/guide/settings/skill orbit/loading/trial/enrollment, attached visible Lotus in portrait/landscape, original5petal paths, Cormorant+Forum uppercase, equal text edges,3widths. '+out);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
