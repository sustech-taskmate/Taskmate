<template>
  <div class="box1">
    <h2 class="text-prog">PROGRESS</h2>
    <div class="percent">
      <svg>
        <circle cx="40" cy="40" r="40"></circle>
        <circle cx="40" cy="40" r="40"></circle>
      </svg>
      <div class="number">
        <h2>123/129</h2>
      </div>
    </div>
  </div>
  <div class="box2">
    <h2 class="text-prog">POINTS</h2>
    <div class="point-box">
      <svg style="visibility: hidden">
        <circle cx="40" cy="40" r="40"></circle>
        <circle cx="40" cy="40" r="40"></circle>
      </svg>
      <div class="point">
        <h3>99.99 / 100.00</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import '@/assets/style/local/progress.css'
</script>

<script lang="ts">
export default {
  name: "AssignInfo"
}
</script>

<style scoped>

</style>