// The whole story lives here.
//
// Every passage has an id (its key in `passages`), a title, some text
// (one string per paragraph, HTML like <em> is allowed), and a list of
// choices. Each choice sends the reader to another passage's id with `to`:
//
//   choices: [
//     { text: "Smack the orb", to: "smack" },
//   ],
//
// A passage with no choices shows "To be continued…". Add `ending: true`
// to show "The End" instead.

const STORY = {
  start: "start",

  passages: {
    start: {
      title: "The Tower",
      text: [
        "You’re standing in a stone tower at 7 a.m., holding a lukewarm coffee, while a 900-year-old wizard named Gorb jabs a crusty finger at a glowing orb.",
        "“This piece of shit stopped working the second I updated it,” he snaps. “I have a meeting with my dead wife and her lawyer about our assets for the divorce. God, even in death this bitch ruins my life.”",
        "The orb flickers. A tiny voice inside it whispers, “Please... kill me.”",
      ],
      choices: [],
    },
  },
};
