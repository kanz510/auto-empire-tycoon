// Browser regression for visual-only showroom upgrades. Economics and save stay unchanged.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost'),file=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname.slice(1));
  if(!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(file)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(path.join(root,file)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const ctx=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>typeof S!=='undefined'&&typeof makeCar==='function');
  const a=await page.evaluate(()=>{
   const details=KS.map(k=>{const car=makeCar(k),group=car.getObjectByName('vehicle-detail-package');return {key:k,instanced:group?group.children.filter(m=>m.isInstancedMesh).length:0,wheels:car.wheels.length}});
   const visual=scene.getObjectByName('showroom-premium-details');
   const rings=visual?.getObjectByName('showroom-turntables');
   const stageCount=rings?.children.length||0;
   const tier2=visual?.getObjectByName('showroom-level-2');
   S.show=1;applyVis();const hidden=!!tier2&&!tier2.visible;
   S.show=2;applyVis();const revealed=!!tier2&&tier2.visible;
   S.show=1;applyVis();
   const d=slots.find(s=>s.mesh);const prev=d?.mesh.rotation.y??0;
   const cash=S.money,sold=S.sold;for(let i=0;i<45;i++)updateShowcase(.05);
   const motion=d?Math.abs(d.mesh.rotation.y-prev):0;
   return {details,stageCount,hidden,revealed,motion,moneyStable:S.money===cash,soldStable:S.sold===sold};
  });
  assert.ok(a.details.every(d=>d.instanced>=2&&d.wheels>=4),'model accents should use instancing: '+JSON.stringify(a.details));
  assert.ok(a.stageCount>=4,'showroom needs lighted turntable accents');
  assert.equal(a.hidden,true);assert.equal(a.revealed,true);
  assert.ok(a.motion>.005,'display vehicle must animate slowly');
  assert.ok(a.moneyStable&&a.soldStable,'visual tick must not change money/sales');
  const delivery=await page.evaluate(()=>{
   S.show=1;S.auto=0;S.money=100000;S.inv={hatch:0,sedan:0,suv:0,sport:0};S.orders=[];
   const cash=S.money,cost=stockCost('hatch');buyStock('hatch',1);
   const active=deliveryTruck.visible&&deliveryEffect.remaining>0;
   for(let i=0;i<420;i++)updateShowcase(.05);
   return {active,hidden:!deliveryTruck.visible,spent:cash-S.money>=cost};
  });
  assert.ok(delivery.active&&delivery.hidden&&delivery.spent,'delivery animation must follow a valid purchase: '+JSON.stringify(delivery));
  await page.locator('[data-o="menu"]').tap();assert.ok(await page.locator('#P.on').count());
  assert.deepEqual(errors,[]);console.log('PASS: detailed car models, lit stages, upgrade visibility, animation, visual-only economy, delivery, mobile UI');
  await page.screenshot({path:path.join(root,'test-results/showroom-v9.png')}).catch(()=>{});
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
