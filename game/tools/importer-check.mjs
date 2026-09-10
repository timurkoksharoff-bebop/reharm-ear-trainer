import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodeIRealBody,notePitch,parseImportedChart,parseIRealCollection,parseStoredChart,transposeRoute,absoluteChord} from '../importer.mjs';
import {chordNotes,chordSymbol,chordAnswerKey,progressionEvents} from '../music.mjs';
import {JAZZ_STANDARDS} from '../standards-catalog.mjs';
const html=raw=>`<a href="irealbook://Test=Me=Swing=C=n=${encodeURIComponent(raw)}">chart</a>`;
assert.equal(notePitch('Bb'),10);assert.equal(notePitch('F#'),6);
const sample=parseImportedChart(html('T44{C |F7 |N1D-7 |G7 }|N2C/E |C Z'),'a.html');
assert.deepEqual(sample.route.sequence.map(c=>c.absolute),['C','F7','Dm7','G7','C','F7','C/E','C']);
assert.equal(sample.route.sequence.at(-2).bassOffset,4);
assert.notEqual(chordAnswerKey(sample.route.sequence[0]),chordAnswerKey(sample.route.sequence.at(-2)),'Slash basses are different answers');
assert.equal(chordSymbol(sample.route.sequence.at(-2)),'I/III');
assert.equal(chordAnswerKey({...sample.route.sequence[0],bassOffset:0}),chordAnswerKey(sample.route.sequence[0]),'Explicit root bass sounds the same as default root bass');
const original=JSON.stringify(sample.route);
for(let key=0;key<12;key++){
  const route=transposeRoute(sample.route,key);
  for(let i=0;i<route.sequence.length;i++)assert.deepEqual(chordNotes(route.sequence[i],48+key),chordNotes(sample.route.sequence[i],48).map(note=>note+key));
  assert.equal(route.sequence.length,sample.route.sequence.length);
  assert(progressionEvents(route,route.sequence.length-1,true).events.length===route.sequence.length);
}
assert.equal(JSON.stringify(sample.route),original,'Transposition must not mutate source');
assert.equal(absoluteChord(sample.route.sequence.at(-2),2),'D/Gb');
assert.equal(parseImportedChart(html('[C |x |x Z]')).route.sequence.length,3);
for(const raw of ['[C |D7 S Q <D.S. al Coda>Z]','[C | r | Z]','[C |n |Z]','[Cmaj13#11 Z]','[C? Z]'])assert.equal(parseImportedChart(html(raw)).route,null,raw);
assert.throws(()=>parseImportedChart('<html>No chart</html>','no.html'));
assert.throws(()=>parseImportedChart('PK zipped data','file.mxl'));
const xml=`<score-partwise><work><work-title>Own tune</work-title></work><part id="p"><measure><attributes><key><fifths>0</fifths></key></attributes><harmony><root><root-step>C</root-step></root><kind text="m7">minor-seventh</kind></harmony></measure></part></score-partwise>`;
assert.equal(parseImportedChart(xml).route.sequence[0].quality,'m7');
assert.equal(parseImportedChart(xml.replace('</harmony>','<degree><degree-value>5</degree-value><degree-type>subtract</degree-type></degree></harmony>')).route,null);
assert.equal(decodeIRealBody('plain'),'plain');
assert.equal(JAZZ_STANDARDS.length,1460);
let ready=0;for(const record of JAZZ_STANDARDS){const chart=parseStoredChart(record);if(chart.route){ready++;for(const chord of chart.route.sequence){assert(chordNotes(chord,48+chart.route.key).every(Number.isFinite));assert(chordSymbol(chord));}}else assert(chart.warnings.length||chart.unsupported.length);}
const dir=process.argv[2];
if(dir){const a=parseImportedChart(fs.readFileSync(`${dir}/Autumn Leaves.html`,'utf8'),'Autumn Leaves.html'),b=parseImportedChart(fs.readFileSync(`${dir}/Autumn Leaves.musicxml`,'utf8'),'Autumn Leaves.musicxml');
  assert.equal(a.measures.length,32);assert.equal(a.route.sequence.length,34);assert.equal(a.key,'G-');assert.equal(b.key,'G-');
  const values=c=>c.route.sequence.map(x=>[x.offset,x.quality,x.bassOffset,x.intervals,x.measure]);assert.deepEqual(values(a),values(b));
  const all=parseIRealCollection(fs.readFileSync(`${dir}/Jazz 1460.html`,'utf8'));assert.equal(all.length,1460);
  console.log('User Autumn Leaves iReal and MusicXML agree: 32 measures, 34 chords, all tones and slash basses.');
}
console.log(`Importer checks passed: ${ready}/1460 playable charts, explicit diagnostics, 12-key transposition, slash answers and source preservation.`);
