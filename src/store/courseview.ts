export class CourseData {
    name: string;
    releaseTime: string;
    deadline: string;
    delayTime: string;
    submitRatio: string;
    gradeRatio: string;
    isReturn: boolean;

    constructor(name: string, releaseTime: string, deadline: string, delayTime: string,
                submitRatio: string, gradeRatio: string, isReturn: boolean) {
        this.name = name;
        this.releaseTime = releaseTime;
        this.deadline = deadline;
        this.delayTime = delayTime;
        this.submitRatio = submitRatio;
        this.gradeRatio = gradeRatio;
        this.isReturn = isReturn;
    }
}
