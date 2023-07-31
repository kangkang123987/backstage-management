<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix_search">
        <div class="search_header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more-outline"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="linechart">
        <el-row>
          <el-col :span="12">
            <LineChart
              searchCount="搜索用户数"
              :visitTrend="listData.visitTrend"
            ></LineChart>
          </el-col>
          <el-col :span="12">
            <LineChart
              searchCount="人均搜索次数"
              :visitTrend="listData.visitTrend"
            ></LineChart>
          </el-col>
        </el-row>
      </div>
      <div class="search_bottom">
        <el-table
          :data="listData.searchWord"
          border
          style="width: 100%"
          :default-sort="{ prop: '', order: '' }"
        >
          <el-table-column label="排名" type="index" width="55" align="center">
          </el-table-column>
          <el-table-column label="搜索关键字" prop="word"> </el-table-column>
          <el-table-column label="用户数" sortable width="180" prop="user">
          </el-table-column>
          <el-table-column label="周涨幅" sortable width="180" prop="count">
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next,total"
          :total="total"
          class="pagination"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LineChart from "./LineChart";
export default {
  name: "",
  data() {
    return {
      searchWord: [],
    };
  },
  components: {
    LineChart,
  },
  computed: {
    ...mapState({
      listData: (state) => state.home.list,
    }),
    total() {
      this.searchWord = this.listData.searchWord || [];
      return this.searchWord.length;
    },
  },
};
</script>

<style >
.clearfix_search {
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
}
.search_header {
  font-size: 18px;
  display: flex;
  justify-content: space-between;
}
.search_bottom {
  margin-top: 20px;
}
.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>