// V11 showroom facelift: curved metallic architecture and locally generated brand sign.
// GPU-light spline trims and baked canvas signage, no dynamic lights or network textures.
const showroomV11=new THREE.Group();showroomV11.name='showroom-v11-facade';scene.add(showroomV11);
function v11CurvedFrame(points,hex,r=.08){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
 const m=new THREE.Mesh(new THREE.TubeGeometry(curve,30,r,7,false),M(hex,{metalness:.72,roughness:.28}));
 m.castShadow=true;showroomV11.add(m);return m;
}
// The long raised edge forms a sculpted canopy, not another rectangular roof slab.
v11CurvedFrame([[-15.5,4.45,3.2],[-11,4.8,3.6],[0,5.08,3.7],[11,4.8,3.6],[15.5,4.45,3.2]],0xe9c27a,.08);
v11CurvedFrame([[-15.5,4.45,3.2],[-15.3,4.8,-.8],[-15.3,4.7,-6.4],[-15,4.45,-11.2]],0xc7a774,.095);
v11CurvedFrame([[15.5,4.45,3.2],[15.3,4.8,-.8],[15.3,4.7,-6.4],[15,4.45,-11.2]],0xc7a774,.095);
// Slim sunshade fins signal a glass-fronted building without obscuring the playing area.
for(const x of [-13,-9,-5,5,9,13]){
 const fin=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,2.5,9),M(0x446271,{metalness:.55,roughness:.38}));
 fin.position.set(x,2.72,2.2);fin.castShadow=true;showroomV11.add(fin);
}
const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=256;
const ctx=signCanvas.getContext('2d');
ctx.fillStyle='#123346';ctx.fillRect(0,0,1024,256);
const fade=ctx.createLinearGradient(0,0,1024,0);fade.addColorStop(0,'#b88945');fade.addColorStop(.5,'#fce2a2');fade.addColorStop(1,'#b88945');
ctx.fillStyle=fade;ctx.fillRect(24,23,976,3);ctx.fillRect(24,230,976,3);
ctx.fillStyle='#f7d997';ctx.font='bold 108px system-ui, sans-serif';ctx.textAlign='center';ctx.fillText('AUTO EMPIRE',512,140);
ctx.font='600 34px system-ui, sans-serif';ctx.fillStyle='#d7e4e5';ctx.fillText('PREMIUM MOTORS',512,194);
const signTexture=new THREE.CanvasTexture(signCanvas);signTexture.encoding=THREE.sRGBEncoding;
const signFrame=new THREE.Mesh(new THREE.PlaneGeometry(11.3,2.75),new THREE.MeshBasicMaterial({color:0x123346,side:THREE.DoubleSide}));
signFrame.position.set(0,5.66,3.49);showroomV11.add(signFrame);
const signText=new THREE.Mesh(new THREE.PlaneGeometry(11.1,2.6),new THREE.MeshBasicMaterial({map:signTexture,transparent:false,side:THREE.DoubleSide}));
signText.position.set(0,5.66,3.53);showroomV11.add(signText);
const leftLogo=new THREE.Mesh(new THREE.TorusGeometry(.65,.14,9,32),M(0xe8ba69,{metalness:.75,roughness:.2}));
leftLogo.position.set(-13,5.62,3.49);showroomV11.add(leftLogo);
const rightLogo=leftLogo.clone();rightLogo.position.x=13;showroomV11.add(rightLogo);
