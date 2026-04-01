/**
 * main.js — application entry (ES module)
 *
 * Order matters: router after DOM ready; observers after markup exists.
 */

import { initRouter } from "./router.js";
import { initRipple } from "./ripple.js";
import { initSafeImages } from "./safeImage.js";
import {
  initScrollReveal,
  initRevealStagger,
  initSequentialHeroReveal,
} from "./scrollReveal.js";
import { initParallax } from "./parallax.js";
import { initTabs } from "./tabs.js";
import { initDepartmentDropdown } from "./dropdown.js";
import { initMobileNav } from "./sidebar.js";
import { initDoctorsCarousel } from "./doctorsCarousel.js";

/**
 * Smooth crossfade between Unsplash hero photos (background-image won’t
 * interpolate on one element — two layers + opacity transition fixes that).
 */
function initHeroRotation() {
  const hero = document.querySelector("[data-hero]");
  const layers = hero?.querySelectorAll("[data-hero-bg-layer]");
  if (!(hero instanceof HTMLElement) || !layers || layers.length < 2) {
    return;
  }

  const photos = [
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=1920&q=80",
  ];

  const a = /** @type {HTMLElement} */ (layers[0]);
  const b = /** @type {HTMLElement} */ (layers[1]);

  a.style.backgroundImage = `url("${photos[0]}")`;
  b.style.backgroundImage = `url("${photos[1 % photos.length]}")`;
  a.classList.add("hero__bg-layer--active");

  let active = 0;
  let index = 0;

  window.setInterval(() => {
    const nextIndex = (index + 1) % photos.length;
    const nextLayer = active === 0 ? b : a;
    const curLayer = active === 0 ? a : b;

    nextLayer.style.backgroundImage = `url("${photos[nextIndex]}")`;
    curLayer.classList.remove("hero__bg-layer--active");
    nextLayer.classList.add("hero__bg-layer--active");
    active = active === 0 ? 1 : 0;
    index = nextIndex;
  }, 6000);
}

function initFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

/**
 * After the hero, switch header to a light bar so nav links stay readable on
 * pale sections (transparent header stays over the hero only).
 */
function initHeaderScrollState() {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector("[data-hero]");
  if (!(header instanceof HTMLElement) || !(hero instanceof HTMLElement)) {
    return;
  }

  const apply = () => {
    const threshold = Math.max(hero.offsetHeight - 72, 0);
    const onLight = window.scrollY > threshold;
    header.classList.toggle("site-header--on-light", onLight);
  };

  apply();
  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply, { passive: true });
}

function boot() {
  const bookForm = document.querySelector(".book-form");
  if (bookForm) {
    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  initRouter();
  initRipple(".btn-ripple");
  initSafeImages(document);
  initRevealStagger(document);
  initSequentialHeroReveal(document);
  initScrollReveal(document);
  initParallax(document.querySelector("[data-parallax-layer]"));
  initTabs(document);
  initDepartmentDropdown(document);
  initMobileNav(document.body);
  initDoctorsCarousel(document);
  initHeroRotation();
  initFooterYear();
  initHeaderScrollState();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
