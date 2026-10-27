import {gardenModePhrase} from './garden-mode-phrases.mjs';
import {gardenModePhraseDense} from './garden-mode-phrases-dense.mjs';
import {gardenModePhraseZero} from './garden-mode-phrases-zero.mjs';
import {gardenModeArpeggio} from './garden-mode-arpeggio.mjs';
import {gardenModePhraseImproved} from './garden-mode-phrases-improved.mjs';

export const GARDEN_MODE_AUDITION_DEFAULTS=Object.freeze({preset:'mixed',arpeggioPercent:25,combinedPercent:25,rhythm:'lively'});
const percent=(value,fallback)=>Number.isFinite(Number(value))?Math.max(0,Math.min(100,Math.round(Number(value)))):fallback;
export function gardenModeAuditionConfig(value={}){
 const arpeggioPercent=percent(value.arpeggioPercent,25),combinedPercent=Math.min(100-arpeggioPercent,percent(value.combinedPercent,25));
 return {preset:['mixed','improved','dense','zero','arpeggio','scale'].includes(value.preset)?value.preset:'mixed',arpeggioPercent,combinedPercent,rhythm:['lively','steady','free'].includes(value.rhythm)?value.rhythm:'lively'};
}
export class GardenModeAuditionSettings{
 constructor({storage=null}={}){this.storage=storage;let saved;try{saved=JSON.parse(storage?.getItem('ear-yoga-mode-audition.v1')||'null');}catch{}this.value=gardenModeAuditionConfig(saved?.version===1?saved:GARDEN_MODE_AUDITION_DEFAULTS);}
 snapshot(){return {...this.value};}
 set(patch={}){const next={...this.value,...patch};if(patch.combinedPercent!=null&&patch.arpeggioPercent==null&&Number(next.arpeggioPercent)+Number(next.combinedPercent)>100)next.arpeggioPercent=100-percent(next.combinedPercent,25);this.value=gardenModeAuditionConfig(next);try{this.storage?.setItem('ear-yoga-mode-audition.v1',JSON.stringify({version:1,...this.value}));}catch{}return this.snapshot();}
 reset(){return this.set(GARDEN_MODE_AUDITION_DEFAULTS);}
}
export function gardenModeScaleExercise(notes,{remaining=1.7,variation=0,barSeconds=4}={}){
 if(!Array.isArray(notes)||notes.length<2||!notes.every(Number.isFinite)||!Number.isFinite(remaining)||remaining<.65)return null;
 const available=Math.min(3.2,remaining-.12),count=Math.max(2,Math.min(notes.length,Math.floor(available/.14))),step=Math.min(.36,available/(count+.2));
 const down=Math.abs(Math.trunc(variation))%2===1,ordered=down?[...notes].reverse():[...notes],pitches=ordered.slice(0,count);
 const events=pitches.map((midi,index)=>({midi,onset:index*step,duration:step*.82,velocity:index===0||index===count-1?.8:.66,role:'exercise'}));
 return {notes:pitches,events,duration:events.at(-1).onset+events.at(-1).duration,step,pattern:down?'scale-down':'scale-up',style:'scale',requestedStyle:'scale',rhythm:'straight',beatSeconds:barSeconds/4};
}
export function gardenModeAuditionPlan(notes,{audition,...options}={}){
 const settings=gardenModeAuditionConfig(audition);
 const plan=settings.preset==='zero'?gardenModePhraseZero(notes,options):settings.preset==='arpeggio'?gardenModeArpeggio(notes,options):settings.preset==='scale'?gardenModeScaleExercise(notes,options):settings.preset==='dense'?gardenModePhraseDense(notes,options):settings.preset==='improved'?gardenModePhraseImproved(notes,{...options,mix:settings,rhythm:settings.rhythm}):gardenModePhrase(notes,{...options,mix:settings,rhythm:settings.rhythm});
 return plan?{...plan,audition:settings,preset:settings.preset}:null;
}
