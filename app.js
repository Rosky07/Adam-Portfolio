/* =====================================================
   PORTFOLIO - APP.JS
   Fichier JavaScript principal avec animations scroll
   ===================================================== */

// =====================================================
// 1. ANIMATION TYPED.JS POUR LE TEXTE DYNAMIQUE
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de Typed.js pour animer le texte
    const typed = new Typed('.multiple', {
        strings: [
            'Développeur Web',
            'Gestionnaire de Données',
            'Data Analyst',
        ],
        typeSpeed: 80,
        backSpeed: 80,
        backDelay: 1200,
        loop: true
    });
});

// =====================================================
// 2. ANIMATIONS AU SCROLL - INTERSECTION OBSERVER
// =====================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Callback pour l'intersection observer
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scrolled');
            // Une fois animé, on arrête d'observer cet élément
            observer.unobserve(entry.target);
        }
    });
};

// Création de l'observer
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observer tous les éléments avec la classe scroll-element
const scrollElements = document.querySelectorAll('.scroll-element');
scrollElements.forEach(el => observer.observe(el));

// =====================================================
// 3. SMOOTH SCROLL POUR LA NAVIGATION
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================================
// 4. HEADER ACTIF AU SCROLL
// =====================================================
const header = document.querySelector('header');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

// Fonction pour mettre à jour le lien actif
function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`nav a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });

    // Ajouter une ombre au header lors du scroll
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateActiveLink);

// =====================================================
// 5. GESTION DU FORMULAIRE DE CONTACT
// =====================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        if (name && email) {
            // Simulation d'envoi (à remplacer par votre logique d'envoi)
            showNotification('Message envoyé avec succès ! 🎉', 'success');
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Dans un cas réel, vous enverriez les données à un serveur :
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email })
            // });
        } else {
            showNotification('Veuillez remplir tous les champs', 'error');
        }
    });
}

// =====================================================
// 6. SYSTÈME DE NOTIFICATION
// =====================================================
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.5s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Retirer la notification après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Ajouter les animations CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    nav a.active {
        color: #ff8800;
    }
    
    nav a.active::after {
        width: 100%;
    }
    
    header.scrolled {
        box-shadow: 0 4px 30px rgba(255, 136, 0, 0.3);
    }
`;
document.head.appendChild(style);

// =====================================================
// 7. ANIMATION DES CARTES AU HOVER
// =====================================================
const cards = document.querySelectorAll('.competence-card, .projet');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// =====================================================
// 8. COMPTEUR D'ANIMATIONS (OPTIONNEL)
// =====================================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// =====================================================
// 9. LAZY LOADING DES IMAGES
// =====================================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback pour les navigateurs qui ne supportent pas le lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// =====================================================
// 10. DÉTECTION DU MODE SOMBRE (OPTIONNEL)
// =====================================================
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function detectColorScheme() {
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Détecter le changement de préférence
prefersDarkScheme.addEventListener('change', detectColorScheme);

// =====================================================
// 11. PERFORMANCE - DEBOUNCE POUR LE SCROLL
// =====================================================
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimiser l'event scroll avec debounce
window.addEventListener('scroll', debounce(updateActiveLink, 15));

// =====================================================
// 12. CONSOLE MESSAGE
// =====================================================
console.log('%c👋 Bienvenue sur mon Portfolio!', 'color: #ff8800; font-size: 20px; font-weight: bold;');
console.log('%c🚀 Développé avec passion par Adam Poussi', 'color: #27ae60; font-size: 14px;');
console.log('%c💼 Contactez-moi pour vos projets web!', 'color: #3498db; font-size: 14px;');

// =====================================================
// 13. MESSAGE DE CHARGEMENT COMPLET
// =====================================================
window.addEventListener('load', function() {
    console.log('✅ Portfolio chargé avec succès!');
    
    // Animation d'apparition initiale
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});


/************************************/
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const sujet = encodeURIComponent(`Contact de ${prenom} ${nom}`);
    const corps = encodeURIComponent(
        `Nom: ${nom}\n` +
        `Prénom: ${prenom}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`
    );
    
    window.location.href = `mailto:roskyadam7@gmail.com?subject=${sujet}&body=${corps}`;
});