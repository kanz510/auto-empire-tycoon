const BUILD="7750bb42235d00f1",CACHE='auto-empire-v8-'+BUILD,FILES=["./", "./index.html", "./release.json", "./manifest.webmanifest", "./assets/icon.svg", "./dist/game.43df2a550e85fa18.js", "./dist/game.c09f7a347ef3aae1.css", "./vendor/three-r128.min.js?v=9274bbcec8d96168", "./dist/manifest.e8811bd13e484d88.webmanifest", "./dist/icon.d9c4c0898aa45b72.svg", "./dist/showroom-floor.000183cfecfaa8f0.png"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(async file=>{const url=new URL(file,self.location.href);url.searchParams.set('__build',BUILD);const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('Incomplete release');if(file==='./release.json'&&(await response.clone().json()).build!==BUILD)throw Error('Mixed release');if(file==='./index.html'&&!(await response.clone().text()).includes(BUILD))throw Error('Stale shell');await c.put(file,response)}))).catch(async err=>{await caches.delete(CACHE);throw err})));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();const old=keys.filter(k=>k.startsWith('auto-empire-')&&k!==CACHE);for(const k of old.slice(0,-1))await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/release.json')){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.open(CACHE).then(c=>c.match('./release.json'))));return}
 if(e.request.mode==='navigate'){e.respondWith(caches.open(CACHE).then(async c=>(await c.match('./index.html'))||fetch(e.request,{cache:'no-store'})));return}
 e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request))||fetch(e.request)));
});
