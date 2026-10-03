export function initPointSculpture(){
 const board=document.querySelector('.hero-board'),quote=document.querySelector('.quiet-interlude p'),heading=document.querySelector('.hero h1'),workHeading=document.querySelector('#selected .section-heading h2');if(!board||!quote||!heading||!workHeading)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 quote.classList.add('morph-quote');
 workHeading.classList.add('morph-quote');workHeading.closest('.section-heading').classList.add('morph-section');
 const canvas=document.createElement('canvas');canvas.className='point-sculpture';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 board.classList.add('sculpture-control');board.tabIndex=0;board.setAttribute('role','img');board.setAttribute('aria-label','Bitmap flower. Move the cursor to disturb the dots. Drag to rotate, or use the arrow keys.');
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let width,height,dpr,targets=[],workTargets=[],yaw=0,pitch=0,vy=0,vp=0,drag=null,progress=0,workProgress=0,last=0;
 let bitmap=[],pointer={x:-10000,y:-10000};
 const flower=new Image();flower.src='/images/bitmap-flower.png';flower.onload=()=>{const off=document.createElement('canvas');off.width=flower.naturalWidth;off.height=flower.naturalHeight;const c=off.getContext('2d');c.drawImage(flower,0,0);const data=c.getImageData(0,0,off.width,off.height).data;for(let y=0;y<off.height;y+=3)for(let x=0;x<off.width;x+=3){const i=(y*off.width+x)*4,lum=(data[i]+data[i+1]+data[i+2])/3;if(lum<160&&data[i+3]>128)bitmap.push({x:(x-off.width/2)/off.height,y:(y-off.height/2)/off.height,dx:0,dy:0,vx:0,vy:0,ink:1-lum/255})}board.dataset.bitmapPoints=bitmap.length};
 const count=6000,points=[];let seed=47;
 const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
 const gaussian=()=>Math.sqrt(-2*Math.log(Math.max(.001,random())))*Math.cos(random()*Math.PI*2);
 for(let i=0;i<count;i++){
  points.push({sx:gaussian(),sy:gaussian(),sz:random()});
 }
 function sampleText(element){const box=element.getBoundingClientRect(),off=document.createElement('canvas');off.width=Math.ceil(box.width);off.height=Math.ceil(box.height);const c=off.getContext('2d'),walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);c.fillStyle='#fff';c.textBaseline='middle';let node;while(node=walker.nextNode()){const style=getComputedStyle(node.parentElement);c.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;for(let i=0;i<node.length;i++){if(/\s/.test(node.textContent[i]))continue;const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const r=range.getBoundingClientRect();c.fillText(node.textContent[i],r.left-box.left,r.top-box.top+r.height/2)}}const data=c.getImageData(0,0,off.width,off.height).data,result=[];for(let y=0;y<off.height;y+=1.5)for(let x=0;x<off.width;x+=1.5)if(data[(Math.floor(y)*off.width+Math.floor(x))*4+3]>90)result.push({x:x-box.width/2,y:y-box.height/2});return result}
 function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);targets=sampleText(quote);workTargets=sampleText(workHeading)}
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 function render(time){const dt=Math.min((time-last)/16.7,2)||1;last=time;const box=board.getBoundingClientRect(),q=quote.getBoundingClientRect(),w=workHeading.getBoundingClientRect();
  const end=q.top+scrollY+q.height/2-height*.5,goal=reduced?0:clamp(scrollY/Math.max(1,end));progress+=(goal-progress)*Math.min(1,.13*dt);
  const workStart=end+height*.16,workEnd=w.top+scrollY+w.height/2-height*.5,workGoal=reduced?0:clamp((scrollY-workStart)/Math.max(1,workEnd-workStart));workProgress+=(workGoal-workProgress)*Math.min(1,.13*dt);
  const workTakeover=smooth(workProgress/.09),workFade=1-smooth((workProgress-.96)/.04);
  ctx.clearRect(0,0,width,height);
  if(!drag){yaw+=vy*dt;pitch+=vp*dt;vy*=Math.pow(.92,dt);vp*=Math.pow(.92,dt)}
  const fade=1-smooth((progress-.96)/.04);
  heading.style.opacity='1';quote.style.opacity=reduced?'1':String(smooth((progress-.94)/.06)*(1-workTakeover));quote.style.transform='none';
  workHeading.style.opacity=reduced?'1':String(smooth((workProgress-.94)/.06));
  if(box.bottom<-height&&w.bottom<0){requestAnimationFrame(render);return}
  const centerX=box.left+box.width*.5,centerY=box.top+box.height*.5,scale=Math.min(box.width/ (flower.naturalWidth/flower.naturalHeight || .46)*.84,box.height*.92);
  const targetX=q.left+q.width/2,targetY=q.top+q.height/2;
  for(let i=0;i<bitmap.length;i++){const p=bitmap[i],flow=points[i%count],X=p.x*Math.cos(yaw),Z=-p.x*Math.sin(yaw),Y=p.y*Math.cos(pitch)-Z*Math.sin(pitch),depth=p.y*Math.sin(pitch)+Z*Math.cos(pitch),perspective=3/(3+depth);
   const x=centerX+X*scale*perspective,y=centerY+Y*scale*perspective,px=x+p.dx-pointer.x,py=y+p.dy-pointer.y,distance=Math.hypot(px,py),radius=width>700?115:75;
   if(!reduced&&distance<radius&&distance>0){const force=(1-distance/radius)*5;p.vx+=(px-py*.35)/distance*force*dt;p.vy+=(py+px*.35)/distance*force*dt}
   p.vx=(p.vx-p.dx*.028*dt)*Math.pow(.85,dt);p.vy=(p.vy-p.dy*.028*dt)*Math.pow(.85,dt);p.dx+=p.vx*dt;p.dy+=p.vy*dt;
   // The same bitmap dots leave the petals and stems, then assemble the quote.
   const departure=smooth((progress-.025-flow.sz*.045)/.72),morph=smooth((progress-.38)/.56),scatter=Math.sin(Math.PI*departure)*(1-morph);
   const t=targets[(i*37)%Math.max(1,targets.length)]||{x:0,y:0},swirl=progress*2.2;
   const flowX=flow.sx*Math.cos(swirl)-flow.sy*Math.sin(swirl),flowY=flow.sx*Math.sin(swirl)+flow.sy*Math.cos(swirl);
   let drawX=(x+p.dx)*(1-morph)+(targetX+t.x)*morph+flowX*width*.24*scatter;
   let drawY=(y+p.dy+scrollY*.65*departure)*(1-morph)+(targetY+t.y)*morph+flowY*height*.3*scatter;
   let alpha=reduced?1:fade,size=Math.max(.8,scale/flower.naturalHeight*2.1)*(1-morph)+.9*morph;
   if(workProgress>0&&!reduced){
    const next=workTargets[(i*41)%Math.max(1,workTargets.length)]||{x:0,y:0},gather=smooth((workProgress-.38)/.56),burst=Math.sin(Math.PI*smooth(workProgress/.84))*(1-gather),angle=workProgress*2.5;
    const fx=flow.sx*Math.cos(angle)-flow.sy*Math.sin(angle),fy=flow.sx*Math.sin(angle)+flow.sy*Math.cos(angle);
    drawX=(targetX+t.x)*(1-gather)+(w.left+w.width/2+next.x)*gather+fx*width*.23*burst;
    drawY=(targetY+t.y+(scrollY-workStart)*.6)*(1-gather)+(w.top+w.height/2+next.y)*gather+fy*height*.25*burst;
    alpha=workTakeover*workFade;size=.9;
   }
   ctx.globalAlpha=(.55+p.ink*.4)*alpha;ctx.fillStyle='#eee';ctx.fillRect(drawX,drawY,size,size);
  }ctx.globalAlpha=1;requestAnimationFrame(render);
 }
 board.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};board.setPointerCapture(e.pointerId);board.classList.add('is-turning')});
 board.addEventListener('pointermove',e=>{if(!drag)return;const dx=(e.clientX-drag.x)*.008,dy=(e.clientY-drag.y)*.006;yaw+=dx;pitch=Math.max(-1,Math.min(1,pitch+dy));vy=dx*.4;vp=dy*.4;drag={x:e.clientX,y:e.clientY}});
 window.addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY}});
 document.documentElement.addEventListener('pointerleave',()=>{pointer={x:-10000,y:-10000}});
 window.addEventListener('blur',()=>{pointer={x:-10000,y:-10000}});
 const release=()=>{drag=null;board.classList.remove('is-turning')};board.addEventListener('pointerup',release);board.addEventListener('pointercancel',release);
 board.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();yaw+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;pitch+=e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0}});
 addEventListener('resize',resize);document.fonts.ready.then(resize);resize();requestAnimationFrame(render);
}
