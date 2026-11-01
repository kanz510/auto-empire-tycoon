from pathlib import Path
r=Path('.')
def patch(path,old,new):
 p=r/path
 value=p.read_text()
 if value.count(old)!=1: raise RuntimeError(f'{path}: expected one occurrence, got {value.count(old)} for {old[:75]}')
 p.write_text(value.replace(old,new))
patch('src/graphics.js',"PD=new THREE.CylinderGeometry(2.7,2.7,.15,24)","PD=new THREE.CylinderGeometry(2.12,2.12,.15,24)")
patch('src/visual-v9.js',"new THREE.TorusGeometry(2.5,.065,3,40)","new THREE.TorusGeometry(2.07,.065,3,40)")
patch('src/graphics.js',"wing.add(box(12,.3,13,0xdde8ec,21,.15,-4.5),box(12,4.5,.3,0x27405a,21,2.25,-11))","wing.add(box(10,.3,12,0xdde8ec,21,.15,-4.5),box(12,4.5,.3,0x27405a,21,2.25,-11))")
patch('src/graphics.js',"wing.scale.x=S.show>=3?1.35:1","wing.scale.x=1")
patch('src/graphics.js',"0xe1c499,27,2,z","0xe1c499,26.5,2,z")
patch('src/graphics.js',"new THREE.ConeGeometry(.76,1.25,6),M(0x397e52,{roughness:1})","new THREE.ConeGeometry(.90,1.6,7),M(0x559b69,{roughness:1})")
patch('src/graphics.js',"[-15.8+i*3.15,.6,-12.65,.55,.8,.55]","[-15.8+i*3.15,.72,-12.65,.72,1,.72]")
patch('src/graphics.js',"[-16.8,.62,-9+i*2.5,.6,.9,.6]","[-16.8,.72,-9+i*2.5,.76,1,.76]")
patch('src/graphics.js',"[16.8,.62,-9+i*2.5,.6,.9,.6]","[16.8,.72,-9+i*2.5,.76,1,.76]")
patch('src/graphics.js',"for(let i=0;i<72;i++){const x=-47+(i*31%95),z=-28+(i*43%63);","for(let i=0;i<36;i++){const x=-47+(i*31%95),z=-28+(i*43%63);")
patch('src/graphics.js',"M(0x81c985,{roughness:1}),grassMarks,false","M(0x75be69,{roughness:1}),grassMarks,false")
patch('src/graphics.js',"grassMarks.push([x,.025,z,.8+(i%4)*.35,.7,1.2+(i%3)*.3]);","grassMarks.push([x,.025,z,.48+(i%4)*.17,.7,.65+(i%3)*.18]);")
patch('src/characters-v11.js',"const factor=1.8/Math.max(.5,sz.y)","const factor=2.0/Math.max(.5,sz.y)")
patch('src/showroom-v11.js',"0xe9c27a,.13);","0xe9c27a,.08);")
patch('src/visual-v9.js',
"""for(const x of [-13.4,13.4]){
 showroomPremium.add(box(1.4,.6,1.25,0x233e4a,x,.43,-9.2,{metalness:.35,roughness:.5}));
 showroomPremium.add(box(1.23,.055,1.1,0xc79c5c,x,.76,-9.2));
 const leaves=new THREE.Mesh(new THREE.ConeGeometry(.66,1.7,7),M(0x267956,{roughness:1}));
 leaves.position.set(x,1.63,-9.2);leaves.castShadow=true;showroomPremium.add(leaves);
}""",
"""const v9Planters=new THREE.Group();v9Planters.name='v9-fallback-planters';showroomPremium.add(v9Planters);
for(const x of [-13.4,13.4]){
 v9Planters.add(box(1.4,.6,1.25,0x233e4a,x,.43,-9.2,{metalness:.35,roughness:.5}));
 v9Planters.add(box(1.23,.055,1.1,0xc79c5c,x,.76,-9.2));
 const leaves=new THREE.Mesh(new THREE.ConeGeometry(.66,1.7,7),M(0x267956,{roughness:1}));
 leaves.position.set(x,1.63,-9.2);leaves.castShadow=true;v9Planters.add(leaves);
}""")
patch('src/assets-3d.js',"if(key==='kenney-sofa')lounge.visible=false;","if(key==='kenney-sofa')lounge.visible=false;\n if(key==='kenney-pottedplant')v9Planters.visible=false;")
patch('src/visual-v9.js',
"for(const x of [17.2,24.8])showroomLevelTwo.add(box(.15,3.6,.15,0xc0a56b,x,2.14,1.85,{metalness:.6,roughness:.35}));",
"""for(const x of [17.2,24.8])showroomLevelTwo.add(box(.15,3.6,.15,0xc0a56b,x,2.14,1.85,{metalness:.6,roughness:.35}));
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
}""")
patch('src/graphics.js',
"let zoom=portraitFocus?1.1:1,T=new V(portraitFocus?5.5:0,0,portraitFocus?1:2),TT=T.clone();",
"let zoom=portraitFocus?1.0:1,T=new V(portraitFocus?(S.show>=2?10.5:5.5):0,0,portraitFocus?-1:2),TT=T.clone();")
patch('src/graphics.js',
"function updCam(){T.lerp(TT,.12);cam.position.copy(T).add(cameraOffset);cam.lookAt(T)}",
"""function updCam(){T.lerp(TT,.12);cam.position.copy(T).add(cameraOffset);cam.lookAt(T)}
let framedShowroomLevel=0;
function frameShowroomForLevel(){
 if(!portraitFocus||framedShowroomLevel===S.show)return;
 framedShowroomLevel=S.show;
 const gallery=S.show>=2;
 T.set(gallery?10.5:5.4,0,-1);TT.copy(T);
 zoom=1;fit();
 cam.position.copy(T).add(cameraOffset);cam.lookAt(T);cam.updateMatrixWorld(true);
 let maxX=0,maxY=0;
 const ends=gallery?[-15.8,27.4]:[-15.8,15.8];
 for(const xx of ends)for(const zz of [-11.7,3.8])for(const yy of [0,6.9]){
  const p=new V(xx,yy,zz).project(cam);
  maxX=Math.max(maxX,Math.abs(p.x));maxY=Math.max(maxY,Math.abs(p.y));
 }
 zoom=Math.max(.60,Math.min(1.15,Math.min(.90/maxX,.74/maxY)));
 fit();
}""")
patch('src/visual-v9.js',
"applyVis=function(){showroomVis();showroomLevelTwo.visible=S.show>=2;showroomLevelThree.visible=S.show>=3};",
"applyVis=function(){showroomVis();showroomLevelTwo.visible=S.show>=2;showroomLevelThree.visible=S.show>=3;frameShowroomForLevel()};")
print('v11.2 geometry, camera, characters, planting fixes applied')
