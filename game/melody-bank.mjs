import {IMPORTED_MELODIES} from './melodies-catalog.mjs';
import {CLASSICAL_MELODIES} from './classical-melodies.mjs';
import {ROCK_MELODIES} from './rock-melodies.mjs';
export const MELODY_BANK=[...IMPORTED_MELODIES.map(m=>({...m,genre:'jazz'})),...ROCK_MELODIES,...CLASSICAL_MELODIES];
export const GENRE_COUNTS=Object.fromEntries(['jazz','rock','classical'].map(g=>[g,MELODY_BANK.filter(m=>m.genre===g).length]));
