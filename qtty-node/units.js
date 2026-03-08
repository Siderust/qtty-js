/**
 * @siderust/qtty — Unit factory constants.
 *
 * Every export is a **callable unit factory**: call it with a number to produce
 * a `Quantity` for that unit.
 *
 * ```js
 * import { Meters, Kilometers, Degrees, Kilograms } from '@siderust/qtty/units';
 *
 * const d  = Meters(1000);       // Quantity { value: 1000, unit: 'Meter' }
 * const a  = Degrees(180);       // Quantity { value: 180,  unit: 'Degree' }
 * const km = d.to('Kilometer');  // Quantity { value: 1,    unit: 'Kilometer' }
 * ```
 *
 * Arithmetic shorthand — because JavaScript has no operator overloading, use
 * the factory call instead of multiplication:
 *
 *   `Degrees(180)`    ≡  `new Quantity(180, 'Degree')`
 *   `Kilometers(2.5)` ≡  `new Quantity(2.5, 'Kilometer')`
 *
 * Every factory also exposes the unit metadata as properties:
 *
 * ```js
 * Meters.unit      // 'Meter'
 * Meters.symbol    // 'm'
 * Meters.dimension // 'Length'
 * ```
 */

'use strict';

const { Quantity } = require('./lib/Quantity.js');
const { listUnits } = require('./lib/backend.js');

/**
 * Creates a unit factory function for the given unit name.
 *
 * @param {string} unitName
 * @param {string} symbol
 * @param {string} dimension
 * @returns {UnitFactory}
 */
function makeFactory(unitName, symbol, dimension) {
  /**
   * @param {number} value
   * @returns {import('./index.js').Quantity}
   */
  function factory(value) {
    return new Quantity(value, unitName);
  }

  factory.unit = unitName;
  factory.symbol = symbol;
  factory.dimension = dimension;
  factory.toString = () => unitName;
  factory[Symbol.toStringTag] = `Unit(${unitName})`;

  return factory;
}

// Build factories for every registered unit.
const _all = listUnits();

/**
 * All unit factories indexed by unit name.
 * @type {Record<string, UnitFactory>}
 */
const byName = Object.create(null);

for (const { name, symbol, dimension } of _all) {
  byName[name] = makeFactory(name, symbol, dimension);
}

// ─────────────────────────────────────────────────────────────────────────────
// Named exports — common units for ergonomic imports
// ─────────────────────────────────────────────────────────────────────────────

// Length
exports.PlanckLengths = byName['PlanckLength'];
exports.Yoctometers = byName['Yoctometer'];
exports.Zeptometers = byName['Zeptometer'];
exports.Attometers = byName['Attometer'];
exports.Femtometers = byName['Femtometer'];
exports.Picometers = byName['Picometer'];
exports.Nanometers = byName['Nanometer'];
exports.Micrometers = byName['Micrometer'];
exports.Millimeters = byName['Millimeter'];
exports.Centimeters = byName['Centimeter'];
exports.Decimeters = byName['Decimeter'];
exports.Meters = byName['Meter'];
exports.Decameters = byName['Decameter'];
exports.Hectometers = byName['Hectometer'];
exports.Kilometers = byName['Kilometer'];
exports.Megameters = byName['Megameter'];
exports.Gigameters = byName['Gigameter'];
exports.Terameters = byName['Terameter'];
exports.Petameters = byName['Petameter'];
exports.Inches = byName['Inch'];
exports.Feet = byName['Foot'];
exports.Yards = byName['Yard'];
exports.Miles = byName['Mile'];
exports.NauticalMiles = byName['NauticalMile'];
exports.AstronomicalUnits = byName['AstronomicalUnit'];
exports.LightYears = byName['LightYear'];
exports.Parsecs = byName['Parsec'];
exports.Kiloparsecs = byName['Kiloparsec'];
exports.Megaparsecs = byName['Megaparsec'];
exports.Gigaparsecs = byName['Gigaparsec'];

// Time
exports.Attoseconds = byName['Attosecond'];
exports.Femtoseconds = byName['Femtosecond'];
exports.Picoseconds = byName['Picosecond'];
exports.Nanoseconds = byName['Nanosecond'];
exports.Microseconds = byName['Microsecond'];
exports.Milliseconds = byName['Millisecond'];
exports.Seconds = byName['Second'];
exports.Minutes = byName['Minute'];
exports.Hours = byName['Hour'];
exports.Days = byName['Day'];
exports.Weeks = byName['Week'];
exports.Years = byName['Year'];
exports.Decades = byName['Decade'];
exports.Centuries = byName['Century'];
exports.Millennia = byName['Millennium'];
exports.JulianYears = byName['JulianYear'];
exports.JulianCenturies = byName['JulianCentury'];
exports.SiderealDays = byName['SiderealDay'];
exports.SynodicMonths = byName['SynodicMonth'];
exports.SiderealYears = byName['SiderealYear'];

// Angle
exports.Milliradians = byName['Milliradian'];
exports.Radians = byName['Radian'];
exports.MicroArcseconds = byName['MicroArcsecond'];
exports.MilliArcseconds = byName['MilliArcsecond'];
exports.Arcseconds = byName['Arcsecond'];
exports.Arcminutes = byName['Arcminute'];
exports.Degrees = byName['Degree'];
exports.Gradians = byName['Gradian'];
exports.Turns = byName['Turn'];
exports.HourAngles = byName['HourAngle'];

// Mass
exports.Micrograms = byName['Microgram'];
exports.Milligrams = byName['Milligram'];
exports.Grams = byName['Gram'];
exports.Kilograms = byName['Kilogram'];
exports.Tonnes = byName['Tonne'];
exports.Ounces = byName['Ounce'];
exports.Pounds = byName['Pound'];
exports.Stones = byName['Stone'];
exports.SolarMasses = byName['SolarMass'];
exports.AtomicMassUnits = byName['AtomicMassUnit'];

// Power
exports.Milliwatts = byName['Milliwatt'];
exports.Watts = byName['Watt'];
exports.Kilowatts = byName['Kilowatt'];
exports.Megawatts = byName['Megawatt'];
exports.Gigawatts = byName['Gigawatt'];
exports.Terawatts = byName['Terawatt'];
exports.SolarLuminosities = byName['SolarLuminosity'];

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic access helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Look up a unit factory by exact unit name.
 *
 * ```js
 * import { unit } from '@siderust/qtty/units';
 * const km = unit('Kilometer')(2.5);
 * ```
 *
 * @param {string} name - Unit name, e.g. `'Kilometer'`.
 * @returns {UnitFactory | undefined}
 */
exports.unit = (name) => byName[name];

/**
 * All unit factories as an object indexed by unit name.
 * @type {Readonly<Record<string, UnitFactory>>}
 */
exports.units = Object.freeze({ ...byName });

/**
 * Const map of all registered unit names.
 *
 * Use instead of raw string literals to get IDE autocomplete and avoid typos:
 *
 * ```js
 * import { Unit } from '@siderust/qtty/units';
 *
 * const d  = new Quantity(1000, Unit.Meter);
 * const km = d.to(Unit.Kilometer);
 * convert(1, Unit.Meter, Unit.Kilometer);
 * ```
 *
 * @type {Readonly<Record<string, string>>}
 */
exports.Unit = Object.freeze(Object.fromEntries(_all.map(u => [u.name, u.name])));

/**
 * @typedef {object} UnitFactory
 * @property {string} unit      - Unit name.
 * @property {string} symbol    - Unit symbol.
 * @property {string} dimension - Dimension name.
 */
