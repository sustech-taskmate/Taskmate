// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod file_handler;
mod protocol;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![protocol::reg_url_protocol])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
