/* ============================================================
   FRESHLY MULCHED — Version 1: "Earth & Craft"
   Main JavaScript
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
    if (!nav.classList.contains('solid')) {
      nav.classList.add('transparent');
    }
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
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');
      toggleMenu(!isOpen);
    });
  }

  // Close menu on link click
  document.querySelectorAll('.nav__mobile-link').forEach(function (link) {
    link.addEventListener('click', function () { toggleMenu(false); });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
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
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      var isActive =
        linkFile === currentPath ||
        (currentPath === '' && linkFile === 'index.html') ||
        (currentPath === 'index.html' && href === 'index.html');
      link.classList.toggle('active', isActive);
    });

    document.querySelectorAll('.nav__mobile-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      var isActive =
        linkFile === currentPath ||
        (currentPath === '' && linkFile === 'index.html');
      link.classList.toggle('active', isActive);
    });
  }

  setActiveNavLink();

  /* ──────────────────────────────────────────────
     4. SMOOTH SCROLL FOR ANCHOR LINKS
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 0;
      var targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      toggleMenu(false);
    });
  });

  /* ──────────────────────────────────────────────
     5. SCROLL REVEAL (IntersectionObserver)
  ────────────────────────────────────────────── */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
    revealObserver.observe(el);
  });

  document.querySelectorAll('.reveal-stagger').forEach(function (container) {
    container.querySelectorAll(':scope > *').forEach(function (child) {
      child.classList.add('reveal');
      revealObserver.observe(child);
    });
  });

  /* ──────────────────────────────────────────────
     6. PRODUCT FILTER (products.html)
  ────────────────────────────────────────────── */
  var filterBtns   = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterBtns.length && productCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        var filter = btn.dataset.filter;

        productCards.forEach(function (card) {
          var category = card.dataset.category;
          var show = filter === 'all' || category === filter;

          if (show) {
            card.style.display = '';
            card.classList.remove('visible');
            setTimeout(function () { card.classList.add('visible'); }, 20);
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
  var faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length) {
    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer   = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = question.classList.contains('open');

        // Close all others
        faqItems.forEach(function (other) {
          var otherQ = other.querySelector('.faq-question');
          var otherA = other.querySelector('.faq-answer');
          if (otherQ && otherA) {
            otherQ.classList.remove('open');
            otherA.classList.remove('open');
            otherQ.setAttribute('aria-expanded', 'false');
            otherA.setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle current
        if (!isOpen) {
          question.classList.add('open');
          answer.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  /* ──────────────────────────────────────────────
     8. CONTACT FORM HANDLING
  ────────────────────────────────────────────── */
  document.querySelectorAll('form.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('[type="submit"]');
      var originalHTML = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      // Simulate async submission
      setTimeout(function () {
        var successMsg = document.createElement('div');
        successMsg.className = 'notice-box';
        successMsg.style.marginTop = '1rem';
        successMsg.style.borderLeftColor = 'var(--color-accent)';
        successMsg.innerHTML =
          '<strong>Thank you! Your message has been received.</strong><br>' +
          'We\'ll be in touch within 1 business day. For urgent requests, ' +
          'call us at <a href="tel:+15555551234" style="color:var(--color-accent);font-weight:600;">(555) 555-1234</a>.';

        form.appendChild(successMsg);
        form.reset();

        if (submitBtn) {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        }

        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(function () { successMsg.remove(); }, 8000);
      }, 1200);
    });
  });

  /* ──────────────────────────────────────────────
     9. STAT COUNTER ANIMATION
  ────────────────────────────────────────────── */
  function animateCounter(el, target, suffix) {
    var duration = 1800;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  var statObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var raw = el.dataset.count || '';
          var suffix = el.dataset.suffix || '';
          var num = parseInt(raw, 10);
          if (!isNaN(num) && num > 0) {
            animateCounter(el, num, suffix);
          }
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-item__number[data-count]').forEach(function (el) {
    statObserver.observe(el);
  });

  /* ──────────────────────────────────────────────
     10. CURRENT YEAR IN FOOTER
  ────────────────────────────────────────────── */
  var yearSpans = document.querySelectorAll('.js-year');
  var thisYear  = new Date().getFullYear();
  yearSpans.forEach(function (s) { s.textContent = thisYear; });

  /* ── BEFORE / AFTER SLIDER ── */
  document.querySelectorAll('[data-ba-slider]').forEach(slider => {
    const beforeImg = slider.querySelector('.ba-slider__before');
    const handle = slider.querySelector('.ba-slider__handle');
    if (!beforeImg || !handle) return;
    let isDragging = false;
    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      beforeImg.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }
    slider.addEventListener('mousedown', (e) => { e.preventDefault(); isDragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (!isDragging) return; setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    slider.addEventListener('touchstart', (e) => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchmove', (e) => { if (!isDragging) return; setPosition(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchend', () => { isDragging = false; });
  });

})();
