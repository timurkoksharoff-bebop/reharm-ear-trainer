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
  const url=new URL(base);url.searchParams.set('routes','classic');await page.goto(url.href);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  await page.evaluate(()=>Promise.all([document.fonts.load('31.6px Cormorant','EAR YOGA'),document.fonts.load('8.02px Forum','SPACE MUSIC COLLEGE')]));
  await page.locator('#start-tutorial').click();await page.waitForSelector('#flight-tutorial:not([hidden])');
  assert(await page.locator('#flight-tutorial .garden-wordmark-v3').isVisible(),'field guide uses approved wordmark');
  await page.screenshot({path:out+'/guide-brand.png'});await page.locator('#tutorial-close').click();
  await page.locator('#start-choose').click();await page.locator('#garden-menu [data-open-achievements]').click();await page.waitForSelector('#achievements-board[open]');
  assert(await page.locator('.achievements-header .garden-wordmark-v3').isVisible(),'achievements uses approved wordmark');assert.equal(await page.locator('.achievements-header .garden-wordmark-v3').getAttribute('data-brand-variant'),'3');
  assert.equal(await page.locator('.achievements-header img[src$="ear-yoga-wordmark.svg"]').count(),0,'old image removed');
  for(const [width,height] of [[320,568],[390,844],[820,1180]]){
   await page.setViewportSize({width,height});
   const logo=await page.locator('.achievements-header .garden-wordmark-v3').evaluate(svg=>{const texts=[...svg.querySelectorAll('text')],r=svg.getBoundingClientRect();return{width:r.width,left:r.left,right:r.right,paths:svg.querySelectorAll('path').length,lines:texts.map(t=>({text:t.textContent,font:getComputedStyle(t).fontFamily,x:t.getAttribute('x'),length:Number(t.getAttribute('textLength')),actual:t.getComputedTextLength(),box:{left:t.getBoundingClientRect().left,right:t.getBoundingClientRect().right}}))};});
   assert.equal(logo.paths,3,'same five-petal path artwork');assert(logo.left>=0&&logo.right<=width,'header fits');assert(logo.width>120);
   assert.deepEqual(logo.lines.map(l=>l.text),['EAR YOGA','SPACE MUSIC COLLEGE']);assert.match(logo.lines[0].font,/Cormorant/);assert.match(logo.lines[1].font,/Forum/);
   for(const line of logo.lines){assert.equal(line.x,'0');assert.equal(line.length,194);assert(Math.abs(line.actual-194)<.2);}
   assert(Math.abs(logo.lines[0].box.left-logo.lines[1].box.left)<2,'left ink edges align');assert(Math.abs(logo.lines[0].box.right-logo.lines[1].box.right)<2,'right ink edges align');
   await page.screenshot({path:out+'/achievements-brand-'+width+'.png'});
  }
  assert.deepEqual(errors,[]);console.log('Approved wordmark PASS: achievements/guide, original5petal paths, Cormorant+Forum uppercase, equal text edges,3widths. '+out);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
