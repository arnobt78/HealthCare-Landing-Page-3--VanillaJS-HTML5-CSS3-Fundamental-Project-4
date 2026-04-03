# Health Care Landing Page 3 - JavaScript (Vanilla), HTML5, CSS3 Fundamental Project 4 (Framework-free SPA)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)
[![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

An **educational, portfolio-ready healthcare landing page** that behaves like a small **single-page application (SPA)** using **only native browser APIs**: semantic **HTML5**, a single large **CSS3** design system, and **vanilla JavaScript** split into ES modules. There is **no React, Vue, Angular, or Next.js**—so you can study routing, state, and UI polish without framework magic. It is ideal for learners who want to see how production-like patterns (History API routing, accessible modals, carousels, and shared state) look in plain JS.

- **Live Demo:** [https://healthcare-ui-3.vercel.app/](https://healthcare-ui-3.vercel.app/)

![Image 1](https://github.com/user-attachments/assets/ad6b0215-2c48-45c9-85ce-f4af3cb42fa2)
![Image 2](https://github.com/user-attachments/assets/ed98570d-5ab2-4802-8019-d33af544c4ed)
![Image 3](https://github.com/user-attachments/assets/0b54cade-c32c-4c2a-99bc-a8989402fd35)
![Image 4](https://github.com/user-attachments/assets/52de08a9-6bb9-4eaa-bcec-982d369a0e0a)
![Image 5](https://github.com/user-attachments/assets/c5ca0b28-8458-4a94-b7ca-6357f64e78df)
![Image 6](https://github.com/user-attachments/assets/6e1f7e6e-5f3e-4724-86a8-e7ef069586b8)
![Image 7](https://github.com/user-attachments/assets/8d0b9c8d-0dae-4893-8bab-84b1331a588f)
![Image 8](https://github.com/user-attachments/assets/4be96376-90a3-40cd-b2e8-6f41127d1aad)
![Image 9](https://github.com/user-attachments/assets/f282d0e3-1a48-41c0-8082-cdac2cb0a80b)
![Image 10](https://github.com/user-attachments/assets/47f50eda-aab5-4e0d-b77b-36f1f73506e8)
![Image 11](https://github.com/user-attachments/assets/9cedfe24-97d4-4200-a3d2-176065411126)

## Table of Contents

- [Project Summary](#project-summary)
- [What This Project Is (and Is Not)](#what-this-project-is-and-is-not)
- [Features & Functionality](#features--functionality)
- [Technology Stack](#technology-stack)
- [Dependencies & Tooling](#dependencies--tooling)
- [Project Structure](#project-structure)
- [Client-Side Routes (No Server Router)](#client-side-routes-no-server-router)
- [API, Backend & Environment Variables](#api-backend--environment-variables)
- [How to Run Locally](#how-to-run-locally)
- [Build & Deploy (Vercel)](#build--deploy-vercel)
- [Linting](#linting)
- [Architecture Walkthrough](#architecture-walkthrough)
- [Reusing Parts in Other Projects](#reusing-parts-in-other-projects)
- [Keywords](#keywords)
- [Conclusion](#conclusion)
- [License](#license)

---

## Project Summary

**Health Care Landing Page 3** (`healthcare-ui-3` on npm) is a **single-page healthcare marketing site** you can run entirely in the browser: one `index.html`, shared `styles.css` / `fonts.css`, and a small set of **ES module** files under `js/` that power navigation, animations, modals, tabs, a filterable doctors carousel, and optional hero imagery fallbacks.

**Goals:**

- Show how far you can go **without a UI framework** while keeping patterns familiar to React-era developers (central state, subscribers, route-driven UI).
- Stay **deployable as static files** (Vercel or any static host) with no backend required for the demo.
- Serve as a **teaching reference** and **portfolio piece** for frontend fundamentals, accessibility, and polish.

---

## What This Project Is (and Is Not)

| Aspect            | Details                                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **It is**         | A static-first **frontend demo**: one `index.html`, rich `styles.css`, and modular JS that adds SPA-style navigation, animations, modals, tabs, and a doctors “reel.”                         |
| **It is not**     | A full-stack app. There is **no custom REST API** in this repo, **no database**, and **no server-side rendering**. Forms and buttons are **UI demos** unless you wire them to a real backend. |
| **Deploy target** | **Vercel** (or any static host). `vercel.json` rewrites unknown paths to `index.html` so client routes work on refresh.                                                                       |

---

## Features & Functionality

- **Responsive layout** — Mobile drawer navigation, fluid typography, and section layouts that adapt from narrow phones to wide desktops.
- **Sticky header & skip link** — Keyboard-friendly “Skip to main content” and an accessible primary nav.
- **Hero experience** — Rotating background layers (Ken Burns–style motion), crossfade between slides, optional Unsplash fallbacks if local hero images fail, parallax accent layer.
- **Booking / lead form (UI)** — Glass-style card in the hero; educational markup only (no live submission endpoint in-repo).
- **Services grid & modals** — Cards open a shared `<dialog>`-based modal with per-service content (`serviceModal.js`).
- **Stats, tabs, tables** — Demo content for layout and accessibility patterns.
- **Plans & information** — Accessible **tablist** with optional auto-rotation; staggered line reveals; **min-height** sync so shorter tabs do not jump the page (`tabs.js`).
- **Doctors directory** — Infinite horizontal **reel** (duplicated ribbon for seamless loop), department **dropdown** filter (`dropdown.js`, `doctorsCarousel.js`, `appState.js`), doctor profile modal (`doctorModal.js`).
- **Resources section** — Staggered animations similar to tab panels (`resourcesLines.js`).
- **Contact hero** — Full-bleed image section with overlays and CTA.
- **Footer** — Multi-column links and copyright bar.
- **SEO-oriented `<head>`** — Meta description, Open Graph, Twitter cards, JSON-LD, canonical URL (see `index.html`).
- **Ripple / CTA shine** — Optional micro-interactions (`ripple.js` + CSS).
- **Safe images** — `data-safe-src` pattern tries fallbacks when an image errors (`safeImage.js`).

---

## Technology Stack

| Layer        | Choice                                                                                                        | Why it matters for learners                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Markup**   | HTML5                                                                                                         | Semantic regions (`<header>`, `<main>`, `<section>`, `<dialog>`), ARIA on tabs and modals.          |
| **Styling**  | CSS3                                                                                                          | Custom properties, grid/flex, animations, `prefers-reduced-motion`, container queries where used.   |
| **Behavior** | JavaScript (ES modules)                                                                                       | `import`/`export`, no bundler required in dev if you use a local server (browser resolves modules). |
| **Icons**    | [Remix Icon](https://remixicon.com/) (CDN)                                                                    | Large set of medical/UI icons via classes like `ri-heart-pulse-line`.                               |
| **Fonts**    | [DM Sans](https://fonts.google.com/specimen/DM+Sans) & [Fraunces](https://fonts.google.com/specimen/Fraunces) | Loaded via `fonts.css` and local `woff2` under `public/fonts/` (see `index.html` preloads).         |
| **Hosting**  | Vercel                                                                                                        | Static output directory + SPA-style rewrites in `vercel.json`.                                      |

---

## Dependencies & Tooling

**Runtime (in the browser):** None from npm—only CDN styles for Remix Icon.

**Dev dependencies** (from `package.json`):

| Package      | Role                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| `eslint`     | Lints `js/**/*.js` and `scripts/**/*.mjs` for common mistakes and style consistency.                  |
| `@eslint/js` | ESLint’s recommended baseline rules (flat config).                                                    |
| `globals`    | Predefined `browser` and `node` global names so ESLint does not flag `window`, `document`, `fs`, etc. |

**Example — install dev tools:**

```bash
npm install
```

**Example — run linter:**

```bash
npm run lint
```

---

## Project Structure

```text
healthcare-ui-3/
├── index.html              # Single page: all sections + dialogs + SEO meta
├── styles.css              # Global design system and section styles
├── fonts.css               # @font-face for self-hosted DM Sans / Fraunces
├── package.json            # npm scripts: build, lint
├── package-lock.json
├── eslint.config.js        # ESLint flat config
├── vercel.json             # Rewrites, cache headers, security headers
├── README.md
├── js/                     # ES modules (entry: main.js)
│   ├── main.js             # Wires all features after DOM ready
│   ├── router.js           # History API: path → scroll to section id
│   ├── appState.js         # Tiny publish/subscribe state (route, department, drawer)
│   ├── sidebar.js          # Mobile drawer open/close + focus trap basics
│   ├── ripple.js           # Button ripple effect
│   ├── scrollReveal.js     # IntersectionObserver reveal + stagger
│   ├── parallax.js         # Subtle hero parallax
│   ├── tabs.js             # Accessible tabs + optional carousel + min-height measure
│   ├── resourcesLines.js   # Staggered lines in resources block
│   ├── dropdown.js         # Department filter + outside click / Escape
│   ├── doctorsCarousel.js  # Infinite reel + prev/next + filter mode
│   ├── safeImage.js        # Image onerror fallback chain
│   ├── serviceModal.js     # Shared modal for service details
│   └── doctorModal.js      # Shared modal for doctor profiles
├── scripts/
│   └── copy-static.mjs     # Copies HTML/CSS/JS/public → dist/ for deploy
└── public/                 # Static assets (fonts, hero images, favicon, robots.txt, etc.)
```

The **`dist/`** folder is **generated** by `npm run build`; do not treat it as the source of truth.

---

## Client-Side Routes (No Server Router)

Routing is implemented in `js/router.js` with the **History API** (`pushState` / `popstate`). Paths map to **element `id`s** on the same page:

| URL path     | Scroll target (`id` in `index.html`) |
| ------------ | ------------------------------------ |
| `/`          | `home` (special case: scroll to top) |
| `/services`  | `service`                            |
| `/about`     | `about`                              |
| `/doctors`   | `pages`                              |
| `/why`       | `blog`                               |
| `/resources` | `resources`                          |
| `/contact`   | `contact`                            |

**How it works (learning angle):**

1. Nav links use `data-spa-link` and `href="/path"`.
2. Click is intercepted so the browser does not do a full document load.
3. `history.pushState` updates the URL; `scrollToSection` brings the right block into view.
4. On **Vercel**, `vercel.json` sends `index.html` for unknown paths so `/services` does not 404 on refresh.

There are **no** Express/FastAPI/Next.js API routes—only this **client-side** convention.

---

## API, Backend & Environment Variables

### API endpoints

This project **does not define** any server-side API routes. All “actions” (open modal, filter doctors, change tab) run **in the browser**.

If you add a real backend later, you would typically:

- Point forms to your API with `fetch()` or a `<form action="https://api.example.com/...">`.
- Store secrets (API keys) **only on the server** or in serverless environment variables—not in client-side JS committed to Git.

### `.env` files

**You do not need a `.env` file** to run, build, or deploy this project as-is. Nothing in the codebase reads `process.env` for app behavior (the site is static).

**Optional (future) ideas:**

- If you add a build step that injects a **public** analytics ID, some teams use `VITE_*` or similar with a bundler; this repo currently has **no** Vite/Webpack env injection.
- For **Vercel**, you can add environment variables in the project dashboard for **serverless functions** you might add later—they are not required for the current static output.

---

## How to Run Locally

### 1. Clone and install (for lint / build)

```bash
git clone <your-repo-url>
cd healthcare-ui-3
npm install
```

### 2. Serve files over HTTP (required for ES modules)

Opening `index.html` as a `file://` URL often **breaks ES module imports**. Use any static server from the project root:

**Node (if you have `npx`):**

```bash
npx serve .
# or
npx http-server . -p 8080
```

**Python 3:**

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` (or the port shown).

### 3. Optional: VS Code Live Server

Right-click `index.html` → “Open with Live Server” (extension), ensuring the server root is the repo root so `/js/...` and `/public/...` resolve correctly.

---

## Build & Deploy (Vercel)

The build **copies** static assets into `dist/`:

```bash
npm run build
```

`scripts/copy-static.mjs` copies `index.html`, `styles.css`, `fonts.css`, the `js/` tree, and `public/` into `dist/`. Vercel’s `outputDirectory` is `dist` (see `vercel.json`).

**Educational note:** This is **not** a compiled bundle—just a predictable folder layout for hosting.

---

## Linting

```bash
npm run lint
```

Runs ESLint on `js/**/*.js` and `scripts/**/*.mjs`. Fix reported issues before large refactors so module boundaries stay clear.

---

## Architecture Walkthrough

### Entry point (`main.js`)

`main.js` imports feature modules and runs their `init*` functions after `DOMContentLoaded`. **Order matters** (e.g. router after DOM, observers after sections exist—see file header comment).

### State (`appState.js`)

A minimal **observer pattern**:

```js
import { getState, setState, subscribe } from "./appState.js";

subscribe((state) => {
  console.log(state.route, state.department);
});

setState({ department: "cardiology" });
```

This mirrors the _idea_ of React context without JSX—good for teaching **one source of truth**.

### Router (`router.js`)

Syncs URL ↔ scroll position ↔ nav `aria-current`. Invalid paths fall back to `/`.

### Doctors reel (`doctorsCarousel.js`)

Uses **two ribbons** of duplicated cards so the translate animation can loop; when a department filter is active or `prefers-reduced-motion` is on, the second ribbon is hidden and the reel pauses—read the file comments for why.

### Tabs (`tabs.js`)

Implements WAI-ARIA **tabs**: `role="tablist"`, `aria-selected`, `aria-controls`, and `hidden` on panels. Measures **max panel height** (FAQ `<details>` opened during measure) to reduce layout shift.

### Modals (`serviceModal.js`, `doctorModal.js`)

Use the native **`<dialog>`** element where possible for focus and `showModal()` semantics—compare with div-based modals in older tutorials.

---

## Reusing Parts in Other Projects

| Module / pattern                | Reuse idea                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `router.js` + `SECTION_BY_PATH` | Copy the map and ids for any one-page marketing site with “fake” paths.           |
| `appState.js`                   | Drop in as a 40-line global store for small demos.                                |
| `tabs.js`                       | Reuse for any tabbed pricing/FAQ; adjust selectors and carousel flag.             |
| `doctorsCarousel.js`            | Adapt track markup for logos, testimonials, or cards—keep `ResizeObserver` ideas. |
| `ripple.js` / CTA shine CSS     | Paste classes onto buttons in another design system.                              |
| `styles.css` tokens (`:root`)   | Copy `--primary`, `--max-9xl`, etc., to bootstrap a second brand theme.           |

Always keep **accessibility**: preserve roles, labels, and keyboard behavior when you copy markup.

---

## Keywords

Healthcare website, landing page, vanilla JavaScript, ES modules, HTML5, CSS3, single-page application, History API, accessibility, responsive design, Intersection Observer, dialog element, portfolio project, frontend education, Remix Icon, Fraunces, DM Sans, Vercel, static site, open source, MIT License, patient experience UI, medical UI demo

---

## Conclusion

**Health Care Landing Page 3** is a **framework-free** way to study modern front-end mechanics: routing without React Router, state without Redux, and motion without a component library. Use it as a **course companion**, a **portfolio piece**, or a **starting sketch** for a real clinic site—then swap copy, connect real APIs, and tighten accessibility with your own content audit.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the code as per the terms of the license.

## Happy Coding! 🎉

This is an **open-source project** - feel free to use, enhance, and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com](https://www.arnobmahmud.com).

**Enjoy building and learning!** 🚀

Thank you! 😊

---
