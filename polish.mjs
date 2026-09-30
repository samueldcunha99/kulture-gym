import {readFile,writeFile} from 'node:fs/promises';
let build=await readFile('build.mjs','utf8');
if(!build.includes('/assets/premium.js'))build=build.replace('<script src="/assets/live.js" defer></script>','<script src="/assets/live.js" defer></script><script src="/assets/premium.js" defer></script>');
if(!build.includes('/assets/premium.css'))build=build.replace('<link rel="stylesheet" href="/assets/styles.css">','<link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/premium.css">');
build=build.replaceAll('dist/assets/favicon.svg','dist/client/assets/favicon.svg').replace("await cp('dist/client/assets/favicon.svg','dist/client/assets/favicon.svg');",'');
build=build.replace("if(id==='admin')html=html.replace('Checking your access…','Checking your access…');","if(id==='admin')html=html.replace('<meta name=\"description\"','<meta name=\"robots\" content=\"noindex,nofollow\"><meta name=\"description\"');");
await writeFile('build.mjs',build);
console.log('Applied coordinated transition and metadata integration.');
