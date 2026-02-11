/* src/utils/units.js */

// Centralized conversion rates relative to a "Base Unit"
// Weight Base: oz | Volume Base: fl oz | Length Base: in
const CONVERSION_RATES = {
  // Weight
  'lbs': { toBase: 16, type: 'weight' },      // 1 lbs = 16 oz
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
  'box':   { toBase: 1, type: 'count' } // Assuming box is handled as a unit or needs specific logic later
};

export const convertToStockUnit = (qty, fromUnit, toUnit) => {
  const val = parseFloat(qty);
  if (isNaN(val)) return 0;
  if (fromUnit === toUnit) return val;

  const fromData = CONVERSION_RATES[fromUnit];
  const toData = CONVERSION_RATES[toUnit];

  // Safety Check: Don't convert Weight to Volume without Density
  if (!fromData || !toData || fromData.type !== toData.type) {
    console.warn(`Conversion mismatch: ${fromUnit} -> ${toUnit}`);
    return val; // Fallback to 1:1 if mismatch
  }

  // Convert to Base, then to Target
  const baseValue = val * fromData.toBase;
  return baseValue / toData.toBase;
};