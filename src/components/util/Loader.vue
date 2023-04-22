<template>
  <transition name="vac-fade-spinner" appear>
    <div
        v-if="show"
        class="vac-loader-wrapper"
        :class="{
				'vac-container-center': !infinite,
				'vac-container-top': infinite
			}"
    >
      <slot v-if="type === 'chats'" name="spinner-icon-chats">
        <div id="vac-circle"/>
      </slot>
      <slot v-if="type === 'infinite-chats'" name="spinner-icon-infinite-chats">
        <div id="vac-circle"/>
      </slot>
      <slot
          v-if="type === 'message-file'"
          :name="'spinner-icon-message-file_' + messageId"
      >
        <div id="vac-circle"/>
      </slot>
      <slot v-if="type === 'chat-file'" name="spinner-icon-chat-file">
        <div id="vac-circle"/>
      </slot>
      <slot v-if="type === 'messages'" name="spinner-icon-messages">
        <div id="vac-circle"/>
      </slot>
      <slot
          v-if="type === 'infinite-messages'"
          name="spinner-icon-infinite-messages"
      >
        <div id="vac-circle"/>
      </slot>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import '@/assets/style/local/loader.scss'</script>

<script lang="ts">
export default {
  name: 'Loader',

  props: {
    show: {type: Boolean, default: false},
    infinite: {type: Boolean, default: false},
    type: {type: String, required: true},
    messageId: {type: String, default: ''}
  }
}
</script>
