/* =====================================================
   PORTFOLIO - APP.JS
   Compatible avec la version Tailwind de index.html

   Ce fichier ne gère plus que ce que index.html ne fait pas déjà :
   - Typed.js (texte qui s'écrit dans l'accueil)
   - Formulaire de contact (EmailJS), toasts, popup, loader
   - Téléchargement du CV

   Déjà géré dans index.html (ne pas le dupliquer ici) :
   menu mobile, scroll doux, lien actif, apparitions au scroll,
   barres de compétences, bouton "remonter", landing page,
   et emailjs.init(...) (script inline en bas de index.html).
   ===================================================== */

"use strict";

// ===== CONFIGURATION =====
const CONFIG = {
  emailServiceId: "service_czmjzgx",
  emailTemplateId: "template_z13umki",
  cvPath: "./assets/CVAdam.pdf", // chemin RELATIF (fonctionne aussi dans un sous-dossier)
  cvFileName: "CV-Adam-Poussi.pdf",
  toastDuration: 4000,
};

const prefersReducedMotion = (() => {
  if (typeof window === "undefined" || !("matchMedia" in window)) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
})();

// ===== TYPED.JS =====
function initTyped() {
  const element = document.querySelector(".multiple");
  if (!element) return;

  // Animations réduites : on affiche simplement le premier texte
  if (prefersReducedMotion) {
    element.textContent = "Développeur Web";
    return;
  }

  if (typeof Typed === "undefined") {
    console.warn("Typed.js non chargé");
    return;
  }

  new Typed(".multiple", {
    strings: ["Développeur Web", "Gestionnaire de Données", "Data Analyst"],
    typeSpeed: 80,
    backSpeed: 80,
    backDelay: 1200,
    loop: true,
    showCursor: true,
    cursorChar: "|",
  });
}

// ===== TOASTS (notifications) =====
const TOAST_STYLES = {
  success: "bg-gradient-to-br from-green-600 to-green-500",
  error: "bg-gradient-to-br from-red-600 to-red-500",
};

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.className =
    "rounded-xl px-6 py-3 font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] " +
    "animate-slide-in motion-reduce:animate-none " +
    (TOAST_STYLES[type] || TOAST_STYLES.success);
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("animate-slide-in");
    toast.classList.add("animate-slide-out", "[animation-fill-mode:forwards]");
    setTimeout(() => toast.remove(), 500);
  }, CONFIG.toastDuration);
}

// ===== DIAGNOSTIC DES ERREURS EMAILJS =====
/*
 Quand l'envoi échoue, EmailJS renvoie un code (error.status) et un texte (error.text).
 On les affiche dans la console (F12) avec une piste de solution.
*/
const EMAIL_ERROR_HINTS = {
  400: "Identifiant de service, de modèle ou clé publique incorrect (vérifie les 3 dans le tableau de bord EmailJS).",
  403: "Requête bloquée : domaine non autorisé (Account > Security), ou site ouvert en file:// ou avec un bloqueur de publicités.",
  412: "Service e-mail non autorisé : reconnecte ton compte Gmail/Outlook dans Email Services.",
  422: "Destinataire vide ou paramètre manquant : vérifie le champ « To email » du modèle.",
  429: "Trop de requêtes ou quota mensuel atteint.",
};

function diagnoseEmailError(error) {
  const status = error && error.status;
  const text =
    (error && (error.text || error.message)) ||
    (typeof error === "string" ? error : "");
  const hint =
    EMAIL_ERROR_HINTS[status] ||
    "Aucun code reçu : problème réseau, bloqueur de publicités (api.emailjs.com bloqué) ou SDK EmailJS non chargé.";

  console.error("Erreur EmailJS — code :", status, "| message :", text);
  console.error("Piste :", hint);
  if (location.protocol === "file:") {
    console.warn(
      "Le site est ouvert en file:// : lance-le via un serveur local (Live Server) ou sur GitHub Pages.",
    );
  }
  return status;
}

// ===== FORMULAIRE DE CONTACT =====
function initContactForm() {
  const form = document.getElementById("contact-form");
  const popup = document.getElementById("popup");
  const popupClose = document.getElementById("popup-close");
  const loader = document.getElementById("loader");
  if (!form || !popup || !popupClose || !loader) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  // --- Popup de confirmation (écouteurs déclarés UNE seule fois) ---
  const openPopup = () => {
    popup.classList.remove("hidden");
    popupClose.focus();
  };
  const closePopup = () => popup.classList.add("hidden");

  popupClose.addEventListener("click", closePopup);
  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup(); // clic sur le fond
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !popup.classList.contains("hidden")) closePopup();
  });

  // --- Envoi ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submitBtn && submitBtn.disabled) return; // évite le double envoi

    if (typeof emailjs === "undefined") {
      showToast(
        "Le service d'envoi n'est pas disponible. Réessaie plus tard.",
        "error",
      );
      return;
    }

    const params = {
      from_name: document.getElementById("from_name").value.trim(),
      from_email: document.getElementById("from_email").value.trim(),
      message: document.getElementById("message").value.trim(),
    };
    params.reply_to = params.from_email;

    if (submitBtn) submitBtn.disabled = true;
    loader.classList.remove("hidden");

    try {
      await emailjs.send(CONFIG.emailServiceId, CONFIG.emailTemplateId, params);
      showToast("Message envoyé avec succès ! 🎉", "success");
      form.reset();
      openPopup();
    } catch (error) {
      console.error("========== ERREUR EMAILJS ==========");
      console.error("Code HTTP :", error.status);
      console.error("Message :", error.text);
      console.error("Erreur complète :", error);
      console.error("====================================");

      showToast(
        "Échec de l'envoi (code " +
          (error.status || "inconnu") +
          "). Consulte la console F12.",
        "error",
      );
    } finally {
      loader.classList.add("hidden");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// ===== TÉLÉCHARGEMENT DU CV =====
/*
 Le téléchargement doit être déclenché par une action de l'utilisateur
 (ici le clic sur le bouton). On crée un lien temporaire avec l'attribut
 "download", on le clique, puis on le supprime.
*/
function initCvDownload() {
  const downloadBtn = document.getElementById("downloadCV");
  if (!downloadBtn) return;

  downloadBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const link = document.createElement("a");
    link.href = CONFIG.cvPath;
    link.download = CONFIG.cvFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}

// ===== INITIALISATION =====
function initPortfolio() {
  initTyped();
  initContactForm();
  initCvDownload();

  console.log(
    "%c👋 Bienvenue sur mon Portfolio!",
    "color: #ff8800; font-size: 20px; font-weight: bold;",
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}
