// Short, bounded nature reactions. No music, scoring, or route mutation here.
export function createGardenRewards({reduced=false,rng=Math.random}={}){
  let motes=[],blooms=[],waves=[],vines=[],lastKind=null,count=0;
  const reset=()=>{motes=[];blooms=[];waves=[];vines=[];lastKind=null;count=0;};
  function answer(result,kind,{x=.5,y=.4}={}){
    if(!result?.correct||result.ignored)return false;
    count++;lastKind=kind;
    if(kind==='degree'){
      vines.push({x,y,age:0,life:5.2,phase:rng()*Math.PI*2});vines=vines.slice(-4);
      for(let i=0;i<(reduced?3:9);i++){const angle=rng()*Math.PI*2,spread=.025+rng()*.065;motes.push({x:x+Math.cos(angle)*spread,y:y+Math.sin(angle)*spread,age:0,life:3+rng(),phase:rng()*Math.PI*2,vx:(rng()-.5)*.01,vy:-.008});}
    }
    if(kind==='quality')blooms.push({x,y,age:0,life:3.4});
    if(result.positionComplete||result.complete)waves.push({x,y,age:0,life:2.8});
    motes=motes.slice(-88);blooms=blooms.slice(-6);waves=waves.slice(-4);return true;
  }
  function step(dt,{ground=.0}={}){
    const elapsed=Math.max(0,dt);
    for(const p of motes){p.age+=elapsed;if(!reduced){p.x+=p.vx*elapsed;p.y+=p.vy*elapsed;}}
    for(const p of [...blooms,...waves,...vines]){p.age+=elapsed;p.y+=ground;}
    vines=vines.filter(p=>p.age<p.life);
    motes=motes.filter(p=>p.age<p.life);blooms=blooms.filter(p=>p.age<p.life);waves=waves.filter(p=>p.age<p.life);
  }
  function draw(ctx,width,height){
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const p of vines){
      const grow=reduced?1:Math.min(1,p.age/1.7),fade=Math.min(1,p.age/.25,(p.life-p.age)/1.8),radius=Math.min(width,height)*.14;
      ctx.save();ctx.translate(p.x*width,p.y*height);ctx.rotate(p.phase);ctx.lineWidth=.85;ctx.strokeStyle=`rgba(165,212,207,${fade*.62})`;
      for(let branch=0;branch<5;branch++){
        ctx.save();ctx.rotate(branch*Math.PI*2/5);ctx.beginPath();ctx.moveTo(0,0);
        for(let k=1;k<=24*grow;k++){const t=k/24;ctx.lineTo(Math.sin(t*5+branch)*radius*t*.3,-radius*t);}ctx.stroke();
        for(let leaf=1;leaf<=5;leaf++){const t=leaf/6;if(t>grow)continue;const lx=Math.sin(t*5+branch)*radius*t*.3,ly=-radius*t,scale=Math.min(1,(grow-t)*6),side=leaf%2?1:-1;
          ctx.save();ctx.translate(lx,ly);ctx.rotate(side*.8);ctx.fillStyle=`rgba(170,210,197,${fade*.32})`;ctx.beginPath();ctx.ellipse(side*radius*.04,-radius*.035,radius*.025*scale,radius*.07*scale,-side*.5,0,Math.PI*2);ctx.fill();ctx.restore();
          ctx.fillStyle=`rgba(235,233,194,${fade*.7})`;ctx.beginPath();ctx.arc(lx,ly,1.2,0,Math.PI*2);ctx.fill();
        }ctx.restore();
      }ctx.restore();
    }
    for(const p of motes){
      const fade=Math.min(1,p.age/.3,(p.life-p.age)/.8),pulse=reduced?1:.65+.35*Math.sin(p.phase+p.age*5)**2;
      const x=p.x*width+(reduced?0:Math.sin(p.phase+p.age*3)*8),y=p.y*height;
      const light=ctx.createRadialGradient(x,y,0,x,y,5);light.addColorStop(0,`rgba(255,242,191,${fade*pulse*.8})`);light.addColorStop(.2,`rgba(190,225,217,${fade*.4})`);light.addColorStop(1,'rgba(190,225,217,0)');
      ctx.fillStyle=light;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
    }
    for(const p of blooms){
      const fade=Math.min(1,p.age/.4,(p.life-p.age)/.8),open=reduced?1:Math.min(1,p.age/1.1),radius=Math.min(width,height)*.042;
      ctx.save();ctx.translate(p.x*width,p.y*height);ctx.fillStyle=`rgba(124,255,211,${fade*.30})`;
      for(let i=0;i<7;i++){ctx.save();ctx.rotate(i*Math.PI*2/7);ctx.beginPath();ctx.ellipse(0,-radius*open*.68,radius*.32,radius*open*.85,0,0,Math.PI*2);ctx.fill();ctx.restore();}
      ctx.fillStyle=`rgba(255,244,167,${fade*.9})`;ctx.beginPath();ctx.arc(0,0,radius*.22,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    for(const p of waves){
      const fade=Math.sin(Math.PI*p.age/p.life),radius=Math.min(width,height)*(reduced?.12:.05+p.age*.07);
      ctx.strokeStyle=`rgba(167,255,198,${fade*.30})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x*width,p.y*height,radius,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  }
  return {answer,step,draw,reset,snapshot:()=>({motes:motes.length,blooms:blooms.length,waves:waves.length,vines:vines.length,lastKind,count})};
}
