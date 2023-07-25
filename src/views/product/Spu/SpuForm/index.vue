<template>
  <div>
    <el-form label-width="80px" v-model="spuList">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuList.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuList.tmId">
          <el-option
            :value="tm.id"
            :label="tm.tmName"
            v-for="(tm, index) in TradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          placeholder="SPU描述"
          type="textarea"
          rows="5"
          v-model="spuList.description"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handelSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unselected.length}未被选择`"
          v-model="unAttrIdAndName"
        >
          <el-option
            :label="unselectedAttr.name"
            :value="`${unselectedAttr.id}:${unselectedAttr.name}`"
            v-for="(unselectedAttr, index) in unselected"
            :key="unselectedAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!unAttrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-table border :data="spuList.spuSaleAttrList">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row, tag, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="spuList.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //要提交到服务的所有spu信息
      spuList: {
        category3Id: 0,
        description: "",
        tmId: "",
        spuName: "",
        spuImageList: [],
        spuSaleAttrList: [
          // {
          //   // baseSaleAttrId: 0,
          //   // id: 0,
          //   // saleAttrName: "",
          //   // spuId: 0,
          //   // spuSaleAttrValueList: [],
          // },
        ],
      },
      unAttrIdAndName: "", //未被选的属性id和名称存储在这
      TradeMarkList: [], //品牌列表
      spuImageList: [], //Sku图片
      saleAttrList: [], //全部的销售属性
    };
  },
  computed: {
    // 计算未被选择的属性个数
    unselected() {
      // item:每一个属性，item2选中商品的每一个属性，如果不重复 说明未被选择 就要返回它，
      let result = this.saleAttrList.filter((item) => {
        return this.spuList.spuSaleAttrList.every((item2) => {
          return item.name != item2.saleAttrName; //返回布尔值
        });
      });
      return result; //filter返回一个符合条件筛选出来的数组
    },
  },
  methods: {
    // 在点击删除图片后收集剩余的图片列表就是fileList，file是当前删除的图片信息
    // 暂时先收集到 spuImageList
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    // 文件上传成功时的钩子,// 添加成功后收集所有的图片信息列表就是filelist;res是成功返回的提示，file是当前添加的图片信息，
    handelSuccess(res, file, filelist) {
      this.spuImageList = filelist;
      filelist.forEach((item) => {
        if (!item.imgName) {
          item.imgUrl = item.url = res.data;
          item.imgName = item.name;
        }
      });
      console.log(filelist);
      this.spuList.spuImageList = filelist;
    },
    // 图片放大预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 子组件获取到父组件传过来的当前点击编辑的对象，在这里发请求
    async editSpuForm(spuform) {
      let SpuResult = await this.$API.Spu.reqSpu(spuform.id);
      if (SpuResult.code == 200) {
        this.spuList = SpuResult.data;
      }
      let TradeMarkListResult = await this.$API.Spu.reqTradeMarkList();
      if (TradeMarkListResult.code == 200) {
        this.TradeMarkList = TradeMarkListResult.data;
      }
      let SpuImageListResult = await this.$API.Spu.reqSpuImageList(spuform.id);
      if (SpuImageListResult.code == 200) {
        // 因为照片墙上传的文件列表中是name和url字段，跟服务器返回的不一样，所以要先操作一下
        let imgArr = SpuImageListResult.data;
        imgArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = imgArr;
      }
      let SaleAttrListResult = await this.$API.Spu.reqSaleAttrList();
      if (SaleAttrListResult.code == 200) {
        this.saleAttrList = SaleAttrListResult.data;
      }
    },
    // 在点击添加属性后把收集到的unAttrIdAndName进行分割，push进spuSaleAttrList里面
    addSaleAttr() {
      const newAttr = {};
      newAttr.baseSaleAttrId = this.unAttrIdAndName.split(":")[0];
      newAttr.saleAttrName = this.unAttrIdAndName.split(":")[1];
      newAttr.spuSaleAttrValueList = [];
      this.spuList.spuSaleAttrList.push(newAttr);
      this.unAttrIdAndName = "";
    },
    // 给每个销售属性对象上都设置响应式的属性inputVisible，inputValue，自己控制自己的
    // console.log(row);
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // input失去焦点后，收集inputValue和baseSaleAttrId,pushj进销售属性值的数组里面
    handleInputConfirm(row) {
      const newSaleAttrValue = {
        saleAttrValueName: row.inputValue,
        baseSaleAttrId: row.baseSaleAttrId,
      };
      row.spuSaleAttrValueList.push(newSaleAttrValue);

      // 判断空的和重复数据并提醒用户;
      if (row.inputValue === "") {
        this.$message({
          type: "warning",
          message: "输入内容不能为空，请重新输入",
        });
        this.$refs.saveTagInput.$refs.input.focus();
        return;
      }
      row.inputVisible = false;

      // let result = row.spuSaleAttrValueList.every((item) => {
      //   item.saleAttrValueName !== row.inputValue;
      // });
      // if (result == false) {
      //   this.$message({
      //     type: "warning",
      //     message: "不能输入重复内容，请重新输入",
      //   });
      //   this.$refs.saveTagInput.$refs.input.focus();
      //   return;
      // }
    },
    // 删除tag操作
    handleClose(row, tag, index) {
      // console.log(row, tag, index);
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //保存按钮发请求
    async addOrUpdateSpu() {
      let result = await this.$API.Spu.reqAddOrUpdateSpu(this.spuList);
      console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功咯" });
        this.$emit("changeView", {
          view: 0,
          flag: this.spuList.id ? "修改" : "添加",
        });
      }
    },
    //  发请求获取销售属性和品牌列表
    async addSpuForm(category3Id) {
      Object.assign(this._data, this.$options.data());
      this.spuList.category3Id = category3Id;

      let TradeMarkListResult = await this.$API.Spu.reqTradeMarkList();
      if (TradeMarkListResult.code == 200) {
        this.TradeMarkList = TradeMarkListResult.data;
      }
      let SaleAttrListResult = await this.$API.Spu.reqSaleAttrList();
      if (SaleAttrListResult.code == 200) {
        this.saleAttrList = SaleAttrListResult.data;
      }
    },
    // 点击取消，清空数据
    cancel() {
      this.$emit("changeView", { view: 0, flag: "" });
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>