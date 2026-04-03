/**
 * main.js — application entry (ES module)
 *
 * Walkthrough: this file does not render UI itself; it imports feature modules
 * and runs their init* functions once the DOM is ready. Think of it as the
 * “composition root” (same idea as main.tsx in a React app, but manual).
 *
 * Order matters: e.g. hero imagery before scroll observers, router after
 * elements exist, doctor modal after service modal (shared dialog refs).
 */

import { initRouter } from "./router.js";
import { initRipple } from "./ripple.js";
import { initSafeImages } from "./safeImage.js";
import { initScrollReveal, initRevealStagger } from "./scrollReveal.js";
import { initParallax } from "./parallax.js";
import { initTabs } from "./tabs.js";
import { initResourcesLines } from "./resourcesLines.js";
import { initDepartmentDropdown } from "./dropdown.js";
import { initMobileNav } from "./sidebar.js";
import { initDoctorsCarousel } from "./doctorsCarousel.js";
import { initServiceModal } from "./serviceModal.js";
import { initDoctorModal } from "./doctorModal.js";

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

  /** @param {string} id full Unsplash photo id after "photo-" */
  const u = (id) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&q=80`;

  const heroLocal = (n) => `/public/hero/hero-${n}.jpg`;

  /**
   * Five slides; each has a primary + fallbacks. Unsplash sometimes 403s or
   * drops a file — probing onerror (false) avoids swapping to a “green” layer.
   */
  const photoCandidates = [
    [heroLocal(1), u("1631217868264-e5b90bb7e133"), u("1538108149393-fedd4303d0e3")],
    [heroLocal(2), u("1584515933487-779824d29309"), u("1532938911079-1b06ac7ceec7")],
    [heroLocal(3), u("1519494026892-80bbd2d6fd0d"), u("1666214280391-8ff5bd3c0bf0")],
    [heroLocal(4), u("1576091160399-112ba8d25d1d"), u("1516549655169-83a407c1f9b4")],
    [heroLocal(5), u("1505751172876-fa1923c5c528"), u("1559839734-2b71e197d2ac")],
  ];

  const slideCount = photoCandidates.length;

  /** @type {Record<number, string>} */
  const heroUrlCache = {};

  const a = /** @type {HTMLElement} */ (layers[0]);
  const b = /** @type {HTMLElement} */ (layers[1]);

  // Warm the browser cache for hero URLs so crossfades are less likely to flash empty.
  photoCandidates.flat().forEach((url) => {
    const img = new Image();
    img.src = url;
  });

  a.style.backgroundImage = `url("${photoCandidates[0][0]}")`;
  b.style.backgroundImage = `url("${photoCandidates[1 % slideCount][0]}")`;

  let active = 0; // which layer (0=a, 1=b) is visually on top for CSS animation
  let index = 0; // logical slide index 0..slideCount-1
  let cycleBusy = false; // guard: don’t start goNext while previous transition still running
  let lastCycleAdvance = 0; // for debouncing duplicate animationend (both layers can fire)

  /**
   * @param {string} url
   * @returns {Promise<boolean>}
   */
  function probeImageLoad(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (typeof img.decode === "function") {
          img.decode().then(() => resolve(true)).catch(() => resolve(true));
        } else {
          resolve(true);
        }
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  /**
   * @param {number} slideIndex
   * @returns {Promise<string>}
   */
  async function resolveHeroUrl(slideIndex) {
    const cached = heroUrlCache[slideIndex];
    if (cached) {
      return cached;
    }
    const list = photoCandidates[slideIndex];
    for (const url of list) {
      if (await probeImageLoad(url)) {
        heroUrlCache[slideIndex] = url;
        return url;
      }
    }
    heroUrlCache[slideIndex] = list[0];
    return list[0];
  }

  void (async () => {
    const u0 = await resolveHeroUrl(0);
    const u1 = await resolveHeroUrl(1 % slideCount);
    a.style.backgroundImage = `url("${u0}")`;
    b.style.backgroundImage = `url("${u1}")`;
  })();

  /**
   * @returns {Promise<void>}
   */
  async function goNext() {
    const nextIndex = (index + 1) % slideCount;
    const curLayer = active === 0 ? a : b;
    const nextLayer = active === 0 ? b : a;
    const url = await resolveHeroUrl(nextIndex);

    nextLayer.style.backgroundImage = `url("${url}")`;
    curLayer.classList.remove("hero__bg-layer--active");
    nextLayer.classList.remove("hero__bg-layer--active");
    // Force reflow so the browser restarts CSS animation on next class add (retrigger keyframes).
    void nextLayer.offsetWidth;
    nextLayer.classList.add("hero__bg-layer--active");

    active = active === 0 ? 1 : 0;
    index = nextIndex;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reduced motion: no Ken Burns; simple timed slide change instead.
  if (reduce) {
    a.classList.add("hero__bg-layer--active");
    window.setInterval(() => {
      void goNext();
    }, 8000);
    return;
  }

  const CYCLE_DEBOUNCE_MS = 120; // ignore spurious double animationend around the same time

  /**
   * @param {AnimationEvent} e
   */
  function onCycleEnd(e) {
    if (e.animationName !== "hero-bg-kenburns-cycle") {
      return;
    }
    const el = /** @type {HTMLElement} */ (e.target);
    if (el !== e.currentTarget) {
      return;
    }
    if (!el.classList.contains("hero__bg-layer--active")) {
      return;
    }
    const now = performance.now();
    if (now - lastCycleAdvance < CYCLE_DEBOUNCE_MS) {
      return;
    }
    lastCycleAdvance = now;
    if (cycleBusy) {
      return;
    }
    cycleBusy = true;
    void goNext().finally(() => {
      cycleBusy = false;
    });
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
  // Demo only: no backend POST — prevent full page reload on submit.
  const bookForm = document.querySelector(".book-form");
  if (bookForm) {
    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  /* Paint hero photos before other observers so the block does not flash empty */
  initHeroRotation();
  // History API + in-page scroll; see router.js SECTION_BY_PATH for “fake pages”.
  initRouter();
  initRipple(".btn-ripple");
  initSafeImages(document);
  // Scroll-driven: stagger delays on parents, then IntersectionObserver toggles .reveal--visible.
  initRevealStagger(document);
  initScrollReveal(document);
  initParallax(document.querySelector("[data-parallax-layer]"));
  // ARIA tablist + optional auto-rotate under [data-tabs-carousel]; min-height sync in tabs.js.
  initTabs(document);
  initResourcesLines(document);
  // Updates appState.department → doctors carousel + card filter react via subscribe().
  initDepartmentDropdown(document);
  initMobileNav(document.body);
  // Must run before doctor modal: both use the same <dialog> and sharedModalRefs.
  initServiceModal(document);
  initDoctorModal(document);
  initDoctorsCarousel(document);
  initFooterYear();
  // Sticky header swaps to a light theme after scrolling past the hero.
  initHeaderScrollState();
}

// Support both deferred script (DOMContentLoaded) and async late injection.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
