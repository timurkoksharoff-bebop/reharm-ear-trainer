import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import './bundle.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'dist');fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
// Explicit public allowlist: never package book PDFs, credentials or parent app.
const files=['index.html','game.css','industrial.css','console.css','game.bundle.js'];
for(const name of files)fs.copyFileSync(path.join(root,name),path.join(output,name));
fs.mkdirSync(path.join(output,'assets'),{recursive:true});
for(const name of ['console-flight.jpg','console-sound-lab.jpg','console-portrait.jpg'])fs.copyFileSync(path.join(root,'assets',name),path.join(output,'assets',name));
for(const name of ['hydra','enemyships','corvette','fortress','scout-art','cruiser-art','drummachine','artifact-guitar','artifact-keytar','artifact-pedal','artifact-cymbal','trumpeter','keytarist','guitarist','drummer','drummergirl','vibraphonist','band','ship','terrain','drone','moon','mars','teachers','teachers-v2','artifacts','concert-drums-v65','concert-guitar-v65','concert-keys-v65','concert-trumpet-v65','console-workbench-v65','drummergirl-scene-v65','crate-bass','crate-roulette','crate-trumpet','crate-vibraphone']){
  const source=path.join(root,'assets',`${name}.png`);if(!fs.existsSync(source))throw new Error(`Missing game art: ${name}`);
  fs.copyFileSync(source,path.join(output,'assets',`${name}.png`));
}
for(const name of ['keytar-exact.svg','guitar-exact.svg'])fs.copyFileSync(path.join(root,'assets',name),path.join(output,'assets',name));
// Copy only WebP counterparts of explicitly approved assets. This keeps old
// experiments and contact sheets out of the public build.
for(const name of ['hydra','enemyships','corvette','fortress','scout-art','cruiser-art','drummachine','artifact-guitar','artifact-keytar','artifact-pedal','artifact-cymbal','trumpeter','keytarist','guitarist','drummer','drummergirl','vibraphonist','band','ship','terrain','drone','moon','mars','teachers','teachers-v2','artifacts','concert-drums-v65','concert-guitar-v65','concert-keys-v65','concert-trumpet-v65','console-workbench-v65','drummergirl-scene-v65','crate-bass','crate-roulette','crate-trumpet','crate-vibraphone']){
  const source=path.join(root,'assets',`${name}.webp`);
  if(fs.existsSync(source))fs.copyFileSync(source,path.join(output,'assets',`${name}.webp`));
}
for(const name of ['note-cube','note-drum','turret-base','turret-barrel','turret-ruin'])fs.copyFileSync(path.join(root,'assets',`${name}.webp`),path.join(output,'assets',`${name}.webp`));
console.log('Static game build complete.');
