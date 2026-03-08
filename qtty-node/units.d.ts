import type { Quantity } from './index.js';

/**
 * A callable unit factory with attached metadata.
 *
 * Call it with a numeric value to produce a `Quantity`:
 *
 * ```ts
 * import { Meters, Degrees } from '@siderust/qtty/units';
 *
 * const d = Meters(1000);   // Quantity { value: 1000, unit: 'Meter' }
 * const a = Degrees(180);   // Quantity { value: 180,  unit: 'Degree' }
 * ```
 */
export interface UnitFactory {
  /** Create a Quantity with this unit. */
  (value: number): Quantity;
  /** Unit name, e.g. `"Meter"`. */
  readonly unit: string;
  /** Unit symbol, e.g. `"m"`. */
  readonly symbol: string;
  /** Dimension name, e.g. `"Length"`. */
  readonly dimension: string;
}

// ── Length ───────────────────────────────────────────────────────────────────
export declare const PlanckLengths: UnitFactory;
export declare const Yoctometers: UnitFactory;
export declare const Zeptometers: UnitFactory;
export declare const Attometers: UnitFactory;
export declare const Femtometers: UnitFactory;
export declare const Picometers: UnitFactory;
export declare const Nanometers: UnitFactory;
export declare const Micrometers: UnitFactory;
export declare const Millimeters: UnitFactory;
export declare const Centimeters: UnitFactory;
export declare const Decimeters: UnitFactory;
export declare const Meters: UnitFactory;
export declare const Decameters: UnitFactory;
export declare const Hectometers: UnitFactory;
export declare const Kilometers: UnitFactory;
export declare const Megameters: UnitFactory;
export declare const Gigameters: UnitFactory;
export declare const Terameters: UnitFactory;
export declare const Petameters: UnitFactory;
export declare const Inches: UnitFactory;
export declare const Feet: UnitFactory;
export declare const Yards: UnitFactory;
export declare const Miles: UnitFactory;
export declare const NauticalMiles: UnitFactory;
export declare const AstronomicalUnits: UnitFactory;
export declare const LightYears: UnitFactory;
export declare const Parsecs: UnitFactory;
export declare const Kiloparsecs: UnitFactory;
export declare const Megaparsecs: UnitFactory;
export declare const Gigaparsecs: UnitFactory;

// ── Time ─────────────────────────────────────────────────────────────────────
export declare const Attoseconds: UnitFactory;
export declare const Femtoseconds: UnitFactory;
export declare const Picoseconds: UnitFactory;
export declare const Nanoseconds: UnitFactory;
export declare const Microseconds: UnitFactory;
export declare const Milliseconds: UnitFactory;
export declare const Seconds: UnitFactory;
export declare const Minutes: UnitFactory;
export declare const Hours: UnitFactory;
export declare const Days: UnitFactory;
export declare const Weeks: UnitFactory;
export declare const Years: UnitFactory;
export declare const Decades: UnitFactory;
export declare const Centuries: UnitFactory;
export declare const Millennia: UnitFactory;
export declare const JulianYears: UnitFactory;
export declare const JulianCenturies: UnitFactory;
export declare const SiderealDays: UnitFactory;
export declare const SynodicMonths: UnitFactory;
export declare const SiderealYears: UnitFactory;

// ── Angle ────────────────────────────────────────────────────────────────────
export declare const Milliradians: UnitFactory;
export declare const Radians: UnitFactory;
export declare const MicroArcseconds: UnitFactory;
export declare const MilliArcseconds: UnitFactory;
export declare const Arcseconds: UnitFactory;
export declare const Arcminutes: UnitFactory;
export declare const Degrees: UnitFactory;
export declare const Gradians: UnitFactory;
export declare const Turns: UnitFactory;
export declare const HourAngles: UnitFactory;

// ── Mass ─────────────────────────────────────────────────────────────────────
export declare const Micrograms: UnitFactory;
export declare const Milligrams: UnitFactory;
export declare const Grams: UnitFactory;
export declare const Kilograms: UnitFactory;
export declare const Tonnes: UnitFactory;
export declare const Ounces: UnitFactory;
export declare const Pounds: UnitFactory;
export declare const Stones: UnitFactory;
export declare const SolarMasses: UnitFactory;
export declare const AtomicMassUnits: UnitFactory;

// ── Power ────────────────────────────────────────────────────────────────────
export declare const Milliwatts: UnitFactory;
export declare const Watts: UnitFactory;
export declare const Kilowatts: UnitFactory;
export declare const Megawatts: UnitFactory;
export declare const Gigawatts: UnitFactory;
export declare const Terawatts: UnitFactory;
export declare const SolarLuminosities: UnitFactory;

// ── Dynamic access ───────────────────────────────────────────────────────────

/**
 * Look up a unit factory by exact unit name.
 *
 * ```ts
 * import { unit } from '@siderust/qtty/units';
 * const km = unit('Kilometer')!(2.5);
 * ```
 */
export declare function unit(name: string): UnitFactory | undefined;

/**
 * All unit factories as a read-only record indexed by unit name.
 */
export declare const units: Readonly<Record<string, UnitFactory>>;

// ── Unit name enum ────────────────────────────────────────────────────────────

/** Union of every registered unit name. Use with `Unit` for type-safe lookups. */
export type UnitName =
  // Length
  | 'PlanckLength' | 'Yoctometer' | 'Zeptometer' | 'Attometer' | 'Femtometer'
  | 'Picometer' | 'Nanometer' | 'Micrometer' | 'Millimeter' | 'Centimeter'
  | 'Decimeter' | 'Meter' | 'Decameter' | 'Hectometer' | 'Kilometer'
  | 'Megameter' | 'Gigameter' | 'Terameter' | 'Petameter' | 'Exameter'
  | 'Zettameter' | 'Yottameter' | 'BohrRadius' | 'ClassicalElectronRadius'
  | 'ElectronReducedComptonWavelength' | 'AstronomicalUnit' | 'LightYear'
  | 'Parsec' | 'Kiloparsec' | 'Megaparsec' | 'Gigaparsec'
  | 'Inch' | 'Foot' | 'Yard' | 'Mile' | 'Link' | 'Fathom' | 'Rod' | 'Chain'
  | 'NauticalMile' | 'NominalLunarRadius' | 'NominalLunarDistance'
  | 'NominalEarthPolarRadius' | 'NominalEarthRadius' | 'NominalEarthEquatorialRadius'
  | 'EarthMeridionalCircumference' | 'EarthEquatorialCircumference'
  | 'NominalJupiterRadius' | 'NominalSolarRadius' | 'NominalSolarDiameter'
  // Time
  | 'Attosecond' | 'Femtosecond' | 'Picosecond' | 'Nanosecond' | 'Microsecond'
  | 'Millisecond' | 'Centisecond' | 'Decisecond' | 'Second' | 'Decasecond'
  | 'Hectosecond' | 'Kilosecond' | 'Megasecond' | 'Gigasecond' | 'Terasecond'
  | 'Minute' | 'Hour' | 'Day' | 'Week' | 'Fortnight' | 'Year' | 'Decade'
  | 'Century' | 'Millennium' | 'JulianYear' | 'JulianCentury'
  | 'SiderealDay' | 'SynodicMonth' | 'SiderealYear'
  // Angle
  | 'Milliradian' | 'Radian' | 'MicroArcsecond' | 'MilliArcsecond'
  | 'Arcsecond' | 'Arcminute' | 'Degree' | 'Gradian' | 'Turn' | 'HourAngle'
  // Mass
  | 'Yoctogram' | 'Zeptogram' | 'Attogram' | 'Femtogram' | 'Picogram'
  | 'Nanogram' | 'Microgram' | 'Milligram' | 'Centigram' | 'Decigram'
  | 'Gram' | 'Decagram' | 'Hectogram' | 'Kilogram' | 'Megagram' | 'Gigagram'
  | 'Teragram' | 'Petagram' | 'Exagram' | 'Zettagram' | 'Yottagram'
  | 'Grain' | 'Ounce' | 'Pound' | 'Stone' | 'ShortTon' | 'LongTon'
  | 'Carat' | 'Tonne' | 'AtomicMassUnit' | 'SolarMass'
  // Power
  | 'Yoctowatt' | 'Zeptowatt' | 'Attowatt' | 'Femtowatt' | 'Picowatt'
  | 'Nanowatt' | 'Microwatt' | 'Milliwatt' | 'Deciwatt' | 'Watt' | 'Decawatt'
  | 'Hectowatt' | 'Kilowatt' | 'Megawatt' | 'Gigawatt' | 'Terawatt' | 'Petawatt'
  | 'Exawatt' | 'Zettawatt' | 'Yottawatt'
  | 'ErgPerSecond' | 'HorsepowerMetric' | 'HorsepowerElectric' | 'SolarLuminosity';

/**
 * Const map of all registered unit names.
 *
 * Use instead of raw string literals to get IDE autocomplete and avoid typos:
 *
 * ```ts
 * import { Unit, Quantity } from '@siderust/qtty';
 *
 * const d  = new Quantity(1000, Unit.Meter);
 * const km = d.to(Unit.Kilometer);
 * convert(1, Unit.Meter, Unit.Kilometer);
 * ```
 *
 * Each key is a string literal type, so `Unit.Meter` has type `'Meter'`.
 */
export declare const Unit: { readonly [K in UnitName]: K };
