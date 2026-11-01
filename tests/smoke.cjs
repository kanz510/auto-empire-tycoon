// npm install; npm test. Optional: BROWSER_BIN=/usr/bin/chromium SOAK_SECONDS=600 npm test
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
const root=path.resolve(__dirname,'..');
const allowed=new Set(['/','/index.html','/sw.js','/manifest.webmanifest','/icon.svg']);
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(!(allowed.has(url.pathname)||/^\/(dist|vendor|assets)\/[a-zA-Z0-9_.-]+$/.test(url.pathname)||url.pathname==='/release.json')){res.writeHead(404).end();return}
const file=url.pathname==='/'?'index.html':url.pathname.slice(1);res.setHeader('Content-Type',file.endsWith('.png')?'image/png':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.js')?'text/javascript':file.endsWith('.webmanifest')?'application/manifest+json':'text/html');res.end(fs.readFileSync(path.join(root,file)))});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
browser=await chromium.launch({headless:true,...(process.env.BROWSER_BIN?{executablePath:process.env.BROWSER_BIN}:{}),args:['--no-sandbox','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true,deviceScaleFactor:2});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:'+server.address().port+'/');
await page.waitForFunction(()=>typeof S!=='undefined');
const result=await page.evaluate(()=>{
S.money=250000;S.auto=0;const start=S.money,cost=stockCost('hatch');buyStock('hatch',5);
const buy=Math.abs(start-S.money-cost*5)<.01;up('show');up('hire');up('td');up('gar');startTraining();
for(let i=0;i<601;i++)simulate(.05);
const trained=S.train===1;buyUsed();for(let i=0;i<801;i++)simulate(.05);const used=S.used===0;
orderCar();const key=S.orders[0].k;S.inv[key]+=10;for(let i=0;i<901;i++)simulate(.05);const orders=S.orders.length===0;S.sold=Math.max(1,S.sold);S.rpm=600;S.t=Date.now()-120000;
const before=S.money;claimOffline();const credited=S.money>before,once=S.money;claimOffline();
const offline=S.money===once;S.xp=25.75;save(true);Object.defineProperty(document,'hidden',{value:true,configurable:true});return {used,orders,buy,trained,credited,offline,show:S.show};
});
assert.equal(result.used,true);assert.equal(result.orders,true);assert.equal(result.buy,true);assert.equal(result.trained,true);assert.equal(result.credited,true);assert.equal(result.offline,true);assert.equal(result.show,2);
await page.reload();await page.waitForFunction(()=>typeof S!=='undefined');assert.equal(await page.evaluate(()=>S.train),1);assert.equal(await page.evaluate(()=>S.xp),25.75);
await page.evaluate(()=>{S.mi=MIS.length;$('modal').style.display='none'});await page.locator('[data-o="menu"]').tap();await page.locator('[data-a="ads"]').tap();await page.locator('[data-a="save"]').tap();
await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
await context.setOffline(true);await page.reload();await page.waitForFunction(()=>typeof S!=='undefined');assert.match(await page.title(),/v11/);await context.setOffline(false);
const second=await context.newPage();await second.goto(page.url());await second.waitForFunction(()=>typeof owner!=='undefined');assert.equal(await second.evaluate(()=>owner),false);await second.close();
const soak=Math.max(0,Number(process.env.SOAK_SECONDS)||0);
await page.waitForTimeout(soak*1000);
assert.equal(await page.evaluate(()=>Number.isFinite(S.money)&&S.money>=0&&slots.every(d=>!d.res||custs.includes(d.res))),true);
assert.deepEqual(errors,[]);console.log('PASS: buying, training, upgrades, persistence, offline income, touch, offline reload, tab ownership; soak='+soak+'s');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
