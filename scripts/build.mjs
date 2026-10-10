// Builds the live version of the site into _site/.
// Your working files are never changed: this copies them, then strips
// comments and minifies the HTML, CSS and JS in the copy only.
// Runs automatically on GitHub (see .github/workflows/deploy.yml).
// To try it on your computer: npm install, then npm run build.

import { promises as fs } from "node:fs";
import path from "node:path";
import { transform } from "esbuild";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "_site");

// Files and folders that should never go on the live site
const SKIP = new Set([
  ".git", ".github", ".gitignore", ".gitattributes", ".vscode",
  "node_modules", "scripts", "_site",
  "package.json", "package-lock.json", "README.md",
]);

// minifyIdentifiers stays off so names shared between files and inline
// scripts (like functions in projects.js) keep working.
const JS = { loader: "js", minifyWhitespace: true, minifySyntax: true, legalComments: "none", charset: "utf8" };
const CSS = { loader: "css", minify: true, legalComments: "none", charset: "utf8" };

const minJs = async (code, module = false) =>
  (await transform(code, { ...JS, format: module ? "esm" : undefined })).code.trim();
const minCss = async (code) => (await transform(code, CSS)).code.trim();

// HTML: remove <!-- comments -->, minify inline <style> and <script>,
// drop indentation and blank lines. <pre> and <textarea> are left exactly as written.
const BLOCK = /<!--[\s\S]*?-->|<(script|style|pre|textarea)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi;

async function minHtml(html) {
  let out = "";
  let last = 0;
  for (const m of html.matchAll(BLOCK)) {
    out += tidy(html.slice(last, m.index));
    last = m.index + m[0].length;
    const [whole, tag, attrs = "", body = ""] = m;
    if (!tag) continue; // an HTML comment: drop it
    const name = tag.toLowerCase();
    if (name === "style") {
      out += `<${tag}${attrs}>${await minCss(body)}</${tag}>`;
    } else if (name === "script" && body.trim() && isJs(attrs)) {
      out += `<${tag}${attrs}>${await minJs(body, /type\s*=\s*["']?module/i.test(attrs))}</${tag}>`;
    } else {
      out += whole; // pre, textarea, external or non-JS scripts
    }
  }
  return (out + tidy(html.slice(last))).trim() + "\n";
}

function isJs(attrs) {
  const t = attrs.match(/type\s*=\s*["']?([^"'\s>]+)/i);
  return !t || /^(module|text\/javascript|application\/javascript)$/i.test(t[1]);
}

function tidy(s) {
  return s.replace(/\n[ \t]+/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{2,}/g, "\n");
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    if (src === ROOT && SKIP.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await fs.copyFile(from, to);
  }
}

async function walk(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(p)));
    else files.push(p);
  }
  return files;
}

await fs.rm(OUT, { recursive: true, force: true });
await copyDir(ROOT, OUT);

let before = 0, after = 0, count = 0;
for (const file of await walk(OUT)) {
  const ext = path.extname(file).toLowerCase();
  if (![".html", ".css", ".js"].includes(ext)) continue;
  const src = await fs.readFile(file, "utf8");
  let out;
  try {
    out = ext === ".html" ? await minHtml(src) : ext === ".css" ? await minCss(src) : await minJs(src);
  } catch (err) {
    console.error(`Could not minify ${path.relative(OUT, file)}:\n${err.message}`);
    process.exit(1);
  }
  await fs.writeFile(file, out);
  before += src.length; after += out.length; count++;
}

console.log(`Minified ${count} files: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
