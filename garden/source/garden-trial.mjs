// Offline preview policy, not DRM. New release keys renew the preview;
// clearing site data can reset it. Never delete a player's routes or progress.
export const TRIAL_RELEASE='1.15';
export const TRIAL_DAYS=60;
export const TRIAL_KEY='ear-yoga-preview.'+TRIAL_RELEASE;
export function trialState(saved,now=Date.now()){
  const valid=Number.isFinite(saved?.startedAt)&&Number.isFinite(saved?.lastSeen)&&saved.startedAt>0&&saved.lastSeen>=saved.startedAt;
  const startedAt=valid?saved.startedAt:now;
  const lastSeen=Math.max(now,valid?saved.lastSeen:now);
  const expiresAt=startedAt+TRIAL_DAYS*86400000;
  return {startedAt,lastSeen,expiresAt,expired:lastSeen>=expiresAt,daysLeft:Math.max(0,Math.ceil((expiresAt-lastSeen)/86400000))};
}
export function createTrial(storage){
  let saved;
  try{saved=JSON.parse(storage.getItem(TRIAL_KEY));}catch{}
  let persistent=true;
  return {check(now=Date.now()){
    // Merge across tabs before writing; an older open tab must not reset the
    // start date or lower the latest observed clock.
    try{
      const other=JSON.parse(storage.getItem(TRIAL_KEY));
      if(Number.isFinite(other?.startedAt)&&Number.isFinite(other?.lastSeen)&&other.startedAt>0&&other.lastSeen>=other.startedAt){
        if(saved)saved={startedAt:Math.min(saved.startedAt,other.startedAt),lastSeen:Math.max(saved.lastSeen,other.lastSeen)};
        else saved=other;
      }
    }catch{}
    saved=trialState(saved,now);
    try{storage.setItem(TRIAL_KEY,JSON.stringify(saved));}catch{persistent=false;}
    return {...saved,persistent};
  }};
}
