const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');

const chrome=process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function serve(root){
  const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.wav':'audio/wav','.mp3':'audio/mpeg'};
  const server=http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const relative=pathname==='/'?'index.html':pathname.replace(/^\//,'');
    const file=path.resolve(root,relative);
    if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){
      response.writeHead(404);response.end('Not found');return;
    }
    response.setHeader('content-type',types[path.extname(file).toLowerCase()]||'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  });
  return new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve({server,base:`http://127.0.0.1:${server.address().port}/`})));
}

async function mobilePage(browser,planet='original',errors=[]){
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(value=>localStorage.setItem('ear-reharm-game.planet.v1',value),planet);
  return page;
}

(async()=>{
  const root=path.resolve(__dirname,'../dist');
  assert.ok(fs.existsSync(path.join(root,'index.html')),'Run game/tools/build.mjs before the mobile browser audit');
  const {server,base}=await serve(root);
  const browser=await chromium.launch({headless:true,executablePath:chrome});
  const errors=[];
  try{
    const original=await mobilePage(browser,'original',errors);
    await original.goto(base,{waitUntil:'networkidle'});
    try{await original.waitForFunction(()=>window.earGame,{timeout:10000});}
    catch(error){console.error('Startup diagnostics',errors,await original.locator('#startup-error').textContent());throw error;}
    assert.equal(await original.locator('.world-planet').count(),3,'three released worlds must be in the carousel');
    assert.equal(await original.locator('.world-marker').count(),3);
    assert.deepEqual(await original.locator('.world-planet img').evaluateAll(images=>images.map(image=>image.naturalWidth>0)),[true,true,true]);
    assert.equal(await original.locator('#world-selector').getAttribute('class'),'world-selector-shell observatory');
    await original.locator('[data-world-frame="cockpit"]').click();
    assert.equal(await original.locator('#world-selector').evaluate(node=>node.classList.contains('observatory')),false);
    assert.ok(await original.locator('.world-brand').evaluate(node=>node.getBoundingClientRect().top<45),'wordmark stays high above the galaxy');
    assert.ok(await original.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'carousel has no horizontal overflow');
    await original.locator('#world-enter').click();
    await original.waitForSelector('.console-scene');
    assert.deepEqual(await original.locator('.machine-rail').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).display)),['none','none'],'old cabinet side rails stay absent in the first world');
    await original.screenshot({path:'/private/tmp/space-college-087-original-mobile.png',fullPage:true});

    const garden=await mobilePage(browser,'garden',errors);
    await garden.goto(base,{waitUntil:'networkidle'});
    await garden.waitForFunction(()=>window.earGame);
    await garden.locator('#world-enter').click();
    await garden.waitForURL(/garden-flight\.html/);
    await garden.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
    await garden.locator('#start-random').click();
    await garden.waitForFunction(()=>!document.querySelector('#garden-start').hidden);
    await garden.waitForFunction(()=>getComputedStyle(document.querySelector('#garden-start')).display==='none');
    assert.equal((await garden.evaluate(()=>gardenFlight.snapshot())).speed,2);
    assert.equal((await garden.evaluate(()=>gardenFlight.snapshot())).altitude,1.25);
    assert.equal(await garden.locator('.route-node').count(),(await garden.evaluate(()=>gardenFlight.snapshot().mission.exercise.sequence.length)));
    assert.equal(await garden.locator('.route-node em').first().textContent(),'1','the circle keeps the position number');
    assert.equal(await garden.locator('.route-copy b').count(),await garden.locator('.route-node').count(),'functional chord labels stay outside the circles');
    assert.match(await garden.locator('#mission-source').textContent(),/\S+/,'route source is visible');
    await garden.locator('#route-favorite').click();
    assert.equal(await garden.locator('#route-favorite').getAttribute('aria-pressed'),'true');
    await garden.locator('#world-controls').click();
    assert.equal(await garden.locator('.tour-orbit [data-tour]').count(),10);
    assert.equal(await garden.locator('#chapter-orbit button').count(),16);
    const tourRows=await garden.locator('.tour-orbit [data-tour]').evaluateAll(nodes=>nodes.map(node=>node.offsetTop));
    assert.equal(new Set(tourRows).size,2,'tour mandalas use two stable rows');
    assert.equal(tourRows[0],tourRows[4]);assert.notEqual(tourRows[4],tourRows[5]);assert.equal(tourRows[5],tourRows[9]);
    const chapterRows=await garden.locator('#chapter-orbit button').evaluateAll(nodes=>nodes.map(node=>node.offsetTop));
    assert.equal(new Set(chapterRows).size,2,'sixteen chapters use two stable rows');
    assert.equal(chapterRows[0],chapterRows[7]);assert.notEqual(chapterRows[7],chapterRows[8]);assert.equal(chapterRows[8],chapterRows[15]);
    assert.ok(await garden.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Garden menu has no horizontal page movement');
    await garden.locator('#menu-close').click();
    const gardenBoxes=await garden.locator('.route-panel,.answers-panel,.degrees-panel,#garden-vitals,#artifact-belt').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));
    for(const box of gardenBoxes)assert.ok(box.left>=-1&&box.right<=391&&box.top>=-1&&box.bottom<=845,`Garden HUD outside viewport: ${JSON.stringify(box)}`);
    await garden.screenshot({path:'/private/tmp/space-college-087-garden-mobile.png',fullPage:true});

    const samsara=await mobilePage(browser,'samsara',errors);
    await samsara.goto(base,{waitUntil:'networkidle'});
    await samsara.waitForFunction(()=>window.earGame);
    await samsara.locator('#world-enter').click();
    await samsara.getByRole('heading',{name:'Самсара'}).waitFor();
    assert.equal(await samsara.locator('body').evaluate(node=>node.classList.contains('samsara-world')),true);
    assert.equal(await samsara.locator('.samsara-home-flower img').evaluate(image=>image.naturalWidth>0),true);
    await samsara.getByRole('button',{name:/Первый полёт/}).click();
    await samsara.getByRole('button',{name:/Skip.*Сразу в бой/}).waitFor({timeout:20000});
    await samsara.getByRole('button',{name:/Skip.*Сразу в бой/}).click();
    await samsara.waitForFunction(()=>window.earGame.snapshot().mode==='active',{timeout:20000});
    assert.equal(await samsara.locator('.cabinet').evaluate(node=>node.classList.contains('floating-deck')),true);
    assert.equal(await samsara.locator('.cockpit>#samsara-vitals').count(),1,'resource gauges live inside the translucent answer deck');
    assert.equal(await samsara.locator('#samsara-vitals label').count(),4);
    assert.equal(await samsara.locator('#bass-pads .pad').count(),12);
    assert.ok(await samsara.locator('#quality-pads .pad').count()>=4);
    assert.equal((await samsara.evaluate(()=>earGame.snapshot())).samsara.playerShots,0,'the lotus does not shoot');
    const layout=await samsara.evaluate(()=>{const flight=document.querySelector('.flight').getBoundingClientRect(),deck=document.querySelector('.cockpit').getBoundingClientRect();return {flight:flight.height,deck:deck.height,scroll:document.documentElement.scrollWidth,width:innerWidth};});
    assert.ok(layout.flight>500,'Samsara uses the full flight field');
    assert.ok(layout.deck<844*.4,'answer deck remains translucent and compact');
    assert.ok(layout.scroll<=layout.width,'Samsara has no horizontal overflow');
    await samsara.screenshot({path:'/private/tmp/space-college-087-samsara-mobile.png',fullPage:true});

    assert.deepEqual(errors,[]);
    console.log('Mobile worlds passed: carousel, first-world rail cleanup, two-row Garden navigation and full-field Samsara HUD.');
  }finally{
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
