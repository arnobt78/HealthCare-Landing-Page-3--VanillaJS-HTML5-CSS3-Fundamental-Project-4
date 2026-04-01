/**
 * parallax.js — subtle translateY on scroll, throttled with requestAnimationFrame
 *
 * Keeps motion light so we avoid jank; only runs while hero is in view.
 */

let ticking = false;

/**
 * @param {HTMLElement} layer
 * @param {number} factor — multiply scroll (smaller = subtler)
 */
function applyParallax(layer, factor) {
  const y = window.scrollY * factor;
  layer.style.transform = `translate3d(0, ${y}px, 0)`;
}

/**
 * @param {HTMLElement | null} layer
 */
export function initParallax(layer) {
  if (!layer) {
    return;
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        applyParallax(layer, 0.15);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
