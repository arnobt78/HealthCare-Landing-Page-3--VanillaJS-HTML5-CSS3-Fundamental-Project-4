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

  photoCandidates.flat().forEach((url) => {
    const img = new Image();
    img.src = url;
  });

  a.style.backgroundImage = `url("${photoCandidates[0][0]}")`;
  b.style.backgroundImage = `url("${photoCandidates[1 % slideCount][0]}")`;

  let active = 0;
  let index = 0;
  let cycleBusy = false;
  let lastCycleAdvance = 0;

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
    void nextLayer.offsetWidth;
    nextLayer.classList.add("hero__bg-layer--active");

    active = active === 0 ? 1 : 0;
    index = nextIndex;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    a.classList.add("hero__bg-layer--active");
    window.setInterval(() => {
      void goNext();
    }, 8000);
    return;
  }

  const CYCLE_DEBOUNCE_MS = 120;

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
