interface UniqueKey {
    readonly key: string | number | symbol;
}

class UniqueList<T extends UniqueKey> {
    private readonly _list: T[] = [];

    add(item: T): void {
        if (this._list.some(x => x.key === item.key)) {
            throw new Error(`Duplicate key: ${item.key.toString()}`);
        }
        this._list.push(item);
    }

    remove(item: T): void {
        const index = this._list.findIndex(x => x.key === item.key);
        if (index < 0) {
            throw new Error(`Key not found: ${item.key.toString()}`);
        }
        this._list.splice(index, 1);
    }

    index(idx: number): T {
        return this._list[idx];
    }

    get list(): T[] {
        return this._list;
    }
}


class BigCard implements UniqueKey {
    questionIdx: number = 0;
    totalPoints: number = 0;
    givenPoints: number = 0;
    pointInput: string = '';
    comment: string = '';
    isShowInput: boolean = false;
    isPullDown: boolean = false;
    pointEditable: boolean = false;
    subCards: SmallCard[] = [];


    constructor(questionIdx: number, totalPoints: number, givenPoints: number, comment: string) {
        this.questionIdx = questionIdx;
        this.totalPoints = totalPoints;
        this.givenPoints = givenPoints;
        this.pointInput = this.totalPoints.toString();
        this.comment = comment;
    }

    get key(): number {
        return this.questionIdx;
    }
}

class SmallCard {
    parentCard: BigCard | null = null;
    sign: string = ''
    points: number = 0;
    comment: string = '';
    isSmallActive: boolean = false;
    isShowInput: boolean = false;
    pointEditable: boolean = false;
    pointInput: string = '';

    constructor(parentCard: BigCard | null, sign: string, points: number, comment: string) {
        this.parentCard = parentCard;
        this.sign = sign;
        this.points = points;
        this.pointInput = this.points.toString();
        this.comment = comment;
    }
}

export {UniqueList, BigCard, SmallCard}
