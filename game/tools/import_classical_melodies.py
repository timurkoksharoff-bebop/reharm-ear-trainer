#!/usr/bin/env python3
"""Curated classical themes from existing digital scores, never hand-entered pitches.
Piano reduction: selected melodic voice, highest note at simultaneous attacks.
DCML ties and exact score durations are read from their exported note tables.
"""
import csv,hashlib,io,json,math,re,zipfile
from fractions import Fraction
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]

def line_events(notes):
    # Preserve attacks and rests; collapse ties only when connected, same pitch.
    groups={}
    for at,pitch,duration,tie in notes:
        if duration<=0:continue
        if at not in groups or pitch>groups[at][0]:groups[at]=(pitch,duration,tie)
    seq=sorted(groups.items());events=[];cursor=seq[0][0] if seq else 0
    for i,(at,(pitch,duration,tie)) in enumerate(seq):
        if i+1<len(seq):duration=min(duration,seq[i+1][0]-at)
        if at>cursor+1e-6:events.append([None,at-cursor])
        if tie and events and events[-1][0]==pitch and abs(at-cursor)<1e-6:events[-1][1]+=duration
        else:events.append([pitch,duration])
        cursor=at+duration
    return events

def xml_line(data,voice='1'):
    z=zipfile.ZipFile(io.BytesIO(data));name=next(n for n in z.namelist() if n.endswith(('.xml','.musicxml')) and not n.startswith('META'))
    root=ET.fromstring(z.read(name));part=root.find('part');div=1;offset=0;notes=[];tempo=0
    for measure in part.findall('measure'):
        div=float(measure.findtext('attributes/divisions',str(div)));cursor=0;extent=0;last=0
        for el in measure:
            if el.tag in ['backup','forward']:
                cursor+=float(el.findtext('duration','0'))/div*(-1 if el.tag=='backup' else 1);extent=max(extent,cursor)
            elif el.tag=='direction' and not tempo:
                sound=el.find('sound')
                if sound is not None:tempo=float(sound.get('tempo','0'))
            elif el.tag=='note':
                if el.find('grace') is not None:continue
                d=float(el.findtext('duration','0'))/div
                at=last if el.find('chord') is not None else cursor
                if el.find('chord') is None:last=at;cursor+=d
                extent=max(extent,at+d)
                p=el.find('pitch')
                if p is not None and el.findtext('voice','1')==voice and el.findtext('staff','1')=='1':
                    midi=(int(p.findtext('octave'))+1)*12+{'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}[p.findtext('step')]+float(p.findtext('alter','0'))
                    notes.append((offset+at,int(midi),d,any(t.get('type')=='stop' for t in el.findall('tie'))))
        offset+=extent
    return line_events(notes),tempo

def package(title,events,raw,filename,source,license,tempo=100):
    assert len(events)>=12,title
    origin=next(p for p,d in events if p is not None);relative=[[None if p is None else p-origin,round(d,6)] for p,d in events]
    assert all(d>0 and math.isfinite(d) for p,d in relative)
    cursor=0;preview=0
    for i,(p,d) in enumerate(relative):
        cursor+=d;preview=i+1
        if cursor>=32:break
    return dict(id='classical-'+re.sub('[^a-z0-9]+','-',title.lower()).strip('-'),name=title,aliases=[title],genre='classical',events=relative,tempo=tempo or 100,preview=preview,firstMidi=origin,measures=round(sum(d for p,d in relative)/4),source=source,license=license,sourceFile=filename,sourceSha256=hashlib.sha256(raw).hexdigest(),form='written-melodic-voice',reduction='Selected score voice; highest simultaneous note; ties retained. Written form, repeats not expanded.')

# One edition per work; misleading "Chopin Spring Waltz" deliberately excluded.
PIANO=[
('Fur_Elise.mxl','Beethoven — Für Elise'),
('Ode_to_Joy_Easy_variation.mxl','Beethoven — Ode to Joy'),
('Swan_Lake.mxl','Tchaikovsky — Swan Lake'),
('Piano_Sonata_No._11_K._331_3rd_Movement_Rondo_alla_Turca.mxl','Mozart — Rondo alla Turca'),
('Canon_in_D.mxl','Pachelbel — Canon in D'),
('Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mxl','Chopin — Nocturne Op. 9 No. 2'),
('Erik_Satie_-_Gymnopedie_No.1.mxl','Satie — Gymnopédie No. 1','2'),
('Clair_de_Lune__Debussy.mxl','Debussy — Clair de lune'),
('Dance_of_the_sugar_plum_fairy.mxl','Tchaikovsky — Dance of the Sugar Plum Fairy'),
('Bach_Minuet_in_G_Major_BWV_Anh._114.mxl','Petzold — Minuet in G, BWV Anh. 114'),
('The_Entertainer_-_Scott_Joplin_-_1902.mxl','Joplin — The Entertainer'),
('Beethoven_Symphony_No._5_1st_movement_Piano_solo.mxl','Beethoven — Symphony No. 5, opening'),
('J._S._Bach_-_Air_on_the_G_String_Piano_arrangement.mxl','Bach — Air on the G String'),
('Hungarian_Dance_No_5_in_G_Minor.mxl','Brahms — Hungarian Dance No. 5'),
('Waltz_of_the_Flowers.mxl','Tchaikovsky — Waltz of the Flowers'),
('Ave_Maria_D839_-_Schubert_-_Solo_Piano_Arrg..mxl','Schubert — Ave Maria'),
('Schubert_Serenade_-_Standchen_-_By_Lizst.mxl','Schubert — Ständchen'),
('Sonate_No._8_Pathetique_2nd_Movement.mxl','Beethoven — Pathétique, Adagio cantabile'),
('Arabesque_L._66_No._1_in_E_Major.mxl','Debussy — Arabesque No. 1'),
('Gnossienne_No._1.mxl','Satie — Gnossienne No. 1'),
('Bach_Toccata_and_Fugue_in_D_Minor_Piano_solo.mxl','Bach — Toccata and Fugue in D minor'),
('Flight_of_the_Bumblebee.mxl','Rimsky-Korsakov — Flight of the Bumblebee'),
('Lacrimosa_-_Requiem.mxl','Mozart — Lacrimosa'),
('Liebestraum_No._3_in_A_Major.mxl','Liszt — Liebestraum No. 3'),
('La_Campanella_-_Grandes_Etudes_de_Paganini_No._3_-_Franz_Liszt.mxl','Liszt — La Campanella'),
('Chopin_-_Ballade_no._1_in_G_minor_Op._23.mxl','Chopin — Ballade No. 1'),
('Chopin_-_Nocturne_Op._9_No._1.mxl','Chopin — Nocturne Op. 9 No. 1'),
('Nocturne_in_C_sharp_Minor.mxl','Chopin — Nocturne in C-sharp minor, posthumous'),
('Waltz_in_A_MinorChopin.mxl','Chopin — Waltz in A minor, posthumous'),
('Waltz_Opus_64_No._2_in_C_Minor.mxl','Chopin — Waltz Op. 64 No. 2'),
('Prlude_No._4_in_E_Minor_Op._28_-_Frdric_Chopin.mxl','Chopin — Prelude Op. 28 No. 4'),
('Maple_Leaf_Rag_Scott_Joplin.mxl','Joplin — Maple Leaf Rag'),
('Passacaglia.mxl','Handel / Halvorsen — Passacaglia'),
('12_Variations_of_Twinkle_Twinkle_Little_Star.mxl','Mozart — Ah, vous dirai-je, maman'),
('Sonate_No._14_Moonlight_3rd_Movement.mxl','Beethoven — Moonlight Sonata, Presto agitato'),
]

def dcml(repo,select=None):
    z=zipfile.ZipFile('/tmp/smc-'+repo+'.zip');prefix=repo+'-main/';meta=list(csv.DictReader(io.StringIO(z.read(prefix+'metadata.tsv').decode()),delimiter='\t'));out=[]
    for m in meta:
        piece=m['piece']
        if select and piece not in select:continue
        filename=prefix+'notes/'+piece+'.notes.tsv';raw=z.read(filename);rows=csv.DictReader(io.StringIO(raw.decode()),delimiter='\t');notes=[]
        for r in rows:
            if r['staff']!='1' or r['voice']!='1' or r.get('gracenote'):continue
            pos=r.get('quarterbeats_all_endings') or r['quarterbeats']
            if not pos:continue
            notes.append((float(Fraction(pos)),int(r['midi']),float(r['duration_qb']),r.get('tied') in ['-1','0']))
        events=line_events(notes)
        name=m.get('movementTitle') or m.get('title_text') or m.get('workTitle') or piece
        composer={'tchaikovsky_seasons':'Tchaikovsky','schumann_kinderszenen':'Schumann','grieg_lyric_pieces':'Grieg','mozart_piano_sonatas':'Mozart','debussy_suite_bergamasque':'Debussy'}[repo]
        work= ('Piano Sonata '+piece.replace('-1','')+', I. ' if repo=='mozart_piano_sonatas' else '')
        title=composer+' — '+work+name.replace('\n',' ')+' · '+piece
        score=z.read(prefix+'MS3/'+piece+'.mscx');root=ET.fromstring(score);t=root.find('.//Tempo/tempo');tempo=float(t.text)*60 if t is not None else 100
        out.append(package(title,events,raw,filename,'DCMLab/'+repo,'CC BY-NC-SA 4.0',tempo))
    if select:out.sort(key=lambda x:select.index(Path(x['sourceFile']).name.replace('.notes.tsv','')))
    return out

def main():
    bank=[];z=zipfile.ZipFile('/tmp/smc-classical-library.zip')
    for filename,title,*voice in PIANO:
        raw=z.read('library-master/scores/'+filename);events,tempo=xml_line(raw,voice[0] if voice else '1');bank.append(package(title,events,raw,filename,'MuseTrainer public-domain score library','Public-domain score; repository source metadata',tempo))
    bank+=dcml('schumann_kinderszenen', ['n07','n01','n12','n08','n03','n04','n05','n06','n09','n10','n11','n13','n02'])
    bank+=dcml('tchaikovsky_seasons',['op37a06','op37a11','op37a10','op37a04','op37a12','op37a01','op37a02','op37a03','op37a05','op37a07','op37a08','op37a09'])
    grieg=['op12n01','op43n06','op65n06','op54n04','op43n01','op43n04','op54n03','op54n06','op57n06','op62n06','op68n03','op71n07','op38n01','op12n04','op12n05','op12n06','op12n07','op12n02','op38n06','op47n03','op47n06']
    bank+=dcml('grieg_lyric_pieces',grieg)
    # Mozart's sonata openings are independent works; no duplicate K.331 finale.
    moz=dcml('mozart_piano_sonatas');moz=[x for x in moz if re.search(r'[-_]1\.notes',x['sourceFile'])]
    bank+=moz
    deb=dcml('debussy_suite_bergamasque');bank+=[x for x in deb if 'clair' not in x['name'].lower()]
    print('Count',len(bank),'Mozart',len(moz));
    assert len(bank)>=100,(len(bank),[x['sourceFile'] for x in moz]);bank=bank[:100]
    assert len({m['id'] for m in bank})==100
    (ROOT/'classical-melodies.mjs').write_text('// Generated by tools/import_classical_melodies.py; data licenses in MELODY_CATALOG_SOURCES.md.\nexport const CLASSICAL_MELODIES='+json.dumps(bank,ensure_ascii=False,separators=(',',':'))+';\n')
    (ROOT/'CLASSICAL_100_SOURCES.json').write_text(json.dumps([{k:v for k,v in m.items() if k!='events'} for m in bank],ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
