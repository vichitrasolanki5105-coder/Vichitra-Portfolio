/* ================================================
   VICHITRA SOLANKI — PORTFOLIO  |  script.js
   Features:
   - Sticky navbar on scroll
   - Active nav link on section change
   - Hamburger mobile menu
   - Typewriter effect
   - Scroll-triggered fade animations
   - Skill bar animations
   - Contact form with success message
   - Back-to-top button
   ================================================ */

// -----------------------------------------------
// HELPERS
// -----------------------------------------------

/** Shortcut for document.querySelector */
const $ = (sel) => document.querySelector(sel);

/** Shortcut for document.querySelectorAll */
const $$ = (sel) => document.querySelectorAll(sel);

// -----------------------------------------------
// 1. NAVBAR — Sticky + scrolled state
// -----------------------------------------------

const navbar  = $('#navbar');
const backTop = $('#backTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Add 'scrolled' class after 60px to trigger glass effect
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show / hide back-to-top button
  if (scrollY > 400) {
    backTop.classList.add('show');
  } else {
    backTop.classList.remove('show');
  }

  // Highlight active nav link based on scroll position
  updateActiveNav();
});

// -----------------------------------------------
// 2. ACTIVE NAV LINK — Highlights current section
// -----------------------------------------------

function updateActiveNav() {
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav-link');
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach((section) => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollMid >= top && scrollMid < bottom) {
      // Remove active from all links
      navLinks.forEach((link) => link.classList.remove('active'));
      // Add active to matching link
      const matchingLink = $(`.nav-link[href="#${section.id}"]`);
      if (matchingLink) matchingLink.classList.add('active');
    }
  });
}

// -----------------------------------------------
// 3. HAMBURGER MENU — Mobile toggle
// -----------------------------------------------

const hamburger = $('#hamburger');
const navLinks  = $('#navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
$$('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// -----------------------------------------------
// 4. TYPEWRITER EFFECT
// -----------------------------------------------

const typedEl = $('#typedText');

// Words to cycle through
const words = [
  'Aspiring Data Scientist',
  'Python Developer',
  'Problem Solver',
  'DSA Enthusiast',
  'Web Developer',
];

let wordIndex   = 0;   // current word
let charIndex   = 0;   // current character position
let isDeleting  = false;
let pauseTimer  = null;

function typeWriter() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    // Remove one character
    typedEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typedEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  // Typing speed (ms)
  let speed = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === currentWord.length) {
    // Finished typing — pause then start deleting
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting — move to next word
    isDeleting  = false;
    wordIndex   = (wordIndex + 1) % words.length;
    speed       = 400;
  }

  setTimeout(typeWriter, speed);
}

// Start typewriter after slight delay
setTimeout(typeWriter, 800);

// -----------------------------------------------
// 5. SCROLL ANIMATIONS — Intersection Observer
// -----------------------------------------------

const animatedElements = $$('.fade-in, .fade-in-right, .fade-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, stop observing (no re-animation)
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,  // trigger when 15% of element is visible
    rootMargin: '0px 0px -40px 0px',
  }
);

animatedElements.forEach((el) => observer.observe(el));

// -----------------------------------------------
// 6. SKILL BARS — Animate width on scroll
// -----------------------------------------------

const skillFills = $$('.sk-fill');

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill      = entry.target;
        const targetW   = fill.getAttribute('data-w');  // percentage e.g. "78"
        fill.style.width = targetW + '%';
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.4 }
);

skillFills.forEach((fill) => skillObserver.observe(fill));

// -----------------------------------------------
// 7. BACK TO TOP BUTTON
// -----------------------------------------------

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// -----------------------------------------------
// 8. CONTACT FORM
// -----------------------------------------------

const contactForm    = $('#contactForm');
const formSuccess    = $('#formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let valid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        valid = false;
        // Flash border red briefly
        input.style.borderColor = '#f87171';
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
      }
    });

    if (!valid) return;

    // Simulate form submission (replace with real backend or EmailJS)
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled    = true;

    setTimeout(() => {
      contactForm.reset();
      btn.innerHTML   = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled    = false;
      formSuccess.classList.add('show');

      // Hide success message after 4 seconds
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 4000);
    }, 1200);
  });
}

// -----------------------------------------------
// 9. SMOOTH SCROLL — For nav links
// -----------------------------------------------

$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = $(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// -----------------------------------------------
// 10. INITIAL LOAD — trigger hero animations
// -----------------------------------------------

window.addEventListener('load', () => {
  // Trigger hero elements (they're above the fold so observer won't fire)
  $$('.hero .fade-in, .hero .fade-in-right').forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 200);
  });
});
