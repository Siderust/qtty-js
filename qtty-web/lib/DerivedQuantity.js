/**
 * @siderust/qtty-web — DerivedQuantity façade class (browser/WASM).
 *
 * Identical API to the Node version.
 */

import * as backend from './backend.js';

export class DerivedQuantity {
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

  get value() { return this._value; }
  get numerator() { return this._numerator; }
  get denominator() { return this._denominator; }
  get symbol() { return `${this._numSymbol}/${this._denSymbol}`; }

  to(numerator, denominator) {
    const numFactor = backend.convert(1, this._numerator, numerator);
    const denFactor = backend.convert(1, this._denominator, denominator);
    return new DerivedQuantity(this._value * numFactor / denFactor, numerator, denominator);
  }

  mul(scalar) { return new DerivedQuantity(this._value * scalar, this._numerator, this._denominator); }
  div(scalar) { return new DerivedQuantity(this._value / scalar, this._numerator, this._denominator); }
  neg() { return new DerivedQuantity(-this._value, this._numerator, this._denominator); }

  format(precision) {
    const v = precision != null && precision >= 0
      ? this._value.toFixed(precision)
      : String(this._value);
    return `${v} ${this.symbol}`;
  }

  toJson() {
    return {
      value: this._value,
      numerator: this._numerator,
      denominator: this._denominator,
    };
  }

  toString() { return this.format(); }
}
