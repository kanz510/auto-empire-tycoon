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
 const mat=source.clone();mat.map=map;paintMaterialCache.set(id,mat);
 return mat;
}
function vehiclePaint(root,k,col){
 if(Number.isInteger(col))return col;
 if(Number.isInteger(root.userData.requestedColor))return root.userData.requestedColor;
 const original=root.children.find(c=>c.isMesh&&c.material?.color);
 if(original)return original.material.color.clone().convertLinearToSRGB().getHex();
 return CARS[k].col;
}
function applyVehicleAsset(root,k,col){
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
