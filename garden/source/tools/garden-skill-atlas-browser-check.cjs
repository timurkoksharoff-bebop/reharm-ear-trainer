const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8171/';
const output=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-skill-atlas';
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'});
  // Isolated QA profile only: the real player's ledger is never seeded.
  await context.addInitScript(()=>{localStorage.setItem('ear-yoga-professor-teacher.v1',JSON.stringify({version:1,flight:12,modes:{dorian:{good:9,bad:1,recent:[1,1,0,1,1,1,1,1,1,1],contexts:['route|0','route|1','route|2']}},patterns:{},seenLessons:[],preflight:false}));});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  await page.locator('#start-menu').click();
  const before=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));
  await page.locator('#skill-atlas-open').click();const root=page.locator('#garden-skill-atlas'),canvas=root.locator('canvas');await root.waitFor({state:'visible'});
  assert.equal(await root.locator('[data-brand-variant="3"]').count(),1,'approved wordmark');
  assert.match(await root.locator('.skill-atlas-summary').innerText(),/1\s*\/\s*41/);
  const a=await canvas.screenshot();await page.mouse.move(170,390);await page.mouse.down();await page.mouse.move(260,430,{steps:9});await page.mouse.up();await page.waitForTimeout(150);const b=await canvas.screenshot();assert(!a.equals(b),'drag changes projected scene');
  await root.getByRole('button',{name:'Сверху',exact:true}).click();await page.waitForTimeout(80);const c=await canvas.screenshot();assert(!b.equals(c),'overhead view changes projection');
  await root.getByRole('button',{name:'Все лады',exact:true}).click();assert.equal(await root.locator('[data-node]').count(),41);
  await root.locator('[data-node="dorian"]').click();const detail=root.locator('.skill-atlas-detail');await detail.waitFor({state:'visible'});
  assert.match(await detail.innerText(),/90%/);assert.match(await detail.innerText(),/1 · 2 · ♭3 · 4 · 5 · 6 · ♭7/);assert(!(await root.locator('.skill-atlas-index').isVisible()),'index yields space to planet and detail');
  await page.waitForTimeout(280);assert(await detail.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&Boolean(document.elementFromPoint(r.x+r.width/2,r.y+30)?.closest('.skill-atlas-detail'));}),'detail is visibly on screen above the canvas');await page.screenshot({path:output+'/dorian-phone.png'});
  await detail.locator('.skill-atlas-lesson').click();await page.locator('#professor-lesson').waitFor({state:'visible'});assert(await root.isVisible(),'atlas stays behind the audio lesson');
  await page.locator('#professor-lesson .lesson-controls button').first().click();await page.waitForTimeout(150);await page.locator('#professor-lesson header button').click();assert(await root.isVisible(),'closing lesson returns to atlas');
  await page.keyboard.press('Escape');assert(!(await detail.isVisible()));
  await root.getByRole('button',{name:'Все лады',exact:true}).click();await root.locator('[data-node="ionian"]').click();assert.match(await detail.innerText(),/Пока нет оценённых применений/);assert.equal(await detail.locator('.skill-atlas-metrics strong').first().innerText(),'—','unknown is not zero accuracy');
  await detail.getByRole('button',{name:'Скрыть карточку',exact:true}).click();
  for(const [width,height]of [[320,568],[820,1180],[1440,900],[844,390]]){await page.setViewportSize({width,height});await page.waitForTimeout(80);assert.equal(await root.evaluate(e=>e.scrollWidth>e.clientWidth),false,'no horizontal overflow '+width);}
  await page.setViewportSize({width:1440,height:900});await root.getByRole('button',{name:'Центр',exact:true}).click();await page.waitForTimeout(80);await page.screenshot({path:output+'/orbit-desktop.png'});
  await root.getByRole('button',{name:'Закрыть атлас',exact:true}).click();await root.waitFor({state:'hidden'});
  const after=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));assert.deepEqual(after,before,'viewing, dragging and auditioning do not change saved results');
  await page.locator('#garden-menu [data-open-achievements]').click();await page.locator('#achievements-skill-orbit').click();await root.waitFor({state:'visible'});assert(!(await page.locator('#achievements-board').isVisible()),'achievement entry exposes atlas without covering it');await root.getByRole('button',{name:'Закрыть атлас',exact:true}).click();
  assert(!errors.length,errors.join('\n'));
  console.log('PASS skill atlas: 41 real nodes, drag/overhead projection, cumulative accuracy, unknown states, native lesson/audio roundtrip, four responsive sizes, saved-data equality. '+output);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
