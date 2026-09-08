import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const gameRoot=fileURLToPath(new URL('../',import.meta.url));
const source=fs.readFileSync(new URL('../../app.js',import.meta.url),'utf8');
const core=source.slice(source.indexOf('const CORE_EXERCISES = ['),source.indexOf('const REFERENCE_ANSWER_SPECS = ['));
const chord=(degree,offset,quality,spelling=null,bassOffset=null)=>({degree,offset,quality,spelling,bassOffset});
const makeExercise=value=>value;
const catalogExercise=(id,chapter,name,page,baseTonic,rawSequence)=>({id,chapter,name,source:`Chapter ${chapter} · ${name.split(' — ')[0]} · printed p. ${page}`,baseTonic,sequence:rawSequence.map(item=>chord(...item))});

function calls(name){
  const found=[];let cursor=0;
  while((cursor=core.indexOf(`${name}(`,cursor))>=0){
    let end=cursor+name.length,depth=0,quote='',escaped=false;
    for(;end<core.length;end++){
      const char=core[end];
      if(quote){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char===quote)quote='';continue;}
      if(char==='"'||char==="'"||char==='`'){quote=char;continue;}
      if(char==='(')depth++;else if(char===')'&&--depth===0){end++;break;}
    }
    found.push(core.slice(cursor,end));cursor=end;
  }
  return found;
}

const exercises=[
  ...calls('makeExercise').map(call=>Function('makeExercise','chord',`return ${call}`)(makeExercise,chord)),
  ...calls('catalogExercise').map(call=>Function('catalogExercise',`return ${call}`)(catalogExercise)),
].sort((a,b)=>a.chapter-b.chapter||core.indexOf(`"${a.id}"`)-core.indexOf(`"${b.id}"`));
if(exercises.length!==107)throw new Error(`Expected 107 canonical core exercises, found ${exercises.length}`);
for(const exercise of exercises)if(!exercise.id||!exercise.chapter||exercise.sequence.length<3)throw new Error(`Bad exercise ${exercise.id}`);
const output=`// Generated from ../app.js by tools/catalog.mjs. Do not edit.\nexport const BOOK_CATALOG=${JSON.stringify(exercises)};\n`;
fs.writeFileSync(`${gameRoot}book-catalog.mjs`,output);
console.log(`Book flight catalog: ${exercises.length} routes across 16 chapters.`);
