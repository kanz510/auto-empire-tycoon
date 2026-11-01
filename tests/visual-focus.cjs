// Regression: mobile camera must make dealership the focal point; decorative district must stay lightweight.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost'),file=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname.slice(1));
  if(!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(file)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(path.join(root,file)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const ctx=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>typeof zoom==='number'&&typeof S!=='undefined');
  const state=await page.evaluate(()=>{
   const district=scene.getObjectByName('living-district');
   const bounds=[[-22,-14],[-22,7],[33,-14],[33,7]].map(([x,z])=>new THREE.Vector3(x,0,z).project(cam).x);
   return {zoom,targetZ:TT.z,targetX:TT.x,left:Math.min(...bounds),right:Math.max(...bounds),decorCount:district?.children.length||0,instanced:district?.children.filter(c=>c.isInstancedMesh).length||0};
  });
  assert.ok(state.zoom>=.43&&state.zoom<=1.15,'camera should preserve the full dealership on portrait screens: '+JSON.stringify(state));
  assert.ok(state.targetZ>=-2&&state.targetZ<=2.5&&state.targetX>=4,'the dealership should be centered rather than the roadside');
  assert.ok(state.left>-.95&&state.right<.95,'expanded showroom facade must fit the phone viewport: '+JSON.stringify(state));
  assert.ok(state.decorCount>=3&&state.instanced>=2,'district decorations should use instancing');
  await page.locator('[data-o="show"]').tap();assert.ok(await page.locator('#P.on').count());
  assert.deepEqual(errors,[]);
  console.log('PASS: mobile framing, living-district instancing, accessible management panel');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
