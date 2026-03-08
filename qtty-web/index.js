/**
 * @siderust/qtty-web — Physical quantities and unit conversions for the browser.
 *
 * Call `init()` (and `await` it) before using any other export.
 *
 * @module @siderust/qtty-web
 */

export { init } from './lib/backend.js';
export { Quantity } from './lib/Quantity.js';
export { DerivedQuantity } from './lib/DerivedQuantity.js';
export {
  convert,
  isCompatible,
  unitDimension,
  unitSymbol,
  isValidUnit,
  ffiVersion,
  listUnits,
} from './lib/backend.js';
