import {IMPORTED_MELODIES} from './melodies-catalog.mjs';

// Editorial recognition order for flights. The full library remains available
// in Sound Lab; early pilots only hear the most familiar part of the catalog.
const STUDENT_TITLES=[
  'Autumn leaves','All the things you are','Summertime','Body and Soul','Caravan',
  'In a sentimental mood','On Green Dolphin Street','Blue moon','Blue Monk','Cherokee',
  'The Girl from Ipanema','Have You Met Miss Jones?','Softly, As In A Morning Sunrise','I Got Rhythm','On the Sunny Side of the Street',
  'Stardust','Georgia on my mind','Blue in green','All blues','Giant steps',
  'Desafinado','How insensitive','Days of Wine and Roses','Alice in wonderland','Angel eyes',
  'April in Paris','Bewitched','Bluesette','But Beautiful','Confirmation',
  'Cry me a river','Darn that dream','Easy to love','Emily','Everything Happens to Me',
  'Four','Goodbye Pork Pie Hat','Impressions','Invitation','It had to be you',
  'Just friends','Laura','Lover man',"Ain't Misbehavin'",'Bye Bye Blackbird',
  'Dream A Little Dream Of Me',"'S Wonderful!",'A Foggy Day','Someone to Watch Over Me','My Heart Stood Still',
];

const MASTER_EXTRA_TITLES=[
  '500 Miles High','Airegin','Anthropology','Avalon',"Bessie's blues",
  'Black and tan fantasy','Black narcissus','Black nile','Boplicity','Ceora',
  'Come sunday','Con Alma','Cottontail','Daahoud','Dindi',
  'Early autumn','Epistrophy','Exactly like you','Five brothers','Forest flower',
  'Four on six','Freedom jazz dance','Freight trane','Good bait','Got a match ?',
  'Groove merchant','Harlem nocturne','Hot house',"I can't get started",'I Hear a Rhapsody',
  'I remember you','In a mellow tone','In your own sweet way','Inner urge','Isfahan',
  'Jitterbug Waltz','Jordu','Joy spring','Killer Joe',"Li'l darlin'",
  'Line for lyons','Little sunflower','Lullaby of the leaves','Pick Yourself Up','West End Blues',
  'Blue Skies','Embraceable You','Fascinating Rhythm','Nice Work If You Can Get It',"They Can't Take That Away From Me",
];

const normalize=value=>String(value).toLowerCase().replace(/[’]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
const indexByTitle=new Map(IMPORTED_MELODIES.map((melody,index)=>[normalize(melody.name),index]));
const indexes=titles=>titles.map(title=>indexByTitle.get(normalize(title))).filter(Number.isInteger);

export const STUDENT_MELODY_INDICES=Object.freeze(indexes(STUDENT_TITLES));
export const NOVICE_MELODY_INDICES=Object.freeze(STUDENT_MELODY_INDICES.slice(0,24));
export const MASTER_MELODY_INDICES=Object.freeze([...STUDENT_MELODY_INDICES,...indexes(MASTER_EXTRA_TITLES)]);
export const LEGEND_MELODY_INDICES=Object.freeze(IMPORTED_MELODIES.map((_,index)=>index));
export const MELODY_LEVEL_COUNTS=Object.freeze([NOVICE_MELODY_INDICES.length,STUDENT_MELODY_INDICES.length,MASTER_MELODY_INDICES.length,LEGEND_MELODY_INDICES.length]);

export function melodyIndicesForLevel(level=0){
  return level<=0?NOVICE_MELODY_INDICES:level===1?STUDENT_MELODY_INDICES:level===2?MASTER_MELODY_INDICES:LEGEND_MELODY_INDICES;
}
