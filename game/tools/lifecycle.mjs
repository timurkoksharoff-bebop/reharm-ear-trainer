// Headless lifecycle regression test. Fakes only browser/Audio APIs; runs the
// actual game state machine and combat update from game.js, not a second model.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {MELODY_BANK,GENRE_COUNTS} from '../melody-bank.mjs';
import {createIntelligence} from '../intelligence.mjs';
import {createRaiders} from '../raiders.mjs';
import {createIceEvent} from '../ice-event.mjs';
import {createSeasonPlanet} from '../seasons.mjs';
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
class TestAudio {announce(text,onEnd){this.pending=onEnd;}answerFeedback(options){this.feedback=options;}trumpetChord(root,notes,onEnd){this.pending=onEnd;}hydraExplosion({final}){this.explosions=(this.explosions||0)+1;if(final)this.finalExplosions=(this.finalExplosions||0)+1;}rhythm(pattern,onEnd){this.pending=onEnd;}guide(root,target,onEnd){this.pending=onEnd;}chordOnly(root,notes,onEnd){this.pending=onEnd;}interval(base,n,mode,onEnd){this.pending=onEnd;}async unlock(){}stop(){this.pending=null;}play(route,chord,sector,onPart,onEnd){this.pending=onEnd;onPart('home');}progression(route,target,onPart,onEnd){this.pending=onEnd;onPart({part:'target',index:target});}bookReference(route,target,onPart,onEnd){this.pending=onEnd;this.referencePlayed=true;onPart({part:'home',index:-1});onPart({part:'target',index:target});}example(...args){this.play(args[0],{},0,args[4],args[5]);}}
const storage=new Map();
const context=vm.createContext({MELODY_BANK,GENRE_COUNTS,createIntelligence,createRaiders,createIceEvent,createSeasonPlanet,...music,...combat,...intervals,...expeditionModule,FlightAudio:TestAudio,console,
  createDebrief:()=>({record(){},open(){}}),createMelodyLibrary:()=>({open(){}}),createStandardsLibrary:()=>({open(){}}),
  installLanguage(){},loadFlightImage:async()=>{},createDebrief:()=>({record(){},open(){},log:{pendingCount:0}}),createMelodyLibrary:()=>({open(){}}),createStandardsLibrary:()=>({open(){}}),
  document:{documentElement:new Element(),body:new Element(),getElementById:get,createElement:()=>new Element(),querySelector:selector=>get(selector),querySelectorAll:()=>[...get('bass-pads').children,...get('quality-pads').children],addEventListener(){}},
  window:{addEventListener(){},matchMedia:()=>({matches:false}),innerHeight:700},location:{search:''},URLSearchParams,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
  Image:class{},ResizeObserver:class{observe(){}},matchMedia:()=>({matches:true}),requestAnimationFrame(){},setTimeout(){},clearTimeout(){},HTMLButtonElement:Element,
});
const source=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8').replace(/^import .+;\n/gm,'');
vm.runInContext(source,context);
const run=code=>vm.runInContext(code,context);
const state=()=>JSON.parse(run('JSON.stringify(s,(key,value)=>key==="keys"?[]:value)'));
assert.equal(state().planetChoice,'original','Existing players retain the original planet by default');
await run('startRun(0)');assert.equal(state().mode,'briefing');
run('startLessons();audio.pending();');assert.equal(state().mode,'lesson');
run('pause();');assert.equal(state().mode,'paused');
await run('resume()');assert.equal(state().mode,'lesson');
run('audio.pending();spawnEnemy();audio.pending();s.listening=true;s.shotTimer=99;for(let i=0;i<200;i++)update(.035);s.listening=false;');
const initial=state();run('answer("bass",s.enemy.chord.offset===0?7:0);');
assert.equal(state().score,initial.score);assert.equal(state().bullets.length,3);assert.equal(state().stats.bass.miss,1);
run('answer("bass",s.enemy.chord.offset);');assert.equal(state().mode,'resolving');assert(state().overdrive>0);
const earned=state().score;run('answer("bass",s.enemy.chord.offset);');assert.equal(state().score,earned);
run('pause();');const paused=JSON.stringify(state());run('update(1)');assert.equal(JSON.stringify(state()),paused);
await run('resume()');assert.equal(state().mode,'resolving');
run('for(let i=0;i<33;i++)update(.035);update(.02);audio.pending();expedition.collectNumber(expedition.snapshot().special.label);s.resolveTimer=.01;update(.02);audio.pending();');assert.equal(state().mode,'active');
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
await run('startRun(2);');run('spawnEnemy();audio.pending();');assert(state().maxHealth>=12,'Master starts with a fractional shield');
const fullShield=state().health;run('s.invulnerable=0;shipHit();s.invulnerable=0;shipHit();');assert.notEqual(state().mode,'gameover');assert.equal(state().health,fullShield-2,'Two ordinary hits do not end the pilot');
run('s.health=1;s.invulnerable=0;shipHit();');assert.equal(state().mode,'gameover');
await run('startRun(2);');assert.equal(state().health,state().maxHealth);assert.equal(state().score,0);
// Weapon collision kills a drone but cannot advance a musical encounter.
run('spawnEnemy();audio.pending();s.drones=[{x:240,y:200,baseX:240,phase:0,age:0,speed:0,hp:1,hit:0,fire:99,pattern:0}];s.shots=[{x:240,y:205,vx:0}];update(.01);');
assert.equal(state().droneKills,1);assert.equal(state().cleared,0);
assert.equal(combat.pressure(2,9,1),2);assert.equal(combat.pressure(0,0,1),0);
// Test the full chromatic arsenal: 12 roots, both banks, exact type and capsule lifecycle.
await run('startRun(3);');run('spawnEnemy();audio.pending();');
assert.equal(get('bass-pads').children.length,6);assert.equal(get('quality-panel').hidden,true);assert.equal(get('weapon-tabs').hidden,true);
const correctPad=get('bass-pads').children.find(b=>b.textContent===run('chordSymbol(s.enemy.chord)'));
assert(correctPad);correctPad.click();assert.equal(state().mode,'resolving');assert.equal(state().attempts,1);assert.equal(state().correct,1);
run('for(let i=0;i<33;i++)update(.035);update(.02);');
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
assert(get('bass-pads').children.length>=4);run('answerBookChord(s.enemy.chord,document.createElement("button"));');assert.equal(state().mode,'resolving');
// A grounded Hydra enters with the exact same displacement as the soil, then
// locks both together. Listening suppresses unrelated random enemy waves here.
await run('startRun(3,2);');run('spawnEnemy();s.listening=true;s.shotTimer=99;');
const approach=state();assert.equal(approach.enemy.maxHull,4*(100+approach.enemy.model*35),'Gun-only defeat requires four times the hits');run('update(.035);');const approaching=state();
assert.equal(approaching.enemy.groundPhase,'approach');
assert(Math.abs((approaching.enemy.y-approach.enemy.y)-(approaching.travel-approach.travel))<1e-8,'Base stays on the same patch of soil while approaching');
run('for(let i=0;i<240;i++)update(.035);');assert.equal(state().enemy.groundPhase,'combat');
const arrived=state();run('update(.25);');
assert.equal(state().travel,arrived.travel,'Planet stops at a ground encounter');
assert.equal(state().enemy.y,arrived.enemy.y);assert.equal(state().groundScrollDelta,0);
// The body is physical, but its collision does not become a full-width wall.
run('s.player.x=s.player.tx=25;s.player.y=s.player.ty=115;update(.02);');assert.equal(state().player.y,115,'Side corridor remains open');
run('s.player.x=s.player.tx=s.enemy.x;s.player.y=s.player.ty=s.enemy.y;s.invulnerable=0;update(.02);');
assert(state().player.y>state().enemy.y+50,'Hull contact pushes the ship outside the body');
assert.equal(state().health,arrived.health-1);
// Bullets can burn out an individual gun, which then ceases firing.
run('s.player.x=s.player.tx=25;s.player.y=s.player.ty=H-60;s.enemy.guns[0].hp=1;const port=s.enemy.guns[0];s.shots=[{x:s.enemy.x+port.x,y:s.enemy.y+port.y+12,vx:0}];update(.01);');
assert.equal(state().enemy.guns[0].destroyed,true);assert.equal(state().enemy.guns[0].hp,0);
run('s.bullets=[];enemyVolley();');
assert(state().bullets.every(b=>Math.hypot(b.x-(state().enemy.x+state().enemy.guns[0].x),b.y-(state().enemy.y+state().enemy.guns[0].y+17))>1),'Destroyed gun emits no volley');
// Winning gives a finite chain blast before the next musical question, then
// releases the terrain again; reduced-motion users get no camera shake.
const beforeAnswerHull=state().enemy.hull;
run('s.listening=false;answer("bass",s.enemy.chord.offset);');
assert.equal(state().enemy.hull,beforeAnswerHull,'One component must not prematurely erase hull HP');
run('answer("quality",s.enemy.chord.quality);');
assert(state().hydraBlast);assert.equal(run('expedition.busy'),false);
const blastTravel=state().travel;run('update(.25);');assert.equal(state().travel,blastTravel);assert.equal(state().shake,0);
run('for(let i=0;i<30;i++)update(.035);');assert.equal(state().hydraBlast,null);
assert(run('audio.finalExplosions')>0);assert(state().debris.length>0);assert(state().travel>blastTravel,'Flight resumes after detonation');
// A trumpet exercise suspends the boss and every game.js damage source, while
// the player's steering and gentle planet motion remain available.
await run('startRun(3,2);');run('spawnEnemy();audio.pending();expedition.startChallenge("flightTones");audio.pending();audio.pending();');
assert.equal(run('expedition.safeNoteFlight'),true);
const noteHealth=state().health,noteTravel=state().travel;
run('s.player.x=s.player.tx=25;s.player.y=s.player.ty=115;s.invulnerable=0;s.bullets=[{x:25,y:115,vx:0,vy:0,r:20}];s.drones=[{x:25,y:115,baseX:25,phase:0,age:0,speed:0,hp:1,fire:0,pattern:0}];s.shots=[{x:25,y:115,vx:0}];update(.035);enemyVolley(true);shipHit();');
assert.equal(state().health,noteHealth);assert.equal(state().player.y,115);
assert.equal(state().bullets.length,0);assert.equal(state().drones.length,0);assert.equal(state().shots.length,0);
assert(state().travel>noteTravel);assert.equal(state().enemy.suspended,true);assert.equal(get('enemy-label').hidden,true);
run('expedition.reset(2);update(.035);');
assert.equal(state().enemy.groundPhase,'approach');assert(state().enemy.y<0,'Suspended base re-enters from the horizon, never reappears on the pilot');
// Ordinary sustained fire also wins, without crediting a correct ear answer.
run('expedition.reset(2);spawnEnemy();s.listening=false;s.enemy.y=180;s.enemy.groundPhase="combat";s.enemy.hull=1;s.enemy.guns.forEach(g=>{g.hp=0;g.destroyed=true;});s.shots=[{x:s.enemy.x,y:s.enemy.y+45,vx:0}];');
const hearingBefore=state().correct;run('update(.01);');assert.equal(state().mode,'resolving');assert(state().hydraBlast);assert.equal(state().correct,hearingBefore);
// Removed prototype worlds cannot be restored through stale local state.
run('selectPlanet("seasons");');assert.equal(state().planetChoice,'original');
run('selectPlanet("samsara");');assert.equal(storage.get('ear-reharm-game.planet.v1'),'samsara');
run('selectPlanet("original");');assert.equal(storage.get('ear-reharm-game.planet.v1'),'original');
console.log('Lifecycle checks passed: campaign completion, pause/replay, shields, drones, ground approach/terrain stop, local hull collision, destructible guns, finite chain explosion, safe trumpet flight and active planet selection.');
