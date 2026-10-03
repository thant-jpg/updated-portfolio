export function initAmbientParticles(){
 if(matchMedia('(max-width:700px), (hover:none) and (pointer:coarse)').matches)return;
 if(document.querySelector('.ambient-particles'))return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let cleanup;
 function sync(){cleanup?.();cleanup=undefined;if(preference.matches)return;
  const canvas=document.createElement('canvas');canvas.className='ambient-particles';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
  let width=0,height=0,frame=0,last=0,time=0;
  function ribbons(){
   const presence=Math.min(1,scrollY/Math.max(innerHeight*.8,1));if(presence<.02)return;
   const scale=Math.min(width*.36,height*.48),angle=time*.035,c=Math.cos(angle),s=Math.sin(angle);
   // Sparse perspective frames around an independently flowing point surface.
   ctx.strokeStyle=`rgba(167,196,207,${presence*.055})`;ctx.lineWidth=.6;
   
   const columns=width<600?45:75,rows=width<600?36:55;
   for(let i=0;i<columns;i++)for(let j=0;j<rows;j++){
    const u=i/(columns-1)*2-1,v=j/(rows-1)*2-1;
    const twist=v*2.2+Math.sin(time*.13)*.25;
    const x=u*Math.cos(twist)*.72+.18*Math.sin(v*4+time*.18),z=u*Math.sin(twist)*.72+.2*Math.cos(v*3-time*.12),y=v*.95;
    const X=x*c-z*s,Z=x*s+z*c;
    const px=width*.76+X*scale,py=height*.51+(y+Z*.19)*scale;
    const alpha=presence*(.035+(Z+1)*.04)*(.55+.45*Math.sin(i*.2+j*.1+time*.25)**2);
    ctx.fillStyle=`rgba(177,207,220,${alpha})`;ctx.fillRect(px,py,.8,.8);
   }
  }
  // Stable seeds, independent drift axes; no scroll-linked trail or downward stream.
  const particles=Array.from({length:innerWidth<600?45:95},(_,i)=>({x:((i*73.31)%101)/101,y:((i*37.17)%97)/97,phase:i*2.39,speed:.025+(i%7)*.005,size:i%17===0?1.4:.45+(i%3)*.2}));
  function resize(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio,1.5);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);}
  function draw(now){frame=0;if(document.hidden)return;time+=Math.min((now-(last||now))/1000,.05);last=now;ctx.clearRect(0,0,width,height);for(const p of particles){const x=(p.x+Math.sin(time*p.speed+p.phase)*.11+1)%1*width,y=(p.y+Math.cos(time*p.speed*.73+p.phase)*.10+1)%1*height;const twinkle=Math.pow((Math.sin(time*.7+p.phase)+1)/2,9);const alpha=.10+twinkle*.42;ctx.fillStyle=`rgba(183,218,236,${alpha})`;ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();if(p.size>1&&twinkle>.7){ctx.strokeStyle=`rgba(190,222,239,${twinkle*.25})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.moveTo(x,y-3);ctx.lineTo(x,y+3);ctx.stroke();}}
   ribbons();frame=requestAnimationFrame(draw);}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{last=0;if(!frame)frame=requestAnimationFrame(draw);}}
  resize();window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);frame=requestAnimationFrame(draw);
  cleanup=()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);canvas.remove();};
 }
 sync();preference.addEventListener('change',sync);
}
