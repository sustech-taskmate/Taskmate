<template>
    <div style="width: 100vw; height: 100vh; overflow:hidden">
        <div id="container">
            <div style="border-right: 2px solid #b4c0c0; height: 100vh; position: relative"
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
                <div v-if="leftShow" style="height: 90vh; overflow-y: auto">
                    <div v-for="(item, index) in assignments" :key="index" @click="changeAid(index)">
                            <div style="position: relative; left: 1vw; width: 20vw; height: 7vh">
                <div style="margin-left: 1vw; line-height: 5vh; font-size: 2vw; position: absolute; left: 0; top: 1vh">
                    {{item.name }}
                </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="height: 100vh; position: relative">
                <div style="background-color: steelblue; color: white; height: 10vh; align-items: center">
                    <span class="word" style="line-height: 3vh; position: absolute; left: 3vw; top: 3vh;">Assignments Information</span>
                </div>
                <div style="left: 0; top: 1vh; position: relative">
          <span class="word"
                style="line-height: 3vh; position: absolute; left: 2.5vw; top: 2vh;font-size: calc(100vw * 48 / 1500)">
              {{ assignments[Number(aid)].name }}
          </span>
                    <div style="width: 20vw; height: 7vh; position: absolute; right: 0; top: 8vh;">
                        <svg-icon name="download" style="width: 6vw; height: 6vh; cursor: pointer" @click="downloadFile"></svg-icon>
                        <svg-icon name="transmit" style="width: 6vw; height: 6vh; cursor: pointer" @click="transmit"></svg-icon>
                        <svg-icon name="signal" style="width: 6vw; height: 6vh; cursor: pointer"
                                  @click="toStatistics"></svg-icon>
                    </div>
                </div>
                <div style="position: relative; height: 62vh; top: 18vh" v-bind:style="{ width: rightWidth }">
                    <div style="background-color: steelblue; height: 10vh">
                        <span class="word"
                              style="line-height: 3vh; color: white; position: absolute; left: 2.5vw; top: 4vh;">Student List</span>
                        <svg-icon name="play2" color="white"
                                  style="position: absolute; right: 0; top: 1vh; width: 8vw; height: 8vh;cursor: pointer"
                        @click="toFirstNoGrade"/>
                    </div>
                    <el-table
                        :data="tableData"
                        :row-style="getRowStyle"
                        :header-row-style="{height: '8vh', fontSize: '14px'}"
                        height="100%"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="sid" label="Student ID" width="auto" align="center"/>
                        <el-table-column prop="score" label="Score" width="auto" align="center"/>
                        <el-table-column prop="submitTime" label="Submission Time" width="auto"
                                         align="center"/>
                        <el-table-column prop="lastModifiedBy" label="Last Modifier" width="auto" align="center"/>
                        <el-table-column prop="lastTime" label="Last Modification Time" width="auto" align="center"/>
                        <el-table-column width="auto" align="center">
                            <template v-slot="scope">
                                <el-button  class="btn" @click="toGrade(scope)">GRADE</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";
import {Assignment, getSubmissionInfo, getSubmissions, Submission} from "@/composable/serverRequest";
import moment from "moment";
import {AssignmentState, StudentContent} from "@/store/assignview";
import '@/assets/style/local/assignview.css'
import {open, save} from "@tauri-apps/api/dialog";
import {downloadAll} from "@/composable/assign";
import {fs} from "@tauri-apps/api";
import _ from "lodash";

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
    }
    routerPush({name: name, params: {cid: cid}, query: {...route.query}});
}

const toStatistics = () => {
    let cid = route.params.cid;
    let aid = route.params.aid;
    routerPush({
        name: 'statistics', params: {cid: cid, aid: aid},
        query: {
            submissions: JSON.stringify(submissionList.submissions),
            assignments: route.query.assignments,
            courses: route.query.courses
        }
    });
}

const toGrade = (scope: any) => {
    let cid = route.params.cid;
    let aid = route.params.aid;
    let eid = scope.row.eid;
    let gid = scope.row.gid;
    let sid = scope.row.sid;
    routerPush({
        name: 'grade',
        params: {cid: cid, aid: aid, gid: gid},
        query: {
            assignments: route.query.assignments,
            courses: route.query.courses,
            eid: eid,
            sid: sid,
            allStudents: allStudents.value,
            finishedStudents: finishedStudents.value
        }
    });
}

const toFirstNoGrade = () => {
    let cid = route.params.cid;
    let aid = route.params.aid;
    if (firstEid.value !== '' && firstGid.value !== '' && firstSid.value !== '') {
        routerPush({
            name: 'grade',
            params: {cid: cid, aid: aid, gid: firstGid.value},
            query: {
                assignments: route.query.assignments,
                courses: route.query.courses,
                eid: firstEid.value,
                sid: firstSid.value,
                allStudents: allStudents.value,
                finishedStudents: finishedStudents.value,
            }
        })
    }
}

let aid = ref(route.params.aid as string)
const cid = route.params.cid as string
let downloadListRaw = ref<StudentContent[]>([])

const assignments = ref(JSON.parse(route.query.assignments as string) as Assignment[])

const changeAid = (index: number)=>{
    route.params.aid = index + ''
    aid.value = index + ''
    flash()
}
const handleSelectionChange = (input:StudentContent[])=>{
  downloadListRaw.value=input
}
const downloadFile = async () => {
  if (downloadListRaw.value.length == 0) {
    return
  }
  const path = await open({
    directory: true
  }) as string | null;
  if (path == null) {
    return
  }
  for (const item in downloadListRaw.value){
    const submissionInfo = await getSubmissionInfo(downloadListRaw.value[item].gid);
    let urls = submissionInfo.submission.answers[0].files.map((file) => {
      return file.url
    })
    let names = submissionInfo.submission.answers[0].files.map((file) => {
      return file.name
    })
    await downloadAll(path,urls, (downloadListRaw.value[item].gid as string), names)
  }
}

function convertArrayToCSV(arr: any[]) {
  const header = Object.keys(arr[0]).join(',') + '\n';
  const rows = arr.map(obj => Object.values(obj).join(',')).join('\n');
  return header + rows;
}
const transmit = async () => {
  const path = await save(
      {
        defaultPath:'score.csv'
      }
  ) as string | null;
  if (path == null) {
    return
  }
  let csvData=[]
  for (const item in submissions.value){
    csvData.push({sid: submissions.value[item].submitter.sid,score:submissions.value[item].score})
  }
  const csvContent = convertArrayToCSV(csvData);
  await fs.writeFile(path, csvContent);
}

const submissionList = await getSubmissions(cid)
const assignmentSubmission = submissionList.submissions.filter((s) => { return s.assignment.name == assignments.value[Number(route.params.aid)].name})
    .sort((s1, s2) => s2.createdAt - s1.createdAt)
const gb = _.groupBy(assignmentSubmission, (s) => s.submitter.sid)
const submissions = ref<Submission[]>([])
Object.keys(gb).forEach((sid) => {
    submissions.value.push(gb[sid][0])
})
const temp = submissions.value;
const tableData = ref([] as StudentContent[])
const allStudents = ref(submissions.value.length)
const finishedStudents = ref(0)
let isFirst = true;
const firstEid = ref('')
const firstGid = ref('')
const firstSid = ref('')
const selectGid = []
const flash = ()=>{
    submissions.value.slice(0, 0)
    tableData.value.slice(0, 0)
    let tempSubmit = [] as Submission[]
    let tempTableData = [] as StudentContent[]
    temp.forEach((value) => {
        if (value.assignment.name == assignments.value[parseInt(aid.value)].name) {
            tempSubmit.push(value)
        }
    })
    submissions.value = tempSubmit
    submissions.value.forEach((value) => {
        tempTableData.push({
            eid: value.entry.uuid,
            gid: value.uuid,
            sid: value.submitter.sid,
            lastModifiedBy: value.scoring === null? '': value.scoring.lastModifiedBy.sid,
            lastTime: value.scoring === null? '': moment.unix(value.scoring.lastModifiedAt).format('YYYY-MM-DD HH:mm:ss'),
            score: value.score,
            submitTime: moment.unix(value.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            modifyState: value.scoring === null? AssignmentState.NOT_GRADED: AssignmentState.GRADED
        } as StudentContent)
        if (value.scoring !== null) {
            finishedStudents.value += 1;
        } else if (isFirst) {
            isFirst = false;
            firstEid.value = value.entry.uuid;
            firstGid.value = value.uuid;
            firstSid.value = value.submitter.sid;
        }
    })
    tableData.value = tempTableData
    tableData.value = tableData.value.sort((a, b) => {
        if (a.modifyState === AssignmentState.NOT_GRADED && b.modifyState === AssignmentState.NOT_GRADED) {
            return moment(b.submitTime).isBefore(a.submitTime) ? -1 : 1;
        } else if (a.modifyState === AssignmentState.GRADED && b.modifyState === AssignmentState.GRADED) {
            return moment(b.submitTime).isBefore(a.submitTime) ? -1 : 1;
        } else if (a.modifyState === AssignmentState.NOT_GRADED) {
            return -1;
        } else if (b.modifyState === AssignmentState.NOT_GRADED) {
            return 1;
        } else {
            return 0;
        }
    })
}


flash()


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
    let data = tableData.value[rowIndex];
    let color: string;
    if (data.modifyState === AssignmentState.NOT_GRADED) {
        color = 'rgb(255, 228, 227)'
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
<style>

.btn {
  border: 1px solid;
  background-color: transparent;
  text-transform: uppercase;
  font-size: calc(100vw * 12 / 1500)
}

.btn:hover {
  color: #ffffff;
  background-color: #6c6060;
  cursor: pointer;
}
</style>