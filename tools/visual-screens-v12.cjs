// Capture reproducible 390/440px screenshots, from source-controlled GLBs.
const {chromium}=require('playwright'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/screenshots');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost'),p=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname.slice(1));
  if(p.includes('..')||!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(p)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.glb')?'model/gltf-binary':p.endsWith('.png')?'image/png':p.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(path.join(root,p)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const report=[];
  for(const [w,h] of [[440,956],[390,844]]){
   const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/?preview=1');
   await page.waitForFunction(()=>cityV12.ready===cityV12.expected&&GLB_ASSETS.readyCars===4&&CHARACTERS_V11.ready===4,{timeout:30000});
   for(const tier of [1,2,3]){
    const summary=await page.evaluate(level=>{
     S.show=level;applyVis();T.copy(TT);cam.position.copy(T).add(cameraOffset);cam.lookAt(T);cam.updateMatrixWorld(true);
     const model=cityV12.buildings.map(b=>{const c=b.group.getWorldPosition(new THREE.Vector3()).project(cam);return {key:b.key,x:b.x,z:b.z,ndcX:+c.x.toFixed(2),ndcY:+c.y.toFixed(2)}});
     return {level,zoom,buildings:model,loaded:cityV12.ready,failed:cityV12.failed};
    },tier);
    await page.waitForTimeout(220);
    await page.screenshot({path:path.join(out,`v12-${w}x${h}-show${tier}.png`),animations:'disabled'});
    report.push({viewport:[w,h],...summary});console.log('V12_FRAME',JSON.stringify({viewport:[w,h],...summary}));
   }
   await page.locator('#preview-toggle').click();await page.locator('#preview-crowd').click();
   await page.waitForTimeout(550);
   await page.screenshot({path:path.join(out,`v12-${w}x${h}-crowd.png`),animations:'disabled'});
   if(errors.length)throw Error('JavaScript error '+errors.join(';'));
   await ctx.close();
  }
  fs.writeFileSync(path.join(out,'v12-visual-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log('V12_SCREENSHOTS_DONE',report.length+2);
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
