const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),routes=require('../content/routes.json'),copy=require('../content/work.json');
const read=r=>new JSDOM(fs.readFileSync(path.join(root,r,'index.html'),'utf8')).window.document;
let checks=0;
for(const lang of ['en','sv','es','ca']){
 const h=read(routes.home[lang]);assert.equal(h.querySelectorAll('.work-card').length,0);assert.equal(h.querySelectorAll('.work-steps>li').length,6);assert.equal(h.querySelectorAll('#primary-navigation>a').length,4);assert.equal(h.querySelector('.landscape-copy .lead').textContent,copy[lang].hero);assert(!h.querySelector('.pilot-section'));checks++;
 const s=read(routes.services[lang]);assert.equal(s.querySelectorAll('.service-detail').length,3);assert.equal(s.querySelectorAll('.service-brief').length,3);assert(s.querySelector('.pilot-disclosure'));assert(s.querySelectorAll('.feature-toggle').length>=20);checks++;
 for(const key of ['work-crm','work-prospecting','work-brand-transformation']){
  const d=read(routes[key][lang]);assert.equal(d.documentElement.lang,lang);assert.equal(d.querySelectorAll('#primary-navigation>a').length,4);assert.equal(d.querySelectorAll('.language-selector a').length,4);
  for(const a of d.querySelectorAll('.language-selector a'))assert.equal(a.getAttribute('href'),routes[key][a.dataset.language]);
  for(const a of d.querySelectorAll('link[hreflang]'))assert.equal(a.href,'https://onyx45.com'+routes[key][a.hreflang==='x-default'?'en':a.hreflang]);
  assert(d.querySelector('main').textContent.includes(copy[lang].internal));assert(!d.querySelector('main').textContent.includes('%'));
  assert.equal(d.querySelectorAll('main h1').length,1);assert.equal(d.querySelectorAll('main .final-cta').length,1);checks++;
 }
 const p=read(routes['work-prospecting'][lang]);assert.equal(p.querySelectorAll('.metrics-strip>div').length,1);assert(p.querySelector('.metric-estimate').textContent.includes('2 600'));assert(p.querySelector('.work-metrics .fine').textContent.includes(copy[lang].metricsNote));checks++;
}
const estimate=require('../assets/data/prospecting-estimate.json');assert.equal(estimate.identified_companies.value,2600);assert.equal(estimate.identified_companies.approximate,true);assert.equal(estimate.identified_companies.independently_verified,false);assert.equal(estimate.contact_rate,null);
for(const name of ['crm-overview','crm-followups','brand-before','brand-after'])for(const suffix of ['', '-small'])assert(fs.statSync(path.join(root,'assets/work',name+suffix+'.webp')).size>1000);
console.log(`PASS: ${checks} localized work/content checks; estimate-only publication, reciprocal language routes, capability preservation and eight image assets.`);
