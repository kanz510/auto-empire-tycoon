const ART={"city-commercial-a": "./dist/city-commercial-a.63345c203050c6f7.glb", "city-commercial-c": "./dist/city-commercial-c.834acf7c9a5fa998.glb", "city-commercial-g": "./dist/city-commercial-g.f4b44c756ce14783.glb", "city-commercial-h": "./dist/city-commercial-h.80fceef8d1d341d9.glb", "city-streetlight": "./dist/city-streetlight.6d87248cef890381.glb", "city-suburban-h": "./dist/city-suburban-h.bf4449ebd9425376.glb", "city-traffic-light": "./dist/city-traffic-light.d5bcaaabb3983ff4.glb", "city-tree-detailed": "./dist/city-tree-detailed.c041daf2f0fb1d49.glb", "city-tree-oak": "./dist/city-tree-oak.d7fd8773674928c5.glb", "kenney-bush": "./dist/kenney-bush.2e0487020d68ccf6.glb", "kenney-car-hatch": "./dist/kenney-car-hatch.9fc0e0c1e216d8b5.glb", "kenney-car-sedan": "./dist/kenney-car-sedan.36faef2dc604e12b.glb", "kenney-car-sport": "./dist/kenney-car-sport.8ba837f4a6f5cd8b.glb", "kenney-car-suv": "./dist/kenney-car-suv.f0ee60ea243a36ef.glb", "kenney-coffee": "./dist/kenney-coffee.05bf257a086a540b.glb", "kenney-delivery": "./dist/kenney-delivery.c2af1c087f8ca713.glb", "kenney-npc-customer": "./dist/kenney-npc-customer.7f50a8347a0e91fa.glb", "kenney-npc-female": "./dist/kenney-npc-female.fcba60b319a70c37.glb", "kenney-npc-sales": "./dist/kenney-npc-sales.b9e4a5e2c7761f08.glb", "kenney-npc-vip": "./dist/kenney-npc-vip.e1a5814b059cde74.glb", "kenney-pottedplant": "./dist/kenney-pottedplant.5b760eda2766f75f.glb", "kenney-sofa": "./dist/kenney-sofa.b4f4e6850118e409.glb", "showroom-floor": "./dist/showroom-floor.000183cfecfaa8f0.png"};

const $=i=>document.getElementById(i),R=Math.random,V=THREE.Vector3;
const CARS={hatch:{n:'Hatchback',cost:3000,price:3300,col:0xff7043,lv:1},sedan:{n:'Sedan',cost:5500,price:6100,col:0x42a5f5,lv:1},suv:{n:'SUV',cost:9000,price:10300,col:0x43a047,lv:2},sport:{n:'Xe thể thao',cost:16000,price:18500,col:0xffca28,lv:3}},KS=Object.keys(CARS);
const PR={hatch:{b:[[-1.8,.35],[-1.8,.85],[-1.2,1],[-.7,1.5],[.7,1.5],[1.2,1],[1.8,.8],[1.8,.35]],g:[[-1.1,1.04],[-.65,1.42],[.65,1.42],[1.1,1.04]]},
sedan:{b:[[-2.1,.35],[-2.1,.85],[-1.4,1],[-.9,1.5],[.5,1.5],[1.1,1],[2.1,.8],[2.1,.35]],g:[[-1.2,1.04],[-.85,1.42],[.45,1.42],[.95,1.04]]},
suv:{b:[[-2,.4],[-2,1.2],[-1.8,1.7],[.7,1.7],[1.2,1.1],[2,.9],[2,.4]],g:[[-1.7,1.25],[-1.65,1.62],[.65,1.62],[1.05,1.25]]},
sport:{b:[[-2.1,.3],[-2.1,.7],[-.7,.8],[0,1.2],[.8,1.2],[1.4,.75],[2.1,.6],[2.1,.3]],g:[[-.55,.84],[.05,1.14],[.75,1.14],[1.15,.8]]}};
// vật liệu/hình học dùng chung để tiết kiệm bộ nhớ GPU
const MC={},M=(c,o)=>{const k=c+JSON.stringify(o||{});if(!MC[k]){const m=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.6},o||{}));m.color.convertSRGBToLinear();m.emissive.convertSRGBToLinear();MC[k]=m}return MC[k]};
const shp=a=>{const s=new THREE.Shape();a.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));return s};
const GE={},WG=new THREE.CylinderGeometry(.38,.38,.3,12),LG=new THREE.BoxGeometry(.08,.14,.3),GG=new THREE.BoxGeometry(.06,.3,.9),SPG=new THREE.BoxGeometry(.4,.07,1.7);WG.rotateX(Math.PI/2);
function carGeo(k){if(GE[k])return GE[k];const p=PR[k],W=1.8,b=new THREE.ExtrudeGeometry(shp(p.b),{depth:W-.12,bevelEnabled:true,bevelSize:.06,bevelThickness:.06,bevelSegments:1});b.translate(0,0,-(W-.12)/2);
 const g=new THREE.ExtrudeGeometry(shp(p.g),{depth:W+.05,bevelEnabled:false});g.translate(0,0,-W/2-.025);return GE[k]={b,g,L:Math.abs(p.b[0][0])}}
function makeCar(k,col){const g=new THREE.Group(),G=carGeo(k),c=col||CARS[k].col,L=G.L;
 g.add(new THREE.Mesh(G.b,M(c,{roughness:.25,metalness:.5})),new THREE.Mesh(G.g,M(0x16222e,{roughness:.05,metalness:.7})));
 [[1.2,1],[1.2,-1],[-1.2,1],[-1.2,-1]].forEach(w=>{const m=new THREE.Mesh(WG,M(0x1a1a1a));m.position.set(w[0],.38,w[1]*.85);g.add(m);const hub=new THREE.Mesh(HUB,M(0xc4d2df,{metalness:.8,roughness:.3}));hub.position.copy(m.position);g.add(hub)});
 [.55,-.55].forEach(z=>{[[L+.05,0xfff9c4,0xfff59d],[-L-.05,0xd32f2f,0x991111]].forEach(a=>{const m=new THREE.Mesh(LG,M(a[1],{emissive:a[2]}));m.position.set(a[0],.62,z);g.add(m)})});
 [-1,1].forEach(z=>{const mirror=new THREE.Mesh(LG,M(c));mirror.position.set(.65,1,z*1.02);g.add(mirror)});
 const gr=new THREE.Mesh(GG,M(0x111111));gr.position.set(L+.04,.5,0);g.add(gr);
 if(k=='sport'){const s=new THREE.Mesh(SPG,M(0x111111));s.position.set(-L+.1,1.3,0);g.add(s)}
 const trim=new THREE.InstancedMesh(TRIM,M(0xc7d5e0,{metalness:.65,roughness:.3}),6),mat=new THREE.Matrix4();
 [[-L,.43,0,.1,.12,1.55],[L,.43,0,.1,.12,1.55],[0,.38,-.91,2.9,.1,.05],[0,.38,.91,2.9,.1,.05],[0,1.22,-.94,.07,.5,.04],[0,1.22,.94,.07,.5,.04]].forEach((v,i)=>{mat.compose(new V(v[0],v[1],v[2]),new THREE.Quaternion(),new V(v[3],v[4],v[5]));trim.setMatrixAt(i,mat)});g.add(trim);
 const roof=new THREE.Mesh(TRIM,M(c,{metalness:.4,roughness:.25}));roof.scale.set(k==='suv'?2.1:1.45,.1,1.6);roof.position.set(-.1,k==='suv'?1.7:k==='sport'?1.2:1.5,0);g.add(roof);
const bumper=new THREE.Mesh(TRIM,M(0x172531));bumper.scale.set(.18,.22,1.75);bumper.position.set(L,.35,0);g.add(bumper);
g.wheels=g.children.filter(o=>o.geometry===WG||o.geometry===HUB);
 g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
const TRIM=new THREE.BoxGeometry(1,1,1);
const HUB=new THREE.CylinderGeometry(.21,.21,.315,10);HUB.rotateX(Math.PI/2);
const SK=[0xf2c6a0,0xd9a577,0x8d5524,0xffdbac],HC=[0x3e2723,0x111111,0x8d6e63,0xd7b56d],PC=[0xef5350,0xab47bc,0x26a69a,0xffa726,0x5c6bc0,0xec407a];
const PG={t:new THREE.CylinderGeometry(.27,.33,.8,8),h:new THREE.SphereGeometry(.25,10,8),hr:new THREE.SphereGeometry(.26,10,6,0,6.3,0,1.4),l:new THREE.BoxGeometry(.18,.6,.2),a:new THREE.BoxGeometry(.13,.55,.13),c:new THREE.ConeGeometry(.2,.3,5),d:new THREE.SphereGeometry(.13,8,6)};
function person(col,vip){const g=new THREE.Group(),ms=(geo,m,y)=>{const o=new THREE.Mesh(geo,m);o.position.y=y;g.add(o);return o};
 ms(PG.t,M(col),.95);ms(PG.h,M(SK[R()*4|0]),1.55);ms(PG.hr,M(HC[R()*4|0]),1.57);const belt=new THREE.Mesh(PG.t,M(0x152b45));belt.scale.set(1.02,.12,1.02);belt.position.y=.69;g.add(belt);
 const eyes=new THREE.InstancedMesh(PG.d,M(0x17202b),2),em=new THREE.Matrix4();[-.085,.085].forEach((x,i)=>{em.compose(new V(x,1.58,.22),new THREE.Quaternion(),new V(.22,.22,.22));eyes.setMatrixAt(i,em)});g.add(eyes);
 const lim=(geo,m,x,y,dy)=>{const a=new THREE.Group(),o=new THREE.Mesh(geo,m);o.position.y=dy;a.add(o);a.position.set(x,y,0);g.add(a);return a};
 g.legs=[-.12,.12].map(x=>lim(PG.l,M(0x37474f),x,.6,-.3));g.arms=[-.38,.38].map(x=>lim(PG.a,M(col),x,1.3,-.25));
 if(vip)ms(PG.c,M(0xffd54f,{emissive:0x7a5a00}),1.95);
 g.dot=ms(PG.d,new THREE.MeshBasicMaterial({color:0xffeb3b}),2.3);g.dot.visible=false;g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
function removeActor(p){if(!p)return;scene.remove(p);if(p.dot&&!p.userData.disposed){p.dot.material.dispose();p.userData.disposed=true}}
function anim(p,o,t){if(!p||!p.legs)return;const mv=o.mv,sw=mv?Math.sin(t*9+(o.ph||0))*.6:0;p.legs[0].rotation.x=sw;p.legs[1].rotation.x=-sw;
 p.arms[0].rotation.x=o.act?-2+Math.sin(t*8)*.35:-sw*.8;p.arms[1].rotation.x=o.act?-1.2+Math.sin(t*8+1)*.3:sw*.8;p.position.y=mv?Math.abs(Math.sin(t*9))*.05:0}
// ---------- trạng thái & lưu
const mkDef=()=>({money:5000,gems:0,xp:0,lvl:1,show:1,park:1,spd:1,staff:1,sold:0,served:0,rev:0,profit:0,rpm:0,t:Date.now(),snd:1,inv:{hatch:0,sedan:0,suv:0,sport:0},rep:20,vip:0,mkt:0,mi:0,auto:1,bought:0,mktN:0,disp:[],td:0,gar:0,tdN:0,garN:0});
const DEF=mkDef();let S=mkDef();
function readProgress(){for(const key of ['aet6','aet6-backup','aet5','aet1']){try{const o=JSON.parse(localStorage.getItem(key)||'null');if(o&&typeof o==='object'&&!Array.isArray(o)&&Number.isFinite(Number(o.money))&&o.inv&&typeof o.inv==='object')return o}catch(e){}}return null}
const restored=readProgress();if(restored)Object.assign(S,restored);
S.inv=Object.assign({hatch:0,sedan:0,suv:0,sport:0},S.inv||{});
if(!S.ver){S.inv.hatch=Math.max(S.inv.hatch,2);S.ver=2}
['money','gems','xp','lvl','show','park','spd','staff','sold','served','rev','profit','rpm','rep','vip','mkt','mi','bought','mktN','td','gar','tdN','garN'].forEach(k=>{if(!isFinite(S[k]))S[k]=DEF[k]});
S.show=Math.min(3,Math.max(1,S.show));S.park=Math.min(3,Math.max(1,S.park));S.staff=Math.min(3,Math.max(1,S.staff));S.td=Math.min(3,Math.max(0,S.td));S.gar=Math.min(3,Math.max(0,S.gar));S.spd=Math.min(6,Math.max(1,S.spd));

// Normalize untrusted/corrupt saves before using counts, arrays or money.
for(const k of ['money','gems','xp','sold','served','rev','rpm','vip','mi','bought','mktN','tdN','garN','mkt']){
 S[k]=Math.min(1e12,Math.max(0,Number(S[k])||0));if(k!=='money'&&k!=='xp'&&k!=='rev'&&k!=='rpm'&&k!=='mkt')S[k]=Math.floor(S[k]);
}
for(const k of ['lvl','show','park','spd','staff','td','gar']) S[k]=Math.floor(S[k]);
S.lvl=Math.max(1,Math.min(1000,S.lvl));S.mi=Math.min(10,Math.floor(S.mi));
S.rep=Math.max(0,Math.min(100,Number(S.rep)||0));S.auto=S.auto?1:0;
S.disp=Array.isArray(S.disp)?S.disp.slice(0,6).map(x=>typeof x==='string'?x:''):[];
for(const k of KS)S.inv[k]=Math.max(0,Math.min(28,Math.floor(Number(S.inv[k])||0)));
S.t=Number.isFinite(Number(S.t))?Math.min(Date.now(),Number(S.t)):Date.now();
S.policy=['balanced','value','premium'].includes(S.policy)?S.policy:'balanced';
S.satisfaction=Math.max(0,Math.min(100,Number(S.satisfaction)||75));
S.rescueAt=Number(S.rescueAt)||0;
if(Number.isFinite(S.garEscrow)&&S.garEscrow>0){S.money+=Math.min(1800,S.garEscrow);S.garEscrow=0}
S.profit=Number.isFinite(Number(S.profit))?Number(S.profit):0;
S.schema=6;
S.train=Math.max(0,Math.min(12,Math.floor(Number(S.train)||0)));
S.training=Math.max(0,Math.min(30,Number(S.training)||0));
S.ops=Math.max(0,Number(S.ops)||0);
S.pricing=Object.fromEntries(KS.map(k=>[k,Math.max(.85,Math.min(1.2,Number(S.pricing?.[k])||1))]));
S.basis=Object.fromEntries(KS.map(k=>[k,Math.max(1,Math.min(CARS[k].cost*2,Number(S.basis?.[k])||CARS[k].cost))]));
S.displayData=Array.isArray(S.displayData)?S.displayData.slice(0,6):[];
S.stats=Object.fromEntries(['cars','garage','test','offline'].map(k=>[k,Math.max(0,Number(S.stats?.[k])||0)]));
S.history=Array.isArray(S.history)?S.history.filter(x=>x&&Number.isFinite(x.hour)&&Number.isFinite(x.profit)).slice(-24):[];
S.quality=['auto','eco','high'].includes(S.quality)?S.quality:'auto';
const tabId=Date.now().toString(36)+Math.random().toString(36).slice(2);
let owner=true,storageOK=true;
function ownSave(){try{const lease=JSON.parse(localStorage.getItem('aet6-owner')||'null');return !lease||lease.id===tabId||Date.now()-lease.at>15000}catch(e){return true}}
function lease(){if(!ownSave()){owner=false;return}try{localStorage.setItem('aet6-owner',JSON.stringify({id:tabId,at:Date.now()}))}catch(e){storageOK=false}}
lease();
function market(k){const i=KS.indexOf(k),epoch=Math.floor(Date.now()/600000);return {buy:1+.035*Math.sin(epoch*1.71+i*2),sell:1+.055*Math.sin(epoch*.83+i*1.9),demand:1+.2*Math.sin(epoch*.83+i*1.9)}}
function choosePreferred(keys){let n=R()*keys.reduce((a,k)=>a+market(k).demand,0);for(const k of keys){n-=market(k).demand;if(n<=0)return k}return keys[0]}
function stockCost(k){return Math.round(CARS[k].cost*market(k).buy)}
function recordIncome(type,profit){S.stats[type]+=profit;const hour=Math.floor(Date.now()/3600000);let row=S.history.find(x=>x.hour===hour);if(!row){row={hour,profit:0};S.history.push(row);S.history=S.history.slice(-24)}row.profit+=profit}
function recordExpense(cost){S.ops+=cost;const hour=Math.floor(Date.now()/3600000);let row=S.history.find(x=>x.hour===hour);if(!row){row={hour,profit:0};S.history.push(row);S.history=S.history.slice(-24)}row.profit-=cost}
function trainCost(){return Math.round(1200*Math.pow(1.65,S.train))}
function startTraining(){if(S.training||S.train>=12||S.money<trainCost())return;const cost=trainCost();S.money-=cost;recordExpense(cost);S.training=30;S.trainingPending=true;save();refreshP(1)}
function adjustPrice(k,step){if(!CARS[k])return;S.pricing[k]=Math.max(.85,Math.min(1.2,Math.round((S.pricing[k]+step)*100)/100));save();refreshP(1)}
S.used=S.used||0;S.orders=Array.isArray(S.orders)?S.orders.filter(o=>o&&!o.done&&CARS[o.k]).slice(0,3):[];S.orderId=Number(S.orderId)||0;
function buyUsed(){const cost=1800;if(S.money<cost||S.used>=3)return;S.money-=cost;S.used++;save();refreshP(1)}
function orderCar(){if(S.orders.length>=3)return;const un=KS.filter(x=>CARS[x].lv<=S.show),k=un[Math.floor(R()*un.length)];S.orders.push({id:++S.orderId,k,elapsed:0});save();refreshP(1)}
function updateOrders(dt){for(const o of S.orders){o.elapsed+=dt;if(o.elapsed>=45&&S.inv[o.k]>0){S.inv[o.k]--;const income=Math.round(CARS[o.k].price*1.12),profit=income-S.basis[o.k];S.money+=income;S.profit+=profit;S.rev+=income;S.sold++;recordIncome('cars',profit);o.done=true;toast('Giao đơn đặt '+CARS[o.k].n+' · '+fm(income));save()}}S.orders=S.orders.filter(o=>!o.done)}
const fm=n=>'$'+Math.floor(n).toLocaleString('en-US'),need=l=>Math.round(120*Math.pow(l,1.5));
let resetting=false;
function save(f){if(resetting||!owner||!ownSave())return false;if(f||!document.hidden)S.t=Date.now();S.displayData=slots.map(d=>({basis:d.basis||0}));S.garEscrow=gj?gj.bc:0;S.disp=slots.map(d=>d.car?d.car+(d.cons?'*':''):'');try{const raw=JSON.stringify(S);localStorage.setItem('aet6',raw);localStorage.setItem('aet6-backup',raw);storageOK=true;return true}catch(e){storageOK=false;toast('Không lưu được: bộ nhớ trình duyệt bị chặn hoặc đầy')}}
// ---------- cảnh
const ren=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});ren.setPixelRatio(Math.min(devicePixelRatio,1.5));ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;ren.outputEncoding=THREE.sRGBEncoding;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.15;document.body.prepend(ren.domElement);
let adaptiveDpr=Math.min(devicePixelRatio,1.5),qualityClock=0,qualityFrames=0;
function setQuality(){ren.setPixelRatio(S.quality==='eco'?1:S.quality==='high'?Math.min(devicePixelRatio,1.75):adaptiveDpr);ren.shadowMap.enabled=S.quality!=='eco';fit()}
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9fd4f0);scene.fog=new THREE.Fog(0x9fd4f0,95,170);
scene.add(new THREE.HemisphereLight(0xdff1ff,0x6a8f5a,.7));
const sun=new THREE.DirectionalLight(0xfff0d0,.85);sun.position.set(25,40,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38,far:120});scene.add(sun);
const fill=new THREE.DirectionalLight(0x9ec8ff,.25);fill.position.set(-20,15,-10);scene.add(fill);
const cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,300);const portraitFocus=innerWidth<innerHeight;let zoom=portraitFocus?1.0:1,T=new V(portraitFocus?(S.show>=2?10.5:5.5):0,0,portraitFocus?-1:2),TT=T.clone();
function fit(){ren.setSize(innerWidth,innerHeight);const a=innerWidth/innerHeight,W=(a<1?36:54)/zoom,H=W/a;cam.left=-W/2;cam.right=W/2;cam.top=H/2;cam.bottom=-H/2;cam.updateProjectionMatrix()}
addEventListener('resize',fit);
const BOX_GEOMETRY={};
const box=(w,h,d,c,x,y,z,o)=>{const key=w+","+h+","+d,geometry=BOX_GEOMETRY[key]||(BOX_GEOMETRY[key]=new THREE.BoxGeometry(w,h,d));const m=new THREE.Mesh(geometry,M(c,o));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;return m};
const hit=[];function key(g,k){g.traverse(o=>o.userData.key=k);hit.push(g);scene.add(g);return g}
scene.add(box(160,1,160,0x7cc36a,0,-.5,0),box(160,.1,4.4,0x3a3f47,0,.05,12.7));
for(let x=-70;x<70;x+=4)scene.add(box(1.8,.02,.2,0xffffff,x,.11,12.7));
const park=new THREE.Group();park.add(box(30,.12,8,0x555b66,0,.06,6.6));
const PX=[-2,2,-6,6,-10,10],pmark=PX.map(x=>{const a=box(.12,.02,4.4,0xffffff,x+2,.14,7),b=box(.12,.02,4.4,0xffffff,x-2,.14,7);park.add(a,b);return[a,b]});key(park,'park');
const sh=new THREE.Group(),tc=document.createElement('canvas');tc.width=tc.height=64;const tx=tc.getContext('2d');tx.fillStyle='#eef2f7';tx.fillRect(0,0,64,64);tx.fillStyle='#cfd8e3';tx.fillRect(0,0,32,32);tx.fillRect(32,32,32,32);
const tex=new THREE.CanvasTexture(tc);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(15,6.5);
// One local Canva albedo, reused through the existing GPU texture; checkerboard is the load-failure fallback.
tex.encoding=THREE.sRGBEncoding;
const floorImage=new Image();floorImage.onload=()=>{tc.width=tc.height=256;tx.drawImage(floorImage,0,0,256,256);tx.strokeStyle='rgba(65,55,45,.16)';tx.lineWidth=1;tx.strokeRect(.5,.5,255,255);tex.needsUpdate=true};
floorImage.src=ART['showroom-floor'];

const fl=box(30,.3,13,0xffffff,0,.15,-4.5);fl.material=new THREE.MeshStandardMaterial({map:tex,roughness:.22,metalness:.12,envMapIntensity:1.0});sh.add(fl,box(30,4.5,.4,0xb0bec5,0,2.25,-11));
[-9,0,9].forEach(x=>sh.add(box(6,.25,.1,0xffffff,x,3.6,-10.7,{emissive:0xffffff})));
const glass={transparent:true,opacity:.22,roughness:.05,metalness:.2};
sh.add(box(13.5,3.4,.2,0x9fd8ff,-8.25,1.9,2,glass),box(13.5,3.4,.2,0x9fd8ff,8.25,1.9,2,glass),box(.2,3.4,13,0x9fd8ff,-15,1.9,-4.5,glass),box(.2,3.4,13,0x9fd8ff,15,1.9,-4.5,glass),
 box(31,.5,.5,0x37474f,0,3.8,2),box(31,.4,.5,0x37474f,0,.4,2),box(31,.2,3,0x263238,0,4.2,3.2,{transparent:true,opacity:.8}));
function textSign(text,w,h){const c=document.createElement('canvas');c.width=512;c.height=128;const t=c.getContext('2d');t.fillStyle='#152b45';t.fillRect(0,0,512,128);t.fillStyle='#ffd564';t.font='bold 48px sans-serif';t.textAlign='center';t.fillText(text,256,83);const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}))}
const brand=textSign('AUTO EMPIRE',9.7,1.4);brand.position.set(0,5.4,2.22);sh.add(brand);
const sign=box(10,1.6,.4,0xffffff,0,5.4,2,{emissive:0x666666});sh.add(sign);
const u2=new THREE.Group();[-13,13].forEach(x=>u2.add(box(1,.8,1,0x6d4c41,x,.7,0),box(1.6,1.6,1.6,0x2e9e4f,x,1.8,0)));u2.add(box(5,.04,3,0x1e3a8a,0,.34,-1));
const u3=new THREE.Group();[-14,14].forEach(x=>u3.add(box(.8,4,.8,0xffd54f,x,2.2,-10.4,{metalness:.8,roughness:.2})));u3.add(box(3,3,.3,0xffd54f,0,3,-10.6,{metalness:.8,roughness:.2,emissive:0x7a5a00}));sh.add(u2,u3);
const SP=[[-3,-4],[3,-4],[-9,-4],[9,-4],[-3,-8.5],[3,-8.5]],PD=new THREE.CylinderGeometry(2.12,2.12,.15,24),ped=SP.map(p=>{const m=new THREE.Mesh(PD,M(0x37474f,{roughness:.2,metalness:.5}));m.position.set(p[0],.38,p[1]);m.receiveShadow=true;sh.add(m);return m});
[-15,15].forEach(x=>[-10,-4,1].forEach(z=>sh.add(box(.16,3.6,.16,0x27405a,x,1.9,z))));
 const lounge=new THREE.Group();lounge.add(box(3,.55,1.1,0x217d91,-11,.65,-8),box(3,.8,.2,0x217d91,-11,1.15,-8.5),box(1.5,.12,1,0xd9b879,-11,.65,-6.6));sh.add(lounge);
 const wing=new THREE.Group();wing.add(box(10,.3,12,0xdde8ec,21,.15,-4.5),box(12,4.5,.3,0x27405a,21,2.25,-11));[-9,-4,1].forEach(z=>wing.add(box(.22,4,.22,0xe1c499,26.5,2,z)));const wingSign=textSign('PREMIUM GALLERY',10,1.3);wingSign.position.set(21,4.4,1);wing.add(wingSign);sh.add(wing);
const oldVis=applyVis;applyVis=function(){oldVis();wing.visible=S.show>=2;wing.scale.x=1};
key(sh,'show');
const ctr=new THREE.Group();ctr.add(box(4,1.1,1,0x1565c0,12,.65,-1.6),box(4.2,.12,1.2,0xeeeeee,12,1.25,-1.6),box(.7,.5,.1,0x222222,12.5,1.6,-1.6));key(ctr,'staff');
const trees=[];[[-20,-14],[20,-12],[-18,17],[22,18],[0,-16],[-8,-16],[9,-16]].forEach(p=>{const g=new THREE.Group();g.add(box(.4,1.4,.4,0x6d4c41,0,.7,0));const c=new THREE.Mesh(new THREE.ConeGeometry(1.5,3.5,7),M(0x2e8b57));c.position.y=3;c.castShadow=true;g.add(c);g.position.set(p[0],0,p[1]);scene.add(g);trees.push(g)});
// Decorative campus outside customer routes. Static instances avoid per-object draw calls.
const livingDistrict=new THREE.Group();livingDistrict.name='living-district';scene.add(livingDistrict);
function districtInstances(geometry,material,points,shadow){
 const mesh=new THREE.InstancedMesh(geometry,material,points.length),obj=new THREE.Object3D();
 points.forEach((p,i)=>{obj.position.set(p[0],p[1],p[2]);obj.scale.set(p[3]||1,p[4]||1,p[5]||1);obj.rotation.y=(i%7)*.47;obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix)});
 mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=!!shadow;mesh.receiveShadow=true;livingDistrict.add(mesh);return mesh;
}
const outerShrubs=[];
for(let i=0;i<11;i++)outerShrubs.push([-15.8+i*3.15,.72,-12.65,.72,1,.72]);
for(let i=0;i<5;i++){outerShrubs.push([-16.8,.72,-9+i*2.5,.76,1,.76]);outerShrubs.push([16.8,.72,-9+i*2.5,.76,1,.76])}
districtInstances(new THREE.ConeGeometry(.90,1.6,7),M(0x559b69,{roughness:1}),outerShrubs,true);
const grassMarks=[];
for(let i=0;i<36;i++){const x=-47+(i*31%95),z=-28+(i*43%63);
 if(Math.abs(x)<31&&z>-16&&z<17)continue;
 if(z>10&&z<17)continue;
 grassMarks.push([x,.025,z,.48+(i%4)*.17,.7,.65+(i%3)*.18]);
}
districtInstances(new THREE.CylinderGeometry(1,1,.045,6),M(0x75be69,{roughness:1}),grassMarks,false);
const zebra=[];for(let i=0;i<8;i++)zebra.push([-31,.135,11.15+i*.45,.7,1,.52]);
districtInstances(new THREE.BoxGeometry(.36,.025,.32),M(0xf4eee0,{roughness:1}),zebra,false);
for(const x of [-12.5,12.5]){
 livingDistrict.add(box(.12,3,.12,0x384c57,x,1.5,2.45),box(1.3,.72,.1,0xffca49,x,2.68,2.45,{metalness:.15,roughness:.6}));
}

const lamps=new THREE.Group();[[-14,10],[14,10],[0,10]].forEach(p=>lamps.add(box(.2,4,.2,0x444444,p[0],2,p[1]),box(.8,.3,.8,0xfff59d,p[0],4.1,p[1],{emissive:0xfff59d})));scene.add(lamps);
const bb=new THREE.Group();bb.add(box(.3,5,.3,0x555555,-22,2.5,9),box(.3,5,.3,0x555555,-17,2.5,9),box(7,3,.3,0xe53935,-19.5,6,9,{emissive:0x551111}));scene.add(bb);
const tdG=new THREE.Group();tdG.add(box(12,.1,16,0x3a3f47,22.5,.05,-2),box(5,.14,9,0x7cc36a,22.5,.06,-2),box(2.2,.1,1.4,0xffc107,17.5,.12,3.8),box(.3,3,.3,0x555555,16,1.5,5.5),box(3,1,.2,0xffc107,16,3.2,5.5,{emissive:0x553d00}));key(tdG,'show');
const garG=new THREE.Group();garG.add(box(9,.2,7,0x607d8b,-23,.1,-2.5),box(9,4,.3,0x90a4ae,-23,2,-6),box(.3,4,7,0x90a4ae,-27.4,2,-2.5),box(.3,4,7,0x90a4ae,-18.6,2,-2.5),box(6,1,.3,0xe53935,-23,4.5,.8,{emissive:0x441111}),box(1.2,.8,.8,0xffa000,-26,.6,-5),box(.8,1.8,.8,0x455a64,-19.5,1.1,-5));key(garG,'show');
let gj=null,gT=10,mech=null,tdBusy=0;
const traffic=[0xeeeeee,0x546e7a,0xc62828].map((c,i)=>{const m=makeCar(['sedan','hatch','suv'][i],c);m.position.set(30-i*28,0,14.4);m.rotation.y=Math.PI;scene.add(m);return{m,sp:5+i}});
const clouds=[0,1,2,3,4].map(i=>{const g=new THREE.Group();[0,1,2].forEach(j=>{const s=new THREE.Mesh(new THREE.SphereGeometry(3+j,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85}));s.position.x=j*3.2;s.scale.y=.5;g.add(s)});g.position.set(-60+i*28,28,-45);scene.add(g);return g});
const PT=[],pg=new THREE.SphereGeometry(.12,6,4),pmt=new THREE.MeshBasicMaterial({color:0xffd54f});
for(let i=0;i<24;i++){const m=new THREE.Mesh(pg,pmt);m.visible=false;scene.add(m);PT.push({m,v:new V(),l:0})}
function burst(p){let n=0;PT.forEach(q=>{if(q.l<=0&&n<12){n++;q.l=1;q.m.visible=true;q.m.position.set(p.x,2,p.z);q.v.set((R()-.5)*5,4+R()*3,(R()-.5)*5)}})}
// ---------- camera (đã sửa lệch kéo)
const cameraOffset=new V(1,1.05,1).multiplyScalar(45);
function updCam(){T.lerp(TT,.12);cam.position.copy(T).add(cameraOffset);cam.lookAt(T)}
let framedShowroomLevel=0;
function frameShowroomForLevel(){
 if(!portraitFocus||framedShowroomLevel===S.show)return;
 framedShowroomLevel=S.show;
 const gallery=S.show>=2;
 T.set(5.6,0,-1);TT.copy(T);
 zoom=1;fit();
 cam.position.copy(T).add(cameraOffset);cam.lookAt(T);cam.updateMatrixWorld(true);
 let maxX=0,maxY=0;
 const ends=[-22.3,33.2];
 for(const xx of ends)for(const zz of [-14.1,7.2])for(const yy of [0,10]){
  const p=new V(xx,yy,zz).project(cam);
  maxX=Math.max(maxX,Math.abs(p.x));maxY=Math.max(maxY,Math.abs(p.y));
 }
 zoom=Math.max(.43,Math.min(1.12,Math.min(.91/maxX,.74/maxY)));
 fit();
}
const ptr=new Map(),cvs=ren.domElement,ray=new THREE.Raycaster(),RT=new V(1,0,-1).normalize(),FW=new V(-1,0,-1).normalize();let down=null,pd=0;
cvs.addEventListener('pointerdown',e=>{cvs.setPointerCapture(e.pointerId);ptr.set(e.pointerId,[e.clientX,e.clientY]);down=[e.clientX,e.clientY,0];if(ptr.size==2){const p=[...ptr.values()];pd=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);down[2]=99}audio()});
cvs.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;const o=ptr.get(e.pointerId),dx=e.clientX-o[0],dy=e.clientY-o[1];ptr.set(e.pointerId,[e.clientX,e.clientY]);
 if(ptr.size==2){const p=[...ptr.values()],d=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);if(pd>0){zoom=Math.max(.6,Math.min(2.4,zoom*d/pd));fit()}pd=d;if(down)down[2]=99}
 else if(down){down[2]+=Math.abs(dx)+Math.abs(dy);if(down[2]<8)return;const s=(cam.top-cam.bottom)/innerHeight;TT.addScaledVector(RT,-dx*s).addScaledVector(FW,dy*s*1.68);TT.x=Math.max(-28,Math.min(28,TT.x));TT.z=Math.max(-14,Math.min(16,TT.z));T.copy(TT)}});
const endp=e=>{if(!ptr.has(e.pointerId))return;ptr.delete(e.pointerId);if(down&&down[2]<8&&ptr.size==0)tap(e.clientX,e.clientY);if(ptr.size==0)down=null;else if(down)down[2]=99};
cvs.addEventListener('pointerup',endp);cvs.addEventListener('pointercancel',e=>{ptr.delete(e.pointerId);if(!ptr.size)down=null});
function tap(x,y){ray.setFromCamera({x:x/innerWidth*2-1,y:-(y/innerHeight)*2+1},cam);const h=ray.intersectObjects(hit,true);let o=h[0]&&h[0].object,k;while(o&&!k){k=o.userData.key;o=o.parent}if(k){focus(k);openP(k=='park'?'show':k)}else closeP()}
const FOC={show:[0,-3],park:[0,7],staff:[0,0],inv:[0,-3]};function focus(k){if(FOC[k])TT.set(FOC[k][0],0,FOC[k][1])}
let ac;function audio(){if(!ac)try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}if(ac&&ac.state=='suspended')ac.resume()}
function beep(f,d){if(!ac||!S.snd)return;const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.value=.12;g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(e.h);e.h=setTimeout(()=>e.style.opacity=0,2200)}
function popup(t,p){$('mt').textContent=t;$('mp').innerHTML=p;$('modal').style.display='flex'}
// V9 visual layer. No persistent save fields or external network assets.
const showroomPremium=new THREE.Group();showroomPremium.name='showroom-premium-details';scene.add(showroomPremium);
const turntables=new THREE.Group();turntables.name='showroom-turntables';showroomPremium.add(turntables);
const podiumGlow=[];
SP.forEach((p,i)=>{
 const ring=new THREE.Mesh(new THREE.TorusGeometry(2.07,.065,3,40),new THREE.MeshBasicMaterial({color:0xffdda0,transparent:true,opacity:.67,depthWrite:false}));
 ring.rotation.x=-Math.PI/2;ring.position.set(p[0],.49,p[1]);turntables.add(ring);podiumGlow.push(ring);
});
showroomPremium.add(
 box(31,.18,.45,0xe1bb79,0,4.13,2.06,{metalness:.6,roughness:.3}),
 box(31,.28,1.55,0x203a4d,0,4.32,2.6,{metalness:.45,roughness:.35}),
 box(30.6,.065,.13,0xffe0a1,0,4.1,3.4,{emissive:0x855e22}),
 box(1.55,.025,10.7,0x244c58,0,.333,-4.8,{metalness:.3,roughness:.2}),
 box(.055,.03,10.7,0xe8cf9e,-.84,.361,-4.8,{emissive:0x7c602a}),
 box(.055,.03,10.7,0xe8cf9e,.84,.361,-4.8,{emissive:0x7c602a})
);
for(const x of [-12.6,-6.5,0,6.5,12.6]){
 showroomPremium.add(box(.095,2.6,.095,0xd0ae78,x,2.55,1.95,{metalness:.7,roughness:.25}));
 showroomPremium.add(box(2.6,.06,.12,0xf8e5b9,x,3.83,-10.55,{emissive:0x6c552c}));
}
const v9Planters=new THREE.Group();v9Planters.name='v9-fallback-planters';showroomPremium.add(v9Planters);
for(const x of [-13.4,13.4]){
 v9Planters.add(box(1.4,.6,1.25,0x233e4a,x,.43,-9.2,{metalness:.35,roughness:.5}));
 v9Planters.add(box(1.23,.055,1.1,0xc79c5c,x,.76,-9.2));
 const leaves=new THREE.Mesh(new THREE.ConeGeometry(.66,1.7,7),M(0x267956,{roughness:1}));
 leaves.position.set(x,1.63,-9.2);leaves.castShadow=true;v9Planters.add(leaves);
}
const showroomLevelTwo=new THREE.Group();showroomLevelTwo.name='showroom-level-2';showroomPremium.add(showroomLevelTwo);
showroomLevelTwo.add(
 box(11.6,.26,1.35,0x1c344b,21,4.24,1.35),
 box(11.5,.075,.17,0xffcf75,21,4.14,2.15,{emissive:0xb07727}),
 box(10,.06,12,0xc7ab76,21,.38,-4.5,{metalness:.25,roughness:.45})
);
for(const x of [17.2,24.8])showroomLevelTwo.add(box(.15,3.6,.15,0xc0a56b,x,2.14,1.85,{metalness:.6,roughness:.35}));
const wingDecor=new THREE.Group();wingDecor.name='premium-gallery-decor';showroomLevelTwo.add(wingDecor);
for(const x of [18.4,23.5]){
 const stand=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.25,.24,24),M(0x294250,{metalness:.45,roughness:.32}));
 stand.position.set(x,.58,-5.15);stand.receiveShadow=true;wingDecor.add(stand);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.04,.035,4,28),M(0xe3c078,{metalness:.65,roughness:.25}));
 ring.rotation.x=-Math.PI/2;ring.position.set(x,.735,-5.15);wingDecor.add(ring);
}
for(const x of [16.9,25.2]){
 const pot=new THREE.Mesh(new THREE.CylinderGeometry(.49,.36,.56,9),M(0x274a56,{metalness:.25}));
 pot.position.set(x,.69,-8.8);wingDecor.add(pot);
 const plant=new THREE.Mesh(new THREE.SphereGeometry(.65,10,7),M(0x4a9360,{roughness:1}));
 plant.position.set(x,1.45,-8.8);plant.scale.set(1,.95,1);plant.castShadow=true;wingDecor.add(plant);
}
for(const x of [16.7,25.3]){
 const light=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,2.1,8),M(0xc7aa79,{metalness:.6}));
 light.position.set(x,2.05,-2);wingDecor.add(light);
 const glow=new THREE.Mesh(new THREE.SphereGeometry(.24,10,8),new THREE.MeshBasicMaterial({color:0xffe9b1}));
 glow.position.set(x,3.15,-2);wingDecor.add(glow);
}
const showroomLevelThree=new THREE.Group();showroomLevelThree.name='showroom-level-3';showroomPremium.add(showroomLevelThree);
showroomLevelThree.add(
 box(1.1,6,.75,0xb59655,-15.1,3.1,2.15,{metalness:.7,roughness:.3}),
 box(1.1,6,.75,0xb59655,15.1,3.1,2.15,{metalness:.7,roughness:.3}),
 box(31,.35,.65,0xffd785,0,6.13,2.16,{metalness:.75,roughness:.24,emissive:0x70501d}),
 box(29.5,.10,.2,0xf4efdd,0,6.4,2.2,{emissive:0x695b3d})
);
const showroomVis=applyVis;
applyVis=function(){showroomVis();showroomLevelTwo.visible=S.show>=2;showroomLevelThree.visible=S.show>=3;frameShowroomForLevel()};

// Instanced detail parts are cheaper than dozens of extra draw calls per car.
const baseMakeCar=makeCar;
makeCar=function(k,col){
 const g=baseMakeCar(k,col),G=carGeo(k),L=G.L;
 const detail=new THREE.Group();detail.name='vehicle-detail-package';g.add(detail);
 const addAccents=(parts,color)=>{
  const mesh=new THREE.InstancedMesh(TRIM,M(color,{metalness:color===0xd8c4a0?.75:.15,roughness:.32}),parts.length),matrix=new THREE.Matrix4(),quat=new THREE.Quaternion();
  parts.forEach((a,i)=>{matrix.compose(new V(a[0],a[1],a[2]),quat,new V(a[3],a[4],a[5]));mesh.setMatrixAt(i,matrix)});
  mesh.instanceMatrix.needsUpdate=true;detail.add(mesh);
 };
 addAccents([
  [L+.09,.68,0,.05,.07,1.15],[L+.09,.40,0,.055,.075,1.35],
  [-.74,.96,-.985,.26,.055,.065],[.64,.96,-.985,.26,.055,.065],
  [-.74,.96,.985,.26,.055,.065],[.64,.96,.985,.26,.055,.065],
  [-L-.08,.60,0,.045,.07,1.1]
 ],0xd8c4a0);
 addAccents([
  [0,.89,-.962,.026,.51,.045],[0,.89,.962,.026,.51,.045],
  [-.05,.44,-.95,2.65,.085,.055],[-.05,.44,.95,2.65,.085,.055],
  [L+.11,.53,-.52,.065,.15,.30],[L+.11,.53,.52,.065,.15,.30],
  [-L-.09,.42,-.55,.04,.18,.20],[-L-.09,.42,.55,.04,.18,.20]
 ],0x142c38);
 const roofY=k==='suv'?1.78:k==='sport'?1.28:1.58;
 const skylight=new THREE.Mesh(TRIM,M(0x162d3e,{metalness:.45,roughness:.12}));
 skylight.scale.set(k==='suv'?1.1:.8,.035,k==='sport'?.7:1.02);skylight.position.set(-.05,roofY,0);detail.add(skylight);
 if(k==='suv')for(const z of [-.78,.78]){const bar=new THREE.Mesh(TRIM,M(0xc5d1d8,{metalness:.7,roughness:.3}));bar.scale.set(2.15,.07,.07);bar.position.set(-.1,roofY+.12,z);detail.add(bar)}
 return g;
};

// A moving car transporter is visual feedback for paid stock purchases.
const deliveryTruck=new THREE.Group();deliveryTruck.name='delivery-truck';deliveryTruck.visible=false;scene.add(deliveryTruck);
deliveryTruck.add(
 box(5.8,.30,2.35,0x354653,.1,.92,0,{metalness:.4,roughness:.5}),
 box(2,1.72,2.24,0x244f64,-2.05,1.74,0,{metalness:.4,roughness:.4}),
 box(.075,.86,1.73,0x9bd9ee,-3.12,1.99,0,{metalness:.2,roughness:.1}),
 box(3.4,.22,2.12,0xe9bc68,1.28,1.18,0,{metalness:.5,roughness:.35}),
 box(2.1,.16,2.4,0xf3d88b,-2.15,2.68,0,{metalness:.3,roughness:.3})
);
for(const x of [-2.45,.6,2.1])for(const z of [-1.2,1.2]){
 const tire=new THREE.Mesh(WG,M(0x17222c,{roughness:1}));tire.position.set(x,.39,z);deliveryTruck.add(tire);
 const hub=new THREE.Mesh(HUB,M(0xd4dfdf,{metalness:.6,roughness:.36}));hub.position.copy(tire.position);deliveryTruck.add(hub);
}
const deliveryCargo=makeCar('hatch',0xe3ad54);deliveryCargo.scale.setScalar(.56);deliveryCargo.position.set(1.1,1.35,0);deliveryTruck.add(deliveryCargo);
const deliveryBeacon=new THREE.Mesh(new THREE.BoxGeometry(.35,.22,.35),new THREE.MeshBasicMaterial({color:0xffa630}));
deliveryBeacon.position.set(-2.3,2.87,0);deliveryTruck.add(deliveryBeacon);
const deliveryEffect={remaining:0};
function playDelivery(){deliveryEffect.remaining=12;deliveryTruck.position.set(39,0,12.7);deliveryTruck.visible=true}
let showcaseTime=0,showcaseSold=S.sold,showcaseFlash=0;
function updateShowcase(dt){
 showcaseTime+=dt;
 if(showcaseSold!==S.sold){showcaseFlash=2;showcaseSold=S.sold}
 showcaseFlash=Math.max(0,showcaseFlash-dt);
 podiumGlow.forEach((ring,i)=>{ring.visible=i<NSL();ring.material.opacity=.57+Math.sin(showcaseTime*1.5+i*.9)*.13+showcaseFlash*.08});
 slots.forEach((d,i)=>{if(d.mesh&&d.sc>=.9)d.mesh.rotation.y=Math.sin(showcaseTime*.42+i*.75)*.17});
 if(deliveryEffect.remaining>0){
  deliveryEffect.remaining=Math.max(0,deliveryEffect.remaining-dt);deliveryTruck.position.x-=7.4*dt;
  deliveryTruck.visible=deliveryEffect.remaining>0;deliveryBeacon.visible=Math.sin(showcaseTime*11)>0;
 }
}
// CC0 Kenney game-ready glTF models. Procedural meshes stay as fallback for network/decoder failures.
// GLTFLoader r128 loads local, content-addressed GLB files; each template is fetched once.
const GLB_ASSETS={readyCars:0,readyProps:0,failed:[],loaded:{}};
const assetLoader=new THREE.GLTFLoader();
const vehicleAssets={hatch:'kenney-car-hatch',sedan:'kenney-car-sedan',suv:'kenney-car-suv',sport:'kenney-car-sport'};
const vehicleTemplates=Object.create(null);
const pendingVehicle={hatch:[],sedan:[],suv:[],sport:[]};
const fallbackCarFactory=makeCar;

// Kenney car body and glass share a colormap atlas. Recolor only the body
// paint swatch in a cloned body texture. Wheel meshes keep the original map.
const paintMaterialCache=new Map(),paintRuleCache=new Map();
function paintForBody(body,k,hex){
 const source=body.material,texture=source?.map,image=texture?.image;
 if(!source||!texture||!image)return null;
 const id=k+':'+hex.toString(16);
 if(paintMaterialCache.has(id))return paintMaterialCache.get(id);
 let rule=paintRuleCache.get(k);
 if(!rule){
  const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
  const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,c.width,c.height);
  const img=ctx.getImageData(0,0,c.width,c.height),data=img.data;
  const uv=body.geometry.attributes.uv,pos=body.geometry.attributes.position;
  const index=body.geometry.index,hist=new Map(),a=new V(),b=new V(),cc=new V();
  const triangles=index?index.count:pos.count;
  for(let i=0;i<triangles;i+=3){
   const i0=index?index.getX(i):i,i1=index?index.getX(i+1):i+1,i2=index?index.getX(i+2):i+2;
   const u=(uv.getX(i0)+uv.getX(i1)+uv.getX(i2))/3,v=(uv.getY(i0)+uv.getY(i1)+uv.getY(i2))/3;
   const px=Math.min(c.width-1,Math.max(0,Math.floor(((u%1+1)%1)*c.width)));
   const py=Math.min(c.height-1,Math.max(0,Math.floor(((v%1+1)%1)*c.height)));
   const at=(py*c.width+px)*4,red=data[at],green=data[at+1],blue=data[at+2];
   const hi=Math.max(red,green,blue),lo=Math.min(red,green,blue);
   if(hi<70||hi-lo<32||lo>190)continue;
   a.fromBufferAttribute(pos,i0);b.fromBufferAttribute(pos,i1);cc.fromBufferAttribute(pos,i2);
   const area=b.clone().sub(a).cross(cc.clone().sub(a)).length();
   const key=(red>>3)+','+(green>>3)+','+(blue>>3);
   hist.set(key,(hist.get(key)||0)+area);
  }
  const ranked=[...hist.entries()].sort((a,b)=>b[1]-a[1]);
  if(!ranked.length)throw Error('No paint swatch sampled for '+k);
  const paint=ranked[0][0].split(',').map(n=>Number(n)*8+4);
  rule={paint,width:c.width,height:c.height,image:img};
  paintRuleCache.set(k,rule);
  console.log('V11.2 Kenney paint',k,'swatch',paint,'candidates',ranked.slice(0,3));
 }
 const canvas=document.createElement('canvas');canvas.width=rule.width;canvas.height=rule.height;
 const ctx=canvas.getContext('2d');
 const img=new ImageData(new Uint8ClampedArray(rule.image.data),rule.width,rule.height);
 const d=img.data,[r,g,b]=rule.paint,red=hex>>16&255,green=hex>>8&255,blue=hex&255;
 let count=0;
 for(let i=0;i<d.length;i+=4){
  if(Math.abs(d[i]-r)>17||Math.abs(d[i+1]-g)>17||Math.abs(d[i+2]-b)>17)continue;
  d[i]=red;d[i+1]=green;d[i+2]=blue;count++;
 }
 if(count===0)throw Error('Paint swatch has no atlas pixels '+k);
 ctx.putImageData(img,0,0);
 const map=texture.clone();map.image=canvas;map.needsUpdate=true;
 // Preserve the hashed Kenney colormap so the body retains the requested
 // color while windows, lamps and wheel meshes keep their original UVs.
 // Clearcoat affects the car paint only, not the whole vehicle.
 const mat=new THREE.MeshPhysicalMaterial({
  map:map,color:source.color.clone(),side:source.side,
  transparent:source.transparent,opacity:source.opacity,alphaTest:source.alphaTest,
  vertexColors:source.vertexColors,
  roughness:.18,metalness:.75,clearcoat:1.0,clearcoatRoughness:.04
 });
 paintMaterialCache.set(id,mat);
 return mat;
}
function vehiclePaint(root,k,col){
 if(Number.isInteger(col))return col;
 if(Number.isInteger(root.userData.requestedColor))return root.userData.requestedColor;
 const original=root.children.find(c=>c.isMesh&&c.material?.color);
 if(original)return original.material.color.clone().convertLinearToSRGB().getHex();
 return CARS[k].col;
}
// Only distinct glass/chrome meshes may receive separate physical materials.
 // Kenney's current 'body' mesh also contains mapped windows: never turn
 // that entire mesh transparent (it would destroy the per-car paint atlas).
const premiumGlassCache=new WeakMap(),premiumChromeCache=new WeakMap();
function upgradeVehicleSurface(node){
 if(!node.isMesh||!node.material||Array.isArray(node.material))return;
 const name=(node.name||'').toLowerCase();
 const source=node.material,matName=(source.name||'').toLowerCase();
 if(/glass|window/.test(name)){
  let mat=premiumGlassCache.get(source);
  if(!mat){
   mat=new THREE.MeshPhysicalMaterial({
    color:0x112233,map:source.map,side:source.side,
    transparent:true,opacity:.65,transmission:.85,ior:1.5,
    roughness:.05,metalness:.1,depthWrite:false
   });
   premiumGlassCache.set(source,mat);
  }
  node.material=mat;
 }else if(/rim|chrome/.test(name)||(/chrome/.test(matName)&&!/wheel/.test(name))){
  let mat=premiumChromeCache.get(source);
  if(!mat){
   mat=new THREE.MeshStandardMaterial();mat.copy(source);
   mat.metalness=.95;mat.roughness=.1;premiumChromeCache.set(source,mat);
  }
  node.material=mat;
 }
}
function applyVehicleAsset(root,k,col){
 const template=vehicleTemplates[k];
 if(!template)return false;
 const copy=template.clone(true);
 copy.rotation.y=Math.PI/2; // Kenney vehicles face +Z, game vehicles face +X.
 copy.scale.setScalar(k==='sport'?1.48:1.51);
 const wheels=[];
 copy.traverse(o=>{
  if(o.isMesh){o.castShadow=true;o.receiveShadow=true;upgradeVehicleSurface(o);}
  if(/^wheel-/.test(o.name)){o.userData.kenneyWheel=true;wheels.push(o)}
 });
 if(wheels.length!==4)return false; // Keep the working procedural fallback if source changes.
 const paintHex=vehiclePaint(root,k,col);
 const body=copy.getObjectByName('body');
 if(!body||!body.isMesh)return false;
 const paint=paintForBody(body,k,paintHex);
 if(!paint)return false;
 body.material=paint;
 // Preserve the original v9 trim and sunroof, including their geometries.
 const details=root.getObjectByName('vehicle-detail-package');
 root.children.slice().forEach(child=>{if(child!==details)root.remove(child)});
 root.add(copy);root.wheels=wheels;root.userData.paintHex=paintHex;
 root.userData.assetModel=true;root.userData.assetSource=ART[vehicleAssets[k]];
 return true;
}

makeCar=function(k,col){
 const root=fallbackCarFactory(k,col);
 root.userData.requestedColor=Number.isInteger(col)?col:CARS[k].col;
 if(vehicleTemplates[k])applyVehicleAsset(root,k,col);
 else if(pendingVehicle[k])pendingVehicle[k].push(root);
 return root;
};

// Retain traffic cars created before this optional visual layer starts loading.
traffic.forEach((o,i)=>pendingVehicle[['sedan','hatch','suv'][i]].push(o.m));
pendingVehicle.hatch.push(deliveryCargo);

function loadKenney(key,cb){
 const uri=ART[key];
 if(!uri){GLB_ASSETS.failed.push(key+': not packaged');return}
 assetLoader.load(uri,gltf=>{GLB_ASSETS.loaded[key]=true;try{cb(gltf.scene)}catch(e){GLB_ASSETS.failed.push(key+': '+e.message);console.warn('3D asset setup',key,e)}},undefined,err=>{
  GLB_ASSETS.failed.push(key+': '+String(err?.message||err));console.warn('Kenney asset fallback:',key,err);
 });
}
Object.keys(vehicleAssets).forEach(k=>loadKenney(vehicleAssets[k],model=>{
 const meshParts=[];
 model.traverse(o=>{if(o.isMesh)meshParts.push(o)});
 if(meshParts.length<5)throw Error('Vehicle geometry incomplete: '+k);
 vehicleTemplates[k]=model;
 for(const root of pendingVehicle[k])if(root.parent)applyVehicleAsset(root,k,root.userData.requestedColor);
 pendingVehicle[k].length=0;
 GLB_ASSETS.readyCars++;
}));

function fitKenney(model,width,height,depth){
 const root=new THREE.Group(),copy=model.clone(true);
 const b=new THREE.Box3().setFromObject(copy),size=b.getSize(new THREE.Vector3());
 const scale=Math.min(width/Math.max(.01,size.x),height/Math.max(.01,size.y),depth/Math.max(.01,size.z));
 copy.scale.setScalar(scale);
 copy.position.set(-(b.min.x+b.max.x)*scale/2,-b.min.y*scale,-(b.min.z+b.max.z)*scale/2);
 copy.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 root.add(copy);return root;
}

const furniture=new THREE.Group();furniture.name='asset-showroom-furniture';scene.add(furniture);
const furnitureSpec=[
 ['kenney-sofa',[[-11,.35,-8.15]],[3.4,1.5,1.7]],
 ['kenney-coffee',[[-11,.35,-6.5]],[1.7,.75,1.45]],
 ['kenney-pottedplant',[[-14,.36,-9.45],[14,.36,-9.45],[-14,.36,-2.5]],[.95,1.7,.95]],
 ['kenney-bush',[[-17,0,-12.5],[17,0,-12.5],[-17,0,1.6],[17,0,1.6]],[1.6,1.45,1.6]]
];
furnitureSpec.forEach(([key,positions,dims])=>loadKenney(key,template=>{
 const group=new THREE.Group();group.name=key;furniture.add(group);
 positions.forEach(p=>{const prop=fitKenney(template,...dims);prop.position.set(...p);group.add(prop)});
 if(key==='kenney-sofa')lounge.visible=false;
 if(key==='kenney-pottedplant')v9Planters.visible=false;
 GLB_ASSETS.readyProps++;
}));

loadKenney('kenney-delivery',model=>{
 const truck=fitKenney(model,5.3,2.45,2.6);
 truck.rotation.y=-Math.PI/2;
 // Kenney truck faces +Z, traffic travels toward -X.
 deliveryTruck.clear();deliveryTruck.add(truck);
 const cargo=makeCar('hatch',0xe3ad54);
 cargo.scale.setScalar(.48);cargo.position.set(.6,1.42,0);deliveryTruck.add(cargo);
 deliveryBeacon.position.set(-1.4,2.35,0);deliveryTruck.add(deliveryBeacon);
});
// V11 animated pedestrians. Optional CC0 assets; procedural NPCs are fallback.
// Keep the original person() object and hit targets so AI, staff badges and click targets survive.
const CHARACTERS_V11={ready:0,failed:[],templates:{},pending:[],count:0};
const characterFactory=person, originalAnimatePerson=anim;
const npcKeys={sales:'kenney-npc-sales',customer:'kenney-npc-customer',female:'kenney-npc-female',vip:'kenney-npc-vip'};
function npcRole(col,vip){
 if(vip)return 'vip';
 if(col===0x1976d2)return 'sales';
 if(col===0xff7043)return 'sales';
 return (++CHARACTERS_V11.count%3===0)?'female':'customer';
}
function characterSwitch(root,model){
 const u=root.userData;if(!model||u.characterImported)return false;
 if(!THREE.SkeletonUtils||typeof THREE.SkeletonUtils.clone!=='function')return false;
 const clone=THREE.SkeletonUtils.clone(model.scene);
 let hasSkin=false;clone.traverse(o=>{if(o.isSkinnedMesh){hasSkin=true;o.frustumCulled=false}if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 if(!hasSkin)return false;
 const box=new THREE.Box3().setFromObject(clone),sz=box.getSize(new THREE.Vector3());
 const factor=2.0/Math.max(.5,sz.y);clone.scale.setScalar(factor);
 clone.position.y=-box.min.y*factor;
 u.fallbackParts.forEach(node=>{if(node!==root.dot)node.visible=false});
 root.add(clone);u.characterImported=true;u.characterVisual=clone;u.characterMixer=new THREE.AnimationMixer(clone);
 u.characterClips=model.clips;u.characterMode='';u.characterLastT=undefined;
 u.characterSource=ART[npcKeys[u.characterRole]];
 changeCharacterAction(root,'idle');
 return true;
}
function changeCharacterAction(root,state){
 const u=root.userData,clip=u.characterClips?.[state];
 if(!clip||!u.characterMixer)return;
 if(u.characterMode===state)return;
 const next=u.characterMixer.clipAction(clip);
 if(u.characterAction&&u.characterAction!==next)u.characterAction.fadeOut(.17);
 next.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).fadeIn(.17).play();
 u.characterAction=next;u.characterMode=state;
}
person=function(col,vip){
 const root=characterFactory(col,vip);
 root.userData.fallbackParts=root.children.slice();
 root.userData.characterRole=npcRole(col,vip);
 const model=CHARACTERS_V11.templates[root.userData.characterRole];
 if(model)characterSwitch(root,model);else CHARACTERS_V11.pending.push(root);
 return root;
};
anim=function(root,actor,t){
 if(!root?.userData?.characterImported)return originalAnimatePerson(root,actor,t);
 const mode=actor.mv?'walk':actor.act?'interact-right':'idle';
 changeCharacterAction(root,mode);
 const last=root.userData.characterLastT;
 const dt=last===undefined?.016:Math.max(0,Math.min(.05,t-last));
 root.userData.characterLastT=t;
 root.userData.characterMixer.update(dt);
};
Object.keys(npcKeys).forEach(role=>{
 const key=npcKeys[role],uri=ART[key];
 if(!uri){CHARACTERS_V11.failed.push(key+' not packaged');return}
 assetLoader.load(uri,gltf=>{
  const clips={};gltf.animations.forEach(c=>{clips[c.name]=c});
  if(!clips.idle||!clips.walk||!clips['interact-right'])throw Error('Missing Kenney animation clips '+role);
  CHARACTERS_V11.templates[role]={scene:gltf.scene,clips};
  CHARACTERS_V11.ready++;
  CHARACTERS_V11.pending=CHARACTERS_V11.pending.filter(root=>{
   if(root.userData.characterRole!==role)return !!root.parent;
   try{characterSwitch(root,CHARACTERS_V11.templates[role])}catch(e){CHARACTERS_V11.failed.push(role+' '+e.message)}
   return false;
  });
 },undefined,e=>{CHARACTERS_V11.failed.push(role+': '+(e?.message||String(e)));console.warn('NPC uses fallback',role,e)});
});
// V11 showroom facelift: curved metallic architecture and locally generated brand sign.
// GPU-light spline trims and baked canvas signage, no dynamic lights or network textures.
const showroomV11=new THREE.Group();showroomV11.name='showroom-v11-facade';scene.add(showroomV11);
function v11CurvedFrame(points,hex,r=.08){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
 const m=new THREE.Mesh(new THREE.TubeGeometry(curve,30,r,7,false),M(hex,{metalness:.72,roughness:.28}));
 m.castShadow=true;showroomV11.add(m);return m;
}
// The long raised edge forms a sculpted canopy, not another rectangular roof slab.
v11CurvedFrame([[-15.5,4.45,3.2],[-11,4.8,3.6],[0,5.08,3.7],[11,4.8,3.6],[15.5,4.45,3.2]],0xe9c27a,.08);
v11CurvedFrame([[-15.5,4.45,3.2],[-15.3,4.8,-.8],[-15.3,4.7,-6.4],[-15,4.45,-11.2]],0xc7a774,.095);
v11CurvedFrame([[15.5,4.45,3.2],[15.3,4.8,-.8],[15.3,4.7,-6.4],[15,4.45,-11.2]],0xc7a774,.095);
// Slim sunshade fins signal a glass-fronted building without obscuring the playing area.
for(const x of [-13,-9,-5,5,9,13]){
 const fin=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,2.5,9),M(0x446271,{metalness:.55,roughness:.38}));
 fin.position.set(x,2.72,2.2);fin.castShadow=true;showroomV11.add(fin);
}
const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=256;
const ctx=signCanvas.getContext('2d');
ctx.fillStyle='#123346';ctx.fillRect(0,0,1024,256);
const fade=ctx.createLinearGradient(0,0,1024,0);fade.addColorStop(0,'#b88945');fade.addColorStop(.5,'#fce2a2');fade.addColorStop(1,'#b88945');
ctx.fillStyle=fade;ctx.fillRect(24,23,976,3);ctx.fillRect(24,230,976,3);
ctx.fillStyle='#f7d997';ctx.font='bold 108px system-ui, sans-serif';ctx.textAlign='center';ctx.fillText('AUTO EMPIRE',512,140);
ctx.font='600 34px system-ui, sans-serif';ctx.fillStyle='#d7e4e5';ctx.fillText('PREMIUM MOTORS',512,194);
const signTexture=new THREE.CanvasTexture(signCanvas);signTexture.encoding=THREE.sRGBEncoding;
const signFrame=new THREE.Mesh(new THREE.PlaneGeometry(11.3,2.75),new THREE.MeshBasicMaterial({color:0x123346,side:THREE.DoubleSide}));
signFrame.position.set(0,5.66,3.49);showroomV11.add(signFrame);
const signText=new THREE.Mesh(new THREE.PlaneGeometry(11.1,2.6),new THREE.MeshBasicMaterial({map:signTexture,transparent:false,side:THREE.DoubleSide}));
signText.position.set(0,5.66,3.53);showroomV11.add(signText);
const leftLogo=new THREE.Mesh(new THREE.TorusGeometry(.65,.14,9,32),M(0xe8ba69,{metalness:.75,roughness:.2}));
leftLogo.position.set(-13,5.62,3.49);showroomV11.add(leftLogo);
const rightLogo=leftLogo.clone();rightLogo.position.x=13;showroomV11.add(rightLogo);
// Visual-only sandbox for real iPhone testing. Never mutate S or localStorage.
const v11DemoRoot=new THREE.Group();v11DemoRoot.name='v11-preview-actors';scene.add(v11DemoRoot);
let v11DemoClock=0,v11DemoCrowd=[],v11DemoTier=null;
function v11SetPreviewTier(level){
 v11DemoTier=level;
 showroomLevelTwo.visible=level>=2;
 showroomLevelThree.visible=level>=3;
 const status=document.getElementById('preview-status');
 if(status)status.textContent='Xem showroom cấp '+level+' · Không lưu';
}
function v11PreviewCrowd(){
 v11DemoRoot.clear();v11DemoCrowd=[];
 const colors=[0x1976d2,0xffc107,0x43a047,0xff7043,0xffc107,0x9c27b0];
 const coords=[[-8,-8],[-6,-5],[4,-8],[8,-5],[-2,-2],[11,-8]];
 coords.forEach(([x,z],i)=>{
  const p=person(colors[i],i===1||i===4);
  p.position.set(x,0,z);p.rotation.y=(i%3)*Math.PI*.6;
  v11DemoRoot.add(p);
  v11DemoCrowd.push({m:p,i,origin:x,depth:z});
 });
 const status=document.getElementById('preview-status');
 if(status)status.textContent=v11DemoCrowd.length+' khách và nhân viên demo · Không lưu';
}
function v11ClearPreview(){
 v11DemoCrowd.forEach(a=>{const mixer=a.m.userData.characterMixer;if(mixer){mixer.stopAllAction();mixer.uncacheRoot(a.m.userData.characterVisual)}});
 v11DemoRoot.clear();v11DemoCrowd=[];
 v11DemoTier=null;applyVis();
 const status=document.getElementById('preview-status');
 if(status)status.textContent='Đã về cảnh thật · Tiến trình an toàn';
}
function updateV11Preview(dt){
 if(!v11DemoCrowd.length)return;
 v11DemoClock+=dt;
 v11DemoCrowd.forEach(a=>{
  const phase=v11DemoClock*.55+a.i*1.32,moving=Math.sin(phase)>-.25;
  a.m.position.x=a.origin+(moving?Math.sin(phase)*.65:0);
  a.m.position.z=a.depth+(moving?Math.cos(phase)*.33:0);
  a.m.rotation.y=Math.sin(phase)*.85;
  anim(a.m,{mv:moving,act:!moving,ph:a.i},v11DemoClock);
 });
}
if(new URLSearchParams(location.search).has('preview')){
 const box=document.createElement('section');box.id='v11-preview-panel';
 box.setAttribute('aria-label','Chế độ thử đồ họa');
 box.style.cssText='position:fixed;right:8px;top:calc(env(safe-area-inset-top,0px) + 200px);z-index:85;width:150px;background:rgba(15,38,57,.93);border:1px solid #d5ae69;color:#fff;border-radius:14px;padding:9px;box-shadow:0 6px 20px #0005;font:600 12px system-ui,sans-serif';
 box.innerHTML='<button id="preview-toggle" type="button" style="width:100%;border:0;background:transparent;color:#fbd58c;text-align:left;font-size:12px">🧪 TEST CẢNH V11 ▾</button><div id="preview-controls" style="display:none"><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:7px">'+
  '<button id="preview-tier-1" type="button">Cấp 1</button><button id="preview-tier-2" type="button">Cấp 2</button><button id="preview-tier-3" type="button">Cấp 3</button>'+
  '<button id="preview-crowd" type="button">Đông khách</button><button id="preview-clear" type="button">Cảnh thật</button></div>'+
  '<div id="preview-status" style="font-size:10px;line-height:1.4;color:#d0e7e6;margin-top:7px">Chỉ xem, không lưu vào game</div></div>';
 document.body.append(box);
 box.querySelectorAll('#preview-controls button').forEach(b=>b.style.cssText='color:#fff;border:1px solid #658390;background:#2b4d60;padding:6px;border-radius:7px;font-size:11px;font-weight:600;touch-action:manipulation');
 const toggle=document.getElementById('preview-toggle'),controls=document.getElementById('preview-controls');
 toggle.onclick=()=>{controls.style.display=controls.style.display==='none'?'block':'none';toggle.textContent='🧪 TEST CẢNH V11 '+(controls.style.display==='none'?'▾':'▴')};
 for(let level=1;level<=3;level++)document.getElementById('preview-tier-'+level).onclick=()=>v11SetPreviewTier(level);
 document.getElementById('preview-crowd').onclick=v11PreviewCrowd;
 document.getElementById('preview-clear').onclick=()=>{v11ClearPreview();controls.style.display='none';toggle.textContent='🧪 TEST CẢNH V11 ▾'};
}
// V12 Living City: decorative, self-contained urban district.
// No save fields, userData.key, hit targets, game economy or AI paths are changed.
// All glTF files are local Kenney CC0 models; built-in geometry is the no-network fallback.
const cityV12={
 root:new THREE.Group(),roads:new THREE.Group(),trees:new THREE.Group(),lights:new THREE.Group(),
 buildings:[],traffic:[],ready:0,expected:9,failed:[],
 keys:['city-commercial-a','city-commercial-c','city-commercial-g','city-commercial-h',
       'city-suburban-h','city-tree-oak','city-tree-detailed','city-streetlight','city-traffic-light']
};
cityV12.root.name='living-city-v12';
cityV12.root.add(cityV12.roads,cityV12.trees,cityV12.lights);
cityV12.roads.name='city-v12-roads';cityV12.trees.name='city-v12-trees';cityV12.lights.name='city-v12-lights';
scene.add(cityV12.root);

// A secondary street is behind the dealership. The original traffic road, garage,
// showroom floor, parking positions and customer walking paths remain untouched.
cityV12.roads.add(
 box(142,.075,7.4,0x46525c,0,.035,-22.5),
 box(8.2,.075,42,0x46525c,47,.04,-40),
 box(142,.24,1.22,0xc1c1b5,0,.13,-27.1),
 box(142,.24,1.24,0xc1c1b5,0,.13,-17.88),
 box(1.23,.24,42,0xc1c1b5,42.4,.13,-40),
 box(1.23,.24,42,0xc1c1b5,51.6,.13,-40),
 box(18,.10,15,0x668d70,-43,.055,-3.2),
 box(15.7,.065,2.1,0xd4ccad,-43,.09,-3.3),
 box(2.15,.065,13.8,0xd4ccad,-43,.1,-3.3),
 // Across from the original traffic street, a landscaped forecourt fills
 // the empty foreground without touching parking or customer routes.
 box(35,.10,14.5,0x779f7d,0,.06,27),
 box(36,.07,2.4,0xd7cdb7,0,.11,18.9),
 box(2.4,.07,14,0xd7cdb7,-1,.115,27)
);
const avenueStripe=new THREE.InstancedMesh(
 new THREE.BoxGeometry(1.6,.025,.09),M(0xf5d68a,{roughness:.88}),40
);
const stripeObj=new THREE.Object3D();
for(let i=0;i<40;i++){stripeObj.position.set(-69+i*3.5,.101,-22.5);stripeObj.updateMatrix();avenueStripe.setMatrixAt(i,stripeObj.matrix)}
avenueStripe.instanceMatrix.needsUpdate=true;cityV12.roads.add(avenueStripe);
const crossings=new THREE.InstancedMesh(
 new THREE.BoxGeometry(.42,.025,.88),M(0xe5e9e8,{roughness:1}),28
);
for(let i=0;i<28;i++){
 const side=i<14?0:1,slot=i%14,xx=side?-30.5:34.5;
 stripeObj.position.set(xx+(slot%7-3)*.59,.104,-24.5+Math.floor(slot/7)*4.2);
 stripeObj.updateMatrix();crossings.setMatrixAt(i,stripeObj.matrix);
}
crossings.instanceMatrix.needsUpdate=true;cityV12.roads.add(crossings);
// Slender park paths, planters and an art piece: lightweight silhouette accents.
const v12Park=new THREE.Group();v12Park.name='city-v12-park';cityV12.root.add(v12Park);
for(const x of [-48,-38]){
 const pot=new THREE.Mesh(new THREE.CylinderGeometry(.86,.97,.65,12),M(0xc5b59b,{roughness:.9}));
 pot.position.set(x,.42,-9);pot.receiveShadow=true;v12Park.add(pot);
 const canopy=new THREE.Mesh(new THREE.IcosahedronGeometry(1.08,1),M(0x4e9870,{roughness:1}));
 canopy.position.set(x,1.55,-9);canopy.scale.set(1,.72,1);v12Park.add(canopy);
}
const sculpture=new THREE.Mesh(new THREE.TorusGeometry(1.18,.18,7,20),M(0xcda96d,{metalness:.55,roughness:.3}));
sculpture.position.set(-43,1.75,-3.2);sculpture.rotation.y=.35;v12Park.add(sculpture);
v12Park.add(box(1.8,.45,1.8,0x354953,-43,.28,-3.2));
// Circular public fountain across the road. Reused standard materials and no lights.
const fountainBasin=new THREE.Mesh(new THREE.CylinderGeometry(2.15,2.35,.31,24),M(0xc7c6bd,{roughness:.8}));
fountainBasin.position.set(7,.24,28.5);fountainBasin.receiveShadow=true;v12Park.add(fountainBasin);
const fountainPool=new THREE.Mesh(new THREE.CylinderGeometry(1.82,1.82,.035,24),M(0x5aabb8,{metalness:.18,roughness:.28}));
fountainPool.position.set(7,.425,28.5);v12Park.add(fountainPool);
const fountainCenter=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,1),M(0xe7c889,{metalness:.52,roughness:.34}));
fountainCenter.position.set(7,.98,28.5);v12Park.add(fountainCenter);
for(const z of [23.5,30.5]){
 v12Park.add(box(2.3,.18,.68,0x947454,-10,.65,z));
 v12Park.add(box(.16,.55,.16,0x364c50,-10.8,.34,z),box(.16,.55,.16,0x364c50,-9.2,.34,z));
}

// Each building is rendered from a Kenney GLB, not a box. Metadata stays separate
// from the actual scene node for simple visual verification and a reliable fallback.
const cityPlots=[
 ['city-commercial-a',-35,-35,10.5,11,10.5],
 ['city-commercial-c',-19.5,-36,10.5,9.6,11],
 ['city-commercial-g',-3,-37,11,15.2,11],
 ['city-commercial-h',14.5,-36,11.8,12.5,11.5],
 ['city-suburban-h',33,-35,12,8.8,12],
 ['city-commercial-c',57,-35,10.5,9.5,11]
];
const cityAssetPlaces={};
function cityPlot(key,x,z,w,h,d){
 const group=new THREE.Group();group.position.set(x,0,z);group.name='plot-'+key;
 const info={key,x,z,w,h,d,group};
 cityV12.buildings.push(info);cityV12.root.add(group);
 (cityAssetPlaces[key]||(cityAssetPlaces[key]=[])).push(info);
}
cityPlots.forEach(o=>cityPlot(...o));

const cityTreeData=[
 [-49,-13,3.7],[-39,-13,4.2],[-46,5,4.5],[-39,5.8,3.9],
 [-26,-28,3.7],[-11,-28.5,3.2],[5,-29,4],[26,-29,3.6],[43,-29.4,4.7],
 [36,4.4,3.3],[54,6,3.8],[-55,-28,4.5],
 [-15,26,3.8],[-5,31.5,3.5],[17,27,4.1],[19,32,3.6]
];
const cityTreeSpecs={
 'city-tree-oak':cityTreeData.filter((_,i)=>i%2===0),
 'city-tree-detailed':cityTreeData.filter((_,i)=>i%2===1)
};
const cityLampPlaces=[[-39,-18.7,0],[-19,-18.7,0],[0,-18.7,0],
 [20,-18.7,0],[40,-18.7,0],[48,-9,Math.PI/2],[48,15,Math.PI/2]];
const citySignalPlaces=[[40,-18.5,0],[52,-25.5,Math.PI]];
function cityImport(key,put){
 const url=ART[key];
 if(!url){cityV12.failed.push(key+': asset missing');cityV12.ready++;return}
 assetLoader.load(url,gltf=>{
  try{put(gltf.scene)}catch(e){cityV12.failed.push(key+': '+e.message);console.warn('City GLB render fallback:',key,e)}
  cityV12.ready++;
 },undefined,err=>{
  cityV12.failed.push(key+': '+(err?.message||String(err)));
  cityV12.ready++;
  console.warn('City GLB unavailable; procedural street stays playable:',key,err);
 });
}
function cityFit(template,w,h,d){
 const root=fitKenney(template,w,h,d);
 root.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true}});
 return root;
}
['city-commercial-a','city-commercial-c','city-commercial-g','city-commercial-h','city-suburban-h']
 .forEach(key=>cityImport(key,template=>{
  for(const plot of cityAssetPlaces[key]||[])plot.group.add(cityFit(template,plot.w,plot.h,plot.d));
 }));
['city-tree-oak','city-tree-detailed'].forEach(key=>cityImport(key,template=>{
 (cityTreeSpecs[key]||[]).forEach(([x,z,height],i)=>{
  const tree=cityFit(template,height*.82,height,height*.82);
  tree.position.set(x,0,z);tree.rotation.y=(i*2.41)%6.28;
  cityV12.trees.add(tree);
 });
}));
cityImport('city-streetlight',template=>{
 cityLampPlaces.forEach(([x,z,turn])=>{
  const lamp=cityFit(template,1.15,5,2.8);lamp.position.set(x,0,z);
  lamp.rotation.y=turn;cityV12.lights.add(lamp);
 });
});
cityImport('city-traffic-light',template=>{
 citySignalPlaces.forEach(([x,z,turn])=>{
  const light=cityFit(template,1.45,4.6,1.45);light.position.set(x,0,z);
  light.rotation.y=turn;cityV12.lights.add(light);
 });
});

// Background road activity intentionally does not use the game traffic[] array:
// no parking slots, inventory, orders, money, customers or staff state is touched.
[['sedan',0x82c5cd,-46,-23.6,5.4,1],
 ['hatch',0xe8a56e,40,-21.15,-4.6,-1]].forEach(([kind,col,x,z,speed,facing])=>{
 const car=makeCar(kind,col);car.position.set(x,0,z);car.rotation.y=facing>0?0:Math.PI;
 cityV12.root.add(car);cityV12.traffic.push({m:car,sp:speed});
});
function updateV12City(dt){
 const step=Math.max(0,Math.min(.05,dt));
 cityV12.traffic.forEach(o=>{
  o.m.position.x+=o.sp*step;
  if(o.m.position.x>64)o.m.position.x=-64;
  if(o.m.position.x< -64)o.m.position.x=64;
 });
}
// V13 Grand Dealership: architecture evolves visually with showroom levels.
// Separate non-interactive decorative scene, no save fields or customer paths.
const grandV13={root:new THREE.Group(),tiers:[],active:0,animated:[],clock:0};
grandV13.root.name='grand-dealership-v13';scene.add(grandV13.root);
function grandMat(color,metalness=.35,roughness=.42){
 return new THREE.MeshStandardMaterial({color,metalness,roughness});
}
const grandGold=grandMat(0xe7c47c,.75,.25),
 grandSlate=grandMat(0x284454,.55,.38),
 grandStone=grandMat(0xcad4d0,.12,.76),
 grandGlass=new THREE.MeshStandardMaterial({color:0x89c6d4,metalness:.18,roughness:.12,transparent:true,opacity:.48,depthWrite:false}),
 grandGlow=new THREE.MeshBasicMaterial({color:0xffe4aa}),
 grandGreen=grandMat(0x4c9872,.04,.95);
function grandMesh(parent,geometry,material,x,y,z){
 const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=true;parent.add(m);return m;
}
function grandBlock(parent,w,h,d,mat,x,y,z){return grandMesh(parent,new THREE.BoxGeometry(w,h,d),mat,x,y,z)}
function grandPlant(parent,x,z,height=1){
 grandBlock(parent,.85,.52,.85,grandSlate,x,.3,z);
 const trunk=grandMesh(parent,new THREE.CylinderGeometry(.12,.16,height*.6,7),grandStone,x,.63+height*.28,z);
 const leaves=grandMesh(parent,new THREE.IcosahedronGeometry(.65,1),grandGreen,x,1+height*.65,z);
 leaves.scale.set(1,.85,1);
 return {trunk,leaves};
}
function grandTier(level){
 const g=new THREE.Group();g.name='grand-v13-level-'+level;
 grandV13.root.add(g);grandV13.tiers[level]=g;return g;
}
// Level 1: a modest but recognizable dealership entrance and landscaping.
{
 const g=grandTier(1);
 grandBlock(g,10,.13,1.2,grandSlate,0,.22,3.72);
 for(const x of [-13.8,13.8]){
  grandBlock(g,1.55,.32,1.15,grandStone,x,.18,3.25);
  grandPlant(g,x,3.3,1.05);
 }
 for(const x of [-10.8,10.8]){
  grandBlock(g,.18,2.65,.16,grandSlate,x,1.48,2.85);
  grandBlock(g,.32,.22,.34,grandGlow,x,2.75,2.85);
 }
}
// Level 2: full-width architectural entrance, raised gallery canopy,
// glazed side entrance, gold-lit walkway and planters.
{
 const g=grandTier(2);
 grandBlock(g,32,.23,2.05,grandSlate,0,4.72,3.5);
 grandBlock(g,31.4,.095,.15,grandGold,0,4.59,4.48);
 for(const x of [-14.9,-7.5,7.5,14.9]){
  grandBlock(g,.26,4.1,.26,grandGold,x,2.15,3.23);
 }
 for(const x of [-11,-3.7,3.7,11]){
  grandBlock(g,6.65,2.7,.075,grandGlass,x,2.23,3.13);
 }
 for(const x of [-12.8,12.8])grandPlant(g,x,4.9,1.35);
 for(const x of [-9,-6,-3,0,3,6,9]){
  grandBlock(g,.12,.03,1.7,grandGold,x,.115,4.75);
 }
 const gallery=new THREE.Group();gallery.name='grand-v13-gallery-architecture';g.add(gallery);
 grandBlock(gallery,11.4,.25,1.5,grandSlate,21,4.9,2.65);
 grandBlock(gallery,11.2,.09,.13,grandGold,21,4.75,3.4);
 for(const x of [15.6,26.4]){
  grandBlock(gallery,.22,4.25,.22,grandGold,x,2.38,2.55);
  grandPlant(gallery,x,3.85,.92);
 }
}
// Level 3: a signature flagship roof, illuminated vertical fins,
// curved metallic crown and rooftop gardens. No additional floors/slots.
{
 const g=grandTier(3);
 grandBlock(g,33,.26,2.1,grandSlate,0,6.65,3.2);
 grandBlock(g,32.5,.12,.18,grandGold,0,6.58,4.18);
 for(const x of [-15,-10,-5,0,5,10,15]){
  const fin=grandBlock(g,.16,1.22,.16,grandGold,x,7.34,3.1);
  fin.rotation.z=x*.0015;
 }
 for(const x of [-13.6,13.6]){
  grandBlock(g,2.8,.25,2.4,grandStone,x,6.96,-5.7);
  for(const dx of [-.9,0,.9]){
   const bush=grandMesh(g,new THREE.IcosahedronGeometry(.55,1),grandGreen,x+dx,7.46,-5.7);
   bush.scale.y=.72;
  }
 }
 const emblem=grandMesh(g,new THREE.TorusGeometry(.78,.11,8,36),grandGold,0,7.68,3.37);
 grandV13.animated.push(emblem);
 const arch=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
  new THREE.Vector3(-15.6,6.65,3.8),new THREE.Vector3(-8,7.12,4.15),
  new THREE.Vector3(0,7.35,4.24),new THREE.Vector3(8,7.12,4.15),
  new THREE.Vector3(15.6,6.65,3.8)
 ]),32,.065,6,false),grandGold);
 arch.receiveShadow=false;g.add(arch);
 const gallery=new THREE.Group();gallery.name='grand-v13-gallery-flagship';g.add(gallery);
 grandBlock(gallery,11.8,.2,1.8,grandSlate,21,6.35,2.6);
 grandBlock(gallery,11.5,.09,.14,grandGold,21,6.2,3.5);
 for(const x of [16,26])grandBlock(gallery,.18,1.5,.18,grandGold,x,5.52,2.6);
}
function updateGrandDealershipV13(dt){
 grandV13.clock+=Math.max(0,Math.min(.05,dt));
 const level=Math.max(1,Math.min(3,S.show|0));
 if(grandV13.active!==level){
  grandV13.active=level;
  grandV13.tiers.forEach((g,i)=>{if(g)g.visible=i<=level});
 }
 if(grandV13.animated[0]){
  const logo=grandV13.animated[0];
  logo.rotation.y=Math.sin(grandV13.clock*.3)*.12;
 }
}
updateGrandDealershipV13(0);
// V14 Grand Showroom Rebuild. Larger visual footprint, unchanged playable slots.
// All geometry stays outside raycast hit targets, AI routes and save state.
const grandV14={root:new THREE.Group(),tiers:[],active:0,clock:0,glow:[],bounds:{minX:-21,maxX:32,minZ:-14,maxZ:7,maxY:10}};
grandV14.root.name='grand-showroom-v14';scene.add(grandV14.root);
const gmat=(color,metalness=.2,roughness=.42)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const G={
 dark:gmat(0x172a37,.52,.3),navy:gmat(0x264756,.38,.37),
 champagne:gmat(0xd9b77a,.72,.27),ivory:gmat(0xe9e6db,.16,.6),
 stone:gmat(0xb6c5c7,.1,.67),pavement:gmat(0xa7b1ac,.08,.82),
 foliage:gmat(0x397b64,.04,.93),glass:new THREE.MeshPhysicalMaterial({
 color:0x9ad4e2,metalness:.05,roughness:.12,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide
 }),light:new THREE.MeshBasicMaterial({color:0xffe2a6}),water:gmat(0x60b6c5,.25,.22)
};
function gm(group,geo,mat,x,y,z){
 const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.receiveShadow=true;
 group.add(m);return m;
}
function gb(group,w,h,d,mat,x,y,z){return gm(group,new THREE.BoxGeometry(w,h,d),mat,x,y,z)}
function gp(group,x,z,height=1.4){
 gb(group,1.1,.52,1.1,G.dark,x,.32,z);
 gm(group,new THREE.CylinderGeometry(.11,.15,height*.55,7),G.champagne,x,.64+height*.26,z);
 const crown=gm(group,new THREE.IcosahedronGeometry(.75,1),G.foliage,x,.9+height*.7,z);
 crown.scale.y=.87;
}
function tier(n){const g=new THREE.Group();g.name='grand-v14-tier-'+n;grandV14.tiers[n]=g;grandV14.root.add(g);return g}
function grandV14Sign(group,title,subtitle,width,x,y,z){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;
 const c=canvas.getContext('2d');c.fillStyle='#122b3b';c.fillRect(0,0,1024,256);
 c.fillStyle='#d6b87d';c.fillRect(32,24,960,4);c.fillRect(32,224,960,4);
 c.textAlign='center';c.fillStyle='#ffe4ad';c.font='bold 94px system-ui,sans-serif';
 c.fillText(title,512,130,960);
 c.fillStyle='#d6e9e9';c.font='500 34px system-ui,sans-serif';
 c.fillText(subtitle,512,191,940);
 const tex=new THREE.CanvasTexture(canvas);tex.encoding=THREE.sRGBEncoding;
 const panel=gm(group,new THREE.PlaneGeometry(width,width/4),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}),x,y,z);
 panel.name='grand-v14-brand-sign';return panel;
}
// Permanent expansion: true extra floor footprint, raised outer walls and
// entrance plaza. Existing game floor and podiums remain at their exact coordinates.
{
 const g=tier(1);
 // Two side galleries and rear apron make the dealership substantially wider.
 gb(g,6.4,.32,17.5,G.ivory,-18.2,.17,-4.7);
 gb(g,5.2,.32,17.5,G.ivory,17.4,.17,-4.7);
 gb(g,6.2,.32,17.5,G.ivory,30,.17,-4.7); // visual gallery extension, no new slots
 gb(g,54,.18,3.6,G.pavement,5.6,.07,5.1);
 gb(g,52,.16,1.3,G.dark,5.6,.12,7.05);
 gb(g,54,.25,.8,G.ivory,5.6,.15,-13.6);
 for(const x of [-21.4,32.4]){
  gb(g,.65,5.3,.7,G.navy,x,2.8,-4.7);
  gb(g,.55,5.25,.55,G.champagne,x,2.8,3.3);
 }
 for(const x of [-19.6,-16.3,18.6,21.9,28.4,31]){
  gb(g,.15,3.4,.15,G.navy,x,2.05,3.22);
 }
 for(const x of [-19.1,19.8,30]){
  gb(g,2.8,3.5,.09,G.glass,x,2.02,3.18);
 }
 // Bigger facade silhouette with premium metal and bright trim, open to the cars.
 gb(g,54,.55,2.4,G.dark,5.6,4.72,3.7);
 gb(g,53.7,.095,.13,G.champagne,5.6,4.39,4.92);
 gb(g,53.7,.08,.13,G.champagne,5.6,5.07,4.87);
 for(const x of [-19,-13,13,19,27,31])gp(g,x,6.3,1.2);
 for(const x of [-12,-8,-4,0,4,8,12,18,24,29]){
  gb(g,.13,.035,2.0,G.champagne,x,.17,5.05);
 }
 // Keep center of entrance readable, with a branded sign high above the cars.
 grandV14Sign(g,'AUTO EMPIRE','PREMIUM MOTOR GALLERY',13,0,6.35,4.4);
}
// Level 2: dedicated wing with visible roof, vertical louvers and
// floor-to-ceiling glazing, without changing original interactive wing.
{
 const g=tier(2);
 gb(g,17,.28,19,G.ivory,24.4,.22,-4.7);
 gb(g,17.7,.38,2.8,G.navy,24.4,5.3,3.85);
 gb(g,17.5,.09,.13,G.champagne,24.4,5.07,5.18);
 for(const x of [16.4,19.2,22,24.8,27.6,30.4,32.2]){
  gb(g,.14,4.3,.18,G.champagne,x,2.65,3.56);
 }
 for(const x of [17.8,23.5,29.2]){
  gb(g,5.3,3.5,.09,G.glass,x,2.53,3.5);
 }
 for(const x of [16.3,32.3]){
  gp(g,x,6.15,1.6);
  gb(g,.38,5.2,.38,G.navy,x,2.8,-13.2);
 }
 // External showroom terraces, architectural only.
 gb(g,13,.16,2.5,G.pavement,24.4,.13,7.3);
 grandV14Sign(g,'PREMIUM','LUXURY VEHICLE COLLECTION',10.2,24.4,6.45,4.78);
}
// Level 3: flagship crown, skylight spine, rooftop green corners.
// A perimeter canopy avoids an opaque roof over the camera-facing showroom.
{
 const g=tier(3);
 gb(g,55,.32,2.2,G.dark,5.6,8.12,3.5);
 gb(g,54.7,.12,.16,G.champagne,5.6,8.02,4.66);
 gb(g,54.7,.09,.15,G.champagne,5.6,8.36,4.57);
 for(const x of [-21.1,-15.4,-9.7,-4,1.7,7.4,13.1,18.8,24.5,30.2]){
  gb(g,.16,2.45,.17,G.champagne,x,6.7,3.5);
 }
 for(const x of [-20.1,31.1]){
  gb(g,3.6,.25,3.2,G.ivory,x,8.53,-10.2);
  for(const dx of [-1,0,1]){
   const bush=gm(g,new THREE.IcosahedronGeometry(.64,1),G.foliage,x+dx,9.15,-10.2);
   bush.scale.y=.72;
  }
 }
 const curve=new THREE.CatmullRomCurve3([
  new THREE.Vector3(-21.2,8.2,4.65),new THREE.Vector3(-11,9.0,5.1),
  new THREE.Vector3(5.6,9.45,5.25),new THREE.Vector3(22,9.0,5.1),
  new THREE.Vector3(32.4,8.2,4.65)
 ]);
 const arc=gm(g,new THREE.TubeGeometry(curve,48,.095,7,false),G.champagne,0,0,0);
 arc.name='grand-v14-flagship-arch';
 const emblem=gm(g,new THREE.TorusGeometry(.83,.12,9,32),G.champagne,5.6,9.65,4.65);
 emblem.name='grand-v14-emblem';grandV14.glow.push(emblem);
}
function updateGrandShowroomV14(dt){
 grandV14.clock+=Math.max(0,Math.min(.05,dt));
 const level=Math.max(1,Math.min(3,S.show|0));
 if(grandV14.active!==level){
  grandV14.active=level;
  grandV14.tiers.forEach((g,i)=>{if(g)g.visible=i<=level});
 }
 if(grandV14.glow[0])grandV14.glow[0].rotation.y=Math.sin(grandV14.clock*.25)*.09;
}
updateGrandShowroomV14(0);
// ---------- kinh tế
const MAXL={show:3,park:3,spd:6,hire:3,td:3,gar:3},LVL=()=>({show:S.show,park:S.park,spd:S.spd,hire:S.staff,td:S.td,gar:S.gar});
const COST={show:()=>[10000,30000][S.show-1],park:()=>[4500,15000][S.park-1],spd:()=>Math.round(2500*Math.pow(1.8,S.spd-1)),hire:()=>[6000,16000][S.staff-1],td:()=>[8000,20000,40000][S.td],gar:()=>[12000,25000,50000][S.gar]};
const NSL=()=>[2,4,6][S.show-1],NPK=()=>[2,4,6][S.park-1],CAP=()=>[12,20,28][S.show-1],STK=()=>KS.reduce((a,k)=>a+S.inv[k],0);
function addRep(n){S.rep=Math.max(0,Math.min(100,S.rep+n))}
function addXP(x){S.xp+=x;while(S.xp>=need(S.lvl)){S.xp-=need(S.lvl);S.lvl++;S.gems+=3;toast('Lên cấp '+S.lvl+'! +3 KC');beep(700,.2)}}
function up(k){if(!COST[k])return;if(LVL()[k]>=MAXL[k])return;const c=COST[k]();if(S.money<c){toast('Không đủ tiền');return}
 S.money-=c;if(k=='show')S.show++;if(k=='park')S.park++;if(k=='spd')S.spd++;if(k=='hire'){S.staff++;addStaff(S.staff-1)}if(k=='td')S.td++;if(k=='gar')S.gar++;
 applyVis();fillSlots();beep(660,.15);setTimeout(()=>beep(990,.2),120);toast('Nâng cấp thành công!');save();refreshP(1)}
function buyStock(k,n){if(!CARS[k]||!Number.isInteger(n)||n<1||n>5)return;const c=CARS[k];if(c.lv>S.show)return;if(STK()+n>CAP()){toast('Kho đầy ('+CAP()+' xe)');return}if(S.money<stockCost(k)*n){toast('Không đủ tiền');return}const paid=stockCost(k);S.basis[k]=(S.basis[k]*S.inv[k]+paid*n)/(S.inv[k]+n);S.money-=paid*n;S.inv[k]+=n;S.bought+=n;playDelivery();beep(520,.1);updateOrders(0);fillSlots();save();refreshP(1)}
function applyVis(){u2.visible=S.show>=2;u3.visible=S.show>=3;sign.material.color.set(S.show>=3?0xffd54f:S.show>=2?0x64b5f6:0xffffff);sign.material.emissive.set(S.show>=3?0x7a5a00:S.show>=2?0x103a66:0x555555);
 pmark.forEach((m,i)=>{m[0].visible=m[1].visible=i<NPK()});lamps.visible=S.park>=2;tdG.visible=S.td>0;garG.visible=S.gar>0;ped.forEach((p,i)=>p.visible=i<NSL())}
const sales=[];let t0=performance.now();
function updRpm(){const n=performance.now(),w=Math.min(300000,n-t0);if(w<60000)return;while(sales.length&&n-sales[0][0]>300000)sales.shift();const s=sales.reduce((a,b)=>a+b[1],0);S.rpm=S.rpm*.8+s/(w/60000)*.2}
function claimOffline(){const away=Math.max(0,(Date.now()-S.t)/1000);S.t=Date.now();S.training=Math.max(0,S.training-away);if(S.training===0&&S.trainingPending){S.train=Math.min(12,S.train+1);S.trainingPending=false}if(!(away>60)||!(S.sold>0))return;const sec=Math.min(away,7200),g=Math.floor(Math.max(0,Math.min(S.rpm,150000))*sec/60*.5);S.t=Date.now();
 if(g>0){S.money+=g;S.profit+=g;recordIncome('offline',g);popup('Chào mừng trở lại!','Vắng mặt '+Math.floor(sec/60)+' phút (tối đa 120).<br>Thu nhập offline (50% hiệu suất): <b>'+fm(g)+'</b>')}save(true)}
// ---------- nhiệm vụ
const MIS=[{t:'Bán 5 xe',k:'sold',n:5,r:1000},{t:'Nhập thêm 3 xe vào kho',k:'bought',n:3,r:800},{t:'Nâng Showroom lên cấp 2',k:'show',n:2,r:3000},{t:'Phục vụ 1 khách VIP',k:'vip',n:1,r:2500},{t:'Chạy quảng cáo 1 lần',k:'mktN',n:1,r:1500},{t:'Tuyển nhân viên thứ 2',k:'staff',n:2,r:3000},{t:'Đạt danh tiếng 50',k:'rep',n:50,r:5000},{t:'Bán 50 xe',k:'sold',n:50,r:10000},{t:'Xây khu lái thử',k:'td',n:1,r:4000},{t:'Xây khu sửa chữa',k:'gar',n:1,r:5000}];
const MV=()=>({sold:S.sold,bought:S.bought,show:S.show,vip:S.vip,mktN:S.mktN,staff:S.staff,rep:S.rep,td:S.td,gar:S.gar});
function chkMis(){while(S.mi<MIS.length&&MV()[MIS[S.mi].k]>=MIS[S.mi].n){const m=MIS[S.mi++];S.money+=m.r;S.gems+=2;popup('Hoàn thành nhiệm vụ!',m.t+'<br>Thưởng: <b>'+fm(m.r)+'</b> + 2 KC');beep(523,.1);setTimeout(()=>beep(784,.1),100);setTimeout(()=>beep(1046,.25),200)}}
// ---------- xe trưng bày
const slots=SP.map((p,i)=>{const r2=i>=4,sg=Math.sign(p[0]);return{x:p[0],z:p[1],car:null,t:0,res:null,mesh:null,sc:1,cons:false,ax:r2?sg*.5:p[0],az:r2?-8.5:-2.2,sx:r2?-sg*.5:p[0]+1.2,r2}});
function mount(d,k,cons){d.basis=d.nextBasis||CARS[k].cost;d.nextBasis=0;d.car=k;d.cons=cons;d.mesh=makeCar(k);d.mesh.position.set(d.x,.45,d.z);d.sc=.05;d.mesh.scale.setScalar(.05);scene.add(d.mesh)}
function restock(d){let k=null,cons=false;const un=KS.filter(x=>CARS[x].lv<=S.show),st=un.filter(x=>S.inv[x]>0);
 if(st.length){k=st[(S.sold+slots.filter(x=>x.car).length)%st.length];d.nextBasis=S.basis[k];S.inv[k]--}
 else if(S.auto){const aff=un.filter(x=>stockCost(x)<=S.money*.6 && S.money-stockCost(x)>=500);if(aff.length){k=aff[(S.sold+slots.filter(x=>x.car).length)%aff.length];d.nextBasis=stockCost(k);S.money-=d.nextBasis;S.bought++}}
 if(!k&&STK()==0&&!slots.some(x=>x.car)){if(S.auto&&S.money>=stockCost('hatch')){k='hatch';d.nextBasis=stockCost(k);S.money-=d.nextBasis;S.bought++}}
 if(!k&&S.auto&&S.money<3000&&STK()===0&&!slots.some(x=>x.car)&&Date.now()-S.rescueAt>60000){k='hatch';cons=true;S.rescueAt=Date.now();toast('Đối tác gửi 1 xe ký gửi: bạn nhận phần lãi khi bán')}if(!k)return false;mount(d,k,cons);return true}
function fillSlots(){slots.forEach((d,i)=>{if(i<NSL()&&!d.car)restock(d)})}
// ---------- chuyển động / AI
const ang=(a,b,t)=>{let d=b-a;d=Math.atan2(Math.sin(d),Math.cos(d));return a+d*Math.min(1,t)};
function follow(o,sp,dt,car){if(!o.path.length){o.mv=false;return true}const m=o.m,p=o.path[0],dx=p[0]-m.position.x,dz=p[1]-m.position.z,d=Math.hypot(dx,dz),st=sp*dt;
 if(d<=st){m.position.x=p[0];m.position.z=p[1];o.path.shift();o.mv=o.path.length>0;return !o.path.length}
 m.position.x+=dx/d*st;m.position.z+=dz/d*st;m.rotation.y=ang(m.rotation.y,car?Math.atan2(-dz,dx):Math.atan2(dx,dz),dt*8);if(car&&m.wheels)m.wheels.forEach(w=>w.userData.kenneyWheel?(w.rotation.x+=st/.38):(w.rotation.z-=st/.38));o.mv=true;return false}
const face=(m,x,z)=>{m.rotation.y=Math.atan2(x-m.position.x,z-m.position.z)};
const custs=[],pk=[0,0,0,0,0,0],staff=[];let ctrC=null,spawnT=1.5,warnT=0;
function spawn(){const free=[...Array(NPK()).keys()].filter(i=>!pk[i]);if(!free.length)return;const pi=free[R()*free.length|0];pk[pi]=1;
 const k=['hatch','sedan','suv'][R()*3|0],m=makeCar(k,[0xe53935,0x8e24aa,0x00acc1,0xfdd835,0xeeeeee,0x3949ab][R()*6|0]),vip=R()<.08+S.rep/600,un=KS.filter(x=>CARS[x].lv<=S.show);
 m.position.set(-36,0,12.5);scene.add(m);
 custs.push({st:'SPAWNING',pi,sx:PX[pi],car:m,m,path:[[PX[pi],12.5]],vip,pref:choosePreferred(un),bud:(3500+R()*8000*S.show*S.show)*(1+S.rep/200)*(vip?2.5:1),w:0,t:0,ph:R()*6,age:0})}
const inPath=(c,d)=>{const wx=c.sx+1.6,p=[[wx,3.5],[0,3.5],[0,2.5],[0,0]];if(d){if(d.r2)p.push([0,-6]);p.push([d.ax,d.az])}return p};
function outPath(c){const wx=c.sx+1.6,p=[];if(c.m.position.z<-5)p.push([0,-6]);p.push([0,.2],[0,2.5],[wx,3.5],[wx,7]);return p}
function leave(c){if(c.d&&c.d.res===c)c.d.res=null;c.st='LEAVING';c.sub='';c.act=false;c.path=outPath(c);c.per.dot.visible=false}
function forceLeave(c){if(c.st=='TESTDRIVE'&&(c.sub=='go'||c.sub=='drive')){tdBusy=Math.max(0,tdBusy-1);if(c.tdc){scene.remove(c.tdc);c.tdc=null;c.per.position.set(17.5,0,3.8);scene.add(c.per);c.m=c.per}}if(c.staff){c.staff.st='IDLE';c.staff.c=null;c.staff.path=[];c.staff=null}if(ctrC===c)ctrC=null;
 c.dr=0;if(c.per){c.m=c.per;leave(c);}else{if(c.d)c.d.res=null;c.dead=1;scene.remove(c.car);pk[c.pi]=0}}
function updC(c,dt){const kk=c.st+(c.sub||'');if(kk!==c.k){c.k=kk;c.age=0}else c.age+=dt;
 if((c.age>180&&c.st!='LEAVING')){forceLeave(c);return}if(c.st=='LEAVING'&&c.age>60){if(c.per)removeActor(c.per);scene.remove(c.car);pk[c.pi]=0;c.dead=1;return}
 switch(c.st){
 case'SPAWNING':if(follow(c,9,dt,1)){c.st='PARKING';c.path=[[c.sx,7]]}break;
 case'PARKING':if(follow(c,5,dt,1)){const p=person(c.vip?0xffc107:PC[R()*6|0],c.vip);p.position.set(c.sx+1.6,0,7);scene.add(p);c.per=p;c.m=p;
   reserveCar(c);c.path=inPath(c,c.d);c.st='WALKING';S.served++}break;
 case'WALKING':if(follow(c,2.6,dt)){c.st='BROWSING';c.t=0}break;
 case'BROWSING':c.t+=dt;if(c.d)face(c.m,c.d.x,c.d.z);if(c.t>2.5){if(c.d){if(S.td>0&&tdBusy<S.td&&!c.tdDone&&R()<.5){c.tdDone=1;tdBusy++;c.st='TESTDRIVE';c.sub='go';c.path=[...(c.d.r2?[[0,-6]]:[]),[0,0],[0,2.5],[16,3.5],[17.5,3.8]]}else{c.st='WAITING';c.w=0;c.per.dot.visible=true;c.per.dot.material.color.set(0xffeb3b)}}else{addRep(-1);leave(c)}}break;
 case'TESTDRIVE':if(c.sub=='go'){if(follow(c,2.6,dt)){c.sub='drive';scene.remove(c.per);const m=makeCar(c.d.car,CARS[c.d.car].col);m.position.set(19,0,4);scene.add(m);c.tdc=m;c.m=m;c.path=[[26,4],[26,-8],[19,-8],[19,4]]}}
  else if(c.sub=='drive'){if(follow(c,7,dt,1)){scene.remove(c.tdc);c.tdc=null;tdBusy=Math.max(0,tdBusy-1);c.m=c.per;c.per.position.set(17.5,0,3.8);scene.add(c.per);const fee=Math.round(150+CARS[c.d.car].price*.02);S.money+=fee;S.rev+=fee;S.profit+=fee;recordIncome('test',fee);S.tdN++;sales.push([performance.now(),fee]);floatTxt('+'+fm(fee),c.per.position);c.tdOK=1;c.sub='back';c.path=[[16,3.5],[0,2.5],[0,0],...(c.d.r2?[[0,-6]]:[]),[c.d.ax,c.d.az]]}}
  else if(follow(c,2.6,dt)){c.st='WAITING';c.w=0;c.sub='';c.per.dot.visible=true;c.per.dot.material.color.set(0xffeb3b)}break;
 case'WAITING':c.w+=dt;if(c.w>65){addRep(-2);S.satisfaction=S.satisfaction*.95+1.5;forceLeave(c)}break;
 case'BUYING':if(c.sub=='toC')follow(c,2.6,dt);c.act=c.sub=='serve'||c.sub=='pay';break;
 case'LEAVING':if(!c.dr){if(follow(c,2.6,dt)){removeActor(c.per);c.m=c.car;c.path=[[c.sx,12.5],[42,12.5]];c.dr=1}}else{if(c.path.length==1)pk[c.pi]=0;if(follow(c,8,dt,1)){scene.remove(c.car);c.dead=1}}}}
function ensureMech(){if(S.gar>0&&!mech){mech=person(0xff7043);mech.position.set(-20.6,0,-1.5);mech.rotation.y=-Math.PI/2;scene.add(mech)}}
function updG(dt){if(S.gar<1)return;ensureMech();
 if(!gj){gT-=dt;if(gT<=0){const bc=Math.round(1200+R()*600);if(S.money>=bc){S.money-=bc;const m=makeCar(['hatch','sedan','suv'][R()*3|0],0x8d6e63);m.position.set(-36,0,12.5);scene.add(m);gj={m,st:'IN',path:[[-23,12.5],[-23,-1.5]],bc,t:0,age:0}}else gT=5}return}
 gj.age+=dt;if(gj.age>70){scene.remove(gj.m);S.money+=gj.bc;gj=null;gT=10;return}
 if(gj.st=='IN'){if(follow(gj,6,dt,1)){gj.st='FIX';gj.t=0}}
 else if(gj.st=='FIX'){gj.t+=dt*(1+.3*(S.gar-1));gj.m.position.y=Math.abs(Math.sin(tm*14))*.04;if(gj.t>=15){gj.m.position.y=0;gj.st='OUT';gj.path=[[-23,12.5],[42,12.5]]}}
 else if(follow(gj,6,dt,1)){const sp=Math.round(gj.bc+500+300*S.gar+R()*300),pf=sp-gj.bc;S.money+=sp;S.rev+=sp;S.profit+=pf;recordIncome('garage',pf);S.garN++;addXP(8+pf/100);addRep(.2);sales.push([performance.now(),pf]);floatTxt('+'+fm(sp),gj.m.position);scene.remove(gj.m);gj=null;gT=Math.max(8,22-4*S.gar)}}
function addStaff(i){const m=person(0x1976d2);const home=[-8+i*2.4,-.8];m.position.set(home[0],0,home[1]);scene.add(m);m.add(box(.1,.5,.05,0xffffff,0,1.05,.3));staff.push({m,st:'IDLE',path:[],home,i,age:0,ph:i});key(m,'staff')}
function route(s,tz){const p=[];if(s.m.position.z<-6)p.push([0,-6],[0,-.8]);if(tz<-6)p.push([0,-.8],[0,-6]);return p}
function updS(s,dt){s.act=s.st=='SERVING';if(s.st!==s.k){s.k=s.st;s.age=0}else s.age+=dt;
 if(s.st!='IDLE'&&(s.age>110||(s.c&&s.st!='FINISHING'&&(s.c.dead||s.c.staff!==s)))){const c=s.c;if(c&&c.staff===s){if(ctrC===c)ctrC=null;if(c.st==='BUYING')forceLeave(c);else c.staff=null}s.st='IDLE';s.path=[];s.c=null;return}
 const sp=3.2*(1+S.train*.015),f=(1+.3*(S.spd-1))*(1+S.train*.06);switch(s.st){
 case'IDLE':{if(s.path.length)follow(s,sp,dt);else{s.mv=false;if(Math.hypot(s.m.position.x-s.home[0],s.m.position.z-s.home[1])>.1)s.path=[...route(s,-1),s.home.slice()]}
  const q=custs.filter(c=>c.st=='WAITING'&&!c.staff).sort((a,b)=>(b.w-Math.hypot(s.m.position.x-b.m.position.x,s.m.position.z-b.m.position.z)*.15)-(a.w-Math.hypot(s.m.position.x-a.m.position.x,s.m.position.z-a.m.position.z)*.15))[0];if(q){q.staff=s;s.c=q;s.st='MOVING';s.job='serve';s.path=[...route(s,q.d.r2?-8:0),[q.d.sx,q.d.az]];q.per.dot.material.color.set(0x66ff66)}break}
 case'MOVING':if(follow(s,sp,dt)){s.st='SERVING';if(s.job=='serve'){s.c.st='BUYING';s.c.sub='serve';s.c.prog=0;face(s.m,s.c.m.position.x,s.c.m.position.z);face(s.c.m,s.m.position.x,s.m.position.z)}}break;
 case'SERVING':{const c=s.c;if(s.job=='serve'){c.prog+=dt*f;if(c.prog>=5){if(ctrC&&ctrC!==c)break;ctrC=c;c.sub='toC';c.prog=0;c.path=[...(c.m.position.z<-5?[[0,-6],[0,.2]]:[]),[12,.2]];s.st='FINISHING';s.t=.3;s.fin='go'}}
  else{if(c.sub=='toC'&&!c.path.length){c.sub='pay';c.prog=0;face(c.m,9.2,-1.6);face(s.m,12,.2)}if(c.sub=='pay'){c.prog+=dt*f;if(c.prog>=2)sale(c,s)}}break}
 case'FINISHING':s.t-=dt;if(s.t<=0){if(s.fin=='go'){s.st='MOVING';s.job='cash';s.path=[...route(s,-1),[9.2,-1.6]]}else{s.st='IDLE';s.c=null}}break}}
function quote(k,c){if(c.offer&&c.d?.car===k)return Math.round(c.offer*(c.tdOK?1.03:1));return Math.max(Math.round(CARS[k].cost*1.02),Math.round(CARS[k].price*market(k).sell*S.pricing[k]*(1+(c.vip?.08:0)+(k===c.pref?.035:0)+S.rep/2500+(S.policy==='value'?-.025:S.policy==='premium'?.04:0))))}
function reserveCar(c){
 const av=slots.slice(0,NSL()).filter(d=>d.car&&!d.res&&quote(d.car,c)*.98<=c.bud);
 av.sort((a,b)=>((b.car===c.pref?2:0)+(c.bud-quote(b.car,c))/c.bud)-((a.car===c.pref?2:0)+(c.bud-quote(a.car,c))/c.bud));
 c.d=av[0]||null;if(c.d){c.offer=quote(c.d.car,c);c.d.res=c;c.match=c.d.car===c.pref;c.happy=c.match?95:75}
}
function sale(c,s){const d=c.d;if(!d||!d.car){forceLeave(c);return}if(quote(d.car,c)>c.bud&&quote(d.car,c)*.95<=c.bud){c.offer=Math.floor(c.bud/(c.tdOK?1.03:1));toast('Nhân viên thương lượng thành công')}if(quote(d.car,c)>c.bud){addRep(-.5);S.satisfaction=S.satisfaction*.95+2;forceLeave(c);return}const k=CARS[d.car],price=quote(d.car,c),prof=price-(d.basis||k.cost),inc=d.cons?prof:price;
 S.money+=inc;S.rev+=price;S.profit+=prof;S.sold++;recordIncome('cars',prof);S.satisfaction=S.satisfaction*.95+Math.max(35,100-c.w*.8)*.05;if(c.vip)S.vip++;addRep(c.vip?2:.5);addXP(10+price/150);sales.push([performance.now(),prof]);
 floatTxt('+'+fm(inc),c.m.position);burst(c.m.position);beep(880,.12);setTimeout(()=>beep(1320,.18),100);
 scene.remove(d.mesh);d.car=null;d.mesh=null;d.res=null;d.t=3.5;ctrC=null;c.staff=null;leave(c);s.st='FINISHING';s.fin='idle';s.t=.4;save()}
function floatTxt(txt,pos){const v=new V(pos.x,2.5,pos.z).project(cam),e=document.createElement('div');e.className='x';e.textContent=txt;e.style.left=(v.x+1)/2*innerWidth+'px';e.style.top=(1-v.y)/2*innerHeight+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),1500)}
// ---------- giao diện
let cur=null;const P=$('P');
const rw=(t,l,mx,ben,k)=>{const c=l>=mx?null:COST[k]();return`<div class="r"><div><b>${t}</b> · Cấp ${l}/${mx}<br>${ben}</div>${c==null?'<b>TỐI ĐA</b>':`<button data-u="${k}" ${S.money<c?'disabled':''}>${fm(c)}</button>`}</div>`};
const hd=t=>`<div class="r"><div><b style="font-size:16px">${t}</b></div><button data-a="close">✕</button></div>`,STN={IDLE:'Rảnh',MOVING:'Di chuyển',SERVING:'Phục vụ',FINISHING:'Hoàn tất'};
function ph(k){let h='';
 if(k=='show')h=hd('Showroom & Dịch vụ')+rw('Showroom',S.show,3,S.show<3?`+${[2,4,6][S.show]-NSL()} chỗ trưng bày${S.show==1?', mở SUV':', mở xe thể thao, cổng vàng'}`:'Cấp cao nhất','show')+rw('Bãi đỗ xe',S.park,3,S.park<3?`${NPK()} → ${[2,4,6][S.park]} ô, khách đến nhanh hơn`:'Tối đa','park')+rw('Khu lái thử',S.td,3,S.td<3?`Cho ${S.td+1} xe lái thử cùng lúc: thu phí và khách trả thêm 3%`:'Tối đa','td')+rw('Khu sửa chữa',S.gar,3,S.gar<3?(S.gar?'Sửa nhanh hơn, lãi cao hơn':'Nhập xe cũ, sửa và bán lại'):'Tối đa','gar')+`<div class="r"><div>Chỗ trưng bày <b>${NSL()}</b> · Ô đỗ <b>${NPK()}</b> · Sức chứa kho <b>${CAP()}</b></div></div>`;
 if(k=='inv')h=hd('Kho xe ('+STK()+'/'+CAP()+')')+KS.map(x=>{const c=CARS[x];return c.lv>S.show?`<div class="r"><div><b>${c.n}</b><br>Mở khóa ở Showroom cấp ${c.lv}</div></div>`:`<div class="r"><div><b>${c.n}</b> · tồn <b>${S.inv[x]}</b><br>Nhập ${fm(stockCost(x))} · Giá cơ sở ${fm(quote(x,{pref:'',vip:false}))}<br>Thị trường ${market(x).demand>1?'↗ Nhu cầu cao':'↘ Nhu cầu thấp'} · Giá đặt ${Math.round(S.pricing[x]*100)}%</div><button data-b="${x}:1" ${S.money<stockCost(x)?'disabled':''}>+1</button><button data-b="${x}:5" ${S.money<stockCost(x)*5?'disabled':''}>+5</button><button aria-label="Giảm giá" data-p="${x}:-0.05">−</button><button aria-label="Tăng giá" data-p="${x}:0.05">+</button></div>`}).join('')+`<div class="r"><div>Tự động nhập khi hết xe: <b>${S.auto?'Bật':'Tắt'}</b></div><button data-a="auto">Đổi</button></div>`;
 if(k=='staff')h=hd('Nhân viên')+`<div class="r"><div><b>Học viện bán hàng · ${S.train}/12</b><br>+6% hiệu suất và +1.5% đi bộ mỗi cấp. Đào tạo 30s, đội ngũ vẫn làm việc.<br>${S.training?'Còn '+Math.ceil(S.training)+'s':'Sẵn sàng'}</div><button data-a="train" ${S.training||S.train>=12||S.money<trainCost()?'disabled':''}>${S.train>=12?'Tối đa':fm(trainCost())}</button></div>`+rw('Tốc độ tư vấn',S.spd,6,'+30% tốc độ phục vụ và thanh toán','spd')+rw('Tuyển nhân viên',S.staff,3,'Phục vụ thêm 1 khách cùng lúc','hire')+staff.map((s,i)=>`<div class="r"><div>Nhân viên ${i+1}: <b>${STN[s.st]}</b></div></div>`).join('');
 if(k=='mis'){const m=MIS[S.mi];h=hd('Nhiệm vụ ('+S.mi+'/'+MIS.length+')')+(m?`<div class="r"><div><b>${m.t}</b><br>Thưởng ${fm(m.r)} + 2 KC<div class="bar"><i style="width:${Math.min(100,MV()[m.k]/m.n*100)}%"></i></div></div><b>${Math.floor(Math.min(MV()[m.k],m.n))}/${m.n}</b></div>`:'<div class="r"><div>Đã hoàn thành tất cả!</div></div>')+MIS.slice(S.mi+1).map(x=>`<div class="r"><div>${x.t}</div></div>`).join('')}
 if(k=='menu')h=hd('Điều hành đại lý')+`<div class="management-summary" aria-label="Tổng quan điều hành"><div class="management-metric"><span>LÃI RÒNG</span><strong data-metric="net-profit">${fm(S.profit-S.ops)}</strong></div><div class="management-metric"><span>KHÁCH ĐANG CHỜ</span><strong>${custs.filter(c=>c.st==='WAITING'&&!c.staff).length} cần tư vấn</strong></div></div>`+`<div class="r"><div><b>Tổng quan lợi nhuận</b><br>Xe ${fm(S.stats.cars)} · Gara ${fm(S.stats.garage)}<br>Lái thử ${fm(S.stats.test)} · Offline ${fm(S.stats.offline)}<br>Chi vận hành ${fm(S.ops)} · Lãi ròng ${fm(S.profit-S.ops)}<br>Lãi ròng 24 giờ: ${fm(S.history.filter(x=>x.hour>Math.floor(Date.now()/3600000)-24).reduce((n,x)=>n+x.profit,0))}<br>Phân tích từ v6; tổng lãi kế thừa v5 được giữ.</div></div><div class="r"><div>Hình ảnh: ${S.quality} · Lưu tự động 5s</div><button data-a="quality">Đổi</button><button data-a="save">Lưu</button></div>`+`<div class="r"><div><b>Chính sách giá</b><br>Hài lòng: ${Math.round(S.satisfaction)}% · ${S.policy==='value'?'Giá tốt −2.5%':S.policy==='premium'?'Cao cấp +4%':'Cân bằng'}<br>Giá cao cần khách có ngân sách phù hợp.</div><button data-a="policy">Đổi</button></div>`+`<div class="r"><div><b>Quảng cáo</b><br>Khách đến nhanh ×1.7 trong 2 phút (còn ${Math.ceil(S.mkt)}s)</div><button data-a="ads" ${S.money<750||S.mkt>480?'disabled':''}>${fm(750)}</button></div><div class="r"><div>Đổi 5 KC lấy ${fm(2500)} (có ${S.gems} KC)</div><button data-a="gem" ${S.gems<5?'disabled':''}>Đổi</button></div>`+
  `<div class="r"><div>Doanh thu: <b>${fm(S.rev)}</b> · Lợi nhuận: <b>${fm(S.profit)}</b><br>Xe đã bán: <b>${S.sold}</b> · Khách: <b>${S.served}</b> · VIP: <b>${S.vip}</b> · Lái thử: <b>${S.tdN}</b> · Sửa xe: <b>${S.garN}</b><br>Lợi nhuận/phút: <b>${fm(S.rpm)}</b> · Danh tiếng: <b>${Math.floor(S.rep)}</b> · Cấp: <b>${S.lvl}</b></div></div>`+
  `<div class="r"><div>Âm thanh: <b>${S.snd?'Bật':'Tắt'}</b></div><button data-a="snd">Đổi</button></div><div class="r"><div>Xóa tiến trình, chơi lại</div><button data-a="reset">Reset</button></div>`;
 if(k==='inv')h+=`<div class="r"><div><b>XE CŨ • Tuyển chọn</b><br>Mua $1,800 · kiểm định và bán tự động $2,600 sau 40s. Đang xử lý ${S.used}/3.</div><button data-a="used" ${S.money<1800||S.used>=3?'disabled':''}>Mua xe cũ</button></div><div class="r"><div><b>ĐƠN ĐẶT RIÊNG</b><br>Khách trả thêm 12%. Cần xe trong kho sau 45s; xe trưng bày không bị lấy.</div><button data-a="order" ${S.orders.length>=3?'disabled':''}>Nhận đơn</button></div>`+S.orders.map(o=>`<div class="r"><div>Đơn #${o.id} · ${CARS[o.k].n}<br>${o.elapsed<45?'Chuẩn bị '+Math.ceil(45-o.elapsed)+'s':'Đợi nhập xe vào kho'}</div></div>`).join('');
 return h}
// Preserve live controls and scroll position during ticking status updates.
function patchNode(a,b){
 if(a.nodeType!==b.nodeType||a.nodeName!==b.nodeName){a.replaceWith(b.cloneNode(true));return}
 if(a.nodeType===3){if(a.nodeValue!==b.nodeValue)a.nodeValue=b.nodeValue;return}
 if(a.nodeType!==1)return;
 for(const attr of [...a.attributes])if(!b.hasAttribute(attr.name))a.removeAttribute(attr.name);
 for(const attr of [...b.attributes])if(a.getAttribute(attr.name)!==attr.value)a.setAttribute(attr.name,attr.value);
 const aa=[...a.childNodes],bb=[...b.childNodes];
 for(let i=0;i<Math.max(aa.length,bb.length);i++){
  if(!bb[i])aa[i].remove();else if(!aa[i])a.appendChild(bb[i].cloneNode(true));else patchNode(aa[i],bb[i]);
 }
}
function refreshP(f){if(!cur)return;const h=ph(cur);if(f||P.dataset.h!==h){P.dataset.h=h;
 if(f)P.innerHTML=h;else{const temp=document.createElement('div');temp.innerHTML=h;
 const old=[...P.childNodes],fresh=[...temp.childNodes];
 for(let i=0;i<Math.max(old.length,fresh.length);i++){if(!fresh[i])old[i].remove();else if(!old[i])P.appendChild(fresh[i].cloneNode(true));else patchNode(old[i],fresh[i])}
 }}}
function openP(k){cur=k;P.dataset.h='';refreshP(1);P.classList.add('on')}
function closeP(){P.classList.remove('on');cur=null}
P.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;audio();const d=b.dataset;
 if(!owner)return;if(d.a==='train')startTraining();if(d.p){const [k,n]=d.p.split(':');adjustPrice(k,Number(n))}if(d.a==='save'){save(true);toast(storageOK?'Đã lưu tiến trình':'Không thể lưu')}if(d.a==='quality'){S.quality={auto:'eco',eco:'high',high:'auto'}[S.quality];setQuality();save();refreshP(1)}if(d.a==='used')buyUsed();if(d.a==='order')orderCar();if(d.u)up(d.u);if(d.b){const a=d.b.split(':');buyStock(a[0],+a[1])}
 if(d.a==='policy'){S.policy={balanced:'value',value:'premium',premium:'balanced'}[S.policy];save();refreshP(1)}if(d.a=='close')closeP();if(d.a=='snd'){S.snd^=1;save();refreshP(1)}if(d.a=='auto'){S.auto^=1;save();refreshP(1)}
 if(d.a=='ads'&&S.money>=750&&S.mkt<=480){S.money-=750;recordExpense(750);S.mkt=Math.min(600,S.mkt+120);S.mktN++;beep(700,.15);save();refreshP(1)}
 if(d.a=='gem'&&S.gems>=5){S.gems-=5;S.money+=2500;beep(900,.15);save();refreshP(1)}
 if(d.a=='reset'&&confirm('Xóa toàn bộ tiến trình?')){resetting=true;try{localStorage.removeItem('aet6');localStorage.removeItem('aet6-backup');localStorage.removeItem('aet5');localStorage.removeItem('aet1')}catch(x){}location.reload()}});
$('nav').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;audio();const k=b.dataset.o;if(cur==k)closeP();else{focus(k);openP(k)}});
$('mb').addEventListener('click',()=>openP('mis'));
function hud(){$('money').textContent=fm(S.money);$('gems').textContent='💎 '+S.gems;$('rep').textContent='★ '+Math.floor(S.rep)+(S.mkt>0?' 📢':'');$('lvt').textContent='Cấp '+S.lvl;$('xpf').style.width=Math.min(100,S.xp/need(S.lvl)*100)+'%';chkMis();
 const m=MIS[S.mi];$('mb').textContent=m?'🎯 '+m.t+' ('+Math.floor(Math.min(MV()[m.k],m.n))+'/'+m.n+')':'🎯 Hoàn thành tất cả nhiệm vụ';refreshP()}
// ---------- khởi tạo
for(let i=0;i<S.staff;i++)addStaff(i);
slots.forEach((d,i)=>{const s=(S.disp||[])[i];if(i<NSL()&&s&&CARS[s.replace('*','')]){d.nextBasis=Math.max(1,Math.min(CARS[s.replace('*','')].cost*2,Number(S.displayData[i]?.basis)||CARS[s.replace('*','')].cost));mount(d,s.replace('*',''),s.endsWith('*'))};d.t=0});
applyVis();claimOffline();fillSlots();fit();setQuality();save(true);
addEventListener('pagehide',()=>{updRpm();save(true);try{if(ownSave())localStorage.removeItem('aet6-owner')}catch(e){}});addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){updRpm();save(true)}else{claimOffline();sales.length=0;t0=performance.now();last=performance.now()}});
setInterval(()=>{lease();if(!owner){$('mt').textContent='Game đang mở ở tab khác';$('mp').textContent='Đóng tab kia rồi tải lại tab này để tiếp tục từ bản lưu mới nhất.';$('modal').style.display='flex';return}if(document.hidden)return;updRpm();save()},5000);
let last=performance.now(),hudT=0,tm=0;
function loop(n){requestAnimationFrame(loop);let elapsed=Math.min(1,Math.max(0,(n-last)/1000));last=n;qualityClock+=elapsed;qualityFrames++;if(qualityClock>5){if(S.quality==='auto'){const fps=qualityFrames/qualityClock;const next=Math.max(1,Math.min(1.5,adaptiveDpr+(fps<38?-.15:fps>57?.05:0)));if(Math.abs(next-adaptiveDpr)>.01){adaptiveDpr=next;setQuality()}}qualityClock=0;qualityFrames=0}if(document.hidden||!owner)return;
 while(elapsed>0){const dt=Math.min(.05,elapsed);simulate(dt);elapsed-=dt}
 updCam();ren.render(scene,cam)}
function simulate(dt){tm+=dt;updateOrders(dt);if(S.used>0){S.usedTimer=(S.usedTimer||0)+dt;if(S.usedTimer>=40){S.usedTimer=0;S.used--;S.money+=2600;S.rev+=2600;S.profit+=800;recordIncome('cars',800);toast('Đã bán xe cũ: lãi $800');save()}}
 if(S.training>0){S.training=Math.max(0,S.training-dt);if(S.training===0&&S.trainingPending){S.train=Math.min(12,S.train+1);S.trainingPending=false;toast('Đào tạo hoàn tất!');save()}}
 if(S.mkt>0)S.mkt=Math.max(0,S.mkt-dt);
 spawnT-=dt;if(spawnT<=0){spawn();spawnT=[20,16,13][S.park-1]*(.8+R()*.4)*(1-S.rep/400)*(S.mkt>0?.6:1)}
 custs.forEach(c=>updC(c,dt));for(let i=custs.length-1;i>=0;i--)if(custs[i].dead)custs.splice(i,1);
 staff.forEach(s=>updS(s,dt));updG(dt);if(mech)anim(mech,{mv:false,act:!!gj&&gj.st=='FIX'},tm);
 warnT-=dt;slots.forEach((d,i)=>{if(i>=NSL())return;if(!d.car){d.t-=dt;if(d.t<=0){if(!restock(d)){d.t=2;if(warnT<=0&&STK()==0){warnT=40;toast('Kho hết xe, hãy nhập thêm ở mục Kho xe')}}}}else if(d.sc<1){d.sc=Math.min(1,d.sc+dt*1.2);d.mesh.scale.setScalar(d.sc)}});
 custs.forEach(c=>{if(c.per&&c.m===c.per)anim(c.per,c,tm)});staff.forEach(s=>anim(s.m,s,tm));
 PT.forEach(q=>{if(q.l>0){q.l-=dt;q.v.y-=12*dt;q.m.position.x+=q.v.x*dt;q.m.position.y+=q.v.y*dt;q.m.position.z+=q.v.z*dt;if(q.l<=0)q.m.visible=false}});
 traffic.forEach(o=>{o.m.position.x-=o.sp*dt;if(o.m.position.x<-45)o.m.position.x=45});clouds.forEach(c=>{c.position.x+=dt*.8;if(c.position.x>70)c.position.x=-70});trees.forEach((t,i)=>t.rotation.z=Math.sin(tm*.8+i)*.02);updateShowcase(dt);updateV11Preview(dt);updateV12City(dt);updateGrandDealershipV13(dt);updateGrandShowroomV14(dt);
 hudT-=dt;if(hudT<=0){hudT=.4;hud()}
 }
requestAnimationFrame(loop);
window.addEventListener('error',e=>{const t=$('toast');t.textContent='Lỗi JS: '+e.message;t.style.opacity=1});
document.addEventListener('aet:before-update',e=>{e.detail.owner=owner;e.detail.saved=owner?save(true):true});
