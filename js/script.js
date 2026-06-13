/* ====================================================
   LUXESMILE DENTAL — JAVASCRIPT
==================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL EFFECT ─── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    updateActiveNavLink();
  }, { passive: true });

  /* ─── SCROLL TO TOP ─── */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav__link, .mobile-nav .btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    }
  });

  /* ─── ACTIVE NAV LINK ─── */
  const sections = document.querySelectorAll('section[id], main > section');
  const navLinks = document.querySelectorAll('.navbar__link');

  function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /* ─── SCROLL ANIMATIONS (IntersectionObserver) ─── */
  const animatedEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children within same parent
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(el => observer.observe(el));

  /* ─── STATS COUNTER ANIMATION ─── */
  const statNums = document.querySelectorAll('.stats-bar__num[data-target]');

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(startVal + (target - startVal) * easedProgress);
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(update);
  }

  /* ─── RESULTS CAROUSEL ─── */
  const slides = document.querySelectorAll('.result-slide');
  const dots   = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  let currentSlide = 0;
  let autoSlideTimer = null;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 4000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideTimer);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(currentSlide - 1);
      startAutoSlide();
    });
    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(currentSlide + 1);
      startAutoSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(index);
      startAutoSlide();
    });
  });

  // Touch swipe support for carousel
  const carousel = document.getElementById('results-carousel');
  if (carousel) {
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        stopAutoSlide();
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        startAutoSlide();
      }
    }, { passive: true });
  }

  startAutoSlide();

  /* ─── BOOKING FORM SUBMISSION ─── */
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('full-name').value.trim();
      const service = document.getElementById('service-select').value;
      const date    = document.getElementById('preferred-date').value;
      const phone   = document.getElementById('phone').value.trim();

      if (!name || !service || !date || !phone) {
        shakeForm();
        return;
      }

      // Show success state
      const formWrap = document.querySelector('.booking__form-wrap');
      formWrap.innerHTML = `
        <div class="form-success">
          <div class="form-success__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3>Appointment Booked!</h3>
          <p>Thank you, <strong>${name}</strong>! We'll confirm your <strong>${service}</strong> appointment on <strong>${date}</strong> shortly.</p>
          <p style="margin-top:6px; font-size:0.8rem; color:#a0b3bd;">We'll WhatsApp you on +971 ${phone}</p>
        </div>
      `;
    });
  }

  function shakeForm() {
    const form = document.querySelector('.booking__form-wrap');
    form.style.animation = 'shake 0.4s ease';
    setTimeout(() => { form.style.animation = ''; }, 400);
  }

  /* Add shake keyframe dynamically */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  /* ─── SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── SERVICE CARD HOVER MICRO-INTERACTION ─── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--hover-scale', '1.03');
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--hover-scale');
    });
  });

  /* ─── HERO CARDS STAGGER ANIMATION ON LOAD ─── */
  const heroCards = document.querySelectorAll('.hero-card');
  heroCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(40px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'none';
    }, 600 + i * 180);
  });

  /* ─── HERO IMAGE PARALLAX (subtle) ─── */
  const heroImg = document.querySelector('.hero__image-wrap');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 800) {
        heroImg.style.transform = `translateY(${scrolled * 0.06}px)`;
      }
    }, { passive: true });
  }

  /* ─── DOCTOR CARD TILT EFFECT ─── */
  document.querySelectorAll('.doctor-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 4;
      const rotateY = ((x - centerX) / centerX) * -4;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── INPUT FLOATING LABEL EFFECT ─── */
  document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.closest('.form-group').classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.closest('.form-group').classList.remove('focused');
    });
  });

  /* ─── INITIAL PAGE LOAD ANIMATION ─── */
  // Hero content stagger
  const heroContentEls = document.querySelectorAll('.hero__content > *');
  heroContentEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 200 + i * 120);
  });

  // Hero image entrance
  const heroImgWrap = document.querySelector('.hero__image-wrap');
  if (heroImgWrap) {
    heroImgWrap.style.opacity = '0';
    heroImgWrap.style.transform = 'scale(0.94) translateY(20px)';
    setTimeout(() => {
      heroImgWrap.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroImgWrap.style.opacity = '1';
      heroImgWrap.style.transform = 'none';
    }, 400);
  }

  console.log('✅ LuxeSmile Dental — Loaded Successfully');
});
