<template>
  <div style="width: 100vw; height: 100vh; overflow:hidden">
    <div id="container">
      <div style="border-right: 1px solid darkseagreen; height: 100vh; position: relative"
           v-bind:style="{ width: leftSize.width }">
        <div style="background-color: steelblue; position: relative; display: flex" v-bind:style="{width: leftSize.width, height: leftSize.height}">
          <svg-icon name="home" color="white"
                    @click="toIndex"
                    style="position: absolute; height: 6vh; width: 6vw; cursor: pointer"
                    v-bind:style="{left: leftSize.left1, top: leftSize.top1}"></svg-icon>
          <svg-icon name="arrayLeft2" color="white"
                    @click="toCourse"
                    style="position: absolute; height: 6vh; width: 5vw; cursor: pointer"
                    v-bind:style="{left: leftSize.left2, top: leftSize.top2}"></svg-icon>
          <svg-icon name="menu2" color="white"
                    @click="flexible()"
                    style="position: absolute; width: 6vw; height: 8vh; cursor: pointer"
                    v-bind:style="{left: leftSize.left3, top: leftSize.top3}"></svg-icon>
        </div>
        <div v-if="leftShow" style="height: 90vh">
          <div style="width: 20vw; left: 1vw; position: relative">
            <div style="position: relative; width: 20vw; height: 7vh">
              <span style="margin-left: 1vw; line-height: 5vh; font-size: 2vw; position: absolute; left: 0; top: 1vh">CS 1234</span>
              <svg-icon name="arrayLeft" @click="hidden()" v-if="!courseShow"
                        style="position: absolute; right: 0; top: 0; width: 20%; height: 100%"></svg-icon>
              <svg-icon name="arrayDown" @click="hidden()" v-show="courseShow"
                        style="position: absolute; right: 0; top: 0; width: 20%; height: 100%"></svg-icon>
            </div>
            <div v-if="courseShow" style="width: 20vw; height: 28vh; position:relative; border-top: 2px solid black">
              <ul style="position: absolute; left: 0; top: 0; list-style: none; padding-left: 2vw; line-height: 7vh; padding-bottom: 5vh">
                <li v-for="assignment in assignments" >
                  <a @click="myClick()">
                    <span class="table-word" style="line-height: 7vh">{{ assignment.ass }}</span>
                    <svg-icon :name="assignment.icon" style="width: 2.5vw; height: 2.5vw"></svg-icon>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div style="width: 20vw; left: 1vw; position: relative; margin-top: 1vh;">
            <div style="position: relative; width: 20vw; height: 7vh">
              <span style="margin-left: 1vw; line-height: 5vh; font-size: 2vw; position: absolute; left: 0; top: 1vh">CS 6789</span>
              <svg-icon name="arrayLeft" @click="hidden2()" v-if="courseShow2"
                        style="position: absolute; right: 0; top: 0; width: 20%; height: 100%"></svg-icon>
              <svg-icon name="arrayDown" @click="hidden2()" v-show="!courseShow2"
                        style="position: absolute; right: 0; top: 0; width: 20%; height: 100%"></svg-icon>
            </div>
            <div v-if="!courseShow2" style="width: 20vw; height: 28vh; position:relative; border-top: 2px solid black">
              <ul style="position: absolute; left: 0; top: 0; list-style: none; padding-left: 2vw; line-height: 7vh; padding-bottom: 5vh">
                <li v-for="assignment in assignments" >
                  <a @click="myClick()">
                    <span class="table-word" style="line-height: 7vh">{{ assignment.ass }}</span>
                    <svg-icon :name="assignment.icon" style="width: 2.5vw; height: 2.5vw"></svg-icon>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 100vh; position: relative">
        <div style="background-color: steelblue; color: white; height: 10vh; align-items: center">
          <span class="word" style="line-height: 3vh; position: absolute; left: 3vw; top: 3vh;">作业信息</span>
        </div>
        <div style="left: 0; top: 2vh; position: relative">
          <span class="word" style="line-height: 3vh; position: absolute; left: 2.5vw; top: 2vh;">Assignment2(st_time, ed_time, delay_time)...</span>
          <div style="width: 27vw; height: 7vh; position: absolute; right: 0; top: 10vh;">
            <svg-icon name="download" style="width: 6vw; height: 6vh; cursor: pointer"></svg-icon>
            <svg-icon name="transmit" style="width: 6vw; height: 6vh; cursor: pointer"></svg-icon>
            <svg-icon name="signal" style="width: 6vw; height: 6vh; cursor: pointer" @click="toStatistics"></svg-icon>
<!--            <svg-icon name="set" style="width: 7vw; height: 7vh" @click="router.push('/Main/Set')"></svg-icon>-->
          </div>
        </div>
        <div style="position: relative; height: 68vh; top: 22vh" v-bind:style="{ width: rightWidth }">
          <div style="background-color: steelblue; height: 10vh">
            <span class="word" style="line-height: 3vh; color: white; position: absolute; left: 2.5vw; top: 4vh;">Student List</span>
            <svg-icon name="play2" color="white" style="position: absolute; right: 0; top: 1vh; width: 8vw; height: 8vh"></svg-icon>
          </div>
          <el-table
              :data="tableData"
              :row-style="getRowStyle"
              :header-row-style="{height: '10vh', background: 'pink'}"
          >
            <el-table-column type="selection" v-if="myShow"> </el-table-column>
            <el-table-column prop="id" sortable label="学号" width="auto" align="center"/>
            <el-table-column prop="name" label="姓名" width="auto" align="center"/>
            <el-table-column prop="score" sortable label="分数" width="auto" align="center"/>
            <el-table-column prop="submitState" sortable label="提交时间" width="auto" align="center"/>
            <el-table-column prop="lastModifiedBy" label="上次修改者" width="auto" align="center"/>
            <el-table-column prop="lastTime"
                             label="上次修改时间" width="auto" :formatter="dateFormat2" align="center"/>

            <el-table-column label="查看附件" width="auto" align="center">
              <template v-slot="scope">
                <el-button type="primary" @click="toGrade">批改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
a {
  color: black;
}

@media screen and (min-width: 1001px) {
  .word {
    font-size: 2.5vw;
  }
  .table-word {
    font-size: 2vw;
    margin-right: 2vw;
  }
}

@media screen and (min-width: 601px) and (max-width: 1000px) {
  .word {
    font-size: 3vw;
  }
  .table-word {
    font-size: 2.5vw;
    margin-right: 0.5vw;
  }
}

@media screen and (max-width: 600px) {
  .word {
    font-size: 3.5vw;
  }
}

#container {
  display: flex;
  border: 2px solid black;
  border-radius: 5px;
}
</style >

<script setup lang="ts">
import {reactive, ref} from "vue";
import {router} from '@/router';
import SvgIcon from "@/components/util/SvgIcon.vue";

const toIndex = () => {
  router.push({name: 'index'});
}

const toCourse = () => {
  let fullPath = router.currentRoute.value.fullPath;
  let cid = router.currentRoute.value.params.cid;
  let paths = fullPath.split('/');
  let path = '/' + paths[1] + '/' + paths[2];
  let name = '';
  if (path === '/grade/t') {
    name = 'teacherCourse';
  } else {
    // TODO: for student
  }
  router.push({name: name, params: {cid: cid}});
}

const toStatistics = () => {
  let cid = router.currentRoute.value.params.cid;
  let aid = router.currentRoute.value.params.aid;
  router.push({name: 'statistics', params: {cid: cid, aid: aid}});
}

const toGrade = () => {
  //TODO: get grading id
  let cid = router.currentRoute.value.params.cid;
  let aid = router.currentRoute.value.params.aid;
  let gid = 1;
  router.push({name: 'grade', params: {cid: cid, aid: aid, gid: gid}});
}

enum AssignmentState{
  notModified,
  modifying,
  finished
}

interface StudentContent {
  id: number,
  name: string,
  submitState: string | null,
  modifyState: AssignmentState,
  lastModifiedBy: string,
  lastTime: string | null,
  score: number,

  //数据可视化
  //名字，release，ddl，延期时间，提交比，评分比，是否return，setting 三个时间支持排序，return排序，
}

const tableData: StudentContent[] = reactive([
  {
    id: 12010000,
    name: 'aaaa',
    submitState: '04-28',
    modifyState: AssignmentState.notModified,
    lastModifiedBy: "aaaa",
    lastTime: '04-28',
    score: 66
  },
  {
    id: 12010001,
    name: 'aaaa',
    submitState: '04-28',
    modifyState: AssignmentState.modifying,
    lastModifiedBy: "aasda",
    lastTime: '04-28',
    score: 87
  },
  {
    id: 12010002,
    name: 'aaaa',
    submitState: '04-28',
    modifyState: AssignmentState.finished,
    lastModifiedBy: "arra",
    lastTime: '04-28',
    score: 33
  },
  {
    id: 12010003,
    name: 'aaaa',
    submitState: '04-28',
    modifyState: AssignmentState.modifying,
    lastModifiedBy: "aafdbkp",
    lastTime: '04-28',
    score: 99
  },
])

let courseShow = ref(true);
let courseShow2 = ref(true);
let leftShow = ref(true);
let rightWidth = ref('78vw')
let assignments = reactive([{ass:'assignment1', icon: 'tick'}, {ass:'assignment2', icon: 'play'}, {ass:'assignment3', icon: 'tick'}])

const hidden = () => {
  courseShow.value = !courseShow.value
}

const hidden2 = () => {
  courseShow2.value = !courseShow2.value
}

const myClick = () => {
  alert(1)
}

let leftSize = reactive({
  left1: '0',
  left2: '5vw',
  left3: '16vw',
  top1: '2vh',
  top2: '2vh',
  top3: '1vh',
  width: '22vw',
  height: '10vh'
})

const flexible = () => {
  leftShow.value = !leftShow.value;
  if (leftSize.width === '22vw') {
    leftSize = reactive({
      left1: '0',
      left2: '0',
      left3: '0',
      top1: '2vh',
      top2: '9vh',
      top3: '15vh',
      width: '6vw',
      height: '25vh'
    })
    rightWidth = ref('94vw')
  }
  else if (leftSize.width === '6vw') {
    leftSize = reactive({
      left1: '0',
      left2: '5vw',
      left3: '16vw',
      top1: '2vh',
      top2: '2vh',
      top3: '1vh',
      width: '22vw',
      height: '10vh'
    })
    rightWidth = ref('78vw')
  }
}

const getRowStyle = ({ rowIndex }: { rowIndex: number }) => {
  let color = '';
  let data = tableData[rowIndex];
  if (data.modifyState === AssignmentState.notModified) {
    color = 'rgb(255, 228, 227)'
  } else if (data.modifyState === AssignmentState.modifying) {
    color = 'rgb(255, 255, 224)'
  } else {
    color = 'rgb(229, 255, 234)'
  }
  return {
    background: color,
    height: '5vh',
    color: 'black'
  };
};
</script>
