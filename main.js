import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.page-section');

  // ==================== INTRO VIDEO ====================
  const introOverlay = document.getElementById('intro-video-overlay');
  const introVideo = document.getElementById('intro-video');

  if (introOverlay && introVideo) {
    if (window.innerWidth >= 769) {
      // Disable intro on desktop
      if (introOverlay.parentNode) {
        introOverlay.parentNode.removeChild(introOverlay);
      }
    } else {
      // Show intro on every load for mobile
      introOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Lock scrolling during intro

      const endIntro = () => {
        introOverlay.classList.add('fade-out');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
          if (introOverlay.parentNode) {
            introOverlay.parentNode.removeChild(introOverlay);
          }
        }, 800);
      };

      introVideo.addEventListener('ended', endIntro);
      introVideo.addEventListener('error', endIntro);
    }
  }

  // ==================== HEADER SCROLL ====================
  const header = document.getElementById('header');
  let lastScroll = 0;
  const onScroll = () => {
    if (header) {
      let threshold = 40;
      const activeSection = document.querySelector('.page-section.active-section');
      if (activeSection) {
        const hero = activeSection.querySelector('.hero, .quality-hero-premium');
        if (hero) {
          threshold = Math.max(40, hero.offsetHeight - 80);
        }
      }
      const currentScroll = window.scrollY;
      
      header.classList.toggle('scrolled', currentScroll > threshold);
      
      if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
        header.classList.add('hide'); // Hide on scroll down
      } else {
        header.classList.remove('hide'); // Show on scroll up
      }
      
      lastScroll = currentScroll;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ==================== MOBILE MENU & DROPDOWN STATE ====================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navDropdown = document.getElementById('navDropdown') || document.querySelector('.nav-dropdown');

  const closeMobileMenu = () => {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (navLinks) navLinks.classList.remove('open');
    if (navDropdown) {
      navDropdown.classList.remove('open', 'force-hover');
      const toggleBtn = navDropdown.querySelector('.dropdown-toggle');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  };

  const openMobileMenu = (expandProducts = false) => {
    if (mobileToggle) mobileToggle.classList.add('active');
    if (navLinks) navLinks.classList.add('open');
    if (expandProducts && navDropdown) {
      navDropdown.classList.add('open');
      const toggleBtn = navDropdown.querySelector('.dropdown-toggle');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  };

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // ==================== PRODUCTS DROPDOWN ACCORDION ====================
  if (navDropdown) {
    const dropdownToggle = navDropdown.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = navDropdown.classList.toggle('open');
        dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target) && !e.target.closest('.btn-explore')) {
        navDropdown.classList.remove('open', 'force-hover');
        if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==================== NAVIGATION ====================
  function navigateTo(targetSectionId) {
    if (!targetSectionId) return;

    sections.forEach(section => {
      if (section.id === targetSectionId) {
        section.classList.remove('hidden');
        section.classList.add('active-section');
      } else {
        section.classList.add('hidden');
        section.classList.remove('active-section');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
  }

  // Global delegate for any data-section link/button
  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-section]');
    if (navBtn) {
      const target = navBtn.getAttribute('data-section');
      if (target) {
        e.preventDefault();
        
        // Update active class on top-level and dropdown items
        document.querySelectorAll('.nav-link, .dropdown-item').forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`[data-section="${target}"]`).forEach(l => l.classList.add('active'));

        navigateTo(target);
      }
    }
  });

  // ==================== EXPLORE PRODUCTS BUTTONS ====================
  const exploreBtns = document.querySelectorAll('.btn-explore, [href="#home-products"]');
  exploreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Force instant scroll to top
      const originalBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto'; // override CSS smooth scroll
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = originalBehavior;

      if (window.innerWidth <= 768) {
        // Mobile view: Open mobile drawer and expand Products accordion
        setTimeout(() => {
          openMobileMenu(true);
        }, 50);
      } else {
        // Desktop view: Open the Products dropdown in navbar
        if (navDropdown) {
          setTimeout(() => {
            navDropdown.classList.add('force-hover');
          }, 50);
        }
      }
    });
  });

  // ==================== SCROLL REVEAL ====================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ==================== COUNTERS ====================
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.count, 10);
        const suffix = entry.target.textContent.replace(/\d/g, '').trim();
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.floor(eased * target);
          entry.target.textContent = value.toLocaleString('en-IN') + suffix;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            entry.target.textContent = target.toLocaleString('en-IN') + suffix;
          }
        };
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => countObserver.observe(el));

  // ==================== CONTACT FORM ====================
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      showStatus('Sending your message...', '');

      setTimeout(() => {
        showStatus('Opening your email client...', 'success');
        
        const subject = encodeURIComponent('New Contact Form Submission from ' + name);
        const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
        window.location.href = 'mailto:sales@genuineshellcarb.com?subject=' + subject + '&body=' + body;

        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;

        setTimeout(() => {
          if (statusDiv) statusDiv.className = 'form-status';
        }, 6000);
      }, 1000);
    });
  }

  function showStatus(message, type) {
    if (!statusDiv) return;
    statusDiv.textContent = message;
    statusDiv.className = 'form-status' + (type ? ' ' + type : '');
  }
});