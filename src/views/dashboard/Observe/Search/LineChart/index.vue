<template>
  <div>
    <div class="header">
      <span class="search_users">{{ searchCount }}</span
      ><svg
        t="1690281220366"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1796"
        width="20"
        height="20"
      >
        <path
          d="M169.984 169.984C-19.456 358.4-19.456 665.6 169.984 854.016s495.616 189.44 684.032 0 189.44-495.616 0-684.032-495.616-189.44-684.032 0z m606.208 606.208c-146.432 146.432-384 146.432-530.432 0S99.328 392.192 245.76 245.76s384-146.432 530.432 0c147.456 147.456 147.456 385.024 0 530.432zM456.704 306.176c0-40.96 33.792-73.728 74.752-73.728S605.184 266.24 604.16 307.2c0 40.96-33.792 74.752-73.728 73.728-40.96-1.024-74.752-34.816-73.728-74.752z m179.2 423.936c-2.048 6.144-6.144 13.312-10.24 17.408-26.624 27.648-59.392 43.008-97.28 44.032-18.432 0-35.84 0-54.272-3.072-29.696-4.096-67.584-40.96-61.44-79.872l12.288-79.872 24.576-138.24c0-3.072 1.024-6.144 1.024-9.216 0-19.456-6.144-26.624-25.6-28.672-8.192-1.024-16.384-2.048-24.576-4.096-9.216-3.072-13.312-11.264-13.312-18.432 1.024-8.192 6.144-13.312 16.384-15.36 5.12-1.024 11.264-1.024 16.384-1.024h139.264c17.408 0 27.648 8.192 27.648 25.6 0 14.336-2.048 28.672-5.12 43.008-9.216 53.248-19.456 105.472-28.672 158.72-3.072 17.408-7.168 34.816-9.216 52.224-1.024 8.192 0 17.408 2.048 25.6 3.072 11.264 11.264 17.408 22.528 15.36 9.216-1.024 18.432-4.096 27.648-8.192 7.168-3.072 13.312-8.192 20.48-10.24 13.312-5.12 22.528 3.072 19.456 14.336z"
          fill="#bfbfbf"
          p-id="1797"
        ></path>
      </svg>
    </div>
    <div class="number">
      <span class="number_left">23453</span>
      17.1<svg
        t="1690340089277"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5180"
        width="20"
        height="15"
      >
        <path
          d="M512 0l341.333333 349.354667-273.066666-0.085334V1024H443.733333V349.269333H170.666667L512 0z"
          fill="#EA4524"
          p-id="5181"
        ></path></svg
      ><svg
        t="1690340304504"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="9812"
        width="20"
        height="15"
      >
        <path
          d="M512 1024L170.666667 674.645333l273.066666 0.085334V0h136.533334v674.730667H853.333333L512 1024z"
          fill="#1afa29"
          p-id="9813"
        ></path>
      </svg>
    </div>
    <div ref="searchline" style="width: 100%; height: 100px"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      myLineChart: null,
    };
  },
  props: ["searchCount", "visitTrend"],
  mounted() {
    this.myLineChart = echarts.init(this.$refs.searchline);
    this.myLineChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "line",
          smooth: true,
          data: [],
          //   拐点样式，
          itemStyle: {
            // 取消拐点样式
            opacity: 0,
          },
          //   线条颜色
          lineStyle: {
            color: "purple",
          },
          areaStyle: {
            color: {
              // 渐变色
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
  watch: {
    visitTrend() {
      this.myLineChart.setOption({
        series: [
          {
            type: "line",
            smooth: true,
            data: this.visitTrend,
            //   拐点样式，
            itemStyle: {
              // 取消拐点样式
              opacity: 0,
            },
            //   线条颜色
            lineStyle: {
              color: "purple",
            },
            areaStyle: {
              color: {
                // 渐变色
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "purple", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "white", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.search_users {
  margin-right: 20px;
  font-size: 20px;
}
.number_left {
  margin-right: 20px;
  font-size: 20px;
}
</style>