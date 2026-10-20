// The whole story lives here.
//
// Every passage has an id (its key in `passages`), a title, some text
// (one string per paragraph, HTML like <em> is allowed), and a list of
// choices. Each choice sends the reader to another passage's id with `to`.
// A passage with no choices is an ending.
//
// The passages below are placeholders to show the shape. Replace them.

const STORY = {
  start: "start",

  passages: {
    start: {
      title: "A New Ticket",
      text: [
        "The support queue chimes. One new ticket, marked <em>urgent</em>.",
        "You crack your knuckles and open it.",
      ],
      choices: [
        { text: "Read the ticket carefully", to: "read" },
        { text: "Close it without reading", to: "ignore" },
      ],
    },

    read: {
      title: "The Details",
      text: [
        "The customer says their problem started at midnight and has been getting worse.",
      ],
      choices: [
        { text: "Call the customer", to: "call" },
        { text: "Escalate to your manager", to: "escalate" },
      ],
    },

    ignore: {
      title: "Ticket Closed",
      text: [
        "The ticket disappears from your queue. Somewhere, someone is very unhappy.",
      ],
      choices: [],
    },

    call: {
      title: "On the Line",
      text: [
        "The phone rings once, twice, and then someone picks up.",
      ],
      choices: [],
    },

    escalate: {
      title: "Not Your Problem",
      text: [
        "Your manager sighs and takes the ticket. You will hear about this later.",
      ],
      choices: [],
    },
  },
};
