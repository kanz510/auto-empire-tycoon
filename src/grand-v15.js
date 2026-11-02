// V15 Grand Horizon: PMREM studio environment reflections, kinetic flagship crown,
// executive skybridge, reflecting pools, rooftop helipad and luxury promenade.
// Non-interactive visual layer: no userData.key, hit[] entries or save mutations.
const grandV15={
 root:new THREE.Group(),tiers:[],active:0,clock:0,
 rings:[],water:[],beacons:[],envReady:false,
 bounds:{minX:-22,maxX:33,minZ:-14,maxZ:8.8,maxY:11.2}
};
grandV15.root.name='grand-horizon-v15';
scene.add(grandV15.root);

// 1. Procedural PMREM Studio + Horizon Environment Map for PBR metallic/clearcoat reflections
(function initV15Environment(){
 if(typeof THREE.PMREMGenerator!=='function')return;
 try{
  const pmrem=new THREE.PMREMGenerator(ren);
  pmrem.compileCubemapShader();
  const envScene=new THREE.Scene();
  envScene.background=new THREE.Color(0xbadcf2);
  const skyDome=new THREE.Mesh(
   new THREE.SphereGeometry(40,16,12),
   new THREE.MeshBasicMaterial({color:0xdff1ff,side:THREE.BackSide})
  );
  envScene.add(skyDome);
  const groundHemisphere=new THREE.Mesh(
   new THREE.SphereGeometry(38,16,8,0,Math.PI*2,Math.PI/2,Math.PI/2),
   new THREE.MeshBasicMaterial({color:0x2b3e4e,side:THREE.BackSide})
  );
  envScene.add(groundHemisphere);
  // Studio softbox strips for crisp automotive clearcoat highlights
  [[-14,18,12,18,3,0xfff6e5],[14,18,12,18,3,0xfff6e5],[0,24,-10,26,4,0xffffff],[0,10,22,24,2.5,0xffdf9e]].forEach(([x,y,z,w,h,col])=>{
   const strip=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide}));
   strip.position.set(x,y,z);strip.lookAt(0,0,0);envScene.add(strip);
  });
  const rt=pmrem.fromScene(envScene,.035);
  scene.environment=rt.texture;
  grandV15.envReady=!!scene.environment;
  pmrem.dispose();
 }catch(e){console.warn('V15 PMREM fallback:',e)}
})();

// 2. High-detail procedural travertine + brass inlay texture for the luxury plaza
const v15PlazaCanvas=document.createElement('canvas');
v15PlazaCanvas.width=v15PlazaCanvas.height=256;
{
 const c=v15PlazaCanvas.getContext('2d');
 c.fillStyle='#e6e1d6';c.fillRect(0,0,256,256);
 for(let y=0;y<256;y+=64){
  for(let x=0;x<256;x+=64){
   c.fillStyle=((x+y)/64)%2===0?'#ece7dc':'#dfd9cc';
   c.fillRect(x+2,y+2,60,60);
   c.strokeStyle='#c9ad79';c.lineWidth=1.5;
   c.strokeRect(x+1,y+1,62,62);
  }
 }
}
const v15PlazaTex=new THREE.CanvasTexture(v15PlazaCanvas);
v15PlazaTex.wrapS=v15PlazaTex.wrapT=THREE.RepeatWrapping;
v15PlazaTex.repeat.set(16,3);
v15PlazaTex.encoding=THREE.sRGBEncoding;

const V15M={
 obsidian:new THREE.MeshStandardMaterial({color:0x132430,metalness:.62,roughness:.24}),
 champagne:new THREE.MeshStandardMaterial({color:0xe5c384,metalness:.84,roughness:.18}),
 brushedSteel:new THREE.MeshStandardMaterial({color:0xcad6de,metalness:.78,roughness:.22}),
 marble:new THREE.MeshStandardMaterial({map:v15PlazaTex,roughness:.28,metalness:.14}),
 glass:new THREE.MeshPhysicalMaterial({color:0xa8e0f0,metalness:.08,roughness:.08,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}),
 water:new THREE.MeshStandardMaterial({color:0x3fa7bd,metalness:.35,roughness:.12}),
 glowGold:new THREE.MeshBasicMaterial({color:0xffdf9a}),
 glowCyan:new THREE.MeshBasicMaterial({color:0x8be9fd}),
 foliage:new THREE.MeshStandardMaterial({color:0x357e63,roughness:.9,metalness:.04})
};

function v15Add(parent,geo,mat,x,y,z){
 const m=new THREE.Mesh(geo,mat);
 m.position.set(x,y,z);m.receiveShadow=true;
 parent.add(m);return m;
}
function v15Box(parent,w,h,d,mat,x,y,z){
 return v15Add(parent,new THREE.BoxGeometry(w,h,d),mat,x,y,z);
}
function v15Tier(level){
 const g=new THREE.Group();g.name='grand-v15-tier-'+level;
 grandV15.tiers[level]=g;grandV15.root.add(g);return g;
}

// Tier 1: Luxury travertine promenade, twin reflecting pools, showroom ceiling light blades & digital monolith totem
{
 const g=v15Tier(1);
 const promenade=v15Box(g,52,.04,3.2,V15M.marble,5.6,.175,5.1);
 promenade.name='grand-v15-promenade';

 // Twin reflecting pools flanking the entrance plaza (outside parking & walking routes)
 for(const x of [-16.6,16.6]){
  const poolGroup=new THREE.Group();poolGroup.name='grand-v15-reflecting-pool';
  v15Box(poolGroup,3.8,.26,2.2,V15M.obsidian,x,.14,5.4);
  v15Box(poolGroup,3.95,.05,2.35,V15M.champagne,x,.27,5.4);
  const surface=v15Box(poolGroup,3.45,.04,1.85,V15M.water,x,.25,5.4);
  grandV15.water.push(surface);
  const jet=v15Add(poolGroup,new THREE.CylinderGeometry(.08,.18,.65,12),V15M.glowCyan,x,.55,5.4);
  grandV15.water.push(jet);
  g.add(poolGroup);
 }

 // Interior ceiling architectural light blades above the showroom floor
 const pergola=new THREE.Group();pergola.name='grand-v15-ceiling-pergola';
 for(const x of [-11,-5.5,0,5.5,11]){
  v15Box(pergola,.14,.12,11.6,V15M.obsidian,x,4.02,-4.6);
  v15Box(pergola,.06,.04,11.2,V15M.glowGold,x,3.95,-4.6);
 }
 g.add(pergola);

 // Roadside Digital Brand Monolith Totem
 const totem=new THREE.Group();totem.name='grand-v15-totem';
 v15Box(totem,1.7,.35,.9,V15M.obsidian,-15.4,.18,8.4);
 v15Box(totem,1.4,4.2,.36,V15M.obsidian,-15.4,2.35,8.4);
 v15Box(totem,1.52,4.32,.08,V15M.champagne,-15.4,2.35,8.4);
 const tc=document.createElement('canvas');tc.width=256;tc.height=512;
 const ctx=tc.getContext('2d');
 const grad=ctx.createLinearGradient(0,0,0,512);
 grad.addColorStop(0,'#0f2838');grad.addColorStop(1,'#193e54');
 ctx.fillStyle=grad;ctx.fillRect(0,0,256,512);
 ctx.strokeStyle='#e5c384';ctx.lineWidth=6;ctx.strokeRect(14,14,228,484);
 ctx.fillStyle='#ffe2a6';ctx.font='bold 34px system-ui,sans-serif';ctx.textAlign='center';
 ctx.fillText('AUTO',128,110);ctx.fillText('EMPIRE',128,152);
 ctx.fillStyle='#8be9fd';ctx.font='600 20px system-ui,sans-serif';
 ctx.fillText('LUXURY GALLERY',128,215);
 ctx.fillStyle='#e5c384';ctx.fillRect(48,250,160,3);
 ctx.fillStyle='#ffffff';ctx.font='500 22px system-ui,sans-serif';
 ctx.fillText('VIP TEST DRIVE',128,315);
 ctx.fillText('CERTIFIED CARE',128,355);
 ctx.fillStyle='#acf0cc';ctx.font='bold 26px system-ui,sans-serif';
 ctx.fillText('OPEN 24/7',128,435);
 const totemTex=new THREE.CanvasTexture(tc);totemTex.encoding=THREE.sRGBEncoding;
 v15Add(totem,new THREE.PlaneGeometry(1.18,3.6),new THREE.MeshBasicMaterial({map:totemTex,side:THREE.DoubleSide}),-15.4,2.42,8.6);
 g.add(totem);
}

// Tier 2: Executive Glass Skybridge & Premium Wing Rooftop Terrace
{
 const g=v15Tier(2);
 const bridge=new THREE.Group();bridge.name='grand-v15-skybridge';
 v15Box(bridge,3.8,.22,3.4,V15M.obsidian,15.8,4.55,-4.5);
 v15Box(bridge,3.8,.08,3.52,V15M.champagne,15.8,4.68,-4.5);
 v15Box(bridge,3.8,1.55,.08,V15M.glass,15.8,5.42,-2.85);
 v15Box(bridge,3.8,1.55,.08,V15M.glass,15.8,5.42,-6.15);
 v15Box(bridge,3.8,.14,3.5,V15M.obsidian,15.8,6.22,-4.5);
 v15Box(bridge,3.6,.04,.12,V15M.glowGold,15.8,4.42,-2.82);
 g.add(bridge);

 // Illuminated fin colonnade along the Premium Gallery wing
 for(const z of [-10.5,-7.5,-4.5,-1.5,1.5]){
  v15Box(g,.14,4.8,.32,V15M.champagne,32.55,2.6,z);
  v15Box(g,.06,4.4,.08,V15M.glowGold,32.68,2.6,z);
 }
}

// Tier 3: Kinetic Flagship Crown, Counter-Rotating Dual Halo & Executive Helipad
{
 const g=v15Tier(3);
 const crown=new THREE.Group();crown.name='grand-v15-kinetic-crown';
 crown.position.set(5.6,10.35,4.65);
 const outerRing=new THREE.Mesh(new THREE.TorusGeometry(1.35,.075,10,48),V15M.champagne);
 const innerRing=new THREE.Mesh(new THREE.TorusGeometry(.92,.055,10,36),V15M.brushedSteel);
 const coreStar=new THREE.Mesh(new THREE.OctahedronGeometry(.38,0),V15M.champagne);
 crown.add(outerRing,innerRing,coreStar);
 grandV15.rings.push(outerRing,innerRing,coreStar);
 g.add(crown);

 // Panoramic rooftop atrium ribs spanning the flagship roof
 const atrium=new THREE.Group();atrium.name='grand-v15-skylight-atrium';
 for(const x of [-12,-6,0,6,12,18]){
  v15Box(atrium,.18,.18,8.4,V15M.champagne,x,8.28,-4.5);
 }
 v15Box(atrium,32,.07,8.2,V15M.glass,3,8.24,-4.5);
 g.add(atrium);

 // Executive VIP Helipad on the level-2/3 gallery roof
 const helipad=new THREE.Group();helipad.name='grand-v15-helipad';
 helipad.position.set(24.4,5.52,-4.7);
 v15Add(helipad,new THREE.CylinderGeometry(3.4,3.6,.14,32),V15M.obsidian,0,0,0);
 const padRing=v15Add(helipad,new THREE.TorusGeometry(2.85,.08,8,36),V15M.champagne,0,.09,0);
 padRing.rotation.x=Math.PI/2;
 // 'H' marking in brushed gold
 v15Box(helipad,.32,.04,2.2,V15M.glowGold,-.85,.09,0);
 v15Box(helipad,.32,.04,2.2,V15M.glowGold,.85,.09,0);
 v15Box(helipad,1.7,.04,.32,V15M.glowGold,0,.09,0);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;
  const beacon=v15Add(helipad,new THREE.SphereGeometry(.11,8,6),V15M.glowCyan,Math.cos(a)*3.15,.12,Math.sin(a)*3.15);
  grandV15.beacons.push(beacon);
 }
 g.add(helipad);
}

function updateGrandHorizonV15(dt){
 grandV15.clock+=Math.max(0,Math.min(.05,dt));
 const level=Math.max(1,Math.min(3,(typeof v11DemoTier==='number'?v11DemoTier:S.show)|0));
 if(grandV15.active!==level){
  grandV15.active=level;
  grandV15.tiers.forEach((g,i)=>{if(g)g.visible=i<=level});
 }
 const t=grandV15.clock;
 if(grandV15.rings.length===3){
  grandV15.rings[0].rotation.y=t*.45;
  grandV15.rings[1].rotation.x=Math.sin(t*.7)*.45;
  grandV15.rings[1].rotation.y=-t*.65;
  grandV15.rings[2].rotation.y=t*.9;
 }
 grandV15.water.forEach((w,i)=>{
  w.position.y=(i%2===0?.25:.55)+Math.sin(t*2.4+i)*.015;
 });
 grandV15.beacons.forEach((b,i)=>{
  b.visible=((Math.floor(t*4)+i)%2)===0;
 });
}
updateGrandHorizonV15(0);
