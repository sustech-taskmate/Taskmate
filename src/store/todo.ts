class TodoItem{
    name: string;
    time: Date;
    constructor(name: string, time: Date) {
        this.name = name;
        this.time = time;
    }
}

class ContainCard{
    name: string;
    description: string;
    identify: string;
    constructor(name: string, description: string, identify: string) {
        this.name = name;
        this.description = description;
        this.identify = identify;
    }
}

class Card{
    name: string;
    listContainCard: ContainCard[];
    down: boolean;
    constructor(name: string, listContainCard: ContainCard[], down: boolean) {
        this.name = name
        this.listContainCard = listContainCard
        this.down = down
    }
}

export {TodoItem, Card, ContainCard}