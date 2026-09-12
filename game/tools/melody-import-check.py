"""Small symbolic fixtures test score timing without shipping source scores."""
import unittest
from xml.etree import ElementTree as ET
from import_melodies import parse_musicxml, parse_mscx

class ImportTiming(unittest.TestCase):
    def test_xml_voice_offsets_ties_and_tuplet_duration(self):
        root=ET.fromstring('''<score-partwise><work><work-title>Fixture</work-title></work><part>
        <measure><attributes><divisions>6</divisions></attributes>
          <note><pitch><step>C</step><octave>4</octave></pitch><duration>6</duration><voice>1</voice><tie type="start"/></note>
          <note><pitch><step>C</step><octave>4</octave></pitch><duration>3</duration><voice>1</voice><tie type="stop"/></note>
          <forward><duration>3</duration></forward>
          <note><pitch><step>D</step><alter>-1</alter><octave>4</octave></pitch><duration>2</duration><voice>1</voice></note>
          <backup><duration>14</duration></backup>
          <note><pitch><step>G</step><octave>2</octave></pitch><duration>14</duration><voice>2</voice></note>
        </measure></part></score-partwise>''')
        _,events,_=parse_musicxml(root)
        self.assertEqual(events,[[60,1.5],[None,.5],[61,.33333]])

    def test_mscx_full_measure_rest_pickup_tie_and_triplet(self):
        root=ET.fromstring('''<museScore><Score><metaTag name="workTitle">Fixture</metaTag><Staff>
          <Measure><voice><TimeSig><sigN>3</sigN><sigD>4</sigD></TimeSig><Rest><durationType>measure</durationType></Rest></voice></Measure>
          <Measure len="1/4"><voice><Rest><durationType>measure</durationType></Rest></voice></Measure>
          <Measure><voice>
          <Chord><durationType>quarter</durationType><Note><pitch>67</pitch><Spanner type="Tie"><next/></Spanner></Note></Chord>
          <Chord><durationType>eighth</durationType><Note><pitch>67</pitch><Spanner type="Tie"><prev/></Spanner></Note></Chord>
          <Tuplet><actualNotes>3</actualNotes><normalNotes>2</normalNotes></Tuplet>
          <Chord><durationType>eighth</durationType><Note><pitch>69</pitch></Note></Chord>
          <Chord><durationType>eighth</durationType><Note><pitch>70</pitch></Note></Chord>
          <Chord><durationType>eighth</durationType><Note><pitch>72</pitch></Note></Chord><endTuplet/>
          <Rest><durationType>eighth</durationType></Rest>
          </voice></Measure></Staff></Score></museScore>''')
        _,events,_=parse_mscx(root)
        self.assertEqual(events,[[None,3],[None,1],[67,1.5],[69,.33333],[70,.33333],[72,.33333],[None,.5]])

if __name__=='__main__':unittest.main()
