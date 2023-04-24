<template>
  <div class="message-container">
    <div class="message-info" v-for="msg in messages">
      <div class="message-card" :class="{'me-card':msg.senderName==='me'}">
        {{ msg.text }}
        <el-image v-for="img in msg.images"
                  :src="img.localUrl"
                  :preview-src-list="[img.localUrl]"
                  :preview-teleported="true"/>
      </div>
      <div style="font-size: calc(100vw * 14 / 1500);width: fit-content;" v-if="msg.senderName!=='me'">
        <svg-icon name="teacher" v-if="msg.senderType==='Teacher'"/>
        <svg-icon name="student" v-if="msg.senderType==='SA'"/>
        <span>{{ msg.senderName }}</span>&ensp;<span>{{ msg.dateToString() }}</span>
      </div>
      <div style="font-size: calc(100vw * 14 / 1500);width: fit-content;margin-left: auto;" v-if="msg.senderName==='me'">
        <span>{{ msg.dateToString() }}</span>&ensp;<span>{{ msg.senderName }}</span>
        <svg-icon name="teacher" v-if="msg.senderType==='Teacher'"/>
        <svg-icon name="student" v-if="msg.senderType==='SA'"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from "@/components/util/SvgIcon.vue";

const props = defineProps({
  messages: {
    type: [],
    required: true
  }
})
</script>

<script lang="ts">
export default {
  name: "ChatInnerMessages"
}
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
  background-color: #00BFFF;
}

</style>
