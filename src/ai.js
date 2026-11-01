// ---------- chuyển động / AI
const ang=(a,b,t)=>{let d=b-a;d=Math.atan2(Math.sin(d),Math.cos(d));return a+d*Math.min(1,t)};
function follow(o,sp,dt,car){if(!o.path.length){o.mv=false;return true}const m=o.m,p=o.path[0],dx=p[0]-m.position.x,dz=p[1]-m.position.z,d=Math.hypot(dx,dz),st=sp*dt;
 if(d<=st){m.position.x=p[0];m.position.z=p[1];o.path.shift();o.mv=o.path.length>0;return !o.path.length}
 m.position.x+=dx/d*st;m.position.z+=dz/d*st;m.rotation.y=ang(m.rotation.y,car?Math.atan2(-dz,dx):Math.atan2(dx,dz),dt*8);if(car&&m.wheels)m.wheels.forEach(w=>w.userData.kenneyWheel?(w.rotation.x+=st/.38):(w.rotation.z-=st/.38));o.mv=true;return false}
const face=(m,x,z)=>{m.rotation.y=Math.atan2(x-m.position.x,z-m.position.z)};
const custs=[],pk=[0,0,0,0,0,0],staff=[];let ctrC=null,spawnT=1.5,warnT=0;
function spawn(){const free=[...Array(NPK()).keys()].filter(i=>!pk[i]);if(!free.length)return;const pi=free[R()*free.length|0];pk[pi]=1;
 const k=['hatch','sedan','suv'][R()*3|0],m=makeCar(k,[0xe53935,0x8e24aa,0x00acc1,0xfdd835,0xeeeeee,0x3949ab][R()*6|0]),vip=R()<.08+S.rep/600,un=KS.filter(x=>CARS[x].lv<=S.show);
 m.position.set(-36,0,12.5);scene.add(m);
 custs.push({st:'SPAWNING',pi,sx:PX[pi],car:m,m,path:[[PX[pi],12.5]],vip,pref:choosePreferred(un),bud:(3500+R()*8000*S.show*S.show)*(1+S.rep/200)*(vip?2.5:1),w:0,t:0,ph:R()*6,age:0})}
const inPath=(c,d)=>{const wx=c.sx+1.6,p=[[wx,3.5],[0,3.5],[0,2.5],[0,0]];if(d){if(d.r2)p.push([0,-6]);p.push([d.ax,d.az])}return p};
function outPath(c){const wx=c.sx+1.6,p=[];if(c.m.position.z<-5)p.push([0,-6]);p.push([0,.2],[0,2.5],[wx,3.5],[wx,7]);return p}
function leave(c){if(c.d&&c.d.res===c)c.d.res=null;c.st='LEAVING';c.sub='';c.act=false;c.path=outPath(c);c.per.dot.visible=false}
function forceLeave(c){if(c.st=='TESTDRIVE'&&(c.sub=='go'||c.sub=='drive')){tdBusy=Math.max(0,tdBusy-1);if(c.tdc){scene.remove(c.tdc);c.tdc=null;c.per.position.set(17.5,0,3.8);scene.add(c.per);c.m=c.per}}if(c.staff){c.staff.st='IDLE';c.staff.c=null;c.staff.path=[];c.staff=null}if(ctrC===c)ctrC=null;
 c.dr=0;if(c.per){c.m=c.per;leave(c);}else{if(c.d)c.d.res=null;c.dead=1;scene.remove(c.car);pk[c.pi]=0}}
function updC(c,dt){const kk=c.st+(c.sub||'');if(kk!==c.k){c.k=kk;c.age=0}else c.age+=dt;
 if((c.age>180&&c.st!='LEAVING')){forceLeave(c);return}if(c.st=='LEAVING'&&c.age>60){if(c.per)removeActor(c.per);scene.remove(c.car);pk[c.pi]=0;c.dead=1;return}
 switch(c.st){
 case'SPAWNING':if(follow(c,9,dt,1)){c.st='PARKING';c.path=[[c.sx,7]]}break;
 case'PARKING':if(follow(c,5,dt,1)){const p=person(c.vip?0xffc107:PC[R()*6|0],c.vip);p.position.set(c.sx+1.6,0,7);scene.add(p);c.per=p;c.m=p;
   reserveCar(c);c.path=inPath(c,c.d);c.st='WALKING';S.served++}break;
 case'WALKING':if(follow(c,2.6,dt)){c.st='BROWSING';c.t=0}break;
 case'BROWSING':c.t+=dt;if(c.d)face(c.m,c.d.x,c.d.z);if(c.t>2.5){if(c.d){if(S.td>0&&tdBusy<S.td&&!c.tdDone&&R()<.5){c.tdDone=1;tdBusy++;c.st='TESTDRIVE';c.sub='go';c.path=[...(c.d.r2?[[0,-6]]:[]),[0,0],[0,2.5],[16,3.5],[17.5,3.8]]}else{c.st='WAITING';c.w=0;c.per.dot.visible=true;c.per.dot.material.color.set(0xffeb3b)}}else{addRep(-1);leave(c)}}break;
 case'TESTDRIVE':if(c.sub=='go'){if(follow(c,2.6,dt)){c.sub='drive';scene.remove(c.per);const m=makeCar(c.d.car,CARS[c.d.car].col);m.position.set(19,0,4);scene.add(m);c.tdc=m;c.m=m;c.path=[[26,4],[26,-8],[19,-8],[19,4]]}}
  else if(c.sub=='drive'){if(follow(c,7,dt,1)){scene.remove(c.tdc);c.tdc=null;tdBusy=Math.max(0,tdBusy-1);c.m=c.per;c.per.position.set(17.5,0,3.8);scene.add(c.per);const fee=Math.round(150+CARS[c.d.car].price*.02);S.money+=fee;S.rev+=fee;S.profit+=fee;recordIncome('test',fee);S.tdN++;sales.push([performance.now(),fee]);floatTxt('+'+fm(fee),c.per.position);c.tdOK=1;c.sub='back';c.path=[[16,3.5],[0,2.5],[0,0],...(c.d.r2?[[0,-6]]:[]),[c.d.ax,c.d.az]]}}
  else if(follow(c,2.6,dt)){c.st='WAITING';c.w=0;c.sub='';c.per.dot.visible=true;c.per.dot.material.color.set(0xffeb3b)}break;
 case'WAITING':c.w+=dt;if(c.w>65){addRep(-2);S.satisfaction=S.satisfaction*.95+1.5;forceLeave(c)}break;
 case'BUYING':if(c.sub=='toC')follow(c,2.6,dt);c.act=c.sub=='serve'||c.sub=='pay';break;
 case'LEAVING':if(!c.dr){if(follow(c,2.6,dt)){removeActor(c.per);c.m=c.car;c.path=[[c.sx,12.5],[42,12.5]];c.dr=1}}else{if(c.path.length==1)pk[c.pi]=0;if(follow(c,8,dt,1)){scene.remove(c.car);c.dead=1}}}}
function ensureMech(){if(S.gar>0&&!mech){mech=person(0xff7043);mech.position.set(-20.6,0,-1.5);mech.rotation.y=-Math.PI/2;scene.add(mech)}}
function updG(dt){if(S.gar<1)return;ensureMech();
 if(!gj){gT-=dt;if(gT<=0){const bc=Math.round(1200+R()*600);if(S.money>=bc){S.money-=bc;const m=makeCar(['hatch','sedan','suv'][R()*3|0],0x8d6e63);m.position.set(-36,0,12.5);scene.add(m);gj={m,st:'IN',path:[[-23,12.5],[-23,-1.5]],bc,t:0,age:0}}else gT=5}return}
 gj.age+=dt;if(gj.age>70){scene.remove(gj.m);S.money+=gj.bc;gj=null;gT=10;return}
 if(gj.st=='IN'){if(follow(gj,6,dt,1)){gj.st='FIX';gj.t=0}}
 else if(gj.st=='FIX'){gj.t+=dt*(1+.3*(S.gar-1));gj.m.position.y=Math.abs(Math.sin(tm*14))*.04;if(gj.t>=15){gj.m.position.y=0;gj.st='OUT';gj.path=[[-23,12.5],[42,12.5]]}}
 else if(follow(gj,6,dt,1)){const sp=Math.round(gj.bc+500+300*S.gar+R()*300),pf=sp-gj.bc;S.money+=sp;S.rev+=sp;S.profit+=pf;recordIncome('garage',pf);S.garN++;addXP(8+pf/100);addRep(.2);sales.push([performance.now(),pf]);floatTxt('+'+fm(sp),gj.m.position);scene.remove(gj.m);gj=null;gT=Math.max(8,22-4*S.gar)}}
function addStaff(i){const m=person(0x1976d2);const home=[-8+i*2.4,-.8];m.position.set(home[0],0,home[1]);scene.add(m);m.add(box(.1,.5,.05,0xffffff,0,1.05,.3));staff.push({m,st:'IDLE',path:[],home,i,age:0,ph:i});key(m,'staff')}
function route(s,tz){const p=[];if(s.m.position.z<-6)p.push([0,-6],[0,-.8]);if(tz<-6)p.push([0,-.8],[0,-6]);return p}
function updS(s,dt){s.act=s.st=='SERVING';if(s.st!==s.k){s.k=s.st;s.age=0}else s.age+=dt;
 if(s.st!='IDLE'&&(s.age>110||(s.c&&s.st!='FINISHING'&&(s.c.dead||s.c.staff!==s)))){const c=s.c;if(c&&c.staff===s){if(ctrC===c)ctrC=null;if(c.st==='BUYING')forceLeave(c);else c.staff=null}s.st='IDLE';s.path=[];s.c=null;return}
 const sp=3.2*(1+S.train*.015),f=(1+.3*(S.spd-1))*(1+S.train*.06);switch(s.st){
 case'IDLE':{if(s.path.length)follow(s,sp,dt);else{s.mv=false;if(Math.hypot(s.m.position.x-s.home[0],s.m.position.z-s.home[1])>.1)s.path=[...route(s,-1),s.home.slice()]}
  const q=custs.filter(c=>c.st=='WAITING'&&!c.staff).sort((a,b)=>(b.w-Math.hypot(s.m.position.x-b.m.position.x,s.m.position.z-b.m.position.z)*.15)-(a.w-Math.hypot(s.m.position.x-a.m.position.x,s.m.position.z-a.m.position.z)*.15))[0];if(q){q.staff=s;s.c=q;s.st='MOVING';s.job='serve';s.path=[...route(s,q.d.r2?-8:0),[q.d.sx,q.d.az]];q.per.dot.material.color.set(0x66ff66)}break}
 case'MOVING':if(follow(s,sp,dt)){s.st='SERVING';if(s.job=='serve'){s.c.st='BUYING';s.c.sub='serve';s.c.prog=0;face(s.m,s.c.m.position.x,s.c.m.position.z);face(s.c.m,s.m.position.x,s.m.position.z)}}break;
 case'SERVING':{const c=s.c;if(s.job=='serve'){c.prog+=dt*f;if(c.prog>=5){if(ctrC&&ctrC!==c)break;ctrC=c;c.sub='toC';c.prog=0;c.path=[...(c.m.position.z<-5?[[0,-6],[0,.2]]:[]),[12,.2]];s.st='FINISHING';s.t=.3;s.fin='go'}}
  else{if(c.sub=='toC'&&!c.path.length){c.sub='pay';c.prog=0;face(c.m,9.2,-1.6);face(s.m,12,.2)}if(c.sub=='pay'){c.prog+=dt*f;if(c.prog>=2)sale(c,s)}}break}
 case'FINISHING':s.t-=dt;if(s.t<=0){if(s.fin=='go'){s.st='MOVING';s.job='cash';s.path=[...route(s,-1),[9.2,-1.6]]}else{s.st='IDLE';s.c=null}}break}}
function quote(k,c){if(c.offer&&c.d?.car===k)return Math.round(c.offer*(c.tdOK?1.03:1));return Math.max(Math.round(CARS[k].cost*1.02),Math.round(CARS[k].price*market(k).sell*S.pricing[k]*(1+(c.vip?.08:0)+(k===c.pref?.035:0)+S.rep/2500+(S.policy==='value'?-.025:S.policy==='premium'?.04:0))))}
function reserveCar(c){
 const av=slots.slice(0,NSL()).filter(d=>d.car&&!d.res&&quote(d.car,c)*.98<=c.bud);
 av.sort((a,b)=>((b.car===c.pref?2:0)+(c.bud-quote(b.car,c))/c.bud)-((a.car===c.pref?2:0)+(c.bud-quote(a.car,c))/c.bud));
 c.d=av[0]||null;if(c.d){c.offer=quote(c.d.car,c);c.d.res=c;c.match=c.d.car===c.pref;c.happy=c.match?95:75}
}
function sale(c,s){const d=c.d;if(!d||!d.car){forceLeave(c);return}if(quote(d.car,c)>c.bud&&quote(d.car,c)*.95<=c.bud){c.offer=Math.floor(c.bud/(c.tdOK?1.03:1));toast('Nhân viên thương lượng thành công')}if(quote(d.car,c)>c.bud){addRep(-.5);S.satisfaction=S.satisfaction*.95+2;forceLeave(c);return}const k=CARS[d.car],price=quote(d.car,c),prof=price-(d.basis||k.cost),inc=d.cons?prof:price;
 S.money+=inc;S.rev+=price;S.profit+=prof;S.sold++;recordIncome('cars',prof);S.satisfaction=S.satisfaction*.95+Math.max(35,100-c.w*.8)*.05;if(c.vip)S.vip++;addRep(c.vip?2:.5);addXP(10+price/150);sales.push([performance.now(),prof]);
 floatTxt('+'+fm(inc),c.m.position);burst(c.m.position);beep(880,.12);setTimeout(()=>beep(1320,.18),100);
 scene.remove(d.mesh);d.car=null;d.mesh=null;d.res=null;d.t=3.5;ctrC=null;c.staff=null;leave(c);s.st='FINISHING';s.fin='idle';s.t=.4;save()}
function floatTxt(txt,pos){const v=new V(pos.x,2.5,pos.z).project(cam),e=document.createElement('div');e.className='x';e.textContent=txt;e.style.left=(v.x+1)/2*innerWidth+'px';e.style.top=(1-v.y)/2*innerHeight+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),1500)}
