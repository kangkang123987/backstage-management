import request from "@/utils/request";
// 写三联分类选项卡的接口
export const reqCategory1List = () => {
  return request({
    url: "/admin/product/getCategory1",
    method: "get",
  });
};

export const reqCategory2List = (category1Id) => {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: "get",
  });
};

export const reqCategory3List = (category2Id) => {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: "get",
  });
};
// 写平台属性的接口
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });
};

// 添加属性的操作
export const reqAddOrUpdateInfo = (data) => {
  return request({
    url: "/admin/product/saveAttrInfo",
    method: "post",
    data,
  });
};
// 删除attr
export const reqDeleteAttr = (attrId) => {
  return request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: "delete",
  });
};
