import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import './bundle.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'dist');fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
// Explicit public allowlist: never package book PDFs, credentials or parent app.
const files=['index.html','game.css','game.bundle.js'];
for(const name of files)fs.copyFileSync(path.join(root,name),path.join(output,name));
fs.mkdirSync(path.join(output,'assets'),{recursive:true});
for(const name of ['hydra','enemyships','corvette','fortress','scout-art','cruiser-art','drummachine','trumpeter','keytarist','guitarist','drummer','band','ship','terrain','drone','moon','mars','teachers','artifacts']){
  const source=path.join(root,'assets',`${name}.png`);if(!fs.existsSync(source))throw new Error(`Missing game art: ${name}`);
  fs.copyFileSync(source,path.join(output,'assets',`${name}.png`));
}
for(const name of ['keytar-exact.svg','guitar-exact.svg'])fs.copyFileSync(path.join(root,'assets',name),path.join(output,'assets',name));
for(const name of fs.readdirSync(path.join(root,'assets')).filter(name=>name.endsWith('.webp')))fs.copyFileSync(path.join(root,'assets',name),path.join(output,'assets',name));
console.log('Static game build complete.');
