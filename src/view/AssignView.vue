<template>
  <div style="width: 100vw; height: 100vh; overflow:hidden">
    <div id="container">
      <div style="border-right: 1px solid darkseagreen; height: 100vh; position: relative"
           v-bind:style="{ width: leftSize.width }">
        <div style="background-color: steelblue; position: relative; display: flex"
             v-bind:style="{width: leftSize.width, height: leftSize.height}">
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
          <template v-for="(item, index) in assignments" :key="index">
            <div style="width: 20vw; left: 1vw; position: relative">
              <div style="position: relative; width: 20vw; height: 7vh">
                <span style="margin-left: 1vw; line-height: 5vh; font-size: 2vw; position: absolute; left: 0; top: 1vh">{{
                    item.name
                  }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div style="height: 100vh; position: relative">
        <div style="background-color: steelblue; color: white; height: 10vh; align-items: center">
          <span class="word" style="line-height: 3vh; position: absolute; left: 3vw; top: 3vh;">作业信息</span>
        </div>
        <div style="left: 0; top: 2vh; position: relative">
          <span class="word"
                style="line-height: 3vh; position: absolute; left: 2.5vw; top: 2vh;">{{ assignments[Number(aid)].name }}</span>
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
            <svg-icon name="play2" color="white"
                      style="position: absolute; right: 0; top: 1vh; width: 8vw; height: 8vh"></svg-icon>
          </div>
          <el-table
              :data="tableData"
              :row-style="getRowStyle"
              :header-row-style="{height: '10vh', background: 'pink'}"
          >
            <el-table-column type="selection" v-if="true"></el-table-column>
            <el-table-column prop="sid" sortable label="学号" width="auto" align="center"/>
            <el-table-column prop="score" sortable label="分数" width="auto" align="center"/>
            <el-table-column prop="submitTime" sortable label="提交时间" width="auto" align="center"/>
            <el-table-column prop="lastModifiedBy" label="上次修改者" width="auto" align="center"/>
            <el-table-column prop="lastTime" label="上次修改时间" width="auto" align="center"/>
            <el-table-column label="查看附件" width="auto" align="center">
              <template v-slot="scope">
                <el-button type="primary" @click="toGrade(scope)">批改</el-button>
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
</style>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";
import {Assignment, getProblems, getSubmissions} from "@/composable/serverRequest";
import moment from "moment";

const route = useRoute();
const {routerPush} = useRouterPush();

const toIndex = () => {
  routerPush({name: 'index'});
}

const toCourse = () => {
  let fullPath = route.fullPath;
  let cid = route.params.cid;
  let paths = fullPath.split('/');
  let path = '/' + paths[1] + '/' + paths[2];
  let name = '';
  if (path === '/grade/t') {
    name = 'teacherCourse';
  } else {
    // TODO: for student
  }
  routerPush({name: name, params: {cid: cid}, query: {courses: route.query.courses}});
}

const toStatistics = () => {
  let cid = route.params.cid;
  let aid = route.params.aid;
  routerPush({name: 'statistics', params: {cid: cid, aid: aid},
    query: {submissions: JSON.stringify(submissionList.submissions),
            assignments: route.query.assignments,
            courses: route.query.courses}});
}

const toGrade = (scope: any) => {
  //TODO: get grading id
  let cid = route.params.cid;
  let aid = route.params.aid;
  let gid = scope.row.gid;
  routerPush({name: 'grade', params: {cid: cid, aid: aid, gid: gid},
      query: {assignments: route.query.assignments, courses: route.query.courses}});
}

enum AssignmentState {
  notModified,
  modifying,
  finished
}

interface StudentContent {
  gid: string,
  sid: string,
  submitTime: string | null,
  modifyState: AssignmentState,
  lastModifiedBy: string,
  lastTime: string | null,
  score: number,

  //数据可视化
  //名字，release，ddl，延期时间，提交比，评分比，是否return，setting 三个时间支持排序，return排序，
}

let aid = ref(route.params.aid as string)
const cid = route.params.cid as string
watch(
    () => route.params.aid,
    (newValue) => {
      aid.value = newValue as string
    }
);

const assignments = reactive(JSON.parse(route.query.assignments as string) as Assignment[])
const submissionList = await getSubmissions(cid)
const tableData: StudentContent[] = reactive([])
submissionList.submissions.forEach((value) => {
  tableData.push({
    gid: value.uuid,
    sid: value.submitter.sid + '',
    lastModifiedBy: '',
    lastTime: '',
    score: value.score,
    submitTime: moment.unix(value.createdAt).format('YYYY-MM-DD HH:mm:ss')
  } as StudentContent)
})

let courseShow = ref(true);
let leftShow = ref(true);
let rightWidth = ref('78vw')

const hidden = () => {
  courseShow.value = !courseShow.value
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
  } else if (leftSize.width === '6vw') {
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

const getRowStyle = ({rowIndex}: { rowIndex: number }) => {
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
