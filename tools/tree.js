// Draws the whole story as one tree for the last page of the paperback
// (user's request, 2026-10-20). Every box is a scene, labelled with its
// section number in the book, and every line is a choice. All lines run
// down the page, so the start is at the top and the five endings sit along
// the bottom, named.
//
// The web map (map.js) puts each scene one row below the first scene that
// leads to it and draws dashed lines back up. That's fine on a screen that
// scrolls, but on paper it's a tangle, so this lays the tree out the way
// printed flowcharts do:
//   1. Rows: every scene sits below every scene that leads to it, then each
//      scene slides up or down to keep its lines short. Endings go on the
//      bottom row.
//   2. A line that skips rows gets an invisible waypoint on every row it
//      passes, so it can be routed around boxes.
//   3. Order: each row is sorted by where its lines come from and go to,
//      sweeping down and up many times, keeping whichever order crosses
//      the fewest lines.
//   4. Spacing: each box and waypoint moves toward the things it's joined
//      to while keeping its place in the row, so long lines run straight.
//
// Used by tools/book.js. `treeSvg(STORY, num, size)` returns an <svg> sized
// in points, where `num` maps a scene id to its section number.

function treeSvg(STORY, num, { width, height }) {
  const passages = STORY.passages;
  const ids = Object.keys(passages);
  const kids = (id) => [...new Set((passages[id].choices || []).map((c) => c.to))];
  const parents = Object.fromEntries(ids.map((id) => [id, []]));
  for (const id of ids) for (const k of kids(id)) parents[k].push(id);
  const endings = ids.filter((id) => passages[id].ending);

  // 1. Rows. Longest route from the start first, so every line points down.
  const layer = { [STORY.start]: 0 };
  const waiting = Object.fromEntries(ids.map((id) => [id, parents[id].length]));
  for (const queue = [STORY.start]; queue.length; ) {
    const id = queue.shift();
    for (const k of kids(id)) {
      layer[k] = Math.max(layer[k] || 0, layer[id] + 1);
      if (--waiting[k] === 0) queue.push(k);
    }
  }
  const bottom = Math.max(...Object.values(layer));
  for (const e of endings) layer[e] = bottom;
  // A scene with more ways out than in slides as far down as it can, and one
  // with more ways in than out slides up, which shortens its lines overall.
  for (let moved = true, rounds = 0; moved && rounds < 200; rounds++) {
    moved = false;
    for (const id of ids) {
      if (id === STORY.start || passages[id].ending) continue;
      const lo = Math.max(...parents[id].map((p) => layer[p])) + 1;
      const hi = Math.min(...kids(id).map((k) => layer[k])) - 1;
      const pull = kids(id).length - parents[id].length;
      const want = pull > 0 ? hi : pull < 0 ? lo : layer[id];
      if (want !== layer[id]) { layer[id] = want; moved = true; }
    }
  }
  const rowCount = bottom + 1;

  // 2. Waypoints. Every node (scene or waypoint) knows the nodes it's joined
  // to on the rows just above and below.
  const nodes = [];
  const node = (props) => { const n = { ...props, up: [], down: [], i: nodes.length }; nodes.push(n); return n; };
  const sceneNode = Object.fromEntries(ids.map((id) => [id, node({ id, row: layer[id], real: true })]));
  const chains = [];
  for (const from of ids) {
    for (const to of kids(from)) {
      const chain = [sceneNode[from]];
      for (let r = layer[from] + 1; r < layer[to]; r++) chain.push(node({ row: r, real: false }));
      chain.push(sceneNode[to]);
      for (let k = 1; k < chain.length; k++) { chain[k - 1].down.push(chain[k]); chain[k].up.push(chain[k - 1]); }
      chains.push({ from, to, chain });
    }
  }

  // 3. Order within each row. Start from the order a reader meets things in.
  const rows = Array.from({ length: rowCount }, () => []);
  const seen = new Set();
  for (const queue = [sceneNode[STORY.start]]; queue.length; ) {
    const n = queue.shift();
    if (seen.has(n)) continue;
    seen.add(n);
    rows[n.row].push(n);
    queue.push(...n.down);
  }
  const index = () => rows.forEach((row) => row.forEach((n, k) => { n.pos = k; }));
  index();
  const crossingsBetween = (r) => {
    const segs = [];
    for (const n of rows[r]) for (const m of n.down) segs.push([n.pos, m.pos]);
    let c = 0;
    for (let a = 0; a < segs.length; a++) for (let b = a + 1; b < segs.length; b++) {
      if ((segs[a][0] - segs[b][0]) * (segs[a][1] - segs[b][1]) < 0) c++;
    }
    return c;
  };
  const crossings = () => { let c = 0; for (let r = 0; r + 1 < rowCount; r++) c += crossingsBetween(r); return c; };
  const sortBy = (r, side) => {
    const key = (n) => (n[side].length ? n[side].reduce((s, m) => s + m.pos, 0) / n[side].length : n.pos);
    rows[r] = rows[r].map((n) => [key(n), n.pos, n]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[2]);
    rows[r].forEach((n, k) => { n.pos = k; });
  };
  // Swap neighbours in a row whenever that alone uncrosses lines.
  const transpose = () => {
    for (let improved = true, rounds = 0; improved && rounds < 20; rounds++) {
      improved = false;
      for (let r = 0; r < rowCount; r++) {
        for (let k = 0; k + 1 < rows[r].length; k++) {
          const before = (r ? crossingsBetween(r - 1) : 0) + (r + 1 < rowCount ? crossingsBetween(r) : 0);
          const [a, b] = [rows[r][k], rows[r][k + 1]];
          rows[r][k] = b; rows[r][k + 1] = a; a.pos = k + 1; b.pos = k;
          const after = (r ? crossingsBetween(r - 1) : 0) + (r + 1 < rowCount ? crossingsBetween(r) : 0);
          if (after < before) improved = true;
          else { rows[r][k] = a; rows[r][k + 1] = b; a.pos = k; b.pos = k + 1; }
        }
      }
    }
  };
  let best = crossings(), bestRows = rows.map((row) => [...row]);
  for (let sweep = 0; sweep < 40; sweep++) {
    if (sweep % 2 === 0) for (let r = 1; r < rowCount; r++) sortBy(r, "up");
    else for (let r = rowCount - 2; r >= 0; r--) sortBy(r, "down");
    transpose();
    const c = crossings();
    if (c < best) { best = c; bestRows = rows.map((row) => [...row]); }
  }
  bestRows.forEach((row, r) => { rows[r] = row; });
  index();

  // 4. Spacing, in points. Boxes need room for their numbers, waypoints only
  // need to keep lines from touching.
  const BOX_W = 17, BOX_H = 9.5, END_W = 21, END_H = 11.5, NAME_PT = 4.8;
  // Ending names go under their boxes, on two lines if they're long.
  const nameLines = (id) => {
    const name = passages[id].title.toUpperCase(), words = name.split(" ");
    if (name.length <= 9 || words.length < 2) return [name];
    let best = 1;
    for (let k = 1; k < words.length; k++) {
      const a = words.slice(0, k).join(" ").length, b = words.slice(k).join(" ").length;
      if (Math.max(a, b) < Math.max(words.slice(0, best).join(" ").length, words.slice(best).join(" ").length)) best = k;
    }
    return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
  };
  const nameWidth = (id) => Math.max(...nameLines(id).map((l) => l.length)) * NAME_PT * 0.78;
  const half = (n) => (!n.real ? 0 : passages[n.id].ending ? Math.max(END_W, nameWidth(n.id) + 4) / 2 : BOX_W / 2);
  const gap = (a, b) => half(a) + half(b) + (a.real && b.real ? 7 : a.real || b.real ? 3.5 : 2.6);
  // Lines want to be straight, long ones most of all.
  const weight = (a, b) => (a.real && b.real ? 1 : a.real || b.real ? 2 : 8);
  // Closest positions to `want` that keep the row's order and gaps:
  // pool-adjacent-violators on positions shifted by the gaps before them.
  const fit = (row, want, w) => {
    const shift = [0];
    for (let k = 1; k < row.length; k++) shift.push(shift[k - 1] + gap(row[k - 1], row[k]));
    const blocks = [];
    for (let k = 0; k < row.length; k++) {
      blocks.push({ v: want[k] - shift[k], w: w[k], n: 1 });
      while (blocks.length > 1 && blocks.at(-2).v > blocks.at(-1).v) {
        const b = blocks.pop(), a = blocks.at(-1);
        a.v = (a.v * a.w + b.v * b.w) / (a.w + b.w); a.w += b.w; a.n += b.n;
      }
    }
    const out = [];
    for (const b of blocks) for (let j = 0; j < b.n; j++) out.push(b.v + shift[out.length]);
    return out;
  };
  for (const row of rows) {
    let x = 0;
    row.forEach((n, k) => { if (k) x += gap(row[k - 1], n); n.x = x; });
    row.forEach((n) => { n.x -= x / 2; });
  }
  for (let round = 0; round < 300; round++) {
    const order = round % 2 ? [...rows.keys()].reverse() : [...rows.keys()];
    for (const r of order) {
      const row = rows[r];
      const want = [], w = [];
      for (const n of row) {
        const near = [...n.up, ...n.down];
        if (!near.length) { want.push(n.x); w.push(0.01); continue; }
        let sx = 0, sw = 0;
        for (const m of near) { const k = weight(n, m); sx += m.x * k; sw += k; }
        want.push(sx / sw); w.push(sw);
      }
      fit(row, want, w).forEach((x, k) => { row[k].x = x; });
    }
  }

  // Fit it to the space given, leaving room under the bottom row for the
  // ending names. Boxes keep their size; only the spaces between them shrink.
  const minX = Math.min(...nodes.map((n) => n.x - half(n))), maxX = Math.max(...nodes.map((n) => n.x + half(n)));
  const NAME_ROOM = 17;
  // The endings row gets extra room above it, since so many lines end there.
  const LAST_GAP = 2.2;
  const rowStep = (height - END_H / 2 - BOX_H / 2 - NAME_ROOM) / (rowCount - 2 + LAST_GAP);
  const mid = (minX + maxX) / 2;
  const scale = Math.min(...nodes.filter((n) => n.x !== mid).map((n) => (width / 2 - half(n)) / Math.abs(n.x - mid)));
  for (const n of nodes) { n.x = width / 2 + (n.x - mid) * scale; n.y = BOX_H / 2 + (n.row === bottom ? bottom - 1 + LAST_GAP : n.row) * rowStep; }

  // Lines leave from the bottom of a box and arrive at the top, spread out
  // across its edge in the order they come from, so they don't pile up.
  const ports = (n, side, list) => {
    const others = list.map((m) => m.x);
    const order = others.map((x, k) => [x, k]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    const span = Math.min((passages[n.id].ending ? END_W : BOX_W) - 5, (list.length - 1) * 2.2);
    const out = [];
    order.forEach((k, j) => { out[k] = n.x + (list.length > 1 ? -span / 2 + (span * j) / (list.length - 1) : 0); });
    return out;
  };
  const outPort = new Map(), inPort = new Map();
  for (const n of nodes) {
    if (!n.real) continue;
    ports(n, "down", n.down).forEach((x, k) => outPort.set(`${n.i}>${n.down[k].i}`, x));
    ports(n, "up", n.up).forEach((x, k) => inPort.set(`${n.up[k].i}>${n.i}`, x));
  }
  const boxH = (n) => (passages[n.id].ending ? END_H : BOX_H);
  const f = (v) => +v.toFixed(2);
  const paths = chains.map(({ chain }) => {
    const pts = chain.map((n, k) => {
      if (n.real && k === 0) return [outPort.get(`${n.i}>${chain[1].i}`), n.y + boxH(n) / 2];
      if (n.real) return [inPort.get(`${chain[k - 1].i}>${n.i}`), n.y - boxH(n) / 2];
      return [n.x, n.y];
    });
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    for (let k = 1; k < pts.length; k++) {
      const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
      // Waypoints are passed straight up and down, so long lines bend only between rows.
      const ym = (y0 + y1) / 2;
      d += ` C${f(x0)},${f(ym)} ${f(x1)},${f(ym)} ${f(x1)},${f(y1)}`;
    }
    return `<path d="${d}"/>`;
  });

  const boxes = ids.map((id) => {
    const n = sceneNode[id], end = passages[id].ending, start = id === STORY.start;
    const w = end ? END_W : BOX_W, h = end ? END_H : BOX_H;
    const cls = end ? "end" : start ? "start" : "scene";
    let out = `<g class="${cls}"><rect x="${f(n.x - w / 2)}" y="${f(n.y - h / 2)}" width="${w}" height="${h}" rx="${end ? 2.5 : 2}"/>` +
      `<text x="${f(n.x)}" y="${f(n.y)}">${num[id]}</text></g>`;
    if (end) {
      out += nameLines(id).map((line, k) => `<text class="end-name" x="${f(n.x)}" y="${f(n.y + h / 2 + 5 + k * NAME_PT * 1.2)}">${line}</text>`).join("");
    }
    return out;
  });

  return {
    crossings: best,
    rows: rowCount,
    scale,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(width)} ${f(height)}" width="${f(width)}pt" height="${f(height)}pt">
<style>
.lines path { fill: none; stroke: #808080; stroke-width: 0.6; }
rect { stroke: #1a1a1a; stroke-width: 0.7; fill: #fff; }
text { font: bold 5.6px Arial, Helvetica, sans-serif; text-anchor: middle; dominant-baseline: central; fill: #1a1a1a; }
.start rect, .end rect { fill: #1a1a1a; }
.start text, .end text { fill: #fff; }
.end text { font-size: 6.6px; }
.end-name { font-size: ${NAME_PT}px; letter-spacing: 0.3px; fill: #1a1a1a; }
</style>
<g class="lines">${paths.join("")}</g>
${boxes.join("\n")}
</svg>`,
  };
}

module.exports = { treeSvg };
