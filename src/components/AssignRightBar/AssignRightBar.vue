<template>
  <div class="title-box">
    <div style="color: white">{{ courseCode }} {{ assignmentName }}</div>
  </div>
  <div class="top-box">
    <assign-info
        :finished-students="finishedStudents"
        :all-students="allStudents"
        :given-points="givenPoints"
        :total-points="totalPoints"
    />
  </div>
  <div class="card-box-max">
    <card :metrics="metrics" @updatePoints="updatePoints"/>
  </div>
  <div class="btn-box">
    <assign-button/>
  </div>
</template>

<script setup lang="ts">
import AssignInfo from "@/components/AssignRightBar/AssignInfo.vue";
import Card from "@/components/AssignRightBar/Card.vue";
import AssignButton from "@/components/AssignRightBar/AssignButton.vue";
import {PropType, ref} from "vue";
import {Metrics} from "@/composable/serverRequest";
import {GradeInfo} from "@/store/assign";

const props = defineProps({
    courseCode: {type: String, required: true},
    assignmentName: {type: String, required: true},
    finishedStudents: {type: Number, required: true},
    allStudents: {type: Number, required: true},
    totalPoints: {type: Number, required: true},
    metrics: {type: Array as PropType<Metrics[]>, required: true}
})

let totalPoints = ref(0);
let givenPoints = ref(0);
let comments = ref([] as string[]);
props.metrics.forEach(metric => {
    totalPoints.value += metric.max;
})

const updatePoints = (grades: GradeInfo[]) => {
    totalPoints.value = 0;
    givenPoints.value = 0;
    grades.forEach(grade => {
        totalPoints.value += grade.totalPoints;
        givenPoints.value += grade.givenPoints;
        comments.value.push(grade.comment);
    })
}

</script>

<script lang="ts">
export default {
  name: "AssignRightBar"
}

</script>

<style scoped>

.title-box {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 8%;
  font-size: calc(100vw * 20 / 1500);
  background-color: steelblue;
}

.top-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20%;
}

.card-box-max {
  height: 60%;
  overflow-x: hidden;
  overflow-y: auto;
}

.btn-box {
  height: 12%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
