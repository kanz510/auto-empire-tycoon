// V16 Empire Expansion test: Dynamic Contracts, VIP Hypercar Auctions, Prestige,
// Day/Sunset/Night Lighting, Custom Tuning & Live 3D Repainting, 24h Sparkline Chart.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{
  const p=new URL(req.url,'http://localhost').pathname,f=p==='/'?'index.html':decodeURIComponent(p.slice(1));
  if(f.includes('..')||!/^(index.html|release.json|sw.js|manifest.webmanifest|dist\/[\w.-]+|vendor\/[\w.-]+|assets\/[\w.-]+)$/.test(f)){res.writeHead(404).end();return}
  try{res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.glb')?'model/gltf-binary':f.endsWith('.png')?'image/png':f.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(path.join(root,f)))}catch(e){res.writeHead(404).end()}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  const ctx=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.waitForFunction(()=>typeof empireV16!=='undefined'&&GLB_ASSETS.readyCars===4,{timeout:30000});

  const out=await page.evaluate(()=>{
   S.money=2000000;S.auto=0;S.mi=MIS.length;
   // 1. Dynamic Contract generation & completion
   S.contract=null;S.contractsDone=0;
   const c1=ensureContract();
   const hadContract=!!c1&&c1.key==='sold';
   S.sold=c1.target;
   hud();
   const contractCompleted=S.contractsDone===1&&S.contract&&S.contract.id===2;

   // 2. Prestige upgrade (+8% vehicle price)
   const basePrice=quote('hatch',{d:slots[0],pref:'',vip:false});
   upgradePrestige();
   const afterPrestigePrice=quote('hatch',{d:slots[0],pref:'',vip:false});

   // 3. Custom Tuning Stage 1-3 (+12%, +25%, +40%) & Live Paint Studio
   upgradeTuning(0);
   const afterTunePrice=quote('hatch',{d:slots[0],pref:'',vip:false});
   paintSlot(0,0x00b0ff);
   const paintedHex=slots[0].mesh?.userData?.paintHex;
   const ringVisible=empireV16.tuningRings[0].group.visible;

   // 4. VIP Hypercar Auction lifecycle
   const beforeMoney=S.money;
   startAuction(0);
   const auctionActive=!!S.auction&&empireV16.auctionPod.visible&&!!empireV16.auctionCar;
   for(let i=0;i<720;i++)updateEmpireV16(.05);
   const auctionFinished=!S.auction&&S.auctionsWon===1&&S.money>beforeMoney;

   // 5. Day / Sunset / Night Cycle
   cycleTimeMode(); // sunset
   const sunsetNightLights=empireV16.nightLights.visible&&S.timeMode==='sunset';
   cycleTimeMode(); // night
   const nightMode=empireV16.nightLights.visible&&S.timeMode==='night';
   S.timeMode='day';updateAtmosphere(0);

   return {
    hadContract,contractCompleted,
    prestige:S.prestige,basePrice,afterPrestigePrice,
    tuningStage:S.tuning[0],afterTunePrice,paintedHex,ringVisible,
    auctionActive,auctionFinished,
    sunsetNightLights,nightMode,
    bannerText:$('mb').textContent
   };
  });

  assert.equal(out.hadContract,true,'Should generate infinite contract when initial missions finish');
  assert.equal(out.contractCompleted,true,'Should complete contract and roll over to Contract #2');
  assert.equal(out.prestige,1,'Prestige should increment to level 1');
  assert.ok(out.afterPrestigePrice>out.basePrice,'Prestige must increase vehicle quote price');
  assert.equal(out.tuningStage,1,'Slot 0 tuning should reach Stage 1');
  assert.ok(out.afterTunePrice>out.afterPrestigePrice,'Tuning must increase slot quote price');
  assert.equal(out.paintedHex,0x00b0ff,'Live paint studio must recolor 3D car on turntable');
  assert.equal(out.ringVisible,true,'Tuned turntable must display 3D halo ring');
  assert.equal(out.auctionActive,true,'Starting VIP auction must spawn 3D hypercar podium');
  assert.equal(out.auctionFinished,true,'Completed VIP auction must pay out profit and increment auctionsWon');
  assert.ok(out.sunsetNightLights&&out.nightMode,'Sunset and Night modes must activate 3D neon lights');
  assert.match(out.bannerText,/Hợp đồng #2/,'HUD mission bar must display active dynamic contract');

  // Verify UI panels render the new V16 cards cleanly
  await page.locator('[data-o="show"]').tap();
  assert.ok(await page.locator('[data-v16="prestige"]').count(),'Showroom panel must render Prestige button');
  await page.locator('[data-o="inv"]').tap();
  assert.ok(await page.locator('[data-v16="auction:0"]').count(),'Inventory panel must render VIP Auction cards');
  await page.locator('[data-o="menu"]').tap();
  assert.ok(await page.locator('.v16-chart').count(),'Management panel must render 24h profit chart');

  assert.deepEqual(errors,[]);
  console.log('PASS V16: Infinite Contracts, VIP Hypercar Auctions, Prestige, Day/Night Neon, Custom Tuning & Paint Studio, 24h Profit Chart');
  await ctx.close();
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
