import {QUALITIES,INTERVALS} from './music.mjs';

export const PILOTS=[
  {name:'Новичок',sector:0,speed:.65,grace:9,obstacleGap:230,description:'I и V · спокойный полёт · помощь'},
  {name:'Студент',sector:2,speed:.85,grace:7,obstacleGap:200,description:'Два щита · основные аккорды'},
  {name:'Магистр музыки',sector:3,speed:1,grace:5,obstacleGap:170,description:'12 корней · 22 типа · все интервалы'},
  {name:'Херби Хэнкок',sector:3,speed:1.25,grace:3,obstacleGap:145,description:'Вся гармония · быстрые враги · узкие проходы'},
];
export const TEACHERS=[
  {name:'Литература',reward:'hint',text:'Шпаргалка: одна подсказка'},
  {name:'Математика',reward:'rapid',text:'Автомат: 12 секунд'},
  {name:'Химия',reward:'cloak',text:'Невидимость: 10 секунд'},
  {name:'Физ-ра',reward:'shield',text:'Неприкосновенность: 10 секунд'},
  {name:'НВП',reward:'combo',text:'Автомат + невидимость'},
];
export const ARTIFACTS=[
  {name:'Telecaster',elixir:'Copper Drive',text:'Веерный автомат · 14 секунд'},
  {name:'Keytar',elixir:'Phase Shift',text:'Невидимость · 12 секунд'},
  {name:'Jazz Bass',elixir:'Guide Tone',text:'Услышь 3 или 7, поймай цифру — учителя нейтрализуются'},
  {name:'Overdrive',elixir:'Iron Fuzz',text:'Двойной урон и щит · 10 секунд'},
  {name:'Rock Tongue',elixir:'Full Recovery',text:'Узнай тип случайного аккорда → HP 100%'},
  {name:'Zildjian',elixir:'Rhythm Portal',text:'Узнай ритм → щит + автомат'},
  {name:'Drum Machine',elixir:'Phase Lock',text:'Узнай соотношение пульсов → защита и автомат'},
];
// Authored short recognition examples, not arrangements copied from a source.
// Beat positions are quarter-note units across two bars. Same tempo for all.
const hits=(voice,times)=>times.map(beat=>({voice,beat}));
const eighths=Array.from({length:16},(_,i)=>i/2);
const swung=Array.from({length:8},(_,i)=>[i,i+2/3]).flat();
export const RHYTHMS=[
  {name:'Rock',icon:'▰',events:[...hits('hat',eighths),...hits('kick',[0,2,4,6]),...hits('snare',[1,3,5,7])]},
  {name:'Shuffle',icon:'≋',events:[...hits('hat',swung),...hits('kick',[0,2,4,6]),...hits('snare',[1,3,5,7])]},
  {name:'Swing',icon:'♪',events:[...hits('ride',[0,1,1+2/3,2,3,3+2/3,4,5,5+2/3,6,7,7+2/3]),...hits('hat',[1,3,5,7]),...hits('kick',[0,4])]},
  {name:'Son Clave 3–2',icon:'⋮',events:hits('clave',[0,1.5,3,5,6])},
  {name:'Son Clave 2–3',icon:'⁝',events:hits('clave',[1,2,4,5.5,7])},
  {name:'Latin · Bossa',icon:'◈',events:[...hits('hat',eighths),...hits('kick',[0,1.5,2,3.5,4,5.5,6,7.5]),...hits('rim',[0,1.5,3,4.5,6])]},
  {name:'Funk',icon:'ϟ',events:[...hits('hat',eighths),...hits('kick',[0,.75,2.5,4,4.75,6.5]),...hits('snare',[1,3,5,7])]},
  {name:'Reggae',icon:'〰',events:[...hits('hat',[.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5]),...hits('kick',[2,6]),...hits('rim',[2,6])]},
  {name:'Disco',icon:'◇',events:[...hits('kick',[0,1,2,3,4,5,6,7]),...hits('hat',[.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5]),...hits('snare',[1,3,5,7])]},
  {name:'Jazz Waltz',icon:'③',beats:6,events:[...hits('ride',[0,1,1+2/3,2,3,4,4+2/3,5]),...hits('kick',[0,3]),...hits('hat',[1,4])]},
  {name:'Mambo',icon:'⌁',events:[...hits('ride',[0,.5,1.5,2,3,3.5,4,5,5.5,6.5,7,7.5]),...hits('kick',[1.5,3,5.5,7]),...hits('rim',[0,1.5,3,5,6]),...hits('hat',[1,3,5,7])]},
  {name:'Calypso',icon:'☼',events:[...hits('hat',eighths),...hits('kick',[0,1,2,3,4,5,6,7]),...hits('rim',[.5,1.5,1.75,2.5,3.5,3.75,4.5,5.5,5.75,6.5,7.5,7.75])]},
  {name:'Afro-Cuban 12/8',icon:'✺',meter:'12/8',events:[...hits('ride',[0,2/3,4/3,5/3,7/3,3,11/3,4,4+2/3,4+4/3,4+5/3,4+7/3,7,4+11/3]),...hits('kick',[0,1,2,3,4,5,6,7])]},
  {name:'Rumba Clave 3–2',icon:'⋮',events:hits('clave',[0,1.5,3.5,5,6])},
  {name:'Cha-cha-cha',icon:'♧',events:[...hits('ride',[0,1,2,3,4,5,6,7]),...hits('kick',[0,2,4,6]),...hits('rim',[.5,1,2,2.5,3,4.5,5,6,6.5,7])]},
  {name:'Samba',icon:'☷',events:[...hits('hat',eighths),...hits('kick',[0,.75,1,1.75,2,2.75,3,3.75,4,4.75,5,5.75,6,6.75,7,7.75]),...hits('rim',[0,1.5,2.5,4,5.5,6.5])]},
  {name:'Tumbao · Bass',icon:'♩',part:true,events:[{voice:'bass',beat:1.5,midi:48},{voice:'bass',beat:3,midi:43},{voice:'bass',beat:5.5,midi:48},{voice:'bass',beat:7,midi:43}]},
  {name:'Montuno · Keys',icon:'▤',part:true,events:[0,1,1.5,2.5,3.5,4.5,5.5,6,7].map((beat,i)=>({voice:'keys',beat,notes:i%2?[52,55,60]:[48,52,55]}))},
  {name:'Charleston',icon:'⌘',events:[...hits('kick',[0,1.5,4,5.5]),...hits('snare',[2,6]),...hits('hat',[0,1,2,3,4,5,6,7])]},
  {name:"Rock 'n' Roll",icon:'ϟ',events:[...hits('hat',swung),...hits('snare',[1,3,5,7]),...Array.from({length:8},(_,i)=>({voice:'bass',beat:i,midi:[48,52,55,57][i%4]})),...hits('kick',[0,2,4,6])]},
];
export const RHYTHM_HINTS=[
  'Ровные восьмые; малый барабан на 2 и 4.',
  'Длинная и короткая доли в каждой паре; устойчивый бэкбит.',
  'Рисунок ride: пульс и короткая нота перед следующей долей.',
  'Пять ударов: три в первом такте, два во втором.',
  'Пять ударов: два в первом такте, три во втором.',
  'Ровные восьмые, синкопированный обод и мягкая басовая опора.',
  'Синкопы бас-барабана между основными долями.',
  'One drop: бас и обод на третьей доле такта.',
  'Бас-барабан на каждой доле, открытый рисунок между долями.',
  'Три доли в такте; свинговое движение ride.',
  'Учебный Mambo: синкопированный верхний рисунок и басовая опора.',
  'Учебный Calypso: ровный шаг и синкопированный рисунок между долями.',
  'Семь ударов колокольчика внутри двенадцати подразделений. Четыре крупных пульса.',
  'Третий удар трёхударной стороны на полдоли позже, чем в Son Clave.',
  'Учебный Cha-cha-cha: ровный верхний пульс и дробный ответ обода.',
  'Учебная Samba: повторяющаяся короткая пара басовых ударов и синкопы сверху.',
  'Басовая партия Tumbao: синкопированные опоры, оставляющие первую долю пустой. Это партия, а не весь стиль.',
  'Клавишная партия Montuno: повторяющийся синкопированный аккордовый рисунок. Это партия, а не весь стиль.',
  'Учебный Charleston: характерная пара атак на 1 и «и» второй доли.',
  'Учебный Rock ’n’ Roll: шаффл, бэкбит и движущийся басовый рисунок.',
];
export const RHYTHM_LEVELS=[0,0,0,1,1,1,2,1,0,1,2,2,2,2,2,2,2,2,1,1];
export const rhythmIds=level=>RHYTHMS.map((_,i)=>i).filter(i=>RHYTHM_LEVELS[i]<=level);
export const POLYRHYTHMS=[[2,3,1],[3,2,1],[3,4,1],[4,3,1],[5,4,2],[4,5,2],[5,3,2],[3,5,2],[7,4,3],[4,7,3]].map(([a,b,level])=>({a,b,level,name:`${a}:${b}`}));
export function polyEvents(pattern,cycles=3,layer='both'){
  const events=[];
  for(let cycle=0;cycle<cycles;cycle++)for(const [voice,count] of [['rim',pattern.a],['kick',pattern.b]]){
    if(layer!=='both'&&layer!==voice)continue;
    for(let i=0;i<count;i++)events.push({voice,beat:cycle*4+i*4/count,index:i});
  }
  return events.sort((a,b)=>a.beat-b.beat);
}
export const NUMBER_LABELS=['1','♭2','2','♭3','3','4','♭5','♯4','5','♭6','6','♭7','7','8'];
export const NUMBER_OFFSETS={'1':0,'♭2':1,'2':2,'♭3':3,'3':4,'4':5,'♭5':6,'♯4':6,'5':7,'♭6':8,'6':9,'♭7':10,'7':11,'8':12};
export function orderedTargets(interval,direction){return [interval];}
export function gradeNumber(challenge,label){
  const note=NUMBER_OFFSETS[label];
  if(challenge.kind==='guide')return {correct:label===challenge.target,complete:label===challenge.target};
  const correct=note===challenge.interval;
  return {correct,complete:correct,note};
}
export function obstacleRow(index,width,gap){
  const center=width/2+Math.sin(index*1.6)*(width-gap-60)/2;
  return [{x:0,y:-75,w:center-gap/2,h:58},{x:center+gap/2,y:-75,w:width-center-gap/2,h:58}];
}
export function touchesWall(player,wall,r=11){return player.x+r>wall.x&&player.x-r<wall.x+wall.w&&player.y+r>wall.y&&player.y-r<wall.y+wall.h;}

export function createExpedition(api){
  const {s,audio,feedback,signal,burst,renderHud,syncPads,shipHit,W,getH,images,document}=api;
  let pilot=0,planet='moon',teachers=[],walls=[],drops=[],digits=[],special=null,queue=[],timer=5,wallTimer=3,artifactTimer=9,index=0,dropIndex=0,wallIndex=0;
  let cloak=0,shield=0,rapid=0,fuzz=0,hints=0,collectCooldown=0,lastRender='',captures=[],renderedChallenge=null;
  const $=id=>document.getElementById(id);
  const random=items=>items[Math.floor(Math.random()*items.length)];
  function reset(level=0){pilot=level;planet=level%2?'mars':'moon';teachers=[];walls=[];drops=[];digits=[];special=null;queue=[];timer=5;wallTimer=3;artifactTimer=9;index=dropIndex=wallIndex=0;cloak=shield=rapid=fuzz=hints=collectCooldown=0;render();}
  function render(){
    const stamp=JSON.stringify([planet,pilot,Math.ceil(rapid),Math.ceil(cloak),Math.ceil(shield),Math.ceil(fuzz),hints,s.listening,s.mode,special?.kind,Math.ceil(special?.time||0),special?.collected.length,special?.target]);
    if(stamp===lastRender)return;lastRender=stamp;
    $('planet-name').textContent=`${planet==='moon'?'ЛУНА':'МАРС'} · ${PILOTS[pilot].name}`;
    $('effects').textContent=[rapid>0?`AUTO ${Math.ceil(rapid)}s`:'',cloak>0?`GHOST ${Math.ceil(cloak)}s`:'',shield>0?`SHIELD ${Math.ceil(shield)}s`:'',fuzz>0?`FUZZ ${Math.ceil(fuzz)}s`:''].filter(Boolean).join(' · ');
    $('hint').textContent=`Подсказка · ${hints}`;$('hint').disabled=!hints||s.listening||!['active','resolving'].includes(s.mode);
    $('special-panel').hidden=!special;
    if(special){
      $('special-title').textContent=special.kind==='poly'?'DRUM MACHINE · ВЫСОКИЙ : НИЗКИЙ':special.kind==='rhythm'?'RHYTHM PORTAL':special.kind==='chord'?'ROCK TONGUE · HP 100%':special.kind==='guide'?'JAZZ BASS · GUIDE TONE':'СОБЕРИ ИНТЕРВАЛ';
      $('special-detail').textContent=special.revealed?`Звучит ${specialName(special)} · ↻ повторить`:special.pause?'Квартет вышел на поле · полёт удержан, выбери стиль или партию':special.kind==='numbers'?`Один интервал — одна цифра. Ошибка завершает попытку · ${Math.ceil(special.time)}s`:special.kind==='guide'?`Поймай услышанный тон: 3 или 7 · ${Math.ceil(special.time)}s`:`Узнай на слух · ${Math.ceil(special.time)}s`;
      const choices=special.kind==='poly'?special.options.map(i=>({id:i,name:POLYRHYTHMS[i].name,icon:''})):special.kind==='rhythm'?special.options.map(i=>({id:i,name:RHYTHMS[i].name,icon:RHYTHMS[i].icon})):special.kind==='chord'?special.options.map(id=>({id,name:QUALITIES[id].glyph,icon:''})):[];
      // Keep live buttons in place while the countdown changes: replacing them
      // between pointer-down and pointer-up used to discard some answers.
      if(renderedChallenge!==special){$('special-options').replaceChildren();for(const choice of choices){const b=document.createElement('button');b.textContent=`${choice.icon} ${choice.name}`.trim();b.addEventListener('click',()=>answerSpecial(choice.id));$('special-options').append(b);}renderedChallenge=special;}
      for(const b of $('special-options').children)b.disabled=s.listening||s.mode==='paused';
    }
  }
  function spawnTeacher(){
    const edge=index%4,type=index++%5,H=getH(),speed=(115+pilot*12)*PILOTS[pilot].speed;
    const x=edge===0?-40:edge===1?W+40:70+Math.random()*(W-140),y=edge===2?-45:edge===3?H+45:120+Math.random()*(H-200);
    const angle=Math.atan2(H*.62-y,W/2-x);
    teachers.push({type,x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,hp:7+pilot*2,age:0,fire:3,edge});
    feedback(`${TEACHERS[type].name} · учитель атакует!`);
  }
  function reward(type){
    const r=TEACHERS[type].reward;
    if(r==='hint')hints++;
    if(r==='rapid'||r==='combo')rapid=12;
    if(r==='cloak'||r==='combo')cloak=10;
    if(r==='shield')shield=10;
    feedback(TEACHERS[type].text);render();
  }
  function killTeacher(t){if(t.hp<=0)return;t.hp=0;burst(t.x,t.y,'#ffc878',35);s.score+=120;reward(t.type);renderHud();}
  function makeNumbers(c){
    const target=c.kind==='guide'?c.target:random(NUMBER_LABELS.filter(label=>NUMBER_OFFSETS[label]===c.interval));
    const distractors=NUMBER_LABELS.filter(label=>c.kind==='guide'?label!==target:NUMBER_OFFSETS[label]!==c.interval);
    const labels=[target,...distractors.sort(()=>Math.random()-.5).slice(0,pilot<2?7:11)].sort(()=>Math.random()-.5);
    c.label=target;
    digits=labels.map((label,i)=>({label,x:45+(i%4)*(W-90)/3,y:145+Math.floor(i/4)*70,vx:(i%2?1:-1)*(22+Math.random()*25),vy:(i%3?1:-1)*22,age:Math.random()*6}));
  }
  function startChallenge(kind){
    if(special||s.listening)return false;
    if(!['active','resolving'].includes(s.mode))return false;
    special={kind:kind,time:pilot===0?30:pilot===1?20:16,collected:[],options:[],misses:0,pause:kind==='rhythm',beat:0};
    s.bullets=[];
    if(kind==='numbers'){special.interval=random(pilot<2?[3,4,6,7]:[1,2,3,4,5,6,7,8,9,10,11,12]);special.direction=random(['up','down']);makeNumbers(special);}
    if(kind==='guide'){special.target=random(['3','7']);makeNumbers(special);}
    if(kind==='chord'){special.options=pilot<2?['maj','min','7','maj7','m7','7sus4']:Object.keys(QUALITIES);special.target=random(special.options);special.root=48+Math.floor(Math.random()*12);}
    if(kind==='rhythm'){const pool=rhythmIds(pilot);special.target=random(pool);special.options=pool.filter(i=>!!RHYTHMS[i].part===!!RHYTHMS[special.target].part);}
    if(kind==='poly'){special.options=POLYRHYTHMS.map((_,i)=>i).filter(i=>POLYRHYTHMS[i].level<=Math.max(1,pilot));special.target=random(special.options);}
    replay();render();syncPads();return true;
  }
  function replay(){
    if(!special)return;const current=special;s.listening=true;signal('♫ Слушай артефакт',true);render();syncPads();
    const done=()=>{if(special!==current||s.mode==='paused')return;s.listening=false;signal(current.kind==='numbers'?'Поймай цифру услышанного интервала':current.kind==='guide'?'3 или 7? Поймай гайд-тон':'Выбери услышанное');render();syncPads();};
    if(special.kind==='numbers')audio.interval(60+s.route.key,special.interval,special.direction,done);
    else if(special.kind==='guide')audio.guide(60+s.route.key,special.target,done);
    else if(special.kind==='chord')audio.chordOnly(special.root,INTERVALS[special.target],done);
    else if(special.kind==='poly')audio.poly(POLYRHYTHMS[special.target],done);
    else audio.rhythm(RHYTHMS[special.target],done,{loops:2,onBeat:beat=>{if(special===current)current.beat=beat;}});
  }
  function specialName(c,value=c.target){return c.kind==='poly'?POLYRHYTHMS[value].name:c.kind==='rhythm'?RHYTHMS[value].name:c.kind==='chord'?QUALITIES[value].glyph:c.kind==='guide'?c.target:c.label;}
  function endChallenge(won,wrong=false){
    const c=special;if(!c)return;
    audio.stop();s.listening=false;special=null;digits=[];
    if(won){s.score+=250;
      if(c.kind==='chord'){s.health=5;feedback(`${QUALITIES[c.target].glyph} · HP 100%`);}
      else if(c.kind==='rhythm'){shield=12;rapid=10;feedback(`${RHYTHMS[c.target].name} · Rhythm Shield`);}
      else if(c.kind==='poly'){shield=10;rapid=12;feedback(`${POLYRHYTHMS[c.target].name} · Phase Lock`);}
      else if(c.kind==='guide'){teachers.filter(t=>t.hp>0).forEach(killTeacher);shield=8;feedback(`Guide tone ${c.target} · учителя нейтрализованы`);}
      else{rapid=10;s.energy=Math.min(99,s.energy+30);feedback(`${orderedTargets(c.interval,c.direction).map(n=>n===6?'♭5 / ♯4':Object.keys(NUMBER_OFFSETS).find(k=>NUMBER_OFFSETS[k]===n)).join(' → ')} · +30 силы`);}
    }else{feedback(wrong?`Попытка потеряна · нужно ${c.label}`:['rhythm','chord','poly'].includes(c.kind)?`Это ${specialName(c)}`:'Время вышло · попробуем ещё',true);}
    s.fireTimer=Math.max(s.fireTimer,4);render();renderHud();syncPads();
    if(s.mode==='active')api.playCue();
  }
  function answerSpecial(value){
    if(!special||s.listening||s.mode==='paused')return;
    if(value===special.target){endChallenge(true);return;}
    special.misses++;special.revealed=true;special.time=Math.max(0,special.time-3);
    feedback(`Выбрано ${specialName(special,value)} · звучит ${specialName(special)}`,true);lastRender='';render();
  }
  function collectNumber(label){
    if(!special||s.listening)return;const result=gradeNumber(special,label);
    collectCooldown=.6;
    const captured=digits.find(d=>d.label===label);
    if(captured){captures.push({...captured,life:.5,correct:result.correct});burst(captured.x,captured.y,result.correct?'#ffe0a2':'#ee8866',22);s.rings?.push({x:captured.x,y:captured.y,age:0});s.flash=.07;}
    if(s.intervalStats)s.intervalStats[result.correct?'caught':'wrong']++;
    endChallenge(result.correct,!result.correct);
    render();
  }
  function artifact(type){
    feedback(`${ARTIFACTS[type].name} · ${ARTIFACTS[type].elixir}`);
    if(type===0)rapid=14;
    if(type===1)cloak=12;
    if(type===2){if(!teachers.some(t=>t.hp>0))spawnTeacher();}
    if(type===3){fuzz=shield=10;}
    if([2,4,5,6].includes(type)&&['active','resolving'].includes(s.mode)){
      audio.stop();s.listening=false;special=null;digits=[];queue=[];s.capsule=null;s.capsuleTimer=0;
      startChallenge(type===2?'guide':type===4?'chord':type===6?'poly':'rhythm');
    }
    render();
  }
  function dropArtifact(type=dropIndex++%(pilot>=1?7:6)){drops.push({type,x:60+Math.random()*(W-120),y:110,age:0});}
  function afterHydra(){if(s.totalCleared%3===0)planet=planet==='moon'?'mars':'moon';queue.push('numbers');dropArtifact();render();}
  function hint(){if(!hints||s.listening||!['active','resolving'].includes(s.mode))return;hints--;if(special){feedback(`Подсказка: ${specialName(special)}`);}else if(s.capsule){feedback(s.capsule.heard===s.capsule.wanted?'Капсула совпадает · лови':'Другой интервал · пропусти');}else if(s.enemy)feedback(`Корень: ${api.degree(s.enemy.chord.offset)} · тип: ${QUALITIES[s.enemy.chord.quality].glyph}`);render();}
  function tick(dt){
    if(!['active','resolving'].includes(s.mode))return;
    if(special?.pause){render();return;}
    collectCooldown=Math.max(0,collectCooldown-dt);
    captures=captures.filter(c=>(c.life-=dt)>0);
    for(const d of drops){d.age+=dt;d.y+=dt*38;if(Math.hypot(d.x-s.player.x,d.y-s.player.y)<33){d.age=99;artifact(d.type);break;}}
    drops=drops.filter(d=>d.age<22&&d.y<getH()+35);
    if(!s.listening){
      cloak=Math.max(0,cloak-dt);shield=Math.max(0,shield-dt);rapid=Math.max(0,rapid-dt);fuzz=Math.max(0,fuzz-dt);
      timer-=dt;wallTimer-=dt;artifactTimer-=dt;
      if(timer<=0){if(teachers.length<3)spawnTeacher();timer=18-pilot*2;}
      if(wallTimer<=0){if(pilot>=1)walls.push(...obstacleRow(wallIndex++,W,PILOTS[pilot].obstacleGap));wallTimer=pilot===1?7:6;}
      if(artifactTimer<=0){dropArtifact();artifactTimer=pilot===0?16:pilot===1?21:16;}
      for(const wall of walls){wall.y+=dt*42*PILOTS[pilot].speed;if(touchesWall(s.player,wall)){shipHit();s.player.tx=s.player.x=wall.x===0?wall.w+16:wall.x-16;}}
      walls=walls.filter(w=>w.y<getH()+80);
      for(const t of teachers){if(t.hp<=0)continue;t.age+=dt;t.x+=t.vx*dt;t.y+=t.vy*dt;
        if(t.x<30&&t.vx<0||t.x>W-30&&t.vx>0)t.vx*=-1;
        if(t.y<110&&t.vy<0||t.y>getH()-30&&t.vy>0)t.vy*=-1;
        if(Math.hypot(t.x-s.player.x,t.y-s.player.y)<34)shipHit();
        t.fire-=dt;if(t.fire<=0&&!cloak){const a=Math.atan2(s.player.y-t.y,s.player.x-t.x);s.bullets.push({x:t.x,y:t.y,vx:Math.cos(a)*100,vy:Math.sin(a)*100,r:5});t.fire=5;}
      }
      teachers=teachers.filter(t=>t.hp>0&&t.age<45);
      if(special){special.time-=dt;if(special.time<=0){endChallenge(false);return;}
        for(const d of digits){d.age+=dt;d.x+=(d.vx+Math.sin(d.age*2)*15)*dt;d.y+=d.vy*dt;if(d.x<30||d.x>W-30)d.vx*=-1;if(d.y<120||d.y>getH()-35)d.vy*=-1;d.x=Math.max(29,Math.min(W-29,d.x));d.y=Math.max(119,Math.min(getH()-34,d.y));
          if(!collectCooldown&&Math.hypot(d.x-s.player.x,d.y-s.player.y)<36){collectNumber(d.label);break;}}
      }else if(queue.length&&!s.capsule&&s.capsuleTimer<=0)startChallenge(queue.shift());
    }
    render();
  }
  function drawSprite(img,cell,cols,rows,x,y,size){if(!img?.complete||!img.naturalWidth)return;const sw=img.naturalWidth/cols,sh=img.naturalHeight/rows,scale=size/Math.max(sw,sh);api.ctx.drawImage(img,(cell%cols)*sw,Math.floor(cell/cols)*sh,sw,sh,x-sw*scale/2,y-sh*scale/2,sw*scale,sh*scale);}
  function draw(){const ctx=api.ctx;
    for(const w of walls){ctx.save();ctx.beginPath();ctx.rect(w.x,w.y,w.w,w.h);ctx.clip();const tex=images[planet];if(tex?.complete&&tex.naturalWidth)ctx.drawImage(tex,0,tex.naturalHeight*.35,tex.naturalWidth,tex.naturalHeight*.2,w.x,w.y,w.w,w.h);ctx.fillStyle='#4b322b66';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.restore();ctx.strokeStyle='#d2a265';ctx.lineWidth=3;ctx.strokeRect(w.x,w.y,w.w,w.h);ctx.fillStyle='#fbd492';for(let x=w.x+12;x<w.x+w.w;x+=30)ctx.fillRect(x,w.y+6,3,3);}
    for(const t of teachers){drawSprite(images.teachers,t.type,5,1,t.x,t.y,105);ctx.fillStyle='#ffe0a2';ctx.textAlign='center';ctx.font='12px system-ui';ctx.fillText(TEACHERS[t.type].name,t.x,t.y+57);}
    for(const d of drops){ctx.save();ctx.beginPath();ctx.arc(d.x,d.y,29,0,Math.PI*2);ctx.clip();if(d.type===6)drawSprite(images.drummachine,0,1,1,d.x,d.y,55);else drawSprite(images.artifacts,d.type,3,2,d.x,d.y,55);ctx.restore();ctx.strokeStyle='#eec56a';ctx.beginPath();ctx.arc(d.x,d.y,29,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#ffe0a2';ctx.textAlign='center';ctx.font='10px system-ui';ctx.fillText(ARTIFACTS[d.type].name,d.x,d.y+39);}
    for(const d of [...digits,...captures]){
      ctx.save();ctx.translate(d.x,d.y);
      if(d.life!==undefined){const k=d.life/.5;ctx.scale(k,k);ctx.globalAlpha=k;}
      ctx.rotate(Math.sin(d.age)*.08);
      const brass=ctx.createLinearGradient(-26,-26,26,26);brass.addColorStop(0,'#ffe0a2');brass.addColorStop(.35,'#967047');brass.addColorStop(.65,'#e9bb76');brass.addColorStop(1,'#59412d');
      ctx.fillStyle=brass;ctx.strokeStyle='#412d20';ctx.lineWidth=2;
      ctx.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=i%2?25:29;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#172a2c';ctx.strokeStyle='#f3c885';ctx.beginPath();ctx.arc(0,0,21,0,Math.PI*2);ctx.fill();ctx.stroke();
      for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;ctx.fillStyle='#ffe2a5';ctx.beginPath();ctx.arc(Math.cos(a)*24,Math.sin(a)*24,2,0,Math.PI*2);ctx.fill();}
      ctx.shadowColor='#ffc46c';ctx.shadowBlur=9;ctx.fillStyle='#ffe3a7';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 24px Georgia, serif';ctx.fillText(d.label,0,1);ctx.restore();
    }
  }
  function drawBandOverlay(){
    const ctx=api.ctx,H=getH(),beat=special?.beat||0,pulse=s.listening?Math.sin((audio.context?.currentTime||0)*Math.PI*110/60):0;
    ctx.save();
    ctx.fillStyle='#09151ee0';ctx.fillRect(12,H*.20,W-24,H*.60);
    const glow=ctx.createRadialGradient(W/2,H*.43,10,W/2,H*.43,W*.62);glow.addColorStop(0,'#8b653a99');glow.addColorStop(1,'#101c2400');ctx.fillStyle=glow;ctx.fillRect(12,H*.20,W-24,H*.60);
    for(let x=25;x<W;x+=60){ctx.fillStyle='#70573899';ctx.fillRect(x,H*.23,6,H*.48);ctx.fillStyle='#d4a768';ctx.fillRect(x+1,H*.23,2,H*.48);}
    ctx.fillStyle='#262f31e8';ctx.beginPath();ctx.ellipse(W/2,H*.68,W*.46,H*.14,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c69a58';ctx.lineWidth=3;ctx.stroke();
    const band=images.band;
    for(let i=0;i<4;i++){
      const x=W*(.16+i*.225),y=H*.54+Math.sin(i*2)*4;
      ctx.save();ctx.translate(x,y);ctx.rotate(pulse*(i%2?-.025:.025));
      if(band?.complete&&band.naturalWidth){const bounds=[0,370,730,1190,1536],sx=bounds[i],sw=bounds[i+1]-sx,sh=band.naturalHeight,scale=Math.min(H*.70/sh,W*.235/sw);ctx.drawImage(band,sx,0,sw,sh,-sw*scale/2,-sh*scale/2,sw*scale,sh*scale);}ctx.restore();
      ctx.fillStyle=i===beat%4?'#c4ffe4':'#817353';ctx.beginPath();ctx.arc(x,H*.82,5,0,Math.PI*2);ctx.fill();
    }
    ctx.textAlign='center';ctx.fillStyle='#ffe2a7';ctx.font='bold 20px Georgia';ctx.fillText('THE COPPER QUARTET · FIELD PAUSE',W/2,H*.27);
    ctx.font='12px system-ui';ctx.fillText('RHYTHM SIGNAL · 110 BPM',W/2,H*.30);
    ctx.restore();
  }
  function hitShot(b){for(const t of teachers){if(t.hp>0&&Math.hypot(b.x-t.x,b.y-t.y)<31){if(t.hp<=(fuzz?2:1))killTeacher(t);else t.hp-=fuzz?2:1;return true;}}return false;}
  return {reset,render,tick,draw,drawBandOverlay,hitShot,replay,hint,afterHydra,startChallenge,answerSpecial,collectNumber,artifact,spawnTeacher,
    get pausedCombat(){return !!special?.pause;},
    get busy(){return !!special;},get invincible(){return shield>0||cloak>0;},get cloaked(){return cloak>0;},get boosted(){return rapid>0;},get planet(){return planet;},get pilot(){return PILOTS[pilot];},get level(){return pilot;},
    snapshot:()=>({pilot,planet,teachers,walls,drops,digits,special,queue,cloak,shield,rapid,fuzz,hints})};
}
