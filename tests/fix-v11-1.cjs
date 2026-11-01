// V11.1 regressions: reset must survive pagehide, staff GLB taps resolve ancestors,
// and private orders must include every unlocked car type.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{
   const p=new URL(req.url,'http://localhost').pathname;
   if(p.includes('..') || !/^(\/|\/index.html|\/release.json|\/sw.js|\/manifest.webmanifest|\/assets\/[\w.-]+|\/dist\/[\w.-]+|\/vendor\/[\w.-]+)$/.test(p)){res.writeHead(404).end();return}
   const file=path.join(root,p==='/'?'index.html':p.slice(1));
   try{res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.glb')?'model/gltf-binary':p.endsWith('.css')?'text/css':p.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
   browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
   const context=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   await page.addInitScript(()=>{Math.random=()=>0.99});
   await page.goto('http://127.0.0.1:'+server.address().port+'/');
   await page.waitForFunction(()=>typeof S!=='undefined'&&typeof orderCar==='function');
   const orders=await page.evaluate(()=>{
     S.show=3;S.auto=0;S.orders=[];let foundSport=false;
     for(let i=0;i<100;i++){orderCar();if(S.orders[0]?.k==='sport')foundSport=true;S.orders=[]}
     return {foundSport,unlocked:KS.filter(x=>CARS[x].lv<=S.show),show:S.show};
   });
   assert.equal(orders.foundSport,true,'Private order should include sport when showroom level 3 unlocks four cars: '+JSON.stringify(orders));
   await page.waitForFunction(()=>CHARACTERS_V11.ready===4&&staff[0].m.userData.characterImported,{timeout:30000});
   const tapResult=await page.evaluate(()=>{
     const root=staff[0].m;let leaf;
     root.userData.characterVisual.traverse(o=>{if(!leaf&&o.isMesh&&!o.userData.key)leaf=o});
     if(!leaf)return {leaf:false,cur};
     const original=ray.intersectObjects;
     try{ray.intersectObjects=()=>[{object:leaf}];tap(120,240)}
     finally{ray.intersectObjects=original}
     return {leaf:true,cur,panel:P.textContent};
   });
   assert.equal(tapResult.leaf,true,'Need GLB child without a key');
   assert.equal(tapResult.cur,'staff','Tapping GLB mesh must resolve parent staff key');
   assert.match(tapResult.panel,/Nhân viên/,'Staff panel must not be blank/stale');
   await page.evaluate(()=>{
     S.money=123456;S.show=3;S.orders=[];save(true);window.confirm=()=>true;
   });
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('aet6')).money),123456);
   await page.locator('[data-o="menu"]').tap();
   await page.locator('[data-a="reset"]').tap();
   await page.waitForFunction(()=>typeof S!=='undefined'&&S.money===5000&&S.show===1,{timeout:15000});
   const reset=await page.evaluate(()=>({
     money:S.money,show:S.show,
     saved:JSON.parse(localStorage.getItem('aet6')||'null')?.money,
     backup:JSON.parse(localStorage.getItem('aet6-backup')||'null')?.money
   }));
   assert.equal(reset.money,5000,'Reset must reload default $5000, not resurrect pagehide save');
   assert.equal(reset.show,1);
   assert.ok(reset.saved===undefined||reset.saved===5000,'aet6 must not contain pre-reset progress: '+JSON.stringify(reset));
   assert.ok(reset.backup===undefined||reset.backup===5000,'backup must not resurrect pre-reset progress: '+JSON.stringify(reset));
   assert.deepEqual(errors,[],'No JS runtime errors');
   console.log('PASS v11.1: orderCar all unlocks, nested staff GLB tap, reset survives pagehide');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});

