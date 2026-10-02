// Original procedural three-dimensional botanical sculpture, shared by viewer and OBJ export.
export function createFlowers(){
 const positions=[],normals=[],edges=[];
 const blooms=[{center:[.65,.65,0],size:.95,tilt:-.25},{center:[-.8,-.2,.25],size:.65,tilt:.3},{center:[.85,-.95,-.3],size:.45,tilt:.15}];
 function transform(p,b){const c=Math.cos(b.tilt),s=Math.sin(b.tilt);return [(p[0]*c-p[1]*s)*b.size+b.center[0],(p[0]*s+p[1]*c)*b.size+b.center[1],p[2]*b.size+b.center[2]];}
 function triangle(a,b,c){const u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const len=Math.hypot(...n)||1;n=n.map(x=>x/len);positions.push(...a,...b,...c);normals.push(...n,...n,...n);}
 for(const bloom of blooms){
  for(let petal=0;petal<8;petal++){
   const a=petal*Math.PI/4;const length=petal%2?1.15:1.4;
   function point(t,u){const radial=.12+t*length;const breadth=Math.pow(Math.sin(Math.PI*t),.72)*.42*u;const curl=.36*Math.sin(t*Math.PI*1.3)+.23*u*u*t+.07*Math.sin(t*9+u*3)*t;return transform([Math.cos(a)*radial-Math.sin(a)*breadth,Math.sin(a)*radial+Math.cos(a)*breadth,curl],bloom);}
   for(let i=0;i<30;i++)for(let j=0;j<14;j++){const t=i/30,u=j/7-1,A=point(t,u),B=point((i+1)/30,u),C=point((i+1)/30,(j+1)/7-1),D=point(t,(j+1)/7-1);triangle(A,B,C);triangle(A,C,D);if(j%3===0)edges.push(...A,...B);if(i%5===0)edges.push(...A,...D);}
  }
  // Curved stem, tubular so it has a real side and back.
  function stem(t,a){const x=bloom.center[0]*(1-t)+.2*Math.sin(t*4),y=bloom.center[1]*(1-t)-2.35*t,z=bloom.center[2]*(1-t)-.4*t;return [x+Math.cos(a)*.018,y,z+Math.sin(a)*.018];}
  for(let i=0;i<50;i++)for(let j=0;j<8;j++){const a=j/8*Math.PI*2,b=(j+1)/8*Math.PI*2;triangle(stem(i/50,a),stem((i+1)/50,a),stem((i+1)/50,b));triangle(stem(i/50,a),stem((i+1)/50,b),stem(i/50,b));if(j===0)edges.push(...stem(i/50,a),...stem((i+1)/50,a));}
  // Fine stamens rise away from the petal surfaces.
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const base=transform([0,0,.02],bloom),tip=transform([Math.cos(a)*.22,Math.sin(a)*.22,.6+(i%3)*.08],bloom);edges.push(...base,...tip);for(let j=0;j<8;j++){const t=j*Math.PI/4;edges.push(...tip,...tip.map((v,k)=>v+(k===0?Math.cos(t)*.025:k===1?Math.sin(t)*.025:.012)));}}
 }
 return {positions:new Float32Array(positions),normals:new Float32Array(normals),edges:new Float32Array(edges)};
}
