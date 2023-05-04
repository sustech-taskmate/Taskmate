use std::fs::{File, create_dir_all, OpenOptions, remove_file};
use std::io::{Write};
use std::path::Path;
use reqwest::blocking::get;
use anyhow::{Result};
use flate2::read::GzDecoder;
use tar::Archive;
use walkdir::WalkDir;

#[tauri::command]
pub async fn analyze_dir(target: &str, origin: &str) -> Result<(), String>{
    let target = Path::new(target);
    let origin = Path::new(origin);
    //target is dir in origin
    let json_file = origin.join(Path::new("path.json"));
    File::create(&json_file).map_err(|err| err.to_string())?;
    let mut json_file = OpenOptions::new().write(true).open(&json_file).map_err(|err| err.to_string())?;
    let dir = WalkDir::new(target);
    write!(json_file, "{{\"data\":[").map_err(|err| err.to_string())?;
    let target = target.to_str().ok_or("to str error")?;
    let len=target.len();
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
        let simple_path = simple_path.replace("\\","/");
        let path = path.replace("\\","/");
        if comma {
            write!(json_file, ",{{ \"name\" : \"{}\", \"dir\" : {}, \"url\" : \"{}\" }}\n", simple_path, is_dir, path).map_err(|err| err.to_string())?;
        }
        else {
            write!(json_file, "{{ \"name\" : \"{}\", \"dir\" : {}, \"url\" : \"{}\" }}\n", simple_path, is_dir, path).map_err(|err| err.to_string())?;
        }
        comma=true;
    }
    write!(json_file, "]}}").map_err(|err| err.to_string())?;
    Ok(())
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

fn extract_targz(test: &Path, target: &Path) -> Result<()>{
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
pub fn download_file(url: &str, filePath: &str) -> Result<(), String> {
    let should_extract : ExtractOperationType;
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
    let file_name = Path::new(url).file_name().ok_or("get filename error")?;
    let root_path = Path::new(filePath).join("student_file");
    let filePath = Path::new(filePath).join("student_file").join(file_name);
    let zip_path = filePath.file_stem().ok_or("get file stem error")?;
    let zip_path = Path::new(&root_path).join(zip_path);
    if !root_path.exists(){
        create_dir_all(&root_path).map_err(|err| err.to_string())?;
    }
    // drop(root_path);
    let result = File::create(&filePath);
    match result {
        Ok(mut file) => {
            file.write_all(slice).map_err(|err| err.to_string())?;
            // drop(file);

            #[cfg(target_os = "windows")]
            {
                if should_extract == ExtractOperationType::Zip {
                    // extract(&filePath,  &zip_path, &origin_path);
                    extract_zip(&filePath,  &zip_path).map_err(|err| err.to_string())?;
                    //delete filePath
                }
                if should_extract == ExtractOperationType::TarGz{
                    extract_targz(&filePath, &zip_path).map_err(|err| err.to_string())?;
                    //delete filePath
                }
            }
            #[cfg(target_os = "macos")]
            todo!();
            // if should_extract {
            //     extract(&filePath,  &zip_path, &origin_path);
            // }
            #[cfg(not(any(target_os = "windows", target_os = "macos")))]
            {
                compile_error!("test");
            }
            Ok(())
        },
        Err(err) => {
            // create file failed
            println!("create file failed：{}", err);
            Err("create file failed".to_string())
        }
    }
}


#[cfg(test)]
mod tests {
    // 注意这个惯用法：在 tests 模块中，从外部作用域导入所有名字。
    use super::*;

    #[test]
    fn test_bad_add() {
        // download_file("https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-large-zip-file.zip", "C:\\Users\\31028\\Desktop\\test").unwrap();
        // download_file("https://www.learningcontainer.com/wp-content/uploads/2020/05/sample.tar", "D:\\Desktop\\test").unwrap();
        // let file_path=Path::new("C:\\Users\\31028\\Desktop\\test").join("qwq.zip");
        // extract(&file_path,Path::new("C:\\Users\\31028\\Desktop\\test\\qwq"));
        // let file_path=Path::new("D:\\Desktop\\test\\student_file").join("sample.tar");
        // extract_targz(&file_path,Path::new("D:\\Desktop\\test\\student_file\\sample")).unwrap();
        // analyze_dir(Path::new("D:\\Desktop\\test\\student_file"), Path::new("D:\\Desktop\\test")).unwrap();
    }

    #[test]
    fn test_canonical() -> Result<()> {
        let name = "D:/Desktop";
        let path = Path::new(name);
        let canonical = path.canonicalize();
        Ok(())
    }
}

pub use custom_error_set::*;

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

    impl Error for FileNameMiss {
    }

    impl Display for FilePostfixMiss {
        fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
            write!(f, "{:?}", self)
        }
    }

    impl Error for FilePostfixMiss {
    }

}

