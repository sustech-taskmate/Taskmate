<template>
    <el-container type="flex" style="height: 100vh; width: 100%">
        <el-aside style="width: 15%; height: 100%; border-right: 2px solid black">
            <div style="width: 100%; height: 10%; background: #00BFFF">
                <svg-icon name="arrayLeft"
                          style="width: 20%; height: 100%" @click="back()"></svg-icon>
                <svg-icon name="home" color="black"
                          style="width: 20%; height: 100%"></svg-icon>
                <svg-icon name="menu2" color="black"
                          style="width: 20%; height: 100%; float: right;"></svg-icon>
            </div>
            <div style="width: 100%; height: 90%; overflow-y: auto; background: lightgray">
<!--                <div v-for="item in dataCourse">-->
                <div style="width: 100%; height: 0.5vh"></div>
                <submit-right-course-card :CourseData="course"
                                          @child-value="handleChildEvent"
                >
                </submit-right-course-card>
                <div style="width: 100%; height: 0.5vh"></div>
<!--                </div>-->
            </div>
        </el-aside>
        <el-main style="width: 85%; height: 100%; border: none; padding: 0; margin: 0; font-size: calc(100vh * 28 / 1500);">
            <div style="width: 100%; height: 10%; background: #00BFFF; display: flex; justify-content: center; align-items: center;">
                作业信息
            </div>
            <div style="width: 100%; height: 30%;">
                <el-row style="height: 40%">
                    <el-col :span="2" class="format" style="border-bottom: 1px solid black">
                        作业名称
                    </el-col>
                    <el-col :span="2" class="format" style="border-right: 1px solid black; border-bottom: 1px solid black">
                        {{ showInformation.name }}
                    </el-col>
                    <el-col :span="2" class="format" style="border-bottom: 1px solid black">
                        截止时间
                    </el-col>
                    <el-col :span="5" class="format" style="border-right: 1px solid black; border-bottom: 1px solid black">
                        {{ showInformation.ddl }}
                    </el-col>
                    <el-col :span="2" class="format" style="border-bottom: 1px solid black">
                        迟交时间
                    </el-col>
                    <el-col :span="4" class="format" style="border-right: 1px solid black; border-bottom: 1px solid black">
                        {{ showInformation.lateTime }}
                    </el-col>
                    <el-col :span="2" class="format" style="border-bottom: 1px solid black">
                        提交时间
                    </el-col>
                    <el-col :span="5" class="format" style="border-bottom: 1px solid black">
                        {{ showInformation.submitTime }}
                    </el-col>
                </el-row>
                <el-row v-if="showInformation.files">
                    <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;" >
                        <el-row v-for="i in showInformation.files" style="background: lightgreen; width: 50%">
                            <el-row style="width: 100%; height: 0.5vh; background: white">
                            </el-row>
                            <el-row style="width: 100%">
                                <div class="format" style="background: white; width: 1.25%">
                                </div>
                                <div class="format" style="width: 48.75%;">
                                    名称: {{i.name}}
                                </div>
                                <div class="format" style="width: 48.75%">
                                    大小: {{i.size}} Bytes
                                </div>
                                <div class="format" style="background: white; width: 1.25%">

                                </div>
                            </el-row>
                        </el-row>
                    </div>
                </el-row>
            </div>
            <div style="width: 100%; height: 10%; background: #00BFFF; display: flex; justify-content: center; align-items: center;">
                提交内容
            </div>
            <div style="width: 100%; height: 40%">
                <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;"
                     v-for="item in fileList">
                    <el-row style="height: 0.5vh; width: 100%">

          </el-row>
          <el-row style="height: 8vh; width: 100%; flex: 1 0 30%; border-bottom:  2px solid black; border-top:  2px solid black;
                               display: flex; justify-content: center; align-items: center; background: lightgreen">
                        <el-col :span="2" class="format" style="font-size: calc(100vh * 28 / 1500);">
                            文件名
                        </el-col>
                        <el-col :span="5" class="format" style="font-size: calc(100vh * 20 / 1500);">
                            {{ item.name }}
                        </el-col>
                        <el-col :span="2" class="format" style="font-size: calc(100vh * 28 / 1500);">
                            文件大小
                        </el-col>
                        <el-col :span="5" class="format" style="font-size: calc(100vh * 28 / 1500);">
                            {{ item.size }} Bytes
                        </el-col>
                        <el-col :span="2" class="format" style="font-size: calc(100vh * 28 / 1500);">
                            提交时间
                        </el-col>
                        <el-col :span="5" class="format" style="font-size: calc(100vh * 28 / 1500);">
                            {{ item.time }}
                        </el-col>
                        <el-col :span="3" class="format">
                            <svg-icon name="cross" color="black"
                                      style="width: 20%; height: 80%; float: right;"
                                      @click="dele(item)">
                            </svg-icon>
                        </el-col>
                    </el-row>
                    <el-row style="height: 0.5vh; width: 100%">

                    </el-row>
                </div>
            </div>
            <div style="width: 100%; height: 10%; background: lightcyan">
                <el-row style="height: 100%">
                    <el-col :span="8" style="height: 100%"></el-col>
                    <el-col :span="4"
                            style="height: 100%; display: flex; justify-content: center; align-items: center;">
                        <button class="sel" @click="selectFile"> choose</button>
                    </el-col>
                    <el-col :span="4"
                            style="height: 100%; display: flex; justify-content: center; align-items: center;">
                        <button class="btn" @click="submit"> submit</button>
                    </el-col>
                    <el-col :span="8" style="height: 100%"></el-col>
                </el-row>
            </div>
        </el-main>
    </el-container>
</template>

<style scoped>
.format {
    display: flex;
    justify-content: center;
    align-items: center;
}

.sel:hover {
    color: orangered;
    border: 0;
    cursor: pointer;
}

.btn {
    border: 1px solid green;
    background-color: lightblue;
    text-transform: uppercase;
    font-size: calc(100vw * 12 / 1500)
}

.sel {
    border: 1px solid blue;
    background-color: lightblue;
    text-transform: uppercase;
    font-size: calc(100vw * 12 / 1500)
}

.btn:hover {
    color: orangered;
    border: 0;
    cursor: pointer;
}

</style>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {Assignment, AttachFile, Course} from "@/store/submit";
import SvgIcon from "@/components/util/SvgIcon.vue";
import SubmitRightCourseCard from "@/components/SubmitComponent/SubmitRightCourseCard.vue";
import moment from "moment"
import {Entries, getEntries, getProblems, uploadFile} from "@/composable/serverRequest";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";


const route = useRoute()
const {routerPush} = useRouterPush();

const back = () => {
    routerPush({name: 'index'});
}

const idx = ref();
const pid = ref();
const eid = ref();
const cid = ref(route.params.cid as string);
const courseName = ref(route.query.courseName as string)
let entryList: Entries[] = reactive((await getEntries(cid.value)).entries);

entryList = await Promise.all(entryList.map(async entry => {
    const problem = (await getProblems(cid.value, entry.name)).entry.problems[0]
    return {
      ...entry,
      problem: problem
    } as Entries
}))

const assignmentList = entryList.map((entry) => {
    return {
        name: entry.assignment.title,
        ddl: new Date(entry.availableTo),
        lateTime: new Date(entry.due),
        submitTime: null
    } as Assignment
})

const course = reactive(new Course(courseName.value, assignmentList, false))

const nowCourse = ref('')
const nowAssignment = ref('')
const fileList = ref([] as { name: string, size: number, time: string, file: File }[])
const showInformation = ref({name: '', ddl: '', submitTime: '', lateTime: '', files: null as null | AttachFile[]})

const submit = async () => {
    // TODO: 上传至服务器
    console.log("aaa")
    let li: AttachFile[] = [];
    const files = fileList.value.map((l) => {
        return l.file
    })
    console.log(files[0])
    const res = await uploadFile(cid.value, pid.value, eid.value, files);
    console.log(res)
    for (let i = 0; i < fileList.value.length; i++) {
        li.push(new AttachFile(fileList.value[i].name, fileList.value[i].size, fileList.value[i].time))
    }
    const i = idx.value
    showInformation.value = {
        name: course.assignmentList[i].name,
        ddl: moment(course.assignmentList[i].ddl).format("YYYY-MM-DD hh:mm"),
        submitTime: moment(new Date()).format("YYYY-MM-DD hh:mm"),
        lateTime: moment(course.assignmentList[i].lateTime).format("YYYY-MM-DD hh:mm"),
        files: li,
    }
    // for (let i = 0; i < dataCourse.length; i++) {
    //     if (dataCourse[i].name == nowCourse.value) {
    //         for (let j = 0; j < dataCourse[i].assignmentList.length; j++) {
    //             if (dataCourse[i].assignmentList[j].name == nowAssignment.value) {
    //                 dataCourse[i].assignmentList[j].attachment = li
    //                 let t = new Date()
    //                 dataCourse[i].assignmentList[j].submitTime = t
    //                 fileList.value = [] as { name: string, size: number, time: string, file: File }[]
    //                 showInformation.value = {
    //                     name: dataCourse[i].assignmentList[j].name,
    //                     ddl: moment(dataCourse[i].assignmentList[j].ddl).format("YYYY-MM-DD hh:mm"),
    //                     submitTime: moment(t).format("YYYY-MM-DD hh:mm"),
    //                     lateTime: moment(dataCourse[i].assignmentList[j].lateTime).format("YYYY-MM-DD hh:mm"),
    //                     files: li,
    //                 }
    //                 break
    //             }
    //         }
    //         break
    //     }
    // }

}
const selectFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    document.body.appendChild(input);
    const file = await new Promise<File | null>((resolve) => {
        input.addEventListener('change', (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                const file = files[0]
                const newFile = new File([file], file.name, { type: file.type });
                resolve(newFile || null);
            }
        });
        input.click();
    });

    if (!file) {
        input.remove();
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const fileContent = reader.result as string;
        const now = new Date();
        const dateStr = now.toLocaleString()
      const fileInfo = {name: file.name, size: file.size, time: dateStr, file: file};
        fileList.value.push(fileInfo);
    };

    await new Promise((resolve) => {
        reader.onloadend = () => {
            input.remove();
            resolve(null);
        };
    });
}
const dele = (item: any) => {
    const targetIndex = fileList.value.findIndex(it => it === item);
    if (targetIndex !== -1) {
        fileList.value.splice(targetIndex, 1);
    }
}
const changeOrder = (courseName: string, assignmentName: string) => {
    nowCourse.value = courseName
    nowAssignment.value = assignmentName
}
const handleChildEvent = (index: number, data: Assignment) => {
    idx.value = index
    eid.value = entryList[index].entry.name
    pid.value = entryList[index].problem.uuid
    if (data.submitTime == null) {
        showInformation.value = {
            name: data.name,
            ddl: moment(data.ddl).format("YYYY-MM-DD hh:mm"),
            submitTime: '',
            lateTime: moment(data.lateTime).format("YYYY-MM-DD hh:mm"),
            files: [],
        }
    } else {
        showInformation.value = {
            name: data.name,
            ddl: moment(data.ddl).format("YYYY-MM-DD hh:mm"),
            submitTime: moment(data.submitTime).format("YYYY-MM-DD hh:mm"),
            lateTime: moment(data.lateTime).format("YYYY-MM-DD hh:mm"),
            files: data.attachment,
        }
    }
}
</script>
