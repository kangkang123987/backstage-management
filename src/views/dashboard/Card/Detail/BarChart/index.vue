<template>
  <div ref="bar" style="width: 350px; height: 80px"></div>
</template>

<script>
import echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      myBarChart: null,
    };
  },
  mounted() {
    this.myBarChart = echarts.init(this.$refs.bar);
    this.myBarChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "bar",
        data: [],
        itemStyle: {
          color: "skyblue",
        },
      },
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
      payTrend: (state) => state.home.list.payTrend,
    }),
  },
  watch: {
    payTrend() {
      this.myBarChart.setOption({
        series: {
          type: "bar",
          data: this.payTrend,
          itemStyle: {
            color: "skyblue",
          },
        },
      });
    },
  },
};
</script>

<style>
</style>