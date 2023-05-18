<template>
  <div class="box" style="width: 50%">
    <h2 class="text-prog">PROGRESS</h2>
    <div class="cont-prog">
      <div class="student-cnt">
        {{finishedStudents.toFixed(0)}} / {{allStudents.toFixed(0)}}
      </div>
      <svg viewBox="0 0 100 100">
        <circle class="progress-bar-bg" cx="50" cy="50" r="45"/>
        <circle class="progress-bar" cx="50" cy="50" r="45"
                :style="{ '--stroke-dasharray': calculateStrokeDasharray(props.finishedStudents, props.allStudents) }"/>
      </svg>
    </div>
  </div>
  <div class="box" style="width: 50%">
    <h2 class="text-prog">POINTS</h2>
    <div class="cont-prog">
      <div class="point">
        {{givenPoints.toFixed(2)}} / {{totalPoints.toFixed(2)}}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import '@/assets/style/local/progress.scss'

const props = defineProps({
  finishedStudents: {
    type: Number,
    required: true
  },
  allStudents: {
    type: Number,
    required: true
  },
  givenPoints: {
    type: Number,
    required: true
  },
  totalPoints: {
    type: Number,
    required: true
  }
})

const strokeDasharray = ref('1, 999')
function calculateStrokeDasharray(finishedCount:number, allCount:number) {
  const dashArrayValue = `${finishedCount / allCount * 284}, 999`
  strokeDasharray.value = dashArrayValue
  return dashArrayValue
}

</script>

<script lang="ts">
export default {
  name: "AssignInfo"
}
</script>
