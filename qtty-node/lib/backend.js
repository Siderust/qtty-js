/**
 * @siderust/qtty — Internal backend abstraction.
 *
 * This module loads the native NAPI-RS addon and re-exports only the
 * primitive-level helpers that the JS façade classes need. Consumer code
 * should never import this module directly.
 *
 * @module @siderust/qtty/lib/backend
 * @private
 */

'use strict';

const native = require('../native.cjs');

// Re-export the primitive operations the façade needs.
module.exports = {
  convert: native.convert,
  isCompatible: native.isCompatible,
  unitDimension: native.unitDimension,
  unitSymbol: native.unitSymbol,
  isValidUnit: native.isValidUnit,
  listUnits: native.listUnits,
  ffiVersion: native.ffiVersion,
};
