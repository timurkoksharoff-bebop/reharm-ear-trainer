// Focused layout regression: the Professor inventory and six supplies must stay
// outside the fixed answer rails. Optional source CSS injection supports QA on
// an earlier local prototype without modifying that generated output.
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8155/';
const out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-professor-layout';fs.mkdirSync(out,{recursive:true});
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},locale:'ru-RU',serviceWorkers:'block'});
  await p.goto(base);await p.waitForFunction(()=>window.gardenFlight?.snapshot().ready);
  if(process.env.GARDEN_QA_SOURCE_CSS)await p.addStyleTag({content:fs.readFileSync(process.env.GARDEN_QA_SOURCE_CSS,'utf8')});
  await p.locator('[data-difficulty="professor"]').click();await p.locator('#start-random').click();
  await p.waitForFunction(()=>gardenFlight.snapshot().mission.running||earYoga.guide().active);
  if(await p.locator('#flight-tutorial').isVisible())await p.locator('#tutorial-close').click();
  await p.locator('#mission-toggle').click();
  await p.evaluate(()=>{
   const inventory=document.querySelector('.flight-tools');inventory.open=true;
   const stress=document.createElement('div');stress.className='assist-charges';stress.dataset.layoutStress='';
   for(let i=0;i<36;i++){const button=document.createElement('button');button.textContent=String(i+1);stress.append(button);}
   document.querySelector('.flight-tools-body').append(stress);
   let nav=document.querySelector('.vital[data-resource="navigation"]');
   if(!nav){nav=document.querySelector('.vital[data-resource="resonance"]').cloneNode(true);nav.dataset.resource='navigation';nav.querySelector('strong').textContent='NAV';nav.querySelector('.resonance-symbol').textContent='⌖';document.querySelector('.garden-vitals').append(nav);}
   for(const e of document.querySelectorAll('.vital[data-resource="resonance"],.vital[data-resource="navigation"]'))e.style.setProperty('display','grid','important');
  });
  for(const [width,height] of [[320,568],[390,844],[820,1180],[844,390],[1440,900]]){
   await p.setViewportSize({width,height});
   if(process.env.GARDEN_QA_SOURCE_CSS)await p.evaluate(()=>{
    // Earlier builds lack the runtime measurement. Only the explicitly enabled
    // source-CSS audit supplies it; fresh builds must provide their own anchor.
    const bottom=document.querySelector('.route-panel').getBoundingClientRect().bottom;
    document.body.style.setProperty('--flight-tools-top',Math.max(128,Math.min(innerHeight-146,bottom+12))+'px');
   });
   else await p.waitForFunction(()=>{
    const expected=Math.max(128,Math.min(innerHeight-146,document.querySelector('.route-panel').getBoundingClientRect().bottom+12));
    return Math.abs(parseFloat(getComputedStyle(document.body).getPropertyValue('--flight-tools-top'))-expected)<1;
   });
   await p.evaluate(()=>{
    document.querySelector('#bass-panel').hidden=false;
   });
   const boxes=await p.evaluate(()=>{
    const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};
    return{tools:box('.flight-tools'),panel:box('.flight-tools-body'),bass:box('.bass-panel'),quality:box('.answers-panel'),root:box('.degrees-panel'),vials:box('.garden-vitals'),bassButtons:[...document.querySelectorAll('#bass-options button')].map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}),client:document.querySelector('.flight-tools-body').clientHeight,scroll:document.querySelector('.flight-tools-body').scrollHeight};
   });
   assert(boxes.panel.x>=boxes.bass.x+boxes.bass.w,'inventory starts outside bass rail '+width);
   assert(boxes.panel.x+boxes.panel.w<boxes.quality.x,'inventory ends before chord rail '+width);
   assert(boxes.panel.y+boxes.panel.h<boxes.root.y,'inventory clears root row '+width);
   assert(!overlaps(boxes.tools,boxes.bass),'lotus clears bass rail '+width);
   assert(!overlaps(boxes.vials,boxes.quality),'six supplies clear chord rail '+width);
   assert(boxes.vials.x>=0&&boxes.vials.x+boxes.vials.w<=width,'six supplies stay on screen '+width);
   assert(boxes.scroll>=boxes.client,'inventory scroll remains bounded '+width);
   for(let i=0;i<boxes.bassButtons.length;i++)for(let j=i+1;j<boxes.bassButtons.length;j++)assert(!overlaps(boxes.bassButtons[i],boxes.bassButtons[j]),'independent bass targets '+width);
   if(width>height)assert(boxes.bassButtons.every(r=>r.h>=14),'landscape bass remains legible '+width);
   await p.screenshot({path:out+'/inventory-'+width+'.png'});
  }
  await p.evaluate(()=>document.body.classList.remove('professor-mode'));
  assert.equal(await p.locator('.flight-tools').evaluate(e=>getComputedStyle(e).top),'198px','Teacher anchor unchanged');
  console.log('Professor layout PASS: 320/390/820/844/1440 inventory, bass/root/chord separation, six supplies, Teacher anchor. '+out);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
