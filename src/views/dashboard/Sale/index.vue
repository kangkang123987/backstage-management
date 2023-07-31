<template>
  <div>
    <el-card class="box-card" style="margin: 15px 0">
      <div slot="header" class="clearfix">
        <!-- @tab-click="handleClick" -->
        <el-tabs v-model="activeName" class="header_left">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="header_right">
          <!-- v-model="value2" -->
          <div>
            <span><a @click="setToday">今日</a></span>
            <span><a @click="setWeek">本周</a></span>
            <span><a @click="setMonth">本月</a></span>
            <span><a @click="setYear">今年</a></span>
            <!-- :picker-options="pickerOptions" -->
            <el-date-picker
              v-model="date"
              class="dateselect"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="middlechart">
        <el-row>
          <el-col :span="17"
            ><div
              v-if="activeName === 'sale'"
              class="chart"
              ref="saleMsg"
              style="width: 1100px; height: 500px"
            ></div>
            <div
              v-else
              ref="visitMsg"
              style="width: 1100px; height: 500px"
            ></div>
          </el-col>
          <el-col :span="7">
            <h3>门店{{ title }}排名</h3>
            <el-table
              style="width: 100%"
              :data="title == '销售额' ? listData.orderRank : listData.userRank"
            >
              <el-table-column prop="no" label="排名" width="180">
              </el-table-column>
              <el-table-column prop="name" label="门店" width="180">
              </el-table-column>
              <el-table-column prop="money" label="数据"> </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script >
import dayjs from "dayjs";
import { mapState } from "vuex";
import echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      activeName: "sale",
      mychart: null,
      date: [],
    };
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.saleMsg);
    this.mychart.setOption({
      title: {
        text: "销售量趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        type: "category",
        data: [],
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {},
      series: {
        type: "bar",
        data: [],
        itemStyle: {
          color: "orange",
        },
      },
      grid: {
        containLabel: true,
        left: 0,
        top: 45,
        right: 0,
        bottom: 20,
      },
    });
  },
  computed: {
    title() {
      return this.activeName === "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listData: (state) => state.home.list,
    }),
  },
  //  监听activeName和listData，只有发生变化就获取柱状图这个实例才，，重新进行柱状图中的title和data的配置
  watch: {
    activeName() {
      this.mychart.setOption({
        title: {
          text: this.title + "趋势",
        },
        // 只要一变化，一切换就渲染显示不同数据
        xAxis: {
          type: "category",
          data:
            this.activeName == "sale"
              ? this.listData.orderFullYearAxis
              : this.listData.userFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: {
          type: "bar",
          data:
            this.activeName == "sale"
              ? this.listData.orderFullYear
              : this.listData.userFullYear,
          itemStyle: {
            color: "orange",
          },
        },
      });
    },
    listData() {
      this.mychart.setOption({
        title: {
          text: "销售额趋势",
        },
        xAxis: {
          type: "category",
          data: this.listData.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: {
          type: "bar",
          data: this.listData.orderFullYear,
          itemStyle: {
            color: "orange",
          },
        },
      });
    },
  },
  methods: {
    // 获取绑定今天日期
    setToday() {
      const today = dayjs().format("YYYY-MM-DD");
      this.date = [today, today];
    },
    // 获取绑定本周时间
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.header_left {
  width: 100%;
}
.header_right {
  position: absolute;
  right: 0px;
}
.header_right span {
  margin: 0 10px;
}
.header_right span:hover {
  color: #409eff;
}
.dateselect {
  margin-left: 20px;
  width: 280px;
}
.middlechart ul li {
  margin: 40px 0;
  font-size: 20px;
}
</style>