/* src/utils/units.js */

// Centralized conversion rates relative to a "Base Unit"
// Weight Base: oz | Volume Base: fl oz | Length Base: in
const CONVERSION_RATES = {
  // Weight
  'lbs': { toBase: 16, type: 'weight' },      
  'lb':  { toBase: 16, type: 'weight' }, // Added alias
  'oz':  { toBase: 1, type: 'weight' },
  'kg':  { toBase: 35.274, type: 'weight' },
  'g':   { toBase: 0.035274, type: 'weight' },
  
  // Volume
  'gal':   { toBase: 128, type: 'volume' },
  'fl oz': { toBase: 1, type: 'volume' },
  'L':     { toBase: 33.814, type: 'volume' },
  'ml':    { toBase: 0.033814, type: 'volume' },
  
  // Length
  'ft': { toBase: 12, type: 'length' },
  'in': { toBase: 1, type: 'length' },
  'cm': { toBase: 0.393701, type: 'length' },
  'yd': { toBase: 36, type: 'length' },
  
  // Count
  'count': { toBase: 1, type: 'count' },
  'ea':    { toBase: 1, type: 'count' },
  'box':   { toBase: 1, type: 'count' },
  'jar':   { toBase: 1, type: 'count' },   // Added alias
  'rolls': { toBase: 1, type: 'count' },   // Added alias
  'roll':  { toBase: 1, type: 'count' }    // Added alias
};

export const convertToStockUnit = (qty, fromUnit, toUnit) => {
  const val = parseFloat(qty);
  if (isNaN(val)) return 0;
  
  // Normalize units: if undefined, assume 'ea' (each). Convert to lowercase to prevent case-mismatches.
  const safeFrom = fromUnit ? fromUnit.toLowerCase() : 'ea';
  const safeTo = toUnit ? toUnit.toLowerCase() : 'ea';

  if (safeFrom === safeTo) return val;

  const fromData = CONVERSION_RATES[safeFrom];
  const toData = CONVERSION_RATES[safeTo];

  // Safety Check: If a unit is completely unknown, or we are trying to convert 
  // Weight to Volume without a density formula, gracefully fallback to a 1:1 ratio.
  // We removed the console.warn to keep our production console perfectly clean.
  if (!fromData || !toData || fromData.type !== toData.type) {
    return val; 
  }

  // Convert to Base, then to Target
  const baseValue = val * fromData.toBase;
  return baseValue / toData.toBase;
};