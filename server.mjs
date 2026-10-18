import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {handlePlan} from './api/plan.mjs';
const root=path.resolve(fileURLToPath(new URL('./public/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  try{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/api/plan'){
      let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8000){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'内容太长'}));return;}}
      const result=await handlePlan({method:req.method,body,code:req.headers['x-access-code'],ip:req.socket.remoteAddress});res.writeHead(result.status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Allow':'GET, POST'});res.end(JSON.stringify(result.body));return;
    }
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    const name=decodeURIComponent(url.pathname)==='/'?'index.html':decodeURIComponent(url.pathname).slice(1);
    const file=path.resolve(root,name);if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){res.writeHead(403);res.end();return;}
    const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log(`NextStep ready: http://localhost:${server.address().port}`));
