// Rendering cadence and raster sizes only. Audio and mission clocks are owned
// by the existing mission/audio engines; this controller never advances them.
export class GardenGraphicsBudget{
  constructor({mobile=false}={}){
    this.mobile=mobile;this.level=0;this.nextFrame=0;this.nextGround=0;this.windowMs=0;this.windowFrames=0;
  }
  resetTiming(){this.nextFrame=0;this.nextGround=0;this.windowMs=0;this.windowFrames=0;}
  allowFrame(now){
    if(!this.mobile)return true;
    const interval=1000/60;
    if(this.nextFrame&&now+.4<this.nextFrame)return false;
    if(!this.nextFrame||now-this.nextFrame>250)this.nextFrame=now+interval;
    else this.nextFrame+=Math.max(1,Math.floor((now-this.nextFrame+.4)/interval)+1)*interval;
    return true;
  }
  drawGround(now,force=false){
    if(!this.mobile)return true;
    const interval=1000/30;
    if(!force&&this.nextGround&&now+.4<this.nextGround)return false;
    if(force||!this.nextGround||now-this.nextGround>250)this.nextGround=now+interval;
    else this.nextGround+=Math.max(1,Math.floor((now-this.nextGround+.4)/interval)+1)*interval;
    return true;
  }
  observe(frameMs,{active=true}={}){
    if(!this.mobile||!active||frameMs<=0||frameMs>250){this.windowMs=0;this.windowFrames=0;return false;}
    this.windowMs+=frameMs;this.windowFrames++;
    if(this.windowMs<1400)return false;
    const mean=this.windowMs/this.windowFrames;this.windowMs=0;this.windowFrames=0;
    // Retain a stable, lower raster budget for this session instead of cycling
    // back up as soon as the GPU recovers. UI/ship stay sharper than terrain.
    if(mean>26&&this.level<3){this.level++;this.nextGround=0;return true;}
    return false;
  }
  snapshot(){return {mobile:this.mobile,level:this.level,groundScale:this.mobile?[1.15,1,.85,.7][this.level]:1.5,overlayScale:this.mobile?(this.level>1?1.1:1.3):1.5,maxFps:this.mobile?60:null,groundFps:this.mobile?30:null};}
}
