<template>
  <div class="title-box">
    <div style="color: white">CS307 Assignment1</div>
  </div>
  <div class="top-box">
    <assign-info></assign-info>
  </div>
  <div class="card-box-max">
    <card></card>
  </div>
  <div class="btn-box">
    <assign-button></assign-button>
  </div>
</template>

<script setup lang="ts">
import AssignInfo from "@/components/AssignRightBar/AssignInfo.vue";
import Card from "@/components/AssignRightBar/Card.vue";
import AssignButton from "@/components/AssignRightBar/AssignButton.vue";
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