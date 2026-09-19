const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const chrome=process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async()=>{
  let server=null,base=process.env.GAME_PREVIEW_URL;
  if(!base){
    const root=path.resolve(__dirname,'../dist');
    server=http.createServer((request,response)=>{
      const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),relative=pathname==='/'?'index.html':pathname.replace(/^\//,'');
      const file=path.resolve(root,relative);
      if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){response.writeHead(404);response.end('Not found');return;}
      response.setHeader('content-type',file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.js')||file.endsWith('.mjs')?'text/javascript':file.endsWith('.webp')?'image/webp':'application/octet-stream');
      fs.createReadStream(file).pipe(response);
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    base=`http://127.0.0.1:${server.address().port}/`;
  }
  const browser=await chromium.launch({headless:true,executablePath:chrome});
  const errors=[];
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    await page.addInitScript(()=>localStorage.setItem('ear-reharm-game.planet.v1','seasons'));
    await page.goto(base);
    await page.waitForFunction(()=>window.earGame);
    assert.equal((await page.evaluate(()=>window.earGame.snapshot())).planet.choice,'original');
    const selectedBox=await page.locator('.console-hit[aria-pressed=true]').first().evaluate((element,scene)=>{const box=element.getBoundingClientRect(),parent=document.querySelector('.console-scene').getBoundingClientRect();return {left:(box.left-parent.left)/parent.width,top:(box.top-parent.top)/parent.height,width:box.width/parent.width};});
    assert(selectedBox.left>.14&&selectedBox.left<.16&&selectedBox.top>.60&&selectedBox.top<.62&&selectedBox.width<.34,'portrait selection outline follows the painted label plate');
    assert.equal(await page.getByRole('button',{name:/Планеты\. Сейчас/}).isVisible(),true);
    if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'console-081.png'),fullPage:true});}
    await page.getByRole('button',{name:/Планеты/}).click();
    assert.equal(await page.locator('.planet-card').count(),6);
    assert.equal(await page.locator('.planet-card:not(:disabled)').count(),2);
    assert.equal(await page.locator('.planet-card:disabled').count(),4);
    await page.locator('.planet-card.garden').click();
    await page.waitForURL(/garden-flight\.html/);
    await page.waitForFunction(()=>window.gardenFlight);
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('#exercise-select option').count(),9);
    assert.equal(await page.locator('.route-panel').isVisible(),true);
    assert.equal(await page.locator('.answers-panel').isVisible(),true);
    assert.equal(await page.locator('.degrees-panel').isVisible(),true);
    assert.equal(await page.locator('[data-hud]').count(),0);
    assert.equal(await page.locator('.route-node').count(),(await page.evaluate(()=>window.gardenFlight.snapshot().mission.exercise.sequence.length)));
    const codes=await page.locator('#exercise-select option').allTextContents();
    assert(codes.every(code=>/^\d{2}F\d{2}$/.test(code)),`compact exercise codes expected, got ${codes.join(', ')}`);
    assert.equal(await page.locator('.back-to-planets').getAttribute('href'),'./');
    if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'garden-081.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    console.log('Mobile planets passed: sticky Garden migration, aligned level outline, visible planet entry, direct Garden route and compact two-part visor.');
  }finally{await browser.close();await new Promise(resolve=>server?server.close(resolve):resolve());}
})().catch(error=>{console.error(error);process.exitCode=1;});
