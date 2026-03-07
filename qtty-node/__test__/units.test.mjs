// @ts-check
/**
 * Tests for the unit factory module (units.js).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  Meters,
  Kilometers,
  LightYears,
  Parsecs,
  Seconds,
  Hours,
  Degrees,
  Kilograms,
  SolarMasses,
  Watts,
  unit,
  units,
} from '../units.js';

describe('Unit factories', () => {
  it('Degrees(n) produces same Quantity as new Quantity(n, "Degree")', () => {
    const a = Degrees(180);
    assert.equal(a.value, 180);
    assert.equal(a.unit, 'Degree');
    assert.equal(a.symbol, '°');
    assert.equal(a.dimension, 'Angle');
  });

  it('Meters(n) produces a length Quantity', () => {
    const q = Meters(500);
    assert.equal(q.value, 500);
    assert.equal(q.unit, 'Meter');
    assert.equal(q.dimension, 'Length');
  });

  it('Kilograms(n) produces a mass Quantity', () => {
    const q = Kilograms(70);
    assert.equal(q.value, 70);
    assert.equal(q.unit, 'Kilogram');
    assert.equal(q.dimension, 'Mass');
  });

  it('Watts(n) produces a power Quantity', () => {
    const q = Watts(100);
    assert.equal(q.value, 100);
    assert.equal(q.dimension, 'Power');
  });

  it('factory has .unit, .symbol, .dimension properties', () => {
    assert.equal(Kilometers.unit, 'Kilometer');
    assert.equal(Kilometers.symbol, 'km');
    assert.equal(Kilometers.dimension, 'Length');
    assert.equal(Seconds.unit, 'Second');
    assert.equal(Seconds.symbol, 's');
    assert.equal(Degrees.symbol, '°');
    assert.equal(SolarMasses.dimension, 'Mass');
  });

  it('factory.toString() returns the unit name', () => {
    assert.equal(Meters.toString(), 'Meter');
    assert.equal(Degrees.toString(), 'Degree');
  });
});

describe('Arithmetic via unit factories', () => {
  it('Degrees(180) → Radian conversion', () => {
    const rad = Degrees(180).to('Radian');
    assert.ok(Math.abs(rad.value - Math.PI) < 1e-12);
  });

  it('Kilometers(1).add(Meters(500)) = 1.5 km', () => {
    const sum = Kilometers(1).add(Meters(500));
    assert.ok(Math.abs(sum.value - 1.5) < 1e-12);
    assert.equal(sum.unit, 'Kilometer');
  });

  it('Kilograms(1) → Pounds', () => {
    const lb = Kilograms(1).to('Pound');
    assert.ok(Math.abs(lb.value - 2.20462) < 0.0001);
  });

  it('Hours(2) → Seconds = 7200', () => {
    const s = Hours(2).to('Second');
    assert.ok(Math.abs(s.value - 7200) < 1e-9);
  });

  it('LightYears(1) → Parsec ≈ 0.3066', () => {
    const pc = LightYears(1).to('Parsec');
    assert.ok(Math.abs(pc.value - 0.3066) < 0.001);
  });

  it('factory call chaining: Parsecs(1).to Kilometers', () => {
    const km = Parsecs(1).to('Kilometer');
    assert.ok(km.value > 3e13);
  });

  it('SolarMasses(1) to Kilogram', () => {
    const kg = SolarMasses(1).to('Kilogram');
    assert.ok(Math.abs(kg.value - 1.988416e30) / 1.988416e30 < 1e-5);
  });
});

describe('unit() dynamic lookup', () => {
  it('returns factory for known unit', () => {
    const f = unit('Kilometer');
    assert.ok(f !== undefined);
    const q = f(5);
    assert.equal(q.value, 5);
    assert.equal(q.unit, 'Kilometer');
  });

  it('returns undefined for unknown unit', () => {
    assert.equal(unit('Bogus'), undefined);
  });
});

describe('units index', () => {
  it('contains entries for all five dimensions', () => {
    const dims = new Set(Object.values(units).map((f) => f.dimension));
    assert.ok(dims.has('Length'));
    assert.ok(dims.has('Time'));
    assert.ok(dims.has('Angle'));
    assert.ok(dims.has('Mass'));
    assert.ok(dims.has('Power'));
  });

  it('has more than 100 entries', () => {
    assert.ok(Object.keys(units).length > 100);
  });

  it('every entry has unit, symbol, dimension and is callable', () => {
    for (const [name, factory] of Object.entries(units)) {
      assert.equal(typeof factory, 'function', `${name} should be callable`);
      assert.equal(typeof factory.unit, 'string');
      assert.equal(typeof factory.symbol, 'string');
      assert.equal(typeof factory.dimension, 'string');
    }
  });
});
