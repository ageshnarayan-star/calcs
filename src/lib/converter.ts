export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  // Factor relative to the base unit in this category
  factor?: number;
}

export interface UnitCategory {
  id: string;
  name: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', factor: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.344 },
      { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1 },
      { id: 'g', name: 'Gram', symbol: 'g', factor: 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 0.000001 },
      { id: 't', name: 'Metric Ton', symbol: 't', factor: 1000 },
      { id: 'lb', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
      { id: 'st', name: 'Stone', symbol: 'st', factor: 6.35029318 },
      { id: 'ct', name: 'Carat', symbol: 'ct', factor: 0.0002 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'c',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C' },
      { id: 'f', name: 'Fahrenheit', symbol: '°F' },
      { id: 'k', name: 'Kelvin', symbol: 'K' },
      { id: 'r', name: 'Rankine', symbol: '°R' },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    baseUnit: 'm2',
    units: [
      { id: 'm2', name: 'Square Meter', symbol: 'm²', factor: 1 },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', factor: 1e6 },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
      { id: 'mi2', name: 'Square Mile', symbol: 'mi²', factor: 2589988.11 },
      { id: 'yd2', name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      { id: 'ac', name: 'Acre', symbol: 'ac', factor: 4046.856422 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', factor: 10000 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    baseUnit: 'l',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', factor: 1 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      { id: 'cm3', name: 'Cubic Centimeter', symbol: 'cm³', factor: 0.001 },
      { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
      { id: 'qt_us', name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
      { id: 'pt_us', name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
      { id: 'cup_us', name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
      { id: 'floz_us', name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'Meter per second', symbol: 'm/s', factor: 1 },
      { id: 'kmh', name: 'Kilometer per hour', symbol: 'km/h', factor: 0.277777778 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', factor: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.514444 },
      { id: 'fps', name: 'Feet per second', symbol: 'ft/s', factor: 0.3048 },
      { id: 'mach', name: 'Mach (std atmosphere)', symbol: 'Ma', factor: 340.29 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    baseUnit: 's',
    units: [
      { id: 's', name: 'Second', symbol: 's', factor: 1 },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
      { id: 'us', name: 'Microsecond', symbol: 'µs', factor: 0.000001 },
      { id: 'min', name: 'Minute', symbol: 'min', factor: 60 },
      { id: 'h', name: 'Hour', symbol: 'h', factor: 3600 },
      { id: 'd', name: 'Day', symbol: 'd', factor: 86400 },
      { id: 'wk', name: 'Week', symbol: 'wk', factor: 604800 },
      { id: 'mo', name: 'Month (avg 30.44d)', symbol: 'mo', factor: 2629800 },
      { id: 'yr', name: 'Year (365.25d)', symbol: 'yr', factor: 31557600 },
    ],
  },
  {
    id: 'data',
    name: 'Data Storage',
    baseUnit: 'b',
    units: [
      { id: 'byte', name: 'Byte', symbol: 'B', factor: 1 },
      { id: 'kb', name: 'Kilobyte (1000 B)', symbol: 'KB', factor: 1000 },
      { id: 'mb', name: 'Megabyte (1000 KB)', symbol: 'MB', factor: 1e6 },
      { id: 'gb', name: 'Gigabyte (1000 MB)', symbol: 'GB', factor: 1e9 },
      { id: 'tb', name: 'Terabyte (1000 GB)', symbol: 'TB', factor: 1e12 },
      { id: 'pb', name: 'Petabyte (1000 TB)', symbol: 'PB', factor: 1e15 },
      { id: 'bit', name: 'Bit', symbol: 'bit', factor: 0.125 },
      { id: 'kib', name: 'Kibibyte (1024 B)', symbol: 'KiB', factor: 1024 },
      { id: 'mib', name: 'Mebibyte (1024 KiB)', symbol: 'MiB', factor: 1048576 },
      { id: 'gib', name: 'Gibibyte (1024 MiB)', symbol: 'GiB', factor: 1073741824 },
    ],
  },
];

/**
 * Converts a numerical value between two units in a category
 */
export function convertUnit(
  value: number,
  categoryId: string,
  fromUnitId: string,
  toUnitId: string
): { result: number; formula: string } {
  if (categoryId === 'temperature') {
    // First convert to Celsius
    let celsius = value;
    if (fromUnitId === 'f') celsius = ((value - 32) * 5) / 9;
    else if (fromUnitId === 'k') celsius = value - 273.15;
    else if (fromUnitId === 'r') celsius = ((value - 491.67) * 5) / 9;

    // Convert from Celsius to Target
    let result = celsius;
    if (toUnitId === 'f') result = (celsius * 9) / 5 + 32;
    else if (toUnitId === 'k') result = celsius + 273.15;
    else if (toUnitId === 'r') result = ((celsius + 273.15) * 9) / 5;

    let formula = '';
    if (fromUnitId === toUnitId) {
      formula = 'Direct identical unit';
    } else if (fromUnitId === 'c' && toUnitId === 'f') {
      formula = '°F = (°C × 9/5) + 32';
    } else if (fromUnitId === 'f' && toUnitId === 'c') {
      formula = '°C = (°F − 32) × 5/9';
    } else if (fromUnitId === 'c' && toUnitId === 'k') {
      formula = 'K = °C + 273.15';
    } else if (fromUnitId === 'k' && toUnitId === 'c') {
      formula = '°C = K − 273.15';
    } else {
      formula = `Converted via standard thermodynamic scale`;
    }

    return { result, formula };
  }

  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return { result: value, formula: '' };

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit || !fromUnit.factor || !toUnit.factor) {
    return { result: value, formula: '' };
  }

  const baseValue = value * fromUnit.factor;
  const result = baseValue / toUnit.factor;
  const ratio = fromUnit.factor / toUnit.factor;

  const formula = `1 ${fromUnit.symbol} = ${ratio < 0.0001 || ratio > 10000 ? ratio.toExponential(4) : parseFloat(ratio.toPrecision(6))} ${toUnit.symbol}`;

  return { result, formula };
}
