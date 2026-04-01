/**
 * appState.js — a tiny “context” pattern (similar idea to React Context)
 *
 * One shared object holds UI state. Components call subscribe() to react to
 * changes, and setState() to update — classic publish/subscribe, no framework.
 *
 * @typedef {Object} AppState
 * @property {string} route — current pathname we treat as the active “page”
 * @property {string} department — demo filter for the department dropdown
 * @property {boolean} mobileNavOpen — mobile drawer open/closed
 */

/** @type {AppState} */
let state = {
  route: "/",
  department: "all",
  mobileNavOpen: false,
};

/** @type {Set<(s: AppState) => void>} */
const listeners = new Set();

/** @returns {AppState} shallow copy (avoid mutating state from outside) */
export function getState() {
  return { ...state };
}

/**
 * Merge partial updates and notify subscribers.
 * @param {Partial<AppState>} partial
 */
export function setState(partial) {
  state = { ...state, ...partial };
  listeners.forEach((fn) => {
    fn(state);
  });
}

/**
 * Register a listener; returns unsubscribe function (like useEffect cleanup).
 * @param {(s: AppState) => void} fn
 * @returns {() => void}
 */
export function subscribe(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
