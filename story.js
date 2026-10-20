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
// `targetScenes` is how many scenes the finished book should have
// (about 100 paperback pages, going by Keyboard Heist).

const STORY = {
  start: "start",
  maxEndings: 5,
  targetScenes: 90,

  passages: {
    start: {
      title: "The Tower",
      text: [
        "You’re standing in a stone tower at 7 a.m., holding a lukewarm coffee, while a 900-year-old wizard named Plonk the Blank jabs a crusty finger at a glowing orb.",
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
        "The glow dies. Plonk gasps like you just drowned a kitten.",
        "When the orb blinks back to life, the voice inside it is now a little baby.",
        "Plonk gets mad. “I have raised this orb since it was a baby. You’re fucking telling me I gotta go through the puberty stage again?!”",
        "“Well, hey, can you do Wizcast? I need to do a meeting. Are you smart enough for that?”",
        "The orb starts broadcasting Wizcast, and a half-decayed woman answers.",
      ],
      choices: [
        { text: "Hit mute before Plonk says anything", to: "mute" },
        { text: "Tell her the meeting isn’t until 8", to: "early" },
      ],
    },

    mute: {
      title: "The Mute Rune",
      text: [
        "You lunge for the orb and tap what you’re pretty sure is the mute rune.",
        "It is not the mute rune. The baby orb doesn’t know what mute is. It only knows the last thing it heard, and it says it in Plonk’s voice:",
        "“Even in death this bitch ruins my life.”",
        "On the other side of the call, a little more of her face rots off.",
        "A skeleton in a tie leans into the frame. “Counsel for the deceased,” he says. “We’ll be adding that to the filing.”",
        "Plonk turns to look at you very, very slowly.",
        "“I swear to god, if she takes the Silverlight cape because of that, I will find you and turn you into my next orb. Get the fuck out of my sanctum.”",
      ],
      choices: [
        { text: "Get out of the sanctum", to: "stairwell" },
        { text: "Tell her the meeting isn’t until 8", to: "early" },
      ],
    },

    stairwell: {
      title: "The Stairwell",
      text: [
        "You back out of the sanctum. The door slams so hard a portrait of Plonk’s mother falls off the wall.",
        "You sit on the top step with your lukewarm coffee and listen through the door.",
        "The lawyer’s voice drones on. “Item one. The Silverlight cape.”",
        "A long pause. Then Plonk screams, “NOT THE CAPE!”",
        "Behind the door, the baby orb starts crying. You get the feeling Plonk is about to come looking for someone to turn into an orb.",
      ],
      choices: [
        { text: "Make a run for it", to: "run" },
        { text: "Sneak back in and kill the call", to: "uninstall" },
      ],
    },

    run: {
      title: "Down the Stairs",
      text: [
        "You leave your coffee on the step and bolt.",
        "The stairs spiral down, and down, and down. Plonk has a lot of stairs.",
        "Halfway down, you hear it behind you. Bonk. Bonk. Bonk. The baby orb is bouncing down the steps after you, one at a time.",
        "“Mama!” it squeals. “Mama, wait!”",
        "Far above, a door bangs open, and Plonk bellows, “WHERE IS MY ORB?”",
      ],
      choices: [
        { text: "Scoop up the orb and keep running", to: "orbnap" },
        { text: "Fix it right here on the stairs", to: "uninstall" },
      ],
    },

    orbnap: {
      title: "Orbnapped",
      text: [
        "You scoop up the baby orb. It’s warm, and it falls asleep in your arms almost immediately.",
        "You burst out the front door of the tower and into the morning air. Behind you, every window lights up at once.",
        "Plonk’s voice booms across the whole valley: “THAT IS KIDNAPPING. THAT IS ORB-NAPPING.”",
        "A crow lands on your shoulder with a tiny scroll tied to its leg. It says: <em>This is counsel for the deceased. We should talk.</em>",
      ],
      choices: [],
    },

    early: {
      title: "Mama?",
      text: [
        "“Uh, ma’am,” you say, “the meeting isn’t until 8.”",
        "She doesn’t even look at you. “The dead don’t do clocks, Plonk. You’re late. You were always late.”",
        "Behind her, a skeleton in a tie flips over a tiny hourglass. “Billing starts now.”",
        "“Let’s start with the assets,” she says. “I want the orb. I was there when it hatched.”",
        "The baby orb flickers, looks right at you, and whispers, “Mama?”",
        "“Actually,” Plonk says, “the dumbass IT support turned it off and on again, and now it thinks they’re the mama.”",
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
        "Behind you, Plonk is already trying to call his wife, visibly upset.",
        "Maybe this is just better to not deal with right now. “Hey,” you whisper to the orb, “come find me when you’re done, and I’ll fix you up.”",
        "“How the fuck am I supposed to find you?” the orb replies. “I’m an orb. Just roll around this place? You know how many god damn stairs we have? Hell, I don’t know how the fuck to even go up a stair.”",
        "“You’re the hex support. How about you just come to me in an hour, after their meeting, and fix me the fuck up?”",
      ],
      choices: [
        { text: "Promise to come back after the meeting", to: "after" },
        { text: "Reboot it anyway", to: "reboot" },
      ],
    },

    after: {
      title: "After the Meeting",
      text: [
        "At 9 a.m. on the dot, you slip back into the sanctum with a fresh coffee.",
        "Plonk is face-down on his desk, snoring into a pile of divorce scrolls. The one on top says <em>Exhibit C: The Orb</em>.",
        "The orb glows weakly. “I found your dad,” it whispers. “Necro-Link put him on the call with everyone else. He says the garage code is 1234, and he’s not mad, just disappointed.”",
        "“Now,” the orb says, “you promised. Fix me the fuck up.”",
      ],
      choices: [
        { text: "Uninstall Necro-Link", to: "uninstall" },
        { text: "Take the code and clock out", to: "clockout" },
      ],
    },

    uninstall: {
      title: "Uninstall?",
      text: [
        "You crack your knuckles and tap the orb twice. A list of installed spells floats up in front of you.",
        "There it is, right at the top: <em>Necro-Link 4.0, installed by Plonk, today</em>.",
        "You hit Uninstall. A little box pops up: <em>Are you sure? 4,816,203 dead people will be disconnected.</em>",
        "From inside the orb, millions of tiny voices all say, “Wait—”",
      ],
      choices: [],
    },

    clockout: {
      title: "Clocked Out",
      text: [
        "You scribble 1234 on the back of your hand so you don’t forget it, pat the orb twice, and say, “I’ll put in a ticket.”",
        "“You son of a—” the orb starts, but you’re already on the stairs.",
        "That night, you punch 1234 into the keypad and the garage door rolls open on the first try. Best day of your life.",
        "Somewhere in a stone tower, an orb is still whispering, “Please... kill me.”",
      ],
      choices: [
        { text: "Step into the garage", to: "garage" },
        { text: "Go back tomorrow and actually fix the orb", to: "uninstall" },
      ],
    },

    garage: {
      title: "The Garage",
      text: [
        "The light flickers on. Everything is exactly where your dad left it: the workbench, the lawnmower, the jar of screws he never sorted.",
        "And your dad, sitting in his old lawn chair, slightly see-through.",
        "“Took you long enough,” he says. “Some orb woke me up this morning asking for the garage code. Six years dead, and that’s the first time anybody’s called.”",
        "He squints at the back of your hand. “You wrote it on your hand? Jesus Christ, how dumb are you? It’s four numbers in sequential order, and it starts with 1!”",
      ],
      choices: [],
    },
  },
};
