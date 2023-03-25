<template>
  <div class="container">
    <div class="left">
      left
    </div>
    <div class="center">
      <iframe v-if="format==='pdf'" style="width: 100%; height: 98.5%;" :src="pdf_url"></iframe>
      <iframe v-if="format==='office'" style="width: 100%; height: 98.5%;" :src="office_url"></iframe>
      <el-image
          v-if="format==='img'"
          ref="image"
          lazy
          class="image"
          :src="'src/assets/test.png'"
          :preview-src-list="['src/assets/test.png']"
          style="position: absolute; left: 0; top: 25%"
      >
      </el-image>
      <div v-if="format==='markdown'">
        <v-md-preview :text="md" style="overflow-y: scroll;height: 100vh"></v-md-preview>
      </div>
      <video-player v-if="format==='mp4'" class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    style="position: absolute; left: 0; top: 25%"
      >
      </video-player>
    </div>
    <div class="right">
      right
    </div>
  </div>
</template>

<script>
export default {
  name: 'Assign',
  created() {
  },
  mounted() {
  },
  data() {
    return {
      format: 'office',
      pdf_url: 'src/assets/test.pdf',
      img_url: 'src/assets/test.png',
      office: '',
      office_url: 'http://view.officeapps.live.com/op/view.aspx?src=' + this.office,
      md: '# Hello',
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          src: 'src/assets/test.mp4',  // 路径
          type: 'video/mp4'  // 类型
        }, {
          src: 'src/assets/test.mp4',
          type: 'video/webm'
        }],
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        },
        controls: true
      }
    }
  },
  methods: {

  }
}
</script>

<style>

html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

.container {
  top: 0;
  display: flex;
}

.left {
  position: absolute;
  width: 25%;
  background-color: blue;
  top: 0;
  bottom: 0;
  left: 0;
}

.center {
  position: absolute;
  width: 45%;
  background-color: yellow;
  top: 0;
  bottom: 0;
  left: 25%;
}

.right {
  position: absolute;
  width: 30%;
  background-color: green;
  top: 0;
  bottom: 0;
  left: 70%;
}

.image {
}
</style>