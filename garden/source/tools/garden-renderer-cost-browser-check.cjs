// Compare real WebGL framebuffers with the released 1.83 renderer, including
// rotated/offscreen ships, moving clears and all terrain transition boundaries.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'../../..'),out=process.env.GARDEN_QA_OUTPUT||'/private/tmp/ear-yoga-renderer-cost';
const source=fs.readFileSync(path.join(root,'garden/source/garden-flight-renderer.mjs'));
const reference=process.env.GARDEN_RENDERER_REFERENCE?fs.readFileSync(process.env.GARDEN_RENDERER_REFERENCE):execFileSync('git',['show','2a9e4a4:garden/source/garden-flight-renderer.mjs'],{cwd:root});
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(['/candidate.mjs','/reference.mjs','/unscissored.mjs'].includes(name)){res.setHeader('Content-Type','text/javascript');return res.end(name==='/reference.mjs'?reference:name==='/unscissored.mjs'?source.toString().replace('gl.enable(gl.SCISSOR_TEST);','gl.disable(gl.SCISSOR_TEST);'):source);}
 if(name.startsWith('/assets/')){const file=path.resolve(root,'garden',name.slice(1));if(file.startsWith(path.join(root,'garden/assets/'))&&fs.existsSync(file)){res.setHeader('Content-Type','image/webp');return res.end(fs.readFileSync(file));}}
 res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Renderer cost regression</title>');
});
(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('http://127.0.0.1:'+server.address().port);
 const report=await page.evaluate(async()=>{
  const [oldModule,newModule,controlModule]=await Promise.all([import('/reference.mjs'),import('/candidate.mjs'),import('/unscissored.mjs')]);
  const load=name=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src='/assets/echo-garden/'+name+'.webp';});
  const imageNames=['blue-gardens','night-bloom-aligned','white-thaw-aligned','blue-gardens','manta','lotus'],images=await Promise.all(imageNames.map(load));
  const create=module=>{const ground=document.createElement('canvas'),ship=document.createElement('canvas'),renderer=module.createGardenRenderer(ground,ship,images);return {ground,ship,renderer};};
  const old=create(oldModule),next=create(newModule),control=create(controlModule),cases=[],costs=[],timings=[];
  const state={width:390,height:844,worldSize:819,x:195,y:600,angle:0,ship:1,scroll:.3,pan:.1,time:7.8,growth:0,night:0,lantern:true,lowCostGraphics:true,mirrorTiles:false,thrust:.73,brake:.12,motionX:.15};
  const resize=(surface,dpr)=>{for(const name of ['ground','ship']){surface[name].width=Math.round(state.width*dpr);surface[name].height=Math.round(state.height*dpr);}};
  const pixels=canvas=>{const gl=canvas.getContext('webgl'),data=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,data);return data;};
  const compare=(label,which='both')=>{
   old.renderer.render(state);const oldGround=which!=='ship'?pixels(old.ground):null,oldShip=which!=='ground'?pixels(old.ship):null;
   next.renderer.render(state);const newGround=which!=='ship'?pixels(next.ground):null,newShip=which!=='ground'?pixels(next.ship):null;
   let changed=0,maxDelta=0;for(const [a,b]of [[oldGround,newGround],[oldShip,newShip]])if(a)for(let index=0;index<a.length;index++){const delta=Math.abs(a[index]-b[index]);if(delta){changed++;maxDelta=Math.max(maxDelta,delta);}}
   const entry={label,which,width:state.width,height:state.height,pixels:next.ground.width*next.ground.height,growth:state.growth,angle:state.angle,changedChannels:changed,maxChannelDelta:maxDelta};cases.push(entry);
   // Moving equivalent shader expressions and removing MSAA can change GPU
   // rounding by one8-bit colour step. Independently require byte-exact ship
   // bounds with MSAA held constant and only the scissor disabled.
   if(which==='ship'){resize(control,next.ship.width/state.width);control.renderer.render(state);const unclipped=pixels(control.ship);for(let index=0;index<newShip.length;index++)if(unclipped[index]!==newShip[index])throw Error('Scissor clips a ship pixel: '+JSON.stringify(entry));entry.exactScissor=true;}
   if(maxDelta>1||changed>entry.pixels*.0001)throw Error('Framebuffer differs: '+JSON.stringify(entry));
  };
  resize(old,1);resize(next,1);
  for(const lowCostGraphics of [false,true])for(const growth of [0,.12,.35,.5,.78,.97,1,1.38,1.65,1.96,2,2.37,2.72,2.98,3,3.43,3.96]){Object.assign(state,{growth,lowCostGraphics,night:growth%1,mirrorTiles:growth>2,lantern:growth<3});compare('terrain-'+lowCostGraphics+'-'+growth,'ground');}
  Object.assign(state,{growth:0,lowCostGraphics:true});
  for(const [width,height,dpr]of [[320,568,1.1],[390,844,1.5],[844,390,2],[1440,1000,1]]){
   Object.assign(state,{width,height,worldSize:width*2.1});resize(old,dpr);resize(next,dpr);
   for(const ship of [0,1])for(const [index,angle]of [-Math.PI,-2.3,-1.1,-.38,0,.52,1.27,2.15,Math.PI].entries()){
    Object.assign(state,{ship,angle,x:index%3===0?-20:index%3===1?width*.51:width+24,y:index%3===0?height*.7:index%3===1?-15:height-12,time:index*2.43,thrust:(index%4)/3,motionX:index%2?.4:-.4});compare('ship-'+ship+'-'+index,'ship');
   }
   // A hidden ship still clears its previous full-size image after a scissored
   // frame, including after a resize and when returning to another ship.
   Object.assign(state,{ship:1,angle:.7,x:width*.5,y:height*.55});compare('before-move','ship');
   Object.assign(state,{x:width*.2,y:height*.3});compare('after-move','ship');
   state.ship=2;compare('no-ship-clear','ship');state.ship=0;compare('return-ship','ship');
  }
  // Holding the terrain must leave its last framebuffer intact while the
  // sharper, independently sized ship canvas moves and clears every call.
  Object.assign(state,{width:390,height:844,worldSize:819,x:150,y:600,angle:.2,ship:1,growth:.4,scroll:.3,pan:.1});resize(next,1.5);resize(control,1.5);
  next.ground.width=312;next.ground.height=675;next.renderer.render(state);
  const heldGround=pixels(next.ground),initialShip=pixels(next.ship),beforeSkip=next.renderer.diagnostics();
  Object.assign(state,{x:280,y:320,angle:-.6,growth:2.5,scroll:.9,pan:-.3});
  next.renderer.render(state,{ground:false});control.renderer.render(state);
  const skippedGround=pixels(next.ground),movedShip=pixels(next.ship),expectedShip=pixels(control.ship),afterSkip=next.renderer.diagnostics();
  for(let index=0;index<heldGround.length;index++)if(heldGround[index]!==skippedGround[index])throw Error('ground:false redraws held terrain');
  let movingChannels=0;for(let index=0;index<movedShip.length;index++){if(movedShip[index]!==expectedShip[index])throw Error('ground:false changes ship rendering');if(movedShip[index]!==initialShip[index])movingChannels++;}
  if(!movingChannels)throw Error('ground:false did not move ship');
  if(afterSkip.groundFrames!==beforeSkip.groundFrames||afterSkip.shipFrames!==beforeSkip.shipFrames+1)throw Error('ground:false counters do not describe actual draws');
  state.ship=2;next.renderer.render(state,{ground:false});const hiddenShip=pixels(next.ship);if(hiddenShip.some(value=>value))throw Error('ground:false hidden ship leaves stale pixels');
  next.renderer.render(state);const restoredGround=pixels(next.ground),afterDefault=next.renderer.diagnostics();if(!restoredGround.some((value,index)=>value!==heldGround[index]))throw Error('default render did not resume terrain');
  if(afterDefault.groundFrames!==afterSkip.groundFrames+1||afterDefault.shipFrames!==afterSkip.shipFrames+2)throw Error('default render counters do not resume both passes');
  const groundSkipCheck={groundHeld:true,shipMatchesDefault:true,movingChannels,hiddenShipCleared:true,defaultGroundResumed:true,beforeSkip,afterSkip,afterDefault};
  Object.assign(state,{width:390,height:844,worldSize:819,x:195,y:600,angle:0,ship:1,night:0,growth:0,lowCostGraphics:true});resize(old,1.5);resize(next,1.5);
  for(const [name,surface]of [['reference',old],['candidate',next]]){
   const gl=surface.ship.getContext('webgl'),draw=gl.drawArrays.bind(gl),draws=[];gl.drawArrays=(...args)=>{draws.push({scissored:gl.isEnabled(gl.SCISSOR_TEST),box:[...gl.getParameter(gl.SCISSOR_BOX)]});return draw(...args);};surface.renderer.render(state);gl.drawArrays=draw;
   const total=surface.ship.width*surface.ship.height,cost=draws.reduce((sum,item)=>sum+(item.scissored?item.box[2]*item.box[3]:total),0);costs.push({name,canvasWidth:surface.ship.width,canvasHeight:surface.ship.height,draws,coveredFragments:cost});
  }
  // A one-pixel synchronous readback waits for actual completed draw work;
  // WebGL finish alone can return before Chrome's GPU process completes it.
  // Timings include this identical readback/IPC overhead in both renderers.
  const probe=new Uint8Array(4),finish=surface=>{for(const name of ['ground','ship']){const gl=surface[name].getContext('webgl');gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,probe);}};
  for(const surface of [old,next]){for(let index=0;index<3;index++)surface.renderer.render(state);finish(surface);}
  for(let index=0;index<12;index++)for(const [name,surface]of index%2?[['candidate',next],['reference',old]]:[['reference',old],['candidate',next]]){finish(surface);const start=performance.now();surface.renderer.render(state);finish(surface);timings.push({name,ms:performance.now()-start});}
  const diagnostics={reference:old.renderer.diagnostics(),candidate:next.renderer.diagnostics(),shipAntialias:{reference:old.ship.getContext('webgl').getContextAttributes().antialias,candidate:next.ship.getContext('webgl').getContextAttributes().antialias},gpu:next.ground.getContext('webgl').getParameter(next.ground.getContext('webgl').RENDERER)};
  old.renderer.dispose();next.renderer.dispose();control.renderer.dispose();return {cases,costs,timings,diagnostics,groundSkipCheck};
 });
 assert.equal(report.cases.length,122);assert(report.cases.filter(item=>item.which==='ship').every(item=>item.exactScissor));assert(report.cases.every(item=>item.maxChannelDelta<=1));assert.equal(report.diagnostics.reference.groundError,0);assert.equal(report.diagnostics.candidate.groundError,0);assert.equal(report.diagnostics.candidate.shipError,0);assert.deepEqual(errors,[]);
 report.shipFragmentReduction=1-report.costs[1].coveredFragments/report.costs[0].coveredFragments;
 assert(report.shipFragmentReduction>.93,'ship scissor must remove over93% of full-screen fragment coverage at phone size');
 const median=values=>values.sort((a,b)=>a-b)[Math.floor(values.length/2)];report.medianCompletedRenderMs=Object.fromEntries(['reference','candidate'].map(name=>[name,median(report.timings.filter(item=>item.name===name).map(item=>item.ms))]));
 report.roundingChannels=report.cases.reduce((sum,item)=>sum+item.changedChannels,0);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('Renderer cost browser PASS: '+report.cases.length+' framebuffer comparisons, byte-exact scissor bounds for rotated/offscreen/hidden/moving ships, 4 viewport/DPR sizes, all terrain phases/full+mobile quality (one8-bit-step rounding in '+report.roundingChannels+' channels); ship fragment coverage reduced '+(report.shipFragmentReduction*100).toFixed(1)+'%. Completed-render desktop medians(ms): '+JSON.stringify(report.medianCompletedRenderMs)+'.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
