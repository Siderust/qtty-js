# qtty-js workspace

JavaScript and WebAssembly bindings for
[qtty](./qtty/README.md), the Siderust physical quantities and unit conversion
library.

This repository is the publishable JS workspace. It contains the npm packages,
the thin Rust transport layers for Node and Web, and the vendored `qtty`
submodule that provides the canonical conversion registry and unit model.

## Packages

| Package | Target | Status | Notes |
| --- | --- | --- | --- |
| [`@siderust/qtty`](./qtty-node/README.md) | Node.js | `0.1.0` | Native addon built with `napi-rs`; includes `@siderust/qtty/units` factories. |
| `@siderust/qtty-web` | Browsers / bundlers | `0.1.0` | WebAssembly build with `wasm-bindgen`; requires `await init()` before use. |

The Rust crates under `qtty-node/` and `qtty-web/` are transport layers only.
All unit metadata and conversion semantics come from the [`qtty`](./qtty)
submodule through `qtty-ffi`.

## Repository layout

```text
qtty-js/
├── qtty/         Vendored Rust workspace (canonical units, FFI, docs)
├── qtty-node/    Node package: @siderust/qtty
├── qtty-web/     Browser package: @siderust/qtty-web
└── scripts/      CI helpers for the Node package
```

## What ships in 0.1.0

- A Node package with `Quantity`, `DerivedQuantity`, conversion helpers,
  compatibility checks, JSON-friendly serialization helpers, and a typed `Unit`
  map.
- Node-side unit factories under `@siderust/qtty/units` for arithmetic-style
  construction such as `Kilometers(3.2)` or `Degrees(180)`.
- A browser/WASM package exposing the same core quantity model with explicit
  asynchronous initialization via `init()`.
- TypeScript declarations for both packages matching the current runtime
  surface.
- Node examples, tests, and CI for format, lint, build, test, and coverage.

## Install

### Node.js

```bash
npm install @siderust/qtty
```

```js
const { Quantity, convert, Unit } = require('@siderust/qtty');

const distance = new Quantity(1500, Unit.Meter);
console.log(distance.to(Unit.Kilometer).value); // 1.5
console.log(convert(2, Unit.Hour, Unit.Minute)); // 120
```

### Browser / WebAssembly

```bash
npm install @siderust/qtty-web
```

```js
import { init, Quantity, Unit } from '@siderust/qtty-web';

await init();

const angle = new Quantity(180, Unit.Degree);
console.log(angle.to(Unit.Radian).value);
```

## Development

Clone the repository with submodules so the vendored Rust workspace is present:

```bash
git clone --recurse-submodules git@github.com:Siderust/qtty-js.git
cd qtty-js
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

### Node package workflow

```bash
cd qtty-node
npm ci
npm run build:debug
npm test
```

The repository also exposes CI helpers:

```bash
./scripts/ci.sh all
```

### Web package workflow

`qtty-web` uses `wasm-pack`:

```bash
cd qtty-web
wasm-pack build --target web --out-dir pkg --release --scope siderust
```

## Versioning notes

The npm packages in this repository start at `0.1.0`, while the Rust transport
crate inside [`qtty-node`](./qtty-node/Cargo.toml) still tracks the native layer
version (`0.4.0`). That is intentional: the JavaScript public release line and
the internal Rust crate line are versioned independently.

## Related documentation

- [`qtty-node/README.md`](./qtty-node/README.md) for the Node package API and
  examples.
- [`qtty/README.md`](./qtty/README.md) for the vendored Rust workspace.
- [`qtty/CHANGELOG.md`](./qtty/CHANGELOG.md) for backend/library changes that
  feed these bindings.

## License

AGPL-3.0. See [LICENSE](./LICENSE).
