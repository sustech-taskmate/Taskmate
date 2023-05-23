import {invoke} from "@tauri-apps/api/tauri";
import {exists, readTextFile} from "@tauri-apps/api/fs";
import {AssignFileType, FileTreeNode, ZipFile} from "@/store/assign";
import {appDataDir} from "@tauri-apps/api/path";

async function downloadAll(path: string, urls: string[], submitId: string, names?: string[]) {
    if (names) {
        for (let i = 0; i < urls.length; i++) {
            await downloadFile(path, urls[i], submitId, names[i]);
        }
    }
    else {
        for (let i = 0; i < urls.length; i++) {
            await downloadFile(path, urls[i], submitId, "");
        }
    }
}

export async function downloadFile(path: string, url: string, submitId: string, name: string) {
    /*
        test url:
        let url = "https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.pdf"      //pdf
        let url = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip";    //small zip
        let url = "https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.zip";      //zip
     */
    path += "\\" + submitId;
    // console.log(path)
    invoke('download_file', {url: url, filePath: path, fileName: name}).then(
        (resolved: any) => {
            // console.log(resolved)
        }
    ).catch((err) => {
        // console.log(err)
    });
}

export {downloadAll}
