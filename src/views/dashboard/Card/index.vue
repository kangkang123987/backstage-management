<template>
  <div>
    <el-row>
      <el-col :span="6"
        ><el-card style="height: 220px; width: 400px"
          ><Detail title="总销售额" :count="`${listData.salesTotal}元`">
            <template slot="chart">
              <span style="line-height: 60px"
                >月同比 {{ listData.salesGrowthLastMonth }}%<svg
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
              ></span>
              &nbsp;
              <span
                >日同比 {{ listData.salesGrowthLastDay }}%<svg
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
                  ></path></svg
              ></span>
            </template>
            <template slot="foot">
              <span>日销售额{{ listData.salesToday }}元</span>
            </template>
          </Detail></el-card
        ></el-col
      >
      <el-col :span="6"
        ><el-card style="height: 220px; width: 400px"
          ><Detail title="访问量" :count="`${listData.visitTotal}`">
            <template slot="chart">
              <LineChart></LineChart>
            </template>
            <template slot="foot">
              <span>日访问量{{ listData.visitToday }}</span>
            </template>
          </Detail></el-card
        ></el-col
      >
      <el-col :span="6"
        ><el-card style="height: 220px; width: 400px"
          ><Detail title="支付笔款" :count="`${listData.payTotal}元`">
            <template slot="chart">
              <BarChart></BarChart>
            </template>
            <template slot="foot">
              <span>转化率{{ listData.payRate }}%</span>
            </template>
          </Detail></el-card
        ></el-col
      >
      <el-col :span="6"
        ><el-card style="height: 220px; width: 400px"
          ><Detail title="运营活动效果" :count="`${listData.activityRate}%`">
            <template slot="chart">
              <el-progress :percentage="listData.activityRate"></el-progress>
            </template>
            <template slot="foot">
              <span>月同比 {{ listData.activityGrowthLastMonth }}%</span>
              <svg
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
                ></path>
              </svg>
              &nbsp;
              <span>日同比 {{ listData.activityGrowthLastDay }}%</span>
              <svg
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
            </template> </Detail></el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail/index.vue";
import LineChart from "./Detail/LineChart/index.vue";
import BarChart from "./Detail/BarChart/index.vue";
import { mapState } from "vuex";
export default {
  name: "Card",
  components: {
    Detail,
    LineChart,
    BarChart,
  },
  computed: {
    ...mapState({
      listData: (state) => state.home.list,
    }),
  },
};
</script>

<style>
</style>