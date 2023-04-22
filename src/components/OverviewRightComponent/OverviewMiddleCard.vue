<template>
  <el-col :span="24" style="height: 100%; width: 100%">
      <div v-for="item in CardList">
      <el-row style="height: 10vh" @click="rotate(item)">
          <el-col :span="21"
                  style="display: flex; align-items: center; padding-left: 10px; border-radius: 10px 0 0 10px;
                        border-bottom: 2px solid black; border-top: 2px solid black; border-left: 2px solid black;">
              {{item.name}}
          </el-col>
          <el-col :span="3" style="display: flex; align-items: center; justify-content: center; border-radius: 0 10px 10px 0;
                                  border-bottom: 2px solid black; border-top: 2px solid black; border-right: 2px solid black">
              <svg x="1682076109200" class="icon rotate" :class="{active: item.down}" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="2609" width="20" height="20"
                   style="transform-box:fill-box; transform-origin:center; rotate: 180deg"
                  >
                  <path d="M93.37191 57.154573 930.62809 540.635608 93.37191 1024Z" fill="#272636" p-id="2610">
                  </path>
              </svg>
          </el-col>
      </el-row>
      <el-row class="downList" v-if="item.down"
              style="overflow-y: auto; border-radius: 10px;
                     border-bottom: 2px solid black; border-left: 2px solid black; border-right: 2px solid black; ">
                    <div style="display: flex; flex-wrap: wrap; width: 100%">
                        <el-col :span="8" v-for="context in item.listContainCard"
                                style="height: 30vh; width: 100%; flex: 1 0 30%;
                                      display: flex; justify-content: center; align-items: center;"
                                >
                            <el-col :span="20"
                                    style="height: 95%; width: 95%; border: 2px solid black; border-radius: 10px;"
                                    :style="{ background: contextColor(context)}">
                                <el-col style="height: 30%; width: 100%;
                                display: flex; justify-content: center; align-items: center;
                                border-bottom: 2px solid black;">
                                    {{context.name}}
                                </el-col>
                                <el-col style="height: 60%; width: 100%; word-wrap: break-word; padding-left: 5px;
                                /*display: flex; justify-content: center; align-items: center;*/
                                ">
                                    {{context.description}}
                                </el-col>
                                <el-col style="height: 10%; width: 100%; text-align: right; padding-right: 10px;">
<!--                                    {{context.identify}}-->
                                </el-col>
                            </el-col>
                        </el-col>
                    </div>

      </el-row>
      <el-row style="height: 1vh">
      </el-row>

      </div>
  </el-col>

</template>

<script lang="ts" setup>
import {Card, ContainCard} from "@/store/todo";
const rotate = (p: Card) => {
    p.down = !p.down
}
const contextColor = (context: ContainCard) =>{
    if(context.identify == "SA"){
        return 'lightblue'
    }else{
        return 'lightgreen'
    }
}

</script>

<script lang="ts">
import {ContainCard} from '@/store/todo';
export default {
    name: "OverviewMiddleCard",
    props: {
        CardList: {
            type: Array,
            required: true
        },
    },
    methods:{

    },
    data() {

    }
}
</script>

<style scoped>
.rotate {
    transition: transform 0.5s;
}

.rotate.active {
    transform: rotate(-90deg);
}

.downList {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
}
</style>