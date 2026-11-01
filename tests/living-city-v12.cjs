// V12 RED/GREEN regression: city must be entirely visual and mobile/offline compatible.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost'),file=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname.slice(1));
 if(file.includes('..')||!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(file)){res.writeHead(404).end();return}
 try{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.glb')?'model/gltf-binary':file.endsWith('.png')?'image/png':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(path.join(root,file)))}catch(e){res.writeHead(404).end()}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 for(const [width,height] of [[440,956],[390,844]]){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/?preview=1');
  await page.waitForFunction(()=>typeof cityV12 !== 'undefined'&&cityV12.ready===cityV12.expected,{timeout:30000});
  const state=await page.evaluate(()=>{
   const root=scene.getObjectByName('living-city-v12'),staticProps=cityV12.buildings;
   const before={money:S.money,sold:S.sold,show:S.show,inventory:JSON.stringify(S.inv),orders:JSON.stringify(S.orders)};
   const cars=cityV12.traffic.map(v=>({from:v.m.position.x,first:v.m.position.z}));
   for(let i=0;i<60;i++)updateV12City(.05);
   const moved=cityV12.traffic.map((v,i)=>({dx:v.m.position.x-cars[i].from,z:v.m.position.z}));
   const after={money:S.money,sold:S.sold,show:S.show,inventory:JSON.stringify(S.inv),orders:JSON.stringify(S.orders)};
   let clickable=0,meshCount=0;
   root.traverse(o=>{if(o.userData.key)clickable++;if(o.isMesh)meshCount++});
   const stage={name:root.name,children:root.children.length,models:staticProps.map(x=>({key:x.key,x:x.x,z:x.z,rendered:!!x.group&&x.group.children.length>0})),
    roads:cityV12.roads.children.length,trees:cityV12.trees.children.length,lights:cityV12.lights.children.length,
    expected:cityV12.expected,ready:cityV12.ready,failed:cityV12.failed.length,clickable,meshCount,
    traffic:moved,ambient:cityV12.traffic.length,unchanged:JSON.stringify(before)===JSON.stringify(after),includedInHit:hit.includes(root),
    localUrls:cityV12.keys.map(k=>ART[k]),assetSize:root.children.length};
   return stage;
  });
  assert.ok(state.name==='living-city-v12'&&state.models.length>=5&&state.models.every(x=>x.rendered),'Five real imported buildings must render: '+JSON.stringify(state));
  assert.ok(state.models.every(x=>x.z<=-28||Math.abs(x.x)>=34),'City buildings must avoid dealership footprint: '+JSON.stringify(state.models));
  assert.ok(state.roads>=6&&state.trees>=7&&state.lights>=4&&state.meshCount>=15,'Street and greenery must be visible');
  assert.ok(state.ambient===2&&state.traffic.every(x=>Math.abs(x.dx)>.1),'Visual cars must move, without gameplay state changes');
  assert.ok(state.unchanged,'City tick mutated saved/economic state');
  assert.ok(state.clickable===0&&!state.includedInHit,'City props may not create new panels');
  assert.ok(state.localUrls.every(url=>url.startsWith('./dist/city-')&&url.endsWith('.glb')),'No remote assets');
  assert.ok(state.failed===0,'GLB imports failed: '+JSON.stringify(state));
  assert.deepEqual(errors,[],'No runtime JS errors');
  await page.screenshot({path:path.join(root,'test-results',`v12-${width}x${height}.png`),animations:'disabled'});
  await ctx.close();
  console.log('PASS V12 city on '+width+'x'+height+': licensed local models, urban detail, visual-only traffic');
 }
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
