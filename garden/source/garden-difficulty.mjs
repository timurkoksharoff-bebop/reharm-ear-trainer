import {BOOK_CATALOG} from './book-catalog.mjs';

// Exact existing book examples: no simplified or newly authored harmony.
export const GARDEN_ADMISSION_ROUTES=Object.freeze(['fig-1-6','fig-1-7','fig-1-9'].map(id=>BOOK_CATALOG.find(route=>route.id===id)));
export function gardenAdmissionState(progress={}){
  const completed=[...new Set((progress.admissionCompleted||[]).filter(id=>GARDEN_ADMISSION_ROUTES.some(route=>route.id===id)))];
  return {completed,total:GARDEN_ADMISSION_ROUTES.length,finished:completed.length===GARDEN_ADMISSION_ROUTES.length,next:GARDEN_ADMISSION_ROUTES.find(route=>!completed.includes(route.id))||GARDEN_ADMISSION_ROUTES[0]};
}
export function recordGardenAdmission(progress,id){
  const before=gardenAdmissionState(progress);
  if(!GARDEN_ADMISSION_ROUTES.some(route=>route.id===id)||before.completed.includes(id))return false;
  progress.admissionCompleted=[...before.completed,id];
  return !before.finished&&gardenAdmissionState(progress).finished;
}

export const GARDEN_DIFFICULTIES=Object.freeze({
  light:{speed:.7,barSeconds:7,spawnRate:.35,drain:.12,wrongDamage:.5,minResource:25,maxChapter:1,maxLength:4},
  medium:{speed:2,barSeconds:4,spawnRate:1,drain:1,wrongDamage:3,minResource:0,maxChapter:16,maxLength:18},
  hard:{speed:2.6,barSeconds:2.8,spawnRate:1.5,drain:1.7,wrongDamage:6,minResource:0,maxChapter:16,maxLength:32}
});
export const difficultyProfile=name=>GARDEN_DIFFICULTIES[name]||GARDEN_DIFFICULTIES.medium;
