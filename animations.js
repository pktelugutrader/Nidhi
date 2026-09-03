/**
 * Alakaapuri Nidhi - Luxury Animations & 3D Interactive Engine
 * Lightweight, high-performance (60fps), zero external dependencies.
 */

(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgressBar();
    initBackToTop();
    initNavbarScroll();
    initScrollReveal();
    initNumberCounters();
    if (!prefersReducedMotion) {
      init3DTilt();
    }
  });

  /* ------------------------------------------------------------
     1. Scroll Progress Bar
     ------------------------------------------------------------ */
  function initScrollProgressBar() {
    let progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress-bar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    const updateProgress = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ------------------------------------------------------------
     2. Back to Top Button
     ------------------------------------------------------------ */
  function initBackToTop() {
    let btt = document.getElementById('backToTop');
    if (!btt) {
      btt = document.createElement('div');
      btt.id = 'backToTop';
      btt.className = 'back-to-top';
      btt.setAttribute('role', 'button');
      btt.setAttribute('aria-label', 'Back to top of page');
      btt.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
      document.body.appendChild(btt);
    }

    const toggleBtt = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      if (scrollPos > 320) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBtt, { passive: true });
    toggleBtt();

    btt.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------
     3. Header Elevation on Scroll
     ------------------------------------------------------------ */
  function initNavbarScroll() {
    const nav = document.querySelector('nav.top-nav') || document.querySelector('.site-header');
    if (!nav) return;

    const handleNavScroll = () => {
      if ((window.scrollY || document.documentElement.scrollTop) > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* ------------------------------------------------------------
     4. Scroll Reveal Animations (IntersectionObserver)
     ------------------------------------------------------------ */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-on-scroll, .reveal-stagger, .reveal-fade-left, .reveal-fade-right, .reveal-scale')
        .forEach(el => el.classList.add('is-visible'));
      return;
    }

    // Auto-mark key structural components if not already tagged
    const autoRevealContainers = [
      '.products-grid',
      '.why-grid',
      '.trust-grid',
      '.testimonials-grid',
      '.blog-grid',
      '.calculator-grid',
      '.review-grid'
    ];

    autoRevealContainers.forEach(selector => {
      document.querySelectorAll(selector).forEach(grid => {
        if (!grid.classList.contains('reveal-stagger')) {
          grid.classList.add('reveal-stagger');
        }
      });
    });

    const autoRevealElements = [
      '.section-header-center',
      '.profile-strip',
      '.cta-section',
      '.hero-content',
      '.hero-form-card',
      '.about-strip',
      '.faq-section'
    ];

    autoRevealElements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.classList.contains('reveal-on-scroll')) {
          el.classList.add('reveal-on-scroll');
        }
      });
    });

    const targets = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-stagger, .reveal-fade-left, .reveal-fade-right, .reveal-scale'
    );

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  /* ------------------------------------------------------------
     5. Animated Number Counters
     ------------------------------------------------------------ */
  function initNumberCounters() {
    const counterElements = document.querySelectorAll('[data-count], .trust-num, .counter');
    if (!counterElements.length) return;

    const animateCounter = (el) => {
      let target = parseFloat(el.getAttribute('data-count'));
      const text = el.textContent.trim();
      let suffix = el.getAttribute('data-suffix') || '';
      let prefix = el.getAttribute('data-prefix') || '';
      let decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

      // Fallback parsing if data-count is not explicitly set
      if (isNaN(target)) {
        const cleaned = text.replace(/[^0-9.]/g, '');
        target = parseFloat(cleaned);
        if (text.includes('+') && !suffix) suffix = '+';
        if (text.includes('Cr') && !suffix) suffix = ' Cr+';
        if (text.includes('%') && !suffix) suffix = '%';
        if (text.includes('₹') && !prefix) prefix = '₹';
        if (cleaned.includes('.')) {
          decimals = (cleaned.split('.')[1] || '').length;
        }
      }

      if (isNaN(target)) return;

      if (prefersReducedMotion) {
        el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : Math.round(target).toLocaleString()) + suffix;
        return;
      }

      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic formula
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;

        const formattedNumber = decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString();

        el.textContent = prefix + formattedNumber + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : Math.round(target).toLocaleString()) + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counterElements.forEach(el => counterObserver.observe(el));
    } else {
      counterElements.forEach(animateCounter);
    }
  }

  /* ------------------------------------------------------------
     6. Interactive 3D Card Tilt & Glare Effect
     ------------------------------------------------------------ */
  function init3DTilt() {
    // Disable on touch devices / narrow screens
    if ('ontouchstart' in window || window.innerWidth < 900) return;

    // Find all cards suitable for 3D tilt
    const cardSelectors = [
      '.tilt-3d',
      '.product-card',
      '.why-card',
      '.testimonial-card',
      '.blog-card',
      '.hero-form-card',
      '.booking-card',
      '.service-card'
    ];

    const cards = document.querySelectorAll(cardSelectors.join(', '));

    cards.forEach(card => {
      if (!card.classList.contains('tilt-3d')) {
        card.classList.add('tilt-3d');
      }

      const maxTilt = 7; // Max tilt angle in degrees

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPct = x / rect.width;
        const yPct = y / rect.height;

        const tiltX = (0.5 - yPct) * (maxTilt * 2);
        const tiltY = (xPct - 0.5) * (maxTilt * 2);

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

})();
