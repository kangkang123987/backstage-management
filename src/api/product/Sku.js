import request from "@/utils/request";
// 获取sku列表的接口
export const reqSkuList = (page, limit) => {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: "get",
  });
};

// sku上架的接口
export const reqOnSale = (skuId) => {
  return request({
    url: `/admin/product/onSale/${skuId}`,
    method: "get",
  });
};

// sku下架的接口
export const reqCancelSale = (skuId) => {
  return request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: "get",
  });
};
// 获取sku抽屉数据
export const reqSkuDrawer = (skuId) => {
  return request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: "get",
  });
};

// 删除接口
export const reqDeleteSku = (skuId) => {
  return request({
    url: `/admin/product/deleteSku/${skuId}`,
    method: "delete",
  });
};
