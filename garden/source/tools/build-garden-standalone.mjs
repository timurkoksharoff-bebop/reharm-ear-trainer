// Garden-only PWA; does not modify existing /game/ releases or other planets.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {GARDEN_ITEMS} from '../garden-life.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const assetRoot=fs.existsSync(path.join(root,'assets/echo-garden'))?path.join(root,'assets/echo-garden'):path.resolve(root,'../assets/echo-garden');
const output=process.argv[2];
if(!output||!path.isAbsolute(output))throw Error('Provide an absolute destination directory for the standalone Garden.');
const version='0.95';
const sharp=createRequire(import.meta.url)('sharp');
fs.mkdirSync(output,{recursive:true});
const write=(name,data)=>{fs.mkdirSync(path.dirname(path.join(output,name)),{recursive:true});fs.writeFileSync(path.join(output,name),data);};
let bundle='/* Сад Эха '+version+' — standalone browser bundle */\n(()=>{\nwindow.GARDEN_ASSETS={"collectibles/meteor-volcanic":"assets/echo-garden/collectibles/meteor-volcanic.webp"};\n'+fs.readFileSync(path.join(root,'mobile-gestures.js'),'utf8')+'\n';
for(const name of ['book-catalog','music','garden-flight-renderer','garden-arrangement','garden-harmony','garden-tour-routes','garden-sequence-studio','garden-life','garden-rewards','garden-difficulty','garden-flight']){
  let source=fs.readFileSync(path.join(root,name+'.mjs'),'utf8');
  const exported=[...source.matchAll(/export (?:const|function|class) (\w+)/g)].map(m=>m[1]);
  source=source.replace(/import \{([^}]+)\} from '\.\/([\w-]+)\.mjs';/g,(_,ids,dep)=>`const {${ids}}=module_${dep.replaceAll('-','_')};`).replace(/\bexport /g,'');
  if(/\bimport\s/.test(source))throw Error('Unbundled import: '+name);
  bundle+=`const module_${name.replaceAll('-','_')}=(()=>{\n${source}\nreturn {${exported.join(',')}};\n})();\n`;
}
write('garden-flight.bundle.js',bundle+'})();\n');
write('garden-flight.css',fs.readFileSync(path.join(root,'garden-flight.css')));
let html=fs.readFileSync(path.join(root,'garden-flight.html'),'utf8').replaceAll('?v=0.94','?v='+version).replace('<title>Сад Эха · первый полёт</title>','<title>Сад Эха</title>');
html=html.replace('<link rel="icon" href="data:,">','<link rel="icon" href="icon.svg"><link rel="apple-touch-icon" href="icon-192.png"><link rel="manifest" href="manifest.webmanifest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Сад Эха">');
html=html.replace(/<a class="quiet back-to-planets"[^>]*>.*?<\/a>/,'');
html=html.replace('</body>','<script src="pwa.js"></script></body>');
write('index.html',html);
// Only runtime assets. No PNG masters, studies, other planets or book PDFs.
const assets=new Set(['blue-gardens.webp','night-bloom-aligned.webp','white-thaw-aligned.webp','manta.webp','lotus.webp','start-garden-orbital-v3.jpg',...Object.values(GARDEN_ITEMS).filter(i=>i.sprite).map(i=>'collectibles/'+i.sprite+'.webp'),...['felt-c3','felt-e3','felt-g3'].map(n=>'samples/'+n+'.wav'),...['reharm','anime','chill','ambient','cinematic','deep-house','funk','gospel','drum-bass'].map(n=>'tours/'+n+'.webp')]);
for(const asset of assets){
  const meteor=asset==='collectibles/meteor-volcanic.webp',master=path.join(assetRoot,'collectibles/meteor-volcanic.png');
  const from=meteor&&fs.existsSync(master)?master:path.join(assetRoot,asset),to=path.join(output,'assets/echo-garden',asset);
  const scene=['blue-gardens.webp','night-bloom-aligned.webp','white-thaw-aligned.webp'].includes(asset),ship=['manta.webp','lotus.webp'].includes(asset);
  const collectible=asset.startsWith('collectibles/'),meta=collectible?await sharp(from).metadata():null;
  if(scene||ship||meteor||collectible&&(meta.width>512||meta.height>512)){const size=scene?1024:ship?768:512;fs.mkdirSync(path.dirname(to),{recursive:true});await sharp(from).resize(size,size,{fit:'inside',withoutEnlargement:true}).webp({quality:collectible?86:82,alphaQuality:100}).toFile(to);}
  else write('assets/echo-garden/'+asset,fs.readFileSync(from));
}
write('icon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#102e37"/><g fill="none" stroke="#b1d6cc" stroke-width="8"><path d="M256 382C116 317 116 185 256 85C396 185 396 317 256 382Z"/><path d="M256 382C100 382 43 268 62 170C182 190 256 278 256 382ZM256 382C412 382 469 268 450 170C330 190 256 278 256 382Z"/><path d="M256 382C142 454 40 368 32 306C140 290 212 326 256 382ZM256 382C370 454 472 368 480 306C372 290 300 326 256 382Z"/></g></svg>');
for(const size of [192,512])await sharp(path.join(output,'icon.svg')).resize(size,size).png().toFile(path.join(output,`icon-${size}.png`));
write('manifest.webmanifest',JSON.stringify({id:'./',name:'Сад Эха',short_name:'Сад Эха',description:'Музыкальный полёт: узнавай бас и аккорды, собирай живую аранжировку.',lang:'ru',start_url:'./',scope:'./',display:'standalone',orientation:'portrait',background_color:'#102e37',theme_color:'#102e37',icons:[192,512].map(size=>({src:`icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any'}))},null,2));
write('pwa.js',`if('serviceWorker' in navigator&&location.protocol!=='file:'){const register=()=>navigator.serviceWorker.register('./service-worker.js',{scope:'./'}).catch(()=>{});if(window.gardenFlight?.snapshot().ready)register();else addEventListener('garden-ready',register,{once:true});}\n`);
const cacheHash=createHash('sha256').update(bundle).update(html).update(fs.readFileSync(path.join(root,'garden-flight.css')));
for(const asset of assets)cacheHash.update(fs.readFileSync(path.join(output,'assets/echo-garden',asset)));
const cacheRevision=cacheHash.digest('hex').slice(0,10);
const precache=['./','index.html','garden-flight.css','garden-flight.bundle.js','manifest.webmanifest','pwa.js','icon.svg','icon-192.png','icon-512.png',...[...assets].map(a=>'assets/echo-garden/'+a)];
write('service-worker.js',`const CACHE_NAME='echo-garden-${version}-${cacheRevision}';
const FILES=${JSON.stringify(precache)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('echo-garden-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(!url.href.startsWith(self.registration.scope))return;event.respondWith(caches.open(CACHE_NAME).then(async cache=>{const cached=await cache.match(event.request,{ignoreSearch:true});if(cached)return cached;try{const response=await fetch(event.request);return response;}catch(error){if(event.request.mode==='navigate')return cache.match('index.html');throw error;}}));});
`);
write('release.json',JSON.stringify({version,name:'Сад Эха',standalone:true,notes:'Brighter liquid hemispheres, keyboard focus recovery, rare restoration wheel, 3-hit cocoon, confirmed home exit, icon-only pause, answer-released infinity, progressive mobile graphics.'},null,2));
// Keep this prototype independently rebuildable without changing the planet app.
for(const file of ['mobile-gestures.js','garden-flight.html','garden-flight.css',...['book-catalog','music','garden-flight-renderer','garden-arrangement','garden-harmony','garden-tour-routes','garden-sequence-studio','garden-life','garden-rewards','garden-difficulty','garden-flight'].map(n=>n+'.mjs'),...['build-garden-standalone.mjs','garden-palette-check.mjs','garden-lotus-check.mjs','garden-rewards-check.mjs','garden-infinity-check.mjs','garden-infinity-artifact-check.mjs','garden-musical-audit-check.mjs','garden-harmony-check.mjs','garden-life-check.mjs','garden-shield-check.mjs','garden-restoration-check.mjs','garden-difficulty-check.mjs','garden-arrangement-check.mjs','garden-release-check.cjs'].map(n=>'tools/'+n)])write('source/'+file,fs.readFileSync(path.join(root,file)));
write('README.md',`# Сад Эха ${version}\n\nStandalone PWA, desktop and mobile browsers. Entry point: ./index.html. Install from the browser's Add to Home Screen action. This is not an App Store/Google Play binary.\n\nOnly Garden runtime assets are precached (about 10 MB), no other planets. On first visit the offline cache must finish downloading. Progress, favourites and welcome-tour dismissal are device-local. The existing /game/ 0.94 release remains unchanged.\n\n## Rebuild\n\nSource: source/. Requires Node.js and sharp. Run node source/tools/build-garden-standalone.mjs /absolute/output/path. Bump version (and therefore CACHE_NAME) for each PWA release. Browser regression uses Playwright and Chrome: GARDEN_RELEASE_URL=http://127.0.0.1:PORT/ node source/tools/garden-release-check.cjs.\n\n## 0.95\n\n- Bottom rail grades the actual bass; slash-chord answers specify the upper chord degree separately. Exact musical notes/catalog preserved.\n- sus4 has a fixed place in the right rail (Chill 1 regression).\n- Iridescent flower reveals the missing bass degree without spending a charge on a solved position.\n- Cocoon protects three ordinary stone impacts; lava, errors and reserve drain bypass it.\n- Infinity exits immediately on a correct answer or the visible ▶ button.\n\n- Wheel of Life is a flat procedural mandala with five counter-rotating rings, not a raster jewel. Pickup restores all four reserves to 100%; one 35% rescue lottery when 1–3 unsolved chords remain and any reserve is at or below 18%, plus a rare background chance. At most one per flight; no post-game revival.\n\n- Keyboard movement works after focusing answer/menu buttons; editable fields keep normal typing.\n\n- Back arrow beside settings asks before ending the flight. Pause/continue use international icons only.\n\n- Active accompaniment buttons display miniatures of the exact caught flowers.\n- Progressive launch loads scenery/ship first; optional items load in the background. Mobile uses a lighter shader and adaptive pixel density. Scene and ship textures are smaller; meteor alpha is preserved in compact WebP.\n- Root spirals filter bass, coloured seeds filter chords, with no letters in the sky. Stronger colours leave fewer choices.\n- Growing vine and fireflies for a correct bass; existing chord blossom retained.\n- Visible Garden home exit, paused settings, refined welcome guide and offline install.\n\nVerification: 119 routes with two filter strengths; 679 book sonorities and 22 qualities in 12 keys; pickup-to-inventory infinity regression; responsive browser run at 320/390/430/1440 widths; offline reload. Physical iPhone/Android device testing is still required.\n`);
console.log(`Garden ${version}: ${assets.size} assets, ${(Buffer.byteLength(bundle)/1024).toFixed(0)} KB code, output ${output}`);
