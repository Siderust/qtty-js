/**
 * astronomy.mjs — Astronomy-oriented unit conversions.
 *
 * Demonstrates the wide range of astronomical units available.
 *
 * Run: node examples/astronomy.mjs
 */

import {
  AstronomicalUnits, LightYears, Parsecs, Kiloparsecs, Megaparsecs, Gigaparsecs,
  Kilometers, Meters,
  Degrees, Radians, Arcseconds, MilliArcseconds, MicroArcseconds, HourAngles,
  Seconds, Days, Years, JulianYears, JulianCenturies, SiderealYears,
  SolarMasses, Kilograms,
  SolarLuminosities, Watts,
} from '../units.js';

console.log('─── Distance scales ────────────────────────────────────────────────');

const oneAU = AstronomicalUnits(1);
console.log(`  1 AU = ${oneAU.to('Kilometer').value.toExponential(4)} km`);
console.log(`  1 AU = ${oneAU.to('LightYear').value.toExponential(4)} ly`);
console.log(`  1 AU = ${oneAU.to('Parsec').value.toExponential(4)} pc`);

const oneLY = LightYears(1);
console.log(`  1 ly = ${oneLY.to('AstronomicalUnit').format(2)}`);
console.log(`  1 ly = ${oneLY.to('Parsec').format(6)}`);

const onePc = Parsecs(1);
console.log(`  1 pc = ${onePc.to('LightYear').format(4)}`);  // 3.2616 ly
console.log(`  1 pc = ${onePc.to('AstronomicalUnit').value.toExponential(4)} AU`);

// Cosmological distances
const andromeda = Kiloparsecs(778);
console.log(`\n  Andromeda Galaxy: ${andromeda.to('Megaparsec').format(3)}`);
console.log(`  Andromeda Galaxy: ${andromeda.to('LightYear').value.toExponential(3)} ly`);

const hubbleHorizon = Gigaparsecs(14);
console.log(`  Hubble horizon  : ${hubbleHorizon.value} Gpc`);

console.log('\n─── Angular measurements ────────────────────────────────────────────');

const arcOne = Degrees(1);
console.log(`  1° = ${arcOne.to('Arcminute').value} ′`);
console.log(`  1° = ${arcOne.to('Arcsecond').value} ″`);
console.log(`  1° = ${arcOne.to('Radian').format(8)}`);

// Parallax of Proxima Centauri: 768.5 mas
const proxParallax = MilliArcseconds(768.5);
const proxParallaxArcsec = proxParallax.to('Arcsecond');
// Distance in parsecs = 1 / parallax_in_arcsec
const proxDistPc = Parsecs(1 / proxParallaxArcsec.value);
console.log(`\n  Proxima Centauri parallax: ${proxParallax} = ${proxParallaxArcsec.format(4)}`);
console.log(`  Distance: ${proxDistPc.format(4)} = ${proxDistPc.to('LightYear').format(4)}`);

// Hour angles (right ascension)
const ra = HourAngles(6.75);   // RA of Betelgeuse
console.log(`\n  Betelgeuse RA: ${ra} = ${ra.to('Degree').format(4)}`);

console.log('\n─── Time scales ─────────────────────────────────────────────────────');

const oneYear = JulianYears(1);
console.log(`  1 Julian year = ${oneYear.to('Day').format(4)}`);
console.log(`  1 Julian year = ${oneYear.to('Second').value.toExponential(4)} s`);

const oneSiderealYear = SiderealYears(1);
console.log(`  1 Sidereal year = ${oneSiderealYear.to('Day').format(6)}`);
const diff = SiderealYears(1).to('Second').sub(JulianYears(1).to('Second'));
console.log(`  Sidereal − Julian year = ${diff.format(2)}`);

console.log('\n─── Masses ──────────────────────────────────────────────────────────');

const oneSolar = SolarMasses(1);
console.log(`  1 M_☉ = ${oneSolar.to('Kilogram').value.toExponential(4)} kg`);

const earthMass = Kilograms(5.972e24);
console.log(`  Earth = ${earthMass.to('SolarMass').value.toExponential(4)} M_☉`);

console.log('\n─── Luminosity ──────────────────────────────────────────────────────');

const oneSolarLum = SolarLuminosities(1);
console.log(`  1 L_☉ = ${oneSolarLum.to('Watt').value.toExponential(4)} W`);
console.log(`  1 L_☉ = ${oneSolarLum.to('Megawatt').value.toExponential(4)} MW`);
