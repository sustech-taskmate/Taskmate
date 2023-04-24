<template>
  <div class="vac-room-file-container">
    <loader :show="file.loading" type="room-file">
      <template v-for="(idx, name) in $slots" #[name]="data">
        <slot :name="name" v-bind="data"/>
      </template>
    </loader>
    <div
        class="vac-svg-button vac-icon-remove"
        @click="emits('remove-file', index)"
    >
      <slot name="image-close-icon">
        <svg-icon name="close" color="white"/>
      </slot>
    </div>

    <div
        class="vac-message-image"
        :class="{ 'vac-blur-loading': file.loading }"
        :style="{
				'background-image': `url('${file.localUrl || file.url}')`
			}"
    />
  </div>
</template>

<script lang="ts" setup>
import Loader from '@/components/util/Loader.vue'
import SvgIcon from '@/components/util/SvgIcon.vue'
import '@/assets/style/local/chatfile.scss'

const props = defineProps({
  file: {type: Object, required: true},
  index: {type: Number, required: true}
})

const emits = defineEmits(['remove-file'])

</script>

<script lang="ts">
export default {
  name: 'ChatInnerFile',
}
</script>
