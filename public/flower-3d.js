import {createFlowerCloud} from './flower-cloud.js';
export function initFlowerMotion(){
 const image=document.querySelector('.hero-art');if(!image)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let stop;
 function start(){
  if(preference.matches)return;const board=image.closest('.hero-board'),hero=board.closest('.hero'),interlude=document.querySelector('.quiet-interlude');
  const canvas=document.createElement('canvas');canvas.className='flower-motion flower-motion-overlay';canvas.setAttribute('aria-hidden','true');
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)return;
  const vertex=`precision mediump float;attribute vec3 position;attribute vec3 normal;uniform float yaw;uniform float time;uniform float progress;uniform float aspect;uniform float sceneScale;uniform float pixelRatio;uniform vec4 touches[8];varying float brightness;varying float opacity;
   float hash(float x){return fract(sin(x*127.1)*43758.5453);}
   void main(){float seed=dot(position,vec3(12.34,45.67,78.91));vec3 p=position;float c=cos(yaw),s=sin(yaw);mat3 rot=mat3(c,0.,-s,0.,1.,0.,s,0.,c);p=rot*p;vec3 n=rot*normal;
   vec3 push=vec3(0.);
   for(int i=0;i<8;i++){float age=max(time-touches[i].z,0.);vec2 delta=p.xy-touches[i].xy;float dist=length(delta);float settle=(1.-exp(-age*10.))*exp(-age*1.7);float influence=exp(-dist*dist*3.5)*settle*touches[i].w;push.xy+=delta/(dist+.3)*influence*.15;push.z+=influence*.07;}
   p+=push/(1.+length(push)*2.);
   float scatter=smoothstep(.1,.95,progress);vec3 drift=vec3(hash(seed+1.)-.5,hash(seed+2.)-.5,hash(seed+3.)-.5);
   p.x+=drift.x*scatter*2.5+sin(time*.35+seed)*scatter*.16;
   p.z+=drift.z*scatter*2.;
   float fall=mod(time*(.25+hash(seed+4.)*.23)+hash(seed+5.)*4.,4.);
   p.y-=scatter*(fall+progress*.65);
   float perspective=1.+p.z*.09;gl_Position=vec4(p.x*.47/aspect*sceneScale*perspective,(p.y+.12)*.47*sceneScale*perspective+1.-sceneScale,0.,1.);gl_PointSize=pixelRatio*(1.0+hash(seed)*.7)*(1.-scatter*.25);
   brightness=.45+.45*abs(n.z)+hash(seed)*.25;opacity=mix(1.,.17,smoothstep(.25,1.,progress))*(.32+hash(seed)*.4);
   }`;
  const fragment=`precision mediump float;varying float brightness;varying float opacity;
   void main(){float r=length(gl_PointCoord-vec2(.5));if(r>.5)discard;float soft=1.-smoothstep(.20,.5,r);vec3 color=mix(vec3(.19,.60,.65),vec3(.82,.98,1.),clamp(brightness,0.,1.));gl_FragColor=vec4(color,opacity*soft);}`;
  let program;const buffers=[],shaders=[];try{for(const [kind,src] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const shader=gl.createShader(kind);gl.shaderSource(shader,src);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error();shaders.push(shader);}program=gl.createProgram();shaders.forEach(s=>gl.attachShader(program,s));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error();gl.useProgram(program);}catch{return;}
  const mesh=createFlowerCloud();const attr=name=>gl.getAttribLocation(program,name);const pos=attr('position'),normal=attr('normal');
  function buffer(data){const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;}
  const surface=buffer(mesh.positions),normals=buffer(mesh.normals);
  const uniforms=Object.fromEntries(['yaw','time','progress','aspect','sceneScale','pixelRatio','touches[0]'].map(n=>[n,gl.getUniformLocation(program,n)]));
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
  let width=0,height=0,elapsed=0,last=0,frame=0,visible=true,yaw=0,targetYaw=0,scrollProgress=0,targetProgress=0,dragging=false,dragStart=0,dragYaw=0,lastTouch=-100,touchX=0,touchY=0;
  const touches=new Float32Array(32);for(let i=0;i<8;i++)touches[i*4+2]=-100;let touchIndex=0,lastImpulse=-100;
  function place(){const r=board.getBoundingClientRect();canvas.style.left=r.left+'px';canvas.style.top=(r.top+scrollY-scrollY*.1)+'px';canvas.style.width=width+'px';canvas.style.height=height+'px';}
  function resize(){const r=board.getBoundingClientRect();width=r.width;height=Math.max(r.height,innerHeight);const dpr=Math.min(devicePixelRatio,1.5);canvas.width=width*dpr;canvas.height=height*dpr;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(uniforms.aspect,width/height);gl.uniform1f(uniforms.sceneScale,r.height/height);gl.uniform1f(uniforms.pixelRatio,dpr);place();}
  function scroll(){const end=interlude?interlude.getBoundingClientRect().top+scrollY+interlude.offsetHeight*.5-innerHeight*.5:hero.offsetHeight;targetProgress=Math.max(0,Math.min(1,scrollY/Math.max(end,1)));place();}
  function move(e){if(e.target.closest('a,button'))return;const r=canvas.getBoundingClientRect(),sceneHeight=board.getBoundingClientRect().height;if(dragging)targetYaw=dragYaw+(e.clientX-dragStart)/width*Math.PI*2;if(elapsed-lastImpulse<.08)return;lastImpulse=elapsed;const i=(touchIndex++%8)*4;touches[i]=(e.clientX-r.left-width*.5)/(sceneHeight*.235);touches[i+1]=(sceneHeight*.5-(e.clientY-r.top))/(sceneHeight*.235)-.12;touches[i+2]=elapsed;touches[i+3]=1;canvas.dataset.disturbances=String(touchIndex);}
  function grab(e){if(e.target.closest('a,button')||e.button>0)return;dragging=true;dragStart=e.clientX;dragYaw=targetYaw;board.setPointerCapture(e.pointerId);board.classList.add('is-turning');}
  function release(){dragging=false;board.classList.remove('is-turning');}
  function key(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();targetYaw+=e.key==='ArrowLeft'?-.2:.2;}}
  function bind(b,a){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);}
  function animate(now){frame=0;if(!visible||document.hidden)return;elapsed+=Math.min((now-(last||now))/1000,.05);last=now;yaw+=(targetYaw-yaw)*.07;scrollProgress+=(targetProgress-scrollProgress)*.07;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniforms.yaw,yaw+elapsed*.09+scrollProgress*.7);gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.progress,scrollProgress);gl.uniform4fv(uniforms['touches[0]'],touches);bind(surface,pos);bind(normals,normal);gl.drawArrays(gl.POINTS,0,mesh.positions.length/3);canvas.dataset.yaw=yaw.toFixed(3);canvas.dataset.progress=scrollProgress.toFixed(3);frame=requestAnimationFrame(animate);}
  function resume(){last=0;if(visible&&!document.hidden&&!frame)frame=requestAnimationFrame(animate);}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();}
  const ro=new ResizeObserver(resize);ro.observe(board);const states=new Map();const io=new IntersectionObserver(entries=>{entries.forEach(e=>states.set(e.target,e.isIntersecting));visible=[...states.values()].some(Boolean);canvas.style.opacity=visible?'1':'0';if(visible)resume();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});io.observe(hero);if(interlude)io.observe(interlude);
  function lost(e){e.preventDefault();stop?.();}
  board.tabIndex=0;board.setAttribute('role','group');board.setAttribute('aria-label','3D point-cloud flower. Move to scatter the points, drag to rotate, or use left and right arrows.');hero.addEventListener('pointermove',move);board.addEventListener('pointerdown',grab);board.addEventListener('pointerup',release);board.addEventListener('pointercancel',release);board.addEventListener('lostpointercapture',release);board.addEventListener('keydown',key);canvas.addEventListener('webglcontextlost',lost);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);document.body.append(canvas);board.classList.add('has-flower-motion');resize();scroll();resume();
  stop=()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();hero.removeEventListener('pointermove',move);board.removeEventListener('pointerdown',grab);board.removeEventListener('pointerup',release);board.removeEventListener('pointercancel',release);board.removeEventListener('lostpointercapture',release);board.removeEventListener('keydown',key);canvas.removeEventListener('webglcontextlost',lost);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);board.removeAttribute('tabindex');board.removeAttribute('role');board.removeAttribute('aria-label');board.classList.remove('has-flower-motion','is-turning');canvas.remove();buffers.forEach(b=>gl.deleteBuffer(b));shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);stop=undefined;};
 }
 function sync(){stop?.();if(!preference.matches)start();}sync();preference.addEventListener('change',sync);
}


