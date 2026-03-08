/**
 * @siderust/qtty — DerivedQuantity façade class.
 *
 * A compound quantity like velocity (m/s) or angular velocity (rad/s).
 * This is a plain JS class, mirroring the Quantity façade design.
 *
 * @module @siderust/qtty/lib/DerivedQuantity
 */

'use strict';

const backend = require('./backend.js');

class DerivedQuantity {
  /**
   * @param {number} value       Numeric value.
   * @param {string} numerator   Numerator unit name, e.g. `"Meter"`.
   * @param {string} denominator Denominator unit name, e.g. `"Second"`.
   */
  constructor(value, numerator, denominator) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error('DerivedQuantity value must be a finite number');
    }
    if (!backend.isValidUnit(numerator)) {
      throw new Error(`Unknown numerator unit: "${numerator}"`);
    }
    if (!backend.isValidUnit(denominator)) {
      throw new Error(`Unknown denominator unit: "${denominator}"`);
    }
    this._value = value;
    this._numerator = numerator;
    this._denominator = denominator;
    this._numSymbol = backend.unitSymbol(numerator);
    this._denSymbol = backend.unitSymbol(denominator);
  }

  /** The numeric value. */
  get value() {
    return this._value;
  }

  /** The numerator unit name. */
  get numerator() {
    return this._numerator;
  }

  /** The denominator unit name. */
  get denominator() {
    return this._denominator;
  }

  /** The compound symbol, e.g. `"m/s"`. */
  get symbol() {
    return `${this._numSymbol}/${this._denSymbol}`;
  }

  /**
   * Convert to different units.
   * @param {string} numerator   Target numerator unit.
   * @param {string} denominator Target denominator unit.
   * @returns {DerivedQuantity}
   */
  to(numerator, denominator) {
    // Convert numerator and denominator independently.
    // v_new = v_old × (numFactor / denFactor)
    const numFactor = backend.convert(1, this._numerator, numerator);
    const denFactor = backend.convert(1, this._denominator, denominator);
    return new DerivedQuantity((this._value * numFactor) / denFactor, numerator, denominator);
  }

  /**
   * Multiply by a scalar.
   * @param {number} scalar
   * @returns {DerivedQuantity}
   */
  mul(scalar) {
    return new DerivedQuantity(this._value * scalar, this._numerator, this._denominator);
  }

  /**
   * Divide by a scalar.
   * @param {number} scalar
   * @returns {DerivedQuantity}
   */
  div(scalar) {
    return new DerivedQuantity(this._value / scalar, this._numerator, this._denominator);
  }

  /** Negate the value. */
  neg() {
    return new DerivedQuantity(-this._value, this._numerator, this._denominator);
  }

  /**
   * Format as a human-readable string.
   * @param {number} [precision]
   * @returns {string}
   */
  format(precision) {
    const v =
      precision != null && precision >= 0 ? this._value.toFixed(precision) : String(this._value);
    return `${v} ${this.symbol}`;
  }

  /**
   * Serialize to a plain JSON object.
   * @returns {{ value: number, numerator: string, denominator: string }}
   */
  toJson() {
    return {
      value: this._value,
      numerator: this._numerator,
      denominator: this._denominator,
    };
  }

  toString() {
    return this.format();
  }
}

module.exports = { DerivedQuantity };
