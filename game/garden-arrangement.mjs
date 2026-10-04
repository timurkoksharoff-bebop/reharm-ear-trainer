// Authored accompaniment patterns, not new textbook progressions. Every pitch
// comes from the current voicing (or an octave of it); slash bass stays intact.
export const GARDEN_ARRANGEMENTS=Object.freeze({
  arpWave:{track:'arpeggio',label:'Лотос волны',detail:'Вверх-вниз · восьмые',color:'#8ff3db',symbol:'↕',petals:6,steps:8},
  arpBroken:{track:'arpeggio',label:'Орхидея излома',detail:'Ломаное арпеджио · восьмые',color:'#c7b0ff',symbol:'⋈',petals:5,steps:8},
  arpSpark:{track:'arpeggio',label:'Искристый папоротник',detail:'Шестнадцатые',color:'#fff0a0',symbol:'✧',petals:8,steps:16},
  arpMist:{track:'arpeggio',label:'Звёздная россыпь',detail:'Тридцать вторые · тихое стекло',color:'#a3e7ff',symbol:'✺',petals:10,steps:32},
  bassCanon:{track:'bass',label:'Янтарный корень',detail:'Канон-пульс · спокойный бас',color:'#f6bf79',symbol:'∿',petals:3},
  bassChill:{track:'bass',label:'Лунная ягода',detail:'Chill · мягкая синкопа',color:'#9dc5ec',symbol:'≈',petals:4},
  bassFunk:{track:'bass',label:'Пружинящий ирис',detail:'Полуфанк · короткий бас',color:'#e7a2c9',symbol:'ϟ',petals:5}
});

export function createGardenArrangement(length){
  const bars=Math.max(2,Number(length)||2),tracks={arpeggio:null,bass:null};let current={};
  const snapshot=()=>Object.fromEntries(Object.entries(tracks).filter(([name,item])=>item&&(item.remaining>0||current[name])).map(([name,item])=>[name,{style:item.style,remaining:item.remaining,rounds:Math.ceil(item.remaining/bars),playing:current[name]===item.style}]));
  return {
    activate(style,rounds=1){const spec=GARDEN_ARRANGEMENTS[style];if(!spec)return false;const count=bars*Math.min(3,Math.max(1,Math.trunc(rounds)||1)),old=tracks[spec.track];tracks[spec.track]={style,remaining:Math.min(bars*3,(old?.style===style?old.remaining:0)+count)};return true;},
    boost(){let boosted=false;for(const [name,item] of Object.entries(tracks))if(item&&(item.remaining>0||current[name])){item.remaining=Math.min(bars*3,item.remaining+bars);boosted=true;}return boosted;},
    next(){current={};for(const [name,item] of Object.entries(tracks))if(item?.remaining>0){current[name]=item.style;item.remaining-=1;}return {...current};},
    current:()=>({...current}),snapshot,
    clear(track){if(!(track in tracks))return false;tracks[track]=null;delete current[track];return true;},
    reset(){tracks.arpeggio=tracks.bass=null;current={};}
  };
}

export function gardenArrangementEvents(notes,arrangement={},seconds=4){
  if(!Array.isArray(notes)||!notes.length||notes.some(note=>!Number.isFinite(note)))return [];
  const sorted=[...new Set(notes)].sort((a,b)=>a-b),lowest=sorted[0],upper=sorted.length>1?sorted.slice(1):sorted;
  const duration=Math.max(.4,Number(seconds)||4),events=[],arp=GARDEN_ARRANGEMENTS[arrangement.arpeggio],bass=GARDEN_ARRANGEMENTS[arrangement.bass];
  if(arp){
    const wave=upper.length<2?[0]:[...upper.map((_,i)=>i),...upper.slice(1,-1).map((_,i)=>upper.length-2-i)],broken=upper.map((_,i)=>(i%2?upper.length-1-Math.floor(i/2):Math.floor(i/2)));
    const order=arrangement.arpeggio==='arpBroken'?broken:wave;
    for(let i=0;i<arp.steps;i++){const midi=upper[order[i%order.length]];events.push({track:'arpeggio',midi,at:i*duration/arp.steps,duration:Math.min(.42,duration/arp.steps*.78),level:(arp.steps===32?.045:arp.steps===16?.075:.11)*(i%4===0?1:.8)});}
  }
  if(bass){
    // Do not substitute root for a slash-bass. A fifth is used only when it
    // really belongs to the supplied voicing; otherwise use its octave.
    const fifth=sorted.find(note=>((note-lowest)%12+12)%12===7),octave=lowest+12;
    const shape=arrangement.bass==='bassCanon'?[[0,lowest,.42],[.5,octave,.32]]:arrangement.bass==='bassChill'?[[0,lowest,.26],[.375,lowest,.14],[.75,fifth?lowest+7:octave,.20]]:[[0,lowest,.14],[.1875,lowest,.09],[.4375,octave,.12],[.625,fifth?lowest+7:octave,.11],[.875,lowest,.10]];
    for(const [phase,midi,gate] of shape)events.push({track:'bass',midi,at:phase*duration,duration:Math.min(duration*gate,1.4),level:arrangement.bass==='bassFunk'?.17:.14});
  }
  return events.sort((a,b)=>a.at-b.at);
}

export function drawGardenArrangementFlower(ctx,spec,size,rounds=1){
  const radius=size*.27;ctx.save();ctx.strokeStyle=spec.color;ctx.fillStyle=spec.color;ctx.lineWidth=1.2;
  for(let i=0;i<spec.petals;i++){ctx.save();ctx.rotate(i*Math.PI*2/spec.petals);ctx.globalAlpha=.74;ctx.beginPath();ctx.ellipse(radius*.6,0,radius*.75,radius*(spec.track==='bass'?.42:.22),.22,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.95;ctx.stroke();ctx.restore();}
  ctx.globalAlpha=1;ctx.fillStyle='#102c30';ctx.beginPath();ctx.arc(0,0,size*.13,0,Math.PI*2);ctx.fill();ctx.fillStyle=spec.color;ctx.font=`${size*.21}px Georgia`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(spec.symbol,0,0);
  for(let i=0;i<rounds;i++){ctx.globalAlpha=.45;ctx.beginPath();ctx.arc(0,0,size*(.35+i*.035),0,Math.PI*2);ctx.stroke();}
  ctx.globalAlpha=1;ctx.fillStyle='#102c30';ctx.beginPath();ctx.arc(size*.31,size*.29,size*.12,0,Math.PI*2);ctx.fill();ctx.fillStyle=spec.color;ctx.font=`bold ${size*.15}px sans-serif`;ctx.fillText(String(rounds),size*.31,size*.29);ctx.restore();
}
