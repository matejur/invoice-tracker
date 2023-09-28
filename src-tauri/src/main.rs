// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_years() -> Vec<i32> {
    vec![2022, 2023, 2024]
}

#[tauri::command]
fn get_months(year: i32) -> Option<Vec<i32>> {
    match year {
        2022 => Some(vec![8, 9, 10, 11]),
        2023 => Some(vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
        2024 => Some(vec![0, 1, 2, 3]),
        _ => None,
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_years, get_months])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
