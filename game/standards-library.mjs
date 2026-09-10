import {JAZZ_STANDARDS} from './standards-catalog.mjs';
import {parseImportedChart,parseIRealCollection,parseStoredChart,transposeRoute,absoluteChord,notePitch} from './importer.mjs';
const STORAGE='space-music-college-charts-v1';
const KEYS=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
export function createStandardsLibrary({overlay,action,start,back,listen,stop}){
  let custom=[];try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'[]');if(Array.isArray(saved))custom=saved.filter(c=>typeof c.text==='string'&&typeof c.title==='string');}catch{}
  let selected=null,selectedKey=0,level=1;
  const el=id=>document.getElementById(id);
  function open(){
    stop();overlay('<span class="eyebrow">GALACTIC TOUR · CHORD CHARTS</span><h2>Стандарты</h2><p class="compact">Jazz 1460 · найди стандарт, выбери тональность и лети по его аккордам.</p><label class="library-label">Поиск названия или автора<input id="chart-search" type="search" placeholder="Autumn Leaves, Night in Tunisia…" autocomplete="off"></label><label class="library-label">Добавить свою цифровку<input id="chart-file" type="file" accept=".html,.htm,.xml,.musicxml"></label><p id="chart-message" class="compact" role="status"></p><div id="chart-list" class="chart-list"></div>');
    const all=[...custom,...JAZZ_STANDARDS];
    function search(){const query=el('chart-search').value.toLocaleLowerCase().trim(),found=all.filter(c=>`${c.title} ${c.composer||''}`.toLocaleLowerCase().includes(query));el('chart-list').replaceChildren();el('chart-message').textContent=`${found.length} карт · показаны первые ${Math.min(30,found.length)}`;for(const item of found.slice(0,30)){const b=document.createElement('button'),name=document.createElement('b'),meta=document.createElement('small');name.textContent=item.title;meta.textContent=item.text?'Мой импорт':`${item.composer} · ${item.key} · ${item.style}`;b.append(name,meta);b.onclick=()=>{try{show(item.text?parseImportedChart(item.text,item.filename):parseStoredChart(item));}catch(e){el('chart-message').textContent=e.message;}};el('chart-list').append(b);}}
    el('chart-search').oninput=search;search();
    el('chart-file').onchange=async event=>{
      const file=event.target.files?.[0];if(!file)return;
      try{
        if(file.size>4*1024*1024)throw new Error('Для пробного импорта выбери файл до 4 МБ.');
        const text=await file.text();
        if(/irealb?:\/\//i.test(text)){
          const charts=parseIRealCollection(text);
          if(charts.length>1)throw new Error('Jazz 1460 уже встроен. Для своего импорта экспортируй один стандарт.');
        }
        const chart=parseImportedChart(text,file.name),record={title:chart.title,filename:file.name,text};
        custom=custom.filter(c=>c.title!==record.title);custom.unshift(record);
        try{localStorage.setItem(STORAGE,JSON.stringify(custom));}catch{chart.warnings.push('Хранилище заполнено: файл доступен до закрытия страницы.');}
        show(chart);
      }catch(e){el('chart-message').textContent=e.message;}
    };
    action('Главное меню',back,true);
  }
  function show(chart){
    stop();selected=chart;selectedKey=chart.route?.key??notePitch(chart.key)??0;
    overlay('<span class="eyebrow">GALACTIC TOUR · ПОДГОТОВКА</span><h2 id="chart-title"></h2><p class="compact" id="chart-meta"></p><label class="library-label">Тональность<select id="chart-key"></select></label><label class="library-label">Сложность полёта<select id="chart-level"></select></label><p id="chart-warning" class="compact" role="status"></p><div id="chart-preview" class="chart-preview"></div><p class="compact">Один аккорд — одна гидра. Аккорды и обращения из файла сохранены; длительность боя зависит от ответа. Ноты мелодии здесь не воспроизводятся.</p>');
    el('chart-title').textContent=chart.title;el('chart-meta').textContent=`${chart.composer||''} · ${chart.format} · ${chart.measures.length} тактов / ${chart.route?.sequence.length??chart.measures.flat().length} аккордов`;
    for(let i=0;i<12;i++)el('chart-key').add(new Option(KEYS[i]+(chart.key.endsWith('-')?' minor':''),i,i===selectedKey,i===selectedKey));
    ['Novice','Student','Master','Legend'].forEach((name,i)=>el('chart-level').add(new Option(name,i,i===level,i===level)));
    el('chart-level').onchange=()=>{level=Number(el('chart-level').value);};
    const issues=[...chart.warnings,...chart.unsupported.map(c=>`Не поддержан аккорд: ${c}`)];el('chart-warning').textContent=issues.length?issues.join(' '):'Карта разобрана. Можно проверить гармонию перед вылетом.';
    function preview(){
      selectedKey=Number(el('chart-key').value);el('chart-preview').replaceChildren();
      if(chart.route){const route=transposeRoute(chart.route,selectedKey);for(let m=1;m<=chart.measures.length;m++){const box=document.createElement('div'),number=document.createElement('small'),chords=document.createElement('span');number.textContent=String(m);chords.textContent=route.sequence.filter(c=>c.measure===m).map(c=>absoluteChord(c,route.key)).join(' · ');box.append(number,chords);el('chart-preview').append(box);}}
      else for(const measure of chart.measures){const box=document.createElement('div');box.textContent=measure.map(c=>c.absolute||c.unsupported).join(' · ');el('chart-preview').append(box);}
    }
    el('chart-key').disabled=!chart.route;el('chart-key').onchange=()=>{stop();preview();};preview();
    if(chart.route){action('▶ Прослушать первые 8 аккордов',()=>listen(transposeRoute(chart.route,selectedKey)));action('LAUNCH · Лететь этот стандарт',()=>start(transposeRoute(chart.route,selectedKey),level));}
    action('Назад к стандартам',open,true);
  }
  return {open};
}
