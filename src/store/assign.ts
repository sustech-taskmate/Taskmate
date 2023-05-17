enum AssignFileType {
    pdf,
    image,
    video,
    office,
    txt,
    markdown,
    zip,
    other,
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
    isRoot: boolean = false; // indicate whether it is the root node
    url: string = ''; // index
    format: AssignFileType = AssignFileType.placeholder;
    parent: FileTreeNode | undefined;
    children: FileTreeNode[] = [];

    constructor(filename: string, isDir: boolean,
                isRoot: boolean, url: string,
                format: AssignFileType) {
        this.filename = filename;
        this.isDir = isDir;
        this.isRoot = isRoot;
        this.url = url;
        this.format = format;
    }

    toJSON(){
        const json: any = {
            filename: this.filename,
            isDir: this.isDir,
            isRoot: this.isRoot,
            url: this.url,
            format: this.format,
            children: []
        }
        for (const child of this.children.values()){
            json.children.push(child.toJSON())
        }
        return json
    }
}

class FileTo {
    url: string = '';
    format: AssignFileType = AssignFileType.placeholder;

    constructor(url: string, format: AssignFileType) {
        this.url = url;
        this.format = format;
    }
}

export {AssignFileType, AssignFile, ZipFile, FileTreeNode, FileTo}
