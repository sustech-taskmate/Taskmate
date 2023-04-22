<template>
  <div class="chat vac-app-box-shadow">
    <el-row style="width: 100%;" :style="{ height: topHeight }">
      <chat-inner-messages :messages="messages"/>
    </el-row>
    <el-row class="footer" :style="{ height: downHeight }">
      <chat-inner-footer @change-size="updateHeight" @send-message="sendMessage"/>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import ChatInnerFooter from "./ChatInnerFooter.vue";
import ChatInnerMessages from "./ChatInnerMessages.vue";
import {ChatMessage} from "@/store/chat";

let topHeight = ref('89%');
let downHeight = ref('10%');

let messages = ref<ChatMessage[]>([]);

const sendMessage = (msg: ChatMessage) => {
  messages.value.push(msg);
}

const updateHeight = (flag: boolean) => {
  if (flag) {
    topHeight.value = '60%';
    downHeight.value = '39%';
  } else {
    topHeight.value = '89%';
    downHeight.value = '10%';
  }
}

</script>

<script lang="ts">
export default {
  name: "ChatInner"
}
</script>

<style>
.chat {
  display: flex;
  width: 98%;
  height: 100%;
  background-color: #F5F5F5;
  border-radius: 10px;
  box-sizing: border-box;
  flex-direction: column;
}

.footer {
  width: 100%;
  border-top: #E6E6FA;
  border-top-style: solid;
  border-top-width: thin
}

</style>
