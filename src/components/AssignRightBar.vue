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
      <div class="percent">
        <svg style="visibility: hidden">
          <circle cx="40" cy="40" r="40"></circle>
          <circle cx="40" cy="40" r="40"></circle>
        </svg>
        <div class="number">
          <h3>18 / 100</h3>
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
          {{ item.givenPoints.toFixed(2) }} /&ensp;
          <div contenteditable="true" @keydown="onlyNumberAndDecimal" @input="updateTotalPoints(item, $event)">
            {{ item.totalPoints.toFixed(2) }}
          </div>&ensp;POINTS
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
      <el-col :span="3">
        <el-icon style="font-size: 20px;margin-top: 100%;margin-left: -5%">
          <CirclePlusFilled/>
        </el-icon>
      </el-col>
    </el-row>
    <el-row class="sub-card-box" :class="{'active': item.isPullDown}" v-for="(sub, idx) in item.subCards">
      <el-row class="sub-card">
        <el-col :span="1"></el-col>
        <el-col :span="4">
          <li class="index-small" :class="{'active': sub.isSmallActive}" @click="activeIndex(sub)">
            {{ sub.questionIdx }}
          </li>
        </el-col>
        <el-col :span="17" style="height: 100%">
          <el-row class="adjust-point">{{ sub.sign }}{{ sub.points.toFixed(2) }}</el-row>
          <el-row class="adjust-comment">
            <el-input v-model="sub.comment" slot="content" :rows="1"
                      v-show="sub.isShowInput"
                      @change="hideInputSub(sub)"
                      @blur="hideInputSub(sub)"
                      placeholder="Please add the details"
            ></el-input>
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
const activeIndex = (sub: SmallCard) => {
  sub.isSmallActive = !sub.isSmallActive
}
const showInputSub = (sub: SmallCard) => {
  sub.isShowInput = true;
}
const hideInputSub = (sub: SmallCard) => {
  sub.isShowInput = false;
}
const removeSub = (item: BigCard, idx: number) => {
  item.subCards.splice(idx, 1);
  if (item.subCards.length === 0) {
    item.isPullDown = false;
  }
}
const onlyNumberAndDecimal = (e: { key: string; preventDefault: () => void; }) => {
  const reg = /^[0-9.]+$/;
  if (!reg.test(e.key)) {
    e.preventDefault();
  }
}
const updateTotalPoints = (item: BigCard, e: { target: { innerText: string; }; }) => {
  item.totalPoints = parseFloat(e.target.innerText);
}

let cards = ref(new UniqueList<BigCard>());
cards.value.add(new BigCard(1, 10, 8, 'This is a demo 1'));
cards.value.add(new BigCard(2, 10, 8, 'This is a demo 2'));
let c1 = new SmallCard(cards.value.index(1), 1, '+', 1, 'This is a comment 1');
let c2 = new SmallCard(cards.value.index(0), 1, '-', 1, 'This is a comment 2');
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