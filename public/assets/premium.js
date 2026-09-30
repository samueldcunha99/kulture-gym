(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  header.append(progress);
  const parallax = !reduced && matchMedia('(pointer:fine) and (min-width:901px)').matches;
  let pending = false;
  const update = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
    header.classList.toggle('is-scrolled', scrollY > 24);
    if (hero && parallax) hero.style.setProperty('--hero-shift', Math.min(scrollY * .055, 30) + 'px');
    pending = false;
  };
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize', update);
  addEventListener('pageshow', update);
  update();
  if (reduced || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('premium-visible');
      observer.unobserve(entry.target);
    }
  }, {threshold:.06});
  const mark = () => document.querySelectorAll('.premium-reveal,.trainer-card,.live-services article,.gallery-item,.four-plans .plan,.schedule-card').forEach((el,index) => {
    if (el.dataset.motionReady) return;
    el.dataset.motionReady = '1';
    el.classList.add('premium-motion');
    el.style.setProperty('--motion-delay', Math.min(index % 4, 3) * 60 + 'ms');
    observer.observe(el);
  });
  mark();
  const mutations = new MutationObserver(mark);
  mutations.observe(document.querySelector('main'), {childList:true,subtree:true});
  // Preserve observers when the browser caches a page for Back navigation.
  addEventListener('pagehide', event => { if (!event.persisted) { mutations.disconnect(); observer.disconnect(); } });
})();
