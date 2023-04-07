<template>
  <el-row type="flex">
    <el-col :span="24">
      <div style="height: 100vh;">
        <div style="height: 10%; display: flex">
          <el-col :span="12" style="width: 50%; height: 100%">
            <div style="font-size: 40px;text-align: center; margin-top: 10px">
              CS304
            </div>
          </el-col>

          <el-col :span="12" style="width: 50%; height: 100%">
            <div style="vertical-align: center; text-align: center">
              <el-button type="primary" style="width: 30%; height: 40px" @click="showDownload">
                批量下载
              </el-button>
            </div>
          </el-col>
        </div>

        <div>
          <el-table
              :data="tableData"
              style="width: 100%; display: flex"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" v-if="myShow"> </el-table-column>
            <el-table-column prop="id" sortable label="学号" width="auto" align="center"/>
            <el-table-column prop="name" label="姓名" width="auto" align="center"/>
            <el-table-column prop="submitState" sortable label="提交状态" width="auto"
                             :formatter="dateFormat" align="center"/>
            <el-table-column prop="modifyState"
                             sortable="custom"
                             label="批改状态" width="auto" align="center">
              <template v-slot="scope">
                <el-image  style="width: 15px; height: 15px" :src="scope.row.modifyState.fileUrl"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="lastModifiedBy" label="上次修改者" width="auto" align="center"/>
            <el-table-column prop="lastTime"
                             label="上次修改时间" width="auto" :formatter="dateFormat" align="center"/>
            <el-table-column prop="score" sortable label="分数" width="auto" align="center"/>
            <el-table-column label="查看附件" width="auto" align="center">
              <template v-slot="scope">
                <el-button type="primary" @click="check">批改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>

import {reactive} from 'vue'
import router from '@/router'
import moment from 'moment'

enum AssignmentState{
    notModified,
    modifying,
    finish

}
class UrlFile{
  fileUrl: string;
  assignState: AssignmentState;

  constructor(str: string, state: AssignmentState) {
    this.fileUrl = str;
    this.assignState = state;
  }

}
interface StudentContent {
  id: number,
  name: string,
  submitState: Date | null,
  modifyState: UrlFile,
  lastModifiedBy: string,
  lastTime: Date | null,
  score: number,

  //数据可视化
  //名字，release，ddl，延期时间，提交比，评分比，是否return，setting 三个时间支持排序，return排序，
}

const tableData: StudentContent[] = reactive([
  {
    id: 12010000,
    name: 'aaaa',
    submitState: new Date('2023-01-23'),
    modifyState: new UrlFile("src/assets/icon/error.png", AssignmentState.notModified),
    lastModifiedBy: "aaaa",
    lastTime: new Date('2023-01-28'),
    score: 0
  },
  {
    id: 12010001,
    name: 'aaaa',
    submitState: new Date('2023-01-24'),
    modifyState: new UrlFile("src/assets/icon/warning.png", AssignmentState.modifying),
    lastModifiedBy: "aasda",
    lastTime: new Date('2023-01-26'),
    score: 0
  },
  {
    id: 12010002,
    name: 'aaaa',
    submitState: new Date('2023-01-29'),
    modifyState: new UrlFile("src/assets/icon/error.png", AssignmentState.notModified),
    lastModifiedBy: "arra",
    lastTime: new Date('2023-01-29'),
    score: 0
  },
  {
    id: 12010003,
    name: 'aaaa',
    submitState: new Date('2023-01-20'),
    modifyState: new UrlFile("src/assets/icon/successful.png", AssignmentState.finish),
    lastModifiedBy: "aafdbkp",
    lastTime: new Date('2023-01-24'),
    score: 0
  },
])

const dateFormat = (row: { submitState: moment.MomentInput | null; }) =>{
  if (row.submitState === null) {
    return "";
  }else {
    return moment(row.submitState).format("YYYY-MM-DD");
  }

}
const compare = (custom: {modifyState: UrlFile}, order: string) => {
  return function (obj1: StudentContent, obj2:StudentContent) {
    const value1 = obj1["modifyState"];
    const value2 = obj2["modifyState"];
    if (value1.assignState <= value2.assignState) {
      return order === 'ascending' ? -1 : 1
    } else {
      return order === 'ascending' ? 1 : -1
    }
  }
}
const sortChange = (custom: any) => {
  tableData.sort(compare(custom.prop, custom.order))
}
const check = () => {
  router.push('/Main/Homework/Assign')
}

const handleSelectionChange = () => {
  // 暂时不写，后面添加下载语句
}
const mySet = () => {
  router.push('/Main/Set')
}
const goBack = () => {
  router.push('/Main')
}
</script>
<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'Homework',
  created() {

  },
  mounted() {
  },
  data() {
    return {
      myShow: false,
    }
  },
  methods: {
    showDownload(){
      if(this.myShow){
        this.myShow = false
      }else{
        this.myShow = true
      }
      console.log(this.myShow)
    }
  }
});
</script>
