<template>
  <el-container type="flex" direction="vertical" style="height: 100vh;width: 100vw; overflow-x: hidden">
    <el-header style="height: 5%">
      <h1>CS307 Assignment 1 Statistics</h1>
    </el-header>
    <el-main class="main">
      <el-row style="width: 100%;">
        <el-col :span="4"></el-col>
        <el-col :span="16"  class="table-container">
          <table>
            <thead>
            <tr>
              <th>Problem</th>
              <th>Maximum</th>
              <th>Average</th>
              <th>Median</th>
              <th>Minimum</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Total</td>
              <td>91</td>
              <td>92</td>
              <td>93</td>
              <td>94</td>
            </tr>
            <tr>
              <td>Q1</td>
              <td>91</td>
              <td>92</td>
              <td>93</td>
              <td>94</td>
            </tr>
            <tr>
              <td>Q2</td>
              <td>91</td>
              <td>92</td>
              <td>93</td>
              <td>94</td>
            </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="4">
          <el-icon style="font-size: 30px">
            <Download/>
          </el-icon>
        </el-col>
      </el-row>
      <el-row style="width: 100%;margin-top: 20px;">
        <el-col :span="4"></el-col>
        <el-col :span="16">
          <div id="figure1" style="width: 100%;height: 600px;"/>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
      <el-row style="width: 100%;margin-top: 20px;">
        <el-col :span="4"></el-col>
        <el-col :span="16">
          <div id="figure2" style="width: 100%;height: 600px;"/>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang='ts' setup>
import {onMounted} from 'vue';
import {ECharts, EChartsOption, init} from 'echarts';
import {
  Download
} from '@element-plus/icons-vue'

function color16() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

const addFigure1 = () => {
  const ele = document.getElementById('figure1') as HTMLElement;
  const echart: ECharts = init(ele);
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Point'],
      textStyle: {
        fontSize: 14,
        color: '#F5FFFA'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Min', 'Average', 'Median', 'Max'],
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Point',
        type: 'line',
        stack: 'Total',
        data: [24, 78, 85, 100],
        color: 'red',
        label: {
          show: true,
          position: 'top',
          fontFamily: 'Times New Roman',
        },
      }
    ]
  };
  echart.setOption(option);
  window.addEventListener('resize', function () {
    echart.resize();
  });
}

const addFigure2 = () => {
  const ele = document.getElementById('figure2') as HTMLElement;
  const echart: ECharts = init(ele);
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['Less than 60', '60-69', '70-79', '80-89', '90-99', '100']
    },
    series: [
      {
        seriesLayoutBy: 'column',
        type: 'bar',
        itemStyle: {
          color: function () {
            return color16();
          }
        },
        data: [24, 41, 22, 56, 21, 12],
        label: {
          show: true,
          position: 'right',
          fontFamily: 'Times New Roman',
        },
      }
    ]
  };
  echart.setOption(option);
  window.addEventListener('resize', function () {
    echart.resize();
  });
}

onMounted(() => {
  addFigure1();
  addFigure2();
});

</script>

<script lang="ts">
export default {
  name: "View"
}
</script>

<style scoped>
h1 {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #fff;
  font-size: 20px;
  letter-spacing: 5px;
  text-transform: uppercase;
  text-align: center;
  line-height: 100%;
  outline: none;
  --c: lightseagreen;
  text-shadow: 0 0 10px var(--c),
  0 0 20px var(--c),
  0 0 40px var(--c),
  0 0 80px var(--c),
  0 0 160px var(--c);
  animation: animate 5s linear infinite;
  white-space: pre-line;
}

.main {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 95%;
  width: 100%;
  background-color: #03a9f4;
}

.table-container {
  overflow: hidden;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
}

.table-container table thead tr th {
  color: #fff;
  background-color: #4fc3a1;
}

.table-container table thead tr th:nth-child(odd) {
  background-color: #324960;
}

.table-container table thead tr th,
.table-container table tbody tr td {
  text-align: center;
  padding: 20px 40px;
}

.table-container table tbody tr td {
  border: 1px solid rgb(200, 200, 200);
}

.table-container table tbody tr:nth-child(odd) {
  background-color: #f8f8f8;
}
</style>