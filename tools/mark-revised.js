// Marks every scene that changed since the last commit as `revised`, so
// anyone who read the old version sees it as unread again (see game.js).
//
// A scene counts as changed if anything but its `revised` number differs
// from the committed version. Changed scenes get one more than the
// committed number. Running it again before committing changes nothing, and
// brand-new scenes are left alone, since nobody has read them yet.
//
//   node tools/mark-revised.js
//
// The pre-commit hook (tools/pre-commit) runs this on every commit that
// touches story.js. Install it with:
//
//   ln -s ../../tools/pre-commit .git/hooks/pre-commit

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const file = path.join(root, "story.js");
const load = (src) => new Function(`${src}; return STORY;`)();

let committedSrc;
try {
  committedSrc = execFileSync("git", ["show", "HEAD:story.js"], { cwd: root, encoding: "utf8" });
} catch (e) {
  console.log("No committed story.js to compare with. Nothing marked.");
  process.exit(0);
}

let src = fs.readFileSync(file, "utf8");
const before = load(committedSrc).passages;
const now = load(src).passages;

const withoutRevised = ({ revised, ...rest }) => JSON.stringify(rest);
const marked = [];

for (const id of Object.keys(now)) {
  const old = before[id];
  if (!old || withoutRevised(old) === withoutRevised(now[id])) continue;
  const want = (old.revised || 0) + 1;
  if ((now[id].revised || 0) >= want) continue;

  // Put `revised: N,` right after the title line, replacing any old one.
  const block = new RegExp(`(\\n    ${id}: \\{\\n(?:      title: [^\\n]*\\n)?)(?:      revised: \\d+,\\n)?`);
  if (!block.test(src)) {
    console.error(`Couldn't find where scene "${id}" starts. Mark it by hand.`);
    process.exitCode = 1;
    continue;
  }
  src = src.replace(block, `$1      revised: ${want},\n`);
  marked.push(`${id} (${now[id].title || "untitled"}) → revised: ${want}`);
}

if (marked.length) {
  fs.writeFileSync(file, src);
  console.log(`Marked ${marked.length} changed scene${marked.length === 1 ? "" : "s"} as unread again:`);
  for (const line of marked) console.log(`  ${line}`);
} else {
  console.log("No changed scenes need marking.");
}
