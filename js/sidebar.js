/**
 * sidebar.js — mobile navigation drawer (simplified: overlay + focus return)
 *
 * Ties UI to appState.mobileNavOpen. subscribe() reapplies classes/ARIA whenever
 * state changes (same pattern as doctorsCarousel listening to department).
 */

import { getState, setState, subscribe } from "./appState.js";

/**
 * @param {HTMLElement} [root=document.body]
 */
export function initMobileNav(root = document.body) {
  const openBtn = root.querySelector("[data-mobile-nav-open]");
  const closeBtn = root.querySelector("[data-mobile-nav-close]");
  const drawer = root.querySelector("[data-mobile-drawer]");
  const backdrop = root.querySelector("[data-mobile-backdrop]");

  if (!openBtn || !drawer || !backdrop) {
    return;
  }

  const drawerEl = /** @type {HTMLElement} */ (drawer);
  const backdropEl = /** @type {HTMLElement} */ (backdrop);
  const openB = /** @type {HTMLButtonElement} */ (openBtn);

  /** @type {HTMLElement | null} */
  let lastFocus = null;

  const applyOpen = (open) => {
    drawerEl.classList.toggle("drawer--open", open);
    backdropEl.classList.toggle("drawer-backdrop--visible", open);
    drawerEl.setAttribute("aria-hidden", open ? "false" : "true");
    openB.setAttribute("aria-expanded", open ? "true" : "false");
    // body.scroll lock class is defined in CSS (overflow: hidden) while menu open.
    document.body.classList.toggle("drawer-lock", open);
  };

  subscribe((state) => {
    applyOpen(state.mobileNavOpen);
  });

  openB.addEventListener("click", () => {
    lastFocus = /** @type {HTMLElement} */ (document.activeElement);
    setState({ mobileNavOpen: true });
    const first = drawerEl.querySelector(
      "a, button",
    );
    if (first instanceof HTMLElement) {
      first.focus();
    }
  });

  const close = () => {
    setState({ mobileNavOpen: false });
    if (lastFocus) {
      lastFocus.focus();
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", close);
  }
  backdropEl.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && getState().mobileNavOpen) {
      close();
    }
  });

  drawerEl.querySelectorAll("a[data-spa-link]").forEach((link) => {
    link.addEventListener("click", () => {
      setState({ mobileNavOpen: false });
    });
  });
}
