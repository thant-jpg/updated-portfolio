export function initPointSculpture(){
 const board=document.querySelector('.hero-board'),quote=document.querySelector('.quiet-interlude p'),heading=document.querySelector('.hero h1');if(!board||!quote||!heading)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 quote.classList.add('morph-quote');
 const canvas=document.createElement('canvas');canvas.className='point-sculpture';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 board.classList.add('sculpture-control');board.tabIndex=0;board.setAttribute('role','img');board.setAttribute('aria-label','Point-cloud flower. Drag to rotate, or use the arrow keys.');
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let width,height,dpr,targets=[],sources=[],yaw=.35,pitch=-.9,vy=0,vp=0,drag=null,progress=0,last=0;
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
  if(!drag){yaw+=vy*dt;pitch+=vp*dt;vy*=Math.pow(.92,dt);vp*=Math.pow(.92,dt);if(!reduced)yaw+=.0012*dt}
  const morph=smooth((progress-.42)/.52),scatter=Math.sin(Math.PI*progress),fade=1-smooth((progress-.96)/.04),takeover=smooth(progress/.1);
  heading.style.opacity=reduced?'1':String(1-takeover);quote.style.opacity=reduced?'1':String(smooth((progress-.94)/.06));quote.style.transform='none';
  const centerX=box.left+box.width*(width>700?.39:.5),centerY=box.top+box.height*.49,scale=Math.min(box.width*(width>700?.24:.31),box.height*.34);
  const targetX=q.left+q.width/2,targetY=q.top+q.height/2;
  for(let i=0;i<count;i++){const p=points[i],X=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),Z=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw),Y=p.y*Math.cos(pitch)-Z*Math.sin(pitch),depth=p.y*Math.sin(pitch)+Z*Math.cos(pitch),perspective=4/(4+depth);
   ctx.globalAlpha=(.3+(1-depth/1.6)*.2)*(1-smooth(progress/.5));ctx.fillStyle='#eee';ctx.fillRect(centerX+X*scale*perspective,centerY+Y*scale*perspective,p.size,p.size);
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
 const release=()=>{drag=null;board.classList.remove('is-turning')};board.addEventListener('pointerup',release);board.addEventListener('pointercancel',release);
 board.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();yaw+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;pitch+=e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0}});
 addEventListener('resize',resize);document.fonts.ready.then(resize);resize();requestAnimationFrame(render);
}
