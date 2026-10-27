const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8157/';
const out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-professor-157';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block',isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{localStorage.setItem('ear-yoga-mode-access.v1',JSON.stringify({version:1,allAccess:true,medium:[],hard:[]}));const key='ear-yoga-professor-teacher.v1';if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({version:1,preflight:false}));});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const url=new URL(base);url.searchParams.set('routes','classic');
  await page.goto(url.href);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  const snapshot=()=>page.evaluate(()=>gardenFlight.snapshot());
  const safeWindow=()=>page.waitForFunction(()=>{const s=gardenFlight.snapshot(),a=s.audio;return a.sounding&&a.time-a.sounding.at>.24&&a.time-a.sounding.at<1.4;});
  const cursor=async target=>{for(let i=0;i<9&&(await snapshot()).mission.cursor!==target;i++)await page.evaluate(()=>gardenFlight.advanceChord());await safeWindow();};
  const newOnset=async()=>{const old=(await snapshot()).audio.sounding?.at;await page.evaluate(()=>gardenFlight.advanceChord());await page.waitForFunction(at=>gardenFlight.snapshot().audio.sounding?.at!==at,old);await safeWindow();};
  const catchTone=async label=>{const old=(await snapshot()).resonance.last?.id;await page.evaluate(label=>{const s=gardenFlight.snapshot();gardenFlight.spawnTension(label,{x:s.x/s.width,y:s.y/s.height});},label);await page.waitForFunction(({old,label})=>{const last=gardenFlight.snapshot().resonance.last;return last&&last.id!==old&&last.label===label;},{old,label});return snapshot();};
  const catchMode=async id=>{const old=(await snapshot()).modes.last?.id;await page.evaluate(id=>{const s=gardenFlight.snapshot();gardenFlight.spawnMode(id,{x:s.x/s.width,y:s.y/s.height});},id);await page.waitForFunction(({old,id})=>{const last=gardenFlight.snapshot().modes.last;return last&&last.id!==old&&last.modeId===id;},{old,id});return snapshot();};
  const catchItem=async kind=>{const old=(await snapshot()).life.event?.id;await page.evaluate(kind=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnCollectible(kind);Object.assign(e,{x:s.x/s.width,y:s.y/s.height,vx:0,vy:0});},kind);await page.waitForFunction(({old,kind})=>{const e=gardenFlight.snapshot().life.event;return e&&e.id!==old&&e.kind===kind;},{old,kind});};
  const visibleVials=()=>page.locator('.garden-vitals .vital:visible').count();
  const assertInventoryBounds=async()=>{
   const bounds=await page.locator('.flight-tools summary').evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom};});
   assert(bounds.x>=0&&bounds.right<=(await page.viewportSize()).width,'lotus is in viewport');
   const route=await page.locator('#chord-route').boundingBox();assert(bounds.y>=route.y+route.height-1,'lotus below actual chord chain');
   const body=await page.locator('.flight-tools-body').boundingBox();assert(body,'expanded inventory visible');assert(body.x>=0&&body.x+body.width<=(await page.viewportSize()).width+1,'inventory body fits');
   const root=await page.locator('.degrees-panel').boundingBox();assert(body.y+body.height<=root.y+1,'inventory clears ROOT panel');
  };
  assert.equal(await page.locator('.difficulty-picker button').count(),5);
  assert(await page.locator('button[data-difficulty="guru"]').isDisabled());
  const backdrop=await page.locator('.orbital-reference-plate').evaluate(e=>({clip:getComputedStyle(e).clipPath,mask:getComputedStyle(e,'::before').maskImage}));
  assert.equal(backdrop.clip,'none','reference backdrop has no hard horizontal cut');
  assert(backdrop.mask.includes('linear-gradient')&&backdrop.mask.includes('76%')&&backdrop.mask.includes('91%'),'reference backdrop feathers into the planet');
  for(const [width,height] of [[320,568],[390,844],[820,1180],[844,390]]){
   await page.setViewportSize({width,height});
   const boxes=await page.locator('.difficulty-picker button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}));
   assert(boxes[3].y<boxes[0].y&&boxes[4].y<boxes[0].y);
   assert(boxes[3].x>boxes[0].x&&boxes[3].x<boxes[1].x);
   const launch=await page.locator('#start-random').boundingBox();assert(boxes[3].y+boxes[3].h<launch.y,'second row clears Launch at '+width);
   assert(boxes.every(b=>b.x>=0&&b.x+b.w<=width+1));
   if(width>height)await page.locator('button[data-difficulty="professor"]').scrollIntoViewIfNeeded();
   await page.screenshot({path:out+'/cover-'+width+'.png'});
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('button[data-difficulty="professor"]').click();await page.locator('#start-menu').click();
  assert(await page.locator('#professor-settings').isVisible());assert.equal(await page.locator('[data-mode-family]').count(),8);
  await page.locator('[data-mode-family="blues"]').uncheck();await page.locator('#menu-close').click();
  await page.locator('#start-choose').click();
  await page.locator('#garden-route-list .garden-route-choice').filter({hasText:/1\.15/}).click();
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running||earYoga.guide().active);
  if(await page.locator('#flight-tutorial').isVisible()){assert(await page.locator('#field-modes').isVisible());assert(await page.locator('#field-resonance').isVisible());assert.equal((await page.locator('.map-vials').innerText()).replace(/\s/g,'').length,6,'guide depicts all six Professor vials');await page.locator('#tutorial-close').click();}
  await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);await cursor(0);
  let s=await snapshot();
  assert(s.mission.separateBass&&s.mission.rootMode&&s.mission.bassPanelNeeded);
  assert.equal(s.mission.exercise.id,'fig-1-15');
  assert.deepEqual(s.mission.exercise.sequence.map(c=>[c.offset,c.quality,c.bassOffset]),[[0,'6',null],[9,'m7',null],[4,'m7',11],[0,'maj7',null],[5,'maj',null],[0,'6',null]]);
  assert.equal(s.resonance.palette.length,12);assert(s.resonance.oxygenEnabled);assert.equal(s.modes.kind,'modes');assert(s.modes.navigationEnabled);assert(!s.modes.families.includes('blues'));assert.equal(await visibleVials(),6);assert.equal(s.modes.unlockThreshold,2);assert(!s.modes.unlocked);assert.equal(s.modes.offeringCount,0,'no automatic scales before one third solved');
  // Only the luminous point is a pickup. The centred name/formula is not.
  const previousModeId=s.modes.last?.id;
  const labelOnly=await page.evaluate(()=>{const s=gardenFlight.snapshot(),e=gardenFlight.spawnMode('lydian',{x:s.x/s.width,y:(s.y+24)/s.height,vy:0});setTimeout(()=>{e.vy=12;},260);return e.id;});
  await page.waitForTimeout(150);s=await snapshot();assert(s.modes.entities.some(e=>e.id===labelOnly),'name above dot does not collect');assert.equal(s.modes.last?.id,previousModeId,'passing label alone does not activate scale');
  s=await catchMode('lydian');assert(!s.modes.last.boundary,'bright point at ship activates');assert.equal(s.modes.last.modeId,'lydian');
  const fastId=await page.evaluate(()=>{const s=gardenFlight.snapshot();return gardenFlight.spawnMode('ionian',{x:s.x/s.width,y:(s.y-60)/s.height,vy:30}).id;});
  await page.waitForFunction(id=>gardenFlight.snapshot().modes.last?.id===id,fastId);s=await snapshot();assert(!s.modes.last.boundary,'swept fast point crossing activates between frames');
  // Passive labels show the bright dot and centred two-line engraving at rest.
  await page.evaluate(()=>{const a=gardenFlight.spawnMode('lydian',{x:.30,y:.39,vy:0}),b=gardenFlight.spawnMode('whole-tone',{x:.70,y:.46,vy:0});setTimeout(()=>{a.vy=b.vy=12;},600);});await page.waitForTimeout(150);
  await page.screenshot({path:out+'/professor-pickup-points.png'});
  await newOnset();await cursor(0);
  s=await catchTone('9');assert(s.modes.selectedTensions.includes('9'));const beforePhrygian=s.modes.navigation;
  s=await catchMode('phrygian');assert.equal(s.modes.last.verdict,'invalid');assert.equal(s.modes.last.reason,'tension-conflict');assert.equal(s.modes.last.delta,-20);assert.equal(s.modes.navigation,beforePhrygian-20);assert(s.modes.last.conflicts.some(c=>c.label==='9'&&c.expected==='♭9'));
  assert.deepEqual(s.lastModePreview.scaleNotes.map(n=>n-s.lastModePreview.scaleNotes[0]),[0,1,3,5,7,8,10,12]);
  assert.equal(s.lastModePreview.scaleNotes[0]%12,(s.mission.exercise.baseTonic+s.mission.current.offset)%12);
  assert.match(await page.locator('#mode-readout').innerText(),/9.*не сочетается/s);
  assert.match(await page.locator('#mode-readout').innerText(),/20 NAV/);
  await page.evaluate(()=>{gardenFlight.spawnTension('♯11',{x:.22,y:.43});gardenFlight.spawnMode('lydian',{x:.75,y:.4});});await page.waitForTimeout(120);
  await page.screenshot({path:out+'/professor-conflict.png'});
  await page.locator('#mission-toggle').click();const paused=await snapshot();assert(!paused.lastModePreview.active,'pause cancels scale audio');
  await page.waitForTimeout(220);s=await snapshot();assert.equal(s.resonance.energy,paused.resonance.energy);assert.equal(s.modes.navigation,paused.modes.navigation);assert.deepEqual(s.resonance.entities,paused.resonance.entities);assert.deepEqual(s.modes.entities,paused.modes.entities);
  await page.locator('#mission-toggle').click();await newOnset();s=await snapshot();assert.deepEqual(s.modes.selectedTensions,[],'tone choice resets at new onset');assert.equal(s.modes.activeMode,null);
  await cursor(3);let beforeModeScore=(await snapshot()).run.score;s=await catchMode('lydian');assert.equal(s.modes.last.verdict,'compatible');assert.equal(s.modes.last.tier.id,'base');assert.equal(s.modes.last.points,6);assert.equal(s.run.score-beforeModeScore,6,'basic scale score');
  beforeModeScore=s.run.score;s=await catchMode('harmonic-major');assert.equal(s.modes.last.verdict,'compatible');assert.equal(s.modes.last.tier.id,'rare');assert.equal(s.modes.last.points,14);assert.equal(s.modes.last.requestedDelta,12);assert.equal(s.run.score-beforeModeScore,14,'rare scale score');
  beforeModeScore=s.run.score;s=await catchMode('harmonic-major');assert.equal(s.modes.last.points,0);assert.equal(s.run.score,beforeModeScore,'same scale cannot farm score');
  s=await catchMode('lydian');const beforeEleven=s.modes.navigation;
  s=await catchTone('11');assert.equal(s.modes.last.kind,'tension');assert.equal(s.modes.last.delta,-20);assert.equal(s.modes.navigation,beforeEleven-20);assert(s.modes.last.conflicts.some(c=>c.label==='11'&&c.expected==='♯11'));
  await newOnset();await cursor(2);s=await snapshot();assert.equal(s.mission.current.offset,4);assert.equal(s.mission.current.bassOffset,11);assert(!s.mission.currentParts.bass);
  await page.locator('[data-degree="4"]').click();assert(!(await snapshot()).mission.currentParts.bass,'ROOT answer does not solve slash BASS');await page.locator('[data-quality="m7"]').click();assert(!(await snapshot()).mission.currentParts.bass);await page.locator('[data-bass-degree="11"]').click();assert((await snapshot()).mission.currentParts.bass);
  s=await snapshot();assert.equal(s.mission.solved.length,1);assert(!s.modes.unlocked);assert.equal(s.modes.offeringCount,0,'one of six is below unlock threshold');
  await newOnset();await cursor(4);await catchTone('9');s=await catchMode('ionian');assert.equal(s.combos.best['4'],24,'matching scale and tone form resonance combo');
  await page.locator('[data-quality="maj"]').click();await page.locator('[data-degree="5"]').click();s=await snapshot();assert.equal(s.combos.best['4'],48,'independent core answers upgrade to constellation combo');assert.equal(s.mission.solved.length,2);
  const comboScore=s.run.score;s=await catchMode('ionian');s=await catchTone('9');assert.equal(s.run.score,comboScore,'repeated same-onset catches cannot farm combo');assert.equal(s.combos.best['4'],48);await page.screenshot({path:out+'/professor-constellation-48.png'});
  await page.waitForFunction(()=>gardenFlight.snapshot().modes.unlocked);s=await snapshot();assert.equal(s.modes.unlockThreshold,2);
  await page.waitForFunction(()=>gardenFlight.snapshot().modes.offeringCount>0,{},{timeout:12000});s=await snapshot();assert(s.modes.lastOffer.usesForecast,'automatic offers forecast arrival harmony');
  await page.screenshot({path:out+'/professor-combo-offer.png'});
  await newOnset();await catchMode('ionian');await page.waitForFunction(()=>gardenFlight.snapshot().lastModePreview?.active);await page.evaluate(()=>gardenFlight.advanceChord());assert(!(await snapshot()).lastModePreview.active,'next chord cancels previous scale audio');await safeWindow();
  await catchItem('restoration');s=await snapshot();assert(s.resonance.energy>99.5,'life wheel restores oxygen before normal frame drain');assert.equal(s.modes.navigation,100,'life wheel restores navigation');
  await catchItem('qualityFocus');await catchItem('hold');await page.locator('.flight-tools summary').click();
  for(const [width,height] of [[320,568],[390,844],[820,1180],[844,390]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(100);assert.equal(await visibleVials(),6);await assertInventoryBounds();await page.screenshot({path:out+'/professor-inventory-'+width+'.png'});
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>gardenFlight.showMenu());
  for(const [mode,labels,vials] of [['medium',['1','3','5','7'],4],['hard',null,5]]){
   await page.locator(`button[data-difficulty="${mode}"]`).click();await page.locator('#start-random').click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);s=await snapshot();if(labels)assert.deepEqual(s.resonance.palette,labels);else assert.equal(s.resonance.palette.length,12);assert.equal(s.resonance.oxygenEnabled,mode==='hard');assert(!s.modes.enabled);assert.equal(await visibleVials(),vials);await page.evaluate(()=>gardenFlight.showMenu());
  }
  await page.locator('#start-language').click();assert.deepEqual(await page.locator('.difficulty-picker .mode-live-name').allTextContents(),['Cadet','Pilot','Navigator','Captain','Guru']);
  await page.reload();await page.waitForFunction(()=>gardenFlight.snapshot().ready);assert(!await page.evaluate(()=>JSON.parse(localStorage.getItem('ear-yoga-professor-families.v1')).includes('blues')));assert.deepEqual(errors,[]);
  console.log('Professor1.57 browser PASS: bright-point /label-only /swept pickup; 1/3unlock /forecastpairs /6-14tierpoints /48combo /dedupe; 3+2 cover /4viewports; 12tensions+41scales /6vials; 9→Phrygian and Lydian→11 NAV−20; per-onset reset; pause/audio cancellation; life-wheel O2+NAV restoration; expanded inventory; exact slash ROOT/quality/BASS; original Student/Teacher; persisted families; RU/EN. '+out);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
