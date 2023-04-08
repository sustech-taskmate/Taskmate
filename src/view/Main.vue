<template>
  <el-container>
    <el-aside style="width: 12.5%;">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          text-color="#fff"
          default-active="1-1"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>Course</span>
          </template>
          <el-menu-item index="1-1">CS304</el-menu-item>
          <el-menu-item index="1-2">CS305</el-menu-item>
          <el-menu-item index="1-3">CS307</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container style="height: 100vh">
      <el-header style="height: 10vh">
        <div style="height: 70%; width: 100%;display: flex">
          <div style="height: 50%; width: 15%;margin-top: auto; margin-bottom: auto">
            <div style="font-size: large;text-align: center">
              Software Engineer
            </div>
          </div>
          <el-divider direction="vertical" style="height: 100%"></el-divider>
          <div style="height: 50%; width: 30%;margin-top: auto; margin-bottom: auto">
            <div style="font-size: small;">
              Spring 2023
            </div>
          </div>
        </div>
        <div style="height: 30%; width: 100%; display: flex">
          <div style="height: 60%; width: 15%; margin-bottom: auto">
            <div style="font-size: small;text-align: center">
              id: CS304
            </div>
          </div>
        </div>
      </el-header>
      <el-main>
        <div>
          <el-table
              :data="tableData"
              style="width: 100%; display: flex"
          >
            <el-table-column prop="name" label="作业" width="auto" align="center"/>
            <el-table-column prop="releaseTime" sortable label="发布时间" width="auto"
                             :formatter="dateFormat1" align="center"/>
            <el-table-column prop="deadline" sortable label="截止时间" width="auto"
                             :formatter="dateFormat2" align="center"/>
            <el-table-column prop="delayTime" sortable label="延期时间" width="auto"
                             :formatter="dateFormat3" align="center"/>
            <el-table-column prop="submitRatio" label="提交比" width="auto" align="center"/>
            <el-table-column prop="gradeRatio" label="评分比" width="auto" align="center"/>
            <el-table-column prop="isReturn" sortable label="是否返回" width="auto" align="center">
              <template v-slot="scope">
                <el-image  style="width: 15px; height: 15px" :src="scope.row.isReturn.b"></el-image>
              </template>
            </el-table-column>>
            <el-table-column label="查看作业" width="auto" align="center">
              <template v-slot="scope">
                <el-button type="primary" @click="checkAssignment">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label="修改作业" width="auto" align="center">
              <template v-slot="scope">
                <el-button type="primary" @click="setAssignment">设置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup scoped>
    import {reactive} from 'vue'
    import router from '@/router';
    import {
      Menu as IconMenu,
    } from '@element-plus/icons-vue'
    import moment from "moment";

    class CourseData{
      name: string;
      releaseTime: Date;
      deadline: Date;
      delayTime: Date;
      submitRatio: string;
      gradeRatio: string;
      isReturn: {a: boolean, b: string};

      constructor(name:string, releaseTime: Date, deadline: Date, delayTime: Date,
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
        releaseTime: new Date('2023-01-27 23:59'),
        deadline: new Date('2023-01-27 23:59'),
        delayTime: new Date('2023-01-28 23:59'),
        submitRatio: '155/0',
        gradeRatio: '144/15',
        isReturn: {a: true, b: "src/assets/icon/successful.png"},
      },
      {
        name: "Assignment two",
        releaseTime: new Date('2023-01-28 23:59'),
        deadline: new Date('2023-01-28 23:59'),
        delayTime: new Date('2023-01-29 23:59'),
        submitRatio: '155/0',
        gradeRatio: '144/15',
        isReturn: {a: true, b: "src/assets/icon/successful.png"},
      },
      {
        name: "Assignment three",
        releaseTime: new Date('2023-01-29 23:59'),
        deadline: new Date('2023-01-29 23:59'),
        delayTime: new Date('2023-01-30 23:59'),
        submitRatio: '155/0',
        gradeRatio: '144/15',
        isReturn: {a: false, b: "src/assets/icon/error.png"},
      },
    ])

    const dateFormat1 = (row: {releaseTime: Date}) =>{
      return moment(row.releaseTime).format("YYYY-MM-DD hh:mm")
    }

    const dateFormat2 = (row: {deadline: Date}) =>{
      return moment(row.deadline).format("YYYY-MM-DD hh:mm")
    }

    const dateFormat3 = (row: {delayTime: Date}) =>{
      return moment(row.delayTime).format("YYYY-MM-DD hh:mm")
    }
    const checkAssignment = () => {
        router.push('/Main/Homework')
    }
    const setAssignment = () => {
        router.push('/Main/Set')
    }
    const goBack = () => {
        router.push('/')
    }
</script>

<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'Course',
  created() {

  },
  mounted() {
  },
  data() {
    return {

    }
  },
  methods: {

  }
});
</script>