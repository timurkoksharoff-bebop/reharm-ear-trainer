export function pressure(sector,combo,health){return Math.max(0,Math.min(3,sector+(combo>=4?1:0)-(health<=2?1:0)));}
export function formation(index,width,difficulty=0){
  const side=index%2?1:-1,center=width/2+side*70;
  return Array.from({length:4+difficulty},(_,i)=>({
    x:Math.max(35,Math.min(width-35,center+(i-2)*43)),y:-35-i*31,
    baseX:center+(i-2)*43,phase:i*.6,age:0,speed:65+difficulty*9,
    hp:difficulty>1?2:1,hit:0,fire:3.2+i*.4,pattern:index%3,
  }));
}
export function stepDrone(drone,dt,width){
  drone.age+=dt;drone.y+=drone.speed*dt;drone.hit=Math.max(0,drone.hit-dt);
  const sway=drone.pattern===0?Math.sin(drone.age*1.4+drone.phase)*48:
    drone.pattern===1?Math.sin(drone.age*.65)*100:Math.cos(drone.age+drone.phase)*25;
  drone.x=Math.max(22,Math.min(width-22,drone.baseX+sway));
  drone.fire-=dt;
}
export const hitCircle=(a,b,radius)=>Math.hypot(a.x-b.x,a.y-b.y)<radius;
