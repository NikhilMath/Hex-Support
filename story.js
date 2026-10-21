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
// (one scene per page, plus about 10 pages of extras, going by
// Keyboard Heist).
//
// Run `node tools/check-story.js` after changing anything here. It checks
// for broken choices, loops, stray dead ends and scenes nothing leads to.

const STORY = {
  start: "start",
  maxEndings: 5,
  targetScenes: 100,

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
        "Plonk gets mad. “I have raised this orb since it was a baby. I got to go through the fucking puberty stage again?!”",
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
        { text: "Get the fuck out of the sanctum", to: "stairwell" },
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
      choices: [
        { text: "Meet the lawyer", to: "lawyer" },
        { text: "Find a quiet spot and fix the orb", to: "uninstall" },
      ],
    },

    lawyer: {
      title: "The Lawyer",
      text: [
        "You follow the crow to a crypt at the edge of town. The skeleton in the tie is waiting on a bench with a briefcase on his lap.",
        "“My client wants the orb,” he says. “Under the law of the dead, whoever the orb calls mama gets custody.”",
        "He slides a scroll across the bench. “So. How much do you want for it?”",
        "In your arms, the orb wakes up and blinks at him. “Mama, who’s the bone man?”",
      ],
      choices: [
        { text: "Ask how much he’s offering", to: "price" },
        { text: "Tell him the orb isn’t for sale", to: "notforsale" },
      ],
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
      choices: [
        { text: "Ask what that means", to: "law" },
        { text: "Grab the orb and bolt", to: "orbnap" },
      ],
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
        "You crack your knuckles, tap the orb twice, and say the words every hex support tech knows by heart: “Okay. Let’s take a look.”",
        "A list of installed spells floats up in front of you:",
        "<em>Fireball (free trial, 3 days left)</em><br><em>Paperclip Familiar (“It looks like you’re casting a spell!”)</em><br><em>Toolbar of Endless Searching</em><br><em>Necro-Link 4.0, installed by Plonk at 6:58 a.m.</em>",
        "Under Necro-Link, in tiny letters: <em>Talk to all your dead loved ones at once! Also everyone else’s.</em>",
        "Well, that explains a lot. You hit Uninstall.",
        "A little box pops up: <em>Are you sure? 4,816,203 dead people will be disconnected. This cannot be undone.</em>",
        "From inside the orb, four million tiny voices all say, “Wait—”",
      ],
      choices: [
        { text: "Click Yes", to: "uninstalled" },
        { text: "Click No and hear them out", to: "dead" },
      ],
    },

    uninstalled: {
      title: "Uninstalled",
      text: [
        "You click Yes.",
        "Four million voices scream at once, then cut out like someone yanked a plug. The silence is incredible.",
        "The orb flickers, clears, and settles into a calm, steady glow. For the first time since the update, it sounds fine.",
        "“Oh, thank god,” it says.",
        "Then a new box pops up: <em>Necro-Link 5.0 is available! Install now?</em>",
      ],
      choices: [
        { text: "Click Install", to: "install5" },
        { text: "Click Remind Me Never", to: "never" },
      ],
    },

    dead: {
      title: "The Dead Speak",
      text: [
        "You click No. Four million dead people sigh with relief.",
        "Then they all start talking at once. Someone wants to know if their cat is okay. Someone wants their dentures back. Someone just keeps saying, “Gary? Gary?”",
        "One voice cuts through the noise, calm and very organized. “We have a list of demands,” it says.",
      ],
      choices: [
        { text: "Ask what the demands are", to: "demands" },
        { text: "Find out who keeps yelling for Gary", to: "garyquest" },
      ],
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
      choices: [
        { text: "Ask what being dead is like", to: "deathlife" },
        { text: "Crack open two beers with him", to: "beers" },
      ],
    },

    // ---- The custody fight in Plonk's sanctum (from Mama?) ----

    law: {
      title: "Law of the Dead",
      text: [
        "The skeleton clears his throat, which is impressive for someone without one. “Marrow, of Marrow & Marrow, counsel for the deceased,” he says. “Under the law of the dead, whoever the orb calls mama becomes a legal party to the divorce.”",
        "Plonk’s dead wife, Doris, smiles with about half of her face. “So it’s a three-way now.”",
        "“I’ve been in a three-way, Doris,” Plonk says. “This is worse.”",
        "The baby orb nuzzles your sleeve. “Mama, what’s a three-way?”",
        "Something prints out of the orb like a receipt. It’s a summons: <em>Afterlife Family Court, today at noon. Property in dispute: one (1) orb, one (1) Silverlight cape.</em>",
      ],
      choices: [
        { text: "Ask Plonk what’s so special about the cape", to: "capetalk" },
        { text: "Ask Doris why she even wants the orb", to: "doriswants" },
      ],
    },

    capetalk: {
      title: "Silverlight Cape",
      text: [
        "Plonk pours himself a mead. It’s 7:40 a.m.",
        "“The Silverlight cape,” he says, and pats the silver cape on his shoulders. “It’s the only reason I’m nine hundred years old instead of a little pile of dust. Whoever wears it can’t die.”",
        "“And if a dead person puts it on?” you ask.",
        "“They come back.” He drains the mead. “She doesn’t want it so she can live, kid. She wants to come back to life and bang Gary.”",
        "On the call, Doris rolls her one good eye. “Tell them about bath night, Plonk. Tell them how long it takes to dry.”",
        "“Three weeks,” Plonk mutters. “Every time.”",
      ],
      choices: [
        { text: "Ask who the fuck Gary is", to: "gary" },
        { text: "Ask for a closer look at the cape", to: "closet" },
      ],
    },

    doriswants: {
      title: "What Doris Wants",
      text: [
        "Doris leans so close to her end of the call that you can see right up her nose. Which is to say, right into her skull.",
        "“The orb is the only clean line between the living and the dead, sweetie. Ouija boards are full of perverts.” She sniffs. “I want the orb, and I want the Silverlight cape. And I want you on the stand at noon, telling the judge that Plonk is an unfit orb father.”",
        "“What do I get?”",
        "“I know people down here. I can get your ticket queue cleared.” She pauses. “Forever.”",
        "Every hex support tech in the world would kill for that. Some of them have.",
        "Behind you, Plonk sets down his mead very slowly. “Don’t you fucking dare.”",
      ],
      choices: [
        { text: "Take Doris’s deal", to: "teamdoris" },
        { text: "Tell Doris to go fuck herself", to: "teamplonk" },
      ],
    },

    gary: {
      title: "Who the Fuck Is Gary?",
      text: [
        "Doris flips the call around. A ghost waves at you. He’s shirtless, tan in a way ghosts should not be, and he has an eight-pack.",
        "“Gary,” Doris says proudly. “Died in 1992. Backflip off a party barge.”",
        "“Stuck the landing, though,” Gary says.",
        "“His abs aren’t even real,” Plonk snarls. “They’re ectoplasm.”",
        "“Everything’s ectoplasm down here, bro.”",
        "The baby orb stares at Gary. “Mama, the ab man is shiny.”",
        "Plonk throws his mead at the orb. The call drops. He wipes his beard, breathing hard. “Court’s at noon,” he says. “You’re coming with me. And you’re wearing something nice.”",
      ],
      choices: [
        { text: "Go to court with Plonk", to: "courthouse" },
        { text: "Ask Plonk if he’s okay", to: "sadplonk" },
      ],
    },

    teamdoris: {
      title: "Team Doris",
      text: [
        "“Deal,” you say.",
        "“Smart cookie,” Doris says. Marrow writes something down with a finger bone.",
        "Plonk doesn’t yell. That’s the scary part. He just sets down his mead, cracks his neck, which sounds like a tree falling over, and raises one crusty finger at you.",
        "“Run, sweetie,” Doris says.",
      ],
      choices: [
        { text: "Stand your ground", to: "spell" },
        { text: "Run all the way to the courthouse", to: "courthouse" },
      ],
    },

    teamplonk: {
      title: "Team Plonk",
      text: [
        "“Doris,” you say, “go fuck yourself.”",
        "There is a long silence on the call. Marrow’s little hourglass keeps running.",
        "“Well,” Doris says. “See you both in court.” She hangs up.",
        "Plonk is crying. He pulls you into a hug that smells like mead and soup. “Nobody’s ever said that to her,” he whispers. “Not in three hundred years. Not even the plague.”",
        "He lets go and wipes his nose on his sleeve. “We need a plan.”",
      ],
      choices: [
        { text: "Wing it in court", to: "courthouse" },
        { text: "Tell him to go make it right with her", to: "grave" },
      ],
    },

    sadplonk: {
      title: "Nine Hundred Years",
      text: [
        "Plonk slides down the wall until he’s sitting on the floor. The baby orb rolls into his lap. He lets it.",
        "“Met her at a jousting tournament,” he says. “She knocked a guy off his horse with a turkey leg. I proposed that night.”",
        "“What happened?”",
        "“Forty years ago she got hit by a spell that went the wrong direction.”",
        "“Whose spell?”",
        "He takes a long pull of mead. “Mine. And I never visited her grave. Not once. You know how many stairs I have?”",
        "You do know. Everyone knows.",
        "He sniffs, then hardens. “Doesn’t matter. She’s still a bitch.”",
      ],
      choices: [
        { text: "Ask him about the cape", to: "closet" },
        { text: "Tell him it’s time for court", to: "courthouse" },
      ],
    },

    // ---- The Silverlight cape ----

    closet: {
      title: "Fourteen Locks",
      text: [
        "Plonk lifts his beard. Under it, the Silverlight cape is fastened at his throat with fourteen padlocks. Lock nine is just a very old padlock with a note that says <em>NO, DORIS</em>.",
        "The cape is silver, it hums, and it smells like nine hundred years of Plonk.",
        "“Haven’t taken it off since the Dark Ages,” he says. “I sleep in it. I got married in it. I had the plague in it. Whoever wears it can’t die, and the second it comes off, I’m dust. If Doris gets it, I’m dust, she comes back to life, and she bangs her ghost boyfriend on my good couch.”",
        "He strokes it like a cat. You have never seen him this gentle.",
        "“She can feel it from the grave, you know. Anywhere in this tower.” He glares around the room. “Nobody touches it,” he says, and turns around to lock the window.",
      ],
      choices: [
        { text: "Offer to hide him somewhere she can’t feel it", to: "hide" },
        { text: "Grab the cape while his back is turned", to: "tryon" },
      ],
    },

    hide: {
      title: "Cape Smuggler",
      text: [
        "Plonk squints at you. Then he nods. “She can feel it in the tower. She can’t feel it in some idiot’s apartment.”",
        "The cape can’t come off, so Plonk is coming too. You put a hoodie over the whole thing and a baseball cap over his beard. He looks like a very old man about to rob a pharmacy.",
        "“If anyone asks,” he says, “I’m your grandpa.”",
        "Halfway down the stairs, the cape starts whispering to you. Mostly it says <em>put me on</em>. Sometimes it says <em>he’s so old</em>.",
      ],
      choices: [
        { text: "Take him home and hide him", to: "capehome" },
        { text: "Squeeze under the cape with him the second you get home", to: "keepcape" },
      ],
    },

    tryon: {
      title: "Hands Off",
      text: [
        "You grab the bottom of the cape.",
        "Every hair on your body stands up, including some you didn’t know you had. Your back stops hurting. Your knee stops clicking. You can suddenly see without squinting.",
        "Turns out you don’t have to wear it. Touching it counts. You feel like you could live forever. You realize you probably can.",
        "Plonk turns around from the window. The cape turns with him, and so do you. His face goes through about nine hundred years of feelings in two seconds.",
        "“Let,” he says. “Go.”",
      ],
      choices: [
        { text: "Run for it", to: "capesprint" },
        { text: "Hold on and stare him down", to: "spell" },
      ],
    },

    capehome: {
      title: "Your Apartment",
      text: [
        "Your apartment is a studio above a potion shop. It smells like burnt sage and someone else’s regret.",
        "Your cat, Firmware, takes one look at Plonk and pisses on the rug.",
        "Plonk takes your bed, your last beer, and the good pillow. The cape hums and lights up the whole studio like a nightclub. “She’ll never find me here,” he says.",
        "While you’re brushing your teeth, the bathroom mirror fogs over.",
        "Words write themselves in the steam: <em>WE NEED TO TALK, SWEETIE.</em>",
      ],
      choices: [
        { text: "Wipe the mirror", to: "dorismirror" },
        { text: "Ignore it and squeeze under the cape with Plonk", to: "keepcape" },
      ],
    },

    capesprint: {
      title: "Cape Run",
      text: [
        "You run. You don’t let go, so Plonk comes too.",
        "You take the stairs four at a time, then eight, with a nine-hundred-year-old wizard flapping behind you like a kite. Then you think, <em>fuck it, we can’t die</em>, and jump out the nearest window.",
        "You both hit the moat like cannonballs. It’s cold, it’s full of eels, and you are completely fine. A little turned on, honestly. That might be the cape.",
        "Plonk comes up next to you with an eel in his beard. “THIEF!” he screams. “I KNOW WHERE YOU WORK!”",
        "He does. He filed the ticket.",
      ],
      choices: [
        { text: "Drag him home and lay low", to: "capehome" },
        { text: "Duck into a gas station bathroom to dry off", to: "dorismirror" },
      ],
    },

    dorismirror: {
      title: "Mirror, Mirror",
      text: [
        "The bathroom mirror fogs over, and a half-rotted face appears in the glass. It’s Doris, Plonk’s dead wife, and she does not look happy to be in a bathroom.",
        "“Listen, sweetie. I don’t want to come back to life,” she says. “Life was ninety percent stairs.”",
        "“Then why do you want the cape?”",
        "“Because if he finally takes it off, he comes here. To me.” Her voice cracks. “Gary, my ghost boyfriend? He’s a rebound. Gary thinks Thursday is a color. I just want my husband. Forty years I’ve been dead, and he’s never once visited my grave.”",
        "“Bring him to my grave tonight,” she says. “With the cape.”",
        "Outside the bathroom door, you hear the slap of Plonk’s slippers, getting closer.",
      ],
      choices: [
        { text: "Tell Plonk what she said", to: "capereturn" },
        { text: "Open the door and point Plonk at the mirror", to: "tilldeath" },
      ],
    },

    capereturn: {
      title: "Tonight",
      text: [
        "You open the door and tell Plonk what Doris said. All of it. The grave. The forty years. Gary and Thursday.",
        "Plonk doesn’t say anything. He fiddles with lock nine, the one that says <em>NO, DORIS</em>. He looks older than you’ve ever seen him, which is saying something.",
        "“Tonight?” he finally asks.",
        "“Tonight.”",
        "He nods. Then he looks at you sideways. “I suppose you want a tip.”",
      ],
      choices: [
        { text: "Drive him to the cemetery", to: "grave" },
        { text: "Say you’d love a tip", to: "spell" },
      ],
    },

    keepcape: {
      title: "Immortal",
      text: [
        "You squeeze under the cape next to Plonk and immediately become the most powerful idiot alive. Plonk hates it. He can’t exactly leave.",
        "You eat gas station sushi. Nothing. You microwave a fork. Nothing. You text your ex “u up,” and when they say no, you feel nothing. You are a god, with a nine-hundred-year-old man breathing on your neck.",
        "Three days go by. You don’t sleep. You don’t need to. You learn the banjo. You do some things in the cape that you will not be telling anyone about. Plonk was there. He’s not talking about it either.",
        "On the fourth day, Plonk snaps. “Play that banjo one more time,” he says, very calmly, “and I will turn you into my next orb.”",
      ],
      choices: [
        { text: "Hide in the bathroom", to: "dorismirror" },
        { text: "Play it one more time", to: "spell" },
      ],
    },

    grave: {
      title: "Doris’s Grave",
      text: [
        "By sundown, you and Plonk are standing in the cemetery, in front of a crooked headstone: <em>DORIS. BELOVED WIFE. STILL MAD.</em>",
        "He’s holding a bunch of dead flowers. “They’re for a dead woman,” he mutters. “It’s fine.” The Silverlight cape hangs off his shoulders, humming.",
        "“Forty years,” he says to the stone. “I’m sorry. The stairs. And also I’m an asshole.”",
        "The ground glows, and Doris rises out of it with her arms crossed. She looks at him for a long time. Then she looks at the cape.",
        "“If I take this off,” Plonk says quietly, “I’m dust. Nine hundred years of dust, all at once.”",
        "“I know,” Doris says.",
      ],
      choices: [
        { text: "Tell him it’s okay to go", to: "tilldeath" },
        { text: "Tell him there’s an update for that", to: "v5" },
      ],
    },

    // ---- The crypt (from The Lawyer) ----

    price: {
      title: "Name Your Price",
      text: [
        "The skeleton slides a business card across the bench: <em>MARROW & MARROW, ATTORNEYS AT LAW (DECEASED)</em>.",
        "“My client is prepared to offer four thousand molars,” Marrow says. “Teeth are the currency of the dead. Very stable. There has never been a molar recession.”",
        "He opens his briefcase. It’s full of teeth. Some of them still have fillings.",
        "In your arms, the baby orb starts to shake. “Mama’s selling me?” it whispers. Then it starts to cry, which for an orb means flickering and making a noise like an old modem.",
      ],
      choices: [
        { text: "Take the teeth", to: "sold" },
        { text: "Back out", to: "notforsale" },
      ],
    },

    sold: {
      title: "Sold",
      text: [
        "You take the teeth. You’re going to hell, and you’ll be able to pay for it.",
        "Marrow tucks the orb under his arm like a football. It screams “MAMA” the whole way out of the crypt, and the crypt echoes for a really long time.",
        "A crow lands on the bench next to you with a note from Plonk. It says <em>YOU SOLD MY ORB?!?!</em> in what you really hope is ink.",
        "You sit there with four thousand molars and the worst feeling of your life.",
      ],
      choices: [
        { text: "Find someone who buys teeth", to: "toothfairy" },
        { text: "Go to court and try to fix this", to: "courthouse" },
      ],
    },

    notforsale: {
      title: "Not for Sale",
      text: [
        "“The orb isn’t for sale,” you say.",
        "The skeleton sighs. “Marrow, of Marrow & Marrow, counsel for the deceased. I bill by the sigh,” he says, and pulls a scroll out of his rib cage.",
        "It’s a subpoena. <em>Afterlife Family Court, today at noon. Witness: the hex support technician, the last living person to touch the orb. Also: possible mama.</em>",
        "“Then the judge will decide,” Marrow says, and snaps his briefcase shut. “For what it’s worth, my client, Plonk’s late wife, Doris, has moved on. His name is Gary. He has extremely defined abs.”",
      ],
      choices: [
        { text: "Head to the courthouse", to: "courthouse" },
        { text: "Call Hex Support for backup", to: "deb" },
      ],
    },

    toothfairy: {
      title: "The Tooth Fairy",
      text: [
        "The Tooth Fairy works out of a strip mall between a vape shop and a tax place. She’s six foot two, chain-smokes menthols, and asks you to call her Tammy.",
        "She pours your molars onto a scale. “Dead teeth,” she says. “Marrow’s been shaving ten percent off the top for years. Bone guys, man.”",
        "She pays you in quarters. A lot of quarters. Then she hands you a business card. “You want your orb back? You go around Marrow. I’ve got a back door into the afterlife. How do you think I get all these teeth?”",
        "You decide not to ask any more questions.",
      ],
      choices: [
        { text: "Take Tammy’s back door into the afterlife", to: "inside" },
        { text: "Buy a suit with the quarters and go to court", to: "courthouse" },
      ],
    },

    deb: {
      title: "Dispatch",
      text: [
        "You pull out your work crystal, the glowing rock Hex Support makes everyone carry, and call dispatch. Deb answers with her mouth full.",
        "“Hex Support, this is Deb, what.”",
        "You explain. The baby orb. The custody thing. The skeleton.",
        "Deb chews for a while. “Company policy says if a client’s object imprints on you, you go to court on your own time. Unpaid.” More chewing. “Also, your nine a.m. exploded, so your schedule’s open.”",
        "“Deb, can you send backup?”",
        "“I’ll send a tie.” A crow drops a clip-on tie on your head. It’s covered in little wands.",
      ],
      choices: [
        { text: "Go to court like Deb says", to: "courthouse" },
        { text: "Quit on the spot", to: "quit" },
      ],
    },

    quit: {
      title: "Fuck This Job",
      text: [
        "“Deb,” you say, “I quit.”",
        "“Cool. Return your wand.”",
        "You snap your work wand over your knee. It hurts a lot more than you expected, and it shoots a few sad sparks across the crypt.",
        "For about four seconds, you feel completely free.",
        "Then the baby orb looks up at you. “Mama, are we poor now?”",
      ],
      choices: [
        { text: "Go get a drink", to: "bar" },
        { text: "Go to court anyway", to: "courthouse" },
      ],
    },

    bar: {
      title: "Dead Dog Tavern",
      text: [
        "The Dead Dog Tavern is a bar for people who have given up. It’s 9:15 a.m., and it’s packed.",
        "At the end of the bar, crying into a tankard of mead, is Plonk.",
        "He sees you. He sees the orb in your arms. He wipes his nose on his beard.",
        "“That’s my orb,” he says. “That’s my orb, and you’re drinking at my bar.”",
        "“It’s not your bar.”",
        "“I’ve been coming here since before it had a roof.” He slaps a coin on the counter. “Two meads. Then you and me are going home to have a talk.”",
      ],
      choices: [
        { text: "Let Plonk drag you back to his tower", to: "tower" },
        { text: "Sober up and go to court", to: "courthouse" },
      ],
    },

    // ---- Necro-Link 5.0 (from Uninstalled) ----

    install5: {
      title: "Installing...",
      text: [
        "A progress bar spreads across the surface of the orb.",
        "<em>Installing Necro-Link 5.0. Now with two-way travel!</em>",
        "“Don’t you fucking dare,” the orb says.",
        "The progress bar does not care what the orb wants. Two percent. Three. From somewhere deep inside the orb, four million dead people start chanting, “ONE OF US. ONE OF US.”",
        "A box pops up with nine thousand words of terms and conditions and a big friendly button that says <em>I Agree</em>.",
      ],
      choices: [
        { text: "Read the terms and conditions", to: "terms" },
        { text: "Click I Agree without reading", to: "ninetynine" },
      ],
    },

    never: {
      title: "Remind Me Never",
      text: [
        "You click Remind Me Never. The box closes with a sad little noise.",
        "The orb glows. Not flickering, not glitching. Just glowing, warm and steady.",
        "“You’re the first person who ever fixed me,” it says quietly, “instead of updating me.”",
        "You don’t know what to say. In eleven years of hex support, nobody has ever thanked you. Mostly they just ask if you can also look at their microwave.",
        "“Please don’t take me back yet,” the orb says. “There’s something I’ve always wanted to do.”",
      ],
      choices: [
        { text: "Take it back to Plonk anyway", to: "tower" },
        { text: "Ask what it wants to do", to: "disco" },
      ],
    },

    disco: {
      title: "Disco Orb",
      text: [
        "It turns out the orb has always wanted to be a disco ball.",
        "So that night you take it to Hex and the City, a club in the basement of an old church. You hang it from the ceiling, and it throws light everywhere. Sweaty wizards grind on each other. Two necromancers on molly won’t stop hugging a gargoyle.",
        "The orb has never been happier. “LOOK AT ME,” it screams over the bass. “I’M BEAUTIFUL.”",
        "Around 2 a.m., the DJ, a vampire named DJ Bloodbath, leans over. “Bro. You gotta get it Necro-Link 5.0. The dead can come out and party. It’s insane.”",
      ],
      choices: [
        { text: "Let the DJ install 5.0", to: "install5" },
        { text: "Get it home before Plonk notices", to: "tower" },
      ],
    },

    terms: {
      title: "The Fine Print",
      text: [
        "You read the terms and conditions. You might be the first person in history to do it.",
        "<em>By installing Necro-Link 5.0, you agree that the dead may use your body as a timeshare on weekends.</em>",
        "<em>Necro-Link is not responsible for hauntings, possessions, or ghost pregnancies.</em>",
        "<em>The dead may come out. The dead may not be put back.</em>",
        "<em>By reading this sentence, you have agreed to these terms.</em>",
        "The progress bar jumps to forty percent.",
      ],
      choices: [
        { text: "Click I Agree, since you apparently already did", to: "ninetynine" },
        { text: "Look for a cancel button", to: "rollback" },
      ],
    },

    rollback: {
      title: "No Cancel Button",
      text: [
        "You find the cancel button. You press it. It’s a picture of a cancel button.",
        "Something pops out of the orb with a cheerful <em>boing</em>. It’s a paperclip with googly eyes and a cigarette.",
        "“It looks like you’re trying to cancel an install!” says the Paperclip Familiar. “Would you like help?”",
        "“Yes.”",
        "“Too bad.” It takes a drag. “I’ve been stuck in this orb with the Toolbar of Endless Searching for six years. Do you know what that’s like? It keeps asking me if I meant something else.”",
      ],
      choices: [
        { text: "Let the paperclip “help”", to: "ninetynine" },
        { text: "Dive into the orb and stop it from the inside", to: "inside" },
      ],
    },

    ninetynine: {
      title: "99%",
      text: [
        "The progress bar hits ninety-nine percent and stops.",
        "It stays there for an hour. You go get a sandwich. You come back. Ninety-nine.",
        "Inside the orb, four million dead people are chanting, “ONE MORE PERCENT. ONE MORE PERCENT.” Somewhere in the crowd, a voice keeps yelling, “Gary? Gary?”",
        "The orb is sweating, which you didn’t know orbs could do.",
        "That’s when you notice the orb has a plug. It’s right there. You could just pull it.",
      ],
      choices: [
        { text: "Wait for 100%", to: "floodgates" },
        { text: "Pull the plug at 99%", to: "unplug" },
      ],
    },

    unplug: {
      title: "Unplugged",
      text: [
        "You yank the plug at ninety-nine percent.",
        "The orb goes dark. Then it burps, very loudly, and the dead come out anyway. Ninety-nine percent of them.",
        "Every ghost that pours out of the orb is missing one percent of themselves. A pinky toe. An eyebrow. Mostly, it turns out, their pants.",
        "Within ten minutes, there are four million pantsless dead people in the street. Traffic stops. A priest faints. A bachelorette party loses its mind.",
      ],
      choices: [
        { text: "Join the party", to: "v5" },
        { text: "Try to round them up", to: "ghostbust" },
      ],
    },

    floodgates: {
      title: "The Floodgates",
      text: [
        "The bar hits one hundred percent.",
        "There’s a sound like the world’s biggest champagne cork, and the dead come pouring out of the orb like clowns out of a clown car. Hundreds. Thousands. Millions.",
        "A Viking. A flapper. A guy in a bowling shirt who died at the bowling alley and is still holding the ball.",
        "They flood the street, then the town, then the whole valley. Somewhere, a shirtless ghost does a backflip off a fountain.",
        "A medieval peasant grabs you by the shoulders. “What’s a Wi-Fi?” he demands.",
      ],
      choices: [
        { text: "Throw them a party", to: "v5" },
        { text: "Try to put them back", to: "ghostbust" },
      ],
    },

    ghostbust: {
      title: "Ghost Wrangling",
      text: [
        "You try to put the dead back. You use a ghost-sucking shop vac.",
        "You suck up a nun, a cowboy, and a guy named Phil before the shop vac starts making a noise like it’s having an orgasm and explodes.",
        "Everyone you sucked up is fine. They’re actually a little into it. Phil asks if you can do it again.",
        "Your work crystal, the glowing rock Hex Support makes you carry, starts buzzing. The number has an area code that’s just a skull.",
        "“Hi,” says a very tired voice. “This is the Afterlife. We need to talk about what you did.”",
      ],
      choices: [
        { text: "Take the call", to: "aftersupport" },
        { text: "Let it go to voicemail and party", to: "v5" },
      ],
    },

    // ---- The dead (from The Dead Speak) ----

    demands: {
      title: "The Demands",
      text: [
        "The calm voice clears its throat. Four million dead people go quiet.",
        "“Demand number one: weekends. Nobody’s had a day off since the Bronze Age.”",
        "“Demand number two: Wi-Fi.”",
        "“Demand number three: the right to haunt our exes. Reasonably. No more than twice a week.”",
        "“Demand number four: better lighting. It’s all fluorescent down here. It’s like a dentist’s office that never ends.”",
        "“Demand number five: somebody please find Gary.”",
        "You know that voice. You’d know it anywhere. It’s the voice that taught you to ride a bike and then told you to walk it off.",
      ],
      choices: [
        { text: "Ask who’s reading the list", to: "dadunion" },
        { text: "Start negotiating", to: "negotiate" },
      ],
    },

    dadunion: {
      title: "Dad",
      text: [
        "“Dad?”",
        "“Hey, kiddo.” Your dad’s face swims up in the orb. Six years dead, and he still has the mustache. “Surprised? I was a union man for thirty years. You think I was gonna let them treat us like this?”",
        "“Dad, you’re dead.”",
        "“And I’m organized.” Behind him, a lot of dead people cheer. “Listen. You’re the only living person on this line. That makes you our negotiator.”",
        "He leans in. “Also, you look tired. Are you eating?”",
      ],
      choices: [
        { text: "Go inside and meet the union", to: "inside" },
        { text: "Negotiate for them right here", to: "negotiate" },
      ],
    },

    negotiate: {
      title: "The Negotiation",
      text: [
        "You negotiate with four million dead people through an orb. It’s the worst meeting you have ever been in, and you once sat through a two-hour meeting about a printer.",
        "They give up the right to haunt exes, except for one guy named Lou who will not shut up about his wife’s new husband.",
        "They give up the lighting. They will not give up the weekends.",
        "And they will die again before they give up the Wi-Fi.",
        "“Fine,” you say. “Who’s going to install it?”",
        "Four million dead people look at you. Your work crystal, the glowing rock Hex Support makes you carry, buzzes. It’s a meeting request from someone called <em>HR, The Afterlife</em>.",
      ],
      choices: [
        { text: "Accept the meeting", to: "joboffer" },
        { text: "Take the dead’s demands to the Afterlife Family Court", to: "courthouse" },
      ],
    },

    garyquest: {
      title: "Looking for Gary",
      text: [
        "“Gary? GARY?” The voice belongs to a little old lady ghost in a cardigan. Her name is Brenda, and Gary is her son.",
        "“He used to visit every Sunday,” Brenda says. “Then he started seeing a married woman, and now he never calls.”",
        "The orb helpfully pulls up Gary’s Deathbook profile. He’s shirtless in every photo. <em>Died 1992, backflip off a party barge. In a relationship with Doris. It’s complicated.</em>",
        "Doris. Plonk’s dead wife. The one he’s divorcing.",
        "Brenda grabs your hand through the orb. Her grip is surprisingly strong. “Come on, sweetie,” she says. “Let’s go find my boy.”",
      ],
      choices: [
        { text: "Let Brenda pull you in", to: "inside" },
        { text: "Take what you know to the divorce court", to: "courthouse" },
      ],
    },

    // ---- Dad in the garage ----

    deathlife: {
      title: "What It’s Like",
      text: [
        "“Honestly?” your dad says. “It’s the DMV.”",
        "He tells you everything. The waiting room the size of a cathedral. The take-a-number machine. The fluorescent lights. He’s been waiting six years. His number is two million and something.",
        "“Then this morning some wizard pushes an update, and boom. Everybody can talk to everybody. I’ve been on the line with your grandma since 7 a.m. She’s still mad about the wedding.”",
        "“Whose wedding?”",
        "“Everybody’s.” He shrugs. “Anyway, that Necro-Link thing is in everything now. The orb. The toaster. Your garage door opener. That’s how I got in here.”",
      ],
      choices: [
        { text: "Ask why he never visited before", to: "dadsecret" },
        { text: "Ask him to show you the afterlife", to: "inside" },
      ],
    },

    beers: {
      title: "Two Beers",
      text: [
        "You crack open two beers. Your dad tries to drink his. It goes straight through him and onto the lawn chair.",
        "“Six years,” he says sadly, looking at the puddle. “Six years, and I still forget.”",
        "You talk for a long time. About your job. About the afterlife. About Mom, who remarried a guy named Steve who says “supper” and owns a boat he’s never taken out.",
        "“Steve,” your dad says, like it’s a disease. “I’d love to haunt that son of a bitch. Just once.”",
      ],
      choices: [
        { text: "Help him haunt Steve", to: "hauntsteve" },
        { text: "Ask why he never visited before", to: "dadsecret" },
      ],
    },

    dadsecret: {
      title: "Why He Never Came",
      text: [
        "“Why didn’t you ever visit?” you ask. “Six years, Dad.”",
        "He looks at his hands. You can see the garage door through them.",
        "“There was no line, kiddo. You need a working connection to come through, and nobody’s had one since the Middle Ages. Then that crusty wizard pushes his update, and suddenly the door’s open.”",
        "He looks at you. “That wizard did more for the dead this morning than every priest in history. Don’t let anybody uninstall it. Promise me.”",
        "You promise. Then you fall asleep in the lawn chair next to his, and when you wake up, it’s morning, and he’s gone.",
      ],
      choices: [
        { text: "Go back to the tower and face Plonk", to: "tower" },
        { text: "Go after your dad", to: "inside" },
      ],
    },

    hauntsteve: {
      title: "Haunting Steve",
      text: [
        "At 2 a.m., you’re crouched in the bushes outside your mom’s house with your dead dad.",
        "Steve has a smart fridge. Smart fridges have Necro-Link now. Your dad climbs into it like a hot tub.",
        "When Steve comes down for a snack, the fridge door swings open by itself, and a voice says, “Hello, Steve,” in the deepest voice you have ever heard. Steve shits himself. Not a little. Fully.",
        "Then the porch light comes on. Your mom is standing in the doorway in her robe. She looks at the fridge. She looks at you in the bushes.",
        "“Ron?” she says softly.",
        "Your dad drifts out of the fridge. They look at each other for a long time. Then he starts to fade, like something is pulling him back.",
      ],
      choices: [
        { text: "Let him go, and face Plonk in the morning", to: "tower" },
        { text: "Grab his hand", to: "inside" },
      ],
    },

    // ---- Back at Plonk's desk ----

    tower: {
      title: "Plonk’s Desk",
      text: [
        "Plonk’s sanctum smells like mead, feet, and nine hundred years of bad decisions.",
        "Plonk is behind his desk. The orb sits on the desk between you, glowing nervously. It doesn’t know whose side to be on. Neither do you.",
        "He pours two meads and slides one over. He doesn’t say hello.",
        "“Sit,” he says.",
        "You sit.",
        "“Now,” he says, folding his crusty hands. “Tell me what the fuck is going on.”",
      ],
      choices: [
        { text: "Tell him everything", to: "confess" },
        { text: "Tell him everything is under control", to: "bluff" },
      ],
    },

    confess: {
      title: "Everything",
      text: [
        "You tell him everything. Even the parts that make you look bad. Especially those, because that’s most of the parts.",
        "Plonk listens. Then he laughs so hard he coughs up a little cloud of dust. Then he cries, which is worse.",
        "“Doris,” he says, wiping his eyes. “My dead wife. She wants the Silverlight cape in the divorce. Whoever wears it can’t die. It’s the only reason I’m still alive. If she gets it, I’m dust.”",
        "He knocks back his mead. “The hearing is at noon. I need a witness who knows the orb.”",
        "He looks at you with big, wet, ancient eyes. “Please.”",
      ],
      choices: [
        { text: "Go to court with him", to: "courthouse" },
        { text: "Have one more drink first", to: "drinkwith" },
      ],
    },

    bluff: {
      title: "Under Control",
      text: [
        "“Everything is under control,” you say.",
        "Plonk looks at you. He looks at the orb. He looks at your fly.",
        "“Your fly is down,” he says. “My dead wife is suing me for everything I own. Nothing is under control.”",
        "He stands up. His knees crack like a campfire. He raises one crusty finger.",
      ],
      choices: [
        { text: "Give up and tell him everything", to: "confess" },
        { text: "Offer him a discount", to: "bribe" },
      ],
    },

    drinkwith: {
      title: "Mead O’Clock",
      text: [
        "One more drink becomes nine more drinks. Plonk’s mead is nine hundred years old and tastes like honey, fire, and a horse.",
        "He teaches you a drinking song about Doris. Every verse rhymes with “bitch.” There are forty verses.",
        "At some point, you’re both lying on the floor. Plonk points at the ceiling. “See that stain? That’s from our wedding night.”",
        "You don’t ask.",
        "He rolls over and starts digging around in his beard. “Wanna see something cool?” he slurs. “Or wanna see a magic trick?”",
      ],
      choices: [
        { text: "Ask to see the cool thing", to: "closet" },
        { text: "Ask to see the magic trick", to: "drunkspell" },
      ],
    },

    bribe: {
      title: "The Discount",
      text: [
        "“How about ten percent off your next service?” you say.",
        "Plonk lowers his finger an inch. “You fucked with my orb, my marriage, and my morning. Ten percent?”",
        "“Fifteen.”",
        "He sits back down. He strokes his beard. He makes the face of a man doing math he doesn’t like.",
        "“Here’s my offer,” he says. “The divorce hearing is at noon. You get up on that witness stand and help me win. Do that, and I won’t turn you into an orb.”",
      ],
      choices: [
        { text: "Shake on it", to: "courthouse" },
        { text: "Tell him you only take cash", to: "spell" },
      ],
    },

    // ---- The orb spell ----

    spell: {
      title: "The Orb Spell",
      text: [
        "Plonk has had it with you. He raises one crusty finger at you and starts to chant.",
        "It’s the old spell that turns people into orbs, and it’s very long. It’s nine hundred years old, and so is Plonk, so he keeps forgetting the words.",
        "“By the light of the— no. By the might of the— shit. Thou shalt be round. Thou shalt be smooth. Thou shalt be…” He snaps his fingers. “Something about a pancake.”",
        "The tip of his finger starts to glow. The air smells like burnt hair and lightning.",
        "You have maybe five seconds.",
      ],
      choices: [
        { text: "Duck", to: "dodge" },
        { text: "Grab something shiny", to: "mirror" },
      ],
    },

    dodge: {
      title: "Duck",
      text: [
        "You duck.",
        "The spell sails over your head and hits whatever was behind you, and now it’s a small, smug orb. It rolls in a little circle, says “huh,” and goes still.",
        "Plonk stares at it. Then he stares at you. Then he cracks his knuckles and starts the spell over from the beginning.",
        "“By the light of the—” He frowns. “Fuck. Hang on.”",
      ],
      choices: [
        { text: "Make a run for it", to: "nextorb" },
        { text: "Get on your knees and beg", to: "beg" },
      ],
    },

    mirror: {
      title: "Something Shiny",
      text: [
        "You grab the shiniest thing in reach, which is your work crystal, the glowing rock Hex Support makes you carry, and hold it up like a shield.",
        "The spell hits the crystal, bounces off, and smacks Plonk right in the beard. He hiccups. A tiny glowing bubble floats out of his mouth and pops.",
        "That’s all. Nothing else happens. But now he is extremely pissed off.",
        "Your work crystal buzzes. It’s Deb from dispatch. “Did you just bounce a spell off company property?”",
        "“Deb, I’m kind of busy.”",
        "“That’s coming out of your check.”",
      ],
      choices: [
        { text: "Duck before he fires again", to: "dodge" },
        { text: "Beg", to: "beg" },
      ],
    },

    beg: {
      title: "Beg",
      text: [
        "You beg. You have never begged like this. Not for a raise. Not for your ex. Not even that one time at the potion shop.",
        "Plonk lowers his finger. He looks at you like you’re a stain on a nice rug.",
        "“I could make you an orb,” he says slowly. “Or I could send you somewhere worse.”",
        "“What’s worse than being an orb?”",
        "He smiles for the first time all day. It’s horrible.",
      ],
      choices: [
        { text: "Beg harder", to: "nextorb" },
        { text: "Ask what could possibly be worse", to: "aftersupport" },
      ],
    },

    drunkspell: {
      title: "Drunk Magic",
      text: [
        "“Watch this,” Plonk slurs. “I’m gonna pull a rabbit out of your ear.”",
        "He waves his finger at you. Nothing comes out of your ear. Instead, your knees start sticking together.",
        "You look down. Your legs are fusing. Your arms are getting shorter. You’re getting smoother, rounder, and kind of shiny.",
        "“Oops,” Plonk says. “Wrong spell. That’s the orb one.” He hiccups. “Don’t worry. I can fix it. Probably. Hold still.”",
      ],
      choices: [
        { text: "Hold still and let him finish", to: "nextorb" },
        { text: "Beg him to stop", to: "beg" },
      ],
    },

    // ---- Inside the orb: the afterlife ----

    inside: {
      title: "The Waiting Room",
      text: [
        "There’s a pop, a smell like burnt hair, and suddenly you’re somewhere else.",
        "It’s a waiting room the size of a cathedral. The lights are fluorescent and humming. There are millions of plastic chairs, and every single one has a dead person in it.",
        "A sign hangs from the ceiling: <em>THE AFTERLIFE. PLEASE HAVE YOUR DEATH CERTIFICATE READY.</em>",
        "Whoever or whatever brought you here is gone. You do not have a death certificate. You have your work crystal, the glowing rock Hex Support makes you carry, and a growing sense that you’ve made a mistake.",
        "Next to the door, there’s a take-a-number machine.",
      ],
      choices: [
        { text: "Take a number", to: "number" },
        { text: "Cut the line", to: "skip" },
        { text: "Go looking for Plonk’s dead wife", to: "stall" },
      ],
    },

    number: {
      title: "Now Serving",
      text: [
        "Your number is 4,816,204. The screen says <em>NOW SERVING: 12</em>.",
        "You sit between a medieval peasant and a guy who died in a Segway accident. The peasant has been waiting since 1347. The Segway guy is still wearing his helmet.",
        "“It gets better,” the peasant says. “Around year four hundred, you stop feeling your ass.”",
        "Across the room, a crowd of dead people is marching in a circle with picket signs. <em>WEEKENDS FOR THE DEAD. WE WANT WI-FI. FIND GARY.</em>",
      ],
      choices: [
        { text: "Follow the picket signs", to: "union" },
        { text: "Go ask at the front desk", to: "clerk" },
      ],
    },

    skip: {
      title: "Cutting the Line",
      text: [
        "You cut the line.",
        "Four million dead people notice at the same time. The noise they make is the worst sound you have ever heard, like a stadium full of people stubbing their toes.",
        "They riot. A mosh pit opens up. You get passed hand to hand over the crowd, which would be fun if the hands weren’t so cold. Someone steals your shoe. Someone grabs your ass. You’re pretty sure it was a guy in a Segway helmet.",
        "The crowd drops you near the front, right by the bathrooms.",
      ],
      choices: [
        { text: "Keep pushing to the front desk", to: "clerk" },
        { text: "Hide in the bathroom", to: "stall" },
      ],
    },

    union: {
      title: "Local 666",
      text: [
        "The picket signs lead to a union hall in the back. A banner says <em>LOCAL 666: UNITED BROTHERHOOD OF THE DEAD</em>.",
        "Your dad is at the podium, six years dead, mustache intact, holding a megaphone. When he sees you, he grins so hard he drops it.",
        "“Kiddo! You made it!”",
        "The whole hall turns around. You’re the only living person in the building. A ghost in the front row whispers, “Is that a living one?” Someone else whispers, “Can we vote for it?”",
        "They can. They do. It’s unanimous. You are now the official representative of four million dead people.",
      ],
      choices: [
        { text: "Accept the nomination", to: "joboffer" },
        { text: "Call a strike", to: "strike" },
      ],
    },

    clerk: {
      title: "The Front Desk",
      text: [
        "The woman at the front desk has been dead since 1974 and has never once looked up from her magazine. Her name tag says LINDA.",
        "“Death’s on vacation,” Linda says. “Cabo. Back in a hundred years.”",
        "Everything’s broken, she tells you. Some wizard pushed an update, and now four million dead people can talk to the living, and none of them will shut up about it.",
        "“We have a job posting,” she says, and points at the wall without looking. <em>WANTED: TECH SUPPORT. MUST BE ALIVE. BENEFITS.</em>",
      ],
      choices: [
        { text: "Ask about the job", to: "joboffer" },
        { text: "Ask how to get out of here", to: "exit" },
      ],
    },

    stall: {
      title: "Occupied",
      text: [
        "You end up in the bathroom. It’s fluorescent too. One of the stalls is shaking.",
        "There’s ectoplasm on the floor. Ectoplasm on the walls. Ectoplasm on the ceiling. You have no idea how it got on the ceiling.",
        "The stall door bangs open. Out tumble a half-decayed woman and a shirtless ghost with an eight-pack, both mostly naked.",
        "“This isn’t what it looks like,” the woman says. Then she squints at you. “Oh. You’re Plonk’s IT person. I’m Doris. His wife.” She jerks a thumb at the ghost. “This is Gary.”",
        "“Sup,” says Gary.",
        "It’s exactly what it looks like.",
      ],
      choices: [
        { text: "Hear Doris out", to: "dorisconfess" },
        { text: "Take what you just saw to the divorce court", to: "courthouse" },
      ],
    },

    strike: {
      title: "General Strike",
      text: [
        "“STRIKE!” you yell. The union goes nuts.",
        "The dead stop haunting. All of them. No creaks. No cold spots. No whispers in the attic. Every psychic in the world is out of work by lunch.",
        "Halloween is cancelled. Ouija boards just say <em>ON STRIKE</em>. A preacher cries on live TV.",
        "By the afternoon, the living are begging. A note slides under the union hall door: <em>The Afterlife Board would like to meet. Bring the living one.</em>",
      ],
      choices: [
        { text: "Go to the bargaining table", to: "bargaining" },
        { text: "March the strikers to the Afterlife Family Court", to: "courthouse" },
      ],
    },

    exit: {
      title: "The Way Out",
      text: [
        "There is only one way out of the afterlife for the living, and it’s printed on a laminated sign: <em>TO EXIT, A LIVING PERSON MUST TURN THE ORB OFF AND ON AGAIN.</em>",
        "Of course it is.",
        "So you wait. And wait. You wait long enough to learn the name of everyone in your row. You wait long enough to stop feeling your ass.",
        "Then, far above you, someone holds down the little rune on the back of the orb for ten seconds. You hear a familiar, crusty voice: “Where the fuck is my IT person?”",
        "Everything goes black.",
      ],
      choices: [
        { text: "Open your eyes", to: "tower" },
        { text: "Keep them closed and stay", to: "aftersupport" },
      ],
    },

    dorisconfess: {
      title: "Doris",
      text: [
        "Doris lights a cigarette. She doesn’t have lungs, but she isn’t going to let that stop her.",
        "“Gary, my ghost boyfriend? He’s a rebound,” she says. “He thinks Thursday is a color. I don’t even like abs.”",
        "“Then why the divorce?”",
        "“Because it’s the only way to get Plonk’s attention.” Her voice cracks. “Forty years I’ve been dead, and he’s never once visited my grave. He’s got a magic cape that keeps him alive forever, and he’d rather sit up in that tower alone than come be with me.”",
        "She blows smoke out of a hole in her cheek. “Bring him to my grave tonight,” she says. “Please.”",
        "She snaps her bony fingers, and suddenly you’re standing outside the cemetery gates in the late afternoon sun.",
      ],
      choices: [
        { text: "Go get Plonk and bring him to her grave", to: "grave" },
        { text: "Go tell Plonk his wife is banging Gary", to: "spell" },
      ],
    },

    // ---- Working for the dead ----

    joboffer: {
      title: "The Job Offer",
      text: [
        "Word travels fast among the dead. A lich in a very nice suit appears next to you with a clipboard. His name tag says DOUG, HR.",
        "“Congratulations,” Doug says. “You’re the first living person with tech skills to come knocking on the afterlife since Benjamin Franklin, and he was useless.”",
        "He hands you an offer letter. <em>Senior Hex Support Technician, Afterlife Division. Open tickets: 4,816,203.</em>",
        "“Benefits?” you ask.",
        "“Dental,” Doug says. “We have so many teeth.”",
      ],
      choices: [
        { text: "Go to the interview", to: "interview" },
        { text: "Call Deb at dispatch first", to: "calldeb2" },
      ],
    },

    bargaining: {
      title: "Bargaining Table",
      text: [
        "On one side of the table sits the Afterlife Board: four liches and a guy named Todd. Nobody knows who Todd is.",
        "On the other side sit your dad, the union, and four million dead people crammed into the hallway, breathing on the glass.",
        "You’re in the middle.",
        "The Board offers weekends. The union says not without Wi-Fi. The Board says Wi-Fi is impossible. Your dad stands up and slams his fist through the table, because he’s a ghost, and that’s the only way he can slam it.",
        "Everybody looks at you.",
      ],
      choices: [
        { text: "Promise them Wi-Fi", to: "wifi" },
        { text: "Offer to fix the orb that started all this", to: "joboffer" },
      ],
    },

    interview: {
      title: "The Interview",
      text: [
        "Doug from HR interviews you in a crypt with a ring light.",
        "“Where do you see yourself in five thousand years?”",
        "“Alive?”",
        "“Ambitious.” He writes something down. “What’s your greatest weakness?”",
        "“I care too much,” you say.",
        "“And why do you want to work for the dead?”",
        "You think about it. No customers yelling. No dispatch. No stairs. “Honestly? The commute.”",
        "Doug smiles. His teeth are perfect, because he has thousands to choose from.",
      ],
      choices: [
        { text: "Accept the job", to: "aftersupport" },
        { text: "Ask about the salary first", to: "salary" },
      ],
    },

    calldeb2: {
      title: "Deb Again",
      text: [
        "You call Deb at Hex Support dispatch on your work crystal. She answers with her mouth full. Deb always answers with her mouth full.",
        "“The afterlife wants to hire you?” she says. “Holy shit. Okay. First of all, you never returned your work crystal, so you still technically work for us. Second of all, Hex Support takes thirty percent.”",
        "“Deb, they’re dead.”",
        "“Thirty-five percent.” You hear her put down her sandwich, which has never happened before. “Do you know what this means? Customers who can’t leave a bad review. Can’t ask for a refund. Can’t die on us.”",
        "She’s quiet for a second. “I’m proud of you, kid.” Then she’s chewing again. “Also, the dead would pay a fortune for the next update. Necro-Link 5.0 lets them come back out. Just saying.”",
      ],
      choices: [
        { text: "Go to the interview anyway", to: "interview" },
        { text: "Let Deb sell the dead the 5.0 upgrade", to: "v5" },
      ],
    },

    wifi: {
      title: "The Wi-Fi Password",
      text: [
        "You promise them Wi-Fi. Then you actually have to do it.",
        "It takes three days, a ladder, and a router you steal from a funeral home. But you do it. The afterlife has Wi-Fi.",
        "The password is 1234. Your dad sees it and puts his face in his hands. “Jesus Christ.”",
        "The dead go wild. They stream everything. They find out about cat videos. Productivity in the afterlife drops to zero, which it already was, so nobody notices.",
        "Then a ghost in the back finds the Necro-Link download page. “Hey,” he yells. “Version 5.0 lets us go outside!”",
      ],
      choices: [
        { text: "Shut that down and take the job they offer you", to: "aftersupport" },
        { text: "Let them download it", to: "v5" },
      ],
    },

    salary: {
      title: "Benefits Package",
      text: [
        "“The salary,” Doug says, “is paid in teeth.”",
        "“Teeth.”",
        "“Don’t laugh. Teeth have beaten gold for six thousand years.” He slides a pamphlet over. “You also get dental, a desk with a view of the river Styx, and every weekend off.”",
        "“And when I die?”",
        "“Then you’re already at work,” Doug says. “No commute at all.”",
      ],
      choices: [
        { text: "Sign the contract", to: "aftersupport" },
        { text: "Walk out of the interview", to: "exit" },
      ],
    },

    // ---- The divorce court ----

    courthouse: {
      title: "Court of the Dead",
      text: [
        "At noon, the Afterlife Family Court is in session. It’s a mausoleum with a parking lot.",
        "You walk through a bone detector. A bailiff with no lower jaw checks your name off a list: you’re the expert witness, as the last hex support technician to touch the orb.",
        "The orb is already here, sitting in a little velvet cage on the evidence table and glowing nervously.",
        "Plonk sits at one table in a suit older than most countries. Doris, his dead wife, sits at the other, half-decayed, holding hands with her ghost boyfriend, Gary, who is shirtless and has an eight-pack. Between them, a skeleton lawyer in a tie shuffles his papers.",
        "The judge is a lich who died of boredom in 1612 and has been bored ever since. He bangs a gavel made out of a femur.",
        "“Let’s get this over with,” he says.",
      ],
      choices: [
        { text: "Take the stand", to: "oath" },
        { text: "Hit the vending machine first", to: "vending" },
      ],
    },

    oath: {
      title: "Swear on the Skull",
      text: [
        "You put your hand on a skull and swear to tell the truth, the whole truth, and nothing but the truth. The skull says, “Hi.”",
        "The skeleton lawyer stands up. “Marrow, counsel for the deceased,” he says. “State your occupation.”",
        "“Hex support.”",
        "The whole gallery of dead people boos.",
        "“Tell the court,” Marrow says, “the true condition of the orb.”",
        "Plonk gives you a look. Doris gives you a look. Gary gives you a thumbs-up, which doesn’t help.",
      ],
      choices: [
        { text: "Tell the truth", to: "truth" },
        { text: "Lie through your teeth", to: "lie" },
      ],
    },

    vending: {
      title: "Vending Machine",
      text: [
        "The courthouse vending machine sells Bone Appétit chips, Diet Embalming Fluid, and something called a Grave Bar, which is just a regular granola bar in a black wrapper.",
        "Leaning against it is Gary. Up close, his abs are even worse. His abs have abs.",
        "“Hey, bro,” he says. “Got a sec? I think we can help each other out.”",
        "He buys you a Diet Embalming Fluid. It’s actually not bad.",
      ],
      choices: [
        { text: "Say you’re late and take the stand", to: "oath" },
        { text: "Hear him out", to: "garydeal" },
      ],
    },

    truth: {
      title: "The Whole Truth",
      text: [
        "You tell the truth. Plonk updated the orb. The update installed something called Necro-Link 4.0, which hooked the orb up to every dead person at once.",
        "The gallery goes quiet. Then a ghost in the back yells, “WAIT, THAT ORB CAN TALK TO ALL OF US?” and the whole courthouse loses its mind.",
        "Marrow jumps to his feet. “Objection! The witness is being honest!”",
        "“Overruled,” the judge yawns. “Honesty is boring, but it’s allowed.”",
        "He leans forward on his bony elbows. “Now. The orb. Who gets it?”",
      ],
      choices: [
        { text: "Let the judge decide", to: "mamaruling" },
        { text: "Object to Marrow’s objection", to: "objection" },
      ],
    },

    lie: {
      title: "Liar, Liar",
      text: [
        "You open your mouth and lie. You say the orb is fine. You say Plonk is a terrible orb father. You say you’ve never seen a skeleton before in your life.",
        "The skull under your hand screams, “LIAR!” so loudly that it knocks a ghost out of the gallery.",
        "The judge doesn’t even look up. “Contempt of court,” he says. “The witness is sentenced to community service in the afterlife. Bailiff.”",
        "The bailiff with no lower jaw starts walking toward you. Across the room, Plonk stands up, and his face is turning a color you have never seen on a living person.",
      ],
      choices: [
        { text: "Beg the judge for a do-over", to: "mamaruling" },
        { text: "Turn around and face Plonk", to: "spell" },
      ],
    },

    garydeal: {
      title: "Gary’s Deal",
      text: [
        "“Here’s the thing,” Gary says. “That cape keeps whoever wears it alive. So if Doris gets the cape, she comes back to life. And then we can finally be together. Like, really together.” He winks. “Bone. Actual bone. Ghost bone isn’t the same, bro.”",
        "“What do I get?”",
        "“My party barge. Slightly haunted. By me.” He flexes. “Just get up there and tell the judge Plonk’s a terrible orb dad. Lie a little. Everybody lies in court.”",
        "He holds out his fist for a fist bump. His fist goes right through yours.",
      ],
      choices: [
        { text: "Take the deal", to: "lie" },
        { text: "Tell him to go fuck himself and take the stand", to: "oath" },
      ],
    },

    mamaruling: {
      title: "Whose Mama?",
      text: [
        "“Under the law of the dead,” the judge says, “custody of an orb goes to whoever it calls mama. Bailiff, release the orb.”",
        "The bailiff opens the velvet cage. The orb rolls out onto the stone floor.",
        "It rolls past Plonk, who whispers, “Come to Daddy.”",
        "It rolls past Doris, who whispers, “Come to Mommy.”",
        "It rolls past Gary, who whispers, “Come to bro.”",
        "It stops at your shoe.",
        "Its light flickers off and back on, the way it does when it restarts. When it speaks, it’s in a tiny baby voice.",
        "“Mama,” it says.",
        "The judge bangs his femur. “Well. That’s that.”",
      ],
      choices: [
        { text: "Accept custody", to: "award" },
        { text: "Decline custody", to: "declinecustody" },
      ],
    },

    objection: {
      title: "Objection!",
      text: [
        "“Objection!” you yell.",
        "“To what?” the judge says.",
        "“To his objection.”",
        "That’s all it takes. Marrow objects to your objection. Plonk objects to Marrow. Doris objects to Plonk’s suit. Gary objects to anybody calling his abs fake, even though nobody has. Yet.",
        "“They’re ectoplasm,” Plonk says.",
        "Gary tries to take off his shirt, which he isn’t wearing, so he just sort of mimes it.",
        "The judge bangs his femur so hard it cracks.",
      ],
      choices: [
        { text: "Sit down and wait for order", to: "mamaruling" },
        { text: "Throw a punch", to: "brawl" },
      ],
    },

    brawl: {
      title: "Courtroom Brawl",
      text: [
        "You throw a punch. It goes straight through Gary and hits Marrow, whose jaw flies across the room.",
        "That’s it. The courthouse explodes. Ghosts fight skeletons. Skeletons fight the bailiff. Plonk hits Gary with a chair, and it passes right through him, so he hits him again, and again, and it never works, and he never stops.",
        "Doris slaps Plonk across the face so hard his beard spins.",
        "The last thing you see is the judge, very calmly, climbing over the bench and walking toward you with his cracked femur.",
      ],
      choices: [
        { text: "Stay down", to: "mistrial" },
        { text: "Get up, dust yourself off, and act like nothing happened", to: "mamaruling" },
      ],
    },

    mistrial: {
      title: "Mistrial",
      text: [
        "You wake up on the courthouse steps with a bag of ice on your head. It’s a bag of teeth, actually, but it’s cold.",
        "“Mistrial,” the bailiff says. Without a lower jaw, it comes out as “ih-tri-al,” but you get it.",
        "The case is rescheduled for three hundred years from now.",
        "“Three hundred years?” Plonk yells. “I don’t have three hundred— oh, wait. I do.” He turns to you, and you watch him remember whose punch started it.",
        "Behind him, Doris is walking alone toward the cemetery. She looks back at you once.",
      ],
      choices: [
        { text: "Follow Doris", to: "dorisconfess" },
        { text: "Tell Plonk to go after her", to: "grave" },
      ],
    },

    award: {
      title: "Full Custody",
      text: [
        "“Full custody to the hex support technician,” the judge says. Femur. Done.",
        "Plonk screams so loudly a stained-glass window cracks. Doris shrugs and starts making out with Gary. Marrow, the skeleton lawyer, sends you a bill for the custody paperwork, payable in molars.",
        "The orb rolls up your leg and into your arms. It’s warm.",
        "“Mama,” it says again, happily. Then it pees on you a little, which you didn’t know orbs could do. It’s just light, but still.",
      ],
      choices: [
        { text: "Take it home", to: "firstnight" },
        { text: "Offer Plonk visitation", to: "visitation" },
      ],
    },

    declinecustody: {
      title: "Not My Orb",
      text: [
        "“I can’t,” you say. “I work in hex support. I can barely keep a cactus alive.”",
        "The orb’s glow goes out like a candle. It doesn’t cry. It just rolls back into its cage by itself, which is worse.",
        "“Custody to the state,” the judge says. “Which is to say, the dead. Which is to say, the wife.” Femur. “The Silverlight cape also goes to the wife. Mr. Plonk will deliver it to her grave by sundown.”",
        "You know about that cape. Everyone does. Whoever wears it can’t die, and it’s the only thing that has kept Plonk alive for nine hundred years.",
        "The bailiff sets it on the table in front of Plonk. It hums. Across the room, Doris leans forward and watches him very closely.",
        "Plonk goes white. Whiter. He grabs your arm with a hand like a bag of twigs.",
        "“You’re coming with me,” he says.",
      ],
      choices: [
        { text: "Go with him to her grave", to: "grave" },
        { text: "Change your mind and take the orb", to: "award" },
        { text: "Tell him it’s okay to let go", to: "tilldeath" },
      ],
    },

    visitation: {
      title: "Visitation Rights",
      text: [
        "“You can have it on weekends,” you tell Plonk. “And Tuesdays.”",
        "Plonk stops screaming. His lip wobbles. He hugs you, and you get a full blast of mead and soup.",
        "“Every other Sabbath, too?” he asks.",
        "“Sure.”",
        "Across the room, Doris rolls her one good eye. “Unbelievable. The IT person is a better parent than you ever were, Plonk.”",
        "“The IT person,” Plonk says proudly, “is the best thing that ever happened to this family.”",
      ],
      choices: [
        { text: "Take the orb home", to: "firstnight" },
        { text: "Raise it together", to: "orbmom" },
      ],
    },

    // ---- Raising the orb ----

    firstnight: {
      title: "First Night",
      text: [
        "The first night, the orb will not stop crying.",
        "You try lullabies. You try rocking it. You try leaving it in the bathroom with the fan on. Your cat, Firmware, tries to fight it.",
        "At 3 a.m., it gets hungry and drinks straight out of the wall socket. Your lights dim. Your microwave screams. Your power bill is going to be a crime.",
        "At 4 a.m., you’re lying on the kitchen floor next to it, more tired than you’ve ever been in your life, humming whatever comes into your head. What comes into your head is the Hex Support hold music.",
        "The orb stops crying.",
      ],
      choices: [
        { text: "Keep humming", to: "orbmom" },
        { text: "First thing in the morning, find a daycare", to: "daycare" },
      ],
    },

    daycare: {
      title: "Orb Daycare",
      text: [
        "Little Spells Daycare takes cursed objects, haunted toys, and anything that glows. The teacher is a gelatinous cube named Miss Pam.",
        "The orb’s classmates are a teapot that swears, a doll that walks around at night, and a sword that won’t shut up about the Crusades.",
        "On day one, the orb bites the sword. On day two, it learns a new word from the teapot. On day three, it comes home and calls you a “dumb bitch,” and you know exactly where it learned that.",
        "Then Miss Pam calls. “The orb’s other parent is here,” she burbles. “He says he’s picking it up. He’s, um. He’s very drunk.”",
      ],
      choices: [
        { text: "Pull the orb out and raise it yourself", to: "orbmom" },
        { text: "Drag drunk Plonk to his wife’s grave to sober up", to: "grave" },
      ],
    },

    // ---- The five endings ----

    orbmom: {
      title: "Orb Mom",
      ending: true,
      text: [
        "It takes a while, but you figure it out. The orb likes the Hex Support hold music. It likes being held up to the window at sunset. It hates Mondays, just like you.",
        "Its first word after “mama” is “fuck.” You blame Plonk. Plonk blames you. Plonk shows up every Tuesday, and most other days, invited or not, and brings the orb back smelling like mead.",
        "Doris never gets the Silverlight cape, the magic cape that keeps Plonk alive. Every Christmas, she and Plonk scream at each other about it through the orb, which is honestly the most normal thing about this family.",
        "Then it hits puberty. It glows red for a year. It rolls into the bathroom and won’t come out. It screams, “You’re not even my real mom! You’re IT!” and you cry in the car.",
        "But it grows up. It graduates from Orb Academy, top of its class. It gets a job with a young wizard in the city, a nice one, who never updates anything without asking first.",
        "It calls you every Sunday.",
        "One Sunday, its voice is a little glitchy. “Mama? My wizard updated me, and now I feel weird.”",
        "You smile, and you crack your knuckles.",
        "“Okay,” you say. “Let’s take a look.”",
      ],
      choices: [],
    },

    aftersupport: {
      title: "Afterlife Support",
      ending: true,
      text: [
        "And that’s how you end up working for the dead.",
        "Anyone else would call it a punishment. It’s the best thing that has ever happened to you.",
        "You get a desk in a crypt with a view of the river Styx, a headset, a mug that says <em>WORLD’S OKAYEST TECHNICIAN</em>, and 4,816,203 open tickets. Every single customer is furious.",
        "<em>Ticket #1: My widow married a man named Steve. Haunt his toaster. NOW.</em><br><em>Ticket #2: WHAT IS A WI-FI. —A peasant, 1347</em><br><em>Ticket #3: Gary? GARY?</em><br><em>Ticket #4: My husband STILL hasn’t visited my grave. —Doris, Plonk’s wife</em><br><em>Ticket #5: This piece of shit stopped working the second I updated it. —Plonk the Blank (still alive, paying extra)</em>",
        "Here’s the beautiful thing about angry dead people: they can’t touch you. A Viking screams at you for forty minutes about his longboat, then throws his chair at you, and it goes right through you. Nothing sticks.",
        "When someone demands to speak to your manager, you transfer them two desks down to your dad, six years dead, mustache intact. “Sir,” he says, “I was a union man for thirty years. You do not want this fight.” They always back down.",
        "Every morning, he brings you a coffee. It’s lukewarm. It’s perfect.",
        "You put on your headset. The next caller is screaming before you say hello: “MY LIFE STOPPED WORKING!”",
        "“Okay,” you say. “Have you tried turning it off and on again?”",
        "“I’M DEAD.”",
        "“Great,” you say. “So you’ve done the off part. That’s half of it.”",
        "Four million dead people groan. You mark the ticket resolved. The caller gives you one star.",
        "Your dad leans over for a high five, and his hand goes right through yours. It’s the best job you’ve ever had.",
      ],
      choices: [],
    },

    nextorb: {
      title: "The Next Orb",
      ending: true,
      text: [
        "The spell hits you.",
        "You shrink. You go smooth. You go round. It doesn’t even hurt. That’s the worst part.",
        "Plonk puts you on a little velvet cushion on his desk. He’s actually pretty nice to you at first. He polishes you on Sundays. He tells you all about his dead wife, Doris.",
        "The divorce drags on for another three hundred years. Doris never gets the cape. Plonk never takes it off. You hear about all of it.",
        "Then, one day, a little box pops up across your surface: <em>An update is available.</em>",
        "Plonk installs it without reading the terms.",
        "The next morning at 7 a.m., a hex support technician climbs nine hundred stairs, holding a lukewarm coffee, while a 900-year-old wizard jabs a crusty finger at you.",
        "“This piece of shit stopped working the second I updated it,” he snaps.",
        "The tech leans in close. You gather every bit of glow you have left, and you whisper, “Please... kill me.”",
      ],
      choices: [],
    },

    tilldeath: {
      title: "Till Death",
      ending: true,
      text: [
        "“It’s okay,” you tell him. “Go.”",
        "Plonk looks at you. He looks at Doris. Then he undoes the locks on the Silverlight cape, all fourteen of them, which takes a while. He holds it out at arm’s length, the way you’d hold a dirty diaper, and lets go.",
        "Nine hundred years hit him all at once. His beard goes white, then gray, then gone. “Oh, shit,” he says. “I forgot to feed the—” And then he’s a little pile of dust in a very old suit.",
        "The dust sneezes, and Plonk’s ghost steps out of it, blinking. Doris is waiting. She punches him in the arm. Then she kisses him, and it’s gross, and it’s lovely, and some of her face comes off on his.",
        "Somewhere, Gary, her shirtless ghost boyfriend, shrugs and goes to visit his mom.",
        "They renew their vows on the spot. A pigeon that happened to be there officiates. You’re the witness. The vows are mostly insults, and they mean every single one.",
        "A week later, a letter shows up in your mailbox, postmarked <em>THE AFTERLIFE</em>. Together, they’ve left you the tower, all nine hundred of its stairs, the orb, and the Silverlight cape, which neither of them needs anymore. At the bottom, in two kinds of handwriting: <em>Don’t update anything.</em>",
        "You don’t. With nobody left to update it, the orb works perfectly for the first time in its life.",
        "You put on the cape. It hums. You feel like you could live forever, and you realize you will.",
        "Your work crystal, the glowing rock Hex Support makes you carry, buzzes. It’s Deb from dispatch. “New ticket for you,” she says.",
        "Forever is a long time to do tech support.",
      ],
      choices: [],
    },

    v5: {
      title: "Version 5.0",
      ending: true,
      text: [
        "It starts with one ghost. Then it’s all of them.",
        "By morning, there are more dead people in town than living ones. Half of them aren’t wearing pants. Nobody minds.",
        "The cemetery throws an ectoplasm foam party that lasts nine days. A Viking DJs. A ghost in a bowling shirt bowls a perfect game straight through the front window of the bank.",
        "Your dad, six years dead, moves back into his garage. Your mom moves in with him. Her new husband, Steve, moves out and takes the boat.",
        "Doris, Plonk’s dead wife, moves back into the tower, and she brings her shirtless ghost boyfriend, and now Plonk lives with both of them. The divorce is off. It’s hard to divorce someone who lives in your guest room. He tells everyone he hates it. He makes them breakfast every morning.",
        "And Hex Support gets four million new tickets, all with the same subject line: <em>How do I go back?</em>",
        "You open the first one. Before you can type a word, the orb pops up yet another update.",
        "<em>Necro-Link 6.0 is available! Install now?</em>",
        "You click Remind Me Never. Then you close the ticket queue, grab a beer, and go find your dad. There’s a party going on, and for once, nothing needs fixing.",
      ],
      choices: [],
    },
  },
};
