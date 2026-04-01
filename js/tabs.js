/**
 * tabs.js — accessible tab list (ARIA: role="tablist", selected tab + tabpanel)
 *
 * Optional: [data-tabs-carousel] on an ancestor auto-rotates tabs; pauses on hover.
 * Panel lines with [data-tab-line] stagger in when a tab becomes active.
 */

const ROTATE_MS = 5000;
/** Delay before each line starts (larger = more “one beat at a time”) */
const LINE_STAGGER_MS = 280;

/**
 * @param {HTMLElement} panel
 * @param {boolean} reducedMotion
 * @param {boolean} instant — first paint: show lines immediately (no stagger)
 */
function runPanelLineAnimation(panel, reducedMotion, instant) {
  if (!panel) {
    return;
  }

  if (reducedMotion || instant) {
    panel.classList.add("tab-panel--lines-visible");
    return;
  }

  panel.classList.remove("tab-panel--lines-visible");

  const lines = panel.querySelectorAll("[data-tab-line]");
  lines.forEach((el, i) => {
    el.style.setProperty("--tab-line-delay", `${i * LINE_STAGGER_MS}ms`);
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.classList.add("tab-panel--lines-visible");
    });
  });
}

/**
 * @param {Element[]} tabs
 * @param {HTMLButtonElement} active
 * @param {boolean} reducedMotion
 * @param {boolean} [instantReveal]
 */
function activateTab(tabs, active, reducedMotion, instantReveal) {
  const panelId = active.getAttribute("aria-controls");
  if (!panelId) {
    return;
  }

  /** @type {HTMLElement | null} */
  let activePanel = null;

  tabs.forEach((tab) => {
    const btn = /** @type {HTMLButtonElement} */ (tab);
    const selected = btn === active;
    btn.setAttribute("aria-selected", selected ? "true" : "false");
    btn.tabIndex = selected ? 0 : -1;
  });

  tabs.forEach((tab) => {
    const btn = /** @type {HTMLButtonElement} */ (tab);
    const pid = btn.getAttribute("aria-controls");
    const panel = pid ? document.getElementById(pid) : null;
    if (panel instanceof HTMLElement) {
      const isActive = btn === active;
      panel.hidden = !isActive;
      panel.classList.toggle("tab-panel--active", isActive);
      if (!isActive) {
        panel.classList.remove("tab-panel--lines-visible");
      } else {
        activePanel = panel;
      }
    }
  });

  if (activePanel) {
    runPanelLineAnimation(
      activePanel,
      reducedMotion,
      Boolean(instantReveal),
    );
  }
}

/**
 * Reserve vertical space for the tallest tab panel so auto-slide does not
 * shift the layout. Measures off-screen with full line visibility, then
 * restores the active tab.
 *
 * @param {HTMLElement} wrap — [data-tab-panels]
 * @param {Element[]} tabs
 * @param {boolean} reducedMotion
 */
function syncTabPanelsMinHeight(wrap, tabs, reducedMotion) {
  const panels = Array.from(wrap.querySelectorAll(":scope > .tab-panel"));
  if (panels.length === 0) {
    return;
  }

  const activeBtn = tabs.find((t) => t.getAttribute("aria-selected") === "true");
  let maxH = 0;

  panels.forEach((panel) => {
    if (!(panel instanceof HTMLElement)) {
      return;
    }
    const wasHidden = panel.hasAttribute("hidden");
    panel.removeAttribute("hidden");
    panel.classList.add("tab-panel--measuring", "tab-panel--lines-visible");
    maxH = Math.max(maxH, panel.offsetHeight);
    panel.classList.remove("tab-panel--measuring", "tab-panel--lines-visible");
    if (wasHidden) {
      panel.setAttribute("hidden", "");
    }
  });

  wrap.style.minHeight = `${Math.ceil(maxH)}px`;

  if (activeBtn instanceof HTMLButtonElement) {
    activateTab(tabs, activeBtn, reducedMotion, true);
  }
}

/**
 * @param {HTMLElement} root — element containing [role="tablist"]
 */
export function initTabs(root = document) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  root.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    const list = /** @type {HTMLElement} */ (tablist);
    if (list.dataset.tabsInit === "1") {
      return;
    }
    list.dataset.tabsInit = "1";

    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
    const tablistSlug =
      (list.getAttribute("aria-label") || "tabs")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "tabs";

    const carouselRoot = list.closest("[data-tabs-carousel]");
    /** @type {ReturnType<typeof setInterval> | null} */
    let rotateTimer = null;

    function stopCarousel() {
      if (rotateTimer !== null) {
        window.clearInterval(rotateTimer);
        rotateTimer = null;
      }
    }

    function startCarousel() {
      if (!carouselRoot || reducedMotion) {
        return;
      }
      stopCarousel();
      rotateTimer = window.setInterval(() => {
        const currentIndex = tabs.findIndex(
          (t) => t.getAttribute("aria-selected") === "true",
        );
        const next = tabs[(currentIndex + 1) % tabs.length];
        if (next instanceof HTMLButtonElement) {
          activateTab(tabs, next, reducedMotion, false);
        }
      }, ROTATE_MS);
    }

    tabs.forEach((tab, index) => {
      const t = /** @type {HTMLButtonElement} */ (tab);
      if (!t.id) {
        t.id = `${tablistSlug}-tab-${index}`;
      }

      t.addEventListener("click", () => {
        activateTab(tabs, t, reducedMotion, false);
        startCarousel();
      });
    });

    if (carouselRoot && !reducedMotion) {
      carouselRoot.addEventListener("mouseenter", stopCarousel);
      carouselRoot.addEventListener("mouseleave", () => {
        requestAnimationFrame(() => {
          if (!carouselRoot.matches(":focus-within")) {
            startCarousel();
          }
        });
      });
      carouselRoot.addEventListener("focusin", stopCarousel);
      carouselRoot.addEventListener("focusout", (e) => {
        const next = e.relatedTarget;
        if (next instanceof Node && carouselRoot.contains(next)) {
          return;
        }
        startCarousel();
      });
      startCarousel();
    }

    const initial = tabs.find((t) => t.getAttribute("aria-selected") === "true");
    const first = initial instanceof HTMLButtonElement ? initial : tabs[0];
    const mount = list.parentElement;
    if (first instanceof HTMLButtonElement) {
      activateTab(tabs, first, reducedMotion, true);
    }
    mount?.classList.add("tabs-block--ready");

    const panelsWrap = list.nextElementSibling;
    if (
      panelsWrap instanceof HTMLElement &&
      panelsWrap.matches("[data-tab-panels]")
    ) {
      const runSync = () => syncTabPanelsMinHeight(panelsWrap, tabs, reducedMotion);

      runSync();
      if (document.fonts?.ready) {
        document.fonts.ready.then(runSync);
      }

      let resizeT = 0;
      window.addEventListener(
        "resize",
        () => {
          window.clearTimeout(resizeT);
          resizeT = window.setTimeout(runSync, 160);
        },
        { passive: true },
      );
    }
  });
}
