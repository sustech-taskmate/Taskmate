<template>
  <div
      class="chat-inner-footer"
  >
    <chat-inner-files
        :files="files"
        @remove-file="removeFile"
        @reset-files="resetFiles">
    </chat-inner-files>

    <div style="width: 100%;display: flex;align-items: center;">
          <textarea
              v-model="message"
              id="chatTextarea"
              ref="chatTextarea"
              class="vac-textarea"
              @input="onChangeInput"
              @paste="onPasteImage"
              @keydown.esc="closeEmoji"
              @keydown.ctrl.enter="sendMessage"
              style="background-color: snow"
          />
      <div
          class="vac-svg-button"
      >
        <label for="uploadFile" style="cursor: pointer">
          <svg-icon name="image" color="#000"/>
        </label>
        <input
            multiple
            hidden
            type="file"
            id="uploadFile"
            accept="image/*"
            @change="onFileChange($event.target.files)"
        />
      </div>
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
          class="vac-svg-button"
          :class="{ 'vac-send-disabled': isMessageEmpty }"
      >
        <slot name="send-icon">
          <svg-icon name="send"
                    :color="isMessageEmpty?'#B0C4DE':'#000'"
                    @click="sendMessage"/>
        </slot>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed, ref, Ref} from "vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import '@/assets/style/local/emoji.scss'
import ChatInnerFiles from "@/components/ChatInner/ChatInnerFiles.vue";
import {ChatFile, ChatMessage} from "@/store/chat";

const chatTextarea: Ref<HTMLTextAreaElement | null> = ref(null);
let showEmoji = ref(false);
let message = ref('');
let cursorRangePosition = ref(-1);
let files = ref([] as ChatFile[]);

const emits = defineEmits(['change-size', 'send-message']);

const sendMessage = () => {
  let msg = new ChatMessage(message.value, new Date(), 'me',
      '12013006', 'SA', files.value);
  message.value = '';
  files.value = [];
  emits('change-size', files.value.length > 0);
  emits('send-message', msg);
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

async function onFileChange(choseFiles: any) {
  focusTextarea()
  Array.from(choseFiles).forEach(
      async (file: any) => {
        const fileURL = URL.createObjectURL(file)
        const typeIndex = file.name.lastIndexOf('.')
        if (file.type.includes('image')) {
          const f = new ChatFile(false,
              file.name.substring(0, typeIndex), file.size,
              file.type, file.name.substring(typeIndex + 1), fileURL);
          files.value.push(f);
        }
      }
  )
  emits('change-size', files.value.length > 0);
}

const resetFiles = () => {
  files.value = [];
  focusTextarea();
  emits('change-size', files.value.length > 0);
}

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  focusTextarea();
  emits('change-size', files.value.length > 0);
}

const onPasteImage = (pasteEvent: any) => {
  const items = pasteEvent.clipboardData?.items
  if (items) {
    Array.from(items).forEach((item: any) => {
      if (item.type.includes('image')) {
        const blob = item.getAsFile()
        onFileChange([blob])
      }
    })
  }
}
</script>

<script lang="ts">
export default {
  name: 'ChatInnerFooter',
}
</script>

<style>
.chat-inner-footer {
  width: 100%;
  border-bottom-right-radius: 4px;
}
</style>
