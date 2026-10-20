// Checks story.js for problems a reader would hit:
//   - choices that point at a scene that doesn't exist
//   - scenes with no choices that aren't marked `ending: true`
//   - scenes nothing leads to
//   - loops (a route that can go around forever)
//   - more endings than STORY.maxEndings
// Then prints how long a playthrough is and how many routes reach each ending.
//
//   node tools/check-story.js            the checks
//   node tools/check-story.js --parents  also list every way into every scene
//   node tools/check-story.js --intro    also list, for each name in INTRO_TERMS,
//                                        every scene where a reader could meet it
//                                        for the first time (so it has to explain it)

const fs = require("fs");
const path = require("path");

const INTRO_TERMS = [
  "Doris", "Marrow", "Gary", "Deb", "work crystal", "Firmware", "Necro-Link",
  "Silverlight", "Brenda", "Steve", "Linda", "Doug", "Tammy", "Paperclip",
  "subpoena", "noon", "your dad", "union", "Wizcast", "sanctum",
];

const src = fs.readFileSync(path.join(__dirname, "..", "story.js"), "utf8");
const STORY = new Function(`${src}; return STORY;`)();
const { passages, start } = STORY;
const ids = Object.keys(passages);
const choicesOf = (id) => (passages[id] && passages[id].choices) || [];
const problems = [];

for (const id of ids) {
  const p = passages[id];
  for (const c of choicesOf(id)) {
    if (!passages[c.to]) problems.push(`${id}: the choice “${c.text}” goes to “${c.to}”, which doesn't exist`);
  }
  if (!choicesOf(id).length && !p.ending) problems.push(`${id}: dead end that isn't marked ending: true`);
  if (choicesOf(id).length && p.ending) problems.push(`${id}: marked as an ending but has choices`);
}

const reached = new Set([start]);
for (const queue = [start]; queue.length; ) {
  for (const c of choicesOf(queue.shift())) {
    if (passages[c.to] && !reached.has(c.to)) {
      reached.add(c.to);
      queue.push(c.to);
    }
  }
}
for (const id of ids) if (!reached.has(id)) problems.push(`${id}: nothing leads here`);

const state = {};
let looped = false;
(function visit(id, trail) {
  if (state[id] === "done") return;
  if (state[id] === "open") {
    looped = true;
    problems.push(`loop: ${[...trail.slice(trail.indexOf(id)), id].join(" → ")}`);
    return;
  }
  state[id] = "open";
  for (const c of choicesOf(id)) if (passages[c.to]) visit(c.to, [...trail, id]);
  state[id] = "done";
})(start, []);

const endings = ids.filter((id) => passages[id].ending);
if (endings.length > STORY.maxEndings) {
  problems.push(`${endings.length} endings, but the limit is ${STORY.maxEndings}`);
}

console.log(`Scenes: ${ids.length} of ${STORY.targetScenes}`);
console.log(`Endings: ${endings.length} of ${STORY.maxEndings}`);

if (!looped) {
  // For each scene: shortest and longest route to an ending, and how many
  // distinct routes reach each ending from here.
  const memo = {};
  const walk = (id) => {
    if (memo[id]) return memo[id];
    const next = choicesOf(id).filter((c) => passages[c.to]);
    if (!next.length) return (memo[id] = { min: 1, max: 1, byEnding: { [id]: 1 } });
    const out = { min: Infinity, max: 0, byEnding: {} };
    for (const c of next) {
      const r = walk(c.to);
      out.min = Math.min(out.min, r.min + 1);
      out.max = Math.max(out.max, r.max + 1);
      for (const [e, n] of Object.entries(r.byEnding)) out.byEnding[e] = (out.byEnding[e] || 0) + n;
    }
    return (memo[id] = out);
  };
  const all = walk(start);
  const total = Object.values(all.byEnding).reduce((a, b) => a + b, 0);
  console.log(`One playthrough: ${all.min} to ${all.max} scenes`);
  console.log(`Different routes: ${total.toLocaleString()}`);
  for (const e of endings) {
    console.log(`  ${passages[e].title}: ${(all.byEnding[e] || 0).toLocaleString()} routes`);
  }
}

const parents = {};
for (const id of ids) {
  for (const c of choicesOf(id)) (parents[c.to] ||= []).push({ from: id, text: c.text });
}

if (process.argv.includes("--parents")) {
  console.log("\nEvery way into every scene:");
  for (const id of ids) {
    console.log(`\n${id} (${passages[id].title})`);
    for (const p of parents[id] || []) console.log(`  from ${p.from}: “${p.text}”`);
  }
}

if (process.argv.includes("--intro")) {
  const plain = (s) => s.replace(/<[^>]+>/g, "").toLowerCase();
  const sceneText = (id) =>
    plain([...(passages[id].text || []), ...choicesOf(id).map((c) => c.text)].join(" "));
  console.log("\nWhere a first-time reader could meet each name (these scenes must explain it):");
  for (const term of INTRO_TERMS) {
    const t = term.toLowerCase();
    const mentions = new Set(ids.filter((id) => sceneText(id).includes(t)));
    const firsts = [];
    const seen = new Set([start]);
    for (const queue = [start]; queue.length; ) {
      const id = queue.shift();
      if (mentions.has(id)) {
        firsts.push(id);
        continue;
      }
      for (const c of choicesOf(id)) {
        if (passages[c.to] && !seen.has(c.to)) {
          seen.add(c.to);
          queue.push(c.to);
        }
      }
    }
    console.log(`  ${term}: ${firsts.length ? firsts.join(", ") : "(never mentioned)"}`);
  }
}

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log("\nNo problems found.");
}
