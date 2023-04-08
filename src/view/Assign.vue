<template>
  <el-container type="flex" style="height: 100vh; overflow-x: hidden">
    <el-col :span="myWidthLeft">
      <el-row type="flex" justify="space-between" style="margin-bottom: 50px">
        <div v-cloak v-show="blockShow">
          <span>学号  12011901</span>
          <br/>
          <span>姓名  郭希阳</span>
        </div>
        <el-button justify="end" type="primary" @click="flexible"><el-icon><Menu /></el-icon></el-button>
      </el-row>
      <el-scrollbar style="height: 40%; margin-right: 2%;">
        <el-menu
            id="left"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            :collapse="myCollapse"
            style="border-right: none; width: 100%;"
        >
          <h2>作业文件</h2>
          <template v-for="(item, index) in fileMap.values()" :key="index">
            <tree-menu v-if="item.format===AssignFileType.zip" :index="item.filename" :nodes="zipNode">
              <el-icon>
                <FolderOpened />
              </el-icon>
              <span>{{ item.filename }}</span>
            </tree-menu>

            <el-menu-item v-else :index="item.filename">
              <el-icon v-if="item.format===AssignFileType.video">
                <VideoPlay />
              </el-icon>
              <el-icon v-else-if="item.format===AssignFileType.image">
                <PictureFilled />
              </el-icon>
              <el-icon v-else>
                <Document />
              </el-icon>
              <template #title>
                <span>{{ item.filename }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
      <el-row>
        <el-col :span="23">
          <span>留言板</span>
          <el-input
              v-model="textarea"
              :rows="10"
              type="textarea"
              placeholder="请输入你的留言"
          />
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="myWidthCenter" style="background-color: blue">
      <iframe v-if="format===AssignFileType.pdf" style="width: 100%; height: 98.5%;" :src="url"></iframe>
      <iframe v-if="format===AssignFileType.office" style="width: 100%; height: 98.5%;" :src="url"></iframe>
      <el-image
          v-if="format===AssignFileType.image"
          ref="image"
          lazy
          class="image"
          :src="url"
          :preview-src-list="[url]"
          style="position: absolute; left: 0; top: 25%"
      >
      </el-image>
      <div v-if="format===AssignFileType.markdown">
        <v-md-preview :text="md" style="overflow-y: auto;height: 100vh"></v-md-preview>
      </div>
      <video-player v-if="format===AssignFileType.video" class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    style="position: absolute; left: 0; top: 25%"
      >
      </video-player>
    </el-col >
    <el-col :span="5" style="background-color: yellowgreen">
      <assign-right-bar></assign-right-bar>
    </el-col>
  </el-container>
</template>


<script lang="ts" setup>
import {Menu} from "@element-plus/icons-vue";
import {AssignFile, AssignFileType} from '@/store/assign';
import {ref} from "vue";
import {
  Folder,
  Document,
  VideoPlay,
  PictureFilled,
  FolderOpened,
} from '@element-plus/icons-vue'
import TreeMenu from "@/components/TreeMenu.vue";
import AssignRightBar from "@/components/AssignRightBar.vue";

let myCollapse = ref(false)
let myWidthLeft = ref(5)
let myWidthCenter = ref(14)
let blockShow = ref(true)

const textarea = ref('')

const flexible = () => {
    if (myCollapse.value) {
        blockShow.value = true
        myWidthLeft.value = 5
        myWidthCenter.value = 14
    }
    else {
        blockShow.value = false
        myWidthLeft.value = 1
        myWidthCenter.value = 18
    }
    myCollapse.value = !myCollapse.value
}


let fileMap = new Map<string, AssignFile>([
  ['test.zip', new AssignFile('test.zip', AssignFileType.zip,
      'src/assets/test.zip', undefined)],
  ['test.mp4', new AssignFile('test.mp4', AssignFileType.video,
      'src/assets/test.mp4', undefined)],
  ['test.pdf', new AssignFile('test.pdf', AssignFileType.pdf,
      'src/assets/test.pdf', undefined)],
  ['test.png', new AssignFile('test.png', AssignFileType.image,
      'src/assets/test.png', undefined)],
])
let format = ref(AssignFileType.placeholder);
let url = ref("");

const handleSelect = (key: string, keyPath: string[]) => {
  let filename = key.split("\n")[0];
  let file = fileMap.get(filename);
  if (!file) return;
  if (file.format === AssignFileType.pdf) {
    format.value = file.format;
    url.value = file.url;
  } else if (file.format === AssignFileType.video) {
    format.value = file.format;
    url.value = file.url;
  } else if (file.format === AssignFileType.zip) {
    format.value = file.format;
    url.value = file.url;
  } else if (file.format === AssignFileType.image) {
    format.value = file.format;
    url.value = file.url;
  }
}

let playerOptions = ref({
  playbackRates: [0.7, 1.0, 1.25, 1.5, 2.0], //播放速度
  autoplay: true, //如果true,浏览器准备好时开始回放。
  muted: false, // 默认情况下将会消除任何音频。
  loop: true, // 导致视频一结束就重新开始。
  preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  language: 'en',
  aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
  fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  sources: [{
    src: url,  // 路径
    type: 'video/mp4'  // 类型
  }, {
    src: url,
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
});

</script>

<script lang="ts">
import {defineComponent} from 'vue';
import JSZip, {JSZipObject} from 'jszip';
import {AssignFile, AssignFileType, FileTreeNode, ZipFile} from '@/store/assign';

export default defineComponent({
  name: 'Assign',
  created() {
    let zipFiles = this.getTemplateZipData("src/assets/test.zip");
    zipFiles.then(data => {
      this.zipNode.push(this.buildFileTree("test.zip", (data as ZipFile[])));
    });
  },
  mounted() {
  },
  data() {
    return {
      zipNode: [] as FileTreeNode[],
    }
  },
  methods: {
    urlToBlob(url: string) {
      return new Promise((resolve, reject) => {
        fetch(url).then(response => {
          return response.blob();
        }).then(blobData => {
          resolve(blobData)
        })
      })
    },
    getZipData(blobData: Blob) {
      return new Promise(async (resolve, reject) => {
        let zips = [] as ZipFile[];
        let zipObj = new JSZip();
        let zipFile = await zipObj.loadAsync(blobData as any);
        for (let key in zipFile.files) {
          let file = zipFile.files[key];
          let f = undefined;
          if (file.dir) {
            f = new ZipFile(file.name, true, undefined);
          } else {
            let tmpName = zipFile.files[key].name;
            let fileBlob = await (zipFile.file(tmpName) as JSZipObject).async("blob");
            f = new ZipFile(file.name, false, fileBlob);
          }
          zips.push(f);
        }
        resolve(zips);
      })
    },
    getTemplateZipData(url: string) {
      return new Promise(async (resolve, reject) => {
        let blobData = await this.urlToBlob(url) as Blob;
        let templateData = await this.getZipData(blobData)
        resolve(templateData);
      })
    },
    buildFileTree(zipName: string, zipFiles: ZipFile[]): FileTreeNode {
      const root = new FileTreeNode(zipName, true, true, undefined);
      zipFiles.sort((a: ZipFile, b: ZipFile) => a.name.length - b.name.length);
      const map = new Map<string, FileTreeNode>();
      map.set('', root);
      for (const file of zipFiles) {
        let dirName = file.name;
        if (file.dir) {
          let substring = dirName.substring(0, dirName.length - 1);
          let index = substring.lastIndexOf('/');
          if (index === -1) {
            let p = new FileTreeNode(substring, true, false, file.data);
            p.parent = root;
            root.children.push(p);
            map.set(dirName, p);
          } else {
            substring = dirName.substring(index + 1, dirName.length - 1);
            let p = new FileTreeNode(substring, true, false, file.data);
            p.parent = map.get(dirName.substring(0, index + 1));
            (map.get(dirName.substring(0, index + 1)) as FileTreeNode).children.push(p);
            map.set(dirName, p);
          }
        } else {
          let index = dirName.lastIndexOf('/');
          if (index === -1) {
            let p = new FileTreeNode(dirName, false, false, file.data);
            p.parent = root;
            root.children.push(p);
          } else {
            let p = new FileTreeNode(dirName.substring(index + 1), false, false, file.data);
            p.parent = map.get(dirName.substring(0, index + 1));
            (map.get(dirName.substring(0, index + 1)) as FileTreeNode).children.push(p);
          }
        }
      }
      return root;
    }

  }
});

</script>

<style>

.el-menu-vertical-demo{
  /*height: 60vh;*/
  overflow-y: auto;
  overflow-x: hidden;
}
</style>