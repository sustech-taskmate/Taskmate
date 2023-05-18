<template>
  <el-container type="flex" style="height: 100vh; width: 100%">
    <el-col :span="16" type="flex" style="border-bottom: 2px solid black;">
      <over-view-main :cardList="cardList"/>
    </el-col>
    <el-col :span="8" style="border: 2px solid black; border-radius: 0 10px 10px 0;">
      <over-view-right-card :Todo="SaTodo"
                            style="height: 50%;">
      </over-view-right-card>
      <over-view-right-card :Todo="StudentTodo"
                            style="height: 50%;">
      </over-view-right-card>
    </el-col>
  </el-container>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'
import OverViewRightCard from "@/components/OverviewRightComponent/OverViewRightCard.vue";
import OverViewMain from "@/components/OverviewRightComponent/OverViewMain.vue";
import {Card, ContainCard, ToDo, ToDoIdentity, TodoItem} from '@/store/todo';
import {Class, getClasses} from "@/composable/serverRequest";
import _ from "lodash"

let cardList = reactive([] as Card[])
const m = new Map<string, number>([
  ['Spring', 0],
  ['Summer', 1],
  ['Fall', 2],
  ['Winter', 3]
])

const classList = await getClasses()
const gb = _.groupBy(classList.classes, (course: Class) => `${course.semester.year} ${course.semester.season}`)
Object.keys(gb).forEach((key, index) => {
  const [year, season] = key.split(" ")
  const yearNum = parseInt(year);
  const seasonIndex = m.get(season)
  cardList.push(new Card(key, [], false, yearNum * 4 + (seasonIndex as number)))
  const classes: Class[] = gb[key];
  classes.forEach((value) => {
    cardList[index].listContainCard.push(new ContainCard(value.id, value.title, value.name, value.role))
  })
});
cardList.sort((a, b) => b.index - a.index);

let SaTodo = reactive(new ToDo(ToDoIdentity.todoSa, [
  new TodoItem("CS111", new Date("2000-1-1 12:00:00")),
]))

let StudentTodo = reactive(new ToDo(ToDoIdentity.todoSa, [
  new TodoItem("CS111", new Date("2000-1-1 12:00:00")),
]))

</script>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({

})

</script>
