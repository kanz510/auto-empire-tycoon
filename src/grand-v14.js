// V14 Grand Showroom Rebuild. Larger visual footprint, unchanged playable slots.
// Cutaway isometric architecture: tall backdrop & signage on the rear (-Z) wall so
// camera sightlines to the 6 showroom car turntables remain 100% unobstructed.
const grandV14={root:new THREE.Group(),tiers:[],active:0,clock:0,glow:[],bounds:{minX:-21,maxX:32,minZ:-14,maxZ:7,maxY:10}};
grandV14.root.name='grand-showroom-v14';scene.add(grandV14.root);
const gmat=(color,metalness=.2,roughness=.42)=>{const m=new THREE.MeshStandardMaterial({color,metalness,roughness,envMapIntensity:.4});m.color.convertSRGBToLinear();return m};
const G={
 dark:gmat(0x142532,.52,.3),navy:gmat(0x1f3d4d,.38,.37),
 champagne:gmat(0xd9b77a,.72,.27),ivory:gmat(0xd8d4c8,.16,.6),
 stone:gmat(0x9fb0b3,.1,.67),pavement:gmat(0x7d8884,.08,.82),
 foliage:gmat(0x2e7252,.04,.93),glass:new THREE.MeshPhysicalMaterial({
 color:0x9ad4e2,metalness:.05,roughness:.12,transparent:true,opacity:.05,depthWrite:false,side:THREE.DoubleSide
 }),light:new THREE.MeshBasicMaterial({color:0xffe2a6}),water:gmat(0x2f8fa1,.25,.22)
};
G.glass.color.convertSRGBToLinear();
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
 const c=canvas.getContext('2d');c.fillStyle='#102636';c.fillRect(0,0,1024,256);
 c.fillStyle='#e2c182';c.fillRect(32,22,960,6);c.fillRect(32,228,960,6);
 c.textAlign='center';c.fillStyle='#ffe8b5';c.font='bold 96px system-ui,sans-serif';
 c.fillText(title,512,132,960);
 c.fillStyle='#d8f0f0';c.font='600 36px system-ui,sans-serif';
 c.fillText(subtitle,512,194,940);
 const tex=new THREE.CanvasTexture(canvas);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=typeof maxAniso==='number'?maxAniso:4;
 const panel=gm(group,new THREE.PlaneGeometry(width,width/4),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}),x,y,z);
 panel.name='grand-v14-brand-sign';return panel;
}
// Tier 1: Expanded side galleries, front entrance plaza, and tall REAR backdrop wall (-Z)
// so cars inside the showroom are completely unobstructed from the isometric camera.
{
 const g=tier(1);
 gb(g,6.4,.32,17.5,G.ivory,-18.2,.17,-4.7);
 gb(g,5.2,.32,17.5,G.ivory,17.4,.17,-4.7);
 gb(g,6.2,.32,17.5,G.ivory,30,.17,-4.7);
 gb(g,54,.18,3.6,G.pavement,5.6,.07,5.1);
 gb(g,52,.16,1.3,G.dark,5.6,.12,7.05);
 gb(g,54,.35,1.2,G.dark,5.6,.18,-12.2);
 for(const x of [-21.4,32.4]){
  gb(g,.65,5.3,.7,G.navy,x,2.8,-11.5);
  gb(g,.55,4.2,.55,G.champagne,x,2.2,2.5);
 }
 for(const x of [-19.6,-16.3,18.6,21.9,28.4,31]){
  gb(g,.18,4.6,.18,G.navy,x,2.4,-11.4);
 }
 for(const x of [-19.1,19.8,30]){
  gb(g,2.8,3.5,.09,G.glass,x,2.02,-11.2);
 }
 // Grand rear architectural fascia & golden trim behind the cars (z = -11.4)
 gb(g,54,.65,1.8,G.dark,5.6,4.85,-11.5);
 gb(g,53.7,.11,.15,G.champagne,5.6,4.48,-10.55);
 gb(g,53.7,.10,.15,G.champagne,5.6,5.22,-10.55);
 for(const x of [-19,-13,13,19,27,31])gp(g,x,6.3,1.2);
 for(const x of [-12,-8,-4,0,4,8,12,18,24,29]){
  gb(g,.13,.035,2.0,G.champagne,x,.17,5.05);
 }
 // Brand sign mounted high on the rear flagship wall facing the camera
 grandV14Sign(g,'AUTO EMPIRE','PREMIUM MOTOR GALLERY',13.5,0,6.45,-10.32);
}
// Tier 2: Right-wing Premium Gallery backdrop & colonnade
{
 const g=tier(2);
 gb(g,17,.28,19,G.ivory,24.4,.22,-4.7);
 gb(g,17.7,.45,2.2,G.navy,24.4,5.15,-11.4);
 gb(g,17.5,.11,.15,G.champagne,24.4,4.92,-10.55);
 for(const x of [16.4,19.2,22,24.8,27.6,30.4,32.2]){
  gb(g,.16,4.5,.2,G.champagne,x,2.65,-11.1);
 }
 for(const x of [17.8,23.5,29.2]){
  gb(g,5.3,3.5,.09,G.glass,x,2.53,-11.0);
 }
 for(const x of [16.3,32.3]){
  gp(g,x,6.15,1.6);
  gb(g,.38,5.2,.38,G.navy,x,2.8,-13.2);
 }
 gb(g,13,.16,2.5,G.pavement,24.4,.13,7.3);
 grandV14Sign(g,'PREMIUM','LUXURY VEHICLE COLLECTION',10.6,24.4,6.45,-10.32);
}
// Tier 3: Flagship rear crown, golden arch & rooftop gardens (behind the cars at z = -11.4)
{
 const g=tier(3);
 gb(g,54.4,2.85,1.5,G.navy,5.6,6.55,-11.55);
 gb(g,55,.38,2.0,G.dark,5.6,8.12,-11.5);
 gb(g,54.7,.12,.16,G.champagne,5.6,8.0,-10.55);
 gb(g,54.7,.10,.15,G.champagne,5.6,8.36,-10.55);
 for(const x of [-21.1,-15.4,-9.7,-4,1.7,7.4,13.1,18.8,24.5,30.2]){
  gb(g,.18,2.6,.18,G.champagne,x,6.7,-11.2);
 }
 for(const x of [-20.1,31.1]){
  gb(g,3.6,.25,3.2,G.ivory,x,8.53,-11.5);
  for(const dx of [-1,0,1]){
   const bush=gm(g,new THREE.IcosahedronGeometry(.64,1),G.foliage,x+dx,9.15,-11.5);
   bush.scale.y=.72;
  }
 }
 const curve=new THREE.CatmullRomCurve3([
  new THREE.Vector3(-21.2,8.2,-10.5),new THREE.Vector3(-11,9.0,-10.2),
  new THREE.Vector3(5.6,9.45,-10.0),new THREE.Vector3(22,9.0,-10.2),
  new THREE.Vector3(32.4,8.2,-10.5)
 ]);
 const arc=gm(g,new THREE.TubeGeometry(curve,48,.095,7,false),G.champagne,0,0,0);
 arc.name='grand-v14-flagship-arch';
 const emblem=gm(g,new THREE.TorusGeometry(.83,.12,9,32),G.champagne,5.6,9.65,-10.2);
 emblem.name='grand-v14-emblem';grandV14.glow.push(emblem);
}
// Hide older front-facing beams/walls that would otherwise block the cutaway view of the showroom cars
if(typeof brand!=='undefined')brand.visible=false;
if(typeof sign!=='undefined')sign.visible=false;
if(typeof wingSign!=='undefined')wingSign.visible=false;
if(typeof signFrame!=='undefined')signFrame.visible=false;
if(typeof signText!=='undefined')signText.visible=false;
if(typeof showroomV11!=='undefined')showroomV11.visible=false;
if(typeof bb!=='undefined')bb.visible=false;
if(typeof sh!=='undefined')sh.children.forEach(c=>{if(c.position.z>1.5&&c.position.y>1.5)c.visible=false});
if(typeof showroomPremium!=='undefined')showroomPremium.children.forEach(c=>{if(c.isMesh&&c.position.z>1.5&&c.position.y>1.5)c.visible=false});
if(typeof showroomLevelTwo!=='undefined')showroomLevelTwo.children.forEach(c=>{if(c.isMesh&&c.position.z>1&&c.position.y>2)c.visible=false});
if(typeof showroomLevelThree!=='undefined')showroomLevelThree.children.forEach(c=>{if(c.position.z>1.5)c.visible=false});
if(typeof grandV13!=='undefined')grandV13.root.traverse(c=>{if(c.isMesh&&((c.position.z>1.8&&c.position.y>1.8)||c.geometry?.type==='TubeGeometry'))c.visible=false});

function updateGrandShowroomV14(dt){
 grandV14.clock+=Math.max(0,Math.min(.05,dt));
 const level=Math.max(1,Math.min(3,(typeof v11DemoTier==='number'?v11DemoTier:S.show)|0));
 if(grandV14.active!==level){
  grandV14.active=level;
  grandV14.tiers.forEach((g,i)=>{if(g)g.visible=i<=level});
 }
 if(grandV14.glow[0])grandV14.glow[0].rotation.y=Math.sin(grandV14.clock*.25)*.09;
}
updateGrandShowroomV14(0);
