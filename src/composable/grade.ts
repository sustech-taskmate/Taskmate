import {invoke} from "@tauri-apps/api/tauri";
import {exists, readTextFile} from "@tauri-apps/api/fs";
import {FileTreeNode, ZipFile} from "@/store/assign";
import {appDataDir} from "@tauri-apps/api/path";

async function downloadFile(/*url: string, submitId: string*/) {
    /*
        test url:
        let url = "https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.pdf"      //pdf
        let url = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip";    //small zip
        let url = "https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.zip";      //zip
     */
    let url = "https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.pdf"      //pdf
    let submitId = "123456";

    let path = await getDownloadPath();
    path += "\\taskmate"+"\\"+submitId;
    // console.log(path)
    invoke('download_file', {url: url, filePath: path}).then(
        (resolved: any) => {
            // console.log(resolved)
        }
    ).catch((err) => {
        // console.log(err)
    });
}

async function analyzeDir(/*submitId: string*/){
    let submitId = "123456";
    let path = await getDownloadPath();
    path += "\\taskmate"+"\\"+submitId;
    const origin = path;

    await invoke('analyze_dir', {target: path + "\\student_file", origin: origin})
    // from origin path get path.json and buildFileTree
    let fPath: string = path.concat("\\").concat("path.json");
    // console.log(fPath);
    exists(fPath).then()
        .catch((err) => {
            // console.log(err);
        })
    const fileContent = await readTextFile(fPath);
    const zipFiles: ZipFile[] = JSON.parse(fileContent).data as ZipFile[];
    return buildFileTree("student_file", zipFiles);
}


async function getDownloadPath(): Promise<string> {
    return appDataDir()
}

function buildFileTree(zipName: string, zipFiles: ZipFile[]): FileTreeNode {
    const root = new FileTreeNode(zipName, true, true, '');
    zipFiles.sort((a: ZipFile, b: ZipFile) => a.name.length - b.name.length);
    const map = new Map<string, FileTreeNode>();
    map.set('', root);
    for (const file of zipFiles) {
        let dirName = file.name;
        if (dirName=="")continue;
        dirName=dirName.substring(1);
        if (file.dir) {
            dirName += '/';
            let substring = dirName.substring(0, dirName.length - 1);
            let index = substring.lastIndexOf('/');
            if (index === -1) {
                let p = new FileTreeNode(substring, true, false, file.url);
                p.parent = root;
                root.children.push(p);
                map.set(dirName, p);
            } else {
                substring = dirName.substring(index + 1, dirName.length - 1);
                let p = new FileTreeNode(substring, true, false, file.url);
                p.parent = map.get(dirName.substring(0, index + 1));
                (map.get(dirName.substring(0, index + 1)) as FileTreeNode).children.push(p);
                map.set(dirName, p);
            }
        } else {
            let index = dirName.lastIndexOf('/');
            if (index === -1) {
                let p = new FileTreeNode(dirName, false, false, file.url);
                p.parent = root;
                root.children.push(p);
            } else {
                let p = new FileTreeNode(dirName.substring(index + 1), false, false, file.url);
                p.parent = map.get(dirName.substring(0, index + 1));
                (map.get(dirName.substring(0, index + 1)) as FileTreeNode).children.push(p);
            }
        }
    }
    return root;
}

export {downloadFile, analyzeDir}
