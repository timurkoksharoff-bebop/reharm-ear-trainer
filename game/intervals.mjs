export const INTERVAL_TARGETS={
  3:{glyph:'♭3',name:'малая терция',hint:'Три полутона'},
  4:{glyph:'3',name:'большая терция',hint:'Четыре полутона'},
  7:{glyph:'5',name:'чистая квинта',hint:'Семь полутонов'},
};
export const INTERVAL_MODES={up:{name:'Две ноты вверх',energy:20},down:{name:'Две ноты вниз',energy:30},together:{name:'Две ноты вместе',energy:40}};
export const targetForSector=sector=>[3,4,7,3][sector];
export function createCapsule(sector,rng=Math.random){
  const wanted=targetForSector(sector),match=rng()<.55;
  const alternatives=[3,4,5,7].filter(n=>n!==wanted);
  const heard=match?wanted:alternatives[Math.floor(rng()*alternatives.length)];
  const mode=['up','down','together'][Math.floor(rng()*3)];
  return {wanted,heard,mode,energy:INTERVAL_MODES[mode].energy};
}
export function intervalCue(base,semitones,mode){
  if(mode==='together')return {events:[{at:.12,duration:1.35,notes:[base,base+semitones]}],duration:1.55};
  const notes=mode==='down'?[base+semitones,base]:[base,base+semitones];
  return {events:notes.map((note,i)=>({at:.12+i*.75,duration:.70,notes:[note]})),duration:1.78};
}
export function capsuleOutcome(capsule){return {correct:capsule.wanted===capsule.heard,energy:capsule.wanted===capsule.heard?capsule.energy:-20};}
