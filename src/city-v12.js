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
 box(8.2,.075,80,0x46525c,47,.04,-1),
 box(142,.24,1.22,0xc1c1b5,0,.13,-27.1),
 box(142,.24,1.24,0xc1c1b5,0,.13,-17.88),
 box(1.23,.24,80,0xc1c1b5,42.4,.13,-1),
 box(1.23,.24,80,0xc1c1b5,51.6,.13,-1),
 box(18,.10,15,0x668d70,-43,.055,-3.2),
 box(15.7,.065,2.1,0xd4ccad,-43,.09,-3.3),
 box(2.15,.065,13.8,0xd4ccad,-43,.1,-3.3)
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
 [36,4.4,3.3],[54,6,3.8],[-55,-28,4.5]
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
