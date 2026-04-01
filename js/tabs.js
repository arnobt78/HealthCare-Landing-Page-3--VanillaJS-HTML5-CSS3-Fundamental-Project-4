/**
 * tabs.js — accessible tab list (ARIA: role="tablist", selected tab + tabpanel)
 *
 * Arrow keys are optional for beginners; we support click + basic Home/End if needed later.
 */

/**
 * @param {HTMLElement} root — element containing [role="tablist"]
 */
export function initTabs(root = document) {
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

    tabs.forEach((tab, index) => {
      const t = /** @type {HTMLButtonElement} */ (tab);
      if (!t.id) {
        t.id = `${tablistSlug}-tab-${index}`;
      }

      t.addEventListener("click", () => {
        activateTab(tabs, t);
      });
    });
  });
}

/**
 * @param {Element[]} tabs
 * @param {HTMLButtonElement} active
 */
function activateTab(tabs, active) {
  const panelId = active.getAttribute("aria-controls");
  if (!panelId) {
    return;
  }

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
    if (panel) {
      const isActive = btn === active;
      panel.hidden = !isActive;
      panel.classList.toggle("tab-panel--active", isActive);
    }
  });
}
