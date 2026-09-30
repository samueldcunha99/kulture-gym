import http from 'node:http';
import { readFile } from 'node:fs/promises';
import worker from './worker.mjs';
import {openDatabase} from './local-db.mjs';
import path from 'node:path';
const root=path.resolve('dist/client');
const DB=openDatabase();
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const ASSETS={async fetch(request){try{const url=new URL(request.url);let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep)&&file!==root)throw Error();if(!path.extname(file))file=path.join(file,'index.html');const data=await readFile(file);return new Response(data,{headers:{'Content-Type':types[path.extname(file)]||'application/octet-stream'}});}catch{return new Response('Page not found',{status:404});}}};
http.createServer(async(req,res)=>{try{const headers=new Headers();for(const [k,v] of Object.entries(req.headers))if(v&&!k.startsWith('oai-authenticated-user-'))headers.set(k,Array.isArray(v)?v.join(','):v);const url='http://127.0.0.1:4173'+req.url;const cookies=headers.get('cookie')||'';
if(req.url.startsWith('/signin-with-chatgpt')){res.writeHead(302,{'Set-Cookie':'local_owner=1; HttpOnly; SameSite=Lax; Path=/','Location':'/admin/'});res.end();return;}
if(req.url.startsWith('/signout-with-chatgpt')){res.writeHead(302,{'Set-Cookie':'local_owner=; Max-Age=0; HttpOnly; SameSite=Lax; Path=/','Location':'/'});res.end();return;}
if(cookies.split(';').some(x=>x.trim()==='local_owner=1')){headers.set('oai-authenticated-user-id','local-owner');headers.set('oai-authenticated-user-email','Local owner preview');}
let bytes=0;const chunks=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>32768){res.writeHead(413);res.end('Request too large');return;}chunks.push(chunk);}const request=new Request(url,{method:req.method,headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});const response=await worker.fetch(request,{DB,ASSETS,PRIVATE_OWNER_BOOTSTRAP:'enabled'},{waitUntil:promise=>promise.catch(console.error)});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(error){console.error(error);res.writeHead(500);res.end('Preview error');}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));

