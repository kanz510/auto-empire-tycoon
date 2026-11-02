// ---------- trạng thái & lưu
const mkDef=()=>({money:5000,gems:0,xp:0,lvl:1,show:1,park:1,spd:1,staff:1,sold:0,served:0,rev:0,profit:0,rpm:0,t:Date.now(),snd:1,inv:{hatch:0,sedan:0,suv:0,sport:0},rep:20,vip:0,mkt:0,mi:0,auto:1,bought:0,mktN:0,disp:[],td:0,gar:0,tdN:0,garN:0});
const DEF=mkDef();let S=mkDef();
function readProgress(){for(const key of ['aet6','aet6-backup','aet5','aet1']){try{const o=JSON.parse(localStorage.getItem(key)||'null');if(o&&typeof o==='object'&&!Array.isArray(o)&&Number.isFinite(Number(o.money))&&o.inv&&typeof o.inv==='object')return o}catch(e){}}return null}
const restored=readProgress();if(restored)Object.assign(S,restored);
S.inv=Object.assign({hatch:0,sedan:0,suv:0,sport:0},S.inv||{});
if(!S.ver){S.inv.hatch=Math.max(S.inv.hatch,2);S.ver=2}
['money','gems','xp','lvl','show','park','spd','staff','sold','served','rev','profit','rpm','rep','vip','mkt','mi','bought','mktN','td','gar','tdN','garN'].forEach(k=>{if(!isFinite(S[k]))S[k]=DEF[k]});
S.show=Math.min(3,Math.max(1,S.show));S.park=Math.min(3,Math.max(1,S.park));S.staff=Math.min(3,Math.max(1,S.staff));S.td=Math.min(3,Math.max(0,S.td));S.gar=Math.min(3,Math.max(0,S.gar));S.spd=Math.min(6,Math.max(1,S.spd));

// Normalize untrusted/corrupt saves before using counts, arrays or money.
for(const k of ['money','gems','xp','sold','served','rev','rpm','vip','mi','bought','mktN','tdN','garN','mkt']){
 S[k]=Math.min(1e12,Math.max(0,Number(S[k])||0));if(k!=='money'&&k!=='xp'&&k!=='rev'&&k!=='rpm'&&k!=='mkt')S[k]=Math.floor(S[k]);
}
for(const k of ['lvl','show','park','spd','staff','td','gar']) S[k]=Math.floor(S[k]);
S.lvl=Math.max(1,Math.min(1000,S.lvl));S.mi=Math.min(10,Math.floor(S.mi));
S.rep=Math.max(0,Math.min(100,Number(S.rep)||0));S.auto=S.auto?1:0;
S.disp=Array.isArray(S.disp)?S.disp.slice(0,6).map(x=>typeof x==='string'?x:''):[];
for(const k of KS)S.inv[k]=Math.max(0,Math.min(28,Math.floor(Number(S.inv[k])||0)));
S.t=Number.isFinite(Number(S.t))?Math.min(Date.now(),Number(S.t)):Date.now();
S.policy=['balanced','value','premium'].includes(S.policy)?S.policy:'balanced';
S.satisfaction=Math.max(0,Math.min(100,Number(S.satisfaction)||75));
S.rescueAt=Number(S.rescueAt)||0;
if(Number.isFinite(S.garEscrow)&&S.garEscrow>0){S.money+=Math.min(1800,S.garEscrow);S.garEscrow=0}
S.profit=Number.isFinite(Number(S.profit))?Number(S.profit):0;
S.schema=6;
S.train=Math.max(0,Math.min(12,Math.floor(Number(S.train)||0)));
S.training=Math.max(0,Math.min(30,Number(S.training)||0));
S.ops=Math.max(0,Number(S.ops)||0);
S.pricing=Object.fromEntries(KS.map(k=>[k,Math.max(.85,Math.min(1.2,Number(S.pricing?.[k])||1))]));
S.basis=Object.fromEntries(KS.map(k=>[k,Math.max(1,Math.min(CARS[k].cost*2,Number(S.basis?.[k])||CARS[k].cost))]));
S.displayData=Array.isArray(S.displayData)?S.displayData.slice(0,6):[];
S.stats=Object.fromEntries(['cars','garage','test','offline'].map(k=>[k,Math.max(0,Number(S.stats?.[k])||0)]));
S.history=Array.isArray(S.history)?S.history.filter(x=>x&&Number.isFinite(x.hour)&&Number.isFinite(x.profit)).slice(-24):[];
S.quality=['auto','eco','high'].includes(S.quality)?S.quality:'auto';
const tabId=Date.now().toString(36)+Math.random().toString(36).slice(2);
let owner=true,storageOK=true;
function ownSave(){try{const lease=JSON.parse(localStorage.getItem('aet6-owner')||'null');return !lease||lease.id===tabId||Date.now()-lease.at>15000}catch(e){return true}}
function lease(){if(!ownSave()){owner=false;return}try{localStorage.setItem('aet6-owner',JSON.stringify({id:tabId,at:Date.now()}))}catch(e){storageOK=false}}
lease();
function market(k){const i=KS.indexOf(k),epoch=Math.floor(Date.now()/600000);return {buy:1+.035*Math.sin(epoch*1.71+i*2),sell:1+.055*Math.sin(epoch*.83+i*1.9),demand:1+.2*Math.sin(epoch*.83+i*1.9)}}
function choosePreferred(keys){let n=R()*keys.reduce((a,k)=>a+market(k).demand,0);for(const k of keys){n-=market(k).demand;if(n<=0)return k}return keys[0]}
function stockCost(k){return Math.round(CARS[k].cost*market(k).buy)}
function recordIncome(type,profit){S.stats[type]+=profit;const hour=Math.floor(Date.now()/3600000);let row=S.history.find(x=>x.hour===hour);if(!row){row={hour,profit:0};S.history.push(row);S.history=S.history.slice(-24)}row.profit+=profit}
function recordExpense(cost){S.ops+=cost;const hour=Math.floor(Date.now()/3600000);let row=S.history.find(x=>x.hour===hour);if(!row){row={hour,profit:0};S.history.push(row);S.history=S.history.slice(-24)}row.profit-=cost}
function trainCost(){return Math.round(1200*Math.pow(1.65,S.train))}
function startTraining(){if(S.training||S.train>=12||S.money<trainCost())return;const cost=trainCost();S.money-=cost;recordExpense(cost);S.training=30;S.trainingPending=true;save();refreshP(1)}
function adjustPrice(k,step){if(!CARS[k])return;S.pricing[k]=Math.max(.85,Math.min(1.2,Math.round((S.pricing[k]+step)*100)/100));save();refreshP(1)}
S.used=Math.max(0,Math.min(3,Math.floor(Number(S.used)||0)));S.usedTimer=Math.max(0,Math.min(40,Number(S.usedTimer)||0));S.orders=Array.isArray(S.orders)?S.orders.filter(o=>o&&!o.done&&CARS[o.k]).slice(0,3):[];S.orderId=Number(S.orderId)||0;
function buyUsed(){const cost=1800;if(S.money<cost||S.used>=3)return;S.money-=cost;S.used++;save();refreshP(1)}
function orderCar(){if(S.orders.length>=3)return;const un=KS.filter(x=>CARS[x].lv<=S.show),k=un[Math.floor(R()*un.length)];S.orders.push({id:++S.orderId,k,elapsed:0});save();refreshP(1)}
function updateOrders(dt){for(const o of S.orders){o.elapsed+=dt;if(o.elapsed>=45&&S.inv[o.k]>0){S.inv[o.k]--;const income=Math.round(CARS[o.k].price*1.12),profit=income-S.basis[o.k];S.money+=income;S.profit+=profit;S.rev+=income;S.sold++;recordIncome('cars',profit);if(typeof addXP==='function')addXP(10+income/150);if(typeof sales!=='undefined')sales.push([performance.now(),profit]);o.done=true;toast('Giao đơn đặt '+CARS[o.k].n+' · '+fm(income));save()}}S.orders=S.orders.filter(o=>!o.done)}
const fm=n=>'$'+Math.floor(n).toLocaleString('en-US'),need=l=>Math.round(120*Math.pow(l,1.5));
let resetting=false;
function save(f){if(resetting||!owner||!ownSave())return false;if(f||!document.hidden)S.t=Date.now();S.displayData=slots.map(d=>({basis:d.basis||0}));S.garEscrow=gj?gj.bc:0;S.disp=slots.map(d=>d.car?d.car+(d.cons?'*':''):'');try{const raw=JSON.stringify(S);localStorage.setItem('aet6',raw);localStorage.setItem('aet6-backup',raw);storageOK=true;return true}catch(e){storageOK=false;toast('Không lưu được: bộ nhớ trình duyệt bị chặn hoặc đầy')}}
