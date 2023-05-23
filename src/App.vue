<script lang="ts" setup>
import {nextTick, provide, ref} from "vue";
    const isRouterAlive = ref(true)
    const reload = () => {
        isRouterAlive.value = false
        nextTick(() => {
            isRouterAlive.value = true
        })
    }
    provide('reload', reload)
</script>

<!--<template>-->
<!--  <div class="container">-->
<!--    <h1>Let's start!</h1>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped>-->

<!--</style>-->
<template>
  <suspense>
    <router-view v-if="isRouterAlive"/>
  </suspense>
</template>

<style lang="scss" scoped>
#app {
  height: 800px;
  background-size: 100% 100%;
}

</style>
