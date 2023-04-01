
use std::fs::File;
use std::path::Path;
use reqwest::blocking::get;


async fn download_file(url: &str, file_path: &str) -> std::result::Result<(), String> {
    let mut response = get(url).map_err(|e| e.to_string())?;
    let file_name = Path::new(url).file_name().ok_or_else(|| "get file name failed".to_string() )?;
    let file_path = Path::new(file_path).join(file_name);
    println!("{}",file_path.display());
    let result = File::create(file_path);
    match result {
        Ok(mut file) => {
            println!("create file success");
            response.copy_to(&mut file).map_err(|e| e.to_string())?;
            Ok(())
        },
        Err(err) => {
            // create file failed
            println!("create file failed：{}", err);
            return Err(err.to_string())
        }
    }
}