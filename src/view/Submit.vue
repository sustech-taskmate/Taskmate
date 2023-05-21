<template>
    <el-container type="flex" style="height: 100vh; width: 100%">
        <el-aside style="width: 15%; height: 100%; border-right: 2px solid black">
            <div style="width: 100%; height: 10%; background: steelblue">
                <svg-icon name="arrayLeft" color="white"
                          style="width: 20%; height: 100%" @click="back()"></svg-icon>
                <svg-icon name="home" color="white"
                          style="width: 20%; height: 100%"></svg-icon>
                <svg-icon name="menu2" color="white"
                          style="width: 20%; height: 100%; float: right;"></svg-icon>
            </div>
            <div style="width: 100%; height: 90%; overflow-y: hidden; background: lightgray">
                <!--                <div v-for="item in dataCourse">-->
                <submit-right-course-card :CourseData="course"
                                          @child-value="handleChildEvent"
                >
                </submit-right-course-card>
                <!--                </div>-->
            </div>
        </el-aside>
        <el-main
            style="width: 85%; height: 100%; border: none; padding: 0; margin: 0; font-size: calc(100vh * 28 / 1500);">
            <div
                style="width: 100%; height: 10%; background: steelblue; display: flex; justify-content: center; align-items: center; color: white;">
                Assignment Information
            </div>
            <div style="width: 100%; height: 15%;">
                <el-descriptions :column="2" border size="large">
                    <el-descriptions-item
                        label="Assignment Name"
                        label-align="left"
                        align="left"
                        class-name="my-content"
                    >{{ showInformation.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Submit Time" label-align="left" align="left"
                    >{{ showInformation.submitTime }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Due" label-align="left" align="left"
                    >{{ showInformation.ddl }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Late Due" label-align="left" align="left"
                    >{{ showInformation.lateTime }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <div
                style="width: 100%; height: 7%; background: steelblue; display: flex; justify-content: center; align-items: center; color: white;">
                Submitted Files
            </div>
            <div style="width: 100%; height: 28%; overflow-y: auto">
                <el-row v-for="i in showInformation.files" style="margin-top: 10px">
                    <el-col :span="3" class="format"
                            style="font-size: calc(100vh * 30 / 1500);background-color: #b7c2ce">
                        File Name
                    </el-col>
                    <el-col :span="21" class="format" style="font-size: calc(100vh * 30 / 1500); text-align: left">
                        {{ i.name }}
                    </el-col>
                </el-row>
            </div>

            <div
                style="width: 100%; height: 7%; background: steelblue; display: flex; justify-content: center; align-items: center;">
                <div style="color: white;">Submit Content</div>
            </div>

            <div style="width: 100%; height: 23%; overflow-y: auto">
                <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;"
                     v-for="item in fileList">
                    <el-row style="height: 8vh; width: 100%; flex: 1 0 30%;
                             display: flex; justify-content: center; align-items: center;">
                        <el-col :span="12" class="format" style="font-size: calc(100vh * 30 / 1500);">
                            {{ item.name }}
                        </el-col>
                        <el-col :span="3" class="format" style="font-size: calc(100vh * 28 / 1500);">
                            {{ item.size }} Bytes
                        </el-col>
                        <el-col :span="6" class="format" style="font-size: calc(100vh * 28 / 1500);">
                            {{ item.time }}
                        </el-col>
                        <el-col :span="3" class="format">
                            <svg-icon name="cross" color="black"
                                      style="width: 20%; height: 80%; float: right;"
                                      @click="dele(item)">
                            </svg-icon>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="btn-box">
                <button type="button" class="btn submit" v-bind:disabled="buttonDisabled.upload" @click="selectFile">
                    upload
                </button>
                <button type="button" class="btn next" v-bind:disabled="buttonDisabled.submit" @click="submit">submit
                </button>
            </div>
        </el-main>
    </el-container>
</template>

<style scoped>
.btn-box {
    height: 8%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn {
    border: 1px solid;
    background-color: transparent;
    text-transform: uppercase;
    font-size: calc(100vw * 24 / 1500);
    font-weight: 300;
}

.btn:hover {
    color: white;
    border: 0;
    cursor: pointer;
}

.next {
    color: #548585;
    margin-left: calc(100vw * 10 / 1500);
}

.next:hover {
    background-color: #548585;
    -moz-box-shadow: 10px 10px 99px 6px rgba(0, 128, 128, 1);
}

.submit {
    color: #6A7FA0;
}

.submit:hover {
    background-color: #6A7FA0;
}


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

.sel {
    border: 1px solid blue;
    background-color: lightblue;
    text-transform: uppercase;
    font-size: calc(100vw * 12 / 1500)
}


</style>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {Assignment, AttachFile, Course} from "@/store/submit";
import SvgIcon from "@/components/util/SvgIcon.vue";
import SubmitRightCourseCard from "@/components/SubmitComponent/SubmitRightCourseCard.vue";
import moment from "moment"
import {Entries, getEntries, getEntry, getSubmissions, UploadFile, uploadFile, Submission, getSubmissionInfo} from "@/composable/serverRequest";
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";
import {open} from '@tauri-apps/api/dialog';
import {convertFileSrc} from "@tauri-apps/api/tauri";

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
    const problem = (await getEntry(cid.value, entry.name)).entry.problems[0]
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

const course = reactive(new Course(courseName.value, assignmentList, true));

const nowCourse = ref('')
const nowAssignment = ref('')
const fileList = ref([] as { name: string, size: number, time: string, file_path: string }[])
const showInformation = ref({name: '', ddl: '', submitTime: '', lateTime: '', files: null as null | AttachFile[]})
const buttonDisabled = ref({upload: true, submit: false})

const submit = async () => {
    let li: AttachFile[] = [];
    const files = fileList.value.map((l) => {
        return {name: l.name, size: l.size, path: l.file_path} as UploadFile
    })

    const res = await uploadFile(cid.value, pid.value, eid.value, files);
    if (!res)
        return
    for (let i = 0; i < fileList.value.length; i++) {
        li.push(new AttachFile(fileList.value[i].name, fileList.value[i].size, fileList.value[i].time))
    }
    fileList.value.length = 0;
    buttonDisabled.value.submit = true;
    const i = idx.value
    showInformation.value = {
        name: course.assignmentList[i].name,
        ddl: moment(course.assignmentList[i].ddl).format("YYYY-MM-DD hh:mm"),
        submitTime: moment(new Date()).format("YYYY-MM-DD hh:mm"),
        lateTime: moment(course.assignmentList[i].lateTime).format("YYYY-MM-DD hh:mm"),
        files: li,
    }
}
const selectFile = async () => {
    const paths = await open({
        multiple: true,
        directory: false,
    }) as null | string[];

    if (paths === null) {
        return
    } else {
        await Promise.all(paths.map(async (path): Promise<File> => {
            const url = convertFileSrc(path)
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "blob";
                xhr.onload = () => {
                    const blob = xhr.response;
                    const fileName = path.includes("\\")?path.substring(path.lastIndexOf("\\") + 1):path.substring(path.lastIndexOf("/") + 1);
                    const file = new File([blob], fileName, {type: blob.type});
                    const fileInfo = {
                        name: file.name,
                        size: file.size,
                        time: new Date().toLocaleString(),
                        file_path: path
                    };
                    fileList.value.push(fileInfo);
                    resolve(file);
                };
                xhr.onerror = reject;
                xhr.send();
            });
        }))
        buttonDisabled.value.submit = false;
    }
}

const dele = (item: any) => {
    const targetIndex = fileList.value.findIndex(it => it === item);
    if (targetIndex !== -1) {
        fileList.value.splice(targetIndex, 1);
    }
    if (fileList.value.length == 0)
        buttonDisabled.value.submit = true;
}
const changeOrder = (courseName: string, assignmentName: string) => {
    nowCourse.value = courseName
    nowAssignment.value = assignmentName
}
const handleChildEvent = async (index: number, data: Assignment) => {
  idx.value = index
  eid.value = entryList[index].entry.name
  pid.value = entryList[index].problem.uuid
  let submissions: Submission[] = ((await getSubmissions(cid.value)).submissions)

  submissions = submissions.map((submission) => {
    return {
      uuid:submission.uuid,
      id:submission.id,
      createdAt:submission.createdAt,
      answers:submission.answers,
      entry:submission.entry
    } as Submission
  })

  let submitTime = null;
  let attachment = null;
  let submitId = null;

  for (let i = 0 ; i < submissions.length;i++){
    if (submissions[i].entry.uuid==undefined)continue;
    if (submissions[i].createdAt!=0&&submissions[i].entry.uuid==eid.value){
      if (submitTime==null){
          submitTime=submissions[i].createdAt;
          submitId = submissions[i].uuid;
      }
      else if (submitTime<submissions[i].createdAt){
        submitTime=submissions[i].createdAt;
        submitId=submissions[i].uuid;
      }
    }
  }
  if (submitId!=null){
    attachment = (await getSubmissionInfo(submitId)).submission;
    let files = [];
    for (let i = 0 ; i<attachment.answers.length; i++)
      for (let j = 0 ; j<attachment.answers[i].files.length; j++)
        files.push(attachment.answers[i].files[j])
    attachment = files.map((file) => {
      return {
        name : file.name
      } as AttachFile
    })
  }


  if (submitTime == null) {
    showInformation.value = {
      name: data.name,
      ddl: moment.unix(data.ddl.getTime()).format("YYYY-MM-DD hh:mm"),
      submitTime: '',
      lateTime: moment.unix(data.lateTime.getTime()).format("YYYY-MM-DD hh:mm"),
      files: [],
    }
  } else {
    showInformation.value = {
      name: data.name,
      ddl: moment.unix(data.ddl.getTime()).format("YYYY-MM-DD hh:mm"),
      submitTime: moment.unix(submitTime).format("YYYY-MM-DD hh:mm"),
      lateTime: moment.unix(data.lateTime.getTime()).format("YYYY-MM-DD hh:mm"),
      files: attachment,
    }
  }
  buttonDisabled.value.upload = false;
  fileList.value.length = 0;
  buttonDisabled.value.submit = true;
}
</script>
