/**
 * dropdown.js — simple disclosure menu; closes on outside click or Escape
 *
 * Bridges UI → appState.department. doctorsCarousel.js and filterDoctorCards()
 * keep the visible doctor list in sync (carousel mode vs filtered scroll).
 */

import { setState, getState } from "./appState.js";

/**
 * @param {HTMLElement} root
 */
export function initDepartmentDropdown(root = document) {
  const toggle = root.querySelector("[data-dropdown-toggle]");
  const menu = root.querySelector("[data-dropdown-menu]");
  if (!toggle || !menu) {
    return;
  }

  const btn = /** @type {HTMLButtonElement} */ (toggle);
  const list = /** @type {HTMLElement} */ (menu);

  const close = () => {
    btn.setAttribute("aria-expanded", "false");
    list.hidden = true;
  };

  const open = () => {
    btn.setAttribute("aria-expanded", "true");
    list.hidden = false;
  };

  const isOpen = () => btn.getAttribute("aria-expanded") === "true";

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // don’t let document click handler immediately close the menu
    if (isOpen()) {
      close();
    } else {
      open();
    }
  });

  document.addEventListener("click", (e) => {
    if (!list.contains(/** @type {Node} */ (e.target)) && e.target !== btn) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      close();
      btn.focus();
    }
  });

  list.querySelectorAll("[data-department-value]").forEach((opt) => {
    opt.addEventListener("click", () => {
      const value =
        opt.getAttribute("data-department-value") || "all";
      setState({ department: value });
      const label = opt.textContent?.trim() || value;
      const labelEl = root.querySelector("[data-dropdown-label]");
      if (labelEl) {
        labelEl.textContent = label;
      }
      close();
      filterDoctorCards(value);
    });
  });

  subscribeDepartment();
}

/**
 * Demo: toggle visibility of doctor cards by data-department (educational filter).
 * @param {string} value
 */
function filterDoctorCards(value) {
  document.querySelectorAll("[data-doctor-card]").forEach((card) => {
    const dep = card.getAttribute("data-department") || "general";
    const show = value === "all" || dep === value;
    // CSS hides .is-filtered-out; carousel JS also uses :not(.is-filtered-out) for sizing.
    card.classList.toggle("is-filtered-out", !show);
  });
}

function subscribeDepartment() {
  // On first load: apply filter from initial state (e.g. if state were hydrated later).
  const { department } = getState();
  filterDoctorCards(department);
}
