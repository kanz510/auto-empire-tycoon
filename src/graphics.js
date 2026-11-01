// ---------- cảnh
const ren=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});ren.setPixelRatio(Math.min(devicePixelRatio,1.5));ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;ren.outputEncoding=THREE.sRGBEncoding;document.body.prepend(ren.domElement);
let adaptiveDpr=Math.min(devicePixelRatio,1.5),qualityClock=0,qualityFrames=0;
function setQuality(){ren.setPixelRatio(S.quality==='eco'?1:S.quality==='high'?Math.min(devicePixelRatio,1.75):adaptiveDpr);ren.shadowMap.enabled=S.quality!=='eco';fit()}
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9fd4f0);scene.fog=new THREE.Fog(0x9fd4f0,95,170);
scene.add(new THREE.HemisphereLight(0xdff1ff,0x6a8f5a,.7));
const sun=new THREE.DirectionalLight(0xfff0d0,.85);sun.position.set(25,40,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38,far:120});scene.add(sun);
const fill=new THREE.DirectionalLight(0x9ec8ff,.25);fill.position.set(-20,15,-10);scene.add(fill);
const cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,300);let zoom=1,T=new V(0,0,2),TT=T.clone();
function fit(){ren.setSize(innerWidth,innerHeight);const a=innerWidth/innerHeight,W=(a<1?36:54)/zoom,H=W/a;cam.left=-W/2;cam.right=W/2;cam.top=H/2;cam.bottom=-H/2;cam.updateProjectionMatrix()}
addEventListener('resize',fit);
const box=(w,h,d,c,x,y,z,o)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c,o));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;return m};
const hit=[];function key(g,k){g.traverse(o=>o.userData.key=k);hit.push(g);scene.add(g);return g}
scene.add(box(160,1,160,0x7cc36a,0,-.5,0),box(160,.1,4.4,0x3a3f47,0,.05,12.7));
for(let x=-70;x<70;x+=4)scene.add(box(1.8,.02,.2,0xffffff,x,.11,12.7));
const park=new THREE.Group();park.add(box(30,.12,8,0x555b66,0,.06,6.6));
const PX=[-2,2,-6,6,-10,10],pmark=PX.map(x=>{const a=box(.12,.02,4.4,0xffffff,x+2,.14,7),b=box(.12,.02,4.4,0xffffff,x-2,.14,7);park.add(a,b);return[a,b]});key(park,'park');
const sh=new THREE.Group(),tc=document.createElement('canvas');tc.width=tc.height=64;const tx=tc.getContext('2d');tx.fillStyle='#eef2f7';tx.fillRect(0,0,64,64);tx.fillStyle='#cfd8e3';tx.fillRect(0,0,32,32);tx.fillRect(32,32,32,32);
const tex=new THREE.CanvasTexture(tc);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(15,6.5);
const fl=box(30,.3,13,0xffffff,0,.15,-4.5);fl.material=new THREE.MeshStandardMaterial({map:tex,roughness:.12,metalness:.25});sh.add(fl,box(30,4.5,.4,0xb0bec5,0,2.25,-11));
[-9,0,9].forEach(x=>sh.add(box(6,.25,.1,0xffffff,x,3.6,-10.7,{emissive:0xffffff})));
const glass={transparent:true,opacity:.22,roughness:.05,metalness:.2};
sh.add(box(13.5,3.4,.2,0x9fd8ff,-8.25,1.9,2,glass),box(13.5,3.4,.2,0x9fd8ff,8.25,1.9,2,glass),box(.2,3.4,13,0x9fd8ff,-15,1.9,-4.5,glass),box(.2,3.4,13,0x9fd8ff,15,1.9,-4.5,glass),
 box(31,.5,.5,0x37474f,0,3.8,2),box(31,.4,.5,0x37474f,0,.4,2),box(31,.2,3,0x263238,0,4.2,3.2,{transparent:true,opacity:.8}));
function textSign(text,w,h){const c=document.createElement('canvas');c.width=512;c.height=128;const t=c.getContext('2d');t.fillStyle='#152b45';t.fillRect(0,0,512,128);t.fillStyle='#ffd564';t.font='bold 48px sans-serif';t.textAlign='center';t.fillText(text,256,83);const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}))}
const brand=textSign('AUTO EMPIRE',9.7,1.4);brand.position.set(0,5.4,2.22);sh.add(brand);
const sign=box(10,1.6,.4,0xffffff,0,5.4,2,{emissive:0x666666});sh.add(sign);
const u2=new THREE.Group();[-13,13].forEach(x=>u2.add(box(1,.8,1,0x6d4c41,x,.7,0),box(1.6,1.6,1.6,0x2e9e4f,x,1.8,0)));u2.add(box(5,.04,3,0x1e3a8a,0,.34,-1));
const u3=new THREE.Group();[-14,14].forEach(x=>u3.add(box(.8,4,.8,0xffd54f,x,2.2,-10.4,{metalness:.8,roughness:.2})));u3.add(box(3,3,.3,0xffd54f,0,3,-10.6,{metalness:.8,roughness:.2,emissive:0x7a5a00}));sh.add(u2,u3);
const SP=[[-3,-4],[3,-4],[-9,-4],[9,-4],[-3,-8.5],[3,-8.5]],PD=new THREE.CylinderGeometry(2.7,2.7,.15,24),ped=SP.map(p=>{const m=new THREE.Mesh(PD,M(0x37474f,{roughness:.2,metalness:.5}));m.position.set(p[0],.38,p[1]);m.receiveShadow=true;sh.add(m);return m});
[-15,15].forEach(x=>[-10,-4,1].forEach(z=>sh.add(box(.16,3.6,.16,0x27405a,x,1.9,z))));
 const lounge=new THREE.Group();lounge.add(box(3,.55,1.1,0x217d91,-11,.65,-8),box(3,.8,.2,0x217d91,-11,1.15,-8.5),box(1.5,.12,1,0xd9b879,-11,.65,-6.6));sh.add(lounge);
 const wing=new THREE.Group();wing.add(box(12,.3,13,0xdde8ec,21,.15,-4.5),box(12,4.5,.3,0x27405a,21,2.25,-11));[-9,-4,1].forEach(z=>wing.add(box(.22,4,.22,0xe1c499,27,2,z)));const wingSign=textSign('PREMIUM GALLERY',10,1.3);wingSign.position.set(21,4.4,1);wing.add(wingSign);sh.add(wing);
const oldVis=applyVis;applyVis=function(){oldVis();wing.visible=S.show>=2;wing.scale.x=S.show>=3?1.35:1};
key(sh,'show');
const ctr=new THREE.Group();ctr.add(box(4,1.1,1,0x1565c0,12,.65,-1.6),box(4.2,.12,1.2,0xeeeeee,12,1.25,-1.6),box(.7,.5,.1,0x222222,12.5,1.6,-1.6));key(ctr,'staff');
const trees=[];[[-20,-14],[20,-12],[-18,17],[22,18],[0,-16],[-8,-16],[9,-16]].forEach(p=>{const g=new THREE.Group();g.add(box(.4,1.4,.4,0x6d4c41,0,.7,0));const c=new THREE.Mesh(new THREE.ConeGeometry(1.5,3.5,7),M(0x2e8b57));c.position.y=3;c.castShadow=true;g.add(c);g.position.set(p[0],0,p[1]);scene.add(g);trees.push(g)});
const lamps=new THREE.Group();[[-14,10],[14,10],[0,10]].forEach(p=>lamps.add(box(.2,4,.2,0x444444,p[0],2,p[1]),box(.8,.3,.8,0xfff59d,p[0],4.1,p[1],{emissive:0xfff59d})));scene.add(lamps);
const bb=new THREE.Group();bb.add(box(.3,5,.3,0x555555,-22,2.5,9),box(.3,5,.3,0x555555,-17,2.5,9),box(7,3,.3,0xe53935,-19.5,6,9,{emissive:0x551111}));scene.add(bb);
const tdG=new THREE.Group();tdG.add(box(12,.1,16,0x3a3f47,22.5,.05,-2),box(5,.14,9,0x7cc36a,22.5,.06,-2),box(2.2,.1,1.4,0xffc107,17.5,.12,3.8),box(.3,3,.3,0x555555,16,1.5,5.5),box(3,1,.2,0xffc107,16,3.2,5.5,{emissive:0x553d00}));key(tdG,'show');
const garG=new THREE.Group();garG.add(box(9,.2,7,0x607d8b,-23,.1,-2.5),box(9,4,.3,0x90a4ae,-23,2,-6),box(.3,4,7,0x90a4ae,-27.4,2,-2.5),box(.3,4,7,0x90a4ae,-18.6,2,-2.5),box(6,1,.3,0xe53935,-23,4.5,.8,{emissive:0x441111}),box(1.2,.8,.8,0xffa000,-26,.6,-5),box(.8,1.8,.8,0x455a64,-19.5,1.1,-5));key(garG,'show');
let gj=null,gT=10,mech=null,tdBusy=0;
const traffic=[0xeeeeee,0x546e7a,0xc62828].map((c,i)=>{const m=makeCar(['sedan','hatch','suv'][i],c);m.position.set(30-i*28,0,14.4);m.rotation.y=Math.PI;scene.add(m);return{m,sp:5+i}});
const clouds=[0,1,2,3,4].map(i=>{const g=new THREE.Group();[0,1,2].forEach(j=>{const s=new THREE.Mesh(new THREE.SphereGeometry(3+j,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85}));s.position.x=j*3.2;s.scale.y=.5;g.add(s)});g.position.set(-60+i*28,28,-45);scene.add(g);return g});
const PT=[],pg=new THREE.SphereGeometry(.12,6,4),pmt=new THREE.MeshBasicMaterial({color:0xffd54f});
for(let i=0;i<24;i++){const m=new THREE.Mesh(pg,pmt);m.visible=false;scene.add(m);PT.push({m,v:new V(),l:0})}
function burst(p){let n=0;PT.forEach(q=>{if(q.l<=0&&n<12){n++;q.l=1;q.m.visible=true;q.m.position.set(p.x,2,p.z);q.v.set((R()-.5)*5,4+R()*3,(R()-.5)*5)}})}
// ---------- camera (đã sửa lệch kéo)
function updCam(){T.lerp(TT,.12);cam.position.copy(T).add(new V(1,1.05,1).multiplyScalar(45));cam.lookAt(T)}
const ptr=new Map(),cvs=ren.domElement,ray=new THREE.Raycaster(),RT=new V(1,0,-1).normalize(),FW=new V(-1,0,-1).normalize();let down=null,pd=0;
cvs.addEventListener('pointerdown',e=>{cvs.setPointerCapture(e.pointerId);ptr.set(e.pointerId,[e.clientX,e.clientY]);down=[e.clientX,e.clientY,0];if(ptr.size==2){const p=[...ptr.values()];pd=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);down[2]=99}audio()});
cvs.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;const o=ptr.get(e.pointerId),dx=e.clientX-o[0],dy=e.clientY-o[1];ptr.set(e.pointerId,[e.clientX,e.clientY]);
 if(ptr.size==2){const p=[...ptr.values()],d=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);if(pd>0){zoom=Math.max(.6,Math.min(2.4,zoom*d/pd));fit()}pd=d;if(down)down[2]=99}
 else if(down){down[2]+=Math.abs(dx)+Math.abs(dy);if(down[2]<8)return;const s=(cam.top-cam.bottom)/innerHeight;TT.addScaledVector(RT,-dx*s).addScaledVector(FW,dy*s*1.68);TT.x=Math.max(-28,Math.min(28,TT.x));TT.z=Math.max(-14,Math.min(16,TT.z));T.copy(TT)}});
const endp=e=>{if(!ptr.has(e.pointerId))return;ptr.delete(e.pointerId);if(down&&down[2]<8&&ptr.size==0)tap(e.clientX,e.clientY);if(ptr.size==0)down=null;else if(down)down[2]=99};
cvs.addEventListener('pointerup',endp);cvs.addEventListener('pointercancel',e=>{ptr.delete(e.pointerId);if(!ptr.size)down=null});
function tap(x,y){ray.setFromCamera({x:x/innerWidth*2-1,y:-(y/innerHeight)*2+1},cam);const h=ray.intersectObjects(hit,true);if(h.length){let k=h[0].object.userData.key;focus(k);openP(k=='park'?'show':k)}else closeP()}
const FOC={show:[0,-3],park:[0,7],staff:[0,0],inv:[0,-3]};function focus(k){if(FOC[k])TT.set(FOC[k][0],0,FOC[k][1])}
let ac;function audio(){if(!ac)try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}if(ac&&ac.state=='suspended')ac.resume()}
function beep(f,d){if(!ac||!S.snd)return;const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.value=.12;g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(e.h);e.h=setTimeout(()=>e.style.opacity=0,2200)}
function popup(t,p){$('mt').textContent=t;$('mp').innerHTML=p;$('modal').style.display='flex'}
