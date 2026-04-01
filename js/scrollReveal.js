/**
 * scrollReveal.js — scroll-driven motion (Framer-like feel, no library)
 *
 * IntersectionObserver toggles .reveal--visible when elements enter/leave the
 * viewport so we get both fade-in and fade-out. Staggered delays mimic
 * Framer Motion’s staggerChildren via CSS --reveal-delay.
 *
 * Hero + booking lines use .reveal--sequential instead: they are revealed one
 * by one with setTimeout on load (hero background stays static; no whole-block
 * bounce from IntersectionObserver firing at once).
 */

const defaultOpts = {
  root: null,
  /** Slightly inset bottom so sections animate before they hit the hard edge */
  rootMargin: "0px 0px -8% 0px",
  threshold: [0, 0.12],
};

/** ms between each hero / book line (tune for “one by one” readability) */
const SEQUENTIAL_STEP_MS = 168;

/** Pause after last hero line before first book line */
const SEQUENTIAL_BOOK_GAP_MS = 240;

/** Start hero lines after navbar intro animation */
const SEQUENTIAL_NAV_WAIT_MS = 320;

/**
 * Walk each [data-reveal-stagger] container and add .reveal + delay per child.
 * data-reveal-stagger="120" sets step ms between children (default 80).
 * @param {ParentNode} [root=document]
 */
export function initRevealStagger(root = document) {
  root.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
    const raw = group.getAttribute("data-reveal-stagger");
    const step = raw && raw !== "" ? Number(raw) : 80;
    const ms = Number.isFinite(step) && step > 0 ? step : 80;
    group.querySelectorAll(":scope > *").forEach((child, i) => {
      child.classList.add("reveal");
      child.style.setProperty("--reveal-delay", `${i * ms}ms`);
    });
  });
}

/**
 * One-by-one fade for hero copy + booking form (load only; not tied to scroll).
 * @param {ParentNode} [root=document]
 */
export function initSequentialHeroReveal(root = document) {
  const heroLines = root.querySelectorAll("[data-hero-line]");
  const bookLines = root.querySelectorAll("[data-book-line]");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroLines.forEach((el) => {
      el.classList.add("reveal", "reveal--sequential", "reveal--visible");
    });
    bookLines.forEach((el) => {
      el.classList.add("reveal", "reveal--sequential", "reveal--visible");
    });
    return;
  }

  const showAt = (el, ms) => {
    window.setTimeout(() => {
      el.classList.add("reveal--visible");
    }, ms);
  };

  heroLines.forEach((el, i) => {
    el.classList.add("reveal", "reveal--sequential");
    showAt(el, SEQUENTIAL_NAV_WAIT_MS + i * SEQUENTIAL_STEP_MS);
  });

  const bookStart =
    SEQUENTIAL_NAV_WAIT_MS +
    heroLines.length * SEQUENTIAL_STEP_MS +
    SEQUENTIAL_BOOK_GAP_MS;

  bookLines.forEach((el, i) => {
    el.classList.add("reveal", "reveal--sequential");
    showAt(el, bookStart + i * SEQUENTIAL_STEP_MS);
  });
}

/**
 * @param {ParentNode} [root=document]
 */
export function initScrollReveal(root = document) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.querySelectorAll(".reveal:not(.reveal--sequential)").forEach((el) => {
      el.classList.add("reveal--visible");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    root.querySelectorAll(".reveal:not(.reveal--sequential)").forEach((el) => {
      el.classList.add("reveal--visible");
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("reveal--visible", entry.isIntersecting);
    });
  }, defaultOpts);

  root.querySelectorAll(".reveal:not(.reveal--sequential)").forEach((el) => {
    io.observe(el);
  });
}
