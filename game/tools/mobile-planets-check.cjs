const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.GAME_PREVIEW_URL||'http://127.0.0.1:8147/';
const chrome=process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:chrome});
  const errors=[];
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    await page.goto(base);
    await page.waitForFunction(()=>window.earGame);
    await page.getByRole('button',{name:/ПЛАНЕТА/}).click();
    assert.equal(await page.locator('.planet-card').count(),6);
    assert.equal(await page.locator('.planet-card:not(:disabled)').count(),2);
    assert.equal(await page.locator('.planet-card:disabled').count(),4);
    await page.locator('.planet-card.garden').click();
    assert.equal(await page.locator('.planet-card.garden').getAttribute('aria-pressed'),'true');
    assert.match(await page.locator('.overlay-card').innerText(),/AMBIENT CHILL/);
    await page.getByRole('button',{name:/AMBIENT CHILL/}).click();
    await page.waitForURL(/garden-flight\.html/);
    await page.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
    assert.equal(await page.locator('#exercise-select option').count(),9);
    assert.equal(await page.locator('.route-panel').isVisible(),true);
    assert.equal(await page.locator('.answers-panel').isVisible(),true);
    assert.equal(await page.locator('.degrees-panel').isVisible(),true);
    assert.equal(await page.locator('.back-to-planets').getAttribute('href'),'./');
    assert.deepEqual(errors,[]);
    console.log('Mobile planets passed: six destinations, two active worlds, Garden route, full Chapter 1 and three-part glass HUD.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
