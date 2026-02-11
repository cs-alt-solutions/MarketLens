# MARKETLENS v2.0 - ARCHITECTURAL STANDARDS (STRICT MODE)

## 1. THE "NO-INLINE" PROTOCOL
* **Strict Ban:** Do NOT use style={{ ... }} for static styling (colors, padding, margins, fonts).
* **Exception:** Inline styles are permitted ONLY for dynamic, calculated values.
* **Enforcement:** If you are typing a hex code (#) or px value in a .jsx file, you are wrong. Stop. Put it in the CSS.

## 2. THE SINGLE SOURCE OF TRUTH (CSS VARIABLES)
* **Variables Only:** We never use raw hex codes in components.
* **Opacity:** Do not use rgba manually. Use variables defined in global.css.

## 3. COMPONENT COMPOSITION
* **Props over Style:** Do not pass style objects to components. Pass Intent.
* **Logic Separation:** Styles should not live in JavaScript logic variables. Calculate a className instead.

## 4. CSS CLASS NAMING CONVENTION (BEM-ISH)
* **Blocks:** .panel-industrial, .inventory-table
* **Elements:** .panel-header, .inventory-row
* **Modifiers:** .panel-industrial.collapsed, .inventory-row.selected
* **Utility:** Use classes defined in global.css (e.g., .text-muted, .flex-between).

## 5. FILE STRUCTURE
* src/styles/global.css: Variables, typography, and shared component classes.
* src/features/[feature]/[Feature].css: strictly for Grid Layouts and positioning.

## 6. THE "GLOSSARY" PROTOCOL
* **No Hardcoding:** Core UI labels (headers, section titles, status names) must never be hardcoded in .jsx files. 
* **Implementation:** They must be imported from src/utils/glossary.js to allow for rapid rebranding.

## 7. INTERACTIVE STACKING RULES
* **Hover Priority:** Any component utilizing negative margins for "stacking" effects MUST implement a :hover state that elevates the element's z-index.
* **Hitbox Integrity:** Ensure that negative margins do not prevent interaction with lower layers.