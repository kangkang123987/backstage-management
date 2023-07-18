// 引入封装的request函数
import request from "@/utils/request";
export const reqTradeList = (page, limit) => {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });
};
// 添加\修改品牌接口,
export const reqaddOrModifyTradeMark = (data) => {
  if (data.id) {
    return request({
      url: "/admin/product/baseTrademark/update",
      data,
      method: "put",
    });
  } else {
    return request({
      url: "/admin/product/baseTrademark/save",
      data,
      method: "post",
    });
  }
};
// 删除品牌的接口
export const reqDeleteTradeMark = (id) => {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete",
  });
};
