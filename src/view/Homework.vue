<template>
    <el-row>
        <el-button type="primary" @click="mySet" style="margin-top: 50px; margin-left: 1200px">作业设置</el-button>
        <el-button type="primary" @click="goBack" style="margin-top: 50px">返回主页</el-button>
    </el-row>
    <el-row>
        <el-col :span="30" style="margin: 50px 300px 0;">
            <el-row>
                <el-col :span="19"><h1>学生列表</h1></el-col>
                <el-col :span="5"><h3>未批改份数: {{count}}</h3></el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="sid" label="学号" width="100" />
                <el-table-column prop="name" label="姓名" width="150" />
                <el-table-column prop="submit_state" label="提交状态" width="200" />
                <el-table-column prop="has_attachment" label="有无附件" width="100" />
                <el-table-column prop="modify_state" label="批改状态" width="150" />
                <el-table-column prop="score" label="分数" width="100" />
                <el-table-column label="查看附件" width="100">
                    <template v-slot="scope">
                        <el-button type="primary" @click="myClick">批改</el-button>
                    </template>
                </el-table-column>
            
            </el-table>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup scoped>
    import {reactive} from 'vue'
    import router from '@/router';
    const count = 3 
    const tableData = reactive([
        {
            sid: 12011901,
            name: '郭希阳',
            submit_state: 'Submitted on 2023/3/16',
            has_attachment: 'yes',
            modify_state: 'modified',
            score: 100
        },
        {
            sid: 12011902,
            name: '还是郭希阳',
            submit_state: 'Submitted on 2023/3/17',
            has_attachment: 'yes',
            modify_state: 'unmodified',
            score: null
        },
        {
            sid: 12011903,
            name: '依然是郭希阳',
            submit_state: 'unsubmitted',
            has_attachment: 'yes',
            modify_state: 'unmodified',
            score: null
        },
        {
            sid: 12011904,
            name: '禁止套娃',
            submit_state: 'unsubmitted',
            has_attachment: 'yes',
            modify_state: 'unmodified',
            score: null
        }
    ])
    const myClick = () => {
        router.push('/Main/Homework/Assign')
    }
    const mySet = () => {
        router.push('/Main/Set')
    }
    const goBack = () => {
        router.push('/Main')
    }
</script>