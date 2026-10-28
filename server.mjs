import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {watch} from 'node:fs';
import {spawn} from 'node:child_process';

const root=path.resolve('dist');
const liveReload=!process.argv.includes('--no-live-reload');
if(liveReload)process.env.PORTFOLIO_LIVE_BUILD='1';
await import('./build.mjs');
const port=Number(process.env.PORT)||4173;
const types={'.ttf':'font/ttf','.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
const reloadClient=`<script>(()=>{let interrupted=false;const events=new EventSource('/__live_reload');events.addEventListener('reload',()=>location.reload());events.onerror=()=>{interrupted=true};events.onopen=()=>{if(interrupted)location.reload()}})()</script>`;
const clients=new Set();
let building=false,pending=false,timer;
function rebuild(){
 if(building){pending=true;return;}
 building=true;
 const child=spawn(process.execPath,['build.mjs'],{cwd:process.cwd(),stdio:'inherit',windowsHide:true});
 child.on('error',error=>console.error('Rebuild failed:',error.message));
 child.on('close',code=>{
  building=false;
  if(pending){pending=false;rebuild();return;}
  if(code===0)for(const client of clients)client.write('event: reload\ndata: ready\n\n');
  else console.error('Fix the build error and save again to retry.');
 });
}
if(liveReload){
 watch(process.cwd(),{recursive:true},(event,filename)=>{
  if(!filename)return;
  const file=filename.replaceAll('\\','/');
  if(!(file.startsWith('public/')||(!file.includes('/')&&file.endsWith('.mjs')&&file!=='server.mjs')))return;
  clearTimeout(timer);timer=setTimeout(rebuild,200);
 });
}

http.createServer(async(req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(liveReload&&pathname==='/__live_reload'){
  res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});
  res.write(': connected\n\n');
  clients.add(res);
  const heartbeat=setInterval(()=>res.write(': heartbeat\n\n'),20000);
  req.on('close',()=>{clearInterval(heartbeat);clients.delete(res)});
  return;
 }
 try{
  const assetRoot=liveReload&&pathname.startsWith('/images/')?path.resolve('public'):root;
  let file=path.resolve(assetRoot,'.'+pathname);
  if(!file.startsWith(assetRoot+path.sep)&&file!==assetRoot)throw Error();
  try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');}catch{}
  let data=await readFile(file);
  const extension=path.extname(file);
  if(liveReload&&extension==='.html')data=Buffer.from(data.toString().replace('</body>',reloadClient+'</body>'));
  const immutable=/\.[a-f0-9]{12}\.(?:css|js|ttf)$/.test(file);
  res.writeHead(200,{'Content-Type':types[extension]||'application/octet-stream','Cache-Control':immutable?'public, max-age=31536000, immutable':'no-cache'});
  res.end(data);
 }catch{
  res.writeHead(404,{'Content-Type':'text/html'});
  res.end(await readFile(path.join(root,'404.html')));
 }
}).listen(port,'127.0.0.1',()=>console.log(`Portfolio: http://127.0.0.1:${port}${liveReload?' (live reload on)':''}`));
