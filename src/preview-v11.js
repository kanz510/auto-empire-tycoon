// Visual-only sandbox for real iPhone testing. Never mutate S or localStorage.
const v11DemoRoot=new THREE.Group();v11DemoRoot.name='v11-preview-actors';scene.add(v11DemoRoot);
let v11DemoClock=0,v11DemoCrowd=[],v11DemoTier=null;
function v11SetPreviewTier(level){
 v11DemoTier=level;
 showroomLevelTwo.visible=level>=2;
 showroomLevelThree.visible=level>=3;
 const status=document.getElementById('preview-status');
 if(status)status.textContent='Xem showroom cấp '+level+' · Không lưu';
}
function v11PreviewCrowd(){
 v11DemoRoot.clear();v11DemoCrowd=[];
 const colors=[0x1976d2,0xffc107,0x43a047,0xff7043,0xffc107,0x9c27b0];
 const coords=[[-8,-8],[-6,-5],[4,-8],[8,-5],[-2,-2],[11,-8]];
 coords.forEach(([x,z],i)=>{
  const p=person(colors[i],i===1||i===4);
  p.position.set(x,0,z);p.rotation.y=(i%3)*Math.PI*.6;
  v11DemoRoot.add(p);
  v11DemoCrowd.push({m:p,i,origin:x,depth:z});
 });
 const status=document.getElementById('preview-status');
 if(status)status.textContent=v11DemoCrowd.length+' khách và nhân viên demo · Không lưu';
}
function v11ClearPreview(){
 v11DemoCrowd.forEach(a=>{const mixer=a.m.userData.characterMixer;if(mixer){mixer.stopAllAction();mixer.uncacheRoot(a.m.userData.characterVisual)}});
 v11DemoRoot.clear();v11DemoCrowd=[];
 v11DemoTier=null;applyVis();
 const status=document.getElementById('preview-status');
 if(status)status.textContent='Đã về cảnh thật · Tiến trình an toàn';
}
function updateV11Preview(dt){
 if(!v11DemoCrowd.length)return;
 v11DemoClock+=dt;
 v11DemoCrowd.forEach(a=>{
  const phase=v11DemoClock*.55+a.i*1.32,moving=Math.sin(phase)>-.25;
  a.m.position.x=a.origin+(moving?Math.sin(phase)*.65:0);
  a.m.position.z=a.depth+(moving?Math.cos(phase)*.33:0);
  a.m.rotation.y=Math.sin(phase)*.85;
  anim(a.m,{mv:moving,act:!moving,ph:a.i},v11DemoClock);
 });
}
if(new URLSearchParams(location.search).has('preview')){
 const box=document.createElement('section');box.id='v11-preview-panel';
 box.setAttribute('aria-label','Chế độ thử đồ họa');
 box.style.cssText='position:fixed;right:8px;top:calc(env(safe-area-inset-top,0px) + 200px);z-index:85;width:150px;background:rgba(15,38,57,.93);border:1px solid #d5ae69;color:#fff;border-radius:14px;padding:9px;box-shadow:0 6px 20px #0005;font:600 12px system-ui,sans-serif';
 box.innerHTML='<div style="color:#fbd58c;font-size:13px;padding-bottom:6px">🧪 TEST CẢNH V11</div><div style="display:flex;flex-wrap:wrap;gap:5px">'+
  '<button id="preview-tier-1" type="button">Cấp 1</button><button id="preview-tier-2" type="button">Cấp 2</button><button id="preview-tier-3" type="button">Cấp 3</button>'+
  '<button id="preview-crowd" type="button">Đông khách</button><button id="preview-clear" type="button">Cảnh thật</button></div>'+
  '<div id="preview-status" style="font-size:10px;line-height:1.4;color:#d0e7e6;margin-top:7px">Chỉ xem, không lưu vào game</div>';
 document.body.append(box);
 box.querySelectorAll('button').forEach(b=>b.style.cssText='color:#fff;border:1px solid #658390;background:#2b4d60;padding:6px;border-radius:7px;font-size:11px;font-weight:600;touch-action:manipulation');
 for(let level=1;level<=3;level++)document.getElementById('preview-tier-'+level).onclick=()=>v11SetPreviewTier(level);
 document.getElementById('preview-crowd').onclick=v11PreviewCrowd;
 document.getElementById('preview-clear').onclick=v11ClearPreview;
}
