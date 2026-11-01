// Real-browser regressions for order priority, management readability and GPU resource reuse.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
const root=path.resolve(__dirname,'..');const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),file=u.pathname==='/'?'index.html':u.pathname.slice(1);if(!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(file)){res.writeHead(404).end();return}try{res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(path.join(root,file)))}catch(e){res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;let failures=0;const errors=[];
try{
 browser=await chromium.launch({headless:true,...(process.env.BROWSER_BIN?{executablePath:process.env.BROWSER_BIN}:{}),args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const ctx=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true,deviceScaleFactor:1});const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>typeof S!=='undefined');
 const run=async(name,test)=>{try{await test();console.log('PASS',name)}catch(e){failures++;console.error('FAIL',name,e.message)}};
 await page.evaluate(()=>{S.auto=0;S.money=100000;S.mi=MIS.length;spawnT=1e9;custs.forEach(forceLeave);$('modal').style.display='none'});
 await run('one imported car fulfills a ready order before display allocation',async()=>{
  const out=await page.evaluate(()=>{slots.forEach(d=>{if(d.mesh)scene.remove(d.mesh);d.mesh=null;d.car=null;d.res=null});S.inv={hatch:0,sedan:0,suv:0,sport:0};S.orders=[{id:101,k:'hatch',elapsed:45}];const sold=S.sold;buyStock('hatch',1);return{orders:S.orders.length,sold:S.sold-sold,display:slots.filter(d=>d.car).length}});
  assert.deepEqual(out,{orders:0,sold:1,display:0});
 });
 await run('non-ready order retains its delay',async()=>{assert.equal(await page.evaluate(()=>{S.orders=[{id:102,k:'hatch',elapsed:0}];buyStock('hatch',1);return S.orders.length===1&&S.orders[0].elapsed<1}),true)});
 await run('same-size static meshes reuse geometry',async()=>{assert.equal(await page.evaluate(()=>new Set(Array.from({length:50},()=>box(2,3,4,0x112233,0,0,0).geometry)).size),1)});
 await run('menu exposes readable profit and waiting summaries',async()=>{
  await page.evaluate(()=>{S.profit=1000;S.ops=200;save(true);openP('menu')});await page.waitForTimeout(300);
  assert.equal(await page.locator('[data-metric="net-profit"]').textContent(),'$800');
  const bounds=await page.locator('.management-summary').boundingBox();assert.ok(bounds&&bounds.width<=424&&bounds.width>200);
  assert.ok(await page.locator('[data-a="save"]').count());
 });
 await run('generated local floor renders beyond checkerboard fallback',async()=>{
  let count=0;for(let i=0;i<20;i++){count=await page.evaluate(()=>{const c=tex.image,d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;const colors=new Set();for(let j=0;j<d.length;j+=64)colors.add(d[j]+','+d[j+1]+','+d[j+2]);return colors.size});if(count>32)break;await page.waitForTimeout(100)}assert.ok(count>32,'floor image should populate the canvas; colors='+count);
 });
 await page.screenshot({path:process.env.POLISH_SCREENSHOT||path.join(root,'test-results/mobile-management.png')}).catch(e=>{if(!fs.existsSync(path.join(root,'test-results'))){fs.mkdirSync(path.join(root,'test-results'));return page.screenshot({path:path.join(root,'test-results/mobile-management.png')})}throw e});
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
 await ctx.setOffline(true);await page.reload();await page.waitForFunction(()=>typeof S!=='undefined');
 await run('offline reopening keeps the floor and save',async()=>{assert.equal(await page.evaluate(()=>S.profit),1000);let count=0;for(let i=0;i<20;i++){count=await page.evaluate(()=>{const d=tex.image.getContext('2d').getImageData(0,0,tex.image.width,tex.image.height).data;return new Set(Array.from({length:Math.floor(d.length/64)},(_,n)=>d[n*64]+','+d[n*64+1]+','+d[n*64+2])).size});if(count>32)break;await page.waitForTimeout(100)}assert.ok(count>32)});
 assert.deepEqual(errors,[]);if(failures)throw Error(failures+' polish checks failed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
