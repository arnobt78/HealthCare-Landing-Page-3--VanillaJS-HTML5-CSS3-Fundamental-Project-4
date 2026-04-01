/**
 * ripple.js — material-style ripple on click (see docs/RIPPLE_BUTTON_EFFECT.md)
 *
 * Ripple is visual only: pointer-events:none, removed after animation.
 */

/**
 * @param {MouseEvent} event
 * @param {HTMLElement} button
 */
function addRipple(event, button) {
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple-effect";
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

/**
 * Attach to all elements matching selector (buttons with overflow hidden in CSS).
 * @param {string} [selector='.btn-ripple']
 */
export function initRipple(selector = ".btn-ripple") {
  document.querySelectorAll(selector).forEach((btn) => {
    const el = /** @type {HTMLElement} */ (btn);
    if (el.dataset.rippleInit === "1") {
      return;
    }
    el.dataset.rippleInit = "1";
    el.addEventListener("click", (e) => {
      addRipple(e, el);
    });
  });
}
