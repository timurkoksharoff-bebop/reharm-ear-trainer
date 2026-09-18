import assert from 'node:assert/strict';
import {createSeasonPlanet, seasonState, SEASON_CYCLE} from '../seasons.mjs';

const near = (actual, expected, message, tolerance = 1e-9) =>
  assert(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} ≠ ${expected}`);
const phases = ['spring', 'summer', 'autumn', 'winter'];

// The calendar must run outside a browser: rendering resources are only needed
// when drawing, not when creating a planet, advancing it, or inspecting it.
assert.equal(typeof globalThis.document, 'undefined');
const planet = createSeasonPlanet({width: 480, height: () => 590});
assert.equal(planet.snapshot().cycleDuration, SEASON_CYCLE);
assert.equal(planet.snapshot().cacheSize, 0);
for (let quarter = 0; quarter < 4; quarter++) {
  planet.seek(quarter / 4);
  const state = planet.snapshot();
  assert.equal(state.season, phases[quarter]);
  near(state.phase, quarter / 4, 'Each quarter starts at the requested season');
  assert.equal(state.weights[quarter], 1);
}
planet.seek(1);
assert.equal(planet.snapshot().season, 'spring');
assert.equal(planet.snapshot().time, 0);
assert.equal(planet.snapshot().cacheSize, 0, 'Seeking seasons does not allocate canvases');

// A stationary viewer still experiences all seasons without answers or travel.
const stationary = createSeasonPlanet({cycleDuration: 40});
for (let quarter = 1; quarter <= 4; quarter++) {
  stationary.update(10);
  assert.equal(stationary.snapshot().season, phases[quarter % 4]);
  assert.equal(stationary.snapshot().travel, 0);
}
assert.equal(stationary.snapshot().time, 0, 'The calendar repeats automatically');
stationary.update(85);
near(stationary.snapshot().time, 5, 'Long updates preserve overflow across multiple years');

// Frame rate and camera displacement must not alter the seasonal calendar.
const single = createSeasonPlanet({cycleDuration: 80});
const partitioned = createSeasonPlanet({cycleDuration: 80});
single.update(137.5, {scroll: 275});
for (let frame = 0; frame < 550; frame++) partitioned.update(.25, {scroll: .5});
for (const field of ['time', 'phase', 'travel']) {
  near(partitioned.snapshot()[field], single.snapshot()[field], `Partition-invariant ${field}`);
}
assert.deepEqual(partitioned.snapshot().weights, single.snapshot().weights);
const reduced = createSeasonPlanet({cycleDuration: 80, reducedMotion: true});
reduced.update(137.5, {scroll: 275});
assert.deepEqual(reduced.snapshot(), single.snapshot(), 'Reduced motion changes animation, not calendar pacing');

// Bad frame timestamps cannot corrupt time or move the terrain.
for (const dt of [NaN, Infinity, -Infinity, -1]) {
  const before = planet.snapshot();
  planet.update(dt, {scroll: 12});
  assert.deepEqual(planet.snapshot(), before, `Invalid dt ${dt} does not mutate the world`);
}
planet.update(1, {scroll: 7});
for (const scroll of [NaN, Infinity, -Infinity]) planet.update(1, {scroll});
assert.equal(planet.snapshot().travel, 7, 'Invalid camera displacement is ignored');
assert.equal(planet.snapshot().time, 4, 'Valid clock time survives invalid camera displacement');
for (const phase of [NaN, Infinity, -Infinity]) {
  const before = planet.snapshot();
  planet.seek(phase);
  assert.deepEqual(planet.snapshot(), before, 'Invalid seek leaves the planet unchanged');
}
planet.seek(.75);
assert.equal(planet.snapshot().travel, 7, 'Previewing a season preserves the current landscape position');
planet.reset();
assert.equal(planet.snapshot().time, 0);
assert.equal(planet.snapshot().travel, 0);
assert.equal(planet.snapshot().season, 'spring');
assert.equal(planet.snapshot().cacheSize, 0);
assert.equal(single.snapshot().time, 57.5, 'Resetting one planet does not reset another');

// Every blend conserves opacity, including autumn/winter and the year boundary.
for (let sample = 0; sample <= 1600; sample++) {
  const state = seasonState(sample / 1600 * 40, 40);
  assert(state.phase >= 0 && state.phase < 1);
  assert.equal(state.weights.length, 4);
  assert(state.weights.every(weight => Number.isFinite(weight) && weight >= 0 && weight <= 1));
  near(state.weights.reduce((sum, weight) => sum + weight, 0), 1, 'Season weights conserve opacity');
}
for (const boundary of [10, 20, 30, 40]) {
  const before = seasonState(boundary - 1e-5, 40);
  const after = seasonState(boundary + 1e-5, 40);
  for (let season = 0; season < 4; season++) {
    near(before.weights[season], after.weights[season], `No visual jump at t=${boundary}`, 1e-7);
  }
}
for (const cycleDuration of [0, -1, NaN, Infinity]) {
  const fallback = createSeasonPlanet({cycleDuration});
  assert.equal(fallback.snapshot().cycleDuration, SEASON_CYCLE);
  assert.equal(seasonState(0, cycleDuration).cycleDuration, SEASON_CYCLE);
}
for (const time of [NaN, Infinity, -Infinity]) {
  assert.equal(seasonState(time).phase, 0, 'Invalid initial calendar time has a finite fallback');
}

console.log('Seasons passed: automatic cycle, continuous transitions, independent camera/instances, frame-rate consistency, reset, reduced motion, invalid inputs, browser-free state.');
