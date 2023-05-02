<template>
  <el-container type="flex" style="height: 100vh; width: 100%">
      <el-col :span="16" type="flex" style="border-bottom: 2px solid black;">
          <over-view-main :CardList="CardList">
          </over-view-main>
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

/**
 * 传入三个参数
 * CardList: Card类型的列表
 * SaTodo & StudentTodo: ToDo类型数据
 * */

let SaTodo = reactive(new ToDo(ToDoIdentity.todoSa, [
    new TodoItem("CS111", new Date("2000-1-1 12:00:00")),
]))

let StudentTodo = reactive([])

let CardList = reactive([
    new Card("2077 Spring", [
        new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Student"),
        new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
        new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
        new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
        new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
    ], false),
])


</script>
