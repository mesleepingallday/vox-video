const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch({args:['--disable-gpu','--force-color-profile=srgb','--font-render-hinting=none']});
  const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await p.goto('file:///home/claude/vid/app/bench.html'); await p.waitForTimeout(500);
  const c=await p.context().newCDPSession(p);
  for (const [fmt,q] of [['jpeg',92],['png',0]]) {
    let t=Date.now(), bytes=0;
    for(let i=0;i<20;i++){ await p.evaluate((i)=>{document.getElementById('s').style.transform=`scale(${1+i*0.002}) rotate(${i*0.02}deg)`},i);
      const r=await c.send('Page.captureScreenshot',{format:fmt,quality:q||undefined,optimizeForSpeed:true}); bytes+=r.data.length; }
    console.log(fmt,(Date.now()-t)/20,'ms/frame', Math.round(bytes/20/1024),'KB b64');
  }
  await b.close();
})();
