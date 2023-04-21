<template>
  <el-container type="flex" style="height: 100vh; overflow-x: hidden">
    <el-col :span="myWidthLeft">
      <el-row type="flex" justify="space-between" style="margin-bottom: 50px">
        <div v-cloak v-show="blockShow">
          <span>学号  12011901</span>
          <br/>
          <span>姓名  郭希阳</span>
        </div>
        <el-button justify="end" type="primary" @click="flexible">
          <el-icon>
            <Menu/>
          </el-icon>
        </el-button>
      </el-row>
      <sider :AssignMap="all_data" :zipNode="zipNode"></sider>
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

let all_data = new Map<string, App.AssignMenu>([
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
  } else {
    blockShow.value = false
    myWidthLeft.value = 1
    myWidthCenter.value = 18
  }
  myCollapse.value = !myCollapse.value
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
import {invoke} from '@tauri-apps/api/tauri'
import { exists, readTextFile } from '@tauri-apps/api/fs';
import {appDataDir} from '@tauri-apps/api/path';
import * as path from 'path';

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
            f = new ZipFile(file.name, true, '');
          } else {
            let tmpName = zipFile.files[key].name;
            let fileBlob = await (zipFile.file(tmpName) as JSZipObject).async("blob");
            f = new ZipFile(file.name, false, '');
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
    async getDownloadPath(): Promise<string> {
      return appDataDir()
    },
    async downloadFile(url: string) {
      /*
        test url : "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip"
       */
      const path = await this.getDownloadPath();
      const origin = await this.getDownloadPath();
      console.log(path)
      invoke('download_file', {url: url, filePath: path}).then(
          (resolved:any) => {
            console.log(resolved)
          }
      ).catch((err) =>{
        console.log(err)
      });
      await invoke('analyze_dir', {target: path + "\\student_file", origin: origin})
      /*
        from origin path get path.json and buildFileTree
      * */
      const ZipName = "student_file";
      let fPath: string = path.concat("\\").concat("path.json");
      console.log(fPath);
      exists(fPath).then()
      .catch((err)=>{
        console.log(err);
      })
      const fileContent=await  readTextFile(fPath);
      const zipFiles: ZipFile[] = JSON.parse(fileContent).data as ZipFile[];
      const fileTree = this.buildFileTree("student_file", zipFiles);
      console.log(fileTree)
    },
    buildFileTree(zipName: string, zipFiles: ZipFile[]): FileTreeNode {
      const root = new FileTreeNode(zipName, true, true, '');
      zipFiles.sort((a: ZipFile, b: ZipFile) => a.name.length - b.name.length);
      const map = new Map<string, FileTreeNode>();
      map.set('', root);
      for (const file of zipFiles) {
        let dirName = file.name;
        if (file.dir) {
          dirName+='/';
          let substring = dirName.substring(0, dirName.length - 1);
          let index = substring.lastIndexOf('/');
          if (index === -1) {
            let p = new FileTreeNode(substring, true, false, file.url);
            p.parent = root;
            root.children.push(p);
            map.set(dirName, p);
          } else {
            substring = dirName.substring(index + 1, dirName.length - 1);
            let p = new FileTreeNode(substring, true, false, file.url);
            p.parent = map.get(dirName.substring(0, index + 1));
            (map.get(dirName.substring(0, index + 1)) as FileTreeNode).children.push(p);
            map.set(dirName, p);
          }
        } else {
          let index = dirName.lastIndexOf('/');
          if (index === -1) {
            let p = new FileTreeNode(dirName, false, false, file.url);
            p.parent = root;
            root.children.push(p);
          } else {
            let p = new FileTreeNode(dirName.substring(index + 1), false, false, file.url);
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
</style>