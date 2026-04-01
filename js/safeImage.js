/**
 * safeImage.js — vanilla version of “try remote image, fallback on error”
 *
 * Unsplash URLs need no API key. If a URL fails (network, block), we swap to
 * a neutral placeholder so the layout never breaks.
 */

/** @type {string} */
const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#1e293b" width="800" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="system-ui" font-size="24">Image unavailable</text></svg>`,
  );

/**
 * Attach onerror once so failed loads switch to placeholder (educational: same
 * idea as SafeImage in React docs, but plain DOM).
 * @param {HTMLImageElement} img
 * @param {string} [fallbackSrc]
 */
export function bindSafeImage(img, fallbackSrc = PLACEHOLDER) {
  if (!img || img.dataset.safeBound === "1") {
    return;
  }
  img.dataset.safeBound = "1";
  img.addEventListener(
    "error",
    () => {
      if (img.src !== fallbackSrc) {
        img.src = fallbackSrc;
      }
    },
    { once: false },
  );
}

/**
 * Bind every img[data-safe-src] or .safe-img inside root (optional data-fallback-src).
 * @param {ParentNode} [root=document]
 */
export function initSafeImages(root = document) {
  root.querySelectorAll("img[data-safe-src], img.safe-img").forEach((el) => {
    const img = /** @type {HTMLImageElement} */ (el);
    if (img.dataset.safeSrc) {
      img.src = img.dataset.safeSrc;
    }
    const fb = img.dataset.fallbackSrc || PLACEHOLDER;
    bindSafeImage(img, fb);
  });
}
