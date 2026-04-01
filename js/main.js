/**
 * main.js — application entry (ES module)
 *
 * Order matters: router after DOM ready; observers after markup exists.
 */

import { initRouter } from "./router.js";
import { initRipple } from "./ripple.js";
import { initSafeImages } from "./safeImage.js";
import { initScrollReveal } from "./scrollReveal.js";
import { initParallax } from "./parallax.js";
import { initTabs } from "./tabs.js";
import { initDepartmentDropdown } from "./dropdown.js";
import { initMobileNav } from "./sidebar.js";
import { initDoctorsCarousel } from "./doctorsCarousel.js";

function boot() {
  const bookForm = document.querySelector(".book-form");
  if (bookForm) {
    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  initRouter();
  initRipple(".btn-ripple");
  initSafeImages(document);
  initScrollReveal(document);
  initParallax(document.querySelector("[data-parallax-layer]"));
  initTabs(document);
  initDepartmentDropdown(document);
  initMobileNav(document.body);
  initDoctorsCarousel(document);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
