/**
 * arithmetic.mjs — Arithmetic operations on quantities.
 *
 * Run: node examples/arithmetic.mjs
 */

import { Meters, Kilometers, Seconds, Hours, Kilograms, Grams } from '../units.js';
import { DerivedQuantity } from '../index.js';

console.log('─── Scalar arithmetic ──────────────────────────────────────────────');

const base = Meters(100);
console.log(`  Meters(100).mul(3)  = ${base.mul(3)}`);     // 300 m
console.log(`  Meters(100).div(4)  = ${base.div(4)}`);     // 25 m
console.log(`  Meters(100).neg()   = ${base.neg()}`);      // -100 m

console.log('\n─── Quantity addition and subtraction ──────────────────────────────');

// Add two lengths, each in different units — result is in the left unit.
const a = Kilometers(1);
const b = Meters(500);
console.log(`  Kilometers(1) + Meters(500)  = ${a.add(b)}`);   // 1.5 km
console.log(`  Kilometers(1) - Meters(500)  = ${a.sub(b)}`);   // 0.5 km

// Add with explicit conversion
const totalInMeters = Kilometers(1).to('Meter').add(Meters(500));
console.log(`  In Meters: ${totalInMeters}`);                   // 1500 m

console.log('\n─── Chaining conversions and arithmetic ────────────────────────────');

// Trip: 3 legs in mixed units, total in km
const leg1 = Meters(800);
const leg2 = Kilometers(1.2);
const leg3 = Meters(400);

const total = leg1.to('Kilometer').add(leg2).add(leg3.to('Kilometer'));
console.log(`  Total trip: ${total.format(3)}`);              // 2.400 km
console.log(`  In meters:  ${total.to('Meter')}`);            // 2400 m
console.log(`  In miles:   ${total.to('Mile').format(4)}`);   // 1.4913 mi

console.log('\n─── Derived quantities (velocity = distance / time) ────────────────');

// 100 m/s converted to km/h
const velocity = new DerivedQuantity(100, 'Meter', 'Second');
const kmh = velocity.to('Kilometer', 'Hour');
console.log(`  100 m/s → ${kmh.format(1)}`);            // 360.0 km/h

// Scaling
const doubled = kmh.mul(2);
console.log(`  360 km/h × 2 = ${doubled}`);             // 720 km/h

// Back to SI
const back = kmh.to('Meter', 'Second');
console.log(`  360 km/h → ${back.format(6)}`);           // 100.000000 m/s

console.log('\n─── Mass arithmetic ─────────────────────────────────────────────────');

const kg = Kilograms(5);
const g  = Grams(500);
const combined = kg.add(g);  // 5.5 kg
console.log(`  5 kg + 500 g = ${combined.format(2)}`);

const perItem = combined.div(10);
console.log(`  Per 10 items: ${perItem.format(3)}`);          // 0.550 kg
