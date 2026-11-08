(()=>{'use strict';const lang=document.documentElement.lang,copy=JSON.parse(document.getElementById('ui-copy').textContent),nav=document.getElementById('primary-navigation'),menu=document.querySelector('.menu-toggle'),picker=document.querySelector('.language-selector'),panel=document.getElementById('privacy-panel'),privacyKey='onyx45-privacy-v1',languageKey='onyx45-language';let privacy=null;
try{const stored=JSON.parse(localStorage.getItem(privacyKey)||'null');if(stored&&stored.version===1&&['necessary','minimal'].includes(stored.choice))privacy=stored.choice;}catch{}
function closeMenu(focus=false){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',copy.menu);menu.querySelector('.menu-label').textContent=copy.menu;nav.classList.remove('is-open');if(focus)menu.focus();}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?copy.close:copy.menu);menu.querySelector('.menu-label').textContent=open?copy.close:copy.menu;nav.classList.toggle('is-open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(picker.open){picker.open=false;picker.querySelector('summary').focus();}else if(menu.getAttribute('aria-expanded')==='true')closeMenu(true);}});
document.addEventListener('click',e=>{if(!picker.contains(e.target))picker.open=false;});const wide=matchMedia('(min-width:1051px)');if(wide.addEventListener)wide.addEventListener('change',e=>{if(e.matches)closeMenu();});
picker.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();picker.open=true;const links=[...picker.querySelectorAll('[data-language]')],i=links.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?links.length-1:(i+(e.key==='ArrowDown'?1:-1)+links.length)%links.length;links[next].focus();});
document.querySelectorAll('[data-language]').forEach(a=>{a.addEventListener('click',()=>{try{if(privacy==='necessary')localStorage.setItem(languageKey,a.dataset.language);}catch{}});});
if(privacy==='necessary'){try{const storedLanguage=localStorage.getItem(languageKey);const languageHomes={sv:'/sv/',es:'/es/',ca:'/ca/'};if(location.pathname==='/'&&languageHomes[storedLanguage]){location.replace(languageHomes[storedLanguage]);return;}localStorage.setItem(languageKey,lang);}catch{}}panel.hidden=!!privacy;
document.querySelectorAll('[data-privacy]').forEach(b=>b.addEventListener('click',()=>{privacy=b.dataset.privacy;try{localStorage.setItem(privacyKey,JSON.stringify({version:1,choice:privacy}));if(privacy==='necessary')localStorage.setItem(languageKey,lang);else localStorage.removeItem(languageKey);}catch{}panel.hidden=true;document.getElementById('privacy-status').textContent=copy.cookie_saved;}));
document.querySelectorAll('.privacy-open').forEach(b=>b.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus();}));
// Accessible feature accordions: native buttons provide Enter and Space activation.
const featureTimers=new WeakMap();
document.querySelectorAll('.feature-toggle').forEach(button=>button.addEventListener('click',()=>{
 const content=document.getElementById(button.getAttribute('aria-controls')),open=button.getAttribute('aria-expanded')!=='true';
 clearTimeout(featureTimers.get(content));button.setAttribute('aria-expanded',String(open));
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){content.hidden=!open;content.style.height='';return;}
 const start=content.hidden?0:content.getBoundingClientRect().height;content.hidden=false;content.style.height=start+'px';content.getBoundingClientRect();
 content.style.height=(open?content.scrollHeight:0)+'px';
 featureTimers.set(content,setTimeout(()=>{content.hidden=!open;content.style.height='';},240));
}));
// Direct browser-to-Web3Forms submission; no email-draft or mailto submission path.
const form=document.getElementById('contact-form');if(!form)return;
const config=window.ONYX45_CONFIG||{},endpoint='https://api.web3forms.com/submit';
const configured=config.formEndpoint===endpoint&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(config.formAccessKey||'');
const submit=document.getElementById('form-submit'),status=document.getElementById('form-status'),errors=document.getElementById('form-errors'),availability=document.getElementById('form-availability');
let sending=false;
// Static labels also work before JavaScript loads. Configuration failures never fall back to a draft.
submit.textContent=copy.submit;submit.disabled=!configured;availability.hidden=configured;
if(!configured)availability.textContent=copy.unconfigured;
const service=new URLSearchParams(location.search).get('service');if(['1','2','3','4'].includes(service))form.elements.service.value=service;
function validate(){
 let first=null;
 for(const input of form.querySelectorAll('.form-grid input,.form-grid select,.form-grid textarea')){
  const error=document.getElementById('error-'+input.name);let text='';
  if(input.required&&!input.value.trim())text=copy.required;
  else if(input.type==='email'&&input.validity.typeMismatch)text=copy.email_error;
  else if(input.name==='service'&&!['1','2','3','4'].includes(input.value))text=copy.required;
  else if(input.name==='message'&&input.value.trim().length<20)text=copy.length_error;
  else if(!input.validity.valid)text=copy.validation;
  error.textContent=text;input.removeAttribute('aria-invalid');
  const described=(input.getAttribute('aria-describedby')||'').split(' ').filter(v=>v&&!v.startsWith('error-'));
  if(text){first=first||input;input.setAttribute('aria-invalid','true');described.push(error.id);}
  if(described.length)input.setAttribute('aria-describedby',described.join(' '));else input.removeAttribute('aria-describedby');
 }
 errors.hidden=!first;errors.textContent=first?copy.validation:'';if(first)first.focus();return !first;
}
form.addEventListener('input',e=>{const input=e.target;if(input.getAttribute('aria-invalid')==='true'){input.removeAttribute('aria-invalid');const error=document.getElementById('error-'+input.name);if(error)error.textContent='';}});
form.addEventListener('submit',async e=>{
 e.preventDefault();if(sending)return;status.textContent='';errors.hidden=true;errors.textContent='';
 if(!configured){errors.hidden=false;errors.textContent=copy.unconfigured;errors.focus();return;}
 if(!validate())return;
 if(form.elements._gotcha.value.trim()||form.elements.botcheck.checked){errors.hidden=false;errors.textContent=copy.error;errors.focus();return;}
 sending=true;submit.disabled=true;submit.textContent=copy.sending;form.setAttribute('aria-busy','true');status.textContent=copy.sending;
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
 try{
  // Explicit allowlist: do not send honey fields, browser state or unrelated form controls.
  const data={access_key:config.formAccessKey,subject:'ONYX45 | Business Enquiry | '+form.elements.service.selectedOptions[0].textContent,from_name:'ONYX45 Website',language:lang,service:form.elements.service.value,service_label:form.elements.service.selectedOptions[0].textContent,botcheck:false};
  for(const field of ['name','email','company','message','phone'])data[field]=form.elements[field].value.trim();
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
  const result=await response.json().catch(()=>null);
  if(!response.ok||!result||result.success!==true)throw new Error('Submission not confirmed');
  form.reset();status.textContent=copy.success;status.focus();
 }catch{
  status.textContent='';errors.hidden=false;errors.textContent=copy.error;errors.focus();
 }finally{
  clearTimeout(timeout);sending=false;submit.disabled=false;submit.textContent=copy.submit;form.removeAttribute('aria-busy');
 }
});
})();

// The decorative stone follows the document, with no pinned scroll or hidden copy.
(()=>{
 const story=document.querySelector('[data-onyx-story]');
 if(!story||!window.requestAnimationFrame||!window.matchMedia||navigator.connection?.saveData)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width:760px)');
 const desktop=story.querySelector('.stone-field .onyx-image'),mobile=story.querySelector('.onyx-mobile .onyx-image');
 const chapters=[...story.querySelectorAll('[data-onyx-chapter]')];
 const field=story.querySelector('.stone-field'),orbit=field.querySelector('.orbit-layer'),toggle=story.querySelector('.orbit-toggle');
 let paused=false;
 const economical=(navigator.hardwareConcurrency||4)<=2;
 function ambient(on){
  field.classList.toggle('orbit-running',on&&!paused&&!economical&&!compact.matches&&!reduced.matches&&!document.hidden);
 }
 function orbitExit(exit){
  field.style.setProperty('--orbit-exit',exit.toFixed(3));
  const hidden=exit>.98;
  orbit.inert=hidden;orbit.setAttribute('aria-hidden',String(hidden));
  for(const link of orbit.querySelectorAll('a')){if(hidden)link.setAttribute('tabindex','-1');else link.removeAttribute('tabindex');}
  toggle.hidden=hidden||reduced.matches||compact.matches||economical;
  ambient(!hidden);
 }
 toggle.addEventListener('click',()=>{
  paused=!paused;toggle.setAttribute('aria-pressed',String(paused));
  toggle.textContent=paused?toggle.dataset.play:toggle.dataset.pause;
  ambient(near&&parseFloat(field.style.getPropertyValue('--orbit-exit')||0)<.98);
 });
 document.addEventListener('visibilitychange',()=>{ambient(near);queue();});
 const poses=[[0,0,0,1,1],[-16,-10,10,.97,1],[25,10,-14,.94,1],[-27,20,12,.91,1],[-39,36,-16,.76,.25]];
 let frame=0,near=true,enabled=false;
 const limit=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
 function clear(){
  orbitExit(0);ambient(false);
  for(const el of [desktop,mobile,...chapters]){el.style.removeProperty('transform');el.style.removeProperty('opacity');}
 }
 function paint(){
  frame=0;
  if(!enabled||!near){ambient(false);return;}
  const box=story.getBoundingClientRect(),height=innerHeight;
  if(box.bottom<0||box.top>height){ambient(false);return;}
  orbitExit(limit(-box.top/Math.max(1,chapters[0].offsetHeight*.65)));
  if(compact.matches){
   const t=limit(-box.top/Math.max(1,chapters[0].offsetHeight));
   mobile.style.transform='rotate('+(-6*t).toFixed(2)+'deg) translateY('+(12*t).toFixed(2)+'px)';
   return;
  }
  const bounds=chapters.map(el=>el.getBoundingClientRect());
  const centers=bounds.map(r=>r.top+r.height*.42);
  const focal=height*.47;
  let i=0;
  while(i<centers.length-2&&focal>centers[i+1])i++;
  let t=limit((focal-centers[i])/Math.max(1,centers[i+1]-centers[i]));
  t=t*t*(3-2*t);
  const [yaw,y,roll,scale,opacity]=poses[i].map((v,k)=>v+(poses[i+1][k]-v)*t);
  desktop.style.transform='translate3d(0,'+y.toFixed(2)+'px,0) rotateY('+yaw.toFixed(2)+'deg) rotateZ('+roll.toFixed(2)+'deg) scale('+scale.toFixed(3)+')';
  desktop.style.opacity=opacity.toFixed(3);
  for(let j=1;j<chapters.length-1;j++){
   const el=chapters[j],enter=limit((height-bounds[j].top)/(height*.26));
   el.style.transform='translateY('+((1-enter)*12).toFixed(1)+'px)';
   el.style.opacity=(.87+.13*enter).toFixed(3);
  }
 }
 function queue(){if(enabled&&near&&!frame)frame=requestAnimationFrame(paint);}
 function mode(){
  clear();enabled=!reduced.matches;queue();
 }
 window.addEventListener('scroll',queue,{passive:true});
 window.addEventListener('resize',queue,{passive:true});
 if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{near=entry.isIntersecting;if(!near)ambient(false);queue();}).observe(story);
 for(const media of [reduced,compact]){
  if(media.addEventListener)media.addEventListener('change',mode);
  else if(media.addListener)media.addListener(mode);
 }
 mode();
})();
