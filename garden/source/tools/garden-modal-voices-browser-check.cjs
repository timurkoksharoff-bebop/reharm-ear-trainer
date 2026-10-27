// Isolated Chromium mobile integration: real modal samplers and ungraded UI.
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8188/preview-1.81.html';
const out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-modal-voices';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const c=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',hasTouch:true,isMobile:true,serviceWorkers:'block'});
 await c.addInitScript(()=>{localStorage.setItem('ear-yoga-mode-access.v1',JSON.stringify({version:1,allAccess:true,medium:[],hard:[]}));localStorage.setItem('ear-yoga-guide.v2','1');localStorage.setItem('ear-yoga-professor-teacher.v1',JSON.stringify({version:1,preflight:false}));});
 const page=await c.newPage(),errors=[],report={};page.on('pageerror',error=>errors.push(error.message));
 const url=new URL(base);url.searchParams.set('routes','classic');
 const snap=()=>page.evaluate(()=>gardenFlight.snapshot());
 const safe=()=>page.waitForFunction(()=>{const state=gardenFlight.snapshot(),a=state.audio;return state.mission.running&&state.mission.cursor>=0&&a.sounding&&a.time-a.sounding.at>.25&&a.time-a.sounding.at<.8;});
 const check=state=>{const preview=state.lastModePreview;assert(preview?.active);assert.equal(preview.preset,'improved');assert.equal(preview.phrasing,'configured');assert.equal(preview.timbre,state.modeTimbre.timbre);const pcs=new Set(preview.scaleNotes.map(n=>(n%12+12)%12));assert(preview.events.length>=3);for(const event of preview.events){assert(pcs.has((event.midi%12+12)%12));assert(event.onset+event.duration<=preview.remaining-.08);}return preview;};
 await page.goto(url.href);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
 const captain=page.locator('[data-difficulty="professor"]');assert.match(await captain.textContent(),/Капитан/,'renamed Russian mode label');
 await page.locator('#start-language').click();await page.waitForFunction(()=>document.querySelector('[data-difficulty="professor"]').textContent.includes('Captain'));assert.match(await captain.textContent(),/Captain/,'renamed English mode label');
 await page.locator('#start-language').click();await page.waitForFunction(()=>document.querySelector('[data-difficulty="professor"]').textContent.includes('Капитан'));report.captain={ru:'Капитан',en:'Captain'};
 const mainPreset=await page.locator('[data-pad][aria-pressed="true"]').getAttribute('data-pad');
 await page.locator('button[data-difficulty="professor"]').click();await page.locator('#start-choose').click();await page.locator('#garden-route-list .garden-route-choice').filter({hasText:/1\.15/}).click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running&&gardenFlight.snapshot().mission.cursor===0);
 await page.locator('.live-phrase-toggle').click();await page.locator('#live-phrase-panel').waitFor({state:'visible'});await safe();
 await page.locator('#live-phrase-preset').selectOption('improved');await page.waitForFunction(()=>gardenFlight.snapshot().lastModePreview?.preset==='improved');
 for(const [key,value]of [['arpeggioPercent','0'],['combinedPercent','0']]){const field=page.locator('#live-phrase-'+key);await field.fill(value);await field.press('Tab');}
 const initial=await snap();assert.equal(initial.audition.preset,'improved');assert.equal(initial.audition.arpeggioPercent,0);assert.equal(initial.audition.combinedPercent,0);
 const listen=page.locator('.live-phrase-listen'),voice=page.locator('#live-phrase-voice');
 const preview=async()=>{await safe();const old=(await snap()).lastModePreview?.at;await listen.click();await page.waitForFunction(old=>{const s=gardenFlight.snapshot();return s.lastModePreview?.active&&s.lastModePreview.at!==old;},old);const state=await snap();check(state);assert.equal(state.mission.running,true);assert.equal(state.run.score,initial.run.score,'auditions are ungraded');assert.deepEqual(state.teacher.modes,initial.teacher.modes);assert.equal(await page.locator('[data-pad][aria-pressed="true"]').getAttribute('data-pad'),mainPreset,'modal voice never changes the chord instrument');return state;};
 report.flute=check(await preview());
 // Hold the real Wurlitzer requests to prove no fallback phrase plays during
 // loading and the live flight continues while the selector is preparing.
 let release,held=0;const gate=new Promise(resolve=>release=resolve);
 await c.route('**/assets/echo-garden/samples/modal/wurli-*.wav',async route=>{held++;await gate;await route.continue();});
 await voice.selectOption('wurli');await page.waitForFunction(()=>document.querySelector('#live-phrase-panel').getAttribute('aria-busy')==='true');
 await page.waitForTimeout(120);assert(held>0,'actual sample fetch was delayed');assert(await listen.isDisabled());assert(await voice.isDisabled());assert.equal((await snap()).lastModePreview.active,false,'old phrase stops instead of becoming a false preview');assert.equal((await snap()).mission.running,true);report.loading={held,status:await page.locator('.live-phrase-status').textContent()};
 release();await page.waitForFunction(()=>!document.querySelector('#live-phrase-voice').disabled);await c.unroute('**/assets/echo-garden/samples/modal/wurli-*.wav');
 report.wurli=check(await preview());assert.equal(report.wurli.character,'wurli');
 await voice.selectOption('drawbar');await page.waitForFunction(()=>!document.querySelector('#live-phrase-voice').disabled);report.drawbar=check(await preview());assert.equal(report.drawbar.character,'drawbar');
 const credits=page.locator('#live-phrase-panel .mode-voice-credit');assert.match(await credits.getAttribute('href'),/MODAL_SAMPLE_CREDITS\.md$/);assert.equal(await credits.getAttribute('rel'),'noopener');assert.match(await page.locator('#live-phrase-panel .mode-voice-attribution').textContent(),/CC0/);
 for(const size of [{width:390,height:844},{width:320,height:568}]){await page.setViewportSize(size);const bounds=await page.locator('#live-phrase-panel').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=size.width);assert(bounds.y>=0&&bounds.y+bounds.height<=size.height);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:out+'/voices-live-'+size.width+'.png'});}
 await page.setViewportSize({width:390,height:844});await preview();await page.locator('#mission-toggle').click();assert.equal((await snap()).lastModePreview.active,false,'pause cancels sampled notes');await page.locator('#mission-toggle').click();await preview();await page.evaluate(()=>gardenFlight.advanceChord());assert.equal((await snap()).lastModePreview.active,false,'new chord cancels the whole line');
 await preview();await page.evaluate(()=>dispatchEvent(new Event('pagehide')));await page.waitForFunction(()=>gardenFlight.snapshot().lastModePreview?.active===false,null,{timeout:1000});assert.equal((await snap()).lastModePreview.active,false,'background lifecycle cancels sampled notes after its short fade');
 await page.evaluate(()=>gardenFlight.showMenu());await page.locator('#start-menu').click();await page.locator('#mode-sound-open').click();await page.locator('#professor-lesson').waitFor({state:'visible'});
 assert.equal(await page.locator('#mode-sound-preset').inputValue(),'improved');assert(await page.locator('#mode-sound-arpeggioPercent').isEnabled());assert(await page.locator('#mode-sound-rhythm').isEnabled());
 await page.locator('#mode-sound-voice').selectOption('wurli');await page.waitForFunction(()=>!document.querySelector('#mode-sound-voice').disabled);
 await page.getByRole('button',{name:'Послушать мой вариант',exact:true}).click();await page.waitForFunction(()=>gardenFlight.snapshot().lastModePreview?.active&&gardenFlight.snapshot().lastModePreview.timbre==='wurli');report.workshop=check(await snap());
 await page.setViewportSize({width:320,height:568});const bounds=await page.locator('#professor-lesson').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=320);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:out+'/voices-workshop-320.png'});
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));console.log('Modal voices browser PASS: running improved preset/mix, real flute/Wurlitzer/drawbar, held loading and no fallback, separate chord voice, ungraded previews, pause/chord/background cancellation, workshop and320/390 layouts/credits. Desktop emulation only.');await c.close();
 }finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
