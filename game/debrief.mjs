import {createMistakeLog} from './mistake-log.mjs';
import {QUALITIES,INTERVALS,chordSymbol,chordAnswerKey} from './music.mjs';
import {MODES,MELODIES,RHYTHMS,RUDIMENTS,NUMBER_LABELS,NUMBER_OFFSETS,TONE_OFFSETS,rudimentScore} from './expedition.mjs';
const titles={hydra:'Аккорды',chord:'Тип аккорда',mode:'Лады',melody:'Мелодии',rhythm:'Ритмы',poly:'Рудименты',numbers:'Интервалы',guide:'Гайд-тоны',tones:'Тоны аккорда'};
const legacyMelodyNames=['Afro Blue','All the Things You Are','Autumn Leaves','Blue Bossa','When the Saints','Amazing Grace','Ode to Joy','Greensleeves'];
export function normalizeMelodyMistake(item,bank=MELODIES){
  if(item.kind!=='melody')return item;
  const name=item.melodyName??(!item.melodyId?legacyMelodyNames[item.target]:null);
  const target=bank.findIndex(m=>item.melodyId?m.id===item.melodyId:m.name.toLowerCase()===name?.toLowerCase());
  // Retired inaccurate excerpts must not be replayed as a different standard.
  if(target<0)return null;
  return {...item,target,melodyId:bank[target].id,melodyName:bank[target].name};
}
export function createDebrief({storage,audio,overlay,action,enter,back,setMode,isActive}){
  const log=createMistakeLog(storage,normalizeMelodyMistake),el=id=>document.getElementById(id);
  let entry=null,choices=[],correctIds=[],chosen=new Set(),revealed=false,lastCorrect=false,playToken=0,questionToken=0,advanceTimer=null,answerButton=null;
  const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const name=(item,id)=>item.kind==='hydra'?chordSymbol(id):item.kind==='chord'?QUALITIES[id]?.glyph??id:item.kind==='mode'?MODES[id]?.name:item.kind==='melody'?MELODIES[id]?.name:item.kind==='rhythm'?RHYTHMS[id]?.name:item.kind==='poly'?RUDIMENTS[id]?.name:id;
  function setup(){
    entry=log.current();chosen=new Set();revealed=false;lastCorrect=false;if(!entry)return;
    const item=entry.item;
    if(item.kind==='hydra'){
      const c=item.chord,key=chordAnswerKey(c),level=item.level??1;
      const degrees=level===0?[0,7]:level===1?[0,5,7,9]:[0,2,4,5,7,9,11];
      const qualities=level===0?['maj']:level===1?['maj','min','6','m7','7sus4']:['maj','min','7','maj7','m7','dim7','m7b5','7sus4'];
      const pool=[c,...qualities.map(quality=>({offset:c.offset,quality})),...degrees.map(offset=>({...c,offset}))];
      const unique=[...new Map(pool.map(ch=>[chordAnswerKey(ch),ch])).values()];
      choices=shuffle([c,...shuffle(unique.filter(ch=>chordAnswerKey(ch)!==key)).slice(0,5)]).map(ch=>({id:chordAnswerKey(ch),label:chordSymbol(ch),chord:ch}));correctIds=[key];
    }else if(item.kind==='numbers'){
      const target=NUMBER_LABELS.find(label=>NUMBER_OFFSETS[label]===item.interval);correctIds=[target];
      choices=shuffle([target,...shuffle(NUMBER_LABELS.filter(label=>NUMBER_OFFSETS[label]!==item.interval)).slice(0,5)]).map(id=>({id,label:id}));
    }else if(item.kind==='guide'){correctIds=[item.target];choices=['3','7'].map(id=>({id,label:id}));}
    else if(item.kind==='tones'){correctIds=[...item.required];choices=Object.keys(TONE_OFFSETS).map(id=>({id,label:id}));}
    else{
      const bank=item.kind==='chord'?QUALITIES:item.kind==='mode'?MODES:item.kind==='melody'?MELODIES:item.kind==='poly'?RUDIMENTS:RHYTHMS;
      const pool=Array.isArray(bank)?bank.map((_,i)=>i):Object.keys(bank),target=item.target;correctIds=[target];
      choices=shuffle([target,...shuffle(pool.filter(id=>id!==target)).slice(0,5)]).map(id=>({id,label:name(item,id)}));
    }
  }
  function open(){
    enter('debrief',restore);setMode();cancel();log.begin();setup();render();play();
  }
  function cancel(){clearTimeout(advanceTimer);advanceTimer=null;++questionToken;++playToken;audio.stop();}
  function leave(){cancel();back();}
  function restore(){setMode();cancel();setup();render();play();}
  function next(){if(!isActive())return;cancel();setup();render();play();}
  function render(){
    answerButton=null;const viewToken=questionToken;
    overlay('<span class="eyebrow">РАЗБОР ПОЛЁТА · БЕЗ ТАЙМЕРА</span><h2>Работа над ошибками</h2><p id="debrief-progress" class="compact"></p><p id="debrief-prompt"></p><div id="debrief-choices" class="study-choices trainer-chord-choices"></div><p id="debrief-feedback" class="compact" role="status"></p>');
    if(!entry){el('debrief-progress').textContent=log.completed?`Разобрано тем: ${log.completed}. Осталось ответов: 0. Все задания этого разбора пройдены.`:'Пока нет ошибок для разбора. Игра собирает их во время полётов.';if(log.pendingCount)action(`Новый разбор · ${log.pendingCount} ошибок`,open);action('Назад',leave,true);return;}
    const item=entry.item;
    el('debrief-progress').textContent=`${titles[item.kind]||item.kind} · осталось верных ответов: ${log.remainingAnswers} · тем: ${log.remaining} · завершено тем: ${log.completed}`;
    el('debrief-prompt').textContent=item.kind==='tones'?`${item.chordName||QUALITIES[item.quality]?.glyph} · выбери ${correctIds.length} ${item.toneMode==='guide'?'гайд-тонa':'тона'} и нажми «Ответить».`:item.kind==='hydra'?'Сначала тоника, затем тот аккорд, на котором возникла ошибка.':'Послушай пример из твоего полёта и выбери ответ.';
    for(const choice of choices){const b=document.createElement('button');b.type='button';b.textContent=choice.label;b.dataset.reviewAnswer=String(choice.id);b.disabled=revealed&&lastCorrect;
      b.classList.toggle('selected',!revealed&&chosen.has(choice.id));
      b.classList.toggle('review-answer-correct',revealed&&correctIds.includes(choice.id));
      b.classList.toggle('review-answer-wrong',revealed&&chosen.has(choice.id)&&!correctIds.includes(choice.id));
      if(item.kind==='tones')b.setAttribute('aria-pressed',String(!revealed&&chosen.has(choice.id)));
      if(item.kind==='poly'){const img=document.createElement('img');img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(rudimentScore(RUDIMENTS[choice.id]));img.alt=RUDIMENTS[choice.id].sticking;img.style.cssText='display:block;width:100%;max-height:90px';b.append(img);}
      b.onclick=()=>{if(!isActive()||viewToken!==questionToken)return;if(revealed){audition(choice);return;}if(item.kind==='tones'){chosen.has(choice.id)?chosen.delete(choice.id):chosen.add(choice.id);b.classList.toggle('selected',chosen.has(choice.id));b.setAttribute('aria-pressed',String(chosen.has(choice.id)));updateSelection();}else submit([choice.id]);};el('debrief-choices').append(b);
    }
    if(!revealed||!lastCorrect)action('▶ Слушать ещё раз',play,true);
    if(item.kind==='tones'&&!revealed){answerButton=action('Ответить',()=>submit([...chosen]));updateSelection();}
    if(revealed){el('debrief-feedback').textContent=`${lastCorrect?'✓ ВЕРНО!':'✕ НЕВЕРНО. Задание вернётся на повтор.'} Правильный ответ: ${choices.filter(c=>correctIds.includes(c.id)).map(c=>c.label).join(' · ')}`;el('debrief-feedback').classList.add(lastCorrect?'review-correct':'review-wrong');action('Дальше →',next);}
    if(revealed&&!lastCorrect){const note=document.createElement('p');note.className='compact';note.textContent='Нажимай варианты: теперь они звучат для сравнения, без штрафов.';el('debrief-choices').after(note);}
    action('Продолжить позже',leave,true);
  }
  function updateSelection(){if(answerButton){answerButton.textContent=`Ответить · выбрано ${chosen.size} из ${correctIds.length}`;answerButton.disabled=!chosen.size;}}
  function submit(ids){
    if(revealed||!isActive()||!ids.length)return;
    chosen=new Set(ids);
    lastCorrect=ids.length===correctIds.length&&correctIds.every(id=>ids.includes(id));revealed=true;
    ++playToken;audio.stop();log.answer(lastCorrect);render();
    audio.reviewFeedback?.(lastCorrect);
    if(lastCorrect){const token=questionToken;advanceTimer=setTimeout(()=>{if(token===questionToken&&isActive()&&revealed&&lastCorrect)next();},1100);}
  }
  async function audition(choice){
    if(!entry||!revealed||lastCorrect||!isActive())return;
    const token=++playToken,item=entry.item;audio.stop();
    try{await audio.unlock();if(token!==playToken||!isActive())return;
    const done=()=>{},root=item.root??60;
    if(item.kind==='hydra')audio.trainerChord(item.tonic,choice.chord,done);
    else if(item.kind==='chord')audio.chordOnly(root,INTERVALS[choice.id],done);
    else if(item.kind==='numbers')audio.interval(root,NUMBER_OFFSETS[choice.id],item.direction||'up',done);
    else if(item.kind==='mode')audio.scale(root,MODES[choice.id],item.direction||'up',done);
    else if(item.kind==='poly')audio.poly(RUDIMENTS[choice.id],done);
    else if(item.kind==='rhythm')audio.rhythm(RHYTHMS[choice.id],done,{loops:1});
    else if(item.kind==='melody')audio.melody(root,MELODIES[choice.id],done);
    else if(item.kind==='guide')audio.guide(root,choice.id,done);
    else{const offset=TONE_OFFSETS[choice.id],heard=item.intervals?.find(interval=>interval%12===offset);audio.chordOnly(root,[heard??offset],done);}
    }catch(e){audioError(e,token);}
  }
  async function play(){
    if(!entry||!isActive())return;const token=++playToken,item=entry.item;
    audio.stop();
    try{await audio.unlock();if(token!==playToken||!isActive())return;
      const done=()=>{};
      if(item.kind==='hydra')audio.trainerChord(item.tonic,item.chord,done);
      else if(item.kind==='numbers')audio.interval(item.root??60,item.interval,item.direction||'up',done);
      else if(item.kind==='guide')audio.guide(item.root??60,item.target,done);
      else if(item.kind==='tones')audio.trumpetChord(item.root,item.intervals??INTERVALS[item.quality],done);
      else if(item.kind==='chord')audio.chordOnly(item.root,INTERVALS[item.target],done);
      else if(item.kind==='mode')audio.scale(item.root,MODES[item.target],item.direction||'up',done);
      else if(item.kind==='melody')audio.melody(item.root,MELODIES[item.target],done);
      else if(item.kind==='poly')audio.poly(RUDIMENTS[item.target],done);
      else audio.rhythm(RHYTHMS[item.target],done,{loops:2});
    }catch(e){audioError(e,token);}
  }
  function audioError(error,token){if(token===playToken&&isActive()){const feedback=el('debrief-feedback');if(feedback)feedback.textContent=`Не удалось включить звук: ${error.message}`;}}
  return {open,log,record:item=>log.record(item),play,cancel};
}
