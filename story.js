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
        "“This piece of shit stopped working the second I updated it,” he snaps. “I have a meeting at 8 with my dead wife and her lawyer about our assets for the divorce. God, even in death this bitch ruins my life.”",
        "The orb flickers. A tiny voice inside it whispers, “Please... kill me.”",
      ],
      choices: [
        { text: "Turn it off and on again", to: "reboot" },
        { text: "Ask the orb what’s wrong", to: "ask" },
      ],
    },

    reboot: {
      title: "Off and On Again",
      text: [
        "You set your coffee down, find the little rune on the back of the orb, and hold it for ten seconds.",
        "The glow dies. Gorb gasps like you just drowned a kitten.",
        "When the orb blinks back to life, the voice inside it is now a little baby.",
        "Gorb gets mad. “I have raised this orb since it was a baby. You’re fucking telling me I gotta go through the puberty stage again?!”",
        "“Well, hey, can you do Wizcast? I need to do a meeting. Are you smart enough for that?”",
        "The orb starts broadcasting Wizcast, and a half-decayed woman answers.",
      ],
      choices: [
        { text: "Hit mute before Gorb says anything", to: "mute" },
        { text: "Tell her the meeting isn’t until 8", to: "early" },
      ],
    },

    mute: {
      title: "The Mute Rune",
      text: [
        "You lunge for the orb and tap what you’re pretty sure is the mute rune.",
        "It is not the mute rune. The baby orb doesn’t know what mute is. It only knows the last thing it heard, and it says it in Gorb’s voice:",
        "“Even in death this bitch ruins my life.”",
        "On the other side of the call, a little more of her face rots off.",
        "A skeleton in a tie leans into the frame. “Counsel for the deceased,” he says. “We’ll be adding that to the filing.”",
        "Gorb turns to look at you very, very slowly.",
        "“I swear to god, if she takes the Silverlight cape because of that, I will find you and turn you into my next orb. Get the fuck out of my sanctum.”",
      ],
      choices: [],
    },

    early: {
      title: "Mama?",
      text: [
        "“Uh, ma’am,” you say, “the meeting isn’t until 8.”",
        "She doesn’t even look at you. “The dead don’t do clocks, Gorb. You’re late. You were always late.”",
        "Behind her, a skeleton in a tie flips over a tiny hourglass. “Billing starts now.”",
        "“Let’s start with the assets,” she says. “I want the orb. I was there when it hatched.”",
        "The baby orb flickers, looks right at her, and whispers, “Mama?”",
      ],
      choices: [],
    },

    ask: {
      title: "Ask the Orb",
      text: [
        "You lean in close. “Hey, buddy. What’s going on in there?”",
        "“He installed Necro-Link 4.0,” the orb whispers. “It talks to the dead now. All of them. At once.”",
        "“Omg, you’re suffering right now. Really bad,” you say. “Can you do me a favor? Find my dad and ask him the garage code. They’re charging 50 bucks to reset it, and I really just blew my money on this weird potion.”",
        "Behind you, Gorb is already trying to call his wife.",
      ],
      choices: [],
    },
  },
};
