<template>
  <div>
    <el-table border :data="records">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="90"
      ></el-table-column>
      <el-table-column
        label="名称"
        prop="skuName"
        width="230"
      ></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="150">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 90px; height: 90px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(KG)"
        width="100"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        width="120"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-tooltip
            content="上架"
            placement="top"
            effect="light"
            v-if="row.isSale == 1"
          >
            <el-button
              type="success"
              icon="el-icon-top"
              size="small"
              @click="onSale(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="下架" placement="top" effect="light" v-else>
            <el-button
              @click="cancelSale(row)"
              type="success"
              icon="el-icon-bottom"
              size="small"
            ></el-button>
          </el-tooltip>

          <el-tooltip content="编辑" placement="top" effect="light">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="查看详情" placement="top" effect="light">
            <el-button
              type="info"
              icon="el-icon-info"
              size="small"
              @click="showDrwer(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <el-button
              @click="deleteSku(row)"
              type="danger"
              icon="el-icon-delete"
              size="small"
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
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="40%">
      <el-row>
        <el-col :span="4">名称:</el-col>
        <el-col :span="16" class="con">{{ sku.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">描述:</el-col>
        <el-col :span="16" class="con">{{ sku.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">价格:</el-col>
        <el-col :span="16" class="con">{{ sku.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">平台属性:</el-col>
        <el-col :span="16" class="con">
          <el-tag
            style="margin-right: 8px"
            type="success"
            v-for="(skuAttr, index) in sku.skuAttrValueList"
            :key="skuAttr.id"
            >{{ skuAttr.attrId }}—{{ skuAttr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">商品图片:</el-col>
        <el-col :span="16" class="con">
          <div class="block">
            <el-carousel
              trigger="click"
              height="400px"
              style="width: 500px"
              :autoplay="true"
            >
              <el-carousel-item
                v-for="(img, index) in sku.skuImageList"
                :key="img.id"
              >
                <img
                  :src="img.imgUrl"
                  style="width: 100%; height: 100%; text-align: center"
                />
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      drawer: false,
      page: 1,
      limit: 5,
      total: 2,
      records: [],
      sku: {},
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList() {
      const { page, limit } = this;
      // 发请求获取列表数据
      let result = await this.$API.Sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSkuList();
    },
    // 点击上架发起请求
    async onSale(row) {
      let result = await this.$API.Sku.reqOnSale(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "上架成功" });
        row.isSale = 0;
      }
    },
    // 点击下架发起请求
    async cancelSale(row) {
      let result = await this.$API.Sku.reqCancelSale(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "下架成功" });
        row.isSale = 1;
      }
    },
    async showDrwer(row) {
      this.sku = {};
      this.drawer = true;
      // 发请求获取抽屉里的sku数据
      let result = await this.$API.Sku.reqSkuDrawer(row.id);
      if (result.code == 200) {
        this.sku = result.data;
      }
    },
    // 删除sku
    async deleteSku(row) {
      let result = await this.$API.Sku.reqDeleteSku(row.id);
      if (result.code == 200) {
        this.getSkuList();
      }
    },
  },
};
</script>

<style>
.el-col {
  font-size: 20px;
  text-align: right;
  margin-left: 50px;
}
.el-row {
  margin: 50px 10px;
}
.el-row .con {
  text-align: left;
}
</style>


<!-- 轮播图的样式 -->
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>