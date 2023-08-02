import request from "@/utils/request";
// 获取菜单

export const reqMenuList = () => {
  return request({
    url: "/admin/acl/permission",
    method: "get",
  });
};

// 递归删除菜单
export const reqDeleteMenu = (id) => {
  return request({
    url: `/admin/acl/permission/remove/${id}`,
    method: "delete",
  });
};

// 新增菜单
// POST / admin / acl / permission / save;

export const reqAddMenu = (data) => {
  return request({
    url: "/admin/acl/permission/save",
    method: "post",
    data,
  });
};
