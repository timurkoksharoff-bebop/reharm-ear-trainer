import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import './bundle.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'dist');fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
// Explicit public allowlist: never package book PDFs, credentials or parent app.
const files=['index.html','manifest.webmanifest','game.css','industrial.css','console.css','game.bundle.js','garden-flight.html','garden-flight.css','garden-flight.mjs','garden-flight-renderer.mjs','garden-harmony.mjs','garden-sequence-studio.mjs','book-catalog.mjs'];
for(const name of files)fs.copyFileSync(path.join(root,name),path.join(output,name));
fs.mkdirSync(path.join(output,'assets'),{recursive:true});
fs.mkdirSync(path.join(output,'assets/echo-garden'),{recursive:true});
for(const name of ['blue-gardens','night-bloom','white-thaw','amber-fjords','manta','lotus'])fs.copyFileSync(path.join(root,'assets/echo-garden',`${name}.webp`),path.join(output,'assets/echo-garden',`${name}.webp`));
for(const name of ['console-flight.jpg','console-sound-lab.jpg','console-portrait.jpg'])fs.copyFileSync(path.join(root,'assets',name),path.join(output,'assets',name));
for(const name of ['hydra','enemyships','corvette','fortress','scout-art','cruiser-art','drummachine','artifact-guitar','artifact-keytar','artifact-pedal','artifact-cymbal','artifact-yellow-submarine','trumpeter','keytarist','guitarist','drummer','drummergirl','vibraphonist','band','ship','terrain','drone','moon','mars','teachers','teachers-v2','artifacts','concert-drums-v65','concert-guitar-v65','concert-keys-v65','concert-trumpet-v65','console-workbench-v65','drummergirl-scene-v65','crate-bass','crate-roulette','crate-trumpet','crate-vibraphone']){
  const source=path.join(root,'assets',`${name}.png`);if(!fs.existsSync(source))throw new Error(`Missing game art: ${name}`);
  fs.copyFileSync(source,path.join(output,'assets',`${name}.png`));
}
for(const name of ['keytar-exact.svg','guitar-exact.svg'])fs.copyFileSync(path.join(root,'assets',name),path.join(output,'assets',name));
// Copy only WebP counterparts of explicitly approved assets. This keeps old
// experiments and contact sheets out of the public build.
for(const name of ['hydra','enemyships','corvette','fortress','scout-art','cruiser-art','drummachine','artifact-guitar','artifact-keytar','artifact-pedal','artifact-cymbal','artifact-yellow-submarine','trumpeter','keytarist','guitarist','drummer','drummergirl','vibraphonist','band','ship','terrain','drone','moon','mars','teachers','teachers-v2','artifacts','concert-drums-v65','concert-guitar-v65','concert-keys-v65','concert-trumpet-v65','console-workbench-v65','drummergirl-scene-v65','crate-bass','crate-roulette','crate-trumpet','crate-vibraphone']){
  const source=path.join(root,'assets',`${name}.webp`);
  if(fs.existsSync(source))fs.copyFileSync(source,path.join(output,'assets',`${name}.webp`));
}
for(const name of ['note-cube','note-drum','turret-base','turret-barrel','turret-ruin'])fs.copyFileSync(path.join(root,'assets',`${name}.webp`),path.join(output,'assets',`${name}.webp`));
console.log('Static game build complete.');

fs.copyFileSync(path.join(root,'assets/enemy-topdown.png'),path.join(output,'assets/enemy-topdown.png'));

fs.copyFileSync(path.join(root,'assets/cyber-sable.png'),path.join(output,'assets/cyber-sable.png'));

fs.mkdirSync(path.join(output,'assets/voices'),{recursive:true});
for(const key of ['male-basic','male-guide','male-all','female-color'])fs.copyFileSync(path.join(root,`assets/voices/${key}.wav`),path.join(output,`assets/voices/${key}.wav`));

for(const key of ['artifact-drum-engine','artifact-rudiments'])fs.copyFileSync(path.join(root,`assets/${key}.png`),path.join(output,`assets/${key}.png`));
