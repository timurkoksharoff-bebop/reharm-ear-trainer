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
  if(!required.length)return 0;
  const hits=unique.filter(n=>required.includes(n)).length,extra=unique.length-hits;
  return Math.max(0,Math.min(1,(hits-.4*extra)/required.length));
}
export function cubeFace(cube){
  if(!cube.rotating)return {label:cube.label,next:null,turn:0};
  const cycle=2.4,phase=cube.age%cycle,index=Math.floor(cube.age/cycle)%cube.faces.length;
  return {label:cube.faces[index],next:cube.faces[(index+1)%cube.faces.length],turn:Math.max(0,(phase-2)/.4)};
}
export function cubeLayout(required,distractors,width,height,rng=Math.random,player={x:width/2,y:height-40}){
  // Keep the current answer reachable, but use two faster drums when the
  // chord is dense enough.  This creates a changing choice without filling
  // the flight corridor with more than five objects.
  const slots=[{x:width*.2,y:height*.33},{x:width*.8,y:height*.33},{x:width*.2,y:height*.62},{x:width*.8,y:height*.62},{x:width*.5,y:height*.46}];
  const labels=[...required];for(let i=labels.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[labels[i],labels[j]]=[labels[j],labels[i]];}
  const fixed=labels.slice(0,3),changing=labels.slice(3);
  const cubes=fixed.map((label,i)=>({...slots[i],label,cube:true,rotating:false,color:'#f1bd67',age:0}));
  const faceSets=[
    [distractors[0],distractors[1],changing[0]??distractors[2]],
    [distractors[3],distractors[4],changing[1]??distractors[5]],
  ].map(faces=>[...new Set(faces.filter(Boolean))]).filter(faces=>faces.length);
  for(let i=0;i<faceSets.length;i++){const faces=faceSets[i];cubes.push({...slots[3+i],label:faces[0],faces,cube:true,rotating:true,color:'#f1bd67',age:i*1.2});}
  // Never materialize a newly replenished target on the ship.
  for(const cube of cubes)if(Math.hypot(cube.x-player.x,cube.y-player.y)<85)cube.y=Math.max(155,cube.y-110);
  return cubes;
}

export function numberCubeLayout(target,distractors,width,height,rng=Math.random,player={x:width/2,y:height-40}){
  // Interval capture keeps one unambiguous fixed answer. Two drums cycle only
  // through wrong labels, changing out of phase about every two seconds.
  const slots=[{x:width*.2,y:height*.33},{x:width*.8,y:height*.33},{x:width*.2,y:height*.62},{x:width*.8,y:height*.62},{x:width*.5,y:height*.46}];
  const wrong=[...new Set(distractors.filter(label=>label!==target))];
  for(let i=wrong.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[wrong[i],wrong[j]]=[wrong[j],wrong[i]];}
  const fixed=[target,...wrong.slice(0,2)];
  for(let i=fixed.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[fixed[i],fixed[j]]=[fixed[j],fixed[i]];}
  const cubes=fixed.map((label,i)=>({...slots[i],label,cube:true,rotating:false,color:'#f1bd67',age:0}));
  const faceSets=[wrong.slice(2,5),wrong.slice(5,8)].filter(faces=>faces.length);
  for(let i=0;i<faceSets.length;i++){const faces=faceSets[i];cubes.push({...slots[3+i],label:faces[0],faces,cube:true,rotating:true,color:'#f1bd67',age:i*1.2});}
  for(const cube of cubes)if(Math.hypot(cube.x-player.x,cube.y-player.y)<85)cube.y=Math.max(155,cube.y-110);
  return cubes;
}
