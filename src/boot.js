
(()=>{
const current=__RELEASE__;
const manifestLink=document.createElement('link');manifestLink.rel='manifest';manifestLink.href=current.manifest;document.head.append(manifestLink);
let pending=null,requested=false;
const button=document.createElement('button');button.id='game-update';button.textContent='Cập nhật game';button.style.cssText='position:fixed;right:12px;top:calc(env(safe-area-inset-top,0px) + 110px);z-index:1000;padding:12px;border-radius:12px;border:1px solid #e8c58a;background:#142f46;color:#fff;display:none';document.body.append(button);
const load=(tag,attrs)=>new Promise((resolve,reject)=>{const e=document.createElement(tag);Object.assign(e,attrs);e.onload=resolve;e.onerror=reject;document.head.append(e)});
(async()=>{
try{await load('link',{rel:'stylesheet',href:current.css});await load('script',{src:current.vendor});await load('script',{src:current.loader});await load('script',{src:current.skeleton});await load('script',{src:current.game})}catch(e){button.textContent='Không tải được game · Tải lại';button.style.display='block';button.onclick=()=>location.reload();return}
if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol))return;
function ready(reg,isNewBuild){
 if(!reg.waiting||!isNewBuild)return;
 pending=reg.waiting;
 const state={saved:false};document.dispatchEvent(new CustomEvent('aet:before-update',{detail:state}));
 if(state.saved){requested=true;pending.postMessage({type:'ACTIVATE'})}
 else button.style.display='block';
}
async function check(){try{
 const response=await fetch('./release.json?t='+Date.now(),{cache:'no-store'});if(!response.ok)return;const release=await response.json();
 const isNewBuild=release.build!==current.build;
 if(isNewBuild){
  const state={saved:false};document.dispatchEvent(new CustomEvent('aet:before-update',{detail:state}));
  if(state.saved)requested=true;
 }
 const reg=await navigator.serviceWorker.register('./sw.js?build='+encodeURIComponent(release.build),{updateViaCache:'none'});
 ready(reg,isNewBuild);
 reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker.addEventListener('statechange',()=>{if(worker.state==='installed')ready(reg,isNewBuild)})});
}catch(e){}}
button.onclick=()=>{if(!pending)return;const state={saved:false};document.dispatchEvent(new CustomEvent('aet:before-update',{detail:state}));if(!state.saved){button.textContent='Chưa lưu được · Thử lại';return}requested=true;button.disabled=true;pending.postMessage({type:'ACTIVATE'})};
navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requested)location.replace(location.pathname+'?build='+Date.now())});
await check();setInterval(check,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
})();
})();
