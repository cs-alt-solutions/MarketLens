/* src/utils/glossary.js */
import { DashboardIcon, WorkshopIcon, Box, Finance, Radar } from '../components/Icons';

export const TERMINOLOGY = {
  BOOT: {
    KERNEL: "LOADING WORKSPACE...",
    MARKET: "SYNCING DATA...",
    SECURE: "PREPARING DASHBOARD...",
    ASSETS: "LOADING INVENTORY...",
    GRANTED: "WELCOME BACK."
  },
  GENERAL: {
    APP_NAME: "SHIFT STUDIO",
    VERSION: "v2.2",
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
    UNKNOWN: "UNKNOWN"
  },
  DASHBOARD: {
    TELEMETRY: "AT A GLANCE",
    LIVE_FEED: "CURRENT INVENTORY",
    MARKET_PULSE: "MARKET OVERVIEW",
    UPTIME: "SYSTEM ACTIVE",
    SYNC: "SHOP SYNC",
    LOAD: "DATA LOADED"
  },
  STATUS: {
    ACTIVE: "IN PRODUCTION",
    DRAFT: "DRAFT",
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
    EMPTY_LEDGER: "No transactions recorded yet."
  },
  WORKSHOP: {
    HUB_HEADER: "MY PROJECTS",
    HUB_SUBTITLE: "Manage your active products and new ideas",
    ACTIVE_OPS: "ACTIVE PRODUCTS",
    NEW_PROJECT: "NEW PROJECT",
    VAULT_HEADER: "ARCHIVE",
    BOM_HEADER: "MATERIALS NEEDED",
    REF_VISUAL: "PRODUCT PHOTO",
    TARGET_RETAIL: "RETAIL PRICE",
    LAST_EDIT: "LAST UPDATED",
    TAB_FLEET: "ACTIVE LINEUP",
    TAB_LAB: "DRAFTS & IDEAS",
    MISSING: "TO DO:",
    CAN_BUILD: "CAN MAKE:"
  },
  INVENTORY: {
    HEADER: "SUPPLIES & INVENTORY",
    MANIFEST_LABEL: "ALL MATERIALS",
    NOTIFICATIONS: "ALERTS",
    VALUE_LABEL: "TOTAL INVENTORY VALUE",
    SECTION_WORKSHOP: "MAKING SUPPLIES",
    SECTION_LOGISTICS: "PACKAGING & SHIPPING",
    INTAKE: "ADD NEW SUPPLY",
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
    FILTERS: {
      ALL: "ALL",
      ACTIVE: "ACTIVE",
      DORMANT: "INACTIVE"
    }
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
    ADD_MATERIAL: "-- Select a Material --"
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
    SATURATION: "MARKET SATURATION"
  },
  LOGISTICS: {
    TAB: "SHIPPING SUPPLIES",
    CAPACITY: "MAX ORDERS WE CAN SHIP",
    BOTTLENECK: "WE WILL RUN OUT OF:",
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
    LOGISTICS: ['Packaging', 'Shipping'],
    WORKSHOP: ['Raw Material', 'Consumables', 'Hardware', 'Electronics', 'Tools']
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
    { label: "SOY WAX", trend: "up", value: "$2.15/lb" },
    { label: "FRAGRANCE OIL", trend: "neutral", value: "$18.50/lb" },
    { label: "SHIPPING (DOMESTIC)", trend: "down", value: "$4.20/avg" },
    { label: "BEESWAX", trend: "up", value: "$8.50/lb" },
    { label: "GLASS JARS (8oz)", trend: "neutral", value: "$0.85/ea" },
    { label: "WICKING (CD-12)", trend: "down", value: "$0.05/ea" }
];