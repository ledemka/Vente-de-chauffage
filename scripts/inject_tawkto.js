const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

const DIRS = [".", "en", "de", "nl"];

// The new lightweight tag (no inline script)
// Root pages use ./assets/..., subdirs use ../assets/...
function getTawkTag(dir) {
  const prefix = dir === "." ? "." : "..";
  return `<script src="${prefix}/assets/js/tawk-loader.js"></script>`;
}

// Regex matching the old inline Tawk snippet (with any property ID)
const OLD_TAWK_RE =
  /<!--Start of Tawk\.to Script-->[\s\S]*?<!--End of Tawk\.to Script-->/g;

// Also catch any residual old-style single-property script that may lack the comments
const OLD_TAWK_EMBED_RE =
  /(<script[^>]*>[\s\S]*?embed\.tawk\.to\/[a-f0-9]+\/[a-z0-9]+[\s\S]*?<\/script>)/g;

function processDir(dir) {
  const p = path.join(ROOT, dir);
  if (!fs.existsSync(p)) return;

  const files = fs.readdirSync(p);
  for (const f of files) {
    if (!f.endsWith(".html")) continue;

    const fp = path.join(p, f);
    let html = fs.readFileSync(fp, "utf8");
    const tag = getTawkTag(dir);

    let changed = false;

    // 1. Remove old inline Tawk snippets (commented block form)
    if (OLD_TAWK_RE.test(html)) {
      html = html.replace(OLD_TAWK_RE, "");
      changed = true;
    }
    // Reset lastIndex after test
    OLD_TAWK_RE.lastIndex = 0;

    // 2. Remove any remaining embedded tawk.to inline script tags (catch-all)
    if (OLD_TAWK_EMBED_RE.test(html)) {
      html = html.replace(OLD_TAWK_EMBED_RE, "");
      changed = true;
    }
    OLD_TAWK_EMBED_RE.lastIndex = 0;

    // 3. Inject the loader tag if not already present (idempotent)
    if (!html.includes("tawk-loader.js")) {
      html = html.replace("</body>", tag + "\n</body>");
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(fp, html);
      console.log(`[tawk] Updated: ${path.relative(ROOT, fp)}`);
    } else {
      console.log(`[tawk] Already up-to-date: ${path.relative(ROOT, fp)}`);
    }
  }
}

for (const d of DIRS) {
  processDir(d);
}
console.log("\n[tawk] Injection complete.");
