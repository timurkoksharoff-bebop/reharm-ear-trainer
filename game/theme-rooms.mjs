// Artist and album rooms use only melodies that already carry source metadata
// in the main melody bank. A relation describes why a title belongs in a room;
// it is deliberately separate from authorship.
export const THEME_ROOMS=[
  {
    id:'beatles-yellow-submarine',
    artifactType:12,
    artist:'The Beatles',
    album:'Yellow Submarine',
    title:'YELLOW SUBMARINE · THE BEATLES ROOM',
    relatedByPilot:[2,3,4,6],
    targetMelodyIds:[
      'rock-hey-jude',
      'rock-yesterday',
      'rock-let-it-be',
      'rock-help',
      'rock-a-hard-days-night',
      'rock-norwegian-wood',
      'rock-eleanor-rigby',
      'rock-in-my-life',
      'rock-while-my-guitar-gently-weeps',
    ],
    relations:{
      'rock-hey-jude':'исполнитель The Beatles',
      'rock-yesterday':'исполнитель The Beatles',
      'rock-let-it-be':'исполнитель The Beatles',
      'rock-help':'исполнитель The Beatles',
      'rock-eleanor-rigby':'альбом Yellow Submarine · The Beatles',
      'rock-a-hard-days-night':'исполнитель The Beatles',
      'rock-norwegian-wood':'исполнитель The Beatles',
      'rock-in-my-life':'исполнитель The Beatles',
      'rock-while-my-guitar-gently-weeps':'исполнитель The Beatles',
    },
    distractorMelodyIds:[
      'rock-hotel-california',
      'rock-bohemian-rhapsody',
      'rock-smells-like-teen-spirit',
      'rock-satisfaction',
      'rock-house-of-the-rising-sun',
      'rock-light-my-fire',
      'rock-paint-it-black',
      'rock-sweet-child-o-mine',
    ],
    provenance:'Rock Corpus — de Clercq / Temperley · CC BY 4.0',
  },
];

export const themeRoomById=id=>THEME_ROOMS.find(room=>room.id===id)||null;
export const themeRoomForArtifact=artifactType=>THEME_ROOMS.find(room=>room.artifactType===artifactType)||null;
export const themeRelatedCount=(room,pilot)=>room.relatedByPilot?.[Math.max(0,Math.min(room.relatedByPilot.length-1,pilot))]||2;

export function themeMelodyIndices(room,melodies){
  const byId=new Map(melodies.map((melody,index)=>[melody.id,index]));
  const related=room.targetMelodyIds.map(id=>byId.get(id)).filter(Number.isInteger);
  const distractors=room.distractorMelodyIds.map(id=>byId.get(id)).filter(Number.isInteger);
  return {related:[...new Set(related)],distractors:[...new Set(distractors)]};
}

export function themeChallengeOptions(room,melodies,target,relatedCount=2,random=Math.random){
  const {related,distractors}=themeMelodyIndices(room,melodies);
  if(related.length<relatedCount||!related.includes(target))throw new Error(`Theme room ${room.id} has an incomplete related melody set`);
  const relatedOthers=related.filter(index=>index!==target),outside=distractors.filter(index=>!related.includes(index));
  for(const items of [relatedOthers,outside])for(let i=items.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
  const options=[target,...relatedOthers.slice(0,relatedCount-1),...outside.slice(0,6-relatedCount)];
  if(options.length!==6)throw new Error(`Theme room ${room.id} needs six distinct playable melodies`);
  for(let i=options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
  return options;
}
