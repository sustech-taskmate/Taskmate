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
      >
      </el-image>
      <div v-if="format==='markdown'">
        <v-md-preview :text="md" style="overflow-y: scroll;height: 100vh"></v-md-preview>
      </div>
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
      format: 'markdown',
      pdf_url: 'src/assets/test.pdf',
      img_url: 'src/assets/test.png',
      office: '',
      office_url: 'http://view.officeapps.live.com/op/view.aspx?src=' + this.office,
      md: '# Hello'
    }
  },
  methods: {},
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