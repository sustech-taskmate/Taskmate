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

export enum ClassUserRole {
    TEACHER = 'teacher',
    ASSISTANT = 'assistant',
    STUDENT = 'student',
}

/**
 * id: 课程唯一编号
 * code: 课程代码
 * title: 课程名称
 * identify： 身份信息，分别为teacher, assistant, student
 * */
class ContainCard{
    id: number;
    code: string;
    title: string;
    identify: ClassUserRole;
    constructor(id: number, code: string, title: string, identify: string) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.identify = identify as ClassUserRole;
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