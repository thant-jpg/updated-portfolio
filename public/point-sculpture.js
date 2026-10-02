export function initPointSculpture(){
 const board=document.querySelector('.hero-board'),quote=document.querySelector('.quiet-interlude p'),heading=document.querySelector('.hero h1');if(!board||!quote||!heading)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 quote.classList.add('morph-quote');
 const canvas=document.createElement('canvas');canvas.className='point-sculpture';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 board.classList.add('sculpture-control');board.tabIndex=0;board.setAttribute('role','img');board.setAttribute('aria-label','Bitmap flower. Move the cursor to disturb the dots. Drag to rotate, or use the arrow keys.');
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let width,height,dpr,targets=[],sources=[],yaw=0,pitch=0,vy=0,vp=0,drag=null,progress=0,last=0;
 let bitmap=[],pointer={x:-10000,y:-10000};
 const flower=new Image();flower.src='/images/bitmap-flower.png';flower.onload=()=>{const off=document.createElement('canvas');off.width=flower.naturalWidth;off.height=flower.naturalHeight;const c=off.getContext('2d');c.drawImage(flower,0,0);const data=c.getImageData(0,0,off.width,off.height).data;for(let y=0;y<off.height;y+=3)for(let x=0;x<off.width;x+=3){const i=(y*off.width+x)*4,lum=(data[i]+data[i+1]+data[i+2])/3;if(lum<160&&data[i+3]>128)bitmap.push({x:(x-off.width/2)/off.height,y:(y-off.height/2)/off.height,dx:0,dy:0,vx:0,vy:0,ink:1-lum/255})}board.dataset.bitmapPoints=bitmap.length};
 const count=6000,points=[];let seed=47;
 const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
 for(let i=0;i<count;i++){
  // Three rings of curved petals form a volumetric point-cloud bloom.
  const layer=Math.floor(random()*3),petal=Math.floor(random()*7),u=random(),v=(random()-.5)*2;
  const angle=petal*Math.PI*2/7+layer*.35,spread=Math.sin(Math.PI*u)*(.48-layer*.09)*v;
  const radius=.12+u*(1.35-layer*.27),curl=-.3+Math.pow(u,1.6)*(.65+layer*.16)+.13*v*v;
  points.push({x:radius*Math.cos(angle)-spread*Math.sin(angle),y:curl-.13*layer,z:radius*Math.sin(angle)+spread*Math.cos(angle),sx:(random()-.5)*2,sy:(random()-.5)*2,sz:random(),size:.5+random()*.6});
 }
 function sampleText(element){const box=element.getBoundingClientRect(),off=document.createElement('canvas');off.width=Math.ceil(box.width);off.height=Math.ceil(box.height);const c=off.getContext('2d'),walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);c.fillStyle='#fff';c.textBaseline='middle';let node;while(node=walker.nextNode()){const style=getComputedStyle(node.parentElement);c.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;for(let i=0;i<node.length;i++){if(/\s/.test(node.textContent[i]))continue;const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const r=range.getBoundingClientRect();c.fillText(node.textContent[i],r.left-box.left,r.top-box.top+r.height/2)}}const data=c.getImageData(0,0,off.width,off.height).data,result=[];for(let y=0;y<off.height;y+=1.5)for(let x=0;x<off.width;x+=1.5)if(data[(Math.floor(y)*off.width+Math.floor(x))*4+3]>90)result.push({x:x-box.width/2,y:y-box.height/2});return result}
 function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);sources=sampleText(heading);targets=sampleText(quote)}
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 function render(time){const dt=Math.min((time-last)/16.7,2)||1;last=time;const box=board.getBoundingClientRect(),q=quote.getBoundingClientRect();
  const end=q.top+scrollY+q.height/2-height*.5,goal=reduced?0:clamp(scrollY/Math.max(1,end));progress+=(goal-progress)*Math.min(1,.13*dt);
  ctx.clearRect(0,0,width,height);if(box.bottom<-height&&q.bottom<0){requestAnimationFrame(render);return}
  if(!drag){yaw+=vy*dt;pitch+=vp*dt;vy*=Math.pow(.92,dt);vp*=Math.pow(.92,dt)}
  const morph=smooth((progress-.42)/.52),scatter=Math.sin(Math.PI*progress),fade=1-smooth((progress-.96)/.04),takeover=smooth(progress/.1);
  heading.style.opacity=reduced?'1':String(1-takeover);quote.style.opacity=reduced?'1':String(smooth((progress-.94)/.06));quote.style.transform='none';
  const centerX=box.left+box.width*(width>700?.39:.5),centerY=box.top+box.height*.49,scale=Math.min(box.width*(width>700?1.1:1.7),box.height*.95);
  const targetX=q.left+q.width/2,targetY=q.top+q.height/2;
  for(const p of bitmap){const X=p.x*Math.cos(yaw),Z=-p.x*Math.sin(yaw),Y=p.y*Math.cos(pitch)-Z*Math.sin(pitch),depth=p.y*Math.sin(pitch)+Z*Math.cos(pitch),perspective=3/(3+depth);
   const x=centerX+X*scale*perspective,y=centerY+Y*scale*perspective,px=x+p.dx-pointer.x,py=y+p.dy-pointer.y,distance=Math.hypot(px,py),radius=width>700?90:65;
   if(!reduced&&distance<radius&&distance>0){const force=(1-distance/radius)*2;p.vx+=px/distance*force*dt;p.vy+=py/distance*force*dt}
   p.vx=(p.vx-p.dx*.045*dt)*Math.pow(.8,dt);p.vy=(p.vy-p.dy*.045*dt)*Math.pow(.8,dt);p.dx+=p.vx*dt;p.dy+=p.vy*dt;
   ctx.globalAlpha=(.55+p.ink*.4)*(1-smooth(progress/.5));ctx.fillStyle='#eee';const size=Math.max(.8,scale/flower.naturalHeight*2.1);ctx.fillRect(x+p.dx,y+p.dy,size,size);
  }
  if(!reduced&&takeover>.001&&fade>.001){const h=heading.getBoundingClientRect(),originX=h.left+h.width/2,originY=h.top+scrollY+h.height/2-scrollY*.25;
   for(let i=0;i<count;i++){const p=points[i],s=sources[(i*31)%Math.max(1,sources.length)]||{x:0,y:0},t=targets[(i*37)%Math.max(1,targets.length)]||{x:0,y:0};
    const x=(originX+s.x)*(1-morph)+(targetX+t.x)*morph+p.sx*width*.42*scatter,y=(originY+s.y)*(1-morph)+(targetY+t.y)*morph+p.sy*height*.4*scatter;
    ctx.globalAlpha=.75*takeover*fade;ctx.fillRect(x,y,.9,.9);
   }
  }ctx.globalAlpha=1;requestAnimationFrame(render);
 }
 board.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};board.setPointerCapture(e.pointerId);board.classList.add('is-turning')});
 board.addEventListener('pointermove',e=>{if(!drag)return;const dx=(e.clientX-drag.x)*.008,dy=(e.clientY-drag.y)*.006;yaw+=dx;pitch=Math.max(-1,Math.min(1,pitch+dy));vy=dx*.4;vp=dy*.4;drag={x:e.clientX,y:e.clientY}});
 board.addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY}});
 board.addEventListener('pointerleave',()=>{pointer={x:-10000,y:-10000}});
 const release=()=>{drag=null;board.classList.remove('is-turning')};board.addEventListener('pointerup',release);board.addEventListener('pointercancel',release);
 board.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();yaw+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;pitch+=e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0}});
 addEventListener('resize',resize);document.fonts.ready.then(resize);resize();requestAnimationFrame(render);
}
