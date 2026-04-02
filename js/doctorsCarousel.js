/**
 * doctorsCarousel.js — infinite horizontal “reel” via translate3d (works when
 * scrollWidth snapping would fail); pauses on hover; respects reduced motion
 * and department filter; ResizeObserver restarts after layout/images.
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
  /** Horizontal offset for transform-based reel */
  let pos = 0;

  function loopSpan() {
    return ribbonA.offsetWidth + gapBetweenRibbons(track, ribbonA, ribbonB);
  }

  function isFiltered() {
    return getState().department !== "all";
  }

  function reelPaused() {
    return reduceMotion.matches || isFiltered();
  }

  function applyTrackTransform() {
    if (reelPaused()) {
      track.style.transform = "";
      return;
    }
    track.style.transform = `translate3d(${-pos}px, 0, 0)`;
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
    if (span <= 0) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }
    pos += speed;
    if (pos >= span) {
      pos -= span;
    }
    applyTrackTransform();
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

  function normalizePos() {
    const span = loopSpan();
    if (span > 0 && pos >= span) {
      pos = pos % span;
    }
    applyTrackTransform();
  }

  function syncFilterMode() {
    const dept = getState().department;
    const noReel = reelPaused();

    if (prevDepartment !== dept) {
      viewport.scrollLeft = 0;
      pos = 0;
    }
    prevDepartment = dept;

    viewport.classList.toggle("doctors__viewport--filtered", isFiltered());
    viewport.classList.toggle("doctors__viewport--no-reel", noReel);
    ribbonB.toggleAttribute("hidden", noReel);
    viewport.classList.toggle("doctors__viewport--reel", !noReel);

    if (noReel) {
      stopLoop();
      pos = 0;
      track.style.transform = "";
    } else {
      normalizePos();
      startLoop();
    }
  }

  subscribe(() => {
    syncFilterMode();
  });

  reduceMotion.addEventListener("change", () => {
    syncFilterMode();
  });

  const ro = new ResizeObserver(() => {
    normalizePos();
    if (!reelPaused()) {
      stopLoop();
      startLoop();
    }
  });
  ro.observe(viewport);
  ro.observe(track);
  ro.observe(ribbonA);

  viewport.addEventListener("mouseenter", () => {
    hoverPause = true;
    stopLoop();
    applyTrackTransform();
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
    const card = track.querySelector(".doctors__card:not(.is-filtered-out)");
    const w = card instanceof HTMLElement ? card.offsetWidth + 24 : 300;
    return Math.min(w, viewport.clientWidth * 0.85);
  };

  if (prev instanceof HTMLButtonElement) {
    prev.addEventListener("click", () => {
      stopLoop();
      const st = step();
      if (reelPaused()) {
        viewport.scrollBy({ left: -st, behavior: "smooth" });
      } else {
        const span = loopSpan();
        if (span > 0) {
          pos = (pos - st + span * 1000) % span;
        } else {
          pos = 0;
        }
        applyTrackTransform();
      }
      window.setTimeout(() => {
        startLoop();
      }, 600);
    });
  }

  if (next instanceof HTMLButtonElement) {
    next.addEventListener("click", () => {
      stopLoop();
      const st = step();
      if (reelPaused()) {
        viewport.scrollBy({ left: st, behavior: "smooth" });
      } else {
        const span = loopSpan();
        if (span > 0) {
          pos = (pos + st) % span;
        }
        applyTrackTransform();
      }
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

  window.addEventListener("load", () => {
    syncFilterMode();
  });

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
  if (b.hasAttribute("hidden")) {
    return 0;
  }
  const styles = window.getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
  if (Number.isFinite(gap) && gap > 0) {
    return gap;
  }
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  const g = br.left - ar.right;
  return g > 0 ? g : 0;
}
