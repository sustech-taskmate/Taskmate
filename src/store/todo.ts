/**
 * name: 待处理事务名称
 * time: ddl
 * id: 课程唯一识别标志
 * courseTitle: 课程title
 * */
class TodoItem {

    name: string;
    time: Date;
    id: number;
    courseTitle: string;

    constructor(name: string, time: Date, id: number, courseTile: string) {
        this.name = name;
        this.time = time;
        this.id = id;
        this.courseTitle = courseTile;
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
class ContainCard {
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
class Card {
    name: string;
    listContainCard: ContainCard[];
    indexDown: boolean;
    courseviewDown: boolean;
    index: number;

    constructor(name: string, listContainCard: ContainCard[], indexDown: boolean, courseviewDown: boolean, index: number) {
        this.name = name
        this.listContainCard = listContainCard
        this.indexDown = indexDown
        this.courseviewDown = courseviewDown
        this.index = index;
    }
}

enum ToDoIdentity {
    todoSa = "submit",
    todoStudent = "check",
    toTeacher = "Check",
}

/**
 * identify: 身份 枚举
 * todoList: 待处理事务
 * */
class ToDo {
    identify: ToDoIdentity;
    todoList: TodoItem[];

    constructor(identify: ToDoIdentity, todoList: TodoItem[]) {
        this.identify = identify
        this.todoList = todoList
    }
}

export {TodoItem, Card, ContainCard, ToDo, ToDoIdentity}
