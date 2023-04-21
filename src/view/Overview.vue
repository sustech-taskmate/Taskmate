<template>
  <el-container type="flex" style="height: 100vh; width: 100%">
      <el-col :span="16" type="flex" style="border-bottom: 2px solid black;">
          <over-view-main :CardList="CardList">
          </over-view-main>
      </el-col>
      <el-col :span="8" style="border: 2px solid black; border-radius: 0 10px 10px 0">
          <over-view-right-card :SaTodoList="SaTodoList" :StudentTodoList="StudentTodoList"
                                :SaTask="SaTask" :StudentTask="StudentTask">
          </over-view-right-card>
      </el-col>
  </el-container>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'
import OverViewRightCard from "@/components/OverviewRightComponent/OverViewRightCard.vue";
import OverViewMain from "@/components/OverviewRightComponent/OverViewMain.vue";
import {TodoItem, Card, ContainCard} from '@/store/todo';

let SaTodoList = reactive([
    new TodoItem("CS111", new Date("2000-1-1 12:00:00")),
    new TodoItem("CS112", new Date("2000-1-2 12:00:00")),
    new TodoItem("CS113", new Date("2000-1-3 12:00:00")),
    new TodoItem("CS114", new Date("2000-1-4 12:00:00")),
    new TodoItem("CS115", new Date("2000-1-5 12:00:00")),
    new TodoItem("CS116", new Date("2000-1-6 12:00:00")),
])

let SaTask = true

let StudentTodoList = reactive([
    new TodoItem("CS121", new Date("2000-2-1 12:00:00")),
    new TodoItem("CS122", new Date("2000-2-2 12:00:00")),
    new TodoItem("CS123", new Date("2000-2-3 12:00:00")),
    new TodoItem("CS124", new Date("2000-2-4 12:00:00")),
    new TodoItem("CS125", new Date("2000-2-5 12:00:00")),
    new TodoItem("CS126", new Date("2000-2-6 12:00:00")),
])

let StudentTask = true

let CardList = reactive([
    new Card("2077 Spring", [
        new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
        new ContainCard("CS102", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
        new ContainCard("CS103", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Student"),
        new ContainCard("CS104", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
        new ContainCard("CS104", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Student"),
    ], false),
    new Card("2077 Summer", [
        new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
        new ContainCard("CS102", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS103", "AAAAAAAAAAAA", "Student"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "Student"),
    ], false),
    new Card("2077 Autumn", [
        new ContainCard("CS101", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS102", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS103", "AAAAAAAAAAAA", "Student"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "Student"),
    ], false),
    new Card("2077 Winter", [
        new ContainCard("CS101", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS102", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS103", "AAAAAAAAAAAA", "Student"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "Student"),
    ], false),
    new Card("2077 Winter", [
        new ContainCard("CS101", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS102", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS103", "AAAAAAAAAAAA", "Student"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "Student"),
    ], false),
    new Card("2077 Winter", [
        new ContainCard("CS101", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS102", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS103", "AAAAAAAAAAAA", "Student"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "SA"),
        new ContainCard("CS104", "AAAAAAAAAAAA", "Student"),
    ], false),
])


</script>
