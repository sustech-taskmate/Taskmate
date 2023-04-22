enum AssignFileType {
    pdf,
    image,
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
    url: string = '';

    constructor(name: string, dir: boolean, url: string) {
        this.name = name;
        this.dir = dir;
        this.url = url;
    }
}

class FileTreeNode {
    filename: string = '';
    isDir: boolean = false;
    isRoot: boolean = false;
    url: string = '';
    parent: FileTreeNode | undefined;
    children: FileTreeNode[] = [];

    constructor(filename: string, isDir: boolean, isRoot: boolean, url: string) {
        this.filename = filename;
        this.isDir = isDir;
        this.isRoot = isRoot;
        this.url = url;
    }
}

export {AssignFileType, AssignFile, ZipFile, FileTreeNode}