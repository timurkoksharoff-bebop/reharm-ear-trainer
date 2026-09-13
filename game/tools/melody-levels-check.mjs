import assert from 'node:assert/strict';
import {IMPORTED_MELODIES} from '../melodies-catalog.mjs';
import {NOVICE_MELODY_INDICES,STUDENT_MELODY_INDICES,MASTER_MELODY_INDICES,LEGEND_MELODY_INDICES,MELODY_LEVEL_COUNTS,melodyIndicesForLevel} from '../melody-levels.mjs';

assert.deepEqual(MELODY_LEVEL_COUNTS,[24,50,100,200]);
for(const pool of [NOVICE_MELODY_INDICES,STUDENT_MELODY_INDICES,MASTER_MELODY_INDICES,LEGEND_MELODY_INDICES]){
  assert.equal(new Set(pool).size,pool.length,'Each level pool must contain unique themes');
  assert(pool.every(index=>IMPORTED_MELODIES[index]),'Every level entry must resolve to a playable imported melody');
}
assert(NOVICE_MELODY_INDICES.every(index=>STUDENT_MELODY_INDICES.includes(index)));
assert(STUDENT_MELODY_INDICES.every(index=>MASTER_MELODY_INDICES.includes(index)));
assert(MASTER_MELODY_INDICES.every(index=>LEGEND_MELODY_INDICES.includes(index)));
assert.equal(melodyIndicesForLevel(0).length,24);
assert.equal(melodyIndicesForLevel(1).length,50);
assert.equal(melodyIndicesForLevel(2).length,100);
assert.equal(melodyIndicesForLevel(3).length,200);
console.log('Melody level checks passed: 24 novice, 50 student, 100 master, 200 legend.');
