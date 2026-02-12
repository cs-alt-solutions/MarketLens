/* src/data/mockData.js */

export const INITIAL_MATERIALS = [
  { id: 101, name: 'Soy Wax', brand: 'Golden Brands 464', category: 'Raw Material', qty: 45, unit: 'lbs', costPerUnit: 3.50, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-09', history: [] },
  { id: 102, name: 'Glass Jars', brand: '8oz Amber', category: 'Packaging', qty: 120, unit: 'count', costPerUnit: 1.10, status: 'Active', usageType: 'Project Component', lastUsed: '2025-11-15', history: [] },
  { id: 103, name: 'Walnut Stain', brand: 'Minwax Dark', category: 'Consumables', qty: 0.5, unit: 'gal', costPerUnit: 24.00, status: 'Dormant', usageType: 'Project Component', lastUsed: '2025-09-01', history: [] },
  { id: 104, name: 'Brass Rods', brand: '1/4 Inch Solid', category: 'Hardware', qty: 0, unit: 'ft', costPerUnit: 6.00, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-05', history: [] },
  { id: 105, name: 'Cotton Wicks', brand: 'CD-12', category: 'Hardware', qty: 500, unit: 'count', costPerUnit: 0.05, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-01', history: [] },
  { id: 106, name: 'Fragrance Oil', brand: 'Santal & Coconut', category: 'Raw Material', qty: 32, unit: 'oz', costPerUnit: 2.20, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-10', history: [] },
];

export const INITIAL_INSIGHTS = [
  { id: 'tm1', name: "Pet Architecture", growth: "+210%", score: 98, desc: "Modern furniture for pets." },
  { id: 'tm2', name: "Gothic Home Decor", growth: "+125%", score: 85, desc: "Dark aesthetic pieces." },
];

export const MARKET_TICKER_DATA = [
    { label: "SOY WAX", trend: "up", value: "$2.15/lb" },
    { label: "FRAGRANCE OIL", trend: "neutral", value: "$18.50/lb" },
    { label: "SHIPPING (DOMESTIC)", trend: "down", value: "$4.20/avg" },
    { label: "BEESWAX", trend: "up", value: "$8.50/lb" },
    { label: "GLASS JARS (8oz)", trend: "neutral", value: "$0.85/ea" },
    { label: "WICKING (CD-12)", trend: "down", value: "$0.05/ea" }
];

export const MOCK_PROJECTS = [
  { 
    id: 'proj-001', 
    title: 'Obsidian Soy Candle', 
    status: 'active',
    demand: 'High',
    competition: 'Medium',
    created_at: '2026-02-08T10:00:00Z',
    tags: ['Home Decor', 'Minimalist', 'Noir Series'],
    missions: [
      { id: 101, title: 'Wick Testing (CD-12)', status: 'completed' },
      { id: 102, title: 'Fragrance Load Optimization', status: 'in-progress' },
      { id: 103, title: 'Cure Time Analysis', status: 'pending' }
    ]
  },
  { 
    id: 'proj-003', 
    title: 'Botanical Reed Diffuser', 
    status: 'active',
    demand: 'Medium',
    competition: 'High',
    created_at: '2026-02-10T09:15:00Z',
    tags: ['Aromatherapy', 'Glassware', 'Refillable'],
    missions: [
      { id: 301, title: 'Sourcing Rattan Reeds', status: 'completed' },
      { id: 302, title: 'Label Design V2', status: 'pending' }
    ]
  },
  { 
    id: 'proj-004', 
    title: 'Brass Geo-Planter', 
    status: 'draft',
    demand: 'Unknown',
    competition: 'Unknown',
    created_at: '2026-02-11T11:00:00Z',
    tags: ['Metalwork', 'Plants', 'Modern'],
    missions: []
  },
  { 
    id: 'proj-006', 
    title: 'Neon Wall Sign', 
    status: 'draft',
    demand: 'High',
    competition: 'Medium',
    created_at: '2026-02-12T09:00:00Z',
    tags: ['Lighting', 'Decor'],
    missions: []
  },
  { 
    id: 'proj-002', 
    title: 'Walnut Device Stand', 
    status: 'completed',
    demand: 'Very High',
    competition: 'Low',
    created_at: '2026-01-15T14:30:00Z',
    tags: ['Woodworking', 'Office', 'Premium'],
    missions: []
  },
  { 
    id: 'proj-007', 
    title: 'Leather Desk Mat', 
    status: 'completed',
    demand: 'Medium',
    competition: 'Medium',
    created_at: '2025-12-20T10:00:00Z',
    tags: ['Leather', 'Office'],
    missions: []
  },
  { 
    id: 'proj-008', 
    title: 'Concrete Coaster Set', 
    status: 'completed',
    demand: 'Low',
    competition: 'High',
    created_at: '2025-11-05T09:00:00Z',
    tags: ['Concrete', 'Home Decor', 'Industrial'],
    missions: []
  },
  { 
    id: 'proj-009', 
    title: 'Copper Lamp Base', 
    status: 'completed',
    demand: 'High',
    competition: 'High',
    created_at: '2025-10-15T11:00:00Z',
    tags: ['Lighting', 'Metalwork'],
    missions: []
  },
  { 
    id: 'proj-005', 
    title: 'Cyber-Resin Coaster', 
    status: 'on_hold', 
    demand: 'Low',
    competition: 'High',
    created_at: '2026-02-01T09:00:00Z',
    tags: ['Resin', 'Cyberpunk', 'Tabletop'],
    missions: []
  }
];