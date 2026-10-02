// Animate the floral artwork as a texture. Keep the original image as a fallback.
export function initFlowerMotion(){
 const image=document.querySelector('.hero-art');
 if(!image)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let stop;
 function start(){
  if(preference.matches)return;
  const board=image.closest('.hero-board'),hero=board.closest('.hero');
  const canvas=document.createElement('canvas');canvas.className='flower-motion';canvas.setAttribute('aria-hidden','true');
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});if(!gl)return;
  const vertex=`attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
  const fragment=`precision mediump float;
   varying vec2 uv;uniform sampler2D art;uniform vec2 resolution;uniform vec2 imageSize;
   uniform float time;uniform float progress;uniform float cover;uniform float yaw;uniform vec4 drops[12];
   void main(){
    vec2 p=vec2(uv.x,1.-uv.y);float aspect=resolution.x/resolution.y;
    // Distance is measured in isotropic screen units for circular water ripples.
    vec2 q=p*vec2(aspect,1.);vec2 offset=vec2(0.);
    for(int i=0;i<12;i++){
     float age=time-drops[i].z;vec2 d=q-drops[i].xy*vec2(aspect,1.);
     float r=length(d);float alive=step(0.,age)*step(age,3.8)*drops[i].w;
     float envelope=exp(-age*1.25)*exp(-pow((r-age*.21)*10.,2.));
     offset+=normalize(d+vec2(.0001))*sin(r*52.-age*13.)*envelope*.013*alive;
     // Local tangential drag gives the pointer trail a soft stirring sensation.
     offset+=vec2(-d.y,d.x)*exp(-r*r*35.)*exp(-age*2.1)*alive*.11;
    }
    p+=offset/vec2(aspect,1.);
    // Inverse perspective of a vertical-axis turn, never an in-plane roll.
    float turn=yaw+sin(time*.12)*.065+progress*.4;
    vec2 pivot=vec2(.65,.51);vec2 d=(p-pivot)*vec2(aspect,1.);
    float perspective=max(.55,cos(turn)-d.x*sin(turn)*.34);
    d.x/=perspective;d.y*=1.+d.x*sin(turn)*.34;
    p=pivot+d/vec2(aspect,1.);
    p.y+=progress*.12;p=(p-pivot)/(1.+progress*.15)+pivot;
    float containScale=min(resolution.x/imageSize.x,resolution.y/imageSize.y);
    float coverScale=max(resolution.x/imageSize.x,resolution.y/imageSize.y);
    vec2 drawn=imageSize*mix(containScale,coverScale,cover);
    vec2 origin=(resolution-drawn)*vec2(mix(.7,.6,cover),.5);
    vec2 sampleUV=(p*resolution-origin)/drawn;
    float bounds=step(0.,sampleUV.x)*step(sampleUV.x,1.)*step(0.,sampleUV.y)*step(sampleUV.y,1.);
    // Luminance-derived relief adds gentle depth parallax to the image.
    vec3 relief=texture2D(art,sampleUV).rgb;
    float depth=dot(relief,vec3(.299,.587,.114));
    sampleUV.x+=sin(turn)*depth*.042;
    vec3 color=texture2D(art,sampleUV).rgb*bounds;
    gl_FragColor=vec4(color,(1.-smoothstep(.2,1.,progress))*.96);
   }`;
  function shader(kind,source){const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Flower shader unavailable');}return s;}
  let program,texture,buffer,vs,fs;
  try{vs=shader(gl.VERTEX_SHADER,vertex);fs=shader(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Flower renderer unavailable');gl.useProgram(program);
   buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
   texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
  }catch{gl.getExtension('WEBGL_lose_context')?.loseContext();return;}
  const uniform=name=>gl.getUniformLocation(program,name);
  const uniforms={time:uniform('time'),progress:uniform('progress'),resolution:uniform('resolution'),imageSize:uniform('imageSize'),cover:uniform('cover'),yaw:uniform('yaw'),drops:uniform('drops[0]')};
  const drops=new Float32Array(48);for(let i=0;i<12;i++)drops[i*4+2]=-100;
  let width=0,height=0,visible=true,frame=0,elapsed=0,last=0,dropIndex=0,lastPointer=0,scrollProgress=0,targetProgress=0;
  let yaw=0,targetYaw=0,dragging=false,dragStart=0,dragYaw=0;
  const clamp=value=>Math.max(-.85,Math.min(.85,value));
  function turn(event){if(event.target.closest('a,button'))return;const rect=board.getBoundingClientRect();if(dragging)targetYaw=clamp(dragYaw+(event.clientX-dragStart)/Math.max(width,1)*2.8);else if(event.pointerType!=='touch')targetYaw=clamp(((event.clientX-rect.left)/rect.width-.5)*1.35);}
  function grab(event){if(event.target.closest('a,button')||event.button>0)return;dragging=true;dragStart=event.clientX;dragYaw=targetYaw;board.setPointerCapture(event.pointerId);board.classList.add('is-turning');stir(event);}
  function release(){dragging=false;board.classList.remove('is-turning');}
  function key(event){if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();targetYaw=clamp(targetYaw+(event.key==='ArrowLeft'?-.15:.15));}}
  function resize(){const rect=board.getBoundingClientRect();width=rect.width;height=rect.height;const ratio=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(uniforms.resolution,width,height);gl.uniform2f(uniforms.imageSize,image.naturalWidth,image.naturalHeight);gl.uniform1f(uniforms.cover,innerWidth<=900?1:0);}
  function scroll(){const rect=hero.getBoundingClientRect();targetProgress=Math.max(0,Math.min(1,-rect.top/(rect.height*.85)));}
  function stir(event){const now=performance.now();if(now-lastPointer<35)return;lastPointer=now;const rect=board.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;if(x<0||x>1||y<0||y>1)return;const index=(dropIndex++%12)*4;drops[index]=x;drops[index+1]=y;drops[index+2]=elapsed;drops[index+3]=event.type==='pointerdown'?1.6:1;}
  function animate(now){frame=0;if(!visible||document.hidden)return;elapsed+=Math.min((now-(last||now))/1000,.05);last=now;scrollProgress+=(targetProgress-scrollProgress)*.07;yaw+=(targetYaw-yaw)*.065;gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.progress,scrollProgress);gl.uniform1f(uniforms.yaw,yaw);gl.uniform4fv(uniforms.drops,drops);gl.drawArrays(gl.TRIANGLES,0,6);canvas.dataset.progress=scrollProgress.toFixed(3);canvas.dataset.yaw=yaw.toFixed(3);frame=requestAnimationFrame(animate);}
  function resume(){last=0;if(visible&&!document.hidden&&!frame)frame=requestAnimationFrame(animate);}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();}
  const observer=new ResizeObserver(resize);observer.observe(board);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});intersection.observe(hero);
  function lost(event){event.preventDefault();stop?.();}
  canvas.addEventListener('webglcontextlost',lost);
  board.tabIndex=0;board.setAttribute('role','group');board.setAttribute('aria-label','Interactive flowers. Move or drag horizontally to turn; use left and right arrow keys when focused.');
  hero.addEventListener('pointermove',turn);board.addEventListener('pointerdown',grab);board.addEventListener('pointerup',release);board.addEventListener('pointercancel',release);board.addEventListener('lostpointercapture',release);board.addEventListener('keydown',key);
  hero.addEventListener('pointermove',stir);hero.addEventListener('pointerdown',stir);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);
  board.prepend(canvas);board.classList.add('has-flower-motion');resize();scroll();resume();
  stop=()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();hero.removeEventListener('pointermove',stir);hero.removeEventListener('pointerdown',stir);hero.removeEventListener('pointermove',turn);board.removeEventListener('pointerdown',grab);board.removeEventListener('pointerup',release);board.removeEventListener('pointercancel',release);board.removeEventListener('lostpointercapture',release);board.removeEventListener('keydown',key);board.removeAttribute('tabindex');board.removeAttribute('role');board.removeAttribute('aria-label');window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);board.classList.remove('has-flower-motion','is-turning');canvas.remove();gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);stop=undefined;};
 }
 function sync(){stop?.();if(!preference.matches&&image.complete&&image.naturalWidth)start();}
 if(image.complete)sync();else image.addEventListener('load',sync,{once:true});preference.addEventListener('change',sync);
}
