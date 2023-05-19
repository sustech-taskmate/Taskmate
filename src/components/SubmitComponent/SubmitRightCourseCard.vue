<template>
    <el-col :span="24" style="height: 100%; width: 98%">
        <el-row style="height: 10vh" @click="rotate(CourseData)">
            <el-col :span="21" style="height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 0 0 0 0;
                                  border-bottom: 2px solid black; border-top: 2px solid black;"
                data-test="course-name">
                {{ CourseData.name }}
            </el-col>
            <el-col :span="3" style="height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 0 0 0 0;
                                  border-bottom: 2px solid black; border-top: 2px solid black;">
                <svg x="1682076109200" class="icon rotate" :class="{active: CourseData.down}" viewBox="0 0 1024 1024"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="2609" width="20" height="20"
                     style="transform-box:fill-box; transform-origin:center; rotate: 180deg"
                >
                    <path d="M93.37191 57.154573 930.62809 540.635608 93.37191 1024Z" fill="#272636" p-id="2610">
                    </path>
                </svg>
            </el-col>
        </el-row>
        <el-row class="downList" v-if="CourseData.down"
            ref="down">
            <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;" v-for="(context, index) in CourseData.assignmentList">
                <el-row style="height: 7vh; width: 100%; flex: 1 0 30%; border-bottom:  2px solid black;
                               display: flex; justify-content: center; align-items: center;" @click="changeContext(index, context, CourseData.name)"
                    data-test="assignment-name">
                        {{context.name}}
                </el-row>
            </div>
        </el-row>
    </el-col>
</template>

<script lang="ts">
import {Assignment, Course} from "@/store/submit";
import { defineComponent } from 'vue';
export default defineComponent({
    name: "SubmitRightCourseCard",
    props: {
        CourseData: {
            type: Course,
            required: true
        },

    },
    methods: {
        changeContext (index: number, context: Assignment, courseName: string){
            this.$emit('child-value', index, context)
        },
      rotate (item: Course) {
        item.down = !item.down
      }
    }
})
</script>

<style scoped>
.rotate {
    transition: transform 0.5s;
}

.rotate.active {
    transform: rotate(-90deg);
}
</style>