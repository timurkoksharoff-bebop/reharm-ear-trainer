// Route ratings and the journey map are separate from proficiency ranks.
export function gardenRouteStars(flight){
 if(!flight)return 1;
 if(!flight.independent||!['medium','hard'].includes(flight.difficulty))return 1;
 let stars=1;const notes=!(flight.toneAttempts>0)||flight.toneAccuracy>=.85;
 if(flight.accuracy>=.8&&flight.laps<=5)stars=2;
 if(flight.accuracy>=.93&&flight.laps<=3)stars=3;
 if(flight.accuracy>=.98&&flight.laps<=1.65&&notes)stars=4;
 if(flight.accuracy===1&&flight.laps<=1.05&&(!(flight.toneAttempts>0)||flight.toneAccuracy===1))stars=5;
 return stars;
}
export class GardenJourneyRatings{
 constructor(storage){this.storage=storage;this.key='ear-yoga-route-stars.v1';this.data={};try{const value=JSON.parse(storage?.getItem(this.key)||'{}');for(const [id,r]of Object.entries(value))if(!['__proto__','constructor','prototype'].includes(id)&&id.length<180&&Number.isInteger(r.stars)&&r.stars>=1&&r.stars<=5)this.data[id]={stars:r.stars};}catch{}}
 record(route,flight){const stars=gardenRouteStars(flight);if(typeof route!=='string'||!route||['__proto__','constructor','prototype'].includes(route))return stars;if(stars>(this.data[route]?.stars||0)){this.data[route]={stars};try{this.storage?.setItem(this.key,JSON.stringify(this.data));}catch{}}return this.data[route].stars;}
 best(route,completed=[]){return this.data[route]?.stars||(completed.includes(route)?1:0);}
}
export function mountGardenJourney({data,onLaunch,onAchievements,onClassic,onClose}){
 const dialog=document.createElement('dialog');dialog.id='journey-map';dialog.className='journey-map';dialog.setAttribute('aria-label','Карта путешествий');document.body.append(dialog);
 const frame=document.createElement('iframe');frame.title='EAR YOGA · карта путешествий';frame.setAttribute('allow','autoplay');dialog.append(frame);let focus=null,silent=false;
 const send=()=>frame.contentWindow?.postMessage({type:'ear-yoga-journey-data',data:data()},location.origin);
 addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==frame.contentWindow||!dialog.open)return;const m=event.data;if(!m||m.type!=='ear-yoga-journey')return;
  if(m.action==='ready')send();else if(m.action==='close')dialog.close();else if(m.action==='achievements')onAchievements();else if(m.action==='classic'){silent=true;dialog.close();onClassic();}else if(m.action==='launch'&&typeof m.id==='string'){const available=data().groups.flatMap(g=>g.routes);if(!available.some(r=>r.id===m.id))return;silent=true;dialog.close();onLaunch(m.id);}
 });
 dialog.addEventListener('close',()=>{frame.src='about:blank';if(!silent)onClose();silent=false;if(focus?.isConnected)focus.focus({preventScroll:true});});
 return {open(){if(dialog.open){send();return;}focus=document.activeElement;dialog.setAttribute('aria-label',data().language==='en'?'Journey map':'Карта путешествий');frame.src='journey/universe.html?embedded=1';dialog.showModal();},get isOpen(){return dialog.open;},close(){dialog.close();}};
}
