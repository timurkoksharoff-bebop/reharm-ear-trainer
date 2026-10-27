import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {GardenModeAuditionSettings,gardenModeAuditionConfig,gardenModeAuditionPlan,GARDEN_MODE_AUDITION_DEFAULTS} from '../garden-mode-audition.mjs';
import {gardenModePhraseZero} from '../garden-mode-phrases-zero.mjs';
import {gardenModePhraseDense} from '../garden-mode-phrases-dense.mjs';
import {gardenModePhraseImproved} from '../garden-mode-phrases-improved.mjs';
import {gardenModePhrase} from '../garden-mode-phrases.mjs';
import {GARDEN_MODES} from '../garden-modes.mjs';

const memory=new Map(),storage={getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value)},settings=new GardenModeAuditionSettings({storage});
assert.deepEqual(settings.snapshot(),GARDEN_MODE_AUDITION_DEFAULTS);
settings.set({preset:'zero'});assert.equal(new GardenModeAuditionSettings({storage}).snapshot().preset,'zero');
settings.set({preset:'dense'});assert.equal(new GardenModeAuditionSettings({storage}).snapshot().preset,'dense','dense is an opt-in saved preference');
settings.set({preset:'improved'});assert.equal(new GardenModeAuditionSettings({storage}).snapshot().preset,'improved','improved phrases are a separate opt-in saved preference');
assert.deepEqual(new GardenModeAuditionSettings().snapshot(),GARDEN_MODE_AUDITION_DEFAULTS,'new preset does not change the default');
settings.set({preset:'mixed',arpeggioPercent:35,combinedPercent:15,rhythm:'free'});const oldMixed=settings.snapshot();settings.set({preset:'dense'});settings.set({preset:'mixed'});assert.deepEqual(settings.snapshot(),oldMixed,'dense keeps existing mix preferences for switching back');
settings.set({arpeggioPercent:80,combinedPercent:15});settings.set({combinedPercent:40});assert.equal(settings.snapshot().arpeggioPercent,60);
settings.set({arpeggioPercent:95});assert.equal(settings.snapshot().combinedPercent,5);
assert.deepEqual(gardenModeAuditionConfig({preset:'bad',rhythm:'bad',arpeggioPercent:-3,combinedPercent:Infinity}),{preset:'mixed',rhythm:'lively',arpeggioPercent:0,combinedPercent:25});
settings.reset();const detached=settings.snapshot();detached.preset='scale';assert.equal(settings.snapshot().preset,'mixed');
const blocked=new GardenModeAuditionSettings({storage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}}});assert.equal(blocked.set({preset:'scale'}).preset,'scale');

const notes=[60,62,63,65,67,69,70,72],options={modeId:'dorian',chord:{quality:'m7'},remaining:3.8,barSeconds:4,variation:0};
for(let variation=-16;variation<24;variation++){
 const zero=gardenModeAuditionPlan(notes,{...options,variation,audition:{preset:'zero'}}),baseline=gardenModePhraseZero(notes,{...options,variation});
 for(const key of ['notes','events','pattern','motifId','duration'])assert.deepEqual(zero[key],baseline[key],'Phrase0 is preserved exactly');
 const mixedConfig={preset:'mixed',arpeggioPercent:35,combinedPercent:15,rhythm:'free'},mixed=gardenModeAuditionPlan(notes,{...options,variation,audition:mixedConfig}),mixedBaseline=gardenModePhrase(notes,{...options,variation,mix:mixedConfig,rhythm:'free'});
 for(const key of ['notes','events','pattern','motifId','duration'])assert.deepEqual(mixed[key],mixedBaseline[key],'existing mixed dispatch stays unchanged');
}
const dense=gardenModeAuditionPlan(notes,{...options,audition:{preset:'dense',arpeggioPercent:100,combinedPercent:0,rhythm:'steady'}}),denseBaseline=gardenModePhraseDense(notes,options);
for(const key of ['notes','events','pattern','motifId','duration'])assert.deepEqual(dense[key],denseBaseline[key],'dense dispatch ignores disabled mixed controls');
assert.equal(dense.preset,'dense');
const improvedConfig={preset:'improved',arpeggioPercent:35,combinedPercent:15,rhythm:'free'};
for(let variation=0;variation<16;variation++){
 const improved=gardenModeAuditionPlan(notes,{...options,variation,audition:improvedConfig}),direct=gardenModePhraseImproved(notes,{...options,variation,mix:improvedConfig,rhythm:'free'});
 for(const key of ['notes','events','pattern','motifId','duration','requestedStyle'])assert.deepEqual(improved[key],direct[key],'improved preset uses its own planner and enabled mix/rhythm controls');
 assert.equal(improved.preset,'improved');
}
for(const [arp,combined]of [[0,0],[100,0],[0,100],[35,15],[10,60],[25,25]]){
 const counts={phrase:0,arpeggio:0,combined:0};const total=arp===25&&combined===25?104:100;
 for(let variation=0;variation<total;variation++){
  const plan=gardenModeAuditionPlan(notes,{...options,variation,remaining:6,audition:{preset:'mixed',arpeggioPercent:arp,combinedPercent:combined}});assert(plan);counts[plan.requestedStyle]++;
 }
 assert.equal(counts.arpeggio,total*arp/100);assert.equal(counts.combined,total*combined/100);assert.equal(counts.phrase,total*(100-arp-combined)/100);
}
for(const mode of GARDEN_MODES)for(const remaining of [.65,.8,1.7,3.8])for(let variation=0;variation<8;variation++)for(const preset of ['mixed','improved','dense','zero','arpeggio','scale']){
 const pitches=[...mode.notes,12].map(n=>60+n),plan=gardenModeAuditionPlan(pitches,{...options,modeId:mode.id,remaining,variation,audition:{preset}});assert(plan,mode.id+' '+preset+' '+remaining);
 assert(plan.events.every(e=>mode.notes.includes((e.midi-60+120)%12)&&e.onset+e.duration<=remaining-.10));
 if(preset==='arpeggio'){assert.equal(plan.style,'arpeggio');assert(plan.events.every(e=>e.role==='arpeggio'));assert(plan.segments.every(s=>s.kind==='arpeggio'));}
 if(preset==='scale')for(let i=1;i<plan.notes.length;i++)assert.equal(pitches.indexOf(plan.notes[i])-pitches.indexOf(plan.notes[i-1]),variation%2?-1:1,'pure scale stays stepwise');
}
for(let variation=0;variation<36;variation++){
 const steady=gardenModeAuditionPlan(notes,{...options,variation,audition:{rhythm:'steady'}});assert.equal(steady.requestedRhythm,'straight-rest');
}
// The original1.76 formula is kept as a separate named source, not just a
// promise to reconstruct it later from the mixed planner.
const baselineSource=fs.readFileSync(new URL('../garden-mode-phrases-zero.mjs',import.meta.url),'utf8');
assert.match(baselineSource,/preserved pure-phrase planner from local1\.76/);
assert.equal(createHash('sha256').update(baselineSource).digest('hex'),'fb61996701da6bba5634508fa95b915fbcfc22494e93b7d70b8340146d486bd2','Phrase0 remains the exact saved1.76 implementation');
console.log('Audition settings PASS: persistent opt-in dense/mixed/zero/scale presets, dense dispatch, exact Phrase0, configurable proportions,41 mode pitch/window checks, stepwise scales, steady rhythm and storage fallbacks.');
