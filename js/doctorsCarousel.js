/**
 * doctorsCarousel.js — infinite horizontal “reel” scroll + prev/next;
 * pauses on hover; pauses when tab hidden; stops loop when a department filter is active.
 */

import { subscribe, getState } from "./appState.js";

/**
 * @param {ParentNode} [root=document]
 */
export function initDoctorsCarousel(root = document) {
  const viewport = root.querySelector("[data-doctors-viewport]");
  const track = root.querySelector("[data-doctors-track]");
  const prev = root.querySelector("[data-doctors-prev]");
  const next = root.querySelector("[data-doctors-next]");
  if (!(viewport instanceof HTMLElement) || !(track instanceof HTMLElement)) {
    return;
  }

  const ribbonA = track.querySelector("[data-doctors-ribbon='a']");
  const ribbonB = track.querySelector("[data-doctors-ribbon='b']");
  if (!(ribbonA instanceof HTMLElement) || !(ribbonB instanceof HTMLElement)) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let rafId = 0;
  let hoverPause = false;
  /** @type {string | null} */
  let prevDepartment = null;
  /** px per frame (~0.45 → ~27px/s at 60fps) */
  const speed = 0.45;

  function loopSpan() {
    return ribbonA.offsetWidth + gapBetweenRibbons(track, ribbonA, ribbonB);
  }

  function isFiltered() {
    return getState().department !== "all";
  }

  function reelPaused() {
    return reduceMotion.matches || isFiltered();
  }

  function shouldRunLoop() {
    return (
      !reelPaused() &&
      !hoverPause &&
      !document.hidden &&
      loopSpan() > 0
    );
  }

  function tick() {
    rafId = 0;
    if (!shouldRunLoop()) {
      return;
    }
    const span = loopSpan();
    let sl = viewport.scrollLeft + speed;
    if (sl >= span) {
      sl -= span;
    }
    viewport.scrollLeft = sl;
    rafId = window.requestAnimationFrame(tick);
  }

  function startLoop() {
    if (rafId || !shouldRunLoop()) {
      return;
    }
    rafId = window.requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function syncFilterMode() {
    const dept = getState().department;
    const noReel = reelPaused();
    viewport.classList.toggle("doctors__viewport--filtered", isFiltered());
    viewport.classList.toggle("doctors__viewport--no-reel", noReel);
    ribbonB.toggleAttribute("hidden", noReel);
    viewport.classList.toggle("doctors__viewport--reel", !noReel);

    if (isFiltered() && prevDepartment !== dept) {
      viewport.scrollLeft = 0;
    }
    prevDepartment = dept;

    if (noReel) {
      stopLoop();
    } else {
      const span = loopSpan();
      if (span > 0 && viewport.scrollLeft >= span) {
        viewport.scrollLeft = Math.max(0, viewport.scrollLeft - span);
      }
      startLoop();
    }
  }

  subscribe(() => {
    syncFilterMode();
  });

  reduceMotion.addEventListener("change", () => {
    syncFilterMode();
  });

  viewport.addEventListener("mouseenter", () => {
    hoverPause = true;
    stopLoop();
  });

  viewport.addEventListener("mouseleave", () => {
    hoverPause = false;
    startLoop();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  const step = () => {
    const card = track.querySelector(
      ".doctors__card:not(.is-filtered-out)",
    );
    const w = card instanceof HTMLElement ? card.offsetWidth + 24 : 300;
    return Math.min(w, viewport.clientWidth * 0.85);
  };

  if (prev instanceof HTMLButtonElement) {
    prev.addEventListener("click", () => {
      stopLoop();
      viewport.scrollBy({ left: -step(), behavior: "smooth" });
      window.setTimeout(() => {
        startLoop();
      }, 600);
    });
  }

  if (next instanceof HTMLButtonElement) {
    next.addEventListener("click", () => {
      stopLoop();
      viewport.scrollBy({ left: step(), behavior: "smooth" });
      window.setTimeout(() => {
        startLoop();
      }, 600);
    });
  }

  window.addEventListener(
    "resize",
    () => {
      syncFilterMode();
    },
    { passive: true },
  );

  syncFilterMode();
  window.requestAnimationFrame(() => {
    syncFilterMode();
  });
}

/**
 * @param {HTMLElement} track
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 */
function gapBetweenRibbons(track, a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  const g = br.left - ar.right;
  return g > 0 ? g : 0;
}
