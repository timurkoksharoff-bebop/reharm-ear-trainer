import {gardenQualityLabel,gardenDegreeLabel} from './garden-harmony.mjs';
import {GARDEN_MODES,gardenModeById,gardenModeTier,gardenModeFormula,gardenModeVerdict,gardenModeExplanation} from './garden-modes.mjs';

const FOUNDATION=['ionian','dorian','mixolydian','lydian','aeolian'];
const NEXT=['melodic-minor','harmonic-minor','lydian-dominant','locrian-n2','phrygian-dominant','altered','diminished-hw','whole-tone'];
const KEY='ear-yoga-professor-teacher.v1';
const clean=()=>({version:1,flight:0,modes:{},patterns:{},seenLessons:[],lessonHistory:[],lastLesson:null,preflight:true});
export class GardenProfessorTeacher{
 constructor({storage=null,random=Math.random}={}){this.storage=storage;this.random=random;this.data=clean();try{const d=JSON.parse(storage?.getItem(KEY)||'null');if(d?.version===1)this.data={...clean(),...d};}catch{}this.dedupe=new Set();}
 save(){try{this.storage?.setItem(KEY,JSON.stringify(this.data));}catch{}}
 beginFlight(route){this.route=String(route||'unknown');this.data.flight++;this.dedupe.clear();this.save();}
 record({kind='mode',id,chord,position=0,verdict,boundary=false,reason='',conflicts=[],assisted=false}={}){
  if(boundary||assisted||!chord||!['compatible','invalid','correct','wrong'].includes(verdict))return false;
  const quality=String(chord.quality||'?'),offset=Number(chord.offset)||0,slot=this.route+'|'+position;
  // One intentional decision per item/context/position in a flight, not each
  // animation frame or collision. A later flight can demonstrate improvement.
  const good=verdict==='compatible'||verdict==='correct';
  const key=[kind,id,quality,offset,slot,good?'good':'bad'].join('|');if(this.dedupe.has(key))return false;this.dedupe.add(key);
  if(good)for(const [patternKey,row] of Object.entries(this.data.patterns)){if(row.kind===kind&&row.quality===quality&&(row.id===id||(kind==='answer'&&row.reason===reason))){row.recovery=(row.recovery||0)+1;if(row.recovery>=3)delete this.data.patterns[patternKey];}}
  if(kind==='mode'){
   if(!gardenModeById(id))return false;
   const row=this.data.modes[id]||{good:0,bad:0,recent:[],contexts:[]};
   row[good?'good':'bad']++;row.recent=[...row.recent,good?1:0].slice(-20);row.contexts=[...new Set([...row.contexts,slot])].slice(-30);this.data.modes[id]=row;
  }
  // Retain only recurring, explainable difficulties, not a raw error counter.
  if(!good){const tones=conflicts.map(t=>t.label).sort().join(',');const pkey=[kind,id,quality,reason,tones].join('|');const row=this.data.patterns[pkey]||{kind,id,quality,reason,conflicts:conflicts.map(t=>({label:t.label,expected:t.expected})),contexts:[],count:0};row.count++;row.contexts=[...new Set([...row.contexts,slot])].slice(-30);this.data.patterns[pkey]=row;
   const entries=Object.entries(this.data.patterns).sort((a,b)=>b[1].count-a[1].count).slice(0,100);this.data.patterns=Object.fromEntries(entries);
  }
  this.save();return true;
 }
 mastered(id){const r=this.data.modes[id];return Boolean(r&&r.recent.length>=8&&r.recent.reduce((a,b)=>a+b,0)/r.recent.length>=.8&&r.contexts.length>=3);}
 stage(){const mastered=FOUNDATION.filter(id=>this.mastered(id)).length,total=Object.values(this.data.modes).reduce((n,r)=>n+r.good,0);return mastered>=4&&total>=40?2:mastered>=2?1:0;}
 nextMode(){const order=[...NEXT,...GARDEN_MODES.filter(m=>!FOUNDATION.includes(m.id)&&!NEXT.includes(m.id)).map(m=>m.id)];return order.find(id=>!this.mastered(id))||'altered';}
 weight(mode){
  const stage=this.stage(),row=this.data.modes[mode.id],tier=gardenModeTier(mode).id;
  if(FOUNDATION.includes(mode.id))return this.mastered(mode.id)?.72:1;
  // Nothing selected in Settings is locked. Advanced exposure increases only
  // after evidence, and the next unmastered topic is gently emphasised.
  let factor=tier==='rare'?[.45,1.5,5][stage]:[.65,2.5,4][stage];
  if(mode.id===this.nextMode())factor*=stage?2:1;
  if(row?.recent.length>=4&&row.recent.reduce((a,b)=>a+b,0)/row.recent.length<.5)factor*=.75;
  return factor;
 }
 lessonSeen(id){if(!this.data.seenLessons.includes(id)){this.data.seenLessons.push(id);this.save();}}
 // Lesson rotation is separate from the adaptive flight recommendation. Merely
 // reading snapshot() must never consume the next random topic. Route context
 // and family settings still bound the pool; reviewed lessons can return later.
 randomLesson(chords=null,families=null){
  const eligible=GARDEN_MODES.filter(m=>(!families||families.includes(m.family))&&(!chords?.length||chords.some(c=>gardenModeVerdict(c,m).verdict==='compatible')));
  if(!eligible.length)return null;
  const ids=new Set(eligible.map(m=>m.id));
  let history=Array.isArray(this.data.lessonHistory)?this.data.lessonHistory.filter(id=>gardenModeById(id)):[];
  let pool=eligible.filter(m=>!history.includes(m.id));
  if(!pool.length){history=history.filter(id=>!ids.has(id));pool=eligible;}
  const different=pool.filter(m=>m.id!==this.data.lastLesson);if(different.length)pool=different;
  const draw=Number(this.random()),index=Math.max(0,Math.min(pool.length-1,Math.floor((Number.isFinite(draw)?draw:0)*pool.length))),id=pool[index].id;
  this.data.lessonHistory=[...new Set([...history,id])];this.data.lastLesson=id;this.save();return id;
 }
 recommendation(chords=null,families=null){const preferred=this.stage()?this.nextMode():FOUNDATION.find(id=>!this.mastered(id))||'dorian';if(!chords?.length)return preferred;const eligible=GARDEN_MODES.filter(m=>(!families||families.includes(m.family))&&chords.some(c=>gardenModeVerdict(c,m).verdict==='compatible'));return eligible.find(m=>m.id===preferred)?.id||eligible.find(m=>!this.data.seenLessons.includes(m.id)&&!this.mastered(m.id))?.id||eligible[0]?.id||null;}
 report(){return Object.values(this.data.patterns).filter(r=>r.count>=3&&r.contexts.length>=2).sort((a,b)=>b.count-a.count).slice(0,5);}
 snapshot(){return {stage:this.stage(),mastered:GARDEN_MODES.filter(m=>this.mastered(m.id)).map(m=>m.id),recommendation:this.recommendation(),patterns:this.report(),modes:JSON.parse(JSON.stringify(this.data.modes))};}
}
const LESSON_CHORDS=[['maj7','Cmaj7',[0,4,7,11]],['m7','Cm7',[0,3,7,10]],['7','C7',[0,4,7,10]],['mMaj7','Cm(maj7)',[0,3,7,11]],['m7b5','Cm7♭5',[0,3,6,10]],['dim7','Cdim7',[0,3,6,9]],['augMaj7','Cmaj7♯5',[0,4,8,11]],['7sharp5','C7♯5',[0,4,8,10]],['7b9','C7♭9',[0,4,7,10,1]],['7sus4','C7sus4',[0,5,7,10]],['m6','Cm6',[0,3,7,9]],['maj','C',[0,4,7]],['min','Cm',[0,3,7]],['aug','C+',[0,4,8]]];
export function gardenProfessorLesson(mode){
 const preferred={'altered':'7alt','lydian':'maj7sharp11','lydian-dominant':'ireal:7#11','phrygian-dominant':'7b9b13'};
 const recipes=[...LESSON_CHORDS,['7alt','C7alt',[0,4,6,10,1]],['maj7sharp11','Cmaj7(♯11)',[0,4,7,11,6]],['ireal:7#11','C7(♯11)',[0,4,7,10,6]],['7b9b13','C7(♭9,♭13)',[0,4,7,10,1,8]]];
 const candidates=recipes.map(([quality,label,tones])=>({quality,label,tones,result:gardenModeVerdict({offset:0,quality,notes:tones.map(n=>60+n)},mode,{tonic:0})}));
 candidates.sort((a,b)=>Number(b.quality===preferred[mode.id])-Number(a.quality===preferred[mode.id]));
 const example=candidates.find(c=>c.result.verdict==='compatible')||candidates.find(c=>c.tones.every(n=>mode.notes.includes(n)))||[...candidates].sort((a,b)=>b.tones.filter(n=>mode.notes.includes(n)).length/b.tones.length-a.tones.filter(n=>mode.notes.includes(n)).length/a.tones.length)[0];
 const aliases={'phrygian-dominant':'Phrygian dominant · Mixolydian ♭2 ♭6 · фригийский мажорный','lydian-dominant':'Lydian dominant · Mixolydian ♯4','locrian-n2':'Locrian ♮2 · Aeolian ♭5','dorian-b2':'Dorian ♭2 · Phrygian ♮6','altered':'Altered · Super Locrian'};
 const advice={ionian:['4 — мелодическая ступень; не удерживай её как 11 над большой терцией.','Use 4 melodically; avoid holding it as 11 against the major third.'],dorian:['Малая терция и ♭7 задают минор, натуральная 6 отличает от эолийского.','Minor third and ♭7 define the minor sound; natural 6 distinguishes it from Aeolian.'],lydian:['♯4 даёт ♯11; натуральная 11 принадлежит другой краске.','♯4 gives ♯11; natural 11 is a different colour.'],mixolydian:['Большая терция и ♭7 задают доминантовую основу.','Major third and ♭7 define the dominant foundation.'],aeolian:['Натуральный минор: ♭6 отличается от дорийской 6.','Natural minor: ♭6 differs from the Dorian 6.'],'phrygian-dominant':['Большая терция, ♭2 и ♭6: доминантовая краска ♭9/♭13, не натуральная 9.','Major third, ♭2 and ♭6: a ♭9/♭13 dominant colour, not natural 9.'],'lydian-dominant':['Большая терция, ♭7 и ♯4: C7(♯11); натуральная 11 не входит в этот лад.','Major third, ♭7 and ♯4: C7(♯11); natural 11 is outside this scale.'],altered:['В доминантовой записи слышны ♭9, ♯9, ♭5 и ♯5. Натуральная 5 отсутствует; полная раскладка C7 может требовать замены квинты.','Dominant spelling gives ♭9, ♯9, ♭5 and ♯5. Natural 5 is absent; a full C7 voicing may need its fifth changed.']};
 const generic=mode.family==='pentatonic'?['Пять звуков не описывают весь аккорд: пропуск ступени не означает конфликт.','Five pitches do not describe the entire chord: an omitted degree is not a conflict.']:['Сравни опорные тоны аккорда с формулой. Совпадение набора не определяет функцию и голосоведение в последовательности.','Compare the chord tones with the formula. A matching collection does not determine function or voice leading in a progression.'];
 const passing=['blues','eight'].includes(mode.family)?['Проходящие и блюзовые звуки зависят от фразы; этот пример — прослушивание, а не универсальное разрешение всех надстроек.','Passing and blue notes depend on phrasing; this is an audition, not blanket permission for every tension.']:null;
 return {mode,example,aliases:aliases[mode.id]||mode.en,advice:advice[mode.id]||passing||generic,compatible:example.result.verdict==='compatible'};
}

export function mountGardenProfessorTeacher({teacher,pad,language,audition,onPause,onResume}={}){
 const dialog=document.createElement('dialog');dialog.id='professor-lesson';dialog.dataset.userContent='';document.body.append(dialog);let selected=teacher.recommendation(),resume=null,tab='lesson',audioGeneration=0;
 const en=()=>language.get()==='en',t=(ru,eng)=>en()?eng:ru;
 const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 const button=(text,fn)=>{const b=node('button',text);b.type='button';b.onclick=fn;return b;};
 const stop=()=>{audioGeneration++;pad.stop(true);};
 const close=()=>{if(dialog.open)dialog.close();};
 let fallbackSound={preset:'mixed',arpeggioPercent:25,combinedPercent:25,rhythm:'lively'};
 const soundConfig=()=>audition?.snapshot?.()||{...fallbackSound};
 const setSound=patch=>{stop();if(audition?.set)return audition.set(patch);fallbackSound={...fallbackSound,...patch};return soundConfig();};
 const listen=async kind=>{stop();const generation=audioGeneration,lesson=gardenProfessorLesson(gardenModeById(selected));try{await pad.unlock();if(generation!==audioGeneration||!dialog.open)return;const chord={offset:0,quality:lesson.example.quality,notes:[48,...lesson.example.tones.map(n=>60+n)]};if(kind!=='scale')await pad.play(chord,0,{barSeconds:4});if(generation!==audioGeneration||!dialog.open)return;if(kind!=='chord'){const configured=kind==='configured'||kind==='zero',config=soundConfig();pad.previewScale([...lesson.mode.notes,12].map(n=>60+n),{remaining:3.4,phrasing:configured?'configured':kind==='phrase'?'improv':'exercise',audition:configured?(kind==='zero'?{...config,preset:'zero'}:config):undefined,modeId:selected,chord,tonic:0,barSeconds:4});}}catch{const status=dialog.querySelector('.lesson-status');if(status)status.textContent=t('Не удалось включить звук. Нажми ещё раз.','Audio could not start. Try again.');}};
 function renderSound(){
  const config=soundConfig();
  dialog.append(node('h2',t('Как звучат лады','How scales sound')),node('p',t('Выбери свой вариант перед полётом. Настройки сохраняются на этом устройстве.','Choose your sound before flying. Settings stay on this device.'),'sound-intro'));
  const form=node('div',null,'mode-sound-form');
  const question=(number,title)=>{const field=node('fieldset',null,'mode-sound-question');field.append(node('legend',number+' · '+title));form.append(field);return field;};
  const first=question(1,t('Какой вариант?','Which version?')),preset=node('select');preset.id='mode-sound-preset';preset.setAttribute('aria-label',t('Вариант звучания ладов','Scale sound version'));
  for(const [value,ru,eng]of [['mixed','Смешанный','Mixed'],['zero','Фраза 0 · первый вариант','Phrase 0 · original'],['scale','Только гаммы · по ступеням','Scales only · stepwise']]){const option=node('option',t(ru,eng));option.value=value;preset.append(option);}preset.value=config.preset;first.append(preset);preset.onchange=()=>{setSound({preset:preset.value});render();};
  const second=question(2,t('Сколько каждого типа?','How much of each?'));second.disabled=config.preset!=='mixed';
  const summary=node('p',null,'mode-sound-summary'),rangeControls=[];
  const slider=(key,ru,eng)=>{const label=node('label',null,'mode-sound-slider'),caption=node('span',t(ru,eng)),value=node('output'),input=node('input');input.type='range';input.id='mode-sound-'+key;input.min='0';input.max='100';input.step='5';input.value=String(config[key]);input.setAttribute('aria-label',t(ru,eng));value.htmlFor=input.id;label.append(caption,value,input);second.append(label);rangeControls.push({key,input,value});input.oninput=()=>{const patch={[key]:Number(input.value)},other=key==='arpeggioPercent'?'combinedPercent':'arpeggioPercent';if(patch[key]+Number(soundConfig()[other])>100)patch[other]=100-patch[key];updateMix(setSound(patch));};};
  const updateMix=current=>{for(const control of rangeControls){control.input.value=String(current[control.key]);control.value.textContent=current[control.key]+'%';}const phrases=Math.max(0,100-current.arpeggioPercent-current.combinedPercent);summary.textContent=t('Фразы ','Phrases ')+phrases+'% · '+t('Арпеджио ','Arpeggios ')+current.arpeggioPercent+'% · '+t('Совмещённые ','Combined ')+current.combinedPercent+'%';};
  slider('arpeggioPercent','Арпеджио','Arpeggios');slider('combinedPercent','Фраза + арпеджио','Phrase + arpeggio');second.append(summary);updateMix(config);
  const third=question(3,t('Какой ритм?','Which rhythm?')),rhythm=node('select');third.disabled=config.preset!=='mixed';rhythm.id='mode-sound-rhythm';rhythm.setAttribute('aria-label',t('Ритм ладовых фраз','Scale phrase rhythm'));
  for(const [value,ru,eng]of [['lively','Живой · акценты и паузы','Lively · accents and rests'],['steady','Ровный','Steady'],['free','Свободный','Free']]){const option=node('option',t(ru,eng));option.value=value;rhythm.append(option);}rhythm.value=config.rhythm;rhythm.onchange=()=>setSound({rhythm:rhythm.value});third.append(rhythm);
  form.append(node('p',t('По умолчанию: 50% фраз, 25% арпеджио и 25% совмещённых; если времени мало, прозвучит короткий законченный вариант.','Default: 50% phrases, 25% arpeggios and 25% combined; short windows use a brief, complete idea.'),'mode-sound-note'));
  const lesson=gardenProfessorLesson(gardenModeById(selected));form.append(node('p',t('Пример: ','Example: ')+(en()?lesson.mode.en:lesson.mode.ru).split(' / ')[0]+' · '+lesson.example.label,'mode-sound-example'));
  const controls=node('div',null,'lesson-controls mode-sound-preview');controls.append(button(t('Послушать мой вариант','Preview my sound'),()=>listen('configured')),button(t('Сравнить: Фраза 0','Compare: Phrase 0'),()=>listen('zero')));form.append(controls,node('p',' ','lesson-status'));dialog.append(form);
 }
 function render(){stop();dialog.replaceChildren();const header=node('header');header.append(node('small',t('МАСТЕР · МАСТЕРСКАЯ СЛУХА','MASTER · EAR WORKSHOP')),button('×',close));dialog.append(header);
 const nav=node('nav');for(const [id,ru,eng]of [['lesson','Лады','Scales'],['report','Разбор полётов','Flight review'],['sound','Звучание','Sound']]){const control=button(t(ru,eng),()=>{tab=id;render();});control.setAttribute('aria-pressed',String(tab===id));nav.append(control);}dialog.append(nav);
 if(tab==='sound')renderSound();
 else if(tab==='report'){
  dialog.append(node('h2',t('Повторяющиеся затруднения','Recurring difficulties')),node('p',t('Показываем только повторения: минимум три выбора в двух разных позициях маршрутов. Случайные захваты и спорные сочетания не превращаются в список ошибок.','Only repeated patterns: at least three choices across two route positions. Accidental pickups and contextual combinations do not become an error list.')));
  dialog.append(node('p',t('Устойчиво освоено: ','Consistently learned: ')+teacher.snapshot().mastered.length+' / '+GARDEN_MODES.length+' · '+t('Новый материал добавляется постепенно.','New material is introduced gradually.')));
  const report=teacher.report();if(!report.length)dialog.append(node('p',t('Пока устойчивых затруднений не видно. Продолжай летать.','No persistent difficulties yet. Keep flying.')));
  for(const row of report){const mode=gardenModeById(row.id),card=node('section',null,'teacher-pattern');const [answerKind,answerValue]=String(row.id).split(':');const choice=row.kind==='answer'?(answerKind==='quality'?gardenQualityLabel(answerValue):(answerKind==='bass'?t('Бас ','Bass '):t('Ступень ','Root '))+gardenDegreeLabel(answerValue)):row.id;card.append(node('strong',(mode?(en()?mode.en:mode.ru):choice)+' · C'+gardenQualityLabel(row.quality)));const conflict=row.conflicts.map(c=>c.label+(c.expected?' → '+c.expected:'')).join(', ');card.append(node('p',conflict||gardenModeExplanation(row.reason,en())||(row.kind==='tension'?t('Как отдельная надстройка это сочетание здесь конфликтует. В составе лада и мелодической фразы правила могут отличаться.','This standalone tension conflicts here. A scale or melodic phrase can have different rules.'):t('Проверь опорные тоны и независимый бас.','Check guide tones and independent bass.'))));card.append(node('small',t('Повторяется в нескольких позициях.','Repeated across several positions.')));if(mode)card.append(button(t('Посмотреть урок','Open lesson'),()=>{selected=mode.id;tab='lesson';render();}));dialog.append(card);}
 }else{
  const select=node('select');select.setAttribute('aria-label',t('Выбрать лад','Choose a scale'));for(const m of GARDEN_MODES){const option=node('option',en()?m.en:m.ru);option.value=m.id;select.append(option);}select.value=selected;select.onchange=()=>{selected=select.value;render();};dialog.append(select);
  const lesson=gardenProfessorLesson(gardenModeById(selected)),m=lesson.mode;
  dialog.append(node('h2',(en()?m.en:m.ru).split(' / ')[0]),node('p',lesson.aliases,'lesson-aliases'),node('p',gardenModeFormula(m),'lesson-formula'));
  const keys=node('div',null,'lesson-keyboard');keys.setAttribute('role','img');keys.setAttribute('aria-label',t('Бирюзовый — аккорд, золотой — лад; два цвета — совпадение.','Turquoise: chord, gold: scale; both colours: shared pitch.'));
  for(let i=0;i<=12;i++){const k=node('div',null,'lesson-key'+([1,3,6,8,10].includes(i%12)?' black':''));k.append(node('small',['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B','C'][i]));if(lesson.example.tones.includes(i%12))k.append(node('i',null,'chord-dot'));if(m.notes.includes(i%12))k.append(node('i',null,'scale-dot'));keys.append(k);}dialog.append(keys);
  const legend=node('p',null,'lesson-legend');legend.append(node('span',t('● Аккорд','● Chord'),'legend-chord'),document.createTextNode(' · '),node('span',t('● Лад','● Scale'),'legend-scale'),document.createTextNode(t(' · две точки — общий звук',' · two dots: shared pitch')));dialog.append(legend);
  dialog.append(node('p',t('Пример в C: ','Example in C: ')+lesson.example.label+(lesson.compatible?t(' · опорные тоны совпадают',' · guide tones agree'):t(' · контекстная окраска, слушай сочетание',' · contextual colour; listen to the combination'))));
  dialog.append(node('p',lesson.advice[en()?1:0]));const controls=node('div',null,'lesson-controls');controls.append(button(t('Лад','Scale'),()=>listen('scale')),button(t('Аккорд','Chord'),()=>listen('chord')),button(t('Вместе','Together'),()=>listen('together')),button(t('Фраза 0','Phrase 0'),()=>listen('zero')),button(t('Мой вариант','My sound'),()=>listen('configured')));dialog.append(controls,node('p',' ','lesson-status'));
  const stats=teacher.data.modes[m.id];dialog.append(node('small',teacher.mastered(m.id)?t('Устойчивый результат в нескольких позициях','Consistent across several positions'):stats?t('Изучается · выборов: ','Learning · choices: ')+(stats.good+stats.bad):t('Новый материал','New material')));
  dialog.append(button(t('Урок понятен','Mark lesson reviewed'),()=>{teacher.lessonSeen(m.id);render();}));
 }
 const foot=node('footer'),toggle=node('label'),input=node('input');input.type='checkbox';input.checked=teacher.data.preflight;input.onchange=()=>{teacher.data.preflight=input.checked;teacher.save();};toggle.append(input,document.createTextNode(t('Короткий урок перед полётом','Short lesson before each flight')));foot.append(toggle,button(resume?t('Начать полёт','Start flight'):t('Закрыть','Close'),close));dialog.append(foot);
 }
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 // Native dialog.close() queues its close event. Release lesson audio in that
 // event before handing the pad back: a later cleanup must not kill the new
 // route's tonic (or the chord resumed after an optional lesson).
 dialog.addEventListener('close',()=>{stop();const next=resume;resume=null;if(next)next();else onResume?.();});
 return {open({modeId,next,report=false}={}){if(dialog.open)return;onPause?.();selected=modeId||(report?selected:teacher.randomLesson());resume=next||null;tab=report?'report':'lesson';render();dialog.showModal();},get isOpen(){return dialog.open;}};
}
