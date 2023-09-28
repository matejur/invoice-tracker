// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod parser;

use parser::{parse_xml_file, Invoice};

#[tauri::command]
fn parse_xml(path: &str) -> Result<Invoice, String> {
    parse_xml_file(path).map_err(|err| err.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![parse_xml])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
