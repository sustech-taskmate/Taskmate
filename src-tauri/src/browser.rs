use std::process::Command;

pub fn open_browser(uri: &str) -> Result<(), ()> {
    #[cfg(target_os = "linux")]
        {
            let xdg_open_exists = Command::new("sh")
                .arg("-c")
                .arg("command -v xdg-open")
                .output()
                .is_ok();

            if xdg_open_exists {
                Command::new("xdg-open")
                    .arg(uri)
                    .spawn()
                    .map_err(drop)?;
            }
        }

    #[cfg(target_os = "macos")]
        {
            Command::new("sh")
                .arg("-c")
                .arg(format!(
                    "{} '/Applications/Safari.app' '{}' >/dev/null 2>&1",
                    "open -a",
                    uri.to_string()
                ))
                .output()
                .map_err(drop)?;
        }

    #[cfg(target_os = "windows")]
        {
            Command::new("cmd")
                .arg("/C")
                .arg("start")
                .arg(uri)
                .spawn()
                .map_err(drop)?;
        }

    Ok(())
}