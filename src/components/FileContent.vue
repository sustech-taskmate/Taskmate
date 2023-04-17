<template>
  <div v-if="format===AssignFileType.txt" class="txt">
    {{ data }}
  </div>
  <iframe v-if="format===AssignFileType.pdf" style="width: 100%; height: 100%;" :src="url"></iframe>
  <iframe v-if="format===AssignFileType.office" style="width: 100%; height: 100%;" :src="url"></iframe>
  <div style="flex: 1">
    <el-image
        v-if="format===AssignFileType.image"
        ref="image"
        lazy
        class="image"
        :src="url"
        :preview-src-list="[url]"
    >
    </el-image>
  </div>
  <v-md-preview :text="data" v-if="format===AssignFileType.markdown" class="md"></v-md-preview>
  <video-player v-if="format===AssignFileType.video" class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
  >
  </video-player>
</template>

<script setup lang="ts">
import {AssignFileType} from '@/store/assign';
import {App} from "@/typing/system";
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import {decrypt} from "@/util/crypto";

const route = useRoute()
const selectedFile = ref({} as App.AssignMenu)

let format = ref(AssignFileType.placeholder);
let url = ref("");
let data = ref("");
let playerOptions = ref({})

updateData()

function updateData(){
  console.log(route.fullPath)
  console.log(route.params.detail)
  selectedFile.value = decrypt(route.params?.detail as string) as App.AssignMenu
  format.value = selectedFile.value.data.format
  url.value = selectedFile.value.data.url
  data.value = selectedFile.value.data.data
  playerOptions.value = {
    playbackRates: [0.7, 1.0, 1.25, 1.5, 2.0], //播放速度
    autoplay: false, //如果true,浏览器准备好时开始回放。
    muted: false, // 默认情况下将会消除任何音频。
    loop: true, // 导致视频一结束就重新开始。
    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    language: 'en',
    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    sources: [{
      src: selectedFile.value.data.url,  // 路径
      type: 'video/mp4'  // 类型
    }, {
      src: selectedFile.value.data.url,
      type: 'video/webm'
    }],
    notSupportedMessage: 'The video can not be played, please try again later', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
    controlBar: {
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: false,
      fullscreenToggle: true  //全屏按钮
    },
    controls: true
  }
}

watch(
    () => route.params,
    () => updateData(),
    {immediate: true}
)

</script>

<style scoped></style>
