<template>
  <el-container type="flex" direction="vertical" style="height: 100vh;width: 100vw; overflow-x: hidden">
    <el-header style="height: 60px; background-color:  #F0F2F5;">
      <el-row :gutter="40">
        <el-col span="4">
          <el-button :icon="ArrowLeft" circle size="large" style="margin: 10px" />
        </el-col>
        <el-col span="2">
          <div/>
        </el-col>
        <el-col span="15">
        <h1>CS307 Assignment 1 Statistics</h1>
        </el-col>
      </el-row>
    </el-header>
    <el-main id='body' class="main" style="background-color:  #F0F2F5;width: 100%;overflow-x: hidden">
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="card-container" >
            <div class="card">
              <div class="card-header">
                <h2>Overview</h2>
              </div>
              <hr class="division"/>
              <div class="card-body" style="height: 633px">
                <table-container>
                  <h4 style="display: table; margin: 0 auto;">Statistical Information</h4>
                  <div id="table1"/>
                  <hr class="halfDivision"/>
                  <h4 style="display: table; margin: 0 auto;">Score Distribution</h4>
                  <div id="table2"/>
                </table-container>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="card-container">
            <div class="card">
              <div class="card-header">
                <h2>Score Distribution</h2>
              </div>
              <div class="card-body">
                <hr style="color: white"/>
                <div>
                <div id="figure2" style="width: 100%;height: 637px;"/>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="card-container">
            <div class="card">
              <div class="card-header">
                <h2>Score Detail</h2>
              </div>
              <hr class="division"/>
              <div class="card-body">
                <div id="figure1" style="width: 100%;height: 600px;"/>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang='ts' setup>
import {
  ArrowLeft
} from '@element-plus/icons-vue'
import {onMounted} from 'vue';
import {ECharts, EChartsOption, init} from 'echarts';
const colorList =[
  '#f7797d','#fbd786', '#c6ffdd',
]
const card_container ='style= "justify-content: space-around;  align-items: center; "';
const card ='style= "border-radius: 10px;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);backdrop-filter: blur(5px);background-color: rgba(255, 255, 255, 0.8);width: 100%;"';
const card_body ='style =  "width: 100%;"';
const card_head ='style = "padding: 18px;border-top-left-radius: 10px;border-top-right-radius: 10px;width: 100%;"'
const division = 'style = "width: 100% ;color: lightslategrey;"'


const problemData = [
    [
      {
        score :0,
        count :10,
      },
      {
        score :1,
        count :2,
      },
      {
        score :2,
        count :3,
      },
      {
        score :3,
        count :4,
      },
    ],
    [
      {
        score :0,
        count :9,
      },
      {
        score :1,
        count :4,
      },
      {
        score :2,
        count :6,
      },
      {
        score :3,
        count :10,
      },
      {
        score :4,
        count :9,
      },
      {
        score :5,
        count :4,
      },
      {
        score :6,
        count :6,
      },
      {
        score :7,
        count :10,
      },
      {
        score :8,
        count :6,
      },
      {
        score :9,
        count :10,
      },
      {
        score :10,
        count :6,
      },
      {
        score :11,
        count :10,
      },
      {
        score :12,
        count :6,
      },
      {
        score :13,
        count :10,
      },
    ]
]
const table1Data = [
  {
    type:'minimum',
    score: 90,
  },
  {
    type:'maximal',
    score: 94,
  },
  {
    type:'median',
    score: 91,
  },
  {
    type:'average',
    score: 92,
  },
]
const table2Data = [
  {
    interval:'100',
    count: 5,
  },
  {
    interval:'90-99',
    count: 6,
  },
  {
    interval:'80-89',
    count: 7,
  },
  {
    interval:'70-79',
    count: 8,
  },
  {
    interval:'60-69',
    count: 9,
  },
  {
    interval:'< 60',
    count: 10,
  },
]

function getTableHead(data: any): HTMLElement {
  const container = document.createElement('thead');
  for (const field in data[0]) {
    const th = document.createElement('th')
    th.innerText=field;
    container.appendChild(th)
  }
  return container
}
function getTableBody(data: any,height: number): HTMLElement {
  const container = document.createElement('tbody');
  for (let i = 0; i < data.length; ++i) {
    const tr= document.createElement('tr');
    const d = data[i];
    for (const field in d) {
      const td = document.createElement('td')
      td.setAttribute('title',d[field])
      td.innerText= d[field]
      tr.appendChild(td)
    }
    container.append(tr)
  }
  return container;
}
function getTable(data: any,height : number): HTMLElement {
  const container = document.createElement('div');
  const head = getTableHead(data);
  const body = getTableBody(data,height);
  const table = document.createElement('table');
  table.setAttribute('style',"margin-top: 10px;  border-collapse: collapse;  box-sizing: border-box;  width: 100%;  text-align: center;  border-collapse:separate;border-spacing:0px 10px;")
  if (height>0){
    container.setAttribute('style', 'overflow-y:auto;height:' + height + 'px')
  }
  table.appendChild(head)
  table.appendChild(body)
  container.appendChild(table)
  return container;
}
function getProblemDistribution(id: number):HTMLElement{
  const problem = document.createElement('div')
  problem.setAttribute('class','el-col el-col-6')
  problem.setAttribute('style', 'padding-right: 20px; padding-left: 20px;')
  problem.innerHTML = `
      <div ${card_container}>
        <div ${card}>
          <div ${card_head}>
            <h2>Problem ${id} Distribution</h2>
          </div>
          <hr ${division}/>
          <div ${card_body}>
            <div id="problem${id}Table" style="width: 100%;height:398px;"/>
          </div>
        </div>
      </div>
    `;
  return problem
}
function getProblemDetail(id: number):HTMLElement{
  const problem = document.createElement('div')
  problem.setAttribute('class','el-col el-col-18')
  problem.setAttribute('style', 'padding-right: 20px; padding-left: 20px;')
  problem.innerHTML = `
      <div ${card_container}>
        <div ${card}>
          <div ${card_head}>
            <h2>Problem ${id} Detail</h2>
          </div>
          <hr ${division}/>
          <div ${card_body}>
            <div  style="width: 100%;">
            <div id="problem${id}Figure" style="height:400px"/>
            </div>
          </div>
        </div>
      </div>
    `;

  return problem
}
function fillTableContent(id:number){
  const problem = 'problem'+id+'Table'
  const ele = document.getElementById(problem)
  if (ele == null)return
  ele.appendChild(getTable(problemData[id-1],350))
}
function getProblemFigure(id: number) {
  const str = 'problem' + id + 'Figure';
  const ele = document.getElementById(str) as HTMLElement;
  const myChart = echarts.init(ele);
  const data = [];
  for (const x in problemData[id-1]){
    data.push({name:problemData[id-1][x]['score'],value: problemData[id-1][x]['count']})
  }
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '2%',
      left: 'top',
      selectedMode: false
    },
    series: [
      {
        name: 'Score distribution',
        type: 'pie',
        top: '0%',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        // adjust the start angle
        label: {
          show: true,
          formatter: '{b} ({d}%)'
        },
        data: data,
        labelLine: {
          show: true
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }
    ],
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {}
      },
      right: '70px',
    }
  };


  myChart.setOption(option);
  window.addEventListener('resize', function () {
    myChart.resize();
  });
  return ele
}
import { createApp } from 'vue';
import * as echarts from 'echarts';



function fillFigureContent(id :number){
  getProblemFigure(id)
}

const addTable1 = () => {
  const ele = document.getElementById('table1') as HTMLElement
  if (ele == null)return
  ele.appendChild(getTable(table1Data,0))
}
const addTable2 = () => {
  const ele = document.getElementById('table2')
  if (ele == null)return
  ele.appendChild(getTable(table2Data,0))
}
const addFigure1 = () => {
  const ele = document.getElementById('figure1') as HTMLElement;
  const echart: ECharts = init(ele);
  const xData = [0,10,20,30,40,50,60,70,80,90,100]
  const preData = [1,2,3,4,10,20,30,40,80,90,100]
  const sufData = [100,99,98,97,96,90,80,70,60,20,10]
  const dataLen = xData.length
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Prefix Sum','Suffix Sum'],
      textStyle: {
        fontSize: 14,
        color: '#000'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      right: 40,
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Prefix Sum',
        type: 'line',
        data: preData,
        color: '#ffb0b0',
        symbolSize: 10,
        label: {
          show: true,
          position: 'top',
          fontFamily: 'Times New Roman',
        },
        itemStyle: {
          color: function (params) {
            const index=params.dataIndex
            const colorIndex=Math.floor(index*colorList.length/ dataLen)
            return colorList[colorIndex]
          }
        },
      },

      {
        name: 'Suffix Sum',
        type: 'line',
        data: sufData,
        color: '#6c968a',
        symbolSize: 10,
        label: {
          show: true,
          position: 'top',
          fontFamily: 'Times New Roman',
        },
        itemStyle: {
          color: function (params) {
            const index=params.dataIndex
            const colorIndex=Math.floor(index*colorList.length/ dataLen)
            return colorList[colorIndex]
          }
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
  const xData = ['Less than 60', '60-69', '70-79', '80-89', '90-99', '100']
  const yData= [24, 41, 22, 56, 21, 12]
  const dataLen = xData.length
  console.log(dataLen)
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
      right: 40,
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        seriesLayoutBy: 'column',
        type: 'bar',
        itemStyle: {
          color: function (params) {
            const index=params.dataIndex
            const colorIndex=Math.floor(index*colorList.length/ dataLen)
            return colorList[colorIndex]
          }
        },
        data: yData,
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

const addProblem = (id : number) =>{
  const ele = document.getElementById('body')
  if (ele == null)return

  const problem = document.createElement('div')
  problem.setAttribute('class','el-row')
  problem.setAttribute('style', 'margin-left: -20px; margin-right: -20px; margin-top: 20px;margin-bottom: 20px')
  const distribution = getProblemDistribution(id)
  const detail = getProblemDetail(id)
  problem.appendChild(distribution)
  problem.appendChild(detail)
  ele.appendChild(problem)

  fillTableContent(id)
  fillFigureContent(id)
}


onMounted(() => {
  addFigure1();
  addFigure2();
  addTable1();
  addTable2();
  addProblem(1);
  addProblem(2);
});

</script>

<script lang="ts">
export default {
  name: "View"
}
</script>

<style scoped>
.el-row {
  margin-bottom: 40px;
}
h1 {
  flex: 1;
  display: flex;
  justify-content: center;
  font-weight: bold;
  color: #000000;
  font-size: 25px;
  letter-spacing: 2px;
  text-align: center;
  line-height: 100%;
  outline: none;
  animation: animate 5s linear infinite;
  white-space: pre-line;
}

.main {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 95%;
  width: 100%;
  background-color: white;
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

.card-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  /*height: 100vh;*/
}

.card {
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
}

.card-header {
  padding: 18px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 100%;
}
.card-header h2 {
  margin: 0;
}
.card-body {
  width: 100%;
}
.division{
  width: 100% ;
  color: lightslategrey;
}
.halfDivision{
  width: 80% ;
  color: lightslategrey;

}

</style>
