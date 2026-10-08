'use strict';
(() => {
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionChoice=null;
  try{motionChoice=localStorage.getItem('douro-motion');}catch{}
  const reduced={get matches(){return motionChoice==='on'?false:motionChoice==='off'?true:systemMotion.matches;},addEventListener:(...args)=>systemMotion.addEventListener(...args)};
  const seen = new WeakSet();
  const active = new Set();
  const playing = new WeakMap();
  const motionToggle=document.createElement('button');
  motionToggle.type='button';
  motionToggle.className='motion-toggle';
  function labelMotion(){
    const en=document.documentElement.lang==='en';
    motionToggle.textContent=reduced.matches?(en?'▶ Enable motion':'▶ Ativar animações'):(en?'Ⅱ Pause motion':'Ⅱ Pausar animações');
    motionToggle.setAttribute('aria-pressed',String(!reduced.matches));
  }
  motionToggle.addEventListener('click',()=>{
    motionChoice=reduced.matches?'on':'off';
    try{localStorage.setItem('douro-motion',motionChoice);}catch{}
    if(reduced.matches)active.forEach(animation=>animation.cancel());
    labelMotion();schedule();
  });
  document.body.append(motionToggle);
  labelMotion();
  new MutationObserver(labelMotion).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  systemMotion.addEventListener('change',labelMotion);
  const selectors = '.section-heading,.service-card,.route-layout,.builder,.about>img,.about>div,.contact-invite,.faq-section>div,.booking-intro,#booking-form,.footer-logos';
  function animate(element, frames, options) {
    if (reduced.matches || !element.animate) return;
    playing.get(element)?.cancel();
    const animation = element.animate(frames, options);
    playing.set(element,animation);
    active.add(animation);
    animation.finished.catch(() => {}).finally(() => active.delete(animation));
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target.matches('.service-card');
      const image = entry.target.matches('.about>img');
      const index = card ? [...entry.target.parentElement.children].indexOf(entry.target) : 0;
      animate(entry.target, [
        {opacity:0,transform:image?'translateX(-45px) scale(.96)':'translateY(58px) scale(.96)'},
        {opacity:1,transform:'translate(0,0) scale(1)'}
      ], {duration:1050,delay:card ? index*150 : 0,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'});
    });
  }, {threshold:0.14}) : null;
  function watch() {
    document.querySelectorAll(selectors).forEach(element => {
      if (seen.has(element)) return;
      seen.add(element);
      observer?.observe(element);
    });
  }
  watch();
  // Newly rendered routes and translated cards receive the same entrance effect.
  new MutationObserver(watch).observe(document.querySelector('main'),{childList:true,subtree:true});
  document.querySelectorAll('[name="duration"],[name="interest"]').forEach(input => {
    input.addEventListener('change',() => {
      const output=document.querySelector('#itinerary');
      if(output)animate(output,[{opacity:.45,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
    });
  });
  reduced.addEventListener('change',() => {if(reduced.matches)active.forEach(animation=>animation.cancel());});
  const progress=document.createElement('div');
  progress.className='reading-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.append(progress);
  const back=document.createElement('button');
  back.type='button';
  back.className='back-to-top';
  back.textContent='↑';
  function labelBack(){back.setAttribute('aria-label',document.documentElement.lang==='en'?'Back to top':'Voltar ao topo');}
  labelBack();
  new MutationObserver(labelBack).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  back.addEventListener('click',()=>{
    const home=document.querySelector('.top>a');
    home?.focus({preventScroll:true});
    scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
  });
  document.body.append(back);
  const header=document.querySelector('.top');
  let scrollScenes=[];
  const sceneSelectors='.hero-photo,.service-photo img,.route-image img,.about>img';
  function collectScenes(){
    scrollScenes=[...document.querySelectorAll(sceneSelectors)].map(element=>({element,container:element.closest('.hero,.service-photo,.route-image')||element}));
    schedule();
  }
  new MutationObserver(collectScenes).observe(document.querySelector('main'),{childList:true,subtree:true});
  let queued=false;
  function update(){
    const distance=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${distance>0?Math.min(1,Math.max(0,scrollY/distance)):0})`;
    header?.classList.toggle('is-scrolled',scrollY>24);
    back.classList.toggle('is-visible',scrollY>innerHeight*.75);
    back.tabIndex=scrollY>innerHeight*.75?0:-1;
    scrollScenes.forEach(({element,container})=>{
      if(reduced.matches){element.style.removeProperty('translate');element.style.removeProperty('scale');return;}
      const rect=container.getBoundingClientRect();
      if(rect.bottom<0||rect.top>innerHeight)return;
      const position=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/(innerHeight/2+rect.height/2)));
      const hero=element.matches('.hero-photo');
      const about=element.matches('.about>img');
      const travel=hero?48:about?14:24;
      element.style.translate=`0 ${Math.round(position*travel)}px`;
      element.style.scale=about?'1':hero?'1.12':'1.16';
    });
    queued=false;
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  if('ResizeObserver' in window)new ResizeObserver(schedule).observe(document.body);
  reduced.addEventListener('change',schedule);
  collectScenes();
  update();
})();

