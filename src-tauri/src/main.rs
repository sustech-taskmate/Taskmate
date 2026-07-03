// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use tauri::{Emitter, Listener};
use tauri_plugin_deep_link::DeepLinkExt;
use url::Url;

mod browser;
mod file_handler;
mod tray;

#[derive(Clone, serde::Serialize)]
struct Payload {
    code: Option<String>,
    state: Option<String>,
    token: Option<String>,
    url: String,
}

#[derive(serde::Deserialize)]
struct AuthRequest {
    url: String,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            let handle = app.handle().clone();
            let _ = handle.deep_link().register_all();
            handle.deep_link().on_open_url({
                let handle = handle.clone();
                move |event| {
                    for url in event.urls() {
                        emit_auth_token(&handle, url);
                    }
                }
            });
            handle.listen("authenticate", |_event| {
                if let Ok(payload) = serde_json::from_str::<AuthRequest>(_event.payload()) {
                    let _ = browser::open_browser(&payload.url);
                }
            });
            tray::setup(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            file_handler::download_file,
            file_handler::analyze_dir,
            file_handler::upload_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn emit_auth_token(handle: &tauri::AppHandle, url: Url) {
    let raw_url = url.to_string();
    let code = url
        .query_pairs()
        .find_map(|(key, value)| (key == "code").then(|| value.into_owned()));
    let token = url
        .query_pairs()
        .find_map(|(key, value)| (key == "token").then(|| value.into_owned()));

    let state = url
        .query_pairs()
        .find_map(|(key, value)| (key == "state").then(|| value.into_owned()));
    let _ = handle.emit("authenticate", Payload { code, state, token, url: raw_url });
}
