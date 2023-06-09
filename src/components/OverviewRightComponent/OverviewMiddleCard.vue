<template>
  <el-col :span="24" style="height: 100%; width: 100%">
    <div v-for="item in cards">

      <el-row v-if="!item.indexDown" style="height: 10vh;" @click="rotate(item)">
        <el-col :span="21"
                style="display: flex; align-items: center; padding-left: 10px;
                        border-bottom: 2px solid #6b5b5b; border-top: 2px solid #6b5b5b; border-left: 2px solid #6b5b5b;
                        font-size: calc(100vw * 28 / 1500);border-top-left-radius: 10px; border-bottom-left-radius: 10px"
                ref="class">
          {{ item.name }}
        </el-col>
        <el-col :span="3" style="display: flex; align-items: center; justify-content: center;
                                  border-bottom: 2px solid #6b5b5b; border-top: 2px solid #6b5b5b; border-right: 2px solid #6b5b5b;
                                  border-top-right-radius: 10px;border-bottom-right-radius: 10px">
          <svg-icon name="down" color="#272636" class="icon rotate" :class="{active: item.indexDown}"/>
        </el-col>
      </el-row>

      <el-row v-if="item.indexDown" style="height: 10vh" @click="rotate(item)">
        <el-col :span="21"
                style="display: flex; align-items: center; padding-left: 10px;
                        border-bottom: 2px solid #6b5b5b; border-top: 2px solid #6b5b5b; border-left: 2px solid #6b5b5b;
                        font-size: calc(100vw * 28 / 1500); border-top-left-radius: 10px"
                ref="class">
          {{ item.name }}
        </el-col>
        <el-col :span="3" style="display: flex; align-items: center; justify-content: center; border-top-right-radius: 10px;
                                  border-bottom: 2px solid #6b5b5b; border-top: 2px solid #6b5b5b; border-right: 2px solid #6b5b5b">
          <svg-icon name="down" color="#272636" class="icon rotate" :class="{active: item.indexDown}"/>
        </el-col>
      </el-row>

      <el-row class="downList" v-if="item.indexDown"
              style="overflow-y: auto; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; border-bottom: 2px solid #6b5b5b;
               border-left: 2px solid #6b5b5b; border-right: 2px solid #6b5b5b;"
              ref="down">
        <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: center;">
          <el-col :span="8" v-for="context in item.listContainCard"
                  style="height: 20vh; width: 100%; flex: 1 0 30%; max-width: 24vh;
                                      display: flex; justify-content: center; align-items: center;">
            <el-col :span="20"
                    style="height: 80%; width: 95%; border: 2px solid black;
                    border-radius: 10px;
                                    cursor: pointer"
                    :style="{ background: contextColor(context)}"
                    @click="toCourse(context)">
              <el-col style="height: 30%; width: 100%;
                                display: flex; justify-content: center; align-items: center;
                                border-bottom: 2px solid black; font-size: calc(100vw * 25 / 1500)"
                      data-test="name">
                {{ context.code }}
              </el-col>
              <el-col style="height: 60%; width: 100%; word-wrap: break-word; padding-left: 5px;
                                font-size: calc(100vw * 14 / 1500)"
                      data-test="description">
                {{ context.title }}
              </el-col>
              <el-col style="height: 10%; width: 100%; text-align: right; padding-right: 10px;">
              </el-col>
            </el-col>
          </el-col>
        </div>
      </el-row>
      <el-row style="height: 1vh"/>
    </div>
  </el-col>

</template>

<script lang="ts">
import {Card, ClassUserRole, ContainCard} from "@/store/todo";
import {useRouterPush} from "@/composable";
import {defineComponent, PropType, ref, watch} from "vue";
import SvgIcon from "@/components/util/SvgIcon.vue";

export default defineComponent({
    name: "OverviewMiddleCard",
    components: {SvgIcon},
    props:{
        cardList: {
            type: Array as PropType<Card[]>,
            required: true
        },
        filters: {
            type: Array as PropType<boolean[]>,
            required: true
        }
    },
    setup(props){
        const {routerPush} = useRouterPush();
        const cards = ref(props.cardList as Card[]);
        const rotate = (p: Card) => {
            p.indexDown = !p.indexDown
        }

        const identify = (role: ClassUserRole) => {
            switch (role) {
                case ClassUserRole.ASSISTANT:
                    return 0
                case ClassUserRole.TEACHER:
                    return 1
                case ClassUserRole.STUDENT:
                    return 2
                default:
                    return 0
            }
        }
        const contextColor = (context: ContainCard) => {
            switch (context.identify) {
                case ClassUserRole.ASSISTANT:
                    return 'lightblue'
                case ClassUserRole.STUDENT:
                    return 'lightgreen'
                case ClassUserRole.TEACHER:
                    return 'lightpink'
                default:
                    return 'lightgray'
            }
        }
        const toCourse = (item: ContainCard) => {
            let identify = item.identify;
            if (identify == ClassUserRole.ASSISTANT || identify == ClassUserRole.TEACHER) {
                routerPush({name: 'teacherCourse', params: {cid: item.id},
                    query: {courses: JSON.stringify(props.cardList)}})
            } else {
                routerPush({name: 'upload', params: {cid: item.id}, query: {courseName: item.title}})
            }
        }

        watch(props.filters, (newVal, oldVal) => {
            let tempCards: Card[] = []
            props.cardList.forEach(card => {
                let tempContainCard: ContainCard[] = []
                card.listContainCard.forEach(item => {
                    if (newVal[identify(item.identify)]) {
                        tempContainCard.push(item)
                    }
                })
                if (tempContainCard.length > 0) {
                    tempCards.push({
                        name: card.name,
                        indexDown: false,
                        courseviewDown: false,
                        listContainCard: tempContainCard,
                        index: card.index
                    })
                }
            })
            cards.value = tempCards;
        })
        return{
            cards,
            rotate,
            contextColor,
            toCourse,
        }
    },
})

</script>

<!--<script lang="ts" setup>-->
<!--import {Card, ClassUserRole, ContainCard} from "@/store/todo";-->
<!--import {useRouterPush} from "@/composable";-->
<!--import {PropType, ref, watch} from "vue";-->
<!--import SvgIcon from "@/components/util/SvgIcon.vue";-->

<!--const props = defineProps({-->
<!--  cardList: {-->
<!--    type: Array as PropType<Card[]>,-->
<!--    required: true-->
<!--  },-->
<!--  filters: {-->
<!--    type: Array as PropType<boolean[]>,-->
<!--    required: true-->
<!--  }-->
<!--})-->

<!--const identify = (role: ClassUserRole) => {-->
<!--  switch (role) {-->
<!--    case ClassUserRole.ASSISTANT:-->
<!--      return 0-->
<!--    case ClassUserRole.TEACHER:-->
<!--      return 1-->
<!--    case ClassUserRole.STUDENT:-->
<!--      return 2-->
<!--    default:-->
<!--      return 0-->
<!--  }-->
<!--}-->

<!--const cards = ref(props.cardList as Card[]);-->

<!--watch(props.filters, (newVal, oldVal) => {-->
<!--  let tempCards: Card[] = []-->
<!--  props.cardList.forEach(card => {-->
<!--    let tempContainCard: ContainCard[] = []-->
<!--    card.listContainCard.forEach(item => {-->
<!--      if (newVal[identify(item.identify)]) {-->
<!--        tempContainCard.push(item)-->
<!--      }-->
<!--    })-->
<!--    if (tempContainCard.length > 0) {-->
<!--      tempCards.push({-->
<!--          name: card.name,-->
<!--          indexDown: false,-->
<!--          courseviewDown: false,-->
<!--          listContainCard: tempContainCard,-->
<!--          index: card.index-->
<!--      })-->
<!--    }-->
<!--  })-->
<!--  cards.value = tempCards;-->
<!--})-->

<!--const {routerPush} = useRouterPush();-->

<!--const rotate = (p: Card) => {-->
<!--  p.indexDown = !p.indexDown-->
<!--}-->
<!--const contextColor = (context: ContainCard) => {-->
<!--  switch (context.identify) {-->
<!--    case ClassUserRole.ASSISTANT:-->
<!--      return 'lightblue'-->
<!--    case ClassUserRole.STUDENT:-->
<!--      return 'lightgreen'-->
<!--    case ClassUserRole.TEACHER:-->
<!--      return 'lightpink'-->
<!--    default:-->
<!--      return 'lightgray'-->
<!--  }-->
<!--}-->
<!--const toCourse = (item: ContainCard) => {-->
<!--  let identify = item.identify;-->
<!--  if (identify == ClassUserRole.ASSISTANT || identify == ClassUserRole.TEACHER) {-->
<!--    routerPush({name: 'teacherCourse', params: {cid: item.id},-->
<!--        query: {courses: JSON.stringify(props.cardList)}})-->
<!--  } else {-->
<!--      routerPush({name: 'upload', params: {cid: item.id}, query: {courseName: item.title}})-->
<!--  }-->
<!--}-->

<!--</script>-->

<style scoped>
.icon {
  transform-box: fill-box;
  transform-origin: center;
  rotate: 180deg
}

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
