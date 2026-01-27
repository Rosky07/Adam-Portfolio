/* =====================================================
   PORTFOLIO - APP.JS
   Version Professionnelle Optimisée
   ===================================================== */

'use strict';

// ===== CONFIGURATION =====
const CONFIG = {
    headerOffset: 80,
    scrollDebounceDelay: 15,
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -50px 0px',
    notificationDuration: 3000
};

// ===== UTILITAIRES =====
const debounce = (func, wait = 10, immediate = true) => {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// ===== GESTION DU MENU MOBILE =====
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('nav a');
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.navbar) return;

        this.menuToggle.addEventListener('click', () => this.toggle());

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        const isActive = this.navbar.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
        this.menuToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    close() {
        this.navbar.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// ===== ANIMATIONS TYPED.JS =====
class TypedAnimations {
    constructor() {
        this.init();
    }

    init() {
        if (typeof Typed === 'undefined') {
            console.warn('Typed.js not loaded');
            return;
        }

        const element = document.querySelector('.multiple');
        if (!element) return;

        new Typed('.multiple', {
            strings: [
                'Développeur Web',
                'Gestionnaire de Données',
                'Data Analyst',
            ],
            typeSpeed: 80,
            backSpeed: 80,
            backDelay: 1200,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );

        const elements = document.querySelectorAll('.scroll-element');
        elements.forEach(el => observer.observe(el));
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled');
                observer.unobserve(entry.target);
            }
        });
    }
}

// ===== NAVIGATION ACTIVE =====
class ActiveNavigation {
    constructor() {
        this.header = document.querySelector('header');
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('nav a');
        this.init();
    }

    init() {
        window.addEventListener('scroll', debounce(
            this.updateActiveLink.bind(this),
            CONFIG.scrollDebounceDelay
        ));
    }

    updateActiveLink() {
        const scrollY = window.pageYOffset;

        // Header shadow
        if (this.header) {
            if (scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }

        // Active link
        this.sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`nav a[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - CONFIG.headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
}

// ===== BARRES DE PROGRESSION (SKILLS) =====
class SkillProgressBars {
    constructor() {
        this.init();
    }

    init() {
        const skills = document.querySelectorAll(".skill-item");
        if (skills.length === 0) return;

        skills.forEach(skill => {
            const progressBar = skill.querySelector(".skill-progress");
            const percentText = skill.querySelector(".skill-percent");
            const levelContainer = skill.querySelector(".skill-level");
            const levelText = levelContainer ? levelContainer.querySelector("span") : null;

            if (!progressBar || !percentText) return;

            const progressValue = parseInt(progressBar.dataset.progress, 10) || 0;

            // 1. Animation de la barre
            requestAnimationFrame(() => {
                progressBar.style.width = progressValue + "%";
            });

            // 2. Animation du pourcentage
            let current = 0;
            const increment = progressValue / 50;
            const counter = setInterval(() => {
                current += increment;
                if (current >= progressValue) {
                    current = progressValue;
                    clearInterval(counter);
                }
                percentText.textContent = Math.round(current) + "%";
            }, 30);

            // 3. Détermination du niveau
            let level = "";
            if (progressValue <= 40) {
                level = "Débutant";
            } else if (progressValue <= 70) {
                level = "Intermédiaire";
            } else {
                level = "Avancé";
            }

            // 4. Animation du texte du niveau
            if (levelContainer && levelText) {
                setTimeout(() => {
                    levelText.textContent = level;
                    levelContainer.classList.remove("opacity-0", "translate-y-2");
                    levelContainer.classList.add("opacity-100", "translate-y-0");
                }, 800);
            }
        });
    }
}

// ===== SYSTÈME DE NOTIFICATION =====
class NotificationSystem {
    constructor() {
        this.createStyles();
    }

    createStyles() {
        if (document.getElementById('notification-styles')) return;
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
               .notification {
                   position: fixed;
                   top: 100px;
                   right: 20px;
                   padding: 1rem 2rem;
                   border-radius: 12px;
                   box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                   z-index: 10000;
                   animation: slideIn 0.5s ease;
                   font-weight: 500;
                   color: white;
               }
               .notification.success { background: linear-gradient(135deg, #27ae60, #2ecc71); }
               .notification.error { background: linear-gradient(135deg, #e74c3c, #c0392b); }
               @keyframes slideIn {
                   from { transform: translateX(400px); opacity: 0; }
                   to { transform: translateX(0); opacity: 1; }
               }
               @keyframes slideOut {
                   from { transform: translateX(0); opacity: 1; }
                   to { transform: translateX(400px); opacity: 0; }
               }
           `;
        document.head.appendChild(style);
    }

    show(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, CONFIG.notificationDuration);
    }
}

// ===== GESTION DU FORMULAIRE =====
class ContactForm {
    constructor(notificationSystem) {
        this.form = document.getElementById('contactForm');
        this.notifications = notificationSystem;
        this.init();
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                this.notifications.show('Message envoyé avec succès !');
                this.form.reset();
            } else {
                throw new Error('Erreur serveur');
            }
        } catch (error) {
            this.notifications.show('Erreur lors de l\'envoi. Réessayez.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }
}

// ===== TÉLÉCHARGEMENT DU CV =====
class CVDownloader {
    constructor() {
        this.init();
    }

    init() {
        const downloadBtn = document.getElementById('downloadCV');
        if (!downloadBtn) return;

        downloadBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const link = document.createElement('a');
            link.href = '/assets/CVAdam.pdf';
            link.download = 'CV-Adam-Poussi.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}

// ===== CLASSE PRINCIPALE PORTFOLIO =====
class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.notifications = new NotificationSystem();
            this.menu = new MobileMenu();
            this.typed = new TypedAnimations();
            this.scroll = new ScrollAnimations();
            this.nav = new ActiveNavigation();
            this.smooth = new SmoothScroll();
            this.skills = new SkillProgressBars();
            this.form = new ContactForm(this.notifications);
            this.cv = new CVDownloader();
            this.welcomeMessage();
        });
    }

    welcomeMessage() {
        console.log(
            '%c🚀 Développé avec passion par Adam Poussi',
            'color: #27ae60; font-size: 14px;'
        );
        console.log(
            '%c💼 Contactez-moi pour vos projets web!',
            'color: #3498db; font-size: 14px;'
        );
    }
}

// DÉMARRAGE
const app = new Portfolio();

// GESTION DES ERREURS GLOBALES
window.addEventListener('error', (e) => {
    console.error('Erreur détectée:', e.error);
});

// PERFORMANCE MONITORING
window.addEventListener('load', () => {
    if ('performance' in window && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Temps de chargement: ${pageLoadTime}ms`);
    }
});