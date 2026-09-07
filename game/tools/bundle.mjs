import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const names=['music','intervals','combat','expedition','audio','i18n','game'];
let bundle='/* Generated from game source. Classic script also supports local Safari. */\n(()=>{\n';
for(const name of names){
  let source=fs.readFileSync(`${root}${name}.${name==='game'?'js':'mjs'}`,'utf8');
  const exported=[...source.matchAll(/export (?:const|function|class) (\w+)/g)].map(m=>m[1]);
  source=source.replace(/import \{([^}]+)\} from '\.\/(\w+)\.mjs';/g,(_,ids,dep)=>`const {${ids}}=module_${dep};`).replace(/\bexport /g,'');
  bundle+=`const module_${name}=(()=>{\n${source}\nreturn {${exported.join(',')}};\n})();\n`;
}
bundle+='})();\n';fs.writeFileSync(`${root}game.bundle.js`,bundle);
