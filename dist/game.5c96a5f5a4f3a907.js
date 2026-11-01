
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
function orderCar(){if(S.orders.length>=3)return;const k=KS.filter(k=>CARS[k].lv<=S.show)[Math.floor(R()*S.show)%KS.filter(k=>CARS[k].lv<=S.show).length];S.orders.push({id:++S.orderId,k,elapsed:0});save();refreshP(1)}
function updateOrders(dt){for(const o of S.orders){o.elapsed+=dt;if(o.elapsed>=45&&S.inv[o.k]>0){S.inv[o.k]--;const income=Math.round(CARS[o.k].price*1.12),profit=income-S.basis[o.k];S.money+=income;S.profit+=profit;S.rev+=income;S.sold++;recordIncome('cars',profit);o.done=true;toast('Giao đơn đặt '+CARS[o.k].n+' · '+fm(income));save()}}S.orders=S.orders.filter(o=>!o.done)}
const fm=n=>'$'+Math.floor(n).toLocaleString('en-US'),need=l=>Math.round(120*Math.pow(l,1.5));
function save(f){if(!owner||!ownSave())return false;if(f||!document.hidden)S.t=Date.now();S.displayData=slots.map(d=>({basis:d.basis||0}));S.garEscrow=gj?gj.bc:0;S.disp=slots.map(d=>d.car?d.car+(d.cons?'*':''):'');try{const raw=JSON.stringify(S);localStorage.setItem('aet6',raw);localStorage.setItem('aet6-backup',raw);storageOK=true;return true}catch(e){storageOK=false;toast('Không lưu được: bộ nhớ trình duyệt bị chặn hoặc đầy')}}
// ---------- cảnh
const ren=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});ren.setPixelRatio(Math.min(devicePixelRatio,1.5));ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;ren.outputEncoding=THREE.sRGBEncoding;document.body.prepend(ren.domElement);
let adaptiveDpr=Math.min(devicePixelRatio,1.5),qualityClock=0,qualityFrames=0;
function setQuality(){ren.setPixelRatio(S.quality==='eco'?1:S.quality==='high'?Math.min(devicePixelRatio,1.75):adaptiveDpr);ren.shadowMap.enabled=S.quality!=='eco';fit()}
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9fd4f0);scene.fog=new THREE.Fog(0x9fd4f0,95,170);
scene.add(new THREE.HemisphereLight(0xdff1ff,0x6a8f5a,.7));
const sun=new THREE.DirectionalLight(0xfff0d0,.85);sun.position.set(25,40,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38,far:120});scene.add(sun);
const fill=new THREE.DirectionalLight(0x9ec8ff,.25);fill.position.set(-20,15,-10);scene.add(fill);
const cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,300);let zoom=1,T=new V(0,0,2),TT=T.clone();
function fit(){ren.setSize(innerWidth,innerHeight);const a=innerWidth/innerHeight,W=(a<1?36:54)/zoom,H=W/a;cam.left=-W/2;cam.right=W/2;cam.top=H/2;cam.bottom=-H/2;cam.updateProjectionMatrix()}
addEventListener('resize',fit);
const box=(w,h,d,c,x,y,z,o)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c,o));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;return m};
const hit=[];function key(g,k){g.traverse(o=>o.userData.key=k);hit.push(g);scene.add(g);return g}
scene.add(box(160,1,160,0x7cc36a,0,-.5,0),box(160,.1,4.4,0x3a3f47,0,.05,12.7));
for(let x=-70;x<70;x+=4)scene.add(box(1.8,.02,.2,0xffffff,x,.11,12.7));
const park=new THREE.Group();park.add(box(30,.12,8,0x555b66,0,.06,6.6));
const PX=[-2,2,-6,6,-10,10],pmark=PX.map(x=>{const a=box(.12,.02,4.4,0xffffff,x+2,.14,7),b=box(.12,.02,4.4,0xffffff,x-2,.14,7);park.add(a,b);return[a,b]});key(park,'park');
const sh=new THREE.Group(),tc=document.createElement('canvas');tc.width=tc.height=64;const tx=tc.getContext('2d');tx.fillStyle='#eef2f7';tx.fillRect(0,0,64,64);tx.fillStyle='#cfd8e3';tx.fillRect(0,0,32,32);tx.fillRect(32,32,32,32);
const tex=new THREE.CanvasTexture(tc);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(15,6.5);
const fl=box(30,.3,13,0xffffff,0,.15,-4.5);fl.material=new THREE.MeshStandardMaterial({map:tex,roughness:.12,metalness:.25});sh.add(fl,box(30,4.5,.4,0xb0bec5,0,2.25,-11));
[-9,0,9].forEach(x=>sh.add(box(6,.25,.1,0xffffff,x,3.6,-10.7,{emissive:0xffffff})));
const glass={transparent:true,opacity:.22,roughness:.05,metalness:.2};
sh.add(box(13.5,3.4,.2,0x9fd8ff,-8.25,1.9,2,glass),box(13.5,3.4,.2,0x9fd8ff,8.25,1.9,2,glass),box(.2,3.4,13,0x9fd8ff,-15,1.9,-4.5,glass),box(.2,3.4,13,0x9fd8ff,15,1.9,-4.5,glass),
 box(31,.5,.5,0x37474f,0,3.8,2),box(31,.4,.5,0x37474f,0,.4,2),box(31,.2,3,0x263238,0,4.2,3.2,{transparent:true,opacity:.8}));
function textSign(text,w,h){const c=document.createElement('canvas');c.width=512;c.height=128;const t=c.getContext('2d');t.fillStyle='#152b45';t.fillRect(0,0,512,128);t.fillStyle='#ffd564';t.font='bold 48px sans-serif';t.textAlign='center';t.fillText(text,256,83);const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}))}
const brand=textSign('AUTO EMPIRE',9.7,1.4);brand.position.set(0,5.4,2.22);sh.add(brand);
const sign=box(10,1.6,.4,0xffffff,0,5.4,2,{emissive:0x666666});sh.add(sign);
const u2=new THREE.Group();[-13,13].forEach(x=>u2.add(box(1,.8,1,0x6d4c41,x,.7,0),box(1.6,1.6,1.6,0x2e9e4f,x,1.8,0)));u2.add(box(5,.04,3,0x1e3a8a,0,.34,-1));
const u3=new THREE.Group();[-14,14].forEach(x=>u3.add(box(.8,4,.8,0xffd54f,x,2.2,-10.4,{metalness:.8,roughness:.2})));u3.add(box(3,3,.3,0xffd54f,0,3,-10.6,{metalness:.8,roughness:.2,emissive:0x7a5a00}));sh.add(u2,u3);
const SP=[[-3,-4],[3,-4],[-9,-4],[9,-4],[-3,-8.5],[3,-8.5]],PD=new THREE.CylinderGeometry(2.7,2.7,.15,24),ped=SP.map(p=>{const m=new THREE.Mesh(PD,M(0x37474f,{roughness:.2,metalness:.5}));m.position.set(p[0],.38,p[1]);m.receiveShadow=true;sh.add(m);return m});
[-15,15].forEach(x=>[-10,-4,1].forEach(z=>sh.add(box(.16,3.6,.16,0x27405a,x,1.9,z))));
 const lounge=new THREE.Group();lounge.add(box(3,.55,1.1,0x217d91,-11,.65,-8),box(3,.8,.2,0x217d91,-11,1.15,-8.5),box(1.5,.12,1,0xd9b879,-11,.65,-6.6));sh.add(lounge);
 const wing=new THREE.Group();wing.add(box(12,.3,13,0xdde8ec,21,.15,-4.5),box(12,4.5,.3,0x27405a,21,2.25,-11));[-9,-4,1].forEach(z=>wing.add(box(.22,4,.22,0xe1c499,27,2,z)));const wingSign=textSign('PREMIUM GALLERY',10,1.3);wingSign.position.set(21,4.4,1);wing.add(wingSign);sh.add(wing);
const oldVis=applyVis;applyVis=function(){oldVis();wing.visible=S.show>=2;wing.scale.x=S.show>=3?1.35:1};
key(sh,'show');
const ctr=new THREE.Group();ctr.add(box(4,1.1,1,0x1565c0,12,.65,-1.6),box(4.2,.12,1.2,0xeeeeee,12,1.25,-1.6),box(.7,.5,.1,0x222222,12.5,1.6,-1.6));key(ctr,'staff');
const trees=[];[[-20,-14],[20,-12],[-18,17],[22,18],[0,-16],[-8,-16],[9,-16]].forEach(p=>{const g=new THREE.Group();g.add(box(.4,1.4,.4,0x6d4c41,0,.7,0));const c=new THREE.Mesh(new THREE.ConeGeometry(1.5,3.5,7),M(0x2e8b57));c.position.y=3;c.castShadow=true;g.add(c);g.position.set(p[0],0,p[1]);scene.add(g);trees.push(g)});
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
function updCam(){T.lerp(TT,.12);cam.position.copy(T).add(new V(1,1.05,1).multiplyScalar(45));cam.lookAt(T)}
const ptr=new Map(),cvs=ren.domElement,ray=new THREE.Raycaster(),RT=new V(1,0,-1).normalize(),FW=new V(-1,0,-1).normalize();let down=null,pd=0;
cvs.addEventListener('pointerdown',e=>{cvs.setPointerCapture(e.pointerId);ptr.set(e.pointerId,[e.clientX,e.clientY]);down=[e.clientX,e.clientY,0];if(ptr.size==2){const p=[...ptr.values()];pd=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);down[2]=99}audio()});
cvs.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;const o=ptr.get(e.pointerId),dx=e.clientX-o[0],dy=e.clientY-o[1];ptr.set(e.pointerId,[e.clientX,e.clientY]);
 if(ptr.size==2){const p=[...ptr.values()],d=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);if(pd>0){zoom=Math.max(.6,Math.min(2.4,zoom*d/pd));fit()}pd=d;if(down)down[2]=99}
 else if(down){down[2]+=Math.abs(dx)+Math.abs(dy);if(down[2]<8)return;const s=(cam.top-cam.bottom)/innerHeight;TT.addScaledVector(RT,-dx*s).addScaledVector(FW,dy*s*1.68);TT.x=Math.max(-28,Math.min(28,TT.x));TT.z=Math.max(-14,Math.min(16,TT.z));T.copy(TT)}});
const endp=e=>{if(!ptr.has(e.pointerId))return;ptr.delete(e.pointerId);if(down&&down[2]<8&&ptr.size==0)tap(e.clientX,e.clientY);if(ptr.size==0)down=null;else if(down)down[2]=99};
cvs.addEventListener('pointerup',endp);cvs.addEventListener('pointercancel',e=>{ptr.delete(e.pointerId);if(!ptr.size)down=null});
function tap(x,y){ray.setFromCamera({x:x/innerWidth*2-1,y:-(y/innerHeight)*2+1},cam);const h=ray.intersectObjects(hit,true);if(h.length){let k=h[0].object.userData.key;focus(k);openP(k=='park'?'show':k)}else closeP()}
const FOC={show:[0,-3],park:[0,7],staff:[0,0],inv:[0,-3]};function focus(k){if(FOC[k])TT.set(FOC[k][0],0,FOC[k][1])}
let ac;function audio(){if(!ac)try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}if(ac&&ac.state=='suspended')ac.resume()}
function beep(f,d){if(!ac||!S.snd)return;const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.value=.12;g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(e.h);e.h=setTimeout(()=>e.style.opacity=0,2200)}
function popup(t,p){$('mt').textContent=t;$('mp').innerHTML=p;$('modal').style.display='flex'}
// ---------- kinh tế
const MAXL={show:3,park:3,spd:6,hire:3,td:3,gar:3},LVL=()=>({show:S.show,park:S.park,spd:S.spd,hire:S.staff,td:S.td,gar:S.gar});
const COST={show:()=>[10000,30000][S.show-1],park:()=>[4500,15000][S.park-1],spd:()=>Math.round(2500*Math.pow(1.8,S.spd-1)),hire:()=>[6000,16000][S.staff-1],td:()=>[8000,20000,40000][S.td],gar:()=>[12000,25000,50000][S.gar]};
const NSL=()=>[2,4,6][S.show-1],NPK=()=>[2,4,6][S.park-1],CAP=()=>[12,20,28][S.show-1],STK=()=>KS.reduce((a,k)=>a+S.inv[k],0);
function addRep(n){S.rep=Math.max(0,Math.min(100,S.rep+n))}
function addXP(x){S.xp+=x;while(S.xp>=need(S.lvl)){S.xp-=need(S.lvl);S.lvl++;S.gems+=3;toast('Lên cấp '+S.lvl+'! +3 KC');beep(700,.2)}}
function up(k){if(!COST[k])return;if(LVL()[k]>=MAXL[k])return;const c=COST[k]();if(S.money<c){toast('Không đủ tiền');return}
 S.money-=c;if(k=='show')S.show++;if(k=='park')S.park++;if(k=='spd')S.spd++;if(k=='hire'){S.staff++;addStaff(S.staff-1)}if(k=='td')S.td++;if(k=='gar')S.gar++;
 applyVis();fillSlots();beep(660,.15);setTimeout(()=>beep(990,.2),120);toast('Nâng cấp thành công!');save();refreshP(1)}
function buyStock(k,n){if(!CARS[k]||!Number.isInteger(n)||n<1||n>5)return;const c=CARS[k];if(c.lv>S.show)return;if(STK()+n>CAP()){toast('Kho đầy ('+CAP()+' xe)');return}if(S.money<stockCost(k)*n){toast('Không đủ tiền');return}const paid=stockCost(k);S.basis[k]=(S.basis[k]*S.inv[k]+paid*n)/(S.inv[k]+n);S.money-=paid*n;S.inv[k]+=n;S.bought+=n;beep(520,.1);fillSlots();save();refreshP(1)}
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
 m.position.x+=dx/d*st;m.position.z+=dz/d*st;m.rotation.y=ang(m.rotation.y,car?Math.atan2(-dz,dx):Math.atan2(dx,dz),dt*8);if(car&&m.wheels)m.wheels.forEach(w=>w.rotation.z-=st/.38);o.mv=true;return false}
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
 if(k=='menu')h=hd('Quản lý v6')+`<div class="r"><div><b>Tổng quan lợi nhuận</b><br>Xe ${fm(S.stats.cars)} · Gara ${fm(S.stats.garage)}<br>Lái thử ${fm(S.stats.test)} · Offline ${fm(S.stats.offline)}<br>Chi vận hành ${fm(S.ops)} · Lãi ròng ${fm(S.profit-S.ops)}<br>Lãi ròng 24 giờ: ${fm(S.history.filter(x=>x.hour>Math.floor(Date.now()/3600000)-24).reduce((n,x)=>n+x.profit,0))}<br>Phân tích từ v6; tổng lãi kế thừa v5 được giữ.</div></div><div class="r"><div>Hình ảnh: ${S.quality} · Lưu tự động 5s</div><button data-a="quality">Đổi</button><button data-a="save">Lưu</button></div>`+`<div class="r"><div><b>Chính sách giá</b><br>Hài lòng: ${Math.round(S.satisfaction)}% · ${S.policy==='value'?'Giá tốt −2.5%':S.policy==='premium'?'Cao cấp +4%':'Cân bằng'}<br>Giá cao cần khách có ngân sách phù hợp.</div><button data-a="policy">Đổi</button></div>`+`<div class="r"><div><b>Quảng cáo</b><br>Khách đến nhanh ×1.7 trong 2 phút (còn ${Math.ceil(S.mkt)}s)</div><button data-a="ads" ${S.money<750||S.mkt>480?'disabled':''}>${fm(750)}</button></div><div class="r"><div>Đổi 5 KC lấy ${fm(2500)} (có ${S.gems} KC)</div><button data-a="gem" ${S.gems<5?'disabled':''}>Đổi</button></div>`+
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
 if(d.a=='reset'&&confirm('Xóa toàn bộ tiến trình?')){try{localStorage.removeItem('aet6');localStorage.removeItem('aet6-backup');localStorage.removeItem('aet5');localStorage.removeItem('aet1')}catch(x){}location.reload()}});
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
 traffic.forEach(o=>{o.m.position.x-=o.sp*dt;if(o.m.position.x<-45)o.m.position.x=45});clouds.forEach(c=>{c.position.x+=dt*.8;if(c.position.x>70)c.position.x=-70});trees.forEach((t,i)=>t.rotation.z=Math.sin(tm*.8+i)*.02);
 hudT-=dt;if(hudT<=0){hudT=.4;hud()}
 }
requestAnimationFrame(loop);
window.addEventListener('error',e=>{const t=$('toast');t.textContent='Lỗi JS: '+e.message;t.style.opacity=1});
document.addEventListener('aet:before-update',e=>{e.detail.owner=owner;e.detail.saved=owner?save(true):true});
