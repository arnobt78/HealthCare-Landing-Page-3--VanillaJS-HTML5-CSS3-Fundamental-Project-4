/**
 * main.js — application entry (ES module)
 *
 * Order matters: router after DOM ready; observers after markup exists.
 */

import { initRouter } from "./router.js";
import { initRipple } from "./ripple.js";
import { initSafeImages } from "./safeImage.js";
import { initScrollReveal, initRevealStagger } from "./scrollReveal.js";
import { initParallax } from "./parallax.js";
import { initTabs } from "./tabs.js";
import { initDepartmentDropdown } from "./dropdown.js";
import { initMobileNav } from "./sidebar.js";
import { initDoctorsCarousel } from "./doctorsCarousel.js";

/**
 * Hero photos: two layers + opacity crossfade. Zoom runs one full cycle
 * (ease in → ease out to scale 1); the next slide is applied on animationend
 * so we never rip the transform mid-zoom (that caused the “blink”).
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
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71e197d2ac?auto=format&fit=crop&w=1920&q=80",
  ];

  const a = /** @type {HTMLElement} */ (layers[0]);
  const b = /** @type {HTMLElement} */ (layers[1]);

  photos.forEach((url) => {
    const img = new Image();
    img.src = url;
  });

  a.style.backgroundImage = `url("${photos[0]}")`;
  b.style.backgroundImage = `url("${photos[1 % photos.length]}")`;

  let active = 0;
  let index = 0;

  function goNext() {
    const nextIndex = (index + 1) % photos.length;
    const curLayer = active === 0 ? a : b;
    const nextLayer = active === 0 ? b : a;
    const url = photos[nextIndex];

    const preload = new Image();
    preload.src = url;
    nextLayer.style.backgroundImage = `url("${url}")`;

    curLayer.classList.remove("hero__bg-layer--active");
    nextLayer.classList.remove("hero__bg-layer--active");
    void nextLayer.offsetWidth;
    nextLayer.classList.add("hero__bg-layer--active");

    active = active === 0 ? 1 : 0;
    index = nextIndex;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    a.classList.add("hero__bg-layer--active");
    window.setInterval(goNext, 8000);
    return;
  }

  /**
   * @param {AnimationEvent} e
   */
  function onCycleEnd(e) {
    if (e.animationName !== "hero-bg-kenburns-cycle") {
      return;
    }
    const el = /** @type {HTMLElement} */ (e.target);
    if (!el.classList.contains("hero__bg-layer--active")) {
      return;
    }
    goNext();
  }

  a.addEventListener("animationend", onCycleEnd);
  b.addEventListener("animationend", onCycleEnd);
  a.classList.add("hero__bg-layer--active");
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

  /* Paint hero photos before other observers so the block does not flash empty */
  initHeroRotation();
  initRouter();
  initRipple(".btn-ripple");
  initSafeImages(document);
  initRevealStagger(document);
  initScrollReveal(document);
  initParallax(document.querySelector("[data-parallax-layer]"));
  initTabs(document);
  initDepartmentDropdown(document);
  initMobileNav(document.body);
  initDoctorsCarousel(document);
  initFooterYear();
  initHeaderScrollState();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
