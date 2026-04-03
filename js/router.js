/**
 * router.js — client-side routes with the History API
 *
 * Educational “SPA without a framework”: the document is always index.html;
 * we only change the URL and scroll position. There is no fetch() per route.
 *
 * Vercel serves index.html for unknown paths (see vercel.json rewrites), so
 * refreshing /services does not 404: the server returns index.html, then this
 * file reads location.pathname and scrolls to the right section.
 */

import { setState } from "./appState.js";

/** Map URL path → section element id in index.html (single-page sections as “pages”). */
const SECTION_BY_PATH = {
  "/": "home",
  "/services": "service",
  "/about": "about",
  "/doctors": "pages",
  "/why": "blog",
  "/contact": "contact",
  "/resources": "resources",
};

/**
 * @param {string} path
 * @returns {string}
 */
export function normalizePath(path) {
  if (!path || path === "/") {
    return "/";
  }
  let p = path.startsWith("/") ? path : `/${path}`;
  p = p.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

/**
 * @param {string} path
 * @returns {string}
 */
function resolvePath(path) {
  const n = normalizePath(path);
  // Unknown paths fall back to home so we never scroll to a missing id.
  return SECTION_BY_PATH[n] ? n : "/";
}

/**
 * Scroll main content to a section; smooth for users, instant on first paint.
 *
 * Home must use window.scrollTo(0): #home sits below the sticky navbar, so
 * scrollIntoView(block:"start") would scroll the document down by the header
 * height and the thumb “jumps” on refresh.
 * @param {string} sectionKey — key from SECTION_BY_PATH values
 * @param {boolean} smooth
 */
function scrollToSection(sectionKey, smooth) {
  const behavior = smooth ? "smooth" : "instant";
  if (sectionKey === "home") {
    window.scrollTo({ top: 0, left: 0, behavior });
    return;
  }
  const el = document.getElementById(sectionKey);
  if (el) {
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  }
}

/**
 * Update nav links’ aria-current and visual .is-active class.
 * @param {string} path
 */
function syncNavActive(path) {
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPath = normalizePath(href.split("?")[0] || "/");
    const current = normalizePath(path);
    const isActive =
      linkPath === current || (current === "/" && linkPath === "/");
    link.setAttribute("aria-current", isActive ? "page" : "false");
    link.classList.toggle("is-active", isActive);
  });
}

/**
 * @param {string} path
 * @param {boolean} push — call history.pushState (false for popstate / first load)
 */
export function navigateToPath(path, push) {
  const resolved = resolvePath(path);
  const section = SECTION_BY_PATH[resolved];
  if (push) {
    history.pushState({ path: resolved }, "", resolved);
  }
  // Subscribers (e.g. carousel) can read route from getState() if needed.
  setState({ route: resolved });
  // push===true → user click: smooth scroll; initial/popstate → instant to avoid jank.
  scrollToSection(section, push);
  syncNavActive(resolved);
}

/**
 * Intercept internal links with data-spa-link so navigation stays in-page.
 */
export function initRouter() {
  // We control scroll ourselves after route changes; disable browser auto-restore.
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const initial = resolvePath(normalizePath(window.location.pathname));
  // If user landed on /unknown, replace URL bar with / without extra navigation.
  if (initial !== normalizePath(window.location.pathname)) {
    history.replaceState({ path: initial }, "", initial);
  }
  setState({ route: initial });
  scrollToSection(SECTION_BY_PATH[initial], false);
  syncNavActive(initial);

  window.addEventListener("popstate", () => {
    const path = resolvePath(normalizePath(window.location.pathname));
    setState({ route: path });
    scrollToSection(SECTION_BY_PATH[path], false);
    syncNavActive(path);
  });

  // Event delegation: any internal nav link with data-spa-link stays in-page.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-spa-link]");
    if (!a) {
      return;
    }
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:")) {
      return;
    }
    if (href.startsWith("#")) {
      return;
    }
    e.preventDefault();
    navigateToPath(href, true);
  });
}
