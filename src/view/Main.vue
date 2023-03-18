<template>
    <el-row>
        <el-button type="primary" @click="mySet" style="margin-top: 50px; margin-left: 1200px">作业设置</el-button>
        <el-button type="primary" @click="goBack" style="margin-top: 50px">退出登录</el-button>
    </el-row>
    <el-row>
        <el-col :span="4" style="margin-left: 100px">
            <h1>课程列表</h1>
            <el-menu 
            class="el-menu-vertical-demo">
                <el-menu-item @click="exchange(index)" v-for="i, index in course" :key="index" :index="index">
                    {{ i }}
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="16" style="margin-left: 100px">
            <h1>作业列表</h1>
            <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="作业" width="150" />
            <el-table-column prop="sdl" label="起始时间" width="150" />
            <el-table-column prop="ddl" label="截止时间" width="150" />
            <el-table-column label="操作" width="180">
                <template v-slot="scope">
                    <el-button type="primary" @click="myClick">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup scoped>
    import {reactive} from 'vue'
    import router from '@/router';
    let course = ['OS', 'OOAD', 'JAVA2']
    let tableData = reactive([
        {
            name: 'Assignment1',
            sdl: '2023/3/1 00:00',
            ddl: '2023/3/7 23:55'
        },
        {
            name: 'Assignment2',
            sdl: '2023/3/7 00:00',
            ddl: '2023/3/14 23:55'
        },
        {
            name: 'Assignment3',
            sdl: '2023/3/14 00:00',
            ddl: '2023/3/21 23:55'
        }
    ])
    const myClick = () => {
        router.push('/Main/Homework')
    }
    const mySet = () => {
        router.push('/Main/Set')
    }
    const exchange = (course: number) => {
        if (course === 0) {
            tableData[0].name = 'Assignment1'
            tableData[1].name = 'Assignment2'
            tableData[2].name = 'Assignment3'
        }
        else if (course === 1) {
            tableData[0].name = 'Assignment4'
            tableData[1].name = 'Assignment5'
            tableData[2].name = 'Assignment6'
        }
        else if (course === 2) {
            tableData[0].name = 'Assignment7'
            tableData[1].name = 'Assignment8'
            tableData[2].name = 'Assignment9'
        }
    }
    const goBack = () => {
        router.push('/')
    }
</script>