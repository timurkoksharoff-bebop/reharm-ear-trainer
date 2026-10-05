import {GARDEN_ARRANGEMENTS,drawGardenArrangementFlower} from './garden-arrangement.mjs';
const clamp=(value,min=0,max=100)=>Math.min(max,Math.max(min,value));
const modulo=(value,period)=>((value%period)+period)%period;

export const GARDEN_RESOURCES=Object.freeze({
  fuel:{label:'FUEL',color:'#e8b85d'},water:{label:'H₂O',color:'#75e9ed'},
  crew:{label:'CREW',color:'#9ee08a'},hull:{label:'HULL',color:'#d8c4f5'}
});

export const GARDEN_ITEMS=Object.freeze({
  restoration:{resource:'all',amount:100,restoration:true,sprite:null,label:'Колесо жизни · все запасы восстановлены',color:'#b8eee0',size:92,rare:true},
  shield:{resource:'inventory',amount:1,shield:true,sprite:'cocoon-shield',label:'Кокон · защита от трёх ударов камней',color:'#cbded8',size:70,artifact:true,rare:true},
  ...Object.fromEntries(Object.entries(GARDEN_ARRANGEMENTS).map(([kind,spec])=>[kind,{...spec,resource:'arrangement',sprite:null,size:80,arrangement:true,label:spec.label}])),
  arrangementBoost:{resource:'inventory',amount:1,assist:{answerKind:'degree',divisor:4,rounds:1},sprite:'hold-arpeggio-flower',visualFilter:'hue-rotate(72deg) saturate(.75) brightness(1.04)',label:'Аметист баса · оставить четверть вариантов · круг',color:'#a87aff',size:66,artifact:true,rare:true},
  fuel:{resource:'fuel',amount:10,sprite:'fuel-seed',label:'Энергетическое семя',color:'#e9b95e',size:68},
  water:{resource:'water',amount:9,sprite:'water-pearl',label:'Водяная жемчужина',color:'#75f4ef',size:62},
  crew:{resource:'crew',amount:8,sprite:'crew-berries',label:'Спелые ягоды',color:'#a7ec86',size:70},
  hull:{resource:'hull',amount:11,sprite:'repair-lotus',label:'Смола лотоса',color:'#dcc9ff',size:72},
  poison:{resource:'crew',amount:-8,hullAmount:-3,sprite:'poison-seed',label:'Ядовитое семя',color:'#ff716c',size:68,harmful:true},
  degreeReveal:{resource:'inventory',amount:1,assist:{answerKind:'degree',reveal:true},sprite:'arpeggio-flower',label:'Лунный цветок · открыть ступень текущей позиции',color:'#a9b6ec',size:72,artifact:true,rare:true},
  hold:{resource:'inventory',amount:1,repeat:true,sprite:'hold-flower',label:'Лотос бесконечности · удержать аккорд',color:'#b7ef86',size:33,artifact:true},
  qualityFocus:{resource:'inventory',amount:1,assist:{answerKind:'quality',divisor:2,steps:5},sprite:'root-flower',visualFilter:'saturate(.55) brightness(.94)',label:'Жемчужный бутон · половина вариантов аккорда · 5 ходов',color:'#d9c4a2',size:66,artifact:true,rare:true},
  holdArpeggio:{resource:'inventory',amount:1,assist:{answerKind:'degree',divisor:2,steps:3},sprite:'hold-arpeggio-flower',visualFilter:'hue-rotate(54deg) saturate(.50) brightness(.94)',label:'Сиреневая лоза · половина вариантов баса · 3 хода',color:'#d1b9ee',size:66,artifact:true,rare:true},
  midpoint:{resource:'inventory',amount:1,assist:{answerKind:'quality',divisor:4,rounds:1},sprite:'root-flower',visualFilter:'saturate(.84) brightness(1.03)',label:'Янтарный бутон · оставить четверть вариантов аккорда · круг',color:'#d9ad72',size:66,artifact:true,rare:true},
  focusRare:{resource:'inventory',amount:1,assist:{answerKind:'quality',divisor:4,rounds:2},sprite:'root-flower',visualFilter:'saturate(.94) brightness(1.10)',label:'Солнечный бутон · четверть вариантов аккорда · 2 круга',color:'#ecc285',size:68,artifact:true,rare:true},
  ...Object.fromEntries([-7,-5,-3,3,5,7].map(delta=>[`jump${delta<0?'Back':'Forward'}${Math.abs(delta)}`,{resource:'inventory',amount:2,navigationDelta:delta,sprite:null,label:`Прыжок ${delta>0?'+':'−'}${Math.abs(delta)} · два заряда`,color:'#abe5d4',size:48,artifact:true}])),
  crater:{resource:'hull',amount:-6,sprite:'crater',label:'Удар о кратер',color:'#ff7b5f',size:126,harmful:true,ground:true,damage:6},
  stoneAsteroid:{resource:'hull',amount:-5,sprite:'meteor-volcanic',label:'Каменный астероид',color:'#a8a595',size:70,harmful:true,asteroid:true,damage:5},
  porousAsteroid:{resource:'hull',amount:-3,sprite:'crater',label:'Пористый астероид',color:'#7b8d83',size:52,harmful:true,asteroid:true,damage:3},
  crystalAsteroid:{resource:'hull',amount:-8,sprite:'crater',label:'Кристаллический астероид',color:'#a997e8',size:82,harmful:true,asteroid:true,damage:8},
  lavaAsteroid:{resource:'hull',amount:-100,sprite:'meteor-volcanic',label:'Раскалённое лавовое ядро',color:'#ff5c25',size:94,harmful:true,asteroid:true,fatal:true},
  campSpore:{resource:'crew',amount:-1,waterAmount:-1,sprite:null,label:'Споры застоя',color:'#d49aff',size:92,harmful:true,pressure:true},
  storm:{resource:'hull',amount:-2,crewAmount:-1,sprite:null,label:'Ядро смерча',color:'#8fe7dd',size:164,harmful:true,storm:true}
});

// Shared botanical diagram in the sky, inventory and guide. A branching sprig
// marks bass choices; a radial corolla marks chord choices. Veins and nodes
// distinguish strength without covering the landscape with lettering.
export function drawGardenLifeWheel(ctx,size,time,phase=0){
  const alpha=ctx.globalAlpha,pulse=.86+.14*Math.sin(time*1.8),colors=['#b6eae3','#c3b4ef','#e9d6a4','#a6dcbe'];
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=Math.max(.65,size*.0075);
  const orbit=(radius,count,speed,color,shape)=>{
    ctx.save();ctx.rotate(time*speed+phase);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.globalAlpha=alpha*pulse*.72;
    ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<count;i++){
      const a=i*Math.PI*2/count;ctx.save();ctx.rotate(a);
      if(shape==='bead'){ctx.globalAlpha=alpha*(.55+.32*Math.sin(time*1.4+i*.5)**2);ctx.beginPath();ctx.arc(radius,0,size*.012,0,Math.PI*2);ctx.stroke();}
      else if(shape==='tick'){ctx.beginPath();ctx.moveTo(radius-size*.015,0);ctx.lineTo(radius+size*.019,0);ctx.stroke();}
      else{ctx.beginPath();ctx.moveTo(radius-size*.05,0);ctx.bezierCurveTo(radius-size*.014,-size*.025,radius+size*.015,-size*.028,radius+size*.043,0);ctx.bezierCurveTo(radius+size*.014,size*.025,radius-size*.025,size*.024,radius-size*.05,0);ctx.stroke();}
      ctx.restore();
    }
    ctx.restore();
  };
  // Independently rotating circular linework, not one rotating painted disc.
  orbit(size*.46,36,.16,colors[0],'tick');
  orbit(size*.38,24,-.23,colors[1],'bead');
  orbit(size*.29,12,.32,colors[2],'leaf');
  orbit(size*.19,24,-.43,colors[0],'tick');
  orbit(size*.10,12,.53,colors[3],'bead');
  ctx.rotate(-time*.11+phase);ctx.strokeStyle=colors[2];ctx.globalAlpha=alpha*.38;ctx.lineWidth=Math.max(.6,size*.006);
  ctx.beginPath();for(let i=0;i<=96;i++){const a=i*Math.PI*2/96,r=size*(.425+Math.sin(a*12)*.012),x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  for(let lamp=0;lamp<4;lamp++){ctx.fillStyle=Object.values(GARDEN_RESOURCES)[lamp].color;ctx.globalAlpha=alpha*(.58+.25*Math.sin(time*2-lamp)**2);const a=lamp*Math.PI/2+time*.24;ctx.beginPath();ctx.arc(Math.cos(a)*size*.048,Math.sin(a)*size*.048,size*.014,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}
export function drawGardenAssistGlyph(ctx,item,size){
  const bass=item.assist.answerKind==='degree',strong=item.assist.divisor===4,alpha=ctx.globalAlpha;
  ctx.save();ctx.strokeStyle=item.color;ctx.fillStyle=item.color;ctx.shadowColor=item.color;ctx.shadowBlur=Math.min(2,size*.025);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=Math.max(.65,size*.012);ctx.globalAlpha=alpha*(strong?.64:.48);
  const leaf=(x,y,angle,length,width)=>{
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-width,-length*.23,-width*.92,-length*.74,0,-length);ctx.bezierCurveTo(width*.92,-length*.74,width,-length*.23,0,0);ctx.stroke();
    ctx.globalAlpha*=.58;ctx.lineWidth*=.72;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(width*.07,-length*.5,0,-length);
    for(let vein=1;vein<=3;vein++){const t=vein/4,vy=-length*t,vw=width*Math.sin(t*Math.PI)*.78;ctx.moveTo(0,vy);ctx.quadraticCurveTo(-vw*.55,vy-length*.055,-vw,vy-length*.14);ctx.moveTo(0,vy);ctx.quadraticCurveTo(vw*.55,vy-length*.055,vw,vy-length*.14);}
    ctx.stroke();ctx.restore();
  };
  if(bass){
    ctx.beginPath();ctx.moveTo(0,size*.32);ctx.bezierCurveTo(-size*.04,size*.08,size*.035,-size*.12,0,-size*.32);ctx.stroke();
    leaf(0,-size*.09,0,size*.31,size*.1);
    for(const side of [-1,1]){leaf(0,size*.13,side*.86,size*.32,size*.078);leaf(0,-size*.02,side*.65,size*.29,size*.071);if(strong)leaf(0,size*.23,side*1.12,size*.24,size*.058);}
    ctx.globalAlpha=alpha*.23;ctx.beginPath();ctx.moveTo(0,size*.31);ctx.quadraticCurveTo(-size*.09,size*.34,-size*.13,size*.39);ctx.moveTo(0,size*.31);ctx.quadraticCurveTo(size*.07,size*.34,size*.12,size*.38);ctx.stroke();
  }else{
    for(let petal=0;petal<6;petal++)leaf(0,0,petal*Math.PI/3,size*.39,size*.075);
    if(strong)for(let petal=0;petal<6;petal++)leaf(0,0,petal*Math.PI/3+Math.PI/6,size*.25,size*.046);
    ctx.beginPath();ctx.arc(0,0,size*.045,0,Math.PI*2);ctx.stroke();
  }
  ctx.shadowBlur=0;ctx.globalAlpha=alpha*(strong?.7:.52);
  const nodes=strong?2:1;for(let node=0;node<nodes;node++){ctx.beginPath();ctx.arc((node-(nodes-1)/2)*size*.1,size*.43,Math.max(.85,size*.018),0,Math.PI*2);ctx.fill();}
  if(item.assist.rounds===2){ctx.globalAlpha=alpha*.31;ctx.lineWidth=Math.max(.6,size*.009);for(const side of [-1,1]){ctx.beginPath();ctx.arc(0,0,size*.46,side<0?Math.PI*.64:Math.PI*1.64,side<0?Math.PI*1.36:Math.PI*2.36);ctx.stroke();}}
  ctx.restore();
}

const weightedItem=(resources,random)=>{
  const entries=Object.entries(GARDEN_ITEMS).filter(([,item])=>!item.ground&&!item.storm&&!item.asteroid&&!item.pressure&&!item.arrangement&&!item.rare).map(([kind,item])=>{
    const value=resources[item.resource]??100,need=item.navigationDelta?.11:item.artifact?.22:item.harmful?.3:1+Math.max(0,76-value)/15+(value<30?4:0);
    return {kind,weight:need};
  });
  let cursor=random()*entries.reduce((sum,item)=>sum+item.weight,0);
  return entries.find(item=>(cursor-=item.weight)<=0)?.kind??'water';
};

const announce=(owner,entity)=>{
  const item=entity.item;
  owner.event={id:++owner.eventCounter,kind:entity.kind,label:item.arrangement?`${item.label} · ${entity.rounds} кр.`:item.label,harmful:Boolean(item.harmful),resource:item.artifact?'artifact':item.resource};
  owner.eventAge=0;owner.effects.push({x:entity.x,y:entity.y,age:0,color:item.color,harmful:Boolean(item.harmful)});
};

export class GardenLife{
  constructor({random=Math.random,onArrangement}={}){
    this.random=random;this.onArrangement=onArrangement;this.images={};this.reset();
    this.ambient=Array.from({length:22},(_,index)=>({x:random(),y:random(),phase:random()*Math.PI*2,size:3+random()*8,speed:.012+random()*.026,spin:(random()-.5)*.42,tint:index%4}));
  }
  reset(){
    this.restorationAppeared=false;this.restorationRescueChecked=false;
    this.shieldHits=0;this.shieldFlash=0;this.shieldFade=0;
    this.time=0;this.spawnClock=1.4;this.craterClock=3.4;this.asteroidClock=6.5;this.stormClock=8.5;this.gameOver=false;
    this.arrangementClock=5;this.arrangementOrder=0;this.assistClock=30+this.random()*25;
    this.entities=[];this.effects=[];this.chips=[];this.event=null;this.eventAge=99;this.eventCounter=0;this.flightForce={x:0,y:0,intensity:0};this.impact=0;
    this.campIdle=0;this.campPressure=null;this.lastShip=null;this.critical=null;this.failureResource=null;
    this.resources={fuel:86,water:78,crew:92,hull:84};this.inventory=Object.fromEntries(Object.entries(GARDEN_ITEMS).filter(([,item])=>item.artifact).map(([kind])=>[kind,0]));
  }
  setImages(images){this.images={...images};}
  setResource(name,value){if(name in this.resources)this.resources[name]=clamp(value);}
  wrongAnswer(kind,value,qualityOrder=[]){
    if(this.gameOver)return;
    const resource=kind==='degree'?(Number(value)<6?'fuel':'water'):(qualityOrder.indexOf(value)%2===0?'crew':'hull');
    this.resources[resource]=Math.max(this.difficulty?.minResource||0,clamp(this.resources[resource]-(this.difficulty?.wrongDamage??3)));
    announce(this,{kind:'wrongAnswer',item:{resource,label:`Ошибка · ${GARDEN_RESOURCES[resource].label} −3`,harmful:true,color:GARDEN_RESOURCES[resource].color},x:.5,y:.55});
    this.updateCritical(0);
  }
  getFlightForce(){return {...this.flightForce};}
  consumeArtifact(kind){if(!(kind in this.inventory)||this.inventory[kind]<1)return false;this.inventory[kind]-=1;return true;}
  useShield(mission,kind='shield'){
    const state=mission.snapshot();
    if(!GARDEN_ITEMS[kind]?.shield||!state.running||state.complete||state.cursor<0||this.shieldHits>0||!this.consumeArtifact(kind))return {ignored:true};
    this.shieldHits=3;this.shieldFlash=.15;this.shieldFade=1;
    announce(this,{kind:'shield',item:{resource:'artifact',label:'Кокон раскрыт',color:GARDEN_ITEMS.shield.color},x:.5,y:.56});
    return {shield:true,hits:3};
  }
  useJump(mission,kind){
    const delta=GARDEN_ITEMS[kind]?.navigationDelta;
    if(!Number.isInteger(delta))return {ignored:true};
    return mission.shift(delta,{consume:()=>this.consumeArtifact(kind)});
  }
  useAssist(mission,kind){const spec=GARDEN_ITEMS[kind]?.assist;if(!spec)return {ignored:true};return mission.assist(spec,{consume:()=>this.consumeArtifact(kind)});}
  useRepeat(mission,kind='hold'){
    const state=mission.snapshot();
    if(!GARDEN_ITEMS[kind]?.repeat||!state.running||state.complete||state.cursor<0)return {ignored:true};
    if(state.held){mission.continue();return {held:false};}
    if(!this.consumeArtifact(kind))return {ignored:true};
    return mission.hold();
  }
  forceSpawn(kind='water',overrides={}){
    const item=GARDEN_ITEMS[kind]??GARDEN_ITEMS.water,edge=!item.ground&&!item.storm&&this.random()<.28,fromLeft=this.random()<.5;
    const entity={id:`${kind}-${this.time.toFixed(3)}-${this.random().toFixed(6)}`,kind,item,
      x:item.storm?(fromLeft?-.13:1.13):item.ground?.18+this.random()*.64:edge?(this.random()<.5?-.08:1.08):.17+this.random()*.66,
      y:item.storm?.2+this.random()*.3:item.ground?-.12:edge?.16+this.random()*.32:-.10,
      vx:item.storm?(fromLeft?.055+this.random()*.025:-.055-this.random()*.025):item.ground?0:edge?(this.random()<.5?.065:-.065):(this.random()-.5)*.025,
      vy:item.ground?.05+this.random()*.018:item.storm?.01:.052+this.random()*.036,angle:this.random()*Math.PI*2,
      spin:item.storm?(fromLeft?1:-1)*(.42+this.random()*.28):(this.random()-.5)*(item.artifact?1.2:item.harmful?.8:.42),phase:this.random()*Math.PI*2,
      age:0,rounds:item.arrangement?1+Math.floor(this.random()*3):0,scale:item.ground?.78+this.random()*.34:item.storm?.82+this.random()*.28:.82+this.random()*.3,
      collected:false,triggered:false,impactArmed:true,lastDamage:-999,baseY:item.storm?.2+this.random()*.3:0,...overrides};
    if(item.fatal){entity.x=Math.max(.18,Math.min(.82,entity.x));entity.vx=0;}
    if(item.asteroid&&!item.fatal){const resource=overrides.damageResource??['fuel','water','crew','hull'][Math.floor(this.random()*4)];entity.item={...item,resource,color:GARDEN_RESOURCES[resource].color,label:`${item.label} · ${GARDEN_RESOURCES[resource].label}`,damageResource:resource};}
    if(item.storm&&overrides.y!==undefined)entity.baseY=overrides.y;
    if(!item.ground&&!item.storm)for(let attempt=0;attempt<8;attempt++){
      const crowded=this.entities.some(other=>!other.item.ground&&!other.item.storm&&Math.hypot(other.x-entity.x,other.y-entity.y)<.16);
      if(!crowded)break;entity.x=.17+this.random()*.66;entity.y=-.08-this.random()*.1;
    }
    if(this.difficulty?.minResource&&(item.navigationDelta||item.fatal||item.storm||item.assist)){entity.collected=true;return entity;}
    this.entities.push(entity);return entity;
  }
  applyDamage(entity,{repeat=false}={}){
    if(!entity||entity.collected||(!repeat&&entity.triggered))return false;
    entity.triggered=true;entity.lastDamage=this.time;const item=entity.item;
    this.resources[item.resource]=clamp(this.resources[item.resource]+item.amount);
    if(item.hullAmount)this.resources.hull=clamp(this.resources.hull+item.hullAmount);
    if(item.crewAmount)this.resources.crew=clamp(this.resources.crew+item.crewAmount);
    announce(this,entity);return true;
  }
  collect(entity){
    if(!entity||entity.collected)return false;
    if(entity.item.restoration&&this.gameOver)return false;
    if(entity.item.ground||entity.item.storm)return this.applyDamage(entity,{repeat:entity.item.storm});
    entity.collected=true;const item=entity.item;
    if(item.fatal)this.gameOver=true;
    if(item.restoration){for(const resource of Object.keys(this.resources))this.resources[resource]=100;this.critical=null;this.failureResource=null;}
    else if(item.arrangement)this.onArrangement?.(entity.kind,entity.rounds);
    else if(item.artifact)this.inventory[entity.kind]=Math.min(99,(this.inventory[entity.kind]||0)+item.amount);
    else{this.resources[item.resource]=clamp(this.resources[item.resource]+item.amount);if(item.hullAmount)this.resources.hull=clamp(this.resources.hull+item.hullAmount);}
    announce(this,entity);return true;
  }
  asteroidImpact(entity,view,w,h){
    if(!entity||!entity.impactArmed||this.time-entity.lastDamage<2.5)return false;
    const sx=Number(view.x)||w*.5,sy=Number(view.y)||h*.56,dx=entity.x*w-sx,dy=entity.y*h-sy,distance=Math.hypot(dx,dy)||1,item=entity.item;
    entity.triggered=true;entity.impactArmed=false;entity.lastDamage=this.time;
    const protectedHit=!item.fatal&&this.shieldHits>0;
    if(protectedHit){this.shieldHits-=1;this.shieldFlash=1;}
    if(item.fatal){this.resources.hull=0;this.gameOver=true;this.failureResource='lava';}
    else if(!protectedHit){
      const damage=(item.damage??Math.abs(item.amount||8))*1.15,resource=item.damageResource??'hull';
      this.resources[resource]=clamp(this.resources[resource]-damage);
      for(const secondary of ['crew','fuel'])if(secondary!==resource)this.resources[secondary]=clamp(this.resources[secondary]-Math.max(1,(item.damage??8)*(secondary==='crew'?.12:.08))*1.15);
    }
    const severity=item.fatal?1:clamp((item.damage??8)/28,.24,.9),awayX=-dx/distance,awayY=-dy/distance;
    this.flightForce.x+=awayX*(.34+severity*.38);this.flightForce.y+=awayY*(.28+severity*.32);this.flightForce.intensity=Math.max(this.flightForce.intensity,severity);
    entity.vx-=awayX*(.08+severity*.06);entity.vy-=awayY*(.06+severity*.05);entity.spin+=(this.random()-.5)*(2.2+severity*3);
    this.impact=Math.max(this.impact,Math.max(.68,severity));
    for(let i=0;i<8+Math.round(severity*10);i++){const angle=Math.PI*2*this.random();this.chips.push({x:entity.x,y:entity.y,vx:Math.cos(angle)*(.035+this.random()*.09),vy:Math.sin(angle)*(.035+this.random()*.09),age:0,life:.42+this.random()*.58,size:1+this.random()*3,color:item.color});}
    announce(this,protectedHit?{...entity,item:{...item,resource:'artifact',label:'Кокон погасил удар',harmful:false,color:'#cbded8'}}:entity);return true;
  }
  updateCampPressure(dt,view,w,h,sx,sy){
    const current={x:sx/w,y:sy/h},moving=this.lastShip&&Math.hypot(current.x-this.lastShip.x,current.y-this.lastShip.y)>.0035;
    this.lastShip=current;
    if(!view.active||!view.answering||view.ship===2){this.campIdle=0;this.campPressure=null;return;}
    if(moving)this.campIdle=Math.max(0,this.campIdle-dt*5);else this.campIdle+=dt*(current.x<.16||current.x>.84||current.y<.24||current.y>.76?1.55:1);
    if(!this.campPressure&&this.campIdle>15)this.campPressure={x:current.x,y:current.y,age:0,lastDamage:-99};
    const pressure=this.campPressure;if(!pressure)return;
    pressure.age+=dt;const distance=Math.hypot((current.x-pressure.x)*w,(current.y-pressure.y)*h);
    if(distance>78){this.campPressure=null;this.campIdle=0;return;}
    if(pressure.age>3&&this.time-pressure.lastDamage>7){pressure.lastDamage=this.time;const item=GARDEN_ITEMS.campSpore;this.resources.crew=clamp(this.resources.crew+item.amount);this.resources.water=clamp(this.resources.water+item.waterAmount);announce(this,{kind:'campSpore',item,x:pressure.x,y:pressure.y});}
  }
  updateCritical(dt){
    const empty=Object.keys(this.resources).find(name=>this.resources[name]<=0);
    if(!empty){this.critical=null;return;}
    if(!this.critical||this.critical.resource!==empty)this.critical={resource:empty,age:0};else this.critical.age+=dt;
    if(this.critical.age>=3.5){this.gameOver=true;this.failureResource=empty;}
  }
  maybeSpawnRestoration(dt,view){
    if(this.restorationAppeared||this.gameOver||!view.active||!view.answering||this.time<12)return null;
    const finishing=Number.isInteger(view.remainingChords)&&view.remainingChords>0&&view.remainingChords<=3;
    const critical=Math.min(...Object.values(this.resources))<=18;
    let spawn=false;
    if(finishing&&critical&&!this.restorationRescueChecked){
      // One rescue lottery per flight, not a fresh chance on every frame.
      this.restorationRescueChecked=true;spawn=this.random()<.35;
    }else if(this.time>60)spawn=this.random()<1-Math.exp(-dt/1200);
    if(!spawn)return null;
    this.restorationAppeared=true;
    const x=clamp((Number(view.x)||view.width*.5)/Math.max(1,view.width)+.12,.18,.82);
    const y=finishing&&critical?clamp((Number(view.y)||view.height*.56)/Math.max(1,view.height)-.17,.12,.64):-.08;
    const entity=this.forceSpawn('restoration',{x,y,vx:0,vy:.055,scale:1,spin:.18});
    // Keep the rescue reachable; crowd avoidance must not move it off-screen.
    entity.x=x;entity.y=y;return entity;
  }
  update(dt,view={}){
    if(dt&&!view.paused&&view.active!==false&&view.flying!==false&&!this.gameOver){this.shieldFlash=Math.max(0,this.shieldFlash-dt*1.6);this.shieldFade=clamp(this.shieldFade+(this.shieldHits>0?dt*2:-dt*1.8),0,1);}
    this.flightForce={x:0,y:0,intensity:0};if(!dt||view.paused||view.active===false||view.flying===false||this.gameOver)return;
    this.impact=Math.max(0,this.impact-dt*2.8);
    this.time+=dt;this.eventAge+=dt;const speed=Number(view.speed)||0,profile=this.difficulty||{drain:1,spawnRate:1,minResource:0};
    this.maybeSpawnRestoration(dt,view);
    for(const resource of ['fuel','water','crew','hull'])this.resources[resource]=Math.max(profile.minResource,clamp(this.resources[resource]-dt*({fuel:.32,water:.22,crew:.14,hull:.1}[resource])*profile.drain));
    dt*=profile.spawnRate;
    if(view.active){this.resources.fuel=clamp(this.resources.fuel-dt*(.06+speed*.04));this.resources.water=clamp(this.resources.water-dt*(.03+speed*.01));this.resources.crew=clamp(this.resources.crew-dt*(.008+Math.max(0,18-this.resources.water)*.002));if(this.resources.fuel<6)this.resources.hull=clamp(this.resources.hull-dt*(6-this.resources.fuel)*.01);}
    this.spawnClock-=dt;this.craterClock-=dt;this.asteroidClock-=dt;this.stormClock-=dt;this.assistClock-=dt;
    if(view.active)this.arrangementClock-=dt;
    const pickupCount=this.entities.filter(entity=>!entity.item.ground&&!entity.item.storm&&!entity.item.asteroid).length;
    if(this.assistClock<=0&&pickupCount<6){
      const roll=this.random(),kinds=Object.keys(GARDEN_ITEMS).filter(kind=>GARDEN_ITEMS[kind].assist&&!GARDEN_ITEMS[kind].assist.reveal&&kind!=='focusRare');
      const kind=roll<.03?'focusRare':roll<.1?'shield':roll<.28&&view.routeLength>=8?'degreeReveal':kinds[Math.floor(this.random()*kinds.length)];
      const x=.22+this.random()*.56,y=-.10;
      this.forceSpawn(this.random()<.28?'lavaAsteroid':'stoneAsteroid',{x:x-.075,y:y+.03,scale:.6,vy:.085,vx:0});
      const pickup=this.forceSpawn(kind,{x:x+.075,y:y-.055,scale:.78,vy:.085,vx:0});pickup.x=x+.075;pickup.y=y-.055;
      this.assistClock=40+this.random()*35;
    }
    if(this.arrangementClock<=0&&pickupCount<6){const styles=Object.keys(GARDEN_ARRANGEMENTS),kind=styles[this.arrangementOrder++%styles.length];this.forceSpawn(kind);this.arrangementClock=12+this.random()*8;}
    if(this.spawnClock<=0&&pickupCount<6){this.forceSpawn(weightedItem(this.resources,this.random));this.spawnClock=4.7+this.random()*3.8;}
    if(this.craterClock<=0&&this.entities.filter(entity=>entity.item.ground).length<2){this.forceSpawn('crater');this.craterClock=16+this.random()*10;}
    if(this.asteroidClock<=0&&this.entities.filter(entity=>entity.item.asteroid).length<2){const roll=this.random(),kind=roll<.09?'lavaAsteroid':roll<.30?'crystalAsteroid':roll<.62?'porousAsteroid':'stoneAsteroid';this.forceSpawn(kind,{scale:kind==='lavaAsteroid'?.45+this.random()*.22:.58+this.random()*1.25,shapeSeed:this.random()});this.asteroidClock=11+this.random()*9;}
    if(this.stormClock<=0&&!this.entities.some(entity=>entity.item.storm)){this.forceSpawn('storm');this.stormClock=40+this.random()*20;}
    const w=Math.max(1,Number(view.width)||1),h=Math.max(1,Number(view.height)||1),sx=Number(view.x)||w*.5,sy=Number(view.y)||h*.56;
    this.updateCampPressure(dt,view,w,h,sx,sy);
    for(const entity of this.entities){
      entity.age+=dt;
      if(entity.item.storm){
        entity.baseY+=(entity.vy+speed*.012)*dt;entity.x+=entity.vx*dt;
        entity.y=entity.baseY+Math.sin(entity.age*.58+entity.phase)*.085+Math.sin(entity.age*.19+entity.phase*1.7)*.03;entity.angle+=entity.spin*dt;
        const dx=entity.x*w-sx,dy=entity.y*h-sy,distance=Math.hypot(dx,dy)||1,influence=entity.item.size*entity.scale*1.05+105;
        if(view.active&&view.ship!==2&&distance<influence){const strength=(1-distance/influence)**1.45;this.flightForce.x+=dx/distance*strength*.075;this.flightForce.y+=dy/distance*strength*.06;this.flightForce.intensity=Math.max(this.flightForce.intensity,strength*.5);this.resources.fuel=clamp(this.resources.fuel-dt*strength*.22);if(distance<entity.item.size*entity.scale*.2+22&&this.time-entity.lastDamage>2.5)this.applyDamage(entity,{repeat:true});}
        continue;
      }
      if(entity.item.ground){entity.vy+=(.05+speed*.06-entity.vy)*(1-Math.exp(-dt*.9));entity.y+=entity.vy*dt;entity.angle+=Math.sin(entity.phase)*dt*.012;continue;}
      const seed=entity.phase+this.time*.22+entity.y*10.4,flow=Math.sin(seed)*.031+Math.cos(seed*.47+entity.x*8)*.015;
      const targetVx=entity.item.fatal?0:flow+(entity.kind==='poison'?Math.sin(this.time*.7+entity.phase)*.012:0);entity.vx=entity.item.fatal?0:entity.vx+(targetVx-entity.vx)*(1-Math.exp(-dt*1.2));entity.vy+=((entity.item.asteroid?.074:.052)+speed*.055-entity.vy)*(1-Math.exp(-dt*.75));entity.x+=entity.vx*dt;entity.y+=entity.vy*dt;entity.angle+=entity.spin*dt+Math.sin(seed*.63)*dt*.08;
      // Recover lateral entrants and reflect drift before leaving the reachable field.
      if(!entity.item.fatal){const margin=Math.min(.23,entity.item.size*entity.scale/w*.5+.10);if(entity.x<margin){entity.x+=(margin-entity.x)*Math.min(1,dt*1.5);entity.vx=Math.abs(entity.vx)+.015;}else if(entity.x>1-margin){entity.x-=(entity.x-1+margin)*Math.min(1,dt*1.5);entity.vx=-Math.abs(entity.vx)-.015;}}
    }
    const floaters=this.entities.filter(entity=>!entity.item.ground&&!entity.item.storm);
    for(let i=0;i<floaters.length;i++)for(let j=i+1;j<floaters.length;j++){const a=floaters[i],b=floaters[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001,min=.095;if(d<min){const force=(min-d)*.26/d;a.vx-=dx*force;b.vx+=dx*force;a.vy-=dy*force*.28;b.vy+=dy*force*.28;if(a.item.asteroid&&b.item.asteroid&&this.time-(a.lastCollision??-99)>1.1){a.lastCollision=b.lastCollision=this.time;for(let chip=0;chip<5;chip++){const angle=this.random()*Math.PI*2;this.chips.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:Math.cos(angle)*(.025+this.random()*.05),vy:Math.sin(angle)*(.025+this.random()*.05),age:0,life:.35+this.random()*.45,size:1+this.random()*2,color:'#c7c1a8'});}}}}
    if((view.active||view.flying)&&view.ship!==2)for(const entity of this.entities){if(entity.item.storm)continue;const dx=entity.x*w-sx,dy=entity.y*h-sy,distance=Math.hypot(dx,dy),radius=entity.item.size*entity.scale*(entity.item.ground?.38:entity.item.asteroid?.38:.44)+(entity.item.ground?24:entity.item.asteroid?25:34);if(distance<radius){if(entity.item.asteroid||entity.item.ground)this.asteroidImpact(entity,view,w,h);else this.collect(entity);}else if((entity.item.asteroid||entity.item.ground)&&distance>radius+25)entity.impactArmed=true;}
    this.entities=this.entities.filter(entity=>!entity.collected&&entity.y<1.18&&entity.x>-.24&&entity.x<1.24);
    for(const effect of this.effects)effect.age+=dt;this.effects=this.effects.filter(effect=>effect.age<1.15);
    for(const chip of this.chips){chip.age+=dt;chip.x+=chip.vx*dt;chip.y+=chip.vy*dt;chip.vy+=.045*dt;}this.chips=this.chips.filter(chip=>chip.age<chip.life);
    for(const petal of this.ambient){const flow=Math.sin(this.time*.18+petal.phase+petal.y*9)*.008;petal.x+=flow*dt;petal.y+=(petal.speed+speed*.015)*dt;petal.phase+=petal.spin*dt;if(petal.y>1.08){petal.y=-.06;petal.x=this.random();}if(petal.x<-.05)petal.x=1.05;if(petal.x>1.05)petal.x=-.05;}
    if(profile.minResource){for(const key of Object.keys(this.resources))this.resources[key]=Math.max(profile.minResource,this.resources[key]);this.gameOver=false;this.critical=null;}
    this.updateCritical(dt);
  }
  drawStorm(ctx,entity,x,y,size,night){
    const fade=Math.min(1,entity.age*.85)*clamp((1.18-entity.y)/.18,0,1)*clamp((entity.x+.24)/.16,0,1)*clamp((1.24-entity.x)/.16,0,1),alpha=ctx.globalAlpha*fade,height=size*1.45;
    ctx.save();ctx.translate(x,y);ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=0;
    // Every strand and leaf shares the same axis, from the narrow lower tip
    // to the open crown. No filled silhouette sits behind the filaments.
    for(let flow=0;flow<6;flow++){
      let previous=null;
      for(let segment=0;segment<=44;segment++){
        const t=segment/44,turn=entity.phase+flow*Math.PI/3+entity.age*(.8+flow*.018)+t*9.8,radius=size*(.014+Math.pow(t,1.65)*.46),point={x:Math.cos(turn)*radius,y:height*(.50-t)+Math.sin(turn*.8)*size*.012};
        if(previous){const shimmer=.32+.68*(.5+.5*Math.sin(t*27-entity.age*2.8+flow));ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.28+night*.04+shimmer*.38);ctx.strokeStyle=flow%3===0?'#ede2b3':'#b9f5e2';ctx.lineWidth=Math.max(.55,size*.004)*(.55+t*.45);ctx.beginPath();ctx.moveTo(previous.x,previous.y);ctx.lineTo(point.x,point.y);ctx.stroke();if(segment%8===flow%8){ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.4+shimmer*.45);ctx.fillStyle='#dcfff2';ctx.beginPath();ctx.arc(point.x,point.y,.9+shimmer*.4,0,Math.PI*2);ctx.fill();}}
        previous=point;
      }
    }
    for(let leaf=0;leaf<24;leaf++){
      const t=modulo(leaf/24+entity.age*.016,1),turn=entity.phase+leaf*2.399+entity.age*(.95+(leaf%3)*.08),radius=size*(.024+t*t*.46),yy=height*(.50-t)+Math.sin(turn*1.7)*size*.025;
      ctx.save();ctx.translate(Math.cos(turn)*radius,yy);ctx.rotate(turn*.45);ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.17+night*.05);ctx.fillStyle=leaf%5===0?'#d8c394':'#afd7c4';ctx.beginPath();ctx.ellipse(0,0,size*(.007+t*.014),size*(.003+t*.005),0,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    for(let spark=0;spark<10;spark++){
      const t=modulo(spark/10+entity.age*.024,1),turn=entity.phase+spark*2.399+entity.age*.67,radius=size*(.018+t*t*.40);ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.21+Math.sin(entity.age*1.6+spark)*.07);ctx.fillStyle='#dce8cc';ctx.beginPath();ctx.arc(Math.cos(turn)*radius,height*(.50-t),Math.max(.5,size*.004),0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  drawAsteroid(ctx,entity,size){ctx.save();const lava=entity.kind==='lavaAsteroid',crystal=entity.kind==='crystalAsteroid',porous=entity.kind==='porousAsteroid',points=crystal?8:11,seed=entity.shapeSeed??entity.phase;ctx.beginPath();for(let i=0;i<points;i++){const a=i/points*Math.PI*2,r=size*(.36+(Math.sin(seed*29+i*7.13)+1)*.055+(crystal&&i%2?-.1:.05));const px=Math.cos(a)*r,py=Math.sin(a)*r*(.82+Math.sin(seed*9)*.08);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();const g=ctx.createRadialGradient(-size*.12,-size*.15,2,0,0,size*.48);if(lava){g.addColorStop(0,'#ffe16a');g.addColorStop(.22,'#ff6a24');g.addColorStop(.58,'#7e1f12');g.addColorStop(1,'#170a09');}else if(crystal){g.addColorStop(0,'#d8d2ff');g.addColorStop(.35,'#7468a5');g.addColorStop(1,'#252838');}else{g.addColorStop(0,porous?'#87958b':'#aaa999');g.addColorStop(.45,porous?'#4b5d54':'#62635d');g.addColorStop(1,'#252927');}ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=lava?'rgba(255,173,73,.8)':crystal?'rgba(205,194,255,.65)':'rgba(205,213,196,.25)';ctx.lineWidth=crystal?2:1;ctx.stroke();for(let i=0;i<(porous?9:lava?6:4);i++){const a=seed*11+i*2.37,r=size*(.08+(i%4)*.055),cx=Math.cos(a)*r,cy=Math.sin(a)*r*.7;ctx.fillStyle=lava?'rgba(255,202,79,.72)':'rgba(11,17,16,.36)';ctx.beginPath();ctx.ellipse(cx,cy,size*(.018+(i%3)*.009),size*(.012+(i%2)*.011),a,0,Math.PI*2);ctx.fill();}if(lava){ctx.shadowColor='#ff4d18';ctx.shadowBlur=size*.28;ctx.stroke();}ctx.restore();}
  draw(ctx,view={}){
    const w=Math.max(1,Number(view.width)||1),h=Math.max(1,Number(view.height)||1),night=Number(view.night)||0;ctx.save();ctx.globalCompositeOperation='source-over';
    if(this.shieldFade>0&&view.ship!==2){
      const x=view.x??w*.5,y=view.y??h*.56,r=Math.min(190,Math.max(110,w*.22))*(view.ship===1?1.35:1)*.59,pulse=1+Math.sin(this.time*1.2)*.012;
      ctx.save();ctx.translate(x,y);ctx.scale(pulse,pulse*1.12);ctx.globalAlpha=this.shieldFade;
      const skin=ctx.createRadialGradient(-r*.23,-r*.35,r*.05,0,0,r);skin.addColorStop(0,'rgba(216,234,245,.035)');skin.addColorStop(.78,'rgba(165,212,223,.006)');skin.addColorStop(1,`rgba(203,220,232,${.04+this.shieldFlash*.11})`);ctx.fillStyle=skin;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
      const edge=ctx.createLinearGradient(-r,-r,r,r);edge.addColorStop(0,'rgba(221,232,240,.28)');edge.addColorStop(.28,'rgba(153,221,221,.1)');edge.addColorStop(.65,'rgba(205,178,218,.08)');edge.addColorStop(1,'rgba(240,228,189,.25)');ctx.strokeStyle=edge;ctx.lineWidth=.8+this.shieldFlash*.8;ctx.stroke();
      ctx.strokeStyle='rgba(234,244,243,.17)';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(-r*.06,-r*.05,r*.85,3.6,4.8);ctx.stroke();
      for(let petal=0;petal<this.shieldHits;petal++){const a=-Math.PI/2+petal*Math.PI*2/3;ctx.save();ctx.rotate(a);ctx.strokeStyle='rgba(219,232,208,.32)';ctx.beginPath();ctx.ellipse(r*.97,0,4,1.8,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
      ctx.restore();
    }
    const colors=['rgba(172,236,201,','rgba(104,215,205,','rgba(211,189,236,','rgba(241,211,155,'];
    for(const petal of this.ambient){const x=petal.x*w,y=petal.y*h,alpha=.08+night*.07,stretch=1.6+Math.sin(petal.phase)*.35;ctx.save();ctx.translate(x,y);ctx.rotate(petal.phase);ctx.scale(stretch,1);ctx.fillStyle=`${colors[petal.tint]}${alpha})`;ctx.beginPath();ctx.moveTo(-petal.size,0);ctx.bezierCurveTo(-petal.size*.28,-petal.size*.52,petal.size*.55,-petal.size*.38,petal.size,0);ctx.bezierCurveTo(petal.size*.34,petal.size*.38,-petal.size*.36,petal.size*.42,-petal.size,0);ctx.fill();ctx.restore();}
    for(const entity of this.entities){
      const x=entity.x*w,y=entity.y*h,pulse=entity.item.ground?1:1+Math.sin(this.time*1.8+entity.phase)*(entity.item.assist?.025:.045),size=entity.item.size*entity.scale*pulse;
      if(entity.item.storm){this.drawStorm(ctx,entity,x,y,size,night);continue;}
      if(entity.item.restoration){
        ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,entity.age*1.8)*.84;drawGardenLifeWheel(ctx,size,entity.age,entity.phase);ctx.restore();continue;
      }
      if(entity.item.assist&&!entity.item.assist.reveal&&!entity.item.sprite){ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,entity.age*2.4);drawGardenAssistGlyph(ctx,entity.item,size);ctx.restore();continue;}
      const image=this.images[entity.item.sprite],filterArtifact=entity.item.assist&&!entity.item.assist.reveal;ctx.save();ctx.translate(x,y);ctx.rotate(entity.item.navigationDelta?0:entity.item.assist?Math.sin(entity.age*.6+entity.phase)*.035:entity.angle);ctx.globalAlpha=Math.min(1,entity.age*2.4)*(filterArtifact?(entity.item.assist.divisor===4?.64:.50):entity.item.ground?.84:.92+night*.08);ctx.shadowColor=entity.item.color;ctx.shadowBlur=filterArtifact?2:entity.item.ground?4:(entity.item.harmful?8:13)+night*9;if(entity.item.visualFilter)ctx.filter=entity.item.visualFilter;if(entity.item.navigationDelta){const delta=entity.item.navigationDelta;ctx.fillStyle='#bde8da';ctx.font=`${Math.round(size*.44)}px Georgia`;ctx.textAlign='center';ctx.fillText(`${delta>0?'+':'−'}${Math.abs(delta)}`,0,size*.12);}else if(entity.item.arrangement)drawGardenArrangementFlower(ctx,entity.item,size,entity.rounds);else if(entity.item.asteroid&&image){if(entity.kind==='crystalAsteroid')ctx.filter='hue-rotate(100deg) saturate(1.3)';if(entity.kind==='lavaAsteroid'){ctx.filter='sepia(1) saturate(4) hue-rotate(-28deg)';ctx.shadowBlur=size*.34;}ctx.drawImage(image,-size/2,-size/2,size,size);}else if(entity.item.asteroid)this.drawAsteroid(ctx,entity,size);else if(image)ctx.drawImage(image,-size/2,-size/2,size,size);else{ctx.fillStyle=entity.item.color;ctx.beginPath();ctx.ellipse(0,0,size*.22,size*.34,0,0,Math.PI*2);ctx.fill();}ctx.restore();
      if(entity.item.asteroid&&!entity.item.fatal){ctx.save();ctx.globalAlpha=.28;ctx.fillStyle=entity.item.color;ctx.beginPath();ctx.ellipse(x,y,size*.36,size*.30,entity.angle,0,Math.PI*2);ctx.fill();ctx.restore();}
      if(entity.item.navigationDelta){ctx.save();ctx.fillStyle='#bde8da';ctx.textAlign='center';ctx.font='9px sans-serif';ctx.fillText(`×${entity.item.amount}`,x,y+size*.45);ctx.restore();}
      if(entity.item.fatal){ctx.save();ctx.globalAlpha=.48+.3*Math.sin(this.time*4+entity.phase);ctx.strokeStyle='#ff693f';ctx.lineWidth=2;ctx.shadowColor='#ff3e1f';ctx.shadowBlur=15;ctx.beginPath();ctx.arc(x,y,size*.58,0,Math.PI*2);ctx.stroke();ctx.restore();}
      if(entity.item.fatal){ctx.save();ctx.fillStyle='#ffb49c';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.shadowColor='#d20f00';ctx.shadowBlur=12;ctx.fillText('☠',x,y-size*.67);ctx.restore();}
      if(!entity.item.ground){const halo=.5+.5*Math.sin(this.time*2.1+entity.phase);ctx.save();ctx.globalAlpha=.09+halo*.08;ctx.strokeStyle=entity.item.color;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,size*(.45+halo*.06),size*(.34+halo*.04),entity.angle*.35,0,Math.PI*2);ctx.stroke();ctx.restore();}
      else if(!entity.triggered){ctx.save();ctx.globalAlpha=.16+.08*Math.sin(this.time*2.4+entity.phase);ctx.strokeStyle='#ff9a70';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(x,y,size*.36,size*.29,entity.angle,0,Math.PI*2);ctx.stroke();ctx.restore();}
    }
    if(this.campPressure){const pressure=this.campPressure,x=pressure.x*w,y=pressure.y*h,charge=clamp((pressure.age-1.1)/1.5,0,1);ctx.save();ctx.translate(x,y);ctx.strokeStyle=`rgba(214,151,255,${.18+charge*.42})`;ctx.fillStyle=`rgba(88,35,104,${.05+charge*.12})`;for(let ring=0;ring<3;ring++){const radius=25+ring*16+Math.sin(this.time*3+ring)*5;ctx.lineWidth=1+charge;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke();}for(let i=0;i<12;i++){const angle=i*Math.PI*2/12+this.time*.35,radius=18+(i%3)*13;ctx.beginPath();ctx.arc(Math.cos(angle)*radius,Math.sin(angle)*radius,1.5+charge*2,0,Math.PI*2);ctx.fill();}ctx.restore();}
    for(const chip of this.chips){ctx.save();ctx.globalAlpha=1-chip.age/chip.life;ctx.fillStyle=chip.color;ctx.translate(chip.x*w,chip.y*h);ctx.rotate(chip.age*7);ctx.fillRect(-chip.size,-chip.size*.45,chip.size*2,chip.size*.9);ctx.restore();}
    for(const effect of this.effects){const t=effect.age/1.15,x=effect.x*w,y=effect.y*h,r=18+t*64;ctx.save();ctx.globalAlpha=(1-t)*.38;ctx.strokeStyle=effect.color;ctx.lineWidth=effect.harmful?1.2:.8;ctx.setLineDash([2+t*8,5+t*5]);ctx.beginPath();ctx.ellipse(x,y,r,r*(.62+Math.sin(t*9)*.05),t*.7,0,Math.PI*2);ctx.stroke();ctx.restore();}
    ctx.restore();
  }
  snapshot(){return {shieldHits:this.shieldHits,shieldFade:this.shieldFade,resources:{...this.resources},inventory:{...this.inventory},entities:this.entities.map(({id,kind,x,y,vx,vy,triggered})=>({id,kind,x,y,vx,vy,triggered})),event:this.event,eventAge:this.eventAge,flightForce:{...this.flightForce},impact:this.impact,chips:this.chips.length,campPressure:this.campPressure&&{x:this.campPressure.x,y:this.campPressure.y,age:this.campPressure.age},critical:this.critical&&{...this.critical},failureResource:this.failureResource,gameOver:this.gameOver};}
}

export const createGardenLife=options=>new GardenLife(options);
