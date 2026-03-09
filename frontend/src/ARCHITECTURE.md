# SHIFT STUDIO v2.0 - ARCHITECTURAL STANDARDS (STRICT MODE)

## 1. THE "NO-INLINE" PROTOCOL
* **Strict Ban:** Do NOT use style={{ ... }} for static styling (colors, padding, margins, fonts).
* **Exception:** Inline styles are permitted ONLY for dynamic, calculated values (e.g., progress bar widths).
* **Enforcement:** If you are typing a hex code (#) or px value in a .jsx file, you are wrong.

## 2. THE SINGLE SOURCE OF TRUTH
* **CSS Variables:** We never use raw hex codes in components; use the variables defined in global.css.
* **Glossary Protocol:** Core UI labels (headers, buttons, status names) must be imported from src/utils/glossary.js.
* **Icon Centralization:** All SVGs must live in src/components/Icons.jsx. Functional components should never contain raw <svg> tags.

## 3. ATOMIC COMPONENT COMPOSITION
* **Extraction Rule:** If a UI element (Chart, Dial, Animated Number) is used in multiple views, it MUST be extracted to src/components/.
* **Logic Separation:** UI components should not perform math. Calculations for margins or totals must live in Contexts or Custom Hooks.

## 4. CSS CLASS NAMING CONVENTION (BEM-ISH)
* **Blocks:** .panel-industrial, .inventory-table.
* **Elements:** .panel-header, .inventory-row.
* **Modifiers:** .panel-industrial.collapsed, .inventory-row.selected.
* **Utility:** Use shared classes from global.css (e.g., .text-muted, .flex-between).

## 5. FILE STRUCTURE
* **src/components/:** Reusable atomic UI elements and global icons.
* **src/context/:** Global state and centralized business logic (The Brain).
* **src/features/:** Grid layouts and feature-specific positioning.
* **src/utils/:** Formatters, validators, and the Glossary.

## 6. CONFIG-DRIVEN UI
* **Interfaces:** Complex structures like Navigation or Tickers must be driven by configuration arrays, not static JSX.
* **Data Flow:** Always import initial states and configuration from src/data/mockData.js.

## 7. INTERACTIVE STACKING & AESTHETIC
* **Industrial Dark:** Maintain the palette (Teal, Blue, Purple) defined in global.css.
* **Hover Priority:** Any element utilizing negative margins for stacking MUST implement a :hover state that elevates the z-index.

## 8. "SELECT-FIRST" DATA ENTRY (The "No-Typing" Policy)
* **Concept:** Text fields are the enemy of clean data and accurate Profit Tracking.
* **Execution:** All inputs for Materials, SOP Actions, and Units of Measure MUST utilize a Dropdown/Select component powered by our Global Dictionary.
* **Exception:** Only use open text fields for custom project names, customer notes, or completely novel items (which should trigger a prompt to add to the Global Dictionary).

## 9. SMART TAXONOMY & TAX AWARENESS
* **Concept:** Data must be structured for immediate business insights and tax preparation.
* **Execution:** Every material must map to a 3-tier taxonomy (Category > Type > Unit). Every expense logged in the Profit Tracker must map to an IRS-standard deduction category.