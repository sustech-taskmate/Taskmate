<template>
  <el-row>
    <button type="button" class="btn submit">Submit</button>
    <button type="button" class="btn next">Next</button>
  </el-row>
</template>

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
  color: #f038ff;
}

.submit:hover {
  background-color: #f038ff;
  -moz-box-shadow: 10px 10px 99px 6px rgba(240, 56, 255, 1);
}

.next {
  color: teal;
  margin-left: calc(100vw * 10 / 1500);
}

.next:hover {
  background-color: teal;
  -moz-box-shadow: 10px 10px 99px 6px rgba(0, 128, 128, 1);
}
</style>