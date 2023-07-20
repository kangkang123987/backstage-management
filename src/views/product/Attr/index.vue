<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getcategoryId="getcategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 品牌属性的展示的盒子 -->
      <div v-show="isShowTable">
        <el-button
          :disabled="!category3Id"
          type="primary"
          icon="el-icon-puls"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table border style="margin: 20px 0" :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="300"
            prop="attrName"
          ></el-table-column>
          <el-table-column
            label="属性值列表"
            width="width"
            :data="attrList.attrValueList"
          >
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 0 5px"
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="small"
                @click="updateAttr(row)"
                >修改</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加/修改属性的盒子 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" v-model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="!attrInfo.attrName"
          type="primary"
          icon="el-icon-plus"
          @click="addAttrInfo"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table border style="margin: 25px 0" :data="attrInfo.attrValueList">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          ></el-table-column>

          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.flag"
                @blur="isShowInput(row)"
                placeholder="请输入属性值"
                size="small"
                v-model="row.valueName"
                @keyup.native.enter="isShowInput(row, $index)"
                :ref="$index"
              ></el-input>
              <span
                style="display: block"
                v-else
                @click="isShowSpan(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                confirm-button-text="删除吧"
                cancel-button-text="不用了"
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttr($index)"
              >
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  slot="reference"
                  >删除</el-button
                ></el-popconfirm
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      isShowTable: true,
      attrList: [],
      // 存储要发给服务器的参数,要进行新增的携带参数
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          {
            attrId: 0, //属性名的id
            valueName: "", //属性值名称
          },
        ],
        categoryId: 0,
        categoryLevel: 0,
      },
    };
  },
  methods: {
    // 子传父的回调，把三级的id传过来
    getcategoryId({ categoryId, level }) {
      if (level === 1) {
        (this.category2Id = ""), (this.category3Id = "");
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getInfoList();
      }
    },
    // 拿着三级的id，发请求
    async getInfoList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.Attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 点击新增属性值，要把属性名的id给到属性值身上，因为以后要向后台发数据请求修改
    addAttrInfo() {
      // 往数组里面push数据，里面带这两个参数
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        // 添加一个flag标识来控制当前是显示input还是span
        flag: true,
      });
      // 点击添加默认让input自动获取焦点（数组的最后一项，长度-1）
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 点击添加属性按钮时，清空之前新增的属性信息
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 0,
      };
    },
    // 点击修改属性按钮时，清空之前修改的属性信息
    updateAttr(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      // 给每一个对象上添加一个flag标记用于input和span的显示和隐藏
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
      // 收到当前点击的row，即为每一条属性名+对应的属性值
      // console.log(row);
      // 因为数据结构比较复杂所以需要深拷贝，把row里面需要展示的元素深拷贝给attrInfo里面的元素，而不能直接赋值
    },
    // 光标离开input，把flag设置为false，隐藏，显示span
    isShowInput(row, index) {
      if (row.valueName.trim() == "") {
        this.$message("请不要输入空值");
        return;
      }
      // 如果不是空值那就正常变为查看模式出现span
      row.flag = false;
    },
    // 点击span后换为编辑模式，同时也要让渲染好的input自动获取焦点
    isShowSpan(row, index) {
      row.flag = true;
      // 自动获取input焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    // 删除添加修改的属性值
    deleteAttr(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },

    // 保存新增和修改的数据，过滤掉空值，去掉参数中的flag属性，整理参数发送请求到后台，弹出保存成功框，品牌列表页展示，重新渲染列表
    async saveAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName !== "") {
            delete item.flag;
            return true;
          }
        }
      );
      let result = await this.$API.Attr.reqAddOrUpdateInfo(this.attrInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功啦" });
        this.getInfoList();
        this.isShowTable = true;
      } else {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>