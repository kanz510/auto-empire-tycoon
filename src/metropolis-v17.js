// V17 Grand Metropolis & Showroom Life:
// 1. Living 3D World: Animated VIP Helicopter flying in the default camera view over the Showroom Forecourt,
//    Front Plaza Sky Spotlights, 3D Floating Hologram Price Signs above cars & Customer Emotion Bubbles.
// 2. Premium UI & Quick-Action Dock: On-screen quick buttons (Turbo Boost, Motor Show, Instant VIP Deal)
//    & Vehicle Spec Bars in Inventory.
// 3. Active Gameplay Events: Motor Show Expo (+15% price & 2.2x traffic + Sky Spotlights),
//    Turbo Overdrive (exact 2x staff/test-drive/garage speed), and Direct VIP Deal Negotiation.
// 4. Polyphonic WebAudio & 6s Multi-Wave 3D Fireworks connected to all vehicle sales.

const CAR_SPECS={
 hatch:{tag:'Đô thị Tiết kiệm',spd:58,lux:52,rare:40,icon:'🚗'},
 sedan:{tag:'Executive Sedan',spd:74,lux:78,rare:62,icon:'🚘'},
 suv:{tag:'Luxury Full-Size SUV',spd:70,lux:88,rare:78,icon:'🚙'},
 sport:{tag:'Hypercar V12 Giới hạn',spd:98,lux:96,rare:96,icon:'🏎️'}
};

function normalizeV17State(){
 S.turbo=Math.max(0,Math.min(60,Number(S.turbo)||0));
 S.motorShow=Math.max(0,Math.min(90,Number(S.motorShow)||0));
 S.showsHosted=Math.max(0,Math.floor(Number(S.showsHosted)||0));
 S.dealsClosed=Math.max(0,Math.floor(Number(S.dealsClosed)||0));
}
normalizeV17State();

// 1. Polyphonic WebAudio Synthesizer (Cash Chime, Engine Rev, Victory Fanfare)
function sfx(type){
 if(!S.snd)return;
 audio();
 if(!ac)return;
 const now=ac.currentTime;
 const note=(freq,start,dur,wave='triangle',gainVal=.11,slideTo=0)=>{
  try{
   const o=ac.createOscillator(),g=ac.createGain();
   o.type=wave;o.frequency.setValueAtTime(freq,now+start);
   if(slideTo>0)o.frequency.exponentialRampToValueAtTime(slideTo,now+start+dur);
   g.gain.setValueAtTime(gainVal,now+start);
   g.gain.exponentialRampToValueAtTime(.001,now+start+dur);
   o.connect(g);g.connect(ac.destination);
   o.start(now+start);o.stop(now+start+dur);
  }catch(e){}
 };
 if(type==='cash'){
  note(987.77,0,.09,'sine',.13);
  note(1318.51,.06,.12,'triangle',.14);
  note(1567.98,.12,.16,'triangle',.14);
  note(2093.0,.18,.28,'sine',.15);
 }else if(type==='engine'){
  note(68,0,.18,'sawtooth',.10,185);
  note(92,.04,.22,'triangle',.12,240);
  note(175,.18,.26,'sawtooth',.09,115);
 }else if(type==='fanfare'){
  note(523.25,0,.11,'triangle',.13);
  note(659.25,.09,.11,'triangle',.13);
  note(783.99,.18,.13,'triangle',.14);
  note(1046.5,.28,.32,'sine',.16);
 }else if(type==='turbo'){
  note(330,0,.12,'sawtooth',.1,660);
  note(440,.08,.18,'triangle',.12,880);
 }
}

// 2. 3D Scene Group for V17 Living World
const metropolisV17={
 root:new THREE.Group(),
 heli:new THREE.Group(),
 heliMainRotor:null,
 heliTailRotor:null,
 heliBeam:null,
 spotlights:new THREE.Group(),
 spotBeams:[],
 holoSprites:[],
 custBubbles:[],
 fireworks:[],
 fireworkRings:[],
 fireworkTimer:0,
 nextWaveAt:0,
 fireOriginX:0,
 fireOriginZ:0,
 lastSold:S.sold,
 clock:0
};
metropolisV17.root.name='grand-metropolis-v17';
metropolisV17.root.add(metropolisV17.heli,metropolisV17.spotlights);
scene.add(metropolisV17.root);

// 2A. Build 3D VIP Executive Helicopter (positioned right in the default camera view over the Showroom Forecourt)
{
 const bodyMat=new THREE.MeshStandardMaterial({color:0x142636,metalness:.75,roughness:.2});
 bodyMat.color.convertSRGBToLinear();
 const goldMat=new THREE.MeshStandardMaterial({color:0xffd54f,metalness:.85,roughness:.18});
 goldMat.color.convertSRGBToLinear();
 const glassMat=new THREE.MeshPhysicalMaterial({color:0x7fd8ff,metalness:.1,roughness:.08,transparent:true,opacity:.65});
 glassMat.color.convertSRGBToLinear();
 const rotorMat=new THREE.MeshStandardMaterial({color:0x263238,metalness:.6,roughness:.3});

 const cabin=new THREE.Mesh(new THREE.SphereGeometry(1.05,16,12),bodyMat);
 cabin.scale.set(1.55,.88,.95);cabin.position.set(0,.78,0);cabin.castShadow=true;
 const nose=new THREE.Mesh(new THREE.SphereGeometry(.82,14,10),glassMat);
 nose.scale.set(1.35,.76,.88);nose.position.set(.52,.82,0);
 const stripe=new THREE.Mesh(new THREE.BoxGeometry(2.4,.14,1.94),goldMat);
 stripe.position.set(-.05,.75,0);
 const boom=new THREE.Mesh(new THREE.CylinderGeometry(.12,.26,2.8,10),bodyMat);
 boom.rotation.z=Math.PI/2;boom.position.set(-2.1,.92,0);boom.castShadow=true;
 const fin=new THREE.Mesh(new THREE.BoxGeometry(.55,.85,.12),goldMat);
 fin.position.set(-3.35,1.22,0);
 metropolisV17.heli.add(cabin,nose,stripe,boom,fin);

 // Landing skids
 for(const z of [-.68,.68]){
  const skid=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,2.4,8),goldMat);
  skid.rotation.z=Math.PI/2;skid.position.set(.1,.12,z);
  const strut1=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.55,6),rotorMat);
  strut1.position.set(.55,.38,z*.85);
  const strut2=strut1.clone();strut2.position.x=-.45;
  metropolisV17.heli.add(skid,strut1,strut2);
 }
 // Main & tail rotors
 const mast=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.36,8),goldMat);
 mast.position.set(0,1.62,0);
 const mainRotor=new THREE.Group();mainRotor.position.set(0,1.78,0);
 const b1=new THREE.Mesh(new THREE.BoxGeometry(4.8,.035,.26),rotorMat);
 const b2=new THREE.Mesh(new THREE.BoxGeometry(.26,.035,4.8),rotorMat);
 mainRotor.add(b1,b2);
 const tailRotor=new THREE.Mesh(new THREE.BoxGeometry(.04,.9,.14),rotorMat);
 tailRotor.position.set(-3.45,1.22,.12);

 // Downward VIP Searchlight Cone under the Helicopter so it stands out in any lighting
 const heliBeam=new THREE.Mesh(
  new THREE.ConeGeometry(1.55,4.8,16,1,true),
  new THREE.MeshBasicMaterial({color:0xffe57f,transparent:true,opacity:.38,side:THREE.DoubleSide,depthWrite:false})
 );
 heliBeam.position.set(0,-2.35,0);
 metropolisV17.heli.add(mast,mainRotor,tailRotor,heliBeam);
 metropolisV17.heliMainRotor=mainRotor;
 metropolisV17.heliTailRotor=tailRotor;
 metropolisV17.heliBeam=heliBeam;
 metropolisV17.heli.scale.setScalar(1.32);
 metropolisV17.heli.position.set(0,5.2,1.2);
}

// 2B. VIP Red Carpet Entrance Runner, Glass Bollards & Front-Plaza Motor Show Spotlights
{
 const carpetMat=new THREE.MeshStandardMaterial({color:0xb71c1c,roughness:.75,metalness:.08});
 carpetMat.color.convertSRGBToLinear();
 const trimMat=new THREE.MeshStandardMaterial({color:0xffd54f,metalness:.8,roughness:.22});
 trimMat.color.convertSRGBToLinear();
 const carpet=new THREE.Mesh(new THREE.BoxGeometry(2.3,.03,3.4),carpetMat);
 carpet.position.set(0,.19,3.5);
 const leftTrim=new THREE.Mesh(new THREE.BoxGeometry(.09,.035,3.4),trimMat);
 leftTrim.position.set(-1.12,.195,3.5);
 const rightTrim=leftTrim.clone();rightTrim.position.x=1.12;
 metropolisV17.root.add(carpet,leftTrim,rightTrim);

 // Illuminated luxury bollards along the front promenade
 const bollardPost=new THREE.CylinderGeometry(.07,.09,.68,10);
 const bollardCap=new THREE.SphereGeometry(.11,10,8);
 const capGlow=new THREE.MeshBasicMaterial({color:0xffe599});
 for(const x of [-11.5,-7.5,-3.5,3.5,7.5,11.5]){
  const p=new THREE.Mesh(bollardPost,trimMat);p.position.set(x,.42,3.65);
  const c=new THREE.Mesh(bollardCap,capGlow);c.position.set(x,.8,3.65);
  metropolisV17.root.add(p,c);
 }

 // 4 High-Visibility Motor Show Spotlights on the Front Showroom Plaza (z = 2.8, right in default camera view!)
 const outerGeo=new THREE.ConeGeometry(1.55,8.6,18,1,true);
 const innerGeo=new THREE.ConeGeometry(.72,8.2,14,1,true);
 const ringGeo=new THREE.TorusGeometry(1.05,.065,8,28);
 const baseGeo=new THREE.CylinderGeometry(.38,.48,.22,14);
 [[-8.5,0x00e5ff],[-2.8,0xffd54f],[2.8,0xff4081],[8.5,0x69f0ae]].forEach(([x,col])=>{
  const pivot=new THREE.Group();
  pivot.position.set(x,.22,2.8);
  const base=new THREE.Mesh(baseGeo,trimMat);
  const floorRing=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:col}));
  floorRing.rotation.x=Math.PI/2;floorRing.position.y=.05;
  const outerMat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.44,side:THREE.DoubleSide,depthWrite:false});
  const innerMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.72,side:THREE.DoubleSide,depthWrite:false});
  const outerCone=new THREE.Mesh(outerGeo,outerMat);
  outerCone.position.y=4.3;
  const innerCone=new THREE.Mesh(innerGeo,innerMat);
  innerCone.position.y=4.1;
  pivot.add(base,floorRing,outerCone,innerCone);
  metropolisV17.spotlights.add(pivot);
  metropolisV17.spotBeams.push(pivot);
 });
 metropolisV17.spotlights.visible=false;
}

// 2C. 3D Floating Hologram Price Badges above the 6 Showroom Turntables
function makeBadgeSprite(w,h){
 const canvas=document.createElement('canvas');
 canvas.width=w;canvas.height=h;
 const tex=new THREE.CanvasTexture(canvas);
 tex.encoding=THREE.sRGBEncoding;
 const mat=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false});
 const sprite=new THREE.Sprite(mat);
 return {sprite,canvas,ctx:canvas.getContext('2d'),tex,lastKey:''};
}
SP.forEach((p,i)=>{
 const b=makeBadgeSprite(256,96);
 b.sprite.position.set(p[0],2.55,p[1]);
 b.sprite.scale.set(3.2,1.2,1);
 b.sprite.visible=false;
 metropolisV17.root.add(b.sprite);
 metropolisV17.holoSprites.push(b);
});

function updateHoloBadges(){
 slots.forEach((d,i)=>{
  const b=metropolisV17.holoSprites[i];
  if(!b)return;
  if(i>=NSL()||!d.car||!d.mesh){b.sprite.visible=false;return}
  b.sprite.visible=true;
  b.sprite.position.y=2.45+Math.sin(metropolisV17.clock*2.2+i)*.08;
  const stage=S.tuning?.[i]||0;
  const price=quote(d.car,{d,pref:'',vip:false});
  const key=`${d.car}:${stage}:${price}:${S.motorShow>0?1:0}`;
  if(b.lastKey===key)return;
  b.lastKey=key;
  const c=b.ctx;
  c.clearRect(0,0,256,96);
  c.fillStyle='rgba(12,28,46,0.88)';
  c.strokeStyle=stage>0?'#6be6ff':'#ffd54f';
  c.lineWidth=4;
  c.beginPath();c.roundRect?c.roundRect(6,6,244,84,18):c.rect(6,6,244,84);c.fill();c.stroke();
  c.fillStyle='#ffe599';c.font='bold 22px system-ui,sans-serif';c.textAlign='center';
  c.fillText(CARS[d.car].n+(stage>0?' ★'+stage:''),128,36);
  c.fillStyle='#8bf28b';c.font='900 28px system-ui,sans-serif';
  c.fillText(fm(price),128,72);
  b.tex.needsUpdate=true;
 });
}

// 2D. 3D Customer Emotion / Status Bubbles
for(let i=0;i<6;i++){
 const b=makeBadgeSprite(192,64);
 b.sprite.scale.set(2.2,.74,1);
 b.sprite.visible=false;
 metropolisV17.root.add(b.sprite);
 metropolisV17.custBubbles.push(b);
}
function updateCustomerBubbles(){
 const activeCusts=custs.filter(c=>!c.dead&&c.per&&c.m===c.per).slice(0,6);
 metropolisV17.custBubbles.forEach((b,i)=>{
  const c=activeCusts[i];
  if(!c){b.sprite.visible=false;return}
  b.sprite.visible=true;
  b.sprite.position.set(c.per.position.x,2.68+Math.sin(metropolisV17.clock*3+i)*.06,c.per.position.z);
  const label=c.st==='WAITING'?(c.vip?'👑 VIP Chờ!':'💬 Tư vấn!'):c.st==='BUYING'?'💰 Chốt đơn!':c.st==='BROWSING'?(c.vip?'👑 Khách VIP':'🔍 Xem xe'):'🚶 Ghé thăm';
  if(b.lastKey!==label){
   b.lastKey=label;
   const ctx=b.ctx;ctx.clearRect(0,0,192,64);
   ctx.fillStyle=c.vip?'rgba(88,52,8,0.92)':'rgba(16,36,56,0.9)';
   ctx.strokeStyle=c.st==='WAITING'?'#ffeb3b':'#7fdcff';
   ctx.lineWidth=3;
   ctx.beginPath();ctx.roundRect?ctx.roundRect(4,4,184,56,14):ctx.rect(4,4,184,56);ctx.fill();ctx.stroke();
   ctx.fillStyle='#ffffff';ctx.font='bold 22px system-ui,sans-serif';ctx.textAlign='center';
   ctx.fillText(label,96,40);
   b.tex.needsUpdate=true;
  }
 });
}

// 2E. 3D Multi-Wave Fireworks & Shockwave Rings (6.0 seconds duration, centered in default camera view)
{
 const fwGeo=new THREE.SphereGeometry(.32,8,6);
 const cols=[0xffd54f,0x00e5ff,0xff4081,0x69f0ae,0xe040fb,0xffffff];
 for(let i=0;i<48;i++){
  const m=new THREE.Mesh(fwGeo,new THREE.MeshBasicMaterial({color:cols[i%cols.length]}));
  m.visible=false;
  metropolisV17.root.add(m);
  metropolisV17.fireworks.push({m,v:new V(),life:0});
 }
 const ringGeo=new THREE.TorusGeometry(1.2,.09,8,32);
 for(let i=0;i<3;i++){
  const r=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:cols[i]}));
  r.rotation.x=Math.PI/2;
  r.visible=false;
  metropolisV17.root.add(r);
  metropolisV17.fireworkRings.push({m:r,life:0,scale:1});
 }
}
function spawnFireworkWave(cx=0,cz=1){
 metropolisV17.fireworks.forEach((f,i)=>{
  f.life=2.2+R()*.8;
  f.m.visible=true;
  const clusterX=cx+((i%3)-1)*3.2;
  f.m.position.set(clusterX+(R()-.5)*1.5,3.2+R()*2.2,cz+(R()-.5)*2);
  const a=(i/16)*Math.PI*2+R()*.25,sp=3.5+R()*4.5;
  f.v.set(Math.cos(a)*sp,5.5+R()*4.5,Math.sin(a)*sp);
 });
 metropolisV17.fireworkRings.forEach((r,i)=>{
  r.life=1.8;r.scale=.6+i*.35;
  r.m.visible=true;
  r.m.position.set(cx+(i-1)*3.2,4.2+i*.5,cz);
  r.m.scale.setScalar(r.scale);
 });
}
function launchFireworks(originX=0,originZ=1){
 // Clamp firework center into the visible default camera viewport (-5..+5, -1..+3)
 metropolisV17.fireOriginX=Math.max(-5,Math.min(5,Number(originX)||0));
 metropolisV17.fireOriginZ=Math.max(-1.5,Math.min(3,Number(originZ)||1));
 metropolisV17.fireworkTimer=6.0;
 metropolisV17.nextWaveAt=5.0;
 spawnFireworkWave(metropolisV17.fireOriginX,metropolisV17.fireOriginZ);
}

// Hook burst() AND watch S.sold so every single vehicle sale triggers 6-second 3D fireworks & cash chime
const baseBurstV17=burst;
burst=function(p){
 baseBurstV17(p);
 launchFireworks(p?.x||0,p?.z||1);
 sfx('cash');
};

// 3. Active Gameplay: Turbo Boost (exact 2x), Motor Show Expo & Direct VIP Deal Negotiation
function activateTurbo(){
 if(S.turbo>5){toast('⚡ Turbo đang hoạt động ('+Math.ceil(S.turbo)+'s)');return}
 const cost=S.lvl>=3?1200:0;
 if(cost>0&&S.money<cost){toast('Cần '+fm(cost)+' để kích hoạt Turbo');return}
 if(cost>0){S.money-=cost;recordExpense(cost)}
 S.turbo=25;
 sfx('turbo');
 toast('⚡ TURBO ×2 TỐC ĐỘ (25 giây)!');
 save();refreshP(1);
}

function startMotorShow(){
 if(S.motorShow>5){toast('🎪 Triển lãm Motor Show đang diễn ra ('+Math.ceil(S.motorShow)+'s)');return}
 const cost=6000;
 if(S.money<cost){toast('Cần '+fm(cost)+' để mở Triển lãm Motor Show');return}
 S.money-=cost;recordExpense(cost);
 S.motorShow=45;
 S.showsHosted=(S.showsHosted||0)+1;
 addRep(3);addXP(65);
 launchFireworks(0,1.2);
 sfx('fanfare');
 toast('🎪 KHAI MẠC MOTOR SHOW: Giá xe +15% & Khách VIP ×2.2!');
 if(typeof closeP==='function'&&cur==='show')closeP();
 save();refreshP(1);
}

function negotiateVIP(){
 const waiting=custs.filter(c=>!c.dead&&c.per&&(c.st==='WAITING'||c.st==='BROWSING'||c.st==='BUYING'));
 if(!waiting.length){
  spawn();
  sfx('engine');
  toast('📢 Đã gọi thêm khách mới tới Showroom!');
  return;
 }
 const target=waiting.sort((a,b)=>(b.vip?100:0)+b.w-((a.vip?100:0)+a.w))[0];
 target.w=0;
 if(!target.v17Negotiated){
  target.v17Negotiated=true;
  target.bud=Math.round(target.bud*1.10);
  const bonus=target.vip?650:300;
  S.money+=bonus;S.rev+=bonus;S.profit+=bonus;S.dealsClosed=(S.dealsClosed||0)+1;
  recordIncome('cars',bonus);
  addRep(1);addXP(25);
  floatTxt('🤝 Chốt VIP +'+fm(bonus),target.per.position);
  sfx('cash');
 }
 if(target.st==='BUYING'&&typeof target.prog==='number')target.prog+=2.5;
 save();refreshP(1);
}

// Apply Motor Show (+15% vehicle price) to quote()
const baseQuoteV17=quote;
quote=function(k,c){
 const q=baseQuoteV17(k,c);
 return S.motorShow>0?Math.round(q*1.15):q;
};

// 4. Floating Quick-Action Dock on Main Screen & Enhanced UI Cards
{
 if(!document.getElementById('v17-dock')&&!new URLSearchParams(location.search).has('preview')){
  const dock=document.createElement('div');
  dock.id='v17-dock';
  dock.setAttribute('aria-label','Tác vụ nhanh đại lý');
  dock.innerHTML=`
   <button type="button" id="v17-btn-turbo" class="v17-fab" data-v17-dock="turbo">⚡ <span>Turbo</span></button>
   <button type="button" id="v17-btn-expo" class="v17-fab" data-v17-dock="expo">🎪 <span>Triển lãm</span></button>
   <button type="button" id="v17-btn-vip" class="v17-fab" data-v17-dock="vip">🤝 <span>Chốt VIP</span></button>
  `;
  document.body.appendChild(dock);
  dock.addEventListener('click',e=>{
   const b=e.target.closest('button[data-v17-dock]');
   if(!b||!owner)return;
   e.stopPropagation();
   const act=b.dataset.v17Dock;
   if(act==='turbo')activateTurbo();
   else if(act==='expo')startMotorShow();
   else if(act==='vip')negotiateVIP();
  });
 }
}

const basePhV17=ph;
ph=function(k){
 let h=basePhV17(k);
 if(k==='show'){
  h+=`<div class="v16-card v17-card"><div><b>🎪 Sự Kiện & Tăng Tốc Đại Lý (V17)</b> <span class="v16-tag">Đã mở ${S.showsHosted} triển lãm</span></div>`+
   `<div class="r"><div><b>⚡ Chế độ Turbo Overdrive</b><br>Tăng ×2 tốc độ nhân viên, Lái thử & Gara trong 25s.<br>${S.turbo>0?`<b style="color:#8bf28b">Đang bật: còn ${Math.ceil(S.turbo)}s</b>`:'Sẵn sàng kích hoạt'}</div><button data-v17="turbo">${S.turbo>0?Math.ceil(S.turbo)+'s':(S.lvl>=3?fm(1200):'Miễn phí')}</button></div>`+
   `<div class="r"><div><b>🎪 Triển lãm Siêu xe Motor Show</b><br>Bật đèn Spotlight 3D, gọi Trực thăng VIP, khách đến ×2.2 & giá bán <b>+15%</b> trong 45s.</div><button data-v17="expo" ${S.motorShow>5||S.money<6000?'disabled':''}>${S.motorShow>5?'Còn '+Math.ceil(S.motorShow)+'s':fm(6000)}</button></div></div>`;
 }
 if(k==='inv'){
  const specRows=KS.filter(x=>CARS[x].lv<=S.show).map(x=>{
   const sp=CAR_SPECS[x];
   return `<div class="v17-spec-item"><div class="v17-spec-head"><span>${sp.icon} <b>${CARS[x].n}</b> · <small>${sp.tag}</small></span><b>${fm(quote(x,{pref:'',vip:false}))}</b></div>`+
    `<div class="v17-bars"><span>Tốc độ <i style="width:${sp.spd}%"></i></span><span>Sang trọng <i style="width:${sp.lux}%"></i></span><span>Độ hiếm <i style="width:${sp.rare}%"></i></span></div></div>`;
  }).join('');
  h+=`<div class="v16-card v17-card"><div><b>📋 Hồ Sơ Kỹ Thuật & Định Giá Dòng Xe</b></div><div class="v17-spec-grid">${specRows}</div></div>`;
 }
 return h;
};

P.addEventListener('click',e=>{
 const b=e.target.closest('button[data-v17]');
 if(!b||!owner)return;
 const cmd=b.dataset.v17;
 if(cmd==='turbo')activateTurbo();
 else if(cmd==='expo')startMotorShow();
 else if(cmd==='vip')negotiateVIP();
});

// 5. Per-Frame Simulation Update for V17
function updateMetropolisV17(dt){
 const step=Math.max(0,Math.min(.05,dt));
 metropolisV17.clock+=step;
 const t=metropolisV17.clock;

 // Watch S.sold so every sale path (counter, private order, used car, auction) launches 3D fireworks
 if(S.sold!==metropolisV17.lastSold){
  if(S.sold>metropolisV17.lastSold&&metropolisV17.fireworkTimer<=4.5)launchFireworks(0,1);
  metropolisV17.lastSold=S.sold;
 }

 // Turbo overdrive: exact 2x speed (+100% additional step matching updS, updC test drive, and updG)
 if(S.turbo>0){
  S.turbo=Math.max(0,S.turbo-step);
  const sp=3.2*(1+S.train*.015),f=(1+.3*(S.spd-1))*(1+S.train*.06);
  staff.forEach(s=>{
   if(s.st==='MOVING')follow(s,sp,step);
   if(s.st==='SERVING'&&s.c&&typeof s.c.prog==='number')s.c.prog+=step*f;
  });
  custs.forEach(c=>{
   if(c.st==='TESTDRIVE')follow(c,c.sub==='drive'?7:2.6,step,c.sub==='drive'?1:0);
  });
  if(gj&&gj.st==='FIX')gj.t+=step*(1+.3*(S.gar-1));
 }

 // Motor Show event attracts more customers & animates Front-Plaza Spotlights
 if(S.motorShow>0){
  S.motorShow=Math.max(0,S.motorShow-step);
  spawnT-=step*1.1;
  metropolisV17.spotlights.visible=true;
  metropolisV17.spotBeams.forEach((pivot,i)=>{
   pivot.rotation.z=Math.sin(t*2.1+i*1.3)*.34;
   pivot.rotation.x=Math.cos(t*1.6+i)*.18;
  });
 }else{
  metropolisV17.spotlights.visible=empireV16.activeTimePhase!=='day';
  if(metropolisV17.spotlights.visible){
   metropolisV17.spotBeams.forEach((pivot,i)=>{pivot.rotation.z=Math.sin(t*.9+i)*.22});
  }
 }

 // Animate VIP Helicopter directly in the default camera view over the Showroom Forecourt (x: -7..+7, y: 4.8..6.2, z: -1..+3)
 const showHeli=(typeof v11DemoTier==='number'?v11DemoTier:S.show)>=2||S.motorShow>0||S.lvl>=2;
 metropolisV17.heli.visible=true;
 metropolisV17.heliMainRotor.rotation.y+=step*24;
 metropolisV17.heliTailRotor.rotation.z+=step*28;
 {
  const ang=t*.65;
  const hx=Math.sin(ang)*6.8;
  const hz=1.0+Math.cos(ang*2)*1.8;
  const hy=4.9+Math.sin(ang*1.5)*.55+(showHeli?0:.4);
  const ry=Math.atan2(-Math.sin(ang*2)*3.6,Math.cos(ang)*6.8);
  metropolisV17.heli.position.set(hx,hy,hz);
  metropolisV17.heli.rotation.y=ry;
  if(metropolisV17.heliBeam){
   metropolisV17.heliBeam.visible=S.motorShow>0||empireV16.activeTimePhase!=='day';
  }
 }

 // Update 3D Hologram Price Signs & Customer Bubbles
 updateHoloBadges();
 updateCustomerBubbles();

 // Update 6-second multi-wave 3D Fireworks & Shockwave Rings
 if(metropolisV17.fireworkTimer>0){
  metropolisV17.fireworkTimer=Math.max(0,metropolisV17.fireworkTimer-step);
  if(metropolisV17.fireworkTimer>0&&metropolisV17.fireworkTimer<=metropolisV17.nextWaveAt){
   metropolisV17.nextWaveAt-=1.15;
   spawnFireworkWave(metropolisV17.fireOriginX+(R()-.5)*3,metropolisV17.fireOriginZ);
  }
 }
 metropolisV17.fireworks.forEach(f=>{
  if(f.life<=0)return;
  f.life-=step;
  f.v.y-=6.2*step;
  f.m.position.x+=f.v.x*step;
  f.m.position.y+=f.v.y*step;
  f.m.position.z+=f.v.z*step;
  if(f.life<=0||f.m.position.y<.2)f.m.visible=false;
 });
 metropolisV17.fireworkRings.forEach(r=>{
  if(r.life<=0)return;
  r.life-=step;
  r.scale+=step*3.2;
  r.m.scale.setScalar(r.scale);
  if(r.life<=0)r.m.visible=false;
 });

 // Update Floating Quick-Action Dock labels
 const turboBtn=$('v17-btn-turbo'),expoBtn=$('v17-btn-expo'),vipBtn=$('v17-btn-vip');
 if(turboBtn){
  const lbl=S.turbo>0?`⚡ ${Math.ceil(S.turbo)}s`:'⚡ Turbo';
  if(turboBtn.textContent!==lbl)turboBtn.textContent=lbl;
  turboBtn.classList.toggle('active',S.turbo>0);
 }
 if(expoBtn){
  const lbl=S.motorShow>0?`🎪 ${Math.ceil(S.motorShow)}s`:'🎪 Triển lãm';
  if(expoBtn.textContent!==lbl)expoBtn.textContent=lbl;
  expoBtn.classList.toggle('active',S.motorShow>0);
 }
 if(vipBtn){
  const waitCount=custs.filter(c=>!c.dead&&c.per&&(c.st==='WAITING'||c.st==='BROWSING')).length;
  const lbl=waitCount>0?`🤝 Chốt (${waitCount})`:'🤝 Gọi khách';
  if(vipBtn.textContent!==lbl)vipBtn.textContent=lbl;
  vipBtn.classList.toggle('active',waitCount>0);
 }
}
