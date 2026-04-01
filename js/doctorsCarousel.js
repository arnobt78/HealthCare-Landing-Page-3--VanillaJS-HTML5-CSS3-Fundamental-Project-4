/**
 * doctorsCarousel.js — scroll the doctors row horizontally with arrow buttons
 */

/**
 * @param {ParentNode} [root=document]
 */
export function initDoctorsCarousel(root = document) {
  const track = root.querySelector("[data-doctors-track]");
  const prev = root.querySelector("[data-doctors-prev]");
  const next = root.querySelector("[data-doctors-next]");
  if (!track || !prev || !next) {
    return;
  }

  const el = /** @type {HTMLElement} */ (track);
  const step = () => Math.min(el.clientWidth * 0.85, 320);

  prev.addEventListener("click", () => {
    el.scrollBy({ left: -step(), behavior: "smooth" });
  });
  next.addEventListener("click", () => {
    el.scrollBy({ left: step(), behavior: "smooth" });
  });
}
