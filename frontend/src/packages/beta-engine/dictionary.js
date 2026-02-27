/* src/packages/beta-engine/dictionary.js */

export const GLITCHBOT_DICT = {
  UI: {
    NAME: "GLITCH_BOT //",
    BADGE: "[ GLITCH_BOT_Lvl.1 ]", 
    LOGGING: "SAVING YOUR THOUGHTS...", 
    XP_GAIN: "+50 XP GAINED", 
    TRIGGER_LABEL: "BETA_ACTIVE // OPEN HUB",
    INPUT_PLACEHOLDER: "What exactly happened? (Just use plain English)...",
    BTN_SUBMIT: "SEND TO LAB",
    BTN_CANCEL: "NEVERMIND"
  },
  CONTEXT_MAP: {
    "APP": "Shift Studio",
    "DASHBOARD": "the Dashboard",
    "WORKSHOP": "your Projects",
    "INVENTORY": "your Inventory",
    "SETTINGS": "the Settings",
    "HUB: MANIFESTO": "the Manifesto",
    "HUB: LAB": "the Lab",
    "HUB: VAULT": "the Education Vault"
  },
  AGREEMENT: {
    VERSION: "ALPHA EVOLUTION // PHASE 1",
    TITLE: "WELCOME TO THE WORKSHOP",
    SUBTITLE: "CONFIRM YOUR DIRECTIVES",
    CARDS: [
      { id: 1, title: "THE MISSION", text: "Break it. Tell us why it broke. Help us rebuild it.", color: "alert" },
      { id: 2, title: "THE STANDARD", text: "No sugar-coating. We need brutal, actionable feedback.", color: "teal" },
      { id: 3, title: "THE REWARD", text: "Level up GlitchBot and shape the final product.", color: "purple" }
    ],
    CONFIRMATION: "I ACCEPT THE RULES OF ENGAGEMENT.",
    BTN_PENDING: "AWAITING CONFIRMATION...",
    BTN_READY: "START BUILDING"
  },
  INTRO: {
    GREETING: "HI, I AM GLITCH_BOT.",
    LINE_1: "Welcome to the Beta! I am deployed in every Alternative Solutions product to track what works and what breaks.",
    LINE_2: "This is a live construction zone. If a gear grinds, log it. We don't want technical jargon, we just want the truth. Let's build.",
    BUTTON: "GOT IT // DEPLOY BOT",
    TAPE_LABEL: "WARNING: BETA ACTIVE" 
  },
  PROMPTS: {
    START: "Did something about ",
    END: " feel clunky, or did you just have a great idea? Let me know!"
  },
  REACTIONS: {
    OOF: "[ OOF ] Workflow Bump",
    EYESORE: "[ EYESORE ] Looks Weird",
    IDEA: "[ LIGHTBULB ] Bright Idea"
  },
  HUB: {
    TITLE: "BETA COMMAND HUB //",
    EVOLUTION_PHASE: "CURRENT STATE: LEVEL 1", 
    XP_PROGRESS: "340 / 500 XP (NEXT: LVL 2)", 
    TABS: {
      MANIFESTO: "THE MANIFESTO",
      LAB: "THE LAB (FEEDBACK)",
      VAULT: "EDUCATION VAULT"
    },
    // UPGRADED: The Universal Beta Rules
    MANIFESTO: {
      HEADING: "THE ALTERNATIVE BETA PROGRAM",
      BODY_1: "Welcome to the inner circle. Every product built by Alternative Solutions starts right here, in the Beta Engine. You were granted access not just to use the software, but to stress-test it, break it, and help us rebuild it stronger.",
      BODY_2: "This is a competitive proving ground. Your feedback directly impacts the final build, and top contributors earn exclusive rewards. But be warned: Beta access is earned, not given. If you aren't logging unique, actionable feedback, your spot goes to someone who will.",
      RULES_HEADING: "RULES OF ENGAGEMENT //",
      RULES: [
        { id: 1, title: "STRESS TEST IT", desc: "Don't just poke around. Use the system for your actual, daily workflows. Find where it catches." },
        { id: 2, title: "OBJECTIVE TRUTH", desc: "We don't care about personal taste. 'I hate purple' is useless. 'The purple text is unreadable against the dark background' is actionable." },
        { id: 3, title: "NO ECHOES", desc: "Check the Lab before you log. Duplicate feedback earns zero XP. Find new friction points." },
        { id: 4, title: "EARN YOUR KEEP", desc: "Inactive testers are purged. Feed the bot, level up the community, and secure your access." }
      ],
      SIGNATURE: "- Alternative Solutions",
      LORE: {
        TITLE: "OPERATION: ALPHA EVOLUTION",
        SUBTITLE: "MEET YOUR CO-PILOT",
        PARAGRAPH_1: "GlitchBot is deployed into every new application we build. Right now, he is a Level 1 scrap-bot. His only directive is to hunt down bugs, workflow bumps, and your bright ideas.",
        PARAGRAPH_2: "Every time you log a valid transmission, you feed his neural net and earn XP. Our collective mission is to level him up until the software is flawless and he evolves into his final form: The AlphaBot.",
        CALL_TO_ACTION: "Let's raise this bot. Start logging."
      }
    },
    LAB: {
      FEED_TITLE: "COMMUNITY FEEDBACK",
      BOARD_TITLE: "TOP CONTRIBUTORS",
      MOCK_TRANSMISSIONS: [
        { id: 1, user: "@BetaTwin", type: "LIGHTBULB", context: "PROFIT MATRIX", message: "What if the matrix automatically factored in a 10% waste margin for resin?", time: "2 MINS AGO" },
        { id: 2, user: "@CraftyFox", type: "OOF", context: "WORKSHOP", message: "The recipe form takes too many clicks to add a new material.", time: "15 MINS AGO" },
        { id: 3, user: "@ResinKing", type: "EYESORE", context: "DASHBOARD", message: "The neon green clashes with the teal on the inventory alerts.", time: "1 HR AGO" },
        { id: 4, user: "@MakerSpace", type: "LIGHTBULB", context: "INVENTORY", message: "Add a 'quick-duplicate' button for items with similar variants.", time: "2 HRS AGO" }
      ],
      MOCK_LEADERBOARD: [
        { rank: 1, name: "BetaTwin", xp: 2450, badge: "Patch Master" },
        { rank: 2, name: "CraftyFox", xp: 1800, badge: "The Synapse" },
        { rank: 3, name: "ResinKing", xp: 1250, badge: "Static Buster" },
        { rank: 4, name: "MakerSpace", xp: 850, badge: "Mirror Architect" }
      ]
    },
    VAULT: {
      HEADER_TITLE: "SECURE ARCHIVES //",
      MODULES: [
        { id: "mod-1", title: "THE ART OF CRITIQUE", desc: "How to provide brutal, actionable feedback that actually builds better software.", status: "UNLOCKED", type: "doc" },
        { id: "mod-2", title: "AI-THRIVE: PHASE 1", desc: "The Alternative Solutions mindset. Stop surviving. Start thriving alongside the engine.", status: "UNLOCKED", type: "mindset" },
        { id: "mod-3", title: "PROFIT MATRIX: DEEP DIVE", desc: "Understanding the math behind the margins. Master the variables.", status: "UNLOCKED", type: "manual" },
        { id: "mod-4", title: "ARCHITECT'S PLAYBOOK", desc: "Advanced operational strategies for scaling your ecosystem.", status: "LOCKED (LVL 2)", type: "encrypted" }
      ]
    }
  }
};