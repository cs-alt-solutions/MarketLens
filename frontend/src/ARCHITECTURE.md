# MARKETLENS v2.0 - ARCHITECTURAL STANDARDS

## 1. FILE STRUCTURE PROTOCOL
* **`src/styles/global.css`**: THE TRUTH. Contains all variables, typography, reset, buttons, inputs, panels, and shared tables.
* **`src/components/`**: Reusable UI atoms (Icons, StatCards, ProjectCards). If it's used in >1 place, it goes here.
* **`src/features/[feature_name]/`**: 
    * `[Feature].jsx`: Logic and View.
    * `[Feature].css`: strictly for **Grid Layouts** and **Feature-Specific Widgets**. NO global styles here.

## 2. CSS "ZERO REDUNDANCY" RULES
* **Tables:** ALWAYS use `.inventory-table`, `.inventory-row`, `.td-cell`.
* **Panels:** ALWAYS use `.panel-industrial`, `.panel-header`, `.panel-content`.
* **Text:** ALWAYS use `.text-main`, `.text-muted`, `.label-industrial`.
* **Inputs:** ALWAYS use `.input-industrial`.
* **Grid:** ALWAYS use `.radar-grid-layout` for main views.

## 3. COLOR SYSTEM (Theme: Industrial Dark)
* Backgrounds: `var(--bg-app)` (Black), `var(--bg-panel)` (Dark Grey).
* Accents: `var(--neon-cyan)`, `var(--neon-teal)`, `var(--neon-purple)`.
* **Rule:** Never use hex codes for these colors in local files. Always use the variables.

## 4. EXPANSION LOGIC
* **New Feature?** Create a new folder in `features/`.
* **New Global Pattern?** (e.g., a new type of Modal) -> Add to `global.css`.
* **New Widget?** (e.g., a User Avatar) -> Add to `components/`.