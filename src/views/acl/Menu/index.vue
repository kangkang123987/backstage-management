<template>
  <div>
    <el-table
      :data="menuList.children"
      style="width: 100%"
      row-key="id"
      :expand-row-keys="expandKeys"
      border
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="名称" width="390" prop="name"> </el-table-column>
      <el-table-column label="权限值" width="390" prop="code">
      </el-table-column>
      <el-table-column label="跳转权限值"> </el-table-column>
      <el-table-column label="操作" width="340">
        <template slot-scope="{ row }">
          <el-tooltip
            :content="row.level === 4 ? '添加功能' : '添加菜单'"
            placement="top"
            effect="light"
          >
            <el-button
              @click="openDialog(row)"
              type="primary"
              icon="el-icon-plus"
              size="small"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="row.level === 4 ? '编辑功能' : '编辑菜单'"
            placement="top"
            effect="light"
          >
            <el-button
              @click="openDialog(row)"
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="row.level === 4 ? '删除功能' : '删除菜单'"
            placement="top"
            effect="light"
          >
            <el-button
              @click="deleteMenu(row)"
              type="danger"
              icon="el-icon-delete"
              size="small"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="addDialogTitle"
      :visible.sync="addOrUpdateDialog"
      :show-close="false"
    >
      <el-form
        :model="item"
        :rules="rules"
        label-width="120px"
        ref="permission"
      >
        <el-form-item label="父级名称">
          <el-input v-model="item.name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="cname">
          <el-input v-model="item.children.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="item.children.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转路由权限值">
          <el-input
            v-model="item.children.tocode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      menuList: {},
      // 自动展开的数组:
      expandKeys: [],
      addDialogTitle: "",
      updateDialogTitle: "",
      // 要新增的菜单数据
      item: {
        name: "",
        level: 0,
        children: {
          name: "",
          id: "",
          level: 0,
          code: "",
          tocode: "",
        },
      },
      addOrUpdateDialog: false,
      rules: {
        cname: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入权限值", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      let result = await this.$API.Menu.reqMenuList();
      console.log(result);
      if (result.code == 20000) {
        this.menuList = result.data;
        this.expandKeys = result.data.children[0].children;
      }
    },
    // 删除菜单
    async deleteMenu(row) {
      let result = await this.$API.Menu.reqDeleteMenu(row.id);
      if (result.code == 20000) {
        this.$message({ type: "success", message: "删除菜单成功" });
        this.getMenuList();
      }
    },
    // 打开添加的dialog,动态设置title
    openDialog(row) {
      console.log(row);
      this.addOrUpdateDialog = true;
      this.item.name = row.name;
      this.item.level = row.level;
      this.addDialogTitle = this.item.level == 4 ? "添加功能" : "添加菜单";
    },

    // 发请求添加菜单或功能,校验填写的字段
    add() {
      this.$refs.permission.validate(async (valid) => {
        if (valid) {
          let result = await this.$API.Menu.reqAddMenu(this.item.children);
          this.addOrUpdateDialog = false;
          this.getMenuList();
        }
      });
    },
    cancel() {
      this.item.children = {};
      this.addOrUpdateDialog = false;
    },
    // 打开修改的dialog,动态设置title
    // openDialog(row) {
    //   console.log(row);
    //   this.addOrUpdateDialog = true;
    //   this.item.children = { ...row };
    //   this.item.name = row.name;
    //   this.item.level = row.level;
    //   if (this.item.children.id) {
    //     this.dialogTitle = this.item.level == 4 ? "编辑功能" : "编辑菜单";
    //   } else {
    //     this.dialogTitle = this.item.level == 4 ? "添加功能" : "添加菜单";
    //   }
    // },
  },
};
</script>

<style>
</style>
