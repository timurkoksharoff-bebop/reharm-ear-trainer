// A separate, gently psychedelic planet. Its seasons follow time, never grades.
// World-space terrain and vegetation share the game's camera displacement.
export const SEASON_CYCLE = 480;
export const SEASONS = [
  {id:'spring',name:'Весна',note:'Ручейки, первоцветы и пробуждение'},
  {id:'summer',name:'Лето',note:'Цветущий сад, тёплый свет и ягоды'},
  {id:'autumn',name:'Осень',note:'Медные листья и прозрачный ветер'},
  {id:'winter',name:'Зима',note:'Тихий снег над застывшей рекой'},
];
const TAU=Math.PI*2, WORLD=960, TILE=512;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const mod=(n,d)=>((n%d)+d)%d;
const hash=(x,y=0,s=0)=>{const n=Math.sin(x*127.1+y*311.7+s*74.7)*43758.5453;return n-Math.floor(n);};
const palettes=[
  {soil:'#283c36',light:'#456147',moss:'#668458',bank:'#897457',water:'#286e70',deep:'#123f4e',leaf:['#629461','#8cad70','#46785d'],flowers:['#edcec0','#b4b9e4','#e4c771','#ce8fb7']},
  {soil:'#243b32',light:'#496746',moss:'#75854b',bank:'#a39262',water:'#258b88',deep:'#154c58',leaf:['#47764c','#7b984d','#92a553'],flowers:['#e6b965','#ba87b8','#7397d2','#e3b4a1']},
  {soil:'#40392e',light:'#755b39',moss:'#a17a42',bank:'#be9664',water:'#407575',deep:'#243d46',leaf:['#b96b43','#d09a50','#797849'],flowers:['#c97a48','#dba760','#a85949','#ad795e']},
  {soil:'#637d7e',light:'#9caeaa',moss:'#c3cac0',bank:'#d1d4c7',water:'#8fb9bb',deep:'#517f91',leaf:['#81968a','#a7b8aa','#566f67'],flowers:['#c9d6cd','#d9e2dc','#a9c9ce','#9ea8b9']},
];

export function seasonState(time,cycleDuration=SEASON_CYCLE){
  const cycle=Number.isFinite(cycleDuration)&&cycleDuration>0?cycleDuration:SEASON_CYCLE;
  const phase=mod(Number.isFinite(time)?time:0,cycle)/cycle;
  const position=phase*4,index=Math.floor(position),progress=position-index;
  // Each season has a long settled interval, followed by a gradual transition.
  const blend=smooth(clamp((progress-.48)/.52));
  const weights=[0,0,0,0];weights[index]=1-blend;weights[(index+1)%4]=blend;
  return {phase,index,season:SEASONS[index].id,progress,blend,weights,cycleDuration:cycle};
}

function riverX(y){return 480+Math.sin(y*.0031)*116+Math.sin(y*.0073+1.5)*37;}
function riverWidth(y){return 78+Math.sin(y*.0043+.8)*17;}
function canvasSurface(w,h){
  const c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(w,h):document.createElement('canvas');c.width=w;c.height=h;return c;
}
function ellipse(ctx,x,y,rx,ry,color,angle=0){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,angle,0,TAU);ctx.fill();}
function line(ctx,points,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function plantSprite(season,kind,variant){
  const surface=canvasSurface(80,80),c=surface.getContext('2d'),p=palettes[season],seed=variant*7+kind*31;
  c.translate(40,42);c.lineCap='round';
  ellipse(c,1,4,20,12,'#0b201929');
  const snowy=season===3;
  // Fine sprays of paired leaves; all four seasonal versions share geometry.
  const stems=kind===2?7:4;
  for(let i=0;i<stems;i++){
    const a=hash(i,seed)*TAU,l=12+hash(i,seed,1)*16,ex=Math.cos(a)*l,ey=Math.sin(a)*l*.8;
    c.strokeStyle=snowy?'#71897b':p.leaf[i%3];c.lineWidth=.8;c.beginPath();c.moveTo(0,2);c.quadraticCurveTo(ex*.25-3,ey*.8,ex,ey);c.stroke();
    for(let j=1;j<4;j++){
      const t=j/4,x=ex*t,y=ey*t;
      for(const side of [-1,1])ellipse(c,x+Math.cos(a+side*1.1)*3,y+Math.sin(a+side*1.1)*3,4.3,1.9,p.leaf[(i+j)%3],a+side*.65);
    }
    if(snowy){ellipse(c,ex,ey-1,5,2.7,'#d4e0d3b8',a);continue;}
    if(kind===2)continue;
    if(kind===3){ // Tiny ripe berries, never large collectible-like circles.
      if(season===0)continue;
      for(let k=0;k<3;k++){const x=ex+(k-1)*3,y=ey+(k%2)*3;ellipse(c,x,y,2.3,2.3,season===2?'#b46b43':'#b35b76');ellipse(c,x-.6,y-.7,.65,.65,'#f1c2a9');}
    }else{
      const color=p.flowers[(i+variant)%4],petals=kind===1?8:5,r=kind===1?2.8:2.2;
      if(season===2&&hash(i,seed,6)>.38)continue;
      for(let k=0;k<petals;k++){const pa=k*TAU/petals;ellipse(c,ex+Math.cos(pa)*r,ey+Math.sin(pa)*r,kind===1?2.9:2.3,1.5,color,pa);}
      ellipse(c,ex,ey,1.4,1.4,'#ddbc70');ellipse(c,ex-.4,ey-.4,.55,.55,'#f4de9d');
    }
  }
  return surface;
}

export function createSeasonPlanet({width=480,height=()=>590,cycleDuration=SEASON_CYCLE,reducedMotion=false}={}){
  const cycle=Number.isFinite(cycleDuration)&&cycleDuration>0?cycleDuration:SEASON_CYCLE;
  let time=0,travel=0,windTime=0,rasterWidth=0;
  const tiles=new Map(),sprites=new Map();
  const getW=()=>Math.max(1,typeof width==='function'?width():width);
  const getH=()=>Math.max(1,typeof height==='function'?height():height);
  function sprite(season,kind,variant){const key=`${season}:${kind}:${variant}`;if(!sprites.has(key))sprites.set(key,plantSprite(season,kind,variant));return sprites.get(key);}
  function makeTile(chunk,season){
    const w=Math.min(960,Math.max(320,Math.round(getW()))),scale=w/WORLD;
    const surface=canvasSurface(w,Math.ceil(TILE*scale)),c=surface.getContext('2d'),p=palettes[season],origin=chunk*TILE;
    c.scale(scale,scale);c.fillStyle=p.soil;c.fillRect(0,0,WORLD,TILE);
    // Pigmented mineral soil with soft islands of moss, rather than a flat tint.
    for(let gy=Math.floor((origin-160)/140);gy<=Math.ceil((origin+TILE+160)/140);gy++)for(let gx=-1;gx<8;gx++){
      const x=gx*150+hash(gx,gy)*115,y=gy*140+hash(gx,gy,1)*100-origin,r=95+hash(gx,gy,2)*100;
      const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,p.light+'8a');g.addColorStop(.55,p.light+'38');g.addColorStop(1,p.light+'00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
    }
    for(let i=0;i<2400;i++){
      const x=hash(i,chunk,1)*WORLD,y=hash(i,chunk,2)*TILE,n=hash(i,chunk,3);
      c.fillStyle=n>.5?'#e2cb8720':'#081d2320';c.fillRect(x,y,.5+n*1.8,.5+n);
    }
    // Contour engraving and subtle paisley beds echo the flower-power era.
    for(let gy=Math.floor((origin-120)/240);gy<=Math.ceil((origin+TILE+120)/240);gy++)for(let side=0;side<2;side++){
      const x=side?815+Math.sin(gy)*50:115+Math.sin(gy*2)*45,y=gy*240-origin;
      c.save();c.translate(x,y);c.rotate(gy*.7);c.scale(1,.62);
      for(let ring=0;ring<5;ring++){
        c.strokeStyle=season===3?'#dfded029':ring%2?'#bb945424':'#c3975738';c.lineWidth=ring===0?2:.8;
        c.beginPath();for(let j=0;j<=64;j++){const a=j*TAU/64,r=51+ring*8+Math.sin(a*3+gy)*7;const xx=Math.cos(a)*r,yy=Math.sin(a)*r;j?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.closePath();c.stroke();
      }c.restore();
    }
    const riverPath=(offset=0)=>{c.beginPath();for(let y=-30;y<=TILE+30;y+=6){const x=riverX(origin+y)+offset;y===-30?c.moveTo(x,y):c.lineTo(x,y);}};
    c.lineJoin='round';c.lineCap='round';
    riverPath();c.strokeStyle='#102728';c.lineWidth=128;c.stroke();
    riverPath();c.strokeStyle=p.bank;c.lineWidth=122;c.stroke();
    riverPath();c.strokeStyle=season===3?'#a7bfc0':'#5c8065';c.lineWidth=111;c.stroke();
    riverPath();c.strokeStyle=p.deep;c.lineWidth=100;c.stroke();
    riverPath(-5);c.strokeStyle=p.water;c.lineWidth=77;c.stroke();
    riverPath(-20);c.strokeStyle=season===3?'#c0dbd1':'#77b8a345';c.lineWidth=18;c.stroke();
    // Braided copper-coloured tributaries become thawing water in spring.
    for(let row=Math.floor((origin-220)/360);row<=Math.ceil((origin+TILE+220)/360);row++){
      const endY=row*360,side=row%2?1:-1,endX=riverX(endY),startX=endX+side*255;
      for(const [stroke,size] of [[p.bank+'83',7],[season===3?'#c4d9d1':p.water,3.1],['#cce0ce65',.8]]){
        c.strokeStyle=stroke;c.lineWidth=size;c.beginPath();c.moveTo(startX,endY-120-origin);c.bezierCurveTo(startX-side*160,endY-40-origin,endX+side*110,endY-60-origin,endX,endY-origin);c.stroke();
      }
    }
    // Moss and botanical clusters follow stable world coordinates. Crossfading
    // changes the same plants through the year, without shuffling the landscape.
    for(let gy=Math.floor((origin-40)/28);gy<=Math.ceil((origin+TILE+40)/28);gy++)for(let gx=0;gx<34;gx++){
      const x=gx*29+hash(gx,gy)*25,wy=gy*28+hash(gx,gy,1)*24,y=wy-origin,d=Math.abs(x-riverX(wy));
      if(d<64||hash(gx,gy,3)<.16)continue;
      const patch=(Math.sin(x*.016+Math.sin(wy*.007)*2)+Math.sin(wy*.018+x*.003))* .25+.5;
      if(hash(gx,gy,4)>(.25+patch*.7))continue;
      const kind=Math.floor(hash(gx,gy,5)*4),variant=Math.floor(hash(gx,gy,6)*3);
      const size=(20+hash(gx,gy,7)*25)*(season===0?.87:1);
      c.globalAlpha=season===3?.75:1;c.drawImage(sprite(season,kind,variant),x-size/2,y-size/2,size,size);c.globalAlpha=1;
      if(season===2&&hash(gx,gy,8)>.6){for(let k=0;k<3;k++)ellipse(c,x+k*4-5,y+k*2,3.1,1.7,p.leaf[k],hash(gx,gy,k)*TAU);}
    }
    // Small salvaged brass observatories embedded in the gardens, not pickups.
    for(let row=Math.floor((origin-90)/700);row<=Math.ceil((origin+TILE+90)/700);row++){
      const side=row%2?1:-1,y=row*700+190-origin,x=480+side*326;
      c.save();c.translate(x,y);ellipse(c,3,6,35,31,'#08191650');ellipse(c,0,0,29,29,season===3?'#919f90':'#5d6650');
      for(const [r,color,lineWidth] of [[29,'#977950',3],[25,'#c0a270',1],[18,'#4f695e',3],[14,'#b6975c',1]]){c.strokeStyle=color;c.lineWidth=lineWidth;c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();}
      for(let i=0;i<12;i++){const a=i*TAU/12;line(c,[[Math.cos(a)*20,Math.sin(a)*20],[Math.cos(a)*24,Math.sin(a)*24]],'#d0b77c',.8);}
      for(let i=0;i<8;i++){const a=i*TAU/8;ellipse(c,Math.cos(a)*8,Math.sin(a)*8,6,2.5,season===3?'#d4dbcb':'#bb9565',a);}
      ellipse(c,0,0,3,3,season===3?'#b8d8d2':'#73bdba');c.restore();
    }
    if(season===3){
      // Fine branching ice fractures stay attached to the river while scrolling.
      for(let row=Math.floor(origin/90)-1;row<(origin+TILE)/90+1;row++){
        const wy=row*90,x=riverX(wy),y=wy-origin;
        line(c,[[x-39,y-26],[x-10,y-4],[x+5,y+3],[x+33,y+35]],'#e0ede09c',.8);
        line(c,[[x-10,y-4],[x-4,y-26],[x+15,y-36]],'#d9ece273',.65);
        line(c,[[x+5,y+3],[x-15,y+25],[x-36,y+28]],'#436b7d60',.7);
      }
      for(let i=0;i<75;i++){const x=hash(i,chunk,21)*WORLD,y=hash(i,chunk,22)*TILE;if(Math.abs(x-riverX(origin+y))<65)continue;ellipse(c,x,y,10+hash(i,chunk,23)*17,3+hash(i,chunk,24)*8,'#d9e1d039',hash(i,chunk,25));}
    }
    return surface;
  }
  function tile(chunk,season){
    const key=`${chunk}:${season}`;
    if(tiles.has(key)){const value=tiles.get(key);tiles.delete(key);tiles.set(key,value);return value;}
    const value=makeTile(chunk,season);tiles.set(key,value);
    while(tiles.size>16)tiles.delete(tiles.keys().next().value);
    return value;
  }
  function drawGround(ctx){
    const w=getW(),h=getH(),scale=w/WORLD,viewH=h/scale,offset=travel/scale;
    if(rasterWidth!==Math.round(w)){rasterWidth=Math.round(w);tiles.clear();}
    const state=seasonState(time,cycle),next=(state.index+1)%4;
    ctx.save();ctx.scale(scale,scale);
    const first=Math.floor((-offset)/TILE),last=Math.ceil((viewH-offset)/TILE);
    for(let row=first;row<last;row++){
      const y=row*TILE+offset;
      ctx.globalAlpha=1;ctx.drawImage(tile(row,state.index),0,y,WORLD,TILE+.6);
      if(state.blend>0){ctx.globalAlpha=state.blend;ctx.drawImage(tile(row,next),0,y,WORLD,TILE+.6);}
    }
    ctx.globalAlpha=1;
    const winter=state.weights[3],spring=state.weights[0],summer=state.weights[1];
    // Animated light on the liquid river fades naturally as it freezes.
    if(winter<.99){
      ctx.lineCap='round';
      for(let i=0;i<44;i++){
        const y=mod(i*57+windTime*12,viewH+80)-40,wy=y-offset;
        const x=riverX(wy)+(hash(i,0,11)-.5)*74,len=4+hash(i,0,12)*20;
        ctx.globalAlpha=(1-winter)*(.12+.12*Math.sin(windTime*.7+i)**2);
        line(ctx,[[x-len/2,y],[x,y+1.5],[x+len/2,y-1]],'#d1e9c8',.8);
      }
    }
    ctx.globalAlpha=1;
    // Broad drifting light, kept below enemies/digits in the actual game.
    const light=ctx.createRadialGradient(250+Math.sin(windTime*.04)*180,viewH*.36,15,480,viewH*.45,620);
    light.addColorStop(0,`rgba(246,208,126,${.05+.055*summer+.025*spring})`);light.addColorStop(1,'#1c363800');ctx.fillStyle=light;ctx.fillRect(0,0,WORLD,viewH);
    const shade=ctx.createLinearGradient(0,0,WORLD,0);shade.addColorStop(0,'#0e242a45');shade.addColorStop(.18,'#0e242a00');shade.addColorStop(.82,'#0e242a00');shade.addColorStop(1,'#0e242a45');ctx.fillStyle=shade;ctx.fillRect(0,0,WORLD,viewH);
    ctx.restore();
  }
  function drawAtmosphere(ctx){
    const w=getW(),h=getH(),scale=w/WORLD,viewH=h/scale,state=seasonState(time,cycle),[spring,summer,autumn,winter]=state.weights;
    const motion=reducedMotion?.25:1,t=windTime*motion;
    ctx.save();ctx.scale(scale,scale);
    // Deterministic particles are calculated from time: no unbounded emitters.
    for(let i=0;i<62;i++){
      const z=.45+hash(i,4)*.8,kind=i%3;
      const alpha=kind===0?autumn:kind===1?winter:spring*.35+summer*.16;
      if(alpha<.005)continue;
      const x=mod(hash(i,7)*WORLD+t*(kind===0?28:8)*z+Math.sin(t*.42+i)*22,WORLD+80)-40;
      const y=mod(hash(i,8)*viewH+t*(kind===0?10:kind===1?16:3)*z,viewH+80)-40;
      ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*.8+i)*.8+t*(kind===0?.3:.03));ctx.globalAlpha=alpha*(.35+z*.3);
      if(kind===0){
        const colors=['#dfb265','#b76047','#c6844d','#8d9959'];
        ctx.scale(z*(.7+Math.abs(Math.sin(t+i))*.3),z);ctx.fillStyle=colors[i%4];ctx.beginPath();ctx.moveTo(-7,0);ctx.bezierCurveTo(-2,-6,6,-5,8,0);ctx.bezierCurveTo(3,5,-3,6,-7,0);ctx.fill();line(ctx,[[-7,0],[7,0]],'#677c51',.65);line(ctx,[[0,0],[3,-3]],'#d5c283',.45);
      }else if(kind===1){
        ellipse(ctx,0,0,1.3*z,1.3*z,'#e7efe3');
        if(i%7===1){ctx.strokeStyle='#d8e9df';ctx.lineWidth=.65;for(let arm=0;arm<3;arm++){ctx.rotate(TAU/6);line(ctx,[[-3*z,0],[3*z,0]],'#d8e9df',.65);}}
      }else ellipse(ctx,0,0,2.3*z,1.1*z,i%2?'#e9ccac':'#bfbee0');
      ctx.restore();
    }
    if(autumn>.01&&!reducedMotion){
      ctx.globalAlpha=autumn*.09;ctx.strokeStyle='#efca93';ctx.lineWidth=.7;
      for(let i=0;i<3;i++){const y=mod(t*11+i*260,viewH+120)-60;ctx.beginPath();ctx.moveTo(-10,y);ctx.bezierCurveTo(280,y-70,600,y+90,980,y-35);ctx.stroke();}
    }
    ctx.restore();
  }
  return {
    update(dt,{scroll=0}={}){if(!Number.isFinite(dt)||dt<0)return;time=mod(time+dt,cycle);windTime+=dt;if(Number.isFinite(scroll))travel+=scroll;},
    reset(){time=0;travel=0;windTime=0;tiles.clear();},
    seek(phase){if(Number.isFinite(phase))time=mod(phase,1)*cycle;},
    drawGround,drawAtmosphere,
    snapshot(){return {...seasonState(time,cycle),time,travel,cacheSize:tiles.size};},
  };
}
