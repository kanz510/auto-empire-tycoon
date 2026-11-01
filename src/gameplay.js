// ---------- nhiệm vụ
const MIS=[{t:'Bán 5 xe',k:'sold',n:5,r:1000},{t:'Nhập thêm 3 xe vào kho',k:'bought',n:3,r:800},{t:'Nâng Showroom lên cấp 2',k:'show',n:2,r:3000},{t:'Phục vụ 1 khách VIP',k:'vip',n:1,r:2500},{t:'Chạy quảng cáo 1 lần',k:'mktN',n:1,r:1500},{t:'Tuyển nhân viên thứ 2',k:'staff',n:2,r:3000},{t:'Đạt danh tiếng 50',k:'rep',n:50,r:5000},{t:'Bán 50 xe',k:'sold',n:50,r:10000},{t:'Xây khu lái thử',k:'td',n:1,r:4000},{t:'Xây khu sửa chữa',k:'gar',n:1,r:5000}];
const MV=()=>({sold:S.sold,bought:S.bought,show:S.show,vip:S.vip,mktN:S.mktN,staff:S.staff,rep:S.rep,td:S.td,gar:S.gar});
function chkMis(){while(S.mi<MIS.length&&MV()[MIS[S.mi].k]>=MIS[S.mi].n){const m=MIS[S.mi++];S.money+=m.r;S.gems+=2;popup('Hoàn thành nhiệm vụ!',m.t+'<br>Thưởng: <b>'+fm(m.r)+'</b> + 2 KC');beep(523,.1);setTimeout(()=>beep(784,.1),100);setTimeout(()=>beep(1046,.25),200)}}
// ---------- xe trưng bày
const slots=SP.map((p,i)=>{const r2=i>=4,sg=Math.sign(p[0]);return{x:p[0],z:p[1],car:null,t:0,res:null,mesh:null,sc:1,cons:false,ax:r2?sg*.5:p[0],az:r2?-8.5:-2.2,sx:r2?-sg*.5:p[0]+1.2,r2}});
function mount(d,k,cons){d.basis=d.nextBasis||CARS[k].cost;d.nextBasis=0;d.car=k;d.cons=cons;d.mesh=makeCar(k);d.mesh.position.set(d.x,.45,d.z);d.sc=.05;d.mesh.scale.setScalar(.05);scene.add(d.mesh)}
function restock(d){let k=null,cons=false;const un=KS.filter(x=>CARS[x].lv<=S.show),st=un.filter(x=>S.inv[x]>0);
 if(st.length){k=st[(S.sold+slots.filter(x=>x.car).length)%st.length];d.nextBasis=S.basis[k];S.inv[k]--}
 else if(S.auto){const aff=un.filter(x=>stockCost(x)<=S.money*.6 && S.money-stockCost(x)>=500);if(aff.length){k=aff[(S.sold+slots.filter(x=>x.car).length)%aff.length];d.nextBasis=stockCost(k);S.money-=d.nextBasis;S.bought++}}
 if(!k&&STK()==0&&!slots.some(x=>x.car)){if(S.auto&&S.money>=stockCost('hatch')){k='hatch';d.nextBasis=stockCost(k);S.money-=d.nextBasis;S.bought++}}
 if(!k&&S.auto&&S.money<3000&&STK()===0&&!slots.some(x=>x.car)&&Date.now()-S.rescueAt>60000){k='hatch';cons=true;S.rescueAt=Date.now();toast('Đối tác gửi 1 xe ký gửi: bạn nhận phần lãi khi bán')}if(!k)return false;mount(d,k,cons);return true}
function fillSlots(){slots.forEach((d,i)=>{if(i<NSL()&&!d.car)restock(d)})}
