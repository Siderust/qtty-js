/**
 * @siderust/qtty-web — Internal WASM backend abstraction.
 *
 * Loads the wasm-bindgen generated module and re-exports the primitive
 * free functions that the shared JS façade classes need.
 *
 * @module @siderust/qtty-web/lib/backend
 * @private
 */

let wasm = null;

/**
 * Initialise the WASM module. Must be called before any other function.
 * @param {RequestInfo | URL | Response | BufferSource | WebAssembly.Module} [module_or_path]
 */
export async function init(module_or_path) {
  const mod = await import('../pkg/qtty_web.js');
  if (module_or_path === undefined) {
    await mod.default();
  } else {
    await mod.default({ module_or_path });
  }
  wasm = mod;
}

export function ensureInit() {
  if (!wasm) {
    throw new Error('@siderust/qtty-web: call init() before using any function');
  }
}

export function convert(value, fromUnit, toUnit) {
  ensureInit();
  return wasm.convert(value, fromUnit, toUnit);
}

export function isCompatible(unitA, unitB) {
  ensureInit();
  return wasm.isCompatible(unitA, unitB);
}

export function unitDimension(unit) {
  ensureInit();
  return wasm.unitDimension(unit);
}

export function unitSymbol(unit) {
  ensureInit();
  return wasm.unitSymbol(unit);
}

export function isValidUnit(unit) {
  ensureInit();
  return wasm.isValidUnit(unit);
}

export function listUnits() {
  ensureInit();
  return wasm.listUnits();
}

export function ffiVersion() {
  ensureInit();
  return wasm.ffiVersion();
}

/**
 * Const map of all registered unit names.  Available after `init()`.
 * `Unit.Meter === 'Meter'` — every key equals its own name.
 * @type {Readonly<{[key: string]: string}>}
 */
export const Unit = new Proxy(Object.freeze({}), {
  get(_, prop) {
    if (typeof prop !== 'string') return undefined;
    ensureInit();
    return prop;
  },
  has(_, prop) {
    if (typeof prop !== 'string') return false;
    ensureInit();
    return wasm.isValidUnit(prop);
  },
});
