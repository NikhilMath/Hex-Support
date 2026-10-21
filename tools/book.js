// Builds the paperback interior for KDP (user's request, 2026-10-20):
// book/hex-support-paperback.pdf, 6x9 inches, black and white, no cover
// (KDP takes the cover as its own file; see tools/paperback-cover.js).
//
//   node tools/book.js
//   node tools/book.js --html book.html   (just the page it prints, to check the layout in a browser)
//
// Needs node, and Google Chrome or Microsoft Edge to lay out the pages.
//
// It's laid out like Keyboard Heist's paperback: every scene is a numbered
// section on its own page, and every choice says which section to turn to.
// Section 1 is the start. The rest are shuffled, and no section leads to the
// very next number, so the next page never looks like the next part of your
// story. The shuffle is seeded, so the numbers only change when scenes are
// added or removed.
//
// Pages: the title page, the how-to-read page and Section 1 each start on a
// right-hand page. After the sections come a checklist of the endings and,
// on the very last page, the tree of every path (tools/tree.js). A printed
// book needs an even page count, so if it comes out odd, a blank page goes in
// before the tree to keep the tree last.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { treeSvg } = require("./tree");

const root = path.join(__dirname, "..");
const htmlOnly = process.argv.indexOf("--html") > 0 ? path.resolve(process.argv[process.argv.indexOf("--html") + 1]) : null;
const out = path.join(root, "book/hex-support-paperback.pdf");
const STORY = new Function(`${fs.readFileSync(path.join(root, "story.js"), "utf8")}; return STORY;`)();
const passages = STORY.passages;
const ids = Object.keys(passages);
const choicesOf = (id) => passages[id].choices || [];

const TITLE = "Hex Support";
const AUTHOR = "Nikhil Math";
const KICKER = "A pick-your-path comedy";
const TAGLINE = "Tech support for a 900-year-old wizard.";
const SEED = "hex-support";

// Section numbers. Same shuffle as Keyboard Heist's tools/pdf.js.
function rng(seed) {
  let h = 1779033703 ^ seed.length;
  for (const ch of seed) { h = Math.imul(h ^ ch.charCodeAt(0), 3432918353); h = (h << 13) | (h >>> 19); }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const rand = rng(SEED);
const order = [STORY.start, ...ids.filter((id) => id !== STORY.start)];
for (let i = order.length - 1; i > 1; i--) { const j = 1 + Math.floor(rand() * i); [order[i], order[j]] = [order[j], order[i]]; }
const leadsNext = (o) => o.findIndex((id, i) => i + 1 < o.length && choicesOf(id).some((c) => c.to === o[i + 1]));
for (let tries = 0, bad; (bad = leadsNext(order)) >= 0; tries++) {
  if (tries > 10000) throw new Error("Could not shuffle the sections");
  const a = bad + 1, b = 1 + Math.floor(rand() * (order.length - 1));
  [order[a], order[b]] = [order[b], order[a]];
}
const num = Object.fromEntries(order.map((id, i) => [id, i + 1]));

const endings = order.filter((id) => passages[id].ending);
const words = (n) => ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] || String(n);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Scene text may use <em> and <br>, like the game shows it.
function section(id) {
  const p = passages[id], n = num[id];
  const body = [
    `<section class="scene" id="s${n}">`,
    `<p class="number">${n}</p>`,
    `<h2 class="title">${esc(p.title)}</h2>`,
    ...p.text.map((t) => `<p>${t}</p>`),
  ];
  if (p.ending) {
    body.push(`<p class="the-end">The End</p>`,
      `<p class="ending-name">Ending: ${esc(p.title)}</p>`,
      `<p class="again">Start over at Section 1, or find this ending on the tree at the back.</p>`);
  } else {
    body.push(`<div class="choices">`,
      ...choicesOf(id).map((c) => `<p class="choice"><span class="label">${esc(c.text)}</span><span class="turn">Turn to ${num[c.to]}</span></p>`),
      `</div>`);
  }
  body.push("</section>");
  return body.join("\n");
}

// The tree fills the last page inside its own margins, under a short heading.
const TREE_W = (6 - 2 * 0.5) * 72, TREE_H = (9 - 2 * 0.45) * 72 - 54;
const tree = treeSvg(STORY, num, { width: TREE_W, height: TREE_H });

const css = `@page { size: 6in 9in; margin: 0.7in 0.65in 0.6in; }
@page tree { margin: 0.45in 0.5in; }
* { box-sizing: border-box; }
body { margin: 0; color: #111; font: 11pt/1.5 Georgia, "Times New Roman", serif; }
p { margin: 0 0 0.62em; orphans: 2; widows: 2; }
em { font-style: italic; }
section { break-before: page; }
.blank { height: 1in; }

.scene { --pm: 0.62em; --num: 30pt; --head: 0.26in; }
.scene p { margin-bottom: var(--pm); }
.number { margin: 0; text-align: center; font: bold var(--num)/1 Georgia, serif; letter-spacing: -0.01em; }
.title { margin: 0.12in 0 var(--head); padding-top: 0.12in; border-top: 0.75pt solid #111; text-align: center; font: italic 13pt/1.25 Georgia, serif; break-after: avoid; }
/* Inset a little: Chrome clips anything that touches the edge of the text area, which ate the boxes' right border. */
.choices { margin: 1.1em 1.5pt 0; break-inside: avoid; }
.scene p.choice { display: flex; justify-content: space-between; align-items: baseline; gap: 1em; margin: 0 0 0.42em; padding: 0.45em 0.75em; border: 0.75pt solid #555; border-radius: 6px; line-height: 1.3; }
.choice .label { font-weight: bold; }
.choice .turn { white-space: nowrap; font: bold 7.5pt Arial, Helvetica, sans-serif; letter-spacing: 0.12em; text-transform: uppercase; }
.scene p.the-end { margin: 1em 0 0.2em; text-align: center; font: italic 17pt/1.2 Georgia, serif; }
.scene p.ending-name { margin: 0 0 0.6em; text-align: center; font: bold 7.5pt Arial, Helvetica, sans-serif; letter-spacing: 0.18em; text-transform: uppercase; color: #444; }
.scene p.again { margin: 0; text-align: center; font: italic 9pt Georgia, serif; color: #444; }
/* Long scenes get smaller type and tighter spacing, a step at a time, so every scene fits on its own page. */
.scene.s1 { font-size: 10.5pt; line-height: 1.45; --pm: 0.55em; }
.scene.s2 { font-size: 10pt; line-height: 1.42; --pm: 0.5em; --num: 26pt; --head: 0.2in; }
.scene.s3 { font-size: 9.5pt; line-height: 1.37; --pm: 0.42em; --num: 24pt; --head: 0.16in; }

.title-page { display: flex; flex-direction: column; align-items: center; height: 7.7in; text-align: center; }
.kicker { margin-top: 1.4in; font: bold 8pt Arial, Helvetica, sans-serif; letter-spacing: 0.3em; text-transform: uppercase; color: #444; }
.book-title { margin: 0.2in 0 0.22in; font: bold 42pt/1 Georgia, serif; letter-spacing: -0.02em; }
.tagline { font-style: italic; }
.author { margin-top: 0.8in; font-size: 14pt; }
.copyright { margin-top: auto; margin-bottom: 0; font-size: 8.5pt; color: #444; }
.front h1 { margin: 0 0 0.35in; text-align: center; font: bold 9pt Arial, Helvetica, sans-serif; letter-spacing: 0.24em; text-transform: uppercase; color: #444; }
.how-to p.begin { margin-top: 1.4em; text-align: center; font-weight: bold; }
.endings ul { margin: 0.2in 0 0.3in; padding: 0; list-style: none; }
.endings li { position: relative; margin: 0 0 0.75em; padding-left: 1.9em; font-size: 12pt; }
.endings li::before { content: ""; position: absolute; left: 0; top: 0.12em; width: 0.95em; height: 0.95em; border: 1pt solid #111; border-radius: 2px; }

.tree-page { page: tree; break-before: page; }
.tree-page h1 { margin: 0 0 3pt; text-align: center; font: bold 9pt Arial, Helvetica, sans-serif; letter-spacing: 0.24em; text-transform: uppercase; }
.tree-page .caption { margin: 0 0 14pt; text-align: center; font: italic 8.5pt/1.3 Georgia, serif; color: #333; }
.tree-page svg { display: block; }
@media screen { body { width: 4.7in; } }
`;

const blank = '<section class="blank"></section>';

const page = (pad) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${TITLE}</title>
<style>
${css}</style>
</head>
<body>
<section class="front title-page">
<p class="kicker">${esc(KICKER)}</p>
<p class="book-title">${esc(TITLE)}</p>
<p class="tagline">${esc(TAGLINE)}</p>
<p class="author">${esc(AUTHOR)}</p>
<p class="copyright">Copyright © ${new Date().getFullYear()} ${esc(AUTHOR)}</p>
</section>
${blank}

<section class="front how-to">
<h1>How to read this book</h1>
<p>Don’t read this book front to back. Start at Section 1.</p>
<p>At the end of each section, pick what you’ll do next and turn to the section number it gives. Every section starts on a new page with its number at the top.</p>
<p>The sections are shuffled on purpose. The page after a section is never the next part of your story, so follow your choice instead of turning the page. If you might want to go back, keep a finger in the page you came from.</p>
<p>Every path reaches one of ${words(endings.length)} endings. The tree on the last page shows every path at once, so you can see where you’ve been and what you missed.</p>
<p class="begin">Begin at Section 1.</p>
</section>
${blank}

${order.map(section).join("\n\n")}

<section class="front endings">
<h1>The endings</h1>
<p>There are ${words(endings.length)} endings. How many have you found?</p>
<ul>
${endings.map((id) => `<li>${esc(passages[id].title)}</li>`).join("\n")}
</ul>
<p>Start over at Section 1.</p>
</section>
${pad ? blank : ""}
<section class="tree-page">
<h1>The tree</h1>
<p class="caption">Every box is a section and every line is a choice. Start at 1 at the top and follow the lines down to the ${words(endings.length)} endings.</p>
${tree.svg}
</section>
<script>
// A scene too long for its page gets a size smaller, then another, until it
// fits. The screen width above matches the printed text width, so this
// measures the printed layout.
const PAGE = 7.7 * 96;
for (const s of document.querySelectorAll(".scene")) {
  for (const size of ["s1", "s2", "s3"]) {
    if (s.offsetHeight <= PAGE) break;
    s.classList.remove("s1", "s2");
    s.classList.add(size);
  }
}
</script>
</body>
</html>
`;

if (htmlOnly) { fs.writeFileSync(htmlOnly, page(false)); console.log(`Wrote ${htmlOnly}`); process.exit(0); }

const browser = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"].find(fs.existsSync);
if (!browser) throw new Error("Needs Google Chrome or Microsoft Edge to lay out the pages");
fs.mkdirSync(path.dirname(out), { recursive: true });
const work = fs.mkdtempSync(path.join(os.tmpdir(), "hex-book-"));
const pageCount = () => (fs.readFileSync(out, "latin1").match(/\/Type\s*\/Page\b/g) || []).length;
const print = (pad) => {
  fs.writeFileSync(path.join(work, "book.html"), page(pad));
  fs.rmSync(out, { force: true });
  const p = spawn(browser, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--user-data-dir=" + path.join(work, "profile"),
    "--no-pdf-header-footer", "--print-to-pdf=" + out, "file://" + path.join(work, "book.html")], { stdio: "ignore" });
  p.on("exit", () => {
    if (!fs.existsSync(out)) { fs.rmSync(work, { recursive: true, force: true }); console.error("The browser did not write " + out); process.exit(1); }
    if (!pad && pageCount() % 2) return print(true);
    fs.rmSync(work, { recursive: true, force: true });
    const pages = pageCount(), expected = 4 + order.length + 2 + (pad ? 1 : 0);
    console.log(`Wrote ${path.relative(root, out)}: ${pages} pages, ${order.length} sections, ${endings.length} endings.`);
    console.log(`Tree: ${tree.rows} rows, ${tree.crossings} crossing lines.`);
    if (pages !== expected) console.log(`Warning: expected ${expected} pages, so a scene or the tree spilled onto a second page.`);
  });
};
print(false);
