import {invoke} from "@tauri-apps/api/tauri";
import {AssignFileType, FileTreeNode, ZipFile} from "@/store/assign";
import {appDataDir} from "@tauri-apps/api/path";

async function downloadAll(urls: string[], submitId: string, names?: string[]) {
    if (names) {
        for (let i = 0; i < urls.length; i++) {
            await downloadFile(urls[i], submitId, names[i]);
        }
    }
    else {
        for (let i = 0; i < urls.length; i++) {
            await downloadFile(urls[i], submitId, "");
        }
    }
}

export async function downloadFile(url: string, submitId: string, name: string) {
    /*
        test url:
        let url = "https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.pdf"      //pdf
        let url = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip";    //small zip
        let url = "https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.zip";      //zip
     */
    let path = await getDownloadPath();
    if (path.includes("\\"))
        path += "\\taskmate\\" + submitId;
    else
        path += "/taskmate/" + submitId
    // console.log(path)
    await invoke('download_file', {url: url, filePath: path, fileName: name})
}

async function analyzeDir(submitId: string) {
    let path = await getDownloadPath();

    if (path.includes("\\"))
        path += "\\taskmate\\" + submitId;
    else
        path += "/taskmate/" + submitId
    const fileContent: string = await invoke('analyze_dir', {target: path})
    const zipFiles: ZipFile[] = JSON.parse(fileContent).data as ZipFile[];
    return buildFileTree("student_file", zipFiles);
}

export async function getDownloadPath(): Promise<string> {
    return appDataDir()
}

export function buildFileTree(zipName: string, zipFiles: ZipFile[]): FileTreeNode {
    const root = new FileTreeNode(zipName, true, true, '', AssignFileType.placeholder);
    zipFiles.sort((a: ZipFile, b: ZipFile) => a.name.length - b.name.length);
    const map = new Map<string, FileTreeNode>();
    map.set('', root);
    for (const file of zipFiles) {
        let dirName = file.name;
        if (dirName == "") continue;
        dirName = dirName.substring(1);
        if (file.dir) {
            dirName += '/';
            let substring = dirName.substring(0, dirName.length - 1);
            let index = substring.lastIndexOf('/');
            if (index === -1) {
                let p = new FileTreeNode(substring, true, false, file.url, AssignFileType.zip);
                p.parent = root;
                root.children.push(p);
                map.set(dirName, p);
            } else {
                substring = dirName.substring(index + 1, dirName.length - 1);
                let p = new FileTreeNode(substring, true, false, file.url, AssignFileType.zip);
                p.parent = map.get(dirName.substring(0, index + 1));
                (map.get(dirName.substring(0, index + 1)) as FileTreeNode).children.push(p);
                map.set(dirName, p);
            }
        } else {
            let index = dirName.lastIndexOf('/');
            if (index === -1) {
                let p = new FileTreeNode(dirName, false, false, file.url, analyzeType(file.url));
                p.parent = root;
                root.children.push(p);
            } else {
                let p = new FileTreeNode(dirName.substring(index + 1), false, false, file.url, analyzeType(file.url));
                p.parent = map.get(dirName.substring(0, index + 1));
                (map.get(dirName.substring(0, index + 1)) as FileTreeNode).children.push(p);
            }
        }
    }
    return root;
}

function findNode(root: FileTreeNode, paths: string[]) {
    let node: FileTreeNode = root;
    for (const path of paths) {
        for (const child of node.children) {
            if (child.url === path) {
                node = child;
                break;
            }
        }
    }
    return node;
}

export function analyzeType(url: string) {
    const postfix = url.split('.').pop();
    switch (postfix) {
        case 'pdf':
            return AssignFileType.pdf;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'bmp':
            return AssignFileType.image;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'webm':
            return AssignFileType.video;
        case 'doc':
        case 'docx':
        case 'ppt':
        case 'pptx':
        case 'xls':
        case 'xlsx':
            return AssignFileType.office;
        case 'txt':
        case 'py':
        case 'java':
        case 'c':
        case 'cpp':
        case 'js':
        case 'ts':
        case 'vue':
        case 'html':
        case 'css':
        case 'json':
        case 'xml':
        case 'php':
        case 'sql':
        case 'sh':
        case 'bat':
        case 'h':
        case 'hpp':
            return AssignFileType.txt;
        case 'md':
            return AssignFileType.markdown;
        default:
            return AssignFileType.other;
    }
}

export {downloadAll, analyzeDir, findNode}
