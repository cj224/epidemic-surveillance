<script setup lang="ts">
import bg from "./assets/bg.png";
import { useStore } from "./stores/counter";
import { onMounted, ref, type Ref, reactive, toRaw } from "vue";

import * as echarts from "echarts";
import "./assets/china.js"
import { geoCoordMap } from "./assets/geoMap"

const store = useStore();

const newCon: Ref<number> = ref(0);
const addCon: Ref<number> = ref(0);

const lineObj: any = ref();
const pieFObj: any = ref();

onMounted(async () => {
  await store.getList();
  newCon.value = store.chinaTotal?.total?.confirm - store.chinaTotal?.total?.dead - store.chinaTotal?.total?.heal;
  addCon.value = store.chinaTotal?.today?.confirm - store.chinaTotal?.today?.dead - store.chinaTotal?.today?.heal;
  initCharts();
  updateDate(initPie,1000*60);
  updateDate(initLine,1000*60);
})
const initLine = () => {
  if(!lineObj.value){
    lineObj.value = echarts.init(document.querySelector(".box-left-line") as HTMLElement);
  }
  lineObj.value.setOption({
    backgroundColor: "#0c3653",
    tooltip: {
      trigger: "axis"
    },
    xAxis: {
      type: 'category',
      data: store.chinaDetail.map((item: { name: string; }) => item.name),
      axisLine: {
        lineStyle: {
          color: "#fff"
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: "#fff"
        }
      }
    },
    label: {
      show: true
    },
    series: [
      {
        data: store.chinaDetail.map((item: { total: { confirm: number; }; }) => item.total.confirm),
        type: 'line',
        smooth: true
      }
    ]
  })
}
const initPie = () => {
  if(!pieFObj.value){
    pieFObj.value = echarts.init(document.querySelector(".box-left-pie") as HTMLElement);
  }
  let pieData = store.list.areaTree[2].children.slice(0).sort((a, b) => {
    return Math.random() > 0.5 ? -1 : 1;
  }).slice(0, 10);

  store.set_chinaDetail(pieData);

  pieFObj.value.setOption({
    backgroundColor: "#0c3653",
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
          }
        },
        data: store.chinaDetail.map((item: { name: string; total: { confirm: number; }; }) => {
          return {
            name: item.name,
            value: item.total.confirm
          }
        })
      }
    ]
  })
}
const initCharts = () => {
  const provinceList = store.list.areaTree[2].children;
  store.item = provinceList[7].children;
  console.log(provinceList);

  const data = provinceList.map(item => {
    if (item.name == "四川") {
      return {
        name: item.name,
        value: geoCoordMap[item.name].concat(item.total.confirm),
        children: item.children,
        selected: true,
      }
    }
    return {
      name: item.name,
      value: geoCoordMap[item.name].concat(item.total.confirm),
      children: item.children
    }
  })
  const charts = echarts.init(document.querySelector("#china") as HTMLElement);
  charts.setOption({
    geo: {
      map: "china",
      aspectScale: 0.8,
      layoutCenter: ["50%", "50%"],
      layoutSize: "100%",
      itemStyle: {
        //  normal: {
        areaColor: {
          type: "linear-gradient",
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#152E6E", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#0673AD", // 50% 处的颜色
            },
          ],
          global: true, // 缺省为 false
        },
        shadowColor: "#0f5d9d",
        shadowOffsetX: 0,
        shadowOffsetY: 15,
        opacity: 0.5,
        // },

      },
      emphasis: {
        areaColor: "#0f5d9d",
      },

      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            //normal: {
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            },
            //},
          },
          label: {
            show: false,
            color: "#FFFFFF",
            fontSize: 12,
          },
        },
      ],
    },
    series: [
      {
        type: "map",
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "100%",
        label: {
          show: true,
          color: "#FFFFFF",
          fontSize: 12,
        },
        itemStyle: {
          areaColor: "#0c3653",
          borderColor: "#1cccff",
          borderWidth: 1.8,
        },
        emphasis: {
          areaColor: "#56b1da",
          label: {
            show: true,
            color: "#fff",
          },
        },
        data: data,
      },
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        symbolSize: [45, 45],
        label: {
          show: true,
          color: "#fff",
          formatter(value: any) {
            return value.data.value[2]
          }
        },
        itemStyle: {
          color: '#1E90FF', //标志颜色
        },
        data: data,
      },
    ],
  })
  charts.on('click', (e: any) => {
    store.item = e.data.children
  })
}
const updateDate = (fn: Function, delay: number) => {
  fn();
  setInterval(() => {
      fn();
  }, delay)

}
</script>

<template>
  <div class="box" :style="{background:`url(${bg})`}">
    <div class="box-left">
      <ul class="box-left-list">
        <li>
          <p>境外输入</p>
          <p>{{store.chinaTotal?.total?.input}}</p>
          <p>较昨日<span>+{{store.chinaTotal?.today?.input}}</span></p>
        </li>
        <li>
          <p>无症状感染者</p>
          <p>{{store.chinaTotal?.extData?.noSymptom}}</p>
          <p>较昨日<span>+{{store.chinaTotal?.extData?.incrNoSymptom}}</span></p>
        </li>
        <li>
          <p>现有确诊</p>
          <p>{{newCon}}</p>
          <p>较昨日<span>+{{addCon}}</span></p>
        </li>
        <li>
          <p>累计确诊</p>
          <p>{{store.chinaTotal?.total?.confirm}}</p>
          <p>较昨日<span>+{{store.chinaTotal?.today?.confirm}}</span></p>
        </li>
        <li>
          <p>累计死亡</p>
          <p>{{store.chinaTotal?.total?.dead}}</p>
          <p>较昨日<span>+{{store.chinaTotal?.today?.dead}}</span></p>
        </li>
        <li>
          <p>累计治愈</p>
          <p>{{store.chinaTotal?.total?.heal}}</p>
          <p>较昨日<span>+{{store.chinaTotal?.today?.heal}}</span></p>
        </li>
      </ul>
      <div class="box-left-pie"></div>
      <div class="box-left-line"></div>
    </div>
    <div id="china" class="box-middle">
    </div>
    <div class="box-right">
      <table class="table">
        <thead>
          <tr>
            <th>地区</th>
            <th>新增确诊</th>
            <th>累计确诊</th>
            <th>治愈</th>
            <th>死亡</th>
          </tr>
        </thead>
        <TransitionGroup enter-active-class="animate__animated animate__fadeIn" tag="tbody">
          <tr v-for="(item,index) in store.item" :key="Math.ceil(Math.random()*index)+item.name">
            <td>{{item.name}}</td>
            <td>{{item.today.confirm}}</td>
            <td>{{item.total.confirm}}</td>
            <td>{{item.total.heal}}</td>
            <td>{{item.total.dead}}</td>
          </tr>
        </TransitionGroup>
      </table>
    </div>
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
}

html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

.box {
  display: flex;
  height: 100%;
  overflow: hidden;

  &-left {
    width: 400px;

    &-pie {
      height: 320px;
      margin-top: 20px;
    }

    &-line {
      height: 320px;
      margin-top: 20px;
    }

    &-list {
      color: #eee;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      text-align: center;

      li {
        background: #0c3653;
        width: 33.333%;
        box-sizing: border-box;
        padding: 10px;

        p:nth-child(1) {
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 20px;
          margin: 4px 0;
          color: #1d89dd;
        }

        p:nth-child(3) {
          font-size: 10px;

          span {
            color: #1d89dd;
          }
        }
      }
    }
  }

  &-middle {
    flex: 1;
  }

  &-right {
    width: 450px;
    overflow-y: auto;
    overflow-x: hidden;

    .table {
      width: 100%;
      border: 1px solid #eee;
      border-collapse: collapse;

      th,
      td {
        border: 1px solid #eee;
        text-align: center;
        color: #eee;
        background-color: #000000;
        padding: 4px 6px;
        white-space: nowrap;
      }
    }
  }
}
</style>
