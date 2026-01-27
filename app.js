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
           if (scrollY > 50) {
               this.header.classList.add('scrolled');
           } else {
               this.header.classList.remove('scrolled');
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
   
   // ===== BARRES DE PROGRESSION =====
   class SkillProgressBars {
       constructor() {
           this.skillBars = document.querySelectorAll('.skill-progress');
           this.skillItems = document.querySelectorAll('.skill-item');
           this.animated = false;
           this.init();
       }
   
       init() {
           const observer = new IntersectionObserver(
               (entries) => this.handleIntersection(entries),
               { threshold: 0.3 }
           );
   
           const skillsSection = document.querySelector('.technical-skills');
           if (skillsSection) {
               observer.observe(skillsSection);
           }
       }
   
       handleIntersection(entries) {
           entries.forEach(entry => {
               if (entry.isIntersecting && !this.animated) {
                   this.animateBars();
                   this.animated = true;
               }
           });
       }
   
       animateBars() {
           this.skillItems.forEach((item, index) => {
               setTimeout(() => {
                   const bar = item.querySelector('.skill-progress');
                   const percentSpan = item.querySelector('.skill-percent');
                   const targetProgress = parseInt(bar.getAttribute('data-progress'));
                   
                   // Animation synchronisée barre + pourcentage
                   this.animateSkill(bar, percentSpan, targetProgress);
               }, index * 400); // Délai entre chaque compétence (400ms)
           });
       }
   
       animateSkill(bar, percentSpan, target) {
           let current = 0;
           const duration = 2500; // 2.5 secondes par barre
           const startTime = Date.now();
           
           const animate = () => {
               const elapsed = Date.now() - startTime;
               const progress = Math.min(elapsed / duration, 1);
               
               // Fonction easing ease-out pour ralentir progressivement
               const easeOut = 1 - Math.pow(1 - progress, 3);
               current = easeOut * target;
               
               // Mettre à jour la barre ET le pourcentage en même temps
               bar.style.width = current + '%';
               percentSpan.textContent = Math.round(current) + '%';
               
               if (progress < 1) {
                   requestAnimationFrame(animate);
               } else {
                   // S'assurer que les valeurs finales sont exactes
                   bar.style.width = target + '%';
                   percentSpan.textContent = target + '%';
               }
           };
           
           requestAnimationFrame(animate);
       }
   }
   
   // ===== SYSTÈME DE NOTIFICATION =====
   class NotificationSystem {
       constructor() {
           this.createStyles();
       }
   
       createStyles() {
           const style = document.createElement('style');
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
               
               .notification.success {
                   background: linear-gradient(135deg, #27ae60, #2ecc71);
               }
               
               .notification.error {
                   background: linear-gradient(135deg, #e74c3c, #c0392b);
               }
               
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
   
   // ===== FORMULAIRE DE CONTACT =====
   // Initialisation EmailJS avec ta clé publique
   (function() {
       emailjs.init("p_WWm94VaaylHEPTc"); // YOUR PUBLIC KEY
   })();
   
   document.getElementById("contact-form").addEventListener("submit", function(e) {
       e.preventDefault(); // Empêcher le rechargement
   
       // Récupération des valeurs du formulaire
       const params = {
           from_name: document.getElementById("from_name").value,
           from_email: document.getElementById("from_email").value,
           message: document.getElementById("message").value
       };
   
       // Fonction toast
       const notification = {
           show: (message, type) => {
               const container = document.getElementById("toast-container");
               const toast = document.createElement("div");
               toast.className = `toast ${type}`;
               toast.textContent = message;
   
               container.appendChild(toast);
   
               setTimeout(() => {
                   toast.remove();
               }, 4000);
           }
       };
   
       // Gestion popup
       const popup = document.getElementById("popup");
       const popupClose = document.getElementById("popup-close");
   
       popupClose.addEventListener("click", () => {
           popup.classList.add("hidden");
       });
   
       // Loader
       const loader = document.getElementById("loader");
   
       loader.classList.remove("hidden"); // 👉 Affiche le loader
   
       emailjs.send("service_czmjzgx", "template_z13umki", params)
           .then((response) => {
               console.log("SUCCESS:", response);
   
               loader.classList.add("hidden");         // 👉 Cache loader
               notification.show("Message envoyé avec succès ! 🎉", "success");
               popup.classList.remove("hidden");       // 👉 Popup animée
   
               // 👉 Reset du formulaire après succès
               document.getElementById("contact-form").reset();
   
           }, (error) => {
               loader.classList.add("hidden");         // 👉 Cache loader même en erreur
               console.error("ERROR:", error);
   
               notification.show("Une erreur est survenue. Réessaie plus tard.", "error");
           });
   });
   
   // ===== FIN DU FORMULAIRE DE CONTACT =====
   
   
   
   
   
   // ===== ANIMATIONS DES CARTES =====
   class CardAnimations {
       constructor() {
           this.init();
       }
   
       init() {
           const cards = document.querySelectorAll('.competence-card, .projet, .timeline-content');
           
           cards.forEach(card => {
               card.addEventListener('mouseenter', function() {
                   this.style.transition = 'all 0.3s ease';
               });
           });
       }
   }
   
   // ===== LAZY LOADING DES IMAGES =====
   class LazyLoadImages {
       constructor() {
           this.init();
       }
   
       init() {
           if ('loading' in HTMLImageElement.prototype) {
               const images = document.querySelectorAll('img[loading="lazy"]');
               images.forEach(img => {
                   if (img.dataset.src) {
                       img.src = img.dataset.src;
                   }
               });
           } else {
               // Fallback pour les anciens navigateurs
               const script = document.createElement('script');
               script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
               document.body.appendChild(script);
           }
       }
   }
   
   // ===== INITIALISATION =====
   class Portfolio {
       constructor() {
           this.init();
       }
   
       init() {
           // Attendre que le DOM soit chargé
           if (document.readyState === 'loading') {
               document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
           } else {
               this.initializeComponents();
           }
       }
   
       initializeComponents() {
           // Initialiser tous les composants
           new MobileMenu();
           new TypedAnimations();
           new ScrollAnimations();
           new ActiveNavigation();
           new SmoothScroll();
           new SkillProgressBars();
           new ContactForm();
           new CardAnimations();
           new LazyLoadImages();
   
           // Animation d'apparition initiale
           this.fadeInBody();
   
           // Messages console
           this.consoleMessages();
   
           console.log('✅ Portfolio initialisé avec succès!');
       }
   
       fadeInBody() {
           document.body.style.opacity = '0';
           setTimeout(() => {
               document.body.style.transition = 'opacity 0.5s ease';
               document.body.style.opacity = '1';
           }, 100);
       }
   
       consoleMessages() {
           console.log(
               '%c👋 Bienvenue sur mon Portfolio!',
               'color: #ff8800; font-size: 20px; font-weight: bold;'
           );
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
   
   // ===== DÉMARRAGE DE L'APPLICATION =====
   const portfolio = new Portfolio();
   
   // ===== GESTION DES ERREURS GLOBALES =====
   window.addEventListener('error', (e) => {
       console.error('Erreur détectée:', e.error);
   });
   
   // ===== PERFORMANCE MONITORING =====
   window.addEventListener('load', () => {
       if ('performance' in window) {
           const perfData = window.performance.timing;
           const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
           console.log(`⚡ Temps de chargement: ${pageLoadTime}ms`);
       }
   });
=======
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
        if (scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
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

// ===== BARRES DE PROGRESSION =====
/* =====================================================
   SKILLS COMPONENT - ANIMATION & NIVEAU AUTOMATIQUE
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const skills = document.querySelectorAll(".skill-item");

    skills.forEach(skill => {

        const progressBar = skill.querySelector(".skill-progress");
        const percentText = skill.querySelector(".skill-percent");
        const levelContainer = skill.querySelector(".skill-level");
        const levelText = levelContainer.querySelector("span");

        const progressValue = parseInt(progressBar.dataset.progress, 10);

        /* ---------- 1. Animation de la barre ---------- */
        requestAnimationFrame(() => {
            progressBar.style.width = progressValue + "%";
        });

        /* ---------- 2. Animation du pourcentage ---------- */
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

        /* ---------- 3. Détermination du niveau ---------- */
        let level = "";

        if (progressValue <= 40) {
            level = "Débutant";
        } else if (progressValue <= 70) {
            level = "Intermédiaire";
        } else {
            level = "Avancé";
        }

        /* ---------- 4. Animation du texte du niveau ---------- */
        setTimeout(() => {
            levelText.textContent = level;
            levelContainer.classList.remove("opacity-0", "translate-y-2");
            levelContainer.classList.add("opacity-100", "translate-y-0");
        }, 800);

    });

});


// ===== SYSTÈME DE NOTIFICATION =====
class NotificationSystem {
    constructor() {
        this.createStyles();
    }

    createStyles() {
        const style = document.createElement('style');
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
            
            .notification.success {
                background: linear-gradient(135deg, #27ae60, #2ecc71);
            }
            
            .notification.error {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
            }
            
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

// ===== FORMULAIRE DE CONTACT =====
// Initialisation EmailJS avec ta clé publique
(function() {
    emailjs.init("p_WWm94VaaylHEPTc"); // YOUR PUBLIC KEY
})();

document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Empêcher le rechargement

    // Récupération des valeurs du formulaire
    const params = {
        from_name: document.getElementById("from_name").value,
        from_email: document.getElementById("from_email").value,
        message: document.getElementById("message").value
    };

    // Fonction toast
    const notification = {
        show: (message, type) => {
            const container = document.getElementById("toast-container");
            const toast = document.createElement("div");
            toast.className = `toast ${type}`;
            toast.textContent = message;

            container.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 4000);
        }
    };

    // Gestion popup
    const popup = document.getElementById("popup");
    const popupClose = document.getElementById("popup-close");

    popupClose.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    // Loader
    const loader = document.getElementById("loader");

    loader.classList.remove("hidden"); // 👉 Affiche le loader

    emailjs.send("service_czmjzgx", "template_z13umki", params)
        .then((response) => {
            console.log("SUCCESS:", response);

            loader.classList.add("hidden");         // 👉 Cache loader
            notification.show("Message envoyé avec succès ! 🎉", "success");
            popup.classList.remove("hidden");       // 👉 Popup animée

            // 👉 Reset du formulaire après succès
            document.getElementById("contact-form").reset();

        }, (error) => {
            loader.classList.add("hidden");         // 👉 Cache loader même en erreur
            console.error("ERROR:", error);

            notification.show("Une erreur est survenue. Réessaie plus tard.", "error");
        });
});

// ===== FIN DU FORMULAIRE DE CONTACT =====





// ===== ANIMATIONS DES CARTES =====
class CardAnimations {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.competence-card, .projet, .timeline-content');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }
}

// ===== LAZY LOADING DES IMAGES =====
class LazyLoadImages {
    constructor() {
        this.init();
    }

    init() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback pour les anciens navigateurs
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }
}

// ===== INITIALISATION =====
class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialiser tous les composants
        new MobileMenu();
        new TypedAnimations();
        new ScrollAnimations();
        new ActiveNavigation();
        new SmoothScroll();
        new SkillProgressBars();
        new ContactForm();
        new CardAnimations();
        new LazyLoadImages();

        // Animation d'apparition initiale
        this.fadeInBody();

        // Messages console
        this.consoleMessages();

        console.log('✅ Portfolio initialisé avec succès!');
    }

    fadeInBody() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    }

    consoleMessages() {
        console.log(
            '%c👋 Bienvenue sur mon Portfolio!',
            'color: #ff8800; font-size: 20px; font-weight: bold;'
        );
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

// ===== DÉMARRAGE DE L'APPLICATION =====
const portfolio = new Portfolio();

// ===== GESTION DES ERREURS GLOBALES =====
window.addEventListener('error', (e) => {
    console.error('Erreur détectée:', e.error);
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Temps de chargement: ${pageLoadTime}ms`);
    }
});

/* =====================================================
   TELECHARGEMENT DU CV (VERSION SANS BACKEND)
   ===================================================== */

/*
 EXPLICATION :
 - Les navigateurs modernes bloquent les téléchargements automatiques
 - Le téléchargement DOIT être déclenché par une action utilisateur
 - On crée donc dynamiquement une balise <a>
 - On force l'attribut "download"
 - Puis on déclenche un clic programmatique
*/

document.addEventListener('DOMContentLoaded', () => {

    // Récupération du bouton "Télécharger mon CV"
    const downloadBtn = document.getElementById('downloadCV');

    // Sécurité : on vérifie que le bouton existe bien dans le DOM
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', (event) => {
        // Empêche le comportement par défaut du lien (évite la redirection)
        event.preventDefault();

        // Création dynamique d'un lien HTML
        const link = document.createElement('a');

        // Chemin ABSOLU vers le fichier PDF
        // IMPORTANT : le fichier doit être dans /public ou /assets
        link.href = '/assets/CVAdam.pdf';

        // Nom du fichier téléchargé
        link.download = 'CV-Adam-Poussi.pdf';

        // Le lien doit être ajouté au DOM pour fonctionner sur certains navigateurs
        document.body.appendChild(link);

        // Déclenchement manuel du téléchargement
        link.click();

        // Nettoyage : suppression du lien après usage
        document.body.removeChild(link);
    });
});
>>>>>>> 77f41ee ({adam})
