<template>
  <div
      class="chat-inner-footer"
  >
    <div style="width: 100%;display: flex;align-items: center;">
          <textarea
              v-model="message"
              id="chatTextarea"
              ref="chatTextarea"
              class="vac-textarea"
              @input="onChangeInput"
              @keydown.esc="closeEmoji"
              @keydown.ctrl.enter="sendMessage"
              style="background-color: snow"
          />
      <div
          class="vac-svg-button"
          @click="openEmoji"
      >
        <svg-icon name="emoji" color="#000"/>
      </div>
      <template v-if="showEmoji">
        <div
            class="vac-emoji-picker"
        >
          <emoji-picker
              :disable-skin-tones="true"
              v-if="showEmoji"
              @select="selectEmoji"
          />
        </div>
      </template>
      <div
              ref="temp"
          class="vac-svg-button"
          :class="{ 'vac-send-disabled': isMessageEmpty }"
      >
        <slot name="send-icon">
          <svg-icon name="send"
                    :color="isMessageEmpty?'#B0C4DE':'#000'"
                    @click="sendMessage" class="choose"/>
        </slot>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {computed, ref, Ref} from "vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
// import 'vue3-emoji-picker/css'
import '@/assets/style/local/emoji.scss'
import ChatInnerFiles from "@/components/ChatInner/ChatInnerFiles.vue";
import {ChatFile, ChatMessage} from "@/store/chat";
import {defineComponent} from "vue";

export default defineComponent({
    name: 'ChatInnerFooter',
    components: {ChatInnerFiles, SvgIcon},
    emits:['change-size', 'send-message'],
    setup(_, {emit}) {
        const chatTextarea: Ref<HTMLTextAreaElement | null> = ref(null);
        let showEmoji = ref(false);
        let message = ref('');
        let cursorRangePosition = ref(-1);
        let files = ref([] as ChatFile[]);

        const sendMessage = () => {
            let msg = new ChatMessage(message.value, new Date(), 'me',
                '12013006', 'SA', files.value);
            message.value = '';
            files.value = [];
            emit('change-size', files.value.length > 0);
            emit('send-message', msg);
        }

        const isMessageEmpty = computed(() => {
            return !files.value.length && !message.value.trim();
        })

        const getTextareaRef = () => chatTextarea.value;

        const openEmoji = () => {
            showEmoji.value = !showEmoji.value
        }

        const closeEmoji = () => {
            showEmoji.value = false;
        }

        const focusTextarea = () => {
            if (!getTextareaRef()) return;
            getTextareaRef()?.focus();
            if (cursorRangePosition.value != -1) {
                setTimeout(() => {
                    const offset = 1;
                    getTextareaRef()?.setSelectionRange(
                        cursorRangePosition.value + offset,
                        cursorRangePosition.value + offset
                    )
                    cursorRangePosition.value = -1;
                })
            }
        }

        const selectEmoji = (emoji: any) => {
            if (!emoji) return
            let startPos = getTextareaRef()?.selectionStart as number;
            let endPos = getTextareaRef()?.selectionEnd as number;
            message.value = getTextareaRef()?.value.substring(0, startPos) + emoji.i + getTextareaRef()?.value.substring(endPos);
            getTextareaRef()?.focus();
        }

        const onChangeInput = () => {
            if (getTextareaRef()?.value || getTextareaRef()?.value === '') {
                message.value = getTextareaRef()?.value as string;
            }
        }

        const resetFiles = () => {
            files.value = [];
            focusTextarea();
            emit('change-size', files.value.length > 0);
        }

        const removeFile = (index: number) => {
            files.value.splice(index, 1);
            focusTextarea();
            emit('change-size', files.value.length > 0);
        }

        return {
            files,
            isMessageEmpty,
            sendMessage,
            selectEmoji,
            showEmoji,
            openEmoji,
            closeEmoji,
            onChangeInput,
            message,
            removeFile,
            resetFiles
        }
    }
})


</script>


<style>
.chat-inner-footer {
  width: 100%;
  border-bottom-right-radius: 4px;
}
</style>
