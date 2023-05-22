<template>
  <el-header type="flex" style="height: 10vh;
    border-bottom: 2px solid black; border-left: 2px solid black; border-top: 2px solid black; border-radius: 0 0 0 0">
    <el-row type="flex" style="height: 100%">
      <el-col :span="2" style="height: 100%" type="flex">
        <svg-icon name="logout" color="black" @click="logout"
                  style="text-align: center; vertical-align: center; height: 100%; width: 50%; cursor: pointer;"/>
      </el-col>
      <el-col :span="8" style="height: 100%" type="flex"/>
      <el-col :span="4" style="height: 100%" type="flex">
        <el-row style="height: 100%" type="flex">
          <svg
              style="text-align: center; vertical-align: center; height: 100%; width: 50%; cursor: pointer"
              type="flex"
              viewBox="0 0 40 40"
              @click="filter(0)">
            <circle cx="20" cy="20" r="10" style="stroke: lightblue;" class="identifier"
                    :class="{activeBlue: filters[0]}"/>
          </svg>
          <div style="height: 100%; width: 50%; text-align: center; vertical-align: center;
                                     display: flex; align-items: center; justify-content: center;
                                     color: blue; font-size: calc(100vw * 24 / 1500)" type="flex"
               data-test="name">
            SA
          </div>
        </el-row>
      </el-col>
      <el-col :span="1"/>
      <el-col :span="4" style="height: 100%" type="flex">
        <el-row style="height: 100%" type="flex">
          <svg
              style="text-align: center; vertical-align: center; height: 100%; width: 50%; cursor: pointer"
              type="flex"
              viewBox="0 0 40 40"
              @click="filter(1)">
            <circle cx="20" cy="20" r="10" style="stroke: lightpink;" class="identifier"
                    :class="{activePink: filters[1]}"/>
          </svg>
          <div style="height: 100%; width: 50%; text-align: center; vertical-align: center;
                                     display: flex; align-items: center; justify-content: center;
                                     color: deeppink; font-size: calc(100vw * 24 / 1500)" type="flex"
               data-test="name">
            Teacher
          </div>
        </el-row>
      </el-col>
      <el-col :span="1"/>
      <el-col :span="4" style="height: 100%" type="flex">
        <el-row style="height: 100%" type="flex">
          <svg
              style="text-align: center; vertical-align: center; height: 100%; width: 50%; cursor: pointer"
              type="flex"
              viewBox="0 0 40 40"
              @click="filter(2)">
            <circle cx="20" cy="20" r="10" style="stroke: lightgreen;" class="identifier"
                    :class="{activeGreen: filters[2]}"/>
          </svg>
          <div style="height: 100%; width: 50%; text-align: center; vertical-align: center;
                                     display: flex; align-items: center; justify-content: center;
                                     color: green; font-size: calc(100vw * 20 / 1500)" type="flex"
               data-test="name">
            Student
          </div>
        </el-row>
      </el-col>
    </el-row>
  </el-header>
  <el-main type="flex" style="height: 90vh; overflow-y: auto; border-left: 2px solid black; border-radius: 0 0 0 0">
    <overview-middle-card :cardList="cardList" :filters="filters"/>
  </el-main>
</template>

<script lang="ts" setup>
import {Card} from '@/store/todo';
import {PropType, ref} from "vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {logout as Logout} from "@/composable/serverRequest";

const props = defineProps({
  cardList: {type: Array as PropType<Card[]>, default: null}
})

const filters = ref([true, true, true]);
const filter = (index: number) => {
  filters.value[index] = !filters.value[index];
}

const logout = () => {
    Logout()
}
</script>

<script lang="ts">
import OverviewMiddleCard from "@/components/OverviewRightComponent/OverviewMiddleCard.vue";

export default {
  name: "OverViewMain",
  components: {OverviewMiddleCard},
}
</script>

<style scoped>
.identifier{
  stroke-width: 3;
  fill: none;
}
.activeBlue {
  fill: lightblue;
}
.activePink {
  fill: lightpink;
}
.activeGreen {
  fill: lightgreen;
}
</style>
