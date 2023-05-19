class AttachFile{
    name: string;
    size: number;
    time: string;
    constructor(name:string, size: number, time: string) {
        this.name = name
        this.size = size
        this.time = time
    }
}


/**
 * 每一项作业
 * name: 作业名称
 * ddl: 截止时间
 * lateTime: 迟交时间
 * submitTime: 最近提交时间
 * attachment: 作业附件
 * */
class Assignment{
    name: string;
    ddl: Date;
    lateTime: Date;
    submitTime: Date | null;
    attachment: AttachFile[] | null;
    constructor(name: string, ddl: Date, submitTime: Date | null, lateTime: Date, attachment: AttachFile[] | null) {
        this.name = name;
        this.ddl = ddl;
        this.submitTime = submitTime;
        this.lateTime = lateTime;
        this.attachment = attachment;
    }
}

/**
 * name: 课程名称
 * assignmentList: 作业列表
 * down: 这个列表是否拉开
 * */
class Course{
    name: string;
    assignmentList: Assignment[];
    down: boolean;
    constructor(name: string, assignmentList: Assignment[], down: boolean) {
        this.name = name;
        this.assignmentList = assignmentList
        this.down = down;
    }
}

export {Assignment, Course, AttachFile}