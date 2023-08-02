<template>
  <div>
    <div v-if="roleMenu.length > 0">
      <el-tree
        style="margin: 20px 0"
        ref="tree"
        :data="roleMenu"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        default-expand-all
      >
      </el-tree>
      <el-button>取消</el-button>
      <el-button type="primary">保存</el-button>
    </div>

    <div v-else>
      <el-form inline>
        <el-form-item label="">
          <el-input placeholder="角色名称" v-model="searchRoleName"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="searchRole"
            >搜索</el-button
          >
          <el-button @click="clearSearch"> 清空</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="openAddDialog"
        >添加</el-button
      >
      <el-button
        icon="el-icon-delete"
        type="danger"
        @click="deleteCheckedRole"
        :disabled="checkRoleId.length < 1"
        >批量删除</el-button
      >
      <el-table
        stripe
        border
        style="margin-top: 20px; width: 60%"
        :data="roleList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label=""
          type="selection"
          align="center"
        ></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column label="角色名称" width="600px">
          <template slot-scope="{ row }">
            <template v-if="row.flag === 1">
              <el-input
                v-model="row.roleName"
                style="width: 60%; margin-right: 5px"
              ></el-input>
              <el-button
                type="success"
                icon="el-icon-check"
                @click="updateEdit(row)"
                >确认</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-refresh"
                @click="cancelEdit(row)"
                >取消</el-button
              >
            </template>
            <span v-else>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-tooltip content="查看角色菜单" effect="light" placement="top">
              <el-button
                type="info"
                icon="el-icon-user"
                size="small"
                @click="goRoleMenu(row)"
              ></el-button
            ></el-tooltip>
            <el-tooltip content="编辑角色" effect="light" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="editRole(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除角色" effect="light" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteRole(row)"
              ></el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px"
        align="right"
        :page-size="limit"
        layout="prev, pager, next, jumper,->,total"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

      <el-dialog title="添加角色" :visible.sync="addDialog" width="20%">
        <span>请输入新名称:</span>
        <el-input
          v-model="newRoleList.roleName"
          style="margin-top: 20px"
        ></el-input>
        <div style="margin-top: 20px; text-align: right">
          <el-button @click="cancelAddRole">取消</el-button>
          <el-button type="primary" @click="addRole">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      page: 1,
      limit: 6,
      total: 2,
      searchRoleName: "",
      checkRoleId: [],
      roleList: [],
      newRoleList: {
        roleName: "",
        flag: 0,
      },
      addDialog: false,
      roleMenu: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { page, limit } = this;
      let result = await this.$API.Role.reqRoleList(page, limit);
      if (result.code == 20000) {
        this.roleList = result.data.items;
        this.total = result.data.total;
        this.roleList.map((item) => {
          item.originRoleName = item.roleName;
          return item;
        });
      }
    },
    // 改变当前页
    handleCurrentChange(pager) {
      this.page = pager;
      this.getRoleList();
    },
    // 新增角色信息
    openAddDialog() {
      this.addDialog = true;
    },
    // 搜索角色信息
    async searchRole() {
      let searchobj = {};
      searchobj.page = this.page;
      searchobj.limit = this.limit;
      searchobj.roleName = this.searchRoleName;
      let result = await this.$API.Role.reqSearchRole(searchobj);
      if (result.code == 20000) {
        this.roleList = result.data.items;
      }
    },
    // 清空搜索内容，重新渲染页面
    clearSearch() {
      this.searchRoleName = "";
      this.getRoleList();
    },
    // 增加角色信息
    async addRole() {
      try {
        let result = await this.$API.Role.reqAddRole(this.newRoleList);
        if (result.code == 20000) {
          this.getRoleList((this.page = 1));
          this.$message({ type: "success", message: "添加角色成功" });
          this.addDialog = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 取消添加，清除数据
    cancelAddRole() {
      this.addDialog = false;
      this.$message({ type: "info", message: "已取消添加" });
      this.newRoleList = {};
    },
    // 删除角色
    async deleteRole(row) {
      this.$confirm(`是否确认删除${row.roleName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.Role.reqDeleteRole(row.id);
          if (result.code == 20000) {
            this.$message({ type: "success", message: "删除成功" });
            this.getRoleList();
          }
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    // 编辑角色,给角色添加flag的标识,用于input和span的切换
    editRole(row) {
      this.$set(row, "flag", 1);
    },
    // 取消更新角色,// 取消意味着要用以前缓存下来的旧数据
    cancelEdit(row) {
      row.flag = 0;
      row.roleName = row.originRoleName;
    },
    // 发请求修改角色数据
    async updateEdit(row) {
      delete row.flag;
      delete row.originRoleName;
      let result = await this.$API.Role.updateRole(row);
      if (result.code == 20000) {
        this.$set(row, "flag", 0);
        this.$message({ type: "success", message: "更新角色成功" });
        this.getRoleList();
      }
    },
    //  整理被勾选的roleid，批量删除//获取每一个变更了勾选状态的角色信息,
    handleSelectionChange(role) {
      this.checkRoleId = role.map((item) => item.id);
    },
    // 发请求批量删除选中的角色信息 // 删除被选中的角色,
    deleteCheckedRole() {
      this.$confirm(`是否确认删除批量删除这些角色信息?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.Role.reqDeleteRoles(this.checkRoleId);
          if (result.code == 20000) {
            this.getRoleList();
            this.$message({ type: "success", message: "批量删除成功" });
          }
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消批量删除" });
          this.getRoleList();
        });
    },
    async goRoleMenu(row) {
      let result = await this.$API.Role.reqMenuByRoleId(row.id);
      if (result.code == 20000) {
        this.roleMenu = result.data.children;
      }
    },
    // 获取选中的权限id
  },
};
</script>

<style>
</style>