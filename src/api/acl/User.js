import request from "@/utils/request";
// 获取管理用户分页列表的接口
export const reqUserList = (page, limit) => {
  return request({
    url: `/admin/acl/user/${page}/${limit}`,
    method: "get",
  });
};
// 删除管理用户的接口
export const reqDeleteUser = (id) => {
  return request({
    url: `/admin/acl/user/remove/${id}`,
    method: "delete",
  });
};

// 批量删除管理用户的信息
export const reqDeleteUsers = (ids) => {
  return request({
    url: "/admin/acl/user/batchRemove",
    method: "post",
    data: ids,
  });
};

// 添加管理用户的信息的接口
export const reqAddUserInfo = (userlist) => {
  return request({
    url: "/admin/acl/user/save",
    method: "post",
    data: userlist,
  });
};
// 获取管理用户的信息
export const reqGetUserInfo = (id) => {
  return request({
    url: `/admin/acl/user/get/${id}`,
    method: "get",
  });
};

// 修改管理用户信息
export const reqUpdateUser = async (data) => {
  return request({
    url: "/admin/acl/user/update",
    method: "put",
    data,
  });
};

// 根据用户id获取角色数据
export const reqRoleById = (userId) => {
  return request({
    url: `admin/acl/user/toAssign/${userId}`,
    method: "get",
  });
};

// 给用户添加新角色
// /admin/acl/user/doAssign post
export const reqAssignRole = (userId, roleId) => {
  return request({
    url: "/admin/acl/user/doAssign",
    method: "post",
    params: {
      userId,
      roleId,
    },
  });
};

// 搜索用户信息
export const reqSearchUser = (data) => {
  return request({
    url: `/admin/acl/user/${data.page}/${data.limit}`,
    method: "get",
    params: data,
  });
};
