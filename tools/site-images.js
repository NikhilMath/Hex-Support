// Builds the website's icons and link preview (user's request, 2026-10-20):
//   favicon.ico            16, 32 and 48 px, for browsers that can't use favicon.svg
//   apple-touch-icon.png   180 px, the orb on the night sky, for phone home screens
//   social-preview.png     1200x630, the picture LinkedIn, iMessage, Slack and
//                          the rest show when someone posts a link to the site
//
// The icons are drawn from favicon.svg. The preview reuses the art from
// book/front-cover.svg (minus its title and author) on the same night sky,
// so rerun this after changing either (needs node, and Google Chrome or
// Microsoft Edge):
//   node tools/site-images.js

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const root = path.join(__dirname, "..");
const icon = fs.readFileSync(path.join(root, "favicon.svg"), "utf8");
const front = fs.readFileSync(path.join(root, "book/front-cover.svg"), "utf8")
  .replace(/<!-- Title -->[\s\S]*?(?=<!-- Glow behind the orb -->)/, "")
  .replace(/<!-- Author -->[\s\S]*?(?=<\/svg>)/, "")
  .replace(/<!--[\s\S]*?-->/g, "");

const SKY = "linear-gradient(180deg, #2b1c5c 0%, #1c1342 60%, #120c2a 100%)";
const ICO_SIZES = [16, 32, 48];
const TOUCH = 180;

// The preview: 1200x630, words on the left, the orb on the right. The cover
// art is 1200x1800; ART_SCALE and the orb's spot place it so the orb, the
// error box, the ghosts and the mug all land inside the picture.
const OG_W = 1200, OG_H = 630, DESK = 578;
const ART_SCALE = 0.62, ORB_X = 872, ORB_Y = 362;
const artLeft = ORB_X - 600 * ART_SCALE, artTop = ORB_Y - 1140 * ART_SCALE;

// Stars, seeded so they stay put between builds.
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const stars = Array.from({ length: 120 }, () => ({ x: rand() * OG_W, y: rand() * (DESK - 12), r: 0.7 + rand() * rand() * 2, o: 0.25 + rand() * 0.6 }))
  .map((s) => `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${s.r.toFixed(2)}" fill="#fff" fill-opacity="${s.o.toFixed(2)}"/>`).join("");

const preview = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
html, body { margin: 0; width: ${OG_W}px; height: ${OG_H}px; overflow: hidden; }
body {
  position: relative;
  background:
    linear-gradient(180deg, #5a4a9c, #3a2c70) 0 ${DESK}px / 100% 4px no-repeat,
    linear-gradient(180deg, #2c2057 0%, #160f30 100%) 0 ${DESK}px / 100% ${OG_H - DESK}px no-repeat,
    ${SKY};
  color: #f6f1e4;
  font-family: Georgia, serif;
}
.stars { position: absolute; left: 0; top: 0; }
.art { position: absolute; left: ${artLeft}px; top: ${artTop}px; width: ${1200 * ART_SCALE}px; height: ${1800 * ART_SCALE}px; }
.art svg { display: block; width: 100%; height: 100%; }
.words { position: absolute; left: 72px; top: 92px; width: 500px; }
.kicker { margin: 0 0 18px; font: bold 19px Arial, Helvetica, sans-serif; letter-spacing: 0.3em; color: #b9b0dc; }
h1 { margin: 0; font-size: 150px; line-height: 0.9; letter-spacing: -4px; font-weight: bold; }
h1 em { display: block; font-size: 104px; letter-spacing: -2px; color: #bcaaff; }
.tagline { margin: 26px 0 0; font-size: 31px; line-height: 1.25; font-style: italic; color: #ddd6f0; }
.byline { position: absolute; left: 72px; top: ${DESK + 16}px; margin: 0; font: bold 15px Arial, Helvetica, sans-serif; letter-spacing: 0.24em; color: #8f86b5; }
</style>
</head>
<body>
<svg class="stars" width="${OG_W}" height="${DESK}" viewBox="0 0 ${OG_W} ${DESK}" xmlns="http://www.w3.org/2000/svg">${stars}</svg>
<div class="art">${front}</div>
<div class="words">
<p class="kicker">A PICK-YOUR-PATH COMEDY</p>
<h1>Hex <em>Support</em></h1>
<p class="tagline">Tech support for a<br>900-year-old wizard.</p>
</div>
<p class="byline">PLAY FREE IN YOUR BROWSER · MADE BY NIKHILMATH.COM</p>
</body>
</html>
`;

// The icons are drawn onto canvases in the page, which then prints each one
// as a PNG data URL for --dump-dom to hand back.
const icons = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body>
<pre id="out"></pre>
<script>
const img = new Image();
img.onload = () => {
  const out = {};
  for (const size of ${JSON.stringify(ICO_SIZES)}) {
    const c = Object.assign(document.createElement("canvas"), { width: size, height: size });
    c.getContext("2d").drawImage(img, 0, 0, size, size);
    out[size] = c.toDataURL("image/png");
  }
  // Phones crop home-screen icons to their own rounded shape and fill any
  // clear corners with black, so this one gets the sky behind it.
  const c = Object.assign(document.createElement("canvas"), { width: ${TOUCH}, height: ${TOUCH} });
  const g = c.getContext("2d");
  const sky = g.createLinearGradient(0, 0, 0, ${TOUCH});
  sky.addColorStop(0, "#2b1c5c");
  sky.addColorStop(0.6, "#1c1342");
  sky.addColorStop(1, "#120c2a");
  g.fillStyle = sky;
  g.fillRect(0, 0, ${TOUCH}, ${TOUCH});
  const inset = ${TOUCH} * 0.16;
  g.drawImage(img, inset, inset, ${TOUCH} - 2 * inset, ${TOUCH} - 2 * inset);
  out.touch = c.toDataURL("image/png");
  document.getElementById("out").textContent = JSON.stringify(out);
};
img.src = "data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}";
</script>
</body>
</html>
`;

// An .ico file is a small header, one entry per size, then each size's PNG.
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const at = 6 + 16 * i;
    header.writeUInt8(size % 256, at);
    header.writeUInt8(size % 256, at + 1);
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(data.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

const browser = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"].find(fs.existsSync);
if (!browser) throw new Error("Needs Google Chrome or Microsoft Edge to draw the site images");
const work = fs.mkdtempSync(path.join(os.tmpdir(), "hex-site-"));
fs.writeFileSync(path.join(work, "preview.html"), preview);
fs.writeFileSync(path.join(work, "icons.html"), icons);
const run = (args, done) => {
  let stdout = "";
  const child = spawn(browser, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--hide-scrollbars",
    "--user-data-dir=" + path.join(work, "profile"), ...args], { stdio: ["ignore", "pipe", "ignore"] });
  child.stdout.on("data", (d) => (stdout += d));
  child.on("exit", () => done(stdout));
};
const fromDataUrl = (url) => Buffer.from(url.split(",")[1], "base64");

const og = path.join(root, "social-preview.png");
fs.rmSync(og, { force: true });
run([`--window-size=${OG_W},${OG_H}`, "--force-device-scale-factor=1", "--screenshot=" + og, "file://" + path.join(work, "preview.html")], () => {
  console.log(fs.existsSync(og) ? `Wrote social-preview.png: ${OG_W} x ${OG_H}.` : "The browser did not write " + og);
  run(["--virtual-time-budget=5000", "--dump-dom", "file://" + path.join(work, "icons.html")], (dom) => {
    fs.rmSync(work, { recursive: true, force: true });
    const json = (dom.match(/<pre id="out">([\s\S]*?)<\/pre>/) || [])[1];
    if (!json) { console.error("The browser did not draw the icons"); process.exit(1); }
    const out = JSON.parse(json.replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
    fs.writeFileSync(path.join(root, "favicon.ico"), ico(ICO_SIZES.map((size) => ({ size, data: fromDataUrl(out[size]) }))));
    fs.writeFileSync(path.join(root, "apple-touch-icon.png"), fromDataUrl(out.touch));
    console.log(`Wrote favicon.ico: ${ICO_SIZES.join(", ")} px. Wrote apple-touch-icon.png: ${TOUCH} x ${TOUCH}.`);
  });
});
