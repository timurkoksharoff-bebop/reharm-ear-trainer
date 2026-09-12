import {IMPORTED_MELODIES} from './melodies-catalog.mjs';

export function createMelodyLibrary({overlay,action,enter,back,audio,isActive,launch}){
  const el=id=>document.getElementById(id),bank=[...IMPORTED_MELODIES].sort((a,b)=>a.name.localeCompare(b.name));
  let query='',page=0,token=0,lastId=null;
  function cancel(){token++;audio.stop();}
  function open(){
    enter('melodies',open);cancel();
    overlay('<span class="eyebrow">KEY PILOT · MELODY MEMORY</span><h2>200 джазовых мелодий</h2><p class="compact">Все темы участвуют в полётах. Сначала звучит фрагмент для узнавания; после верного ответа можно дослушать тему.</p><label class="library-label">Найти мелодию<input id="melody-search" type="search" placeholder="All the Things You Are…" autocomplete="off"></label><p id="melody-count" class="compact" role="status"></p><div id="melody-list" class="chart-list"></div><div id="melody-pages" class="study-tabs"></div>');
    function render(){
      const found=bank.filter(m=>m.name.toLowerCase().includes(query.toLowerCase().trim())),size=20,pages=Math.max(1,Math.ceil(found.length/size));page=Math.min(page,pages-1);
      el('melody-count').textContent=`Найдено: ${found.length} · страница ${page+1}/${pages}`;el('melody-list').replaceChildren();
      for(const melody of found.slice(page*size,(page+1)*size)){
        const b=document.createElement('button'),name=document.createElement('b'),meta=document.createElement('small');name.textContent=melody.name;meta.textContent=`♫ ${melody.measures} тактов · открыть`;b.append(name,meta);b.onclick=()=>show(melody);el('melody-list').append(b);
      }
      el('melody-pages').replaceChildren();
      for(const [label,delta] of [['← Назад',-1],['Дальше →',1]]){const b=document.createElement('button');b.textContent=label;b.disabled=page+delta<0||page+delta>=pages;b.onclick=()=>{page+=delta;render();};el('melody-pages').append(b);}
    }
    el('melody-search').value=query;el('melody-search').oninput=()=>{query=el('melody-search').value;page=0;render();};render();
    action('🎲 Случайная мелодия',random);action('Клавишник · испытание',()=>{cancel();launch();});action('Назад',()=>{cancel();back();},true);
  }
  function random(){const pool=bank.filter(m=>m.id!==lastId);show(pool[Math.floor(Math.random()*pool.length)]);}
  function show(melody){
    enter('melody-detail',()=>show(melody));cancel();lastId=melody.id;
    overlay('<span class="eyebrow">MELODY MEMORY</span><h2 id="melody-title"></h2><p id="melody-description" class="compact"></p><p id="melody-playing" class="compact" role="status">Выбери фрагмент или прослушай тему.</p>');
    el('melody-title').textContent=melody.name;el('melody-description').textContent=`${melody.measures} тактов · мелодическая линия из нотного источника`;
    async function play(full){
      cancel();const cue=token;
      try{await audio.unlock();if(cue!==token||!isActive())return;el('melody-playing').textContent=full?'♫ Звучит тема…':'♫ Фрагмент для узнавания…';
        audio.melody(melody.firstMidi??60,melody,()=>{if(cue===token&&isActive()&&el('melody-playing'))el('melody-playing').textContent='Прослушивание завершено.';},{full});
      }catch(error){if(cue===token&&el('melody-playing'))el('melody-playing').textContent=`Не удалось включить звук: ${error.message}`;}
    }
    action('▶ Фрагмент',()=>play(false));action('♫ Слушать тему',()=>play(true));
    action('■ Стоп',()=>{cancel();el('melody-playing').textContent='Остановлено.';},true);action('🎲 Другая мелодия',random);action('К списку',()=>{cancel();back();},true);
  }
  return {open,cancel};
}
