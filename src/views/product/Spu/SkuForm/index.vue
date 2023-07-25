<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="Spu名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="Sku名称">
        <el-input placeholder="Sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格(描述)">
        <el-input
          placeholder="规格(描述)"
          rows="4"
          type="textarea"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form-item
          :label="attr.attrName"
          v-for="(attr, index) in AttrInfoList"
          :key="attr.id"
        >
          <el-select placeholder="请选择" v-model="attr.attrAndValueId">
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
              v-for="(attrValue, index) in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form-item
          :inline="true"
          :label="saleAttr.saleAttrName"
          v-for="(saleAttr, index) in SaleAttrList"
          :key="saleAttr.id"
        >
          <el-select placeholder="请选择" v-model="saleAttr.saleAttrAndValueId">
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            align="canter"
          ></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >添加默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveskuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 父组件传过来的数据
      spu: {
        spuId: 0,
        tmId: 0,
        spuName: "",
      },
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        skuDesc: "",
        price: 0,
        weight: "",
        skuDefaultImg: "",
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrValueId: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spuImageList: [],
      SaleAttrList: [],
      AttrInfoList: [],
    };
  },
  methods: {
    // 发送请求获取数据
    async addSkuForm(spu, category1Id, category2Id) {
      let result = await this.$API.Spu.reqspuImageList(spu.id);
      if (result.code == 200) {
        this.spuImageList = result.data;
        this.spuImageList.forEach((item) => {
          this.$set(item, "isDefault", 0);
        });
      }
      let result1 = await this.$API.Spu.reqSkuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.SaleAttrList = result1.data;
      }

      let result2 = await this.$API.Spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.id
      );

      if (result2.code == 200) {
        this.AttrInfoList = result2.data.slice(1);
      }
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu.spuName = spu.spuName;
    },
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    handleSelectionChange(imgArr) {
      this.skuInfo.skuImageList = imgArr;
    },
    cancel() {
      this.$emit("changeSkuView", 0);
      Object.assign(this._data, this.$options.data());
    },
    async saveskuInfo() {
      // 整理参数发送请求
      // 销售属性
      this.SaleAttrList.forEach((item) => {
        const saleAttrId = item.saleAttrAndValueId.split(":")[0];
        const saleAttrValueId = item.saleAttrAndValueId.split(":")[1];
        this.skuInfo.skuSaleAttrValueList.push({ saleAttrId, saleAttrValueId });
      });
      // 平台属性
      this.AttrInfoList.forEach((item) => {
        const attrId = item.attrAndValueId.split(":")[0];
        const valueId = item.attrAndValueId.split(":")[1];
        this.skuInfo.skuAttrValueList.push({ attrId, valueId });
      });
      let res = await this.$API.Spu.reqSaveSkuInfo(this.skuInfo);
      if (res.code == 200) {
        // 通知父组件把页面切换过来，重新熏染当前页面的数据
        this.$message({ type: "success", message: "添加sku成功" });
        this.$emit("changeSkuView", 0);
      }
    },
  },
};
</script>

<style>
</style>