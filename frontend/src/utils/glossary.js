/* src/utils/glossary.js */
import { DashboardIcon, WorkshopIcon, Box, Finance, Radar } from '../components/Icons';

export const TERMINOLOGY = {
  // ... [Keeping your existing BOOT, BETA_AGREEMENT, GENERAL, etc.] ...
  BOOT: {
    KERNEL: "GATHERING MATERIALS...",
    MARKET: "SYNCING INVENTORY...",
    SECURE: "ORGANIZING WORKBENCH...",
    ASSETS: "PREPARING TOOLS...",
    GRANTED: "READY TO BUILD."
  },
  BETA_AGREEMENT: {
    TITLE: "Welcome to the Workshop",
    SUBTITLE: "Your space to build, test, and master your craft.",
    THE_PROBLEM_TITLE: "Ditch the Duct-Tape",
    THE_PROBLEM_TEXT: "No more tracking supplies in one place and profits in another. Say goodbye to the chaos.",
    THE_SOLUTION_TITLE: "Seamless Flow",
    THE_SOLUTION_TEXT: "Everything is connected. When your inventory moves, your profit updates instantly.",
    THE_MISSION_TITLE: "Push the Limits",
    THE_MISSION_TEXT: "You're an early builder. Test the boundaries, find the friction, and help us shape the ultimate tool.",
    CONFIRMATION: "I'm ready to build. I understand this is an early-access workspace and features are still evolving."
  },
  GENERAL: {
    APP_NAME: "SHIFT STUDIO",
    VERSION: "v1.0-BETA",
    TAGLINE: "Change your mindset. Master your craft.",
    SYSTEMS_LABEL: "DASHBOARD",
    SAVE: "SAVE PROJECT",
    CLOSE: "CLOSE",
    ID_LABEL: "ITEM ID",
    UNITS: "UNITS",
    CATEGORY: "CATEGORY",
    ADD: "ADD ITEM",
    BRAND: "BRAND",
    DELETE: "DELETE",
    CANCEL: "CANCEL",
    TYPE_SEARCH: "Start typing to search...",
    NO_DATA: "No data available yet.",
    ANALYZE: "VIEW DETAILS",
    UNKNOWN: "UNKNOWN",
    CONFIRM: "CONFIRM"
  },
  // 🚀 NEW: The Wizard Identity
  WIZARD: {
    TITLE: "Let's build something. 🚀",
    SUBTITLE: "Every great solution starts with a solid foundation.",
    STEP_1: "The Spark",
    STEP_2: "Product Build",
    STEP_3: "Fulfillment",
    STEP_4: "Check-In"
  },
  // ... [Keeping your existing DASHBOARD, STATUS, FINANCE, etc.] ...
  DASHBOARD: {
    TELEMETRY: "STATUS",
    LIVE_FEED: "CURRENT INVENTORY",
    MARKET_PULSE: "MARKET OVERVIEW",
    SYNC: "SHOP SYNC",
    LOAD: "DATA LOADED"
  },
  STATUS: {
    ACTIVE: "IN PRODUCTION",
    DRAFT: "DRAFT",
    IDEA: "IDEA",
    COMPLETED: "CATALOGED",
    ON_HOLD: "ON HOLD", 
    LOW_STOCK: "RUNNING LOW",
    OUT_OF_STOCK: "OUT OF STOCK",
    STOCKED: "STOCKED",
    LOW: "LOW",
    DORMANT: "INACTIVE",
    HALTED: "CANNOT MAKE (MISSING MATERIALS)",
    READY_TO_BUILD: "READY TO MAKE",
    MISSING_INFO: "NEEDS DETAILS"
  },
  FINANCE: {
    HEADER: "PROFIT TRACKER",
    SUBTITLE: "Track your income and expenses",
    NET: "NET PROFIT",
    LIVE_STATUS: "LIVE",
    REVENUE: "TOTAL SALES",
    EXPENSE: "TOTAL EXPENSES",
    MARGIN_AVG: "AVG PROFIT MARGIN",
    REVENUE_CHART: "SALES OVER TIME",
    TREND: "GROWTH",
    LEDGER: "RECENT TRANSACTIONS",
    DATE: "DATE",
    DESC: "DESCRIPTION",
    AMOUNT: "AMOUNT",
    EMPTY_LEDGER: "No transactions recorded yet.",
    LOG_SALE: "LOG SALE",
    RECORD_SALE: "RECORD SALE",
    QTY_SOLD: "QUANTITY SOLD",
    EXPECTED_REVENUE: "EXPECTED REVENUE",
    TRANSACTION_DATE: "DATE",
    LEDGER_HEADER: "MASTER LEDGER"
  },
  FINANCIAL: {
    NEW_TRANSACTION: "New Transaction",
    EDIT_TRANSACTION: "Edit Transaction",
    DESCRIPTION: "Description",
    AMOUNT: "Amount",
    TYPE: "Type",
    INCOME: "Income",
    EXPENSE: "Expense",
    SAVE: "Save",
    UPDATE: "Update",
    CANCEL: "Cancel",
    DESC_PLACEHOLDER: "e.g. Sale, Supply Run",
    AMOUNT_PLACEHOLDER: "0.00",
    RECURRING_HEADER: "FIXED COSTS & SUBSCRIPTIONS",
    MONTHLY_BURN: "MONTHLY BURN RATE",
    ADD_RECURRING: "ADD FIXED COST",
    CYCLE: "BILLING CYCLE",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
    SAVE_RECURRING: "SAVE COST"
  },
  WORKSHOP: {
    HUB_HEADER: "MY PROJECTS",
    HUB_SUBTITLE: "Manage your active products and new ideas",
    ACTIVE_OPS: "ACTIVE PRODUCTS",
    NEW_PROJECT: "NEW PROJECT",
    VAULT_HEADER: "ARCHIVE",
    BOM_HEADER: "BILL OF MATERIALS",
    BOM_SECTION_CORE: "CORE MATERIALS",
    BOM_SECTION_PACKAGING: "PACKAGING & FULFILLMENT",
    REF_VISUAL: "PRODUCT PHOTO",
    TARGET_RETAIL: "RETAIL PRICE",
    LAST_EDIT: "LAST UPDATED",
    TAB_FLEET: "ACTIVE LINEUP",
    TAB_LAB: "DRAFTS & IDEAS",
    MISSING: "TO DO:",
    CAN_BUILD: "CAN MAKE:",
    ASSEMBLY_GUIDE: "ASSEMBLY GUIDE (SOP)",
    STEP_PLACEHOLDER: "Step description...",
    LABEL_SIZE: "LABEL SIZE",
    HEX_COLOR: "HEX COLOR",
    PRIMARY_FONT: "PRIMARY FONT",
    MAKER_NOTES: "MAKER NOTES",
    BRAND_SPECS: "BRAND & LABEL SPECS",
    // 🚀 NEW GREMLIN ADDITIONS:
    VIEW_KANBAN: "Pipeline View",
    VIEW_FOCUS: "Focus View",
    BTN_LAUNCH_WIZARD: "LAUNCH THE SPARK",
    LABEL_IDEAS: "IDEAS",
    LABEL_DRAFTS: "DRAFTS",
    LABEL_ACTIVE: "ACTIVE",
    COL_IDEAS: "THE INCUBATOR (Ideas)",
    COL_DRAFTS: "THE PROVING GROUNDS (Drafts)",
    COL_ACTIVE: "PRODUCTION (Active)"
  },
  INVENTORY: {
    HEADER: "INVENTORY & LOGISTICS",
    MANIFEST_LABEL: "ALL MATERIALS",
    NOTIFICATIONS: "ALERTS",
    VALUE_LABEL: "TOTAL INVENTORY VALUE",
    SECTION_WORKSHOP: "MAKING SUPPLIES",
    SECTION_LOGISTICS: "SHIPPING & FULFILLMENT",
    INTAKE: "ADD NEW MATERIAL",
    ASSET_DETAILS: "SUPPLY DETAILS",
    VAULT_ACCESS: "BROWSE BY CATEGORY",
    RESTOCK: "RESTOCK EXISTING ITEM",
    SELECT_ASSET: "SELECT ITEM",
    MATERIAL_NAME: "ITEM NAME",
    ADD_QTY: "QUANTITY TO ADD",
    TOTAL_COST: "TOTAL COST OF PURCHASE",
    UNIT_PRICE: "COST PER UNIT",
    HISTORY_LOG: "RESTOCK HISTORY",
    PHOTO_LABEL: "ITEM PHOTO",
    CONSOLE_HEADER: "MANUFACTURING CONSOLE",
    TAB_ASSETS: "MATERIALS",
    TAB_VENDORS: "SUPPLY CHAIN",
    TAB_LOGISTICS: "LOGISTICS",
    VALUE_PREFIX: "Value: ",
    CAPACITY_PREFIX: "Capacity: ",
    ACTION_LOG_SALE: "Log Sale",
    ACTION_ADD_VENDOR: "Add Vendor",
    ACTION_ADD_ITEM: "Add Item",
    FILTER_SHOW: "SHOW:",
    FILTER_SORT: "SORT:",
    SORT_GROUPED: "Group by Category",
    SORT_A_Z: "A to Z",
    SORT_Z_A: "Z to A",
    SORT_QTY_DESC: "Stock High",
    SORT_QTY_ASC: "Stock Low",
    ALL_CATEGORIES: "All Categories",
    PENDING_FULFILLMENT: "PENDING FULFILLMENT",
    GET_LABEL: "GET LABEL",
    SHIP_NOW: "SHIP NOW",
    SHIPPING_SUPPLIES: "Shipping Supplies",
    EMPTY_SHIPPING: "Shipping queue is empty. Ready for new orders.",
    DETAILS_TITLE: "Details",
    SELECT_PROMPT: "Select Item",
    SUPPLIED_BY: "SUPPLIED BY",
    NO_VENDOR: "NO VENDOR LINKED",
    STOCK_HISTORY: "Stock History",
    NO_HISTORY: "No history logged.",
    MODAL_EDIT_ITEM: "EDIT ITEM",
    MODAL_ADD_VENDOR: "ADD VENDOR",
    MODAL_ADD_MATERIAL: "ADD MATERIAL",
    MODAL_LOG_SALE: "LOG SALE",
    FILTERS: {
      ALL: "ALL",
      ACTIVE: "ACTIVE",
      DORMANT: "INACTIVE"
    }
  },
  VENDOR: {
    ADD_VENDOR: "ADD VENDOR",
    WEBSITE: "WEBSITE",
    LEAD_TIME: "AVG LEAD TIME",
    CONTACT_INFO: "CONTACT INFO",
    NOTES: "SOURCING NOTES",
    RELIABILITY: "RELIABILITY SCORE",
    URL_PLACEHOLDER: "https://..."
  },
  BLUEPRINT: {
    PHASE_PLAN: "1. THE IDEA",
    PHASE_BUILD: "2. MATERIALS & BUILD",
    PHASE_LAUNCH: "3. PRICING & LAUNCH",
    MARKET_RESEARCH: "TARGET MARKET",
    AUDIENCE: "WHO IS THIS FOR?",
    INSPIRATION: "INSPIRATION & IDEAS",
    NOTES: "MAKER NOTES",
    VISUAL_CONCEPTS: "MOOD BOARD",
    CONCEPT_PLACEHOLDER: "DROP REFERENCE PHOTOS HERE",
    PRODUCTION_CONSOLE: "MAKE A BATCH",
    STOCK: "CURRENTLY IN STOCK",
    BATCH: "HOW MANY ARE YOU MAKING?",
    RUN: "LOG PRODUCTION",
    PROFIT_SIMULATOR: "PROFIT CALCULATOR",
    RETAIL: "RETAIL PRICE",
    PROFIT: "PROFIT PER ITEM",
    MARGIN: "PROFIT MARGIN",
    LAUNCH_CHECKLIST: "PRE-LAUNCH CHECKLIST",
    PHOTOS: "PHOTOS TAKEN",
    DESCRIPTION: "DESCRIPTION WRITTEN",
    TAGS: "SEO TAGS ADDED",
    RAW_MATERIALS: "Material Cost:",
    PLATFORM_FEES: "Est. Fees:",
    SHIPPING_LABEL: "Shipping Cost:",
    ADD_MATERIAL: "-- Select a Material --",
    ACTIVATE_PROJECT: "ACTIVATE PROJECT",
    REQ_TITLE: "TITLE",
    REQ_BOM: "MATERIALS",
    REQ_SOP: "SOP",
    REQ_PRICE: "PRICE",
    READY_TO_ACTIVATE: "READY TO LAUNCH",
    MISSING_REQS: "MISSING TO LAUNCH:"
  },
  MARKET: {
    HEADER: "COMPETITION TRACKER",
    SUBTITLE: "Keep an eye on the market",
    SCANNING: "UPDATING...",
    TARGET: "ADD COMPETITOR",
    TARGET_NAME_LABEL: "SHOP / BRAND NAME",
    TARGET_PLACEHOLDER: "Enter brand name...",
    TARGET_PRICE_LABEL: "THEIR PRICE",
    PULSE_HEADER: "MARKET OVERVIEW",
    AVG_PRICE: "AVG MARKET PRICE",
    DEMAND: "MARKET DEMAND",
    SATURATION: "MARKET SATURATION",
    TICKER_LABEL: "STREET PRICES"
  },
  LOGISTICS: {
    TAB: "SHIPPING CAPACITY",
    CAPACITY: "MAX SHIPPABLE ORDERS",
    BOTTLENECK: "SUPPLY BOTTLENECK",
    STATUS: {
        READY: "READY TO SHIP",
        HALTED: "NEED SHIPPING SUPPLIES"
    },
    SIM: "CURRENT SHIPPING INVENTORY"
  }
};

export const APP_CONFIG = {
  PROJECT: {
    DEFAULT_STATUS: 'draft',
    STOCK_THRESHOLD: 10,
    INITIAL_DEMAND: TERMINOLOGY.GENERAL.UNKNOWN,
    INITIAL_COMPETITION: TERMINOLOGY.GENERAL.UNKNOWN
  },
  INVENTORY: {
    // Ensuring your keywords from below match the logistics array!
    LOGISTICS: ['Packaging', 'Shipping', 'box', 'mailer', 'label', 'tape'],
    WORKSHOP: ['Raw Material', 'Consumables', 'Hardware', 'Electronics', 'Tools']
  },
  // 🚀 NEW: The Agentic API Blueprint
  ENDPOINTS: {
    SHOPIFY: {
      url: "https://{store_name}.myshopify.com/admin/api/2026-01/graphql.json",
      nodes: ["InventoryLevel", "OrderTransaction"]
    },
    ETSY: {
      url: "https://api.etsy.com/v3/application/",
      nodes: ["updateListingInventory", "ledger-entries"]
    },
    AMAZON: {
      url: "SP-API",
      nodes: ["FBA Inventory API", "Finances API"]
    },
    EBAY: {
      url: "https://api.ebay.com/sell/fulfillment/v1",
      nodes: ["getOrders"]
    },
    TIKTOK: {
      url: "Partner API v2",
      nodes: ["Order Statement Transactions", "is_on_hold_order"]
    }
  }
};

export const NAV_LINKS = [
  { id: 'dashboard', label: 'SYSTEMS_LABEL', Icon: DashboardIcon },
  { id: 'workshop', label: 'HUB_HEADER', Icon: WorkshopIcon, category: 'WORKSHOP' },
  { id: 'inventory', label: 'HEADER', Icon: Box, category: 'INVENTORY' },
  { id: 'matrix', label: 'HEADER', Icon: Finance, category: 'FINANCE' },
  { id: 'radar', label: 'HEADER', Icon: Radar, category: 'MARKET' }
];

export const CATEGORY_KEYWORDS = {
  'Raw Material': ['wax', 'oil', 'fragrance', 'scent', 'soy', 'beeswax', 'dye', 'pigment'],
  'Packaging':    ['jar', 'bottle', 'lid', 'label', 'sticker', 'bag', 'pouch', 'tin'],
  'Shipping':     ['box', 'mailer', 'bubble', 'tape', 'packing', 'peanut', 'wrap'],
  'Hardware':     ['wick', 'screw', 'nail', 'rod', 'wire', 'bracket', 'hinge'],
  'Consumables':  ['glue', 'stain', 'paint', 'varnish', 'sandpaper', 'towel', 'glove'],
  'Tools':        ['hammer', 'drill', 'mold', 'pitcher', 'thermometer', 'scale'],
  'Electronics':  ['led', 'battery', 'switch', 'sensor', 'chip', 'board']
};

export const COMMON_ASSETS = [
  "Soy Wax (Golden Brands 464)",
  "Beeswax (Yellow Pellets)",
  "8oz Amber Glass Jar",
  "16oz Straight Sided Jar",
  "CD-12 Cotton Wick",
  "ECO-14 Wick",
  "Santal & Coconut Fragrance",
  "Lavender & Driftwood Fragrance",
  "Small Shipping Box (6x6x6)",
  "Medium Shipping Box (10x10x4)",
  "Kraft Warning Labels",
  "Black Screw-on Lid",
  "Digital Scale Calibration Weight"
];

export const MARKET_TICKER_DATA = [
  { id: 1, symbol: 'SOY WAX (464)', trend: 'up', value: '$45.00/50lb', change: '+1.2%' },
  { id: 2, symbol: 'BEESWAX', trend: 'down', value: '$18.50/lb', change: '-0.5%' },
  { id: 3, symbol: '8oz JARS', trend: 'flat', value: '$12.00/doz', change: '0.0%' },
  { id: 4, symbol: 'SHIPPING BOXES', trend: 'up', value: '$0.85/ea', change: '+4.1%' },
  { id: 5, symbol: 'FRAGRANCE OIL', trend: 'up', value: '$22.00/16oz', change: '+2.4%' }
];

export const DASHBOARD_STRINGS = {
  telemetryTitle: "KEY METRICS",
  quickActions: "QUICK COMMANDS",
  bottleneckRadar: "PRODUCTION ALERTS",
  dailyBriefing: "ACTION ITEMS",
  draftRunway: "R&D PIPELINE",
  profitMonitor: "PROFIT VELOCITY",
  actionIntake: "ADD MATERIAL",
  actionLogSale: "LOG SALE",
  actionNewProject: "NEW PROJECT",
  statusBlocked: "PRODUCTION BLOCKED",
  statusOnTrack: "ON TRACK",
  runwayIdea: "IDEA",
  runwaySOP: "SOP BUILT",
  runwayPriced: "PRICED",
  runwayReady: "READY TO LAUNCH",
  emptyAlerts: "PRODUCTION LINES CLEAR // NO SHORTAGES",
  emptyBriefing: "ALL CAUGHT UP // NO PENDING ACTIONS",
  bentoSales: "DAILY SALES VELOCITY",
  bentoAlerts: "STOCK & LOGISTICS ALERTS",
  bentoMilestones: "ACTIVE PROJECT MILESTONES",
  bentoProfit: "MARGIN INTELLIGENCE",
  // 🚀 NEW GREMLIN ADDITIONS:
  prioritySetup: "PRIORITY: SETUP",
  addFirstMaterial: "Add your first material to begin.",
  btnStart: "START",
  actionProduction: "ACTION: PRODUCTION",
  craftPrefix: "Craft",
  actionLogistics: "ACTION: LOGISTICS",
  restockPrefix: "Restock",
  btnMarkDone: "MARK DONE"
};

// 🚀 NEW GLOBALS FOR ALERTS & CONFIRMATIONS:
export const MESSAGES = {
  CONFIRM_DELETE_PROJECT: "Are you sure you want to delete this project? This action cannot be undone.",
  EMPTY_PIPELINE_PHASE: "No projects in this phase. Start a new Spark.",
  EMPTY_FLEET: "No active projects in the fleet. Time to launch something.",
  EMPTY_LAB: "No drafts or ideas currently in the lab."
};