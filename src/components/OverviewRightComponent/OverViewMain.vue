<template>
    <el-header type="flex" style="height: 10vh;
    border-bottom: 2px solid black; border-left: 2px solid black; border-top: 2px solid black; border-radius: 10px 0 0 0">
        <el-row type="flex" style="height: 100%">
            <el-col :span="18" style="height: 100%" type="flex">
            </el-col>
            <el-col :span="3" style="height: 100%" type="flex">
                <el-row style="height: 100%" type="flex">
                    <svg
                            style="text-align: center; vertical-align: center; height: 100%; width: 50%"
                            type="flex"
                            viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="10" style="fill: none; stroke: lightblue; stroke-width: 3"></circle>
                    </svg>
                    <div style="height: 100%; width: 50%; text-align: center; vertical-align: center;
                                     display: flex; align-items: center; justify-content: center;
                                     color: blue;" type="flex">
                        SA
                    </div>
                </el-row>
            </el-col>
            <el-col :span="3" style="height: 100%" type="flex">
                <el-row style="height: 100%" type="flex">
                    <svg
                            style="text-align: center; vertical-align: center; height: 100%; width: 50%"
                            type="flex"
                            viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="10" style="fill: none; stroke: lightgreen; stroke-width: 3"></circle>
                    </svg>
                    <div style="height: 100%; width: 50%; text-align: center; vertical-align: center;
                                     display: flex; align-items: center; justify-content: center;
                                     color: green;" type="flex">
                        Student
                    </div>
                </el-row>
            </el-col>
        </el-row>
    </el-header>
    <el-main type="flex" style="height: 90vh; overflow-y: auto; border-left: 2px solid black; border-radius: 0 0 0 10px">
            <overview-middle-card :CardList="CardList"></overview-middle-card>
    </el-main>
</template>

<script lang="ts">
import OverviewMiddleCard from "@/components/OverviewRightComponent/OverviewMiddleCard.vue";
import {Card} from '@/store/todo';
export default {
    name: "OverViewMain",
    components: {OverviewMiddleCard},
    props: {
        CardList: {
            type: Array,
            required: true
        },
    }
}
</script>

<style scoped>

</style>
