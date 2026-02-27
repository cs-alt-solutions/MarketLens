/* src/packages/beta-engine/dictionary.js */

export const GLITCHBOT_DICT = {
  UI: {
    NAME: "GLITCH_BOT //",
    BADGE: "[ GLITCH_BOT_v1.0 ]",
    LOGGING: "LOGGING PERSPECTIVE...",
    XP_GAIN: "+50 XP TO ALPHA EVOLUTION",
    TRIGGER_LABEL: "BETA_ACTIVE // OPEN HUB"
  },
  INTRO: {
    GREETING: "HI, I AM GLITCH_BOT.",
    LINE_1: "Welcome to Shift Studio. I am here to help keep track of the things that need to be fixed.",
    LINE_2: "This is a new product, which means some gears might grind. We are aware, but we need your perspective to get things moving smoothly.",
    BUTTON: "ACKNOWLEDGE // DEPLOY BOT"
  },
  PROMPTS: {
    START: "My sensors are tingling. Did something about the ",
    END: " feel off, or did you just have a genius idea? Spit it out!"
  },
  REACTIONS: {
    OOF: "[ OOF ] System Friction",
    EYESORE: "[ EYESORE ] Visual Distortion",
    IDEA: "[ LIGHTBULB ] Neural Spark"
  },
  HUB: {
    TITLE: "BETA COMMAND HUB //",
    EVOLUTION_PHASE: "ALPHA EVOLUTION PROGRESS",
    TABS: {
      MANIFESTO: "THE MANIFESTO",
      LAB: "THE LAB (FEEDBACK)",
      VAULT: "EDUCATION VAULT"
    },
    MANIFESTO: {
      HEADING: "THE TWIN PERSPECTIVE",
      BODY_1: "I built the engine, but you are behind the wheel. If the steering feels tight, or the dashboard is blurry, tell me. Your perspective is the missing half of this machine.",
      BODY_2: "We do not do 'hurt feelings' here. We do 'Better Builds.' If a gear is grinding, calling it 'pretty' doesn't fix the machine. Be brutally honest. Be precise.",
      SIGNATURE: "- The Visionary & The Builder"
    },
    LAB: {
      FEED_TITLE: "LIVE TRANSMISSIONS",
      BOARD_TITLE: "TOP ARCHITECTS",
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
    }
  }
};