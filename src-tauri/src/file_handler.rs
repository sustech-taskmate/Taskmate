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
use std::io::{Read, Cursor};
use std::path::{PathBuf};
use std::error::Error;
use zip::ZipArchive;
use encoding::{DecoderTrap, Encoding};
use std::borrow::Cow;
use encoding_rs::GBK;

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

fn decompress_zip_file<P: AsRef<Path>>(zip_file_path: P, directory: P) -> Result<(), Box<dyn Error>> {
    let file = File::open(zip_file_path)?;
    let mut zip_archive = ZipArchive::new(file)?;

    for i in 0..zip_archive.len() {
        let mut zip_file = zip_archive.by_index(i)?;
        let entry_name = GBK.decode(&zip_file.name_raw()).0.into_owned().to_string();

        let decoded =
            if guess_zip_file_name_utf8(&zip_file.name()) {
                zip_file.name()
            }
            else {
                &entry_name
            };

        let output_file_path = directory.as_ref().join(PathBuf::from(decoded.to_string()));

        if decoded.ends_with('/') {
            create_dir_all(&output_file_path)?;
        }
        else {
            if let Some(p) = output_file_path.parent() {
                if !p.exists() {
                    create_dir_all(p)?;
                }
            }
            let mut output_file = File::create(&output_file_path)?;
            let mut buffer = Vec::new();
            zip_file.read_to_end(&mut buffer)?;
            let mut cursor = Cursor::new(buffer);
            std::io::copy(&mut cursor, &mut output_file)?;
        }
    }
    Ok(())
}

fn is_utf8(file_name: &str) -> bool {
    file_name.is_char_boundary(file_name.len())
}
fn is_chinese_character(c: char) -> bool {
    let unicode_value = c as u32;
    unicode_value >= 0x4E00 && unicode_value <= 0x9FFF
}
fn is_chinese_charset(file_name: &str) -> bool {
    for c in file_name.chars() {
        let unicode_value = c as u32;
        if (unicode_value >= 0x4E00 && unicode_value <= 0x9FFF) || (unicode_value >= 0x00 && unicode_value <= 0x7F) {
            continue; // 中文字符集或ASCII标准字符
        } else {
            return false;
        }
    }
    true
}
fn guess_zip_file_name_utf8(file_name: &str) ->  bool {
    if is_utf8(file_name) && is_chinese_charset(file_name) {
        true
    }
    else {
        false
    }
}

fn extract_zip(test: &Path, target: &Path) -> Result<()> {
    if !target.exists() {
        create_dir_all(&target)?;
    }
    decompress_zip_file(test,target).expect("extract zip failed");
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
    use serde_json::Value::String;
    use tauri::async_runtime::block_on;
    use tokio::io::AsyncReadExt;
    use zip::read::ZipFile;

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
    fn extract_zip_win() {
        #[cfg(target_os = "windows")]
        {
            let file_path = Path::new("D:\\Desktop\\qwq").join("test2.zip");
            extract_zip(&file_path,Path::new("D:\\Desktop\\qwq\\test2")).unwrap();
            // extract_zip(&file_path, Path::new("D:\\Desktop\\qwq\\test"));
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
