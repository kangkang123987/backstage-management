<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryId.category1Id"
          @change="handel1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="show"
          placeholder="请选择"
          v-model="categoryId.category2Id"
          @change="handel2"
        >
          <el-option
            :value="c2.id"
            :label="c2.name"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="show"
          placeholder="请选择"
          v-model="categoryId.category3Id"
          @change="handel3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  // 父组件给子组件传过来的方法
  props: ["show"],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      categoryId: {
        // 与上面的form表单绑定，存储获取的id
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1();
  },
  methods: {
    async getCategory1() {
      // 发起获取一级分类的请求
      let result = await this.$API.Attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    // 当一级分类里面的内容改变时，就拿着获取到的一级分类id，去发起获取二级分类的请求
    async handel1() {
      // 先把仓库里的category1Id解构出来
      this.list2 = [];
      this.list3 = [];
      this.categoryId.category2Id = "";
      this.categoryId.category3Id = "";
      const { category1Id } = this.categoryId;
      this.$emit("getcategoryId", { categoryId: category1Id, level: 1 });
      //   发起请求
      let result = await this.$API.Attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 当二级分类的数据更改后，就发起获取三级分类的请求
    async handel2() {
      this.list3 = [];
      this.categoryId.category3Id = "";
      const { category2Id } = this.categoryId;
      this.$emit("getcategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.Attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    // 当三级分类的数据更改后
    handel3() {
      const { category3Id } = this.categoryId;

      //   由于父组件要对服务器发起请求获取详细商品列表，所以要把id传过去
      this.$emit("getcategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>