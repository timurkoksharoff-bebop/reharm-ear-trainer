// Device-local mistakes; starting a debrief closes the current collection window.
export function mistakeKey(item){
  const c=item.chord;
  if(item.kind==='melody'&&item.melodyId)return `melody:${item.melodyId}`;
  return c?`hydra:${c.offset}:${c.quality}:${c.bassOffset??''}:${(c.intervals||[]).join(',')}`:
    `${item.kind}:${item.target??item.interval??''}:${item.quality??''}:${item.toneMode??''}:${(item.required||[]).join(',')}:${item.direction??''}`;
}
export function createMistakeLog(storage,normalize=item=>item){
  const key='space-music-college-mistakes-v1';let data={pending:{},history:{},batch:[],completed:0};
  try{const saved=JSON.parse(storage.getItem(key)||'null');if(saved?.pending&&saved?.history&&Array.isArray(saved.batch))data=saved;}catch{}
  const copy=x=>JSON.parse(JSON.stringify(x));
  const save=()=>{try{storage.setItem(key,JSON.stringify(data));}catch{}};
  // Catalog positions are not identities. Migrate both the current batch and
  // pending window while preserving all surviving repetition counts.
  const migrate=entry=>{
    const item=normalize(entry.item);if(!item)return null;
    const id=mistakeKey(item);
    if(id!==entry.id&&data.history[entry.id]){data.history[id]=data.history[entry.id];delete data.history[entry.id];}
    return {...entry,id,item};
  };
  data.pending=Object.fromEntries(Object.values(data.pending).map(migrate).filter(Boolean).map(entry=>[entry.id,entry]));
  data.batch=data.batch.map(migrate).filter(Boolean);save();
  function record(item){
    item=normalize(item);if(!item)return;
    const id=mistakeKey(item),old=data.pending[id],history=data.history[id]||{misses:0,correct:0};
    history.misses++;data.history[id]=history;
    data.pending[id]={id,item:copy(item),count:(old?.count||0)+1};save();
  }
  function begin(){
    // Reopening resumes this finite batch. Mistakes from later flights belong
    // to the next collection window, even when they concern the same topic.
    if(data.batch.length)return current();
    const pending=Object.values(data.pending);if(!pending.length)return null;
    data.batch=pending.map(entry=>({...entry,remaining:Math.min(3,1+entry.count)}))
      .sort((a,b)=>(data.history[b.id]?.misses||0)-(data.history[a.id]?.misses||0));
    data.pending={};data.completed=0;save();return current();
  }
  function current(){return data.batch.length?copy(data.batch[0]):null;}
  function answer(correct){
    const entry=data.batch.shift();if(!entry)return;
    const history=data.history[entry.id]||{misses:0,correct:0};
    if(correct){history.correct++;entry.remaining--;if(entry.remaining<=0)data.completed++;}
    else history.misses++;
    data.history[entry.id]=history;
    // Retry after other tasks; wrong answers never count as mastering an item.
    if(entry.remaining>0)data.batch.push(entry);save();
  }
  return {record,begin,current,answer,get pendingCount(){return Object.values(data.pending).reduce((sum,e)=>sum+e.count,0);},get remainingAnswers(){return data.batch.reduce((sum,entry)=>sum+entry.remaining,0);},get remaining(){return data.batch.length;},get completed(){return data.completed;},snapshot:()=>copy(data)};
}
