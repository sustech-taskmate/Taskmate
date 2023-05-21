export enum AssignmentState {
    notModified,
    modifying,
    finished
}

export interface StudentContent {
    eid: string,
    gid: string,
    sid: string,
    submitTime: string | null,
    modifyState: AssignmentState,
    lastModifiedBy: string,
    lastTime: string | null,
    score: number,

    //数据可视化
    //名字，release，ddl，延期时间，提交比，评分比，是否return，setting 三个时间支持排序，return排序，
}
