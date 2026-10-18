const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900},locale:'ru-RU',serviceWorkers:'block'});
  await context.addInitScript(()=>{
   window.__recordProbe={requests:0,micRequests:0,cancel:false};
   navigator.mediaDevices.getUserMedia=()=>{__recordProbe.micRequests++;throw Error('Microphone forbidden in recording test');};
   navigator.mediaDevices.getDisplayMedia=async options=>{
    __recordProbe.requests++;__recordProbe.options=options;
    if(__recordProbe.cancel)throw new DOMException('Cancelled','NotAllowedError');
    // Synthetic opt-in video source; never bypass the OS picker for a real
    // user's screen. Encoding/audio/download still use native browser APIs.
    const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360;const ctx=canvas.getContext('2d');let frame=0;
    const draw=()=>{ctx.fillStyle='#123c35';ctx.fillRect(0,0,640,360);ctx.fillStyle='#d7eee7';ctx.font='30px sans-serif';ctx.fillText('EAR YOGA recording test '+frame++,20,80);};draw();
    __recordProbe.timer=setInterval(draw,33);__recordProbe.stream=canvas.captureStream(30);return __recordProbe.stream;
   };
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8788/');await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  assert.equal(await page.locator('[data-ship],#speed,#altitude').count(),0,'ship, speed and altitude controls removed');
  assert.equal(await page.locator('#garden-volume,#garden-eq-low,#garden-eq-mid,#garden-eq-high').count(),4,'volume and EQ retained');
  assert.equal(await page.evaluate(()=>gardenFlight.snapshot().ship),1);assert.equal(await page.evaluate(()=>gardenFlight.snapshot().altitude),1.25);
  assert.equal(await page.evaluate(()=>__recordProbe.requests),0,'no automatic recording');
  await page.locator('[data-difficulty="hard"]').click();await page.locator('#start-choose').click();
  await page.locator('.garden-route-choice').filter({hasText:'Fig. 1.6 — basic model'}).click();
  if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);
  await page.locator('#world-controls').click();
  await page.locator('#recording-start').click();await page.locator('#recording-bar').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>__recordProbe.options.audio),false);assert.equal(await page.evaluate(()=>__recordProbe.micRequests),0);
  await page.waitForTimeout(4500);assert.notEqual(await page.locator('#recording-clock').innerText(),'00:00');
  await page.locator('#recording-stop').click();await page.locator('#recording-result[open]').waitFor();
  assert(await page.locator('#recording-bar').isHidden());
  const result=await page.evaluate(async()=>{
   const blob=await (await fetch(document.getElementById('recording-save').href)).blob(),ac=new AudioContext();
   const audio=await ac.decodeAudioData(await blob.arrayBuffer());let peak=0;const data=audio.getChannelData(0);for(const value of data)peak=Math.max(peak,Math.abs(value));
   const video=document.getElementById('recording-video');if(video.readyState<1)await new Promise(resolve=>video.addEventListener('loadedmetadata',resolve,{once:true}));
   await ac.close();return {size:blob.size,type:blob.type,peak,width:video.videoWidth,height:video.videoHeight,ended:__recordProbe.stream.getTracks().every(t=>t.readyState==='ended')};
  });
  assert(result.size>5000);assert(result.peak>.001,'file contains audible game output');assert.equal(result.width,640);assert.equal(result.height,360);assert(result.ended);
  const saved=page.waitForEvent('download');await page.locator('#recording-save').click();const download=await saved;assert.match(download.suggestedFilename(),/^EAR-YOGA-v1\.34-.*\.(webm|mp4)$/);
  await page.locator('#recording-result').screenshot({path:'/private/tmp/ear-yoga-recording-result.png'});
  await page.locator('#recording-close').click();await page.locator('#world-controls').click();
  await page.evaluate(()=>{__recordProbe.cancel=true;});await page.locator('#recording-start').click();
  await page.waitForFunction(()=>document.getElementById('recording-status').textContent.includes('отменён'));assert(await page.locator('#recording-bar').isHidden());assert(await page.locator('#recording-start').isEnabled());
  assert.equal(await page.evaluate(()=>__recordProbe.micRequests),0);assert.deepEqual(errors,[]);
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1',serviceWorkers:'block'}),phone=await mobile.newPage();
  await phone.goto(process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8788/');await phone.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  assert(await phone.locator('#game-recording').isHidden());assert(await phone.locator('#recording-bar').isHidden());
  console.log('Recording browser passed: real video+audible game audio encoding, download, explicit start/stop, picker cancellation, no microphone and hidden mobile controls.',result);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
