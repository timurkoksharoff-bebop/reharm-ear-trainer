import {gardenExercisesForChapter} from './garden-harmony.mjs';
import {gardenFlightStars} from './garden-route-rating.mjs';

export const GARDEN_TEACHER_CHAPTERS=Object.freeze([2,3,4,7,8,9,12,13]);
const all=Array.from({length:16},(_,i)=>gardenExercisesForChapter(i+1)).flat();
export const gardenHasIndependentBass=route=>route.sequence.some(c=>Number(c.offset)!==Number(c.bassOffset??c.offset));
export const GARDEN_TEACHER_EXAMS=Object.freeze(GARDEN_TEACHER_CHAPTERS.flatMap(ch=>gardenExercisesForChapter(ch)).map(r=>r.id));
export const GARDEN_PROFESSOR_EXAMS=Object.freeze(all.filter(gardenHasIndependentBass).map(r=>r.id));
export const GARDEN_SECRET_ROUTE='cinematic-epic-13';
export const GARDEN_SECRET_STARS=3;
const approved=new Set(all.map(r=>r.id)),KEY='ear-yoga-mode-access.v1';
const validFlight=f=>f&&['medium','hard'].includes(f.difficulty)&&Number.isFinite(f.accuracy)&&f.accuracy>0&&Number.isFinite(f.laps)&&f.laps>=0&&(f.independent||f.ratingCap===4);
export class GardenModeAccess{
 constructor({storage=null,flights=[],testing=false}={}){this.testing=Boolean(testing);this.storage=storage;this.data={version:1,medium:[],hard:[],allAccess:false};try{const raw=JSON.parse(storage?.getItem(KEY)||'null');if(raw?.version===1){for(const mode of ['medium','hard'])this.data[mode]=[...new Set((Array.isArray(raw[mode])?raw[mode]:[]).filter(id=>approved.has(id)))];this.data.allAccess=raw.allAccess===true;}}catch{}for(const f of flights)this.record(f,{official:approved.has(f.route)||f.route===GARDEN_SECRET_ROUTE,save:false});
  // One narrow recovery for the secret route: a previously awarded3+star best
  // already proves this passage, including reduced-choice help. Full reveals
  // are capped at2stars. Other stars never substitute for Reharm exam evidence.
  try{const stars=JSON.parse(storage?.getItem('ear-yoga-route-stars.v1')||'{}')?.[GARDEN_SECRET_ROUTE]?.stars;if(Number.isInteger(stars)&&stars>=GARDEN_SECRET_STARS&&stars<=5)this.data.allAccess=true;}catch{}
  this.save();}
 save(){try{this.storage?.setItem(KEY,JSON.stringify(this.data));}catch{}}
 record(f,{official=false,demo=false,save=true}={}){
  if(demo||!official||!validFlight(f))return {changed:false,secret:false};
  const before=this.snapshot(),mode=f.difficulty;
  if(approved.has(f.route)&&!this.data[mode].includes(f.route))this.data[mode].push(f.route);
  // Use the visible grade rather than a second hidden accuracy/lap threshold.
  // Partial filters may earn this; demos, full reveals and Cadet cannot.
  const secret=f.route===GARDEN_SECRET_ROUTE&&gardenFlightStars(f)>=GARDEN_SECRET_STARS;
  if(secret)this.data.allAccess=true;
  if(save)this.save();const after=this.snapshot();return {changed:JSON.stringify(before)!==JSON.stringify(after),secret:!before.allAccess&&after.allAccess,teacher:!before.hard&&after.hard,professor:!before.professor&&after.professor};
 }
 can(mode){if(mode==='light'||mode==='medium')return true;if(mode==='guru')return false;const s=this.snapshot();return mode==='hard'?s.hard:mode==='professor'?s.professor:false;}
 snapshot(){const base=new Set([...this.data.medium,...this.data.hard]),teacherDone=GARDEN_TEACHER_EXAMS.filter(id=>base.has(id)).length,professorDone=GARDEN_PROFESSOR_EXAMS.filter(id=>this.data.hard.includes(id)).length,hard=this.testing||this.data.allAccess||teacherDone===GARDEN_TEACHER_EXAMS.length;return {testing:this.testing,allAccess:this.data.allAccess,hard,professor:this.testing||this.data.allAccess||(hard&&professorDone===GARDEN_PROFESSOR_EXAMS.length),teacherDone,teacherTotal:GARDEN_TEACHER_EXAMS.length,professorDone,professorTotal:GARDEN_PROFESSOR_EXAMS.length,chapters:GARDEN_TEACHER_CHAPTERS.map(ch=>{const routes=gardenExercisesForChapter(ch);return {chapter:ch,done:routes.filter(r=>base.has(r.id)).length,total:routes.length};})};}
 requirements(mode,en=false){const s=this.snapshot();if(mode==='guru')return en?'Guru is still being developed.':'Гуру пока в разработке.';if(mode==='hard')return en?`Complete Reharm chapters ${GARDEN_TEACHER_CHAPTERS.join(', ')} in Pilot: ${s.teacherDone}/${s.teacherTotal} routes. Answer every part yourself; reduced-choice hints are allowed.`:`Пройди в режиме «Пилот» главы Reharm ${GARDEN_TEACHER_CHAPTERS.join(', ')}: ${s.teacherDone}/${s.teacherTotal} маршрутов. Ответы — своими силами; сокращать варианты подсказкой можно.`;return en?`Complete all ${s.professorTotal} independent-bass Reharm routes in Navigator: ${s.professorDone}/${s.professorTotal}. They occur in chapters 1, 5, 6, 10, 11, 14, 16.`:`Пройди в режиме «Штурман» все ${s.professorTotal} маршрутов Reharm с независимым басом: ${s.professorDone}/${s.professorTotal}. Они есть в главах 1, 5, 6, 10, 11, 14, 16.`;}
}
