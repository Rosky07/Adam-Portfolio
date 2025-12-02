// Attendre que Typed.js soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // === TYPED.JS ANIMATION ===
    if (typeof Typed !== 'undefined') {
        const typed = new Typed('.multiple', {
            strings: ['Développeur Web', 'Gestionnaire de données', 'Data Analyst'],
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
            loop: true
        });
    }

    // === MENU MOBILE ===
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // === SCROLL ANIMATIONS ===
    const scrollElements = document.querySelectorAll('.scroll-element');

    const elementInView = (el, offset = 150) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            (window.innerHeight || document.documentElement.clientHeight) - offset
        );
    };

    const elementOutofView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 150)) {
                displayScrollElement(el);
            } else if (elementOutofView(el)) {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Initialiser au chargement
    handleScrollAnimation();
});

// === SMOOTH SCROLL ===
document.addEventListener('click', function(e) {
    if (e.target.closest('a[href^="#"]')) {
        e.preventDefault();
        const href = e.target.closest('a').getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// === FORMULAIRE CONTACT ===
document.addEventListener('submit', function(e) {
    if (e.target.matches('.contact-form')) {
        e.preventDefault();
        
        const btn = e.target.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Envoyé !';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                e.target.reset();
            }, 2000);
        }, 1500);
    }
});

// === EFFET HOVER LOGO ===
document.addEventListener('mouseenter', function(e) {
    if (e.target.closest('.logo')) {
        e.target.closest('.logo').style.transform = 'scale(1.1)';
    }
}, true);

document.addEventListener('mouseleave', function(e) {
    if (e.target.closest('.logo')) {
        e.target.closest('.logo').style.transform = 'scale(1)';
    }
}, true);
