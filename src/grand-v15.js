// V15 Grand Horizon: High-contrast PMREM studio environment reflections, kinetic flagship crown,
// executive skybridge, reflecting pools, rooftop helipad and luxury promenade.
// Non-interactive visual layer: no userData.key, hit[] entries or save mutations.
const grandV15={
 root:new THREE.Group(),tiers:[],active:0,clock:0,
 rings:[],water:[],beacons:[],envReady:false,
 bounds:{minX:-22,maxX:33,minZ:-14,maxZ:8.8,maxY:11.2}
};
grandV15.root.name='grand-horizon-v15';
scene.add(grandV15.root);

// 1. Dark-contrast PMREM Automotive Studio Environment Map
// Gives metallic/clearcoat cars and polished floor crisp specular highlights
// WITHOUT washing out diffuse grass, roads or buildings.
function initV15Environment(){
 if(webglLost||typeof THREE.PMREMGenerator!=='function')return;
 try{
  const pmrem=new THREE.PMREMGenerator(ren);
  pmrem.compileCubemapShader();
  const envScene=new THREE.Scene();
  envScene.background=new THREE.Color(0x0c1824);
  const skyDome=new THREE.Mesh(
   new THREE.SphereGeometry(40,16,12),
   new THREE.MeshBasicMaterial({color:0x132638,side:THREE.BackSide})
  );
  envScene.add(skyDome);
  const groundHemisphere=new THREE.Mesh(
   new THREE.SphereGeometry(38,16,8,0,Math.PI*2,Math.PI/2,Math.PI/2),
   new THREE.MeshBasicMaterial({color:0x071018,side:THREE.BackSide})
  );
  envScene.add(groundHemisphere);
  // High-contrast studio key strips for sharp automotive clearcoat reflections
  [[-16,20,14,16,2.2,0xfff3d6],[16,20,14,16,2.2,0xfff3d6],[0,26,-12,24,2.8,0xffffff],[0,12,24,20,1.8,0xf5ca7b]].forEach(([x,y,z,w,h,col])=>{
   const strip=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide}));
   strip.position.set(x,y,z);strip.lookAt(0,0,0);envScene.add(strip);
  });
  const rt=pmrem.fromScene(envScene,.02);
  scene.environment=rt.texture;
  grandV15.envReady=!!scene.environment;
  pmrem.dispose();
 }catch(e){console.warn('V15 PMREM fallback:',e)}
}
initV15Environment();

// 2. High-detail procedural slate-travertine + brass inlay texture for the luxury plaza
const v15PlazaCanvas=document.createElement('canvas');
v15PlazaCanvas.width=v15PlazaCanvas.height=256;
{
 const c=v15PlazaCanvas.getContext('2d');
 c.fillStyle='#2b3945';c.fillRect(0,0,256,256);
 for(let y=0;y<256;y+=64){
  for(let x=0;x<256;x+=64){
   c.fillStyle=((x+y)/64)%2===0?'#324250':'#263440';
   c.fillRect(x+2,y+2,60,60);
   c.strokeStyle='#c9a66b';c.lineWidth=1.5;
   c.strokeRect(x+1,y+1,62,62);
  }
 }
}
const v15PlazaTex=new THREE.CanvasTexture(v15PlazaCanvas);
v15PlazaTex.wrapS=v15PlazaTex.wrapT=THREE.RepeatWrapping;
v15PlazaTex.repeat.set(16,3);
v15PlazaTex.encoding=THREE.sRGBEncoding;
v15PlazaTex.anisotropy=typeof maxAniso==='number'?maxAniso:4;

function v15StdMat(color,metalness,roughness){
 const m=new THREE.MeshStandardMaterial({color,metalness,roughness});
 m.color.convertSRGBToLinear();return m;
}
const V15M={
 obsidian:v15StdMat(0x11202b,.65,.22),
 champagne:v15StdMat(0xe2bc76,.85,.18),
 brushedSteel:v15StdMat(0xc4d2dc,.8,.2),
 marble:new THREE.MeshStandardMaterial({map:v15PlazaTex,roughness:.3,metalness:.18}),
 glass:new THREE.MeshPhysicalMaterial({color:0x68b8d4,metalness:.08,roughness:.08,transparent:true,opacity:.08,depthWrite:false,side:THREE.DoubleSide}),
 water:v15StdMat(0x187c96,.4,.12),
 glowGold:new THREE.MeshBasicMaterial({color:0xffdf9a}),
 glowCyan:new THREE.MeshBasicMaterial({color:0x6be6ff})
};
V15M.glass.color.convertSRGBToLinear();

function v15Add(parent,geo,mat,x,y,z){
 const m=new THREE.Mesh(geo,mat);
 m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;
 parent.add(m);return m;
}
function v15Box(parent,w,h,d,mat,x,y,z){
 return v15Add(parent,new THREE.BoxGeometry(w,h,d),mat,x,y,z);
}
function v15Tier(level){
 const g=new THREE.Group();g.name='grand-v15-tier-'+level;
 grandV15.tiers[level]=g;grandV15.root.add(g);return g;
}

// Tier 1: Dark slate-brass promenade, twin reflecting pools, rear gallery accent wall & digital monolith totem
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

 // Rear showroom architectural accent ribs (along back wall z = -11.3, never obstructing camera view of cars)
 const rearWall=new THREE.Group();rearWall.name='grand-v15-rear-backdrop';
 for(const x of [-12,-6,0,6,12]){
  v15Box(rearWall,.22,4.4,.24,V15M.obsidian,x,2.3,-11.3);
  v15Box(rearWall,.08,4.1,.08,V15M.glowGold,x,2.3,-11.15);
 }
 g.add(rearWall);

 // Roadside Digital Brand Monolith Totem
 const totem=new THREE.Group();totem.name='grand-v15-totem';
 v15Box(totem,1.7,.35,.9,V15M.obsidian,-15.4,.18,8.4);
 v15Box(totem,1.4,4.2,.36,V15M.obsidian,-15.4,2.35,8.4);
 v15Box(totem,1.52,4.32,.08,V15M.champagne,-15.4,2.35,8.4);
 const tc=document.createElement('canvas');tc.width=256;tc.height=512;
 const ctx=tc.getContext('2d');
 const grad=ctx.createLinearGradient(0,0,0,512);
 grad.addColorStop(0,'#0b1d2a');grad.addColorStop(1,'#133145');
 ctx.fillStyle=grad;ctx.fillRect(0,0,256,512);
 ctx.strokeStyle='#e2bc76';ctx.lineWidth=6;ctx.strokeRect(14,14,228,484);
 ctx.fillStyle='#ffe2a6';ctx.font='bold 34px system-ui,sans-serif';ctx.textAlign='center';
 ctx.fillText('AUTO',128,110);ctx.fillText('EMPIRE',128,152);
 ctx.fillStyle='#6be6ff';ctx.font='600 20px system-ui,sans-serif';
 ctx.fillText('LUXURY GALLERY',128,215);
 ctx.fillStyle='#e2bc76';ctx.fillRect(48,250,160,3);
 ctx.fillStyle='#ffffff';ctx.font='500 22px system-ui,sans-serif';
 ctx.fillText('VIP TEST DRIVE',128,315);
 ctx.fillText('CERTIFIED CARE',128,355);
 ctx.fillStyle='#8bf28b';ctx.font='bold 26px system-ui,sans-serif';
 ctx.fillText('OPEN 24/7',128,435);
 const totemTex=new THREE.CanvasTexture(tc);totemTex.encoding=THREE.sRGBEncoding;totemTex.anisotropy=typeof maxAniso==='number'?maxAniso:4;
 v15Add(totem,new THREE.PlaneGeometry(1.18,3.6),new THREE.MeshBasicMaterial({map:totemTex,side:THREE.DoubleSide}),-15.4,2.42,8.6);
 g.add(totem);
}

// Tier 2: Executive Glass Skybridge & Premium Wing Colonnade
{
 const g=v15Tier(2);
 const bridge=new THREE.Group();bridge.name='grand-v15-skybridge';
 v15Box(bridge,3.4,.22,2.6,V15M.obsidian,15.8,4.6,-9.6);
 v15Box(bridge,3.4,.08,2.72,V15M.champagne,15.8,4.73,-9.6);
 v15Box(bridge,3.4,1.35,.06,V15M.glass,15.8,5.38,-8.3);
 v15Box(bridge,3.4,1.35,.06,V15M.glass,15.8,5.38,-10.9);
 v15Box(bridge,3.4,.14,2.7,V15M.obsidian,15.8,6.12,-9.6);
 v15Box(bridge,3.2,.05,.1,V15M.glowGold,15.8,4.48,-8.28);
 g.add(bridge);

 // Illuminated fin colonnade along the outer edge of the Premium Gallery wing
 for(const z of [-10.5,-7.5,-4.5,-1.5,1.5]){
  v15Box(g,.16,4.8,.32,V15M.champagne,32.55,2.6,z);
  v15Box(g,.06,4.4,.08,V15M.glowGold,32.68,2.6,z);
 }
}

// Tier 3: Kinetic Flagship Crown, Counter-Rotating Dual Halo & Executive Helipad
{
 const g=v15Tier(3);
 const crown=new THREE.Group();crown.name='grand-v15-kinetic-crown';
 crown.position.set(5.6,10.55,-10.2);
 const outerRing=new THREE.Mesh(new THREE.TorusGeometry(1.35,.075,10,48),V15M.champagne);
 const innerRing=new THREE.Mesh(new THREE.TorusGeometry(.92,.055,10,36),V15M.brushedSteel);
 const coreStar=new THREE.Mesh(new THREE.OctahedronGeometry(.38,0),V15M.champagne);
 crown.add(outerRing,innerRing,coreStar);
 grandV15.rings.push(outerRing,innerRing,coreStar);
 g.add(crown);

 // Executive VIP Helipad positioned cleanly on the far-right gallery terrace (outside car podium sightlines)
 const helipad=new THREE.Group();helipad.name='grand-v15-helipad';
 helipad.position.set(29.2,5.55,-9.2);
 v15Add(helipad,new THREE.CylinderGeometry(2.8,3.0,.16,32),V15M.obsidian,0,0,0);
 const padRing=v15Add(helipad,new THREE.TorusGeometry(2.35,.07,8,36),V15M.champagne,0,.1,0);
 padRing.rotation.x=Math.PI/2;
 // 'H' marking in brushed gold
 v15Box(helipad,.26,.04,1.8,V15M.glowGold,-.7,.1,0);
 v15Box(helipad,.26,.04,1.8,V15M.glowGold,.7,.1,0);
 v15Box(helipad,1.4,.04,.26,V15M.glowGold,0,.1,0);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;
  const beacon=v15Add(helipad,new THREE.SphereGeometry(.1,8,6),V15M.glowCyan,Math.cos(a)*2.6,.13,Math.sin(a)*2.6);
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
