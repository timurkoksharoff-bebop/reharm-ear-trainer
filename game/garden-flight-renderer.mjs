// One continuous garden map. Additional paintings provide material/color
// references, while geography always comes from the same master texture.
const VERTEX = `attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=vec2(a_position.x*.5+.5,.5-a_position.y*.5);gl_Position=vec4(a_position,0.,1.);}`;

const GROUND = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_base,u_bloom,u_thaw;
uniform vec2 u_resolution,u_pilot;
uniform float u_size,u_scroll,u_pan,u_time,u_growth,u_night,u_lantern;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
vec3 gardenTile(sampler2D tex,vec2 p){
  vec2 cell=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  vec3 a=texture2D(tex,fract(p+hash2(cell)*.74)).rgb;
  vec3 b=texture2D(tex,fract(p+hash2(cell+vec2(1.,0.))*.74)).rgb;
  vec3 c=texture2D(tex,fract(p+hash2(cell+vec2(0.,1.))*.74)).rgb;
  vec3 d=texture2D(tex,fract(p+hash2(cell+vec2(1.,1.))*.74)).rgb;
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
vec3 terrain(sampler2D tex,vec2 uv){
  vec3 c=gardenTile(tex,uv);
  float water=smoothstep(.03,.22,c.g-c.r)*smoothstep(.05,.23,c.b-c.r);
  vec2 ripples=vec2(sin(uv.y*120.+u_time*.6),cos(uv.x*100.-u_time*.5))*.00065*water;
  return gardenTile(tex,uv+ripples);
}
float waterness(vec3 c){return smoothstep(.03,.22,c.g-c.r)*smoothstep(.05,.23,c.b-c.r);}
vec3 amberMaterial(vec3 c){
  float water=waterness(c),luma=dot(c,vec3(.299,.587,.114));
  vec3 warm=vec3(c.r*1.24+c.g*.24,luma*.50+c.r*.38,c.b*.44+c.r*.12);
  warm=mix(warm,vec3(luma*1.18,luma*.64,luma*.29),smoothstep(.22,.72,luma)*.42);
  return mix(clamp(warm,0.,1.),c,water*.93);
}
void main(){
  vec2 uv=(v_uv-.5)*u_resolution/u_size+vec2(.5+u_pan,.53-u_scroll);
  vec3 base=terrain(u_base,uv),bloom=terrain(u_bloom,uv),thaw=terrain(u_thaw,uv),amber=amberMaterial(base);
  float phase=mod(u_growth,4.),amount=fract(phase);vec3 a,b;
  if(phase<1.){a=base;b=bloom;}
  else if(phase<2.){a=bloom;b=thaw;}
  else if(phase<3.){a=thaw;b=amber;}
  else{a=amber;b=base;}
  vec2 n=uv*5.;
  float field=noise(n)*.52+noise(n*2.7)*.29+noise(n*7.9)*.13;
  float shore=abs(waterness(base)-.5)*2.;
  field-=shore*.055+sin((uv.x+uv.y)*18.+noise(n*1.3)*4.)*.035;
  float edge=amount*1.42-.21;
  float blend=smoothstep(field-.14,field+.14,edge);
  vec3 c=mix(a,b,blend);
  float neon=smoothstep(.08,.42,max(c.b,c.g)-c.r*.75)*smoothstep(.25,.72,max(c.b,c.g));
  float petal=smoothstep(.17,.55,c.r-c.g)*smoothstep(.25,.65,c.b);
  float emission=max(neon,petal*.65);
  // At night the terrain almost disappears. Cyan/green pigments retain a
  // narrow bioluminescent contour instead of lifting the whole photograph.
  vec3 dark=c*vec3(.025,.042,.058)+c*emission*.62;
  vec2 delta=(v_uv-u_pilot)*u_resolution;
  float radius=min(u_resolution.x,u_resolution.y)*.20;
  float distance=length(delta);
  float halo=1.-smoothstep(radius*.12,radius,distance);
  float cone=smoothstep(.58,.97,-delta.y/max(distance,1.))*(1.-smoothstep(radius*.45,radius*2.15,distance));
  float lamp=max(halo*.9,cone*.92)*u_lantern;
  vec3 night=mix(dark,c*vec3(1.05,1.02,.86),lamp);
  vec3 dusk=c*vec3(1.01,.86,.88);
  vec3 color=mix(mix(c,dusk,sin(u_night*3.14159)*.48),night,u_night);
  gl_FragColor=vec4(color,1.);
}`;

const SHIP = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_ship;
uniform vec2 u_resolution,u_pilot;
uniform float u_shipSize,u_angle,u_time,u_shadow,u_night,u_thrust,u_brake,u_lateral;
void main(){
  vec2 p=(v_uv-u_pilot)*u_resolution;
  p-=vec2(17.,25.)*u_shadow;
  float co=cos(u_angle),si=sin(u_angle);
  vec2 uv=mat2(co,-si,si,co)*p/u_shipSize+.5;
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.28)discard;
  float tail=smoothstep(.63,.94,uv.y);
  uv.x+=sin(uv.y*45.-u_time*5.)*.003*tail;
  vec4 texel=uv.y<=1.?texture2D(u_ship,uv):vec4(0.);
  vec3 c=texel.rgb;
  // The approved ship assets now carry a real feathered alpha matte. Using
  // that matte avoids the faint square produced by the old studio backdrop.
  // The key is retained as a safety net for Safari tabs that still hold the
  // former opaque WebP in their decoded-image cache.
  float bright=max(c.r,max(c.g,c.b));
  float low=min(c.r,min(c.g,c.b));
  float saturation=(bright-low)/max(bright,.001);
  float keyed=max(smoothstep(.145,.235,bright),smoothstep(.12,.29,saturation)*smoothstep(.04,.095,bright));
  float alpha=min(texel.a,keyed);
  alpha*=mix(1.,.86+.12*sin(u_time*9.+uv.y*20.),tail);
  float exhaustY=clamp((uv.y-.79)/(.12+.18*u_thrust),0.,1.);
  float sway=u_lateral*.055*exhaustY;
  float left=exp(-pow((uv.x-(.455-sway))/(.027+.025*exhaustY),2.));
  float right=exp(-pow((uv.x-(.545-sway))/(.027+.025*exhaustY),2.));
  float exhaust=max(left,right)*(1.-smoothstep(.68,1.,exhaustY))*smoothstep(.78,.86,uv.y);
  exhaust*=.72+.28*sin(u_time*(15.+u_thrust*9.)+uv.y*54.);
  vec3 hot=mix(vec3(1.,.22,.06),vec3(.24,.96,1.),clamp(u_thrust-u_brake*.65,0.,1.));
  if(u_shadow<.5){c=mix(c,hot,clamp(exhaust,0.,1.));alpha=max(alpha,exhaust*(.48+.42*u_thrust));}
  if(u_shadow>.5){alpha*=.28*(1.-smoothstep(.60,.81,uv.y));c=vec3(.015,.034,.037);}
  else{c*=1.-u_night*.1;}
  gl_FragColor=vec4(c,alpha);
}`;

function createPass(canvas,fragment,images,options={}){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,powerPreference:'low-power',...options});
  if(!gl)throw new Error('Для полёта нужен WebGL. Открой просмотр в Safari или Chrome с аппаратным ускорением.');
  function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const info=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw Error(info);}return shader;}
  const p=gl.createProgram(),vertex=compile(gl.VERTEX_SHADER,VERTEX),pixel=compile(gl.FRAGMENT_SHADER,fragment);
  gl.attachShader(p,vertex);gl.attachShader(p,pixel);gl.linkProgram(p);gl.deleteShader(vertex);gl.deleteShader(pixel);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
  const attribute=gl.getAttribLocation(p,'a_position'),uniforms=new Map(),buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const textures=images.map(image=>{
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);return texture;
  });
  const uniform=name=>{if(!uniforms.has(name))uniforms.set(name,gl.getUniformLocation(p,name));return uniforms.get(name);};
  const use=()=>{gl.useProgram(p);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);};
  const f=(key,value)=>gl.uniform1f(uniform(key),value),v=(key,x,y)=>gl.uniform2f(uniform(key),x,y);
  const texture=(key,index,unit)=>{gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[index]);gl.uniform1i(uniform(key),unit);};
  return {gl,p,buffer,textures,use,f,v,texture,dispose(){textures.forEach(item=>gl.deleteTexture(item));gl.deleteBuffer(buffer);gl.deleteProgram(p);}};
}

export function createGardenRenderer(groundCanvas,shipCanvas,images) {
  const ground=createPass(groundCanvas,GROUND,images.slice(0,3),{alpha:false,antialias:false});
  const vessel=createPass(shipCanvas,SHIP,images.slice(4,6),{alpha:true,antialias:true,premultipliedAlpha:false});
  return {
    render(s){
      const g=ground.gl;g.viewport(0,0,groundCanvas.width,groundCanvas.height);g.disable(g.BLEND);ground.use();
      ground.texture('u_base',0,0);ground.texture('u_bloom',1,1);ground.texture('u_thaw',2,2);
      ground.v('u_resolution',s.width,s.height);ground.v('u_pilot',s.x/s.width,s.y/s.height);
      ground.f('u_size',s.worldSize);ground.f('u_scroll',s.scroll);ground.f('u_pan',s.pan);ground.f('u_time',s.time);
      ground.f('u_growth',s.growth);ground.f('u_night',s.night);ground.f('u_lantern',s.lantern?1:0);
      g.drawArrays(g.TRIANGLES,0,6);

      const gl=vessel.gl;gl.viewport(0,0,shipCanvas.width,shipCanvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      if(s.ship===2)return;
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);vessel.use();vessel.texture('u_ship',s.ship,0);
      vessel.v('u_resolution',s.width,s.height);vessel.v('u_pilot',s.x/s.width,s.y/s.height);
      const size=Math.min(190,Math.max(110,s.width*.22))*(s.ship===1?1.35:1);
      vessel.f('u_shipSize',size);vessel.f('u_angle',s.angle);vessel.f('u_time',s.time);vessel.f('u_night',s.night);
      vessel.f('u_thrust',s.thrust??.45);vessel.f('u_brake',s.brake??0);vessel.f('u_lateral',Math.max(-1,Math.min(1,(s.motionX??0)*4)));
      vessel.f('u_shadow',1);gl.drawArrays(gl.TRIANGLES,0,6);vessel.f('u_shadow',0);gl.drawArrays(gl.TRIANGLES,0,6);
    },
    dispose(){ground.dispose();vessel.dispose();},
    diagnostics(){return {textures:ground.textures.length+vessel.textures.length,groundError:ground.gl.getError(),shipError:vessel.gl.getError(),width:groundCanvas.width,height:groundCanvas.height};}
  };
}
