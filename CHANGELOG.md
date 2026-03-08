# Changelog

All notable changes to the JavaScript workspace are documented here.

The vendored Rust workspace keeps its own history in
[`qtty/CHANGELOG.md`](./qtty/CHANGELOG.md).

## [0.1.0] - 2026-03-08

### Added
- Initial `qtty-js` release repository with the vendored `qtty` submodule as
  the canonical Rust backend.
- `@siderust/qtty` for Node.js, exposing `Quantity`, `DerivedQuantity`,
  `convert`, compatibility helpers, unit metadata helpers, `listUnits()`, and a
  typed `Unit` constant map.
- `@siderust/qtty/units` factory exports for ergonomic quantity construction in
  Node.js, including named factories, dynamic `unit(name)` lookup, and the
  `units` registry.
- `@siderust/qtty-web` for browsers and bundlers, exposing the same core
  quantity model over WebAssembly with explicit async initialization via
  `init()`.
- TypeScript declaration files for the Node and Web packages.
- Node examples covering quickstart usage, arithmetic, serialization, unit
  factories, and astronomy-oriented conversions.
- Node automated tests and GitHub Actions CI for format, lint, build, test, and
  coverage.
- Repository versioning is now centered on the JavaScript workspace release
  line, starting at `1.0.0`, while the internal native crate in `qtty-node`
  continues to track the Rust backend line separately.
- Conversion rules, unit metadata, and FFI semantics are inherited from the
  vendored `qtty` workspace and `qtty-ffi`.
