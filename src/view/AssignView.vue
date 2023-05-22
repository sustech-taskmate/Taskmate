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
                <div v-if="leftShow" style="height: 90vh; overflow-y: auto">
                    <template v-for="(item, index) in assignments" :key="index">
                        <div style="width: 20vw; left: 1vw; position: relative" @click="changeAid(index)">
                            <div style="position: relative; width: 20vw; height: 7vh">
                <span style="margin-left: 1vw; line-height: 5vh; font-size: 2vw; position: absolute; left: 0; top: 1vh">
                    {{item.name }}
                </span>
                            </div>
                        </div>
                    </template>
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
                        <svg-icon name="download" style="width: 6vw; height: 6vh; cursor: pointer"></svg-icon>
                        <svg-icon name="transmit" style="width: 6vw; height: 6vh; cursor: pointer"></svg-icon>
                        <svg-icon name="signal" style="width: 6vw; height: 6vh; cursor: pointer"
                                  @click="toStatistics"></svg-icon>
                    </div>
                </div>
                <div style="position: relative; height: 62vh; top: 18vh" v-bind:style="{ width: rightWidth }">
                    <div style="background-color: steelblue; height: 10vh">
                        <span class="word"
                              style="line-height: 3vh; color: white; position: absolute; left: 2.5vw; top: 4vh;">Student List</span>
                        <svg-icon name="play2" color="white"
                                  style="position: absolute; right: 0; top: 1vh; width: 8vw; height: 8vh"></svg-icon>
                    </div>
                    <el-table
                        :data="tableData"
                        :row-style="getRowStyle"
                        :header-row-style="{height: '8vh', fontSize: '14px'}"
                        height="100%"
                    >
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="sid" sortable label="Student ID" width="auto" align="center"/>
                        <el-table-column prop="score" sortable label="Score" width="auto" align="center"/>
                        <el-table-column prop="submitTime" sortable label="Submission Time" width="auto"
                                         align="center"/>
                        <el-table-column prop="lastModifiedBy" label="Last Modifier" width="auto" align="center"/>
                        <el-table-column prop="lastTime" label="Last Modification Time" width="auto" align="center"/>
                        <el-table-column width="auto" align="center">
                            <template v-slot="scope">
                                <el-button type="primary" @click="toGrade(scope)">GRADE</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";
import {Assignment, getSubmissions, Submission} from "@/composable/serverRequest";
import moment from "moment";
import {StudentContent, AssignmentState} from "@/store/assignview";
import '@/assets/style/local/assignview.css'

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
    routerPush({name: name, params: {cid: cid}, query: {courses: route.query.courses}});
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

let aid = ref(route.params.aid as string)
const cid = route.params.cid as string
watch(
    () => route.params.aid,
    (newValue) => {
        aid.value = newValue as string
    }
);

const assignments = reactive(JSON.parse(route.query.assignments as string) as Assignment[])

const changeAid = (index: number)=>{
    route.params.aid = index + ''
}

const submissionList = await getSubmissions(cid)
const submissions = [] as Submission[];
const temp = submissionList.submissions;
temp.forEach((value) => {
    if (value.assignment.name == assignments[parseInt(aid.value)].name) {
        submissions.push(value);
    }
})
const tableData: StudentContent[] = reactive([])
const allStudents = ref(submissions.length)
const finishedStudents = ref(0)
submissions.forEach((value) => {
    tableData.push({
        eid: value.entry.uuid,
        gid: value.uuid,
        sid: value.submitter.sid,
        lastModifiedBy: value.scoring === null? '': value.scoring.lastModifiedBy.sid,
        lastTime: value.scoring === null? '': moment.unix(value.scoring.lastModifiedAt).format('YYYY-MM-DD HH:mm:ss'),
        score: value.score,
        submitTime: moment.unix(value.createdAt).format('YYYY-MM-DD HH:mm:ss')
    } as StudentContent)
    if (value.scoring !== null) {
        finishedStudents.value += 1;
    }
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
    if (rowIndex % 2 == 1) {
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
