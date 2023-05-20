<template>
    <div style="overflow: hidden; height: 100vh; width: 100vw">
        <div id="container">
            <div style="border-right: 1px solid darkseagreen; height: 100vh; position: relative"
                 v-bind:style="{ width: leftSize.width }">
                <div style="background-color: steelblue; position: relative; display: flex"
                     v-bind:style="{width: leftSize.width, height: leftSize.height}">
                    <svg-icon name="home" color="white" @click="toIndex"
                              style="position: absolute; height: 6vh; width: 6vw;cursor: pointer"
                              v-bind:style="{left: leftSize.left1, top: leftSize.top1}"/>
                    <svg-icon name="menu2" color="white"
                              style="position: absolute; width: 6vw; height: 8vh; cursor: pointer"
                              @click="flexible()"
                              v-bind:style="{left: leftSize.left2, top: leftSize.top2}"/>
                </div>
                <div v-if="leftShow" style="height: 90vh; overflow-y: auto; overflow-x: hidden">
                    <template v-for="(item, index) in courses" :key="index">
                        <div style="width: 20vw; left: 1vw; position: relative">
                            <div style="position: relative; width: 20vw; height: 7vh">
                                <span
                                    style="margin-left: 1vw; line-height: 5vh; font-size: 2vw; position: absolute; left: 0; top: 1vh">{{ item.name }}</span>
                                <svg-icon name="arrayLeft" @click="hidden(item)" v-if="!item.courseviewDown"
                                          style="position: absolute; right: 0; top: 0; width: 20%; height: 100%; cursor: pointer;"></svg-icon>
                                <svg-icon name="arrayDown" @click="hidden(item)" v-show="item.courseviewDown"
                                          style="position: absolute; right: 0; top: 0; width: 20%; height: 100%; cursor: pointer;"></svg-icon>
                            </div>
                            <div v-if="item.courseviewDown"
                                 style="width: 20vw; min-height: 4vh; position:relative; border-top: 2px solid black">
                                <ul style="list-style: none; padding-left: 3vw; padding-bottom: 5vh">
                                    <li v-for="(course, index2) in item.listContainCard" style="margin-top: 1vh">
                                        <a style="padding-bottom: 10px; height: 3vh; cursor: pointer"
                                           @click="chooseAssignment(index, index2)">
                                            <span class="table-word">{{ course.code }}</span>
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
          <span class="word" style="line-height: 3vh; position: absolute; left: 3vw; top: 3vh;">
              Course Information
          </span>
                </div>
                <div style="left: 0; top: 1vh; position: relative">
          <span class="word"
                style="line-height: 3vh; position: absolute; left: 2.5vw; top: 4vh;">{{
                  currentClass.course.name + ' ' + currentClass.course.number
              }}</span>
                </div>
                <div style="position: relative; height: 77vh; top: 13vh" v-bind:style="{ width: rightWidth }">
                    <div style="background-color: steelblue; height: 10vh">
                        <span class="word"
                              style="line-height: 3vh; color: white; position: absolute; left: 2.5vw; top: 4vh;">Assignment List</span>
                    </div>
                    <el-table
                        :data="tableData"
                        :row-style="getRowStyle"
                        :header-row-style="{height: '8vh', fontSize: '14px'}"
                        :key="key"
                        height="100%"
                        ref="myTable"
                        v-if="turn"
                    >
                        <el-table-column prop="name" label="Assignment Name" width="auto" align="center"/>
                        <el-table-column prop="releaseTime" sortable label="Release Time" width="auto" align="center"/>
                        <el-table-column prop="deadline" sortable label="Deadline" width="auto" align="center"/>
                        <el-table-column prop="delayTime" sortable label="Delay Time" width="auto" align="center"/>
                        <el-table-column prop="submitRatio" label="Submission Ratio" width="auto" align="center"/>
                        <el-table-column prop="gradeRatio" label="Grading Ratio" width="auto" align="center"/>
                        <el-table-column width="auto" align="center">
                            <template #default="scope">
                                <el-button type="primary" @click="toAssign(scope.$index)">View</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {reactive, ref} from 'vue';
import moment from "moment";
import SvgIcon from "@/components/util/SvgIcon.vue";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";
import {getAssignments, getClassbyId} from "@/composable/serverRequest";
import {Card} from "@/store/todo";
import {CourseData} from "@/store/courseview";
import {defineComponent} from 'vue';

export default defineComponent({
    name: "CourseView",
    components: {SvgIcon},
    async setup() {
        const route = useRoute();
        const {routerPush} = useRouterPush();
        const courses = reactive(JSON.parse(route.query.courses as string) as Card[])
        let classId = ref()
        classId.value = route.params.cid as string
        const tableData: CourseData[] = reactive([])
        for (const i of courses) {
            i.courseviewDown = false
            for (const j of i.listContainCard){
                if(j.id + '' == classId.value){
                    i.courseviewDown = true
                }
            }
        }
        let currentClass = await getClassbyId(classId.value);
        let AssignmentList = await getAssignments(classId.value);
        let key = Math.random()
        let turn = ref(true)

        const chooseAssignment = async (semesterIndex: number, courseIndex: number) => {
            let num = courses[semesterIndex].listContainCard[courseIndex].id
            classId.value = num + ''
            await routerPush({params: {cid: num}});
            await showInformation().then(() => {
                turn.value = true
            })
        }

        const showInformation = async () => {
            // turn.value = false
            currentClass = await getClassbyId(classId.value);
            AssignmentList = await getAssignments(classId.value);
            tableData.splice(0, tableData.length)
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
            key = Math.random()
        }

        await showInformation().then(() => {
            turn.value = true
        })


        let leftShow = ref(true);
        let rightWidth = ref('78vw')

        const hidden = (item: Card) => {
            item.courseviewDown = !item.courseviewDown
        }

        const toIndex = () => {
            routerPush({name: 'index'});
        }

        const toAssign = (index: any) => {
            let cid = route.params.cid;
            let courses = route.query.courses;
            routerPush({
                name: 'teacherAssign', params: {cid: cid, aid: index},
                query: {assignments: JSON.stringify(AssignmentList.assignments), courses: courses}
            });
        }

        let leftSize = ref({
            left1: '0',
            left2: '16vw',
            top1: '2vh',
            top2: '1vh',
            width: '22vw',
            height: '10vh'
        })

        const flexible = () => {
            leftShow.value = !leftShow.value;
            if (leftSize.value.width === '22vw') {
                leftSize.value = {
                    left1: '0',
                    left2: '0',
                    top1: '2vh',
                    top2: '9vh',
                    width: '6vw',
                    height: '18vh'
                }
                rightWidth.value = '94vw'
            } else if (leftSize.value.width === '6vw') {
                leftSize.value = {
                    left1: '0',
                    left2: '16vw',
                    top1: '2vh',
                    top2: '1vh',
                    width: '22vw',
                    height: '10vh'
                }
                rightWidth.value = '78vw'
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
            }
        }
        return {
            leftSize,
            toIndex,
            key,
            leftShow,
            courses,
            hidden,
            chooseAssignment,
            currentClass,
            rightWidth,
            tableData,
            getRowStyle,
            toAssign,
            turn,
            flexible
        }
    },
})
</script>

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
