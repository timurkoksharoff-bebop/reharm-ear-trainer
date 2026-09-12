import assert from 'node:assert/strict';
import {createStandardPicker,createStandardsLibrary} from '../standards-library.mjs';
import {JAZZ_STANDARDS} from '../standards-catalog.mjs';
import {parseStoredChart} from '../importer.mjs';

const a={title:'A'},b={title:'B'},blocked={title:'Blocked'},broken={title:'Broken'};
let parses=0;
const picker=createStandardPicker(record=>{
  parses++;if(record===broken)throw new Error('Bad file');
  return {title:record.title,format:'iReal Pro',route:record===blocked?null:{sequence:[{offset:0,quality:'maj'}]}};
},()=>0);
assert.equal(picker.pick([a,b]).title,'A');assert.equal(parses,1,'Do not parse the entire catalog for one draw');
assert.equal(picker.pick([a,b],'A').title,'B');assert.equal(parses,2);
assert.equal(picker.pick([a,b],'B').title,'A');assert.equal(parses,2,'Reuse parsed charts');
assert.equal(picker.pick([blocked,broken]),null,'Never select blocked or malformed charts');
const cachedParses=parses;
assert.equal(picker.pick([blocked,broken,a],'A').title,'A','One playable entry still works');
assert.equal(parses,cachedParses,'Blocked and malformed entries are cached too');
assert.equal(picker.read(a).source,'Jazz 1460');
assert.equal(picker.read(a).route.source,'Jazz 1460 · iReal Pro');
assert.equal(picker.read({...a,text:'user data'}).source,'Мой импорт');

let catalogParses=0;
const catalogPicker=createStandardPicker(record=>{catalogParses++;return parseStoredChart(record);},()=>0);
const first=catalogPicker.pick(JAZZ_STANDARDS),second=catalogPicker.pick(JAZZ_STANDARDS,first.title);
assert(first.route.sequence.length&&second.route.sequence.length);
assert.notEqual(first.title,second.title);
assert(catalogParses<30,'Cold selection only inspects a small number of charts');

// Exercise the actual UI callbacks: native key initially, manual key and level
// across rerolls, and the same preferences when launching or restoring detail.
let nodes=new Map(),actions=new Map(),pageHTML='',restore,launched;
class Element{
  constructor(){this.children=[];this.value='';this.textContent='';}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=[...children];}
  add(option){this.children.push(option);if(option.selected)this.value=String(option.value);}
}
globalThis.document={getElementById:id=>nodes.get(id),createElement:()=>new Element()};
globalThis.Option=class{constructor(label,value,defaultSelected,selected){Object.assign(this,{label,value,selected});}};
globalThis.localStorage={getItem:()=>null};
const originalRandom=Math.random;Math.random=()=>0;
const library=createStandardsLibrary({
  overlay:html=>{pageHTML=html;actions=new Map();nodes=new Map([...html.matchAll(/id="([^"]+)"/g)].map(match=>[match[1],new Element()]));},
  action:(label,fn)=>actions.set(label,fn),
  enter:(_page,callback)=>{restore=callback;},
  start:(route,level)=>{launched={route,level};},back:()=>{},listen:()=>{},stop:()=>{}
});
library.open();
assert(pageHTML.indexOf('id="chart-random"')<pageHTML.indexOf('id="chart-search"'),'Random is visible before the search/results');
nodes.get('chart-search').value='Autumn Leaves';nodes.get('chart-search').oninput();
nodes.get('chart-list').children[0].onclick();
const nativeChart=parseStoredChart(JAZZ_STANDARDS.find(record=>record.title==='Autumn Leaves'));
assert.equal(Number(nodes.get('chart-key').value),nativeChart.route.key);
nodes.get('chart-key').value='2';nodes.get('chart-key').onchange();
nodes.get('chart-level').value='3';nodes.get('chart-level').onchange();
const previousTitle=nodes.get('chart-title').textContent;
nodes.get('chart-reroll').onclick();
assert.notEqual(nodes.get('chart-title').textContent,previousTitle);
assert.equal(nodes.get('chart-key').value,'2','Manual key survives random selection');
assert.equal(nodes.get('chart-level').value,'3','Pilot level survives random selection');
restore();assert.equal(nodes.get('chart-key').value,'2');assert.equal(nodes.get('chart-level').value,'3');
actions.get('LAUNCH · Лететь этот стандарт')();
assert.equal(launched.route.key,2);assert.equal(launched.level,3);
assert(launched.route.source.startsWith('Jazz 1460'));
library.open();assert.equal(nodes.get('chart-search').value,'Autumn Leaves','Search survives returning to library');
nodes.get('chart-list').children[0].onclick();
assert.equal(Number(nodes.get('chart-key').value),nativeChart.route.key,'A directly selected chart opens in its own key');
Math.random=originalRandom;
console.log(`Standards library checks passed: lazy cached selection (${catalogParses} parses for two cold picks), playable only, no immediate repeat, key/level retained, search and launch intact.`);
