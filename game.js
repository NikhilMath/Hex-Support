// Renders the passage named in the URL hash (e.g. #read) using STORY from
// story.js. Choices are plain links, so the browser's back button works and
// any passage can be linked to directly.

(function () {
  const titleEl = document.getElementById("passage-title");
  const textEl = document.getElementById("passage-text");
  const choicesEl = document.getElementById("choices");
  const restartBtn = document.getElementById("restart");

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

  function render() {
    const id = currentId();
    const passage = STORY.passages[id];

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
    window.scrollTo(0, 0);
    titleEl.focus({ preventScroll: true });
  }

  restartBtn.addEventListener("click", () => {
    location.hash = STORY.start;
  });

  window.addEventListener("hashchange", render);
  render();
})();
