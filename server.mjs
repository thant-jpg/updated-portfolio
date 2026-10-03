import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import './build.mjs';

const root=path.resolve('dist');
const liveReload=process.argv.includes('--live-reload');
const port=Number(process.env.PORT)||4173;
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
const reloadClient=`<script>(()=>{let interrupted=false;const events=new EventSource('/__live_reload');events.onerror=()=>{interrupted=true};events.onopen=()=>{if(interrupted)location.reload()}})()</script>`;

http.createServer(async(req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(liveReload&&pathname==='/__live_reload'){
  res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});
  res.write(': connected\n\n');
  const heartbeat=setInterval(()=>res.write(': heartbeat\n\n'),20000);
  req.on('close',()=>clearInterval(heartbeat));
  return;
 }
 try{
  let file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)&&file!==root)throw Error();
  try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');}catch{}
  let data=await readFile(file);
  const extension=path.extname(file);
  if(liveReload&&extension==='.html')data=Buffer.from(data.toString().replace('</body>',reloadClient+'</body>'));
  res.writeHead(200,{'Content-Type':types[extension]||'application/octet-stream'});
  res.end(data);
 }catch{
  res.writeHead(404,{'Content-Type':'text/html'});
  res.end(await readFile(path.join(root,'404.html')));
 }
}).listen(port,'127.0.0.1',()=>console.log(`Portfolio: http://127.0.0.1:${port}${liveReload?' (live reload on)':''}`));
