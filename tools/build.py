from pathlib import Path
import hashlib,json,shutil
r=Path(__file__).resolve().parents[1]
order=['models','save-state','graphics','visual-v9','assets-3d','characters-v11','showroom-v11','preview-v11','city-v12','grand-v13','grand-v14','economy','gameplay','ai','ui','main','lifecycle']
digest=lambda b:hashlib.sha256(b).hexdigest()[:16]
read_utf8=lambda p:p.read_text(encoding='utf-8').replace('\r\n','\n')
write_utf8=lambda p,s:p.write_text(s,encoding='utf-8',newline='\n')
read_lf_bytes=lambda p:p.read_bytes().replace(b'\r\n',b'\n') if p.suffix in ('.js','.css','.html','.py','.cjs','.json','.webmanifest','.svg','.md') else p.read_bytes()
out=r/'dist'
shutil.rmtree(out,ignore_errors=True)
out.mkdir(exist_ok=True)
art={}
for asset in sorted(p for p in (r/'assets').iterdir() if p.suffix in ('.png','.glb')):
 data=asset.read_bytes();name=asset.stem+'.'+digest(data)+asset.suffix;(out/name).write_bytes(data);art[asset.stem]='./dist/'+name
game=('const ART='+json.dumps(art)+';\n'+''.join(read_utf8(r/f'src/{n}.js') for n in order)).encode('utf-8')
css=read_lf_bytes(r/'styles/game.css');vendor=read_lf_bytes(r/'vendor/three-r128.min.js');loader=read_lf_bytes(r/'vendor/GLTFLoader-r128.js');skeleton=read_lf_bytes(r/'vendor/SkeletonUtils-r128.js')
# Build identity is deterministic across all source, assets and build tooling.
inputs=sorted(p for folder in ['src','styles','vendor','assets','tools'] for p in (r/folder).rglob('*') if p.is_file() and '__pycache__' not in str(p))
build=digest(b''.join(p.relative_to(r).as_posix().encode('utf-8')+read_lf_bytes(p) for p in inputs))
release={'build':build,'game':f'./dist/game.{digest(game)}.js','css':f'./dist/game.{digest(css)}.css','vendor':f'./vendor/three-r128.min.js?v={digest(vendor)}','loader':f'./vendor/GLTFLoader-r128.js?v={digest(loader)}','skeleton':f'./vendor/SkeletonUtils-r128.js?v={digest(skeleton)}'}
(out/release['game'].split('/')[-1]).write_bytes(game);(out/release['css'].split('/')[-1]).write_bytes(css)
icon=read_lf_bytes(r/'assets/icon.svg');icon_name=f'icon.{digest(icon)}.svg';(out/icon_name).write_bytes(icon)
manifest=json.loads(read_utf8(r/'assets/manifest.webmanifest'));manifest['start_url']='../';manifest['scope']='../';manifest['name']='Auto Empire Tycoon 3D';manifest['icons']=[{'src':'./'+icon_name,'sizes':'any','type':'image/svg+xml','purpose':'any maskable'}]
manifest_bytes=json.dumps(manifest).encode('utf-8');release['manifest']=f'./dist/manifest.{digest(manifest_bytes)}.webmanifest';(out/release['manifest'].split('/')[-1]).write_bytes(manifest_bytes)
boot=read_utf8(r/'src/boot.js').replace('__RELEASE__',json.dumps(release))
shell=read_utf8(r/'src/shell.html').replace('</body>',f'<script>{boot}</script></body>')
write_utf8(r/'index.html',shell)
write_utf8(r/'release.json',json.dumps(release))
manifest=read_utf8(r/'assets/manifest.webmanifest');write_utf8(r/'manifest.webmanifest',manifest)
files=['./','./index.html','./release.json','./manifest.webmanifest','./assets/icon.svg',release['game'],release['css'],release['vendor'],release['loader'],release['skeleton'],release['manifest'],'./dist/'+icon_name]+list(art.values())
sw="""const BUILD=__BUILD__,CACHE='auto-empire-v8-'+BUILD,FILES=__FILES__;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(async file=>{const url=new URL(file,self.location.href);url.searchParams.set('__build',BUILD);const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('Incomplete release');if(file==='./release.json'&&(await response.clone().json()).build!==BUILD)throw Error('Mixed release');if(file==='./index.html'&&!(await response.clone().text()).includes(BUILD))throw Error('Stale shell');await c.put(file,response)}))).catch(async err=>{await caches.delete(CACHE);throw err})));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();const old=keys.filter(k=>k.startsWith('auto-empire-')&&k!==CACHE);for(const k of old)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/release.json')){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.open(CACHE).then(c=>c.match('./release.json'))));return}
 if(e.request.mode==='navigate'){e.respondWith(caches.open(CACHE).then(async c=>(await c.match('./index.html'))||fetch(e.request,{cache:'no-store'})));return}
 e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request))||fetch(e.request)));
});
"""
write_utf8(r/'sw.js',sw.replace('__BUILD__',json.dumps(build)).replace('__FILES__',json.dumps(files)))
print(build)
