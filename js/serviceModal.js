/**
 * serviceModal.js — reusable <dialog> for “Our special services” detail views.
 */

import { SAFE_IMAGE_PLACEHOLDER } from "./safeImage.js";

/**
 * @typedef {{
 *   title: string;
 *   badge: string;
 *   badgeMod: string;
 *   icon: string;
 *   short: string;
 *   detail: string;
 *   image: string;
 *   imageAlt: string;
 *   images?: string[];
 * }} ModalDetail
 */

/** @type {Record<string, ModalDetail>} */
const SERVICE_DETAILS = {
  lab: {
    title: "Laboratory tests",
    badge: "Lab certified",
    badgeMod: "sky",
    icon: "ri-microscope-line",
    short:
      "Accurate diagnostics and swift results with careful sample handling and reporting you can understand.",
    detail:
      "Our laboratory partners follow strict chain-of-custody protocols. Results are reviewed by qualified staff and delivered in plain language so you know exactly what they mean for your care plan.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Laboratory diagnostics workspace with microscope",
  },
  checks: {
    title: "Health checks",
    badge: "Preventive care",
    badgeMod: "emerald",
    icon: "ri-mental-health-line",
    short:
      "Preventive assessments help you stay ahead of issues with practical lifestyle guidance.",
    detail:
      "Structured screenings and risk reviews help catch changes early. After each visit you receive clear next steps—whether that means lifestyle tweaks, follow-up tests, or specialist referral.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Doctor consulting with a patient during a health check",
  },
  dentistry: {
    title: "General dentistry",
    badge: "Full-service oral care",
    badgeMod: "amber",
    icon: "ri-medicine-bottle-line",
    short:
      "Comprehensive oral care to keep your smile healthy — routine cleanings to restorative options.",
    detail:
      "From hygiene visits and preventive education to fillings and restorative work, our dental team focuses on comfort, clarity, and long-term oral health. Treatment plans are explained before any procedure.",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Dental examination and oral care setting",
    images: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559839734-2b71e197d2ac?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445527815219-ecbfec674992?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606811971618-448aae2f9168?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  contact: {
    title: "Ask about a service",
    badge: "We're here to help",
    badgeMod: "teal",
    icon: "ri-customer-service-2-line",
    short:
      "Tell us what you need—labs, checkups, dental care, or something else—and we’ll connect you with the right team.",
    detail:
      "Call us during office hours, email support, or use the contact details in the site footer. If you’re not sure which service fits, describe your situation and we’ll help you book the right appointment or specialist.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Care team member greeting a patient at reception",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516549655169-83a407c1f9b4?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

/**
 * Populates the shared dialog and opens it (used by services + doctors).
 * Call only after `initServiceModal` has run successfully.
 *
 * @param {ModalDetail} def
 */
export function openSharedModalDetail(def) {
  if (!sharedModalRefs) {
    return;
  }

  const { dialog, img, iconWrap, badgeEl, titleEl, shortEl, detailEl } =
    sharedModalRefs;

  const urls =
    Array.isArray(def.images) && def.images.length > 0 ? def.images : [def.image];
  let urlIndex = 0;
  img.onerror = () => {
    urlIndex += 1;
    if (urlIndex < urls.length) {
      img.src = urls[urlIndex];
    } else {
      img.onerror = null;
      img.src = SAFE_IMAGE_PLACEHOLDER;
    }
  };

  img.alt = def.imageAlt;
  img.src = urls[0];

  iconWrap.innerHTML = `<i class="${def.icon}" aria-hidden="true"></i>`;
  badgeEl.textContent = def.badge;
  badgeEl.className = `service__badge service__badge--${def.badgeMod}`;
  titleEl.textContent = def.title;
  shortEl.textContent = def.short;
  detailEl.textContent = def.detail;

  if (!dialog.open) {
    dialog.showModal();
  }
}

/** @type {null | {
 *   dialog: HTMLDialogElement;
 *   img: HTMLImageElement;
 *   iconWrap: HTMLElement;
 *   badgeEl: HTMLElement;
 *   titleEl: HTMLElement;
 *   shortEl: HTMLElement;
 *   detailEl: HTMLElement;
 * }} */
let sharedModalRefs = null;

/**
 * @param {ParentNode} [root=document]
 */
export function initServiceModal(root = document) {
  const dialog = root.querySelector("[data-service-modal]");
  if (!(dialog instanceof HTMLDialogElement)) {
    return;
  }

  const img = root.querySelector("[data-service-modal-img]");
  const iconWrap = root.querySelector("[data-service-modal-icon]");
  const badgeEl = root.querySelector("[data-service-modal-badge]");
  const titleEl = root.querySelector("[data-service-modal-title]");
  const shortEl = root.querySelector("[data-service-modal-short]");
  const detailEl = root.querySelector("[data-service-modal-detail]");
  const closeBtn = root.querySelector("[data-service-modal-close]");

  if (
    !(img instanceof HTMLImageElement) ||
    !(iconWrap instanceof HTMLElement) ||
    !(badgeEl instanceof HTMLElement) ||
    !(titleEl instanceof HTMLElement) ||
    !(shortEl instanceof HTMLElement) ||
    !(detailEl instanceof HTMLElement)
  ) {
    return;
  }

  sharedModalRefs = {
    dialog,
    img,
    iconWrap,
    badgeEl,
    titleEl,
    shortEl,
    detailEl,
  };

  /**
   * @param {string} id
   */
  function openFor(id) {
    const def = SERVICE_DETAILS[id];
    if (!def) {
      return;
    }
    openSharedModalDetail(def);
  }

  root.querySelectorAll("[data-service-open]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-service-open");
      if (id) {
        openFor(id);
      }
    });
  });

  closeBtn?.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });

  document.addEventListener(
    "click",
    (e) => {
      const a = e.target?.closest?.("a[data-spa-link]");
      if (a && dialog.open) {
        dialog.close();
      }
    },
    true,
  );

  window.addEventListener("popstate", () => {
    if (dialog.open) {
      dialog.close();
    }
  });
}
