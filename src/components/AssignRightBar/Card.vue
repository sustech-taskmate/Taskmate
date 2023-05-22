<template>
    <el-row class="card-box" v-for="item in cards">
        <el-row class="card">
            <el-col :span="1"></el-col>
            <el-col :span="3">
                <li class="index-big">{{ item.questionTitle }}</li>
                <el-icon class="pull-down" :class="{'active': item.controller.isPullDown}" @click="pullDown(item)">
                    <CaretRight/>
                </el-icon>
            </el-col>
            <el-col :span="17" class="problem-box-big">
                <div class="point-box-big">
                    <div class="point-set">
                        <div @click="setGivenPointEditable(item)" v-show="!item.controller.givenPointEditable"
                             class="point-display">
                            {{ item.givenPoints }}
                        </div>
                        <input v-if="item.controller.givenPointEditable" type="text"
                               @input="updateGivenPoints(item)" v-model="item.controller.givenPointInput"
                               @blur="setGivenPointUneditable(item)" class="point-input"
                               :id="'given'+item.questionTitle" ref="fix">
                    </div>
                    &ensp;/&ensp;
                    <div class="point-set">
                        <!--                        <div @click="setTotalPointEditable(item)" v-show="!item.controller.totalPointEditable"-->
                        <!--                             class="point-display">-->
                        <div v-show="!item.controller.totalPointEditable"
                             class="point-display">
                            {{ item.totalPoints }}
                        </div>
                        <!--                        <input v-if="item.controller.totalPointEditable" type="text"-->
                        <!--                               @input="updateTotalPoints(item)" v-model="item.controller.totalPointInput"-->
                        <!--                               @blur="setTotalPointUneditable(item)" class="point-input"-->
                        <!--                               :id="'total'+item.questionTitle">-->
                    </div>
                </div>
                <div class="descript-box-big">
                    <el-popover
                        placement="top"
                        :title="item.questionTitle"
                        popper-style="width: 400px;"
                        trigger="click"
                        :content="item.comment"
                        hide-after="200"
                        @after-leave="hideInput(item)"
                        class="popover"
                    >
            <span v-show="!item.controller.isShowInput" @click="showInput(item)" class="beforepopinput">
              {{ item.comment === '' ? 'Please add your comments here' : item.comment }}</span>
                        <el-input v-model="item.comment" slot="content" type="textarea" :rows="4" ref="input"
                                  v-show="item.controller.isShowInput" @change="hideInput(item)" @blur="hideInput(item)"
                                  placeholder="Please add comments here" maxlength="1000" show-word-limit class="popinput"
                        ></el-input>
                        <template #reference>
                            <div class="description-big">
                                {{ item.comment }}
                            </div>
                        </template>
                    </el-popover>
                </div>
            </el-col>
            <el-col :span="3" style="display: flex;flex-direction: column;">
                <el-icon style="font-size: 20px;margin-left: -5%;margin-top: 30%;cursor: pointer" @click="addSub(item)" class="add">
                    <CirclePlusFilled/>
                </el-icon>
            </el-col>
        </el-row>
        <el-row class="sub-card-box" v-if="item.controller.isPullDown"
                :class="{'active': item.controller.isPullDown}"
                v-for="(sub, idx) in item.subCards">
            <el-row class="sub-card">
                <el-col :span="1"></el-col>
                <el-col :span="4">
                    <li class="index-small" :class="{'active': sub.controller.isSmallActive}"
                        @click="activeIndex(sub)">
                        {{ idx + 1 }}
                    </li>
                </el-col>
                <el-col :span="17" style="height: 100%">
                    <el-row class="adjust-point">
                        <div style="cursor: pointer;" @click="updateSign(sub)" class="sign">
                            {{ sub.sign }}
                        </div>
                        <div style="width: 40%">
                            <input v-show="sub.controller.pointEditable" type="text"
                                   @input="updateSubPoints(sub)" v-model="sub.controller.pointInput"
                                   @blur="setSubPointUneditable(sub)" class="sub-point-input"
                                   :id="'sub' + item.questionTitle + '_' + idx.toString()">
                            <div v-show="!sub.controller.pointEditable" @click="setSubPointEditable(sub, item, idx)"
                                 class="sub-point-display">
                                {{ sub.points }}
                            </div>
                        </div>
                    </el-row>
                    <el-row class="adjust-comment">
                        <input v-model="sub.comment"
                               v-show="sub.controller.isShowInput"
                               @change="hideInputSub(sub)"
                               @blur="hideInputSub(sub)"
                               placeholder="Please add the details"
                               style="background-color: transparent;background-image: none;padding: 0;height: 24px;width: 100%;"/>
                        <div class="subtext-text" @click="showInputSub(sub)" v-show="!sub.controller.isShowInput">{{
                                sub.comment
                            }}
                        </div>
                    </el-row>
                </el-col>
                <el-col :span="2">
                    <el-popconfirm title="Are you sure to delete this?"
                                   @confirm="removeSub(item, idx)" class="ElPopconfirm">
                        <template #reference>
                            <el-icon style="font-size: 20px;transform: translate(0, -100%);cursor: pointer;">
                                <Close/>
                            </el-icon>
                        </template>
                    </el-popconfirm>
                </el-col>
            </el-row>
        </el-row>
    </el-row>
</template>

<script lang="ts" setup>
import {PropType, ref} from "vue";
import {CaretRight, CirclePlusFilled, Close} from "@element-plus/icons-vue";
import '@/assets/style/local/card.css'
import {BigCard, SmallCard} from "@/store/card";
import {Metrics} from "@/composable/serverRequest";
import {GradeInfo} from "@/store/assign";

const props = defineProps({
    metrics: {
        type: Array as PropType<Metrics[]>,
        required: true
    }
})

const metrics = ref(props.metrics);
let cards = ref([] as BigCard[]);
metrics.value.forEach((item, idx) => {
    cards.value.push(new BigCard(item.uuid, (idx + 1).toString(), item.max, 0, ''));
})

const emits = defineEmits(['update'])
const update = () => {
    let grades = [] as GradeInfo[]
    cards.value.forEach((value) => {
        grades.push({
            uuid: value.uuid,
            totalPoints: value.totalPoints,
            givenPoints: value.givenPoints,
            comment: value.comment
        })
    })
    emits('update', grades)
}

let eleInput = ref('');

const pullDown = (item: BigCard) => {
    item.controller.isPullDown = !item.controller.isPullDown
}
const showInput = (item: BigCard) => {
    item.controller.isShowInput = true;
}
const hideInput = (item: BigCard) => {
    item.controller.isShowInput = false;
    update();
}
const addSub = (item: BigCard) => {
    item.subCards.push(new SmallCard(item, '+', 0, ''));
    item.controller.isPullDown = true;
}
// const setTotalPointEditable = (item: BigCard) => {
//     item.controller.totalPointEditable = true;
//     eleInput.value = 'total' + item.questionTitle;
// }
const setGivenPointEditable = (item: BigCard) => {
    item.controller.givenPointEditable = true;
    eleInput.value = 'given' + item.questionTitle;
}
// const setTotalPointUneditable = (item: BigCard) => {
//     item.controller.totalPointEditable = false;
//     eleInput.value = '';
// }
const setGivenPointUneditable = (item: BigCard) => {
    item.controller.givenPointEditable = false;
    eleInput.value = '';
    checkValid(item);
    update();
}
// const updateTotalPoints = (item: BigCard) => {
//     item.controller.totalPointInput = item.controller.totalPointInput.match(/^(?!0\d|$)(?:\d{1,4}(?:\.\d{0,2})?|\.\d{1,2})$/)?.[0] || '';
//     item.totalPoints = item.controller.totalPointInput === '' ? 0 : parseFloat(item.controller.totalPointInput);
// }
const updateGivenPoints = (item: BigCard) => {
    item.controller.givenPointInput = item.controller.givenPointInput.match(/^(?!0\d|$)(?:\d{1,4}(?:\.\d{0,2})?|\.\d{1,2})$/)?.[0] || '';
    item.givenPoints = item.controller.givenPointInput === '' ? 0 : parseFloat(item.controller.givenPointInput);
}
const removeSub = (item: BigCard, idx: number) => {
    item.subCards.splice(idx, 1);
    if (item.subCards.length === 0) {
        item.controller.isPullDown = false;
    }
}
const activeIndex = (sub: SmallCard) => {
    if (sub.controller.isSmallActive) {
        sub.controller.isSmallActive = false;
        disableSub(sub);
    } else {
        sub.controller.isSmallActive = true;
        enableSub(sub);
    }
    update();
}
const showInputSub = (sub: SmallCard) => {
    sub.controller.isShowInput = true;
}
const hideInputSub = (sub: SmallCard) => {
    sub.controller.isShowInput = false;
}
const updateSign = (sub: SmallCard) => {
    if (sub.controller.isSmallActive) {
        sub.controller.isSmallActive = false;
        disableSub(sub);
    }
    sub.sign = sub.sign === '+' ? '-' : '+';
}
const setSubPointEditable = (sub: SmallCard, item: BigCard, idx: number) => {
    if (sub.controller.isSmallActive) {
        sub.controller.isSmallActive = false;
        disableSub(sub);
    }
    sub.controller.pointEditable = true;
    eleInput.value = 'sub' + item.questionTitle + '_' + idx.toString();
}
const setSubPointUneditable = (sub: SmallCard) => {
    sub.controller.pointEditable = false;
    eleInput.value = '';
}
const updateSubPoints = (sub: SmallCard) => {
    sub.controller.pointInput = sub.controller.pointInput.match(/^(?!0\d|$)(?:\d{1,4}(?:\.\d{0,2})?|\.\d{1,2})$/)?.[0] || '';
    sub.points = sub.controller.pointInput === '' ? 0 : parseFloat(sub.controller.pointInput);
}
const enableSub = (sub: SmallCard) => {
    let bc = sub.parentCard as BigCard;
    if (sub.sign === '+') {
        bc.givenPoints += sub.points;
    } else {
        bc.givenPoints -= sub.points;
    }
    bc.comment += ("\n" + sub.comment);
    checkValid(bc);
    updateBigInput(bc);
}
const disableSub = (sub: SmallCard) => {
    let bc = sub.parentCard as BigCard;
    if (sub.sign === '+') {
        bc.givenPoints -= sub.points;
    } else {
        bc.givenPoints += sub.points;
    }
    checkValid(bc);
    updateBigInput(bc);
}
const checkValid = (bc: BigCard) => {
    if (bc.givenPoints < 0) bc.givenPoints = 0;
    if (bc.givenPoints > bc.totalPoints) bc.givenPoints = bc.totalPoints;
}
const updateBigInput = (bc: BigCard) => {
    bc.controller.givenPointInput = bc.givenPoints.toString();
}


let cnt = ref(0);

function updatePointer() {
    setInterval(() => {
        cnt.value++;
        document.getElementById(eleInput.value)?.focus();
        eleInput.value = '';
    }, 500);
}

updatePointer();
</script>

<script lang="ts">
export default {
    name: "Card"
}
</script>

<style scoped>

</style>
