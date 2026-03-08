/* tslint:disable */
/* eslint-disable */

export type { UnitName } from './units.js'
export { Unit } from './units.js'

/** Plain JSON-serializable representation of a quantity. */
export interface QuantityJson {
  value: number
  unit: string
}
/** Plain JSON-serializable representation of a derived quantity. */
export interface DerivedQuantityJson {
  value: number
  numerator: string
  denominator: string
}
/**
 * Converts a numeric value from one unit to another.
 *
 * This is a convenience function when you only need the converted number.
 *
 * ```js
 * const { convert } = require('@siderust/qtty');
 * const km = convert(1000, 'Meter', 'Kilometer'); // 1.0
 * ```
 *
 * @param value    - The numeric value.
 * @param fromUnit - Source unit name.
 * @param toUnit   - Target unit name.
 * @returns The converted value.
 * @throws If units are unknown or have different dimensions.
 */
export declare function convert(value: number, fromUnit: string, toUnit: string): number
/**
 * Checks whether two unit names refer to compatible units (same dimension).
 *
 * ```js
 * const { isCompatible } = require('@siderust/qtty');
 * isCompatible('Meter', 'Kilometer'); // true
 * isCompatible('Meter', 'Second');    // false
 * ```
 */
export declare function isCompatible(unitA: string, unitB: string): boolean
/**
 * Returns the dimension name for a unit, e.g. `"Length"`, `"Time"`.
 *
 * ```js
 * const { unitDimension } = require('@siderust/qtty');
 * unitDimension('Meter');  // "Length"
 * unitDimension('Second'); // "Time"
 * ```
 */
export declare function unitDimension(unit: string): string
/**
 * Returns the symbol for a unit, e.g. `"m"`, `"km"`, `"s"`.
 *
 * ```js
 * const { unitSymbol } = require('@siderust/qtty');
 * unitSymbol('Meter');     // "m"
 * unitSymbol('Kilometer'); // "km"
 * ```
 */
export declare function unitSymbol(unit: string): string
/**
 * Checks whether a unit name is valid (recognized by the registry).
 *
 * ```js
 * const { isValidUnit } = require('@siderust/qtty');
 * isValidUnit('Meter');   // true
 * isValidUnit('Foobar');  // false
 * ```
 */
export declare function isValidUnit(unit: string): boolean
/** Returns the FFI ABI version number. */
export declare function ffiVersion(): number
/** Metadata about a single unit returned by `listUnits`. */
export interface UnitInfo {
  /** Unit name, e.g. `"Meter"`. */
  name: string
  /** Unit symbol, e.g. `"m"`. */
  symbol: string
  /** Dimension name, e.g. `"Length"`. */
  dimension: string
}
/**
 * Returns an array of all registered units with their name, symbol, and dimension.
 *
 * This is useful for building dynamic UIs, documenting available units,
 * or generating unit factory collections at runtime.
 *
 * ```js
 * const { listUnits } = require('@siderust/qtty');
 * const units = listUnits();
 * units.filter(u => u.dimension === 'Length').map(u => u.name);
 * ```
 */
export declare function listUnits(): Array<UnitInfo>
/**
 * A physical quantity: a numeric value paired with a unit.
 *
 * Create quantities with `new Quantity(value, unit)` and convert between
 * compatible units with `.to(unit)`.
 *
 * ```js
 * const { Quantity } = require('@siderust/qtty');
 *
 * const distance = new Quantity(1000, 'Meter');
 * const km = distance.to('Kilometer');
 * console.log(km.value); // 1.0
 * console.log(km.unit);  // "Kilometer"
 * ```
 */
export declare class Quantity {
  /**
   * Creates a new quantity with the given value and unit name.
   *
   * @param value - The numeric value.
   * @param unit  - Unit name, e.g. `"Meter"`, `"Kilometer"`, `"Second"`.
   * @throws If the unit name is not recognized.
   */
  constructor(value: number, unit: string)
  /** The numeric value of this quantity. */
  get value(): number
  /** The unit name, e.g. `"Meter"`. */
  get unit(): string
  /** The unit symbol, e.g. `"m"`, `"km"`, `"s"`. */
  get symbol(): string
  /** The physical dimension of this quantity, e.g. `"Length"`, `"Time"`. */
  get dimension(): string
  /**
   * Converts this quantity to a different unit.
   *
   * @param unit - Target unit name, e.g. `"Kilometer"`.
   * @returns A new `Quantity` in the target unit.
   * @throws If the target unit is unknown or has a different dimension.
   */
  to(unit: string): Quantity
  /** Checks whether this quantity is compatible (same dimension) with another. */
  compatible(other: Quantity): boolean
  /**
   * Adds another quantity to this one. Both must share the same dimension.
   * The result uses this quantity's unit.
   *
   * @throws If the quantities have different dimensions.
   */
  add(other: Quantity): Quantity
  /**
   * Subtracts another quantity from this one. Both must share the same dimension.
   * The result uses this quantity's unit.
   *
   * @throws If the quantities have different dimensions.
   */
  sub(other: Quantity): Quantity
  /** Multiplies this quantity by a scalar. */
  mul(scalar: number): Quantity
  /** Divides this quantity by a scalar. */
  div(scalar: number): Quantity
  /** Negates the quantity. */
  neg(): Quantity
  /**
   * Formats the quantity as a human-readable string, e.g. `"1000 m"`.
   *
   * @param precision - Number of decimal digits (omit for default).
   */
  format(precision?: number | undefined | null): string
  /** Returns the quantity as a plain object `{ value, unit }` suitable for JSON. */
  toJson(): QuantityJson
  /** Returns `"<value> <symbol>"`, e.g. `"1000 m"`. */
  toString(): string
}
/**
 * A derived (compound) quantity like velocity (m/s) or angular velocity (rad/s).
 *
 * ```js
 * const { DerivedQuantity } = require('@siderust/qtty');
 *
 * const velocity = new DerivedQuantity(100, 'Meter', 'Second');
 * const kmh = velocity.to('Kilometer', 'Hour');
 * console.log(kmh.value); // 360
 * ```
 */
export declare class DerivedQuantity {
  /**
   * Creates a new derived quantity.
   *
   * @param value       - The numeric value.
   * @param numerator   - Numerator unit name, e.g. `"Meter"`.
   * @param denominator - Denominator unit name, e.g. `"Second"`.
   */
  constructor(value: number, numerator: string, denominator: string)
  /** The numeric value. */
  get value(): number
  /** The numerator unit name. */
  get numerator(): string
  /** The denominator unit name. */
  get denominator(): string
  /** The compound symbol, e.g. `"m/s"`. */
  get symbol(): string
  /**
   * Converts this derived quantity to different units.
   *
   * @param numerator   - Target numerator unit.
   * @param denominator - Target denominator unit.
   * @throws If the dimensions are incompatible.
   */
  to(numerator: string, denominator: string): DerivedQuantity
  /** Multiplies by a scalar. */
  mul(scalar: number): DerivedQuantity
  /** Divides by a scalar. */
  div(scalar: number): DerivedQuantity
  /** Negates the value. */
  neg(): DerivedQuantity
  /** Formats as `"<value> <num_symbol>/<den_symbol>"`. */
  format(precision?: number | undefined | null): string
  /** Returns the derived quantity as a plain object. */
  toJson(): DerivedQuantityJson
  /** Returns `"<value> <num_symbol>/<den_symbol>"`. */
  toString(): string
}
