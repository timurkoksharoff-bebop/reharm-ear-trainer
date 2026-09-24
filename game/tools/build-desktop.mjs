import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

await import('./build.mjs');

const gameRoot=fileURLToPath(new URL('../',import.meta.url));
const appRoot=path.join(gameRoot,'desktop-dist','Space Music College.app');
const contents=path.join(appRoot,'Contents');
const macOS=path.join(contents,'MacOS');
const resources=path.join(contents,'Resources');
const executable=path.join(macOS,'SpaceMusicCollege');
const source=path.join(gameRoot,'desktop','SpaceMusicCollege.m');

fs.rmSync(appRoot,{recursive:true,force:true});
fs.mkdirSync(macOS,{recursive:true});
fs.mkdirSync(resources,{recursive:true});
fs.cpSync(path.join(gameRoot,'dist'),resources,{recursive:true});
fs.copyFileSync(path.join(gameRoot,'..','icon-180.png'),path.join(resources,'icon-180.png'));
const desktopIndex=path.join(resources,'index.html');
fs.writeFileSync(desktopIndex,fs.readFileSync(desktopIndex,'utf8').replace('../icon-180.png','icon-180.png'));

const plist=`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDisplayName</key><string>Space Music College</string>
  <key>CFBundleExecutable</key><string>SpaceMusicCollege</string>
  <key>CFBundleIdentifier</key><string>local.codex.space-music-college</string>
  <key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
  <key>CFBundleName</key><string>Space Music College</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>0.86</string>
  <key>CFBundleVersion</key><string>86</string>
  <key>LSMinimumSystemVersion</key><string>11.0</string>
  <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
`;
fs.writeFileSync(path.join(contents,'Info.plist'),plist);

const compile=spawnSync('xcrun',['clang','-fobjc-arc',source,'-framework','Cocoa','-framework','WebKit','-o',executable],{
  stdio:'inherit',
  env:{...process.env,CLANG_MODULE_CACHE_PATH:path.join(gameRoot,'desktop-dist','.module-cache')}
});
if(compile.status!==0)throw new Error(`macOS wrapper compilation failed (${compile.status})`);

const sign=spawnSync('codesign',['--force','--deep','--sign','-',appRoot],{stdio:'inherit'});
if(sign.status!==0)throw new Error(`Ad-hoc signing failed (${sign.status})`);

console.log(appRoot);
