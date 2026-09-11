import {createMistakeLog} from './mistake-log.mjs';
import {QUALITIES,INTERVALS,DEGREES,chordSymbol,chordAnswerKey} from './music.mjs';
import {MODES,MELODIES,RHYTHMS,RUDIMENTS,NUMBER_LABELS,NUMBER_OFFSETS,TONE_OFFSETS,rudimentScore} from './expedition.mjs';
const titles={hydra:'Аккорды',chord:'Тип аккорда',mode:'Лады',melody:'Мелодии',rhythm:'Ритмы',poly:'Рудименты',numbers:'Интервалы',guide:'Гайд-тоны',tones:'Тоны аккорда'};
export function createDebrief({storage,audio,overlay,action,enter,back,setMode,isActive}){
  const log=createMistakeLog(storage),el=id=>document.getElementById(id);
  let entry=null,choices=[],correctIds=[],chosen=new Set(),revealed=false,lastCorrect=false,playToken=0;
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
      choices=shuffle([c,...shuffle(unique.filter(ch=>chordAnswerKey(ch)!==key)).slice(0,5)]).map(ch=>({id:chordAnswerKey(ch),label:chordSymbol(ch)}));correctIds=[key];
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
    enter('debrief',restore);setMode();audio.stop();log.begin();setup();render();
  }
  function restore(){setMode();render();}
  function render(){
    overlay('<span class="eyebrow">РАЗБОР ПОЛЁТА · БЕЗ ТАЙМЕРА</span><h2>Работа над ошибками</h2><p id="debrief-progress" class="compact"></p><p id="debrief-prompt"></p><div id="debrief-choices" class="study-choices trainer-chord-choices"></div><p id="debrief-feedback" class="compact" role="status"></p>');
    if(!entry){el('debrief-progress').textContent=log.completed?`Разобрано тем: ${log.completed}. Все задания этого разбора пройдены.`:'Пока нет ошибок для разбора. Игра собирает их во время полётов.';action('Назад',back,true);return;}
    const item=entry.item;
    el('debrief-progress').textContent=`${titles[item.kind]||item.kind} · осталось тем: ${log.remaining} · разобрано: ${log.completed}`;
    el('debrief-prompt').textContent=item.kind==='tones'?`${item.chordName||QUALITIES[item.quality]?.glyph} · выбери все ${item.toneMode.toUpperCase()} TONES`:item.kind==='hydra'?'Сначала тоника, затем тот аккорд, на котором возникла ошибка.':'Послушай пример из твоего полёта и выбери ответ.';
    for(const choice of choices){const b=document.createElement('button');b.type='button';b.textContent=choice.label;b.dataset.reviewAnswer=String(choice.id);b.disabled=revealed;b.classList.toggle('selected',chosen.has(choice.id)||(revealed&&correctIds.includes(choice.id)));
      if(item.kind==='poly'){const img=document.createElement('img');img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(rudimentScore(RUDIMENTS[choice.id]));img.alt=RUDIMENTS[choice.id].sticking;img.style.cssText='display:block;width:100%;max-height:90px';b.append(img);}
      b.onclick=()=>{if(item.kind==='tones'){chosen.has(choice.id)?chosen.delete(choice.id):chosen.add(choice.id);b.classList.toggle('selected',chosen.has(choice.id)||(revealed&&correctIds.includes(choice.id)));}else submit([choice.id]);};el('debrief-choices').append(b);
    }
    action('▶ Слушать ещё раз',play,true);
    if(item.kind==='tones'&&!revealed)action('Проверить выбранные тоны',()=>submit([...chosen]));
    if(revealed){el('debrief-feedback').textContent=`${lastCorrect?'Верно.':'Повторим позже.'} Правильный ответ: ${choices.filter(c=>correctIds.includes(c.id)).map(c=>c.label).join(' · ')}`;action('Дальше →',()=>{audio.stop();setup();render();});}
    action('Продолжить позже',back,true);
  }
  function submit(ids){
    if(revealed||!isActive())return;
    lastCorrect=ids.length===correctIds.length&&correctIds.every(id=>ids.includes(id));revealed=true;
    log.answer(lastCorrect);render();
  }
  async function play(){
    if(!entry||!isActive())return;const token=++playToken,item=entry.item;
    try{await audio.unlock();if(token!==playToken||!isActive())return;
      const done=()=>{};
      if(item.kind==='hydra')audio.trainerChord(item.tonic,item.chord,done);
      else if(item.kind==='numbers')audio.interval(item.root||60,item.interval,item.direction||'up',done);
      else if(item.kind==='guide')audio.guide(item.root||60,item.target,done);
      else if(item.kind==='tones')audio.trumpetChord(item.root,INTERVALS[item.quality],done);
      else if(item.kind==='chord')audio.chordOnly(item.root,INTERVALS[item.target],done);
      else if(item.kind==='mode')audio.scale(item.root,MODES[item.target],item.direction||'up',done);
      else if(item.kind==='melody')audio.melody(item.root,MELODIES[item.target],done);
      else if(item.kind==='poly')audio.poly(RUDIMENTS[item.target],done);
      else audio.rhythm(RHYTHMS[item.target],done,{loops:2});
    }catch(e){if(isActive())el('debrief-feedback').textContent=`Не удалось включить звук: ${e.message}`;}
  }
  return {open,log,record:item=>log.record(item),play};
}
