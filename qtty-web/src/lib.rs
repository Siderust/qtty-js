//! Browser/WASM bindings for `qtty` physical quantities — free-function backend.
//!
//! This crate provides the same set of primitive free functions as the Node
//! backend (`qtty-node`) but using `wasm-bindgen` instead of `napi-rs`.
//! The public JS façade classes (`Quantity`, `DerivedQuantity`) are shared
//! across both backends.

use qtty_ffi::registry;
use qtty_ffi::{DimensionId, UnitId};
use wasm_bindgen::prelude::*;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

fn parse_unit(name: &str) -> Result<UnitId, JsValue> {
    let json = format!("\"{}\"", name);
    serde_json::from_str::<UnitId>(&json)
        .map_err(|_| JsValue::from_str(&format!("Unknown unit: \"{name}\"")))
}

fn dimension_to_string(dim: DimensionId) -> &'static str {
    match dim {
        DimensionId::Length => "Length",
        DimensionId::Time => "Time",
        DimensionId::Angle => "Angle",
        DimensionId::Mass => "Mass",
        DimensionId::Power => "Power",
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Free functions (backend primitives for the JS façade)
// ─────────────────────────────────────────────────────────────────────────────

#[wasm_bindgen]
pub fn convert(value: f64, from_unit: &str, to_unit: &str) -> Result<f64, JsValue> {
    let src = parse_unit(from_unit)?;
    let dst = parse_unit(to_unit)?;
    registry::convert_value(value, src, dst)
        .map_err(|code| JsValue::from_str(&format!("Conversion error (code {})", code)))
}

#[wasm_bindgen(js_name = "isCompatible")]
pub fn is_compatible(unit_a: &str, unit_b: &str) -> Result<bool, JsValue> {
    let a = parse_unit(unit_a)?;
    let b = parse_unit(unit_b)?;
    Ok(registry::compatible(a, b))
}

#[wasm_bindgen(js_name = "unitDimension")]
pub fn unit_dimension(unit: &str) -> Result<String, JsValue> {
    let id = parse_unit(unit)?;
    registry::dimension(id)
        .map(|d| dimension_to_string(d).to_string())
        .ok_or_else(|| JsValue::from_str(&format!("Unknown unit: \"{unit}\"")))
}

#[wasm_bindgen(js_name = "unitSymbol")]
pub fn unit_symbol(unit: &str) -> Result<String, JsValue> {
    let id = parse_unit(unit)?;
    if registry::meta(id).is_none() {
        return Err(JsValue::from_str(&format!("Unknown unit: \"{unit}\"")));
    }
    Ok(id.symbol().to_string())
}

#[wasm_bindgen(js_name = "isValidUnit")]
pub fn is_valid_unit(unit: &str) -> bool {
    parse_unit(unit)
        .ok()
        .and_then(|id| registry::meta(id))
        .is_some()
}

#[wasm_bindgen(js_name = "ffiVersion")]
pub fn ffi_version() -> u32 {
    qtty_ffi::qtty_ffi_version()
}

#[wasm_bindgen(js_name = "listUnits")]
pub fn list_units() -> JsValue {
    let ranges: &[(u32, u32)] = &[
        (10000, 16000),
        (20000, 24000),
        (30000, 33000),
        (40000, 43000),
        (50000, 52000),
    ];

    let arr = js_sys::Array::new();
    for &(start, end) in ranges {
        for discriminant in start..end {
            if let Some(id) = UnitId::from_u32(discriminant) {
                if let Some(meta) = registry::meta(id) {
                    let obj = js_sys::Object::new();
                    js_sys::Reflect::set(&obj, &"name".into(), &id.name().into()).unwrap();
                    js_sys::Reflect::set(&obj, &"symbol".into(), &id.symbol().into()).unwrap();
                    js_sys::Reflect::set(
                        &obj,
                        &"dimension".into(),
                        &dimension_to_string(meta.dim).into(),
                    )
                    .unwrap();
                    arr.push(&obj);
                }
            }
        }
    }
    arr.into()
}
