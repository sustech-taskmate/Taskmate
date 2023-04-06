<template>
  <div class="title-box">
    CS307 Assignment1
  </div>
  <div class="top-box">
    <div class="box1">
      <h2 class="text-prog">PROGRESS</h2>
      <div class="percent">
        <svg>
          <circle cx="40" cy="40" r="40"></circle>
          <circle cx="40" cy="40" r="40"></circle>
        </svg>
        <div class="number">
          <h2>123/129</h2>
        </div>
      </div>
    </div>
    <div class="box2">
      <h2 class="text-prog">POINTS</h2>
      <div class="point-box">
        <svg style="visibility: hidden">
          <circle cx="40" cy="40" r="40"></circle>
          <circle cx="40" cy="40" r="40"></circle>
        </svg>
        <div class="point">
          <h3>99.99 / 100.00</h3>
        </div>
      </div>
    </div>
  </div>
  <el-row class="card-box" v-for="item in cards.list">
    <el-row class="card">
      <el-col :span="1"></el-col>
      <el-col :span="3">
        <li class="index-big">{{ item.questionIdx }}</li>
        <el-icon class="pull-down" :class="{'active': item.isPullDown}" @click="pullDown(item)">
          <CaretRight/>
        </el-icon>
      </el-col>
      <el-col :span="17" class="problem-box-big">
        <div class="point-box-big">
          <div class="point-given">
            {{ item.givenPoints }}
          </div>
          &ensp;/&ensp;
          <div class="point-set">
            <div @click="setPointEditable(item)" v-show="!item.pointEditable" class="point-display">
              {{ item.totalPoints }}
            </div>
            <input v-show="item.pointEditable" type="text"
                   @input="updateTotalPoints(item)" v-model="item.pointInput"
                   @blur="setPointUneditable(item)" class="point-input">
          </div>

        </div>
        <div class="descript-box-big">
          <el-popover
              placement="left"
              :title="'Q' + item.questionIdx.toString()"
              width="400"
              trigger="click"
              :content="item.comment"
              hide-after="200"
              offset="[0, 0]"
              @after-leave="hideInput(item)"
          >
            <span v-show="!item.isShowInput" @click="showInput(item)">
              {{ item.comment == '' ? 'Please add your comments here' : item.comment }}</span>
            <el-input v-model="item.comment" slot="content" type="textarea" :rows="4" ref="input"
                      v-show="item.isShowInput" @change="hideInput(item)" @blur="hideInput(item)"
                      placeholder="Please add comments here" maxlength="1000" show-word-limit
            ></el-input>
            <template #reference>
              <div class="description-big"><span>{{ item.comment }}</span></div>
            </template>
          </el-popover>
        </div>
      </el-col>
      <el-col :span="3" style="display: flex;flex-direction: column;">
        <el-icon style="font-size: 20px;margin-left: -5%;margin-top: 30%;cursor: pointer" @click="addSub(item)">
          <CirclePlusFilled/>
        </el-icon>
      </el-col>
    </el-row>
    <el-row class="sub-card-box" :class="{'active': item.isPullDown}" v-for="(sub, idx) in item.subCards">
      <el-row class="sub-card">
        <el-col :span="1"></el-col>
        <el-col :span="4">
          <li class="index-small" :class="{'active': sub.isSmallActive}"
              @click="activeIndex(sub)">
            {{ idx + 1 }}
          </li>
        </el-col>
        <el-col :span="17" style="height: 100%">
          <el-row class="adjust-point">
            <div style="cursor: pointer;" @click="updateSign(sub)">
              {{ sub.sign }}
            </div>
            <div style="width: 40%">
              <input v-show="sub.pointEditable" type="text"
                     @input="updateSubPoints(sub)" v-model="sub.pointInput"
                     @blur="setSubPointUneditable(sub)" class="sub-point-input">
              <div v-show="!sub.pointEditable" @click="setSubPointEditable(sub)" class="sub-point-display">
                {{ sub.points }}
              </div>
            </div>
          </el-row>
          <el-row class="adjust-comment">
            <input v-model="sub.comment"
                   v-show="sub.isShowInput"
                   @change="hideInputSub(sub)"
                   @blur="hideInputSub(sub)"
                   placeholder="Please add the details"
            style="background-color: transparent;background-image: none;padding: 0;height: 24px"/>
            <div class="subtext-text" @click="showInputSub(sub)" v-show="!sub.isShowInput">{{ sub.comment }}</div>
          </el-row>
        </el-col>
        <el-col :span="2">
          <el-popconfirm title="Are you sure to delete this?"
                         @confirm="removeSub(item, idx)">
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

<script setup lang="ts">
import {ref} from "vue";
import {CaretRight, CirclePlusFilled, Close} from "@element-plus/icons-vue";
import '@/assets/style/local/card.css'
import '@/assets/style/local/progress.css'
import '@/store/card'
import {BigCard, SmallCard, UniqueList} from "@/store/card";

const pullDown = (item: BigCard) => {
  item.isPullDown = !item.isPullDown
}
const showInput = (item: BigCard) => {
  item.isShowInput = true;
}
const hideInput = (item: BigCard) => {
  item.isShowInput = false;
}
const addSub = (item: BigCard) => {
  item.subCards.push(new SmallCard(item, '+', 0, ''));
  item.isPullDown = true;
}
const setPointEditable = (item: BigCard) => {
  item.pointEditable = true;
}
const setPointUneditable = (item: BigCard) => {
  item.pointEditable = false;
}
const updateTotalPoints = (item: BigCard) => {
  item.pointInput = item.pointInput.match(/^(?!0\d|$)(?:\d{1,4}(?:\.\d{0,2})?|\.\d{1,2})$/)?.[0] || '';
  item.totalPoints = item.pointInput === '' ? 0 : parseFloat(item.pointInput);
}
const removeSub = (item: BigCard, idx: number) => {
  item.subCards.splice(idx, 1);
  if (item.subCards.length === 0) {
    item.isPullDown = false;
  }
}
const activeIndex = (sub: SmallCard) => {
  sub.isSmallActive = !sub.isSmallActive
}
const showInputSub = (sub: SmallCard) => {
  sub.isShowInput = true;
}
const hideInputSub = (sub: SmallCard) => {
  sub.isShowInput = false;
}
const updateSign = (sub: SmallCard) => {
  sub.sign = sub.sign === '+' ? '-' : '+';
}
const setSubPointEditable = (sub: SmallCard) => {
  sub.pointEditable = true;
}
const setSubPointUneditable = (sub: SmallCard) => {
  sub.pointEditable = false;
}
const updateSubPoints = (sub: SmallCard) => {
  sub.pointInput = sub.pointInput.match(/^(?!0\d|$)(?:\d{1,4}(?:\.\d{0,2})?|\.\d{1,2})$/)?.[0] || '';
  sub.points = sub.pointInput === '' ? 0 : parseFloat(sub.pointInput);
}
const handleKeydown = (e: { key: string; preventDefault: () => void; }, reg: RegExp, flag: boolean) => {
  const keyCode = e.key;
  if (keyCode === 'ArrowLeft' || keyCode === 'ArrowRight'
      || keyCode === 'Delete' || keyCode === 'Backspace') {
    return;
  } else if (!reg.test(keyCode)) {
    e.preventDefault();
  } else if (flag) {
    e.preventDefault();
  }
}
const onlyNumberAndDecimal = (item: BigCard, e: { key: string; preventDefault: () => void; }) => {
  let flag = (item.totalPoints.toString().length >= 5);
  handleKeydown(e, /^[0-9.]+$/, flag);
}

let cards = ref(new UniqueList<BigCard>());
cards.value.add(new BigCard(1, 9421.99, 8321.12, 'This is a demo 1'));
cards.value.add(new BigCard(2, 10, 8, 'This is a demo 2'));
let c1 = new SmallCard(cards.value.index(1), '+', 1, 'This is a comment 1');
let c2 = new SmallCard(cards.value.index(0), '-', 1, 'This is a comment 2');
cards.value.index(1).subCards.push(c1);
cards.value.index(0).subCards.push(c2);

</script>

<script lang="ts">
export default {
  name: "AssignRightBar"
}

</script>

<style scoped>

.title-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8%;
  font-size: 32px;
}

</style>