# BETA ENGINE: The "Alphabet" Community Ecosystem

## VISIONARY BRIEF
This package was architected by Alternative Solutions. It is a fully encapsulated, framework-agnostic community feedback loop. It is designed to shift users from "customers" to "Co-Creators" by providing an interactive, gamified feedback experience via the "GlitchBot" and the "Beta Hub."

**Core Philosophy:** Perspective is power. A single perspective cannot build the most efficient app. This engine captures the missing half of the machine.

---

## 1. MANDATORY PACKAGE RULES (THE LAW)
To maintain the integrity and portability of this package, the following rules are absolute:

1. **Total Isolation:** This package MUST NOT import anything from outside its own folder (e.g., do not import from `src/utils/glossary.js`). It must survive completely on its own.
2. **Single Source of Truth:** Absolutely NO hardcoded text in the JSX. Every single string, label, and prompt must live in `src/packages/beta-engine/dictionary.js`.
3. **No Inline Styles:** All styling is strictly handled by `GlitchBot.css` and `BetaHub.css`. 
4. **Context Awareness:** The GlitchBot must always be fed the `currentContext` prop so it knows exactly what the user is looking at.
5. **Component Structure:** The Beta Hub must remain a modular shell, with tab contents separated into the `tabs/` directory.

---

## 2. FILE STRUCTURE
```text
src/packages/beta-engine/
│
├── README.md           // This architectural blueprint
├── dictionary.js       // The Single Source of Truth for all text/data
├── GlitchBot.jsx       // The state manager for the bot
├── GlitchBot.css       // Styling and glitch/jitter animations
├── BetaHub.jsx         // The "War Room" overlay shell
├── BetaHub.css         // Styling and evolution bar logic
├── BetaTrigger.jsx     // The encapsulated launch button
├── BetaTrigger.css     // Trigger glow animations
│
├── components/         // Internal Bot Modules
│   ├── BotCore.jsx     // Visual SVG/Div rendering
│   ├── BotIntro.jsx    // Full-screen onboarding hook
│   └── DialogueMenu.jsx// Feedback matrix popup
│
└── tabs/               // Modular Hub content 
    ├── ManifestoTab.jsx
    ├── LabTab.jsx
    └── VaultTab.jsx