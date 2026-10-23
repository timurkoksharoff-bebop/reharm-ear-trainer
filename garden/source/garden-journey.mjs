// Route ratings and the journey map are separate from proficiency ranks.
export function gardenRouteStars(flight){
 if(!flight)return 1;
 if(!['medium','hard','professor'].includes(flight.difficulty))return 1;
 const cap=flight.independent?5:flight.ratingCap===4?4:flight.ratingCap===2?2:1;
 let stars=1;const notes=!(flight.toneAttempts>0)||flight.toneAccuracy>=.85;
 if(flight.accuracy>=.8&&flight.laps<=5)stars=2;
 if(flight.accuracy>=.93&&flight.laps<=3)stars=3;
 if(flight.accuracy>=.98&&flight.laps<=1.65&&notes)stars=4;
 if(flight.accuracy===1&&flight.laps<=1.05&&(!(flight.toneAttempts>0)||flight.toneAccuracy===1))stars=5;
 return Math.min(stars,cap);
}
export function gardenRouteRatingText(flight,{best,previous=0,en=false}={}){
 const current=gardenRouteStars(flight),improved=previous>0&&best>previous,stars='★'.repeat(best)+'☆'.repeat(5-best);
 const summary=(en?'Best rating: ':'Лучший рейтинг: ')+stars+(improved?' ↑':'');
 let reason;
 if(!flight)reason=en?'Not enough answer data for a higher rating.':'Недостаточно данных об ответах для более высокой оценки.';
 else if(!['medium','hard','professor'].includes(flight.difficulty))reason=en?'Cadet: completion earns 1★. Higher grades are available in Pilot and Navigator.':'Курсант: прохождение даёт 1★. Более высокие оценки доступны в режимах «Пилот» и «Штурман».';
 else if(!flight.independent)reason=flight.ratingCap===4?(en?'Reduced answer options: maximum 4★. Accuracy: ':'Сокращение вариантов ответа: максимум 4★. Точность: ')+Math.round(flight.accuracy*100)+'% · '+Number(flight.laps).toFixed(2)+(en?' laps.':' круга.'):flight.ratingCap===2?(en?'Full reveal: maximum 2★.':'Полное раскрытие: максимум 2★.'):(en?'Not enough independent answer data.':'Недостаточно данных о самостоятельных ответах.');
 else reason=(en?'Accuracy: ':'Точность: ')+Math.round(flight.accuracy*100)+'% · '+Number(flight.laps).toFixed(2)+(en?' laps.':' круга.')+(flight.toneAttempts>0?(en?' Valid flying notes: ':' Верные летающие ноты: ')+Math.round(flight.toneAccuracy*100)+'%.':'');
 const thresholds=en?'2★: ≥80%, ≤5 laps; 3★: ≥93%, ≤3; 4★: ≥98%, ≤1.65 and ≥85% valid notes; 5★: 100%, ≤1.05 and no wrong notes. Only attempted notes count.':'2★: ≥80%, ≤5 кругов; 3★: ≥93%, ≤3; 4★: ≥98%, ≤1,65 и ≥85% верных нот; 5★: 100%, ≤1,05 и ни одной неверной ноты. Учитываются только пойманные ноты.';
 const detail=(en?'This flight: ':'Этот полёт: ')+current+'/5. '+reason+' '+(improved?(en?'Rating improved: ':'Рейтинг повышен: ')+previous+' → '+best+'. ':'')+thresholds+' '+(en?'Your best rating never decreases.':'Лучший рейтинг не снижается.');
 return {summary,detail};
}
export class GardenJourneyRatings{
 constructor(storage,key='ear-yoga-route-stars.v1'){this.storage=storage;this.key=key;this.data={};try{const value=JSON.parse(storage?.getItem(this.key)||'{}');for(const [id,r]of Object.entries(value))if(!['__proto__','constructor','prototype'].includes(id)&&id.length<180&&Number.isInteger(r.stars)&&r.stars>=1&&r.stars<=5)this.data[id]={stars:r.stars};}catch{}}
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
