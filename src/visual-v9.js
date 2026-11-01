// V9 visual layer. No persistent save fields or external network assets.
const showroomPremium=new THREE.Group();showroomPremium.name='showroom-premium-details';scene.add(showroomPremium);
const turntables=new THREE.Group();turntables.name='showroom-turntables';showroomPremium.add(turntables);
const podiumGlow=[];
SP.forEach((p,i)=>{
 const ring=new THREE.Mesh(new THREE.TorusGeometry(2.5,.065,3,40),new THREE.MeshBasicMaterial({color:0xffdda0,transparent:true,opacity:.67,depthWrite:false}));
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
for(const x of [-13.4,13.4]){
 showroomPremium.add(box(1.4,.6,1.25,0x233e4a,x,.43,-9.2,{metalness:.35,roughness:.5}));
 showroomPremium.add(box(1.23,.055,1.1,0xc79c5c,x,.76,-9.2));
 const leaves=new THREE.Mesh(new THREE.ConeGeometry(.66,1.7,7),M(0x267956,{roughness:1}));
 leaves.position.set(x,1.63,-9.2);leaves.castShadow=true;showroomPremium.add(leaves);
}
const showroomLevelTwo=new THREE.Group();showroomLevelTwo.name='showroom-level-2';showroomPremium.add(showroomLevelTwo);
showroomLevelTwo.add(
 box(11.6,.26,1.35,0x1c344b,21,4.24,1.35),
 box(11.5,.075,.17,0xffcf75,21,4.14,2.15,{emissive:0xb07727}),
 box(10,.06,12,0xc7ab76,21,.38,-4.5,{metalness:.25,roughness:.45})
);
for(const x of [17.2,24.8])showroomLevelTwo.add(box(.15,3.6,.15,0xc0a56b,x,2.14,1.85,{metalness:.6,roughness:.35}));
const showroomLevelThree=new THREE.Group();showroomLevelThree.name='showroom-level-3';showroomPremium.add(showroomLevelThree);
showroomLevelThree.add(
 box(1.1,6,.75,0xb59655,-15.1,3.1,2.15,{metalness:.7,roughness:.3}),
 box(1.1,6,.75,0xb59655,15.1,3.1,2.15,{metalness:.7,roughness:.3}),
 box(31,.35,.65,0xffd785,0,6.13,2.16,{metalness:.75,roughness:.24,emissive:0x70501d}),
 box(29.5,.10,.2,0xf4efdd,0,6.4,2.2,{emissive:0x695b3d})
);
const showroomVis=applyVis;
applyVis=function(){showroomVis();showroomLevelTwo.visible=S.show>=2;showroomLevelThree.visible=S.show>=3};

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
