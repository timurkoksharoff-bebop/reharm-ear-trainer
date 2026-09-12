import assert from 'node:assert/strict';
import {createMistakeLog,mistakeKey} from '../mistake-log.mjs';
import {createDebrief} from '../debrief.mjs';
import {chordAnswerKey,chordNotes} from '../music.mjs';
const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
let log=createMistakeLog(storage);
const chord={kind:'hydra',chord:{offset:7,quality:'7',intervals:[0,4,7,10],bassOffset:11},tonic:48};
log.record(chord);log.record(chord);log.record({kind:'mode',target:1,root:55,direction:'up'});
assert.equal(log.pendingCount,3);log=createMistakeLog(storage);assert.equal(log.pendingCount,3);
log.begin();assert.equal(log.pendingCount,0);assert.equal(log.remaining,2);assert.equal(log.remainingAnswers,5);assert.deepEqual(log.current().item,chord);
log.record({kind:'rhythm',target:3});log.record(chord);assert.equal(log.pendingCount,2);assert.equal(log.remaining,2);
const batchBeforeResume=log.snapshot().batch;
log=createMistakeLog(storage);log.begin();assert.deepEqual(log.snapshot().batch,batchBeforeResume,'Resume preserves order and progress');assert.equal(log.pendingCount,2,'New flight mistakes stay in next window');
log.answer(false);assert.equal(log.current().item.kind,'mode');
assert.equal(log.snapshot().history[mistakeKey(chord)].misses,4);assert.equal(log.remainingAnswers,5);
for(let i=0;i<12&&log.remaining;i++){
  const remaining=log.remainingAnswers;log.answer(true);assert.equal(log.remainingAnswers,remaining-1,'Every correct answer decreases the finite counter');
  const completed=log.completed;if(log.remaining){log.begin();assert.equal(log.completed,completed,'Resume does not reset completed topic count');}
}
assert.equal(log.remaining,0);assert.equal(log.completed,2);assert.equal(log.pendingCount,2);
log.begin();assert.equal(log.current().item.kind,'hydra');assert.equal(log.pendingCount,0);assert.equal(log.remainingAnswers,4);
log.answer(false);log=createMistakeLog(storage);assert.equal(log.remaining,2);
assert.notEqual(mistakeKey(chord),mistakeKey({...chord,chord:{...chord.chord,bassOffset:0}}));
// Browser API doubles exercise the real review controller, including its async
// unlock and timers; no duplicate quiz implementation is used here.
class Element{
  constructor(){this.children=[];this.dataset={};this.style={};this.disabled=false;this.textContent='';this.attributes={};const names=new Set();this.classList={add:(...values)=>values.forEach(v=>names.add(v)),toggle:(value,on)=>on?names.add(value):names.delete(value),contains:value=>names.has(value)};}
  append(child){this.children.push(child);}after(){}setAttribute(name,value){this.attributes[name]=value;}click(){if(!this.disabled)this.onclick?.();}
}
const oldDocument=globalThis.document,oldSetTimeout=globalThis.setTimeout,oldClearTimeout=globalThis.clearTimeout;
const timers=new Map();let timerID=0;
globalThis.setTimeout=(fn,delay)=>{timers.set(++timerID,{fn,delay});return timerID;};globalThis.clearTimeout=id=>timers.delete(id);
function harness(items){
  const data=new Map(),dom=new Map();let active=false,actions=[],restorer;
  globalThis.document={getElementById:id=>dom.get(id),createElement:()=>new Element()};
  const audio={calls:[],gate:null,stop(){this.calls.push(['stop']);},unlock(){return this.gate??Promise.resolve();},reviewFeedback(ok){this.calls.push(['feedback',ok]);}};
  for(const method of ['trainerChord','chordOnly','interval','scale','poly','rhythm','melody','guide','trumpetChord'])audio[method]=(...args)=>audio.calls.push([method,...args]);
  const review=createDebrief({storage:{getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)},audio,
    overlay:html=>{actions=[];dom.clear();for(const match of html.matchAll(/id="([^"]+)"/g))dom.set(match[1],new Element());},
    action:(label,fn)=>{const b=new Element();b.textContent=label;b.onclick=fn;actions.push(b);return b;},enter:(id,render)=>{restorer=render;},back:()=>{active=false;},setMode:()=>{active=true;},isActive:()=>active});
  items.forEach(item=>review.record(item));
  return {review,audio,dom,actions:()=>actions,choices:()=>dom.get('debrief-choices').children,action:prefix=>actions.find(b=>b.textContent.startsWith(prefix)),restore:()=>restorer(),deactivate:()=>{active=false;},last:method=>audio.calls.filter(call=>call[0]===method).at(-1)};
}
const flush=async()=>{await Promise.resolve();await Promise.resolve();};
const advance=()=>{const pending=[...timers.entries()];for(const [id,{fn}]of pending){timers.delete(id);fn();}};
try{
  const tones={kind:'tones',root:53,quality:'7',toneMode:'color',required:['9','13'],intervals:[0,4,7,10,14,21]};
  const h=harness([tones,{kind:'mode',target:1,root:55,direction:'down'}]);h.review.open();await flush();
  assert.deepEqual(h.last('trumpetChord').slice(1,3),[53,tones.intervals],'Entry autoplays exact heard extension voicing');
  const pick=id=>h.choices().find(b=>b.dataset.reviewAnswer===id);
  assert(h.action('Ответить').disabled);const initialAnswers=h.review.log.remainingAnswers;
  pick('9').click();assert.equal(h.review.log.remainingAnswers,initialAnswers);assert.equal(pick('9').attributes['aria-pressed'],'true');
  pick('9').click();assert.equal(pick('9').attributes['aria-pressed'],'false');assert(h.action('Ответить').disabled);
  pick('13').click();pick('9').click();assert.match(h.action('Ответить').textContent,/2 из 2/);assert.equal(h.review.log.remainingAnswers,initialAnswers,'Selection is not grading');
  h.action('Ответить').click();assert.equal(h.review.log.remainingAnswers,initialAnswers-1);assert.deepEqual(h.last('feedback'),['feedback',true]);assert(h.dom.get('debrief-feedback').classList.contains('review-correct'));
  assert([...timers.values()].some(t=>t.delay===1100));advance();await flush();assert.equal(h.last('scale')[1],55);assert.equal(h.last('scale')[3],'down','Next question autoplays its saved direction');h.review.cancel();

  const exact={...chord,tonic:53,level:2};const c=harness([exact]);c.review.open();await flush();
  assert.deepEqual(c.last('trainerChord').slice(1,3),[53,exact.chord]);
  const wrong=c.choices().find(b=>b.dataset.reviewAnswer!==chordAnswerKey(exact.chord));wrong.click();
  assert(c.dom.get('debrief-feedback').classList.contains('review-wrong'));assert.deepEqual(c.last('feedback'),['feedback',false]);assert.equal(timers.size,0,'Wrong answer waits for deliberate next');
  const historyAfterWrong=c.review.log.snapshot().history;const expected=c.choices().find(b=>b.dataset.reviewAnswer===chordAnswerKey(exact.chord));
  assert(expected.classList.contains('review-answer-correct'));assert(c.choices().some(b=>b.classList.contains('review-answer-wrong')));
  expected.click();await flush();assert.deepEqual(c.last('trainerChord').slice(1,3),[53,exact.chord]);assert.deepEqual(chordNotes(c.last('trainerChord')[2],53),chordNotes(exact.chord,53),'Audition retains imported slash bass');
  c.choices().find(b=>b.dataset.reviewAnswer!==expected.dataset.reviewAnswer).click();await flush();assert.notEqual(chordAnswerKey(c.last('trainerChord')[2]),chordAnswerKey(exact.chord),'Other buttons audition their own chord');assert.deepEqual(c.review.log.snapshot().history,historyAfterWrong,'Comparative audition never grades again');
  c.action('Продолжить позже').click();assert.equal(timers.size,0);

  const n=harness([{kind:'numbers',root:57,interval:7,direction:'down'}]);n.review.open();await flush();
  assert.deepEqual(n.last('interval').slice(1,4),[57,7,'down']);n.choices().find(b=>b.dataset.reviewAnswer!=='5').click();
  n.choices().find(b=>b.dataset.reviewAnswer==='5').click();await flush();assert.deepEqual(n.last('interval').slice(1,4),[57,7,'down']);n.review.cancel();

  const t=harness([tones]);t.review.open();await flush();t.choices().find(b=>b.dataset.reviewAnswer==='3').click();t.action('Ответить').click();
  t.choices().find(b=>b.dataset.reviewAnswer==='9').click();await flush();assert.deepEqual(t.last('chordOnly').slice(1,3),[53,[14]],'Tone audition uses the extension octave actually heard');t.review.cancel();

  const stale=harness([{kind:'numbers',root:60,interval:7,direction:'up'}]);let release;
  stale.audio.gate=new Promise(resolve=>{release=resolve;});stale.review.open();stale.review.cancel();stale.deactivate();release();await flush();assert.equal(stale.last('interval'),undefined,'Leaving before audio unlock cannot start a stale prompt');
  stale.audio.gate=null;stale.review.open();await flush();stale.choices().find(b=>b.dataset.reviewAnswer==='5').click();assert(timers.size);stale.action('Продолжить позже').click();assert.equal(timers.size,0,'Leaving after correct cancels auto-advance');
  stale.review.open();await flush();const resumed=stale.review.log.remainingAnswers;advance();assert.equal(stale.review.log.remainingAnswers,resumed,'Old timer cannot consume resumed question');stale.review.cancel();
}finally{globalThis.document=oldDocument;globalThis.setTimeout=oldSetTimeout;globalThis.clearTimeout=oldClearTimeout;}
console.log('Debrief checks passed: finite counters, isolated/resumable batches, autoplay and feedback, multiselect submission, exact comparative audio and cancelled stale timers.');
