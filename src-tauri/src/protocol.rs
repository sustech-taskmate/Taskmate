use std::env;
use std::process::Command;
use std::fs::File;
use std::io::prelude::*;

#[tauri::command]
pub async fn reg_url_protocol() -> Result<(), String>{
    let os: &str = env::consts::OS;
    let mut exe = env::current_exe().unwrap();

    match os {
        "windows" => {
            let exe: &str = exe.to_str().unwrap();

            Command::new("reg.exe")
                .args(&["add", "HKEY_CLASSES_ROOT\\taskmate"])
                .args(&["/v", "URL Protocol"])
                .args(&["/t", "REG_SZ"])
                .args(&["/d", "taskmate Protocol"])
                .output()
                .unwrap();

            Command::new("reg.exe")
                .args(&["add", "HKEY_CLASSES_ROOT\\taskmate", "\\shell\\open\\command"])
                .arg(&"/ve")
                .args(&["/d", &format!(r#""{}" "%1""#, exe)])
                .output()
                .unwrap();

            Ok(())
        }
        "macos" => {
            let mut path = exe;
            path.pop();
            path.push("Contents/Info.plist");

            let mut file = File::create(path).map_err(|err| err.to_string())?;
            let plist_content = r#"
            <?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
            <plist version="1.0">
            <dict>
                <key>CFBundleURLTypes</key>
                <array>
                    <dict>
                        <key>CFBundleURLName</key>
                        <string>Taskmate Protocol</string>
                        <key>CFBundleURLSchemes</key>
                        <array>
                            <string>taskmate</string>
                        </array>
                    </dict>
                </array>
            </dict>
            </plist>
            "#;
            file.write_all(plist_content.as_bytes()).map_err(|err| err.to_string())?;

            Ok(())
        }
        _ => {
            Err("fail to open taskmate".to_string())
        }
    }
}