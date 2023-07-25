<template>
  <div>
    <!-- 三级分类 -->
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getcategoryId="getcategoryId"
        :show="view !== 0"
      ></CategorySelect>
    </el-card>
    <!-- spu列表 -->
    <el-card>
      <div v-show="view == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpu()"
          :disabled="!category3Id"
          >添加Spu</el-button
        >
        <el-table border style="margin: 25px 0" :data="records">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column label="Spu名称" prop="spuName"></el-table-column>
          <el-table-column label="Spu描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-tooltip
                content="添加sku"
                effect="light"
                size="mini"
                placement="top"
              >
                <el-button
                  @click="addSku(row)"
                  type="success"
                  size="small"
                  icon="el-icon-plus"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="编辑spu"
                effect="light"
                size="mini"
                placement="top"
              >
                <el-button
                  @click="goEdit(row)"
                  type="warning"
                  size="small"
                  icon="el-icon-edit"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="Sku列表"
                effect="light"
                size="mini"
                placement="top"
              >
                <el-button
                  @click="goSkuList(row)"
                  type="info"
                  size="small"
                  icon="el-icon-info"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="删除spu"
                effect="light"
                size="mini"
                placement="top"
              >
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteSpu(row, $index)"
                  icon="el-icon-delete"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          align="center"
          style="margin-top: 20px"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          layout="prev, pager, next, ->,jumper, total"
          :total="total"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="view == 1" @changeView="changeView" ref="spuform" />
      <SkuForm
        v-show="view == 2"
        @changeSkuView="changeSkuView"
        ref="skuform"
      />
    </el-card>
    <!-- spu的sku弹出框显示 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="closeSkuList"
    >
      <el-table border :data="skuList" v-loading="loading">
        <el-table-column
          label="名称"
          width="150"
          prop="skuName"
        ></el-table-column>
        <el-table-column
          label="价格"
          width="200"
          prop="price"
        ></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 90px; height: 90px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { reqAddOrUpdateSpu } from "@/api/product/Spu";
import SkuForm from "@/views/product/Spu/SkuForm";
import SpuForm from "@/views/product/Spu/SpuForm";

export default {
  name: "Spu",
  data() {
    return {
      loading: true,
      view: 0, //用于三个页面的切换数字变量
      show: false,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 5,
      total: 2,
      records: [],
      dialogTableVisible: false,
      skuList: [],
      spu: {
        spuName: "",
      },
    };
  },

  components: {
    SpuForm,
    SkuForm,
  },
  methods: {
    // 获取到三级联动组件传过来的id
    getcategoryId({ categoryId, level }) {
      if (level === 1) {
        (this.category2Id = ""), (this.category3Id = "");
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 发送请求，获取spu列表
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let result = await this.$API.Spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
        this.limit = result.data.size;
      }
    },
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSpuList();
    },
    // 点击添加spu按钮，把category3Id传给子组件
    addSpu() {
      this.view = 1;
      this.$refs.spuform.addSpuForm(this.category3Id);
    },
    // 利用自定义事件接收子组件传递过来的值通知父组件里的view改为0，显示spu列表页面
    changeView({ view, flag }) {
      this.view = view;
      // console.log(flag);
      if (flag === "修改") {
        this.getSpuList();
      } else {
        this.getSpuList((this.page = 1));
      }
    },
    // 给子组件绑一个ref，实现父组件中获取到子组件然后调用子组件方法，把row通过参数传给子组件
    goEdit(row) {
      this.view = 1;
      this.$refs.spuform.editSpuForm(row);
    },
    // 发请求删除当前spu
    async deleteSpu(row, $index) {
      let result = await this.$API.Spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功啦" });
        // 重新渲染页面
        this.getSpuList();
      }
    },
    addSku(row) {
      this.view = 2;
      this.$refs.skuform.addSkuForm(row, this.category1Id, this.category2Id);
    },
    changeSkuView(view) {
      this.view = view;
    },
    // 点击弹出sku表格
    async goSkuList(row) {
      this.spu.spuName = row.spuName;
      this.dialogTableVisible = true;
      // 发请求获取sku列表数据
      let result = await this.$API.Spu.reqSkuList(row.id);
      if (result.code == 200) {
        this.loading = false;
        this.skuList = result.data;
      }
    },
    closeSkuList(done) {
      // 关闭前让loading重新变为true，清空数据，避免数据回显
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>