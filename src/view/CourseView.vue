<template>
  <div style="overflow: hidden; height: 100vh; width: 100vw">
    <div id="container">
      <div style="border-right: 1px solid darkseagreen; height: 100vh; position: relative"
           v-bind:style="{ width: leftSize.width }">
        <div style="background-color: steelblue; position: relative; display: flex"
             v-bind:style="{width: leftSize.width, height: leftSize.height}">
          <svg-icon name="home" color="white" @click="toIndex"
                    style="position: absolute; height: 6vh; width: 6vw;cursor: pointer"
                    v-bind:style="{left: leftSize.left1, top: leftSize.top1}"></svg-icon>
          <svg-icon name="menu2" color="white"
                    style="position: absolute; width: 6vw; height: 8vh; cursor: pointer"
                    @click="flexible()"
                    v-bind:style="{left: leftSize.left2, top: leftSize.top2}"></svg-icon>
        </div>
        <div v-if="leftShow" style="height: 90vh">
          <template v-for="(item, index) in courses" :key="index">
            <div style="width: 20vw; left: 1vw; position: relative">
              <div style="position: relative; width: 20vw; height: 7vh">
                <span style="margin-left: 1vw; line-height: 5vh; font-size: 2vw; position: absolute; left: 0; top: 1vh">{{item.name}}</span>
                <svg-icon name="arrayLeft" @click="hidden()" v-if="!courseShow"
                          style="position: absolute; right: 0; top: 0; width: 20%; height: 100%"></svg-icon>
                <svg-icon name="arrayDown" @click="hidden()" v-show="courseShow"
                          style="position: absolute; right: 0; top: 0; width: 20%; height: 100%"></svg-icon>
              </div>
              <div v-if="courseShow" style="width: 20vw; height: 28vh; position:relative; border-top: 2px solid black">
                <ul style="list-style: none; padding-left: 3vw; padding-bottom: 5vh">
                  <li v-for="course in item.listContainCard">
                    <a style="padding-bottom: 10px" @click="myClick()">
                      <span class="table-word" >{{ course.code }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div style="height: 100vh; position: relative">
        <div style="background-color: steelblue; color: white; height: 10vh; align-items: center">
          <span class="word" style="line-height: 3vh; position: absolute; left: 3vw; top: 3vh;">课程信息</span>
        </div>
        <div style="left: 0; top: 2vh; position: relative">
          <span class="word"
                style="line-height: 3vh; position: absolute; left: 2.5vw; top: 4vh;">{{ currentClass.course.name + ' ' + currentClass.course.number }}</span>
        </div>
        <div style="position: relative; height: 75vh; top: 15vh" v-bind:style="{ width: rightWidth }">
          <div style="background-color: steelblue; height: 10vh">
            <span class="word" style="line-height: 3vh; color: white; position: absolute; left: 2.5vw; top: 4vh;">Assignment List</span>
            <svg-icon name="plus" color="white"
                      style="position: absolute; right: 0; top: 1vh; width: 8vw; height: 8vh"></svg-icon>
          </div>
          <el-table
              :data="tableData"
              :row-style="getRowStyle"
              :header-row-style="{height: '10vh', background: 'pink'}"
              height="100%"
          >
            <el-table-column prop="name" label="作业" width="auto" align="center"/>
            <el-table-column prop="releaseTime" sortable label="发布时间" width="auto" align="center"/>
            <el-table-column prop="deadline" sortable label="截止时间" width="auto" align="center"/>
            <el-table-column prop="delayTime" sortable label="延期时间" width="auto" align="center"/>
            <el-table-column prop="submitRatio" label="提交比" width="auto" align="center"/>
            <el-table-column prop="gradeRatio" label="评分比" width="auto" align="center"/>
            <el-table-column label="查看作业" width="auto" align="center">
              <template #default="scope">
                <el-button type="primary" @click="toAssign(scope.$index)">查看</el-button>
              </template>
            </el-table-column>
            <!--            <el-table-column label="修改作业" width="auto" align="center">-->
            <!--              <template v-slot="scope">-->
            <!--                <el-button type="primary" @click="router.push('/Main/Set')">修改</el-button>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
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
</style>

<script lang="ts" setup scoped>
import {reactive, ref} from 'vue';
import moment from "moment";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";
import {getAssignments, getClassbyId} from "@/composable/serverRequest";
import {Card} from "@/store/todo";

const route = useRoute();
const {routerPush} = useRouterPush();

class CourseData {
  name: string;
  releaseTime: string;
  deadline: string;
  delayTime: string;
  submitRatio: string;
  gradeRatio: string;
  isReturn: boolean;

  constructor(name: string, releaseTime: string, deadline: string, delayTime: string,
              submitRatio: string, gradeRatio: string, isReturn: boolean) {
    this.name = name;
    this.releaseTime = releaseTime;
    this.deadline = deadline;
    this.delayTime = delayTime;
    this.submitRatio = submitRatio;
    this.gradeRatio = gradeRatio;
    this.isReturn = isReturn;
  }
}

const courses = reactive(JSON.parse(route.query.courses as string) as Card[])
const classId = route.params.cid as string
const tableData: CourseData[] = reactive([])
const currentClass = await getClassbyId(classId);
const studentLength = currentClass.users.filter((s) => s.role == 'student').length
const AssignmentList = await getAssignments(classId);

AssignmentList.assignments.forEach((value) => {
  let {name, title, status, due, availableFrom, availableTo} = value
  tableData.push(
      new CourseData(name,
          moment.unix(availableFrom).format('YYYY-MM-DD HH:mm:ss'),
          moment.unix(availableTo).format('YYYY-MM-DD HH:mm:ss'),
          moment.unix(due).format('YYYY-MM-DD HH:mm:ss'),
          "?", "?", false)
  )
})


let courseShow = ref(true);
let courseShow2 = ref(true);
let leftShow = ref(true);
let rightWidth = ref('78vw')

const hidden = () => {
  courseShow.value = !courseShow.value
}

const hidden2 = () => {
  courseShow2.value = !courseShow2.value
}

const myClick = () => {

}

const toIndex = () => {
  routerPush({name: 'index'});
}

const toAssign = (index: any) => {
  let cid = route.params.cid;
  routerPush({name: 'teacherAssign', params: {cid: cid, aid: index}, query: {assignments: JSON.stringify(AssignmentList.assignments)}});
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
  } else if (leftSize.width === '6vw') {
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

const getRowStyle = ({rowIndex}: { rowIndex: number }) => {
  let color = '';
  let assignment = tableData[rowIndex];
  if (assignment.isReturn) {
    color = 'rgb(229, 255, 234)'
  } else {
    color = 'rgb(255, 228, 227)'
  }
  return {
    background: color,
    height: '5vh',
    color: 'black'
  };
};
</script>
