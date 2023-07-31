<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix_category">
      <div class="category_header">
        <span>销售额类别占比</span>
        <el-radio-group class="radio_group" v-model="radio">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div ref="chart" class="chart"></div>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      radio: "全部渠道",
      mypiechart: null,
    };
  },
  mounted() {
    this.mypiechart = echarts.init(this.$refs.chart);
    this.mypiechart.setOption({
      title: {
        text: "视频广告",
        subtext: "1048",
        top: "center",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "销售额类别",
          type: "pie",
          radius: ["40%", "70%"],
          //   avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 30,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            fontSize: 17,
            show: true,
            position: "outside",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频广告" },
            { value: 735, name: "联盟广告" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "直接访问" },
            { value: 300, name: "搜索引擎" },
          ],
        },
      ],
    });
    // 绑定事件
    this.mypiechart.on("mouseover", (params) => {
      // 解构响应的name和value
      const { name, value } = params.data;
      this.mypiechart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
  computed: {
    ...mapState({
      listData: (state) => state.home.list,
    }),
    // 计算饼图的数据
    onlinedata() {
      const { name, value } = this.listData.saleRank.online;
      const onlinedata = [];
      for (let i = 0; i < value.length; i++) {
        onlinedata.push({ value: value[i], name: name[i] });
      }
      return onlinedata;
    },
    shoplinedata() {
      const { name, value } = this.listData.saleRank.shop;
      value.pop();
      const shoplinedata = [];
      for (let i = 0; i < value.length; i++) {
        shoplinedata.push({ value: value[i], name: name[i] });
      }
      return shoplinedata;
    },
  },
  watch: {
    radio() {
      if (this.radio == "线上") {
        this.mypiechart.setOption({
          series: [
            {
              name: "销售额类别",
              type: "pie",
              radius: ["40%", "70%"],
              //   avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 30,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                fontSize: 17,
                show: true,
                position: "outside",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: true,
              },
              data: this.onlinedata,
            },
          ],
        });
      } else if (this.radio == "门店") {
        this.mypiechart.setOption({
          series: [
            {
              name: "销售额类别",
              type: "pie",
              radius: ["40%", "70%"],
              //   avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 30,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                fontSize: 17,
                show: true,
                position: "outside",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: true,
              },
              data: this.shoplinedata,
            },
          ],
        });
      } else {
        this.mypiechart.setOption({
          series: [
            {
              name: "销售额类别",
              type: "pie",
              radius: ["40%", "70%"],
              //   avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 30,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                fontSize: 17,
                show: true,
                position: "outside",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: true,
              },
              data: [
                { value: 1048, name: "视频广告" },
                { value: 735, name: "联盟广告" },
                { value: 580, name: "邮件营销" },
                { value: 484, name: "直接访问" },
                { value: 300, name: "搜索引擎" },
              ],
            },
          ],
        });
      }
    },
  },
};
</script>

<style >
.clearfix_category {
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}
.category_header {
  display: flex;
  justify-content: space-between;
  padding-top: 3px 0;
  align-items: center;
}
.radio_group {
  margin-top: 5px;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>