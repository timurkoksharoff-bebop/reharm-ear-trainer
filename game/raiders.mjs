// Runtime sprite regions use the approved sheet without modifying its artwork.
export function createRaiders({image,width,height,player,hurt,drops,notify}){
 let units=[],needles=[],mist=[],time=0,spawn=2,serial=0,exposure=0;
 const colors=['70,235,167','161,94,241','55,199,235'];
 const angle=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
 function reset(){units=[];needles=[];mist=[];spawn=2;exposure=0;}
 function hit(b){for(const u of units)if(u.hp>0&&Math.hypot(b.x-u.x,b.y-u.y)<25){u.hp--;u.dodge=.7;if(u.hp<=0&&u.loot){drops().push({...u.loot,x:u.x,y:u.y,age:0});u.loot=null;notify('Ворона сбита · артефакт возвращён');}return true;}return false;}
 function tick(dt){time+=dt;spawn-=dt;const p=player();if(spawn<=0&&units.length<4){const kind=serial++%3;units.push({kind,x:60+(serial*113)%(width()-120),y:70,hp:kind===0?18:12,age:0,fire:1.5,a:Math.PI/2,trail:[],dodge:0});spawn=6;}
 for(const u of units){u.age+=dt;u.dodge=Math.max(0,u.dodge-dt);let aim={x:width()/2+Math.sin(u.age*.9+u.kind)*width()*.34,y:height()*.35+Math.sin(u.age*.6)*60};
 if(u.kind===1){const loot=drops().find(d=>d.age<20);if(u.loot)aim={x:u.x,y:-100};else if(loot){aim=loot;if(Math.hypot(loot.x-u.x,loot.y-u.y)<28){u.loot={...loot};loot.age=99;notify('Ворона украла артефакт — сбей её!');}}else aim=p;}
 let wanted=angle(u,aim)+(u.dodge?Math.sin(time*12)*.9:0);u.a+=Math.atan2(Math.sin(wanted-u.a),Math.cos(wanted-u.a))*Math.min(1,dt*3);let speed=u.kind===1?80+55*Math.sin(u.age*2):u.kind===0?40:58;u.x+=Math.cos(u.a)*speed*dt;u.y+=Math.sin(u.a)*speed*dt;
 if(u.kind===2){u.trail.push({x:u.x,y:u.y,a:u.a,t:time});u.trail=u.trail.filter(v=>time-v.t<7).slice(-180);}
 u.fire-=dt;if(u.fire<=0&&!u.loot){u.fire=u.kind===0?1.7:2.2;let a=angle(u,p);for(let i=-1;i<=1;i++)needles.push({x:u.x,y:u.y,a:a+i*.2,life:3,kind:u.kind,color:colors[(serial+i+3)%3],trail:0});}
 }
 for(const n of needles){n.life-=dt;n.x+=Math.cos(n.a)*dt*145;n.y+=Math.sin(n.a)*dt*145;n.trail-=dt;if(n.kind===0&&n.trail<=0){n.trail=.14;mist.push({x:n.x,y:n.y,life:3.5,color:n.color,phase:time*3});}if(n.life>0&&Math.hypot(n.x-p.x,n.y-p.y)<15){n.life=0;hurt();}}
 let inside=false;for(const m of mist){m.life-=dt;m.x+=Math.sin(time+m.phase)*dt*8;m.y+=dt*9;if(Math.hypot(m.x-p.x,m.y-p.y)<18+(3.5-m.life)*7)inside=true;}
 exposure=inside?exposure+dt:0;if(exposure>=1.8){hurt();exposure=0;}
 units=units.filter(u=>u.hp>0&&u.y>-80&&u.y<height()+90);needles=needles.filter(n=>n.life>0);mist=mist.filter(m=>m.life>0).slice(-120);
 }
 function draw(ctx){ctx.save();for(const m of mist){let r=16+(3.5-m.life)*9,gr=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,r);gr.addColorStop(0,`rgba(${m.color},${m.life/3.5*.22})`);gr.addColorStop(1,`rgba(${m.color},0)`);ctx.fillStyle=gr;ctx.fillRect(m.x-r,m.y-r,r*2,r*2);}
 for(const u of units){if(u.trail.length>8){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';const visible=u.trail.slice(0,-7);for(const side of [-1,1]){for(let i=1;i<visible.length;i++){const a=visible[i-1],b=visible[i],age=time-b.t;if(Math.hypot(a.x-b.x,a.y-b.y)>18)continue;const alpha=Math.max(0,1-age/7)*.62,offset=side*2.2;ctx.strokeStyle=`rgba(${side<0?'80,226,255':'151,115,255'},${alpha})`;ctx.lineWidth=.55;ctx.shadowColor=side<0?'#4beaff':'#a77cff';ctx.shadowBlur=3;ctx.beginPath();ctx.moveTo(a.x-Math.sin(a.a)*offset,a.y+Math.cos(a.a)*offset);ctx.lineTo(b.x-Math.sin(b.a)*offset,b.y+Math.cos(b.a)*offset);ctx.stroke();}for(let i=8;i<visible.length;i+=13){const p=visible[i],alpha=Math.max(0,1-(time-p.t)/7)*.7;ctx.fillStyle=`rgba(211,250,255,${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,.75,0,Math.PI*2);ctx.fill();}}ctx.restore();}
 if(!image.complete||!image.naturalWidth)continue;ctx.save();ctx.translate(u.x,u.y);ctx.rotate(u.a+Math.PI/2);const rect=u.kind===0?[115,585,465,650]:u.kind===2?[598,590,655,650]:Math.sin(u.age*2)>0?[780,0,410,585]:[0,0,780,585];const k=image.naturalWidth/1254;const dw=74*rect[2]/rect[3];ctx.drawImage(image,...rect.map(v=>v*k),-dw/2,-37,dw,74);if(u.loot){ctx.fillStyle='#ffe69a';ctx.fillRect(-6,22,12,12);}ctx.restore();}
 for(const n of needles){ctx.save();ctx.translate(n.x,n.y);ctx.rotate(n.a);ctx.strokeStyle=n.kind===0?`rgb(${n.color})`:'#f9cf81';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(7,0);ctx.stroke();ctx.restore();}ctx.restore();}
 return {tick,draw,hit,reset,snapshot:()=>({units,needles,mist})};
}
