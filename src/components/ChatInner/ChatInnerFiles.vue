<template>
  <transition name="vac-slide-up">
    <div
        v-if="files.length"
        class="vac-room-files-container"
    >
      <div class="vac-files-box">
        <div v-for="(file, i) in files" :key="i">
          <chat-inner-file
              :file="file"
              :index="i"
              @remove-file="$emit('remove-file', $event)"
          >
            <template v-for="(idx, name) in $slots" #[name]="data">
              <slot :name="name" v-bind="data"/>
            </template>
          </chat-inner-file>
        </div>
      </div>

      <div class="vac-icon-close">
        <div class="vac-svg-button" @click="$emit('reset-files')">
          <slot name="files-close-icon">
            <svg-icon name="closeoutline"/>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {ChatFile} from "@/store/chat";
import ChatInnerFile from "@/components/ChatInner/ChatInnerFile.vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
export default defineComponent({
    name: "ChatInnerFiles",
    components: {SvgIcon, ChatInnerFile},
    props:{
        files: {type: Array as PropType<ChatFile[]>, required: true}
    },
    emits: ['remove-file', 'reset-files'],
    setup(){

    }
})
</script>

<!--<script lang="ts" setup>-->
<!--import ChatInnerFile from "./ChatInnerFile.vue";-->
<!--import SvgIcon from '@/components/util/SvgIcon.vue'-->
<!--import {PropType} from "vue";-->
<!--import {ChatFile} from "@/store/chat";-->

<!--const props = defineProps({-->
<!--  files: {type: Array as PropType<ChatFile[]>, required: true}-->
<!--})-->
<!--const emits = defineEmits(['remove-file', 'reset-files'])-->
<!--</script>-->

<!--<script lang="ts">-->

<!--export default {-->
<!--  name: "ChatInnerFiles",-->
<!--}-->

<!--</script>-->
