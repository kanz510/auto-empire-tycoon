// ---------- kinh tế
const MAXL={show:3,park:3,spd:6,hire:3,td:3,gar:3},LVL=()=>({show:S.show,park:S.park,spd:S.spd,hire:S.staff,td:S.td,gar:S.gar});
const COST={show:()=>[10000,30000][S.show-1],park:()=>[4500,15000][S.park-1],spd:()=>Math.round(2500*Math.pow(1.8,S.spd-1)),hire:()=>[6000,16000][S.staff-1],td:()=>[8000,20000,40000][S.td],gar:()=>[12000,25000,50000][S.gar]};
const NSL=()=>[2,4,6][S.show-1],NPK=()=>[2,4,6][S.park-1],CAP=()=>[12,20,28][S.show-1],STK=()=>KS.reduce((a,k)=>a+S.inv[k],0);
function addRep(n){S.rep=Math.max(0,Math.min(100,S.rep+n))}
function addXP(x){S.xp+=x;while(S.xp>=need(S.lvl)){S.xp-=need(S.lvl);S.lvl++;S.gems+=3;toast('Lên cấp '+S.lvl+'! +3 KC');beep(700,.2)}}
function up(k){if(!COST[k])return;if(LVL()[k]>=MAXL[k])return;const c=COST[k]();if(S.money<c){toast('Không đủ tiền');return}
 S.money-=c;if(k=='show')S.show++;if(k=='park')S.park++;if(k=='spd')S.spd++;if(k=='hire'){S.staff++;addStaff(S.staff-1)}if(k=='td')S.td++;if(k=='gar')S.gar++;
 applyVis();fillSlots();beep(660,.15);setTimeout(()=>beep(990,.2),120);toast('Nâng cấp thành công!');save();refreshP(1)}
function buyStock(k,n){if(!CARS[k]||!Number.isInteger(n)||n<1||n>5)return;const c=CARS[k];if(c.lv>S.show)return;if(STK()+n>CAP()){toast('Kho đầy ('+CAP()+' xe)');return}if(S.money<stockCost(k)*n){toast('Không đủ tiền');return}const paid=stockCost(k);S.basis[k]=(S.basis[k]*S.inv[k]+paid*n)/(S.inv[k]+n);S.money-=paid*n;S.inv[k]+=n;S.bought+=n;playDelivery();beep(520,.1);updateOrders(0);fillSlots();save();refreshP(1)}
function applyVis(){u2.visible=S.show>=2;u3.visible=S.show>=3;sign.material.color.set(S.show>=3?0xffd54f:S.show>=2?0x64b5f6:0xffffff);sign.material.emissive.set(S.show>=3?0x7a5a00:S.show>=2?0x103a66:0x555555);
 pmark.forEach((m,i)=>{m[0].visible=m[1].visible=i<NPK()});lamps.visible=S.park>=2;tdG.visible=S.td>0;garG.visible=S.gar>0;ped.forEach((p,i)=>p.visible=i<NSL())}
const sales=[];let t0=performance.now();
function updRpm(){const n=performance.now(),w=Math.min(300000,n-t0);if(w<60000)return;while(sales.length&&n-sales[0][0]>300000)sales.shift();const s=sales.reduce((a,b)=>a+b[1],0);S.rpm=S.rpm*.8+s/(w/60000)*.2}
function claimOffline(){const away=Math.max(0,(Date.now()-S.t)/1000);S.t=Date.now();S.training=Math.max(0,S.training-away);if(S.training===0&&S.trainingPending){S.train=Math.min(12,S.train+1);S.trainingPending=false}if(!(away>60)||!(S.sold>0))return;const sec=Math.min(away,7200),g=Math.floor(Math.max(0,Math.min(S.rpm,150000))*sec/60*.5);S.t=Date.now();
 if(g>0){S.money+=g;S.profit+=g;recordIncome('offline',g);popup('Chào mừng trở lại!','Vắng mặt '+Math.floor(sec/60)+' phút (tối đa 120).<br>Thu nhập offline (50% hiệu suất): <b>'+fm(g)+'</b>')}save(true)}
