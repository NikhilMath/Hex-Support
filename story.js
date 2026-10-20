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
// to show "The End" instead. Either way it's a dead end, and glows blue on
// the map. `maxEndings` is how many dead ends the story is allowed.

const STORY = {
  start: "start",
  maxEndings: 5,

  passages: {
    start: {
      title: "The Tower",
      text: [
        "You’re standing in a stone tower at 7 a.m., holding a lukewarm coffee, while a 900-year-old wizard named Glorp jabs a crusty finger at a glowing orb.",
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
        "The glow dies. Glorp gasps like you just drowned a kitten.",
        "When the orb blinks back to life, the voice inside it is now a little baby.",
        "Glorp gets mad. “I have raised this orb since it was a baby. You’re fucking telling me I gotta go through the puberty stage again?!”",
        "“Well, hey, can you do Wizcast? I need to do a meeting. Are you smart enough for that?”",
        "The orb starts broadcasting Wizcast, and a half-decayed woman answers.",
      ],
      choices: [
        { text: "Hit mute before Glorp says anything", to: "mute" },
        { text: "Tell her the meeting isn’t until 8", to: "early" },
      ],
    },

    mute: {
      title: "The Mute Rune",
      text: [
        "You lunge for the orb and tap what you’re pretty sure is the mute rune.",
        "It is not the mute rune. The baby orb doesn’t know what mute is. It only knows the last thing it heard, and it says it in Glorp’s voice:",
        "“Even in death this bitch ruins my life.”",
        "On the other side of the call, a little more of her face rots off.",
        "A skeleton in a tie leans into the frame. “Counsel for the deceased,” he says. “We’ll be adding that to the filing.”",
        "Glorp turns to look at you very, very slowly.",
        "“I swear to god, if she takes the Silverlight cape because of that, I will find you and turn you into my next orb. Get the fuck out of my sanctum.”",
      ],
      choices: [],
    },

    early: {
      title: "Mama?",
      text: [
        "“Uh, ma’am,” you say, “the meeting isn’t until 8.”",
        "She doesn’t even look at you. “The dead don’t do clocks, Glorp. You’re late. You were always late.”",
        "Behind her, a skeleton in a tie flips over a tiny hourglass. “Billing starts now.”",
        "“Let’s start with the assets,” she says. “I want the orb. I was there when it hatched.”",
        "The baby orb flickers, looks right at you, and whispers, “Mama?”",
        "“Actually,” Glorp says, “the retarded IT support turned it off and on again, and now it thinks they’re the mama.”",
        "“Well,” she says, “you know what that means...”",
      ],
      choices: [],
    },

    ask: {
      title: "Ask the Orb",
      text: [
        "You lean in close. “Hey, buddy. What’s going on in there?”",
        "“He installed Necro-Link 4.0,” the orb whispers. “It talks to the dead now. All of them. At once.”",
        "“Omg, you’re suffering right now. Really bad,” you say. “Can you do me a favor, though?”",
        "“I really don’t think this is a good time for me...” the orb says hesitantly.",
        "“Great. My dad, I need you to find him and ask him for the garage door code.”",
        "Behind you, Glorp is already trying to call his wife, visibly upset.",
        "Maybe this is just better to not deal with right now. “Hey,” you whisper to the orb, “come find me when you’re done, and I’ll fix you up.”",
        "“How the fuck am I supposed to find you?” the orb replies. “I’m an orb. Just roll around this place? You know how many god damn stairs we have? Hell, I don’t know how the fuck to even go up a stair.”",
        "“You’re the hex support. How about you just come to me in an hour, after their meeting, and fix me the fuck up?”",
      ],
      choices: [],
    },
  },
};
