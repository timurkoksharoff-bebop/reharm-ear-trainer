import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import './bundle.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const projectRoot=path.join(root,'..');
const release='0.86';
const output=path.join(root,'dist');fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
// Explicit public allowlist: never package book PDFs, credentials or parent app.
const files=['index.html','manifest.webmanifest','game.css','industrial.css','console.css','samsara.css','game.bundle.js','garden-flight.html','garden-flight.css','garden-flight.mjs','garden-flight-renderer.mjs','garden-harmony.mjs','garden-life.mjs','garden-sequence-studio.mjs','garden-tour-routes.mjs','book-catalog.mjs'];
for(const name of files)fs.copyFileSync(path.join(root,name),path.join(output,name));
fs.mkdirSync(path.join(output,'assets'),{recursive:true});
fs.mkdirSync(path.join(output,'assets/echo-garden'),{recursive:true});
fs.mkdirSync(path.join(output,'assets/samsara'),{recursive:true});
for(const name of ['guitar','keytar','bass','overdrive','tongue','cymbal','drum-machine','trumpet','drums','vibraphone','submarine','guitarist','keyboardist','drummer','vibraphonist','beatmaker','bassist','trumpeter'])fs.copyFileSync(path.join(root,'assets/samsara',`${name}.webp`),path.join(output,'assets/samsara',`${name}.webp`));
fs.copyFileSync(path.join(root,'assets/samsara/guardians.png'),path.join(output,'assets/samsara/guardians.png'));
for(const name of ['blue-gardens','night-bloom','white-thaw','amber-fjords','night-bloom-aligned','white-thaw-aligned','manta','lotus'])fs.copyFileSync(path.join(root,'assets/echo-garden',`${name}.webp`),path.join(output,'assets/echo-garden',`${name}.webp`));
fs.mkdirSync(path.join(output,'assets/echo-garden/tours'),{recursive:true});
for(const name of ['reharm','anime','chill','ambient','cinematic','deep-house','funk','gospel','drum-bass'])fs.copyFileSync(path.join(root,'assets/echo-garden/tours',`${name}.webp`),path.join(output,'assets/echo-garden/tours',`${name}.webp`));
fs.mkdirSync(path.join(output,'assets/echo-garden/collectibles'),{recursive:true});
for(const name of ['fuel-seed','water-pearl','crew-berries','repair-lotus','poison-seed','crater','arpeggio-flower','root-flower','hold-flower','hold-arpeggio-flower','midpoint-seed'])fs.copyFileSync(path.join(root,'assets/echo-garden/collectibles',`${name}.webp`),path.join(output,'assets/echo-garden/collectibles',`${name}.webp`));
fs.mkdirSync(path.join(output,'assets/echo-garden/samples'),{recursive:true});
for(const name of ['felt-c3','felt-e3','felt-g3'])fs.copyFileSync(path.join(root,'assets/echo-garden/samples',`${name}.wav`),path.join(output,'assets/echo-garden/samples',`${name}.wav`));
for(const name of ['console-flight.jpg','console-sound-lab.jpg','console-portrait.jpg'])fs.copyFileSync(path.join(root,'assets',name),path.join(output,'assets',name));
for(const name of ['keytar-exact.svg','guitar-exact.svg'])fs.copyFileSync(path.join(root,'assets',name),path.join(output,'assets',name));
// Copy only WebP counterparts of explicitly approved assets. This keeps old
// experiments and contact sheets out of the public build.
for(const name of ['hydra','enemyships','corvette','fortress','scout-art','cruiser-art','drummachine','artifact-guitar','artifact-keytar','artifact-pedal','artifact-cymbal','artifact-yellow-submarine','trumpeter','keytarist','guitarist','drummer','drummergirl','vibraphonist','band','ship','terrain','drone','moon','mars','teachers','teachers-v2','artifacts','concert-drums-v65','concert-guitar-v65','concert-keys-v65','concert-trumpet-v65','console-workbench-v65','drummergirl-scene-v65','crate-bass','crate-roulette','crate-trumpet','crate-vibraphone']){
  const source=path.join(root,'assets',`${name}.webp`);
  if(fs.existsSync(source))fs.copyFileSync(source,path.join(output,'assets',`${name}.webp`));
}
for(const name of ['note-cube','note-drum','turret-base','turret-barrel','turret-ruin'])fs.copyFileSync(path.join(root,'assets',`${name}.webp`),path.join(output,'assets',`${name}.webp`));
fs.mkdirSync(path.join(output,'assets/voices'),{recursive:true});
for(const key of ['male-basic','male-guide','male-all','female-color'])fs.copyFileSync(path.join(root,`assets/voices/${key}.wav`),path.join(output,`assets/voices/${key}.wav`));

for(const key of ['artifact-drum-engine','artifact-rudiments'])fs.copyFileSync(path.join(root,`assets/${key}.png`),path.join(output,`assets/${key}.png`));

// The hosted game reaches the shared Trainer piano one directory above /game.
// A mobile/desktop package is standalone, so keep the same samples inside it
// and rewrite only the generated bundle in dist.
const pianoSource=path.join(projectRoot,'samples/piano'),pianoOutput=path.join(output,'samples/piano');
fs.mkdirSync(pianoOutput,{recursive:true});
for(const name of fs.readdirSync(pianoSource))if(/\.mp3$/i.test(name))fs.copyFileSync(path.join(pianoSource,name),path.join(pianoOutput,name));
const bundlePath=path.join(output,'game.bundle.js');
fs.writeFileSync(bundlePath,fs.readFileSync(bundlePath,'utf8').replaceAll('../samples/piano/','samples/piano/'));

for(const icon of ['icon-180.png','icon-192.png','icon-512.png'])fs.copyFileSync(path.join(projectRoot,icon),path.join(output,icon));
const indexPath=path.join(output,'index.html');
fs.writeFileSync(indexPath,fs.readFileSync(indexPath,'utf8')
  .replaceAll('../icon-180.png?v=0.33','icon-180.png')
  .replace(/\.\.\/service-worker\.js\?v=[0-9.]+/g,`./service-worker.js?v=${release}`));
const manifestPath=path.join(output,'manifest.webmanifest');
fs.writeFileSync(manifestPath,fs.readFileSync(manifestPath,'utf8').replaceAll('../icon-','icon-').replaceAll('?v=0.33',''));

const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.name==='service-worker.js'?[]:entry.isDirectory()?walk(path.join(dir,entry.name)):[path.relative(output,path.join(dir,entry.name)).split(path.sep).join('/')]);
const cached=walk(output).sort().map(file=>`  './${file.replaceAll("'","\\'")}',`).join('\n');
fs.writeFileSync(path.join(output,'service-worker.js'),`const CACHE_NAME='space-music-college-${release}';\nconst APP_FILES=[\n${cached}\n];\nself.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting())));\nself.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('space-music-college-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));\nself.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(event.request,response.clone()));return response;})));});\n`);

console.log(`Static mobile game build ${release} complete: ${walk(output).length+1} files.`);
