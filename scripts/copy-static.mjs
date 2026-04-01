/**
 * Copies static assets into dist/ for Vercel (see docs/VERCEL-PLAIN-JS-DEPLOY.md).
 * Run: npm run build
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });

const rootFiles = ["index.html", "styles.css"];
for (const f of rootFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, f));
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyDir(path.join(root, "js"), path.join(dist, "js"));
copyDir(path.join(root, "public"), path.join(dist, "public"));

const faviconSrc = path.join(root, "public", "favicon.ico");
if (fs.existsSync(faviconSrc)) {
  fs.copyFileSync(faviconSrc, path.join(dist, "favicon.ico"));
}

const robotsSrc = path.join(root, "public", "robots.txt");
if (fs.existsSync(robotsSrc)) {
  fs.copyFileSync(robotsSrc, path.join(dist, "robots.txt"));
}
