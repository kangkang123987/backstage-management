<template>
  <div>
    <el-form inline>
      <el-form-item label="">
        <el-input placeholder="用户名" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button> 清空</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" icon="el-icon-plus" @click="openAddDiaLog"
      >添加</el-button
    >
    <el-button
      icon="el-icon-delete"
      type="danger"
      @click="deleteUsers"
      :disabled="checkedUser.length < 1"
      >批量删除</el-button
    >
    <!-- 呈现管理用户信息的表格 -->
    <el-table
      border
      style="margin-top: 20px"
      :data="items"
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
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="用户昵称" prop="nickName"></el-table-column>
      <el-table-column label="权限列表" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" prop="gmtCreate"></el-table-column>
      <el-table-column label="更新时间" prop="gmtModified"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-tooltip content="添加/修改权限" effect="light" placement="top">
            <el-button
              type="info"
              icon="el-icon-user"
              size="small"
              @click="openSetRoleDialog(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="编辑用户" effect="light" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="openUpdateDialog(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除用户" effect="light" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteUser(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px"
      align="right"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total"
      :total="total"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 添加用户的弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog" width="30%">
      <el-form label-width="80px">
        <el-form-item label="用户名:">
          <el-input autocomplete="off" v-model="userlist.username" />
        </el-form-item>
        <el-form-item label="用户昵称:">
          <el-input autocomplete="off" v-model="userlist.nickName" />
        </el-form-item>
        <el-form-item label="用户密码:">
          <el-input autocomplete="off" v-model="userlist.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 给用户设置角色的弹出框 -->
    <el-dialog title="设置角色" :visible.sync="setDialog" width="40%">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input
            disabled
            autocomplete="off"
            ref="inputname"
            v-model="item.username"
          />
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            @change="handleCheckAllChange"
            :indeterminate="isIndeterminate"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedRoles"
            @change="handleCheckedRoles"
          >
            <el-checkbox
              v-for="(role, index) in allRolesList"
              :label="role.id"
              :key="role.id"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSet">取 消</el-button>
        <el-button type="primary" @click="addUserRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息的弹出框 -->
    <el-dialog title="修改用户" :visible.sync="updateDialog" width="30%">
      <el-form label-width="80px">
        <el-form-item label="用户名:">
          <el-input autocomplete="off" v-model="item.username" />
        </el-form-item>
        <el-form-item label="用户昵称:">
          <el-input autocomplete="off" v-model="item.nickName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      page: 1,
      limit: 7,
      total: 5,
      // 全部角色信息
      allRolesList: [],
      // 当前用户的角色信息
      assignRoles: [],
      // 服务器返回当前管理用户的数据
      item: {},
      items: [],
      // 向服务器发送要添加的管理用户信息
      userlist: {
        username: "",
        nickName: "",
        password: "",
      },
      // 是否显示添加用户信息和添加角色的dialog框
      addDialog: false,
      setDialog: false,
      updateDialog: false,
      // 要添加的已选中的角色
      checkAll: false,
      checkedRoles: [],
      isIndeterminate: true,
      checkedUser: [],
    };
  },
  mounted() {
    // 发请求获取管理用户的列表
    this.getUserList();
  },
  methods: {
    // 获取管理用户的列表
    async getUserList() {
      let result = await this.$API.User.reqUserList(this.page, this.limit);
      if ((result.code = 20000)) {
        this.total = result.data.total;
        this.items = result.data.items;
      }
    },
    // 改变页码后重新渲染列表数据
    handleCurrentChange(pager = 1) {
      this.page = pager;
      this.getUserList();
    },
    // 删除用户数据
    async deleteUser(row) {
      this.$confirm(`是否确认删除${row.username}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.User.reqDeleteUser(row.id);
          if (result.code == 20000) {
            this.$message({ type: "success", message: "删除成功" });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    handleSelectionChange(user) {
      this.checkedUser = user.map((item) => item.id);
    },
    // 批量删除用户数据
    deleteUsers() {
      this.$confirm(`是否确认批量删除这些用户数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.User.reqDeleteUsers(this.checkedUser);
          if (result.code == 20000) {
            this.$message({ type: "success", message: "批量删除用户成功" });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消批量删除" });
          this.getUserList();
        });
    },
    // 打开新增管理用户的对话框
    openAddDiaLog() {
      this.addDialog = true;
    },
    // 点击确认按钮后发请求，将要添加管理用户的信息传给服务器
    async addUserInfo() {
      this.dialogFormVisible = false;
      // 发请求新增用户数据
      let result = await this.$API.User.reqAddUserInfo(this.userlist);
      if (result.code == 20000) {
        this.$message({ type: "success", message: "添加成功啦" });
        this.addDialog = false;
        this.userlist = {};
        this.getUserList((this.page = 1));
      }
    },
    // 点击全选框后往已被选择的数组中追加
    handleCheckAllChange(val) {
      this.checkedRoles = val ? this.allRolesList.map((item) => item.id) : [];
      this.isIndeterminate = false;
    },
    // 每一个复选框
    handleCheckedRoles(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allRolesList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allRolesList.length;
    },
    // 打开新增用户角色的对话框
    openSetRoleDialog(row) {
      this.setDialog = true;
      // 要获取该管理用户的信息和所有的角色信息，要发两个请求
      this.getRoles(row);
      this.getUserInfo(row);
    },
    // 获取用户角色信息
    async getRoles(row) {
      let result = await this.$API.User.reqRoleById(row.id);
      if (result.code == 20000) {
        this.allRolesList = result.data.allRolesList;
        this.assignRoles = result.data.assignRoles;
        this.checkedRoles = this.assignRoles.map((item) => item.id);
      }
    },
    // 给该用户添加角色发请求
    async addUserRole() {
      // 整理userId和roleId// 先把以前的内容清掉
      let roleId = this.checkedRoles.join(",");
      let userId = this.item.id;
      let result = await this.$API.User.reqAssignRole(userId, roleId);
      if (result.code == 20000) {
        this.$message({ type: "success", message: "添加管理用户成功" });
        this.setDialog = false;
        this.getUserList();
      }
    },
    // 取消添加角色信息。重置用户角色信息
    cancelSet() {
      this.$message({ type: "info", message: "已取消添加" });
      this.checkedRoles = [];
      this.allRolesList = [];
      this.setDialog = false;
      this.assignRoles = [];
      this.isIndeterminate = false;
      this.checkAll = false;
    },
    // 获取该管理用户的信息
    async getUserInfo(row) {
      let result = await this.$API.User.reqGetUserInfo(row.id);
      if (result.code == 20000) {
        this.item = result.data.item;
      }
    },
    // 打开修改用户的对话框
    openUpdateDialog(row) {
      this.updateDialog = true;
      this.userlist.username = row.username;
      this.userlist.nickName = row.nickName;
      this.getUserInfo(row);
    },
    // 修改用户信息，发请求
    async updateUserInfo() {
      console.log(this.item);
      let result = await this.$API.User.reqUpdateUser(this.item);
      if (result.code == 20000) {
        this.getUserList(this.page);
        this.$message({ type: "success", message: "修改用户信息成功" });
        this.updateDialog = false;
      }
    },
  },
};
</script>

<style>
</style>