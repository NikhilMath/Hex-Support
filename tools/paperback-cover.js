// Builds the paperback cover for KDP (user's request, 2026-10-20):
// book/hex-support-cover.pdf, one sheet holding the back cover, the spine and
// the front cover, with 0.125 in of bleed on every side. Also writes
// book/front-cover.png, the front on its own (1600x2400), for previews and
// the Amazon listing.
//
// Run it after tools/book.js, since the spine's width comes from the
// interior's page count (needs node, and Google Chrome or Microsoft Edge):
//   node tools/book.js
//   node tools/paperback-cover.js
//
// The front is book/front-cover.svg. The back-cover words live in
// book/back-cover.txt, one paragraph per blank line: the first is set large
// as the lead, the last as the closing line. The night sky and its stars run
// across the whole sheet, behind all three.
//
// Spine text (KDP allows it above 79 pages): the title and author in
// capitals, running top to bottom, sized so the capitals clear the spine's
// edges by KDP's 0.0625 in. Same method as Keyboard Heist's cover.
//
// KDP prints the ISBN barcode itself, 2 x 1.2 in in the lower right of the
// back cover, so that corner stays empty.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const root = path.join(__dirname, "..");
const out = path.join(root, "book/hex-support-cover.pdf");
const png = path.join(root, "book/front-cover.png");

// Spine inches per page: KDP's black ink on white paper. Cream paper is 0.0025.
const PER_PAGE = 0.002252;
const TRIM_W = 6, TRIM_H = 9, BLEED = 0.125;
const TITLE = "Hex Support", AUTHOR = "Nikhil Math";

const interior = fs.readFileSync(path.join(root, "book/hex-support-paperback.pdf"), "latin1");
const pages = (interior.match(/\/Type\s*\/Page\b/g) || []).length;
const spine = pages * PER_PAGE;
const W = BLEED + TRIM_W + spine + TRIM_W + BLEED, H = BLEED + TRIM_H + BLEED;
const FRONT_X = BLEED + TRIM_W + spine;

const front = fs.readFileSync(path.join(root, "book/front-cover.svg"), "utf8").replace(/<!--[\s\S]*?-->/g, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const words = fs.readFileSync(path.join(root, "book/back-cover.txt"), "utf8").trim().split(/\n\s*\n/).map((p) => esc(p.replace(/\s+/g, " ")));
const lead = words.shift(), closing = words.pop();

// The night sky, and the desk the orb and the mug sit on, which runs the
// width of the sheet. DESK is how far below the top of the trim the desk's
// top edge is, matching y=1490 in book/front-cover.svg.
const DESK = 1490 / 200;
const backdrop = (deskTop, height) => [
  `linear-gradient(180deg, #5a4a9c, #3a2c70) 0 ${deskTop}px / 100% 5px no-repeat`,
  `linear-gradient(180deg, #2c2057 0%, #160f30 100%) 0 ${deskTop}px / 100% ${height - deskTop}px no-repeat`,
  "linear-gradient(180deg, #2b1c5c 0%, #1c1342 60%, #120c2a 100%)",
].join(", ");

// Stars, in inches across the whole sheet. Seeded, so they stay put between builds.
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const stars = Array.from({ length: 260 }, () => ({ x: rand() * W, y: rand() * (BLEED + DESK - 0.1), r: 0.006 + rand() * rand() * 0.018, o: 0.25 + rand() * 0.6 }));
const starSvg = (x0, y0, w, h, scale, dim) => `<svg class="stars" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">` +
  stars.filter((s) => s.x >= x0 && s.x <= x0 + w && s.y >= y0 && s.y <= y0 + h)
    .map((s) => `<circle cx="${(s.x - x0).toFixed(3)}" cy="${(s.y - y0).toFixed(3)}" r="${(s.r * scale).toFixed(4)}" fill="#fff" fill-opacity="${(s.o * (dim && s.x < BLEED + TRIM_W ? 0.55 : 1)).toFixed(2)}"/>`).join("") +
  "</svg>";

// The spine, drawn in points. rotate(90) runs the text down the spine with
// the tops of the letters toward the front cover, the way a US paperback
// reads lying face up.
const SPINE_CLEAR = 0.0625 * 72, CAP = { Georgia: 0.693, Arial: 0.716 };
const sw = spine * 72, sl = TRIM_H * 72, room = sw - 2 * SPINE_CLEAR;
const fit = (font, want) => Math.min(want, room / CAP[font] / 1.2);
const titlePt = fit("Georgia", 8), authorPt = fit("Arial", 6.5);
const baseline = (font, pt) => ((sw - pt * CAP[font]) / 2 + 0.022 * pt).toFixed(3);
const spineText = room <= 0 ? "" : `<svg class="spine" viewBox="0 0 ${sw} ${sl}" xmlns="http://www.w3.org/2000/svg">
<text transform="translate(${baseline("Georgia", titlePt)} ${0.6 * 72}) rotate(90)" font-family="Georgia, serif" font-weight="bold" font-size="${titlePt.toFixed(2)}" letter-spacing="0.9" fill="#f6f1e4">HEX <tspan font-style="italic" fill="#bcaaff">SUPPORT</tspan></text>
<text transform="translate(${baseline("Arial", authorPt)} ${sl - 0.6 * 72}) rotate(90)" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${authorPt.toFixed(2)}" letter-spacing="1.2" fill="#b9b0dc">${esc(AUTHOR.toUpperCase())}</text>
</svg>`;


const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${TITLE}: paperback cover</title>
<style>
@page { size: ${W}in ${H}in; margin: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; width: ${W}in; height: ${H}in; overflow: hidden; position: relative; background: ${backdrop((BLEED + DESK) * 96, H * 96)}; color: #f6f1e4; font-family: Georgia, serif; }
.stars { position: absolute; left: 0; top: 0; width: ${W}in; height: ${H}in; }
.panel { position: absolute; top: ${BLEED}in; width: ${TRIM_W}in; height: ${TRIM_H}in; }
.back { left: ${BLEED}in; padding: 0.85in 0.7in 0; box-sizing: border-box; }
.spine { position: absolute; left: ${BLEED + TRIM_W}in; top: ${BLEED}in; width: ${spine}in; height: ${TRIM_H}in; }
.front { left: ${FRONT_X}in; }
.front svg { display: block; width: 100%; height: 100%; }
.back .lead { margin: 0 0 0.26in; font-size: 16pt; line-height: 1.35; font-style: italic; color: #bcaaff; }
.back p { margin: 0 0 0.14in; font-size: 11pt; line-height: 1.5; }
.back .closing { margin-top: 0.32in; font-size: 15pt; font-style: italic; color: #bcaaff; }
.back .byline { position: absolute; left: 0.7in; bottom: 0.7in; margin: 0; font: bold 7.5pt Arial, Helvetica, sans-serif; letter-spacing: 0.2em; color: #8f86b5; }
</style>
</head>
<body>
${starSvg(0, 0, W, H, 1, true)}
<section class="panel back">
<p class="lead">${lead}</p>
${words.map((p) => `<p>${p}</p>`).join("\n")}
<p class="closing">${closing}</p>
<p class="byline">${esc(TITLE.toUpperCase())} · ${esc(AUTHOR.toUpperCase())}</p>
</section>
${spineText}
<section class="panel front">${front}</section>
</body>
</html>
`;

// The front on its own, the same sky and stars, as a 1600x2400 picture.
const frontPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
html, body { margin: 0; width: 1600px; height: 2400px; overflow: hidden; }
body { position: relative; background: ${backdrop((DESK * 2400) / TRIM_H, 2400)}; }
.stars, .art { position: absolute; left: 0; top: 0; width: 1600px; height: 2400px; }
</style>
</head>
<body>
${starSvg(FRONT_X, BLEED, TRIM_W, TRIM_H, 1, false)}
<div class="art">${front.replace("<svg ", '<svg width="1600" height="2400" ')}</div>
</body>
</html>
`;

const browser = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"].find(fs.existsSync);
if (!browser) throw new Error("Needs Google Chrome or Microsoft Edge to print the cover");
const work = fs.mkdtempSync(path.join(os.tmpdir(), "hex-cover-"));
fs.writeFileSync(path.join(work, "cover.html"), page);
fs.writeFileSync(path.join(work, "front.html"), frontPage);
const run = (args, done) => {
  spawn(browser, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--hide-scrollbars",
    "--user-data-dir=" + path.join(work, "profile"), ...args], { stdio: "ignore" }).on("exit", done);
};
fs.rmSync(out, { force: true });
run(["--no-pdf-header-footer", "--print-to-pdf=" + out, "file://" + path.join(work, "cover.html")], () => {
  if (!fs.existsSync(out)) { fs.rmSync(work, { recursive: true, force: true }); console.error("The browser did not write " + out); process.exit(1); }
  // Chrome only makes page widths in steps of about 0.013 in, and KDP checks
  // the cover's size. So set the page box to the exact width, writing the
  // number at the same length so the PDF's byte offsets stay valid. It trims
  // a sliver of plain bleed off the right edge; everything is laid out from
  // the left, so the trim lines don't move.
  const want = W * 72;
  const pdf = fs.readFileSync(out, "latin1").replace(/(\/(?:Media|Crop)Box\s*\[\s*0 0 )([0-9.]+)/g, (m, pre, w) => {
    const exact = want.toFixed(Math.max(0, w.length - String(Math.floor(want)).length - 1));
    return exact.length === w.length && Math.abs(+w - want) < 2 ? pre + exact : m;
  });
  fs.writeFileSync(out, pdf, "latin1");
  console.log(`Wrote ${path.relative(root, out)}: ${W.toFixed(3)} x ${H.toFixed(3)} in for ${pages} interior pages, spine ${spine.toFixed(3)} in` +
    (spineText ? `, spine text ${titlePt.toFixed(2)} pt title and ${authorPt.toFixed(2)} pt author.` : ", no spine text (too thin)."));
  run(["--window-size=1600,2400", "--force-device-scale-factor=1", "--screenshot=" + png, "file://" + path.join(work, "front.html")], () => {
    fs.rmSync(work, { recursive: true, force: true });
    console.log(fs.existsSync(png) ? `Wrote ${path.relative(root, png)}: 1600 x 2400.` : "The browser did not write " + png);
  });
});
