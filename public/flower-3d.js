import {createFlowers} from './flower-geometry.js';
export function initFlowerMotion(){
 const image=document.querySelector('.hero-art');if(!image)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let stop;
 function start(){
  if(preference.matches)return;const board=image.closest('.hero-board'),hero=board.closest('.hero'),interlude=document.querySelector('.quiet-interlude');
  const canvas=document.createElement('canvas');canvas.className='flower-motion flower-motion-overlay';canvas.setAttribute('aria-hidden','true');
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)return;
  const vertex=`precision mediump float;attribute vec3 position;attribute vec3 normal;uniform float yaw;uniform float time;uniform float progress;uniform float aspect;uniform vec3 touch;uniform float touchAge;uniform float pointMode;varying vec3 N;varying vec3 P;
   void main(){vec3 p=position;float dist=length(p.xy-touch.xy);float envelope=exp(-dist*dist*2.)*(1.-exp(-touchAge*9.))*exp(-touchAge*1.8);p.xy+=(p.xy-touch.xy)/(dist+.2)*envelope*.10;p.z+=envelope*.04;
   float c=cos(yaw),s=sin(yaw);mat3 rot=mat3(c,0.,-s,0.,1.,0.,s,0.,c);p=rot*p;N=rot*normal;P=p;
   p.x+=sin(p.y*5.+time*.3)*progress*.22;p.y-=progress*.3;
   float scatter=smoothstep(.12,.95,progress)*pointMode;float seed=dot(position,vec3(12.34,45.67,78.91));float h=fract(sin(seed)*43758.5453);p.x+=(h-.5)*scatter*2.5+sin(time*.3+seed)*scatter*.12;p.y-=scatter*(mod(time*(.15+h*.2)+h*3.,3.)+progress*.4);gl_PointSize=1.3;float perspective=1.+p.z*.10;gl_Position=vec4((p.x-.22)*.40/aspect*perspective,(p.y+.25)*.40*perspective,0.,1.);}`;
  const fragment=`precision mediump float;varying vec3 N;varying vec3 P;uniform float progress;uniform float wire;uniform float time;uniform float pointMode;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   void main(){float fresnel=pow(1.-abs(normalize(N).z),2.);float light=.3+.7*abs(dot(normalize(N),normalize(vec3(.5,.8,1.))));vec3 color=mix(vec3(.48,.69,.81),vec3(.85,.80,1.),sin(P.x*2.+P.y)*.5+.5);
   float dissolve=smoothstep(.12,.95,progress);float grain=hash(floor(gl_FragCoord.xy/2.));float mask=smoothstep(dissolve-.05,dissolve+.05,grain);float alpha=mix(.065+fresnel*.18+light*.055,.24,wire)*mask*(1.-smoothstep(.12,1.,progress));if(pointMode>.5){if(length(gl_PointCoord-.5)>.5)discard;alpha=.25*smoothstep(.08,.3,progress)*(1.-.8*progress);}gl_FragColor=vec4(color*light,alpha);}`;
  let program;const buffers=[],shaders=[];try{for(const [kind,src] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const shader=gl.createShader(kind);gl.shaderSource(shader,src);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error();shaders.push(shader);}program=gl.createProgram();shaders.forEach(s=>gl.attachShader(program,s));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error();gl.useProgram(program);}catch{return;}
  const mesh=createFlowers();const attr=name=>gl.getAttribLocation(program,name);const pos=attr('position'),normal=attr('normal');
  function buffer(data){const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;}
  const surface=buffer(mesh.positions),normals=buffer(mesh.normals),lines=buffer(mesh.edges);
  const uniforms=Object.fromEntries(['yaw','time','progress','aspect','touch','touchAge','wire','pointMode'].map(n=>[n,gl.getUniformLocation(program,n)]));
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
  let width=0,height=0,elapsed=0,last=0,frame=0,visible=true,yaw=0,targetYaw=0,scrollProgress=0,targetProgress=0,dragging=false,dragStart=0,dragYaw=0,lastTouch=-100,touchX=0,touchY=0;
  function place(){const r=board.getBoundingClientRect();canvas.style.left=r.left+'px';canvas.style.top=(r.top+scrollY-scrollY*.1)+'px';canvas.style.width=width+'px';canvas.style.height=height+'px';}
  function resize(){const r=board.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=width*dpr;canvas.height=height*dpr;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(uniforms.aspect,width/height);place();}
  function scroll(){const end=interlude?interlude.getBoundingClientRect().top+scrollY+interlude.offsetHeight*.5-innerHeight*.5:hero.offsetHeight;targetProgress=Math.max(0,Math.min(1,scrollY/Math.max(end,1)));place();}
  function move(e){if(e.target.closest('a,button'))return;const r=board.getBoundingClientRect();if(dragging)targetYaw=dragYaw+(e.clientX-dragStart)/width*Math.PI*2;else if(e.pointerType!=='touch')targetYaw=((e.clientX-r.left)/width-.5)*1.5;touchX=((e.clientX-r.left)/width*2-1)*width/height/.4+.22;touchY=(1-(e.clientY-r.top)/height*2)/.4-.25;lastTouch=elapsed;}
  function grab(e){if(e.target.closest('a,button')||e.button>0)return;dragging=true;dragStart=e.clientX;dragYaw=targetYaw;board.setPointerCapture(e.pointerId);board.classList.add('is-turning');}
  function release(){dragging=false;board.classList.remove('is-turning');}
  function key(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();targetYaw+=e.key==='ArrowLeft'?-.2:.2;}}
  function bind(b,a){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);}
  function animate(now){frame=0;if(!visible||document.hidden)return;elapsed+=Math.min((now-(last||now))/1000,.05);last=now;yaw+=(targetYaw-yaw)*.07;scrollProgress+=(targetProgress-scrollProgress)*.07;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniforms.yaw,yaw+elapsed*.09+scrollProgress*.7);gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.progress,scrollProgress);gl.uniform3f(uniforms.touch,touchX,touchY,Math.exp(-(elapsed-lastTouch)*2.5));gl.uniform1f(uniforms.touchAge,elapsed-lastTouch);bind(surface,pos);bind(normals,normal);gl.uniform1f(uniforms.pointMode,0);gl.uniform1f(uniforms.wire,0);gl.drawArrays(gl.TRIANGLES,0,mesh.positions.length/3);bind(lines,pos);gl.disableVertexAttribArray(normal);gl.vertexAttrib3f(normal,0,0,1);gl.uniform1f(uniforms.wire,1);gl.drawArrays(gl.LINES,0,mesh.edges.length/3);if(scrollProgress>.08){bind(surface,pos);bind(normals,normal);gl.uniform1f(uniforms.pointMode,1);gl.drawArrays(gl.POINTS,0,mesh.positions.length/3);}canvas.dataset.yaw=yaw.toFixed(3);canvas.dataset.progress=scrollProgress.toFixed(3);frame=requestAnimationFrame(animate);}
  function resume(){last=0;if(visible&&!document.hidden&&!frame)frame=requestAnimationFrame(animate);}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();}
  const ro=new ResizeObserver(resize);ro.observe(board);const states=new Map();const io=new IntersectionObserver(entries=>{entries.forEach(e=>states.set(e.target,e.isIntersecting));visible=[...states.values()].some(Boolean);if(visible)resume();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});io.observe(hero);if(interlude)io.observe(interlude);
  function lost(e){e.preventDefault();stop?.();}
  board.tabIndex=0;board.setAttribute('role','group');board.setAttribute('aria-label','3D flowers. Drag horizontally to rotate fully, or use left and right arrows.');hero.addEventListener('pointermove',move);board.addEventListener('pointerdown',grab);board.addEventListener('pointerup',release);board.addEventListener('pointercancel',release);board.addEventListener('lostpointercapture',release);board.addEventListener('keydown',key);canvas.addEventListener('webglcontextlost',lost);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);document.body.append(canvas);board.classList.add('has-flower-motion');resize();scroll();resume();
  stop=()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();hero.removeEventListener('pointermove',move);board.removeEventListener('pointerdown',grab);board.removeEventListener('pointerup',release);board.removeEventListener('pointercancel',release);board.removeEventListener('lostpointercapture',release);board.removeEventListener('keydown',key);canvas.removeEventListener('webglcontextlost',lost);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);board.removeAttribute('tabindex');board.removeAttribute('role');board.removeAttribute('aria-label');board.classList.remove('has-flower-motion','is-turning');canvas.remove();buffers.forEach(b=>gl.deleteBuffer(b));shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);stop=undefined;};
 }
 function sync(){stop?.();if(!preference.matches)start();}sync();preference.addEventListener('change',sync);
}


