export function initPointSculpture(){
 const board=document.querySelector('.hero-board'),quote=document.querySelector('.quiet-interlude p');if(!board||!quote)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 quote.classList.add('morph-quote');
 const canvas=document.createElement('canvas');canvas.className='point-sculpture';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 board.classList.add('sculpture-control');board.tabIndex=0;board.setAttribute('role','img');board.setAttribute('aria-label','Point-cloud sculpture. Drag to rotate, or use the arrow keys. Scroll to turn the points into the quote.');
 const hint=document.createElement('span');hint.className='sculpture-hint';hint.textContent='DRAG TO TURN / SCROLL TO EXPLORE';board.append(hint);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let width,height,dpr,targets=[],yaw=.35,pitch=-.9,vy=0,vp=0,drag=null,progress=0,last=0;
 const count=6000,points=[];let seed=47;
 const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
 for(let i=0;i<count;i++){
  // Three rings of curved petals form a volumetric point-cloud bloom.
  const layer=Math.floor(random()*3),petal=Math.floor(random()*7),u=random(),v=(random()-.5)*2;
  const angle=petal*Math.PI*2/7+layer*.35,spread=Math.sin(Math.PI*u)*(.48-layer*.09)*v;
  const radius=.12+u*(1.35-layer*.27),curl=-.3+Math.pow(u,1.6)*(.65+layer*.16)+.13*v*v;
  points.push({x:radius*Math.cos(angle)-spread*Math.sin(angle),y:curl-.13*layer,z:radius*Math.sin(angle)+spread*Math.cos(angle),sx:(random()-.5)*2,sy:(random()-.5)*2,sz:random(),size:.5+random()*.6});
 }
 function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  const q=quote.getBoundingClientRect(),style=getComputedStyle(quote),off=document.createElement('canvas');off.width=Math.ceil(q.width);off.height=Math.ceil(q.height);const c=off.getContext('2d');c.font=`${style.fontSize} ${style.fontFamily}`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='white';const spans=[...quote.querySelectorAll('span')];spans.forEach(s=>{const box=s.getBoundingClientRect();c.fillText(s.textContent,q.width/2,box.top-q.top+box.height/2)});
  const data=c.getImageData(0,0,off.width,off.height).data;targets=[];for(let y=0;y<off.height;y+=1.5)for(let x=0;x<off.width;x+=1.5){if(data[(Math.floor(y)*off.width+Math.floor(x))*4+3]>90)targets.push({x:x-q.width/2,y:y-q.height/2})}
 }
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 function render(time){const dt=Math.min((time-last)/16.7,2)||1;last=time;const box=board.getBoundingClientRect(),q=quote.getBoundingClientRect();
  const end=q.top+scrollY+q.height/2-height*.5,start=Math.max(0,box.top+scrollY+box.height*.45-height*.3),goal=reduced?0:clamp((scrollY-start)/Math.max(1,end-start));progress+=(goal-progress)*Math.min(1,.13*dt);
  ctx.clearRect(0,0,width,height);if(box.bottom<-height&&q.bottom<0){requestAnimationFrame(render);return}
  if(!drag){yaw+=vy*dt;pitch+=vp*dt;vy*=Math.pow(.92,dt);vp*=Math.pow(.92,dt);if(!reduced)yaw+=.0012*dt}
  const morph=smooth((progress-.32)/.63),scatter=Math.sin(Math.PI*progress),fade=1-smooth((progress-.88)/.12);
  quote.style.opacity=reduced?'1':String(smooth((progress-.86)/.14));quote.style.transform='none';
  const centerX=box.left+box.width*(width>700?.39:.5),centerY=box.top+box.height*.49,scale=Math.min(box.width*(width>700?.24:.31),box.height*.34);
  const targetX=q.left+q.width/2,targetY=q.top+q.height/2;
  for(let i=0;i<count;i++){const p=points[i],X=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),Z=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw),Y=p.y*Math.cos(pitch)-Z*Math.sin(pitch),depth=p.y*Math.sin(pitch)+Z*Math.cos(pitch),perspective=4/(4+depth);
   const t=targets[(i*37)%Math.max(1,targets.length)]||{x:0,y:0};let x=(centerX+X*scale*perspective)*(1-morph)+(targetX+t.x)*morph,y=(centerY+Y*scale*perspective)*(1-morph)+(targetY+t.y)*morph;
   x+=p.sx*width*.38*scatter;y+=p.sy*height*.4*scatter;
   ctx.globalAlpha=(.3+(1-depth/1.6)*.2)*fade;ctx.fillStyle='#eee';ctx.fillRect(x,y,p.size,p.size);
  }ctx.globalAlpha=1;hint.style.opacity=String(1-smooth(progress*4));requestAnimationFrame(render);
 }
 board.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};board.setPointerCapture(e.pointerId);board.classList.add('is-turning')});
 board.addEventListener('pointermove',e=>{if(!drag)return;const dx=(e.clientX-drag.x)*.008,dy=(e.clientY-drag.y)*.006;yaw+=dx;pitch=Math.max(-1,Math.min(1,pitch+dy));vy=dx*.4;vp=dy*.4;drag={x:e.clientX,y:e.clientY}});
 const release=()=>{drag=null;board.classList.remove('is-turning')};board.addEventListener('pointerup',release);board.addEventListener('pointercancel',release);
 board.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();yaw+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;pitch+=e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0}});
 addEventListener('resize',resize);document.fonts.ready.then(resize);resize();requestAnimationFrame(render);
}
