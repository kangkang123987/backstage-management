<template>
  <div ref="line" style="width: 350px; height: 80px"></div>
</template>

<script>
import { mapState } from "vuex";
import * as echarts from "echarts";
export default {
  name: "LineChart",
  data() {
    return {
      myLineChart: null,
    };
  },
  //   初始化折线图
  mounted() {
    this.myLineChart = echarts.init(this.$refs.line);
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
        left: 9,
        top: 9,
        right: 9,
        bottom: 0,
      },
    });
  },
  computed: {
    ...mapState({
      visitTrend: (state) => state.home.list.visitTrend,
    }),
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
</style>