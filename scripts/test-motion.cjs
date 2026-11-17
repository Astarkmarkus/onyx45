const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),routes=JSON.parse(fs.readFileSync(root+'/content/routes.json')),app=fs.readFileSync(root+'/assets/landscape-v3.js','utf8');let count=0;
for(const lang of ['en','sv','es','ca'])for(const mode of ['normal','reduced','save-data','unsupported']){
 const dom=new JSDOM(fs.readFileSync(root+routes.services[lang]+'index.html','utf8'),{runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,instances=[];
 const reduced={matches:mode==='reduced',addEventListener(t,fn){this.change=fn}};w.matchMedia=()=>reduced;Object.defineProperty(w.navigator,'connection',{value:{saveData:mode==='save-data'}});
 if(mode!=='unsupported')w.IntersectionObserver=class{constructor(fn){this.fn=fn;this.targets=new Set;instances.push(this)}observe(e){this.targets.add(e)}unobserve(e){this.targets.delete(e)}disconnect(){this.targets.clear()}};
 w.eval(app);assert.equal(d.querySelectorAll('[hidden].motion-reveal').length,0);
 if(mode==='normal'){
  assert.equal(instances.length,1);const io=instances[0],target=[...io.targets].find(e=>e.classList.contains('service-detail'));assert(target);
  io.fn([{target,isIntersecting:false}]);assert(!target.classList.contains('motion-reveal'));
  io.fn([{target,isIntersecting:true,boundingClientRect:{bottom:400}}]);assert(target.classList.contains('motion-reveal'));assert(!io.targets.has(target));
  target.querySelector('a').focus();assert(!target.classList.contains('motion-reveal'),'Focused content is immediately visible');
  const next=[...io.targets][0];io.fn([{target:next,isIntersecting:true,boundingClientRect:{bottom:200}}]);assert(next.classList.contains('motion-reveal'));reduced.matches=true;reduced.change({matches:true});assert.equal(d.querySelectorAll('.motion-reveal').length,0);assert.equal(io.targets.size,0);
 }else{assert.equal(instances.length,0);assert.equal(d.querySelectorAll('.motion-reveal').length,0)}
 dom.window.close();count++;
}
console.log(`PASS: ${count} section-motion scenarios; focus visibility, reduced-motion changes, save-data and unsupported-observer fallbacks.`);
