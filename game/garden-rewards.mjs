// Short, bounded nature reactions. No music, scoring, or route mutation here.
export function createGardenRewards({reduced=false,rng=Math.random}={}){
  let motes=[],blooms=[],waves=[],lastKind=null,count=0;
  const reset=()=>{motes=[];blooms=[];waves=[];lastKind=null;count=0;};
  function answer(result,kind,{x=.5,y=.4}={}){
    if(!result?.correct||result.ignored)return false;
    count++;lastKind=kind;
    if(kind==='degree')for(let i=0;i<(reduced?5:22);i++){
      const angle=rng()*Math.PI*2,spread=rng()*.055;
      motes.push({x:x+Math.cos(angle)*spread,y:y+Math.sin(angle)*spread,age:0,life:reduced?2:3.6+rng()*1.2,phase:rng()*Math.PI*2,vx:(rng()-.5)*.04,vy:-.035-rng()*.04});
    }
    if(kind==='quality')blooms.push({x,y,age:0,life:3.4});
    if(result.positionComplete||result.complete)waves.push({x,y,age:0,life:2.8});
    motes=motes.slice(-88);blooms=blooms.slice(-6);waves=waves.slice(-4);return true;
  }
  function step(dt,{ground=.0}={}){
    const elapsed=Math.max(0,dt);
    for(const p of motes){p.age+=elapsed;if(!reduced){p.x+=p.vx*elapsed;p.y+=p.vy*elapsed;}}
    for(const p of [...blooms,...waves]){p.age+=elapsed;p.y+=ground;}
    motes=motes.filter(p=>p.age<p.life);blooms=blooms.filter(p=>p.age<p.life);waves=waves.filter(p=>p.age<p.life);
  }
  function draw(ctx,width,height){
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const p of motes){
      const fade=Math.min(1,p.age/.3,(p.life-p.age)/.8),pulse=reduced?1:.65+.35*Math.sin(p.phase+p.age*5)**2;
      const x=p.x*width+(reduced?0:Math.sin(p.phase+p.age*3)*8),y=p.y*height;
      const light=ctx.createRadialGradient(x,y,0,x,y,13);light.addColorStop(0,`rgba(238,255,167,${fade*pulse*.75})`);light.addColorStop(.18,`rgba(159,255,177,${fade*.52})`);light.addColorStop(1,'rgba(96,235,161,0)');
      ctx.fillStyle=light;ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.fill();
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
  return {answer,step,draw,reset,snapshot:()=>({motes:motes.length,blooms:blooms.length,waves:waves.length,lastKind,count})};
}
