/**
 * @siderust/qtty — Strongly-typed physical quantities and unit conversions.
 *
 * Public entrypoint.  Exposes JS-level façade classes (`Quantity`,
 * `DerivedQuantity`) and the primitive free functions / utilities from
 * the native backend.
 *
 * @module @siderust/qtty
 */

'use strict';

const { Quantity } = require('./lib/Quantity.js');
const { DerivedQuantity } = require('./lib/DerivedQuantity.js');

// Free functions — pass through from the native backend.
const backend = require('./lib/backend.js');

module.exports.Quantity = Quantity;
module.exports.DerivedQuantity = DerivedQuantity;
module.exports.convert = backend.convert;
module.exports.isCompatible = backend.isCompatible;
module.exports.unitDimension = backend.unitDimension;
module.exports.unitSymbol = backend.unitSymbol;
module.exports.isValidUnit = backend.isValidUnit;
module.exports.ffiVersion = backend.ffiVersion;
module.exports.listUnits = backend.listUnits;
