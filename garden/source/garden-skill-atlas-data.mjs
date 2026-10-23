import {GARDEN_MODES,GARDEN_MODE_FAMILIES,gardenModeFormula} from './garden-modes.mjs';
import {gardenProfessorLesson} from './garden-professor-teacher.mjs';

// Read-only projection of the local teacher ledger. The cumulative good/bad
// counters are not reconstructed from recent choices or recurring difficulties.
// Chord/tension patterns intentionally have no fabricated success denominator.
const atlasFamilies=new Map(GARDEN_MODE_FAMILIES.map(f=>[f.id,f]));
const atlasLessons=new Map();
const atlasCount=n=>Number.isSafeInteger(n)&&n>=0?n:0;
const atlasRatio=(good,total)=>total>0?good/total:null;
export function gardenSkillAtlasData(snapshot={},options={}){
 const en=options.language==='en',t=(ru,eng)=>en?eng:ru;
 const rows=snapshot?.modes&&typeof snapshot.modes==='object'?snapshot.modes:{};
 const enabledFamilies=Array.isArray(options.enabledFamilies)?new Set(options.enabledFamilies):null;
 const nodes=GARDEN_MODES.map(mode=>{
  const row=rows[mode.id]||{},good=atlasCount(row.good),bad=atlasCount(row.bad),tries=good+bad;
  const recent=(Array.isArray(row.recent)?row.recent:[]).filter(n=>n===0||n===1).slice(-20);
  const contexts=[...new Set((Array.isArray(row.contexts)?row.contexts:[]).filter(s=>typeof s==='string'))].slice(-30);
  const recentGood=recent.reduce((sum,n)=>sum+n,0),recentAccuracy=atlasRatio(recentGood,recent.length);
  const mastered=recent.length>=8&&recentAccuracy>=.8&&contexts.length>=3;
  const needsPractice=!mastered&&recent.length>=4&&recentAccuracy<.5&&contexts.length>=2;
  let lesson=atlasLessons.get(mode.id);if(!lesson){lesson=gardenProfessorLesson(mode);atlasLessons.set(mode.id,lesson);}
  const family=atlasFamilies.get(mode.family);
  return {
   id:mode.id,lessonId:mode.id,title:en?mode.en:mode.ru,label:mode.label,
   formula:gardenModeFormula(mode),family:mode.family,familyTitle:en?family.en:family.ru,familyColor:family.color,
   notes:[...mode.notes],tries,good,bad,accuracy:atlasRatio(good,tries),recentAccuracy,recentTries:recent.length,
   contexts:contexts.length,mastered,mastery:mastered,needsPractice,status:mastered?'mastered':needsPractice?'review':tries?'learning':'new',
   trackingAvailable:true,enabled:!enabledFamilies||enabledFamilies.has(mode.family),locked:false,
   // The existing ledger never stored dates. A missing date is not "just now".
   lastSeen:null,aliases:lesson.aliases,description:lesson.advice[en?1:0],
   example:{label:lesson.example.label,quality:lesson.example.quality,tones:[...lesson.example.tones],compatible:lesson.compatible}
  };
 });
 const good=nodes.reduce((sum,n)=>sum+n.good,0),bad=nodes.reduce((sum,n)=>sum+n.bad,0),tries=good+bad;
 return {
  groups:[{id:'modes',title:t('Лады','Scales'),nodes}],
  summary:{total:nodes.length,used:nodes.filter(n=>n.tries>0).length,mastered:nodes.filter(n=>n.mastered).length,good,bad,tries,accuracy:atlasRatio(good,tries),stage:Number.isInteger(snapshot?.stage)?snapshot.stage:0},
  note:t('Оценённые выборы с начала локального учёта. Спорные сочетания и границы аккордов не считаются. Повторный контакт в той же позиции не дублирует один и тот же результат. Освоение — по последним 20 выборам и нескольким позициям.','Graded choices since local tracking began. Contextual combinations and chord boundaries are excluded. Repeated contact at one position does not duplicate the same result. Mastery uses the latest 20 choices across several positions.'),
  emptyNote:t('Пока нет оценённых выборов. Это новый материал, а не плохой результат.','No graded choices yet. This is new material, not a poor result.'),
  otherSkillsNote:t('Полная статистика аккордов и надстроек пока не собиралась: повторяющиеся затруднения не заменяют точность.','Complete chord and tension statistics have not been collected yet; recurring difficulties are not an accuracy score.'),
  history:{scope:'since-local-teacher-tracking',recentLimit:20,contextLimit:30,lastSeenAvailable:false,chordAccuracyAvailable:false,tensionAccuracyAvailable:false}
 };
}
