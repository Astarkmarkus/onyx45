(()=>{'use strict';const lang=document.documentElement.lang,copy=JSON.parse(document.getElementById('ui-copy').textContent),nav=document.getElementById('primary-navigation'),menu=document.querySelector('.menu-toggle'),picker=document.querySelector('.language-selector'),panel=document.getElementById('privacy-panel'),privacyKey='onyx45-privacy-v1',languageKey='onyx45-language';let privacy=null;
try{const stored=JSON.parse(localStorage.getItem(privacyKey)||'null');if(stored&&stored.version===1&&['necessary','minimal'].includes(stored.choice))privacy=stored.choice;}catch{}
function closeMenu(focus=false){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',copy.menu);menu.querySelector('.menu-label').textContent=copy.menu;nav.classList.remove('is-open');if(focus)menu.focus();}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?copy.close:copy.menu);menu.querySelector('.menu-label').textContent=open?copy.close:copy.menu;nav.classList.toggle('is-open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(picker.open){picker.open=false;picker.querySelector('summary').focus();}else if(menu.getAttribute('aria-expanded')==='true')closeMenu(true);}});
document.addEventListener('click',e=>{if(!picker.contains(e.target))picker.open=false;});const wide=matchMedia('(min-width:1051px)');if(wide.addEventListener)wide.addEventListener('change',e=>{if(e.matches)closeMenu();});
picker.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();picker.open=true;const links=[...picker.querySelectorAll('[data-language]')],i=links.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?links.length-1:(i+(e.key==='ArrowDown'?1:-1)+links.length)%links.length;links[next].focus();});
document.querySelectorAll('[data-language]').forEach(a=>{a.addEventListener('click',()=>{try{if(privacy==='necessary')localStorage.setItem(languageKey,a.dataset.language);}catch{}});});
if(privacy==='necessary'){try{const storedLanguage=localStorage.getItem(languageKey);if(location.pathname==='/'&&storedLanguage==='sv'){location.replace('/sv/');return;}localStorage.setItem(languageKey,lang);}catch{}}panel.hidden=!!privacy;
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
