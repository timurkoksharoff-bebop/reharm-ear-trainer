import assert from 'node:assert/strict';
import {createMelodyLibrary} from '../melody-library.mjs';
class Element{
  constructor(){this.children=[];this.value='';this.textContent='';this.disabled=false;}
  append(...items){this.children.push(...items);}replaceChildren(...items){this.children=[...items];}
  click(){if(!this.disabled)this.onclick?.();}
}
const oldDocument=globalThis.document,elements=new Map();
globalThis.document={getElementById:id=>elements.get(id),createElement:()=>new Element()};
let active=true,actions=[],menu='',lastOverlay='',launches=0;
const audio={calls:[],stop(){this.calls.push(['stop']);},unlock(){return Promise.resolve();},melody(...args){this.calls.push(['melody',...args]);}};
const overlay=html=>{lastOverlay=html;actions=[];elements.clear();for(const match of html.matchAll(/id="([^"]+)"/g))elements.set(match[1],new Element());};
const action=(label,fn)=>{const b=new Element();b.textContent=label;b.onclick=fn;actions.push(b);return b;};
const library=createMelodyLibrary({overlay,action,enter:id=>menu=id,back:()=>menu='back',audio,isActive:()=>active,launch:()=>launches++});
try{
  library.open();assert.equal(menu,'melodies');assert.match(lastOverlay,/200 джазовых мелодий/);assert.equal(elements.get('melody-list').children.length,20);
  elements.get('melody-search').value='All the Things';elements.get('melody-search').oninput();assert.equal(elements.get('melody-list').children.length,1);
  elements.get('melody-list').children[0].click();assert.equal(menu,'melody-detail');assert.equal(elements.get('melody-title').textContent,'All the things you are');
  actions.find(b=>b.textContent==='▶ Фрагмент').click();await Promise.resolve();assert.equal(audio.calls.at(-1)[0],'melody');assert.equal(audio.calls.at(-1)[4].full,false);
  actions.find(b=>b.textContent==='♫ Слушать тему').click();await Promise.resolve();assert.equal(audio.calls.at(-1)[4].full,true);
  actions.find(b=>b.textContent==='■ Стоп').click();assert.equal(elements.get('melody-playing').textContent,'Остановлено.');
  library.open();actions.find(b=>b.textContent==='Клавишник · испытание').click();assert.equal(launches,1);
  active=false;library.cancel();assert.equal(audio.calls.at(-1)[0],'stop');
}finally{globalThis.document=oldDocument;}
console.log('Melody library checks passed: 200-theme menu, search, excerpt/full listening, stop and launch.');
