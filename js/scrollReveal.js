/**
 * scrollReveal.js — scroll-triggered fade/slide using IntersectionObserver
 *
 * Why IntersectionObserver instead of scroll events? The browser tells us only
 * when an element enters/leaves the viewport — no per-frame math, better perf.
 */

const defaultOpts = {
  root: null,
  rootMargin: "0px 0px -8% 0px",
  threshold: 0.12,
};

/**
 * Add .reveal--visible when the element crosses the threshold.
 * @param {ParentNode} [root=document]
 */
export function initScrollReveal(root = document) {
  if (!("IntersectionObserver" in window)) {
    root.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("reveal--visible");
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        io.unobserve(entry.target);
      }
    });
  }, defaultOpts);

  root.querySelectorAll(".reveal").forEach((el) => {
    io.observe(el);
  });
}
