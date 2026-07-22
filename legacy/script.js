// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
}, observerOptions);

// Observe skill cards and timeline items
document.querySelectorAll('.skill-card, .timeline-item').forEach(el => {
    observer.observe(el);
});

// Hero fade in (already CSS, but reinforce)
window.addEventListener('load', () => {
    document.querySelector('.hero-content').style.opacity = '1';
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    // Simulate send (in real: use EmailJS or backend)
    alert('Thank you! Your message has been sent. (Demo)');
    this.reset();
});

// Navbar scroll effect (if added later)
// Window scroll for parallax hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Active nav highlight (if nav added)
});

// Theme toggle (optional dark mode - bonus modern feature)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    // Save to localStorage
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Add theme toggle button to hero (bonus)
const themeBtn = document.createElement('button');
themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
themeBtn.className = 'btn btn-secondary theme-toggle';
themeBtn.onclick = toggleTheme;
document.querySelector('.hero-buttons').appendChild(themeBtn);

// CSS for dark mode (will be added to styles if enabled)
const darkModeCSS = `
.dark-mode {
    background: #0a0a0a;
    color: #e0e0e0;
}
.dark-mode .section {
    background: #111;
}
.dark-mode .skill-card,
.dark-mode .timeline-item {
    background: #1a1a1a;
    color: #e0e0e0;
}
`;
const style = document.createElement('style');
style.textContent = darkModeCSS;
document.head.appendChild(style);
