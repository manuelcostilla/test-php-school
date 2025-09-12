import fs from "fs/promises";
import path from "path";

const DOMAIN = "https://clic.baradero.gob.ar";
const OUTPUT_DIR = path.resolve(process.cwd(), "public", "wp-elementor");
await fs.mkdir(OUTPUT_DIR, { recursive: true });

const downloadElementorAssetsForSlug = async (slug) => {
  const url = `${DOMAIN}/${slug}`;
  console.log("Fetching page:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error fetching ${url}: ${res.status}`);
  const html = await res.text();

  const hrefs = Array.from(
    html.matchAll(
      /<link[^>]+href=["']([^"']+(elementor|uploads\/elementor)[^"']+)["'][^>]*>/gi
    )
  )
    .map((m) => m[1])
    .filter(Boolean);

  const inlineMatches = Array.from(
    html.matchAll(/<style[^>]*data-elementor-css[^>]*>([\s\S]*?)<\/style>/gi)
  )
    .map((m) => m[1])
    .filter(Boolean);

  for (const href of hrefs) {
    try {
      const full = href.startsWith("http") ? href : new URL(href, DOMAIN).href;
      console.log("  Downloading:", full);
      const r = await fetch(full);
      if (!r.ok) {
        console.warn("   failed to download", full, r.status);
        continue;
      }
      const css = await r.text();
      const fname = path.basename(full).replace(/\?.*$/, "");
      const outPath = path.join(OUTPUT_DIR, fname);
      await fs.writeFile(outPath, css, "utf8");
      console.log("   saved to", outPath);
    } catch (e) {
      console.warn("   error downloading", href, e.message);
    }
  }

  if (inlineMatches.length) {
    const inlineCss = inlineMatches.join("\n\n");
    const outPath = path.join(
      OUTPUT_DIR,
      `${slug.replace(/\//g, "_")}-inline.css`
    );
    await fs.writeFile(outPath, inlineCss, "utf8");
    console.log("  Inline css saved to", outPath);
  }

  return { hrefs, inlineCount: inlineMatches.length };
};

const SLUGS = ["", "inicio"];

for (const slug of SLUGS) {
  try {
    await downloadElementorAssetsForSlug(slug);
  } catch (e) {
    console.error("Error with", slug, e.message);
  }
}

console.log("Done.");
