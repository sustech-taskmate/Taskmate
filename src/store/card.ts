class BigCard  {
    questionTitle: string = '';
    totalPoints: number = 0;
    givenPoints: number = 0;
    comment: string = '';
    controller: BigCardController = new BigCardController();
    subCards: SmallCard[] = [];


    constructor(questionTitle: string, totalPoints: number, givenPoints: number, comment: string) {
        this.questionTitle = questionTitle;
        this.totalPoints = totalPoints;
        this.controller.totalPointInput = this.totalPoints.toString();
        this.givenPoints = givenPoints;
        this.controller.givenPointInput = this.givenPoints.toString();
        this.comment = comment;
    }

}

class BigCardController {
    isShowInput: boolean = false;
    isPullDown: boolean = false;
    totalPointEditable: boolean = false;
    totalPointInput: string = '';
    givenPointEditable: boolean = false;
    givenPointInput: string = '';
}

class SmallCard {
    parentCard: BigCard | null = null;
    sign: string = ''
    points: number = 0;
    comment: string = '';
    controller: SmallCardController = new SmallCardController();

    constructor(parentCard: BigCard | null, sign: string, points: number, comment: string) {
        this.parentCard = parentCard;
        this.sign = sign;
        this.points = points;
        this.controller.pointInput = this.points.toString();
        this.comment = comment;
    }
}

class SmallCardController {
    isSmallActive: boolean = false;
    isShowInput: boolean = false;
    pointEditable: boolean = false;
    pointInput: string = '';
}

export {BigCard, SmallCard}
