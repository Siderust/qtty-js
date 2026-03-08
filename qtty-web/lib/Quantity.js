/**
 * @siderust/qtty-web — Quantity façade class (browser/WASM).
 *
 * Identical API to the Node version.  This module uses the WASM backend
 * for unit conversions and metadata.
 */

import * as backend from './backend.js';

export class Quantity {
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

  get value() { return this._value; }
  get unit() { return this._unit; }
  get symbol() { return this._symbol; }
  get dimension() { return this._dimension; }

  to(targetUnit) {
    const converted = backend.convert(this._value, this._unit, targetUnit);
    return new Quantity(converted, targetUnit);
  }

  compatible(other) {
    return backend.isCompatible(this._unit, other._unit);
  }

  add(other) {
    if (!this.compatible(other)) {
      throw new Error(
        `Cannot add quantities with different dimensions: ${this._dimension} vs ${other._dimension}`
      );
    }
    const otherInMyUnit = backend.convert(other._value, other._unit, this._unit);
    return new Quantity(this._value + otherInMyUnit, this._unit);
  }

  sub(other) {
    if (!this.compatible(other)) {
      throw new Error(
        `Cannot subtract quantities with different dimensions: ${this._dimension} vs ${other._dimension}`
      );
    }
    const otherInMyUnit = backend.convert(other._value, other._unit, this._unit);
    return new Quantity(this._value - otherInMyUnit, this._unit);
  }

  mul(scalar) { return new Quantity(this._value * scalar, this._unit); }
  div(scalar) { return new Quantity(this._value / scalar, this._unit); }
  neg() { return new Quantity(-this._value, this._unit); }

  format(precision) {
    const v = precision != null && precision >= 0
      ? this._value.toFixed(precision)
      : String(this._value);
    return `${v} ${this._symbol}`;
  }

  toJson() { return { value: this._value, unit: this._unit }; }
  toString() { return this.format(); }
}
