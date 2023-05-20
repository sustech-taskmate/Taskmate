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
        <el-main style="width: 85%; height: 100%; border: none; padding: 0; margin: 0; font-size: calc(100vh * 28 / 1500);">
            <div style="width: 100%; height: 10%; background: steelblue; display: flex; justify-content: center; align-items: center; color: white;">
                Assignment Information
            </div>
            <div style="width: 100%; height: 15%;">
              <el-descriptions :column="2" border size="large">
                <el-descriptions-item
                    label="Assignment Name"
                    label-align="left"
                    align="left"
                    class-name="my-content"
                >{{showInformation.name}}</el-descriptions-item>
                <el-descriptions-item label="Submit Time" label-align="left" align="left"
                >{{showInformation.submitTime}}</el-descriptions-item>
                <el-descriptions-item label="Due" label-align="left" align="left"
                >{{showInformation.ddl}}</el-descriptions-item>
                <el-descriptions-item label="Late Due" label-align="left" align="left"
                >{{showInformation.lateTime}}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div style="width: 100%; height: 7%; background: steelblue; display: flex; justify-content: center; align-items: center; color: white;">
              Submitted Files
            </div>
            <div style="width: 100%; height: 28%; overflow-y: auto">
                <el-row v-for="i in showInformation.files" style="margin-top: 10px">
                  <el-col :span="3" class="format" style="font-size: calc(100vh * 30 / 1500);background-color: #b7c2ce">
                    File Name
                  </el-col>
                  <el-col :span="12" class="format" style="font-size: calc(100vh * 30 / 1500); text-align: left">
                    {{ i.name }}
                  </el-col>
                  <el-col :span="3" class="format" style="font-size: calc(100vh * 30 / 1500);background-color: #b7c2ce">
                    File Size
                  </el-col>
                  <el-col :span="3" class="format" style="font-size: calc(100vh * 28 / 1500); text-align: left">
                    {{ i.size }} Bytes
                  </el-col>
                </el-row>
            </div>

            <div style="width: 100%; height: 7%; background: steelblue; display: flex; justify-content: center; align-items: center;">
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
                      {{ item.time}}
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
          <div class="btn-box" >
            <button type="button" class="btn submit" v-bind:disabled="buttonDisabled.upload"  @click="selectFile">upload</button>
            <button type="button" class="btn next" v-bind:disabled="buttonDisabled.submit" @click="submit">submit</button>
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

const course = reactive(new Course(courseName.value, assignmentList, true))

const nowCourse = ref('')
const nowAssignment = ref('')
const fileList = ref([] as { name: string, size: number, time: string, file: File }[])
const showInformation = ref({name: '', ddl: '', submitTime: '', lateTime: '', files: null as null | AttachFile[]})
const buttonDisabled = ref ({upload: true, submit: true})

const submit = async () => {
    // TODO: 上传至服务器
    let li: AttachFile[] = [];
    const files = fileList.value.map((l) => {
        return l.file
    })
    await uploadFile(cid.value, pid.value, eid.value, files);
    for (let i = 0; i < fileList.value.length; i++) {
      li.push(new AttachFile(fileList.value[i].name, fileList.value[i].size, fileList.value[i].time))
    }
    fileList.value.length = 0;
    buttonDisabled.value.submit=true;
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
    buttonDisabled.value.submit=false;
}
const dele = (item: any) => {
    const targetIndex = fileList.value.findIndex(it => it === item);
    if (targetIndex !== -1) {
        fileList.value.splice(targetIndex, 1);
    }
    if (fileList.value.length == 0)
      buttonDisabled.value.submit=true;
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
    buttonDisabled.value.upload=false;
}
</script>
