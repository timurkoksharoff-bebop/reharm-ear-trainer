const LEVELS=[
  {start:{fuel:74,energy:70,crew:88},drain:{fuel:.42,energy:.31,crew:.22},pickup:[7.0,10.0]},
  {start:{fuel:71,energy:67,crew:86},drain:{fuel:.52,energy:.39,crew:.28},pickup:[7.5,10.5]},
  {start:{fuel:68,energy:64,crew:84},drain:{fuel:.62,energy:.48,crew:.35},pickup:[8.0,11.0]},
  {start:{fuel:65,energy:61,crew:82},drain:{fuel:.72,energy:.57,crew:.43},pickup:[8.5,12.0]},
];
const clamp=value=>Math.max(0,Math.min(100,value));
export const SAMSARA_RESOURCE_LABELS={fuel:'Топливо исчерпано',energy:'Энергия исчерпана',crew:'Экипаж потерял силы',hull:'Корпус лотоса разрушен'};
export const SAMSARA_SUPPLY_WARNINGS={
  fuel:{name:'ТОПЛИВО',supply:'собери топливное семя'},
  energy:{name:'ЭНЕРГИЯ',supply:'собери водяную жемчужину'},
  crew:{name:'ЭКИПАЖ',supply:'собери ягоды экипажа'},
  hull:{name:'КОРПУС',supply:'собери ремонтный лотос'},
};
export function samsaraResourceWarnings(vitals,hullPercent=100){
  return Object.entries({...vitals,hull:hullPercent}).filter(([key,value])=>SAMSARA_SUPPLY_WARNINGS[key]&&value<=25)
    .sort((a,b)=>a[1]-b[1]).map(([key,value])=>({key,value:Math.max(0,Math.ceil(value)),critical:value<=12,...SAMSARA_SUPPLY_WARNINGS[key]}));
}
export function samsaraBalance(level=0){return LEVELS[Math.max(0,Math.min(LEVELS.length-1,Math.round(level)))]}
export function samsaraStartingVitals(level=0){return {...samsaraBalance(level).start}}
export function stepSamsaraVitals(vitals,dt,{level=0,forces=0}={}){
  const config=samsaraBalance(level),pressure=1+Math.max(0,forces)*.055;
  const next={
    fuel:clamp(vitals.fuel-dt*config.drain.fuel*pressure),
    energy:clamp(vitals.energy-dt*config.drain.energy*pressure),
    crew:clamp(vitals.crew),
  };
  if(next.fuel<18||next.energy<18)next.crew=clamp(next.crew-dt*config.drain.crew);
  const depleted=['fuel','energy','crew'].find(key=>next[key]<=0)||null;
  return {vitals:next,depleted,pressure};
}
export function samsaraPickupDelay(level=0,rng=Math.random){const [low,high]=samsaraBalance(level).pickup;return low+(high-low)*rng()}
export function samsaraPickupAmount(kind,level=0){
  const reduction=Math.min(2,Math.floor(Math.max(0,level)/2));
  return [11-reduction,10-reduction,9-reduction,2][kind]??0;
}
export function samsaraNeedsPickup(vitals,hullPercent=100){
  const needs=[100-vitals.fuel,100-vitals.energy,100-vitals.crew,100-hullPercent];
  return {needs,urgent:Math.max(...needs)>=22};
}
