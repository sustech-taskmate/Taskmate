<template>
  <div class="box" style="width: 50%">
    <h2 class="text-prog">PROGRESS</h2>
    <div class="cont-prog">
      <div class="student-cnt">
        {{finishedStudents.toFixed(0)}} / {{allStudents.toFixed(0)}}
      </div>
      <svg viewBox="0 0 100 100">
        <circle class="progress-bar-bg" cx="50" cy="50" r="45"/>
        <circle class="progress-bar" cx="50" cy="50" r="45"/>
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
import '@/assets/style/local/progress.css'
import {watch} from "vue";
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

const rules = `
    @keyframes progress {
      to {
        stroke-dasharray: ${props.finishedStudents / props.allStudents * 284}, 999;
      }
    }
  `;
const styleEl = document.createElement('style');
styleEl.appendChild(document.createTextNode(rules));
document.head.appendChild(styleEl);
watch(() => props.finishedStudents, () => {
  const rules = `
    @keyframes progress {
      to {
        stroke-dasharray: ${props.finishedStudents / props.allStudents * 284}, 999;
      }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.appendChild(document.createTextNode(rules));
  document.head.appendChild(styleEl);
})

</script>

<script lang="ts">
export default {
  name: "AssignInfo"
}
</script>
