// V13 Grand Dealership: architecture evolves visually with showroom levels.
// Separate non-interactive decorative scene, no save fields or customer paths.
const grandV13={root:new THREE.Group(),tiers:[],active:0,animated:[],clock:0};
grandV13.root.name='grand-dealership-v13';scene.add(grandV13.root);
function grandMat(color,metalness=.35,roughness=.42){
 const m=new THREE.MeshStandardMaterial({color,metalness,roughness,envMapIntensity:.4});
 m.color.convertSRGBToLinear();return m;
}
const grandGold=grandMat(0xe7c47c,.75,.25),
 grandSlate=grandMat(0x284454,.55,.38),
 grandStone=grandMat(0xcad4d0,.12,.76),
 grandGlass=new THREE.MeshStandardMaterial({color:0x89c6d4,metalness:.18,roughness:.12,transparent:true,opacity:.05,depthWrite:false}),
 grandGlow=new THREE.MeshBasicMaterial({color:0xffe4aa}),
 grandGreen=grandMat(0x3a8458,.04,.95);
grandGlass.color.convertSRGBToLinear();
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
 const level=Math.max(1,Math.min(3,(typeof v11DemoTier==='number'?v11DemoTier:S.show)|0));
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
