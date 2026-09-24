const clamp=(value,min=0,max=100)=>Math.min(max,Math.max(min,value));

export const GARDEN_RESOURCES=Object.freeze({
  fuel:{label:'FUEL',color:'#e8b85d'},water:{label:'H₂O',color:'#75e9ed'},
  crew:{label:'CREW',color:'#9ee08a'},hull:{label:'HULL',color:'#d8c4f5'}
});

export const GARDEN_ITEMS=Object.freeze({
  fuel:{resource:'fuel',amount:8,sprite:'fuel-seed',label:'Энергетическое семя',color:'#e9b95e',size:68},
  water:{resource:'water',amount:7,sprite:'water-pearl',label:'Водяная жемчужина',color:'#75f4ef',size:62},
  crew:{resource:'crew',amount:6,sprite:'crew-berries',label:'Спелые ягоды',color:'#a7ec86',size:70},
  hull:{resource:'hull',amount:7,sprite:'repair-lotus',label:'Смола лотоса',color:'#dcc9ff',size:72},
  poison:{resource:'crew',amount:-15,hullAmount:-6,sprite:'poison-seed',label:'Ядовитое семя',color:'#ff716c',size:68,harmful:true},
  arpeggio:{resource:'inventory',amount:1,sprite:'arpeggio-flower',label:'Цветок арпеджио',color:'#8ff7ed',size:78,artifact:true},
  restart:{resource:'inventory',amount:1,sprite:'root-flower',label:'Корневой цветок',color:'#ffd18a',size:78,artifact:true},
  hold:{resource:'inventory',amount:1,sprite:'hold-flower',label:'Лента удержания',color:'#b7ef86',size:78,artifact:true},
  holdArpeggio:{resource:'inventory',amount:1,sprite:'hold-arpeggio-flower',label:'Папоротник арпеджио',color:'#b9fff3',size:78,artifact:true},
  midpoint:{resource:'inventory',amount:1,sprite:'midpoint-seed',label:'Семя середины',color:'#87bfff',size:78,artifact:true},
  crater:{resource:'hull',amount:-22,sprite:'crater',label:'Удар о кратер',color:'#ff7b5f',size:126,harmful:true,ground:true},
  stoneAsteroid:{resource:'hull',amount:-12,sprite:null,label:'Каменный астероид',color:'#a8a595',size:70,harmful:true,asteroid:true,damage:12},
  porousAsteroid:{resource:'hull',amount:-7,sprite:null,label:'Пористый астероид',color:'#7b8d83',size:52,harmful:true,asteroid:true,damage:7},
  crystalAsteroid:{resource:'hull',amount:-24,sprite:null,label:'Кристаллический астероид',color:'#a997e8',size:82,harmful:true,asteroid:true,damage:24},
  lavaAsteroid:{resource:'hull',amount:-100,sprite:null,label:'Раскалённое лавовое ядро',color:'#ff5c25',size:94,harmful:true,asteroid:true,fatal:true},
  campSpore:{resource:'crew',amount:-5,waterAmount:-4,sprite:null,label:'Споры застоя',color:'#d49aff',size:92,harmful:true,pressure:true},
  storm:{resource:'hull',amount:-8,crewAmount:-3,sprite:null,label:'Ядро смерча',color:'#8fe7dd',size:164,harmful:true,storm:true}
});

const weightedItem=(resources,random)=>{
  const entries=Object.entries(GARDEN_ITEMS).filter(([,item])=>!item.ground&&!item.storm&&!item.asteroid&&!item.pressure).map(([kind,item])=>{
    const value=resources[item.resource]??100,need=item.artifact?.11:item.harmful?.3:1+Math.max(0,76-value)/15+(value<30?4:0);
    return {kind,weight:need};
  });
  let cursor=random()*entries.reduce((sum,item)=>sum+item.weight,0);
  return entries.find(item=>(cursor-=item.weight)<=0)?.kind??'water';
};

const announce=(owner,entity)=>{
  const item=entity.item;
  owner.event={id:++owner.eventCounter,kind:entity.kind,label:item.label,harmful:Boolean(item.harmful),resource:item.artifact?'artifact':item.resource};
  owner.eventAge=0;owner.effects.push({x:entity.x,y:entity.y,age:0,color:item.color,harmful:Boolean(item.harmful)});
};

export class GardenLife{
  constructor({random=Math.random}={}){
    this.random=random;this.images={};this.reset();
    this.ambient=Array.from({length:22},(_,index)=>({x:random(),y:random(),phase:random()*Math.PI*2,size:3+random()*8,speed:.012+random()*.026,spin:(random()-.5)*.42,tint:index%4}));
  }
  reset(){
    this.time=0;this.spawnClock=1.4;this.craterClock=3.4;this.asteroidClock=6.5;this.stormClock=8.5;this.gameOver=false;
    this.entities=[];this.effects=[];this.chips=[];this.event=null;this.eventAge=99;this.eventCounter=0;this.flightForce={x:0,y:0,intensity:0};this.impact=0;
    this.campIdle=0;this.campPressure=null;this.lastShip=null;this.critical=null;this.failureResource=null;
    this.resources={fuel:86,water:78,crew:92,hull:84};this.inventory={arpeggio:0,restart:0,hold:0,holdArpeggio:0,midpoint:0};
  }
  setImages(images){this.images={...images};}
  setResource(name,value){if(name in this.resources)this.resources[name]=clamp(value);}
  getFlightForce(){return {...this.flightForce};}
  consumeArtifact(kind){if(!(kind in this.inventory)||this.inventory[kind]<1)return false;this.inventory[kind]-=1;return true;}
  forceSpawn(kind='water',overrides={}){
    const item=GARDEN_ITEMS[kind]??GARDEN_ITEMS.water,edge=!item.ground&&!item.storm&&this.random()<.28,fromLeft=this.random()<.5;
    const entity={id:`${kind}-${this.time.toFixed(3)}-${this.random().toFixed(6)}`,kind,item,
      x:item.storm?(fromLeft?-.13:1.13):item.ground?.18+this.random()*.64:edge?(this.random()<.5?-.08:1.08):.17+this.random()*.66,
      y:item.storm?.2+this.random()*.3:item.ground?-.12:edge?.16+this.random()*.32:-.10,
      vx:item.storm?(fromLeft?.055+this.random()*.025:-.055-this.random()*.025):item.ground?0:edge?(this.random()<.5?.065:-.065):(this.random()-.5)*.025,
      vy:item.ground?.05+this.random()*.018:item.storm?.01:.052+this.random()*.036,angle:this.random()*Math.PI*2,
      spin:item.storm?(fromLeft?1:-1)*(.42+this.random()*.28):(this.random()-.5)*(item.artifact?1.2:item.harmful?.8:.42),phase:this.random()*Math.PI*2,
      age:0,scale:item.ground?.78+this.random()*.34:item.storm?.82+this.random()*.28:.82+this.random()*.3,
      collected:false,triggered:false,lastDamage:-999,baseY:item.storm?.2+this.random()*.3:0,...overrides};
    if(item.storm&&overrides.y!==undefined)entity.baseY=overrides.y;
    if(!item.ground&&!item.storm)for(let attempt=0;attempt<8;attempt++){
      const crowded=this.entities.some(other=>!other.item.ground&&!other.item.storm&&Math.hypot(other.x-entity.x,other.y-entity.y)<.16);
      if(!crowded)break;entity.x=.17+this.random()*.66;entity.y=-.08-this.random()*.1;
    }
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
    if(entity.item.ground||entity.item.storm)return this.applyDamage(entity,{repeat:entity.item.storm});
    entity.collected=true;const item=entity.item;
    if(item.fatal)this.gameOver=true;
    if(item.artifact)this.inventory[entity.kind]=Math.min(9,(this.inventory[entity.kind]||0)+1);
    else{this.resources[item.resource]=clamp(this.resources[item.resource]+item.amount);if(item.hullAmount)this.resources.hull=clamp(this.resources.hull+item.hullAmount);}
    announce(this,entity);return true;
  }
  asteroidImpact(entity,view,w,h){
    if(!entity||this.time-entity.lastDamage<.8)return false;
    const sx=Number(view.x)||w*.5,sy=Number(view.y)||h*.56,dx=entity.x*w-sx,dy=entity.y*h-sy,distance=Math.hypot(dx,dy)||1,item=entity.item;
    entity.triggered=true;entity.lastDamage=this.time;
    if(item.fatal){this.resources.hull=0;this.gameOver=true;this.failureResource='lava';}
    else{
      this.resources.hull=clamp(this.resources.hull-(item.damage??Math.abs(item.amount||8)));
      this.resources.crew=clamp(this.resources.crew-Math.max(1,(item.damage??8)*.12));
      this.resources.fuel=clamp(this.resources.fuel-Math.max(1,(item.damage??8)*.08));
    }
    const severity=item.fatal?1:clamp((item.damage??8)/28,.24,.9),awayX=-dx/distance,awayY=-dy/distance;
    this.flightForce.x+=awayX*(.34+severity*.38);this.flightForce.y+=awayY*(.28+severity*.32);this.flightForce.intensity=Math.max(this.flightForce.intensity,severity);
    entity.vx-=awayX*(.08+severity*.06);entity.vy-=awayY*(.06+severity*.05);entity.spin+=(this.random()-.5)*(2.2+severity*3);
    this.impact=Math.max(this.impact,severity);
    for(let i=0;i<8+Math.round(severity*10);i++){const angle=Math.PI*2*this.random();this.chips.push({x:entity.x,y:entity.y,vx:Math.cos(angle)*(.035+this.random()*.09),vy:Math.sin(angle)*(.035+this.random()*.09),age:0,life:.42+this.random()*.58,size:1+this.random()*3,color:item.color});}
    announce(this,entity);return true;
  }
  updateCampPressure(dt,view,w,h,sx,sy){
    const current={x:sx/w,y:sy/h},moving=this.lastShip&&Math.hypot(current.x-this.lastShip.x,current.y-this.lastShip.y)>.0035;
    this.lastShip=current;
    if(!view.active||!view.answering||view.ship===2){this.campIdle=0;this.campPressure=null;return;}
    if(moving)this.campIdle=Math.max(0,this.campIdle-dt*5);else this.campIdle+=dt*(current.x<.16||current.x>.84||current.y<.24||current.y>.76?1.55:1);
    if(!this.campPressure&&this.campIdle>5.8)this.campPressure={x:current.x,y:current.y,age:0,lastDamage:-99};
    const pressure=this.campPressure;if(!pressure)return;
    pressure.age+=dt;const distance=Math.hypot((current.x-pressure.x)*w,(current.y-pressure.y)*h);
    if(distance>78){this.campPressure=null;this.campIdle=0;return;}
    if(pressure.age>1.35&&this.time-pressure.lastDamage>1.25){pressure.lastDamage=this.time;const item=GARDEN_ITEMS.campSpore;this.resources.crew=clamp(this.resources.crew+item.amount);this.resources.water=clamp(this.resources.water+item.waterAmount);announce(this,{kind:'campSpore',item,x:pressure.x,y:pressure.y});}
  }
  updateCritical(dt){
    const empty=Object.keys(this.resources).find(name=>this.resources[name]<=0);
    if(!empty){this.critical=null;return;}
    if(!this.critical||this.critical.resource!==empty)this.critical={resource:empty,age:0};else this.critical.age+=dt;
    if(this.critical.age>=3.5){this.gameOver=true;this.failureResource=empty;}
  }
  update(dt,view={}){
    this.flightForce={x:0,y:0,intensity:0};if(!dt||view.paused||this.gameOver)return;
    this.impact=Math.max(0,this.impact-dt*2.8);
    this.time+=dt;this.eventAge+=dt;const speed=Number(view.speed)||0;
    if(view.active){this.resources.fuel=clamp(this.resources.fuel-dt*(.12+speed*.09));this.resources.water=clamp(this.resources.water-dt*(.045+speed*.018));this.resources.crew=clamp(this.resources.crew-dt*(.014+Math.max(0,24-this.resources.water)*.003));if(this.resources.fuel<8)this.resources.hull=clamp(this.resources.hull-dt*(8-this.resources.fuel)*.015);}
    this.spawnClock-=dt;this.craterClock-=dt;this.asteroidClock-=dt;this.stormClock-=dt;
    const pickupCount=this.entities.filter(entity=>!entity.item.ground&&!entity.item.storm&&!entity.item.asteroid).length;
    if(this.spawnClock<=0&&pickupCount<6){this.forceSpawn(weightedItem(this.resources,this.random));this.spawnClock=5.2+this.random()*4.8;}
    if(this.craterClock<=0&&this.entities.filter(entity=>entity.item.ground).length<3){this.forceSpawn('crater');this.craterClock=10+this.random()*8;}
    if(this.asteroidClock<=0&&this.entities.filter(entity=>entity.item.asteroid).length<3){const roll=this.random(),kind=roll<.08?'lavaAsteroid':roll<.32?'crystalAsteroid':roll<.62?'porousAsteroid':'stoneAsteroid';this.forceSpawn(kind,{scale:.58+this.random()*1.25,shapeSeed:this.random()});this.asteroidClock=7+this.random()*8;}
    if(this.stormClock<=0&&!this.entities.some(entity=>entity.item.storm)){this.forceSpawn('storm');this.stormClock=28+this.random()*18;}
    const w=Math.max(1,Number(view.width)||1),h=Math.max(1,Number(view.height)||1),sx=Number(view.x)||w*.5,sy=Number(view.y)||h*.56;
    this.updateCampPressure(dt,view,w,h,sx,sy);
    for(const entity of this.entities){
      entity.age+=dt;
      if(entity.item.storm){
        entity.baseY+=(entity.vy+speed*.012)*dt;entity.x+=entity.vx*dt;
        entity.y=entity.baseY+Math.sin(entity.age*.58+entity.phase)*.085+Math.sin(entity.age*.19+entity.phase*1.7)*.03;entity.angle+=entity.spin*dt;
        const dx=entity.x*w-sx,dy=entity.y*h-sy,distance=Math.hypot(dx,dy)||1,influence=entity.item.size*entity.scale*1.05+105;
        if(view.active&&view.ship!==2&&distance<influence){const strength=(1-distance/influence)**1.45;this.flightForce.x+=dx/distance*strength*.19;this.flightForce.y+=dy/distance*strength*.15;this.flightForce.intensity=Math.max(this.flightForce.intensity,strength);this.resources.fuel=clamp(this.resources.fuel-dt*strength*.82);if(distance<entity.item.size*entity.scale*.27+30&&this.time-entity.lastDamage>1.15)this.applyDamage(entity,{repeat:true});}
        continue;
      }
      if(entity.item.ground){entity.vy+=(.05+speed*.06-entity.vy)*(1-Math.exp(-dt*.9));entity.y+=entity.vy*dt;entity.angle+=Math.sin(entity.phase)*dt*.012;continue;}
      const seed=entity.phase+this.time*.22+entity.y*10.4,flow=Math.sin(seed)*.031+Math.cos(seed*.47+entity.x*8)*.015;
      const targetVx=flow+(entity.kind==='poison'?Math.sin(this.time*.7+entity.phase)*.012:0);entity.vx+=(targetVx-entity.vx)*(1-Math.exp(-dt*1.2));entity.vy+=((entity.item.asteroid?.074:.052)+speed*.055-entity.vy)*(1-Math.exp(-dt*.75));entity.x+=entity.vx*dt;entity.y+=entity.vy*dt;entity.angle+=entity.spin*dt+Math.sin(seed*.63)*dt*.08;
    }
    const floaters=this.entities.filter(entity=>!entity.item.ground&&!entity.item.storm);
    for(let i=0;i<floaters.length;i++)for(let j=i+1;j<floaters.length;j++){const a=floaters[i],b=floaters[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001,min=.095;if(d<min){const force=(min-d)*.26/d;a.vx-=dx*force;b.vx+=dx*force;a.vy-=dy*force*.28;b.vy+=dy*force*.28;if(a.item.asteroid&&b.item.asteroid&&this.time-(a.lastCollision??-99)>1.1){a.lastCollision=b.lastCollision=this.time;for(let chip=0;chip<5;chip++){const angle=this.random()*Math.PI*2;this.chips.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:Math.cos(angle)*(.025+this.random()*.05),vy:Math.sin(angle)*(.025+this.random()*.05),age:0,life:.35+this.random()*.45,size:1+this.random()*2,color:'#c7c1a8'});}}}}
    if(view.active&&view.ship!==2)for(const entity of this.entities){if(entity.item.storm)continue;const dx=entity.x*w-sx,dy=entity.y*h-sy;if(Math.hypot(dx,dy)<entity.item.size*entity.scale*(entity.item.ground?.46:entity.item.asteroid?.38:.44)+34){if(entity.item.asteroid)this.asteroidImpact(entity,view,w,h);else this.collect(entity);}}
    this.entities=this.entities.filter(entity=>!entity.collected&&entity.y<1.18&&entity.x>-.24&&entity.x<1.24);
    for(const effect of this.effects)effect.age+=dt;this.effects=this.effects.filter(effect=>effect.age<1.15);
    for(const chip of this.chips){chip.age+=dt;chip.x+=chip.vx*dt;chip.y+=chip.vy*dt;chip.vy+=.045*dt;}this.chips=this.chips.filter(chip=>chip.age<chip.life);
    for(const petal of this.ambient){const flow=Math.sin(this.time*.18+petal.phase+petal.y*9)*.008;petal.x+=flow*dt;petal.y+=(petal.speed+speed*.015)*dt;petal.phase+=petal.spin*dt;if(petal.y>1.08){petal.y=-.06;petal.x=this.random();}if(petal.x<-.05)petal.x=1.05;if(petal.x>1.05)petal.x=-.05;}
    this.updateCritical(dt);
  }
  drawStorm(ctx,entity,x,y,size,night){
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,entity.age*1.3);const height=size*1.45;
    const haze=ctx.createLinearGradient(0,-height*.55,0,height*.52);haze.addColorStop(0,'rgba(128,224,207,.05)');haze.addColorStop(.62,`rgba(34,110,109,${.18+night*.08})`);haze.addColorStop(1,'rgba(3,20,24,.48)');ctx.fillStyle=haze;ctx.beginPath();ctx.moveTo(-size*.56,-height*.52);ctx.bezierCurveTo(-size*.24,-height*.1,-size*.17,height*.23,-size*.05,height*.5);ctx.bezierCurveTo(size*.1,height*.24,size*.23,-height*.12,size*.58,-height*.52);ctx.closePath();ctx.fill();
    for(let i=0;i<42;i++){const t=(i%14)/13,band=Math.floor(i/14),turn=entity.phase+i*2.399+entity.age*(1.15+band*.17),radius=size*(.07+t*t*.48),yy=height*(.48-t)-height*.5+Math.sin(turn*1.7)*size*.045;ctx.fillStyle=band===2?'rgba(223,190,128,.36)':`rgba(${112+band*27},${190+band*13},${176+band*9},${.16+t*.22})`;ctx.save();ctx.translate(Math.cos(turn)*radius,yy);ctx.rotate(turn);ctx.beginPath();ctx.ellipse(0,0,1.2+t*4,.6+t*1.7,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    ctx.strokeStyle='rgba(166,241,221,.21)';ctx.lineWidth=Math.max(1,size*.012);for(let flow=0;flow<5;flow++){ctx.beginPath();for(let j=0;j<28;j++){const t=j/27,turn=entity.phase+flow*1.26+entity.age*(1.05+flow*.025)+t*10.5,r=size*(.04+t*t*.46),px=Math.cos(turn)*r,py=height*(.48-t)-height*.5;(j?ctx.lineTo(px,py):ctx.moveTo(px,py));}ctx.stroke();}ctx.restore();
  }
  drawAsteroid(ctx,entity,size){ctx.save();const lava=entity.kind==='lavaAsteroid',crystal=entity.kind==='crystalAsteroid',porous=entity.kind==='porousAsteroid',points=crystal?8:11,seed=entity.shapeSeed??entity.phase;ctx.beginPath();for(let i=0;i<points;i++){const a=i/points*Math.PI*2,r=size*(.36+(Math.sin(seed*29+i*7.13)+1)*.055+(crystal&&i%2?-.1:.05));const px=Math.cos(a)*r,py=Math.sin(a)*r*(.82+Math.sin(seed*9)*.08);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();const g=ctx.createRadialGradient(-size*.12,-size*.15,2,0,0,size*.48);if(lava){g.addColorStop(0,'#ffe16a');g.addColorStop(.22,'#ff6a24');g.addColorStop(.58,'#7e1f12');g.addColorStop(1,'#170a09');}else if(crystal){g.addColorStop(0,'#d8d2ff');g.addColorStop(.35,'#7468a5');g.addColorStop(1,'#252838');}else{g.addColorStop(0,porous?'#87958b':'#aaa999');g.addColorStop(.45,porous?'#4b5d54':'#62635d');g.addColorStop(1,'#252927');}ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=lava?'rgba(255,173,73,.8)':crystal?'rgba(205,194,255,.65)':'rgba(205,213,196,.25)';ctx.lineWidth=crystal?2:1;ctx.stroke();for(let i=0;i<(porous?9:lava?6:4);i++){const a=seed*11+i*2.37,r=size*(.08+(i%4)*.055),cx=Math.cos(a)*r,cy=Math.sin(a)*r*.7;ctx.fillStyle=lava?'rgba(255,202,79,.72)':'rgba(11,17,16,.36)';ctx.beginPath();ctx.ellipse(cx,cy,size*(.018+(i%3)*.009),size*(.012+(i%2)*.011),a,0,Math.PI*2);ctx.fill();}if(lava){ctx.shadowColor='#ff4d18';ctx.shadowBlur=size*.28;ctx.stroke();}ctx.restore();}
  draw(ctx,view={}){
    const w=Math.max(1,Number(view.width)||1),h=Math.max(1,Number(view.height)||1),night=Number(view.night)||0;ctx.save();ctx.globalCompositeOperation='source-over';
    const colors=['rgba(172,236,201,','rgba(104,215,205,','rgba(211,189,236,','rgba(241,211,155,'];
    for(const petal of this.ambient){const x=petal.x*w,y=petal.y*h,alpha=.08+night*.07,stretch=1.6+Math.sin(petal.phase)*.35;ctx.save();ctx.translate(x,y);ctx.rotate(petal.phase);ctx.scale(stretch,1);ctx.fillStyle=`${colors[petal.tint]}${alpha})`;ctx.beginPath();ctx.moveTo(-petal.size,0);ctx.bezierCurveTo(-petal.size*.28,-petal.size*.52,petal.size*.55,-petal.size*.38,petal.size,0);ctx.bezierCurveTo(petal.size*.34,petal.size*.38,-petal.size*.36,petal.size*.42,-petal.size,0);ctx.fill();ctx.restore();}
    for(const entity of this.entities){
      const x=entity.x*w,y=entity.y*h,pulse=entity.item.ground?1:1+Math.sin(this.time*1.8+entity.phase)*.045,size=entity.item.size*entity.scale*pulse;
      if(entity.item.storm){this.drawStorm(ctx,entity,x,y,size,night);continue;}
      const image=this.images[entity.item.sprite];ctx.save();ctx.translate(x,y);ctx.rotate(entity.angle);ctx.globalAlpha=Math.min(1,entity.age*2.4)*(entity.item.ground?.84:.92+night*.08);ctx.shadowColor=entity.item.color;ctx.shadowBlur=entity.item.ground?4:(entity.item.harmful?8:13)+night*9;if(entity.item.asteroid)this.drawAsteroid(ctx,entity,size);else if(image)ctx.drawImage(image,-size/2,-size/2,size,size);else{ctx.fillStyle=entity.item.color;ctx.beginPath();ctx.ellipse(0,0,size*.22,size*.34,0,0,Math.PI*2);ctx.fill();}ctx.restore();
      if(!entity.item.ground){const halo=.5+.5*Math.sin(this.time*2.1+entity.phase);ctx.save();ctx.globalAlpha=.09+halo*.08;ctx.strokeStyle=entity.item.color;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,size*(.45+halo*.06),size*(.34+halo*.04),entity.angle*.35,0,Math.PI*2);ctx.stroke();ctx.restore();}
      else if(!entity.triggered){ctx.save();ctx.globalAlpha=.16+.08*Math.sin(this.time*2.4+entity.phase);ctx.strokeStyle='#ff9a70';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(x,y,size*.36,size*.29,entity.angle,0,Math.PI*2);ctx.stroke();ctx.restore();}
    }
    if(this.campPressure){const pressure=this.campPressure,x=pressure.x*w,y=pressure.y*h,charge=clamp((pressure.age-1.1)/1.5,0,1);ctx.save();ctx.translate(x,y);ctx.strokeStyle=`rgba(214,151,255,${.18+charge*.42})`;ctx.fillStyle=`rgba(88,35,104,${.05+charge*.12})`;for(let ring=0;ring<3;ring++){const radius=25+ring*16+Math.sin(this.time*3+ring)*5;ctx.lineWidth=1+charge;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke();}for(let i=0;i<12;i++){const angle=i*Math.PI*2/12+this.time*.35,radius=18+(i%3)*13;ctx.beginPath();ctx.arc(Math.cos(angle)*radius,Math.sin(angle)*radius,1.5+charge*2,0,Math.PI*2);ctx.fill();}ctx.restore();}
    for(const chip of this.chips){ctx.save();ctx.globalAlpha=1-chip.age/chip.life;ctx.fillStyle=chip.color;ctx.translate(chip.x*w,chip.y*h);ctx.rotate(chip.age*7);ctx.fillRect(-chip.size,-chip.size*.45,chip.size*2,chip.size*.9);ctx.restore();}
    for(const effect of this.effects){const t=effect.age/1.15,x=effect.x*w,y=effect.y*h,r=18+t*64;ctx.save();ctx.globalAlpha=(1-t)*.38;ctx.strokeStyle=effect.color;ctx.lineWidth=effect.harmful?1.2:.8;ctx.setLineDash([2+t*8,5+t*5]);ctx.beginPath();ctx.ellipse(x,y,r,r*(.62+Math.sin(t*9)*.05),t*.7,0,Math.PI*2);ctx.stroke();ctx.restore();}
    ctx.restore();
  }
  snapshot(){return {resources:{...this.resources},inventory:{...this.inventory},entities:this.entities.map(({id,kind,x,y,vx,vy,triggered})=>({id,kind,x,y,vx,vy,triggered})),event:this.event,eventAge:this.eventAge,flightForce:{...this.flightForce},impact:this.impact,chips:this.chips.length,campPressure:this.campPressure&&{x:this.campPressure.x,y:this.campPressure.y,age:this.campPressure.age},critical:this.critical&&{...this.critical},failureResource:this.failureResource,gameOver:this.gameOver};}
}

export const createGardenLife=options=>new GardenLife(options);
