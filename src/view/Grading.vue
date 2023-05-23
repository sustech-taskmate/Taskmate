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
                        <div style="color: white; font-size: 1.4vw; text-align: center">{{ sid }}</div>
                    </div>
                </el-col>
                <el-col :span="topbarMenu" style="display: flex; height: 100%; align-items: center">
                    <svg-icon name="menu2" color="white" @click="flexible"
                              style="cursor: pointer; width: 5vw; height: 5vh"/>
                </el-col>
            </el-row>
            <sider :nodes="nodes" :myCollapse="leftCollapse" v-bind:style="{height: siderHeight}"/>
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
                <chat-inner :cid="cid" :eid="eid"/>
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
        <el-col :span="5" style="background-color: #EEF0F1">
            <assign-right-bar
                :all-students="parseInt(allStudents)"
                :finished-students="parseInt(finishedStudents)"
                :assignment-name="aname"
                :course-code="cname"
                :metrics="metrics"
                :total-points="totalPoints"
                :gid="gid"
                @toAssign="toAssign"
                @next="next"
            />
        </el-col>
    </el-container>
</template>


<script lang="ts" setup>
import {analyzeDir, downloadAll} from '@/composable/grade'
import {FileTreeNode} from '@/store/assign';
import {reactive, ref, watch} from "vue";
import {useElementBounding} from '@vueuse/core';
import {useTabStore} from "@/store";
import Sider from "@/components/AssignLeftBar/Sider.vue";
import AssignRightBar from "@/components/AssignRightBar/AssignRightBar.vue";
import ChatInner from "@/components/ChatInner/ChatInner.vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";
import {
    Assignment,
    getEntry,
    getSubmissionInfo,
    getSubmissions,
    sendNote,
    Submission
} from "@/composable/serverRequest";
import {Card} from "@/store/todo";

const route = useRoute();
const {routerPush} = useRouterPush();
const tab = useTabStore();

const cid = ref(route.params.cid as string);
const aid = ref(route.params.aid as string);
const gid = ref(route.params.gid as string);
const sid = ref(route.query.sid as string);
const eid = ref(route.query.eid as string);
const allStudents = ref(route.query.allStudents as string);
const finishedStudents = ref(route.query.finishedStudents as string);

const assignments = reactive(JSON.parse(route.query.assignments as string) as Assignment[])
let aname = ref(assignments[parseInt(aid.value)].name)
let cname = ref('');
const courses = reactive(JSON.parse(route.query.courses as string) as Card[])
for (const i of courses) {
    for (const j of i.listContainCard) {
        if (j.id === parseInt(cid.value)) {
            cname.value = j.code;
        }
    }
}

const toAssign = () =>
    routerPush({
        name: 'teacherAssign', params: {cid: cid.value, aid: aid.value},
        query: {assignments: route.query.assignments, courses: route.query.courses}
    });
const next = async () => {
    const submissionList = await getSubmissions(cid.value);
    const submissions = [] as Submission[];
    const temp = submissionList.submissions;
    temp.forEach((value) => {
        if (value.assignment.name == assignments[parseInt(aid.value)].name) {
            submissions.push(value);
        }
    })
    let tempEid = ref('');
    let tempGid = ref('');
    let tempSid = ref('');
    let cnt = 0;
    submissions.forEach((value) => {
        if (value.scoring === null) {
            tempEid.value = value.entry.uuid;
            tempGid.value = value.uuid;
            tempSid.value = value.submitter.sid;
        } else {
            cnt++;
        }
    })
    if (tempEid.value === '') {
        await toAssign();
    } else {
        await routerPush({
            name: 'grade', params: {cid: cid.value, aid: aid.value, gid: tempGid.value},
            query: {
                assignments: route.query.assignments,
                courses: route.query.courses,
                eid: tempEid.value,
                sid: tempSid.value,
                allStudents: allStudents.value,
                finishedStudents: cnt
            }
        });
        //TODO: rendering page again
    }
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

const entry = await getEntry(cid.value, eid.value)
const metrics = ref(entry.entry.metrics);
let totalPoints = ref(0)
metrics.value.forEach((metric) => {
    totalPoints.value += metric.max
})


const submissionInfo = await getSubmissionInfo(gid.value);
// const url = [submissionInfo.submission.answers[0].file]
let urls = submissionInfo.submission.answers[0].files.map((file) => {
    return file.url
})
let names = submissionInfo.submission.answers[0].files.map((file) => {
    return file.name
})

// urls = ['https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/a.zip', 'https://ooad-1312953997.cos.ap-guangzhou.myqcloud.com/test.pdf']
downloadAll(urls, (gid.value as string), names);
let nodes = ref(new Map<string, FileTreeNode>());
analyzeDir((gid.value as string)).then((res) => {
    for (let i = 0; i < res.children.length; i++) {
        nodes.value.set(res.children[i].url, res.children[i]);
    }
})

</script>

<style>

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
