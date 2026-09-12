import {JAZZ_STANDARDS} from './standards-catalog.mjs';
import {parseImportedChart,parseIRealCollection,parseStoredChart,transposeRoute,absoluteChord,notePitch} from './importer.mjs';
const STORAGE='space-music-college-charts-v1';
const KEYS=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
export function createStandardPicker(parse=record=>record.text?parseImportedChart(record.text,record.filename):parseStoredChart(record),random=Math.random){
  const cache=new WeakMap();
  function read(record){
    if(!cache.has(record)){
      try{
        const parsed=parse(record),source=record.text?'Мой импорт':'Jazz 1460';
        cache.set(record,{chart:{...parsed,source,route:parsed.route?{...parsed.route,source:`${source} · ${parsed.format}`}:null}});
      }catch(error){cache.set(record,{error});}
    }
    const entry=cache.get(record);if(entry.error)throw entry.error;return entry.chart;
  }
  function pick(records,previousTitle=''){
    // Draw without replacement and stop at the first playable chart. Opening the
    // picker never needs to parse all 1460 records on the phone's UI thread.
    for(const candidates of [records.filter(record=>record.title!==previousTitle),records.filter(record=>record.title===previousTitle)]){
      while(candidates.length){
        const index=Math.floor(random()*candidates.length),record=candidates[index];
        candidates[index]=candidates.at(-1);candidates.pop();
        try{const chart=read(record);if(chart.route?.sequence.length)return chart;}catch{}
      }
    }
    return null;
  }
  return {read,pick};
}
export function createStandardsLibrary({overlay,action,start,back,listen,stop,enter=()=>{}}){
  let custom=[];try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'[]');if(Array.isArray(saved))custom=saved.filter(c=>typeof c.text==='string'&&typeof c.title==='string');}catch{}
  let selected=null,selectedKey=0,level=1,searchText='',keyIsManual=false;
  const picker=createStandardPicker();
  const el=id=>document.getElementById(id);
  function randomChart(){
    stop();const chart=picker.pick([...custom,...JAZZ_STANDARDS],selected?.title);
    if(chart)show(chart,{random:true});
    else (el('chart-message')||el('chart-warning')).textContent='Нет доступных для полёта карт.';
  }
  function open(){
    enter('standards',open);
    stop();overlay('<span class="eyebrow">GALACTIC TOUR · CHORD CHARTS</span><h2>Стандарты</h2><p class="compact">Jazz 1460 · найди стандарт, выбери тональность и лети по его аккордам.</p><button id="chart-random" type="button" class="primary">🎲 Случайный стандарт</button><label class="library-label">Поиск названия или автора<input id="chart-search" type="search" placeholder="Autumn Leaves, Night in Tunisia…" autocomplete="off"></label><label class="library-label">Добавить свою цифровку<input id="chart-file" type="file" accept=".html,.htm,.xml,.musicxml"></label><p id="chart-message" class="compact" role="status"></p><div id="chart-list" class="chart-list"></div>');
    const all=[...custom,...JAZZ_STANDARDS];
    function search(){searchText=el('chart-search').value;const query=searchText.toLocaleLowerCase().trim(),found=all.filter(c=>`${c.title} ${c.composer||''}`.toLocaleLowerCase().includes(query));el('chart-list').replaceChildren();el('chart-message').textContent=`${found.length} карт · показаны первые ${Math.min(30,found.length)}`;for(const item of found.slice(0,30)){const b=document.createElement('button'),name=document.createElement('b'),meta=document.createElement('small');name.textContent=item.title;meta.textContent=item.text?'Мой импорт':`${item.composer} · ${item.key} · ${item.style}`;b.append(name,meta);b.onclick=()=>{try{show(picker.read(item));}catch(e){el('chart-message').textContent=e.message;}};el('chart-list').append(b);}}
    el('chart-search').value=searchText;el('chart-search').oninput=search;search();
    el('chart-random').onclick=randomChart;
    el('chart-file').onchange=async event=>{
      const file=event.target.files?.[0];if(!file)return;
      try{
        if(file.size>4*1024*1024)throw new Error('Для пробного импорта выбери файл до 4 МБ.');
        const text=await file.text();
        if(/irealb?:\/\//i.test(text)){
          const charts=parseIRealCollection(text);
          if(charts.length>1)throw new Error('Jazz 1460 уже встроен. Для своего импорта экспортируй один стандарт.');
        }
        const parsed=parseImportedChart(text,file.name),record={title:parsed.title,filename:file.name,text},chart=picker.read(record);
        custom=custom.filter(c=>c.title!==record.title);custom.unshift(record);
        try{localStorage.setItem(STORAGE,JSON.stringify(custom));}catch{chart.warnings.push('Хранилище заполнено: файл доступен до закрытия страницы.');}
        show(chart);
      }catch(e){el('chart-message').textContent=e.message;}
    };
    action('Назад',back,true);
  }
  function show(chart,{restore=false,random=false}={}){
    enter('standard-detail',()=>show(chart,{restore:true}));
    stop();selected=chart;
    if(!restore&&!(random&&keyIsManual))selectedKey=chart.route?.key??notePitch(chart.key)??0;
    if(!restore&&!random)keyIsManual=false;
    overlay('<span class="eyebrow">GALACTIC TOUR · ПОДГОТОВКА</span><h2 id="chart-title"></h2><p class="compact" id="chart-meta"></p><button id="chart-reroll" type="button" class="secondary">🎲 Другой стандарт</button><label class="library-label">Тональность<select id="chart-key"></select></label><label class="library-label">Сложность полёта<select id="chart-level"></select></label><p id="chart-warning" class="compact" role="status"></p><div id="chart-preview" class="chart-preview"></div><p class="compact">Один аккорд — одна гидра. Аккорды и обращения из файла сохранены; длительность боя зависит от ответа. Ноты мелодии здесь не воспроизводятся.</p>');
    el('chart-title').textContent=chart.title;el('chart-meta').textContent=`${chart.composer||''} · ${chart.source} · ${chart.format} · ${chart.measures.length} тактов / ${chart.route?.sequence.length??chart.measures.flat().length} аккордов`;
    el('chart-reroll').onclick=randomChart;
    for(let i=0;i<12;i++)el('chart-key').add(new Option(KEYS[i]+(chart.key.endsWith('-')?' minor':''),i,i===selectedKey,i===selectedKey));
    ['Novice','Student','Master','Legend'].forEach((name,i)=>el('chart-level').add(new Option(name,i,i===level,i===level)));
    el('chart-level').onchange=()=>{level=Number(el('chart-level').value);};
    const issues=[...chart.warnings,...chart.unsupported.map(c=>`Не поддержан аккорд: ${c}`)];el('chart-warning').textContent=issues.length?issues.join(' '):'Карта разобрана. Можно проверить гармонию перед вылетом.';
    function preview(){
      selectedKey=Number(el('chart-key').value);el('chart-preview').replaceChildren();
      if(chart.route){const route=transposeRoute(chart.route,selectedKey);for(let m=1;m<=chart.measures.length;m++){const box=document.createElement('div'),number=document.createElement('small'),chords=document.createElement('span');number.textContent=String(m);chords.textContent=route.sequence.filter(c=>c.measure===m).map(c=>absoluteChord(c,route.key)).join(' · ');box.append(number,chords);el('chart-preview').append(box);}}
      else for(const measure of chart.measures){const box=document.createElement('div');box.textContent=measure.map(c=>c.absolute||c.unsupported).join(' · ');el('chart-preview').append(box);}
    }
    el('chart-key').disabled=!chart.route;el('chart-key').onchange=()=>{stop();keyIsManual=true;preview();};preview();
    if(chart.route){action('▶ Прослушать первые 8 аккордов',()=>listen(transposeRoute(chart.route,selectedKey)));action('LAUNCH · Лететь этот стандарт',()=>start(transposeRoute(chart.route,selectedKey),level));}
    action('Назад к стандартам',back,true);
  }
  return {open};
}
