<template>
  <el-container type="flex" style="height: 100vh; width: 100%">
    <el-col :span="16" type="flex" style="border-bottom: 2px solid black;">
      <over-view-main :cardList="cardList"/>
    </el-col>
    <el-col :span="8" style="border: 2px solid black; border-radius: 0 0 0 0;">
      <over-view-right-card :Todo="SaTodo" :cardList="cardList"
                            style="height: 50%;">
      </over-view-right-card>
      <over-view-right-card :Todo="StudentTodo"
                            style="height: 50%;">
      </over-view-right-card>
    </el-col>
  </el-container>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive} from "vue";
import {Card, ClassUserRole, ContainCard, ToDo, ToDoIdentity, TodoItem} from "@/store/todo";
import {Class, ClassesResponseData, getAssignments, getClasses} from "@/composable/serverRequest";
import _ from "lodash";
import OverViewRightCard from "@/components/OverviewRightComponent/OverViewRightCard.vue";
import OverViewMain from "@/components/OverviewRightComponent/OverViewMain.vue";


export default defineComponent({
    name:"index",
    components: {OverViewMain, OverViewRightCard},
    props: {
        tempClassList: {
            type: Object as PropType<ClassesResponseData>,
            require: false,
        }
    },
    async setup(props) {

        const m = new Map<string, number>([
            ['Spring', 0],
            ['Summer', 1],
            ['Fall', 2],
            ['Winter', 3]
        ])

        const cardList = reactive([] as Card[])
        const SaTodo = reactive(new ToDo(ToDoIdentity.todoSa, []))
        const StudentTodo = reactive(new ToDo(ToDoIdentity.todoStudent, []))
        let classList = null

        if(props.tempClassList === null || props.tempClassList === undefined){
            classList = await getClasses()
        }else{
            classList = props.tempClassList
        }
        const gb = _.groupBy(classList.classes, (course: Class) => `${course.semester.year} ${course.semester.season}`)
        Object.keys(gb).forEach((key, index) => {
            const [year, season] = key.split(" ")
            const yearNum = parseInt(year);
            const seasonIndex = m.get(season)
            cardList.push(new Card(key, [], false, false,
                yearNum * 4 + (seasonIndex as number)))
            const classes: Class[] = gb[key];
            classes.forEach((value) => {
                cardList[index].listContainCard.push(new ContainCard(value.id, value.title, value.name, value.role))
            })
        });

        cardList.sort((a, b) => b.index - a.index);

        for (const semester of cardList) {
            for (const item of semester.listContainCard) {
                let AssignmentList = await getAssignments(item.id + '')
                AssignmentList.assignments.forEach((value) => {
                    let {name, title, status, due, availableFrom, availableTo} = value
                    if (availableTo > Date.parse(new Date().toString()) / 1000) {
                        if (item.identify == ClassUserRole.STUDENT) {
                            SaTodo.todoList.push(new TodoItem(name, availableTo, item.id, title))
                        } else {
                            StudentTodo.todoList.push(new TodoItem(name, availableTo, item.id, title))
                        }
                    }
                })
            }
        }
        return{
            cardList,
            SaTodo,
            StudentTodo,
            m,
        }
    },
})

</script>
