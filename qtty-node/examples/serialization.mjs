/**
 * serialization.mjs — JSON serialization of quantities.
 *
 * Demonstrates:
 *  - `quantity.toJson()`  → plain object `{ value, unit }`
 *  - `JSON.stringify()`   → JSON string
 *  - Restoring a quantity from a JSON object via `new Quantity(...)`
 *  - `derivedQuantity.toJson()` → `{ value, numerator, denominator }`
 *  - A practical "API payload" round-trip pattern
 *
 * Run: node examples/serialization.mjs
 */

import { Quantity, DerivedQuantity, convert } from '../index.js';

const line = (label = '') =>
  console.log(
    label ? `─── ${label} ${`─`.repeat(Math.max(0, 52 - label.length))}` : `─`.repeat(56),
  );

// ─── Quantity → plain object → JSON string ───────────────────────────────
line('Quantity.toJson()');

const distance = new Quantity(42_195, 'Meter');   // marathon distance
const time     = new Quantity(2.01389, 'Hour');   // world-record approx
const mass     = new Quantity(70, 'Kilogram');

for (const q of [distance, time, mass]) {
  const plain = q.toJson();                        // { value, unit }
  const json  = JSON.stringify(plain);
  console.log(`  ${String(q).padEnd(22)} → ${json}`);
}

// ─── JSON string → Quantity (round-trip) ─────────────────────────────────
line('Round-trip: JSON → Quantity');

const marathonJson = JSON.stringify(distance.toJson());  // "{"value":42195,"unit":"Meter"}"
const parsed       = JSON.parse(marathonJson);            // { value: 42195, unit: 'Meter' }
const restored     = new Quantity(parsed.value, parsed.unit);

console.log(`  original  : ${distance}`);
console.log(`  JSON text : ${marathonJson}`);
console.log(`  restored  : ${restored}`);
console.log(`  equal     : ${Math.abs(restored.value - distance.value) < 1e-9}`);

// ─── DerivedQuantity → JSON ───────────────────────────────────────────────
line('DerivedQuantity.toJson()');

const soundSpeed   = new DerivedQuantity(343, 'Meter', 'Second');   // air at 20 °C
const earthVelocity = new DerivedQuantity(29.783, 'Kilometer', 'Second');
const lightSpeed   = new DerivedQuantity(299_792.458, 'Kilometer', 'Second');

for (const dq of [soundSpeed, earthVelocity, lightSpeed]) {
  const plain = dq.toJson();                       // { value, numerator, denominator }
  const json  = JSON.stringify(plain);
  console.log(`  ${String(dq).padEnd(28)} → ${json}`);
}

// ─── DerivedQuantity round-trip ────────────────────────────────────────────
line('Round-trip: JSON → DerivedQuantity');

const velJson = JSON.stringify(earthVelocity.toJson());
const velObj  = JSON.parse(velJson);
const velRt   = new DerivedQuantity(velObj.value, velObj.numerator, velObj.denominator);

console.log(`  original   : ${earthVelocity}`);
console.log(`  JSON text  : ${velJson}`);
console.log(`  restored   : ${velRt}`);
console.log(`  in km/h    : ${velRt.to('Kilometer', 'Hour').format(2)}`);

// ─── API payload pattern ──────────────────────────────────────────────────
line('API payload: serialize / deserialize');

/**
 * Simulated server response with a list of physical measurements.
 */
const serverPayload = JSON.stringify([
  { value: 1.496e11,      unit: 'Meter'      },   // 1 AU
  { value: 9.461e15,      unit: 'Meter'      },   // 1 light-year
  { value: 3.086e16,      unit: 'Meter'      },   // 1 parsec
]);

const measurements = JSON.parse(serverPayload).map(
  ({ value, unit }) => new Quantity(value, unit),
);

const names = ['1 AU', '1 ly', '1 pc'];
console.log('  Distances received from API:');
for (const [name, q] of names.map((n, i) => [n, measurements[i]])) {
  const km = q.to('Kilometer');
  console.log(`    ${name.padEnd(5)} = ${q.value.toExponential(3)} m = ${km.value.toExponential(3)} km`);
}

// ─── Derived payload ──────────────────────────────────────────────────────
line('Derived API payload');

const derivedPayload = JSON.stringify([
  { value: 11.2,   numerator: 'Kilometer', denominator: 'Second' },  // Earth escape velocity
  { value: 617.7,  numerator: 'Kilometer', denominator: 'Second' },  // Solar escape velocity
]);

const velocities = JSON.parse(derivedPayload).map(
  ({ value, numerator, denominator }) => new DerivedQuantity(value, numerator, denominator),
);

const velNames = ['Earth escape', 'Solar escape'];
for (const [name, v] of velNames.map((n, i) => [n, velocities[i]])) {
  const kmh = v.to('Kilometer', 'Hour');
  console.log(`  ${name.padEnd(14)}: ${String(v).padEnd(16)} = ${kmh.format(0)}`);
}

// ─── listUnits introspection via JSON ─────────────────────────────────────
line('JSON catalog of available units');

import { listUnits } from '../index.js';
const allUnits = listUnits();
const byDim   = {};
for (const u of allUnits) {
  (byDim[u.dimension] ??= []).push(u.name);
}
for (const [dim, names_] of Object.entries(byDim).sort()) {
  console.log(`  ${dim.padEnd(10)} (${names_.length}): ${names_.slice(0, 5).join(', ')}${names_.length > 5 ? ', …' : ''}`);
}
