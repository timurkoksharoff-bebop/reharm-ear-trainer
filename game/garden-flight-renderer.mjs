// A bounded preview renderer: six immutable art textures, two fullscreen passes
// for the terrain and ship. Source paintings stay unchanged on disk.
const VERTEX = `attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=vec2(a_position.x*.5+.5,.5-a_position.y*.5);gl_Position=vec4(a_position,0.,1.);}`;

const GROUND = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_from,u_to;
uniform vec2 u_resolution,u_pilot;
uniform float u_size,u_scroll,u_pan,u_time,u_transition,u_night,u_lantern;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
vec2 mirrorUV(vec2 p){return 1.-abs(mod(p,2.)-1.);}
vec3 terrain(sampler2D tex,vec2 uv){
  vec2 m=mirrorUV(uv);vec3 c=texture2D(tex,m).rgb;
  float water=smoothstep(.03,.22,c.g-c.r)*smoothstep(.05,.23,c.b-c.r);
  vec2 ripples=vec2(sin(uv.y*120.+u_time*.6),cos(uv.x*100.-u_time*.5))*.00065*water;
  return texture2D(tex,mirrorUV(uv+ripples)).rgb;
}
void main(){
  vec2 uv=(v_uv-.5)*u_resolution/u_size+vec2(.5+u_pan,.53-u_scroll);
  vec3 a=terrain(u_from,uv),b=terrain(u_to,uv);
  vec2 n=mirrorUV(uv)*5.;
  float field=noise(n)*.55+noise(n*2.7)*.3+noise(n*7.9)*.15;
  float edge=u_transition*1.5-.25;
  float blend=smoothstep(field-.18,field+.18,edge);
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
uniform float u_shipSize,u_angle,u_time,u_shadow,u_night;
void main(){
  vec2 p=(v_uv-u_pilot)*u_resolution;
  p-=vec2(17.,25.)*u_shadow;
  float co=cos(u_angle),si=sin(u_angle);
  vec2 uv=mat2(co,-si,si,co)*p/u_shipSize+.5;
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)discard;
  float tail=smoothstep(.63,.94,uv.y);
  uv.x+=sin(uv.y*45.-u_time*5.)*.003*tail;
  vec3 c=texture2D(u_ship,uv).rgb;
  float bright=max(c.r,max(c.g,c.b));
  // The neutral studio backdrop is keyed only during compositing. The art
  // file is kept intact; saturated exhaust remains soft at its edges.
  float low=min(c.r,min(c.g,c.b));
  float saturation=(bright-low)/max(bright,.001);
  float alpha=max(smoothstep(.10,.19,bright),smoothstep(.14,.38,saturation)*smoothstep(.035,.075,bright));
  alpha*=mix(1.,.86+.12*sin(u_time*9.+uv.y*20.),tail);
  if(u_shadow>.5){alpha*=.28*(1.-smoothstep(.60,.81,uv.y));c=vec3(.015,.034,.037);}
  else{c*=1.-u_night*.1;}
  gl_FragColor=vec4(c,alpha);
}`;

export function createGardenRenderer(canvas, images) {
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
  if(!gl)throw new Error('Для полёта нужен WebGL. Открой просмотр в Safari или Chrome с аппаратным ускорением.');
  function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const info=gl.getShaderInfoLog(s);gl.deleteShader(s);throw Error(info);}return s;}
  function program(fragment){
    const p=gl.createProgram(),v=compile(gl.VERTEX_SHADER,VERTEX),f=compile(gl.FRAGMENT_SHADER,fragment);
    gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
    const uniforms=new Map();return {p,attribute:gl.getAttribLocation(p,'a_position'),uniform(name){if(!uniforms.has(name))uniforms.set(name,gl.getUniformLocation(p,name));return uniforms.get(name);}};
  }
  const ground=program(GROUND),ship=program(SHIP),buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const textures=images.map(img=>{
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);return texture;
  });
  let current;
  function use(p){current=p;gl.useProgram(p.p);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(p.attribute);gl.vertexAttribPointer(p.attribute,2,gl.FLOAT,false,0,0);}
  const f=(key,value)=>gl.uniform1f(current.uniform(key),value),v=(key,x,y)=>gl.uniform2f(current.uniform(key),x,y);
  function texture(key,idx,unit){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[idx]);gl.uniform1i(current.uniform(key),unit);}
  return {
    render(s){
      gl.viewport(0,0,canvas.width,canvas.height);gl.disable(gl.BLEND);use(ground);
      texture('u_from',s.from,0);texture('u_to',s.to,1);
      v('u_resolution',s.width,s.height);v('u_pilot',s.x/s.width,s.y/s.height);
      f('u_size',s.worldSize);f('u_scroll',s.scroll);f('u_pan',s.pan);f('u_time',s.time);
      f('u_transition',s.transition);f('u_night',s.night);f('u_lantern',s.lantern?1:0);
      gl.drawArrays(gl.TRIANGLES,0,6);
      if(s.ship===2)return;
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);use(ship);texture('u_ship',4+s.ship,0);
      v('u_resolution',s.width,s.height);v('u_pilot',s.x/s.width,s.y/s.height);
      const size=Math.min(190,Math.max(110,s.width*.22))*(s.ship===1?1.35:1);
      f('u_shipSize',size);f('u_angle',s.angle);f('u_time',s.time);f('u_night',s.night);
      f('u_shadow',1);gl.drawArrays(gl.TRIANGLES,0,6);f('u_shadow',0);gl.drawArrays(gl.TRIANGLES,0,6);
    },
    dispose(){textures.forEach(t=>gl.deleteTexture(t));gl.deleteBuffer(buffer);gl.deleteProgram(ground.p);gl.deleteProgram(ship.p);},
    diagnostics(){return {textures:textures.length,error:gl.getError(),width:canvas.width,height:canvas.height};}
  };
}
