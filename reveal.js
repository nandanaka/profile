// Smooth scroll-reveal via IntersectionObserver.
// Each .reveal element gets `is-in` when 12% of it is visible.
// Optional per-element delay via data-delay="ms".
// Elements with [data-typewriter] also stream their text in once visible.

(() => {
  const items = document.querySelectorAll('.reveal');

  items.forEach((el) => {
    const d = el.dataset.delay;
    if (d) el.style.setProperty('--reveal-delay', `${d}ms`);
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const typeInto = (host) => {
    const target = host.querySelector('.tagline__text') || host;
    const full = host.dataset.typewriter || '';
    if (reduced) {
      target.textContent = full;
      host.classList.add('is-typed');
      return;
    }
    let i = 0;
    const speed = 32;
    const tick = () => {
      target.textContent = full.slice(0, i);
      if (i < full.length) {
        i += 1;
        setTimeout(tick, speed);
      } else {
        host.classList.add('is-typed');
      }
    };
    const startDelay = parseInt(host.dataset.delay || '0', 10) + 250;
    setTimeout(tick, startDelay);
  };

  if (reduced) {
    items.forEach((el) => el.classList.add('is-in'));
    document.querySelectorAll('[data-typewriter]').forEach(typeInto);
  } else if (items.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            if (entry.target.dataset.typewriter) typeInto(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((el) => io.observe(el));
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
