// @ts-check
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  Quantity,
  DerivedQuantity,
  convert,
  isCompatible,
  unitDimension,
  unitSymbol,
  isValidUnit,
  ffiVersion,
} from '../index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Quantity construction
// ─────────────────────────────────────────────────────────────────────────────

describe('Quantity', () => {
  it('creates a quantity with value and unit', () => {
    const q = new Quantity(1000, 'Meter');
    assert.equal(q.value, 1000);
    assert.equal(q.unit, 'Meter');
    assert.equal(q.symbol, 'm');
    assert.equal(q.dimension, 'Length');
  });

  it('throws on unknown unit', () => {
    assert.throws(() => new Quantity(1, 'Foobar'), /Unknown unit/);
  });

  // ── Conversion ──────────────────────────────────────────────────────

  it('converts meters to kilometers', () => {
    const m = new Quantity(1000, 'Meter');
    const km = m.to('Kilometer');
    assert.equal(km.unit, 'Kilometer');
    assert.ok(Math.abs(km.value - 1.0) < 1e-12);
  });

  it('converts kilometers to meters', () => {
    const km = new Quantity(2.5, 'Kilometer');
    const m = km.to('Meter');
    assert.ok(Math.abs(m.value - 2500) < 1e-12);
  });

  it('converts seconds to hours', () => {
    const s = new Quantity(3600, 'Second');
    const h = s.to('Hour');
    assert.ok(Math.abs(h.value - 1.0) < 1e-12);
  });

  it('converts degrees to radians', () => {
    const deg = new Quantity(180, 'Degree');
    const rad = deg.to('Radian');
    assert.ok(Math.abs(rad.value - Math.PI) < 1e-12);
  });

  it('converts kilograms to grams', () => {
    const kg = new Quantity(1, 'Kilogram');
    const g = kg.to('Gram');
    assert.ok(Math.abs(g.value - 1000) < 1e-12);
  });

  it('throws on incompatible conversion', () => {
    const m = new Quantity(100, 'Meter');
    assert.throws(() => m.to('Second'), /incompatible/i);
  });

  it('throws on unknown target unit', () => {
    const m = new Quantity(100, 'Meter');
    assert.throws(() => m.to('Bogus'), /Unknown unit/);
  });

  // ── Arithmetic ──────────────────────────────────────────────────────

  it('adds compatible quantities', () => {
    const a = new Quantity(1, 'Kilometer');
    const b = new Quantity(500, 'Meter');
    const sum = a.add(b);
    assert.equal(sum.unit, 'Kilometer');
    assert.ok(Math.abs(sum.value - 1.5) < 1e-12);
  });

  it('subtracts compatible quantities', () => {
    const a = new Quantity(2, 'Kilometer');
    const b = new Quantity(500, 'Meter');
    const diff = a.sub(b);
    assert.ok(Math.abs(diff.value - 1.5) < 1e-12);
  });

  it('throws on add with incompatible dimensions', () => {
    const m = new Quantity(100, 'Meter');
    const s = new Quantity(10, 'Second');
    assert.throws(() => m.add(s), /different dimensions/i);
  });

  it('throws on sub with incompatible dimensions', () => {
    const m = new Quantity(100, 'Meter');
    const s = new Quantity(10, 'Second');
    assert.throws(() => m.sub(s), /different dimensions/i);
  });

  it('multiplies by scalar', () => {
    const q = new Quantity(5, 'Meter');
    const r = q.mul(3);
    assert.ok(Math.abs(r.value - 15) < 1e-12);
    assert.equal(r.unit, 'Meter');
  });

  it('divides by scalar', () => {
    const q = new Quantity(15, 'Meter');
    const r = q.div(3);
    assert.ok(Math.abs(r.value - 5) < 1e-12);
  });

  it('negates', () => {
    const q = new Quantity(5, 'Meter');
    const n = q.neg();
    assert.ok(Math.abs(n.value - -5) < 1e-12);
  });

  // ── Compatibility ───────────────────────────────────────────────────

  it('reports compatible quantities', () => {
    const a = new Quantity(1, 'Meter');
    const b = new Quantity(1, 'Kilometer');
    assert.equal(a.compatible(b), true);
  });

  it('reports incompatible quantities', () => {
    const a = new Quantity(1, 'Meter');
    const b = new Quantity(1, 'Second');
    assert.equal(a.compatible(b), false);
  });

  // ── Formatting ──────────────────────────────────────────────────────

  it('formats with default precision', () => {
    const q = new Quantity(1234.5, 'Meter');
    assert.equal(q.format(), '1234.5 m');
  });

  it('formats with specified precision', () => {
    const q = new Quantity(1234.5678, 'Meter');
    assert.equal(q.format(2), '1234.57 m');
  });

  it('toString returns formatted string', () => {
    const q = new Quantity(42, 'Kilometer');
    assert.equal(q.toString(), '42 km');
  });

  // ── JSON ────────────────────────────────────────────────────────────

  it('toJson returns plain object', () => {
    const q = new Quantity(100, 'Meter');
    const json = q.toJson();
    assert.deepEqual(json, { value: 100, unit: 'Meter' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DerivedQuantity
// ─────────────────────────────────────────────────────────────────────────────

describe('DerivedQuantity', () => {
  it('creates a derived quantity', () => {
    const v = new DerivedQuantity(100, 'Meter', 'Second');
    assert.equal(v.value, 100);
    assert.equal(v.numerator, 'Meter');
    assert.equal(v.denominator, 'Second');
    assert.equal(v.symbol, 'm/s');
  });

  it('converts m/s to km/h', () => {
    const v = new DerivedQuantity(100, 'Meter', 'Second');
    const kmh = v.to('Kilometer', 'Hour');
    assert.ok(Math.abs(kmh.value - 360) < 1e-9);
    assert.equal(kmh.numerator, 'Kilometer');
    assert.equal(kmh.denominator, 'Hour');
  });

  it('throws on incompatible derived conversion', () => {
    const v = new DerivedQuantity(1, 'Meter', 'Second');
    assert.throws(() => v.to('Kilogram', 'Hour'), /incompatible/i);
  });

  it('multiplies by scalar', () => {
    const v = new DerivedQuantity(10, 'Meter', 'Second');
    const r = v.mul(3);
    assert.ok(Math.abs(r.value - 30) < 1e-12);
  });

  it('divides by scalar', () => {
    const v = new DerivedQuantity(30, 'Kilometer', 'Hour');
    const r = v.div(2);
    assert.ok(Math.abs(r.value - 15) < 1e-12);
  });

  it('negates', () => {
    const v = new DerivedQuantity(5, 'Meter', 'Second');
    const n = v.neg();
    assert.ok(Math.abs(n.value - -5) < 1e-12);
  });

  it('formats with precision', () => {
    const v = new DerivedQuantity(123.456, 'Meter', 'Second');
    assert.equal(v.format(1), '123.5 m/s');
  });

  it('toString returns formatted string', () => {
    const v = new DerivedQuantity(42, 'Kilometer', 'Hour');
    assert.equal(v.toString(), '42 km/h');
  });

  it('toJson returns plain object', () => {
    const v = new DerivedQuantity(100, 'Meter', 'Second');
    const json = v.toJson();
    assert.deepEqual(json, {
      value: 100,
      numerator: 'Meter',
      denominator: 'Second',
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Free functions
// ─────────────────────────────────────────────────────────────────────────────

describe('convert()', () => {
  it('converts a raw value between units', () => {
    const km = convert(1000, 'Meter', 'Kilometer');
    assert.ok(Math.abs(km - 1.0) < 1e-12);
  });

  it('throws on incompatible dimensions', () => {
    assert.throws(() => convert(1, 'Meter', 'Second'), /incompatible/i);
  });

  it('throws on unknown unit', () => {
    assert.throws(() => convert(1, 'Meter', 'Bogus'), /Unknown unit/);
  });
});

describe('isCompatible()', () => {
  it('returns true for same-dimension units', () => {
    assert.equal(isCompatible('Meter', 'Kilometer'), true);
    assert.equal(isCompatible('Second', 'Hour'), true);
    assert.equal(isCompatible('Degree', 'Radian'), true);
  });

  it('returns false for different-dimension units', () => {
    assert.equal(isCompatible('Meter', 'Second'), false);
  });
});

describe('unitDimension()', () => {
  it('returns the dimension name', () => {
    assert.equal(unitDimension('Meter'), 'Length');
    assert.equal(unitDimension('Second'), 'Time');
    assert.equal(unitDimension('Degree'), 'Angle');
    assert.equal(unitDimension('Kilogram'), 'Mass');
    assert.equal(unitDimension('Watt'), 'Power');
  });
});

describe('unitSymbol()', () => {
  it('returns the unit symbol', () => {
    assert.equal(unitSymbol('Meter'), 'm');
    assert.equal(unitSymbol('Kilometer'), 'km');
    assert.equal(unitSymbol('Second'), 's');
    assert.equal(unitSymbol('Hour'), 'h');
    assert.equal(unitSymbol('Degree'), '°');
    assert.equal(unitSymbol('Radian'), 'rad');
  });
});

describe('isValidUnit()', () => {
  it('returns true for known units', () => {
    assert.equal(isValidUnit('Meter'), true);
    assert.equal(isValidUnit('Kilometer'), true);
    assert.equal(isValidUnit('Second'), true);
    assert.equal(isValidUnit('Kilogram'), true);
    assert.equal(isValidUnit('Watt'), true);
  });

  it('returns false for unknown units', () => {
    assert.equal(isValidUnit('Foobar'), false);
    assert.equal(isValidUnit(''), false);
  });
});

describe('ffiVersion()', () => {
  it('returns a positive integer', () => {
    const v = ffiVersion();
    assert.equal(typeof v, 'number');
    assert.ok(v >= 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// End-to-end workflow tests
// ─────────────────────────────────────────────────────────────────────────────

describe('End-to-end workflows', () => {
  it('astronomy: parsecs to light-years', () => {
    const pc = new Quantity(1, 'Parsec');
    const ly = pc.to('LightYear');
    // 1 pc ≈ 3.2616 ly
    assert.ok(Math.abs(ly.value - 3.2616) < 0.001);
  });

  it('velocity conversion chain', () => {
    // 1 m/s → km/h → back to m/s
    const v1 = new DerivedQuantity(1, 'Meter', 'Second');
    const v2 = v1.to('Kilometer', 'Hour');
    const v3 = v2.to('Meter', 'Second');
    assert.ok(Math.abs(v3.value - 1.0) < 1e-9);
  });

  it('arithmetic with mixed units', () => {
    // 1 km + 500 m = 1.5 km
    const a = new Quantity(1, 'Kilometer');
    const b = new Quantity(500, 'Meter');
    const sum = a.add(b);
    assert.ok(Math.abs(sum.value - 1.5) < 1e-12);

    // Scale by 2 = 3 km
    const scaled = sum.mul(2);
    assert.ok(Math.abs(scaled.value - 3.0) < 1e-12);

    // Convert to meters = 3000 m
    const inMeters = scaled.to('Meter');
    assert.ok(Math.abs(inMeters.value - 3000) < 1e-9);
  });
});
