import request from "@/utils/request";
// 获取角色分页列表
export const reqRoleList = (page, limit) => {
  return request({
    url: `/admin/acl/role/${page}/${limit}`,
    method: "get",
  });
};

// 添加角色
export const reqAddRole = (data) => {
  return request({
    url: "/admin/acl/role/save",
    method: "post",
    data,
  });
};
// 删除角色
export const reqDeleteRole = (id) => {
  return request({
    url: `/admin/acl/role/remove/${id}`,
    method: "delete",
  });
};

// 批量删除多个角色
export const reqDeleteRoles = (idList) => {
  return request({
    url: "/admin/acl/role/batchRemove",
    method: "post",
    data: idList,
  });
};

// 修改角色
export const updateRole = (data) => {
  return request({
    url: "/admin/acl/role/update",
    method: "put",
    data,
  });
};

// 搜索角色信息
export const reqSearchRole = (data) => {
  return request({
    url: `/admin/acl/role/${data.page}/${data.limit}`,
    method: "get",
    params: data,
  });
};

// 根据角色获取所有菜单
export const reqMenuByRoleId = (roleId) => {
  return request({
    url: `/admin/acl/permission/toAssign/${roleId}`,
    method: "get",
  });
};

// 给角色分配权限
// POST / admin / acl / permission / doAssign;
export const reqAssignPermission = (data) => {
  return request({
    url: "/admin/acl/permission/doAssign",
    method: "post",
    data,
  });
};
