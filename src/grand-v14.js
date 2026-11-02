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
 const level=Math.max(1,Math.min(3,(typeof v11DemoTier==='number'?v11DemoTier:S.show)|0));
 if(grandV14.active!==level){
  grandV14.active=level;
  grandV14.tiers.forEach((g,i)=>{if(g)g.visible=i<=level});
 }
 if(grandV14.glow[0])grandV14.glow[0].rotation.y=Math.sin(grandV14.clock*.25)*.09;
}
if(typeof brand!=='undefined')brand.visible=false;if(typeof wingSign!=='undefined')wingSign.visible=false;if(typeof signFrame!=='undefined')signFrame.visible=false;if(typeof signText!=='undefined')signText.visible=false;
updateGrandShowroomV14(0);
