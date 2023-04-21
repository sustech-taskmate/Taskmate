<template>
    <el-container>
        <el-main style="height: 99vh; overflow-y: hidden">
            <div style="height: 47.5%; width: 99%;border: 1px solid black; background: white; border-radius: 10px">
                <div style="height: 20%; width: 100%;
                           display: flex; align-items: center; justify-content: center;
                           border-bottom: 1px solid black;">

                    TODO LIST
                </div>
                <div v-if="SaTask" style="height: 80%; width: 100%; overflow-y: auto;">
                    <div v-for="item in SaTodoList" style="height: 20%; width: 100%;">
                        <el-row style="height: 100%; width: 100%;" class="row">
                            <div style="height: 100%; width: 30%; display: flex; align-items: center; justify-content: center;">
                                {{ item.name }}
                            </div>
                            <div style="height: 100%; width: 40%; display: flex; align-items: center; justify-content: center;">
                                {{ show(item.time) }}
                            </div>
                            <div style="height: 100%; width: 30%; display: flex; align-items: center; justify-content: center;">
                                <button class="btn check">grade</button>
                            </div>
                        </el-row>
                        <div style="height: 5%; width: 100%;"></div>
                    </div>
                </div>
            </div>

            <div style="height: 5%">

            </div>

            <div style="height: 47.5%; width: 99%;border: 1px solid black; background: white">
                <div style="height: 20%; width: 100%;
                           display: flex; align-items: center; justify-content: center;
                           border-bottom: 1px solid black;">

                    TODO LIST
                </div>
                <div v-if="StudentTask" style="height: 80%; width: 100%; overflow-y: auto;">
                    <div v-for="item in StudentTodoList" style="height: 20%; width: 100%;">
                        <el-row style="height: 100%; width: 100%;" class="row">
                            <div style="height: 100%; width: 30%; display: flex; align-items: center; justify-content: center;">
                                {{ item.name }}
                            </div>
                            <div style="height: 100%; width: 40%; display: flex; align-items: center; justify-content: center;">
                                {{ show(item.time) }}
                            </div>
                            <div style="height: 100%; width: 30%; display: flex; align-items: center; justify-content: center;">
                                <button class="btn submit">submit</button>
                            </div>
                        </el-row>
                        <div style="height: 5%; width: 100%;"></div>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>


</template>

<script lang="ts" setup>
import moment from "moment";

function show(time: Date){
    return moment(time).format("YYYY-MM-DD hh:mm")
}


</script>

<script lang="ts">
export default {
    name: "OverViewRightCard",
    props: {
        SaTodoList: {
            type: Array,
            required: true
        },
        StudentTodoList: {
            type: Array,
            required: true
        },
        SaTask: {
            type: Boolean,
            require: true
        },
        StudentTask: {
            type: Boolean,
            require: true
        }
    },
}
</script>

<style scoped>
.row:hover{
    background-color: lightyellow;
}

.btn {
    border: 1px solid;
    background-color: transparent;
    text-transform: uppercase;
}

.btn:hover {
    color: white;
    border: 0;
    cursor: pointer;
}

.submit {
    color: orangered;
}

.submit:hover {
    background-color: orangered;
}

.check {
    color: lightblue;
}

.check:hover {
    background-color: lightblue;
}
</style>