// Renders the passage named in the URL hash (e.g. #read) using STORY from
// story.js. Choices are plain links, so the browser's back button works and
// any passage can be linked to directly. Where the reader has been is saved
// in this browser's local storage.

(function () {
  const titleEl = document.getElementById("passage-title");
  const textEl = document.getElementById("passage-text");
  const choicesEl = document.getElementById("choices");
  const restartBtn = document.getElementById("restart");
  const forgetBtn = document.getElementById("forget");
  const mapSvg = document.getElementById("map-svg");
  const mapScroll = mapSvg.parentElement;
  const deadEndCount = document.getElementById("dead-end-count");
  const sceneCount = document.getElementById("scene-count");
  const endingsFound = document.getElementById("endings-found");
  sceneCount.textContent = `Scenes: ${Object.keys(STORY.passages).length} of ${STORY.targetScenes}`;
  const endings = Object.keys(STORY.passages).filter((id) => STORY.passages[id].ending);

  // Every scene the reader has seen and every choice they've taken, kept in
  // this browser between visits so the map remembers where they've been.
  const SAVE_KEY = "hex-support-trail";
  const trail = loadTrail();
  let lastId = null;

  function loadTrail() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved) return { visited: new Set(saved.visited), walked: new Set(saved.walked) };
    } catch (e) {
      // Storage blocked or unreadable: start fresh.
    }
    return { visited: new Set(), walked: new Set() };
  }

  function saveTrail() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ visited: [...trail.visited], walked: [...trail.walked] }));
    } catch (e) {
      // Private windows and some browsers don't allow storage. The map still
      // works for this visit.
    }
  }

  function currentId() {
    return decodeURIComponent(location.hash.slice(1)) || STORY.start;
  }

  function paragraph(html) {
    const p = document.createElement("p");
    p.innerHTML = html;
    return p;
  }

  function choiceLink(text, to) {
    const a = document.createElement("a");
    a.className = "choice";
    a.href = "#" + encodeURIComponent(to);
    a.textContent = text;
    return a;
  }

  function showPassage(id, passage) {
    if (!passage) {
      titleEl.textContent = "Lost";
      const p = document.createElement("p");
      p.textContent = `There is no passage called “${id}”.`;
      textEl.replaceChildren(p);
      choicesEl.replaceChildren(choiceLink("Go back to the start", STORY.start));
      document.title = "Lost · Hex Support";
      return;
    }

    titleEl.textContent = passage.title || "";
    textEl.replaceChildren(...(passage.text || []).map(paragraph));

    const choices = passage.choices || [];
    if (choices.length === 0) {
      const end = document.createElement("p");
      end.className = "the-end";
      end.textContent = passage.ending ? "The End" : "To be continued…";
      choicesEl.replaceChildren(end);
    } else {
      choicesEl.replaceChildren(...choices.map((c) => choiceLink(c.text, c.to)));
    }

    document.title = passage.title ? `${passage.title} · Hex Support` : "Hex Support";
  }

  function render() {
    const id = currentId();
    const passage = STORY.passages[id];

    const last = lastId && STORY.passages[lastId];
    if (last && (last.choices || []).some((c) => c.to === id)) {
      trail.walked.add(`${lastId}→${id}`);
    }
    if (passage) trail.visited.add(id);
    lastId = id;
    saveTrail();

    showPassage(id, passage);
    const { deadEnds } = drawStoryMap(mapSvg, STORY, id, trail);
    const over = deadEnds > STORY.maxEndings;
    deadEndCount.textContent = `Dead ends: ${deadEnds} of ${STORY.maxEndings}${over ? " (too many)" : ""}`;
    deadEndCount.classList.toggle("over", over);
    const found = endings.filter((e) => trail.visited.has(e)).length;
    endingsFound.textContent = `Endings found: ${found} of ${endings.length}`;
    centerMapOn(mapSvg.querySelector(".map-node.current rect"));

    window.scrollTo(0, 0);
    titleEl.focus({ preventScroll: true });
  }

  // Scroll the map box (not the page) so the current scene is in the middle.
  function centerMapOn(box) {
    if (!box) return;
    const node = box.getBoundingClientRect();
    const view = mapScroll.getBoundingClientRect();
    mapScroll.scrollTop += node.top - view.top - (view.height - node.height) / 2;
    mapScroll.scrollLeft += node.left - view.left - (view.width - node.width) / 2;
  }

  function goToStart() {
    lastId = null;
    if (currentId() === STORY.start) render();
    else location.hash = STORY.start;
  }

  // Start over keeps everything you've found, so the map still shows it.
  restartBtn.addEventListener("click", goToStart);

  forgetBtn.addEventListener("click", () => {
    if (!confirm("Forget every scene and ending you’ve found? This can’t be undone.")) return;
    trail.visited.clear();
    trail.walked.clear();
    goToStart();
  });

  window.addEventListener("hashchange", render);
  render();
})();
