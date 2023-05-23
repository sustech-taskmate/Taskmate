<template>
  <div class="message-container">
    <div class="message-info" v-for="msg in messages">
        <div style="font-size: calc(100vw * 10 / 1500); width: fit-content; margin-right: auto;">
            <div>{{ msg.senderName }}</div>
            <div>{{ msg.dateToString() }}</div>
            <svg-icon name="teacher" v-if="msg.senderType==='Teacher'"/>
            <svg-icon name="student" v-if="msg.senderType==='SA'"/>
        </div>
        <div class="message-card me-card" v-if="msg.senderName===myId" style="margin-left: auto;">
            {{ msg.text }}
            <el-image v-for="img in msg.images"
                      :src="img.localUrl"
                      :preview-src-list="[img.localUrl]"
                      :preview-teleported="true"/>
        </div>
        <div class="message-card you-card" v-else style="margin-left: auto;">
            {{ msg.text }}
            <el-image v-for="img in msg.images"
                      :src="img.localUrl"
                      :preview-src-list="[img.localUrl]"
                      :preview-teleported="true"/>
        </div>
        <div style="height: 1vh">

        </div>
    </div>
  </div>
</template>


<script lang="ts">
import {defineComponent, PropType, ref} from "vue";
import {ChatMessage} from "@/store/chat";
import SvgIcon from "@/components/util/SvgIcon.vue";
export default defineComponent({
    name: "ChatInnerMessages",
    components: {SvgIcon},
    props:{
        messages: {
            type: Array as PropType<ChatMessage[]>,
            required: true
        },
        myId:{
            type: String,
            require: true
        }
    },
})
</script>


<style>

.message-container {
  display: flex;
  word-break: break-all;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.message-card {
  font-size: 16px;
  line-height: 20px;
  padding: 6px 9px 3px;
  white-space: pre-line;
  max-width: 65%;
  margin-top: 10px;
  width: fit-content;
  border-radius: 20px 20px 20px 1px;
  margin-left: 1%;
  backdrop-filter: blur(20px);
  background-color: #F0F8FF;
}

.me-card {
  border-radius: 20px 20px 1px 20px;
  margin-left: auto;
  margin-right: 1%;
    background-color: lightskyblue;
}

.you-card {
    border-radius: 20px 20px 1px 20px;
    margin-left: auto;
    margin-right: 1%;
    background-color: lightgreen;
}

</style>
