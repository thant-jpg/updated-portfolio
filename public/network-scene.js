export function initFlowerMotion(){
 const board=document.querySelector('.hero-board');if(!board)return;
 const hero=board.closest('.hero'),intro=document.querySelector('.quiet-interlude');
 const canvas=document.createElement('canvas');canvas.className='network-scene';canvas.setAttribute('aria-hidden','true');board.append(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let w=0,h=0,frame=0,time=0,last=0,visible=true,active=false;
 const cursor={x:0,y:0};let progress=0;
 function resize(){const r=board.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);if(!active){cursor.x=w*.5;cursor.y=h*.52}draw();}
 function move(e){const r=board.getBoundingClientRect();cursor.x=e.clientX-r.left;cursor.y=e.clientY-r.top;active=true;canvas.dataset.pointerX=cursor.x.toFixed(1);canvas.dataset.pointerY=cursor.y.toFixed(1);if(reduced.matches)draw();}
 function leave(){active=false;}
 function draw(){ctx.clearRect(0,0,w,h);const spacing=w<600?42:65,radius=spacing*2.65;
  const cx=active?cursor.x:w*.5+Math.sin(time*.28)*w*.09,cy=active?cursor.y:h*.52+Math.cos(time*.22)*h*.06;
  const centerX=w*.5,centerY=h*.52;const scatter=Math.max(0,Math.min(1,scrollY/(hero.offsetHeight*.85)));
  for(let row=-5;row<=5;row++)for(let col=-7;col<=7;col++){
   const seed=(row+5)*15+col+7;let x=centerX+col*spacing,y=centerY+row*spacing;
   const mask=Math.max(0,1-Math.hypot(col/8,row/6));
   if(scatter){x+=Math.sin(seed*2.7+time*.2)*scatter*75;y+=scatter*((seed*17+time*20)%240);}
   const dist=Math.hypot(x-cx,y-cy);const influence=Math.max(0,1-dist/radius);
   if(influence>.14&&dist>spacing*.65&&scatter<.95){ctx.strokeStyle=`rgba(255,255,255,${influence*.7*(1-scatter)})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();}
   ctx.fillStyle=`rgba(255,255,255,${(.11+influence*.82)*mask*(1-scatter*.7)})`;ctx.beginPath();ctx.arc(x,y,1+influence*3.5,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle=`rgba(255,255,255,${1-scatter})`;ctx.beginPath();ctx.arc(cx,cy,w<600?7:10,0,Math.PI*2);ctx.fill();canvas.dataset.progress=scatter.toFixed(3);
 }
 function animate(now){frame=0;if(document.hidden||!visible)return;time+=Math.min((now-(last||now))/1000,.05);last=now;draw();if(!reduced.matches)frame=requestAnimationFrame(animate);}
 function resume(){last=0;if(!frame)frame=requestAnimationFrame(animate);}
 hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',leave);hero.addEventListener('pointerdown',move);
 addEventListener('scroll',()=>{if(reduced.matches)draw()},{passive:true});
 new ResizeObserver(resize).observe(board);new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)resume();else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'80px'}).observe(hero);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)resume()});reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;resume()});
 board.classList.add('has-network');resize();resume();
}
