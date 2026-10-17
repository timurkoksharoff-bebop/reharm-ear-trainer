// Garden-only PWA; does not modify existing /game/ releases or other planets.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {GARDEN_ITEMS} from '../garden-life.mjs';
import {JAZZ_STANDARDS} from '../../../game/standards-catalog.mjs';
import {parseStoredChart} from '../../../game/importer.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const assetRoot=fs.existsSync(path.join(root,'assets/echo-garden'))?path.join(root,'assets/echo-garden'):path.resolve(root,'../assets/echo-garden');
const output=process.argv[2];
if(!output||!path.isAbsolute(output))throw Error('Provide an absolute destination directory for the standalone Garden.');
const version='1.25';
const iconFile=size=>`icon-${size}-v${version}.png`;
const jazzTitles=['All of Me','All the Things You Are','Autumn Leaves','Blue Bossa','Fly Me to the Moon','Summertime','Take the A Train','Satin Doll','There Will Never Be Another You','On the Sunny Side of the Street','Misty','My Funny Valentine','Body and Soul','Night and Day','My Foolish Heart','In a Sentimental Mood','Georgia on My Mind','Stardust','The Nearness of You','Someone to Watch Over Me','A Night in Tunisia','Caravan','Giant Steps','Black Orpheus','Corcovado','Wave','Desafinado','Recorda Me','St. Thomas','Footprints','So What','Blue Monk','C Jam Blues',"Bag's Groove","Billie's Bounce",'Straight, No Chaser','Watermelon Man','Cantaloupe Island','Doxy','Oleo','Stella by Starlight','Days of Wine and Roses','On Green Dolphin Street','Have You Met Miss Jones?','How High the Moon','Just Friends','Solar','Confirmation','Softly, as in a Morning Sunrise','What Is This Thing Called Love?'];
const norm=value=>String(value).toLocaleLowerCase().replace(/[^a-z0-9]/g,'');
const jazzRecords=jazzTitles.map((title,index)=>{
  const aliases=title==='The Nearness of You'?['Nearness of You, The']:title==='Black Orpheus'?['Manha De Carnaval (Black Orpheus)']:[];
  const chart=JAZZ_STANDARDS.find(item=>[title,...aliases].some(alias=>norm(item.title)===norm(alias)))||JAZZ_STANDARDS.find(item=>[title,...aliases].some(alias=>norm(item.title).includes(norm(alias))));
  if(!chart)throw Error(`Jazz catalog is missing requested standard: ${title}`);
  const parsed=parseStoredChart(chart);
  if(parsed.unsupported.length)throw Error(`${title} contains unsupported chord symbols: ${parsed.unsupported.join(', ')}`);
  const sourceSequence=parsed.route?.sequence||parsed.measures.flatMap((measure,measureIndex)=>measure.map(chord=>({...chord,measure:measureIndex+1}))).map(chord=>({...chord,offset:(requireNotePitch(chord.root)-requireNotePitch(parsed.key)+12)%12,bassOffset:chord.bass? (requireNotePitch(chord.bass)-requireNotePitch(parsed.key)+12)%12:null}));
  if(!sourceSequence.length)throw Error(`${title} has no parsed harmony`);
  const tonic=parsed.route?.key??requireNotePitch(parsed.key);
  const sequence=sourceSequence.map((chord,step)=>{const offset=Number(chord.offset),rootMidi=48+tonic+offset,intervals=chord.intervals||[0,4,7];return {id:`jazz-${index+1}-${step+1}`,degree:chord.absolute||title,label:chord.absolute||title,offset,quality:chord.quality,notes:intervals.map(interval=>rootMidi+interval),bassOffset:chord.bassOffset??null,measure:chord.measure};});
  return {id:`jazz-standard-${String(index+1).padStart(2,'0')}`,tour:'jazz-standards',number:String(index+1).padStart(2,'0'),name:title,source:`Jazz 1460 · ${chart.title}${parsed.warnings.length?' · форма/повторы требуют сверки':''}`,baseTonic:tonic,sequence,distractors:[],builtin:true,created:'2000-01-01T00:00:00.000Z'};
});
function requireNotePitch(note){const names={C:0,D:2,E:4,F:5,G:7,A:9,B:11},match=String(note||'').match(/^([A-G])([#b]?)/);if(!match)throw Error(`Unknown note in Jazz 1460: ${note}`);return (names[match[1]]+(match[2]==='#'?1:match[2]==='b'?-1:0)+12)%12;}
const userSeed=JSON.parse(fs.readFileSync(path.join(root,'embedded-user-routes.json'),'utf8'));
const embeddedRoutes=userSeed.routes.map(([id,name,number,tour,baseTonic,created,steps])=>({
  id,name,number,tour,baseTonic,created,source:`${userSeed.categories.find(([categoryId])=>categoryId===tour)?.[1]||({anime:'Anime','deep-house':'Deep House',funk:'Funk',cinematic:'Cinematic'}[tour]||'Cinematic')} · маршрут ${number}`,
  distractors:[],builtin:true,
  sequence:steps.map(([label,rootPc,quality,notes,voicingNote],index)=>{const bassMidi=Math.min(...notes),bassPc=(bassMidi%12+12)%12;return {id:`${id}-${index+1}`,degree:label,label,rootPc,quality,notes,bassMidi,bassPc,bassOffset:(bassPc-rootPc+12)%12,offset:(rootPc-baseTonic+12)%12,voicingNote:voicingNote||null,duration:0,audio:null,mimeType:''};})
}));
const embeddedCategories=userSeed.categories.map(([id,name,mandalaSeed])=>({id,name,mandalaSeed,builtin:true}));
const sharp=createRequire(import.meta.url)('sharp');
fs.mkdirSync(output,{recursive:true});
const write=(name,data)=>{fs.mkdirSync(path.dirname(path.join(output,name)),{recursive:true});fs.writeFileSync(path.join(output,name),data);};
let bundle='/* Сад Эха '+version+' — standalone browser bundle */\n(()=>{\nwindow.GARDEN_VERSION='+JSON.stringify(version)+';window.GARDEN_ASSETS={"collectibles/meteor-volcanic":"assets/echo-garden/collectibles/meteor-volcanic.webp"};\nwindow.GARDEN_JAZZ_ROUTES='+JSON.stringify(jazzRecords)+';\n'+fs.readFileSync(path.join(root,'mobile-gestures.js'),'utf8')+'\n';
bundle=bundle.replace('window.GARDEN_JAZZ_ROUTES='+JSON.stringify(jazzRecords)+';','window.GARDEN_JAZZ_ROUTES='+JSON.stringify(jazzRecords)+';window.GARDEN_EMBEDDED_ROUTES='+JSON.stringify(embeddedRoutes)+';window.GARDEN_EMBEDDED_CATEGORIES='+JSON.stringify(embeddedCategories)+';');
for(const name of ['book-catalog','music','garden-flight-renderer','garden-arrangement','garden-harmony','garden-tour-routes','garden-jazz-routes','garden-sequence-studio','garden-life','garden-rewards','garden-difficulty','garden-trial','garden-language','garden-guide','garden-flight']){
  let source=fs.readFileSync(path.join(root,name+'.mjs'),'utf8');
  const exported=[...source.matchAll(/export (?:const|function|class) (\w+)/g)].map(m=>m[1]);
  source=source.replace(/import \{([^}]+)\} from '\.\/([\w-]+)\.mjs';/g,(_,ids,dep)=>`const {${ids}}=module_${dep.replaceAll('-','_')};`).replace(/\bexport /g,'');
  if(/\bimport\s/.test(source))throw Error('Unbundled import: '+name);
  bundle+=`const module_${name.replaceAll('-','_')}=(()=>{\n${source}\nreturn {${exported.join(',')}};\n})();\n`;
}
write('garden-flight.bundle.js',bundle+'})();\n');
write('ear-yoga.svg',fs.readFileSync(path.join(root,'ear-yoga.svg')));
write('source/ear-yoga.svg',fs.readFileSync(path.join(root,'ear-yoga.svg')));
write('garden-flight.css',fs.readFileSync(path.join(root,'garden-flight.css')));
write('ear-yoga-cover.css',fs.readFileSync(path.join(root,'ear-yoga-cover.css')));
// Local composition tool is separate from the game: edits never auto-apply.
write('yoga-layout-studio.html',fs.readFileSync(path.join(root,'yoga-layout-studio.html')));
write('yoga-layout-editor.js',fs.readFileSync(path.join(root,'yoga-layout-editor.js')));
let html=fs.readFileSync(path.join(root,'garden-flight.html'),'utf8').replace(/\?v=[^"'\s>]+/g,'?v='+version).replace('<title>Сад Эха · первый полёт</title>','<title>Сад Эха</title>');
html=html.replace('<link rel="icon" href="data:,">',`<link rel="icon" href="icon.svg?v=${version}"><link rel="apple-touch-icon" href="${iconFile(192)}"><link rel="manifest" href="manifest.webmanifest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="EAR YOGA">`);
html=html.replace(/<a class="quiet back-to-planets"[^>]*>.*?<\/a>/,'');
html=html.replace('</body>','<script src="pwa.js"></script></body>');
write('index.html',html);
// Only runtime assets. No PNG masters, studies, other planets or book PDFs.
const assets=new Set(['blue-gardens.webp','night-bloom-aligned.webp','white-thaw-aligned.webp','manta.webp','lotus.webp','start-garden-orbital-v4.jpg','fonts/InterVariable.woff2','fonts/Inter-LICENSE.txt',...Object.values(GARDEN_ITEMS).filter(i=>i.sprite).map(i=>'collectibles/'+i.sprite+'.webp'),...['felt-c3','felt-e3','felt-g3','hybrid-c4','hybrid-d4','hybrid-orchestra-c4','string-orchestra-c5','piano-n-c5'].map(n=>'samples/'+n+'.wav'),...['reharm','anime','chill','ambient','cinematic','deep-house','funk','gospel','drum-bass'].map(n=>'tours/'+n+'.webp')]);
for(const asset of assets){
  const meteor=asset==='collectibles/meteor-volcanic.webp',master=path.join(assetRoot,'collectibles/meteor-volcanic.png');
  const from=meteor&&fs.existsSync(master)?master:path.join(assetRoot,asset),to=path.join(output,'assets/echo-garden',asset);
  const scene=['blue-gardens.webp','night-bloom-aligned.webp','white-thaw-aligned.webp'].includes(asset),ship=['manta.webp','lotus.webp'].includes(asset);
  const collectible=asset.startsWith('collectibles/'),meta=scene||ship||collectible?await sharp(from).metadata():null,size=scene?1024:ship?768:512;
  // Already optimized WebP files are copied byte-for-byte, avoiding generational
  // image degradation on every rebuild of the same approved painting.
  if(meta&&(meta.width>size||meta.height>size)||meteor&&from.endsWith('.png')){fs.mkdirSync(path.dirname(to),{recursive:true});await sharp(from).resize(size,size,{fit:'inside',withoutEnlargement:true}).webp({quality:collectible?86:82,alphaQuality:100}).toFile(to);}
  else write('assets/echo-garden/'+asset,fs.readFileSync(from));
}
const mark=fs.readFileSync(path.join(root,'app-icon-lotus.svg'),'utf8');
write('icon.svg',mark);
for(const size of [192,512]){const png=await sharp(path.join(output,'icon.svg')).resize(size,size).png().toBuffer();write(iconFile(size),png);write(`icon-${size}.png`,png);}
write('manifest.webmanifest',JSON.stringify({id:'./',name:'EAR YOGA',short_name:'EAR YOGA',description:'Музыкальный полёт: узнавай бас и аккорды, собирай живую аранжировку.',lang:'ru',start_url:'./',scope:'./',display:'standalone',orientation:'portrait',background_color:'#102e37',theme_color:'#102e37',icons:[192,512].map(size=>({src:iconFile(size),sizes:`${size}x${size}`,type:'image/png',purpose:'any'}))},null,2));
write('pwa.js',`if('serviceWorker' in navigator&&location.protocol!=='file:'&&(!['localhost','127.0.0.1'].includes(location.hostname)||new URLSearchParams(location.search).has('offline-test'))){const register=()=>navigator.serviceWorker.register('./service-worker.js',{scope:'./'}).catch(()=>{});if(window.gardenFlight?.snapshot().ready)register();else addEventListener('garden-ready',register,{once:true});}\n`);
const cacheHash=createHash('sha256').update(bundle).update(html).update(fs.readFileSync(path.join(root,'garden-flight.css'))).update(fs.readFileSync(path.join(root,'ear-yoga-cover.css')));
for(const asset of assets)cacheHash.update(fs.readFileSync(path.join(output,'assets/echo-garden',asset)));
const cacheRevision=cacheHash.digest('hex').slice(0,10);
const precache=['ear-yoga-cover.css','ear-yoga.svg','./','index.html','garden-flight.css','garden-flight.bundle.js','manifest.webmanifest','pwa.js','icon.svg','icon-192.png','icon-512.png',iconFile(192),iconFile(512),...[...assets].map(a=>'assets/echo-garden/'+a)];
write('service-worker.js',`const CACHE_NAME='echo-garden-${version}-${cacheRevision}';
const FILES=${JSON.stringify(precache)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('echo-garden-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(!url.href.startsWith(self.registration.scope))return;event.respondWith(caches.open(CACHE_NAME).then(async cache=>{const cached=await cache.match(event.request,{ignoreSearch:true});if(cached)return cached;try{const response=await fetch(event.request);return response;}catch(error){if(event.request.mode==='navigate')return cache.match('index.html');throw error;}}));});
`);
write('release.json',JSON.stringify({version,name:'EAR YOGA',standalone:true,notes:'Includes four saved Cinematic routes (Journeying, Triumph, Cinematic Suspense 4, Cinematic epic), retaining their tonic centers, first-degree functions and MIDI voicings. After all answers, the solved sequence keeps playing in order with the current chord and degree highlighted; the next-route action chooses a different route and never restarts the current one.'},null,2));
// Keep this prototype independently rebuildable without changing the planet app.
for(const file of ['app-icon-lotus.svg','yoga-layout-studio.html','yoga-layout-editor.js','ear-yoga-cover.css','embedded-user-routes.json','yoga-locked-layout.json','mobile-gestures.js','garden-flight.html','garden-flight.css',...['book-catalog','music','garden-flight-renderer','garden-arrangement','garden-harmony','garden-tour-routes','garden-jazz-routes','garden-sequence-studio','garden-life','garden-rewards','garden-difficulty','garden-trial','garden-language','garden-guide','garden-flight'].map(n=>n+'.mjs'),...['build-garden-standalone.mjs','garden-palette-check.mjs','garden-lotus-check.mjs','garden-rewards-check.mjs','garden-infinity-check.mjs','garden-infinity-artifact-check.mjs','garden-musical-audit-check.mjs','garden-harmony-check.mjs','garden-life-check.mjs','garden-shield-check.mjs','garden-restoration-check.mjs','garden-difficulty-check.mjs','garden-arrangement-check.mjs','garden-mandala-check.mjs','garden-cinematic-catalog-check.mjs','garden-chill-flat-nine-check.cjs','garden-release-check.cjs','ear-yoga-check.mjs','ear-yoga-browser-check.cjs','garden-cover-editor-check.cjs','garden-teacher-check.mjs','garden-teacher-browser-check.cjs','garden-sample-start-check.mjs','garden-route-pages-check.cjs','garden-sample-balance-check.mjs'].map(n=>'tools/'+n)])write('source/'+file,fs.readFileSync(path.join(root,file)));
write('README.md',`# Сад Эха ${version}\n\nStandalone PWA, desktop and mobile browsers. Entry point: ./index.html. Install from the browser's Add to Home Screen action. This is not an App Store/Google Play binary.\n\nOnly Garden runtime assets are precached (about 10 MB), no other planets. On first visit the offline cache must finish downloading. Progress, favourites and welcome-tour dismissal are device-local. The existing /game/ 0.94 release remains unchanged.\n\n## Rebuild\n\nSource: source/. Requires Node.js and sharp. Run node source/tools/build-garden-standalone.mjs /absolute/output/path. Bump version (and therefore CACHE_NAME) for each PWA release. Browser regression uses Playwright and Chrome: GARDEN_RELEASE_URL=http://127.0.0.1:PORT/ node source/tools/garden-release-check.cjs.\n\n## ${version}\n\n- Bottom rail grades the actual bass; slash-chord answers specify the upper chord degree separately. Exact musical notes/catalog preserved.\n- sus4 has a fixed place in the right rail (Chill 1 regression).\n- Iridescent flower reveals the missing bass degree without spending a charge on a solved position.\n- Cocoon protects three ordinary stone impacts; lava, errors and reserve drain bypass it.\n- Infinity exits immediately on a correct answer or the visible ▶ button.\n\n- Wheel of Life is a flat procedural mandala with five counter-rotating rings, not a raster jewel. Pickup restores all four reserves to 100%; one 35% rescue lottery when 1–3 unsolved chords remain and any reserve is at or below 18%, plus a rare background chance. At most one per flight; no post-game revival.\n\n- Keyboard movement works after focusing answer/menu buttons; editable fields keep normal typing.\n\n- Back arrow beside settings asks before ending the flight. Pause/continue use international icons only.\n\n- Active accompaniment buttons display miniatures of the exact caught flowers.\n- Progressive launch loads scenery/ship first; optional items load in the background. Mobile uses a lighter shader and adaptive pixel density. Scene and ship textures are smaller; meteor alpha is preserved in compact WebP.\n- Root spirals filter bass, coloured seeds filter chords, with no letters in the sky. Stronger colours leave fewer choices.\n- Anti-idle pressure rings are thinner and more transparent; timing and reserve damage are unchanged.\n\n- Growing vine and fireflies for a correct bass; existing chord blossom retained.\n- Visible Garden home exit, paused settings, refined welcome guide and offline install.\n\nVerification: 119 routes with two filter strengths; 679 book sonorities and 22 qualities in 12 keys; pickup-to-inventory infinity regression; responsive browser run at 320/390/430/1440 widths; offline reload. Physical iPhone/Android device testing is still required.\n`);
write('source/tools/garden-admission-reveal-check.cjs',fs.readFileSync(path.join(root,'tools/garden-admission-reveal-check.cjs')));
write('README.md',fs.readFileSync(path.join(output,'README.md'),'utf8').replace('- Iridescent blue flower reveals both missing answer parts atomically, including independent slash basses; fully solved positions keep the charge.','- Iridescent blue flower reveals both missing answer parts atomically, including independent slash basses; fully solved positions keep the charge.')+'\n- Sound & Route Lab adds Jazz Standards and device-local custom categories, each assigned one of 20 procedural mandalas. Completing a route keeps the flight open with replay and unvisited-next-route choices.\n- Default playback is 20% louder with device-local volume and 3-band EQ. Familiar arrangements remain common; faster experimental flowers appear rarely.\n');
write('release.json',JSON.stringify({version,name:'EAR YOGA',publisher:'Space Music College',standalone:true,previewDays:60,trialStarts:'first launch on device; countdown preserved across updates',notes:'Test mobile release 1.25: upper lotus inventory with click-through empty space, lower non-overlapping bass column, sample levels balanced against unchanged Felt Piano, restored lotus app icons with versioned PNGs, discreet visible build number. Includes separated circular bass buttons and the brighter shield pickup. User-exported cover layout, experimental Teacher mode with root/quality/note bass and automatic root-position bass, readable paginated long routes with original harmony retained, synchronous sample attacks, contact-first answer buttons, dimmer daytime terrain, smaller flight ship, corrected Deep House 3 registers, category-prefixed numeric route names. Includes 50 Jazz Standards and all saved embedded routes. Student mechanics and the 60-day trial storage are preserved.'},null,2));
write('README.md','# EAR YOGA '+version+' — mobile PWA release\n\nSpace Music College. Includes the approved orbital cover, 50 Jazz Standards, 11 additional saved Route Lab routes and the custom Disco category, plus five sound samples. Existing local browser data is not deleted.\n\nInstall on a phone from HTTPS using Add to Home Screen / Install. Installable offline PWA for iOS and Android. Public URL: https://timurkoksharoff-bebop.github.io/reharm-ear-trainer/garden/.\n');
console.log(`Garden ${version}: ${assets.size} assets, ${(Buffer.byteLength(bundle)/1024).toFixed(0)} KB code, output ${output}`);
