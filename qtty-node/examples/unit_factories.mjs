/**
 * unit_factories.mjs — Arithmetic-style construction with unit factories.
 *
 * Unit factories let you write Degrees(180) instead of new Quantity(180, 'Degree'),
 * giving a concise, readable style that reads like "180 Degrees".
 *
 * Run: node examples/unit_factories.mjs
 */

import {
  Meters, Kilometers, Miles, NauticalMiles, AstronomicalUnits, LightYears, Parsecs,
  Seconds, Minutes, Hours, Days, Years,
  Degrees, Radians, Arcminutes, Arcseconds,
  Kilograms, Pounds, SolarMasses,
  Watts, Kilowatts, SolarLuminosities,
  unit, units,
} from '../units.js';

console.log('─── Unit factories (Degrees(180) ≡ new Quantity(180, "Degree")) ───');

const angle  = Degrees(180);         // same as: new Quantity(180, 'Degree')
const dist   = Kilometers(2.5);      // same as: new Quantity(2.5, 'Kilometer')
const time   = Hours(1.5);           // same as: new Quantity(1.5, 'Hour')
const mass   = Kilograms(70);        // same as: new Quantity(70,  'Kilogram')
const power  = Kilowatts(100);       // same as: new Quantity(100, 'Kilowatt')

console.log(`  Degrees(180)     → ${angle}`);
console.log(`  Kilometers(2.5)  → ${dist}`);
console.log(`  Hours(1.5)       → ${time}`);
console.log(`  Kilograms(70)    → ${mass}`);
console.log(`  Kilowatts(100)   → ${power}`);

console.log('\n─── Factory metadata ──────────────────────────────────────────────');
console.log(`  Meters.unit      = ${Meters.unit}`);         // Meter
console.log(`  Meters.symbol    = ${Meters.symbol}`);       // m
console.log(`  Meters.dimension = ${Meters.dimension}`);    // Length
console.log(`  Degrees.symbol   = ${Degrees.symbol}`);      // °

console.log('\n─── Convert using factories ───────────────────────────────────────');

const rad    = Degrees(180).to('Radian');
console.log(`  Degrees(180) → ${rad.format(6)}`);               // 3.141593 rad

const inMeters = Kilometers(2.5).to('Meter');
console.log(`  Kilometers(2.5) → ${inMeters}`);                  // 2500 m

const inMiles = Kilometers(1.609344).to('Mile');
console.log(`  Kilometers(1.609344) → ${inMiles.format(4)}`);   // 1.0000 mi

const inParsecs = LightYears(3.26156).to('Parsec');
console.log(`  LightYears(3.26156) → ${inParsecs.format(4)}`);  // 1.0000 pc

const inSeconds = Hours(2).to('Second');
console.log(`  Hours(2) → ${inSeconds}`);                        // 7200 s

const inPounds = Kilograms(1).to('Pound');
console.log(`  Kilograms(1) → ${inPounds.format(6)}`);           // 2.204623 lb

console.log('\n─── Dynamic lookup with unit() ────────────────────────────────────');
const factory = unit('SolarMass');
if (factory) {
  const sun = factory(1);
  console.log(`  unit('SolarMass')(1) → ${sun}`);                    // 1 M_☉
  console.log(`  Dimension: ${sun.dimension}`);                       // Mass
}

console.log('\n─── Browse all units for a dimension ──────────────────────────────');
const lengthUnits = Object.values(units)
  .filter(f => f.dimension === 'Length')
  .map(f => `${f.unit} (${f.symbol})`);
console.log(`  Length units (${lengthUnits.length}): ${lengthUnits.slice(0, 8).join(', ')}, …`);
