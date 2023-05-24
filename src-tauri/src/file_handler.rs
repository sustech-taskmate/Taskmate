use std::fs::{create_dir_all, File, remove_file};
use std::io::Write;
use std::path::Path;

use anyhow::Result;
use flate2::read::GzDecoder;
use mime;
use reqwest::blocking::get;
use reqwest::multipart;
use tar::Archive;
use walkdir::WalkDir;

pub use custom_error_set::*;

#[tauri::command]
pub async fn analyze_dir(target: &str) -> Result<String, String> {
    let target = Path::new(target);
    let dir = WalkDir::new(target);
    let mut result_json = "".to_string();
    result_json += "{\"data\":[";
    let target = target.to_str().ok_or("to str error")?;
    let len = target.len();
    let mut comma = false;
    for f in dir {
        let f = f.map_err(|err| err.to_string())?;
        let p = f.path();
        let path = p.to_str().ok_or("to str error")?;
        let simple_path = path.to_string();
        let simple_path = &simple_path[len..];
        let is_dir = f.file_type().is_dir();
        let path = Path::new(path);
        #[cfg(target_os = "windows")]
            let path = {
            let path_str = path.to_str().ok_or("to str error")?;
            if let Some(path_str) = path_str.strip_prefix("\\\\?\\") {
                path_str
            } else if let Some(path_str) = path_str.strip_prefix("\\\\.\\") {
                path_str
            } else {
                path_str
            }
        };
        #[cfg(target_os = "macos")]
            let path = path.to_str().ok_or("to str error")?;
        #[cfg(target_os = "linux")]
            let path = path.to_str().unwrap();
        let simple_path = simple_path.replace("\\", "/");
        let path = path.replace("\\", "/");
        if comma {
            result_json += &*format!(",{{ \"name\" : \"{}\", \"dir\" : {}, \"url\" : \"{}\" }}\n", simple_path, is_dir, path);
        } else {
            result_json += &*format!("{{ \"name\" : \"{}\", \"dir\" : {}, \"url\" : \"{}\" }}\n", simple_path, is_dir, path);
        }
        comma = true;
    }
    result_json += "]}";
    Ok(result_json)
}

fn extract_zip(test: &Path, target: &Path) -> Result<()> {
    let zipfile = File::open(&test)?;
    let mut zip = zip::ZipArchive::new(zipfile)?;

    if !target.exists() {
        create_dir_all(target)?;
    }
    zip.extract(target)?;
    remove_file(&test)?;
    Ok(())
}

fn extract_targz(test: &Path, target: &Path) -> Result<()> {
    let tar_gz = File::open(test)?;
    let tar = GzDecoder::new(tar_gz);
    let mut archive = Archive::new(tar);
    if !target.exists() {
        create_dir_all(target)?;
    }
    archive.unpack(target)?;
    // remove_file(&test)?;
    Ok(())
}

#[derive(Default, Copy, Clone, PartialEq, Eq)]
enum ExtractOperationType {
    #[default]
    None,
    Zip,
    TarGz,
}

#[tauri::command]
pub async fn upload_file(url: &str, file_path: &str, key: &str, token: &str) -> Result<(), String> {
    let file_content = tokio::fs::read(file_path).await.map_err(|err| err.to_string())?;

    let client = reqwest::Client::new();

    let part = multipart::Part::stream(file_content)
        .mime_str(mime::APPLICATION_OCTET_STREAM.as_ref())
        .unwrap();

    let form = multipart::Form::new()
        .part("file", part)
        .text("key", key.to_owned())
        .text("token", token.to_owned());

    client.post(url)
        .multipart(form)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    Ok(())
}


#[tauri::command]
pub fn download_file(url: &str, file_path: &str, file_name: &str) -> Result<(), String> {
    let should_extract: ExtractOperationType;
    let response = get(url).map_err(|err| err.to_string())?;
    let bytes = response.bytes().map_err(|err| err.to_string())?;
    let bit = bytes.iter();
    let slice = bit.as_slice();
    match *slice {
        [80, 75, 3, 4, ..] => {
            should_extract = ExtractOperationType::Zip;
        }
        _ => {
            should_extract = ExtractOperationType::None;
        }
    }
    let file_name = {
        if file_name.to_string().is_empty() {
            Path::new(url).file_name().ok_or("get filename error")?.to_str().ok_or("trans to str error")?
        } else {
            file_name
        }
    };
    let root_path = Path::new(file_path);
    let file_path = Path::new(file_path).join(file_name);
    let zip_path = file_path.file_stem().ok_or("get file stem error")?;
    let zip_path = Path::new(&root_path).join(zip_path);
    if !root_path.exists() {
        create_dir_all(&root_path).map_err(|err| err.to_string())?;
    }
    // drop(root_path);
    let result = File::create(&file_path);
    match result {
        Ok(mut file) => {
            file.write_all(slice).map_err(|err| err.to_string())?;
            // drop(file);

            #[cfg(target_os = "windows")]
                {
                    if should_extract == ExtractOperationType::Zip {
                        // extract(&filePath,  &zip_path, &origin_path);
                        extract_zip(&file_path, &zip_path).map_err(|err| err.to_string())?;
                        //delete filePath
                    }
                    if should_extract == ExtractOperationType::TarGz {
                        extract_targz(&file_path, &zip_path).map_err(|err| err.to_string())?;
                        //delete filePath
                    }
                }
            #[cfg(target_os = "macos")]
                {
                    if should_extract == ExtractOperationType::Zip {
                        // extract(&filePath,  &zip_path, &origin_path);
                        extract_zip(&file_path, &zip_path).map_err(|err| err.to_string())?;
                        //delete filePath
                    }
                }
            // if should_extract {
            //     extract(&filePath,  &zip_path, &origin_path);
            // }
            #[cfg(not(any(target_os = "windows", target_os = "macos")))]
                {
                    compile_error!("test");
                }
            Ok(())
        }
        Err(err) => {
            // create file failed
            println!("create file failed：{}", err);
            Err("create file failed".to_string())
        }
    }
}


#[cfg(test)]
mod tests {
    use tauri::async_runtime::block_on;

    use super::*;

    #[test]
    fn test_win() {
        #[cfg(target_os = "windows")]
            {
                download_file("https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.zip",
                              "D:\\Desktop\\testStudent",
                              "test.zip",
                ).unwrap();
                let task = analyze_dir(Path::new(
                    "D:\\Desktop\\testStudent"
                ).to_str().unwrap());
                block_on(task).unwrap();
            }
    }

    #[test]
    fn test_mac() {
        #[cfg(target_os = "macos")]
            {
                download_file("https://www.learningcontainer.com/wp-content/uploads/2020/05/sample.tar", "./res/testStudent", "sample.tar").unwrap();
                let task = analyze_dir(Path::new(
                    "./res/testStudent"
                ).to_str().unwrap());
                block_on(task).unwrap();
            }
    }

    #[test]
    fn test_canonical() -> Result<()> {
        let name = "D:/Desktop";
        let path = Path::new(name);
        let canonical = path.canonicalize();
        Ok(())
    }
}

pub mod custom_error_set {
    use std::error::Error;
    use std::fmt::{Display, Formatter};

    #[derive(Debug)]
    pub struct FileNameMiss;

    #[derive(Debug)]
    pub struct FilePostfixMiss;

    impl Display for FileNameMiss {
        fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
            write!(f, "{:?}", self)
        }
    }

    impl Error for FileNameMiss {}

    impl Display for FilePostfixMiss {
        fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
            write!(f, "{:?}", self)
        }
    }

    impl Error for FilePostfixMiss {}
}
