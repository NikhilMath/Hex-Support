// Draws a map of every passage in STORY and the choices between them.
// Each row is one more choice away from the start. Boxes are links, so
// clicking one jumps to that passage.
//
// Dashed boxes are passages nothing links to, or choices that point at a
// passage that doesn't exist yet. Dashed lines lead back up the map.

function drawStoryMap(svg, story, currentId, trail) {
  const NODE_W = 132;
  const NODE_H = 36;
  const GAP_X = 16;
  const GAP_Y = 44;
  const PAD = 8;
  const MAX_LABEL = 18;

  const passages = story.passages;
  const choicesOf = (id) => (passages[id] && passages[id].choices) || [];

  // Walk the choices out from the start to find each passage's row.
  const row = new Map([[story.start, 0]]);
  const order = [story.start];
  for (let i = 0; i < order.length; i++) {
    const id = order[i];
    for (const c of choicesOf(id)) {
      if (!row.has(c.to)) {
        row.set(c.to, row.get(id) + 1);
        order.push(c.to);
      }
    }
  }

  // Passages nothing links to go on a row of their own at the bottom.
  const unreachable = Object.keys(passages).filter((id) => !row.has(id));
  if (unreachable.length) {
    const last = Math.max(...row.values()) + 1;
    for (const id of unreachable) {
      row.set(id, last);
      order.push(id);
    }
  }

  const rows = [];
  for (const id of order) (rows[row.get(id)] ||= []).push(id);

  const widest = Math.max(...rows.map((r) => r.length));
  const width = widest * NODE_W + (widest - 1) * GAP_X + PAD * 2;
  const height = rows.length * NODE_H + (rows.length - 1) * GAP_Y + PAD * 2;

  const pos = new Map();
  rows.forEach((ids, r) => {
    const rowWidth = ids.length * NODE_W + (ids.length - 1) * GAP_X;
    let x = (width - rowWidth) / 2;
    for (const id of ids) {
      pos.set(id, { x, y: PAD + r * (NODE_H + GAP_Y) });
      x += NODE_W + GAP_X;
    }
  });

  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  const defs = el("defs");
  for (const [id, cls] of [["map-arrow", "map-arrow"], ["map-arrow-walked", "map-arrow walked"]]) {
    const marker = el("marker", {
      id, viewBox: "0 0 10 10", refX: 9, refY: 5,
      markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse",
    });
    marker.append(el("path", { d: "M0,0 L10,5 L0,10 z", class: cls }));
    defs.append(marker);
  }
  svg.append(defs);

  for (const id of order) {
    const from = pos.get(id);
    for (const c of choicesOf(id)) {
      const to = pos.get(c.to);
      const x1 = from.x + NODE_W / 2;
      const y1 = from.y + NODE_H;
      const x2 = to.x + NODE_W / 2;
      const y2 = to.y;
      const bend = Math.max(GAP_Y / 2, Math.abs(y2 - y1) / 2);
      const walked = trail.walked.has(`${id}→${c.to}`);

      const classes = ["map-edge"];
      if (walked) classes.push("walked");
      if (row.get(c.to) <= row.get(id)) classes.push("back");

      const path = el("path", {
        d: `M${x1},${y1} C${x1},${y1 + bend} ${x2},${y2 - bend} ${x2},${y2}`,
        class: classes.join(" "),
        "marker-end": `url(#${walked ? "map-arrow-walked" : "map-arrow"})`,
      });
      const tip = el("title");
      tip.textContent = c.text;
      path.append(tip);
      svg.append(path);
    }
  }

  for (const id of order) {
    const { x, y } = pos.get(id);
    const passage = passages[id];

    const classes = ["map-node"];
    if (!passage) classes.push("missing");
    else if (unreachable.includes(id)) classes.push("unreachable");
    if (passage && passage.ending) classes.push("ending");
    if (trail.visited.has(id)) classes.push("visited");
    if (id === currentId) classes.push("current");

    const label = passage ? passage.title || id : `${id} (missing)`;
    const link = el("a", { href: "#" + encodeURIComponent(id), class: classes.join(" ") });
    const tip = el("title");
    tip.textContent = label;
    const text = el("text", {
      x: x + NODE_W / 2, y: y + NODE_H / 2,
      "text-anchor": "middle", "dominant-baseline": "central",
    });
    text.textContent = label.length > MAX_LABEL ? label.slice(0, MAX_LABEL - 1) + "…" : label;
    link.append(tip, el("rect", { x, y, width: NODE_W, height: NODE_H, rx: 6 }), text);
    svg.append(link);
  }

  function el(tag, attrs = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  }
}
