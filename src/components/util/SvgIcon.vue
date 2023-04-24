<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="24"
      height="24"
      :viewBox="`0 0 ${svg.size} ${svg.size}`"
      :aria-hidden="true" :style="{ fill: color }"
  >
    <path v-for="path in svg.paths" :d="path" :fill="color"/>
  </svg>
</template>

<script lang="ts" setup>
import '@/assets/style/local/svg.scss';
import {svgMap} from "@/assets/svg/svgs";

const props = defineProps({
  name: {type: String, default: null},
  color: {type: String, default: '#000'}
})

let svg = svgMap[props.name];

</script>

<script lang="ts">
export default {
  name: 'SvgIcon'
}
</script>
