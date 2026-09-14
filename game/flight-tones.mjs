// Letter spelling follows chord degrees, including altered fifths/extensions.
export function flightNotes(root,intervals,mode='all',quality=''){
  const letters=['C','D','E','F','G','A','B'],natural=[0,2,4,5,7,9,11];
  const rootIndex=letters.indexOf(root[0]);
  const rootPc=(natural[rootIndex]+(root.includes('♭')?-1:root.includes('♯')?1:0)+12)%12;
  const selected=mode==='basic'?intervals.slice(0,3):mode==='guide'?intervals.filter(n=>[3,4,5,10,11].includes(n)):intervals;
  return selected.map(n=>{
    const degree=n===0?0:n>=20?5:n>=17?3:n>=13?1:n>=10?6:n===9?(quality==='dim7'?6:5):n>=6?4:n===5?3:2;
    const index=(rootIndex+degree)%7,pc=(rootPc+n)%12;
    let alter=(pc-natural[index]+12)%12;if(alter>6)alter-=12;
    return letters[index]+(alter>0?'♯'.repeat(alter):'♭'.repeat(-alter));
  });
}
export function partialToneCredit(required,selected){
  const unique=[...new Set(selected)];
  return !required.length||unique.some(n=>!required.includes(n))?0:unique.length/required.length;
}
export function cubeFace(cube){
  if(!cube.rotating)return {label:cube.label,next:null,turn:0};
  const cycle=4.8,phase=cube.age%cycle,index=Math.floor(cube.age/cycle)%cube.faces.length;
  return {label:cube.faces[index],next:cube.faces[(index+1)%cube.faces.length],turn:Math.max(0,(phase-4.2)/.6)};
}
export function cubeLayout(required,distractors,width,height,rng=Math.random,player={x:width/2,y:height-40}){
  // Four fixed choices and one drum at most. Wide corridors stay open.
  const slots=[{x:width*.2,y:height*.33},{x:width*.8,y:height*.33},{x:width*.2,y:height*.62},{x:width*.8,y:height*.62},{x:width*.5,y:height*.46}];
  const labels=[...required];for(let i=labels.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[labels[i],labels[j]]=[labels[j],labels[i]];}
  const cubes=labels.map((label,i)=>({...slots[i],label,cube:true,rotating:false,color:'#f1bd67',age:0}));
  const faces=[distractors[0],distractors[1],required.at(-1)].filter(Boolean);
  cubes.push({...slots[4],label:faces[0],faces,cube:true,rotating:true,color:'#f1bd67',age:0});
  // Never materialize a newly replenished target on the ship.
  for(const cube of cubes)if(Math.hypot(cube.x-player.x,cube.y-player.y)<85)cube.y=Math.max(155,cube.y-110);
  return cubes;
}
