/**
 * resourcesLines.js — staggered [data-tab-line] reveal for Patient resources
 * (same timing as tabs.js Plans & information panels).
 */

const LINE_STAGGER_MS = 280;

/**
 * @param {HTMLElement} panel
 * @param {boolean} reducedMotion
 */
function runResourcesLineAnimation(panel, reducedMotion) {
  if (reducedMotion) {
    panel.classList.add("resources__anim-panel--visible");
    return;
  }

  panel.classList.remove("resources__anim-panel--visible");

  const lines = panel.querySelectorAll("[data-tab-line]");
  lines.forEach((el, i) => {
    el.style.setProperty("--tab-line-delay", `${i * LINE_STAGGER_MS}ms`);
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.classList.add("resources__anim-panel--visible");
    });
  });
}

/**
 * @param {ParentNode} [root=document]
 */
export function initResourcesLines(root = document) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  root.querySelectorAll("[data-resources-lines]").forEach((el) => {
    const block = /** @type {HTMLElement} */ (el);
    const panel = block.querySelector(".resources__anim-panel");
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    block.classList.add("resources-block--ready");

    const start = () => {
      runResourcesLineAnimation(panel, reducedMotion);
    };

    if (reducedMotion) {
      start();
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            obs.disconnect();
          }
        }
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: [0, 0.1] },
    );

    io.observe(block);
  });
}
