/* Maintainer checks: node with jsdom available. No requests are sent. */
const fs=require('fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom'),cp=require('child_process');
const root=require('path').resolve(__dirname,'..'),read=p=>fs.readFileSync(root+'/'+p,'utf8');
const routes=JSON.parse(read('content/routes.json')),app=read('assets/agency-20261023.js');
for(const l of Object.keys(routes.home)){
 const raw=read(routes.home[l].slice(1)+'index.html');
 for(const option of ['normal','reduce','mobile','save']){
  const dom=new JSDOM(raw,{url:'https://onyx45.com'+routes.home[l],runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document;
  let y=0,callbacks=[],reduce=option==='reduce',mobile=option==='mobile',listeners=[];
  w.matchMedia=q=>({get matches(){return q.includes('reduced')?reduce:mobile},addEventListener(k,f){if(q.includes("reduced"))listeners.push(f)}});
  Object.defineProperty(w.navigator,'connection',{value:{saveData:option==='save'}});
  Object.defineProperty(w.navigator,'hardwareConcurrency',{value:4});
  w.requestAnimationFrame=f=>(callbacks.push(f),callbacks.length);
  const tick=()=>callbacks.splice(0).forEach(f=>f());
  const story=d.querySelector('[data-onyx-story]'),chapters=[...story.querySelectorAll('[data-onyx-chapter]')],field=d.querySelector('.stone-field'),orbit=field.querySelector('.orbit-layer'),button=d.querySelector('.orbit-toggle');
  story.getBoundingClientRect=()=>({top:-y,bottom:2200-y});chapters.forEach((el,i)=>el.getBoundingClientRect=()=>({top:i*400-y,height:350}));
  Object.defineProperty(chapters[0],'offsetHeight',{value:600});
  w.eval(app);tick();
  assert.equal(field.classList.contains('orbit-running'),option==='normal');
  if(option==='normal'){
   button.click();assert.equal(field.classList.contains('orbit-running'),false);assert.equal(button.getAttribute('aria-pressed'),'true');
   button.click();assert.equal(field.classList.contains('orbit-running'),true);
   const first=field.querySelector('img').style.transform;
   y=700;w.dispatchEvent(new w.Event('scroll'));tick();
   assert.equal(orbit.inert,true);assert([...orbit.querySelectorAll('a')].every(a=>a.tabIndex===-1));assert.equal(orbit.getAttribute('aria-hidden'),'true');assert(button.hidden);assert(!field.classList.contains('orbit-running'));
   y=0;w.dispatchEvent(new w.Event('scroll'));tick();
   assert.equal(orbit.inert,false);assert([...orbit.querySelectorAll('a')].every(a=>!a.hasAttribute('tabindex')));assert.equal(field.querySelector('img').style.transform,first);
   reduce=true;listeners.forEach(f=>f());tick();assert(!field.classList.contains('orbit-running'));assert.equal(field.querySelector('img').style.transform,'');
  }
  if(option==='mobile')assert.equal(button.hidden,true);
  if(option==='reduce'||option==='save')assert.equal(field.querySelector('img').style.transform,'');
  for(const nav of d.querySelectorAll('.orbit-links')){
   assert.equal(nav.querySelectorAll('a').length,3);
   assert([...nav.querySelectorAll('a')].every(a=>a.getAttribute('href').startsWith(routes.services[l]+'#')));
  }
  dom.window.close();
 }
}
const baseline=cp.execFileSync('git',['show','origin/main:assets/site-config.js'],{cwd:root,encoding:'utf8'});assert.equal(read('assets/site-config.js'),baseline);
console.log('PASS: 16 EN/SV/ES/CA orbit cases: links, pause, reversible fade, hidden-link focus removal, mobile, reduced motion, data saving; form configuration unchanged.');
