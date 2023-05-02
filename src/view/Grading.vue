<template>
  <el-container type="flex" style="height: 100vh; overflow-x: hidden;overflow-y: hidden">
    <el-col :span="myWidthLeft">
      <el-row style="background-color: steelblue; position: relative;display: flex; height: 8%;">
        <el-col :span="topbarReturn" style="display: flex; height: 100%; align-items: center">
          <svg-icon name="arrayLeft2" color="white" v-show="!leftCollapse"
                    style="height: 5vh; width: 5vw; cursor: pointer" @click="toAssign"/>
        </el-col>
        <el-col :span="topbarInfo">
          <div
              style="display: flex; flex-direction: column; height: 100%; align-items: center; justify-content: center;">
            <div style="color: white; font-size: 1.4vw; text-align: center">11110000</div>
            <div style="color: white; font-size: 1.4vw; text-align: center">Harry Potter</div>
          </div>
        </el-col>
        <el-col :span="topbarMenu" style="display: flex; height: 100%; align-items: center">
          <svg-icon name="menu2" color="white" @click="flexible"
                    style="cursor: pointer; width: 5vw; height: 5vh"/>
        </el-col>
      </el-row>
      <sider :assignMap="allData" :zipNode="zipNode" :myCollapse="leftCollapse"
             v-bind:style="{height: siderHeight}"></sider>
      <div style="display: flex;background-color: steelblue;width: 100%;height: 5%;
                  font-size: calc(100vh * 28 / 1500);text-align: center;align-items: center;
                  justify-content: center;color: white;border-radius: 100px;cursor: pointer"
           v-if="!leftCollapse&&!isChatbar" @click="showChatbar">
        Chat Bar &ensp;
        <svg-icon name="plus" color="white"/>
      </div>
      <el-row style="height: 52%;" v-bind:style="{height: chatbarHeight}" v-show="!leftCollapse&&isChatbar">
        <div class="chatbar" @click="hideChatbar">
          Chat Bar &ensp;
          <svg-icon name="subtract" color="white"/>
        </div>
        <chat-inner></chat-inner>
      </el-row>
    </el-col>
    <el-col :span="myWidthCenter" style="background-color: white;display: flex; flex-direction: column;
    align-items: center;text-align: center;justify-content: center;height: 100%;overflow: hidden;">
      <!--      <el-empty class="empty" v-if="format===AssignFileType.placeholder" description="No Opened File" />-->
      <!--      <div ref="bsWrapper" class="flex-1-hidden h-full">-->
      <!--        <tab-detail @scroll="handleScroll" />-->
      <!--      </div>-->
      <router-view v-slot="{ Component }">
        <component :is="Component"/>
      </router-view>
    </el-col>
    <el-col :span="5" style="background-color: yellowgreen">
      <assign-right-bar></assign-right-bar>
    </el-col>
  </el-container>
</template>


<script lang="ts" setup>
import {AssignFile, AssignFileType} from '@/store/assign';
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useElementBounding} from '@vueuse/core';
import {useTabStore} from "@/store";
import Sider from "@/components/AssignLeftBar/Sider.vue";
import AssignRightBar from "@/components/AssignRightBar/AssignRightBar.vue";
import {App} from "@/typing/system";
import {invoke} from "@tauri-apps/api/tauri";
import ChatInner from "@/components/ChatInner/ChatInner.vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {router} from "@/router";

const toAssign = () => {
  let cid = router.currentRoute.value.params.cid;
  let aid = router.currentRoute.value.params.aid;
  router.push({name: 'teacherAssign', params: {cid: cid, aid: aid}});
}

const route = useRoute();
const tab = useTabStore();

const bsWrapper = ref<HTMLElement>();
const {width: bsWrapperWidth, left: bsWrapperLeft} = useElementBounding(bsWrapper);

const bsScroll = ref();

function handleScroll(clientX: number) {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;
  if (bsScroll.value) {
    const {maxScrollX, x: leftX} = bsScroll.value.instance;
    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);
    bsScroll.value?.instance.scrollBy(update, 0, 300);
  }
}

function init() {
  tab.iniTabStore(route);
}

watch(
    () => route.fullPath,
    () => {
      tab.addTab(route);
      tab.setActiveTab(route.fullPath);
    }
);

init()

let allData = new Map<string, App.AssignMenu>([
  ['src/assets/test.zip', {
    index: "src/assets/test.zip", name: "test.zip", format: AssignFileType.zip
  }],
  ['src/assets/test1.mp4', {
    index: "src/assets/test1.mp4", name: "test1.mp4", format: AssignFileType.video,
  }],
  ['src/assets/test.pdf', {
    index: "src/assets/test.pdf", name: "test.pdf", format: AssignFileType.pdf,
  }]
])

let leftCollapse = ref(false)
let myWidthLeft = ref(5)
let myWidthCenter = ref(14)

let topbarReturn = ref(4);
let topbarInfo = ref(16);
let topbarMenu = ref(4);

let siderHeight = ref('86%')
let chatbarHeight = ref('0');
let isChatbar = ref(false);

const showChatbar = () => {
  isChatbar.value = true;
  siderHeight.value = '46%';
  chatbarHeight.value = '46%';
}

const hideChatbar = () => {
  isChatbar.value = false;
  siderHeight.value = '86%';
  chatbarHeight.value = '0';
}

const flexible = () => {
  leftCollapse.value = !leftCollapse.value;
  myWidthLeft.value = leftCollapse.value ? 1 : 5;
  myWidthCenter.value = leftCollapse.value ? 18 : 14;
  topbarReturn.value = leftCollapse.value ? 0 : 4;
  topbarInfo.value = leftCollapse.value ? 0 : 16;
  topbarMenu.value = leftCollapse.value ? 24 : 4;
}

let fileMap = new Map<string, AssignFile>([
  ['test.zip', new AssignFile('test.zip', AssignFileType.zip,
      'src/assets/test.zip', undefined)],
  ['test1.mp4', new AssignFile('test1.mp4', AssignFileType.video,
      'src/assets/test1.mp4', undefined)],
  ['test.pdf', new AssignFile('test.pdf', AssignFileType.pdf,
      'src/assets/test.pdf', undefined)],
  ['test.png', new AssignFile('test.png', AssignFileType.image,
      'src/assets/test.png', undefined)],
  ['test1.png', new AssignFile('test1.png', AssignFileType.image,
      'src/assets/test1.png', undefined)],
  ['test.txt', new AssignFile('test.txt', AssignFileType.txt,
      'src/assets/test.txt', 'Test TXT')],
  ['test.md', new AssignFile('test.md', AssignFileType.markdown,
      'src/assets/test.md', '# Test Markdown')],
])
let format = ref(AssignFileType.placeholder);
let url = ref("");
let data = ref("");

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
  } else if (file.format === AssignFileType.txt) {
    format.value = file.format;
    url.value = file.url;
    data.value = file.data;
  } else if (file.format === AssignFileType.markdown) {
    format.value = file.format;
    url.value = file.url;
    data.value = file.data;
  }
}

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

.empty {
  width: 100%;
  height: 100%;
}

.txt {
  white-space: pre-wrap;
  text-align: left;
  max-height: 100%;
  width: 100%;
  overflow-y: scroll;
}

.md {
  text-align: left;
  max-height: 100%;
  width: 100%;
  overflow-y: scroll;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}


.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.chatbar {
  display: flex;
  background-color: steelblue;
  width: 100%;
  height: 10%;
  font-size: calc(100vh * 28 / 1500);
  text-align: center;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 100px 100px 0 0;
  cursor: pointer;
}
</style>
