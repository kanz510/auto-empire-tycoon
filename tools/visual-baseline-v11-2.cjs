const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
(async()=>{
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/screenshots');
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1'),file=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1));
 if(file.includes('..')||! /^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(file)){res.writeHead(404).end();return}
 try{const src=path.join(root,file);res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.glb')?'model/gltf-binary':file.endsWith('.png')?'image/png':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(src))}catch(e){res.writeHead(404).end()}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const result={version:'v11.1 before visual fixes',date:'2026-11-01',vehicles:{},camera:[],characters:[]};
 for(const [w,h] of [[440,956],[390,844]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/?preview=1';
  await page.goto(base);await page.waitForFunction(()=>typeof GLB_ASSETS!=='undefined'&&GLB_ASSETS.readyCars===4&&CHARACTERS_V11.ready===4);
  if(!Object.keys(result.vehicles).length){
   result.vehicles=await page.evaluate(()=>{
    const data={};
    for(const k of KS){let a=[];vehicleTemplates[k].traverse(o=>{if(!o.isMesh)return;
     const ms=Array.isArray(o.material)?o.material:[o.material];a.push({mesh:o.name,parent:o.parent?.name,geometry:o.geometry?.type,materials:ms.map(m=>({name:m.name,color:m.color?.getHexString(),hasMap:!!m.map,vertexColors:m.vertexColors,metalness:m.metalness,roughness:m.roughness,transparent:m.transparent}))})});data[k]=a}
    return data;
   });
   console.log('KENNEY_VEHICLE_MATERIALS',JSON.stringify(result.vehicles));
  }
  for(const tier of [1,2,3]){
   const data=await page.evaluate(level=>{
    S.show=level;applyVis();T.copy(TT);fit();cam.position.copy(T).add(cameraOffset);cam.lookAt(T);cam.updateMatrixWorld(true);
    const pts=[[15,-11],[15,3],[27,-11],[27,3],[33,-11],[33,3]].map(([x,z])=>{const v=new THREE.Vector3(x,1,z).project(cam);return [+v.x.toFixed(3),+v.y.toFixed(3)]});
    const body={viewport:[innerWidth,innerHeight],tier:level,zoom,target:[TT.x,TT.y,TT.z],wingScale:wing.scale.x,wingVisible:wing.visible,visibleAtX:pts};
    return body;
   },tier);
   await page.waitForTimeout(400);
   await page.screenshot({path:path.join(out,`before-${w}x${h}-show${tier}.png`),animations:'disabled'});
   result.camera.push(data);console.log('BASELINE_FRAMING',JSON.stringify(data));
  }
  await page.locator('#preview-toggle').click();await page.locator('#preview-crowd').click();
  await page.waitForTimeout(900);
  result.characters.push(await page.evaluate(()=>{
   return {size:[innerWidth,innerHeight],models:v11DemoCrowd.map(c=>({role:c.m.userData.characterRole,imported:!!c.m.userData.characterImported,height:c.m.userData.characterVisual?+new THREE.Box3().setFromObject(c.m.userData.characterVisual).getSize(new THREE.Vector3()).y.toFixed(3):0})),loaded:CHARACTERS_V11.ready};
  }));
  await page.screenshot({path:path.join(out,`before-${w}x${h}-crowd.png`),animations:'disabled'});
  if(errors.length)throw Error(JSON.stringify(errors));
  await ctx.close();
 }
 fs.writeFileSync(path.join(out,'baseline-materials-and-bounds.json'),JSON.stringify(result,null,2)+'\n');
 console.log('BASELINE_SAVED',JSON.stringify({screenshots:8,cars:Object.keys(result.vehicles),characters:result.characters}));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
