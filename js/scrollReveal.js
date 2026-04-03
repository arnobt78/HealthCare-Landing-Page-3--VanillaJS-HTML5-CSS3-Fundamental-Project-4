/**
 * scrollReveal.js — scroll-driven motion (Framer-like feel, no library)
 *
 * IntersectionObserver toggles .reveal--visible when elements enter/leave the
 * viewport so we get both fade-in and fade-out. Staggered delays mimic
 * Framer Motion’s staggerChildren via CSS --reveal-delay.
 *
 * Hero copy and the booking card stay fully visible on load (no entrance
 * animation there) so refresh does not feel like the hero “bounces up”.
 */

const defaultOpts = {
  root: null,
  /** Slightly inset bottom so sections animate before they hit the hard edge */
  rootMargin: "0px 0px -8% 0px",
  threshold: [0, 0.12],
};

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
 * @param {ParentNode} [root=document]
 */
export function initScrollReveal(root = document) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("reveal--visible");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    root.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("reveal--visible");
    });
    return;
  }

  // Toggle class on enter/leave viewport → CSS transitions handle fade/slide (see styles.css .reveal).
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("reveal--visible", entry.isIntersecting);
    });
  }, defaultOpts);

  root.querySelectorAll(".reveal").forEach((el) => {
    io.observe(el);
  });
}
