use std::env;
use std::fs::File;
use std::io::prelude::*;
use std::process::Command;

#[tauri::command]
pub fn reg_url_protocol() -> Result<(), String> {
    let os: &str = env::consts::OS;
    let exe = env::current_exe().unwrap();
    match os {
        "windows" => {
            let exe = exe.to_str().unwrap();
            let registry = Command::new("cmd")
                .arg("/c")
                .args(&["reg", "query", "HKCR\\taskmate", "/s"])
                .output()
                .expect("failed to execute command");
            let stdout = String::from_utf8_lossy(&registry.stdout).to_string();
            if stdout.contains(&exe) {
                return Ok(());
            }

            let exe = exe.replace("\\", "\\\\");
            let output = Command::new("powershell")
                .arg("-Command")
                .arg("Start-Process")
                .arg("-FilePath")
                .arg("cmd")
                .arg("\'/c")
                .args(&["reg", "add", "HKEY_CLASSES_ROOT\\taskmate", "/v", "\"URL Protocol\"", "/t", "REG_SZ", "/d", "\"taskmate Protocol\"", "/f"])
                .arg("&")
                .args(&["reg", "add", "HKEY_CLASSES_ROOT\\taskmate\\shell\\open\\command", "/ve", "/d", &format!(r#"{}" "%1"#, exe), "/f"])
                .arg("\'")
                .arg("-Verb")
                .arg("runas")
                .output()
                .expect("failed to execute command");
            if !output.status.success() {
                panic!("Failed to register protocol handler: {:?}", String::from_utf8_lossy(&output.stdout));
            }

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