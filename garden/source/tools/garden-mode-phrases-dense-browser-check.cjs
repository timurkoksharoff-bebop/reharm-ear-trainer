// Focused opt-in dense-phrase integration. Uses isolated test storage and the
// real workshop/audio/flight paths; does not touch a player's browser profile.
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8184/';
const out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-dense-phrases';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',hasTouch:true,isMobile:true,serviceWorkers:'block'});
 await context.addInitScript(()=>{localStorage.setItem('ear-yoga-mode-access.v1',JSON.stringify({version:1,allAccess:true,medium:[],hard:[]}));localStorage.setItem('ear-yoga-guide.v2','1');});
 const page=await context.newPage(),errors=[],report={};page.on('pageerror',error=>errors.push(error.message));
 const url=new URL(base);url.searchParams.set('routes','classic');
 const snap=()=>page.evaluate(()=>gardenFlight.snapshot());
 const start=async()=>{await page.locator('button[data-difficulty="professor"]').click();await page.locator('#start-choose').click();await page.locator('#garden-route-list .garden-route-choice').filter({hasText:/1\.15/}).click();await page.locator('#professor-lesson').waitFor({state:'visible'});};
 const soundTab=()=>page.getByRole('button',{name:'Звучание',exact:true}).click();
 const audition=async(button,preset)=>{await page.getByRole('button',{name:button,exact:true}).click();await page.waitForFunction(preset=>{const state=gardenFlight.snapshot().lastModePreview;return state?.active&&state.preset===preset;},preset);return (await snap()).lastModePreview;};
 const check=preview=>{assert.equal(preview.phrasing,'configured');assert(preview.events.length>=2);const pcs=new Set(preview.scaleNotes.map(n=>(n%12+12)%12));for(const event of preview.events){assert(pcs.has((event.midi%12+12)%12),'all notes stay in the picked scale');assert(event.onset>=0&&event.duration>0);assert(event.onset+event.duration<=preview.remaining-.08,'phrase fits before next chord');}assert(new Set(preview.events.map(event=>event.velocity.toFixed(2))).size>1,'articulation varies');};
 await page.goto(url.href);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);await start();
 await page.locator('#professor-lesson select[aria-label="Выбрать лад"]').selectOption('dorian');await soundTab();
 assert.deepEqual((await snap()).audition,{preset:'mixed',arpeggioPercent:25,combinedPercent:25,rhythm:'lively'},'existing default remains mixed');
 await page.locator('#mode-sound-preset').selectOption('dense');
 assert(await page.locator('#mode-sound-arpeggioPercent').isHidden());assert(await page.locator('#mode-sound-rhythm').isHidden());
 let preview=await audition('Послушать мой вариант','dense');check(preview);assert(preview.events.length>=8,'early dense audition develops more than one sparse cell');assert.equal(preview.rhythm,'double-time');assert.equal(preview.modeId,'dorian');assert(preview.segments.length>=2);report.dense=preview;
 const saved=(await snap()).audition;
 preview=await audition('Сравнить: смешанный','mixed');check(preview);assert.deepEqual((await snap()).audition,saved,'comparison does not change saved dense selection');assert.equal(await page.locator('#mode-sound-preset').inputValue(),'dense');report.mixedComparison=preview;
 preview=await audition('Сравнить: Фраза 0','zero');check(preview);assert.deepEqual((await snap()).audition,saved);report.zeroComparison=preview;
 await page.reload();await page.waitForFunction(()=>gardenFlight.snapshot().ready);await start();await soundTab();assert.equal((await snap()).audition.preset,'dense','dense choice persists');assert.equal(await page.locator('#mode-sound-preset').inputValue(),'dense');
 for(const size of [{width:390,height:844},{width:320,height:568}]){
  await page.setViewportSize(size);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal page overflow');const bounds=await page.locator('#professor-lesson').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=size.width,'dialog stays inside viewport');assert(await page.locator('#mode-sound-arpeggioPercent').isHidden());await page.screenshot({path:out+'/dense-settings-'+size.width+'.png'});
 }
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Начать полёт',exact:true}).click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);await page.waitForTimeout(180);assert((await snap()).audio.sounding,'tonic survives closing sound panel');assert.equal((await snap()).mission.cursor,-1,'tonic reference precedes route');
 await page.waitForFunction(()=>gardenFlight.snapshot().mission.cursor===0);
 const safe=()=>page.waitForFunction(()=>{const audio=gardenFlight.snapshot().audio;return audio.sounding&&audio.time-audio.sounding.at>.3&&audio.time-audio.sounding.at<1.1;});
 const catchMode=async id=>{await safe();const old=(await snap()).modes.last?.id;await page.evaluate(id=>{const state=gardenFlight.snapshot();gardenFlight.spawnMode(id,{x:state.x/state.width,y:state.y/state.height});},id);await page.waitForFunction(old=>gardenFlight.snapshot().modes.last?.id!==old,old);return snap();};
 let live=await catchMode('dorian');check(live.lastModePreview);assert.equal(live.lastModePreview.preset,'dense','preflight dense choice reaches real pickup audio');assert.equal(live.lastModePreview.rhythm,'double-time');assert(live.lastModePreview.events.length>=4);report.flight=live.lastModePreview;
 await page.locator('#mission-toggle').click();assert.equal((await snap()).lastModePreview.active,false,'pause cancels queued dense notes');await page.locator('#mission-toggle').click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running&&gardenFlight.snapshot().audio.sounding);
 await page.evaluate(()=>gardenFlight.advanceChord());live=await catchMode('minor-blues');check(live.lastModePreview);assert.equal(live.lastModePreview.preset,'dense');report.secondFlight=live.lastModePreview;await page.evaluate(()=>gardenFlight.advanceChord());assert.equal((await snap()).lastModePreview.active,false,'new chord cancels remaining dense phrase');
 // Simulate the visibility event for the real background handler. This tests
 // cancellation wiring; it is not a claim of physical iOS app switching.
 live=await catchMode('mixolydian');assert.equal(live.lastModePreview.active,true);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(80);assert.equal((await snap()).lastModePreview.active,false,'background handler cancels dense phrase');assert.equal((await snap()).mission.running,false);report.background={active:(await snap()).lastModePreview.active,missionRunning:(await snap()).mission.running};
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));console.log('Dense sound browser PASS: opt-in default/persistence, hidden mixed-only controls, dense/Mixed/Phrase0 comparisons without saved-preset changes, 320/390px, tonic handoff, actual pickup pitch/window checks and pause/chord/background cancellation.');await context.close();
 }finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
