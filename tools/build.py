from pathlib import Path
import hashlib,json,shutil
r=Path(__file__).resolve().parents[1]
order=['models','save-state','graphics','visual-v9','assets-3d','economy','gameplay','ai','ui','main','lifecycle']
digest=lambda b:hashlib.sha256(b).hexdigest()[:16]
out=r/'dist';out.mkdir(exist_ok=True)
art={}
for asset in sorted(p for p in (r/'assets').iterdir() if p.suffix in ('.png','.glb')):
 data=asset.read_bytes();name=asset.stem+'.'+digest(data)+asset.suffix;(out/name).write_bytes(data);art[asset.stem]='./dist/'+name
game=('const ART='+json.dumps(art)+';\n'+''.join((r/f'src/{n}.js').read_text() for n in order)).encode()
css=(r/'styles/game.css').read_bytes();vendor=(r/'vendor/three-r128.min.js').read_bytes();loader=(r/'vendor/GLTFLoader-r128.js').read_bytes()
# Build identity is deterministic across all source, assets and build tooling.
inputs=sorted(p for folder in ['src','styles','vendor','assets','tools'] for p in (r/folder).rglob('*') if p.is_file() and '__pycache__' not in str(p))
build=digest(b''.join(str(p.relative_to(r)).encode()+p.read_bytes() for p in inputs))
out=r/'dist'
out.mkdir(exist_ok=True)
release={'build':build,'game':f'./dist/game.{digest(game)}.js','css':f'./dist/game.{digest(css)}.css','vendor':f'./vendor/three-r128.min.js?v={digest(vendor)}','loader':f'./vendor/GLTFLoader-r128.js?v={digest(loader)}'}
(out/release['game'].split('/')[-1]).write_bytes(game);(out/release['css'].split('/')[-1]).write_bytes(css)
icon=(r/'assets/icon.svg').read_bytes();icon_name=f'icon.{digest(icon)}.svg';(out/icon_name).write_bytes(icon)
manifest=json.loads((r/'assets/manifest.webmanifest').read_text());manifest['start_url']='../';manifest['scope']='../';manifest['name']='Auto Empire Tycoon 3D';manifest['icons']=[{'src':'./'+icon_name,'sizes':'any','type':'image/svg+xml','purpose':'any maskable'}]
manifest_bytes=json.dumps(manifest).encode();release['manifest']=f'./dist/manifest.{digest(manifest_bytes)}.webmanifest';(out/release['manifest'].split('/')[-1]).write_bytes(manifest_bytes)
boot=(r/'src/boot.js').read_text().replace('__RELEASE__',json.dumps(release))
shell=(r/'src/shell.html').read_text().replace('</body>',f'<script>{boot}</script></body>')
(r/'index.html').write_text(shell)
(r/'release.json').write_text(json.dumps(release))
manifest=(r/'assets/manifest.webmanifest').read_text();(r/'manifest.webmanifest').write_text(manifest)
files=['./','./index.html','./release.json','./manifest.webmanifest','./assets/icon.svg',release['game'],release['css'],release['vendor'],release['loader'],release['manifest'],'./dist/'+icon_name]+list(art.values())
sw="""const BUILD=__BUILD__,CACHE='auto-empire-v8-'+BUILD,FILES=__FILES__;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(async file=>{const url=new URL(file,self.location.href);url.searchParams.set('__build',BUILD);const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('Incomplete release');if(file==='./release.json'&&(await response.clone().json()).build!==BUILD)throw Error('Mixed release');if(file==='./index.html'&&!(await response.clone().text()).includes(BUILD))throw Error('Stale shell');await c.put(file,response)}))).catch(async err=>{await caches.delete(CACHE);throw err})));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();const old=keys.filter(k=>k.startsWith('auto-empire-')&&k!==CACHE);for(const k of old.slice(0,-1))await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/release.json')){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.open(CACHE).then(c=>c.match('./release.json'))));return}
 if(e.request.mode==='navigate'){e.respondWith(caches.open(CACHE).then(async c=>(await c.match('./index.html'))||fetch(e.request,{cache:'no-store'})));return}
 e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request))||fetch(e.request)));
});
"""
(r/'sw.js').write_text(sw.replace('__BUILD__',json.dumps(build)).replace('__FILES__',json.dumps(files)))
print(build)
