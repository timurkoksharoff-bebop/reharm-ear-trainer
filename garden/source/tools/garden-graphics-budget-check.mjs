import assert from 'node:assert/strict';
import {GardenGraphicsBudget} from '../garden-graphics-budget.mjs';
for(const hz of [60,90,120,144]){
 const budget=new GardenGraphicsBudget({mobile:true});let frames=0,grounds=0,last=0,totalMs=0;
 for(let i=0;i<hz*10;i++){const now=i*1000/hz;if(!budget.allowFrame(now))continue;frames++;if(last)totalMs+=now-last;last=now;if(budget.drawGround(now))grounds++;}
 assert(Math.abs(frames-600)<=1,`${hz}Hz rendering stays at60 instead of multiplying GPU work`);assert(Math.abs(grounds-300)<=1,'terrain stays30Hz');assert(totalMs>9900,'accepted frame deltas keep real elapsed time');
}
const slow=new GardenGraphicsBudget({mobile:true});for(let i=0;i<200;i++)slow.observe(1000/30);assert.equal(slow.snapshot().level,3);assert.equal(slow.snapshot().groundScale,.7);assert.equal(slow.snapshot().overlayScale,1.1);
for(let i=0;i<200;i++)slow.observe(1000/60);assert.equal(slow.snapshot().level,3,'no quality oscillation after GPU recovery');slow.resetTiming();assert.equal(slow.snapshot().level,3);assert(slow.allowFrame(2));assert(slow.drawGround(2));assert(slow.drawGround(3,true),'resized canvas is drawn immediately');
const stable=new GardenGraphicsBudget({mobile:true});for(let i=0;i<1000;i++)stable.observe(1000/60);assert.equal(stable.snapshot().level,0);
for(let i=0;i<100;i++)stable.observe(1000,{active:false});assert.equal(stable.snapshot().level,0,'background/menu delay cannot degrade graphics');
const desktop=new GardenGraphicsBudget();for(let i=0;i<200;i++){assert(desktop.allowFrame(i));assert(desktop.drawGround(i));desktop.observe(80);}assert.equal(desktop.snapshot().groundScale,1.5);
console.log('Graphics budget PASS:60/90/120/144Hz→60frame+30terrain cadence, real elapsed deltas, force redraw, bounded stable adaptation, inactive/desktop isolation.');
