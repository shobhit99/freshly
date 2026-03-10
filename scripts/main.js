/* ============================================================
   FRESHLY MULCHED — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. STICKY NAV + SCROLL CLASS
  ────────────────────────────────────────────── */
  const nav = document.querySelector('.nav');

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    } else {
      if (!nav.classList.contains('solid')) {
        nav.classList.remove('scrolled');
        nav.classList.add('transparent');
      }
    }
  }

  if (nav) {
    // Pages with solid nav (non-hero pages set .solid in HTML)
    if (!nav.classList.contains('solid')) {
      nav.classList.add('transparent');
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // run once on load
  }

  /* ──────────────────────────────────────────────
     2. MOBILE HAMBURGER MENU
  ────────────────────────────────────────────── */
  const hamburger   = document.querySelector('.nav__hamburger');
  const mobileMenu  = document.querySelector('.nav__mobile');

  function toggleMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      toggleMenu(!isOpen);
    });
  }

  // Close menu when a link is clicked
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

    // Desktop links
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      const isActive =
        linkFile === currentPath ||
        (currentPath === '' && linkFile === 'index.html') ||
        (currentPath === 'index.html' && href === 'index.html');
      link.classList.toggle('active', isActive);
    });

    // Mobile links
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
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // Also observe children of reveal-stagger containers
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
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterBtns.length && productCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        productCards.forEach(card => {
          const category = card.dataset.category;
          const show = filter === 'all' || category === filter;

          if (show) {
            card.style.display = '';
            // Re-trigger reveal animation
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
     7. FAQ ACCORDION (products.html)
  ────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer   = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isOpen = question.classList.contains('open');

        // Close all others
        faqItems.forEach(other => {
          const otherQ = other.querySelector('.faq-question');
          const otherA = other.querySelector('.faq-answer');
          if (otherQ && otherA) {
            otherQ.classList.remove('open');
            otherA.classList.remove('open');
          }
        });

        // Toggle current
        if (!isOpen) {
          question.classList.add('open');
          answer.classList.add('open');
        }
      });
    });
  }

  /* ──────────────────────────────────────────────
     8. CONTACT FORM HANDLING (basic UX)
  ────────────────────────────────────────────── */
  document.querySelectorAll('form.contact-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      // Simulate async submission
      setTimeout(() => {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'notice-box';
        successMsg.style.marginTop = '1rem';
        successMsg.style.borderLeftColor = 'var(--color-primary)';
        successMsg.innerHTML = `
          <strong>Thank you! Your message has been received.</strong><br>
          We'll be in touch within 1 business day. For urgent requests,
          call us at <a href="tel:+15555551234" style="color:var(--color-primary);font-weight:600;">(555) 555-1234</a>.
        `;

        form.appendChild(successMsg);
        form.reset();

        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }

        // Scroll to message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Remove after 8 seconds
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
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
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
          if (!isNaN(num)) {
            animateCounter(el, num, suffix);
          }
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-item__number[data-count]').forEach(el => {
    statObserver.observe(el);
  });

  /* ──────────────────────────────────────────────
     10. CURRENT YEAR IN FOOTER
  ────────────────────────────────────────────── */
  const yearSpans = document.querySelectorAll('.js-year');
  const thisYear  = new Date().getFullYear();
  yearSpans.forEach(s => { s.textContent = thisYear; });

})();
