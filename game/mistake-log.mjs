// Device-local mistakes; starting a debrief closes the current collection window.
export function mistakeKey(item){
  const c=item.chord;
  return c?`hydra:${c.offset}:${c.quality}:${c.bassOffset??''}:${(c.intervals||[]).join(',')}`:
    `${item.kind}:${item.target??item.interval??''}:${item.quality??''}:${item.toneMode??''}:${(item.required||[]).join(',')}:${item.direction??''}`;
}
export function createMistakeLog(storage){
  const key='space-music-college-mistakes-v1';let data={pending:{},history:{},batch:[],completed:0};
  try{const saved=JSON.parse(storage.getItem(key)||'null');if(saved?.pending&&saved?.history&&Array.isArray(saved.batch))data=saved;}catch{}
  const copy=x=>JSON.parse(JSON.stringify(x));
  const save=()=>{try{storage.setItem(key,JSON.stringify(data));}catch{}};
  function record(item){
    const id=mistakeKey(item),old=data.pending[id],history=data.history[id]||{misses:0,correct:0};
    history.misses++;data.history[id]=history;
    data.pending[id]={id,item:copy(item),count:(old?.count||0)+1};save();
  }
  function begin(){
    const pending=Object.values(data.pending),left=new Map(data.batch.map(entry=>[entry.id,entry]));
    for(const entry of pending){const old=left.get(entry.id);left.set(entry.id,{...entry,remaining:Math.max(old?.remaining||0,Math.min(3,1+entry.count))});}
    data.batch=[...left.values()].sort((a,b)=>(data.history[b.id]?.misses||0)-(data.history[a.id]?.misses||0));
    data.pending={};data.completed=0;save();return current();
  }
  function current(){return data.batch.length?copy(data.batch[0]):null;}
  function answer(correct){
    const entry=data.batch.shift();if(!entry)return;
    const history=data.history[entry.id]||{misses:0,correct:0};
    if(correct){history.correct++;entry.remaining--;if(entry.remaining<=0)data.completed++;}
    else{history.misses++;entry.remaining=Math.max(2,entry.remaining);}
    data.history[entry.id]=history;
    // Retry after other tasks; wrong answers never count as mastering an item.
    if(entry.remaining>0)data.batch.push(entry);save();
  }
  return {record,begin,current,answer,get pendingCount(){return Object.values(data.pending).reduce((sum,e)=>sum+e.count,0);},get remaining(){return data.batch.length;},get completed(){return data.completed;},snapshot:()=>copy(data)};
}
