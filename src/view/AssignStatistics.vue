<template>
  <el-container type="flex" direction="vertical" style="height: 100vh;width: 100vw; overflow-x: hidden">
    <el-header style="height: 60px; background-color:  #F0F2F5;">
      <el-row :gutter="40">
        <el-col span="4">
          <el-button :icon="ArrowLeft" @click="toAssign" circle size="large" style="margin: 10px"/>
        </el-col>
        <el-col span="2">
          <div/>
        </el-col>
        <el-col span="15">
          <h1>{{assignmentName}}</h1>
        </el-col>
      </el-row>
    </el-header>
    <el-main id='body' class="main" style="background-color:  #F0F2F5;width: 100%;overflow-x: hidden">
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="card-container">
            <div class="card">
              <div class="card-header">
                <h2>Overview</h2>
              </div>
              <hr class="division"/>
              <div class="card-body" style="height: 633px">
                <div class="table-container">
                  <h4 style="display: table; margin: 0 auto;">Statistical Information</h4>
                  <div id="table1">
                    <table class="table-container">
                      <thead>
                      <th>type</th>
                      <th>score</th>
                      </thead>
                      <tbody>
                      <tr v-for="(data1, idx) in table1Data">
                        <td>{{ data1.type }}</td>
                        <td>{{ data1.score }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <hr class="halfDivision"/>
                  <h4 style="display: table; margin: 0 auto;">Score Distribution</h4>
                  <div id="table2">
                    <table class="table-container">
                      <thead>
                      <th>type</th>
                      <th>score</th>
                      </thead>
                      <tbody>
                      <tr v-for="(data2, idx) in table2Data">
                        <td>{{ data2.interval }}</td>
                        <td>{{ data2.count }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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
      <el-row style="margin-top: 20px">
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
      <el-row v-for="(problem, idx) in problemData" style="margin: 20px -20px;">
        <el-col :span="6" style="padding-right: 20px; padding-left: 20px;">
          <div style="justify-content: space-around;  align-items: center; ">
            <div class="card">
              <div class="card-header">
                <h2>Problem {{ idx + 1 }} Distribution</h2>
              </div>
              <hr class="division"/>
              <div style="width: 100%">
                <div :id="'problem'+idx+'Table'" class="problem-table">
                  <table class="table-container">
                    <thead style="width: 100%">
                    <th>Score</th>
                    <th>Count</th>
                    </thead>
                    <tbody>
                    <tr v-for="(distribution, idx) in problem.distributions">
                      <td>{{ distribution.score }}</td>
                      <td>{{ distribution.count }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18" style="padding-right: 20px; padding-left: 20px;">
          <div style="justify-content: space-around;  align-items: center; ">
            <div class="card">
              <div class="card-header">
                <h2>Problem {{ idx + 1 }} Detail</h2>
              </div>
              <hr class="division"/>
              <div class="card-body">
                <div :id="'problem'+idx+'Figure'" style="height: 500px;"/>
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
import {onMounted, createApp, watch, nextTick, onBeforeMount, ref} from 'vue';
import {ECharts, EChartsOption, init} from 'echarts';
import * as echarts from 'echarts';
import {useRoute} from "vue-router";
import {useRouterPush} from "@/composable";
import {Problem, ScoreDistribution} from "@/store/statistics";
import {getStatisticalInformation, getScoreDistribution, getPrefixData, getSuffixData} from "@/composable/statistics";
import {Assignment, Submission} from "@/composable/serverRequest";
import '@/assets/style/local/statistics.css';

const route = useRoute();
const {routerPush} = useRouterPush();

const colorList = [
  '#f7797d', '#fbd786', '#c6ffdd',
]

const submissions = ref(JSON.parse(route.query.submissions as string) as Submission[]);
const [average, median, minimum, maximum] = getStatisticalInformation(submissions.value);
const scoreDistribution = getScoreDistribution(submissions.value);
const preData = getPrefixData(submissions.value);
const sufData = getSuffixData(submissions.value);
const assignments =JSON.parse(route.query.assignments as string) as Assignment[]
const assignmentName = assignments[parseInt(route.params.aid as string)].name

const problemData = ref([] as Problem[]);
let scoreMap = undefined as Map<number, number>[] | undefined;
submissions.value.forEach((value) => {
    const scoring = value.scoring;
    if (scoring !== null) {
        if (scoreMap === undefined) {
            scoreMap = [];
        }
        const metrics = scoring.metrics;
        let idx = 0;
        for (let mk in metrics) {
            scoreMap[idx] = scoreMap[idx] || new Map<number, number>();
            const metric = (metrics as any)[mk];
            if (scoreMap[idx].has(metric)) {
                scoreMap[idx].set(metric, scoreMap[idx].get(metric)! + 1);
            } else {
                scoreMap[idx].set(metric, 1);
            }
            idx++;
        }
    }
})
scoreMap?.forEach((value, idx) => {
    const distributions = [] as ScoreDistribution[];
    value.forEach((count, score) => {
        distributions.push(new ScoreDistribution(score, count));
    })
    distributions.sort((x,y)=>-x.score+y.score)
    problemData.value.push(new Problem(distributions));
})


const table1Data = ref([
  {
    type: 'average',
    score: average,
  },
  {
    type: 'median',
    score: median,
  },
  {
    type: 'minimum',
    score: minimum,
  },
  {
    type: 'maximum',
    score: maximum,
  },
])
const table2Data = [
  {
    interval: '≥ 100',
    count: scoreDistribution.get('≥ 100'),
  },
  {
    interval: '90-99',
    count: scoreDistribution.get('90-99'),
  },
  {
    interval: '80-89',
    count: scoreDistribution.get('80-89'),
  },
  {
    interval: '70-79',
    count: scoreDistribution.get('70-79'),
  },
  {
    interval: '60-69',
    count: scoreDistribution.get('60-69'),
  },
  {
    interval: '< 60',
    count: scoreDistribution.get('< 60'),
  },
]

function getProblemFigure(id: number) {
  const str = 'problem' + id + 'Figure';
  const ele = document.getElementById(str) as HTMLElement;
  const myChart = echarts.init(ele);
  const data = [];
  let problem = problemData.value[id];
  for (const x in problem.distributions) {
    data.push({
      name: problem.distributions[x].score,
      value: problem.distributions[x].count
    })
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

const addFigure1 = () => {
  const ele = document.getElementById('figure1') as HTMLElement;
  const echart: ECharts = init(ele);
  const xData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, '≥ 100']
  const dataLen = xData.length
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Prefix Sum', 'Suffix Sum'],
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
            const index = params.dataIndex
            const colorIndex = Math.floor(index * colorList.length / dataLen)
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
            const index = params.dataIndex
            const colorIndex = Math.floor(index * colorList.length / dataLen)
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
  const xData = ['< 60', '60-69', '70-79', '80-89', '90-99', '≥ 100']
  const yData = [scoreDistribution.get('< 60') as number, scoreDistribution.get('60-69') as number, scoreDistribution.get('70-79') as number,
    scoreDistribution.get('80-89') as number, scoreDistribution.get('90-99') as number, scoreDistribution.get('≥ 100') as number]
  const dataLen = xData.length
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
            const index = params.dataIndex
            const colorIndex = Math.floor(index * colorList.length / dataLen)
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

onMounted(async () => {
  await nextTick();
  addFigure1();
  addFigure2();
  for (let i = 0; i < problemData.value.length; i++) {
    getProblemFigure(i);
  }
});

const toAssign = () => {
  let cid = route.params.cid;
  let aid = route.params.aid;
  routerPush({name: 'teacherAssign', params: {cid: cid, aid: aid},
  query: {...route.query}});
}

</script>

<script lang="ts">
export default {
  name: "View"
}
</script>
