// V15: PMREM environment reflections, kinetic flagship crown, skybridge, reflecting pools & helipad.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{
  const p=new URL(req.url,'http://localhost').pathname,f=p==='/'?'index.html':decodeURIComponent(p.slice(1));
  if(f.includes('..')||!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(f)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.glb')?'model/gltf-binary':f.endsWith('.png')?'image/png':f.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(path.join(root,f)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  for(const [width,height] of [[440,956],[390,844]]){
   const ctx=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/?preview=1');
   await page.waitForFunction(()=>typeof grandV15!=='undefined'&&grandV15.root.parent===scene&&cityV12.ready===cityV12.expected,{timeout:30000});
   const check=await page.evaluate(()=>{
    const before=JSON.stringify({money:S.money,show:S.show,inv:S.inv,orders:S.orders,staff:S.staff,sold:S.sold});
    const root=scene.getObjectByName('grand-horizon-v15'),out=[];
    const r0=grandV15.rings[0]?.rotation.y||0;
    for(const tier of [1,2,3]){
     S.show=tier;updateGrandHorizonV15(.05);
     let keys=0,meshes=0;
     root.traverse(o=>{if(o.userData.key)keys++;if(o.isMesh)meshes++});
     out.push({tier,active:grandV15.active,visible:[1,2,3].map(i=>grandV15.tiers[i].visible),meshes,keys});
    }
    const r1=grandV15.rings[0]?.rotation.y||0;
    S.show=1;updateGrandHorizonV15(0);
    const after=JSON.stringify({money:S.money,show:S.show,inv:S.inv,orders:S.orders,staff:S.staff,sold:S.sold});
    return {
     out,same:before===after,inHit:hit.includes(root),
     envReady:grandV15.envReady&&!!scene.environment,
     ringMoved:Math.abs(r1-r0)>.01,
     hasSkybridge:!!root.getObjectByName('grand-v15-skybridge'),
     hasHelipad:!!root.getObjectByName('grand-v15-helipad'),
     hasTotem:!!root.getObjectByName('grand-v15-totem')
    };
   });
   assert.ok(check.same,'V15 tier updates must not mutate economy or save state');
   assert.ok(!check.inHit,'V15 decorative root must not intercept raycast hit targets');
   assert.ok(check.envReady,'V15 PMREM environment map must be active on scene.environment');
   assert.ok(check.ringMoved&&check.hasSkybridge&&check.hasHelipad&&check.hasTotem,'V15 landmarks must exist and animate');
   for(const [i,v] of check.out.entries()){
    assert.equal(v.tier,i+1);
    assert.equal(v.active,i+1);
    assert.deepEqual(v.visible,[true,i>=1,i>=2]);
    assert.ok(v.meshes>=25&&v.keys===0,'V15 meshes must be non-interactive');
   }
   assert.deepEqual(errors,[]);
   console.log('PASS V15 '+width+'x'+height+': PMREM reflections, kinetic crown, skybridge, reflecting pools, helipad');
   await ctx.close();
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
