// Independent of the debrief queue: completed reviews must not erase learning.
export function createIntelligence(storage,rng=Math.random){
  const key='space-music-college-learning-v1';
  let data={version:1,enabled:true,genre:'mixed',topics:{},recent:{},unlocked:{},turn:0};
  try{const saved=JSON.parse(storage.getItem(key)||'null');if(saved?.version===1&&saved.topics&&saved.recent){
      const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
      if(object(saved.topics)&&object(saved.recent)){data={...data,...saved};data.unlocked=object(saved.unlocked)?saved.unlocked:{};data.turn=Number.isFinite(saved.turn)?saved.turn:0;
        for(const [id,t] of Object.entries(data.topics))if(!t||![t.attempts,t.quality,t.streak,t.correct,t.last].every(Number.isFinite))delete data.topics[id];
        for(const [id,r] of Object.entries(data.recent))if(!Array.isArray(r))delete data.recent[id];
      }
    }}catch{}
  const validGenres=['jazz','classical','rock'];
  data.genres=Array.isArray(data.genres)?data.genres.filter(g=>validGenres.includes(g)):data.genre==='mixed'?[...validGenres]:[data.genre];
  if(!data.genres.length)data.genres=[...validGenres];
  const save=()=>{try{storage.setItem(key,JSON.stringify(data));}catch{}};
  const mastered=t=>t&&t.streak>=3&&t.quality>=.8;
  function record(domain,id,credit){
    if(!domain||id==null||!Number.isFinite(credit))return;
    credit=Math.max(0,Math.min(1,credit));const k=`${domain}:${id}`;
    const t=data.topics[k]||{attempts:0,quality:.5,streak:0,correct:0};
    t.attempts++;t.correct+=credit;t.quality=t.quality*.65+credit*.35;
    t.streak=credit===1?t.streak+1:0;t.last=++data.turn;data.topics[k]=t;save();
  }
  function topicWeight(domain,id){
    const t=data.topics[`${domain}:${id}`];
    if(!data.enabled)return 1;
    const age=t?Math.max(0,data.turn-t.last):0;
    return !t?1.8:mastered(t)?.3+Math.min(1,age/30):1+3*(1-t.quality);
  }
  function pick(domain,items,{id=x=>String(x),genre=()=>null,progressive=false,evidence=null}={}){
    if(!items.length)return null;
    let pool=items.filter(x=>!validGenres.includes(genre(x))||data.genres.includes(genre(x)));
    if(!pool.length)return null;
    if(data.enabled&&progressive){
      // Start with familiar themes in EACH genre, so rock isn't locked behind jazz.
      const groups=new Map();for(const item of pool){const g=genre(item)||'all';if(!groups.has(g))groups.set(g,[]);groups.get(g).push(item);}
      pool=[];
      for(const [g,group] of groups){
        const known=group.filter(x=>mastered(data.topics[`${domain}:${id(x)}`])).length;
        const unlockKey=`${domain}:${g}`,count=Math.max(Number(data.unlocked[unlockKey])||4,4+known);
        data.unlocked[unlockKey]=count;pool.push(...group.slice(0,Math.min(group.length,count)));
      }
    }
    const recent=data.recent[domain]||[];
    const fresh=pool.filter(x=>!recent.slice(-Math.min(2,pool.length-1)).includes(id(x)));
    if(fresh.length)pool=fresh;
    const genreCounts=new Map();for(const x of pool){const g=genre(x)||'all';genreCounts.set(g,(genreCounts.get(g)||0)+1);}
    const weights=pool.map(x=>{
      const g=genre(x)||'all';
      // Balance genres before topic weights; a large jazz catalog cannot drown rock.
      const preference=1;
      const evidenceTopics=evidence?.(x);
      const weight=evidenceTopics?.length?evidenceTopics.reduce((sum,[kind,key])=>sum+topicWeight(kind,key),0)/evidenceTopics.length:topicWeight(domain,id(x));
      return weight*preference/genreCounts.get(g);
    });
    let roll=rng()*weights.reduce((a,b)=>a+b,0),index=weights.length-1;
    for(let i=0;i<weights.length;i++){roll-=weights[i];if(roll<0){index=i;break;}}
    const selected=pool[index];data.recent[domain]=[...recent,id(selected)].slice(-8);save();return selected;
  }
  return {record,pick,configure(settings){if(typeof settings.enabled==='boolean')data.enabled=settings.enabled;if(['mixed','jazz','rock','classical'].includes(settings.genre)){data.genre=settings.genre;data.genres=settings.genre==='mixed'?[...validGenres]:[settings.genre];}if(Array.isArray(settings.genres)){const next=[...new Set(settings.genres)].filter(g=>validGenres.includes(g));if(next.length){data.genres=next;data.genre=next.length===1?next[0]:'mixed';}}save();},get settings(){return {enabled:data.enabled,genre:data.genre,genres:[...data.genres]};},snapshot:()=>JSON.parse(JSON.stringify(data))};
}
