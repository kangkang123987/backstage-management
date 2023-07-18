<template>
  <div>
    <div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 5px"
        @click="addTradeMark"
        >添加</el-button
      >
      <el-table border style="margin-top: 25px" :data="records">
        <el-table-column label="序号" align="center" width="100px" type="index">
        </el-table-column>
        <el-table-column label="品牌名称" prop="tmName"> </el-table-column>
        <el-table-column label="品牌LOGO">
          <template slot-scope="{ row }">
            <!-- 利用作用域插槽里面，row返回数组里面的每一个对象，index是数组索引值 -->
            <img :src="row.logoUrl" alt="" width="100px" height="80px" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 利用插槽给两个不同操作的按钮 -->
          <template slot-scope="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              @click="modifyTradeMark(row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteTradeMark(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        style="margin-top: 20px; text-align: center"
        :total="total"
        :page-sizes="[3, 5, 9]"
        :page-size="limit"
        :current-page="page"
        :pager-count="7"
        @current-change="handleChangePage"
        layout="prev, pager, next, ->,jumper, total"
      ></el-pagination>
      <!-- 弹出框 -->
      <el-dialog :title="addOrUpdatetip" :visible.sync="dialogFormVisible">
        <el-form :model="tmMsg" :rules="rules" ref="tmMsg">
          <el-form-item label="品牌名称" label-width="100px" prop="tmName">
            <el-input
              autocomplete="off"
              style="width: 60%"
              v-model="tmMsg.tmName"
            ></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
            <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="tmMsg.logoUrl" :src="tmMsg.logoUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件,且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddOrModifyTradeMark"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1,
      limit: 4,
      records: [],
      total: 3,
      dialogFormVisible: false,
      addOrUpdatetip: "",
      tmMsg: {
        logoUrl: "",
        tmName: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        logoUrl: { required: true, message: "请上传品牌图片" },
      },
    };
  },
  mounted() {
    // 一挂载就执行获取品牌列表请求
    this.getTradeList();
  },
  methods: {
    // 获取品牌列表的请求
    async getTradeList() {
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeList(page, limit);
      // console.log(result);
      if (result.code == 200) {
        (this.records = result.data.records), (this.total = result.data.total);
      }
    },
    // 当前页改变时调用，获取当前页码修改data里的数据，重新渲染页面
    handleChangePage(pager = 1) {
      this.page = pager;
      this.getTradeList();
    },
    // 点击添加让弹出框展示
    addTradeMark() {
      this.addOrUpdatetip = "添加品牌信息";
      this.dialogFormVisible = true;
      this.tmMsg = {
        logoUrl: "",
        tmName: "",
      };
    },
    // 上传成功后的回调
    handleAvatarSuccess(res, file) {
      // res参数返回上传图片成功后，图片在服务器的真实地址，
      this.tmMsg.logoUrl = res.data;
    },
    // 确认添加前的回调，对上传图片的校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 点击确认按钮就向服务器发请求
    submitAddOrModifyTradeMark(tmMsg) {
      // 先验证表单，验证通过才发送请求哦
      this.$refs.tmMsg.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.tradeMark.reqaddOrModifyTradeMark(
            this.tmMsg
          );
          console.log(this.tmMsg);
          if (result.code == 200) {
            // 弹出msg框
            this.$message({
              message: this.tmMsg.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            // 重新渲染页面
            // 判断是添加还是修改操作，如果是添加就渲染第一页的数据，如果是修改就留在当前页
            this.getTradeList(
              this.addOrUpdatetip == "修改品牌信息"
                ? this.page
                : (this.page = 1)
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击修改弹出修改框，把这条数据传过来
    modifyTradeMark(row) {
      this.dialogFormVisible = true;
      this.addOrUpdatetip = "修改品牌信息";
      // console.log(row);
      // this.tmMsg.logoUrl = row.logoUrl;
      // this.tmMsg.id = row.id;
      // this.tmMsg.tmName = row.tmName;
      // 不要直接用row赋值给this.tmMsg，就变成了完全覆盖，成深拷贝了，只需要把里面的数据替换掉就行
      this.tmMsg.logoUrl = row.logoUrl;
      this.tmMsg.id = row.id;
      this.tmMsg.tmName = row.tmName;
    },
    deleteTradeMark(row) {
      this.$confirm(`是否确认删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 在点击确认后发起删除的请求
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTradeList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
  
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>