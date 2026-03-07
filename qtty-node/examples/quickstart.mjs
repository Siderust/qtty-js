/**
 * quickstart.mjs — Basic quantity creation and conversion.
 *
 * Run: node examples/quickstart.mjs
 */

import { Quantity, convert, isCompatible } from '../index.js';

console.log('─── Construction ───────────────────────────────────────────');

const distance = new Quantity(1000, 'Meter');
console.log(`Created: ${distance}`); // 1000 m
console.log(`value:   ${distance.value}`); // 1000
console.log(`unit:    ${distance.unit}`); // Meter
console.log(`symbol:  ${distance.symbol}`); // m
console.log(`dim:     ${distance.dimension}`); // Length

console.log('\n─── Conversions ────────────────────────────────────────────');

const km = distance.to('Kilometer');
console.log(`1000 m  → ${km}`); // 1 km

const ft = distance.to('Foot');
console.log(`1000 m  → ${ft.format(2)}`); // 3280.84 ft

const mi = distance.to('Mile');
console.log(`1000 m  → ${mi.format(4)}`); // 0.6214 mi

console.log('\n─── Free convert() ─────────────────────────────────────────');

console.log(`7200 s  → ${convert(7200, 'Second', 'Hour')} h`); // 2
console.log(`180 deg → ${convert(180, 'Degree', 'Radian').toFixed(6)} rad`); // 3.141593

console.log('\n─── Compatibility check ────────────────────────────────────');
console.log(`Meter ↔ Kilometer? ${isCompatible('Meter', 'Kilometer')}`); // true
console.log(`Meter ↔ Second?    ${isCompatible('Meter', 'Second')}`); // false
