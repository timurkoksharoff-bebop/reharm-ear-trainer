export const GARDEN_DIFFICULTIES=Object.freeze({
  light:{speed:.7,barSeconds:7,spawnRate:.35,drain:.12,wrongDamage:.5,minResource:25,maxChapter:1,maxLength:4},
  medium:{speed:2,barSeconds:4,spawnRate:1,drain:1,wrongDamage:3,minResource:0,maxChapter:16,maxLength:18},
  hard:{speed:2.6,barSeconds:2.8,spawnRate:1.5,drain:1.7,wrongDamage:6,minResource:0,maxChapter:16,maxLength:32}
});
export const difficultyProfile=name=>GARDEN_DIFFICULTIES[name]||GARDEN_DIFFICULTIES.medium;
