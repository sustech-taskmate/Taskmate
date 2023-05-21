<template>
  <el-row>
    <button type="button" class="btn submit">Submit</button>
    <button type="button" class="btn next">Next</button>
  </el-row>
</template>

<script lang="ts" setup>
import {returnSubmission} from "@/composable/serverRequest";

// const props = defineProps({
//     submissionId: {type: String, required: true},
//     score: {type: Number, required: true},
//     comment: {type: String, default: ""},
//     metrics: {default: {}}
// })

// const {submissionId, score, comment, metrics} = props
// const res = await returnSubmission(submissionId, score, comment, metrics);


</script>

<script lang="ts">
export default {
  name: "AssignButton"
}
</script>

<style scoped>
.btn {
  border: 1px solid;
  background-color: transparent;
  text-transform: uppercase;
  font-size: calc(100vw * 24 / 1500);
  font-weight: 300;
}

.btn:hover {
  color: white;
  border: 0;
  cursor: pointer;
}

.submit {
  color: #6A7FA0;
}

.submit:hover {
  background-color: #6A7FA0;
}

.next {
  color: #548585;
  margin-left: calc(100vw * 10 / 1500);
}

.next:hover {
  background-color: #548585;
  -moz-box-shadow: 10px 10px 99px 6px rgba(0, 128, 128, 1);
}
</style>
