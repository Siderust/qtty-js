# @siderust/qtty

Strongly-typed physical quantities and unit conversions for Node.js, powered by
Rust.

`@siderust/qtty` gives you compile-time safe, zero-overhead unit conversions in
JavaScript and TypeScript by delegating all math to the Rust `qtty` library via
a native Node addon built with [napi-rs](https://napi.rs).

## Installation

```bash
npm install @siderust/qtty
```

The package ships a prebuilt native addon. If a prebuilt binary is not available
for your platform you will need a Rust toolchain (`rustup`) and the napi-rs CLI:

```bash
npm install -g @napi-rs/cli
cd node_modules/@siderust/qtty && napi build --release --platform
```

## Quick start

```js
const { Quantity, DerivedQuantity, convert } = require('@siderust/qtty');

// Create a quantity and convert
const distance = new Quantity(1000, 'Meter');
const km = distance.to('Kilometer');
console.log(km.value); // 1
console.log(km.unit);  // "Kilometer"

// Arithmetic with automatic unit conversion
const a = new Quantity(1, 'Kilometer');
const b = new Quantity(500, 'Meter');
const total = a.add(b);          // 1.5 km
const doubled = total.mul(2);    // 3.0 km

// Derived (compound) quantities
const velocity = new DerivedQuantity(100, 'Meter', 'Second');
const kmh = velocity.to('Kilometer', 'Hour');
console.log(kmh.value); // 360

// One-shot value conversion
const hours = convert(7200, 'Second', 'Hour'); // 2
```

## TypeScript

Full type information is provided out of the box:

```ts
import { Quantity, convert, isCompatible } from '@siderust/qtty';

const q: Quantity = new Quantity(180, 'Degree');
const rad: Quantity = q.to('Radian');
console.log(rad.value); // 3.141592653589793

const ok: boolean = isCompatible('Meter', 'Kilometer'); // true
```

## API

### `Quantity`

| Member | Description |
|--------|-------------|
| `new Quantity(value, unit)` | Create a quantity. Unit is a string like `"Meter"`. |
| `.value` | The numeric value (getter). |
| `.unit` | The unit name (getter). |
| `.symbol` | The unit symbol, e.g. `"m"` (getter). |
| `.dimension` | The dimension name, e.g. `"Length"` (getter). |
| `.to(unit)` | Convert to another unit. Throws on dimension mismatch. |
| `.add(other)` | Add another quantity (same dimension). |
| `.sub(other)` | Subtract another quantity (same dimension). |
| `.mul(scalar)` | Multiply by a number. |
| `.div(scalar)` | Divide by a number. |
| `.neg()` | Negate. |
| `.compatible(other)` | Check dimension compatibility. |
| `.format(precision?)` | Format as string, e.g. `"1000 m"`. |
| `.toJson()` | Return `{ value, unit }` plain object. |
| `.toString()` | Same as `.format()`. |

### `DerivedQuantity`

| Member | Description |
|--------|-------------|
| `new DerivedQuantity(value, num, den)` | Create a compound quantity (e.g. m/s). |
| `.value` | Numeric value. |
| `.numerator` / `.denominator` | Unit names. |
| `.symbol` | Compound symbol, e.g. `"m/s"`. |
| `.to(num, den)` | Convert to different units. |
| `.mul(scalar)` / `.div(scalar)` / `.neg()` | Arithmetic. |
| `.format(precision?)` / `.toString()` | Formatting. |
| `.toJson()` | Return `{ value, numerator, denominator }`. |

### Free functions

| Function | Description |
|----------|-------------|
| `convert(value, from, to)` | Convert a bare number between units. |
| `isCompatible(unitA, unitB)` | Check if two units share a dimension. |
| `unitDimension(unit)` | Get the dimension name for a unit. |
| `unitSymbol(unit)` | Get the symbol for a unit. |
| `isValidUnit(unit)` | Check if a unit name is recognized. |
| `ffiVersion()` | FFI ABI version number. |

### Supported dimensions and units

| Dimension | Example units |
|-----------|---------------|
| **Length** | `Meter`, `Kilometer`, `Mile`, `AstronomicalUnit`, `Parsec`, `LightYear`, … |
| **Time** | `Second`, `Minute`, `Hour`, `Day`, `Year`, `JulianCentury`, … |
| **Angle** | `Radian`, `Degree`, `Arcminute`, `Arcsecond`, `HourAngle`, … |
| **Mass** | `Gram`, `Kilogram`, `Pound`, `SolarMass`, `AtomicMassUnit`, … |
| **Power** | `Watt`, `Kilowatt`, `Megawatt`, `SolarLuminosity`, … |

Use `isValidUnit(name)` to check at runtime, or see the
[units.csv](../qtty/qtty-ffi/units.csv) for the full list.

## Building from source

```bash
# Prerequisites: Rust toolchain
npm install
npx napi build --release --platform
npm test
```

## Architecture

```
┌──────────────┐     napi-rs     ┌──────────────┐     path dep     ┌───────────┐
│  JavaScript  │ ◄─────────────► │  qtty-node   │ ◄──────────────► │  qtty-ffi │
│  / TypeScript│    native addon │  (Rust crate) │    registry &    │  registry │
└──────────────┘                 └──────────────┘    conversion     └───────────┘
                                                                         │
                                                                    ┌────┴────┐
                                                                    │  qtty   │
                                                                    │ (core)  │
                                                                    └─────────┘
```

All conversion math lives in Rust. The Node layer is a thin wrapper that
translates between JavaScript strings/numbers and Rust types.

## License

AGPL-3.0 — see [LICENSE](../LICENSE).
