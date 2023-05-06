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
import {downloadFile, analyzeDir} from '@/composable/grade'
import {AssignFile, AssignFileType, FileTreeNode, ZipFile} from '@/store/assign';
import {ref, watch} from "vue";
import {useElementBounding} from '@vueuse/core';
import {useTabStore} from "@/store";
import Sider from "@/components/AssignLeftBar/Sider.vue";
import AssignRightBar from "@/components/AssignRightBar/AssignRightBar.vue";
import {App} from "@/typing/system";
import ChatInner from "@/components/ChatInner/ChatInner.vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";

const route = useRoute();
const {routerPush} = useRouterPush();
const tab = useTabStore();

const toAssign = () => {
  let cid = route.params.cid;
  let aid = route.params.aid;
  routerPush({name: 'teacherAssign', params: {cid: cid, aid: aid}});
}


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

let zipNode = ref([] as FileTreeNode[]);
downloadFile()

analyzeDir().then((res) => {
  zipNode.value.push(res);
})

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
