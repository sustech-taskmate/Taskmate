// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::env;

use tauri::{*};
use url::Url;

mod file_handler;
mod tray;
mod browser;

#[derive(Clone, serde::Serialize)]
struct Payload {
    token: String,
}

fn main() {
    // protocol::reg_url_protocol();
    tauri_plugin_deep_link::prepare("taskmate");
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            tauri_plugin_deep_link::register(
                "taskmate",
                move |request| {
                    let query = Url::parse(request.as_str()).unwrap();
                    let query_map = query.query_pairs().into_owned().collect::<std::collections::HashMap<_, _>>();
                    let token = query_map.get("token").unwrap().to_string();
                    handle.emit_all("authenticate", Payload { token }).unwrap();
                },
            );
            app.listen_global("authenticate", |_event| { browser::open_browser("https://spaces.sustech.cloud/"); });
            Ok(())
        })
        .system_tray(tray::menu())
        .on_system_tray_event(tray::handler)
        .invoke_handler(tauri::generate_handler![file_handler::download_file,file_handler::analyze_dir,file_handler::upload_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
