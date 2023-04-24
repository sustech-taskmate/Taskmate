/**
 * name: 待处理事务名称
 * time: ddl
 * */
class TodoItem{

    name: string;
    time: Date;
    constructor(name: string, time: Date) {
        this.name = name;
        this.time = time;
    }
}

/**
 * name: 课程
 * description: 描述
 * identify： 身份 取值为 "SA" 和 "Student"
 * */
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

/**
 * name: 学期
 * listContainCard: 包含的卡片
 * down: false，是否展开
 * */
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

enum ToDoIdentity{
    todoSa= "submit",
    todoStudent="check",
}

/**
 * identify: 身份 枚举
 * todoList: 待处理事务
 * */
class ToDo{
    identify: ToDoIdentity;
    todoList: TodoItem[];
    constructor(identify: ToDoIdentity, todoList: TodoItem[]) {
        this.identify = identify
        this.todoList = todoList
    }
}

export {TodoItem, Card, ContainCard, ToDo, ToDoIdentity}