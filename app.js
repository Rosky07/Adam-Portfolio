const typed = new Typed('.multiple', {
    strings: ['Développeur Web', 'Gestionnaire de données'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
  });

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
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimation();
});

// Smooth scroll pour les liens de navigation
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
