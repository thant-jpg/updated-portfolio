// One volumetric bloom: layered cupped petals, fine stamens, and a short stem.
// All samples have genuine x/y/z positions; the viewer renders only points.
export function createFlowerCloud(){
 const positions=[],normals=[];
 function orient(p){const a=.85,c=Math.cos(a),s=Math.sin(a);return [p[0],p[1]*c-p[2]*s,p[1]*s+p[2]*c];}
 function add(p,n=[0,1,0]){positions.push(...orient(p));normals.push(...orient(n));}
 for(let layer=0;layer<2;layer++)for(let petal=0;petal<6;petal++){
  const angle=petal*Math.PI*2/6+layer*.52,length=1.85-layer*.38;
  function point(t,u){const r=.13+length*t,w=Math.pow(Math.sin(Math.PI*t),.62)*(.58-layer*.055)*u;
   const y=-.58+(.95+layer*.2)*t*t+.22*u*u*Math.sin(Math.PI*t)+.10*Math.sin(t*Math.PI);
   return [Math.cos(angle)*r-Math.sin(angle)*w,y,Math.sin(angle)*r+Math.cos(angle)*w];}
  for(let i=0;i<125;i++)for(let j=0;j<40;j++){const t=(i+.5)/125,u=(j+.5)/20-1,p=point(t,u),a=point(t+.001,u),b=point(t,u+.001);const v=a.map((x,k)=>x-p[k]),w=b.map((x,k)=>x-p[k]);const n=[v[1]*w[2]-v[2]*w[1],v[2]*w[0]-v[0]*w[2],v[0]*w[1]-v[1]*w[0]];const d=Math.hypot(...n)||1;add(p,n.map(x=>x/d));}
 }
 for(let s=0;s<32;s++){const a=s*Math.PI*2/32;for(let i=0;i<50;i++){const t=i/49;add([Math.cos(a)*.25*t,-.58+t*.95,Math.sin(a)*.25*t]);}for(let i=0;i<50;i++){const a2=i*2.4,r=.045*Math.sqrt(i/50);add([Math.cos(a)*.25+Math.cos(a2)*r,.37+Math.sin(a2)*r,Math.sin(a)*.25+Math.cos(a2*2)*r]);}}
 for(let i=0;i<120;i++)for(let j=0;j<12;j++){const t=i/120,a=j*Math.PI/6;add([Math.sin(t*2)*.08+Math.cos(a)*.025,-.6-t*.9,Math.sin(a)*.025]);}
 return {positions:new Float32Array(positions),normals:new Float32Array(normals)};
}
