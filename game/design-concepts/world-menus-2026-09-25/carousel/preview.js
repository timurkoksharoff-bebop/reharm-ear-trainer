// Add future worlds here. Navigation wraps through the catalog; three nearest
// worlds remain visible regardless of catalog length.
const worlds=[
 {id:'scorched',name:'Выжженная планета',category:'01 / ИСПЫТАНИЕ ОГНЁМ',description:'Джаз · импульс · выживание',image:'scorched.png',cover:'../../../assets/console-portrait.jpg'},
 {id:'garden',name:'Сад Эха',category:'02 / ЖИВАЯ ГАРМОНИЯ',description:'Речные долины · цветение · ambient',image:'garden.png',cover:'../02-echo-garden-v1.png'},
 {id:'samsara',name:'Сансара',category:'03 / КРУГ ЗВУКА',description:'World music · стихии · пробуждение',image:'samsara.png',cover:'../03-samsara-v1.png'}
];
const root=document.querySelector('#cockpit'),orbit=document.querySelector('#orbit'),markers=document.querySelector('#markers');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let position=1,target=1,selected=-1,drag=null,raf=0,lastTime=0,clock=0;
const mod=(v,n)=>((v%n)+n)%n;
const shortest=(d,n)=>mod(d+n/2,n)-n/2;
const planets=worlds.map((w,i)=>{
 const button=document.createElement('button');button.className='planet';button.setAttribute('aria-label',w.name);button.dataset.world=w.id;
 const img=document.createElement('img');img.src=w.image;img.alt='';img.draggable=false;button.append(img);
 const label=document.createElement('span');label.className='planet-label';label.textContent=w.name;button.append(label);orbit.append(button);
 const marker=document.createElement('button');marker.className='marker';marker.setAttribute('aria-label','Выбрать: '+w.name);marker.onclick=()=>choose(i);markers.append(marker);
 button.addEventListener('click',()=>{if(performance.now()<suppressClickUntil)return;choose(i)});
 return {button,label,marker};
});
let suppressClickUntil=0;
function choose(index){target+=shortest(index-mod(target,worlds.length),worlds.length);target=Math.round(target);wake()}
function step(delta){target=Math.round(target)+delta;wake()}
document.querySelector('#previous').onclick=()=>step(-1);
document.querySelector('#next').onclick=()=>step(1);
root.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1)}});
orbit.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,start:position,moved:false,planet:e.target.closest('.planet')?.dataset.world};target=position;orbit.setPointerCapture(e.pointerId);orbit.classList.add('dragging')});
orbit.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x;drag.moved ||= Math.abs(dx)>7;position=drag.start-dx/(root.clientWidth*.65);target=position;wake()});
function release(e){if(!drag||drag.id!==e.pointerId)return;const wasMoved=drag.moved,start=drag.start,planet=drag.planet;drag=null;orbit.classList.remove('dragging');suppressClickUntil=performance.now()+250;if(wasMoved){const delta=position-start;target=Math.round(Math.abs(delta)>.12?start+Math.sign(delta)*Math.max(1,Math.round(Math.abs(delta))):start)}else{target=Math.round(position);if(planet&&e.type==='pointerup')choose(worlds.findIndex(w=>w.id===planet))}wake()}
orbit.addEventListener('pointerup',release);orbit.addEventListener('pointercancel',release);orbit.addEventListener('lostpointercapture',release);
const canvas=document.querySelector('#debris'),ctx=canvas.getContext('2d');let width=0,height=0;
new ResizeObserver(()=>{width=root.clientWidth;height=root.clientHeight;const dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);wake()}).observe(root);
const rocks=Array.from({length:19},(_,i)=>({angle:i*2.39996,rate:.012+(i%5)*.003,radius:.41+(i%4)*.025,size:.65+(i%3)*.48,tilt:(i%5-2)*.07}));
function drawRocks(){ctx.clearRect(0,0,width,height);rocks.forEach((r,i)=>{const a=r.angle+clock*r.rate,x=width*.5+Math.cos(a)*width*r.radius,y=height*.51+Math.sin(a)*height*.175+r.tilt*height;const front=Math.sin(a)>0;ctx.save();ctx.translate(x,y);ctx.rotate(a*.6);const size=r.size*width/420*(front?1.2:.7);ctx.globalAlpha=front?.65:.32;ctx.fillStyle=i%3===0?'#9f927b':'#777d7d';ctx.beginPath();for(let j=0;j<6;j++){const angle=j*Math.PI/3,rr=size*(j%2?.73:1);j?ctx.lineTo(Math.cos(angle)*rr,Math.sin(angle)*rr):ctx.moveTo(Math.cos(angle)*rr,Math.sin(angle)*rr)}ctx.closePath();ctx.fill();ctx.strokeStyle='#d9c6a16b';ctx.lineWidth=.35;ctx.stroke();ctx.restore()})}
function paint(){
 const w=width||root.clientWidth,h=height||root.clientHeight;
 planets.forEach((p,i)=>{const d=shortest(i-position,worlds.length),visible=Math.abs(d)<1.5;const angle=d*2*Math.PI/3,depth=(1+Math.cos(angle))/2;const scale=.32+.68*depth,x=w*(.5+Math.sin(angle)*.335),y=h*(.418+Math.cos(angle)*.116);p.button.hidden=!visible;p.button.style.transform=`translate(${x-w*.33}px,${y-w*.33}px) scale(${scale})`;p.button.style.zIndex=String(Math.round(depth*100)+1);p.button.style.filter=`brightness(${.69+.31*depth})`;p.label.style.opacity=String(Math.max(0,1-depth*1.35));});
 const index=mod(Math.round(position),worlds.length);if(index!==selected){selected=index;const w=worlds[index];document.querySelector('#name').textContent=w.name;document.querySelector('#category').textContent=w.category;document.querySelector('#description').textContent=w.description;planets.forEach((p,i)=>{p.marker.setAttribute('aria-current',String(i===index));p.button.setAttribute('aria-pressed',String(i===index))})}drawRocks();
}
function frame(t){raf=0;const dt=Math.min(.05,(t-(lastTime||t))/1000);lastTime=t;if(!reduced.matches)clock+=dt;if(!drag){position=reduced.matches?target:position+(target-position)*(1-Math.exp(-dt*9));if(Math.abs(position-target)<.0002)position=target}paint();if(!document.hidden&&(!reduced.matches||position!==target))raf=requestAnimationFrame(frame)}
function wake(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame)}
document.addEventListener('visibilitychange',()=>{lastTime=0;if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()});
reduced.addEventListener('change',wake);
const cover=document.querySelector('#cover');document.querySelector('#enter').onclick=()=>{document.querySelector('#cover-image').src=worlds[selected].cover;cover.showModal()};document.querySelector('#close-cover').onclick=()=>cover.close();
wake();
document.querySelectorAll('[data-theme]').forEach(button=>button.onclick=()=>{root.classList.toggle('observatory',button.dataset.theme==='observatory');document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))});
