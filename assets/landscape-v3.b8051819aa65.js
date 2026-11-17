/* Scroll progress is reversible and decorative; all copy is ordinary document content. */
(()=>{
 const hero=document.querySelector('.landscape-hero');
 if(!hero||!window.requestAnimationFrame||navigator.connection?.saveData)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width:760px)');
 const word=hero.querySelector('.landscape-word'),media=hero.querySelector('.landscape-media'),image=media.querySelector('img'),soft=media.querySelector('.landscape-soft');
 let queued=false,visible=true;
 const reset=()=>{word.style.transform='';word.style.opacity='';media.style.opacity='';image.style.transform='';if(soft)soft.style.opacity='';};
 const update=()=>{queued=false;if(reduce.matches){reset();return;}const r=hero.getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/r.height));word.style.transform=`translateY(${p*(compact.matches?22:70)}px)`;word.style.opacity=String(1-p*.75);media.style.opacity=String(1-Math.max(0,(p-.85)/.15)*.8);if(soft)soft.style.opacity=compact.matches?'0':String(Math.min(1,p*2));if(!compact.matches)image.style.transform=`translateY(${p*65}px) scale(1.03)`;};
 const schedule=()=>{if(!queued&&visible){queued=true;requestAnimationFrame(update);}};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduce.addEventListener('change',()=>{reset();schedule();});compact.addEventListener('change',()=>{reset();schedule();});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();},{rootMargin:'100px'}).observe(hero);
 schedule();
})();
