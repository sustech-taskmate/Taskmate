<template>
    <el-row>
        <el-button type="primary" @click="goBack" style="margin-top: 50px; margin-left: 1200px;">返回</el-button>
    </el-row>
    <el-row>
        <el-col :span="7" style="margin: 0 450px">
            <h1>作业列表</h1>
            <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="作业" width="150" />
            <el-table-column prop="sdl" label="起始时间" width="150" />
            <el-table-column prop="ddl" label="截止时间" width="150" />
        </el-table>
        </el-col>
    </el-row>
    <el-row>
        <el-button type="info" @click="dialogFormVisible = true" style="margin-top: 30px; margin-left: 610px;">修改作业信息</el-button>
    </el-row>
    <el-dialog v-model="dialogFormVisible" style="width: 450px; ">
        <template #header="{ close, titleId, titleClass }">
            <h1>修改作业信息</h1>
        </template>
        <el-form v-model="form">
            <el-form-item label="Assignment to modify">
                <el-select v-model="form.Ass" placeholder="Choose an assignment">
                    <el-option label="Assignment1" value="Assignment1" />
                    <el-option label="Assignment2" value="Assignment2" />
                    <el-option label="Assignment3" value="Assignment3" />
                </el-select>
            </el-form-item>
            <el-form-item label="修改后起始时间">
                <el-col :span="11">
                    <el-date-picker
                    v-model="form.dateS1"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 100%"
                    />
                </el-col>
                <el-col :span="11">
                    <el-time-picker
                    v-model="form.dateS2"
                    placeholder="请选择时间"
                    style="width: 100%"
                    />
                </el-col>
            </el-form-item>
            <el-form-item label="修改后截止时间">
                <el-col :span="11">
                    <el-date-picker
                    v-model="form.dateD1"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 100%"
                    />
                </el-col>
                <el-col :span="11">
                    <el-time-picker
                    v-model="form.dateD2"
                    placeholder="请选择时间"
                    style="width: 100%"
                    />
                </el-col>
            </el-form-item>
            <el-form-item label="添加题目描述">
                <el-input v-model="form.msg" />
            </el-form-item>
            <el-form-item label="被分配的改作业助教">
                <el-select v-model="form.TA" placeholder="Choose a TA">
                    <el-option label="郭希阳" value="郭希阳" />
                    <el-option label="又是郭希阳" value="又是郭希阳" />
                    <el-option label="还是郭希阳" value="还是郭希阳" />
                </el-select>
            </el-form-item>
            <el-form-item label="分配的题目范围（“数字/数字”格式）">
                <el-input v-model="form.range" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="clear">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

</template>

<script lang="ts" setup scoped>
    import { reactive, ref } from 'vue'
    import {router} from '@/router';
    const dialogFormVisible = ref(false)
    let form = reactive({
        Ass: '',
        dateS1: '',
        dateS2: '',
        dateD1: '',
        dateD2: '',
        msg: '',
        TA: '',
        range: ''
    })
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
    const goBack = () => {
        router.push('/Main')
    }
    const clear = () => {
        form.Ass = ''
        form.dateS1 = ''
        form.dateS2 = ''
        form.dateD1 = ''
        form.dateD2 = ''
        form.msg = ''
        form.TA = ''
        form.range = ''
        dialogFormVisible.value = false
    }
    const onSubmit = () => {
        if (form.Ass !== '' && form.dateS1 !== '' && form.dateS2 !== '' && form.dateD1 !== '' && form.dateD2 !== '') {
            for (let i = 0; i < tableData.length; i++)
                if (tableData[i].name === form.Ass) {
                    const dateS1 = form.dateS1.toString().split(' ')
                    const dateS2 = form.dateS2.toString().split(' ')
                    const dateD1 = form.dateD1.toString().split(' ')
                    const dateD2 = form.dateD2.toString().split(' ')
                    const dateS = dateS1[3] + '/' + translate(dateS1[1]) + '/' + dateS1[2] + ' ' + dateS2[4].substring(0, 5)
                    tableData[i].sdl = dateS
                    const dateD = dateD1[3] + '/' + translate(dateD1[1]) + '/' + dateD1[2] + ' ' + dateD2[4].substring(0, 5)
                    tableData[i].ddl = dateD
                    alert('修改作业信息成功！')
                    clear()
                }
        }
        else 
            alert('请至少选择作业名称和起止时间')
    }
    const translate = (month: string) => {
        if (month === 'Jan')
            return '01'
        else if (month === 'Feb')
            return '02'
        else if (month === 'Mar')
            return '03'
        else if (month === 'Apr')
            return '04'
        else if (month === 'May')
            return '05'
        else if (month === 'Jun')
            return '06'
        else if (month === 'Jul')
            return '07'
        else if (month === 'Aug')
            return '08'
        else if (month === 'Sep')
            return '09'
        else if (month === 'Oct')
            return '10'
        else if (month === 'Nov')
            return '11'
        else if (month === 'Dec')
            return '12'
    }
</script>