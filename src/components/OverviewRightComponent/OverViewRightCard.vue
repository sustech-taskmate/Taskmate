<template>
    <el-container>
        <el-main style="height: 50vh; overflow-y: hidden">
            <div style="height: 100%; width: 99%;border: 1px solid black; background: white; border-radius: 10px;">
                <div style="height: 20%; width: 100%;
                           display: flex; align-items: center; justify-content: center;
                           border-bottom: 1px solid black;"
                     data-test="title">
                    TODO LIST
                </div>
                <div style="height: 80%; width: 100%; overflow-y: auto;">
                    <div v-for="item in Todo.todoList" style="height: 20%; width: 100%;">
                        <el-row style="height: 100%; width: 100%;" class="row">
                            <div style="height: 100%; width: 25%; display: flex;
                                        align-items: center; justify-content: center;
                                        font-size: calc(100vw * 20 / 1500)"
                                 data-test="name">
                                {{ item.name }}
                            </div>
                            <div style="height: 100%; width: 45%; display: flex;
                                        align-items: center; justify-content: center;
                                        font-size: calc(100vw * 15 / 1500)"
                                 data-test="time">
                                {{ show(item.time) }}
                            </div>
                            <div style="height: 100%; width: 30%; display: flex;
                                        align-items: center; justify-content: center;">
                                <button class="btn" :class="Todo.identify"
                                        data-test="identify" @click="go(item)">
                                    {{ Todo.identify }}
                                </button>
                            </div>
                        </el-row>
                        <div style="height: 5%; width: 100%;"></div>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>


</template>

<script lang="ts" setup>
import moment from "moment";
import {Card, ToDo, ToDoIdentity, TodoItem} from "@/store/todo";
import {useRouterPush} from "@/composable";
import {PropType} from "vue";

const {routerPush} = useRouterPush();

function show(time: number) {
    return moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
}

const props = defineProps({
    Todo: {
        type: ToDo,
        required: true
    },
    cardList: {type: Array as PropType<Card[]>, default: null},
})

const go = (item: TodoItem) => {
    if (props.Todo.identify == ToDoIdentity.todoStudent) {

        routerPush({name: 'upload', params: {cid: item.id}, query: {courseName: item.courseTitle}})

    } else {

        routerPush({
            name: 'teacherCourse', params: {cid: item.id},
            query: {courses: JSON.stringify(props.cardList)}
        })

    }


}

</script>

<style scoped>
.row:hover {
    background-color: lightyellow;
}

.btn {
    border: 1px solid;
    background-color: transparent;
    text-transform: uppercase;
    font-size: calc(100vw * 12 / 1500)
}

.btn:hover {
    color: white;
    border: 0;
    cursor: pointer;
}

.submit {
    color: orangered;
}

.submit:hover {
    background-color: orangered;
}

.check {
    color: lightblue;
}

.check:hover {
    background-color: lightblue;
}
</style>