const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),routes=JSON.parse(fs.readFileSync(root+'/content/routes.json')),app=fs.readFileSync(root+'/assets/landscape-v3.js','utf8');
let count=0;
for(const lang of ['en','sv','es','ca'])for(const mode of ['desktop','mobile','reduced','save-data']){
 const dom=new JSDOM(fs.readFileSync(root+routes.home[lang]+'index.html','utf8'),{runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document;
 let top=0,scheduled=[],media={};w.requestAnimationFrame=fn=>scheduled.push(fn);w.matchMedia=q=>media[q]={matches:q.includes('reduce')?mode==='reduced':mode==='mobile',addEventListener(t,fn){this.change=fn}};
 Object.defineProperty(w.navigator,'connection',{value:{saveData:mode==='save-data'}});
 const hero=d.querySelector('.landscape-hero');hero.getBoundingClientRect=()=>({top,height:800});w.eval(app);
 const flush=()=>{let frames=0;while(scheduled.length){assert(++frames<200,"Animation must stop when settled");const tasks=scheduled;scheduled=[];tasks.forEach(fn=>fn())}};flush();
 assert.equal(d.querySelectorAll('#primary-navigation>a').length,4);assert.equal(d.querySelectorAll('[data-onyx-story],.orbit-layer').length,0);
 assert(d.querySelector('.heritage-service-grid').firstElementChild.classList.contains('primary-capability'));
 const word=d.querySelector('.landscape-word'),image=d.querySelector('.landscape-media img');
 top=-400;w.dispatchEvent(new w.Event('scroll'));flush();
 if(mode==='reduced'||mode==='save-data'){assert.equal(word.style.transform,'');assert.equal(word.style.opacity,'')}else{
  assert(Number(word.style.opacity)<1);assert.equal(image.style.transform.includes('translateY'),mode==='desktop');
  top=0;w.dispatchEvent(new w.Event('scroll'));flush();assert.equal(word.style.opacity,'1');
  media['(prefers-reduced-motion: reduce)'].matches=true;media['(prefers-reduced-motion: reduce)'].change();flush();assert.equal(word.style.transform,'');
 }
 const contact=new JSDOM(fs.readFileSync(root+routes.contact[lang]+'index.html','utf8')).window.document;
 assert.equal(contact.querySelector('#service option[value="3"]').previousElementSibling.value,'');
 assert(!/localStorage|sessionStorage/.test(app));dom.window.close();count++;
}
console.log(`PASS: ${count} localized landscape scenarios; reverse scrolling, reduced motion, save-data, mobile simplification, navigation and service ordering.`);
