/**
 * @siderust/qtty — Quantity façade class.
 *
 * This is the public runtime class for a physical quantity.  It is a plain
 * JS object (not a native addon class) so that the same `Quantity` identity
 * works in both Node (NAPI-RS) and Web (WASM) environments, and instances
 * produced by `@siderust/qtty` can flow through `@siderust/tempoch` and
 * `@siderust/siderust` without cross-addon identity mismatches.
 *
 * @module @siderust/qtty/lib/Quantity
 */

'use strict';

const backend = require('./backend.js');

class Quantity {
  /**
   * @param {number} value  Numeric value.
   * @param {string} unit   Unit name, e.g. `"Meter"`, `"Kilometer"`.
   */
  constructor(value, unit) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error('Quantity value must be a finite number');
    }
    if (!backend.isValidUnit(unit)) {
      throw new Error(`Unknown unit: "${unit}". Use listUnits() to list valid units.`);
    }
    this._value = value;
    this._unit = unit;
    this._symbol = backend.unitSymbol(unit);
    this._dimension = backend.unitDimension(unit);
  }

  /** The numeric value of this quantity. */
  get value() {
    return this._value;
  }

  /** The unit name, e.g. `"Meter"`. */
  get unit() {
    return this._unit;
  }

  /** The unit symbol, e.g. `"m"`. */
  get symbol() {
    return this._symbol;
  }

  /** The dimension name, e.g. `"Length"`. */
  get dimension() {
    return this._dimension;
  }

  /**
   * Convert to a different unit.
   * @param {string} targetUnit
   * @returns {Quantity}
   */
  to(targetUnit) {
    const converted = backend.convert(this._value, this._unit, targetUnit);
    return new Quantity(converted, targetUnit);
  }

  /**
   * Check dimensional compatibility with another Quantity.
   * @param {Quantity} other
   * @returns {boolean}
   */
  compatible(other) {
    return backend.isCompatible(this._unit, other._unit);
  }

  /**
   * Add another quantity (same dimension). Result uses this quantity's unit.
   * @param {Quantity} other
   * @returns {Quantity}
   */
  add(other) {
    if (!this.compatible(other)) {
      throw new Error(
        `Cannot add quantities with different dimensions: ${this._dimension} vs ${other._dimension}`,
      );
    }
    const otherInMyUnit = backend.convert(other._value, other._unit, this._unit);
    return new Quantity(this._value + otherInMyUnit, this._unit);
  }

  /**
   * Subtract another quantity (same dimension). Result uses this quantity's unit.
   * @param {Quantity} other
   * @returns {Quantity}
   */
  sub(other) {
    if (!this.compatible(other)) {
      throw new Error(
        `Cannot subtract quantities with different dimensions: ${this._dimension} vs ${other._dimension}`,
      );
    }
    const otherInMyUnit = backend.convert(other._value, other._unit, this._unit);
    return new Quantity(this._value - otherInMyUnit, this._unit);
  }

  /**
   * Multiply by a scalar.
   * @param {number} scalar
   * @returns {Quantity}
   */
  mul(scalar) {
    return new Quantity(this._value * scalar, this._unit);
  }

  /**
   * Divide by a scalar.
   * @param {number} scalar
   * @returns {Quantity}
   */
  div(scalar) {
    return new Quantity(this._value / scalar, this._unit);
  }

  /** Negate the value. */
  neg() {
    return new Quantity(-this._value, this._unit);
  }

  /**
   * Format as a human-readable string.
   * @param {number} [precision]
   * @returns {string}
   */
  format(precision) {
    const v =
      precision != null && precision >= 0 ? this._value.toFixed(precision) : String(this._value);
    return `${v} ${this._symbol}`;
  }

  /**
   * Serialize to a plain JSON object.
   * @returns {{ value: number, unit: string }}
   */
  toJson() {
    return { value: this._value, unit: this._unit };
  }

  toString() {
    return this.format();
  }
}

module.exports = { Quantity };
