// ---------- khởi tạo
for(let i=0;i<S.staff;i++)addStaff(i);
slots.forEach((d,i)=>{const s=(S.disp||[])[i];if(i<NSL()&&s&&CARS[s.replace('*','')]){d.nextBasis=Math.max(1,Math.min(CARS[s.replace('*','')].cost*2,Number(S.displayData[i]?.basis)||CARS[s.replace('*','')].cost));mount(d,s.replace('*',''),s.endsWith('*'))};d.t=0});
applyVis();claimOffline();fillSlots();fit();setQuality();save(true);
addEventListener('pagehide',()=>{updRpm();save(true);try{if(ownSave())localStorage.removeItem('aet6-owner')}catch(e){}});addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){updRpm();save(true)}else{claimOffline();sales.length=0;t0=performance.now();last=performance.now()}});
setInterval(()=>{lease();if(!owner){$('mt').textContent='Game đang mở ở tab khác';$('mp').textContent='Đóng tab kia rồi tải lại tab này để tiếp tục từ bản lưu mới nhất.';$('modal').style.display='flex';return}if(document.hidden)return;updRpm();save()},5000);
let last=performance.now(),hudT=0,tm=0;
function loop(n){requestAnimationFrame(loop);let elapsed=Math.min(1,Math.max(0,(n-last)/1000));last=n;qualityClock+=elapsed;qualityFrames++;if(qualityClock>5){if(S.quality==='auto'){const fps=qualityFrames/qualityClock;const minDpr=Math.min(devicePixelRatio,1.75),maxDpr=Math.min(devicePixelRatio,2.5);const next=Math.max(minDpr,Math.min(maxDpr,adaptiveDpr+(fps<35?-.15:fps>55?.1:0)));if(Math.abs(next-adaptiveDpr)>.01){adaptiveDpr=next;setQuality()}}qualityClock=0;qualityFrames=0}if(document.hidden||!owner)return;
 while(elapsed>0){const dt=Math.min(.05,elapsed);simulate(dt);elapsed-=dt}
 updCam();ren.render(scene,cam)}
function simulate(dt){tm+=dt;updateOrders(dt);if(S.used>0){S.usedTimer=(S.usedTimer||0)+dt;if(S.usedTimer>=40){S.usedTimer=0;S.used--;S.money+=2600;S.rev+=2600;S.profit+=800;S.sold++;recordIncome('cars',800);addXP(10+2600/150);sales.push([performance.now(),800]);toast('Đã bán xe cũ: lãi $800');save()}}
 if(S.training>0){S.training=Math.max(0,S.training-dt);if(S.training===0&&S.trainingPending){S.train=Math.min(12,S.train+1);S.trainingPending=false;toast('Đào tạo hoàn tất!');save()}}
 if(S.mkt>0)S.mkt=Math.max(0,S.mkt-dt);
 spawnT-=dt;if(spawnT<=0){spawn();spawnT=[20,16,13][S.park-1]*(.8+R()*.4)*(1-S.rep/400)*(S.mkt>0?.6:1)}
 custs.forEach(c=>updC(c,dt));for(let i=custs.length-1;i>=0;i--)if(custs[i].dead)custs.splice(i,1);
 staff.forEach(s=>updS(s,dt));updG(dt);if(mech)anim(mech,{mv:false,act:!!gj&&gj.st=='FIX'},tm);
 warnT-=dt;slots.forEach((d,i)=>{if(i>=NSL())return;if(!d.car){d.t-=dt;if(d.t<=0){if(!restock(d)){d.t=2;if(warnT<=0&&STK()==0){warnT=40;toast('Kho hết xe, hãy nhập thêm ở mục Kho xe')}}}}else if(d.sc<1){d.sc=Math.min(1,d.sc+dt*1.2);d.mesh.scale.setScalar(d.sc)}});
 custs.forEach(c=>{if(c.per&&c.m===c.per)anim(c.per,c,tm)});staff.forEach(s=>anim(s.m,s,tm));
 PT.forEach(q=>{if(q.l>0){q.l-=dt;q.v.y-=12*dt;q.m.position.x+=q.v.x*dt;q.m.position.y+=q.v.y*dt;q.m.position.z+=q.v.z*dt;if(q.l<=0)q.m.visible=false}});
 traffic.forEach(o=>{o.m.position.x-=o.sp*dt;if(o.m.position.x<-45)o.m.position.x=45});clouds.forEach(c=>{c.position.x+=dt*.8;if(c.position.x>70)c.position.x=-70});trees.forEach((t,i)=>t.rotation.z=Math.sin(tm*.8+i)*.02);updateShowcase(dt);updateV11Preview(dt);updateV12City(dt);updateGrandDealershipV13(dt);updateGrandShowroomV14(dt);updateGrandHorizonV15(dt);updateEmpireV16(dt);
 hudT-=dt;if(hudT<=0){hudT=.4;hud()}
 }
requestAnimationFrame(loop);
window.addEventListener('error',e=>{const t=$('toast');t.textContent='Lỗi JS: '+e.message;t.style.opacity=1});
