/* src/utils/glossary.js */
import { DashboardIcon, WorkshopIcon, Box, Finance, Radar } from '../components/Icons';

export const TERMINOLOGY = {
  BOOT: {
    KERNEL: "WAKING SYSTEMS...",
    MARKET: "SYNCING MARKET DATA...",
    SECURE: "SECURING WORKSPACE...",
    ASSETS: "LOADING ASSETS...",
    GRANTED: "WELCOME BACK."
  },
  MODES: {
    LIVE: "LIVE DATA ACTIVE",
    SIMULATION: "SIMULATION MODE",
    OFFLINE: "SYSTEM OFFLINE",
    DEMO: "DEMO ENVIRONMENT",
    SYNCING: "SYNCING..."
  },
  GENERAL: {
    APP_NAME: "SHIFT STUDIO",
    VERSION: "v2.0",
    SYSTEMS_LABEL: "DASHBOARD",
    SAVE: "SAVE WORK",
    CLOSE: "EXIT",
    FINALIZE: "FINISH & CATALOG",
    CANCEL: "CANCEL",
    CREATE: "START NEW",
    ADD: "ADD TO LIST",
    ANALYZE: "SCAN MARKET",
    DELETE: "REMOVE",
    EDIT: "UPDATE",
    ID_LABEL: "REF-ID",
    MODULES: "SECTIONS",
    SEARCH_PLACEHOLDER: "Search...",
    TYPE_SEARCH: "Type to search...",
    NO_DATA: "Nothing here yet.",
    BRAND: "BRAND",
    UNITS: "UNITS",
    CATEGORY: "CATEGORY"
  },
  STATUS: {
    ACTIVE: "IN PROGRESS",
    DRAFT: "DRAFT",
    COMPLETED: "CATALOGED",
    ON_HOLD: "ON ICE", 
    LOW_STOCK: "RUNNING LOW",
    IN_STOCK: "AVAILABLE",
    OUT_OF_STOCK: "SOLD OUT",
    STOCKED: "STOCKED",
    EMPTY: "EMPTY",
    LOW: "LOW"
  },
  FINANCE: {
    HEADER: "PROFIT MATRIX",
    SUBTITLE: "Track your margins and revenue",
    TREND: "REVENUE GROWTH",
    REVENUE_CHART: "REVENUE TREND",
    LEDGER: "RECORDS",
    LOG: "ADD ENTRY",
    REVENUE: "TOTAL SALES",
    EXPENSE: "COSTS",
    NET: "TAKE HOME",
    MARGIN_AVG: "AVG MARGIN",
    LIVE_STATUS: "LIVE DATA ACTIVE"
  },
  WORKSHOP: {
    HUB_HEADER: "THE WORKSHOP",
    HUB_SUBTITLE: "Current builds and blueprints",
    ACTIVE_OPS: "ACTIVE BUILDS",
    DRAFTS: "SAVED CONCEPTS",
    NEW_PROJECT: "NEW PROJECT",
    VAULT_HEADER: "THE VAULT",
    VAULT_SUBTITLE: "Finished & Paused work",
    MISSIONS_HEADER: "GAME PLAN",
    BOM_HEADER: "MATERIALS NEEDED",
    NOTES_LABEL: "PROJECT NOTES",
    TAGS_LABEL: "LABELS",
    CALIBRATION: "PRICE CHECK",
    TARGET_RETAIL: "YOUR PRICE",
    UNIT_COST: "COST TO MAKE",
    PROJ_MARGIN: "YOUR MARGIN",
    REF_VISUAL: "PREVIEW",
    STUDIO_LABEL: "DESIGN STUDIO",
    ID_PREFIX: "REF-ID",
    LAST_EDIT: "LAST EDIT"
  },
  INVENTORY: {
    HEADER: "RESOURCE DEPOT",
    MANIFEST_LABEL: "ALL RESOURCES",
    SECTION_WORKSHOP: "WORKSHOP INVENTORY",
    SECTION_LOGISTICS: "LOGISTICS & PACKAGING",
    ASSET_DETAILS: "ITEM DETAILS",
    RESTOCK: "UPDATE STOCK",
    INTAKE: "ADD NEW RESOURCE",
    HISTORY_LOG: "ORDER HISTORY",
    NOTIFICATIONS: "ALERTS",
    QTY_LABEL: "AMOUNT LEFT",
    UNIT_PRICE: "PRICE PER UNIT",
    PHOTO_LABEL: "ITEM PHOTO",
    ADD_PHOTO: "ADD PHOTO",
    SELECT_ASSET: "SELECT ASSET",
    VALUE_LABEL: "TOTAL VALUE",
    VAULT_ACCESS: "VAULT ACCESS",
    MATERIAL_NAME: "MATERIAL NAME",
    ADD_QTY: "ADD QTY",
    TOTAL_COST: "TOTAL COST"
  },
  MARKET: {
    HEADER: "MARKET RADAR",
    SUBTITLE: "See what others are doing",
    PULSE_HEADER: "MARKET PULSE",
    AVG_PRICE: "MARKET AVERAGE",
    TARGET: "TRACK ITEM",
    SCANNING: "FETCHING TRENDS...",
    COMPETITOR_LOG: "SAVED ITEMS",
    TARGET_NAME: "Item Name",
    TARGET_PRICE: "Their Price",
    TARGET_NAME_LABEL: "COMPETITOR NAME",
    TARGET_PRICE_LABEL: "THEIR PRICE",
    TARGET_PLACEHOLDER: "e.g. NorthFace"
  },
  UI_FEEDBACK: {
    SUCCESS: "All set!",
    ERROR: "Something went wrong.",
    WARNING: "Just a heads up...",
    CONFIRM_DELETE: "Are you sure you want to remove this?",
    EMPTY_LEDGER: "No transactions recorded yet.",
    EMPTY_LOGS: "Select an item to view logs."
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
    "Golden Brands 464 Soy Wax",
    "Igi 6006 Paraffin Blend",
    "Beeswax Pellets (White)",
    "Beeswax Pellets (Yellow)",
    "Coco Apricot Creme Wax",
    "Fragrance Oil: Santal & Coconut",
    "Fragrance Oil: Lavender Driftwood",
    "Fragrance Oil: White Sage",
    "Liquid Dye: Black",
    "Liquid Dye: Red",
    "CD-12 Cotton Wicks",
    "ECO-10 Cotton Wicks",
    "Wooden Wicks (Crackling)",
    "Wick Stickers",
    "Warning Labels",
    "8oz Amber Glass Jar",
    "9oz Straight Sided Jar (Clear)",
    "4oz Gold Tin",
    "Black Metal Lid (Threaded)",
    "Bamboo Lid (Suction)",
    "4x4x4 Shipping Box",
    "6x6x6 Shipping Box",
    "Bubble Mailer (6x10)",
    "Packing Peanuts (Biodegradable)",
    "Heavy Duty Packing Tape"
];