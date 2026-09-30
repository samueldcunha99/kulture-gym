import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const routes=['/','/about/','/training/','/memberships/','/gallery/','/contact/','/trainers/','/timings/','/policies/','/admin/'];
let references=0;
for(const route of routes){const file='dist/client'+(route==='/'?'':route.slice(0,-1))+'/index.html';const html=await readFile(file,'utf8');assert.match(html,/<h1(?:\s[^>]*)?>/);assert.match(html,/<title>[^<]+<\/title>/);for(const [,raw] of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(!raw.startsWith('/')||raw.startsWith('//')||raw.startsWith('/sign'))continue;const url=new URL(raw,'http://local');const dest=path.extname(url.pathname)?'dist/client'+url.pathname:'dist/client'+url.pathname+'index.html';await access(dest);if(url.hash){const target=await readFile(dest,'utf8');assert(target.includes('id="'+url.hash.slice(1)+'"'),`Missing anchor ${raw}`);}references++;}}
console.log(`Verified ${routes.length} pages and ${references} internal links/assets.`);
