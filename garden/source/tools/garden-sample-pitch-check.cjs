// Render the real sample voice path in OfflineAudioContext; verify route registers
// against stored MIDI notes and measure Hybrid Keys' attack without changing tuning.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const base=process.env.GARDEN_RELEASE_URL||'http://127.0.0.1:8138/',out=process.env.GARDEN_QA_DIR||'/private/tmp/ear-yoga-147-audio';fs.mkdirSync(out,{recursive:true});
function wave(file,data,rate){const h=Buffer.alloc(44),pcm=Buffer.alloc(data.length*2);h.write('RIFF');h.writeUInt32LE(36+pcm.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(rate,24);h.writeUInt32LE(rate*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);data.forEach((v,i)=>pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),i*2));fs.writeFileSync(file,Buffer.concat([h,pcm]));}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});await page.goto(base);await page.waitForFunction(()=>gardenFlight?.snapshot().ready);await page.locator('#start-choose').click();await page.locator('[data-tour="ambient"]').click();await page.locator('.garden-route-choice').filter({has:page.locator('strong',{hasText:/^Ambient 1$/})}).click();
 if(await page.locator('#flight-tutorial').isVisible())await page.locator('#tutorial-close').click();await page.waitForFunction(()=>gardenFlight.snapshot().mission.running);await page.locator('#mission-toggle').click();
 const exercise=await page.evaluate(()=>gardenFlight.snapshot().mission.exercise);
 const result=await page.evaluate(async({exercise})=>{
  const {GardenPad}=await import('./source/garden-harmony.mjs'),{BUILTIN_TOUR_ROUTES}=await import('./source/garden-tour-routes.mjs');
  const raw=BUILTIN_TOUR_ROUTES.find(r=>r.id==='builtin-ambient-01').chords,registers=exercise.sequence.map(c=>c.notes);
  if(JSON.stringify(raw)!==JSON.stringify(registers))throw Error('Ambient 1 register differs from stored user MIDI');
  const rate=44100,rendered=[],audit=[];
  const encode=data=>{const bytes=new Uint8Array(data.buffer),chunks=[];for(let i=0;i<bytes.length;i+=16384)chunks.push(String.fromCharCode(...bytes.subarray(i,i+16384)));return btoa(chunks.join(''));};
  for(const preset of ['felt','hybrid','hybridOrchestra','stringOrchestra','pianoN']){
   const context=new OfflineAudioContext(1,rate*2,rate),pad=new GardenPad(),starts=[];pad.preset=preset;pad.context=context;pad.unlock=async()=>{};pad.cleanOutput=context.createGain();pad.cleanOutput.gain.value=.82*1.2;pad.cleanOutput.connect(context.destination);
   const bank=await pad.loadSampleBank(preset==='felt'?'felt':preset);const create=context.createBufferSource.bind(context);context.createBufferSource=()=>{const node=create(),start=node.start.bind(node);node.start=(at,offset)=>{starts.push({midi:bank.find(s=>s.buffer===node.buffer).midi+12*Math.log2(node.playbackRate.value),at,offset,rate:node.playbackRate.value});start(at,offset);};return node;};
   const notes=exercise.sequence[0].notes;await pad.play(exercise.sequence[0],exercise.baseTonic);const audio=await context.startRendering();rendered.push({name:preset,pcm:encode(audio.getChannelData(0))});
   for(let i=0;i<notes.length;i++)if(Math.abs(starts[i].midi-notes[i])>1e-5||starts[i].at!==0)throw Error(preset+' transposes or delays Ambient 1 '+JSON.stringify({starts,notes}));
   // Verify every note in all six chord voicings through the same real voice code.
   const all=[...new Set(registers.flat())],probe=new GardenPad(),seen=[];probe.preset=preset;probe.unlock=async()=>{};probe.cleanOutput={};probe.loadSampleBank=async()=>bank;probe.context={currentTime:0,createGain:()=>({gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){}},connect(){}}),createBufferSource(){const node={playbackRate:{value:1},connect(){},start(){seen.push(bank.find(s=>s.buffer===node.buffer).midi+12*Math.log2(node.playbackRate.value));}};return node;}};await probe.play({...exercise.sequence[0],notes:all},exercise.baseTonic);if(seen.some((m,i)=>Math.abs(m-all[i])>1e-5))throw Error(preset+' changes an Ambient 1 note');
   audit.push({preset,notes:starts.map(s=>s.midi),bassRate:starts[0].rate,bassTimeStretch:1/starts[0].rate});
   if(preset==='hybrid'){
    const before=new OfflineAudioContext(1,rate*2,rate),originalGain=before.createGain.bind(before);before.createGain=()=>{const node=originalGain();node.gain.linearRampToValueAtTime=(value)=>node.gain.setValueAtTime(value,0);return node;};const p=new GardenPad();p.preset=preset;p.context=before;p.unlock=async()=>{};p.loadSampleBank=async()=>bank;p.cleanOutput=before.createGain();p.cleanOutput.gain.value=.82*1.2;p.cleanOutput.connect(before.destination);await p.play(exercise.sequence[0],exercise.baseTonic);const a=await before.startRendering();rendered.push({name:'hybrid-before',pcm:encode(a.getChannelData(0))});
   }
  }
  return {registers,audit,rate,rendered};
 },{exercise});
 const audio={};for(const r of result.rendered){const bytes=Buffer.from(r.pcm,'base64'),data=new Float32Array(bytes.buffer,bytes.byteOffset,bytes.length/4);audio[r.name]=data;wave(path.join(out,r.name+'-ambient-1.wav'),data,result.rate);}
 const energy=(d,a,b)=>{let sum=0;for(let i=Math.round(a*result.rate);i<Math.round(b*result.rate);i++)sum+=d[i]*d[i];return sum;};
 const ratio=energy(audio.hybrid,0,.12)/energy(audio['hybrid-before'],0,.12);assert(ratio<.35,'Hybrid Keys attack was not softened');let sustainDiff=0;for(let i=Math.round(.30*result.rate);i<audio.hybrid.length;i++)sustainDiff=Math.max(sustainDiff,Math.abs(audio.hybrid[i]-audio['hybrid-before'][i]));assert(sustainDiff<1e-7,'Hybrid Keys sustain was changed');
 const report={registers:result.registers,audit:result.audit,attackEnergyRatio:ratio,sustainMaxDifference:sustainDiff,scope:'real sample voices before device EQ/limiter; no physical-device listening claim'};fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(report,null,2));console.log('PASS: Ambient 1 retains all six user MIDI voicings in all five instruments; first chord pitch [38,57,73,78] unchanged. Hybrid Keys first 120 ms energy ratio '+ratio.toFixed(3)+'; sustain difference '+sustainDiff+'. '+out);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
