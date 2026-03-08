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
