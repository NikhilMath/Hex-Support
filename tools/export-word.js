// Exports the whole story to a Word document for editing: one scene per
// page, numbered in the same order as story.js. After each choice is the
// number of the scene it goes to, linked, so a reviewer can follow any route
// without the website. It's kept lean on purpose, because editors charge by
// Word's word count: the extra navigation adds only a few hundred words.
//
//   cd tools && npm install        (once, installs the docx library)
//   node tools/export-word.js "~/Downloads/Hex Support - Full Story.docx"
//   node tools/export-word.js out.docx --routes   also list every way into each scene

const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat,
  Bookmark, InternalHyperlink, Footer, PageNumber,
} = require("docx");

// The 15 scenes written with the author before the story was expanded.
const ORIGINAL = new Set([
  "start", "reboot", "mute", "stairwell", "run", "orbnap", "lawyer", "early",
  "ask", "after", "uninstall", "uninstalled", "dead", "clockout", "garage",
]);

const args = process.argv.slice(2);
const showRoutes = args.includes("--routes");
const outArg = args.find((a) => !a.startsWith("--")) || "Hex Support - Full Story.docx";
const out = path.resolve(outArg.replace(/^~(?=\/)/, os.homedir()));

const src = fs.readFileSync(path.join(__dirname, "..", "story.js"), "utf8");
const STORY = new Function(`${src}; return STORY;`)();
const ids = Object.keys(STORY.passages);
const num = Object.fromEntries(ids.map((id, i) => [id, i + 1]));
const label = (id) => `${num[id]}. ${STORY.passages[id].title}`;
const anchor = (id) => `scene_${id}`;

const parents = {};
for (const id of ids) {
  for (const c of STORY.passages[id].choices || []) (parents[c.to] ||= []).push({ from: id, text: c.text });
}

const words = (s) => s.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const storyWords = ids.reduce((n, id) => n + STORY.passages[id].text.reduce((m, t) => m + words(t), 0), 0);
const endings = ids.filter((id) => STORY.passages[id].ending);

// Story text allows <em> and <br>. Turn them into italics and line breaks.
function storyRuns(html) {
  const runs = [];
  html.split(/<br\s*\/?>/).forEach((line, i) => {
    let italic = false;
    line.split(/(<\/?em>)/).forEach((part, j) => {
      if (part === "<em>") return void (italic = true);
      if (part === "</em>") return void (italic = false);
      const text = part.replace(/<[^>]+>/g, "");
      if (text) runs.push(new TextRun({ text, italics: italic, break: i > 0 && j === 0 ? 1 : 0 }));
    });
    if (i > 0 && !line) runs.push(new TextRun({ text: "", break: 1 }));
  });
  return runs;
}

const note = (children) =>
  new Paragraph({ spacing: { after: 80 }, children, style: "Note" });
const link = (id, text = label(id)) =>
  new InternalHyperlink({ anchor: anchor(id), children: [new TextRun({ text, style: "Hyperlink" })] });

const front = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Hex Support")] }),
  new Paragraph({ style: "Subtitle", children: [new TextRun("The full story, for review")] }),
  ...[
    `One scene per page, numbered 1 to ${ids.length}. The number after each choice is the scene it leads to. Click it to jump there.`,
    "The five endings finish with THE END. Scenes marked “Original” were written with the author: suggest changes, don’t rewrite.",
    "Please edit with Track Changes on. Please don’t change scene numbers or titles. To move a choice, leave a comment.",
  ].map((t) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun(t)] })),
];

const scenes = ids.flatMap((id) => {
  const p = STORY.passages[id];
  const into = parents[id] || [];
  const blocks = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      children: [new Bookmark({ id: anchor(id), children: [new TextRun(label(id))] })],
    }),
  ];
  if (ORIGINAL.has(id)) blocks.push(note([new TextRun({ text: "Original", bold: true })]));
  if (showRoutes && id !== STORY.start) {
    const from = [new TextRun({ text: "Comes from: ", bold: true })];
    into.forEach((f, i) => {
      if (i) from.push(new TextRun("; "));
      from.push(link(f.from), new TextRun(` (“${f.text}”)`));
    });
    blocks.push(note(from));
  }
  for (const t of p.text) blocks.push(new Paragraph({ style: "Story", children: storyRuns(t) }));

  if (p.ending) {
    blocks.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 360 },
      children: [new TextRun({ text: "THE END", bold: true, size: 28 })],
    }));
  } else {
    for (const c of p.choices) {
      blocks.push(new Paragraph({
        numbering: { reference: "choices", level: 0 },
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text: `${c.text} `, bold: true }), link(c.to, `(${num[c.to]})`)],
      }));
    }
  }
  return blocks;
});

const doc = new Document({
  creator: "Hex Support",
  title: "Hex Support: the full story, for review",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 56, bold: true, color: "5B3FA6" }, paragraph: { spacing: { after: 80 } } },
      { id: "Subtitle", name: "Subtitle", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, color: "555555" }, paragraph: { spacing: { after: 160 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "5B3FA6" }, paragraph: { spacing: { after: 120 }, outlineLevel: 0, keepNext: true } },
      { id: "Story", name: "Story", basedOn: "Normal", next: "Story", quickFormat: true,
        run: { font: "Georgia", size: 23 }, paragraph: { spacing: { after: 160, line: 300 } } },
      { id: "Note", name: "Scene Note", basedOn: "Normal", next: "Story", quickFormat: true,
        run: { size: 18, color: "666666" } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "choices", levels: [{ level: 0, format: LevelFormat.BULLET, text: "→", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Hex Support · page ", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" })],
        })],
      }),
    },
    children: [...front, ...scenes],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log(`Wrote ${out}`);
  console.log(`${ids.length} scenes, ${endings.length} endings, ${storyWords} words of story`);
});
