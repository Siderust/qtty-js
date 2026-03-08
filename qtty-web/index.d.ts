/* eslint-disable */

// ─── Initialisation ────────────────────────────────────────────────────────
/**
 * Initialise the WASM module.  Must be called (and `await`-ed) before any
 * other function in this package.
 *
 * ```js
 * import { init, Quantity } from '@siderust/qtty-web';
 * await init();
 * const d = new Quantity(1000, 'Meter');
 * ```
 */
export function init(
  module_or_path?: RequestInfo | URL | Response | BufferSource | WebAssembly.Module
): Promise<void>;

// ─── Types ─────────────────────────────────────────────────────────────────

/** Plain JSON-serializable representation of a quantity. */
export interface QuantityJson {
  value: number;
  unit: string;
}

/** Plain JSON-serializable representation of a derived quantity. */
export interface DerivedQuantityJson {
  value: number;
  numerator: string;
  denominator: string;
}

/** Metadata about a single unit returned by `listUnits`. */
export interface UnitInfo {
  name: string;
  symbol: string;
  dimension: string;
}

// ─── Quantity ──────────────────────────────────────────────────────────────

export class Quantity {
  constructor(value: number, unit: string);
  get value(): number;
  get unit(): string;
  get symbol(): string;
  get dimension(): string;
  to(unit: string): Quantity;
  compatible(other: Quantity): boolean;
  add(other: Quantity): Quantity;
  sub(other: Quantity): Quantity;
  mul(scalar: number): Quantity;
  div(scalar: number): Quantity;
  neg(): Quantity;
  format(precision?: number | null): string;
  toJson(): QuantityJson;
  toString(): string;
}

// ─── DerivedQuantity ──────────────────────────────────────────────────────

export class DerivedQuantity {
  constructor(value: number, numerator: string, denominator: string);
  get value(): number;
  get numerator(): string;
  get denominator(): string;
  get symbol(): string;
  to(numerator: string, denominator: string): DerivedQuantity;
  mul(scalar: number): DerivedQuantity;
  div(scalar: number): DerivedQuantity;
  neg(): DerivedQuantity;
  format(precision?: number | null): string;
  toJson(): DerivedQuantityJson;
  toString(): string;
}

// ─── Free functions ───────────────────────────────────────────────────────

export function convert(value: number, fromUnit: string, toUnit: string): number;
export function isCompatible(unitA: string, unitB: string): boolean;
export function unitDimension(unit: string): string;
export function unitSymbol(unit: string): string;
export function isValidUnit(unit: string): boolean;
export function ffiVersion(): number;
export function listUnits(): UnitInfo[];

// ─── Unit const map ──────────────────────────────────────────────────────────

/** Union of every registered unit name. */
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
 * Const map of all registered unit names (available after `init()`).
 *
 * `Unit.Meter === 'Meter'` — each key equals its own name.
 *
 * ```ts
 * import { init, Quantity, Unit } from '@siderust/qtty-web';
 * await init();
 * const d  = new Quantity(1000, Unit.Meter);
 * const km = d.to(Unit.Kilometer);
 * ```
 */
export declare const Unit: { readonly [K in UnitName]: K };
