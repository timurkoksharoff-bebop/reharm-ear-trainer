// Headless lifecycle regression test. Fakes only browser/Audio APIs; runs the
// actual game state machine and combat update from game.js, not a second model.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import * as music from '../music.mjs';
import * as intervals from '../intervals.mjs';
import * as combat from '../combat.mjs';
import * as expeditionModule from '../expedition.mjs';
class Element {
  constructor(){this.children=[];this.dataset={};this.style={setProperty(){}};this.events={};this.hidden=false;this.disabled=false;this.textContent='';this.classList={add(){},remove(){},toggle(){}};}
  set innerHTML(v){this.html=v;this.children=[];if(v.includes('overlay-card'))this.children.push(new Element());}
  get innerHTML(){return this.html;}
  get firstElementChild(){return this.children[0];}get firstChild(){return this.children[0];}
  append(...v){this.children.push(...v);}replaceChildren(...v){this.children=v;}insertAdjacentHTML(){}
  addEventListener(n,f){this.events[n]=f;}setAttribute(n,v){this[n]=v;}
  click(){if(!this.disabled)this.events.click?.({});}
}
const elements=new Map();
const get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
get('space').getContext=()=>({});get('enemy-label').append(new Element());
class TestAudio {rhythm(pattern,onEnd){this.pending=onEnd;}guide(root,target,onEnd){this.pending=onEnd;}chordOnly(root,notes,onEnd){this.pending=onEnd;}interval(base,n,mode,onEnd){this.pending=onEnd;}async unlock(){}stop(){this.pending=null;}play(route,chord,sector,onPart,onEnd){this.pending=onEnd;onPart('home');}progression(route,target,onPart,onEnd){this.pending=onEnd;onPart({part:'target',index:target});}bookReference(route,target,onPart,onEnd){this.pending=onEnd;this.referencePlayed=true;onPart({part:'home',index:-1});onPart({part:'target',index:target});}example(...args){this.play(args[0],{},0,args[4],args[5]);}}
const storage=new Map();
const context=vm.createContext({...music,...combat,...intervals,...expeditionModule,FlightAudio:TestAudio,console,
  installLanguage(){},loadFlightImage:async()=>{},
  document:{getElementById:get,createElement:()=>new Element(),querySelector:()=>null,querySelectorAll:()=>[...get('bass-pads').children,...get('quality-pads').children],addEventListener(){}},
  window:{addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
  Image:class{},ResizeObserver:class{observe(){}},matchMedia:()=>({matches:true}),requestAnimationFrame(){},setTimeout(){},clearTimeout(){},HTMLButtonElement:Element,
});
const source=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8').replace(/^import .+;\n/gm,'');
vm.runInContext(source,context);
const run=code=>vm.runInContext(code,context);
const state=()=>JSON.parse(run('JSON.stringify(s,(key,value)=>key==="keys"?[]:value)'));
await run('startRun(0)');assert.equal(state().mode,'briefing');
run('startLessons();audio.pending();');assert.equal(state().mode,'lesson');
run('pause();');assert.equal(state().mode,'paused');
await run('resume()');assert.equal(state().mode,'lesson');
run('audio.pending();spawnEnemy();audio.pending();');
const initial=state();run('answer("bass",s.enemy.chord.offset===0?7:0);');
assert.equal(state().score,initial.score);assert.equal(state().bullets.length,3);assert.equal(state().stats.bass.miss,1);
run('answer("bass",s.enemy.chord.offset);');assert.equal(state().mode,'resolving');assert(state().overdrive>0);
const earned=state().score;run('answer("bass",s.enemy.chord.offset);');assert.equal(state().score,earned);
run('pause();');const paused=JSON.stringify(state());run('update(1)');assert.equal(JSON.stringify(state()),paused);
await run('resume()');assert.equal(state().mode,'resolving');
run('update(.02);audio.pending();expedition.collectNumber(expedition.snapshot().special.label);s.resolveTimer=.01;update(.02);audio.pending();');assert.equal(state().mode,'active');
// Complete the actual progression/sector transition logic, preserving each chord.
for(let sector=0;sector<3;sector++){
  if(sector>0)run(`beginSector(${sector});spawnEnemy();audio.pending();`);
  while(state().cleared<8){
    if(sector===2){
      run('answer("quality",family(s.enemy.chord.quality));');assert.equal(state().mode,'active');
      assert(state().enemy.shields.quality&&!state().enemy.shields.bass);
      run('answer("bass",(s.enemy.chord.offset+1)%12);');assert(state().enemy.shields.quality);
    }
    run('answer("bass",s.enemy.chord.offset);');assert.equal(state().mode,'resolving');
    run('advance();');
    if(state().mode==='active')run('audio.pending();');
  }
  assert.equal(state().mode,sector===2?'finished':'intermission');
}
assert.equal(state().totalCleared,24);assert.equal(state().stats.quality.hit,8);
assert.equal(JSON.parse(storage.get('ear-reharm-game.v1')).unlocked,2);
await run('startRun(2);');run('spawnEnemy();audio.pending();s.health=1;s.invulnerable=0;shipHit();');assert.equal(state().mode,'gameover');
await run('startRun(2);');assert.equal(state().health,state().maxHealth);assert.equal(state().score,0);
// Weapon collision kills a drone but cannot advance a musical encounter.
run('spawnEnemy();audio.pending();s.drones=[{x:240,y:200,baseX:240,phase:0,age:0,speed:0,hp:1,hit:0,fire:99,pattern:0}];s.shots=[{x:240,y:205,vx:0}];update(.01);');
assert.equal(state().droneKills,1);assert.equal(state().cleared,0);
assert.equal(combat.pressure(2,9,1),2);assert.equal(combat.pressure(0,0,1),0);
// Test the full chromatic arsenal: 12 roots, both banks, exact type and capsule lifecycle.
await run('startRun(3);');run('spawnEnemy();audio.pending();');
assert.equal(get('bass-pads').children.length,12);assert.equal(get('quality-pads').children.length,11);
run('qualityBank=1;buildPads();');assert.equal(get('quality-pads').children[0].dataset.value,'maj7sharp11');
run('answer("quality",s.enemy.chord.quality);answer("bass",s.enemy.chord.offset);update(.02);');
assert.equal(state().listening,true);assert.equal(state().capsule,null);
assert.equal(run('expedition.snapshot().special.kind'),'numbers');
run('update(1);');assert.equal(state().mode,'resolving');
run('pause();');await run('resume();');assert(state().listening);
run('audio.pending();expedition.collectNumber(expedition.snapshot().special.label);');
assert.equal(state().energy,30);assert.equal(run('expedition.busy'),false);
while(state().cleared<12){
  if(state().mode==='resolving')run('advance();');
  if(state().mode==='finished')break;
  run('audio.pending();answer("bass",s.enemy.chord.offset);answer("quality",s.enemy.chord.quality);');
}
run('advance();');assert.equal(state().mode,'finished');assert.equal(state().totalCleared,12);
// Book Flight starts with route context; Space uses only a HOME note and the target chord.
await run('startBookRun(1,0);');run('spawnEnemy();audio.pending();playCue(true);');
assert.equal(run('audio.referencePlayed'),true);assert.equal(state().listening,true);assert.equal(state().bullets.length,0);run('audio.pending();');assert.equal(state().listening,false);
console.log('Lifecycle checks passed: 12-enemy chromatic and 24-enemy campaign completion, single-token interlude/pause/replay, calibration, shields, retry/storage, drones and pressure.');
