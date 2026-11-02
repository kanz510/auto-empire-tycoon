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

   // 6. Spatial separation: VIP auction podium must never overlap customer parking or turntables
   const podPos=empireV16.auctionPod.position;
   const minParkDist=Math.min(...PX.map(x=>Math.hypot(podPos.x-x,podPos.z-7)));
   const minTurntableDist=Math.min(...SP.map(([x,z])=>Math.hypot(podPos.x-x,podPos.z-z)));
   const backRowSeparation=Math.hypot(slots[4].ax-slots[5].ax,slots[4].az-slots[5].az);
   let visibleV13Tubes=0;
   grandV13.root.traverse(c=>{if(c.isMesh&&c.geometry?.type==='TubeGeometry'&&c.visible)visibleV13Tubes++});

   return {
    hadContract,contractCompleted,
    prestige:S.prestige,basePrice,afterPrestigePrice,
    tuningStage:S.tuning[0],afterTunePrice,paintedHex,ringVisible,
    auctionActive,auctionFinished,
    sunsetNightLights,nightMode,
    minParkDist,minTurntableDist,backRowSeparation,visibleV13Tubes,
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
  assert.ok(out.minParkDist>12,'VIP Auction podium must not overlap customer parking spots');
  assert.ok(out.minTurntableDist>4,'VIP Auction podium must not overlap showroom turntables');
  assert.ok(out.backRowSeparation>4,'Back-row customer/staff consultation spots must not overlap');
  assert.equal(out.visibleV13Tubes,0,'Legacy V13 front arch tube must remain hidden in cutaway view');
  assert.match(out.bannerText,/HĐ #2/,'HUD mission bar must display active dynamic contract');

  // Verify UI panels render the new V16 cards cleanly
  await page.locator('[data-o="show"]').tap();
  assert.ok(await page.locator('[data-v16="prestige"]').count(),'Showroom panel must render Prestige button');
  await page.locator('[data-o="inv"]').tap();
  assert.ok(await page.locator('[data-v16="auction:0"]').count(),'Inventory panel must render VIP Auction cards');
  await page.locator('[data-o="menu"]').tap();
  assert.ok(await page.locator('.v16-chart').count(),'Management panel must render 24h profit chart');

  // Verify Bug #2: Page title version matches v16.1
  assert.equal(await page.title(),'Auto Empire Tycoon 3D v16.1','Page title must match current version v16.1');

  // Verify Bug #3: WebGL context lost / restored shows and hides readable banner, exposure & linear Fog intact
  const webglCheck=await page.evaluate(()=>{
   const evLost=new Event('webglcontextlost',{cancelable:true});
   ren.domElement.dispatchEvent(evLost);
   const lostState=webglLost&&$('webgl-error')&&$('webgl-error').style.display==='block'&&$('webgl-error').textContent.includes('WebGL');
   ren.domElement.dispatchEvent(new Event('webglcontextrestored'));
   const restoredState=!webglLost&&$('webgl-error').style.display==='none';
   return {lostState,restoredState,exposure:ren.toneMappingExposure,isLinearFog:!!scene.fog?.isFog};
  });
  assert.equal(webglCheck.lostState,true,'webglcontextlost must display a readable error banner');
  assert.equal(webglCheck.restoredState,true,'webglcontextrestored must recover and hide error banner');
  assert.equal(webglCheck.exposure,1.15,'toneMappingExposure must remain pinned at 1.15');
  assert.equal(webglCheck.isLinearFog,true,'scene.fog must remain linear THREE.Fog');

  // Verify Bug #1: Stale tab lock expires cleanly on load, and clicking "Nhận" claims lock permanently without deleting save
  await page.evaluate(()=>{
   S.money=777777;save(true);
   localStorage.setItem('aet6-owner',JSON.stringify({id:'stale-ghost-tab',at:Date.now()-60000}));
  });
  await page.reload();
  await page.waitForFunction(()=>typeof S!=='undefined'&&typeof claimTabLock==='function');
  const staleLockCheck=await page.evaluate(()=>({
   owner,
   money:S.money,
   modalDisplay:getComputedStyle($('modal')).display,
   leaseId:readLease()?.id,
   tabId
  }));
  assert.equal(staleLockCheck.owner,true,'Stale lock must be claimed automatically on load');
  assert.equal(staleLockCheck.money,777777,'Player save aet6 must be preserved when claiming stale lock');
  assert.equal(staleLockCheck.modalDisplay,'none','Modal must not appear when lock is stale');
  assert.equal(staleLockCheck.leaseId,staleLockCheck.tabId,'Active tab must write its own tabId into aet6-owner');

  // Simulate an active second tab lock, then click "Nhận" to take over ownership
  await page.evaluate(()=>{
   localStorage.setItem('aet6-owner',JSON.stringify({id:'active-other-tab',at:Date.now()}));
   lease();if(!owner)showLockModal();
  });
  assert.equal(await page.evaluate(()=>!owner&&$('modal').style.display==='flex'),true,'Active second tab lock must show modal');
  await page.locator('#modal button.btn').tap();
  const claimedCheck=await page.evaluate(()=>{
   lease();if(!owner)showLockModal();
   return {owner,modalDisplay:$('modal').style.display,leaseId:readLease()?.id,tabId,money:S.money};
  });
  assert.equal(claimedCheck.owner,true,'Clicking Nhận must reclaim tab ownership');
  assert.equal(claimedCheck.modalDisplay,'none','Modal must stay closed after clicking Nhận');
  assert.equal(claimedCheck.leaseId,claimedCheck.tabId,'aet6-owner must be updated to current tabId');
  assert.equal(claimedCheck.money,777777,'Save aet6 must remain intact after lock takeover');

  // Verify V17 Grand Metropolis: 3D Helicopter, Hologram Price Badges, Turbo, Motor Show & Quick-Action Dock
  const v17Check=await page.evaluate(()=>{
   S.money=500000;S.show=3;
   activateTurbo();
   startMotorShow();
   updateMetropolisV17(.1);
   const hasDock=!!$('v17-dock');
   const heliVisible=metropolisV17.heli.visible;
   const spotVisible=metropolisV17.spotlights.visible;
   const holoVisible=metropolisV17.holoSprites.some(b=>b.sprite.visible);
   const beforeDeals=S.dealsClosed;
   negotiateVIP();
   return {
    hasDock,heliVisible,spotVisible,holoVisible,
    turboActive:S.turbo>0,
    expoActive:S.motorShow>0&&S.showsHosted>=1,
    custCount:custs.length,
    deals:S.dealsClosed>=beforeDeals
   };
  });
  assert.ok(v17Check.hasDock&&v17Check.heliVisible&&v17Check.spotVisible&&v17Check.holoVisible,'V17 3D Helicopter, Spotlights, Hologram Signs & Quick Dock must be active');
  assert.ok(v17Check.turboActive&&v17Check.expoActive&&v17Check.custCount>=1,'V17 Turbo Overdrive, Motor Show Expo & VIP Negotiation must function');

  assert.deepEqual(errors,[]);
  console.log('PASS V16.1 + V17: Infinite Contracts, VIP Auctions, Prestige, Day/Night, Tuning, Stale Lock Recovery, WebGL Diagnostics & V17 Metropolis');
  await ctx.close();
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
