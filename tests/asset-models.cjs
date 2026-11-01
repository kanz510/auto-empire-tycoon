// Real CC0 glTF assets should replace procedural vehicle meshes without breaking game state.
const { chromium }=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'); const errors=[];
 const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://127.0.0.1'),p=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname.slice(1));
  if(p.includes('..')||!/^(index.html|release.json|sw.js|manifest.webmanifest|assets\/[\w.-]+|vendor\/[\w.-]+|dist\/[\w.-]+)$/.test(p)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.glb')?'model/gltf-binary':p.endsWith('.png')?'image/png':p.endsWith('.css')?'text/css':p.endsWith('.webmanifest')||p.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(path.join(root,p)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const ctx=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>typeof S!=='undefined' && typeof GLB_ASSETS!=='undefined');
  await page.waitForFunction(()=>GLB_ASSETS.readyCars===4,{timeout:30000});
  const result=await page.evaluate(()=>{
   const cash=S.money,sold=S.sold;
   const cars=KS.map(k=>{const c=makeCar(k,CARS[k].col);return {key:k,loaded:!!c.userData.assetModel,wheels:c.wheels.length,meshCount:c.getObjectByName('vehicle-detail-package')?.children.length||0,mesh:c.children.length,source:c.userData.assetSource}});
   const original=traffic.map(o=>!!o.m.userData.assetModel);
   const decor=scene.getObjectByName('asset-showroom-furniture');
   return {cars,original,decor:decor?.children.length||0,stable:S.money===cash&&S.sold===sold};
  });
  assert.ok(result.cars.every(c=>c.loaded && c.wheels===4),JSON.stringify(result.cars));
  assert.ok(result.cars.every(c=>c.source?.endsWith('.glb')),JSON.stringify(result.cars));
  assert.ok(result.original.every(Boolean),'existing traffic should be retrofitted');
  assert.ok(result.decor>=3,'showroom needs imported interior props');
  assert.ok(result.stable,'3D import must not change money or sold count');
  const offline=await page.evaluate(async()=>{const r=await navigator.serviceWorker.ready;return !!r.active});
  assert.equal(offline,true,'service worker must activate and cache local assets');
  assert.deepEqual(errors,[]);console.log('PASS v10 CC0 GLB car models, reuse, showroom props, save-safe loading and local cache');
  await page.screenshot({path:path.join(root,'test-results/assets-v10.png')});
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
