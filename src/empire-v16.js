// V16 Empire Expansion:
// 1. Endgame: Infinite Dynamic Contracts, VIP Hypercar Auctions & Million-Dollar Prestige Upgrades
// 2. Atmosphere: Day / Sunset / Night Cycle & 3D Neon City Lighting
// 3. Mobile UI: 24h Profit Sparkline Chart, Notification Badges & Direct 3D Car/VIP Tap
// 4. Custom Tuning & Paint Studio: Per-Turntable Stage 1-3 Tuning (+12%..+40%) & Live GLB Repainting

const TUNING_STAGES=[
 {n:'Tiêu chuẩn',mult:1,cost:0},
 {n:'Phủ Ceramic Nano (+12%)',mult:1.12,cost:8000},
 {n:'Bodykit Carbon & Mâm Sport (+25%)',mult:1.25,cost:22000},
 {n:'Full Stage 3 Signature (+40%)',mult:1.40,cost:55000}
];
const PAINT_SWATCHES=[
 {n:'Đỏ Rosso',hex:0xe53935,css:'#e53935'},
 {n:'Vàng Giallo',hex:0xffca28,css:'#ffca28'},
 {n:'Xanh Miami',hex:0x00b0ff,css:'#00b0ff'},
 {n:'Tím Ultraviolet',hex:0x9c27b0,css:'#9c27b0'},
 {n:'Xanh Emerald',hex:0x00c853,css:'#00c853'},
 {n:'Trắng Pearl',hex:0xf5f7fa,css:'#f5f7fa'}
];
const AUCTIONS=[
 {n:'Porsche 911 GT3 RS',cost:45000,payout:64000,dur:35,rep:3,gems:2,col:0x00b0ff},
 {n:'Ferrari SF90 Stradale',cost:180000,payout:255000,dur:45,rep:5,gems:4,col:0xe53935},
 {n:'Bugatti Tourbillon VIP',cost:650000,payout:920000,dur:60,rep:10,gems:8,col:0xffca28}
];

function normalizeV16State(){
 S.prestige=Math.max(0,Math.min(10,Math.floor(Number(S.prestige)||0)));
 S.tuning=Array.isArray(S.tuning)?Array.from({length:6},(_,i)=>Math.max(0,Math.min(3,Math.floor(Number(S.tuning[i])||0)))):[0,0,0,0,0,0];
 S.slotPaint=Array.isArray(S.slotPaint)?Array.from({length:6},(_,i)=>Number.isInteger(S.slotPaint[i])?S.slotPaint[i]:null):[null,null,null,null,null,null];
 S.auctionsWon=Math.max(0,Math.floor(Number(S.auctionsWon)||0));
 S.auction=(S.auction&&typeof S.auction==='object'&&Number.isInteger(S.auction.tier)&&AUCTIONS[S.auction.tier])?{tier:S.auction.tier,elapsed:Math.max(0,Number(S.auction.elapsed)||0)}:null;
 S.contractsDone=Math.max(0,Math.floor(Number(S.contractsDone)||0));
 S.contract=(S.contract&&typeof S.contract==='object'&&typeof S.contract.key==='string'&&Number.isFinite(S.contract.target))?S.contract:null;
 S.timeMode=['day','sunset','night','auto'].includes(S.timeMode)?S.timeMode:'day';
}
normalizeV16State();

const empireV16={
 root:new THREE.Group(),
 nightLights:new THREE.Group(),
 tuningRings:[],
 auctionPod:new THREE.Group(),
 auctionCar:null,
 auctionTierRendered:-1,
 selectedSlot:0,
 clock:0,
 activeTimePhase:'day'
};
empireV16.root.name='empire-expansion-v16';
empireV16.nightLights.name='v16-night-lights';
empireV16.auctionPod.name='v16-auction-podium';
empireV16.root.add(empireV16.nightLights,empireV16.auctionPod);
scene.add(empireV16.root);

// 1. 3D Tuning Halo Rings around the 6 Showroom Turntables
SP.forEach((p,i)=>{
 const g=new THREE.Group();
 const outer=new THREE.Mesh(
  new THREE.TorusGeometry(2.26,.045,6,40),
  new THREE.MeshBasicMaterial({color:0x6be6ff,transparent:true,opacity:.85,depthWrite:false})
 );
 outer.rotation.x=-Math.PI/2;outer.position.set(p[0],.44,p[1]);
 const inner=new THREE.Mesh(
  new THREE.TorusGeometry(1.88,.035,6,36),
  new THREE.MeshBasicMaterial({color:0xffdf9a,transparent:true,opacity:.75,depthWrite:false})
 );
 inner.rotation.x=-Math.PI/2;inner.position.set(p[0],.51,p[1]);
 g.add(outer,inner);
 g.visible=(S.tuning[i]||0)>0;
 empireV16.root.add(g);
 empireV16.tuningRings.push({group:g,outer,inner});
});

// 2. 3D VIP Auction Display Podium on the Front Plaza
{
 const podMat=new THREE.MeshStandardMaterial({color:0x142634,metalness:.65,roughness:.22});
 podMat.color.convertSRGBToLinear();
 const goldMat=new THREE.MeshStandardMaterial({color:0xffd54f,metalness:.85,roughness:.18});
 goldMat.color.convertSRGBToLinear();
 const base=new THREE.Mesh(new THREE.CylinderGeometry(2.25,2.4,.28,28),podMat);
 base.receiveShadow=true;empireV16.auctionPod.add(base);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(2.28,.06,8,36),new THREE.MeshBasicMaterial({color:0xffdf9a}));
 ring.rotation.x=Math.PI/2;ring.position.y=.15;empireV16.auctionPod.add(ring);
 empireV16.auctionPod.position.set(-5.6,.18,4.6);
 empireV16.auctionPod.visible=false;
}

// 3. 3D City & Dealership Night Neon Lights
{
 const warmGlow=new THREE.MeshBasicMaterial({color:0xffe099,transparent:true,opacity:.85,depthWrite:false});
 const cyanNeon=new THREE.MeshBasicMaterial({color:0x6be6ff});
 const goldNeon=new THREE.MeshBasicMaterial({color:0xffd564});
 // Streetlight ground pools along main road & V12 back avenue
 for(const [x,z] of [[-14,10],[0,10],[14,10],[-39,-18.7],[-19,-18.7],[0,-18.7],[20,-18.7],[40,-18.7]]){
  const pool=new THREE.Mesh(new THREE.CircleGeometry(2.6,16),warmGlow);
  pool.rotation.x=-Math.PI/2;pool.position.set(x,.13,z);
  empireV16.nightLights.add(pool);
 }
 // Neon strips along showroom front plaza & rear crown
 const frontStrip=new THREE.Mesh(new THREE.BoxGeometry(52,.06,.12),cyanNeon);
 frontStrip.position.set(5.6,.22,6.4);empireV16.nightLights.add(frontStrip);
 const rearStrip=new THREE.Mesh(new THREE.BoxGeometry(54,.12,.14),goldNeon);
 rearStrip.position.set(5.6,7.85,-10.4);empireV16.nightLights.add(rearStrip);
 // Illuminated windows on V12 city buildings at night
 [[-35,-30,8,4.5],[-19.5,-31,8,4.2],[-3,-31.5,8.5,6.5],[14.5,-30.5,9,5.5],[33,-30,8.5,4.2]].forEach(([x,z,w,y])=>{
  for(const dy of [-1.4,0,1.4]){
   const win=new THREE.Mesh(new THREE.PlaneGeometry(w*.7,.42),warmGlow);
   win.position.set(x,y+dy,z);
   empireV16.nightLights.add(win);
  }
 });
 empireV16.nightLights.visible=false;
}

// 4. Day / Sunset / Night Lighting Controller
const hemiLight=scene.children.find(o=>o.isHemisphereLight);
const TIME_LABELS={day:'☀️ Ngày',sunset:'🌅 Hoàng hôn',night:'🌙 Đêm',auto:'🔄 Tự động'};
const TIME_THEMES={
 day:{bg:0x469242,fog:0x78b9e6,hemiSky:0xd4ecff,hemiGround:0x2e4d2c,hemiInt:.42,sunCol:0xfff4dc,sunInt:1.15,fillCol:0x7fb5f0,fillInt:.15,night:false},
 sunset:{bg:0x2f5e3d,fog:0xd98a6c,hemiSky:0xffcba4,hemiGround:0x2a2438,hemiInt:.46,sunCol:0xff9a52,sunInt:1.22,fillCol:0x9b6b9e,fillInt:.22,night:true},
 night:{bg:0x163828,fog:0x0b192c,hemiSky:0x3b6291,hemiGround:0x0d1824,hemiInt:.32,sunCol:0x7aa8ff,sunInt:.58,fillCol:0x38bdf8,fillInt:.28,night:true}
};
function applyAtmosphere(phase){
 const th=TIME_THEMES[phase]||TIME_THEMES.day;
 empireV16.activeTimePhase=phase;
 scene.background.setHex(th.bg);
 if(scene.fog)scene.fog.color.setHex(th.fog);
 if(hemiLight){hemiLight.color.setHex(th.hemiSky);hemiLight.groundColor.setHex(th.hemiGround);hemiLight.intensity=th.hemiInt}
 sun.color.setHex(th.sunCol);sun.intensity=th.sunInt;
 fill.color.setHex(th.fillCol);fill.intensity=th.fillInt;
 empireV16.nightLights.visible=th.night;
}
function cycleTimeMode(){
 const order=['day','sunset','night','auto'];
 S.timeMode=order[(order.indexOf(S.timeMode)+1)%order.length];
 updateAtmosphere(0);
 save();refreshP(1);
}
function updateAtmosphere(dt){
 empireV16.clock+=Math.max(0,Math.min(.05,dt));
 let phase=S.timeMode;
 if(phase==='auto'){
  const cycle=(Math.floor(Date.now()/1000)%90)/90;
  phase=cycle<.5?'day':cycle<.72?'sunset':'night';
 }
 if(empireV16.activeTimePhase!==phase)applyAtmosphere(phase);
 const btn=$('time-pill');
 if(btn){
  const label=TIME_LABELS[S.timeMode]||TIME_LABELS.day;
  if(btn.textContent!==label)btn.textContent=label;
 }
}
// Add quick Day/Night switcher pill to HUD
{
 const hudEl=$('hud'),mbEl=$('mb');
 if(hudEl&&mbEl&&!$('time-pill')){
  const pill=document.createElement('button');
  pill.id='time-pill';pill.type='button';
  pill.setAttribute('aria-label','Chế độ ánh sáng Ngày Đêm');
  pill.textContent=TIME_LABELS[S.timeMode];
  pill.onclick=e=>{e.stopPropagation();audio();cycleTimeMode()};
  hudEl.insertBefore(pill,mbEl);
 }
 applyAtmosphere(S.timeMode==='auto'?'day':S.timeMode);
}

// 5. Hook Car Mounting & Pricing for Custom Paint, Tuning & Prestige
const baseMountV16=mount;
mount=function(d,k,cons){
 baseMountV16(d,k,cons);
 const idx=slots.indexOf(d);
 if(idx>=0&&Number.isInteger(S.slotPaint[idx])&&d.mesh){
  const pos=d.mesh.position.clone(),sc=d.mesh.scale.x;
  removeActor(d.mesh);
  d.mesh=makeCar(k,S.slotPaint[idx]);
  d.mesh.position.copy(pos);
  d.mesh.scale.setScalar(sc);
  scene.add(d.mesh);
 }
};
// Apply saved custom paint to any already-mounted cars on startup
slots.forEach((d,idx)=>{
 if(d.car&&d.mesh&&Number.isInteger(S.slotPaint[idx])){
  const pos=d.mesh.position.clone(),sc=d.mesh.scale.x;
  removeActor(d.mesh);
  d.mesh=makeCar(d.car,S.slotPaint[idx]);
  d.mesh.position.copy(pos);
  d.mesh.scale.setScalar(sc);
  scene.add(d.mesh);
 }
});

function slotTuningMult(d){
 const idx=d?slots.indexOf(d):-1;
 return idx>=0?(TUNING_STAGES[S.tuning[idx]||0]?.mult||1):1;
}
function prestigeMult(){
 return 1+(S.prestige||0)*.08;
}
const baseQuoteV16=quote;
quote=function(k,c){
 if(c&&c.offer&&c.d?.car===k)return Math.round(c.offer*(c.tdOK?1.03:1));
 const base=baseQuoteV16(k,c);
 const mult=slotTuningMult(c?.d)*prestigeMult();
 return mult===1?base:Math.round(base*mult);
};
const baseReserveCarV16=reserveCar;
reserveCar=function(c){
 if(c&&!c._v16Scaled){
  const maxTune=Math.max(1,...slots.slice(0,NSL()).map(d=>slotTuningMult(d)));
  const pMult=1+(S.prestige||0)*.10;
  if(maxTune>1||pMult>1)c.bud=Math.round(c.bud*maxTune*pMult);
  c._v16Scaled=true;
 }
 return baseReserveCarV16(c);
};

// 6. Actions: Upgrade Tuning, Repaint Slot, Prestige & VIP Auctions
function upgradeTuning(slotIdx){
 if(slotIdx<0||slotIdx>=6)return;
 const curStage=S.tuning[slotIdx]||0;
 if(curStage>=3)return;
 const next=TUNING_STAGES[curStage+1];
 if(S.money<next.cost){toast('Không đủ tiền nâng cấp Xưởng Độ');return}
 S.money-=next.cost;recordExpense(next.cost);
 S.tuning[slotIdx]=curStage+1;
 if(empireV16.tuningRings[slotIdx])empireV16.tuningRings[slotIdx].group.visible=true;
 const d=slots[slotIdx];
 if(d?.res&&d.car)d.res.offer=quote(d.car,d.res);
 beep(780,.15);toast('Đã nâng Bục #'+(slotIdx+1)+' lên '+next.n);
 save();refreshP(1);
}
function paintSlot(slotIdx,hex){
 if(slotIdx<0||slotIdx>=6)return;
 S.slotPaint[slotIdx]=hex;
 const d=slots[slotIdx];
 if(d&&d.car&&d.mesh){
  const pos=d.mesh.position.clone(),sc=d.mesh.scale.x,ry=d.mesh.rotation.y;
  removeActor(d.mesh);
  d.mesh=makeCar(d.car,hex);
  d.mesh.position.copy(pos);d.mesh.scale.setScalar(sc);d.mesh.rotation.y=ry;
  scene.add(d.mesh);
  burst(d.mesh.position);
 }
 beep(640,.1);toast('Đã đổi màu sơn Bục #'+(slotIdx+1));
 save();refreshP(1);
}
function prestigeCost(){
 return Math.round(50000*Math.pow(1.85,S.prestige||0));
}
function upgradePrestige(){
 if(S.prestige>=10)return;
 const cost=prestigeCost();
 if(S.money<cost){toast('Không đủ tiền nâng cấp Đế Chế');return}
 S.money-=cost;recordExpense(cost);
 S.prestige++;
 addRep(4);addXP(120*S.prestige);
 beep(880,.15);setTimeout(()=>beep(1175,.22),120);
 toast('Đế Chế Cấp '+S.prestige+'! Giá xe +'+S.prestige*8+'%');
 save();refreshP(1);
}
function startAuction(tier){
 const a=AUCTIONS[tier];
 if(!a||S.auction)return;
 if(S.money<a.cost){toast('Không đủ vốn mở phiên đấu giá');return}
 S.money-=a.cost;
 S.auction={tier,elapsed:0};
 syncAuctionVisual();
 beep(740,.15);toast('Mở đấu giá '+a.n+'!');
 save();refreshP(1);
}
function syncAuctionVisual(){
 if(!S.auction){
  if(empireV16.auctionCar){removeActor(empireV16.auctionCar);empireV16.auctionCar=null}
  empireV16.auctionPod.visible=false;
  empireV16.auctionTierRendered=-1;
  return;
 }
 const a=AUCTIONS[S.auction.tier];
 empireV16.auctionPod.visible=true;
 if(empireV16.auctionTierRendered!==S.auction.tier||!empireV16.auctionCar){
  if(empireV16.auctionCar)removeActor(empireV16.auctionCar);
  const car=makeCar('sport',a.col);
  car.position.set(0,.22,0);
  empireV16.auctionPod.add(car);
  empireV16.auctionCar=car;
  empireV16.auctionTierRendered=S.auction.tier;
 }
}
syncAuctionVisual();

function updateAuction(dt){
 if(!S.auction)return;
 const a=AUCTIONS[S.auction.tier];
 if(!a){S.auction=null;syncAuctionVisual();return}
 S.auction.elapsed+=dt;
 if(empireV16.auctionCar)empireV16.auctionCar.rotation.y+=dt*1.1;
 if(S.auction.elapsed>=a.dur){
  const payout=Math.round(a.payout*prestigeMult()),profit=payout-a.cost;
  S.money+=payout;S.rev+=payout;S.profit+=profit;S.sold++;S.auctionsWon++;
  S.gems+=a.gems;addRep(a.rep);addXP(80+profit/250);
  recordIncome('cars',profit);sales.push([performance.now(),profit]);
  burst(empireV16.auctionPod.position);
  floatTxt('+'+fm(payout),empireV16.auctionPod.position);
  beep(988,.15);setTimeout(()=>beep(1318,.25),120);
  toast('Chốt đấu giá '+a.n+': +'+fm(payout)+' & +'+a.gems+' KC!');
  S.auction=null;syncAuctionVisual();save();refreshP(1);
 }
}

// 7. Infinite Dynamic Contracts (activates automatically once all 10 initial missions are done)
function contractMetric(key){
 if(key==='sold')return S.sold;
 if(key==='vip')return S.vip;
 if(key==='service')return S.tdN+S.garN;
 if(key==='empire')return S.auctionsWon+S.tuning.reduce((a,b)=>a+b,0)+S.prestige;
 return S.sold;
}
function ensureContract(){
 if(S.mi<MIS.length)return null;
 if(S.contract&&typeof S.contract.target==='number')return S.contract;
 const n=S.contractsDone||0,typeIdx=n%4;
 const specs=[
  {key:'sold',step:6+Math.min(24,n*2),label:d=>`Hợp đồng #${n+1}: Bán thêm ${d} xe`,r:12000+n*4500,gems:4},
  {key:'vip',step:2+Math.min(8,Math.floor(n/2)),label:d=>`Hợp đồng #${n+1}: Phục vụ thêm ${d} khách VIP`,r:15000+n*5000,gems:5},
  {key:'service',step:4+Math.min(16,n*2),label:d=>`Hợp đồng #${n+1}: Hoàn tất ${d} lượt Lái thử / Sửa xe`,r:14000+n*4500,gems:4},
  {key:'empire',step:1+Math.min(4,Math.floor(n/3)),label:d=>`Hợp đồng #${n+1}: Đấu giá VIP hoặc Độ thêm ${d} cấp`,r:22000+n*6500,gems:6}
 ];
 const sp=specs[typeIdx],curVal=contractMetric(sp.key);
 S.contract={id:n+1,key:sp.key,start:curVal,target:curVal+sp.step,title:sp.label(sp.step),r:sp.r,gems:sp.gems};
 return S.contract;
}
function checkContract(){
 if(S.mi<MIS.length)return;
 const c=ensureContract();
 if(!c)return;
 if(contractMetric(c.key)>=c.target){
  S.money+=c.r;S.profit+=c.r;S.gems+=c.gems;S.contractsDone=(S.contractsDone||0)+1;
  addXP(60+c.id*15);
  beep(587,.12);setTimeout(()=>beep(880,.18),100);
  toast('Hoàn thành '+c.title+'! +'+fm(c.r)+' +'+c.gems+' KC');
  S.contract=null;ensureContract();save();
 }
}

// 8. Direct 3D Tap on Waiting Customers & Display Cars
cvs.addEventListener('pointerup',e=>{
 if(ptr.size>0||(down&&down[2]>=8))return;
 ray.setFromCamera({x:e.clientX/innerWidth*2-1,y:-(e.clientY/innerHeight)*2+1},cam);
 // Check waiting customer tap for instant VIP hospitality / priority service
 const custMeshes=custs.filter(c=>c.per&&(c.st==='WAITING'||c.st==='BROWSING')).map(c=>c.per);
 if(custMeshes.length){
  const ch=ray.intersectObjects(custMeshes,true);
  if(ch.length){
   let node=ch[0].object,cust=null;
   while(node&&!cust){cust=custs.find(c=>c.per===node);node=node.parent}
   if(cust){
    cust.w=0;
    if(!cust.vipBoosted){
     cust.vipBoosted=true;cust.bud=Math.round(cust.bud*1.05);addRep(.5);
     floatTxt(cust.vip?'🥂 VIP +5% ngân sách!':'⚡ Ưu tiên phục vụ!',cust.per.position);
     beep(880,.1);
    }
    return;
   }
  }
 }
 // Check display car tap to select that specific turntable slot in Showroom Studio
 const carMeshes=slots.slice(0,NSL()).filter(d=>d.mesh).map(d=>d.mesh);
 if(carMeshes.length){
  const mh=ray.intersectObjects(carMeshes,true);
  if(mh.length){
   let node=mh[0].object,slotIdx=-1;
   while(node&&slotIdx<0){slotIdx=slots.findIndex(d=>d.mesh===node);node=node.parent}
   if(slotIdx>=0){
    empireV16.selectedSlot=slotIdx;
    if(cur==='show')refreshP(1);
   }
  }
 }
});

// 9. Extend UI Panels (ph), HUD, Navigation Badges & Click Handlers
const basePhV16=ph;
ph=function(k){
 let h=basePhV16(k);
 if(k==='show'){
  const pCost=prestigeCost();
  h+=`<div class="r"><div><b>🏆 Đế Chế Huyền Thoại · Cấp ${S.prestige}/10</b><br>Tăng vĩnh viễn <b>+${S.prestige*8}%</b> giá bán mọi dòng xe & ngân sách khách.<br>Cấp tiếp: +8% giá bán & +4 Danh tiếng</div>${S.prestige>=10?'<b>TỐI ĐA</b>':`<button data-v16="prestige" ${S.money<pCost?'disabled':''}>${fm(pCost)}</button>`}</div>`;
  const sel=Math.min(NSL()-1,Math.max(0,empireV16.selectedSlot||0));
  const d=slots[sel],stage=S.tuning[sel]||0,nextStage=TUNING_STAGES[stage+1];
  const slotTabs=Array.from({length:NSL()},(_,i)=>`<button data-v16="slot:${i}" style="${i===sel?'background:#ffd54f;color:#102238':'background:#24465d;color:#fff'};min-height:34px;padding:5px 10px">Bục #${i+1}${S.tuning[i]?` ★${S.tuning[i]}`:''}</button>`).join(' ');
  const swatches=PAINT_SWATCHES.map(sw=>`<button type="button" class="v16-swatch ${S.slotPaint[sel]===sw.hex?'active':''}" title="${sw.n}" aria-label="${sw.n}" data-v16="paint:${sel}:${sw.hex}" style="background:${sw.css}"></button>`).join('');
  h+=`<div class="v16-card"><div><b>🔧 Xưởng Độ Xe & Sơn Custom · Bục #${sel+1}</b> <span class="v16-tag">${TUNING_STAGES[stage].n}</span></div><div style="display:flex;gap:5px;flex-wrap:wrap;margin:7px 0">${slotTabs}</div><div class="r" style="padding:6px 0"><div>Xe đang trưng bày: <b>${d?.car?CARS[d.car].n:'Đang chờ xe'}</b>${d?.car?` · Giá niêm yết <b>${fm(quote(d.car,{d,pref:'',vip:false}))}</b>`:''}<br>${nextStage?`Nâng cấp: <b>${nextStage.n}</b>`:'Đã đạt cấp độ xe tối đa'}</div>${nextStage?`<button data-v16="tune:${sel}" ${S.money<nextStage.cost?'disabled':''}>${fm(nextStage.cost)}</button>`:'<b>STAGE 3</b>'}</div><div><span style="font-size:12px;color:#aec2d2">Đổi màu sơn trực tiếp trên bục 3D:</span><div class="v16-swatches">${swatches}</div></div></div>`;
 }
 if(k==='inv'){
  const active=S.auction?AUCTIONS[S.auction.tier]:null;
  h+=`<div class="v16-card"><div><b>🏎️ Đấu Giá Siêu Xe VIP</b> <span class="v16-tag">Đã thắng ${S.auctionsWon} phiên</span></div>`+
   (active?`<div class="r"><div>Đang đấu giá: <b>${active.n}</b><br>Còn <b>${Math.max(0,Math.ceil(active.dur-S.auction.elapsed))}s</b> · Thu về dự kiến <b>${fm(Math.round(active.payout*prestigeMult()))}</b> (+${active.gems} KC)</div><b>ĐANG DIỄN RA</b></div>`:
   AUCTIONS.map((a,i)=>`<div class="r"><div><b>${a.n}</b><br>Vốn ${fm(a.cost)} → Thu về <b>${fm(Math.round(a.payout*prestigeMult()))}</b> sau ${a.dur}s (+${a.gems} KC, +${a.rep} ★)</div><button data-v16="auction:${i}" ${S.money<a.cost?'disabled':''}>Đấu giá</button></div>`).join(''))+
   `</div>`;
 }
 if(k==='mis'&&S.mi>=MIS.length){
  const c=ensureContract();
  if(c){
   const prog=Math.max(0,contractMetric(c.key)-c.start),span=Math.max(1,c.target-c.start);
   h+=`<div class="v16-card"><div><b>🏆 Hợp Đồng Đại Lý Cấp Cao (Vô hạn)</b> <span class="v16-tag">Hoàn thành ${S.contractsDone}</span></div><div class="r"><div><b>${c.title}</b><br>Thưởng: <b>${fm(c.r)}</b> + <b>${c.gems} KC</b><div class="bar"><i style="width:${Math.min(100,prog/span*100)}%"></i></div></div><b>${Math.min(prog,span)}/${span}</b></div></div>`;
  }
 }
 if(k==='menu'){
  const rows=S.history.slice(-12);
  const maxAbs=Math.max(1000,...rows.map(r=>Math.abs(r.profit)));
  const bars=rows.length?rows.map(r=>{
   const pct=Math.max(8,Math.min(100,Math.round(Math.abs(r.profit)/maxAbs*100)));
   return `<div class="v16-bar ${r.profit<0?'neg':''}" style="height:${pct}%" title="${fm(r.profit)}"></div>`;
  }).join(''):`<div class="v16-bar" style="height:25%"></div>`;
  h+=`<div class="v16-card"><div><b>📊 Biểu đồ lợi nhuận theo giờ</b> <span class="v16-tag">Đế chế Cấp ${S.prestige}</span></div><div class="v16-chart" aria-label="Biểu đồ lợi nhuận">${bars}</div><div style="font-size:11px;color:#aec2d2">Độ xe: <b>${S.tuning.reduce((a,b)=>a+b,0)}/18</b> cấp · Đấu giá thắng: <b>${S.auctionsWon}</b> · Hợp đồng: <b>${S.contractsDone}</b></div></div>`+
   `<div class="r"><div><b>Ánh sáng môi trường 3D</b><br>Chế độ hiện tại: <b>${TIME_LABELS[S.timeMode]}</b> (Ngày / Hoàng hôn / Đêm)</div><button data-v16="time">Đổi cảnh</button></div>`;
 }
 return h;
};

P.addEventListener('click',e=>{
 const b=e.target.closest('button[data-v16]');
 if(!b||!owner)return;
 audio();
 const cmd=b.dataset.v16;
 if(cmd==='prestige')upgradePrestige();
 else if(cmd==='time')cycleTimeMode();
 else if(cmd.startsWith('slot:')){empireV16.selectedSlot=Number(cmd.split(':')[1])||0;refreshP(1)}
 else if(cmd.startsWith('tune:'))upgradeTuning(Number(cmd.split(':')[1])||0);
 else if(cmd.startsWith('paint:')){const parts=cmd.split(':');paintSlot(Number(parts[1])||0,Number(parts[2]))}
 else if(cmd.startsWith('auction:'))startAuction(Number(cmd.split(':')[1])||0);
});

const baseHudV16=hud;
hud=function(){
 checkContract();
 baseHudV16();
 if(S.mi>=MIS.length&&S.contract){
  const c=S.contract,prog=Math.max(0,contractMetric(c.key)-c.start),span=Math.max(1,c.target-c.start);
  $('mb').textContent=`🏆 ${c.title} (${Math.min(prog,span)}/${span}) · +${fm(c.r)}`;
 }
 // Update notification badges on bottom #nav buttons
 const invBtn=document.querySelector('#nav button[data-o="inv"]');
 if(invBtn){
  let badge=invBtn.querySelector('.nav-badge');
  const showBadge=STK()===0||!S.auction&&S.money>=45000;
  if(showBadge){
   if(!badge){badge=document.createElement('i');badge.className='nav-badge';invBtn.appendChild(badge)}
   badge.textContent=STK()===0?'!':'VIP';
  }else if(badge)badge.remove();
 }
};

function updateEmpireV16(dt){
 const step=Math.max(0,Math.min(.05,dt));
 updateAtmosphere(step);
 updateAuction(step);
 checkContract();
 empireV16.tuningRings.forEach((r,i)=>{
  const lv=S.tuning[i]||0;
  r.group.visible=i<NSL()&&lv>0;
  if(r.group.visible){
   r.outer.rotation.z=empireV16.clock*(.6+lv*.25);
   r.inner.rotation.z=-empireV16.clock*(.8+lv*.3);
  }
 });
}
