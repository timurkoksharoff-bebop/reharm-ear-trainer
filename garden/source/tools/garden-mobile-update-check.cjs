// Run with the previous published directory and the new standalone directory.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const [oldRoot,newRoot]=process.argv.slice(2);
if(!oldRoot||!newRoot)throw Error('Provide previous and new absolute release directories.');
(async()=>{
 let root=oldRoot;
 const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.wav':'audio/wav','.woff2':'font/woff2'};
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost'),relative=decodeURIComponent(url.pathname).replace(/^\/+/,''),file=path.resolve(root,relative||'index.html');
  if(!file.startsWith(path.resolve(root)+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,body)=>{if(error){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const oldVersion=JSON.parse(fs.readFileSync(path.join(oldRoot,'release.json'))).version,newVersion=JSON.parse(fs.readFileSync(path.join(newRoot,'release.json'))).version;
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'ru-RU'}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}/?offline-test=1`;
  await page.goto(url);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  assert.equal(await page.locator('#build-version').innerText(),'v'+oldVersion);
  await page.evaluate(async()=>{localStorage.setItem('mobile-update-preservation-probe','keep');await navigator.serviceWorker.ready;});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  root=newRoot;
  await page.evaluate(async()=>{
   const previous=navigator.serviceWorker.controller,registration=await navigator.serviceWorker.getRegistration();
   const changed=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(Error('New service worker did not take control')),20000);
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(navigator.serviceWorker.controller!==previous){clearTimeout(timeout);resolve();}});
   });
   await registration.update();await changed;
  });
  await page.waitForFunction(async version=>(await caches.keys()).some(k=>k.startsWith('echo-garden-'+version+'-')),newVersion);
  // Activation and clients.claim are asynchronous after the precache is created.
  await page.waitForFunction(async version=>{const keys=await caches.keys();return keys.length>0&&keys.filter(k=>k.startsWith('echo-garden-')).every(k=>k.startsWith('echo-garden-'+version+'-'));},newVersion);
  await page.reload();await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  assert.equal(await page.locator('#build-version').innerText(),'v'+newVersion);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mobile-update-preservation-probe')),'keep');
  const manifest=await page.evaluate(async()=>fetch('manifest.webmanifest').then(r=>r.json()));
  for(const size of [192,512]){
   const name=`icon-${size}-v${newVersion}.png`;assert(manifest.icons.some(i=>i.src===name));
   const png=fs.readFileSync(path.join(newRoot,name));assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);
   assert.deepEqual(png,fs.readFileSync(path.join(oldRoot,`icon-${size}-v${oldVersion}.png`)),'approved Lotus icon is unchanged');
  }
  assert.equal(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'),`icon-192-v${newVersion}.png`);
  assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'),`icon.svg?v=${newVersion}`);
  assert.deepEqual(fs.readFileSync(path.join(newRoot,'icon.svg')),fs.readFileSync(path.join(oldRoot,'icon.svg')));
  await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  assert.equal(await page.locator('#build-version').innerText(),'v'+newVersion);
  await page.locator('#start-random').tap();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running||window.earYoga?.guide().active);
  if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').tap();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
  assert.deepEqual(errors,[]);
  console.log(`Mobile update passed: ${oldVersion} -> ${newVersion}, existing local data preserved, original Lotus icons unchanged, offline menu and flight.`);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
