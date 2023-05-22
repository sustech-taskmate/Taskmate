export class CourseData {
    name: string;
    releaseTime: string;
    deadline: string;
    delayTime: string;
    gradeRatio: string;
    notGraded: number;
    all: number;

    constructor(name: string, releaseTime: string, deadline: string, delayTime: string,
                gradeRatio: string, notGraded: number, all: number) {
        this.name = name;
        this.releaseTime = releaseTime;
        this.deadline = deadline;
        this.delayTime = delayTime;
        this.gradeRatio = gradeRatio;
        this.notGraded = notGraded;
        this.all = all;
    }
}
