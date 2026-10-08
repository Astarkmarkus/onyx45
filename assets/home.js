(() => {
'use strict';
const translations=window.ONYX_TRANSLATIONS;
// Reusable destinations: stable IDs also serve as future city-page slugs.
const CITY_GROUPS=[{"country":"es","cities":["barcelona","madrid","alicante","malaga"]},{"country":"pt","cities":["lisbon"]},{"country":"de","cities":["berlin"]},{"country":"uk","cities":["london"]},{"country":"ie","cities":["dublin"]},{"country":"gr","cities":["athens"]},{"country":"se","cities":["gothenburg"]},{"country":"fr","cities":["paris"]},{"country":"it","cities":["milan"]}];
const LANGUAGE_NAMES={"en":"English","es":"Español","ca":"Català","pt":"Português","de":"Deutsch","el":"Ελληνικά","sv":"Svenska","fr":"Français","it":"Italiano","ar":"العربية","zh":"中文（简体）"};
const cityIds=CITY_GROUPS.flatMap(group=>group.cities);
const PRICES={Basic:{amount:29,bookings:2,key:'k52'},Plus:{amount:59,bookings:5,key:'k60'},Pro:{amount:99,bookings:10,key:'k67'}};
const PHONE='34673081311';
const LANGUAGE_STORAGE_KEY='onyx-language';
let language='en';
const form=document.getElementById('intake-form'),review=document.getElementById('message-review'),preview=document.getElementById('message-preview'),sendLink=document.getElementById('send-whatsapp');
const citySelect=document.getElementById('destination'),otherField=document.getElementById('other-city-field'),otherInput=document.getElementById('other-city-input');
const picker=document.getElementById('language-picker'),toggle=document.getElementById('language-toggle');
const menuToggle=document.querySelector('.menu-toggle'),navigation=document.getElementById('main-navigation');
let errorState=false, currentStep=1, whatsappOpened=false;
const referenceBytes=new Uint8Array(6);crypto.getRandomValues(referenceBytes);
const enquiryReference='ONYX-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+Array.from(referenceBytes,b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
document.getElementById('enquiry-reference').textContent=enquiryReference;
// Public hosted checkouts. Keep these exact package mappings in one place.
const PAYMENT_LINKS = {
 basic: 'https://checkout.revolut.com/payment-link/987bae1b-c067-48eb-9542-78784cdde2c6',
 plus: 'https://checkout.revolut.com/payment-link/02d3cff9-be67-4294-a15e-5e21b2f5a0d8',
 pro: 'https://checkout.revolut.com/payment-link/6a109dce-64cd-4827-9fd9-ef93ed28f378'
};
// Public hosted checkout enabled at the owner’s explicit request. Policy status is separate.
const CHECKOUT_ENABLED = true;
const consent=document.getElementById('accept-terms'), immediateConsent=document.getElementById('accept-immediate'), paymentLink=document.getElementById('continue-payment');
function t(key,parameters={}) {
 let value=translations[language][key]||translations.en[key]||key;
 if(key==='faq_cities_a')parameters={...parameters,cities:cityIds.map(id=>translations[language]['city_'+id]).join(language==='zh'?'、':', ')};
 return value.replace(/\{(\w+)\}/g,(match,name)=>parameters[name]===undefined?match:String(parameters[name]));
}
function normalizeLanguage(value){if(value==='pt-BR')return 'pt';if(value==='zh-Hans'||value==='zh-CN')return 'zh';return Object.prototype.hasOwnProperty.call(translations,value)?value:null;}
function applyLanguage(next,{save=false,updateURL=false}={}){
 language=normalizeLanguage(next)||'en';
 document.documentElement.lang=language==='zh'?'zh-Hans':language;
 document.documentElement.dir=language==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-i18n]').forEach(element=>{element.textContent=t(element.dataset.i18n);});
 document.querySelectorAll('[data-i18n-placeholder]').forEach(element=>element.setAttribute('placeholder',t(element.dataset.i18nPlaceholder)));
 document.querySelectorAll('[data-i18n-aria-label]').forEach(element=>element.setAttribute('aria-label',t(element.dataset.i18nAriaLabel)));
 document.title=t('title');
 document.querySelector('meta[name="description"]').content=t('description');
 document.querySelector('meta[property="og:title"]').content=t('title');
 document.querySelector('meta[property="og:description"]').content=t('description');
 document.querySelector('meta[property="og:locale"]').content={en:'en_GB',es:'es_ES',ca:'ca_ES',pt:'pt_PT',de:'de_DE',el:'el_GR',sv:'sv_SE',fr:'fr_FR',it:'it_IT',ar:'ar_SA',zh:'zh_CN'}[language];
 const selected=picker.querySelector('[data-language="'+language+'"]');
 document.getElementById('current-language').textContent=LANGUAGE_NAMES[language];
 document.getElementById('current-language').lang=document.documentElement.lang;
 toggle.querySelector('svg').replaceWith(selected.querySelector('svg').cloneNode(true));
 toggle.setAttribute('aria-label',t('language')+': '+LANGUAGE_NAMES[language]);
 picker.querySelector('ul').setAttribute('aria-label',t('language'));
 picker.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
 document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link=>{if(link.id!=='send-whatsapp')link.href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(t(link.closest('#creator-partners')?'creator':'general'));});
 if(save){try{localStorage.setItem(LANGUAGE_STORAGE_KEY,language);}catch(error){/* Selection still works if storage is unavailable. */}}
 if(updateURL&&/^https?:$/.test(location.protocol)){try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch(error){}}
 if(errorState)validate(currentStep,false);
 if(!review.hidden)buildMessage();
 syncPayment();
 if(!document.getElementById('consent-error').hidden)document.getElementById('consent-error').textContent=t('payment_consent_error');
 syncInfoLinks();
 scheduleBarUpdate();
}
function updateCity(){
 const other=citySelect.value==='other';otherField.hidden=!other;otherInput.disabled=!other;otherInput.required=other;
 document.querySelectorAll('[data-city]').forEach(link=>{if(link.dataset.city===citySelect.value)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
}
function updatePets(){const yes=form.elements.pets.value==='Yes';document.getElementById('pet-details-field').hidden=!yes;form.elements.petDetails.disabled=!yes;form.elements.petDetails.required=yes;}
function invalidateRequest(){whatsappOpened=false;consent.checked=false;immediateConsent.checked=false;document.getElementById('consent-error').hidden=true;syncPayment();}
function showStep(step,focus=true){
 currentStep=step;form.hidden=step===3;review.hidden=step!==3;
 document.getElementById('search-step').hidden=step!==1;document.getElementById('package-step').hidden=step!==2;
 for(let i=1;i<=3;i++){const el=document.getElementById('progress-'+i);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');}
 clearErrors();if(step===3)buildMessage();
 if(focus)document.getElementById({1:'search-heading',2:'package-heading',3:'review-heading'}[step]).focus();
}
function clearErrors(){
 document.querySelectorAll('#intake-form .field-error').forEach(el=>el.remove());
 for(const el of form.querySelectorAll('[aria-invalid]')){el.removeAttribute('aria-invalid');const ids=(el.getAttribute('aria-describedby')||'').split(' ').filter(id=>id&&!id.startsWith('error-'));if(ids.length)el.setAttribute('aria-describedby',ids.join(' '));else el.removeAttribute('aria-describedby');}
 document.getElementById('form-error-summary').hidden=true;
}
function validate(step,focus=true){
 clearErrors();let first=null;const seen=new Set();
 for(const input of form.elements){
  if(!input.name||input.name==='acceptTerms'||input.disabled||!input.willValidate||seen.has(input.name))continue;
  const group=input.closest('[data-step]');if(step&&(!group||Number(group.dataset.step)!==step))continue;
  seen.add(input.name);const value=input.type==='radio'?form.elements[input.name].value:input.value;let message='';const label=t(input.dataset.labelKey||'error_heading');
  if(input.required&&!String(value).trim())message=t('error_required',{field:label});
  else if(input.type==='email'&&value&&input.validity.typeMismatch)message=t('error_email');
  else if(!input.validity.valid)message=t('error_invalid',{field:label});
  if(message){first=first||input;const error=document.createElement('span');error.className='field-error';error.id='error-'+input.name;error.textContent=message;const wrapper=input.type==='radio'?input.closest('fieldset'):input.closest('label');wrapper.append(error);const fields=input.type==='radio'?[...form.querySelectorAll('[name="'+input.name+'"]')]:[input];fields.forEach(field=>{field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',[field.getAttribute('aria-describedby'),error.id].filter(Boolean).join(' '));});}
 }
 errorState=Boolean(first);if(first){document.getElementById('form-error-summary').textContent=t('error_heading');document.getElementById('form-error-summary').hidden=false;if(focus){const step=Number(first.closest('[data-step]').dataset.step);if(step!==currentStep){showStep(step,false);validate(step,false);}first.focus();}}
 return !first;
}
function currentData(){const data=new FormData(form);return Object.fromEntries([...data].map(([key,value])=>[key,String(value).trim()]));}
function searchRows(data){
 const city=data.city==='other'?data.otherCity:t('city_'+data.city);
 const type=t({Room:'k156',Studio:'k157',Apartment:'k158'}[data.homeType]||'k155');
 const rows=[['destination_label',city],['k154',type],['budget_label',data.budget+' '+data.currency+' / '+t('per_month')],['k160',data.areas],['k161',data.moveDate],['k162',data.stay],['k163',data.occupants],['k164',t(data.pets==='Yes'?'yes':'no')]];
 if(data.pets==='Yes'&&data.petDetails)rows.push(['pet_details',data.petDetails]);
 for(const key of ['requirements','avoid'])if(data[key])rows.push([key==='requirements'?'k166':'k169',data[key]]);
 return rows.filter(([,v])=>v);
}
function appendText(parent,tag,text,className){const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;parent.append(node);return node;}
function buildMessage(){
 const data=currentData(),pack=PRICES[data.package];if(!pack)return;
 const rows=searchRows(data),contact=[['k151',data.fullName],['k153',data.email],['k152',data.phone]];
 const lines=[t('greeting'),t('reference_label')+': '+enquiryReference,'',t('contact_details'),...contact.map(([k,v])=>t(k)+': '+v),'',t('your_search'),...rows.map(([k,v])=>t(k)+': '+v),'',t('your_package'),data.package+' — €'+pack.amount,t('booking_total',{count:pack.bookings})];
 if(data.creatorCode)lines.push('',t('creator_label')+': '+data.creatorCode,t('bonus_potential'),t('creator_verify'));
 lines.push('',t('period_review'),t('period_start'),'',t('closing'));preview.value=lines.join('\n');sendLink.href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(preview.value);
 const summary=document.getElementById('search-summary');summary.replaceChildren();for(const [heading,list]of [['your_search',rows],['contact_details',contact]]){appendText(summary,'h4',t(heading));const dl=appendText(summary,'dl','','summary-list');for(const [k,v]of list){appendText(dl,'dt',t(k));appendText(dl,'dd',v);}}
 const p=document.getElementById('package-summary');p.replaceChildren();appendText(p,'h4',data.package+' — €'+pack.amount);appendText(p,'p',t('booking_total',{count:pack.bookings}));
 if(data.creatorCode){const bonus=appendText(p,'div','','creator-bonus');appendText(bonus,'p',t('creator_label')+': '+data.creatorCode);appendText(bonus,'p',t('bonus_potential'));appendText(bonus,'p',t('bonus_total',{count:pack.bookings+1}));appendText(bonus,'p',t('creator_verify'),'micro');appendText(bonus,'p',t('price_unchanged'),'micro');}
 syncPayment();
}
function checkConsent(){const ok=consent.checked&&immediateConsent.checked,error=document.getElementById('consent-error');error.hidden=ok;[consent,immediateConsent].forEach(input=>{if(input.checked){input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');}else{input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby','consent-error');}});if(!ok){error.textContent=t('payment_consent_error');(!consent.checked?consent:immediateConsent).focus();}return ok;}
function selectedPaymentURL(){return PAYMENT_LINKS[String(form.elements.package.value).toLowerCase()]||null;}
function syncPayment(){
 const pack=PRICES[form.elements.package.value];document.getElementById('payment-stage').hidden=!whatsappOpened;
 document.getElementById('payment-selection').textContent=pack?t('payment_selection',{package:form.elements.package.value,amount:pack.amount}):'';
 const code=String(form.elements.creatorCode.value||'').trim();document.getElementById('payment-bookings').textContent=pack?t('booking_total',{count:pack.bookings})+(code?' · '+t('bonus_total',{count:pack.bookings+1}):''):'';
 const enabled=CHECKOUT_ENABLED&&whatsappOpened&&consent.checked&&immediateConsent.checked&&currentStep===3&&Boolean(pack);
 paymentLink.setAttribute('aria-disabled',String(!enabled));paymentLink.setAttribute('role','link');paymentLink.tabIndex=0;
 if(enabled)paymentLink.href=selectedPaymentURL();else paymentLink.removeAttribute('href');

}
form.addEventListener('submit',event=>{event.preventDefault();if(currentStep===1)document.getElementById('next-package').click();else if(currentStep===2)document.getElementById('review-button').click();});
form.addEventListener('input',event=>{if(event.target.name==='acceptTerms')return;invalidateRequest();if(errorState)validate(currentStep,false);});
form.addEventListener('change',event=>{if(event.target.name==='acceptTerms')return;updateCity();updatePets();invalidateRequest();if(errorState)validate(currentStep,false);});
[consent,immediateConsent].forEach(input=>input.addEventListener('change',()=>{if(!document.getElementById('consent-error').hidden)checkConsent();syncPayment();}));
document.getElementById('next-package').addEventListener('click',()=>{if(validate(1))showStep(2);});
document.getElementById('back-search').addEventListener('click',()=>showStep(1));
document.getElementById('review-button').addEventListener('click',()=>{if(validate(0))showStep(3);});
document.getElementById('edit-message').addEventListener('click',()=>{invalidateRequest();showStep(1);});
document.getElementById('change-package').addEventListener('click',()=>{invalidateRequest();showStep(2);});
document.querySelectorAll('[data-city]').forEach(link=>link.addEventListener('click',()=>{citySelect.value=link.dataset.city;updateCity();invalidateRequest();showStep(1);citySelect.focus({preventScroll:true});}));
document.querySelectorAll('[data-package]').forEach(link=>link.addEventListener('click',()=>{form.elements.package.value=link.dataset.package;invalidateRequest();showStep(1);}));
sendLink.addEventListener('click',event=>{if(!validate(0)){event.preventDefault();return;}buildMessage();whatsappOpened=true;syncPayment();});
paymentLink.addEventListener('keydown',event=>{if(event.key==='Enter'&&!paymentLink.hasAttribute('href')){event.preventDefault();checkConsent();}});
paymentLink.addEventListener('click',event=>{if(!CHECKOUT_ENABLED||!whatsappOpened||currentStep!==3||!checkConsent()||!validate(0)){event.preventDefault();return;}paymentLink.href=selectedPaymentURL();});
for(const a of document.querySelectorAll('a[href="#service-terms"],a[href="#privacy-policy"],a[href="#refund-policy"],a[href="#payment-policy"]'))a.addEventListener('click',()=>{const section=document.querySelector(a.getAttribute('href'));section.open=true;});
picker.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{applyLanguage(button.dataset.language,{save:true,updateURL:true});picker.open=false;toggle.focus();}));
document.addEventListener('click',event=>{if(!picker.contains(event.target))picker.open=false;});
picker.addEventListener('keydown',event=>{if(event.key==='Escape'){picker.open=false;toggle.focus();event.preventDefault();}});
menuToggle.addEventListener('click',()=>{const open=navigation.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));});
navigation.addEventListener('click',event=>{if(event.target.closest('a[href^="#"]')){navigation.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');}});
navigation.addEventListener('keydown',event=>{if(event.key==='Escape'&&!picker.open){navigation.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.focus();}});
const mobileBar=document.getElementById('mobile-cta'),sections=['hero','start','final-cta'].map(id=>document.getElementById(id));let scheduled=false;
function updateMobileBar(){const inView=sections.some(section=>{const r=section.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;});mobileBar.hidden=inView||innerWidth>700;}
function scheduleBarUpdate(){if(!scheduled){scheduled=true;requestAnimationFrame(()=>{updateMobileBar();scheduled=false;});}}
window.addEventListener('scroll',scheduleBarUpdate,{passive:true});window.addEventListener('resize',scheduleBarUpdate);
function syncInfoLinks(){document.querySelectorAll('[data-info-path]').forEach(a=>{a.setAttribute('href',a.dataset.infoPath+'?lang='+encodeURIComponent(language));});}
const parameters=new URLSearchParams(location.search);let saved=null;try{saved=localStorage.getItem(LANGUAGE_STORAGE_KEY);}catch(error){}
const initial=normalizeLanguage(parameters.get('lang'))||normalizeLanguage(saved)||'en';
const initialCity=parameters.get('city');if(cityIds.includes(initialCity)||initialCity==='other')citySelect.value=initialCity;
// A referral only pre-fills editable text. It is never treated as validation.
const ref=parameters.get('ref');if(ref)form.elements.creatorCode.value=ref.replace(/[\u0000-\u001f\u007f]/g,'').slice(0,60);
updateCity();updatePets();showStep(1,false);document.getElementById('intake-ui').hidden=false;picker.hidden=false;document.documentElement.classList.add('js');
applyLanguage(initial,{save:true});updateMobileBar();
const partnerTabs=Array.from(document.querySelectorAll('.partner-tabs [role="tab"]'));
function selectPartner(tab,focus=false){partnerTabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();}
partnerTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectPartner(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='Home')next=0;else if(event.key==='End')next=partnerTabs.length-1;else if(event.key==='ArrowRight')next=(index+(document.documentElement.dir==='rtl'?-1:1)+partnerTabs.length)%partnerTabs.length;else if(event.key==='ArrowLeft')next=(index+(document.documentElement.dir==='rtl'?1:-1)+partnerTabs.length)%partnerTabs.length;if(next!==undefined){event.preventDefault();selectPartner(partnerTabs[next],true);}});});
})();
