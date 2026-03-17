/* ============================================================
   FRESHLY MULCHED — V3: Clean & Minimal — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. STICKY NAV + SCROLL SHADOW
  ────────────────────────────────────────────── */
  const nav = document.querySelector('.nav');

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  if (nav) {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* ──────────────────────────────────────────────
     2. MOBILE HAMBURGER MENU
  ────────────────────────────────────────────── */
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  function toggleMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      toggleMenu(!isOpen);
    });
  }

  // Close on link click
  document.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  /* ──────────────────────────────────────────────
     3. ACTIVE NAV LINK HIGHLIGHTING
  ────────────────────────────────────────────── */
  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      const isActive =
        linkFile === currentPath ||
        (currentPath === '' && linkFile === 'index.html') ||
        (currentPath === 'index.html' && href === 'index.html');
      link.classList.toggle('active', isActive && !link.classList.contains('nav__cta'));
    });

    document.querySelectorAll('.nav__mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      const isActive =
        linkFile === currentPath ||
        (currentPath === '' && linkFile === 'index.html');
      link.classList.toggle('active', isActive);
    });
  }

  setActiveNavLink();

  /* ──────────────────────────────────────────────
     4. SMOOTH SCROLL FOR ANCHOR LINKS
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      toggleMenu(false);
    });
  });

  /* ──────────────────────────────────────────────
     5. SCROLL REVEAL (IntersectionObserver)
  ────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  document.querySelectorAll('.reveal-stagger').forEach(container => {
    container.querySelectorAll(':scope > *').forEach(child => {
      child.classList.add('reveal');
      revealObserver.observe(child);
    });
  });

  /* ──────────────────────────────────────────────
     6. PRODUCT FILTER (products.html)
  ────────────────────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const productCards  = document.querySelectorAll('.product-card[data-category]');

  if (filterBtns.length && productCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;

        productCards.forEach(card => {
          const category = card.dataset.category;
          const show = filter === 'all' || category === filter;

          if (show) {
            card.style.display = '';
            card.classList.remove('visible');
            setTimeout(() => card.classList.add('visible'), 20);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ──────────────────────────────────────────────
     7. FAQ ACCORDION
  ────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer   = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isOpen = question.classList.contains('open');

        // Close all
        faqItems.forEach(other => {
          const oQ = other.querySelector('.faq-question');
          const oA = other.querySelector('.faq-answer');
          if (oQ && oA) {
            oQ.classList.remove('open');
            oQ.setAttribute('aria-expanded', 'false');
            oA.classList.remove('open');
            oA.setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle current
        if (!isOpen) {
          question.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
          answer.classList.add('open');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  /* ──────────────────────────────────────────────
     7b. SERVICE ACCORDION (services.html)
  ────────────────────────────────────────────── */
  const serviceAccItems = document.querySelectorAll('.service-acc-item');

  if (serviceAccItems.length) {
    serviceAccItems.forEach(item => {
      const header = item.querySelector('.service-acc-header');
      const body   = item.querySelector('.service-acc-body');
      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isOpen = header.classList.contains('open');

        // Close all
        serviceAccItems.forEach(other => {
          const oH = other.querySelector('.service-acc-header');
          const oB = other.querySelector('.service-acc-body');
          if (oH && oB) {
            oH.classList.remove('open');
            oB.classList.remove('open');
          }
        });

        // Toggle current
        if (!isOpen) {
          header.classList.add('open');
          body.classList.add('open');
        }
      });
    });
  }

  /* ──────────────────────────────────────────────
     8. CONTACT FORM HANDLING
  ────────────────────────────────────────────── */
  document.querySelectorAll('form.contact-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '.7';
      }

      // Simulate submission
      setTimeout(() => {
        const successMsg = document.createElement('div');
        successMsg.className = 'notice-box';
        successMsg.style.marginTop = '16px';
        successMsg.innerHTML = '<strong>Thank you! Your message has been received.</strong><br>We\'ll be in touch within 1 business day. For urgent requests, call us at <a href="tel:+15555551234">(555) 555-1234</a>.';

        form.appendChild(successMsg);
        form.reset();

        if (submitBtn) {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
        }

        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => successMsg.remove(), 8000);
      }, 1200);
    });
  });

  /* ──────────────────────────────────────────────
     9. STAT COUNTER ANIMATION
  ────────────────────────────────────────────── */
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.dataset.count || '';
          const suffix = el.dataset.suffix || '';
          const num = parseInt(raw, 10);
          if (!isNaN(num) && num > 0) {
            animateCounter(el, num, suffix);
          }
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(el => {
    statObserver.observe(el);
  });

  /* ──────────────────────────────────────────────
     10. CURRENT YEAR IN FOOTER
  ────────────────────────────────────────────── */
  const yearSpans = document.querySelectorAll('.js-year');
  const thisYear  = new Date().getFullYear();
  yearSpans.forEach(s => { s.textContent = thisYear; });

})();
