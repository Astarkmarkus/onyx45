/* Scroll progress is reversible and decorative; all copy is ordinary document content. */
(()=>{
 const hero=document.querySelector('.landscape-hero');
 if(!hero||!window.requestAnimationFrame||navigator.connection?.saveData)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width:760px)');
 const word=hero.querySelector('.landscape-word'),media=hero.querySelector('.landscape-media'),image=media.querySelector('img'),soft=media.querySelector('.landscape-soft');
 let queued=false,visible=true,progress=null;
 const reset=()=>{word.style.transform='';word.style.opacity='';media.style.opacity='';image.style.transform='';if(soft)soft.style.opacity='';};
 const update=()=>{queued=false;if(reduce.matches){progress=null;reset();return;}if(!visible)return;const r=hero.getBoundingClientRect(),target=Math.max(0,Math.min(1,-r.top/r.height));if(progress===null||Math.abs(target-progress)<.0007)progress=target;else progress+=(target-progress)*(compact.matches ? .22 : .16);const p=progress;word.style.transform=`translateY(${p*(compact.matches?22:70)}px)`;word.style.opacity=String(1-p*.75);media.style.opacity=String(1-Math.max(0,(p-.85)/.15)*.8);if(soft)soft.style.opacity=compact.matches?'0':String(Math.min(1,p*2));if(!compact.matches)image.style.transform=`translateY(${p*65}px) scale(1.03)`;if(progress!==target)schedule();};
 const schedule=()=>{if(!queued&&visible){queued=true;requestAnimationFrame(update);}};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduce.addEventListener('change',()=>{reset();schedule();});compact.addEventListener('change',()=>{reset();schedule();});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();},{rootMargin:'100px'}).observe(hero);
 schedule();
})();

// Animate sections only on arrival. Content is never hidden while waiting for JS or an observer.
(()=>{
 if(!window.IntersectionObserver||!window.matchMedia||navigator.connection?.saveData)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return;
 const targets=[...document.querySelectorAll('main>.heritage-intro,main>.consult-flow,main>.consult-model,main>.heritage-why,main>.final-cta,main>.page-intro,main>.founder-story,main>.founder-meaning,main>.founder-vision,main>.service-detail,main>.contact-layout,.heritage-service-grid>article,.consult-timeline>li,.heritage-engagement-grid>article')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);if(reduced.matches||entry.target.contains(document.activeElement)||entry.boundingClientRect.bottom<0)continue;entry.target.classList.add('motion-reveal');}},{threshold:0,rootMargin:'0px 0px -32px 0px'});
 targets.forEach((target,i)=>{target.style.setProperty('--reveal-delay',`${i%3*45}ms`);target.addEventListener('animationend',()=>target.classList.remove('motion-reveal'),{once:true});target.addEventListener('focusin',()=>target.classList.remove('motion-reveal'));observer.observe(target);});
 reduced.addEventListener('change',e=>{if(e.matches){observer.disconnect();targets.forEach(target=>target.classList.remove('motion-reveal'));}});
})();
