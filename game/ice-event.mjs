export const ICE_TIMING={lock:3,visit:8,melt:5,cooldown:32,firstVisit:8};
// Inflate actual world geometry by the sprite's conservative footprint.
export function icePointClear(p,obstacles,w,h,r=39){
  if(p.x<r||p.x>w-r||p.y<r||p.y>h-r)return false;
  return !obstacles.some(o=>o.w!=null?p.x>o.x-r&&p.x<o.x+o.w+r&&p.y>o.y-r&&p.y<o.y+o.h+r:Math.hypot(p.x-o.x,p.y-o.y)<r+(o.r||35));
}
export function iceSegmentClear(a,b,obstacles,w,h){
  const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/6));
  for(let i=0;i<=steps;i++)if(!icePointClear({x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps},obstacles,w,h))return false;
  return true;
}
export function createIceEvent({width,height,player,image,obstacles=()=>[],notify=()=>{},random=Math.random}){
 let trap=null,age=-1,cooldown=ICE_TIMING.firstVisit,sable=null,tracks=[],cracks=[],clock=0,target=null;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const frozen=()=>age>=0&&age<ICE_TIMING.lock;
 function freePoint(){const w=width(),h=height(),obs=obstacles();for(let i=0;i<100;i++){const p={x:42+random()*Math.max(1,w-84),y:65+random()*Math.max(1,h-110)};if(icePointClear(p,obs,w,h))return p;}return null;}
 function reset(){trap=null;age=-1;cooldown=ICE_TIMING.firstVisit;sable=null;tracks=[];cracks=[];target=null;}
 function activate(){if(age>=0)return false;trap=null;age=0;cooldown=ICE_TIMING.cooldown+random()*20;sable=freePoint();if(sable)sable.a=-Math.PI/2;target=null;tracks=[];
 cracks=Array.from({length:28},()=>({x:random()*width(),y:random()*height(),a:random()*Math.PI*2,len:20+random()*65,seed:random()*8}));
 const p=player();p.tx=p.x;p.ty=p.y;notify('❄ ЗАМОРOЗКА · 3 секунды без управления');return true;}
 function placeTrap(digits){if(trap||age>=0||digits.length<2)return false;
 for(let i=0;i<30;i++){const a=digits[i%digits.length],b=digits[(i+1)%digits.length];const p={x:clamp((a.x+b.x)/2+(random()-.5)*55,30,width()-30),y:clamp((a.y+b.y)/2+(random()-.5)*40,120,height()-35)};
 if(Math.hypot(p.x-player().x,p.y-player().y)>85&&digits.every(d=>Math.hypot(d.x-p.x,d.y-p.y)>43)&&icePointClear(p,obstacles(),width(),height(),20)){trap={...p,life:10};return true;}}return false;}
 function tick(dt,{digits=[],scroll=0}={}){
 clock+=dt;cooldown-=dt;
 if(age<0){if(!digits.length)trap=null;if(cooldown<=0&&!trap){activate();return;}
 if(trap){trap.life-=dt;if(trap.life<=0)trap=null;else if(Math.hypot(trap.x-player().x,trap.y-player().y)<26)activate();}return;}
 const wasFrozen=frozen();age+=dt;if(wasFrozen&&!frozen()){const p=player();p.tx=p.x;p.ty=p.y;notify('Лёд отпускает · управление восстановлено');}
 for(const line of tracks){line.y+=scroll;line.life-=dt;}tracks=tracks.filter(l=>l.life>0).slice(-360);
 for(const c of cracks)c.y=(c.y+scroll+height())%height();
 if(sable&&age<ICE_TIMING.visit){
 const obs=obstacles(),w=width(),h=height();
 // Try steering alternatives; validate swept motion, never jump through a wall.
 if(!target||Math.hypot(target.x-sable.x,target.y-sable.y)<22)target=freePoint();
 if(age>ICE_TIMING.visit-2){target={x:sable.x<width()/2?40:width()-40,y:height()-42};}
 const desired=target?Math.atan2(target.y-sable.y,target.x-sable.x):sable.a;
 const turn=Math.atan2(Math.sin(desired-sable.a),Math.cos(desired-sable.a));
 const heading=sable.a+clamp(turn,-dt*2.6,dt*2.6),speed=65+15*Math.sin(age*2);
 let moved=false;
 for(const offset of [0,.3,-.3,.65,-.65,1.2,-1.2,Math.PI]){const a=heading+offset,p={x:sable.x+Math.cos(a)*speed*dt,y:sable.y+Math.sin(a)*speed*dt};
 if(iceSegmentClear(sable,p,obs,w,h)){sable.x=p.x;sable.y=p.y;sable.a=a;moved=true;break;}}
 if(!moved)target=null;
 if(moved){for(const side of [-1,1]){const along=-17,lateral=side*9;tracks.push({x:sable.x+Math.cos(sable.a)*along-Math.sin(sable.a)*lateral,y:sable.y+Math.sin(sable.a)*along+Math.cos(sable.a)*lateral,a:sable.a,side,life:5});}}
 }
 tracks=tracks.slice(-360);
 if(age>=ICE_TIMING.visit+ICE_TIMING.melt){age=-1;sable=null;tracks=[];cracks=[];}
 }
 function drawGround(ctx){if(age<0)return;const melt=clamp((age-ICE_TIMING.visit)/ICE_TIMING.melt,0,1),opacity=Math.min(1,age/.65)*(1-melt),w=width(),h=height();ctx.save();ctx.fillStyle=`rgba(218,242,249,${opacity*.32})`;ctx.fillRect(0,0,w,h);
 for(const c of cracks){const r=55+c.len;const gr=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,r);gr.addColorStop(0,`rgba(234,252,255,${opacity*.15})`);gr.addColorStop(1,'rgba(210,245,255,0)');ctx.fillStyle=gr;ctx.fillRect(c.x-r,c.y-r,r*2,r*2);
 if(melt>0){const vy=c.y-melt*45,vx=c.x+Math.sin(clock+c.seed)*15,vapor=ctx.createRadialGradient(vx,vy,0,vx,vy,35);vapor.addColorStop(0,`rgba(227,252,255,${Math.sin(melt*Math.PI)*.12})`);vapor.addColorStop(1,'rgba(227,252,255,0)');ctx.fillStyle=vapor;ctx.fillRect(vx-35,vy-35,70,70);}
 if(age>ICE_TIMING.lock){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);ctx.strokeStyle=`rgba(68,131,157,${opacity*(.1+melt*.6)})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(c.len*.4,7);ctx.lineTo(c.len*.65,-4);ctx.lineTo(c.len,3);ctx.moveTo(c.len*.4,7);ctx.lineTo(c.len*.5,23);ctx.stroke();ctx.restore();}}
 ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineWidth=1.05;
 for(const side of [-1,1]){const rail=tracks.filter(track=>track.side===side);for(let i=1;i<rail.length;i++){const a=rail[i-1],b=rail[i];if(Math.hypot(a.x-b.x,a.y-b.y)>24)continue;const alpha=Math.min(1,a.life/1.3,b.life/1.3)*opacity*.66;ctx.strokeStyle=`rgba(226,253,255,${alpha})`;ctx.shadowColor='#bcefff';ctx.shadowBlur=4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2+Math.sin(a.a)*1.5,(a.y+b.y)/2-Math.cos(a.a)*1.5,b.x,b.y);ctx.stroke();}}
 ctx.shadowBlur=0;ctx.globalCompositeOperation='source-over';ctx.restore();}
 function drawActors(ctx){ctx.save();if(trap){ctx.translate(trap.x,trap.y);ctx.rotate(Math.sin(clock)*.12);ctx.fillStyle='#9de2f9aa';ctx.strokeStyle='#efffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(-18,-18,36,36,6);ctx.fill();ctx.stroke();for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-12);ctx.moveTo(-4,-8);ctx.lineTo(0,-5);ctx.lineTo(4,-8);ctx.stroke();ctx.restore();}ctx.restore();return;}
 if(sable&&age>=0){ctx.translate(sable.x,sable.y);ctx.rotate(sable.a+Math.PI/2);ctx.globalAlpha=Math.min(1,age/.4)*clamp(1-(age-ICE_TIMING.visit)/.9,0,1);if(image?.complete&&image.naturalWidth)ctx.drawImage(image,-28,-42,56,84);}ctx.restore();}
 function drawHud(ctx){if(!frozen())return;const p=player();ctx.save();ctx.translate(p.x,p.y);ctx.strokeStyle='#c0f3ff';ctx.fillStyle='#a4e6ff35';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<6;i++){let a=i*Math.PI/3;ctx.lineTo(Math.cos(a)*30,Math.sin(a)*30);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ecfcff';ctx.textAlign='center';ctx.font='bold 13px system-ui';ctx.fillText(`❄ ${Math.max(1,Math.ceil(ICE_TIMING.lock-age))} с`,0,-39);ctx.restore();}
 return {reset,tick,activate,placeTrap,drawGround,drawActors,drawHud,get frozen(){return frozen();},snapshot:()=>({trap,age,cooldown,sable,tracks,cracks})};
}
