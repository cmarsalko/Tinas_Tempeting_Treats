document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger Menu ──
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('primaryNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Filter Buttons (treats page) ──
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('.card[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        filterCards.forEach(card => {
          const show = filter === 'all' || (card.dataset.category || '').split(' ').includes(filter);
          if (show) {
            card.style.display = '';
            requestAnimationFrame(() => card.classList.add('visible'));
          } else {
            card.classList.remove('visible');
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // ── Scroll Reveal ──
  const revealCards = document.querySelectorAll('.card');
  if ('IntersectionObserver' in window && revealCards.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealCards.forEach(card => observer.observe(card));
  } else {
    revealCards.forEach(card => card.classList.add('visible'));
  }

});