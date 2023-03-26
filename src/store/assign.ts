enum AssignFileType {
    pdf,
    img,
    video,
    office,
    txt,
    markdown,
    zip,
    placeholder
}

class AssignFile {
    filename: string = '';
    format: AssignFileType = AssignFileType.placeholder;
    url: string = '';
    data: any
    constructor(filename: string, format: AssignFileType, url: string, data: any) {
        this.filename = filename;
        this.format = format;
        this.url = url;
        this.data = data;
    }
}

class ZipFile {
    name: string = '';
    dir: boolean = false;
    data: Blob | undefined;

    constructor(name: string, dir: boolean, data: Blob | undefined) {
        this.name = name;
        this.dir = dir;
        this.data = data;
    }
}

class FileTreeNode {
    name: string = '';
    isDir: boolean = false;
    isRoot: boolean = false;
    children: FileTreeNode[] = [];

    constructor(name: string, isDir: boolean, isRoot: boolean) {
        this.name = name;
        this.isDir = isDir;
        this.isRoot = isRoot;
    }
}

export {AssignFileType, AssignFile, ZipFile, FileTreeNode}