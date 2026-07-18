const fs = require("fs");
const path = require("path");

const root = __dirname;
const requiredFiles = [
  "index.html",
  "privacy-policy.html",
  "delete-account.html",
  "terms.html",
  "en/index.html",
  "en/privacy-policy.html",
  "en/delete-account.html",
  "en/terms.html",
  "de/index.html",
  "de/privacy-policy.html",
  "de/delete-account.html",
  "de/terms.html",
  "es/index.html",
  "es/privacy-policy.html",
  "es/delete-account.html",
  "es/terms.html",
  "assets/ikonacd.png",
  "assets/app_icon.webp",
  "assets/google-play-icon.png",
  "assets/site.css",
  "assets/site.js",
  "robots.txt",
  "sitemap.xml"
];

const ignoredPrefixes = ["http:", "https:", "mailto:", "tel:", "data:", "javascript:", "#"];
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return fullPath;
  });
}

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

const htmlFiles = walk(root).filter(file => file.endsWith(".html"));
const attributePattern = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;

for (const htmlFile of htmlFiles) {
  const source = fs.readFileSync(htmlFile, "utf8");
  const relativeHtml = path.relative(root, htmlFile).replaceAll("\\", "/");

  if (!/<title>[^<]+<\/title>/i.test(source)) {
    errors.push(`${relativeHtml}: missing title`);
  }
  if (!/<meta\s+name=["']description["']/i.test(source)) {
    errors.push(`${relativeHtml}: missing meta description`);
  }

  for (const match of source.matchAll(attributePattern)) {
    const reference = match[1].trim();
    if (!reference || ignoredPrefixes.some(prefix => reference.startsWith(prefix))) continue;

    const cleanReference = reference.split(/[?#]/, 1)[0];
    if (!cleanReference) continue;

    const target = cleanReference.startsWith("/")
      ? path.join(root, cleanReference.slice(1))
      : path.resolve(path.dirname(htmlFile), cleanReference);

    if (!fs.existsSync(target)) {
      errors.push(`${relativeHtml}: broken local reference ${reference}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Site check passed: ${htmlFiles.length} HTML pages and ${requiredFiles.length} required files.`);
