export function initFlowerMotion(){
 const image=document.querySelector('.hero-art');if(!image)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let stop;
 function start(){
  if(preference.matches||!image.naturalWidth)return;
  const board=image.closest('.hero-board'),hero=board.closest('.hero'),intro=document.querySelector('.quiet-interlude');
  const canvas=document.createElement('canvas');canvas.className='flower-motion flower-motion-overlay';canvas.setAttribute('aria-hidden','true');
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)return;
  const sample=document.createElement('canvas');sample.width=160;sample.height=240;const cx=sample.getContext('2d');cx.drawImage(image,0,0,160,240);const pixels=cx.getImageData(0,0,160,240).data;
  const points=[];for(let y=0;y<240;y++)for(let x=0;x<160;x++){const i=(y*160+x)*4;if(Math.max(pixels[i],pixels[i+1],pixels[i+2])>16&&pixels[i+3]>20)points.push((x+.5)/160,(y+.5)/240);}
  const vertex=`precision mediump float;attribute vec2 position;uniform float progress;uniform float time;uniform float aspect;uniform float sceneScale;uniform float pixelRatio;uniform float pointMode;uniform float imageAspect;uniform vec4 touches[8];varying vec2 texUV;varying float alpha;
   float hash(float n){return fract(sin(n*127.1)*43758.5453);}
   void main(){texUV=position;vec2 p=vec2((position.x-.5)*1.84*imageAspect,(.5-position.y)*1.84);float seed=dot(position,vec2(78.23,145.12));
   p.x+=sin(time*.23+position.y*4.)*.015;p.y+=sin(time*.19)*.012;
   vec2 push=vec2(0.);for(int i=0;i<8;i++){float age=max(time-touches[i].z,0.);vec2 delta=p-touches[i].xy;float influence=exp(-dot(delta,delta)*12.)*(1.-exp(-age*9.))*exp(-age*1.8)*touches[i].w;push+=delta/(length(delta)+.15)*influence*.09;}p+=push/(1.+length(push));
   float scatter=smoothstep(.14,.95,progress)*pointMode;
   p.x+=(hash(seed)-.5)*scatter*1.25+sin(time*.3+seed)*scatter*.08;
   p.y-=scatter*(mod(time*(.10+hash(seed+1.)*.12)+hash(seed+2.)*1.8,1.8)+progress*.35);
   gl_Position=vec4(p.x/aspect*sceneScale,p.y*sceneScale+1.-sceneScale,0.,1.);
   gl_PointSize=pixelRatio*(1.+hash(seed)*.8);alpha=mix(1.-smoothstep(.08,.55,progress),smoothstep(.04,.32,progress)*mix(1.,.18,smoothstep(.3,1.,progress)),pointMode);
   }`;
  const fragment=`precision mediump float;uniform sampler2D art;uniform float pointMode;uniform float time;uniform float imageAspect;uniform vec4 touches[8];varying vec2 texUV;varying float alpha;
   void main(){vec2 uv=texUV;if(pointMode<.5){for(int i=0;i<8;i++){float age=max(time-touches[i].z,0.);vec2 center=vec2(touches[i].x/(1.84*imageAspect)+.5,.5-touches[i].y/1.84);vec2 d=uv-center;float influence=exp(-dot(d,d)*70.)*(1.-exp(-age*9.))*exp(-age*1.8)*touches[i].w;uv+=d*influence*.18;}uv.x+=sin(uv.y*6.+time*.3)*.004;}else{float r=length(gl_PointCoord-.5);if(r>.5)discard;}
   vec4 sampleColor=texture2D(art,clamp(uv,0.,1.));gl_FragColor=vec4(sampleColor.rgb,alpha*sampleColor.a*mix(.65,.62,pointMode));}`;
  const shaders=[],buffers=[];let program,texture;
  try{for(const [type,src] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error();shaders.push(s);}program=gl.createProgram();shaders.forEach(s=>gl.attachShader(program,s));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error();gl.useProgram(program);
   texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
  }catch{return;}
  function buffer(data){const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b;}
  const quad=buffer([0,0,1,0,0,1,0,1,1,0,1,1]),cloud=buffer(points),attribute=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attribute);
  const uniforms=Object.fromEntries(['progress','time','aspect','sceneScale','pixelRatio','pointMode','imageAspect','touches[0]'].map(n=>[n,gl.getUniformLocation(program,n)]));
  gl.uniform1f(uniforms.imageAspect,image.naturalWidth/image.naturalHeight);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);const touches=new Float32Array(32);for(let i=0;i<8;i++)touches[i*4+2]=-100;
  let width=0,height=0,sceneHeight=0,frame=0,elapsed=0,last=0,index=0,lastImpulse=-100,progress=0,target=0,visible=true;
  function place(){const r=board.getBoundingClientRect();canvas.style.left=r.left+'px';canvas.style.top=(r.top+scrollY-scrollY*.1)+'px';canvas.style.width=width+'px';canvas.style.height=height+'px';}
  function resize(){const r=board.getBoundingClientRect();width=r.width;sceneHeight=r.height;height=Math.max(sceneHeight,innerHeight);const ratio=Math.min(devicePixelRatio,1.5);canvas.width=width*ratio;canvas.height=height*ratio;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(uniforms.aspect,width/height);gl.uniform1f(uniforms.sceneScale,sceneHeight/height);gl.uniform1f(uniforms.pixelRatio,ratio);place();}
  function scroll(){const end=intro?intro.getBoundingClientRect().top+scrollY+intro.offsetHeight*.5-innerHeight*.5:hero.offsetHeight;target=Math.max(0,Math.min(1,scrollY/Math.max(end,1)));place();}
  function move(e){if(e.target.closest('a,button')||elapsed-lastImpulse<.08)return;lastImpulse=elapsed;const r=canvas.getBoundingClientRect(),i=(index++%8)*4;touches[i]=(e.clientX-r.left-width*.5)/(sceneHeight*.5);touches[i+1]=(sceneHeight*.5-(e.clientY-r.top))/(sceneHeight*.5);touches[i+2]=elapsed;touches[i+3]=1;canvas.dataset.disturbances=String(index);}
  function bind(b){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);}
  function draw(now){frame=0;if(!visible||document.hidden)return;elapsed+=Math.min((now-(last||now))/1000,.05);last=now;progress+=(target-progress)*.07;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.progress,progress);gl.uniform4fv(uniforms['touches[0]'],touches);bind(quad);gl.uniform1f(uniforms.pointMode,0);gl.drawArrays(gl.TRIANGLES,0,6);bind(cloud);gl.uniform1f(uniforms.pointMode,1);gl.drawArrays(gl.POINTS,0,points.length/2);canvas.dataset.progress=progress.toFixed(3);frame=requestAnimationFrame(draw);}
  function resume(){last=0;if(visible&&!document.hidden&&!frame)frame=requestAnimationFrame(draw);}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();}
  const ro=new ResizeObserver(resize);ro.observe(board);const states=new Map();const io=new IntersectionObserver(entries=>{entries.forEach(e=>states.set(e.target,e.isIntersecting));visible=[...states.values()].some(Boolean);canvas.style.opacity=visible?'1':'0';if(visible)resume();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});io.observe(hero);if(intro)io.observe(intro);
  function lost(e){e.preventDefault();stop?.();}canvas.addEventListener('webglcontextlost',lost);hero.addEventListener('pointermove',move);hero.addEventListener('pointerdown',move);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);document.body.append(canvas);board.classList.add('has-flower-motion');resize();scroll();resume();
  stop=()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();canvas.removeEventListener('webglcontextlost',lost);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerdown',move);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);board.classList.remove('has-flower-motion');canvas.remove();buffers.forEach(b=>gl.deleteBuffer(b));shaders.forEach(s=>gl.deleteShader(s));gl.deleteTexture(texture);gl.deleteProgram(program);stop=undefined;};
 }
 function sync(){stop?.();if(!preference.matches&&image.complete&&image.naturalWidth)start();}if(image.complete)sync();else image.addEventListener('load',sync,{once:true});preference.addEventListener('change',sync);
}
