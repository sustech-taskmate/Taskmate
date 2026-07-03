use tauri::{
    menu::MenuBuilder,
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, Manager,
};

pub fn setup(app: &mut App) -> tauri::Result<()> {
    let menu = MenuBuilder::new(app)
        .text("hide", "Hide")
        .text("show", "Show")
        .separator()
        .text("fullscreen", "Fullscreen")
        .text("window", "Window")
        .separator()
        .text("quit", "Quit")
        .build()?;

    TrayIconBuilder::with_id("main")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                if let Some(window) = tray.app_handle().get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .on_menu_event(|app, event| {
            let Some(window) = app.get_webview_window("main") else {
                return;
            };

            match event.id().as_ref() {
                "quit" => app.exit(0),
                "show" => {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
                "hide" => {
                    let _ = window.hide();
                }
                "fullscreen" => {
                    let _ = window.set_fullscreen(true);
                }
                "window" => {
                    let _ = window.set_fullscreen(false);
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}
