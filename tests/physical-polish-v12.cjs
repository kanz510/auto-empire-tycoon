// V12.1 physical materials + ACES regression, no changes to gameplay/economy.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{
  const p=new URL(req.url,'http://localhost').pathname;
  const file=p==='/'?'index.html':decodeURIComponent(p.slice(1));
  if(file.includes('..')||!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(file)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.glb')?'model/gltf-binary':file.endsWith('.png')?'image/png':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(path.join(root,file)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  for(const [w,h] of [[440,956],[390,844]]){
   const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:true,hasTouch:true});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/?preview=1');
   await page.waitForFunction(()=>GLB_ASSETS.readyCars===4&&CHARACTERS_V11.ready===4&&cityV12.ready===cityV12.expected,{timeout:30000});
   const outcome=await page.evaluate(()=>{
    const state=JSON.stringify({money:S.money,show:S.show,sold:S.sold,inv:S.inv,orders:S.orders,staff:S.staff});
    const cars=KS.map(k=>{
     const a=makeCar(k,CARS[k].col),b=makeCar(k,CARS[k].col),alt=makeCar(k,0x8759eb);
     const body=a.getObjectByName('body'),wheel=a.wheels[0],origin=vehicleTemplates[k].getObjectByName('body');
     const mat=body?.material;const originalWheel=vehicleTemplates[k].getObjectByName('wheel-front-left');
     let namedGlass=0,glazingValid=true;
     a.traverse(o=>{if(!o.isMesh||!/glass|window/i.test(o.name))return;
      namedGlass++;glazingValid=glazingValid&&o.material.isMeshPhysicalMaterial&&o.material.transmission>.5});
     return {k,color:a.userData.paintHex,expected:CARS[k].col,physical:!!mat?.isMeshPhysicalMaterial,
      coat:mat?.clearcoat,coatRough:mat?.clearcoatRoughness,metal:mat?.metalness,rough:mat?.roughness,
      mapKept:!!mat?.map&&mat.map!==origin.material.map&&mat.map.image!==origin.material.map.image,
      wheelKept:wheel.material===originalWheel?.material,
      v9Details:(a.getObjectByName('vehicle-detail-package')?.children.length||0),
      cached:mat===b.getObjectByName('body')?.material,
      variantDifferent:mat!==alt.getObjectByName('body')?.material,
      namedGlass,glazingValid};
    });
    const result={renderer:{tone:ren.toneMapping,expected:THREE.ACESFilmicToneMapping,
      exposure:ren.toneMappingExposure,encoding:ren.outputEncoding,srgb:THREE.sRGBEncoding,
      shadowEnabled:ren.shadowMap.enabled,shadowType:ren.shadowMap.type,softShadow:THREE.PCFSoftShadowMap},
      floor:{materialType:fl.material.type,roughness:fl.material.roughness,
       metalness:fl.material.metalness,envMapIntensity:fl.material.envMapIntensity,map:!!fl.material.map},
      cars,unchanged:state===JSON.stringify({money:S.money,show:S.show,sold:S.sold,inv:S.inv,orders:S.orders,staff:S.staff})};
    return result;
   });
   const r=outcome.renderer;assert.equal(r.tone,r.expected,'ACES Filmic renderer tone mapping must be active');
   assert.equal(r.encoding,r.srgb,'Keep sRGB output encoding');
   assert.equal(r.exposure,1.15,'Tone mapping exposure');
   assert.ok(r.shadowEnabled&&r.shadowType===r.softShadow,'Retain PCF soft shadows on normal quality');
   const f=outcome.floor;assert.ok(f.map&&f.materialType==='MeshStandardMaterial','Showroom keeps original floor texture');
   assert.ok(Math.abs(f.roughness-.22)<.001&&Math.abs(f.metalness-.12)<.001&&f.envMapIntensity===1,'Premium floor material uses requested roughness/metalness');
   assert.equal(outcome.unchanged,true,'Visual changes must not mutate economic/save data');
   for(const car of outcome.cars){
    assert.ok(car.physical&&car.coat>=.95&&car.coatRough<=.05&&car.rough<=.20&&car.metal>=.7,
      'Car body should use high clearcoat MeshPhysicalMaterial: '+JSON.stringify(car));
    assert.ok(car.color===car.expected&&car.mapKept&&car.wheelKept&&car.v9Details>=2&&car.cached&&car.variantDifferent&&car.glazingValid,
      'GLB paint variants, wheels, v9 details or named glass were corrupted: '+JSON.stringify(car));
   }
   assert.deepEqual(errors,[],'No JS errors');
   const out=path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
   await page.screenshot({path:path.join(out,'physical-polish-'+w+'x'+h+'.png'),animations:'disabled'});
   console.log('PASS V12.1 '+w+'x'+h+': ACES/sRGB, soft shadows, physical clearcoat with mapped body colors, floor, save-safe');
   await context.close();
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
