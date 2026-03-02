/* =============================================
   CARLOS PORTFOLIO — Dark Navy/Yellow Theme
   Chandra Mohan (Chandru) | CM Trading & Exports
   ============================================= */

//  SMOOTH SCROLL 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            if (window.innerWidth <= 768) closeSidebar();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

//  MOBILE SIDEBAR TOGGLE 
const sidebar      = document.getElementById('sidebar');
const mobileToggle = document.getElementById('mobileToggle');
const overlay      = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

if (mobileToggle) mobileToggle.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
);
if (overlay) overlay.addEventListener('click', closeSidebar);

//  ANIMATED COUNTER 
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

function animateCounter(el, target, duration = 2000) {
    let startTime = null;
    function step(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        el.textContent = Math.floor(easeOutQuart(progress) * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = Math.floor(target);
    }
    requestAnimationFrame(step);
}

let statsAnimated = false;

//  SCROLL REVEAL 
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 55);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.06, rootMargin: '0px 0px -35px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

//  COUNTER TRIGGER 
const statsSection = document.getElementById('stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
            statsAnimated = true;
            document.querySelectorAll('.stat-number').forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                if (!isNaN(target)) animateCounter(el, target);
            });
            statsObserver.disconnect();
        }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
}

//  ACTIVE NAV LINK (sidebar + top-nav) 
const sections  = document.querySelectorAll('section[id]');
const sideLinks = document.querySelectorAll('.sidebar-nav .nav-link');
const topLinks  = document.querySelectorAll('.top-nav-links a');
const topNav    = document.querySelector('.top-nav');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    let current = '';

    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 140) current = section.id;
    });

    sideLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
    topLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Navbar scroll shadow
    if (topNav) {
        topNav.style.boxShadow = scrollY > 20
            ? '0 4px 24px rgba(0,0,0,0.4)'
            : 'none';
    }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

//  TYPEWRITER / CYCLING TEXT (Carlos signature animation) 
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Verified Indian Suppliers',
  'Agricultural Commodities',
  'Bulk Spice & Turmeric Deals',
  'Global Sourcing Partners',
  'Direct Farm-to-Port Export',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!typedEl) return;

  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
  } else {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIdx === current.length) {
    delay = 1800;          // pause at end
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;           // pause before next phrase
  }

  setTimeout(typeLoop, delay);
}

if (typedEl) setTimeout(typeLoop, 800);  // small start delay

//  SERVICE CARDS: Click to activate yellow highlight 
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
    item.addEventListener('click', () => {
        serviceItems.forEach(si => si.classList.remove('active-service'));
        item.classList.add('active-service');
    });
});
