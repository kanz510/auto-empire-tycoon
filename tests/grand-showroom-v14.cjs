// V14: distinct architectural tiers, noninteractive meshes and stable economics.
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
   await page.waitForFunction(()=>typeof grandV14!=='undefined'&&grandV14.root.parent===scene&&cityV12.ready===cityV12.expected,{timeout:30000});
   const check=await page.evaluate(()=>{
    const before=JSON.stringify({money:S.money,show:S.show,inv:S.inv,orders:S.orders,staff:S.staff,sold:S.sold});
    const root=scene.getObjectByName('grand-showroom-v14'),out=[];const bounds=grandV14.bounds;
    for(const tier of [1,2,3]){
     S.show=tier;updateGrandDealershipV14(.05);
     let keys=0,meshes=0,geom=0;
     root.traverse(o=>{if(o.userData.key)keys++;if(o.isMesh){meshes++;geom++}});
     out.push({tier,active:grandV14.active,visible:[1,2,3].map(i=>grandV14.tiers[i].visible),
      meshes,keys,children:grandV14.tiers[tier].children.length});
    }
    S.show=1;updateGrandDealershipV14(0);
    const after=JSON.stringify({money:S.money,show:S.show,inv:S.inv,orders:S.orders,staff:S.staff,sold:S.sold});
    return {out,same:before===after,inHit:hit.includes(root),bounds,shadowEnabled:ren.shadowMap.enabled};
   });
   assert.ok(check.same,'Tier changes must not affect economy or save');
   assert.ok(!check.inHit,'Decorative scene may not be clickable');
   assert.ok(check.bounds.maxX-check.bounds.minX>=53,'Showroom must be physically wider than V13');
   assert.ok(check.bounds.maxY>=10,'Flagship facade must be visibly taller');
   for(const [i,v] of check.out.entries()){
    assert.equal(v.tier,i+1);
    assert.equal(v.active,i+1);
    assert.deepEqual(v.visible,[true,i>=1,i>=2]);
    assert.ok(v.children>=2&&v.meshes>45&&v.keys===0,'Architecture must have real, non-interactive meshes');
   }
   assert.deepEqual(errors,[]);
   const out=path.join(root,'docs/screenshots');fs.mkdirSync(out,{recursive:true});
   for(const tier of [1,2,3]){
    await page.evaluate(tier=>{S.show=tier;applyVis();updateGrandDealershipV14(0)},tier);
    await page.waitForTimeout(160);
    await page.screenshot({path:path.join(out,`v14-${width}x${height}-show${tier}.png`),animations:'disabled'});
   }
   console.log('PASS V14 '+width+'x'+height+': tiered flagship architecture, no economy or hit-target mutations');
   await ctx.close();
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
