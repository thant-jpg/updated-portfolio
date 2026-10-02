export function initAmbientParticles(){
 if(!document.querySelector('.hero'))return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let cleanup;
 function sync(){cleanup?.();cleanup=undefined;if(preference.matches)return;
  const canvas=document.createElement('canvas');canvas.className='ambient-particles';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
  let width=0,height=0,frame=0,last=0,time=0,lastRipple=0;const ripples=[];
  function ripple(e){if(e.target.closest('a,button')||!e.target.closest('.hero'))return;if(time-lastRipple<.09&&e.type!=='pointerdown')return;lastRipple=time;ripples.push({x:e.clientX,y:e.clientY,born:time});if(ripples.length>16)ripples.shift();}
  // Stable seeds, independent drift axes; no scroll-linked trail or downward stream.
  const particles=Array.from({length:innerWidth<600?45:95},(_,i)=>({x:((i*73.31)%101)/101,y:((i*37.17)%97)/97,phase:i*2.39,speed:.025+(i%7)*.005,size:i%17===0?1.4:.45+(i%3)*.2}));
  function resize(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio,1.5);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);}
  function draw(now){frame=0;if(document.hidden)return;time+=Math.min((now-(last||now))/1000,.05);last=now;ctx.clearRect(0,0,width,height);for(const p of particles){const x=(p.x+Math.sin(time*p.speed+p.phase)*.11+1)%1*width,y=(p.y+Math.cos(time*p.speed*.73+p.phase)*.10+1)%1*height;const twinkle=Math.pow((Math.sin(time*.7+p.phase)+1)/2,9);const alpha=.10+twinkle*.42;ctx.fillStyle=`rgba(183,218,236,${alpha})`;ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();if(p.size>1&&twinkle>.7){ctx.strokeStyle=`rgba(190,222,239,${twinkle*.25})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.moveTo(x,y-3);ctx.lineTo(x,y+3);ctx.stroke();}}
   for(const r of ripples){const age=time-r.born;if(age>3.2)continue;for(let i=0;i<3;i++){const radius=age*85-i*18;if(radius<1)continue;const alpha=Math.exp(-age*1.1)*.18/(i+1);ctx.strokeStyle=`rgba(171,217,235,${alpha})`;ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(r.x,r.y,radius,0,Math.PI*2);ctx.stroke();ctx.strokeStyle=`rgba(205,228,241,${alpha*.5})`;ctx.lineWidth=.5;ctx.beginPath();ctx.arc(r.x,r.y,radius+3,0,Math.PI*2);ctx.stroke();}}frame=requestAnimationFrame(draw);}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{last=0;if(!frame)frame=requestAnimationFrame(draw);}}
  resize();window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);document.addEventListener('pointermove',ripple);document.addEventListener('pointerdown',ripple);frame=requestAnimationFrame(draw);
  cleanup=()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('pointermove',ripple);document.removeEventListener('pointerdown',ripple);canvas.remove();};
 }
 sync();preference.addEventListener('change',sync);
}
