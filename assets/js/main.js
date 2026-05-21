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
  const form    = document.getElementById('membership-form-el');
  const success = document.getElementById('form-success');
  if (!form) return;

  /* Show/hide parent-guardian section when Junior tier is selected */
  const juniorRadio   = document.getElementById('tier-radio-junior');
  const guardianSection = document.getElementById('guardian-section');
  if (juniorRadio && guardianSection) {
    document.querySelectorAll('input[name="membership_tier"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const isJunior = juniorRadio.checked;
        guardianSection.style.display = isJunior ? 'block' : 'none';
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('f-name')?.value.trim()  || '';
    const dob     = document.getElementById('f-dob')?.value.trim()   || '';
    const email   = document.getElementById('f-email')?.value.trim() || '';
    const waiver  = document.getElementById('f-waiver')?.checked;
    const skills  = document.getElementById('f-skills')?.value.trim() || '';
    const guardian = document.getElementById('f-guardian-name')?.value.trim() || '';

    /* Determine selected tier */
    const tierEl  = document.querySelector('input[name="membership_tier"]:checked');
    const tierMap = { standard_50: '$50 Standard', senior_25: '$25 Senior (65+)', junior_15: '$15 Junior (1–17)' };
    const tier    = tierEl ? (tierMap[tierEl.value] || tierEl.value) : '';

    /* Basic validation */
    if (!name || !email) {
      alert('Please fill in your full name and email address.');
      return;
    }
    if (!tier) {
      alert('Please select a membership type.');
      return;
    }
    if (!waiver) {
      alert('Please agree to the FLPAS Liability Waiver to continue.');
      return;
    }

    /* Formspree AJAX Submission */
    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch('https://formspree.io/f/mnjllalv', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            alert(data["errors"].map(error => error["message"]).join(", "));
          } else {
            alert("Oops! There was a problem submitting your form.");
          }
        })
      }
    }).catch(error => {
      alert("Oops! There was a problem submitting your form.");
    }).finally(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
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


/* ────────────────────────────────────────────
   DONATE MODAL
──────────────────────────────────────────── */
(function initDonateModal() {
  const fab     = document.getElementById('donate-fab');
  const overlay = document.getElementById('donate-overlay');
  const closeBtn = document.getElementById('donate-modal-close');
  if (!fab || !overlay) return;

  const open  = () => overlay.classList.add('open');
  const close = () => overlay.classList.remove('open');

  fab.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);

  /* Click outside modal card closes it */
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  /* Escape key closes it */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* ────────────────────────────────────────────
   TEAM MODAL (our-team page)
──────────────────────────────────────────── */
(function initTeamModal() {
  const cards = document.querySelectorAll('.team-card');
  const overlay = document.getElementById('team-modal-overlay');
  const closeBtn = document.getElementById('team-modal-close');
  
  if (!overlay || cards.length === 0) return;

  const modalImg = document.getElementById('team-modal-img');
  const modalName = document.getElementById('team-modal-name');
  const modalRole = document.getElementById('team-modal-role');
  const modalBio = document.getElementById('team-modal-bio');
  const teamData = document.getElementById('team-data');

  const openModal = (card) => {
    const memberId = card.getAttribute('data-member');
    const name = card.querySelector('.team-card__name').textContent;
    const role = card.querySelector('.team-card__role').textContent;
    const imgSrc = card.querySelector('.team-card__img').getAttribute('src');
    
    // Find bio content
    const bioContent = teamData.querySelector(`[data-member-id="${memberId}"]`);
    
    if (bioContent) {
      modalBio.innerHTML = bioContent.innerHTML;
    } else {
      modalBio.innerHTML = '';
    }

    modalImg.src = imgSrc;
    modalImg.alt = name;
    modalName.textContent = name;
    modalRole.textContent = role;

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    // Restore scrolling
    document.body.style.overflow = '';
  };

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
})();

/** ═══════════════════════════════════════
 *  SCROLL ANIMATIONS (FADE-IN)
 *  ════════════════════════════════════════ */
(function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (!fadeElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
})();



/** ═══════════════════════════════════════
 *  T-SHIRT PROMO MODAL (BECOME A MEMBER)
 *  ════════════════════════════════════════ */
(function initTshirtModal() {
  const tshirtOverlay = document.getElementById('tshirt-modal');
  if (!tshirtOverlay) return;

  const closeBtn = tshirtOverlay.querySelector('.promo-modal__close');
  const joinBtn = document.getElementById('tshirt-modal-join');
  
  const closeTshirt = () => {
    tshirtOverlay.classList.remove('active');
    tshirtOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openTshirt = () => {
    tshirtOverlay.classList.add('active');
    tshirtOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  // Check if user has already seen the promo in this session
  if (!sessionStorage.getItem('tshirtPromoSeen')) {
    // Show promo after a slight delay for better UX
    setTimeout(() => {
      openTshirt();
      sessionStorage.setItem('tshirtPromoSeen', 'true');
    }, 800);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeTshirt);
  if (joinBtn) joinBtn.addEventListener('click', closeTshirt);
  
  tshirtOverlay.addEventListener('click', (e) => {
    if (e.target === tshirtOverlay) closeTshirt();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tshirtOverlay.classList.contains('active')) {
      closeTshirt();
    }
  });
})();
