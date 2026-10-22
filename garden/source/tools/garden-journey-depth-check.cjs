const assert=require('node:assert/strict'),{chromium}=require('playwright'),sharp=require('sharp'),fs=require('node:fs');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8142/',out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-154-depth';fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 for(const [width,height] of [[390,844],[820,1180],[844,390]]){
 const c=await b.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce',serviceWorkers:'block'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base);await p.waitForFunction(()=>window.gardenFlight?.snapshot().ready);await p.locator('#start-choose').click();const f=await(await p.locator('#journey-map iframe').elementHandle()).contentFrame();await f.waitForFunction(()=>window.journeyPreview);let near=null,far=false;
 // Rotate with the actual map controls; no injected camera setters.
 for(let step=0;step<32&&(!near||!far);step++){
 await f.locator('#rotate-left').click();await f.waitForTimeout(55);
 const found=await f.evaluate(()=>{const s=journeyPreview.snapshot(),front=document.querySelector('#cosmos-foreground'),g=front.getContext('2d'),d=s.dpr,nodes=[...document.querySelectorAll('[data-core]')].map(e=>({id:e.dataset.core,b:e.getBoundingClientRect()}));let near=null,far=false;
 for(const v of s.planets)for(const n of nodes){const left=Math.max(n.b.left,v.x-v.r*.7),right=Math.min(n.b.right,v.x+v.r*.7),top=Math.max(n.b.top,v.y-v.r*.7),bottom=Math.min(n.b.bottom,v.y+v.r*.7);for(let y=Math.ceil(top)+2;y<bottom-2;y+=3)for(let x=Math.ceil(left)+2;x<right-2;x+=3){if(Math.hypot(x-v.x,y-v.y)>v.r*.7)continue;const pixel=[...g.getImageData(Math.floor(x*d),Math.floor(y*d),1,1).data];if(v.z<0&&pixel[3]>253&&!near)near={x,y,name:v.name,core:n.id,pixel};if(v.z>=0&&pixel[3]===0)far=true;}}
 return {near,far,axis:s.centres};});near=near||found.near;far=far||found.far;
 if(found.near){near=found.near;break;}
 }
 assert(near,'near planet crosses central sign at '+width);
 const png=await p.screenshot({path:out+'/near-'+width+'.png'}),raw=await sharp(png).removeAlpha().raw().toBuffer({resolveWithObject:true}),offset=await p.locator('#journey-map iframe').boundingBox(),ix=Math.floor(near.x+offset.x),iy=Math.floor(near.y+offset.y),at=(iy*raw.info.width+ix)*3;
 assert(near.pixel.slice(0,3).every((n,i)=>Math.abs(n-raw.data[at+i])<5),'near sphere is visibly above DOM sign');
 // The sign lies underneath this tap, but the visible foreground planet wins.
 await p.mouse.click(near.x+offset.x,near.y+offset.y);await f.locator('#celestial-detail').waitFor({state:'visible'});assert.equal(await f.locator('#detail-title').innerText(),near.name,'occluded sign cannot steal planet tap');await f.locator('#detail-close').click();
 const pre=await f.evaluate(()=>journeyPreview.snapshot());await p.mouse.move(near.x+offset.x,near.y+offset.y);await p.mouse.down();await p.mouse.move(near.x+offset.x+40,near.y+offset.y+20,{steps:5});await p.mouse.up();const post=await f.evaluate(()=>journeyPreview.snapshot());assert(post.yaw<pre.yaw&&post.tilt<pre.tilt,'drag across an occluded sign still rotates');assert.deepEqual(post.centres,pre.centres,'axis remains stationary');
 await f.locator('#reset-camera').click();
 // Check the far pass separately, including overhead and changed canvas size.
 for(let step=0;step<20&&!far;step++){await f.locator('#rotate-left').click();await f.waitForTimeout(50);far=await f.evaluate(()=>{const s=journeyPreview.snapshot(),g=document.querySelector('#cosmos-foreground').getContext('2d');return s.planets.some(v=>v.z>=0&&Math.abs(v.x-innerWidth/2)<v.r+20&&g.getImageData(Math.floor(v.x*s.dpr),Math.floor(v.y*s.dpr),1,1).data[3]===0);});}
 assert(far,'far planets remain below axis at '+width);await f.locator('#top-view').click();await f.waitForTimeout(80);assert(await f.evaluate(()=>{const s=journeyPreview.snapshot(),e=document.querySelector('#cosmos-foreground');return s.tilt>1&&e.width===Math.round(innerWidth*s.dpr)&&getComputedStyle(e).pointerEvents==='none';}));await p.screenshot({path:out+'/overhead-'+width+'.png'});
 // Native keyboard access to a skill stays available, even during overlap.
 await f.locator('[data-core="0"]').focus();await p.keyboard.press('Enter');await f.locator('#celestial-detail').waitFor({state:'visible'});assert(await f.locator('#detail-medal').isVisible());await f.locator('#detail-close').click();assert.deepEqual(errors,[]);await c.close();console.log('Depth PASS',width,height,{near:near.name,far,errors});
 }
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
