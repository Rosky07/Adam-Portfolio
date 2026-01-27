/* =====================================================
   PORTFOLIO - APP.JS
   Version Professionnelle - Animation Cascade au Scroll
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
            strings: ['Développeur Web', 'Gestionnaire de Données', 'Data Analyst'],
            typeSpeed: 80,
            backSpeed: 80,
            backDelay: 1200,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// ===== SCROLL ANIMATIONS (ÉLÉMENTS GÉNÉRAUX) =====
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
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scrolled');
                        observer.unobserve(entry.target);
                    }
                });
            },
            this.observerOptions
        );
        const elements = document.querySelectorAll('.scroll-element');
        elements.forEach(el => observer.observe(el));
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
        window.addEventListener('scroll', debounce(() => this.updateActiveLink(), CONFIG.scrollDebounceDelay));
    }

    updateActiveLink() {
        const scrollY = window.pageYOffset;
        if (this.header) {
            if (scrollY > 50) this.header.classList.add('scrolled');
            else this.header.classList.remove('scrolled');
        }
        this.sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`nav a[href="#${sectionId}"]`);
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) correspondingLink.classList.add('active');
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
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - CONFIG.headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            });
        });
    }
}

// ===== BARRES DE PROGRESSION (ANIMATION EN CASCADE AU SCROLL) =====
class SkillProgressBars {
    constructor() {
        this.skills = document.querySelectorAll(".skill-item");
        this.animated = false;
        this.init();
    }

    init() {
        if (this.skills.length === 0) return;

        // On utilise un IntersectionObserver pour détecter l'arrivée sur la section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si la section est visible et n'a pas encore été animée
                if (entry.isIntersecting && !this.animated) {
                    this.animateInCascade();
                    this.animated = true; // Empêche de relancer l'animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 }); // Se déclenche quand 20% de la section est visible

        // On observe le conteneur parent des compétences
        const skillsSection = document.querySelector(".technical-skills") || this.skills[0].parentElement;
        if (skillsSection) observer.observe(skillsSection);
    }

    animateInCascade() {
        this.skills.forEach((skill, index) => {
            // Délai progressif : 200ms entre chaque barre
            setTimeout(() => {
                this.animateSingleSkill(skill);
            }, index * 200);
        });
    }

    animateSingleSkill(skill) {
        const progressBar = skill.querySelector(".skill-progress");
        const percentText = skill.querySelector(".skill-percent");
        const levelContainer = skill.querySelector(".skill-level");
        const levelText = levelContainer ? levelContainer.querySelector("span") : null;

        if (!progressBar || !percentText) return;

        const value = parseInt(progressBar.dataset.progress, 10);
        if (isNaN(value)) return;

        // 1. Animation de la barre et du pourcentage
        progressBar.style.width = value + "%";
        percentText.textContent = value + "%";

        // 2. Détermination du niveau (Logique utilisateur)
        let level = "Débutant";
        if (value >= 70) level = "Avancé";
        else if (value >= 40) level = "Intermédiaire";

        // 3. Mise à jour et affichage du niveau
        if (levelText && levelContainer) {
            levelText.textContent = level;
            levelContainer.classList.remove("opacity-0", "translate-y-2");
            levelContainer.classList.add("opacity-100", "translate-y-0");
        }
    }
}

// ===== SYSTÈME DE NOTIFICATION =====
class NotificationSystem {
    constructor() { this.createStyles(); }
    createStyles() {
        if (document.getElementById('notification-styles')) return;
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
               .notification { position: fixed; top: 100px; right: 20px; padding: 1rem 2rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000; animation: slideIn 0.5s ease; font-weight: 500; color: white; }
               .notification.success { background: linear-gradient(135deg, #27ae60, #2ecc71); }
               .notification.error { background: linear-gradient(135deg, #e74c3c, #c0392b); }
               @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
               @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
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
    constructor(notifications) {
        this.form = document.getElementById('contactForm');
        this.notifications = notifications;
        this.init();
    }
    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
                const response = await fetch(this.form.action, { method: 'POST', body: new FormData(this.form), headers: { 'Accept': 'application/json' } });
                if (response.ok) { this.notifications.show('Message envoyé avec succès !'); this.form.reset(); }
                else throw new Error();
            } catch (error) { this.notifications.show('Erreur lors de l\'envoi. Réessayez.', 'error'); }
            finally { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
        });
    }
}

// ===== TÉLÉCHARGEMENT DU CV =====
class CVDownloader {
    constructor() { this.init(); }
    init() {
        const btn = document.getElementById('downloadCV');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
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
            console.log('%c🚀 Portfolio chargé avec succès', 'color: #27ae60; font-size: 14px;');
        });
    }
}

// INITIALISATION
const app = new Portfolio();