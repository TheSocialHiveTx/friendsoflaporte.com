/**
 * Friends of La Porte Animal Shelter
 * main.js — shared across all pages
 */

/* ────────────────────────────────────────────
   NAVIGATION — hamburger + scroll shadow
──────────────────────────────────────────── */
(function initNav() {
  const nav       = document.querySelector('.site-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (!nav) return;

  /* Scroll shadow */
  const onScroll = () => {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger toggle */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    /* Close on link click */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        mobileMenu.setAttribute('aria-hidden', true);
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        mobileMenu.setAttribute('aria-hidden', true);
      }
    });
  }

  /* Active link highlight */
  const path = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Mark active if href is contained in current path
    if (
      (href !== '../' && href !== '/' && path.includes(href.replace('../', '').replace('./', ''))) ||
      (href.includes('home') && (path === '/' || path.endsWith('/') || path.endsWith('/home/')))  ||
      (path === '/' && href.includes('home'))
    ) {
      link.classList.add('active');
    }
  });
})();


/* ────────────────────────────────────────────
   STICKY CTA (homepage only)
──────────────────────────────────────────── */
(function initStickyCTA() {
  const sticky = document.getElementById('sticky-cta');
  if (!sticky) return;

  let shown = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 420 && !shown) {
      sticky.classList.add('visible');
      shown = true;
    } else if (window.scrollY <= 420 && shown) {
      sticky.classList.remove('visible');
      shown = false;
    }
  }, { passive: true });
})();


/* ────────────────────────────────────────────
   MEMBERSHIP FORM (become-a-member page)
   --------------------------------------------------------
   NOTE FOR DEVELOPERS:
   This is a static form with a mailto fallback.
   To connect it to a real backend, replace the submit
   handler with one of these integrations:

   1. Formspree:   action="https://formspree.io/f/YOUR_ID" method="POST"
   2. Netlify Forms: add netlify attribute to <form>
   3. Google Forms: redirect to Google Form URL
   4. Custom REST:  fetch('/api/membership', { method: 'POST', body: formData })
──────────────────────────────────────────── */
(function initMembershipForm() {
  const form    = document.getElementById('membership-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name   = document.getElementById('f-name')?.value.trim()  || '';
    const email  = document.getElementById('f-email')?.value.trim() || '';
    const phone  = document.getElementById('f-phone')?.value.trim() || '';
    const why    = document.getElementById('f-why')?.value.trim()   || '';

    /* Basic validation */
    if (!name || !email) {
      alert('Please fill in your full name and email address.');
      return;
    }

    /* — STATIC FALLBACK: open mailto — */
    const subject = encodeURIComponent('Membership Interest — Friends of La Porte Animal Shelter');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nWhy I want to join:\n${why}`
    );
    window.location.href = `mailto:info@friendsoflaporte.org?subject=${subject}&body=${body}`;

    /* Show success state */
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
})();


/* ────────────────────────────────────────────
   SMOOTH SCROLL for anchor links
──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ────────────────────────────────────────────
   INTERSECTION OBSERVER — fade-in on scroll
──────────────────────────────────────────── */
(function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
    .fade-in-delay-1 { transition-delay: 0.1s; }
    .fade-in-delay-2 { transition-delay: 0.2s; }
    .fade-in-delay-3 { transition-delay: 0.3s; }
    .fade-in-delay-4 { transition-delay: 0.4s; }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();
