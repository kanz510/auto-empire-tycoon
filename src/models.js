
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
