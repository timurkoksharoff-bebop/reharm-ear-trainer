// An isolated journey-map study. It does not read or change game/player storage.
const $=id=>document.getElementById(id);
const canvas=$('cosmos'),ctx=canvas.getContext('2d',{alpha:false});
// The stationary DOM axis is at depth zero, between the two canvas passes.
const foreground=$('cosmos-foreground'),frontCtx=foreground.getContext('2d');
const colours=['#f27578','#edb164','#e7d388','#8ed7b1','#91d4de','#9cacf0','#cea7e7'];
const skills=['Корни и бас','Аккорды и обороты','Надстройки','Гармонический слух','Будущая награда V','Будущая награда VI','Будущая награда VII'];
const worlds=[
 {name:'Anime',level:1,phase:2.32,radius:.97,size:29,colour:[121,155,217],kind:'rock',earned:true,progress:'Мандала собрана · 12 из 12 маршрутов',desc:'Мир мелодий и историй. Пройденные маршруты складываются в твою мандалу.',art:'mandala-anime.webp'},
 {name:'Ambient',level:3,phase:-.56,radius:1.03,size:35,colour:[79,151,159],kind:'gas',progress:'4 из 16 маршрутов · путь продолжается',desc:'Пространство медленных гармоний. У каждого маршрута здесь своё место на орбите.',art:'mandala-ambient.webp'},
 {name:'Cinematic',level:2,phase:.52,radius:1.04,size:34,colour:[194,149,98],kind:'gas',progress:'7 из 18 маршрутов · путь продолжается',desc:'Большие гармонические истории. Пройденные главы становятся спутниками этого мира.',art:'mandala-cinematic.webp'},
 {name:'Reharm',level:4,phase:3.26,radius:.89,size:24,colour:[131,116,181],kind:'rock',progress:'3 из 24 маршрутов · путь продолжается',desc:'Перегармонизации, новые связи и знакомые мелодии в другом свете.'},
 {name:'Jazz',level:0,phase:-.44,radius:1.06,size:31,colour:[187,131,83],kind:'rock',progress:'6 из 20 маршрутов · путь продолжается',desc:'Стандарты, обороты и движение голосов. Каждый полёт расширяет знакомую территорию.'},
 {name:'Chill',level:1,phase:-1.07,radius:.76,size:20,colour:[112,172,157],kind:'gas',earned:true,progress:'Мандала собрана · 8 из 8 маршрутов',desc:'Тёплый пульс и спокойные полёты. Ещё один мир в твоей коллекции.'},
 {name:'Drum & Bass',level:5,phase:1.04,radius:1.12,size:26,colour:[99,138,187],kind:'gas',progress:'Будущий мир · ещё не открыт',desc:'Эскиз нового музыкального направления. На карте можно добавлять новые миры, сохраняя найденные маршруты.'},
 {name:'Новые миры',level:6,phase:2.6,radius:.82,size:21,colour:[167,123,189],kind:'rock',progress:'Место для будущих путешествий',desc:'Карта может расти вместе с музыкой: новые мандалы, направления и отдельные коллекции.'}
];
let w=1,h=1,dpr=1,centres=[],background,stars=[],hits=[],labels=[],yaw=.15,tilt=.5,zoom=.87,velocity=0,last=0,raf=0,dirty=true,hover=-1,selected=-1;
let auto=!matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointers=new Map();let down=null,dragged=false,pinchDistance=0,pinchZoom=1,returnFocus=null;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const embedded=new URLSearchParams(location.search).has('embedded');
if(!embedded){location.replace('../?journey=1');throw Error('Opening the journey map in EAR YOGA');}
const runtime=await new Promise(resolve=>{const receive=event=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='ear-yoga-journey-data')return;removeEventListener('message',receive);resolve(event.data.data);};addEventListener('message',receive);parent.postMessage({type:'ear-yoga-journey',action:'ready'},location.origin);});
const sendHost=(action,extra={})=>parent.postMessage({type:'ear-yoga-journey',action,...extra},location.origin);
const presets=[...worlds];worlds.splice(0,worlds.length,...runtime.groups.map((g,i)=>{
 const preset=g.id==='favorites'?{...presets[0],colour:[205,118,151],kind:'rock',phase:1.8,size:29}:presets.find(p=>p.name.toLowerCase()===g.name.toLowerCase())||presets[i%7],routes=g.routes.map(r=>({...r})),rated=routes.filter(r=>r.rating>0),done=routes.filter(r=>r.completed).length;
 return {...preset,name:g.name,tour:g.id,level:i%7,phase:preset.phase+(i>6?i*.8:0),colour:[...preset.colour],art:g.image,routes,done,percent:routes.length?Math.round(done/routes.length*100):0,average:rated.length?rated.reduce((n,r)=>n+r.rating,0)/rated.length:0,earned:routes.length>0&&done===routes.length,desc:runtime.language==='en'?'Choose a random flight or a specific route.':'Случайный полёт или конкретная последовательность — выбери своё путешествие.'};
}));
skills.splice(0,skills.length,...runtime.rankNames);
$('worlds-toggle').querySelector('span').textContent=String(worlds.length).padStart(2,'0');
$('departure-mode').value=runtime.difficulty;$('departure-mode').closest('.mode-row').hidden=true;
document.querySelector('.prototype-note').textContent='v'+runtime.version;
for(const a of document.querySelectorAll('.universe-header a'))a.addEventListener('click',event=>{event.preventDefault();sendHost(a.classList.contains('back')?'achievements':'close');});

const starMarkup=(value,caption='')=>`<span class="five-stars" aria-label="${caption}${value.toFixed(1)} из 5"><span>★★★★★</span><b style="width:${value*20}%">★★★★★</b></span>`;
let routeIndex=0,activeRoutes=[],deckStart=null,suppressDeckClick=false;
function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
const random=rng(48119),dust=Array.from({length:7},()=>Array.from({length:80},()=>({angle:random()*Math.PI*2,offset:(random()-.5)*.035,size:random()*.8+.25,glow:random()})));
function symbol(i){
 const middle=['<rect x="27" y="27" width="46" height="46"/><path d="M31 34H69L50 68Z"/>','<path d="M30 31A29 29 0 1 0 70 31A22 22 0 0 1 30 31Z"/>','<path d="M24 30H76L50 75Z"/>','<path d="M50 22L75 65H25ZM50 78L25 35H75Z"/>','<path d="M25 30H75L50 74Z"/><circle cx="50" cy="47" r="12"/>','<path d="M15 50Q50 14 85 50Q50 86 15 50Z"/><circle cx="50" cy="50" r="12"/>','<path d="M50 73C20 70 25 41 32 32Q44 40 50 57Q56 40 68 32C75 41 80 70 50 73ZM50 57Q35 33 50 19Q65 33 50 57Z"/>'][i];
 return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42"/>${middle}</svg>`;
}
$('core-axis').innerHTML=skills.map((name,i)=>`<button class="core-node ${runtime.earned[i]?'opened':'unopened'}" style="--tone:${colours[i]}" data-core="${i}" aria-label="Награда: ${name}">${symbol(i)}<small>${name}</small></button>`).join('');
for(const b of document.querySelectorAll('[data-core]'))b.addEventListener('click',()=>openSkill(Number(b.dataset.core),b));
$('world-list').innerHTML=worlds.map((v,i)=>`<button data-world="${i}">${v.name}<small>${v.routes.length?v.percent+'% · '+(v.average?v.average.toFixed(1)+'/5':'—'):'Впереди'}</small></button>`).join('');
for(const b of document.querySelectorAll('[data-world]'))b.addEventListener('click',()=>{openWorld(Number(b.dataset.world),b);$('world-list').hidden=true;$('worlds-toggle').setAttribute('aria-expanded','false');});
for(const v of worlds){const label=document.createElement('div');label.className='planet-label';label.innerHTML=`<strong data-user-content>${v.name}</strong><span class="planet-stats">${v.routes.length?`<em>${v.percent}%</em> · ${starMarkup(v.average)} <small>${v.average?v.average.toFixed(1).replace('.',','):'—'}</small>`:v.tour==='favorites'?'♡ · 0':'Будущий мир'}</span>`;$('planet-labels').append(label);labels.push(label);}

// Cached, shaded sphere textures. Geometry, lights, orbital positions and depth
// are rendered in real time; the actual player's mandalas are separate images.
function makePlanet(v){
 const c=document.createElement('canvas');c.width=c.height=224;const g=c.getContext('2d'),pixels=g.createImageData(224,224),a=pixels.data;
 for(let py=0;py<224;py++)for(let px=0;px<224;px++){
  const x=(px-111.5)/106,y=(py-111.5)/106,r2=x*x+y*y;if(r2>1)continue;
  const z=Math.sqrt(1-r2),lon=Math.atan2(x,z),lat=Math.asin(y),noise=Math.sin(lon*16+Math.sin(lat*19)*2)+.46*Math.sin(lon*37-lat*29)+.21*Math.sin(lon*81+lat*57);
  let pattern=v.kind==='gas'?.72+.22*Math.sin(lat*29+Math.sin(lon*7+lat*8)*.8)+.08*noise:.7+.2*Math.sin(lon*11+Math.cos(lat*12)*2+noise)+.12*noise;
  if(v.kind==='rock'&&pattern>.86)pattern+=.17;
  const light=Math.max(.025,x*-.47+y*-.43+z*.76),shine=Math.pow(Math.max(0,x*-.46+y*-.53+z*.72),35)*.25;
  const rim=Math.pow(1-z,3)*.19,index=(py*224+px)*4;
  for(let k=0;k<3;k++)a[index+k]=clamp(v.colour[k]*pattern*(light*.95+.075)+shine*195+rim*[40,110,165][k],0,255);
  a[index+3]=Math.min(255,(1-r2)*2600);
 }
 g.putImageData(pixels,0,0);return c;
}
worlds.forEach(v=>{v.texture=makePlanet(v);});
function createBackdrop(){
 background=document.createElement('canvas');background.width=Math.ceil(w+100);background.height=Math.ceil(h+100);const g=background.getContext('2d'),rand=rng(74121),bw=background.width,bh=background.height;
 g.fillStyle='#020810';g.fillRect(0,0,bw,bh);
 for(let i=0;i<35;i++){
  const y=rand()*bh,x=bw*(.36+.15*Math.sin(y/bh*5))+((rand()+rand())/2-.5)*bw*.65,r=bw*(.15+rand()*.3),grad=g.createRadialGradient(x,y,0,x,y,r);
  grad.addColorStop(0,i%3?'rgba(22,52,77,.14)':'rgba(59,32,77,.13)');grad.addColorStop(1,'transparent');g.fillStyle=grad;g.fillRect(x-r,y-r,r*2,r*2);
 }
 for(let i=0;i<4300;i++){
  const y=rand()*bh,x=i<2700?bw*(.38+.18*Math.sin(y/bh*5))+(rand()+rand()+rand()-1.5)*bw*.16:rand()*bw;
  const alpha=.05+Math.pow(rand(),3)*.8,size=rand()<.012?1.2:rand()*.65+.12;
  g.fillStyle=`rgba(${i%3?170:235},${i%3?196:216},${i%3?219:167},${alpha})`;g.beginPath();g.arc(x,y,size,0,Math.PI*2);g.fill();
 }
 stars=Array.from({length:42},()=>({x:rand()*w,y:rand()*h,size:rand()*1.15+.4,depth:rand()*2+.5,alpha:rand()*.45+.12}));
}
function resize(){
 w=innerWidth;h=innerHeight;dpr=Math.min(1.75,devicePixelRatio||1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 foreground.width=canvas.width;foreground.height=canvas.height;frontCtx.setTransform(dpr,0,0,dpr,0,0);
 centres=[...document.querySelectorAll('[data-core]')].map(e=>{const b=e.getBoundingClientRect();return b.top+b.height/2;});createBackdrop();wake();
}
function ringRadius(level){return w*(w<700?.365:.31)*(1+.12*Math.sin(level*.92));}
function project(x,z,cy){
 const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=z*Math.cos(yaw)-x*Math.sin(yaw),fov=w*1.4,scale=fov/(fov+zz*Math.cos(tilt));
 return {x:w/2+xx*scale*zoom,y:cy+zz*Math.sin(tilt)*scale*zoom,s:scale*zoom,z:zz};
}
function orbitalPoint(level,angle,radius=1){const r=ringRadius(level)*radius;return project(Math.cos(angle)*r,Math.sin(angle)*r,centres[level]);}
function pathForRing(level,front=false){
 ctx.beginPath();let pen=false;
 for(let j=0;j<=128;j++){const p=orbitalPoint(level,j*Math.PI/64);if(front&&p.z>=0){pen=false;continue;}if(!pen){ctx.moveTo(p.x,p.y);pen=true;}else ctx.lineTo(p.x,p.y);}
 ctx.stroke();
}
function paintRing(level){
 ctx.lineWidth=.65;ctx.strokeStyle='rgba(142,158,161,.14)';pathForRing(level);
 ctx.strokeStyle='rgba(211,190,146,.29)';pathForRing(level,true);
 for(const d of dust[level]){
  const p=orbitalPoint(level,d.angle+level*.23,1+d.offset),front=p.z<0;
  ctx.fillStyle=`rgba(${front?'230,208,163':'110,146,162'},${front?.19+d.glow*.36:.12+d.glow*.15})`;ctx.beginPath();ctx.arc(p.x,p.y,d.size*p.s,0,Math.PI*2);ctx.fill();
 }
}
function paintSphere(g,v,x,y,r,alpha=1){
 g.save();g.globalAlpha=alpha;
 const halo=g.createRadialGradient(x,y,r*.7,x,y,r*1.8);halo.addColorStop(0,'transparent');halo.addColorStop(.5,`rgba(${v.colour.join(',')},.12)`);halo.addColorStop(1,'transparent');g.fillStyle=halo;g.fillRect(x-r*1.8,y-r*1.8,r*3.6,r*3.6);
 g.drawImage(v.texture,x-r*1.056,y-r*1.056,r*2.112,r*2.112);
 if(v.earned){g.strokeStyle='rgba(232,206,148,.7)';g.lineWidth=.6;g.beginPath();g.arc(x,y,r+4,0,Math.PI*2);g.stroke();}
 g.restore();
}
function paintHelix(){
 for(let strand=0;strand<2;strand++){
  ctx.beginPath();for(let i=0;i<=220;i++){const t=i/220,angle=t*Math.PI*5+strand*Math.PI,r=w*(w<700?.105:.065),cy=centres[0]+(centres[6]-centres[0])*t,p=project(Math.cos(angle)*r,Math.sin(angle)*r,cy);if(!i)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
  ctx.strokeStyle=strand?'rgba(94,143,160,.2)':'rgba(213,184,123,.3)';ctx.lineWidth=.8;ctx.stroke();
  for(let i=0;i<90;i++){const t=i/89,angle=t*Math.PI*5+strand*Math.PI,r=w*(w<700?.105:.065),cy=centres[0]+(centres[6]-centres[0])*t,p=project(Math.cos(angle)*r,Math.sin(angle)*r,cy);ctx.fillStyle=`rgba(223,207,165,${p.z<0?.48:.17})`;ctx.beginPath();ctx.arc(p.x,p.y,i%7===0?1:.42,0,Math.PI*2);ctx.fill();}
 }
}
function render(){
 frontCtx.clearRect(0,0,w,h);
 ctx.drawImage(background,-50+Math.sin(yaw*.2)*16,-50+Math.sin(tilt)*8);
 for(let i=0;i<7;i++){const cy=centres[i],radius=Math.min(w*.28,150),rgb=colours[i].match(/\w\w/g).map(v=>parseInt(v,16)),light=ctx.createRadialGradient(w/2,cy,0,w/2,cy,radius);light.addColorStop(0,`rgba(${rgb.join(',')},.07)`);light.addColorStop(.35,`rgba(${rgb.join(',')},.025)`);light.addColorStop(1,'transparent');ctx.fillStyle=light;ctx.fillRect(w/2-radius,cy-radius,radius*2,radius*2);}
 for(const s of stars){const x=(s.x+Math.sin(yaw*.15)*s.depth*12+w)%w,y=s.y+(tilt-.37)*s.depth*5;ctx.fillStyle=`rgba(218,225,219,${s.alpha})`;ctx.beginPath();ctx.arc(x,y,s.size,0,Math.PI*2);ctx.fill();if(s.size>1.25){ctx.strokeStyle=`rgba(222,220,201,${s.alpha*.27})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.moveTo(x,y-5);ctx.lineTo(x,y+5);ctx.stroke();}}
 for(let level=6;level>=0;level--)paintRing(level);paintHelix();
 hits=worlds.map((v,i)=>{const p=orbitalPoint(v.level,v.phase,v.radius),r=v.size*p.s*(w<700?.81:1.12);return {...p,r,i};}).sort((a,b)=>b.z-a.z);
 for(const p of hits){const v=worlds[p.i],behind=p.z>=0,g=behind?ctx:frontCtx,alpha=behind?.65:1;paintSphere(g,v,p.x,p.y,p.r,alpha);
  if(p.i===hover||p.i===selected){g.strokeStyle='rgba(245,222,164,.75)';g.lineWidth=.7;g.beginPath();g.arc(p.x,p.y,p.r+9,0,Math.PI*2);g.stroke();}
 }
 const placed=[];
 for(const p of [...hits].reverse()){
  const v=worlds[p.i],l=labels[p.i],bw=Math.min(145,Math.max(95,v.name.length*(w<700?6.5:8))),bh=w<700?34:39,x=clamp(p.x,bw/2+8,w-bw/2-8),clear=Math.abs(x-w/2)>(w<700?45:64);
  let y=p.y+p.r+12,valid=false;
  if(clear&&p.x>5&&p.x<w-5)for(const candidate of [y,p.y-p.r-bh-12]){const r={x:x-bw/2,y:candidate,w:bw,h:bh};if(r.y<(w<700?140:105)||r.y+bh>h-100)continue;if(placed.some(b=>r.x<b.x+b.w+9&&r.x+r.w+9>b.x&&r.y<b.y+b.h+7&&r.y+r.h+7>b.y))continue;placed.push(r);y=candidate;valid=true;break;}
  l.style.left=x+'px';l.style.top=y+'px';l.style.opacity=valid?(p.z>=0?.48:.97):0;l.style.zIndex=p.z>=0?5:17;l.classList.toggle('selected',p.i===hover||p.i===selected);
 }
}
function frame(time){
 raf=0;if(document.hidden||$('celestial-detail').open)return;
 const dt=Math.min(.07,last?(time-last)/1000:0);if(last&&time-last<30){raf=requestAnimationFrame(frame);return;}last=time;
 if(!pointers.size){if(auto)yaw+=dt*.085;if(Math.abs(velocity)>.001){yaw+=velocity*dt;velocity*=Math.exp(-dt*3.5);}else velocity=0;}
 if(dirty||auto||velocity){render();dirty=false;}
 if(auto||velocity||pointers.size)raf=requestAnimationFrame(frame);
}
function wake(){dirty=true;if(!raf){last=0;raf=requestAnimationFrame(frame);}}
function pick(x,y){return [...hits].reverse().find(p=>Math.hypot(x-p.x,y-p.y)<Math.max(20,p.r+9))?.i??-1;}
function startPointer(e){canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});down={x:e.clientX,y:e.clientY,time:performance.now()};dragged=false;velocity=0;canvas.classList.add('dragging');if(pointers.size===2){const a=[...pointers.values()];pinchDistance=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);pinchZoom=zoom;dragged=true;}wake();}
canvas.addEventListener('pointerdown',startPointer);
// A planet covering a sign must receive the same tap/drag as its visible edge.
// Uncovered signs keep their native buttons, keyboard focus and award action.
$('core-axis').addEventListener('pointerdown',e=>{
 if(hits.some(p=>p.z<0&&Math.hypot(e.clientX-p.x,e.clientY-p.y)<p.r)){
  e.preventDefault();e.stopPropagation();startPointer(e);
 }
},true);
canvas.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId)){const hit=pick(e.clientX,e.clientY);if(hit!==hover){hover=hit;canvas.style.cursor=hit<0?'grab':'pointer';wake();}return;}
 const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===2){const a=[...pointers.values()];zoom=clamp(pinchZoom*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/Math.max(1,pinchDistance),.48,1.38);dragged=true;}
 else{const dx=e.clientX-old.x,dy=e.clientY-old.y;if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>4)dragged=true;yaw-=dx*.006;tilt=clamp(tilt-dy*.0015,-.25,1.3);velocity=clamp(-dx*.06,-2.5,2.5);}
 wake();
});
function endPointer(e){const wasDown=pointers.has(e.pointerId);pointers.delete(e.pointerId);canvas.classList.remove('dragging');if(wasDown&&!dragged&&e.type==='pointerup'){const i=pick(e.clientX,e.clientY);if(i>=0)openWorld(i,canvas);}if(!pointers.size)down=null;wake();}
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',e=>{dragged=true;endPointer(e);});
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=clamp(zoom-e.deltaY*.0007,.48,1.38);wake();},{passive:false});
function rotate(amount){yaw+=amount;velocity=0;wake();}
$('rotate-left').onclick=()=>rotate(.4);$('rotate-right').onclick=()=>rotate(-.4);
$('zoom-in').onclick=()=>{zoom=clamp(zoom+.12,.48,1.38);wake();};$('zoom-out').onclick=()=>{zoom=clamp(zoom-.12,.48,1.38);wake();};
$('top-view').onclick=()=>{const top=$('top-view').getAttribute('aria-pressed')!=='true';$('top-view').setAttribute('aria-pressed',String(top));tilt=top?1.05:.5;zoom=top?.74:.87;wake();};
function syncSpin(){$('spin-toggle').textContent=auto?'Пауза':'Вращать';$('spin-toggle').setAttribute('aria-pressed',String(auto));localize();}
$('spin-toggle').onclick=()=>{auto=!auto;velocity=0;syncSpin();wake();};
$('reset-camera').onclick=()=>{yaw=.15;tilt=.5;zoom=.87;velocity=0;$('top-view').setAttribute('aria-pressed','false');wake();};
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')rotate(.3);if(e.key==='ArrowRight')rotate(-.3);if(e.key==='+'||e.key==='=')$('zoom-in').click();if(e.key==='-')$('zoom-out').click();if(e.key==='ArrowUp'||e.key==='ArrowDown'){tilt=clamp(tilt+(e.key==='ArrowUp'?.06:-.06),-.25,1.3);wake();}if(e.key===' ')$('spin-toggle').click();});
$('worlds-toggle').onclick=()=>{$('world-list').hidden=!$('world-list').hidden;$('worlds-toggle').setAttribute('aria-expanded',String(!$('world-list').hidden));};
function showDetail(focus){localize();returnFocus=focus;$('celestial-detail').showModal();}
function openWorld(i,focus){
 selected=i;const v=worlds[i];$('celestial-detail').classList.add('route-detail');$('detail-planet').hidden=false;$('detail-medal').hidden=true;$('detail-eyebrow').textContent='КАРТА ПУТЕШЕСТВИЙ';$('detail-title').textContent=v.name;$('detail-description').textContent=v.desc;
 $('detail-progress').innerHTML=`<strong>${v.percent}%</strong> · ${v.done} / ${v.routes.length} маршрутов<br>${starMarkup(v.average,'Среднее: ')} <span>${v.average?v.average.toFixed(1).replace('.',',')+' / 5':'Пока без оценки'}</span><br><small>Среднее лучших результатов пройденных маршрутов</small>`;
 if(v.tour==='favorites'&&!v.routes.length)$('detail-progress').textContent=runtime.language==='en'?'Tap ♡ beside a route during a flight. Your favorites will appear on this planet.':'Нажми ♡ возле названия маршрута в полёте. Избранные маршруты появятся на этой планете.';
 activeRoutes=v.routes;routeIndex=0;$('manual-routes').hidden=true;$('route-manual').setAttribute('aria-expanded','false');$('route-selector').hidden=!activeRoutes.length;renderDeck();
 const g=$('detail-planet').getContext('2d');g.clearRect(0,0,420,300);paintSphere(g,v,210,144,94);if(v.art){const image=new Image();image.onload=()=>{if(selected===i&&$('celestial-detail').open){g.globalAlpha=.95;g.drawImage(image,304,192,69,69);g.globalAlpha=1;}};image.src=v.art;}
 showDetail(focus);
}
function openSkill(i,focus){
 $('celestial-detail').classList.remove('route-detail');$('route-selector').hidden=true;
 $('detail-planet').hidden=true;$('detail-medal').hidden=false;$('detail-medal').dataset.rank=i;$('detail-eyebrow').textContent='ДОСТИЖЕНИЯ · НАГРАДА ЗА НАВЫК';$('detail-title').textContent=skills[i];$('detail-description').textContent=i<4?'Знак владения гармонией. Его полный вид и условия получения находятся на странице достижений.':'Будущая награда. Условия получения ещё не определены.';
 $('detail-progress').innerHTML='<button id="open-skill-board" style="background:none;border:0;color:#e6cc8e">Открыть достижения ↗</button>';$('open-skill-board').onclick=()=>sendHost('achievements');showDetail(focus);
}
function renderDeck(){
 const count=activeRoutes.length;if($('route-deck').dataset.world!==String(selected)){$('route-deck').dataset.world=String(selected);$('route-deck').innerHTML=activeRoutes.map((r,i)=>{let delta=(i-routeIndex+count)%count;if(delta>count/2)delta-=count;const visible=Math.abs(delta)<=2;return `<button class="route-card ${delta===0?'current':''}" data-route-index="${i}" data-route-id="${escapeText(r.id)}" style="--offset:${delta};z-index:${10-Math.abs(delta)};${visible?'':'display:none'}" aria-pressed="${delta===0}" tabindex="${delta===0?0:-1}"><span class="route-number">${String(i+1).padStart(2,'0')}</span><strong data-user-content>${escapeText(r.name)}</strong><small>${r.chords} аккордов${r.chapter?' · глава '+r.chapter:''}</small><div>${starMarkup(r.rating)}</div><em>${r.rating?'Лучший результат':'Новый маршрут'}</em></button>`;}).join('');}
 for(const b of document.querySelectorAll('[data-route-index]')){let delta=(Number(b.dataset.routeIndex)-routeIndex+count)%count;if(delta>count/2)delta-=count;b.style.setProperty('--offset',delta);b.style.setProperty('--depth',Math.abs(delta));b.style.zIndex=10-Math.abs(delta);b.style.display=Math.abs(delta)<=2?'':'none';b.classList.toggle('current',delta===0);b.setAttribute('aria-pressed',String(delta===0));b.tabIndex=delta===0?0:-1;}
 $('route-counter').textContent=count?`${routeIndex+1} / ${count}`:'';$('route-prev').disabled=$('route-next').disabled=count<2;
 for(const b of document.querySelectorAll('[data-route-index]'))b.onclick=()=>{if(suppressDeckClick)return;routeIndex=Number(b.dataset.routeIndex);renderDeck();};
}
function escapeText(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function turnDeck(direction){if(activeRoutes.length){routeIndex=(routeIndex+direction+activeRoutes.length)%activeRoutes.length;renderDeck();}}
$('route-prev').onclick=()=>turnDeck(-1);$('route-next').onclick=()=>turnDeck(1);
$('route-deck').addEventListener('pointerdown',e=>{deckStart={x:e.clientX,y:e.clientY};});
$('route-deck').addEventListener('pointerup',e=>{if(deckStart){const dx=e.clientX-deckStart.x,dy=e.clientY-deckStart.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){e.preventDefault();suppressDeckClick=true;turnDeck(dx<0?1:-1);setTimeout(()=>suppressDeckClick=false,250);}deckStart=null;}});
$('route-deck').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();turnDeck(e.key==='ArrowRight'?1:-1);document.querySelector('.route-card.current')?.focus();}});
$('route-manual').onclick=()=>{$('manual-routes').hidden=!$('manual-routes').hidden;$('route-manual').setAttribute('aria-expanded',String(!$('manual-routes').hidden));};
$('route-random').onclick=()=>{if(activeRoutes.length){routeIndex=Math.floor(Math.random()*activeRoutes.length);$('route-launch').click();}};
$('route-launch').onclick=()=>{const r=activeRoutes[routeIndex];if(r)sendHost('launch',{id:r.id});};
$('detail-close').onclick=$('detail-return').onclick=()=>$('celestial-detail').close();$('celestial-detail').addEventListener('close',()=>{returnFocus?.focus({preventScroll:true});wake();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake();});window.addEventListener('resize',resize);
syncSpin();resize();
const escapeMap=event=>{if(event.key==='Escape'&&!$('celestial-detail').open)sendHost('close');};addEventListener('keydown',escapeMap);

// Read-only diagnostics for local geometry/motion review, no player state.
window.journeyPreview={snapshot:()=>({yaw,tilt,zoom,auto,planets:hits.map(p=>({name:worlds[p.i].name,x:p.x,y:p.y,r:p.r,z:p.z,layer:p.z<0?'foreground':'background'})),centres:[...centres],worlds:worlds.map(v=>({name:v.name,total:v.routes.length,completed:v.done,percent:v.percent,average:v.average})),renderer:'Canvas 2D / perspective projection / depth-separated axis',dpr})};

function localize(){
 if(runtime.language!=='en')return;
 const dictionary={'КАРТА ПУТЕШЕСТВИЙ':'JOURNEY MAP','Твоя вселенная':'Your universe','Достижения ↗':'Achievements ↗','Семь наград гармонии':'Seven harmony awards','Награда: ':'Award: ','Повернуть влево':'Rotate left','Повернуть вправо':'Rotate right','Ракурс сверху':'View from above','Отдалить':'Zoom out','Приблизить':'Zoom in','Вернуть исходный ракурс':'Reset view','Вращай и наклоняй пространство · выбирай планету':'Drag to rotate and tilt · choose a planet','У каждого полёта':'Every flight has','своё созвездие.':'its constellation.','Пауза':'Pause','Вращать':'Rotate','Миры':'Worlds','Музыкальные миры':'Musical worlds','Планетарный атлас: вращай жестом, нажимай на планеты':'Journey map: drag to rotate and choose a planet','Управление атласом':'Map controls','ТВОЯ КОЛЛЕКЦИЯ':'YOUR COLLECTION','Закрыть':'Close','Среднее лучших результатов пройденных маршрутов':'Average of best results on completed routes','Пока без оценки':'Not yet rated','Среднее: ':'Average: ',' из 5':' out of 5','маршрутов':'routes','Выбор маршрута':'Choose a route','Обойма маршрутов':'Route carousel','Случайный полёт':'Random flight','Пусть мир выберет маршрут':'Let this world choose','Выбрать маршрут':'Choose a route','Рассмотреть все последовательности':'Browse the sequences','Предыдущий маршрут':'Previous route','Следующий маршрут':'Next route','Начать полёт →':'Start flight →','Лучший результат':'Best result','Новый маршрут':'New route','аккордов':'chords','глава':'chapter','Вернуться к звёздам':'Return to the stars','Будущий мир':'Future world','Начало':'Beginning','Уверенно':'Confident','Отлично':'Excellent','Мастерски':'Masterful','Исключительно':'Exceptional','Режим полёта':'Flight mode','Штурман':'Navigator','Пилот':'Pilot','ДОСТИЖЕНИЯ · НАГРАДА ЗА НАВЫК':'ACHIEVEMENTS · SKILL AWARD','Знак владения гармонией. Его полный вид и условия получения находятся на странице достижений.':'A harmony skill award. View its requirements on the Achievements page.','Будущая награда. Условия получения ещё не определены.':'Future award. Its requirements are not defined yet.','Открыть достижения ↗':'Open achievements ↗'};
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement.closest('script,style,[data-user-content]'))continue;let text=node.nodeValue;for(const [ru,en]of Object.entries(dictionary))text=text.replaceAll(ru,en);if(text!==node.nodeValue)node.nodeValue=text;}
 for(const e of document.querySelectorAll('[aria-label]')){let text=e.getAttribute('aria-label');for(const [ru,en]of Object.entries(dictionary))text=text.replaceAll(ru,en);e.setAttribute('aria-label',text);}
 document.documentElement.lang='en';document.title='EAR YOGA · Your universe';
}
localize();
