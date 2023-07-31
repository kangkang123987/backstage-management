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
