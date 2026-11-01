// V11: animated Kenney GLBs and read-only visual preview on iPhone.
const {chromium}=require('playwright'), assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1'),p=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1));
  if(p.includes('..')||!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(p)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.glb')?'model/gltf-binary':p.endsWith('.png')?'image/png':p.endsWith('.css')?'text/css':p.endsWith('.json')||p.endsWith('.webmanifest')?'application/json':'text/html');res.end(fs.readFileSync(path.join(root,p)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const ctx=await browser.newContext({viewport:{width:440,height:956},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/?preview=1');
  await page.waitForFunction(()=>typeof CHARACTERS_V11!=='undefined'&&CHARACTERS_V11.ready===4,{timeout:30000});
  const state=await page.evaluate(()=>{
   const employee=staff[0].m;
   const imported=employee.userData.characterImported;
   const skinCount=(()=>{let n=0;employee.traverse(o=>{if(o.isSkinnedMesh)n++});return n})();
   const actions=['idle','walk','interact-right'].every(n=>employee.userData.characterClips?.[n]);
   anim(employee,{mv:true,act:false},12);
   const moving=employee.userData.characterMode==='walk';
   anim(employee,{mv:false,act:true},12.5);
   const interacting=employee.userData.characterMode==='interact-right';
   return {imported,skinCount,actions,moving,interacting,loaded:CHARACTERS_V11.ready};
  });
  assert.ok(state.imported&&state.skinCount>0&&state.actions&&state.moving&&state.interacting,JSON.stringify(state));
  const initial=await page.evaluate(()=>({show:S.show,money:S.money,staff:S.staff}));
  await page.locator('#preview-toggle').click();
  await page.locator('#preview-tier-3').click();
  await page.locator('#preview-crowd').click();
  const preview=await page.evaluate(()=>({
   state:{show:S.show,money:S.money,staff:S.staff},
   people:document.querySelector('#preview-status')?.textContent,
   level3:showroomLevelThree.visible,extra:scene.getObjectByName('v11-preview-actors')?.children.length
  }));
  assert.deepEqual(preview.state,initial,'demo must not change game progression');
  assert.ok(preview.level3&&preview.extra>=3&&preview.people,'visual preview should create characters and tier 3');
  await page.screenshot({path:path.join(root,'test-results/v11-crowd-preview.png')});
  await page.locator('#preview-clear').click();
  assert.equal(await page.locator('#preview-controls').isVisible(),false,'panel should collapse to reveal the showroom');
  assert.equal(await page.evaluate(()=>showroomLevelThree.visible),initial.show>=3,'closing demo must restore actual showroom');
  await page.screenshot({path:path.join(root,'test-results/v11-characters.png')});
  assert.deepEqual(errors,[]);console.log('PASS v11: skinned character assets, locomotion/interaction animations, isolated visual preview, no save mutation');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
