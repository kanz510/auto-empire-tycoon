// Visual V11.2 regression: test actual GLB body maps, scene geometry and tier framing.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost'),p=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname.slice(1));
  if(p.includes('..')||!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(p)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.glb')?'model/gltf-binary':p.endsWith('.css')?'text/css':p.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(path.join(root,p)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  for(const [w,h] of [[440,956],[390,844]]){
   const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/?preview=1');
   await page.waitForFunction(()=>typeof GLB_ASSETS!=='undefined'&&GLB_ASSETS.readyCars===4&&CHARACTERS_V11.ready===4&&GLB_ASSETS.readyProps>=4);
   const cars=await page.evaluate(()=>{
    return KS.map(k=>{
     const a=makeCar(k,CARS[k].col),b=makeCar(k,CARS[k].col),alt=makeCar(k,0x8759eb);
     const paint=a.getObjectByName('body')?.material,source=vehicleTemplates[k].getObjectByName('body').material;
     const tinted=alt.getObjectByName('body')?.material;
     const wheel=a.wheels[0]?.material,origWheel=vehicleTemplates[k].getObjectByName('wheel-front-left')?.material;
     return {k,paintHex:a.userData.paintHex,expected:CARS[k].col,bodyMapDifferent:paint?.map!==source.map,
      bodyMaterialCached:paint===b.getObjectByName('body')?.material,variantUnique:paint!==tinted,
      wheelMaterialSame:wheel===origWheel,detailCount:a.getObjectByName('vehicle-detail-package')?.children.length||0,
      paintTextureType:paint?.map?.image?.constructor?.name,paintImageChanged:paint?.map?.image!==source.map.image,
      rootChanged:!!a.userData.assetModel};
    });
   });
   for(const c of cars){
    assert.ok(c.rootChanged&&c.paintHex===c.expected&&c.bodyMapDifferent&&c.bodyMaterialCached&&c.variantUnique&&c.wheelMaterialSame&&c.detailCount>=2&&c.paintImageChanged,
     'V11.2 car body must retain requested showroom color, original wheels and v9 detail: '+JSON.stringify(c));
   }
   const state=await page.evaluate(()=>{
    const snapshots=[];
    for(const level of [1,2,3]){
     S.show=level;applyVis();T.copy(TT);cam.position.copy(T).add(cameraOffset);cam.lookAt(T);cam.updateMatrixWorld(true);
     const endpoints=level===1?[-15.8,15.8]:[-15.8,27.4],coords=[];
     for(const x of endpoints)for(const z of [-11.7,3.8])for(const y of [0,6.9]){
      const p=new THREE.Vector3(x,y,z).project(cam);coords.push([p.x,p.y]);
     }
     snapshots.push({tier:level,zoom,target:[TT.x,TT.z],maxX:Math.max(...coords.map(p=>Math.abs(p[0]))),maxY:Math.max(...coords.map(p=>Math.abs(p[1]))),wingScale:wing.scale.x,visible:wing.visible});
    }
    const de=scene.getObjectByName('premium-gallery-decor'),fallback=scene.getObjectByName('v9-fallback-planters');
    let tagged=0;de?.traverse(o=>{if(o.userData.key)tagged++});
    const fallbackStatus=fallback?.visible,wood=showroomLevelTwo.children.find(o=>o.material?.color?.getHexString()==='c7ab76');
    return {snapshots,decorCount:de?.children.length||0,tagged,planterFallback:fallbackStatus,
     pedRadius:PD.parameters.radiusTop,ringRadius:turntables.children[0].geometry.parameters.radius,
     grassInstances:livingDistrict.children.filter(o=>o.isInstancedMesh).map(o=>o.count),
     wingFloorWidth:wing.children[0].geometry.parameters.width,
     canopyRadius:showroomV11.children.find(o=>o.geometry?.type==='TubeGeometry')?.geometry.parameters.radius,
     charScale:CHARACTERS_V11.ready,woodExists:!!wood};
   });
   for(const x of state.snapshots){
    assert.ok(x.maxX<.96&&x.maxY<.81,'V11.2 camera crops building: '+w+'x'+h+' '+JSON.stringify(x));
    assert.equal(x.wingScale,1,'V11.2 gallery must not scale separately from level-two floor');
    assert.ok(x.zoom>=.6&&x.zoom<=1.15,'preserve reasonable mobile zoom');
   }
   assert.ok(state.decorCount>=8&&state.tagged===0,'V11.2 wing decor must exist but not create new clickable panels');
   assert.equal(state.planterFallback,false,'V11.2 duplicate v9 planters should hide on successful Kenney load');
   assert.ok(state.pedRadius<=2.2&&state.ringRadius<=2.15&&state.wingFloorWidth===10);
   assert.ok(state.grassInstances.some(n=>n<=36&&n>=5),'V11.2 subtle grass mark count');
   assert.ok(state.canopyRadius<=.09);
   await page.locator('#preview-toggle').click();await page.locator('#preview-crowd').click();
   const people=await page.evaluate(()=>v11DemoCrowd.map(x=>({imported:x.m.userData.characterImported,height:new THREE.Box3().setFromObject(x.m.userData.characterVisual).getSize(new THREE.Vector3()).y})));
   assert.ok(people.length===6&&people.every(p=>p.imported&&Math.abs(p.height-2)<.05),'V11.2 characters should be 2.0 scene units: '+JSON.stringify(people));
   assert.deepEqual(errors,[],'No runtime errors');
   await ctx.close();
   console.log('PASS V11.2 '+w+'x'+h+': custom GLB paint/glass/wheels, wing decor, full portrait framing, 2.0 NPC');
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
