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
  // `revs` remembers which version of a `revised` scene they read, so a
  // rewritten scene shows up as unread again.
  const SAVE_KEY = "hex-support-trail";
  const trail = loadTrail();
  let lastId = null;

  function loadTrail() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved) {
        const trail = { visited: new Set(saved.visited), walked: new Set(saved.walked), revs: saved.revs || {} };
        forgetRewrites(trail);
        return trail;
      }
    } catch (e) {
      // Storage blocked or unreadable: start fresh.
    }
    return { visited: new Set(), walked: new Set(), revs: {} };
  }

  // Unmark scenes that were rewritten since the reader saw them, along with
  // the choices taken into and out of them.
  function forgetRewrites(trail) {
    for (const id of [...trail.visited]) {
      const passage = STORY.passages[id];
      if (!passage || (passage.revised || 0) <= (trail.revs[id] || 0)) continue;
      trail.visited.delete(id);
      for (const step of [...trail.walked]) {
        const [from, to] = step.split("→");
        if (from === id || to === id) trail.walked.delete(step);
      }
    }
  }

  function saveTrail() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ visited: [...trail.visited], walked: [...trail.walked], revs: trail.revs }));
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

  // A choice whose scene you've already read gets a check and a "Visited"
  // tag, so you can see at a glance which options are left to try.
  function choiceLink(text, to, seen) {
    const a = document.createElement("a");
    a.className = seen ? "choice visited" : "choice";
    a.href = "#" + encodeURIComponent(to);
    const label = document.createElement("span");
    label.className = "choice-text";
    label.textContent = text;
    a.append(label);
    if (seen) {
      const tag = document.createElement("span");
      tag.className = "choice-tag";
      tag.textContent = "Visited";
      a.append(tag);
    }
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
      choicesEl.replaceChildren(...choices.map((c) => choiceLink(c.text, c.to, trail.visited.has(c.to))));
    }

    document.title = passage.title ? `${passage.title} · Hex Support` : "Hex Support";
  }

  // `jump` scrolls the page so the new scene's title is at the top. It's off
  // for the first page load, so the map is the first thing you see.
  function render(jump) {
    const id = currentId();
    const passage = STORY.passages[id];

    const last = lastId && STORY.passages[lastId];
    if (last && (last.choices || []).some((c) => c.to === id)) {
      trail.walked.add(`${lastId}→${id}`);
    }
    if (passage) {
      trail.visited.add(id);
      if (passage.revised) trail.revs[id] = passage.revised;
    }
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

    if (jump) titleEl.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
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
    if (currentId() === STORY.start) render(true);
    else location.hash = STORY.start;
  }

  // Start over keeps everything you've found, so the map still shows it.
  restartBtn.addEventListener("click", goToStart);

  forgetBtn.addEventListener("click", () => {
    if (!confirm("Forget every scene and ending you’ve found? This can’t be undone.")) return;
    trail.visited.clear();
    trail.walked.clear();
    trail.revs = {};
    goToStart();
  });

  window.addEventListener("hashchange", () => render(true));
  render();
})();
