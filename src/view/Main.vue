<template>
  <div style="overflow: hidden; height: 100vh; width: 100vw">
    <div id="container">
      <div style="border-right: 1px solid darkseagreen; height: 100vh; position: relative"
           v-bind:style="{ width: leftSize.width }">
        <div style="background-color: steelblue; position: relative; display: flex" v-bind:style="{width: leftSize.width, height: leftSize.height}">
          <svg-icon name="home" color="white" @click="router.push('/')" style="position: absolute; height: 6vh; width: 6vw"
                    v-bind:style="{left: leftSize.left1, top: leftSize.top1}"></svg-icon>
  <!--        <div v-show="leftShow">-->
  <!--          <span style="font-size: 2vw; line-height: 4vh; position: absolute; left: 9.5vw; top: 3vh"-->
  <!--                v-bind:style="{ color: idColor}">{{ identity }}</span>-->
  <!--          <svg-icon name="circle" :color="idColor" style="position: absolute; left: 6vw; top: 2vh; width: 3vw; height: 6vh"-->
  <!--          @click="changeID()"></svg-icon>-->
  <!--        </div>-->
          <svg-icon name="menu2" color="white" style="position: absolute; width: 6vw; height: 8vh" @click="flexible()"
                    v-bind:style="{left: leftSize.left2, top: leftSize.top2}"></svg-icon>
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
              <ul style="position: absolute; left: 0; top: 0; list-style: none; padding-left: 3vw; line-height: 7vh; padding-bottom: 5vh">
                <li v-for="course in courses" >
                  <a @click="myClick()">
                    <span class="table-word" style="line-height: 7vh">{{ course }}</span>
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
              <ul style="position: absolute; left: 0; top: 0; list-style: none; padding-left: 3vw; line-height: 7vh; padding-bottom: 5vh">
                <li v-for="course in courses" >
                  <a @click="myClick()">
                    <span class="table-word" style="line-height: 7vh">{{ course }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 100vh; position: relative">
        <div style="background-color: steelblue; color: white; height: 10vh; align-items: center">
          <span class="word" style="line-height: 3vh; position: absolute; left: 3vw; top: 3vh;">课程信息</span>
        </div>
        <div style="left: 0; top: 2vh; position: relative">
          <span class="word" style="line-height: 3vh; position: absolute; left: 2.5vw; top: 4vh;">Software Engineering(CS123)</span>
        </div>
        <div style="position: relative; height: 75vh; top: 15vh" v-bind:style="{ width: rightWidth }">
          <div style="background-color: steelblue; height: 10vh">
            <span class="word" style="line-height: 3vh; color: white; position: absolute; left: 2.5vw; top: 4vh;">Assignment List</span>
            <svg-icon name="plus" color="white" style="position: absolute; right: 0; top: 1vh; width: 8vw; height: 8vh"></svg-icon>
          </div>
          <el-table
              :data="tableData"
              :row-style="getRowStyle"
              :header-row-style="{height: '10vh', background: 'pink'}"
          >
            <el-table-column prop="name" label="作业" width="auto" align="center"/>
            <el-table-column prop="releaseTime" sortable label="发布时间" width="auto" align="center"/>
            <el-table-column prop="deadline" sortable label="截止时间" width="auto" align="center"/>
            <el-table-column prop="delayTime" sortable label="延期时间" width="auto" align="center"/>
            <el-table-column prop="submitRatio" label="提交比" width="auto" align="center"/>
            <el-table-column prop="gradeRatio" label="评分比" width="auto" align="center"/>
            <el-table-column label="查看作业" width="auto" align="center">
              <template v-slot="scope">
                <el-button type="primary" @click="router.push('/Main/Homework')">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label="修改作业" width="auto" align="center">
              <template v-slot="scope">
                <el-button type="primary" @click="router.push('/Main/Set')">修改</el-button>
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

<script lang="ts" setup scoped>
import {reactive, ref, defineComponent, onBeforeMount} from 'vue';
import {router} from '@/router';
import moment from "moment";
import SvgIcon from "@/components/util/SvgIcon.vue";

class CourseData{
  name: string;
  releaseTime: string;
  deadline: string;
  delayTime: string;
  submitRatio: string;
  gradeRatio: string;
  isReturn: {a: boolean, b: string};

  constructor(name:string, releaseTime: string, deadline: string, delayTime: string,
              submitRatio: string, gradeRatio: string, isReturn: boolean, url: string) {
    this.name = name;
    this.releaseTime = releaseTime;
    this.deadline = deadline;
    this.delayTime = delayTime;
    this.submitRatio = submitRatio;
    this.gradeRatio = gradeRatio;
    this.isReturn = {a: isReturn, b: url};
  }
}

const tableData: CourseData[] = reactive([
  {
    name: "Assignment one",
    releaseTime: '04-29',
    deadline: '04-29',
    delayTime: '04-29',
    submitRatio: '155/0',
    gradeRatio: '144/15',
    isReturn: {a: true, b: "src/assets/icon/successful.png"},
  },
  {
    name: "Assignment two",
    releaseTime: '04-29',
    deadline: '04-29',
    delayTime: '04-29',
    submitRatio: '155/0',
    gradeRatio: '144/15',
    isReturn: {a: true, b: "src/assets/icon/successful.png"},
  },
  {
    name: "Assignment three",
    releaseTime: '04-29',
    deadline: '04-29',
    delayTime: '04-29',
    submitRatio: '155/0',
    gradeRatio: '144/15',
    isReturn: {a: false, b: "src/assets/icon/error.png"},
  },
])

const tableDataStudent = reactive([
  {
    name: "Assignment one",
    releaseTime: new Date('2023-01-27 23:59'),
    deadline: new Date('2023-01-27 23:59'),
    delayTime: new Date('2023-01-28 23:59'),
  },
  {
    name: "Assignment two",
    releaseTime: new Date('2023-01-28 23:59'),
    deadline: new Date('2023-01-28 23:59'),
    delayTime: new Date('2023-01-29 23:59'),
  },
  {
    name: "Assignment three",
    releaseTime: new Date('2023-01-29 23:59'),
    deadline: new Date('2023-01-29 23:59'),
    delayTime: new Date('2023-01-30 23:59'),
  },
])

// let identity = ref('Student');
// let idColor = ref('rgb(255, 183, 185)')
// let idShow = ref(true)
//
// onBeforeMount(() => {
//   if (identity.value === 'SA') {
//     idColor.value = 'rgb(255, 183, 185)';
//     idShow.value = true;
//   }
//   else if (identity.value === 'Student') {
//     idColor.value = 'rgb(182, 255, 191)';
//     idShow.value = false;
//   }
// });
//
// const changeID = () => {
//   if (identity.value === 'SA') {
//     identity.value = 'Student'
//     idShow.value = false
//     idColor.value = 'rgb(182, 255, 191)'
//   }
//   else if (identity.value === 'Student') {
//     identity.value = 'SA'
//     idShow.value = true
//     idColor.value = 'rgb(255, 183, 185)'
//   }
// }
//
// const check = () => {
//   if (identity.value === 'SA') {
//     router.push('/Main/Homework')
//   }
//   else if (identity.value === 'Student') {
//     //跳转到学生查看作业页面
//   }
// }

let courseShow = ref(true);
let courseShow2 = ref(true);
let leftShow = ref(true);
let rightWidth = ref('78vw')
let courses = reactive(['course1', "course2", "course3"])

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
  left2: '16vw',
  top1: '2vh',
  top2: '1vh',
  width: '22vw',
  height: '10vh'
})

const flexible = () => {
  leftShow.value = !leftShow.value;
  if (leftSize.width === '22vw') {
    leftSize = reactive({
      left1: '0',
      left2: '0',
      top1: '2vh',
      top2: '9vh',
      width: '6vw',
      height: '18vh'
    })
    rightWidth = ref('94vw')
  }
  else if (leftSize.width === '6vw') {
    leftSize = reactive({
      left1: '0',
      left2: '16vw',
      top1: '2vh',
      top2: '1vh',
      width: '22vw',
      height: '10vh'
    })
    rightWidth = ref('78vw')
  }
}

const getRowStyle = ({ rowIndex }: { rowIndex: number }) => {
  let color = '';
  if (rowIndex === 0 || rowIndex === 1) {
    color = 'rgb(229, 255, 234)'
  }
  else if (rowIndex === 2) {
    color = 'rgb(255, 228, 227)'
  }
  return {
    background: color,
    height: '5vh',
    color: 'black'
  };
};
</script>