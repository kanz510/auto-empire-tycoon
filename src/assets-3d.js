// CC0 Kenney game-ready glTF models. Procedural meshes stay as fallback for network/decoder failures.
// GLTFLoader r128 loads local, content-addressed GLB files; each template is fetched once.
const GLB_ASSETS={readyCars:0,readyProps:0,failed:[],loaded:{}};
const assetLoader=new THREE.GLTFLoader();
const vehicleAssets={hatch:'kenney-car-hatch',sedan:'kenney-car-sedan',suv:'kenney-car-suv',sport:'kenney-car-sport'};
const vehicleTemplates=Object.create(null);
const pendingVehicle={hatch:[],sedan:[],suv:[],sport:[]};
const fallbackCarFactory=makeCar;

function applyVehicleAsset(root,k){
 const template=vehicleTemplates[k];
 if(!template)return false;
 const copy=template.clone(true);
 copy.rotation.y=Math.PI/2; // Kenney vehicles face +Z, game vehicles face +X.
 copy.scale.setScalar(k==='sport'?1.48:1.51);
 const wheels=[];
 copy.traverse(o=>{
  if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}
  if(/^wheel-/.test(o.name)){o.userData.kenneyWheel=true;wheels.push(o)}
 });
 if(wheels.length!==4)return false; // Keep the working procedural fallback if source changes.
 root.clear();root.add(copy);root.wheels=wheels;
 root.userData.assetModel=true;root.userData.assetSource=ART[vehicleAssets[k]];
 return true;
}

makeCar=function(k,col){
 const root=fallbackCarFactory(k,col);
 if(vehicleTemplates[k])applyVehicleAsset(root,k);
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
 for(const root of pendingVehicle[k])if(root.parent)applyVehicleAsset(root,k);
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
