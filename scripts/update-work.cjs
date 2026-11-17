/* Render the four-language V3.1 content into the existing static templates. */
const fs=require('fs'),path=require('path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');process.chdir(root);
const copy=JSON.parse(fs.readFileSync('content/work.json','utf8'));
const routes=JSON.parse(fs.readFileSync('content/routes.json','utf8'));
const names=['crm','prospecting','brand-transformation'];
for(const name of names)routes['work-'+name]=Object.fromEntries(['en','sv','es','ca'].map(l=>[l,`${l==='en'?'':'/'+l}/work/${name}/`]));
const file=r=>path.join(root,r,'index.html'); // routes are root-relative, join retains checkout
const read=r=>new JSDOM(fs.readFileSync(file(r),'utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const arrow='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const link=(url,text,cls='text-link')=>`<a class="${cls}" href="${url}">${esc(text)}${arrow}</a>`;
const image=(name,alt,cls='')=>`<img class="${cls}" src="/assets/work/${name}.webp" srcset="/assets/work/${name}-small.webp 640w, /assets/work/${name}.webp ${name==='crm-overview'?1062:1348}w" sizes="${cls==='work-card-image'?'(max-width:760px) 100vw, 33vw':'(max-width:760px) 100vw, 90vw'}" width="${name==='crm-overview'?1062:1348}" height="${name==='crm-overview'?350:926}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const steps=c=>`<ol class="work-steps">${c.steps.map(([title,body],i)=>`<li><span class="work-step-number" aria-hidden="true">0${i+1}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></li>`).join('')}</ol>`;
const workflow=(c,l)=>`<section class="work-workflow section wrap"><span class="eyebrow">${esc(c.workflowLabel)}</span><h2>${esc(c.workflowHeading)}</h2>${steps(c)}${link(routes.contact[l],c.workflowCta)}</section>`;
const metrics=(c,l)=>`<section class="work-metrics work-estimate" aria-labelledby="metrics-heading"><span class="eyebrow">${esc(c.internal)} 002</span><h2 id="metrics-heading">${esc(c.metricsHeading)}</h2><dl class="metrics-strip"><div class="metric-estimate"><dt>${esc(c.estimateLabel)}</dt><dd>≈ 2 600<span class="estimate-marker">*</span></dd></div></dl><p class="fine">* ${esc(c.metricsNote)}</p></section>`;
const final=(c,l)=>`<section class="final-cta"><div><span class="eyebrow">${esc(c.finalEyebrow)}</span><h2>${esc(c.finalHeading)}</h2><p>${esc(c.finalText)}</p><p class="fine">${esc(c.finalFine)}</p></div>${link(routes.contact[l],c.finalCta,'button')}</section>`;
function save(dom,r){fs.mkdirSync(path.dirname(file(r)),{recursive:true});fs.writeFileSync(file(r),dom.serialize().replace(/[ \t]+\n/g,'\n'));}
for(const [l,c] of Object.entries(copy)){
 const home=read(routes.home[l]),d=home.window.document;
 d.querySelector('.landscape-copy .lead').textContent=c.hero;
 d.querySelector('.heritage-intro .lead').textContent=c.intro;
 d.querySelectorAll('.heritage-service-grid>article').forEach((a,i)=>{
  a.querySelector('p').textContent=c.descriptions[i];a.querySelector('.text-link').innerHTML=esc(c.serviceCtas[i])+arrow;
  a.querySelector('.service-value')?.remove();const p=d.createElement('p');p.className='service-value';p.textContent=c.values[i];a.querySelector('.text-link').before(p);
 });
 const pilot=d.querySelector('.pilot-section')?.cloneNode(true);
 d.querySelectorAll('main>.consult-flow,main>.heritage-why,main>.pilot-section,main>.inside-work,main>.work-workflow').forEach(e=>e.remove());
 const cards=c.cases.map((p,i)=>`<article class="work-card"><div class="work-card-heading"><span class="work-number" aria-hidden="true">00${i+1}</span><span class="eyebrow">${esc(c.internal)} 00${i+1}</span></div><div class="work-card-visual">${i===0?image('crm-overview',c.interface,'work-card-image'):i===1?`<div class="prospecting-visual" aria-hidden="true"><span>01 — 06</span><strong>${esc(c.steps[0][0])}<br><em>${esc(c.steps[3][0])}</em></strong><div class="process-line"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`:image('brand-after',c.after,'work-card-image')}</div><div class="work-card-copy"><p class="work-category">${esc(p.category)}</p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>${link(routes['work-'+names[i]][l],c.view)}</div></article>`).join('');
 d.querySelector('main>.final-cta').insertAdjacentHTML('beforebegin',`<section class="inside-work section wrap" id="inside-our-work" aria-labelledby="work-heading"><div class="work-intro"><div><span class="eyebrow">${esc(c.projectsLabel)}</span><p class="work-section-name">${esc(c.inside)}</p><h2 id="work-heading">${esc(c.projectsHeading)}</h2></div><p class="lead">${esc(c.projectsIntro)}</p></div><div class="work-grid">${cards}</div></section>${workflow(c,l)}`);
 d.querySelector('main>.final-cta').outerHTML=final(c,l);save(home,routes.home[l]);
 const services=read(routes.services[l]),sd=services.window.document;
 sd.querySelectorAll('.service-detail').forEach((s,i)=>{
  const title=s.querySelector('.service-detail-title');const paragraphs=[...title.children].filter(e=>e.tagName==='P'&&!e.classList.contains('fine'));
  paragraphs[0].textContent=c.descriptions[i];paragraphs.slice(1).forEach(e=>e.remove());
  title.querySelector('.service-brief')?.remove();title.querySelector('a.button').insertAdjacentHTML('beforebegin',`<dl class="service-brief"><div><dt>${esc(c.who)}</dt><dd>${esc(c.audiences[i])}</dd></div><div><dt>${esc(c.measure)}</dt><dd>${esc(c.measures[i])}</dd></div></dl>`);
 });
 if(pilot&&!sd.querySelector('.pilot-disclosure')){pilot.removeAttribute('aria-labelledby');const h=pilot.querySelector('h2');h.removeAttribute('id');const details=sd.createElement('details');details.className='pilot-disclosure wrap';details.innerHTML=`<summary>${esc(c.pilot)}</summary>`;details.append(pilot);sd.querySelector('.final-cta').before(details);}
 sd.querySelector('.final-cta').outerHTML=final(c,l);save(services,routes.services[l]);
 for(const [i,name] of names.entries()){
  const p=c.cases[i],route=routes['work-'+name][l],dom=read(routes.about[l]),doc=dom.window.document;
  doc.title=`${p.title} — ONYX45`;doc.querySelector('meta[name="description"]').content=p.summary;doc.querySelector('link[rel="canonical"]').href='https://onyx45.com'+route;
  for(const key of ['og:title','og:description','og:url'])doc.querySelector(`meta[property="${key}"]`).content=key==='og:title'?doc.title:key==='og:description'?p.summary:'https://onyx45.com'+route;
  doc.querySelectorAll('link[hreflang]').forEach(e=>e.href='https://onyx45.com'+routes['work-'+name][e.hreflang==='x-default'?'en':e.hreflang]);
  doc.querySelectorAll('.language-selector a').forEach(e=>e.href=routes['work-'+name][e.dataset.language]);doc.querySelectorAll('#primary-navigation [aria-current]').forEach(e=>e.removeAttribute('aria-current'));
  const visual=i===0?`<div class="work-gallery"><figure>${image('crm-overview',c.interface)}<figcaption>${esc(c.interface)}</figcaption></figure><figure>${image('crm-followups',c.interface)}<figcaption>${esc(c.interface)}</figcaption></figure></div>`:i===1?metrics(c,l):`<div class="work-comparison"><figure>${image('brand-before',c.before)}<figcaption>${esc(c.before)}</figcaption></figure><figure>${image('brand-after',c.after)}<figcaption>${esc(c.after)}</figcaption></figure></div>`;
  doc.querySelector('main').className='work-detail';doc.querySelector('main').innerHTML=`<section class="page-intro wrap work-page-intro">${link(routes.home[l]+'#inside-our-work',c.back)}<p class="eyebrow">${esc(c.internal)} 00${i+1} · ${esc(p.category)}</p><h1>${esc(p.title)}</h1><p class="lead">${esc(p.summary)}</p></section><section class="section wrap work-content"><div class="work-narrative"><span class="work-number" aria-hidden="true">00${i+1}</span><div><h2>${esc(c.challenge)}</h2><p>${esc(p.challenge)}</p><h2>${esc(c.approach)}</h2><p>${esc(p.approach)}</p><ul class="work-features">${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><h2>${esc(c.built)}</h2><p>${esc(p.built)}</p></div></div>${visual}<div class="work-demonstrates"><h2>${esc(c.demonstrates)}</h2><p class="lead">${esc(p.demonstrates)}</p>${link(routes.services[l]+['#growth-management','#lead-generation','#growth-management'][i],c.serviceCtas[[0,2,0][i]])}</div></section>${i<2?workflow(c,l):''}${final(c,l)}`;
  save(dom,route);
 }
}
fs.writeFileSync('content/routes.json',JSON.stringify(routes,null,2)+'\n');
// Keep pre-existing article entries while adding the twelve translated project pages.
let sitemap=fs.readFileSync('sitemap.xml','utf8');
for(const name of names)for(const l of ['en','sv','es','ca']){const group=routes['work-'+name],url='https://onyx45.com'+group[l];if(sitemap.includes(`<loc>${url}</loc>`))continue;sitemap=sitemap.replace('</urlset>',`<url><loc>${url}</loc>${Object.entries(group).map(([lang,r])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="https://onyx45.com${r}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="https://onyx45.com${group.en}"/></url>\n</urlset>`);}
fs.writeFileSync('sitemap.xml',sitemap);
console.log('Rendered V3.1 homes, service pages and twelve internal project pages.');
