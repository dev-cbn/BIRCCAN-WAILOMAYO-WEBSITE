/* ==========================================================================
   NAVBAR: shrink + backdrop on scroll
   ========================================================================== */
   const navbar = document.getElementById('navbar');
   window.addEventListener('scroll', () => {
     navbar.classList.toggle('scrolled', window.scrollY > 40);
   }, { passive:true });
   
   /* ==========================================================================
      MOBILE MENU TOGGLE
      ========================================================================== */
   const hamburger = document.getElementById('hamburger');
   const navLinks = document.getElementById('navLinks');
   hamburger.addEventListener('click', () => {
     hamburger.classList.toggle('open');
     navLinks.classList.toggle('open');
   });
   document.querySelectorAll('.nav-link-item').forEach(link => {
     link.addEventListener('click', () => {
       hamburger.classList.remove('open');
       navLinks.classList.remove('open');
     });
   });
   
   /* ==========================================================================
      SMOOTH SCROLL for in-page anchor links
      ========================================================================== */
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function (e) {
       const targetId = this.getAttribute('href');
       if (targetId.length < 2) return;
       const target = document.querySelector(targetId);
       if (target) {
         e.preventDefault();
         const offset = 90;
         const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
         window.scrollTo({ top, behavior: 'smooth' });
       }
     });
   });
   
   /* ==========================================================================
      SCROLL-TRIGGERED REVEAL ANIMATIONS (Intersection Observer)
      ========================================================================== */
   const revealObserver = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         entry.target.classList.add('in-view');
         revealObserver.unobserve(entry.target);
       }
     });
   }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
   
   document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));
   
   /* ==========================================================================
      ANIMATED COUNTERS (trigger once, when stat row enters view)
      ========================================================================== */
   function animateCounter(el, target, duration = 1800) {
     const start = performance.now();
     function tick(now) {
       const progress = Math.min((now - start) / duration, 1);
       const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
       el.textContent = Math.floor(eased * target);
       if (progress < 1) requestAnimationFrame(tick);
       else el.textContent = target;
     }
     requestAnimationFrame(tick);
   }
   
   const statRow = document.getElementById('statRow');
   if (statRow) {
     const counterObserver = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.querySelectorAll('.counter').forEach(counter => {
             animateCounter(counter, parseInt(counter.dataset.target, 10));
           });
           counterObserver.unobserve(entry.target);
         }
       });
     }, { threshold: 0.4 });
     counterObserver.observe(statRow);
   }
   
   /* ==========================================================================
      TESTIMONIAL CAROUSEL — auto-rotate + manual controls
      ========================================================================== */
   const slides = Array.from(document.querySelectorAll('.t-slide'));
   const dotsWrap = document.getElementById('tDots');
   let tIndex = 0;
   let tTimer;
   
   slides.forEach((_, i) => {
     const dot = document.createElement('button');
     dot.className = 't-dot' + (i === 0 ? ' active' : '');
     dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
     dot.addEventListener('click', () => goToSlide(i));
     dotsWrap.appendChild(dot);
   });
   const dots = Array.from(dotsWrap.children);
   
   function goToSlide(i) {
     slides[tIndex].classList.remove('active');
     dots[tIndex].classList.remove('active');
     tIndex = (i + slides.length) % slides.length;
     slides[tIndex].classList.add('active');
     dots[tIndex].classList.add('active');
     restartAutoRotate();
   }
   function nextSlide() { goToSlide(tIndex + 1); }
   function prevSlide() { goToSlide(tIndex - 1); }
   function restartAutoRotate() {
     clearInterval(tTimer);
     tTimer = setInterval(nextSlide, 6000);
   }
   document.getElementById('tNext').addEventListener('click', nextSlide);
   document.getElementById('tPrev').addEventListener('click', prevSlide);
   restartAutoRotate();
   
   /* ==========================================================================
      EVENTS HORIZONTAL SCROLL BUTTONS
      ========================================================================== */
   const eventsScroll = document.getElementById('eventsScroll');
   document.getElementById('scrollRight').addEventListener('click', () => {
     eventsScroll.scrollBy({ left: 340, behavior: 'smooth' });
   });
   document.getElementById('scrollLeft').addEventListener('click', () => {
     eventsScroll.scrollBy({ left: -340, behavior: 'smooth' });
   });
   
   /* ==========================================================================
      HERO STAINED-GLASS WINDOW — subtle mouse parallax
      ========================================================================== */
   const heroWindow = document.getElementById('heroWindow');
   const heroSection = document.querySelector('.hero');
   heroSection.addEventListener('mousemove', (e) => {
     const rect = heroSection.getBoundingClientRect();
     const x = (e.clientX - rect.left) / rect.width - 0.5;
     const y = (e.clientY - rect.top) / rect.height - 0.5;
     heroWindow.style.marginLeft = (x * 24) + 'px';
     heroWindow.style.marginTop = (y * 24) + 'px';
   });
   
   /* ==========================================================================
      CONTACT FORM — simple validation with animated feedback
      ========================================================================== */
   const contactForm = document.getElementById('contactForm');
   const formSuccess = document.getElementById('formSuccess');
   
   function setFieldError(fieldId, hasError) {
     const field = document.getElementById(fieldId);
     field.classList.toggle('error', hasError);
     if (hasError) {
       // restart shake animation
       const input = field.querySelector('input, textarea');
       input.style.animation = 'none';
       void input.offsetWidth;
       input.style.animation = '';
     }
   }
   
   contactForm.addEventListener('submit', (e) => {
     e.preventDefault();
     formSuccess.classList.remove('show');
   
     const name = document.getElementById('name').value.trim();
     const email = document.getElementById('email').value.trim();
     const message = document.getElementById('message').value.trim();
     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
     let valid = true;
     setFieldError('fieldName', name.length === 0);
     if (name.length === 0) valid = false;
   
     const emailValid = emailPattern.test(email);
     setFieldError('fieldEmail', !emailValid);
     if (!emailValid) valid = false;
   
     setFieldError('fieldMessage', message.length === 0);
     if (message.length === 0) valid = false;
   
     if (valid) {
       formSuccess.classList.add('show');
       contactForm.reset();
       setTimeout(() => formSuccess.classList.remove('show'), 6000);
     }
   });
   
   // clear error state as the user types
   ['name', 'email', 'message'].forEach(id => {
     document.getElementById(id).addEventListener('input', () => {
       document.getElementById('field' + id.charAt(0).toUpperCase() + id.slice(1)).classList.remove('error');
     });
   });