import fs from 'node:fs';
import {parseIRealCollection} from '../importer.mjs';
const input=process.argv[2];
if(!input)throw new Error('Pass the user-provided iReal HTML playlist path.');
const charts=parseIRealCollection(fs.readFileSync(input,'utf8'));
const rows=charts.map(({title,composer,style,key,raw,format},i)=>({id:`jazz-${i}`,title,composer,style,key,raw,format}));
fs.writeFileSync(new URL('../standards-catalog.mjs',import.meta.url),`// Chord charts from the user-provided Jazz 1460 playlist. No melodies.\nexport const JAZZ_STANDARDS=${JSON.stringify(rows)};\n`);
console.log(`${charts.length} indexed charts; ${charts.filter(c=>c.route).length} currently playable; other charts retain explicit diagnostics.`);
