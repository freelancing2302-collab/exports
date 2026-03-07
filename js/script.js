/* =============================================
   CM TRADING & EXPORTS — BuildUp Theme
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
            if (window.innerWidth <= 992) {
                mobileNavDrawer.classList.remove('open');
                mobileNavToggle.classList.remove('open');
            }
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

//  MOBILE NAV DRAWER TOGGLE 
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileNavDrawer = document.getElementById('mobileNavDrawer');

if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('open');
        mobileNavDrawer.classList.toggle('open');
        document.body.style.overflow = mobileNavDrawer.classList.contains('open') ? 'hidden' : '';
    });
}
// Close drawer when clicking outside
document.addEventListener('click', (e) => {
    if (mobileNavDrawer && mobileNavDrawer.classList.contains('open') &&
        !mobileNavDrawer.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        mobileNavDrawer.classList.remove('open');
        mobileNavToggle.classList.remove('open');
        document.body.style.overflow = '';
    }
});

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

//  ACTIVE NAV LINK (header + mobile drawer) 
const sections   = document.querySelectorAll('section[id]');
const headerLinks = document.querySelectorAll('.header-nav a, .mobile-nav-drawer a');
const siteHeader  = document.getElementById('siteHeader');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    let current = '';

    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 140) current = section.id;
    });

    headerLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Header scroll shadow / scrolled state
    if (siteHeader) {
        siteHeader.classList.toggle('scrolled', scrollY > 20);
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

//  PRODUCT MASTER–DETAIL  
const prodSelCards  = document.querySelectorAll('.prod-sel-card');
const prodDetails   = document.querySelectorAll('.prod-detail');
const prodTabBtns   = document.querySelectorAll('.prod-tab');

function activateProduct(productId) {
    prodSelCards.forEach(c => c.classList.remove('active'));
    prodDetails.forEach(d => d.classList.remove('active'));
    const selCard = document.querySelector('.prod-sel-card[data-product="' + productId + '"]');
    const detPanel = document.getElementById('detail-' + productId);
    if (selCard)  selCard.classList.add('active');
    if (detPanel) detPanel.classList.add('active');
}

prodSelCards.forEach(card => {
    card.addEventListener('click', () => {
        activateProduct(card.getAttribute('data-product'));
    });
});

prodTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        prodTabBtns.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        prodSelCards.forEach(card => {
            const match = filter === 'all' || card.getAttribute('data-cat') === filter;
            card.classList.toggle('hidden', !match);
        });
        // If the currently active selector card was just hidden, switch to first visible
        const activeCard = document.querySelector('.prod-sel-card.active');
        if (activeCard && activeCard.classList.contains('hidden')) {
            const firstVisible = document.querySelector('.prod-sel-card:not(.hidden)');
            if (firstVisible) activateProduct(firstVisible.getAttribute('data-product'));
        }
    });
});

//  SERVICE CARDS: Click to activate highlight 
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
    item.addEventListener('click', () => {
        serviceItems.forEach(si => si.classList.remove('active-service'));
        item.classList.add('active-service');
    });
});

// ========= CONTACT FORM VALIDATION ========= 
const contactForm = document.getElementById('contactForm');
const formStatusMessage = document.getElementById('formStatusMessage');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone validation regex (international format)
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + 'Error');
    
    input.classList.add('error');
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + 'Error');
    
    input.classList.remove('error');
    errorEl.classList.remove('show');
}

function clearAllErrors() {
    const inputs = ['name', 'email', 'phone', 'subject', 'message'];
    inputs.forEach(id => clearError(id));
}

function showFormStatus(message, type) {
    formStatusMessage.textContent = message;
    formStatusMessage.className = 'form-status show ' + type;
    
    setTimeout(() => {
        formStatusMessage.classList.remove('show');
    }, 5000);
}

function validateForm() {
    clearAllErrors();
    let isValid = true;
    
    // Validate name
    const name = document.getElementById('name').value.trim();
    if (name === '') {
        showError('name', 'Please enter your full name');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value.trim();
    if (email === '') {
        showError('email', 'Please enter your email address');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone (optional but must be valid if provided)
    const phone = document.getElementById('phone').value.trim();
    if (phone !== '' && !phoneRegex.test(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate subject
    const subject = document.getElementById('subject').value;
    if (subject === '') {
        showError('subject', 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message').value.trim();
    if (message === '') {
        showError('message', 'Please enter your message');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

// Real-time validation
document.getElementById('name')?.addEventListener('blur', function() {
    const value = this.value.trim();
    if (value === '') {
        showError('name', 'Please enter your full name');
    } else if (value.length < 2) {
        showError('name', 'Name must be at least 2 characters');
    } else {
        clearError('name');
    }
});

document.getElementById('email')?.addEventListener('blur', function() {
    const value = this.value.trim();
    if (value === '') {
        showError('email', 'Please enter your email address');
    } else if (!emailRegex.test(value)) {
        showError('email', 'Please enter a valid email address');
    } else {
        clearError('email');
    }
});

document.getElementById('phone')?.addEventListener('blur', function() {
    const value = this.value.trim();
    if (value !== '' && !phoneRegex.test(value)) {
        showError('phone', 'Please enter a valid phone number');
    } else {
        clearError('phone');
    }
});

document.getElementById('subject')?.addEventListener('change', function() {
    if (this.value === '') {
        showError('subject', 'Please select a subject');
    } else {
        clearError('subject');
    }
});

document.getElementById('message')?.addEventListener('blur', function() {
    const value = this.value.trim();
    if (value === '') {
        showError('message', 'Please enter your message');
    } else if (value.length < 10) {
        showError('message', 'Message must be at least 10 characters');
    } else {
        clearError('message');
    }
});

// Form submit handler
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showFormStatus('Please fix the errors above and try again.', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            company: document.getElementById('company').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim()
        };
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission (replace with actual backend endpoint)
        setTimeout(() => {
            console.log('Form Data:', formData);
            
            // Show success message
            showFormStatus('✓ Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            clearAllErrors();
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Optional: Send to email service (Formspree, EmailJS, etc.)
            // fetch('YOUR_FORM_ENDPOINT', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // }).then(response => { ... });
            
        }, 1500);
    });
    
    // Reset button handler
    const resetBtn = contactForm.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            clearAllErrors();
            formStatusMessage.classList.remove('show');
        });
    }
}

// ========= FAQ ACCORDION ========= 
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});
