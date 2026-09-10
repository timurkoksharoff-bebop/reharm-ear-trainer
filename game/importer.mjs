const NOTE_PITCH={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const IREAL_PREFIX='1r34LbKcu7';
const IREAL_QUALITIES=['7susadd3','maj(add4)','min(add4)','maj13#11','min9b6','min7b6','7b13sus','7b9sus','13sus','9sus','13#11','13b9','13#9','7b9b13','7b9#11','7#9#11','7#9#5','7#9b5','7b9b5','7b9#5','7b9#9','9#11','9b5','9#5','^9#11','^7#11','^7#5','maj7#9','maj7b5','min^13','min^11','min13','7(add13)','-7b5','-69','-^9','-^7','-11','-9','-b6','-#5','h9','h7','o7','^13','^9','^7','7alt','7#11','7#9','7#5','7b13','7b9','7b5','13','11','9','69','7sus','sus','add9','-7','-6','6','7','5','2','+','o','h','^','-'];

const QUALITY_DATA={
  '':{quality:'maj',glyph:'',intervals:[0,4,7]},'^':{quality:'maj7',glyph:'maj7',intervals:[0,4,7,11]},
  '-':{quality:'min',glyph:'m',intervals:[0,3,7]},'+':{quality:'aug',glyph:'aug',intervals:[0,4,8]},
  '6':{quality:'6',glyph:'6',intervals:[0,4,7,9]},'-6':{quality:'m6',glyph:'m6',intervals:[0,3,7,9]},
  '7':{quality:'7',glyph:'7',intervals:[0,4,7,10]},'^7':{quality:'maj7',glyph:'maj7',intervals:[0,4,7,11]},
  '-7':{quality:'m7',glyph:'m7',intervals:[0,3,7,10]},h:{quality:'m7b5',glyph:'m7♭5',intervals:[0,3,6,10]},
  h7:{quality:'m7b5',glyph:'m7♭5',intervals:[0,3,6,10]},'-7b5':{quality:'m7b5',glyph:'m7♭5',intervals:[0,3,6,10]},
  o:{quality:'ireal:o',glyph:'°',intervals:[0,3,6]},o7:{quality:'dim7',glyph:'°7',intervals:[0,3,6,9]},
  sus:{quality:'ireal:sus',glyph:'sus4',intervals:[0,5,7]},'7sus':{quality:'7sus4',glyph:'7sus4',intervals:[0,5,7,10]},
  '7b9':{quality:'7b9',glyph:'7(♭9)',intervals:[0,4,7,10,13]},
};

// Complete the less common spellings without adding them to the canonical book catalog.
Object.assign(QUALITY_DATA,{
  '7b9b13':{quality:'7b9b13',glyph:'7(♭9,♭13)',intervals:[0,4,7,10,13,20]},
  '7b5':{quality:'7b5',glyph:'7(♭5)',intervals:[0,4,6,10]},'7#5':{quality:'7sharp5',glyph:'7(♯5)',intervals:[0,4,8,10]},
  '7alt':{quality:'7alt',glyph:'7alt',intervals:[0,4,6,10,13]},'^7#11':{quality:'maj7sharp11',glyph:'maj7(♯11)',intervals:[0,4,7,11,18]},
  '-9':{quality:'m7natural9',glyph:'m9',intervals:[0,3,7,10,14]},h9:{quality:'m7b5natural9',glyph:'m7♭5(9)',intervals:[0,3,6,10,14]},
  '-#5':{quality:'minSharp5',glyph:'m(♯5)',intervals:[0,3,8]},'^7#5':{quality:'augMaj7',glyph:'aug(maj7)',intervals:[0,4,8,11]},
  '7b13':{quality:'ireal:7b13',glyph:'7(♭13)',intervals:[0,4,7,10,20]},
  '9':{quality:'ireal:9',glyph:'9',intervals:[0,4,7,10,14]},'13':{quality:'ireal:13',glyph:'13',intervals:[0,4,7,10,14,21]},
  '^9':{quality:'ireal:maj9',glyph:'maj9',intervals:[0,4,7,11,14]},'-11':{quality:'ireal:m11',glyph:'m11',intervals:[0,3,7,10,14,17]},
  '11':{quality:'ireal:11',glyph:'11',intervals:[0,4,7,10,14,17]},'69':{quality:'ireal:69',glyph:'6/9',intervals:[0,4,7,9,14]},
  'add9':{quality:'ireal:add9',glyph:'add9',intervals:[0,4,7,14]},'7#9':{quality:'ireal:7#9',glyph:'7(♯9)',intervals:[0,4,7,10,15]},
  '7#11':{quality:'ireal:7#11',glyph:'7(♯11)',intervals:[0,4,7,10,18]},'13b9':{quality:'ireal:13b9',glyph:'13(♭9)',intervals:[0,4,7,10,13,21]},
  '13#9':{quality:'ireal:13#9',glyph:'13(♯9)',intervals:[0,4,7,10,15,21]},'13#11':{quality:'ireal:13#11',glyph:'13(♯11)',intervals:[0,4,7,10,14,18,21]},
  '-69':{quality:'ireal:m69',glyph:'m6/9',intervals:[0,3,7,9,14]},'-^7':{quality:'ireal:mMaj7',glyph:'m(maj7)',intervals:[0,3,7,11]},
  '-^9':{quality:'ireal:mMaj9',glyph:'m(maj9)',intervals:[0,3,7,11,14]},'7b9sus':{quality:'ireal:7b9sus',glyph:'7sus4(♭9)',intervals:[0,5,7,10,13]},
  '9sus':{quality:'ireal:9sus',glyph:'9sus4',intervals:[0,5,7,10,14]},'13sus':{quality:'ireal:13sus',glyph:'13sus4',intervals:[0,5,7,10,14,21]},
});

const entityDecode=value=>String(value||'').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const tagText=(xml,tag)=>entityDecode(xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,'i'))?.[1]?.replace(/<[^>]+>/g,'').trim()||'');
const attr=(xml,name)=>entityDecode(xml.match(new RegExp(`\\b${name}=["']([^"']*)["']`,'i'))?.[1]||'');

export function notePitch(note){
  const match=String(note||'').trim().match(/^([A-G])([#b]?)/);if(!match)return null;
  return (NOTE_PITCH[match[1]]+(match[2]==='#'?1:match[2]==='b'?-1:0)+12)%12;
}

function unscramble50(block){
  const chars=[...block],out=[...chars];
  for(let i=0;i<5;i++){out[i]=chars[49-i];out[49-i]=chars[i];}
  for(let i=10;i<24;i++){out[i]=chars[49-i];out[49-i]=chars[i];}
  return out.join('');
}

export function decodeIRealBody(body){
  let source=body.startsWith(IREAL_PREFIX)?body.slice(IREAL_PREFIX.length):body,result='';
  while(source.length>50){const block=source.slice(0,50);source=source.slice(50);result+=source.length<2?block:unscramble50(block);}
  return result+source;
}

function chordToken(root,suffix='',bass=''){
  const data=QUALITY_DATA[suffix];
  if(!data)return {unsupported:`${root}${suffix}${bass?`/${bass}`:''}`};
  return {root,suffix,bass,quality:data.quality,qualityGlyph:data.glyph,intervals:[...data.intervals],absolute:`${root}${data.glyph}${bass?`/${bass}`:''}`};
}

// iReal cell protocol: https://www.irealpro.com/ireal-pro-custom-chord-chart-protocol/
function parseIRealMeasures(raw){
  const measures=[],warnings=[];let cell=[],repeatStart=0,endingStart=null,last=null;
  const clone=m=>m.map(c=>({...c,intervals:c.intervals?[...c.intervals]:undefined}));
  const flush=()=>{if(cell.length){measures.push(cell);cell=[];}};
  let text=raw.replace(/XyQ/g,'   ').replace(/Kcl/g,'|x ').replace(/LZ/g,'|');
  if(/<[^>]*(?:D\.?[CS]\.?|Fine|Coda|[3-9]x)/i.test(text)||/[SQ]/.test(text.replace(/<[^>]*>/g,'')))warnings.push('Переход D.C./D.S./Coda или нестандартный повтор пока требует разбора.');
  if(/N[03-9]/.test(text))warnings.push('Эта карта содержит нестандартные вольты.');
  text=text.replace(/<[^>]*>/g,'').replace(/\*[A-Za-z]/g,'').replace(/T\d+/g,'');
  for(let i=0;i<text.length;){
    const rest=text.slice(i),char=text[i];let m;
    if(rest.startsWith('N1')){flush();endingStart=measures.length;i+=2;continue;}
    if(rest.startsWith('N2')){i+=2;continue;}
    if('|[]Z{}'.includes(char)){
      flush();if(char==='{'){repeatStart=measures.length;endingStart=null;}
      if(char==='}'){measures.push(...measures.slice(repeatStart,endingStart??measures.length).map(clone));endingStart=null;}
      i++;continue;
    }
    if(char==='x'){flush();if(measures.length)cell=clone(measures.at(-1));else warnings.push('Повтор без предыдущего такта.');i++;continue;}
    if(char==='r'){warnings.push('Двухтактовый знак повтора требует проверки.');i++;continue;}
    if(char==='n'){warnings.push('В карте есть N.C.; полёт с паузами пока не поддерживается.');i++;continue;}
    if(char==='p'){if(last)cell.push({...last});i++;continue;}
    if(char==='('){const end=text.indexOf(')',i);if(end<0){warnings.push('Незакрытый альтернативный аккорд.');break;}i=end+1;continue;}
    if((m=rest.match(/^(?:[A-G][#b]?|W)/))){
      let root=m[0];i+=root.length;let suffix='';
      for(const q of [...IREAL_QUALITIES].sort((a,b)=>b.length-a.length)){if(text.slice(i).startsWith(q)){suffix=q;i+=q.length;break;}}
      let bass='';m=text.slice(i).match(/^\/([A-G][#b]?)/);if(m){bass=m[1];i+=m[0].length;}
      if(root==='W'){if(!last){warnings.push('Невидимый корень без предшествующего аккорда.');continue;}root=last.root;suffix=last.suffix;}
      const chord=chordToken(root,suffix,bass);cell.push(chord);last=chord;continue;
    }
    if(!/[\s,slYUf]/.test(char))warnings.push(`Неизвестный символ карты: ${char}`);
    i++;
  }
  flush();return {measures,warnings:[...new Set(warnings)]};
}

function findIRealUrl(text){
  const decoded=entityDecode(text),attribute=decoded.match(/href=["'](ireal(?:b|book):\/\/[^"']*)["']/i),bare=decoded.trim().match(/^(ireal(?:b|book):\/\/[\s\S]*)$/i);
  if(!attribute&&!bare)throw new Error('В файле не найдена диаграмма iReal Pro. Экспортируй цифровку в формате iReal Pro.');
  return decodeURIComponent((attribute||bare)[1]);
}

function parseIRealRecord(record,modern=true){
  const parts=record.split('='),bodyIndex=modern?parts.findIndex(part=>part.startsWith(IREAL_PREFIX)):5;
  if(bodyIndex<0)throw new Error('В iReal Pro файле не найдена гармоническая сетка.');
  const title=parts[0]||'Imported chart',composer=parts[1]||'',key=(parts[bodyIndex-2]||'C').trim(),style=(parts[bodyIndex-3]||'').trim();
  const raw=modern?decodeIRealBody(parts[bodyIndex]):parts[bodyIndex];
  return {format:'iReal Pro',title,composer,style,key,raw,...parseIRealMeasures(raw)};
}
function parseIReal(text){return parseIRealRecord(findIRealUrl(text).replace(/^ireal(?:b|book):\/\//i,''),!/irealbook:/.test(text));}

export function parseIRealCollection(text){
  const url=findIRealUrl(text),modern=url.startsWith('irealb://'),body=url.replace(/^ireal(?:b|book):\/\//i,'');
  const records=modern?body.split('==='):Array.from({length:Math.floor(body.split('=').length/6)},(_,i)=>body.split('=').slice(i*6,i*6+6).join('='));
  return records.filter(record=>modern?record.includes(IREAL_PREFIX):record.includes('=')).map(record=>completeChart(parseIRealRecord(record,modern)));
}

const kindSuffix=kind=>({major:'',minor:'-',augmented:'+',diminished:'o',dominant:'7','major-seventh':'^7','minor-seventh':'-7','half-diminished':'h7','diminished-seventh':'o7','major-sixth':'6','minor-sixth':'-6','suspended-fourth':'sus'}[kind]??null);
function xmlHarmony(block){
  const rootBlock=block.match(/<root>([\s\S]*?)<\/root>/i)?.[1]||'',rootStep=tagText(rootBlock,'root-step'),rootAlter=Number(tagText(rootBlock,'root-alter')||0),root=`${rootStep}${rootAlter===1?'#':rootAlter===-1?'b':''}`;
  if(!/^[A-G]$/.test(rootStep)||![-1,0,1].includes(rootAlter))return {unsupported:'Корень MusicXML с двойной или неизвестной альтерацией'};
  const kindBlock=block.match(/<kind([^>]*)>([\s\S]*?)<\/kind>/i),kindName=entityDecode(kindBlock?.[2]?.replace(/<[^>]+>/g,'').trim()||''),kindText=attr(kindBlock?.[1]||'','text');
  let suffix=kindSuffix(kindName)??(Object.hasOwn(QUALITY_DATA,kindText)?kindText:null);if(suffix===null)return {unsupported:`${root} (${kindName||'unknown quality'})`};
  for(const degree of block.matchAll(/<degree>([\s\S]*?)<\/degree>/gi)){
    const value=tagText(degree[1],'degree-value'),alter=Number(tagText(degree[1],'degree-alter')||0),type=tagText(degree[1],'degree-type');
    if(type==='subtract')return {unsupported:`${root} ${kindName}: omit ${value}`};
    if(type!=='subtract'&&value){const mark=alter<0?'b':alter>0?'#':'';if(!suffix.includes(`${mark}${value}`))suffix+=`${mark}${value}`;}
  }
  const bassBlock=block.match(/<bass>([\s\S]*?)<\/bass>/i)?.[1]||'',bassStep=tagText(bassBlock,'bass-step'),bassAlter=Number(tagText(bassBlock,'bass-alter')||0),bass=bassStep?`${bassStep}${bassAlter===1?'#':bassAlter===-1?'b':''}`:'';
  if(![-1,0,1].includes(bassAlter)||bassStep&&!/^[A-G]$/.test(bassStep))return {unsupported:'Бас MusicXML с двойной или неизвестной альтерацией'};
  return chordToken(root,suffix,bass);
}

function parseMusicXML(text){
  if(!/<score-partwise\b/.test(text)||!/<\/score-partwise>/.test(text))throw new Error('Нужен несжатый MusicXML score-partwise (.musicxml или .xml).');
  text=text.replace(/<!--[\s\S]*?-->/g,'');
  const parts=[...text.matchAll(/<part\b[^>]*>([\s\S]*?)<\/part>/g)].filter(m=>/<harmony\b/.test(m[1]));
  if(parts.length!==1)throw new Error('Нужна одна партия с аккордовыми символами harmony; экспортируй её отдельно.');
  const part=parts[0][1];
  const title=tagText(text,'work-title')||tagText(text,'movement-title')||'Imported chart',composer=tagText(text,'creator');
  const fifths=Number(tagText(text,'fifths')||0),mode=tagText(text,'mode')||'major',majorKeys=['C','G','D','A','E','B','F#','C#'],flatMajor=['C','F','Bb','Eb','Ab','Db','Gb','Cb'],minorKeys=['A','E','B','F#','C#','G#','D#','A#'],flatMinor=['A','D','G','C','F','Bb','Eb','Ab'];
  const key=(fifths>=0?(mode==='minor'?minorKeys[fifths]:majorKeys[fifths]):(mode==='minor'?flatMinor[-fifths]:flatMajor[-fifths]))||'C';
  const measures=[],warnings=[];let repeatStart=0;
  if([...part.matchAll(/<key\b[\s\S]*?<\/key>/g)].length>1)warnings.push('Смена тональности внутри MusicXML пока требует отдельного разбора.');
  if(/<ending\b|<measure-repeat\b|<transpose\b/.test(part))warnings.push('Вольты, повтор тактов или транспонирующий инструмент требуют отдельного разбора.');
  for(const match of part.matchAll(/<measure\b[^>]*>([\s\S]*?)<\/measure>/gi)){
    const block=match[1];if(/<repeat\b[^>]*times=["'](?!2["'])/i.test(block))warnings.push('Повтор больше двух раз требует отдельного разбора.');if(/<repeat\b[^>]*direction=["']forward["']/i.test(block))repeatStart=measures.length;
    const harmonies=[...block.matchAll(/<harmony\b[^>]*>([\s\S]*?)<\/harmony>/gi)].map(item=>xmlHarmony(item[1]));
    if(harmonies.length)measures.push(harmonies);
    if(/<repeat\b[^>]*direction=["']backward["']/i.test(block)&&repeatStart!==null){const repeated=measures.slice(repeatStart).map(measure=>measure.map(chord=>({...chord,intervals:chord.intervals?[...chord.intervals]:undefined})));measures.push(...repeated);repeatStart=null;}
  }
  if(/<sound\b[^>]*(?:dalsegno|dacapo|tocoda)=/i.test(text)||/<words[^>]*>[^<]*(?:D\.?[CS]\.?|Coda|Fine)/i.test(text))warnings.push('D.C./D.S./Coda найдены: перед полётом проверь развёрнутую карту.');
  return {format:'MusicXML',title,composer,style:'',key:key+(mode==='minor'?'-':''),raw:'',measures,warnings};
}

export function chartToRoute(chart){
  const tonic=notePitch(chart.key);if(tonic===null)throw new Error(`Не удалось определить тональность: ${chart.key||'—'}`);
  const unsupported=chart.measures.flat().filter(chord=>chord.unsupported).map(chord=>chord.unsupported);
  if(chart.warnings?.length)throw new Error(chart.warnings.join(' '));
  if(unsupported.length)throw new Error(`Пока не поддерживаются: ${[...new Set(unsupported)].join(', ')}`);
  const sequence=chart.measures.flatMap((measure,index)=>measure.map(chord=>({...chord,measure:index+1}))).map(chord=>{
    const root=notePitch(chord.root),bass=chord.bass?notePitch(chord.bass):null,offset=(root-tonic+12)%12;
    return {...chord,offset,answerOffset:offset,bassOffset:bass===null?null:(bass-tonic+12)%12,degree:'',intervals:[...chord.intervals]};
  });
  if(!sequence.length)throw new Error('В файле не найдено ни одного аккорда.');
  const slug=chart.title.toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,18)||'IMPORTED';
  return {...chart,key:tonic,sourceKey:chart.key,sequence,code:`TOUR·${slug}`,id:`import-${slug.toLowerCase()}`,source:`${chart.format} · файл пользователя`,register:48,timbre:'synth',articulation:'block'};
}

function completeChart(chart){
  const unsupported=[...new Set(chart.measures.flat().filter(chord=>chord.unsupported).map(chord=>chord.unsupported))];
  let route=null;try{if(!unsupported.length&&!chart.warnings.length)route=chartToRoute(chart);}catch(error){chart.warnings.push(error.message);}
  return {...chart,unsupported,route};
}
export function parseImportedChart(text,filename=''){
  const source=String(text||'');return completeChart(/ireal(?:b|book):\/\//i.test(source)||/\.html?$/i.test(filename)?parseIReal(source):parseMusicXML(source));
}
export function transposeRoute(route,key){
  if(!Number.isInteger(key)||key<0||key>11)throw new Error('Выбери одну из 12 тональностей.');
  return {...route,key,sequence:route.sequence.map(chord=>({...chord,intervals:chord.intervals?[...chord.intervals]:undefined}))};
}
const FLAT_NOTES=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
export function absoluteChord(chord,key){return `${FLAT_NOTES[(key+chord.offset)%12]}${chord.qualityGlyph??''}${chord.bassOffset===null||chord.bassOffset===undefined?'':`/${FLAT_NOTES[(key+chord.bassOffset)%12]}`}`;}
export function parseStoredChart(record){return completeChart({...record,...parseIRealMeasures(record.raw)});}
