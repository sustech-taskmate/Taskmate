<template>
  <div class="vac-room-file-container">
    <loader :show="file.loading" type="room-file">
      <template v-for="(idx, name) in $slots" #[name]="data">
        <slot :name="name" v-bind="data"/>
      </template>
    </loader>
    <div
        class="vac-svg-button vac-icon-remove"
        @click="$emit('remove-file', index)"
    >
      <slot name="image-close-icon">
        <svg-icon name="close" color="white"/>
      </slot>
    </div>

    <div
        class="vac-message-image"
        :class="{ 'vac-blur-loading': file.loading }"
        :style="{
				'background-image': `url('${file.localUrl}')`
			}"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ChatFile} from "@/store/chat";
import SvgIcon from "@/components/util/SvgIcon.vue";
import Loader from "@/components/util/Loader.vue";
export default defineComponent({
    name: 'ChatInnerFile',
    components: {Loader, SvgIcon},
    props:{
        file: {type: ChatFile, required: true},
        index: {type: Number, required: true}
    },
    emits: ['remove-file'],
})
</script>

<!--<script lang="ts" setup>-->
<!--import Loader from '@/components/util/Loader.vue'-->
<!--import SvgIcon from '@/components/util/SvgIcon.vue'-->
<!--import '@/assets/style/local/chatfile.scss'-->
<!--import {ChatFile} from "@/store/chat";-->

<!--const props = defineProps({-->
<!--  file: {type: ChatFile, required: true},-->
<!--  index: {type: Number, required: true}-->
<!--})-->

<!--const emits = defineEmits(['remove-file'])-->

<!--</script>-->

<!--<script lang="ts">-->
<!--export default {-->
<!--  name: 'ChatInnerFile',-->
<!--}-->
<!--</script>-->
