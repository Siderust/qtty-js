//! Node.js native bindings for `qtty` physical quantities and unit conversions.
//!
//! This crate uses `napi-rs` to expose `qtty-ffi`'s unit registry and conversion
//! logic as a JavaScript/TypeScript-friendly API. All conversion math stays in Rust;
//! the JS layer only sees high-level `Quantity` and `DerivedQuantity` objects.

use napi::bindgen_prelude::*;
use napi_derive::napi;

use qtty_ffi::registry;
use qtty_ffi::{
    DimensionId, QttyDerivedQuantity, QttyQuantity, QttyStatus, UnitId,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: UnitId ↔ string
// ─────────────────────────────────────────────────────────────────────────────

/// Parse a unit name string (e.g. `"Meter"`, `"Kilometer"`) into a `UnitId`.
///
/// Uses serde_json for robust deserialization since `UnitId` derives `Deserialize`.
fn parse_unit(name: &str) -> Result<UnitId> {
    let json = format!("\"{}\"", name);
    serde_json::from_str::<UnitId>(&json).map_err(|_| {
        Error::new(
            Status::InvalidArg,
            format!("Unknown unit: \"{name}\". Use unitName() to list valid units."),
        )
    })
}

/// Convert a `UnitId` to its canonical name string.
fn unit_to_string(id: UnitId) -> String {
    id.name().to_string()
}

/// Map a `DimensionId` to a readable string.
fn dimension_to_string(dim: DimensionId) -> &'static str {
    match dim {
        DimensionId::Length => "Length",
        DimensionId::Time => "Time",
        DimensionId::Angle => "Angle",
        DimensionId::Mass => "Mass",
        DimensionId::Power => "Power",
    }
}

/// Convert an FFI error code into a napi `Error`.
fn ffi_error(code: i32) -> Error {
    if code == QttyStatus::UnknownUnit as i32 {
        Error::new(Status::InvalidArg, "Unknown or invalid unit")
    } else if code == QttyStatus::IncompatibleDim as i32 {
        Error::new(
            Status::InvalidArg,
            "Incompatible dimensions: cannot convert between these units",
        )
    } else {
        Error::new(Status::GenericFailure, "Internal conversion error")
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Quantity class
// ─────────────────────────────────────────────────────────────────────────────

/// A physical quantity: a numeric value paired with a unit.
///
/// Create quantities with `new Quantity(value, unit)` and convert between
/// compatible units with `.to(unit)`.
///
/// ```js
/// const { Quantity } = require('@siderust/qtty');
///
/// const distance = new Quantity(1000, 'Meter');
/// const km = distance.to('Kilometer');
/// console.log(km.value); // 1.0
/// console.log(km.unit);  // "Kilometer"
/// ```
#[napi]
pub struct Quantity {
    inner: QttyQuantity,
}

#[napi]
impl Quantity {
    /// Creates a new quantity with the given value and unit name.
    ///
    /// @param value - The numeric value.
    /// @param unit  - Unit name, e.g. `"Meter"`, `"Kilometer"`, `"Second"`.
    /// @throws If the unit name is not recognized.
    #[napi(constructor)]
    pub fn new(value: f64, unit: String) -> Result<Self> {
        let id = parse_unit(&unit)?;
        if registry::meta(id).is_none() {
            return Err(Error::new(
                Status::InvalidArg,
                format!("Unknown unit: \"{unit}\""),
            ));
        }
        Ok(Self {
            inner: QttyQuantity::new(value, id),
        })
    }

    /// The numeric value of this quantity.
    #[napi(getter)]
    pub fn value(&self) -> f64 {
        self.inner.value
    }

    /// The unit name, e.g. `"Meter"`.
    #[napi(getter)]
    pub fn unit(&self) -> String {
        unit_to_string(self.inner.unit)
    }

    /// The unit symbol, e.g. `"m"`, `"km"`, `"s"`.
    #[napi(getter)]
    pub fn symbol(&self) -> String {
        self.inner.unit.symbol().to_string()
    }

    /// The physical dimension of this quantity, e.g. `"Length"`, `"Time"`.
    #[napi(getter)]
    pub fn dimension(&self) -> String {
        registry::dimension(self.inner.unit)
            .map(dimension_to_string)
            .unwrap_or("Unknown")
            .to_string()
    }

    /// Converts this quantity to a different unit.
    ///
    /// @param unit - Target unit name, e.g. `"Kilometer"`.
    /// @returns A new `Quantity` in the target unit.
    /// @throws If the target unit is unknown or has a different dimension.
    #[napi]
    pub fn to(&self, unit: String) -> Result<Quantity> {
        let target = parse_unit(&unit)?;
        self.inner
            .convert_to(target)
            .map(|q| Quantity { inner: q })
            .ok_or_else(|| {
                let src_dim = self.dimension();
                let dst_dim = registry::dimension(target)
                    .map(dimension_to_string)
                    .unwrap_or("Unknown");
                Error::new(
                    Status::InvalidArg,
                    format!(
                        "Cannot convert {src_dim} to {dst_dim}: incompatible dimensions"
                    ),
                )
            })
    }

    /// Checks whether this quantity is compatible (same dimension) with another.
    #[napi]
    pub fn compatible(&self, other: &Quantity) -> bool {
        self.inner.compatible(&other.inner)
    }

    /// Adds another quantity to this one. Both must share the same dimension.
    /// The result uses this quantity's unit.
    ///
    /// @throws If the quantities have different dimensions.
    #[napi]
    pub fn add(&self, other: &Quantity) -> Result<Quantity> {
        self.inner
            .add(&other.inner)
            .map(|q| Quantity { inner: q })
            .ok_or_else(|| {
                Error::new(
                    Status::InvalidArg,
                    "Cannot add quantities with different dimensions",
                )
            })
    }

    /// Subtracts another quantity from this one. Both must share the same dimension.
    /// The result uses this quantity's unit.
    ///
    /// @throws If the quantities have different dimensions.
    #[napi]
    pub fn sub(&self, other: &Quantity) -> Result<Quantity> {
        self.inner
            .sub(&other.inner)
            .map(|q| Quantity { inner: q })
            .ok_or_else(|| {
                Error::new(
                    Status::InvalidArg,
                    "Cannot subtract quantities with different dimensions",
                )
            })
    }

    /// Multiplies this quantity by a scalar.
    #[napi]
    pub fn mul(&self, scalar: f64) -> Quantity {
        Quantity {
            inner: self.inner.mul_scalar(scalar),
        }
    }

    /// Divides this quantity by a scalar.
    #[napi]
    pub fn div(&self, scalar: f64) -> Quantity {
        Quantity {
            inner: self.inner.div_scalar(scalar),
        }
    }

    /// Negates the quantity.
    #[napi]
    pub fn neg(&self) -> Quantity {
        Quantity {
            inner: self.inner.neg(),
        }
    }

    /// Formats the quantity as a human-readable string, e.g. `"1000 m"`.
    ///
    /// @param precision - Number of decimal digits (omit for default).
    #[napi]
    pub fn format(&self, precision: Option<i32>) -> String {
        let sym = self.inner.unit.symbol();
        match precision {
            Some(p) if p >= 0 => format!("{:.prec$} {}", self.inner.value, sym, prec = p as usize),
            _ => format!("{} {}", self.inner.value, sym),
        }
    }

    /// Returns the quantity as a plain object `{ value, unit }` suitable for JSON.
    #[napi]
    pub fn to_json(&self) -> QuantityJson {
        QuantityJson {
            value: self.inner.value,
            unit: unit_to_string(self.inner.unit),
        }
    }

    /// Returns `"<value> <symbol>"`, e.g. `"1000 m"`.
    #[napi(js_name = "toString")]
    pub fn to_string_js(&self) -> String {
        self.format(None)
    }
}

/// Plain JSON-serializable representation of a quantity.
#[napi(object)]
pub struct QuantityJson {
    pub value: f64,
    pub unit: String,
}

// ─────────────────────────────────────────────────────────────────────────────
// DerivedQuantity class
// ─────────────────────────────────────────────────────────────────────────────

/// A derived (compound) quantity like velocity (m/s) or angular velocity (rad/s).
///
/// ```js
/// const { DerivedQuantity } = require('@siderust/qtty');
///
/// const velocity = new DerivedQuantity(100, 'Meter', 'Second');
/// const kmh = velocity.to('Kilometer', 'Hour');
/// console.log(kmh.value); // 360
/// ```
#[napi]
pub struct DerivedQuantity {
    inner: QttyDerivedQuantity,
}

#[napi]
impl DerivedQuantity {
    /// Creates a new derived quantity.
    ///
    /// @param value       - The numeric value.
    /// @param numerator   - Numerator unit name, e.g. `"Meter"`.
    /// @param denominator - Denominator unit name, e.g. `"Second"`.
    #[napi(constructor)]
    pub fn new(value: f64, numerator: String, denominator: String) -> Result<Self> {
        let num = parse_unit(&numerator)?;
        let den = parse_unit(&denominator)?;
        if registry::meta(num).is_none() {
            return Err(Error::new(
                Status::InvalidArg,
                format!("Unknown numerator unit: \"{numerator}\""),
            ));
        }
        if registry::meta(den).is_none() {
            return Err(Error::new(
                Status::InvalidArg,
                format!("Unknown denominator unit: \"{denominator}\""),
            ));
        }
        Ok(Self {
            inner: QttyDerivedQuantity::new(value, num, den),
        })
    }

    /// The numeric value.
    #[napi(getter)]
    pub fn value(&self) -> f64 {
        self.inner.value
    }

    /// The numerator unit name.
    #[napi(getter)]
    pub fn numerator(&self) -> String {
        unit_to_string(self.inner.numerator)
    }

    /// The denominator unit name.
    #[napi(getter)]
    pub fn denominator(&self) -> String {
        unit_to_string(self.inner.denominator)
    }

    /// The compound symbol, e.g. `"m/s"`.
    #[napi(getter)]
    pub fn symbol(&self) -> String {
        self.inner.symbol()
    }

    /// Converts this derived quantity to different units.
    ///
    /// @param numerator   - Target numerator unit.
    /// @param denominator - Target denominator unit.
    /// @throws If the dimensions are incompatible.
    #[napi]
    pub fn to(&self, numerator: String, denominator: String) -> Result<DerivedQuantity> {
        let num = parse_unit(&numerator)?;
        let den = parse_unit(&denominator)?;
        self.inner
            .convert_to(num, den)
            .map(|q| DerivedQuantity { inner: q })
            .ok_or_else(|| {
                Error::new(
                    Status::InvalidArg,
                    "Cannot convert: incompatible dimensions",
                )
            })
    }

    /// Multiplies by a scalar.
    #[napi]
    pub fn mul(&self, scalar: f64) -> DerivedQuantity {
        DerivedQuantity {
            inner: self.inner.mul_scalar(scalar),
        }
    }

    /// Divides by a scalar.
    #[napi]
    pub fn div(&self, scalar: f64) -> DerivedQuantity {
        DerivedQuantity {
            inner: self.inner.div_scalar(scalar),
        }
    }

    /// Negates the value.
    #[napi]
    pub fn neg(&self) -> DerivedQuantity {
        DerivedQuantity {
            inner: self.inner.neg(),
        }
    }

    /// Formats as `"<value> <num_symbol>/<den_symbol>"`.
    #[napi]
    pub fn format(&self, precision: Option<i32>) -> String {
        let sym = self.inner.symbol();
        match precision {
            Some(p) if p >= 0 => format!("{:.prec$} {}", self.inner.value, sym, prec = p as usize),
            _ => format!("{} {}", self.inner.value, sym),
        }
    }

    /// Returns the derived quantity as a plain object.
    #[napi]
    pub fn to_json(&self) -> DerivedQuantityJson {
        DerivedQuantityJson {
            value: self.inner.value,
            numerator: unit_to_string(self.inner.numerator),
            denominator: unit_to_string(self.inner.denominator),
        }
    }

    /// Returns `"<value> <num_symbol>/<den_symbol>"`.
    #[napi(js_name = "toString")]
    pub fn to_string_js(&self) -> String {
        self.format(None)
    }
}

/// Plain JSON-serializable representation of a derived quantity.
#[napi(object)]
pub struct DerivedQuantityJson {
    pub value: f64,
    pub numerator: String,
    pub denominator: String,
}

// ─────────────────────────────────────────────────────────────────────────────
// Free functions
// ─────────────────────────────────────────────────────────────────────────────

/// Converts a numeric value from one unit to another.
///
/// This is a convenience function when you only need the converted number.
///
/// ```js
/// const { convert } = require('@siderust/qtty');
/// const km = convert(1000, 'Meter', 'Kilometer'); // 1.0
/// ```
///
/// @param value    - The numeric value.
/// @param fromUnit - Source unit name.
/// @param toUnit   - Target unit name.
/// @returns The converted value.
/// @throws If units are unknown or have different dimensions.
#[napi]
pub fn convert(value: f64, from_unit: String, to_unit: String) -> Result<f64> {
    let src = parse_unit(&from_unit)?;
    let dst = parse_unit(&to_unit)?;
    registry::convert_value(value, src, dst).map_err(ffi_error)
}

/// Checks whether two unit names refer to compatible units (same dimension).
///
/// ```js
/// const { isCompatible } = require('@siderust/qtty');
/// isCompatible('Meter', 'Kilometer'); // true
/// isCompatible('Meter', 'Second');    // false
/// ```
#[napi]
pub fn is_compatible(unit_a: String, unit_b: String) -> Result<bool> {
    let a = parse_unit(&unit_a)?;
    let b = parse_unit(&unit_b)?;
    Ok(registry::compatible(a, b))
}

/// Returns the dimension name for a unit, e.g. `"Length"`, `"Time"`.
///
/// ```js
/// const { unitDimension } = require('@siderust/qtty');
/// unitDimension('Meter');  // "Length"
/// unitDimension('Second'); // "Time"
/// ```
#[napi]
pub fn unit_dimension(unit: String) -> Result<String> {
    let id = parse_unit(&unit)?;
    registry::dimension(id)
        .map(|d| dimension_to_string(d).to_string())
        .ok_or_else(|| Error::new(Status::InvalidArg, format!("Unknown unit: \"{unit}\"")))
}

/// Returns the symbol for a unit, e.g. `"m"`, `"km"`, `"s"`.
///
/// ```js
/// const { unitSymbol } = require('@siderust/qtty');
/// unitSymbol('Meter');     // "m"
/// unitSymbol('Kilometer'); // "km"
/// ```
#[napi]
pub fn unit_symbol(unit: String) -> Result<String> {
    let id = parse_unit(&unit)?;
    if registry::meta(id).is_none() {
        return Err(Error::new(
            Status::InvalidArg,
            format!("Unknown unit: \"{unit}\""),
        ));
    }
    Ok(id.symbol().to_string())
}

/// Checks whether a unit name is valid (recognized by the registry).
///
/// ```js
/// const { isValidUnit } = require('@siderust/qtty');
/// isValidUnit('Meter');   // true
/// isValidUnit('Foobar');  // false
/// ```
#[napi]
pub fn is_valid_unit(unit: String) -> bool {
    parse_unit(&unit)
        .ok()
        .and_then(|id| registry::meta(id))
        .is_some()
}

/// Returns the FFI ABI version number.
#[napi]
pub fn ffi_version() -> u32 {
    qtty_ffi::qtty_ffi_version()
}

// ─────────────────────────────────────────────────────────────────────────────
// Unit enumeration
// ─────────────────────────────────────────────────────────────────────────────

/// Metadata about a single unit returned by `listUnits`.
#[napi(object)]
pub struct UnitInfo {
    /// Unit name, e.g. `"Meter"`.
    pub name: String,
    /// Unit symbol, e.g. `"m"`.
    pub symbol: String,
    /// Dimension name, e.g. `"Length"`.
    pub dimension: String,
}

/// Returns an array of all registered units with their name, symbol, and dimension.
///
/// This is useful for building dynamic UIs, documenting available units,
/// or generating unit factory collections at runtime.
///
/// ```js
/// const { listUnits } = require('@siderust/qtty');
/// const units = listUnits();
/// units.filter(u => u.dimension === 'Length').map(u => u.name);
/// ```
#[napi]
pub fn list_units() -> Vec<UnitInfo> {
    // Discriminant ranges from units.csv comments:
    // Length:  10000..=15009, 11000..=11008
    // Time:    20000..=23002
    // Angle:   30000..=32002
    // Mass:    40000..=42003
    // Power:   50000..=51003
    //
    // We iterate known ranges and collect valid IDs.
    let ranges: &[(u32, u32)] = &[
        (10000, 16000),
        (20000, 24000),
        (30000, 33000),
        (40000, 43000),
        (50000, 52000),
    ];

    let mut result = Vec::new();
    for &(start, end) in ranges {
        for discriminant in start..end {
            if let Some(id) = UnitId::from_u32(discriminant) {
                if let Some(meta) = registry::meta(id) {
                    result.push(UnitInfo {
                        name: unit_to_string(id),
                        symbol: id.symbol().to_string(),
                        dimension: dimension_to_string(meta.dim).to_string(),
                    });
                }
            }
        }
    }
    result
}
