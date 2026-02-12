/* src/utils/glossary.js */
import { DashboardIcon, WorkshopIcon, Box, Finance, Radar } from '../components/Icons';

export const TERMINOLOGY = {
  // ... existing sections ...
  BOOT: {
    KERNEL: "WAKING SYSTEMS...",
    MARKET: "SYNCING MARKET DATA...",
    SECURE: "SECURING WORKSPACE...",
    ASSETS: "LOADING ASSETS...",
    GRANTED: "WELCOME BACK."
  },
  GENERAL: {
    APP_NAME: "SHIFT STUDIO",
    VERSION: "v2.2",
    SYSTEMS_LABEL: "DASHBOARD",
    SAVE: "SAVE WORK",
    CLOSE: "EXIT",
    ID_LABEL: "REF-ID",
    UNITS: "UNITS",
    CATEGORY: "CATEGORY",
    ADD: "ADD ASSET",
    BRAND: "BRAND",
    DELETE: "DELETE",
    CANCEL: "CANCEL",
    TYPE_SEARCH: "Start typing to search...",
    NO_DATA: "No data available.",
    ANALYZE: "RUN ANALYSIS",
    UNKNOWN: "UNKNOWN"
  },
  DASHBOARD: {
    TELEMETRY: "SYSTEM TELEMETRY",
    LIVE_FEED: "PRODUCTION STATUS",
    MARKET_PULSE: "PREDICTIVE RADAR",
    UPTIME: "SYSTEM UPTIME",
    SYNC: "ETSY SYNC STATUS",
    LOAD: "DATABASE LOAD"
  },
  STATUS: {
    ACTIVE: "IN PROGRESS",
    DRAFT: "DRAFT",
    COMPLETED: "CATALOGED",
    ON_HOLD: "ON ICE", 
    LOW_STOCK: "RUNNING LOW",
    OUT_OF_STOCK: "OUT OF STOCK",
    STOCKED: "STOCKED",
    LOW: "LOW",
    DORMANT: "DORMANT",
    // NEW STATUSES
    HALTED: "PRODUCTION HALTED",
    READY_TO_BUILD: "READY TO BUILD",
    MISSING_INFO: "INCOMPLETE DATA"
  },
  FINANCE: {
    HEADER: "PROFIT MATRIX",
    SUBTITLE: "Track your margins and revenue",
    NET: "TAKE HOME",
    LIVE_STATUS: "LIVE DATA ACTIVE",
    REVENUE: "GROSS REVENUE",
    EXPENSE: "TOTAL EXPENSES",
    MARGIN_AVG: "AVG MARGIN",
    REVENUE_CHART: "REVENUE OVER TIME",
    TREND: "GROWTH TREND",
    LEDGER: "TRANSACTION LEDGER",
    DATE: "DATE",
    DESC: "DESCRIPTION",
    AMOUNT: "AMOUNT",
    EMPTY_LEDGER: "Ledger clear. No transactions recorded."
  },
  WORKSHOP: {
    HUB_HEADER: "THE WORKSHOP",
    HUB_SUBTITLE: "Current builds and blueprints",
    ACTIVE_OPS: "ACTIVE BUILDS",
    NEW_PROJECT: "NEW PROJECT",
    VAULT_HEADER: "PROJECT ARCHIVE",
    BOM_HEADER: "BILL OF MATERIALS",
    REF_VISUAL: "SCHEMATIC VIEW",
    TARGET_RETAIL: "TARGET RETAIL",
    LAST_EDIT: "LAST PULSE",
    // NEW LABELS
    TAB_FLEET: "ACTIVE FLEET",
    TAB_LAB: "THE LAB (R&D)",
    MISSING: "MISSING:",
    CAN_BUILD: "CAN BUILD:"
  },
  INVENTORY: {
    HEADER: "RESOURCE DEPOT",
    MANIFEST_LABEL: "ALL RESOURCES",
    NOTIFICATIONS: "ALERTS",
    VALUE_LABEL: "TOTAL ASSET VALUE",
    SECTION_WORKSHOP: "PRODUCTION MATERIALS",
    SECTION_LOGISTICS: "LOGISTICS & SHIPPING",
    INTAKE: "MATERIAL INTAKE",
    ASSET_DETAILS: "ASSET SPECS",
    VAULT_ACCESS: "VAULT BROWSER",
    RESTOCK: "EXISTING ASSET RESTOCK",
    SELECT_ASSET: "SELECT ASSET",
    MATERIAL_NAME: "MATERIAL NAME",
    ADD_QTY: "ADD QTY",
    TOTAL_COST: "TOTAL COST",
    UNIT_PRICE: "UNIT COST",
    HISTORY_LOG: "ASSET LOG",
    PHOTO_LABEL: "ASSET IMAGE",
    FILTERS: {
      ALL: "ALL",
      ACTIVE: "ACTIVE",
      DORMANT: "DORMANT"
    }
  },
  BLUEPRINT: {
    PHASE_PLAN: "R&D / PLANNING",
    PHASE_BUILD: "ENGINEERING",
    PHASE_LAUNCH: "MARKET READY",
    MARKET_RESEARCH: "MARKET SCAN",
    AUDIENCE: "TARGET AUDIENCE",
    INSPIRATION: "INSPIRATION / SOURCE",
    NOTES: "ENGINEERING NOTES",
    VISUAL_CONCEPTS: "VISUAL SCHEMATICS",
    CONCEPT_PLACEHOLDER: "DRAG & DROP CONCEPT ART HERE",
    PRODUCTION_CONSOLE: "PRODUCTION TERMINAL",
    STOCK: "IN-HOUSE STOCK",
    BATCH: "BATCH SIZE",
    RUN: "EXECUTE PRODUCTION",
    PROFIT_SIMULATOR: "MARGIN ANALYSIS",
    RETAIL: "RETAIL PRICE",
    PROFIT: "NET PER UNIT",
    MARGIN: "MARGIN",
    LAUNCH_CHECKLIST: "DEPLOYMENT CHECKLIST",
    PHOTOS: "HI-RES MEDIA",
    DESCRIPTION: "PRODUCT COPY",
    TAGS: "SEO TAGGING",
    RAW_MATERIALS: "Raw Materials:",
    PLATFORM_FEES: "Platform Fees:",
    SHIPPING_LABEL: "Shipping Label:",
    ADD_MATERIAL: "-- Add Material --"
  },
  MARKET: {
    HEADER: "MARKET RADAR",
    SUBTITLE: "Competitor tracking and trends",
    SCANNING: "FETCHING TRENDS...",
    TARGET: "TARGET ACQUISITION",
    TARGET_NAME_LABEL: "COMPETITOR NAME",
    TARGET_PLACEHOLDER: "Enter brand name...",
    TARGET_PRICE_LABEL: "MARKET PRICE",
    PULSE_HEADER: "MARKET PULSE",
    AVG_PRICE: "AVG MARKET PRICE",
    DEMAND: "DEMAND",
    SATURATION: "SATURATION"
  },
  LOGISTICS: {
    TAB: "LOGISTICS",
    CAPACITY: "MAX FULFILLMENT",
    BOTTLENECK: "LIMITING FACTOR",
    STATUS: {
        READY: "READY TO SHIP",
        HALTED: "SHIPMENTS HALTED"
    },
    SIM: "OUTBOUND SIMULATION"
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