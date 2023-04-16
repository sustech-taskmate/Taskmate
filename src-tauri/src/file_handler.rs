use std::{env, fs, io};
use std::error::Error;
use std::fmt::{Display, Formatter};
use std::fs::{File, create_dir_all, read, OpenOptions};
use std::io::{BufReader, copy, Read, Write};
use std::path::{Path, PathBuf};
use reqwest::blocking::get;
use anyhow::{anyhow, Result};

pub fn remove_all() -> Result<()> {
    todo!()
}

fn extract(test: &Path, target: &Path, origin: &Path) -> Result<()> {
    let zipfile = File::open(&test)?;
    let mut zip = zip::ZipArchive::new(zipfile)?;

    if !target.exists() {
        create_dir_all(target)?;
    }

    let json_file = origin.join(Path::new("path.json"));

    let mut json_file = OpenOptions::new().write(true).append(true).open(&json_file)?;


    zip.extract(target)?;

    let mut dir = fs::read_dir(target)?;
    for f in dir {
        let f = f?;
        let p = f.path();
        let path = p.to_str().ok_or(anyhow::format_err!("OsStr Error"))?;
        let simple_path = path;
        let is_dir = f.file_type()?.is_dir();
        let path = p.canonicalize()?;
        #[cfg(target_os = "windows")]
        let path = {
            let path_str = path.to_str().ok_or(anyhow!("??"))?;
            if let Some(path_str) = path_str.strip_prefix("\\\\?\\") {
                path_str
            } else if let Some(path_str) = path_str.strip_prefix("\\\\.\\") {
                path_str
            } else {
                path_str
            }
        };
        write!(json_file, "ZipFile {{ name : '{}', dir : {}, url : 'file://{}' }}\n", simple_path, is_dir, path)?;
    }

    Ok(())

}

#[derive(Default, Copy, Clone, PartialEq, Eq)]
enum ExtractOperationType {
    #[default]
    None,
    Zip,
}


pub fn download_file(url: &str, file_path: &str) -> Result<()> {
    dbg!("Are you here?");

    let should_extract : ExtractOperationType;
    let mut response = get(url)?;
    let bytes = response.bytes()?;
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
    let file_name = Path::new(url).file_name().ok_or(FileNameMiss)?;
    let origin_path = Path::new(file_path);
    let file_path = Path::new(file_path).join(file_name);
    let zip_path = file_path.file_stem().ok_or(FilePostfixMiss)?;
    let zip_path = Path::new(zip_path);
    dbg!("Are you here?");

    let result = File::create(&file_path);
    match result {
        Ok(mut file) => {
            file.write_all(slice)?;
            drop(file);
            dbg!("Are you here?");

            #[cfg(target_os = "windows")]
            {
                if should_extract == ExtractOperationType::Zip {
                    // extract(&file_path,  &zip_path, &origin_path);
                    dbg!("Are you here?");
                    extract(&file_path,  &zip_path, &origin_path)?;
                }
            }
            #[cfg(target_os = "macos")]
            if should_extract {
                extract(&file_path,  &zip_path, &origin_path);
            }
            #[cfg(not(any(target_os = "windows", target_os = "macos")))]
            {
                compile_error!("test");
            }
            Ok(())
        },
        Err(err) => {
            // create file failed
            println!("create file failed：{}", err);
            return Err(err.into());
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
        download_file("https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip", "D:\\Desktop\\test").unwrap();
        // let file_path=Path::new("C:\\Users\\31028\\Desktop\\test").join("qwq.zip");
        // extract(&file_path,Path::new("C:\\Users\\31028\\Desktop\\test\\qwq"));
    }

    #[test]
    fn test_canonical() -> Result<()> {
        let name = "D:/Desktop";
        let path = Path::new(name);
        let canonical = path.canonicalize();
        dbg!(canonical);
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

