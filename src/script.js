(() => {
  'use strict';

  /* ============================================================
     THEME TOGGLE (Dark / Light)
     ============================================================ */
  const stored = localStorage.getItem('evaluna-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'dark' ? '\u2600' : '\u263D';
    toggleBtn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('evaluna-theme', theme);
      toggleBtn.textContent = theme === 'dark' ? '\u2600' : '\u263D';
    });
  }

  /* ============================================================
     CUSTOM CURSOR (desktop only)
     ============================================================ */
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (hasFinePointer) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.documentElement.appendChild(cursor);
    document.documentElement.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followX = -100, followY = -100;

    function moveCursor(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }

    document.addEventListener('mousemove', moveCursor);

    function animateCursor() {
      followX += (mouseX - followX) * 0.1;
      followY += (mouseY - followY) * 0.1;
      follower.style.left = followX + 'px';
      follower.style.top = followY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .card, .gallery-grid img, .experiencia-item').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('cursor-hover'); follower.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('cursor-hover'); follower.classList.remove('cursor-hover'); });
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
  }

  /* ============================================================
     PARTICLES (Hero background)
     ============================================================ */
  const hero = document.querySelector('.hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 10 : 40;

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.5 + Math.random() * 3,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        o: 0.2 + Math.random() * 0.5,
        type: Math.random() > 0.7 ? 'sparkle' : 'dot'
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        if (p.type === 'sparkle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(255, 107, 138, ${p.o * 0.6})` : `rgba(198, 124, 127, ${p.o * 0.5})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x - p.r, p.y - p.r, p.r * 0.5, 0, Math.PI * 2);
          ctx.arc(p.x + p.r, p.y - p.r, p.r * 0.5, 0, Math.PI * 2);
          ctx.arc(p.x, p.y + p.r, p.r * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(212, 163, 115, ${p.o * 0.4})` : `rgba(217, 183, 141, ${p.o * 0.4})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${p.o * 0.3})` : `rgba(138, 79, 91, ${p.o * 0.2})`;
          ctx.fill();
        }
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
      }, 200);
    });
  }

  /* ============================================================
     SCROLL ANIMATIONS (IntersectionObserver + Parallax)
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal, .card, .experiencia-item, .gallery-grid img');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => scrollObserver.observe(el));

  /* Parallax on hero image (throttled) */
  const heroImg = document.querySelector('.hero__visual img');
  if (heroImg) {
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          const rect = heroImg.getBoundingClientRect();
          const speed = 0.08;
          const y = (rect.top - window.innerHeight) * speed;
          heroImg.style.transform = `translateY(${Math.min(Math.max(y, -40), 40)}px)`;
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    });
  }

  /* ============================================================
     TEXT REVEAL (splitting headings)
     ============================================================ */
  document.querySelectorAll('.text-reveal').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${i * 0.03}s`;
      span.className = 'reveal-char';
      el.appendChild(span);
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.reveal-char').forEach(s => s.classList.add('revealed'));
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
  });

  /* ============================================================
     DYNAMIC NAVBAR
     ============================================================ */
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  let navTicking = false;
  if (header) {
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(() => {
          const current = window.scrollY;
          if (current > 150) {
            if (current > lastScroll) header.classList.add('nav-hidden');
            else header.classList.remove('nav-hidden');
            header.classList.add('nav-scrolled');
          } else {
            header.classList.remove('nav-scrolled', 'nav-hidden');
          }
          lastScroll = current;
          navTicking = false;
        });
        navTicking = true;
      }
    });
  }

  /* ============================================================
     MAGNETIC BUTTONS
     ============================================================ */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* ============================================================
     3D TILT CARDS
     ============================================================ */
  document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${y * -8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    });
  });

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<span class="lightbox-close">&times;</span><img class="lightbox-img" src="" alt=""/><span class="lightbox-prev">&#8249;</span><span class="lightbox-next">&#8250;</span>';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  let currentIdx = 0;
  let galleryImages = [];

  document.querySelectorAll('.gallery-grid img').forEach((img, idx) => {
    galleryImages.push(img.src);
    img.addEventListener('click', () => {
      currentIdx = idx;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function showImage(dir) {
    currentIdx = (currentIdx + dir + galleryImages.length) % galleryImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentIdx];
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  lightboxPrev.addEventListener('click', () => showImage(-1));
  lightboxNext.addEventListener('click', () => showImage(1));
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(-1);
    if (e.key === 'ArrowRight') showImage(1);
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ============================================================
     LOADER (page entrance)
     ============================================================ */
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `<div class="loader-spinner"><svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/><circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="163" stroke-dashoffset="163" class="loader-arc"/></svg></div>`;
  document.body.appendChild(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      document.body.classList.add('page-loaded');
    }, 800);
  });

  /* ============================================================
     SMOOTH SCROLL FOR NAV LINKS
     ============================================================ */
  document.querySelectorAll('.main-nav a[href^="#"], .overlay-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ============================================================
     HAMBURGER MENU TOGGLE
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');

  if (hamburger && navOverlay) {
    const overlayLinks = navOverlay.querySelectorAll('a');

    function openMenu() {
      hamburger.classList.add('active');
      navOverlay.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      navOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      navOverlay.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      navOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      const isOpen = navOverlay.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });

    overlayLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        closeMenu();
      }
    });

    navOverlay.addEventListener('click', e => {
      if (e.target === navOverlay) closeMenu();
    });
  }

})();
